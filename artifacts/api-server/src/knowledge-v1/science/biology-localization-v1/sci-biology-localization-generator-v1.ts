import { SCI_CP019_REVIEW_V1, type SciCp019ReviewQuestion } from "../cell-biology/sci-cp019-review-v1";
import { SCI_BIOLOGY_LOCALIZATION_V1, type BiologyLocalizedQuestionV1, type BiologyNativeSpecV1 } from "./sci-biology-localization-types-v1";
import { CP019_HI_PART_1, CP019_PA_PART_1 } from "./sci-biology-cp019-localization-part1-v1";
import { CP019_HI_PART_2, CP019_PA_PART_2 } from "./sci-biology-cp019-localization-part2-v1";
import { CP019_HI_PART_3, CP019_PA_PART_3 } from "./sci-biology-cp019-localization-part3-v1";
import { CP019_HI_PART_4, CP019_PA_PART_4 } from "./sci-biology-cp019-localization-part4-v1";

const HI = [...CP019_HI_PART_1,...CP019_HI_PART_2,...CP019_HI_PART_3,...CP019_HI_PART_4] as const;
const PA = [...CP019_PA_PART_1,...CP019_PA_PART_2,...CP019_PA_PART_3,...CP019_PA_PART_4] as const;

const QL_HI = [
  "कोशिका की खोज, कोशिका सिद्धांत और जैविक संगठन",
  "प्रोकैरियोटिक और यूकैरियोटिक कोशिकाएँ",
  "प्लाज़्मा झिल्ली, कोशिका भित्ति, विसरण और परासरण",
  "केंद्रक, गुणसूत्र, DNA और जीन",
  "राइबोसोम, एंडोप्लाज़्मिक रेटिकुलम और गॉल्जी तंत्र",
  "माइटोकॉन्ड्रिया, प्लास्टिड और क्लोरोप्लास्ट",
  "लाइसोसोम, रिक्तिका और पादप-पशु कोशिका के लक्षण",
  "कोशिका विभाजन: माइटोसिस और मीयोसिस की मूल बातें",
  "कोशिकांग-कार्य और कोशिका-प्रकार आधारित तर्क",
  "सूक्ष्मदर्शी, एककोशिकीय जीवन और मिश्रित कोशिका जीवविज्ञान"
] as const;

const QL_PA = [
  "ਕੋਸ਼ਿਕਾ ਦੀ ਖੋਜ, ਕੋਸ਼ਿਕਾ ਸਿਧਾਂਤ ਅਤੇ ਜੈਵਿਕ ਸੰਗਠਨ",
  "ਪ੍ਰੋਕੈਰੀਓਟਿਕ ਅਤੇ ਯੂਕੈਰੀਓਟਿਕ ਕੋਸ਼ਿਕਾਵਾਂ",
  "ਪਲਾਜ਼ਮਾ ਝਿੱਲੀ, ਕੋਸ਼ਿਕਾ ਭਿੱਤ, ਵਿਸਰਨ ਅਤੇ ਪਰਾਸਰਨ",
  "ਕੇਂਦਰਕ, ਗੁਣਸੂਤਰ, DNA ਅਤੇ ਜੀਨ",
  "ਰਾਈਬੋਸੋਮ, ਐਂਡੋਪਲਾਜ਼ਮਿਕ ਰੈਟੀਕੁਲਮ ਅਤੇ ਗੋਲਜੀ ਤੰਤਰ",
  "ਮਾਈਟੋਕੌਂਡਰੀਆ, ਪਲਾਸਟਿਡ ਅਤੇ ਕਲੋਰੋਪਲਾਸਟ",
  "ਲਾਈਸੋਸੋਮ, ਰਸਧਾਨੀ ਅਤੇ ਪੌਧਾ-ਜਾਨਵਰ ਕੋਸ਼ਿਕਾ ਦੇ ਲੱਛਣ",
  "ਕੋਸ਼ਿਕਾ ਵਿਭਾਜਨ: ਮਾਈਟੋਸਿਸ ਅਤੇ ਮੀਓਸਿਸ ਦੀਆਂ ਮੂਲ ਗੱਲਾਂ",
  "ਕੋਸ਼ਿਕਾਂਗ-ਕਾਰਜ ਅਤੇ ਕੋਸ਼ਿਕਾ-ਕਿਸਮ ਆਧਾਰਿਤ ਤਰਕ",
  "ਸੂਖਮਦਰਸ਼ੀ, ਇਕ-ਕੋਸ਼ਿਕੀ ਜੀਵਨ ਅਤੇ ਮਿਲਿਆ-ਜੁਲਿਆ ਕੋਸ਼ਿਕਾ ਜੀਵ ਵਿਗਿਆਨ"
] as const;

