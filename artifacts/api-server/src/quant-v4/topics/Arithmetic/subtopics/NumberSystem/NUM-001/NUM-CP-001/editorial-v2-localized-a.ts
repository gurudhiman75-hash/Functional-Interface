type Lang = "hi" | "pa";
const m = (value: string) => `\\(${value}\\)`;
const tr = (lang: Lang, hi: string, pa: string) => lang === "hi" ? hi : pa;

function placeCorrect(correct: string, distractors: readonly string[], index: number) {
  const options = [...distractors];
  const correctIndex = Math.max(0, Math.min(3, Number(index)));
  options.splice(correctIndex, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("Localized Editorial V2 duplicate option");
  return { options: Object.freeze(options), correctIndex };
}

function gcd(a: number, b: number) { let x=Math.abs(a), y=Math.abs(b); while(y!==0)[x,y]=[y,x%y]; return x||1; }
function frac(n: number, d: number) { const g=gcd(n,d); n/=g; d/=g; if(d<0){n=-n;d=-d;} return d===1?String(n):`\\frac{${n}}{${d}}`; }

function ql125(frozen: any, lang: Lang, seed: number) {
  const band=String(frozen.difficulty).toUpperCase(); let answer:string,distractors:string[],steps:string[];
  if(band==="EASY"){
    answer=tr(lang,`${m("0")} एक सम पूर्णांक है।`,`${m("0")} ਇੱਕ ਸਮ ਪੂਰਨ ਅੰਕ ਹੈ।`);
    distractors=[tr(lang,`${m("0")} एक विषम पूर्णांक है।`,`${m("0")} ਇੱਕ ਵਿਸ਼ਮ ਪੂਰਨ ਅੰਕ ਹੈ।`),tr(lang,`${m("-2")} एक पूर्ण संख्या है।`,`${m("-2")} ਇੱਕ ਪੂਰਨ ਸੰਖਿਆ ਹੈ।`),tr(lang,`${m("-1")} एक प्राकृतिक संख्या है।`,`${m("-1")} ਇੱਕ ਕੁਦਰਤੀ ਸੰਖਿਆ ਹੈ।`)];
    steps=[tr(lang,`${m("0=2\\times0")}, इसलिए ${m("0")} सम है।`,`${m("0=2\\times0")}, ਇਸ ਲਈ ${m("0")} ਸਮ ਹੈ।`),tr(lang,"ऋणात्मक पूर्णांक पूर्ण संख्या या प्राकृतिक संख्या नहीं होते।","ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਪੂਰਨ ਸੰਖਿਆ ਜਾਂ ਕੁਦਰਤੀ ਸੰਖਿਆ ਨਹੀਂ ਹੁੰਦੇ।")];
  } else if(band==="MEDIUM"){
    const n=-(2+(seed%9));
    answer=tr(lang,`${m(String(n))} पूर्णांक भी है और परिमेय संख्या भी।`,`${m(String(n))} ਪੂਰਨ ਅੰਕ ਵੀ ਹੈ ਅਤੇ ਪਰਿਮੇਯ ਸੰਖਿਆ ਵੀ।`);
    distractors=[tr(lang,`${m(String(n))} एक पूर्ण संख्या है।`,`${m(String(n))} ਇੱਕ ਪੂਰਨ ਸੰਖਿਆ ਹੈ।`),tr(lang,`${m(String(n))} एक प्राकृतिक संख्या है।`,`${m(String(n))} ਇੱਕ ਕੁਦਰਤੀ ਸੰਖਿਆ ਹੈ।`),tr(lang,`${m("0")} एक विषम पूर्णांक है।`,`${m("0")} ਇੱਕ ਵਿਸ਼ਮ ਪੂਰਨ ਅੰਕ ਹੈ।`)];
    steps=[tr(lang,`${m(String(n))} एक पूर्णांक है।`,`${m(String(n))} ਇੱਕ ਪੂਰਨ ਅੰਕ ਹੈ।`),tr(lang,`इसे ${m(`\\frac{${n}}{1}`)} के रूप में लिखा जा सकता है, इसलिए यह परिमेय है।`,`ਇਸ ਨੂੰ ${m(`\\frac{${n}}{1}`)} ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪਰਿਮੇਯ ਹੈ।`)];
  } else {
    answer=tr(lang,"हर पूर्णांक एक परिमेय संख्या है।","ਹਰ ਪੂਰਨ ਅੰਕ ਇੱਕ ਪਰਿਮੇਯ ਸੰਖਿਆ ਹੈ।");
    distractors=[tr(lang,"हर परिमेय संख्या पूर्णांक है।","ਹਰ ਪਰਿਮੇਯ ਸੰਖਿਆ ਪੂਰਨ ਅੰਕ ਹੈ।"),tr(lang,`${m("\\sqrt{2}")} परिमेय है।`,`${m("\\sqrt{2}")} ਪਰਿਮੇਯ ਹੈ।`),tr(lang,`${m("-3")} एक पूर्ण संख्या है।`,`${m("-3")} ਇੱਕ ਪੂਰਨ ਸੰਖਿਆ ਹੈ।`)];
    steps=[tr(lang,"हर पूर्णांक को हर 1 वाला भिन्न लिख सकते हैं।","ਹਰ ਪੂਰਨ ਅੰਕ ਨੂੰ ਹਰ 1 ਵਾਲੇ ਭਿੰਨ ਵਜੋਂ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।"),tr(lang,`उदाहरण: ${m("-3=\\frac{-3}{1}")}।`,`ਉਦਾਹਰਨ: ${m("-3=\\frac{-3}{1}")}।`)];
  }
  const placed=placeCorrect(answer,distractors,frozen.correctIndex);
  return {stem:tr(lang,"निम्नलिखित में से कौन-सा कथन सही है?","ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਹੀ ਹੈ?"),...placed,answer,concept:tr(lang,"पूर्णांक, परिमेय, पूर्ण संख्या, प्राकृतिक संख्या और सम-विषम की परिभाषाएँ प्रयोग करें।","ਪੂਰਨ ਅੰਕ, ਪਰਿਮੇਯ, ਪੂਰਨ ਸੰਖਿਆ, ਕੁਦਰਤੀ ਸੰਖਿਆ ਅਤੇ ਸਮ-ਵਿਸ਼ਮ ਦੀਆਂ ਪਰਿਭਾਸ਼ਾਵਾਂ ਵਰਤੋ।"),steps};
}

function ql129(frozen:any,lang:Lang){
  const band=String(frozen.difficulty).toUpperCase(); let stem:string,correct:string,distractors:string[],steps:string[];
  if(band==="EASY"){
    stem=tr(lang,`यदि ${m("a")} विषम और ${m("b")} सम है, तो कौन-सा व्यंजक सदैव विषम होगा?`,`ਜੇ ${m("a")} ਵਿਸ਼ਮ ਅਤੇ ${m("b")} ਸਮ ਹੈ, ਤਾਂ ਕਿਹੜਾ ਵਿਅੰਜਕ ਹਮੇਸ਼ਾ ਵਿਸ਼ਮ ਹੋਵੇਗਾ?`); correct=m("a+b"); distractors=[m("a+b+1"),m("ab"),m("b^{2}")];
    steps=[tr(lang,`${m("a+b")} = विषम + सम, इसलिए यह विषम है।`,`${m("a+b")} = ਵਿਸ਼ਮ + ਸਮ, ਇਸ ਲਈ ਇਹ ਵਿਸ਼ਮ ਹੈ।`),tr(lang,"अन्य तीनों व्यंजक सम हैं।","ਬਾਕੀ ਤਿੰਨੇ ਵਿਅੰਜਕ ਸਮ ਹਨ।")];
  }else if(band==="MEDIUM"){
    stem=tr(lang,`यदि ${m("p")} और ${m("q")} विषम तथा ${m("r")} सम है, तो कौन-सा व्यंजक विषम है?`,`ਜੇ ${m("p")} ਅਤੇ ${m("q")} ਵਿਸ਼ਮ ਅਤੇ ${m("r")} ਸਮ ਹੈ, ਤਾਂ ਕਿਹੜਾ ਵਿਅੰਜਕ ਵਿਸ਼ਮ ਹੈ?`); correct=m("pq+r"); distractors=[m("p+q+r"),m("pr+q+1"),m("r^{2}+p+q")];
    steps=[tr(lang,`${m("pq")} विषम है और ${m("r")} सम है।`,`${m("pq")} ਵਿਸ਼ਮ ਹੈ ਅਤੇ ${m("r")} ਸਮ ਹੈ।`),tr(lang,`इसलिए ${m("pq+r")} विषम है; बाकी विकल्प सम हैं।`,`ਇਸ ਲਈ ${m("pq+r")} ਵਿਸ਼ਮ ਹੈ; ਬਾਕੀ ਵਿਕਲਪ ਸਮ ਹਨ।`)];
  }else{
    stem=tr(lang,`यदि ${m("m")} विषम और ${m("n")} सम है, तो कौन-सा व्यंजक विषम है?`,`ਜੇ ${m("m")} ਵਿਸ਼ਮ ਅਤੇ ${m("n")} ਸਮ ਹੈ, ਤਾਂ ਕਿਹੜਾ ਵਿਅੰਜਕ ਵਿਸ਼ਮ ਹੈ?`); correct=m("m^{2}+mn+n^{3}"); distractors=[m("m^{2}+n^{2}+1"),m("m^{3}+mn+1"),m("m(n+1)+1")];
    steps=[tr(lang,`${m("m^{2}")} विषम है, जबकि ${m("mn")} और ${m("n^{3}")} सम हैं।`,`${m("m^{2}")} ਵਿਸ਼ਮ ਹੈ, ਜਦਕਿ ${m("mn")} ਅਤੇ ${m("n^{3}")} ਸਮ ਹਨ।`),tr(lang,`अतः ${m("m^{2}+mn+n^{3}")} विषम है।`,`ਇਸ ਲਈ ${m("m^{2}+mn+n^{3}")} ਵਿਸ਼ਮ ਹੈ।`)];
  }
  const placed=placeCorrect(correct,distractors,frozen.correctIndex); return {stem,...placed,answer:correct,concept:tr(lang,"सम-विषम के नियम लगाएँ; संख्यात्मक मान निकालना आवश्यक नहीं है।","ਸਮ-ਵਿਸ਼ਮ ਦੇ ਨਿਯਮ ਲਗਾਓ; ਅੰਕਾਂ ਦੇ ਮੁੱਲ ਕੱਢਣ ਦੀ ਲੋੜ ਨਹੀਂ।"),steps};
}

function ql130(frozen:any,lang:Lang,seed:number){
  const band=String(frozen.difficulty).toUpperCase();
  const labels=lang==="hi"?["सदैव सत्य",`${m("n")} के सम होने पर ही सत्य`,`${m("n")} के विषम होने पर ही सत्य`,"कभी सत्य नहीं"]:["ਹਮੇਸ਼ਾ ਸਹੀ",`${m("n")} ਸਮ ਹੋਵੇ ਤਾਂ ਹੀ ਸਹੀ`,`${m("n")} ਵਿਸ਼ਮ ਹੋਵੇ ਤਾਂ ਹੀ ਸਹੀ`,"ਕਦੇ ਵੀ ਸਹੀ ਨਹੀਂ"];
  let statement:string,answer:string,steps:string[];
  if(band==="EASY"){
    const odd=seed%2===0; statement=tr(lang,`${m("n^{2}+1")} ${odd?"सम":"विषम"} है`,`${m("n^{2}+1")} ${odd?"ਸਮ":"ਵਿਸ਼ਮ"} ਹੈ`); answer=odd?labels[2]!:labels[1]!;
    steps=[tr(lang,"पूर्णांक और उसके वर्ग की सम-विषम प्रकृति समान होती है।","ਪੂਰਨ ਅੰਕ ਅਤੇ ਉਸਦੇ ਵਰਗ ਦੀ ਸਮ-ਵਿਸ਼ਮ ਪ੍ਰਕਿਰਤੀ ਇੱਕੋ ਹੁੰਦੀ ਹੈ।"),tr(lang,odd?`इसलिए ${m("n^{2}+1")} सम तभी है जब ${m("n")} विषम हो।`:`इसलिए ${m("n^{2}+1")} विषम तभी है जब ${m("n")} सम हो।`,odd?`ਇਸ ਲਈ ${m("n^{2}+1")} ਸਮ ਤਦੋਂ ਹੀ ਹੈ ਜਦੋਂ ${m("n")} ਵਿਸ਼ਮ ਹੋਵੇ।`:`ਇਸ ਲਈ ${m("n^{2}+1")} ਵਿਸ਼ਮ ਤਦੋਂ ਹੀ ਹੈ ਜਦੋਂ ${m("n")} ਸਮ ਹੋਵੇ।`)];
  }else if(band==="MEDIUM"){
    const evenClaim=seed%2===0; statement=tr(lang,`${m("n(n+1)")} ${evenClaim?"सम":"विषम"} है`,`${m("n(n+1)")} ${evenClaim?"ਸਮ":"ਵਿਸ਼ਮ"} ਹੈ`); answer=evenClaim?labels[0]!:labels[3]!;
    steps=[tr(lang,"दो क्रमागत पूर्णांकों में एक संख्या अवश्य सम होती है।","ਦੋ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਵਿੱਚੋਂ ਇੱਕ ਜ਼ਰੂਰ ਸਮ ਹੁੰਦਾ ਹੈ।"),tr(lang,evenClaim?`${m("n(n+1)")} सदैव सम है।`:`${m("n(n+1)")} कभी विषम नहीं हो सकता।`,evenClaim?`${m("n(n+1)")} ਹਮੇਸ਼ਾ ਸਮ ਹੈ।`:`${m("n(n+1)")} ਕਦੇ ਵਿਸ਼ਮ ਨਹੀਂ ਹੋ ਸਕਦਾ।`)];
  }else{
    const oddClaim=seed%2===0; statement=tr(lang,`${m("3n^{2}+5n+1")} ${oddClaim?"विषम":"सम"} है`,`${m("3n^{2}+5n+1")} ${oddClaim?"ਵਿਸ਼ਮ":"ਸਮ"} ਹੈ`); answer=oddClaim?labels[0]!:labels[3]!;
    steps=[tr(lang,`${m("3n^{2}+5n+1")} की सम-विषम प्रकृति ${m("n^{2}+n+1")} जैसी है।`,`${m("3n^{2}+5n+1")} ਦੀ ਸਮ-ਵਿਸ਼ਮ ਪ੍ਰਕਿਰਤੀ ${m("n^{2}+n+1")} ਵਰਗੀ ਹੈ।`),tr(lang,`${m("n^{2}+n=n(n+1)")} सम है, इसलिए पूरा व्यंजक सदैव विषम है।`,`${m("n^{2}+n=n(n+1)")} ਸਮ ਹੈ, ਇਸ ਲਈ ਪੂਰਾ ਵਿਅੰਜਕ ਹਮੇਸ਼ਾ ਵਿਸ਼ਮ ਹੈ।`)];
  }
  const placed=placeCorrect(answer,labels.filter(v=>v!==answer),frozen.correctIndex); return {stem:tr(lang,`पूर्णांक ${m("n")} के लिए कथन “${statement}” के बारे में कौन-सा विकल्प सही है?`,`ਪੂਰਨ ਅੰਕ ${m("n")} ਲਈ ਕਥਨ “${statement}” ਬਾਰੇ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?`),...placed,answer,concept:tr(lang,"व्यंजक की सम-विषम प्रकृति जाँचें।","ਵਿਅੰਜਕ ਦੀ ਸਮ-ਵਿਸ਼ਮ ਪ੍ਰਕਿਰਤੀ ਜਾਂਚੋ।"),steps};
}

function ql132(frozen:any,lang:Lang){
  const band=String(frozen.difficulty).toUpperCase(); let stem:string,answer:string,distractors:string[],reason:string,concept:string;
  if(band==="EASY"){stem=tr(lang,"कौन-सा विकल्प प्राकृतिक संख्या नहीं है?","ਕਿਹੜਾ ਵਿਕਲਪ ਕੁਦਰਤੀ ਸੰਖਿਆ ਨਹੀਂ ਹੈ?");answer=m("-3");distractors=[m("1"),m("2"),m("5")];reason=tr(lang,"प्राकृतिक संख्याएँ धनात्मक गिनती की संख्याएँ हैं; ऋणात्मक पूर्णांक इसमें नहीं आता।","ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ ਧਨਾਤਮਕ ਗਿਣਤੀ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ ਹਨ; ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਇਸ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।");concept=tr(lang,"प्राकृतिक संख्याओं की परिभाषा प्रयोग करें।","ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ ਦੀ ਪਰਿਭਾਸ਼ਾ ਵਰਤੋ।");}
  else if(band==="MEDIUM"){stem=tr(lang,"कौन-सा विकल्प पूर्णांक नहीं है?","ਕਿਹੜਾ ਵਿਕਲਪ ਪੂਰਨ ਅੰਕ ਨਹੀਂ ਹੈ?");answer=m("\\frac{3}{2}");distractors=[m("-2"),m("0"),m("3")];reason=tr(lang,`${m("\\frac{3}{2}")} दो पूर्णांकों के बीच है और स्वयं पूर्णांक नहीं है।`,`${m("\\frac{3}{2}")} ਦੋ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ ਅਤੇ ਆਪ ਪੂਰਨ ਅੰਕ ਨਹੀਂ ਹੈ।`);concept=tr(lang,"पूर्णांक में भिन्नात्मक भाग नहीं होता।","ਪੂਰਨ ਅੰਕ ਵਿੱਚ ਭਿੰਨਾਤਮਕ ਭਾਗ ਨਹੀਂ ਹੁੰਦਾ।");}
  else{stem=tr(lang,"कौन-सा विकल्प परिमेय संख्या नहीं है?","ਕਿਹੜਾ ਵਿਕਲਪ ਪਰਿਮੇਯ ਸੰਖਿਆ ਨਹੀਂ ਹੈ?");answer=m("\\sqrt{2}");distractors=[m("\\frac{5}{8}"),m("-3"),m("0.125")];reason=tr(lang,`${m("\\sqrt{2}")} अपरिमेय है, जबकि अन्य विकल्प पूर्णांकों के अनुपात के रूप में लिखे जा सकते हैं।`,`${m("\\sqrt{2}")} ਅਪਰਿਮੇਯ ਹੈ, ਜਦਕਿ ਹੋਰ ਵਿਕਲਪ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਅਨੁਪਾਤ ਵਜੋਂ ਲਿਖੇ ਜਾ ਸਕਦੇ ਹਨ।`);concept=tr(lang,"परिमेय संख्या को दो पूर्णांकों के अनुपात के रूप में लिखा जा सकता है।","ਪਰਿਮੇਯ ਸੰਖਿਆ ਨੂੰ ਦੋ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਅਨੁਪਾਤ ਵਜੋਂ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।");}
  const placed=placeCorrect(answer,distractors,frozen.correctIndex); return {stem,...placed,answer,concept,steps:[reason,tr(lang,`अतः उत्तर ${answer} है।`,`ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`)]};
}

function ql133(frozen:any,lang:Lang){
  const s=frozen.hiddenState as Record<string,unknown>,least=Boolean(s.least),strict=Boolean(s.strict),bound=frac(Number(s.num),Number(s.den)),sign=least?(strict?">":"\\ge"):(strict?"<":"\\le");
  const options=Object.freeze((frozen.options??[]).map((o:any)=>m(String(o.value??o)))),correctIndex=Number(frozen.correctIndex),answer=options[correctIndex]!;
  const wanted=least?tr(lang,"सबसे छोटा","ਸਭ ਤੋਂ ਛੋਟਾ"):tr(lang,"सबसे बड़ा","ਸਭ ਤੋਂ ਵੱਡਾ");
  return {stem:tr(lang,`${m(`x${sign}${bound}`)} को संतुष्ट करने वाला ${wanted} पूर्णांक ${m("x")} ज्ञात करें।`,`${m(`x${sign}${bound}`)} ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਨ ਵਾਲਾ ${wanted} ਪੂਰਨ ਅੰਕ ${m("x")} ਲੱਭੋ।`),options,correctIndex,answer,concept:tr(lang,"सटीक सीमा देखें और जाँचें कि बराबरी शामिल है या नहीं।","ਸਹੀ ਸੀਮਾ ਵੇਖੋ ਅਤੇ ਜਾਂਚੋ ਕਿ ਬਰਾਬਰੀ ਸ਼ਾਮਲ ਹੈ ਜਾਂ ਨਹੀਂ।"),steps:[tr(lang,`आवश्यक पूर्णांक ${answer} है।`,`ਲੋੜੀਂਦਾ ਪੂਰਨ ਅੰਕ ${answer} ਹੈ।`)]};
}

function ql135(frozen:any,lang:Lang,seed:number){
  const band=String(frozen.difficulty).toUpperCase(),shift=Math.abs(seed)%3; let low:number,high:number,kind:"positive"|"negative"|"even"|"odd",values:number[],stem:string,concept:string;
  const word=(k:string)=>({positive:tr(lang,"धनात्मक","ਧਨਾਤਮਕ"),negative:tr(lang,"ऋणात्मक","ਰਿਣਾਤਮਕ"),even:tr(lang,"सम","ਸਮ"),odd:tr(lang,"विषम","ਵਿਸ਼ਮ")}[k]??k);
  if(band==="EASY"){low=-6-shift;high=7+shift;kind=seed%2===0?"positive":"negative";values=Array.from({length:high-low+1},(_,i)=>low+i).filter(v=>kind==="positive"?v>0:v<0);stem=tr(lang,`${m(`${low}\\le x\\le${high}`)} में कितने ${word(kind)} पूर्णांक हैं?`,`${m(`${low}\\le x\\le${high}`)} ਵਿੱਚ ਕਿੰਨੇ ${word(kind)} ਪੂਰਨ ਅੰਕ ਹਨ?`);concept=tr(lang,`सीमा के भीतर केवल ${word(kind)} पूर्णांक गिनें।`,`ਸੀਮਾ ਦੇ ਅੰਦਰ ਸਿਰਫ਼ ${word(kind)} ਪੂਰਨ ਅੰਕ ਗਿਣੋ।`);} 
  else if(band==="MEDIUM"){low=-9-shift;high=8+shift;kind=seed%2===0?"even":"odd";values=Array.from({length:high-low+1},(_,i)=>low+i).filter(v=>kind==="even"?v%2===0:Math.abs(v%2)===1);stem=tr(lang,`${m(`${low}\\le x\\le${high}`)} में कितने ${word(kind)} पूर्णांक हैं?`,`${m(`${low}\\le x\\le${high}`)} ਵਿੱਚ ਕਿੰਨੇ ${word(kind)} ਪੂਰਨ ਅੰਕ ਹਨ?`);concept=tr(lang,`सीमा के सभी पूर्णांकों पर ${word(kind)} की शर्त लगाएँ।`,`ਸੀਮਾ ਦੇ ਸਾਰੇ ਪੂਰਨ ਅੰਕਾਂ ਉੱਤੇ ${word(kind)} ਦੀ ਸ਼ਰਤ ਲਗਾਓ।`);} 
  else{low=-8-shift;high=10+shift;kind=seed%2===0?"even":"odd";values=Array.from({length:high-low},(_,i)=>low+1+i).filter(v=>v<=high&&(kind==="even"?v%2===0:Math.abs(v%2)===1));stem=tr(lang,`${m(`${low}<x\\le${high}`)} को संतुष्ट करने वाले कितने ${word(kind)} पूर्णांक ${m("x")} हैं?`,`${m(`${low}<x\\le${high}`)} ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਨ ਵਾਲੇ ਕਿੰਨੇ ${word(kind)} ਪੂਰਨ ਅੰਕ ${m("x")} ਹਨ?`);concept=tr(lang,`पहले खुली-बंद सीमाएँ लागू करें, फिर ${word(kind)} पूर्णांक गिनें।`,`ਪਹਿਲਾਂ ਖੁੱਲ੍ਹੀ-ਬੰਦ ਸੀਮਾਵਾਂ ਲਗਾਓ, ਫਿਰ ${word(kind)} ਪੂਰਨ ਅੰਕ ਗਿਣੋ।`);}
  const count=values.length,correct=m(String(count)),placed=placeCorrect(correct,[Math.max(0,count-1),count+1,count+2].map(v=>m(String(v))),frozen.correctIndex),list=values.map(v=>m(String(v))).join(", ");
  return {stem,...placed,answer:correct,concept,steps:[tr(lang,`योग्य पूर्णांक हैं: ${list}।`,`ਯੋਗ ਪੂਰਨ ਅੰਕ ਹਨ: ${list}।`),tr(lang,`अतः संख्या ${correct} है।`,`ਇਸ ਲਈ ਗਿਣਤੀ ${correct} ਹੈ।`)]};
}

function ql137(frozen:any,lang:Lang,seed:number){
  const band=String(frozen.difficulty).toUpperCase(); const even=tr(lang,`${m("n")} सम होना चाहिए`,`${m("n")} ਸਮ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`),odd=tr(lang,`${m("n")} विषम होना चाहिए`,`${m("n")} ਵਿਸ਼ਮ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`),all=tr(lang,`हर पूर्णांक ${m("n")}`,`ਹਰ ਪੂਰਨ ਅੰਕ ${m("n")}`),none=tr(lang,`कोई पूर्णांक ${m("n")} नहीं`,`ਕੋਈ ਪੂਰਨ ਅੰਕ ${m("n")} ਨਹੀਂ`); let condition:string,answer:string,steps:string[];
  if(band==="EASY"){const wantOdd=seed%2===0;condition=tr(lang,`${m("n+7")} ${wantOdd?"विषम":"सम"} है`,`${m("n+7")} ${wantOdd?"ਵਿਸ਼ਮ":"ਸਮ"} ਹੈ`);answer=wantOdd?even:odd;steps=[tr(lang,`${m("7")} विषम है, इसलिए इसे जोड़ने पर सम-विषम बदलता है।`,`${m("7")} ਵਿਸ਼ਮ ਹੈ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਜੋੜਨ ਨਾਲ ਸਮ-ਵਿਸ਼ਮ ਬਦਲ ਜਾਂਦਾ ਹੈ।`),tr(lang,wantOdd?`${m("n+7")} विषम होने के लिए ${m("n")} सम होना चाहिए।`:`${m("n+7")} सम होने के लिए ${m("n")} विषम होना चाहिए।`,wantOdd?`${m("n+7")} ਵਿਸ਼ਮ ਹੋਣ ਲਈ ${m("n")} ਸਮ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`:`${m("n+7")} ਸਮ ਹੋਣ ਲਈ ${m("n")} ਵਿਸ਼ਮ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`)];}
  else if(band==="MEDIUM"){const first=seed%2===0;condition=first?tr(lang,`${m("5n+2")} सम है`,`${m("5n+2")} ਸਮ ਹੈ`):tr(lang,`${m("3n+5")} सम है`,`${m("3n+5")} ਸਮ ਹੈ`);answer=first?even:odd;steps=[tr(lang,first?`${m("5n")} की सम-विषम प्रकृति ${m("n")} जैसी है और ${m("2")} जोड़ने से नहीं बदलती।`:`${m("3n")} की सम-विषम प्रकृति ${m("n")} जैसी है और ${m("5")} जोड़ने से बदलती है।`,first?`${m("5n")} ਦੀ ਸਮ-ਵਿਸ਼ਮ ਪ੍ਰਕਿਰਤੀ ${m("n")} ਵਰਗੀ ਹੈ ਅਤੇ ${m("2")} ਜੋੜਨ ਨਾਲ ਨਹੀਂ ਬਦਲਦੀ।`:`${m("3n")} ਦੀ ਸਮ-ਵਿਸ਼ਮ ਪ੍ਰਕਿਰਤੀ ${m("n")} ਵਰਗੀ ਹੈ ਅਤੇ ${m("5")} ਜੋੜਨ ਨਾਲ ਬਦਲ ਜਾਂਦੀ ਹੈ।`),tr(lang,`इसलिए सही निष्कर्ष है: ${answer}।`,`ਇਸ ਲਈ ਸਹੀ ਨਤੀਜਾ ਹੈ: ${answer}।`)];}
  else{const first=seed%2===0;condition=first?tr(lang,`${m("3n^{2}+4n+1")} विषम है`,`${m("3n^{2}+4n+1")} ਵਿਸ਼ਮ ਹੈ`):tr(lang,`${m("5n^{2}+2n+1")} सम है`,`${m("5n^{2}+2n+1")} ਸਮ ਹੈ`);answer=first?even:odd;steps=[tr(lang,`सम-विषम के लिए दोनों व्यंजक ${m("n^{2}+1")} जैसे व्यवहार करते हैं।`,`ਸਮ-ਵਿਸ਼ਮ ਲਈ ਦੋਵੇਂ ਵਿਅੰਜਕ ${m("n^{2}+1")} ਵਾਂਗ ਵਰਤਾਓ ਕਰਦੇ ਹਨ।`),tr(lang,`इससे ${answer}।`,`ਇਸ ਤੋਂ ${answer}।`)];}
  const labels=[even,odd,all,none],placed=placeCorrect(answer,labels.filter(v=>v!==answer),frozen.correctIndex); return {stem:tr(lang,`यदि ${condition}, तो पूर्णांक ${m("n")} के बारे में क्या अवश्य सत्य है?`,`ਜੇ ${condition}, ਤਾਂ ਪੂਰਨ ਅੰਕ ${m("n")} ਬਾਰੇ ਕੀ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਸਹੀ ਹੈ?`),...placed,answer,concept:tr(lang,"दी गई शर्त की सम-विषम प्रकृति से n की प्रकृति निकालें।","ਦਿੱਤੀ ਸ਼ਰਤ ਦੀ ਸਮ-ਵਿਸ਼ਮ ਪ੍ਰਕਿਰਤੀ ਤੋਂ n ਦੀ ਪ੍ਰਕਿਰਤੀ ਕੱਢੋ।"),steps};
}

export function buildLocalizedEditorialA(frozen:any,lang:Lang,seed:number){const ql=String(frozen.questionLanguageId??frozen.permanentQlId);if(ql==="NUM-QL-125")return ql125(frozen,lang,seed);if(ql==="NUM-QL-129")return ql129(frozen,lang);if(ql==="NUM-QL-130")return ql130(frozen,lang,seed);if(ql==="NUM-QL-132")return ql132(frozen,lang);if(ql==="NUM-QL-133")return ql133(frozen,lang);if(ql==="NUM-QL-135")return ql135(frozen,lang,seed);if(ql==="NUM-QL-137")return ql137(frozen,lang,seed);return null;}
