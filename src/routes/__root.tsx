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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/sonner";
import { WelcomeCelebration } from "@/components/WelcomeCelebration";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This route is off the map.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-xl font-semibold">Something broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground">Retry</button>
          <a href="/" className="rounded-xl border border-border px-5 py-2.5 text-sm">Home</a>
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
      { title: "HackMate AI — The AI workspace for hackathons" },
      { name: "description", content: "Ideate, plan, build, and pitch — HackMate AI keeps your hackathon team aligned from hour zero to demo day." },
      { property: "og:title", content: "HackMate AI — The AI workspace for hackathons" },
      { name: "twitter:title", content: "HackMate AI — The AI workspace for hackathons" },
      { property: "og:description", content: "Ideate, plan, build, and pitch — HackMate AI keeps your hackathon team aligned from hour zero to demo day." },
      { name: "twitter:description", content: "Ideate, plan, build, and pitch — HackMate AI keeps your hackathon team aligned from hour zero to demo day." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cae7c3e1-3785-48b6-9908-46e58b9f9a1a/id-preview-58a8b776--a1c0ce37-9852-452d-988e-44ea42a13fee.lovable.app-1781067777596.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cae7c3e1-3785-48b6-9908-46e58b9f9a1a/id-preview-58a8b776--a1c0ce37-9852-452d-988e-44ea42a13fee.lovable.app-1781067777596.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
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
      <head><HeadContent /></head>
      <body>
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
      <ThemeProvider>
        <div className="aurora-screen" aria-hidden="true" />
        <Outlet />
        <WelcomeCelebration />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
