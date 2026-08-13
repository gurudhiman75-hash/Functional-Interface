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
  bankingCanNeverDispositionV1,
  buildBalancedBankingPairOptionsV1,
  type BankingCanNeverConclusionV1,
  type BankingCanNeverDispositionV1,
  type BankingCanNeverModeV1,
  type BankingCanNeverSurfaceKindV1,
} from "./banking-can-never-be-shell-v1";
import {
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

export interface BankingCanNeverShellQuestionV2 {
  authority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2";
  prototypeId: "SYL-PROTOTYPE-BANK-CAN-NEVER-002";
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
    selectionPolicy: "ORTHOGONAL_STATUS_POSITION_KIND_GRID_V2";
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

interface NegativeCandidateV2 {
  candidate: EvaluatedConclusion;
  surfaceKind: BankingCanNeverSurfaceKindV1;
}

interface SelectedPairV2 {
  analysis: ScenarioAnalysis;
  first: EvaluatedConclusion;
  firstMode: BankingCanNeverModeV1;
  firstSurfaceKind: BankingCanNeverSurfaceKindV1 | null;
  second: EvaluatedConclusion;
  secondMode: BankingCanNeverModeV1;
  secondSurfaceKind: BankingCanNeverSurfaceKindV1 | null;
  status: PairSemanticStatus;
  negative: NegativeCandidateV2;
}

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

function negativeCandidates(candidates: readonly EvaluatedConclusion[]): readonly NegativeCandidateV2[] {
  return candidates.flatMap((candidate): readonly NegativeCandidateV2[] => {
    if (candidate.conclusion.form === "ALL") {
      return [{ candidate, surfaceKind: "ALL_CAN_NEVER" }];
    }
    if (candidate.conclusion.form === "SOME_NOT") {
      return [{ candidate, surfaceKind: "SOME_CAN_NEVER" }];
    }
    return [];
  });
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

function enumeratePairs(negativeFirst: boolean): readonly SelectedPairV2[] {
  const result: SelectedPairV2[] = [];
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

function selectPair(seed: number): SelectedPairV2 {
  const normalizedSeed = Math.abs(seed);
  const targetStatus = TARGET_STATUSES[normalizedSeed % TARGET_STATUSES.length];
  const negativeFirst = Math.floor(normalizedSeed / 4) % 2 === 0;
  const targetKind = NEGATIVE_KINDS[Math.floor(normalizedSeed / 8) % NEGATIVE_KINDS.length];
  const exact = enumeratePairs(negativeFirst).filter((entry) =>
    entry.status === targetStatus && entry.negative.surfaceKind === targetKind);

  if (exact.length === 0) {
    throw new Error(
      `Missing V2 Banking pair for status=${targetStatus}, negativeFirst=${negativeFirst}, kind=${targetKind}.`,
    );
  }

  const random = createPrng(`SYL-PROTOTYPE-BANK-CAN-NEVER-002:${seed}:selection`);
  return shuffle(exact, random)[Math.floor(normalizedSeed / 16) % exact.length];
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
  let disposition: BankingCanNeverDispositionV1 | null = null;
  if (mode === "CAN_NEVER_BE") {
    if (!surfaceKind) throw new Error("CAN_NEVER_BE conclusion requires a surface kind.");
    disposition = bankingCanNeverDispositionV1(candidate, surfaceKind);
  }

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
    disposition,
  };
}

function semanticExplanation(
  label: "I" | "II",
  conclusion: BankingCanNeverConclusionV1,
  locale: SylLocale,
): string {
  if (locale === "hi-IN") {
    return conclusion.follows
      ? `${label}: यह निष्कर्ष solver profile के अनुसार अनुसरण करता है; learner-facing कारण editorial layer में दिया जाएगा।`
      : `${label}: यह निष्कर्ष solver profile के अनुसार अनुसरण नहीं करता; learner-facing कारण editorial layer में दिया जाएगा।`;
  }
  if (locale === "pa-IN") {
    return conclusion.follows
      ? `${label}: ਇਹ ਨਤੀਜਾ solver profile ਅਨੁਸਾਰ ਸਹੀ ਹੈ; learner-facing ਕਾਰਨ editorial layer ਵਿੱਚ ਦਿੱਤਾ ਜਾਵੇਗਾ।`
      : `${label}: ਇਹ ਨਤੀਜਾ solver profile ਅਨੁਸਾਰ ਸਹੀ ਨਹੀਂ ਹੈ; learner-facing ਕਾਰਨ editorial layer ਵਿੱਚ ਦਿੱਤਾ ਜਾਵੇਗਾ।`;
  }
  return conclusion.follows
    ? `${label}: This conclusion follows under the solver profile; learner-facing reasoning is supplied by the editorial layer.`
    : `${label}: This conclusion does not follow under the solver profile; learner-facing reasoning is supplied by the editorial layer.`;
}

export function generateBankingCanNeverShellV2(
  seed: number,
  locale: SylLocale,
): BankingCanNeverShellQuestionV2 {
  if (!Number.isSafeInteger(seed)) throw new Error("Seed must be a safe integer.");
  const selected = selectPair(seed);
  const assignment = assignTerms("SYL-QL-005", seed, selected.analysis.termOrder);
  const displayedPremises: readonly SurfacePremise[] = shuffle(
    selected.analysis.premises,
    createPrng(`SYL-PROTOTYPE-BANK-CAN-NEVER-002:${seed}:premises`),
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
    authority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
    prototypeId: "SYL-PROTOTYPE-BANK-CAN-NEVER-002",
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
      semanticExplanation("I", conclusions[0], locale),
      semanticExplanation("II", conclusions[1], locale),
    ],
    metadata: {
      answerTemplateId: "BANK_FIVE_OPTION_V1",
      renderer: "CONCLUSION_COMBINATION",
      modalSemanticProfile: "BANKING_EXAM_CAN_NEVER_BE_V1",
      negativeModalConclusionCount: 1,
      definiteConclusionCount: 1,
      answerPositionPolicy: "EXACT_SEED_MOD_5_BALANCE_V1",
      selectionPolicy: "ORTHOGONAL_STATUS_POSITION_KIND_GRID_V2",
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

export const SYL_BANKING_CAN_NEVER_BE_SHELL_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  status: "PROTOTYPE_NOT_REGISTERED",
  semanticAuthority: "BANKING_EXAM_CAN_NEVER_BE_V1",
  selectionPolicy: "ORTHOGONAL_STATUS_POSITION_KIND_GRID_V2",
  targetGrid: "4 statuses x 2 modal positions x 2 modal kinds",
  fallbackPermitted: false,
  activationPermitted: false,
});
