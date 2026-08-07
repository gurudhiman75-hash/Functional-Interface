import { runProbabilityPackagePipeline } from "../../shared/pipeline";
import type { ProbabilityGenerationInput } from "../../shared/types";
import { PRB_002_LIBRARIES } from "./library";
export const PRB_002_PACKAGE_ID = "PRB-002" as const;
export const PRB_002_CP_IDS = ["PRB-CP-006", "PRB-CP-007", "PRB-CP-008", "PRB-CP-009"] as const;
export type Prb002CanonicalProblemId = (typeof PRB_002_CP_IDS)[number];
export function getPrb002ActiveCanonicalProblemIds(): readonly Prb002CanonicalProblemId[] { return PRB_002_CP_IDS; }
export function listPrb002QuestionEntries() { return PRB_002_LIBRARIES.registry.map((entry)=>({...entry})); }
export function runPrb002Pipeline(cpId:Prb002CanonicalProblemId=PRB_002_CP_IDS[0],input:ProbabilityGenerationInput={}){return runProbabilityPackagePipeline(PRB_002_LIBRARIES,cpId,input);}
