import type { AuditCaselet, AuditChild, AuditOption } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import { localizedSea001Name, SEA001_REVIEW_CANONICAL_NAMES } from "./name-pack.ts";
import { buildSea001LocalizedReviewCandidate, type Sea001LocalizedReviewCaselet } from "./review-projection.ts";
import {
  nativeDirectionRule,
  nativeNamesIn,
  nativeOrdinal,
  nativeTerm,
  renderNativeClue,
  renderNativeQuestion,
  renderNativeSetup,
} from "./native-sentence-kit.ts";

const NAME_SET = new Set<string>(SEA001_REVIEW_CANONICAL_NAMES);

function tr(locale: Sea001TranslatedLocale, hi: string, pa: string): string {
  return nativeTerm(locale, hi, pa);
}

function nativeName(value: string, locale: Sea001TranslatedLocale): string {
  return localizedSea001Name(value, locale);
}

function wordOrdinalToRaw(value: string): string {
  const map: Record<string, string> = {
    first:"1st", second:"2nd", third:"3rd", fourth:"4th", fifth:"5th",
    sixth:"6th", seventh:"7th", eighth:"8th", ninth:"9th", tenth:"10th",
  };
  const raw=map[value.toLowerCase()];
  if(!raw) throw new Error(`SEA-001 native renderer: unsupported ordinal word ${value}`);
  return raw;
}

function renderNativeOptionDisplay(display: string, locale: Sea001TranslatedLocale): string {
  if (/^\d+$/.test(display)) return display;
  if (/^\d+(?:st|nd|rd|th)$/.test(display)) return nativeOrdinal(display, locale);
  if (NAME_SET.has(display)) return nativeName(display, locale);
  if (display.includes(" → ")) {
    return display.split(" → ").map((value) => {
      if (!NAME_SET.has(value)) throw new Error(`SEA-001 native renderer: unexpected sequence token ${value}`);
      return nativeName(value, locale);
    }).join(" → ");
  }
  if (/ sits /.test(display) && display.endsWith(".")) return renderNativeClue(display, locale).text;
  if (display.includes(" and ")) {
    const parts=display.split(" and ");
    if(parts.length===2 && parts.every((part)=>NAME_SET.has(part))) {
      return `${nativeName(parts[0]!,locale)} ${tr(locale,"और","ਅਤੇ")} ${nativeName(parts[1]!,locale)}`;
    }
  }
  const relation=display.match(/^(Immediately|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth) to the (left|right)$/i);
  if(relation) {
    const dir=relation[2]!.toLowerCase()==="left"?tr(locale,"बाईं ओर","ਖੱਬੇ ਪਾਸੇ"):tr(locale,"दाईं ओर","ਸੱਜੇ ਪਾਸੇ");
    if(relation[1]!.toLowerCase()==="immediately") return tr(locale,`ठीक ${dir}`,`ਬਿਲਕੁਲ ${dir}`);
    return tr(locale,`${dir} ${nativeOrdinal(wordOrdinalToRaw(relation[1]!),locale)}`,`${dir} ${nativeOrdinal(wordOrdinalToRaw(relation[1]!),locale)}`);
  }
  throw new Error(`SEA-001 native renderer: unsupported option display: ${display}`);
}

function qOrdinal(question:string):string|undefined {
  return question.match(/\b(\d+(?:st|nd|rd|th))\b/)?.[1];
}

