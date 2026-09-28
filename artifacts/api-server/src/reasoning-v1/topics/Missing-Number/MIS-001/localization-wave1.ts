export type MisLocalizedLanguage = 'en' | 'hi' | 'pa';

type LocalizableQuestion = {
  readonly checkpointId: string;
  readonly ruleId: string;
  readonly context: any;
  readonly stem: string;
  readonly explanation: string;
  readonly solverTrace: readonly string[];
  readonly answer: number;
};

function ordinal(index: number, language: 'hi' | 'pa'): string {
  const hi = ['पहली', 'दूसरी', 'तीसरी'];
  const pa = ['ਪਹਿਲੀ', 'ਦੂਜੀ', 'ਤੀਜੀ'];
  return (language === 'hi' ? hi : pa)[index] ?? String(index + 1);
}

function position(index: number, language: 'hi' | 'pa'): string {
  const hi = ['पहली', 'दूसरी', 'तीसरी'];
  const pa = ['ਪਹਿਲੀ', 'ਦੂਜੀ', 'ਤੀਜੀ'];
  return (language === 'hi' ? hi : pa)[index] ?? String(index + 1);
}

function stemFirstLine(language: 'hi' | 'pa'): string {
  return language === 'hi'
    ? 'प्रश्नवाचक चिन्ह (?) के स्थान पर आने वाली संख्या ज्ञात कीजिए।'
    : 'ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ (?) ਦੀ ਥਾਂ ਆਉਣ ਵਾਲੀ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।';
}

function localizedStem(stem: string, language: 'hi' | 'pa'): string {
  const lines = stem.split('\n');
  lines[0] = stemFirstLine(language);
  return lines.join('\n');
}

function cp001Rule(ruleId: string, context: any, language: 'hi' | 'pa'): string {
  const k = Number(context?.k ?? 0);
  const hi: Record<string,string> = {
    SUM: 'दोनों संख्याओं को जोड़ें।',
    ABS_DIFFERENCE: 'दोनों संख्याओं का धनात्मक अंतर लें।',
    PRODUCT: 'दोनों संख्याओं को गुणा करें।',
    EXACT_DIVISION: 'पहली संख्या को दूसरी संख्या से भाग दें।',
    SUM_PLUS_CONSTANT: `दोनों संख्याओं को जोड़कर ${k} जोड़ें।`,
    PRODUCT_PLUS_CONSTANT: `दोनों संख्याओं को गुणा करके ${k} जोड़ें।`,
    PRODUCT_MINUS_CONSTANT: `दोनों संख्याओं को गुणा करके ${k} घटाएँ।`,
    DIFFERENCE_PLUS_CONSTANT: `दोनों संख्याओं का धनात्मक अंतर लेकर ${k} जोड़ें।`,
  };
  const pa: Record<string,string> = {
    SUM: 'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।',
    ABS_DIFFERENCE: 'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ।',
    PRODUCT: 'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
    EXACT_DIVISION: 'ਪਹਿਲੀ ਸੰਖਿਆ ਨੂੰ ਦੂਜੀ ਸੰਖਿਆ ਨਾਲ ਭਾਗ ਦਿਓ।',
    SUM_PLUS_CONSTANT: `ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜ ਕੇ ${k} ਜੋੜੋ।`,
    PRODUCT_PLUS_CONSTANT: `ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ${k} ਜੋੜੋ।`,
    PRODUCT_MINUS_CONSTANT: `ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ${k} ਘਟਾਓ।`,
    DIFFERENCE_PLUS_CONSTANT: `ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲੈ ਕੇ ${k} ਜੋੜੋ।`,
  };
  return (language === 'hi' ? hi : pa)[ruleId] ?? '';
}

