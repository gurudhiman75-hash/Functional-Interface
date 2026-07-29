import type { DeterministicRandom } from "../../foundation/prng";
import { RULES, audit, nodes } from "./core";
import type { NumDifficulty, Wave04AnswerSemantic, Wave04Explanation, Wave04HiddenState, Wave04OptionAudit } from "./types";

export interface RawWave04 {
  hiddenState: Wave04HiddenState;
  difficulty: NumDifficulty;
  answerSemantic: Wave04AnswerSemantic;
  stem: string;
  answer: string;
  options: Wave04OptionAudit[];
  explanation: Wave04Explanation;
  nodes: ReturnType<typeof nodes>;
  fingerprint: string;
}

export function divisorFromRule(random: DeterministicRandom): RawWave04 {
  const correct = random.pick(RULES);
  const wrong = random.shuffle(RULES.filter((rule) => rule.ruleId !== correct.ruleId)).slice(0, 3);
  return {
    hiddenState: { kind: "RULE_RECOGNITION", direction: "DIVISOR_FROM_RULE", ruleId: correct.ruleId, divisor: correct.divisor, ruleText: correct.ruleText },
    difficulty: correct.divisor === 11n || correct.divisor === 8n ? "Medium" : "Easy",
    answerSemantic: "DIVISOR",
    stem: `A number satisfies the following test: ${correct.ruleText} Which divisor is this test designed to check?`,
    answer: correct.divisor.toString(),
    options: [
      audit(correct.divisor.toString(), "CORRECT", `This is the standard divisibility test for ${correct.divisor}.`),
      ...wrong.map((rule) => audit(rule.divisor.toString(), rule.misconceptionId, `Divisibility by ${rule.divisor} uses the different test: ${rule.ruleText}`)),
    ],
    explanation: {
      coreConcept: "Each elementary divisibility rule is tied to a specific divisor and place-value property.",
      strategy: "Identify whether the test uses the last digit, a terminal block, digit sum or alternating digit sum.",
      steps: [`The stated test is: ${correct.ruleText}`, `That rule belongs to divisor ${correct.divisor}.`, "The other options require different digit evidence."],
      shortcut: "First classify the evidence type: last digit, last two/three digits, digit sum or alternating sum.",
      verification: `The registered exact rule map links ${correct.ruleId} only to divisor ${correct.divisor}.`,
      conclusion: `Therefore, the required divisor is ${correct.divisor}.`,
      traps: ["Digit-sum rules do not apply to every divisor.", "Last-two and last-three-digit tests are different.", "The alternating-sum rule is specific to 11."],
    },
    nodes: nodes(correct.ruleText, "Match evidence type to its divisor.", `${correct.ruleId} → ${correct.divisor}.`, "The other rule descriptions map to different divisors.", `Answer ${correct.divisor}.`),
    fingerprint: `divisor-from-rule:${correct.ruleId}`,
  };
}

export function ruleFromDivisor(random: DeterministicRandom): RawWave04 {
  const correct = random.pick(RULES);
  const wrong = random.shuffle(RULES.filter((rule) => rule.ruleId !== correct.ruleId)).slice(0, 3);
  return {
    hiddenState: { kind: "RULE_RECOGNITION", direction: "RULE_FROM_DIVISOR", ruleId: correct.ruleId, divisor: correct.divisor, ruleText: correct.ruleText },
    difficulty: correct.divisor === 11n || correct.divisor === 25n ? "Medium" : "Easy",
    answerSemantic: "RULE",
    stem: `Which statement gives the correct divisibility test for ${correct.divisor}?`,
    answer: correct.ruleText,
    options: [
      audit(correct.ruleText, "CORRECT", `This is the exact divisibility test for ${correct.divisor}.`),
      ...wrong.map((rule) => audit(rule.ruleText, rule.misconceptionId, `This statement tests divisibility by ${rule.divisor}, not by ${correct.divisor}.`)),
    ],
    explanation: {
      coreConcept: `Divisibility by ${correct.divisor} has a specific digit-based test.`,
      strategy: "Compare the divisor with the place-value or digit-sum evidence named in each option.",
      steps: [`The target divisor is ${correct.divisor}.`, `Its standard rule is: ${correct.ruleText}`, "Each remaining statement belongs to a different divisor."],
      shortcut: "Memorise rules by evidence family rather than as disconnected sentences.",
      verification: `The registered rule map identifies ${correct.ruleId} as the ${correct.divisor}-test.`,
      conclusion: `Therefore, “${correct.ruleText}” is the correct rule.`,
      traps: ["Do not interchange tests for 3 and 9.", "Do not use the last-two-digit rule when the divisor needs three digits.", "A rule can be sufficient for one divisor but not another."],
    },
    nodes: nodes(`Target divisor ${correct.divisor}.`, "Retrieve its exact digit rule.", correct.ruleText, "All other displayed rules map elsewhere.", correct.ruleText),
    fingerprint: `rule-from-divisor:${correct.ruleId}`,
  };
}
