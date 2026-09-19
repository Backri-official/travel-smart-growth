// Self-contained Shopify Storefront access for MCP tools.
// Kept separate from src/lib/shopify.ts so no browser-only code (toasts) is
// pulled into the MCP server bundle. No env reads at module top level.

const STORE_DOMAIN = "z9sfnq-ih.myshopify.com";
const API_VERSION = "2025-07";
const STOREFRONT_TOKEN = "d9ceabbbbe7a47c89426e97e377e3557";

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  productType
  tags
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        quantityAvailable
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
`;

const PRODUCTS_QUERY = `
  query McpProducts($first: Int!, $query: String, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    products(first: $first, query: $query) { edges { node { ${PRODUCT_FIELDS} } } }
  }
`;

const PRODUCT_QUERY = `
  query McpProduct($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string | null;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } } | null;
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
}

async function storefront<T>(
  query: string,
  variables: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Shopify request failed (${response.status}): ${text.slice(0, 300)}`);
  }
  const payload = JSON.parse(text) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) {
    throw new Error(`Shopify error: ${payload.errors.map((e) => e.message).join(", ")}`);
  }
  if (!payload.data) throw new Error("Shopify returned no data");
  return payload.data;
}

function localeVariables(language: "EN" | "AR") {
  return { language, country: "AE" };
}

export async function fetchProducts(
  { first, query, language }: { first: number; query?: string; language: "EN" | "AR" },
  signal?: AbortSignal,
): Promise<ShopifyProductNode[]> {
  const data = await storefront<{ products: { edges: Array<{ node: ShopifyProductNode }> } }>(
    PRODUCTS_QUERY,
    { first, query: query ?? null, ...localeVariables(language) },
    signal,
  );
  return data.products.edges.map((edge) => edge.node);
}

export async function fetchProduct(
  { handle, language }: { handle: string; language: "EN" | "AR" },
  signal?: AbortSignal,
): Promise<ShopifyProductNode | null> {
  const data = await storefront<{ product: ShopifyProductNode | null }>(
    PRODUCT_QUERY,
    { handle, ...localeVariables(language) },
    signal,
  );
  return data.product;
}

export function toProductJson(node: ShopifyProductNode) {
  const variants = node.variants.edges.map(({ node: variant }) => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    quantityAvailable: variant.quantityAvailable ?? null,
    price: variant.price.amount,
    currency: variant.price.currencyCode,
    compareAtPrice: variant.compareAtPrice?.amount ?? null,
    options: variant.selectedOptions.map(({ name, value }) => ({ name, value })),
  }));

  return {
    handle: node.handle,
    title: node.title,
    description: node.description,
    productType: node.productType ?? null,
    tags: node.tags.map((tag) => tag),
    price: node.priceRange.minVariantPrice.amount,
    currency: node.priceRange.minVariantPrice.currencyCode,
    compareAtPrice: node.compareAtPriceRange?.minVariantPrice.amount ?? null,
    inStock: variants.some((variant) => variant.availableForSale),
    images: node.images.edges.map(({ node: image }) => ({
      url: image.url,
      altText: image.altText ?? null,
    })),
    variants,
    url: `https://travel-smart-growth.lovable.app/product/${node.handle}`,
  };
}
