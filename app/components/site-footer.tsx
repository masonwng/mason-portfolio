import { personal } from "../lib/portfolio";
import { EmailCopy } from "./email-copy";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 {personal.name}</p>
      <EmailCopy email={personal.email} className="footer-email" />
    </footer>
  );
}
