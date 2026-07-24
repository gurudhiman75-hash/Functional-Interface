import type { AnalogyOption, ExplanationTrace, GeneratedAnalogy, SemanticFact } from "../foundation/types";
import { factsForRule, qlById } from "./task-registry";

function canonical(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN");
}

function rotate<T>(items: readonly T[], offset: number): T[] {
  if (!items.length) return [];
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

function selectFacts(ruleId: string, seed: number): [SemanticFact, SemanticFact] {
  const facts = factsForRule(ruleId);
  if (facts.length < 2) throw new Error(`Rule ${ruleId} needs at least two curated facts.`);
  const ordered = rotate(facts, seed);
  return [ordered[0], ordered[1]];
}

function distractorWords(correct: SemanticFact, allFacts: readonly SemanticFact[]): string[] {
  const candidates = allFacts
    .filter((fact) => canonical(fact.right) !== canonical(correct.right))
    .map((fact) => fact.right);
  return [correct.left, ...candidates].filter(
    (value, index, values) => values.findIndex((item) => canonical(item) === canonical(value)) === index,
  ).slice(0, 3);
}

export function generateSemanticAnalogy(qlId: string, seed = 0): GeneratedAnalogy<string> {
  const ql = qlById(qlId);
  const [source, target] = selectFacts(ql.ruleId, seed);
  const allFacts = factsForRule(ql.ruleId);
  const distractors = distractorWords(target, allFacts);
  if (distractors.length !== 3) throw new Error(`Rule ${ql.ruleId} cannot produce three unique distractors.`);

  const rawOptions: AnalogyOption<string>[] = [
    { value: target.right, errorLabel: null },
    { value: distractors[0], errorLabel: "REVERSED_DIRECTION" },
    { value: distractors[1], errorLabel: "WRONG_TARGET_WITH_SAME_RELATION" },
    { value: distractors[2], errorLabel: "WRONG_TARGET_WITH_SAME_RELATION" },
  ];
  const options = rotate(rawOptions, seed);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const explanationTrace: ExplanationTrace = {
    ruleStatement: `The relationship is ${ql.ruleId}.`,
    sourceDemonstration: [{
      label: "Given pair",
      expression: `${source.left} → ${source.right}`,
      result: source.explanation,
    }],
    targetApplication: [{
      label: "Apply the same relation",
      expression: `${target.left} → ${target.right}`,
      result: target.explanation,
    }],
    conclusion: `Therefore, ${target.right} is the correct answer.`,
    closestTrapRejection: `${target.left} is the source term, not the required related term.`,
  };

  return {
    sourceA: source.left,
    sourceB: source.right,
    targetA: target.left,
    targetB: target.right,
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
