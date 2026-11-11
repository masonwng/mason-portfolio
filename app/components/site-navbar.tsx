"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const pages = [
  { href: "/#projects", label: "projects" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/resume", label: "resume" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="wordmark" href="/" aria-label="Mason Wang home">
          <Image src="/avatar-mason.png" alt="" width={32} height={32} className="wordmark-avatar" />
          <span>Mason Wang</span>
        </Link>
        <div className="site-nav-links">
          {pages.map(p => (
            <Link className="nav-link" key={p.href} href={p.href} aria-current={pathname === p.href ? "page" : undefined}>{p.label}</Link>
          ))}
          <Link className="nav-cta" href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>contact</Link>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
