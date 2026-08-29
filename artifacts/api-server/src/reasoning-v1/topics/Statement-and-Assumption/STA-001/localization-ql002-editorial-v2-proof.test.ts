import assert from "node:assert/strict";
import { STA_QL001_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql001-freeze-manifest.ts";
import { STA_QL002_HINDI_REVIEW_COPY, STA_QL002_PUNJABI_REVIEW_COPY } from "./localization-ql002-copy.ts";
import { generateStaQl002LocalizedQuestion } from "./localization-ql002.ts";
import {
  editorializeStaQl002LocalizedText,
  generateStaQl002LocalizedQuestionV2,
  STA_QL002_LOCALIZATION_EDITORIAL_VERSION,
  STA_QL002_LOCALIZATION_LIFECYCLE_V2,
} from "./localization-ql002-editorial-v2.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL002_LOCALIZATION_V2_CASES_PER_LOCALE ?? 768);

const BLOCKED_HINDI = [
  "लंबित कतार",
  "लक्षित",
  "स्टाफिंग",
  "व्यवहारिक रूप से",
  "बड़ी सिस्टम अपग्रेड",
  "कुछ भूले हुए अपॉइंटमेंट बचाए जा सकते हैं",
] as const;

const BLOCKED_PUNJABI = [
  "ਹਾਲਤ",
  "ਨਿਸ਼ਾਨਾ",
  "ਸਟਾਫਿੰਗ",
  "ਬਕਾਇਆ ਅਰਜ਼ੀਆਂ ਦੀ ਕਤਾਰ",
  "ਵੱਡੀ ਸਿਸਟਮ ਅਪਗ੍ਰੇਡ",
  "ਛੁੱਟੀਆਂ ਅਪਾਇੰਟਮੈਂਟਾਂ",
  "ਕੁਝ ਭੁੱਲੀਆਂ ਅਪਾਇੰਟਮੈਂਟਾਂ ਬਚਾਈਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ",
] as const;

assert.equal(STA_QL001_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql001HindiPunjabiFrozen, true);
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE_V2.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE_V2.ql002HindiPunjabiStatus, "REVIEW_CANDIDATE_V2");
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE_V2.questionStudioDiscoverable, false);
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE_V2.questionBankWritable, false);
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE_V2.testEligible, false);
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE_V2.publiclyPublishable, false);

function auditEveryAuthoredString(locale: StaLocalizedLocale, bundle: StaLocalizationBundle): number {
  const blocked = locale === "hi-IN" ? BLOCKED_HINDI : BLOCKED_PUNJABI;
  assert.equal(Object.keys(bundle).length, 16, `${locale}: source editorial audit must cover all 16 QL002 authorities`);

  let checks = 0;
  for (const [scenarioId, copy] of Object.entries(bundle)) {
    const authored: string[] = [...copy.statementVariants];
    for (const candidate of Object.values(copy.candidates)) {
      authored.push(...candidate.textVariants, candidate.rationale);
    }

    for (const sourceText of authored) {
      const transformed = editorializeStaQl002LocalizedText(locale, sourceText);
      assert.ok(transformed.trim().length > 0, `${locale}/${scenarioId}: editorial transform produced empty learner text`);
      for (const fragment of blocked) {
        assert.equal(
          transformed.includes(fragment),
          false,
          `${locale}/${scenarioId}: rejected wording remains in authored source after V2 transform: ${fragment}`,
        );
      }
      if (locale === "hi-IN") {
        assert.equal(transformed.includes("मान्यता"), false, `${locale}/${scenarioId}: rejected Hindi term मान्यता remains`);
        assert.equal(transformed.includes("अंतर्निहित"), false, `${locale}/${scenarioId}: rejected Hindi term अंतर्निहित remains`);
      } else {
        assert.equal(transformed.includes("ਮਾਨਤਾ"), false, `${locale}/${scenarioId}: rejected Punjabi term ਮਾਨਤਾ remains`);
        assert.equal(transformed.includes("ਅੰਤਰਿਨਿਹਿਤ"), false, `${locale}/${scenarioId}: rejected Punjabi term ਅੰਤਰਿਨਿਹਿਤ remains`);
      }
      checks += 1;
    }
  }
  return checks;
}

