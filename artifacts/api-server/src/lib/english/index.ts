import type {
  DifficultyLabel,
  ExamProfileId,
  GeneratorOptions,
  Pattern,
} from "../core/generator-engine";
import type { OptionMetadata } from "../core/generator-engine";

type EnglishCluster =
  | "grammar"
  | "vocabulary"
  | "discourse";

type EnglishScenario = {
  id: string;
  cluster: EnglishCluster;
  subtype: string;
  stem: string;
  options: string[];
  correct: number;
  explanation: string;
  ruleApplied: string;
  reasoningSteps: string[];
  optionMetadata: OptionMetadata[];
  difficulty: DifficultyLabel;
  structuralSignature: string;
};

type GrammarRule = {
  id: string;
  label: string;
  cluster: string;
  ruleApplied: string;
};

export const GRAMMAR_RULE_REGISTRY: GrammarRule[] = [
  ["G01", "Subject-verb agreement", "agreement"],
  ["G02", "Intervening phrase agreement", "agreement"],
  ["G03", "Collective noun sense", "agreement"],
  ["G04", "Either/neither agreement", "agreement"],
  ["G05", "Each/every singular verb", "agreement"],
  ["G06", "Indefinite pronoun agreement", "agreement"],
  ["G07", "Parallel correlative conjunctions", "parallelism"],
  ["G08", "Parallel comparison", "parallelism"],
  ["G09", "Gerund vs infinitive", "verb-form"],
  ["G10", "Bare infinitive after modals", "verb-form"],
  ["G11", "Perfect tense with since/for", "tense"],
  ["G12", "Simple past with finished time", "tense"],
  ["G13", "Sequence of tenses", "tense"],
  ["G14", "Conditional type 1", "conditional"],
  ["G15", "Conditional type 2", "conditional"],
  ["G16", "Conditional type 3", "conditional"],
  ["G17", "Article before vowel sound", "article"],
  ["G18", "Zero article with institutions", "article"],
  ["G19", "Definite article specificity", "article"],
  ["G20", "Countable/uncountable quantifiers", "determiner"],
  ["G21", "Fewer vs less", "determiner"],
  ["G22", "Much vs many", "determiner"],
  ["G23", "Preposition after adjective", "preposition"],
  ["G24", "Preposition after verb", "preposition"],
  ["G25", "Between vs among", "preposition"],
  ["G26", "Beside vs besides", "preposition"],
  ["G27", "Pronoun case after preposition", "pronoun"],
  ["G28", "Pronoun antecedent clarity", "pronoun"],
  ["G29", "Possessive pronoun before gerund", "pronoun"],
  ["G30", "Reflexive pronoun use", "pronoun"],
  ["G31", "Misplaced modifier", "modifier"],
  ["G32", "Dangling modifier", "modifier"],
  ["G33", "Squinting modifier", "modifier"],
  ["G34", "Comparative degree", "comparison"],
  ["G35", "Double comparative", "comparison"],
  ["G36", "Superlative among three or more", "comparison"],
  ["G37", "Active to passive tense preservation", "voice"],
  ["G38", "Passive with modal auxiliary", "voice"],
  ["G39", "Passive object promotion", "voice"],
  ["G40", "Reported speech tense backshift", "narration"],
  ["G41", "Reported speech pronoun shift", "narration"],
  ["G42", "Reported question word order", "narration"],
  ["G43", "Command to infinitive in narration", "narration"],
  ["G44", "Question tag polarity", "tag"],
  ["G45", "Inversion after negative adverb", "syntax"],
  ["G46", "Subject-auxiliary inversion", "syntax"],
  ["G47", "Redundant expression", "style"],
  ["G48", "Double negative", "negation"],
  ["G49", "Confusing homophones", "lexical"],
  ["G50", "Idiom fixed preposition", "idiom"],
  ["G51", "Phrasal verb particle", "idiom"],
  ["G52", "One-word substitution precision", "lexical"],
].map(([id, label, cluster]) => ({
  id,
  label,
  cluster,
  ruleApplied: `${id}: ${label}.`,
}));

const ROOT_MATRIX = [
  {
    root: "bene",
    meaning: "good",
    word: "benefactor",
    answer: "one who does good or gives help",
    trap: "one who receives benefits",
  },
  {
    root: "mal",
    meaning: "bad",
    word: "malign",
    answer: "to speak harmful things about someone",
    trap: "to arrange neatly",
  },
  {
    root: "anthropo",
    meaning: "human",
    word: "anthropology",
    answer: "study of humans",
    trap: "study of ancient plants",
  },
  {
    root: "scrib",
    meaning: "write",
    word: "inscribe",
    answer: "to write or engrave",
    trap: "to read aloud",
  },
  {
    root: "port",
    meaning: "carry",
    word: "portable",
    answer: "easy to carry",
    trap: "easy to break",
  },
] as const;

