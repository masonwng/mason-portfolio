import Link from "next/link";
import { personal } from "../lib/portfolio";
import { EmailCopy } from "./email-copy";
import { ScrambleText } from "./scramble-text";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="footer-name">{personal.name}</p>
          <p className="secondary">Building things and figuring it out as I go.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/work"><ScrambleText text="work" /></Link>
          <Link href="/about"><ScrambleText text="about" /></Link>
          <Link href="/resume"><ScrambleText text="resume" /></Link>
          <a href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer"><ScrambleText text="github" /></a>
          <a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer"><ScrambleText text="linkedin" /></a>
          <EmailCopy email={personal.email} className="footer-email"><ScrambleText text="email" /></EmailCopy>
        </nav>
      </div>
      <p className="footer-legal">© 2026 {personal.name}</p>
    </footer>
  );
}
