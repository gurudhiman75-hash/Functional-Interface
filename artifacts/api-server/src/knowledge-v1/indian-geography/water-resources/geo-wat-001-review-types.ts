export type GeoWat001Difficulty = "Easy" | "Medium" | "Hard";
export type GeoWat001Question = Readonly<{
  questionId:string; qlId:string; qlName:string; difficulty:GeoWat001Difficulty;
  stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceIds:readonly string[]; sourceFactIds:readonly string[];
  reviewOnly:true; runtimeRegistered:false;
}>;
export const GEO_WAT_001_SOURCE_CATALOG=Object.freeze({
  NCERT10_WATER:"NCERT-CLASS10-GEOGRAPHY-WATER-RESOURCES",
  NCERT12_WATER:"NCERT-CLASS12-INDIA-PEOPLE-ECONOMY-WATER-RESOURCES",
  CWC:"CENTRAL-WATER-COMMISSION-INDIA",
  CEA:"CENTRAL-ELECTRICITY-AUTHORITY-HYDRO",
} as const);
export const GEO_WAT_001_FOUNDATION_SOURCE_IDS=Object.freeze([
 GEO_WAT_001_SOURCE_CATALOG.NCERT10_WATER,
 GEO_WAT_001_SOURCE_CATALOG.NCERT12_WATER,
]);
export function placeGeoWatOptions(answer:string,distractors:readonly string[],correctIndex:number){
 const options=[...distractors]; options.splice(correctIndex,0,answer); return Object.freeze(options);
}