import { runMen001Pipeline } from "./MEN-001/pipeline";
import { generateMenCp008PermanentQuestion } from "./MEN-002/MEN-CP-008/permanent/runtime";
import {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  MENSURATION_QUESTION_STUDIO_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V1,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationStudioQuestionV1,
  type MensurationQuestionStudioCpId,
  type MensurationQuestionStudioDifficulty,
  type MensurationQuestionStudioPattern,
  type MensurationQuestionStudioQuestion,
} from "./mensuration-question-studio-runtime-v1";

export const MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY =
  "MENSURATION-FULL-CHAPTER-QUESTION-STUDIO-REALISM-V2" as const;

export const MENSURATION_QUESTION_STUDIO_EXAM_PROFILES = [
  "SSC_CORE",
  "SSC_ADVANCED",
  "BANKING",
  "PUNJAB_STATE",
] as const;

export type MensurationQuestionStudioExamProfile =
  (typeof MENSURATION_QUESTION_STUDIO_EXAM_PROFILES)[number];
export type MensurationPatternFrequencyBand =
  | "CORE_HIGH"
  | "STANDARD"
  | "LOW_FREQUENCY"
  | "ENRICHMENT";

export interface MensurationPatternRealismMetadata {
  frequencyBand: MensurationPatternFrequencyBand;
  profileWeights: Readonly<Record<MensurationQuestionStudioExamProfile, number>>;
}

export interface MensurationQuestionStudioRealismMetadata {
  authority: typeof MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY;
  examProfile: MensurationQuestionStudioExamProfile;
  frequencyBand: MensurationPatternFrequencyBand;
  selectionWeight: number;
  sourceSeed: string;
  objectVariantId: string;
  stemVariantId: string;
  numericalStateSignature: string;
}

export type MensurationQuestionStudioQuestionV2 = MensurationQuestionStudioQuestion & {
  realism: MensurationQuestionStudioRealismMetadata;
};

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function pick<T>(seed: string, key: string, values: readonly T[]): T {
  return values[hashText(`${seed}:${key}`) % values.length]!;
}

const BAND_WEIGHTS: Readonly<
  Record<MensurationQuestionStudioExamProfile, Readonly<Record<MensurationPatternFrequencyBand, number>>>
> = {
  SSC_CORE: { CORE_HIGH: 10, STANDARD: 5, LOW_FREQUENCY: 1.5, ENRICHMENT: 0.35 },
  SSC_ADVANCED: { CORE_HIGH: 7, STANDARD: 6, LOW_FREQUENCY: 4, ENRICHMENT: 1.75 },
  BANKING: { CORE_HIGH: 6, STANDARD: 6, LOW_FREQUENCY: 2.5, ENRICHMENT: 0.75 },
  PUNJAB_STATE: { CORE_HIGH: 8, STANDARD: 6, LOW_FREQUENCY: 3, ENRICHMENT: 1 },
} as const;

const CP_PROFILE_MULTIPLIERS: Readonly<
  Record<MensurationQuestionStudioExamProfile, Readonly<Record<string, number>>>
> = {
  SSC_CORE: {
    "MEN-CP-001": 1.35, "MEN-CP-002": 1.25, "MEN-CP-003": 1.3, "MEN-CP-004": 1.05,
    "MEN-CP-005": 0.9, "MEN-CP-006": 0.9, "MEN-CP-007": 1.2, "MEN-CP-008": 1.35,
    "MEN-CP-009": 1.1, "MEN-CP-010": 0.55, "MEN-CP-011": 0.6, "MEN-CP-012": 0.45,
    "MEN-CP-013": 0.55,
  },
  SSC_ADVANCED: {
    "MEN-CP-001": 1.05, "MEN-CP-002": 1.05, "MEN-CP-003": 1.05, "MEN-CP-004": 1,
    "MEN-CP-005": 1, "MEN-CP-006": 1, "MEN-CP-007": 1.1, "MEN-CP-008": 1.2,
    "MEN-CP-009": 1.1, "MEN-CP-010": 1, "MEN-CP-011": 1, "MEN-CP-012": 0.95,
    "MEN-CP-013": 1,
  },
  BANKING: {
    "MEN-CP-001": 1.15, "MEN-CP-002": 1.15, "MEN-CP-003": 1.05, "MEN-CP-004": 1.25,
    "MEN-CP-005": 1, "MEN-CP-006": 1.25, "MEN-CP-007": 0.9, "MEN-CP-008": 0.9,
    "MEN-CP-009": 0.75, "MEN-CP-010": 0.45, "MEN-CP-011": 0.55, "MEN-CP-012": 0.7,
    "MEN-CP-013": 0.7,
  },
  PUNJAB_STATE: {
    "MEN-CP-001": 1.2, "MEN-CP-002": 1.2, "MEN-CP-003": 1.15, "MEN-CP-004": 1.1,
    "MEN-CP-005": 1, "MEN-CP-006": 1.05, "MEN-CP-007": 1.1, "MEN-CP-008": 1.1,
    "MEN-CP-009": 1, "MEN-CP-010": 0.8, "MEN-CP-011": 0.8, "MEN-CP-012": 0.65,
    "MEN-CP-013": 0.75,
  },
} as const;

