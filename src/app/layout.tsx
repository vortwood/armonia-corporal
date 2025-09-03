import type { Metadata } from "next";

import { AdminContextProvider } from "@/context/AdminContext";
import { getBusinessConfig } from "@/config/business.config";
import { inter } from "@/util/fonts";

import "./globals.css";

// Generate dynamic metadata from business config
function generateMetadata(): Metadata {
  const config = getBusinessConfig();
  
  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
    authors: [{ name: config.name }],
    creator: config.name,
    publisher: config.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: config.name,
      title: config.seo.title,
      description: config.seo.description,
      images: [
        {
          url: config.seo.ogImage || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${config.name} - ${config.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.seo.title,
      description: config.seo.description,
      images: [config.seo.ogImage || "/og-image.jpg"],
    },
    other: {
      "geo.placename": `${config.location.city}, ${config.location.country}`,
      ...(config.location.coordinates && {
        "geo.position": `${config.location.coordinates.lat};${config.location.coordinates.lng}`,
        ICBM: `${config.location.coordinates.lat}, ${config.location.coordinates.lng}`,
      }),
    },
  };
}

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getBusinessConfig();
  const businessTypeLabel = config.businessType === 'barberia' ? 'HairSalon' : 'BeautySalon';
  
  return (
    <html lang="es" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content={config.shortName} />

        {/* Google Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": businessTypeLabel,
              name: config.name,
              description: config.description,
              url: typeof window !== 'undefined' ? window.location.origin : '',
              telephone: config.contact.phone,
              ...(config.contact.email && { email: config.contact.email }),
              address: {
                "@type": "PostalAddress",
                streetAddress: config.location.address,
                addressLocality: config.location.city,
                addressCountry: config.location.country,
              },
              ...(config.location.coordinates && {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: config.location.coordinates.lat.toString(),
                  longitude: config.location.coordinates.lng.toString(),
                },
              }),
              sameAs: [
                config.contact.instagram && `https://instagram.com/${config.contact.instagram.replace('@', '')}`,
                config.contact.facebook && config.contact.facebook,
              ].filter(Boolean),
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `Servicios de ${config.businessType === 'barberia' ? 'Barbería' : 'Peluquería'}`,
                itemListElement: config.services.map(service => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: service.name,
                    description: service.description,
                  },
                })),
              },
              openingHoursSpecification: Object.entries(config.hours)
                .filter(([, hours]) => hours && hours !== 'Cerrado')
                .map(([day, hours]) => {
                  const dayMap: { [key: string]: string } = {
                    monday: "Monday",
                    tuesday: "Tuesday", 
                    wednesday: "Wednesday",
                    thursday: "Thursday",
                    friday: "Friday",
                    saturday: "Saturday",
                    sunday: "Sunday"
                  };
                  const [opens, closes] = hours!.split(' - ');
                  return {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: dayMap[day],
                    opens,
                    closes,
                  };
                }),
            }),
          }}
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <div id="__next-root">
          <AdminContextProvider>
            <main>{children}</main>
          </AdminContextProvider>
        </div>
      </body>
    </html>
  );
}
