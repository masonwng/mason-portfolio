import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteNavbar } from "./components/site-navbar";
import { SiteFooter } from "./components/site-footer";
import { ThemeProvider } from "./components/theme-provider";
import { personal } from "./lib/portfolio";
import "./tailwind.css";
import "./globals.css";

// Reuse the Geist variable fonts shipped with the installed Next.js package.
// next/font emits optimized, self-hosted assets with no external font requests.
const sans = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist-sans", display: "swap", weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://masonwang.dev"),
  title: {
    default: `${personal.name} — First-Year BUCS Student at UBC`,
    template: `%s — ${personal.name}`,
  },
  description: "Mason Wang's personal website. First-year Business and Computer Science student at UBC, building software and trying out ideas.",
  authors: [{ name: personal.name }],
  openGraph: {
    title: personal.name,
    description: personal.intro,
    type: "website", locale: "en_US",
    siteName: personal.name,
    images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: "Mason Wang — BUCS student at UBC, with a little pig" }],
  },
  twitter: { card: "summary_large_image", title: personal.name, description: personal.intro, images: ["/social-preview.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main">Skip to content</a>
          <div className="site-shell">
            <SiteNavbar />
            <main id="main" className="portfolio" tabIndex={-1}>
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
