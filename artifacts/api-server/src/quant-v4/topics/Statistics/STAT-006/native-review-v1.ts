import type { Stat006Question } from './types';
import { getStat006PermanentQl } from './permanent-ql-registry';
import { solveStat006State } from './moments-shape';
export function normalizeStat006Language(value?: string): 'en'|'hi'|'pa' {
 const language=(value??'en').trim().toLowerCase().replace(/-(in)$/,'');
 if(language!=='en'&&language!=='hi'&&language!=='pa')throw new Error(`Unsupported STAT-006 language: ${language}`);
 return language;
}
const fmt=(n:number)=>String(Math.round(n*100)/100);
const words:Record<string,readonly [string,string]>={
 'Positively skewed':['धनात्मक विषमता','ਧਨਾਤਮਕ ਵਿਸ਼ਮਤਾ'],
 'Negatively skewed':['ऋणात्मक विषमता','ਰਿਣਾਤਮਕ ਵਿਸ਼ਮਤਾ'],
 'Zero third-moment skewness':['तृतीय आघूर्ण पर आधारित विषमता शून्य है','ਤੀਜੇ ਆਘੂਰਨ ਉੱਤੇ ਆਧਾਰਿਤ ਵਿਸ਼ਮਤਾ ਸਿਫ਼ਰ ਹੈ'],
 'Cannot be determined':['निर्धारित नहीं किया जा सकता','ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ'],
 'Platykurtic':['अल्पककुदी','ਅਲਪਕਕੁਦੀ'], 'Mesokurtic':['समककुदी','ਸਮਕਕੁਦੀ'], 'Leptokurtic':['अधिकककुदी','ਅਧਿਕਕਕੁਦੀ'],
};
export function localizeStat006Question(q:Stat006Question,language:'hi'|'pa') {
 const owner=getStat006PermanentQl(q.qlId), solved=solveStat006State(q.state);
 if(q.packageId!=='STAT-006'||q.language!=='en'||owner?.contractId!==q.contractId||q.options.length!==4||new Set(q.options).size!==4||q.options[q.correctIndex]!==q.answer||(typeof solved==='number'?fmt(solved):solved)!==q.answer)throw new Error('Invalid STAT-006 native source');
 const t=(hi:string,pa:string)=>language==='hi'?hi:pa;
 const option=(value:string)=>{if(words[value])return words[value]![language==='hi'?0:1];if(!Number.isFinite(Number(value)))throw new Error(`Unknown STAT-006 option: ${value}`);return value;};
 const s=q.state;let stem='',explanation='';
 if(s.kind==='RAW_MOMENT'||s.kind==='CENTRAL_MOMENT'){
  const central=s.kind==='CENTRAL_MOMENT',n=s.values.length,mean=s.values.reduce((a,b)=>a+b,0)/n;
  stem=central?t(`प्रेक्षण ${s.values.join(', ')} को समष्टि मानिए। माध्य के सापेक्ष ${s.order}वें केंद्रीय आघूर्ण का मान ज्ञात कीजिए।`,`ਨਿਰੀਖਣ ${s.values.join(', ')} ਨੂੰ ਸਮਸ਼ਟੀ ਮੰਨੋ। ਮੱਧਮਾਨ ਦੇ ਸਾਪੇਖ ${s.order}ਵੇਂ ਕੇਂਦਰੀ ਆਘੂਰਨ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`):t(`प्रेक्षण ${s.values.join(', ')} का मूल बिंदु के सापेक्ष ${s.order}वाँ आघूर्ण ज्ञात कीजिए।`,`ਨਿਰੀਖਣ ${s.values.join(', ')} ਦਾ ਮੂਲ ਬਿੰਦੂ ਦੇ ਸਾਪੇਖ ${s.order}ਵਾਂ ਆਘੂਰਨ ਪਤਾ ਕਰੋ।`);
  const terms=s.values.map(v=>central?`(${v} − ${fmt(mean)})^${s.order}`:`(${v})^${s.order}`);
  explanation=(central?t('माध्य से विचलनों की घातों का औसत लीजिए।','ਮੱਧਮਾਨ ਤੋਂ ਵਿਚਲਨਾਂ ਦੀਆਂ ਘਾਤਾਂ ਦਾ ਔਸਤ ਲਓ।'):t('प्रेक्षणों की घातों का औसत लीजिए।','ਨਿਰੀਖਣਾਂ ਦੀਆਂ ਘਾਤਾਂ ਦਾ ਔਸਤ ਲਓ।'))+'\n'+(central?t('अंकगणितीय माध्य','ਅੰਕਗਣਿਤਕ ਮੱਧਮਾਨ')+` = (${s.values.join(' + ')})/${n} = ${fmt(mean)}.\n`:'')+`${central?'μ':'μ′'}${s.order} = (${terms.join(' + ')})/${n} ≈ ${q.answer}.`;
 }else if(s.kind==='RAW_CENTRAL_RELATION'){
  const [a,b,c,d]=s.rawMoments;
  stem=t(`मूल बिंदु के सापेक्ष पहले चार आघूर्ण μ′1 = ${fmt(a)}, μ′2 = ${fmt(b)}, μ′3 = ${fmt(c)}, μ′4 = ${fmt(d)} हैं। ${s.order}वाँ केंद्रीय आघूर्ण ज्ञात कीजिए।`,`ਮੂਲ ਬਿੰਦੂ ਦੇ ਸਾਪੇਖ ਪਹਿਲੇ ਚਾਰ ਆਘੂਰਨ μ′1 = ${fmt(a)}, μ′2 = ${fmt(b)}, μ′3 = ${fmt(c)}, μ′4 = ${fmt(d)} ਹਨ। ${s.order}ਵਾਂ ਕੇਂਦਰੀ ਆਘੂਰਨ ਪਤਾ ਕਰੋ।`);
  const formula=s.order===2?'μ2 = μ′2 − (μ′1)^2':s.order===3?'μ3 = μ′3 − 3μ′2μ′1 + 2(μ′1)^3':'μ4 = μ′4 − 4μ′3μ′1 + 6μ′2(μ′1)^2 − 3(μ′1)^4';
  const substitution=s.order===2?`${fmt(b)} − (${fmt(a)})^2`:s.order===3?`${fmt(c)} − 3 × ${fmt(b)} × (${fmt(a)}) + 2 × (${fmt(a)})^3`:`${fmt(d)} − 4 × ${fmt(c)} × (${fmt(a)}) + 6 × ${fmt(b)} × (${fmt(a)})^2 − 3 × (${fmt(a)})^4`;
  explanation=t('संबंध सूत्र','ਸੰਬੰਧ ਸੂਤਰ')+`: ${formula}.\nμ${s.order} = ${substitution} ≈ ${q.answer}.`;
 }else if(s.kind==='AFFINE_MOMENT'){
  stem=t(`X का केंद्रीय आघूर्ण μ${s.order}(X) = ${s.centralMoment} है। यदि Y = (${s.multiplier})X + (${s.shift}), तो μ${s.order}(Y) ज्ञात कीजिए।`,`X ਦਾ ਕੇਂਦਰੀ ਆਘੂਰਨ μ${s.order}(X) = ${s.centralMoment} ਹੈ। ਜੇ Y = (${s.multiplier})X + (${s.shift}), ਤਾਂ μ${s.order}(Y) ਪਤਾ ਕਰੋ।`);
  explanation=t('स्थिरांक जोड़ने से प्रेक्षण और माध्य समान रूप से बदलते हैं, इसलिए केंद्रीय आघूर्ण पर उसका प्रभाव नहीं पड़ता।','ਸਥਿਰ ਅੰਕ ਜੋੜਨ ਨਾਲ ਨਿਰੀਖਣ ਅਤੇ ਮੱਧਮਾਨ ਬਰਾਬਰ ਬਦਲਦੇ ਹਨ, ਇਸ ਲਈ ਕੇਂਦਰੀ ਆਘੂਰਨ ਉੱਤੇ ਉਸ ਦਾ ਅਸਰ ਨਹੀਂ ਪੈਂਦਾ।')+`\nμ${s.order}(Y) = (${s.multiplier})^${s.order} × ${s.centralMoment} = ${q.answer}.`;
 }else if(s.kind==='MOMENT_SKEWNESS'){
  const beta=s.coefficient==='beta1',symbol=beta?'β1':'γ1';
  stem=t(`केंद्रीय आघूर्ण μ2 = ${fmt(s.mu2)} और μ3 = ${fmt(s.mu3)} हैं। विषमता गुणांक ${symbol} ज्ञात कीजिए।`,`ਕੇਂਦਰੀ ਆਘੂਰਨ μ2 = ${fmt(s.mu2)} ਅਤੇ μ3 = ${fmt(s.mu3)} ਹਨ। ਵਿਸ਼ਮਤਾ ਗੁਣਾਂਕ ${symbol} ਪਤਾ ਕਰੋ।`);
  explanation=t('आघूर्णों पर आधारित सूत्र','ਆਘੂਰਨਾਂ ਉੱਤੇ ਆਧਾਰਿਤ ਸੂਤਰ')+`: ${symbol} = ${beta?'μ3²/μ2³':'μ3/μ2^(3/2)'} = (${fmt(s.mu3)})${beta?'²':''}/(${fmt(s.mu2)})${beta?'³':'^(3/2)'} ≈ ${q.answer}.`;
 }else if(s.kind==='BOWLEY_SKEWNESS'){
  stem=t(`Q1 = ${s.q1}, माध्यिका = ${s.median} और Q3 = ${s.q3} हैं। बाउले का विषमता गुणांक ज्ञात कीजिए।`,`Q1 = ${s.q1}, ਮੱਧਿਕਾ = ${s.median} ਅਤੇ Q3 = ${s.q3} ਹਨ। ਬਾਊਲੇ ਦਾ ਵਿਸ਼ਮਤਾ ਗੁਣਾਂਕ ਪਤਾ ਕਰੋ।`);
  explanation=t('बाउले का गुणांक = (Q3 + Q1 − 2 × माध्यिका)/(Q3 − Q1)','ਬਾਊਲੇ ਦਾ ਗੁਣਾਂਕ = (Q3 + Q1 − 2 × ਮੱਧਿਕਾ)/(Q3 − Q1)')+`\n= (${s.q3} + ${s.q1} − 2 × ${s.median})/(${s.q3} − ${s.q1}) ≈ ${q.answer}.`;
 }else if(s.kind==='PEARSON_SKEWNESS'){
  const first=s.version===1,ref=first?t('बहुलक','ਬਹੁਲਕ'):t('माध्यिका','ਮੱਧਿਕਾ');
  stem=t(`माध्य ${s.mean}, ${ref} ${s.reference} और मानक विचलन ${s.standardDeviation} है। पियर्सन का ${first?'प्रथम':'द्वितीय'} विषमता गुणांक ज्ञात कीजिए।`,`ਮੱਧਮਾਨ ${s.mean}, ${ref} ${s.reference} ਅਤੇ ਮਿਆਰੀ ਵਿਚਲਨ ${s.standardDeviation} ਹੈ। ਪੀਅਰਸਨ ਦਾ ${first?'ਪਹਿਲਾ':'ਦੂਜਾ'} ਵਿਸ਼ਮਤਾ ਗੁਣਾਂਕ ਪਤਾ ਕਰੋ।`);
  explanation=t(`विषमता गुणांक = ${first?'':'3 × '}(माध्य − ${ref})/मानक विचलन`,`ਵਿਸ਼ਮਤਾ ਗੁਣਾਂਕ = ${first?'':'3 × '}(ਮੱਧਮਾਨ − ${ref})/ਮਿਆਰੀ ਵਿਚਲਨ`)+`\n= ${first?'':'3 × '}(${s.mean} − ${s.reference})/${s.standardDeviation} ≈ ${q.answer}.`;
 }else if(s.kind==='THIRD_MOMENT_SIGN'){
  stem=t(`तृतीय केंद्रीय आघूर्ण μ3 = ${s.mu3} है। इसका चिह्न आघूर्ण-आधारित विषमता के बारे में क्या बताता है?`,`ਤੀਜਾ ਕੇਂਦਰੀ ਆਘੂਰਨ μ3 = ${s.mu3} ਹੈ। ਇਸ ਦਾ ਚਿੰਨ੍ਹ ਆਘੂਰਨ-ਆਧਾਰਿਤ ਵਿਸ਼ਮਤਾ ਬਾਰੇ ਕੀ ਦੱਸਦਾ ਹੈ?`);
  explanation=t('μ3 का चिह्न आघूर्ण-आधारित विषमता की दिशा बताता है।','μ3 ਦਾ ਚਿੰਨ੍ਹ ਆਘੂਰਨ-ਆਧਾਰਿਤ ਵਿਸ਼ਮਤਾ ਦੀ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ।')+` μ3 ${s.mu3===0?'=':s.mu3>0?'>':'<'} 0.\n${option(q.answer)}.`+(s.mu3===0?t(' शून्य तृतीय आघूर्ण अकेले सममिति सिद्ध नहीं करता।',' ਸਿਫ਼ਰ ਤੀਜਾ ਆਘੂਰਨ ਇਕੱਲਾ ਸਮਮਿਤੀ ਸਿੱਧ ਨਹੀਂ ਕਰਦਾ।'):'');
 }else{
  const beta=s.mu4/s.mu2**2;
  if(s.output==='beta2'){
   stem=t(`केंद्रीय आघूर्ण μ2 = ${fmt(s.mu2)} और μ4 = ${fmt(s.mu4)} हैं। ककुदता गुणांक β2 ज्ञात कीजिए।`,`ਕੇਂਦਰੀ ਆਘੂਰਨ μ2 = ${fmt(s.mu2)} ਅਤੇ μ4 = ${fmt(s.mu4)} ਹਨ। ਕਕੁਦਤਾ ਗੁਣਾਂਕ β2 ਪਤਾ ਕਰੋ।`);
   explanation=t('ककुदता गुणांक','ਕਕੁਦਤਾ ਗੁਣਾਂਕ')+` β2 = μ4/μ2² = ${fmt(s.mu4)}/(${fmt(s.mu2)})² ≈ ${q.answer}.`;
  }else if(s.output==='excess'){
   stem=t(`ककुदता गुणांक β2 = ${fmt(beta)} है। अतिरिक्त ककुदता ज्ञात कीजिए।`,`ਕਕੁਦਤਾ ਗੁਣਾਂਕ β2 = ${fmt(beta)} ਹੈ। ਵਾਧੂ ਕਕੁਦਤਾ ਪਤਾ ਕਰੋ।`);
   explanation=t('अतिरिक्त ककुदता','ਵਾਧੂ ਕਕੁਦਤਾ')+` γ2 = β2 − 3 = ${fmt(beta)} − 3 = ${q.answer}.`;
  }else{
   stem=t(`ककुदता गुणांक β2 = ${fmt(beta)} है। सामान्य वितरण (β2 = 3) की तुलना में ककुदता का वर्गीकरण कीजिए।`,`ਕਕੁਦਤਾ ਗੁਣਾਂਕ β2 = ${fmt(beta)} ਹੈ। ਸਧਾਰਨ ਵੰਡ (β2 = 3) ਦੇ ਮੁਕਾਬਲੇ ਕਕੁਦਤਾ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।`);
   explanation=t('सामान्य वितरण का β2 = 3 होता है।','ਸਧਾਰਨ ਵੰਡ ਦਾ β2 = 3 ਹੁੰਦਾ ਹੈ।')+` ${fmt(beta)} ${beta===3?'=':beta>3?'>':'<'} 3.\n${option(q.answer)}.`;
  }
 }
 const answer=option(q.answer),options=q.options.map(option) as [string,string,string,string];
 return {...q,questionId:`${q.questionId}:${language}:native-v1`,sourceQuestionId:q.questionId,sourceAnswer:q.answer,sourceOptions:[...q.options],language,stem,text:stem,explanation,answer,options,canonicalAnswer:{kind:'symbolic' as const,value:answer,display:answer,rendered:answer,rounding:'source' as const},runtimeMode:'STAT006_NATIVE_REVIEW_V1',reviewStatus:'NATIVE_REVIEW_CANDIDATE',manualApprovalRequired:true};
}
