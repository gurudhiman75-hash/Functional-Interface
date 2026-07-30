import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPnc002QuestionEntries } from "./foundation/library";
import {
  buildPnc002Cp010LocalizedPresentation,
  PNC_002_CP010_LOCALIZATION_CANDIDATE,
} from "./foundation/localization-cp010-reviewed-human";
import type { PncStudentLocale } from "./foundation/localization-types";
import { runPnc002Pipeline } from "./foundation/pipeline";
import type { PncStudentPresentation } from "./foundation/student-presentation";
import { buildPnc002ProductionTeacherStudentPresentation } from "./foundation/student-presentation-teacher-production";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-010");
const expectedIds = Array.from({ length: 32 }, (_, index) => `PNC-QL-${String(index + 177).padStart(3, "0")}`);
const locales: PncStudentLocale[] = ["hi-IN", "pa-IN"];
const seeds = ["human-a", "human-b", "human-c"];

assert.equal(PNC_002_CP010_LOCALIZATION_CANDIDATE.status, "MANUAL_REVIEW");
assert.equal(PNC_002_CP010_LOCALIZATION_CANDIDATE.editorialStatus, "PENDING");
assert.equal(PNC_002_CP010_LOCALIZATION_CANDIDATE.publiclyPublishable, false);
assert.deepEqual(entries.map((entry) => entry.qlId), expectedIds);
assert.equal(new Set(entries.map((entry) => entry.solveMode)).size, 25);

function getSection(presentation: PncStudentPresentation, kind: string) {
  const section = presentation.explanationSections.find((candidate) => candidate.kind === kind);
  assert.ok(section, `${presentation.questionLanguageId}: missing ${kind}`);
  return section;
}
function mathTokens(value: string): string[] {
  return [...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g)].map((match) => match[0]!.trim());
}
function numericTokens(value: string): string[] {
  return [...value.matchAll(/-?\d+(?:,\d{3})*/g)].map((match) => match[0]!.replace(/,/g, ""));
}
function optionNumber(value: string): string {
  const match = value.match(/^(-?[\d,]+)/);
  assert.ok(match, `localized option has no leading number: ${value}`);
  return match[1]!.replace(/,/g, "");
}
function normalizeStem(value: string): string {
  return value.toLowerCase().replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, "{math}").replace(/-?\d+(?:,\d{3})*/g, "{value}").replace(/\s+/g, " ").trim();
}
function normalizeProse(value: string): string {
  return value.toLowerCase().replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, "{math}").replace(/(?:विकल्प|ਚੋਣ)\s+[a-d]\s+\([^)]*\):\s*/g, "").replace(/-?\d+(?:,\d{3})*/g, "{value}").replace(/\s+/g, " ").trim();
}
function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

const invalid: string[] = [];
const exportRows: Array<{
  qlId: string; cpId: string; difficulty: string; solveMode: string; locale: PncStudentLocale;
  englishStem: string; localizedStem: string; optionUnit: string; displayOptions: string[];
  correctIndex: number; answerLabel: string; coreHeading: string; coreConcept: string[];
  stepHeading: string; stepByStep: string[]; shortcutHeading: string; examSpeedShortcut: string[];
  trapHeading: string; commonTrapWarning: string[]; runtimeValidation: boolean;
  editorialStatus: string; publiclyPublishable: boolean;
}> = [];
const stemKeys = new Map<PncStudentLocale, Set<string>>([["hi-IN", new Set()], ["pa-IN", new Set()]]);
const methodKeys = new Map<PncStudentLocale, Set<string>>([["hi-IN", new Set()], ["pa-IN", new Set()]]);
const shortcutKeys = new Map<PncStudentLocale, Set<string>>([["hi-IN", new Set()], ["pa-IN", new Set()]]);
const trapKeys = new Map<PncStudentLocale, Set<string>>([["hi-IN", new Set()], ["pa-IN", new Set()]]);
let auditedPackages = 0;

