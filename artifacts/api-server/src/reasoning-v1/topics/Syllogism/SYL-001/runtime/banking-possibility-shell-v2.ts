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

export type BankingConclusionModeV2 = "DEFINITE" | "POSSIBILITY";
export type BankingPossibilityDispositionV2 =
  | "OPEN_POSSIBILITY"
  | "ALREADY_DEFINITE"
  | "IMPOSSIBLE";

export interface BankingPossibilityConclusionV2 {
  mode: BankingConclusionModeV2;
  canonicalConclusion: CanonicalConclusion;
  text: string;
  follows: boolean;
  classification: EvaluatedConclusion["profile"]["classification"];
  canBeTrue: boolean;
  canBeFalse: boolean;
  possibilityDisposition: BankingPossibilityDispositionV2 | null;
  witnessModelAvailable: boolean;
  counterModelAvailable: boolean;
}

export interface BankingPossibilityShellQuestionV2 {
  authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2";
  prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-002";
  seed: number;
  locale: SylLocale;
  scenarioId: string;
  scenarioGroup: SylScenarioGroup;
  sourcePatternId: string;
  statements: readonly string[];
  conclusions: readonly BankingPossibilityConclusionV2[];
  options: readonly GeneratedSylOption[];
  correctIndex: number;
  semanticAnswer: PairSemanticStatus;
  explanation: readonly string[];
  metadata: {
    answerTemplateId: "BANK_FIVE_OPTION_V1";
    renderer: "CONCLUSION_COMBINATION";
    possibilitySemanticProfile: "BANKING_EXAM_POSSIBILITY_V2";
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

interface SelectedPairV2 {
  analysis: ScenarioAnalysis;
  first: EvaluatedConclusion;
  firstMode: BankingConclusionModeV2;
  second: EvaluatedConclusion;
  secondMode: BankingConclusionModeV2;
  status: PairSemanticStatus;
  possibility: EvaluatedConclusion;
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

const TARGET_CLASSES: readonly EvaluatedConclusion["profile"]["classification"][] = [
  "UNDETERMINED",
  "ENTAILED",
  "CONTRADICTED",
];

const POSSIBILITY_FORMS: readonly CanonicalConclusion["form"][] = [
  "ALL",
  "SOME",
  "SOME_NOT",
];

const BANKING_GROUPS: readonly SylScenarioGroup[] = ["CORE", "ONLY", "FEW"];

function bankingScenarios(group: SylScenarioGroup) {
  return scenariosForGroup(group).filter((scenario) =>
    scenario.sourcePatternId.startsWith("SYL-SRC-BANK-"));
}

function novelCandidates(analysis: ScenarioAnalysis): readonly EvaluatedConclusion[] {
  return analysis.candidates.filter((candidate) =>
    !conclusionDirectlyRestatesPremise(analysis.premises, candidate.conclusion));
}

export function bankingPossibilityDispositionV2(
  candidate: EvaluatedConclusion,
): BankingPossibilityDispositionV2 {
  if (
    candidate.profile.classification === "UNDETERMINED"
    && candidate.profile.canBeTrue
    && candidate.profile.canBeFalse
  ) {
    return "OPEN_POSSIBILITY";
  }
  if (candidate.profile.classification === "ENTAILED") {
    return "ALREADY_DEFINITE";
  }
  return "IMPOSSIBLE";
}

function follows(candidate: EvaluatedConclusion, mode: BankingConclusionModeV2): boolean {
  return mode === "POSSIBILITY"
    ? bankingPossibilityDispositionV2(candidate) === "OPEN_POSSIBILITY"
    : candidate.profile.classification === "ENTAILED";
}

function pairStatus(
  first: EvaluatedConclusion,
  firstMode: BankingConclusionModeV2,
  second: EvaluatedConclusion,
  secondMode: BankingConclusionModeV2,
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
  mode: BankingConclusionModeV2,
): readonly string[] {
  return mode === "POSSIBILITY"
    ? candidate.impactPremiseIds
    : candidate.verdictImpactPremiseIds;
}

function pairUsesAllPremises(
  analysis: ScenarioAnalysis,
  first: EvaluatedConclusion,
  firstMode: BankingConclusionModeV2,
  second: EvaluatedConclusion,
  secondMode: BankingConclusionModeV2,
): boolean {
  const impacted = new Set([
    ...impactedPremises(first, firstMode),
    ...impactedPremises(second, secondMode),
  ]);
  return analysis.premises.every((premise) => impacted.has(premise.premiseId));
}

function possibilityCandidateIsExamUseful(candidate: EvaluatedConclusion): boolean {
  return POSSIBILITY_FORMS.includes(candidate.conclusion.form);
}

function enumeratePairs(possibilityFirst: boolean): readonly SelectedPairV2[] {
  const result: SelectedPairV2[] = [];
  for (const group of BANKING_GROUPS) {
    for (const scenario of bankingScenarios(group)) {
      const analysis = analyzeScenario(scenario);
      const candidates = novelCandidates(analysis);
      const possibilities = candidates.filter(possibilityCandidateIsExamUseful);
      for (const possibility of possibilities) {
        for (const definite of candidates) {
          if (conclusionSemanticKey(possibility) === conclusionSemanticKey(definite)) continue;
          const first = possibilityFirst ? possibility : definite;
          const firstMode: BankingConclusionModeV2 = possibilityFirst ? "POSSIBILITY" : "DEFINITE";
          const second = possibilityFirst ? definite : possibility;
          const secondMode: BankingConclusionModeV2 = possibilityFirst ? "DEFINITE" : "POSSIBILITY";
          if (!pairUsesAllPremises(analysis, first, firstMode, second, secondMode)) continue;
          result.push({
            analysis,
            first,
            firstMode,
            second,
            secondMode,
            status: pairStatus(first, firstMode, second, secondMode),
            possibility,
          });
        }
      }
    }
  }
  return result;
}

function selectPair(seed: number): SelectedPairV2 {
  const possibilityFirst = Math.abs(seed) % 2 === 0;
  const targetStatus = TARGET_STATUSES[Math.abs(seed) % TARGET_STATUSES.length];
  const targetClass = TARGET_CLASSES[Math.floor(Math.abs(seed) / 4) % TARGET_CLASSES.length];
  const targetForm = POSSIBILITY_FORMS[Math.floor(Math.abs(seed) / 12) % POSSIBILITY_FORMS.length];
  const all = enumeratePairs(possibilityFirst);
  const byStatus = all.filter((entry) => entry.status === targetStatus);
  if (byStatus.length === 0) {
    throw new Error(`No V2 Banking pair exists for target status ${targetStatus}.`);
  }

  const exact = byStatus.filter((entry) =>
    entry.possibility.profile.classification === targetClass
    && entry.possibility.conclusion.form === targetForm);
  const classMatch = byStatus.filter((entry) =>
    entry.possibility.profile.classification === targetClass);
  const formMatch = byStatus.filter((entry) =>
    entry.possibility.conclusion.form === targetForm);
  const pool = exact.length > 0
    ? exact
    : classMatch.length > 0
      ? classMatch
      : formMatch.length > 0
        ? formMatch
        : byStatus;
  const random = createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-002:${seed}:selection`);
  return shuffle(pool, random)[Math.abs(seed) % pool.length];
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
    if (conclusion.form === "ALL") return `All ${subject} being ${predicate} is a possibility.`;
    if (conclusion.form === "SOME") return `Some ${subject} being ${predicate} is a possibility.`;
    if (conclusion.form === "SOME_NOT") return `Some ${subject} not being ${predicate} is a possibility.`;
  }
  if (locale === "hi-IN") {
    if (conclusion.form === "ALL") return `यह संभव है कि सभी ${subject} ${predicate} हों।`;
    if (conclusion.form === "SOME") return `यह संभव है कि कुछ ${subject} ${predicate} हों।`;
    if (conclusion.form === "SOME_NOT") return `यह संभव है कि कुछ ${subject} ${predicate} न हों।`;
  }
  if (conclusion.form === "ALL") return `ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਸਾਰੇ ${subject} ${predicate} ਹੋਣ।`;
  if (conclusion.form === "SOME") return `ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਕੁਝ ${subject} ${predicate} ਹੋਣ।`;
  if (conclusion.form === "SOME_NOT") return `ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਕੁਝ ${subject} ${predicate} ਨਾ ਹੋਣ।`;
  throw new Error(`Unsupported V2 possibility form ${conclusion.form}.`);
}

function renderSelectedConclusion(
  candidate: EvaluatedConclusion,
  mode: BankingConclusionModeV2,
  locale: SylLocale,
  assignment: TermAssignment,
): BankingPossibilityConclusionV2 {
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
    possibilityDisposition: mode === "POSSIBILITY"
      ? bankingPossibilityDispositionV2(candidate)
      : null,
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
  return shuffle(raw, createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-002:${seed}:options`))
    .map((entry, index) => ({ ...entry, optionId: `OPTION-${index + 1}` }));
}

function explanationLine(
  label: "I" | "II",
  conclusion: BankingPossibilityConclusionV2,
  locale: SylLocale,
): string {
  if (conclusion.mode === "POSSIBILITY") {
    if (locale === "hi-IN") {
      if (conclusion.possibilityDisposition === "OPEN_POSSIBILITY") {
        return `${label}: यह संबंध संभव है लेकिन निश्चित नहीं है; इसलिए बैंकिंग परीक्षा की संभावना-आधारित पद्धति में यह निष्कर्ष अनुसरण करता है।`;
      }
      if (conclusion.possibilityDisposition === "ALREADY_DEFINITE") {
        return `${label}: यह संबंध कथनों से पहले ही निश्चित है; इसलिए इसे केवल संभावना बताने वाला निष्कर्ष स्वीकार नहीं किया जाता।`;
      }
      return `${label}: कथन इस संबंध को असंभव बनाते हैं; इसलिए संभावना वाला निष्कर्ष अनुसरण नहीं करता।`;
    }
    if (locale === "pa-IN") {
      if (conclusion.possibilityDisposition === "OPEN_POSSIBILITY") {
        return `${label}: ਇਹ ਸੰਬੰਧ ਸੰਭਵ ਹੈ ਪਰ ਪੱਕਾ ਨਹੀਂ; ਇਸ ਲਈ ਬੈਂਕਿੰਗ ਪ੍ਰੀਖਿਆ ਦੀ ਸੰਭਾਵਨਾ-ਆਧਾਰਿਤ ਰੀਤ ਅਨੁਸਾਰ ਇਹ ਨਤੀਜਾ ਸਹੀ ਹੈ।`;
      }
      if (conclusion.possibilityDisposition === "ALREADY_DEFINITE") {
        return `${label}: ਇਹ ਸੰਬੰਧ ਕਥਨਾਂ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੈ; ਇਸ ਲਈ ਇਸ ਨੂੰ ਕੇਵਲ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ ਵਜੋਂ ਸਵੀਕਾਰ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ।`;
      }
      return `${label}: ਕਥਨ ਇਸ ਸੰਬੰਧ ਨੂੰ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ; ਇਸ ਲਈ ਸੰਭਾਵਨਾ ਵਾਲਾ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    if (conclusion.possibilityDisposition === "OPEN_POSSIBILITY") {
      return `${label}: The relation is possible but not definite, so the Banking possibility conclusion follows.`;
    }
    if (conclusion.possibilityDisposition === "ALREADY_DEFINITE") {
      return `${label}: The relation is already definite from the statements, so the Banking possibility conclusion is not accepted as a mere possibility.`;
    }
    return `${label}: The statements make the relation impossible, so the possibility conclusion does not follow.`;
  }

  if (locale === "hi-IN") {
    return conclusion.classification === "ENTAILED"
      ? `${label}: सामान्य निष्कर्ष हर वैध व्यवस्था में सत्य है, इसलिए यह अनुसरण करता है।`
      : `${label}: सामान्य निष्कर्ष हर वैध व्यवस्था में सत्य नहीं है, इसलिए यह अनुसरण नहीं करता।`;
  }
  if (locale === "pa-IN") {
    return conclusion.classification === "ENTAILED"
      ? `${label}: ਆਮ ਨਤੀਜਾ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਹੀ ਹੈ।`
      : `${label}: ਆਮ ਨਤੀਜਾ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }
  return conclusion.classification === "ENTAILED"
    ? `${label}: The ordinary conclusion is true in every valid arrangement, so it follows.`
    : `${label}: The ordinary conclusion is not true in every valid arrangement, so it does not follow.`;
}

export function generateBankingPossibilityShellV2(
  seed: number,
  locale: SylLocale,
): BankingPossibilityShellQuestionV2 {
  if (!Number.isSafeInteger(seed)) throw new Error("Seed must be a safe integer.");
  const selected = selectPair(seed);
  const assignment = assignTerms("SYL-QL-005", seed, selected.analysis.termOrder);
  const displayedPremises: readonly SurfacePremise[] = shuffle(
    selected.analysis.premises,
    createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-002:${seed}:premises`),
  );
  const statements = displayedPremises.map((premise) =>
    renderPremise(premise, locale, assignment));
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
    authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
    prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-002",
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
      possibilitySemanticProfile: "BANKING_EXAM_POSSIBILITY_V2",
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

export const SYL_BANKING_POSSIBILITY_SHELL_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
  status: "PROTOTYPE_NOT_REGISTERED",
  sourceArchetypeId: "SYL-A-BANK-POSSIBILITY-IN-CONCLUSION-SET",
  semanticAuthority: "BANKING_EXAM_POSSIBILITY_V2",
  allowedPossibilityForms: ["ALL", "SOME", "SOME_NOT"] as const,
  possibilityFollowsWhen: "UNDETERMINED && canBeTrue && canBeFalse",
  alreadyDefinitePossibilityAccepted: false,
  activationPermitted: false,
});
