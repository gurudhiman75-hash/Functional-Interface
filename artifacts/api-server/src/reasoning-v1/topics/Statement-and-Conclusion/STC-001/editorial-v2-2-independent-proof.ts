import type { StcQlId } from "./types.ts";
import type { StcV2AnswerClass } from "./editorial-v2-types.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

export const STC_V22_INDEPENDENT_PROOF_AUTHORITY =
  "STC_V22_POST_CLOSURE_TEMPLATE_PROOF_REGISTRY_2026_10_03" as const;

export type StcV22ProofMechanism =
  | "DIRECT_EXPLICIT_ENTAILMENT"
  | "MULTI_CLAUSE_ENTAILMENT"
  | "CONDITIONAL_NECESSITY_SUFFICIENCY"
  | "MODAL_STRENGTH"
  | "COMPARATIVE_METRIC"
  | "TEMPORAL_TREND";

export type StcV22TemplateProof = Readonly<{
  qlId: StcQlId;
  answerClass: StcV2AnswerClass;
  mechanism: StcV22ProofMechanism;
  semanticSignature: string;
}>;

/**
 * Independent answer authority for the frozen V2.2 surface inventory.
 *
 * This registry deliberately does not read `template.answerClass`. The generator
 * asks this registry for the expected semantic result and separately checks that
 * the authored template metadata agrees. That makes an accidental answer-class
 * edit fail closed instead of silently becoming the answer key.
 *
 * The V2.2 templates are controlled semantic archetypes: variable substitution
 * changes entities/numbers within reviewed invariants but does not change the
 * entailment class. Instance-invariant tests cover the arithmetic/order families
 * whose cross-product values could otherwise flip the semantic result.
 */
export const STC_V22_TEMPLATE_PROOFS: Readonly<Record<string, StcV22TemplateProof>> =
  Object.freeze({
  "STC-V22-QL001-T01": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "ONLY_I" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "a42c0f7a" as const }),
  "STC-V22-QL001-T02": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "ONLY_II" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "f0c794ab" as const }),
  "STC-V22-QL001-T03": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "BOTH" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "98214836" as const }),
  "STC-V22-QL001-T04": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "NEITHER" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "1f528000" as const }),
  "STC-V22-QL001-T05": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "ONLY_I" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "71159143" as const }),
  "STC-V22-QL001-T06": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "ONLY_II" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "e169ff16" as const }),
  "STC-V22-QL001-T07": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "BOTH" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "2d6d94b5" as const }),
  "STC-V22-QL001-T08": Object.freeze({ qlId: "STC-QL-001" as const, answerClass: "NEITHER" as const, mechanism: "DIRECT_EXPLICIT_ENTAILMENT" as const, semanticSignature: "552b6da3" as const }),
  "STC-V22-QL002-T01": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "ONLY_I" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "6b61816b" as const }),
  "STC-V22-QL002-T02": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "ONLY_II" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "65736d05" as const }),
  "STC-V22-QL002-T03": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "BOTH" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "9e438ff2" as const }),
  "STC-V22-QL002-T04": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "NEITHER" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "bdb345a1" as const }),
  "STC-V22-QL002-T05": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "ONLY_I" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "f0cdfbf3" as const }),
  "STC-V22-QL002-T06": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "ONLY_II" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "a25a7fae" as const }),
  "STC-V22-QL002-T07": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "BOTH" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "5f95dd7c" as const }),
  "STC-V22-QL002-T08": Object.freeze({ qlId: "STC-QL-002" as const, answerClass: "NEITHER" as const, mechanism: "MULTI_CLAUSE_ENTAILMENT" as const, semanticSignature: "c5376231" as const }),
  "STC-V22-QL003-T01": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "ONLY_I" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "74dc1916" as const }),
  "STC-V22-QL003-T02": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "ONLY_II" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "2a988c7f" as const }),
  "STC-V22-QL003-T03": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "BOTH" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "27e9f227" as const }),
  "STC-V22-QL003-T04": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "NEITHER" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "3ccd86f8" as const }),
  "STC-V22-QL003-T05": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "ONLY_I" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "237b578b" as const }),
  "STC-V22-QL003-T06": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "ONLY_II" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "6ee15fa8" as const }),
  "STC-V22-QL003-T07": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "BOTH" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "e01f2433" as const }),
  "STC-V22-QL003-T08": Object.freeze({ qlId: "STC-QL-003" as const, answerClass: "NEITHER" as const, mechanism: "CONDITIONAL_NECESSITY_SUFFICIENCY" as const, semanticSignature: "0c878eb4" as const }),
  "STC-V22-QL004-T01": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "ONLY_I" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "1a8194b7" as const }),
  "STC-V22-QL004-T02": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "ONLY_II" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "58e70d0b" as const }),
  "STC-V22-QL004-T03": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "BOTH" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "5c8d3c66" as const }),
  "STC-V22-QL004-T04": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "NEITHER" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "3c356beb" as const }),
  "STC-V22-QL004-T05": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "ONLY_I" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "c460ed03" as const }),
  "STC-V22-QL004-T06": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "ONLY_II" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "397b531c" as const }),
  "STC-V22-QL004-T07": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "BOTH" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "013c6027" as const }),
  "STC-V22-QL004-T08": Object.freeze({ qlId: "STC-QL-004" as const, answerClass: "NEITHER" as const, mechanism: "MODAL_STRENGTH" as const, semanticSignature: "506d64ff" as const }),
  "STC-V22-QL005-T01": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "ONLY_I" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "49ff793e" as const }),
  "STC-V22-QL005-T02": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "ONLY_II" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "c3fc43d1" as const }),
  "STC-V22-QL005-T03": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "BOTH" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "81c9627c" as const }),
  "STC-V22-QL005-T04": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "NEITHER" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "79162dca" as const }),
  "STC-V22-QL005-T05": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "ONLY_I" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "292b65db" as const }),
  "STC-V22-QL005-T06": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "ONLY_II" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "29524119" as const }),
  "STC-V22-QL005-T07": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "BOTH" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "62bb0334" as const }),
  "STC-V22-QL005-T08": Object.freeze({ qlId: "STC-QL-005" as const, answerClass: "NEITHER" as const, mechanism: "COMPARATIVE_METRIC" as const, semanticSignature: "ec691f9b" as const }),
  "STC-V22-QL006-T01": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "ONLY_I" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "2d882878" as const }),
  "STC-V22-QL006-T02": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "ONLY_II" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "63b3f536" as const }),
  "STC-V22-QL006-T03": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "BOTH" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "f16bc090" as const }),
  "STC-V22-QL006-T04": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "NEITHER" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "3be1ac8a" as const }),
  "STC-V22-QL006-T05": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "ONLY_I" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "a6ac549b" as const }),
  "STC-V22-QL006-T06": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "ONLY_II" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "ac17b9af" as const }),
  "STC-V22-QL006-T07": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "BOTH" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "82798150" as const }),
  "STC-V22-QL006-T08": Object.freeze({ qlId: "STC-QL-006" as const, answerClass: "NEITHER" as const, mechanism: "TEMPORAL_TREND" as const, semanticSignature: "a728493e" as const }),
  });

