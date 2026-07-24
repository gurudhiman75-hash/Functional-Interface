import type { AnalogyRelation, ExplanationTrace, SemanticFact } from "../foundation/types";
import { factsForRule, qlById } from "./task-registry";

type SemanticOptionValue = string | readonly [string, string];

export interface GeneratedSemanticAnalogy {
  sourceA: string;
  sourceB: string;
  targetA: string;
  targetB: string;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  relation: AnalogyRelation;
  options: readonly { value: SemanticOptionValue; errorLabel: string | null }[];
  correctIndex: number;
  explanationTrace: ExplanationTrace;
}

function canonical(value: SemanticOptionValue): string {
  return Array.isArray(value)
    ? value.map((part) => part.trim().toLocaleLowerCase("en-IN")).join("::")
    : value.trim().toLocaleLowerCase("en-IN");
}

function rotate<T>(items: readonly T[], offset: number): T[] {
  if (!items.length) return [];
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

function selectFacts(ruleId: string, seed: number): [SemanticFact, SemanticFact] {
  const facts = factsForRule(ruleId);
  if (facts.length < 4) throw new Error(`Rule ${ruleId} needs four curated facts.`);
  const ordered = rotate(facts, seed);
  return [ordered[0], ordered[1]];
}

function wordOptions(target: SemanticFact, allFacts: readonly SemanticFact[]) {
  const candidates = [target.left, ...allFacts.filter((fact) => fact.id !== target.id).map((fact) => fact.right)];
  const unique = candidates.filter(
    (value, index, values) => values.findIndex((item) => canonical(item) === canonical(value)) === index,
  ).slice(0, 3);
  if (unique.length !== 3) throw new Error(`Rule ${target.relation} cannot produce three unique word distractors.`);
  return [
    { value: target.right, errorLabel: null },
    { value: unique[0], errorLabel: "REVERSED_DIRECTION" },
    { value: unique[1], errorLabel: "WRONG_TARGET_WITH_SAME_RELATION" },
    { value: unique[2], errorLabel: "WRONG_TARGET_WITH_SAME_RELATION" },
  ] as const;
}

function pairOptions(target: SemanticFact, allFacts: readonly SemanticFact[]) {
  const other = allFacts.filter((fact) => fact.id !== target.id);
  return [
    { value: [target.left, target.right] as const, errorLabel: null },
    { value: [target.right, target.left] as const, errorLabel: "REVERSED_DIRECTION" },
    { value: [other[0].left, other[1].right] as const, errorLabel: "MISMATCHED_RELATION_MEMBERS" },
    { value: [other[2].right, other[2].left] as const, errorLabel: "REVERSED_DISTRACTOR_PAIR" },
  ] as const;
}

export function generateSemanticAnalogy(qlId: string, seed = 0): GeneratedSemanticAnalogy {
  const ql = qlById(qlId);
  const [source, target] = selectFacts(ql.ruleId, seed);
  const allFacts = factsForRule(ql.ruleId);
  const rawOptions = ql.presentationMode === "MISSING_FOURTH_TERM"
    ? wordOptions(target, allFacts)
    : pairOptions(target, allFacts);
  const options = rotate(rawOptions, seed);
  if (new Set(options.map((option) => canonical(option.value))).size !== 4) {
    throw new Error(`Rule ${ql.ruleId} produced duplicate options.`);
  }
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const explanationTrace: ExplanationTrace = {
    ruleStatement: `The relationship is ${ql.ruleId}.`,
    sourceDemonstration: [{ label: "Given pair", expression: `${source.left} → ${source.right}`, result: source.explanation }],
    targetApplication: [{ label: "Apply the same relation", expression: `${target.left} → ${target.right}`, result: target.explanation }],
    conclusion: ql.presentationMode === "MISSING_FOURTH_TERM"
      ? `Therefore, ${target.right} is the correct answer.`
      : `Therefore, ${target.left} : ${target.right} preserves the same relationship.`,
    closestTrapRejection: `${target.right} : ${target.left} reverses the required direction.`,
  };

  return {
    sourceA: source.left,
    sourceB: source.right,
    targetA: target.left,
    targetB: target.right,
    presentationMode: ql.presentationMode,
    relation: {
      family: "SEMANTIC",
      ruleId: ql.ruleId,
      direction: "FORWARD",
      inputType: "WORD",
      arity: 1,
      parameters: { sourceFactId: source.id, targetFactId: target.id },
    },
    options,
    correctIndex,
    explanationTrace,
  };
}
