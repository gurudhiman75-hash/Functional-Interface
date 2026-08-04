import type {
  CanonicalConclusion,
  CanonicalModel,
  InternalConclusionClass,
  SurfacePremise,
  SylLocale,
} from "../../foundation/types";
import { conclusionSemanticKey } from "../analysis";
import type { TermAssignment } from "../localization";
import type { SelectedLogic } from "../selection";
import type {
  GeneratedSylOptionV3,
  SylCorrectOptionProofV3,
  SylLogicalStatusV3,
  SylOptionProofEvidenceV3,
  SylProofModelSnapshotV3,
  SylProofTypeV3,
  SylReasonCodeV3,
  SylStatementMeaningV3,
  SylTaskDispositionV3,
  SylVisibleOptionAnalysisV3,
  SylCombinedDiagramModeV3,
} from "./types";
import { classificationToLogicalStatus } from "./types";
import {
  combinedRelationIntro,
  correctProofSentence,
  optionPrefix,
  premiseMeaning,
  renderedConclusion,
  renderedPremise,
  studentVerdict,
} from "./localization";
import type { SylQlDefinition } from "../types";

export interface SylStructuredProofCoreV3 {
  readonly statementMeanings: readonly SylStatementMeaningV3[];
  readonly combinedRelation: string;
  readonly optionAnalysis: readonly SylVisibleOptionAnalysisV3[];
  readonly correctOptionProof: SylCorrectOptionProofV3;
  readonly fastRule: { readonly symbolic: string; readonly naturalLanguage: string };
  readonly decisivePremiseIds: readonly string[];
  readonly focusedConclusions: readonly CanonicalConclusion[];
  readonly satisfyingModel: SylProofModelSnapshotV3 | null;
  readonly counterModel: SylProofModelSnapshotV3 | null;
  readonly diagramMode: SylCombinedDiagramModeV3;
}

function modelSnapshot(
  model: CanonicalModel | null,
  purpose: SylProofModelSnapshotV3["purpose"],
  locale: SylLocale,
  assignment: TermAssignment,
  modelId: string,
): SylProofModelSnapshotV3 | null {
  if (!model) return null;
  return Object.freeze({
    modelId,
    purpose,
    source: model,
    occupiedRegions: Object.freeze(model.occupiedRegions.map((region, index) => Object.freeze({
      witnessId: `x${index + 1}`,
      memberTermIds: Object.freeze([...region.memberTerms]),
      memberLabels: Object.freeze(region.memberTerms.map((termId) => assignment[termId]?.labels[locale] ?? termId)),
    }))),
  });
}

function decisivePremiseIds(
  candidate: SelectedLogic["conclusions"][number],
  premises: readonly SurfacePremise[],
): readonly string[] {
  const ids = candidate.verdictImpactPremiseIds.length > 0
    ? candidate.verdictImpactPremiseIds
    : candidate.impactPremiseIds.length > 0
      ? candidate.impactPremiseIds
      : premises.map((premise) => premise.premiseId);
  return Object.freeze([...new Set(ids)]);
}

function displayedPremiseNumbers(
  ids: readonly string[],
  premises: readonly SurfacePremise[],
): readonly number[] {
  return Object.freeze(ids
    .map((id) => premises.findIndex((premise) => premise.premiseId === id))
    .filter((index) => index >= 0)
    .map((index) => index + 1));
}

function premiseReference(
  ids: readonly string[],
  premises: readonly SurfacePremise[],
  locale: SylLocale,
): string {
  const numbers = displayedPremiseNumbers(ids, premises);
  const joined = numbers.join(locale === "en-IN" ? " and " : locale === "hi-IN" ? " और " : " ਅਤੇ ");
  if (locale === "hi-IN") return numbers.length > 1 ? `कथन ${joined}` : `कथन ${joined}`;
  if (locale === "pa-IN") return `ਕਥਨ ${joined}`;
  return `Statement${numbers.length === 1 ? "" : "s"} ${joined}`;
}

