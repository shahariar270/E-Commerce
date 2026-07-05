// Central SEO configuration and helpers for the e-commerce platform.
// Target keywords are applied site-wide and blended into per-product metadata.

export const SITE_CONFIG = {
  siteName: "E-Commerce",
  baseUrl: (import.meta.env.VITE_API_BASE || window.location.origin).replace(/\/$/, ""),
  locale: "en_US",
  twitterHandle: "",
  // Primary SEO keywords requested for the project.
  defaultKeywords: [
    "best ecommerce cms",
    "bangladeshi ecommerce solution",
    "bangladeshi ecommerce business",
  ],
  defaultDescription:
    "A modern Bangladeshi ecommerce solution and one of the best ecommerce CMS platforms for growing your bangladeshi ecommerce business online.",
};

/**
 * Build a SEO-friendly page title (kept under ~60 chars when possible).
 * Pattern: "<Page title> | <Site name>"
 */
export const buildTitle = (pageTitle) => {
  const base = pageTitle?.trim() || "";
  if (!base) return SITE_CONFIG.siteName;
  const full = `${base} | ${SITE_CONFIG.siteName}`;
  return full.length > 60 ? `${base} | ${SITE_CONFIG.siteName}` : full;
};

/**
 * Build a keyword list that always includes the global target keywords,
 * plus any page-specific terms. De-duplicated and trimmed.
 */
export const buildKeywords = (extra = []) => {
  const merged = [...SITE_CONFIG.defaultKeywords, ...extra.map((k) => k?.trim()).filter(Boolean)];
  return Array.from(new Set(merged));
};

/**
 * Build a meta description (<= 160 chars). Falls back to the site default.
 */
export const buildDescription = (text) => {
  const t = text?.trim();
  if (!t) return SITE_CONFIG.defaultDescription;
  return t.length > 160 ? `${t.substring(0, 157)}...` : t;
};

/**
 * Generate a product-specific description from product fields.
 */
export const productDescription = (product) => {
  const name = product?.product_name?.trim();
  const category = product?.category?.[0]?.name?.trim();
  const shortDesc = product?.description?.trim();

  const base = shortDesc
    ? shortDesc.replace(/\s+/g, " ")
    : `Buy ${name || "this product"} online.`;

  const tail = `Shop the best ecommerce CMS deals — a trusted bangladeshi ecommerce solution for your bangladeshi ecommerce business.`;

  const candidate = name
    ? `${name} — ${base} ${tail}`
    : `${base} ${tail}`;

  return buildDescription(candidate);
};

/**
 * Generate product-specific keywords from name + categories.
 */
export const productKeywords = (product) => {
  const extras = [];
  if (product?.product_name) {
    extras.push(`${product.product_name} price in Bangladesh`);
    extras.push(`buy ${product.product_name} online`);
  }
  (product?.category || []).forEach((c) => {
    if (c?.name) extras.push(`${c.name} in Bangladesh`);
  });
  return buildKeywords(extras);
};

/**
 * Build a JSON-LD Product schema object for a single product.
 */
export const productJsonLd = (product, { reviews = [], averageRating = 0 } = {}) => {
  if (!product) return null;

  const offers = {
    "@type": "Offer",
    priceCurrency: "BDT",
    price: product.price != null ? String(product.price) : undefined,
    availability:
      product.stock === "in_stock"
        ? "https://schema.org/InStock"
        : product.stock === "out_stock"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/PreOrder",
    seller: { "@type": "Organization", name: SITE_CONFIG.siteName },
  };

  const aggregateRating =
    reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: averageRating ? String(Number(averageRating).toFixed(1)) : "0",
          reviewCount: String(reviews.length),
          bestRating: "5",
          worstRating: "1",
        }
      : undefined;

  const reviewLd = reviews.slice(0, 10).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r?.author?.user_name || r?.author?.name || "Verified customer" },
    datePublished: r?.createdAt || undefined,
    reviewRating: { "@type": "Rating", ratingValue: String(r?.rating || 0), bestRating: "5" },
    reviewBody: r?.comment || r?.title || "",
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product_name,
    image: product.image_gallery?.length ? product.image_gallery : undefined,
    description: product.description || undefined,
    sku: product._id,
    brand: { "@type": "Brand", name: SITE_CONFIG.siteName },
    category: product.category?.[0]?.name,
    offers,
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(reviewLd.length ? { review: reviewLd } : {}),
  };
};

/**
 * Build a JSON-LD BreadcrumbList for a single product.
 */
export const productBreadcrumbJsonLd = (product) => {
  if (!product) return null;
  const siteUrl = window.location.origin;
  const items = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
  ];
  if (product.category?.[0]?.name) {
    items.push({ name: product.category[0].name, path: "/?category=" + encodeURIComponent(product.category[0].name) });
  }
  items.push({ name: product.product_name, path: `/product/${product._id}` });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
};
