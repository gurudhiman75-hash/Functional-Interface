import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { TMW_R4_SOURCE_GAP_REGISTRY } from "./foundation/source-gap-r4-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SEEDS = Array.from({ length: 12 }, (_, index) => String(index));

function learnerVisible(question: any): string {
  return [
    question.learnerExplanation?.method ?? "",
    ...(question.learnerExplanation?.solution ?? []),
    question.learnerExplanation?.answer ?? "",
  ].join(" ");
}

function unsafeLearnerNotation(value: string): boolean {
  return /_\{[^}]*[A-Za-z\u0900-\u097F\u0A00-\u0A7F][^}]*\}/u.test(value)
    || /_[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/u.test(value)
    || /\\text\{/u.test(value);
}

let cases = 0;
for (const entry of TMW_R4_SOURCE_GAP_REGISTRY) {
  for (const suffix of SEEDS) {
    for (const language of LANGUAGES) {
      const seed = `tmw-r4-student-polish:${entry.qlId}:${suffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: entry.qlId, language, seed });
      const label = `${entry.qlId}:${language}:${suffix}`;
      const learner = learnerVisible(question);

      assert(question.validation?.valid, `${label}: polished package invalid: ${(question.validation?.errors ?? []).join(" | ")}`);
      assert(!unsafeLearnerNotation(learner), `${label}: unsafe learner notation survived: ${learner}`);
      assert(!/\b1 men\b|\b1 women\b/.test(question.stem), `${label}: English singular/plural defect survived: ${question.stem}`);
      assert(!/1 महिलाएँ/.test(question.stem), `${label}: Hindi singular/plural defect survived: ${question.stem}`);
      assert(!/1 ਔਰਤਾਂ/.test(question.stem), `${label}: Punjabi singular/plural defect survived: ${question.stem}`);
      assert(!/\b\d{2,}\d{2,}=\d+x/.test(learner), `${label}: missing multiplication sign in worker-day equation: ${learner}`);
      assert(question.learnerExplanation.method.length >= 45, `${label}: method is too generic/brief after polish`);
      assert(question.learnerExplanation.solution.length >= 3 && question.learnerExplanation.solution.length <= 5, `${label}: polished solution should contain 3-5 connected lines`);

      if (entry.qlId === "TMW-QL-219") {
        assert(question.learnerExplanation.solution.length >= 4, `${label}: heterogeneous replacement solution skips remaining-work arithmetic`);
        assert(/W=|L=/.test(learner), `${label}: heterogeneous replacement solution does not expose total/remaining work`);
      }
      if (entry.qlId === "TMW-QL-223") {
        assert(/U:V=c:a/.test(learner), `${label}: solo-time ratio does not explicitly reverse the rate ratio`);
      }
      if (entry.qlId === "TMW-QL-224") {
        assert(/m=/.test(learner) && /w=/.test(learner) && /R=/.test(learner) && /T=/.test(learner), `${label}: mixed-crew explanation does not solve category rates then target time`);
        assert(!/\\\(x=/.test(learner), `${label}: target time reuses a category-rate variable`);
      }
      if (entry.qlId === "TMW-QL-225") {
        assert(/m=/.test(learner) && /w=/.test(learner) && /L=/.test(learner) && /n=/.test(learner), `${label}: staged heterogeneous solution skips category-rate or remaining-work inference`);
      }
      if (entry.qlId === "TMW-QL-229") {
        assert(/z\^2/.test(learner), `${label}: half-handoff solution does not show the quadratic reconstruction`);
        assert(/more efficient|अधिक दक्ष|ਵੱਧ ਦੱਖ/.test(learner), `${label}: root-selection reason is missing`);
      }

      cases += 1;
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  audit: "R4-student-facing-polish",
  qls: TMW_R4_SOURCE_GAP_REGISTRY.length,
  languages: LANGUAGES.length,
  seedsPerQl: SEEDS.length,
  cases,
  expectedCases: 18 * 3 * 12,
  verdict: "PASS",
}, null, 2));
