import {
  verifyKnowledgeComposition,
  type KnowledgeCombinationOption,
  type KnowledgeStatementClaim,
} from "../composition-verifier";
import { deterministicPick, deterministicShuffle } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact, KnowledgeFactValue } from "../types";
import {
  COM002_EDITORIALLY_APPROVED_FACTS,
  COM002_EDITORIAL_TARGET_FACTS,
} from "./com002-editorial-review";
import type { Com002ReviewQuestion } from "./com002-review-types";

function textValue(fact: KnowledgeFact): string {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} must carry a text value`);
  return fact.value.text.en;
}

function valueText(value: KnowledgeFactValue): string {
  if (value.kind !== "text") throw new Error("COM-002 safe composition currently requires text values");
  return value.text.en;
}

function unique(items: readonly string[]) {
  return [...new Set(items)];
}

function approvedFact(factId: string) {
  const fact = COM002_EDITORIALLY_APPROVED_FACTS.find((candidate) => candidate.factId === factId);
  if (!fact) throw new Error(`Unknown COM-002 approved fact ${factId}`);
  return fact;
}

function kernelExplanation(fact: KnowledgeFact) {
  if (fact.factId === "com002-kernel-core") {
    return "The kernel is the core component of an operating system.";
  }
  return `The kernel ${textValue(fact)}.`;
}

/**
 * QL-004 safety patch.
 *
 * CORE_COMPONENT must always bind the actual kernel-core fact. The base V1
 * generator can otherwise choose the kernel hardware-interface fact and then
 * ask a core-component question against mismatched provenance. For the
 * COMPONENT_TO_ROLE surface we also use a "best states the principal role"
 * stem so specialized scheduler/memory/file-manager roles do not read as
 * multiple equally-correct broad kernel functions.
 */
export function patchCom002Ql004SafetyV2(
  question: Com002ReviewQuestion,
): Com002ReviewQuestion {
  if (question.qlId !== "COM-002-QL-004") return question;

  if (question.surfaceMode === "CORE_COMPONENT") {
    const coreFact = COM002_EDITORIAL_TARGET_FACTS.find(
      (fact) => fact.factId === "com002-kernel-core",
    );
    if (!coreFact) throw new Error("COM-002 QL-004 kernel-core fact is missing");

    const retainedFactIds = question.sourceFactIds.filter(
      (factId) => factId !== question.targetFactId,
    );
    const sourceFactIds = unique([coreFact.factId, ...retainedFactIds]);
    const sourceIds = unique(sourceFactIds.map((factId) => approvedFact(factId).source.sourceId));

    return {
      ...question,
      targetFactId: coreFact.factId,
      stem: "Which component forms the core of an operating system?",
      explanation: "The kernel is the core component of an operating system.",
      sourceFactIds,
      sourceIds,
    };
  }

  const target = question.targetFactId
    ? COM002_EDITORIAL_TARGET_FACTS.find((fact) => fact.factId === question.targetFactId) ?? null
    : null;
  if (!target) throw new Error(`${question.questionId}: QL-004 target fact is missing`);

  if (question.surfaceMode === "COMPONENT_TO_ROLE") {
    return {
      ...question,
      stem: "Which option best states the kernel's principal role in an operating system?",
      explanation: kernelExplanation(target),
    };
  }

  if (question.surfaceMode === "ROLE_TO_COMPONENT") {
    return {
      ...question,
      stem: target.factId === "com002-kernel-core"
        ? "Which component forms the core of an operating system?"
        : question.stem,
      explanation: kernelExplanation(target),
    };
  }

  return { ...question, explanation: kernelExplanation(target) };
}

function canonicalFileType(value: string) {
  const normalized = value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (normalized.includes("jpeg")) return "jpeg-image";
  return normalized;
}

function licensePolarity(value: string): "OPEN_SOURCE" | "PROPRIETARY" | "OTHER" {
  if (/open-source/i.test(value)) return "OPEN_SOURCE";
  if (/proprietary/i.test(value)) return "PROPRIETARY";
  return "OTHER";
}

function safeFalseDonor(
  target: KnowledgeFact,
  group: readonly KnowledgeFact[],
  seed: string,
) {
  let candidates = group.filter(
    (candidate) => candidate.factId !== target.factId && textValue(candidate) !== textValue(target),
  );

  if (target.relation === "license_class") {
    const polarity = licensePolarity(textValue(target));
    candidates = candidates.filter((candidate) => {
      const donorPolarity = licensePolarity(textValue(candidate));
      return donorPolarity !== "OTHER" && donorPolarity !== polarity;
    });
  }

  if (target.relation === "extension_file_type") {
    const targetType = canonicalFileType(textValue(target));
    candidates = candidates.filter(
      (candidate) => canonicalFileType(textValue(candidate)) !== targetType,
    );
  }

  if (candidates.length === 0) {
    throw new Error(`COM-002 safe false-donor pool is empty for ${target.factId}`);
  }
  return deterministicPick(candidates, seed);
}

function renderSafeStatement(fact: KnowledgeFact, claimValue: KnowledgeFactValue) {
  const entity = fact.entity.label.en;
  const value = valueText(claimValue);
  switch (fact.relation) {
    case "license_class":
      return `${entity} is classified as ${value}.`;
    case "file_operation_effect":
      return `${entity} ${value}.`;
    case "extension_file_type":
      return `${entity} is associated with ${value}.`;
    case "shortcut_action":
      return `${entity} is used to ${value}.`;
    default:
      throw new Error(`Unsupported COM-002 safe QL-013 relation ${fact.relation}`);
  }
}

function allStatementSubsets(ids: readonly string[]): string[][] {
  const output: string[][] = [];
  for (let mask = 0; mask < 2 ** ids.length; mask += 1) {
    output.push(ids.filter((_, index) => Boolean(mask & (1 << index))));
  }
  return output;
}

function comboLabel(ids: readonly string[]): string {
  if (ids.length === 0) return "None of the statements";
  if (ids.length === 1) return `${ids[0]} only`;
  if (ids.length === 2) return `${ids[0]} and ${ids[1]} only`;
  if (ids.length === 3) return `${ids[0]}, ${ids[1]} and ${ids[2]} only`;
  return `${ids.slice(0, -1).join(", ")} and ${ids.at(-1)}`;
}

/**
 * Safe QL-013 V2 composition.
 *
 * The historical generator used broad software-classification and OS-type
 * relations, then treated any exact-value mismatch as false. That is unsafe
 * for hierarchical/overlapping labels (for example, "operating system" does
 * not logically disprove "mobile operating system"). V2 composes only from
 * relation families whose swapped values are defensibly exclusive in this
 * chapter: license polarity, file-operation effect, file type, and shortcut
 * action. JPEG aliases are explicitly kept in the same canonical type bucket.
 */
export function generateCom002SafeQl013V2(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-013";
  const groups = [
    COM002_EDITORIAL_TARGET_FACTS.filter((fact) => fact.relation === "license_class"),
    COM002_EDITORIAL_TARGET_FACTS.filter((fact) => fact.relation === "file_operation_effect"),
    COM002_EDITORIAL_TARGET_FACTS.filter((fact) => fact.relation === "extension_file_type"),
    COM002_EDITORIAL_TARGET_FACTS.filter((fact) => fact.relation === "shortcut_action"),
  ];

  for (const [index, group] of groups.entries()) {
    if (group.length < 2) {
      throw new Error(`COM-002 safe QL-013 group ${index} requires at least two facts`);
    }
  }

  const selected = groups.map((group, index) =>
    deterministicPick(group, `${seed}:v2-safe-statement-target:${index}`),
  );
  const statementIds = ["I", "II", "III", "IV"];
  const truthPatterns = [
    [true, false, true, false],
    [true, true, false, true],
    [false, true, true, false],
    [true, false, false, true],
    [false, true, false, true],
  ] as const;
  const truthPattern = deterministicPick(truthPatterns, `${seed}:v2-safe-truth-pattern`);
  const claims: KnowledgeStatementClaim[] = [];
  const donorFacts: KnowledgeFact[] = [];

  selected.forEach((fact, index) => {
    let claimedValue = fact.value;
    if (!truthPattern[index]) {
      const donor = safeFalseDonor(
        fact,
        groups[index]!,
        `${seed}:v2-safe-false-donor:${index}`,
      );
      claimedValue = donor.value;
      donorFacts.push(donor);
    }
    claims.push({
      statementId: statementIds[index]!,
      factId: fact.factId,
      claimedValue,
    });
  });

  const expectedTrueIds = statementIds.filter((_, index) => truthPattern[index]);
  const wrongSets = deterministicShuffle(
    allStatementSubsets(statementIds).filter(
      (set) => set.join("|") !== expectedTrueIds.join("|"),
    ),
    `${seed}:v2-safe-wrong-combos`,
  ).slice(0, 3);
  const optionSets = deterministicShuffle(
    [expectedTrueIds, ...wrongSets],
    `${seed}:v2-safe-option-combos`,
  );
  const combinationOptions: KnowledgeCombinationOption[] = optionSets.map(
    (set, index) => ({ optionId: `COMBO-${index + 1}`, trueStatementIds: set }),
  );
  const verification = verifyKnowledgeComposition(
    COM002_EDITORIAL_TARGET_FACTS,
    claims,
    combinationOptions,
  );
  const options = combinationOptions.map((option) => comboLabel(option.trueStatementIds));
  const canonicalAnswer = options[verification.correctIndex]!;
  const stemLines = claims.map(
    (claim, index) => `${statementIds[index]}. ${renderSafeStatement(selected[index]!, claim.claimedValue)}`,
  );
  const stem = `Consider the following statements:\n${stemLines.join("\n")}\nWhich of the above statements are correct?`;
  const explanationParts = verification.truths.map((truth, index) => {
    const fact = selected[index]!;
    return `${statementIds[index]} is ${truth.true ? "correct" : "incorrect"}. ${renderSafeStatement(fact, fact.value)}`;
  });
  const allFacts = unique([...selected, ...donorFacts].map((fact) => fact.factId)).map(approvedFact);
  const explanation = `${explanationParts.join(" ")} Therefore, ${canonicalAnswer} is correct.`;

  assertKnowledgeQuestionValid({
    stem,
    explanation,
    options,
    correctIndex: verification.correctIndex,
    canonicalAnswer,
  });

  return {
    questionId: `COM002-REVIEW-${qlId}-${seed}`,
    qlId,
    cpId: "COM-002-CP-002",
    surfaceMode: "MULTI_STATEMENT_TRUTH_VECTOR",
    targetFactId: null,
    stem,
    options,
    correctIndex: verification.correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: unique(allFacts.map((fact) => fact.source.sourceId)),
    sourceFactIds: unique(allFacts.map((fact) => fact.factId)),
    solverAuthority: "KNOWLEDGE_COMPOSITION_VERIFIER",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}