function proofRoute(
  classification: InternalConclusionClass,
  premises: readonly SurfacePremise[],
): { proofType: SylProofTypeV3; reasonCode: SylReasonCodeV3 } {
  if (classification === "CONTRADICTED") {
    return { proofType: "CONTRADICTION", reasonCode: "DIRECT_CONTRADICTION" };
  }
  if (classification === "UNDETERMINED") {
    return { proofType: "TWO_STATE_MODAL_PROOF", reasonCode: "POSSIBILITY_NOT_CERTAINTY" };
  }
  if (premises.some((premise) => premise.form === "ONLY")) {
    return { proofType: "TRANSITIVE_CHAIN", reasonCode: "ONLY_DIRECTION" };
  }
  if (premises.some((premise) => premise.form === "ONLY_A_FEW")) {
    return { proofType: "WITNESS_TRANSFER", reasonCode: "ONLY_A_FEW_DUAL_FACT" };
  }
  if (premises.some((premise) => premise.form === "NOT_ALL")) {
    return { proofType: "WITNESS_TRANSFER", reasonCode: "NOT_ALL_NORMALIZATION" };
  }
  const hasExistential = premises.some((premise) => ["SOME", "A_FEW", "SOME_NOT", "NOT_ALL", "ONLY_A_FEW"].includes(premise.form));
  const hasUniversal = premises.some((premise) => ["ALL", "NO", "ONLY", "ARE_ONLY", "IDENTITY"].includes(premise.form));
  if (hasExistential && hasUniversal) {
    return { proofType: "WITNESS_TRANSFER", reasonCode: "FORCED_WITNESS_TRANSFER" };
  }
  if (premises.filter((premise) => ["ALL", "ARE_ONLY", "IDENTITY"].includes(premise.form)).length >= 2) {
    return { proofType: "TRANSITIVE_CHAIN", reasonCode: "TRANSITIVE_INCLUSION" };
  }
  if (premises.some((premise) => premise.form === "NO")) {
    return { proofType: "TRANSITIVE_CHAIN", reasonCode: "INCLUSION_THROUGH_DISJOINTNESS" };
  }
  return { proofType: "DIRECT_PREMISE", reasonCode: "FORCED_WITNESS_TRANSFER" };
}

function conclusionReason(
  conclusion: CanonicalConclusion,
  classification: InternalConclusionClass,
  ids: readonly string[],
  premises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const rendered = renderedConclusion(conclusion, locale, assignment);
  const references = premiseReference(ids, premises, locale);
  const statements = premises
    .filter((premise) => ids.includes(premise.premiseId))
    .map((premise) => renderedPremise(premise, locale, assignment));
  if (locale === "hi-IN") {
    if (classification === "ENTAILED") {
      return `${references} को जोड़ने पर “${rendered}” हर सही व्यवस्था में सत्य रहता है। निर्णायक संबंध: ${statements.join("; ")}।`;
    }
    if (classification === "CONTRADICTED") {
      return `“${rendered}” के लिए जो संबंध चाहिए, उसे ${references} रोकते हैं। इसलिए यह किसी भी सही व्यवस्था में सत्य नहीं हो सकता।`;
    }
    return `${references} “${rendered}” को अनिवार्य नहीं बनाते। एक सही व्यवस्था में यह सत्य और दूसरी में असत्य हो सकता है।`;
  }
  if (locale === "pa-IN") {
    if (classification === "ENTAILED") {
      return `${references} ਨੂੰ ਜੋੜਨ ਉੱਤੇ “${rendered}” ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਰਹਿੰਦਾ ਹੈ। ਫੈਸਲਾ ਕਰਨ ਵਾਲਾ ਸੰਬੰਧ: ${statements.join("; ")}।`;
    }
    if (classification === "CONTRADICTED") {
      return `“${rendered}” ਲਈ ਲੋੜੀਂਦਾ ਸੰਬੰਧ ${references} ਰੋਕਦੇ ਹਨ। ਇਸ ਲਈ ਇਹ ਕਿਸੇ ਵੀ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦਾ।`;
    }
    return `${references} “${rendered}” ਨੂੰ ਲਾਜ਼ਮੀ ਨਹੀਂ ਬਣਾਉਂਦੇ। ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਇਹ ਸਹੀ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ।`;
  }
  if (classification === "ENTAILED") {
    return `${references} force “${rendered}” in every valid arrangement. The decisive statements are: ${statements.join("; ")}.`;
  }
  if (classification === "CONTRADICTED") {
    return `“${rendered}” requires a relation that ${references} block, so it cannot be true in any valid arrangement.`;
  }
  return `${references} do not force “${rendered}”. It can be true in one valid arrangement and false in another.`;
}

function taskDisposition(
  optionIsCorrect: boolean,
  logicalStatus: SylLogicalStatusV3,
): SylTaskDispositionV3 {
  if (optionIsCorrect) return "CORRECT_FOR_TASK";
  if (logicalStatus === "ENTAILED") return "TRUE_BUT_NOT_REQUESTED";
  return "WRONG_FOR_TASK";
}

