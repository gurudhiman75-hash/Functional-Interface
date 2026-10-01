export type DsfCp019Language = "hi" | "pa";
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

function tx(language:DsfCp019Language, hi:string, pa:string){ return language==="hi" ? hi : pa; }
function nums(text:string){ return [...text.matchAll(/-?\d+(?:\.\d+)?/g)].map(m=>m[0]!); }

const AVG_CTX: Record<string,{hi:[string,string,string,string],pa:[string,string,string,string]}> = {
  CLASS_MARKS:{hi:["विद्यार्थी","औसत अंक","कक्षा के कुल अंक","एक कक्षा के विद्यार्थियों के अंक दिए गए हैं।"],pa:["ਵਿਦਿਆਰਥੀ","ਔਸਤ ਅੰਕ","ਕਲਾਸ ਦੇ ਕੁੱਲ ਅੰਕ","ਇੱਕ ਕਲਾਸ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕ ਦਿੱਤੇ ਗਏ ਹਨ।"]},
  CRICKET_INNINGS:{hi:["पारियाँ","बल्लेबाजी औसत","कुल रन","एक बल्लेबाज की कुछ पारियों का रिकॉर्ड दिया गया है।"],pa:["ਪਾਰੀਆਂ","ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ","ਕੁੱਲ ਦੌੜਾਂ","ਇੱਕ ਬੱਲੇਬਾਜ਼ ਦੀਆਂ ਕੁਝ ਪਾਰੀਆਂ ਦਾ ਰਿਕਾਰਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।"]},
  PARCEL_WEIGHT:{hi:["पार्सल","प्रति पार्सल औसत भार","पार्सलों का कुल भार","एक खेप में कई पार्सल हैं।"],pa:["ਪਾਰਸਲ","ਪ੍ਰਤੀ ਪਾਰਸਲ ਔਸਤ ਭਾਰ","ਪਾਰਸਲਾਂ ਦਾ ਕੁੱਲ ਭਾਰ","ਇੱਕ ਖੇਪ ਵਿੱਚ ਕਈ ਪਾਰਸਲ ਹਨ।"]},
  DAILY_SALES:{hi:["दिन","औसत दैनिक बिक्री","अवधि की कुल बिक्री","एक दुकान की कई दिनों की बिक्री दी गई है।"],pa:["ਦਿਨ","ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ","ਮਿਆਦ ਦੀ ਕੁੱਲ ਵਿਕਰੀ","ਇੱਕ ਦੁਕਾਨ ਦੀ ਕਈ ਦਿਨਾਂ ਦੀ ਵਿਕਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।"]},
  WORKER_WAGES:{hi:["मजदूर","प्रति मजदूर औसत मजदूरी","कुल मजदूरी","एक दिन के लिए मजदूरों के समूह की मजदूरी दी गई है।"],pa:["ਮਜ਼ਦੂਰ","ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਔਸਤ ਮਜ਼ਦੂਰੀ","ਕੁੱਲ ਮਜ਼ਦੂਰੀ","ਇੱਕ ਦਿਨ ਲਈ ਮਜ਼ਦੂਰਾਂ ਦੇ ਸਮੂਹ ਦੀ ਮਜ਼ਦੂਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।"]},
  BOOKS_PER_SHELF:{hi:["अलमारियाँ","प्रति अलमारी औसत पुस्तकों की संख्या","कुल पुस्तकों की संख्या","पुस्तकें कई अलमारियों में रखी गई हैं।"],pa:["ਅਲਮਾਰੀਆਂ","ਪ੍ਰਤੀ ਅਲਮਾਰੀ ਔਸਤ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ","ਕੁੱਲ ਕਿਤਾਬਾਂ ਦੀ ਗਿਣਤੀ","ਕਿਤਾਬਾਂ ਕਈ ਅਲਮਾਰੀਆਂ ਵਿੱਚ ਰੱਖੀਆਂ ਗਈਆਂ ਹਨ।"]},
};

