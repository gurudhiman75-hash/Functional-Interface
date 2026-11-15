import { nativeLocalizedQuestion, assertNativeEnglishSourceParity,
         assertNativeLocalizedAnswerParity } from "./native-linked-localization";
import { listQuestionStudioPackages } from "./engine-registry";
import { nativeSourceQuestion,nativeSourceHash,type PersistedNativeSnapshot,
         type PersistedNativeVariant } from "./persisted-native-review-format";
const string=(x:unknown)=>typeof x==="string"?x.trim():"";

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
export async function prepareNativeReviewBatch(
  questions:Record<string,unknown>[], languages:readonly ("hi"|"pa")[]=["hi","pa"],
) {
  const result:Array<PersistedNativeSnapshot|null>=new Array(questions.length).fill(null);
  let index=0;
  await Promise.all(Array.from({length:Math.min(3,questions.length)},async()=>{
    while(index<questions.length){
      const next=index++;
      try{result[next]=await prepareNativeReviewSnapshot(questions[next]!,languages);}
      catch{result[next]=null;}
    }
  }));
  return result;
}