function inferFrequencyBand(pattern: MensurationQuestionStudioPattern): MensurationPatternFrequencyBand {
  const text = `${pattern.title} ${pattern.patternId}`.toLowerCase();
  if (/minimum|optimization|similar|secondary|semicircle|sector-height|surface-decrease|hollow-target-thickness|yield-percent/.test(text)) {
    return "ENRICHMENT";
  }
  if (/frustum|pyramid|hollow|shell|recast|melting|displacement|overflow|inscribed|containment|wastage|loss|inverse|drill/.test(text)) {
    return "LOW_FREQUENCY";
  }
  if (pattern.packageId === "MEN-001" && /· easy$/i.test(pattern.title)) return "CORE_HIGH";
  if (["MEN-CP-001", "MEN-CP-002", "MEN-CP-003", "MEN-CP-007", "MEN-CP-008", "MEN-CP-009"].includes(pattern.cpId)) {
    if (/direct|area|perimeter|volume|surface|circumference|radius|height|capacity/.test(text) && !/ratio|percent|from|cost/.test(text)) {
      return "CORE_HIGH";
    }
  }
  if (["MEN-CP-010", "MEN-CP-011", "MEN-CP-012", "MEN-CP-013"].includes(pattern.cpId)) return "LOW_FREQUENCY";
  return "STANDARD";
}

export function getMensurationPatternRealismMetadataV2(
  pattern: MensurationQuestionStudioPattern,
): MensurationPatternRealismMetadata {
  const frequencyBand = inferFrequencyBand(pattern);
  const profileWeights = Object.fromEntries(
    MENSURATION_QUESTION_STUDIO_EXAM_PROFILES.map((profile) => [
      profile,
      BAND_WEIGHTS[profile][frequencyBand] * (CP_PROFILE_MULTIPLIERS[profile][pattern.cpId] ?? 1),
    ]),
  ) as Record<MensurationQuestionStudioExamProfile, number>;
  return { frequencyBand, profileWeights };
}

export const MENSURATION_QUESTION_STUDIO_REALISM_PATTERNS = MENSURATION_QUESTION_STUDIO_PATTERNS.map((pattern) => ({
  ...pattern,
  realism: getMensurationPatternRealismMetadataV2(pattern),
}));

export const MENSURATION_QUESTION_STUDIO_PACKAGE_V2 = {
  ...MENSURATION_QUESTION_STUDIO_PACKAGE_V1,
  label: "Mensuration · Full Chapter · Realism V2",
  reviewStatus: "QUESTION_STUDIO_CONNECTED_REALISM_REMEDIATED" as const,
  realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  supportedExamProfiles: MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  defaultExamProfile: "SSC_CORE" as const,
  patterns: MENSURATION_QUESTION_STUDIO_REALISM_PATTERNS,
} as const;

function sourceSeedForV2(pattern: MensurationQuestionStudioPattern, seed: string) {
  if (pattern.cpId !== "MEN-CP-013") return seed;
  const trailing = /(?:^|:)(\d+)$/.exec(seed)?.[1];
  const answerPosition = trailing ? Number(trailing) % 4 : hashText(`${seed}:answer-position`) % 4;
  const contentIndex = hashText(`${seed}:cp013-content`) % 256;
  return `mensuration-cp013-realism-v2:${contentIndex * 4 + answerPosition}`;
}

