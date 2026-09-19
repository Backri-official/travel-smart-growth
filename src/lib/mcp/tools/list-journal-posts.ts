import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { arPosts, enPosts } from "@/content/posts";

const SITE_URL = "https://travel-smart-growth.lovable.app";

export default defineTool({
  name: "list_journal_posts",
  title: "List Backri journal posts",
  description:
    "List the Backri journal travel guides for UAE and GCC travellers, in English or Arabic, with their titles, summaries and URLs.",
  inputSchema: {
    language: z.enum(["en", "ar"]).default("en").describe("Language of the guides to list."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ language }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to use the Backri tools.");
    const posts = language === "ar" ? arPosts : enPosts;
    const items = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      readMinutes: post.readMinutes,
      url: language === "ar" ? `${SITE_URL}/ar/journal/${post.slug}` : `${SITE_URL}/journal/${post.slug}`,
    }));
    return {
      content: [
        { type: "text", text: items.map((item) => `${item.title} — ${item.url}`).join("\n") },
      ],
      structuredContent: { posts: items },
    };
  },
});
