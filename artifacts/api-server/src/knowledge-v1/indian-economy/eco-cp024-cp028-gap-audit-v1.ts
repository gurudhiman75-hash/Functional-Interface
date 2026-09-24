import { ECO_CP024_REVIEW_V1 } from "./insurance-pension-system/eco-cp024-review-generator-v1";
import { ECO_CP024_SOURCE_IDS_V1 } from "./insurance-pension-system/eco-cp024-sources";
import { ECO_CP024_FACTS_V1 } from "./insurance-pension-system/eco-cp024-facts";
import { ECO_CP025_REVIEW_V1 } from "./banking-regulation-inclusion-payments/eco-cp025-review-generator-v1";
import { ECO_CP025_SOURCE_IDS_V1 } from "./banking-regulation-inclusion-payments/eco-cp025-sources";
import { ECO_CP025_FACTS_V1 } from "./banking-regulation-inclusion-payments/eco-cp025-facts";
import { ECO_CP026_REVIEW_V1 } from "./white-revolution-cooperative-dairy/eco-cp026-review-generator-v1";
import { ECO_CP026_SOURCE_IDS_V1 } from "./white-revolution-cooperative-dairy/eco-cp026-sources";
import { ECO_CP026_FACTS_V1 } from "./white-revolution-cooperative-dairy/eco-cp026-facts";
import { ECO_CP027_REVIEW_V1 } from "./derivatives-risk-management/eco-cp027-review-generator-v1";
import { ECO_CP027_SOURCE_IDS_V1 } from "./derivatives-risk-management/eco-cp027-sources";
import { ECO_CP027_FACTS_V1 } from "./derivatives-risk-management/eco-cp027-facts";
import { ECO_CP028_REVIEW_V1 } from "./fiscal-federalism-finance-commission/eco-cp028-review-generator-v1";
import { ECO_CP028_SOURCE_IDS_V1 } from "./fiscal-federalism-finance-commission/eco-cp028-sources";
import { ECO_CP028_FACTS_V1 } from "./fiscal-federalism-finance-commission/eco-cp028-facts";

const fail = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const mechanical = [
  /\bmainly\b/iu,
  /\bgenerally\b/iu,
  /\bprimarily\b/iu,
  /\bnormally\b/iu,
  /\btypically\b/iu,
  /best fits/iu,
  /most directly/iu,
  /best described/iu,
  /best describes/iu,
  /most appropriate/iu,
  /main purpose/iu,
  /best separates/iu,
  /most accurate/iu,
  /most likely/iu,
  /best distinguishes/iu,
  /main role/iu,
  /best represents/iu,
  /best reflects/iu,
  /best summarises/iu,
  /associated with/iu,
  /all else equal/iu,
] as const;

