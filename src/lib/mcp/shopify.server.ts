import { SHOPIFY_API_VERSION, SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";

const STOREFRONT_TOKEN = "d9ceabbbbe7a47c89426e97e377e3557";

export async function storefront<T>(query: string, variables: Record<string, unknown>, signal?: AbortSignal) {
  const res = await fetch(
    `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      signal,
    },
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`Shopify storefront request failed [${res.status}]: ${text}`);
  const json = JSON.parse(text) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
  if (!json.data) throw new Error("Shopify returned no data");
  return json.data;
}

export async function admin<T>(query: string, variables: Record<string, unknown>, signal?: AbortSignal) {
  const token = process.env["SHOPIFY_ADMIN_API_TOKEN"];
  if (!token) throw new Error("The store's admin access is not configured yet.");
  const res = await fetch(
    `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
      signal,
    },
  );
  const text = await res.text();
  if (res.status === 401 || res.status === 403) {
    throw new Error("Shopify refused the request; the store app needs the read_orders permission.");
  }
  if (!res.ok) throw new Error(`Shopify admin request failed [${res.status}]: ${text}`);
  const json = JSON.parse(text) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
  if (!json.data) throw new Error("Shopify returned no data");
  return json.data;
}
