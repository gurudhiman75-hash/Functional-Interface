import type { MisLocalizedLanguage } from './localization-wave1';

type Q = {
  readonly checkpointId:string;
  readonly ruleId:string;
  readonly stem:string;
  readonly explanation:string;
  readonly solverTrace:readonly string[];
  readonly answer:number;
  readonly forwardOrInverse?:'FORWARD'|'INVERSE';
};

function firstLine(cp:string, language:'hi'|'pa'):string {
  const figure = ['MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-009'].includes(cp);
  if(language==='hi') return figure
    ? 'निम्न आकृति में लुप्त मान ज्ञात कीजिए।'
    : 'प्रश्नवाचक चिन्ह (?) के स्थान पर आने वाली संख्या ज्ञात कीजिए।';
  return figure
    ? 'ਹੇਠਾਂ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਲੁਪਤ ਮੁੱਲ ਪਤਾ ਕਰੋ।'
    : 'ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ (?) ਦੀ ਥਾਂ ਆਉਣ ਵਾਲੀ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।';
}

function localizeStem(stem:string, cp:string, language:'hi'|'pa'):string {
  const lines=stem.split('\n');
  lines[0]=firstLine(cp,language);
  return lines.map(line=>{
    const m=line.match(/^Figure (\d+):$/);
    if(!m) return line;
    return language==='hi' ? `आकृति ${m[1]}:` : `ਆਕ੍ਰਿਤੀ ${m[1]}:`;
  }).join('\n');
}