function requiredRelation(conclusion: CanonicalConclusion): string {
  return `${conclusion.form}(${conclusion.subject},${conclusion.predicate})`;
}

function candidateEvidence(
  candidate: SelectedLogic["conclusions"][number],
  ids: readonly string[],
  premises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
  modelPrefix: string,
): SylOptionProofEvidenceV3 {
  const relevant = premises.filter((premise) => ids.includes(premise.premiseId));
  const route = proofRoute(candidate.profile.classification, relevant);
  const satisfying = modelSnapshot(
    candidate.profile.witnessModel,
    "SATISFIES_CORRECT_OPTION",
    locale,
    assignment,
    `${modelPrefix}-true`,
  );
  const counter = modelSnapshot(
    candidate.profile.counterModel,
    "FALSIFIES_CORRECT_OPTION",
    locale,
    assignment,
    `${modelPrefix}-false`,
  );
  return Object.freeze({
    proofType: route.proofType,
    reasonCode: route.reasonCode,
    decisivePremiseIds: ids,
    requiredRelation: requiredRelation(candidate.conclusion),
    blockedOrFreeRelation: candidate.profile.classification === "ENTAILED"
      ? null
      : requiredRelation(candidate.conclusion),
    witnessIds: Object.freeze([
      ...(satisfying?.occupiedRegions.map((region) => region.witnessId) ?? []),
      ...(counter?.occupiedRegions.map((region) => region.witnessId) ?? []),
    ]),
    witnessRelation: candidate.profile.classification === "UNDETERMINED" ? "MAY_BE_SAME" : "FORCED_SAME",
    satisfyingModel: satisfying,
    counterModel: counter,
  });
}

function combinationStatusReason(
  actual: string,
  claimed: string,
  selected: SelectedLogic,
  locale: SylLocale,
): string {
  const statuses = selected.conclusions.map((candidate, index) => {
    const follows = candidate.profile.classification === "ENTAILED";
    const roman = ["I", "II", "III"][index] ?? String(index + 1);
    if (locale === "hi-IN") return `निष्कर्ष ${roman} ${follows ? "निश्चित रूप से अनुसरण करता है" : "निश्चित रूप से अनुसरण नहीं करता"}`;
    if (locale === "pa-IN") return `ਨਤੀਜਾ ${roman} ${follows ? "ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਨਿਕਲਦਾ ਹੈ" : "ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਨਹੀਂ ਨਿਕਲਦਾ"}`;
    return `Conclusion ${roman} ${follows ? "definitely follows" : "does not definitely follow"}`;
  });
  if (locale === "hi-IN") {
    return `${statuses.join("; ")}। इसलिए सही स्थिति ${actual} है; ${claimed} इस जाँच से मेल नहीं खाता।`;
  }
  if (locale === "pa-IN") {
    return `${statuses.join("; ")}। ਇਸ ਲਈ ਸਹੀ ਸਥਿਤੀ ${actual} ਹੈ; ${claimed} ਇਸ ਜਾਂਚ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।`;
  }
  return `${statuses.join("; ")}. Therefore the correct status is ${actual}; ${claimed} does not match those verdicts.`;
}

function buildStatementOptionAnalyses(
  selected: SelectedLogic,
  displayedPremises: readonly SurfacePremise[],
  options: readonly GeneratedSylOptionV3[],
  locale: SylLocale,
  assignment: TermAssignment,
): readonly SylVisibleOptionAnalysisV3[] {
  const candidateByKey = new Map(selected.conclusions.map((candidate) => [conclusionSemanticKey(candidate), candidate]));
  return Object.freeze(options.map((option) => {
    const candidate = candidateByKey.get(option.semanticValue);
    if (!candidate) throw new Error(`No conclusion candidate matches visible option ${option.semanticValue}.`);
    const ids = decisivePremiseIds(candidate, displayedPremises);
    const logicalStatus = classificationToLogicalStatus(candidate.profile.classification);
    const disposition = taskDisposition(option.isCorrect, logicalStatus);
    const evidence = candidateEvidence(
      candidate,
      ids,
      displayedPremises,
      locale,
      assignment,
      `option-${option.displayIndex}`,
    );
    return Object.freeze({
      displayIndex: option.displayIndex,
      displayLabel: option.displayLabel,
      optionId: option.optionId,
      optionText: option.text,
      semanticValue: option.semanticValue,
      logicalStatus,
      taskDisposition: disposition,
      studentVerdict: studentVerdict(logicalStatus, disposition, locale),
      premiseIdsUsed: ids,
      reasonCode: evidence.reasonCode,
      studentReason: conclusionReason(
        candidate.conclusion,
        candidate.profile.classification,
        ids,
        displayedPremises,
        locale,
        assignment,
      ),
      proofEvidence: evidence,
    });
  }));
}

