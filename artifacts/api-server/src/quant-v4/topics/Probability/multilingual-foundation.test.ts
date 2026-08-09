import {
  PROBABILITY_LANGUAGES,
  assertProbabilityLanguagePubliclyPublishable,
  assertProbabilityLanguageQuestionStudioReady,
  buildProbabilityMultilingualManifest,
  getProbabilityMultilingualReadinessSummary,
} from "./multilingual-foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertThrows(run: () => unknown, expected: RegExp, message: string): void {
  try {
    run();
  } catch (error) {
    assert(expected.test(String(error)), `${message}: ${String(error)}`);
    return;
  }
  throw new Error(`${message}: expected an error`);
}

const manifest = buildProbabilityMultilingualManifest();
const summary = getProbabilityMultilingualReadinessSummary();

assert(PROBABILITY_LANGUAGES.join(",") === "en,hi,pa", "Probability language order changed.");
assert(summary.englishQlCount === 216, `Expected 216 English QLs, found ${summary.englishQlCount}.`);
assert(summary.manifestEntryCount === 648, `Expected 648 language records, found ${summary.manifestEntryCount}.`);
assert(summary.pendingHindiCount === 216, `Expected 216 pending Hindi entries, found ${summary.pendingHindiCount}.`);
assert(summary.pendingPunjabiCount === 216, `Expected 216 pending Punjabi entries, found ${summary.pendingPunjabiCount}.`);
assert(
  summary.questionStudioEnabledLanguages.length === 1 &&
    summary.questionStudioEnabledLanguages[0] === "en",
  "Only English may be enabled in Question Studio during the foundation checkpoint.",
);
assert(summary.publiclyPublishableLanguages.length === 0, "No Probability language may be publicly publishable.");

const keys = manifest.map((entry) => `${entry.packageId}:${entry.cpId}:${entry.qlId}:${entry.language}`);
assert(new Set(keys).size === keys.length, "Multilingual manifest contains duplicate language records.");

for (const entry of manifest) {
  assert(entry.sourceLanguage === "en", `${entry.qlId}/${entry.language}: source language changed.`);
  assert(entry.publiclyPublishable === false, `${entry.qlId}/${entry.language}: public release must remain disabled.`);
  if (entry.language === "en") {
    assert(entry.localizationStatus === "APPROVED_EDITORIAL_ENGLISH", `${entry.qlId}: English approval missing.`);
    assert(entry.questionStudioEnabled, `${entry.qlId}: approved English entry is not enabled.`);
    assert(entry.authority === "PROBABILITY_ENGLISH_RUNTIME", `${entry.qlId}: English authority changed.`);
  } else {
    assert(entry.localizationStatus === "PENDING_NATIVE_EDITORIAL", `${entry.qlId}/${entry.language}: native entry must remain pending.`);
    assert(!entry.questionStudioEnabled, `${entry.qlId}/${entry.language}: unapproved native entry was exposed.`);
    assert(entry.authority === "PROBABILITY_NATIVE_EDITORIAL_PENDING", `${entry.qlId}/${entry.language}: native authority changed.`);
  }
}

assertProbabilityLanguageQuestionStudioReady("en");
assertThrows(
  () => assertProbabilityLanguageQuestionStudioReady("hi"),
  /not Question Studio-ready/,
  "Hindi readiness guard did not fail closed",
);
assertThrows(
  () => assertProbabilityLanguageQuestionStudioReady("pa"),
  /not Question Studio-ready/,
  "Punjabi readiness guard did not fail closed",
);
for (const language of PROBABILITY_LANGUAGES) {
  assertThrows(
    () => assertProbabilityLanguagePubliclyPublishable(language),
    /not publicly publishable/,
    `${language} public-release guard did not fail closed`,
  );
}

console.log(JSON.stringify(summary));