function rule005(id:string,l:'hi'|'pa'):string {
  const hi:Record<string,string>={
    TOP_LEFT_PRODUCT_PLUS_RIGHT:'ऊपरी और बाईं संख्या को गुणा करके दाईं संख्या जोड़ें।',
    TOP_LEFT_PRODUCT_MINUS_RIGHT:'ऊपरी और बाईं संख्या को गुणा करके दाईं संख्या घटाएँ।',
    LEFT_RIGHT_PRODUCT_PLUS_TOP:'बाईं और दाईं संख्या को गुणा करके ऊपरी संख्या जोड़ें।',
    LEFT_RIGHT_PRODUCT_MINUS_TOP:'बाईं और दाईं संख्या को गुणा करके ऊपरी संख्या घटाएँ।',
    SUM_THREE_VERTICES:'ऊपरी, बाईं और दाईं तीनों संख्याओं को जोड़ें।',
    TOP_LEFT_SUM_TIMES_RIGHT:'ऊपरी और बाईं संख्या को जोड़ें, फिर योग को दाईं संख्या से गुणा करें।',
    LEFT_RIGHT_SUM_TIMES_TOP:'बाईं और दाईं संख्या को जोड़ें, फिर योग को ऊपरी संख्या से गुणा करें।',
    LEFT_RIGHT_SQUARES_SUM:'बाईं और दाईं संख्या का वर्ग करके दोनों वर्गों को जोड़ें।',
  };
  const pa:Record<string,string>={
    TOP_LEFT_PRODUCT_PLUS_RIGHT:'ਉੱਪਰਲੀ ਅਤੇ ਖੱਬੀ ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਸੱਜੀ ਸੰਖਿਆ ਜੋੜੋ।',
    TOP_LEFT_PRODUCT_MINUS_RIGHT:'ਉੱਪਰਲੀ ਅਤੇ ਖੱਬੀ ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਸੱਜੀ ਸੰਖਿਆ ਘਟਾਓ।',
    LEFT_RIGHT_PRODUCT_PLUS_TOP:'ਖੱਬੀ ਅਤੇ ਸੱਜੀ ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਉੱਪਰਲੀ ਸੰਖਿਆ ਜੋੜੋ।',
    LEFT_RIGHT_PRODUCT_MINUS_TOP:'ਖੱਬੀ ਅਤੇ ਸੱਜੀ ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਉੱਪਰਲੀ ਸੰਖਿਆ ਘਟਾਓ।',
    SUM_THREE_VERTICES:'ਉੱਪਰਲੀ, ਖੱਬੀ ਅਤੇ ਸੱਜੀ ਤਿੰਨਾਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।',
    TOP_LEFT_SUM_TIMES_RIGHT:'ਉੱਪਰਲੀ ਅਤੇ ਖੱਬੀ ਸੰਖਿਆ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਜੋੜ ਨੂੰ ਸੱਜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
    LEFT_RIGHT_SUM_TIMES_TOP:'ਖੱਬੀ ਅਤੇ ਸੱਜੀ ਸੰਖਿਆ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਜੋੜ ਨੂੰ ਉੱਪਰਲੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
    LEFT_RIGHT_SQUARES_SUM:'ਖੱਬੀ ਅਤੇ ਸੱਜੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਕਰਕੇ ਦੋਵੇਂ ਵਰਗ ਜੋੜੋ।',
  };
  return (l==='hi'?hi:pa)[id]??'';
}
function rule006(id:string,l:'hi'|'pa'):string {
  const hi:Record<string,string>={
    SUM_THREE_SURROUNDING:'चारों ओर दी गई तीन संख्याओं को जोड़ें।',
    SUM_FOUR_SURROUNDING:'चारों ओर दी गई चारों संख्याओं को जोड़ें।',
    TOP_RIGHT_PRODUCT_MINUS_BOTTOM:'ऊपरी और दाईं संख्या को गुणा करके निचली संख्या घटाएँ।',
    OPPOSITE_SUM_DIFFERENCE:'आमने-सामने की प्रत्येक जोड़ी को जोड़ें, फिर दोनों योगों का धनात्मक अंतर लें।',
    OPPOSITE_PRODUCT_DIFFERENCE:'आमने-सामने की प्रत्येक जोड़ी को गुणा करें, फिर दोनों गुणनफलों का धनात्मक अंतर लें।',
    OPPOSITE_PRODUCT_SUM:'आमने-सामने की प्रत्येक जोड़ी को गुणा करें, फिर दोनों गुणनफल जोड़ें।',
    OPPOSITE_SUM_PRODUCT:'आमने-सामने की प्रत्येक जोड़ी को जोड़ें, फिर दोनों योगों को गुणा करें।',
  };
  const pa:Record<string,string>={
    SUM_THREE_SURROUNDING:'ਚਾਰੋਂ ਪਾਸੇ ਦਿੱਤੀਆਂ ਤਿੰਨ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।',
    SUM_FOUR_SURROUNDING:'ਚਾਰੋਂ ਪਾਸੇ ਦਿੱਤੀਆਂ ਚਾਰਾਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।',
    TOP_RIGHT_PRODUCT_MINUS_BOTTOM:'ਉੱਪਰਲੀ ਅਤੇ ਸੱਜੀ ਸੰਖਿਆ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਹੇਠਲੀ ਸੰਖਿਆ ਘਟਾਓ।',
    OPPOSITE_SUM_DIFFERENCE:'ਆਮਣੇ-ਸਾਮਣੇ ਦੀ ਹਰ ਜੋੜੀ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਦੋਵੇਂ ਜੋੜਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ।',
    OPPOSITE_PRODUCT_DIFFERENCE:'ਆਮਣੇ-ਸਾਮਣੇ ਦੀ ਹਰ ਜੋੜੀ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ।',
    OPPOSITE_PRODUCT_SUM:'ਆਮਣੇ-ਸਾਮਣੇ ਦੀ ਹਰ ਜੋੜੀ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
    OPPOSITE_SUM_PRODUCT:'ਆਮਣੇ-ਸਾਮਣੇ ਦੀ ਹਰ ਜੋੜੀ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਦੋਵੇਂ ਜੋੜਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
  };
  return (l==='hi'?hi:pa)[id]??'';
}
function rule007(id:string,l:'hi'|'pa'):string {
  const hi:Record<string,string>={
    SUM_FOUR_CORNERS:'चारों कोनों की संख्याओं को जोड़ें।',
    ROW_PRODUCTS_SUM:'ऊपरी पंक्ति की दोनों और निचली पंक्ति की दोनों संख्याओं को गुणा करें, फिर दोनों गुणनफल जोड़ें।',
    COLUMN_PRODUCTS_SUM:'बाएँ स्तंभ की दोनों और दाएँ स्तंभ की दोनों संख्याओं को गुणा करें, फिर दोनों गुणनफल जोड़ें।',
    ROW_PRODUCTS_DIFFERENCE:'दोनों पंक्तियों की संख्या-जोड़ी को गुणा करें, फिर दोनों गुणनफलों का धनात्मक अंतर लें।',
    TOP_SUM_TIMES_BOTTOM_DIFFERENCE:'ऊपरी दोनों संख्याएँ जोड़ें, नीचे दाईं संख्या को नीचे बाईं संख्या में से घटाएँ, फिर दोनों परिणामों को गुणा करें।',
    DIAGONAL_PRODUCTS_SUM:'दोनों विकर्णों की संख्या-जोड़ी को गुणा करें, फिर दोनों गुणनफल जोड़ें।',
    DIAGONAL_PRODUCTS_DIFFERENCE:'दोनों विकर्णों की संख्या-जोड़ी को गुणा करें, फिर दोनों गुणनफलों का धनात्मक अंतर लें।',
  };
  const pa:Record<string,string>={
    SUM_FOUR_CORNERS:'ਚਾਰਾਂ ਕੋਨਿਆਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।',
    ROW_PRODUCTS_SUM:'ਉੱਪਰਲੀ ਕਤਾਰ ਦੀਆਂ ਦੋਵੇਂ ਅਤੇ ਹੇਠਲੀ ਕਤਾਰ ਦੀਆਂ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
    COLUMN_PRODUCTS_SUM:'ਖੱਬੇ ਕਾਲਮ ਦੀਆਂ ਦੋਵੇਂ ਅਤੇ ਸੱਜੇ ਕਾਲਮ ਦੀਆਂ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
    ROW_PRODUCTS_DIFFERENCE:'ਦੋਵੇਂ ਕਤਾਰਾਂ ਦੀ ਸੰਖਿਆ-ਜੋੜੀ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ।',
    TOP_SUM_TIMES_BOTTOM_DIFFERENCE:'ਉੱਪਰਲੀਆਂ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਜੋੜੋ, ਹੇਠਾਂ ਸੱਜੀ ਸੰਖਿਆ ਨੂੰ ਹੇਠਾਂ ਖੱਬੀ ਵਿੱਚੋਂ ਘਟਾਓ, ਫਿਰ ਦੋਵੇਂ ਨਤੀਜਿਆਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
    DIAGONAL_PRODUCTS_SUM:'ਦੋਵੇਂ ਤਿਰਛੀਆਂ ਜੋੜੀਆਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
    DIAGONAL_PRODUCTS_DIFFERENCE:'ਦੋਵੇਂ ਤਿਰਛੀਆਂ ਜੋੜੀਆਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ।',
  };
  return (l==='hi'?hi:pa)[id]??'';
}
function rule008(id:string,l:'hi'|'pa'):string {
  const hi:Record<string,string>={
    INVERSE_SUM:'परिणाम = पहली संख्या + दूसरी संख्या।',
    INVERSE_PRODUCT:'परिणाम = पहली संख्या × दूसरी संख्या।',
    INVERSE_PRODUCT_MINUS_SECOND:'परिणाम = पहली संख्या × दूसरी संख्या − दूसरी संख्या।',
    INVERSE_SQUARE_PLUS_SECOND:'परिणाम = पहली संख्या² + दूसरी संख्या।',
    INVERSE_SUM_TIMES_THIRD:'परिणाम = (पहली संख्या + दूसरी संख्या) × तीसरी संख्या।',
    INVERSE_TRIANGLE_PRODUCT_MINUS_TOP:'मध्य मान = बाईं संख्या × दाईं संख्या − ऊपरी संख्या।',
  };
  const pa:Record<string,string>={
    INVERSE_SUM:'ਨਤੀਜਾ = ਪਹਿਲੀ ਸੰਖਿਆ + ਦੂਜੀ ਸੰਖਿਆ।',
    INVERSE_PRODUCT:'ਨਤੀਜਾ = ਪਹਿਲੀ ਸੰਖਿਆ × ਦੂਜੀ ਸੰਖਿਆ।',
    INVERSE_PRODUCT_MINUS_SECOND:'ਨਤੀਜਾ = ਪਹਿਲੀ ਸੰਖਿਆ × ਦੂਜੀ ਸੰਖਿਆ − ਦੂਜੀ ਸੰਖਿਆ।',
    INVERSE_SQUARE_PLUS_SECOND:'ਨਤੀਜਾ = ਪਹਿਲੀ ਸੰਖਿਆ² + ਦੂਜੀ ਸੰਖਿਆ।',
    INVERSE_SUM_TIMES_THIRD:'ਨਤੀਜਾ = (ਪਹਿਲੀ ਸੰਖਿਆ + ਦੂਜੀ ਸੰਖਿਆ) × ਤੀਜੀ ਸੰਖਿਆ।',
    INVERSE_TRIANGLE_PRODUCT_MINUS_TOP:'ਵਿਚਕਾਰਲਾ ਮੁੱਲ = ਖੱਬੀ ਸੰਖਿਆ × ਸੱਜੀ ਸੰਖਿਆ − ਉੱਪਰਲੀ ਸੰਖਿਆ।',
  };
  return (l==='hi'?hi:pa)[id]??'';
}
function rule009(id:string,l:'hi'|'pa'):string {
  const hi:Record<string,string>={
    ROW_PRODUCTS_SUM:'प्रत्येक पंक्ति की दोनों संख्याओं को गुणा करें, फिर दोनों गुणनफल जोड़ें।',
    ROW_PRODUCTS_SUBTRACT:'प्रत्येक पंक्ति की दोनों संख्याओं को गुणा करें, फिर ऊपरी गुणनफल में से निचला गुणनफल घटाएँ।',
    COLUMN_PRODUCTS_SUM:'प्रत्येक स्तंभ की दोनों संख्याओं को गुणा करें, फिर दोनों गुणनफल जोड़ें।',
    DIAGONAL_PRODUCTS_SUM:'प्रत्येक विकर्ण की संख्या-जोड़ी को गुणा करें, फिर दोनों गुणनफल जोड़ें।',
    ROW_SUMS_PRODUCT:'प्रत्येक पंक्ति की दोनों संख्याओं को जोड़ें, फिर दोनों योगों को गुणा करें।',
    TOP_DIFFERENCE_BOTTOM_SUM_PRODUCT:'ऊपरी पंक्ति में घटाव करें, निचली पंक्ति की संख्याएँ जोड़ें, फिर दोनों परिणामों को गुणा करें।',
  };
  const pa:Record<string,string>={
    ROW_PRODUCTS_SUM:'ਹਰ ਕਤਾਰ ਦੀਆਂ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
    ROW_PRODUCTS_SUBTRACT:'ਹਰ ਕਤਾਰ ਦੀਆਂ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਉੱਪਰਲੇ ਗੁਣਨਫਲ ਵਿੱਚੋਂ ਹੇਠਲਾ ਗੁਣਨਫਲ ਘਟਾਓ।',
    COLUMN_PRODUCTS_SUM:'ਹਰ ਕਾਲਮ ਦੀਆਂ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
    DIAGONAL_PRODUCTS_SUM:'ਹਰ ਤਿਰਛੀ ਜੋੜੀ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
    ROW_SUMS_PRODUCT:'ਹਰ ਕਤਾਰ ਦੀਆਂ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਦੋਵੇਂ ਜੋੜਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
    TOP_DIFFERENCE_BOTTOM_SUM_PRODUCT:'ਉੱਪਰਲੀ ਕਤਾਰ ਵਿੱਚ ਘਟਾਓ ਕਰੋ, ਹੇਠਲੀ ਕਤਾਰ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਜੋੜੋ, ਫਿਰ ਦੋਵੇਂ ਨਤੀਜਿਆਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
  };
  return (l==='hi'?hi:pa)[id]??'';
}
function rule(q:Q,l:'hi'|'pa'):string{
  if(q.checkpointId==='MIS-CP-005')return rule005(q.ruleId,l);
  if(q.checkpointId==='MIS-CP-006')return rule006(q.ruleId,l);
  if(q.checkpointId==='MIS-CP-007')return rule007(q.ruleId,l);
  if(q.checkpointId==='MIS-CP-008')return rule008(q.ruleId,l);
  return rule009(q.ruleId,l);
}
function trace(s:string,l:'hi'|'pa'):string{
  const rep=l==='hi'
    ? [['Top row:','ऊपरी पंक्ति:'],['Bottom row:','निचली पंक्ति:'],['Left column:','बायाँ स्तंभ:'],['Right column:','दायाँ स्तंभ:'],['Top + bottom:','ऊपर + नीचे:'],['Left + right:','बायाँ + दायाँ:'],['Top × bottom:','ऊपर × नीचे:'],['Left × right:','बायाँ × दायाँ:'],['One diagonal:','एक विकर्ण:'],['Other diagonal:','दूसरा विकर्ण:'],['Top:','ऊपर:'],['Bottom:','नीचे:'],['Left × right:','बायाँ × दायाँ:'],[' − top ',' − ऊपरी संख्या ']]
    : [['Top row:','ਉੱਪਰਲੀ ਕਤਾਰ:'],['Bottom row:','ਹੇਠਲੀ ਕਤਾਰ:'],['Left column:','ਖੱਬਾ ਕਾਲਮ:'],['Right column:','ਸੱਜਾ ਕਾਲਮ:'],['Top + bottom:','ਉੱਪਰ + ਹੇਠਾਂ:'],['Left + right:','ਖੱਬਾ + ਸੱਜਾ:'],['Top × bottom:','ਉੱਪਰ × ਹੇਠਾਂ:'],['Left × right:','ਖੱਬਾ × ਸੱਜਾ:'],['One diagonal:','ਇੱਕ ਤਿਰਛੀ ਜੋੜੀ:'],['Other diagonal:','ਦੂਜੀ ਤਿਰਛੀ ਜੋੜੀ:'],['Top:','ਉੱਪਰ:'],['Bottom:','ਹੇਠਾਂ:'],['Left × right:','ਖੱਬਾ × ਸੱਜਾ:'],[' − top ',' − ਉੱਪਰਲੀ ਸੰਖਿਆ ']];
  let out=s; for(const [a,b] of rep) out=out.split(a).join(b); return out;
}
function explanation(q:Q,l:'hi'|'pa'):string{
  const traces=q.solverTrace.map(x=>trace(x,l)), evidence=traces.slice(0,-1), target=traces.at(-1)??'';
  const isFigure=['MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-009'].includes(q.checkpointId);
  const lines:string[]=[];
  if(l==='hi'){
    lines.push(isFigure?'हर आकृति में एक ही नियम लागू है।':'हर समूह में एक ही नियम लागू है।',rule(q,l),'');
    evidence.forEach((x,i)=>lines.push(isFigure?`आकृति ${i+1}:`:`पूर्ण समूह ${i+1}:`,x,''));
    lines.push(q.forwardOrInverse==='INVERSE'?'अब प्रश्नवाचक चिन्ह वाले समूह में इसी नियम को उल्टा लागू करें:':isFigure?'अब प्रश्नवाचक चिन्ह वाली आकृति पर यही नियम लगाएँ:':'अब प्रश्नवाचक चिन्ह वाले समूह पर यही नियम लगाएँ:',target,'',`अतः ? = ${q.answer}।`);
  }else{
    lines.push(isFigure?'ਹਰ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।':'ਹਰ ਸਮੂਹ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।',rule(q,l),'');
    evidence.forEach((x,i)=>lines.push(isFigure?`ਆਕ੍ਰਿਤੀ ${i+1}:`:`ਪੂਰਾ ਸਮੂਹ ${i+1}:`,x,''));
    lines.push(q.forwardOrInverse==='INVERSE'?'ਹੁਣ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਇਹੀ ਨਿਯਮ ਉਲਟ ਤਰੀਕੇ ਨਾਲ ਲਗਾਓ:':isFigure?'ਹੁਣ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਉੱਤੇ ਇਹੀ ਨਿਯਮ ਲਗਾਓ:':'ਹੁਣ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੇ ਸਮੂਹ ਉੱਤੇ ਇਹੀ ਨਿਯਮ ਲਗਾਓ:',target,'',`ਇਸ ਲਈ ? = ${q.answer}।`);
  }
  return lines.join('\n');
}

export function localizeMisWave2Question<T extends Q>(q:T,language:MisLocalizedLanguage):T{
  if(language==='en')return q;
  if(!['MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-008','MIS-CP-009'].includes(q.checkpointId))throw new Error('MIS localization wave 2 covers CP005-CP009 only.');
  return {...q,stem:localizeStem(q.stem,q.checkpointId,language),explanation:explanation(q,language)};
}
export const MIS_LOCALIZATION_WAVE2_STATE=Object.freeze({
  checkpoints:Object.freeze(['MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-008','MIS-CP-009'] as const),
  runtimePatternCount:34,
  permanentQlCoverageCount:15,
  languages:Object.freeze(['en','hi','pa'] as const),
  parityStatus:'WAVE2_EXECUTABLE_GUARD_IMPLEMENTED' as const,
});