function cp002Rule(ruleId: string, context: any, language: 'hi' | 'pa'): string {
  const roles: readonly number[] = context?.roles ?? [0,1,2];
  const l=position(roles[0] ?? 0,language), r=position(roles[1] ?? 1,language), t=position(roles[2] ?? 2,language);
  if (language === 'hi') {
    if (ruleId==='THREE_INPUT_SUM') return 'तीनों संख्याओं को जोड़ें।';
    if (ruleId==='TWO_ADD_ONE_SUBTRACT') return `${l} और ${r} संख्या को जोड़ें, फिर ${t} संख्या घटाएँ।`;
    if (ruleId==='PAIR_PRODUCT_ADJUST_THIRD') return context?.sign===-1 ? `${l} और ${r} संख्या को गुणा करें, फिर ${t} संख्या घटाएँ।` : `${l} और ${r} संख्या को गुणा करें, फिर ${t} संख्या जोड़ें।`;
    if (ruleId==='PAIR_SUM_TIMES_THIRD') return `${l} और ${r} संख्या को जोड़ें, फिर प्राप्त योग को ${t} संख्या से गुणा करें।`;
    if (ruleId==='PAIR_DIFFERENCE_TIMES_THIRD') return `${l} संख्या में से ${r} संख्या घटाएँ, फिर प्राप्त अंतर को ${t} संख्या से गुणा करें।`;
    if (ruleId==='PAIR_PRODUCT_DIVIDE_THIRD') return `${l} और ${r} संख्या को गुणा करें, फिर प्राप्त गुणनफल को ${t} संख्या से भाग दें।`;
    return `${l} और ${r} संख्या को जोड़ें, फिर प्राप्त योग को ${t} संख्या से भाग दें।`;
  }
  if (ruleId==='THREE_INPUT_SUM') return 'ਤਿੰਨਾਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।';
  if (ruleId==='TWO_ADD_ONE_SUBTRACT') return `${l} ਅਤੇ ${r} ਸੰਖਿਆ ਨੂੰ ਜੋੜੋ, ਫਿਰ ${t} ਸੰਖਿਆ ਘਟਾਓ।`;
  if (ruleId==='PAIR_PRODUCT_ADJUST_THIRD') return context?.sign===-1 ? `${l} ਅਤੇ ${r} ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ${t} ਸੰਖਿਆ ਘਟਾਓ।` : `${l} ਅਤੇ ${r} ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ${t} ਸੰਖਿਆ ਜੋੜੋ।`;
  if (ruleId==='PAIR_SUM_TIMES_THIRD') return `${l} ਅਤੇ ${r} ਸੰਖਿਆ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਜੋੜ ਨੂੰ ${t} ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।`;
  if (ruleId==='PAIR_DIFFERENCE_TIMES_THIRD') return `${l} ਸੰਖਿਆ ਵਿੱਚੋਂ ${r} ਸੰਖਿਆ ਘਟਾਓ, ਫਿਰ ਅੰਤਰ ਨੂੰ ${t} ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।`;
  if (ruleId==='PAIR_PRODUCT_DIVIDE_THIRD') return `${l} ਅਤੇ ${r} ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਗੁਣਨਫਲ ਨੂੰ ${t} ਸੰਖਿਆ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  return `${l} ਅਤੇ ${r} ਸੰਖਿਆ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਜੋੜ ਨੂੰ ${t} ਸੰਖਿਆ ਨਾਲ ਭਾਗ ਦਿਓ।`;
}

function cp003Rule(ruleId:string, context:any, language:'hi'|'pa'):string {
  if(language==='hi'){
    const map:Record<string,string>={
      SQUARE_INPUT:'संख्या का वर्ग करें।', CUBE_INPUT:'संख्या का घन करें।',
      SQUARE_FIRST_PLUS_SECOND:'पहली संख्या का वर्ग करके दूसरी संख्या जोड़ें।',
      SQUARE_FIRST_MINUS_SECOND:'पहली संख्या का वर्ग करके दूसरी संख्या घटाएँ।',
      SUM_OF_SQUARES:'दोनों संख्याओं का वर्ग करें और दोनों वर्गों को जोड़ें।',
      DIFFERENCE_OF_SQUARES:'दोनों संख्याओं का वर्ग करें और पहले वर्ग में से दूसरा वर्ग घटाएँ।',
      PRODUCT_PLUS_FIRST_SQUARE:'दोनों संख्याओं को गुणा करें, फिर पहली संख्या का वर्ग जोड़ें।',
      PRODUCT_PLUS_SECOND_SQUARE:'दोनों संख्याओं को गुणा करें, फिर दूसरी संख्या का वर्ग जोड़ें।',
    };
    if(map[ruleId]) return map[ruleId];
    if(ruleId==='PAIR_SUM_OR_DIFFERENCE_SQUARE') return context?.sign===-1?'दूसरी संख्या को पहली संख्या में से घटाकर परिणाम का वर्ग करें।':'दोनों संख्याओं को जोड़कर परिणाम का वर्ग करें।';
    return context?.sign===-1?'दूसरी संख्या को पहली संख्या में से घटाकर परिणाम का घन करें।':'दोनों संख्याओं को जोड़कर परिणाम का घन करें।';
  }
  const map:Record<string,string>={
    SQUARE_INPUT:'ਸੰਖਿਆ ਦਾ ਵਰਗ ਕਰੋ।', CUBE_INPUT:'ਸੰਖਿਆ ਦਾ ਘਣ ਕਰੋ।',
    SQUARE_FIRST_PLUS_SECOND:'ਪਹਿਲੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਕਰਕੇ ਦੂਜੀ ਸੰਖਿਆ ਜੋੜੋ।',
    SQUARE_FIRST_MINUS_SECOND:'ਪਹਿਲੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਕਰਕੇ ਦੂਜੀ ਸੰਖਿਆ ਘਟਾਓ।',
    SUM_OF_SQUARES:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਦਾ ਵਰਗ ਕਰੋ ਅਤੇ ਦੋਵੇਂ ਵਰਗ ਜੋੜੋ।',
    DIFFERENCE_OF_SQUARES:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਦਾ ਵਰਗ ਕਰੋ ਅਤੇ ਪਹਿਲੇ ਵਰਗ ਵਿੱਚੋਂ ਦੂਜਾ ਵਰਗ ਘਟਾਓ।',
    PRODUCT_PLUS_FIRST_SQUARE:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਪਹਿਲੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਜੋੜੋ।',
    PRODUCT_PLUS_SECOND_SQUARE:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੂਜੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਜੋੜੋ।',
  };
  if(map[ruleId]) return map[ruleId];
  if(ruleId==='PAIR_SUM_OR_DIFFERENCE_SQUARE') return context?.sign===-1?'ਦੂਜੀ ਸੰਖਿਆ ਨੂੰ ਪਹਿਲੀ ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਨਤੀਜੇ ਦਾ ਵਰਗ ਕਰੋ।':'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜ ਕੇ ਨਤੀਜੇ ਦਾ ਵਰਗ ਕਰੋ।';
  return context?.sign===-1?'ਦੂਜੀ ਸੰਖਿਆ ਨੂੰ ਪਹਿਲੀ ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਨਤੀਜੇ ਦਾ ਘਣ ਕਰੋ।':'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜ ਕੇ ਨਤੀਜੇ ਦਾ ਘਣ ਕਰੋ।';
}

function cp004Rule(ruleId:string,language:'hi'|'pa'):string {
  const hi:Record<string,string>={
    N_TIMES_NEXT:'संख्या को उसकी अगली क्रमागत संख्या से गुणा करें।',
    N_TIMES_PREVIOUS:'संख्या को उसकी पिछली क्रमागत संख्या से गुणा करें।',
    A_TIMES_SUM:'दोनों संख्याओं को जोड़ें, फिर योग को पहली संख्या से गुणा करें।',
    B_TIMES_SUM:'दोनों संख्याओं को जोड़ें, फिर योग को दूसरी संख्या से गुणा करें।',
    A_TIMES_DIFFERENCE:'दूसरी संख्या को पहली में से घटाएँ, फिर अंतर को पहली संख्या से गुणा करें।',
    THREE_CONSECUTIVE_PRODUCT:'संख्या और उसकी अगली दो क्रमागत संख्याओं को गुणा करें।',
    THREE_CONSECUTIVE_SUM:'संख्या और उसकी अगली दो क्रमागत संख्याओं को जोड़ें।',
    TRIANGULAR_NUMBER:'संख्या को अगली क्रमागत संख्या से गुणा करके 2 से भाग दें।',
    SMALL_FACTORIAL:'संख्या का फैक्टोरियल लें।',
  };
  const pa:Record<string,string>={
    N_TIMES_NEXT:'ਸੰਖਿਆ ਨੂੰ ਉਸ ਤੋਂ ਅਗਲੀ ਲਗਾਤਾਰ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
    N_TIMES_PREVIOUS:'ਸੰਖਿਆ ਨੂੰ ਉਸ ਤੋਂ ਪਿਛਲੀ ਲਗਾਤਾਰ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
    A_TIMES_SUM:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਜੋੜ ਨੂੰ ਪਹਿਲੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
    B_TIMES_SUM:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਜੋੜ ਨੂੰ ਦੂਜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
    A_TIMES_DIFFERENCE:'ਦੂਜੀ ਸੰਖਿਆ ਨੂੰ ਪਹਿਲੀ ਵਿੱਚੋਂ ਘਟਾਓ, ਫਿਰ ਅੰਤਰ ਨੂੰ ਪਹਿਲੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
    THREE_CONSECUTIVE_PRODUCT:'ਸੰਖਿਆ ਅਤੇ ਉਸ ਤੋਂ ਅਗਲੀਆਂ ਦੋ ਲਗਾਤਾਰ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
    THREE_CONSECUTIVE_SUM:'ਸੰਖਿਆ ਅਤੇ ਉਸ ਤੋਂ ਅਗਲੀਆਂ ਦੋ ਲਗਾਤਾਰ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।',
    TRIANGULAR_NUMBER:'ਸੰਖਿਆ ਨੂੰ ਅਗਲੀ ਲਗਾਤਾਰ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਕੇ 2 ਨਾਲ ਭਾਗ ਦਿਓ।',
    SMALL_FACTORIAL:'ਸੰਖਿਆ ਦਾ ਫੈਕਟੋਰੀਅਲ ਲਵੋ।',
  };
  return (language==='hi'?hi:pa)[ruleId] ?? '';
}

function localizedRule(question:LocalizableQuestion,language:'hi'|'pa'):string {
  if(question.checkpointId==='MIS-CP-001') return cp001Rule(question.ruleId,question.context,language);
  if(question.checkpointId==='MIS-CP-002') return cp002Rule(question.ruleId,question.context,language);
  if(question.checkpointId==='MIS-CP-003') return cp003Rule(question.ruleId,question.context,language);
  if(question.checkpointId==='MIS-CP-004') return cp004Rule(question.ruleId,language);
  throw new Error('MIS localization wave 1 only covers CP001-CP004.');
}

function localizeTraceLine(line:string,language:'hi'|'pa'):string {
  let match=line.match(/^The next number after (\d+) is (\d+)\.$/);
  if(match) return language==='hi'?`${match[1]} के बाद अगली संख्या ${match[2]} है।`:`${match[1]} ਤੋਂ ਅਗਲੀ ਸੰਖਿਆ ${match[2]} ਹੈ।`;
  match=line.match(/^The previous number before (\d+) is (\d+)\.$/);
  if(match) return language==='hi'?`${match[1]} से पहले की संख्या ${match[2]} है।`:`${match[1]} ਤੋਂ ਪਿਛਲੀ ਸੰਖਿਆ ${match[2]} ਹੈ।`;
  match=line.match(/^The next two numbers are (\d+) and (\d+)\.$/);
  if(match) return language==='hi'?`अगली दो संख्याएँ ${match[1]} और ${match[2]} हैं।`:`ਅਗਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  return line;
}

