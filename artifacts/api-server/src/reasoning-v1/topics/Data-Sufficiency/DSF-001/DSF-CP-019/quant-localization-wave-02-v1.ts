export type DsfCp019Wave02Language = "hi" | "pa";
type AnyQuestion = Readonly<Record<string, any>>;

const OPTIONS = {
  hi: {
    STATEMENT_I_ONLY: "केवल कथन I पर्याप्त है।",
    STATEMENT_II_ONLY: "केवल कथन II पर्याप्त है।",
    EACH_STATEMENT_ALONE: "कथन I और कथन II, प्रत्येक अकेले पर्याप्त है।",
    BOTH_TOGETHER_ONLY: "दोनों कथन साथ में पर्याप्त हैं, लेकिन कोई भी कथन अकेले पर्याप्त नहीं है।",
    INSUFFICIENT_EVEN_TOGETHER: "दोनों कथन साथ लेने पर भी पर्याप्त नहीं हैं।",
  },
  pa: {
    STATEMENT_I_ONLY: "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ।",
    STATEMENT_II_ONLY: "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।",
    EACH_STATEMENT_ALONE: "ਕਥਨ I ਅਤੇ ਕਥਨ II, ਹਰ ਇੱਕ ਆਪਣੇ ਆਪ ਵਿੱਚ ਕਾਫ਼ੀ ਹੈ।",
    BOTH_TOGETHER_ONLY: "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    INSUFFICIENT_EVEN_TOGETHER: "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ 'ਤੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।",
  },
} as const;

function tx(l:DsfCp019Wave02Language,hi:string,pa:string){return l==="hi"?hi:pa;}
function nums(text:string){return [...text.matchAll(/-?\d+(?:\.\d+)?(?:\/\d+)?/g)].map(m=>m[0]!);}
function gt(text:string){return /more than|greater than|at least/i.test(text);}
function atMost(text:string){return /at most|does not exceed/i.test(text);}
function even(text:string){return /\beven\b/i.test(text);}

function options(q:AnyQuestion,l:DsfCp019Wave02Language){
  return Object.freeze((q.options??[]).map((o:any)=>{
    const cls=String(o.semanticClass??"") as keyof typeof OPTIONS.hi;
    const value=OPTIONS[l][cls];
    if(!value) throw new Error(`Unsupported DS option ${String(o.semanticClass)}`);
    return Object.freeze({...o,value});
  }));
}

function explanation(q:AnyQuestion,l:DsfCp019Wave02Language,target:string){
  const cls=String(q.canonicalAnswer??"");
  const s1=cls==="STATEMENT_I_ONLY"||cls==="EACH_STATEMENT_ALONE";
  const s2=cls==="STATEMENT_II_ONLY"||cls==="EACH_STATEMENT_ALONE";
  const together=cls!=="INSUFFICIENT_EVEN_TOGETHER";
  const line=(label:string,sufficient:boolean,combined=false)=>{
    if(combined){
      return sufficient
        ? tx(l,`${label} ${target} का एक निश्चित मान मिलता है।`,`${label} ${target} ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਮਿਲਦਾ ਹੈ।`)
        : tx(l,`${label} भी ${target} का एक निश्चित मान नहीं मिलता।`,`${label} ਵੀ ${target} ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਨਹੀਂ ਮਿਲਦਾ।`);
    }
    return sufficient
      ? tx(l,`${label} से ${target} का एक निश्चित मान मिलता है, इसलिए यह अकेला पर्याप्त है।`,`${label} ਨਾਲ ${target} ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`)
      : tx(l,`${label} से ${target} का एक निश्चित मान नहीं मिलता, इसलिए यह अकेला पर्याप्त नहीं है।`,`${label} ਨਾਲ ${target} ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਨਹੀਂ ਮਿਲਦਾ, ਇਸ ਲਈ ਇਹ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`);
  };
  return [
    tx(l,`हमें ${target} निर्धारित करना है।`,`ਸਾਨੂੰ ${target} ਨਿਰਧਾਰਤ ਕਰਨਾ ਹੈ।`),
    line(tx(l,"कथन I","ਕਥਨ I"),s1),
    line(tx(l,"कथन II","ਕਥਨ II"),s2),
    line(tx(l,"दोनों कथन साथ लेने पर","ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ 'ਤੇ"),together,true),
    tx(l,`अतः सही विकल्प: ${OPTIONS.hi[cls as keyof typeof OPTIONS.hi]??cls}`,`ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ: ${OPTIONS.pa[cls as keyof typeof OPTIONS.pa]??cls}`),
  ].join(" ");
}

