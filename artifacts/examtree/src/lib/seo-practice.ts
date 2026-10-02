export type SeoPracticeTopic = {
  slug: string;
  name: string;
  subject: string;
  summary: string;
  preparationTip: string;
};

export type ExamSyllabusSection = {
  title: string;
  summary: string;
};

export type ExamPatternCard = {
  title: string;
  text: string;
};

export type ExamAcquisitionConfig = {
  slug: string;
  name: string;
  yearLabel: string;
  categoryHref: string;
  officialUrl: string;
  officialLabel: string;
  meta: {
    hubTitle: string;
    hubDescription: string;
    preparationTitle: string;
    preparationDescription: string;
    syllabusTitle: string;
    syllabusDescription: string;
  };
  hub: {
    title: string;
    description: string;
    preparationSummary: string;
    syllabusSummary: string;
    mockSummary: string;
  };
  preparation: {
    eyebrow: string;
    title: string;
    description: string;
    cards: { title: string; text: string }[];
    weeklyCycle: string[];
  };
  syllabus: {
    eyebrow: string;
    title: string;
    description: string;
    sections: ExamSyllabusSection[];
    patternCards: ExamPatternCard[];
    verificationNote: string;
  };
  topics: SeoPracticeTopic[];
};

const SSC_CGL_TOPICS: SeoPracticeTopic[] = [
  {
    slug: "percentage",
    name: "Percentage",
    subject: "Quantitative Aptitude",
    summary: "Practice percentage change, comparison, successive percentage and application-based questions.",
    preparationTip: "Build speed on fraction-percentage equivalents before moving to successive change and word problems.",
  },
  {
    slug: "profit-and-loss",
    name: "Profit and Loss",
    subject: "Quantitative Aptitude",
    summary: "Practice cost price, selling price, marked price, discount and profit-loss applications.",
    preparationTip: "Translate every question into cost price, selling price and percentage relationships before calculating.",
  },
  {
    slug: "average",
    name: "Average",
    subject: "Quantitative Aptitude",
    summary: "Practice basic averages, replacement, combined average and weighted-value questions.",
    preparationTip: "Use total = average × number of items as the base relation for most average problems.",
  },
  {
    slug: "ratio-and-proportion",
    name: "Ratio and Proportion",
    subject: "Quantitative Aptitude",
    summary: "Practice ratios, direct proportion, inverse proportion and distribution-based questions.",
    preparationTip: "Keep ratios in reduced form and convert them into common multipliers before comparing quantities.",
  },
  {
    slug: "time-and-work",
    name: "Time and Work",
    subject: "Quantitative Aptitude",
    summary: "Practice work efficiency, combined work, wages and work-completion questions.",
    preparationTip: "Convert time into one-day work or use an LCM-based total-work model for cleaner arithmetic.",
  },
  {
    slug: "time-speed-distance",
    name: "Time, Speed and Distance",
    subject: "Quantitative Aptitude",
    summary: "Practice speed, relative speed, trains, journeys and time-distance applications.",
    preparationTip: "Keep units consistent first; then decide whether the problem is a direct S = D/T relation or a relative-speed case.",
  },
  {
    slug: "number-system",
    name: "Number System",
    subject: "Quantitative Aptitude",
    summary: "Practice divisibility, remainders, factors, multiples and number-property questions.",
    preparationTip: "Revise divisibility and remainder properties because they repeatedly reduce otherwise lengthy calculations.",
  },
  {
    slug: "syllogism",
    name: "Syllogism",
    subject: "Reasoning",
    summary: "Practice conclusion-based syllogism questions using statement relationships and valid inference.",
    preparationTip: "Judge only what follows necessarily from the statements; do not add real-world assumptions.",
  },
  {
    slug: "coding-decoding",
    name: "Coding-Decoding",
    subject: "Reasoning",
    summary: "Practice letter, word, symbol and pattern-based coding-decoding questions.",
    preparationTip: "Identify the transformation rule before testing options; avoid forcing a pattern from a single letter pair.",
  },
  {
    slug: "indian-polity",
    name: "Indian Polity",
    subject: "General Awareness",
    summary: "Practice Constitution, institutions, offices, rights, duties and governance questions.",
    preparationTip: "Revise constitutional provisions by theme and connect articles with institutions rather than memorising isolated facts.",
  },
];

