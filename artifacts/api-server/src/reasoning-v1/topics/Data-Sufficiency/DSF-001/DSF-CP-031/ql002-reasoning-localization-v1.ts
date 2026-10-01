import {
  localizeDsfReasoningStatementText,
  localizeDsfReasoningStemParts,
  type DsfReasoningLocalizedLanguage,
} from "../DSF-CP-018/reasoning-localization-v1.ts";
import type { DsfCp015ThreeStatementSemanticKey } from "../DSF-CP-015/three-statement-answer-profile.ts";

type AnyQuestion = Readonly<Record<string, any>>;
type StatementId = "I" | "II" | "III";

const ORDER = [
  ["I"],["II"],["III"],["I","II"],["I","III"],["II","III"],["I","II","III"],
] as const;

function t(language:DsfReasoningLocalizedLanguage, hi:string, pa:string):string {
  return language === "hi" ? hi : pa;
}

function subsetPhrase(ids:readonly StatementId[], language:DsfReasoningLocalizedLanguage):string {
  if(ids.length===1) return t(language,`कथन ${ids[0]} अकेला`,`ਕਥਨ ${ids[0]} ਇਕੱਲਾ`);
  if(ids.length===2) return t(language,`कथन ${ids[0]} और ${ids[1]} साथ में`,`ਕਥਨ ${ids[0]} ਅਤੇ ${ids[1]} ਇਕੱਠੇ`);
  return t(language,"कथन I, II और III साथ में","ਕਥਨ I, II ਅਤੇ III ਇਕੱਠੇ");
}

function minimalSubsets(key:DsfCp015ThreeStatementSemanticKey):readonly (readonly StatementId[])[] {
  if(key==="NONE") return [];
  return key.split("|").map(part=>part.split("+") as StatementId[]);
}

export function renderLocalizedThreeStatementOption(
  key:DsfCp015ThreeStatementSemanticKey,
  language:DsfReasoningLocalizedLanguage,
):string {
  if(key==="NONE") return t(language,"कथन I, II और III साथ लेने पर भी जानकारी पर्याप्त नहीं है।","ਕਥਨ I, II ਅਤੇ III ਇਕੱਠੇ ਲੈਣ 'ਤੇ ਵੀ ਜਾਣਕਾਰੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।");
  if(key==="I|II|III") return t(language,"कथन I, II या III में से कोई भी एक कथन अकेला पर्याप्त है।","ਕਥਨ I, II ਜਾਂ III ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਇੱਕ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।");
  if(key==="I+II|I+III|II+III") return t(language,"कोई भी दो कथन साथ में पर्याप्त हैं, लेकिन कोई एक कथन अकेला पर्याप्त नहीं है।","ਕੋਈ ਵੀ ਦੋ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਇੱਕ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।");
  if(key==="I+II+III") return t(language,"उत्तर निर्धारित करने के लिए कथन I, II और III तीनों आवश्यक हैं।","ਉੱਤਰ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਕਥਨ I, II ਅਤੇ III ਤਿੰਨੇ ਲਾਜ਼ਮੀ ਹਨ।");
  const subsets=minimalSubsets(key);
  if(subsets.length===1) return t(language,`${subsetPhrase(subsets[0]!,language)} पर्याप्त है।`,`${subsetPhrase(subsets[0]!,language)} ਕਾਫ਼ੀ ਹੈ।`);
  if(subsets.length===2) return t(language,`या तो ${subsetPhrase(subsets[0]!,language)} या ${subsetPhrase(subsets[1]!,language)} पर्याप्त है।`,`ਜਾਂ ਤਾਂ ${subsetPhrase(subsets[0]!,language)} ਜਾਂ ${subsetPhrase(subsets[1]!,language)} ਕਾਫ਼ੀ ਹੈ।`);
  return t(language,`${subsets.map(s=>subsetPhrase(s,language)).join("; ")} पर्याप्त हैं।`,`${subsets.map(s=>subsetPhrase(s,language)).join("; ")} ਕਾਫ਼ੀ ਹਨ।`);
}

