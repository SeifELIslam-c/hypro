import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://hy-promotion.netlify.app";
const SITE_NAME = "HYPRO";
const SITE_LOGO = `${SITE_URL}/favicon.png`;
const OG_IMAGE = `${SITE_URL}/og-cover.png`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "HYPRO — Promotion Immobilière",
  alternateName: "HYPRO Algérie",
  url: SITE_URL,
  logo: SITE_LOGO,
  image: OG_IMAGE,
  description:
    "HYPRO est un promoteur immobilier algérien spécialisé dans la conception et le développement de résidences modernes à Chéraga, Blida et Hamma. Qualité architecturale, finitions haut de gamme et accompagnement personnalisé.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cité Makoudi 2",
    addressLocality: "El Alia",
    addressRegion: "Alger",
    addressCountry: "DZ",
  },
  areaServed: [
    { "@type": "City", name: "Chéraga" },
    { "@type": "City", name: "Blida" },
    { "@type": "City", name: "Hamma" },
    { "@type": "City", name: "Alger" },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HYPRO — Promotion immobilière & construction en Algérie" },
      {
        name: "description",
        content:
          "HYPRO conçoit et développe des résidences modernes en Algérie : Cheraga, Blida, Hamma. Qualité architecturale, finitions haut de gamme et accompagnement personnalisé.",
      },
      { name: "author", content: "HYPRO" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "language", content: "fr" },
      { httpEquiv: "content-language", content: "fr-DZ" },
      /* Open Graph */
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "fr_DZ" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:title", content: "HYPRO — Construire les espaces de demain" },
      {
        property: "og:description",
        content:
          "Promotion et développement immobilier en Algérie. Découvrez les résidences HYPRO : architecture, confort et innovation.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "HYPRO — Construire les espaces de demain" },
      /* Twitter / X */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@hypro_dz" },
      { name: "twitter:title", content: "HYPRO — Construire les espaces de demain" },
      {
        name: "twitter:description",
        content:
          "Promotion et développement immobilier en Algérie. Découvrez les résidences HYPRO : architecture, confort et innovation.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      /* Thème & app */
      { name: "theme-color", content: "#1a1a1a" },
      { name: "msapplication-TileColor", content: "#1a1a1a" },
      { name: "application-name", content: "HYPRO" },
      /* Structured Data JSON-LD */
      {
        "script:ld+json": JSON.stringify(organizationJsonLd),
      } as Record<string, string>,
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "fr", href: `${SITE_URL}/` },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
