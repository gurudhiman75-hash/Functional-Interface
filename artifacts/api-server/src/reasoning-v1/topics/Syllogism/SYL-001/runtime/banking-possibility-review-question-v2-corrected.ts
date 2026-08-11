import type { SurfacePremise, SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  renderBankingPossibilityCombinedDiagramV3,
  type BankingPossibilityCombinedDiagramV3,
} from "./banking-possibility-combined-diagram-v3";
import {
  renderBankingFourTermPremiseVennV4,
  type BankingFourTermDiagramV4,
} from "./banking-possibility-four-term-venn-v4";
import type {
  BankingPossibilityConclusionV1,
  BankingPossibilityShellQuestionV1,
} from "./banking-possibility-shell-v1";
import {
  generateBankingPossibilityShellV2,
  type BankingPossibilityConclusionV2,
  type BankingPossibilityShellQuestionV2,
} from "./banking-possibility-shell-v2";
import { renderPremise } from "./localization";
import { createPrng, shuffle } from "./prng";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";
import type { GeneratedSylOption, PairSemanticStatus } from "./types";

export type BankingPossibilityCorrectedDiagramV2 =
  | BankingPossibilityCombinedDiagramV3
  | BankingFourTermDiagramV4;

export type BankingPossibilityReviewQuestionV2Corrected =
  BankingPossibilityShellQuestionV2 & {
    diagram: BankingPossibilityCorrectedDiagramV2;
  };

function legacyDiagramFollows(conclusion: BankingPossibilityConclusionV2): boolean {
  // The inherited renderer is used only to choose a premise-safe geometry.
  // For that purpose it needs the underlying logical possibility, not the
  // Banking V2 exam convention that rejects an already-definite statement
  // when it is worded as "a possibility".
  return conclusion.mode === "POSSIBILITY"
    ? conclusion.canBeTrue
    : conclusion.classification === "ENTAILED";
}

function pairStatus(first: boolean, second: boolean): PairSemanticStatus {
  if (first && second) return "BOTH_FOLLOW";
  if (first) return "ONLY_FIRST_FOLLOWS";
  if (second) return "ONLY_SECOND_FOLLOWS";
  return "NEITHER_FOLLOWS";
}

function legacyConclusion(
  conclusion: BankingPossibilityConclusionV2,
): BankingPossibilityConclusionV1 {
  return {
    mode: conclusion.mode,
    canonicalConclusion: conclusion.canonicalConclusion,
    text: conclusion.text,
    follows: legacyDiagramFollows(conclusion),
    classification: conclusion.classification,
    canBeTrue: conclusion.canBeTrue,
    canBeFalse: conclusion.canBeFalse,
    witnessModelAvailable: conclusion.witnessModelAvailable,
    counterModelAvailable: conclusion.counterModelAvailable,
  };
}

function legacyDiagramCarrier(
  question: BankingPossibilityShellQuestionV2,
): BankingPossibilityShellQuestionV1 {
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) =>
    entry.scenarioId === question.scenarioId);
  if (!scenario) {
    throw new Error(`${question.scenarioId}: scenario missing for V2 corrected diagram bridge.`);
  }

  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", question.seed, analysis.termOrder);

  // Recreate the V1 presentation order because the inherited V3 renderer
  // validates/builds its private carrier using the V1 deterministic salt.
  // The returned diagram is premise-only; the V2 learner question retains
  // its own statements, conclusion semantics, options and answer unchanged.
  const displayedPremises: readonly SurfacePremise[] = shuffle(
    analysis.premises,
    createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-001:${question.seed}:premises`),
  );
  const statements = displayedPremises.map((premise) =>
    renderPremise(premise, question.locale, assignment));

  const conclusions = question.conclusions.map(legacyConclusion);
  if (conclusions.length !== 2) {
    throw new Error(`${question.seed}/${question.locale}: expected two Banking conclusions.`);
  }
  const semanticAnswer = pairStatus(
    conclusions[0]?.follows ?? false,
    conclusions[1]?.follows ?? false,
  );
  const options: readonly GeneratedSylOption[] = question.options.map((option) => ({
    ...option,
    isCorrect: option.semanticValue === semanticAnswer,
    errorLabel: option.semanticValue === semanticAnswer ? null : "WRONG_COMBINATION_LABEL",
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) {
    throw new Error(`${question.seed}/${question.locale}: no carrier option for ${semanticAnswer}.`);
  }

  return {
    authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
    prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-001",
    seed: question.seed,
    locale: question.locale,
    scenarioId: question.scenarioId,
    scenarioGroup: question.scenarioGroup,
    sourcePatternId: question.sourcePatternId,
    statements,
    conclusions,
    options,
    correctIndex,
    semanticAnswer,
    explanation: [],
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

function correctedDiagram(
  question: BankingPossibilityShellQuestionV2,
): BankingPossibilityCorrectedDiagramV2 {
  const carrier = legacyDiagramCarrier(question);
  const inherited = renderBankingPossibilityCombinedDiagramV3(carrier);
  if (inherited.enabled) return inherited;

  if (question.scenarioId === "SYL-SC-CORE-009") {
    return renderBankingFourTermPremiseVennV4(carrier);
  }

  throw new Error(
    `${question.seed}/${question.locale}/${question.scenarioId}: corrected V2 diagram remained omitted.`,
  );
}

export function generateBankingPossibilityReviewQuestionV2Corrected(
  seed: number,
  locale: SylLocale,
): BankingPossibilityReviewQuestionV2Corrected {
  const question = generateBankingPossibilityShellV2(seed, locale);
  return {
    ...question,
    diagram: correctedDiagram(question),
  };
}
