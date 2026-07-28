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
import { buildPnc002TeacherStudentPresentation } from "./foundation/student-presentation-teacher";
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
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher:${entry.qlId}` }),
  })),
  ...cp011Grouping.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher:${entry.qlId}` }),
  })),
  ...cp011Distribution1.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher:${entry.qlId}` }),
  })),
  ...cp011Distribution2.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher:${entry.qlId}` }),
  })),
  ...cp011Inverse.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher:${entry.qlId}` }),
  })),
  ...cp012Entries.map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-012",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher:${entry.qlId}` }),
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
const unresolvedPlaceholder = /\{[A-Za-z][A-Za-z0-9_]{1,}\}/;
const forbiddenTeacherPhrases = [
  "calculation:",
  "solver-owned calculation",
  "does not match the required formula",
  "incomplete count or arithmetic distractor",
  "drops or adds one of the required counting stages",
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
  coreHeading: string;
  coreConcept: string[];
  stepByStep: string[];
  shortcutHeading: string;
  examSpeedShortcut: string[];
  trapHeading: string;
  commonTrapWarning: string[];
  runtimeValidation: boolean;
}> = [];

const invalid: string[] = [];
const cpCounts = new Map<string, number>();
const alignmentCounts = new Map<ExamAlignment, number>();
const coreTextCounts = new Map<string, string[]>();
let expandedArithmeticCount = 0;
let conversationalTrapCount = 0;

