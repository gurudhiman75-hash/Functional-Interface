import type { Di013Question, Di013Set, Di013Stimulus } from "./types";

export type Di013Locale = "hi-IN" | "pa-IN";
type Copy = { title: string; a: string; b: string; unit: string; categories: string[] };
const COPY: Record<string, Record<Di013Locale, Copy>> = {
  PRODUCT_OUTPUT: {
    "hi-IN": { title: "दो वर्षों में पाँच उत्पादों का उत्पादन", a: "वर्ष 1", b: "वर्ष 2", unit: "इकाइयाँ", categories: ["उत्पाद P", "उत्पाद Q", "उत्पाद R", "उत्पाद S", "उत्पाद T"] },
    "pa-IN": { title: "ਦੋ ਸਾਲਾਂ ਵਿੱਚ ਪੰਜ ਉਤਪਾਦਾਂ ਦਾ ਉਤਪਾਦਨ", a: "ਸਾਲ 1", b: "ਸਾਲ 2", unit: "ਇਕਾਈਆਂ", categories: ["ਉਤਪਾਦ P", "ਉਤਪਾਦ Q", "ਉਤਪਾਦ R", "ਉਤਪਾਦ S", "ਉਤਪਾਦ T"] },
  },
  BRANCH_CASES: {
    "hi-IN": { title: "दो अवधियों में पाँच शाखाओं द्वारा निपटाए गए मामले", a: "अवधि 1", b: "अवधि 2", unit: "मामले", categories: ["शाखा A", "शाखा B", "शाखा C", "शाखा D", "शाखा E"] },
    "pa-IN": { title: "ਦੋ ਮਿਆਦਾਂ ਵਿੱਚ ਪੰਜ ਸ਼ਾਖਾਵਾਂ ਵੱਲੋਂ ਨਿਪਟਾਏ ਮਾਮਲੇ", a: "ਮਿਆਦ 1", b: "ਮਿਆਦ 2", unit: "ਮਾਮਲੇ", categories: ["ਸ਼ਾਖਾ A", "ਸ਼ਾਖਾ B", "ਸ਼ਾਖਾ C", "ਸ਼ਾਖਾ D", "ਸ਼ਾਖਾ E"] },
  },
  DEPARTMENT_TARGETS: {
    "hi-IN": { title: "पाँच विभागों द्वारा पूरे किए गए लक्ष्य", a: "टीम A", b: "टीम B", unit: "अंक", categories: ["बिक्री", "संचालन", "सहायता", "लेखा", "सेवा"] },
    "pa-IN": { title: "ਪੰਜ ਵਿਭਾਗਾਂ ਵੱਲੋਂ ਪੂਰੇ ਕੀਤੇ ਟੀਚੇ", a: "ਟੀਮ A", b: "ਟੀਮ B", unit: "ਅੰਕ", categories: ["ਵਿਕਰੀ", "ਕਾਰਜ", "ਸਹਾਇਤਾ", "ਲੇਖਾ", "ਸੇਵਾ"] },
  },
  COURSE_ENROLMENT: {
    "hi-IN": { title: "पाँच पाठ्यक्रमों में नामांकन", a: "सत्र 1", b: "सत्र 2", unit: "छात्र", categories: ["पाठ्यक्रम A", "पाठ्यक्रम B", "पाठ्यक्रम C", "पाठ्यक्रम D", "पाठ्यक्रम E"] },
    "pa-IN": { title: "ਪੰਜ ਕੋਰਸਾਂ ਵਿੱਚ ਦਾਖ਼ਲਾ", a: "ਸੈਸ਼ਨ 1", b: "ਸੈਸ਼ਨ 2", unit: "ਵਿਦਿਆਰਥੀ", categories: ["ਕੋਰਸ A", "ਕੋਰਸ B", "ਕੋਰਸ C", "ਕੋਰਸ D", "ਕੋਰਸ E"] },
  },
  REGION_SALES: {
    "hi-IN": { title: "पाँच क्षेत्रों में बिक्री", a: "तिमाही 1", b: "तिमाही 2", unit: "इकाइयाँ", categories: ["उत्तर", "दक्षिण", "पूर्व", "पश्चिम", "मध्य"] },
    "pa-IN": { title: "ਪੰਜ ਖੇਤਰਾਂ ਵਿੱਚ ਵਿਕਰੀ", a: "ਤਿਮਾਹੀ 1", b: "ਤਿਮਾਹੀ 2", unit: "ਇਕਾਈਆਂ", categories: ["ਉੱਤਰ", "ਦੱਖਣ", "ਪੂਰਬ", "ਪੱਛਮ", "ਕੇਂਦਰੀ"] },
  },
  SERVICE_METRICS: {
    "hi-IN": { title: "पाँच टीमों द्वारा हल किए गए सेवा अनुरोध", a: "चक्र 1", b: "चक्र 2", unit: "अनुरोध", categories: ["टीम A", "टीम B", "टीम C", "टीम D", "टीम E"] },
    "pa-IN": { title: "ਪੰਜ ਟੀਮਾਂ ਵੱਲੋਂ ਹੱਲ ਕੀਤੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ", a: "ਚੱਕਰ 1", b: "ਚੱਕਰ 2", unit: "ਬੇਨਤੀਆਂ", categories: ["ਟੀਮ A", "ਟੀਮ B", "ਟੀਮ C", "ਟੀਮ D", "ਟੀਮ E"] },
  },
  WAREHOUSE_DISPATCH: {
    "hi-IN": { title: "पाँच गोदामों से भेजे गए पार्सल", a: "सप्ताह 1", b: "सप्ताह 2", unit: "पार्सल", categories: ["गोदाम A", "गोदाम B", "गोदाम C", "गोदाम D", "गोदाम E"] },
    "pa-IN": { title: "ਪੰਜ ਗੋਦਾਮਾਂ ਤੋਂ ਭੇਜੇ ਪਾਰਸਲ", a: "ਹਫ਼ਤਾ 1", b: "ਹਫ਼ਤਾ 2", unit: "ਪਾਰਸਲ", categories: ["ਗੋਦਾਮ A", "ਗੋਦਾਮ B", "ਗੋਦਾਮ C", "ਗੋਦਾਮ D", "ਗੋਦਾਮ E"] },
  },
  SCHEME_COVERAGE: {
    "hi-IN": { title: "पाँच योजनाओं के अंतर्गत शामिल लाभार्थी", a: "चरण 1", b: "चरण 2", unit: "लाभार्थी", categories: ["योजना A", "योजना B", "योजना C", "योजना D", "योजना E"] },
    "pa-IN": { title: "ਪੰਜ ਯੋਜਨਾਵਾਂ ਅਧੀਨ ਸ਼ਾਮਲ ਲਾਭਪਾਤਰੀ", a: "ਪੜਾਅ 1", b: "ਪੜਾਅ 2", unit: "ਲਾਭਪਾਤਰੀ", categories: ["ਯੋਜਨਾ A", "ਯੋਜਨਾ B", "ਯੋਜਨਾ C", "ਯੋਜਨਾ D", "ਯੋਜਨਾ E"] },
  },
};
const H = (locale: Di013Locale) => locale === "hi-IN";
const categoryPositions = (stem: string, source: Di013Stimulus) => source.points.map((p, i) => ({ name: p.category, i, at: stem.indexOf(p.category) })).filter(x => x.at >= 0).sort((a,b) => a.at-b.at);
const seriesPositions = (stem: string, source: Di013Stimulus) => [source.seriesALabel, source.seriesBLabel].map((name,i)=>({name,i,at:stem.indexOf(name)})).filter(x=>x.at>=0).sort((a,b)=>a.at-b.at);

