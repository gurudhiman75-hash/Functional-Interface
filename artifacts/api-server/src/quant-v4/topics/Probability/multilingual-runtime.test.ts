import assert from "node:assert/strict";
import { listPrb001QuestionEntries, runPrb001Pipeline } from "./PRB-001";
import { listPrb002QuestionEntries, runPrb002Pipeline } from "./PRB-002";
import {
  listProbabilityMl05QlEntries,
  PROBABILITY_NATIVE_PREVIEW_STATUS,
  renderProbabilityNativePreview,
  runProbabilityNativePreview,
} from "./multilingual-runtime";
import {
  assertProbabilityLanguageQuestionStudioReady,
  buildProbabilityMultilingualManifest,
} from "./multilingual-foundation";
import { auditProbabilityNativeText } from "./native-language-primitives";
import type { ProbabilityNativeLanguage } from "./multilingual-foundation";
import type { ProbabilityQuestion } from "./shared/types";
import { canonicalizeProbabilityExplanationMathSegment } from "./shared/native-math-event-labels";

function stringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function mathematicalSnapshot(question: ProbabilityQuestion): string {
  return stringify({
    packageId: question.packageId,
    canonicalProblemId: question.canonicalProblemId,
    questionLanguageId: question.questionLanguageId,
    seed: question.seed,
    examProfile: question.examProfile,
    optionCount: question.optionCount,
    difficultyBand: question.difficultyBand,
    taskKind: question.taskKind,
    solveMode: question.solveMode,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    parameters: question.parameters,
    experiment: question.experiment,
    event: question.event,
    solver: question.solver,
    independentVerification: question.independentVerification,
    reasoningEvidence: question.reasoningEvidence,
    mathematicalFingerprint: question.mathematicalFingerprint,
    parameterFingerprint: question.parameterFingerprint,
    mockPolicy: question.parameters.mockPolicy,
  });
}

function mathSegments(value: string): string[] {
  const result: string[] = [];
  for (const [open, close] of [["\\(", "\\)"], ["\\[", "\\]"]] as const) {
    let cursor = 0;
    while (cursor < value.length) {
      const start = value.indexOf(open, cursor);
      if (start < 0) break;
      const end = value.indexOf(close, start + open.length);
      if (end < 0) throw new Error(`Unclosed MathJax segment: ${value}`);
      result.push(value.slice(start, end + close.length));
      cursor = end + close.length;
    }
  }
  return result;
}

function numericMultiset(value: string): string[] {
  return (value.match(/\d+(?:\.\d+)?/gu) ?? []).sort();
}

function expectedNativeRole(englishLine: string, language: ProbabilityNativeLanguage): string {
  if (englishLine.startsWith("Method — ")) return language === "hi" ? "विधि" : "ਵਿਧੀ";
  const step = englishLine.match(/^Step (\d+) — /u)?.[1];
  if (step) return language === "hi" ? `चरण ${step}` : `ਕਦਮ ${step}`;
  if (englishLine.startsWith("Simplification — ")) return language === "hi" ? "सरलीकरण" : "ਸਰਲੀਕਰਨ";
  if (englishLine.startsWith("Key point — ")) return language === "hi" ? "मुख्य बिंदु" : "ਮੁੱਖ ਬਿੰਦੂ";
  if (englishLine.startsWith("Answer — ")) return language === "hi" ? "उत्तर" : "ਉੱਤਰ";
  throw new Error(`Unsupported English explanation role: ${englishLine}`);
}

function assertExplanationAuthority(
  source: ProbabilityQuestion,
  nativeLines: readonly string[],
  language: ProbabilityNativeLanguage,
): void {
  const englishLines = source.explanation.lines;
  assert.equal(
    nativeLines.length,
    englishLines.length,
    `${source.questionLanguageId}/${language}: native explanation step count diverged from English authority`,
  );

  for (let index = 0; index < englishLines.length; index += 1) {
    const englishLine = englishLines[index]!;
    const nativeLine = nativeLines[index]!;
    const role = expectedNativeRole(englishLine, language);
    assert(
      nativeLine.startsWith(`${role} — `),
      `${source.questionLanguageId}/${language}: explanation role/order drifted at line ${index + 1}`,
    );
    assert.deepEqual(
      mathSegments(nativeLine).map((segment) => canonicalizeProbabilityExplanationMathSegment(segment, language)),
      mathSegments(englishLine),
      `${source.questionLanguageId}/${language}: MathJax semantics changed at line ${index + 1}`,
    );
    assert.deepEqual(
      numericMultiset(nativeLine),
      numericMultiset(englishLine),
      `${source.questionLanguageId}/${language}: numeric facts changed at line ${index + 1}`,
    );
    const auditLine = nativeLine.replaceAll("n!/[r!(n-r)!]", "\\(n!/[r!(n-r)!]\\)");
    const audit = auditProbabilityNativeText(auditLine, language);
    assert(audit.valid, `${source.questionLanguageId}/${language}: explanation line ${index + 1} failed ${JSON.stringify(audit)}`);
  }
}

