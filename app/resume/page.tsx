import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title: "Resume", alternates: { canonical: "/resume" }, description: "Preview and download Mason Wang’s résumé." };
export default function ResumePage() {
  return <div className="resume-studio"><header className="page-heading"><h1>resume.</h1><p className="page-intro">You can read it here or download a copy.</p><div className="resume-actions"><a className="pdf-download" href="/resume.pdf" download="Mason-Wang-Resume.pdf">Resume</a><a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a></div></header><a className="resume-document" href="/resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open résumé PDF"><Image src="/resume-preview-1.png" alt="Preview of Mason Wang’s one-page résumé. Open the PDF to read or download it." width={1391} height={1800} priority unoptimized /></a></div>;
}
