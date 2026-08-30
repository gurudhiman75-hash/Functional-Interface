import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import {
  TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS,
  trg001Final4ExpectedKeyRule,
  trg001TrigDegreeAtoms,
} from "./localization-native-v5-pedagogic-review-final4";
import { generateLocalizedTrg001QuestionNativeReviewFinal5 } from "./localization-native-v5-pedagogic-review-final5";

type Locale = "hi-IN" | "pa-IN";
type Field = [string, unknown];

function optionSemantics(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

function learnerFields(question: any): Field[] {
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

function nativeOrderArtifacts(text: string, locale: Locale) {
  const patterns = locale === "hi-IN"
    ? [
        /^पर\s+\d+°/u,
        /(?:योग|व्युत्क्रम|त्रिभुज|समतुल्य व्यंजक)\s+है\s+(?:[-−]?\d|√|(?:sin|cos|tan|cot|sec|cosec))/iu,
        /व्यंजक बराबर है/u,
        /अनुपात-भाग के बराबर हैं\s+\d+\s+इकाई/u,
      ]
    : [
        /^ਤੇ\s+\d+°/u,
        /(?:ਜੋੜ|ਪਰਸਪਰ|ਤਿਕੋਣ|ਬਰਾਬਰ ਵਿਅੰਜਕ)\s+ਹੈ\s+(?:[-−]?\d|√|(?:sin|cos|tan|cot|sec|cosec))/iu,
        /ਵਿਅੰਜਕ ਬਰਾਬਰ ਹੈ/u,
        /ਅਨੁਪਾਤ-ਭਾਗ ਦੇ ਬਰਾਬਰ ਹਨ\s+\d+\s+ਇਕਾਈ/u,
        /ਸਕੇਲ ਹੈ\s+\d/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

function trigDegreeAuthority(question: any) {
  return new Set(trg001TrigDegreeAtoms(learnerFields(question).map(([, value]) => String(value ?? "")).join("\n")));
}

const expectedCorrectedQls = new Set([
  "TRG-001-QL-013", "TRG-001-QL-014", "TRG-001-QL-032", "TRG-001-QL-041", "TRG-001-QL-042",
  "TRG-001-QL-044", "TRG-001-QL-047", "TRG-001-QL-080", "TRG-001-QL-085", "TRG-001-QL-091",
  "TRG-001-QL-095", "TRG-001-QL-096", "TRG-001-QL-098", "TRG-001-QL-137", "TRG-001-QL-142",
]);

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);
assert.equal(TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS.length, 48);
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);

const failures: Array<{ id: string; field: string; issue: string; text: string }> = [];
const fingerprints = new Set<string>();
const correctedQls = new Set<string>();
const seedsPerQl = 5;
let cases = 0;
let learnerFieldChecks = 0;
let trigDegreeChecks = 0;
let correctedLearnerFields = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-final5-five-seed-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: Final5 generation is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic fingerprint drift.`);
      assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
      assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantic drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
      assert.equal(localized.explanation.steps.length, source.explanation.steps.length, `${id}: pedagogic step-count drift.`);

      const expectedKeyRule = trg001Final4ExpectedKeyRule(qlId, locale);
      if (expectedKeyRule) assert.equal(localized.explanation.keyRule, expectedKeyRule, `${id}: Final4 exact teaching rule changed in Final5.`);

      const authority = trigDegreeAuthority(source);
      for (const [field, raw] of learnerFields(localized)) {
        const text = String(raw ?? "");
        const residual = trg001V3ResidualEnglishTokens(text);
        if (residual.length) failures.push({ id, field, issue: `residual-english:${residual.join(",")}`, text });
        for (const artifact of nativeOrderArtifacts(text, locale)) {
          failures.push({ id, field, issue: `native-order-artifact:${artifact}`, text });
        }
        for (const atom of trg001TrigDegreeAtoms(text)) {
          trigDegreeChecks += 1;
          if (!authority.has(atom)) failures.push({ id, field, issue: `unauthorized-trig-degree-atom:${atom}`, text });
        }
        learnerFieldChecks += 1;
      }

      const corrections = Number(localized.localizationProof?.final5CorrectedLearnerFields ?? 0);
      correctedLearnerFields += corrections;
      if (corrections > 0) correctedQls.add(qlId);

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_FINAL5", `${id}: Final5 review status drift.`);
      assert.equal(localized.localizationProof?.final5NativeOrderPolish, true, `${id}: Final5 proof missing.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: Final5 cannot auto-freeze.`);
      assert.equal(localized.freezeEligible, false, `${id}: Final5 cannot auto-freeze.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Studio must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized Bank must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release must remain OFF.`);
      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: invalid Final5 fingerprint.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate Final5 fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const missingCorrectionQls = [...expectedCorrectedQls].filter((qlId) => !correctedQls.has(qlId));
const unexpectedCorrectionQls = [...correctedQls].filter((qlId) => !expectedCorrectedQls.has(qlId));
const inventory = {
  status: failures.length || missingCorrectionQls.length || unexpectedCorrectionQls.length
    ? "TRG001_FINAL5_NATIVE_ORDER_DEFECT_INVENTORY"
    : "TRG001_FINAL5_NATIVE_ORDER_PASS",
  frozenEnglishQls: 144,
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  learnerFieldChecks,
  trigDegreeChecks,
  correctedLearnerFields,
  correctedQls: [...correctedQls].sort(),
  expectedCorrectedQls: [...expectedCorrectedQls].sort(),
  missingCorrectionQls,
  unexpectedCorrectionQls,
  failures: failures.length,
  failureSamples: failures.slice(0, 100),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `Final5 has ${failures.length} learner-field failures.`);
assert.deepEqual(missingCorrectionQls, [], `Final5 did not exercise expected corrections: ${missingCorrectionQls.join(", ")}`);
assert.deepEqual(unexpectedCorrectionQls, [], `Final5 unexpectedly changed additional QLs: ${unexpectedCorrectionQls.join(", ")}`);
assert.equal(cases, 144 * 2 * seedsPerQl);
assert.equal(fingerprints.size, cases);
assert(correctedLearnerFields > 0, "Final5 did not exercise any native-order correction.");
