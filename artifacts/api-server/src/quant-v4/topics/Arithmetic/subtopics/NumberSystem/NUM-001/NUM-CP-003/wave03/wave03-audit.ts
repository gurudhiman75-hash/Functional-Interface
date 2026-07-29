import { generateNumCp003Wave03 } from "./runtime";
import { NUM_CP003_WAVE03_IDS } from "./types";

const ok = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const forbidden = [/NUM-CP/iu, /W3-PROT/iu, /undefined/iu, /NaN/iu, /Infinity/iu, /\{\{/u, /\}\}/u, /[\u0009\u000d]/u];

let audited = 0;
const misconceptions = new Set<string>();
const hiddenKinds = new Set<string>();

for (const id of NUM_CP003_WAVE03_IDS) {
  for (let index = 0; index < 60; index += 1) {
    const question = generateNumCp003Wave03(id, `audit-${index}`);
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
    ].join("\n");
    ok(question.validation.ok, `${id}: ${question.validation.errors.join(" | ")}`);
    ok(!forbidden.some((pattern) => pattern.test(learnerText)), `${id}: forbidden learner text`);
    ok(question.optionAudit.length === 4, `${id}: option count`);
    ok(question.optionAudit.filter((row) => row.misconceptionId === "CORRECT").length === 1, `${id}: correct option audit`);
    ok(question.optionAudit.every((row) => row.diagnostic.length >= 16), `${id}: diagnostic`);
    ok(question.explanation.steps.every((step) => step.length >= 12), `${id}: short step`);
    ok(question.explanation.traps.length === 3, `${id}: trap count`);
    ok(question.reviewStatus === "UNREVIEWED_DISCOVERY_CANDIDATE", `${id}: review leak`);
    ok(question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE", `${id}: lifecycle leak`);
    for (const row of question.optionAudit) misconceptions.add(row.misconceptionId);
    hiddenKinds.add(question.hiddenState.kind);
    audited += 1;
  }
}

ok(hiddenKinds.size === 7, `hidden kinds ${[...hiddenKinds]}`);
ok(misconceptions.size >= 18, `misconceptions ${misconceptions.size}`);

console.log(JSON.stringify({
  status: "PASS",
  audited,
  prototypeCount: NUM_CP003_WAVE03_IDS.length,
  hiddenKinds: [...hiddenKinds].sort(),
  misconceptions: [...misconceptions].sort(),
  permanentQlCount: 0,
}, null, 2));