const allEntries = listProbabilityMl05QlEntries();
assert.equal(allEntries.length, 216);
assert.equal(listPrb001QuestionEntries().length, 120);
assert.equal(listPrb002QuestionEntries().length, 96);
assert.equal(new Set(allEntries.map((entry) => `${entry.packageId}:${entry.qlId}`)).size, 216);

const localizedQuestionIds = new Set<string>();
const localizedExplanationIds = new Set<string>();
let nativePresentationCount = 0;
let hindiCount = 0;
let punjabiCount = 0;
let prb001NativeCount = 0;
let prb002NativeCount = 0;
let visualCount = 0;
let explanationLinePairsChecked = 0;

for (const entry of allEntries) {
  const seed = `ml05-parity:${entry.qlId}`;
  const source = entry.packageId === "PRB-001"
    ? runPrb001Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed })
    : runPrb002Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed });

  assert.equal(source.language, "en");
  assert(source.validation.valid, `${entry.qlId}: English source must validate before native rendering`);
  const before = mathematicalSnapshot(source);

  for (const language of ["hi", "pa"] as const) {
    const preview = renderProbabilityNativePreview(source, language);
    const presentation = preview.presentation;
    nativePresentationCount += 1;
    if (language === "hi") hindiCount += 1;
    else punjabiCount += 1;
    if (entry.packageId === "PRB-001") prb001NativeCount += 1;
    else prb002NativeCount += 1;

    assert.equal(presentation.language, language);
    assert.equal(presentation.qlId, entry.qlId);
    assert.equal(presentation.sourceQuestionId, source.questionId);
    assert.equal(presentation.sourceExplanationId, source.explanation.explanationId);
    assert.equal(presentation.localizedQuestionId, `${source.questionId}-${language}`);
    assert.equal(presentation.localizedExplanationId, `${source.explanation.explanationId}-${language}`);
    assert(!localizedQuestionIds.has(presentation.localizedQuestionId), `Duplicate localized question id ${presentation.localizedQuestionId}`);
    assert(!localizedExplanationIds.has(presentation.localizedExplanationId), `Duplicate localized explanation id ${presentation.localizedExplanationId}`);
    localizedQuestionIds.add(presentation.localizedQuestionId);
    localizedExplanationIds.add(presentation.localizedExplanationId);

    assert.equal(presentation.localizationStatus, PROBABILITY_NATIVE_PREVIEW_STATUS);
    assert.equal(presentation.questionStudioEnabled, false);
    assert.equal(presentation.publiclyPublishable, false);
    assert(presentation.validation.valid, `${entry.qlId}/${language}: native presentation validation failed`);

    const stemAudit = auditProbabilityNativeText(presentation.stem, language);
    assert(stemAudit.valid, `${entry.qlId}/${language}: stem audit failed ${JSON.stringify(stemAudit)}`);
    assert.notEqual(presentation.stem, source.stem, `${entry.qlId}/${language}: native stem silently fell back to English`);

    assert.deepEqual(presentation.options, source.options, `${entry.qlId}/${language}: options changed`);
    assert.equal(presentation.correctIndex, source.correctIndex, `${entry.qlId}/${language}: correct index changed`);
    assert.equal(presentation.answer, source.answer, `${entry.qlId}/${language}: answer changed`);
    assert.equal(presentation.options[presentation.correctIndex], source.options[source.correctIndex]);

    assert.equal(preview.parity.sourceLanguage, "en");
    assert.equal(preview.parity.targetLanguage, language);
    assert.equal(preview.parity.sourceSeed, source.seed);
    assert.equal(preview.parity.sourceQuestionLanguageId, source.questionLanguageId);
    assert.equal(preview.parity.parameterFingerprint, source.parameterFingerprint);
    assert.equal(preview.parity.mathematicalFingerprint, source.mathematicalFingerprint);
    assert.equal(preview.parity.optionPolicy, "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX");
    assert.equal(preview.parity.answerKeyAuthority, "ENGLISH_RUNTIME");
    assert.equal(preview.parity.solverAuthority, "ENGLISH_RUNTIME");
    assert.equal(preview.parity.mockPolicyAuthority, "ENGLISH_RUNTIME");
    assert.equal(preview.parity.exactOptionsPreserved, true);
    assert.equal(preview.parity.answerPreserved, true);
    assert.equal(preview.parity.correctIndexPreserved, true);

    assertExplanationAuthority(source, presentation.explanation.lines, language);
    explanationLinePairsChecked += source.explanation.lines.length;
    assert(presentation.explanation.wordCount > 0);

    for (const visual of presentation.explanation.visuals) {
      visualCount += 1;
      assert(auditProbabilityNativeText(visual.title, language).valid, `${entry.qlId}/${language}: visual title leaked English`);
      assert(auditProbabilityNativeText(visual.altText, language).valid, `${entry.qlId}/${language}: visual alt text leaked English`);
      if (typeof visual.data.event === "string") {
        assert(auditProbabilityNativeText(visual.data.event, language).valid, `${entry.qlId}/${language}: visual event leaked English`);
      }
      if (typeof visual.data.replacementPolicy === "string") {
        assert(auditProbabilityNativeText(visual.data.replacementPolicy, language).valid, `${entry.qlId}/${language}: visual replacement label leaked English`);
      }
      if (Array.isArray(visual.data.leaves)) {
        for (const leaf of visual.data.leaves) {
          assert(auditProbabilityNativeText(String(leaf), language).valid, `${entry.qlId}/${language}: coin-tree leaf leaked English`);
        }
      }
    }

    assert.equal(mathematicalSnapshot(source), before, `${entry.qlId}/${language}: native renderer mutated English mathematical authority`);
  }

  const replay = entry.packageId === "PRB-001"
    ? runPrb001Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed })
    : runPrb002Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed });
  assert.equal(replay.parameterFingerprint, source.parameterFingerprint, `${entry.qlId}: seeded parameter replay drifted`);
  assert.equal(replay.mathematicalFingerprint, source.mathematicalFingerprint, `${entry.qlId}: seeded mathematical replay drifted`);
  assert.deepEqual(replay.options, source.options, `${entry.qlId}: seeded options replay drifted`);
  assert.equal(replay.correctIndex, source.correctIndex, `${entry.qlId}: seeded correct index replay drifted`);
  assert.equal(replay.answer, source.answer, `${entry.qlId}: seeded answer replay drifted`);
}

