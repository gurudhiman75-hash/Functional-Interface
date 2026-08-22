import assert from "node:assert/strict";
import { STA_QL004_HINDI_REVIEW_COPY, STA_QL004_PUNJABI_REVIEW_COPY } from "./localization-ql004-copy.ts";
import { generateStaQl004LocalizedQuestion } from "./localization-ql004.ts";
import {
  editorializeStaQl004LocalizedText,
  generateStaQl004LocalizedQuestionV2,
  STA_QL004_LOCALIZATION_EDITORIAL_VERSION,
  STA_QL004_LOCALIZATION_LIFECYCLE_V2,
} from "./localization-ql004-editorial-v2.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL004_LOCALIZATION_V2_CASES_PER_LOCALE ?? 768);

const BLOCKED_HINDI = [
  "हर वस्तु को पहले से तेज़ दर्ज करते हैं",
  "सबसे महँगा उपकरण हैं",
  "छाया-छत",
  "प्रस्तावित शेड बाहरी प्रतीक्षा क्षेत्र में दोपहर की सीधी धूप रोकेगी",
  "रोकने से शेड के कारण",
  "सेवा केंद्र को कम अपॉइंटमेंट भूलने की उम्मीद",
  "सेवा केंद्र को कम बारी छूटने की उम्मीद",
  "बड़े स्क्रीन",
  "बसों के आने का वास्तविक समय",
  "स्थिति-जाँच कॉल",
  "फर्श-चिह्न",
  "दोहरे ग्राहक रिकॉर्ड",
  "दोहरी ग्राहक प्रविष्टियों",
  "दोहरे पंजीकरण",
  "कम एक ही ग्राहक के दो रिकॉर्ड",
  "नियमित काउंटर का संबंधित भार",
  "नियमित काउंटर की संबंधित कतार का कुछ भार",
  "नियमित काउंटर वाली प्रतीक्षा",
  "अधूरे दस्तावेज-सेट",
  "काउंटर-चुनने की गलती",
  "भरपाई की कार्रवाई",
  "मूल्य-निर्णय जरूरी नहीं",
  "दावे के लिए दावे के लिए",
  "यही दस्तावेज सूची",
  "हर रुकावट का कारण स्टॉक होना",
  "सामान खत्म होने से होने वाली काम की रुकावटें",
  "स्टॉक खत्म होने से होने वाली काम की रुकावटें",
  "जरूरी सामान कम होते ही पहले से चेतावनी",
  "दोहरे रिकॉर्ड कम होने के लिए",
  "दोहरे रिकॉर्ड रोकने के लिए",
] as const;

