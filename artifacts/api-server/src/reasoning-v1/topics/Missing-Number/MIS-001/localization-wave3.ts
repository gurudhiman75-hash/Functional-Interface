import type { MisLocalizedLanguage } from './localization-wave1';

type Q={
 readonly checkpointId:string;readonly ruleId:string;readonly context:any;readonly stem:string;readonly solverTrace:readonly string[];
 readonly answer:number;readonly forwardOrInverse?:'FORWARD'|'INVERSE';readonly renderer?:string;readonly missingPosition?:string;
};

function stem(stem:string,cp:string,l:'hi'|'pa'):string{
 const lines=stem.split('\n');
 const figure=['MIS-CP-012','MIS-CP-014'].includes(cp)&&/figure/i.test(lines[0]??'');
 lines[0]=l==='hi'
   ? (figure?'निम्न आकृति में लुप्त मान ज्ञात कीजिए।':'प्रश्नवाचक चिन्ह (?) के स्थान पर आने वाली संख्या ज्ञात कीजिए।')
   : (figure?'ਹੇਠਾਂ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਲੁਪਤ ਮੁੱਲ ਪਤਾ ਕਰੋ।':'ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ (?) ਦੀ ਥਾਂ ਆਉਣ ਵਾਲੀ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।');
 return lines.map(x=>{
   const m=x.match(/^Figure (\d+):$/);
   return m?(l==='hi'?`आकृति ${m[1]}:`:`ਆਕ੍ਰਿਤੀ ${m[1]}:`):x;
 }).join('\n');
}
function rule(q:Q,l:'hi'|'pa'):string{
 const k=Number(q.context?.k??2);
 const hi:Record<string,string>={
  DIGIT_SUM:'संख्या के दोनों अंकों को जोड़ें।',
  DIGIT_PRODUCT:'संख्या के दोनों अंकों को गुणा करें।',
  DIGIT_DIFFERENCE:'दोनों अंकों का धनात्मक अंतर लें।',
  NUMBER_PLUS_REVERSE:'दो अंकों की संख्या को उलटें और उसे मूल संख्या में जोड़ें।',
  DIGIT_SUM_PLUS_VISIBLE:'दोनों अंकों को जोड़ें, फिर दूसरी दिखाई गई संख्या जोड़ें।',
  SQUARE_OF_DIGIT_SUM:'दोनों अंकों को जोड़कर प्राप्त योग का वर्ग करें।',
  PAIR_PRODUCT_MINUS_THIRD_SQUARE:'पहली दो संख्याओं को गुणा करें, फिर तीसरी संख्या का वर्ग घटाएँ।',
  FIRST_SQUARE_PLUS_PAIR_PRODUCT:'पहली संख्या का वर्ग करें, फिर दूसरी और तीसरी संख्या का गुणनफल जोड़ें।',
  PAIR_SUM_SQUARE_MINUS_THIRD:'पहली दो संख्याओं को जोड़ें, योग का वर्ग करें, फिर तीसरी संख्या घटाएँ।',
  PAIR_PRODUCT_PLUS_ABS_DIFFERENCE:'पहली दो संख्याओं को गुणा करें, फिर उनका धनात्मक अंतर जोड़ें।',
  SUM:'दोनों संख्याओं को जोड़ें।',
  PRODUCT:'दोनों संख्याओं को गुणा करें।',
  SQUARE_FIRST_PLUS_SECOND:'पहली संख्या का वर्ग करके दूसरी संख्या जोड़ें।',
  ROW_PRODUCTS_SUM:'हर पंक्ति की संख्या-जोड़ी को गुणा करके दोनों गुणनफल जोड़ें।',
  COLUMN_PRODUCTS_SUM:'हर स्तंभ की संख्या-जोड़ी को गुणा करके दोनों गुणनफल जोड़ें।',
  DIAGONAL_PRODUCTS_SUM:'दोनों विकर्णों की संख्या-जोड़ी को गुणा करके दोनों गुणनफल जोड़ें।',
  PAIR_PRODUCT_DIVIDE_CONSTANT:`दोनों संख्याओं को गुणा करें, फिर गुणनफल को ${k} से भाग दें।`,
  PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE:'दोनों संख्याओं को जोड़ें, फिर उनके धनात्मक अंतर का दोगुना घटाएँ।',
  INVARIANT_FOUR_CORNER_SUM_MISSING_CORNER:'हर वर्ग के चारों कोनों का कुल योग समान है। लुप्त कोना ज्ञात करने के लिए बाकी तीन कोनों का योग कुल से घटाएँ।',
  PAIR_PRODUCT_PLUS_FIRST:'पहली दो संख्याओं को गुणा करें, फिर पहली संख्या एक बार और जोड़ें।',
  THREE_INPUT_PRODUCT_PLUS_ONE:'तीनों संख्याओं को गुणा करके 1 जोड़ें।',
  THREE_INPUT_PRODUCT_MINUS_ONE:'तीनों संख्याओं को गुणा करके 1 घटाएँ।',
 };
 const pa:Record<string,string>={
  DIGIT_SUM:'ਸੰਖਿਆ ਦੇ ਦੋਵੇਂ ਅੰਕ ਜੋੜੋ।',
  DIGIT_PRODUCT:'ਸੰਖਿਆ ਦੇ ਦੋਵੇਂ ਅੰਕ ਗੁਣਾ ਕਰੋ।',
  DIGIT_DIFFERENCE:'ਦੋਵੇਂ ਅੰਕਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ।',
  NUMBER_PLUS_REVERSE:'ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਨੂੰ ਉਲਟੋ ਅਤੇ ਉਸਨੂੰ ਮੂਲ ਸੰਖਿਆ ਵਿੱਚ ਜੋੜੋ।',
  DIGIT_SUM_PLUS_VISIBLE:'ਦੋਵੇਂ ਅੰਕ ਜੋੜੋ, ਫਿਰ ਦੂਜੀ ਦਿੱਤੀ ਸੰਖਿਆ ਜੋੜੋ।',
  SQUARE_OF_DIGIT_SUM:'ਦੋਵੇਂ ਅੰਕ ਜੋੜ ਕੇ ਮਿਲੇ ਜੋੜ ਦਾ ਵਰਗ ਕਰੋ।',
  PAIR_PRODUCT_MINUS_THIRD_SQUARE:'ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਤੀਜੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਘਟਾਓ।',
  FIRST_SQUARE_PLUS_PAIR_PRODUCT:'ਪਹਿਲੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਕਰੋ, ਫਿਰ ਦੂਜੀ ਅਤੇ ਤੀਜੀ ਸੰਖਿਆ ਦਾ ਗੁਣਨਫਲ ਜੋੜੋ।',
  PAIR_SUM_SQUARE_MINUS_THIRD:'ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਜੋੜੋ, ਜੋੜ ਦਾ ਵਰਗ ਕਰੋ, ਫਿਰ ਤੀਜੀ ਸੰਖਿਆ ਘਟਾਓ।',
  PAIR_PRODUCT_PLUS_ABS_DIFFERENCE:'ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਜੋੜੋ।',
  SUM:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ।',
  PRODUCT:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
  SQUARE_FIRST_PLUS_SECOND:'ਪਹਿਲੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਕਰਕੇ ਦੂਜੀ ਸੰਖਿਆ ਜੋੜੋ।',
  ROW_PRODUCTS_SUM:'ਹਰ ਕਤਾਰ ਦੀ ਸੰਖਿਆ-ਜੋੜੀ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
  COLUMN_PRODUCTS_SUM:'ਹਰ ਕਾਲਮ ਦੀ ਸੰਖਿਆ-ਜੋੜੀ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
  DIAGONAL_PRODUCTS_SUM:'ਦੋਵੇਂ ਤਿਰਛੀਆਂ ਜੋੜੀਆਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਦੋਵੇਂ ਗੁਣਨਫਲ ਜੋੜੋ।',
  PAIR_PRODUCT_DIVIDE_CONSTANT:`ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਗੁਣਨਫਲ ਨੂੰ ${k} ਨਾਲ ਭਾਗ ਦਿਓ।`,
  PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਦੇ ਧਨਾਤਮਕ ਅੰਤਰ ਦਾ ਦੋਗੁਣਾ ਘਟਾਓ।',
  INVARIANT_FOUR_CORNER_SUM_MISSING_CORNER:'ਹਰ ਵਰਗ ਦੇ ਚਾਰਾਂ ਕੋਨਿਆਂ ਦਾ ਕੁੱਲ ਜੋੜ ਇੱਕੋ ਜਿਹਾ ਹੈ। ਲੁਪਤ ਕੋਨਾ ਪਤਾ ਕਰਨ ਲਈ ਬਾਕੀ ਤਿੰਨ ਕੋਨਿਆਂ ਦਾ ਜੋੜ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾਓ।',
  PAIR_PRODUCT_PLUS_FIRST:'ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਪਹਿਲੀ ਸੰਖਿਆ ਇੱਕ ਵਾਰ ਹੋਰ ਜੋੜੋ।',
  THREE_INPUT_PRODUCT_PLUS_ONE:'ਤਿੰਨਾਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ 1 ਜੋੜੋ।',
  THREE_INPUT_PRODUCT_MINUS_ONE:'ਤਿੰਨਾਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ 1 ਘਟਾਓ।',
 };
 return (l==='hi'?hi:pa)[q.ruleId]??'';
}
function trace(s:string,l:'hi'|'pa'):string{
 let o=s;
 const reps=l==='hi'
 ? [['Reverse ','उलटने पर '],['Testing the missing value ','लुप्त मान '],['Target total = ','लक्ष्य कुल = '],['missing corner = ','लुप्त कोना = '],['sum of the other three corners','अन्य तीन कोनों का योग'],['Figure ','आकृति ']]
 : [['Reverse ','ਉਲਟਣ ਤੇ '],['Testing the missing value ','ਲੁਪਤ ਮੁੱਲ '],['Target total = ','ਲਕਸ਼ਿਤ ਕੁੱਲ = '],['missing corner = ','ਲੁਪਤ ਕੋਨਾ = '],['sum of the other three corners','ਬਾਕੀ ਤਿੰਨ ਕੋਨਿਆਂ ਦਾ ਜੋੜ'],['Figure ','ਆਕ੍ਰਿਤੀ ']];
 for(const [a,b] of reps)o=o.split(a).join(b);
 return o;
}
function explanation(q:Q,l:'hi'|'pa'):string{
 const traces=q.solverTrace.map(x=>trace(x,l)), evidence=traces.slice(0,-1), target=traces.at(-1)??'';
 const figure=['MIS-CP-012','MIS-CP-014'].includes(q.checkpointId)&&q.renderer==='SVG_BOX';
 const intro=l==='hi'
   ? (q.checkpointId==='MIS-CP-010'?'यह अंकों पर आधारित पैटर्न है। पूरी संख्या की जगह उसके अंकों का उपयोग करें।':figure?'हर आकृति में एक ही नियम लागू है।':'हर समूह में एक ही नियम लागू है।')
   : (q.checkpointId==='MIS-CP-010'?'ਇਹ ਅੰਕਾਂ ਉੱਤੇ ਆਧਾਰਿਤ ਪੈਟਰਨ ਹੈ। ਪੂਰੀ ਸੰਖਿਆ ਦੀ ਥਾਂ ਉਸਦੇ ਅੰਕ ਵਰਤੋ।':figure?'ਹਰ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।':'ਹਰ ਸਮੂਹ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।');
 const out=[intro,rule(q,l),''];
 evidence.forEach((x,i)=>out.push(l==='hi'?(figure?`आकृति ${i+1}:`:`समूह ${i+1}:`):(figure?`ਆਕ੍ਰਿਤੀ ${i+1}:`:`ਸਮੂਹ ${i+1}:`),x,''));
 const instruction=l==='hi'
   ? (q.forwardOrInverse==='INVERSE'?'अब प्रश्नवाचक चिन्ह वाले समूह/आकृति में इसी नियम को उल्टा लागू करें:':'अब प्रश्नवाचक चिन्ह वाले समूह/आकृति पर यही नियम लगाएँ:')
   : (q.forwardOrInverse==='INVERSE'?'ਹੁਣ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੇ ਸਮੂਹ/ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਇਹੀ ਨਿਯਮ ਉਲਟ ਤਰੀਕੇ ਨਾਲ ਲਗਾਓ:':'ਹੁਣ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਵਾਲੇ ਸਮੂਹ/ਆਕ੍ਰਿਤੀ ਉੱਤੇ ਇਹੀ ਨਿਯਮ ਲਗਾਓ:');
 out.push(instruction,target,'',l==='hi'?`अतः ? = ${q.answer}।`:`ਇਸ ਲਈ ? = ${q.answer}।`);
 return out.join('\n');
}
export function localizeMisWave3Question<T extends Q>(q:T,language:MisLocalizedLanguage):T{
 if(language==='en')return q;
 if(!['MIS-CP-010','MIS-CP-011','MIS-CP-012','MIS-CP-013','MIS-CP-014','MIS-CP-015'].includes(q.checkpointId))throw new Error('MIS localization wave 3 covers CP010-CP015 only.');
 return {...q,stem:stem(q.stem,q.checkpointId,language),explanation:explanation(q,language)};
}
export const MIS_LOCALIZATION_WAVE3_STATE=Object.freeze({
 checkpoints:Object.freeze(['MIS-CP-010','MIS-CP-011','MIS-CP-012','MIS-CP-013','MIS-CP-014','MIS-CP-015'] as const),
 runtimePatternCount:21, permanentQlCoverageCount:19, languages:Object.freeze(['en','hi','pa'] as const),
 parityStatus:'WAVE3_EXECUTABLE_GUARD_PENDING' as const,
});
