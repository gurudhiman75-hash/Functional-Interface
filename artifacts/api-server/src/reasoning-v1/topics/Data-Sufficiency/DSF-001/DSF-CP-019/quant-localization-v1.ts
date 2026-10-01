export type DsfQuantLocalizedLanguage = "hi" | "pa";
type AnyQuestion = Readonly<Record<string, any>>;

const OPTION_TEXT = {
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

function t(language:DsfQuantLocalizedLanguage, hi:string, pa:string){ return language==="hi" ? hi : pa; }

const REPLACEMENTS: readonly [string,string,string][] = [
  ["compound interest for the full period if interest is compounded annually","पूरी अवधि का वार्षिक चक्रवृद्धि ब्याज","ਪੂਰੀ ਮਿਆਦ ਦਾ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ"],
  ["compound interest for the full period","पूरी अवधि का चक्रवृद्धि ब्याज","ਪੂਰੀ ਮਿਆਦ ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ"],
  ["simple interest for the full period","पूरी अवधि का साधारण ब्याज","ਪੂਰੀ ਮਿਆਦ ਦਾ ਸਧਾਰਣ ਵਿਆਜ"],
  ["with annual compounding","वार्षिक चक्रवृद्धि पर","ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਨਾਲ"],
  ["average number of books per shelf","प्रति शेल्फ पुस्तकों की औसत संख्या","ਪ੍ਰਤੀ ਸ਼ੈਲਫ਼ ਕਿਤਾਬਾਂ ਦੀ ਔਸਤ ਗਿਣਤੀ"],
  ["combined weight of the parcels","पार्सलों का कुल वजन","ਪਾਰਸਲਾਂ ਦਾ ਕੁੱਲ ਵਜ਼ਨ"],
  ["average weight per parcel","प्रति पार्सल औसत वजन","ਪ੍ਰਤੀ ਪਾਰਸਲ ਔਸਤ ਵਜ਼ਨ"],
  ["total marks scored by the class","कक्षा के कुल अंक","ਕਲਾਸ ਦੇ ਕੁੱਲ ਅੰਕ"],
  ["average wage per worker","प्रति मजदूर औसत मजदूरी","ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਔਸਤ ਮਜ਼ਦੂਰੀ"],
  ["total sales over the period","अवधि की कुल बिक्री","ਮਿਆਦ ਦੀ ਕੁੱਲ ਵਿਕਰੀ"],
  ["average daily sales","औसत दैनिक बिक्री","ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ"],
  ["total number of books","पुस्तकों की कुल संख्या","ਕਿਤਾਬਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ"],
  ["total wage bill","कुल मजदूरी","ਕੁੱਲ ਮਜ਼ਦੂਰੀ"],
  ["batting average","बल्लेबाजी औसत","ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ"],
  ["total runs scored","कुल बनाए गए रन","ਕੁੱਲ ਬਣਾਏ ਰਨ"],
  ["average mark","औसत अंक","ਔਸਤ ਅੰਕ"],
  ["how many","कितने","ਕਿੰਨੇ"], ["how much","कितना","ਕਿੰਨਾ"], ["how long","कितना समय","ਕਿੰਨਾ ਸਮਾਂ"],
  ["cost price","क्रय मूल्य","ਖਰੀਦ ਮੁੱਲ"], ["selling price","विक्रय मूल्य","ਵਿਕਰੀ ਮੁੱਲ"],
  ["marked price","अंकित मूल्य","ਅੰਕਿਤ ਮੁੱਲ"], ["discount rate","छूट की दर","ਛੂਟ ਦੀ ਦਰ"],
  ["profit rate","लाभ प्रतिशत","ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ"], ["loss rate","हानि प्रतिशत","ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ"],
  ["simple interest","साधारण ब्याज","ਸਧਾਰਣ ਵਿਆਜ"], ["compound interest","चक्रवृद्धि ब्याज","ਚੱਕਰਵੱਧੀ ਵਿਆਜ"],
  ["final amount","अंतिम राशि","ਅੰਤਿਮ ਰਕਮ"], ["annual rate","वार्षिक ब्याज दर","ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ"],
  ["investment period","निवेश अवधि","ਨਿਵੇਸ਼ ਮਿਆਦ"], ["principal","मूलधन","ਮੂਲਧਨ"],
  ["work rate","कार्य दर","ਕੰਮ ਦੀ ਦਰ"], ["time taken","लगा समय","ਲੱਗਿਆ ਸਮਾਂ"],
  ["number of workers","मजदूरों की संख्या","ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ"], ["efficiency","कार्य-दक्षता","ਕੰਮ ਦੀ ਸਮਰੱਥਾ"],
  ["inlet pipe","प्रवेश पाइप","ਭਰਨ ਵਾਲੀ ਪਾਈਪ"], ["outlet pipe","निकास पाइप","ਖਾਲੀ ਕਰਨ ਵਾਲੀ ਪਾਈਪ"],
  ["average speed","औसत गति","ਔਸਤ ਰਫ਼ਤਾਰ"], ["relative speed","सापेक्ष गति","ਸਾਪੇਖ ਰਫ਼ਤਾਰ"],
  ["total distance","कुल दूरी","ਕੁੱਲ ਦੂਰੀ"], ["distance travelled","तय दूरी","ਤੈਅ ਕੀਤੀ ਦੂਰੀ"],
  ["upstream","धारा के विरुद्ध","ਧਾਰਾ ਦੇ ਵਿਰੁੱਧ"], ["downstream","धारा के साथ","ਧਾਰਾ ਦੇ ਨਾਲ"],
  ["quantity of the mixture","मिश्रण की मात्रा","ਮਿਸ਼ਰਣ ਦੀ ਮਾਤਰਾ"], ["concentration","सांद्रता","ਸੰਘਣਾਪਣ"],
  ["area of the triangle","त्रिभुज का क्षेत्रफल","ਤਿਕੋਣ ਦਾ ਖੇਤਰਫਲ"],
  ["area of the rectangle","आयत का क्षेत्रफल","ਆਇਤ ਦਾ ਖੇਤਰਫਲ"],
  ["perimeter of the rectangle","आयत का परिमाप","ਆਇਤ ਦਾ ਘੇਰਾ"],
  ["area of the circle","वृत्त का क्षेत्रफल","ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ"],
  ["circumference of the circle","वृत्त की परिधि","ਵ੍ਰਿਤ ਦੀ ਪਰਿਧੀ"],
  ["volume of the square pyramid","वर्गाकार पिरामिड का आयतन","ਵਰਗਾਕਾਰ ਪਿਰਾਮਿਡ ਦਾ ਆਇਤਨ"],
  ["volume of the conical frustum","शंकु-खंड का आयतन","ਸ਼ੰਕੂ-ਖੰਡ ਦਾ ਆਇਤਨ"],
  ["present age","वर्तमान आयु","ਮੌਜੂਦਾ ਉਮਰ"], ["current age","वर्तमान आयु","ਮੌਜੂਦਾ ਉਮਰ"],
  ["years ago","वर्ष पहले","ਸਾਲ ਪਹਿਲਾਂ"], ["years from now","वर्ष बाद","ਸਾਲ ਬਾਅਦ"],
  ["square pyramid","वर्गाकार पिरामिड","ਵਰਗਾਕਾਰ ਪਿਰਾਮਿਡ"], ["conical frustum","शंकु-खंड","ਸ਼ੰਕੂ-ਖੰਡ"],
  ["greater than","से अधिक","ਤੋਂ ਵੱਧ"], ["less than","से कम","ਤੋਂ ਘੱਟ"],
  ["at least","कम से कम","ਘੱਟੋ-ਘੱਟ"], ["at most","अधिकतम","ਵੱਧ ਤੋਂ ਵੱਧ"],
  ["exactly","ठीक","ਬਿਲਕੁਲ"],
  ["triangle","त्रिभुज","ਤਿਕੋਣ"], ["rectangle","आयत","ਆਇਤ"], ["circle","वृत्त","ਵ੍ਰਿਤ"],
  ["length","लंबाई","ਲੰਬਾਈ"], ["breadth","चौड़ाई","ਚੌੜਾਈ"], ["height","ऊँचाई","ਉਚਾਈ"],
  ["radius","त्रिज्या","ਅਰਧ-ਵਿਆਸ"], ["diameter","व्यास","ਵਿਆਸ"],
  ["mixture","मिश्रण","ਮਿਸ਼ਰਣ"], ["alligation","मिश्रण अनुपात","ਮਿਸ਼ਰਣ ਅਨੁਪਾਤ"],
  ["train","रेलगाड़ी","ਰੇਲਗੱਡੀ"], ["boat","नाव","ਕਿਸ਼ਤੀ"], ["stream","धारा","ਧਾਰਾ"],
  ["speed","गति","ਰਫ਼ਤਾਰ"], ["distance","दूरी","ਦੂਰੀ"], ["time","समय","ਸਮਾਂ"],
  ["tank","टंकी","ਟੈਂਕੀ"], ["workers","मजदूर","ਮਜ਼ਦੂਰ"], ["students","विद्यार्थी","ਵਿਦਿਆਰਥੀ"],
  ["parcels","पार्सल","ਪਾਰਸਲ"], ["innings","पारियाँ","ਪਾਰੀਆਂ"], ["shelves","शेल्फ","ਸ਼ੈਲਫ਼"],
  ["books","पुस्तकें","ਕਿਤਾਬਾਂ"], ["sales","बिक्री","ਵਿਕਰੀ"], ["wages","मजदूरी","ਮਜ਼ਦੂਰੀ"],
  ["interest","ब्याज","ਵਿਆਜ"], ["area","क्षेत्रफल","ਖੇਤਰਫਲ"], ["volume","आयतन","ਆਇਤਨ"],
  ["perimeter","परिमाप","ਘੇਰਾ"], ["circumference","परिधि","ਪਰਿਧੀ"], ["price","मूल्य","ਮੁੱਲ"],
  ["profit","लाभ","ਲਾਭ"], ["loss","हानि","ਘਾਟਾ"], ["discount","छूट","ਛੂਟ"],
  ["amount","राशि","ਰਕਮ"], ["rate","दर","ਦਰ"], ["years","वर्ष","ਸਾਲ"], ["year","वर्ष","ਸਾਲ"],
  ["age","आयु","ਉਮਰ"], ["older","बड़ा","ਵੱਡਾ"], ["younger","छोटा","ਛੋਟਾ"],
  ["ratio","अनुपात","ਅਨੁਪਾਤ"], ["percentage","प्रतिशत","ਪ੍ਰਤੀਸ਼ਤ"], ["percent","प्रतिशत","ਪ੍ਰਤੀਸ਼ਤ"],
  ["average","औसत","ਔਸਤ"], ["total","कुल","ਕੁੱਲ"], ["number","संख्या","ਗਿਣਤੀ"],
  ["is equal to","के बराबर है","ਦੇ ਬਰਾਬਰ ਹੈ"], ["is greater than","से अधिक है","ਤੋਂ ਵੱਧ ਹੈ"],
  ["is less than","से कम है","ਤੋਂ ਘੱਟ ਹੈ"], ["and","और","ਅਤੇ"], ["or","या","ਜਾਂ"],
];

function escapeRegExp(value:string):string {
  return value.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
}
function translateQuantText(input:string, language:DsfQuantLocalizedLanguage):string {
  let out=input;
  for(const [from,hi,pa] of [...REPLACEMENTS].sort((a,b)=>b[0].length-a[0].length)){
    out=out.replace(new RegExp(escapeRegExp(from),"gi"), language==="hi"?hi:pa);
  }
  return out.replace(/\s+([.,?])/g,"$1").replace(/\s{2,}/g," ").trim();
}

const LEADS: Record<string,[string,string]> = {
  CLASS_MARKS:["एक कक्षा के विद्यार्थियों के अंकों का विवरण दिया गया है।","ਇੱਕ ਕਲਾਸ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਦਾ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
  CRICKET_INNINGS:["एक बल्लेबाज की कई पारियों का रिकॉर्ड दिया गया है।","ਇੱਕ ਬੱਲੇਬਾਜ਼ ਦੀਆਂ ਕਈ ਪਾਰੀਆਂ ਦਾ ਰਿਕਾਰਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
  PARCEL_WEIGHT:["एक खेप में कई पार्सल हैं।","ਇੱਕ ਖੇਪ ਵਿੱਚ ਕਈ ਪਾਰਸਲ ਹਨ।"],
  DAILY_SALES:["एक दुकान की कई दिनों की बिक्री का विवरण दिया गया है।","ਇੱਕ ਦੁਕਾਨ ਦੀ ਕਈ ਦਿਨਾਂ ਦੀ ਵਿਕਰੀ ਦਾ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
  WORKER_WAGES:["मजदूरों की एक टीम की दैनिक मजदूरी का विवरण दिया गया है।","ਮਜ਼ਦੂਰਾਂ ਦੀ ਇੱਕ ਟੀਮ ਦੀ ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ ਦਾ ਵੇਰਵਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
  BOOKS_PER_SHELF:["पुस्तकें कई शेल्फों पर रखी गई हैं।","ਕਿਤਾਬਾਂ ਕਈ ਸ਼ੈਲਫ਼ਾਂ 'ਤੇ ਰੱਖੀਆਂ ਗਈਆਂ ਹਨ।"],
};

function laneLead(laneId:string,q:AnyQuestion,language:DsfQuantLocalizedLanguage):string {
  const context=String(q.contextId??"");
  if(LEADS[context]) return t(language,...LEADS[context]!);
  if(laneId.includes("AGES")) return t(language,"दो व्यक्तियों की आयु से संबंधित जानकारी दी गई है।","ਦੋ ਵਿਅਕਤੀਆਂ ਦੀ ਉਮਰ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("PROFIT")) return t(language,"एक वस्तु के क्रय-विक्रय से संबंधित जानकारी दी गई है।","ਇੱਕ ਵਸਤੂ ਦੀ ਖਰੀਦ-ਵਿਕਰੀ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("INTEREST")) return t(language,"एक निवेश पर ब्याज से संबंधित जानकारी दी गई है।","ਇੱਕ ਨਿਵੇਸ਼ 'ਤੇ ਵਿਆਜ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("TIME-WORK")) return t(language,"एक कार्य की दर और समय से संबंधित जानकारी दी गई है।","ਇੱਕ ਕੰਮ ਦੀ ਦਰ ਅਤੇ ਸਮੇਂ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("TSD")) return t(language,"गति, समय और दूरी से संबंधित जानकारी दी गई है।","ਰਫ਼ਤਾਰ, ਸਮਾਂ ਅਤੇ ਦੂਰੀ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("MIXTURE")) return t(language,"एक मिश्रण की मात्रा और सांद्रता से संबंधित जानकारी दी गई है।","ਇੱਕ ਮਿਸ਼ਰਣ ਦੀ ਮਾਤਰਾ ਅਤੇ ਸੰਘਣਾਪਣ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("MENSURATION")) return t(language,"दी गई आकृति के मापों से संबंधित जानकारी दी गई है।","ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਦੇ ਮਾਪਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("ALGEBRA")) return t(language,"चर x से संबंधित बीजीय जानकारी दी गई है।","ਚਰ x ਨਾਲ ਸੰਬੰਧਿਤ ਬੀਜਗਣਿਤੀ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  if(laneId.includes("CORE-ENRICHMENT")) return t(language,"संख्यात्मक संबंधों से संबंधित जानकारी दी गई है।","ਅੰਕੀ ਸੰਬੰਧਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  return t(language,"आवश्यक संख्यात्मक जानकारी दी गई है।","ਲੋੜੀਂਦੀ ਅੰਕੀ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
}

function promptFor(q:AnyQuestion, language:DsfQuantLocalizedLanguage):string {
  const raw=String(q.questionPrompt??"").trim();
  if(!raw) return t(language,"मांगा गया मान क्या है?","ਮੰਗਿਆ ਗਿਆ ਮੁੱਲ ਕੀ ਹੈ?");
  if(/can the value of x be determined/i.test(raw)) {
    return t(language,"क्या x का मान निर्धारित किया जा सकता है?","ਕੀ x ਦਾ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?");
  }
  if(/by how much does .*compound interest.*exceed simple interest/i.test(raw)) {
    return t(language,"पूरी अवधि में चक्रवृद्धि ब्याज साधारण ब्याज से कितना अधिक है?","ਪੂਰੀ ਮਿਆਦ ਵਿੱਚ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਸਧਾਰਣ ਵਿਆਜ ਤੋਂ ਕਿੰਨਾ ਵੱਧ ਹੈ?");
  }
  let out=raw
    .replace(/^What is the /i,"")
    .replace(/^What is /i,"")
    .replace(/^What are the /i,"")
    .replace(/^What are /i,"")
    .replace(/\?$/,"");
  out=translateQuantText(out,language)
    .replace(/^the\s+/i,"")
    .replace(/\bthe\b/gi,"")
    .replace(/\s{2,}/g," ")
    .trim();
  return language==="hi" ? out+" क्या है?" : out+" ਕੀ ਹੈ?";
}

function statementFor(text:string,language:DsfQuantLocalizedLanguage):string {
  let out=translateQuantText(text,language)
    .replace(/^There are /i,language==="hi"?"":"")
    .replace(/^There is /i,language==="hi"?"":"")
    .replace(/^The /i,"")
    .replace(/\.$/,"");
  out=out.replace(/\bthe\b/gi,"").replace(/\s{2,}/g," ").trim();
  if(language==="hi"){
    out=out.replace(/\bis\b/gi,"है").replace(/\bare\b/gi,"हैं").replace(/\bhas\b/gi,"में").replace(/\bfor\b/gi,"के लिए").replace(/\bof\b/gi,"का");
    out=out.replace(/\bहै\s+([₹\d][^,।]*)$/u,"$1 है");
  }else{
    out=out.replace(/\bis\b/gi,"ਹੈ").replace(/\bare\b/gi,"ਹਨ").replace(/\bhas\b/gi,"ਵਿੱਚ").replace(/\bfor\b/gi,"ਲਈ").replace(/\bof\b/gi,"ਦਾ");
    out=out.replace(/\bਹੈ\s+([₹\d][^,।]*)$/u,"$1 ਹੈ");
  }
  return out.replace(/\s{2,}/g," ").trim()+"।";
}

function localizedExplanation(q:AnyQuestion,language:DsfQuantLocalizedLanguage):string {
  const proof=q.proof??{};
  const canonical=String(q.canonicalAnswer??q.correctClass??"");
  const one=(label:string,sufficient:boolean|undefined,answers:any[])=>{
    const vals=(answers??[]).slice(0,2).map(String);
    if(sufficient) return t(language,
      `${label} से मांगा गया मान निश्चित हो जाता है${vals[0]?` (${vals[0]})`:""}।`,
      `${label} ਨਾਲ ਮੰਗਿਆ ਗਿਆ ਮੁੱਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ${vals[0]?` (${vals[0]})`:""}।`);
    return t(language,
      `${label} अकेले पर्याप्त नहीं है${vals.length>1?`; ${vals.join(" और ")} जैसे अलग-अलग मान संभव हैं`:""}।`,
      `${label} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ${vals.length>1?`; ${vals.join(" ਅਤੇ ")} ਵਰਗੇ ਵੱਖ-ਵੱਖ ਮੁੱਲ ਸੰਭਵ ਹਨ`:""}।`);
  };
  const s1=Boolean(proof.statementISufficient??proof.statementI?.sufficient);
  const s2=Boolean(proof.statementIISufficient??proof.statementII?.sufficient);
  const st=Boolean(proof.togetherSufficient??proof.together?.sufficient);
  const a1=proof.statementITargetAnswers??proof.statementI?.normalizedTargetAnswers??[];
  const a2=proof.statementIITargetAnswers??proof.statementII?.normalizedTargetAnswers??[];
  const at=proof.togetherTargetAnswers??proof.together?.normalizedTargetAnswers??[];
  return [
    t(language,"पहले दोनों कथनों को अलग-अलग जाँचते हैं।","ਪਹਿਲਾਂ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚਦੇ ਹਾਂ।"),
    one(t(language,"कथन I","ਕਥਨ I"),s1,a1),
    one(t(language,"कथन II","ਕਥਨ II"),s2,a2),
    one(t(language,"दोनों कथन साथ लेने पर","ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ 'ਤੇ"),st,at),
    t(language,`अतः सही विकल्प: ${OPTION_TEXT.hi[canonical as keyof typeof OPTION_TEXT.hi]??canonical}`,`ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ: ${OPTION_TEXT.pa[canonical as keyof typeof OPTION_TEXT.pa]??canonical}`),
  ].join(" ");
}

export function localizeDsfQuantQuestion(laneId:string,question:AnyQuestion,language:DsfQuantLocalizedLanguage):AnyQuestion {
  const prompt=promptFor(question,language);
  const statements=(question.statements??[]).map((statement:any)=>Object.freeze({...statement,text:statementFor(String(statement.text??""),language)}));
  if(statements.length!==2) throw new Error(`${laneId}: quant localization requires exactly two statements`);
  const options=(question.options??[]).map((option:any)=>{
    const semantic=String(option.semanticClass??"");
    const value=OPTION_TEXT[language][semantic as keyof typeof OPTION_TEXT.hi];
    if(!value) throw new Error(`${laneId}: unsupported sufficiency semantic '${semantic}'`);
    return Object.freeze({...option,value});
  });
  return Object.freeze({
    ...question,
    language,
    locale:language==="hi"?"hi-IN":"pa-IN",
    stem:`${laneLead(laneId,question,language)} ${prompt}\n\nStatement I: ${statements[0].text}\nStatement II: ${statements[1].text}`,
    questionPrompt:prompt,
    statements:Object.freeze(statements),
    options:Object.freeze(options),
    explanation:localizedExplanation(question,language),
    localization:Object.freeze({
      authority:"DSF_CP019_QUANT_HI_PA_LOCALIZATION_REVIEW_V1",
      sourceLanguage:"en",
      language,
      semanticParity:"SOURCE_PROOF_PRESERVED",
      correctIndexPreserved:true,
      canonicalAnswerPreserved:true,
      reviewOnly:true,
      humanLanguageReviewRequired:true,
    }),
  });
}
