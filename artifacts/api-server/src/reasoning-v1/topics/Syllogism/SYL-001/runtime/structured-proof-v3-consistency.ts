import { createHash } from "node:crypto";
import type { InternalConclusionClass, SylLocale } from "../foundation/types";
import type { SylTaskKind } from "./types";
import type { SylStructuredProofV3 } from "./structured-proof-v3-types";

interface ConsistencyInput {
  locale: SylLocale;
  taskKind: SylTaskKind;
  correctIndex: number;
  correctClassification: InternalConclusionClass | null;
}

function localized(locale: SylLocale, en: string, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function polishFinalEnglish(value: string, locale: SylLocale): string {
  if (locale !== "en-IN") return value;
  return value
    .replace(/\bat least one ([A-Za-z]+s) must stay outside\b/giu, "at least one member of $1 must stay outside")
    .replace(/\bat least one ([A-Za-z]+s) is not\b/giu, "at least one member of $1 is not")
    .replace(/\bat least one ([A-Za-z]+s) is\b/giu, "at least one member of $1 is")
    .replace(/\bevery ([A-Za-z]+s) must be inside\b/giu, "every member of $1 must be inside")
    .replace(/\bevery ([A-Za-z]+s) is inside\b/giu, "every member of $1 is inside")
    .replace(/\bStatements (\d+(?: and \d+)+) blocks\b/gu, "Statements $1 block")
    .replace(/\bStatements (\d+(?: and \d+)+) forces\b/gu, "Statements $1 force")
    .replace(/\bStatements (\d+(?: and \d+)+) makes\b/gu, "Statements $1 make");
}

function modalProof(input: ConsistencyInput): string | null {
  if (!input.taskKind.includes("MODAL") || input.correctClassification === null) return null;
  if (input.correctClassification === "ENTAILED") {
    return localized(
      input.locale,
      `The tested conclusion is true in every valid arrangement. Therefore Option ${input.correctIndex + 1}, “definitely true,” is correct.`,
      `जाँचा गया निष्कर्ष हर सही व्यवस्था में सत्य रहता है। इसलिए विकल्प ${input.correctIndex + 1}, “निश्चित रूप से सत्य,” सही है।`,
      `ਜਾਂਚਿਆ ਗਿਆ ਨਤੀਜਾ ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਰਹਿੰਦਾ ਹੈ। ਇਸ ਲਈ ਵਿਕਲਪ ${input.correctIndex + 1}, “ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ,” ਠੀਕ ਹੈ।`,
    );
  }
  if (input.correctClassification === "CONTRADICTED") {
    return localized(
      input.locale,
      `The tested conclusion conflicts with the decisive statements in every valid arrangement. Therefore Option ${input.correctIndex + 1}, “impossible,” is correct.`,
      `जाँचा गया निष्कर्ष हर सही व्यवस्था में निर्णायक कथनों से टकराता है। इसलिए विकल्प ${input.correctIndex + 1}, “असंभव,” सही है।`,
      `ਜਾਂਚਿਆ ਗਿਆ ਨਤੀਜਾ ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਫੈਸਲਾ ਕਰਨ ਵਾਲੇ ਕਥਨਾਂ ਨਾਲ ਟਕਰਾਉਂਦਾ ਹੈ। ਇਸ ਲਈ ਵਿਕਲਪ ${input.correctIndex + 1}, “ਅਸੰਭਵ,” ਠੀਕ ਹੈ।`,
    );
  }
  return localized(
    input.locale,
    `One valid arrangement makes the tested conclusion true and another makes it false. Therefore Option ${input.correctIndex + 1}, “possible but not definite,” is correct.`,
    `एक सही व्यवस्था जाँचे गए निष्कर्ष को सत्य और दूसरी उसे असत्य बनाती है। इसलिए विकल्प ${input.correctIndex + 1}, “संभव, पर निश्चित नहीं,” सही है।`,
    `ਇੱਕ ਠੀਕ ਬਣਤਰ ਜਾਂਚੇ ਗਏ ਨਤੀਜੇ ਨੂੰ ਸਹੀ ਅਤੇ ਦੂਜੀ ਉਸ ਨੂੰ ਗਲਤ ਬਣਾਉਂਦੀ ਹੈ। ਇਸ ਲਈ ਵਿਕਲਪ ${input.correctIndex + 1}, “ਸੰਭਵ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ,” ਠੀਕ ਹੈ।`,
  );
}

export function enforceStructuredProofV3Consistency(
  proof: SylStructuredProofV3,
  input: ConsistencyInput,
): SylStructuredProofV3 {
  const decisivePremiseIds = proof.diagramSpec.relevantPremiseIds;
  if (decisivePremiseIds.length === 0) {
    throw new Error("V3 consistency requires at least one decisive premise.");
  }

  const visibleOptionAnalysis = proof.visibleOptionAnalysis.map((analysis) => ({
    ...analysis,
    studentReason: polishFinalEnglish(analysis.studentReason, input.locale),
  }));
  const reasoningSteps = proof.combinedReasoning.reasoningSteps.map((step, index, all) => ({
    ...step,
    text: polishFinalEnglish(step.text, input.locale),
    ...(index === all.length - 1
      ? {
          premiseIds: decisivePremiseIds,
          witnessIds: proof.combinedReasoning.witnesses.map((witness) => witness.witnessId),
        }
      : {}),
  }));
  const correctedModalProof = modalProof(input);
  const correctOptionProof = {
    ...proof.correctOptionProof,
    premiseIdsUsed: decisivePremiseIds,
    reasoningSteps: reasoningSteps.map((step) => step.text),
    studentProof: polishFinalEnglish(
      correctedModalProof ?? proof.correctOptionProof.studentProof,
      input.locale,
    ),
  };
  const combinedReasoning = {
    ...proof.combinedReasoning,
    decisivePremiseIds,
    reasoningSteps,
    summary: polishFinalEnglish(proof.combinedReasoning.summary, input.locale),
  };
  const contentHash = hash({
    authority: proof.authority,
    locale: proof.locale,
    taskKind: proof.taskKind,
    statementMeanings: proof.statementMeanings,
    combinedReasoning,
    visibleOptionAnalysis,
    correctOptionProof,
    fastRule: proof.fastRule,
    diagramSpec: proof.diagramSpec,
    integratedDiagramSvg: proof.integratedDiagramSvg,
    finalAnswer: proof.finalAnswer,
  });
  const reviewVersionId = `syl-review-${contentHash.slice(0, 20)}`;

  return {
    ...proof,
    identity: {
      ...proof.identity,
      reviewVersionId,
    },
    combinedReasoning,
    visibleOptionAnalysis,
    correctOptionProof,
    validationEvidence: proof.validationEvidence.map((entry) => ({
      ...entry,
      contentHash,
    })),
    humanReview: {
      ...proof.humanReview,
      contentVersion: reviewVersionId,
    },
  };
}
