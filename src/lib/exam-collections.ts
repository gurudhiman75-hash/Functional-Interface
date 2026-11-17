export type ExamCollection = {
  slug: string; title: string; headline: string; description: string; examples: string[];
  theme: "emerald" | "copper" | "navy" | "plum";
  groups: { title: string; description: string; exams: string[] }[];
  plan: { title: string; description: string }[];
};

export const EXAM_COLLECTIONS: ExamCollection[] = [
  {
    slug: "punjab-government", title: "Punjab Government Exams",
    headline: "Your next opportunity in Punjab",
    description: "Find your route into Punjab administration, police, office work and technical services.",
    examples: ["PSSSB", "Punjab Police", "Punjab PCS"], theme: "emerald",
    groups: [
      { title: "Administration & revenue", description: "Explore state administration and revenue roles.", exams: ["punjab-pcs", "punjab-naib-tehsildar", "punjab-patwari", "psssb-excise-taxation-inspector"] },
      { title: "Police & uniformed services", description: "Compare the written exam, physical stages and role-specific requirements.", exams: ["punjab-police-constable", "punjab-police-si", "punjab-jail-warder", "punjab-police-intelligence-assistant"] },
      { title: "Office & community roles", description: "Browse clerical, assistant and village development preparation.", exams: ["psssb-clerk", "psssb-senior-assistant", "psssb-vdo"] },
      { title: "Power & technical services", description: "Explore trade-specific and accounting pathways.", exams: ["pspcl-alm", "pspcl-revenue-accountant"] },
    ],
    plan: [
      { title: "Build your Punjab GK base", description: "Revise Punjab history, geography, culture and administration alongside general awareness." },
      { title: "Practise in your exam language", description: "Use the languages available in each test and strengthen Punjabi where your exam requires it." },
      { title: "Add role-specific preparation", description: "Check typing, physical, trade and subject requirements in the official notice for your chosen post." },
    ],
  },
  {
    slug: "after-class-12", title: "Exams After Class 12",
    headline: "Finished Class 12? Explore your options",
    description: "Start with higher-secondary routes and choose preparation that suits the work you want to do.",
    examples: ["SSC CHSL", "SSC Stenographer"], theme: "copper",
    groups: [
      { title: "Clerical & data-entry routes", description: "Explore CHSL posts and check the qualification and skill-test requirements for each role.", exams: ["ssc-chsl"] },
      { title: "Stenography routes", description: "Combine written-exam preparation with the stenography skill required for the post.", exams: ["ssc-stenographer"] },
    ],
    plan: [
      { title: "Choose a job route first", description: "Read the role and selection stages before deciding which exam to target." },
      { title: "Build written-exam fundamentals", description: "Follow the exam syllabus and practise English, reasoning and general awareness; add maths where required." },
      { title: "Prepare for the skill stage", description: "Plan typing, data-entry or stenography practice alongside the written test, according to the post." },
    ],
  },
  {
    slug: "for-graduates", title: "Exams for Graduates",
    headline: "One degree. More career possibilities.",
    description: "Explore graduate-entry pathways across central government, banking and Punjab administration.",
    examples: ["SSC CGL", "IBPS PO", "Punjab PCS"], theme: "navy",
    groups: [
      { title: "Central government", description: "Explore graduate-level government and police officer routes.", exams: ["ssc-cgl", "ssc-cpo"] },
      { title: "Banking", description: "Compare officer and clerical routes, then prepare for the relevant stages.", exams: ["ibps-po", "ibps-clerk", "sbi-po", "sbi-clerk", "ibps-rrb-po", "ibps-rrb-office-assistant"] },
      { title: "Punjab administration", description: "Explore state services and revenue administration.", exams: ["punjab-pcs", "punjab-naib-tehsildar", "punjab-patwari"] },
    ],
    plan: [
      { title: "Choose your primary exam", description: "Use its syllabus and selection stages to set your study priorities." },
      { title: "Keep a related backup", description: "Choose another route with shared subjects so your preparation carries across." },
      { title: "Check post-specific conditions", description: "A degree alone may not cover subject, skill, language or physical requirements. Read the official notice." },
    ],
  },
  {
    slug: "shared-preparation", title: "Prepare for Multiple Exams",
    headline: "Make your preparation go further",
    description: "Build a shared foundation, then add the topics and test strategy each exam needs.",
    examples: ["SSC CGL + CHSL", "IBPS + SBI"], theme: "plum",
    groups: [
      { title: "SSC CGL + CHSL", description: "Build a foundation in maths, reasoning, English and general awareness, then adapt to each paper and skill stage.", exams: ["ssc-cgl", "ssc-chsl"] },
      { title: "Banking officer exams", description: "Reuse your aptitude, reasoning and English practice, then prepare separately for each Mains pattern.", exams: ["ibps-po", "sbi-po", "ibps-rrb-po"] },
      { title: "Banking clerical exams", description: "Build accuracy and speed across common subjects while checking language and stage requirements.", exams: ["ibps-clerk", "sbi-clerk", "ibps-rrb-office-assistant"] },
    ],
    plan: [
      { title: "Study the shared foundation", description: "Compare official syllabi and mark the topics common to your chosen exams." },
      { title: "Add the differences", description: "Keep a separate checklist for extra topics, skill stages, languages and exam-specific awareness." },
      { title: "Take separate full mocks", description: "Practise each exam's timing, marks and section rules. Shared subjects do not mean identical papers." },
    ],
  },
];

export function getExamCollection(slug: string | undefined) {
  return EXAM_COLLECTIONS.find((item) => item.slug === slug);
}