export const EXAM_ACQUISITION_CONFIGS: Record<string, ExamAcquisitionConfig> = {
  "ssc-cgl": {
    slug: "ssc-cgl",
    name: "SSC CGL",
    yearLabel: "2026",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC CGL Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for SSC CGL with exam guidance, syllabus overview, mock tests, and free topic-wise practice questions on ExamTree.",
      preparationTitle: "How to Prepare for SSC CGL 2026",
      preparationDescription: "A practical SSC CGL 2026 preparation guide covering study order, topic practice, revision, mocks, and error analysis.",
      syllabusTitle: "SSC CGL Syllabus & Tier-I Exam Pattern 2026",
      syllabusDescription: "SSC CGL 2026 Tier-I syllabus overview, subject structure, marking pattern, and preparation links based on the official SSC notice.",
    },
    hub: {
      title: "SSC CGL preparation hub",
      description: "Use one place for preparation strategy, syllabus guidance, mock tests, and free topic-wise questions.",
      preparationSummary: "Build a practical study order across Quantitative Aptitude, Reasoning, General Awareness, and English.",
      syllabusSummary: "Review the current Tier-I structure and major preparation areas before planning your practice.",
      mockSummary: "Move from topic practice to timed exam-style attempts using the published ExamTree catalogue.",
    },
    preparation: {
      eyebrow: "SSC CGL preparation",
      title: "How to prepare for SSC CGL 2026",
      description: "A practical preparation workflow built around concept coverage, repeated question practice, timed mocks, and review.",
      cards: [
        { title: "1. Build the base", text: "Start with the recurring core topics in Quant and Reasoning while keeping English and General Awareness in daily rotation." },
        { title: "2. Practise by topic", text: "After learning a concept, solve a small focused set immediately. Accuracy should become stable before you chase speed." },
        { title: "3. Convert practice into mocks", text: "Add sectional and full-length timed attempts, then maintain an error log for concepts, calculation mistakes, guesses, and time traps." },
      ],
      weeklyCycle: [
        "Learn or revise one focused concept block.",
        "Solve 10-20 targeted questions from that topic.",
        "Rework every incorrect or guessed question without looking at the answer.",
        "Take timed sectional practice during the week.",
        "Take a full mock at regular intervals and review it more carefully than you attempted it.",
        "Revisit weak topics using fresh questions instead of repeatedly reading notes.",
      ],
    },
    syllabus: {
      eyebrow: "SSC CGL syllabus",
      title: "SSC CGL syllabus and Tier-I pattern 2026",
      description: "A learner-friendly overview based on the SSC Combined Graduate Level Examination 2026 notice. Always verify time-sensitive changes on the official SSC website.",
      sections: [
        { title: "General Intelligence & Reasoning", summary: "25 questions · 50 marks" },
        { title: "General Awareness", summary: "25 questions · 50 marks" },
        { title: "Quantitative Aptitude", summary: "25 questions · 50 marks" },
        { title: "English Comprehension", summary: "25 questions · 50 marks" },
      ],
      patternCards: [
        { title: "Tier-I format", text: "Tier-I is an objective computer-based examination. The 2026 notice lists 100 questions for 200 marks across the four subjects above." },
        { title: "Timing", text: "The 2026 notice provides one hour for Tier-I, with sectional timing specified by SSC. Candidates eligible for a scribe receive the applicable extra time under the notice." },
        { title: "Negative marking", text: "The 2026 SSC CGL notice states a deduction of 0.50 marks for each wrong answer in Tier-I." },
      ],
      verificationNote: "Recruitment rules and schedules can change. Check the latest Combined Graduate Level notice on the official SSC website before relying on dates, eligibility, vacancies, or detailed scheme provisions.",
    },
    topics: SSC_CGL_TOPICS,
  },
};

export const SSC_CGL_PRACTICE_TOPICS = EXAM_ACQUISITION_CONFIGS["ssc-cgl"].topics;

export function getExamAcquisitionConfig(slug: string | undefined) {
  return slug ? EXAM_ACQUISITION_CONFIGS[slug] : undefined;
}

export function findPracticeTopic(examSlug: string, topicSlug: string | undefined) {
  return getExamAcquisitionConfig(examSlug)?.topics.find((topic) => topic.slug === topicSlug);
}

export function findSscCglPracticeTopic(slug: string | undefined) {
  return findPracticeTopic("ssc-cgl", slug);
}

export function examHubHref(examSlug: string) {
  return "/" + examSlug;
}

export function examPreparationHref(examSlug: string) {
  return "/" + examSlug + "-preparation";
}

export function examSyllabusHref(examSlug: string) {
  return "/" + examSlug + "-syllabus";
}

export function practiceTopicHref(slug: string, examSlug = "ssc-cgl") {
  return "/" + examSlug + "/questions/" + slug;
}
