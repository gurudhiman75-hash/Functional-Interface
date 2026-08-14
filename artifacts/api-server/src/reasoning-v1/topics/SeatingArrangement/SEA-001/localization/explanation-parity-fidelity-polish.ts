import type { AuditCaselet, AuditChild } from "../saturation/corpus.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { localizedSea001Name } from "./name-pack.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

function tr(locale: Sea001TranslatedLocale, hi: string, pa: string): string { return locale === "hi-IN" ? hi : pa; }
function n(value: string, locale: Sea001TranslatedLocale): string { return localizedSea001Name(value, locale); }
function countValue(word: string): number {
  const map: Record<string, number> = { one:1,two:2,three:3,four:4,five:5,six:6 };
  const value=map[word.toLowerCase()]; if(!value) throw new Error(`SEA-001 explanation fidelity: unsupported count ${word}`); return value;
}
function side(value:string,locale:Sea001TranslatedLocale):string{return value==="left"?tr(locale,"बाईं ओर","ਖੱਬੇ ਪਾਸੇ"):tr(locale,"दाईं ओर","ਸੱਜੇ ਪਾਸੇ");}
function facing(value:string,locale:Sea001TranslatedLocale):string{return value==="north"?tr(locale,"उत्तर की ओर","ਉੱਤਰ ਵੱਲ"):value==="south"?tr(locale,"दक्षिण की ओर","ਦੱਖਣ ਵੱਲ"):value==="the centre"?tr(locale,"केंद्र की ओर","ਕੇਂਦਰ ਵੱਲ"):tr(locale,"बाहर की ओर","ਬਾਹਰ ਵੱਲ");}
function joinPeople(raw:string,locale:Sea001TranslatedLocale):string{
  const people=[...raw.matchAll(/[A-Z][a-z]+/g)].map((m)=>n(m[0]!,locale));
  if(people.length===1)return people[0]!; if(people.length===2)return `${people[0]} ${tr(locale,"और","ਅਤੇ")} ${people[1]}`;
  return `${people.slice(0,-1).join(", ")} ${tr(locale,"और","ਅਤੇ")} ${people.at(-1)}`;
}