const VALUE_MAP:Record<string,[string,string]>={
  Sunday:["रविवार","ਐਤਵਾਰ"],Monday:["सोमवार","ਸੋਮਵਾਰ"],Tuesday:["मंगलवार","ਮੰਗਲਵਾਰ"],Wednesday:["बुधवार","ਬੁੱਧਵਾਰ"],Thursday:["गुरुवार","ਵੀਰਵਾਰ"],Friday:["शुक्रवार","ਸ਼ੁੱਕਰਵਾਰ"],Saturday:["शनिवार","ਸ਼ਨੀਵਾਰ"],
  North:["उत्तर","ਉੱਤਰ"],South:["दक्षिण","ਦੱਖਣ"],East:["पूर्व","ਪੂਰਬ"],West:["पश्चिम","ਪੱਛਮ"],
  BROTHER:["भाई","ਭਰਾ"],SISTER:["बहन","ਭੈਣ"],FATHER:["पिता","ਪਿਤਾ"],MOTHER:["माता","ਮਾਤਾ"],SON:["पुत्र","ਪੁੱਤਰ"],DAUGHTER:["पुत्री","ਧੀ"],
  HUSBAND:["पति","ਪਤੀ"],WIFE:["पत्नी","ਪਤਨੀ"],UNCLE:["चाचा/मामा","ਚਾਚਾ/ਮਾਮਾ"],AUNT:["चाची/मौसी","ਚਾਚੀ/ਮਾਸੀ"],
  NEPHEW:["भतीजा/भांजा","ਭਤੀਜਾ/ਭਾਣਜਾ"],NIECE:["भतीजी/भांजी","ਭਤੀਜੀ/ਭਾਣਜੀ"],
  GRANDFATHER:["दादा/नाना","ਦਾਦਾ/ਨਾਨਾ"],GRANDMOTHER:["दादी/नानी","ਦਾਦੀ/ਨਾਨੀ"],GRANDSON:["पोता/नाती","ਪੋਤਾ/ਦੋਹਤਾ"],GRANDDAUGHTER:["पोती/नातिन","ਪੋਤੀ/ਦੋਹਤੀ"],
  BROTHER_IN_LAW:["बहनोई/साला","ਭੈਣੋਈ/ਸਾਲਾ"],SISTER_IN_LAW:["भाभी/साली","ਭਾਬੀ/ਸਾਲੀ"],FATHER_IN_LAW:["ससुर","ਸਹੁਰਾ"],MOTHER_IN_LAW:["सास","ਸੱਸ"],SON_IN_LAW:["दामाद","ਜਵਾਈ"],DAUGHTER_IN_LAW:["बहू","ਨੂੰਹ"],
};

function localizeAnswerValue(value:unknown, language:DsfReasoningLocalizedLanguage):string {
  const raw=String(value);
  if(VALUE_MAP[raw]) return t(language,...VALUE_MAP[raw]!);
  return raw.replace(/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|North|South|East|West)\b/g,(m)=>VALUE_MAP[m] ? t(language,...VALUE_MAP[m]!) : m);
}

function subsetResult(question:AnyQuestion, ids:readonly StatementId[]):any {
  return (question.proof?.subsetEvaluations ?? []).find((entry:any)=>
    Array.isArray(entry.statementIds) &&
    entry.statementIds.length===ids.length &&
    ids.every(id=>entry.statementIds.includes(id))
  );
}

