import type {Stat007Question} from './types';
import {STAT007_PERMANENT_QLS} from './permanent-ql-registry';
import {solveStat007State} from './correlation-regression';
import {copy,fmt,finishNative,assertSource,nativeOption,type NativeLanguage} from '../shared/native-007-009';
export function localizeStat007Question(q:Stat007Question,l:NativeLanguage){
 assertSource(q,'STAT-007',STAT007_PERMANENT_QLS.find(o=>o.qlId===q.qlId),solveStat007State(q.state));
 const t=copy(l),s=q.state;let stem='',explanation='';
 const option=(v:string)=>{
  const beta=v.match(/average change of (\d+) units/);
  if(beta)return t(`X₂ को स्थिर रखने पर X₁ में एक इकाई वृद्धि से अनुमानित Y में औसतन ${beta[1]} इकाइयों की वृद्धि होती है।`,`X₂ ਨੂੰ ਸਥਿਰ ਰੱਖਣ ਉੱਤੇ X₁ ਵਿੱਚ ਇੱਕ ਇਕਾਈ ਵਾਧੇ ਨਾਲ ਅਨੁਮਾਨਿਤ Y ਵਿੱਚ ਔਸਤਨ ${beta[1]} ਇਕਾਈਆਂ ਦਾ ਵਾਧਾ ਹੁੰਦਾ ਹੈ।`);
  let m=v.match(/^Holding X₁ fixed.*by (\d+) units/);if(m)return t(`X₁ स्थिर होने पर X₂ की एक इकाई वृद्धि से अनुमानित Y में ${m[1]} इकाइयों का परिवर्तन होता है।`,`X₁ ਸਥਿਰ ਹੋਣ ਉੱਤੇ X₂ ਦੇ ਇੱਕ ਇਕਾਈ ਵਾਧੇ ਨਾਲ ਅਨੁਮਾਨਿਤ Y ਵਿੱਚ ${m[1]} ਇਕਾਈਆਂ ਦੀ ਤਬਦੀਲੀ ਹੁੰਦੀ ਹੈ।`);
  m=v.match(/^A one-unit increase in X₁.*by (\d+)%/);if(m)return t(`X₁ की एक इकाई वृद्धि से अनुमानित Y में ${m[1]}% परिवर्तन होता है।`,`X₁ ਦੇ ਇੱਕ ਇਕਾਈ ਵਾਧੇ ਨਾਲ ਅਨੁਮਾਨਿਤ Y ਵਿੱਚ ${m[1]}% ਤਬਦੀਲੀ ਹੁੰਦੀ ਹੈ।`);
  m=v.match(/^When X₂ changes.*by (\d+) units/);if(m)return t(`X₂ में एक इकाई परिवर्तन होने पर X₁ में ${m[1]} इकाइयों का परिवर्तन होना आवश्यक है।`,`X₂ ਵਿੱਚ ਇੱਕ ਇਕਾਈ ਤਬਦੀਲੀ ਹੋਣ ਉੱਤੇ X₁ ਵਿੱਚ ${m[1]} ਇਕਾਈਆਂ ਦੀ ਤਬਦੀਲੀ ਹੋਣੀ ਲਾਜ਼ਮੀ ਹੈ।`);
  return nativeOption(v,l);
 };
 if(s.kind==='CLASSIFY'){
  if(q.contractId==='MULTIPLE_REGRESSION_FORM'){
   stem=t('दो पूर्वानुमान चरों X₁ और X₂ पर प्रतिक्रिया Y का बहु रैखिक प्रतिगमन मॉडल कौन-सा है?','ਦੋ ਪੂਰਵ-ਅਨੁਮਾਨ ਚਰਾਂ X₁ ਅਤੇ X₂ ਉੱਤੇ ਪ੍ਰਤੀਕਿਰਿਆ Y ਦਾ ਬਹੁ ਰੇਖੀ ਪ੍ਰਤਿਗਮਨ ਮਾਡਲ ਕਿਹੜਾ ਹੈ?');
   explanation=t('मॉडल में एक अंतःखंड और प्रत्येक पूर्वानुमान चर का अलग गुणांक होता है।','ਮਾਡਲ ਵਿੱਚ ਇੱਕ ਅੰਤਰਖੰਡ ਅਤੇ ਹਰੇਕ ਪੂਰਵ-ਅਨੁਮਾਨ ਚਰ ਦਾ ਵੱਖਰਾ ਗੁਣਾਂਕ ਹੁੰਦਾ ਹੈ।')+' Ŷ = β₀ + β₁X₁ + β₂X₂.';
  }else if(q.contractId==='MULTIPLE_REGRESSION_COEFFICIENT_INTERPRETATION'){
   const b=s.result.match(/average change of (\d+) units/)?.[1];if(!b)throw new Error('Missing slope');
   stem=t(`अनुमानित मॉडल Ŷ = β₀ + β₁X₁ + β₂X₂ में β₁ = ${b} है। X₂ को स्थिर रखने पर इसका अर्थ क्या है?`,`ਅਨੁਮਾਨਿਤ ਮਾਡਲ Ŷ = β₀ + β₁X₁ + β₂X₂ ਵਿੱਚ β₁ = ${b} ਹੈ। X₂ ਨੂੰ ਸਥਿਰ ਰੱਖਣ ਉੱਤੇ ਇਸ ਦਾ ਕੀ ਅਰਥ ਹੈ?`);
   explanation=t('β₁, X₁ का आंशिक ढाल गुणांक है।','β₁, X₁ ਦਾ ਅੰਸ਼ਿਕ ਢਾਲ ਗੁਣਾਂਕ ਹੈ।')+' '+option(q.answer);
  }else if(q.contractId==='SCATTER_DIAGRAM_TREND'){
   const positive=s.result==='Positive association',negative=s.result==='Negative association';
   stem=t(`प्रकीर्ण आरेख के बिंदु ${positive?'निचले बाएँ से ऊपरी दाएँ की ओर बढ़ते हैं':negative?'ऊपरी बाएँ से निचले दाएँ की ओर जाते हैं':'समग्र रूप से न ऊपर की ओर और न नीचे की ओर कोई रैखिक रुझान दिखाते हैं'}। संबंध की दिशा क्या है?`,`ਖਿੰਡਾਅ ਚਿੱਤਰ ਦੇ ਬਿੰਦੂ ${positive?'ਹੇਠਲੇ ਖੱਬੇ ਤੋਂ ਉੱਪਰਲੇ ਸੱਜੇ ਵੱਲ ਵਧਦੇ ਹਨ':negative?'ਉੱਪਰਲੇ ਖੱਬੇ ਤੋਂ ਹੇਠਲੇ ਸੱਜੇ ਵੱਲ ਜਾਂਦੇ ਹਨ':'ਸਮੁੱਚੇ ਤੌਰ ਉੱਤੇ ਨਾ ਉੱਪਰ ਵੱਲ ਅਤੇ ਨਾ ਹੇਠਾਂ ਵੱਲ ਕੋਈ ਰੇਖੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ'}। ਸੰਬੰਧ ਦੀ ਦਿਸ਼ਾ ਕੀ ਹੈ?`);
   explanation=t('बिंदुओं के समग्र रुझान से संबंध की दिशा पढ़ते हैं।','ਬਿੰਦੂਆਂ ਦੇ ਸਮੁੱਚੇ ਰੁਝਾਨ ਤੋਂ ਸੰਬੰਧ ਦੀ ਦਿਸ਼ਾ ਪੜ੍ਹਦੇ ਹਾਂ।')+' '+option(q.answer)+'.';
  }else{
   const m=q.stem.match(/r = (-?[\d.]+)/);if(!m)throw new Error('Missing correlation');
   stem=t(`पियर्सन सहसंबंध गुणांक r = ${m[1]} है। सही व्याख्या चुनिए।`,`ਪੀਅਰਸਨ ਸਹਿਸੰਬੰਧ ਗੁਣਾਂਕ r = ${m[1]} ਹੈ। ਸਹੀ ਵਿਆਖਿਆ ਚੁਣੋ।`);
   explanation=t('r का मान −1 से 1 के बीच होता है। उसका चिह्न दिशा बताता है; |r| = 1 पूर्ण रैखिक संबंध बताता है।','r ਦਾ ਮੁੱਲ −1 ਤੋਂ 1 ਦੇ ਵਿਚਕਾਰ ਹੁੰਦਾ ਹੈ। ਇਸ ਦਾ ਚਿੰਨ੍ਹ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ; |r| = 1 ਪੂਰਨ ਰੇਖੀ ਸੰਬੰਧ ਦੱਸਦਾ ਹੈ।')+' '+option(q.answer)+'.';
  }
 }else if(s.kind==='PAIRS'||s.kind==='RANKS'){
  const x=s.x,y=s.y,n=x.length,mx=x.reduce((a,b)=>a+b)/n,my=y.reduce((a,b)=>a+b)/n;
  const cross=x.reduce((a,v,i)=>a+(v-mx)*(y[i]!-my),0),xx=x.reduce((a,v)=>a+(v-mx)**2,0),yy=y.reduce((a,v)=>a+(v-my)**2,0);
  const kind=s.kind==='RANKS'?'rank':s.output;
  const ask=kind==='pearson'?t('पियर्सन सहसंबंध गुणांक','ਪੀਅਰਸਨ ਸਹਿਸੰਬੰਧ ਗੁਣਾਂਕ'):kind==='covariance'?t('भाजक n लेकर सहप्रसरण','ਭਾਜਕ n ਲੈ ਕੇ ਸਹਿਪ੍ਰਸਰਨ'):kind==='rank'?t('स्पीयरमैन क्रम सहसंबंध','ਸਪੀਅਰਮੈਨ ਦਰਜਾ ਸਹਿਸੰਬੰਧ'):t(`${kind==='reg-yx'?'Y का X पर':'X का Y पर'} प्रतिगमन ढाल`,`${kind==='reg-yx'?'Y ਦੀ X ਉੱਤੇ':'X ਦੀ Y ਉੱਤੇ'} ਪ੍ਰਤਿਗਮਨ ਢਾਲ`);
  stem=t(`युग्मित ${kind==='rank'?'क्रमों':'प्रेक्षणों'} X = ${x.join(', ')} और Y = ${y.join(', ')} के लिए ${ask} ज्ञात कीजिए।`,`ਜੋੜੇਦਾਰ ${kind==='rank'?'ਦਰਜਿਆਂ':'ਨਿਰੀਖਣਾਂ'} X = ${x.join(', ')} ਅਤੇ Y = ${y.join(', ')} ਲਈ ${ask} ਪਤਾ ਕਰੋ।`);
  if(kind==='rank'&&q.contractId==='SPEARMAN_WITH_TIES')stem+=' '+t('समान मानों को उनके औसत क्रम पहले ही दिए गए हैं।','ਬਰਾਬਰ ਮੁੱਲਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਔਸਤ ਦਰਜੇ ਪਹਿਲਾਂ ਹੀ ਦਿੱਤੇ ਹੋਏ ਹਨ।');
  explanation=t('गणना में दिए गए युग्मों का उपयोग कीजिए।','ਗਣਨਾ ਵਿੱਚ ਦਿੱਤੇ ਜੋੜਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।')+` x̄ = ${fmt(mx)}, ȳ = ${fmt(my)}.\nSxy = Σ(x−x̄)(y−ȳ) = ${fmt(cross)}; Sxx = ${fmt(xx)}; Syy = ${fmt(yy)}.\n`+(kind==='covariance'?`Cov(X,Y) = Sxy/n = ${fmt(cross)}/${n}`:kind==='reg-yx'?`bYX = Sxy/Sxx = ${fmt(cross)}/${fmt(xx)}`:kind==='reg-xy'?`bXY = Sxy/Syy = ${fmt(cross)}/${fmt(yy)}`:`${kind==='rank'?'ρ':'r'} = Sxy/√(SxxSyy) = ${fmt(cross)}/√(${fmt(xx)} × ${fmt(yy)})`)+` ≈ ${q.answer}.`;
 }else if(s.kind==='COV_CORR'){
  stem=t(`सहप्रसरण ${s.covariance}, σX = ${s.sdX} और σY = ${s.sdY} हैं। पियर्सन r ज्ञात कीजिए।`,`ਸਹਿਪ੍ਰਸਰਨ ${s.covariance}, σX = ${s.sdX} ਅਤੇ σY = ${s.sdY} ਹਨ। ਪੀਅਰਸਨ r ਪਤਾ ਕਰੋ।`);explanation=t('सहसंबंध सूत्र','ਸਹਿਸੰਬੰਧ ਸੂਤਰ')+`: r = Cov(X,Y)/(σXσY) = ${s.covariance}/(${s.sdX} × ${s.sdY}) ≈ ${q.answer}.`;
 }else if(s.kind==='PREDICT'||s.kind==='MULTIPLE_PREDICT'){
  const multi=s.kind==='MULTIPLE_PREDICT',model=multi?`${s.intercept} + (${s.b1})X₁ + (${s.b2})X₂`:`${s.intercept} + (${s.slope})X`,inputs=multi?`X₁ = ${s.x1}, X₂ = ${s.x2}`:`X = ${s.x}`;
  stem=t(`प्रतिगमन मॉडल Ŷ = ${model} है। ${inputs} होने पर अनुमानित Y ज्ञात कीजिए।`,`ਪ੍ਰਤਿਗਮਨ ਮਾਡਲ Ŷ = ${model} ਹੈ। ${inputs} ਹੋਣ ਉੱਤੇ ਅਨੁਮਾਨਿਤ Y ਪਤਾ ਕਰੋ।`);
  explanation=t('दिए गए मान रखने पर','ਦਿੱਤੇ ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ')+`: Ŷ = ${multi?`${s.intercept} + (${s.b1}) × ${s.x1} + (${s.b2}) × ${s.x2}`:`${s.intercept} + (${s.slope}) × ${s.x}`} = ${q.answer}.`;
 }else if(s.kind==='REG_COEFFICIENTS'){
  stem=t(`प्रतिगमन गुणांक bYX = ${s.bxy} और bXY = ${s.byx} हैं। सहसंबंध गुणांक r ज्ञात कीजिए।`,`ਪ੍ਰਤਿਗਮਨ ਗੁਣਾਂਕ bYX = ${s.bxy} ਅਤੇ bXY = ${s.byx} ਹਨ। ਸਹਿਸੰਬੰਧ ਗੁਣਾਂਕ r ਪਤਾ ਕਰੋ।`);explanation=t('r का चिह्न दोनों प्रतिगमन गुणांकों के समान होता है।','r ਦਾ ਚਿੰਨ੍ਹ ਦੋਵੇਂ ਪ੍ਰਤਿਗਮਨ ਗੁਣਾਂਕਾਂ ਵਰਗਾ ਹੁੰਦਾ ਹੈ।')+` r = ${Math.sign(s.bxy)<0?'−':'+'}√(${s.bxy} × ${s.byx}) ≈ ${q.answer}.`;
 }else if(s.kind==='YULE'){
  stem=t(`2 × 2 गुण-संबंध सारणी में a = ${s.a}, b = ${s.b}, c = ${s.c}, d = ${s.d} हैं। यूल का संबंध गुणांक Q ज्ञात कीजिए।`,`2 × 2 ਗੁਣ-ਸੰਬੰਧ ਸਾਰਣੀ ਵਿੱਚ a = ${s.a}, b = ${s.b}, c = ${s.c}, d = ${s.d} ਹਨ। ਯੂਲ ਦਾ ਸੰਬੰਧ ਗੁਣਾਂਕ Q ਪਤਾ ਕਰੋ।`);explanation=t('यूल का सूत्र','ਯੂਲ ਦਾ ਸੂਤਰ')+`: Q = (ad−bc)/(ad+bc) = (${s.a}×${s.d}−${s.b}×${s.c})/(${s.a}×${s.d}+${s.b}×${s.c}) ≈ ${q.answer}.`;
 }else if(s.kind==='PARTIAL'||s.kind==='MULTIPLE'){
  const partial=s.kind==='PARTIAL';stem=t(`r12 = ${s.r12}, r13 = ${s.r13} और r23 = ${s.r23} हैं। ${partial?'आंशिक सहसंबंध r12.3':'बहु सहसंबंध R1.23'} ज्ञात कीजिए।`,`r12 = ${s.r12}, r13 = ${s.r13} ਅਤੇ r23 = ${s.r23} ਹਨ। ${partial?'ਅੰਸ਼ਿਕ ਸਹਿਸੰਬੰਧ r12.3':'ਬਹੁ ਸਹਿਸੰਬੰਧ R1.23'} ਪਤਾ ਕਰੋ।`);
  explanation=t('सूत्र में मान रखने पर','ਸੂਤਰ ਵਿੱਚ ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ')+': '+(partial?`r12.3 = (r12−r13r23)/√[(1−r13²)(1−r23²)] = (${s.r12}−${s.r13}×${s.r23})/√[(1−${s.r13}²)(1−${s.r23}²)]`:`R1.23 = √[(r12²+r13²−2r12r13r23)/(1−r23²)] = √[(${s.r12}²+${s.r13}²−2×${s.r12}×${s.r13}×${s.r23})/(1−${s.r23}²)]`)+` ≈ ${q.answer}.`;
 }else if(s.kind==='MULTIPLE_CROSS_PRODUCTS'){
  const det=s.s11*s.s22-s.s12*s.s12;
  stem=t(`केंद्रित आँकड़ों के लिए S₁₁ = ${s.s11}, S₂₂ = ${s.s22}, S₁₂ = ${s.s12}, S₁Y = ${s.s1y}, S₂Y = ${s.s2y} हैं। Y के X₁ और X₂ पर प्रतिगमन में न्यूनतम वर्ग गुणांक ${s.target} ज्ञात कीजिए।`,`ਕੇਂਦਰਿਤ ਅੰਕੜਿਆਂ ਲਈ S₁₁ = ${s.s11}, S₂₂ = ${s.s22}, S₁₂ = ${s.s12}, S₁Y = ${s.s1y}, S₂Y = ${s.s2y} ਹਨ। Y ਦੀ X₁ ਅਤੇ X₂ ਉੱਤੇ ਪ੍ਰਤਿਗਮਨ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਵਰਗ ਗੁਣਾਂਕ ${s.target} ਪਤਾ ਕਰੋ।`);
  explanation=t('सारणिक','ਸਾਰਣਿਕ')+` D = S₁₁S₂₂ − S₁₂² = ${s.s11} × ${s.s22} − ${s.s12}² = ${det}.\n${s.target} = ${s.target==='b1'?`(S₁YS₂₂−S₂YS₁₂)/D = (${s.s1y}×${s.s22}−${s.s2y}×${s.s12})/${det}`:`(S₂YS₁₁−S₁YS₁₂)/D = (${s.s2y}×${s.s11}−${s.s1y}×${s.s12})/${det}`} = ${q.answer}.`;
 }else if(s.kind==='RESIDUAL'){
  stem=t(`मॉडल Ŷ = 5 + 2X₁ + 3X₂ में X₁ = 4 और X₂ = 2 हैं। प्रेक्षित Y = ${s.observed} है। अवशेष e = Y − Ŷ ज्ञात कीजिए।`,`ਮਾਡਲ Ŷ = 5 + 2X₁ + 3X₂ ਵਿੱਚ X₁ = 4 ਅਤੇ X₂ = 2 ਹਨ। ਨਿਰੀਖਿਆ Y = ${s.observed} ਹੈ। ਰਹਿੰਦ e = Y − Ŷ ਪਤਾ ਕਰੋ।`);
  explanation=t('पहले अनुमानित मान निकालिए।','ਪਹਿਲਾਂ ਅਨੁਮਾਨਿਤ ਮੁੱਲ ਕੱਢੋ।')+` Ŷ = 5 + 2×4 + 3×2 = ${s.predicted}.\ne = ${s.observed} − ${s.predicted} = ${q.answer}.`;
 }else throw new Error('Unsupported STAT-007 native state');
 return finishNative(q,l,stem,explanation,option);
}
