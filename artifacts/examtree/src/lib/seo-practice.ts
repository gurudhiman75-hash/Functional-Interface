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

const SSC_STENO_TOPICS: SeoPracticeTopic[] = SSC_CGL_TOPICS.filter((topic) =>
  ["syllogism", "coding-decoding", "indian-polity"].includes(topic.slug),
);

const SSC_GD_TOPICS: SeoPracticeTopic[] = SSC_CGL_TOPICS.filter((topic) =>
  ["percentage", "average", "ratio-and-proportion", "time-and-work", "time-speed-distance", "number-system", "coding-decoding", "indian-polity"].includes(topic.slug),
);

const BANKING_PRACTICE_TOPICS: SeoPracticeTopic[] = SSC_CGL_TOPICS.filter((topic) =>
  ["percentage", "profit-and-loss", "average", "ratio-and-proportion", "time-and-work", "time-speed-distance", "number-system", "syllogism", "coding-decoding"].includes(topic.slug),
);

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
  "ssc-chsl": {
    slug: "ssc-chsl",
    name: "SSC CHSL",
    yearLabel: "2026",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC CHSL Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for SSC CHSL with exam guidance, syllabus and pattern overview, mock tests, and free topic-wise practice questions on ExamTree.",
      preparationTitle: "How to Prepare for SSC CHSL 2026",
      preparationDescription: "A practical SSC CHSL 2026 preparation guide covering Tier-I fundamentals, topic practice, revision, mocks, and Tier-II skill readiness.",
      syllabusTitle: "SSC CHSL Syllabus & Exam Pattern 2026",
      syllabusDescription: "SSC CHSL 2026 syllabus and exam-pattern overview covering Tier-I subjects, Tier-II modules, negative marking, and skill or typing requirements.",
    },
    hub: {
      title: "SSC CHSL preparation hub",
      description: "Use one place for preparation strategy, syllabus guidance, mock tests, and free topic-wise questions for SSC CHSL.",
      preparationSummary: "Build speed and accuracy across English, General Intelligence, Quantitative Aptitude, and General Awareness, then prepare for Tier-II requirements.",
      syllabusSummary: "Review the Tier-I subject structure, Tier-II modules, negative marking, and skill or typing stage before planning your preparation.",
      mockSummary: "Move from focused topic practice to timed SSC-style attempts using the published ExamTree catalogue.",
    },
    preparation: {
      eyebrow: "SSC CHSL preparation",
      title: "How to prepare for SSC CHSL 2026",
      description: "Build reliable Tier-I fundamentals first, then add timed practice, mock analysis, and the Tier-II computer and skill or typing requirements.",
      cards: [
        { title: "1. Secure Tier-I basics", text: "Build clean fundamentals in basic arithmetic, General Intelligence, English, and General Awareness before pushing speed." },
        { title: "2. Practise in short timed blocks", text: "CHSL rewards quick, accurate decisions. Use focused sets to improve calculation speed, vocabulary, reasoning recognition, and recall." },
        { title: "3. Prepare beyond Tier-I", text: "Keep Tier-II in view by practising computer knowledge and, where applicable, typing or data-entry skill alongside written preparation." },
      ],
      weeklyCycle: [
        "Revise one Quant or Reasoning concept and solve a focused question set.",
        "Practise English every day through grammar, vocabulary, comprehension, and error-based review.",
        "Revise General Awareness in small recurring blocks instead of one large weekly session.",
        "Use timed mixed sets to adapt to the current sectional-timer structure.",
        "Take a full mock regularly and classify every error as concept, calculation, recall, reading, or time-management.",
        "Keep computer knowledge and the relevant typing or data-entry skill in the weekly schedule for Tier-II.",
      ],
    },
    syllabus: {
      eyebrow: "SSC CHSL syllabus",
      title: "SSC CHSL syllabus and exam pattern 2026",
      description: "A learner-friendly overview of the current SSC CHSL structure. Always verify time-sensitive rules and detailed provisions in the latest official SSC notice.",
      sections: [
        { title: "English Language", summary: "Tier-I: 25 questions · 50 marks" },
        { title: "General Intelligence", summary: "Tier-I: 25 questions · 50 marks" },
        { title: "Quantitative Aptitude", summary: "Tier-I: 25 questions · 50 marks" },
        { title: "General Awareness", summary: "Tier-I: 25 questions · 50 marks" },
      ],
      patternCards: [
        { title: "Tier-I", text: "The current 2026 pattern uses 100 objective questions for 200 marks across four parts, with a 15-minute timer for each part and 0.50 mark deducted for each wrong answer." },
        { title: "Tier-II", text: "Tier-II covers Mathematical Abilities, Reasoning and General Intelligence, English Language and Comprehension, General Awareness, and a qualifying Computer Knowledge Test." },
        { title: "Skill / Typing", text: "The final skill component is qualifying: a Data Entry Skill Test applies to DEO posts, while a Typing Test applies to LDC/JSA posts, subject to the official notice." },
      ],
      verificationNote: "Recruitment dates, vacancies, eligibility rules, language options, skill-test standards, and other detailed provisions can change. Check the latest Combined Higher Secondary Level notice on the official SSC website before relying on them.",
    },
    topics: SSC_CGL_TOPICS,
  },
  "ssc-mts": {
    slug: "ssc-mts",
    name: "SSC MTS",
    yearLabel: "2026",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC MTS Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for SSC MTS 2026 with syllabus guidance, mock tests, and free topic-wise questions on ExamTree.",
      preparationTitle: "How to Prepare for SSC MTS 2026",
      preparationDescription: "A practical SSC MTS 2026 preparation guide covering numerical ability, reasoning, English, general awareness, timed practice, and review.",
      syllabusTitle: "SSC MTS Syllabus & Exam Pattern 2026",
      syllabusDescription: "SSC MTS 2026 syllabus and exam-pattern overview with session-based preparation guidance and official SSC verification.",
    },
    hub: {
      title: "SSC MTS preparation hub",
      description: "Use one place for SSC MTS preparation strategy, syllabus guidance, mock tests, and free topic-wise practice.",
      preparationSummary: "Build reliable basics in Numerical Ability, Reasoning, English, and General Awareness before increasing speed.",
      syllabusSummary: "Review the session-based CBE structure and the subjects you need to cover before planning revision.",
      mockSummary: "Move from topic practice to timed SSC-style attempts using the published ExamTree catalogue.",
    },
    preparation: {
      eyebrow: "SSC MTS preparation",
      title: "How to prepare for SSC MTS 2026",
      description: "Prioritise basic arithmetic, reasoning accuracy, English fundamentals, and General Awareness, then convert them into timed session practice.",
      cards: [
        { title: "1. Strengthen basics", text: "Start with school-level arithmetic and high-frequency reasoning patterns before attempting mixed timed sets." },
        { title: "2. Balance both sessions", text: "Do not neglect English or General Awareness while focusing on numerical and reasoning practice; prepare each section deliberately." },
        { title: "3. Review mistakes", text: "Track calculation, reading, recall, and time-management errors after every timed set and full mock." },
      ],
      weeklyCycle: [
        "Revise one basic arithmetic topic and solve a focused set.",
        "Practise one reasoning pattern daily with emphasis on accuracy.",
        "Keep English grammar, vocabulary, and comprehension in regular rotation.",
        "Revise General Awareness in short repeated blocks.",
        "Take session-style timed practice and review every wrong or guessed response.",
        "For Havaldar targets, keep the physical stage in view alongside CBE preparation.",
      ],
    },
    syllabus: {
      eyebrow: "SSC MTS syllabus",
      title: "SSC MTS syllabus and exam pattern 2026",
      description: "A learner-friendly overview for the 2026 MTS and Havaldar cycle. Verify exact 2026 timings, marking, and physical-stage requirements in the latest SSC notice.",
      sections: [
        { title: "Numerical & Mathematical Ability", summary: "Core arithmetic and basic numerical problem solving" },
        { title: "Reasoning Ability & Problem Solving", summary: "Verbal and non-verbal reasoning fundamentals" },
        { title: "General Awareness", summary: "Static GK, current awareness, and everyday science/social awareness" },
        { title: "English Language & Comprehension", summary: "Basic grammar, vocabulary, usage, and comprehension" },
      ],
      patternCards: [
        { title: "Session-based CBE", text: "Recent SSC MTS examinations use two mandatory computer-based sessions on the same day. Prepare for both rather than treating one section as optional." },
        { title: "Marking", text: "Recent MTS notices have used different negative-marking rules across the two sessions. Confirm the exact 2026 rule in the current official notice before exam day." },
        { title: "Havaldar stage", text: "Candidates targeting Havaldar posts should also verify the applicable physical efficiency and physical standard requirements in the current notice." },
      ],
      verificationNote: "SSC lists the Multi-Tasking (Non-Technical) Staff & Havaldar Examination, 2026 in its 2026-27 examination calendar. Check the latest official notice for exact session timings, marking, vacancies, eligibility, and physical-stage rules.",
    },
    topics: SSC_CGL_TOPICS,
  },
  "ssc-cpo": {
    slug: "ssc-cpo",
    name: "SSC CPO",
    yearLabel: "2026",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC CPO Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for SSC CPO 2026 with Paper-I guidance, physical-stage planning, mock tests, and free topic-wise questions.",
      preparationTitle: "How to Prepare for SSC CPO 2026",
      preparationDescription: "A practical SSC CPO 2026 preparation guide covering Paper-I, physical readiness, Paper-II English, mocks, and error analysis.",
      syllabusTitle: "SSC CPO Syllabus & Exam Pattern 2026",
      syllabusDescription: "SSC CPO 2026 syllabus and selection-stage overview covering Paper-I, PET/PST, Paper-II, and later verification stages.",
    },
    hub: {
      title: "SSC CPO preparation hub",
      description: "Prepare for the Sub-Inspector examination with written-paper guidance, physical-stage planning, mock tests, and free topic practice.",
      preparationSummary: "Build Paper-I speed across Reasoning, General Knowledge, Quantitative Aptitude, and English while preparing physically in parallel.",
      syllabusSummary: "Understand the written papers and the PET/PST stage so your preparation covers the full selection process.",
      mockSummary: "Use topic practice first, then timed SSC-style mocks to improve speed and decision-making.",
    },
    preparation: {
      eyebrow: "SSC CPO preparation",
      title: "How to prepare for SSC CPO 2026",
      description: "Treat CPO as both an academic and physical selection process: prepare Paper-I, English for Paper-II, and physical standards together.",
      cards: [
        { title: "1. Build Paper-I speed", text: "Practise Reasoning, General Knowledge, Quantitative Aptitude, and English under time pressure after fundamentals are stable." },
        { title: "2. Train for the physical stage", text: "Do not postpone PET/PST preparation until after the written paper; build fitness progressively and verify current standards." },
        { title: "3. Keep Paper-II English active", text: "Maintain grammar, vocabulary, comprehension, and usage practice so Paper-II is not started from scratch later." },
      ],
      weeklyCycle: [
        "Rotate Quant and Reasoning topic practice through the week.",
        "Keep General Awareness revision frequent and cumulative.",
        "Practise English daily for both Paper-I and later Paper-II demands.",
        "Take timed Paper-I mixed sets and full mocks.",
        "Maintain a separate physical-training schedule appropriate to the current PET/PST requirements.",
        "Review official SSC updates for stage dates, standards, and document requirements.",
      ],
    },
    syllabus: {
      eyebrow: "SSC CPO syllabus",
      title: "SSC CPO syllabus and selection pattern 2026",
      description: "A learner-friendly overview of the Sub-Inspector in Delhi Police and CAPFs examination. Verify exact 2026 paper details and physical standards in the current SSC notice.",
      sections: [
        { title: "General Intelligence & Reasoning", summary: "Paper-I preparation area" },
        { title: "General Knowledge & General Awareness", summary: "Paper-I preparation area" },
        { title: "Quantitative Aptitude", summary: "Paper-I preparation area" },
        { title: "English Comprehension", summary: "Paper-I and continued English preparation for Paper-II" },
      ],
      patternCards: [
        { title: "Paper-I", text: "The selection process begins with a computer-based Paper-I covering Reasoning, General Awareness, Quantitative Aptitude, and English." },
        { title: "PET / PST", text: "Candidates qualifying the written stage proceed through applicable Physical Endurance and Physical Standard requirements before later stages." },
        { title: "Paper-II & later stages", text: "The process includes a later English-focused paper and subsequent medical/document stages as prescribed by SSC." },
      ],
      verificationNote: "SSC lists the Sub-Inspector in Delhi Police & Central Armed Police Forces Examination, 2026 in its 2026-27 calendar. Check the current official notice for exact paper timings, marks, negative marking, PET/PST standards, eligibility, and medical requirements.",
    },
    topics: SSC_CGL_TOPICS,
  },
  "ssc-stenographer": {
    slug: "ssc-stenographer",
    name: "SSC Stenographer",
    yearLabel: "2026",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC Stenographer Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for SSC Stenographer Grade C & D 2026 with CBE guidance, stenography skill planning, mock tests, and free practice questions.",
      preparationTitle: "How to Prepare for SSC Stenographer 2026",
      preparationDescription: "A practical SSC Stenographer 2026 guide covering Reasoning, General Awareness, English, sectional timing, and stenography skill practice.",
      syllabusTitle: "SSC Stenographer Syllabus & Exam Pattern 2026",
      syllabusDescription: "SSC Stenographer Grade C & D 2026 syllabus and pattern covering the CBE and qualifying stenography skill test.",
    },
    hub: {
      title: "SSC Stenographer preparation hub",
      description: "Prepare for the Grade C & D CBE and stenography skill test with one consistent practice pathway.",
      preparationSummary: "Prioritise English heavily while maintaining Reasoning and General Awareness, and practise stenography skill throughout.",
      syllabusSummary: "Review the three-part CBE and the Grade C/Grade D stenography speeds before planning your schedule.",
      mockSummary: "Use focused practice followed by timed CBE mocks while continuing stenography dictation and transcription work.",
    },
    preparation: {
      eyebrow: "SSC Stenographer preparation",
      title: "How to prepare for SSC Stenographer 2026",
      description: "Balance the written CBE with continuous shorthand and transcription practice rather than treating the skill test as a later add-on.",
      cards: [
        { title: "1. Prioritise English", text: "English Language & Comprehension carries the largest share of the CBE, so grammar, vocabulary, usage, and comprehension need daily practice." },
        { title: "2. Build sectional control", text: "Practise Reasoning and General Awareness under the current sectional-timer structure so no part depends on time borrowed from another." },
        { title: "3. Practise stenography continuously", text: "Use regular dictation and transcription sessions at the target Grade C or Grade D speed instead of waiting for CBE qualification." },
      ],
      weeklyCycle: [
        "Practise English grammar, vocabulary, and comprehension daily.",
        "Rotate Reasoning patterns through short timed sets.",
        "Revise General Awareness in recurring blocks.",
        "Take sectional and full CBE mocks under the official timing structure.",
        "Schedule multiple shorthand dictation sessions every week.",
        "Transcribe on computer and track both speed and error rate.",
      ],
    },
    syllabus: {
      eyebrow: "SSC Stenographer syllabus",
      title: "SSC Stenographer Grade C & D syllabus and pattern 2026",
      description: "A learner-friendly overview based on the SSC Stenographer Grade C & D Examination 2026 notice.",
      sections: [
        { title: "General Intelligence & Reasoning", summary: "50 questions · 50 marks" },
        { title: "General Awareness", summary: "50 questions · 50 marks" },
        { title: "English Language & Comprehension", summary: "100 questions · 100 marks" },
      ],
      patternCards: [
        { title: "CBE timing", text: "The 2026 notice gives two hours total, with sectional timers of 30 minutes each for Reasoning and General Awareness and 60 minutes for English." },
        { title: "Negative marking", text: "The CBE is objective. Verify the current notice for the applicable negative-marking rule before the examination." },
        { title: "Stenography skill test", text: "Shortlisted candidates take a 10-minute dictation at 100 w.p.m. for Grade C or 80 w.p.m. for Grade D, followed by computer transcription within the prescribed time." },
      ],
      verificationNote: "The 2026 Stenographer notice is published by SSC. Check the official notice and subsequent addenda for skill-test language, transcription method, font requirements, dates, and other operational details.",
    },
    topics: SSC_STENO_TOPICS,
  },
  "ssc-gd": {
    slug: "ssc-gd",
    name: "SSC GD",
    yearLabel: "2027",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC GD 2027 Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for the next SSC GD cycle with CBE guidance, physical-stage planning, mock tests, and free topic-wise questions.",
      preparationTitle: "How to Prepare for SSC GD 2027",
      preparationDescription: "A practical SSC GD 2027 preparation guide covering CBE fundamentals, timed practice, General Awareness, and physical readiness.",
      syllabusTitle: "SSC GD Syllabus & Selection Pattern 2027",
      syllabusDescription: "SSC GD 2027 preparation overview covering the CBE subjects and the later PET/PST and medical stages.",
    },
    hub: {
      title: "SSC GD 2027 preparation hub",
      description: "Use one place for written-exam preparation, physical-stage planning, mock tests, and free topic practice for the next SSC GD cycle.",
      preparationSummary: "Build fast fundamentals in Reasoning, General Awareness, Elementary Mathematics, and English/Hindi while training physically in parallel.",
      syllabusSummary: "Review the CBE subjects and the PET/PST and medical stages before planning the full preparation cycle.",
      mockSummary: "Move from topic-wise practice into timed GD-style mocks while maintaining physical preparation.",
    },
    preparation: {
      eyebrow: "SSC GD 2027 preparation",
      title: "How to prepare for SSC GD 2027",
      description: "Prepare the computer-based examination and physical stages together so written progress is not separated from fitness readiness.",
      cards: [
        { title: "1. Build fast fundamentals", text: "Focus on basic Maths, Reasoning, language, and General Awareness questions that can be solved reliably under time pressure." },
        { title: "2. Practise mixed CBE sets", text: "Use short mixed sets and full mocks to reduce time lost switching between reasoning, maths, awareness, and language." },
        { title: "3. Train for PET/PST", text: "Maintain progressive running and fitness work and verify the official physical standards for your category and post." },
      ],
      weeklyCycle: [
        "Revise one basic Maths topic and one Reasoning pattern.",
        "Practise English or Hindi language questions regularly.",
        "Revise General Awareness in small cumulative blocks.",
        "Take timed mixed CBE practice at least once a week.",
        "Maintain a progressive physical-training routine.",
        "Check SSC updates for the 2027 notice, physical standards, and schedule changes.",
      ],
    },
    syllabus: {
      eyebrow: "SSC GD syllabus",
      title: "SSC GD syllabus and selection pattern 2027",
      description: "A preparation overview for the next Constable (GD) cycle listed by SSC for 2027. Exact rules should be checked in the official 2027 notice when issued.",
      sections: [
        { title: "General Intelligence & Reasoning", summary: "Core CBE preparation area" },
        { title: "General Knowledge & General Awareness", summary: "Core CBE preparation area" },
        { title: "Elementary Mathematics", summary: "Core CBE preparation area" },
        { title: "English / Hindi", summary: "Language component of the CBE" },
      ],
      patternCards: [
        { title: "Computer-based examination", text: "Prepare across Reasoning, General Awareness, Elementary Mathematics, and English/Hindi using the current SSC GD subject structure." },
        { title: "PET / PST", text: "Candidates progressing beyond the CBE must meet the applicable physical efficiency and physical standard requirements." },
        { title: "Medical & verification", text: "Later selection stages include the prescribed medical examination and document/eligibility verification." },
      ],
      verificationNote: "SSC's 2026-27 calendar places the next Constable (GD) cycle as the 2027 examination, with advertisement planned in September 2026 and CBE tentatively in January-March 2027. Verify the issued notice for exact pattern, dates, vacancies, physical standards, and eligibility.",
    },
    topics: SSC_GD_TOPICS,
  },
  "ibps-po": {
    slug: "ibps-po",
    name: "IBPS PO",
    yearLabel: "2026",
    categoryHref: "/category/banking",
    officialUrl: "https://www.ibps.in/index.php/management-trainees-xvi/",
    officialLabel: "ibps.in",
    meta: {
      hubTitle: "IBPS PO 2026 Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for IBPS PO/MT XVI with prelims and mains guidance, mock tests, and free topic-wise banking questions on ExamTree.",
      preparationTitle: "How to Prepare for IBPS PO 2026",
      preparationDescription: "A practical IBPS PO 2026 preparation guide covering prelims speed, mains depth, banking awareness, descriptive readiness, and mock analysis.",
      syllabusTitle: "IBPS PO 2026 Syllabus & Exam Pattern",
      syllabusDescription: "IBPS PO/MT XVI 2026 syllabus and exam-stage overview covering the preliminary examination, main examination, and later selection stages.",
    },
    hub: {
      title: "IBPS PO 2026 preparation hub",
      description: "Use one place for IBPS PO prelims and mains strategy, syllabus guidance, mock tests, and free topic-wise banking practice.",
      preparationSummary: "Build prelims speed in English, Quantitative Aptitude, and Reasoning, then deepen preparation for the main examination.",
      syllabusSummary: "Review the preliminary and main examination stages before deciding how to split your daily practice.",
      mockSummary: "Move from topic practice to separately timed banking mocks and review speed, accuracy, and question selection after every attempt.",
    },
    preparation: {
      eyebrow: "IBPS PO preparation",
      title: "How to prepare for IBPS PO 2026",
      description: "Treat prelims as a speed-and-selection stage while building mains-level reasoning, data analysis, awareness, and English in parallel.",
      cards: [
        { title: "1. Build prelims speed", text: "Practise English, Quantitative Aptitude, and Reasoning in separately timed blocks so accuracy remains stable under section pressure." },
        { title: "2. Prepare mains in parallel", text: "Do not wait for the prelims result to begin higher-level reasoning, data analysis, banking awareness, and deeper English practice." },
        { title: "3. Review every mock", text: "Track skipped questions, slow questions, guesses, and avoidable errors; banking exams reward question selection as much as raw solving speed." },
      ],
      weeklyCycle: [
        "Take short separately timed prelims section tests.",
        "Practise arithmetic and data-oriented Quant topics with calculation-speed drills.",
        "Rotate puzzles, syllogism, coding-decoding, and other Reasoning sets.",
        "Practise reading, grammar, vocabulary, and comprehension in English every day.",
        "Revise banking, financial, and current awareness regularly for mains.",
        "Take a full mock and analyse attempts, accuracy, time spent, and questions left unattempted.",
      ],
    },
    syllabus: {
      eyebrow: "IBPS PO syllabus",
      title: "IBPS PO/MT XVI syllabus and exam pattern 2026",
      description: "A learner-friendly overview of the current IBPS PO/MT XVI cycle. Verify detailed marks, timings, and later-stage rules in the latest official IBPS notification and information handouts.",
      sections: [
        { title: "English Language", summary: "Preliminary examination core section" },
        { title: "Quantitative Aptitude", summary: "Preliminary examination core section" },
        { title: "Reasoning Ability", summary: "Preliminary examination core section" },
        { title: "Main examination", summary: "Higher-level reasoning/data analysis, awareness, English, and the current main-stage components prescribed by IBPS" },
      ],
      patternCards: [
        { title: "Preliminary examination", text: "The PO/MT recruitment process begins with an online preliminary examination using separately timed sections, followed by shortlisting for the main examination." },
        { title: "Main examination", text: "The main stage requires deeper reasoning and data-analysis ability together with banking/economy awareness and English. Use the current information handout for exact section structure." },
        { title: "Current 2026 cycle", text: "IBPS scheduled PO/MT XVI prelims for 22-23 August 2026 and the main examination for 4 October 2026 in its 2026-27 calendar." },
      ],
      verificationNote: "The CRP PO/MT-XVI cycle is active in 2026. Check the official IBPS PO/MT XVI page, notification, call-letter information handouts, and any corrigenda for exact pattern, marks, timings, vacancies, eligibility, and later selection-stage rules.",
    },
    topics: BANKING_PRACTICE_TOPICS,
  },
  "ibps-clerk": {
    slug: "ibps-clerk",
    name: "IBPS Clerk / CSA",
    yearLabel: "2026",
    categoryHref: "/category/banking",
    officialUrl: "https://www.ibps.in/index.php/clerical-cadre-xvi/",
    officialLabel: "ibps.in",
    meta: {
      hubTitle: "IBPS Clerk / CSA 2026 Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for IBPS Customer Service Associate (commonly searched as IBPS Clerk) 2026 with prelims and mains guidance, mock tests, and free questions.",
      preparationTitle: "How to Prepare for IBPS Clerk / CSA 2026",
      preparationDescription: "A practical IBPS CSA XVI preparation guide covering prelims speed, mains banking awareness, Quant, Reasoning, English, and mock analysis.",
      syllabusTitle: "IBPS Clerk / CSA 2026 Syllabus & Exam Pattern",
      syllabusDescription: "IBPS CSA XVI 2026 syllabus and exam-pattern overview covering the preliminary and main online examinations.",
    },
    hub: {
      title: "IBPS Clerk / CSA 2026 preparation hub",
      description: "Prepare for the current Customer Service Associate recruitment with prelims and mains guidance, mock tests, and free topic-wise banking questions.",
      preparationSummary: "Build separately timed prelims speed in English, Numerical Ability, and Reasoning, then extend into mains-level Quant, Reasoning, English, and financial awareness.",
      syllabusSummary: "Understand the two-tier online process and the different demands of prelims and mains before scheduling practice.",
      mockSummary: "Use short topic sets first, then separately timed banking mocks to improve question selection and accuracy.",
    },
    preparation: {
      eyebrow: "IBPS Clerk / CSA preparation",
      title: "How to prepare for IBPS Clerk / CSA 2026",
      description: "Build speed for the three prelims sections while preparing General/Financial Awareness and higher-level Reasoning and Quant for mains in parallel.",
      cards: [
        { title: "1. Master prelims timing", text: "Practise English, Numerical Ability, and Reasoning as separately timed sections instead of relying only on untimed topic sets." },
        { title: "2. Start mains early", text: "Keep General/Financial Awareness, stronger Reasoning, Quantitative Aptitude, and English in your weekly plan before prelims are over." },
        { title: "3. Improve selection", text: "Use mock analysis to identify which question types should be attempted immediately, postponed, or skipped under pressure." },
      ],
      weeklyCycle: [
        "Practise one Numerical Ability topic with calculation-speed drills.",
        "Rotate Reasoning sets including syllogism, coding-decoding, and arrangement-based practice.",
        "Practise English grammar, vocabulary, and reading every day.",
        "Revise General and Financial Awareness in short recurring sessions.",
        "Take separately timed prelims sectional tests.",
        "Take a full mock regularly and review accuracy, pace, and skipped-question quality.",
      ],
    },
    syllabus: {
      eyebrow: "IBPS Clerk / CSA syllabus",
      title: "IBPS Customer Service Associate XVI syllabus and exam pattern 2026",
      description: "IBPS now uses the title Customer Service Associate (CSA) for this recruitment, although many learners still search for it as IBPS Clerk.",
      sections: [
        { title: "English Language", summary: "Prelims: 30 questions · 30 marks · 20 minutes" },
        { title: "Numerical Ability", summary: "Prelims: 35 questions · 35 marks · 20 minutes" },
        { title: "Reasoning Ability", summary: "Prelims: 35 questions · 35 marks · 20 minutes" },
        { title: "Main examination", summary: "General/Financial Awareness, General English, Reasoning Ability, and Quantitative Aptitude" },
      ],
      patternCards: [
        { title: "Preliminary examination", text: "The familiar three-section prelims format totals 100 questions and 100 marks in 60 minutes, with each test separately timed." },
        { title: "Main examination", text: "The main examination expands to General/Financial Awareness, General English, Reasoning Ability, and Quantitative Aptitude with separately timed sections." },
        { title: "Current 2026 cycle", text: "IBPS scheduled CSA XVI prelims for 10-11 October 2026 and the main examination for 27 December 2026 in its 2026-27 calendar." },
      ],
      verificationNote: "CRP CSA-XVI is the current official name of the recruitment commonly called IBPS Clerk. Check the official IBPS CSA XVI page, notification, information handouts, and corrigenda for exact 2026 rules, languages, vacancies, eligibility, negative marking, and examination instructions.",
    },
    topics: BANKING_PRACTICE_TOPICS,
  },
  "ibps-rrb-po": {
    slug: "ibps-rrb-po",
    name: "IBPS RRB Officer Scale I",
    yearLabel: "2026",
    categoryHref: "/category/banking",
    officialUrl: "https://www.ibps.in/index.php/rural-bank-xv/",
    officialLabel: "ibps.in",
    meta: {
      hubTitle: "IBPS RRB PO 2026 Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for IBPS RRB Officer Scale I under CRP RRBs XV with prelims and mains guidance, mock tests, and free banking questions.",
      preparationTitle: "How to Prepare for IBPS RRB PO 2026",
      preparationDescription: "A practical IBPS RRB Officer Scale I 2026 preparation guide covering prelims speed, mains depth, awareness, computer knowledge, and interview readiness.",
      syllabusTitle: "IBPS RRB PO 2026 Syllabus & Exam Pattern",
      syllabusDescription: "IBPS RRB Officer Scale I 2026 syllabus and selection overview covering preliminary, main, and interview stages.",
    },
    hub: {
      title: "IBPS RRB PO 2026 preparation hub",
      description: "Prepare for Officer Scale I with prelims strategy, mains guidance, mock tests, and free topic-wise banking practice.",
      preparationSummary: "Build strong prelims speed in Reasoning and Quantitative Aptitude while preparing mains awareness, computer knowledge, language, and deeper problem solving in parallel.",
      syllabusSummary: "Understand the two-tier online examination and interview pathway before planning your preparation calendar.",
      mockSummary: "Use topic practice first, then separately timed RRB-style mocks to improve speed, accuracy, and question selection.",
    },
    preparation: {
      eyebrow: "IBPS RRB Officer Scale I preparation",
      title: "How to prepare for IBPS RRB PO 2026",
      description: "Treat prelims as a speed screen while building the broader mains syllabus and interview awareness alongside it.",
      cards: [
        { title: "1. Master prelims selection", text: "Reasoning and Quantitative Aptitude dominate the prelims stage, so practise fast question selection and avoid getting trapped in long sets." },
        { title: "2. Build mains in parallel", text: "Keep General Awareness, Computer Knowledge, language, and higher-level Reasoning and Quant active before prelims are over." },
        { title: "3. Prepare for interview", text: "For Officer Scale I, maintain awareness of rural banking, financial institutions, current banking issues, and your own profile for the later interview stage." },
      ],
      weeklyCycle: [
        "Take short separately timed Reasoning and Quant prelims sets.",
        "Practise arithmetic and data-based Quant with calculation-speed drills.",
        "Rotate puzzles, syllogism, coding-decoding, and other reasoning sets.",
        "Revise banking, rural economy, financial awareness, and current affairs.",
        "Keep computer knowledge and language practice in the weekly plan for mains.",
        "Take a full mock and review skipped questions, slow attempts, and avoidable errors.",
      ],
    },
    syllabus: {
      eyebrow: "IBPS RRB Officer Scale I syllabus",
      title: "IBPS RRB Officer Scale I syllabus and exam pattern 2026",
      description: "A learner-friendly overview of CRP RRBs XV for Officer Scale I. Verify exact section timings, marks, language options, and interview rules in the current official IBPS notification and handouts.",
      sections: [
        { title: "Reasoning", summary: "Preliminary examination core section" },
        { title: "Quantitative Aptitude", summary: "Preliminary examination core section" },
        { title: "Main examination", summary: "Reasoning, quantitative aptitude, general awareness, computer knowledge, and language components as prescribed by IBPS" },
        { title: "Interview", summary: "Officer Scale I candidates shortlisted after mains proceed to the interview stage" },
      ],
      patternCards: [
        { title: "Preliminary examination", text: "Officer Scale I uses a preliminary online examination before shortlisting for the main examination." },
        { title: "Main examination", text: "The main stage broadens beyond prelims to include awareness, computer knowledge, and language alongside higher-level Reasoning and Quantitative Aptitude." },
        { title: "Current 2026 schedule", text: "IBPS scheduled Officer Scale I prelims for 21-22 November 2026 and the main examination for 20 December 2026 in its 2026-27 calendar." },
      ],
      verificationNote: "CRP RRBs XV is active in 2026. Check the official IBPS Rural Banks XV page, detailed notification, information handouts, and corrigenda for exact pattern, marks, timings, interview rules, vacancies, eligibility, and participating RRB details.",
    },
    topics: BANKING_PRACTICE_TOPICS,
  },
  "ibps-rrb-office-assistant": {
    slug: "ibps-rrb-office-assistant",
    name: "IBPS RRB Office Assistant",
    yearLabel: "2026",
    categoryHref: "/category/banking",
    officialUrl: "https://www.ibps.in/index.php/rural-bank-xv/",
    officialLabel: "ibps.in",
    meta: {
      hubTitle: "IBPS RRB Office Assistant 2026 Preparation, Syllabus, Mock Tests & Free Questions",
      hubDescription: "Prepare for IBPS RRB Office Assistant (Multipurpose) under CRP RRBs XV with prelims and mains guidance, mock tests, and free questions.",
      preparationTitle: "How to Prepare for IBPS RRB Office Assistant 2026",
      preparationDescription: "A practical IBPS RRB Office Assistant 2026 guide covering prelims speed, mains awareness, computer knowledge, language, and mock analysis.",
      syllabusTitle: "IBPS RRB Office Assistant 2026 Syllabus & Exam Pattern",
      syllabusDescription: "IBPS RRB Office Assistant 2026 syllabus and exam-stage overview covering preliminary and main online examinations.",
    },
    hub: {
      title: "IBPS RRB Office Assistant 2026 preparation hub",
      description: "Prepare for Office Assistant (Multipurpose) with prelims and mains guidance, mock tests, and free topic-wise banking questions.",
      preparationSummary: "Build quick and accurate prelims performance in Reasoning and Numerical Ability, then extend into the broader mains syllabus.",
      syllabusSummary: "Understand the two-tier online process and how mains expands beyond the prelims subjects.",
      mockSummary: "Use focused practice followed by timed RRB mocks to improve selection, calculation speed, and accuracy.",
    },
    preparation: {
      eyebrow: "IBPS RRB Office Assistant preparation",
      title: "How to prepare for IBPS RRB Office Assistant 2026",
      description: "Build prelims speed first while preparing the broader mains sections in parallel so the second stage does not start from zero.",
      cards: [
        { title: "1. Build prelims speed", text: "Practise Reasoning and Numerical Ability as timed sections with a clear attempt order and strict skip discipline." },
        { title: "2. Start mains early", text: "Keep General Awareness, Computer Knowledge, language, and higher-level Reasoning and Quantitative Aptitude active before prelims." },
        { title: "3. Analyse mock choices", text: "Review not only wrong answers but also slow questions, poor skips, and easy questions left unattempted." },
      ],
      weeklyCycle: [
        "Practise one arithmetic topic with speed-oriented calculations.",
        "Rotate syllogism, coding-decoding, puzzles, and other Reasoning sets.",
        "Take short timed prelims section tests.",
        "Revise banking, rural economy, and current awareness regularly.",
        "Keep computer knowledge and language practice active for mains.",
        "Take a full mock and review accuracy, pace, and question-selection quality.",
      ],
    },
    syllabus: {
      eyebrow: "IBPS RRB Office Assistant syllabus",
      title: "IBPS RRB Office Assistant syllabus and exam pattern 2026",
      description: "A learner-friendly overview of CRP RRBs XV for Office Assistants (Multipurpose). Verify exact 2026 marks, section timings, and language rules in the latest IBPS notification and handouts.",
      sections: [
        { title: "Reasoning", summary: "Preliminary examination core section" },
        { title: "Numerical Ability", summary: "Preliminary examination core section" },
        { title: "Main examination", summary: "Reasoning, numerical/quantitative ability, general awareness, computer knowledge, and language components as prescribed by IBPS" },
        { title: "Final allotment pathway", summary: "Office Assistant recruitment proceeds through prelims and mains without the Officer Scale I interview stage" },
      ],
      patternCards: [
        { title: "Preliminary examination", text: "Office Assistant uses an online preliminary examination before candidates are shortlisted for the main examination." },
        { title: "Main examination", text: "The main stage broadens to include General Awareness, Computer Knowledge, and language alongside Reasoning and numerical/quantitative ability." },
        { title: "Current 2026 schedule", text: "IBPS scheduled Office Assistant prelims for 6, 12 and 13 December 2026 and the main examination for 30 January 2027 in its 2026-27 calendar." },
      ],
      verificationNote: "CRP RRBs XV is active in 2026. Check the official IBPS Rural Banks XV page, detailed notification, information handouts, and corrigenda for exact pattern, marks, timings, languages, vacancies, eligibility, and participating RRB details.",
    },
    topics: BANKING_PRACTICE_TOPICS,
  },
};

