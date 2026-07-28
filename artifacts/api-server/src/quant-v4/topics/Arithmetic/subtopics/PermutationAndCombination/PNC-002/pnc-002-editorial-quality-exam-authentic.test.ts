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
import { buildPnc002ExamAuthenticStudentPresentation } from "./foundation/student-presentation-exam-authentic";
import type { PncStudentSourcePackage } from "./foundation/student-presentation";

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

type ExamAlignment = "CORE_EXAM_PATTERN" | "UPPER_EXAM_PRACTICE" | "ADVANCED_ENRICHMENT";

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
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-exam-authentic:${entry.qlId}` }),
  })),
  ...cp011Grouping.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-exam-authentic:${entry.qlId}` }),
  })),
  ...cp011Distribution1.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-exam-authentic:${entry.qlId}` }),
  })),
  ...cp011Distribution2.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-exam-authentic:${entry.qlId}` }),
  })),
  ...cp011Inverse.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-exam-authentic:${entry.qlId}` }),
  })),
  ...cp012Entries.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-012",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-exam-authentic:${entry.qlId}` }),
  })),
];

function qlNumber(qlId: string): number {
  return Number(qlId.split("-").at(-1));
}

function examAlignment(entry: EditorialEntry): ExamAlignment {
  const number = qlNumber(entry.qlId);
  const advanced = (
    (number >= 201 && number <= 208)
    || (number >= 226 && number <= 228)
    || (number >= 236 && number <= 241)
    || number === 252
    || (number >= 262 && number <= 266)
  );
  if (advanced) return "ADVANCED_ENRICHMENT";
  if (entry.difficulty === "Hard") return "UPPER_EXAM_PRACTICE";
  return "CORE_EXAM_PATTERN";
}

function stripDelimitedMath(value: string): string {
  return value.replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/\$[^$\n]+?\$/g, " ");
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

const expectedIds = Array.from({ length: 163 }, (_, index) => `PNC-QL-${String(index + 107).padStart(3, "0")}`);
assert.equal(allEntries.length, 163);
assert.deepEqual(allEntries.map((entry) => entry.qlId), expectedIds);
assert.equal(new Set(allEntries.map((entry) => entry.solveMode)).size, 130);

const requiredKinds = ["coreConcept", "stepByStep", "examSpeedShortcut", "commonTrapWarning"];
const requiredHeadingPrefixes = ["📌 Core Concept", "📝 Step-by-Step Solution", "⚡ Exam Speed Shortcut", "⚠️ Common Trap Warning"];
const unresolvedPlaceholder = /\{[A-Za-z][A-Za-z0-9_]{1,}\}/;
const decorativeBoilerplate = [
  "for a formal photograph",
  "at a conference dinner",
  "a college is forming a committee for an official event",
  "a warehouse is distributing items among clearly identified containers",
  "a designer is preparing a circular ornament or display",
  "a coordinator is planning a counting arrangement for an event",
  "a classroom activity uses boxes to distribute counters or tokens",
  "an exam coordinator is working with the following counting arrangement",
];
const forbiddenExplanationPhrases = [
  "solver-owned calculation",
  "does not match the required formula",
  "incomplete count or arithmetic distractor",
];

