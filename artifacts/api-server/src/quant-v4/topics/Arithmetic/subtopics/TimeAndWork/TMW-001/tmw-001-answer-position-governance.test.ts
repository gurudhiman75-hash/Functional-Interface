import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const QL_IDS = Array.from({ length: 229 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
const SEEDS = Array.from({ length: 64 }, (_, index) => String(index));

const weak: Array<{ qlId: string; positions: number[]; counts: number[] }> = [];
let cases = 0;
for (const qlId of QL_IDS) {
  const counts = [0, 0, 0, 0];
  for (const suffix of SEEDS) {
    const question = runTmw001ChapterPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed: `tmw-answer-position:${qlId}:${suffix}`,
    });
    assert(question.validation?.valid, `${qlId}:${suffix}: invalid package during answer-position audit: ${(question.validation?.errors ?? []).join(" | ")}`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${qlId}:${suffix}: invalid correct index ${question.correctIndex}`);
    assert(question.options[question.correctIndex] === (question.solution?.answerText ?? question.answerText), `${qlId}:${suffix}: correct option does not match solved answer`);
    counts[question.correctIndex] += 1;
    cases += 1;
  }
  const positions = counts.map((count, index) => count > 0 ? index : -1).filter((index) => index >= 0);
  if (positions.length < 4) weak.push({ qlId, positions, counts });
}

assert(weak.length === 0, `Answer-position reachability failed for ${weak.length} QLs: ${JSON.stringify(weak.slice(0, 30))}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  audit: "answer-position-governance",
  qls: QL_IDS.length,
  seedsPerQl: SEEDS.length,
  cases,
  expectedCases: 229 * 64,
  qlsReachingAllFourPositions: QL_IDS.length,
  verdict: "PASS",
}, null, 2));
