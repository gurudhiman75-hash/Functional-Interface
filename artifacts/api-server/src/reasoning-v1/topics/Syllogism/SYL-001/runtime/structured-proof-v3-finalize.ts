import type { InternalConclusionClass, SylLocale } from "../foundation/types";
import type { SylTaskKind } from "./types";
import type {
  SylIntegratedDiagramModeV3,
  SylProofTypeV3,
  SylStructuredProofV3,
} from "./structured-proof-v3-types";

interface FinalizeInput {
  locale: SylLocale;
  taskKind: SylTaskKind;
  correctIndex: number;
  correctOptionText: string;
  correctClassification: InternalConclusionClass | null;
  correctConclusionForm: "ALL" | "NO" | "SOME" | "SOME_NOT" | null;
}

function localized(
  locale: SylLocale,
  en: string,
  hi: string,
  pa: string,
): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}

function replaceMode(svg: string, mode: SylIntegratedDiagramModeV3): string {
  return svg.replace(/data-diagram-mode="[A-Z_]+"/u, `data-diagram-mode="${mode}"`);
}

function isDirectDefiniteTask(taskKind: SylTaskKind): boolean {
  return [
    "SELECT_DEFINITE_CONCLUSION",
    "ONLY_SELECT_DEFINITE_CONCLUSION",
    "FEW_SELECT_DEFINITE_CONCLUSION",
  ].includes(taskKind);
}

function isModalTask(taskKind: SylTaskKind): boolean {
  return taskKind.includes("MODAL");
}

export function finalizeStructuredProofV3(
  proof: SylStructuredProofV3,
  input: FinalizeInput,
): SylStructuredProofV3 {
  let proofType: SylProofTypeV3 = proof.correctOptionProof.proofType;
  let diagramMode: SylIntegratedDiagramModeV3 = proof.diagramSpec.mode;
  let studentProof = proof.correctOptionProof.studentProof;

  if (isDirectDefiniteTask(input.taskKind) && input.correctClassification === "ENTAILED") {
    proofType = input.correctConclusionForm === "SOME" || input.correctConclusionForm === "SOME_NOT"
      ? "WITNESS_TRANSFER"
      : "FORCED_RELATION";
    diagramMode = "INTEGRATED_FORCED_RELATION_PROOF";
    studentProof = localized(
      input.locale,
      `Follow the decisive statements in order. They force Option ${input.correctIndex + 1} in every valid arrangement, so ${input.correctOptionText} definitely follows.`,
      `निर्णायक कथनों को क्रम से जोड़ें। वे हर सही व्यवस्था में विकल्प ${input.correctIndex + 1} को अनिवार्य बनाते हैं, इसलिए ${input.correctOptionText} निश्चित रूप से निकलता है।`,
      `ਫੈਸਲਾ ਕਰਨ ਵਾਲੇ ਕਥਨਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਜੋੜੋ। ਉਹ ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਵਿਕਲਪ ${input.correctIndex + 1} ਨੂੰ ਲਾਜ਼ਮੀ ਬਣਾਉਂਦੇ ਹਨ, ਇਸ ਲਈ ${input.correctOptionText} ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਨਿਕਲਦਾ ਹੈ।`,
    );
  } else if (isModalTask(input.taskKind) && input.correctClassification === "ENTAILED") {
    proofType = input.correctConclusionForm === "SOME" || input.correctConclusionForm === "SOME_NOT"
      ? "WITNESS_TRANSFER"
      : "FORCED_RELATION";
    diagramMode = "INTEGRATED_FORCED_RELATION_PROOF";
    studentProof = localized(
      input.locale,
      `The conclusion remains true after every valid arrangement of the statements. Therefore the correct modal label is “definitely true,” shown by Option ${input.correctIndex + 1}.`,
      `कथनों की हर सही व्यवस्था में निष्कर्ष सत्य रहता है। इसलिए सही श्रेणी “निश्चित रूप से सत्य” है, जो विकल्प ${input.correctIndex + 1} में दी गई है।`,
      `ਕਥਨਾਂ ਦੀ ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਨਤੀਜਾ ਸਹੀ ਰਹਿੰਦਾ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਸ਼੍ਰੇਣੀ “ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ” ਹੈ, ਜੋ ਵਿਕਲਪ ${input.correctIndex + 1} ਵਿੱਚ ਦਿੱਤੀ ਹੈ।`,
    );
  } else if (isModalTask(input.taskKind) && input.correctClassification === "CONTRADICTED") {
    proofType = "IMPOSSIBILITY_CONFLICT";
    diagramMode = "INTEGRATED_IMPOSSIBILITY_PROOF";
    studentProof = localized(
      input.locale,
      `The conclusion needs a relation that the decisive statements forbid. No valid arrangement can make it true, so the correct modal label is “impossible,” shown by Option ${input.correctIndex + 1}.`,
      `निष्कर्ष को ऐसा संबंध चाहिए जिसे निर्णायक कथन रोकते हैं। कोई सही व्यवस्था इसे सत्य नहीं बना सकती, इसलिए सही श्रेणी “असंभव” है, जो विकल्प ${input.correctIndex + 1} में है।`,
      `ਨਤੀਜੇ ਨੂੰ ਉਹ ਸੰਬੰਧ ਚਾਹੀਦਾ ਹੈ ਜਿਸ ਨੂੰ ਫੈਸਲਾ ਕਰਨ ਵਾਲੇ ਕਥਨ ਰੋਕਦੇ ਹਨ। ਕੋਈ ਠੀਕ ਬਣਤਰ ਇਸ ਨੂੰ ਸਹੀ ਨਹੀਂ ਬਣਾ ਸਕਦੀ, ਇਸ ਲਈ ਸਹੀ ਸ਼੍ਰੇਣੀ “ਅਸੰਭਵ” ਹੈ, ਜੋ ਵਿਕਲਪ ${input.correctIndex + 1} ਵਿੱਚ ਹੈ।`,
    );
  }

  if (
    proofType === proof.correctOptionProof.proofType
    && diagramMode === proof.diagramSpec.mode
    && studentProof === proof.correctOptionProof.studentProof
  ) return proof;

  return {
    ...proof,
    correctOptionProof: {
      ...proof.correctOptionProof,
      proofType,
      studentProof,
    },
    diagramSpec: {
      ...proof.diagramSpec,
      mode: diagramMode,
    },
    integratedDiagramSvg: replaceMode(proof.integratedDiagramSvg, diagramMode),
  };
}
