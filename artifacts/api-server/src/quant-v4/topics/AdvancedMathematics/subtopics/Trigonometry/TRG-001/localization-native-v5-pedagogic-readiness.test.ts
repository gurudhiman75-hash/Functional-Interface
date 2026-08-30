import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { generateLocalizedTrg001QuestionNativePedagogicV3 } from "./localization-native-v5-pedagogic-v3";

type Locale = "hi-IN" | "pa-IN";
type Field = [string, unknown];

/**
 * Preserve mathematical notation, not English terminology.
 *
 * The previous readiness gate accidentally treated English words such as
 * "sine", "secant", "tangent" and even the "sin" prefix in "choosing" as
 * immutable mathematical atoms. That contradicts localization. Canonical
 * semantic parity already protects the mathematical payload; this helper only
 * checks language-neutral notation that should visibly survive in an aligned
 * pedagogic field.
 */
function notationAtoms(value: unknown) {
  const text = String(value ?? "");
  const trig = text.match(/(?:sin|cos|tan|cot|sec|cosec)(?![A-Za-z])/giu) ?? [];
  const numbers = text.match(/\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?°?/gu) ?? [];
  const symbols = text.match(/[πθ]|√\d+/gu) ?? [];
  return Array.from(new Set([...trig, ...numbers, ...symbols].map((atom) => atom.toLowerCase())));
}

function normalizedNotationText(value: unknown) {
  return String(value ?? "").replace(/\s+/gu, "").toLowerCase();
}

function alignedPedagogicFields(question: any): Field[] {
  return [
    ...question.explanation.steps.map((step: any, index: number) => [`step-${index + 1}-body`, step.body] as Field),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap] as Field),
  ];
}

function allLearnerFields(question: any): Field[] {
  return [
    ["stem", question.stem],
    ...question.options.map((option: any, index: number) => [`option-${index + 1}`, option.display] as Field),
    ["answer", question.localizedAnswerDisplay],
    ["keyRule", question.explanation?.keyRule],
    ...question.explanation.steps.flatMap((step: any, index: number) => [
      [`step-${index + 1}-title`, step.title] as Field,
      [`step-${index + 1}-body`, step.body] as Field,
    ]),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap] as Field),
  ];
}

const QUADRANTS = [
  {
    label: "II",
    english: /\bquadrant\s+II\b/iu,
    hi: /(?:द्वितीय|दूसरे)\s+चतुर्थांश/u,
    pa: /(?:ਦੂਜਾ|ਦੂਜੇ)\s+ਚਤੁਰਭਾਗ/u,
  },
  {
    label: "III",
    english: /\bquadrant\s+III\b/iu,
    hi: /(?:तृतीय|तीसरे)\s+चतुर्थांश/u,
    pa: /(?:ਤੀਜਾ|ਤੀਜੇ)\s+ਚਤੁਰਭਾਗ/u,
  },
  {
    label: "IV",
    english: /\bquadrant\s+IV\b/iu,
    hi: /(?:चतुर्थ|चौथे)\s+चतुर्थांश/u,
    pa: /(?:ਚੌਥਾ|ਚੌਥੇ)\s+ਚਤੁਰਭਾਗ/u,
  },
] as const;

const ANY_HI_QUADRANT = /(?:द्वितीय|दूसरे|तृतीय|तीसरे|चतुर्थ|चौथे)\s+चतुर्थांश/u;
const ANY_PA_QUADRANT = /(?:ਦੂਜਾ|ਦੂਜੇ|ਤੀਜਾ|ਤੀਜੇ|ਚੌਥਾ|ਚੌਥੇ)\s+ਚਤੁਰਭਾਗ/u;
const TRIG = "(?:sin(?:e)?|cos(?:ine)?|tan(?:gent)?|cot(?:angent)?|sec(?:ant)?|cosec(?:ant)?)";
const SIGN_SOURCE = new RegExp(`\\b${TRIG}\\b[^.;]{0,55}\\b(positive|negative)\\b|\\b(positive|negative)\\b[^.;]{0,55}\\b${TRIG}\\b`, "iu");

function expectedSignPresent(localized: string, locale: Locale, sign: string) {
  if (sign === "negative") {
    if (locale === "hi-IN" && /ऋणात्मक/u.test(localized)) return true;
    if (locale === "pa-IN" && /ਰਿਣਾਤਮਕ/u.test(localized)) return true;
    return /[-−]\s*(?:sin|cos|tan|cot|sec|cosec)/iu.test(localized);
  }
  if (locale === "hi-IN" && /धनात्मक/u.test(localized)) return true;
  if (locale === "pa-IN" && /ਧਨਾਤਮਕ/u.test(localized)) return true;
  return /\+\s*(?:sin|cos|tan|cot|sec|cosec)/iu.test(localized);
}

