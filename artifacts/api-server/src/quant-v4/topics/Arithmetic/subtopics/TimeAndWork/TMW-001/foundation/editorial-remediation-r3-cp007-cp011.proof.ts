import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./chapter-localized-runtime";
import { tmwR3SolvedAnswerText } from "./learner-explanation-r3-cp007-cp011";

const FINDINGS = [
  "TMW-QL-130",
  "TMW-QL-136",
  "TMW-QL-140",
  "TMW-QL-150",
  "TMW-QL-160",
  "TMW-QL-174",
  "TMW-QL-189",
  "TMW-QL-192",
  "TMW-QL-195",
  "TMW-QL-199",
  "TMW-QL-208",
] as const;

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SEEDS = ["0", "1", "2"] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function conclusionOf(question: any): string {
  return String(question.explanation?.conclusion ?? "");
}

function checkFinding(question: any, qlId: string, language: Tmw001ChapterLanguage): void {
  const conclusion = conclusionOf(question);
  const answer = tmwR3SolvedAnswerText(question);
  const learnerAnswer = String(question.learnerExplanation?.answer ?? "");
  const label = `${qlId}:${language}`;

  assert(question.validation?.valid, `${label}: validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
  assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
  assert(conclusion.trim().length > 0, `${label}: conclusion is empty`);
  assert(conclusion.includes(answer), `${label}: remediated conclusion omits solved answer ${answer}`);
  assert(learnerAnswer.includes(answer) || learnerAnswer.includes(answer.replace(/\\text\{([^{}]+)\}/g, "$1")), `${label}: learner answer omits solved answer`);

  switch (qlId) {
    case "TMW-QL-130":
    case "TMW-QL-136":
    case "TMW-QL-140":
      if (language === "hi") assert(/[\u0900-\u097F]/.test(conclusion), `${label}: Hindi conclusion is not localized`);
      if (language === "pa") assert(/[\u0A00-\u0A7F]/.test(conclusion), `${label}: Punjabi conclusion is not localized`);
      break;
    case "TMW-QL-150":
      assert(/days worked|दिनों.*अनुपात|ਦਿਨਾਂ.*ਅਨੁਪਾਤ/i.test(conclusion), `${label}: conclusion does not name the days ratio`);
      assert(!/contribution-factor/i.test(conclusion), `${label}: contribution-factor wording survived`);
      break;
    case "TMW-QL-160":
      assert(/net fraction|शुद्ध परिवर्तन|ਸ਼ੁੱਧ ਬਦਲਾਅ/i.test(conclusion), `${label}: net-change target is not stated`);
      break;
    case "TMW-QL-174": {
      const visible = [question.stem, ...(question.options ?? []), answer, conclusion].join(" ");
      assert(!/will not go empty|खाली नहीं जाएगी|ਖਾਲੀ ਨਹੀਂ ਜਾਵੇਗੀ/i.test(visible), `${label}: unnatural empty-outcome wording survived`);
      break;
    }
    case "TMW-QL-189":
      assert(/complete cycles|पूरे चक्रों|ਪੂਰੇ ਚੱਕਰਾਂ/i.test(conclusion), `${label}: complete-cycle count is not named`);
      break;
    case "TMW-QL-192":
      assert(/switch|स्विच|ਸਵਿੱਚ/i.test(conclusion), `${label}: switch time is not named`);
      assert(!/total required time|कुल आवश्यक समय|ਕੁੱਲ ਲੋੜੀਂਦਾ ਸਮਾਂ/i.test(conclusion), `${label}: switch time remains mislabeled`);
      break;
    case "TMW-QL-195":
    case "TMW-QL-199":
      assert(/first-day|पहले दिन|ਪਹਿਲੇ ਦਿਨ/i.test(conclusion), `${label}: first-day output is not named`);
      assert(!/total output|कुल उत्पादन|ਕੁੱਲ ਉਤਪਾਦਨ/i.test(conclusion), `${label}: first-day output remains mislabeled as total output`);
      break;
    case "TMW-QL-208":
      assert(/additional daily rate|अतिरिक्त दैनिक दर|ਵਾਧੂ ਰੋਜ਼ਾਨਾ ਦਰ/i.test(conclusion), `${label}: additional daily rate is not named`);
      break;
  }
}

export function runTmw001R3Cp007To011EditorialProof(): {
  findings: number;
  languages: number;
  seedsPerFindingLanguage: number;
  cases: number;
  verdict: "PASS";
} {
  let cases = 0;
  for (const qlId of FINDINGS) {
    for (const language of LANGUAGES) {
      for (const suffix of SEEDS) {
        const question = runTmw001ChapterPipeline({
          questionLanguageId: qlId,
          language,
          seed: `tmw-r3-editorial:${qlId}:${language}:${suffix}`,
        });
        checkFinding(question, qlId, language);
        cases += 1;
      }
    }
  }
  return {
    findings: FINDINGS.length,
    languages: LANGUAGES.length,
    seedsPerFindingLanguage: SEEDS.length,
    cases,
    verdict: "PASS",
  };
}