function optionText(option: any) {
  return typeof option === "string" ? option : String(option?.display ?? option?.text ?? option);
}

function repairLearnerMath(text: string) {
  return text
    .replace(/\\pih\b/g, "\\pi h")
    .replace(/(^|[^$])(\d+(?:\.\d+)?\\pi)\$/g, (_match, prefix: string, value: string) => `${prefix}$${value}$`);
}

function hydrateCp008FinalEditorial(
  base: MensurationQuestionStudioQuestion,
  sourceSeed: string,
): MensurationQuestionStudioQuestion {
  const source = generateMenCp008PermanentQuestion(base.patternId, sourceSeed);
  const options = source.options.map(optionText);
  const correctIndex = Number(source.correctIndex);
  const optionDetails = source.options.map((option: any, index: number) => ({
    label: ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D",
    text: options[index]!,
    isCorrect: typeof option === "object" && option !== null && "isCorrect" in option ? option.isCorrect === true : index === correctIndex,
    misconceptionId: typeof option === "object" && option !== null ? option.misconceptionId ?? null : null,
  }));
  const steps = source.explanation.steps.map((step: any) =>
    [step.title, step.body, step.equation].filter(Boolean).join(" — "),
  );
  return {
    ...base,
    stem: String(source.stem),
    options,
    optionDetails,
    correctIndex,
    answer: String(source.answer ?? options[correctIndex]),
    explanation: {
      steps,
      shortcut: String(source.explanation.shortcut ?? base.explanation.shortcut),
      traps: Array.isArray(source.explanation.traps) ? source.explanation.traps.map(String) : base.explanation.traps,
    },
    solveMode: String(source.solveMode ?? base.solveMode),
    sourceAuthority: String(source.authority ?? base.sourceAuthority),
    sourceReviewStatus: String(source.reviewStatus ?? base.sourceReviewStatus),
    sourceMaturity: String(source.maturity ?? base.sourceMaturity),
  };
}

function hydrateMen001StructuredTeaching(
  base: MensurationQuestionStudioQuestion,
  sourceSeed: string,
): MensurationQuestionStudioQuestion {
  const source: any = runMen001Pipeline(base.cpId as any, {
    language: "en",
    questionLanguageId: base.patternId,
    seed: sourceSeed,
  });
  const sections = Array.isArray(source?.explanation?.sections) ? source.explanation.sections : [];
  const shortcutSection = sections.find((section: any) => section?.kind === "EXAM_SHORTCUT");
  const trapsSection = sections.find((section: any) => section?.kind === "COMMON_TRAPS");
  const shortcut = Array.isArray(shortcutSection?.paragraphs)
    ? shortcutSection.paragraphs.map(String).join(" ").trim()
    : "";
  const traps = Array.isArray(trapsSection?.paragraphs)
    ? trapsSection.paragraphs.map(String).filter(Boolean)
    : [];
  return {
    ...base,
    explanation: {
      ...base.explanation,
      shortcut: shortcut || base.explanation.shortcut,
      traps: traps.length ? traps : base.explanation.traps,
    },
  };
}

function polishKnownSetterShorthand(patternId: string, stem: string) {
  let result = stem;
  if (patternId === "MEN-002-QL-084") {
    result = result.replace(
      /A cylinder has \$r:h=([^$]+)\$/i,
      (_match, ratio: string) => `The radius and height of a cylinder are in the ratio $${ratio}$`,
    );
  }
  if (patternId === "MEN-002-QL-143") {
    result = result.replace(
      /with larger radius = ([^,]+), smaller radius = ([^,]+), vertical height = ([^.]+)\./i,
      (_match, larger: string, smaller: string, height: string) =>
        `whose larger radius is ${larger}, smaller radius is ${smaller}, and vertical height is ${height}.`,
    );
  }
  return result;
}

