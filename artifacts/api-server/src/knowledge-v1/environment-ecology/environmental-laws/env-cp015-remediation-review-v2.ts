import type { KnowledgeV1Difficulty } from "../../types";
import { ENV_CP015_REMEDIATION_FACT_BY_ID_V2 } from "./env-cp015-remediation-facts-v2";
import type { EnvCp015ReviewQuestion } from "./env-cp015-review-types";

type Seed = {
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  correct: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceFactIds: readonly string[];
};

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-015-QL-013", qlName:"EIA purpose", difficulty:"Easy", stem:"The main purpose of Environmental Impact Assessment is to:", correct:"Evaluate likely environmental effects of a proposed project", distractors:["Count only protected species","Set current pollution rankings","Replace all post-project monitoring"], explanation:"EIA examines likely environmental effects so they can be considered before a project approval decision.", sourceFactIds:["env-cp015-v2-eia-purpose"] },
  { qlId:"ENV-015-QL-013", qlName:"EIA purpose", difficulty:"Easy", stem:"EIA is mainly carried out at which stage?", correct:"Before the relevant project approval decision", distractors:["Only after project closure","Only after an accident","Only during wildlife census"], explanation:"Environmental Impact Assessment is primarily a pre-approval assessment process for proposed projects.", sourceFactIds:["env-cp015-v2-eia-purpose"] },
  { qlId:"ENV-015-QL-013", qlName:"EIA purpose", difficulty:"Medium", stem:"Which statement correctly describes EIA?", correct:"It helps decision-makers consider likely environmental impacts before approval", distractors:["It is only a daily air-quality monitoring method","It is a wildlife population census","It is an international climate treaty"], explanation:"EIA supports project decisions by identifying likely environmental consequences before approval.", sourceFactIds:["env-cp015-v2-eia-purpose"] },
  { qlId:"ENV-015-QL-013", qlName:"EIA purpose", difficulty:"Hard", stem:"Which distinction is correct?", correct:"EIA assesses a proposed project; routine monitoring checks ongoing performance", distractors:["EIA and routine monitoring are identical","EIA begins only after closure","Routine monitoring replaces prior clearance"], explanation:"EIA is mainly an assessment and clearance-stage process, while routine monitoring continues during project operation.", sourceFactIds:["env-cp015-v2-eia-purpose","env-cp015-v2-eia-monitoring"] },

  { qlId:"ENV-015-QL-014", qlName:"EIA Notification 2006", difficulty:"Easy", stem:"India's major EIA Notification was issued in:", correct:"2006", distractors:["1972","1981","2010"], explanation:"The Environmental Impact Assessment Notification was issued on 14 September 2006.", sourceFactIds:["env-cp015-v2-eia-2006"] },
  { qlId:"ENV-015-QL-014", qlName:"EIA Notification 2006", difficulty:"Easy", stem:"The EIA Notification, 2006 is most directly connected with:", correct:"Environmental clearance for specified projects and activities", distractors:["Tiger census methods","Ramsar site designation","IUCN Red List categories"], explanation:"The notification establishes the environmental-clearance framework for specified project and activity categories.", sourceFactIds:["env-cp015-v2-eia-2006","env-cp015-v2-prior-clearance"] },
  { qlId:"ENV-015-QL-014", qlName:"EIA Notification 2006", difficulty:"Medium", stem:"Under the EIA framework, specified projects may require:", correct:"Prior environmental clearance", distractors:["Automatic approval without assessment","Only a post-closure audit","Only an annual wildlife count"], explanation:"Specified projects and activities must obtain environmental clearance before proceeding under the applicable EIA framework.", sourceFactIds:["env-cp015-v2-prior-clearance"] },
  { qlId:"ENV-015-QL-014", qlName:"EIA Notification 2006", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"EIA Notification, 2006 — prior environmental-clearance framework", distractors:["EIA Notification, 2006 — tiger reserve monitoring","EIA Notification, 2006 — Ramsar designation","EIA Notification, 2006 — wildlife-trade permits"], explanation:"The 2006 notification is the core framework for prior environmental clearance of specified projects and activities.", sourceFactIds:["env-cp015-v2-eia-2006","env-cp015-v2-prior-clearance"] },

  { qlId:"ENV-015-QL-015", qlName:"EIA applied distinctions", difficulty:"Easy", stem:"Which is NOT the primary role of EIA?", correct:"Routine day-to-day pollution monitoring after operation begins", distractors:["Identifying likely environmental impacts","Supporting a clearance decision","Assessing a proposed project before approval"], explanation:"Routine operational monitoring is different from EIA, which mainly assesses likely impacts before approval.", sourceFactIds:["env-cp015-v2-eia-monitoring"] },
  { qlId:"ENV-015-QL-015", qlName:"EIA applied distinctions", difficulty:"Easy", stem:"A proposed project is being studied for likely environmental effects before clearance. This is:", correct:"Environmental Impact Assessment", distractors:["Biomagnification","Ecological succession","Ex-situ conservation"], explanation:"Studying likely project impacts before the clearance decision is the central function of EIA.", sourceFactIds:["env-cp015-v2-eia-purpose"] },
  { qlId:"ENV-015-QL-015", qlName:"EIA applied distinctions", difficulty:"Medium", stem:"Which sequence best fits the EIA concept?", correct:"Proposed project → impact assessment → clearance decision", distractors:["Project closure → tiger census → clearance","Wildlife trade → Ramsar listing → air standard","Pollution reading → IUCN category → project approval"], explanation:"EIA examines a proposed project's likely impacts so they can inform the relevant environmental-clearance decision.", sourceFactIds:["env-cp015-v2-eia-purpose","env-cp015-v2-prior-clearance"] },
  { qlId:"ENV-015-QL-015", qlName:"EIA applied distinctions", difficulty:"Hard", stem:"Which statement is correct about prior environmental clearance?", correct:"For specified projects, clearance is required before the project proceeds", distractors:["It is obtained only after project closure","It is the same as routine stack monitoring","It applies only to tiger reserves"], explanation:"The EIA framework links specified projects and activities with environmental clearance before implementation.", sourceFactIds:["env-cp015-v2-prior-clearance"] },
]);

export const ENV_CP015_REMEDIATION_REVIEW_V2: readonly EnvCp015ReviewQuestion[] = Object.freeze(
  S.map((seed,index) => {
    const correctIndex=index%4;
    const options=[...seed.distractors];
    options.splice(correctIndex,0,seed.correct);
    const sourceIds=[...new Set(seed.sourceFactIds.flatMap((id)=>ENV_CP015_REMEDIATION_FACT_BY_ID_V2.get(id)?.sourceIds ?? []))];
    return Object.freeze({
      questionId:`ENV-CP015-V2-${String(index+49).padStart(3,"0")}`,
      chapterId:"ENV-001" as const,
      cpId:"ENV-CP-015" as const,
      qlId:seed.qlId,
      qlName:seed.qlName,
      difficulty:seed.difficulty,
      stem:seed.stem,
      options,
      correctIndex,
      canonicalAnswer:seed.correct,
      explanation:seed.explanation,
      sourceIds,
      sourceFactIds:[...seed.sourceFactIds],
      reviewOnly:true as const,
      runtimeRegistered:false as const,
    });
  }),
);