function translateSoAction(block:string,locale:Sea001TranslatedLocale):string|undefined{
  let m:RegExpMatchArray|null;
  m=block.match(/^So: ([A-Z][a-z]+) must be at either the first seat or the last seat\. Keep both possibilities until another clue decides\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[1]!,locale)} पहली या आखिरी सीट पर होगा। जब तक कोई अगला संकेत तय न करे, दोनों संभावनाएँ बनाए रखें।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਪਹਿਲੀ ਜਾਂ ਆਖਰੀ ਸੀਟ 'ਤੇ ਹੋਵੇਗਾ। ਜਦ ਤੱਕ ਕੋਈ ਅਗਲਾ ਸੰਕੇਤ ਫੈਸਲਾ ਨਾ ਕਰੇ, ਦੋਵੇਂ ਸੰਭਾਵਨਾਵਾਂ ਰੱਖੋ।`);

  m=block.match(/^So: First see which way ([A-Z][a-z]+) is facing\. Then count (one|two|three) seats? to \1's (left|right) and put ([A-Z][a-z]+) there\.$/);
  if(m){const c=countValue(m[2]!);return tr(locale,`इसलिए: पहले ${n(m[1]!,locale)} की मुख-दिशा देखें। फिर उसके ${side(m[3]!,locale)} ${c} सीट गिनें और ${n(m[4]!,locale)} को वहाँ रखें।`,`ਇਸ ਲਈ: ਪਹਿਲਾਂ ${n(m[1]!,locale)} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵੇਖੋ। ਫਿਰ ਉਸਦੇ ${side(m[3]!,locale)} ${c} ਸੀਟਾਂ ਗਿਣੋ ਅਤੇ ${n(m[4]!,locale)} ਨੂੰ ਉੱਥੇ ਰੱਖੋ।`);}

  m=block.match(/^So: ([A-Z][a-z]+) must be in a middle seat\. If there are two middle seats, keep both possible for now\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[1]!,locale)} बीच की सीट पर होगा। यदि बीच की दो सीटें हों, अभी दोनों संभावनाएँ रखें।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਵਿਚਕਾਰ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੋਵੇਗਾ। ਜੇ ਵਿਚਕਾਰ ਦੀਆਂ ਦੋ ਸੀਟਾਂ ਹੋਣ, ਹਾਲੇ ਦੋਵੇਂ ਸੰਭਾਵਨਾਵਾਂ ਰੱਖੋ।`);

  m=block.match(/^So: (One|Two|Three|Four|Five) persons? in between means ([A-Z][a-z]+) and ([A-Z][a-z]+) are (two|three|four|five|six) seats apart\. Once one is placed, count \4 seats to place the other\.$/);
  if(m){const between=countValue(m[1]!),distance=countValue(m[4]!);return tr(locale,`इसलिए: बीच में ${between} व्यक्ति होने का अर्थ है कि ${n(m[2]!,locale)} और ${n(m[3]!,locale)} के बीच ${distance} सीटों की दूरी है। एक को रखने के बाद दूसरे को रखने के लिए ${distance} सीट गिनें।`,`ਇਸ ਲਈ: ਵਿਚਕਾਰ ${between} ਵਿਅਕਤੀ ਹੋਣ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ${n(m[2]!,locale)} ਅਤੇ ${n(m[3]!,locale)} ਵਿਚਕਾਰ ${distance} ਸੀਟਾਂ ਦੀ ਦੂਰੀ ਹੈ। ਇੱਕ ਨੂੰ ਰੱਖਣ ਤੋਂ ਬਾਅਦ ਦੂਜੇ ਨੂੰ ਰੱਖਣ ਲਈ ${distance} ਸੀਟਾਂ ਗਿਣੋ।`);}

  m=block.match(/^So: ([A-Z][a-z]+) must sit next to ([A-Z][a-z]+)\. Keep both sides possible for now; another clue may decide the side\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[1]!,locale)} को ${n(m[2]!,locale)} के पास बैठना है। अभी दोनों ओर की संभावना रखें; कोई अगला संकेत सही ओर तय कर सकता है।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਨੂੰ ${n(m[2]!,locale)} ਦੇ ਨਾਲ ਬੈਠਣਾ ਹੈ। ਹਾਲੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਸੰਭਾਵਨਾ ਰੱਖੋ; ਕੋਈ ਅਗਲਾ ਸੰਕੇਤ ਸਹੀ ਪਾਸਾ ਤੈਅ ਕਰ ਸਕਦਾ ਹੈ।`);

  m=block.match(/^So: Put ([A-Z][a-z]+) at the (left|right) end\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[1]!,locale)} को ${m[2]==="left"?"बाएँ":"दाएँ"} छोर पर रखें।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਨੂੰ ${m[2]==="left"?"ਖੱਬੇ":"ਸੱਜੇ"} ਸਿਰੇ 'ਤੇ ਰੱਖੋ।`);

  m=block.match(/^So: ([A-Z][a-z]+) and ([A-Z][a-z]+) cannot sit next to each other\. If one is already placed, the other cannot take either seat beside that person\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[1]!,locale)} और ${n(m[2]!,locale)} पास-पास नहीं बैठ सकते। यदि एक पहले से रखा है, तो दूसरा उसके दोनों साथ वाली सीटों में से किसी पर नहीं बैठ सकता।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਅਤੇ ${n(m[2]!,locale)} ਨਾਲ-ਨਾਲ ਨਹੀਂ ਬੈਠ ਸਕਦੇ। ਜੇ ਇੱਕ ਪਹਿਲਾਂ ਹੀ ਰੱਖਿਆ ਹੈ, ਤਾਂ ਦੂਜਾ ਉਸਦੇ ਦੋਵੇਂ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ ਵਿੱਚੋਂ ਕਿਸੇ 'ਤੇ ਨਹੀਂ ਬੈਠ ਸਕਦਾ।`);

  m=block.match(/^So: Count (\d+) seats from the left end and put ([A-Z][a-z]+) there\.$/);
  if(m)return tr(locale,`इसलिए: बाएँ छोर से ${m[1]} सीट गिनें और ${n(m[2]!,locale)} को वहाँ रखें।`,`ਇਸ ਲਈ: ਖੱਬੇ ਸਿਰੇ ਤੋਂ ${m[1]} ਸੀਟਾਂ ਗਿਣੋ ਅਤੇ ${n(m[2]!,locale)} ਨੂੰ ਉੱਥੇ ਰੱਖੋ।`);

  m=block.match(/^So: Draw ([A-Z][a-z]+)'s arrow facing (north|south|the centre|outward)\. Keep this arrow in mind whenever a left\/right clue uses \1\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[1]!,locale)} का तीर ${facing(m[2]!,locale)} बनाएं। आगे जब भी बाएँ/दाएँ वाला संकेत ${n(m[1]!,locale)} के संदर्भ में आए, इस मुख-दिशा को याद रखें।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਦਾ ਤੀਰ ${facing(m[2]!,locale)} ਬਣਾਓ। ਅੱਗੇ ਜਦੋਂ ਵੀ ਖੱਬੇ/ਸੱਜੇ ਵਾਲਾ ਸੰਕੇਤ ${n(m[1]!,locale)} ਦੇ ਹਵਾਲੇ ਨਾਲ ਆਵੇ, ਇਸ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨੂੰ ਯਾਦ ਰੱਖੋ।`);

  m=block.match(/^So: Put ([A-Z][a-z]+) directly opposite ([A-Z][a-z]+)\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[1]!,locale)} को ${n(m[2]!,locale)} के ठीक सामने रखें।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਨੂੰ ${n(m[2]!,locale)} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਰੱਖੋ।`);

  m=block.match(/^So: Put ([A-Z][a-z]+) in the very next seat clockwise from ([A-Z][a-z]+)\.$/);
  if(m)return tr(locale,`इसलिए: ${n(m[2]!,locale)} से घड़ी की दिशा में ठीक अगली सीट पर ${n(m[1]!,locale)} को रखें।`,`ਇਸ ਲਈ: ${n(m[2]!,locale)} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਿਲਕੁਲ ਅਗਲੀ ਸੀਟ 'ਤੇ ${n(m[1]!,locale)} ਨੂੰ ਰੱਖੋ।`);

  m=block.match(/^So: Start from ([A-Z][a-z]+)\. Count (two|three) seats clockwise and put ([A-Z][a-z]+) there\.$/);
  if(m){const c=countValue(m[2]!);return tr(locale,`इसलिए: ${n(m[1]!,locale)} से शुरू करें। घड़ी की दिशा में ${c} सीट गिनें और ${n(m[3]!,locale)} को वहाँ रखें।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ। ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ${c} ਸੀਟਾਂ ਗਿਣੋ ਅਤੇ ${n(m[3]!,locale)} ਨੂੰ ਉੱਥੇ ਰੱਖੋ।`);}

  m=block.match(/^So: One person in between means ([A-Z][a-z]+) is two seats away from ([A-Z][a-z]+)\. Count two seats clockwise from \2 and put \1 there\.$/);
  if(m)return tr(locale,`इसलिए: बीच में एक व्यक्ति होने का अर्थ है कि ${n(m[1]!,locale)}, ${n(m[2]!,locale)} से दो सीट दूर है। ${n(m[2]!,locale)} से घड़ी की दिशा में दो सीट गिनें और ${n(m[1]!,locale)} को वहाँ रखें।`,`ਇਸ ਲਈ: ਵਿਚਕਾਰ ਇੱਕ ਵਿਅਕਤੀ ਹੋਣ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ${n(m[1]!,locale)}, ${n(m[2]!,locale)} ਤੋਂ ਦੋ ਸੀਟਾਂ ਦੂਰ ਹੈ। ${n(m[2]!,locale)} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸੀਟਾਂ ਗਿਣੋ ਅਤੇ ${n(m[1]!,locale)} ਨੂੰ ਉੱਥੇ ਰੱਖੋ।`);

  m=block.match(/^So: Put ([A-Z][a-z]+) in the seat nearest the (stage|door|entrance)\. Start the circle from this fixed seat\.$/);
  if(m){const place=m[2]==="stage"?tr(locale,"मंच","ਮੰਚ"):m[2]==="door"?tr(locale,"दरवाज़े","ਦਰਵਾਜ਼ੇ"):tr(locale,"प्रवेश-द्वार","ਦਾਖਲਾ");return tr(locale,`इसलिए: ${n(m[1]!,locale)} को ${place} के सबसे पास वाली सीट पर रखें। इसी तय सीट से गोल बनाना शुरू करें।`,`ਇਸ ਲਈ: ${n(m[1]!,locale)} ਨੂੰ ${place} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਰੱਖੋ। ਇਸੇ ਤੈਅ ਸੀਟ ਤੋਂ ਗੋਲ ਬਣਾਉਣਾ ਸ਼ੁਰੂ ਕਰੋ।`);}

  m=block.match(/^So: Mark (.+) facing the centre and (.+) facing outward\. Do this before using the left\/right clues\.$/);
  if(m)return tr(locale,`इसलिए: ${joinPeople(m[1]!,locale)} का मुख केंद्र की ओर और ${joinPeople(m[2]!,locale)} का मुख बाहर की ओर चिन्हित करें। बाएँ/दाएँ वाले संकेत लगाने से पहले यह कर लें।`,`ਇਸ ਲਈ: ${joinPeople(m[1]!,locale)} ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ${joinPeople(m[2]!,locale)} ਦਾ ਮੂੰਹ ਬਾਹਰ ਵੱਲ ਨਿਸ਼ਾਨ ਲਗਾਓ। ਖੱਬੇ/ਸੱਜੇ ਵਾਲੇ ਸੰਕੇਤ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਇਹ ਕਰ ਲਵੋ।`);

  m=block.match(/^So: Draw If ([A-Z][a-z]+) faces (outward|the centre), ([A-Z][a-z]+) faces (outward|the centre); otherwise, \3's arrow facing (outward|the centre)\. Keep this arrow in mind whenever a left\/right clue uses If .+\.$/);
  if(m)return tr(locale,`इसलिए: यदि ${n(m[1]!,locale)} का मुख ${facing(m[2]!,locale)} है, तो ${n(m[3]!,locale)} का मुख ${facing(m[4]!,locale)} रखें; अन्यथा उसका मुख ${facing(m[5]!,locale)} रखें। आगे के बाएँ/दाएँ संकेतों में ${n(m[3]!,locale)} की यह मुख-दिशा याद रखें।`,`ਇਸ ਲਈ: ਜੇ ${n(m[1]!,locale)} ਦਾ ਮੂੰਹ ${facing(m[2]!,locale)} ਹੈ, ਤਾਂ ${n(m[3]!,locale)} ਦਾ ਮੂੰਹ ${facing(m[4]!,locale)} ਰੱਖੋ; ਨਹੀਂ ਤਾਂ ਉਸਦਾ ਮੂੰਹ ${facing(m[5]!,locale)} ਰੱਖੋ। ਅੱਗੇ ਦੇ ਖੱਬੇ/ਸੱਜੇ ਸੰਕੇਤਾਂ ਵਿੱਚ ${n(m[3]!,locale)} ਦੀ ਇਹ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਯਾਦ ਰੱਖੋ।`);

  return undefined;
}

