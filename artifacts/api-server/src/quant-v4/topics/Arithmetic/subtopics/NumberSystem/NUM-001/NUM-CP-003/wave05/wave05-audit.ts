import { generateNumCp003Wave05 } from "./runtime";
import { NUM_CP003_WAVE05_IDS } from "./types";

const ok = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const forbidden = [/NUM-CP/iu, /PROT-/iu, /undefined/iu, /NaN/iu, /Infinity/iu, /\{\{/u, /\}\}/u, /[\t\r]/u];

let audited = 0;
const misconceptions = new Set<string>();
const topologyCounts: Record<string, number> = {};
const leadingTemplates = new Set<string>();
let materiallyFilteredLinkedStates = 0;

for (const id of NUM_CP003_WAVE05_IDS) {
  for (let index = 0; index < 60; index += 1) {
    const question = generateNumCp003Wave05(id, `audit-${index}`);
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
    ].join("\n");

    ok(question.validation.ok, `${id}: ${question.validation.errors.join(" | ")}`);
    ok(question.options.length === 4 && new Set(question.options).size === 4, `${id}: option failure`);
    ok(question.optionAudit.filter((row) => row.misconceptionId === "CORRECT").length === 1, `${id}: correct-label count`);
    ok(question.optionAudit.every((row) => row.diagnostic.trim().length >= 16), `${id}: diagnostic failure`);
    ok(question.explanation.steps.every((step) => step.trim().length >= 16), `${id}: short explanation step`);
    ok(question.explanation.shortcut.trim().length >= 24, `${id}: short shortcut`);
    ok(question.explanation.verification.trim().length >= 20, `${id}: short verification`);
    ok(question.explanation.traps.length === 3, `${id}: trap count`);
    ok(!forbidden.some((pattern) => pattern.test(learnerText)), `${id}: forbidden learner-facing text`);
    ok(question.permanentQlId === null, `${id}: permanent ID assigned`);
    ok(question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE", `${id}: lifecycle failure`);
    ok(!question.publiclyPublishable && !question.questionStudioDiscoverable, `${id}: exposure failure`);

    if (question.hiddenState.kind === "SINGLE_DIGIT_CANDIDATE_SET") {
      ok(question.hiddenState.validDigits.length >= 2, `${id}: candidate set too small`);
      if (question.hiddenState.template.startsWith("X")) leadingTemplates.add(id);
      if (question.answerSemantic === "NUMBER") {
        ok(question.answer.length === question.hiddenState.template.length, `${id}: completed-number length changed`);
      }
    } else {
      ok(question.hiddenState.arithmeticPairs.length > question.hiddenState.validPairs.length, `${id}: divisibility did not filter arithmetic pairs`);
      ok(question.hiddenState.validPairs.length >= 2, `${id}: extremum did not retain multiple valid values`);
      materiallyFilteredLinkedStates += 1;
    }

    for (const row of question.optionAudit) misconceptions.add(row.misconceptionId);
    topologyCounts[question.hiddenState.kind] = (topologyCounts[question.hiddenState.kind] ?? 0) + 1;
    audited += 1;
  }
}

ok(Object.keys(topologyCounts).length === 2, `topology coverage ${Object.keys(topologyCounts)}`);
ok(misconceptions.size >= 8, `misconception coverage ${misconceptions.size}`);
ok(materiallyFilteredLinkedStates === 60, `linked filtering coverage ${materiallyFilteredLinkedStates}`);
ok(leadingTemplates.size >= 2, `leading-position coverage ${[...leadingTemplates]}`);

console.log(JSON.stringify({
  status: "PASS",
  audited,
  prototypeCount: NUM_CP003_WAVE05_IDS.length,
  topologyCounts,
  misconceptionIds: [...misconceptions].sort(),
  leadingPrototypeIds: [...leadingTemplates].sort(),
  materiallyFilteredLinkedStates,
  permanentQlCount: 0,
}, null, 2));
