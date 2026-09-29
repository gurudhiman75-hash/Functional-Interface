export type GeoPln001Difficulty = "Easy" | "Medium" | "Hard";
export type GeoPln001Question = Readonly<{
 questionId:string; qlId:string; qlName:string; difficulty:GeoPln001Difficulty;
 stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
 explanation:string; sourceIds:readonly string[]; sourceFactIds:readonly string[];
 reviewOnly:true; runtimeRegistered:false;
}>;
export function placeOptions(answer:string,distractors:readonly string[],correctIndex:number){
 const options=[...distractors]; options.splice(correctIndex,0,answer); return Object.freeze(options);
}