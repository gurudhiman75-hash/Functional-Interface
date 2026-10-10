import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PublicPage, usePageMeta } from "@/components/PublicPage";

const faqs = [
  ["What is ExamTree?", "ExamTree is an exam preparation platform focused on mock tests, PYQs, multilingual practice, and deep performance analytics."],
  ["What is the difference between PYQs and generated questions?", "PYQs are previous year questions or PYQ-style preserved items. Generated questions are created from structured logic or knowledge systems and reviewed before publication."],
  ["How does multilingual support work?", "Where available, questions can be reviewed and served in English, Hindi, and Punjabi using verified multilingual content."],
  ["Which exams are supported?", "ExamTree is structured for SSC, Banking, Punjab State exams, RRB, Computer Awareness, General Knowledge, Quant, and Reasoning practice."],
  ["How do mock tests work?", "Mock tests follow exam-like timing and question structure. Your attempts feed analytics and review workflows."],
  ["How do rankings work?", "Rankings depend on submitted attempts, scores, timing, and test participation data where leaderboard features are enabled."],
  ["Is Punjabi supported?", "Yes. Punjabi support is part of the platform roadmap and is available where verified Punjabi content exists."],
];

export default function FAQ() {
  usePageMeta("FAQ", "Frequently asked questions about ExamTree mock tests, PYQs, multilingual support, and rankings.");

  return (
    <PublicPage
      eyebrow="FAQ"
      title="Questions students ask before starting."
      description="Clear answers about mocks, PYQs, multilingual content, exam coverage, ranking, and support."
    >
      <Accordion type="single" collapsible className="rounded-2xl border border-slate-200 bg-white px-4">
        {faqs.map(([question, answer], index) => (
          <AccordionItem key={question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left font-semibold text-slate-950">{question}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-slate-600">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PublicPage>
  );
}

