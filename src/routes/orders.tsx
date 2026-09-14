import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getShopifyOrders, type OrdersResult } from "@/lib/orders.functions";
import { formatPrice } from "@/lib/shopify";

export const Route = createFileRoute("/orders")({
  component: OrdersDashboard,
  head: () => ({
    meta: [
      { title: "Backri orders dashboard" },
      { name: "description", content: "Private dashboard for tracking Backri customer orders." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Backri orders dashboard" },
      { property: "og:description", content: "Private dashboard for tracking Backri customer orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const PASSCODE_KEY = "backri-orders-passcode";

function OrdersDashboard() {
  const [passcode, setPasscode] = useState("");
  const fetchOrders = useServerFn(getShopifyOrders);

  const mutation = useMutation<OrdersResult, Error, string>({
    mutationFn: (code: string) => fetchOrders({ data: { passcode: code, limit: 50 } }),
    onSuccess: (result, code) => {
      if (result.ok) sessionStorage.setItem(PASSCODE_KEY, code);
    },
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(PASSCODE_KEY);
    if (saved) {
      setPasscode(saved);
      mutation.mutate(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = mutation.data;
  const orders = result?.ok ? (result.orders ?? []) : [];

  if (!result?.ok) {
    return (
      <main className="mx-auto max-w-md px-4 py-24">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the dashboard passcode to see your Shopify orders.
        </p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(passcode);
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
            disabled={mutation.isPending || passcode.length === 0}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {mutation.isPending ? "Checking…" : "Open dashboard"}
          </button>
        </form>
        {result?.message ? (
          <p className="mt-4 text-sm text-destructive">{result.message}</p>
        ) : null}
        {mutation.isError ? (
          <p className="mt-4 text-sm text-destructive">Could not reach Shopify. Try again.</p>
        ) : null}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-foreground">
            Backri
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">Orders</h1>
        </div>
        <button
          onClick={() => mutation.mutate(passcode)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          {mutation.isPending ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-2xl font-bold mt-1">{result.totals?.count ?? 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold mt-1">
            {formatPrice(String(result.totals?.revenue ?? 0), result.totals?.currency ?? "AED")}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Average order</p>
          <p className="text-2xl font-bold mt-1">
            {formatPrice(
              String(
                result.totals && result.totals.count > 0
                  ? result.totals.revenue / result.totals.count
                  : 0,
              ),
              result.totals?.currency ?? "AED",
            )}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed p-16 text-center">
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Every order placed in your store will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Delivery</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t align-top">
                  <td className="px-4 py-4 font-medium whitespace-nowrap">{order.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-AE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <p>{order.customerName ?? "Guest"}</p>
                    {order.customerEmail ? (
                      <p className="text-muted-foreground text-xs mt-1">{order.customerEmail}</p>
                    ) : null}
                    {order.city || order.country ? (
                      <p className="text-muted-foreground text-xs mt-1">
                        {[order.city, order.country].filter(Boolean).join(", ")}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <ul className="space-y-1">
                      {order.items.map((item, i) => (
                        <li key={i} className="text-muted-foreground">
                          {item.quantity} × {item.title}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{order.financialStatus ?? "—"}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{order.fulfillmentStatus ?? "—"}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap font-medium">
                    {formatPrice(order.total, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