const AGE_CTX:Record<string,[string,string,string,string]>={
  COUSINS:["Aman","Karan","अमन और करण चचेरे भाई हैं।","ਅਮਨ ਅਤੇ ਕਰਨ ਚਚੇਰੇ ਭਰਾ ਹਨ।"],
  COLLEAGUES:["Neha","Riya","नेहा और रिया सहकर्मी हैं।","ਨੇਹਾ ਅਤੇ ਰੀਆ ਸਹਿਕਰਮੀ ਹਨ।"],
  NEIGHBOURS:["Harpreet","Manpreet","हरप्रीत और मनप्रीत पड़ोसी हैं।","ਹਰਪ੍ਰੀਤ ਅਤੇ ਮਨਪ੍ਰੀਤ ਗੁਆਂਢੀ ਹਨ।"],
  PLAYERS:["Kabir","Dev","कबीर और देव एक ही क्लब के खिलाड़ी हैं।","ਕਬੀਰ ਅਤੇ ਦੇਵ ਇੱਕੋ ਕਲੱਬ ਦੇ ਖਿਡਾਰੀ ਹਨ।"],
  FRIENDS:["Simran","Mehak","सिमरन और मेहक मित्र हैं।","ਸਿਮਰਨ ਅਤੇ ਮੇਹਕ ਦੋਸਤ ਹਨ।"],
  SIBLINGS:["Arjun","Ishaan","अर्जुन और ईशान भाई हैं।","ਅਰਜੁਨ ਅਤੇ ਈਸ਼ਾਨ ਭਰਾ ਹਨ।"],
};

const PNL_CTX:Record<string,[string,string,string]>={
  BOOKSHOP:["पुस्तक सेट","ਕਿਤਾਬਾਂ ਦਾ ਸੈੱਟ","एक पुस्तक सेट की खरीद और बिक्री का विवरण दिया गया है।"],
  GARMENT_STORE:["वस्त्र","ਕੱਪੜਾ","एक वस्त्र की खरीद और बिक्री का विवरण दिया गया है।"],
  ELECTRONICS_COUNTER:["इलेक्ट्रॉनिक वस्तु","ਇਲੈਕਟ੍ਰਾਨਿਕ ਵਸਤੂ","एक इलेक्ट्रॉनिक वस्तु का मूल्य विवरण दिया गया है।"],
  FURNITURE_OUTLET:["फर्नीचर की वस्तु","ਫਰਨੀਚਰ ਦੀ ਵਸਤੂ","एक फर्नीचर वस्तु का मूल्य विवरण दिया गया है।"],
  SPORTS_SHOP:["खेल सामग्री","ਖੇਡ ਸਮੱਗਰੀ","एक खेल सामग्री की खरीद और बिक्री का विवरण दिया गया है।"],
  STATIONERY_WHOLESALER:["स्टेशनरी पैक","ਸਟੇਸ਼ਨਰੀ ਪੈਕ","एक स्टेशनरी पैक का मूल्य विवरण दिया गया है।"],
};

const PNL_PA_LEAD:Record<string,string>={
  BOOKSHOP:"ਇੱਕ ਕਿਤਾਬਾਂ ਦੇ ਸੈੱਟ ਦੀ ਖਰੀਦ ਅਤੇ ਵਿਕਰੀ ਦਾ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  GARMENT_STORE:"ਇੱਕ ਕੱਪੜੇ ਦੀ ਖਰੀਦ ਅਤੇ ਵਿਕਰੀ ਦਾ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  ELECTRONICS_COUNTER:"ਇੱਕ ਇਲੈਕਟ੍ਰਾਨਿਕ ਵਸਤੂ ਦਾ ਮੁੱਲ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  FURNITURE_OUTLET:"ਇੱਕ ਫਰਨੀਚਰ ਵਸਤੂ ਦਾ ਮੁੱਲ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  SPORTS_SHOP:"ਇੱਕ ਖੇਡ ਸਮੱਗਰੀ ਦੀ ਖਰੀਦ ਅਤੇ ਵਿਕਰੀ ਦਾ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  STATIONERY_WHOLESALER:"ਇੱਕ ਸਟੇਸ਼ਨਰੀ ਪੈਕ ਦਾ ਮੁੱਲ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
};

function averageSurface(q:AnyQuestion,l:DsfCp019Language){
  const ctx=AVG_CTX[String(q.contextId)] ?? AVG_CTX.CLASS_MARKS!;
  const [countNoun,avgNoun,totalNoun,lead]=ctx[l];
  const target=String(q.targetKind)==="TOTAL" ? totalNoun : avgNoun;
  return {lead,prompt:tx(l,`${target} कितना है?`,`${target} ਕਿੰਨਾ ਹੈ?`),countNoun,avgNoun,totalNoun};
}