const authoredSourceEditorialChecks =
  auditEveryAuthoredString("hi-IN", STA_QL002_HINDI_REVIEW_COPY) +
  auditEveryAuthoredString("pa-IN", STA_QL002_PUNJABI_REVIEW_COPY);

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
    const seed = `sta-ql002-native-editorial-v2:${locale}:${index}`;
    const v1 = generateStaQl002LocalizedQuestion(seed, locale);
    const v2 = generateStaQl002LocalizedQuestionV2(seed, locale);
    reached.get(locale)!.add(v2.scenarioId);

    assert.equal(v2.questionId, v1.questionId, `${locale}/${seed}: question identity drift`);
    assert.equal(v2.qlId, v1.qlId, `${locale}/${seed}: QL identity drift`);
    assert.equal(v2.proposedQlId, v1.proposedQlId, `${locale}/${seed}: proposed QL identity drift`);
    assert.equal(v2.scenarioId, v1.scenarioId, `${locale}/${seed}: scenario identity drift`);
    assert.equal(v2.seed, v1.seed, `${locale}/${seed}: seed drift`);
    assert.equal(v2.locale, v1.locale, `${locale}/${seed}: locale drift`);
    assert.equal(v2.difficulty, v1.difficulty, `${locale}/${seed}: difficulty drift`);
    assert.equal(v2.sourceProfile, v1.sourceProfile, `${locale}/${seed}: source profile drift`);
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
    assert.equal(v2.lifecycle.englishCorpusStatus, "FROZEN_V2");
    assert.equal(v2.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(v2.lifecycle.ql001FreezeId, STA_QL001_HI_PA_FREEZE_V2_MANIFEST.freezeId);
    assert.equal(v2.lifecycle.ql002HindiPunjabiStatus, "REVIEW_CANDIDATE_V2");
    assert.equal(v2.lifecycle.questionStudioDiscoverable, false);
    assert.equal(v2.lifecycle.questionBankWritable, false);
    assert.equal(v2.lifecycle.testEligible, false);
    assert.equal(v2.lifecycle.publiclyPublishable, false);
    assert.equal(v2.explanation.includes(v2.statement), false, `${locale}/${seed}: explanation repeats full stem`);
    assert.ok(v2.statement.trim().length > 10, `${locale}/${seed}: V2 statement too thin`);

    const v1LearnerText = [v1.statement, ...v1.candidates.map((candidate) => candidate.text), v1.explanation].join("\n");
    const v2LearnerText = [v2.statement, ...v2.candidates.map((candidate) => candidate.text), v2.explanation].join("\n");
    if (v1LearnerText !== v2LearnerText) editorialMutations += 1;
    for (const fragment of blocked) {
      assert.equal(v2LearnerText.includes(fragment), false, `${locale}/${seed}: rejected V1 wording returned: ${fragment}`);
    }

    if (locale === "hi-IN") {
      assert.ok(v2.explanation.includes("पूर्वधारणा"), `${locale}/${seed}: approved Hindi assumption term missing`);
      assert.equal(v2LearnerText.includes("मान्यता"), false, `${locale}/${seed}: rejected Hindi term मान्यता returned`);
      assert.equal(v2LearnerText.includes("अंतर्निहित"), false, `${locale}/${seed}: rejected Hindi term अंतर्निहित returned`);
    } else {
      assert.ok(v2.explanation.includes("ਧਾਰਨਾ"), `${locale}/${seed}: approved Punjabi assumption term missing`);
      assert.equal(v2LearnerText.includes("ਮਾਨਤਾ"), false, `${locale}/${seed}: rejected Punjabi term ਮਾਨਤਾ returned`);
      assert.equal(v2LearnerText.includes("ਅੰਤਰਿਨਿਹਿਤ"), false, `${locale}/${seed}: rejected Punjabi term ਅੰਤਰਿਨਿਹਿਤ returned`);
    }

    semanticParityChecks += 1;
    editorialChecks += 1;
  }
}

assert.equal(reached.get("hi-IN")!.size, 16, "Hindi V2 generation did not reach all 16 frozen QL002 authorities");
assert.equal(reached.get("pa-IN")!.size, 16, "Punjabi V2 generation did not reach all 16 frozen QL002 authorities");
assert.ok(editorialMutations > 0, "V2 editorial overlay did not modify any learner text");

console.log("PASS_STA_QL002_HI_PA_NATIVE_EDITORIAL_V2");
console.log(JSON.stringify({
  editorialVersion: STA_QL002_LOCALIZATION_EDITORIAL_VERSION,
  authoredSourceEditorialChecks,
  semanticParityChecks,
  editorialChecks,
  editorialMutations,
  reachedHindiAuthorities: reached.get("hi-IN")!.size,
  reachedPunjabiAuthorities: reached.get("pa-IN")!.size,
  ql001HindiPunjabiStatus: "FROZEN_V2",
  ql002HindiPunjabiStatus: STA_QL002_LOCALIZATION_LIFECYCLE_V2.ql002HindiPunjabiStatus,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
