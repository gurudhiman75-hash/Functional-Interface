import { createHash } from "node:crypto";
import type { SylLocale } from "../foundation/types";
import type { GeneratedSylQuestionV4, SylLearnerExplanationModeV4 } from "./learner-v4-types";

export type EvidenceStatusV4 = "PASS" | "FAIL" | "NOT_RUN" | "NOT_APPLICABLE";

export interface SylLearnerEvidenceRowV4 {
  stableId: string;
  language: SylLocale;
  sourceLogicalId: string;
  localizedRecordId: string;
  reviewVersionId: string;
  qlId: string;
  seed: number;
  difficulty: string;
  taskKind: string;
  proofMode: SylLearnerExplanationModeV4;
  diagramMode: string;
  answerKey: number;
  answerSemanticValue: string;
  independentlyDerivedAnswerKey: number | null;
  independentlyDerivedSemanticValue: string | null;
  automatedAnswerParity: EvidenceStatusV4;
  conclusionClassifications: readonly string[];
  requiredProofElements: readonly string[];
  presentProofElements: readonly string[];
  proofElementCoverage: EvidenceStatusV4;
  primaryVisibleWords: number;
  expandedLearnerWords: number;
  diagramLabelWords: number;
  totalLearnerWords: number;
  exactExplanationFingerprint: string;
  normalizedExplanationFingerprint: string;
  explanationParity: EvidenceStatusV4;
  diagramSemanticParity: EvidenceStatusV4;
  automatedSvgContract: EvidenceStatusV4;
  humanGeometry360: "NOT_RUN";
  humanGeometry412: "NOT_RUN";
  humanGeometry768: "NOT_RUN";
  nativeEditorial: "NOT_RUN";
  englishLabelLeakCount: number;
  literalMemberPhraseCount: number;
  duplicatePunctuationCount: number;
  unresolvedTemplateFragmentCount: number;
  learnerMetadataLeakCount: number;
  duplicateExplanationCluster: string | null;
  lifecycleStatus: "REVISE";
}

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex").slice(0, 20);
}

function words(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function stripMarkup(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&amp;/gu, "&")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&quot;/gu, '"')
    .replace(/&apos;/gu, "'")
    .replace(/\s+/gu, " ")
    .trim();
}

function learnerText(question: GeneratedSylQuestionV4): string {
  const v4 = question.learnerPresentationV4;
  return [
    v4.answer.label,
    v4.answer.text,
    ...v4.learnerExplanation.shortReasoning,
    ...v4.learnerExplanation.conclusionResults.flatMap((entry) => [entry.label, entry.text, entry.shortReason ?? ""]),
    v4.learnerExplanation.conclusion,
    v4.learnerExplanation.shortcut ?? "",
    v4.learnerExplanation.existenceNote ?? "",
    ...v4.optionAnalysis.flatMap((entry) => [entry.text, entry.verdictLabel, entry.studentReason]),
  ].join(" ").replace(/\s+/gu, " ").trim();
}

function primaryText(question: GeneratedSylQuestionV4): string {
  const explanation = question.learnerPresentationV4.learnerExplanation;
  return [
    ...explanation.shortReasoning,
    ...explanation.conclusionResults.flatMap((entry) => [entry.label, entry.text, entry.shortReason ?? ""]),
    explanation.conclusion,
  ].join(" ").replace(/\s+/gu, " ").trim();
}

function normalizedExplanation(value: string): string {
  return value
    .toLocaleLowerCase("en-IN")
    .replace(/[\p{P}\p{S}\s]+/gu, " ")
    .trim();
}

function conclusionSemanticValue(question: GeneratedSylQuestionV4, index: number): string | null {
  const conclusion = question.structuredPrompt.conclusions[index];
  return conclusion ? `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}` : null;
}

function evaluationMap(question: GeneratedSylQuestionV4): ReadonlyMap<string, string> {
  const pairs = question.structuredPrompt.conclusions.map((conclusion, index) => [
    `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`,
    question.reviewLogic.conclusionEvaluations[index]?.classification ?? "UNKNOWN",
  ] as const);
  return new Map(pairs);
}

function maskFor(classifications: readonly string[]): string {
  if (classifications.length === 2) {
    const first = classifications[0] === "ENTAILED";
    const second = classifications[1] === "ENTAILED";
    if (first && second) return "BOTH_FOLLOW";
    if (first) return "ONLY_FIRST_FOLLOWS";
    if (second) return "ONLY_SECOND_FOLLOWS";
    return "NEITHER_FOLLOWS";
  }
  const mask = classifications.reduce((value, classification, index) =>
    classification === "ENTAILED" ? value | (1 << index) : value, 0);
  return `MASK_${mask}`;
}