export function stcV22AnswerClassFromFlags(
  firstFollows: boolean,
  secondFollows: boolean,
): StcV2AnswerClass {
  if (firstFollows && secondFollows) return "BOTH";
  if (firstFollows) return "ONLY_I";
  if (secondFollows) return "ONLY_II";
  return "NEITHER";
}

export function stcV22FlagsForAnswerClass(
  answerClass: StcV2AnswerClass,
): readonly [boolean, boolean] {
  switch (answerClass) {
    case "ONLY_I": return [true, false];
    case "ONLY_II": return [false, true];
    case "BOTH": return [true, true];
    case "NEITHER": return [false, false];
  }
}

export function getStcV22IndependentProof(templateId: string): StcV22TemplateProof {
  const proof = STC_V22_TEMPLATE_PROOFS[templateId];
  if (!proof) throw new Error(`${templateId}: missing independent STC V2.2 proof authority`);
  return proof;
}

function fnv1a32(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function stcV22SemanticSignature(template: StcV22Template): string {
  return fnv1a32([
    template.surfaceArchetype,
    template.statement["en-IN"],
    template.conclusions[0]["en-IN"],
    template.conclusions[1]["en-IN"],
  ].join("␟"));
}

export function assertStcV22TemplateProofContract(template: StcV22Template): StcV22TemplateProof {
  const proof = getStcV22IndependentProof(template.id);
  if (proof.qlId !== template.qlId) {
    throw new Error(`${template.id}: proof QL ${proof.qlId} does not match template QL ${template.qlId}`);
  }
  if (proof.answerClass !== template.answerClass) {
    throw new Error(
      `${template.id}: authored answerClass ${template.answerClass} disagrees with independent proof ${proof.answerClass}`,
    );
  }
  const semanticSignature = stcV22SemanticSignature(template);
  if (proof.semanticSignature !== semanticSignature) {
    throw new Error(
      `${template.id}: semantic skeleton drift ${semanticSignature}; expected ${proof.semanticSignature}`,
    );
  }
  return proof;
}

export function stcV22IndependentAnswerClass(
  template: StcV22Template,
  reverseConclusions: boolean,
): StcV2AnswerClass {
  const proof = assertStcV22TemplateProofContract(template);
  if (!reverseConclusions) return proof.answerClass;
  if (proof.answerClass === "ONLY_I") return "ONLY_II";
  if (proof.answerClass === "ONLY_II") return "ONLY_I";
  return proof.answerClass;
}
