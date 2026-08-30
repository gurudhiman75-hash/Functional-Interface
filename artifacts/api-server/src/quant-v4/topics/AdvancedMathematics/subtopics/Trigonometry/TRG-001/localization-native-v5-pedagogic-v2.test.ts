import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { generateLocalizedTrg001QuestionNativeV5Pedagogic } from "./localization-native-v5-pedagogic";
import { generateLocalizedTrg001QuestionNativeV5PedagogicV2 } from "./localization-native-v5-pedagogic-v2";

function formulaAtoms(value: unknown) {
  return Array.from(new Set(String(value ?? "").match(
    /(?:sin|cos|tan|cot|sec|cosec)[A-Za-z0-9αβγθπ²°()+\-/*√=]*|\d+(?:\/\d+)?(?:°)?|π|√\d+/giu,
  ) ?? []));
}

function fields(question: any) {
  return [
    ...question.explanation.steps.flatMap((step: any, index: number) => [
      [`step-${index + 1}-title`, step.title],
      [`step-${index + 1}-body`, step.body],
    ]),
    ["shortcut", question.explanation.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap]),
  ] as Array<[string, unknown]>;
}

function machineArtifacts(text: string, locale: "hi-IN" | "pa-IN") {
  const hi = [
    /सेकेंट है व्युत्क्रम/u, /कोटैन्जेंट है व्युत्क्रम/u, /कोसेकेंट है व्युत्क्रम/u,
    /प्रयोग करता है/u, /कर्ण नहीं है योग/u, /स्केल टैन्जेंट त्रिभुज/u,
    /न मानें एक योग के रूप में एक गुणनफल/u, /ये हैं बराबर पूरक/u,
    /पर अक्ष कोण/u, /इसलिए यह केवल/u, /शून्य-हर व्यंजक/u,
    /घटाकर सरल करकेण/u, /\ba 270°\b/iu, /180,,/u,
    /कोई नहीं वर्ग/u, /पूछता है के लिए/u, /लक्ष्य है .* नहीं/u,
    /अतः आवश्यक संयुग्मी है/u, /बिना जानने के बिना/u,
    /है न्यूनकोण/u, /हटा देता है/u, /दोनों हर नहीं हैं बराबर/u,
    /साइन योग सर्वसमिका प्रयोग करता है/u, /कोसाइन का एक अंतर प्रयोग करता है/u,
    /दोनों व्यंजक हैं बराबर/u, /वर्ग का और व्युत्क्रम/u,
    /बदलिए दोनों भुजाएँ/u, /अतः व्यंजक है/u,
    /बदलिए दोनों अंश और हर/u,
  ];
  const pa = [
    /ਸੀਕੈਂਟ ਹੈ ਪਰਸਪਰ/u, /ਕੋਟੈਂਜੈਂਟ ਹੈ ਪਰਸਪਰ/u, /ਕੋਸੀਕੈਂਟ ਹੈ ਪਰਸਪਰ/u,
    /ਵਰਤਦਾ ਹੈ/u, /ਕਰਣ ਨਹੀਂ ਹੈ ਜੋੜ/u, /ਸਕੇਲ ਟੈਂਜੈਂਟ ਤਿਕੋਣ/u,
    /ਨਾ ਮੰਨੋ ਇੱਕ ਜੋੜ ਦੇ ਰੂਪ ਵਿੱਚ ਇੱਕ ਗੁਣਨਫਲ/u, /ਇਹ ਹਨ ਬਰਾਬਰ ਪੂਰਕ/u,
    /ਤੇ ਅਕਸ ਕੋਣ/u, /ਇਸ ਲਈ ਇਹ ਕੇਵਲ/u, /ਸਿਫ਼ਰ-ਹਰ ਵਿਅੰਜਕ/u,
    /\ba 270°\b/iu, /180,,/u,
    /ਕੋਈ ਨਹੀਂ ਵਰਗ/u, /ਪੁੱਛਦਾ ਹੈ ਲਈ/u, /ਲਕਸ਼ ਹੈ .* ਨਹੀਂ/u,
    /ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸੰਯੁਗਮੀ ਹੈ/u, /ਬਿਨਾਂ ਜਾਣੇ ਬਿਨਾਂ/u,
    /ਹੈ ਨਿਊਨ ਕੋਣ/u, /ਹਟਾ ਦਿੰਦਾ ਹੈ/u, /ਦੋਵੇਂ ਹਰ ਨਹੀਂ ਹਨ ਬਰਾਬਰ/u,
    /ਸਾਈਨ ਜੋੜ ਸਰਬਸਮਿਕਾ ਵਰਤਦਾ ਹੈ/u, /ਕੋਸਾਈਨ ਦਾ ਇੱਕ ਅੰਤਰ ਵਰਤਦਾ ਹੈ/u,
    /ਦੋਵੇਂ ਵਿਅੰਜਕ ਹਨ ਬਰਾਬਰ/u, /ਵਰਗ ਦਾ ਅਤੇ ਪਰਸਪਰ/u,
    /ਬਦਲੋ ਦੋਵੇਂ ਭੁਜਾਵਾਂ/u, /ਇਸ ਲਈ ਵਿਅੰਜਕ ਹੈ/u,
    /ਦੋਵੇਂ ਅੰਸ਼ ਅਤੇ ਹਰ ਦੀ ਥਾਂ/u,
  ];
  return (locale === "hi-IN" ? hi : pa).filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

assert.equal(TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611");
assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);

const failures: any[] = [];
const seedsPerQl = 3;
let cases = 0;
let preservedAtoms = 0;
const fingerprints = new Set<string>();

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let i = 1; i <= seedsPerQl; i += 1) {
      const seed = `trg001-ped-v2-${i}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const before = generateLocalizedTrg001QuestionNativeV5Pedagogic(qlId, seed, locale) as any;
      const q = generateLocalizedTrg001QuestionNativeV5PedagogicV2(qlId, seed, locale) as any;
      const again = generateLocalizedTrg001QuestionNativeV5PedagogicV2(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${i}`;

      assert.deepEqual(q, again, `${id}: non-deterministic`);
      assert.equal(trg001CanonicalSemanticFingerprint(q), trg001CanonicalSemanticFingerprint(source), `${id}: semantic drift`);
      assert.equal(q.explanation.steps.length, before.explanation.steps.length, `${id}: step count drift`);
      assert.equal(q.explanation.keyRule, before.explanation.keyRule, `${id}: native rule drift`);

      for (let s = 0; s < before.explanation.steps.length; s += 1) {
        for (const atom of formulaAtoms(before.explanation.steps[s].body)) {
          if (!String(q.explanation.steps[s].body).includes(atom)) failures.push({ id, field: `step-${s+1}`, issue: `missing:${atom}` });
          else preservedAtoms += 1;
        }
      }
      for (const [field, raw] of fields(q)) {
        const text = String(raw ?? "");
        const eng = trg001V3ResidualEnglishTokens(text);
        if (eng.length) failures.push({ id, field, issue: `english:${eng.join(',')}`, text });
        for (const artifact of machineArtifacts(text, locale)) failures.push({ id, field, issue: `artifact:${artifact}`, text });
      }

      assert.equal(q.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V2", `${id}: status drift`);
      assert.equal(q.localizationProof?.v5PedagogicOverlayV2, true, `${id}: proof missing`);
      assert.equal(q.localizationProof?.pedagogicNormalizerVersion, "V2_BROAD_NATIVE_WORD_ORDER_REMEDIATION", `${id}: normalizer drift`);
      assert.equal(q.humanReviewStatus, "PENDING");
      assert.equal(q.frozen, false);
      assert.equal(q.freezeStatus, "NOT_FROZEN");
      assert.equal(q.activationAuthorized, false);
      assert.equal(q.questionStudioDiscoverable, false);
      assert.equal(q.questionBankStatus, "NOT_STORED");
      assert.equal(q.testEligibility, "INELIGIBLE");
      assert.equal(q.publiclyPublishable, false);
      assert.equal(q.publicReleaseAuthorized, false);
      assert.equal(q.localizationLifecycle?.multilingualFreezeGranted, false);
      assert.equal(q.localizationLifecycle?.activationAuthorized, false);
      assert.equal(q.localizationLifecycle?.questionStudioEnabled, false);
      assert.equal(q.localizationLifecycle?.questionBankWritable, false);
      assert.equal(q.localizationLifecycle?.testBuilderEligible, false);
      assert.equal(q.localizationLifecycle?.productDeliveryUnlocked, false);
      assert.match(q.localizationProof.localizationFingerprint, /^[0-9a-f]{64}$/u);
      assert(!fingerprints.has(q.localizationProof.localizationFingerprint), `${id}: duplicate fingerprint`);
      fingerprints.add(q.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

console.log(JSON.stringify({
  status: failures.length ? "TRG001_PEDAGOGIC_V2_DEFECT_INVENTORY" : "TRG001_PEDAGOGIC_V2_PASS",
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  preservedAtoms,
  failures: failures.length,
  failureSamples: failures.slice(0, 100),
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
}, null, 2));

assert.equal(failures.length, 0, `Pedagogic V2 has ${failures.length} failures`);
assert.equal(cases, 144 * 2 * seedsPerQl);
assert.equal(fingerprints.size, cases);
