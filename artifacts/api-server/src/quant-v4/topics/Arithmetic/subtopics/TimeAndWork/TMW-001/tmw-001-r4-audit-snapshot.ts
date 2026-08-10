import { mkdirSync, writeFileSync } from "node:fs";
import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

const ROOT = "dist/quant-v4";
mkdirSync(ROOT, { recursive: true });

function compact(question: any): Record<string, unknown> {
  return {
    qlId: question.questionLanguageId,
    cpId: question.canonicalProblemId,
    solveMode: question.solveMode,
    language: question.language,
    difficulty: question.difficulty,
    examTier: question.examTier,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answerText: question.solution?.answerText ?? question.answerText,
    learner: question.learnerExplanation ?? null,
    valid: question.validation?.valid,
    errors: question.validation?.errors ?? [],
    publiclyPublishable: question.publiclyPublishable,
    fingerprint: question.mathematicalFingerprint,
  };
}

const english = [];
for (let ordinal = 1; ordinal <= 229; ordinal += 1) {
  const qlId = `TMW-QL-${String(ordinal).padStart(3, "0")}`;
  english.push(compact(runTmw001ChapterPipeline({
    questionLanguageId: qlId,
    language: "en",
    seed: `tmw-r4-blind-audit:${qlId}:en`,
  })));
}

const r4Multilingual = [];
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
for (let ordinal = 212; ordinal <= 229; ordinal += 1) {
  const qlId = `TMW-QL-${String(ordinal).padStart(3, "0")}`;
  for (const language of languages) {
    r4Multilingual.push(compact(runTmw001ChapterPipeline({
      questionLanguageId: qlId,
      language,
      seed: `tmw-r4-blind-audit:${qlId}:multilingual`,
    })));
  }
}

const payload = {
  chapter: "TMW-001",
  snapshot: "post-R4-blind-student-view",
  englishCount: english.length,
  r4MultilingualCount: r4Multilingual.length,
  english,
  r4Multilingual,
};

const path = `${ROOT}/tmw-001-r4-audit-snapshot.json`;
writeFileSync(path, JSON.stringify(payload, null, 2));
console.log(JSON.stringify({ path, englishCount: english.length, r4MultilingualCount: r4Multilingual.length, verdict: "SNAPSHOT_WRITTEN" }, null, 2));