function tmwSurface(q:AnyQuestion,l:DsfCp019Wave02Language){
  const k=String(q.targetKind);
  if(k==="PIPE_FILL_TIME") return {lead:tx(l,"दो पाइप एक टंकी से जुड़े हैं।","ਦੋ ਪਾਈਪ ਇੱਕ ਟੈਂਕੀ ਨਾਲ ਜੁੜੇ ਹਨ।"),prompt:tx(l,"दोनों पाइप एक साथ खोलने पर टंकी कितने समय में भरेगी?","ਦੋਵੇਂ ਪਾਈਪ ਇਕੱਠੇ ਖੋਲ੍ਹਣ 'ਤੇ ਟੈਂਕੀ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਭਰੇਗੀ?"),target:tx(l,"टंकी भरने का समय","ਟੈਂਕੀ ਭਰਨ ਦਾ ਸਮਾਂ")};
  if(k==="COMPLETION_TIME") return {lead:tx(l,"एक मजदूर समान दर से एक काम करता है।","ਇੱਕ ਮਜ਼ਦੂਰ ਇੱਕੋ ਦਰ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ।"),prompt:tx(l,"पूरा काम करने में कितने दिन लगेंगे?","ਪੂਰਾ ਕੰਮ ਕਰਨ ਵਿੱਚ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ?"),target:tx(l,"काम पूरा करने का समय","ਕੰਮ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ")};
  if(k==="WORK_RATE") return {lead:tx(l,"एक मजदूर समान दर से एक काम करता है।","ਇੱਕ ਮਜ਼ਦੂਰ ਇੱਕੋ ਦਰ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ।"),prompt:tx(l,"एक दिन में पूरे काम का कितना भाग पूरा होता है?","ਇੱਕ ਦਿਨ ਵਿੱਚ ਪੂਰੇ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੁੰਦਾ ਹੈ?"),target:tx(l,"प्रतिदिन काम की दर","ਪ੍ਰਤੀ ਦਿਨ ਕੰਮ ਦੀ ਦਰ")};
  return {lead:tx(l,"एक मजदूर समान दर से एक काम करता है।","ਇੱਕ ਮਜ਼ਦੂਰ ਇੱਕੋ ਦਰ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ।"),prompt:tx(l,"दी गई अवधि में पूरे काम का कितना भाग पूरा होता है?","ਦਿੱਤੀ ਮਿਆਦ ਵਿੱਚ ਪੂਰੇ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੁੰਦਾ ਹੈ?"),target:tx(l,"पूरा किया गया काम","ਪੂਰਾ ਕੀਤਾ ਕੰਮ")};
}
function tmwStatement(s:any,l:DsfCp019Wave02Language){
  const f=String(s.statementFamily),n=nums(String(s.text)),text=String(s.text),outlet=/outlet|empty/i.test(text);
  switch(f){
    case "COMPLETION_TIME_EXACT": return tx(l,`इसी दर से पूरा काम ${n[0]} दिनों में होता है।`,`ਇਸੇ ਦਰ ਨਾਲ ਪੂਰਾ ਕੰਮ ${n[0]} ਦਿਨਾਂ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।`);
    case "RATE_EXACT": return tx(l,`मजदूर एक दिन में काम का ${n[0]} भाग पूरा करता है।`,`ਮਜ਼ਦੂਰ ਇੱਕ ਦਿਨ ਵਿੱਚ ਕੰਮ ਦਾ ${n[0]} ਹਿੱਸਾ ਪੂਰਾ ਕਰਦਾ ਹੈ।`);
    case "OBSERVATION_TIME_EXACT": return tx(l,`काम को ${n[0]} दिनों तक देखा गया।`,`ਕੰਮ ਨੂੰ ${n[0]} ਦਿਨਾਂ ਤੱਕ ਦੇਖਿਆ ਗਿਆ।`);
    case "FRACTION_EXACT": return tx(l,`देखी गई अवधि में काम का ${n[0]} भाग पूरा हुआ।`,`ਦੇਖੀ ਗਈ ਮਿਆਦ ਵਿੱਚ ਕੰਮ ਦਾ ${n[0]} ਹਿੱਸਾ ਪੂਰਾ ਹੋਇਆ।`);
    case "TIME_OBSERVATION_PAIR": return tx(l,`पूरा काम ${n[0]} दिनों में होता है और देखी गई अवधि ${n[1]} दिन है।`,`ਪੂਰਾ ਕੰਮ ${n[0]} ਦਿਨਾਂ ਵਿੱਚ ਹੁੰਦਾ ਹੈ ਅਤੇ ਦੇਖੀ ਗਈ ਮਿਆਦ ${n[1]} ਦਿਨ ਹੈ।`);
    case "RATE_OBSERVATION_PAIR": return tx(l,`प्रतिदिन काम की दर ${n[0]} है और देखी गई अवधि ${n[1]} दिन है।`,`ਪ੍ਰਤੀ ਦਿਨ ਕੰਮ ਦੀ ਦਰ ${n[0]} ਹੈ ਅਤੇ ਦੇਖੀ ਗਈ ਮਿਆਦ ${n[1]} ਦਿਨ ਹੈ।`);
    case "WORK_PARAMETER_TRIPLE": return tx(l,`पूरा काम ${n[0]} दिनों में होता है, प्रतिदिन दर ${n[1]} है और देखी गई अवधि ${n[2]} दिन है।`,`ਪੂਰਾ ਕੰਮ ${n[0]} ਦਿਨਾਂ ਵਿੱਚ ਹੁੰਦਾ ਹੈ, ਪ੍ਰਤੀ ਦਿਨ ਦਰ ${n[1]} ਹੈ ਅਤੇ ਦੇਖੀ ਗਈ ਮਿਆਦ ${n[2]} ਦਿਨ ਹੈ।`);
    case "COMPLETION_TIME_BOUND": return tx(l,`पूरा काम ${n[0]} दिनों से ${gt(text)?"अधिक":"कम"} समय लेता है।`,`ਪੂਰਾ ਕੰਮ ${n[0]} ਦਿਨਾਂ ਤੋਂ ${gt(text)?"ਵੱਧ":"ਘੱਟ"} ਸਮਾਂ ਲੈਂਦਾ ਹੈ।`);
    case "OBSERVATION_TIME_BOUND": return tx(l,`देखी गई अवधि ${n[0]} दिनों से ${gt(text)?"अधिक":"कम"} है।`,`ਦੇਖੀ ਗਈ ਮਿਆਦ ${n[0]} ਦਿਨਾਂ ਤੋਂ ${gt(text)?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
    case "PIPE_A_TIME_EXACT": return tx(l,`इनलेट A अकेला टंकी को ${n[0]} घंटे में भरता है।`,`ਇਨਲੈਟ A ਇਕੱਲਾ ਟੈਂਕੀ ਨੂੰ ${n[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ।`);
    case "PIPE_B_TIME_EXACT": return outlet?tx(l,`पाइप B एक आउटलेट है और अकेला टंकी को ${n[0]} घंटे में खाली करता है।`,`ਪਾਈਪ B ਇੱਕ ਆਉਟਲੈਟ ਹੈ ਅਤੇ ਇਕੱਲਾ ਟੈਂਕੀ ਨੂੰ ${n[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ।`):tx(l,`पाइप B एक इनलेट है और अकेला टंकी को ${n[0]} घंटे में भरता है।`,`ਪਾਈਪ B ਇੱਕ ਇਨਲੈਟ ਹੈ ਅਤੇ ਇਕੱਲਾ ਟੈਂਕੀ ਨੂੰ ${n[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ।`);
    case "PIPE_FILL_TIME_EXACT": return tx(l,`दोनों पाइप खुले होने पर टंकी ${n[0]} घंटे में भरती है।`,`ਦੋਵੇਂ ਪਾਈਪ ਖੁੱਲ੍ਹੇ ਹੋਣ 'ਤੇ ਟੈਂਕੀ ${n[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੀ ਹੈ।`);
    case "PIPE_PAIR": return outlet?tx(l,`इनलेट A टंकी को ${n[0]} घंटे में भरता है और पाइप B ${n[1]} घंटे में खाली करता है।`,`ਇਨਲੈਟ A ਟੈਂਕੀ ਨੂੰ ${n[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ ਅਤੇ ਪਾਈਪ B ${n[1]} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ।`):tx(l,`इनलेट A टंकी को ${n[0]} घंटे में और पाइप B ${n[1]} घंटे में भरता है।`,`ਇਨਲੈਟ A ਟੈਂਕੀ ਨੂੰ ${n[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਅਤੇ ਪਾਈਪ B ${n[1]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ।`);
    case "PIPE_A_BOUND": return tx(l,`इनलेट A को टंकी भरने में ${n[0]} घंटे से ${gt(text)?"अधिक":"कम"} लगते हैं।`,`ਇਨਲੈਟ A ਨੂੰ ਟੈਂਕੀ ਭਰਨ ਵਿੱਚ ${n[0]} ਘੰਟਿਆਂ ਤੋਂ ${gt(text)?"ਵੱਧ":"ਘੱਟ"} ਲੱਗਦੇ ਹਨ।`);
    case "PIPE_B_BOUND": return tx(l,`पाइप B को अकेले टंकी ${outlet?"खाली":"भरने"} में ${n[0]} घंटे से ${gt(text)?"अधिक":"कम"} लगते हैं।`,`ਪਾਈਪ B ਨੂੰ ਇਕੱਲੇ ਟੈਂਕੀ ${outlet?"ਖਾਲੀ ਕਰਨ":"ਭਰਨ"} ਵਿੱਚ ${n[0]} ਘੰਟਿਆਂ ਤੋਂ ${gt(text)?"ਵੱਧ":"ਘੱਟ"} ਲੱਗਦੇ ਹਨ।`);
  }
  throw new Error(`TMW unsupported family ${f}`);
}

function tsdSurface(q:AnyQuestion,l:DsfCp019Wave02Language){
  const mode=String(q.solveModeId??q.solveMode);
  if(mode==="DSF-SM-TSD-DISTANCE") return {lead:tx(l,"एक समान गति की यात्रा दी गई है।","ਇੱਕ ਸਮਾਨ ਗਤੀ ਵਾਲੀ ਯਾਤਰਾ ਦਿੱਤੀ ਗਈ ਹੈ।"),prompt:tx(l,"कितनी दूरी तय की गई?","ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕੀਤੀ ਗਈ?"),target:tx(l,"दूरी","ਦੂਰੀ")};
  if(mode==="DSF-SM-TSD-SPEED") return {lead:tx(l,"एक समान गति की यात्रा दी गई है।","ਇੱਕ ਸਮਾਨ ਗਤੀ ਵਾਲੀ ਯਾਤਰਾ ਦਿੱਤੀ ਗਈ ਹੈ।"),prompt:tx(l,"गति कितनी है?","ਗਤੀ ਕਿੰਨੀ ਹੈ?"),target:tx(l,"गति","ਗਤੀ")};
  if(mode==="DSF-SM-TSD-TIME") return {lead:tx(l,"एक समान गति की यात्रा दी गई है।","ਇੱਕ ਸਮਾਨ ਗਤੀ ਵਾਲੀ ਯਾਤਰਾ ਦਿੱਤੀ ਗਈ ਹੈ।"),prompt:tx(l,"यात्रा में कितना समय लगता है?","ਯਾਤਰਾ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ?"),target:tx(l,"यात्रा का समय","ਯਾਤਰਾ ਦਾ ਸਮਾਂ")};
  if(mode==="DSF-SM-TRAIN-FIXED-CLEAR-TIME") return {lead:tx(l,"एक ट्रेन किसी स्थिर वस्तु को पूरी तरह पार करती है।","ਇੱਕ ਰੇਲਗੱਡੀ ਕਿਸੇ ਅਸਥਿਰ ਵਸਤੂ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਦੀ ਹੈ।"),prompt:tx(l,"ट्रेन को वस्तु पूरी तरह पार करने में कितना समय लगेगा?","ਰੇਲਗੱਡੀ ਨੂੰ ਵਸਤੂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?"),target:tx(l,"पार करने का समय","ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ")};
  if(mode==="DSF-SM-TRAIN-TWO-CROSS-TIME") return {lead:tx(l,"दो ट्रेनें विपरीत दिशाओं में चल रही हैं।","ਦੋ ਰੇਲਗੱਡੀਆਂ ਵਿਰੋਧੀ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਚੱਲ ਰਹੀਆਂ ਹਨ।"),prompt:tx(l,"दोनों ट्रेनें एक-दूसरे को पूरी तरह कितने समय में पार करेंगी?","ਦੋਵੇਂ ਰੇਲਗੱਡੀਆਂ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪਾਰ ਕਰਨਗੀਆਂ?"),target:tx(l,"दो ट्रेनों का पार करने का समय","ਦੋ ਰੇਲਗੱਡੀਆਂ ਦਾ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ")};
  const upstream=mode==="DSF-SM-BOAT-UPSTREAM-TIME";
  return {lead:tx(l,"नाव और धारा की गति दी गई है।","ਕਿਸ਼ਤੀ ਅਤੇ ਧਾਰਾ ਦੀ ਗਤੀ ਦਿੱਤੀ ਗਈ ਹੈ।"),prompt:upstream?tx(l,"धारा के विरुद्ध यात्रा में कितना समय लगता है?","ਧਾਰਾ ਦੇ ਵਿਰੁੱਧ ਯਾਤਰਾ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ?"):tx(l,"धारा के साथ यात्रा में कितना समय लगता है?","ਧਾਰਾ ਦੇ ਨਾਲ ਯਾਤਰਾ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ?"),target:upstream?tx(l,"धारा के विरुद्ध यात्रा का समय","ਧਾਰਾ ਦੇ ਵਿਰੁੱਧ ਯਾਤਰਾ ਦਾ ਸਮਾਂ"):tx(l,"धारा के साथ यात्रा का समय","ਧਾਰਾ ਦੇ ਨਾਲ ਯਾਤਰਾ ਦਾ ਸਮਾਂ")};
}
function tsdStatement(s:any,l:DsfCp019Wave02Language){
  const f=String(s.statementFamily),n=nums(String(s.text)),text=String(s.text);
  const upstream=/upstream/i.test(text),downstream=/downstream/i.test(text),dir=upstream?tx(l,"धारा के विरुद्ध","ਧਾਰਾ ਦੇ ਵਿਰੁੱਧ"):downstream?tx(l,"धारा के साथ","ਧਾਰਾ ਦੇ ਨਾਲ"):"";
  switch(f){
    case "DISTANCE_EXACT": return tx(l,`तय दूरी ${n[0]} मीटर है।`,`ਤੈਅ ਦੂਰੀ ${n[0]} ਮੀਟਰ ਹੈ।`);
    case "SPEED_EXACT": return tx(l,`गति ${n[0]} मीटर प्रति सेकंड है।`,`ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "TIME_EXACT": return tx(l,`यात्रा का समय ${n[0]} सेकंड है।`,`ਯਾਤਰਾ ਦਾ ਸਮਾਂ ${n[0]} ਸਕਿੰਟ ਹੈ।`);
    case "SPEED_TIME_PAIR": return tx(l,`गति ${n[0]} मीटर प्रति सेकंड और समय ${n[1]} सेकंड है।`,`ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਅਤੇ ਸਮਾਂ ${n[1]} ਸਕਿੰਟ ਹੈ।`);
    case "DISTANCE_TIME_PAIR": return tx(l,`दूरी ${n[0]} मीटर और समय ${n[1]} सेकंड है।`,`ਦੂਰੀ ${n[0]} ਮੀਟਰ ਅਤੇ ਸਮਾਂ ${n[1]} ਸਕਿੰਟ ਹੈ।`);
    case "DISTANCE_SPEED_PAIR": return tx(l,`दूरी ${n[0]} मीटर और गति ${n[1]} मीटर प्रति सेकंड है।`,`ਦੂਰੀ ${n[0]} ਮੀਟਰ ਅਤੇ ਗਤੀ ${n[1]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "CORE_BOUND": return /speed/i.test(text)?tx(l,`गति ${n[0]} मीटर प्रति सेकंड से अधिक नहीं है।`,`ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੈ।`):tx(l,`यात्रा में कम से कम ${n[0]} सेकंड लगते हैं।`,`ਯਾਤਰਾ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ${n[0]} ਸਕਿੰਟ ਲੱਗਦੇ ਹਨ।`);
    case "CORE_PARITY": return tx(l,`मीटर प्रति सेकंड में गति ${even(text)?"सम":"विषम"} संख्या है।`,`ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਵਿੱਚ ਗਤੀ ${even(text)?"ਜੁੜੀ":"ਬੇਜੋੜ"} ਗਿਣਤੀ ਹੈ।`);
    case "TRAIN_LENGTH_EXACT": return tx(l,`${/first/i.test(text)?"पहली ट्रेन":"ट्रेन"} की लंबाई ${n[0]} मीटर है।`,`${/first/i.test(text)?"ਪਹਿਲੀ ਰੇਲਗੱਡੀ":"ਰੇਲਗੱਡੀ"} ਦੀ ਲੰਬਾਈ ${n[0]} ਮੀਟਰ ਹੈ।`);
    case "SECOND_TRAIN_LENGTH_EXACT": return tx(l,`दूसरी ट्रेन की लंबाई ${n[0]} मीटर है।`,`ਦੂਜੀ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ${n[0]} ਮੀਟਰ ਹੈ।`);
    case "OBJECT_LENGTH_EXACT": return tx(l,`स्थिर वस्तु की लंबाई ${n[0]} मीटर है।`,`ਅਸਥਿਰ ਵਸਤੂ ਦੀ ਲੰਬਾਈ ${n[0]} ਮੀਟਰ ਹੈ।`);
    case "TRAIN_SPEED_EXACT": return tx(l,`${/first/i.test(text)?"पहली ट्रेन":"ट्रेन"} की गति ${n[0]} मीटर प्रति सेकंड है।`,`${/first/i.test(text)?"ਪਹਿਲੀ ਰੇਲਗੱਡੀ":"ਰੇਲਗੱਡੀ"} ਦੀ ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "SECOND_TRAIN_SPEED_EXACT": return tx(l,`दूसरी ट्रेन विपरीत दिशा में ${n[0]} मीटर प्रति सेकंड की गति से चलती है।`,`ਦੂਜੀ ਰੇਲਗੱਡੀ ਵਿਰੋਧੀ ਦਿਸ਼ਾ ਵਿੱਚ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਦੀ ਗਤੀ ਨਾਲ ਚੱਲਦੀ ਹੈ।`);
    case "TOTAL_LENGTH_EXACT": return /two train/i.test(text)?tx(l,`दोनों ट्रेनों की कुल लंबाई ${n[0]} मीटर है।`,`ਦੋਵੇਂ ਰੇਲਗੱਡੀਆਂ ਦੀ ਕੁੱਲ ਲੰਬਾਈ ${n[0]} ਮੀਟਰ ਹੈ।`):tx(l,`पूरी तरह पार करने की कुल दूरी ${n[0]} मीटर है।`,`ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਦੀ ਕੁੱਲ ਦੂਰੀ ${n[0]} ਮੀਟਰ ਹੈ।`);
    case "CLEAR_TIME_EXACT": return tx(l,`ट्रेन वस्तु को ${n[0]} सेकंड में पूरी तरह पार करती है।`,`ਰੇਲਗੱਡੀ ਵਸਤੂ ਨੂੰ ${n[0]} ਸਕਿੰਟ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਦੀ ਹੈ।`);
    case "RELATIVE_SPEED_EXACT": return tx(l,`दोनों ट्रेनों की सापेक्ष गति ${n[0]} मीटर प्रति सेकंड है।`,`ਦੋਵੇਂ ਰੇਲਗੱਡੀਆਂ ਦੀ ਸਾਪੇਖ ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "CROSS_TIME_EXACT": return tx(l,`दोनों ट्रेनें ${n[0]} सेकंड में एक-दूसरे को पूरी तरह पार करती हैं।`,`ਦੋਵੇਂ ਰੇਲਗੱਡੀਆਂ ${n[0]} ਸਕਿੰਟ ਵਿੱਚ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਦੀਆਂ ਹਨ।`);
    case "TOTAL_SPEED_PAIR": return tx(l,`पूरी तरह पार करने की दूरी ${n[0]} मीटर और ट्रेन की गति ${n[1]} मीटर प्रति सेकंड है।`,`ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਦੀ ਦੂਰੀ ${n[0]} ਮੀਟਰ ਅਤੇ ਰੇਲਗੱਡੀ ਦੀ ਗਤੀ ${n[1]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "TRAIN_FULL_DATA": return tx(l,`ट्रेन की लंबाई ${n[0]} मीटर, वस्तु की लंबाई ${n[1]} मीटर और ट्रेन की गति ${n[2]} मीटर प्रति सेकंड है।`,`ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ${n[0]} ਮੀਟਰ, ਵਸਤੂ ਦੀ ਲੰਬਾਈ ${n[1]} ਮੀਟਰ ਅਤੇ ਰੇਲਗੱਡੀ ਦੀ ਗਤੀ ${n[2]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "TRAIN_BOUND": return tx(l,`कुल ट्रेन लंबाई ${n[0]} मीटर से अधिक नहीं है।`,`ਕੁੱਲ ਰੇਲਗੱਡੀ ਲੰਬਾਈ ${n[0]} ਮੀਟਰ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੈ।`);
    case "LENGTH_PAIR": return tx(l,`दोनों ट्रेनों की लंबाइयाँ ${n[0]} मीटर और ${n[1]} मीटर हैं।`,`ਦੋਵੇਂ ਰੇਲਗੱਡੀਆਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ${n[0]} ਮੀਟਰ ਅਤੇ ${n[1]} ਮੀਟਰ ਹਨ।`);
    case "SPEED_PAIR": return tx(l,`दोनों ट्रेनों की गतियाँ ${n[0]} और ${n[1]} मीटर प्रति सेकंड हैं और दिशाएँ विपरीत हैं।`,`ਦੋਵੇਂ ਰੇਲਗੱਡੀਆਂ ਦੀਆਂ ਗਤੀਆਂ ${n[0]} ਅਤੇ ${n[1]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹਨ ਅਤੇ ਦਿਸ਼ਾਵਾਂ ਵਿਰੋਧੀ ਹਨ।`);
    case "CROSSING_DATA_PAIR": return tx(l,`दोनों ट्रेनों की कुल लंबाई ${n[0]} मीटर और सापेक्ष गति ${n[1]} मीटर प्रति सेकंड है।`,`ਦੋਵੇਂ ਰੇਲਗੱਡੀਆਂ ਦੀ ਕੁੱਲ ਲੰਬਾਈ ${n[0]} ਮੀਟਰ ਅਤੇ ਸਾਪੇਖ ਗਤੀ ${n[1]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "TWO_TRAIN_FULL_DATA": return tx(l,`ट्रेनों की लंबाइयाँ ${n[0]} और ${n[1]} मीटर तथा गतियाँ ${n[2]} और ${n[3]} मीटर प्रति सेकंड हैं।`,`ਰੇਲਗੱਡੀਆਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ${n[0]} ਅਤੇ ${n[1]} ਮੀਟਰ ਅਤੇ ਗਤੀਆਂ ${n[2]} ਅਤੇ ${n[3]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹਨ।`);
    case "BOAT_DISTANCE_EXACT": return tx(l,`${dir} दूरी ${n[0]} मीटर है।`,`${dir} ਦੂਰੀ ${n[0]} ਮੀਟਰ ਹੈ।`);
    case "STILL_SPEED_EXACT": return tx(l,`स्थिर जल में नाव की गति ${n[0]} मीटर प्रति सेकंड है।`,`ਥਿਰ ਪਾਣੀ ਵਿੱਚ ਕਿਸ਼ਤੀ ਦੀ ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "STREAM_SPEED_EXACT": return tx(l,`धारा की गति ${n[0]} मीटर प्रति सेकंड है।`,`ਧਾਰਾ ਦੀ ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "GROUND_SPEED_EXACT": return tx(l,`${dir} प्रभावी गति ${n[0]} मीटर प्रति सेकंड है।`,`${dir} ਪ੍ਰਭਾਵੀ ਗਤੀ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "BOAT_TIME_EXACT": return tx(l,`${dir} यात्रा में ${n[0]} सेकंड लगते हैं।`,`${dir} ਯਾਤਰਾ ਵਿੱਚ ${n[0]} ਸਕਿੰਟ ਲੱਗਦੇ ਹਨ।`);
    case "BOAT_DISTANCE_GROUND_PAIR": return tx(l,`${dir} दूरी ${n[0]} मीटर और प्रभावी गति ${n[1]} मीटर प्रति सेकंड है।`,`${dir} ਦੂਰੀ ${n[0]} ਮੀਟਰ ਅਤੇ ਪ੍ਰਭਾਵੀ ਗਤੀ ${n[1]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "BOAT_SPEED_PAIR": return tx(l,`स्थिर जल में गति ${n[0]} और धारा की गति ${n[1]} मीटर प्रति सेकंड है।`,`ਥਿਰ ਪਾਣੀ ਵਿੱਚ ਗਤੀ ${n[0]} ਅਤੇ ਧਾਰਾ ਦੀ ਗਤੀ ${n[1]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "BOAT_FULL_TRIP_DATA": return tx(l,`${dir} दूरी ${n[0]} मीटर, स्थिर जल में गति ${n[1]} और धारा की गति ${n[2]} मीटर प्रति सेकंड है।`,`${dir} ਦੂਰੀ ${n[0]} ਮੀਟਰ, ਥਿਰ ਪਾਣੀ ਵਿੱਚ ਗਤੀ ${n[1]} ਅਤੇ ਧਾਰਾ ਦੀ ਗਤੀ ${n[2]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
    case "BOAT_BOUND": return /distance/i.test(text)?tx(l,`${dir} दूरी अधिकतम ${n[0]} मीटर है।`,`${dir} ਦੂਰੀ ਵੱਧ ਤੋਂ ਵੱਧ ${n[0]} ਮੀਟਰ ਹੈ।`):tx(l,`स्थिर जल में नाव की गति कम से कम ${n[0]} मीटर प्रति सेकंड है।`,`ਥਿਰ ਪਾਣੀ ਵਿੱਚ ਕਿਸ਼ਤੀ ਦੀ ਗਤੀ ਘੱਟੋ-ਘੱਟ ${n[0]} ਮੀਟਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।`);
  }
  throw new Error(`TSD unsupported family ${f}`);
}

const MIX_CTX:Record<string,[string,string,string,string]>={
  RICE_GRADES:["चावल","ਚੌਲ","किग्रा","ਕਿਲੋਗ੍ਰਾਮ"],TEA_GRADES:["चाय","ਚਾਹ","किग्रा","ਕਿਲੋਗ੍ਰਾਮ"],COFFEE_BEANS:["कॉफी बीन्स","ਕੌਫੀ ਬੀਨ","किग्रा","ਕਿਲੋਗ੍ਰਾਮ"],COOKING_OIL:["खाद्य तेल","ਖਾਣ ਵਾਲਾ ਤੇਲ","लीटर","ਲੀਟਰ"],SPICE_BLEND:["मसाला मिश्रण","ਮਸਾਲਾ ਮਿਸ਼ਰਣ","किग्रा","ਕਿਲੋਗ੍ਰਾਮ"],DRY_FRUIT_BLEND:["सूखे मेवे","ਸੁੱਕੇ ਮੇਵੇ","किग्रा","ਕਿਲੋਗ੍ਰਾਮ"]
};
function mixSurface(q:AnyQuestion,l:DsfCp019Wave02Language){
 const c=MIX_CTX[String(q.contextId)]??MIX_CTX.RICE_GRADES!,mat=l==="hi"?c[0]:c[1];
 const mode=String(q.solveModeId??q.solveMode);
 const prompt=mode==="DSF-SM-MAL-MEAN-FROM-COMPONENTS"?tx(l,"अंतिम मिश्रण की औसत लागत प्रति इकाई कितनी है?","ਅੰਤਿਮ ਮਿਸ਼ਰਣ ਦੀ ਔਸਤ ਲਾਗਤ ਪ੍ਰਤੀ ਇਕਾਈ ਕਿੰਨੀ ਹੈ?")
 :mode==="DSF-SM-MAL-RATIO-FROM-TARGET"?tx(l,"सस्ता और महँगा ग्रेड किस अनुपात में मिलाए गए हैं?","ਸਸਤਾ ਅਤੇ ਮਹਿੰਗਾ ਗ੍ਰੇਡ ਕਿਸ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਏ ਗਏ ਹਨ?")
 :mode==="DSF-SM-MAL-UNKNOWN-SOURCE-VALUE"?tx(l,"महँगे ग्रेड की प्रति इकाई लागत कितनी है?","ਮਹਿੰਗੇ ਗ੍ਰੇਡ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ਕਿੰਨੀ ਹੈ?")
 :mode==="DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY"?tx(l,"महँगे ग्रेड की मात्रा कितनी है?","ਮਹਿੰਗੇ ਗ੍ਰੇਡ ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?")
 :mode==="DSF-SM-MAL-ADD-QUANTITY-TO-TARGET"?tx(l,"महँगे ग्रेड की कितनी मात्रा मिलानी होगी?","ਮਹਿੰਗੇ ਗ੍ਰੇਡ ਦੀ ਕਿੰਨੀ ਮਾਤਰਾ ਮਿਲਾਉਣੀ ਹੋਵੇਗੀ?")
 :tx(l,"दोनों घटकों की मात्राएँ कितनी हैं?","ਦੋਵੇਂ ਘਟਕਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕਿੰਨੀਆਂ ਹਨ?");
 const target=mode==="DSF-SM-MAL-MEAN-FROM-COMPONENTS"?tx(l,"अंतिम मिश्रण की औसत लागत","ਅੰਤਿਮ ਮਿਸ਼ਰਣ ਦੀ ਔਸਤ ਲਾਗਤ")
 :mode==="DSF-SM-MAL-RATIO-FROM-TARGET"?tx(l,"मिश्रण अनुपात","ਮਿਸ਼ਰਣ ਅਨੁਪਾਤ")
 :mode==="DSF-SM-MAL-UNKNOWN-SOURCE-VALUE"?tx(l,"महँगे ग्रेड की प्रति इकाई लागत","ਮਹਿੰਗੇ ਗ੍ਰੇਡ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ")
 :mode==="DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY"?tx(l,"महँगे ग्रेड की मात्रा","ਮਹਿੰਗੇ ਗ੍ਰੇਡ ਦੀ ਮਾਤਰਾ")
 :mode==="DSF-SM-MAL-ADD-QUANTITY-TO-TARGET"?tx(l,"मिलाई जाने वाली महँगे ग्रेड की मात्रा","ਮਿਲਾਈ ਜਾਣ ਵਾਲੇ ਮਹਿੰਗੇ ਗ੍ਰੇਡ ਦੀ ਮਾਤਰਾ")
 :tx(l,"दोनों घटकों की मात्राएँ","ਦੋਵੇਂ ਘਟਕਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ");
 return {lead:tx(l,`${mat} के दो ग्रेड का मिश्रण तैयार किया गया है।`,`${mat} ਦੇ ਦੋ ਗ੍ਰੇਡਾਂ ਦਾ ਮਿਸ਼ਰਣ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।`),prompt,target,unit:l==="hi"?c[2]:c[3],mat};
}
function mixStatement(s:any,l:DsfCp019Wave02Language,q:AnyQuestion){
 const c=mixSurface(q,l),f=String(s.statementFamily),n=nums(String(s.text)),text=String(s.text);
 const cheaper=tx(l,"सस्ता ग्रेड","ਸਸਤਾ ਗ੍ਰੇਡ"),costlier=tx(l,"महँगा ग्रेड","ਮਹਿੰਗਾ ਗ੍ਰੇਡ");
 switch(f){
  case "LOWER_VALUE_EXACT": return tx(l,`${cheaper} की लागत ₹${n[0]} प्रति इकाई है।`,`${cheaper} ਦੀ ਲਾਗਤ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "HIGHER_VALUE_EXACT": return tx(l,`${costlier} की लागत ₹${n[0]} प्रति इकाई है।`,`${costlier} ਦੀ ਲਾਗਤ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "LOWER_QUANTITY_EXACT": return tx(l,`${cheaper} की मात्रा ${n[0]} ${c.unit} है।`,`${cheaper} ਦੀ ਮਾਤਰਾ ${n[0]} ${c.unit} ਹੈ।`);
  case "HIGHER_QUANTITY_EXACT": return tx(l,`${costlier} की मात्रा ${n[0]} ${c.unit} है।`,`${costlier} ਦੀ ਮਾਤਰਾ ${n[0]} ${c.unit} ਹੈ।`);
  case "MEAN_EXACT": return tx(l,`अंतिम औसत लागत ₹${n[0]} प्रति इकाई है।`,`ਅੰਤਿਮ ਔਸਤ ਲਾਗਤ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "TOTAL_QUANTITY_EXACT": return tx(l,`मिश्रण की कुल मात्रा ${n[0]} ${c.unit} है।`,`ਮਿਸ਼ਰਣ ਦੀ ਕੁੱਲ ਮਾਤਰਾ ${n[0]} ${c.unit} ਹੈ।`);
  case "RATIO_EXACT": return tx(l,`सस्ता और महँगा ग्रेड ${n[0]}:${n[1]} के अनुपात में हैं।`,`ਸਸਤਾ ਅਤੇ ਮਹਿੰਗਾ ਗ੍ਰੇਡ ${n[0]}:${n[1]} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ।`);
  case "VALUE_PAIR": return tx(l,`दोनों ग्रेड की प्रति इकाई लागत ₹${n[0]} और ₹${n[1]} है।`,`ਦੋਵੇਂ ਗ੍ਰੇਡਾਂ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ₹${n[0]} ਅਤੇ ₹${n[1]} ਹੈ।`);
  case "QUANTITY_PAIR": return tx(l,`दोनों ग्रेड की मात्राएँ ${n[0]} और ${n[1]} ${c.unit} हैं।`,`ਦੋਵੇਂ ਗ੍ਰੇਡਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ${n[0]} ਅਤੇ ${n[1]} ${c.unit} ਹਨ।`);
  case "LOWER_MEAN_PAIR": return tx(l,`${cheaper} की लागत ₹${n[0]} और अंतिम औसत ₹${n[1]} प्रति इकाई है।`,`${cheaper} ਦੀ ਲਾਗਤ ₹${n[0]} ਅਤੇ ਅੰਤਿਮ ਔਸਤ ₹${n[1]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "LOWER_QUANTITY_MEAN_PAIR": return tx(l,`${cheaper} की मात्रा ${n[0]} ${c.unit} और अंतिम औसत ₹${n[1]} प्रति इकाई है।`,`${cheaper} ਦੀ ਮਾਤਰਾ ${n[0]} ${c.unit} ਅਤੇ ਅੰਤਿਮ ਔਸਤ ₹${n[1]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "TOTAL_MEAN_PAIR": return tx(l,`कुल मात्रा ${n[0]} ${c.unit} और अंतिम औसत ₹${n[1]} प्रति इकाई है।`,`ਕੁੱਲ ਮਾਤਰਾ ${n[0]} ${c.unit} ਅਤੇ ਅੰਤਿਮ ਔਸਤ ₹${n[1]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "FULL_BLEND_DATA": return tx(l,`दोनों ग्रेड की लागत ₹${n[0]} और ₹${n[1]} तथा मात्राएँ ${n[2]} और ${n[3]} ${c.unit} हैं।`,`ਦੋਵੇਂ ਗ੍ਰੇਡਾਂ ਦੀ ਲਾਗਤ ₹${n[0]} ਅਤੇ ₹${n[1]} ਅਤੇ ਮਾਤਰਾਵਾਂ ${n[2]} ਅਤੇ ${n[3]} ${c.unit} ਹਨ।`);
  case "UNKNOWN_VALUE_DATA": return tx(l,`सस्ते ग्रेड की लागत ₹${n[0]}, मात्राएँ ${n[1]} और ${n[2]} ${c.unit}, तथा अंतिम औसत ₹${n[3]} प्रति इकाई है।`,`ਸਸਤੇ ਗ੍ਰੇਡ ਦੀ ਲਾਗਤ ₹${n[0]}, ਮਾਤਰਾਵਾਂ ${n[1]} ਅਤੇ ${n[2]} ${c.unit}, ਅਤੇ ਅੰਤਿਮ ਔਸਤ ₹${n[3]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "UNKNOWN_QUANTITY_DATA": return tx(l,`ग्रेड की लागत ₹${n[0]} और ₹${n[1]}, सस्ते ग्रेड की मात्रा ${n[2]} ${c.unit}, तथा अंतिम औसत ₹${n[3]} है।`,`ਗ੍ਰੇਡਾਂ ਦੀ ਲਾਗਤ ₹${n[0]} ਅਤੇ ₹${n[1]}, ਸਸਤੇ ਗ੍ਰੇਡ ਦੀ ਮਾਤਰਾ ${n[2]} ${c.unit}, ਅਤੇ ਅੰਤਿਮ ਔਸਤ ₹${n[3]} ਹੈ।`);
  case "RECONSTRUCTION_DATA": return tx(l,`ग्रेड की लागत ₹${n[0]} और ₹${n[1]}, कुल मात्रा ${n[2]} ${c.unit}, तथा अंतिम औसत ₹${n[3]} है।`,`ਗ੍ਰੇਡਾਂ ਦੀ ਲਾਗਤ ₹${n[0]} ਅਤੇ ₹${n[1]}, ਕੁੱਲ ਮਾਤਰਾ ${n[2]} ${c.unit}, ਅਤੇ ਅੰਤਿਮ ਔਸਤ ₹${n[3]} ਹੈ।`);
  case "BLEND_BOUND": return /cheaper grade costs/i.test(text)?tx(l,`सस्ते ग्रेड की लागत अधिकतम ₹${n[0]} प्रति इकाई है।`,`ਸਸਤੇ ਗ੍ਰੇਡ ਦੀ ਲਾਗਤ ਵੱਧ ਤੋਂ ਵੱਧ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`):tx(l,`महँगे ग्रेड की मात्रा कम से कम ${n[0]} ${c.unit} है।`,`ਮਹਿੰਗੇ ਗ੍ਰੇਡ ਦੀ ਮਾਤਰਾ ਘੱਟੋ-ਘੱਟ ${n[0]} ${c.unit} ਹੈ।`);
  case "BASE_VALUE_EXACT": return tx(l,`मौजूदा ${c.mat} की लागत ₹${n[0]} प्रति इकाई है।`,`ਮੌਜੂਦਾ ${c.mat} ਦੀ ਲਾਗਤ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "BASE_QUANTITY_EXACT": return tx(l,`मौजूदा मात्रा ${n[0]} ${c.unit} है।`,`ਮੌਜੂਦਾ ਮਾਤਰਾ ${n[0]} ${c.unit} ਹੈ।`);
  case "ADDED_VALUE_EXACT": return tx(l,`मिलाए जाने वाले ग्रेड की लागत ₹${n[0]} प्रति इकाई है।`,`ਮਿਲਾਏ ਜਾਣ ਵਾਲੇ ਗ੍ਰੇਡ ਦੀ ਲਾਗਤ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "TARGET_MEAN_EXACT": return tx(l,`लक्षित औसत लागत ₹${n[0]} प्रति इकाई है।`,`ਲਕਸ਼ਿਤ ਔਸਤ ਲਾਗਤ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "ADDED_QUANTITY_EXACT": return tx(l,`मिलाई जाने वाली मात्रा ${n[0]} ${c.unit} है।`,`ਮਿਲਾਈ ਜਾਣ ਵਾਲੀ ਮਾਤਰਾ ${n[0]} ${c.unit} ਹੈ।`);
  case "BASE_STATE_PAIR": return tx(l,`मौजूदा लागत ₹${n[0]} प्रति इकाई और मात्रा ${n[1]} ${c.unit} है।`,`ਮੌਜੂਦਾ ਲਾਗਤ ₹${n[0]} ਪ੍ਰਤੀ ਇਕਾਈ ਅਤੇ ਮਾਤਰਾ ${n[1]} ${c.unit} ਹੈ।`);
  case "ADDED_TARGET_PAIR": return tx(l,`मिलाए जाने वाले ग्रेड की लागत ₹${n[0]} और लक्षित औसत ₹${n[1]} प्रति इकाई है।`,`ਮਿਲਾਏ ਜਾਣ ਵਾਲੇ ਗ੍ਰੇਡ ਦੀ ਲਾਗਤ ₹${n[0]} ਅਤੇ ਲਕਸ਼ਿਤ ਔਸਤ ₹${n[1]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`);
  case "FULL_ADDITION_DATA": return tx(l,`मौजूदा लागत ₹${n[0]}, मात्रा ${n[1]} ${c.unit}, मिलाए जाने वाले ग्रेड की लागत ₹${n[2]} और लक्षित औसत ₹${n[3]} है।`,`ਮੌਜੂਦਾ ਲਾਗਤ ₹${n[0]}, ਮਾਤਰਾ ${n[1]} ${c.unit}, ਮਿਲਾਏ ਜਾਣ ਵਾਲੇ ਗ੍ਰੇਡ ਦੀ ਲਾਗਤ ₹${n[2]} ਅਤੇ ਲਕਸ਼ਿਤ ਔਸਤ ₹${n[3]} ਹੈ।`);
  case "ADDITION_BOUND": return tx(l,`मौजूदा मात्रा ${n[0]} ${c.unit} से ${gt(text)?"अधिक":"कम"} है।`,`ਮੌਜੂਦਾ ਮਾਤਰਾ ${n[0]} ${c.unit} ਤੋਂ ${gt(text)?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
 }
 throw new Error(`MIX unsupported family ${f}`);
}

function mensSurface(q:AnyQuestion,l:DsfCp019Wave02Language){
 const m=String(q.solveModeId??q.solveMode);
 const map:Record<string,[string,string,string,string]>={
  "DSF-SM-MEN-TRIANGLE-AREA":["त्रिभुज का क्षेत्रफल कितना है?","ਤਿਕੋਣ ਦਾ ਖੇਤਰਫਲ ਕਿੰਨਾ ਹੈ?","त्रिभुज का क्षेत्रफल","ਤਿਕੋਣ ਦਾ ਖੇਤਰਫਲ"],
  "DSF-SM-MEN-RECTANGLE-AREA":["आयत का क्षेत्रफल कितना है?","ਆਇਤ ਦਾ ਖੇਤਰਫਲ ਕਿੰਨਾ ਹੈ?","आयत का क्षेत्रफल","ਆਇਤ ਦਾ ਖੇਤਰਫਲ"],
  "DSF-SM-MEN-RECTANGLE-PERIMETER":["आयत का परिमाप कितना है?","ਆਇਤ ਦਾ ਪਰਿਮਾਪ ਕਿੰਨਾ ਹੈ?","आयत का परिमाप","ਆਇਤ ਦਾ ਪਰਿਮਾਪ"],
  "DSF-SM-MEN-CIRCLE-AREA":["वृत्त का क्षेत्रफल कितना है?","ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ ਕਿੰਨਾ ਹੈ?","वृत्त का क्षेत्रफल","ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ"],
  "DSF-SM-MEN-CIRCLE-CIRCUMFERENCE":["वृत्त की परिधि कितनी है?","ਵ੍ਰਿਤ ਦੀ ਪਰਿਧੀ ਕਿੰਨੀ ਹੈ?","वृत्त की परिधि","ਵ੍ਰਿਤ ਦੀ ਪਰਿਧੀ"],
  "DSF-SM-MEN-SQUARE-PYRAMID-VOLUME":["वर्गाकार पिरामिड का आयतन कितना है?","ਵਰਗਾਕਾਰ ਪਿਰਾਮਿਡ ਦਾ ਆਇਤਨ ਕਿੰਨਾ ਹੈ?","पिरामिड का आयतन","ਪਿਰਾਮਿਡ ਦਾ ਆਇਤਨ"],
  "DSF-SM-MEN-CONICAL-FRUSTUM-VOLUME":["शंकु-खंड का आयतन कितना है?","ਸ਼ੰਕੂ-ਖੰਡ ਦਾ ਆਇਤਨ ਕਿੰਨਾ ਹੈ?","शंकु-खंड का आयतन","ਸ਼ੰਕੂ-ਖੰਡ ਦਾ ਆਇਤਨ"],
 };
 const x=map[m]??map["DSF-SM-MEN-RECTANGLE-AREA"]!;
 return {lead:tx(l,"आकृति के कुछ माप दिए गए हैं।","ਆਕ੍ਰਿਤੀ ਦੇ ਕੁਝ ਮਾਪ ਦਿੱਤੇ ਗਏ ਹਨ।"),prompt:l==="hi"?x[0]:x[1],target:l==="hi"?x[2]:x[3]};
}
function mensStatement(s:any,l:DsfCp019Wave02Language){
 const f=String(s.statementFamily),n=nums(String(s.text)),text=String(s.text);
 const bound=atMost(text)||/less/i.test(text)?tx(l,"अधिकतम","ਵੱਧ ਤੋਂ ਵੱਧ"):tx(l,"कम से कम","ਘੱਟੋ-ਘੱਟ");
 switch(f){
  case "BASE_EXACT": return tx(l,`आधार ${n[0]} इकाई है।`,`ਅਧਾਰ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "HEIGHT_EXACT": return tx(l,`ऊँचाई ${n[0]} इकाई है।`,`ਉਚਾਈ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "AREA_EXACT": return tx(l,`क्षेत्रफल ${n[0]} वर्ग इकाई है।`,`ਖੇਤਰਫਲ ${n[0]} ਵਰਗ ਇਕਾਈ ਹੈ।`);
  case "BASE_HEIGHT_PAIR": return tx(l,`आधार ${n[0]} और ऊँचाई ${n[1]} इकाई है।`,`ਅਧਾਰ ${n[0]} ਅਤੇ ਉਚਾਈ ${n[1]} ਇਕਾਈ ਹੈ।`);
  case "DIMENSION_BOUND": return tx(l,`दिया गया माप ${bound} ${n[0]} इकाई है।`,`ਦਿੱਤਾ ਮਾਪ ${bound} ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "LENGTH_EXACT": return tx(l,`लंबाई ${n[0]} इकाई है।`,`ਲੰਬਾਈ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "BREADTH_EXACT": return tx(l,`चौड़ाई ${n[0]} इकाई है।`,`ਚੌੜਾਈ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "PERIMETER_EXACT": return tx(l,`परिमाप ${n[0]} इकाई है।`,`ਪਰਿਮਾਪ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "LENGTH_BREADTH_PAIR": return tx(l,`लंबाई ${n[0]} और चौड़ाई ${n[1]} इकाई है।`,`ਲੰਬਾਈ ${n[0]} ਅਤੇ ਚੌੜਾਈ ${n[1]} ਇਕਾਈ ਹੈ।`);
  case "RADIUS_EXACT": return tx(l,`त्रिज्या ${n[0]} इकाई है।`,`ਤ੍ਰਿਜਿਆ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "DIAMETER_EXACT": return tx(l,`व्यास ${n[0]} इकाई है।`,`ਵਿਆਸ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "CIRCUMFERENCE_EXACT": return tx(l,`परिधि ${n[0]} इकाई है।`,`ਪਰਿਧੀ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "RADIUS_WINDOW_LOWER": return tx(l,`त्रिज्या कम से कम ${n[0]} इकाई है।`,`ਤ੍ਰਿਜਿਆ ਘੱਟੋ-ਘੱਟ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "RADIUS_WINDOW_UPPER": return tx(l,`त्रिज्या अधिकतम ${n[0]} इकाई है।`,`ਤ੍ਰਿਜਿਆ ਵੱਧ ਤੋਂ ਵੱਧ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "RADIUS_PARITY": return tx(l,`त्रिज्या ${even(text)?"सम":"विषम"} पूर्णांक है।`,`ਤ੍ਰਿਜਿਆ ${even(text)?"ਜੁੜਾ":"ਬੇਜੋੜ"} ਪੂਰਨ ਅੰਕ ਹੈ।`);
  case "PYRAMID_SIDE_EXACT": return tx(l,`वर्गाकार आधार की भुजा ${n[0]} इकाई है।`,`ਵਰਗਾਕਾਰ ਅਧਾਰ ਦੀ ਭੁਜਾ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "PYRAMID_HEIGHT_EXACT": return tx(l,`पिरामिड की ऊँचाई ${n[0]} इकाई है।`,`ਪਿਰਾਮਿਡ ਦੀ ਉਚਾਈ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "PYRAMID_VOLUME_EXACT": return tx(l,`पिरामिड का आयतन ${n[0]} घन इकाई है।`,`ਪਿਰਾਮਿਡ ਦਾ ਆਇਤਨ ${n[0]} ਘਨ ਇਕਾਈ ਹੈ।`);
  case "PYRAMID_SIDE_HEIGHT_PAIR": return tx(l,`आधार की भुजा ${n[0]} और ऊँचाई ${n[1]} इकाई है।`,`ਅਧਾਰ ਦੀ ਭੁਜਾ ${n[0]} ਅਤੇ ਉਚਾਈ ${n[1]} ਇਕਾਈ ਹੈ।`);
  case "OUTER_RADIUS_EXACT": return tx(l,`बाहरी त्रिज्या ${n[0]} इकाई है।`,`ਬਾਹਰੀ ਤ੍ਰਿਜਿਆ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "INNER_RADIUS_EXACT": return tx(l,`भीतरी त्रिज्या ${n[0]} इकाई है।`,`ਅੰਦਰੂਨੀ ਤ੍ਰਿਜਿਆ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "FRUSTUM_RADII_PAIR": return tx(l,`दोनों त्रिज्याएँ ${n[0]} और ${n[1]} इकाई हैं।`,`ਦੋਵੇਂ ਤ੍ਰਿਜਿਆਵਾਂ ${n[0]} ਅਤੇ ${n[1]} ਇਕਾਈ ਹਨ।`);
  case "FRUSTUM_HEIGHT_EXACT": return tx(l,`शंकु-खंड की ऊँचाई ${n[0]} इकाई है।`,`ਸ਼ੰਕੂ-ਖੰਡ ਦੀ ਉਚਾਈ ${n[0]} ਇਕਾਈ ਹੈ।`);
  case "FRUSTUM_VOLUME_EXACT": return tx(l,`शंकु-खंड का आयतन ${n[0]} घन इकाई है।`,`ਸ਼ੰਕੂ-ਖੰਡ ਦਾ ਆਇਤਨ ${n[0]} ਘਨ ਇਕਾਈ ਹੈ।`);
  case "FRUSTUM_FULL_DATA": return tx(l,`दोनों त्रिज्याएँ ${n[0]}, ${n[1]} और ऊँचाई ${n[2]} इकाई है।`,`ਦੋਵੇਂ ਤ੍ਰਿਜਿਆਵਾਂ ${n[0]}, ${n[1]} ਅਤੇ ਉਚਾਈ ${n[2]} ਇਕਾਈ ਹੈ।`);
  case "SOLID_BOUND": return tx(l,`दिया गया ठोस माप ${bound} ${n[0]} इकाई है।`,`ਦਿੱਤਾ ਠੋਸ ਮਾਪ ${bound} ${n[0]} ਇਕਾਈ ਹੈ।`);
 }
 throw new Error(`MEN unsupported family ${f}`);
}

const CORE_LABELS:Record<string,{hi:[string,string,string?,string],pa:[string,string,string?,string]}>={
 "DSF-SM-RAP-SCALING-BY-COMPONENT":{hi:["अनुपात का पहला पद","अनुपात का दूसरा पद","ज्ञात पहली मात्रा","संबंधित दूसरी मात्रा"],pa:["ਅਨੁਪਾਤ ਦਾ ਪਹਿਲਾ ਪਦ","ਅਨੁਪਾਤ ਦਾ ਦੂਜਾ ਪਦ","ਜਾਣੀ ਪਹਿਲੀ ਮਾਤਰਾ","ਸੰਬੰਧਿਤ ਦੂਜੀ ਮਾਤਰਾ"]},
 "DSF-SM-RAP-DIRECT-VARIATION":{hi:["पहला इनपुट","पहला आउटपुट","दूसरा इनपुट","दूसरा आउटपुट"],pa:["ਪਹਿਲਾ ਇਨਪੁੱਟ","ਪਹਿਲਾ ਆਉਟਪੁੱਟ","ਦੂਜਾ ਇਨਪੁੱਟ","ਦੂਜਾ ਆਉਟਪੁੱਟ"]},
 "DSF-SM-RAP-INVERSE-VARIATION":{hi:["पहला इनपुट","पहला आउटपुट","दूसरा इनपुट","दूसरा आउटपुट"],pa:["ਪਹਿਲਾ ਇਨਪੁੱਟ","ਪਹਿਲਾ ਆਉਟਪੁੱਟ","ਦੂਜਾ ਇਨਪੁੱਟ","ਦੂਜਾ ਆਉਟਪੁੱਟ"]},
 "DSF-SM-RAP-FOURTH-PROPORTIONAL":{hi:["पहला पद","दूसरा पद","तीसरा पद","चौथा समानुपाती"],pa:["ਪਹਿਲਾ ਪਦ","ਦੂਜਾ ਪਦ","ਤੀਜਾ ਪਦ","ਚੌਥਾ ਸਮਾਨੁਪਾਤੀ"]},
 "DSF-SM-PCT-PERCENT-OF":{hi:["प्रतिशत दर","आधार मात्रा",undefined,"प्रतिशत मात्रा"],pa:["ਪ੍ਰਤੀਸ਼ਤ ਦਰ","ਅਧਾਰ ਮਾਤਰਾ",undefined,"ਪ੍ਰਤੀਸ਼ਤ ਮਾਤਰਾ"]},
 "DSF-SM-PCT-REVERSE-PERCENT":{hi:["प्रतिशत दर","ज्ञात प्रतिशत मात्रा",undefined,"मूल आधार मात्रा"],pa:["ਪ੍ਰਤੀਸ਼ਤ ਦਰ","ਜਾਣੀ ਪ੍ਰਤੀਸ਼ਤ ਮਾਤਰਾ",undefined,"ਮੂਲ ਅਧਾਰ ਮਾਤਰਾ"]},
 "DSF-SM-PCT-VALUE-AS-PERCENT":{hi:["भाग का मान","आधार मान",undefined,"प्रतिशत"],pa:["ਹਿੱਸੇ ਦਾ ਮੁੱਲ","ਅਧਾਰ ਮੁੱਲ",undefined,"ਪ੍ਰਤੀਸ਼ਤ"]},
 "DSF-SM-PCT-SUCCESSIVE-CHANGE":{hi:["वृद्धि दर","कमी दर",undefined,"कुल प्रतिशत परिवर्तन"],pa:["ਵਾਧੇ ਦੀ ਦਰ","ਘਾਟ ਦੀ ਦਰ",undefined,"ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ"]},
 "DSF-SM-NUM-LEAST-MULTIPLE-AT-BOUND":{hi:["निचली सीमा","भाजक",undefined,"सीमा पर या उससे ऊपर सबसे छोटा गुणज"],pa:["ਹੇਠਲੀ ਸੀਮਾ","ਭਾਜਕ",undefined,"ਸੀਮਾ 'ਤੇ ਜਾਂ ਉਸ ਤੋਂ ਉੱਪਰ ਸਭ ਤੋਂ ਛੋਟਾ ਗੁਣਜ"]},
 "DSF-SM-NUM-REMAINDER":{hi:["पूर्णांक","भाजक",undefined,"सबसे छोटा गैर-ऋणात्मक शेष"],pa:["ਪੂਰਨ ਅੰਕ","ਭਾਜਕ",undefined,"ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਣਾਤਮਕ ਬਾਕੀ"]},
};
function coreSurface(q:AnyQuestion,l:DsfCp019Wave02Language){
 const labels=CORE_LABELS[String(q.solveModeId??q.solveMode)]?.[l]??CORE_LABELS["DSF-SM-PCT-PERCENT-OF"]![l];
 const target=labels[3];
 return {lead:tx(l,"एक गणितीय संबंध दिया गया है।","ਇੱਕ ਗਣਿਤਕ ਸੰਬੰਧ ਦਿੱਤਾ ਗਿਆ ਹੈ।"),prompt:tx(l,`क्या ${target} निर्धारित किया जा सकता है?`,`ਕੀ ${target} ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?`),target,labels};
}
function coreStatement(s:any,l:DsfCp019Wave02Language,q:AnyQuestion){
 const c=coreSurface(q,l),f=String(s.statementFamily),n=nums(String(s.text)),text=String(s.text);
 const [a,b,cc,target]=c.labels;
 switch(f){
  case "TARGET_EXACT": return tx(l,`${target} ${n[0]} है।`,`${target} ${n[0]} ਹੈ।`);
  case "A_EXACT": return tx(l,`${a} ${n[0]} है।`,`${a} ${n[0]} ਹੈ।`);
  case "B_EXACT": return tx(l,`${b} ${n[0]} है।`,`${b} ${n[0]} ਹੈ।`);
  case "C_EXACT": return tx(l,`${cc} ${n[0]} है।`,`${cc} ${n[0]} ਹੈ।`);
  case "AB_PAIR": return tx(l,`${a} ${n[0]} और ${b} ${n[1]} है।`,`${a} ${n[0]} ਅਤੇ ${b} ${n[1]} ਹੈ।`);
  case "BC_PAIR": return tx(l,`${b} ${n[0]} और ${cc} ${n[1]} है।`,`${b} ${n[0]} ਅਤੇ ${cc} ${n[1]} ਹੈ।`);
  case "FULL_DATA": return n.length>=3?tx(l,`${a}, ${b} और ${cc} क्रमशः ${n[0]}, ${n[1]} और ${n[2]} हैं।`,`${a}, ${b} ਅਤੇ ${cc} ਕ੍ਰਮਵਾਰ ${n[0]}, ${n[1]} ਅਤੇ ${n[2]} ਹਨ।`):tx(l,`${a} और ${b} क्रमशः ${n[0]} और ${n[1]} हैं।`,`${a} ਅਤੇ ${b} ਕ੍ਰਮਵਾਰ ${n[0]} ਅਤੇ ${n[1]} ਹਨ।`);
  case "A_BOUND": return tx(l,`${a} ${/at most/i.test(text)?"अधिकतम":"कम से कम"} ${n[0]} है।`,`${a} ${/at most/i.test(text)?"ਵੱਧ ਤੋਂ ਵੱਧ":"ਘੱਟੋ-ਘੱਟ"} ${n[0]} ਹੈ।`);
  case "B_BOUND": return tx(l,`${b} ${/at most/i.test(text)?"अधिकतम":"कम से कम"} ${n[0]} है।`,`${b} ${/at most/i.test(text)?"ਵੱਧ ਤੋਂ ਵੱਧ":"ਘੱਟੋ-ਘੱਟ"} ${n[0]} ਹੈ।`);
  case "A_PARITY": return tx(l,`${a} ${even(text)?"सम":"विषम"} है।`,`${a} ${even(text)?"ਜੁੜਾ":"ਬੇਜੋੜ"} ਹੈ।`);
  case "B_PARITY": return tx(l,`${b} ${even(text)?"सम":"विषम"} है।`,`${b} ${even(text)?"ਜੁੜਾ":"ਬੇਜੋੜ"} ਹੈ।`);
 }
 throw new Error(`CORE unsupported family ${f}`);
}

function algSurface(q:AnyQuestion,l:DsfCp019Wave02Language){
 const system=String(q.contextId)==="SIMULTANEOUS_EQUATIONS";
 return {lead:system?tx(l,"x और y में दो रैखिक समीकरण दिए गए हैं।","x ਅਤੇ y ਵਿੱਚ ਦੋ ਰੇਖੀ ਸਮੀਕਰਨ ਦਿੱਤੇ ਗਏ ਹਨ।"):tx(l,"x में एक रैखिक समीकरण दिया गया है।","x ਵਿੱਚ ਇੱਕ ਰੇਖੀ ਸਮੀਕਰਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।"),prompt:tx(l,"क्या x का मान निर्धारित किया जा सकता है?","ਕੀ x ਦਾ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),target:tx(l,"x का मान","x ਦਾ ਮੁੱਲ")};
}
function algStatement(s:any,l:DsfCp019Wave02Language){
 const f=String(s.statementFamily),n=nums(String(s.text)),text=String(s.text);
 switch(f){
  case "TARGET_EXACT": return tx(l,`हल में x = ${n[0]} है।`,`ਹੱਲ ਵਿੱਚ x = ${n[0]} ਹੈ।`);
  case "COEFFICIENT_EXACT": return tx(l,`बाएँ पक्ष में x का गुणांक ${n[0]} है।`,`ਖੱਬੇ ਪਾਸੇ x ਦਾ ਗੁਣਾਂਕ ${n[0]} ਹੈ।`);
  case "LEFT_CONSTANT_EXACT": return tx(l,`बाएँ पक्ष का अचर ${n[0]} है।`,`ਖੱਬੇ ਪਾਸੇ ਦਾ ਅਚਰ ${n[0]} ਹੈ।`);
  case "RIGHT_CONSTANT_EXACT": return tx(l,`दायाँ पक्ष ${n[0]} है।`,`ਸੱਜਾ ਪਾਸਾ ${n[0]} ਹੈ।`);
  case "COEFF_LEFT_PAIR": return tx(l,`बायाँ पक्ष ${n[0]}x + ${n[1]} है।`,`ਖੱਬਾ ਪਾਸਾ ${n[0]}x + ${n[1]} ਹੈ।`);
  case "FULL_EQUATION": return tx(l,`समीकरण ${n[0]}x + ${n[1]} = ${n[2]} है।`,`ਸਮੀਕਰਨ ${n[0]}x + ${n[1]} = ${n[2]} ਹੈ।`);
  case "FIRST_EQUATION": return tx(l,`पहला समीकरण x + y = ${n[0]} है।`,`ਪਹਿਲਾ ਸਮੀਕਰਨ x + y = ${n[0]} ਹੈ।`);
  case "SECOND_EQUATION": return tx(l,`दूसरा समीकरण 2x − y = ${n[0]} है।`,`ਦੂਜਾ ਸਮੀਕਰਨ 2x − y = ${n[0]} ਹੈ।`);
  case "Y_EXACT": return tx(l,`हल में y = ${n[0]} है।`,`ਹੱਲ ਵਿੱਚ y = ${n[0]} ਹੈ।`);
  case "FULL_SYSTEM": return tx(l,`समीकरण x + y = ${n[0]} और 2x − y = ${n[1]} हैं।`,`ਸਮੀਕਰਨ x + y = ${n[0]} ਅਤੇ 2x − y = ${n[1]} ਹਨ।`);
  case "BOUND": return /at most/i.test(text)?tx(l,`दिया गया मान अधिकतम ${n[0]} है।`,`ਦਿੱਤਾ ਮੁੱਲ ਵੱਧ ਤੋਂ ਵੱਧ ${n[0]} ਹੈ।`):tx(l,`दिया गया मान कम से कम ${n[0]} है।`,`ਦਿੱਤਾ ਮੁੱਲ ਘੱਟੋ-ਘੱਟ ${n[0]} ਹੈ।`);
  case "PARITY": return tx(l,`दिया गया पूर्णांक ${even(text)?"सम":"विषम"} है।`,`ਦਿੱਤਾ ਪੂਰਨ ਅੰਕ ${even(text)?"ਜੁੜਾ":"ਬੇਜੋੜ"} ਹੈ।`);
 }
 throw new Error(`ALG unsupported family ${f}`);
}

export function localizeDsfCp019Wave02Question(laneId:string,q:AnyQuestion,l:DsfCp019Wave02Language):AnyQuestion{
 let surface:{lead:string,prompt:string,target:string}; let localize:(s:any)=>string;
 if(laneId==="DSF-QS-TIME-WORK-PIPES"){surface=tmwSurface(q,l);localize=s=>tmwStatement(s,l);}
 else if(laneId==="DSF-QS-TSD-TRAINS-BOATS"){surface=tsdSurface(q,l);localize=s=>tsdStatement(s,l);}
 else if(laneId==="DSF-QS-MIXTURE-ALLIGATION"){surface=mixSurface(q,l);localize=s=>mixStatement(s,l,q);}
 else if(laneId==="DSF-QS-MENSURATION"){surface=mensSurface(q,l);localize=s=>mensStatement(s,l);}
 else if(laneId==="DSF-QS-CORE-ENRICHMENT"){surface=coreSurface(q,l);localize=s=>coreStatement(s,l,q);}
 else if(laneId==="DSF-QS-ALGEBRA-ENRICHMENT"){surface=algSurface(q,l);localize=s=>algStatement(s,l);}
 else throw new Error(`CP019 Wave 02 unsupported lane ${laneId}`);
 const statements=(q.statements??[]).map((s:any)=>Object.freeze({...s,text:localize(s)}));
 return Object.freeze({
  ...q,
  language:l,
  locale:l==="hi"?"hi-IN":"pa-IN",
  stem:`${surface.lead} ${surface.prompt}`,
  questionPrompt:surface.prompt,
  statements:Object.freeze(statements),
  options:options(q,l),
  explanation:explanation(q,l,surface.target),
  localization:Object.freeze({
    authority:"DSF_CP019_QUANT_HI_PA_LOCALIZATION_WAVE_02_V1",
    language:l,sourceLanguage:"en",semanticParity:"SOURCE_PROOF_PRESERVED",
    correctIndexPreserved:true,canonicalAnswerPreserved:true,
    reviewOnly:true,humanLanguageReviewRequired:true,
  }),
 });
}
