import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

export default function Accessibility() {
  usePageMeta("Accessibility", "ExamTree accessibility statement covering keyboard access, readable interfaces, responsive layouts, and accessibility feedback.");

  return (
    <PublicPage
      eyebrow="Accessibility"
      title="Accessibility at ExamTree"
      description="We aim to make exam preparation usable across keyboards, screen sizes, zoom levels, and assistive technologies."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PublicCard title="Our approach">
          ExamTree works to provide semantic page structure, keyboard-accessible controls, visible focus states, readable contrast, responsive layouts, and interfaces that remain usable when text or page zoom is increased.
        </PublicCard>
        <PublicCard title="Mock-test experience">
          Timed test interfaces require special care. We aim to keep navigation, question controls, dialogs, status information, and submission actions understandable without relying on color alone.
        </PublicCard>
        <PublicCard title="Known limitations">
          Some legacy, third-party, mathematical, chart, diagram, or rapidly evolving content may not yet provide an equivalent experience in every assistive technology or browser combination.
        </PublicCard>
        <PublicCard title="Report an accessibility issue">
          Email support@examtree.in with the page or feature, device/browser, assistive technology if relevant, and the barrier you encountered. Please do not include passwords, OTPs, or payment secrets.
        </PublicCard>
      </div>
    </PublicPage>
  );
}
