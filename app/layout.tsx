import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MotionProvider } from "./components/motion-provider";
import { ScrollEffects } from "./components/scroll-effects";
import { ScrollProgress } from "./components/scroll-progress";
import { Cursor } from "./components/cursor";
import { SiteNavbar } from "./components/site-navbar";
import { SiteFooter } from "./components/site-footer";
import { ThemeProvider } from "./components/theme-provider";
import { personal } from "./lib/portfolio";
import { socialPreview } from "./lib/social-preview";
import "./tailwind.css";
import "./globals.css";

// Both faces are Latin subsets of OFL variable fonts (licences in app/fonts/),
// self-hosted through next/font so there are no third-party font requests.
// Bricolage Grotesque: display headings, optical size pinned at 96, weight 500–800.
const display = localFont({
  src: "./fonts/bricolage-display.woff2",
  variable: "--font-display", display: "swap", weight: "500 800",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"], adjustFontFallback: "Arial",
});
// Instrument Sans: body copy and UI, weight 400–700.
const sans = localFont({
  src: "./fonts/instrument-sans.woff2",
  variable: "--font-sans", display: "swap", weight: "400 700",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"], adjustFontFallback: "Arial",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f3f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f1d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://masonwang.dev"),
  title: {
    default: `${personal.name} — First-Year BUCS Student at UBC`,
    template: `%s — ${personal.name}`,
  },
  description: "Mason Wang's personal website. First-year Business and Computer Science student at UBC, building software and trying out ideas.",
  authors: [{ name: personal.name }],
  // Stable public URLs let search crawlers reuse the same face icon across releases.
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "64x64" },
      { url: "/favicon.png", type: "image/png", sizes: "180x180" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: personal.name,
    description: personal.intro,
    type: "website", locale: "en_US",
    siteName: personal.name,
    images: [socialPreview],
  },
  twitter: { card: "summary_large_image", title: personal.name, description: personal.intro, images: [socialPreview] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Scroll reveals only hide content once we know JavaScript is running. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider>
            <a className="skip-link" href="#main">Skip to content</a>
            <ScrollProgress />
            <SiteNavbar />
            <div className="site-shell">
              <main id="main" className="portfolio" tabIndex={-1}>
                {children}
              </main>
              <SiteFooter />
            </div>
            <ScrollEffects />
            <Cursor />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
