export type GeoLnd001Difficulty = "Easy" | "Medium" | "Hard";
export type GeoLnd001Question = Readonly<{
 questionId:string; qlId:string; qlName:string; difficulty:GeoLnd001Difficulty;
 stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
 explanation:string; sourceIds:readonly string[]; sourceFactIds:readonly string[];
 reviewOnly:true; runtimeRegistered:false;
}>;
export function placeOptions(answer:string,distractors:readonly string[],correctIndex:number){
 const options=[...distractors]; options.splice(correctIndex,0,answer); return Object.freeze(options);
}