function buildClassificationOptionAnalyses(
  selected: SelectedLogic,
  displayedPremises: readonly SurfacePremise[],
  options: readonly GeneratedSylOptionV3[],
  locale: SylLocale,
  assignment: TermAssignment,
): readonly SylVisibleOptionAnalysisV3[] {
  const candidate = selected.conclusions[0];
  const actualLogicalStatus = classificationToLogicalStatus(candidate.profile.classification);
  const ids = decisivePremiseIds(candidate, displayedPremises);
  const actual = selected.semanticAnswer;
  return Object.freeze(options.map((option) => {
    const disposition: SylTaskDispositionV3 = option.isCorrect ? "CORRECT_FOR_TASK" : "WRONG_FOR_TASK";
    const baseEvidence = candidateEvidence(candidate, ids, displayedPremises, locale, assignment, `option-${option.displayIndex}`);
    const reasonCode: SylReasonCodeV3 = option.isCorrect ? baseEvidence.reasonCode : "MODAL_LABEL_MISMATCH";
    const reason = option.isCorrect
      ? conclusionReason(candidate.conclusion, candidate.profile.classification, ids, displayedPremises, locale, assignment)
      : combinationStatusReason(actual, option.semanticValue, selected, locale);
    return Object.freeze({
      displayIndex: option.displayIndex,
      displayLabel: option.displayLabel,
      optionId: option.optionId,
      optionText: option.text,
      semanticValue: option.semanticValue,
      logicalStatus: actualLogicalStatus,
      taskDisposition: disposition,
      studentVerdict: studentVerdict(actualLogicalStatus, disposition, locale),
      premiseIdsUsed: ids,
      reasonCode,
      studentReason: reason,
      proofEvidence: Object.freeze({ ...baseEvidence, reasonCode }),
    });
  }));
}

function buildCombinationOptionAnalyses(
  selected: SelectedLogic,
  displayedPremises: readonly SurfacePremise[],
  options: readonly GeneratedSylOptionV3[],
  locale: SylLocale,
  assignment: TermAssignment,
  reasonCode: SylReasonCodeV3,
): readonly SylVisibleOptionAnalysisV3[] {
  const ids = Object.freeze([...new Set(selected.conclusions.flatMap((candidate) => decisivePremiseIds(candidate, displayedPremises)))]);
  const first = selected.conclusions[0];
  const satisfying = modelSnapshot(first?.profile.witnessModel ?? null, "SATISFIES_CORRECT_OPTION", locale, assignment, "combination-true");
  const counter = modelSnapshot(first?.profile.counterModel ?? null, "FALSIFIES_CORRECT_OPTION", locale, assignment, "combination-false");
  return Object.freeze(options.map((option) => {
    const correct = option.isCorrect;
    const logicalStatus: SylLogicalStatusV3 = correct ? "ENTAILED" : "IMPOSSIBLE";
    const disposition: SylTaskDispositionV3 = correct ? "CORRECT_FOR_TASK" : "WRONG_FOR_TASK";
    return Object.freeze({
      displayIndex: option.displayIndex,
      displayLabel: option.displayLabel,
      optionId: option.optionId,
      optionText: option.text,
      semanticValue: option.semanticValue,
      logicalStatus,
      taskDisposition: disposition,
      studentVerdict: studentVerdict(logicalStatus, disposition, locale),
      premiseIdsUsed: ids,
      reasonCode,
      studentReason: combinationStatusReason(selected.semanticAnswer, option.semanticValue, selected, locale),
      proofEvidence: Object.freeze({
        proofType: reasonCode === "EITHER_OR_COMPLEMENT_FAILURE" ? "EITHER_OR_COMPLEMENT_PROOF" : reasonCode === "PAIR_STATUS_MISMATCH" ? "PAIR_CLASSIFICATION_PROOF" : "FOLLOW_MASK_PROOF",
        reasonCode,
        decisivePremiseIds: ids,
        requiredRelation: selected.semanticAnswer,
        blockedOrFreeRelation: option.semanticValue,
        witnessIds: Object.freeze(satisfying?.occupiedRegions.map((region) => region.witnessId) ?? []),
        witnessRelation: "UNRESOLVED",
        satisfyingModel: satisfying,
        counterModel: counter,
      }),
    });
  }));
}

