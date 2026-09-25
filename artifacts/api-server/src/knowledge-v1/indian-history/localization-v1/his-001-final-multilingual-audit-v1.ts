import "./his-cp001-localization-audit-v1";
import "./his-cp002-localization-audit-v1";
import "./his-cp003-localization-audit-v1";
import "./his-cp004-localization-audit-v1";
import "./his-cp005-localization-audit-v1";
import "./his-cp006-localization-audit-v1";
import "./his-cp007-localization-audit-v1";
import "./his-cp008-localization-audit-v1";
import "./his-cp009-localization-audit-v1";
import "./his-cp010-localization-audit-v1";
import "./his-cp011-localization-audit-v1";
import "./his-cp012-localization-audit-v1";
import "./his-cp013-localization-audit-v1";
import "./his-cp014-localization-audit-v1";
import "./his-cp015-localization-audit-v1";
import "./his-cp016-localization-audit-v1";
import "./his-cp017-localization-audit-v1";
import "./his-cp018-localization-audit-v1";
import "./his-cp019-localization-audit-v1";
import "./his-cp020-localization-audit-v1";
import "./his-cp021-localization-audit-v1";
import "./his-cp022-localization-audit-v1";
import "./his-cp023-localization-audit-v1";
import "./his-cp024-localization-audit-v1";
import {
  HIS_001_FINAL_CP_IDS_V1,
  HIS_001_FINAL_LANGUAGES_V1,
  HIS_001_FINAL_MULTILINGUAL_CORPUS_V1,
  HIS_001_FINAL_QL_IDS_V1,
} from "./his-001-final-multilingual-corpus-v1";
import type { HisLocalizedQuestionV1 } from "./his-localization-types-v1";

const fail=(condition:boolean,message:string)=>{if(!condition)throw new Error(message);};

function expectedFreeze(cpId:string):string{
  const match=cpId.match(/HIS-CP-(\d{3})/);
  const cp=Number(match?.[1]??0);
  if(cp>=1&&cp<=16)return "HIS-001-ENGLISH-FREEZE-V1";
  if(cp>=17&&cp<=19)return "HIS-001-ENGLISH-FREEZE-V3";
  if(cp>=20&&cp<=22)return "HIS-001-ENGLISH-FREEZE-V4";
  if(cp>=23&&cp<=24)return "HIS-001-ENGLISH-FREEZE-V5";
  throw new Error("Unexpected History CP "+cpId);
}

const english=HIS_001_FINAL_MULTILINGUAL_CORPUS_V1.en;
fail(english.length===1434,"HIS-001 English final corpus must contain 1434 questions; found "+english.length);
fail(HIS_001_FINAL_CP_IDS_V1.length===24,"HIS-001 final corpus must contain 24 CPs");
fail(new Set(HIS_001_FINAL_CP_IDS_V1).size===24,"HIS-001 CP IDs must be unique");
fail(new Set(english.map(q=>q.questionId)).size===1434,"HIS-001 English question IDs must be unique");
const uniqueFactIds=new Set(english.flatMap(q=>q.sourceFactIds));
fail(uniqueFactIds.size===1379,"HIS-001 final corpus must expose 1379 unique canonical fact IDs; found "+uniqueFactIds.size);
fail(new Set(english.map(q=>q.cpId)).size===24,"HIS-001 English corpus must expose 24 CPs");
fail(HIS_001_FINAL_QL_IDS_V1.length===239,"HIS-001 must expose 239 permanent QLs; found "+HIS_001_FINAL_QL_IDS_V1.length);


for(const qlId of HIS_001_FINAL_QL_IDS_V1){
  for(const locale of HIS_001_FINAL_LANGUAGES_V1){
    const count=HIS_001_FINAL_MULTILINGUAL_CORPUS_V1[locale].filter(q=>q.qlId===qlId).length;
    fail(count===6,qlId+"/"+locale+": expected six frozen questions; found "+count);
  }
}