const outputRows: Array<{
  qlId: string;
  cpId: string;
  difficulty: string;
  solveMode: string;
  examAlignment: ExamAlignment;
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
const alignmentCounts = new Map<ExamAlignment, number>();
const prefixCounts = new Map<string, number>();

for (const entry of allEntries) {
  try {
    const source = entry.run();
    assert.equal(source.questionLanguageId, entry.qlId);
    assert.equal(source.canonicalProblemId, entry.cpId);
    assert.equal(source.validation.valid, true, `${entry.qlId}: original runtime validation failed`);
    assert.equal(source.publiclyPublishable, false);

    const presentation = buildPnc002ExamAuthenticStudentPresentation(source);
    const alignment = examAlignment(entry);
    cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
    optionUnits.add(presentation.optionUnit);
    alignmentCounts.set(alignment, (alignmentCounts.get(alignment) ?? 0) + 1);
    if (presentation.stem !== source.stem) changedStemCount += 1;

    const prefix = presentation.stem.toLowerCase().split(/\s+/).slice(0, 6).join(" ");
    prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);

    assert.equal(presentation.questionLanguageId, entry.qlId);
    assert.equal(presentation.canonicalProblemId, entry.cpId);
    assert.equal(presentation.solveMode, entry.solveMode);
    assert.equal(presentation.displayOptions.length, 4);
    assert.equal(new Set(presentation.displayOptions).size, 4);
    assert.equal(presentation.displayOptions[presentation.correctIndex], presentation.answerLabel);
    assert.ok(presentation.displayOptions.every((option) => /\d/.test(option) && /[A-Za-z]/.test(option)), `${entry.qlId}: every option requires a visible unit`);

    assert.ok(!unresolvedPlaceholder.test(presentation.stem), `${entry.qlId}: unresolved stem placeholder`);
    assert.ok(!decorativeBoilerplate.some((phrase) => presentation.stem.toLowerCase().startsWith(phrase)), `${entry.qlId}: decorative boilerplate remains`);
    assert.ok(presentation.stem.length <= 330, `${entry.qlId}: stem is too long for an exam interface`);

    assert.equal(presentation.explanationSections.length, 4);
    assert.deepEqual(presentation.explanationSections.map((section) => section.kind), requiredKinds);
    assert.ok(presentation.explanationSections.every((section, index) => section.heading.startsWith(requiredHeadingPrefixes[index]!)));
    assert.ok(presentation.explanationSections.every((section) => section.lines.length > 0));
    assert.ok(presentation.explanationSections[0]!.lines.length <= 2, `${entry.qlId}: core concept should remain compact`);
    assert.equal(presentation.explanationSections[2]!.lines.length, 1, `${entry.qlId}: shortcut should be one focused note`);

    const steps = presentation.explanationSections[1]!.lines;
    assert.ok(steps.length >= 3 && steps.length <= 5, `${entry.qlId}: solution should contain 3 to 5 concise steps`);
    assert.ok(steps.every((line, index) => line.startsWith(`${index + 1}. `)), `${entry.qlId}: solution steps must be numbered`);
    assert.equal(steps.filter((line) => line.includes(`$$${source.solver.mathJax}$$`)).length, 1, `${entry.qlId}: calculation should appear once as display MathJax`);
    assert.ok(steps.slice(0, -2).every((line) => !(line.includes("$") && line.includes(String(source.solver.numericAnswer)))), `${entry.qlId}: calculation is repeated before the display-math step`);
    const processKeys = steps.slice(0, -2).map((line) => line.replace(/^\d+\.\s*/, "").toLowerCase().replace(/\s+/g, ""));
    assert.equal(new Set(processKeys).size, processKeys.length, `${entry.qlId}: repeated process line remains`);
    assert.ok(steps.at(-1)?.includes(presentation.answerLabel), `${entry.qlId}: final labelled answer is missing`);

    const traps = presentation.explanationSections[3]!.lines;
    assert.equal(traps.length, 3, `${entry.qlId}: every wrong option requires a trap explanation`);
    assert.ok(traps.every((line) => /^Option [A-D] \(/.test(line)), `${entry.qlId}: trap warnings must identify actual options`);
    assert.ok(traps.every((line) => {
      const match = line.match(/^Option ([A-D]) \(([^)]*)\):/);
      if (!match) return false;
      const index = match[1]!.charCodeAt(0) - 65;
      return match[2] === presentation.displayOptions[index];
    }), `${entry.qlId}: trap option labels must match displayed options exactly`);
    assert.ok(traps.every((line) => !forbiddenExplanationPhrases.some((phrase) => line.toLowerCase().includes(phrase))), `${entry.qlId}: generic trap language remains`);
    const wrongLetters = [0, 1, 2, 3].filter((index) => index !== presentation.correctIndex).map((index) => String.fromCharCode(65 + index));
    assert.deepEqual(traps.map((line) => line.slice(7, 8)).sort(), wrongLetters.sort(), `${entry.qlId}: trap coverage must match all wrong options`);
    explicitOptionTrapCount += traps.length;

    const allStudentText = [
      presentation.stem,
      ...presentation.displayOptions,
      ...presentation.explanationSections.flatMap((section) => [section.heading, ...section.lines]),
    ].join(" ");
    assert.ok(!unresolvedPlaceholder.test(stripDelimitedMath(allStudentText)), `${entry.qlId}: unresolved editorial placeholder`);
    assert.equal((allStudentText.match(/\$\$/g) ?? []).length % 2, 0, `${entry.qlId}: unbalanced display-math delimiters`);
    assert.ok(!forbiddenExplanationPhrases.some((phrase) => allStudentText.toLowerCase().includes(phrase)), `${entry.qlId}: deprecated editorial phrase remains`);

    outputRows.push({
      qlId: entry.qlId,
      cpId: entry.cpId,
      difficulty: entry.difficulty,
      solveMode: entry.solveMode,
      examAlignment: alignment,
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
      stepByStep: [...steps],
      examSpeedShortcut: [...presentation.explanationSections[2]!.lines],
      commonTrapWarning: [...traps],
      runtimeValidation: source.validation.valid,
    });
  } catch (error) {
    invalid.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

assert.deepEqual(invalid, []);
assert.equal(outputRows.length, 163);
assert.ok(changedStemCount >= 100, `Only ${changedStemCount} stems received a necessary wording change`);
assert.equal(explicitOptionTrapCount, 489);
assert.ok(Math.max(...prefixCounts.values()) <= 10, "A repeated story prefix still dominates the question bank");
assert.deepEqual(Object.fromEntries([...cpCounts.entries()].sort()), {
  "PNC-CP-007": 18,
  "PNC-CP-008": 23,
  "PNC-CP-009": 29,
  "PNC-CP-010": 32,
  "PNC-CP-011": 33,
  "PNC-CP-012": 28,
});

const byQl = new Map(outputRows.map((row) => [row.qlId, row]));
assert.ok(byQl.get("PNC-QL-107")?.upgradedStem.startsWith("In how many different ways can "));
assert.ok(byQl.get("PNC-QL-148")?.upgradedStem.startsWith("A committee of "));
assert.ok(byQl.get("PNC-QL-177")?.upgradedStem.startsWith("In how many different ways can "));
assert.ok(byQl.get("PNC-QL-210")?.upgradedStem.includes("named teams"));
assert.equal(byQl.get("PNC-QL-210")?.optionUnit, "groupings");
assert.ok(![...(byQl.get("PNC-QL-210")?.coreConcept ?? []), ...(byQl.get("PNC-QL-210")?.stepByStep ?? [])].join(" ").includes("numbered team"));
assert.ok(byQl.get("PNC-QL-219")?.upgradedStem.startsWith("Each of "));
assert.ok(byQl.get("PNC-QL-253")?.upgradedStem.includes("numbered cards"));
assert.ok(byQl.get("PNC-QL-269")?.upgradedStem.startsWith("A sports club has"));
assert.equal(byQl.get("PNC-QL-226")?.examAlignment, "ADVANCED_ENRICHMENT");
assert.equal(byQl.get("PNC-QL-226")?.optionUnit, "groupings");
assert.ok(byQl.get("PNC-QL-226")?.coreConcept.join(" ").includes("Stirling"));
assert.ok(!byQl.get("PNC-QL-226")?.coreConcept.join(" ").includes("Identical objects"));
assert.equal(byQl.get("PNC-QL-262")?.examAlignment, "ADVANCED_ENRICHMENT");
assert.ok(!byQl.get("PNC-QL-262")?.stepByStep.join(" ").includes("objects are identical"));
assert.ok(byQl.get("PNC-QL-269")?.commonTrapWarning.some((line) => line.includes("without enforcing the required number of women")));

const normalizedStems = new Map<string, string[]>();
for (const row of outputRows) {
  const normalized = row.upgradedStem.toLowerCase().replace(/\d[\d,]*/g, "{value}").replace(/\s+/g, " ").trim();
  normalizedStems.set(normalized, [...(normalizedStems.get(normalized) ?? []), row.qlId]);
}
const duplicateStudentStemGroups = [...normalizedStems.values()].filter((group) => group.length > 1);
assert.deepEqual(duplicateStudentStemGroups, []);

const csvHeaders = [
  "qlId", "cpId", "difficulty", "solveMode", "examAlignment", "originalStem", "upgradedStem", "optionUnit",
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
    row.examAlignment,
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
  editorialStandard: "EXAM_AUTHENTIC_DIRECT_STEMS_COMPACT_FOUR_TIER_EXPLANATIONS",
  benchmarkModel: "SSC_BANKING_RAILWAY_PLATFORM_STYLE",
  qlRange: ["PNC-QL-107", "PNC-QL-269"],
  qlCount: outputRows.length,
  solveModeCount: new Set(outputRows.map((row) => row.solveMode)).size,
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  alignmentCounts: Object.fromEntries([...alignmentCounts.entries()].sort()),
  reviewedStemCount: outputRows.length,
  changedStemCount,
  maximumRepeatedSixWordPrefix: Math.max(...prefixCounts.values()),
  optionUnits: [...optionUnits].sort(),
  explicitOptionTrapCount,
  duplicateStudentStemGroups,
  invalid,
  originalRuntimeValidationPreserved: true,
  publiclyPublishable: false,
  status: "PASS",
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-editorial-quality-exam-authentic");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-exam-authentic.json"), `${JSON.stringify(outputRows, null, 2)}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-exam-authentic.csv"), `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-exam-authentic-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
