import type { KnowledgeV1Difficulty } from "../../types";
import { ENV_CP008_REMEDIATION_FACT_BY_ID_V2 } from "./env-cp008-remediation-facts-v2";
import type { EnvCp008ReviewQuestion } from "./env-cp008-review-types";

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
  { qlId:"ENV-008-QL-013", qlName:"Project Elephant basics", difficulty:"Easy", stem:"Project Elephant was launched in India in:", correct:"1991-92", distractors:["1973","1986","2006"], explanation:"Project Elephant was launched in 1991-92 as a Centrally Sponsored Scheme for elephant conservation.", sourceFactIds:["env-cp008-v2-elephant-launch"] },
  { qlId:"ENV-008-QL-013", qlName:"Project Elephant basics", difficulty:"Easy", stem:"Which programme focuses specifically on elephant conservation in India?", correct:"Project Elephant", distractors:["Project Tiger","Green India Mission","National Water Mission"], explanation:"Project Elephant is the national programme focused on elephants, their habitats and related conservation needs.", sourceFactIds:["env-cp008-v2-elephant-protection"] },
  { qlId:"ENV-008-QL-013", qlName:"Project Elephant basics", difficulty:"Medium", stem:"Which is a core objective of Project Elephant?", correct:"Protecting elephants, habitats and corridors", distractors:["Regulating international wildlife trade","Monitoring urban air quality","Designating Ramsar Sites"], explanation:"The programme supports protection of elephants together with the habitats and movement corridors they depend on.", sourceFactIds:["env-cp008-v2-elephant-protection"] },
  { qlId:"ENV-008-QL-013", qlName:"Project Elephant basics", difficulty:"Hard", stem:"Which set best represents Project Elephant's main conservation scope?", correct:"Elephants, habitats, corridors and conflict mitigation", distractors:["Tigers, core zones, ozone and wetlands","Zoos, air quality, rivers and glaciers","Solar power, water use, forests and transport"], explanation:"Project Elephant combines species protection with habitat, corridor and human-elephant conflict measures.", sourceFactIds:["env-cp008-v2-elephant-protection","env-cp008-v2-elephant-conflict"] },

  { qlId:"ENV-008-QL-014", qlName:"Elephant corridors and conflict", difficulty:"Easy", stem:"Traditional movement routes connecting elephant habitats are called:", correct:"Elephant corridors", distractors:["Biosphere cores","Ecotones","Ramsar zones"], explanation:"Elephant corridors maintain connectivity between habitats used by moving elephant populations.", sourceFactIds:["env-cp008-v2-elephant-corridor"] },
  { qlId:"ENV-008-QL-014", qlName:"Elephant corridors and conflict", difficulty:"Easy", stem:"Reducing human-elephant conflict is an objective of:", correct:"Project Elephant", distractors:["Montreal Protocol","CITES Secretariat","National Solar Mission"], explanation:"Human-elephant conflict mitigation is one of the stated objectives of Project Elephant.", sourceFactIds:["env-cp008-v2-elephant-conflict"] },
  { qlId:"ENV-008-QL-014", qlName:"Elephant corridors and conflict", difficulty:"Medium", stem:"Why are elephant corridors important for conservation?", correct:"They help connect habitats used for elephant movement", distractors:["They replace all protected areas","They prevent ecological succession","They regulate hazardous-waste trade"], explanation:"Corridors help preserve landscape connectivity so elephants can move between suitable habitat areas.", sourceFactIds:["env-cp008-v2-elephant-corridor"] },
  { qlId:"ENV-008-QL-014", qlName:"Elephant corridors and conflict", difficulty:"Hard", stem:"Which action best fits a landscape approach under Project Elephant?", correct:"Protect habitat connectivity while reducing human-elephant conflict", distractors:["Monitor only captive zoo populations","Focus only on international wildlife trade","Replace corridors with isolated enclosures"], explanation:"Project Elephant combines habitat and corridor conservation with measures to reduce conflict between people and elephants.", sourceFactIds:["env-cp008-v2-elephant-protection","env-cp008-v2-elephant-corridor","env-cp008-v2-elephant-conflict"] },

  { qlId:"ENV-008-QL-015", qlName:"Project Elephant integrated conservation", difficulty:"Easy", stem:"Which Project Elephant objective concerns elephants kept under human care?", correct:"Welfare of captive elephants", distractors:["Ramsar listing","Ozone-layer monitoring","Forest fire forecasting"], explanation:"The programme includes welfare of captive elephants along with conservation of wild elephants and their habitats.", sourceFactIds:["env-cp008-v2-elephant-captive"] },
  { qlId:"ENV-008-QL-015", qlName:"Project Elephant integrated conservation", difficulty:"Easy", stem:"Which pair is correctly matched?", correct:"Project Elephant — habitat and corridor conservation", distractors:["Project Elephant — ozone protection","Project Elephant — wetland designation","Project Elephant — hazardous-waste regulation"], explanation:"Habitat and corridor protection are central conservation functions under Project Elephant.", sourceFactIds:["env-cp008-v2-elephant-protection"] },
  { qlId:"ENV-008-QL-015", qlName:"Project Elephant integrated conservation", difficulty:"Medium", stem:"Which two concerns are both covered by Project Elephant?", correct:"Habitat connectivity and human-elephant conflict", distractors:["Acid rain and ozone depletion","Ramsar listing and EIA clearance","Air standards and mercury control"], explanation:"The programme works on landscape connectivity while also addressing conflict between elephants and people.", sourceFactIds:["env-cp008-v2-elephant-corridor","env-cp008-v2-elephant-conflict"] },
  { qlId:"ENV-008-QL-015", qlName:"Project Elephant integrated conservation", difficulty:"Hard", stem:"Which statement best distinguishes Project Elephant from a purely ex-situ programme?", correct:"It protects wild elephant landscapes as well as addressing captive-elephant welfare", distractors:["It works only through zoos","It deals only with captive breeding","It excludes habitat and corridor protection"], explanation:"Project Elephant is mainly landscape-based conservation, while also including welfare measures for captive elephants.", sourceFactIds:["env-cp008-v2-elephant-protection","env-cp008-v2-elephant-captive"] },
]);

export const ENV_CP008_REMEDIATION_REVIEW_V2: readonly EnvCp008ReviewQuestion[] = Object.freeze(
  S.map((seed, index) => {
    const correctIndex = index % 4;
    const options = [...seed.distractors];
    options.splice(correctIndex, 0, seed.correct);
    const sourceIds = [...new Set(seed.sourceFactIds.flatMap((id) => ENV_CP008_REMEDIATION_FACT_BY_ID_V2.get(id)?.sourceIds ?? []))];
    return Object.freeze({
      questionId: `ENV-CP008-V2-${String(index + 49).padStart(3, "0")}`,
      chapterId:"ENV-001" as const,
      cpId:"ENV-CP-008" as const,
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
