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
      { title: "Passport Wallets & Travel Luggage in Dubai, UAE | Backri" },
      {
        name: "description",
        content:
          "Shop premium leather passport wallets, passport covers, cabin luggage, travel bags and packing organisers in Dubai. Free UAE delivery over AED 500, shipping across the GCC.",
      },
      { name: "keywords", content: "passport wallet UAE, passport cover Dubai, travel wallet Dubai, luggage Dubai, cabin luggage UAE, travel bags GCC, packing cubes Dubai" },
      { property: "og:title", content: "Passport Wallets & Travel Luggage in Dubai, UAE | Backri" },
      {
        property: "og:description",
        content:
          "Premium leather passport wallets, cabin luggage, travel bags and organisers. Free UAE delivery over AED 500, shipping across the GCC.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "en_AE" },
      { property: "og:locale:alternate", content: "ar_AE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "alternate", hrefLang: "en-AE", href: "/" },
      { rel: "alternate", hrefLang: "ar-AE", href: "/ar" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          name: "Backri",
          description:
            "Premium leather passport wallets, cabin luggage, travel bags and packing organisers for travellers in the UAE and GCC.",
          url: "/",
          currenciesAccepted: "AED",
          areaServed: [
            { "@type": "Country", name: "United Arab Emirates" },
            { "@type": "Country", name: "Saudi Arabia" },
            { "@type": "Country", name: "Qatar" },
            { "@type": "Country", name: "Kuwait" },
            { "@type": "Country", name: "Bahrain" },
            { "@type": "Country", name: "Oman" },
          ],
        }),
      },
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
              Designed in the UAE — delivered across the GCC
            </p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mt-4">
              Passport wallets &amp; travel luggage, made for the Gulf
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Premium leather passport wallets and covers, cabin luggage, travel
              bags and packing organisers for travellers in Dubai, Abu Dhabi and
              across the GCC. Crafted to be carried for decades.
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

      {/* Delivery & areas served */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <h2 className="font-display text-4xl">
          Travel accessories delivered across the UAE &amp; GCC
        </h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2 text-muted-foreground leading-relaxed">
          <p>
            Order a passport wallet, passport cover, cabin suitcase or weekender
            duffle and we deliver anywhere in the UAE — Dubai, Abu Dhabi, Sharjah,
            Ajman, Ras Al Khaimah, Fujairah and Umm Al Quwain. UAE delivery is free
            on orders over AED 500, with 2–4 day courier delivery on everything else.
          </p>
          <p>
            We also ship across the GCC to Saudi Arabia, Qatar, Kuwait, Bahrain and
            Oman. All prices are in AED, every piece is cabin-friendly for DXB, AUH
            and DWC departures, and each order arrives gift-ready in a signature box
            with a 2-year craftsmanship guarantee.
          </p>
        </div>
      </section>


      {/* Journal */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="rounded-lg bg-secondary p-8 sm:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Backri Journal</p>
          <h2 className="font-display text-3xl sm:text-4xl mt-3">
            Travel tips for UAE &amp; GCC travellers
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
            Cabin baggage rules from Dubai and Abu Dhabi, document checklists for UAE
            residents, summer packing lists and carry-on only guides.
          </p>
          <ul className="mt-6 space-y-2">
            {enPosts.slice(0, 3).map((post) => (
              <li key={post.slug}>
                <Link
                  to="/journal/$slug"
                  params={{ slug: post.slug }}
                  className="text-sm hover:text-accent transition-colors underline underline-offset-4 decoration-accent/40"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/journal"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Read the journal
          </Link>
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
