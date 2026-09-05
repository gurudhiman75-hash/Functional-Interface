import "@/styles/home-section-rhythm.css";

import type { Category, DailyChallenge, Subcategory, Test } from "@/lib/data";
import type { StudentSeriesSummary } from "@/lib/test-series";

type SampleExamDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subExams: [string, string];
};

const EXAMS: SampleExamDefinition[] = [
  { id: "sample-ssc", name: "SSC", description: "SSC graduate and higher-secondary exams", icon: "Landmark", color: "blue", subExams: ["SSC CGL", "SSC CHSL"] },
  { id: "sample-banking", name: "Banking", description: "IBPS, SBI and banking recruitment exams", icon: "Banknote", color: "teal", subExams: ["IBPS PO", "SBI Clerk"] },
  { id: "sample-railways", name: "Railways", description: "RRB technical and non-technical recruitment", icon: "Building2", color: "sky", subExams: ["RRB NTPC", "RRB Group D"] },
  { id: "sample-punjab", name: "Punjab Govt Exams", description: "Punjab state recruitment and police exams", icon: "BadgeCheck", color: "amber", subExams: ["Punjab Patwari", "Punjab Police"] },
  { id: "sample-teaching", name: "Teaching", description: "Teacher eligibility and recruitment exams", icon: "GraduationCap", color: "violet", subExams: ["CTET", "Punjab TET"] },
  { id: "sample-defence", name: "Defence", description: "Defence officer and aptitude exams", icon: "BriefcaseBusiness", color: "rose", subExams: ["NDA", "AFCAT"] },
  { id: "sample-engineering", name: "Engineering", description: "Graduate and junior engineering recruitment", icon: "Monitor", color: "cyan", subExams: ["GATE", "JE Exams"] },
];

export const SAMPLE_HOME_CATEGORIES: Category[] = EXAMS.map((exam) => ({
  id: exam.id,
  name: exam.name,
  description: exam.description,
  icon: exam.icon,
  color: exam.color,
  testsCount: 14,
}));

export const SAMPLE_HOME_SUBCATEGORIES: Subcategory[] = EXAMS.flatMap((exam) => exam.subExams.map((name, index) => ({
  id: `${exam.id}-sub-${index + 1}`,
  categoryId: exam.id,
  categoryName: exam.name,
  name,
  description: `${name} preparation pathway`,
  icon: exam.icon,
  languages: exam.id === "sample-punjab" ? ["en", "hi", "pa"] : ["en", "hi"],
})));

const SUBJECTS = [
  "Quantitative Aptitude",
  "Reasoning Ability",
  "English Language",
  "General Awareness",
  "Computer Awareness",
] as const;

const KINDS = ["full-length", "sectional", "topic-wise"] as const;

function specialName(examIndex: number, index: number, fallback: string) {
  const key = `${examIndex}:${index}`;
  const names: Record<string, string> = {
    "0:0": "SSC CGL Tier-I 2025 PYQ",
    "0:1": "SSC CGL Full Mock 01",
    "0:3": "Daily Quant Challenge — Percentages & Ratio",
    "1:0": "IBPS PO Prelims 2025 Memory Based PYQ",
    "1:1": "IBPS PO Quant Sectional Test 01",
    "1:3": "Daily Current Affairs Quiz — Banking & Economy",
    "2:0": "RRB NTPC 2025 PYQ",
    "2:1": "RRB NTPC Full Mock 01",
    "2:3": "Daily Reasoning Speed Drill",
    "3:0": "Punjab Patwari 2024 PYQ",
    "3:1": "Punjab Patwari Full Mock 01",
    "4:0": "CTET Paper I 2025 PYQ",
    "4:1": "CTET Paper I Full Mock 01",
    "5:0": "NDA 2025 General Ability PYQ",
    "5:1": "NDA Full Mock 01",
    "6:0": "GATE General Aptitude 2025 PYQ",
    "6:1": "JE Engineering Aptitude Full Mock 01",
  };
  return names[key] ?? fallback;
}

