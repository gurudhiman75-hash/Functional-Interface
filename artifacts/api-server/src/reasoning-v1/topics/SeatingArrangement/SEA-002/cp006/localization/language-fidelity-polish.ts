import { canonicalDigest } from "../../../SEA-001/canonical.ts";
import { localizedSea001Name } from "../../../SEA-001/localization/name-pack.ts";
import type { Sea002Cp006Caselet } from "../types.ts";
import { localizeCp006CorrectedReviewCaselet, type Cp006CorrectedRationaleKind } from "./rationale-fidelity-polish.ts";
import type { Sea002Cp006LocalizedReviewCaselet } from "./candidate-localizer.ts";
import type { Sea002Cp006TranslatedLocale } from "./readiness.ts";

export type { Cp006CorrectedRationaleKind };
export { cp006CorrectedRationaleMatch, cp006TeachingSkeleton, localizeCp006CorrectedRationale } from "./rationale-fidelity-polish.ts";

function esc(value:string):string{return value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}

export function polishCp006LocalizedLearnerText(text:string,caselet:Sea002Cp006Caselet,locale:Sea002Cp006TranslatedLocale):string{
  let output=text;
  for(const canonical of caselet.people){
    const person=localizedSea001Name(canonical,locale);
    const token=esc(person);
    if(locale==="hi-IN"){
      output=output
        .replace(new RegExp(`${token} मिलता है`,"gu"),`${person} का स्थान मिलता है`)
        .replace(new RegExp(`${token} (उत्तर|दक्षिण) की ओर मुख किए है`,"gu"),`${person} का मुख $1 की ओर है`);
    }else{
      output=output
        .replace(new RegExp(`${token} ਮਿਲਦਾ ਹੈ`,"gu"),`${person} ਦਾ ਸਥਾਨ ਮਿਲਦਾ ਹੈ`)
        .replace(new RegExp(`${token} (ਉੱਤਰ|ਦੱਖਣ) ਵੱਲ ਮੂੰਹ ਕਰਦਾ ਹੈ`,"gu"),`${person} ਦਾ ਮੂੰਹ $1 ਵੱਲ ਹੈ`);
    }
  }
  if(locale==="hi-IN"){
    output=output
      .replaceAll("और उत्तर की ओर मुख किए है","और उनका मुख उत्तर की ओर है")
      .replaceAll("और दक्षिण की ओर मुख किए है","और उनका मुख दक्षिण की ओर है");
  }else{
    output=output
      .replaceAll("ਅਤੇ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਦਾ ਹੈ","ਅਤੇ ਮੂੰਹ ਉੱਤਰ ਵੱਲ ਹੈ")
      .replaceAll("ਅਤੇ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਦਾ ਹੈ","ਅਤੇ ਮੂੰਹ ਦੱਖਣ ਵੱਲ ਹੈ");
  }
  return output;
}

export function localizeCp006PolishedReviewCaselet(caselet:Sea002Cp006Caselet,locale:Sea002Cp006TranslatedLocale):Sea002Cp006LocalizedReviewCaselet{
  const base=localizeCp006CorrectedReviewCaselet(caselet,locale);
  const polish=(text:string)=>polishCp006LocalizedLearnerText(text,caselet,locale);
  const children=base.children.map((child)=>Object.freeze({
    ...child,
    text:polish(child.text),
    explanation:polish(child.explanation),
    options:child.options.map((option)=>Object.freeze({...option,explanation:polish(option.explanation)})) as unknown as typeof child.options,
  })) as unknown as Sea002Cp006LocalizedReviewCaselet["children"];
  const setupText=polish(base.setupText);
  const clueTexts=Object.freeze(base.clueTexts.map(polish));
  const sharedExplanation=polish(base.sharedExplanation);
  const diagramText=polish(base.diagramText);
  const presentationFingerprint=canonicalDigest({locale,setupText,clueTexts,sharedExplanation,teachingSkeleton:base.teachingSkeleton,diagramText,children});
  return Object.freeze({...base,setupText,clueTexts,sharedExplanation,diagramText,children,presentationFingerprint});
}

export function cp006HasKnownGenderedParticipantSurface(text:string):boolean{
  return /मिलता है|ਮਿਲਦਾ ਹੈ|मुख किए है|ਮੂੰਹ ਕਰਦਾ ਹੈ/u.test(text);
}