const volatile = [
  /current (?:rate|ratio|limit|ceiling|target|share|member|chair|chief|ranking|volume|value|price)/iu,
  /latest (?:rate|ratio|figure|data|ranking|allocation|target|volume|limit)/iu,
  /today(?:'s)? (?:rate|price|value|level)/iu,
] as const;

type Batch = readonly [
  label: string,
  questions: readonly any[],
  expectedQuestions: number,
  expectedQls: number,
  sourceIds: readonly string[],
  facts: readonly { id: string; sourceIds: readonly string[] }[],
];

const batches: readonly Batch[] = [
  ["CP024", ECO_CP024_REVIEW_V1, 28, 7, ECO_CP024_SOURCE_IDS_V1, ECO_CP024_FACTS_V1],
  ["CP025", ECO_CP025_REVIEW_V1, 32, 8, ECO_CP025_SOURCE_IDS_V1, ECO_CP025_FACTS_V1],
  ["CP026", ECO_CP026_REVIEW_V1, 20, 5, ECO_CP026_SOURCE_IDS_V1, ECO_CP026_FACTS_V1],
  ["CP027", ECO_CP027_REVIEW_V1, 20, 5, ECO_CP027_SOURCE_IDS_V1, ECO_CP027_FACTS_V1],
  ["CP028", ECO_CP028_REVIEW_V1, 24, 6, ECO_CP028_SOURCE_IDS_V1, ECO_CP028_FACTS_V1],
];

const allIds = new Set<string>();
let total = 0;

for (const [label, questions, expectedQuestions, expectedQls, sourceIds, facts] of batches) {
  fail(questions.length === expectedQuestions, `${label}: expected ${expectedQuestions} questions; found ${questions.length}`);
  const qlIds = [...new Set(questions.map((q) => q.qlId))];
  fail(qlIds.length === expectedQls, `${label}: expected ${expectedQls} QLs; found ${qlIds.length}`);

  for (const qlId of qlIds) {
    const count = questions.filter((q) => q.qlId === qlId).length;
    fail(count === 4, `${label}/${qlId}: expected 4 questions; found ${count}`);
  }

  const difficulties = new Set(questions.map((q) => q.difficulty));
  for (const difficulty of ["Easy", "Medium", "Hard"]) {
    fail(difficulties.has(difficulty), `${label}: missing ${difficulty} difficulty`);
  }

  const answerPositions = new Set(questions.map((q) => q.correctIndex));
  fail(answerPositions.size === 4, `${label}: all four answer positions must be represented`);

  const sourceSet = new Set(sourceIds);
  const factMap = new Map(facts.map((fact) => [fact.id, fact]));
  for (const fact of facts) {
    fail(fact.sourceIds.length > 0, `${label}/${fact.id}: fact has no source`);
    for (const sourceId of fact.sourceIds) {
      fail(sourceSet.has(sourceId), `${label}/${fact.id}: unknown source ${sourceId}`);
    }
  }

  for (const question of questions) {
    fail(!allIds.has(question.questionId), `${question.questionId}: duplicate question id across gap packs`);
    allIds.add(question.questionId);

    fail(question.reviewOnly === true && question.runtimeRegistered === false, `${question.questionId}: lifecycle boundary changed`);
    fail(question.options.length === 4, `${question.questionId}: expected four options`);
    fail(new Set(question.options).size === 4, `${question.questionId}: duplicate options`);
    fail(question.correctIndex >= 0 && question.correctIndex < 4, `${question.questionId}: invalid correct index`);
    fail(question.options[question.correctIndex] === question.canonicalAnswer, `${question.questionId}: answer/index mismatch`);
    fail(question.stem.trim().endsWith("?"), `${question.questionId}: ordinary exam stem must end in ?`);
    fail(question.stem.length <= 240, `${question.questionId}: stem is too long`);
    fail(question.explanation.trim().length >= 25, `${question.questionId}: explanation is too thin`);

    for (const pattern of mechanical) {
      fail(!pattern.test(question.stem), `${question.questionId}: mechanical stem wording ${pattern}`);
    }
    for (const pattern of volatile) {
      fail(!pattern.test(question.stem), `${question.questionId}: volatile current-data wording ${pattern}`);
    }

    fail(question.sourceIds.length > 0, `${question.questionId}: no source IDs`);
    fail(question.sourceFactIds.length > 0, `${question.questionId}: no source-fact IDs`);
    for (const sourceId of question.sourceIds) {
      fail(sourceSet.has(sourceId), `${question.questionId}: unknown source ${sourceId}`);
    }
    for (const factId of question.sourceFactIds) {
      const fact = factMap.get(factId);
      fail(Boolean(fact), `${question.questionId}: unknown source fact ${factId}`);
      fail(
        fact!.sourceIds.some((sourceId) => question.sourceIds.includes(sourceId)),
        `${question.questionId}: source-fact ${factId} has no supporting source carried by the question`,
      );
    }
  }

  total += questions.length;
}

fail(total === 124, `Expected 124 coverage-gap questions; found ${total}`);
console.log("Economy CP024-CP028 English coverage-gap audit passed: 124 questions / 31 QLs.");
