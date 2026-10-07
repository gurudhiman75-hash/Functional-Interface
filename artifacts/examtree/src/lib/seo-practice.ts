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

export type ExamDetailCard = {
  title: string;
  text: string;
  badge?: string;
  ctaLabel?: string;
  href?: string;
};

export type ExamDetailSection = {
  eyebrow: string;
  title: string;
  description: string;
  body?: string;
  cards: ExamDetailCard[];
};

export type ExamAcquisitionConfig = {
  slug: string;
  isShell?: boolean;
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
  testHub?: {
    mode: "single" | "dual";
    stage1Label: string;
    stage2Label?: string;
    stage1Keywords?: string[];
    stage2Keywords?: string[];
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
  details?: {
    eligibility?: ExamDetailSection;
    dates?: ExamDetailSection;
    salary?: ExamDetailSection;
    faq?: ExamDetailSection;
    updates?: ExamDetailSection;
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


function makeExamShellConfig(input: {
  slug: string;
  name: string;
  categoryHref: string;
  officialUrl: string;
  officialLabel: string;
}): ExamAcquisitionConfig {
  const { slug, name, categoryHref, officialUrl, officialLabel } = input;
  return {
    slug,
    isShell: true,
    name,
    yearLabel: "Exam",
    categoryHref,
    officialUrl,
    officialLabel,
    meta: {
      hubTitle: name + " Preparation, Mock Tests & Exam Details | ExamTree",
      hubDescription: "Open the ExamTree " + name + " exam page. Verified syllabus, eligibility, dates and preparation details will be added after official-source review.",
      preparationTitle: name + " Preparation Guide | ExamTree",
      preparationDescription: "Preparation guidance for " + name + " will be published after the exam pattern and syllabus are verified from the responsible authority.",
      syllabusTitle: name + " Syllabus & Exam Pattern | ExamTree",
      syllabusDescription: "Verified " + name + " syllabus and exam-pattern details will be published after official-source review.",
    },
    hub: {
      title: name + " exam hub",
      description: "ExamTree has created the " + name + " exam workspace. Test inventory and verified exam information will appear here as they are published.",
      preparationSummary: "Preparation guidance is not yet populated. It will be added only after the current official pattern and syllabus are verified.",
      syllabusSummary: "Detailed syllabus and exam-pattern information is awaiting official-source review.",
      mockSummary: "Published ExamTree tests will appear automatically when they are mapped to this exam identity.",
    },
    preparation: {
      eyebrow: name + " preparation",
      title: name + " preparation",
      description: "A verified preparation plan has not yet been published for this exam.",
      cards: [],
      weeklyCycle: [],
    },
    syllabus: {
      eyebrow: name + " syllabus",
      title: name + " syllabus and exam pattern",
      description: "Detailed exam information is awaiting official-source review.",
      sections: [],
      patternCards: [],
      verificationNote: "This exam identity is live, but detailed rules have not yet been populated. Verify all time-sensitive information on the responsible authority's official website.",
    },
    topics: [],
  };
}


function makePunjabStudyConfig(slug: "psssb-clerk" | "punjab-patwari"): ExamAcquisitionConfig {
  const clerk = slug === "psssb-clerk";
  const name = clerk ? "PSSSB Clerk" : "Punjab Patwari";
  const reference = clerk ? "Clerk • Advertisement 02/2026" : "Patwari • Advertisement 02/2023 reference";
  const syllabusUrl = clerk ? "https://sssb.punjab.gov.in/wp-content/uploads/2026/02/Clerk.pdf" : "https://cdn-images.prepp.in/public/image/Final_Patwari_syllabus_prepp_0285d067292e7e2da8155f60e72a431d.pdf";
  const note = clerk
    ? "Based on the board-issued Clerk examination plan for Advertisement 02/2026 and its original recruitment advertisement. Check subsequent corrigenda before applying. These rules are for Clerk; Junior Assistant notices may differ. Exam dates have not been verified here."
    : "Preparation reference: the board-issued Patwari examination plan for Advertisement 02/2023, available as a mirrored PDF. This is a historical syllabus, not confirmation of a new recruitment. Current eligibility, vacancies and dates remain unverified.";
  const base = makeExamShellConfig({ slug, name, categoryHref: "/category/punjab", officialUrl: "https://sssb.punjab.gov.in", officialLabel: "sssb.punjab.gov.in" });
  return {
    ...base, isShell: false, yearLabel: clerk ? "2026" : "2023 reference",
    meta: {
      hubTitle: name + " Syllabus, Preparation & Published Tests | ExamTree",
      hubDescription: name + " study workspace with syllabus, paper structure, a weekly study plan and source links. " + reference + ".",
      preparationTitle: name + " Preparation Plan | ExamTree",
      preparationDescription: "Plan Punjabi, Punjab GK, reasoning, English and ICT practice. " + reference + ".",
      syllabusTitle: name + " Syllabus & Exam Pattern | ExamTree",
      syllabusDescription: "Two-part written-paper reference with qualifying Punjabi and merit-based Part B. " + reference + ".",
    },
    hub: {
      title: name + " preparation workspace",
      description: reference + ". " + note,
      preparationSummary: clerk ? "ਪੰਜਾਬੀ, ਪੰਜਾਬ GK ਅਤੇ ਤਰਕ ਦਾ ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ ਕਰੋ। ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਟਾਈਪਿੰਗ ਲਈ ਵੀ ਸਮਾਂ ਰੱਖੋ।" : "2023 ਦੇ ਸਿਲੇਬਸ ਅਨੁਸਾਰ ਪੰਜਾਬੀ, ਪੰਜਾਬ GK ਅਤੇ ਤਰਕ ਦੀ ਤਿਆਰੀ ਸ਼ੁਰੂ ਕਰੋ। ਨਵੀਂ ਭਰਤੀ ਦੇ ਨਿਯਮ ਅਧਿਕਾਰਤ ਨੋਟਿਸ ਤੋਂ ਵੇਖੋ।",
      syllabusSummary: reference + ". Punjabi qualification comes before Part-B merit.",
      mockSummary: "Only published tests mapped to this exam appear in the catalogue.",
    },
    testHub: { mode: "single", stage1Label: "Written paper" },
    preparation: {
      eyebrow: "ਤਿਆਰੀ ਦੀ ਯੋਜਨਾ", title: name + " study plan",
      description: "A suggested weekly routine, not an official timetable. " + reference + ".",
      cards: [
        { title: "ਪੰਜਾਬੀ ਪਹਿਲਾਂ", text: "Spend 25 minutes on grammar, spelling, idioms and Punjabi reading. Keep a separate list of language mistakes and revise it every week." },
        { title: "Punjab GK + reasoning", text: "Alternate Punjab history and culture with reasoning and basic numerical practice. Use short recall quizzes, then review every incorrect answer." },
        { title: clerk ? "Typing + timed practice" : "Timed practice + review", text: clerk ? "Practise English and Punjabi typing daily using Raavi for Punjabi. Add timed mixed-subject practice and review accuracy before increasing speed." : "Rotate English and ICT across the week. Use timed mixed-subject practice and reserve equal time afterwards to review weak areas." },
      ],
      weeklyCycle: [
        "Monday: Punjabi grammar + reasoning.",
        "Tuesday: Punjab history and culture + English.",
        "Wednesday: current affairs + basic numerical skills.",
        "Thursday: Punjabi revision + ICT.",
        "Friday: mixed practice + weak-topic revision.",
        clerk ? "Saturday: timed paper practice + English/Punjabi typing." : "Saturday: timed paper practice using the historical pattern as a reference.",
        "Sunday: review errors, revise notes and plan next week.",
      ],
    },
    syllabus: {
      eyebrow: reference, title: name + " syllabus and paper structure",
      description: reference + ". " + (clerk ? "The board’s plan gives approximate Part-B subject weights." : "Historical reference; verify the next notice before using this as the current scheme."),
      sections: [
        { title: "ਪੰਜਾਬੀ • Part A", summary: "Matric-level language, idioms, spelling, grammar, Punjab history and culture." },
        { title: "GK & current affairs", summary: clerk ? "Approx. 25 marks: polity, environment, science, economy, history, geography and current events." : "National and international current affairs, history, polity, science and environment." },
        { title: "Punjab history & culture", summary: clerk ? "Approx. 17 marks: Punjab’s history, literature, Sikh Gurus, Sufism and freedom movements." : "Punjab’s history, language, literature, arts, faith traditions and freedom movements." },
        { title: "Reasoning & mental ability", summary: clerk ? "Approx. 25 marks: reasoning 17, numerical skills 4 and data analysis 4." : "Logical reasoning, basic numerical skills and interpreting data." },
        { title: "Punjabi & English • Part B", summary: clerk ? "Approx. 13 + 12 marks: language usage, vocabulary, grammar and sentence correction." : "Grammar, vocabulary, language usage and sentence correction." },
        { title: "ICT", summary: clerk ? "Approx. 8 marks: computers, internet, networking and office tools." : "Computers, internet, networking and office productivity tools." },
      ],
      patternCards: [
        { title: "Written paper", text: "150 OMR-based MCQs in 2 hours 30 minutes." },
        { title: "Part A • qualifying Punjabi", text: "50 questions / 50 marks; minimum 25 marks. No negative marking. Part B is evaluated only after qualifying Part A." },
        { title: "Part B • merit", text: "100 questions / 100 marks. Wrong answers lose 0.25 marks; unanswered questions carry no penalty. Merit uses Part-B marks." },
      ],
      verificationNote: note,
    },
    details: {
      eligibility: {
        eyebrow: clerk ? "Original 2026 advertisement" : "Current notification needed",
        title: name + " eligibility and selection",
        description: clerk ? "Original Advertisement 02/2026 requirements; check amendments and category-specific conditions." : "A 2023 syllabus alone does not establish eligibility for a future cycle.",
        cards: clerk ? [
          { title: "Educational qualification", text: "Bachelor’s degree or equivalent; prescribed 120-hour computer course or DOEACC O-level equivalent; Matric Punjabi or equivalent." },
          { title: "Age limit", text: "Original notice: 18–37 for general category as on 1 January 2026. Reserved-category relaxations apply; check the notice and corrigenda." },
          { title: "Selection stages", text: "Written examination → qualifying English and Punjabi typing at 30 wpm → document verification. Punjabi typing uses Unicode-compliant Raavi." },
        ] : [
          { title: "Eligibility status", text: "Current age limits, education, computer qualifications and selection stages must be checked in the relevant recruitment advertisement.", badge: "Awaiting verification", href: base.officialUrl, ctaLabel: "Check PSSSB notices" },
        ],
      },
      dates: {
        eyebrow: "Official schedule", title: name + " important dates",
        description: "A countdown will appear only when a confirmed exam date is available.",
        cards: [{ title: "Exam date", text: "No official exam date has been verified for this page. Check the board’s latest schedule and admit-card notice.", badge: "Not verified", href: base.officialUrl, ctaLabel: "Official date updates" }],
      },
      ...(clerk ? { salary: { eyebrow: "Original 2026 advertisement", title: "Clerk pay scale", description: "Basic pay reference, not take-home salary.", cards: [{ title: "Pay level", text: "Level 2; starting basic pay ₹19,900 in the original Advertisement 02/2026. Allowances and deductions affect take-home pay." }] } } : {}),
      updates: {
        eyebrow: "Sources & recruitment cycle", title: "Notices and source documents",
        description: note,
        cards: [
          { title: clerk ? "Clerk examination plan • 02/2026" : "Patwari examination plan • 02/2023", text: clerk ? "Board-issued syllabus and written-paper structure." : "Historical board-issued syllabus. This PDF is hosted by a third-party mirror.", badge: clerk ? "2026 syllabus" : "Historical reference", href: syllabusUrl, ctaLabel: "Read source PDF" },
          ...(clerk ? [{ title: "Original Clerk advertisement • 02/2026", text: "Board-issued recruitment advertisement, hosted by a third-party mirror. Check later official corrigenda.", href: "https://haryanajobs.in/wp-content/uploads/PSSSB-Clerk-Recruitment-2026-Notification.pdf", ctaLabel: "Read advertisement" },
          { title: "Clerk syllabus • mirror copy", text: "Alternative copy of the board-issued examination plan if the official PDF is unavailable.", href: "https://syllabus4u.com/wp-content/uploads/2026/08/Clerk.pdf", ctaLabel: "Read mirror PDF" }] : []),
          { title: "Latest official notices", text: "Verify schedule changes, vacancies, application status and corrigenda with PSSSB.", href: base.officialUrl, ctaLabel: "Visit PSSSB" },
        ],
      },
      faq: {
        eyebrow: "Common questions", title: "Before you start",
        description: "Keep the recruitment cycle and paper stages clear.",
        cards: [
          { title: "Do Punjabi qualifying marks decide merit?", text: "Part A is a qualifying gate. Under the referenced plan, merit is based on Part B after qualifying Part A." },
          { title: "Are tests available now?", text: "The Test Series tab displays live catalogue availability. No unpublished or sample tests are presented as available." },
          { title: "Which notification applies?", text: clerk ? "These details cover Clerk Advertisement 02/2026, not a combined Clerk/Junior Assistant recruitment." : "This study reference covers Advertisement 02/2023. A future recruitment may change the rules." },
        ],
      },
    },
    topics: [],
  };
}


const PUNJAB_AUTHORITY_STUDY_DATA = {
  "punjab-police-constable": {
    "name": "Punjab Police Constable",
    "year": "2026",
    "ref": "District & Armed cadres • 2026 advertisement",
    "url": "https://punjabpolice.gov.in",
    "label": "punjabpolice.gov.in",
    "source": "https://punjabpolice.gov.in/media/documents/Advertisement_No._1_of_2026.pdf",
    "mirror": "https://www.scribd.com/document/1012665036/Advertisement-No-1-of-2026",
    "note": "Based on the 2026 District and Armed cadre advertisement. Check official corrigenda and individual admit cards. No common exam date has been verified here.",
    "summary": "ਲਿਖਤੀ ਪ੍ਰੀਖਿਆ ਨਾਲ ਪੰਜਾਬੀ ਅਤੇ ਸਰੀਰਕ ਟੈਸਟ ਦੀ ਤਿਆਰੀ ਵੀ ਜਾਰੀ ਰੱਖੋ।",
    "sections": [
      [
        "General awareness",
        "35 questions: polity, Punjab history, geography, culture, economy, health and current affairs."
      ],
      [
        "Quantitative aptitude",
        "20 questions: arithmetic, percentages, averages, ratios, interest and time/work."
      ],
      [
        "Reasoning",
        "20 questions: series, conclusions, ranking, directions and relationships."
      ],
      [
        "English & Punjabi",
        "10 questions each: comprehension, vocabulary and language skills."
      ],
      [
        "Digital literacy",
        "5 questions: computers, office tools, internet and email."
      ],
      [
        "ਪੰਜਾਬੀ • qualifying",
        "Separate Matric-level Punjabi language test."
      ]
    ],
    "pattern": [
      [
        "Paper I • merit",
        "100 questions / 100 marks; 2 hours."
      ],
      [
        "Paper II • Punjabi",
        "50 questions / 50 marks; 1 hour; 50% qualifying threshold. Excluded from merit."
      ],
      [
        "Marking & selection",
        "No negative marking. CBT → qualifying PST/PMT → document scrutiny."
      ]
    ],
    "eligibility": [
      [
        "Education",
        "10+2 or equivalent; Matric Punjabi or equivalent. Qualifications by 1 January 2026. Ex-servicemen education exception applies."
      ],
      [
        "Age",
        "18–28 as on 1 January 2026 in the original notice; category relaxations apply."
      ],
      [
        "Physical standards",
        "Original minimum height: male 5′7″, female 5′2″. Consult the notice for category-specific PST events and exemptions."
      ]
    ],
    "prep": [
      [
        "ਪੰਜਾਬ GK + current affairs",
        "Create short recall notes for Punjab history, geography and polity. Revise current affairs weekly, then test yourself without looking at the answers."
      ],
      [
        "Numerical + reasoning practice",
        "Alternate short numerical and reasoning sets. Record whether each mistake came from a concept, calculation or missed detail."
      ],
      [
        "Punjabi + physical readiness",
        "Practise Punjabi reading and language rules regularly. Check the applicable physical-test events early and plan your preparation around them."
      ]
    ],
    "weekly": [
      "Monday: Punjab GK + arithmetic.",
      "Tuesday: reasoning + English.",
      "Wednesday: Punjabi + digital literacy.",
      "Thursday: current affairs + numerical revision.",
      "Friday: mixed-subject practice.",
      "Saturday: timed paper practice + error review.",
      "Sunday: revise weak topics and check official notices. Include physical preparation in your routine."
    ]
  },
  "punjab-police-si": {
    "name": "Punjab Police Sub-Inspector",
    "year": "2023 reference",
    "ref": "District & Armed cadres • Advertisement 01/2023 reference",
    "url": "https://punjabpolice.gov.in",
    "label": "punjabpolice.gov.in",
    "source": "https://blogmedia.testbook.com/blog/wp-content/uploads/2023/01/1118002628126701818678-55d8876a.pdf",
    "note": "Historical study reference: Advertisement 01/2023 for District and Armed cadres. This does not confirm a new SI recruitment or apply to Technical and Support Services. Verify the next notice before relying on these rules.",
    "summary": "ਦੋਵੇਂ ਲਿਖਤੀ ਪੇਪਰਾਂ ਲਈ ਤਿਆਰੀ ਕਰੋ। ਪੰਜਾਬੀ ਅਤੇ ਸਰੀਰਕ ਟੈਸਟ ਨੂੰ ਵੀ ਆਪਣੀ ਯੋਜਨਾ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ।",
    "sections": [
      [
        "Paper I • awareness",
        "50 questions: Indian/Punjab history, polity, economy, science, environment and current affairs."
      ],
      [
        "Paper I • numerical skills",
        "30 questions: arithmetic, mensuration, equations and speed/time/distance."
      ],
      [
        "Paper I • Punjabi",
        "20 questions: language, comprehension and translation."
      ],
      [
        "Paper II • reasoning & DI",
        "50 questions: analytical reasoning, puzzles, data interpretation and legal reasoning."
      ],
      [
        "Paper II • computers & English",
        "30 computer-awareness questions and 20 English-language questions."
      ],
      [
        "Paper III • ਪੰਜਾਬੀ",
        "Separate Matric-level Punjabi qualifying paper."
      ]
    ],
    "pattern": [
      [
        "Papers I & II • merit",
        "Each: 100 questions / 400 marks / 2 hours. Correct +4; wrong −1."
      ],
      [
        "Paper III • qualifying",
        "50 questions / 50 marks / 1 hour; minimum 50%. No negative marking; excluded from merit."
      ],
      [
        "Selection stages",
        "CBT → qualifying PMT/PST → document scrutiny. Merit uses normalized Papers I + II."
      ]
    ],
    "eligibility": [
      [
        "Education • 2023 reference",
        "Graduation or equivalent by 1 January 2023; Matric Punjabi or equivalent."
      ],
      [
        "Age • 2023 reference",
        "18–28 as on 1 January 2023; category relaxations applied."
      ],
      [
        "Physical standards • reference",
        "Minimum height: male 5′7″, female 5′2″. Consult the source for PST events and exemptions."
      ]
    ],
    "prep": [
      [
        "Plan both merit papers",
        "Alternate awareness/numerical practice with reasoning/computer practice. Keep a weekly checklist so neither paper is left behind."
      ],
      [
        "Languages + accuracy",
        "Use short Punjabi and English reading sessions, then practise grammar and translation. Review uncertain attempts before increasing speed."
      ],
      [
        "Physical + document checklist",
        "Read the historical physical-test requirements as a planning reference. Check your qualification documents and compare them with the relevant new notice when issued."
      ]
    ],
    "weekly": [
      "Monday: awareness + Punjabi.",
      "Tuesday: numerical skills + English.",
      "Wednesday: reasoning + DI.",
      "Thursday: computers + language revision.",
      "Friday: mixed practice from both papers.",
      "Saturday: timed practice + review.",
      "Sunday: revise weak areas and check official updates. Include physical preparation in your routine."
    ]
  },
  "punjab-pcs": {
    "name": "PPSC Punjab State Civil Services",
    "year": "2025 scheme",
    "ref": "PSCSCCE-2025 • Advertisement 20251 scheme",
    "url": "https://ppsc.gov.in",
    "label": "ppsc.gov.in",
    "source": "https://www.careerpower.in/blog/wp-content/uploads/2025/01/03084758/Punjab-PCS-Notification-2025.pdf",
    "note": "Based on the original PSCSCCE-2025 scheme, available as an advertisement mirror. This is not a new 2026 recruitment announcement. Check official amendments, service-specific conditions and stage schedules.",
    "summary": "ਪ੍ਰੀਲਿਮਜ਼ ਦੀ ਤਿਆਰੀ ਨਾਲ ਮੇਨਜ਼ ਲਈ ਉੱਤਰ ਲਿਖਣ ਦਾ ਅਭਿਆਸ ਕਰੋ। ਪੰਜਾਬ ਦੇ ਇਤਿਹਾਸ, ਭੂਗੋਲ ਅਤੇ ਅਰਥਵਿਵਸਥਾ ਨੂੰ ਖਾਸ ਸਮਾਂ ਦਿਓ।",
    "sections": [
      [
        "Prelims • General Studies",
        "Science, history, geography, polity, economy, environment, Punjab and current events."
      ],
      [
        "Prelims • CSAT",
        "Comprehension, communication, reasoning, numerical skills and data analysis."
      ],
      [
        "Mains • languages & essay",
        "Punjabi, English and essay writing."
      ],
      [
        "Mains • GS I & II",
        "History, geography, society; Constitution, governance and international relations."
      ],
      [
        "Mains • GS III & IV",
        "Economy, statistics, security; science, environment, problem solving and decision making."
      ],
      [
        "Punjab focus",
        "Integrate Punjab history, culture, economy and geography into mains preparation."
      ]
    ],
    "pattern": [
      [
        "Prelims",
        "GS: 100 questions / 200 marks; CSAT: 80 / 200. Each 2 hours; no negative marking. CSAT qualifies at 40%; prelims merit uses GS."
      ],
      [
        "Mains written",
        "Seven descriptive papers, 3 hours each: Punjabi 100, English 100, Essay 150, four GS papers 250 each. Total 1,350."
      ],
      [
        "Interview & final merit",
        "Interview 150; final aggregate 1,500. Prelims marks are excluded from final merit."
      ]
    ],
    "eligibility": [
      [
        "Education",
        "Bachelor’s degree; the 2025 notice allows qualifying-degree students at prelims with passing proof before mains. Matric Punjabi or equivalent required, subject to exceptions."
      ],
      [
        "Service-specific age",
        "The original notice has a general 21–37 band and a separate 21–28 rule for specified Police/Prisons posts. Verify exact boundary wording, relaxations and service conditions."
      ],
      [
        "Selection stages",
        "Prelims → mains written → interview, with eligibility/document verification."
      ]
    ],
    "prep": [
      [
        "GS + Punjab connections",
        "Build one set of notes that links national topics with Punjab examples. Use maps, timelines and recall questions to revise."
      ],
      [
        "CSAT every week",
        "Reserve regular sessions for comprehension, reasoning and calculations. Review weak areas instead of treating CSAT as a final-week task."
      ],
      [
        "Start writing early",
        "Write one short answer daily and an essay outline weekly. Review relevance, structure, examples and whether you answered the exact question."
      ]
    ],
    "weekly": [
      "Monday: history + answer writing.",
      "Tuesday: geography + Punjab maps.",
      "Wednesday: polity + current affairs.",
      "Thursday: economy + data interpretation.",
      "Friday: science/environment + language practice.",
      "Saturday: prelims practice + mains writing.",
      "Sunday: essay outline, revision and error review."
    ]
  }
};

function makePunjabAuthorityConfig(slug: keyof typeof PUNJAB_AUTHORITY_STUDY_DATA): ExamAcquisitionConfig {
  const d = PUNJAB_AUTHORITY_STUDY_DATA[slug];
  const base = makeExamShellConfig({slug, name: d.name, categoryHref: "/category/punjab", officialUrl: d.url, officialLabel: d.label});
  const cards = (pairs: string[][]) => pairs.map(([title, text]) => ({title, text}));
  return {
    ...base, isShell: false, yearLabel: d.year,
    meta: {
      hubTitle: d.name + " Syllabus, Preparation & Published Tests | ExamTree",
      hubDescription: d.ref + ". Study plan, syllabus overview and authority source links.",
      preparationTitle: d.name + " Preparation Plan | ExamTree",
      preparationDescription: "A suggested study routine based on " + d.ref + ".",
      syllabusTitle: d.name + " Syllabus & Exam Pattern | ExamTree",
      syllabusDescription: d.ref + ". " + d.note,
    },
    hub: {title: d.name + " study workspace", description: d.ref + ". " + d.note, preparationSummary: d.summary, syllabusSummary: d.ref, mockSummary: "Only published tests mapped to this exam appear in the catalogue."},
    testHub: slug === "punjab-pcs" ? {mode: "dual", stage1Label: "Prelims", stage2Label: "Mains", stage1Keywords: ["prelim", "preliminary", "prelims"], stage2Keywords: ["mains", "main examination"]} : {mode: "single", stage1Label: "Written tests"},
    preparation: {eyebrow: "ਤਿਆਰੀ ਦੀ ਯੋਜਨਾ", title: d.name + " study plan", description: "Suggested routine, not an official timetable. " + d.ref + ".", cards: cards(d.prep), weeklyCycle: d.weekly},
    syllabus: {eyebrow: d.ref, title: d.name + " syllabus and exam structure", description: d.ref + ". " + d.note, sections: d.sections.map(([title, summary]) => ({title, summary})), patternCards: cards(d.pattern), verificationNote: d.note},
    details: {
      eligibility: {eyebrow: d.ref, title: "Eligibility and selection", description: "Requirements from the referenced advertisement; check amendments and category/service-specific conditions.", cards: cards(d.eligibility)},
      dates: {eyebrow: "Official schedule", title: "Exam dates", description: "No verified date is configured for this page.", cards: [{title: "Date status", text: "Check the latest stage schedule and your admit card. A countdown needs a confirmed date.", badge: "Not verified", href: d.url, ctaLabel: "Official updates"}]},
      updates: {eyebrow: "Authority sources", title: "Source documents and updates", description: d.note, cards: [
        {title: d.ref, text: slug === "punjab-police-constable" ? "Official advertisement link. If unavailable, use the mirror below and check amendments with the authority." : "Authority-issued advertisement hosted by a third-party mirror.", href: d.source, ctaLabel: "Read source", badge: d.year},
        ...("mirror" in d ? [{title: "Advertisement mirror", text: "Third-party copy of the authority-issued document; not a current application portal.", href: d.mirror, ctaLabel: "Read mirror"}] : []),
        {title: "Latest official notices", text: "Check current recruitment status, corrigenda, vacancies and stage schedules.", href: d.url, ctaLabel: "Visit authority"}
      ]},
    },
    topics: [],
  };
}

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
    testHub: {
      mode: "dual",
      stage1Label: "Tier-I",
      stage2Label: "Tier-II",
      stage1Keywords: ["tier-i", "tier i", "tier-1", "tier 1"],
      stage2Keywords: ["tier-ii", "tier ii", "tier-2", "tier 2"],
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
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "SSC CGL 2026 eligibility",
        description: "SSC CGL recruits for multiple Group B and Group C posts, so age limits and post-specific qualifications vary. The 2026 notice is the controlling source.",
        cards: [
          { title: "Educational qualification", text: "A bachelor's degree is the base qualification for CGL. Some posts prescribe additional subject-specific requirements in the official notice.", badge: "Graduate level" },
          { title: "Age limits", text: "The 2026 notice lists different age bands by post, including 18-27, 18-30, 20-30 and up to 32 years for specified posts. Category relaxations apply under SSC rules.", badge: "Post-specific" },
          { title: "Selection structure", text: "Tier-I is followed by Tier-II. Post-specific qualifying modules, computer/data-entry requirements and document verification apply where prescribed.", badge: "Two-tier CBE" },
          { title: "Posts", text: "Recruitment covers multiple Group B and Group C posts across Central Government ministries, departments, organisations and statutory or constitutional bodies.", badge: "Multiple posts" },
        ],
      },
      dates: {
        eyebrow: "Current cycle",
        title: "SSC CGL 2026 important updates",
        description: "The 2026 CGL cycle is active. Use SSC's live notice board for the latest schedule and vacancy revisions.",
        cards: [
          { title: "Notice published", text: "SSC published the Combined Graduate Level Examination, 2026 notice on 21 May 2026.", badge: "21 May 2026", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
          { title: "Application window reopened", text: "SSC reopened the online application window from 23 June to 25 June 2026; the revised fee-payment deadline was 26 June 2026 and the correction window was 1-3 July 2026.", badge: "Completed" },
          { title: "Tier-I city / admission-certificate update", text: "SSC issued the Tier-I city and admission-certificate information notice on 21 September 2026.", badge: "21 Sep 2026" },
          { title: "Tentative vacancies", text: "SSC published an updated tentative-vacancy statement for CGL 2026 on 24 September 2026. Vacancy totals remain subject to revision.", badge: "24 Sep 2026", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
        ],
      },
      salary: {
        eyebrow: "Posts & pay",
        title: "SSC CGL posts and pay levels",
        description: "CGL is a multi-post examination, so salary depends on the post and department.",
        cards: [
          { title: "Pay levels", text: "The 2026 notice includes posts across multiple 7th CPC pay levels, including Levels 4 through 8 depending on the post.", badge: "Post-dependent" },
          { title: "Examples of posts", text: "The notice includes Assistant Audit Officer, Assistant Accounts Officer, Assistant Section Officer, Inspectors, Auditors, Accountants and other Group B / Group C posts.", badge: "CGL cadre" },
          { title: "Allowances", text: "DA, HRA, transport allowance and other benefits depend on the allotted post, department and place of posting under applicable Central Government rules.", badge: "Varies" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC CGL 2026 FAQs",
        description: "Key points for the current cycle.",
        cards: [
          { title: "Is SSC CGL only for one post?", text: "No. CGL is a common recruitment examination for many Group B and Group C posts across Central Government organisations." },
          { title: "What is the Tier-I pattern?", text: "Tier-I has 100 questions for 200 marks across Reasoning, General Awareness, Quantitative Aptitude and English Comprehension." },
          { title: "Is there negative marking in Tier-I?", text: "Yes. The 2026 notice states a deduction of 0.50 mark for each wrong answer in Tier-I." },
          { title: "Are age limits the same for every CGL post?", text: "No. The age band depends on the post. Always check the post-wise eligibility table in the current notice." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "SSC CGL 2026 official status",
        description: "Current updates are taken from SSC's official notice board.",
        cards: [
          { title: "Tentative vacancy update", text: "SSC published the updated tentative vacancy statement on 24 September 2026.", badge: "24 Sep 2026", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
          { title: "Tier-I city / admission certificate notice", text: "SSC released the Tier-I city and admission-certificate information on 21 September 2026.", badge: "21 Sep 2026", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
          { title: "Application reopening notice", text: "The application window was reopened for 23-25 June 2026.", badge: "23 Jun 2026" },
        ],
      },
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
    testHub: {
      mode: "dual",
      stage1Label: "Tier-I",
      stage2Label: "Tier-II",
      stage1Keywords: ["tier-i", "tier i", "tier-1", "tier 1"],
      stage2Keywords: ["tier-ii", "tier ii", "tier-2", "tier 2"],
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
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "SSC CHSL 2026 eligibility",
        description: "CHSL is the 10+2-level SSC recruitment route for LDC/JSA and DEO-type posts. Post-specific requirements remain governed by the 2026 notice.",
        cards: [
          { title: "Educational qualification", text: "Candidates must meet the 10+2 / Senior Secondary qualification prescribed in the current notice. Certain DEO posts can carry additional subject requirements.", badge: "10+2 level" },
          { title: "Age", text: "CHSL normally uses a common young-entry age band with category relaxations, but candidates should rely on the exact crucial date and limits in the 2026 notice.", badge: "Verify notice" },
          { title: "Selection stages", text: "Tier-I CBE → Tier-II modules → qualifying Computer Knowledge and Skill / Typing Test as applicable to the post.", badge: "Tier-I + Tier-II" },
          { title: "Typing / data entry", text: "LDC/JSA candidates face the prescribed typing test; DEO candidates face the prescribed data-entry skill test.", badge: "Qualifying skill" },
        ],
      },
      dates: {
        eyebrow: "Current cycle",
        title: "SSC CHSL 2026 schedule",
        description: "SSC lists CHSL 2026 in its 2026-27 examination calendar.",
        cards: [
          { title: "2026 notification cycle", text: "The official SSC calendar places the CHSL 2026 advertisement in April 2026 with application closing in May 2026.", badge: "2026 cycle" },
          { title: "Tier-I window", text: "The official calendar scheduled Tier-I for the July-September 2026 period. Candidates should use SSC notices and admission certificates for exact dates.", badge: "Tier-I" },
          { title: "Later stages", text: "Tier-II and skill / typing schedules are announced separately by SSC after Tier-I processing.", badge: "Follow SSC", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
        ],
      },
      salary: {
        eyebrow: "Posts & pay",
        title: "SSC CHSL posts and pay",
        description: "Pay varies by LDC/JSA, DEO and the recruiting department.",
        cards: [
          { title: "LDC / JSA", text: "Lower Division Clerk / Junior Secretariat Assistant posts are Central Government clerical posts with pay fixed under the applicable 7th CPC level in the notice.", badge: "Clerical" },
          { title: "DEO", text: "Data Entry Operator posts can carry different pay levels depending on the organisation and post.", badge: "Post-dependent" },
          { title: "Allowances", text: "Allowances depend on the allotted department and place of posting under Central Government rules.", badge: "Varies" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC CHSL 2026 FAQs",
        description: "Core preparation and selection questions.",
        cards: [
          { title: "What is the CHSL Tier-I pattern?", text: "Tier-I uses four sections—English, General Intelligence, Quantitative Aptitude and General Awareness—with 25 questions and 50 marks per section." },
          { title: "Is Tier-II only descriptive?", text: "No. The current structure uses multiple Tier-II modules including Maths, Reasoning, English, General Awareness and qualifying computer / skill components." },
          { title: "Do all posts use the same skill test?", text: "No. The final qualifying skill component depends on the post, such as Typing Test for LDC/JSA or DEST for DEO." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "SSC CHSL 2026 official status",
        description: "Follow SSC for result, answer-key and Tier-II schedule notices.",
        cards: [
          { title: "CHSL 2026 cycle", text: "The 2026 cycle is listed in the SSC 2026-27 calendar, with Tier-I scheduled in the July-September 2026 period.", badge: "Official calendar", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
        ],
      },
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
    testHub: {
      mode: "single",
      stage1Label: "CBE",
      stage1Keywords: ["cbe", "computer based examination", "session-i", "session ii", "session-i", "session-ii"],
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
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "SSC MTS & Havaldar 2026 eligibility",
        description: "MTS is a matriculation-level recruitment; Havaldar candidates must also satisfy the physical-stage requirements.",
        cards: [
          { title: "Educational qualification", text: "Candidates must meet the Matriculation / Class 10 qualification requirement prescribed by SSC.", badge: "Matric level" },
          { title: "Age", text: "Age limits differ by MTS / Havaldar vacancy and department. Use the exact age band and crucial date in the 2026 notice.", badge: "Post-specific" },
          { title: "MTS selection", text: "Computer Based Examination followed by document / eligibility verification as prescribed.", badge: "CBE" },
          { title: "Havaldar selection", text: "Computer Based Examination plus the prescribed PET/PST for Havaldar candidates.", badge: "CBE + PET/PST" },
        ],
      },
      dates: {
        eyebrow: "Current cycle",
        title: "SSC MTS & Havaldar 2026 schedule",
        description: "The official SSC calendar places the 2026 cycle in the second half of the year.",
        cards: [
          { title: "Notification period", text: "SSC's 2026-27 calendar places the MTS & Havaldar advertisement in June 2026 with application closing in July 2026.", badge: "2026 cycle" },
          { title: "CBE window", text: "The official calendar schedules the 2026 CBE for the September-November 2026 period.", badge: "Sep-Nov 2026" },
          { title: "Havaldar physical stage", text: "PET/PST is conducted after CBE shortlisting for the Havaldar posts.", badge: "Later stage", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
        ],
      },
      salary: {
        eyebrow: "Post & pay",
        title: "SSC MTS / Havaldar pay",
        description: "The exact in-hand amount depends on posting and allowances.",
        cards: [
          { title: "MTS / Havaldar", text: "These are Central Government support posts paid under the 7th CPC structure specified in the notice and recruiting department.", badge: "Central Govt." },
          { title: "Allowances", text: "DA, HRA, transport and other admissible allowances depend on the place of posting and rules in force.", badge: "Varies" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC MTS 2026 FAQs",
        description: "Core questions for MTS and Havaldar candidates.",
        cards: [
          { title: "Is the MTS exam only one session?", text: "No. Recent SSC MTS CBEs use two mandatory sessions on the same examination day." },
          { title: "Does Havaldar require a physical test?", text: "Yes. Havaldar recruitment includes PET/PST after CBE shortlisting." },
          { title: "What qualification is required?", text: "The base qualification is Matriculation / Class 10, subject to the current notice's crucial date and documentary conditions." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "SSC MTS 2026 official status",
        description: "The current CBE cycle falls in the September-November 2026 window in SSC's official calendar.",
        cards: [
          { title: "2026 CBE cycle", text: "SSC's official 2026-27 calendar schedules MTS & Havaldar CBE during September-November 2026.", badge: "Current cycle", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
        ],
      },
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
    testHub: {
      mode: "dual",
      stage1Label: "Paper-I",
      stage2Label: "Paper-II",
      stage1Keywords: ["paper-i", "paper i", "paper-1", "paper 1"],
      stage2Keywords: ["paper-ii", "paper ii", "paper-2", "paper 2"],
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
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "SSC CPO 2026 eligibility",
        description: "CPO recruits Sub-Inspectors in Delhi Police and CAPFs and combines academic, physical and medical requirements.",
        cards: [
          { title: "Educational qualification", text: "A bachelor's degree is required for the Sub-Inspector recruitment, subject to the current notice's post-specific conditions.", badge: "Graduate level" },
          { title: "Age", text: "CPO uses a young-entry age band with statutory category relaxations. Verify the exact 2026 crucial date and age limits in the current notice.", badge: "Verify notice" },
          { title: "Selection stages", text: "Paper-I CBE → PET/PST → Paper-II → medical examination / document verification and other prescribed stages.", badge: "Written + physical" },
          { title: "Physical standards", text: "Height, chest, race and other PET/PST standards differ by sex and eligible categories and must be checked in the official notice.", badge: "Mandatory" },
        ],
      },
      dates: {
        eyebrow: "Current cycle",
        title: "SSC CPO 2026 schedule",
        description: "The 2026-27 SSC calendar places CPO Paper-I in the October-November 2026 period.",
        cards: [
          { title: "Notification cycle", text: "SSC's official calendar places the 2026 CPO advertisement in May 2026 with closing in June 2026.", badge: "2026 cycle" },
          { title: "Paper-I window", text: "Paper-I is scheduled for October-November 2026 in the official SSC calendar.", badge: "Oct-Nov 2026" },
          { title: "PET/PST and Paper-II", text: "These stages are scheduled separately after Paper-I shortlisting.", badge: "Later stages", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
        ],
      },
      salary: {
        eyebrow: "Post & pay",
        title: "SSC CPO Sub-Inspector role",
        description: "CPO recruits Sub-Inspectors in Delhi Police and Central Armed Police Forces.",
        cards: [
          { title: "Sub-Inspector", text: "Selected candidates are appointed to Sub-Inspector posts in Delhi Police / CAPFs under the pay scale and service rules specified in the notice.", badge: "Uniformed service" },
          { title: "Allowances", text: "Allowances and field/service benefits depend on the force, place of posting and rules in force.", badge: "Force-specific" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC CPO 2026 FAQs",
        description: "Core selection questions.",
        cards: [
          { title: "Is PET/PST qualifying?", text: "PET/PST is a mandatory selection stage. Candidates must satisfy the prescribed physical standards before progressing." },
          { title: "Does CPO have two written papers?", text: "Yes. Paper-I is followed, after physical-stage shortlisting, by Paper-II as prescribed by SSC." },
          { title: "Should physical preparation wait until Paper-I?", text: "No. Candidates should prepare physical fitness in parallel because the PET/PST stage follows written shortlisting." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "SSC CPO 2026 official status",
        description: "The current official calendar places Paper-I in October-November 2026.",
        cards: [
          { title: "Paper-I cycle", text: "SSC's 2026-27 calendar schedules the CPO 2026 Paper-I CBE for October-November 2026.", badge: "Current window", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
        ],
      },
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
    testHub: {
      mode: "single",
      stage1Label: "CBE",
      stage1Keywords: ["cbe", "computer based examination"],
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
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "SSC Stenographer Grade C & D 2026 eligibility",
        description: "The examination combines a 10+2-level academic requirement with a qualifying stenography skill test.",
        cards: [
          { title: "Educational qualification", text: "Candidates must satisfy the 10+2 / Senior Secondary qualification prescribed in the notice.", badge: "10+2 level" },
          { title: "Age", text: "Grade C and Grade D use different age limits and category relaxations. Check the exact 2026 crucial date in the notice.", badge: "Grade-specific" },
          { title: "CBE", text: "General Intelligence & Reasoning, General Awareness, and English Language & Comprehension.", badge: "200 questions" },
          { title: "Skill test", text: "A 10-minute dictation is taken at 100 w.p.m. for Grade C or 80 w.p.m. for Grade D, followed by computer transcription within the prescribed time.", badge: "Qualifying skill" },
        ],
      },
      dates: {
        eyebrow: "Current cycle",
        title: "SSC Stenographer 2026 schedule",
        description: "The 2026 CBE has progressed to the answer-key stage.",
        cards: [
          { title: "2026 examination window", text: "SSC's official calendar scheduled Stenographer Grade C & D CBE for August-September 2026.", badge: "Aug-Sep 2026" },
          { title: "Tentative answer key", text: "SSC uploaded the 2026 tentative answer keys and candidate response sheets on 23 September 2026.", badge: "23 Sep 2026", ctaLabel: "SSC answer keys", href: "https://ssc.gov.in/home/answer-key" },
          { title: "Skill-test addendum", text: "SSC also issued an addendum on 23 September 2026 making Mangal font mandatory for Hindi typing / skill-test transcription.", badge: "23 Sep 2026" },
        ],
      },
      salary: {
        eyebrow: "Posts & pay",
        title: "SSC Stenographer Grade C & D posts",
        description: "Pay and service conditions depend on the grade, ministry / department and post.",
        cards: [
          { title: "Grade C", text: "Grade C appointments are made to higher stenographic cadres in participating Central Government offices under the applicable pay level.", badge: "Grade C" },
          { title: "Grade D", text: "Grade D appointments are made across participating ministries, departments and offices under the applicable pay level.", badge: "Grade D" },
          { title: "Vacancies", text: "SSC publishes tentative grade-wise and department-wise vacancy statements separately and can revise them.", badge: "Tentative" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC Stenographer 2026 FAQs",
        description: "Written and skill-test essentials.",
        cards: [
          { title: "How much of the CBE is English?", text: "English Language & Comprehension carries 100 of the 200 CBE questions; Reasoning and General Awareness carry 50 each." },
          { title: "What are the stenography speeds?", text: "The skill test uses 100 w.p.m. dictation for Grade C and 80 w.p.m. for Grade D." },
          { title: "Is the skill test optional?", text: "No. It is a qualifying selection stage for shortlisted candidates." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "SSC Stenographer 2026 official status",
        description: "The CBE has reached tentative-answer-key processing.",
        cards: [
          { title: "Tentative answer keys uploaded", text: "SSC uploaded the Stenographer Grade C & D Examination 2026 tentative answer keys and response sheets on 23 September 2026.", badge: "23 Sep 2026", ctaLabel: "Open answer keys", href: "https://ssc.gov.in/home/answer-key" },
          { title: "Hindi skill-test font update", text: "SSC issued an addendum requiring Mangal font for Hindi typing / skill-test transcription.", badge: "23 Sep 2026", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
        ],
      },
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
    testHub: {
      mode: "single",
      stage1Label: "CBE",
      stage1Keywords: ["cbe", "computer based examination"],
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
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "SSC GD 2027 eligibility",
        description: "The next GD cycle covers Constable (GD) recruitment in CAPFs / SSF and Rifleman (GD) in Assam Rifles, subject to the 2027 notice.",
        cards: [
          { title: "Educational qualification", text: "SSC GD is a matriculation-level recruitment. Candidates should verify the qualifying date and documentary conditions in the 2027 notice.", badge: "Matric level" },
          { title: "Age", text: "The exact 2027 age band, crucial date and category relaxations must be taken from the 2027 notification.", badge: "Notification controls" },
          { title: "Selection stages", text: "CBE → PET/PST → medical examination / document verification and other force-specific checks prescribed in the notice.", badge: "Written + physical" },
          { title: "Physical standards", text: "Race, height, chest and other standards differ by sex and eligible categories. Candidates should prepare fitness in parallel with CBE work.", badge: "Mandatory" },
        ],
      },
      dates: {
        eyebrow: "Next cycle",
        title: "SSC GD 2027 schedule",
        description: "SSC's 2026-27 calendar already lists the next GD recruitment cycle.",
        cards: [
          { title: "Notification period", text: "The official calendar places the SSC GD 2027 advertisement in September 2026 with applications closing in October 2026.", badge: "Sep-Oct 2026" },
          { title: "CBE window", text: "The official calendar schedules the 2027 CBE for January-March 2027.", badge: "Jan-Mar 2027" },
          { title: "Physical / medical stages", text: "PET/PST and medical stages follow CBE shortlisting and are scheduled separately.", badge: "Later stages", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
        ],
      },
      salary: {
        eyebrow: "Role & pay",
        title: "SSC GD posts",
        description: "The exact force-wise pay and allowances are governed by the 2027 notice and allotted organisation.",
        cards: [
          { title: "CAPFs / SSF / Assam Rifles", text: "Recruitment is for uniformed constable / rifleman roles in the forces and organisations listed in the notification.", badge: "Uniformed service" },
          { title: "Allowances", text: "Field, risk, location and other allowances depend on the allotted force, posting and applicable rules.", badge: "Force-specific" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC GD 2027 FAQs",
        description: "What candidates should know before the next cycle.",
        cards: [
          { title: "When is SSC GD 2027 CBE expected?", text: "SSC's official 2026-27 calendar places the CBE in January-March 2027." },
          { title: "Is there a physical test?", text: "Yes. PET/PST is a mandatory stage after CBE shortlisting." },
          { title: "Should I prepare only for the written exam?", text: "No. Physical fitness should be trained alongside Reasoning, General Awareness, Elementary Mathematics and the chosen language section." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "SSC GD 2027 official status",
        description: "The next cycle is listed in the SSC examination calendar.",
        cards: [
          { title: "SSC GD 2027 calendar entry", text: "The official SSC 2026-27 calendar places notification in September 2026, closing in October 2026 and CBE in January-March 2027.", badge: "Upcoming cycle", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
        ],
      },
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
      hubTitle: "IBPS PO 2026 (CRP PO/MT-XVI) Preparation, Syllabus, Mock Tests & Updates",
      hubDescription: "Prepare for IBPS CRP PO/MT-XVI with the current 2026 prelims and mains pattern, detailed syllabus guidance, mock tests, official-cycle updates, and topic-wise banking practice.",
      preparationTitle: "How to Prepare for IBPS PO 2026 (CRP PO/MT-XVI)",
      preparationDescription: "A practical IBPS PO 2026 preparation guide aligned to the revised PO/MT-XVI pattern: separately timed prelims, 170-question mains objective paper, descriptive essay and comprehension, banking awareness, and mock analysis.",
      syllabusTitle: "IBPS PO 2026 Syllabus & Revised Exam Pattern (CRP PO/MT-XVI)",
      syllabusDescription: "Current IBPS PO/MT-XVI syllabus and examination structure for the 2026 recruitment cycle, including prelims, mains objective tests, descriptive paper, personality test, interview, and final merit.",
    },
    hub: {
      title: "IBPS PO 2026 preparation hub",
      description: "CRP PO/MT-XVI is the current IBPS Probationary Officer / Management Trainee recruitment for vacancies of 2027-28. Use this hub for prelims and mains practice, the revised 2026 exam pattern, official-cycle updates, previous papers, and topic-wise preparation.",
      preparationSummary: "Prelims is a screening stage; for serious preparation, combine separately timed prelims practice with mains-level Reasoning, Data Analysis, Banking/Digital/Financial Awareness, English, and descriptive writing.",
      syllabusSummary: "The XVI pattern uses 100 questions / 100 marks / 60 minutes in prelims and 170 objective questions / 200 marks / 160 minutes in mains, plus a 25-mark descriptive paper.",
      mockSummary: "Use timed sectionals and full mocks to improve question selection. Review every slow, guessed, skipped, or incorrect question and separately track mains awareness and descriptive readiness.",
    },
    preparation: {
      eyebrow: "IBPS PO/MT-XVI preparation",
      title: "How to prepare for IBPS PO 2026",
      description: "For the XVI cycle, prepare for the revised marks distribution rather than relying on older PO patterns. Keep prelims speed work and mains depth in parallel, with extra attention to Banking/Digital/Financial Awareness and the descriptive Essay + Comprehension paper.",
      cards: [
        { title: "1. Master the revised prelims split", text: "English carries 30 marks, Quantitative Aptitude 30 marks and Reasoning Ability 40 marks. Each section is separately timed for 20 minutes, so practise the sections independently as well as in full mocks." },
        { title: "2. Build mains depth early", text: "Mains has 170 objective questions for 200 marks in 160 minutes: Reasoning 60 marks, Awareness 60, English 20 and Data Analysis & Interpretation 60. Do not postpone these sections until after prelims." },
        { title: "3. Prepare descriptive + interview stages", text: "The descriptive paper is Essay and Comprehension for 25 marks in 30 minutes. After mains, shortlisted candidates must appear for the Personality Test and Interview; final merit uses Main and Interview scores in an 80:20 ratio." },
      ],
      weeklyCycle: [
        "Take separately timed 20-minute prelims section tests and track attempts, accuracy and time lost.",
        "Practise arithmetic, approximation/series and Data Interpretation with calculation-speed drills.",
        "Rotate puzzles, seating/arrangement, syllogism, inequality, coding-decoding, ranking and logical reasoning sets.",
        "Practise reading comprehension, grammar, vocabulary and sentence-level English every day.",
        "Revise General/Economy/Banking, Digital and Financial Awareness, including relevant RBI circulars, in short recurring blocks.",
        "Write one timed essay or comprehension response each week and review clarity, structure, grammar and word economy.",
        "Take one full mock regularly and classify every miss as concept, selection, calculation, reading, awareness recall or time-management error.",
      ],
    },
    syllabus: {
      eyebrow: "IBPS PO/MT-XVI syllabus",
      title: "IBPS PO/MT-XVI syllabus and revised exam pattern 2026",
      description: "The 2026 XVI cycle uses a revised marks distribution in prelims and a 170-question mains objective paper. The exact official section names, marks and timings below reflect the current notification; topic-level practice areas are organised for preparation.",
      sections: [
        { title: "Prelims · English Language", summary: "30 questions · 30 marks · 20 minutes · English medium" },
        { title: "Prelims · Quantitative Aptitude", summary: "35 questions · 30 marks · 20 minutes · English/Hindi" },
        { title: "Prelims · Reasoning Ability", summary: "35 questions · 40 marks · 20 minutes · English/Hindi" },
        { title: "Mains · Reasoning", summary: "40 questions · 60 marks · 45 minutes · English/Hindi" },
        { title: "Mains · General/Economy/Banking/Digital/Financial Awareness", summary: "50 questions · 60 marks · 35 minutes · includes RBI circulars · English/Hindi" },
        { title: "Mains · English Language", summary: "40 questions · 20 marks · 35 minutes · English medium" },
        { title: "Mains · Data Analysis & Interpretation", summary: "40 questions · 60 marks · 45 minutes · English/Hindi" },
        { title: "Mains · Descriptive Paper", summary: "Essay and Comprehension · 2 questions · 25 marks · 30 minutes · English" },
      ],
      patternCards: [
        { title: "Preliminary examination", text: "100 questions · 100 marks · 60 minutes. English, Quantitative Aptitude and Reasoning Ability are separately timed for 20 minutes each. Candidates must qualify the tests as prescribed by IBPS to be shortlisted for Mains." },
        { title: "Main examination", text: "Objective paper: 170 questions · 200 marks · 160 minutes. Descriptive paper: Essay and Comprehension · 2 questions · 25 marks · 30 minutes. Objective sections are separately timed." },
        { title: "Negative marking", text: "For a wrong answer in an objective test, one-fourth of the marks assigned to that question is deducted. There is no penalty for an unanswered question." },
        { title: "Selection after Mains", text: "Shortlisted candidates must appear for the Personality Test and then the Common Interview. The Interview carries 100 marks; minimum qualifying marks are 40% for General/EWS and 35% for SC/ST/OBC/PwBD candidates." },
        { title: "Final merit", text: "Prelims is qualifying. Final merit uses the Main Examination and Interview scores in an 80:20 weightage. Provisional allotment depends on actual vacancies reported by participating banks and candidate preferences." },
        { title: "2026 dates", text: "Prelims: 22-23 August 2026. Main Examination: 4 October 2026. The exact time and venue on the candidate's call letter govern the individual exam appointment." },
      ],
      verificationNote: "CRP PO/MT-XVI is for vacancies of 2027-28. IBPS issued the detailed notification on 1 July 2026 and subsequently revised the indicative vacancy position. Always verify time-sensitive dates, vacancies, eligibility, call letters, results and corrigenda on the official IBPS PO/MT-XVI page.",
    },
    details: {
      eligibility: {
        eyebrow: "Eligibility & selection",
        title: "IBPS PO/MT-XVI eligibility and selection process",
        description: "Core eligibility is based on the official CRP PO/MT-XVI notification. Reservation, certificate, nationality and relaxation conditions should always be checked against the full notification.",
        cards: [
          { title: "Educational qualification", text: "A degree (graduation) in any discipline from a university recognised by the Government of India, or an equivalent qualification recognised by the Central Government.", badge: "Eligibility" },
          { title: "Age limit", text: "20 to 30 years as on 1 July 2026. The base date-of-birth range is 2 July 1996 to 1 July 2006, both dates inclusive.", badge: "Eligibility" },
          { title: "Upper-age relaxation", text: "SC/ST: 5 years · OBC (Non-Creamy Layer): 3 years · PwBD: 10 years · eligible ex-servicemen/commissioned officers under the notification: 5 years. Read the notification for complete cumulative-relaxation rules.", badge: "Relaxation" },
          { title: "Application fee", text: "₹175 including GST for SC/ST/PwBD candidates; ₹850 including GST for all other candidates. The 2026 application window is already closed.", badge: "2026 cycle" },
          { title: "Selection stages", text: "Online Preliminary Examination → Online Main Examination (objective + descriptive) → mandatory Personality Test → Common Interview → Provisional Allotment.", badge: "Selection" },
          { title: "Interview and final merit", text: "Interview: 100 marks. Minimum qualifying marks: 40% for General/EWS and 35% for SC/ST/OBC/PwBD. Main and Interview are combined in an 80:20 ratio for final merit.", badge: "Final merit" },
        ],
      },
      dates: {
        eyebrow: "Important dates & vacancies",
        title: "IBPS PO 2026 important dates and latest vacancy position",
        description: "The application stage and prelims are complete. The current cycle has progressed to the Main Examination stage.",
        cards: [
          { title: "Detailed notification", text: "1 July 2026 · CRP PO/MT-XVI notification issued for vacancies of 2027-28.", badge: "Completed", ctaLabel: "Official notification", href: "https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf" },
          { title: "Application window", text: "Online registration and fee payment: 1 July to 26 July 2026. Edit window: 29-30 July 2026.", badge: "Closed" },
          { title: "Preliminary examination", text: "22 and 23 August 2026.", badge: "Completed" },
          { title: "Prelims score display", text: "IBPS opened the preliminary score display on 29 September 2026; the current score-display window is scheduled through 28 October 2026.", badge: "Current update" },
          { title: "Main examination", text: "4 October 2026. Candidates should follow the date, reporting time and venue printed on their call letter.", badge: "Current stage" },
          { title: "Indicative vacancies", text: "7,565 vacancies in the latest Annexure I position published on 27 August 2026. Union Bank of India was shown as not reported, so the figure remains indicative rather than a final allotment total.", badge: "Updated 27 Aug 2026", ctaLabel: "Latest vacancy annexure", href: "https://www.ibps.in/wp-content/uploads/ANNEXURE-I_updated_25.08.2026.pdf" },
          { title: "Bank-wise vacancy snapshot", text: "Bank of Baroda 1,900 · Bank of India 500 · Bank of Maharashtra 1,100 · Canara Bank 1,500 · Central Bank of India 500 · Indian Bank 650 · Indian Overseas Bank 550 · Punjab National Bank 504 · Punjab & Sind Bank 161 · UCO Bank 200 · Union Bank of India: not reported.", badge: "Annexure I" },
          { title: "Later stages", text: "Personality Test / Interview follow the Main result and shortlisting process. Provisional allotment is expected in the later part of the recruitment cycle; candidates should follow the official IBPS updates page for final dates.", badge: "Upcoming" },
        ],
      },
      salary: {
        eyebrow: "Salary & job profile",
        title: "IBPS PO pay scale and role",
        description: "IBPS specifies the basic pay scale. Allowances and perquisites depend on the rules of the participating bank and place of posting, so Examtree does not publish an invented in-hand salary figure.",
        cards: [
          { title: "Starting basic pay", text: "₹48,480.", badge: "JMGS-I" },
          { title: "Official basic-pay scale", text: "₹48,480-2,000/7-62,480-2,340/2-67,160-2,680/7-85,920.", badge: "Pay scale" },
          { title: "Allowances & perquisites", text: "Eligible officers receive allowances and perquisites according to the participating bank's rules in force from time to time. These can vary by bank and posting.", badge: "Bank-specific" },
          { title: "Role", text: "Probationary Officer / Management Trainee is an entry-level officer track in participating public sector banks, involving branch operations, customer service, credit/operations exposure, compliance and managerial responsibilities as assigned by the bank.", badge: "Job profile" },
        ],
      },
      faq: {
        eyebrow: "Frequently asked questions",
        title: "IBPS PO 2026 FAQs",
        description: "Quick answers for the current CRP PO/MT-XVI cycle.",
        cards: [
          { title: "How many IBPS PO vacancies are there in the latest update?", text: "The latest indicative vacancy annexure published on 27 August 2026 totals 7,565. Union Bank of India was shown as not reported, and provisional allotment ultimately uses actual vacancies reported by participating banks." },
          { title: "Do prelims marks count in final merit?", text: "No. Prelims is a screening stage. Final merit is based on the Main Examination and Interview, combined in an 80:20 ratio." },
          { title: "What is the current IBPS PO Mains pattern?", text: "170 objective questions for 200 marks in 160 minutes, plus an English descriptive paper with one Essay and one Comprehension task for 25 marks in 30 minutes." },
          { title: "Is there negative marking?", text: "Yes. One-fourth of the marks assigned to an objective question is deducted for a wrong answer. Unanswered questions carry no penalty." },
          { title: "What is the age limit?", text: "20-30 years as on 1 July 2026, with category-wise upper-age relaxations under the notification." },
          { title: "What is the starting basic pay?", text: "₹48,480 in the official JMGS-I basic scale. Allowances and perquisites vary according to the allotted bank's rules." },
        ],
      },
      updates: {
        eyebrow: "Current official updates",
        title: "IBPS PO/MT-XVI latest official status",
        description: "Current-cycle snapshot verified for 4 October 2026. Status should follow IBPS, not coaching-site calendars.",
        cards: [
          { title: "Main Examination call letter", text: "The Main Examination call-letter download window opened on 24 September 2026 and closes on 4 October 2026.", badge: "24 Sep 2026", ctaLabel: "Official CRP PO/MT-XVI page", href: "https://www.ibps.in/index.php/management-trainees-xvi/" },
          { title: "Preliminary score display", text: "IBPS opened the Online Preliminary Examination score display on 29 September 2026, with the displayed closure date 28 October 2026.", badge: "29 Sep 2026", ctaLabel: "Official CRP PO/MT-XVI page", href: "https://www.ibps.in/index.php/management-trainees-xvi/" },
          { title: "Latest vacancy update", text: "IBPS published a further vacancy corrigendum / updated vacancy position on 27 August 2026. The indicative total is 7,565.", badge: "27 Aug 2026", ctaLabel: "Vacancy annexure", href: "https://www.ibps.in/wp-content/uploads/ANNEXURE-I_updated_25.08.2026.pdf" },
          { title: "Detailed notification", text: "The CRP PO/MT-XVI detailed notification was published on 1 July 2026.", badge: "1 Jul 2026", ctaLabel: "Notification PDF", href: "https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf" },
        ],
      },
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
  "ssc-selection-post": {
    slug: "ssc-selection-post",
    name: "SSC Selection Post",
    yearLabel: "Phase XIV / 2026",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC Selection Post Phase XIV 2026 Preparation, Pattern & Updates",
      hubDescription: "Prepare for SSC Selection Post Phase XIV/2026 with level-wise CBE guidance, post-specific eligibility, current notices and ExamTree practice.",
      preparationTitle: "How to Prepare for SSC Selection Post Phase XIV 2026",
      preparationDescription: "Prepare by qualification level and post code: verify the post-specific eligibility first, then practise the common CBE subject families under SSC timing.",
      syllabusTitle: "SSC Selection Post Phase XIV 2026 Syllabus & Pattern",
      syllabusDescription: "SSC Selection Post Phase XIV/2026 uses a computer-based examination with the exact post eligibility, age, qualification and skill requirements defined separately for each post code.",
    },
    hub: {
      title: "SSC Selection Post Phase XIV/2026 hub",
      description: "Selection Post is not one uniform job. Use the post code first, verify its qualification and age conditions, then prepare for the relevant Matriculation, Higher Secondary or Graduation-level CBE.",
      preparationSummary: "Identify the post code and qualification level before studying; the same subject families are tested at different difficulty levels.",
      syllabusSummary: "The CBE covers General Intelligence, General Awareness, Quantitative Aptitude and English, with difficulty aligned to the prescribed qualification level.",
      mockSummary: "Practise level-appropriate SSC questions and keep post-code eligibility separate from exam preparation.",
    },
    testHub: {
      mode: "single",
      stage1Label: "CBE",
      stage1Keywords: ["cbe", "computer based examination"],
    },
    preparation: {
      eyebrow: "Selection Post preparation",
      title: "How to prepare for SSC Selection Post Phase XIV/2026",
      description: "Start from the post code, not from a generic Selection Post label. Confirm Essential Qualification, age, experience and skill-test conditions before investing in preparation.",
      cards: [
        { title: "1. Lock the post code", text: "Open the SSC post-details page and confirm the exact post name, qualification level, age limit, experience and category conditions." },
        { title: "2. Prepare at the correct level", text: "Use Matriculation, Higher Secondary or Graduation-level practice as applicable; the subject families are similar but the expected level changes." },
        { title: "3. Keep document scrutiny in view", text: "Candidates qualifying the CBE must upload the prescribed documents for scrutiny; eligibility is checked against the post-specific notice." },
      ],
      weeklyCycle: [
        "Verify the target post code and Essential Qualification.",
        "Rotate General Intelligence and Quantitative Aptitude practice.",
        "Revise General Awareness in short recurring blocks.",
        "Practise English grammar, vocabulary and comprehension.",
        "Take one mixed CBE mock at the correct qualification level.",
        "Maintain a checklist of certificates, experience and category documents required by the post.",
      ],
    },
    syllabus: {
      eyebrow: "Phase XIV / 2026",
      title: "SSC Selection Post Phase XIV syllabus and scheme",
      description: "Selection Post Phase XIV/2026 uses a CBE, but post-specific qualification, age, experience and skill requirements are defined separately in Annexure III and the SSC post-details portal.",
      sections: [
        { title: "General Intelligence", summary: "Common CBE subject · difficulty depends on qualification level" },
        { title: "General Awareness", summary: "Common CBE subject · difficulty depends on qualification level" },
        { title: "Quantitative Aptitude", summary: "Common CBE subject · level-specific" },
        { title: "English Language", summary: "Common CBE subject · grammar, vocabulary and comprehension" },
      ],
      patternCards: [
        { title: "Three qualification levels", text: "SSC conducts separate level-appropriate question papers for Matriculation, Higher Secondary and Graduation & above posts." },
        { title: "Post-specific eligibility", text: "Essential Qualification, experience, age limit, skill test and suitability conditions differ by post code; Annexure III / the SSC post-details portal is decisive." },
        { title: "After CBE", text: "Candidates successful in the CBE must upload relevant documents for scrutiny. User departments can reject candidature if post-specific eligibility is not met." },
      ],
      verificationNote: "Phase XIV/2026 was advertised on 13 April 2026. SSC has since issued addenda, corrigenda and post cancellations, so candidates must verify their exact post code on the live SSC notice board.",
    },
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "Selection Post eligibility is post-specific",
        description: "There is no single age or qualification rule for all Phase XIV posts.",
        cards: [
          { title: "Qualification level", text: "Posts are advertised at Matriculation, Higher Secondary and Graduation & above levels.", badge: "Post-specific" },
          { title: "Essential Qualification", text: "The exact degree, diploma, subject, experience or skill requirement is defined against the individual post code.", badge: "Check Annexure III" },
          { title: "Age limit", text: "Age limits vary by post code. Category relaxations apply under SSC rules where eligible.", badge: "Varies" },
          { title: "Document scrutiny", text: "CBE-qualified candidates must upload supporting documents; the user department performs detailed eligibility scrutiny.", badge: "Mandatory" },
        ],
      },
      dates: {
        eyebrow: "Phase XIV / 2026",
        title: "SSC Selection Post Phase XIV important dates",
        description: "The application and CBE stages have progressed; post-specific corrigenda continue to be published.",
        cards: [
          { title: "Notification", text: "Phase XIV/2026 notice published on 13 April 2026.", badge: "13 Apr 2026" },
          { title: "Application window", text: "13 April to 4 May 2026; fee payment closed 5 May 2026 and correction window ran 11-13 May 2026.", badge: "Closed" },
          { title: "CBE", text: "The notice scheduled the CBE for June 2026 on a tentative basis.", badge: "2026 cycle" },
          { title: "Corrigenda / cancellations", text: "SSC has continued issuing post-specific corrigenda and cancellation notices, including notices in October 2026.", badge: "Check post code", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
        ],
      },
      salary: {
        eyebrow: "Posts & pay",
        title: "Selection Post salary",
        description: "Salary cannot be represented by one figure because Phase XIV contains many unrelated posts.",
        cards: [
          { title: "Pay level", text: "Each post code carries its own pay level / scale and department. Check the post-details entry before comparing opportunities.", badge: "Post-specific" },
          { title: "Job profile", text: "Roles range across technical, scientific, clerical, field and support functions depending on the user department.", badge: "Wide variety" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC Selection Post Phase XIV FAQs",
        description: "The key distinction is that eligibility belongs to the post code, not the examination name.",
        cards: [
          { title: "Is there one qualification for Selection Post?", text: "No. Each post code has its own Essential Qualification; posts are grouped broadly by Matriculation, Higher Secondary and Graduation & above levels." },
          { title: "Can I apply for multiple post codes?", text: "Candidates must follow SSC's application instructions and satisfy the eligibility of every post code applied for." },
          { title: "Is the CBE the final eligibility check?", text: "No. Detailed document scrutiny is carried out after CBE qualification, and candidature can be rejected if the post-specific conditions are not met." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "Phase XIV/2026 official status",
        description: "SSC continues to publish post-specific corrections and cancellation notices.",
        cards: [
          { title: "Phase XIV notice", text: "SSC published Advertisement No. Phase-XIV/2026/Selection Posts on 13 April 2026.", badge: "13 Apr 2026", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
          { title: "Additional DRDO posts", text: "SSC issued an addendum on 20 April 2026 adding four DRDO posts under special circumstances.", badge: "20 Apr 2026" },
          { title: "Post cancellations / corrigenda", text: "Post-specific changes continued through 2026. Always verify the exact post code before relying on an older saved notice.", badge: "Ongoing", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
        ],
      },
    },
    topics: SSC_CGL_TOPICS,
  },
  "ssc-je": {
    slug: "ssc-je",
    name: "SSC JE",
    yearLabel: "2026",
    categoryHref: "/category/ssc",
    officialUrl: "https://ssc.gov.in",
    officialLabel: "ssc.gov.in",
    meta: {
      hubTitle: "SSC JE 2026 Preparation, Syllabus, Pattern & Updates",
      hubDescription: "Prepare for SSC Junior Engineer 2026 for Civil, Mechanical and Electrical disciplines with paper-wise guidance and official-cycle updates.",
      preparationTitle: "How to Prepare for SSC JE 2026",
      preparationDescription: "A discipline-first SSC JE strategy covering engineering fundamentals, General Intelligence, General Awareness and timed Paper-I / Paper-II practice.",
      syllabusTitle: "SSC JE 2026 Syllabus & Exam Pattern",
      syllabusDescription: "SSC JE recruits Junior Engineers in Civil, Mechanical and Electrical streams for participating Government of India organisations.",
    },
    hub: {
      title: "SSC JE 2026 preparation hub",
      description: "Choose your engineering discipline first, then combine technical preparation with the General Intelligence and General Awareness components required by SSC.",
      preparationSummary: "Technical engineering carries the largest preparation load; use General Intelligence and General Awareness as regular scoring blocks rather than last-week revision.",
      syllabusSummary: "Paper-I tests General Intelligence, General Awareness and the chosen engineering discipline; later stages continue discipline-specific assessment under the current notice.",
      mockSummary: "Use discipline-specific technical sets plus full SSC JE papers to build calculation speed, formula recall and question selection.",
    },
    testHub: {
      mode: "dual",
      stage1Label: "Paper-I",
      stage2Label: "Paper-II",
      stage1Keywords: ["paper-i", "paper i", "paper-1", "paper 1"],
      stage2Keywords: ["paper-ii", "paper ii", "paper-2", "paper 2"],
    },
    preparation: {
      eyebrow: "SSC JE preparation",
      title: "How to prepare for SSC JE 2026",
      description: "Build a strong Civil, Mechanical or Electrical core first, then layer SSC-style objective practice and time control over it.",
      cards: [
        { title: "1. Lock the discipline", text: "Prepare only the engineering branch applicable to your target posts and qualification; do not mix Civil, Mechanical and Electrical syllabi." },
        { title: "2. Build technical depth", text: "Revise core formulas, standard results, units, code concepts and frequently tested applications before increasing speed." },
        { title: "3. Add SSC scoring sections", text: "Keep General Intelligence and General Awareness in recurring practice so technical preparation does not crowd them out." },
      ],
      weeklyCycle: [
        "Revise one technical subject block and its formula sheet.",
        "Solve a timed technical MCQ set from the same subject.",
        "Practise General Intelligence twice during the week.",
        "Revise General Awareness in short recurring blocks.",
        "Take a mixed Paper-I mock and analyse calculation and concept errors.",
        "Revisit weak technical topics with fresh questions rather than only notes.",
      ],
    },
    syllabus: {
      eyebrow: "SSC JE 2026",
      title: "SSC Junior Engineer syllabus and pattern",
      description: "SSC JE is discipline-specific. Candidates choose Civil, Mechanical or Electrical engineering according to the posts and qualifications for which they are eligible.",
      sections: [
        { title: "General Intelligence & Reasoning", summary: "Paper-I common section" },
        { title: "General Awareness", summary: "Paper-I common section" },
        { title: "Civil Engineering", summary: "Technical paper for Civil-target candidates" },
        { title: "Mechanical Engineering", summary: "Technical paper for Mechanical-target candidates" },
        { title: "Electrical Engineering", summary: "Technical paper for Electrical-target candidates" },
      ],
      patternCards: [
        { title: "Paper-I", text: "Computer-based paper combining General Intelligence, General Awareness and the candidate's chosen engineering discipline." },
        { title: "Paper-II", text: "Discipline-specific engineering assessment under the current SSC JE scheme. Use the 2026 notice for exact marks, timing and negative-marking provisions." },
        { title: "Post eligibility", text: "Degree / diploma and experience requirements differ by organisation and JE post. Candidates must match their qualification to the post table in the notice." },
      ],
      verificationNote: "SSC lists Junior Engineer (Civil, Mechanical & Electrical) Examination, 2026 in its official 2026-27 calendar. SSC also issued JE 2026 notices in September 2026, so candidates should use the live notice board for the current schedule and post additions.",
    },
    details: {
      eligibility: {
        eyebrow: "Eligibility",
        title: "SSC JE 2026 eligibility",
        description: "Eligibility is organisation- and discipline-specific.",
        cards: [
          { title: "Engineering qualification", text: "Candidates need the degree / diploma in Civil, Mechanical or Electrical Engineering specified against the target organisation and post.", badge: "Discipline-specific" },
          { title: "Experience", text: "Some organisations accept the prescribed degree directly, while some diploma routes require the experience stated in the notice.", badge: "Post-specific" },
          { title: "Age", text: "Upper-age limits differ by organisation / post; category relaxations apply under SSC rules.", badge: "Varies" },
          { title: "Selection", text: "Paper-I → Paper-II → document / eligibility verification and allocation under the current scheme.", badge: "Two papers" },
        ],
      },
      dates: {
        eyebrow: "Current cycle",
        title: "SSC JE 2026 official status",
        description: "JE 2026 is an active SSC recruitment cycle.",
        cards: [
          { title: "2026 calendar entry", text: "SSC's 2026-27 calendar lists Junior Engineer (Civil, Mechanical & Electrical) Examination, 2026.", badge: "2026 cycle" },
          { title: "September JE notice", text: "SSC published an Important Notice for Junior Engineer Examination, 2026 on 17 September 2026.", badge: "17 Sep 2026", ctaLabel: "SSC notice board", href: "https://ssc.gov.in" },
          { title: "Scientific Assistant in IMD", text: "SSC published a 16 September 2026 notice for recruitment of Scientific Assistant in IMD through Junior Engineer Examination, 2026.", badge: "16 Sep 2026" },
        ],
      },
      salary: {
        eyebrow: "Posts & pay",
        title: "SSC JE role and pay",
        description: "Junior Engineer appointments are technical Central Government posts; exact pay and allowances depend on the organisation.",
        cards: [
          { title: "Junior Engineer", text: "SSC JE recruits technical Junior Engineers in participating Government of India departments / organisations.", badge: "Technical Group B" },
          { title: "Pay", text: "The applicable pay level and allowances are stated against the post / organisation in the current notice and service rules.", badge: "Organisation-specific" },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "SSC JE 2026 FAQs",
        description: "Key distinctions for engineering candidates.",
        cards: [
          { title: "Do I prepare all three engineering branches?", text: "No. Prepare only the branch relevant to your eligible target posts—Civil, Mechanical or Electrical." },
          { title: "Is SSC JE only a technical paper?", text: "No. Paper-I also includes General Intelligence and General Awareness alongside the chosen engineering discipline." },
          { title: "Is a diploma always enough?", text: "Not for every post. Degree, diploma and experience conditions vary by organisation, so check the post table carefully." },
        ],
      },
      updates: {
        eyebrow: "Latest updates",
        title: "SSC JE 2026 official updates",
        description: "The live SSC notice board is the source for current schedule and post changes.",
        cards: [
          { title: "Important Notice - JE 2026", text: "SSC published an Important Notice for Junior Engineer Examination, 2026 on 17 September 2026.", badge: "17 Sep 2026", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
          { title: "Scientific Assistant recruitment through JE 2026", text: "SSC published a separate notice on 16 September 2026 for Scientific Assistant in IMD through JE Examination, 2026.", badge: "16 Sep 2026", ctaLabel: "Open SSC", href: "https://ssc.gov.in" },
        ],
      },
    },
    topics: [],
  },
  "sbi-po": makeExamShellConfig({
    slug: "sbi-po",
    name: "SBI PO",
    categoryHref: "/category/banking",
    officialUrl: "https://sbi.co.in/web/careers",
    officialLabel: "sbi.co.in",
  }),
  "sbi-clerk": makeExamShellConfig({
    slug: "sbi-clerk",
    name: "SBI Clerk / Junior Associate",
    categoryHref: "/category/banking",
    officialUrl: "https://sbi.co.in/web/careers",
    officialLabel: "sbi.co.in",
  }),
  "rbi-assistant": makeExamShellConfig({
    slug: "rbi-assistant",
    name: "RBI Assistant",
    categoryHref: "/category/banking",
    officialUrl: "https://www.rbi.org.in",
    officialLabel: "rbi.org.in",
  }),
  "rbi-grade-b": makeExamShellConfig({
    slug: "rbi-grade-b",
    name: "RBI Grade B",
    categoryHref: "/category/banking",
    officialUrl: "https://www.rbi.org.in",
    officialLabel: "rbi.org.in",
  }),
  "nabard-grade-a": makeExamShellConfig({
    slug: "nabard-grade-a",
    name: "NABARD Grade A",
    categoryHref: "/category/banking",
    officialUrl: "https://www.nabard.org",
    officialLabel: "nabard.org",
  }),
  "sebi-grade-a": makeExamShellConfig({
    slug: "sebi-grade-a",
    name: "SEBI Grade A",
    categoryHref: "/category/banking",
    officialUrl: "https://www.sebi.gov.in",
    officialLabel: "sebi.gov.in",
  }),
  "punjab-police-constable": makePunjabAuthorityConfig("punjab-police-constable"),
  "punjab-police-si": makePunjabAuthorityConfig("punjab-police-si"),
  "psssb-clerk": makePunjabStudyConfig("psssb-clerk"),
  "punjab-patwari": makePunjabStudyConfig("punjab-patwari"),
  "psssb-excise-taxation-inspector": makeExamShellConfig({
    slug: "psssb-excise-taxation-inspector",
    name: "PSSSB Excise & Taxation Inspector",
    categoryHref: "/category/punjab",
    officialUrl: "https://sssb.punjab.gov.in",
    officialLabel: "sssb.punjab.gov.in",
  }),
  "punjab-naib-tehsildar": makeExamShellConfig({
    slug: "punjab-naib-tehsildar",
    name: "Punjab Naib Tehsildar",
    categoryHref: "/category/punjab",
    officialUrl: "https://ppsc.gov.in",
    officialLabel: "ppsc.gov.in",
  }),
  "punjab-pcs": makePunjabAuthorityConfig("punjab-pcs"),
  "psssb-senior-assistant": makeExamShellConfig({
    slug: "psssb-senior-assistant",
    name: "PSSSB Senior Assistant",
    categoryHref: "/category/punjab",
    officialUrl: "https://sssb.punjab.gov.in",
    officialLabel: "sssb.punjab.gov.in",
  }),
  "psssb-vdo": makeExamShellConfig({
    slug: "psssb-vdo",
    name: "PSSSB VDO / Gram Sevak",
    categoryHref: "/category/punjab",
    officialUrl: "https://sssb.punjab.gov.in",
    officialLabel: "sssb.punjab.gov.in",
  }),
  "punjab-jail-warder": makeExamShellConfig({
    slug: "punjab-jail-warder",
    name: "Punjab Jail Warder / Matron",
    categoryHref: "/category/punjab",
    officialUrl: "https://punjab.gov.in",
    officialLabel: "punjab.gov.in",
  }),
  "punjab-police-intelligence-assistant": makeExamShellConfig({
    slug: "punjab-police-intelligence-assistant",
    name: "Punjab Police Intelligence Assistant",
    categoryHref: "/category/punjab",
    officialUrl: "https://punjabpolice.gov.in",
    officialLabel: "punjabpolice.gov.in",
  }),
  "pspcl-alm": makeExamShellConfig({
    slug: "pspcl-alm",
    name: "PSPCL Assistant Lineman",
    categoryHref: "/category/punjab",
    officialUrl: "https://www.pspcl.in",
    officialLabel: "pspcl.in",
  }),
  "pspcl-revenue-accountant": makeExamShellConfig({
    slug: "pspcl-revenue-accountant",
    name: "PSPCL Revenue Accountant",
    categoryHref: "/category/punjab",
    officialUrl: "https://www.pspcl.in",
    officialLabel: "pspcl.in",
  }),
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
  "ssc-selection-post": ["SSC_SELECTION_POST", "SSC_SELECTION_POSTS"],
  "ssc-je": ["SSC_JE", "SSC_JUNIOR_ENGINEER"],
  "sbi-po": ["SBI_PO", "SBI_PROBATIONARY_OFFICER"],
  "sbi-clerk": ["SBI_CLERK", "SBI_JUNIOR_ASSOCIATE", "SBI_JA"],
  "rbi-assistant": ["RBI_ASSISTANT"],
  "rbi-grade-b": ["RBI_GRADE_B", "RBI_GRADE_B_OFFICER"],
  "nabard-grade-a": ["NABARD_GRADE_A"],
  "sebi-grade-a": ["SEBI_GRADE_A"],
  "punjab-police-constable": ["PUNJAB_POLICE_CONSTABLE"],
  "punjab-police-si": ["PUNJAB_POLICE_SI", "PUNJAB_POLICE_SUB_INSPECTOR"],
  "psssb-clerk": ["PSSSB_CLERK", "PSSSB_JUNIOR_ASSISTANT"],
  "punjab-patwari": ["PUNJAB_PATWARI", "PSSSB_PATWARI"],
  "psssb-excise-taxation-inspector": ["PSSSB_EXCISE_TAXATION_INSPECTOR", "PUNJAB_EXCISE_TAXATION_INSPECTOR"],
  "punjab-naib-tehsildar": ["PUNJAB_NAIB_TEHSILDAR", "PPSC_NAIB_TEHSILDAR"],
  "punjab-pcs": ["PUNJAB_PCS", "PPSC_PCS", "PUNJAB_STATE_CIVIL_SERVICES"],
  "psssb-senior-assistant": ["PSSSB_SENIOR_ASSISTANT"],
  "psssb-vdo": ["PSSSB_VDO", "PSSSB_GRAM_SEVAK", "PUNJAB_VDO"],
  "punjab-jail-warder": ["PUNJAB_JAIL_WARDER", "PUNJAB_JAIL_MATRON"],
  "punjab-police-intelligence-assistant": ["PUNJAB_POLICE_INTELLIGENCE_ASSISTANT"],
  "pspcl-alm": ["PSPCL_ALM", "PSPCL_ASSISTANT_LINEMAN"],
  "pspcl-revenue-accountant": ["PSPCL_REVENUE_ACCOUNTANT"],
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