function editorialArtifacts(text: string, locale: Locale) {
  const common = [
    /^A\s/u,
    /\ba\s+270°/iu,
    /\bsin-cos\b/iu,
  ];
  const native = locale === "hi-IN"
    ? [
        /घटाकर सरल करकेण/u,
        /हटा देता है/u,
        /^उलटें .+ एक बार/u,
        /(?:है|स्थित है) में (?:द्वितीय|तृतीय|चतुर्थ)/u,
        /कट जाता है में/u,
        /प्रश्न पूछता है के लिए/u,
        /^वर्ग (?:मानक|सटीक|दोनों|पूरे|दिए?|tanθ)/u,
        /व्युत्क्रम, नहीं बराबर/u,
        /बाद सटीक सरलीकरण/u,
        /न लिखें अनंत के रूप में/u,
        /न्यूनकोण कोण/u,
        /प्रयोग करता है/u,
        /लेने पर व्युत्क्रम देता है/u,
        /वर्ग केवल पद/u,
        /(?:रखें|लागू करें|घटाएँ|बदलिए|मिलाएँ|सरल करें)\s+[^।]{0,80}\s+(?:में|के लिए|को)\s+[^।]+$/u,
      ]
    : [
        /ਹਟਾ ਦਿੰਦਾ ਹੈ/u,
        /^ਉਲਟੋ .+ ਇੱਕ ਵਾਰ/u,
        /(?:ਹੈ|ਸਥਿਤ ਹੈ) ਵਿੱਚ (?:ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ)/u,
        /ਕੱਟ ਜਾਂਦਾ ਹੈ ਵਿੱਚ/u,
        /ਪ੍ਰਸ਼ਨ ਪੁੱਛਦਾ ਹੈ ਲਈ/u,
        /^ਵਰਗ (?:ਮਿਆਰੀ|ਸਹੀ|ਦੋਵੇਂ|ਪੂਰੇ|ਦਿੱਤਾ|tanθ)/u,
        /ਪਰਸਪਰ, ਨਹੀਂ ਬਰਾਬਰ/u,
        /ਬਾਅਦ ਸਹੀ ਸਰਲੀਕਰਨ/u,
        /ਨਾ ਲਿਖੋ ਅਨੰਤ ਦੇ ਰੂਪ ਵਿੱਚ/u,
        /ਨਿਊਨ ਕੋਣ ਕੋਣ/u,
        /ਵਰਤਦਾ ਹੈ/u,
        /ਲੈਣ ਤੇ ਪਰਸਪਰ ਦਿੰਦਾ ਹੈ/u,
        /ਵਰਗ ਕੇਵਲ ਪਦ/u,
        /(?:ਰੱਖੋ|ਲਾਗੂ ਕਰੋ|ਘਟਾਓ|ਬਦਲੋ|ਮਿਲਾਓ|ਸਰਲ ਕਰੋ)\s+[^।]{0,80}\s+(?:ਵਿੱਚ|ਲਈ|ਨੂੰ)\s+[^।]+$/u,
      ];
  return [...common, ...native].filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  "Frozen English authority fingerprint drifted.",
);

