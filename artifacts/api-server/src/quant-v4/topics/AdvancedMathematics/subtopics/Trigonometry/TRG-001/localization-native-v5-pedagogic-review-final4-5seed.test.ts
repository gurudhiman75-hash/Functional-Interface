import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import {
  TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS,
  generateLocalizedTrg001QuestionNativeReviewFinal4,
  trg001Final4ExpectedKeyRule,
  trg001TrigDegreeAtoms,
} from "./localization-native-v5-pedagogic-review-final4";

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

function trigDegreeAuthority(question: any) {
  return new Set(trg001TrigDegreeAtoms(learnerFields(question).map(([, value]) => String(value ?? "")).join("\n")));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);
assert.equal(TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS.length, 48, "Final4 exact-rule override count drifted.");
assert.equal(new Set(TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS).size, 48, "Final4 exact-rule override IDs contain duplicates.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
);

const failures: Array<{ id: string; field: string; issue: string; sourceAtoms?: string[]; localized: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 5;
let cases = 0;
let inspectedFields = 0;
let trigDegreeChecks = 0;
let correctedTrigDegreeAtoms = 0;
let ql124Checks = 0;
let ql124CorrectionExercises = 0;
let exactKeyRuleChecks = 0;
let ql121PedagogicChecks = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-final4-five-seed-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativeReviewFinal4(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeReviewFinal4(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: Final4 generation is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic fingerprint drift.`);
      assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
      assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantic drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
      assert.equal(localized.explanation.steps.length, source.explanation.steps.length, `${id}: step-count drift.`);

      const expectedKeyRule = trg001Final4ExpectedKeyRule(qlId, locale);
      if (expectedKeyRule) {
        assert.equal(localized.explanation.keyRule, expectedKeyRule, `${id}: exact native teaching-rule fidelity drift.`);
        assert.equal(localized.localizationProof?.final4ExactKeyRuleFidelity, true, `${id}: exact-rule proof flag missing.`);
        exactKeyRuleChecks += 1;
      } else {
        assert.equal(localized.localizationProof?.final4ExactKeyRuleFidelity, false, `${id}: unexpected exact-rule proof flag.`);
      }

      const authority = trigDegreeAuthority(source);
      for (const [field, raw] of learnerFields(localized)) {
        const text = String(raw ?? "");
        for (const atom of trg001TrigDegreeAtoms(text)) {
          trigDegreeChecks += 1;
          if (!authority.has(atom)) {
            failures.push({
              id,
              field,
              issue: `unauthorized-trig-degree-atom:${atom}`,
              sourceAtoms: [...authority].sort(),
              localized: text,
            });
          }
        }
        inspectedFields += 1;
      }

      if (qlId === "TRG-001-QL-121") {
        const step2 = String(localized.explanation.steps?.[1]?.body ?? "");
        assert.doesNotMatch(step2, /व्युत्क्रम गुणनफल|ਪਰਸਪਰ ਗੁਣਨਫਲ/u, `${id}: QL121 still claims a reciprocal product.`);
        assert.match(
          step2,
          locale === "hi-IN" ? /गुणनफल वाले पद/u : /ਗੁਣਨਫਲ ਵਾਲੇ ਪਦ/u,
          `${id}: QL121 product-specific pedagogic correction missing.`,
        );
        assert.equal(localized.localizationProof?.final4Ql121PedagogicCorrection, true, `${id}: QL121 correction proof flag missing.`);
        ql121PedagogicChecks += 1;
      } else {
        assert.equal(localized.localizationProof?.final4Ql121PedagogicCorrection, false, `${id}: unexpected QL121 correction proof flag.`);
      }

      if (qlId === "TRG-001-QL-124") {
        const sourceMatch = String(source.stem).match(/tan\s*(\d+)°\+cot\s*\1°/u);
        assert(sourceMatch, `${id}: QL124 source no longer has a same-angle tan/cot stem.`);
        const angle = sourceMatch[1];
        const escapedAngle = escapeRegExp(angle);
        const explanation = learnerFields(localized)
          .filter(([field]) => field !== "stem" && !field.startsWith("option-") && field !== "answer")
          .map(([, value]) => String(value ?? ""))
          .join("\n");
        assert.match(explanation, new RegExp(`tan\\s*${escapedAngle}°`, "u"), `${id}: QL124 localized working lost canonical tan${angle}°.`);
        assert.match(explanation, new RegExp(`cot\\s*${escapedAngle}°`, "u"), `${id}: QL124 localized working lost canonical cot${angle}°.`);
        const mismatched = trg001TrigDegreeAtoms(explanation).filter((atom) =>
          /^(?:tan|cot)\d+°$/u.test(atom) && atom !== `tan${angle}°` && atom !== `cot${angle}°`);
        assert.deepEqual(mismatched, [], `${id}: QL124 localized working introduced a non-canonical tan/cot angle.`);
        if (Number(localized.localizationProof?.final4CorrectedTrigDegreeAtoms ?? 0) > 0) ql124CorrectionExercises += 1;
        ql124Checks += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL4", `${id}: Final4 review status drift.`);
      assert.equal(localized.localizationProof?.final4CanonicalTrigAngleGuard, true, `${id}: Final4 provenance proof missing.`);
      correctedTrigDegreeAtoms += Number(localized.localizationProof?.final4CorrectedTrigDegreeAtoms ?? 0);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: localized surface cannot auto-freeze.`);
      assert.equal(localized.freezeEligible, false, `${id}: localized surface cannot auto-freeze.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain OFF.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Studio must remain OFF.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized Bank must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder must remain OFF.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain OFF.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release must remain OFF.`);
      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: invalid Final4 fingerprint.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate Final4 fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const inventory = {
  status: failures.length ? "TRG001_FINAL4_FIDELITY_DEFECT_INVENTORY" : "TRG001_FINAL4_FIDELITY_PASS",
  frozenEnglishQls: 144,
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedFields,
  trigDegreeChecks,
  correctedTrigDegreeAtoms,
  exactKeyRuleOverrideQls: TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS.length,
  exactKeyRuleChecks,
  ql121PedagogicChecks,
  ql124Checks,
  ql124CorrectionExercises,
  failures: failures.length,
  failureSamples: failures.slice(0, 100),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `Final4 fidelity guard has ${failures.length} trig-degree failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl);
assert.equal(fingerprints.size, cases);
assert.equal(exactKeyRuleChecks, TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS.length * 2 * seedsPerQl, "Exact key-rule fidelity coverage drifted.");
assert.equal(ql121PedagogicChecks, 10, "Expected QL121 pedagogic correction coverage for 2 locales x 5 seeds.");
assert.equal(ql124Checks, 10, "Expected QL124 regression coverage for 2 locales x 5 seeds.");
assert(ql124CorrectionExercises > 0, "Final4 guard did not exercise the known QL124 correction path in this five-seed matrix.");
