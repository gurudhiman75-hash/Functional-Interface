import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { selectTmwCp011StemOpeningStyle, type TmwCp011StemOpeningStyle } from "./foundation/cp011-presentation";
import { runTmwCp011Pipeline } from "./foundation/cp011-runtime";

const outputQlIds = new Set(["TMW-QL-193", "TMW-QL-195", "TMW-QL-197", "TMW-QL-199", "TMW-QL-204", "TMW-QL-205", "TMW-QL-206", "TMW-QL-209"]);
const inverseUnknownGuards: Record<string, RegExp[]> = {
  "TMW-QL-195": [/Day 1 output:/],
  "TMW-QL-196": [/Daily change:/],
  "TMW-QL-199": [/Day 1 output:/],
  "TMW-QL-200": [/Daily multiplier:/],
  "TMW-QL-202": [/The rate changes after Day/],
  "TMW-QL-203": [/New daily rate:/],
  "TMW-QL-211": [/New daily rate:/],
};
const normalizedStemOwners = new Map<string, string>();
const normalizedOpeningPatterns = new Set<string>();
const openingStyleCounts = new Map<TmwCp011StemOpeningStyle, number>();
const failures: string[] = [];
let total = 0;
let mathJaxFractionalTimes = 0;
let teacherVoicePasses = 0;
let directTrapPasses = 0;
let expandedWorkingPasses = 0;

