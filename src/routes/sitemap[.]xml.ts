import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapStaticPaths,
  sitemapXML,
  type SitemapEntry,
} from "@/lib/sitemap";
import { arPosts, enPosts } from "@/content/posts";
import { PRODUCT_HANDLES_QUERY, storefrontApiRequest } from "@/lib/shopify";

const BASE_URL = "https://travel-smart-growth.lovable.app";

async function productHandles(): Promise<string[]> {
  const handles: string[] = [];
  let after: string | null = null;
  for (;;) {
    const data = await storefrontApiRequest(PRODUCT_HANDLES_QUERY, { first: 100, after });
    const products = data?.data?.products;
    if (!products) throw new Error("Shopify returned no product data for the sitemap");
    for (const edge of products.edges as Array<{ node: { handle: string } }>) {
      if (edge?.node?.handle) handles.push(edge.node.handle);
    }
    if (!products.pageInfo?.hasNextPage) break;
    after = products.pageInfo.endCursor;
    if (!after) break;
  }
  return handles;
}

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        const addDynamic = (routeId: string, to: string, slugs: string[], key: string) => {
          if (!isSitemapRouteIncluded(router.routesById[routeId])) return;
          for (const slug of slugs) {
            const location = router.buildLocation({
              to,
              params: { [key]: slug },
              search: () => ({}),
              hash: "",
            });
            const path = sitemapPathForLocation(router, location, routeId);
            if (path) entries.push({ path });
          }
        };

        addDynamic(
          "/journal/$slug",
          "/journal/$slug",
          enPosts.map((post) => post.slug),
          "slug",
        );
        addDynamic(
          "/ar/journal/$slug",
          "/ar/journal/$slug",
          arPosts.map((post) => post.slug),
          "slug",
        );

        if (isSitemapRouteIncluded(router.routesById["/product/$handle"])) {
          addDynamic("/product/$handle", "/product/$handle", await productHandles(), "handle");
        }

        if (entries.length === 0) {
          return new Response(
            'No pages are included in this sitemap. Check route decisions and ancestor exclusions. Setting "exclude-subtree" on the root excludes the entire site.',
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
