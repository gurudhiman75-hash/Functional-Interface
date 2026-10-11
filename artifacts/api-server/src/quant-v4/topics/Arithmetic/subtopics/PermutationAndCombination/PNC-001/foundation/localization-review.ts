import library from '../question-language.native-review.json';
import {renderPnc001Template} from './library';
import type {Pnc001QuestionPackage} from './types';
const principles:Record<string,[string,string]>={
 PRODUCT:['हर चरण का एक विकल्प चुनना है, इसलिए स्वतंत्र विकल्पों की संख्याएँ गुणा करें।','ਹਰ ਪੜਾਅ ਵਿੱਚੋਂ ਇੱਕ ਚੋਣ ਕਰਨੀ ਹੈ, ਇਸ ਲਈ ਸੁਤੰਤਰ ਚੋਣਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਗੁਣਾ ਕਰੋ।'],
 SUM:['अलग-अलग विकल्पों में से केवल एक चुना जाता है, इसलिए उनकी संख्याएँ जोड़ें।','ਵੱਖਰੀਆਂ ਚੋਣਾਂ ਵਿੱਚੋਂ ਸਿਰਫ਼ ਇੱਕ ਚੁਣੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਜੋੜੋ।'],
 SUM_OF_PRODUCTS:['हर स्थिति के भीतर गुणा करें, फिर अलग स्थितियों की गणनाएँ जोड़ें।','ਹਰ ਸਥਿਤੀ ਦੇ ਅੰਦਰ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਵੱਖਰੀਆਂ ਸਥਿਤੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਜੋੜੋ।'],
 COMPLEMENT:['पहले सभी जोड़े गिनें, फिर अनुपलब्ध जोड़े घटाएँ।','ਪਹਿਲਾਂ ਸਾਰੇ ਜੋੜੇ ਗਿਣੋ, ਫਿਰ ਅਣਉਪਲਬਧ ਜੋੜੇ ਘਟਾਓ।'],
 EXACT_DIVISION:['कुल जोड़ों को ज्ञात श्रेणी के विकल्पों से भाग दें।','ਕੁੱਲ ਜੋੜਿਆਂ ਨੂੰ ਜਾਣੀ ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਚੋਣਾਂ ਨਾਲ ਭਾਗ ਦਿਓ।'],
 DICTIONARY_RANK:['हर स्थान पर छोटे अक्षर रखने से बनने वाले क्रम गिनें। पहले आने वाले सभी क्रम जोड़कर लक्ष्य शब्द के लिए एक जोड़ें।','ਹਰ ਸਥਾਨ ਉੱਤੇ ਛੋਟਾ ਅੱਖਰ ਰੱਖਣ ਨਾਲ ਬਣਦੇ ਕ੍ਰਮ ਗਿਣੋ। ਪਹਿਲਾਂ ਆਉਣ ਵਾਲੇ ਸਾਰੇ ਕ੍ਰਮ ਜੋੜ ਕੇ ਟੀਚੇ ਦੇ ਸ਼ਬਦ ਲਈ ਇੱਕ ਜੋੜੋ।'],
 MULTISET_DIRECT:['सभी क्रमों की संख्या को प्रत्येक दोहराए प्रकार के क्रमगुणित से भाग दें।','ਸਾਰੇ ਕ੍ਰਮਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਹਰ ਦੁਹਰਾਈ ਕਿਸਮ ਦੇ ਫੈਕਟੋਰੀਅਲ ਨਾਲ ਭਾਗ ਦਿਓ।'],
 MULTISET_FIXED:['निश्चित अक्षर पहले रखें। शेष अक्षरों के क्रम गिनकर उनकी पुनरावृत्तियों का सुधार करें।','ਨਿਸ਼ਚਿਤ ਅੱਖਰ ਪਹਿਲਾਂ ਰੱਖੋ। ਬਾਕੀ ਅੱਖਰਾਂ ਦੇ ਕ੍ਰਮ ਗਿਣ ਕੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਦੁਹਰਾਈਆਂ ਦਾ ਸੁਧਾਰ ਕਰੋ।'],
 MULTISET_OVERCOUNT:['समान वस्तुओं के आपसी क्रम अलग परिणाम नहीं देते। अधिक-गणना का गुणक उनकी बहुलताओं के क्रमगुणित का गुणनफल है।','ਇੱਕੋ ਜਿਹੀਆਂ ਵਸਤੂਆਂ ਦੇ ਆਪਸੀ ਕ੍ਰਮ ਵੱਖਰੇ ਨਤੀਜੇ ਨਹੀਂ ਦਿੰਦੇ। ਵੱਧ ਗਿਣਨ ਦਾ ਗੁਣਕ ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦੇ ਫੈਕਟੋਰੀਅਲਾਂ ਦਾ ਗੁਣਨਫਲ ਹੈ।'],
 MIXED_SELECT_ASSIGN:['पहले बिना क्रम के समूह चुनें, फिर चुने सदस्यों को अलग पद दें।','ਪਹਿਲਾਂ ਬਿਨਾਂ ਕ੍ਰਮ ਦੇ ਸਮੂਹ ਚੁਣੋ, ਫਿਰ ਚੁਣੇ ਮੈਂਬਰਾਂ ਨੂੰ ਵੱਖਰੇ ਅਹੁਦੇ ਦਿਓ।'],
 MIXED_SELECT_ARRANGE_ALL:['पहले समूह चुनें, फिर सभी चुनी वस्तुओं को क्रम में रखें।','ਪਹਿਲਾਂ ਸਮੂਹ ਚੁਣੋ, ਫਿਰ ਸਾਰੀਆਂ ਚੁਣੀਆਂ ਵਸਤੂਆਂ ਨੂੰ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ।'],
 MIXED_ROLE_MULTIPLIER:['अलग पद अलग सदस्यों को दिए जाते हैं, इसलिए क्रमचय पद देने का गुणक बताता है।','ਵੱਖਰੇ ਅਹੁਦੇ ਵੱਖਰੇ ਮੈਂਬਰਾਂ ਨੂੰ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਕ੍ਰਮਚਯ ਅਹੁਦੇ ਦੇਣ ਦਾ ਗੁਣਕ ਦੱਸਦਾ ਹੈ।'],
};
function principle(operation:string,hi:boolean):string {
 const direct=principles[operation];if(direct)return direct[hi?0:1];
 if(operation.includes('INVERSE'))return hi?'दिए गए सूत्र में अनुमत पूर्णांक मान जाँचें और लक्ष्य के बराबर गणना देने वाला मान चुनें।':'ਦਿੱਤੇ ਸੂਤਰ ਵਿੱਚ ਮਨਜ਼ੂਰ ਪੂਰਨ ਅੰਕ ਜਾਂਚੋ ਅਤੇ ਟੀਚੇ ਦੇ ਬਰਾਬਰ ਗਿਣਤੀ ਦੇਣ ਵਾਲਾ ਮੁੱਲ ਚੁਣੋ।';
 if(operation==='COMBINATION_SYMMETRY')return hi?'संयोजन में पूरक चयन बराबर होते हैं: C(n,r)=C(n,n−r)। दी गई सीमा से सही मान चुनें।':'ਸੰਯੋਜਨ ਵਿੱਚ ਪੂਰਕ ਚੋਣਾਂ ਬਰਾਬਰ ਹੁੰਦੀਆਂ ਹਨ: C(n,r)=C(n,n−r)। ਦਿੱਤੀ ਹੱਦ ਨਾਲ ਸਹੀ ਮੁੱਲ ਚੁਣੋ।';
 if(operation.startsWith('COMBINATION'))return hi?'चयन का क्रम महत्व नहीं रखता। क्रमचय को चुनी वस्तुओं के क्रमगुणित से भाग दें।':'ਚੋਣ ਦਾ ਕ੍ਰਮ ਮਹੱਤਵ ਨਹੀਂ ਰੱਖਦਾ। ਕ੍ਰਮਚਯ ਨੂੰ ਚੁਣੀਆਂ ਵਸਤੂਆਂ ਦੇ ਫੈਕਟੋਰੀਅਲ ਨਾਲ ਭਾਗ ਦਿਓ।';
 if(operation.startsWith('PERMUTATION'))return hi?'क्रम महत्व रखता है। हर अगले स्थान पर बची अलग वस्तुओं की संख्या से गुणा करें।':'ਕ੍ਰਮ ਮਹੱਤਵ ਰੱਖਦਾ ਹੈ। ਹਰ ਅਗਲੇ ਸਥਾਨ ਉੱਤੇ ਬਚੀਆਂ ਵੱਖਰੀਆਂ ਵਸਤੂਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ।';
 if(operation.startsWith('FACTORIAL'))return hi?'क्रमगुणित n!=n(n−1)⋯1 का प्रयोग करें; 0!=1 है। भाग में समान गुणक काटें।':'ਫੈਕਟੋਰੀਅਲ n!=n(n−1)⋯1 ਵਰਤੋ; 0!=1 ਹੈ। ਭਾਗ ਵਿੱਚ ਸਾਂਝੇ ਗੁਣਕ ਕੱਟੋ।';
 if(operation==='MULTISET_INVERSE')return hi?'कुल वस्तुओं के क्रमगुणित को लक्ष्य से भाग देने पर समान वस्तुओं की संख्या का क्रमगुणित मिलता है। अनुमत बहुलता खोजें।':'ਕੁੱਲ ਵਸਤੂਆਂ ਦੇ ਫੈਕਟੋਰੀਅਲ ਨੂੰ ਟੀਚੇ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਇੱਕੋ ਜਿਹੀਆਂ ਵਸਤੂਆਂ ਦੀ ਗਿਣਤੀ ਦਾ ਫੈਕਟੋਰੀਅਲ ਮਿਲਦਾ ਹੈ। ਮਨਜ਼ੂਰ ਗਿਣਤੀ ਲੱਭੋ।';
 if(operation==='MIXED_INVERSE')return hi?'समूह-चयन और पद-निर्धारण की संयुक्त गणना में दी गई सीमा के मान जाँचें।':'ਸਮੂਹ ਚੋਣ ਅਤੇ ਅਹੁਦਾ ਵੰਡ ਦੀ ਸਾਂਝੀ ਗਿਣਤੀ ਵਿੱਚ ਦਿੱਤੀ ਹੱਦ ਦੇ ਮੁੱਲ ਜਾਂਚੋ।';
 if(operation==='CODE_EXACTLY_ONE_PAIR')return hi?'दोहराया चिह्न चुनें, दो अन्य अलग चिह्न चुनें और चार स्थानों में दो समान चिह्नों का सुधार करके क्रम गिनें।':'ਦੁਹਰਾਇਆ ਚਿੰਨ੍ਹ ਚੁਣੋ, ਦੋ ਹੋਰ ਵੱਖਰੇ ਚਿੰਨ੍ਹ ਚੁਣੋ ਅਤੇ ਚਾਰ ਸਥਾਨਾਂ ਵਿੱਚ ਦੋ ਇੱਕੋ ਜਿਹੇ ਚਿੰਨ੍ਹਾਂ ਦਾ ਸੁਧਾਰ ਕਰਕੇ ਕ੍ਰਮ ਗਿਣੋ।';
 if(operation==='ALPHANUMERIC_CODE'||operation==='CODE_REPETITION')return hi?'दोहराव मान्य है, इसलिए हर स्थान के स्वतंत्र विकल्पों की संख्या से गुणा करें। कोड की शुरुआत में शून्य मान्य है।':'ਦੁਹਰਾਓ ਮਨਜ਼ੂਰ ਹੈ, ਇਸ ਲਈ ਹਰ ਸਥਾਨ ਦੀਆਂ ਸੁਤੰਤਰ ਚੋਣਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਕੋਡ ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ ਸਿਫ਼ਰ ਮਨਜ਼ੂਰ ਹੈ।';
 return hi?'पहला अंक शून्य नहीं हो सकता। अंतिम अंक और अन्य दी गई शर्तों के अनुसार अलग स्थितियाँ गिनें; बिना दोहराव में पहले इस्तेमाल हुए अंक हटाएँ।':'ਪਹਿਲਾ ਅੰਕ ਸਿਫ਼ਰ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਆਖ਼ਰੀ ਅੰਕ ਅਤੇ ਹੋਰ ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਮੁਤਾਬਕ ਵੱਖਰੀਆਂ ਸਥਿਤੀਆਂ ਗਿਣੋ; ਬਿਨਾਂ ਦੁਹਰਾਓ ਵਿੱਚ ਪਹਿਲਾਂ ਵਰਤੇ ਅੰਕ ਹਟਾਓ।';
}
export function buildPnc001NativeReview(q:Pnc001QuestionPackage,language:'hi'|'pa') {
 const hi=language==='hi',template=library[language][q.questionLanguageId as keyof typeof library.hi];if(!template)throw Error('Missing PNC native template');
 const lines=[principle(q.solver.evidence.operation,hi)];
 const contributions=q.solver.evidence.dictionaryRankContributions;
 if(contributions)for(const c of contributions)lines.push(hi?`स्थान ${c.position}: ${c.currentLetter} से पहले ${c.smallerLetter} रखने पर ${c.remainingArrangementCount} क्रम।`:`ਸਥਾਨ ${c.position}: ${c.currentLetter} ਤੋਂ ਪਹਿਲਾਂ ${c.smallerLetter} ਰੱਖਣ ਉੱਤੇ ${c.remainingArrangementCount} ਕ੍ਰਮ।`);
 // Reuse evaluated mathematical authority; never translate or recompute the answer.
 lines.push(q.solver.mathJax,hi?`अतः उत्तर ${q.answer} है।`:`ਇਸ ਲਈ ਉੱਤਰ ${q.answer} ਹੈ।`);
 return {stem:renderPnc001Template(template,q.parameters.renderVariables),displayOptions:[...q.options],correctIndex:q.correctIndex,explanation:lines.join('\n\n'),nativeApprovalRecorded:false,reviewStatus:'AUTHORED_REVIEW_CANDIDATE'};
}
