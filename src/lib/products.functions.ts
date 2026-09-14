import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SHOPIFY_STORE_PERMANENT_DOMAIN, SHOPIFY_API_VERSION } from "@/lib/shopify";

export interface AdminProduct {
  id: string;
  handle: string;
  title: string;
  titleAr: string | null;
  descriptionAr: string | null;
  status: string;
  productType: string | null;
  price: string | null;
  compareAtPrice: string | null;
  currency: string;
  imageUrl: string | null;
  tags: string[];
}

export interface AdminResult<T = undefined> {
  ok: boolean;
  error?: "unauthorized" | "not_configured" | "shopify_error";
  message?: string;
  data?: T;
}

const ADMIN_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

type Guard =
  | { ok: false; result: AdminResult<never> }
  | { ok: true; token: string };

function guard(passcode: string): Guard {
  const expected = process.env["BACKRI_DASHBOARD_PASSCODE"];
  const token = process.env["SHOPIFY_ADMIN_API_TOKEN"];
  if (!expected || !token) {
    return {
      ok: false,
      result: {
        ok: false,
        error: "not_configured",
        message: "This page is not connected to Shopify yet.",
      },
    };
  }
  if (passcode !== expected) {
    return { ok: false, result: { ok: false, error: "unauthorized", message: "Wrong passcode." } };
  }
  return { ok: true, token };
}

