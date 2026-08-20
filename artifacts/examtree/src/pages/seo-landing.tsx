import { useLocation } from "wouter";
import { PublicPage, usePageMeta } from "@/components/PublicPage";
import { Button } from "@/components/ui/button";

const landingCopy: Record<string, { title: string; description: string; cta: string }> = {
  "/ssc-cgl-pyqs": {
    title: "SSC CGL PYQs",
    description: "Future SEO-ready landing page for SSC CGL previous year questions, topic filters, and mock assembly.",
    cta: "Browse PYQs",
  },
  "/punjab-police-mock-tests": {
    title: "Punjab Police Mock Tests",
    description: "Future landing page for Punjab Police mocks, Punjabi support, GK, reasoning, and computer awareness practice.",
    cta: "View Mock Tests",
  },
  "/ibps-clerk-syllabus": {
    title: "IBPS Clerk Syllabus",
    description: "Future syllabus page for IBPS Clerk topics, mock strategy, and PYQ-linked preparation.",
    cta: "Explore Banking Mocks",
  },
};

export default function SeoLanding() {
  const [location, setLocation] = useLocation();
  const copy = landingCopy[location] ?? landingCopy["/ssc-cgl-pyqs"];
  usePageMeta(copy.title, copy.description, { robots: "noindex,follow" });

  return (
    <PublicPage eyebrow="SEO landing" title={copy.title} description={copy.description}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm leading-relaxed text-slate-600">
          This route is structured for future syllabus, PYQ, calendar, and exam-specific SEO content while keeping the public site lightweight today.
        </p>
        <Button className="mt-5 rounded-md bg-teal-600 text-white hover:bg-teal-700" onClick={() => setLocation("/tests")}>
          {copy.cta}
        </Button>
      </div>
    </PublicPage>
  );
}
