import { PublicPage, SeoRouteGrid, usePageMeta } from "@/components/PublicPage";

const exams = [
  { label: "SSC", href: "/category/ssc", description: "Browse published SSC mock tests and available practice pathways in the current ExamTree catalog." },
  { label: "Punjab Government Exams", href: "/category/punjab", description: "Browse published Punjab government exam tests, including available reasoning, GK, Punjabi, and computer awareness practice." },
  { label: "PSSSB", href: "/category/punjab", description: "Open the Punjab catalog for published PSSSB and related state-exam preparation when available." },
  { label: "IBPS & Banking", href: "/category/banking", description: "Browse published banking mock tests and available reasoning, quant, and computer awareness practice." },
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