async function adminRequest(
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ ok: true; data: any } | { ok: false; message: string }> {
  const response = await fetch(ADMIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    return {
      ok: false,
      message:
        response.status === 401 || response.status === 403
          ? "Shopify refused the request. Your Shopify app needs the write_products and write_translations permissions."
          : `Shopify returned status ${response.status}.`,
    };
  }

  const json = (await response.json()) as {
    errors?: Array<{ message: string }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
  };
  if (json.errors?.length) {
    return { ok: false, message: json.errors.map((e) => e.message).join(", ") };
  }
  return { ok: true, data: json.data };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function userErrors(node: any): string | null {
  const errs = node?.userErrors as Array<{ message: string }> | undefined;
  return errs?.length ? errs.map((e) => e.message).join(", ") : null;
}

const PRODUCTS_QUERY = `
  query AdminProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        status
        productType
        tags
        featuredMedia { preview { image { url } } }
        variants(first: 1) {
          nodes { id price compareAtPrice }
        }
        translations(locale: "ar") { key value }
      }
    }
  }
`;

export const listBackriProducts = createServerFn({ method: "POST" })
  .validator((data) => z.object({ passcode: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<AdminResult<AdminProduct[]>> => {
    const g = guard(data.passcode);
    if (!g.ok) return g.result;

    const res = await adminRequest(g.token, PRODUCTS_QUERY, { first: 50 });
    if (!res.ok) return { ok: false, error: "shopify_error", message: res.message };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = (res.data?.products?.nodes ?? []) as any[];
    const products: AdminProduct[] = nodes.map((n) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tr = (n.translations ?? []) as Array<{ key: string; value: string }>;
      const variant = n.variants?.nodes?.[0];
      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        titleAr: tr.find((t) => t.key === "title")?.value ?? null,
        descriptionAr: tr.find((t) => t.key === "body_html")?.value ?? null,
        status: n.status,
        productType: n.productType || null,
        price: variant?.price ?? null,
        compareAtPrice: variant?.compareAtPrice ?? null,
        currency: "AED",
        imageUrl: n.featuredMedia?.preview?.image?.url ?? null,
        tags: n.tags ?? [],
      };
    });

    return { ok: true, data: products };
  });

const PRODUCT_CREATE = `
  mutation AdminProductCreate($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        id
        handle
        variants(first: 1) { nodes { id } }
      }
      userErrors { field message }
    }
  }
`;

const VARIANT_UPDATE = `
  mutation AdminVariantUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price }
      userErrors { field message }
    }
  }
`;

const MEDIA_CREATE = `
  mutation AdminMediaCreate($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      mediaUserErrors { field message }
    }
  }
`;

const PUBLICATIONS_QUERY = `
  query AdminPublications { publications(first: 10) { nodes { id name } } }
`;

const PUBLISH_MUTATION = `
  mutation AdminPublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors { field message }
    }
  }
`;

const TRANSLATABLE_QUERY = `
  query AdminTranslatable($id: ID!) {
    translatableResource(resourceId: $id) {
      translatableContent { key digest locale }
    }
  }
`;

const TRANSLATIONS_REGISTER = `
  mutation AdminTranslations($id: ID!, $translations: [TranslationInput!]!) {
    translationsRegister(resourceId: $id, translations: $translations) {
      userErrors { field message }
    }
  }
`;

async function applyArabic(
  token: string,
  productId: string,
  titleAr?: string,
  descriptionAr?: string,
): Promise<string | null> {
  if (!titleAr && !descriptionAr) return null;

  const res = await adminRequest(token, TRANSLATABLE_QUERY, { id: productId });
  if (!res.ok) return res.message;

  const content = (res.data?.translatableResource?.translatableContent ?? []) as Array<{
    key: string;
    digest: string;
  }>;
  const digestOf = (key: string) => content.find((c) => c.key === key)?.digest;

  const translations: Array<{
    locale: string;
    key: string;
    value: string;
    translatableContentDigest: string;
  }> = [];

  if (titleAr && digestOf("title")) {
    translations.push({
      locale: "ar",
      key: "title",
      value: titleAr,
      translatableContentDigest: digestOf("title")!,
    });
  }
  if (descriptionAr && digestOf("body_html")) {
    translations.push({
      locale: "ar",
      key: "body_html",
      value: `<p>${descriptionAr}</p>`,
      translatableContentDigest: digestOf("body_html")!,
    });
  }

  if (translations.length === 0) return null;

  const reg = await adminRequest(token, TRANSLATIONS_REGISTER, { id: productId, translations });
  if (!reg.ok) return reg.message;
  return userErrors(reg.data?.translationsRegister);
}

const productInputSchema = z.object({
  passcode: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(""),
  titleAr: z.string().default(""),
  descriptionAr: z.string().default(""),
  price: z.string().min(1),
  compareAtPrice: z.string().default(""),
  productType: z.string().default(""),
  imageUrl: z.string().default(""),
});

export const createBackriProduct = createServerFn({ method: "POST" })
  .validator((data) => productInputSchema.parse(data))
  .handler(async ({ data }): Promise<AdminResult<{ id: string; handle: string }>> => {
    const g = guard(data.passcode);
    if (!g.ok) return g.result;
    const token = g.token;

    const created = await adminRequest(token, PRODUCT_CREATE, {
      product: {
        title: data.title,
        descriptionHtml: data.description ? `<p>${data.description}</p>` : undefined,
        productType: data.productType || undefined,
        status: "ACTIVE",
        tags: ["Backri"],
      },
    });
    if (!created.ok) return { ok: false, error: "shopify_error", message: created.message };
    const errs = userErrors(created.data?.productCreate);
    if (errs) return { ok: false, error: "shopify_error", message: errs };

    const product = created.data.productCreate.product;
    const variantId = product.variants?.nodes?.[0]?.id as string | undefined;

    if (variantId) {
      const upd = await adminRequest(token, VARIANT_UPDATE, {
        productId: product.id,
        variants: [
          {
            id: variantId,
            price: data.price,
            compareAtPrice: data.compareAtPrice || null,
            inventoryItem: { tracked: false },
          },
        ],
      });
      if (!upd.ok) return { ok: false, error: "shopify_error", message: upd.message };
      const vErr = userErrors(upd.data?.productVariantsBulkUpdate);
      if (vErr) return { ok: false, error: "shopify_error", message: vErr };
    }

    if (data.imageUrl) {
      const media = await adminRequest(token, MEDIA_CREATE, {
        productId: product.id,
        media: [
          { originalSource: data.imageUrl, alt: data.title, mediaContentType: "IMAGE" },
        ],
      });
      if (media.ok) {
        const mErr = (media.data?.productCreateMedia?.mediaUserErrors ?? []) as Array<{
          message: string;
        }>;
        if (mErr.length) {
          return {
            ok: false,
            error: "shopify_error",
            message: `Product saved, but the photo was rejected: ${mErr
              .map((e) => e.message)
              .join(", ")}`,
          };
        }
      }
    }

    // Make it visible on the storefront (all sales channels).
    const pubs = await adminRequest(token, PUBLICATIONS_QUERY);
    if (pubs.ok) {
      const ids = ((pubs.data?.publications?.nodes ?? []) as Array<{ id: string }>).map((p) => ({
        publicationId: p.id,
      }));
      if (ids.length) {
        await adminRequest(token, PUBLISH_MUTATION, { id: product.id, input: ids });
      }
    }

    const arError = await applyArabic(token, product.id, data.titleAr, data.descriptionAr);
    if (arError) {
      return {
        ok: false,
        error: "shopify_error",
        message: `Product saved, but the Arabic text was not: ${arError}`,
      };
    }

    return { ok: true, data: { id: product.id, handle: product.handle } };
  });

export const updateBackriArabic = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        passcode: z.string().min(1),
        productId: z.string().min(1),
        titleAr: z.string().default(""),
        descriptionAr: z.string().default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<AdminResult> => {
    const g = guard(data.passcode);
    if (!g.ok) return g.result;
    const err = await applyArabic(g.token, data.productId, data.titleAr, data.descriptionAr);
    if (err) return { ok: false, error: "shopify_error", message: err };
    return { ok: true };
  });

const PRODUCT_DELETE = `
  mutation AdminProductDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors { field message }
    }
  }
`;

export const deleteBackriProduct = createServerFn({ method: "POST" })
  .validator((data) =>
    z.object({ passcode: z.string().min(1), productId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }): Promise<AdminResult> => {
    const g = guard(data.passcode);
    if (!g.ok) return g.result;

    const res = await adminRequest(g.token, PRODUCT_DELETE, {
      input: { id: data.productId },
    });
    if (!res.ok) return { ok: false, error: "shopify_error", message: res.message };
    const errs = userErrors(res.data?.productDelete);
    if (errs) return { ok: false, error: "shopify_error", message: errs };
    return { ok: true };
  });
