import { runProbabilityPackagePipeline } from "../../shared/pipeline";
import type { ProbabilityGenerationInput } from "../../shared/types";
import { PRB_001_LIBRARIES } from "./library";
export const PRB_001_PACKAGE_ID = "PRB-001" as const;
export const PRB_001_CP_IDS = ["PRB-CP-001", "PRB-CP-002", "PRB-CP-003", "PRB-CP-004", "PRB-CP-005"] as const;
export type Prb001CanonicalProblemId = (typeof PRB_001_CP_IDS)[number];
export function getPrb001ActiveCanonicalProblemIds(): readonly Prb001CanonicalProblemId[] { return PRB_001_CP_IDS; }
export function listPrb001QuestionEntries() { return PRB_001_LIBRARIES.registry.map((entry)=>({...entry})); }
export function runPrb001Pipeline(cpId:Prb001CanonicalProblemId=PRB_001_CP_IDS[0],input:ProbabilityGenerationInput={}){return runProbabilityPackagePipeline(PRB_001_LIBRARIES,cpId,input);}
