import{deterministicIndex}from"../../../../core/deterministic";
import{ENG008_CP001_PASSAGES_V1}from"../CP001/eng-008-cp001-authorities-v1";
import{generateEng008Cp001QuestionV1}from"../CP001/eng-008-cp001-v1";
import{ENG008_CP002_PASSAGES_V1}from"../CP002/eng-008-cp002-authorities-v1";
import{generateEng008Cp002QuestionV1}from"../CP002/eng-008-cp002-v1";
import{ENG008_CP003_PASSAGES_V1}from"../CP003/eng-008-cp003-authorities-v1";
import{generateEng008Cp003QuestionV1}from"../CP003/eng-008-cp003-v1";
import{ENG008_CP004_PASSAGES_V1}from"../CP004/eng-008-cp004-authorities-v1";
import{generateEng008Cp004QuestionV1}from"../CP004/eng-008-cp004-v1";
import{ENG008_CP005_PASSAGES_V1}from"../CP005/eng-008-cp005-authorities-v1";
import{generateEng008Cp005QuestionV1}from"../CP005/eng-008-cp005-v1";
import{ENG008_CP007_AUTHORITIES_V1,eng008Cp007MaskedPassageV1}from"../CP007/eng-008-cp007-authorities-v1";
import{generateEng008Cp007QuestionV1}from"../CP007/eng-008-cp007-v1";

export type Eng008SetProfile="SSC_FOUNDATION_RC"|"SSC_EDITORIAL_CURRENT_AFFAIRS_RC"|"BANKING_PRELIMS_RC"|"BANKING_MAINS_RC"|"RESEARCH_SURVEY_REPORT_RC";
export interface GenerateEng008Cp006SetV1Input{seed:string;profile:Eng008SetProfile;questionCount?:number;passageId?:string;}

const configs={
 SSC_FOUNDATION_RC:{defaultCount:6,allowed:[5,6],passages:ENG008_CP001_PASSAGES_V1,core:["RC-F01","RC-F02","RC-F03","RC-F06"],optional:["RC-F04","RC-F05"]},
 SSC_EDITORIAL_CURRENT_AFFAIRS_RC:{defaultCount:8,allowed:[6,8],passages:ENG008_CP002_PASSAGES_V1,core:["RC2-F01","RC2-F02","RC2-F03","RC2-F04","RC2-F05","RC2-F06"],optional:["RC2-F07","RC2-F08"]},
 BANKING_PRELIMS_RC:{defaultCount:9,allowed:[8,9,10],passages:ENG008_CP003_PASSAGES_V1,core:["BP-F01","BP-F02","BP-F03","BP-F04","BP-F05","BP-F07","BP-F08"],optional:["BP-F06","BP-F09","BP-F10"]},
 BANKING_MAINS_RC:{defaultCount:8,allowed:[8,10],passages:ENG008_CP004_PASSAGES_V1,core:["BM-F01","BM-F02","BM-F03","BM-F04","BM-F05","BM-F06","BM-F07","BM-F08"],optional:["BM-F09","BM-F10"]},
 RESEARCH_SURVEY_REPORT_RC:{defaultCount:8,allowed:[6,8],passages:ENG008_CP005_PASSAGES_V1,core:["RS-F01","RS-F02","RS-F03","RS-F04","RS-F05","RS-F06"],optional:["RS-F07","RS-F08"]}
}as const;

