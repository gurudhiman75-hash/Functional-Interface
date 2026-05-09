type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard";

type FactCategory =
  | "Polity"
  | "History"
  | "Geography"
  | "Science"
  | "Economics"
  | "Environment"
  | "National Parks"
  | "Power Projects"
  | "Punjab GK"
  | "Hardware"
  | "Software"
  | "Internet"
  | "Security";

type EASFact = {
  entity: string;
  entityPa?: string;
  attribute1: string;
  attribute1Pa?: string;
  attribute2: string;
  attribute2Pa?: string;
  category: FactCategory;
  tags: string[];
  didYouKnow: string;
};

type KnowledgePatternLike = {
  id: string;
  topic: string;
  subtopic: string;
  difficulty?: Difficulty;
  supportedMotifs?: string[];
};

type KnowledgeScenario = {
  id: string;
  engine:
    | "GeneralKnowledgeEngine"
    | "ComputerAwarenessEngine";
  stem: string;
  options: string[];
  correct: number;
  explanation: string;
  reasoningSteps: string[];
  ruleApplied: string;
  category: FactCategory;
  difficulty: Difficulty;
  structuralSignature: string;
  factSnapshot: EASFact;
  matchMatrix?: {
    left: string[];
    right: string[];
    answerKey: Record<string, string>;
  };
  optionMetadata: Array<{
    option: string;
    isCorrect: boolean;
    distractorType: string;
    rationale: string;
  }>;
};

const GK_FACTS: EASFact[] = [
  {
    entity: "Article 356",
    attribute1: "President's Rule",
    attribute2:
      "Allows the Union to assume state administration when constitutional machinery fails",
    category: "Polity",
    tags: ["Static GK", "Constitution", "Emergency Provisions"],
    didYouKnow:
      "Articles 352, 356, and 360 are commonly tested together because all deal with emergency provisions.",
  },
  {
    entity: "Article 352",
    attribute1: "National Emergency",
    attribute2:
      "Declared for war, external aggression, or armed rebellion",
    category: "Polity",
    tags: ["Static GK", "Constitution", "Emergency Provisions"],
    didYouKnow:
      "The 44th Amendment replaced the phrase internal disturbance with armed rebellion.",
  },
  {
    entity: "Article 360",
    attribute1: "Financial Emergency",
    attribute2:
      "Emergency provision related to financial stability or credit of India",
    category: "Polity",
    tags: ["Static GK", "Constitution", "Emergency Provisions"],
    didYouKnow:
      "Financial Emergency has never been proclaimed in India.",
  },
  {
    entity: "Battle of Plassey",
    attribute1: "1757",
    attribute2:
      "Robert Clive defeated Siraj-ud-Daulah",
    category: "History",
    tags: ["Modern India", "Battles", "British Expansion"],
    didYouKnow:
      "Plassey is treated as a turning point in the political rise of the East India Company.",
  },
  {
    entity: "Battle of Buxar",
    attribute1: "1764",
    attribute2:
      "British victory over Mir Qasim, Shuja-ud-Daulah, and Shah Alam II",
    category: "History",
    tags: ["Modern India", "Battles", "British Expansion"],
    didYouKnow:
      "Buxar strengthened the Company's revenue control in Bengal after the Diwani grant.",
  },
  {
    entity: "Kaziranga National Park",
    entityPa: "ਕਾਜੀਰੰਗਾ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ",
    attribute1: "Assam",
    attribute1Pa: "ਅਸਾਮ",
    attribute2:
      "World-famous for the one-horned rhinoceros",
    category: "National Parks",
    tags: ["Static GK", "Environment", "Parks"],
    didYouKnow:
      "Kaziranga is a UNESCO World Heritage Site and a high-frequency park-state fact.",
  },
  {
    entity: "Jim Corbett National Park",
    attribute1: "Uttarakhand",
    attribute2:
      "First national park of India, established in 1936",
    category: "National Parks",
    tags: ["Static GK", "Environment", "Parks"],
    didYouKnow:
      "It was originally named Hailey National Park.",
  },
  {
    entity: "Gir National Park",
    attribute1: "Gujarat",
    attribute2:
      "Known for Asiatic lions",
    category: "National Parks",
    tags: ["Static GK", "Environment", "Parks"],
    didYouKnow:
      "Gir is the only natural habitat of Asiatic lions.",
  },
  {
    entity: "Harike Wildlife Sanctuary",
    entityPa: "ਹਰੀਕੇ ਪੰਛੀ ਅਭਿਆਰਣ",
    attribute1: "Punjab",
    attribute1Pa: "ਪੰਜਾਬ",
    attribute2:
      "Wetland and bird sanctuary near the Beas-Sutlej confluence",
    category: "Punjab GK",
    tags: ["Sadda Punjab", "Environment", "Punjab"],
    didYouKnow:
      "Harike is one of northern India's important wetlands and appears often in Punjab GK.",
  },
  {
    entity: "Bhakra Nangal Project",
    entityPa: "ਭਾਖੜਾ ਨੰਗਲ ਪ੍ਰੋਜੈਕਟ",
    attribute1: "Sutlej River",
    attribute1Pa: "ਸਤਲੁਜ ਦਰਿਆ",
    attribute2:
      "Major multipurpose hydroelectric and irrigation project",
    category: "Power Projects",
    tags: ["Punjab GK", "Power Projects", "Rivers"],
    didYouKnow:
      "Bhakra Nangal is a landmark multipurpose river-valley project linked with Punjab's irrigation system.",
  },
  {
    entity: "Guru Gobind Singh Super Thermal Plant",
    entityPa: "ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਸੁਪਰ ਥਰਮਲ ਪਲਾਂਟ",
    attribute1: "Ropar",
    attribute1Pa: "ਰੋਪੜ",
    attribute2:
      "Thermal power plant in Punjab",
    category: "Power Projects",
    tags: ["Punjab GK", "Power Plants", "Energy"],
    didYouKnow:
      "Ropar is a frequent location clue in Punjab power-project questions.",
  },
  {
    entity: "Vitamin C",
    attribute1: "Ascorbic acid",
    attribute2:
      "Deficiency may cause scurvy",
    category: "Science",
    tags: ["Science", "Vitamins", "Human Body"],
    didYouKnow:
      "Vitamins are usually tested as vitamin-name, chemical-name, and deficiency disease triples.",
  },
  {
    entity: "Kyoto Protocol",
    attribute1: "1997",
    attribute2:
      "International agreement linked with greenhouse gas emission reduction",
    category: "Environment",
    tags: ["Environment", "Climate Protocols"],
    didYouKnow:
      "Kyoto and Paris are common distractor pairs in climate-agreement questions.",
  },
  {
    entity: "Repo Rate",
    attribute1:
      "Rate at which RBI lends short-term funds to commercial banks",
    attribute2:
      "Monetary policy instrument",
    category: "Economics",
    tags: ["Economics", "RBI", "Banking Terms"],
    didYouKnow:
      "Repo and reverse repo are a classic pair for close distractor generation.",
  },
];

