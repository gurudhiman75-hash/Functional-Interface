import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import { getCp011GroupingEntries, runPnc002Cp011GroupingPipeline } from "./foundation/cp011-grouping-runtime";
import { getCp011DistributionWave1Entries, runPnc002Cp011DistributionWave1Pipeline } from "./foundation/cp011-distribution-wave1-reviewed-runtime";
import { getCp011DistributionWave2Entries, runPnc002Cp011DistributionWave2Pipeline } from "./foundation/cp011-distribution-wave2-runtime";
import { getCp011InverseEntries, runPnc002Cp011InversePipeline } from "./foundation/cp011-inverse-wave-runtime";
import { getCp012Entries, runPnc002Cp012Pipeline } from "./foundation/cp012-mixed-runtime-reviewed";
import {
  buildPnc002StudentPresentation,
  type PncStudentPresentation,
  type PncStudentSourcePackage,
} from "./foundation/student-presentation";

type ValidatedSourcePackage = PncStudentSourcePackage & {
  validation: { valid: boolean; checks: { name: string; passed: boolean; message: string }[] };
  publiclyPublishable: boolean;
};

type EditorialEntry = {
  qlId: string;
  cpId: string;
  difficulty: string;
  solveMode: string;
  run: () => ValidatedSourcePackage;
};

const baseEntries = getPnc002QuestionEntries();
const cp011Grouping = getCp011GroupingEntries();
const cp011Distribution1 = getCp011DistributionWave1Entries();
const cp011Distribution2 = getCp011DistributionWave2Entries();
const cp011Inverse = getCp011InverseEntries();
const cp012Entries = getCp012Entries();

const allEntries: EditorialEntry[] = [
  ...baseEntries.map((entry) => ({
    qlId: entry.qlId,
    cpId: entry.cpId,
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-review:${entry.qlId}` }),
  })),
  ...cp011Grouping.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-review:${entry.qlId}` }),
  })),
  ...cp011Distribution1.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-review:${entry.qlId}` }),
  })),
  ...cp011Distribution2.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-review:${entry.qlId}` }),
  })),
  ...cp011Inverse.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-review:${entry.qlId}` }),
  })),
  ...cp012Entries.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-012",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-review:${entry.qlId}` }),
  })),
];

const expectedIds = Array.from({ length: 163 }, (_, index) => `PNC-QL-${String(index + 107).padStart(3, "0")}`);
assert.equal(allEntries.length, 163);
assert.deepEqual(allEntries.map((entry) => entry.qlId), expectedIds);
assert.equal(new Set(allEntries.map((entry) => entry.solveMode)).size, 130);

const requiredKinds = ["coreConcept", "stepByStep", "examSpeedShortcut", "commonTrapWarning"];
const requiredHeadingPrefixes = ["📌 Core Concept", "📝 Step-by-Step Solution", "⚡ Exam Speed Shortcut", "⚠️ Common Trap Warning"];
const unresolvedPlaceholder = /\{[A-Za-z][A-Za-z0-9_]{1,}\}/;
const forbiddenRoboticPhrases = [
  "distinct people stand in a row",
  "distinct objects",
  "specified set",
  "unnamed groups",
];

const outputRows: Array<{
  qlId: string;
  cpId: string;
  difficulty: string;
  solveMode: string;
  originalStem: string;
  upgradedStem: string;
  optionUnit: string;
  numericOptions: string[];
  displayOptions: string[];
  correctIndex: number;
  answer: string;
  answerLabel: string;
  equation: string;
  mathJax: string;
  coreConcept: string[];
  stepByStep: string[];
  examSpeedShortcut: string[];
  commonTrapWarning: string[];
  runtimeValidation: boolean;
}> = [];

const invalid: string[] = [];
let changedStemCount = 0;
let explicitOptionTrapCount = 0;
const cpCounts = new Map<string, number>();
const optionUnits = new Set<string>();