const failures: Array<{ id: string; field: string; issue: string; source?: string; localized: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 3;
let cases = 0;
let learnerFields = 0;
let pedagogicFidelityChecks = 0;
let notationAtomsPreserved = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-readiness-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativePedagogicV3(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativePedagogicV3(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: generation is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: canonical semantic drift.`);
      assert.equal(localized.qlId, source.qlId, `${id}: ql drift.`);
      assert.equal(localized.cpId, source.cpId, `${id}: cp drift.`);
      assert.equal(localized.seed, source.seed, `${id}: seed drift.`);
      assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct index drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
      assert.equal(localized.explanation.steps.length, source.explanation.steps.length, `${id}: pedagogic step-count drift.`);

      const sourceAligned = new Map(alignedPedagogicFields(source).map(([field, value]) => [field, String(value ?? "")]));
      const localizedAligned = new Map(alignedPedagogicFields(localized).map(([field, value]) => [field, String(value ?? "")]));

      for (const [field, sourceText] of sourceAligned) {
        const localizedText = localizedAligned.get(field) ?? "";
        const normalizedLocalized = normalizedNotationText(localizedText);
        for (const atom of notationAtoms(sourceText)) {
          const normalizedAtom = atom.replace(/\s+/gu, "");
          if (!normalizedLocalized.includes(normalizedAtom)) {
            failures.push({ id, field, issue: `missing-notation-atom:${atom}`, source: sourceText, localized: localizedText });
          } else {
            notationAtomsPreserved += 1;
          }
        }

        for (const quadrant of QUADRANTS) {
          if (!quadrant.english.test(sourceText)) continue;
          const expected = locale === "hi-IN" ? quadrant.hi : quadrant.pa;
          if (!expected.test(localizedText)) {
            failures.push({ id, field, issue: `quadrant-fidelity:${quadrant.label}`, source: sourceText, localized: localizedText });
          }
          pedagogicFidelityChecks += 1;
        }

        const signMatch = sourceText.match(SIGN_SOURCE);
        const sign = (signMatch?.[1] ?? signMatch?.[2])?.toLowerCase();
        if (sign) {
          if (!expectedSignPresent(localizedText, locale, sign)) {
            failures.push({ id, field, issue: `trig-sign-fidelity:${sign}`, source: sourceText, localized: localizedText });
          }
          pedagogicFidelityChecks += 1;
        }
      }

      const sourceKeyRule = String(source.explanation?.keyRule ?? "");
      const localizedKeyRule = String(localized.explanation?.keyRule ?? "");
      const anyLocalizedQuadrant = locale === "hi-IN" ? ANY_HI_QUADRANT : ANY_PA_QUADRANT;
      if (anyLocalizedQuadrant.test(localizedKeyRule)) {
        const sourceQuadrant = QUADRANTS.find((quadrant) => quadrant.english.test(sourceKeyRule));
        if (sourceQuadrant) {
          const expected = locale === "hi-IN" ? sourceQuadrant.hi : sourceQuadrant.pa;
          if (!expected.test(localizedKeyRule)) {
            failures.push({
              id,
              field: "keyRule",
              issue: `key-rule-quadrant-contradiction:${sourceQuadrant.label}`,
              source: sourceKeyRule,
              localized: localizedKeyRule,
            });
          }
        }
      }

      for (const [field, raw] of allLearnerFields(localized)) {
        const text = String(raw ?? "");
        const residual = trg001V3ResidualEnglishTokens(text);
        if (residual.length) failures.push({ id, field, issue: `residual-english:${residual.join(",")}`, localized: text });
        for (const artifact of editorialArtifacts(text, locale)) {
          failures.push({ id, field, issue: `editorial-artifact:${artifact}`, localized: text });
        }
        learnerFields += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V3", `${id}: review status drift.`);
      assert.equal(localized.localizationProof?.v5PedagogicV3Overlay, true, `${id}: V3 editorial overlay proof missing.`);
      assert.equal(localized.humanReviewStatus, "PENDING", `${id}: human review must remain pending.`);
      assert.equal(localized.frozen, false, `${id}: localized candidate cannot be frozen automatically.`);
      assert.equal(localized.freezeEligible, false, `${id}: localized candidate cannot auto-freeze.`);
      assert.equal(localized.freezeStatus, "NOT_FROZEN", `${id}: freeze status drift.`);
      assert.equal(localized.activationAuthorized, false, `${id}: activation must remain off.`);
      assert.equal(localized.questionStudioDiscoverable, false, `${id}: localized Studio must remain off.`);
      assert.equal(localized.questionBankStatus, "NOT_STORED", `${id}: localized Bank must remain locked.`);
      assert.equal(localized.testEligibility, "INELIGIBLE", `${id}: localized Test Builder must remain off.`);
      assert.equal(localized.publiclyPublishable, false, `${id}: publication must remain off.`);
      assert.equal(localized.publicReleaseAuthorized, false, `${id}: public release must remain off.`);
      assert.equal(localized.localizationLifecycle?.multilingualFreezeGranted, false, `${id}: multilingual freeze must remain false.`);
      assert.equal(localized.localizationLifecycle?.activationAuthorized, false, `${id}: localization activation must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionStudioEnabled, false, `${id}: localized Studio lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.questionBankWritable, false, `${id}: localized Bank lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.testBuilderEligible, false, `${id}: localized Test Builder lifecycle gate must remain false.`);
      assert.equal(localized.localizationLifecycle?.productDeliveryUnlocked, false, `${id}: product delivery must remain locked.`);
      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: fingerprint invalid.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const inventory = {
  status: failures.length
    ? "TRG001_LOCALIZATION_V3_REVIEW_READINESS_DEFECT_INVENTORY"
    : "TRG001_LOCALIZATION_V3_REVIEW_READY_ENGINEERING_PASS",
  frozenEnglishQls: 144,
  languages: ["hi", "pa"],
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedLearnerFields: learnerFields,
  pedagogicFidelityChecks,
  preservedNotationAtoms: notationAtomsPreserved,
  failures: failures.length,
  failureSamples: failures.slice(0, 160),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `V3 review-readiness gate has ${failures.length} failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl, `Expected 864 readiness cases, got ${cases}.`);
assert.equal(fingerprints.size, cases, "Expected one unique localization fingerprint per case.");
