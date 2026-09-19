import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { arPosts, enPosts, getPost } from "@/content/posts";

const SITE_URL = "https://travel-smart-growth.lovable.app";

export default defineTool({
  name: "get_journal_post",
  title: "Read a Backri journal post",
  description:
    "Read the full text of one Backri journal travel guide by its slug, in English or Arabic.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Post slug, as returned by list_journal_posts."),
    language: z.enum(["en", "ar"]).default("en").describe("Language of the guide."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug, language }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to use the Backri tools.");
    const post = getPost(language === "ar" ? arPosts : enPosts, slug);
    if (!post) throw new ToolError(`No Backri journal post found with the slug "${slug}".`);
    const url =
      language === "ar" ? `${SITE_URL}/ar/journal/${post.slug}` : `${SITE_URL}/journal/${post.slug}`;
    const body = post.sections
      .map((section) => `## ${section.heading}\n${section.body.join("\n\n")}`)
      .join("\n\n");
    return {
      content: [{ type: "text", text: `# ${post.title}\n\n${post.excerpt}\n\n${body}\n\n${url}` }],
      structuredContent: {
        post: {
          slug: post.slug,
          title: post.title,
          description: post.description,
          date: post.date,
          readMinutes: post.readMinutes,
          excerpt: post.excerpt,
          url,
          sections: post.sections.map((section) => ({
            heading: section.heading,
            body: section.body.map((paragraph) => paragraph),
          })),
        },
      },
    };
  },
});
