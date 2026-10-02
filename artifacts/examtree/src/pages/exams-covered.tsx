import { PublicPage, SeoRouteGrid, usePageMeta } from "@/components/PublicPage";

const exams = [
  { label: "SSC CGL", href: "/ssc-cgl", description: "Open the SSC CGL preparation hub for syllabus guidance, free topic questions, and published SSC mock tests." },
  { label: "SSC CHSL", href: "/ssc-chsl", description: "Open the SSC CHSL preparation hub for Tier-I and Tier-II guidance, free topic questions, and published SSC mock tests." },
  { label: "SSC MTS", href: "/ssc-mts", description: "Prepare for MTS and Havaldar with session-based CBE guidance, free topic questions, and SSC mock tests." },
  { label: "SSC CPO", href: "/ssc-cpo", description: "Prepare for the Sub-Inspector examination with Paper-I practice, physical-stage planning, and mock tests." },
  { label: "SSC Stenographer", href: "/ssc-stenographer", description: "Prepare for Grade C & D with CBE practice plus stenography skill-test guidance." },
  { label: "SSC GD", href: "/ssc-gd", description: "Prepare for the next Constable (GD) cycle with CBE practice, physical-stage planning, and free questions." },
  { label: "Punjab Government Exams", href: "/category/punjab", description: "Browse published Punjab government exam tests, including available reasoning, GK, Punjabi, and computer awareness practice." },
  { label: "PSSSB", href: "/category/punjab", description: "Open the Punjab catalog for published PSSSB and related state-exam preparation when available." },
  { label: "IBPS PO", href: "/ibps-po", description: "Prepare for PO/MT XVI with prelims and mains guidance, free topic questions, and banking mock tests." },
  { label: "IBPS Clerk / CSA", href: "/ibps-clerk", description: "Prepare for the current Customer Service Associate recruitment with prelims and mains guidance, free questions, and banking mocks." },
  { label: "IBPS & Banking", href: "/category/banking", description: "Browse the wider published banking mock-test catalog and available practice." },
  { label: "Railways", href: "/category/railways", description: "Browse railway exam tests and practice sets currently published in the ExamTree catalog." },
];

export default function ExamsCovered() {
  usePageMeta("Exams Covered", "Explore exam categories represented in the current ExamTree catalog, including SSC, Punjab government, banking, and railway exams.");

  return (
    <PublicPage
      eyebrow="Exams covered"
      title="Choose an exam family and browse available preparation."
      description="Explore exam categories represented in the published catalog. Available tests and sections vary as new content is released."
    >
      <SeoRouteGrid routes={exams} />
    </PublicPage>
  );
}
