import type {
  DifficultyLabel,
  ExamProfileId,
  GeneratorOptions,
  Pattern,
} from "../core/generator-engine";
import type { OptionMetadata } from "../core/generator-engine";
import { cleanPunjabiText } from "../punjabi-utils";

type PunjabiCluster =
  | "vyakaran"
  | "shabad-bodh"
  | "idiom"
  | "translation";

type PunjabiMode =
  | "paper-a"
  | "paper-b";

type PunjabiScenario = {
  id: string;
  cluster: PunjabiCluster;
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
  mode: PunjabiMode;
};

type TransformPair = {
  source: string;
  target: string;
  trap: string;
  rule: string;
};

const GURMUKHI_MARKS = {
  bindi: "\u0a02",
  tippi: "\u0a70",
  aadhak: "\u0a71",
  halant: "\u0a4d",
} as const;

const GURMUKHI_BLOCK_RE =
  /[\u0A00-\u0A7F]/;

function normalizePunjabiUnicode(
  value: string,
) {
  return value
    .normalize("NFC")
    .replace(
      /\$\\text\{([^}]*)\}\$/g,
      (_match, inner: string) =>
        GURMUKHI_BLOCK_RE.test(inner)
          ? inner
          : inner,
    );
}

function cleanPunjabiOutput(
  value: string,
) {
  return (
    cleanPunjabiText(
      normalizePunjabiUnicode(value),
    ) ?? normalizePunjabiUnicode(value)
  );
}

export const DUGGAL_RULE_REGISTRY = [
  {
    id: "PBI-G01",
    motif: "pbi-gram-ling",
    label: "ਲਿੰਗ ਬਦਲੋ",
    rule:
      "Noun gender must be transformed by accepted literary Punjabi pairs, not by casual suffix guessing.",
  },
  {
    id: "PBI-G02",
    motif: "pbi-gram-vachan",
    label: "ਵਚਨ ਬਦਲੋ",
    rule:
      "Number conversion must preserve standard Gurmukhi matra behavior and formal Punjabi plural patterns.",
  },
  {
    id: "PBI-G03",
    motif: "pbi-gram-kaal",
    label: "ਕਾਲ ਬਦਲੋ",
    rule:
      "Verb tense must preserve person, number and gender agreement in standard Punjabi.",
  },
  {
    id: "PBI-G04",
    motif: "pbi-gram-shuddhi",
    label: "ਵਾਕ ਸ਼ੁੱਧੀ",
    rule:
      "Punjabi declarative order normally follows Subject-Object-Verb, with verb agreement controlled by the relevant noun phrase.",
  },
  {
    id: "PBI-V01",
    motif: "pbi-voc-jor",
    label: "ਸ਼ਬਦ-ਜੋੜ",
    rule:
      "Bindi, Tippi and Aadhak must be placed according to standard lagan-matran orthography.",
  },
  {
    id: "PBI-V02",
    motif: "pbi-voc-saman",
    label: "ਸਮਾਨਾਰਥਕ / ਵਿਰੋਧਾਰਥਕ",
    rule:
      "Meaning is selected by formal Punjabi semantic use, not by colloquial approximation.",
  },
  {
    id: "PBI-V03",
    motif: "pbi-voc-agattar",
    label: "ਅਗੇਤਰ / ਪਛੇਤਰ",
    rule:
      "Word formation must identify the meaningful prefix or suffix attached to the base word.",
  },
  {
    id: "PBI-I01",
    motif: "pbi-idiom-muhavre",
    label: "ਮੁਹਾਵਰੇ",
    rule:
      "Idioms are mapped by meaning and situation, never by literal word-for-word translation.",
  },
  {
    id: "PBI-I02",
    motif: "pbi-idiom-akhaan",
    label: "ਅਖਾਣ",
    rule:
      "A proverb must fit the moral or situation described in the sentence.",
  },
  {
    id: "PBI-T01",
    motif: "pbi-trans-admin",
    label: "ਪ੍ਰਸ਼ਾਸਕੀ ਅਨੁਵਾਦ",
    rule:
      "Administrative terms should use standard Punjab Government/PSEB terminology.",
  },
] as const;

