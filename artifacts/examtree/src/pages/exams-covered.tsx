import { PublicPage, SeoRouteGrid, usePageMeta } from "@/components/PublicPage";

const exams = [
  { label: "SSC CGL", href: "/category/ssc", description: "Mock tests, PYQs, reasoning, quant, GK, and English practice for SSC CGL." },
  { label: "Punjab Police", href: "/punjab-police-mock-tests", description: "Punjab-focused mock pathways with reasoning, GK, Punjabi, and computer awareness." },
  { label: "PSSSB", href: "/category/punjab", description: "PSSSB Clerk, Patwari, and Punjab government exam preparation structure." },
  { label: "IBPS", href: "/category/banking", description: "Banking mocks for IBPS Clerk, IBPS PO, reasoning, quant, and computer awareness." },
  { label: "RRB", href: "/category/railways", description: "Railway exam pathways and future PYQ collections." },
  { label: "Banking Exams", href: "/ibps-clerk-syllabus", description: "Banking syllabus, mock tests, and PYQ-friendly discovery routes." },
];

export default function ExamsCovered() {
  usePageMeta("Exams Covered", "Explore exams covered by ExamTree including SSC CGL, Punjab Police, PSSSB, IBPS, RRB, and Banking exams.");

  return (
    <PublicPage
      eyebrow="Exams covered"
      title="Exam pathways built for discovery and SEO."
      description="Browse supported exam families and future-ready landing pages for syllabus, mock tests, PYQs, and updates."
    >
      <SeoRouteGrid routes={exams} />
    </PublicPage>
  );
}

