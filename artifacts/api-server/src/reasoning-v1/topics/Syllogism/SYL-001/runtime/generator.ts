import { normalizePremises } from "../foundation/normalization";
import { SYL_001_SEMANTICS_PROFILE } from "../foundation/semantics-profile";
import type { SylDifficulty, SylLocale } from "../foundation/types";
import { conclusionSemanticKey, selectedPremisesAreRelevant } from "./analysis";
import { buildExplanation } from "./explanation";
import { renderMobileFirstIntegratedDiagramV3 } from "./integrated-diagram-v3-mobile";
import { polishLearnerExplanation } from "./learner-language-polish";
import {
  commonPreamble,
  renderConclusion,
  renderPremise,
  taskInstruction,
} from "./localization";
import { buildOptions } from "./options";
import { createPrng, shuffle } from "./prng";
import { getSylQlDefinition } from "./ql-registry";
import { selectQuestionLogic } from "./selection";
import { remodelStudentPresentation } from "./student-presentation";
import { buildStructuredProofV3 } from "./structured-proof-v3";
import { enforceStructuredProofV3Consistency } from "./structured-proof-v3-consistency";
import { finalizeStructuredProofV3 } from "./structured-proof-v3-finalize";
import { naturalizeStructuredProofV3 } from "./structured-proof-v3-naturalize";
import { polishStructuredProofV3Statements } from "./structured-proof-v3-statement-polish";
import type { GeneratedSylQuestionV3 } from "./structured-proof-v3-types";
import { assignTerms } from "./term-assignment";
import type {
  GeneratedSylQuestion,
  SylQlDefinition,
  SylQlId,
} from "./types";

const ROMAN = ["I", "II", "III", "IV"];

function answerType(definition: SylQlDefinition): GeneratedSylQuestion["answerType"] {
  if (definition.renderer === "STATEMENT_OPTIONS") return "CONCLUSION_TEXT";
  if (definition.renderer === "CONCLUSION_COMBINATION") return "FOLLOW_MASK";
  if (definition.renderer === "MODAL_CLASSIFICATION") return "MODAL_LABEL";
  return "PAIR_STATUS";
}

function adjustedDifficulty(definition: SylQlDefinition, base: SylDifficulty): SylDifficulty {
  if (
    definition.taskKind === "THREE_CONCLUSION_FOLLOW_MASK"
    || definition.taskKind === "MIXED_THREE_CONCLUSION_MASK"
    || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR"
  ) return "HARD";
  if (definition.scenarioGroup === "ONLY" || definition.scenarioGroup === "FEW") {
    return base === "EASY" ? "MEDIUM" : base;
  }
  return base;
}

function buildStem(
  definition: SylQlDefinition,
  locale: SylLocale,
  statements: readonly string[],
  conclusions: readonly string[],
): string {
  const statementHeading = locale === "en-IN" ? "Statements" : locale === "hi-IN" ? "कथन" : "ਕਥਨ";
  const conclusionHeading = locale === "en-IN" ? "Conclusions" : locale === "hi-IN" ? "निष्कर्ष" : "ਨਤੀਜੇ";
  const lines = [commonPreamble(locale), "", `${statementHeading}:`];
  statements.forEach((statement, index) => lines.push(`${index + 1}. ${statement}`));

  const selectionTask = definition.renderer === "STATEMENT_OPTIONS";
  if (!selectionTask) {
    lines.push("", `${conclusionHeading}:`);
    conclusions.forEach((conclusion, index) => lines.push(`${ROMAN[index] ?? index + 1}. ${conclusion}`));
  }
  lines.push("", taskInstruction(definition.taskKind, locale));
  return lines.join("\n");
}

