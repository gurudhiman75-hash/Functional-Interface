export type NativeLanguage='hi'|'pa';
export const normalizeNativeLanguage=(value?:string):'en'|NativeLanguage=>{const l=(value??'en').trim().toLowerCase().replace(/-in$/,'');if(l!=='en'&&l!=='hi'&&l!=='pa')throw new Error(`Unsupported Statistics language: ${l}`);return l;};
export const copy=(l:NativeLanguage)=>(hi:string,pa:string)=>l==='hi'?hi:pa;
export const fmt=(n:number,d=2)=>String(Math.round((n+Number.EPSILON)*10**d)/10**d);
const terms:Record<string,readonly[string,string]>={
'Independent':['स्वतंत्र','ਸੁਤੰਤਰ'],'Not independent':['स्वतंत्र नहीं','ਸੁਤੰਤਰ ਨਹੀਂ'],'Dependent':['परतंत्र','ਪਰਤੰਤਰ'],'Mutually exclusive':['परस्पर अपवर्जी','ਪਰਸਪਰ ਅਪਵਰਜੀ'],'Cannot be determined':['निर्धारित नहीं किया जा सकता','ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ'],
'X and Y are mutually exclusive':['X और Y परस्पर अपवर्जी हैं','X ਅਤੇ Y ਪਰਸਪਰ ਅਪਵਰਜੀ ਹਨ'],
'Positive association':['धनात्मक संबंध','ਧਨਾਤਮਕ ਸੰਬੰਧ'],'Negative association':['ऋणात्मक संबंध','ਰਿਣਾਤਮਕ ਸੰਬੰਧ'],'No linear association':['कोई रैखिक संबंध नहीं','ਕੋਈ ਰੇਖੀ ਸੰਬੰਧ ਨਹੀਂ'],'Perfect association':['पूर्ण संबंध','ਪੂਰਨ ਸੰਬੰਧ'],
'Perfect positive correlation':['पूर्ण धनात्मक सहसंबंध','ਪੂਰਨ ਧਨਾਤਮਕ ਸਹਿਸੰਬੰਧ'],'Perfect negative correlation':['पूर्ण ऋणात्मक सहसंबंध','ਪੂਰਨ ਰਿਣਾਤਮਕ ਸਹਿਸੰਬੰਧ'],'Zero linear correlation':['शून्य रैखिक सहसंबंध','ਸਿਫ਼ਰ ਰੇਖੀ ਸਹਿਸੰਬੰਧ'],'Positive linear correlation':['धनात्मक रैखिक सहसंबंध','ਧਨਾਤਮਕ ਰੇਖੀ ਸਹਿਸੰਬੰਧ'],'Negative linear correlation':['ऋणात्मक रैखिक सहसंबंध','ਰਿਣਾਤਮਕ ਰੇਖੀ ਸਹਿਸੰਬੰਧ'],
};
export function nativeOption(value:string,l:NativeLanguage):string{if(terms[value])return terms[value]![l==='hi'?0:1];if(Number.isFinite(Number(value))||/^Ŷ = β/.test(value))return value;throw new Error(`Unauthored Statistics option: ${value}`);}
export function finishNative<Q extends {packageId:string;questionId:string;qlId:string;contractId:string;options:readonly string[];correctIndex:number;answer:string}>(q:Q,l:NativeLanguage,stem:string,explanation:string,option=(s:string)=>nativeOption(s,l)){
 const answer=option(q.answer),options=q.options.map(option);
 if(options.length!==4||new Set(options).size!==4||options[q.correctIndex]!==answer)throw new Error('Invalid native choices');
 return {...q,language:l,stem,text:stem,explanation,answer,options,sourceQuestionId:q.questionId,sourceAnswer:q.answer,sourceOptions:[...q.options],questionId:`${q.questionId}:${l}:native-v1`,canonicalAnswer:{kind:'symbolic' as const,value:answer,display:answer,rendered:answer,rounding:'source' as const},runtimeMode:`${q.packageId.replace('-','')}_NATIVE_REVIEW_V1`,reviewStatus:'NATIVE_REVIEW_CANDIDATE',manualApprovalRequired:true};
}
export function assertSource(q:{packageId:string;qlId:string;contractId:string;answer:string;options:readonly string[];correctIndex:number},pkg:string,owner:{contractId:string}|undefined,solved:number|string,d=2){if(q.packageId!==pkg||owner?.contractId!==q.contractId||q.options.length!==4||new Set(q.options).size!==4||q.options[q.correctIndex]!==q.answer||(typeof solved==='number'?fmt(solved,d):solved)!==q.answer)throw new Error(`Invalid ${pkg} native source`);}
