import {
  COM003_HINDI_LOCALIZATION_V2_WAVE2,
  COM003_LOCALIZATION_V2_WAVE2_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE2,
} from "./com003-localization-v2-wave2";
import type { Com003LocalizedQuestionV2 } from "./com003-localization-v2-wave1";

function polishHindi(item: Com003LocalizedQuestionV2): Com003LocalizedQuestionV2 {
  let stem=item.stem, explanation=item.explanation;
  const exactStem: Record<string,string> = {
    "Excel reference B7 में अक्षर B किस coordinate को दर्शाता है?":"Excel के सेल रेफरेंस B7 में अक्षर B क्या दर्शाता है?",
    "Excel worksheet में cells की vertical line को क्या कहा जाता है?":"Excel Worksheet में सेलों की ऊर्ध्वाधर श्रृंखला को क्या कहा जाता है?",
    "Excel worksheet में cells की horizontal line को क्या कहा जाता है?":"Excel Worksheet में सेलों की क्षैतिज श्रृंखला को क्या कहा जाता है?",
    "Microsoft Excel में cells की horizontal line किस नाम से जानी जाती है?":"Microsoft Excel में सेलों की क्षैतिज श्रृंखला किस नाम से जानी जाती है?",
    "Excel की वह file जिसमें एक या अधिक Worksheets हो सकती हैं, क्या कहलाती है?":"Excel की वह फ़ाइल जिसमें एक या अधिक Worksheets हो सकती हैं, क्या कहलाती है?",
    "Workbook के अंदर Rows और Columns से बनी sheet को Excel में क्या कहा जाता है?":"Workbook के अंदर Rows और Columns से बनी स्प्रेडशीट शीट को Excel में क्या कहा जाता है?"
  };
  stem=exactStem[stem]??stem;
  stem=stem
    .replaceAll("merged documents","मर्ज किए गए दस्तावेज़ों")
    .replaceAll("recipient data","प्राप्तकर्ता डेटा")
    .replaceAll("field values","फ़ील्ड मान")
    .replaceAll("recipient records","प्राप्तकर्ता रिकॉर्ड")
    .replaceAll("cell reference","सेल रेफरेंस")
    .replaceAll("cell range","सेल रेंज")
    .replaceAll("cell address","सेल एड्रेस")
    .replaceAll("page orientation","पेज ओरिएंटेशन")
    .replaceAll("orientation","ओरिएंटेशन")
    .replaceAll("arithmetic operator","अंकगणितीय ऑपरेटर")
    .replaceAll("operator","ऑपरेटर");
  explanation=explanation
    .replaceAll("merged documents","मर्ज किए गए दस्तावेज़ों")
    .replaceAll("merged item","मर्ज किए गए आइटम")
    .replaceAll("recipient data","प्राप्तकर्ता डेटा")
    .replaceAll("field values","फ़ील्ड मान")
    .replaceAll("cell range","सेल रेंज")
    .replaceAll("cell address","सेल एड्रेस")
    .replaceAll("Column Label","कॉलम लेबल")
    .replaceAll("Row Number","रो नंबर")
    .replaceAll("Landscape orientation","Landscape ओरिएंटेशन")
    .replaceAll("Portrait orientation","Portrait ओरिएंटेशन")
    .replaceAll("operator","ऑपरेटर");
  const excelExplanation: Record<string,string> = {
    "com003-excel-structure-column":"Excel Worksheet में सेलों की ऊर्ध्वाधर श्रृंखला को Column कहा जाता है।",
    "com003-excel-structure-row":"Excel Worksheet में सेलों की क्षैतिज श्रृंखला को Row कहा जाता है।",
    "com003-excel-structure-cell":"Excel में Row और Column जहाँ मिलते हैं, उस स्थान को Cell कहा जाता है।",
    "com003-excel-structure-workbook":"Workbook वह Excel फ़ाइल है जिसमें एक या अधिक Worksheets हो सकती हैं।",
    "com003-excel-structure-worksheet":"Worksheet, Workbook के भीतर Rows और Columns से बनी स्प्रेडशीट शीट होती है।"
  };
  explanation=excelExplanation[item.targetFactId]??explanation;
  if(item.targetFactId==="com003-word-autocorrect-purpose") explanation="AutoCorrect कॉन्फ़िगर किए गए या सामान्य टाइपिंग तथा बड़े/छोटे अक्षरों से जुड़े पैटर्न को स्वतः ठीक करता है।";
  return {...item,localizationId:item.localizationId.replace("COM003-LOC-V2-W2-","COM003-LOC-V2-W2R2-"),stem,explanation};
}