for (const entry of allEntries) {
  try {
    const source = entry.run();
    assert.equal(source.questionLanguageId, entry.qlId);
    assert.equal(source.canonicalProblemId, entry.cpId);
    assert.equal(source.validation.valid, true, `${entry.qlId}: original runtime validation failed`);
    assert.equal(source.publiclyPublishable, false);

    const presentation = buildPnc002TeacherStudentPresentation(source);
    const alignment = examAlignment(entry);
    cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
    alignmentCounts.set(alignment, (alignmentCounts.get(alignment) ?? 0) + 1);

    assert.equal(presentation.questionLanguageId, entry.qlId);
    assert.equal(presentation.canonicalProblemId, entry.cpId);
    assert.equal(presentation.solveMode, entry.solveMode);
    assert.equal(presentation.displayOptions.length, 4);
    assert.equal(new Set(presentation.displayOptions).size, 4);
    assert.equal(presentation.displayOptions[presentation.correctIndex], presentation.answerLabel);

    assert.equal(presentation.explanationSections.length, 4);
    assert.deepEqual(presentation.explanationSections.map((section) => section.kind), requiredKinds);

    const core = presentation.explanationSections[0]!;
    assert.ok(core.heading.startsWith("📌 Core Concept — "), `${entry.qlId}: method-specific core heading is missing`);
    assert.ok(core.lines.length >= 1 && core.lines.length <= 2, `${entry.qlId}: core concept should have one or two focused lines`);
    const normalizedCore = core.lines.join(" ").toLowerCase().replace(/\d[\d,]*/g, "{value}").replace(/\s+/g, " ").trim();
    coreTextCounts.set(normalizedCore, [...(coreTextCounts.get(normalizedCore) ?? []), entry.qlId]);

    const steps = presentation.explanationSections[1]!.lines;
    assert.ok(steps.length >= 4 && steps.length <= 8, `${entry.qlId}: teacher solution should contain 4 to 8 steps`);
    assert.ok(steps.every((line, index) => line.startsWith(`${index + 1}. `)), `${entry.qlId}: solution steps must be numbered`);
    assert.ok(steps.every((line) => /\*\*[^*]+:\*\*/.test(line)), `${entry.qlId}: every step needs a clear teacher-style label`);
    assert.equal(steps.filter((line) => line.includes("**Final answer:**")).length, 1, `${entry.qlId}: one final-answer step is required`);
    assert.ok(steps.at(-1)?.includes(presentation.answerLabel), `${entry.qlId}: labelled answer is missing from the final step`);
    assert.ok(!steps.some((line) => forbiddenTeacherPhrases.some((phrase) => line.toLowerCase().includes(phrase))), `${entry.qlId}: formula-dump wording remains`);
    const hasExpandedArithmetic = steps.some((line) => {
      const math = line.match(/\$([^$]+)\$/)?.[1] ?? "";
      return (math.match(/=/g) ?? []).length >= 2 && /\\times|\\frac/.test(math);
    });
    if (hasExpandedArithmetic) expandedArithmeticCount += 1;
    const hasBasicAtom = /\\binom\{|\d+!|\{\}\^\{?\d+\}?[PC]_|\d+\^\{?\d+\}?/.test(source.solver.mathJax);
    if (hasBasicAtom && !/\\sum|S\(|B_|p_|D_/.test(source.solver.mathJax)) {
      assert.ok(hasExpandedArithmetic, `${entry.qlId}: factorial/combination/power arithmetic was not expanded`);
    }

    const shortcut = presentation.explanationSections[2]!;
    assert.equal(shortcut.heading, "⚡ Exam Speed Shortcut");
    assert.equal(shortcut.lines.length, 1);
    assert.ok(shortcut.lines[0]!.includes("$"), `${entry.qlId}: shortcut should connect the method to this question's formula`);

    const traps = presentation.explanationSections[3]!;
    assert.equal(traps.heading, "⚠️ Common Traps & Mistakes");
    assert.equal(traps.lines.length, 3, `${entry.qlId}: every wrong option requires a warning`);
    assert.ok(traps.lines.every((line) => /^Don't fall for Option [A-D] \(/.test(line)), `${entry.qlId}: traps must use conversational warning language`);
    assert.ok(traps.lines.every((line) => line.includes("This") || line.includes("It")), `${entry.qlId}: trap explanation must explain how the wrong answer arises`);
    const wrongLetters = [0, 1, 2, 3].filter((index) => index !== presentation.correctIndex).map((index) => String.fromCharCode(65 + index));
    assert.deepEqual(traps.lines.map((line) => line.match(/Option ([A-D])/)?.[1]).sort(), wrongLetters.sort(), `${entry.qlId}: trap coverage does not match the three wrong options`);
    conversationalTrapCount += traps.lines.length;

    const allStudentText = [
      presentation.stem,
      ...presentation.displayOptions,
      ...presentation.explanationSections.flatMap((section) => [section.heading, ...section.lines]),
    ].join(" ");
    assert.ok(!unresolvedPlaceholder.test(stripDelimitedMath(allStudentText)), `${entry.qlId}: unresolved editorial placeholder`);
    assert.equal((allStudentText.match(/\$\$/g) ?? []).length % 2, 0, `${entry.qlId}: unbalanced display-math delimiters`);

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
      coreHeading: core.heading,
      coreConcept: [...core.lines],
      stepByStep: [...steps],
      shortcutHeading: shortcut.heading,
      examSpeedShortcut: [...shortcut.lines],
      trapHeading: traps.heading,
      commonTrapWarning: [...traps.lines],
      runtimeValidation: source.validation.valid,
    });
  } catch (error) {
    invalid.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

assert.deepEqual(invalid, []);
assert.equal(outputRows.length, 163);
assert.equal(conversationalTrapCount, 489);
assert.ok(expandedArithmeticCount >= 110, `Only ${expandedArithmeticCount} QLs expose expanded arithmetic`);
const repeatedCoreGroups = [...coreTextCounts.values()].filter((group) => group.length > 3);
assert.deepEqual(repeatedCoreGroups, []);
assert.deepEqual(Object.fromEntries([...cpCounts.entries()].sort()), {
  "PNC-CP-007": 18,
  "PNC-CP-008": 23,
  "PNC-CP-009": 29,
  "PNC-CP-010": 32,
  "PNC-CP-011": 33,
  "PNC-CP-012": 28,
});

const byQl = new Map(outputRows.map((row) => [row.qlId, row]));
assert.ok(byQl.get("PNC-QL-107")?.coreHeading.includes("Block"));
assert.ok(byQl.get("PNC-QL-107")?.stepByStep.some((line) => /\d+! = \d+ \\times/.test(line)));
assert.ok(byQl.get("PNC-QL-107")?.stepByStep.some((line) => /2! = 2/.test(line)));
assert.ok(byQl.get("PNC-QL-148")?.coreHeading.includes("Compulsory"));
assert.ok(byQl.get("PNC-QL-148")?.stepByStep.some((line) => /\\binom\{\d+\}\{\d+\} = \\frac/.test(line)));
assert.ok(byQl.get("PNC-QL-269")?.coreHeading.includes("Quota"));
assert.ok((byQl.get("PNC-QL-269")?.stepByStep.filter((line) => /\\binom|\^\{?\d+\}?/.test(line)).length ?? 0) >= 3);
assert.ok(byQl.get("PNC-QL-269")?.commonTrapWarning.every((line) => line.startsWith("Don't fall for Option")));

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
  "coreHeading", "coreConcept", "stepByStep", "shortcutHeading", "examSpeedShortcut", "trapHeading", "commonTrapWarning", "runtimeValidation",
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
    row.coreHeading,
    row.coreConcept,
    row.stepByStep,
    row.shortcutHeading,
    row.examSpeedShortcut,
    row.trapHeading,
    row.commonTrapWarning,
    row.runtimeValidation,
  ].map(csvCell).join(",")),
];

const report = {
  packageId: "PNC-002",
  editorialStandard: "TEACHER_STYLE_SCENARIO_SPECIFIC_EXPANDED_ARITHMETIC_CONVERSATIONAL_TRAPS",
  benchmarkModel: "SSC_BANKING_RAILWAY_STUDENT_CENTRIC_TEACHING_STYLE",
  qlRange: ["PNC-QL-107", "PNC-QL-269"],
  qlCount: outputRows.length,
  solveModeCount: new Set(outputRows.map((row) => row.solveMode)).size,
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  alignmentCounts: Object.fromEntries([...alignmentCounts.entries()].sort()),
  expandedArithmeticCount,
  conversationalTrapCount,
  repeatedCoreGroups,
  duplicateStudentStemGroups,
  invalid,
  originalRuntimeValidationPreserved: true,
  publiclyPublishable: false,
  status: "PASS",
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-editorial-quality-teacher");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-teacher.json"), `${JSON.stringify(outputRows, null, 2)}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-teacher.csv"), `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-002-editorial-quality-teacher-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
