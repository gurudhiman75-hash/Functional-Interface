import type { KnowledgeV1Difficulty } from "../../types";
import { ENV_CP016_REMEDIATION_FACT_BY_ID_V2 } from "./env-cp016-remediation-facts-v2";
import type { EnvCp016ReviewQuestion } from "./env-cp016-review-types";

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
  { qlId:"ENV-016-QL-013", qlName:"Chipko and Appiko movements", difficulty:"Easy", stem:"The Chipko movement is best known for:", correct:"Villagers embracing trees to resist felling", distractors:["Creating tiger reserves","Monitoring urban air quality","Regulating wildlife trade"], explanation:"Chipko became famous for local people embracing trees to oppose commercial felling.", sourceFactIds:["env-cp016-v2-chipko"] },
  { qlId:"ENV-016-QL-013", qlName:"Chipko and Appiko movements", difficulty:"Easy", stem:"The Appiko movement began in which state?", correct:"Karnataka", distractors:["Kerala","Rajasthan","Assam"], explanation:"The Appiko movement began in Karnataka in 1983 and drew inspiration from Chipko-style forest protection.", sourceFactIds:["env-cp016-v2-appiko"] },
  { qlId:"ENV-016-QL-013", qlName:"Chipko and Appiko movements", difficulty:"Medium", stem:"Which movement in Karnataka used tree-protection methods inspired by Chipko?", correct:"Appiko movement", distractors:["Save Silent Valley","Project Elephant","Green India Mission"], explanation:"Appiko adapted tree-protection methods inspired by Chipko and emerged in Karnataka.", sourceFactIds:["env-cp016-v2-appiko","env-cp016-v2-chipko"] },
  { qlId:"ENV-016-QL-013", qlName:"Chipko and Appiko movements", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Chipko — Himalayan forest protection; Appiko — Karnataka", distractors:["Chipko — Kerala hydel protest; Appiko — Rajasthan","Chipko — elephant corridor scheme; Appiko — Assam","Chipko — solar mission; Appiko — tiger monitoring"], explanation:"Chipko is linked with Himalayan forest protection, while Appiko began in Karnataka with similar tree-protection methods.", sourceFactIds:["env-cp016-v2-chipko","env-cp016-v2-appiko"] },

  { qlId:"ENV-016-QL-014", qlName:"Silent Valley and Bishnoi tradition", difficulty:"Easy", stem:"The Save Silent Valley movement opposed a proposed:", correct:"Hydel project threatening evergreen forest", distractors:["Tiger census","Solar mission","Wetland treaty"], explanation:"The movement opposed a hydel project that threatened the tropical evergreen forest of Silent Valley.", sourceFactIds:["env-cp016-v2-silent-valley"] },
  { qlId:"ENV-016-QL-014", qlName:"Silent Valley and Bishnoi tradition", difficulty:"Easy", stem:"Silent Valley is in which state?", correct:"Kerala", distractors:["Karnataka","Rajasthan","Uttarakhand"], explanation:"Silent Valley is in Kerala, where a major conservation movement opposed a hydel project.", sourceFactIds:["env-cp016-v2-silent-valley"] },
  { qlId:"ENV-016-QL-014", qlName:"Silent Valley and Bishnoi tradition", difficulty:"Medium", stem:"The Khejarli sacrifice is remembered for protection of:", correct:"Khejri trees", distractors:["Coral reefs","Glaciers","Mangrove lagoons"], explanation:"The Khejarli/Bishnoi tradition in Rajasthan is remembered for people sacrificing their lives to protect khejri trees.", sourceFactIds:["env-cp016-v2-bishnoi"] },
  { qlId:"ENV-016-QL-014", qlName:"Silent Valley and Bishnoi tradition", difficulty:"Hard", stem:"Which set is correctly matched?", correct:"Silent Valley—Kerala; Khejarli/Bishnoi—Rajasthan", distractors:["Silent Valley—Rajasthan; Khejarli—Kerala","Silent Valley—Karnataka; Khejarli—Assam","Silent Valley—Assam; Khejarli—Uttarakhand"], explanation:"Silent Valley is in Kerala, while the Khejarli/Bishnoi tree-protection tradition is rooted in Rajasthan.", sourceFactIds:["env-cp016-v2-silent-valley","env-cp016-v2-bishnoi"] },

  { qlId:"ENV-016-QL-015", qlName:"Indian environmental movements integrated", difficulty:"Easy", stem:"Which movement is linked with tree hugging as a form of protest?", correct:"Chipko movement", distractors:["National Water Mission","Project Tiger","EIA Notification"], explanation:"Chipko became widely known for villagers embracing trees to prevent them from being cut.", sourceFactIds:["env-cp016-v2-chipko"] },
  { qlId:"ENV-016-QL-015", qlName:"Indian environmental movements integrated", difficulty:"Easy", stem:"Which pair contains two citizen-led environmental protection movements?", correct:"Chipko and Save Silent Valley", distractors:["Project Tiger and EIA","NAPCC and Project Elephant","CPCB and NTCA"], explanation:"Chipko and Save Silent Valley are both major citizen-led environmental protection movements in India.", sourceFactIds:["env-cp016-v2-chipko","env-cp016-v2-silent-valley"] },
  { qlId:"ENV-016-QL-015", qlName:"Indian environmental movements integrated", difficulty:"Medium", stem:"Which movement-state pair is correct?", correct:"Appiko — Karnataka", distractors:["Chipko — Kerala","Silent Valley — Rajasthan","Khejarli — Assam"], explanation:"Appiko began in Karnataka; the other movement-state pairings are incorrect.", sourceFactIds:["env-cp016-v2-appiko"] },
  { qlId:"ENV-016-QL-015", qlName:"Indian environmental movements integrated", difficulty:"Hard", stem:"Which sequence is fully correct?", correct:"Chipko—tree protection; Appiko—Karnataka; Silent Valley—Kerala", distractors:["Chipko—EIA; Appiko—Assam; Silent Valley—Rajasthan","Chipko—tiger census; Appiko—Kerala; Silent Valley—Karnataka","Chipko—solar mission; Appiko—Rajasthan; Silent Valley—Assam"], explanation:"The sequence correctly links Chipko with tree protection, Appiko with Karnataka and Silent Valley with Kerala.", sourceFactIds:["env-cp016-v2-chipko","env-cp016-v2-appiko","env-cp016-v2-silent-valley"] },
]);

export const ENV_CP016_REMEDIATION_REVIEW_V2: readonly EnvCp016ReviewQuestion[] = Object.freeze(
  S.map((seed,index) => {
    const correctIndex=index%4;
    const options=[...seed.distractors];
    options.splice(correctIndex,0,seed.correct);
    const sourceIds=[...new Set(seed.sourceFactIds.flatMap((id)=>ENV_CP016_REMEDIATION_FACT_BY_ID_V2.get(id)?.sourceIds ?? []))];
    return Object.freeze({
      questionId:`ENV-CP016-V2-${String(index+49).padStart(3,"0")}`,
      chapterId:"ENV-001" as const,
      cpId:"ENV-CP-016" as const,
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
