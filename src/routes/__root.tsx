import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import logoAsset from "@/assets/backri-logo.png.asset.json";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartDrawer } from "../components/CartDrawer";
import { useCartSync } from "../hooks/useCartSync";

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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Backri — Premium Travel Accessories & Luggage | UAE" },
      {
        name: "description",
        content:
          "Premium leather passport wallets, luggage, bags and travel organisers. Designed in the UAE, delivered across the GCC.",
      },
      { name: "author", content: "Backri" },
      { property: "og:title", content: "Backri — Premium Travel Accessories & Luggage" },
      {
        property: "og:description",
        content:
          "Premium leather passport wallets, luggage and travel organisers. Designed in the UAE, delivered across the GCC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Karla:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isArabic = location.pathname === "/ar" || location.pathname.startsWith("/ar/");
  useCartSync();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
          <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:justify-between sm:px-6">
            <Link
              to="/"
              className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-2"
              aria-label="Backri home"
            >
              <img
                src={logoAsset.url}
                alt="Backri logo"
                className="h-8 w-auto sm:h-9"
                width={36}
                height={36}
              />
              <span className="font-display text-xl tracking-wide sm:text-2xl">Backri</span>
            </Link>
            <nav className="absolute end-4 top-1/2 flex -translate-y-1/2 items-center gap-2 sm:static sm:translate-y-0">
              {!isArabic && (
                <Link
                  to="/"
                  hash="collection"
                  className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Collection
                </Link>
              )}
              {isArabic ? (
                <>
                  <Link
                    to="/ar/journal"
                    lang="ar"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                  >
                    المجلة
                  </Link>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                  >
                    EN
                  </Link>
                </>
              ) : (
                <>
                <Link
                  to="/journal"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Journal
                </Link>
                <Link
                  to="/ar"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                  lang="ar"
                >
                  العربية
                </Link>
                </>
              )}
              <CartDrawer />
            </nav>
          </div>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
