import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

const filters = [
  ["Exam filters", "SSC CGL PYQs, Punjab Police PYQs, IBPS PO PYQs, PSSSB PYQs, and future RRB collections."],
  ["Year filters", "Future-ready organization by year, shift, exam, and paper type."],
  ["Topic filters", "Reasoning, Quant, GK, Computer Awareness, Punjabi, English, and sectional PYQ sets."],
];

export default function PYQHub() {
  usePageMeta("PYQ Hub", "Discover previous year questions by exam, year, topic, and future PDF collections.", { robots: "noindex,follow" });

  return (
    <PublicPage
      eyebrow="Previous year questions"
      title="A dedicated PYQ hub for exam-wise revision."
      description="Designed for SSC CGL PYQs, Punjab Police PYQs, IBPS PO PYQs, and future topic-wise PYQ pages."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {filters.map(([title, text]) => (
          <PublicCard key={title} title={title}>{text}</PublicCard>
        ))}
      </div>
    </PublicPage>
  );
}