function modalValue(classification: string): string {
  if (classification === "ENTAILED") return "DEFINITELY_TRUE";
  if (classification === "CONTRADICTED") return "IMPOSSIBLE";
  if (classification === "UNDETERMINED") return "POSSIBLY_TRUE_NOT_DEFINITE";
  return "PREMISES_INCONSISTENT";
}

function independentlyDerivedSemanticValue(question: GeneratedSylQuestionV4): string | null {
  const task = question.metadata.taskKind;
  const classifications = question.reviewLogic.conclusionEvaluations.map((entry) => entry.classification);
  const bySemantic = evaluationMap(question);
  const directTargets: Readonly<Record<string, string>> = {
    SELECT_DEFINITE_CONCLUSION: "ENTAILED",
    ONLY_SELECT_DEFINITE_CONCLUSION: "ENTAILED",
    FEW_SELECT_DEFINITE_CONCLUSION: "ENTAILED",
    SELECT_NON_FOLLOWING_CONCLUSION: "NOT_ENTAILED",
    SELECT_GENUINE_POSSIBILITY: "UNDETERMINED",
    SELECT_IMPOSSIBLE_CONCLUSION: "CONTRADICTED",
  };
  const directTarget = directTargets[task];
  if (directTarget) {
    const matches = question.options.filter((option) => {
      const classification = bySemantic.get(option.semanticValue);
      return directTarget === "NOT_ENTAILED"
        ? Boolean(classification && classification !== "ENTAILED")
        : classification === directTarget;
    });
    return matches.length === 1 ? matches[0].semanticValue : null;
  }

  if ([
    "CLASSIFY_CONCLUSION_MODALITY",
    "ONLY_MODAL_CLASSIFICATION",
    "FEW_MODAL_CLASSIFICATION",
    "MIXED_MODAL_CLASSIFICATION",
  ].includes(task)) {
    return classifications.length === 1 ? modalValue(classifications[0]) : null;
  }

  if ([
    "TWO_CONCLUSION_FOLLOW_MASK",
    "THREE_CONCLUSION_FOLLOW_MASK",
    "ONLY_TWO_CONCLUSION_MASK",
    "FEW_TWO_CONCLUSION_MASK",
    "MIXED_TWO_CONCLUSION_MASK",
    "MIXED_THREE_CONCLUSION_MASK",
  ].includes(task)) {
    return maskFor(classifications);
  }

  if (task === "TWO_CONCLUSION_EITHER_OR" || task === "CLASSIFY_CONCLUSION_PAIR") {
    return question.metadata.pairStatus ?? null;
  }

  return null;
}

