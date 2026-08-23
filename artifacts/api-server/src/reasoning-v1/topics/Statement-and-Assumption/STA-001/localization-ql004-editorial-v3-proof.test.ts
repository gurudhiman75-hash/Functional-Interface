import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { STA_QL004_HINDI_REVIEW_COPY, STA_QL004_PUNJABI_REVIEW_COPY } from "./localization-ql004-copy.ts";
import {
  editorializeStaQl004LocalizedText,
  generateStaQl004LocalizedQuestionV2,
} from "./localization-ql004-editorial-v2.ts";
import {
  examRealizeStaQl004Statement,
  generateStaQl004LocalizedQuestionV3,
  STA_QL004_EXAM_REALNESS_EDITORIAL_VERSION,
  STA_QL004_EXAM_REALNESS_REWRITE_COUNTS,
  STA_QL004_LOCALIZATION_LIFECYCLE_V3,
} from "./localization-ql004-editorial-v3.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL004_EXAM_REALNESS_CASES_PER_LOCALE ?? 4096);

function normalize(value: string): string {
  return value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function identityProjection(
  question: ReturnType<typeof generateStaQl004LocalizedQuestionV2> | ReturnType<typeof generateStaQl004LocalizedQuestionV3>,
) {
  return {
    questionId: question.questionId,
    packageId: question.packageId,
    chapterId: question.chapterId,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    proposedQlId: question.proposedQlId,
    scenarioId: question.scenarioId,
    seed: question.seed,
    locale: question.locale,
    difficulty: question.difficulty,
    sourceProfile: question.sourceProfile,
    candidates: question.candidates,
    options: question.options,
    answerIndex: question.answerIndex,
    answerSet: question.answerSet,
    explanation: question.explanation,
    oracleParity: question.oracleParity,
  };
}

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL004_HINDI_REVIEW_COPY : STA_QL004_PUNJABI_REVIEW_COPY;
}

function collectCanonicalStatements(locale: StaLocalizedLocale): string[] {
  const bundle = bundleFor(locale);
  const authorities = STA_ENGLISH_CORPUS_BY_QL["STA-QL-004"];
  assert.equal(authorities.length, 16, `${locale}: expected 16 frozen QL004 authorities`);

  return authorities.flatMap((authority) => {
    const copy = bundle[authority.scenarioId];
    assert.ok(copy, `${locale}/${authority.scenarioId}: localization copy missing`);
    assert.ok(copy.statementVariants.length >= 2, `${locale}/${authority.scenarioId}: fewer than two authored localization stems`);
    return copy.statementVariants.slice(0, 2).map((statement) => {
      const v2 = editorializeStaQl004LocalizedText(locale, statement);
      const v3 = examRealizeStaQl004Statement(locale, v2);
      assert.notEqual(v3, v2, `${locale}/${authority.scenarioId}: authored V3 stem did not change from V2`);
      assert.ok(wordCount(v3) >= 12 && wordCount(v3) <= 42, `${locale}/${authority.scenarioId}: authored V3 stem outside exam-realness length envelope`);
      return v3;
    });
  });
}

assert.equal(STA_QL004_EXAM_REALNESS_EDITORIAL_VERSION, "V3_EXAM_REALNESS");
assert.equal(STA_QL004_EXAM_REALNESS_REWRITE_COUNTS.hindi, 32);
assert.equal(STA_QL004_EXAM_REALNESS_REWRITE_COUNTS.punjabi, 32);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V3");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.multilingualChapterFrozen, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.questionStudioDiscoverable, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.questionBankWritable, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.testEligible, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE_V3.publiclyPublishable, false);

let semanticIdentityChecks = 0;
let rewrittenStemChecks = 0;
let implicitAntiRestatementChecks = 0;
const reached = new Map<StaLocalizedLocale, Set<string>>([
  ["hi-IN", new Set<string>()],
  ["pa-IN", new Set<string>()],
]);
const answerPositions = new Map<StaLocalizedLocale, number[]>([
  ["hi-IN", [0, 0, 0, 0]],
  ["pa-IN", [0, 0, 0, 0]],
]);

