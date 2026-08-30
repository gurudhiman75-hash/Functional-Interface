import assert from "node:assert/strict";

import { TRG_001_FREEZE, generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_LOCALES,
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
} from "./localization-v1";
import { trg001V3ResidualEnglishTokens } from "./localization-editorial-v3";
import { generateLocalizedTrg001QuestionNativeReviewFinal3Human } from "./localization-native-v5-pedagogic-review-final3-human";

type Locale = "hi-IN" | "pa-IN";
type Field = [string, unknown];

function optionSemantics(question: any) {
  return question.options.map((option: any) => ({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

function pedagogicFields(question: any): Field[] {
  return [
    ...question.explanation.steps.map((step: any, index: number) => [`step-${index + 1}`, step.body] as Field),
    ["shortcut", question.explanation?.shortcut],
    ...question.explanation.traps.map((trap: any, index: number) => [`trap-${index + 1}`, trap] as Field),
  ];
}

function learnerFields(question: any): Field[] {
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

function notationAtoms(value: unknown) {
  const text = String(value ?? "");
  const trig = text.match(/(?:sin|cos|tan|cot|sec|cosec)(?![A-Za-z])/giu) ?? [];
  const numbers = text.match(/\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?°?/gu) ?? [];
  const symbols = text.match(/[πθ]|√\d+/gu) ?? [];
  return Array.from(new Set([...trig, ...numbers, ...symbols].map((atom) => atom.toLowerCase())));
}

function compact(value: unknown) {
  return String(value ?? "").replace(/\s+/gu, "").toLowerCase();
}

const QUADRANTS = [
  { label: "II", english: /\bquadrant\s+II\b/iu, hi: /(?:द्वितीय|दूसरे|दूसरा)\s+चतुर्थांश/u, pa: /(?:ਦੂਜਾ|ਦੂਜੇ)\s+ਚਤੁਰਭਾਗ/u },
  { label: "III", english: /\bquadrant\s+III\b/iu, hi: /(?:तृतीय|तीसरे|तीसरा)\s+चतुर्थांश/u, pa: /(?:ਤੀਜਾ|ਤੀਜੇ)\s+ਚਤੁਰਭਾਗ/u },
  { label: "IV", english: /\bquadrant\s+IV\b/iu, hi: /(?:चतुर्थ|चौथे|चौथा)\s+चतुर्थांश/u, pa: /(?:ਚੌਥਾ|ਚੌਥੇ)\s+ਚਤੁਰਭਾਗ/u },
] as const;

function final3Artifacts(text: string, locale: Locale) {
  const common = [
    /\b(?:Secant|Tangent|Cosine|Sine|Cotangent|Cosecant)\b/u,
    /\b(?:Squaring|Adding|Subtracting|Dividing|Combining|Simplifying|Rationalizing|Solving)\b/u,
    /\bthe two relations\b/iu,
    /\badjacent\b/iu,
    /\bopposite\b/iu,
    /^The (?:target )?angle\b/u,
  ];
  const native = locale === "hi-IN"
    ? [
        /प्रयोग करता है/u,
        /है में/u,
        /स्थित है में/u,
        /है ऋणात्मक में/u,
        /है धनात्मक में/u,
        /बाद (?:सटीक )?सरलीकरण/u,
        /^लेने पर व्युत्क्रम/u,
        /कट जाता है में/u,
        /में बाहरी अनुपात/u,
        /में दिए गए न्यूनकोण अंतराल/u,
        /वर्ग केवल पद/u,
        /युग्म बनता है के साथ/u,
        /अदला-बदली करता है के साथ/u,
        /कोई नहीं वर्ग/u,
        /अतः व्यंजक है/u,
        /न्यूनकोण कोण/u,
        /प्रश्न पूछता है के लिए/u,
      ]
    : [
        /ਵਰਤਦਾ ਹੈ/u,
        /ਹੈ ਵਿੱਚ/u,
        /ਸਥਿਤ ਹੈ ਵਿੱਚ/u,
        /ਹੈ ਰਿਣਾਤਮਕ ਵਿੱਚ/u,
        /ਹੈ ਧਨਾਤਮਕ ਵਿੱਚ/u,
        /ਬਾਅਦ (?:ਸਹੀ )?ਸਰਲੀਕਰਨ/u,
        /^ਲੈਣ ਤੇ ਪਰਸਪਰ/u,
        /ਕੱਟ ਜਾਂਦਾ ਹੈ ਵਿੱਚ/u,
        /ਵਿੱਚ ਬਾਹਰੀ ਅਨੁਪਾਤ/u,
        /ਵਿੱਚ ਦਿੱਤੇ ਹੋਏ ਨਿਊਨ ਕੋਣ ਅੰਤਰਾਲ/u,
        /ਵਰਗ ਕੇਵਲ ਪਦ/u,
        /ਜੋੜਾ ਬਣਦਾ ਹੈ ਨਾਲ/u,
        /ਅਦਲਾ-ਬਦਲੀ ਕਰਦਾ ਹੈ ਨਾਲ/u,
        /ਨਿਊਨ ਕੋਣ ਕੋਣ/u,
        /ਪ੍ਰਸ਼ਨ ਪੁੱਛਦਾ ਹੈ ਲਈ/u,
      ];
  return [...common, ...native].filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

assert.equal(TRG_001_LOCALIZATION_QL_IDS.length, 144);
assert.equal(
  TRG_001_FREEZE.approvedContentFingerprint,
  "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
);

const failures: Array<{ id: string; field: string; issue: string; source?: string; localized: string }> = [];
const fingerprints = new Set<string>();
const seedsPerQl = 5;
let cases = 0;
let learnerFieldCount = 0;
let preservedNotationAtoms = 0;
let quadrantChecks = 0;

for (const qlId of TRG_001_LOCALIZATION_QL_IDS) {
  for (const locale of TRG_001_LOCALIZATION_LOCALES) {
    for (let index = 1; index <= seedsPerQl; index += 1) {
      const seed = `trg001-final3-human-five-seed-${String(index).padStart(2, "0")}-${qlId}-${locale}`;
      const source = generateHumanApprovedTrg001Question(qlId, seed) as any;
      const localized = generateLocalizedTrg001QuestionNativeReviewFinal3Human(qlId, seed, locale) as any;
      const repeated = generateLocalizedTrg001QuestionNativeReviewFinal3Human(qlId, seed, locale) as any;
      const id = `${qlId}:${locale}:seed${index}`;

      assert.deepEqual(localized, repeated, `${id}: Final3 human surface is not deterministic.`);
      assert.equal(trg001CanonicalSemanticFingerprint(localized), trg001CanonicalSemanticFingerprint(source), `${id}: semantic fingerprint drift.`);
      assert.equal(localized.answer, source.answer, `${id}: canonical answer drift.`);
      assert.equal(localized.correctIndex, source.correctIndex, `${id}: correct-index drift.`);
      assert.deepEqual(optionSemantics(localized), optionSemantics(source), `${id}: option semantics drift.`);
      assert.deepEqual(localized.canonicalState, source.canonicalState, `${id}: canonical-state drift.`);
      assert.deepEqual(localized.verification, source.verification, `${id}: verification drift.`);
      assert.equal(localized.explanation.steps.length, source.explanation.steps.length, `${id}: step-count drift.`);

      const sourcePedagogic = new Map(pedagogicFields(source).map(([field, value]) => [field, String(value ?? "")]));
      const localizedPedagogic = new Map(pedagogicFields(localized).map(([field, value]) => [field, String(value ?? "")]));
      for (const [field, sourceText] of sourcePedagogic) {
        const localizedText = localizedPedagogic.get(field) ?? "";
        const normalized = compact(localizedText);
        for (const atom of notationAtoms(sourceText)) {
          if (!normalized.includes(atom.replace(/\s+/gu, ""))) {
            failures.push({ id, field, issue: `missing-notation:${atom}`, source: sourceText, localized: localizedText });
          } else {
            preservedNotationAtoms += 1;
          }
        }
        for (const quadrant of QUADRANTS) {
          if (!quadrant.english.test(sourceText)) continue;
          const expected = locale === "hi-IN" ? quadrant.hi : quadrant.pa;
          if (!expected.test(localizedText)) {
            failures.push({ id, field, issue: `quadrant-fidelity:${quadrant.label}`, source: sourceText, localized: localizedText });
          }
          quadrantChecks += 1;
        }
      }

      for (const [field, raw] of learnerFields(localized)) {
        const text = String(raw ?? "");
        const residual = trg001V3ResidualEnglishTokens(text);
        if (residual.length) failures.push({ id, field, issue: `residual-english:${residual.join(",")}`, localized: text });
        for (const artifact of final3Artifacts(text, locale)) {
          failures.push({ id, field, issue: `editorial-artifact:${artifact}`, localized: text });
        }
        learnerFieldCount += 1;
      }

      assert.equal(localized.reviewStatus, "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL3_HUMAN", `${id}: review status drift.`);
      assert.equal(localized.localizationProof?.final3HumanPolish, true, `${id}: Final3 human proof missing.`);
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
      assert.match(localized.localizationProof?.localizationFingerprint ?? "", /^[0-9a-f]{64}$/u, `${id}: invalid fingerprint.`);
      assert(!fingerprints.has(localized.localizationProof.localizationFingerprint), `${id}: duplicate fingerprint.`);
      fingerprints.add(localized.localizationProof.localizationFingerprint);
      cases += 1;
    }
  }
}

const inventory = {
  status: failures.length ? "TRG001_FINAL3_HUMAN_FIVE_SEED_DEFECT_INVENTORY" : "TRG001_FINAL3_HUMAN_FIVE_SEED_PASS",
  frozenEnglishQls: 144,
  seedsPerQl,
  expectedCases: 144 * 2 * seedsPerQl,
  completedCases: cases,
  inspectedLearnerFields: learnerFieldCount,
  preservedNotationAtoms,
  quadrantChecks,
  failures: failures.length,
  failureSamples: failures.slice(0, 120),
  englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
};
console.log(JSON.stringify(inventory, null, 2));

assert.equal(failures.length, 0, `Final3 five-seed cross-check has ${failures.length} failures.`);
assert.equal(cases, 144 * 2 * seedsPerQl);
assert.equal(fingerprints.size, cases);