const GRAMMAR_SCENARIOS = [
  {
    subtype: "error-spotting",
    rule: "G02",
    stem:
      "Identify the part that contains an error: The list of instructions / were sent to all candidates / before the examination / No error.",
    options: [
      "The list of instructions",
      "were sent to all candidates",
      "before the examination",
      "No error",
    ],
    correct: 1,
    explanation:
      "$\\text{The list}$ is the true singular subject. The phrase $\\text{of instructions}$ is only an intervening phrase, so the verb must be $\\text{was}$, not $\\text{were}$.",
    trap: "nearest-noun agreement",
  },
  {
    subtype: "sentence-improvement",
    rule: "G11",
    stem:
      "Choose the best replacement for the underlined part: She is working in this office since 2021.",
    options: [
      "has been working",
      "was working",
      "had worked",
      "no improvement",
    ],
    correct: 0,
    explanation:
      "With $\\text{since 2021}$, an action continuing from the past to the present needs present perfect continuous: $\\text{has been working}$.",
    trap: "simple-vs-perfect tense",
  },
  {
    subtype: "active-passive",
    rule: "G37",
    stem:
      "Choose the correct passive voice: The committee approved the proposal.",
    options: [
      "The proposal was approved by the committee.",
      "The proposal is approved by the committee.",
      "The proposal approved by the committee.",
      "The committee was approved by the proposal.",
    ],
    correct: 0,
    explanation:
      "The active verb is simple past $\\text{approved}$, so passive voice uses $\\text{was/were + past participle}$: $\\text{was approved}$.",
    trap: "wrong auxiliary tense",
  },
  {
    subtype: "narration",
    rule: "G40",
    stem:
      "Choose the correct indirect speech: Ravi said, \"I am preparing for the test.\"",
    options: [
      "Ravi said that he was preparing for the test.",
      "Ravi said that I was preparing for the test.",
      "Ravi said that he is preparing for the test.",
      "Ravi told that he was preparing for the test.",
    ],
    correct: 0,
    explanation:
      "In reported speech, $\\text{I}$ changes according to the speaker and present continuous usually backshifts to past continuous: $\\text{he was preparing}$.",
    trap: "pronoun or tense backshift miss",
  },
] as const;

const VOCAB_SCENARIOS = [
  {
    subtype: "contextual-synonym",
    stem:
      "Choose the word closest in meaning to the highlighted word: The minister remained adamant despite repeated requests to reconsider.",
    options: [
      "stubborn",
      "hard",
      "careless",
      "generous",
    ],
    correct: 0,
    ruleApplied:
      "V01: Contextual synonym must match sense, not literal association.",
    explanation:
      "$\\text{Adamant}$ here means firm or unwilling to change. The contextual synonym is $\\text{stubborn}$; $\\text{hard}$ is a literal trap.",
    trap: "literal secondary meaning",
  },
  {
    subtype: "idiom",
    stem:
      "Choose the meaning of the idiom: The new officer decided to cut corners during the inspection.",
    options: [
      "to do something cheaply or carelessly",
      "to decorate the room",
      "to complete every detail carefully",
      "to take a longer route",
    ],
    correct: 0,
    ruleApplied:
      "I01: Idioms are fixed semantic units; decode the phrase as a whole.",
    explanation:
      "$\\text{Cut corners}$ means to save time or money by doing something improperly.",
    trap: "literal phrase reading",
  },
] as const;

const DISCOURSE_SCENARIOS = [
  {
    subtype: "para-jumbles",
    stem:
      "Arrange the following sentences into a coherent paragraph:\nA. The Prime Minister announced a new rural credit scheme.\nB. He said it would help small farmers avoid informal debt.\nC. Many farmers currently borrow at very high interest rates.\nD. The scheme will be implemented through district banks.",
    options: [
      "A-B-C-D",
      "C-A-B-D",
      "A-D-C-B",
      "C-B-A-D",
    ],
    correct: 1,
    ruleApplied:
      "D01: Pointer logic; a pronoun must follow its noun anchor.",
    explanation:
      "$\\text{C}$ introduces the problem. $\\text{A}$ introduces the scheme and the Prime Minister. $\\text{B}$ follows because $\\text{He}$ refers to the Prime Minister. $\\text{D}$ gives implementation detail.",
    trap: "pronoun-before-anchor",
  },
  {
    subtype: "reading-comprehension",
    stem:
      "Read the passage and answer the question.\n\nPassage: A city may build flyovers to reduce congestion, but if public transport remains unreliable, private vehicles will continue to increase. Sustainable mobility therefore requires dependable buses and trains, not only wider roads.\n\nWhat is the main idea of the passage?",
    options: [
      "Flyovers alone cannot solve congestion without reliable public transport.",
      "Wider roads always reduce private vehicle ownership.",
      "Buses and trains are unnecessary in modern cities.",
      "The passage mainly criticizes rural transport policy.",
    ],
    correct: 0,
    ruleApplied:
      "R01: Main idea must cover the full passage without overgeneralizing.",
    explanation:
      "The passage contrasts $\\text{flyovers/wider roads}$ with $\\text{dependable public transport}$ and concludes that sustainable mobility needs the latter too.",
    trap: "scope overgeneralization",
  },
] as const;

