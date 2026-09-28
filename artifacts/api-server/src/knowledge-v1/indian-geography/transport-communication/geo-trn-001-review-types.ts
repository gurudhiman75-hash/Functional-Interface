export type GeoTrn001Difficulty = "Easy" | "Medium" | "Hard";
export type GeoTrn001Question = Readonly<{
  questionId:string; qlId:string; qlName:string; difficulty:GeoTrn001Difficulty;
  stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceIds:readonly string[]; sourceFactIds:readonly string[];
  reviewOnly:true; runtimeRegistered:false;
}>;
export const GEO_TRN_001_SOURCE_CATALOG=Object.freeze({
  NCERT_CLASS12_TRANSPORT:"NCERT-CLASS12-INDIA-PEOPLE-ECONOMY-TRANSPORT-COMMUNICATION",
  MORTH:"MINISTRY-ROAD-TRANSPORT-HIGHWAYS-INDIA",
  NHAI:"NATIONAL-HIGHWAYS-AUTHORITY-OF-INDIA",
  BRO:"BORDER-ROADS-ORGANISATION-INDIA",
  INDIAN_RAILWAYS:"MINISTRY-OF-RAILWAYS-INDIA",
  DFCCIL:"DEDICATED-FREIGHT-CORRIDOR-CORPORATION-INDIA",
} as const);
export const GEO_TRN_001_FOUNDATION_SOURCE_IDS=Object.freeze([
 GEO_TRN_001_SOURCE_CATALOG.NCERT_CLASS12_TRANSPORT,
]);
export function placeGeoTrnOptions(answer:string,distractors:readonly string[],correctIndex:number){
 const options=[...distractors]; options.splice(correctIndex,0,answer); return Object.freeze(options);
}