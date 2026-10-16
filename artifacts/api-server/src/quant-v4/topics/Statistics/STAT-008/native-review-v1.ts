import type {Stat008Question} from './types';
import {STAT008_PERMANENT_QLS} from './permanent-ql-registry';
import {solveStat008State} from './probability-theory';
import {copy,fmt,finishNative,assertSource,type NativeLanguage} from '../shared/native-007-009';
export function localizeStat008Question(q:Stat008Question,l:NativeLanguage){
 assertSource(q,'STAT-008',STAT008_PERMANENT_QLS.find(o=>o.qlId===q.qlId),solveStat008State(q.state));
 const t=copy(l),s=q.state;let stem='',explanation='';
 if(s.kind==='RATIO'){
  const empirical=q.contractId==='EMPIRICAL_PROBABILITY';
  stem=empirical?t(`एक घटना ${s.denominator} परीक्षणों में ${s.numerator} बार हुई। उसकी आनुभविक प्रायिकता ज्ञात कीजिए।`,`ਇੱਕ ਘਟਨਾ ${s.denominator} ਪਰਖਾਂ ਵਿੱਚ ${s.numerator} ਵਾਰ ਵਾਪਰੀ। ਉਸ ਦੀ ਅਨੁਭਵੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।`):t(`कुल ${s.denominator} समसंभाव्य परिणामों में से ${s.numerator} परिणाम घटना A के अनुकूल हैं। P(A) ज्ञात कीजिए।`,`ਕੁੱਲ ${s.denominator} ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜਿਆਂ ਵਿੱਚੋਂ ${s.numerator} ਨਤੀਜੇ ਘਟਨਾ A ਦੇ ਅਨੁਕੂਲ ਹਨ। P(A) ਪਤਾ ਕਰੋ।`);
  const scenarios:Record<string,readonly[string,string]>={
   '3/8':['एक डिब्बे में 8 क्रमांकित पर्चियाँ हैं। प्रत्येक के चुने जाने की संभावना समान है और 3 पर्चियाँ दी गई शर्त पूरी करती हैं। घटना की प्रायिकता ज्ञात कीजिए।','ਇੱਕ ਡੱਬੇ ਵਿੱਚ 8 ਨੰਬਰ ਵਾਲੀਆਂ ਪਰਚੀਆਂ ਹਨ। ਹਰੇਕ ਦੇ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਬਰਾਬਰ ਹੈ ਅਤੇ 3 ਪਰਚੀਆਂ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੀਆਂ ਹਨ। ਘਟਨਾ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।'],
   '5/12':['12 समसंभाव्य कार्डों में से एक चुना जाता है। इनमें 5 नीले हैं। नीला कार्ड मिलने की प्रायिकता ज्ञात कीजिए।','12 ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਕਾਰਡਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ 5 ਨੀਲੇ ਹਨ। ਨੀਲਾ ਕਾਰਡ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।'],
   '4/10':['एक चक्र में 10 बराबर खंड हैं, जिनमें से 4 छायांकित हैं। चक्र घुमाने पर छायांकित खंड मिलने की प्रायिकता ज्ञात कीजिए।','ਇੱਕ ਚੱਕਰ ਵਿੱਚ 10 ਬਰਾਬਰ ਖੰਡ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ 4 ਛਾਂਦਾਰ ਹਨ। ਚੱਕਰ ਘੁਮਾਉਣ ਉੱਤੇ ਛਾਂਦਾਰ ਖੰਡ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।'],
   '6/15':['एक थैले में 15 समान टोकन हैं, जिनमें से 6 पर तारा बना है। यादृच्छिक रूप से एक टोकन निकालने पर तारे वाला टोकन मिलने की प्रायिकता ज्ञात कीजिए।','ਇੱਕ ਥੈਲੇ ਵਿੱਚ 15 ਇੱਕੋ ਜਿਹੇ ਟੋਕਨ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ 6 ਉੱਤੇ ਤਾਰਾ ਬਣਿਆ ਹੈ। ਬੇਤਰਤੀਬੇ ਢੰਗ ਨਾਲ ਇੱਕ ਟੋਕਨ ਕੱਢਣ ਉੱਤੇ ਤਾਰੇ ਵਾਲਾ ਟੋਕਨ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।'],
   '7/20':['20 समसंभाव्य टिकटों में से 7 विजेता टिकट हैं। एक टिकट निकालने पर विजेता टिकट मिलने की प्रायिकता ज्ञात कीजिए।','20 ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੀਆਂ ਟਿਕਟਾਂ ਵਿੱਚੋਂ 7 ਜੇਤੂ ਟਿਕਟਾਂ ਹਨ। ਇੱਕ ਟਿਕਟ ਕੱਢਣ ਉੱਤੇ ਜੇਤੂ ਟਿਕਟ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।'],
   '2/6':['एक निष्पक्ष छह फलकों वाला पासा फेंका जाता है। दो फलक दी गई शर्त पूरी करते हैं। घटना की प्रायिकता ज्ञात कीजिए।','ਇੱਕ ਨਿਰਪੱਖ ਛੇ ਪਾਸਿਆਂ ਵਾਲਾ ਪਾਸਾ ਸੁੱਟਿਆ ਜਾਂਦਾ ਹੈ। ਦੋ ਪਾਸੇ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ। ਘਟਨਾ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।'],
  };
  const empiricalEvents:Record<number,readonly[string,string]>={60:['मशीन ने दोषपूर्ण वस्तु बनाई','ਮਸ਼ੀਨ ਨੇ ਖ਼ਰਾਬ ਵਸਤੂ ਬਣਾਈ'],70:['अभ्यर्थी ने अभ्यास प्रश्न का सही उत्तर दिया','ਉਮੀਦਵਾਰ ਨੇ ਅਭਿਆਸ ਪ੍ਰਸ਼ਨ ਦਾ ਸਹੀ ਉੱਤਰ ਦਿੱਤਾ'],80:['बस निर्धारित समय के भीतर पहुँची','ਬੱਸ ਨਿਰਧਾਰਤ ਸਮੇਂ ਅੰਦਰ ਪਹੁੰਚੀ'],90:['ग्राहक ने विज्ञापित विकल्प चुना','ਗਾਹਕ ਨੇ ਇਸ਼ਤਿਹਾਰ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣਿਆ'],100:['बीज अंकुरित हुआ','ਬੀਜ ਉੱਗਿਆ'],120:['नमूने की इकाई जाँच में सफल हुई','ਨਮੂਨੇ ਦੀ ਇਕਾਈ ਜਾਂਚ ਵਿੱਚ ਸਫਲ ਹੋਈ']};
  if(empirical){const e=empiricalEvents[s.denominator];if(!e)throw new Error('Unauthored empirical scenario');stem=t(`${s.denominator} दर्ज परीक्षणों में ${s.numerator} बार यह घटना हुई: ${e[0]}। घटना की आनुभविक प्रायिकता ज्ञात कीजिए।`,`${s.denominator} ਦਰਜ ਪਰਖਾਂ ਵਿੱਚ ${s.numerator} ਵਾਰ ਇਹ ਘਟਨਾ ਵਾਪਰੀ: ${e[1]}। ਘਟਨਾ ਦੀ ਅਨੁਭਵੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।`);}else{const c=scenarios[`${s.numerator}/${s.denominator}`];if(!c)throw new Error('Unauthored classical scenario');stem=t(c[0],c[1]);}
  explanation=t(empirical?'आनुभविक प्रायिकता = घटना की बारंबारता/कुल परीक्षण':'प्रायिकता = अनुकूल परिणाम/कुल समसंभाव्य परिणाम',empirical?'ਅਨੁਭਵੀ ਸੰਭਾਵਨਾ = ਘਟਨਾ ਦੀ ਬਾਰੰਬਾਰਤਾ/ਕੁੱਲ ਪਰਖਾਂ':'ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਨਤੀਜੇ/ਕੁੱਲ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ')+` = ${s.numerator}/${s.denominator} ≈ ${q.answer}.`;
 }else if(s.kind==='COMPLEMENT'){
  stem=t(`P(A) = ${s.p} है। A के न होने की प्रायिकता ज्ञात कीजिए।`,`P(A) = ${s.p} ਹੈ। A ਦੇ ਨਾ ਵਾਪਰਨ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।`);explanation=t('पूरक घटना का नियम','ਪੂਰਕ ਘਟਨਾ ਦਾ ਨਿਯਮ')+`: P(Aᶜ) = 1 − P(A) = 1 − ${s.p} = ${q.answer}.`;
 }else if(s.kind==='UNION'||s.kind==='COMPOUND_COMPLEMENT'){
  stem=t(`P(A) = ${s.pA}, P(B) = ${s.pB} और P(A∩B) = ${s.pAB} हैं। `,`P(A) = ${s.pA}, P(B) = ${s.pB} ਅਤੇ P(A∩B) = ${s.pAB} ਹਨ। `)+(s.kind==='UNION'?t('P(A∪B) ज्ञात कीजिए।','P(A∪B) ਪਤਾ ਕਰੋ।'):t('न तो A और न ही B होने की प्रायिकता ज्ञात कीजिए।','ਨਾ A ਅਤੇ ਨਾ ਹੀ B ਵਾਪਰਨ ਦੀ ਸੰਭਾਵਨਾ ਪਤਾ ਕਰੋ।'));
  explanation=t('योग नियम','ਜੋੜ ਨਿਯਮ')+`: P(A∪B) = P(A)+P(B)−P(A∩B) = ${s.pA}+${s.pB}−${s.pAB} = ${fmt(s.pA+s.pB-s.pAB)}.`+(s.kind==='COMPOUND_COMPLEMENT'?`\nP(Aᶜ∩Bᶜ) = 1 − ${fmt(s.pA+s.pB-s.pAB)} = ${q.answer}.`:'');
 }else if(s.kind==='CONDITIONAL'){
  stem=t(`P(A∩B) = ${s.pAB} और P(B) = ${s.pB} हैं। P(A|B) ज्ञात कीजिए।`,`P(A∩B) = ${s.pAB} ਅਤੇ P(B) = ${s.pB} ਹਨ। P(A|B) ਪਤਾ ਕਰੋ।`);explanation=t('सशर्त प्रायिकता','ਸ਼ਰਤੀਆ ਸੰਭਾਵਨਾ')+`: P(A|B) = P(A∩B)/P(B) = ${s.pAB}/${s.pB} = ${q.answer}.`;
 }else if(s.kind==='CONDITIONAL_PRODUCT'){
  stem=t(`P(A|B) = ${s.pGivenB} और P(B) = ${s.pB} हैं। P(A∩B) ज्ञात कीजिए।`,`P(A|B) = ${s.pGivenB} ਅਤੇ P(B) = ${s.pB} ਹਨ। P(A∩B) ਪਤਾ ਕਰੋ।`);explanation=t('गुणन नियम','ਗੁਣਾ ਨਿਯਮ')+`: P(A∩B) = P(A|B)P(B) = ${s.pGivenB} × ${s.pB} = ${q.answer}.`;
 }else if(s.kind==='INDEPENDENCE'){
  const yes=s.output==='yesno';stem=yes?t(`P(A) = ${s.pA}, P(B) = ${s.pB} और P(A∩B) = ${s.pAB} हैं। क्या A और B स्वतंत्र हैं?`,`P(A) = ${s.pA}, P(B) = ${s.pB} ਅਤੇ P(A∩B) = ${s.pAB} ਹਨ। ਕੀ A ਅਤੇ B ਸੁਤੰਤਰ ਹਨ?`):t(`A और B स्वतंत्र हैं। P(A) = ${s.pA} और P(B) = ${s.pB} होने पर P(A∩B) ज्ञात कीजिए।`,`A ਅਤੇ B ਸੁਤੰਤਰ ਹਨ। P(A) = ${s.pA} ਅਤੇ P(B) = ${s.pB} ਹੋਣ ਉੱਤੇ P(A∩B) ਪਤਾ ਕਰੋ।`);
  explanation=t('स्वतंत्रता की शर्त P(A∩B) = P(A)P(B) है।','ਸੁਤੰਤਰਤਾ ਦੀ ਸ਼ਰਤ P(A∩B) = P(A)P(B) ਹੈ।')+` P(A)P(B) = ${s.pA} × ${s.pB} = ${fmt(s.pA*s.pB)}.`+(yes?t(` दिया गया P(A∩B) = ${s.pAB} ${q.answer==='Independent'?'इसके बराबर है। घटनाएँ स्वतंत्र हैं।':'इसके बराबर नहीं है। घटनाएँ स्वतंत्र नहीं हैं।'}`,` ਦਿੱਤਾ P(A∩B) = ${s.pAB} ${q.answer==='Independent'?'ਇਸ ਦੇ ਬਰਾਬਰ ਹੈ। ਘਟਨਾਵਾਂ ਸੁਤੰਤਰ ਹਨ।':'ਇਸ ਦੇ ਬਰਾਬਰ ਨਹੀਂ ਹੈ। ਘਟਨਾਵਾਂ ਸੁਤੰਤਰ ਨਹੀਂ ਹਨ।'}`):'');
 }else{
  const total=s.priorA*s.likelihoodA+s.priorB*s.likelihoodB;
  stem=t(`A और B समष्टि के दो परस्पर अपवर्जी तथा संपूर्ण समूह हैं। P(A) = ${s.priorA}, P(B) = ${s.priorB}, P(E|A) = ${s.likelihoodA} और P(E|B) = ${s.likelihoodB} हैं। `,`A ਅਤੇ B ਸਮਸ਼ਟੀ ਦੇ ਦੋ ਪਰਸਪਰ ਅਪਵਰਜੀ ਅਤੇ ਸੰਪੂਰਨ ਸਮੂਹ ਹਨ। P(A) = ${s.priorA}, P(B) = ${s.priorB}, P(E|A) = ${s.likelihoodA} ਅਤੇ P(E|B) = ${s.likelihoodB} ਹਨ। `)+(s.kind==='TOTAL'?t('P(E) ज्ञात कीजिए।','P(E) ਪਤਾ ਕਰੋ।'):t('E होने पर P(A|E) ज्ञात कीजिए।','E ਵਾਪਰਨ ਉੱਤੇ P(A|E) ਪਤਾ ਕਰੋ।'));
  explanation=t('संपूर्ण प्रायिकता का नियम','ਕੁੱਲ ਸੰਭਾਵਨਾ ਦਾ ਨਿਯਮ')+`: P(E) = ${s.priorA} × ${s.likelihoodA} + ${s.priorB} × ${s.likelihoodB} = ${fmt(total,4)}.`+(s.kind==='BAYES'?'\n'+t('बेयस प्रमेय','ਬੇਅਜ਼ ਪ੍ਰਮੇਯ')+`: P(A|E) = (${s.priorA} × ${s.likelihoodA})/(${s.priorA} × ${s.likelihoodA} + ${s.priorB} × ${s.likelihoodB}) ≈ ${q.answer}.`:'');
 }
 return finishNative(q,l,stem,explanation);
}
