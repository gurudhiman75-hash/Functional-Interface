import assert from "node:assert/strict";
import { PRB_002_LIBRARIES } from "./foundation/library";
import {
  PRB_002_NATIVE_FAMILY_COUNT,
  buildPrb002NativeEditorialLibrary,
  getPrb002NativeEditorialEntry,
  getPrb002NativeEditorialReadinessSummary,
  localizePrb002NativeBindingValue,
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

const library = buildPrb002NativeEditorialLibrary();
const summary = getPrb002NativeEditorialReadinessSummary();

assert.equal(PRB_002_LIBRARIES.language.length, 96);
assert.equal(PRB_002_NATIVE_FAMILY_COUNT, 30);
assert.equal(library.length, 192);
assert.equal(summary.englishQlCount, 96);
assert.equal(summary.nativeEntryCount, 192);
assert.equal(summary.hindiEntryCount, 96);
assert.equal(summary.punjabiEntryCount, 96);
assert.equal(summary.familyCount, 30);
assert.equal(summary.draftCount, 192);
assert.equal(summary.questionStudioEnabledCount, 0);
assert.equal(summary.publiclyPublishableCount, 0);

const sourceByQl = new Map(PRB_002_LIBRARIES.language.map((entry) => [entry.qlId, entry]));
const uniqueKeys = new Set<string>();
for (const entry of library) {
  const key = `${entry.qlId}:${entry.language}`;
  assert(!uniqueKeys.has(key), `Duplicate PRB-002 native editorial key ${key}`);
  uniqueKeys.add(key);

  const source = sourceByQl.get(entry.qlId);
  assert(source, `Missing English source for ${entry.qlId}`);
  assert.equal(entry.packageId, "PRB-002");
  assert.equal(entry.sourceLanguage, "en");
  assert.equal(entry.sourceStemTemplateId, source.stemTemplateId);
  assert.equal(entry.contextFamily, source.contextFamily);
  assert.equal(entry.editorialStatus, "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW");
  assert.equal(entry.learningOnly, false);
  assert.equal(entry.answerKeyAuthority, "ENGLISH_RUNTIME");
  assert.equal(entry.optionPolicy, "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX");
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
}

for (const source of PRB_002_LIBRARIES.language) {
  assert(getPrb002NativeEditorialEntry(source.qlId, "hi"));
  assert(getPrb002NativeEditorialEntry(source.qlId, "pa"));
}

const contextFamilyCounts = PRB_002_LIBRARIES.language.reduce<Record<string, number>>((counts, entry) => {
  counts[entry.contextFamily] = (counts[entry.contextFamily] ?? 0) + 1;
  return counts;
}, {});
assert.equal(contextFamilyCounts.SUCCESSIVE_EVENTS, 24);
assert.equal(
  Object.entries(contextFamilyCounts)
    .filter(([family]) => family.startsWith("CONDITIONAL_"))
    .reduce((sum, [, count]) => sum + count, 0),
  22,
);
assert.equal(
  Object.entries(contextFamilyCounts)
    .filter(([family]) => family.startsWith("COUNTING_"))
    .reduce((sum, [, count]) => sum + count, 0),
  26,
);
assert.equal(contextFamilyCounts.EVENT_ALGEBRA, 24);

const bindingSamples: readonly [string, unknown][] = [
  ["conditionLabel", "passed Mathematics"],
  ["targetLabel", "passed English"],
  ["conditionLabel", "shortlisted"],
  ["targetLabel", "certified"],
  ["relation", "TOGETHER"],
  ["relation", "APART"],
  ["pA", "1/2"],
  ["pB", "2/5"],
  ["pIntersection", "1/5"],
  ["pUnion", "7/10"],
  ["probability", "3/7"],
  ["answer", "1/4"],
  ["total", 80],
];

for (const language of ["hi", "pa"] as const) {
  for (const [key, value] of bindingSamples) {
    const localized = localizePrb002NativeBindingValue(key, value, language, "PRB-QL-601");
    const audit = auditProbabilityNativeText(localized, language, { allowMathOnly: true });
    assert(audit.valid, `${language}/${key}/${String(value)} binding failed audit: ${JSON.stringify(audit)}`);
  }
  const probabilityInstruction = localizePrb002NativeBindingValue(
    "answerInstruction",
    "ignored English instruction",
    language,
    "PRB-QL-501",
  );
  assert(auditProbabilityNativeText(probabilityInstruction, language).valid);

  const countInstruction = localizePrb002NativeBindingValue(
    "answerInstruction",
    "ignored English instruction",
    language,
    "PRB-QL-605",
  );
  assert(auditProbabilityNativeText(countInstruction, language).valid);
}

assert.throws(
  () => localizePrb002NativeBindingValue("conditionLabel", "unreviewed English condition", "hi", "PRB-QL-601"),
  /fail-closed/,
);
assert.throws(
  () => localizePrb002NativeBindingValue("relation", "SIDE_BY_SIDE", "pa", "PRB-QL-704"),
  /fail-closed/,
);

const manifest = buildProbabilityMultilingualManifest();
for (const language of ["hi", "pa"] as const) {
  const prb002Manifest = manifest.filter((entry) => entry.packageId === "PRB-002" && entry.language === language);
  assert.equal(prb002Manifest.length, 96);
  assert(prb002Manifest.every((entry) => entry.localizationStatus === "PENDING_NATIVE_EDITORIAL"));
  assert(prb002Manifest.every((entry) => entry.questionStudioEnabled === false));
  assert(prb002Manifest.every((entry) => entry.publiclyPublishable === false));
  assert.throws(() => assertProbabilityLanguageQuestionStudioReady(language), /not Question Studio-ready/);
}

console.log(JSON.stringify({ status: "PASS", checkpoint: "ML-04", ...summary }, null, 2));
