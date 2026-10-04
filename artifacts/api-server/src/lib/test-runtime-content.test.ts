import assert from "node:assert/strict";
import test from "node:test";

import {
  descriptiveAssignments,
  inspectDescriptiveTasks,
  normalizeDescriptiveResponses,
  readSharedStimulus,
} from "./test-runtime-content";

test("reads shared stimulus from Question Bank generation metadata", () => {
  const stimulus = readSharedStimulus({
    generation: {
      sharedStimulus: {
        id: "BANK-RC-1",
        kind: "passage",
        title: "Banking passage",
        text: "A shared passage used by several questions.",
      },
    },
  });
  assert.equal(stimulus?.id, "BANK-RC-1");
  assert.equal(stimulus?.kind, "passage");
});

test("inspects descriptive tasks and preserves a comprehension stimulus", () => {
  const inspected = inspectDescriptiveTasks({
    descriptiveTasks: [
      {
        id: "essay-1",
        kind: "essay",
        prompt: "Write an essay.",
        marks: 15,
        minWords: 200,
        maxWords: 300,
      },
      {
        id: "comp-1",
        kind: "comprehension",
        prompt: "Summarise the passage.",
        marks: 10,
        maxWords: 150,
        stimulus: {
          id: "passage-1",
          kind: "passage",
          text: "Digital banking expands access while increasing operational responsibilities.",
        },
      },
    ],
  });

  assert.deepEqual(inspected.issues, []);
  assert.equal(inspected.tasks.length, 2);
  assert.equal(inspected.tasks[1]?.stimulus?.id, "passage-1");
});

test("normalizes descriptive submissions against immutable task identity", () => {
  const sections = [
    {
      id: "section-desc",
      name: "Descriptive English",
      settings: {
        descriptiveTasks: [
          { id: "essay-1", kind: "essay", prompt: "Write an essay.", marks: 15, maxWords: 300 },
          { id: "comp-1", kind: "comprehension", prompt: "Summarise the passage.", marks: 10, maxWords: 150 },
        ],
      },
    },
  ];
  const assignments = descriptiveAssignments(sections);
  const first = assignments[0]!;
  const snapshots = normalizeDescriptiveResponses([
    {
      questionId: first.questionId,
      taskId: first.task.id,
      sectionId: first.sectionId,
      text: "Banking resilience depends on prudent risk management.",
      timeTaken: 350,
    },
  ], assignments);

  assert.equal(snapshots.length, 2);
  assert.equal(snapshots[0]?.wordCount, 7);
  assert.equal(snapshots[0]?.submitted, true);
  assert.equal(snapshots[0]?.awardedMarks, null);
  assert.equal(snapshots[1]?.submitted, false);
});

test("rejects descriptive responses that do not belong to the immutable test", () => {
  const assignments = descriptiveAssignments([{
    id: "section-desc",
    name: "Descriptive English",
    settings: { descriptiveTasks: [{ id: "essay-1", kind: "essay", prompt: "Write.", marks: 15 }] },
  }]);

  assert.throws(
    () => normalizeDescriptiveResponses([{
      questionId: 999999,
      taskId: "essay-1",
      sectionId: "section-desc",
      text: "Answer",
    }], assignments),
    /does not belong/i,
  );
});
