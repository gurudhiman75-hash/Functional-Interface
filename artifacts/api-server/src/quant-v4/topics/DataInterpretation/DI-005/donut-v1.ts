import { generateDi005FullyVisibleSet, type Di005FullyVisibleSet } from "./fully-visible-pie-v1";

export type Di005DonutExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Di005DonutSet = Omit<Di005FullyVisibleSet,"mode"|"examProfile"> & Readonly<{
  mode:"RING_DONUT_V1";
  examProfile:Di005DonutExamProfile;
}>;

export function generateDi005DonutSet(input:{seed:string;examProfile?:Di005DonutExamProfile}):Di005DonutSet{
  const base=generateDi005FullyVisibleSet({seed:`${input.seed}:donut-semantic`,examProfile:"BANKING_PRELIMS"});
  return {...base,mode:"RING_DONUT_V1",examProfile:input.examProfile??"BANKING_MAINS"};
}