const COMPUTER_FACTS: EASFact[] = [
  {
    entity: "ALU",
    attribute1: "Arithmetic Logic Unit",
    attribute2:
      "Performs arithmetic and logical operations in the CPU",
    category: "Hardware",
    tags: ["Computer Awareness", "CPU"],
    didYouKnow:
      "CPU questions often contrast ALU with CU and registers.",
  },
  {
    entity: "CU",
    attribute1: "Control Unit",
    attribute2:
      "Directs and coordinates CPU operations",
    category: "Hardware",
    tags: ["Computer Awareness", "CPU"],
    didYouKnow:
      "The CU controls instruction flow; it does not perform arithmetic calculations.",
  },
  {
    entity: "RAM",
    attribute1: "Volatile memory",
    attribute2:
      "Temporary working memory used while programs run",
    category: "Hardware",
    tags: ["Computer Awareness", "Memory"],
    didYouKnow:
      "Volatile means data is lost when power is switched off.",
  },
  {
    entity: "ROM",
    attribute1: "Non-volatile memory",
    attribute2:
      "Stores firmware or permanent startup instructions",
    category: "Hardware",
    tags: ["Computer Awareness", "Memory"],
    didYouKnow:
      "ROM keeps data even without power, unlike RAM.",
  },
  {
    entity: "Router",
    attribute1:
      "Connects different networks and forwards packets",
    attribute2:
      "Operates primarily at the Network layer",
    category: "Internet",
    tags: ["Networking", "Devices", "OSI"],
    didYouKnow:
      "Hub, switch, and router are category-close distractors in networking questions.",
  },
  {
    entity: "Switch",
    attribute1:
      "Connects devices in a LAN using MAC addresses",
    attribute2:
      "Commonly associated with the Data Link layer",
    category: "Internet",
    tags: ["Networking", "Devices", "OSI"],
    didYouKnow:
      "A switch is more intelligent than a hub because it forwards frames selectively.",
  },
  {
    entity: "HTTP",
    attribute1: "HyperText Transfer Protocol",
    attribute2:
      "Protocol used for transferring web pages",
    category: "Internet",
    tags: ["Protocols", "Web"],
    didYouKnow:
      "HTTPS adds a security layer over HTTP.",
  },
  {
    entity: "Trojan Horse",
    attribute1:
      "Malware disguised as legitimate software",
    attribute2:
      "Requires user trust or execution to activate",
    category: "Security",
    tags: ["Cyber Security", "Malware"],
    didYouKnow:
      "Trojan, worm, and virus are close but distinct malware classes.",
  },
  {
    entity: "Firewall",
    attribute1:
      "Network security system that filters traffic",
    attribute2:
      "Can be hardware-based or software-based",
    category: "Security",
    tags: ["Cyber Security", "Network Protection"],
    didYouKnow:
      "A firewall controls traffic based on security rules; it is not an antivirus substitute.",
  },
  {
    entity: "Ctrl + S",
    attribute1: "Save",
    attribute2:
      "Common shortcut in MS Office applications",
    category: "Software",
    tags: ["MS Office", "Shortcuts"],
    didYouKnow:
      "Shortcut questions are high-frequency in qualifying computer tests.",
  },
  {
    entity: "SUM",
    attribute1:
      "Excel function used to add values",
    attribute2:
      "Written as =SUM(number1, number2, ...)",
    category: "Software",
    tags: ["MS Excel", "Functions"],
    didYouKnow:
      "Excel formulas generally begin with an equals sign.",
  },
];

