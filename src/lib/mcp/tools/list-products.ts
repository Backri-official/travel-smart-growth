import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { storefront } from "../shopify.server";

const QUERY = `
  query McpProducts($first: Int!, $query: String, $language: LanguageCode!)
  @inContext(language: $language, country: AE) {
    products(first: $first, query: $query) {
      edges {
        node {
          handle
          title
          description
          productType
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 10) { edges { node { title availableForSale } } }
        }
      }
    }
  }
`;

interface ProductsData {
  products: {
    edges: Array<{
      node: {
        handle: string;
        title: string;
        description: string;
        productType: string | null;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        variants: { edges: Array<{ node: { title: string; availableForSale: boolean } }> };
      };
    }>;
  };
}

export default defineTool({
  name: "list_products",
  title: "List Backri products",
  description:
    "List products in the Backri store with prices, availability and descriptions. Optionally filter by a search term and pick English or Arabic text.",
  inputSchema: {
    search: z.string().trim().optional().describe("Optional keyword to filter products by."),
    language: z.enum(["en", "ar"]).default("en").describe("Language for product titles and descriptions."),
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum number of products to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ search, language, limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to read the Backri catalogue.");
    let data: ProductsData;
    try {
      data = await storefront<ProductsData>(
        QUERY,
        { first: limit, query: search || null, language: language === "ar" ? "AR" : "EN" },
        ctx.signal,
      );
    } catch (error) {
      throw new ToolError(`Could not read the store catalogue: ${(error as Error).message}`);
    }

    const products = data.products.edges.map(({ node }) => ({
      handle: node.handle,
      title: node.title,
      description: node.description,
      category: node.productType ?? null,
      price: node.priceRange.minVariantPrice.amount,
      currency: node.priceRange.minVariantPrice.currencyCode,
      inStock: node.variants.edges.some((v) => v.node.availableForSale),
      url: `https://travel-smart-growth.lovable.app/product/${node.handle}`,
    }));

    const summary = products.length
      ? products
          .map((p) => `${p.title} — ${p.currency} ${p.price}${p.inStock ? "" : " (out of stock)"}`)
          .join("\n")
      : "No products matched.";

    return { content: [{ type: "text", text: summary }], structuredContent: { products } };
  },
});
