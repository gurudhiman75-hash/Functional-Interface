import type { AnalogyRelation, ExplanationTrace } from "../foundation/types";
import { lexicalRelationDefinition } from "./relation-definitions";
import { lexicalFactsForRule, lexicalQlById } from "./task-registry";
import type { LexicalFact } from "./lexical-facts.en";

type OptionValue = string | readonly [string, string];

export interface GeneratedLexicalAnalogy {
  sourceA: string;
  sourceB: string;
  targetA: string;
  targetB: string;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  relation: AnalogyRelation;
  options: readonly { value: OptionValue; errorLabel: string | null }[];
  correctIndex: number;
  explanationTrace: ExplanationTrace;
}

function canonical(value: OptionValue): string {
  return Array.isArray(value)
    ? value.map((part) => part.trim().toLocaleLowerCase("en-IN")).join("::")
    : value.trim().toLocaleLowerCase("en-IN");
}

function randomSource(seed: number): () => number {
  let state = (seed ^ 0x85ebca6b) >>> 0;
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
  const random = randomSource(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function selectFacts(ruleId: string, seed: number): [LexicalFact, LexicalFact] {
  const facts = shuffle(lexicalFactsForRule(ruleId), seed * 31 + 5);
  if (facts.length < 12) throw new Error(`Rule ${ruleId} needs at least twelve curated facts.`);
  return [facts[0], facts[1]];
}

function wordOptions(target: LexicalFact, allFacts: readonly LexicalFact[], seed: number) {
  const distractors = shuffle(
    allFacts.filter((fact) => fact.id !== target.id && canonical(fact.right) !== canonical(target.right)),
    seed * 37 + 7,
  ).slice(0, 3);
  return shuffle([
    { value: target.right, errorLabel: null },
    ...distractors.map((fact) => ({ value: fact.right, errorLabel: "SAME_CATEGORY_WRONG_RELATION_TARGET" })),
  ], seed * 41 + 11);
}

function pairOptions(target: LexicalFact, allFacts: readonly LexicalFact[], seed: number) {
  const leftPool = shuffle(allFacts.filter((fact) => fact.id !== target.id), seed * 43 + 13);
  const rightPool = shuffle(allFacts.filter((fact) => fact.id !== target.id), seed * 47 + 17);
  const validPairs = new Set(allFacts.map((fact) => canonical([fact.left, fact.right])));
  const distractors: { value: readonly [string, string]; errorLabel: string }[] = [];
  const used = new Set<string>();
  for (const left of leftPool) {
    for (const right of rightPool) {
      const value = [left.left, right.right] as const;
      const key = canonical(value);
      if (validPairs.has(key) || used.has(key)) continue;
      used.add(key);
      distractors.push({ value, errorLabel: "MISMATCHED_VALID_CATEGORIES" });
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`Rule ${target.relation} could not form three false pairs.`);
  return shuffle([{ value: [target.left, target.right] as const, errorLabel: null }, ...distractors], seed * 53 + 19);
}

export function generateLexicalAnalogy(qlId: string, seed = 0): GeneratedLexicalAnalogy {
  const ql = lexicalQlById(qlId);
  const definition = lexicalRelationDefinition(ql.ruleId);
  const [source, target] = selectFacts(ql.ruleId, seed);
  const allFacts = lexicalFactsForRule(ql.ruleId);
  const options = ql.presentationMode === "MISSING_FOURTH_TERM"
    ? wordOptions(target, allFacts, seed)
    : pairOptions(target, allFacts, seed);
  if (new Set(options.map((option) => canonical(option.value))).size !== 4) throw new Error("Duplicate lexical options.");
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  if (correctIndex < 0 || options.filter((option) => option.errorLabel === null).length !== 1) throw new Error("Exactly one lexical option must be correct.");

  return {
    sourceA: source.left,
    sourceB: source.right,
    targetA: target.left,
    targetB: target.right,
    presentationMode: ql.presentationMode,
    relation: { family: "LEXICAL", ruleId: ql.ruleId, direction: "FORWARD", inputType: "WORD", arity: 1, parameters: { sourceFactId: source.id, targetFactId: target.id, datasetVersion: "1.0.0" } },
    options,
    correctIndex,
    explanationTrace: {
      ruleStatement: definition.ruleStatement,
      sourceDemonstration: [{ label: "Given pair", expression: `${source.left} → ${source.right}`, result: source.predicate }],
      targetApplication: [{ label: "Apply the same relationship", expression: `${target.left} → ${target.right}`, result: target.predicate }],
      conclusion: ql.presentationMode === "MISSING_FOURTH_TERM"
        ? `Therefore, ${target.right} is the correct answer.`
        : `Therefore, ${target.left} : ${target.right} preserves the same relationship.`,
      closestTrapRejection: ql.presentationMode === "MISSING_FOURTH_TERM"
        ? "The other options belong to the same broad answer category but do not satisfy the exact lexical relationship."
        : "The other pairs contain valid-looking words or phrases, but their members do not preserve the exact relationship.",
    },
  };
}
