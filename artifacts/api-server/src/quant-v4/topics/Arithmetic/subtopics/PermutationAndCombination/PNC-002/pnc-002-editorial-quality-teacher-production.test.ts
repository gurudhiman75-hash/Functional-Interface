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
import { buildPnc002ProductionTeacherStudentPresentation } from "./foundation/student-presentation-teacher-production";
import type { PncStudentPresentation, PncStudentSourcePackage } from "./foundation/student-presentation";

type ValidatedSourcePackage = PncStudentSourcePackage & {
  validation: { valid: boolean };
  publiclyPublishable: boolean;
};

type Entry = {
  qlId: string;
  cpId: string;
  difficulty: string;
  solveMode: string;
  run: () => ValidatedSourcePackage;
};

type ExamAlignment = "CORE_EXAM_PATTERN" | "UPPER_EXAM_PRACTICE" | "ADVANCED_ENRICHMENT";

const entries: Entry[] = [
  ...getPnc002QuestionEntries().map((entry) => ({
    qlId: entry.qlId,
    cpId: entry.cpId,
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-production:${entry.qlId}` }),
  })),
  ...getCp011GroupingEntries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-production:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave1Entries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-production:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave2Entries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-production:${entry.qlId}` }),
  })),
  ...getCp011InverseEntries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-production:${entry.qlId}` }),
  })),
  ...getCp012Entries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-012",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-production:${entry.qlId}` }),
  })),
];

function qlNumber(qlId: string): number {
  return Number(qlId.split("-").at(-1));
}

function examAlignment(entry: Entry): ExamAlignment {
  const number = qlNumber(entry.qlId);
  const advanced = (number >= 201 && number <= 208)
    || (number >= 226 && number <= 228)
    || (number >= 236 && number <= 241)
    || number === 252
    || (number >= 262 && number <= 266);
  if (advanced) return "ADVANCED_ENRICHMENT";
  return entry.difficulty === "Hard" ? "UPPER_EXAM_PRACTICE" : "CORE_EXAM_PATTERN";
}

function getSection(presentation: PncStudentPresentation, kind: string) {
  const section = presentation.explanationSections.find((candidate) => candidate.kind === kind);
  assert.ok(section, `${presentation.questionLanguageId}: missing ${kind}`);
  return section;
}

function stripMath(value: string): string {
  return value.replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/\$[^$\n]+?\$/g, " ");
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

const expectedIds = Array.from({ length: 163 }, (_, index) => `PNC-QL-${String(index + 107).padStart(3, "0")}`);
assert.equal(entries.length, 163);
assert.deepEqual(entries.map((entry) => entry.qlId), expectedIds);
assert.equal(new Set(entries.map((entry) => entry.solveMode)).size, 130);

