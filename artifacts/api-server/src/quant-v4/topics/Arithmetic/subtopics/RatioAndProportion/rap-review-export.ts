import path from "node:path";
import { generateQuestion } from "../../../../generation-engine";
import { writeHumanReviewExports } from "./human-review-export";
import { getQuestionLanguageIds as getRap001QuestionLanguageIds } from "./RAP-001/library";
import { RAP_001_CP_IDS } from "./RAP-001/types";
import { getRap002QuestionLanguageIds } from "./RAP-002/library";
import { RAP_002_CP_IDS } from "./RAP-002/types";
import { getRap003QuestionLanguageIds } from "./RAP-003/library";
import { RAP_003_CP_IDS } from "./RAP-003/types";

const basePath = "src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion";

async function generate(packageId: "RAP-001" | "RAP-002" | "RAP-003", cpId: string, qlId: string, seed: string) {
  const result = await generateQuestion({
    packageId,
    canonicalProblemId: cpId,
    questionLanguageId: qlId,
    language: "en",
    seed,
    count: 1,
  });
  return { question: result.questions[0] as any, pkg: result.questionPackages[0] as any };
}

const originalInfo = console.info;
console.info = () => undefined;
const results = await Promise.all([
  writeHumanReviewExports({
    packageId: "RAP-001",
    cpIds: RAP_001_CP_IDS,
    qlIds: (cpId) => getRap001QuestionLanguageIds(cpId as any, "en"),
    generate: (cpId, qlId, seed) => generate("RAP-001", cpId, qlId, seed),
    reviewPath: path.resolve(basePath, "RAP-001/rap-001-human-review-en.csv"),
    diversityPath: path.resolve(basePath, "RAP-001/rap-001-same-ql-diversity-en.csv"),
  }),
  writeHumanReviewExports({
    packageId: "RAP-002",
    cpIds: RAP_002_CP_IDS,
    qlIds: (cpId) => getRap002QuestionLanguageIds(cpId as any),
    generate: (cpId, qlId, seed) => generate("RAP-002", cpId, qlId, seed),
    reviewPath: path.resolve(basePath, "RAP-002/rap-002-human-review-en.csv"),
    diversityPath: path.resolve(basePath, "RAP-002/rap-002-same-ql-diversity-en.csv"),
  }),
  writeHumanReviewExports({
    packageId: "RAP-003",
    cpIds: RAP_003_CP_IDS,
    qlIds: (cpId) => getRap003QuestionLanguageIds(cpId as any),
    generate: (cpId, qlId, seed) => generate("RAP-003", cpId, qlId, seed),
    reviewPath: path.resolve(basePath, "RAP-003/rap-003-human-review-en.csv"),
    diversityPath: path.resolve(basePath, "RAP-003/rap-003-same-ql-diversity-en.csv"),
  }),
]);
console.info = originalInfo;

console.log(JSON.stringify({ "RAP-001": results[0], "RAP-002": results[1], "RAP-003": results[2] }, null, 2));
