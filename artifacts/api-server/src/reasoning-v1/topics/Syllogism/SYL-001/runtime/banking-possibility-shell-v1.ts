import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
} from "../foundation/types";
import {
  analyzeScenario,
  conclusionDirectlyRestatesPremise,
  conclusionSemanticKey,
} from "./analysis";
import {
  pairSemanticLabel,
  renderConclusion,
  renderPremise,
  type TermAssignment,
} from "./localization";
import { createPrng, shuffle } from "./prng";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";
import type {
  EvaluatedConclusion,
  GeneratedSylOption,
  PairSemanticStatus,
  ScenarioAnalysis,
  SylScenarioGroup,
} from "./types";

export type BankingConclusionModeV1 = "DEFINITE" | "POSSIBILITY";

export interface BankingPossibilityConclusionV1 {
  mode: BankingConclusionModeV1;
  canonicalConclusion: CanonicalConclusion;
  text: string;
  follows: boolean;
  classification: EvaluatedConclusion["profile"]["classification"];
  canBeTrue: boolean;
  canBeFalse: boolean;
  witnessModelAvailable: boolean;
  counterModelAvailable: boolean;
}

export interface BankingPossibilityShellQuestionV1 {
  authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1";
  prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-001";
  seed: number;
  locale: SylLocale;
  scenarioId: string;
  scenarioGroup: SylScenarioGroup;
  sourcePatternId: string;
  statements: readonly string[];
  conclusions: readonly BankingPossibilityConclusionV1[];
  options: readonly GeneratedSylOption[];
  correctIndex: number;
  semanticAnswer: PairSemanticStatus;
  explanation: readonly string[];
  metadata: {
    answerTemplateId: "BANK_FIVE_OPTION_V1";
    renderer: "CONCLUSION_COMBINATION";
    possibilityConclusionCount: 1;
    definiteConclusionCount: 1;
    legacyQlChanged: false;
    registeredQlCreated: false;
    connectedToProfilePlanner: false;
    questionStudioVisible: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

interface SelectedPossibilityPairV1 {
  analysis: ScenarioAnalysis;
  first: EvaluatedConclusion;
  firstMode: BankingConclusionModeV1;
  second: EvaluatedConclusion;
  secondMode: BankingConclusionModeV1;
  status: PairSemanticStatus;
}

const PAIR_OPTIONS: readonly PairSemanticStatus[] = [
  "ONLY_FIRST_FOLLOWS",
  "ONLY_SECOND_FOLLOWS",
  "BOTH_FOLLOW",
  "NEITHER_FOLLOWS",
  "EITHER_OR_FOLLOWS",
];

const TARGET_STATUSES: readonly PairSemanticStatus[] = [
  "ONLY_FIRST_FOLLOWS",
  "ONLY_SECOND_FOLLOWS",
  "BOTH_FOLLOW",
  "NEITHER_FOLLOWS",
];

const BANKING_GROUPS: readonly SylScenarioGroup[] = ["CORE", "ONLY", "FEW"];

function rotated<T>(items: readonly T[], offset: number): T[] {
  if (items.length === 0) return [];
  const start = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function bankingScenarios(group: SylScenarioGroup) {
  return scenariosForGroup(group).filter((scenario) =>
    scenario.sourcePatternId.startsWith("SYL-SRC-BANK-"));
}

function novelCandidates(analysis: ScenarioAnalysis): readonly EvaluatedConclusion[] {
  return analysis.candidates.filter((candidate) =>
    !conclusionDirectlyRestatesPremise(analysis.premises, candidate.conclusion));
}

function follows(candidate: EvaluatedConclusion, mode: BankingConclusionModeV1): boolean {
  return mode === "POSSIBILITY"
    ? candidate.profile.canBeTrue
    : candidate.profile.classification === "ENTAILED";
}

function pairStatus(
  first: EvaluatedConclusion,
  firstMode: BankingConclusionModeV1,
  second: EvaluatedConclusion,
  secondMode: BankingConclusionModeV1,
): PairSemanticStatus {
  const firstFollows = follows(first, firstMode);
  const secondFollows = follows(second, secondMode);
  if (firstFollows && secondFollows) return "BOTH_FOLLOW";
  if (firstFollows) return "ONLY_FIRST_FOLLOWS";
  if (secondFollows) return "ONLY_SECOND_FOLLOWS";
  return "NEITHER_FOLLOWS";
}

function impactedPremises(
  candidate: EvaluatedConclusion,
  mode: BankingConclusionModeV1,
): readonly string[] {
  return mode === "POSSIBILITY"
    ? candidate.impactPremiseIds
    : candidate.verdictImpactPremiseIds;
}

function pairUsesAllPremises(
  analysis: ScenarioAnalysis,
  first: EvaluatedConclusion,
  firstMode: BankingConclusionModeV1,
  second: EvaluatedConclusion,
  secondMode: BankingConclusionModeV1,
): boolean {
  const impacted = new Set([
    ...impactedPremises(first, firstMode),
    ...impactedPremises(second, secondMode),
  ]);
  return analysis.premises.every((premise) => impacted.has(premise.premiseId));
}

function possibilityCandidateIsExamUseful(candidate: EvaluatedConclusion): boolean {
  return (
    candidate.conclusion.form === "SOME"
    || candidate.conclusion.form === "SOME_NOT"
  ) && candidate.profile.classification !== "ENTAILED";
}

function selectPair(seed: number): SelectedPossibilityPairV1 {
  const random = createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-001:${seed}:selection`);
  const target = TARGET_STATUSES[Math.abs(seed) % TARGET_STATUSES.length];
  const groups = rotated(shuffle(BANKING_GROUPS, random), seed);
  const possibilityFirst = Math.abs(seed) % 2 === 0;

  for (const group of groups) {
    const scenarios = rotated(shuffle(bankingScenarios(group), random), seed);
    for (const scenario of scenarios) {
      const analysis = analyzeScenario(scenario);
      const candidates = shuffle(novelCandidates(analysis), random);
      const possibilities = candidates.filter(possibilityCandidateIsExamUseful);

      for (const possibility of possibilities) {
        for (const definite of candidates) {
          if (conclusionSemanticKey(possibility) === conclusionSemanticKey(definite)) continue;
          const first = possibilityFirst ? possibility : definite;
          const firstMode: BankingConclusionModeV1 = possibilityFirst ? "POSSIBILITY" : "DEFINITE";
          const second = possibilityFirst ? definite : possibility;
          const secondMode: BankingConclusionModeV1 = possibilityFirst ? "DEFINITE" : "POSSIBILITY";
          const status = pairStatus(first, firstMode, second, secondMode);
          if (status !== target) continue;
          if (!pairUsesAllPremises(analysis, first, firstMode, second, secondMode)) continue;
          return { analysis, first, firstMode, second, secondMode, status };
        }
      }
    }
  }

  throw new Error(`No Banking possibility-shell pair for seed ${seed} and target ${target}.`);
}

function termLabel(
  conclusion: CanonicalConclusion,
  side: "subject" | "predicate",
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const term = assignment[conclusion[side]];
  if (!term) throw new Error(`Missing term ${conclusion[side]} in assignment.`);
  return term.labels[locale];
}

function renderPossibilityConclusion(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = termLabel(conclusion, "subject", locale, assignment);
  const predicate = termLabel(conclusion, "predicate", locale, assignment);

  if (locale === "en-IN") {
    if (conclusion.form === "SOME") return `Some ${subject} being ${predicate} is a possibility.`;
    if (conclusion.form === "SOME_NOT") return `Some ${subject} not being ${predicate} is a possibility.`;
  }
  if (locale === "hi-IN") {
    if (conclusion.form === "SOME") return `यह संभव है कि कुछ ${subject} ${predicate} हों।`;
    if (conclusion.form === "SOME_NOT") return `यह संभव है कि कुछ ${subject} ${predicate} न हों।`;
  }
  if (conclusion.form === "SOME") return `ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਕੁਝ ${subject} ${predicate} ਹੋਣ।`;
  if (conclusion.form === "SOME_NOT") return `ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਕੁਝ ${subject} ${predicate} ਨਾ ਹੋਣ।`;
  throw new Error(`Unsupported possibility form ${conclusion.form}.`);
}

function renderSelectedConclusion(
  candidate: EvaluatedConclusion,
  mode: BankingConclusionModeV1,
  locale: SylLocale,
  assignment: TermAssignment,
): BankingPossibilityConclusionV1 {
  return {
    mode,
    canonicalConclusion: candidate.conclusion,
    text: mode === "POSSIBILITY"
      ? renderPossibilityConclusion(candidate.conclusion, locale, assignment)
      : renderConclusion(candidate.conclusion, locale, assignment),
    follows: follows(candidate, mode),
    classification: candidate.profile.classification,
    canBeTrue: candidate.profile.canBeTrue,
    canBeFalse: candidate.profile.canBeFalse,
    witnessModelAvailable: Boolean(candidate.profile.witnessModel),
    counterModelAvailable: Boolean(candidate.profile.counterModel),
  };
}

function buildOptions(
  status: PairSemanticStatus,
  locale: SylLocale,
  seed: number,
): readonly GeneratedSylOption[] {
  const raw: readonly GeneratedSylOption[] = PAIR_OPTIONS.map((entry, index) => ({
    optionId: `RAW-${index + 1}`,
    semanticValue: entry,
    text: pairSemanticLabel(entry, locale),
    isCorrect: entry === status,
    errorLabel: entry === status ? null : "WRONG_COMBINATION_LABEL",
  }));
  return shuffle(raw, createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-001:${seed}:options`))
    .map((entry, index) => ({ ...entry, optionId: `OPTION-${index + 1}` }));
}

function explanationLine(
  label: "I" | "II",
  conclusion: BankingPossibilityConclusionV1,
  locale: SylLocale,
): string {
  if (locale === "en-IN") {
    if (conclusion.mode === "POSSIBILITY") {
      return conclusion.follows
        ? `${label}: This possibility follows because at least one valid arrangement allowed by the statements makes it true.`
        : `${label}: This possibility does not follow because every valid arrangement allowed by the statements rules it out.`;
    }
    if (conclusion.classification === "ENTAILED") {
      return `${label}: This ordinary conclusion follows because the statements make it true in every valid arrangement.`;
    }
    if (conclusion.classification === "CONTRADICTED") {
      return `${label}: This ordinary conclusion does not follow because the statements rule it out.`;
    }
    return `${label}: This ordinary conclusion does not follow because it is not guaranteed; at least one valid arrangement makes it false.`;
  }
  if (locale === "hi-IN") {
    if (conclusion.mode === "POSSIBILITY") {
      return conclusion.follows
        ? `${label}: यह संभावना अनुसरण करती है क्योंकि कथनों के अनुरूप कम-से-कम एक वैध व्यवस्था में यह संबंध संभव है।`
        : `${label}: यह संभावना अनुसरण नहीं करती क्योंकि कथनों के अनुरूप हर वैध व्यवस्था इस संबंध को असंभव बनाती है।`;
    }
    if (conclusion.classification === "ENTAILED") {
      return `${label}: यह सामान्य निष्कर्ष अनुसरण करता है क्योंकि यह हर वैध व्यवस्था में सत्य है।`;
    }
    if (conclusion.classification === "CONTRADICTED") {
      return `${label}: यह सामान्य निष्कर्ष अनुसरण नहीं करता क्योंकि कथन इस संबंध को असंभव बनाते हैं।`;
    }
    return `${label}: यह सामान्य निष्कर्ष अनुसरण नहीं करता क्योंकि यह निश्चित नहीं है; कम-से-कम एक वैध व्यवस्था में यह असत्य है।`;
  }
  if (conclusion.mode === "POSSIBILITY") {
    return conclusion.follows
      ? `${label}: ਇਹ ਸੰਭਾਵਨਾ ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਕਥਨਾਂ ਅਨੁਸਾਰ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਸੰਭਵ ਹੈ।`
      : `${label}: ਇਹ ਸੰਭਾਵਨਾ ਸਹੀ ਨਹੀਂ ਹੈ ਕਿਉਂਕਿ ਕਥਨਾਂ ਅਨੁਸਾਰ ਹਰ ਵੈਧ ਬਣਤਰ ਇਸ ਸੰਬੰਧ ਨੂੰ ਅਸੰਭਵ ਬਣਾਉਂਦੀ ਹੈ।`;
  }
  if (conclusion.classification === "ENTAILED") {
    return `${label}: ਇਹ ਆਮ ਨਤੀਜਾ ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਇਹ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਹੈ।`;
  }
  if (conclusion.classification === "CONTRADICTED") {
    return `${label}: ਇਹ ਆਮ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ ਕਿਉਂਕਿ ਕਥਨ ਇਸ ਸੰਬੰਧ ਨੂੰ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ।`;
  }
  return `${label}: ਇਹ ਆਮ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ ਕਿਉਂਕਿ ਇਹ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ; ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਇਹ ਝੂਠ ਹੈ।`;
}

export function generateBankingPossibilityShellV1(
  seed: number,
  locale: SylLocale,
): BankingPossibilityShellQuestionV1 {
  if (!Number.isSafeInteger(seed)) throw new Error("Seed must be a safe integer.");
  const selected = selectPair(seed);
  const assignment = assignTerms("SYL-QL-005", seed, selected.analysis.termOrder);
  const premiseRandom = createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-001:${seed}:premises`);
  const displayedPremises: readonly SurfacePremise[] = shuffle(selected.analysis.premises, premiseRandom);
  const statements = displayedPremises.map((premise) => renderPremise(premise, locale, assignment));
  const conclusions = [
    renderSelectedConclusion(selected.first, selected.firstMode, locale, assignment),
    renderSelectedConclusion(selected.second, selected.secondMode, locale, assignment),
  ] as const;
  const options = buildOptions(selected.status, locale, seed);
  const correctIndexes = options
    .map((entry, index) => entry.isCorrect ? index : -1)
    .filter((index) => index >= 0);
  if (correctIndexes.length !== 1) throw new Error(`Seed ${seed} must have one correct option.`);

  return {
    authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
    prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-001",
    seed,
    locale,
    scenarioId: selected.analysis.scenario.scenarioId,
    scenarioGroup: selected.analysis.scenario.group,
    sourcePatternId: selected.analysis.scenario.sourcePatternId,
    statements,
    conclusions,
    options,
    correctIndex: correctIndexes[0],
    semanticAnswer: selected.status,
    explanation: [
      explanationLine("I", conclusions[0], locale),
      explanationLine("II", conclusions[1], locale),
    ],
    metadata: {
      answerTemplateId: "BANK_FIVE_OPTION_V1",
      renderer: "CONCLUSION_COMBINATION",
      possibilityConclusionCount: 1,
      definiteConclusionCount: 1,
      legacyQlChanged: false,
      registeredQlCreated: false,
      connectedToProfilePlanner: false,
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export const SYL_BANKING_POSSIBILITY_SHELL_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
  status: "PROTOTYPE_NOT_REGISTERED",
  sourceArchetypeId: "SYL-A-BANK-POSSIBILITY-IN-CONCLUSION-SET",
  legacySemanticAuthority: "SYL-QL-005",
  answerTemplateId: "BANK_FIVE_OPTION_V1",
  renderer: "CONCLUSION_COMBINATION",
  activationPermitted: false,
});