function normalizeDifficulty(
  difficulty?: string,
): Difficulty {
  if (/hard/i.test(difficulty ?? "")) {
    return "Hard";
  }

  if (/easy/i.test(difficulty ?? "")) {
    return "Easy";
  }

  return "Medium";
}

function hashText(value: string) {
  return [...value].reduce(
    (hash, char) =>
      (hash * 31 + char.charCodeAt(0)) %
      9973,
    17,
  );
}

function pickFact(
  facts: EASFact[],
  pattern: KnowledgePatternLike,
  difficulty: Difficulty,
) {
  const motifText = [
    pattern.id,
    pattern.topic,
    pattern.subtopic,
    ...(pattern.supportedMotifs ?? []),
  ]
    .join(" ")
    .toLowerCase();
  const categoryHint = motifText.includes("park")
    ? "National Parks"
    : motifText.includes("power")
      ? "Power Projects"
      : motifText.includes("punjab")
        ? "Punjab GK"
        : motifText.includes("pol")
          ? "Polity"
          : motifText.includes("his")
            ? "History"
            : motifText.includes("geo")
              ? "Geography"
              : motifText.includes("sci")
                ? "Science"
                : motifText.includes("eco")
                  ? "Economics"
                  : motifText.includes("env")
                    ? "Environment"
                    : motifText.includes("hardware")
                      ? "Hardware"
                      : motifText.includes("software")
                        ? "Software"
                        : motifText.includes("internet") ||
                            motifText.includes("network")
                          ? "Internet"
                          : motifText.includes("security")
                            ? "Security"
                            : undefined;
  const candidates = categoryHint
    ? facts.filter(
        (fact) =>
          fact.category === categoryHint,
      )
    : facts;
  const pool = candidates.length
    ? candidates
    : facts;
  const offset =
    difficulty === "Hard"
      ? 2
      : difficulty === "Easy"
        ? 0
        : 1;

  return pool[
    (hashText(pattern.id) + offset) %
      pool.length
  ]!;
}

function getCloseDistractors(
  facts: EASFact[],
  fact: EASFact,
  answer: string,
) {
  const sameCategory = facts
    .filter(
      (candidate) =>
        candidate.category === fact.category &&
        candidate.attribute1 !== answer &&
        candidate.entity !== answer,
    )
    .flatMap((candidate) => [
      candidate.attribute1,
      candidate.entity,
    ]);
  const sameTag = facts
    .filter(
      (candidate) =>
        candidate !== fact &&
        candidate.tags.some((tag) =>
          fact.tags.includes(tag),
        ),
    )
    .flatMap((candidate) => [
      candidate.attribute1,
      candidate.entity,
    ]);
  const unique = [
    ...new Set([
      ...sameCategory,
      ...sameTag,
      "Article 352",
      "Article 360",
      "Hub",
      "Switch",
      "Router",
      "Gujarat",
      "Assam",
      "Punjab",
      "Uttarakhand",
    ]),
  ].filter(
    (value) =>
      value &&
      value !== answer &&
      value !== fact.entity,
  );

  return unique.slice(0, 3);
}