for (const entry of entries) {
  for (const locale of locales) {
    for (const seedName of seeds) {
      try {
        const source = runPnc002Pipeline({
          questionLanguageId: entry.qlId,
          seed: `pnc-cp010-human-review:${locale}:${seedName}:${entry.qlId}`,
        });
        assert.equal(source.validation.valid, true);
        assert.equal(source.publiclyPublishable, false);
        const english = buildPnc002ProductionTeacherStudentPresentation(source);
        const localized = buildPnc002Cp010LocalizedPresentation(source, locale);
        auditedPackages += 1;

        assert.equal(localized.questionLanguageId, entry.qlId);
        assert.equal(localized.canonicalProblemId, "PNC-CP-010");
        assert.equal(localized.solveMode, entry.solveMode);
        assert.equal(localized.locale, locale);
        assert.equal(localized.sourceLocale, "en-GB");
        assert.equal(localized.editorialStatus, "PENDING");
        assert.equal(localized.publiclyPublishable, false);
        assert.equal(localized.displayOptions.length, 4);
        assert.equal(new Set(localized.displayOptions).size, 4);
        assert.equal(localized.displayOptions[localized.correctIndex], localized.answerLabel);
        assert.deepEqual(localized.displayOptions.map(optionNumber), source.options.map((option) => option.replace(/,/g, "")));
        assert.deepEqual(numericTokens(localized.stem), numericTokens(english.stem));
        assert.deepEqual(mathTokens(localized.stem), mathTokens(english.stem));
        assert.ok(locale === "hi-IN" ? localized.stem.startsWith("एक") : localized.stem.startsWith("ਇੱਕ"));

        const scriptPattern = locale === "hi-IN" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
        const foreignScriptPattern = locale === "hi-IN" ? /[\u0A05-\u0A39]/ : /[\u0904-\u0939\u0958-\u0961]/;
        const studentText = [localized.stem, ...localized.displayOptions, ...localized.explanationSections.flatMap((section) => [section.heading, ...section.lines])].join(" ");
        const proseOnly = studentText.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, " ");
        assert.match(studentText, scriptPattern);
        assert.doesNotMatch(studentText, foreignScriptPattern);
        assert.doesNotMatch(proseOnly, /In how many|How many arrangements|Core Concept|Step-by-Step|Exam Speed Shortcut|Common Trap|Final answer/i);
        assert.doesNotMatch(proseOnly, /\{[A-Za-z][A-Za-z0-9_]{1,}\}/);
        assert.doesNotMatch(proseOnly, /मामल|ਮਾਮਲ/);
        assert.doesNotMatch(proseOnly, /बैठक-समूह|बैठक-चक्र|संयुक्त गोल बैठक|गोल-मेज़ समूह|उलटी-गणना|उलटी गोल-बैठक|मनकों के छल्ले के लिए|ਬੈਠਕ-ਗਰੁੱਪ|ਬੈਠਕ ਦੀ ਯੋਜਨਾ|ਬੈਠਕ-ਚੱਕਰ|ਸਾਂਝੀ ਗੋਲ ਬੈਠਕ|ਗੋਲ-ਮੇਜ਼ ਗਰੁੱਪ|ਉਲਟੀ ਗੋਲ-ਬੈਠਕ ਸਮੱਸਿਆ|ਮਣਕਿਆਂ ਦੇ ਛੱਲੇ ਲਈ/);

        const englishSteps = getSection(english, "stepByStep");
        const localizedCore = getSection(localized, "coreConcept");
        const localizedSteps = getSection(localized, "stepByStep");
        const localizedShortcut = getSection(localized, "examSpeedShortcut");
        const localizedTraps = getSection(localized, "commonTrapWarning");
        assert.equal(localizedCore.lines.length, 2);
        assert.equal(localizedSteps.lines.length, englishSteps.lines.length);
        assert.deepEqual(mathTokens(localizedSteps.lines.join("\n")), mathTokens(englishSteps.lines.join("\n")));
        assert.ok(localizedSteps.lines.every((line, index) => line.startsWith(`${index + 1}. `)));
        assert.ok(localizedSteps.lines.slice(0, -1).every((line) => !line.includes(localized.answerLabel)));
        assert.ok(localizedSteps.lines.at(-1)?.includes(localized.answerLabel));
        assert.doesNotMatch(localizedSteps.lines.slice(2, -1).join(" "), /इस चरण की आवश्यक गणना|ਇਸ ਪੜਾਅ ਦਾ ਲੋੜੀਂਦਾ ਹਿਸਾਬ/);
        assert.equal(localizedShortcut.lines.length, 1);
        assert.deepEqual(mathTokens(localizedShortcut.lines.join("\n")), mathTokens(getSection(english, "examSpeedShortcut").lines.join("\n")));
        assert.doesNotMatch(localizedShortcut.lines.join(" "), /सामान्य गोल बैठक से शुरू|पहले आवश्यक ब्लॉक बनाकर|शर्त से मिलने वाले मान्य स्थान|उपयुक्त अंतराल चुनकर|हर उम्मीदवार पर वही गोल-बैठक सूत्र|एक तरफ़ वाले प्रदर्शन में केवल घुमाव हटता|ਆਮ ਗੋਲ ਬੈਠਕ ਤੋਂ ਸ਼ੁਰੂ|ਪਹਿਲਾਂ ਲੋੜੀਂਦੇ ਬਲਾਕ ਬਣਾ ਕੇ|ਸ਼ਰਤ ਤੋਂ ਮਿਲਦੀਆਂ ਸਹੀ ਥਾਵਾਂ|ਠੀਕ ਖਾਲੀਆਂ ਥਾਵਾਂ ਚੁਣ ਕੇ|ਹਰ ਉਮੀਦਵਾਰ ਉੱਤੇ ਉਹੀ ਗੋਲ-ਬੈਠਕ ਨਿਯਮ|ਇੱਕ ਪਾਸੇ ਵਾਲੇ ਪ੍ਰਦਰਸ਼ਨ ਵਿੱਚ ਸਿਰਫ਼ ਘੁਮਾਵ ਹਟਦਾ/);
        assert.equal(localizedTraps.lines.length, 3);
        assert.ok(localizedTraps.lines.every((line) => locale === "hi-IN" ? /^विकल्प [A-D] \(/.test(line) : /^ਚੋਣ [A-D] \(/.test(line)));
        assert.deepEqual(mathTokens(localizedTraps.lines.join("\n")), mathTokens(getSection(english, "commonTrapWarning").lines.join("\n")));

        if (seedName === seeds[0]) {
          stemKeys.get(locale)!.add(normalizeStem(localized.stem));
          methodKeys.get(locale)!.add(normalizeProse(localizedCore.lines[1]!));
          shortcutKeys.get(locale)!.add(normalizeProse(localizedShortcut.lines[0]!));
          trapKeys.get(locale)!.add(normalizeProse(localizedTraps.lines.join("\n")));
          exportRows.push({
            qlId: entry.qlId, cpId: entry.cpId, difficulty: entry.difficulty, solveMode: entry.solveMode, locale,
            englishStem: english.stem, localizedStem: localized.stem, optionUnit: localized.optionUnit,
            displayOptions: [...localized.displayOptions], correctIndex: localized.correctIndex,
            answerLabel: localized.answerLabel, coreHeading: localizedCore.heading, coreConcept: [...localizedCore.lines],
            stepHeading: localizedSteps.heading, stepByStep: [...localizedSteps.lines], shortcutHeading: localizedShortcut.heading,
            examSpeedShortcut: [...localizedShortcut.lines], trapHeading: localizedTraps.heading,
            commonTrapWarning: [...localizedTraps.lines], runtimeValidation: source.validation.valid,
            editorialStatus: localized.editorialStatus, publiclyPublishable: localized.publiclyPublishable,
          });
        }
      } catch (error) {
        invalid.push(`${entry.qlId}/${locale}/${seedName}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

assert.deepEqual(invalid, []);
assert.equal(auditedPackages, 32 * 2 * 3);
assert.equal(exportRows.length, 64);
for (const locale of locales) {
  assert.equal(stemKeys.get(locale)!.size, 32, `${locale}: stem uniqueness`);
  assert.equal(methodKeys.get(locale)!.size, 32, `${locale}: method uniqueness`);
  assert.equal(shortcutKeys.get(locale)!.size, 32, `${locale}: shortcut uniqueness`);
  assert.equal(trapKeys.get(locale)!.size, 32, `${locale}: trap-block uniqueness`);
}

const headers = [
  "qlId", "cpId", "difficulty", "solveMode", "locale", "englishStem", "localizedStem", "optionUnit",
  "optionA", "optionB", "optionC", "optionD", "correctOption", "answerLabel", "coreHeading", "coreConcept",
  "stepHeading", "stepByStep", "shortcutHeading", "examSpeedShortcut", "trapHeading", "commonTrapWarning",
  "runtimeValidation", "editorialStatus", "publiclyPublishable",
];
const csvLines = [
  headers.map(csvCell).join(","),
  ...exportRows.map((row) => [
    row.qlId, row.cpId, row.difficulty, row.solveMode, row.locale, row.englishStem, row.localizedStem,
    row.optionUnit, row.displayOptions[0], row.displayOptions[1], row.displayOptions[2], row.displayOptions[3],
    String.fromCharCode(65 + row.correctIndex), row.answerLabel, row.coreHeading, row.coreConcept,
    row.stepHeading, row.stepByStep, row.shortcutHeading, row.examSpeedShortcut, row.trapHeading,
    row.commonTrapWarning, row.runtimeValidation, row.editorialStatus, row.publiclyPublishable,
  ].map(csvCell).join(",")),
];
const report = {
  releaseId: PNC_002_CP010_LOCALIZATION_CANDIDATE.releaseId,
  canonicalProblemId: "PNC-CP-010",
  qlRange: ["PNC-QL-177", "PNC-QL-208"],
  qlCount: 32,
  solveModeCount: 25,
  locales,
  localizedPresentations: exportRows.length,
  auditedSeededPackages: auditedPackages,
  questionSpecificMethodsPerLocale: 32,
  questionSpecificShortcutsPerLocale: 32,
  questionSpecificTrapBlocksPerLocale: 32,
  naturalStemAudit: true,
  formulaParityPreserved: true,
  optionParityPreserved: true,
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  invalid,
  status: "PASS",
};
const directory = resolve(process.cwd(), "dist/quant-v4/pnc-002-localization-cp010-human-review");
mkdirSync(directory, { recursive: true });
writeFileSync(resolve(directory, "pnc-002-cp010-hi-pa-human-review.json"), `${JSON.stringify(exportRows, null, 2)}\n`, "utf8");
writeFileSync(resolve(directory, "pnc-002-cp010-hi-pa-human-review.csv"), `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(resolve(directory, "pnc-002-cp010-hi-pa-human-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
