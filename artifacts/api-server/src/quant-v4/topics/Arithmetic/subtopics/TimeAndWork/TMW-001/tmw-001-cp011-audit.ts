import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmwCp011Pipeline } from "./foundation/cp011-runtime";

const outputQlIds = new Set(["TMW-QL-193", "TMW-QL-195", "TMW-QL-197", "TMW-QL-199", "TMW-QL-204", "TMW-QL-205", "TMW-QL-206", "TMW-QL-209"]);
const inverseUnknownGuards: Record<string, RegExp[]> = {
  "TMW-QL-195": [/Initial daily output:/],
  "TMW-QL-196": [/Daily arithmetic change:/],
  "TMW-QL-199": [/Initial daily output:/],
  "TMW-QL-200": [/Daily multiplier:/],
  "TMW-QL-202": [/Rate switch occurs after day/],
  "TMW-QL-203": [/Post-switch rate:/],
  "TMW-QL-211": [/Post-switch rate:/],
};
const normalizedStemOwners = new Map<string, string>();
const failures: string[] = [];
let total = 0;
let mathJaxFractionalTimes = 0;

function normalizeStem(stem: string): string {
  return stem.toLowerCase().replace(/\\\([^)]*\\\)/g, "<math>").replace(/\d+/g, "#").replace(/[^a-z#<>]+/g, " ").trim();
}

for (const entry of TMW_CP_011_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const question = runTmwCp011Pipeline(entry.qlId, `audit-${entry.qlId}-${index}`);
    total += 1;
    if (!question.validation.valid) failures.push(`${entry.qlId}:${index}:${question.validation.errors.join(",")}`);
    const learnerText = [
      question.stem,
      ...question.options,
      question.solution.answerText,
      question.explanation.opening,
      question.explanation.formula,
      ...question.explanation.givens,
      ...question.explanation.steps,
      ...question.explanation.shortcut.steps,
      question.explanation.commonTrap.explanation,
      question.explanation.conclusion,
    ].join("\n");
    if (outputQlIds.has(entry.qlId) && question.optionAudit.some((option) => option.value.denominator !== 1)) failures.push(`${entry.qlId}:${index}:fractional discrete output option`);
    if (question.parameters.targetOutput && question.parameters.targetOutput.denominator !== 1) failures.push(`${entry.qlId}:${index}:fractional discrete target`);
    if (outputQlIds.has(entry.qlId) && question.explanation.givens.some((line) => line.startsWith("Total output:"))) failures.push(`${entry.qlId}:${index}:answer leaked into givens`);
    for (const guard of inverseUnknownGuards[entry.qlId] ?? []) if (question.explanation.givens.some((line) => guard.test(line))) failures.push(`${entry.qlId}:${index}:inverse unknown leaked into givens`);
    if (/\b\d+\s+\d+\/\d+\s+days?\b|\b\d+\/\d+\s+days?\b/.test(learnerText)) failures.push(`${entry.qlId}:${index}:ASCII fractional time`);
    if (/Do not choose|Don't choose/i.test(learnerText)) failures.push(`${entry.qlId}:${index}:negative trap command`);
    if (/TMW-QL-|TMW_CP_|misconceptionId|publiclyPublishable/.test(learnerText)) failures.push(`${entry.qlId}:${index}:internal ID leak`);
    if (/undefined|null|NaN|Infinity|\{\{/.test(learnerText)) failures.push(`${entry.qlId}:${index}:unresolved value`);
    if (/per day and changes by|increases by \\(0\\)|decreases by \\(0\\)/i.test(learnerText)) failures.push(`${entry.qlId}:${index}:mechanical change wording`);
    if (/\+\s*-|--|−\s*-/.test(learnerText)) failures.push(`${entry.qlId}:${index}:awkward signed expression`);
    if (question.explanation.steps.length < 3) failures.push(`${entry.qlId}:${index}:brief standard working`);
    if (question.explanation.commonTrap.optionText !== question.options["ABCD".indexOf(question.explanation.commonTrap.optionLabel.at(-1)!)] ) failures.push(`${entry.qlId}:${index}:trap option mapping mismatch`);
    if (entry.qlId === "TMW-QL-196" && !question.solution.answerText.endsWith("each day")) failures.push(`${entry.qlId}:${index}:AP change cadence mismatch`);
    if (entry.qlId === "TMW-QL-211" && !question.solution.answerText.endsWith("per day")) failures.push(`${entry.qlId}:${index}:threshold change cadence mismatch`);
    if (entry.qlId === "TMW-QL-209" && question.explanation.commonTrap.misconceptionId === "AP_SUM_HALF_OMITTED") failures.push(`${entry.qlId}:${index}:AP misconception leaked into phase total`);
    if (entry.qlId === "TMW-QL-210" && !/terminal day/i.test(question.explanation.opening)) failures.push(`${entry.qlId}:${index}:crew completion key rule incomplete`);
    if (/\\frac\{\d+\}\{\d+\}\\;\\text\{days?\}/.test(learnerText)) mathJaxFractionalTimes += 1;
    const normalized = normalizeStem(question.stem);
    const owner = normalizedStemOwners.get(normalized);
    if (owner && owner !== entry.qlId) failures.push(`${entry.qlId}:${index}:cross-QL normalized stem collision with ${owner}`);
    normalizedStemOwners.set(normalized, entry.qlId);
  }
}

if (failures.length) throw new Error(failures.join("\n"));
console.log(JSON.stringify({
  qls: TMW_CP_011_REGISTRY.length,
  total,
  failures: 0,
  mathJaxFractionalTimes,
  normalizedStemPatterns: normalizedStemOwners.size,
}, null, 2));
