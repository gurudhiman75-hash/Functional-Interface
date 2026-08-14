import type { AuditCaselet, AuditChild } from "../saturation/corpus.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { localizedSea001Name } from "./name-pack.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

function tr(locale: Sea001TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function replaceCorrectExplanation(
  candidate: Sea001LocalizedReviewCaselet,
  childIndex: number,
  explanation: string,
): Sea001LocalizedReviewCaselet {
  return {
    ...candidate,
    children: candidate.children.map((child, index) => {
      if (index !== childIndex) return child;
      return {
        ...child,
        explanation,
        options: child.options.map((option, optionIndex) => optionIndex === child.answerIndex
          ? { ...option, explanation }
          : option),
      };
    }),
  };
}

function qc002Explanation(
  source: AuditChild,
  localizedChild: Sea001LocalizedReviewCaselet["children"][number],
  locale: Sea001TranslatedLocale,
): string | undefined {
  const match = source.explanation.match(/^([A-Z][a-z]+) sits in seat (\d+) when we count from the left end, so the answer is (\d+(?:st|nd|rd|th))\.$/);
  if (!match) return undefined;
  const person = localizedSea001Name(match[1]!, locale);
  const answerDisplay = localizedChild.options[localizedChild.answerIndex]?.display;
  if (!answerDisplay) return undefined;
  return tr(
    locale,
    `${person} को बाएँ छोर से गिनने पर वह सीट ${match[2]} पर है, इसलिए उत्तर ${answerDisplay} है।`,
    `${person} ਨੂੰ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਗਿਣਣ 'ਤੇ ਉਹ ਸੀਟ ${match[2]} 'ਤੇ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ${answerDisplay} ਹੈ।`,
  );
}

function qc022Explanation(source: AuditChild, locale: Sea001TranslatedLocale): string | undefined {
  const match = source.explanation.match(
    /^([A-Z][a-z]+) originally faces (outward|the centre); after everyone changes facing, \1 faces (the centre|outward)\. Under that new facing, left is (clockwise|anticlockwise), so the second person to the left is ([A-Z][a-z]+)\.$/,
  );
  if (!match) return undefined;
  const person = localizedSea001Name(match[1]!, locale);
  const answer = localizedSea001Name(match[5]!, locale);
  const original = match[2] === "the centre"
    ? tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ")
    : tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ");
  const changed = match[3] === "the centre"
    ? tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ")
    : tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ");
  const leftDirection = match[4] === "clockwise"
    ? tr(locale, "घड़ी की दिशा", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ")
    : tr(locale, "घड़ी की विपरीत दिशा", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ");
  return tr(
    locale,
    `${person} का मुख पहले ${original} है; सभी की मुख-दिशा बदलने पर उसका मुख ${changed} हो जाता है। नई मुख-दिशा में बायाँ ${leftDirection} है, इसलिए बाईं ओर दूसरा व्यक्ति ${answer} है।`,
    `${person} ਦਾ ਮੂੰਹ ਪਹਿਲਾਂ ${original} ਹੈ; ਸਭ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲਣ 'ਤੇ ਉਸਦਾ ਮੂੰਹ ${changed} ਹੋ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਖੱਬਾ ${leftDirection} ਹੈ, ਇਸ ਲਈ ਖੱਬੇ ਪਾਸੇ ਦੂਜਾ ਵਿਅਕਤੀ ${answer} ਹੈ।`,
  );
}

/**
 * Small fidelity corrections for English forms where a generic localized
 * rendering can preserve the broad idea but lose an exact detail (for example
 * an ordinal answer or the post-reversal facing). This layer is source-driven
 * and changes explanation wording only; semantic fields remain untouched.
 */
export function polishSea001ExplanationParityFidelity(
  source: AuditCaselet,
  candidate: Sea001LocalizedReviewCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  let output = candidate;
  for (let childIndex = 0; childIndex < source.children.length; childIndex += 1) {
    const sourceChild = source.children[childIndex]!;
    const localizedChild = output.children[childIndex]!;
    let explanation: string | undefined;
    if (sourceChild.queryContractId === "SEA-QC-002") explanation = qc002Explanation(sourceChild, localizedChild, locale);
    if (sourceChild.queryContractId === "SEA-QC-022") explanation = qc022Explanation(sourceChild, locale);
    if (explanation) output = replaceCorrectExplanation(output, childIndex, explanation);
  }
  return output;
}