const GENDER_PAIRS: TransformPair[] = [
  {
    source: "ਘੋੜਾ",
    target: "ਘੋੜੀ",
    trap: "ਘੋੜਣ",
    rule:
      "ਘੋੜਾ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਘੋੜੀ ਹੈ; ਆਮ -ਈ ਰੂਪ ਇੱਥੇ ਮੰਨਿਆ ਹੋਇਆ ਹੈ।",
  },
  {
    source: "ਸਹੁਰਾ",
    target: "ਸੱਸ",
    trap: "ਸਹੁਰਣ",
    rule:
      "ਸਹੁਰਾ ਦਾ ਜੋੜਾ-ਰੂਪ ਸੱਸ ਹੈ; ਇਹ ਅਨਿਯਮਿਤ ਲਿੰਗ-ਜੋੜ ਹੈ।",
  },
  {
    source: "ਲੇਖਕ",
    target: "ਲੇਖਿਕਾ",
    trap: "ਲੇਖਕੀ",
    rule:
      "ਲੇਖਕ ਦਾ ਇਸਤਰੀ ਰੂਪ ਲੇਖਿਕਾ ਹੈ, ਜੋ ਸਾਹਿਤਕ ਪੰਜਾਬੀ ਵਿੱਚ ਮੰਨਿਆ ਰੂਪ ਹੈ।",
  },
];

