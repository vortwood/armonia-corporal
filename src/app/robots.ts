import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.alejandraduarte.uy";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/panel/",
          "/panel/hairdressers",
          "/panel/services",
          "/panel/stats",
          "/login",
          "/api/",
          "/_next/",
          "/admin/",
          "/panel/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
