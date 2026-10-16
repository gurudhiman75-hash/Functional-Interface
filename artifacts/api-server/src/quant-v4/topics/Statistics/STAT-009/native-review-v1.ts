import type {Stat009Question} from './types';
import {STAT009_PERMANENT_QLS} from './permanent-ql-registry';
import {solveStat009State} from './random-variables';
import {copy,fmt,finishNative,assertSource,type NativeLanguage} from '../shared/native-007-009';
export function localizeStat009Question(q:Stat009Question,l:NativeLanguage){
 assertSource(q,'STAT-009',STAT009_PERMANENT_QLS.find(o=>o.qlId===q.qlId),solveStat009State(q.state),4);
 const t=copy(l),s=q.state;let stem='',explanation='';const f=(n:number)=>fmt(n,4);
 if(s.kind==='WEIGHTS'){
  const total=s.weights.reduce((a,b)=>a+b,0),selected=s.selected??0;
  stem=t(`X = 0, 1, 2 की प्रायिकताएँ क्रमशः ${s.weights.join(', ')} के समानुपाती हैं। P(X = ${selected}) ज्ञात कीजिए।`,`X = 0, 1, 2 ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਕ੍ਰਮਵਾਰ ${s.weights.join(', ')} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ। P(X = ${selected}) ਪਤਾ ਕਰੋ।`);
  explanation=t('भारों का योग','ਭਾਰਾਂ ਦਾ ਜੋੜ')+` = ${s.weights.join(' + ')} = ${total}.\nP(X = ${selected}) = ${s.weights[selected]}/${total} ≈ ${q.answer}.`;
 }else if(s.kind==='DISTRIBUTION'){
  const total=s.weights.reduce((a,b)=>a+b,0),weighted=s.values.reduce((a,v,i)=>a+v*s.weights[i]!,0),mean=weighted/total;
  const table=`| X | ${s.values.join(' | ')} |\n|---|${s.values.map(()=>'---:').join('|')}|\n| ${t('प्रायिकता भार','ਸੰਭਾਵਨਾ ਭਾਰ')} | ${s.weights.join(' | ')} |`;
  const ask=s.output==='expectation'?'E[X]':s.output==='variance'?'Var(X)':s.output==='third'?'μ3':`E[Y], Y = (${s.a})X + (${s.b})`;
  stem=t(`X के मान और उनके प्रायिकता भार नीचे दिए हैं। ${ask} ज्ञात कीजिए।`,`X ਦੇ ਮੁੱਲ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਸੰਭਾਵਨਾ ਭਾਰ ਹੇਠਾਂ ਦਿੱਤੇ ਹਨ। ${ask} ਪਤਾ ਕਰੋ।`)+`\n${table}`;
  explanation=t('भारों का योग','ਭਾਰਾਂ ਦਾ ਜੋੜ')+` = ${total}.\nE[X] = (${s.values.map((v,i)=>`(${v}) × ${s.weights[i]}`).join(' + ')})/${total} = ${weighted}/${total} ≈ ${f(mean)}.`;
  if(s.output==='variance'||s.output==='third'){
   const power=s.output==='variance'?2:3;
   explanation+='\n'+t('पूर्ण माध्य का उपयोग करके','ਪੂਰੇ ਮੱਧਮਾਨ ਦੀ ਵਰਤੋਂ ਕਰਕੇ')+`: ${power===2?'Var(X)':'μ3'} = [${s.values.map((v,i)=>`(${v} − ${weighted}/${total})^${power} × ${s.weights[i]}`).join(' + ')}]/${total} ≈ ${q.answer}.`;
  }else if(s.output==='affine-expectation')explanation+='\n'+t('प्रत्याशा की रैखिकता','ਉਮੀਦ ਦੀ ਰੇਖੀਤਾ')+`: E[Y] = ${s.a}E[X] + (${s.b}) = ${s.a} × (${weighted}/${total}) + (${s.b}) ≈ ${q.answer}.`;
 }else if(s.kind==='BINOMIAL'){
  const output=s.output==='mean'?t('माध्य','ਮੱਧਮਾਨ'):t('प्रसरण','ਪ੍ਰਸਰਨ');
  stem=t(`X द्विपद वितरण का अनुसरण करता है, जहाँ n = ${s.n} और p = ${s.p} हैं। `,`X ਦੁਪਦ ਵੰਡ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ, ਜਿੱਥੇ n = ${s.n} ਅਤੇ p = ${s.p} ਹਨ। `)+(s.output==='point'?t(`P(X = ${s.k}) ज्ञात कीजिए।`,`P(X = ${s.k}) ਪਤਾ ਕਰੋ।`):t(`${output} ज्ञात कीजिए।`,`${output} ਪਤਾ ਕਰੋ।`));
  explanation=t('द्विपद वितरण का सूत्र','ਦੁਪਦ ਵੰਡ ਦਾ ਸੂਤਰ')+': '+(s.output==='point'?`P(X = ${s.k}) = C(${s.n},${s.k}) × (${s.p})^${s.k} × (1 − ${s.p})^${s.n-s.k}`:s.output==='mean'?`E[X] = np = ${s.n} × ${s.p}`:`Var(X) = np(1 − p) = ${s.n} × ${s.p} × (1 − ${s.p})`)+` ≈ ${q.answer}.`;
 }else if(s.kind==='POISSON'){
  const name=s.output==='mean'?t('माध्य','ਮੱਧਮਾਨ'):t('प्रसरण','ਪ੍ਰਸਰਨ');
  stem=t(`X का प्वासों वितरण है, जिसका माध्य λ = ${s.lambda} है। `,`X ਦੀ ਪੋਆਸੋਂ ਵੰਡ ਹੈ, ਜਿਸ ਦਾ ਮੱਧਮਾਨ λ = ${s.lambda} ਹੈ। `)+(s.output==='point'?t(`P(X = ${s.k}) ज्ञात कीजिए।`,`P(X = ${s.k}) ਪਤਾ ਕਰੋ।`):t(`${name} ज्ञात कीजिए।`,`${name} ਪਤਾ ਕਰੋ।`));
  explanation=s.output==='point'?t('प्वासों प्रायिकता सूत्र','ਪੋਆਸੋਂ ਸੰਭਾਵਨਾ ਸੂਤਰ')+`: P(X = ${s.k}) = e^(−${s.lambda}) × (${s.lambda})^${s.k}/${s.k}! ≈ ${q.answer}.`:t('प्वासों वितरण का माध्य और प्रसरण दोनों λ के बराबर होते हैं।','ਪੋਆਸੋਂ ਵੰਡ ਦਾ ਮੱਧਮਾਨ ਅਤੇ ਪ੍ਰਸਰਨ ਦੋਵੇਂ λ ਦੇ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ।')+` ${name} = ${s.lambda}.`;
 }else if(s.kind==='NORMAL_Z'){
  stem=t(`X का सामान्य वितरण है, जिसका माध्य ${s.mean} और मानक विचलन ${s.sd} है। X = ${s.x} का मानक स्कोर ज्ञात कीजिए।`,`X ਦੀ ਸਧਾਰਨ ਵੰਡ ਹੈ, ਜਿਸ ਦਾ ਮੱਧਮਾਨ ${s.mean} ਅਤੇ ਮਿਆਰੀ ਵਿਚਲਨ ${s.sd} ਹੈ। X = ${s.x} ਦਾ ਮਿਆਰੀ ਸਕੋਰ ਪਤਾ ਕਰੋ।`);
  explanation=t('मानकीकरण','ਮਿਆਰੀਕਰਨ')+`: z = (x − μ)/σ = (${s.x} − ${s.mean})/${s.sd} = ${q.answer}.`;
 }else if(s.kind==='EXPONENTIAL'){
  stem=t(`प्रतीक्षा समय X का चरघातांकी वितरण है, जिसकी दर λ = ${s.rate} है। P(X > ${s.t}) ज्ञात कीजिए।`,`ਉਡੀਕ ਸਮੇਂ X ਦੀ ਘਾਤਾਂਕੀ ਵੰਡ ਹੈ, ਜਿਸ ਦੀ ਦਰ λ = ${s.rate} ਹੈ। P(X > ${s.t}) ਪਤਾ ਕਰੋ।`);
  explanation=t('उत्तरजीविता प्रायिकता','ਬਚਾਅ ਸੰਭਾਵਨਾ')+`: P(X > t) = e^(−λt).\nP(X > ${s.t}) = e^(−${s.rate} × ${s.t}) ≈ ${q.answer}.`;
 }else{
  const[a,b,c,d]=s.cells,total=a+b+c+d,[x0,x1]=s.xValues,[y0,y1]=s.yValues;
  const table=`| X \\ Y | ${y0} | ${y1} |\n|---|---:|---:|\n| ${x0} | ${a} | ${b} |\n| ${x1} | ${c} | ${d} |`;
  stem=t('संयुक्त वितरण की बारंबारताएँ नीचे दी हैं।','ਸਾਂਝੀ ਵੰਡ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।')+' '+(s.output==='independent'?t('क्या X और Y स्वतंत्र हैं?','ਕੀ X ਅਤੇ Y ਸੁਤੰਤਰ ਹਨ?'):t(`${s.output==='marginal'?`P(X = ${x0})`:s.output==='conditional'?`P(Y = ${y0}|X = ${x0})`:'Cov(X,Y)'} ज्ञात कीजिए।`,`${s.output==='marginal'?`P(X = ${x0})`:s.output==='conditional'?`P(Y = ${y0}|X = ${x0})`:'Cov(X,Y)'} ਪਤਾ ਕਰੋ।`))+`\n${table}`;
  explanation=t('कुल बारंबारता','ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ')+` = ${a}+${b}+${c}+${d} = ${total}.\n`;
  if(s.output==='marginal')explanation+=`P(X = ${x0}) = (${a}+${b})/${total} ≈ ${q.answer}.`;
  else if(s.output==='conditional')explanation+=`P(Y = ${y0}|X = ${x0}) = ${a}/(${a}+${b}) ≈ ${q.answer}.`;
  else if(s.output==='independent')explanation+=`P(X=${x0},Y=${y0}) = ${a}/${total}; P(X=${x0})P(Y=${y0}) = (${a}+${b})(${a}+${c})/${total}².\n`+t(q.answer==='Independent'?'दोनों मान बराबर हैं और प्रत्येक कोशिका सीमांत प्रायिकताओं के गुणनफल से मेल खाती है। X और Y स्वतंत्र हैं।':'दोनों मान अलग हैं। X और Y परतंत्र हैं।',q.answer==='Independent'?'ਦੋਵੇਂ ਮੁੱਲ ਬਰਾਬਰ ਹਨ ਅਤੇ ਹਰੇਕ ਖਾਨਾ ਹਾਸ਼ੀਆਈ ਸੰਭਾਵਨਾਵਾਂ ਦੇ ਗੁਣਨਫਲ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। X ਅਤੇ Y ਸੁਤੰਤਰ ਹਨ।':'ਦੋਵੇਂ ਮੁੱਲ ਵੱਖਰੇ ਹਨ। X ਅਤੇ Y ਪਰਤੰਤਰ ਹਨ।');
  else explanation+=`E[X] = (${x0} × (${a}+${b}) + ${x1} × (${c}+${d}))/${total}.\nE[Y] = (${y0} × (${a}+${c}) + ${y1} × (${b}+${d}))/${total}.\nE[XY] = (${a} × ${x0} × ${y0} + ${b} × ${x0} × ${y1} + ${c} × ${x1} × ${y0} + ${d} × ${x1} × ${y1})/${total}.\n`+t('सहप्रसरण','ਸਹਿਪ੍ਰਸਰਨ')+` = E[XY] − E[X]E[Y] ≈ ${q.answer}.`;
 }
 return finishNative(q,l,stem,explanation);
}
