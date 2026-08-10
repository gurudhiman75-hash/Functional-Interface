import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SEEDS = ["0", "1", "2"] as const;
const QL_IDS = Array.from({ length: 229 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);

let cases = 0;
for (const qlId of QL_IDS) {
  for (const suffix of SEEDS) {
    const rows: any[] = [];
    for (const language of LANGUAGES) {
      const seed = `tmw-r4-expanded:${qlId}:${suffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const label = `${qlId}:${language}:${suffix}`;
      assert(question.validation?.valid, `${label}: invalid package: ${(question.validation?.errors ?? []).join(" | ")}`);
      assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
      assert(question.options?.length === 4, `${label}: not four options`);
      assert(new Set(question.options).size === 4, `${label}: duplicate options`);
      assert(question.correctIndex >= 0 && question.correctIndex < 4, `${label}: bad correct index`);
      rows.push(question);
      cases += 1;
    }

    const answerKeys = rows.map((row) => row.solution?.answerKey ?? row.answerKey ?? row.solution?.answerText ?? row.answerText);
    assert(new Set(answerKeys).size === 1, `${qlId}:${suffix}: multilingual answer parity failed: ${answerKeys.join(" | ")}`);
    const fingerprints = rows.map((row) => row.mathematicalFingerprint);
    assert(new Set(fingerprints).size === 1, `${qlId}:${suffix}: multilingual mathematical fingerprint parity failed`);
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  regression: "R4-expanded-229-QL-chapter",
  qls: QL_IDS.length,
  languages: LANGUAGES.length,
  seedsPerQl: SEEDS.length,
  cases,
  expectedCases: 229 * 3 * 3,
  verdict: "PASS",
}, null, 2));