function proofElements(question: GeneratedSylQuestionV4): { required: readonly string[]; present: readonly string[] } {
  const v4 = question.learnerPresentationV4;
  const explanation = v4.learnerExplanation;
  const admin = v4.administratorProof;
  const requiredByMode: Readonly<Record<SylLearnerExplanationModeV4, readonly string[]>> = {
    DIRECT_CHAIN: ["DECISIVE_RELATIONS", "TRANSFER_STEP", "FINAL_CONCLUSION"],
    WITNESS_TRANSFER: ["EXISTENTIAL_WITNESS", "TRANSFER_OR_EXCLUSION", "FINAL_CONCLUSION"],
    DIRECT_CONTRADICTION: ["DECISIVE_RELATIONS", "CONFLICT", "IMPOSSIBLE_VERDICT"],
    POSSIBLE_NOT_DEFINITE: ["TRUE_CASE", "FALSE_CASE", "UNCERTAINTY_VERDICT"],
    COUNTEREXAMPLE: ["VALID_COUNTERMODEL", "CONCLUSION_FALSE", "NON_FOLLOWING_VERDICT"],
    POSSIBILITY_MODEL: ["VALID_MODEL", "CONCLUSION_TRUE", "POSSIBILITY_VERDICT"],
    DUAL_MODEL: ["TRUE_MODEL", "FALSE_MODEL", "UNCERTAINTY_VERDICT"],
    CONCLUSION_MASK: ["EACH_CONCLUSION_STATUS", "MASK_DERIVATION", "FINAL_ANSWER"],
    EITHER_OR: ["NOT_BOTH_TRUE", "NOT_BOTH_FALSE", "EXACTLY_ONE"],
  };
  const required = requiredByMode[explanation.mode];
  const present = new Set<string>();
  if (explanation.shortReasoning.length >= 2) present.add("DECISIVE_RELATIONS");
  if (explanation.shortReasoning.length >= 3) present.add("TRANSFER_STEP");
  if (explanation.conclusion.trim()) present.add("FINAL_CONCLUSION");
  if (admin.proofModel) {
    present.add("VALID_MODEL");
    present.add("CONCLUSION_TRUE");
    present.add("TRUE_MODEL");
    present.add("TRUE_CASE");
  }
  if (admin.counterModel) {
    present.add("VALID_COUNTERMODEL");
    present.add("CONCLUSION_FALSE");
    present.add("FALSE_MODEL");
    present.add("FALSE_CASE");
  }
  if (admin.alternateModel) {
    present.add("FALSE_MODEL");
    present.add("FALSE_CASE");
  }
  if (admin.premiseIds.length > 0 && /member|सदस्य|ਮੈਂਬਰ|×/iu.test(`${learnerText(question)} ${v4.diagram.svg ?? ""}`)) {
    present.add("EXISTENTIAL_WITNESS");
    present.add("TRANSFER_OR_EXCLUSION");
  }
  if (/impossible|असंभव|ਅਸੰਭਵ|cannot both|एक साथ सत्य नहीं|ਇਕੱਠੇ ਸਹੀ ਨਹੀਂ/iu.test(learnerText(question))) {
    present.add("CONFLICT");
    present.add("IMPOSSIBLE_VERDICT");
  }
  if (/does not definitely follow|निश्चित रूप से नहीं निकलता|ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਨਹੀਂ ਨਿਕਲਦਾ/iu.test(explanation.conclusion)) {
    present.add("NON_FOLLOWING_VERDICT");
  }
  if (/possible|संभव|ਸੰਭਵ/iu.test(explanation.conclusion)) present.add("POSSIBILITY_VERDICT");
  if (/not definite|निश्चित नहीं|ਨਿਸ਼ਚਿਤ ਨਹੀਂ/iu.test(explanation.conclusion)) present.add("UNCERTAINTY_VERDICT");
  if (explanation.conclusionResults.length === question.structuredPrompt.conclusions.length && explanation.conclusionResults.length > 0) {
    present.add("EACH_CONCLUSION_STATUS");
    present.add("MASK_DERIVATION");
    present.add("FINAL_ANSWER");
  }
  if (explanation.mode === "EITHER_OR" && explanation.shortReasoning.length >= 3) {
    present.add("NOT_BOTH_TRUE");
    present.add("NOT_BOTH_FALSE");
    present.add("EXACTLY_ONE");
  }
  return { required, present: [...present] };
}

function automatedSvgContract(question: GeneratedSylQuestionV4): EvidenceStatusV4 {
  const diagram = question.learnerPresentationV4.diagram;
  if (!diagram.enabled) return "NOT_APPLICABLE";
  const svg = diagram.svg ?? "";
  const checks = [
    (svg.match(/<svg\b/gu) ?? []).length === 1,
    svg.includes('viewBox="0 0 360 '),
    svg.includes('data-venn-v4="true"'),
    /<title id="syl-v4-title-/u.test(svg),
    /<desc id="syl-v4-desc-/u.test(svg),
    !/overflow-x|white-space:\s*nowrap|data-basis="MODEL_WITNESS"/iu.test(svg),
  ];
  return checks.every(Boolean) ? "PASS" : "FAIL";
}

function countMatches(value: string, expression: RegExp): number {
  return [...value.matchAll(expression)].length;
}

