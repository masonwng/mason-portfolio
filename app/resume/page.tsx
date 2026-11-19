import type { Metadata } from "next";
import { PageTransition } from "../components/page-transition";
import { ResumeGate } from "../components/resume-gate";

export const metadata: Metadata = { title: "Resume", alternates: { canonical: "/resume" }, description: "Mason Wang’s résumé (password protected)." };

export default function ResumePage() {
  return (
    <PageTransition>
      <div className="resume-studio">
        <header className="page-heading"><p className="eyebrow">resume</p><h1>resume.</h1></header>
        <ResumeGate />
      </div>
    </PageTransition>
  );
}
