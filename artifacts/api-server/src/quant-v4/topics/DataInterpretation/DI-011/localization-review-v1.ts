import type { Di011Question, Di011QuestionSet, Di011Stimulus } from "./types";
import { hashSeed } from "../DI-001/exact";
export type Di011Locale="hi-IN"|"pa-IN";
type C={title:string;left:string;right:string;unit:string;cats:string[]};
const CONTEXTS:Record<Di011Locale,C[]>={
 "hi-IN":[
  {title:"क्षेत्रीय ऋण आवेदन और स्वीकृतियाँ",left:"आवेदन",right:"स्वीकृतियाँ",unit:"आवेदन",cats:["उत्तर","दक्षिण","पूर्व","पश्चिम","मध्य"]},
  {title:"उत्पाद भेजे जाने और लौटाए जाने की संख्या",left:"भेजे गए",right:"लौटाए गए",unit:"इकाइयाँ",cats:["उत्पाद P","उत्पाद Q","उत्पाद R","उत्पाद S","उत्पाद T"]},
  {title:"बीमा पॉलिसियाँ और दावे",left:"पॉलिसियाँ",right:"दावे",unit:"रिकॉर्ड",cats:["श्रेणी A","श्रेणी B","श्रेणी C","श्रेणी D","श्रेणी E"]},
  {title:"शाखाओं में जमा और निकासी",left:"जमा",right:"निकासी",unit:"₹ लाख",cats:["शाखा 1","शाखा 2","शाखा 3","शाखा 4","शाखा 5"]},
  {title:"प्रशिक्षण में नामांकन और पाठ्यक्रम पूरा करना",left:"नामांकित",right:"पूरा किया",unit:"लोग",cats:["बैच A","बैच B","बैच C","बैच D","बैच E"]},
  {title:"ऑनलाइन ऑर्डर और सफल डिलीवरी",left:"ऑर्डर",right:"डिलीवरी",unit:"ऑर्डर",cats:["सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार"]},
 ],
 "pa-IN":[
  {title:"ਖੇਤਰੀ ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",left:"ਅਰਜ਼ੀਆਂ",right:"ਮਨਜ਼ੂਰੀਆਂ",unit:"ਅਰਜ਼ੀਆਂ",cats:["ਉੱਤਰ","ਦੱਖਣ","ਪੂਰਬ","ਪੱਛਮ","ਕੇਂਦਰੀ"]},
  {title:"ਉਤਪਾਦ ਭੇਜਣ ਅਤੇ ਵਾਪਸ ਆਉਣ ਦੀ ਗਿਣਤੀ",left:"ਭੇਜੇ",right:"ਵਾਪਸ ਆਏ",unit:"ਇਕਾਈਆਂ",cats:["ਉਤਪਾਦ P","ਉਤਪਾਦ Q","ਉਤਪਾਦ R","ਉਤਪਾਦ S","ਉਤਪਾਦ T"]},
  {title:"ਬੀਮਾ ਪਾਲਿਸੀਆਂ ਅਤੇ ਦਾਅਵੇ",left:"ਪਾਲਿਸੀਆਂ",right:"ਦਾਅਵੇ",unit:"ਰਿਕਾਰਡ",cats:["ਸ਼੍ਰੇਣੀ A","ਸ਼੍ਰੇਣੀ B","ਸ਼੍ਰੇਣੀ C","ਸ਼੍ਰੇਣੀ D","ਸ਼੍ਰੇਣੀ E"]},
  {title:"ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਜਮ੍ਹਾਂ ਅਤੇ ਨਿਕਾਸੀ",left:"ਜਮ੍ਹਾਂ",right:"ਨਿਕਾਸੀ",unit:"₹ ਲੱਖ",cats:["ਸ਼ਾਖਾ 1","ਸ਼ਾਖਾ 2","ਸ਼ਾਖਾ 3","ਸ਼ਾਖਾ 4","ਸ਼ਾਖਾ 5"]},
  {title:"ਸਿਖਲਾਈ ਵਿੱਚ ਦਾਖ਼ਲਾ ਅਤੇ ਕੋਰਸ ਪੂਰਾ ਕਰਨਾ",left:"ਦਾਖ਼ਲ",right:"ਪੂਰਾ ਕੀਤਾ",unit:"ਲੋਕ",cats:["ਬੈਚ A","ਬੈਚ B","ਬੈਚ C","ਬੈਚ D","ਬੈਚ E"]},
  {title:"ਆਨਲਾਈਨ ਆਰਡਰ ਅਤੇ ਸਫ਼ਲ ਡਿਲਿਵਰੀ",left:"ਆਰਡਰ",right:"ਡਿਲਿਵਰੀ",unit:"ਆਰਡਰ",cats:["ਸੋਮਵਾਰ","ਮੰਗਲਵਾਰ","ਬੁੱਧਵਾਰ","ਵੀਰਵਾਰ","ਸ਼ੁੱਕਰਵਾਰ"]},
 ]
};
const RATIO_MEASURES:Record<Di011Locale,readonly (readonly [string,string])[]>={
 "hi-IN":[
  ["प्राप्त आवेदनों की संख्या","स्वीकृत आवेदनों की संख्या"],
  ["भेजी गई इकाइयों की संख्या","लौटाई गई इकाइयों की संख्या"],
  ["पॉलिसियों की संख्या","दावों की संख्या"],
  ["जमा राशि","निकाली गई राशि"],
  ["नामांकित लोगों की संख्या","पाठ्यक्रम पूरा करने वाले लोगों की संख्या"],
  ["ऑर्डरों की संख्या","डिलीवर किए गए ऑर्डरों की संख्या"],
 ],
 "pa-IN":[
  ["ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ","ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ"],
  ["ਭੇਜੀਆਂ ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ","ਵਾਪਸ ਆਈਆਂ ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ"],
  ["ਪਾਲਿਸੀਆਂ ਦੀ ਗਿਣਤੀ","ਦਾਅਵਿਆਂ ਦੀ ਗਿਣਤੀ"],
  ["ਜਮ੍ਹਾਂ ਰਕਮ","ਕਢਵਾਈ ਗਈ ਰਕਮ"],
  ["ਦਾਖ਼ਲ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ","ਕੋਰਸ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ"],
  ["ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ","ਡਿਲਿਵਰ ਕੀਤੇ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ"],
 ]
};
const h=(l:Di011Locale)=>l==="hi-IN";
function localizedQuestion(q:Di011Question,source:Di011Stimulus,locale:Di011Locale,cats:string[],series:[string,string],ctxIndex:number):Di011Question{
 const hindi=h(locale),c=(i:number)=>cats[i]!,row=(i:number)=>source.rows[i]!,R=source.rows;
 const taskSeed=q.questionId.replace(/^DI-011:/u,"").replace(/:Q\d+$/u,"");
 const picked=["a","b","c","d"].map(key=>hashSeed(`${taskSeed}:${key}`)%R.length);
 if(picked[1]===picked[0])picked[1]=(picked[0]!+1)%R.length;
 picked[2]=(picked[1]!+1)%R.length;picked[3]=(picked[2]!+1)%R.length;
 let stem="",steps:string[]=[];
 switch(q.kind){
  case "SAME_CATEGORY_COMBINED_TOTAL": {const i=picked[0]!,r=row(i);if(source.pairKind==="PIE_TABLE"){const max=Math.max(...R.map(x=>x.left)),j=R.findIndex(x=>x.left===max);const hi=[
      `जिस क्षेत्र का पाई चार्ट में हिस्सा सबसे बड़ा है, वहाँ कितने आवेदन स्वीकृत हुए?`,
      `जिस उत्पाद का पाई चार्ट में हिस्सा सबसे बड़ा है, उसकी कितनी इकाइयाँ लौटाई गईं?`,
      `जिस श्रेणी का पाई चार्ट में हिस्सा सबसे बड़ा है, उसमें कितने दावे दर्ज हुए?`,
      `जिस शाखा का पाई चार्ट में हिस्सा सबसे बड़ा है, वहाँ से कितनी राशि निकाली गई?`,
      `जिस बैच का पाई चार्ट में हिस्सा सबसे बड़ा है, उसमें कितने लोगों ने प्रशिक्षण पूरा किया?`,
      `जिस दिन का पाई चार्ट में हिस्सा सबसे बड़ा है, उस दिन कितने ऑर्डर डिलीवर हुए?`,
    ],pa=[
      `ਜਿਸ ਖੇਤਰ ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ, ਉੱਥੇ ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਹੋਈਆਂ?`,
      `ਜਿਸ ਉਤਪਾਦ ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ, ਉਸ ਦੀਆਂ ਕਿੰਨੀਆਂ ਇਕਾਈਆਂ ਵਾਪਸ ਆਈਆਂ?`,
      `ਜਿਸ ਸ਼੍ਰੇਣੀ ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ, ਉਸ ਵਿੱਚ ਕਿੰਨੇ ਦਾਅਵੇ ਦਰਜ ਹੋਏ?`,
      `ਜਿਸ ਸ਼ਾਖਾ ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ, ਉੱਥੋਂ ਕਿੰਨੀ ਰਕਮ ਕਢਵਾਈ ਗਈ?`,
      `ਜਿਸ ਬੈਚ ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ, ਉਸ ਵਿੱਚ ਕਿੰਨੇ ਲੋਕਾਂ ਨੇ ਸਿਖਲਾਈ ਪੂਰੀ ਕੀਤੀ?`,
      `ਜਿਸ ਦਿਨ ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ, ਉਸ ਦਿਨ ਕਿੰਨੇ ਆਰਡਰ ਡਿਲਿਵਰ ਹੋਏ?`,
    ];stem=(hindi?hi:pa)[ctxIndex]!;steps=[hindi?`${c(j)} का पाई चार्ट में हिस्सा ${max}% है।`:`${c(j)} ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ${max}% ਹੈ।`,hindi?`तालिका में ${c(j)} के लिए ${row(j).right} दिया है।`:`ਸਾਰਣੀ ਵਿੱਚ ${c(j)} ਲਈ ${row(j).right} ਦਿੱਤਾ ਹੈ।`];}else{stem=hindi?`दोनों चार्टों में ${c(i)} के मानों का योग कितना है?`:`ਦੋਵੇਂ ਚਾਰਟਾਂ ਵਿੱਚ ${c(i)} ਦੇ ਦੋਵਾਂ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;steps=[`${r.left} + ${r.right} = ${r.left+r.right}।`];}break;}
  case "SAME_CATEGORY_ABSOLUTE_DIFFERENCE": {if(source.pairKind==="PIE_TABLE"){const high=R.reduce((a,b)=>a.left>b.left?a:b),low=R.reduce((a,b)=>a.left<b.left?a:b),hi=R.indexOf(high),lo=R.indexOf(low),a=high.left,b=low.left,v=Math.abs(a-b);stem=hindi?`${c(hi)} का पाई चार्ट हिस्सा ${c(lo)} के हिस्से से कितने प्रतिशत-अंक अधिक है?`:`${c(hi)} ਦਾ ਪਾਈ ਚਾਰਟ ਹਿੱਸਾ ${c(lo)} ਦੇ ਹਿੱਸੇ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ-ਅੰਕ ਵੱਧ ਹੈ?`;steps=[`${c(hi)} = ${a}%।`,`${c(lo)} = ${b}%।`,`${hindi?"अंतर":"ਫ਼ਰਕ"} = ${v} ${hindi?"प्रतिशत-अंक":"ਪ੍ਰਤੀਸ਼ਤ-ਅੰਕ"}।`];}else{const i=picked[0]!,r=row(i),v=Math.abs(r.left-r.right);stem=hindi?`${c(i)} के लिए दोनों प्रस्तुत मानों में कितना अंतर है?`:`${c(i)} ਲਈ ਦੋਵੇਂ ਦਿੱਤੇ ਮੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਫ਼ਰਕ ਹੈ?`;steps=[hindi?`अंतर = |${r.left} − ${r.right}| = ${v}।`:`ਫ਼ਰਕ = |${r.left} − ${r.right}| = ${v}।`];}break;}
  case "LEFT_TO_RIGHT_RATIO": {const [i,j]=picked;if(source.pairKind==="PIE_TABLE"){const a=row(i!).left,b=row(j!).left;stem=hindi?`${c(i!)} और ${c(j!)} के पाई चार्ट हिस्सों का अनुपात, इसी क्रम में, क्या है?`:`${c(i!)} ਅਤੇ ${c(j!)} ਦੇ ਪਾਈ ਚਾਰਟ ਹਿੱਸਿਆਂ ਦਾ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[hindi?`हिस्से = ${a}%:${b}% = ${q.answer}।`:`ਹਿੱਸੇ = ${a}%:${b}% = ${q.answer}।`];}else{const a=row(i!).left,b=row(i!).right;stem=hindi?`${c(i!)} के लिए ${series[0]} और ${series[1]} का अनुपात क्या है?`:`${c(i!)} ਲਈ ${series[0]} ਅਤੇ ${series[1]} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[hindi?`आवश्यक अनुपात = ${a}:${b} = ${q.answer}।`:`ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ = ${a}:${b} = ${q.answer}।`];}break;}
  case "TWO_CATEGORY_CROSS_SUM": {const [i,j]=picked;let a:number,b:number;if(source.pairKind==="PIE_TABLE"){a=row(i!).right;b=row(j!).right;stem=hindi?`तालिका में ${c(i!)} और ${c(j!)} के ${series[1]} का योग कितना है?`:`ਸਾਰਣੀ ਵਿੱਚ ${c(i!)} ਅਤੇ ${c(j!)} ਦੇ ${series[1]} ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;}else{a=row(i!).left;b=row(j!).right;stem=hindi?`${c(i!)} के लिए ${series[0]} और ${c(j!)} के लिए ${series[1]} का कुल कितना है?`:`${c(i!)} ਲਈ ${series[0]} ਅਤੇ ${c(j!)} ਲਈ ${series[1]} ਦਾ ਕੁੱਲ ਕਿੰਨਾ ਹੈ?`;}steps=[`${c(i!)} = ${a}।`,`${c(j!)} = ${b}।`,`${hindi?"कुल":"ਕੁੱਲ"} = ${a+b}।`];break;}
  case "HIGHEST_COMBINED_CATEGORY": {const best=source.pairKind==="PIE_TABLE"?R.reduce((a,b)=>a.right>b.right?a:b):R.reduce((a,b)=>a.left+a.right>b.left+b.right?a:b),i=R.indexOf(best);stem=source.pairKind==="PIE_TABLE"?(hindi?`तालिका में ${series[1]} का सबसे अधिक मान किस श्रेणी में है?`:`ਸਾਰਣੀ ਵਿੱਚ ${series[1]} ਦਾ ਸਭ ਤੋਂ ਵੱਧ ਮੁੱਲ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਹੈ?`):(hindi?`दोनों चार्टों के मानों का योग किस श्रेणी के लिए सबसे अधिक है?`:`ਦੋਵਾਂ ਚਾਰਟਾਂ ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਲਈ ਸਭ ਤੋਂ ਵੱਧ ਹੈ?`);steps=source.pairKind==="PIE_TABLE"?[...R.map((x,n)=>`${cats[n]}: ${x.right}`),hindi?`तालिका का सबसे बड़ा मान ${c(i)} के लिए है।`:`ਸਾਰਣੀ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ ${c(i)} ਲਈ ਹੈ।`]:[...R.map((x,n)=>`${cats[n]}: ${x.left} + ${x.right} = ${x.left+x.right}`),hindi?`दोनों मानों का सबसे अधिक कुल ${c(i)} के लिए है।`:`ਦੋਵੇਂ ਮੁੱਲਾਂ ਦਾ ਸਭ ਤੋਂ ਵੱਧ ਕੁੱਲ ${c(i)} ਲਈ ਹੈ।`];break;}
  case "CROSS_COMPONENT_AVERAGE": {const [i,j]=picked,a=row(i!).left,b=row(j!).right,v=(a+b)/2;stem=hindi?`${c(i!)} में ${series[0]} और ${c(j!)} में ${series[1]} के मानों का औसत क्या है?`:`${c(i!)} ਵਿੱਚ ${series[0]} ਅਤੇ ${c(j!)} ਵਿੱਚ ${series[1]} ਦੇ ਮੁੱਲਾਂ ਦਾ ਔਸਤ ਕੀ ਹੈ?`;steps=[hindi?`औसत = (${a} + ${b}) ÷ 2 = ${v}।`:`ਔਸਤ = (${a} + ${b}) ÷ 2 = ${v}।`];break;}
  case "TWO_GROUP_CROSS_RATIO": {const [i,j,k,l]=picked;let a:number,b:number;const measures=RATIO_MEASURES[locale][ctxIndex]!;if(source.pairKind==="PIE_TABLE"){a=row(i!).right+row(j!).right;b=row(k!).right+row(l!).right;stem=hindi?`समूह 1 (${c(i!)}, ${c(j!)}) में ${measures[1]} और समूह 2 (${c(k!)}, ${c(l!)}) में ${measures[1]} का अनुपात क्या है?`:`ਸਮੂਹ 1 (${c(i!)}, ${c(j!)}) ਵਿੱਚ ${measures[1]} ਅਤੇ ਸਮੂਹ 2 (${c(k!)}, ${c(l!)}) ਵਿੱਚ ${measures[1]} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;}else{a=row(i!).left+row(j!).left;b=row(k!).right+row(l!).right;stem=hindi?`समूह 1 (${c(i!)}, ${c(j!)}) में ${measures[0]} और समूह 2 (${c(k!)}, ${c(l!)}) में ${measures[1]} का अनुपात क्या है?`:`ਸਮੂਹ 1 (${c(i!)}, ${c(j!)}) ਵਿੱਚ ${measures[0]} ਅਤੇ ਸਮੂਹ 2 (${c(k!)}, ${c(l!)}) ਵਿੱਚ ${measures[1]} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;}steps=[`${hindi?"पहला कुल":"ਪਹਿਲਾ ਕੁੱਲ"} = ${a}।`,`${hindi?"दूसरा कुल":"ਦੂਜਾ ਕੁੱਲ"} = ${b}।`,`${hindi?"अनुपात":"ਅਨੁਪਾਤ"} = ${q.answer}।`];break;}
  case "TWO_GROUP_COMBINED_DIFFERENCE": {const [i,j,k,l]=picked;let a:number,b:number;if(source.pairKind==="PIE_TABLE"){a=row(i!).right+row(j!).right;b=row(k!).right+row(l!).right;stem=hindi?`${c(i!)} और ${c(j!)} के ${series[1]} के योग तथा ${c(k!)} और ${c(l!)} के ${series[1]} के योग में कितना अंतर है?`:`${c(i!)} ਅਤੇ ${c(j!)} ਦੇ ${series[1]} ਦੇ ਜੋੜ ਅਤੇ ${c(k!)} ਅਤੇ ${c(l!)} ਦੇ ${series[1]} ਦੇ ਜੋੜ ਵਿੱਚ ਕਿੰਨਾ ਫ਼ਰਕ ਹੈ?`;}else{a=row(i!).left+row(j!).right;b=row(k!).left+row(l!).right;stem=hindi?`(${c(i!)} में ${series[0]} और ${c(j!)} में ${series[1]}) के योग तथा (${c(k!)} में ${series[0]} और ${c(l!)} में ${series[1]}) के योग में कितना अंतर है?`:`(${c(i!)} ਵਿੱਚ ${series[0]} ਅਤੇ ${c(j!)} ਵਿੱਚ ${series[1]}) ਦੇ ਜੋੜ ਅਤੇ (${c(k!)} ਵਿੱਚ ${series[0]} ਅਤੇ ${c(l!)} ਵਿੱਚ ${series[1]}) ਦੇ ਜੋੜ ਵਿੱਚ ਕਿੰਨਾ ਫ਼ਰਕ ਹੈ?`;}steps=[`${hindi?"पहला कुल":"ਪਹਿਲਾ ਕੁੱਲ"} = ${a}।`,`${hindi?"दूसरा कुल":"ਦੂਜਾ ਕੁੱਲ"} = ${b}।`,`${hindi?"अंतर":"ਫ਼ਰਕ"} = |${a} − ${b}| = ${Math.abs(a-b)}।`];break;}
  case "THREE_CATEGORY_CROSS_TOTAL": {const [i,j,k]=picked;const a=source.pairKind==="PIE_TABLE"?row(i!).right:row(i!).left,b=row(j!).right,d=source.pairKind==="PIE_TABLE"?row(k!).right:row(k!).left;stem=source.pairKind==="PIE_TABLE"?(hindi?`तालिका में ${series[1]} के अंतर्गत ${c(i!)}, ${c(j!)} और ${c(k!)} के मानों का कुल कितना है?`:`ਸਾਰਣੀ ਵਿੱਚ ${series[1]} ਹੇਠ ${c(i!)}, ${c(j!)} ਅਤੇ ${c(k!)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਕੁੱਲ ਕਿੰਨਾ ਹੈ?`):(hindi?`${c(i!)} के लिए ${series[0]}, ${c(j!)} के लिए ${series[1]} और ${c(k!)} के लिए ${series[0]} का कुल कितना है?`:`${c(i!)} ਲਈ ${series[0]}, ${c(j!)} ਲਈ ${series[1]} ਅਤੇ ${c(k!)} ਲਈ ${series[0]} ਦਾ ਕੁੱਲ ਕਿੰਨਾ ਹੈ?`);steps=[`${a} + ${b} + ${d} = ${a+b+d}।`];break;}
  case "FOUR_VALUE_CROSS_AVERAGE": {const [i,j,k,l]=picked,a=R[i!]!.left,b=R[j!]!.right,d=R[k!]!.left,e=R[l!]!.right,sum=a+b+d+e,v=sum/4;stem=hindi?`${c(i!)} में ${series[0]}, ${c(j!)} में ${series[1]}, ${c(k!)} में ${series[0]} और ${c(l!)} में ${series[1]} के मानों का औसत क्या है?`:`${c(i!)} ਵਿੱਚ ${series[0]}, ${c(j!)} ਵਿੱਚ ${series[1]}, ${c(k!)} ਵਿੱਚ ${series[0]} ਅਤੇ ${c(l!)} ਵਿੱਚ ${series[1]} ਦੇ ਮੁੱਲਾਂ ਦਾ ਔਸਤ ਕੀ ਹੈ?`;steps=[`${hindi?"योग":"ਜੋੜ"} = ${a} + ${b} + ${d} + ${e} = ${sum}।`,`${hindi?"औसत":"ਔਸਤ"} = ${sum} ÷ 4 = ${v}।`];break;}
 }
 const options=q.options.map(x=>{const index=source.rows.findIndex(r=>r.category===x);return index>=0?cats[index]!:x;});
 return {...q,stem,options,answer:options[q.correctIndex]&&source.rows.some(r=>r.category===q.answer)?cats[source.rows.findIndex(r=>r.category===q.answer)]!:q.answer,explanation:{keyIdea:hindi?"मिश्रित चार्ट और तालिका से आवश्यक मान पढ़ें, फिर केवल उन्हीं मानों का हिसाब करें।":"ਦੋਵੇਂ ਚਾਰਟਾਂ ਅਤੇ ਸਾਰਣੀ ਤੋਂ ਲੋੜੀਂਦੇ ਮੁੱਲ ਪੜ੍ਹੋ, ਫਿਰ ਸਿਰਫ਼ ਉਹਨਾਂ ਮੁੱਲਾਂ ਦਾ ਹਿਸਾਬ ਕਰੋ।",steps}};
}
export function localizeDi011Set(set:Di011QuestionSet,locale:Di011Locale):Di011QuestionSet{
 const hindi=h(locale),ctxIndex=["Regional loan applications and approvals","Product dispatch and returns","Insurance policies and claims","Branch deposits and withdrawals","Training enrolment and completion","Online orders and successful deliveries"].indexOf(set.stimulus.title);
 if(ctxIndex<0)throw new Error(`Missing DI-011 context localization for '${set.stimulus.title}'.`);
 const ctx=CONTEXTS[locale][ctxIndex]!,source=set.stimulus,cats=ctx.cats,series:[string,string]=[source.pairKind==="PIE_TABLE"?(hindi?"हिस्सा":"ਹਿੱਸਾ"):ctx.left,ctx.right];
 const stimulus:Di011Stimulus={...source,title:ctx.title,instruction:hindi?"दोनों प्रस्तुतियों का अध्ययन कीजिए और प्रश्नों के उत्तर दीजिए।":"ਦੋਵੇਂ ਚਾਰਟਾਂ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",leftTitle:series[0],rightTitle:series[1],leftUnit:source.pairKind==="PIE_TABLE"?"%":ctx.unit,rightUnit:ctx.unit,categoryHeader:hindi?"श्रेणी":"ਸ਼੍ਰੇਣੀ",valueHeader:hindi?"मान":"ਮੁੱਲ",rows:source.rows.map((r,i)=>({...r,category:cats[i]!}))};
 return {...set,stimulus,questions:set.questions.map(q=>localizedQuestion(q,source,locale,cats,series,ctxIndex))};
}
