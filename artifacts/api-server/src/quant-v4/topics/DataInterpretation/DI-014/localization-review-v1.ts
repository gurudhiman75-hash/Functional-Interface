import type { Di014Set, Di014Task, Di014RadarStimulus } from "./types";
import type { Di005V2Stimulus } from "../DI-005/pie-v2-types";

export type Di014Locale="hi-IN"|"pa-IN";
type C={title:string;cats:string[]};
const CONTEXT:Record<Di014Locale,C[]>={
 "hi-IN":[
  {title:"पाँच शाखाओं में आवेदन और स्वीकृतियाँ",cats:["शाखा A","शाखा B","शाखा C","शाखा D","शाखा E"]},
  {title:"पाँच क्षेत्रों में आवेदन और स्वीकृतियाँ",cats:["उत्तर","दक्षिण","पूर्व","पश्चिम","मध्य"]},
  {title:"पाँच केंद्रों में आवेदन और स्वीकृतियाँ",cats:["केंद्र A","केंद्र B","केंद्र C","केंद्र D","केंद्र E"]},
  {title:"पाँच क्षेत्रों में ऋण आवेदन और स्वीकृतियाँ",cats:["क्षेत्र A","क्षेत्र B","क्षेत्र C","क्षेत्र D","क्षेत्र E"]},
  {title:"पाँच विभागों में आवेदन और स्वीकृतियाँ",cats:["विभाग A","विभाग B","विभाग C","विभाग D","विभाग E"]},
  {title:"पाँच पाठ्यक्रमों में आवेदन और स्वीकृतियाँ",cats:["पाठ्यक्रम A","पाठ्यक्रम B","पाठ्यक्रम C","पाठ्यक्रम D","पाठ्यक्रम E"]},
  {title:"पाँच सेवा इकाइयों में आवेदन और स्वीकृतियाँ",cats:["इकाई A","इकाई B","इकाई C","इकाई D","इकाई E"]},
  {title:"पाँच कार्यक्रमों में आवेदन और स्वीकृतियाँ",cats:["कार्यक्रम A","कार्यक्रम B","कार्यक्रम C","कार्यक्रम D","कार्यक्रम E"]},
 ],
 "pa-IN":[
  {title:"ਪੰਜ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਸ਼ਾਖਾ A","ਸ਼ਾਖਾ B","ਸ਼ਾਖਾ C","ਸ਼ਾਖਾ D","ਸ਼ਾਖਾ E"]},
  {title:"ਪੰਜ ਖੇਤਰਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਉੱਤਰ","ਦੱਖਣ","ਪੂਰਬ","ਪੱਛਮ","ਕੇਂਦਰੀ"]},
  {title:"ਪੰਜ ਕੇਂਦਰਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਕੇਂਦਰ A","ਕੇਂਦਰ B","ਕੇਂਦਰ C","ਕੇਂਦਰ D","ਕੇਂਦਰ E"]},
  {title:"ਪੰਜ ਜ਼ੋਨਾਂ ਵਿੱਚ ਕਰਜ਼ੇ ਦੀਆਂ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਜ਼ੋਨ A","ਜ਼ੋਨ B","ਜ਼ੋਨ C","ਜ਼ੋਨ D","ਜ਼ੋਨ E"]},
  {title:"ਪੰਜ ਵਿਭਾਗਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਵਿਭਾਗ A","ਵਿਭਾਗ B","ਵਿਭਾਗ C","ਵਿਭਾਗ D","ਵਿਭਾਗ E"]},
  {title:"ਪੰਜ ਕੋਰਸਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਕੋਰਸ A","ਕੋਰਸ B","ਕੋਰਸ C","ਕੋਰਸ D","ਕੋਰਸ E"]},
  {title:"ਪੰਜ ਸੇਵਾ ਇਕਾਈਆਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਇਕਾਈ A","ਇਕਾਈ B","ਇਕਾਈ C","ਇਕਾਈ D","ਇਕਾਈ E"]},
  {title:"ਪੰਜ ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਮਨਜ਼ੂਰੀਆਂ",cats:["ਪ੍ਰੋਗਰਾਮ A","ਪ੍ਰੋਗਰਾਮ B","ਪ੍ਰੋਗਰਾਮ C","ਪ੍ਰੋਗਰਾਮ D","ਪ੍ਰੋਗਰਾਮ E"]},
 ]
};
const hi=(l:Di014Locale)=>l==="hi-IN";
function idsInStem(stem:string,labels:readonly string[]){return labels.map((x,i)=>({i,at:stem.indexOf(x)})).filter(x=>x.at>=0).sort((a,b)=>a.at-b.at).map(x=>x.i);}
function makeQuestions(set:Di014Set,labels:string[],locale:Di014Locale){
 const h=hi(locale),n=labels.length,apps=set.radar.points.map(p=>p.applications),approved=[...set.approvedCounts],totalApproved=set.pie.totalValue,totalApps=apps.reduce((a,b)=>a+b,0),rates=apps.map((a,i)=>approved[i]!*100/a);
 const t=(kind:Di014Task,stem:string,answer:string,steps:string[])=>({kind,stem,answer,steps});
 return set.questions.map(q=>{
  const ix=idsInStem(q.stem,set.radar.points.map(p=>p.category)),c=(i:number)=>labels[i]!,[i,j,k,l]=ix;
  let r:{kind:Di014Task;stem:string;answer:string;steps:string[]};
  switch(q.kind){
   case "DIRECT_APPLICATIONS": r=t(q.kind,h?`${c(i!)} में कितने आवेदन प्राप्त हुए?`:`${c(i!)} ਵਿੱਚ ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ ਪ੍ਰਾਪਤ ਹੋਈਆਂ?`,q.answer,[h?`रेडार चार्ट में ${c(i!)} के लिए मान ${apps[i!]} दिखाया गया है।`:`ਰੇਡਾਰ ਚਾਰਟ ਵਿੱਚ ${c(i!)} ਲਈ ${apps[i!]} ਮੁੱਲ ਦਿੱਤਾ ਹੈ।`]);break;
   case "APPROVED_COUNT_FROM_PIE": {const pct=set.pie.slices[i!]!.percent;r=t(q.kind,h?`${c(i!)} के कितने आवेदन स्वीकृत हुए?`:`${c(i!)} ਦੀਆਂ ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਹੋਈਆਂ?`,q.answer,[h?`${c(i!)} का हिस्सा ${totalApproved} स्वीकृत आवेदनों का ${pct}% है।`:`${c(i!)} ਦਾ ਹਿੱਸਾ ${totalApproved} ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦਾ ${pct}% ਹੈ।`,h?`स्वीकृत आवेदन = ${approved[i!]}.`:`ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ = ${approved[i!]}.`]);break;}
   case "CATEGORY_GAP": r=t(q.kind,h?`${c(i!)} में कितने आवेदनों को स्वीकृति नहीं मिली?`:`${c(i!)} ਦੀਆਂ ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੋਈਆਂ?`,q.answer,[h?`प्राप्त = ${apps[i!]}, स्वीकृत = ${approved[i!]}.`:`ਪ੍ਰਾਪਤ = ${apps[i!]}, ਮਨਜ਼ੂਰ = ${approved[i!]}.`,h?`स्वीकृति नहीं मिली = ${apps[i!]} − ${approved[i!]} = ${apps[i!]-approved[i!]}.`:`ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਮਿਲੀ = ${apps[i!]} − ${approved[i!]} = ${apps[i!]-approved[i!]}.`]);break;
   case "CATEGORY_APPROVAL_RATE": r=t(q.kind,h?`${c(i!)} को प्राप्त आवेदनों में से कितने प्रतिशत स्वीकृत हुए?`:`${c(i!)} ਨੂੰ ਮਿਲੀਆਂ ਅਰਜ਼ੀਆਂ ਵਿੱਚੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਮਨਜ਼ੂਰ ਹੋਏ?`,q.answer,[h?`स्वीकृति दर = ${approved[i!]} ÷ ${apps[i!]} × 100 = ${rates[i!]}%.`:`ਮਨਜ਼ੂਰੀ ਦਰ = ${approved[i!]} ÷ ${apps[i!]} × 100 = ${rates[i!]}%.`]);break;
   case "APPLICATION_TO_APPROVAL_RATIO": r=t(q.kind,h?`${c(i!)} में प्राप्त और स्वीकृत आवेदनों का अनुपात क्या है?`:`${c(i!)} ਵਿੱਚ ਪ੍ਰਾਪਤ ਅਤੇ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,q.answer,[`${apps[i!]}:${approved[i!]} = ${q.answer}.`]);break;
   case "TWO_CATEGORY_APPROVED_TOTAL": r=t(q.kind,h?`${c(i!)} और ${c(j!)} में कुल कितने आवेदन स्वीकृत हुए?`:`${c(i!)} ਅਤੇ ${c(j!)} ਦੀਆਂ ਕੁੱਲ ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਹੋਈਆਂ?`,q.answer,[`${approved[i!]} + ${approved[j!]} = ${approved[i!]+approved[j!]}.`]);break;
   case "TWO_CATEGORY_APPLICATION_TOTAL": r=t(q.kind,h?`${c(i!)} और ${c(j!)} में कुल कितने आवेदन प्राप्त हुए?`:`${c(i!)} ਅਤੇ ${c(j!)} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ ਪ੍ਰਾਪਤ ਹੋਈਆਂ?`,q.answer,[`${apps[i!]} + ${apps[j!]} = ${apps[i!]+apps[j!]}.`]);break;
   case "GROUP_APPLICATION_TO_APPROVAL_RATIO": {const a=apps[i!]+apps[j!]!,b=approved[i!]+approved[j!]!;r=t(q.kind,h?`${c(i!)} और ${c(j!)} में प्राप्त आवेदनों की कुल संख्या का स्वीकृत आवेदनों की कुल संख्या से अनुपात क्या है?`:`${c(i!)} ਅਤੇ ${c(j!)} ਵਿੱਚ ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਦਾ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,q.answer,[h?`प्राप्त आवेदनों का कुल = ${a}.`:`ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦਾ ਕੁੱਲ = ${a}.`,h?`स्वीकृत आवेदनों का कुल = ${b}.`:`ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦਾ ਕੁੱਲ = ${b}.`,`अनुपात = ${q.answer}.`]);break;}
   case "TOTAL_APPLICATION_TO_APPROVAL_RATIO": r=t(q.kind,h?`सभी श्रेणियों में प्राप्त आवेदनों की कुल संख्या का स्वीकृत आवेदनों की कुल संख्या से अनुपात क्या है?`:`ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਦਾ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,q.answer,[`${h?"प्राप्त आवेदनों का कुल":"ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦਾ ਕੁੱਲ"} = ${totalApps}.`,`${h?"स्वीकृत आवेदनों का कुल":"ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦਾ ਕੁੱਲ"} = ${totalApproved}.`,`अनुपात = ${q.answer}.`]);break;
   case "CROSS_CATEGORY_APPLICATION_APPROVAL_RATIO": r=t(q.kind,h?`${c(i!)} में प्राप्त आवेदनों का ${c(j!)} में स्वीकृत आवेदनों से अनुपात क्या है?`:`${c(i!)} ਵਿੱਚ ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦਾ ${c(j!)} ਵਿੱਚ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,q.answer,[`${apps[i!]}:${approved[j!]} = ${q.answer}.`]);break;
   case "REJECTED_TO_APPROVED_RATIO": {const rej=apps[i!]-approved[i!]!;r=t(q.kind,h?`${c(i!)} में अस्वीकृत और स्वीकृत आवेदनों का अनुपात क्या है?`:`${c(i!)} ਵਿੱਚ ਰੱਦ ਹੋਈਆਂ ਅਤੇ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,q.answer,[`${h?"जिन्हें स्वीकृति नहीं मिली":"ਜਿਨ੍ਹਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਮਿਲੀ"} = ${apps[i!]} − ${approved[i!]} = ${rej}.`,`अनुपात = ${q.answer}.`]);break;}
   case "TWO_CATEGORY_REJECTED_TOTAL": {const a=apps[i!]-approved[i!]!,b=apps[j!]-approved[j!]!;r=t(q.kind,h?`${c(i!)} और ${c(j!)} में कुल कितने आवेदन अस्वीकृत हुए?`:`${c(i!)} ਅਤੇ ${c(j!)} ਦੀਆਂ ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ ਨੂੰ ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਮਿਲੀ?`,q.answer,[`${c(i!)}: ${a} ${h?"जिन्हें स्वीकृति नहीं मिली":"ਜਿਨ੍ਹਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਮਿਲੀ"}.`,`${c(j!)}: ${b} ${h?"जिन्हें स्वीकृति नहीं मिली":"ਜਿਨ੍ਹਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਮਿਲੀ"}.`,`${h?"कुल":"ਕੁੱਲ"} = ${a+b}.`]);break;}
   case "APPROVAL_RATE_DIFFERENCE": {const v=Math.abs(rates[i!]-rates[j!]);r=t(q.kind,h?`${c(i!)} और ${c(j!)} की स्वीकृति दरों में कितने प्रतिशत-अंकों का अंतर है?`:`${c(i!)} ਅਤੇ ${c(j!)} ਦੀਆਂ ਮਨਜ਼ੂਰੀ ਦਰਾਂ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ-ਅੰਕਾਂ ਦਾ ਫ਼ਰਕ ਹੈ?`,q.answer,[`${h?"दरें":"ਦਰਾਂ"} = ${rates[i!]}% और ${rates[j!]}%.`,`${h?"अंतर":"ਫ਼ਰਕ"} = ${v} ${h?"प्रतिशत-अंक":"ਪ੍ਰਤੀਸ਼ਤ-ਅੰਕ"}.`]);break;}
   case "HIGHEST_APPROVAL_RATE": {const v=Math.max(...rates);r=t(q.kind,h?`पाँचों श्रेणियों में सबसे अधिक स्वीकृति दर क्या है?`:`ਪੰਜਾਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਮਨਜ਼ੂਰੀ ਦਰ ਕੀ ਹੈ?`,q.answer,[...rates.map((x,n)=>`${labels[n]}: ${x}%`),`${h?"सबसे अधिक स्वीकृति दर":"ਸਭ ਤੋਂ ਵੱਧ ਮਨਜ਼ੂਰੀ ਦਰ"} = ${v}%.`]);break;}
  }
  const localizeOption=(value:string)=>value.replace(/^(\d+) percentage points$/u,(_m,n)=>`${n} ${h?"प्रतिशत-अंक":"ਪ੍ਰਤੀਸ਼ਤ-ਅੰਕ"}`);
  return {...q,stem:r.stem,options:q.options.map(localizeOption),answer:localizeOption(q.answer),explanation:{keyIdea:h?"रेडार चार्ट से प्राप्त आवेदनों की संख्या और पाई चार्ट से स्वीकृत आवेदनों की संख्या लें। फिर पूछे गए हिसाब के अनुसार उनकी तुलना करें।":"ਰੇਡਾਰ ਚਾਰਟ ਤੋਂ ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਪਾਈ ਚਾਰਟ ਤੋਂ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ ਲਵੋ। ਫਿਰ ਸਵਾਲ ਅਨੁਸਾਰ ਹਿਸਾਬ ਕਰੋ।",steps:r.steps}};
 });
}

export function localizeDi014Set(set:Di014Set,locale:Di014Locale):Di014Set{
 const h=hi(locale),match=set.radar.title.toLowerCase().match(/^(?:loan )?applications and approvals across five (branches|regions|centres|zones|departments|courses|service units|programmes)/),index=match?["branches","regions","centres","zones","departments","courses","service units","programmes"].indexOf(match[1]!):-1;
 if(!Number.isInteger(index)||index<0)throw new Error(`DI-014 could not resolve localization context from '${set.radar.title}'.`);
 const c=CONTEXT[locale][index]!,labels=c.cats,old=set.radar;
 const radar:Di014RadarStimulus={...old,title:`${c.title} — ${h?"प्राप्त आवेदन":"ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ"}`,instruction:h?"रेडार चार्ट के साथ पाई चार्ट का भी उपयोग कीजिए।":"ਰੇਡਾਰ ਚਾਰਟ ਦੇ ਨਾਲ ਪਾਈ ਚਾਰਟ ਵੀ ਵਰਤੋ।",unit:h?"आवेदन":"ਅਰਜ਼ੀਆਂ",points:old.points.map((p,i)=>({...p,category:labels[i]!}))};
 const pie:Di005V2Stimulus={...set.pie,title:`${c.title} — ${h?"स्वीकृत आवेदनों का वितरण":"ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਵੰਡ"}`,instruction:h?"पाई चार्ट सभी स्वीकृत आवेदनों का वितरण दिखाता है।":"ਪਾਈ ਚਾਰਟ ਸਾਰੀਆਂ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਵੰਡ ਦਿਖਾਉਂਦਾ ਹੈ।",totalLabel:h?"कुल स्वीकृत":"ਕੁੱਲ ਮਨਜ਼ੂਰ",unit:h?"आवेदन":"ਅਰਜ਼ੀਆਂ",description:h?"रेडार चार्ट के साथ उपयोग के लिए पाँच श्रेणियों में स्वीकृत आवेदनों का वितरण।":"ਰੇਡਾਰ ਚਾਰਟ ਨਾਲ ਵਰਤਣ ਲਈ ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਵੰਡ।",slices:set.pie.slices.map((s,i)=>({...s,category:labels[i]!}))};
 return {...set,radar,pie,questions:makeQuestions(set,labels,locale)};
}
