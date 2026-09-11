import type { AnalogyRelation, ExplanationTrace, SemanticFact } from "../foundation/types";
import { factsForRule, qlById } from "./task-registry";
import { relationDefinition } from "./relation-definitions";

type SemanticOptionValue = string | readonly [string, string];
export type SemanticDifficulty = "EASY" | "MEDIUM" | "HARD";

type SemanticOption = { value: SemanticOptionValue; errorLabel: string | null };

export interface GeneratedSemanticAnalogy {
  sourceA: string;
  sourceB: string;
  targetA: string;
  targetB: string;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  difficulty: SemanticDifficulty;
  relation: AnalogyRelation;
  options: readonly SemanticOption[];
  correctIndex: number;
  explanationTrace: ExplanationTrace;
}

function canonical(value: SemanticOptionValue): string {
  return Array.isArray(value)
    ? value.map((part) => part.trim().toLocaleLowerCase("en-IN")).join("::")
    : value.trim().toLocaleLowerCase("en-IN");
}

function seededRandom(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = seededRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function placeCorrect(options: readonly SemanticOption[], requestedIndex: number): SemanticOption[] {
  const result = [...options];
  const currentIndex = result.findIndex((option) => option.errorLabel === null);
  if (currentIndex < 0) throw new Error("Semantic options are missing a correct answer.");
  const [correct] = result.splice(currentIndex, 1);
  result.splice(requestedIndex, 0, correct);
  return result;
}

function selectFacts(ruleId: string, seed: number): [SemanticFact, SemanticFact] {
  const facts = shuffle(factsForRule(ruleId), seed * 31 + 7);
  if (facts.length < 12) throw new Error(`Rule ${ruleId} needs at least twelve curated facts.`);
  return [facts[0], facts[1]];
}

function wordOptions(target: SemanticFact, allFacts: readonly SemanticFact[], seed: number): SemanticOption[] {
  const shuffledFacts = shuffle(
    allFacts.filter((fact) => fact.id !== target.id && canonical(fact.right) !== canonical(target.right)),
    seed * 37 + 11,
  );
  const seen = new Set<string>([canonical(target.right)]);
  const distractors: SemanticFact[] = [];
  for (const fact of shuffledFacts) {
    const key = canonical(fact.right);
    if (seen.has(key)) continue;
    seen.add(key);
    distractors.push(fact);
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`Rule ${target.relation} cannot produce three unique category-safe distractors.`);
  return shuffle([
    { value: target.right, errorLabel: null },
    ...distractors.map((fact) => ({ value: fact.right, errorLabel: "SAME_CATEGORY_WRONG_RELATION_TARGET" })),
  ], seed * 41 + 13);
}

function pairOptions(target: SemanticFact, allFacts: readonly SemanticFact[], seed: number): SemanticOption[] {
  const leftPool = shuffle(allFacts.filter((fact) => fact.id !== target.id), seed * 43 + 17);
  const rightPool = shuffle(allFacts.filter((fact) => fact.id !== target.id), seed * 47 + 19);
  const validPairs = new Set(allFacts.map((fact) => canonical([fact.left, fact.right])));
  const usedPairs = new Set<string>();
  const distractors: { value: readonly [string, string]; errorLabel: string }[] = [];

  for (const leftFact of leftPool) {
    for (const rightFact of rightPool) {
      const value = [leftFact.left, rightFact.right] as const;
      const key = canonical(value);
      if (validPairs.has(key) || usedPairs.has(key)) continue;
      distractors.push({ value, errorLabel: "MISMATCHED_VALID_CATEGORIES" });
      usedPairs.add(key);
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }

  if (distractors.length !== 3) throw new Error(`Rule ${target.relation} cannot produce three false but category-valid pairs.`);
  return shuffle([
    { value: [target.left, target.right] as const, errorLabel: null },
    ...distractors,
  ], seed * 53 + 23);
}

function deriveSemanticDifficulty(
  source: SemanticFact,
  target: SemanticFact,
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION",
): SemanticDifficulty {
  const base = source.difficulty === "MEDIUM" || target.difficulty === "MEDIUM" ? 1 : 0;
  const presentationBurden = presentationMode === "EQUIVALENT_PAIR_SELECTION" ? 1 : 0;
  const score = base + presentationBurden;
  if (score === 0) return "EASY";
  if (score === 1) return "MEDIUM";
  return "HARD";
}

export function generateSemanticAnalogy(qlId: string, seed = 0): GeneratedSemanticAnalogy {
  const ql = qlById(qlId);
  const definition = relationDefinition(ql.ruleId);
  const [source, target] = selectFacts(ql.ruleId, seed);
  const allFacts = factsForRule(ql.ruleId);
  const generatedOptions = ql.presentationMode === "MISSING_FOURTH_TERM"
    ? wordOptions(target, allFacts, seed)
    : pairOptions(target, allFacts, seed);
  const requestedCorrectIndex = ((seed + Number(qlId.slice(-3))) % 4 + 4) % 4;
  const options = placeCorrect(generatedOptions, requestedCorrectIndex);
  if (new Set(options.map((option) => canonical(option.value))).size !== 4) {
    throw new Error(`Rule ${ql.ruleId} produced duplicate options.`);
  }
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  if (correctIndex < 0 || options.filter((option) => option.errorLabel === null).length !== 1) {
    throw new Error(`Rule ${ql.ruleId} must produce exactly one correct option.`);
  }

  const explanationTrace: ExplanationTrace = {
    ruleStatement: definition.ruleStatement,
    sourceDemonstration: [{ label: "Given pair", expression: `${source.left} → ${source.right}`, result: source.predicate }],
    targetApplication: [{ label: "Apply the same relationship", expression: `${target.left} → ${target.right}`, result: target.predicate }],
    conclusion: ql.presentationMode === "MISSING_FOURTH_TERM"
      ? `Therefore, ${target.right} is the correct answer.`
      : `Therefore, ${target.left} : ${target.right} preserves the same relationship.`,
    closestTrapRejection: ql.presentationMode === "MISSING_FOURTH_TERM"
      ? "The other options belong to the correct answer category but do not satisfy the exact relationship for the target term."
      : "The other pairs use valid source and answer categories, but their members do not preserve the exact relationship.",
  };

  return {
    sourceA: source.left,
    sourceB: source.right,
    targetA: target.left,
    targetB: target.right,
    presentationMode: ql.presentationMode,
    difficulty: deriveSemanticDifficulty(source, target, ql.presentationMode),
    relation: {
      family: "SEMANTIC",
      ruleId: ql.ruleId,
      direction: "FORWARD",
      inputType: "WORD",
      arity: 1,
      parameters: { sourceFactId: source.id, targetFactId: target.id, datasetVersion: "2.1.0" },
    },
    options,
    correctIndex,
    explanationTrace,
  };
}
