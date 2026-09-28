import path from "node:path";
import { runExplanationQualityAudit } from "../explanation-quality-audit";
import { getRap003ActiveCanonicalProblemIds, getRap003QuestionLanguageIds } from "./library";
import { runRap003Pipeline } from "./pipeline";
import { type Rap003CanonicalProblemId } from "./types";

const packageDir = path.resolve(process.cwd(), "src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003");
runExplanationQualityAudit({
  packageId: "RAP-003",
  cpIds: getRap003ActiveCanonicalProblemIds(),
  qlIds: (cpId) => getRap003QuestionLanguageIds(cpId as Rap003CanonicalProblemId),
  generate: (cpId, qlId, seed) => runRap003Pipeline(cpId as Rap003CanonicalProblemId, { language: "en", questionLanguageId: qlId, seed }),
  reportPath: path.join(packageDir, "rap-003-explanation-quality-report.md"),
});