function localizeTrace(trace:string,language:'hi'|'pa'):string {
  return trace.split('\n').map(line=>localizeTraceLine(line,language)).join('\n');
}

function localizedExplanation(question:LocalizableQuestion,language:'hi'|'pa'):string {
  const traces=question.solverTrace.map(trace=>localizeTrace(trace,language));
  const out:string[]=[];
  if(language==='hi'){
    out.push('हर पंक्ति में एक ही नियम लागू है।',localizedRule(question,language),'');
    traces.forEach((trace,index)=>{out.push(`${ordinal(index,language)} पंक्ति:`,trace,'');});
    out.push('अब प्रश्नवाचक चिन्ह वाली पंक्ति पर यही नियम लगाएँ:',traces[traces.length-1] ?? '','',`अतः ? = ${question.answer}।`);
  }else{
    out.push('ਹਰ ਕਤਾਰ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।',localizedRule(question,language),'');
    traces.forEach((trace,index)=>{out.push(`${ordinal(index,language)} ਕਤਾਰ:`,trace,'');});
    out.push('ਹੁਣ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੀ ਕਤਾਰ ਉੱਤੇ ਇਹੀ ਨਿਯਮ ਲਗਾਓ:',traces[traces.length-1] ?? '','',`ਇਸ ਲਈ ? = ${question.answer}।`);
  }
  // The last solver trace is the target. Do not repeat it as an evidence row.
  const evidenceCount=Math.max(0,traces.length-1);
  const head=out.slice(0,3);
  const rows:string[]=[];
  for(let i=0;i<evidenceCount;i++){
    if(language==='hi') rows.push(`${ordinal(i,language)} पंक्ति:`,traces[i]!,'');
    else rows.push(`${ordinal(i,language)} ਕਤਾਰ:`,traces[i]!,'');
  }
  const tail=language==='hi'
    ? ['अब प्रश्नवाचक चिन्ह वाली पंक्ति पर यही नियम लगाएँ:',traces[traces.length-1] ?? '','',`अतः ? = ${question.answer}।`]
    : ['ਹੁਣ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੀ ਕਤਾਰ ਉੱਤੇ ਇਹੀ ਨਿਯਮ ਲਗਾਓ:',traces[traces.length-1] ?? '','',`ਇਸ ਲਈ ? = ${question.answer}।`];
  return [...head,...rows,...tail].join('\n');
}

export function localizeMisWave1Question<T extends LocalizableQuestion>(
  question:T,
  language:MisLocalizedLanguage,
):T {
  if(language==='en') return question;
  if(!['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004'].includes(question.checkpointId)){
    throw new Error('MIS-001 Hindi/Punjabi localization wave 1 currently covers CP001-CP004 only.');
  }
  return {
    ...question,
    stem:localizedStem(question.stem,language),
    explanation:localizedExplanation(question,language),
  };
}

export const MIS_LOCALIZATION_WAVE1_STATE=Object.freeze({
  checkpoints:Object.freeze(['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004'] as const),
  permanentQlCount:31,
  languages:Object.freeze(['en','hi','pa'] as const),
  hindiStatus:'IMPLEMENTED_REVIEW_ONLY' as const,
  punjabiStatus:'IMPLEMENTED_REVIEW_ONLY' as const,
  parityStatus:'WAVE1_EXECUTABLE_GUARD_IMPLEMENTED' as const,
});
