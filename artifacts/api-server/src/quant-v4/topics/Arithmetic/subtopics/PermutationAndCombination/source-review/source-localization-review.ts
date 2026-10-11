import native from './extended-native-review.json';
import {digitSourceCases} from './digit-source-cases';
import type {SourceCatalogueRow} from './complete-source-catalogue';
const labels={hi:{answer:'अतः उत्तर',calculate:'गणना',integer:'सकारात्मक दशमलव संख्याएँ',code:'निश्चित लंबाई के दशमलव कोड',repeat:'अंकों का दोहराव मान्य है।',distinct:'अंकों का दोहराव मान्य नहीं है।',zero:'पहला अंक शून्य हो सकता है।',nonzero:'पहला अंक शून्य नहीं हो सकता।',count:'कितने परिणाम दी गई सभी शर्तें पूरी करते हैं?'},pa:{answer:'ਇਸ ਲਈ ਉੱਤਰ',calculate:'ਗਿਣਤੀ',integer:'ਧਨਾਤਮਕ ਦਸ਼ਮਲਵ ਸੰਖਿਆਵਾਂ',code:'ਨਿਸ਼ਚਿਤ ਲੰਬਾਈ ਦੇ ਦਸ਼ਮਲਵ ਕੋਡ',repeat:'ਅੰਕਾਂ ਦਾ ਦੁਹਰਾਓ ਮਨਜ਼ੂਰ ਹੈ।',distinct:'ਅੰਕਾਂ ਦਾ ਦੁਹਰਾਓ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ।',zero:'ਪਹਿਲਾ ਅੰਕ ਸਿਫ਼ਰ ਹੋ ਸਕਦਾ ਹੈ।',nonzero:'ਪਹਿਲਾ ਅੰਕ ਸਿਫ਼ਰ ਨਹੀਂ ਹੋ ਸਕਦਾ।',count:'ਕਿੰਨੇ ਨਤੀਜੇ ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੇ ਹਨ?'}};
function nativeDigitStem(id:string,language:'hi'|'pa'):string {
 const c=digitSourceCases.find(c=>c.id===id);if(!c)throw Error('Unknown digit source');const q=c.input,hi=language==='hi',l=labels[language];
 if(id==='II-034')return hi?'कितनी छह-अंकीय संख्याओं के सभी अंक विषम या सभी अंक सम हैं? दोहराव मान्य है, पहला अंक शून्य नहीं है।':'ਕਿੰਨੀਆਂ ਛੇ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਦੇ ਸਾਰੇ ਅੰਕ ਵਿਸ਼ਮ ਜਾਂ ਸਾਰੇ ਅੰਕ ਸਮ ਹਨ? ਦੁਹਰਾਓ ਮਨਜ਼ੂਰ ਹੈ, ਪਹਿਲਾ ਅੰਕ ਸਿਫ਼ਰ ਨਹੀਂ ਹੈ।';
 if(id==='II-035')return hi?'कितनी छह-अंकीय संख्याओं में कम से कम एक सम अंक है? दोहराव मान्य है, पहला अंक शून्य नहीं है।':'ਕਿੰਨੀਆਂ ਛੇ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮ ਅੰਕ ਹੈ? ਦੁਹਰਾਓ ਮਨਜ਼ੂਰ ਹੈ, ਪਹਿਲਾ ਅੰਕ ਸਿਫ਼ਰ ਨਹੀਂ ਹੈ।';
 if(id==='II-036')return hi?'कितनी दस-अंकीय संख्याओं में कम से कम दो अंक समान हैं? पहला अंक शून्य नहीं है।':'ਕਿੰਨੀਆਂ ਦਸ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਦੋ ਅੰਕ ਇੱਕੋ ਹਨ? ਪਹਿਲਾ ਅੰਕ ਸਿਫ਼ਰ ਨਹੀਂ ਹੈ।';
 const lines=[hi?`केवल ${q.digits.join(', ')} अंकों से ${q.code?l.code:l.integer} बनाएँ। लंबाई ${q.minLength===q.maxLength?q.minLength:`${q.minLength} से ${q.maxLength}`} है।`:`ਸਿਰਫ਼ ${q.digits.join(', ')} ਅੰਕਾਂ ਤੋਂ ${q.code?l.code:l.integer} ਬਣਾਓ। ਲੰਬਾਈ ${q.minLength===q.maxLength?q.minLength:`${q.minLength} ਤੋਂ ${q.maxLength}`} ਹੈ।`,q.repetition?l.repeat:l.distinct,q.code?l.zero:l.nonzero];
 if(q.minimum!==undefined)lines.push(hi?`मान कम से कम ${q.minimum} हो।`:`ਮੁੱਲ ਘੱਟੋ-ਘੱਟ ${q.minimum} ਹੋਵੇ।`);
 if(q.maximum!==undefined)lines.push(hi?`मान अधिकतम ${q.maximum} हो।`:`ਮੁੱਲ ਵੱਧ ਤੋਂ ਵੱਧ ${q.maximum} ਹੋਵੇ।`);
 if(q.modulus)lines.push(hi?`${q.modulus} से भाग देने पर शेष ${q.residue??0} हो।`:`${q.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਬਾਕੀ ${q.residue??0} ਹੋਵੇ।`);
 if(q.prefixes)lines.push(hi?`शुरुआत ${q.prefixes.join(' या ')} हो।`:`ਸ਼ੁਰੂਆਤ ${q.prefixes.join(' ਜਾਂ ')} ਹੋਵੇ।`);
 if(q.fixed)for(const [p,d]of Object.entries(q.fixed))lines.push(hi?`बाएँ से ${+p+1}वें स्थान पर ${d} हो।`:`ਖੱਬੇ ਤੋਂ ${+p+1}ਵੇਂ ਸਥਾਨ ਉੱਤੇ ${d} ਹੋਵੇ।`);
 if(q.evenPositions)lines.push(hi?`बाएँ से ${q.evenPositions.map(p=>p+1).join(', ')} स्थानों के अंक सम हों।`:`ਖੱਬੇ ਤੋਂ ${q.evenPositions.map(p=>p+1).join(', ')} ਸਥਾਨਾਂ ਦੇ ਅੰਕ ਸਮ ਹੋਣ।`);
 if(q.exact)lines.push(hi?`${q.exact.digit} ठीक ${q.exact.count} बार आए।`:`${q.exact.digit} ਠੀਕ ${q.exact.count} ਵਾਰ ਆਵੇ।`);
 if(q.distinct)lines.push(hi?`अलग अंक-मूल्यों की संख्या ${q.distinct.min} से ${q.distinct.max} तक हो।`:`ਵੱਖਰੇ ਅੰਕ-ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ${q.distinct.min} ਤੋਂ ${q.distinct.max} ਤੱਕ ਹੋਵੇ।`);
 if(q.oddCount!==undefined)lines.push(hi?`ठीक ${q.oddCount} अंक विषम हों।`:`ਠੀਕ ${q.oddCount} ਅੰਕ ਵਿਸ਼ਮ ਹੋਣ।`);
 if(q.sumParity!==undefined)lines.push(hi?`अंकों का योग ${q.sumParity?'विषम':'सम'} हो।`:`ਅੰਕਾਂ ਦਾ ਜੋੜ ${q.sumParity?'ਵਿਸ਼ਮ':'ਸਮ'} ਹੋਵੇ।`);
 if(q.increasing)lines.push(hi?'अंक बाएँ से दाएँ सख्ती से बढ़ें।':'ਅੰਕ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਸਖ਼ਤੀ ਨਾਲ ਵਧਣ।');
 if(q.divisibleByLast)lines.push(hi?'संख्या अपने अंतिम गैरशून्य अंक से विभाज्य हो।':'ਸੰਖਿਆ ਆਪਣੇ ਆਖ਼ਰੀ ਗੈਰ-ਸਿਫ਼ਰ ਅੰਕ ਨਾਲ ਭਾਗਯੋਗ ਹੋਵੇ।');
 if(q.excludeLast)lines.push(hi?`अंतिम अंक ${q.excludeLast.join(', ')} न हो।`:`ਆਖ਼ਰੀ ਅੰਕ ${q.excludeLast.join(', ')} ਨਾ ਹੋਵੇ।`);
 if(q.lastUnique)lines.push(hi?'अंतिम अंक किसी अन्य स्थान पर न आए।':'ਆਖ਼ਰੀ ਅੰਕ ਕਿਸੇ ਹੋਰ ਸਥਾਨ ਉੱਤੇ ਨਾ ਆਵੇ।');
 return [...lines,l.count].join(' ');
}
/** Keep mathematical notation, but never pass English prose through as native text. */
function mathematics(lines:string[]):string[] {
 const result:string[]=[];
 for(const text of lines)for(const clause of text.split(/[.;]/)){
  const cleaned=clause.replace(/\b[A-Za-z]{2,}\b/g,'').replace(/\b[a-zA-Z]\b(?![!^²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉(=+−×/]|\s*[=+−×/!^(])/g,'').replace(/\s+/g,' ').replace(/^[\s,:-]+|[\s,:-]+$/g,'').trim();
  if(/[=×+−^!]/.test(cleaned)&&/\d/.test(cleaned))result.push(cleaned);
 }
 return [...new Set(result)];
}
const conceptual:Record<string,[string,string]>={
 'I-007':['A के दो विकल्प हैं। B के 3×3=9 विकल्प हैं। अनुपात 2:9 है।','A ਦੀਆਂ ਦੋ ਚੋਣਾਂ ਹਨ। B ਦੀਆਂ 3×3=9 ਚੋਣਾਂ ਹਨ। ਅਨੁਪਾਤ 2:9 ਹੈ।'],
 'I-082':['यदि सभी संख्याएँ अलग हों तो वे 0 से 26 होंगी। 26 परिचित वाला व्यक्ति सबको जानता है, इसलिए शून्य परिचित वाला व्यक्ति नहीं हो सकता। विरोधाभास मिलता है।','ਜੇ ਸਾਰੀਆਂ ਗਿਣਤੀਆਂ ਵੱਖਰੀਆਂ ਹੋਣ ਤਾਂ ਉਹ 0 ਤੋਂ 26 ਹੋਣਗੀਆਂ। 26 ਜਾਣੂਆਂ ਵਾਲਾ ਵਿਅਕਤੀ ਸਭ ਨੂੰ ਜਾਣਦਾ ਹੈ, ਇਸ ਲਈ ਸਿਫ਼ਰ ਜਾਣੂਆਂ ਵਾਲਾ ਵਿਅਕਤੀ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਵਿਰੋਧ ਮਿਲਦਾ ਹੈ।'],
 'III-002':['तीन असमरेखीय बिंदु एक वृत्त निर्धारित करते हैं, पर अलग त्रिक उसी वृत्त पर हो सकते हैं। दी गई जानकारी इस दोहरी गणना को तय नहीं करती।','ਤਿੰਨ ਅਸਮਰੇਖੀ ਬਿੰਦੂ ਇੱਕ ਚੱਕਰ ਨਿਰਧਾਰਤ ਕਰਦੇ ਹਨ, ਪਰ ਵੱਖਰੀਆਂ ਤਿਕੜੀਆਂ ਉਸੇ ਚੱਕਰ ਉੱਤੇ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਇਸ ਦੋਹਰੀ ਗਿਣਤੀ ਨੂੰ ਤੈਅ ਨਹੀਂ ਕਰਦੀ।'],
 'WORKED-023':['अलग मूल्य अलग उपसमुच्चय-योग सुनिश्चित नहीं करते। 1,2,5,10 से 15 योग हैं; 1,2,3,4 से केवल 10। इसलिए संख्या निर्धारित नहीं है।','ਵੱਖਰੇ ਮੁੱਲ ਵੱਖਰੇ ਉਪਸਮੂਹ-ਜੋੜ ਯਕੀਨੀ ਨਹੀਂ ਕਰਦੇ। 1,2,5,10 ਤੋਂ 15 ਜੋੜ ਹਨ; 1,2,3,4 ਤੋਂ ਸਿਰਫ਼ 10। ਇਸ ਲਈ ਗਿਣਤੀ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੈ।'],
 'WORKED-027':['पाँच पत्र सही हों तो बचा पत्र भी सही लिफ़ाफ़े में होगा। ठीक पाँच सही होना असंभव है, इसलिए प्रायिकता शून्य है।','ਪੰਜ ਪੱਤਰ ਸਹੀ ਹੋਣ ਤਾਂ ਬਚਿਆ ਪੱਤਰ ਵੀ ਸਹੀ ਲਿਫ਼ਾਫ਼ੇ ਵਿੱਚ ਹੋਵੇਗਾ। ਠੀਕ ਪੰਜ ਸਹੀ ਹੋਣਾ ਅਸੰਭਵ ਹੈ, ਇਸ ਲਈ ਸੰਭਾਵਨਾ ਸਿਫ਼ਰ ਹੈ।'],
 'II-028':['एक पत्र दूसरे के लिफ़ाफ़े में जाए तो उस लिफ़ाफ़े का अपना पत्र भी हटेगा। केवल एक पत्र गलत नहीं हो सकता।','ਇੱਕ ਪੱਤਰ ਦੂਜੇ ਦੇ ਲਿਫ਼ਾਫ਼ੇ ਵਿੱਚ ਜਾਵੇ ਤਾਂ ਉਸ ਲਿਫ਼ਾਫ਼ੇ ਦਾ ਆਪਣਾ ਪੱਤਰ ਵੀ ਹਟੇਗਾ। ਸਿਰਫ਼ ਇੱਕ ਪੱਤਰ ਗਲਤ ਨਹੀਂ ਹੋ ਸਕਦਾ।'],
};
const answers:Record<string,[string,string]>={'Impossible':['असंभव','ਅਸੰਭਵ'],'Cannot be determined':['निर्धारित नहीं किया जा सकता','ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ']};
const options:Record<string,[string,string]>={...answers,'Always possible':['हमेशा संभव','ਹਮੇਸ਼ਾ ਸੰਭਵ'],'Possible only for even party sizes':['केवल सम व्यक्ति-संख्या के लिए संभव','ਸਿਰਫ਼ ਸਮ ਵਿਅਕਤੀ-ਗਿਣਤੀ ਲਈ ਸੰਭਵ'],'Possible only for odd party sizes':['केवल विषम व्यक्ति-संख्या के लिए संभव','ਸਿਰਫ਼ ਵਿਸ਼ਮ ਵਿਅਕਤੀ-ਗਿਣਤੀ ਲਈ ਸੰਭਵ'],'Always 15':['हमेशा 15','ਹਮੇਸ਼ਾ 15'],'Always 16':['हमेशा 16','ਹਮੇਸ਼ਾ 16'],'Always 10':['हमेशा 10','ਹਮੇਸ਼ਾ 10']};
export function localizeSourceReview(q:SourceCatalogueRow,language:'hi'|'pa'):SourceCatalogueRow {
 const index=language==='hi'?0:1,hi=index===0,l=labels[language],entry=native[q.id as keyof typeof native];
 const stem=entry?.[language]??nativeDigitStem(q.id,language),answer=answers[q.answer]?.[index]??q.answer;
 const body=q.explanation.join(' ');
 const family=/remainder|last digit|leading|digit|suffix/i.test(body)?'digits':/inclusion|intersection|union|subtract|exclude|difference/i.test(body)?'complement':/block|gap/i.test(body)?'block':/identical|repeat|multiset|multiplicit/i.test(body)?'multiset':/C\(|choose|subset|selection|compositions/i.test(body)?'selection':/P\(|factorial|permut|arrang|!/.test(body)?'permutation':'cases';
 const principles:Record<string,[string,string]>={
 digits:['पहले अंक और अंतिम अंक की पाबंदियाँ लागू करें। दोहराव की अनुमति के अनुसार बीच के स्थानों के विकल्प गिनें। अलग लंबाइयों और उपयुक्त अंतिम अंकों के मामलों को जोड़ें।','ਪਹਿਲੇ ਅੰਕ ਅਤੇ ਆਖ਼ਰੀ ਅੰਕ ਦੀਆਂ ਪਾਬੰਦੀਆਂ ਲਾਗੂ ਕਰੋ। ਦੁਹਰਾਓ ਦੀ ਆਗਿਆ ਮੁਤਾਬਕ ਵਿਚਲੇ ਸਥਾਨਾਂ ਦੀਆਂ ਚੋਣਾਂ ਗਿਣੋ। ਵੱਖਰੀਆਂ ਲੰਬਾਈਆਂ ਅਤੇ ਢੁਕਵੇਂ ਆਖ਼ਰੀ ਅੰਕਾਂ ਦੇ ਮਾਮਲੇ ਜੋੜੋ।'],
 complement:['पहले सभी परिणाम गिनें। प्रतिबंध तोड़ने वाले परिणाम घटाएँ; जो एक से अधिक बार घटे हैं, उन्हें प्रतिच्छेद की गणना से वापस जोड़ें।','ਪਹਿਲਾਂ ਸਾਰੇ ਨਤੀਜੇ ਗਿਣੋ। ਪਾਬੰਦੀ ਤੋੜਨ ਵਾਲੇ ਨਤੀਜੇ ਘਟਾਓ; ਜੋ ਇੱਕ ਤੋਂ ਵੱਧ ਵਾਰ ਘਟੇ ਹਨ, ਉਨ੍ਹਾਂ ਨੂੰ ਸਾਂਝੇ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਵਾਪਸ ਜੋੜੋ।'],
 block:['साथ रहने वाली वस्तुओं को एक खंड मानें और खंडों का क्रम गिनें। खंड के भीतर अलग क्रम अलग हों तो उन्हें भी गुणा करें। अलग रखने में उपलब्ध रिक्त स्थान चुनें।','ਨਾਲ ਰਹਿਣ ਵਾਲੀਆਂ ਵਸਤੂਆਂ ਨੂੰ ਇੱਕ ਖੰਡ ਮੰਨੋ ਅਤੇ ਖੰਡਾਂ ਦਾ ਕ੍ਰਮ ਗਿਣੋ। ਖੰਡ ਅੰਦਰ ਵੱਖਰੇ ਕ੍ਰਮ ਵੱਖਰੇ ਹੋਣ ਤਾਂ ਉਨ੍ਹਾਂ ਦਾ ਵੀ ਗੁਣਾ ਕਰੋ। ਅਲੱਗ ਰੱਖਣ ਵਿੱਚ ਉਪਲਬਧ ਖਾਲੀ ਸਥਾਨ ਚੁਣੋ।'],
 multiset:['समान प्रतियों के आपसी क्रम नए परिणाम नहीं हैं। सभी स्थानों के क्रमगुणित को समान प्रकारों की बहुलताओं के क्रमगुणित से भाग दें; निश्चित स्थान पहले भरें।','ਇੱਕੋ ਜਿਹੀਆਂ ਕਾਪੀਆਂ ਦੇ ਆਪਸੀ ਕ੍ਰਮ ਨਵੇਂ ਨਤੀਜੇ ਨਹੀਂ ਹਨ। ਸਾਰੇ ਸਥਾਨਾਂ ਦੇ ਫੈਕਟੋਰੀਅਲ ਨੂੰ ਇੱਕੋ ਕਿਸਮਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦੇ ਫੈਕਟੋਰੀਅਲ ਨਾਲ ਭਾਗ ਦਿਓ; ਨਿਸ਼ਚਿਤ ਸਥਾਨ ਪਹਿਲਾਂ ਭਰੋ।'],
 selection:['समूह में चयन का क्रम महत्व नहीं रखता, इसलिए C(n,r) का प्रयोग करें। नामित समूह और अलग पद अलग परिणाम देते हैं। वितरण में समान वस्तुओं की मात्राएँ गिनें और दी गई सीमाएँ लागू करें।','ਸਮੂਹ ਵਿੱਚ ਚੋਣ ਦਾ ਕ੍ਰਮ ਮਹੱਤਵ ਨਹੀਂ ਰੱਖਦਾ, ਇਸ ਲਈ C(n,r) ਵਰਤੋ। ਨਾਮਿਤ ਸਮੂਹ ਅਤੇ ਵੱਖਰੇ ਅਹੁਦੇ ਵੱਖਰੇ ਨਤੀਜੇ ਦਿੰਦੇ ਹਨ। ਵੰਡ ਵਿੱਚ ਇੱਕੋ ਜਿਹੀਆਂ ਵਸਤੂਆਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਗਿਣੋ ਅਤੇ ਦਿੱਤੀਆਂ ਹੱਦਾਂ ਲਾਗੂ ਕਰੋ।'],
 permutation:['अलग वस्तुओं के स्थान या अलग पद महत्व रखते हैं। बिना दोहराव में प्रत्येक अगले स्थान पर एक विकल्प कम होता है; सभी स्थान भरने पर क्रमगुणित मिलता है।','ਵੱਖਰੀਆਂ ਵਸਤੂਆਂ ਦੇ ਸਥਾਨ ਜਾਂ ਵੱਖਰੇ ਅਹੁਦੇ ਮਹੱਤਵ ਰੱਖਦੇ ਹਨ। ਬਿਨਾਂ ਦੁਹਰਾਓ ਵਿੱਚ ਹਰ ਅਗਲੇ ਸਥਾਨ ਉੱਤੇ ਇੱਕ ਚੋਣ ਘੱਟ ਹੁੰਦੀ ਹੈ; ਸਾਰੇ ਸਥਾਨ ਭਰਨ ਉੱਤੇ ਫੈਕਟੋਰੀਅਲ ਮਿਲਦਾ ਹੈ।'],
 cases:['दी गई शर्तों के पूर्णांक मान जाँचें। अलग स्थितियों की गणनाएँ जोड़ें और साथ होने वाले स्वतंत्र चरणों की संख्याएँ गुणा करें।','ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਦੇ ਪੂਰਨ ਅੰਕ ਮੁੱਲ ਜਾਂਚੋ। ਵੱਖਰੀਆਂ ਸਥਿਤੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਜੋੜੋ ਅਤੇ ਇਕੱਠੇ ਹੋਣ ਵਾਲੇ ਸੁਤੰਤਰ ਪੜਾਵਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਗੁਣਾ ਕਰੋ।']};
 const reasoning=principles[family][index];

 const proof=conceptual[q.id]?.[index];const math=mathematics(q.explanation);
 return {...q,id:`${q.id}:${language}`,language,stem,answer,options:q.options.map(o=>options[o]?.[index]??o),explanation:[proof??reasoning,`${l.calculate}:\n${math.length?math.join('\n'):answer}`,`${l.answer}: ${answer}.`]};
}