function selectScenario(
  pattern: Pattern,
  options?: GeneratorOptions,
) {
  const topic = `${pattern.topic} ${pattern.subtopic} ${pattern.id}`.toLowerCase();
  const exam =
    options?.examProfile ?? "custom";

  if (
    topic.includes("para") ||
    topic.includes("reading") ||
    topic.includes("rc") ||
    exam === "cat"
  ) {
    return DISCOURSE_SCENARIOS[
      topic.includes("reading") ? 1 : 0
    ];
  }

  if (
    topic.includes("vocab") ||
    topic.includes("synonym") ||
    topic.includes("antonym") ||
    topic.includes("idiom") ||
    topic.includes("filler")
  ) {
    return VOCAB_SCENARIOS[
      topic.includes("idiom") ||
      options?.examProfile === "rrb"
        ? 1
        : 0
    ];
  }

  if (topic.includes("voice")) {
    return GRAMMAR_SCENARIOS[2];
  }

  if (topic.includes("narration")) {
    return GRAMMAR_SCENARIOS[3];
  }

  if (topic.includes("improvement")) {
    return GRAMMAR_SCENARIOS[1];
  }

  return GRAMMAR_SCENARIOS[0];
}

function buildRootScenario() {
  const root = ROOT_MATRIX[0];
  return {
    subtype: "root-words",
    stem: `The root $\\text{${root.root}}$ means "${
      root.meaning
    }". What is the best meaning of $\\text{${root.word}}$?`,
    options: [
      root.answer,
      root.trap,
      "one who opposes a ruler",
      "a place of worship",
    ],
    correct: 0,
    ruleApplied:
      "V02: Root-based meaning maps the word through its Latin/Greek root.",
    explanation: `$\\text{${root.root}} \\to \\text{${root.meaning}}$, so $\\text{${root.word}}$ means ${root.answer}.`,
    trap: "root inversion",
  };
}

function normalizeExamProfile(
  examProfile?: ExamProfileId,
) {
  if (examProfile === "cat") return "CAT";
  if (examProfile === "ssc") return "SSC";
  if (examProfile === "rrb") return "Punjab/RRB";
  return "SSC/Banking";
}

export function createEnglishScenario(
  pattern: Pattern,
  options?: GeneratorOptions,
): EnglishScenario {
  const topic = `${pattern.topic} ${pattern.subtopic} ${pattern.id}`.toLowerCase();
  const selected =
    topic.includes("root")
      ? buildRootScenario()
      : selectScenario(pattern, options);
  const difficulty =
    pattern.difficulty ?? "Medium";
  const rule =
    "rule" in selected
      ? GRAMMAR_RULE_REGISTRY.find(
          (entry) =>
            entry.id === selected.rule,
        )?.ruleApplied ??
        selected.rule
      : selected.ruleApplied;
  const cluster: EnglishCluster =
    selected.subtype ===
      "para-jumbles" ||
    selected.subtype ===
      "reading-comprehension"
      ? "discourse"
      : selected.subtype ===
          "contextual-synonym" ||
        selected.subtype ===
          "idiom" ||
        selected.subtype ===
          "root-words"
        ? "vocabulary"
        : "grammar";
  const reasoningSteps = [
    `Identify subtype: ${selected.subtype}.`,
    `Apply ${rule}`,
    `Eliminate trap: ${selected.trap}.`,
    `Select option ${String.fromCharCode(65 + selected.correct)} as the only context-valid answer.`,
  ];
  const optionMetadata =
    selected.options.map(
      (value, index) => ({
        value,
        isCorrect:
          index === selected.correct,
        distractorType:
          index === selected.correct
            ? undefined
            : "comparisonTrap",
        likelyMistake:
          index === selected.correct
            ? undefined
            : selected.trap,
        reasoningTrap:
          index === selected.correct
            ? undefined
            : selected.trap,
      }),
    ) satisfies OptionMetadata[];

  return {
    id: `english-${selected.subtype}-${difficulty.toLowerCase()}`,
    cluster,
    subtype: selected.subtype,
    stem: selected.stem,
    options: selected.options,
    correct: selected.correct,
    explanation: [
      `Rule applied: ${rule}`,
      selected.explanation,
      `Exam profile tuning: ${normalizeExamProfile(options?.examProfile)}.`,
    ].join("\n"),
    ruleApplied: rule,
    reasoningSteps,
    optionMetadata,
    difficulty,
    structuralSignature: `${cluster}:${selected.subtype}:${rule}`,
  };
}
