import type { KnowledgeV1Difficulty } from "../../types";
import { ENV_CP014_REMEDIATION_FACT_BY_ID_V2 } from "./env-cp014-remediation-facts-v2";
import type { EnvCp014ReviewQuestion } from "./env-cp014-review-types";

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
  { qlId:"ENV-014-QL-013", qlName:"NAPCC fundamentals", difficulty:"Easy", stem:"India released the National Action Plan on Climate Change in:", correct:"2008", distractors:["1992","2002","2015"], explanation:"India released the National Action Plan on Climate Change in 2008 as a national climate-policy framework.", sourceFactIds:["env-cp014-v2-napcc-2008"] },
  { qlId:"ENV-014-QL-013", qlName:"NAPCC fundamentals", difficulty:"Easy", stem:"The original NAPCC framework was built around how many core National Missions?", correct:"Eight", distractors:["Four","Six","Ten"], explanation:"The original NAPCC identified eight core National Missions covering major climate-action areas.", sourceFactIds:["env-cp014-v2-eight-missions"] },
  { qlId:"ENV-014-QL-013", qlName:"NAPCC fundamentals", difficulty:"Medium", stem:"Which statement about NAPCC is correct?", correct:"It is India's national climate-action framework released in 2008", distractors:["It is a wildlife-trade treaty","It is India's main wetland convention","It created the National Green Tribunal"], explanation:"NAPCC is a national climate-policy framework; it is not an international treaty or environmental tribunal law.", sourceFactIds:["env-cp014-v2-napcc-2008"] },
  { qlId:"ENV-014-QL-013", qlName:"NAPCC fundamentals", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"NAPCC — 2008 — eight core National Missions", distractors:["NAPCC — 1973 — Project Tiger","NAPCC — 2006 — EIA Notification","NAPCC — 2010 — National Green Tribunal"], explanation:"The National Action Plan on Climate Change was released in 2008 and originally centred on eight core missions.", sourceFactIds:["env-cp014-v2-napcc-2008","env-cp014-v2-eight-missions"] },

  { qlId:"ENV-014-QL-014", qlName:"Original NAPCC missions", difficulty:"Easy", stem:"Which of the following is an original NAPCC mission?", correct:"National Solar Mission", distractors:["Project Elephant","Project Tiger","National Clean Air Programme"], explanation:"The National Solar Mission is one of the eight original core missions under NAPCC.", sourceFactIds:["env-cp014-v2-solar"] },
  { qlId:"ENV-014-QL-014", qlName:"Original NAPCC missions", difficulty:"Easy", stem:"Which NAPCC mission deals with water?", correct:"National Water Mission", distractors:["National Solar Mission","Green India Mission","National Mission on Strategic Knowledge for Climate Change"], explanation:"The National Water Mission is one of the original core NAPCC missions.", sourceFactIds:["env-cp014-v2-water"] },
  { qlId:"ENV-014-QL-014", qlName:"Original NAPCC missions", difficulty:"Medium", stem:"Which mission is most directly linked with forests and ecosystem restoration?", correct:"National Mission for a Green India", distractors:["National Solar Mission","National Water Mission","National Mission for Enhanced Energy Efficiency"], explanation:"Green India is the NAPCC mission focused on forest and ecosystem-related climate action.", sourceFactIds:["env-cp014-v2-green-india"] },
  { qlId:"ENV-014-QL-014", qlName:"Original NAPCC missions", difficulty:"Hard", stem:"Which set contains only original NAPCC missions?", correct:"Solar Mission, Water Mission, Green India Mission", distractors:["Project Tiger, Project Elephant, Solar Mission","Ramsar Mission, Water Mission, Green India Mission","EIA Mission, Solar Mission, Project Tiger"], explanation:"Solar, Water and Green India are all original NAPCC missions; the other choices mix unrelated programmes.", sourceFactIds:["env-cp014-v2-solar","env-cp014-v2-water","env-cp014-v2-green-india"] },

  { qlId:"ENV-014-QL-015", qlName:"NAPCC mission matching", difficulty:"Easy", stem:"Which mission is linked with improving energy efficiency?", correct:"National Mission for Enhanced Energy Efficiency", distractors:["National Water Mission","Green India Mission","National Mission for Sustainable Agriculture"], explanation:"Enhanced Energy Efficiency is one of the original NAPCC missions and focuses on energy-efficiency measures.", sourceFactIds:["env-cp014-v2-energy-efficiency"] },
  { qlId:"ENV-014-QL-015", qlName:"NAPCC mission matching", difficulty:"Easy", stem:"Which mission is linked with climate-resilient agriculture?", correct:"National Mission for Sustainable Agriculture", distractors:["National Solar Mission","National Water Mission","National Mission on Sustainable Habitat"], explanation:"The National Mission for Sustainable Agriculture is the NAPCC mission focused on agriculture and climate resilience.", sourceFactIds:["env-cp014-v2-agriculture"] },
  { qlId:"ENV-014-QL-015", qlName:"NAPCC mission matching", difficulty:"Medium", stem:"Which mission focuses on knowledge and research for climate change?", correct:"National Mission on Strategic Knowledge for Climate Change", distractors:["National Solar Mission","Green India Mission","National Water Mission"], explanation:"The Strategic Knowledge mission builds climate-related knowledge and research capacity under NAPCC.", sourceFactIds:["env-cp014-v2-knowledge"] },
  { qlId:"ENV-014-QL-015", qlName:"NAPCC mission matching", difficulty:"Hard", stem:"Which set is correctly matched?", correct:"Solar—energy; Water—water management; Green India—forests", distractors:["Solar—elephant corridors; Water—wildlife trade; Green India—ozone","Solar—Ramsar sites; Water—tiger reserves; Green India—EIA","Solar—mercury control; Water—CITES; Green India—hazardous waste"], explanation:"These three NAPCC missions respectively cover solar energy, water management and forest/ecosystem climate action.", sourceFactIds:["env-cp014-v2-solar","env-cp014-v2-water","env-cp014-v2-green-india"] },
]);

export const ENV_CP014_REMEDIATION_REVIEW_V2: readonly EnvCp014ReviewQuestion[] = Object.freeze(
  S.map((seed, index) => {
    const correctIndex = index % 4;
    const options = [...seed.distractors];
    options.splice(correctIndex, 0, seed.correct);
    const sourceIds = [...new Set(seed.sourceFactIds.flatMap((id) => ENV_CP014_REMEDIATION_FACT_BY_ID_V2.get(id)?.sourceIds ?? []))];
    return Object.freeze({
      questionId:`ENV-CP014-V2-${String(index + 49).padStart(3,"0")}`,
      chapterId:"ENV-001" as const,
      cpId:"ENV-CP-014" as const,
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
