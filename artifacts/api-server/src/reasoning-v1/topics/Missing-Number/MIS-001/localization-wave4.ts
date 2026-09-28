import type { MisLocalizedLanguage } from './localization-wave1';

type Q={
 readonly checkpointId:string;readonly ruleId:string;readonly context:any;readonly stem:string;readonly solverTrace:readonly string[];
 readonly answer:number;readonly renderer?:string;readonly forwardOrInverse?:'FORWARD'|'INVERSE';readonly qlId?:string|null;
};

function localizedStem(q:Q,l:'hi'|'pa'):string{
 const lines=q.stem.split('\n'),figure=(q.renderer??'').startsWith('SVG_');
 lines[0]=l==='hi'
   ? (figure?'निम्न आकृति में लुप्त मान ज्ञात कीजिए।':'लुप्त संख्या ज्ञात कीजिए।')
   : (figure?'ਹੇਠਾਂ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਲੁਪਤ ਮੁੱਲ ਪਤਾ ਕਰੋ।':'ਲੁਪਤ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।');
 return lines.map(line=>{
   let m=line.match(/^Figure ([A-Z0-9]+):$/);
   if(m)return l==='hi'?`आकृति ${m[1]}:`:`ਆਕ੍ਰਿਤੀ ${m[1]}:`;
   m=line.match(/^Opposite pair (\d+): (.*)$/);
   if(m)return l==='hi'?`आमने-सामने की जोड़ी ${m[1]}: ${m[2]}`:`ਆਮਣੇ-ਸਾਮਣੇ ਦੀ ਜੋੜੀ ${m[1]}: ${m[2]}`;
   return line;
 }).join('\n');
}
function rule(q:Q,l:'hi'|'pa'):string{
 const k=Number(q.context?.k??2),m=Number(q.context?.multiplier??3),a=Number(q.context?.addend??1);
 const hi:Record<string,string>={
  PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT:`दो संख्या-जोड़ियों का गुणनफल निकालें, दोनों गुणनफलों का धनात्मक अंतर लें और उसे ${k} से गुणा करें।`,
  SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT:'दूसरी संख्या में से पहली संख्या का आधा घटाएँ, फिर पहली संख्या के दोनों अंकों का गुणनफल जोड़ें।',
  DECREMENT_BOTH_PRODUCT:'दोनों संख्याओं में से 1-1 घटाकर प्राप्त संख्याओं को गुणा करें।',
  FIRST_DIVIDE_CONSTANT_PLUS_SECOND:'पहली संख्या को 2 से भाग दें, फिर दूसरी संख्या जोड़ें।',
  CONTINUE_EQUAL_DIFFERENCE:'पहली और दूसरी संख्या का अंतर निकालें और वही अंतर आगे भी बनाए रखें।',
  FIRST_PLUS_WEIGHTED_SECOND_PLUS_CONSTANT:'दूसरी संख्या को 4 से गुणा करें, उसमें पहली संख्या और 1 जोड़ें।',
  INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND:'दोनों संख्याओं में 1 जोड़ें, संशोधित दूसरी संख्या का आधा लें और उसे संशोधित पहली संख्या से गुणा करें।',
  FIRST_MINUS_CONSTANT_TIMES_SECOND:`पहली संख्या में से ${k} घटाएँ, फिर परिणाम को दूसरी संख्या से गुणा करें।`,
  FIRST_CUBE_MINUS_SECOND_SQUARE:'पहली संख्या का घन करें और उसमें से दूसरी संख्या का वर्ग घटाएँ।',
  PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND:`दोनों संख्याओं को जोड़ें, योग को ${k} से गुणा करें, फिर दूसरी संख्या जोड़ें।`,
  FOUR_INPUT_SUM_TIMES_CONSTANT:`चारों संख्याओं को जोड़ें और योग को ${k} से गुणा करें।`,
  SQUARE_ROOT_OF_PRODUCT:'दोनों संख्याओं को गुणा करें और गुणनफल का सटीक वर्गमूल लें।',
  SQUARE_ROOT_DIFFERENCE:'दोनों पूर्ण वर्गों के वर्गमूल लें और दूसरे वर्गमूल को पहले में से घटाएँ।',
  CUBE_ROOT_SUM:'दोनों पूर्ण घनों के घनमूल लें और उन्हें जोड़ें।',
  CUBE_ROOT_OF_DIFFERENCE:'दोनों संख्याओं का धनात्मक अंतर लें और उसका सटीक घनमूल निकालें।',
  PAIR_PRODUCT_PLUS_ONE_TIMES_THIRD:'पहली दो संख्याओं को गुणा करें, 1 जोड़ें, फिर परिणाम को तीसरी संख्या से गुणा करें।',
  PAIR_ARITHMETIC_MEAN:'दोनों संख्याओं को जोड़ें और योग को 2 से भाग दें।',
  ROOT_SUM_TIMES_THIRD_PLUS_TWO:'पहली दो संख्याओं के वर्गमूल जोड़ें, योग को तीसरी संख्या से गुणा करें, फिर 2 जोड़ें।',
  SECOND_INPUT_AFFINE:`दूसरी संख्या को ${m} से गुणा करके ${a} जोड़ें।`,
  SHARED_FACTOR_DUAL_PRODUCT:'बीच की साझा संख्या को बाईं संख्या से गुणा करने पर बायाँ परिणाम और दाईं संख्या से गुणा करने पर दायाँ परिणाम मिलता है।',
  OPPOSITE_PAIR_SQUARE:'हर आमने-सामने की जोड़ी में एक संख्या दूसरी संख्या का वर्ग है।',
  SUM_OF_CUBES:'दोनों संख्याओं का अलग-अलग घन करें, फिर दोनों घनों को जोड़ें।',
  ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD:'तीनों संख्याओं के वर्गमूल लें। दूसरे वर्गमूल को पहले में से घटाएँ और तीसरा वर्गमूल जोड़ें।',
 };
 const pa:Record<string,string>={
  PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT:`ਦੋ ਸੰਖਿਆ-ਜੋੜੀਆਂ ਦੇ ਗੁਣਨਫਲ ਕੱਢੋ, ਦੋਵੇਂ ਗੁਣਨਫਲਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ ਅਤੇ ਉਸਨੂੰ ${k} ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
  SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT:'ਦੂਜੀ ਸੰਖਿਆ ਵਿੱਚੋਂ ਪਹਿਲੀ ਸੰਖਿਆ ਦਾ ਅੱਧਾ ਘਟਾਓ, ਫਿਰ ਪਹਿਲੀ ਸੰਖਿਆ ਦੇ ਦੋਵੇਂ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ਜੋੜੋ।',
  DECREMENT_BOTH_PRODUCT:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਵਿੱਚੋਂ 1-1 ਘਟਾ ਕੇ ਮਿਲੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।',
  FIRST_DIVIDE_CONSTANT_PLUS_SECOND:'ਪਹਿਲੀ ਸੰਖਿਆ ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦਿਓ, ਫਿਰ ਦੂਜੀ ਸੰਖਿਆ ਜੋੜੋ।',
  CONTINUE_EQUAL_DIFFERENCE:'ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਸੰਖਿਆ ਦਾ ਅੰਤਰ ਕੱਢੋ ਅਤੇ ਅੱਗੇ ਵੀ ਉਹੀ ਅੰਤਰ ਰੱਖੋ।',
  FIRST_PLUS_WEIGHTED_SECOND_PLUS_CONSTANT:'ਦੂਜੀ ਸੰਖਿਆ ਨੂੰ 4 ਨਾਲ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਪਹਿਲੀ ਸੰਖਿਆ ਅਤੇ 1 ਜੋੜੋ।',
  INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਵਿੱਚ 1 ਜੋੜੋ, ਬਦਲੀ ਹੋਈ ਦੂਜੀ ਸੰਖਿਆ ਦਾ ਅੱਧਾ ਲਵੋ ਅਤੇ ਉਸਨੂੰ ਬਦਲੀ ਹੋਈ ਪਹਿਲੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
  FIRST_MINUS_CONSTANT_TIMES_SECOND:`ਪਹਿਲੀ ਸੰਖਿਆ ਵਿੱਚੋਂ ${k} ਘਟਾਓ, ਫਿਰ ਨਤੀਜੇ ਨੂੰ ਦੂਜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
  FIRST_CUBE_MINUS_SECOND_SQUARE:'ਪਹਿਲੀ ਸੰਖਿਆ ਦਾ ਘਣ ਕਰੋ ਅਤੇ ਉਸ ਵਿੱਚੋਂ ਦੂਜੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਘਟਾਓ।',
  PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND:`ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ, ਜੋੜ ਨੂੰ ${k} ਨਾਲ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਦੂਜੀ ਸੰਖਿਆ ਜੋੜੋ।`,
  FOUR_INPUT_SUM_TIMES_CONSTANT:`ਚਾਰਾਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ ਅਤੇ ਜੋੜ ਨੂੰ ${k} ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
  SQUARE_ROOT_OF_PRODUCT:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ ਅਤੇ ਗੁਣਨਫਲ ਦਾ ਸਹੀ ਵਰਗਮੂਲ ਲਵੋ।',
  SQUARE_ROOT_DIFFERENCE:'ਦੋਵੇਂ ਪੂਰਨ ਵਰਗਾਂ ਦੇ ਵਰਗਮੂਲ ਲਵੋ ਅਤੇ ਦੂਜਾ ਵਰਗਮੂਲ ਪਹਿਲੇ ਵਿੱਚੋਂ ਘਟਾਓ।',
  CUBE_ROOT_SUM:'ਦੋਵੇਂ ਪੂਰਨ ਘਣਾਂ ਦੇ ਘਣਮੂਲ ਲਵੋ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜੋ।',
  CUBE_ROOT_OF_DIFFERENCE:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਵੋ ਅਤੇ ਉਸਦਾ ਸਹੀ ਘਣਮੂਲ ਕੱਢੋ।',
  PAIR_PRODUCT_PLUS_ONE_TIMES_THIRD:'ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ, 1 ਜੋੜੋ, ਫਿਰ ਨਤੀਜੇ ਨੂੰ ਤੀਜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ।',
  PAIR_ARITHMETIC_MEAN:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜੋ ਅਤੇ ਜੋੜ ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦਿਓ।',
  ROOT_SUM_TIMES_THIRD_PLUS_TWO:'ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦੇ ਵਰਗਮੂਲ ਜੋੜੋ, ਜੋੜ ਨੂੰ ਤੀਜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰੋ, ਫਿਰ 2 ਜੋੜੋ।',
  SECOND_INPUT_AFFINE:`ਦੂਜੀ ਸੰਖਿਆ ਨੂੰ ${m} ਨਾਲ ਗੁਣਾ ਕਰਕੇ ${a} ਜੋੜੋ।`,
  SHARED_FACTOR_DUAL_PRODUCT:'ਵਿਚਕਾਰਲੀ ਸਾਂਝੀ ਸੰਖਿਆ ਨੂੰ ਖੱਬੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਖੱਬਾ ਨਤੀਜਾ ਅਤੇ ਸੱਜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਸੱਜਾ ਨਤੀਜਾ ਮਿਲਦਾ ਹੈ।',
  OPPOSITE_PAIR_SQUARE:'ਹਰ ਆਮਣੇ-ਸਾਮਣੇ ਦੀ ਜੋੜੀ ਵਿੱਚ ਇੱਕ ਸੰਖਿਆ ਦੂਜੀ ਸੰਖਿਆ ਦਾ ਵਰਗ ਹੈ।',
  SUM_OF_CUBES:'ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਦਾ ਵੱਖ-ਵੱਖ ਘਣ ਕਰੋ, ਫਿਰ ਦੋਵੇਂ ਘਣ ਜੋੜੋ।',
  ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD:'ਤਿੰਨਾਂ ਸੰਖਿਆਵਾਂ ਦੇ ਵਰਗਮੂਲ ਲਵੋ। ਦੂਜਾ ਵਰਗਮੂਲ ਪਹਿਲੇ ਵਿੱਚੋਂ ਘਟਾਓ ਅਤੇ ਤੀਜਾ ਵਰਗਮੂਲ ਜੋੜੋ।',
 };
 return (l==='hi'?hi:pa)[q.ruleId]??'';
}
function trace(s:string,l:'hi'|'pa'):string{
 let o=s;
 o=o.replace(/Product of digits of (\d+) = (\d+)/g,(_all,n,p)=>
   l==='hi'
     ? `${n} के अंकों का गुणनफल = ${p}`
     : `${n} ਦੇ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ = ${p}`
 );
 const reps=l==='hi'
 ? [['Top pair:','ऊपरी जोड़ी:'],['Bottom pair:','निचली जोड़ी:'],['Source row check:','पंक्ति जाँच:'],['Target pair:','अंतिम जोड़ी:'],['Pair ','जोड़ी '],['Figure ','आकृति ']]
 : [['Top pair:','ਉੱਪਰਲੀ ਜੋੜੀ:'],['Bottom pair:','ਹੇਠਲੀ ਜੋੜੀ:'],['Source row check:','ਕਤਾਰ ਜਾਂਚ:'],['Target pair:','ਆਖਰੀ ਜੋੜੀ:'],['Pair ','ਜੋੜੀ '],['Figure ','ਆਕ੍ਰਿਤੀ ']];
 for(const [a,b] of reps)o=o.split(a).join(b);
 return o;
}
function explanation(q:Q,l:'hi'|'pa'):string{
 const traces=q.solverTrace.map(x=>trace(x,l)),evidence=traces.slice(0,-1),target=traces.at(-1)??'';
 const figure=(q.renderer??'').startsWith('SVG_');
 const out:string[]=[l==='hi'?(figure?'हर आकृति में एक ही नियम लागू है।':'हर पंक्ति में एक ही नियम लागू है।'):(figure?'ਹਰ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।':'ਹਰ ਕਤਾਰ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।'),rule(q,l),''];
 evidence.forEach((x,i)=>out.push(l==='hi'?(figure?`आकृति ${i+1}:`:`पंक्ति ${i+1}:`):(figure?`ਆਕ੍ਰਿਤੀ ${i+1}:`:`ਕਤਾਰ ${i+1}:`),x,''));
 out.push(l==='hi'?'अब यही नियम लुप्त मान पर लगाएँ:':'ਹੁਣ ਇਹੀ ਨਿਯਮ ਲੁਪਤ ਮੁੱਲ ਉੱਤੇ ਲਗਾਓ:',target,'',l==='hi'?`अतः ? = ${q.answer}।`:`ਇਸ ਲਈ ? = ${q.answer}।`);
 return out.join('\n');
}
export function localizeMisWave4Question<T extends Q>(q:T,language:MisLocalizedLanguage):T{
 if(language==='en')return q;
 const n=Number(q.checkpointId.slice(-3));
 if(n<16||n>28)throw new Error('MIS localization wave 4 covers CP016-CP028 only.');
 return {...q,stem:localizedStem(q,language),explanation:explanation(q,language)};
}
export const MIS_LOCALIZATION_WAVE4_STATE=Object.freeze({
 checkpoints:Object.freeze(Array.from({length:13},(_,i)=>`MIS-CP-${String(i+16).padStart(3,'0')}`)),
 runtimePatternCount:23, permanentQlCoverageCount:22, sourceThinLocalizedRuntimeCount:1,
 languages:Object.freeze(['en','hi','pa'] as const), parityStatus:'WAVE4_EXECUTABLE_GUARD_IMPLEMENTED' as const,
});
