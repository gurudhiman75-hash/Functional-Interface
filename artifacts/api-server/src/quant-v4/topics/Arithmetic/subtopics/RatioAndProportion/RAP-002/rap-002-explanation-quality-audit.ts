import path from "node:path";
import { runExplanationQualityAudit } from "../explanation-quality-audit";
import { getRap002QuestionLanguageIds } from "./library";
import { runRap002Pipeline } from "./pipeline";
import { RAP_002_CP_IDS, type Rap002CanonicalProblemId } from "./types";

const packageDir = path.resolve(process.cwd(), "src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002");
runExplanationQualityAudit({
  packageId: "RAP-002",
  cpIds: RAP_002_CP_IDS,
  qlIds: (cpId) => getRap002QuestionLanguageIds(cpId as Rap002CanonicalProblemId),
  generate: (cpId, qlId, seed) => runRap002Pipeline(cpId as Rap002CanonicalProblemId, { language: "en", questionLanguageId: qlId, seed }),
  reportPath: path.join(packageDir, "rap-002-explanation-quality-report.md"),
});