function averageStatement(s:any,l:DsfCp019Language,q:AnyQuestion){
  const a=averageSurface(q,l); const n=nums(String(s.text)); const f=String(s.statementFamily);
  switch(f){
    case "COUNT_EXACT": return tx(l,`कुल ${n[0]} ${a.countNoun} हैं।`,`ਕੁੱਲ ${n[0]} ${a.countNoun} ਹਨ।`);
    case "AVERAGE_EXACT": return tx(l,`${a.avgNoun} ${n[0]} है।`,`${a.avgNoun} ${n[0]} ਹੈ।`);
    case "TOTAL_EXACT": return tx(l,`${a.totalNoun} ${n[0]} है।`,`${a.totalNoun} ${n[0]} ਹੈ।`);
    case "COUNT_AVERAGE_PAIR": return tx(l,`कुल ${n[0]} ${a.countNoun} हैं और ${a.avgNoun} ${n[1]} है।`,`ਕੁੱਲ ${n[0]} ${a.countNoun} ਹਨ ਅਤੇ ${a.avgNoun} ${n[1]} ਹੈ।`);
    case "COUNT_TOTAL_PAIR": return tx(l,`कुल ${n[0]} ${a.countNoun} हैं और ${a.totalNoun} ${n[1]} है।`,`ਕੁੱਲ ${n[0]} ${a.countNoun} ਹਨ ਅਤੇ ${a.totalNoun} ${n[1]} ਹੈ।`);
    case "COUNT_BOUND": return /greater/i.test(s.text) ? tx(l,`${a.countNoun} की संख्या ${n[0]} से अधिक है।`,`${a.countNoun} ਦੀ ਗਿਣਤੀ ${n[0]} ਤੋਂ ਵੱਧ ਹੈ।`) : tx(l,`${a.countNoun} की संख्या ${n[0]} से कम है।`,`${a.countNoun} ਦੀ ਗਿਣਤੀ ${n[0]} ਤੋਂ ਘੱਟ ਹੈ।`);
    case "AVERAGE_BOUND": return /greater/i.test(s.text) ? tx(l,`${a.avgNoun} ${n[0]} से अधिक है।`,`${a.avgNoun} ${n[0]} ਤੋਂ ਵੱਧ ਹੈ।`) : tx(l,`${a.avgNoun} ${n[0]} से कम है।`,`${a.avgNoun} ${n[0]} ਤੋਂ ਘੱਟ ਹੈ।`);
    case "TOTAL_BOUND": return /greater/i.test(s.text) ? tx(l,`${a.totalNoun} ${n[0]} से अधिक है।`,`${a.totalNoun} ${n[0]} ਤੋਂ ਵੱਧ ਹੈ।`) : tx(l,`${a.totalNoun} ${n[0]} से कम है।`,`${a.totalNoun} ${n[0]} ਤੋਂ ਘੱਟ ਹੈ।`);
    case "PARITY": return tx(l,`${a.countNoun} की संख्या ${/even/i.test(s.text)?"सम":"विषम"} है।`,`${a.countNoun} ਦੀ ਗਿਣਤੀ ${/even/i.test(s.text)?"ਜੁੜੀ":"ਬੇਜੋੜ"} ਹੈ।`);
  }
  throw new Error(`AVG unsupported family ${f}`);
}