function correctCandidateForOption(
  selected: SelectedLogic,
  correctOption: GeneratedSylOptionV3,
): SelectedLogic["conclusions"][number] | null {
  return selected.conclusions.find((candidate) => conclusionSemanticKey(candidate) === correctOption.semanticValue) ?? null;
}

function proofSteps(
  selected: SelectedLogic,
  displayedPremises: readonly SurfacePremise[],
  correctOption: GeneratedSylOptionV3,
  locale: SylLocale,
  assignment: TermAssignment,
): readonly string[] {
  const candidate = correctCandidateForOption(selected, correctOption);
  if (candidate) {
    const ids = decisivePremiseIds(candidate, displayedPremises);
    return Object.freeze([
      ...ids.map((id) => {
        const premise = displayedPremises.find((entry) => entry.premiseId === id)!;
        const index = displayedPremises.indexOf(premise) + 1;
        const meaning = premiseMeaning(premise, locale, assignment).meaning;
        if (locale === "hi-IN") return `कथन ${index}: ${meaning}`;
        if (locale === "pa-IN") return `ਕਥਨ ${index}: ${meaning}`;
        return `Statement ${index}: ${meaning}`;
      }),
      conclusionReason(candidate.conclusion, candidate.profile.classification, ids, displayedPremises, locale, assignment),
    ]);
  }
  return Object.freeze(selected.conclusions.map((candidate, index) => {
    const ids = decisivePremiseIds(candidate, displayedPremises);
    const roman = ["I", "II", "III"][index] ?? String(index + 1);
    const reason = conclusionReason(candidate.conclusion, candidate.profile.classification, ids, displayedPremises, locale, assignment);
    if (locale === "hi-IN") return `निष्कर्ष ${roman}: ${reason}`;
    if (locale === "pa-IN") return `ਨਤੀਜਾ ${roman}: ${reason}`;
    return `Conclusion ${roman}: ${reason}`;
  }));
}

function fastRule(
  premises: readonly SurfacePremise[],
  locale: SylLocale,
): { symbolic: string; naturalLanguage: string } {
  const forms = premises.map((premise) => premise.form);
  const symbolic = forms.includes("ONLY_A_FEW")
    ? "Only a few A are B ⇒ Some A are B + Some A are not B"
    : forms.includes("ONLY")
      ? "Only A are B ⇒ All B are A"
      : forms.includes("NOT_ALL")
        ? "Not all A are B ⇒ Some A are not B"
        : forms.includes("SOME") && forms.includes("NO")
          ? "Some A are B + No B is C ⇒ Some A are not C"
          : forms.filter((form) => form === "ALL" || form === "ARE_ONLY").length >= 2
            ? "All A are B + All B are C ⇒ All A are C"
            : forms.includes("SOME") && forms.includes("ALL")
              ? "Some A are B + All B are C ⇒ Some A are C"
              : "Check whether the conclusion is true in every valid model, one valid model, or no valid model";
  if (locale === "hi-IN") {
    return { symbolic, naturalLanguage: "पहले निर्णायक संबंध बनाएँ, फिर देखें कि विकल्प हर सही व्यवस्था में सत्य है, केवल किसी एक में संभव है, या किसी में भी संभव नहीं है।" };
  }
  if (locale === "pa-IN") {
    return { symbolic, naturalLanguage: "ਪਹਿਲਾਂ ਫੈਸਲਾ ਕਰਨ ਵਾਲਾ ਸੰਬੰਧ ਬਣਾਓ, ਫਿਰ ਵੇਖੋ ਕਿ ਵਿਕਲਪ ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਹੈ, ਸਿਰਫ਼ ਕਿਸੇ ਇੱਕ ਵਿੱਚ ਸੰਭਵ ਹੈ ਜਾਂ ਕਿਸੇ ਵਿੱਚ ਵੀ ਸੰਭਵ ਨਹੀਂ।" };
  }
  return { symbolic, naturalLanguage: "Build the decisive relation first, then decide whether the option is true in every valid arrangement, only some arrangements, or none." };
}

