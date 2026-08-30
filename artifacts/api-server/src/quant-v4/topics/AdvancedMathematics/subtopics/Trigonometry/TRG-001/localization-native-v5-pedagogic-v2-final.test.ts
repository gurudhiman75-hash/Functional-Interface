import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { generateLocalizedTrg001QuestionNativeV5PedagogicV2 } from "./localization-native-v5-pedagogic-v2";
import { generateLocalizedTrg001QuestionNativeV5PedagogicV2Final } from "./localization-native-v5-pedagogic-v2-final";

function formulaAtoms(value: unknown) {
  return Array.from(new Set(String(value ?? "").match(
    /(?:sin|cos|tan|cot|sec|cosec)[A-Za-z0-9αβγθπ²°()+\-/*√=]*|\d+(?:\/\d+)?(?:°)?|π|√\d+/giu,
  ) ?? []));
}

function explanationFields(question: any) {
  return [
    ["keyRule", question.explanation?.keyRule],
    ...question.explanation.steps.flatMap((step: any, index: number) => [
      [`step-${index + 1}-title`, step.title],
      [`step-${index + 1}-body`, step.body],
    ]),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap]),
  ] as Array<[string, unknown]>;
}

function alignedExplanationFields(question: any) {
  return new Map<string, string>(explanationFields(question).map(([field, value]) => [field, String(value ?? "")]));
}

function editorialArtifacts(text: string, locale: "hi-IN" | "pa-IN") {
  const patterns = locale === "hi-IN"
    ? [
        /घटाकर सरल करकेण/u,
        /\bsin-cos\b/iu,
        /हटा देता है/u,
        /^उलटें .+ एक बार/u,
        /(?:है|स्थित है) में (?:द्वितीय|तृतीय|चतुर्थ)/u,
        /कट जाता है में/u,
        /प्रश्न पूछता है के लिए/u,
        /^वर्ग (?:मानक|सटीक|दोनों|पूरे|दिए?|tanθ)/u,
        /व्युत्क्रम, नहीं बराबर/u,
        /बाद सटीक सरलीकरण/u,
        /न लिखें अनंत के रूप में/u,
        /^A\s/u,
        /\ba\s+270°/iu,
        /न्यूनकोण कोण/u,
        /दूसरे चतुर्थांश में[^।]*(?:180°\+|210°|240°)/u,
      ]
    : [
        /\bsin-cos\b/iu,
        /ਹਟਾ ਦਿੰਦਾ ਹੈ/u,
        /^ਉਲਟੋ .+ ਇੱਕ ਵਾਰ/u,
        /(?:ਹੈ|ਸਥਿਤ ਹੈ) ਵਿੱਚ (?:ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ)/u,
        /ਕੱਟ ਜਾਂਦਾ ਹੈ ਵਿੱਚ/u,
        /ਪ੍ਰਸ਼ਨ ਪੁੱਛਦਾ ਹੈ ਲਈ/u,
        /^ਵਰਗ (?:ਮਿਆਰੀ|ਸਹੀ|ਦੋਵੇਂ|ਪੂਰੇ|ਦਿੱਤਾ|tanθ)/u,
        /ਪਰਸਪਰ, ਨਹੀਂ ਬਰਾਬਰ/u,
        /ਬਾਅਦ ਸਹੀ ਸਰਲੀਕਰਨ/u,
        /ਨਾ ਲਿਖੋ ਅਨੰਤ ਦੇ ਰੂਪ ਵਿੱਚ/u,
        /^A\s/u,
        /\ba\s+270°/iu,
        /ਨਿਊਨ ਕੋਣ ਕੋਣ/u,
        /ਦੂਜੇ ਚਤੁਰਭਾਗ ਵਿੱਚ[^।]*(?:180°\+|210°|240°)/u,
      ];
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

const QUADRANTS = [
  {
    english: /\bquadrant\s+II\b/iu,
    hi: /(?:द्वितीय|दूसरे)\s+चतुर्थांश/u,
    pa: /(?:ਦੂਜਾ|ਦੂਜੇ)\s+ਚਤੁਰਭਾਗ/u,
    label: "II",
  },
  {
    english: /\bquadrant\s+III\b/iu,
    hi: /(?:तृतीय|तीसरे)\s+चतुर्थांश/u,
    pa: /(?:ਤੀਜਾ|ਤੀਜੇ)\s+ਚਤੁਰਭਾਗ/u,
    label: "III",
  },
  {
    english: /\bquadrant\s+IV\b/iu,
    hi: /(?:चतुर्थ|चौथे)\s+चतुर्थांश/u,
    pa: /(?:ਚੌਥਾ|ਚੌਥੇ)\s+ਚਤੁਰਭਾਗ/u,
    label: "IV",
  },
] as const;

const TRIG_SIGN_ENGLISH = /\b(?:sin(?:e)?|cos(?:ine)?|tan(?:gent)?|cot(?:angent)?|sec(?:ant)?|cosec(?:ant)?)\b[^.;]{0,55}\b(positive|negative)\b|\b(positive|negative)\b[^.;]{0,55}\b(?:sin(?:e)?|cos(?:ine)?|tan(?:gent)?|cot(?:angent)?|sec(?:ant)?|cosec(?:ant)?)\b/iu;

function proseFidelityFailures(sourceText: string, localizedText: string, locale: "hi-IN" | "pa-IN") {
  const issues: string[] = [];
  for (const quadrant of QUADRANTS) {
    if (!quadrant.english.test(sourceText)) continue;
    const expected = locale === "hi-IN" ? quadrant.hi : quadrant.pa;
    if (!expected.test(localizedText)) issues.push(`quadrant-${quadrant.label}`);
  }

  const signMatch = sourceText.match(TRIG_SIGN_ENGLISH);
  const sign = signMatch?.[1] ?? signMatch?.[2];
  if (sign) {
    const expected = sign.toLowerCase() === "positive"
      ? (locale === "hi-IN" ? /धनात्मक/u : /ਧਨਾਤਮਕ/u)
      : (locale === "hi-IN" ? /ऋणात्मक/u : /ਰਿਣਾਤਮਕ/u);
    if (!expected.test(localizedText)) issues.push(`trig-sign-${sign.toLowerCase()}`);
  }
  return issues;
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144, "Final pedagogic V2 requires all 144 QLs.");
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);

const failures: Array<{ id: string; field: string; issue: string; text: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 3;
let cases = 0;
let inspectedFields = 0;
let preservedAtoms = 0;
let fidelityChecks = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-pedagogic-v2-final-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const base = generateLocalizedTrg001QuestionNativeV5PedagogicV2(qlId, seed, locale) as any;
      const localized = generateLocalizedTrg001QuestionNativeV5PedagogicV2Final(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeV5PedagogicV2Final(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: final pedagogic localization is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic fingerprint drift.`);
      assert.equal(localized.stem, base.stem, `${id}: final editorial layer changed the stem.`);
      assert.deepEqual(localized.options, base.options, `${id}: final editorial layer changed options.`);
      assert.equal(localized.answer, base.answer, `${id}: canonical answer changed.`);
      assert.equal(localized.correctIndex, base.correctIndex, `${id}: correct index changed.`);
      assert.deepEqual(localized.canonicalState, base.canonicalState, `${id}: canonical state changed.`);
      assert.deepEqual(localized.verification, base.verification, `${id}: verification changed.`);
      assert.equal(localized.explanation.steps.length, base.explanation.steps.length, `${id}: explanation step count changed.`);

      for (let stepIndex = 0; stepIndex < base.explanation.steps.length; stepIndex += 1) {
        const before = base.explanation.steps[stepIndex].body;
        const after = localized.explanation.steps[stepIndex].body;
        for (const atom of formulaAtoms(before)) {
          if (!String(after).includes(atom)) failures.push({ id, field: `step-${stepIndex + 1}-body`, issue: `missing-math-atom:${atom}`, text: String(after) });
          else preservedAtoms += 1;
        }
      }

      const sourceFields = alignedExplanationFields(source);
      const localizedFields = alignedExplanationFields(localized);
      for (const [field, sourceText] of sourceFields) {
        const localizedText = localizedFields.get(field);
        if (localizedText === undefined) continue;
        const fidelityIssues = proseFidelityFailures(sourceText, localizedText, locale);
        for (const issue of fidelityIssues) failures.push({ id, field, issue: `prose-fidelity:${issue}`, text: localizedText });
        if (QUADRANTS.some((quadrant) => quadrant.english.test(sourceText)) || TRIG_SIGN_ENGLISH.test(sourceText)) fidelityChecks += 1;
      }

      for (const [field, raw] of explanationFields(localized)) {
        const text = String(raw ?? "");
        const english = trg001V3ResidualEnglishTokens(text);
        if (english.length) failures.push({ id, field, issue: `residual-english:${english.join(",")}`, text });
        for (const artifact of editorialArtifacts(text, locale)) failures.push({ id, field, issue: `editorial-artifact:${artifact}`, text });
        inspectedFields += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V2_FINAL", `${id}: review status drift.`);
      assert.equal(localized.localizationProof?.v5PedagogicV2Final, true, `${id}: final proof marker missing.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: localized surface cannot be frozen automatically.`);
      assert.equal(localized.freezeEligible, false, `${id}: localized surface cannot be freeze eligible automatically.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain off.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Question Studio must remain off.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized bank must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder must remain off.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: public publication must remain off.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release must remain off.`);
      assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: final fingerprint invalid.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate final fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const inventory = {
  status: failures.length ? "TRG001_PEDAGOGIC_V2_FINAL_DEFECT_INVENTORY" : "TRG001_PEDAGOGIC_V2_FINAL_PASS",
  frozenEnglishQls: 144,
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedExplanationFields: inspectedFields,
  preservedMathAtoms: preservedAtoms,
  proseFidelityChecks: fidelityChecks,
  failures: failures.length,
  failureSamples: failures.slice(0, 100),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `Final pedagogic V2 has ${failures.length} failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl, `Expected 864 final pedagogic cases, got ${cases}.`);
assert.equal(fingerprints.size, cases, "Expected one unique final fingerprint per case.");