const rows: Array<{
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
const coreCounts = new Map<string, string[]>();
const cpCounts = new Map<string, number>();
const alignmentCounts = new Map<ExamAlignment, number>();
let expandedArithmeticCount = 0;
let trapCount = 0;

for (const entry of entries) {
  try {
    const source = entry.run();
    assert.equal(source.validation.valid, true);
    assert.equal(source.publiclyPublishable, false);
    const presentation = buildPnc002ProductionTeacherStudentPresentation(source);
    const alignment = examAlignment(entry);
    cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
    alignmentCounts.set(alignment, (alignmentCounts.get(alignment) ?? 0) + 1);

    assert.equal(presentation.questionLanguageId, entry.qlId);
    assert.equal(presentation.canonicalProblemId, entry.cpId);
    assert.equal(presentation.solveMode, entry.solveMode);
    assert.equal(presentation.displayOptions.length, 4);
    assert.equal(new Set(presentation.displayOptions).size, 4);
    assert.equal(presentation.displayOptions[presentation.correctIndex], presentation.answerLabel);

    const core = getSection(presentation, "coreConcept");
    const steps = getSection(presentation, "stepByStep");
    const shortcut = getSection(presentation, "examSpeedShortcut");
    const traps = getSection(presentation, "commonTrapWarning");
    assert.match(core.heading, /^📌 Core Concept — /);
    assert.ok(core.lines.length >= 1 && core.lines.length <= 2);
    assert.ok(steps.lines.length >= 4 && steps.lines.length <= 8);
    assert.ok(steps.lines.every((line, index) => line.startsWith(`${index + 1}. `)));
    assert.ok(steps.lines.every((line) => /\*\*[^*]+:\*\*/.test(line)));
    assert.ok(steps.lines.at(-1)?.includes(presentation.answerLabel));
    assert.equal(shortcut.lines.length, 1);
    assert.ok(shortcut.lines[0]!.includes("$"));
    assert.equal(traps.lines.length, 3);
    assert.ok(traps.lines.every((line) => /^Don't fall for Option [A-D] \(/.test(line)));
    trapCount += traps.lines.length;

    const hasExpansion = steps.lines.some((line) => {
      const math = line.match(/\$([^$]+)\$/)?.[1] ?? "";
      return (math.match(/=/g) ?? []).length >= 2 && /\\times|\\frac/.test(math);
    });
    if (hasExpansion) expandedArithmeticCount += 1;

    const studentText = [presentation.stem, ...presentation.displayOptions, ...presentation.explanationSections.flatMap((section) => [section.heading, ...section.lines])].join(" ");
    assert.ok(!/\{[A-Za-z][A-Za-z0-9_]{1,}\}/.test(stripMath(studentText)));
    assert.equal((studentText.match(/\$\$/g) ?? []).length % 2, 0);

    const coreKey = core.lines.join(" ").toLowerCase().replace(/\d[\d,]*/g, "{value}").replace(/\s+/g, " ").trim();
    coreCounts.set(coreKey, [...(coreCounts.get(coreKey) ?? []), entry.qlId]);

    rows.push({
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
      stepByStep: [...steps.lines],
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
assert.equal(rows.length, 163);
assert.equal(trapCount, 489);
assert.ok(expandedArithmeticCount >= 120);
assert.deepEqual([...coreCounts.values()].filter((group) => group.length > 3), []);
assert.deepEqual(Object.fromEntries([...cpCounts.entries()].sort()), {
  "PNC-CP-007": 18,
  "PNC-CP-008": 23,
  "PNC-CP-009": 29,
  "PNC-CP-010": 32,
  "PNC-CP-011": 33,
  "PNC-CP-012": 28,
});

const byQl = new Map(rows.map((row) => [row.qlId, row]));
function joined(qlId: string, field: "coreConcept" | "stepByStep" | "examSpeedShortcut" | "commonTrapWarning"): string {
  return (byQl.get(qlId)?.[field] ?? []).join(" ");
}

assert.match(joined("PNC-QL-211", "examSpeedShortcut"), /sizes are different|no whole-group symmetry/i);
assert.doesNotMatch(joined("PNC-QL-247", "coreConcept"), /group|symmetry/i);
assert.match(joined("PNC-QL-247", "coreConcept"), /compulsory|selected|arrange/i);
assert.match(joined("PNC-QL-247", "examSpeedShortcut"), /compulsory pair|remaining members|arrangements/i);
assert.match(joined("PNC-QL-250", "coreConcept"), /quota|circle|circular/i);
assert.match(joined("PNC-QL-252", "coreConcept"), /ornament|ring symmetry|reflection/i);
for (const qlId of ["PNC-QL-242", "PNC-QL-243", "PNC-QL-244", "PNC-QL-245"]) {
  assert.match(byQl.get(qlId)?.coreHeading ?? "", /Office|Chairperson|Offices/);
  assert.match(joined(qlId, "examSpeedShortcut"), /office|chairperson|role/i);
}
for (const qlId of ["PNC-QL-247", "PNC-QL-248", "PNC-QL-249"]) {
  const row = byQl.get(qlId);
  assert.ok(row);
  assert.equal(row.optionUnit, "arrangements");
  assert.ok(row.displayOptions.every((option) => option.endsWith(" arrangements")));
}

const normalizedStems = new Map<string, string[]>();
for (const row of rows) {
  const normalized = row.upgradedStem.toLowerCase().replace(/\d[\d,]*/g, "{value}").replace(/\s+/g, " ").trim();
  normalizedStems.set(normalized, [...(normalizedStems.get(normalized) ?? []), row.qlId]);
}
const duplicateStudentStemGroups = [...normalizedStems.values()].filter((group) => group.length > 1);
assert.deepEqual(duplicateStudentStemGroups, []);

const headers = [
  "qlId", "cpId", "difficulty", "solveMode", "examAlignment", "originalStem", "upgradedStem", "optionUnit",
  "optionA", "optionB", "optionC", "optionD", "correctOption", "answer", "answerLabel", "equation", "mathJax",
  "coreHeading", "coreConcept", "stepByStep", "shortcutHeading", "examSpeedShortcut", "trapHeading", "commonTrapWarning", "runtimeValidation",
];
const csvLines = [
  headers.map(csvCell).join(","),
  ...rows.map((row) => [
    row.qlId, row.cpId, row.difficulty, row.solveMode, row.examAlignment, row.originalStem, row.upgradedStem, row.optionUnit,
    row.displayOptions[0], row.displayOptions[1], row.displayOptions[2], row.displayOptions[3], String.fromCharCode(65 + row.correctIndex),
    row.answer, row.answerLabel, row.equation, row.mathJax, row.coreHeading, row.coreConcept, row.stepByStep,
    row.shortcutHeading, row.examSpeedShortcut, row.trapHeading, row.commonTrapWarning, row.runtimeValidation,
  ].map(csvCell).join(",")),
];

const report = {
  packageId: "PNC-002",
  editorialStandard: "PRODUCTION_TEACHER_STYLE_SCENARIO_SPECIFIC_EXPANDED_ARITHMETIC_CONVERSATIONAL_TRAPS",
  qlRange: ["PNC-QL-107", "PNC-QL-269"],
  qlCount: rows.length,
  solveModeCount: new Set(rows.map((row) => row.solveMode)).size,
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  alignmentCounts: Object.fromEntries([...alignmentCounts.entries()].sort()),
  expandedArithmeticCount,
  conversationalTrapCount: trapCount,
  repeatedCoreGroups: [...coreCounts.values()].filter((group) => group.length > 3),
  duplicateStudentStemGroups,
  invalid,
  originalRuntimeValidationPreserved: true,
  publiclyPublishable: false,
  status: "PASS",
};

const directory = resolve(process.cwd(), "dist/quant-v4/pnc-002-editorial-quality-teacher-production");
mkdirSync(directory, { recursive: true });
writeFileSync(resolve(directory, "pnc-002-editorial-quality-teacher-production.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
writeFileSync(resolve(directory, "pnc-002-editorial-quality-teacher-production.csv"), `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(resolve(directory, "pnc-002-editorial-quality-teacher-production-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
