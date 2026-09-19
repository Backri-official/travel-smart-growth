import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  STOREFRONT_QUERY,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ProductCard } from "@/components/ProductCard";

const productQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["shopify-product", handle],
    queryFn: async () => {
      const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      const product = data?.data?.product;
      if (!product) throw notFound();
      return { node: product } as ShopifyProduct;
    },
  });

const relatedQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["shopify-related", handle],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 10 });
      const products = (data?.data?.products?.edges || []) as ShopifyProduct[];
      return products.filter((p) => p.node.handle !== handle).slice(0, 4);
    },
  });

const SITE_URL = "https://travel-smart-growth.lovable.app";

function shareImage(url: string | undefined): string | undefined {
  if (!url || !url.startsWith("https://")) return undefined;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}width=1200&height=630&crop=center`;
}

export const Route = createFileRoute("/product/$handle")({
  staticData: { sitemap: true },
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(productQueryOptions(params.handle)),
  component: ProductPage,
  head: ({ params, loaderData }) => {
    const url = `${SITE_URL}/product/${params.handle}`;
    const node = loaderData?.node;

    if (!node) {
      return {
        meta: [
          { title: "Product — Backri" },
          {
            name: "description",
            content:
              "Premium leather travel accessories by Backri, shipped across the UAE and GCC.",
          },
          { property: "og:type", content: "product" },
          { property: "og:url", content: url },
          { name: "twitter:card", content: "summary_large_image" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }

    const variant = node.variants.edges[0]?.node;
    const price = variant?.price;
    const category = node.productType ? `${node.productType} · ` : "";
    const summary =
      node.description?.trim().slice(0, 155) ||
      `${node.title} by Backri — premium travel goods delivered across the UAE and GCC.`;
    const title = `${node.title} | Backri ${node.productType || "Travel Accessories"} UAE`;
    const image = shareImage(node.images.edges[0]?.node.url);

    return {
      meta: [
        { title },
        { name: "description", content: `${category}${summary}` },
        { property: "og:title", content: title },
        { property: "og:description", content: summary },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "en_AE" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: node.title,
            description: summary,
            sku: variant?.id,
            category: node.productType || undefined,
            image: node.images.edges.map((edge) => edge.node.url),
            brand: { "@type": "Brand", name: "Backri" },
            offers: price
              ? {
                  "@type": "Offer",
                  url,
                  price: price.amount,
                  priceCurrency: price.currencyCode,
                  availability: variant?.availableForSale
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  areaServed: "AE",
                }
              : undefined,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: node.title, item: url },
            ],
          }),
        },
      ],
    };
  },
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQueryOptions(handle));
  const { data: related } = useSuspenseQuery(relatedQueryOptions(handle));
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const { node } = product;
  const images = node.images.edges;
  const variants = node.variants.edges;
  const selectedVariant =
    variants.find((v) => v.node.id === selectedVariantId)?.node || variants[0]?.node;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const hasDiscount =
    !!compareAtPrice &&
    !!selectedVariant &&
    parseFloat(compareAtPrice.amount) > parseFloat(selectedVariant.price.amount);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success(`${node.title} added to your bag`);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{node.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
            {images[0]?.node && (
              <img
                src={images[0].node.url}
                alt={images[0].node.altText || node.title}
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img) => (
                <div
                  key={img.node.url}
                  className="aspect-square overflow-hidden rounded-md bg-secondary"
                >
                  <img
                    src={img.node.url}
                    alt={img.node.altText || node.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {node.productType}
          </p>
          <h1 className="font-display text-4xl mt-2">{node.title}</h1>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-2xl font-bold">
              {selectedVariant &&
                formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
            </span>
            {hasDiscount && selectedVariant?.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(
                  selectedVariant.compareAtPrice.amount,
                  selectedVariant.compareAtPrice.currencyCode,
                )}
              </span>
            )}
            {hasDiscount && (
              <Badge className="bg-accent text-accent-foreground">Launch Offer</Badge>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{node.description}</p>

          {node.options.length > 0 && (node.options[0]?.values.length ?? 0) > 1 && (
            <div className="mt-6 space-y-3">
              {node.options.map((option) => (
                <div key={option.name}>
                  <p className="text-sm font-medium mb-2">{option.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const val = v.node.selectedOptions.find(
                        (o) => o.name === option.name,
                      )?.value;
                      return (
                        <Button
                          key={v.node.id}
                          variant={
                            selectedVariant?.id === v.node.id ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedVariantId(v.node.id)}
                          disabled={!v.node.availableForSale}
                        >
                          {val}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            size="lg"
            className="mt-8 w-full"
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant?.availableForSale}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Bag
              </>
            )}
          </Button>

          <div className="mt-8 grid grid-cols-1 gap-3 rounded-lg border p-4 text-sm">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-accent-foreground" />
              <span>Free UAE delivery over AED 500 · GCC shipping available</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-accent-foreground" />
              <span>2-year craftsmanship guarantee</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-accent-foreground" />
              <span>30-day easy returns</span>
            </div>
          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-8">Complete your travel set</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
