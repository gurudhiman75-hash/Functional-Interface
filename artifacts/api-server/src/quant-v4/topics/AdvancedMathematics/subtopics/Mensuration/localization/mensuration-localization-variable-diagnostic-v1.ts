import { MENSURATION_QUESTION_STUDIO_PATTERNS, generateMensurationLocalizedQuestionV1, type MensurationLocalizedQuestionV1 } from "./mensuration-localization-runtime-v1";
import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

function stripInternalIds(text: string) { return text.replace(/\[[A-Z0-9_:-]{3,}\]/g, " "); }
function sig(text: string) {
  const s = stripInternalIds(text);
  const values: string[] = [];
  for (const m of s.matchAll(/\b([A-Za-z])\b(?=\s*(?:[²³^=+×÷−\-*/)]))/g)) values.push(m[1]!);
  for (const m of s.matchAll(/(?:[(=+×÷−\-*/]\s*)([A-Za-z])\b/g)) values.push(m[1]!);
  return values.sort().join("|");
}
function fields(q: MensurationLocalizedQuestionV1) {
  return [["stem",q.stem] as const,...q.explanation.steps.map((v,i)=>[`step-${i+1}`,v] as const),["shortcut",q.explanation.shortcut] as const,...q.explanation.traps.map((v,i)=>[`trap-${i+1}`,v] as const)];
}
const langs: readonly MensurationLocalizedLanguage[]=["hi","pa"];
const rows: Array<Record<string,unknown>>=[];
for(const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS){
  for(let i=0;i<4;i++){
    const seed=`mensuration-localization-parity:${pattern.patternId}:${i}`;
    const en=generateMensurationLocalizedQuestionV1({patternId:pattern.patternId,seed,language:"en",examProfile:"SSC_CORE"});
    const ef=fields(en);
    for(const language of langs){
      const q=generateMensurationLocalizedQuestionV1({patternId:pattern.patternId,seed,language,examProfile:"SSC_CORE"});
      const lf=fields(q);
      for(let f=0;f<ef.length;f++){
        const [field,source]=ef[f]!; const [,target]=lf[f]!;
        if(sig(source)!==sig(target)) rows.push({language,cpId:pattern.cpId,patternId:pattern.patternId,field,source,target,sourceSignature:sig(source),targetSignature:sig(target)});
      }
    }
  }
}
console.log(JSON.stringify({count:rows.length,first:rows.slice(0,120)},null,2));