const OBJECT_SURFACE_RULES: readonly {
  id: string;
  pattern: RegExp;
  variants: readonly string[];
}[] = [
  { id: "triangular-land", pattern: /triangular field/gi, variants: ["triangular field", "triangular plot", "triangular park"] },
  { id: "rectangular-land", pattern: /rectangular field/gi, variants: ["rectangular field", "rectangular plot", "rectangular lawn"] },
  { id: "garden-land", pattern: /rectangular garden/gi, variants: ["rectangular garden", "rectangular lawn", "rectangular park"] },
  { id: "metal-sheet", pattern: /triangular metal sheet/gi, variants: ["triangular metal sheet", "triangular metal plate", "triangular sheet-metal piece"] },
  { id: "water-tank", pattern: /rectangular water tank/gi, variants: ["rectangular water tank", "rectangular storage tank", "rectangular reservoir"] },
  { id: "cylindrical-vessel", pattern: /cylindrical vessel/gi, variants: ["cylindrical vessel", "cylindrical container", "cylindrical tank"] },
  { id: "storage-vessel", pattern: /storage vessel/gi, variants: ["storage vessel", "storage container", "storage tank"] },
  { id: "solid-toy", pattern: /solid toy/gi, variants: ["solid toy", "decorative solid", "solid model"] },
  { id: "decorative-toy", pattern: /decorative metal toy/gi, variants: ["decorative metal toy", "decorative metal model", "metal decorative solid"] },
  { id: "cylindrical-block", pattern: /cylindrical block/gi, variants: ["cylindrical block", "solid cylindrical block", "cylindrical metal block"] },
];

const STEM_ENDING_RULES: readonly {
  id: string;
  pattern: RegExp;
  variants: readonly string[];
}[] = [
  { id: "ask-area", pattern: /Find its area\.$/i, variants: ["Find its area.", "What is its area?", "Determine its area."] },
  { id: "ask-volume", pattern: /Find its volume\.$/i, variants: ["Find its volume.", "What is its volume?", "Calculate its volume."] },
  { id: "ask-capacity", pattern: /Find its capacity in litres\.$/i, variants: ["Find its capacity in litres.", "Determine its capacity in litres.", "How many litres can it hold?"] },
  { id: "ask-rise", pattern: /Find the rise in water level\.$/i, variants: ["Find the rise in water level.", "By how much does the water level rise?", "Determine the increase in water level."] },
  { id: "ask-diameter", pattern: /Find the sphere's diameter\.$/i, variants: ["Find the sphere's diameter.", "Determine the diameter of the sphere.", "What is the sphere's diameter?"] },
  { id: "ask-base-area", pattern: /Find the area of the tank's horizontal base\.$/i, variants: ["Find the area of the tank's horizontal base.", "Determine the horizontal base area of the tank.", "What is the area of the tank's base?"] },
  { id: "ask-overflow", pattern: /How much water overflows\?$/i, variants: ["How much water overflows?", "Find the volume of water that overflows.", "What volume of water spills out?"] },
];

function applySurfacePools(seed: string, stem: string) {
  let result = stem;
  const objectIds: string[] = [];
  const stemIds: string[] = [];
  for (const rule of OBJECT_SURFACE_RULES) {
    if (!rule.pattern.test(result)) {
      rule.pattern.lastIndex = 0;
      continue;
    }
    rule.pattern.lastIndex = 0;
    const variant = pick(seed, `object:${rule.id}`, rule.variants);
    result = result.replace(rule.pattern, variant);
    rule.pattern.lastIndex = 0;
    objectIds.push(`${rule.id}:${rule.variants.indexOf(variant)}`);
  }
  for (const rule of STEM_ENDING_RULES) {
    if (!rule.pattern.test(result)) continue;
    const variant = pick(seed, `stem:${rule.id}`, rule.variants);
    result = result.replace(rule.pattern, variant);
    stemIds.push(`${rule.id}:${rule.variants.indexOf(variant)}`);
    break;
  }
  return {
    stem: result,
    objectVariantId: objectIds.join(",") || "SOURCE_OBJECT",
    stemVariantId: stemIds.join(",") || "SOURCE_STEM",
  };
}

const CP013_EASY = new Set(["MEN-002-QL-163", "MEN-002-QL-167", "MEN-002-QL-170", "MEN-002-QL-171"]);
const CP013_HARD = new Set(["MEN-002-QL-168", "MEN-002-QL-173", "MEN-002-QL-176", "MEN-002-QL-177"]);
const CP012_EASY = new Set(["MEN-002-QL-150", "MEN-002-QL-151", "MEN-002-QL-154"]);
const CP012_HARD = new Set(["MEN-002-QL-155", "MEN-002-QL-158", "MEN-002-QL-161", "MEN-002-QL-162"]);

function calibrateDifficulty(question: MensurationQuestionStudioQuestion, pattern: MensurationQuestionStudioPattern): MensurationQuestionStudioDifficulty {
  if (pattern.cpId === "MEN-CP-013") {
    if (CP013_EASY.has(pattern.patternId)) return "Easy";
    if (CP013_HARD.has(pattern.patternId)) return "Hard";
    return "Medium";
  }
  if (pattern.cpId === "MEN-CP-012") {
    if (CP012_EASY.has(pattern.patternId)) return "Easy";
    if (CP012_HARD.has(pattern.patternId)) return "Hard";
    return "Medium";
  }
  const text = `${pattern.title} ${question.solveMode} ${question.stem}`.toLowerCase();
  const hardCue = /minimum|similar|optimization|multi-step|secondary|overflow|wastage|surface decrease|hollow.*thickness|semicircle.*sector|rolling.*ratio|equal-volume|inverse.*ratio/;
  const mediumCue = /ratio|percent|inverse|from|cost|capacity|recast|displacement|inscribed|containment|frustum|pyramid|derived|roller|slant/;
  if (pattern.cpId === "MEN-CP-008") {
    if (hardCue.test(text) || question.explanation.steps.length >= 5) return "Hard";
    if (mediumCue.test(text) || question.explanation.steps.length >= 4) return "Medium";
    return "Easy";
  }
  if (pattern.cpId === "MEN-CP-010") {
    if (hardCue.test(text) || /slant|ratio|percent|from|inverse|cost/.test(text)) return "Hard";
    if (/frustum|pyramid|capacity/.test(text)) return "Medium";
    return "Easy";
  }
  return question.difficultyBand;
}

function numericalStateSignature(patternId: string, stem: string, answer: string) {
  const tokens = stem.match(/\d+(?:\.\d+)?(?:\/\d+)?|\\frac\{[^}]+\}\{[^}]+\}|π|√\d+/g) ?? [];
  return `${patternId}|${tokens.join("|")}|${answer}`;
}

