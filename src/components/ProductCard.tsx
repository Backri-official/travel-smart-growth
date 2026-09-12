import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const compareAt = variant?.compareAtPrice;
  const hasDiscount =
    compareAt && parseFloat(compareAt.amount) > parseFloat(variant?.price.amount ?? "0");

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${node.title} added to your bag`);
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: node.handle }}
      className="group block"
    >
      <article className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
          {image && (
            <img
              src={image.url}
              alt={image.altText || node.title}
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              Launch Offer
            </Badge>
          )}
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading || !variant || !variant.availableForSale}
            className="absolute bottom-3 right-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
            aria-label={`Add ${node.title} to cart`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" /> Add
              </>
            )}
          </Button>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {node.productType}
          </p>
          <h3 className="font-display text-xl leading-snug">{node.title}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-semibold">
              {formatPrice(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}
            </span>
            {hasDiscount && compareAt && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