const BLOCKED_PUNJABI = [
  "ਹਰ ਚੀਜ਼ ਨੂੰ ਪਹਿਲਾਂ ਨਾਲੋਂ ਤੇਜ਼ ਦਰਜ ਕਰਦੇ ਹਨ",
  "ਸਭ ਤੋਂ ਮਹਿੰਗਾ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਹਨ",
  "ਸੇਵਾ ਕੇਂਦਰ ਨੂੰ ਘੱਟ ਮੁਲਾਕਾਤਾਂ ਭੁੱਲੇ ਜਾਣ ਦੀ ਉਮੀਦ",
  "ਆਪਣੀ ਵਾਰੀ ਗੁਆਉਣ ਵਾਲੇ ਲੋਕ",
  "ਘੱਟ ਵਾਰੀਆਂ ਰਹਿ ਜਾਣ ਦੀ ਉਮੀਦ",
  "ਹਰ ਰਹਿ ਗਈ ਵਾਰੀ",
  "ਸਾਰੇ ਲੋਕਾਂ ਦੀ ਵਾਰੀ ਰਹਿ ਜਾਂਦੀ ਹੈ",
  "ਵਾਰੀ ਰਹਿ ਜਾਣ ਵਿੱਚ ਕਮੀ",
  "ਉਸੇ ਧਾਰਨਾ ਬਾਰੇ",
  "ਉਸੇ ਧਾਰਨਾ ਦੀਆਂ",
  "ਇੱਕੋ ਧਾਰਨਾ ਦੀਆਂ",
  "ਧਾਰਨਾ ਦੀ ਗਲਤ ਸਮਝ",
  "ਬੱਸਾਂ ਦੇ ਆਉਣ ਦਾ ਮੌਜੂਦਾ ਸਮਾਂ",
  "ਆਪਣੇ-ਆਪ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਪਿਕਅਪ ਲਾਕਰ",
  "ਸਥਿਤੀ-ਜਾਣਕਾਰੀ ਵਾਲੀਆਂ ਕਾਲਾਂ",
  "ਵੱਖਰੇ ਫਰਸ਼ੀ ਨਿਸ਼ਾਨ",
  "ਦੋਹਰੇ ਗਾਹਕ ਰਿਕਾਰਡ",
  "ਦੋਹਰੀਆਂ ਗਾਹਕ ਐਂਟਰੀਆਂ",
  "ਦੋਹਰੀਆਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨਾਂ",
  "ਘੱਟ ਇੱਕੋ ਗਾਹਕ ਦੇ ਦੋ ਰਿਕਾਰਡ",
  "ਨਿਯਮਤ ਕਾਊਂਟਰ ਦਾ ਸੰਬੰਧਿਤ ਭਾਰ",
  "ਨਿਯਮਤ ਕਾਊਂਟਰ ਦੀ ਸੰਬੰਧਿਤ ਕਤਾਰ ਦਾ ਕੁਝ ਭਾਰ",
  "ਨਿਯਮਤ ਕਾਊਂਟਰ ਵਾਲੀ ਉਡੀਕ",
  "ਅਧੂਰੇ ਦਸਤਾਵੇਜ਼-ਸੈੱਟ",
  "ਸਰਬਵਿਆਪੀ ਕਾਰਨ",
  "ਮੁੱਲ-ਫੈਸਲਾ",
  "ਕਾਊਂਟਰ ਚੁਣਨ ਵਾਲੀ ਗਲਤੀ",
  "ਭਰਪਾਈ ਦੀ ਕਾਰਵਾਈ",
  "ਇਹੀ ਦਸਤਾਵੇਜ਼ ਸੂਚੀ",
  "ਹਰ ਰੁਕਾਵਟ ਦਾ ਕਾਰਨ ਸਟਾਕ ਹੋਣਾ",
  "ਸਟਾਕ ਮੁੱਕਣ ਨਾਲ ਹੋਣ ਵਾਲੀਆਂ ਕੰਮ ਦੀਆਂ ਰੁਕਾਵਟਾਂ",
  "ਲੋੜੀਂਦਾ ਸਮਾਨ ਘੱਟ ਹੁੰਦਿਆਂ ਹੀ ਪਹਿਲਾਂ ਚੇਤਾਵਨੀ",
  "ਦੋਹਰੇ ਰਿਕਾਰਡ ਘਟਣ ਲਈ",
  "ਦੋਹਰਾ ਰਿਕਾਰਡ ਪਹਿਲਾਂ ਬਣ ਜਾਣ ਕਰਕੇ",
  "ਦੋਹਰੇ ਰਿਕਾਰਡ ਦੇ ਨਤੀਜੇ ਵਜੋਂ",
] as const;

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL004_HINDI_REVIEW_COPY : STA_QL004_PUNJABI_REVIEW_COPY;
}

let authoredSourceEditorialChecks = 0;
for (const locale of ["hi-IN", "pa-IN"] as const) {
  const blocked = locale === "hi-IN" ? BLOCKED_HINDI : BLOCKED_PUNJABI;
  for (const [scenarioId, copy] of Object.entries(bundleFor(locale))) {
    const values = [
      ...copy.statementVariants,
      ...Object.values(copy.candidates).flatMap((candidate) => [...candidate.textVariants, candidate.rationale]),
    ];
    for (const sourceText of values) {
      const polished = editorializeStaQl004LocalizedText(locale, sourceText);
      for (const fragment of blocked) {
        assert.equal(polished.includes(fragment), false, `${locale}/${scenarioId}: rejected V1 wording remains after V2 transform: ${fragment}`);
      }
      authoredSourceEditorialChecks += 1;
    }
  }
}

assert.equal(STA_QL004_LOCALIZATION_EDITORIAL_VERSION, "V2_NATIVE_EDITORIAL");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.multilingualChapterFrozen, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.questionStudioDiscoverable, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.questionBankWritable, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.testEligible, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V2.publiclyPublishable, false);