function diagramMode(
  definition: SylQlDefinition,
  selected: SelectedLogic,
  correctOption: GeneratedSylOptionV3,
): SylCombinedDiagramModeV3 {
  if (definition.taskKind.includes("EITHER_OR")) return "EITHER_OR_COMPLEMENT_MODEL";
  if (definition.renderer === "PAIR_CLASSIFICATION") return "PAIR_CLASSIFICATION_MODEL";
  if (definition.renderer === "CONCLUSION_COMBINATION") return "FOLLOW_MASK_MODEL";
  const candidate = correctCandidateForOption(selected, correctOption) ?? selected.conclusions[0];
  if (definition.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION") return "NON_FOLLOWING_COUNTERMODEL";
  if (definition.taskKind === "SELECT_GENUINE_POSSIBILITY") return "POSSIBLE_NOT_DEFINITE_TWO_STATE_MODEL";
  if (definition.taskKind === "SELECT_IMPOSSIBLE_CONCLUSION" || candidate.profile.classification === "CONTRADICTED") {
    return "IMPOSSIBILITY_BLOCK_MODEL";
  }
  if (candidate.profile.classification === "UNDETERMINED") return "POSSIBLE_NOT_DEFINITE_TWO_STATE_MODEL";
  return "DEFINITE_PROOF_MODEL";
}

export function buildStructuredProofCoreV3(
  definition: SylQlDefinition,
  selected: SelectedLogic,
  displayedPremises: readonly SurfacePremise[],
  options: readonly GeneratedSylOptionV3[],
  correctIndex: number,
  locale: SylLocale,
  assignment: TermAssignment,
): SylStructuredProofCoreV3 {
  const statementMeanings = Object.freeze(displayedPremises.map((premise, index) => {
    const meaning = premiseMeaning(premise, locale, assignment);
    return Object.freeze({
      displayIndex: index + 1,
      premiseId: premise.premiseId,
      statement: renderedPremise(premise, locale, assignment),
      normalizedMeaning: meaning.meaning,
      normalizedRelation: meaning.relation,
    });
  }));
  const correctOption = options[correctIndex];
  if (!correctOption?.isCorrect) throw new Error("V3 correct option index is not synchronized.");

  const optionAnalysis = definition.renderer === "STATEMENT_OPTIONS"
    ? buildStatementOptionAnalyses(selected, displayedPremises, options, locale, assignment)
    : definition.renderer === "MODAL_CLASSIFICATION"
      ? buildClassificationOptionAnalyses(selected, displayedPremises, options, locale, assignment)
      : buildCombinationOptionAnalyses(
        selected,
        displayedPremises,
        options,
        locale,
        assignment,
        definition.taskKind.includes("EITHER_OR")
          ? "EITHER_OR_COMPLEMENT_FAILURE"
          : definition.renderer === "PAIR_CLASSIFICATION"
            ? "PAIR_STATUS_MISMATCH"
            : "FOLLOW_MASK_MISMATCH",
      );

  const correctAnalysis = optionAnalysis[correctIndex];
  const steps = proofSteps(selected, displayedPremises, correctOption, locale, assignment);
  const correctOptionProof: SylCorrectOptionProofV3 = Object.freeze({
    displayIndex: correctOption.displayIndex,
    displayLabel: correctOption.displayLabel,
    optionText: correctOption.text,
    proofType: correctAnalysis.proofEvidence.proofType,
    decisivePremiseIds: correctAnalysis.premiseIdsUsed,
    reasoningSteps: steps,
    studentProof: `${steps.join(" ")} ${correctProofSentence(correctOption.displayIndex, correctOption.text, locale)}`,
  });
  const combinedRelation = `${combinedRelationIntro(locale)} ${steps.join(" ")}`;
  const focusedConclusions = Object.freeze(selected.conclusions.map((candidate) => candidate.conclusion));
  const satisfyingModel = correctAnalysis.proofEvidence.satisfyingModel
    ?? modelSnapshot(selected.conclusions[0]?.profile.witnessModel ?? null, "PREMISE_MODEL", locale, assignment, "correct-true");
  const counterModel = correctAnalysis.proofEvidence.counterModel
    ?? modelSnapshot(selected.conclusions[0]?.profile.counterModel ?? null, "FALSIFIES_CORRECT_OPTION", locale, assignment, "correct-false");
  return Object.freeze({
    statementMeanings,
    combinedRelation,
    optionAnalysis,
    correctOptionProof,
    fastRule: Object.freeze(fastRule(displayedPremises, locale)),
    decisivePremiseIds: Object.freeze([...new Set(correctAnalysis.premiseIdsUsed)]),
    focusedConclusions,
    satisfyingModel,
    counterModel,
    diagramMode: diagramMode(definition, selected, correctOption),
  });
}
