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
import { buildPnc002FinalTeacherStudentPresentation } from "./foundation/student-presentation-teacher-final";
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
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-final:${entry.qlId}` }),
  })),
  ...getCp011GroupingEntries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-final:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave1Entries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-final:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave2Entries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-final:${entry.qlId}` }),
  })),
  ...getCp011InverseEntries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-011",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-final:${entry.qlId}` }),
  })),
  ...getCp012Entries().map((entry) => ({
    qlId: entry.qlId,
    cpId: "PNC-CP-012",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-editorial-teacher-final:${entry.qlId}` }),
  })),
];

function qlNumber(qlId: string): number {
  return Number(qlId.split("-").at(-1));
}

function alignment(entry: Entry): ExamAlignment {
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
  const found = presentation.explanationSections.find((section) => section.kind === kind);
  assert.ok(found, `${presentation.questionLanguageId}: missing ${kind} section`);
  return found;
}

function stripDelimitedMath(value: string): string {
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

const output: Array<{
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
const coreGroups = new Map<string, string[]>();
const cpCounts = new Map<string, number>();
const alignmentCounts = new Map<ExamAlignment, number>();
let expandedArithmeticCount = 0;
let trapCount = 0;
const thirdPersonAfterSecondPerson = /\b(?:you|and|or|but)\s+(?:uses|ignores|counts|omits|treats|misses|duplicates|handles|fails|chooses|reverses|confuses|applies|divides|forms|arranges|stops|drops|adds|represents|forgets|leaves)\b/i;

for (const entry of entries) {
  try {
    const source = entry.run();
    assert.equal(source.validation.valid, true);
    assert.equal(source.publiclyPublishable, false);
    const presentation = buildPnc002FinalTeacherStudentPresentation(source);
    const examAlignment = alignment(entry);
    cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
    alignmentCounts.set(examAlignment, (alignmentCounts.get(examAlignment) ?? 0) + 1);

    assert.equal(presentation.questionLanguageId, entry.qlId);
    assert.equal(presentation.canonicalProblemId, entry.cpId);
    assert.equal(presentation.solveMode, entry.solveMode);
    assert.equal(presentation.displayOptions.length, 4);
    assert.equal(new Set(presentation.displayOptions).size, 4);
    assert.equal(presentation.displayOptions[presentation.correctIndex], presentation.answerLabel);

    const core = getSection(presentation, "coreConcept");
    assert.match(core.heading, /^📌 Core Concept — /);
    assert.ok(core.lines.length >= 1 && core.lines.length <= 2);
    const coreKey = core.lines.join(" ").toLowerCase().replace(/\d[\d,]*/g, "{value}").replace(/\s+/g, " ").trim();
    coreGroups.set(coreKey, [...(coreGroups.get(coreKey) ?? []), entry.qlId]);

    const steps = getSection(presentation, "stepByStep");
    assert.ok(steps.lines.length >= 4 && steps.lines.length <= 8, `${entry.qlId}: solution needs 4 to 8 teaching steps`);
    assert.ok(steps.lines.every((line, index) => line.startsWith(`${index + 1}. `)));
    assert.ok(steps.lines.every((line) => /\*\*[^*]+:\*\*/.test(line)));
    assert.equal(steps.lines.filter((line) => line.includes("**Final answer:**")).length, 1);
    assert.ok(steps.lines.at(-1)?.includes(presentation.answerLabel));

    const expansionIndexes = steps.lines
      .map((line, index) => (/\*\*(?:Expand|Evaluate)/.test(line) ? index : -1))
      .filter((index) => index >= 0);
    const formulaIndex = steps.lines.findIndex((line) => /\*\*(?:Combine|Calculate|Substitute)/.test(line));
    if (formulaIndex >= 0 && expansionIndexes.length > 0) assert.ok(formulaIndex > Math.max(...expansionIndexes));

    const hasExpandedArithmetic = steps.lines.some((line) => {
      const math = line.match(/\$([^$]+)\$/)?.[1] ?? "";
      return (math.match(/=/g) ?? []).length >= 2 && /\\times|\\frac/.test(math);
    });
    if (hasExpandedArithmetic) expandedArithmeticCount += 1;
    const basicAtom = /\\binom\{|\d+!|\{\}\^\{?\d+\}?[PC]_|\d+\^\{?\d+\}?/.test(source.solver.mathJax);
    if (basicAtom && !/\\sum|S\(|B_|p_|D_/.test(source.solver.mathJax)) assert.ok(hasExpandedArithmetic, `${entry.qlId}: arithmetic atom was not expanded`);

    for (const line of steps.lines) {
      const display = line.match(/\$\$([^$]+)\$\$/)?.[1];
      if (!display) continue;
      const equality = display.match(/^\s*([\d,]+)\s*=\s*([\d,]+)\s*$/);
      assert.ok(!equality || equality[1] !== equality[2], `${entry.qlId}: redundant equality remains`);
      if (/\*\*Combine/.test(line)) {
        assert.ok(!/^\d{3,}\s*=/.test(display), `${entry.qlId}: concatenated numeric factors remain`);
        assert.ok(!/\d+!/.test(display), `${entry.qlId}: unevaluated factorial remains in a combined line`);
      }
    }

    const shortcut = getSection(presentation, "examSpeedShortcut");
    assert.equal(shortcut.lines.length, 1);
    assert.ok(shortcut.lines[0]!.includes("$"));

    const traps = getSection(presentation, "commonTrapWarning");
    assert.equal(traps.lines.length, 3);
    assert.ok(traps.lines.every((line) => /^Don't fall for Option [A-D] \(/.test(line)));
    assert.ok(traps.lines.every((line) => !thirdPersonAfterSecondPerson.test(line)), `${entry.qlId}: trap grammar is not conversational`);
    trapCount += traps.lines.length;

    const studentText = [presentation.stem, ...presentation.displayOptions, ...presentation.explanationSections.flatMap((section) => [section.heading, ...section.lines])].join(" ");
    assert.ok(!/\{[A-Za-z][A-Za-z0-9_]{1,}\}/.test(stripDelimitedMath(studentText)));
    assert.equal((studentText.match(/\$\$/g) ?? []).length % 2, 0);

    output.push({
      qlId: entry.qlId,
      cpId: entry.cpId,
      difficulty: entry.difficulty,
      solveMode: entry.solveMode,
      examAlignment,
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
assert.equal(output.length, 163);
assert.equal(trapCount, 489);
assert.ok(expandedArithmeticCount >= 120, `Only ${expandedArithmeticCount} QLs have expanded arithmetic`);
assert.deepEqual([...coreGroups.values()].filter((group) => group.length > 3), []);
assert.deepEqual(Object.fromEntries([...cpCounts.entries()].sort()), {
  "PNC-CP-007": 18,
  "PNC-CP-008": 23,
  "PNC-CP-009": 29,
  "PNC-CP-010": 32,
  "PNC-CP-011": 33,
  "PNC-CP-012": 28,
});

const byQl = new Map(output.map((row) => [row.qlId, row]));
function combined(qlId: string, field: "coreConcept" | "stepByStep" | "examSpeedShortcut" | "commonTrapWarning"): string {
  return (byQl.get(qlId)?.[field] ?? []).join(" ");
}

for (const qlId of ["PNC-QL-211", "PNC-QL-212", "PNC-QL-213", "PNC-QL-214", "PNC-QL-217", "PNC-QL-218"]) {
  assert.match(combined(qlId, "coreConcept"), /unlabelled|interchangeable|whole-group symmetry/i);
  assert.doesNotMatch(combined(qlId, "coreConcept"), /group names make|names already distinguish/i);
  assert.doesNotMatch(combined(qlId, "commonTrapWarning"), /group names distinguish|names already distinguish/i);
}
for (const qlId of ["PNC-QL-226", "PNC-QL-227", "PNC-QL-228"]) {
  assert.match(combined(qlId, "coreConcept"), /different objects|Stirling|Bell/i);
  assert.doesNotMatch(combined(qlId, "coreConcept"), /identical objects/i);
  assert.match(combined(qlId, "examSpeedShortcut"), /Stirling|Bell/i);
}
for (const qlId of ["PNC-QL-229", "PNC-QL-230", "PNC-QL-231", "PNC-QL-232", "PNC-QL-233", "PNC-QL-234", "PNC-QL-235", "PNC-QL-236", "PNC-QL-237", "PNC-QL-238", "PNC-QL-262", "PNC-QL-263", "PNC-QL-265", "PNC-QL-266"]) {
  assert.match(combined(qlId, "coreConcept"), /identical|occupanc|stars and bars|partition/i);
  assert.doesNotMatch(combined(qlId, "coreConcept"), /Different objects make different assignments/i);
  assert.doesNotMatch(combined(qlId, "examSpeedShortcut"), /Different objects suggest repeated receiver choices/i);
}
assert.doesNotMatch(combined("PNC-QL-107", "examSpeedShortcut"), /not together|total minus forbidden/i);
assert.match(combined("PNC-QL-236", "examSpeedShortcut"), /inclusion–exclusion|capacity/i);
const ql269 = byQl.get("PNC-QL-269");
assert.ok(ql269);
const ql269Steps = combined("PNC-QL-269", "stepByStep");
const ql269Combine = ql269.stepByStep.find((line) => line.includes("**Combine the evaluated stages:**"));
assert.ok(ql269Combine, "PNC-QL-269: evaluated factors must be combined explicitly");
assert.ok((ql269Combine.match(/\\times/g) ?? []).length >= 2, "PNC-QL-269: all team and captain factors must remain visible");
assert.ok(ql269Combine.includes(`= ${ql269.answer}`), "PNC-QL-269: combined arithmetic must reach the generated answer");
assert.doesNotMatch(ql269Steps, /10316/);

for (const qlId of ["PNC-QL-247", "PNC-QL-248", "PNC-QL-249"]) {
  const row = byQl.get(qlId);
  assert.ok(row);
  assert.equal(row.optionUnit, "arrangements");
  assert.ok(row.displayOptions.every((option) => option.endsWith(" arrangements")));
  assert.ok(row.answerLabel.endsWith(" arrangements"));
}
assert.doesNotMatch(combined("PNC-QL-247", "commonTrapWarning"), /whole-group symmetry|interchangeable groups/i);
assert.doesNotMatch(combined("PNC-QL-248", "commonTrapWarning"), /whole-group symmetry|interchangeable groups/i);
for (const row of output) {
  assert.doesNotMatch(row.coreConcept.join(" "), /This people|This books|This group formation|In this people|In this books|In this files/i);
}

const normalizedStems = new Map<string, string[]>();
for (const row of output) {
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
  ...output.map((row) => [
    row.qlId, row.cpId, row.difficulty, row.solveMode, row.examAlignment, row.originalStem, row.upgradedStem, row.optionUnit,
    row.displayOptions[0], row.displayOptions[1], row.displayOptions[2], row.displayOptions[3], String.fromCharCode(65 + row.correctIndex),
    row.answer, row.answerLabel, row.equation, row.mathJax, row.coreHeading, row.coreConcept, row.stepByStep,
    row.shortcutHeading, row.examSpeedShortcut, row.trapHeading, row.commonTrapWarning, row.runtimeValidation,
  ].map(csvCell).join(",")),
];

const report = {
  packageId: "PNC-002",
  editorialStandard: "FINAL_TEACHER_STYLE_SCENARIO_SPECIFIC_EXPANDED_ARITHMETIC_CONVERSATIONAL_TRAPS",
  qlRange: ["PNC-QL-107", "PNC-QL-269"],
  qlCount: output.length,
  solveModeCount: new Set(output.map((row) => row.solveMode)).size,
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  alignmentCounts: Object.fromEntries([...alignmentCounts.entries()].sort()),
  expandedArithmeticCount,
  conversationalTrapCount: trapCount,
  repeatedCoreGroups: [...coreGroups.values()].filter((group) => group.length > 3),
  duplicateStudentStemGroups,
  invalid,
  originalRuntimeValidationPreserved: true,
  publiclyPublishable: false,
  status: "PASS",
};

const directory = resolve(process.cwd(), "dist/quant-v4/pnc-002-editorial-quality-teacher-final");
mkdirSync(directory, { recursive: true });
writeFileSync(resolve(directory, "pnc-002-editorial-quality-teacher-final.json"), `${JSON.stringify(output, null, 2)}\n`, "utf8");
writeFileSync(resolve(directory, "pnc-002-editorial-quality-teacher-final.csv"), `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(resolve(directory, "pnc-002-editorial-quality-teacher-final-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