assert.equal(nativePresentationCount, 432);
assert.equal(hindiCount, 216);
assert.equal(punjabiCount, 216);
assert.equal(prb001NativeCount, 240);
assert.equal(prb002NativeCount, 192);
assert.equal(localizedQuestionIds.size, 432);
assert.equal(localizedExplanationIds.size, 432);
assert(explanationLinePairsChecked > 0);
assert(visualCount > 0, "ML-05 parity suite must exercise at least one native visual path");

const first001 = listPrb001QuestionEntries()[0]!;
const routed001 = runProbabilityNativePreview(
  "PRB-001",
  first001.cpId,
  "hi",
  { questionLanguageId: first001.qlId, seed: "ml05-route-prb001" },
);
assert.equal(routed001.source.packageId, "PRB-001");
assert.equal(routed001.presentation.language, "hi");

const first002 = listPrb002QuestionEntries()[0]!;
const routed002 = runProbabilityNativePreview(
  "PRB-002",
  first002.cpId,
  "pa",
  { questionLanguageId: first002.qlId, seed: "ml05-route-prb002" },
);
assert.equal(routed002.source.packageId, "PRB-002");
assert.equal(routed002.presentation.language, "pa");

assert.throws(
  () => runPrb001Pipeline(first001.cpId as any, { questionLanguageId: first001.qlId, seed: "ml05-lock-hi", language: "hi" }),
  /English-only/,
);
assert.throws(
  () => runPrb002Pipeline(first002.cpId as any, { questionLanguageId: first002.qlId, seed: "ml05-lock-pa", language: "pa" }),
  /English-only/,
);
assert.throws(() => assertProbabilityLanguageQuestionStudioReady("hi"), /not Question Studio-ready/);
assert.throws(() => assertProbabilityLanguageQuestionStudioReady("pa"), /not Question Studio-ready/);

const manifest = buildProbabilityMultilingualManifest();
for (const language of ["hi", "pa"] as const) {
  const nativeRows = manifest.filter((row) => row.language === language);
  assert.equal(nativeRows.length, 216);
  assert(nativeRows.every((row) => row.localizationStatus === "PENDING_NATIVE_EDITORIAL"));
  assert(nativeRows.every((row) => row.questionStudioEnabled === false));
  assert(nativeRows.every((row) => row.publiclyPublishable === false));
}

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "ML-05-EXPLANATION-AUTHORITY",
  englishQlCount: 216,
  nativePresentationCount,
  hindiCount,
  punjabiCount,
  prb001NativeCount,
  prb002NativeCount,
  explanationLinePairsChecked,
  visualCount,
  localizedQuestionIdCount: localizedQuestionIds.size,
  localizedExplanationIdCount: localizedExplanationIds.size,
  questionStudioEnabledNativeCount: 0,
  publiclyPublishableNativeCount: 0,
}, null, 2));