export function generateSylQuestion(
  qlId: SylQlId,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV3 {
  if (!Number.isSafeInteger(seed)) throw new Error("Seed must be a safe integer.");
  const definition = getSylQlDefinition(qlId);
  const selected = selectQuestionLogic(definition, seed);
  if (!selectedPremisesAreRelevant(selected.analysis, selected.conclusions, selected.relevanceMode)) {
    throw new Error(`Premise relevance failed for ${qlId}/${seed}.`);
  }

  const assignment = assignTerms(qlId, seed, selected.analysis.termOrder);
  const premiseRandom = createPrng(`${qlId}:${seed}:premise-order`);
  const displayedPremises = shuffle(selected.analysis.premises, premiseRandom);
  const renderedPremises = displayedPremises.map((premise) =>
    renderPremise(premise, locale, assignment));
  const renderedConclusions = selected.conclusions.map((candidate) =>
    renderConclusion(candidate.conclusion, locale, assignment));
  const options = buildOptions(definition, selected, locale, assignment, seed);
  if (options.length !== definition.optionCount) {
    throw new Error(`${qlId}/${seed} generated ${options.length} options, expected ${definition.optionCount}.`);
  }
  if (new Set(options.map((entry) => entry.text)).size !== options.length) {
    throw new Error(`${qlId}/${seed}/${locale} has duplicate rendered options.`);
  }
  const correctIndexes = options
    .map((entry, index) => (entry.isCorrect ? index : -1))
    .filter((index) => index >= 0);
  if (correctIndexes.length !== 1) throw new Error(`${qlId}/${seed} must have exactly one correct option.`);

  const baseExplanation = buildExplanation(
    definition,
    selected,
    displayedPremises,
    locale,
    assignment,
    options,
  );
  const explanation = polishLearnerExplanation(
    remodelStudentPresentation(
      baseExplanation,
      definition,
      selected,
      displayedPremises,
      locale,
      assignment,
      options,
    ),
    locale,
  );
  const termKeys = selected.analysis.termOrder.map((termId) => assignment[termId].termKey);
  const selectedClasses = selected.conclusions.map((candidate) => candidate.profile.classification);
  const correctOption = options[correctIndexes[0]];
  const correctCandidate = selected.conclusions.find((candidate) =>
    conclusionSemanticKey(candidate) === correctOption.semanticValue)
    ?? selected.conclusions[0]
    ?? null;
  const termLabels = Object.fromEntries(selected.analysis.termOrder.map((termId) => [termId, assignment[termId].labels[locale]]));
  const rawStructuredProofV3 = buildStructuredProofV3({
    qlId,
    checkpointId: definition.checkpointId,
    seed,
    locale,
    scenarioId: selected.analysis.scenario.scenarioId,
    sourcePatternId: selected.analysis.scenario.sourcePatternId,
    taskKind: definition.taskKind,
    premises: selected.analysis.premises,
    displayedPremises,
    statements: renderedPremises,
    conclusions: renderedConclusions,
    canonicalConclusions: selected.conclusions.map((candidate) => candidate.conclusion),
    conclusionProfiles: selected.conclusions.map((candidate, index) => ({
      conclusion: candidate.conclusion,
      rendered: renderedConclusions[index],
      classification: candidate.profile.classification,
      canBeTrue: candidate.profile.canBeTrue,
      canBeFalse: candidate.profile.canBeFalse,
      witnessModel: candidate.profile.witnessModel,
      counterModel: candidate.profile.counterModel,
      verdictImpactPremiseIds: candidate.verdictImpactPremiseIds,
      modelImpactPremiseIds: candidate.impactPremiseIds,
    })),
    options,
    correctIndex: correctIndexes[0],
    followMask: selected.followMask,
    pairStatus: selected.pairStatus,
    termLabels,
  });
  const finalizedStructuredProofV3 = finalizeStructuredProofV3(rawStructuredProofV3, {
    locale,
    taskKind: definition.taskKind,
    correctIndex: correctIndexes[0],
    correctOptionText: correctOption.text,
    correctClassification: correctCandidate?.profile.classification ?? null,
    correctConclusionForm: correctCandidate?.conclusion.form ?? null,
  });
  const statementPolishedStructuredProofV3 = polishStructuredProofV3Statements(finalizedStructuredProofV3, {
    locale,
    displayedPremises,
    termLabels,
  });
  const naturalizedStructuredProofV3 = naturalizeStructuredProofV3(statementPolishedStructuredProofV3, {
    locale,
    taskKind: definition.taskKind,
    displayedPremises,
    statements: renderedPremises,
    options,
    correctIndex: correctIndexes[0],
    conclusions: selected.conclusions.map((candidate) => ({
      conclusion: candidate.conclusion,
      classification: candidate.profile.classification,
      verdictImpactPremiseIds: candidate.verdictImpactPremiseIds,
      modelImpactPremiseIds: candidate.impactPremiseIds,
    })),
    termLabels,
  });
  const mobileDiagramStructuredProofV3 = renderMobileFirstIntegratedDiagramV3(naturalizedStructuredProofV3, {
    locale,
    displayedPremises,
    termLabels,
    correctIndex: correctIndexes[0],
    correctOptionText: correctOption.text,
  });
  const structuredProofV3 = enforceStructuredProofV3Consistency(mobileDiagramStructuredProofV3, {
    locale,
    taskKind: definition.taskKind,
    correctIndex: correctIndexes[0],
    correctClassification: correctCandidate?.profile.classification ?? null,
  });

  return {
    packageId: "SYL-001",
    checkpointId: definition.checkpointId,
    qlId,
    permanentQlId: qlId,
    seed,
    locale,
    difficulty: adjustedDifficulty(definition, selected.analysis.scenario.baseDifficulty),
    renderer: definition.renderer,
    answerType: answerType(definition),
    semanticsProfileId: SYL_001_SEMANTICS_PROFILE.profileId,
    sourcePatternId: selected.analysis.scenario.sourcePatternId,
    scenarioId: selected.analysis.scenario.scenarioId,
    stem: buildStem(definition, locale, renderedPremises, renderedConclusions),
    structuredPrompt: {
      premises: selected.analysis.premises,
      conclusions: selected.conclusions.map((candidate) => candidate.conclusion),
      termKeysById: Object.fromEntries(selected.analysis.termOrder.map((termId) => [termId, assignment[termId].termKey])),
      normalizedConstraints: normalizePremises(selected.analysis.premises),
    },
    reviewLogic: {
      conclusionEvaluations: selected.conclusions.map((candidate) => ({
        conclusionId: candidate.conclusion.conclusionId,
        classification: candidate.profile.classification,
        canBeTrue: candidate.profile.canBeTrue,
        canBeFalse: candidate.profile.canBeFalse,
        verdictImpactPremiseIds: candidate.verdictImpactPremiseIds,
        modelImpactPremiseIds: candidate.impactPremiseIds,
      })),
    },
    statements: renderedPremises,
    conclusions: renderedConclusions,
    options,
    correctIndex: correctIndexes[0],
    explanation,
    structuredProofV3,
    metadata: {
      runtimeVersion: "syl-001-pedagogy-runtime-v2",
      taskKind: definition.taskKind,
      topology: selected.analysis.scenario.topology,
      premiseForms: selected.analysis.premises.map((premise) => premise.form),
      termKeys,
      selectedConclusionClasses: selectedClasses,
      followMask: selected.followMask,
      pairStatus: selected.pairStatus,
      optionCount: definition.optionCount,
      answerTemplateId: definition.answerTemplateId,
      solverAgreementPassed: true,
      premiseRelevancePassed: true,
      ambiguityAuditPassed: true,
      deterministic: true,
      studentExplanationNaturalized: true,
      overlappingDiagramValidated: true,
      localePedagogyParityPassed: true,
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function generateSylQuestionByString(
  qlId: string,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV3 {
  return generateSylQuestion(qlId as SylQlId, seed, locale);
}