function polishPunjabi(item: Com003LocalizedQuestionV2): Com003LocalizedQuestionV2 {
  let stem=item.stem, explanation=item.explanation;
  const exactStem: Record<string,string> = {
    "Excel reference B7 ਵਿੱਚ ਅੱਖਰ B ਕਿਹੜੇ coordinate ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?":"Excel ਦੇ ਸੈਲ ਰੈਫਰੈਂਸ B7 ਵਿੱਚ ਅੱਖਰ B ਕੀ ਦਰਸਾਉਂਦਾ ਹੈ?",
    "Excel worksheet ਵਿੱਚ cells ਦੀ vertical ਲਾਈਨ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?":"Excel Worksheet ਵਿੱਚ ਸੈਲਾਂ ਦੀ ਲੰਬਕਾਰੀ ਲੜੀ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
    "Excel worksheet ਵਿੱਚ cells ਦੀ horizontal ਲਾਈਨ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?":"Excel Worksheet ਵਿੱਚ ਸੈਲਾਂ ਦੀ ਖਿਤਿਜੀ ਲੜੀ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
    "Microsoft Excel ਵਿੱਚ cells ਦੀ horizontal ਲਾਈਨ ਕਿਸ ਨਾਮ ਨਾਲ ਜਾਣੀ ਜਾਂਦੀ ਹੈ?":"Microsoft Excel ਵਿੱਚ ਸੈਲਾਂ ਦੀ ਖਿਤਿਜੀ ਲੜੀ ਕਿਸ ਨਾਮ ਨਾਲ ਜਾਣੀ ਜਾਂਦੀ ਹੈ?",
    "Excel ਦੀ ਉਹ file ਜਿਸ ਵਿੱਚ ਇੱਕ ਜਾਂ ਵੱਧ Worksheets ਹੋ ਸਕਦੀਆਂ ਹਨ, ਕੀ ਕਹਾਉਂਦੀ ਹੈ?":"Excel ਦੀ ਉਹ ਫਾਈਲ ਜਿਸ ਵਿੱਚ ਇੱਕ ਜਾਂ ਵੱਧ Worksheets ਹੋ ਸਕਦੀਆਂ ਹਨ, ਕੀ ਕਹਾਉਂਦੀ ਹੈ?",
    "Workbook ਦੇ ਅੰਦਰ Rows ਅਤੇ Columns ਨਾਲ ਬਣੀ sheet ਨੂੰ Excel ਵਿੱਚ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?":"Workbook ਦੇ ਅੰਦਰ Rows ਅਤੇ Columns ਨਾਲ ਬਣੀ ਸਪ੍ਰੈੱਡਸ਼ੀਟ ਸ਼ੀਟ ਨੂੰ Excel ਵਿੱਚ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"
  };
  stem=exactStem[stem]??stem;
  stem=stem
    .replaceAll("merged documents","ਮਰਜ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ਾਂ")
    .replaceAll("recipient data","ਪ੍ਰਾਪਤਕਰਤਾ ਡਾਟਾ")
    .replaceAll("field values","ਫੀਲਡ ਮੁੱਲ")
    .replaceAll("recipient records","ਪ੍ਰਾਪਤਕਰਤਾ ਰਿਕਾਰਡ")
    .replaceAll("cell reference","ਸੈਲ ਰੈਫਰੈਂਸ")
    .replaceAll("cell range","ਸੈਲ ਰੇਂਜ")
    .replaceAll("cell address","ਸੈਲ ਐਡਰੈੱਸ")
    .replaceAll("page orientation","ਪੇਜ ਓਰੀਐਂਟੇਸ਼ਨ")
    .replaceAll("orientation","ਓਰੀਐਂਟੇਸ਼ਨ")
    .replaceAll("arithmetic operator","ਅੰਕਗਣਿਤੀ ਓਪਰੇਟਰ")
    .replaceAll("operator","ਓਪਰੇਟਰ")
    .replaceAll("layout","ਲੇਆਉਟ");
  explanation=explanation
    .replaceAll("merged documents","ਮਰਜ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ਾਂ")
    .replaceAll("merged item","ਮਰਜ ਕੀਤੀ ਆਈਟਮ")
    .replaceAll("recipient data","ਪ੍ਰਾਪਤਕਰਤਾ ਡਾਟਾ")
    .replaceAll("field values","ਫੀਲਡ ਮੁੱਲ")
    .replaceAll("cell range","ਸੈਲ ਰੇਂਜ")
    .replaceAll("cell address","ਸੈਲ ਐਡਰੈੱਸ")
    .replaceAll("Column Label","ਕਾਲਮ ਲੇਬਲ")
    .replaceAll("Row Number","ਰੋ ਨੰਬਰ")
    .replaceAll("Landscape orientation","Landscape ਓਰੀਐਂਟੇਸ਼ਨ")
    .replaceAll("Portrait orientation","Portrait ਓਰੀਐਂਟੇਸ਼ਨ")
    .replaceAll("operator","ਓਪਰੇਟਰ")
    .replaceAll("layout","ਲੇਆਉਟ");
  const excelExplanation: Record<string,string> = {
    "com003-excel-structure-column":"Excel Worksheet ਵਿੱਚ ਸੈਲਾਂ ਦੀ ਲੰਬਕਾਰੀ ਲੜੀ ਨੂੰ Column ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
    "com003-excel-structure-row":"Excel Worksheet ਵਿੱਚ ਸੈਲਾਂ ਦੀ ਖਿਤਿਜੀ ਲੜੀ ਨੂੰ Row ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
    "com003-excel-structure-cell":"Excel ਵਿੱਚ Row ਅਤੇ Column ਜਿੱਥੇ ਮਿਲਦੇ ਹਨ, ਉਸ ਥਾਂ ਨੂੰ Cell ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
    "com003-excel-structure-workbook":"Workbook ਉਹ Excel ਫਾਈਲ ਹੈ ਜਿਸ ਵਿੱਚ ਇੱਕ ਜਾਂ ਵੱਧ Worksheets ਹੋ ਸਕਦੀਆਂ ਹਨ।",
    "com003-excel-structure-worksheet":"Worksheet, Workbook ਦੇ ਅੰਦਰ Rows ਅਤੇ Columns ਨਾਲ ਬਣੀ ਸਪ੍ਰੈੱਡਸ਼ੀਟ ਸ਼ੀਟ ਹੁੰਦੀ ਹੈ।"
  };
  explanation=excelExplanation[item.targetFactId]??explanation;
  if(item.targetFactId==="com003-word-autocorrect-purpose") explanation="AutoCorrect ਕੰਫਿਗਰ ਕੀਤੇ ਜਾਂ ਆਮ ਟਾਈਪਿੰਗ ਅਤੇ ਵੱਡੇ/ਛੋਟੇ ਅੱਖਰਾਂ ਨਾਲ ਜੁੜੇ ਪੈਟਰਨਾਂ ਨੂੰ ਆਪਣੇ ਆਪ ਠੀਕ ਕਰਦਾ ਹੈ।";
  return {...item,localizationId:item.localizationId.replace("COM003-LOC-V2-W2-","COM003-LOC-V2-W2R2-"),stem,explanation};
}

export const COM003_HINDI_LOCALIZATION_V2_WAVE2_V2=Object.freeze(COM003_HINDI_LOCALIZATION_V2_WAVE2.map(polishHindi));
export const COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2=Object.freeze(COM003_PUNJABI_LOCALIZATION_V2_WAVE2.map(polishPunjabi));
export const COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2=Object.freeze({
  ...COM003_LOCALIZATION_V2_WAVE2_AUTHORITY,
  authorityId:"COM-003-LOCALIZATION-V2-WAVE2-CANDIDATE-2" as const,
  supersedesCandidateAuthorityId:COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.authorityId,
  editorialBasis:"EXACT_CANDIDATE_1_RENDERED_ARTIFACT_HUMAN_LANGUAGE_PASS" as const,
  remediation:Object.freeze({hindiPunjabiRawEnglishFragmentsNaturalized:true,excelStructureWordingNaturalized:true,officeTechnicalLabelsRetainedWhereExamConventional:true,changedFields:Object.freeze(["localizationId","stem","explanation"] as const),optionsAnswersSemanticsProvenanceUnchanged:true}),
  nextGate:"COM003_LOCALIZATION_V2_WAVE2_CANDIDATE_2_HUMAN_REVIEW" as const
});