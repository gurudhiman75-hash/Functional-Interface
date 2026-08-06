import { generateClsCp004DiscoveryQuestion } from "./discovery-runtime";
import { CLS_CP004_PROTOTYPES, CLS_CP004_RULE_IDS } from "./number-domain";

const fingerprints = new Set<string>();
const prototypeCoverage = new Map<string, number>();
const ruleCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const valueCoverage = new Map<string, Set<string>>();
const answerPositions = new Map<4 | 5, number[]>([
  [4, [0, 0, 0, 0, 0]],
  [5, [0, 0, 0, 0, 0]],
]);

for (const prototype of CLS_CP004_PROTOTYPES) {
  for (const optionCount of [4, 5] as const) {
    for (let seed = 0; seed < 70; seed += 1) {
      const question = generateClsCp004DiscoveryQuestion(prototype.prototypeId, seed, optionCount);
      fingerprints.add(JSON.stringify({
        prototypeId: question.prototypeId,
        optionCount,
        stem: question.stem,
        numbers: question.numbers,
        answer: question.answer,
      }));
      prototypeCoverage.set(prototype.prototypeId, (prototypeCoverage.get(prototype.prototypeId) ?? 0) + 1);
      ruleCoverage.add(question.intendedRuleId);
      const values = valueCoverage.get(question.intendedRuleId) ?? new Set<string>();
      values.add(question.intendedRuleValue);
      valueCoverage.set(question.intendedRuleId, values);
      difficultyCoverage.add(question.difficulty);
      answerPositions.get(optionCount)![question.correctIndex] += 1;
    }
  }
}

console.log("CLS-CP-004 aggregate coverage diagnostic.", {
  generated: CLS_CP004_PROTOTYPES.length * 2 * 70,
  uniqueVisibleQuestions: fingerprints.size,
  prototypeCoverage: Object.fromEntries(prototypeCoverage),
  admittedRules: CLS_CP004_RULE_IDS.length,
  exercisedRules: ruleCoverage.size,
  missingRules: CLS_CP004_RULE_IDS.filter((ruleId) => !ruleCoverage.has(ruleId)),
  difficulties: [...difficultyCoverage].sort(),
  valueCoverage: Object.fromEntries(
    [...valueCoverage].map(([ruleId, values]) => [ruleId, [...values].sort()]),
  ),
  answerPositions: Object.fromEntries(answerPositions),
});