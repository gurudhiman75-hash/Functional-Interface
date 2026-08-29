import assert from "node:assert/strict";

import {
  buildEventAssociationQuestion,
  buildFactRecallQuestion,
  generateCurrentAffairsQuestions,
  renderCompilationMarkdown,
  renderEventStudyMarkdown,
  type CurrentAffairsContentEvent,
} from "./content";

const baseEvent: CurrentAffairsContentEvent = {
  id: "00000000-0000-4000-8000-000000000001",
  publicCode: "CA-20260829-AAAAAA",
  title: "Reserve Bank launches Example Payments Framework",
  summary: "The Reserve Bank announced a new framework for digital payments.",
  importanceReason: "The development is relevant to banking awareness and payment-system questions.",
  eventDate: "2026-08-29",
  category: "economy_banking",
  examFamily: "banking",
  examScore: 94,
  facts: [
    { id: "10000000-0000-4000-8000-000000000001", key: "Organisation", value: "Reserve Bank of India", type: "entity" },
    { id: "10000000-0000-4000-8000-000000000002", key: "Launch date", value: "29 August 2026", type: "date" },
  ],
};

const recall = buildFactRecallQuestion(baseEvent, baseEvent.facts[0]!, [
  "Securities and Exchange Board of India",
  "National Payments Corporation of India",
  "Insurance Regulatory and Development Authority of India",
  "Reserve Bank of India",
]);
assert.ok(recall);
assert.equal(recall.family, "CA-QL-001");
assert.equal((recall.payload.options as string[]).length, 4);
assert.equal((recall.payload.options as string[])[Number(recall.payload.correctIndex)], "Reserve Bank of India");
assert.equal((recall.payload.generationContext as any).questionBankAcceptanceMode, "BANK_ONLY");
assert.equal((recall.payload.generationContext as any).publiclyPublishable, false);

assert.equal(
  buildFactRecallQuestion(baseEvent, baseEvent.facts[0]!, ["Only one", "Only two"]),
  null,
  "a question must be skipped rather than inventing missing distractors",
);

const association = buildEventAssociationQuestion(baseEvent, baseEvent.facts[0]!, [
  "SEBI releases investor survey",
  "ISRO launches observation satellite",
  "Punjab Cabinet approves agriculture initiative",
]);
assert.ok(association);
assert.equal(association.family, "CA-QL-002");
assert.match(String(association.payload.explanation), /Reserve Bank of India/);

const studyNote = renderEventStudyMarkdown(baseEvent);
assert.match(studyNote, /## In one line/);
assert.match(studyNote, /## Key facts/);
assert.match(studyNote, /Reserve Bank of India/);
assert.match(studyNote, /## Exam focus/);

const pool: CurrentAffairsContentEvent[] = [
  baseEvent,
  {
    ...baseEvent,
    id: "00000000-0000-4000-8000-000000000002",
    publicCode: "CA-20260828-BBBBBB",
    title: "SEBI announces Example Investor Initiative",
    facts: [{ key: "Organisation", value: "Securities and Exchange Board of India", type: "entity" }],
  },
  {
    ...baseEvent,
    id: "00000000-0000-4000-8000-000000000003",
    publicCode: "CA-20260827-CCCCCC",
    title: "NPCI introduces Example Payment Feature",
    facts: [{ key: "Organisation", value: "National Payments Corporation of India", type: "entity" }],
  },
  {
    ...baseEvent,
    id: "00000000-0000-4000-8000-000000000004",
    publicCode: "CA-20260826-DDDDDD",
    title: "IRDAI issues Example Insurance Direction",
    facts: [{ key: "Organisation", value: "Insurance Regulatory and Development Authority of India", type: "entity" }],
  },
];

const generated = generateCurrentAffairsQuestions([baseEvent], pool, 10);
assert.ok(generated.some((question) => question.family === "CA-QL-001"));
assert.ok(generated.some((question) => question.family === "CA-QL-002"));
for (const question of generated) {
  const options = question.payload.options as string[];
  assert.equal(new Set(options.map((value) => value.toLowerCase())).size, options.length);
}

const compilation = renderCompilationMarkdown({
  title: "Daily Current Affairs — 29 August 2026",
  periodLabel: "29 August 2026",
  examFamily: "banking",
  events: [baseEvent],
});
assert.match(compilation, /## Rapid revision/);
assert.match(compilation, /Economy Banking/);
assert.match(compilation, /Exam relevance/);
assert.doesNotMatch(compilation, /raw newspaper/i);

console.log("Current Affairs Studio CP004 content contracts passed");
