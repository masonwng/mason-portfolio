"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const pages = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Main navigation" data-page={pathname === "/" ? "home" : undefined}>
      <Link className="wordmark" href="/" aria-label="Mason Wang home">
        mw.
      </Link>
      <div className="site-nav-links">
        {pages.map((page) => {
          const active = pathname === page.href || (
            page.href !== "/" && pathname.startsWith(`${page.href}/`)
          );

          return (
            <Link
              className="nav-link"
              href={page.href}
              key={page.href}
              aria-current={active ? "page" : undefined}
            >
              {page.label}
            </Link>
          );
        })}
      </div>
      <ThemeToggle />
    </nav>
  );
}