function nativeChildExplanation(canonical: AuditCaselet, child: AuditChild, correctDisplay: string, locale: Sea001TranslatedLocale): string {
  const people=nativeNamesIn(child.text).map((person)=>nativeName(person,locale));
  const answer=correctDisplay;
  switch(child.queryContractId) {
    case "SEA-QC-001":
      return tr(locale,`${answer} अंतिम पंक्ति की सबसे बाईं सीट पर बैठा है।`,`${answer} ਅੰਤਿਮ ਕਤਾਰ ਦੀ ਸਭ ਤੋਂ ਖੱਬੀ ਸੀਟ 'ਤੇ ਬੈਠਾ ਹੈ।`);
    case "SEA-QC-002":
      return tr(locale,`${people[0]} को बाएँ छोर से गिनने पर उसका स्थान ${answer} है।`,`${people[0]} ਨੂੰ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਗਿਣਣ 'ਤੇ ਉਸਦਾ ਸਥਾਨ ${answer} ਹੈ।`);
    case "SEA-QC-003": {
      const ord=qOrdinal(child.text); const side=/ to the left of /.test(child.text)?tr(locale,"बाईं ओर","ਖੱਬੇ ਪਾਸੇ"):tr(locale,"दाईं ओर","ਸੱਜੇ ਪਾਸੇ");
      const step=ord?nativeOrdinal(ord,locale):tr(locale,"पूछे गए","ਪੁੱਛੇ ਗਏ");
      const facingNote=canonical.checkpointId==="SEA-CP-002"?tr(locale,"पहले संदर्भ व्यक्ति की मुख-दिशा देखकर बायाँ/दायाँ तय करें। ","ਪਹਿਲਾਂ ਹਵਾਲਾ ਦਿੱਤੇ ਵਿਅਕਤੀ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵੇਖ ਕੇ ਖੱਬਾ/ਸੱਜਾ ਤੈਅ ਕਰੋ। "):"";
      return tr(locale,`${facingNote}${people[0]} के ${side} ${step} स्थान पर ${answer} बैठा है।`,`${facingNote}${people[0]} ਦੇ ${side} ${step} ਸਥਾਨ 'ਤੇ ${answer} ਬੈਠਾ ਹੈ।`);
    }
    case "SEA-QC-004": {
      const ord=qOrdinal(child.text);
      return tr(locale,`${people[0]} से घड़ी की दिशा में ${ord?nativeOrdinal(ord,locale):"पूछे गए"} स्थान तक गिनने पर ${answer} मिलता है।`,`${people[0]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ${ord?nativeOrdinal(ord,locale):"ਪੁੱਛੇ ਗਏ"} ਸਥਾਨ ਤੱਕ ਗਿਣਣ 'ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`);
    }
    case "SEA-QC-005":
      return tr(locale,`पहले ${people[0]} की मुख-दिशा देखें। उसकी ठीक दाईं ओर वाली सीट पर ${answer} बैठा है।`, `ਪਹਿਲਾਂ ${people[0]} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵੇਖੋ। ਉਸਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ${answer} ਬੈਠਾ ਹੈ।`);
    case "SEA-QC-006":
      return tr(locale,`${answer} वे दो व्यक्ति हैं जो ${people[0]} के दोनों ओर ठीक साथ वाली सीटों पर बैठे हैं।`,`${answer} ਉਹ ਦੋ ਵਿਅਕਤੀ ਹਨ ਜੋ ${people[0]} ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਬਿਲਕੁਲ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ 'ਤੇ ਬੈਠੇ ਹਨ।`);
    case "SEA-QC-008":
      return tr(locale,`${people[0]} और ${people[1]} को छोड़कर केवल बीच की सीटें गिनें। बीच में ${answer} व्यक्ति हैं।`,`${people[0]} ਅਤੇ ${people[1]} ਨੂੰ ਛੱਡ ਕੇ ਸਿਰਫ਼ ਵਿਚਕਾਰ ਵਾਲੀਆਂ ਸੀਟਾਂ ਗਿਣੋ। ਵਿਚਕਾਰ ${answer} ਵਿਅਕਤੀ ਹਨ।`);
    case "SEA-QC-009":
      return tr(locale,`${people[2]} से घड़ी की दिशा में चलें और दोनों दिए व्यक्तियों को गिनती में शामिल न करें। बीच में ${answer} व्यक्ति आते हैं।`,`${people[2]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲੋ ਅਤੇ ਦੋਵੇਂ ਦਿੱਤੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਨਾ ਕਰੋ। ਵਿਚਕਾਰ ${answer} ਵਿਅਕਤੀ ਆਉਂਦੇ ਹਨ।`);
    case "SEA-QC-010": {
      const count=canonical.topologySnapshot?.seatCount;
      return count
        ? tr(locale,`${count} सीटों के गोल में सामने वाली सीट आधे गोल, यानी ${count/2} सीट दूर होती है। ${people[0]} के सामने ${answer} बैठा है।`,`${count} ਸੀਟਾਂ ਦੇ ਗੋਲ ਵਿੱਚ ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ ਅੱਧੇ ਗੋਲ, ਅਰਥਾਤ ${count/2} ਸੀਟਾਂ ਦੂਰ ਹੁੰਦੀ ਹੈ। ${people[0]} ਦੇ ਸਾਹਮਣੇ ${answer} ਬੈਠਾ ਹੈ।`)
        : tr(locale,`${people[0]} के ठीक सामने ${answer} बैठा है।`,`${people[0]} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ${answer} ਬੈਠਾ ਹੈ।`);
    }
    case "SEA-QC-015":
      return tr(locale,`${people[1]} की मुख-दिशा से देखकर ${people[0]} की स्थिति ${answer} है।`,`${people[1]} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੋਂ ਵੇਖਣ 'ਤੇ ${people[0]} ਦੀ ਸਥਿਤੀ ${answer} ਹੈ।`);
    case "SEA-QC-016":
      return tr(locale,`अंतिम व्यवस्था में “${answer}” सही बैठता है। इसलिए यही सही कथन है।`,`ਅੰਤਿਮ ਵਿਵਸਥਾ ਵਿੱਚ “${answer}” ਸਹੀ ਬੈਠਦਾ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਕਥਨ ਹੈ।`);
    case "SEA-QC-017":
      return tr(locale,`अंतिम व्यवस्था में “${answer}” सही नहीं है। इसलिए यही गलत कथन है।`,`ਅੰਤਿਮ ਵਿਵਸਥਾ ਵਿੱਚ “${answer}” ਸਹੀ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਗਲਤ ਕਥਨ ਹੈ।`);
    case "SEA-QC-019":
      return tr(locale,`${answer} का बैठने का संबंध बाकी तीन जोड़ियों से अलग है। इसलिए यही अलग जोड़ी है।`,`${answer} ਦਾ ਬੈਠਣ ਵਾਲਾ ਸਬੰਧ ਬਾਕੀ ਤਿੰਨ ਜੋੜਿਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਵੱਖਰਾ ਜੋੜਾ ਹੈ।`);
    case "SEA-QC-020":
      return /clockwise/i.test(child.text)
        ? tr(locale,`${people[0]} के बाद घड़ी की दिशा में अगली तीन सीटें पढ़ने पर क्रम ${answer} मिलता है।`,`${people[0]} ਤੋਂ ਬਾਅਦ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਗਲੀਆਂ ਤਿੰਨ ਸੀਟਾਂ ਪੜ੍ਹਣ 'ਤੇ ਕ੍ਰਮ ${answer} ਮਿਲਦਾ ਹੈ।`)
        : tr(locale,`अंतिम पंक्ति को बाएँ छोर से पढ़ने पर पहले तीन व्यक्तियों का क्रम ${answer} है।`,`ਅੰਤਿਮ ਕਤਾਰ ਨੂੰ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਪੜ੍ਹਣ 'ਤੇ ਪਹਿਲੇ ਤਿੰਨ ਵਿਅਕਤੀਆਂ ਦਾ ਕ੍ਰਮ ${answer} ਹੈ।`);
    case "SEA-QC-021":
      return tr(locale,`${people[0]} और ${people[1]} की सीटें बदलने पर बाएँ छोर वाली सीट पर ${answer} आ जाता है।`,`${people[0]} ਅਤੇ ${people[1]} ਦੀਆਂ ਸੀਟਾਂ ਬਦਲਣ 'ਤੇ ਖੱਬੇ ਸਿਰੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ${answer} ਆ ਜਾਂਦਾ ਹੈ।`);
    case "SEA-QC-022": {
      const ord=qOrdinal(child.text);
      return tr(locale,`सभी की मुख-दिशा बदलने पर ${people[0]} की नई दिशा उलट जाती है। नई दिशा के अनुसार बाईं ओर ${ord?nativeOrdinal(ord,locale):"पूछे गए"} स्थान पर ${answer} बैठा है।`,`ਸਭ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲਣ 'ਤੇ ${people[0]} ਦੀ ਨਵੀਂ ਦਿਸ਼ਾ ਉਲਟ ਜਾਂਦੀ ਹੈ। ਨਵੀਂ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਖੱਬੇ ਪਾਸੇ ${ord?nativeOrdinal(ord,locale):"ਪੁੱਛੇ ਗਏ"} ਸਥਾਨ 'ਤੇ ${answer} ਬੈਠਾ ਹੈ।`);
    }
    default:
      throw new Error(`${canonical.caseletId}: native explanation unsupported query ${child.queryContractId}`);
  }
}

