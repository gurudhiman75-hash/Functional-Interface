import { generateDi005FullyVisibleSet } from "./fully-visible-pie-v1";

export type Di005RingExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";

export function generateDi005RingSet(input:{seed:string;examProfile?:Di005RingExamProfile}){
  const examProfile=input.examProfile??"BANKING_MAINS";
  const base=generateDi005FullyVisibleSet({seed:input.seed,examProfile:"BANKING_PRELIMS"});
  return {
    packageId:"DI-005" as const,
    mode:"RING_DONUT_V1" as const,
    seed:input.seed,
    examProfile,
    stimulus:{...base.stimulus,description:"Fully-labelled ring/donut chart with five visible sector percentages."},
    questions:base.questions,
  };
}
