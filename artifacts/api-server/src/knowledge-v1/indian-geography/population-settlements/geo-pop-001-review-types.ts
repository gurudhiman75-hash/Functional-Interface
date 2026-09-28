export type GeoPop001Difficulty = "Easy" | "Medium" | "Hard";
export type GeoPop001Question = Readonly<{
  questionId:string; qlId:string; qlName:string; difficulty:GeoPop001Difficulty;
  stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceIds:readonly string[]; sourceFactIds:readonly string[];
  reviewOnly:true; runtimeRegistered:false;
}>;
export const GEO_POP_001_SOURCE_CATALOG=Object.freeze({
  NCERT12_POPULATION:"NCERT-CLASS12-INDIA-PEOPLE-ECONOMY-POPULATION",
  NCERT12_SETTLEMENTS:"NCERT-CLASS12-INDIA-PEOPLE-ECONOMY-HUMAN-SETTLEMENTS",
  CENSUS2011:"CENSUS-OF-INDIA-2011-PRIMARY-CENSUS-ABSTRACT",
} as const);
export const GEO_POP_001_FOUNDATION_SOURCE_IDS=Object.freeze([
  GEO_POP_001_SOURCE_CATALOG.NCERT12_POPULATION,
  GEO_POP_001_SOURCE_CATALOG.CENSUS2011,
]);
export function placeGeoPopOptions(answer:string,distractors:readonly string[],correctIndex:number){
 const options=[...distractors]; options.splice(correctIndex,0,answer); return Object.freeze(options);
}