function wrongOptionExplanation(child: AuditChild, optionDisplay: string, correctDisplay: string, locale: Sea001TranslatedLocale): string {
  switch(child.queryContractId) {
    case "SEA-QC-016":
      return tr(locale,`“${optionDisplay}” अंतिम व्यवस्था से मेल नहीं खाता। सही कथन “${correctDisplay}” है।`,`“${optionDisplay}” ਅੰਤਿਮ ਵਿਵਸਥਾ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ। ਸਹੀ ਕਥਨ “${correctDisplay}” ਹੈ।`);
    case "SEA-QC-017":
      return tr(locale,`“${optionDisplay}” अंतिम व्यवस्था में सही है, इसलिए इसे गलत कथन नहीं चुन सकते। गलत कथन “${correctDisplay}” है।`,`“${optionDisplay}” ਅੰਤਿਮ ਵਿਵਸਥਾ ਵਿੱਚ ਸਹੀ ਹੈ, ਇਸ ਲਈ ਇਸਨੂੰ ਗਲਤ ਕਥਨ ਨਹੀਂ ਚੁਣ ਸਕਦੇ। ਗਲਤ ਕਥਨ “${correctDisplay}” ਹੈ।`);
    case "SEA-QC-019":
      return tr(locale,`${optionDisplay} का संबंध बाकी सामान्य जोड़ियों जैसा है। अलग संबंध वाली जोड़ी ${correctDisplay} है।`,`${optionDisplay} ਦਾ ਸਬੰਧ ਬਾਕੀ ਆਮ ਜੋੜਿਆਂ ਵਰਗਾ ਹੈ। ਵੱਖਰੇ ਸਬੰਧ ਵਾਲਾ ਜੋੜਾ ${correctDisplay} ਹੈ।`);
    default:
      return tr(locale,`यह विकल्प ${optionDisplay} देता है, लेकिन अंतिम व्यवस्था में सही उत्तर ${correctDisplay} है।`,`ਇਹ ਵਿਕਲਪ ${optionDisplay} ਦਿੰਦਾ ਹੈ, ਪਰ ਅੰਤਿਮ ਵਿਵਸਥਾ ਵਿੱਚ ਸਹੀ ਉੱਤਰ ${correctDisplay} ਹੈ।`);
  }
}

