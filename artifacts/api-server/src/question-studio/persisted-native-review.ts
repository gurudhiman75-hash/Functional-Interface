import { createHash } from "node:crypto";
import { nativeExplanationText, nativeLocalizedQuestion, assertNativeEnglishSourceParity,
         assertNativeLocalizedAnswerParity, type NativeLocalizedQuestion } from "./native-linked-localization";
import { listQuestionStudioPackages } from "./engine-registry";

export type PersistedNativeVariant =
  | ({language:"hi"|"pa";status:"verified"} & NativeLocalizedQuestion)
  | {language:"hi"|"pa";status:"blocked";reason:string};
export type PersistedNativeSnapshot = {
  schemaVersion:1;
  sourceHash:string;
  variants:PersistedNativeVariant[];
  generatedAt:string;
  sourceVerified:true;
};
function string(value:unknown) {return typeof value==="string"?value.trim():"";}
export function nativeSourceQuestion(payload:Record<string,unknown>):NativeLocalizedQuestion {
  return {
    stem:string(payload.text)||string(payload.stem),
    explanation:nativeExplanationText(payload.explanation),
    options:Array.isArray(payload.options) ? payload.options.map(x=>typeof x==="string"?x.trim():
      x && typeof x==="object" && "text" in x?string(x.text):"") : [],
    correctIndex:Number(payload.correctIndex??payload.correct),
  };
}
export function nativeSourceHash(source:NativeLocalizedQuestion):string {
  return createHash("sha256").update(JSON.stringify([
    source.stem,source.explanation,source.options,source.correctIndex,
  ])).digest("hex");
}
export function readPersistedNativeSnapshot(payload:Record<string,unknown>):PersistedNativeSnapshot|null {
  const source=nativeSourceQuestion(payload);
  const raw=payload.nativeReviewSnapshot;
  if(!raw||typeof raw!=="object")return null;
  const snap=raw as Partial<PersistedNativeSnapshot>;
  if(snap.schemaVersion!==1||snap.sourceVerified!==true||
    snap.sourceHash!==nativeSourceHash(source)||!Array.isArray(snap.variants))return null;
  if(!snap.variants.every(v=>v&&["hi","pa"].includes(v.language) &&
    (v.status==="blocked" || v.status==="verified")))return null;
  return snap as PersistedNativeSnapshot;
}
/** Called during generation, before persisting the immutable English version.
 * A broken native engine is visible as a blocked locale, never mislinked.
 * Source parity failure returns no snapshot at all. */
export async function prepareNativeReviewSnapshot(
  payload:Record<string,unknown>, languages: readonly ("hi"|"pa")[]=["hi","pa"],
):Promise<PersistedNativeSnapshot|null> {
  const packageId=string(payload.packageId);
  const pkg=listQuestionStudioPackages().find(p=>p.enabled&&p.packageId===packageId);
  if(!pkg||string(payload.language)!=="en"||!string(payload.seed)||
     !string(payload.canonicalProblemId||payload.selectedCpId||payload.cpId)||
     !string(payload.questionLanguageId||payload.qlId))return null;
  const active=languages.filter(lang=>pkg.supportedLanguages.includes(lang));
  if(active.length===0)return null;
  const source=nativeSourceQuestion(payload);
  if(!source.stem||!source.explanation||source.options.length<2||
     !Number.isInteger(source.correctIndex)||source.correctIndex<0||
     source.correctIndex>=source.options.length)return null;
  try {
    assertNativeEnglishSourceParity(source,await nativeLocalizedQuestion(payload,"en"));
  }catch{return null;}
  const variants=await Promise.all(active.map(async language:Promise<PersistedNativeVariant>=>{
    try{
      const localized=await nativeLocalizedQuestion(payload,language);
      assertNativeLocalizedAnswerParity(source,localized);
      return {language,status:"verified",...localized};
    }catch{
      return {language,status:"blocked",reason:"The native generator did not pass canonical answer parity."};
    }
  }));
  return {schemaVersion:1,sourceHash:nativeSourceHash(source),variants,
    generatedAt:new Date().toISOString(),sourceVerified:true};
}
/** Small batches of expensive native-language snapshots. No unbounded fanout. */
export async function prepareNativeReviewBatch(questions:Record<string,unknown>[]) {
  const result:Array<PersistedNativeSnapshot|null>=new Array(questions.length).fill(null);
  let index=0;
  await Promise.all(Array.from({length:Math.min(3,questions.length)},async()=>{
    while(index<questions.length){
      const next=index++;
      try{result[next]=await prepareNativeReviewSnapshot(questions[next]!);}
      catch{result[next]=null;}
    }
  }));
  return result;
}