function buildOptions(answer:string,distractors:readonly [string,string,string],correctIndex:number): readonly string[] {
  const options=[...distractors];
  options.splice(correctIndex,0,answer);
  return Object.freeze(options);
}

function localizeOne(
  q: SciCp019ReviewQuestion,
  spec: BiologyNativeSpecV1,
  locale: "hi" | "pa",
  index: number
): BiologyLocalizedQuestionV1 {
  const [stem,answer,distractors,explanation]=spec;
  const qlNumber=Number(q.qlId.slice(-3));
  const qlName=(locale==="hi"?QL_HI:QL_PA)[qlNumber-1];
  return Object.freeze({
    questionId: `${q.questionId}-${locale.toUpperCase()}`,
    chapterId: q.chapterId,
    cpId: q.cpId,
    qlId: q.qlId,
    qlName,
    difficulty: q.difficulty,
    stem,
    options: buildOptions(answer,distractors,q.correctIndex),
    correctIndex: q.correctIndex,
    canonicalAnswer: answer,
    explanation,
    sourceIds: [...q.sourceIds],
    sourceFactIds: [...q.sourceFactIds],
    reviewOnly: true,
    runtimeRegistered: false,
    locale,
    localizationV1: Object.freeze({
      version: SCI_BIOLOGY_LOCALIZATION_V1,
      englishQuestionId: q.questionId,
      semanticInvariant: true,
      cpInvariant: true,
      qlInvariant: true,
      difficultyInvariant: true,
      sourceInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
      reviewOnly: true
    })
  });
}

export const SCI_BIOLOGY_CP019_HI_V1 = Object.freeze(
  SCI_CP019_REVIEW_V1.map((q,index)=>localizeOne(q,HI[index],"hi",index))
);
export const SCI_BIOLOGY_CP019_PA_V1 = Object.freeze(
  SCI_CP019_REVIEW_V1.map((q,index)=>localizeOne(q,PA[index],"pa",index))
);

export function validateSciBiologyCp019LocalizationV1() {
  const errors:string[]=[];
  for (const [locale,rows] of [["hi",SCI_BIOLOGY_CP019_HI_V1],["pa",SCI_BIOLOGY_CP019_PA_V1]] as const) {
    if(rows.length!==60) errors.push(`${locale}: expected 60, found ${rows.length}`);
    rows.forEach((q,index)=>{
      const en=SCI_CP019_REVIEW_V1[index];
      if(q.localizationV1.englishQuestionId!==en.questionId) errors.push(`${q.questionId}: english link mismatch`);
      if(q.cpId!==en.cpId||q.qlId!==en.qlId||q.difficulty!==en.difficulty) errors.push(`${q.questionId}: invariant mismatch`);
      if(q.correctIndex!==en.correctIndex) errors.push(`${q.questionId}: correctIndex mismatch`);
      if(q.options[q.correctIndex]!==q.canonicalAnswer) errors.push(`${q.questionId}: localized answer mismatch`);
      if(JSON.stringify(q.sourceIds)!==JSON.stringify(en.sourceIds)||JSON.stringify(q.sourceFactIds)!==JSON.stringify(en.sourceFactIds)) errors.push(`${q.questionId}: provenance mismatch`);
      if(q.options.length!==4||new Set(q.options).size!==4) errors.push(`${q.questionId}: options invalid`);
      if(!q.stem.trim()||!q.explanation.trim()) errors.push(`${q.questionId}: empty learner surface`);
      if(!q.reviewOnly||q.runtimeRegistered) errors.push(`${q.questionId}: lifecycle violation`);
    });
  }
  return {valid:errors.length===0,errors,hindi:SCI_BIOLOGY_CP019_HI_V1.length,punjabi:SCI_BIOLOGY_CP019_PA_V1.length};
}