function polishSharedTeachingActions(source:AuditCaselet,candidate:Sea001LocalizedReviewCaselet,locale:Sea001TranslatedLocale):Sea001LocalizedReviewCaselet{
  const englishBlocks=source.sharedExplanation.split("\n\n").map((b)=>b.trim()).filter(Boolean);
  const localizedBlocks=candidate.sharedExplanation.split("\n\n").map((b)=>b.trim()).filter(Boolean);
  if(englishBlocks.length!==localizedBlocks.length)throw new Error(`${source.caseletId}: explanation fidelity shared block mismatch`);
  const output=localizedBlocks.map((localized,index)=>{
    const english=englishBlocks[index]!; if(!english.startsWith("So: "))return localized;
    const translated=translateSoAction(english,locale); if(!translated)throw new Error(`${source.caseletId}: explanation fidelity unsupported So action: ${english}`);
    return translated;
  });
  return {...candidate,sharedExplanation:output.join("\n\n")};
}

function replaceCorrectExplanation(candidate:Sea001LocalizedReviewCaselet,childIndex:number,explanation:string):Sea001LocalizedReviewCaselet{return {...candidate,children:candidate.children.map((child,index)=>index!==childIndex?child:{...child,explanation,options:child.options.map((option,optionIndex)=>optionIndex===child.answerIndex?{...option,explanation}:option)})};}
function qc002Explanation(source:AuditChild,localizedChild:Sea001LocalizedReviewCaselet["children"][number],locale:Sea001TranslatedLocale):string|undefined{const m=source.explanation.match(/^([A-Z][a-z]+) sits in seat (\d+) when we count from the left end, so the answer is (\d+(?:st|nd|rd|th))\.$/);if(!m)return;const answer=localizedChild.options[localizedChild.answerIndex]?.display;if(!answer)return;return tr(locale,`${n(m[1]!,locale)} को बाएँ छोर से गिनने पर वह सीट ${m[2]} पर है, इसलिए उत्तर ${answer} है।`,`${n(m[1]!,locale)} ਨੂੰ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਗਿਣਣ 'ਤੇ ਉਹ ਸੀਟ ${m[2]} 'ਤੇ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`);}
function qc022Explanation(source:AuditChild,locale:Sea001TranslatedLocale):string|undefined{const m=source.explanation.match(/^([A-Z][a-z]+) originally faces (outward|the centre); after everyone changes facing, \1 faces (the centre|outward)\. Under that new facing, left is (clockwise|anticlockwise), so the second person to the left is ([A-Z][a-z]+)\.$/);if(!m)return;const left=m[4]==="clockwise"?tr(locale,"घड़ी की दिशा","ਘੜੀ ਦੀ ਦਿਸ਼ਾ"):tr(locale,"घड़ी की विपरीत दिशा","ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ");return tr(locale,`${n(m[1]!,locale)} का मुख पहले ${facing(m[2]!,locale)} है; सभी की मुख-दिशा बदलने पर उसका मुख ${facing(m[3]!,locale)} हो जाता है। नई मुख-दिशा में बायाँ ${left} है, इसलिए बाईं ओर दूसरा व्यक्ति ${n(m[5]!,locale)} है।`,`${n(m[1]!,locale)} ਦਾ ਮੂੰਹ ਪਹਿਲਾਂ ${facing(m[2]!,locale)} ਹੈ; ਸਭ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲਣ 'ਤੇ ਉਸਦਾ ਮੂੰਹ ${facing(m[3]!,locale)} ਹੋ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਖੱਬਾ ${left} ਹੈ, ਇਸ ਲਈ ਖੱਬੇ ਪਾਸੇ ਦੂਜਾ ਵਿਅਕਤੀ ${n(m[5]!,locale)} ਹੈ।`);}

export function polishSea001ExplanationParityFidelity(source:AuditCaselet,candidate:Sea001LocalizedReviewCaselet,locale:Sea001TranslatedLocale):Sea001LocalizedReviewCaselet{
  let output=polishSharedTeachingActions(source,candidate,locale);
  for(let childIndex=0;childIndex<source.children.length;childIndex+=1){const sourceChild=source.children[childIndex]!,localizedChild=output.children[childIndex]!;let explanation:string|undefined;if(sourceChild.queryContractId==="SEA-QC-002")explanation=qc002Explanation(sourceChild,localizedChild,locale);if(sourceChild.queryContractId==="SEA-QC-022")explanation=qc022Explanation(sourceChild,locale);if(explanation)output=replaceCorrectExplanation(output,childIndex,explanation);}
  return output;
}
