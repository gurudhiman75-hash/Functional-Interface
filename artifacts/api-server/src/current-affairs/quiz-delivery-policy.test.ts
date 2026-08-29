import assert from "node:assert/strict";

import {
  gradeCurrentAffairsQuiz,
  learnerQuizQuestion,
  normalizeQuizLanguage,
  quizSnapshotPayload,
} from "./quiz-delivery-policy";

const payload = quizSnapshotPayload({
  stem: "Which institution released the Financial Inclusion Index?",
  explanation: "The Reserve Bank of India releases the Financial Inclusion Index.",
  options: ["RBI", "SEBI", "NABARD", "IRDAI"],
  correctIndex: 0,
  provenance: { shouldNotLeak: true },
});
assert.ok(payload);
assert.equal(normalizeQuizLanguage("HI"), "hi");
assert.equal(normalizeQuizLanguage("fr"), null);

const learner = learnerQuizQuestion({
  id: "item-1",
  itemNumber: 1,
  questionFamily: "CA-QL-001",
  payload: payload!,
});
assert.deepEqual(Object.keys(learner).sort(), ["id", "itemNumber", "options", "questionFamily", "stem"].sort());
assert.equal("correctIndex" in learner, false);
assert.equal("explanation" in learner, false);

const items = [
  { id: "item-1", itemNumber: 1, questionFamily: "CA-QL-001", payload: payload! },
  {
    id: "item-2",
    itemNumber: 2,
    questionFamily: "CA-QL-002",
    payload: {
      stem: "Which event matches the value 75?",
      explanation: "Event B has the verified value 75.",
      options: ["Event A", "Event B", "Event C", "Event D"],
      correctIndex: 1,
    },
  },
  {
    id: "item-3",
    itemNumber: 3,
    questionFamily: "CA-QL-001",
    payload: {
      stem: "Which value is correct?",
      explanation: "The correct value is 12%.",
      options: ["10%", "11%", "12%", "13%"],
      correctIndex: 2,
    },
  },
];
const grade = gradeCurrentAffairsQuiz({
  items,
  answers: [
    { id: "item-1", selectedIndex: 0 },
    { id: "item-2", selectedIndex: 3 },
  ],
});
assert.equal(grade.total, 3);
assert.equal(grade.correct, 1);
assert.equal(grade.wrong, 1);
assert.equal(grade.unanswered, 1);
assert.equal(grade.scorePercent, 33.33);
assert.equal(grade.results[0]?.correctAnswer, "RBI");
assert.equal(grade.results[2]?.selectedIndex, null);

const invalidSelection = gradeCurrentAffairsQuiz({
  items: [items[0]!],
  answers: [{ id: "item-1", selectedIndex: 99 }],
});
assert.equal(invalidSelection.unanswered, 1);
assert.equal(invalidSelection.wrong, 0);

process.stdout.write("Current Affairs Studio CP016 learner quiz policy contracts passed\n");
