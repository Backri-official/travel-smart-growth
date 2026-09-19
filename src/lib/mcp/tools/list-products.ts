import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchProducts, toProductJson } from "../shopify";

export default defineTool({
  name: "list_products",
  title: "List Backri products",
  description:
    "List products in the Backri store with AED prices, stock status and images. Optionally filter by a search term and choose English or Arabic product text.",
  inputSchema: {
    search: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe("Optional keyword to filter products, e.g. 'passport' or 'luggage'."),
    language: z
      .enum(["en", "ar"])
      .default("en")
      .describe("Language for product titles and descriptions."),
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum products to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ search, language, limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to use the Backri tools.");
    let products;
    try {
      products = await fetchProducts(
        { first: limit, query: search, language: language === "ar" ? "AR" : "EN" },
        ctx.signal,
      );
    } catch (error) {
      throw new ToolError(`Could not read the Backri catalogue: ${(error as Error).message}`);
    }
    const items = products.map(toProductJson);
    const summary = items.length
      ? items
          .map(
            (item) =>
              `${item.title} — ${item.currency} ${item.price}${item.inStock ? "" : " (out of stock)"} — ${item.url}`,
          )
          .join("\n")
      : "No products matched.";
    return {
      content: [{ type: "text", text: summary }],
      structuredContent: { products: items },
    };
  },
});