function polishQuestionText(question: MensurationQuestionStudioQuestion) {
  return {
    ...question,
    stem: repairLearnerMath(question.stem),
    options: question.options.map(repairLearnerMath),
    optionDetails: question.optionDetails.map((option) => ({ ...option, text: repairLearnerMath(option.text) })),
    answer: repairLearnerMath(question.answer),
    explanation: {
      steps: question.explanation.steps.map(repairLearnerMath),
      shortcut: repairLearnerMath(question.explanation.shortcut),
      traps: question.explanation.traps.map(repairLearnerMath),
    },
  };
}

export function generateMensurationStudioQuestionV2(input: {
  patternId: string;
  seed: string;
  examProfile?: MensurationQuestionStudioExamProfile;
}): MensurationQuestionStudioQuestionV2 {
  const pattern = MENSURATION_QUESTION_STUDIO_PATTERNS.find((row) => row.patternId === input.patternId);
  if (!pattern) throw new Error(`Unknown Mensuration Question Studio pattern '${input.patternId}'.`);
  const examProfile = input.examProfile ?? "SSC_CORE";
  const sourceSeed = sourceSeedForV2(pattern, input.seed);
  let question = generateMensurationStudioQuestionV1({ patternId: pattern.patternId, seed: sourceSeed });
  if (pattern.cpId === "MEN-CP-008") question = hydrateCp008FinalEditorial(question, sourceSeed);
  if (pattern.packageId === "MEN-001") question = hydrateMen001StructuredTeaching(question, sourceSeed);
  question = polishQuestionText(question);
  let stem = polishKnownSetterShorthand(pattern.patternId, question.stem);
  const surface = applySurfacePools(input.seed, stem);
  stem = surface.stem;
  const difficultyBand = calibrateDifficulty({ ...question, stem }, pattern);
  const meta = getMensurationPatternRealismMetadataV2(pattern);
  const selectionWeight = meta.profileWeights[examProfile];
  const stateSignature = numericalStateSignature(pattern.patternId, stem, question.answer);
  const result: MensurationQuestionStudioQuestionV2 = {
    ...question,
    seed: input.seed,
    stem,
    difficultyBand,
    realism: {
      authority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
      examProfile,
      frequencyBand: meta.frequencyBand,
      selectionWeight,
      sourceSeed,
      objectVariantId: surface.objectVariantId,
      stemVariantId: surface.stemVariantId,
      numericalStateSignature: stateSignature,
    },
  };
  if (!result.validation.valid) throw new Error(`${pattern.patternId}/${input.seed}: realism V2 source validation failed.`);
  return result;
}

