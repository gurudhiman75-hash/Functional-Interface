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

export type BankingCanNeverModeV1 = "DEFINITE" | "CAN_NEVER_BE";
export type BankingCanNeverSurfaceKindV1 =
  | "ALL_CAN_NEVER"
  | "SOME_CAN_NEVER";
export type BankingCanNeverDispositionV1 =
  | "FOLLOWS_IMPOSSIBLE_ALL"
  | "FOLLOWS_DEFINITE_SOME_NOT"
  | "DOES_NOT_FOLLOW";

export interface BankingCanNeverConclusionV1 {
  mode: BankingCanNeverModeV1;
  surfaceKind: BankingCanNeverSurfaceKindV1 | null;
  canonicalConclusion: CanonicalConclusion;
  text: string;
  follows: boolean;
  classification: EvaluatedConclusion["profile"]["classification"];
  canBeTrue: boolean;
  canBeFalse: boolean;
  disposition: BankingCanNeverDispositionV1 | null;
}

export interface BankingCanNeverShellQuestionV1 {
  authority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V1";
  prototypeId: "SYL-PROTOTYPE-BANK-CAN-NEVER-001";
  seed: number;
  locale: SylLocale;
  scenarioId: string;
  scenarioGroup: SylScenarioGroup;
  sourcePatternId: string;
  statements: readonly string[];
  conclusions: readonly BankingCanNeverConclusionV1[];
  options: readonly GeneratedSylOption[];
  correctIndex: number;
  semanticAnswer: PairSemanticStatus;
  explanation: readonly string[];
  metadata: {
    answerTemplateId: "BANK_FIVE_OPTION_V1";
    renderer: "CONCLUSION_COMBINATION";
    modalSemanticProfile: "BANKING_EXAM_CAN_NEVER_BE_V1";
    negativeModalConclusionCount: 1;
    definiteConclusionCount: 1;
    answerPositionPolicy: "EXACT_SEED_MOD_5_BALANCE_V1";
    sourceEvidenceLevel: "SECONDARY_BANKING_QUESTION_LEVEL";
    legacyQlChanged: false;
    registeredQlCreated: false;
    connectedToProfilePlanner: false;
    questionStudioVisible: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

interface NegativeCandidateV1 {
  candidate: EvaluatedConclusion;
  surfaceKind: BankingCanNeverSurfaceKindV1;
}

interface SelectedPairV1 {
  analysis: ScenarioAnalysis;
  first: EvaluatedConclusion;
  firstMode: BankingCanNeverModeV1;
  firstSurfaceKind: BankingCanNeverSurfaceKindV1 | null;
  second: EvaluatedConclusion;
  secondMode: BankingCanNeverModeV1;
  secondSurfaceKind: BankingCanNeverSurfaceKindV1 | null;
  status: PairSemanticStatus;
  negative: NegativeCandidateV1;
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

const NEGATIVE_KINDS: readonly BankingCanNeverSurfaceKindV1[] = [
  "ALL_CAN_NEVER",
  "SOME_CAN_NEVER",
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

function negativeCandidates(candidates: readonly EvaluatedConclusion[]): readonly NegativeCandidateV1[] {
  return candidates.flatMap((candidate): readonly NegativeCandidateV1[] => {
    if (candidate.conclusion.form === "ALL") {
      return [{ candidate, surfaceKind: "ALL_CAN_NEVER" }];
    }
    if (candidate.conclusion.form === "SOME_NOT") {
      return [{ candidate, surfaceKind: "SOME_CAN_NEVER" }];
    }
    return [];
  });
}

export function bankingCanNeverDispositionV1(
  candidate: EvaluatedConclusion,
  surfaceKind: BankingCanNeverSurfaceKindV1,
): BankingCanNeverDispositionV1 {
  if (surfaceKind === "ALL_CAN_NEVER") {
    return candidate.profile.canBeTrue === false
      ? "FOLLOWS_IMPOSSIBLE_ALL"
      : "DOES_NOT_FOLLOW";
  }
  return candidate.profile.classification === "ENTAILED"
    ? "FOLLOWS_DEFINITE_SOME_NOT"
    : "DOES_NOT_FOLLOW";
}

function follows(
  candidate: EvaluatedConclusion,
  mode: BankingCanNeverModeV1,
  surfaceKind: BankingCanNeverSurfaceKindV1 | null,
): boolean {
  if (mode === "DEFINITE") return candidate.profile.classification === "ENTAILED";
  if (!surfaceKind) throw new Error("CAN_NEVER_BE conclusion requires a surface kind.");
  return bankingCanNeverDispositionV1(candidate, surfaceKind) !== "DOES_NOT_FOLLOW";
}

function pairStatus(
  first: EvaluatedConclusion,
  firstMode: BankingCanNeverModeV1,
  firstSurfaceKind: BankingCanNeverSurfaceKindV1 | null,
  second: EvaluatedConclusion,
  secondMode: BankingCanNeverModeV1,
  secondSurfaceKind: BankingCanNeverSurfaceKindV1 | null,
): PairSemanticStatus {
  const firstFollows = follows(first, firstMode, firstSurfaceKind);
  const secondFollows = follows(second, secondMode, secondSurfaceKind);
  if (firstFollows && secondFollows) return "BOTH_FOLLOW";
  if (firstFollows) return "ONLY_FIRST_FOLLOWS";
  if (secondFollows) return "ONLY_SECOND_FOLLOWS";
  return "NEITHER_FOLLOWS";
}

function pairUsesAllPremises(
  analysis: ScenarioAnalysis,
  first: EvaluatedConclusion,
  second: EvaluatedConclusion,
): boolean {
  const impacted = new Set([
    ...first.verdictImpactPremiseIds,
    ...second.verdictImpactPremiseIds,
  ]);
  return analysis.premises.every((premise) => impacted.has(premise.premiseId));
}

function enumeratePairs(negativeFirst: boolean): readonly SelectedPairV1[] {
  const result: SelectedPairV1[] = [];
  for (const group of BANKING_GROUPS) {
    for (const scenario of bankingScenarios(group)) {
      const analysis = analyzeScenario(scenario);
      const candidates = novelCandidates(analysis);
      for (const negative of negativeCandidates(candidates)) {
        for (const definite of candidates) {
          if (conclusionSemanticKey(negative.candidate) === conclusionSemanticKey(definite)) continue;
          const first = negativeFirst ? negative.candidate : definite;
          const firstMode: BankingCanNeverModeV1 = negativeFirst ? "CAN_NEVER_BE" : "DEFINITE";
          const firstSurfaceKind = negativeFirst ? negative.surfaceKind : null;
          const second = negativeFirst ? definite : negative.candidate;
          const secondMode: BankingCanNeverModeV1 = negativeFirst ? "DEFINITE" : "CAN_NEVER_BE";
          const secondSurfaceKind = negativeFirst ? null : negative.surfaceKind;
          if (!pairUsesAllPremises(analysis, first, second)) continue;
          result.push({
            analysis,
            first,
            firstMode,
            firstSurfaceKind,
            second,
            secondMode,
            secondSurfaceKind,
            status: pairStatus(
              first,
              firstMode,
              firstSurfaceKind,
              second,
              secondMode,
              secondSurfaceKind,
            ),
            negative,
          });
        }
      }
    }
  }
  return result;
}

function selectPair(seed: number): SelectedPairV1 {
  const normalizedSeed = Math.abs(seed);
  const negativeFirst = normalizedSeed % 2 === 0;
  const targetStatus = TARGET_STATUSES[normalizedSeed % TARGET_STATUSES.length];
  const targetKind = NEGATIVE_KINDS[Math.floor(normalizedSeed / 4) % NEGATIVE_KINDS.length];
  const all = enumeratePairs(negativeFirst);
  if (all.length === 0) throw new Error("No Banking can-never-be pair is available.");

  const byStatus = all.filter((entry) => entry.status === targetStatus);
  const statusPool = byStatus.length > 0 ? byStatus : all;
  const byKind = statusPool.filter((entry) => entry.negative.surfaceKind === targetKind);
  const pool = byKind.length > 0 ? byKind : statusPool;
  const random = createPrng(`SYL-PROTOTYPE-BANK-CAN-NEVER-001:${seed}:selection`);
  return shuffle(pool, random)[normalizedSeed % pool.length];
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

function renderCanNeverConclusion(
  conclusion: CanonicalConclusion,
  surfaceKind: BankingCanNeverSurfaceKindV1,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = termLabel(conclusion, "subject", locale, assignment);
  const predicate = termLabel(conclusion, "predicate", locale, assignment);

  if (locale === "en-IN") {
    return surfaceKind === "ALL_CAN_NEVER"
      ? `All ${subject} can never be ${predicate}.`
      : `Some ${subject} can never be ${predicate}.`;
  }
  if (locale === "hi-IN") {
    return surfaceKind === "ALL_CAN_NEVER"
      ? `सभी ${subject} कभी भी ${predicate} नहीं हो सकते।`
      : `कुछ ${subject} कभी भी ${predicate} नहीं हो सकते।`;
  }
  return surfaceKind === "ALL_CAN_NEVER"
    ? `ਸਾਰੇ ${subject} ਕਦੇ ਵੀ ${predicate} ਨਹੀਂ ਹੋ ਸਕਦੇ।`
    : `ਕੁਝ ${subject} ਕਦੇ ਵੀ ${predicate} ਨਹੀਂ ਹੋ ਸਕਦੇ।`;
}

function renderSelectedConclusion(
  candidate: EvaluatedConclusion,
  mode: BankingCanNeverModeV1,
  surfaceKind: BankingCanNeverSurfaceKindV1 | null,
  locale: SylLocale,
  assignment: TermAssignment,
): BankingCanNeverConclusionV1 {
  return {
    mode,
    surfaceKind,
    canonicalConclusion: candidate.conclusion,
    text: mode === "CAN_NEVER_BE"
      ? renderCanNeverConclusion(candidate.conclusion, surfaceKind!, locale, assignment)
      : renderConclusion(candidate.conclusion, locale, assignment),
    follows: follows(candidate, mode, surfaceKind),
    classification: candidate.profile.classification,
    canBeTrue: candidate.profile.canBeTrue,
    canBeFalse: candidate.profile.canBeFalse,
    disposition: mode === "CAN_NEVER_BE"
      ? bankingCanNeverDispositionV1(candidate, surfaceKind!)
      : null,
  };
}

export function buildBalancedBankingPairOptionsV1(
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
  const correct = raw.find((entry) => entry.isCorrect);
  if (!correct) throw new Error(`Missing correct option for ${status}.`);
  const distractors = shuffle(
    raw.filter((entry) => !entry.isCorrect),
    createPrng(`SYL-PROTOTYPE-BANK-CAN-NEVER-001:${seed}:distractors`),
  );
  const targetIndex = Math.abs(seed) % raw.length;
  const ordered = [...distractors];
  ordered.splice(targetIndex, 0, correct);
  return ordered.map((entry, index) => ({ ...entry, optionId: `OPTION-${index + 1}` }));
}

function explanationLine(
  label: "I" | "II",
  conclusion: BankingCanNeverConclusionV1,
  locale: SylLocale,
): string {
  if (conclusion.mode === "CAN_NEVER_BE") {
    if (locale === "hi-IN") {
      if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
        return conclusion.follows
          ? `${label}: कम-से-कम एक सदस्य को बाहर रहना ही पड़ेगा, इसलिए सभी सदस्यों का यह संबंध असंभव है; निष्कर्ष अनुसरण करता है।`
          : `${label}: सभी सदस्यों का यह संबंध कम-से-कम एक वैध व्यवस्था में संभव है, इसलिए “can never be” निश्चित नहीं है।`;
      }
      return conclusion.follows
        ? `${label}: कम-से-कम एक सदस्य का बाहर रहना निश्चित है; इसलिए “some ... can never be ...” निष्कर्ष अनुसरण करता है।`
        : `${label}: ऐसा कोई निश्चित बाहर रहने वाला सदस्य सिद्ध नहीं होता; इसलिए निष्कर्ष अनुसरण नहीं करता।`;
    }
    if (locale === "pa-IN") {
      if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
        return conclusion.follows
          ? `${label}: ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ਬਾਹਰ ਰਹਿਣਾ ਹੀ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ ਇਹ ਸੰਬੰਧ ਅਸੰਭਵ ਹੈ; ਨਤੀਜਾ ਸਹੀ ਹੈ।`
          : `${label}: ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ ਇਹ ਸੰਬੰਧ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸੰਭਵ ਹੈ, ਇਸ ਲਈ “can never be” ਪੱਕਾ ਨਹੀਂ ਹੈ।`;
      }
      return conclusion.follows
        ? `${label}: ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਦਾ ਬਾਹਰ ਰਹਿਣਾ ਪੱਕਾ ਹੈ; ਇਸ ਲਈ “some ... can never be ...” ਨਤੀਜਾ ਸਹੀ ਹੈ।`
        : `${label}: ਕੋਈ ਪੱਕਾ ਬਾਹਰ ਰਹਿਣ ਵਾਲਾ ਮੈਂਬਰ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ; ਇਸ ਲਈ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
      return conclusion.follows
        ? `${label}: At least one subject must remain outside the predicate, so putting all subjects inside the predicate is impossible; the conclusion follows.`
        : `${label}: All subjects can still be inside the predicate in at least one valid arrangement, so “can never be” is not proved.`;
    }
    return conclusion.follows
      ? `${label}: At least one subject is forced to stay outside the predicate, so the “some ... can never be ...” conclusion follows.`
      : `${label}: No subject is forced to stay outside the predicate in every valid arrangement, so the conclusion does not follow.`;
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

export function generateBankingCanNeverShellV1(
  seed: number,
  locale: SylLocale,
): BankingCanNeverShellQuestionV1 {
  if (!Number.isSafeInteger(seed)) throw new Error("Seed must be a safe integer.");
  const selected = selectPair(seed);
  const assignment = assignTerms("SYL-QL-005", seed, selected.analysis.termOrder);
  const displayedPremises: readonly SurfacePremise[] = shuffle(
    selected.analysis.premises,
    createPrng(`SYL-PROTOTYPE-BANK-CAN-NEVER-001:${seed}:premises`),
  );
  const statements = displayedPremises.map((premise) =>
    renderPremise(premise, locale, assignment));
  const conclusions = [
    renderSelectedConclusion(
      selected.first,
      selected.firstMode,
      selected.firstSurfaceKind,
      locale,
      assignment,
    ),
    renderSelectedConclusion(
      selected.second,
      selected.secondMode,
      selected.secondSurfaceKind,
      locale,
      assignment,
    ),
  ] as const;
  const options = buildBalancedBankingPairOptionsV1(selected.status, locale, seed);
  const correctIndexes = options
    .map((entry, index) => entry.isCorrect ? index : -1)
    .filter((index) => index >= 0);
  if (correctIndexes.length !== 1) throw new Error(`Seed ${seed} must have one correct option.`);

  return {
    authority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V1",
    prototypeId: "SYL-PROTOTYPE-BANK-CAN-NEVER-001",
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
      modalSemanticProfile: "BANKING_EXAM_CAN_NEVER_BE_V1",
      negativeModalConclusionCount: 1,
      definiteConclusionCount: 1,
      answerPositionPolicy: "EXACT_SEED_MOD_5_BALANCE_V1",
      sourceEvidenceLevel: "SECONDARY_BANKING_QUESTION_LEVEL",
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

export const SYL_BANKING_CAN_NEVER_BE_SHELL_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V1",
  status: "PROTOTYPE_NOT_REGISTERED",
  sourceArchetypeId: "SYL-A-BANK-CAN-NEVER-IN-CONCLUSION-SET",
  semanticAuthority: "BANKING_EXAM_CAN_NEVER_BE_V1",
  surfaceKinds: ["ALL_CAN_NEVER", "SOME_CAN_NEVER"] as const,
  allCanNeverRule: "underlying ALL has canBeTrue === false",
  someCanNeverRule: "underlying SOME_NOT is ENTAILED",
  answerPositionPolicy: "EXACT_SEED_MOD_5_BALANCE_V1",
  activationPermitted: false,
});
