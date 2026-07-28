import { generateNumCp003RetainedQuestion, NUM_CP003_RETAINED_TEMPLATE_LABELS } from "./runtime";

const ok = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const forbidden = [
  /NUM-CP003-QLT/iu,
  /NUM-CP/iu,
  /PROT-/iu,
  /undefined/iu,
  /NaN/iu,
  /Infinity/iu,
  /\{\{/u,
  /\}\}/u,
  /[\t\r]/u,
];

let audited = 0;
const topologyCounts: Record<string, number> = {};
const misconceptionIds = new Set<string>();
const optionCounts = new Set<number>();
let linkedMaterialStates = 0;
let implicitRepeatedStates = 0;
let leadingSingleDigitStates = 0;

for (const label of NUM_CP003_RETAINED_TEMPLATE_LABELS) {
  for (let index = 0; index < 60; index += 1) {
    const question = generateNumCp003RetainedQuestion(label, `audit-${index}`);
    const learnerText = [
      question.stem,
      ...question.options,
      question.explanation.coreConcept,
      question.explanation.strategy,
      ...question.explanation.steps,
      question.explanation.shortcut,
      question.explanation.verification,
      question.explanation.conclusion,
      ...question.explanation.traps,
      ...question.optionAudit.map((row) => row.diagnostic),
      ...question.reasoningGraph.nodes.map((node) => node.text),
    ].join("\n");

    ok(question.validation.ok, `${label}: ${question.validation.errors.join(" | ")}`);
    ok(question.options.length === (label === "NUM-CP003-QLT2-16" ? 5 : 4), `${label}: option count`);
    ok(new Set(question.options).size === question.options.length, `${label}: duplicate options`);
    ok(question.optionAudit.filter((row) => row.misconceptionId === "CORRECT").length === 1, `${label}: correct-label count`);
    ok(question.optionAudit.every((row) => row.diagnostic.trim().length >= 16), `${label}: short diagnostic`);
    ok(question.explanation.steps.length >= 3, `${label}: explanation steps`);
    ok(question.explanation.steps.every((step) => step.trim().length >= 16), `${label}: terse explanation step`);
    ok(question.explanation.shortcut.trim().length >= 24, `${label}: shortcut too short`);
    ok(question.explanation.verification.trim().length >= 20, `${label}: verification too short`);
    ok(question.explanation.traps.length === 3, `${label}: trap count`);
    ok(question.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"), `${label}: verification node missing`);
    ok(!forbidden.some((pattern) => pattern.test(learnerText)), `${label}: forbidden learner-facing text`);
    ok(question.permanentQlId === null, `${label}: permanent ID assigned`);
    ok(question.questionBankStatus === "NOT_STORED", `${label}: Question Bank status`);
    ok(question.testEligibility === "INELIGIBLE", `${label}: test eligibility`);
    ok(!question.publiclyPublishable && !question.questionStudioDiscoverable, `${label}: exposure leak`);

    const state = question.hiddenState;
    if (state.kind === "SINGLE_DIGIT_CANDIDATE_SET" && state.template.startsWith("X")) leadingSingleDigitStates += 1;
    if (state.kind === "LINKED_ARITHMETIC_DIVISIBILITY") {
      ok(state.arithmeticPairs.length > state.validPairs.length, `${label}: linked filtering is decorative`);
      ok(state.validPairs.length >= 2, `${label}: linked extremum lacks multiple valid states`);
      linkedMaterialStates += 1;
    }
    if (state.kind === "IMPLICIT_REPEATED_NUMERAL") {
      ok(!question.stem.includes(state.number.toString()), `${label}: implicit number leaked into stem`);
      implicitRepeatedStates += 1;
    }
    if (state.kind === "DATA_SUFFICIENCY") {
      ok(state.candidatesTogether.length > 0, `${label}: inconsistent data-sufficiency statements`);
    }
    if (state.kind === "CLAIM_VALIDATION") {
      const truths = state.claims.map((claim) => claim.isTrue);
      const desired = state.requestedPolarity === "CORRECT";
      ok(truths.filter((truth) => truth === desired).length === 1, `${label}: claim truth uniqueness`);
    }

    for (const row of question.optionAudit) misconceptionIds.add(row.misconceptionId);
    topologyCounts[state.kind] = (topologyCounts[state.kind] ?? 0) + 1;
    optionCounts.add(question.options.length);
    audited += 1;
  }
}

ok(audited === 17 * 60, `audited count ${audited}`);
ok(Object.keys(topologyCounts).length === 9, `hidden-state topology count ${Object.keys(topologyCounts).length}`);
ok(misconceptionIds.size >= 18, `misconception coverage ${misconceptionIds.size}`);
ok(optionCounts.has(4) && optionCounts.has(5), `option-count coverage ${[...optionCounts]}`);
ok(linkedMaterialStates === 60, `linked material states ${linkedMaterialStates}`);
ok(implicitRepeatedStates === 60, `implicit repeated states ${implicitRepeatedStates}`);
ok(leadingSingleDigitStates > 0, "leading-position single-digit coverage missing");

console.log(JSON.stringify({
  status: "PASS",
  audited,
  templateCount: NUM_CP003_RETAINED_TEMPLATE_LABELS.length,
  topologyCounts,
  misconceptionIds: [...misconceptionIds].sort(),
  optionCounts: [...optionCounts].sort(),
  linkedMaterialStates,
  implicitRepeatedStates,
  leadingSingleDigitStates,
  permanentQlCount: 0,
}, null, 2));