function normalizeStem(stem: string): string {
  return stem.toLowerCase().replace(/\\\([^)]*\\\)/g, "<math>").replace(/\d+/g, "#").replace(/[^a-z#<>]+/g, " ").trim();
}
function normalizeOpening(stem: string): string {
  return stem.split(/[.!?]/, 1)[0].toLowerCase().replace(/\\\([^)]*\\\)/g, "<math>").replace(/\d+/g, "#").replace(/[^a-z#<>]+/g, " ").trim();
}

for (const entry of TMW_CP_011_REGISTRY) {
  const perQlOpeningStyles = new Set<TmwCp011StemOpeningStyle>();
  for (let index = 0; index < 12; index += 1) {
    const seed = `audit-${entry.qlId}-${index}`;
    const question = runTmwCp011Pipeline(entry.qlId, seed);
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
    if (/Do not choose|Don't choose/i.test(learnerText)) failures.push(`${entry.qlId}:${index}:legacy trap command`);
    const expectedTrapPrefix = `Don't fall for ${question.explanation.commonTrap.optionLabel} (${question.explanation.commonTrap.optionText})!`;
    if (!question.explanation.commonTrap.explanation.startsWith(expectedTrapPrefix)) failures.push(`${entry.qlId}:${index}:direct trap advice missing`); else directTrapPasses += 1;
    if (!question.explanation.opening.startsWith("Let's")) failures.push(`${entry.qlId}:${index}:teacher voice missing`); else teacherVoicePasses += 1;
    if (/arithmetic progression|geometric progression|sum identity|inverse relation|recover the unknown parameter|substitute parameters/i.test(learnerText)) failures.push(`${entry.qlId}:${index}:academic jargon`);
    if (/TMW-QL-|TMW_CP_|misconceptionId|publiclyPublishable/.test(learnerText)) failures.push(`${entry.qlId}:${index}:internal ID leak`);
    if (/undefined|null|NaN|Infinity|\{\{/.test(learnerText)) failures.push(`${entry.qlId}:${index}:unresolved value`);
    if (/per day and changes by/i.test(learnerText) || learnerText.includes("increases by \\(0\\)") || learnerText.includes("decreases by \\(0\\)")) failures.push(`${entry.qlId}:${index}:mechanical change wording`);
    if (/\+\s*-|--|−\s*-/.test(learnerText)) failures.push(`${entry.qlId}:${index}:awkward signed expression`);
    const outsideMath = learnerText.replace(/\\\([\s\S]*?\\\)/g, "");
    if (/\\frac/.test(outsideMath)) failures.push(`${entry.qlId}:${index}:raw LaTeX fraction outside MathJax`);
    if (question.explanation.steps.length < 4) failures.push(`${entry.qlId}:${index}:brief standard working`);
    if (question.explanation.commonTrap.optionText !== question.options["ABCD".indexOf(question.explanation.commonTrap.optionLabel.at(-1)!)] ) failures.push(`${entry.qlId}:${index}:trap option mapping mismatch`);
    if (entry.qlId === "TMW-QL-196" && !question.solution.answerText.endsWith("each day")) failures.push(`${entry.qlId}:${index}:AP change cadence mismatch`);
    if (entry.qlId === "TMW-QL-211" && !question.solution.answerText.endsWith("per day")) failures.push(`${entry.qlId}:${index}:threshold change cadence mismatch`);
    if (entry.qlId === "TMW-QL-209" && question.explanation.commonTrap.misconceptionId === "AP_SUM_HALF_OMITTED") failures.push(`${entry.qlId}:${index}:AP misconception leaked into phase total`);
    if (entry.qlId === "TMW-QL-210" && !/last partly used day/i.test(question.explanation.opening)) failures.push(`${entry.qlId}:${index}:crew completion key rule incomplete`);

    const openingStyle = selectTmwCp011StemOpeningStyle(entry, seed);
    if (openingStyle === "CONTEXT_FIRST" && !question.stem.startsWith("At ")) failures.push(`${entry.qlId}:${index}:context-first stem mismatch`);
    if (openingStyle !== "CONTEXT_FIRST" && question.stem.startsWith("At ")) failures.push(`${entry.qlId}:${index}:fixed At-prefix leaked into ${openingStyle}`);
    perQlOpeningStyles.add(openingStyle);
    openingStyleCounts.set(openingStyle, (openingStyleCounts.get(openingStyle) ?? 0) + 1);
    normalizedOpeningPatterns.add(normalizeOpening(question.stem));

    let expanded = true;
    if (["TMW-QL-193", "TMW-QL-197"].includes(entry.qlId)) {
      const daySteps = question.explanation.steps.filter((step) => /^Day \d+ output/.test(step));
      if (daySteps.length !== question.parameters.days) { failures.push(`${entry.qlId}:${index}:daily output list incomplete`); expanded = false; }
      if (!question.explanation.steps.at(-1)?.startsWith("Total output =")) { failures.push(`${entry.qlId}:${index}:expanded total missing`); expanded = false; }
    }
    if (entry.qlId === "TMW-QL-204") {
      if (question.explanation.steps.filter((step) => /^Day \d+ output/.test(step)).length !== 5) { failures.push(`${entry.qlId}:${index}:crew day products incomplete`); expanded = false; }
    }
    if (["TMW-QL-194", "TMW-QL-198", "TMW-QL-207", "TMW-QL-210"].includes(entry.qlId)) {
      if (!question.explanation.steps.some((step) => step.startsWith("Work completed after"))) { failures.push(`${entry.qlId}:${index}:complete-day total missing`); expanded = false; }
      if (!question.explanation.steps.some((step) => step.startsWith("Work still left"))) { failures.push(`${entry.qlId}:${index}:remaining work missing`); expanded = false; }
      if (!question.explanation.steps.some((step) => step.startsWith("Part of Day"))) { failures.push(`${entry.qlId}:${index}:partial-day calculation missing`); expanded = false; }
    }
    if (expanded) expandedWorkingPasses += 1;
    if (/\\frac\{\d+\}\{\d+\}\\;\\text\{days?\}/.test(learnerText)) mathJaxFractionalTimes += 1;
    const normalized = normalizeStem(question.stem);
    const owner = normalizedStemOwners.get(normalized);
    if (owner && owner !== entry.qlId) failures.push(`${entry.qlId}:${index}:cross-QL normalized stem collision with ${owner}`);
    normalizedStemOwners.set(normalized, entry.qlId);
  }
  if (perQlOpeningStyles.size !== 4) failures.push(`${entry.qlId}:stem-opening rotation incomplete`);
}

if (openingStyleCounts.size !== 4) failures.push("global stem-opening style coverage incomplete");
const contextFirstCount = openingStyleCounts.get("CONTEXT_FIRST") ?? 0;
if (contextFirstCount * 5 > total) failures.push(`context-first stems exceed 20%: ${contextFirstCount}/${total}`);
if (normalizedOpeningPatterns.size < 60) failures.push(`insufficient normalized opening diversity: ${normalizedOpeningPatterns.size}`);
if (failures.length) throw new Error(failures.join("\n"));
console.log(JSON.stringify({
  qls: TMW_CP_011_REGISTRY.length,
  total,
  failures: 0,
  teacherVoicePasses,
  directTrapPasses,
  expandedWorkingPasses,
  openingStyleCounts: Object.fromEntries(openingStyleCounts),
  contextFirstShare: contextFirstCount / total,
  normalizedOpeningPatterns: normalizedOpeningPatterns.size,
  mathJaxFractionalTimes,
  normalizedStemPatterns: normalizedStemOwners.size,
}, null, 2));
