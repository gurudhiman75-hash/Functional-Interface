import assert from "node:assert/strict";
import { PRB_001_LIBRARIES } from "./foundation/library";
import {
  PRB_001_NATIVE_FAMILY_COUNT,
  buildPrb001NativeEditorialLibrary,
  getPrb001NativeEditorialEntry,
  getPrb001NativeEditorialReadinessSummary,
  localizePrb001NativeBindingValue,
} from "./native-editorial";
import { auditProbabilityNativeText } from "../native-language-primitives";
import {
  assertProbabilityLanguageQuestionStudioReady,
  buildProbabilityMultilingualManifest,
} from "../multilingual-foundation";

const PLACEHOLDER = /\{([A-Za-z_][A-Za-z0-9_.-]*)\}/g;
function placeholders(value: string): readonly string[] {
  return [...new Set([...value.matchAll(PLACEHOLDER)].map((match) => match[1]!))].sort();
}
function templateProseForAudit(value: string): string {
  return value.replace(PLACEHOLDER, "1");
}

const library = buildPrb001NativeEditorialLibrary();
const summary = getPrb001NativeEditorialReadinessSummary();

assert.equal(PRB_001_LIBRARIES.language.length, 120);
assert.equal(PRB_001_NATIVE_FAMILY_COUNT, 37);
assert.equal(library.length, 240);
assert.equal(summary.englishQlCount, 120);
assert.equal(summary.nativeEntryCount, 240);
assert.equal(summary.hindiEntryCount, 120);
assert.equal(summary.punjabiEntryCount, 120);
assert.equal(summary.familyCount, 37);
assert.equal(summary.draftCount, 240);
assert.equal(summary.questionStudioEnabledCount, 0);
assert.equal(summary.publiclyPublishableCount, 0);

const sourceByQl = new Map(PRB_001_LIBRARIES.language.map((entry) => [entry.qlId, entry]));
const uniqueKeys = new Set<string>();
for (const entry of library) {
  const key = `${entry.qlId}:${entry.language}`;
  assert(!uniqueKeys.has(key), `Duplicate native editorial key ${key}`);
  uniqueKeys.add(key);

  const source = sourceByQl.get(entry.qlId);
  assert(source, `Missing English source for ${entry.qlId}`);
  assert.equal(entry.packageId, "PRB-001");
  assert.equal(entry.sourceLanguage, "en");
  assert.equal(entry.sourceStemTemplateId, source.stemTemplateId);
  assert.equal(entry.contextFamily, source.contextFamily);
  assert.equal(entry.editorialStatus, "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW");
  assert.equal(entry.questionStudioEnabled, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.deepEqual(
    placeholders(entry.stemTemplate),
    placeholders(source.stemTemplate),
    `${key} changed the English binding contract`,
  );

  const stemAudit = auditProbabilityNativeText(templateProseForAudit(entry.stemTemplate), entry.language);
  assert(stemAudit.valid, `${key} stem failed native script audit: ${JSON.stringify(stemAudit)}`);
  const eventAudit = auditProbabilityNativeText(entry.eventWording, entry.language);
  assert(eventAudit.valid, `${key} event wording failed native script audit: ${JSON.stringify(eventAudit)}`);
  for (const [field, value] of Object.entries(entry.explanation)) {
    const explanationAudit = auditProbabilityNativeText(value, entry.language);
    assert(
      explanationAudit.valid,
      `${key} explanation ${field} failed native script audit: ${JSON.stringify(explanationAudit)}`,
    );
  }

  assert.equal(entry.learningOnly, entry.qlId === "PRB-QL-004" || entry.qlId === "PRB-QL-010");
}

for (const source of PRB_001_LIBRARIES.language) {
  assert(getPrb001NativeEditorialEntry(source.qlId, "hi"));
  assert(getPrb001NativeEditorialEntry(source.qlId, "pa"));
}

const bindingSamples: readonly [string, unknown][] = [
  ["object", "tickets"], ["object", "bulbs"], ["object", "balls"], ["object", "books"],
  ["context", "winning tickets"], ["context", "defective bulbs"], ["context", "qualified candidates"],
  ["context", "female employees"], ["context", "red balls"], ["context", "approved loan applications"],
  ["context", "successful candidates"],
  ["target", "red"], ["target", "blue"], ["target", "green"], ["colour", "black"],
  ["rank", "ace"], ["rank", "king"], ["rank", "queen"], ["rank", "jack"],
  ["suit", "hearts"], ["suit", "diamonds"], ["suit", "clubs"], ["suit", "spades"],
  ["property", "EVEN"], ["property", "PRIME"], ["property", "GREATER_THAN"], ["property", "LESS_THAN"],
  ["property", "DIVISIBLE"], ["property", "COMPOSITE"],
  ["eventType", "PRODUCT"], ["eventType", "SAME_PARITY"], ["eventType", "DIFFERENT_PARITY"],
  ["eventLabel", "a machine passes inspection"], ["eventLabel", "a candidate qualifies"],
  ["eventLabel", "a train arrives on time"], ["eventLabel", "an integer not exceeding 12"],
  ["eventLabel", "an integer greater than 12"], ["eventLabel", "an even integer"],
  ["pattern", "HTH"], ["probability", "3/5"], ["answer", "1/4"], ["total", 20],
];

for (const language of ["hi", "pa"] as const) {
  for (const [key, value] of bindingSamples) {
    const localized = localizePrb001NativeBindingValue(key, value, language, "PRB-QL-001");
    const audit = auditProbabilityNativeText(localized, language, { allowMathOnly: true });
    assert(audit.valid, `${language}/${key}/${String(value)} binding failed audit: ${JSON.stringify(audit)}`);
  }
  const instruction = localizePrb001NativeBindingValue(
    "answerInstruction",
    "ignored English instruction",
    language,
    "PRB-QL-001",
  );
  const instructionAudit = auditProbabilityNativeText(instruction, language);
  assert(instructionAudit.valid, `${language} probability instruction is not native`);
  const countInstruction = localizePrb001NativeBindingValue(
    "answerInstruction",
    "ignored English instruction",
    language,
    "PRB-QL-002",
  );
  assert(auditProbabilityNativeText(countInstruction, language).valid);
}

assert.throws(
  () => localizePrb001NativeBindingValue("context", "unreviewed English context", "hi", "PRB-QL-001"),
  /fail-closed/,
);
assert.throws(
  () => localizePrb001NativeBindingValue("pattern", "HX", "pa", "PRB-QL-201"),
  /Unsupported PRB-001 coin pattern/,
);

const manifest = buildProbabilityMultilingualManifest();
for (const language of ["hi", "pa"] as const) {
  const prb001Manifest = manifest.filter((entry) => entry.packageId === "PRB-001" && entry.language === language);
  assert.equal(prb001Manifest.length, 120);
  assert(prb001Manifest.every((entry) => entry.localizationStatus === "PENDING_NATIVE_EDITORIAL"));
  assert(prb001Manifest.every((entry) => entry.questionStudioEnabled === false));
  assert.throws(() => assertProbabilityLanguageQuestionStudioReady(language), /not Question Studio-ready/);
}

console.log(JSON.stringify({ status: "PASS", checkpoint: "ML-03", ...summary }, null, 2));
