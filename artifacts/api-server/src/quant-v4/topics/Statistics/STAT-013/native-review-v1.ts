import type {Stat013Question} from './types';
import {STAT013_PERMANENT_QLS} from './permanent-ql-registry';
import {solveStat013State,fitLeastSquaresTrend} from './time-series';
import {completeFinal,registerFinalTerms} from '../shared/native-final-v1';
import {copy,fmt,type NativeLanguage} from '../shared/native-007-009';
registerFinalTerms({
'Long-run trend':['दीर्घकालीन प्रवृत्ति','ਲੰਬੇ ਸਮੇਂ ਦਾ ਰੁਝਾਨ'],
'Trend, seasonal, cyclical, and irregular':['प्रवृत्ति, मौसमी, चक्रीय और अनियमित','ਰੁਝਾਨ, ਮੌਸਮੀ, ਚੱਕਰੀ ਅਤੇ ਅਨਿਯਮਿਤ'],'Mean, median, mode, and range':['माध्य, माध्यिका, बहुलक और परास','ਮੱਧਮਾਨ, ਮੱਧਿਕਾ, ਬਹੁਲਕ ਅਤੇ ਪਰਾਸ'],'Level, variance, skewness, and kurtosis':['स्तर, प्रसरण, विषमता और ककुदता','ਪੱਧਰ, ਪ੍ਰਸਰਨ, ਵਿਸ਼ਮਤਾ ਅਤੇ ਕਕੁਦਤਾ'],'Population, sample, parameter, and statistic':['समष्टि, प्रतिदर्श, प्राचल और प्रतिदर्शज','ਸਮਸ਼ਟੀ, ਨਮੂਨਾ, ਪ੍ਰਾਚਲ ਅਤੇ ਨਮੂਨਾ ਅੰਕੜਾ'],'Trend':['प्रवृत्ति','ਰੁਝਾਨ'],'Seasonal':['मौसमी','ਮੌਸਮੀ'],'Cyclical':['चक्रीय','ਚੱਕਰੀ'],'Irregular':['अनियमित','ਅਨਿਯਮਿਤ'],'Sampling':['प्रतिचयन','ਨਮੂਨਾਕਰਨ'],'Deterministic trend':['नियतात्मक प्रवृत्ति','ਨਿਰਧਾਰਤ ਰੁਝਾਨ'],
});
function match(text:string,re:RegExp){const m=text.match(re);if(!m)throw new Error(`Unrecognized time-series facts: ${text}`);return m;}
export function localizeStat013Question(q:Stat013Question,l:NativeLanguage){
 const t=copy(l),s=q.state;let stem='',explanation='';let recomputed:number|undefined;
 if(s.kind==='CLASSIFY'||s.kind==='DECISION'){
 const C:Record<string,readonly[string,string,string,string]>={
 COMPONENTS:['शास्त्रीय काल-श्रेणी के चार घटक कौन-से हैं?','ਰਵਾਇਤੀ ਸਮਾਂ-ਲੜੀ ਦੇ ਚਾਰ ਭਾਗ ਕਿਹੜੇ ਹਨ?','चार घटक प्रवृत्ति, मौसमी, चक्रीय और अनियमित हैं।','ਚਾਰ ਭਾਗ ਰੁਝਾਨ, ਮੌਸਮੀ, ਚੱਕਰੀ ਅਤੇ ਅਨਿਯਮਿਤ ਹਨ।'],
 TREND:['अल्पकालीन उतार-चढ़ाव हटाने पर श्रेणी कई वर्षों में लगातार बढ़ती है। कौन-सा घटक है?','ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੇ ਉਤਾਰ-ਚੜ੍ਹਾਅ ਹਟਾਉਣ ਉੱਤੇ ਲੜੀ ਕਈ ਸਾਲਾਂ ਵਿੱਚ ਲਗਾਤਾਰ ਵਧਦੀ ਹੈ। ਕਿਹੜਾ ਭਾਗ ਹੈ?','दीर्घकालीन दिशा प्रवृत्ति कहलाती है।','ਲੰਬੇ ਸਮੇਂ ਦੀ ਦਿਸ਼ਾ ਰੁਝਾਨ ਕਹਾਉਂਦੀ ਹੈ।'],
 SEASONAL:['एक विक्रेता की बिक्री हर दिसंबर लगभग समान ढंग से बढ़ती है। कौन-सा घटक है?','ਇੱਕ ਵਿਕਰੇਤਾ ਦੀ ਵਿਕਰੀ ਹਰ ਦਸੰਬਰ ਲਗਭਗ ਇੱਕੋ ਤਰ੍ਹਾਂ ਵਧਦੀ ਹੈ। ਕਿਹੜਾ ਭਾਗ ਹੈ?','वर्ष के भीतर निश्चित अवधि पर दोहराव मौसमी परिवर्तन है।','ਸਾਲ ਅੰਦਰ ਨਿਸ਼ਚਿਤ ਅਵਧੀ ਉੱਤੇ ਦੁਹਰਾਅ ਮੌਸਮੀ ਬਦਲਾਅ ਹੈ।'],
 CYCLICAL:['आर्थिक विस्तार और संकुचन कई वर्षों में लहरों की तरह आते हैं, पर निश्चित वार्षिक अवधि नहीं है। कौन-सा घटक है?','ਆਰਥਿਕ ਵਿਸਥਾਰ ਅਤੇ ਸੁੰਗੜਾਅ ਕਈ ਸਾਲਾਂ ਵਿੱਚ ਲਹਿਰਾਂ ਵਾਂਗ ਆਉਂਦੇ ਹਨ, ਪਰ ਨਿਸ਼ਚਿਤ ਸਾਲਾਨਾ ਅਵਧੀ ਨਹੀਂ ਹੈ। ਕਿਹੜਾ ਭਾਗ ਹੈ?','निश्चित मौसमी अवधि के बिना लंबे उतार-चढ़ाव चक्रीय हैं।','ਨਿਸ਼ਚਿਤ ਮੌਸਮੀ ਅਵਧੀ ਤੋਂ ਬਿਨਾਂ ਲੰਬੇ ਉਤਾਰ-ਚੜ੍ਹਾਅ ਚੱਕਰੀ ਹਨ।'],
 IRREGULAR:['एक बार की आपूर्ति बाधा से प्रवृत्ति और मौसमी प्रभावों से अस्पष्ट अप्रत्याशित उतार-चढ़ाव होता है। कौन-सा घटक है?','ਇੱਕ ਵਾਰ ਦੀ ਸਪਲਾਈ ਰੁਕਾਵਟ ਨਾਲ ਰੁਝਾਨ ਅਤੇ ਮੌਸਮੀ ਅਸਰਾਂ ਤੋਂ ਨਾ ਸਮਝਾਇਆ ਜਾ ਸਕਣ ਵਾਲਾ ਅਚਾਨਕ ਉਤਾਰ-ਚੜ੍ਹਾਅ ਹੁੰਦਾ ਹੈ। ਕਿਹੜਾ ਭਾਗ ਹੈ?','अप्रत्याशित शेष परिवर्तन अनियमित घटक है।','ਅਚਾਨਕ ਬਚਿਆ ਬਦਲਾਅ ਅਨਿਯਮਿਤ ਭਾਗ ਹੈ।'],
 ADDITIVE_MODEL:['योगात्मक काल-श्रेणी मॉडल में घटक कैसे मिलते हैं?','ਜੋੜਾਤਮਕ ਸਮਾਂ-ਲੜੀ ਮਾਡਲ ਵਿੱਚ ਭਾਗ ਕਿਵੇਂ ਮਿਲਦੇ ਹਨ?','योगात्मक मॉडल: Y = T + S + C + I.','ਜੋੜਾਤਮਕ ਮਾਡਲ: Y = T + S + C + I.'],
 MULTIPLICATIVE_MODEL:['गुणात्मक काल-श्रेणी मॉडल में घटक कैसे मिलते हैं?','ਗੁਣਾਤਮਕ ਸਮਾਂ-ਲੜੀ ਮਾਡਲ ਵਿੱਚ ਭਾਗ ਕਿਵੇਂ ਮਿਲਦੇ ਹਨ?','गुणात्मक मॉडल: Y = T × S × C × I.','ਗੁਣਾਤਮਕ ਮਾਡਲ: Y = T × S × C × I.'],
 };const c=C[q.contractId];if(!c)throw new Error('Unauthored time-series concept');stem=t(c[0],c[1]);explanation=t(c[2],c[3]);
 }else if(s.kind==='NUMERIC'){
 if(q.contractId==='MOVING_AVERAGE'){
 const values=match(q.stem,/observations ([\d., ]+)\?/)[1]!.split(',').map(Number);recomputed=values.reduce((a,b)=>a+b,0)/values.length;
 stem=t(`प्रेक्षण ${values.join(', ')} का 3-अवधि चल माध्य ज्ञात कीजिए।`,`ਨਿਰੀਖਣ ${values.join(', ')} ਦਾ 3-ਅਵਧੀ ਚਲਦਾ ਮੱਧਮਾਨ ਪਤਾ ਕਰੋ।`);explanation=t('चल माध्य','ਚਲਦਾ ਮੱਧਮਾਨ')+` = (${values.join(' + ')})/3 = ${q.answer}.`;
 }else if(q.contractId==='CENTERED_MOVING_AVERAGE'){
 const m=match(q.stem,/averages are ([\d.]+) and ([\d.]+)\./),a=Number(m[1]),b=Number(m[2]);recomputed=(a+b)/2;stem=t(`सम-अवधि श्रेणी के दो निकटवर्ती चल माध्य ${a} और ${b} हैं। केंद्रित चल माध्य ज्ञात कीजिए।`,`ਸਮ-ਅਵਧੀ ਲੜੀ ਦੇ ਦੋ ਨੇੜਲੇ ਚਲਦੇ ਮੱਧਮਾਨ ${a} ਅਤੇ ${b} ਹਨ। ਕੇਂਦਰਿਤ ਚਲਦਾ ਮੱਧਮਾਨ ਪਤਾ ਕਰੋ।`);explanation=t('दो निकटवर्ती माध्यों का औसत','ਦੋ ਨੇੜਲੇ ਮੱਧਮਾਨਾਂ ਦਾ ਔਸਤ')+` = (${a}+${b})/2 = ${q.answer}.`;
 }else if(q.contractId==='LEAST_SQUARES_TREND'){
 const values=match(q.stem,/are ([\d., ]+), respectively/)[1]!.split(',').map(Number),times=[-2,-1,0,1,2],fit=fitLeastSquaresTrend(times,values),sumY=values.reduce((a,b)=>a+b,0),sumTY=values.reduce((a,v,i)=>a+times[i]!*v,0);recomputed=fit.intercept+fit.slope*3;
 stem=t(`t = −2, −1, 0, 1, 2 पर प्रेक्षण क्रमशः ${values.join(', ')} हैं। न्यूनतम वर्ग रेखीय प्रवृत्ति Ŷ = a + bt से t = 3 का अनुमान ज्ञात कीजिए।`,`t = −2, −1, 0, 1, 2 ਉੱਤੇ ਨਿਰੀਖਣ ਕ੍ਰਮਵਾਰ ${values.join(', ')} ਹਨ। ਘੱਟੋ-ਘੱਟ ਵਰਗ ਰੇਖੀ ਰੁਝਾਨ Ŷ = a + bt ਨਾਲ t = 3 ਦਾ ਅਨੁਮਾਨ ਪਤਾ ਕਰੋ।`);explanation=t('कूट समय का माध्य शून्य है।','ਕੋਡ ਸਮੇਂ ਦਾ ਮੱਧਮਾਨ ਸਿਫ਼ਰ ਹੈ।')+` a = ΣY/5 = ${sumY}/5 = ${fit.intercept}.\nb = ΣtY/Σt² = ${sumTY}/10 = ${fit.slope}.\nŶ(3) = ${fit.intercept}+${fit.slope}×3 = ${q.answer}.`;
 }else if(q.contractId==='FORECAST'){
 const m=match(q.stem,/Ŷ = ([\d.]+) \+ ([\d.]+)t.*t = ([\d.]+)/),a=Number(m[1]),b=Number(m[2]),at=Number(m[3]);recomputed=a+b*at;stem=t(`प्रवृत्ति Ŷ = ${a} + ${b}t है। t = ${at} पर पूर्वानुमान ज्ञात कीजिए।`,`ਰੁਝਾਨ Ŷ = ${a} + ${b}t ਹੈ। t = ${at} ਉੱਤੇ ਪੂਰਵ-ਅਨੁਮਾਨ ਪਤਾ ਕਰੋ।`);explanation=t('समय का मान रखने पर','ਸਮੇਂ ਦਾ ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ')+` Ŷ = ${a}+${b}×${at} = ${q.answer}.`;
 }else if(q.contractId==='SEASONAL_INDEX'){
 const m=match(q.stem,/average is ([\d.]+); the overall average is ([\d.]+)/),a=Number(m[1]),b=Number(m[2]);recomputed=a/b*100;stem=t(`मौसमी औसत ${a} और समग्र औसत ${b} है। मौसमी सूचकांक प्रतिशत में ज्ञात कीजिए।`,`ਮੌਸਮੀ ਔਸਤ ${a} ਅਤੇ ਸਮੁੱਚਾ ਔਸਤ ${b} ਹੈ। ਮੌਸਮੀ ਸੂਚਕ ਅੰਕ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਪਤਾ ਕਰੋ।`);explanation=t('मौसमी सूचकांक','ਮੌਸਮੀ ਸੂਚਕ ਅੰਕ')+` = (${a}/${b}) × 100 ≈ ${q.answer}.`;
 }else throw new Error('Unauthored numeric time-series contract');
 }else if(s.kind==='CENTERED_MA'){
 const av=Array.from({length:s.values.length-s.period+1},(_,i)=>s.values.slice(i,i+s.period).reduce((a,b)=>a+b,0)/s.period);
 stem=t(`लगातार तिमाहियों के मान ${s.values.join(', ')} हैं। मध्य तिमाही का केंद्रित ${s.period}-तिमाही चल माध्य ज्ञात कीजिए।`,`ਲਗਾਤਾਰ ਤਿਮਾਹੀਆਂ ਦੇ ਮੁੱਲ ${s.values.join(', ')} ਹਨ। ਵਿਚਕਾਰਲੀ ਤਿਮਾਹੀ ਦਾ ਕੇਂਦਰਿਤ ${s.period}-ਤਿਮਾਹੀ ਚਲਦਾ ਮੱਧਮਾਨ ਪਤਾ ਕਰੋ।`);explanation=t('निकटवर्ती चल माध्य','ਨੇੜਲੇ ਚਲਦੇ ਮੱਧਮਾਨ')+`: (${s.values.slice(0,s.period).join('+')})/${s.period} → ${av[0]}, (${s.values.slice(1,1+s.period).join('+')})/${s.period} → ${av[1]}.\n`+t('केंद्रित मान','ਕੇਂਦਰਿਤ ਮੁੱਲ')+` = (${av[0]}+${av[1]})/2 = ${q.answer}.`;
 }else if(s.kind==='ADJUSTED_INDEX'){
 const sum=s.indices.reduce((a,b)=>a+b,0);stem=t(`असमायोजित मौसमी सूचकांक ${s.indices.join(', ')} हैं। कुल ${s.period*100} करने के लिए ${s.index+1}वीं अवधि का सूचकांक समायोजित कीजिए।`,`ਅਣਸੋਧੇ ਮੌਸਮੀ ਸੂਚਕ ਅੰਕ ${s.indices.join(', ')} ਹਨ। ਕੁੱਲ ${s.period*100} ਕਰਨ ਲਈ ${s.index+1}ਵੀਂ ਅਵਧੀ ਦਾ ਸੂਚਕ ਅੰਕ ਸੋਧੋ।`);explanation=t('समायोजन गुणक','ਸੋਧ ਗੁਣਕ')+` = ${s.period*100}/${sum}.\n${s.indices[s.index]} × ${s.period*100}/${sum} ≈ ${q.answer}.`;
 }else if(s.kind==='SEASONAL_FORECAST'){
 const add=s.model==='additive';stem=t(`प्रवृत्ति-चक्र ${s.trend} और मौसमी ${add?'प्रभाव':'सूचकांक'} ${add?s.seasonalEffect:fmt(s.seasonalEffect*100)} है। अनियमित प्रभाव ${add?'शून्य':'एक'} मानकर ${add?'योगात्मक':'गुणात्मक'} पूर्वानुमान ज्ञात कीजिए।`,`ਰੁਝਾਨ-ਚੱਕਰ ${s.trend} ਅਤੇ ਮੌਸਮੀ ${add?'ਅਸਰ':'ਸੂਚਕ ਅੰਕ'} ${add?s.seasonalEffect:fmt(s.seasonalEffect*100)} ਹੈ। ਅਨਿਯਮਿਤ ਅਸਰ ${add?'ਸਿਫ਼ਰ':'ਇੱਕ'} ਮੰਨ ਕੇ ${add?'ਜੋੜਾਤਮਕ':'ਗੁਣਾਤਮਕ'} ਪੂਰਵ-ਅਨੁਮਾਨ ਪਤਾ ਕਰੋ।`);explanation=(add?'':t('पहले सूचकांक को 100 से भाग देकर मौसमी गुणक निकालिए।','ਪਹਿਲਾਂ ਸੂਚਕ ਅੰਕ ਨੂੰ 100 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮੌਸਮੀ ਗੁਣਕ ਕੱਢੋ।')+` ${fmt(s.seasonalEffect*100)}/100 = ${s.seasonalEffect}.\n`)+t('मौसमी पूर्वानुमान','ਮੌਸਮੀ ਪੂਰਵ-ਅਨੁਮਾਨ')+` = ${s.trend} ${add?'+':'×'} (${s.seasonalEffect}) = ${q.answer}.`;
 }else if(s.kind==='DESEASONALIZE'||s.kind==='ADDITIVE_ADJUST'){
 const multi=s.kind==='DESEASONALIZE';stem=t(`प्रेक्षित मान ${s.observed} और मौसमी ${multi?'सूचकांक':'प्रभाव'} ${multi?s.seasonalIndex:s.seasonalEffect} है। ${multi?'गुणात्मक':'योगात्मक'} विधि से मौसम-समायोजित मान ज्ञात कीजिए।`,`ਨਿਰੀਖਿਆ ਮੁੱਲ ${s.observed} ਅਤੇ ਮੌਸਮੀ ${multi?'ਸੂਚਕ ਅੰਕ':'ਅਸਰ'} ${multi?s.seasonalIndex:s.seasonalEffect} ਹੈ। ${multi?'ਗੁਣਾਤਮਕ':'ਜੋੜਾਤਮਕ'} ਵਿਧੀ ਨਾਲ ਮੌਸਮ-ਸੋਧਿਆ ਮੁੱਲ ਪਤਾ ਕਰੋ।`);explanation=t('मौसम-समायोजित मान','ਮੌਸਮ-ਸੋਧਿਆ ਮੁੱਲ')+` = ${s.observed} ${multi?`/(${s.seasonalIndex}/100)`:`− (${s.seasonalEffect})`} = ${q.answer}.`;
 }else if(s.kind==='SEASONAL_RATIOS'){
 const ratios=s.observed.map((v,i)=>v/s.trendCycle[i]!*100);stem=t(`एक ही तिमाही के अलग वर्षों में प्रेक्षण ${s.observed.join(', ')} और संबंधित केंद्रित चल माध्य ${s.trendCycle.join(', ')} हैं। चल-माध्य अनुपातों के अंकगणितीय औसत से असमायोजित मौसमी सूचकांक ज्ञात कीजिए।`,`ਇੱਕੋ ਤਿਮਾਹੀ ਦੇ ਵੱਖਰੇ ਸਾਲਾਂ ਵਿੱਚ ਨਿਰੀਖਣ ${s.observed.join(', ')} ਅਤੇ ਸੰਬੰਧਿਤ ਕੇਂਦਰਿਤ ਚਲਦੇ ਮੱਧਮਾਨ ${s.trendCycle.join(', ')} ਹਨ। ਚਲਦੇ-ਮੱਧਮਾਨ ਅਨੁਪਾਤਾਂ ਦੇ ਅੰਕਗਣਿਤਕ ਔਸਤ ਨਾਲ ਅਣਸੋਧਿਆ ਮੌਸਮੀ ਸੂਚਕ ਅੰਕ ਪਤਾ ਕਰੋ।`);explanation=t('प्रत्येक अनुपात','ਹਰੇਕ ਅਨੁਪਾਤ')+`: ${s.observed.map((v,i)=>`(${v}/${s.trendCycle[i]})×100 = ${fmt(ratios[i]!)}`).join('; ')}.\n`+t('औसत','ਔਸਤ')+` = (${ratios.join('+')})/${ratios.length} = ${q.answer}.`;
 }else{
 const half=s.values.length/2,a=s.values.slice(0,half).reduce((a,b)=>a+b,0)/half,b=s.values.slice(half).reduce((a,b)=>a+b,0)/half,ta=(half+1)/2,tb=ta+half,slope=(b-a)/(tb-ta);
 stem=t(`वर्ष 1 से ${s.values.length} के मान ${s.values.join(', ')} हैं। दो बराबर भागों की अर्ध-माध्य रेखीय प्रवृत्ति से वर्ष ${s.forecastTime} का मान ज्ञात कीजिए।`,`ਸਾਲ 1 ਤੋਂ ${s.values.length} ਦੇ ਮੁੱਲ ${s.values.join(', ')} ਹਨ। ਦੋ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਦੇ ਅੱਧ-ਮੱਧਮਾਨ ਰੇਖੀ ਰੁਝਾਨ ਨਾਲ ਸਾਲ ${s.forecastTime} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`);explanation=t('दो भागों के माध्य उनके मध्य वर्षों पर रखिए।','ਦੋ ਹਿੱਸਿਆਂ ਦੇ ਮੱਧਮਾਨ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰਲੇ ਸਾਲਾਂ ਉੱਤੇ ਰੱਖੋ।')+` (${ta}, ${a}), (${tb}, ${b}).\nb = (${b}−${a})/(${tb}−${ta}) = ${slope}.\nŶ = ${a}+${slope}(${s.forecastTime}−${ta}) = ${q.answer}.`;
 }
 if(recomputed!==undefined&&fmt(recomputed)!==q.answer)throw new Error('Time-series displayed facts mismatch');
 return completeFinal(q,l,stem,explanation,STAT013_PERMANENT_QLS,solveStat013State,"STAT-013");
}
