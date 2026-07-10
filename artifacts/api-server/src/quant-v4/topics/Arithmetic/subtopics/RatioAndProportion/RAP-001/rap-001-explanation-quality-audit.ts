import path from "node:path";
import { runExplanationQualityAudit } from "../explanation-quality-audit";
import { getQuestionLanguageIds } from "./library";
import { runRap001Pipeline } from "./pipeline";
import { RAP_001_CP_IDS, type Rap001CanonicalProblemId } from "./types";

const packageDir = path.resolve(process.cwd(), "src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001");
runExplanationQualityAudit({
  packageId: "RAP-001",
  cpIds: RAP_001_CP_IDS,
  qlIds: (cpId) => getQuestionLanguageIds(cpId as Rap001CanonicalProblemId, "en"),
  generate: (cpId, qlId, seed) => runRap001Pipeline(cpId as Rap001CanonicalProblemId, { language: "en", questionLanguageId: qlId, seed }),
  reportPath: path.join(packageDir, "rap-001-explanation-quality-report.md"),
});
