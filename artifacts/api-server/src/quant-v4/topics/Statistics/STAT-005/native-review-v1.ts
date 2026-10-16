import type { Stat005Question } from "./types";
import { getStat005PermanentQlForContract } from "./permanent-ql-registry";
import { solveStat005State } from "./partition-dispersion";
export function normalizeStat005Language(value?: string): "en" | "hi" | "pa" {
  const lang = (value ?? "en").trim().toLowerCase();
  if (lang !== "en" && lang !== "hi" && lang !== "pa") throw new Error(`Unsupported STAT-005 language: ${lang}`);
  return lang;
}
const fmt = (n: number) => String(Math.round(n * 100) / 100);
export function localizeStat005Question(q: Stat005Question, language: "hi" | "pa") {
  if (q.packageId !== "STAT-005" || q.language !== "en" || getStat005PermanentQlForContract(q.contractId).qlId !== q.qlId || q.options[q.correctIndex] !== q.answer || fmt(solveStat005State(q.state, q.contractId)) !== q.answer) throw new Error("Invalid STAT-005 native source");
  const pa = language === "pa";
  const t = (hi: string, punjabi: string) => pa ? punjabi : hi;
  const s = q.state;
  let stem = "", explanation = "";
  const table = (rows: readonly (readonly (number|string)[])[], grouped=false) => [`| ${grouped?t("वर्ग अंतराल", "ਵਰਗ ਅੰਤਰਾਲ"):t("मान", "ਮੁੱਲ")} | ${t("बारंबारता", "ਬਾਰੰਬਾਰਤਾ")} |`, "|---:|---:|", ...rows.map(r=>`| ${r.join(" | ")} |`)].join("\n");
  const partition = (values: readonly number[], k: number, m: number) => {
    const position = Math.max(1, Math.min(values.length, k*(values.length+1)/m));
    const i = Math.floor(position)-1, fraction = position-Math.floor(position);
    const low = values[i]!, high = values[Math.min(i+1, values.length-1)]!;
    return { position, value: low+fraction*(high-low), work: `${fmt(low)} + ${fmt(fraction)} × (${fmt(high)} − ${fmt(low)})` };
  };
  if (s.kind === "RAW_PARTITION" || s.kind === "DISCRETE_PARTITION" || s.kind === "GROUPED_PARTITION") {
    const k=s.numerator, m=s.denominator, label=`${m===4?"Q":m===10?"D":"P"}${k}`;
    if (s.kind === "RAW_PARTITION") {
      const r=partition(s.values,k,m);
      stem=t(`क्रमबद्ध प्रेक्षण ${s.values.join(", ")} दिए हैं। k(n + 1)/m स्थान नियम तथा आवश्यकतानुसार रैखिक अंतर्वेशन से ${label} ज्ञात कीजिए।`, `ਕ੍ਰਮਬੱਧ ਨਿਰੀਖਣ ${s.values.join(", ")} ਦਿੱਤੇ ਹਨ। k(n + 1)/m ਸਥਾਨ ਨਿਯਮ ਅਤੇ ਲੋੜ ਅਨੁਸਾਰ ਰੇਖੀ ਅੰਤਰਵੇਸ਼ਣ ਨਾਲ ${label} ਪਤਾ ਕਰੋ।`);
      explanation=t(`${label} का स्थान`,`${label} ਦਾ ਸਥਾਨ`)+` = ${k} × (${s.values.length} + 1)/${m} = ${fmt(r.position)}.\n${label} = ${r.work} = ${fmt(r.value)}.`;
    } else if (s.kind === "DISCRETE_PARTITION") {
      const n=s.rows.reduce((a,r)=>a+r.frequency,0), rank=Math.ceil(k*n/m); let total=0;
      const cf=s.rows.map(r=>total+=r.frequency);
      stem=t(`क्रमबद्ध बारंबारता वितरण में N = ${n} है। निकटतम रैंक नियम ceil(kN/m) से ${label} ज्ञात कीजिए।`, `ਕ੍ਰਮਬੱਧ ਬਾਰੰਬਾਰਤਾ ਵੰਡ ਵਿੱਚ N = ${n} ਹੈ। ਨਜ਼ਦੀਕੀ ਰੈਂਕ ਨਿਯਮ ceil(kN/m) ਨਾਲ ${label} ਪਤਾ ਕਰੋ।`)+"\n"+table(s.rows.map(r=>[r.value,r.frequency]));
      explanation=t("रैंक", "ਰੈਂਕ")+` = ceil(${k} × ${n}/${m}) = ${rank}.\n`+t(`संचयी बारंबारताएँ ${cf.join(", ")} हैं। रैंक ${rank} का मान ${q.answer} है।`,`ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾਵਾਂ ${cf.join(", ")} ਹਨ। ਰੈਂਕ ${rank} ਦਾ ਮੁੱਲ ${q.answer} ਹੈ।`);
    } else {
      const n=s.classes.reduce((a,r)=>a+r.frequency,0), target=k*n/m; let before=0;
      const row=s.classes.find(r=>{if(target<=before+r.frequency)return true;before+=r.frequency;return false;})!;
      stem=t(`समूहीकृत वितरण में kN/m स्थान पर अंतर्वेशन करके ${label} ज्ञात कीजिए।`,`ਸਮੂਹਬੱਧ ਵੰਡ ਵਿੱਚ kN/m ਸਥਾਨ ਉੱਤੇ ਅੰਤਰਵੇਸ਼ਣ ਨਾਲ ${label} ਪਤਾ ਕਰੋ।`)+"\n"+table(s.classes.map(r=>[`${r.lower}–${r.upper}`,r.frequency]),true);
      explanation=`N = ${n}. `+t("लक्षित स्थान", "ਟੀਚਾ ਸਥਾਨ")+` = ${k} × ${n}/${m} = ${fmt(target)}.\n`+t(`संबंधित वर्ग ${row.lower}–${row.upper} है; पूर्व संचयी बारंबारता ${before}, वर्ग बारंबारता ${row.frequency} और वर्ग चौड़ाई ${row.upper-row.lower} है।`,`ਸੰਬੰਧਿਤ ਵਰਗ ${row.lower}–${row.upper} ਹੈ; ਪਿਛਲੀ ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ${before}, ਵਰਗ ਬਾਰੰਬਾਰਤਾ ${row.frequency} ਅਤੇ ਵਰਗ ਚੌੜਾਈ ${row.upper-row.lower} ਹੈ।`)+`\n${label} = ${row.lower} + [(${fmt(target)} − ${before})/${row.frequency}] × ${row.upper-row.lower} ≈ ${q.answer}.`;
    }
  } else if(s.kind === "RAW_RANGE") {
    const min=Math.min(...s.values),max=Math.max(...s.values), coefficient=q.contractId==="COEFFICIENT_OF_RANGE";
    stem=coefficient?t(`न्यूनतम और अधिकतम प्रेक्षण ${min} और ${max} हैं। परास गुणांक प्रतिशत में ज्ञात कीजिए।`,`ਘੱਟੋ-ਘੱਟ ਅਤੇ ਵੱਧੋ-ਵੱਧ ਨਿਰੀਖਣ ${min} ਅਤੇ ${max} ਹਨ। ਪਰਾਸ ਗੁਣਾਂਕ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਪਤਾ ਕਰੋ।`):t(`प्रेक्षण ${s.values.join(", ")} का परास ज्ञात कीजिए।`,`ਨਿਰੀਖਣ ${s.values.join(", ")} ਦਾ ਪਰਾਸ ਪਤਾ ਕਰੋ।`);
    explanation=coefficient?t("परास गुणांक", "ਪਰਾਸ ਗੁਣਾਂਕ")+` = (${max} − ${min})/(${max} + ${min}) × 100 ≈ ${q.answer}%.`:t("परास = अधिकतम − न्यूनतम", "ਪਰਾਸ = ਵੱਧੋ-ਵੱਧ − ਘੱਟੋ-ਘੱਟ")+` = ${max} − ${min} = ${q.answer}.`;
  } else if(s.kind === "RAW_QUARTILE_DEVIATION") {
    const a=partition(s.values,1,4),b=partition(s.values,3,4);
    stem=t(`क्रमबद्ध प्रेक्षण ${s.values.join(", ")} के लिए k(n + 1)/4 स्थान नियम तथा रैखिक अंतर्वेशन से चतुर्थक विचलन ज्ञात कीजिए।`,`ਕ੍ਰਮਬੱਧ ਨਿਰੀਖਣ ${s.values.join(", ")} ਲਈ k(n + 1)/4 ਸਥਾਨ ਨਿਯਮ ਅਤੇ ਰੇਖੀ ਅੰਤਰਵੇਸ਼ਣ ਨਾਲ ਚਤੁਰਥਕ ਵਿਚਲਨ ਪਤਾ ਕਰੋ।`);
    explanation=`Q1: (n + 1)/4 = ${a.position}, Q1 = ${a.value}.\nQ3: 3(n + 1)/4 = ${b.position}, Q3 = ${b.value}.\n`+t("चतुर्थक विचलन", "ਚਤੁਰਥਕ ਵਿਚਲਨ")+` = (Q3 − Q1)/2 = (${b.value} − ${a.value})/2 = ${q.answer}.`;
  } else if(s.kind === "COEFFICIENT_QUARTILE_DEVIATION") {
    stem=t(`Q1 = ${s.q1} और Q3 = ${s.q3} हैं। चतुर्थक विचलन गुणांक प्रतिशत में ज्ञात कीजिए।`,`Q1 = ${s.q1} ਅਤੇ Q3 = ${s.q3} ਹਨ। ਚਤੁਰਥਕ ਵਿਚਲਨ ਗੁਣਾਂਕ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਪਤਾ ਕਰੋ।`);
    explanation=t("चतुर्थक विचलन गुणांक", "ਚਤੁਰਥਕ ਵਿਚਲਨ ਗੁਣਾਂਕ")+` = (Q3 − Q1)/(Q3 + Q1) × 100 = (${s.q3} − ${s.q1})/(${s.q3} + ${s.q1}) × 100 ≈ ${q.answer}%.`;
  } else if(s.kind === "RAW_MEAN_DEVIATION") {
    const mean=s.about==="mean", base=mean?s.values.reduce((a,b)=>a+b,0)/s.values.length:([...s.values].sort((a,b)=>a-b)[Math.floor((s.values.length-1)/2)]! + [...s.values].sort((a,b)=>a-b)[Math.ceil((s.values.length-1)/2)]!)/2;
    const name=mean?t("अंकगणितीय माध्य", "ਅੰਕਗਣਿਤਕ ਮੱਧਮਾਨ"):t("माध्यिका", "ਮੱਧਿਕਾ"), deviations=s.values.map(v=>Math.abs(v-base));
    stem=t(`प्रेक्षण ${s.values.join(", ")} के लिए ${name} के सापेक्ष माध्य विचलन ज्ञात कीजिए।`,`ਨਿਰੀਖਣ ${s.values.join(", ")} ਲਈ ${name} ਦੇ ਸਾਪੇਖ ਮੱਧਮਾਨ ਵਿਚਲਨ ਪਤਾ ਕਰੋ।`);
    explanation=`${name} = ${fmt(base)}.\n`+t("निरपेक्ष विचलन", "ਨਿਰਪੇਖ ਵਿਚਲਨ")+`: ${deviations.map(fmt).join(", ")}.\n`+t("माध्य विचलन", "ਮੱਧਮਾਨ ਵਿਚਲਨ")+` = (${deviations.map(fmt).join(" + ")})/${s.values.length} = ${q.answer}.`;
  } else {
    stem=t(`अंकगणितीय माध्य ${s.mean} और समष्टि मानक विचलन ${s.populationStandardDeviation} है। विचरण गुणांक प्रतिशत में ज्ञात कीजिए।`,`ਅੰਕਗਣਿਤਕ ਮੱਧਮਾਨ ${s.mean} ਅਤੇ ਸਮਸ਼ਟੀ ਮਿਆਰੀ ਵਿਚਲਨ ${s.populationStandardDeviation} ਹੈ। ਵਿਚਰਣ ਗੁਣਾਂਕ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਪਤਾ ਕਰੋ।`);
    explanation=t("विचरण गुणांक = मानक विचलन/माध्य × 100", "ਵਿਚਰਣ ਗੁਣਾਂਕ = ਮਿਆਰੀ ਵਿਚਲਨ/ਮੱਧਮਾਨ × 100")+` = ${s.populationStandardDeviation}/${s.mean} × 100 ≈ ${q.answer}%.`;
  }
  return {...q, sourceQuestionId:q.questionId, questionId:`${q.questionId}:${language}:native-v1`, language, stem, text:stem, explanation, canonicalAnswer:{kind:"numeric" as const,value:q.answer,display:q.answer,rendered:q.answer,rounding:"source" as const}, options:[...q.options] as [string,string,string,string], runtimeMode:"STAT005_NATIVE_REVIEW_V1", reviewStatus:"NATIVE_REVIEW_CANDIDATE", manualApprovalRequired:true};
}
