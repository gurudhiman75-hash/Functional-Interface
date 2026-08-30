import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal4 } from "./localization-native-v5-pedagogic-review-final4";
import { generateLocalizedTrg001QuestionNativeReviewFinal5 } from "./localization-native-v5-pedagogic-review-final5";

type Locale = "hi-IN" | "pa-IN";
type Field = [string, unknown];

function fields(question: any): Field[] {
  return [
    ["stem", question.stem],
    ...question.options.map((option: any, index: number) => [`option-${index + 1}`, option.display] as Field),
    ["answer", question.localizedAnswerDisplay ?? question.answer],
    ["keyRule", question.explanation?.keyRule],
    ...question.explanation.steps.flatMap((step: any, index: number) => [
      [`step-${index + 1}-title`, step.title] as Field,
      [`step-${index + 1}-body`, step.body] as Field,
    ]),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap] as Field),
  ];
}

function formulaAtoms(value: unknown) {
  return Array.from(new Set(String(value ?? "").match(
    /(?:sin|cos|tan|cot|sec|cosec)[A-Za-z0-9αβγθπ²°()+\-/*√=]*|\d+(?:\/\d+)?(?:°)?|π|√\d+/giu,
  ) ?? []));
}

function machineOrderArtifacts(text: string, locale: Locale) {
  const patterns = locale === "hi-IN"
    ? [
        /^पर\s+\d+°/u,
        /समतुल्य व्यंजक है\s+/u,
        /^अतः व्यंजक है\s+/u,
        /^भाग से शून्य अपरिभाषित है/u,
        /^पूरा चक्कर tan का मान अपरिवर्तित रखता है।$/u,
        /^tanθ=sinθ\/cosθ अपरिवर्तित रखता है से भाग देने पर/u,
        /(?:^|[,\s])(?:योग|कुल|गुणनफल|अनुपात) है\s+/u,
        /^उसका व्युत्क्रम है\s+/u,
        /,\s*उसका व्युत्क्रम है\s+/u,
        /^(?:वह|यह) बराबर है\s+/u,
        /व्यंजक बराबर है\s+/u,
        /^सहफलन परिमाण है\s+/u,
        /^त्रिभुज है\s+/u,
        /उनका योग ([0-9√π/+\-]+)=\1/u,
      ]
    : [
        /^ਤੇ\s+\d+°/u,
        /ਬਰਾਬਰ ਵਿਅੰਜਕ ਹੈ\s+/u,
        /^ਇਸ ਲਈ ਵਿਅੰਜਕ ਹੈ\s+/u,
        /^ਘਟਾਓ ਦਾ ਚਿੰਨ੍ਹ ਕਾਇਮ ਰੱਖੋ।$/u,
        /^ਭਾਗ ਨਾਲ ਸਿਫ਼ਰ ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ/u,
        /^ਪੂਰਾ ਚੱਕਰ tan ਦਾ ਮਾਨ ਬਿਨਾਂ ਬਦਲੇ ਰੱਖਦਾ ਹੈ।$/u,
        /^tanθ=sinθ\/cosθ ਬਿਨਾਂ ਬਦਲੇ ਰੱਖਦਾ ਹੈ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ/u,
        /^\d+ ਅਨੁਪਾਤ-ਭਾਗ ਦੇ ਬਰਾਬਰ ਹਨ\s+/u,
        /ਇਸ ਲਈ ਸਕੇਲ ਹੈ\s+/u,
        /(?:^|[,\s])(?:ਜੋੜ|ਕੁੱਲ|ਗੁਣਨਫਲ|ਅਨੁਪਾਤ) ਹੈ\s+/u,
        /^ਇਸਦਾ ਪਰਸਪਰ ਹੈ\s+/u,
        /,\s*ਇਸਦਾ ਪਰਸਪਰ ਹੈ\s+/u,
        /^(?:ਉਹ|ਇਹ) ਬਰਾਬਰ ਹੈ\s+/u,
        /ਵਿਅੰਜਕ ਬਰਾਬਰ ਹੈ\s+/u,
        /^ਸਹਿ-ਫੰਕਸ਼ਨ ਪਰਿਮਾਣ ਹੈ\s+/u,
        /^ਤਿਕੋਣ ਹੈ\s+/u,
        /ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ([0-9√π/+\-]+)=\1/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

function degreeMovedToNativeOrder(before: unknown, after: unknown, locale: Locale) {
  const source = String(before ?? "");
  const match = source.match(locale === "hi-IN" ? /^पर\s+(\d+)°,/u : /^ਤੇ\s+(\d+)°,/u);
  assert(match, `Expected Final4 degree-first machine order, got: ${source}`);
  const angle = match[1];
  const expectedPrefix = locale === "hi-IN" ? `${angle}° पर,` : `${angle}° ਤੇ,`;
  assert(String(after ?? "").startsWith(expectedPrefix), `Expected ${expectedPrefix}, got: ${String(after ?? "")}`);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
);

const extendedBothLocalePolish = new Set([
  "TRG-001-QL-032",
  "TRG-001-QL-041",
  "TRG-001-QL-042",
  "TRG-001-QL-044",
  "TRG-001-QL-062",
  "TRG-001-QL-080",
  "TRG-001-QL-085",
  "TRG-001-QL-095",
  "TRG-001-QL-098",
  "TRG-001-QL-125",
  "TRG-001-QL-137",
  "TRG-001-QL-142",
]);
const extendedPunjabiOnlyPolish = new Set([
  "TRG-001-QL-013",
  "TRG-001-QL-014",
]);

const failures: Array<{ id: string; field: string; issue: string; text: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 5;
let cases = 0;
let inspectedFields = 0;
let preservedMathAtoms = 0;
let targetedCorrections = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-final5-five-seed-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const final4 = generateLocalizedTrg001QuestionNativeReviewFinal4(qlId, seed, locale) as any;
      const final5 = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(final5, repeated, `${id}: Final5 is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(final5), trg001CanonicalSemanticFingerprint(source), `${id}: semantic drift.`);
      assert.equal(final5.stem, final4.stem, `${id}: Final5 must not alter Final4 stem.`);
      assert.deepEqual(final5.options, final4.options, `${id}: Final5 must not alter Final4 options.`);
      assert.equal(final5.localizedAnswerDisplay, final4.localizedAnswerDisplay, `${id}: Final5 answer-display drift.`);
      assert.equal(final5.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(final5.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
      assert.deepEqual(final5.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(final5.verification, source.verification, `${id}: verification drift.`);
      assert.equal(final5.explanation.steps.length, final4.explanation.steps.length, `${id}: explanation step-count drift.`);

      for (let stepIndex = 0; stepIndex < final4.explanation.steps.length; stepIndex += 1) {
        const before = final4.explanation.steps[stepIndex].body;
        const after = final5.explanation.steps[stepIndex].body;
        for (const atom of formulaAtoms(before)) {
          if (!String(after).includes(atom)) {
            failures.push({ id, field: `step-${stepIndex + 1}-body`, issue: `missing-math-atom:${atom}`, text: String(after) });
          } else {
            preservedMathAtoms += 1;
          }
        }
      }

      for (const [field, raw] of fields(final5)) {
        const text = String(raw ?? "");
        for (const artifact of machineOrderArtifacts(text, locale)) {
          failures.push({ id, field, issue: `machine-order:${artifact}`, text });
        }
        inspectedFields += 1;
      }

      if (qlId === "TRG-001-QL-047") {
        degreeMovedToNativeOrder(final4.explanation.steps?.[0]?.body, final5.explanation.steps?.[0]?.body, locale);
        targetedCorrections += 1;
        assert.match(
          String(final5.explanation.steps?.[1]?.body ?? ""),
          locale === "hi-IN" ? /^शून्य से भाग देना अपरिभाषित है,/u : /^ਸਿਫ਼ਰ ਨਾਲ ਭਾਗ ਦੇਣਾ ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ,/u,
          `${id}: QL047 division-by-zero wording not corrected.`,
        );
        targetedCorrections += 1;
      }
      if (qlId === "TRG-001-QL-070") {
        const expected = locale === "hi-IN"
          ? "एक पूरा चक्कर जोड़ने या घटाने पर tan का मान नहीं बदलता।"
          : "ਇੱਕ ਪੂਰਾ ਚੱਕਰ ਜੋੜਣ ਜਾਂ ਘਟਾਉਣ ਤੇ tan ਦਾ ਮਾਨ ਨਹੀਂ ਬਦਲਦਾ।";
        assert.equal(final5.explanation.steps?.[0]?.body, expected, `${id}: QL070 periodicity wording not corrected.`);
        targetedCorrections += 1;
        assert.equal(final5.explanation.shortcut, expected, `${id}: QL070 shortcut periodicity wording not corrected.`);
        targetedCorrections += 1;
      }
      if (qlId === "TRG-001-QL-091") {
        degreeMovedToNativeOrder(final4.explanation.steps?.[2]?.body, final5.explanation.steps?.[2]?.body, locale);
        targetedCorrections += 1;
        assert.equal(
          final5.explanation.steps?.[1]?.body,
          locale === "hi-IN"
            ? "tanθ=sinθ/cosθ से भाग देने पर केवल sinθ बचता है।"
            : "tanθ=sinθ/cosθ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕੇਵਲ sinθ ਬਚਦਾ ਹੈ।",
          `${id}: QL091 tan-division wording not corrected.`,
        );
        targetedCorrections += 1;
      }
      if (qlId === "TRG-001-QL-096") {
        const step2 = String(final5.explanation.steps?.[1]?.body ?? "");
        assert.match(
          step2,
          locale === "hi-IN" ? /इसलिए समतुल्य व्यंजक cos²θ है।$/u : /ਇਸ ਲਈ ਬਰਾਬਰ ਵਿਅੰਜਕ cos²θ ਹੈ।$/u,
          `${id}: QL096 equivalence word order not corrected.`,
        );
        targetedCorrections += 1;
      }
      if (qlId === "TRG-001-QL-043" && locale === "pa-IN") {
        assert.equal(final5.explanation.traps?.[0], "ਘਟਾਉ ਦਾ ਚਿੰਨ੍ਹ ਕਾਇਮ ਰੱਖੋ।", `${id}: Punjabi subtraction wording not corrected.`);
        targetedCorrections += 1;
      }

      const expectsExtendedPolish = extendedBothLocalePolish.has(qlId)
        || (locale === "pa-IN" && extendedPunjabiOnlyPolish.has(qlId));
      if (expectsExtendedPolish) {
        assert.notDeepEqual(final5.explanation, final4.explanation, `${id}: expected extended Final5 native polish was not exercised.`);
        targetedCorrections += 1;
      }

      assert.equal(final5.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL5", `${id}: Final5 review status drift.`);
      assert.equal(final5.localizationProof?.final5NativeWordOrderPolish, true, `${id}: Final5 proof flag missing.`);
      assert.equal(final5.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(final5.frozen, false, `${id}: Final5 cannot auto-freeze.`);
      assert.equal(final5.freezeEligible, false, `${id}: Final5 cannot auto-freeze.`);
      assert.equal(final5.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(final5.activationAuthorized, false, `${id}: activation must remain OFF.`);
      assert.equal(final5.questionStudioDiscoverable, false, `${id}: localized Studio must remain OFF.`);
      assert.equal(final5.questionBankStatus, "NOT_STORED", `${id}: localized Bank must remain locked.`);
      assert.equal(final5.testEligibility, "INELIGIBLE", `${id}: localized Test Builder must remain OFF.`);
      assert.equal(final5.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
      assert.equal(final5.publicReleaseAuthorized, false, `${id}: public release must remain OFF.`);
      assert.match(final5.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: invalid Final5 fingerprint.`);
      assert(!fingerprints.has(final5.localizationProof.localizationFingerprint), `${id}: duplicate Final5 fingerprint.`);
      fingerprints.add(final5.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const inventory = {
  status: failures.length ? "TRG001_FINAL5_DEFECT_INVENTORY" : "TRG001_FINAL5_PASS",
  frozenEnglishQls: 144,
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedFields,
  preservedMathAtoms,
  targetedCorrections,
  failures: failures.length,
  failureSamples: failures.slice(0, 100),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `Final5 has ${failures.length} preservation/editorial failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl);
assert.equal(fingerprints.size, cases);
assert.equal(targetedCorrections, 205, "Expected 205 targeted Final5 correction assertions including the extended result-order polish families.");
