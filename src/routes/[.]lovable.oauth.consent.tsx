import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  authorization_id: z.string().optional(),
});

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: searchSchema,
  staticData: { sitemap: false },
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/login",
        search: { next: location.href },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Authorize access | Backri" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConsentPage,
});

function ConsentPage() {
  const { authorization_id: authorizationId } = Route.useSearch();
  const [clientName, setClientName] = useState<string | null>(null);
  const [scope, setScope] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorizationId) {
      setError("This authorization link is missing its request reference.");
      setLoading(false);
      return;
    }
    let active = true;
    void (async () => {
      const { data, error: detailsError } =
        await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError || !data) {
        setError(detailsError?.message ?? "This authorization request is no longer valid.");
        setLoading(false);
        return;
      }
      if ("redirect_url" in data) {
        window.location.assign(data.redirect_url);
        return;
      }
      setClientName(data.client.name ?? "An AI assistant");
      setScope(data.scope || null);
      setEmail(data.user.email);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    if (!authorizationId) return;
    setBusy(true);
    setError(null);
    const { data, error: decisionError } = approve
      ? await supabase.auth.oauth.approveAuthorization(authorizationId, {
          skipBrowserRedirect: true,
        })
      : await supabase.auth.oauth.denyAuthorization(authorizationId, {
          skipBrowserRedirect: true,
        });
    if (decisionError || !data) {
      setError(decisionError?.message ?? "We could not complete that. Try again.");
      setBusy(false);
      return;
    }
    window.location.assign(data.redirect_url);
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading the request…</p>
      ) : error ? (
        <>
          <h1 className="font-serif text-2xl text-foreground">Something went wrong</h1>
          <p className="mt-3 text-sm text-destructive">{error}</p>
        </>
      ) : (
        <>
          <h1 className="font-serif text-3xl text-foreground">Allow access?</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{clientName}</span> is asking to use the
            Backri tools as {email}. It can read the Backri product catalogue and travel journal.
          </p>
          {scope ? (
            <p className="mt-2 text-xs text-muted-foreground">Requested access: {scope}</p>
          ) : null}
          <div className="mt-8 flex gap-3">
            <Button
              className="flex-1"
              disabled={busy}
              aria-busy={busy}
              onClick={() => void decide(true)}
            >
              {busy ? "Please wait" : "Allow"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={() => void decide(false)}
            >
              Deny
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
