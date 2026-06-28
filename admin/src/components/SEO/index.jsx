import { Helmet } from "react-helmet-async";
import { buildTitle, buildKeywords, buildDescription } from "@utils/seo";

/**
 * SEO — declarative per-page metadata.
 *
 * Props:
 * - title        : page-specific title segment
 * - description  : page-specific description (falls back to site default)
 * - keywords     : extra keyword strings (global keywords are always included)
 * - image        : OG/Twitter image URL
 * - url          : canonical URL (defaults to current location)
 * - type         : OG type (default "website")
 * - jsonLd       : object or array of objects for JSON-LD structured data
 * - noindex      : if true, adds noindex,nofollow robots meta
 */
const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  jsonLd,
  noindex = false,
}) => {
  const fullTitle = buildTitle(title);
  const fullDescription = buildDescription(description);
  const fullKeywords = buildKeywords(keywords);
  const canonical = url || (typeof window !== "undefined" ? window.location.href : undefined);

  const ldEntries = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords.join(", ")} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:site_name" content="E-Commerce" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD structured data */}
      {ldEntries.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
