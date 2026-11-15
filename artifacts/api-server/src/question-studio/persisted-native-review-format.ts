import { createHash } from "node:crypto";
export type NativeReviewQuestion = {stem:string;explanation:string;options:string[];correctIndex:number};
export type PersistedNativeVariant =
  | ({language:"hi"|"pa";status:"verified"} & NativeReviewQuestion)
  | {language:"hi"|"pa";status:"blocked";reason:string};
export type PersistedNativeSnapshot = {
  schemaVersion:1;sourceHash:string;variants:PersistedNativeVariant[];
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
export function readPersistedNativeSnapshot(payload:Record<string,unknown>):PersistedNativeSnapshot|null {
  const raw=payload.nativeReviewSnapshot;
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return null;
  const snap=raw as Partial<PersistedNativeSnapshot>;
  if(snap.schemaVersion!==1||snap.sourceVerified!==true||
     snap.sourceHash!==nativeSourceHash(nativeSourceQuestion(payload))||
     !Array.isArray(snap.variants))return null;
  if(!snap.variants.every(v=>v && ["hi","pa"].includes(v.language) &&
      (v.status==="blocked" || v.status==="verified" &&
       typeof v.stem==="string"&&typeof v.explanation==="string"&&
       Array.isArray(v.options)&&Number.isInteger(v.correctIndex))))return null;
  return snap as PersistedNativeSnapshot;
}
