import type { Metadata } from "next";

import { masterclass } from "@/lib/masterclass";

const DEFAULT_SITE_URL = "http://localhost:3000";

export const seoKeywords = [
  "graphic design classes in Ghana",
  "graphic design course Ghana",
  "graphic design masterclass Ghana",
  "graphic design and media class",
  "content creation course Ghana",
  "social media management course Ghana",
  "reels making class Ghana",
  "Design With Otabil",
  "DWO graphic design",
] as const;

export const seoTitle =
  "Graphic Design & Media Class Ghana | DWO Masterclass 2026";

export const seoDescription =
  "Join Design With Otabil's Graphic Design & Media Class in Ghana. Learn graphic design, content creation, social media management, and reels making. Registration opens 4 September 2026. Course fee GHS 700.";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  return configured || DEFAULT_SITE_URL;
}

export function getCanonicalUrl(pathname = "/") {
  const normalizedPath =
    pathname === "/" ? "/" : `/${pathname.replace(/^\/+/, "").replace(/\/+$/, "")}`;

  return new URL(normalizedPath, getSiteUrl()).toString();
}

function buildSharedMetadata(pathname = "/"): Metadata {
  const canonical = getCanonicalUrl(pathname);
  const ogImage = new URL("/opengraph-image", getSiteUrl()).toString();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: seoTitle,
    description: seoDescription,
    keywords: [...seoKeywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonical,
      siteName: masterclass.brandFull,
      locale: "en_GH",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${masterclass.name} by ${masterclass.brandFull} — graphic design course in Ghana`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
    category: "education",
  };
}

export function createSiteMetadata(): Metadata {
  return {
    ...buildSharedMetadata("/"),
    title: {
      default: seoTitle,
      template: `%s | ${masterclass.brandFull}`,
    },
    applicationName: masterclass.name,
    appleWebApp: {
      capable: true,
      title: masterclass.shortName,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: true,
    },
  };
}

export function createHomeMetadata(): Metadata {
  return buildSharedMetadata("/");
}

export function createRegisterMetadata(): Metadata {
  const title = "Register";
  const description = `Register for the ${masterclass.name} in Ghana. Secure your place with online payment via Paystack. Course fee ${masterclass.price.display}.`;

  return {
    ...buildSharedMetadata("/register"),
    title,
    description,
    openGraph: {
      ...buildSharedMetadata("/register").openGraph,
      title,
      description,
    },
    twitter: {
      ...buildSharedMetadata("/register").twitter,
      title,
      description,
    },
  };
}

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export function buildStructuredData(pathname = "/") {
  const siteUrl = getSiteUrl();
  const pageUrl = getCanonicalUrl(pathname);

  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: masterclass.brandFull,
    alternateName: masterclass.brand,
    url: siteUrl,
    logo: new URL(masterclass.brandAssets.logo, siteUrl).toString(),
    sameAs: [masterclass.contact.instagram.href],
    areaServed: {
      "@type": "Country",
      name: "Ghana",
    },
  };

  const course = {
    "@type": "Course",
    "@id": `${pageUrl}#course`,
    name: masterclass.name,
    description: seoDescription,
    url: pageUrl,
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: String(masterclass.price.amount),
      priceCurrency: masterclass.price.currency,
      availability: "https://schema.org/InStock",
      url: getCanonicalUrl("/register"),
      validFrom: masterclass.registrationStarts.date,
    },
    teaches: masterclass.skills.map((skill) => skill.title),
    hasCourseInstance: {
      "@type": "CourseInstance",
      name: `${masterclass.name} 2026`,
      courseMode: "https://schema.org/OfflineEventAttendanceMode",
      startDate: masterclass.coursePeriod.start,
      endDate: masterclass.coursePeriod.end,
      location: {
        "@type": "Place",
        name: "Ghana",
        address: {
          "@type": "PostalAddress",
          addressCountry: "GH",
        },
      },
      instructor: {
        "@type": "Person",
        name: masterclass.instructor.name,
        jobTitle: "Creative Director",
        worksFor: {
          "@id": `${siteUrl}/#organization`,
        },
        image: new URL(masterclass.instructor.imageSrc, siteUrl).toString(),
      },
    },
  };

  const event = {
    "@type": "Event",
    "@id": `${pageUrl}#event`,
    name: masterclass.name,
    description: seoDescription,
    startDate: masterclass.coursePeriod.start,
    endDate: masterclass.coursePeriod.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Ghana",
      address: {
        "@type": "PostalAddress",
        addressCountry: "GH",
      },
    },
    organizer: {
      "@id": `${siteUrl}/#organization`,
    },
    performer: {
      "@type": "Person",
      name: masterclass.instructor.name,
    },
    offers: {
      "@type": "Offer",
      price: String(masterclass.price.amount),
      priceCurrency: masterclass.price.currency,
      availability: "https://schema.org/InStock",
      url: getCanonicalUrl("/register"),
      validFrom: masterclass.registrationStarts.date,
    },
    image: new URL("/opengraph-image", siteUrl).toString(),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: masterclass.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: masterclass.name,
    description: seoDescription,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-GH",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, course, event, faqPage],
  };
}