function weightedPattern(
  eligible: readonly MensurationQuestionStudioPattern[],
  examProfile: MensurationQuestionStudioExamProfile,
  seed: string,
) {
  const rows = eligible.map((pattern) => ({
    pattern,
    weight: getMensurationPatternRealismMetadataV2(pattern).profileWeights[examProfile],
  }));
  const total = rows.reduce((sum, row) => sum + row.weight, 0);
  let ticket = (hashText(seed) / 0xffffffff) * total;
  for (const row of rows) {
    ticket -= row.weight;
    if (ticket <= 0) return row.pattern;
  }
  return rows[rows.length - 1]!.pattern;
}

export function generateMensurationStudioBatchV2(input: {
  cpId?: MensurationQuestionStudioCpId;
  patternId?: string;
  difficulty?: MensurationQuestionStudioDifficulty;
  examProfile?: MensurationQuestionStudioExamProfile;
  seed?: string;
  count?: number;
}) {
  const count = Math.max(1, Math.min(50, Math.floor(input.count ?? 5)));
  const seed = input.seed?.trim() || "mensuration-question-studio";
  const examProfile = input.examProfile ?? "SSC_CORE";
  let eligible = MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => !input.cpId || row.cpId === input.cpId);
  if (input.patternId) eligible = eligible.filter((row) => row.patternId === input.patternId);
  if (!eligible.length) throw new Error("No Mensuration patterns matched the requested filters.");

  const questions: MensurationQuestionStudioQuestionV2[] = [];
  const exactStates = new Set<string>();
  const numericalStates = new Set<string>();
  const recentPatterns: string[] = [];
  let duplicateSkips = 0;

  for (let attempt = 0; questions.length < count && attempt < count * 2048; attempt += 1) {
    const pattern = input.patternId
      ? eligible[0]!
      : weightedPattern(eligible, examProfile, `${seed}:pattern:${attempt}`);
    if (!input.patternId && eligible.length >= 8 && recentPatterns.slice(-3).includes(pattern.patternId)) continue;
    const question = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `${seed}:${attempt}`,
      examProfile,
    });
    if (input.difficulty && question.difficultyBand !== input.difficulty) continue;

    const exact = `${question.patternId}|${question.stem}|${question.options.join("|")}`;
    const repeated = exactStates.has(exact) || numericalStates.has(question.realism.numericalStateSignature);
    if (repeated && duplicateSkips < Math.max(32, count * 8)) {
      duplicateSkips += 1;
      continue;
    }

    duplicateSkips = 0;
    exactStates.add(exact);
    numericalStates.add(question.realism.numericalStateSignature);
    recentPatterns.push(question.patternId);
    questions.push(question);
  }

  if (questions.length !== count) {
    throw new Error(`Unable to construct ${count} Mensuration questions for the requested filters and realism profile.`);
  }
  return {
    package: MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
    questions,
    filters: {
      cpId: input.cpId ?? null,
      patternId: input.patternId ?? null,
      difficulty: input.difficulty ?? null,
      examProfile,
    },
    seed,
    realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  };
}

export {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  MENSURATION_QUESTION_STUDIO_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
};
export type { MensurationQuestionStudioCpId, MensurationQuestionStudioDifficulty };
