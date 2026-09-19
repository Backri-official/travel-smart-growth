import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listBackriProducts,
  createBackriProduct,
  updateBackriArabic,
  deleteBackriProduct,
  type AdminProduct,
  type AdminResult,
} from "@/lib/products.functions";
import { formatPrice } from "@/lib/shopify";

export const Route = createFileRoute("/admin")({
  staticData: { sitemap: false },
  component: AdminProducts,
  head: () => ({
    meta: [
      { title: "Backri product manager" },
      {
        name: "description",
        content: "Private page for adding Backri products with Arabic names and AED prices.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Backri product manager" },
      {
        property: "og:description",
        content: "Private page for adding Backri products with Arabic names and AED prices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const PASSCODE_KEY = "backri-orders-passcode";

const emptyForm = {
  title: "",
  description: "",
  titleAr: "",
  descriptionAr: "",
  price: "",
  compareAtPrice: "",
  productType: "",
  imageUrl: "",
};

function AdminProducts() {
  const [passcode, setPasscode] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [arabicEdits, setArabicEdits] = useState<
    Record<string, { titleAr: string; descriptionAr: string }>
  >({});

  const list = useServerFn(listBackriProducts);
  const create = useServerFn(createBackriProduct);
  const updateAr = useServerFn(updateBackriArabic);
  const remove = useServerFn(deleteBackriProduct);

  const listMutation = useMutation<AdminResult<AdminProduct[]>, Error, string>({
    mutationFn: (code: string) => list({ data: { passcode: code } }),
    onSuccess: (result, code) => {
      if (result.ok) sessionStorage.setItem(PASSCODE_KEY, code);
    },
  });

  const createMutation = useMutation({
    mutationFn: () => create({ data: { passcode, ...form } }),
    onSuccess: (result) => {
      if (result.ok) {
        toast.success(`${form.title} is now in your store`);
        setForm(emptyForm);
        listMutation.mutate(passcode);
      } else {
        toast.error(result.message ?? "Shopify refused the product.");
      }
    },
    onError: () => toast.error("Could not reach Shopify. Try again."),
  });

  const arMutation = useMutation({
    mutationFn: (productId: string) =>
      updateAr({
        data: {
          passcode,
          productId,
          titleAr: arabicEdits[productId]?.titleAr ?? "",
          descriptionAr: arabicEdits[productId]?.descriptionAr ?? "",
        },
      }),
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Arabic text saved");
        listMutation.mutate(passcode);
      } else {
        toast.error(result.message ?? "Shopify refused the Arabic text.");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => remove({ data: { passcode, productId } }),
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Product removed");
        listMutation.mutate(passcode);
      } else {
        toast.error(result.message ?? "Shopify refused to remove it.");
      }
    },
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(PASSCODE_KEY);
    if (saved) {
      setPasscode(saved);
      listMutation.mutate(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = listMutation.data;

  if (!result?.ok) {
    return (
      <main className="mx-auto max-w-md px-4 py-24">
        <h1 className="font-display text-3xl">Products</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the passcode to add and edit your Backri products.
        </p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            listMutation.mutate(passcode);
          }}
        >
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            aria-label="Dashboard passcode"
            className="w-full rounded-md border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={listMutation.isPending || passcode.length === 0}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {listMutation.isPending ? "Checking…" : "Open"}
          </button>
        </form>
        {result?.message ? (
          <p className="mt-4 text-sm text-destructive">{result.message}</p>
        ) : null}
        {listMutation.isError ? (
          <p className="mt-4 text-sm text-destructive">Could not reach Shopify. Try again.</p>
        ) : null}
      </main>
    );
  }

  const products = result.data ?? [];

  const field = (
    label: string,
    key: keyof typeof emptyForm,
    opts: { placeholder?: string; rtl?: boolean; textarea?: boolean } = {},
  ) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {opts.textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={opts.placeholder}
          dir={opts.rtl ? "rtl" : undefined}
          rows={3}
          className="mt-2 w-full rounded-md border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={opts.placeholder}
          dir={opts.rtl ? "rtl" : undefined}
          className="mt-2 w-full rounded-md border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      )}
    </label>
  );

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-foreground">
            Backri
          </p>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Products</h1>
        </div>
        <button
          onClick={() => listMutation.mutate(passcode)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          {listMutation.isPending ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <section className="mt-10 rounded-lg border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl">Add a product</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Saved straight to your Shopify store and shown on both the English and Arabic pages.
        </p>
        <form
          className="mt-6 grid gap-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          {field("Name (English)", "title", { placeholder: "Leather passport wallet" })}
          {field("Name (Arabic)", "titleAr", { placeholder: "محفظة جواز سفر جلدية", rtl: true })}
          {field("Price in AED", "price", { placeholder: "349" })}
          {field("Was price in AED (optional)", "compareAtPrice", { placeholder: "429" })}
          {field("Category (optional)", "productType", { placeholder: "Passport Wallets" })}
          {field("Photo link (optional)", "imageUrl", { placeholder: "https://…/photo.jpg" })}
          <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
            {field("Description (English)", "description", { textarea: true })}
            {field("Description (Arabic)", "descriptionAr", { textarea: true, rtl: true })}
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createMutation.isPending || !form.title || !form.price}
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {createMutation.isPending ? "Saving…" : "Add to my store"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">In your store ({products.length})</h2>
        {products.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
            No products yet. Add your first one above.
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {products.map((p) => {
              const edit = arabicEdits[p.id] ?? {
                titleAr: p.titleAr ?? "",
                descriptionAr: (p.descriptionAr ?? "").replace(/<[^>]*>/g, ""),
              };
              return (
                <li key={p.id} className="rounded-lg border bg-card p-5">
                  <div className="flex items-start gap-4">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        loading="lazy"
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-md bg-secondary" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{p.title}</p>
                      <p dir="rtl" className="text-sm text-muted-foreground mt-1">
                        {p.titleAr ?? "لا يوجد اسم عربي بعد"}
                      </p>
                      <p className="text-sm mt-2">
                        {p.price ? formatPrice(p.price, p.currency) : "No price"}
                        {p.compareAtPrice ? (
                          <span className="text-muted-foreground line-through ml-2">
                            {formatPrice(p.compareAtPrice, p.currency)}
                          </span>
                        ) : null}
                        <span className="text-muted-foreground ml-3 text-xs uppercase">
                          {p.status}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${p.title}" from your store?`)) {
                          deleteMutation.mutate(p.id);
                        }
                      }}
                      className="rounded-md border px-3 py-2 text-sm text-destructive hover:bg-secondary"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Arabic name
                      </span>
                      <input
                        dir="rtl"
                        value={edit.titleAr}
                        onChange={(e) =>
                          setArabicEdits({
                            ...arabicEdits,
                            [p.id]: { ...edit, titleAr: e.target.value },
                          })
                        }
                        className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Arabic description
                      </span>
                      <textarea
                        dir="rtl"
                        rows={2}
                        value={edit.descriptionAr}
                        onChange={(e) =>
                          setArabicEdits({
                            ...arabicEdits,
                            [p.id]: { ...edit, descriptionAr: e.target.value },
                          })
                        }
                        className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                      />
                    </label>
                    <div className="sm:col-span-2">
                      <button
                        onClick={() => arMutation.mutate(p.id)}
                        disabled={arMutation.isPending}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                      >
                        {arMutation.isPending ? "Saving…" : "Save Arabic text"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
