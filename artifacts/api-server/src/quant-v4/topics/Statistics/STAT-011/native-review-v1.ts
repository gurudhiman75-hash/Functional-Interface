import type {Stat011Question} from './types';
import {STAT011_PERMANENT_QLS} from './permanent-ql-registry';
import {solveStat011State} from './statistical-inference';
import {completeFinal} from '../shared/native-final-v1';
import {copy,fmt,type NativeLanguage} from '../shared/native-007-009';
export function localizeStat011Question(q:Stat011Question,l:NativeLanguage){
 const t=copy(l),s=q.state;let stem='',explanation='';
 const decision=(answer:string)=>answer==='Reject H₀'?t('H₀ अस्वीकार कीजिए।','H₀ ਰੱਦ ਕਰੋ।'):t('H₀ अस्वीकार करने के लिए पर्याप्त साक्ष्य नहीं हैं।','H₀ ਰੱਦ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਸਬੂਤ ਨਹੀਂ ਹਨ।');
 if(s.kind==='CLASSIFY'){
 const prompts:Record<string,readonly[string,string,string,string]>={
 POINT_ESTIMATE_TERMINOLOGY:['अज्ञात समष्टि माध्य का अनुमान एक ही प्रतिदर्श माध्य से लगाया जाता है। इस एकल संख्यात्मक अनुमान को क्या कहते हैं?','ਅਣਜਾਣ ਸਮਸ਼ਟੀ ਮੱਧਮਾਨ ਦਾ ਅਨੁਮਾਨ ਇੱਕੋ ਨਮੂਨਾ ਮੱਧਮਾਨ ਨਾਲ ਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਇਸ ਇਕੱਲੇ ਸੰਖਿਆਤਮਕ ਅਨੁਮਾਨ ਨੂੰ ਕੀ ਕਹਿੰਦੇ ਹਨ?','प्राचल के अनुमान के लिए एक संख्या देना बिंदु अनुमान है।','ਪ੍ਰਾਚਲ ਦੇ ਅਨੁਮਾਨ ਲਈ ਇੱਕ ਸੰਖਿਆ ਦੇਣਾ ਬਿੰਦੂ ਅਨੁਮਾਨ ਹੈ।'],
 UNBIASED_ESTIMATOR:['हर प्रतिदर्श आकार पर एक आकलक का प्रत्याशित मान समष्टि प्राचल के बराबर है। उसका कौन-सा गुण है?','ਹਰ ਨਮੂਨਾ ਆਕਾਰ ਉੱਤੇ ਇੱਕ ਅਨੁਮਾਨਕ ਦਾ ਉਮੀਦਿਤ ਮੁੱਲ ਸਮਸ਼ਟੀ ਪ੍ਰਾਚਲ ਦੇ ਬਰਾਬਰ ਹੈ। ਉਸ ਦਾ ਕਿਹੜਾ ਗੁਣ ਹੈ?','E[आकलक] = प्राचल होने पर आकलक अनभिनत है।','E[ਅਨੁਮਾਨਕ] = ਪ੍ਰਾਚਲ ਹੋਣ ਉੱਤੇ ਅਨੁਮਾਨਕ ਨਿਰਪੱਖ ਹੈ।'],
 CONSISTENT_ESTIMATOR:['प्रतिदर्श आकार बढ़ने पर आकलक प्रायिकता में वास्तविक प्राचल की ओर अभिसरित होता है। कौन-सा गुण है?','ਨਮੂਨਾ ਆਕਾਰ ਵਧਣ ਉੱਤੇ ਅਨੁਮਾਨਕ ਸੰਭਾਵਨਾ ਵਿੱਚ ਅਸਲ ਪ੍ਰਾਚਲ ਵੱਲ ਅਭਿਸਰਿਤ ਹੁੰਦਾ ਹੈ। ਕਿਹੜਾ ਗੁਣ ਹੈ?','यह संगति की परिभाषा है: बड़े प्रतिदर्शों में आकलक वास्तविक प्राचल के समीप आता है।','ਇਹ ਸੰਗਤਤਾ ਦੀ ਪਰਿਭਾਸ਼ਾ ਹੈ: ਵੱਡੇ ਨਮੂਨਿਆਂ ਵਿੱਚ ਅਨੁਮਾਨਕ ਅਸਲ ਪ੍ਰਾਚਲ ਦੇ ਨੇੜੇ ਆਉਂਦਾ ਹੈ।'],
 CONFIDENCE_INTERVAL_INTERPRETATION:['95% विश्वास-अंतराल विधि की सही आवृत्तिवादी व्याख्या कौन-सी है?','95% ਭਰੋਸਾ-ਅੰਤਰਾਲ ਵਿਧੀ ਦੀ ਸਹੀ ਆਵ੍ਰਿਤੀਵਾਦੀ ਵਿਆਖਿਆ ਕਿਹੜੀ ਹੈ?','प्राचल स्थिर है। बार-बार प्रतिचयन में इस विधि से बने लगभग 95% अंतराल उसे समाहित करेंगे।','ਪ੍ਰਾਚਲ ਸਥਿਰ ਹੈ। ਵਾਰ-ਵਾਰ ਨਮੂਨਾ ਲੈਣ ਉੱਤੇ ਇਸ ਵਿਧੀ ਦੇ ਲਗਭਗ 95% ਅੰਤਰਾਲ ਉਸ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨਗੇ।'],
 HYPOTHESIS_NULL_ALTERNATIVE:['मानक सार्थकता परीक्षण में कौन-सी परिकल्पना संदर्भ मान देती है और संभावित अस्वीकृति के लिए जाँची जाती है?','ਮਿਆਰੀ ਸਾਰਥਕਤਾ ਪਰਖ ਵਿੱਚ ਕਿਹੜੀ ਪਰਿਕਲਪਨਾ ਹਵਾਲਾ ਮੁੱਲ ਦਿੰਦੀ ਹੈ ਅਤੇ ਸੰਭਾਵਿਤ ਰੱਦ ਕਰਨ ਲਈ ਜਾਂਚੀ ਜਾਂਦੀ ਹੈ?','शून्य परिकल्पना H₀ संदर्भ स्थिति देती है; साक्ष्य उसके विरुद्ध जाँचे जाते हैं।','ਸਿਫ਼ਰ ਪਰਿਕਲਪਨਾ H₀ ਹਵਾਲਾ ਸਥਿਤੀ ਦਿੰਦੀ ਹੈ; ਸਬੂਤ ਉਸ ਦੇ ਵਿਰੁੱਧ ਜਾਂਚੇ ਜਾਂਦੇ ਹਨ।'],
 };
 if(q.contractId==='TYPE_I_TYPE_II_ERROR'){
 const first=s.answer==='Type I error';stem=t(first?'सत्य H₀ को परीक्षण अस्वीकार करता है। कौन-सी त्रुटि हुई?':'असत्य H₀ को परीक्षण अस्वीकार नहीं करता। कौन-सी त्रुटि हुई?',first?'ਸੱਚ H₀ ਨੂੰ ਪਰਖ ਰੱਦ ਕਰਦੀ ਹੈ। ਕਿਹੜੀ ਗਲਤੀ ਹੋਈ?':'ਝੂਠ H₀ ਨੂੰ ਪਰਖ ਰੱਦ ਨਹੀਂ ਕਰਦੀ। ਕਿਹੜੀ ਗਲਤੀ ਹੋਈ?');explanation=t(first?'सत्य शून्य परिकल्पना को अस्वीकार करना प्रथम प्रकार की त्रुटि है।':'असत्य शून्य परिकल्पना को अस्वीकार न करना द्वितीय प्रकार की त्रुटि है।',first?'ਸੱਚ ਸਿਫ਼ਰ ਪਰਿਕਲਪਨਾ ਨੂੰ ਰੱਦ ਕਰਨਾ ਪਹਿਲੀ ਕਿਸਮ ਦੀ ਗਲਤੀ ਹੈ।':'ਝੂਠ ਸਿਫ਼ਰ ਪਰਿਕਲਪਨਾ ਨੂੰ ਰੱਦ ਨਾ ਕਰਨਾ ਦੂਜੀ ਕਿਸਮ ਦੀ ਗਲਤੀ ਹੈ।');
 }else if(q.contractId==='ONE_TAIL_TWO_TAIL_TEST'){
 const sign=s.answer==='Two-tailed test'?'≠':s.answer==='Right-tailed test'?'>':'<';stem=t(`H₁: μ ${sign} μ₀ है। उचित परीक्षण दिशा चुनिए।`,`H₁: μ ${sign} μ₀ ਹੈ। ਢੁੱਕਵੀਂ ਪਰਖ ਦਿਸ਼ਾ ਚੁਣੋ।`);explanation=t(sign==='≠'?'दोनों दिशाओं में अंतर के लिए द्विपुच्छीय परीक्षण होता है।':sign==='>'?'बड़े मानों के लिए दाएँ पुच्छ में अस्वीकृति क्षेत्र होता है।':'छोटे मानों के लिए बाएँ पुच्छ में अस्वीकृति क्षेत्र होता है।',sign==='≠'?'ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਫ਼ਰਕ ਲਈ ਦੋ-ਪੂਛੀ ਪਰਖ ਹੁੰਦੀ ਹੈ।':sign==='>'?'ਵੱਡੇ ਮੁੱਲਾਂ ਲਈ ਸੱਜੀ ਪੂਛ ਵਿੱਚ ਰੱਦ ਖੇਤਰ ਹੁੰਦਾ ਹੈ।':'ਛੋਟੇ ਮੁੱਲਾਂ ਲਈ ਖੱਬੀ ਪੂਛ ਵਿੱਚ ਰੱਦ ਖੇਤਰ ਹੁੰਦਾ ਹੈ।');
 }else if(q.contractId==='P_VALUE_DECISION'){
 const m=q.stem.match(/p-value of ([\d.]+).*α = ([\d.]+)/);if(!m)throw new Error('Missing p-value facts');const p=Number(m[1]),a=Number(m[2]);stem=t(`p-मान ${p} और सार्थकता स्तर α = ${a} है। उचित निर्णय चुनिए।`,`p-ਮੁੱਲ ${p} ਅਤੇ ਸਾਰਥਕਤਾ ਪੱਧਰ α = ${a} ਹੈ। ਢੁੱਕਵਾਂ ਫ਼ੈਸਲਾ ਚੁਣੋ।`);explanation=`${p} ${p<a?'<':'≥'} ${a}. `+decision(q.answer)+' '+t('p-मान H₀ के सत्य होने की प्रायिकता नहीं है।','p-ਮੁੱਲ H₀ ਦੇ ਸੱਚ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਨਹੀਂ ਹੈ।');
 }else{const p=prompts[q.contractId];if(!p)throw new Error('Unauthored inference concept');stem=t(p[0],p[1]);explanation=t(p[2],p[3]);}
 }else if(s.kind==='BERNOULLI'){
 stem=t(`${s.n} स्वतंत्र बर्नूली परीक्षणों में ${s.successes} सफल हैं। p का ${s.output==='mom'?'आघूर्ण विधि':'अधिकतम संभाव्यता'} अनुमान ज्ञात कीजिए।`,`${s.n} ਸੁਤੰਤਰ ਬਰਨੂਲੀ ਪਰਖਾਂ ਵਿੱਚ ${s.successes} ਸਫਲ ਹਨ। p ਦਾ ${s.output==='mom'?'ਆਘੂਰਨ ਵਿਧੀ':'ਵੱਧੋ-ਵੱਧ ਸੰਭਾਵਤਾ'} ਅਨੁਮਾਨ ਪਤਾ ਕਰੋ।`);explanation=t('बर्नूली वितरण में दोनों विधियाँ प्रतिदर्श अनुपात देती हैं।','ਬਰਨੂਲੀ ਵੰਡ ਵਿੱਚ ਦੋਵੇਂ ਵਿਧੀਆਂ ਨਮੂਨਾ ਅਨੁਪਾਤ ਦਿੰਦੀਆਂ ਹਨ।')+` p̂ = ${s.successes}/${s.n} ≈ ${q.answer}.`;
 }else if(s.kind==='PAIRS'){
 const n=s.x.length,mx=s.x.reduce((a,b)=>a+b)/n,my=s.y.reduce((a,b)=>a+b)/n,xy=s.x.reduce((a,x,i)=>a+(x-mx)*(s.y[i]!-my),0),xx=s.x.reduce((a,x)=>a+(x-mx)**2,0),b=xy/xx;
 stem=t(`युग्म ${s.x.map((x,i)=>`(${x}, ${s.y[i]})`).join(', ')} के लिए ŷ = a + bx का न्यूनतम वर्ग ${s.output==='slope'?'ढाल b':'अंतःखंड a'} ज्ञात कीजिए।`,`ਜੋੜਿਆਂ ${s.x.map((x,i)=>`(${x}, ${s.y[i]})`).join(', ')} ਲਈ ŷ = a + bx ਦੀ ਘੱਟੋ-ਘੱਟ ਵਰਗ ${s.output==='slope'?'ਢਾਲ b':'ਅੰਤਰਖੰਡ a'} ਪਤਾ ਕਰੋ।`);
 explanation=t('न्यूनतम वर्ग सूत्र','ਘੱਟੋ-ਘੱਟ ਵਰਗ ਸੂਤਰ')+`: x̄ = ${fmt(mx)}, ȳ = ${fmt(my)}.\nb = Sxy/Sxx = ${fmt(xy)}/${fmt(xx)} ≈ ${fmt(b)}.\na = ȳ − bx̄ = ${fmt(my)} − (${fmt(xy)}/${fmt(xx)}) × ${fmt(mx)} ≈ ${fmt(my-b*mx)}.\n${s.output==='slope'?'b':'a'} ≈ ${q.answer}.`;
 }else if(s.kind==='CI'||s.kind==='CI_INTERVAL'){
 stem=t(`ज्ञात σ = ${s.sigma}, n = ${s.n} और z = ${s.z} हैं। `,`ਜਾਣਿਆ σ = ${s.sigma}, n = ${s.n} ਅਤੇ z = ${s.z} ਹਨ। `)+(s.kind==='CI'?t('समष्टि माध्य के z विश्वास अंतराल की त्रुटि सीमा ज्ञात कीजिए।','ਸਮਸ਼ਟੀ ਮੱਧਮਾਨ ਦੇ z ਭਰੋਸਾ ਅੰਤਰਾਲ ਦੀ ਗਲਤੀ ਸੀਮਾ ਪਤਾ ਕਰੋ।'):t(`x̄ = ${s.xbar} के लिए विश्वास अंतराल ज्ञात कीजिए।`,`x̄ = ${s.xbar} ਲਈ ਭਰੋਸਾ ਅੰਤਰਾਲ ਪਤਾ ਕਰੋ।`));
 explanation=t('त्रुटि सीमा','ਗਲਤੀ ਸੀਮਾ')+` E = zσ/√n = ${s.z} × ${s.sigma}/√${s.n} ≈ ${fmt(s.z*s.sigma/Math.sqrt(s.n))}.`+(s.kind==='CI_INTERVAL'?`\nx̄ ± E = ${s.xbar} ± (${s.z} × ${s.sigma}/√${s.n}) ≈ ${q.answer}.`:'');
 }else if(s.kind==='CI_PROP'){
 const p=s.successes/s.n;
 stem=t(`${s.n} व्यक्तियों में ${s.successes} प्रस्ताव का समर्थन करते हैं। सामान्य वाल्ड विधि में z = ${s.z} लेकर समष्टि अनुपात का 95% विश्वास अंतराल ज्ञात कीजिए।`,`${s.n} ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ ${s.successes} ਪ੍ਰਸਤਾਵ ਦੀ ਹਮਾਇਤ ਕਰਦੇ ਹਨ। ਸਧਾਰਨ ਵਾਲਡ ਵਿਧੀ ਵਿੱਚ z = ${s.z} ਲੈ ਕੇ ਸਮਸ਼ਟੀ ਅਨੁਪਾਤ ਦਾ 95% ਭਰੋਸਾ ਅੰਤਰਾਲ ਪਤਾ ਕਰੋ।`);explanation=t('प्रतिदर्श अनुपात','ਨਮੂਨਾ ਅਨੁਪਾਤ')+` p̂ = ${s.successes}/${s.n} = ${p}.\nSE = √[${p} × (1−${p})/${s.n}].\np̂ ± zSE = ${p} ± ${s.z}√[${p} × (1−${p})/${s.n}] ≈ ${q.answer}.`;
 }else if(s.kind==='TEST_DECISION'){
 if(q.contractId==='Z_TEST_DECISION'){
 const m=q.stem.match(/n = ([\d.]+).*x̄ = ([\d.]+).*σ = ([\d.]+).*H₀: μ = ([\d.]+)/);if(!m)throw new Error('Missing z decision facts');const n=Number(m[1]),x=Number(m[2]),sd=Number(m[3]),mu=Number(m[4]);if(Math.abs((x-mu)/(sd/Math.sqrt(n))-s.statistic)>1e-8)throw new Error('Z decision mismatch');
 stem=t(`n = ${n}, x̄ = ${x} और ज्ञात σ = ${sd} हैं। H₀: μ = ${mu} के विरुद्ध H₁: μ > ${mu} की जाँच में α = 0.05 और क्रांतिक z = ${s.critical} है। निर्णय चुनिए।`,`n = ${n}, x̄ = ${x} ਅਤੇ ਜਾਣਿਆ σ = ${sd} ਹਨ। H₀: μ = ${mu} ਦੇ ਵਿਰੁੱਧ H₁: μ > ${mu} ਦੀ ਜਾਂਚ ਵਿੱਚ α = 0.05 ਅਤੇ ਨਿਰਣਾਇਕ z = ${s.critical} ਹੈ। ਫ਼ੈਸਲਾ ਚੁਣੋ।`);
 explanation=t('पहले परीक्षण सांख्यिकी निकालिए।','ਪਹਿਲਾਂ ਪਰਖ ਅੰਕੜਾ ਕੱਢੋ।')+` z = (${x}−${mu})/(${sd}/√${n}) = ${fmt(s.statistic)}.\n`;
 }else{
 const m=q.stem.match(/observed counts \(([^)]+)\) and expected counts \(([^)]+)\)/);if(!m)throw new Error('Missing chi decision facts');const observed=m[1]!.split(',').map(Number),expected=m[2]!.split(',').map(Number),stat=observed.reduce((sum,o,i)=>sum+(o-expected[i]!)**2/expected[i]!,0);if(Math.abs(stat-s.statistic)>1e-8)throw new Error('Chi decision mismatch');
 stem=t(`समंजन-सुष्ठुता परीक्षण में प्रेक्षित गणनाएँ (${observed.join(', ')}) और अपेक्षित गणनाएँ (${expected.join(', ')}) हैं। क्रांतिक χ² = ${s.critical} है। H₀ के बारे में निर्णय चुनिए।`,`ਢੁੱਕਵੇਂ ਮੇਲ ਦੀ ਪਰਖ ਵਿੱਚ ਨਿਰੀਖੀਆਂ ਗਿਣਤੀਆਂ (${observed.join(', ')}) ਅਤੇ ਉਮੀਦਿਤ ਗਿਣਤੀਆਂ (${expected.join(', ')}) ਹਨ। ਨਿਰਣਾਇਕ χ² = ${s.critical} ਹੈ। H₀ ਬਾਰੇ ਫ਼ੈਸਲਾ ਚੁਣੋ।`);
 explanation=t('पहले ची-वर्ग सांख्यिकी निकालिए।','ਪਹਿਲਾਂ ਕਾਈ-ਵਰਗ ਅੰਕੜਾ ਕੱਢੋ।')+` χ² = ${observed.map((o,i)=>`(${o}−${expected[i]})²/${expected[i]}`).join('+')} = ${fmt(stat)}.\n`;
 }
 explanation+=t('ऊपरी पुच्छ में क्रांतिक मान से अधिक होने पर H₀ अस्वीकार करते हैं।','ਉੱਪਰਲੀ ਪੂਛ ਵਿੱਚ ਨਿਰਣਾਇਕ ਮੁੱਲ ਤੋਂ ਵੱਧ ਹੋਣ ਉੱਤੇ H₀ ਰੱਦ ਕਰਦੇ ਹਾਂ।')+` ${fmt(s.statistic)} ${s.statistic>s.critical?'>':'≤'} ${s.critical}. `+decision(q.answer);
 }else if(s.kind==='Z'||s.kind==='T'){
 const z=s.kind==='Z',sd=z?s.sigma:s.s;stem=t(`n = ${s.n}, x̄ = ${s.xbar}, H₀: μ = ${s.mu0} और ${z?'ज्ञात σ':'प्रतिदर्श मानक विचलन s'} = ${sd} हैं। ${z?'Z':'t'} सांख्यिकी ज्ञात कीजिए।`,`n = ${s.n}, x̄ = ${s.xbar}, H₀: μ = ${s.mu0} ਅਤੇ ${z?'ਜਾਣਿਆ σ':'ਨਮੂਨਾ ਮਿਆਰੀ ਵਿਚਲਨ s'} = ${sd} ਹਨ। ${z?'Z':'t'} ਅੰਕੜਾ ਪਤਾ ਕਰੋ।`);explanation=t('मानकीकृत अंतर','ਮਿਆਰੀਕ੍ਰਿਤ ਫ਼ਰਕ')+`: ${z?'Z':'t'} = (x̄−μ₀)/(${z?'σ':'s'}/√n) = (${s.xbar}−${s.mu0})/(${sd}/√${s.n}) ≈ ${q.answer}.`;
 }else if(s.kind==='CHI'){
 stem=t(`प्रेक्षित गणनाएँ (${s.observed.join(', ')}) और अपेक्षित गणनाएँ (${s.expected.join(', ')}) हैं। समंजन-सुष्ठुता परीक्षण की χ² सांख्यिकी ज्ञात कीजिए।`,`ਨਿਰੀਖੀਆਂ ਗਿਣਤੀਆਂ (${s.observed.join(', ')}) ਅਤੇ ਉਮੀਦਿਤ ਗਿਣਤੀਆਂ (${s.expected.join(', ')}) ਹਨ। ਢੁੱਕਵੇਂ ਮੇਲ ਦੀ ਪਰਖ ਦਾ χ² ਅੰਕੜਾ ਪਤਾ ਕਰੋ।`);explanation=t('ची-वर्ग सूत्र','ਕਾਈ-ਵਰਗ ਸੂਤਰ')+`: χ² = Σ(O−E)²/E = ${s.observed.map((o,i)=>`(${o}−${s.expected[i]})²/${s.expected[i]}`).join(' + ')} = ${q.answer}.`;
 }else{
 stem=t(`दो स्वतंत्र प्रतिदर्शों के प्रसरण s₁² = ${s.variance1} और s₂² = ${s.variance2} हैं। F = s₁²/s₂² ज्ञात कीजिए।`,`ਦੋ ਸੁਤੰਤਰ ਨਮੂਨਿਆਂ ਦੇ ਪ੍ਰਸਰਨ s₁² = ${s.variance1} ਅਤੇ s₂² = ${s.variance2} ਹਨ। F = s₁²/s₂² ਪਤਾ ਕਰੋ।`);explanation=t('प्रसरण अनुपात','ਪ੍ਰਸਰਨ ਅਨੁਪਾਤ')+` F = ${s.variance1}/${s.variance2} ≈ ${q.answer}.`;
 }
 return completeFinal(q,l,stem,explanation,STAT011_PERMANENT_QLS,solveStat011State,"STAT-011");
}
