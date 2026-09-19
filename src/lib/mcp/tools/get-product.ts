import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchProduct, toProductJson } from "../shopify";

export default defineTool({
  name: "get_product",
  title: "Get a Backri product",
  description:
    "Get one Backri product by its handle, including AED price, variants, stock status, images and its page URL.",
  inputSchema: {
    handle: z
      .string()
      .trim()
      .min(1)
      .describe("Product handle, as returned by list_products (the last part of the product URL)."),
    language: z
      .enum(["en", "ar"])
      .default("en")
      .describe("Language for the product title and description."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ handle, language }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to use the Backri tools.");
    let product;
    try {
      product = await fetchProduct(
        { handle, language: language === "ar" ? "AR" : "EN" },
        ctx.signal,
      );
    } catch (error) {
      throw new ToolError(`Could not read that product: ${(error as Error).message}`);
    }
    if (!product) throw new ToolError(`No Backri product found with the handle "${handle}".`);
    const item = toProductJson(product);
    return {
      content: [
        {
          type: "text",
          text: `${item.title}\n${item.currency} ${item.price}${item.inStock ? "" : " (out of stock)"}\n${item.description}\n${item.url}`,
        },
      ],
      structuredContent: { product: item },
    };
  },
});
