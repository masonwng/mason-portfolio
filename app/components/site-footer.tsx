import { personal } from "../lib/portfolio";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 {personal.name}</p>
      <a className="footer-email" href={`mailto:${personal.email}`}>
        Email
      </a>
    </footer>
  );
}