function localizedExplanation(question:AnyQuestion, language:DsfReasoningLocalizedLanguage):string {
  const lines=[t(language,"हमें प्रश्न में मांगी गई जानकारी निर्धारित करनी है।","ਸਾਨੂੰ ਸਵਾਲ ਵਿੱਚ ਮੰਗੀ ਗਈ ਜਾਣਕਾਰੀ ਨਿਰਧਾਰਤ ਕਰਨੀ ਹੈ।")];
  for(const ids of ORDER){
    const entry=subsetResult(question,ids);
    if(!entry) continue;
    const label=subsetPhrase(ids as readonly StatementId[],language);
    const answers=(entry.normalizedTargetAnswers ?? []).slice(0,3).map((v:any)=>localizeAnswerValue(v,language));
    if(entry.sufficient){
      lines.push(t(language,`${label}: पर्याप्त है; इससे उत्तर ${answers[0] ?? ""} निश्चित हो जाता है।`,`${label}: ਕਾਫ਼ੀ ਹੈ; ਇਸ ਨਾਲ ਉੱਤਰ ${answers[0] ?? ""} ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ।`));
    } else if(answers.length>1){
      lines.push(t(language,`${label}: पर्याप्त नहीं है; ${answers.join(", ")} जैसे एक से अधिक उत्तर संभव हैं।`,`${label}: ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ; ${answers.join(", ")} ਵਰਗੇ ਇੱਕ ਤੋਂ ਵੱਧ ਉੱਤਰ ਸੰਭਵ ਹਨ।`));
    } else {
      lines.push(t(language,`${label}: पर्याप्त नहीं है; एक निश्चित उत्तर नहीं मिलता।`,`${label}: ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ; ਇੱਕ ਨਿਸ਼ਚਿਤ ਉੱਤਰ ਨਹੀਂ ਮਿਲਦਾ।`));
    }
  }
  lines.push(t(language,`अतः सही विकल्प: ${renderLocalizedThreeStatementOption(question.semanticKey,language)}`,`ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ: ${renderLocalizedThreeStatementOption(question.semanticKey,language)}`));
  return lines.join(" ");
}

export function localizeDsfQl002ReasoningQuestion(
  laneId:string,
  question:AnyQuestion,
  language:DsfReasoningLocalizedLanguage,
):AnyQuestion {
  if(question.qlId!=="DSF-QL-002" || question.statementCount!==3) throw new Error(`${laneId}: CP031 only accepts three-statement DSF-QL-002 questions`);
  const parts=localizeDsfReasoningStemParts(laneId,question,language);
  const statements=(question.statements ?? []).map((statement:any)=>Object.freeze({
    ...statement,
    text:localizeDsfReasoningStatementText(laneId,String(statement.text ?? ""),language),
  }));
  const options=(question.options ?? []).map((option:any)=>Object.freeze({
    ...option,
    text:renderLocalizedThreeStatementOption(option.semanticKey,language),
  }));
  return Object.freeze({
    ...question,
    checkpointId:"DSF-CP-031" as const,
    language,
    locale:language==="hi" ? "hi-IN" : "pa-IN",
    stem:parts.stem,
    questionPrompt:parts.prompt,
    statements:Object.freeze(statements),
    options:Object.freeze(options),
    explanation:localizedExplanation(question,language),
    localization:Object.freeze({
      authority:"DSF_CP031_QL002_REASONING_HI_PA_LOCALIZATION_REVIEW_V1",
      sourceCheckpointId:question.checkpointId,
      sourceLanguage:"en",
      language,
      semanticParity:"SOURCE_PROOF_PRESERVED",
      correctIndexPreserved:true,
      canonicalAnswerPreserved:true,
      proofPreserved:true,
      humanLanguageReviewRequired:true,
      reviewOnly:true,
    }),
    lifecycle:Object.freeze({
      ...question.lifecycle,
      contentStatus:"CP031_QL002_REASONING_LOCALIZATION_REVIEW_CANDIDATE",
      questionStudioDiscoverable:true,
      questionBankWritable:false,
      testEligible:false,
      mockTestEligible:false,
      publiclyPublishable:false,
      automaticStudentPublication:false,
    }),
  });
}
