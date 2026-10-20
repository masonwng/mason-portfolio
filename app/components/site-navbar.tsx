"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
export function SiteNavbar(){const pathname=usePathname();const pages=[{href:'/#projects',label:'projects'},{href:'/about',label:'about'},{href:'/contact',label:'contact'},{href:'/resume',label:'resume'}];return <nav className="site-nav" aria-label="Main navigation"><Link className="wordmark" href="/" aria-label="Mason Wang home">mw.</Link><div className="site-nav-links">{pages.map(p=><Link className="nav-link" key={p.href} href={p.href} aria-current={pathname===p.href?'page':undefined}>{p.label}</Link>)}</div><ThemeToggle/></nav>;}
