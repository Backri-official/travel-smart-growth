import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SHOPIFY_STORE_PERMANENT_DOMAIN, SHOPIFY_API_VERSION } from "@/lib/shopify";

export interface DashboardOrder {
  id: string;
  name: string;
  createdAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  total: string;
  currency: string;
  customerName: string | null;
  customerEmail: string | null;
  city: string | null;
  country: string | null;
  items: Array<{ title: string; quantity: number }>;
}

export interface OrdersResult {
  ok: boolean;
  error?: "unauthorized" | "not_configured" | "shopify_error";
  message?: string;
  orders?: DashboardOrder[];
  totals?: { count: number; revenue: number; currency: string };
}

const ORDERS_QUERY = `
  query DashboardOrders($first: Int!) {
    orders(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        name
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet { shopMoney { amount currencyCode } }
        customer { displayName email }
        shippingAddress { city country }
        lineItems(first: 10) { nodes { title quantity } }
      }
    }
  }
`;

export const getShopifyOrders = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ passcode: z.string().min(1), limit: z.number().min(1).max(100).optional() }).parse(data),
  )
  .handler(async ({ data }): Promise<OrdersResult> => {
    const passcode = process.env["BACKRI_DASHBOARD_PASSCODE"];
    const adminToken = process.env["SHOPIFY_ADMIN_API_TOKEN"];

    if (!passcode || !adminToken) {
      return {
        ok: false,
        error: "not_configured",
        message: "The dashboard is not connected to Shopify yet.",
      };
    }

    if (data.passcode !== passcode) {
      return { ok: false, error: "unauthorized", message: "Wrong passcode." };
    }

    const response = await fetch(
      `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({ query: ORDERS_QUERY, variables: { first: data.limit ?? 50 } }),
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        error: "shopify_error",
        message:
          response.status === 401 || response.status === 403
            ? "Shopify refused the request. The app needs the read_orders permission."
            : `Shopify returned status ${response.status}.`,
      };
    }

    const json = (await response.json()) as {
      errors?: Array<{ message: string }>;
      data?: {
        orders?: {
          nodes: Array<{
            id: string;
            name: string;
            createdAt: string;
            displayFinancialStatus: string | null;
            displayFulfillmentStatus: string | null;
            totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
            customer: { displayName: string | null; email: string | null } | null;
            shippingAddress: { city: string | null; country: string | null } | null;
            lineItems: { nodes: Array<{ title: string; quantity: number }> };
          }>;
        };
      };
    };

    if (json.errors?.length) {
      return {
        ok: false,
        error: "shopify_error",
        message: json.errors.map((e) => e.message).join(", "),
      };
    }

    const nodes = json.data?.orders?.nodes ?? [];
    const orders: DashboardOrder[] = nodes.map((n) => ({
      id: n.id,
      name: n.name,
      createdAt: n.createdAt,
      financialStatus: n.displayFinancialStatus,
      fulfillmentStatus: n.displayFulfillmentStatus,
      total: n.totalPriceSet.shopMoney.amount,
      currency: n.totalPriceSet.shopMoney.currencyCode,
      customerName: n.customer?.displayName ?? null,
      customerEmail: n.customer?.email ?? null,
      city: n.shippingAddress?.city ?? null,
      country: n.shippingAddress?.country ?? null,
      items: n.lineItems.nodes,
    }));

    const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);

    return {
      ok: true,
      orders,
      totals: {
        count: orders.length,
        revenue,
        currency: orders[0]?.currency ?? "AED",
      },
    };
  });