function renderNativeDiagram(canonical: AuditCaselet, locale: Sea001TranslatedLocale): string {
  const raw=canonical.diagramText ?? canonical.diagram?.text ?? "";
  if(!raw) return "";
  if(canonical.checkpointId==="SEA-CP-001") {
    const personLine=raw.split("\n").find((line)=>line.startsWith("Person:"));
    const facingLine=raw.split("\n").find((line)=>line.startsWith("Facing:"));
    if(!personLine || !facingLine) throw new Error(`${canonical.caseletId}: native diagram could not parse CP001 row`);
    const people=personLine.replace(/^Person:\s*/,"").split("|").map((v)=>v.trim());
    const arrows=facingLine.replace(/^Facing:\s*/,"").split("|").map((v)=>v.trim());
    const seats=people.map((person,index)=>`${index+1}:${nativeName(person,locale)}${arrows[index]??""}`);
    return `${tr(locale,"अंतिम पंक्ति","ਅੰਤਿਮ ਕਤਾਰ")}: ${seats.join(" | ")}`;
  }
  if(canonical.checkpointId==="SEA-CP-002") {
    const parts=[...raw.matchAll(/(\d+):([A-Z][a-z]+)([↑↓])/g)];
    if(!parts.length) throw new Error(`${canonical.caseletId}: native diagram could not parse CP002 row`);
    return `${tr(locale,"अंतिम पंक्ति","ਅੰਤਿਮ ਕਤਾਰ")}: ${parts.map((m)=>`${m[1]}:${nativeName(m[2]!,locale)}${m[3]}`).join(" | ")}`;
  }
  const body=raw.includes(":")?raw.slice(raw.indexOf(":")+1):raw;
  const ordered=nativeNamesIn(body);
  if(!ordered.length) throw new Error(`${canonical.caseletId}: native diagram could not recover circular order`);
  if(canonical.checkpointId==="SEA-CP-005") {
    const faceByName=new Map<string,string>();
    for(const m of body.matchAll(/([A-Z][a-z]+)[^→|\n]*?\b(centre|outward)\b/g)) faceByName.set(m[1]!,m[2]!);
    const tokens=ordered.map((person)=>{
      const f=faceByName.get(person);
      if(!f) return nativeName(person,locale);
      return `${nativeName(person,locale)} (${f==="centre"?tr(locale,"केंद्र की ओर","ਕੇਂਦਰ ਵੱਲ"):tr(locale,"बाहर की ओर","ਬਾਹਰ ਵੱਲ")})`;
    });
    return `${tr(locale,"घड़ी की दिशा में अंतिम क्रम","ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅੰਤਿਮ ਕ੍ਰਮ")}: ${tokens.join(" → ")}`;
  }
  return `${tr(locale,"घड़ी की दिशा में अंतिम क्रम","ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅੰਤਿਮ ਕ੍ਰਮ")}: ${ordered.map((person)=>nativeName(person,locale)).join(" → ")}`;
}