let semanticParityChecks = 0;
let editorialChecks = 0;
let editorialMutations = 0;
const reached = new Map<StaLocalizedLocale, Set<string>>([
  ["hi-IN", new Set<string>()],
  ["pa-IN", new Set<string>()],
]);

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const blocked = locale === "hi-IN" ? BLOCKED_HINDI : BLOCKED_PUNJABI;
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql004-native-editorial-v2:${locale}:${index}`;
    const v1 = generateStaQl004LocalizedQuestion(seed, locale);
    const v2 = generateStaQl004LocalizedQuestionV2(seed, locale);
    reached.get(locale)!.add(v2.scenarioId);

    assert.equal(v2.questionId, v1.questionId, `${locale}/${seed}: question identity drift`);
    assert.equal(v2.qlId, v1.qlId, `${locale}/${seed}: QL identity drift`);
    assert.equal(v2.proposedQlId, v1.proposedQlId, `${locale}/${seed}: proposed QL identity drift`);
    assert.equal(v2.scenarioId, v1.scenarioId, `${locale}/${seed}: scenario identity drift`);
    assert.equal(v2.seed, v1.seed, `${locale}/${seed}: seed drift`);
    assert.equal(v2.locale, v1.locale, `${locale}/${seed}: locale drift`);
    assert.equal(v2.difficulty, v1.difficulty, `${locale}/${seed}: difficulty drift`);
    assert.equal(v2.sourceProfile, v1.sourceProfile, `${locale}/${seed}: source-profile drift`);
    assert.deepEqual(v2.answerSet, v1.answerSet, `${locale}/${seed}: answer-set drift`);
    assert.equal(v2.answerIndex, v1.answerIndex, `${locale}/${seed}: correct-option drift`);
    assert.deepEqual(
      v2.options.map((option) => ({ semanticAnswerSet: option.semanticAnswerSet, isCorrect: option.isCorrect })),
      v1.options.map((option) => ({ semanticAnswerSet: option.semanticAnswerSet, isCorrect: option.isCorrect })),
      `${locale}/${seed}: option semantic identity drift`,
    );
    assert.deepEqual(v2.candidates.map((candidate) => candidate.candidateId), v1.candidates.map((candidate) => candidate.candidateId), `${locale}/${seed}: selected candidate identity drift`);
    assert.deepEqual(v2.candidates.map((candidate) => candidate.oracle), v1.candidates.map((candidate) => candidate.oracle), `${locale}/${seed}: oracle semantic drift`);
    assert.equal(v2.oracleParity, true);
    assert.equal(v2.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(v2.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(v2.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(v2.lifecycle.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V2");
    assert.equal(v2.lifecycle.multilingualChapterFrozen, false);
    assert.equal(v2.lifecycle.questionStudioDiscoverable, false);
    assert.equal(v2.lifecycle.questionBankWritable, false);
    assert.equal(v2.lifecycle.testEligible, false);
    assert.equal(v2.lifecycle.publiclyPublishable, false);
    assert.equal(v2.explanation.includes(v2.statement), false, `${locale}/${seed}: explanation repeats full stem`);

    const v1Text = [v1.statement, ...v1.candidates.map((candidate) => candidate.text), v1.explanation].join("\n");
    const v2Text = [v2.statement, ...v2.candidates.map((candidate) => candidate.text), v2.explanation].join("\n");
    if (v1Text !== v2Text) editorialMutations += 1;
    for (const fragment of blocked) assert.equal(v2Text.includes(fragment), false, `${locale}/${seed}: rejected V1 wording returned: ${fragment}`);

    semanticParityChecks += 1;
    editorialChecks += 1;
  }
}

assert.equal(reached.get("hi-IN")!.size, 16, "Hindi V2 generation did not reach all 16 frozen QL004 authorities");
assert.equal(reached.get("pa-IN")!.size, 16, "Punjabi V2 generation did not reach all 16 frozen QL004 authorities");
assert.ok(editorialMutations > 0, "V2 editorial overlay did not modify any learner text");

console.log("PASS_STA_QL004_HI_PA_NATIVE_EDITORIAL_V2");
console.log(JSON.stringify({
  editorialVersion: STA_QL004_LOCALIZATION_EDITORIAL_VERSION,
  authoredSourceEditorialChecks,
  semanticParityChecks,
  editorialChecks,
  editorialMutations,
  reachedHindiAuthorities: reached.get("hi-IN")!.size,
  reachedPunjabiAuthorities: reached.get("pa-IN")!.size,
  ql001HindiPunjabiStatus: "FROZEN_V2",
  ql002HindiPunjabiStatus: "FROZEN_V2",
  ql003HindiPunjabiStatus: "FROZEN_V2",
  ql004HindiPunjabiStatus: "REVIEW_CANDIDATE_V2",
  multilingualChapterFrozen: false,
  nativeApprovalRecorded: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