export const SSC_CGL_PRACTICE_TOPICS = EXAM_ACQUISITION_CONFIGS["ssc-cgl"].topics;


const CATALOG_EXAM_CODES_BY_SLUG: Record<string, string[]> = {
  "ssc-cgl": ["SSC_CGL"],
  "ssc-chsl": ["SSC_CHSL"],
  "ssc-mts": ["SSC_MTS"],
  "ssc-cpo": ["SSC_CPO"],
  "ssc-stenographer": ["SSC_STENOGRAPHER"],
  "ssc-gd": ["SSC_GD"],
  "ibps-po": ["IBPS_PO", "IBPS_PO_PRE", "IBPS_PO_PRELIMS"],
  "ibps-clerk": ["IBPS_CLERK", "IBPS_CLERK_PRE", "IBPS_CLERK_PRELIMS", "IBPS_CSA"],
  "ibps-rrb-po": ["IBPS_RRB_PO"],
  "ibps-rrb-office-assistant": ["IBPS_RRB_CLERK"],
};

const EXAM_SLUG_BY_CATALOG_CODE = Object.fromEntries(
  Object.entries(CATALOG_EXAM_CODES_BY_SLUG).flatMap(([slug, codes]) =>
    codes.map((code) => [code.toUpperCase(), slug]),
  ),
) as Record<string, string>;

export function catalogExamCodesForSlug(slug: string) {
  return CATALOG_EXAM_CODES_BY_SLUG[slug] ?? [];
}

export function examHubHrefForCatalogExam(codeOrName: string | undefined) {
  const normalized = String(codeOrName ?? "").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  const slug = EXAM_SLUG_BY_CATALOG_CODE[normalized];
  return slug ? examHubHref(slug) : null;
}

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

export function examDetailsHref(examSlug: string, section?: "overview" | "syllabus" | "pattern" | "preparation" | "updates" | "practice") {
  const base = "/" + examSlug + "/details";
  return section ? base + "#" + section : base;
}

export function examSyllabusHref(examSlug: string) {
  return "/" + examSlug + "-syllabus";
}

export function practiceTopicHref(slug: string, examSlug = "ssc-cgl") {
  return "/" + examSlug + "/questions/" + slug;
}
