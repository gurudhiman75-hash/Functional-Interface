import type { Di012Question, Di012Set, Di012Stimulus } from "./types";
export type Di012Locale="hi-IN"|"pa-IN";
type C={title:string;a:string;b:string;unitless:string[]};
const CONTEXTS:Record<Di012Locale,C[]>={
 "hi-IN":[
  {title:"बैंक शाखाओं में आवेदन",a:"प्राप्त",b:"स्वीकृत",unitless:["शाखा A","शाखा B","शाखा C","शाखा D","शाखा E"]},
  {title:"बीमा पॉलिसी के रिकॉर्ड",a:"नई पॉलिसियाँ",b:"नवीनीकृत पॉलिसियाँ",unitless:["श्रेणी P","श्रेणी Q","श्रेणी R","श्रेणी S","श्रेणी T"]},
  {title:"प्रशिक्षण बैच",a:"नामांकित",b:"प्रशिक्षण पूरा किया",unitless:["बैच A","बैच B","बैच C","बैच D","बैच E"]},
  {title:"उत्पाद ऑर्डर",a:"ऑर्डर किए",b:"डिलीवर किए",unitless:["वस्तु P","वस्तु Q","वस्तु R","वस्तु S","वस्तु T"]},
  {title:"ऋण प्रक्रिया",a:"आवेदन",b:"स्वीकृत ऋण",unitless:["क्षेत्र A","क्षेत्र B","क्षेत्र C","क्षेत्र D","क्षेत्र E"]},
  {title:"सेवा अनुरोध",a:"प्राप्त हुए",b:"हल किए गए",unitless:["इकाई A","इकाई B","इकाई C","इकाई D","इकाई E"]},
 ],
 "pa-IN":[
  {title:"ਬੈਂਕ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ",a:"ਪ੍ਰਾਪਤ",b:"ਮਨਜ਼ੂਰ",unitless:["ਸ਼ਾਖਾ A","ਸ਼ਾਖਾ B","ਸ਼ਾਖਾ C","ਸ਼ਾਖਾ D","ਸ਼ਾਖਾ E"]},
  {title:"ਬੀਮਾ ਪਾਲਿਸੀਆਂ ਦੇ ਰਿਕਾਰਡ",a:"ਨਵੀਆਂ ਪਾਲਿਸੀਆਂ",b:"ਨਵੀਕਰਨ ਕੀਤੀਆਂ ਪਾਲਿਸੀਆਂ",unitless:["ਸ਼੍ਰੇਣੀ P","ਸ਼੍ਰੇਣੀ Q","ਸ਼੍ਰੇਣੀ R","ਸ਼੍ਰੇਣੀ S","ਸ਼੍ਰੇਣੀ T"]},
  {title:"ਸਿਖਲਾਈ ਬੈਚ",a:"ਦਾਖ਼ਲ",b:"ਸਿਖਲਾਈ ਪੂਰੀ ਕੀਤੀ",unitless:["ਬੈਚ A","ਬੈਚ B","ਬੈਚ C","ਬੈਚ D","ਬੈਚ E"]},
  {title:"ਉਤਪਾਦਾਂ ਦੇ ਆਰਡਰ",a:"ਆਰਡਰ ਕੀਤੇ",b:"ਪਹੁੰਚਾਏ",unitless:["ਵਸਤੂ P","ਵਸਤੂ Q","ਵਸਤੂ R","ਵਸਤੂ S","ਵਸਤੂ T"]},
  {title:"ਕਰਜ਼ਾ ਪ੍ਰਕਿਰਿਆ",a:"ਅਰਜ਼ੀਆਂ",b:"ਮਨਜ਼ੂਰ ਕੀਤੇ ਕਰਜ਼ੇ",unitless:["ਜ਼ੋਨ A","ਜ਼ੋਨ B","ਜ਼ੋਨ C","ਜ਼ੋਨ D","ਜ਼ੋਨ E"]},
  {title:"ਸੇਵਾ ਬੇਨਤੀਆਂ",a:"ਖੋਲ੍ਹੀਆਂ",b:"ਹੱਲ ਕੀਤੀਆਂ",unitless:["ਇਕਾਈ A","ਇਕਾਈ B","ਇਕਾਈ C","ਇਕਾਈ D","ਇਕਾਈ E"]},
 ]
};
const hindi=(l:Di012Locale)=>l==="hi-IN";
function hiddenCells(s:Di012Stimulus){return s.rows.flatMap((r,rowIndex)=>[{value:r.a,column:"a" as const,rowIndex},{value:r.b,column:"b" as const,rowIndex}].filter(x=>x.value==="x"||x.value==="y").map(x=>({variable:x.value as "x"|"y",column:x.column,rowIndex:x.rowIndex})));}
export function localizeDi012Set(set:Di012Set,locale:Di012Locale):Di012Set{
 const h=hindi(locale),idx=["Bank branch applications","Insurance policy records","Training batches","Product orders","Loan processing","Service requests"].indexOf(set.stimulus.title);
 if(idx<0)throw new Error(`Missing DI-012 context localization for '${set.stimulus.title}'.`);
 const ctx=CONTEXTS[locale][idx]!,old=set.stimulus,missing=hiddenCells(old),x=set.solution.x,y=set.solution.y??0;
 const number=(v:number|string)=>v==="x"?x:v==="y"?y:v as number;
 const rows=old.rows.map((r,i)=>({...r,label:ctx.unitless[i]!}));
 const totalA=rows.reduce((s,r)=>s+number(r.a),0),totalB=rows.reduce((s,r)=>s+number(r.b),0),grand=totalA+totalB;
 const recoveryCalc=(variable:"x"|"y"):string[]=>{
  const target=variable==="x"?x:y;
  if(old.modelKind==="SINGLE_X_TOTAL"){const visible=totalB-x;return [`${ctx.b}: ${totalB} − ${visible} = ${x}।`];}
  if(old.modelKind==="X_Y_SUM_DIFFERENCE"){const sum=x+y,diff=Math.abs(x-y);return x>=y?[`x + y = ${sum}; x − y = ${diff}।`,`2x = ${sum+diff}; x = ${x}; y = ${y}।`]:[`x + y = ${sum}; y − x = ${diff}।`,`2y = ${sum+diff}; y = ${y}; x = ${x}।`];}
  if(old.modelKind==="X_Y_RATIO_TOTAL"){const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a,g=gcd(x,y),a=x/g,b=y/g,part=(x+y)/(a+b);return [`x : y = ${a}:${b}; x + y = ${x+y}।`,`${x+y} ÷ ${a+b} = ${part}; x = ${a} × ${part} = ${x}; y = ${b} × ${part} = ${y}।`];}
  if(old.modelKind==="TWO_MISSING_COLUMN_TOTALS"){const m=missing.find(z=>z.variable===variable)!,total=m.column==="a"?totalA:totalB,visible=total-target;return [`${variable} = ${total} − ${visible} = ${target}।`];}
  if(old.modelKind==="MISSING_RATE"){const row=missing[0]!.rowIndex,b=number(rows[row]!.b);return [`x = ${b} × 100 ÷ 75 = ${x}।`];}
  if(old.modelKind==="AVERAGE_CONSTRAINED"){const avg=totalA/5,visible=totalA-x;return [`${avg} × 5 = ${totalA}।`,`x = ${totalA} − ${visible} = ${x}।`];}
  const first=number(rows[0]!.b),delta=x-first;return [`x = ${first} + ${delta} = ${x}।`,`y = 2 × ${x} = ${y}।`];
 };
 let condition="";
 switch(old.modelKind){
  case "SINGLE_X_TOTAL": condition=h?`सभी पाँच पंक्तियों में ${ctx.b} का कुल ${totalB} है।`:`ਪੰਜਾਂ ਕਤਾਰਾਂ ਵਿੱਚ ${ctx.b} ਦਾ ਕੁੱਲ ${totalB} ਹੈ।`;break;
  case "X_Y_SUM_DIFFERENCE": {const sum=x+y,diff=Math.abs(x-y);condition=h?`x + y = ${sum}, और x, y से ${x>=y?diff+" अधिक":diff+" कम"} है।`:`x + y = ${sum}, ਅਤੇ x, y ਨਾਲੋਂ ${diff} ${x>=y?"ਵੱਧ":"ਘੱਟ"} ਹੈ।`;break;}
  case "X_Y_RATIO_TOTAL": {const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a,ratio=`${x/gcd(x,y)}:${y/gcd(x,y)}`;condition=h?`x : y = ${ratio} और x + y = ${x+y}।`:`x : y = ${ratio} ਅਤੇ x + y = ${x+y}।`;break;}
  case "TWO_MISSING_COLUMN_TOTALS": condition=h?`${ctx.a} और ${ctx.b} के कुल क्रमशः ${totalA} और ${totalB} हैं।`:`${ctx.a} ਅਤੇ ${ctx.b} ਦੇ ਕੁੱਲ ਕ੍ਰਮਵਾਰ ${totalA} ਅਤੇ ${totalB} ਹਨ।`;break;
  case "MISSING_RATE": {const row=missing[0]!.rowIndex,pct=Math.round(number(rows[row]!.b)*100/number(rows[row]!.a));condition=h?`${rows[row]!.label} के लिए ${ctx.b}, ${ctx.a} का ${pct}% है।`:`${rows[row]!.label} ਲਈ ${ctx.b}, ${ctx.a} ਦਾ ${pct}% ਹੈ।`;break;}
  case "AVERAGE_CONSTRAINED": {const avg=totalA/5;condition=h?`सभी पाँच पंक्तियों में ${ctx.a} का औसत ${avg} है।`:`ਪੰਜਾਂ ਕਤਾਰਾਂ ਵਿੱਚ ${ctx.a} ਦਾ ਔਸਤ ${avg} ਹੈ।`;break;}
  case "CHAINED_RECOVERY": {const first=number(rows[0]!.b),delta=x-first;condition=h?`x, पहली पंक्ति में ${ctx.b} से ${delta} अधिक है। साथ ही, y = 2 × x।`:`x, ਪਹਿਲੀ ਕਤਾਰ ਵਿੱਚ ${ctx.b} ਨਾਲੋਂ ${delta} ਵੱਧ ਹੈ। ਨਾਲ ਹੀ, y = 2 × x।`;break;}
 }
 const stimulus:Di012Stimulus={...old,title:ctx.title,instruction:h?"तालिका और अतिरिक्त शर्त का अध्ययन कीजिए, फिर प्रश्नों के उत्तर दीजिए।":"ਸਾਰਣੀ ਅਤੇ ਵਾਧੂ ਸ਼ਰਤ ਪੜ੍ਹੋ, ਫਿਰ ਸਵਾਲਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",columnA:ctx.a,columnB:ctx.b,categoryHeader:h?"श्रेणी":"ਸ਼੍ਰੇਣੀ",conditionHeader:h?"अतिरिक्त जानकारी":"ਵਾਧੂ ਜਾਣਕਾਰੀ",rows,condition};
 const questions=set.questions.map(q=>{
  const primary=missing[0]!,second=missing[1],p=rows[primary.rowIndex]!,fallback=rows[(primary.rowIndex+2)%rows.length]!,s=second?rows[second.rowIndex]!:fallback;
  const cell=(r:typeof p,col:"a"|"b")=>number(r[col]);
  const describe=(v:"x"|"y")=>{const m=missing.find(item=>item.variable===v)??primary,row=rows[m.rowIndex]!,header=m.column==="a"?ctx.a:ctx.b;return h?`${row.label} में "${header}" वाला मान`:`${row.label} ਵਿੱਚ "${header}" ਵਾਲਾ ਮੁੱਲ`;};
  const cellTotal=(r:typeof p)=>cell(r,"a")+cell(r,"b");
  let stem="",steps:string[]=[];
  switch(q.kind){
   case "RECOVER_X": stem=h?`${describe("x")} क्या है?`:`${describe("x")} ਕੀ ਹੈ?`;steps=recoveryCalc("x");break;
   case "RECOVER_Y": stem=h?`${describe("y")} क्या है?`:`${describe("y")} ਕੀ ਹੈ?`;steps=recoveryCalc("y");break;
   case "UNKNOWN_SUM": stem=h?`${describe("x")} और ${describe("y")} का योग कितना है?`:`${describe("x")} ਅਤੇ ${describe("y")} ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;steps=[`x + y = ${x} + ${y} = ${x+y}।`];break;
   case "UNKNOWN_DIFFERENCE": stem=h?`${describe("x")} और ${describe("y")} के मानों में कितना अंतर है?`:`${describe("x")} ਅਤੇ ${describe("y")} ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਫ਼ਰਕ ਹੈ?`;steps=[`|${x} − ${y}| = ${Math.abs(x-y)}।`];break;
   case "UNKNOWN_RATIO": {const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;stem=h?`${describe("x")} और ${describe("y")} के मानों का अनुपात क्या है?`:`${describe("x")} ਅਤੇ ${describe("y")} ਦੇ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[`x : y = ${x}:${y} = ${x/gcd(x,y)}:${y/gcd(x,y)}।`];break;}
   case "RECOVERED_ROW_TOTAL": {const total=cellTotal(p);stem=h?`तालिका में ${p.label} के दोनों मानों का योग कितना है?`:`ਸਾਰਣੀ ਵਿੱਚ ${p.label} ਦੇ ਦੋਵਾਂ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;steps=[h?`पहले ${p.label} का अज्ञात मान ज्ञात करें।`:`ਪਹਿਲਾਂ ${p.label} ਦਾ ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ।`,`${cell(p,"a")} + ${cell(p,"b")} = ${total}।`];break;}
   case "RECOVERED_COLUMN_TOTAL": {const column=primary.column,label=column==="a"?ctx.a:ctx.b,total=column==="a"?totalA:totalB;stem=h?`तालिका में “${label}” वाले सभी मानों का योग कितना है?`:`ਸਾਰਣੀ ਵਿੱਚ “${label}” ਵਾਲੇ ਸਾਰੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;steps=[h?`पहले ${label} वाले खाने का लुप्त मान ज्ञात करें।`:`ਪਹਿਲਾਂ ${label} ਵਾਲਾ ਗੁੰਮ ਮੁੱਲ ਕੱਢੋ।`,h?`पाँचों ${label} मान जोड़ने पर ${total} मिलता है।`:`ਪੰਜਾਂ ${label} ਮੁੱਲਾਂ ਨੂੰ ਜੋੜਿਆਂ ${total} ਬਣਦਾ ਹੈ।`];break;}
   case "RECOVERED_SHARE_OF_TOTAL": {const rowTotal=cellTotal(p),share=Math.round(rowTotal*100/grand);stem=h?`कुल योग में ${p.label} का हिस्सा लगभग कितने प्रतिशत है?`:`ਕੁੱਲ ਜੋੜ ਵਿੱਚ ${p.label} ਦਾ ਹਿੱਸਾ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`;steps=[h?`${p.label} का अज्ञात मान ज्ञात करें।`:`${p.label} ਦਾ ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ।`,`${p.label} का कुल = ${cell(p,"a")} + ${cell(p,"b")} = ${rowTotal}।`,`${h?"बड़ा कुल":"ਵੱਡਾ ਕੁੱਲ"} = ${grand}।`,`${h?"हिस्सा":"ਹਿੱਸਾ"} ≈ ${share}%।`];break;}
   case "CROSS_ROW_RATIO_AFTER_RECOVERY": {const a=cellTotal(p),b=cellTotal(s);stem=h?`${p.label} और ${s.label} के कुलों का अनुपात क्या है?`:`${p.label} ਅਤੇ ${s.label} ਦੇ ਕੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[`${p.label} का कुल = ${a}।`,`${s.label} का कुल = ${b}।`,`${h?"अनुपात":"ਅਨੁਪਾਤ"} = ${q.answer}।`];break;}
   case "COMBINED_RECOVERED_PERCENT": {const share=Math.round((x+y)*100/grand);stem=h?`दोनों लुप्त मानों का योग पूरी तालिका के कुल का लगभग कितना प्रतिशत है?`:`ਦੋਵੇਂ ਗੁੰਮ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਪੂਰੀ ਸਾਰਣੀ ਦੇ ਕੁੱਲ ਦਾ ਲਗਭਗ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`;steps=[`x + y = ${x+y}।`,`${h?"बड़ा कुल":"ਵੱਡਾ ਕੁੱਲ"} = ${grand}।`,`${h?"आवश्यक प्रतिशत":"ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ"} ≈ ${share}%।`];break;}
  }
  return {...q,stem,explanation:{keyIdea:h?"पहले दी गई शर्त और तालिका से अज्ञात मान निकालें। फिर पूछा गया हिसाब करें।":"ਪਹਿਲਾਂ ਦਿੱਤੀ ਸ਼ਰਤ ਅਤੇ ਸਾਰਣੀ ਤੋਂ ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ। ਫਿਰ ਪੁੱਛਿਆ ਹਿਸਾਬ ਕਰੋ।",steps}};
 });
 return {...set,stimulus,questions};
}