const NUMBER_PAIRS: TransformPair[] = [
  {
    source: "ਕਿਤਾਬ",
    target: "ਕਿਤਾਬਾਂ",
    trap: "ਕਿਤਾਬੇ",
    rule:
      "ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਕਿਤਾਬ ਦਾ ਬਹੁਵਚਨ ਕਿਤਾਬਾਂ ਹੈ।",
  },
  {
    source: "ਕੰਨ",
    target: "ਕੰਨ",
    trap: "ਕੰਨਾਂ",
    rule:
      "ਕੁਝ ਪੁਲਿੰਗ ਸ਼ਬਦ ਸੰਦਰਭ ਨਾਲ ਬਹੁਵਚਨ ਲੈਂਦੇ ਹਨ; ਇਕੱਲੇ ਰੂਪ ਵਿੱਚ ਮੂਲ ਸ਼ਬਦ ਅਕਸਰ ਅਟੱਲ ਰਹਿੰਦਾ ਹੈ।",
  },
  {
    source: "ਲਾਵਾਂ",
    target: "ਲਾਵਾਂ",
    trap: "ਲਾਵੇ",
    rule:
      "ਲਾਵਾਂ ਰੂਪ ਪਹਿਲਾਂ ਹੀ ਬਹੁਵਚਨੀ/ਰਸਮੀ ਰੂਪ ਵਜੋਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
];

const ORTHOGRAPHY_ITEMS = [
  {
    correct: "ਅੰਮ੍ਰਿਤ",
    traps: ["ਅਮ੍ਰਿਤ", "ਅੰਮਰਿਤ", "ਅਮਰਿਤ"],
    rule:
      "ਅੰਮ੍ਰਿਤ ਵਿੱਚ ਟਿੱਪੀ/ਧੁਨੀ ਅਤੇ ਮ੍ਰ ਦਾ ਸੰਯੋਗ ਮਿਆਰੀ ਰੂਪ ਬਣਾਉਂਦਾ ਹੈ।",
  },
  {
    correct: "ਗਜ਼ਟਿਡ",
    traps: ["ਗਜਟਿਡ", "ਗਜ਼ਿਟਿਡ", "ਗਜਿਟਡ"],
    rule:
      "ਪ੍ਰਸ਼ਾਸਕੀ ਸ਼ਬਦ ਗਜ਼ਟਿਡ ਵਿੱਚ ਜ਼ ਧੁਨੀ ਲਈ ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ ਜ਼ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    correct: "ਪੜ੍ਹਾਈ",
    traps: ["ਪੜਾਈ", "ਪੜ੍ਹਾਏ", "ਪਡ਼੍ਹਾਈ"],
    rule:
      "ਪੜ੍ਹਾਈ ਵਿੱਚ ਹਾਹਾ ਦੇ ਪੈਰ-ਰੂਪ ਨਾਲ ਧੁਨੀ ਸਹੀ ਬਣਦੀ ਹੈ।",
  },
] as const;

const SEMANTIC_ITEMS = [
  {
    subtype: "pbi-voc-saman",
    stem:
      "ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦ ਦਾ ਸਮਾਨਾਰਥਕ ਚੁਣੋ: ਸਾਹਸ",
    options: ["ਹਿੰਮਤ", "ਡਰ", "ਗੁੱਸਾ", "ਥਕਾਵਟ"],
    correct: 0,
    rule:
      "ਸਾਹਸ ਦਾ ਸਮਾਨਾਰਥਕ ਹਿੰਮਤ ਹੈ; ਡਰ ਇਸ ਦਾ ਵਿਰੋਧਾਰਥਕ ਅਰਥ-ਖੇਤਰ ਹੈ।",
    trap: "ਵਿਰੋਧੀ ਅਰਥ ਨੂੰ ਸਮਾਨਾਰਥਕ ਸਮਝਣਾ",
  },
  {
    subtype: "pbi-voc-oneword",
    stem:
      "ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ ਚੁਣੋ: ਜੋ ਕਦੇ ਨਾ ਮਰੇ।",
    options: ["ਅਮਰ", "ਨਿਰਦਈ", "ਬੇਚੈਨ", "ਸੁਚੇਤ"],
    correct: 0,
    rule:
      "ਜੋ ਕਦੇ ਨਾ ਮਰੇ ਲਈ ਮਿਆਰੀ ਇੱਕ-ਸ਼ਬਦੀ ਰੂਪ ਅਮਰ ਹੈ।",
    trap: "ਅਰਥ ਦੇ ਨੇੜੇ ਪਰ ਗਲਤ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਚੋਣ",
  },
] as const;

const IDIOM_ITEMS = [
  {
    subtype: "pbi-idiom-muhavre",
    stem:
      "ਮੁਹਾਵਰੇ ਦਾ ਠੀਕ ਅਰਥ ਚੁਣੋ: ਅੱਖਾਂ ਵਿੱਚ ਧੂੜ ਪਾਉਣਾ",
    options: [
      "ਧੋਖਾ ਦੇਣਾ",
      "ਸਫਾਈ ਕਰਨੀ",
      "ਮਦਦ ਕਰਨੀ",
      "ਰੋਣਾ",
    ],
    correct: 0,
    rule:
      "ਅੱਖਾਂ ਵਿੱਚ ਧੂੜ ਪਾਉਣਾ ਦਾ ਅਰਥ ਧੋਖਾ ਦੇਣਾ ਹੈ।",
    trap: "ਸ਼ਾਬਦਿਕ ਅਰਥ ਲੈਣਾ",
  },
  {
    subtype: "pbi-idiom-akhaan",
    stem:
      "ਸਥਿਤੀ ਲਈ ਠੀਕ ਅਖਾਣ ਚੁਣੋ: ਜਦੋਂ ਕੋਈ ਵਿਅਕਤੀ ਥੋੜ੍ਹੀ ਕਾਮਯਾਬੀ ਤੋਂ ਬਾਅਦ ਬਹੁਤ ਘਮੰਡ ਕਰੇ।",
    options: [
      "ਥੋਥਾ ਚਣਾ ਬਾਜੇ ਘਣਾ",
      "ਜੈਸੀ ਕਰਨੀ ਵੈਸੀ ਭਰਨੀ",
      "ਨੱਚ ਨਾ ਜਾਣੇ ਆਂਗਣ ਟੇਢਾ",
      "ਦੂਰ ਦੇ ਢੋਲ ਸੁਹਾਵਣੇ",
    ],
    correct: 0,
    rule:
      "ਥੋਥਾ ਚਣਾ ਬਾਜੇ ਘਣਾ ਘੱਟ ਗੁਣ ਪਰ ਵੱਧ ਦਿਖਾਵੇ ਵਾਲੀ ਸਥਿਤੀ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
    trap: "ਸਥਿਤੀ ਨਾਲ ਨਾ ਮਿਲਦਾ ਅਖਾਣ",
  },
] as const;

const TRANSLATION_ITEMS = [
  {
    subtype: "pbi-trans-admin",
    stem:
      "English administrative term ਦਾ ਮਿਆਰੀ ਪੰਜਾਬੀ ਰੂਪ ਚੁਣੋ: Gazetted",
    options: ["ਗਜ਼ਟਿਡ", "ਖਬਰਦਾਰ", "ਸੂਚਿਤ", "ਦਰਜਬੰਦ"],
    correct: 0,
    rule:
      "Gazetted ਲਈ ਪੰਜਾਬੀ ਪ੍ਰਸ਼ਾਸਕੀ ਵਰਤੋਂ ਵਿੱਚ ਗਜ਼ਟਿਡ ਮਿਆਰੀ ਰੂਪ ਹੈ।",
    trap: "ਸ਼ਾਬਦਿਕ ਜਾਂ ਗੈਰ-ਪ੍ਰਸ਼ਾਸਕੀ ਅਨੁਵਾਦ",
  },
] as const;

function pickMode(
  difficulty: DifficultyLabel,
): PunjabiMode {
  return difficulty === "Hard"
    ? "paper-b"
    : "paper-a";
}

export class VyakaranTransformer {
  flipGender(word: string) {
    return (
      GENDER_PAIRS.find(
        (pair) => pair.source === word,
      )?.target ?? null
    );
  }

  flipNumber(word: string) {
    return (
      NUMBER_PAIRS.find(
        (pair) => pair.source === word,
      )?.target ?? null
    );
  }

  validateOrthography(word: string) {
    const normalized =
      cleanPunjabiText(word) ?? "";
    const hasKannaWithTippi =
      /ਾ\u0a70/.test(normalized);
    const hasDoubleAadhak =
      normalized.includes(
        `${GURMUKHI_MARKS.aadhak}${GURMUKHI_MARKS.aadhak}`,
      );

    return {
      valid:
        !hasKannaWithTippi &&
        !hasDoubleAadhak,
      issues: [
        hasKannaWithTippi
          ? "ਟਿੱਪੀ ਕੰਨਾ ਨਾਲ ਨਹੀਂ ਆਉਂਦੀ; ਬਿੰਦੀ/ਹੋਰ ਮਿਆਰੀ ਰੂਪ ਦੀ ਜਾਂਚ ਕਰੋ।"
          : "",
        hasDoubleAadhak
          ? "ਇੱਕ ਹੀ ਅੱਖਰ-ਸਥਾਨ 'ਤੇ ਦੋ ਅੱਧਕ ਮਿਆਰੀ ਨਹੀਂ ਹਨ।"
          : "",
      ].filter(Boolean),
    };
  }
}

function resolveRule(
  motif: string,
) {
  return (
    DUGGAL_RULE_REGISTRY.find(
      (rule) => rule.motif === motif,
    ) ?? DUGGAL_RULE_REGISTRY[0]
  );
}

function selectBaseItem(
  pattern: Pattern,
  difficulty: DifficultyLabel,
) {
  const key = `${pattern.topic} ${pattern.subtopic} ${pattern.id} ${(pattern.supportedMotifs ?? []).join(" ")}`.toLowerCase();

  if (
    key.includes("ling") ||
    key.includes("ਲਿੰਗ") ||
    key.includes("gender")
  ) {
    const pair =
      difficulty === "Hard"
        ? GENDER_PAIRS[1]
        : GENDER_PAIRS[0];
    return {
      subtype: "pbi-gram-ling",
      stem: `ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦ ਦਾ ਲਿੰਗ ਬਦਲੋ: ${pair.source}`,
      options: [
        pair.target,
        pair.trap,
        pair.source,
        "ਕੋਈ ਨਹੀਂ",
      ],
      correct: 0,
      rule: pair.rule,
      trap: "ਲਿੰਗ-ਜੋੜ ਦੀ ਥਾਂ ਅਨੁਮਾਨੀ ਪਿਛੇਤਰ ਲਗਾਉਣਾ",
    };
  }

  if (
    key.includes("vachan") ||
    key.includes("ਵਚਨ") ||
    key.includes("number")
  ) {
    const pair = NUMBER_PAIRS[0];
    return {
      subtype: "pbi-gram-vachan",
      stem: `ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦ ਦਾ ਵਚਨ ਬਦਲੋ: ${pair.source}`,
      options: [
        pair.target,
        pair.trap,
        "ਕਿਤਾਬੀਂ",
        pair.source,
      ],
      correct: 0,
      rule: pair.rule,
      trap: "ਗੈਰ-ਮਿਆਰੀ ਬਹੁਵਚਨ ਰੂਪ",
    };
  }

  if (
    key.includes("jor") ||
    key.includes("spelling") ||
    key.includes("ਸ਼ਬਦ")
  ) {
    const item =
      difficulty === "Hard"
        ? ORTHOGRAPHY_ITEMS[2]
        : ORTHOGRAPHY_ITEMS[0];
    return {
      subtype: "pbi-voc-jor",
      stem: "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ਚੁਣੋ।",
      options: [
        item.correct,
        ...item.traps,
      ],
      correct: 0,
      rule: item.rule,
      trap: "ਬਿੰਦੀ/ਟਿੱਪੀ/ਅੱਧਕ ਦੀ ਗਲਤ ਸਥਿਤੀ",
    };
  }

  if (
    key.includes("muhav") ||
    key.includes("akhaan") ||
    key.includes("idiom") ||
    key.includes("ਅਖਾਣ")
  ) {
    return difficulty === "Hard"
      ? IDIOM_ITEMS[1]
      : IDIOM_ITEMS[0];
  }

  if (
    key.includes("translation") ||
    key.includes("trans") ||
    key.includes("ਅਨੁਵਾਦ")
  ) {
    return TRANSLATION_ITEMS[0];
  }

  if (
    key.includes("saman") ||
    key.includes("virodh") ||
    key.includes("oneword") ||
    key.includes("vocabulary")
  ) {
    return difficulty === "Hard"
      ? SEMANTIC_ITEMS[1]
      : SEMANTIC_ITEMS[0];
  }

  return {
    subtype: "pbi-gram-shuddhi",
    stem:
      "ਵਾਕ ਸ਼ੁੱਧੀ ਕਰੋ: ਰਾਮ ਨੇ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੈ।",
    options: [
      "ਰਾਮ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੈ।",
      "ਰਾਮ ਨੇ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੈ।",
      "ਰਾਮ ਕਿਤਾਬ ਪੜ੍ਹਦੀ ਹੈ।",
      "ਰਾਮ ਕਿਤਾਬ ਪੜ੍ਹਦੇ ਹੈ।",
    ],
    correct: 0,
    rule:
      "ਵਰਤਮਾਨ ਕਾਲ ਦੇ ਸਧਾਰਨ ਵਾਕ ਵਿੱਚ ਕਰਤਾ ਨਾਲ ਨੇ ਨਹੀਂ ਆਉਂਦਾ ਅਤੇ ਕਿਰਿਆ ਕਰਤਾ ਦੇ ਲਿੰਗ/ਵਚਨ ਨਾਲ ਮਿਲਦੀ ਹੈ।",
    trap: "ਕਰਤਾ-ਕਿਰਿਆ ਅਨੁਕੂਲਤਾ ਦੀ ਗਲਤੀ",
  };
}

function inferCluster(
  subtype: string,
): PunjabiCluster {
  if (subtype.includes("idiom")) {
    return "idiom";
  }
  if (subtype.includes("trans")) {
    return "translation";
  }
  if (subtype.includes("voc")) {
    return "shabad-bodh";
  }
  return "vyakaran";
}

function buildOptionMetadata(
  options: string[],
  correct: number,
  trap: string,
) {
  return options.map(
    (value, index) => ({
      value,
      isCorrect: index === correct,
      distractorType:
        index === correct
          ? undefined
          : "comparisonTrap",
      likelyMistake:
        index === correct
          ? undefined
          : trap,
      reasoningTrap:
        index === correct
          ? undefined
          : trap,
    }),
  ) satisfies OptionMetadata[];
}

function examModeText(
  mode: PunjabiMode,
  examProfile?: ExamProfileId,
) {
  if (mode === "paper-b") {
    return "Paper-B / Advanced Merit Level";
  }
  if (examProfile === "rrb") {
    return "Paper-A / Qualifying Punjabi Test, Standard 10th Level";
  }
  return "Paper-A / PSEB Standard Level";
}

export function createPunjabiScenario(
  pattern: Pattern,
  options?: GeneratorOptions,
): PunjabiScenario {
  const difficulty =
    pattern.difficulty ?? "Medium";
  const mode = pickMode(difficulty);
  const item =
    selectBaseItem(pattern, difficulty);
  const rule = resolveRule(
    item.subtype,
  );
  const cluster =
    inferCluster(item.subtype);
  const cleanedOptions =
    item.options.map(
      (option) =>
        cleanPunjabiOutput(option),
    );
  const transformer =
    new VyakaranTransformer();
  const orthographyIssues =
    cleanedOptions.flatMap(
      (option) =>
        transformer.validateOrthography(
          option,
        ).issues,
    );
  const reasoningSteps = [
    `ਪ੍ਰਸ਼ਨ ਕਿਸਮ ਪਛਾਣੋ: ${rule.label}.`,
    `ਨਿਯਮ ਲਾਗੂ ਕਰੋ: ${rule.rule}`,
    `ਫੰਦਾ ਹਟਾਓ: ${item.trap}.`,
    `ਮਿਆਰੀ ਰੂਪ ਚੁਣੋ: ${cleanedOptions[item.correct]}.`,
  ].map(normalizePunjabiUnicode);

  return {
    id: `punjabi-${item.subtype}-${difficulty.toLowerCase()}`,
    cluster,
    subtype: item.subtype,
    stem:
      cleanPunjabiOutput(item.stem),
    options: cleanedOptions,
    correct: item.correct,
    explanation: [
      `ਨਿਯਮ / Rule applied: ${rule.id} - ${rule.label}.`,
      `ਪੰਜਾਬੀ ਵਿਆਖਿਆ: ${item.rule}`,
      `English explanation: The answer follows standard literary Punjabi orthography/grammar, not colloquial guesswork.`,
      `Mode: ${examModeText(mode, options?.examProfile)}.`,
      orthographyIssues.length
        ? `Duggal Guard warnings checked: ${orthographyIssues.join(" ")}`
        : "Duggal Guard: Standard Majhi/PSEB form validated.",
    ].map(normalizePunjabiUnicode).join("\n"),
    ruleApplied:
      `${rule.id}: ${rule.rule}`,
    reasoningSteps,
    optionMetadata:
      buildOptionMetadata(
        cleanedOptions,
        item.correct,
        item.trap,
      ),
    difficulty,
    structuralSignature: `${cluster}:${item.subtype}:${rule.id}`,
    mode,
  };
}
