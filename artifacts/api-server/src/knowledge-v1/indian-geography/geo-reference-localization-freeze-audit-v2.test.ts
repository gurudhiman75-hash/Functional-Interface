import assert from "node:assert/strict";
import { localizeGeoReferenceQuestionV1 } from "./geo-reference-localization-v1";
import { GEO_LAK_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-lak-001-adapter-v1";
import { GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-mtp-001-adapter-v1";

const packages = [
  ["GEO-LAK-001", GEO_LAK_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-MTP-001", GEO_MTP_001_QUESTION_STUDIO_CORPUS_V1],
] as const;

const residue = /\b(?:the|and|or|only|route|valley|plateau|coast|lake|falls|pass|peak|river|state|region|national|park|desert|freshwater|saline|coastal|glacial|mountain|himalaya|located|lies|formed|linked|which|what|where|why|with|from|near|correct|type|origin|activity|boundary|country|city|system|range)\b/i;
const genericHi = /^सही उत्तर .+ है। यह (?:झील\/जलप्रपात|दर्रा\/चोटी) के स्थान या भौगोलिक संबंध को सही रूप से पहचानता है।$/;
const genericPa = /^ਸਹੀ ਉੱਤਰ .+ ਹੈ। ਇਹ (?:ਝੀਲ\/ਝਰਨੇ|ਦਰਰੇ\/ਚੋਟੀ) ਦੇ ਸਥਾਨ ਜਾਂ ਭੂਗੋਲਿਕ ਸੰਬੰਧ ਦੀ ਸਹੀ ਪਛਾਣ ਕਰਦਾ ਹੈ।$/;

for (const [packageId, corpus] of packages) {
  const issues:string[] = [];
  let genericExplanationFallbackCount=0, hindiStemResidueCount=0, punjabiStemResidueCount=0, hindiOptionResidueCount=0, punjabiOptionResidueCount=0, explanationResidueCount=0, mixedScriptCount=0;
  for (const q of corpus) for (const language of ["hi","pa"] as const) {
    const l = localizeGeoReferenceQuestionV1(q, language);
    if (l.options.length !== 4 || new Set(l.options).size !== 4) issues.push(q.questionId+":"+language+":OPTIONS");
    if (l.options[q.correctIndex] !== l.canonicalAnswer) issues.push(q.questionId+":"+language+":ANSWER");
    if (residue.test(l.stem)) {
      if(language==="hi") hindiStemResidueCount++; else punjabiStemResidueCount++;
      issues.push(q.questionId+":"+language+":STEM_RESIDUE:"+l.stem);
    }
    for (const option of l.options) if (residue.test(option)) {
      if(language==="hi") hindiOptionResidueCount++; else punjabiOptionResidueCount++;
      issues.push(q.questionId+":"+language+":OPTION_RESIDUE:"+option);
    }
    if ((language==="hi" ? genericHi : genericPa).test(l.explanation)) {
      genericExplanationFallbackCount++;
      issues.push(q.questionId+":"+language+":GENERIC_EXPLANATION");
    } else if (residue.test(l.explanation)) {
      explanationResidueCount++;
      issues.push(q.questionId+":"+language+":EXPLANATION_RESIDUE:"+l.explanation);
    }
    const combined=l.stem+" "+l.options.join(" ")+" "+l.explanation;
    const cps=Array.from(combined).map(ch=>ch.codePointAt(0)??0);
    const hasDev=cps.some(cp=>cp>=0x0900&&cp<=0x097F&&cp!==0x0964&&cp!==0x0965);
    const hasGur=cps.some(cp=>cp>=0x0A00&&cp<=0x0A7F);
    const mixed=language==="hi"?hasGur:hasDev;
    if(mixed){ mixedScriptCount++; issues.push(q.questionId+":"+language+":MIXED_SCRIPT"); }
  }
  const audit={packageId,canonicalQuestionCount:corpus.length,localizedVersionCount:corpus.length*3,hindiStemResidueCount,punjabiStemResidueCount,hindiOptionResidueCount,punjabiOptionResidueCount,explanationResidueCount,genericExplanationFallbackCount,mixedScriptCount,issueCount:issues.length,issues};
  console.log(JSON.stringify(audit,null,2));
  assert.equal(corpus.length,75);
  assert.equal(hindiStemResidueCount+punjabiStemResidueCount+hindiOptionResidueCount+punjabiOptionResidueCount+explanationResidueCount+genericExplanationFallbackCount+mixedScriptCount,0,packageId+" strict localization issues remain");
}