export function buildEvidenceRowV4(
  question: GeneratedSylQuestionV4,
  baseline: GeneratedSylQuestionV4,
): SylLearnerEvidenceRowV4 {
  const v4 = question.learnerPresentationV4;
  const answerSemanticValue = question.options[question.correctIndex]?.semanticValue ?? "UNKNOWN";
  const derivedSemanticValue = independentlyDerivedSemanticValue(question);
  const derivedIndex = derivedSemanticValue === null
    ? null
    : question.options.findIndex((option) => option.semanticValue === derivedSemanticValue);
  const proof = proofElements(question);
  const primary = primaryText(question);
  const expanded = learnerText(question);
  const diagramText = stripMarkup(v4.diagram.svg ?? "");
  const visible = expanded;
  const englishLabelLeakCount = question.locale === "en-IN"
    ? 0
    : countMatches(visible, /\b(?:Option|Premises|Reason|Correct answer|Administrator proof|Why are the other options wrong)\b/gu);
  const literalMemberPhraseCount = question.locale === "hi-IN"
    ? countMatches(visible, /का हर सदस्य/gu)
    : question.locale === "pa-IN"
      ? countMatches(visible, /ਦਾ ਹਰ ਮੈਂਬਰ/gu)
      : 0;
  const duplicatePunctuationCount = countMatches(visible, /।।|۔۔|!!|\?\?/gu);
  const unresolvedTemplateFragmentCount = countMatches(visible, /\{\{|\}\}|\[\[|\]\]|TODO|TEMPLATE|undefined|null/giu);
  const learnerMetadataLeakCount = countMatches(visible, /\bSYL-[A-Z0-9-]+\b|\b(?:ENTAILED|CONTRADICTED|UNDETERMINED|MODEL_WITNESS)\b/gu);
  const missing = proof.required.filter((element) => !proof.present.includes(element));
  const parity = question.correctIndex === baseline.correctIndex
    && v4.learnerExplanation.mode === baseline.learnerPresentationV4.learnerExplanation.mode
    && v4.diagram.mode === baseline.learnerPresentationV4.diagram.mode
    && v4.diagram.semanticSignature === baseline.learnerPresentationV4.diagram.semanticSignature;

  return {
    stableId: `${question.qlId}::${question.seed}::${question.locale}`,
    language: question.locale,
    sourceLogicalId: v4.administratorProof.identity.logicContentId,
    localizedRecordId: v4.administratorProof.identity.localizedRecordId,
    reviewVersionId: v4.administratorProof.identity.reviewVersionId,
    qlId: question.qlId,
    seed: question.seed,
    difficulty: question.difficulty,
    taskKind: question.metadata.taskKind,
    proofMode: v4.learnerExplanation.mode,
    diagramMode: v4.diagram.mode,
    answerKey: question.correctIndex + 1,
    answerSemanticValue,
    independentlyDerivedAnswerKey: derivedIndex >= 0 ? derivedIndex + 1 : null,
    independentlyDerivedSemanticValue: derivedSemanticValue,
    automatedAnswerParity: derivedIndex === question.correctIndex ? "PASS" : "FAIL",
    conclusionClassifications: question.reviewLogic.conclusionEvaluations.map((entry) => entry.classification),
    requiredProofElements: proof.required,
    presentProofElements: proof.present,
    proofElementCoverage: missing.length === 0 ? "PASS" : "FAIL",
    primaryVisibleWords: v4.learnerExplanation.wordCount,
    expandedLearnerWords: words(expanded),
    diagramLabelWords: words(diagramText),
    totalLearnerWords: words(expanded) + words(diagramText),
    exactExplanationFingerprint: hash(primary),
    normalizedExplanationFingerprint: hash(normalizedExplanation(primary)),
    explanationParity: parity ? "PASS" : "FAIL",
    diagramSemanticParity: v4.diagram.semanticSignature === baseline.learnerPresentationV4.diagram.semanticSignature ? "PASS" : "FAIL",
    automatedSvgContract: automatedSvgContract(question),
    humanGeometry360: "NOT_RUN",
    humanGeometry412: "NOT_RUN",
    humanGeometry768: "NOT_RUN",
    nativeEditorial: "NOT_RUN",
    englishLabelLeakCount,
    literalMemberPhraseCount,
    duplicatePunctuationCount,
    unresolvedTemplateFragmentCount,
    learnerMetadataLeakCount,
    duplicateExplanationCluster: null,
    lifecycleStatus: "REVISE",
  };
}

export function legacyLocalizationDefectsV4(question: GeneratedSylQuestionV4): {
  literalMemberPhraseCount: number;
  duplicatePunctuationCount: number;
} {
  const proof = question.structuredProofV3;
  const legacy = JSON.stringify({
    statementMeanings: proof.statementMeanings,
    combinedReasoning: proof.combinedReasoning,
    visibleOptionAnalysis: proof.visibleOptionAnalysis,
    correctOptionProof: proof.correctOptionProof,
    finalAnswer: proof.finalAnswer,
  });
  return {
    literalMemberPhraseCount: countMatches(legacy, /का हर सदस्य|ਦਾ ਹਰ ਮੈਂਬਰ|member of the group/gu),
    duplicatePunctuationCount: countMatches(legacy, /।।|۔۔|!!|\?\?/gu),
  };
}

export function applyDuplicateClustersV4(
  rows: readonly SylLearnerEvidenceRowV4[],
): readonly SylLearnerEvidenceRowV4[] {
  const clusters = new Map<string, string[]>();
  for (const row of rows) {
    const key = `${row.language}:${row.normalizedExplanationFingerprint}`;
    const values = clusters.get(key) ?? [];
    values.push(row.stableId);
    clusters.set(key, values);
  }
  return rows.map((row) => {
    const key = `${row.language}:${row.normalizedExplanationFingerprint}`;
    const members = clusters.get(key) ?? [];
    return {
      ...row,
      duplicateExplanationCluster: members.length > 1 ? `dup-${hash(key)}` : null,
    };
  });
}