export const SAMPLE_HOME_TESTS: Test[] = EXAMS.flatMap((exam, examIndex) => Array.from({ length: 14 }, (_, index) => {
  const subcategoryIndex = index % 2;
  const subcategory = SAMPLE_HOME_SUBCATEGORIES.find((item) => item.id === `${exam.id}-sub-${subcategoryIndex + 1}`)!;
  const kind = index === 3 && examIndex < 3 ? "topic-wise" : KINDS[index % KINDS.length];
  const subject = SUBJECTS[(examIndex + index) % SUBJECTS.length];
  const fallback = `${subcategory.name} ${kind === "full-length" ? "Full Mock" : kind === "sectional" ? `${subject} Sectional Test` : `${subject} Topic Practice`} ${String(index + 1).padStart(2, "0")}`;
  const id = `sample-test-${examIndex + 1}-${String(index + 1).padStart(2, "0")}`;
  const highSignal = index <= 3;
  return {
    id,
    name: specialName(examIndex, index, fallback),
    category: exam.name,
    categoryName: exam.name,
    categoryId: exam.id,
    subcategoryId: subcategory.id,
    subcategoryName: subcategory.name,
    access: index % 4 === 0 ? "paid" : "free",
    priceCents: index % 4 === 0 ? 19900 : null,
    kind,
    duration: kind === "full-length" ? 120 : kind === "sectional" ? 35 : 20,
    totalQuestions: kind === "full-length" ? 100 : kind === "sectional" ? 40 : 20,
    attempts: highSignal ? 18400 - examIndex * 1350 - index * 730 : 850 + ((examIndex + 2) * (index + 5) * 43),
    avgScore: 52 + ((examIndex * 3 + index) % 24),
    difficulty: index % 5 === 0 ? "Hard" : index % 2 === 0 ? "Medium" : "Easy",
    sections: [{ id: `${id}-section`, name: subject, questions: [] }],
    languages: exam.id === "sample-punjab" ? ["en", "hi", "pa"] : index % 3 === 0 ? ["en", "hi"] : ["en"],
    marksPerQuestion: 1,
    negativeMarks: 0.25,
    unattemptedMarks: 0,
  } satisfies Test;
}));

export const SAMPLE_HOME_SERIES: StudentSeriesSummary[] = [
  {
    id: "sample-series-ssc-cgl",
    code: "SAMPLE-SSC-CGL",
    name: "SSC CGL 2026 Complete Mock Series",
    description: "Sample preview series",
    availabilityStartAt: null,
    availabilityEndAt: null,
    progressionMode: "open",
    completionThreshold: null,
    examCode: "SSC-CGL",
    examName: "SSC CGL",
    examFamilyCode: "SSC",
    examFamilyName: "SSC",
    testCount: 28,
    liveTestCount: 28,
    fullLengthTestCount: 20,
    durationSeconds: 201600,
    questionCount: 2800,
    attemptCount: 28740,
  },
  {
    id: "sample-series-ibps-po",
    code: "SAMPLE-IBPS-PO",
    name: "IBPS PO 2026 Prelims + Mains Series",
    description: "Sample preview series",
    availabilityStartAt: null,
    availabilityEndAt: null,
    progressionMode: "open",
    completionThreshold: null,
    examCode: "IBPS-PO",
    examName: "IBPS PO",
    examFamilyCode: "BANKING",
    examFamilyName: "Banking",
    testCount: 24,
    liveTestCount: 24,
    fullLengthTestCount: 16,
    durationSeconds: 172800,
    questionCount: 2400,
    attemptCount: 23180,
  },
  {
    id: "sample-series-rrb-ntpc",
    code: "SAMPLE-RRB-NTPC",
    name: "RRB NTPC Graduate Level Master Series",
    description: "Sample preview series",
    availabilityStartAt: null,
    availabilityEndAt: null,
    progressionMode: "open",
    completionThreshold: null,
    examCode: "RRB-NTPC",
    examName: "RRB NTPC",
    examFamilyCode: "RAILWAYS",
    examFamilyName: "Railways",
    testCount: 20,
    liveTestCount: 20,
    fullLengthTestCount: 14,
    durationSeconds: 144000,
    questionCount: 2000,
    attemptCount: 19420,
  },
  {
    id: "sample-series-punjab-patwari",
    code: "SAMPLE-PUNJAB-PATWARI",
    name: "Punjab Patwari Complete Preparation Series",
    description: "Sample preview series",
    availabilityStartAt: null,
    availabilityEndAt: null,
    progressionMode: "open",
    completionThreshold: null,
    examCode: "PUNJAB-PATWARI",
    examName: "Punjab Patwari",
    examFamilyCode: "PUNJAB",
    examFamilyName: "Punjab Govt Exams",
    testCount: 18,
    liveTestCount: 18,
    fullLengthTestCount: 12,
    durationSeconds: 129600,
    questionCount: 1800,
    attemptCount: 12860,
  },
];

export const SAMPLE_HOME_DAILY_CHALLENGE: DailyChallenge = {
  testId: "sample-test-1-04",
  testName: "Daily Quant Challenge — Percentages & Ratio",
  date: "2026-08-24",
  totalParticipants: 3248,
};