function renderSharedExplanation(canonical: AuditCaselet, locale: Sea001TranslatedLocale, diagramText:string): string {
  const lines:string[]=[nativeDirectionRule(canonical,locale),tr(locale,"अब संकेतों को एक-एक करके लगाएँ:","ਹੁਣ ਸੰਕੇਤਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਲਗਾਓ:")];
  canonical.clueTexts.forEach((clue,index)=>{
    const rendered=renderNativeClue(clue,locale);
    lines.push(`${index+1}. ${rendered.text}`);
    lines.push(`   ${tr(locale,"करें","ਕਰੋ")}: ${rendered.action}`);
  });
  lines.push(tr(locale,"इन सभी संकेतों को मिलाने पर केवल एक व्यवस्था बचती है।","ਇਨ੍ਹਾਂ ਸਾਰੇ ਸੰਕੇਤਾਂ ਨੂੰ ਮਿਲਾਉਣ 'ਤੇ ਸਿਰਫ਼ ਇੱਕ ਵਿਵਸਥਾ ਬਚਦੀ ਹੈ।"));
  if(diagramText) lines.push(diagramText);
  return lines.join("\n");
}

function renderNativeChild(canonical:AuditCaselet, source:AuditChild, base:AuditChild, locale:Sea001TranslatedLocale):AuditChild {
  const optionDisplays=source.options.map((option)=>renderNativeOptionDisplay(option.display,locale));
  const correctDisplay=optionDisplays[source.answerIndex]!;
  const explanation=nativeChildExplanation(canonical,source,correctDisplay,locale);
  const options=base.options.map((option,index):AuditOption=>({
    ...option,
    display:optionDisplays[index]!,
    explanation:option.isCorrect?explanation:wrongOptionExplanation(source,optionDisplays[index]!,correctDisplay,locale),
  }));
  return {...base,text:renderNativeQuestion(source,locale),explanation,options};
}

export function buildSea001NativeReviewV2(canonical:AuditCaselet,locale:Sea001TranslatedLocale):Sea001LocalizedReviewCaselet {
  const base=buildSea001LocalizedReviewCandidate(canonical,locale);
  const clueTexts=canonical.clueTexts.map((clue)=>renderNativeClue(clue,locale).text);
  const diagramText=renderNativeDiagram(canonical,locale);
  const diagram=base.diagram?{...base.diagram,text:diagramText}:base.diagram;
  return {
    ...base,
    setupText:renderNativeSetup(canonical,locale),
    clueTexts,
    sharedExplanation:renderSharedExplanation(canonical,locale,diagramText),
    diagramText,
    diagram,
    children:canonical.children.map((child,index)=>renderNativeChild(canonical,child,base.children[index]!,locale)),
  };
}