function translatedQuestion(q: Di013Question, source: Di013Stimulus, locale: Di013Locale, labels: string[], series: [string,string]): Di013Question {
  const hi=H(locale), values=source.points;
  const c=(n:number)=>labels[n]!; const p=(n:number)=>values[n]!; const name=(n:number)=>series[n]!;
  const catIds=categoryPositions(q.stem,source).map(x=>x.i); const seriesIds=seriesPositions(q.stem,source).map(x=>x.i);
  let stem="", steps:string[]=[];
  switch(q.kind){
    case "DIRECT_SERIES_VALUE": { const i=catIds[0]!, s=seriesIds[0]!, v=s===0?p(i).seriesA:p(i).seriesB; stem=hi?`${c(i)} श्रेणी में ${name(s)} का मान कितना है?`:`${c(i)} ਸ਼੍ਰੇਣੀ ਵਿੱਚ ${name(s)} ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`; steps=[hi?`${c(i)} का ${name(s)} वाला बिंदु ${v} पर है।`:`${c(i)} ਲਈ ${name(s)} ਦਾ ਬਿੰਦੂ ${v} 'ਤੇ ਹੈ।`]; break; }
    case "HIGHEST_VALUE_FOR_SERIES": { const s=seriesIds[0]!, best=q.answer, max=Math.max(...values.map(x=>s===0?x.seriesA:x.seriesB)); stem=hi?`${name(s)} का सबसे अधिक मान किस श्रेणी में है?`:`${name(s)} ਦਾ ਸਭ ਤੋਂ ਵੱਧ ਮੁੱਲ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਹੈ?`; steps=[hi?`${name(s)} का सबसे अधिक मान ${max} है, जो ${best} के लिए है।`:`${name(s)} ਦਾ ਸਭ ਤੋਂ ਵੱਧ ਮੁੱਲ ${max} ਹੈ, ਜੋ ${best} ਲਈ ਹੈ।`]; break; }
    case "SAME_CATEGORY_DIFFERENCE": {const i=catIds[0]!, a=p(i).seriesA,b=p(i).seriesB,v=Math.abs(a-b);stem=hi?`${c(i)} में ${name(0)} और ${name(1)} के मानों का अंतर कितना है?`:`${c(i)} ਵਿੱਚ ${name(0)} ਅਤੇ ${name(1)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਫ਼ਰਕ ਕਿੰਨਾ ਹੈ?`;steps=[hi?`अंतर = |${a} − ${b}| = ${v}।`:`ਫ਼ਰਕ = |${a} − ${b}| = ${v}।`];break;}
    case "SAME_CATEGORY_COMBINED_TOTAL": {const i=catIds[0]!,a=p(i).seriesA,b=p(i).seriesB,v=a+b;stem=hi?`${c(i)} श्रेणी में ${name(0)} और ${name(1)} के मानों का योग कितना है?`:`${c(i)} ਸ਼੍ਰੇਣੀ ਵਿੱਚ ${name(0)} ਅਤੇ ${name(1)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;steps=[`${a} + ${b} = ${v}।`];break;}
    case "WITHIN_SERIES_RATIO": {const [i,j]=catIds,[s]=seriesIds;const a=s===0?p(i!).seriesA:p(i!).seriesB,b=s===0?p(j!).seriesA:p(j!).seriesB;stem=hi?`${name(s!)} में ${c(i!)} और ${c(j!)} के मानों का अनुपात क्या है?`:`${name(s!)} ਵਿੱਚ ${c(i!)} ਅਤੇ ${c(j!)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[hi?`अनुपात = ${a}:${b} = ${q.answer}।`:`ਅਨੁਪਾਤ = ${a}:${b} = ${q.answer}।`];break;}
    case "THREE_CATEGORY_SERIES_TOTAL": {const [i,j,k]=catIds,[s]=seriesIds;const vals=[i,j,k].map(n=>s===0?p(n!).seriesA:p(n!).seriesB),sum=vals.reduce((a,b)=>a+b,0);stem=hi?`${name(s!)} के लिए ${c(i!)}, ${c(j!)} और ${c(k!)} के मानों का योग कितना है?`:`${name(s!)} ਲਈ ${c(i!)}, ${c(j!)} ਅਤੇ ${c(k!)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;steps=[`${vals.join(" + ")} = ${sum}।`];break;}
    case "SERIES_TOTAL_DIFFERENCE": {const a=values.reduce((s,x)=>s+x.seriesA,0),b=values.reduce((s,x)=>s+x.seriesB,0),v=Math.abs(a-b);stem=hi?`${name(0)} और ${name(1)} के कुलों में कितना अंतर है?`:`${name(0)} ਅਤੇ ${name(1)} ਦੇ ਕੁੱਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਫ਼ਰਕ ਹੈ?`;steps=[`${name(0)} का कुल = ${a}।`,`${name(1)} का कुल = ${b}।`,`${hi?"अंतर":"ਫ਼ਰਕ"} = ${v}।`];break;}
    case "TWO_CATEGORY_GROUP_RATIO": {const [i,j,k,l]=catIds,a=p(i!).seriesA+p(j!).seriesA,b=p(k!).seriesB+p(l!).seriesB;stem=hi?`इन श्रेणियों में ${name(0)} के मानों का योग (${c(i!)} और ${c(j!)}) तथा ${name(1)} के मानों का योग (${c(k!)} और ${c(l!)}) का अनुपात क्या है?`:`ਇਨ੍ਹਾਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ${name(0)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ (${c(i!)} ਅਤੇ ${c(j!)}) ਅਤੇ ${name(1)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ (${c(k!)} ਅਤੇ ${c(l!)}) ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[`${hi?"पहले समूह का कुल":"ਪਹਿਲੇ ਸਮੂਹ ਦਾ ਕੁੱਲ"} = ${a}।`,`${hi?"दूसरे समूह का कुल":"ਦੂਜੇ ਸਮੂਹ ਦਾ ਕੁੱਲ"} = ${b}।`,`${hi?"अनुपात":"ਅਨੁਪਾਤ"} = ${q.answer}।`];break;}
    case "TOTAL_SERIES_RATIO": {const a=values.reduce((s,x)=>s+x.seriesA,0),b=values.reduce((s,x)=>s+x.seriesB,0);stem=hi?`${name(0)} और ${name(1)} के कुल मानों का अनुपात क्या है?`:`${name(0)} ਅਤੇ ${name(1)} ਦੇ ਕੁੱਲ ਮੁੱਲਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[hi?`दोनों कुल ${a} और ${b} हैं।`:`ਦੋਵੇਂ ਕੁੱਲ ${a} ਅਤੇ ${b} ਹਨ।`,`${hi?"अनुपात":"ਅਨੁਪਾਤ"} = ${q.answer}।`];break;}
    case "FOUR_VALUE_CROSS_TOTAL": {const [i,j,k,l]=catIds;const vals=[p(i!).seriesA,p(j!).seriesB,p(k!).seriesA,p(l!).seriesB],sum=vals.reduce((a,b)=>a+b,0);stem=hi?`${c(i!)} में ${name(0)}, ${c(j!)} में ${name(1)}, ${c(k!)} में ${name(0)} और ${c(l!)} में ${name(1)} के मानों का योग कितना है?`:`${c(i!)} ਵਿੱਚ ${name(0)}, ${c(j!)} ਵਿੱਚ ${name(1)}, ${c(k!)} ਵਿੱਚ ${name(0)} ਅਤੇ ${c(l!)} ਵਿੱਚ ${name(1)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`;steps=[`${vals.join(" + ")} = ${sum}।`];break;}
    case "CROSS_SERIES_CATEGORY_RATIO": {const [i,j]=catIds;const a=p(i!).seriesA,b=p(j!).seriesB;stem=hi?`${c(i!)} के लिए ${name(0)} के मान का ${c(j!)} के लिए ${name(1)} के मान से अनुपात क्या है?`:`${c(i!)} ਲਈ ${name(0)} ਦੇ ਮੁੱਲ ਦਾ ${c(j!)} ਲਈ ${name(1)} ਦੇ ਮੁੱਲ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;steps=[`${a}:${b} = ${q.answer}।`];break;}
    case "COMBINED_CATEGORY_MAXIMUM": {const totals=values.map(x=>x.seriesA+x.seriesB),max=Math.max(...totals);stem=hi?`किस श्रेणी में ${name(0)} और ${name(1)} के मानों का योग सबसे अधिक है?`:`ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ${name(0)} ਅਤੇ ${name(1)} ਦੇ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ਸਭ ਤੋਂ ਵੱਧ ਹੈ?`;steps=[...totals.map((v,i)=>`${labels[i]}: ${v}`),`${hi?"सबसे अधिक संयुक्त मान":"ਸਭ ਤੋਂ ਵੱਧ ਜੋੜਿਆ ਮੁੱਲ"} = ${max}।`];break;}
    case "COUNT_A_EXCEEDS_B": {const n=values.filter(x=>x.seriesA>x.seriesB).length;stem=hi?`कितनी श्रेणियों में ${name(0)} का मान ${name(1)} से अधिक है?`:`ਕਿੰਨੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ${name(0)} ਦਾ ਮੁੱਲ ${name(1)} ਤੋਂ ਵੱਧ ਹੈ?`;steps=[...values.map((x,i)=>`${labels[i]}: ${x.seriesA} ${hi?"बनाम":"ਬਨਾਮ"} ${x.seriesB}`),`${hi?"श्रेणियों की संख्या":"ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਗਿਣਤੀ"} = ${n}।`];break;}
    case "NET_SERIES_ADVANTAGE": {const a=values.reduce((s,x)=>s+x.seriesA,0),b=values.reduce((s,x)=>s+x.seriesB,0),v=Math.abs(a-b);stem=hi?`${name(0)} और ${name(1)} के कुल योगों में कितना अंतर है?`:`${name(0)} ਅਤੇ ${name(1)} ਦੇ ਕੁੱਲ ਜੋੜਾਂ ਵਿੱਚ ਕਿੰਨਾ ਫ਼ਰਕ ਹੈ?`;steps=[`${name(0)} का कुल = ${a}।`,`${name(1)} का कुल = ${b}।`,`${hi?"निरपेक्ष अंतर":"ਕੁੱਲ ਫ਼ਰਕ"} = ${v}।`];break;}
  }
  const options=q.options.map(option=>{const index=source.points.findIndex(point=>point.category===option);return index>=0?labels[index]!:option;});
  const answerIndex=source.points.findIndex(point=>point.category===q.answer);
  return {...q,stem,options,answer:answerIndex>=0?labels[answerIndex]!:q.answer,explanation:{keyIdea:hi?"रेडार चार्ट पर हर बिंदु का मान पढ़ें, फिर पूछा गया जोड़ या तुलना करें।":"ਰੇਡਾਰ ਚਾਰਟ 'ਤੇ ਹਰ ਬਿੰਦੂ ਦਾ ਮੁੱਲ ਪੜ੍ਹੋ, ਫਿਰ ਪੁੱਛਿਆ ਗਿਆ ਜੋੜ ਜਾਂ ਤੁਲਨਾ ਕਰੋ।",steps}};
}

export function localizeDi013Set(set: Di013Set, locale: Di013Locale): Di013Set {
  const c=COPY[set.stimulus.contextId]?.[locale]; if(!c) throw new Error(`Missing DI-013 copy for ${set.stimulus.contextId}/${locale}`);
  const source=set.stimulus;
  const stimulus:Di013Stimulus={...source,title:c.title,instruction:H(locale)?"रेडार चार्ट का अध्ययन कीजिए और प्रश्नों के उत्तर दीजिए।":"ਰੇਡਾਰ ਚਾਰਟ ਵੇਖੋ ਅਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",seriesALabel:c.a,seriesBLabel:c.b,unit:c.unit,points:source.points.map((p,i)=>({...p,category:c.categories[i]!}))};
  return {...set,stimulus,questions:set.questions.map(q=>translatedQuestion(q,source,locale,c.categories,[c.a,c.b]))};
}