function ageNames(q:AnyQuestion,l:DsfCp019Language){
  const c=AGE_CTX[String(q.contextId)] ?? AGE_CTX.COUSINS!;
  const target=String(q.targetKind)==="PERSON_A_AGE" ? c[0] : c[1];
  return {a:c[0],b:c[1],lead:l==="hi"?c[2]:c[3],target};
}
function ageStatement(s:any,l:DsfCp019Language,q:AnyQuestion){
  const c=ageNames(q,l), n=nums(String(s.text)), f=String(s.statementFamily), text=String(s.text);
  const person=(text.includes(c.a)?c.a:(text.includes(c.b)?c.b:c.target));
  switch(f){
    case "PRESENT_RATIO": return tx(l,`${c.a} और ${c.b} की वर्तमान आयु का अनुपात ${n[0]}:${n[1]} है।`,`${c.a} ਅਤੇ ${c.b} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${n[0]}:${n[1]} ਹੈ।`);
    case "PRESENT_SUM": return tx(l,`उनकी वर्तमान आयु का योग ${n[0]} वर्ष है।`,`ਉਨ੍ਹਾਂ ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਜੋੜ ${n[0]} ਸਾਲ ਹੈ।`);
    case "AGE_DIFFERENCE": return tx(l,`उनकी वर्तमान आयु में ${n[0]} वर्ष का अंतर है।`,`ਉਨ੍ਹਾਂ ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਵਿੱਚ ${n[0]} ਸਾਲ ਦਾ ਫਰਕ ਹੈ।`);
    case "EXACT_AGE": return tx(l,`${person} की वर्तमान आयु ${n[0]} वर्ष है।`,`${person} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${n[0]} ਸਾਲ ਹੈ।`);
    case "FUTURE_RATIO": return tx(l,`${n[0]} वर्ष बाद ${c.a} और ${c.b} की आयु का अनुपात ${n[1]}:${n[2]} होगा।`,`${n[0]} ਸਾਲ ਬਾਅਦ ${c.a} ਅਤੇ ${c.b} ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${n[1]}:${n[2]} ਹੋਵੇਗਾ।`);
    case "PAST_RATIO": return tx(l,`${n[0]} वर्ष पहले ${c.a} और ${c.b} की आयु का अनुपात ${n[1]}:${n[2]} था।`,`${n[0]} ਸਾਲ ਪਹਿਲਾਂ ${c.a} ਅਤੇ ${c.b} ਦੀ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${n[1]}:${n[2]} ਸੀ।`);
    case "BOUND": return /greater/i.test(text) ? tx(l,`${c.target} की वर्तमान आयु ${n[0]} वर्ष से अधिक है।`,`${c.target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${n[0]} ਸਾਲ ਤੋਂ ਵੱਧ ਹੈ।`) : tx(l,`${c.target} की वर्तमान आयु ${n[0]} वर्ष से कम है।`,`${c.target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${n[0]} ਸਾਲ ਤੋਂ ਘੱਟ ਹੈ।`);
    case "PARITY": return tx(l,`${c.target} की वर्तमान आयु ${/even/i.test(text)?"सम":"विषम"} संख्या है।`,`${c.target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ${/even/i.test(text)?"ਜੁੜੀ":"ਬੇਜੋੜ"} ਗਿਣਤੀ ਹੈ।`);
    case "COMPARISON": { const first=text.startsWith(c.a)?c.a:c.b, second=first===c.a?c.b:c.a; return tx(l,`${first}, ${second} से बड़ा है।`,`${first}, ${second} ਨਾਲੋਂ ਵੱਡਾ ਹੈ।`); }
    case "RATIO_SUM_PAIR": return tx(l,`उनकी वर्तमान आयु का अनुपात ${n[0]}:${n[1]} है और योग ${n[2]} वर्ष है।`,`ਉਨ੍ਹਾਂ ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${n[0]}:${n[1]} ਹੈ ਅਤੇ ਜੋੜ ${n[2]} ਸਾਲ ਹੈ।`);
    case "RATIO_DIFFERENCE_PAIR": return tx(l,`उनकी वर्तमान आयु का अनुपात ${n[0]}:${n[1]} है और अंतर ${n[2]} वर्ष है।`,`ਉਨ੍ਹਾਂ ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਦਾ ਅਨੁਪਾਤ ${n[0]}:${n[1]} ਹੈ ਅਤੇ ਫਰਕ ${n[2]} ਸਾਲ ਹੈ।`);
  }
  throw new Error(`AGES unsupported family ${f}`);
}

