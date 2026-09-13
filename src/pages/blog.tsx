import { PublicPage, SeoRouteGrid, usePageMeta } from "@/components/PublicPage";

const posts = [
  { label: "SSC CGL preparation guide", href: "/ssc-cgl-pyqs", description: "Future article hub for syllabus, PYQs, strategy, and topic coverage." },
  { label: "Punjab Police mock test strategy", href: "/punjab-police-mock-tests", description: "Future preparation guide for Punjab State exam aspirants." },
  { label: "IBPS Clerk syllabus roadmap", href: "/ibps-clerk-syllabus", description: "Future syllabus and mock test strategy page for banking aspirants." },
];

export default function Blog() {
  usePageMeta("Blog", "ExamTree preparation guides, notifications, cutoffs, syllabus updates, and current affairs hub.", { robots: "noindex,follow" });

  return (
    <PublicPage
      eyebrow="Preparation hub"
      title="Lightweight blog structure for exam updates."
      description="Future-ready space for preparation guides, notifications, cutoffs, syllabus updates, current affairs, and exam strategies."
    >
      <SeoRouteGrid routes={posts} />
    </PublicPage>
  );
}
