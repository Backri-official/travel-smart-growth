import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Plane, ShieldCheck, Truck, Gift } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

const productsQueryOptions = queryOptions({
  queryKey: ["shopify-products"],
  queryFn: async () => {
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 20 });
    return (data?.data?.products?.edges || []) as ShopifyProduct[];
  },
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: Index,
  head: () => ({
    meta: [
      { title: "Backri — Premium Travel Accessories & Luggage | UAE" },
      {
        name: "description",
        content:
          "Backri crafts premium leather passport wallets, luggage, bags and travel organisers. Designed in the UAE, delivered across the GCC. Free UAE shipping over AED 500.",
      },
      { property: "og:title", content: "Backri — Premium Travel Accessories & Luggage" },
      {
        property: "og:description",
        content:
          "Premium leather passport wallets, luggage and travel organisers. Designed in the UAE, delivered across the GCC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Backri premium leather travel bag and carry-on suitcase in warm desert light"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-28 sm:py-40">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-foreground">
              Designed in the UAE
            </p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mt-4">
              Travel beautifully. Arrive composed.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Premium leather passport wallets, luggage and organisers for the
              modern Gulf traveller. Crafted to be carried for decades.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Shop the Collection
              </a>
              <p className="text-sm text-muted-foreground">
                Launch offer — free UAE delivery over AED 500
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { icon: Plane, title: "Built for DXB to LHR", text: "Cabin-sized and document-ready" },
            { icon: Truck, title: "GCC Delivery", text: "Free UAE shipping over AED 500" },
            { icon: ShieldCheck, title: "2-Year Guarantee", text: "Full-grain leather, guaranteed" },
            { icon: Gift, title: "Gift Ready", text: "Signature box with every order" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-start gap-2">
              <Icon className="h-5 w-5 text-accent-foreground" />
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-foreground">
              The Collection
            </p>
            <h2 className="font-display text-4xl mt-2">Everything the journey needs</h2>
          </div>
          <p className="hidden sm:block text-sm text-muted-foreground max-w-xs text-right">
            Eight essentials. No noise. Each piece designed to work with the rest.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed p-16 text-center">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm text-muted-foreground mt-2">
              New pieces are being added to the collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bundle / offer stack */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] opacity-80">
            The Smart Way to Buy
          </p>
          <h2 className="font-display text-4xl mt-3 max-w-2xl mx-auto">
            Pair any bag with an organiser and travel sorted from day one
          </h2>
          <p className="mt-4 opacity-80 max-w-xl mx-auto">
            Our carry-on and packing cubes were designed as a system. Add a passport
            wallet and your documents never leave your side.
          </p>
          <a
            href="#collection"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary-foreground px-6 py-3 text-sm font-medium text-primary transition-opacity hover:opacity-90"
          >
            Build Your Set
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <p className="font-display text-2xl">Backri</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Premium travel accessories, designed in the UAE and delivered across the GCC.
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Promise</p>
            <p>Full-grain materials</p>
            <p>2-year craftsmanship guarantee</p>
            <p>30-day easy returns</p>
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Backri. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
