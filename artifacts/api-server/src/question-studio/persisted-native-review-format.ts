import { createHash } from "node:crypto";
export type NativeReviewQuestion = {stem:string;explanation:string;options:string[];correctIndex:number};
export type PersistedNativeVariant =
  | ({language:"hi"|"pa";status:"verified"} & NativeReviewQuestion)
  | {language:"hi"|"pa";status:"blocked";reason:string};
export type PersistedNativeSnapshot = {
  schemaVersion:1;sourceHash:string;identityHash:string;variants:PersistedNativeVariant[];
  generatedAt:string;sourceVerified:true;
};
const text=(x:unknown)=>typeof x==="string"?x.trim():"";
export function nativeSourceExplanation(value:unknown):string {
  if(typeof value==="string")return value.trim();
  if(Array.isArray(value))return value.map(text).filter(Boolean).join("\n");
  const o=value&&typeof value==="object"?value as Record<string,unknown>:{};
  if(Array.isArray(o.lines))return o.lines.map(text).filter(Boolean).join("\n");
  if(Array.isArray(o.visibleLines))return [...o.visibleLines.map(text),text(o.answerLine)].filter(Boolean).join("\n");
  return [text(o.method),...(Array.isArray(o.steps)?o.steps.map(text):[]),
    text(o.conclusion||o.finalAnswer)].filter(Boolean).join("\n");
}
export function nativeSourceQuestion(payload:Record<string,unknown>):NativeReviewQuestion {
  return {
    stem:text(payload.text)||text(payload.stem),
    explanation:nativeSourceExplanation(payload.explanation),
    options:Array.isArray(payload.options) ? payload.options.map(x=>
      typeof x==="string"?x.trim():x&&typeof x==="object"&&"text" in x?text(x.text):"") : [],
    correctIndex:Number(payload.correctIndex??payload.correct),
  };
}
export function nativeSourceHash(source:NativeReviewQuestion):string {
  return createHash("sha256").update(JSON.stringify([
    source.stem,source.explanation,source.options,source.correctIndex,
  ])).digest("hex");
}
export function nativeIdentityHash(payload:Record<string,unknown>):string {
  return createHash("sha256").update(JSON.stringify([
    text(payload.packageId),
    text(payload.canonicalProblemId||payload.selectedCpId||payload.cpId),
    text(payload.questionLanguageId||payload.qlId),
    text(payload.seed),text(payload.difficulty),text(payload.language),
  ])).digest("hex");
}
export function readPersistedNativeSnapshot(payload:Record<string,unknown>):PersistedNativeSnapshot|null {
  const raw=payload.nativeReviewSnapshot;
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return null;
  const snap=raw as Partial<PersistedNativeSnapshot>;
  const source=nativeSourceQuestion(payload);
  if(!source.stem||!source.explanation||source.options.length<2 ||
    !Number.isInteger(source.correctIndex)||source.correctIndex<0||
    source.correctIndex>=source.options.length||
    snap.schemaVersion!==1||snap.sourceVerified!==true||
    snap.sourceHash!==nativeSourceHash(source)||
    snap.identityHash!==nativeIdentityHash(payload)||
    !Array.isArray(snap.variants)||snap.variants.length<1||snap.variants.length>2)return null;
  const languages=new Set<string>();
  for(const v of snap.variants){
    if(!v||!["hi","pa"].includes(v.language)||languages.has(v.language))return null;
    languages.add(v.language);
    if(v.status==="blocked"){
      if(typeof v.reason!=="string"||!v.reason.trim())return null;
    }else if(v.status==="verified"){
      if(typeof v.stem!=="string"||!v.stem.trim()||
         typeof v.explanation!=="string"||!v.explanation.trim()||
         !Array.isArray(v.options)||v.options.length!==source.options.length||
         !v.options.every(option=>typeof option==="string"&&option.trim())||
         v.correctIndex!==source.correctIndex||
         v.stem.trim()===source.stem.trim())return null;
    }else return null;
  }
  return snap as PersistedNativeSnapshot;
}
