import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const registry = [
  ...TMW_CP001_REGISTRY,
  ...TMW_CP002_REGISTRY,
  ...TMW_CP003_REGISTRY,
  ...TMW_CP004_REGISTRY,
  ...TMW_CP005_REGISTRY,
  ...TMW_CP006_REGISTRY,
  ...TMW_CP007_REGISTRY,
  ...TMW_CP008_REGISTRY,
  ...TMW_CP009_REGISTRY,
  ...TMW_CP010_REGISTRY,
  ...TMW_CP_011_REGISTRY,
];

const expectedFractionQls = new Set([
  "TMW-QL-004",
  "TMW-QL-006",
  "TMW-QL-007",
  "TMW-QL-010",
  "TMW-QL-011",
  "TMW-QL-013",
  "TMW-QL-018",
  "TMW-QL-022",
  "TMW-QL-117",
  "TMW-QL-149",
  "TMW-QL-160",
  "TMW-QL-168",
  "TMW-QL-169",
  "TMW-QL-174",
  "TMW-QL-179",
  "TMW-QL-180",
  "TMW-QL-181",
  "TMW-QL-187",
  "TMW-QL-188",
  "TMW-QL-191",
]);

function checkpointNumber(qlId: string): number {
  const value = Number(qlId.slice(-3));
  if (value <= 20) return 1;
  if (value <= 34) return 2;
  if (value <= 57) return 3;
  if (value <= 81) return 4;
  if (value <= 105) return 5;
  if (value <= 127) return 6;
  if (value <= 143) return 7;
  if (value <= 156) return 8;
  if (value <= 174) return 9;
  if (value <= 192) return 10;
  return 11;
}

function reviewSeed(qlId: string): string {
  const cp = checkpointNumber(qlId);
  return cp === 11
    ? `review-${qlId}-0`
    : `tmw-cp${String(cp).padStart(3, "0")}-localization:${qlId}:0`;
}

function learnerFields(question: any): Array<[string, string]> {
  return [
    ["stem", question.stem],
    ...question.options.map((value: string, index: number): [string, string] => [
      `option-${index + 1}`,
      value,
    ]),
    ["answer", question.solution.answerText],
    ["opening", question.explanation.opening],
    ["formula", question.explanation.formula],
    ...(question.explanation.givens ?? []).map(
      (value: string, index: number): [string, string] => [`given-${index + 1}`, value],
    ),
    ...question.explanation.steps.map(
      (value: string, index: number): [string, string] => [`step-${index + 1}`, value],
    ),
    ["shortcut-title", question.explanation.shortcut.title],
    ...question.explanation.shortcut.steps.map(
      (value: string, index: number): [string, string] => [`shortcut-${index + 1}`, value],
    ),
    ["trap-label", question.explanation.commonTrap.optionLabel],
    ["trap-option", question.explanation.commonTrap.optionText],
    ["trap-explanation", question.explanation.commonTrap.explanation],
    ["conclusion", question.explanation.conclusion],
  ];
}

let reviewRows = 0;
let fractionMathRows = 0;
const representedFractionQls = new Set<string>();

for (const entry of registry) {
  for (const language of languages) {
    const question = runTmw001ChapterPipeline({
      questionLanguageId: entry.qlId,
      seed: reviewSeed(entry.qlId),
      language,
    });
    assert.equal(
      question.validation.valid,
      true,
      `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`,
    );
    assert.equal(
      question.options[question.correctIndex],
      question.solution.answerText,
      `${entry.qlId}:${language}: answer/option mismatch after sanitization`,
    );
    assert.equal(
      question.options.includes(question.explanation.commonTrap.optionText),
      true,
      `${entry.qlId}:${language}: trap option mismatch after sanitization`,
    );

    let rowHasFractionMath = false;
    for (const [field, value] of learnerFields(question)) {
      const outsideMath = value.replace(/\\\([\s\S]*?\\\)/g, "");
      assert.equal(
        /\b\d+\s+\d+\/\d+\s*%?|\b\d+\/\d+\s*%?/.test(outsideMath),
        false,
        `${entry.qlId}:${language}:${field}: raw fraction remains: ${value}`,
      );
      assert.equal(
        (value.match(/\\\(/g) ?? []).length,
        (value.match(/\\\)/g) ?? []).length,
        `${entry.qlId}:${language}:${field}: unbalanced MathJax`,
      );
      if (/\\frac\{\d+\}\{\d+\}/.test(value)) rowHasFractionMath = true;
    }
    if (rowHasFractionMath) {
      fractionMathRows += 1;
      representedFractionQls.add(entry.qlId);
    }
    reviewRows += 1;
  }
}

assert.equal(reviewRows, 422);
for (const qlId of expectedFractionQls) {
  assert.equal(
    representedFractionQls.has(qlId),
    true,
    `${qlId}: expected fraction presentation was not represented`,
  );
}
assert.ok(fractionMathRows >= 70);

console.log(JSON.stringify({
  chapter: "TMW-001",
  wave: "MULTILINGUAL_FRACTION_PRESENTATION",
  reviewRows,
  expectedFractionQls: expectedFractionQls.size,
  representedFractionQls: representedFractionQls.size,
  fractionMathRows,
  rawFractionFindings: 0,
  status: "PASS",
}, null, 2));
