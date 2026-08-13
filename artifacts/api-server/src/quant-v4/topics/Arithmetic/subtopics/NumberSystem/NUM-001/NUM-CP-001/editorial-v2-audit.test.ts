import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP001_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp001QuestionStudioReview } from "./question-studio-review-release";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const bannedMeta = /^(?:In this question\b|Here\b)/iu;
const bannedJargon = /\b(?:admissible|topology|candidate-set|residue condition|universal guarantee|sharpness)\b/iu;
const bannedClutter = /\b(?:Strategy|Exam Speed|Common Traps?)\b/iu;
const unicodeMath = /[√²³]/u;
const rawUnitFraction = /-?\d+\/1\b/u;
const longDecimal = /\d+\.\d{5,}/u;
const samples: any[] = [];
let questions = 0;

for (const qlId of NUM_CP001_PERMANENT_QL_IDS) {
  for (let variant = 1; variant <= 4; variant += 1) {
    const question = runNumCp001QuestionStudioReview({
      questionLanguageId: qlId,
      language: "en",
      seed: `cp001-editorial-v2:${qlId}:${variant}`,
    }) as any;
    questions += 1;
    samples.push(question);
    const learnerText = [question.stem, ...question.options, ...(question.explanation?.lines ?? [])].join("\n");

    assert(question.editorialVersion === "NUM_CP001_EDITORIAL_V2", `${qlId}: editorial version missing`);
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${qlId}: option integrity`);
    assert(question.options[question.correctIndex] === question.answer, `${qlId}: answer index`);
    assert(!bannedMeta.test(question.stem), `${qlId}: meta-stem remains: ${question.stem}`);
    assert(!bannedJargon.test(learnerText), `${qlId}: technical learner jargon remains`);
    assert(!bannedClutter.test(learnerText), `${qlId}: cluttered explanation label remains`);
    assert(!unicodeMath.test(learnerText), `${qlId}: unicode math glyph remains`);
    assert(!rawUnitFraction.test(learnerText), `${qlId}: /1 artefact remains`);
    assert((question.explanation?.lines ?? []).length >= 3 && (question.explanation?.lines ?? []).length <= 6, `${qlId}: explanation is not concise`);

    if (qlId === "NUM-QL-129") {
      assert(/\\\([a-z]/iu.test(question.stem), `${qlId}: parity stem still lacks variables`);
      assert(!/^Which one of the following expressions has an odd value/iu.test(question.stem), `${qlId}: trivial numeric parity stem remains`);
    }
    if (qlId === "NUM-QL-138") {
      assert(learnerText.includes("\\sqrt{"), `${qlId}: LaTeX radical missing`);
    }
    if (qlId === "NUM-QL-141") {
      assert(!longDecimal.test(learnerText), `${qlId}: floating-decimal working remains`);
    }
    if (qlId === "NUM-QL-142") {
      assert(!/(Every whole number is negative|1 is an even integer)/iu.test(question.stem), `${qlId}: implausible statement remains`);
    }
    if (qlId === "NUM-QL-143") {
      assert(question.stem.includes("\n\nStatement I:") && question.stem.includes("\nStatement II:"), `${qlId}: DS statements not exam formatted`);
    }
    if (qlId === "NUM-QL-144") {
      assert(!/guaranteed/iu.test(learnerText), `${qlId}: guaranteed wording remains`);
      const match = question.stem.match(/any (\d+) consecutive integers/iu);
      assert(Boolean(match) && Number(match?.[1]) >= 3, `${qlId}: difficulty floor still trivial`);
    }
  }
}

assert(questions === 84, `English V2 review count ${questions}`);

const outDir = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/num-cp001-editorial-v2");
mkdirSync(outDir, { recursive: true });
const jsonPath = resolve(outDir, "num-cp001-editorial-v2-84q-review.json");
const mdPath = resolve(outDir, "num-cp001-editorial-v2-84q-review.md");
writeFileSync(jsonPath, JSON.stringify({ status: "EDITORIAL_V2_REVIEW_CANDIDATE", questions, samples }, null, 2));
writeFileSync(mdPath, [
  "# NUM-CP-001 Editorial V2 — 84Q English Review", "",
  "21 permanent QLs × 4 review questions. Question Bank, tests and public release remain closed.", "",
  ...samples.flatMap((question) => [
    `## ${question.questionLanguageId} · ${question.difficulty}`, "",
    question.stem, "",
    ...question.options.map((option: string, index: number) => `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **[Correct]**" : ""}`),
    "", ...(question.explanation?.lines ?? []), "",
  ]),
].join("\n"));

console.log(JSON.stringify({ status: "PASS_NUM_CP001_EDITORIAL_V2", questions, jsonPath, mdPath }, null, 2));