for (const entry of allEntries) {
  try {
    const source = entry.run();
    assert.equal(source.questionLanguageId, entry.qlId);
    assert.equal(source.canonicalProblemId, entry.cpId);
    assert.equal(source.validation.valid, true, `${entry.qlId}: original runtime validation failed`);
    assert.equal(source.publiclyPublishable, false);

    const presentation: PncStudentPresentation = buildPnc002StudentPresentation(source);
    cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
    optionUnits.add(presentation.optionUnit);
    if (presentation.stem !== source.stem) changedStemCount += 1;

    assert.equal(presentation.questionLanguageId, entry.qlId);
    assert.equal(presentation.canonicalProblemId, entry.cpId);
    assert.equal(presentation.solveMode, entry.solveMode);
    assert.equal(presentation.displayOptions.length, 4);
    assert.equal(new Set(presentation.displayOptions).size, 4);
    assert.equal(presentation.displayOptions[presentation.correctIndex], presentation.answerLabel);
    assert.ok(presentation.displayOptions.every((option) => /\d/.test(option) && /[A-Za-z]/.test(option)), `${entry.qlId}: every option requires a visible unit`);
    assert.ok(!unresolvedPlaceholder.test(presentation.stem), `${entry.qlId}: unresolved stem placeholder`);
    assert.ok(!forbiddenRoboticPhrases.some((phrase) => presentation.stem.toLowerCase().includes(phrase)), `${entry.qlId}: robotic phrase remains`);

    assert.equal(presentation.explanationSections.length, 4);
    assert.deepEqual(presentation.explanationSections.map((section) => section.kind), requiredKinds);
    assert.ok(presentation.explanationSections.every((section, index) => section.heading.startsWith(requiredHeadingPrefixes[index]!)));
    assert.ok(presentation.explanationSections.every((section) => section.lines.length > 0));
    assert.ok(presentation.explanationSections[1]!.lines.length >= 3, `${entry.qlId}: step-by-step section is too short`);
    assert.ok(presentation.explanationSections[1]!.lines.some((line) => line.includes(`$$${source.solver.mathJax}$$`)), `${entry.qlId}: display MathJax calculation is missing`);
    assert.ok(presentation.explanationSections[1]!.lines.join(" ").includes(presentation.answerLabel), `${entry.qlId}: final labelled answer is missing`);
    assert.ok(presentation.explanationSections[3]!.lines.length >= 2, `${entry.qlId}: fewer than two trap warnings`);
    assert.ok(presentation.explanationSections[3]!.lines.every((line) => /^Option [A-D] \(/.test(line)), `${entry.qlId}: trap warnings must identify actual options`);
    explicitOptionTrapCount += presentation.explanationSections[3]!.lines.length;

    const allStudentText = [
      presentation.stem,
      ...presentation.displayOptions,
      ...presentation.explanationSections.flatMap((section) => [section.heading, ...section.lines]),
    ].join(" ");
    assert.ok(!unresolvedPlaceholder.test(allStudentText), `${entry.qlId}: unresolved editorial placeholder`);
    assert.equal((allStudentText.match(/\$\$/g) ?? []).length % 2, 0, `${entry.qlId}: unbalanced display-math delimiters`);

    outputRows.push({
      qlId: entry.qlId,
      cpId: entry.cpId,
      difficulty: entry.difficulty,
      solveMode: entry.solveMode,
      originalStem: source.stem,
      upgradedStem: presentation.stem,
      optionUnit: presentation.optionUnit,
      numericOptions: [...source.options],
      displayOptions: [...presentation.displayOptions],
      correctIndex: presentation.correctIndex,
      answer: source.answer,
      answerLabel: presentation.answerLabel,
      equation: source.solver.equation,
      mathJax: source.solver.mathJax,
      coreConcept: [...presentation.explanationSections[0]!.lines],
      stepByStep: [...presentation.explanationSections[1]!.lines],
      examSpeedShortcut: [...presentation.explanationSections[2]!.lines],
      commonTrapWarning: [...presentation.explanationSections[3]!.lines],
      runtimeValidation: source.validation.valid,
    });
  } catch (error) {
    invalid.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

assert.deepEqual(invalid, []);
assert.equal(outputRows.length, 163);
assert.equal(changedStemCount, 163);
assert.ok(explicitOptionTrapCount >= 326);
assert.deepEqual(Object.fromEntries([...cpCounts.entries()].sort()), {
  "PNC-CP-007": 18,
  "PNC-CP-008": 23,
  "PNC-CP-009": 29,
  "PNC-CP-010": 32,
  "PNC-CP-011": 33,
  "PNC-CP-012": 28,
});

const normalizedStems = new Map<string, string[]>();
for (const row of outputRows) {
  const normalized = row.upgradedStem.toLowerCase().replace(/\d[\d,]*/g, "{value}").replace(/\s+/g, " ").trim();
  normalizedStems.set(normalized, [...(normalizedStems.get(normalized) ?? []), row.qlId]);
}
const duplicateStudentStemGroups = [...normalizedStems.values()].filter((group) => group.length > 1);
assert.deepEqual(duplicateStudentStemGroups, []);

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

const csvHeaders = [
  "qlId", "cpId", "difficulty", "solveMode", "originalStem", "upgradedStem", "optionUnit",
  "optionA", "optionB", "optionC", "optionD", "correctOption", "answer", "answerLabel", "equation", "mathJax",
  "coreConcept", "stepByStep", "examSpeedShortcut", "commonTrapWarning", "runtimeValidation",
];
const csvLines = [
  csvHeaders.map(csvCell).join(","),
  ...outputRows.map((row) => [
    row.qlId,
    row.cpId,
    row.difficulty,
    row.solveMode,
    row.originalStem,
    row.upgradedStem,
    row.optionUnit,
    row.displayOptions[0],
    row.displayOptions[1],
    row.displayOptions[2],
    row.displayOptions[3],
    String.fromCharCode(65 + row.correctIndex),
    row.answer,
    row.answerLabel,
    row.equation,
    row.mathJax,
    row.coreConcept,
    row.stepByStep,
    row.examSpeedShortcut,
    row.commonTrapWarning,
    row.runtimeValidation,
  ].map(csvCell).join(",")),
];

const report = {
  packageId: "PNC-002",
  editorialStandard: "HUMANISED_STEMS_LABELLED_OPTIONS_FOUR_TIER_EXPLANATIONS",
  qlRange: ["PNC-QL-107", "PNC-QL-269"],
  qlCount: outputRows.length,
  solveModeCount: new Set(outputRows.map((row) => row.solveMode)).size,
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  changedStemCount,
  optionUnits: [...optionUnits].sort(),
  explicitOptionTrapCount,
  duplicateStudentStemGroups,
  invalid,
  originalRuntimeValidationPreserved: true,
  publiclyPublishable: false,
  status: "PASS",
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-editorial-quality-review");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-review.json"), `${JSON.stringify(outputRows, null, 2)}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-review.csv"), `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