function pnlSurface(q:AnyQuestion,l:DsfCp019Language){
  const c=PNL_CTX[String(q.contextId)] ?? PNL_CTX.BOOKSHOP!;
  const item=l==="hi"?c[0]:c[1]; const lead=l==="hi"?c[2]:PNL_PA_LEAD[String(q.contextId)]!;
  const k=String(q.targetKind);
  const prompt = k==="SELLING_PRICE" ? tx(l,`${item} का विक्रय मूल्य कितना है?`,`${item} ਦਾ ਵਿਕਰੀ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`)
    : k==="COST_PRICE" ? tx(l,`${item} का क्रय मूल्य कितना है?`,`${item} ਦਾ ਖਰੀਦ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`)
    : k==="PROFIT_LOSS_RATE" ? tx(l,`${item} पर लाभ या हानि प्रतिशत कितना है?`,`${item} ਉੱਤੇ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?`)
    : k==="DISCOUNT_SELLING_PRICE" ? tx(l,`छूट के बाद ${item} का विक्रय मूल्य कितना है?`,`ਛੂਟ ਤੋਂ ਬਾਅਦ ${item} ਦਾ ਵਿਕਰੀ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`)
    : k==="DISCOUNT_PERCENT" ? tx(l,`${item} पर कितने प्रतिशत छूट दी गई है?`,`${item} ਉੱਤੇ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਛੂਟ ਦਿੱਤੀ ਗਈ ਹੈ?`)
    : tx(l,`${item} का अंकित मूल्य कितना है?`,`${item} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`);
  return {item,lead,prompt};
}
function pnlStatement(s:any,l:DsfCp019Language,q:AnyQuestion){
 const {item}=pnlSurface(q,l); const f=String(s.statementFamily), id=String(s.statementRuleId), n=nums(String(s.text)); const text=String(s.text);
 const gain=/PROFIT|profit/i.test(id+" "+text); const rateWord=tx(l,gain?"लाभ":"हानि",gain?"ਲਾਭ":"ਘਾਟਾ");
 const gt=/greater/i.test(text);
 switch(f){
  case "COST_PRICE_EXACT": return tx(l,`${item} का क्रय मूल्य ₹${n[0]} है।`,`${item} ਦਾ ਖਰੀਦ ਮੁੱਲ ₹${n[0]} ਹੈ।`);
  case "SELLING_PRICE_EXACT": return /discount/i.test(text)?tx(l,`छूट के बाद ${item} ₹${n[0]} में बेचा गया।`,`ਛੂਟ ਤੋਂ ਬਾਅਦ ${item} ₹${n[0]} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ।`):tx(l,`${item} का विक्रय मूल्य ₹${n[0]} है।`,`${item} ਦਾ ਵਿਕਰੀ ਮੁੱਲ ₹${n[0]} ਹੈ।`);
  case "RATE_EXACT": return tx(l,`${item} को ${n[0]}% ${rateWord} पर बेचा गया।`,`${item} ਨੂੰ ${n[0]}% ${rateWord} 'ਤੇ ਵੇਚਿਆ ਗਿਆ।`);
  case "DIRECTION_ONLY": return tx(l,`${item} की बिक्री में ${rateWord} होता है।`,`${item} ਦੀ ਵਿਕਰੀ ਵਿੱਚ ${rateWord} ਹੁੰਦਾ ਹੈ।`);
  case "COST_RATE_PAIR": return tx(l,`क्रय मूल्य ₹${n[0]} है और ${item} को ${n[1]}% ${rateWord} पर बेचा गया।`,`ਖਰੀਦ ਮੁੱਲ ₹${n[0]} ਹੈ ਅਤੇ ${item} ਨੂੰ ${n[1]}% ${rateWord} 'ਤੇ ਵੇਚਿਆ ਗਿਆ।`);
  case "SELLING_RATE_PAIR": return tx(l,`विक्रय मूल्य ₹${n[0]} है और सौदे में ${n[1]}% ${rateWord} होता है।`,`ਵਿਕਰੀ ਮੁੱਲ ₹${n[0]} ਹੈ ਅਤੇ ਸੌਦੇ ਵਿੱਚ ${n[1]}% ${rateWord} ਹੁੰਦਾ ਹੈ।`);
  case "COST_SELLING_PAIR": return tx(l,`${item} का क्रय मूल्य ₹${n[0]} और विक्रय मूल्य ₹${n[1]} है।`,`${item} ਦਾ ਖਰੀਦ ਮੁੱਲ ₹${n[0]} ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ₹${n[1]} ਹੈ।`);
  case "COST_PRICE_BOUND": return tx(l,`${item} का क्रय मूल्य ₹${n[0]} से ${gt?"अधिक":"कम"} है।`,`${item} ਦਾ ਖਰੀਦ ਮੁੱਲ ₹${n[0]} ਤੋਂ ${gt?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
  case "SELLING_PRICE_BOUND": return tx(l,`${/post-discount/i.test(text)?"छूट के बाद ":""}विक्रय मूल्य ₹${n[0]} से ${gt?"अधिक":"कम"} है।`,`${/post-discount/i.test(text)?"ਛੂਟ ਤੋਂ ਬਾਅਦ ":""}ਵਿਕਰੀ ਮੁੱਲ ₹${n[0]} ਤੋਂ ${gt?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
  case "RATE_BOUND": return tx(l,`सौदे में ${rateWord} है और ${rateWord} की दर ${n[0]}% से ${gt?"अधिक":"कम"} है।`,`ਸੌਦੇ ਵਿੱਚ ${rateWord} ਹੈ ਅਤੇ ${rateWord} ਦੀ ਦਰ ${n[0]}% ਤੋਂ ${gt?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
  case "COST_PRICE_CONGRUENCE": return tx(l,`क्रय मूल्य को ₹200 से भाग देने पर वही शेष मिलता है जो ₹${n[n.length-1]} को भाग देने पर मिलता है।`,`ਖਰੀਦ ਮੁੱਲ ਨੂੰ ₹200 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਉਹੀ ਬਾਕੀ ਮਿਲਦਾ ਹੈ ਜੋ ₹${n[n.length-1]} ਨੂੰ ਭਾਗ ਦੇਣ 'ਤੇ ਮਿਲਦਾ ਹੈ।`);
  case "MARKED_PRICE_EXACT": return tx(l,`${item} का अंकित मूल्य ₹${n[0]} है।`,`${item} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹${n[0]} ਹੈ।`);
  case "DISCOUNT_EXACT": return tx(l,`अंकित मूल्य पर ${n[0]}% छूट दी गई है।`,`ਅੰਕਿਤ ਮੁੱਲ 'ਤੇ ${n[0]}% ਛੂਟ ਦਿੱਤੀ ਗਈ ਹੈ।`);
  case "MARKED_DISCOUNT_PAIR": return tx(l,`अंकित मूल्य ₹${n[0]} है और छूट ${n[1]}% है।`,`ਅੰਕਿਤ ਮੁੱਲ ₹${n[0]} ਹੈ ਅਤੇ ਛੂਟ ${n[1]}% ਹੈ।`);
  case "SELLING_DISCOUNT_PAIR": return tx(l,`${n[1]}% छूट के बाद ${item} ₹${n[0]} में बिकता है।`,`${n[1]}% ਛੂਟ ਤੋਂ ਬਾਅਦ ${item} ₹${n[0]} ਵਿੱਚ ਵਿਕਦਾ ਹੈ।`);
  case "MARKED_SELLING_PAIR": return tx(l,`अंकित मूल्य ₹${n[0]} और छूट के बाद विक्रय मूल्य ₹${n[1]} है।`,`ਅੰਕਿਤ ਮੁੱਲ ₹${n[0]} ਅਤੇ ਛੂਟ ਤੋਂ ਬਾਅਦ ਵਿਕਰੀ ਮੁੱਲ ₹${n[1]} ਹੈ।`);
  case "MARKED_PRICE_BOUND": return tx(l,`${item} का अंकित मूल्य ₹${n[0]} से ${gt?"अधिक":"कम"} है।`,`${item} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹${n[0]} ਤੋਂ ${gt?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
  case "DISCOUNT_BOUND": return tx(l,`छूट ${n[0]}% से ${gt?"अधिक":"कम"} है।`,`ਛੂਟ ${n[0]}% ਤੋਂ ${gt?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
  case "DISCOUNT_CONGRUENCE": return tx(l,`छूट प्रतिशत को 10 से भाग देने पर शेष ${n[0]} है।`,`ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ 10 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ${n[0]} ਹੈ।`);
 }
 throw new Error(`PNL unsupported family ${f}`);
}

function interestSurface(q:AnyQuestion,l:DsfCp019Language){
 const k=String(q.targetKind);
 const prompt=k==="SIMPLE_INTEREST"?tx(l,"पूरी अवधि का साधारण ब्याज कितना है?","ਪੂਰੀ ਮਿਆਦ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?")
 :k==="COMPOUND_INTEREST"?tx(l,"वार्षिक चक्रवृद्धि पर पूरी अवधि का चक्रवृद्धि ब्याज कितना है?","ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਨੁਸਾਰ ਪੂਰੀ ਮਿਆਦ ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?")
 :k==="COMPOUND_AMOUNT"?tx(l,"वार्षिक चक्रवृद्धि पर अंतिम राशि कितनी है?","ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਨੁਸਾਰ ਅੰਤਿਮ ਰਕਮ ਕਿੰਨੀ ਹੈ?")
 :tx(l,"पूरी अवधि में चक्रवृद्धि ब्याज, साधारण ब्याज से कितना अधिक है?","ਪੂਰੀ ਮਿਆਦ ਵਿੱਚ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੈ?");
 return {lead:tx(l,"एक निवेश के मूलधन, ब्याज दर और अवधि का विवरण दिया गया है।","ਇੱਕ ਨਿਵੇਸ਼ ਦੇ ਮੂਲਧਨ, ਵਿਆਜ ਦਰ ਅਤੇ ਮਿਆਦ ਦਾ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।"),prompt};
}
function interestStatement(s:any,l:DsfCp019Language){
 const f=String(s.statementFamily), n=nums(String(s.text)), text=String(s.text), gt=/greater|at least/i.test(text);
 switch(f){
  case "PRINCIPAL_EXACT": return tx(l,`मूलधन ₹${n[0]} है।`,`ਮੂਲਧਨ ₹${n[0]} ਹੈ।`);
  case "RATE_EXACT": return tx(l,`वार्षिक ब्याज दर ${n[0]}% है।`,`ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${n[0]}% ਹੈ।`);
  case "TIME_EXACT": return tx(l,`निवेश अवधि ${n[0]} वर्ष है।`,`ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ${n[0]} ਸਾਲ ਹੈ।`);
  case "SIMPLE_INTEREST_EXACT": return tx(l,`पूरी अवधि का साधारण ब्याज ₹${n[0]} है।`,`ਪੂਰੀ ਮਿਆਦ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ₹${n[0]} ਹੈ।`);
  case "COMPOUND_INTEREST_EXACT": return tx(l,`वार्षिक चक्रवृद्धि पर पूरी अवधि का चक्रवृद्धि ब्याज ₹${n[0]} है।`,`ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਨੁਸਾਰ ਪੂਰੀ ਮਿਆਦ ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ₹${n[0]} ਹੈ।`);
  case "COMPOUND_AMOUNT_EXACT": return tx(l,`वार्षिक चक्रवृद्धि पर अंतिम राशि ₹${n[0]} है।`,`ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਨੁਸਾਰ ਅੰਤਿਮ ਰਕਮ ₹${n[0]} ਹੈ।`);
  case "DIFFERENCE_EXACT": return tx(l,`पूरी अवधि में चक्रवृद्धि ब्याज, साधारण ब्याज से ₹${n[0]} अधिक है।`,`ਪੂਰੀ ਮਿਆਦ ਵਿੱਚ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ₹${n[0]} ਵੱਧ ਹੈ।`);
  case "PRINCIPAL_RATE_PAIR": return tx(l,`मूलधन ₹${n[0]} और वार्षिक ब्याज दर ${n[1]}% है।`,`ਮੂਲਧਨ ₹${n[0]} ਅਤੇ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${n[1]}% ਹੈ।`);
  case "PRINCIPAL_TIME_PAIR": return tx(l,`मूलधन ₹${n[0]} और अवधि ${n[1]} वर्ष है।`,`ਮੂਲਧਨ ₹${n[0]} ਅਤੇ ਮਿਆਦ ${n[1]} ਸਾਲ ਹੈ।`);
  case "RATE_TIME_PAIR": return tx(l,`वार्षिक ब्याज दर ${n[0]}% और अवधि ${n[1]} वर्ष है।`,`ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${n[0]}% ਅਤੇ ਮਿਆਦ ${n[1]} ਸਾਲ ਹੈ।`);
  case "FULL_PARAMETER_TRIPLE": return tx(l,`मूलधन ₹${n[0]}, वार्षिक ब्याज दर ${n[1]}% और अवधि ${n[2]} वर्ष है।`,`ਮੂਲਧਨ ₹${n[0]}, ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${n[1]}% ਅਤੇ ਮਿਆਦ ${n[2]} ਸਾਲ ਹੈ।`);
  case "PRINCIPAL_BOUND": return tx(l,`मूलधन ₹${n[0]} से ${gt?"अधिक":"कम"} है।`,`ਮੂਲਧਨ ₹${n[0]} ਤੋਂ ${gt?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
  case "RATE_BOUND": return tx(l,`वार्षिक ब्याज दर ${n[0]}% से ${gt?"अधिक":"कम"} है।`,`ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${n[0]}% ਤੋਂ ${gt?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`);
  case "TIME_BOUND": return /less/i.test(text)?tx(l,"निवेश अवधि 3 वर्ष से कम है।","ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ 3 ਸਾਲ ਤੋਂ ਘੱਟ ਹੈ।"):tx(l,"निवेश अवधि कम से कम 2 वर्ष है।","ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ਘੱਟੋ-ਘੱਟ 2 ਸਾਲ ਹੈ।");
 }
 throw new Error(`INT unsupported family ${f}`);
}

function explanation(q:AnyQuestion,l:DsfCp019Language){
 const proof=q.proof??{}; const cls=String(q.canonicalAnswer??"");
 const line=(label:string,worlds:number|undefined,answers:any[],sufficient:boolean)=>{
  const values=(answers??[]).slice(0,2).join(tx(l," और "," ਅਤੇ "));
  return sufficient
   ? tx(l,`${label} से मांगा गया मान निश्चित हो जाता है${values?`: ${values}`:""}।`,`${label} ਨਾਲ ਮੰਗਿਆ ਗਿਆ ਮੁੱਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ${values?`: ${values}`:""}।`)
   : tx(l,`${label} अकेले पर्याप्त नहीं है${values?`; ${values} जैसे अलग मान संभव हैं`:""}।`,`${label} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ${values?`; ${values} ਵਰਗੇ ਵੱਖਰੇ ਮੁੱਲ ਸੰਭਵ ਹਨ`:""}।`);
 };
 const s1=cls==="STATEMENT_I_ONLY" || cls==="EACH_STATEMENT_ALONE";
 const s2=cls==="STATEMENT_II_ONLY" || cls==="EACH_STATEMENT_ALONE";
 const st=cls!=="INSUFFICIENT_EVEN_TOGETHER";
 return [
  tx(l,"पहले दोनों कथनों को अलग-अलग जाँचते हैं।","ਪਹਿਲਾਂ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚਦੇ ਹਾਂ।"),
  line(tx(l,"कथन I","ਕਥਨ I"),proof.statementIWorldCount,proof.statementITargetAnswers,s1),
  line(tx(l,"कथन II","ਕਥਨ II"),proof.statementIIWorldCount,proof.statementIITargetAnswers,s2),
  line(tx(l,"दोनों कथन साथ लेने पर","ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ 'ਤੇ"),proof.togetherWorldCount,proof.togetherTargetAnswers,st),
  tx(l,`अतः सही विकल्प: ${OPTIONS.hi[cls as keyof typeof OPTIONS.hi]??cls}`,`ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ: ${OPTIONS.pa[cls as keyof typeof OPTIONS.pa]??cls}`),
 ].join(" ");
}

export function localizeDsfCp019QuantQuestion(laneId:string,q:AnyQuestion,l:DsfCp019Language):AnyQuestion{
 let surface:{lead:string,prompt:string}; let localizeStatement:(s:any)=>string;
 if(laneId==="DSF-QS-AVERAGE"){ const a=averageSurface(q,l); surface={lead:a.lead,prompt:a.prompt}; localizeStatement=(s)=>averageStatement(s,l,q); }
 else if(laneId==="DSF-QS-AGES"){ const a=ageNames(q,l); surface={lead:a.lead,prompt:tx(l,`${a.target} की वर्तमान आयु कितनी है?`,`${a.target} ਦੀ ਮੌਜੂਦਾ ਉਮਰ ਕਿੰਨੀ ਹੈ?`)}; localizeStatement=(s)=>ageStatement(s,l,q); }
 else if(laneId==="DSF-QS-PROFIT-LOSS-DISCOUNT"){ surface=pnlSurface(q,l); localizeStatement=(s)=>pnlStatement(s,l,q); }
 else if(laneId==="DSF-QS-INTEREST"){ surface=interestSurface(q,l); localizeStatement=(s)=>interestStatement(s,l); }
 else throw new Error(`CP019 unsupported lane ${laneId}`);
 const statements=(q.statements??[]).map((s:any)=>Object.freeze({...s,text:localizeStatement(s)}));
 const options=(q.options??[]).map((o:any)=>Object.freeze({...o,value:OPTIONS[l][String(o.semanticClass) as keyof typeof OPTIONS.hi]}));
 if(options.some((o:any)=>!o.value)) throw new Error(`${laneId}: unsupported sufficiency option`);
 return Object.freeze({
   ...q, language:l, locale:l==="hi"?"hi-IN":"pa-IN",
   stem:`${surface.lead} ${surface.prompt}`,
   questionPrompt:surface.prompt,
   statements:Object.freeze(statements),
   options:Object.freeze(options),
   explanation:explanation(q,l),
   localization:Object.freeze({
     authority:"DSF_CP019_QUANT_HI_PA_LOCALIZATION_WAVE_01_V1",
     language:l, sourceLanguage:"en", semanticParity:"SOURCE_PROOF_PRESERVED",
     correctIndexPreserved:true, canonicalAnswerPreserved:true,
     reviewOnly:true, humanLanguageReviewRequired:true,
   }),
 });
}