function rotate<T>(xs:readonly T[],seed:string){if(!xs.length)return[];const n=deterministicIndex(seed,xs.length);return[...xs.slice(n),...xs.slice(0,n)];}
function selectedFamilies(profile:Eng008SetProfile,count:number,seed:string){
 const cfg=configs[profile];
 if(profile==="BANKING_PRELIMS_RC"){
  const legacyOptional=rotate(["BP-F06","BP-F09"] as const,`${seed}:optional`);
  return count===10?[...cfg.core,...legacyOptional,"BP-F10"]:[...cfg.core,...legacyOptional].slice(0,count);
 }
 const all=[...cfg.core,...rotate(cfg.optional,`${seed}:optional`)];return all.slice(0,count);
}
function difficultyFor(profile:Eng008SetProfile,family:string){
 if(profile==="BANKING_PRELIMS_RC")return family==="BP-F01"||family==="BP-F05"||family==="BP-F06"?"easy":"medium";
 if(profile==="BANKING_MAINS_RC")return family==="BM-F01"||family==="BM-F05"||family==="BM-F09"?"medium":"hard";
 if(profile==="RESEARCH_SURVEY_REPORT_RC")return ["RS-F01","RS-F02","RS-F03","RS-F08"].includes(family)?"medium":"hard";
 if(profile==="SSC_FOUNDATION_RC")return family==="RC-F01"||family==="RC-F05"?"easy":"medium";
 return family==="RC2-F01"||family==="RC2-F08"?"easy":family==="RC2-F04"||family==="RC2-F06"?"hard":"medium";
}
function generate(profile:Eng008SetProfile,passageId:string,family:string,seed:string){
 const d=difficultyFor(profile,family) as any;
 if(profile==="SSC_FOUNDATION_RC")return generateEng008Cp001QuestionV1({seed,difficulty:d,familyId:family as any,passageId});
 if(profile==="SSC_EDITORIAL_CURRENT_AFFAIRS_RC")return generateEng008Cp002QuestionV1({seed,difficulty:d,familyId:family as any,authorityId:(ENG008_CP002_PASSAGES_V1.find(p=>p.id===passageId)!.questions.find(q=>q.familyId===family)!.id)});
 if(profile==="BANKING_PRELIMS_RC"){
  if(family==="BP-F10")return generateEng008Cp007QuestionV1({seed,authorityId:ENG008_CP007_AUTHORITIES_V1.find(a=>a.passageId===passageId)!.id});
  return generateEng008Cp003QuestionV1({seed,difficulty:d,familyId:family as any,authorityId:(ENG008_CP003_PASSAGES_V1.find(p=>p.id===passageId)!.questions.find(q=>q.familyId===family)!.id)});
 }
 if(profile==="BANKING_MAINS_RC")return generateEng008Cp004QuestionV1({seed,difficulty:d,familyId:family as any,authorityId:(ENG008_CP004_PASSAGES_V1.find(p=>p.id===passageId)!.questions.find(q=>q.familyId===family)!.id)});
 return generateEng008Cp005QuestionV1({seed,difficulty:d,familyId:family as any,authorityId:(ENG008_CP005_PASSAGES_V1.find(p=>p.id===passageId)!.questions.find(q=>q.familyId===family)!.id)});
}
export function generateEng008Cp006SetV1(input:GenerateEng008Cp006SetV1Input){
 const cfg=configs[input.profile],count=input.questionCount??cfg.defaultCount;
 if(!(cfg.allowed as readonly number[]).includes(count))throw new Error(`${input.profile} supports set sizes ${cfg.allowed.join(", ")}`);
 const candidates=input.passageId?cfg.passages.filter(p=>p.id===input.passageId):cfg.passages;
 if(!candidates.length)throw new Error("No passage matches requested ENG-008 CP006 set");
 const passage=candidates[deterministicIndex(`${input.seed}:passage`,candidates.length)]!;
 const families=selectedFamilies(input.profile,count,input.seed);
 const questions=families.map((family,i)=>generate(input.profile,passage.id,family,`${input.seed}:q:${i}:${family}`));
 if(new Set(questions.map(q=>q.metadata.passageId)).size!==1)throw new Error("CP006 set crossed passage boundary");
 const wordFitAuthority=input.profile==="BANKING_PRELIMS_RC"&&families.includes("BP-F10" as any)?ENG008_CP007_AUTHORITIES_V1.find(a=>a.passageId===passage.id):undefined;
 const renderedPassage=wordFitAuthority?eng008Cp007MaskedPassageV1(wordFitAuthority):passage.text;
 return{setId:`ENG-008-CP006-V1:${input.profile}:${passage.id}:${input.seed}`,profile:input.profile,passageId:passage.id,passage:renderedPassage,questionCount:questions.length,questions,reviewOnly:true as const};
}
export const ENG008_CP006_SET_PROFILES_V1=Object.keys(configs) as Eng008SetProfile[];
