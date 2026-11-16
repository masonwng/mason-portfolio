"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Magnetic } from "./magnetic";
import { ScrambleText } from "./scramble-text";
import { ScrollLink } from "./scroll-link";
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
          <Image src="/avatar-mason.png" alt="" width={36} height={36} className="wordmark-avatar" />
          <span>Mason Wang</span>
        </Link>
        <div className="site-nav-links">
          {pages.map(p => p.href.startsWith("/#") ? (
            <ScrollLink className="nav-link" key={p.href} id={p.href.slice(2)}><ScrambleText text={p.label} /></ScrollLink>
          ) : (
            <Link className="nav-link" key={p.href} href={p.href} aria-current={pathname === p.href ? "page" : undefined}><ScrambleText text={p.label} /></Link>
          ))}
          <Magnetic className="nav-cta-wrap" strength={.25}>
            <Link className="nav-cta" href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}><ScrambleText text="contact" /></Link>
          </Magnetic>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