function buildMatchMatrix(
  facts: EASFact[],
  fact: EASFact,
) {
  const rows = [
    fact,
    ...facts.filter(
      (candidate) =>
        candidate.category === fact.category &&
        candidate.entity !== fact.entity,
    ),
  ].slice(0, 4);

  if (rows.length < 4) {
    return undefined;
  }

  return {
    left: rows.map((row) => row.entity),
    right: [...rows]
      .reverse()
      .map((row) => row.attribute1),
    answerKey: Object.fromEntries(
      rows.map((row) => [
        row.entity,
        row.attribute1,
      ]),
    ),
  };
}

function buildOptions(
  facts: EASFact[],
  fact: EASFact,
  answer: string,
) {
  const options = [
    answer,
    ...getCloseDistractors(
      facts,
      fact,
      answer,
    ),
  ];

  while (options.length < 4) {
    options.push(
      `Related fact ${options.length}`,
    );
  }

  return options.slice(0, 4);
}

function makeScenario(
  engine:
    | "GeneralKnowledgeEngine"
    | "ComputerAwarenessEngine",
  facts: EASFact[],
  pattern: KnowledgePatternLike,
) : KnowledgeScenario {
  const difficulty =
    normalizeDifficulty(
      pattern.difficulty,
    );
  const fact = pickFact(
    facts,
    pattern,
    difficulty,
  );
  const asksAttribute =
    difficulty !== "Hard" ||
    /parks|power|punjab|hardware|software|internet|security/i.test(
      pattern.id,
    );
  const answer = asksAttribute
    ? fact.attribute1
    : fact.entity;
  const options = buildOptions(
    facts,
    fact,
    answer,
  );
  const stem = asksAttribute
    ? `Which of the following is correctly associated with ${fact.entity}?`
    : `${fact.attribute1} is associated with which entity?`;
  const matchMatrix =
    /match|parks|power/i.test(pattern.id) &&
    difficulty !== "Easy"
      ? buildMatchMatrix(facts, fact)
      : undefined;
  const matrixText = matchMatrix
    ? `\n\nMatch reference: ${matchMatrix.left
        .map(
          (left, index) =>
            `${index + 1}. ${left}`,
        )
        .join("; ")}`
    : "";
  const reasoningSteps = [
    `Identify the fact category: ${fact.category}.`,
    `Use the EAS object: Entity = ${fact.entity}; Attribute = ${fact.attribute1}.`,
    `Reject category-close distractors that belong to the same syllabus cluster but not this entity.`,
  ];
  const explanation =
    `Correct answer: ${answer}.\n` +
    `EAS check: Entity = ${fact.entity}; Attribute = ${fact.attribute1}; Detail = ${fact.attribute2}.\n` +
    `Did You Know: ${fact.didYouKnow}`;

  return {
    id: `${engine}-${fact.entity
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`,
    engine,
    stem: `${stem}${matrixText}`,
    options,
    correct: 0,
    explanation,
    reasoningSteps,
    ruleApplied:
      "EAS Fact-Object with category-close distractor guard",
    category: fact.category,
    difficulty,
    structuralSignature: `${engine}:${fact.category}:${fact.entity}:${answer}`,
    factSnapshot: fact,
    matchMatrix,
    optionMetadata: options.map(
      (option, index) => ({
        option,
        isCorrect: index === 0,
        distractorType:
          index === 0
            ? "Correct_EAS_Association"
            : "Category_Close_Distractor",
        rationale:
          index === 0
            ? "Matches the stored Entity-Attribute-Set fact."
            : "Plausible because it belongs to a nearby GK/computer category.",
      }),
    ),
  };
}

export class GeneralKnowledgeEngine {
  generate(
    pattern: KnowledgePatternLike,
  ) {
    return makeScenario(
      "GeneralKnowledgeEngine",
      GK_FACTS,
      pattern,
    );
  }
}

export class ComputerAwarenessEngine {
  generate(
    pattern: KnowledgePatternLike,
  ) {
    return makeScenario(
      "ComputerAwarenessEngine",
      COMPUTER_FACTS,
      pattern,
    );
  }
}

export function createGeneralKnowledgeScenario(
  pattern: KnowledgePatternLike,
) {
  return new GeneralKnowledgeEngine().generate(
    pattern,
  );
}

export function createComputerAwarenessScenario(
  pattern: KnowledgePatternLike,
) {
  return new ComputerAwarenessEngine().generate(
    pattern,
  );
}

