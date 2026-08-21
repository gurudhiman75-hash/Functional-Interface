import assert from "node:assert/strict";
import { STA_QL002_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql002-freeze-manifest.ts";
import { STA_QL003_HINDI_REVIEW_COPY, STA_QL003_PUNJABI_REVIEW_COPY } from "./localization-ql003-copy.ts";
import { generateStaQl003LocalizedQuestion } from "./localization-ql003.ts";
import {
  editorializeStaQl003LocalizedText,
  generateStaQl003LocalizedQuestionV2,
  STA_QL003_LOCALIZATION_EDITORIAL_VERSION,
  STA_QL003_LOCALIZATION_LIFECYCLE_V2,
} from "./localization-ql003-editorial-v2.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL003_LOCALIZATION_V2_CASES_PER_LOCALE ?? 768);

const BLOCKED_HINDI = [
  "अलर्ट-सेवा माइग्रेशन",
  "पहचान-पत्र बदलने का काम",
  "नया पहचान-पत्र बनवाने की प्रक्रिया",
  "सूची-जाँच",
  "संग्रह सूचना",
  "प्रमाणपत्र संबंधी काम वाले आवेदक",
  "विंडो 9 पर प्रमाणपत्र संबंधी सेवा",
  "छूटे दस्तावेज स्वीकार",
  "छूटा हुआ दस्तावेज अपलोड",
] as const;

const BLOCKED_PUNJABI = [
  "ਅਲਰਟ-ਸੇਵਾ ਮਾਈਗ੍ਰੇਸ਼ਨ",
  "ਪਛਾਣ-ਪੱਤਰ ਬਦਲਣ ਦਾ ਕੰਮ",
  "ਨਵਾਂ ਪਛਾਣ-ਪੱਤਰ ਬਣਵਾਉਣ ਦੀ ਕਾਰਵਾਈ",
  "ਸਰਟੀਫਿਕੇਟ ਸੇਵਾ ਵਾਲੇ ਅਰਜ਼ੀਦਾਰ",
  "ਵਿੰਡੋ 9 ਉੱਤੇ ਸਰਟੀਫਿਕੇਟ ਸੇਵਾ",
  "ਰਹਿ ਗਏ ਦਸਤਾਵੇਜ਼ ਲੈ ਸਕਦਾ ਹੈ",
  "ਅੱਜ ਰਹਿ ਗਿਆ ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ",
] as const;

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL003_HINDI_REVIEW_COPY : STA_QL003_PUNJABI_REVIEW_COPY;
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
      const polished = editorializeStaQl003LocalizedText(locale, sourceText);
      for (const fragment of blocked) {
        assert.equal(polished.includes(fragment), false, `${locale}/${scenarioId}: rejected wording remains after V2 transform: ${fragment}`);
      }
      authoredSourceEditorialChecks += 1;
    }
  }
}

assert.equal(STA_QL002_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.ql002FreezeId, STA_QL002_HI_PA_FREEZE_V2_MANIFEST.freezeId);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.ql003HindiPunjabiStatus, "REVIEW_CANDIDATE_V2");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.questionStudioDiscoverable, false);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.questionBankWritable, false);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.testEligible, false);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE_V2.publiclyPublishable, false);

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
    const seed = `sta-ql003-native-editorial-v2:${locale}:${index}`;
    const v1 = generateStaQl003LocalizedQuestion(seed, locale);
    const v2 = generateStaQl003LocalizedQuestionV2(seed, locale);
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
    assert.deepEqual(
      v2.candidates.map((candidate) => candidate.candidateId),
      v1.candidates.map((candidate) => candidate.candidateId),
      `${locale}/${seed}: selected candidate identity drift`,
    );
    assert.deepEqual(
      v2.candidates.map((candidate) => candidate.oracle),
      v1.candidates.map((candidate) => candidate.oracle),
      `${locale}/${seed}: oracle/misconception semantic drift`,
    );
    assert.equal(v2.oracleParity, true);
    assert.equal(v2.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(v2.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(v2.lifecycle.ql003HindiPunjabiStatus, "REVIEW_CANDIDATE_V2");
    assert.equal(v2.lifecycle.questionStudioDiscoverable, false);
    assert.equal(v2.lifecycle.questionBankWritable, false);
    assert.equal(v2.lifecycle.testEligible, false);
    assert.equal(v2.lifecycle.publiclyPublishable, false);
    assert.equal(v2.explanation.includes(v2.statement), false, `${locale}/${seed}: explanation repeats full stem`);

    const v1Text = [v1.statement, ...v1.candidates.map((candidate) => candidate.text), v1.explanation].join("\n");
    const v2Text = [v2.statement, ...v2.candidates.map((candidate) => candidate.text), v2.explanation].join("\n");
    if (v1Text !== v2Text) editorialMutations += 1;
    for (const fragment of blocked) {
      assert.equal(v2Text.includes(fragment), false, `${locale}/${seed}: rejected V1 wording returned: ${fragment}`);
    }

    semanticParityChecks += 1;
    editorialChecks += 1;
  }
}

assert.equal(reached.get("hi-IN")!.size, 16, "Hindi V2 generation did not reach all 16 frozen QL003 authorities");
assert.equal(reached.get("pa-IN")!.size, 16, "Punjabi V2 generation did not reach all 16 frozen QL003 authorities");
assert.ok(editorialMutations > 0, "V2 editorial overlay did not modify any learner text");

console.log("PASS_STA_QL003_HI_PA_NATIVE_EDITORIAL_V2");
console.log(JSON.stringify({
  editorialVersion: STA_QL003_LOCALIZATION_EDITORIAL_VERSION,
  authoredSourceEditorialChecks,
  semanticParityChecks,
  editorialChecks,
  editorialMutations,
  reachedHindiAuthorities: reached.get("hi-IN")!.size,
  reachedPunjabiAuthorities: reached.get("pa-IN")!.size,
  ql001HindiPunjabiStatus: "FROZEN_V2",
  ql002HindiPunjabiStatus: "FROZEN_V2",
  ql003HindiPunjabiStatus: "REVIEW_CANDIDATE_V2",
  nativeApprovalRecorded: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
