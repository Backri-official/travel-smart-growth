import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import listJournalPostsTool from "./tools/list-journal-posts";
import getJournalPostTool from "./tools/get-journal-post";

// The OAuth issuer must be the direct Supabase host; the project ref is inlined
// at build time and survives publish unchanged.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "growth-architect-ai",
  title: "Growth Architect AI",
  version: "0.1.0",
  instructions:
    "Tools for the Backri travel accessories store (UAE / GCC). Use `list_products` and `get_product` for live catalogue data with AED prices and stock, and `list_journal_posts` / `get_journal_post` for the Backri travel guides in English or Arabic.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProductsTool, getProductTool, listJournalPostsTool, getJournalPostTool],
});
