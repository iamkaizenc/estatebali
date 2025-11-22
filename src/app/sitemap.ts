import { MetadataRoute } from "next";

const BASE_URL = "https://estatebali.app";

// Static pages
const staticPages = [
  "",
  "/about",
  "/contact",
  "/properties",
  "/investment",
  "/terms",
  "/privacy",
  "/create",
  "/login",
  "/register",
];

// Locales
const locales = ["en", "id", "he", "ar", "zh"];

// Property types for filter pages
const propertyTypes = ["villa", "apartment", "land", "commercial"];

// Transaction types
const transactionTypes = ["sale", "rent"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // Add static pages for all locales
  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      sitemap.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    });
  });

  // Add property type filter pages
  locales.forEach((locale) => {
    propertyTypes.forEach((type) => {
      sitemap.push({
        url: `${BASE_URL}/${locale}/properties?type=${type}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      });
    });
  });

  // Add transaction type filter pages
  locales.forEach((locale) => {
    transactionTypes.forEach((transaction) => {
      sitemap.push({
        url: `${BASE_URL}/${locale}/properties?transaction=${transaction}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      });
    });
  });

  // TODO: When Supabase is integrated, fetch dynamic property pages
  // Example:
  // const properties = await supabase
  //   .from('properties')
  //   .select('id, updated_at')
  //   .eq('status', 'approved');
  //
  // properties.forEach((property) => {
  //   locales.forEach((locale) => {
  //     sitemap.push({
  //       url: `${BASE_URL}/${locale}/property/${property.id}`,
  //       lastModified: new Date(property.updated_at),
  //       changeFrequency: 'weekly',
  //       priority: 0.7,
  //     });
  //   });
  // });

  return sitemap;
}
