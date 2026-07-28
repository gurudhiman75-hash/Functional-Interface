import { generateNumCp003Prototype } from "./foundation/runtime-reviewed";
import { NUM_CP003_PROTOTYPE_IDS } from "./foundation/types";

function assertOk(value: unknown, message: string): void {
  if (!value) throw new Error(message);
}

const forbidden = [
  /NUM-CP/iu,
  /PROT-/iu,
  /undefined/iu,
  /NaN/iu,
  /Infinity/iu,
  /\{\{/u,
  /\}\}/u,
];

let audited = 0;
const misconceptionIds = new Set<string>();
const topologyCounts: Record<string, number> = {};

for (const prototypeId of NUM_CP003_PROTOTYPE_IDS) {
  for (let index = 0; index < 80; index += 1) {
    const question = generateNumCp003Prototype(prototypeId, `audit-${index}`);
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

    assertOk(question.validation.ok, `${prototypeId}: ${question.validation.errors.join(" | ")}`);
    assertOk(question.optionAudit.length === 4, `${prototypeId}: option audit must contain four rows`);
    assertOk(new Set(question.optionAudit.map((row) => row.text)).size === 4, `${prototypeId}: duplicate options`);
    assertOk(question.optionAudit.filter((row) => row.misconceptionId === "CORRECT").length === 1, `${prototypeId}: incorrect CORRECT-label count`);
    assertOk(question.optionAudit.every((row) => row.diagnostic.trim().length >= 16), `${prototypeId}: option diagnostic is missing or too short`);
    assertOk(question.explanation.traps.length === 3, `${prototypeId}: expected three trap explanations`);
    assertOk(question.explanation.steps.every((step) => step.trim().length >= 12), `${prototypeId}: explanation step too short`);
    assertOk(question.explanation.shortcut.trim().length >= 20, `${prototypeId}: shortcut too short`);
    assertOk(question.explanation.verification.trim().length >= 20, `${prototypeId}: verification too short`);
    assertOk(!forbidden.some((pattern) => pattern.test(learnerText)), `${prototypeId}: forbidden learner-facing text`);
    assertOk(!question.explanation.steps.some((step) => /\([^)]*\b(?:div|lceil|rceil|times)\b[^)]*\)/u.test(step)), `${prototypeId}: unescaped mathematical command`);

    for (const row of question.optionAudit) misconceptionIds.add(row.misconceptionId);
    topologyCounts[question.hiddenState.kind] = (topologyCounts[question.hiddenState.kind] ?? 0) + 1;
    audited += 1;
  }
}

assertOk(misconceptionIds.has("CORRECT"), "CORRECT misconception label missing");
assertOk(misconceptionIds.size >= 10, `Misconception coverage too low: ${misconceptionIds.size}`);
assertOk(Object.keys(topologyCounts).length === 5, "Expected five distinct hidden-state topologies");

console.log(JSON.stringify({
  status: "PASS",
  audited,
  prototypeCount: NUM_CP003_PROTOTYPE_IDS.length,
  misconceptionIds: [...misconceptionIds].sort(),
  topologyCounts,
  permanentQlCount: 0,
}, null, 2));