for(const cpId of HIS_001_FINAL_CP_IDS_V1){
  fail(english.some(q=>q.cpId===cpId),cpId+": missing from final English corpus");
}

for(const locale of HIS_001_FINAL_LANGUAGES_V1){
  const corpus=HIS_001_FINAL_MULTILINGUAL_CORPUS_V1[locale];
  fail(corpus.length===1434,"HIS-001 "+locale+" final corpus must contain 1434 questions; found "+corpus.length);
  fail(new Set(corpus.map(q=>q.questionId)).size===1434,"HIS-001 "+locale+" question IDs must be unique");
  fail(new Set(corpus.map(q=>q.cpId)).size===24,"HIS-001 "+locale+" corpus must expose 24 CPs");
  fail(new Set(corpus.map(q=>q.qlId)).size===HIS_001_FINAL_QL_IDS_V1.length,"HIS-001 "+locale+" QL set mismatch");

  corpus.forEach((q:HisLocalizedQuestionV1,index:number)=>{
    const en=english[index]!;
    fail(q.chapterId==="HIS-001",q.questionId+": chapter mismatch");
    fail(q.reviewOnly===true&&q.runtimeRegistered===false,q.questionId+": source lifecycle mismatch");
    fail(q.options.length===4&&new Set(q.options).size===4,q.questionId+": invalid options");
    fail(q.options[q.correctIndex]===q.canonicalAnswer,q.questionId+": answer/index mismatch");
    fail(q.sourceIds.length>0,q.questionId+": missing source IDs");
    fail(q.sourceFactIds.length>0,q.questionId+": missing source fact IDs");
    fail(q.localizationV1.englishFreeze===expectedFreeze(q.cpId),q.questionId+": freeze lineage mismatch");

    if(locale==="en"){
      fail(q.questionId===en.questionId,q.questionId+": English identity drift");
    }else{
      fail(q.localizationV1.englishQuestionId===en.questionId,q.questionId+": English source identity mismatch");
      fail(q.cpId===en.cpId,q.questionId+": CP parity mismatch");
      fail(q.qlId===en.qlId,q.questionId+": QL parity mismatch");
      fail(q.difficulty===en.difficulty,q.questionId+": difficulty parity mismatch");
      fail(q.correctIndex===en.correctIndex,q.questionId+": correct-index parity mismatch");
      fail(JSON.stringify(q.sourceIds)===JSON.stringify(en.sourceIds),q.questionId+": source parity mismatch");
      fail(JSON.stringify(q.sourceFactIds)===JSON.stringify(en.sourceFactIds),q.questionId+": source-fact parity mismatch");
    }
  });
}

for(let i=0;i<english.length;i+=1){
  const en=english[i]!;
  const hi=HIS_001_FINAL_MULTILINGUAL_CORPUS_V1.hi[i]!;
  const pa=HIS_001_FINAL_MULTILINGUAL_CORPUS_V1.pa[i]!;
  fail(hi.localizationV1.englishQuestionId===en.questionId,en.questionId+": Hindi ordering mismatch");
  fail(pa.localizationV1.englishQuestionId===en.questionId,en.questionId+": Punjabi ordering mismatch");
}

const totalSurfaces=HIS_001_FINAL_LANGUAGES_V1.reduce(
  (sum,locale)=>sum+HIS_001_FINAL_MULTILINGUAL_CORPUS_V1[locale].length,
  0,
);
fail(totalSurfaces===4302,"HIS-001 final multilingual surface count must be 4302; found "+totalSurfaces);

console.log(
  "[HIS-001-FINAL-MULTILINGUAL] PASS questionsPerLanguage=1434 surfaces=4302 CPs=24 QLs="+
  HIS_001_FINAL_QL_IDS_V1.length+
  " canonicalFacts="+uniqueFactIds.size+" freezes=V1/V3/V4/V5",
);