for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql004-exam-realness-v3:${locale}:${index}`;
    const v2 = generateStaQl004LocalizedQuestionV2(seed, locale);
    const v3 = generateStaQl004LocalizedQuestionV3(seed, locale);

    assert.deepEqual(identityProjection(v3), identityProjection(v2), `${locale}/${seed}: V3 changed semantic/editorial identity outside the stem`);
    assert.notEqual(v3.statement, v2.statement, `${locale}/${seed}: V3 did not rewrite the QL004 stem`);
    assert.equal(v3.lifecycle.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V3");
    assert.equal(v3.lifecycle.questionStudioDiscoverable, false);
    assert.equal(v3.lifecycle.questionBankWritable, false);
    assert.equal(v3.lifecycle.testEligible, false);
    assert.equal(v3.lifecycle.publiclyPublishable, false);
    assert.ok(wordCount(v3.statement) >= 12 && wordCount(v3.statement) <= 42, `${locale}/${seed}: stem outside exam-realness length envelope`);
    assert.equal(v3.explanation.includes(v3.statement), false, `${locale}/${seed}: explanation repeats V3 full stem`);

    const normalizedStatement = normalize(v3.statement);
    for (const candidate of v3.candidates) {
      if (candidate.oracle.classification !== "IMPLICIT") continue;
      const normalizedCandidate = normalize(candidate.text);
      assert.equal(normalizedStatement.includes(normalizedCandidate), false, `${locale}/${seed}/${candidate.candidateId}: implicit assumption became an explicit restatement`);
      implicitAntiRestatementChecks += 1;
    }

    reached.get(locale)!.add(v3.scenarioId);
    answerPositions.get(locale)![v3.answerIndex] += 1;
    semanticIdentityChecks += 1;
    rewrittenStemChecks += 1;
  }
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  assert.equal(reached.get(locale)!.size, 16, `${locale}: stress generation did not reach all 16 QL004 authorities`);
  const positions = answerPositions.get(locale)!;
  for (let index = 0; index < positions.length; index += 1) {
    const share = positions[index]! / CASES_PER_LOCALE;
    assert.ok(share >= 0.18 && share <= 0.32, `${locale}: answer position ${index} is imbalanced at ${share.toFixed(3)}`);
  }
}

const hindiCanonical = collectCanonicalStatements("hi-IN");
const punjabiCanonical = collectCanonicalStatements("pa-IN");
assert.equal(hindiCanonical.length, 32);
assert.equal(punjabiCanonical.length, 32);
assert.equal(new Set(hindiCanonical).size, 32, "Hindi V3 canonical stems are not unique");
assert.equal(new Set(punjabiCanonical).size, 32, "Punjabi V3 canonical stems are not unique");

const hindiText = hindiCanonical.join("\n");
const punjabiText = punjabiCanonical.join("\n");
assert.equal((hindiText.match(/उम्मीद/gu) ?? []).length, 0, "Hindi V3 retained the dominant V2 उम्मीद skeleton");
assert.equal((punjabiText.match(/ਉਮੀਦ/gu) ?? []).length, 0, "Punjabi V3 retained the dominant V2 ਉਮੀਦ skeleton");
assert.ok((hindiText.match(/अनुमान/gu) ?? []).length <= 12, "Hindi V3 overuses अनुमान framing");
assert.ok((hindiText.match(/अपेक्षा/gu) ?? []).length <= 16, "Hindi V3 overuses अपेक्षा framing");
assert.ok((punjabiText.match(/ਅੰਦਾਜ਼/gu) ?? []).length <= 6, "Punjabi V3 overuses ਅੰਦਾਜ਼ framing");
assert.ok((punjabiText.match(/ਆਸ/gu) ?? []).length <= 16, "Punjabi V3 overuses ਆਸ framing");

console.log("PASS_STA_QL004_HI_PA_EXAM_REALNESS_V3");
console.log(JSON.stringify({
  editorialVersion: STA_QL004_EXAM_REALNESS_EDITORIAL_VERSION,
  casesPerLocale: CASES_PER_LOCALE,
  semanticIdentityChecks,
  rewrittenStemChecks,
  implicitAntiRestatementChecks,
  canonicalHindiQuestions: hindiCanonical.length,
  canonicalPunjabiQuestions: punjabiCanonical.length,
  uniqueHindiStems: new Set(hindiCanonical).size,
  uniquePunjabiStems: new Set(punjabiCanonical).size,
  reachedHindiAuthorities: reached.get("hi-IN")!.size,
  reachedPunjabiAuthorities: reached.get("pa-IN")!.size,
  answerPositionsHindi: answerPositions.get("hi-IN"),
  answerPositionsPunjabi: answerPositions.get("pa-IN"),
  ql004HindiPunjabiStatus: "REVIEW_CANDIDATE_V3",
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));
