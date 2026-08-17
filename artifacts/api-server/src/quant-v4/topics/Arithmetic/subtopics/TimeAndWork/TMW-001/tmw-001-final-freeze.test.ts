import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { TMW_001_FINAL_FREEZE_AUTHORITY } from "./foundation/final-freeze-authority";

function ok(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function qlId(ordinal: number): string {
  return `TMW-QL-${String(ordinal).padStart(3, "0")}`;
}

const authority = TMW_001_FINAL_FREEZE_AUTHORITY;
ok(authority.status === "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY", "freeze status drift");
ok(authority.sourceAuthorityHead === "9caa3abece889d9ab15241335c0f3eee3a995704", "source authority drift");
ok(authority.qlCount === 228, "QL count drift");
ok(authority.checkpointCount === 14, "checkpoint count drift");
ok(authority.questionStudioDiscoverable === false, "freeze must not itself activate Question Studio");
ok(authority.questionBankStatus === "NOT_STORED", "Question Bank lock drift");
ok(authority.testEligibility === "INELIGIBLE", "test eligibility lock drift");
ok(authority.publiclyPublishable === false, "publication lock drift");

let checked = 0;
const seenQls = new Set<string>();
const seenCheckpoints = new Set<string>();
const languages: readonly Tmw001ChapterLanguage[] = authority.languages;

for (let ordinal = 1; ordinal <= authority.qlCount; ordinal += 1) {
  const questionLanguageId = qlId(ordinal);
  seenQls.add(questionLanguageId);
  for (const language of languages) {
    const question = runTmw001ChapterPipeline({
      questionLanguageId,
      language,
      seed: `tmw-final-freeze:${questionLanguageId}:${language}`,
    });
    ok(question, `${questionLanguageId}:${language}: missing package`);
    ok(question.questionLanguageId === questionLanguageId, `${questionLanguageId}:${language}: identity drift`);
    ok(typeof question.canonicalProblemId === "string", `${questionLanguageId}:${language}: missing checkpoint`);
    seenCheckpoints.add(question.canonicalProblemId);
    ok(typeof question.stem === "string" && question.stem.trim().length > 0, `${questionLanguageId}:${language}: missing stem`);
    ok(Array.isArray(question.options) && question.options.length >= 4, `${questionLanguageId}:${language}: invalid options`);
    ok(Number.isInteger(question.correctIndex), `${questionLanguageId}:${language}: missing correctIndex`);
    ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `${questionLanguageId}:${language}: correctIndex out of range`);
    ok(question.publiclyPublishable === false, `${questionLanguageId}:${language}: publication lock opened`);
    checked += 1;
  }
}

ok(seenQls.size === 228, `expected 228 QLs, got ${seenQls.size}`);
ok(seenCheckpoints.size === 14, `expected 14 checkpoints, got ${seenCheckpoints.size}`);
ok(checked === 684, `expected 684 frozen language packages, got ${checked}`);

console.log(JSON.stringify({
  chapter: authority.chapterId,
  status: authority.status,
  qls: seenQls.size,
  checkpoints: seenCheckpoints.size,
  languages: [...languages],
  packages: checked,
  sourceAuthorityHead: authority.sourceAuthorityHead,
  questionStudioDiscoverable: authority.questionStudioDiscoverable,
  questionBankStatus: authority.questionBankStatus,
  testEligibility: authority.testEligibility,
  publiclyPublishable: authority.publiclyPublishable,
  verdict: "PASS",
}, null, 2));
