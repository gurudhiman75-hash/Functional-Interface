import { canonicalDigest } from "../../../SEA-001/canonical.ts";
import type { Sea002Cp006Caselet, Sea002Cp006ChildQuestion } from "../types.ts";
import {
  localizeCp006ReviewCaselet,
  type Sea002Cp006LocalizedReviewCaselet,
} from "./candidate-localizer.ts";
import type { Sea002Cp006TranslatedLocale } from "./readiness.ts";

export { cp006TeachingSkeleton } from "./candidate-localizer.ts";

export type Cp006CorrectedRationaleKind = "SELF_OPPOSITE" | "SELF_RELATIVE" | "SELF_DIAGONAL";

interface CorrectedRationaleMatch {
  readonly kind: Cp006CorrectedRationaleKind;
  readonly person: string;
  readonly ordinal?: "immediately" | "second" | "third" | "fourth" | "fifth";
  readonly side?: "left" | "right";
}

export function cp006CorrectedRationaleMatch(text: string): CorrectedRationaleMatch | null {
  let match = text.match(/^(.+) is the reference person, so (.+) cannot also be the person sitting opposite (.+)\.$/u);
  if (match && match[1] === match[2] && match[2] === match[3]) {
    return { kind: "SELF_OPPOSITE", person: match[1]! };
  }

  match = text.match(/^(.+) cannot be (immediately|second|third|fourth|fifth) to the (left|right) of themselves; the required position must be occupied by another person in the same row\.$/u);
  if (match) {
    return {
      kind: "SELF_RELATIVE",
      person: match[1]!,
      ordinal: match[2] as CorrectedRationaleMatch["ordinal"],
      side: match[3] as CorrectedRationaleMatch["side"],
    };
  }

  match = text.match(/^(.+) cannot sit diagonally opposite themselves; a diagonal seat must be in the other row at an adjacent position\.$/u);
  if (match) return { kind: "SELF_DIAGONAL", person: match[1]! };

  return null;
}

function ordinalWord(value: NonNullable<CorrectedRationaleMatch["ordinal"]>, locale: Sea002Cp006TranslatedLocale): string {
  if (value === "immediately") return locale === "hi-IN" ? "ठीक अगले" : "ਬਿਲਕੁਲ ਅਗਲੇ";
  const hi = { second: "दूसरे", third: "तीसरे", fourth: "चौथे", fifth: "पाँचवें" } as const;
  const pa = { second: "ਦੂਜੇ", third: "ਤੀਜੇ", fourth: "ਚੌਥੇ", fifth: "ਪੰਜਵੇਂ" } as const;
  return locale === "hi-IN" ? hi[value] : pa[value];
}

function relativePhrase(match: CorrectedRationaleMatch, locale: Sea002Cp006TranslatedLocale): string {
  const side = match.side === "left"
    ? (locale === "hi-IN" ? "बाईं ओर" : "ਖੱਬੇ ਪਾਸੇ")
    : (locale === "hi-IN" ? "दाईं ओर" : "ਸੱਜੇ ਪਾਸੇ");
  return locale === "hi-IN"
    ? `${side} ${ordinalWord(match.ordinal!, locale)} स्थान पर`
    : `${side} ${ordinalWord(match.ordinal!, locale)} ਸਥਾਨ ਤੇ`;
}

export function localizeCp006CorrectedRationale(
  text: string,
  locale: Sea002Cp006TranslatedLocale,
): string | null {
  const match = cp006CorrectedRationaleMatch(text);
  if (!match) return null;

  if (match.kind === "SELF_OPPOSITE") {
    return locale === "hi-IN"
      ? `${match.person} प्रश्न का संदर्भ व्यक्ति है; उसी व्यक्ति का स्थान स्वयं के ठीक सामने नहीं हो सकता।`
      : `${match.person} ਪ੍ਰਸ਼ਨ ਦਾ ਹਵਾਲਾ ਵਿਅਕਤੀ ਹੈ; ਉਸੇ ਵਿਅਕਤੀ ਦਾ ਸਥਾਨ ਆਪਣੇ ਹੀ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਨਹੀਂ ਹੋ ਸਕਦਾ।`;
  }
  if (match.kind === "SELF_RELATIVE") {
    const relation = relativePhrase(match, locale);
    return locale === "hi-IN"
      ? `${match.person} का स्थान स्वयं से ${relation} नहीं हो सकता; पूछा गया स्थान उसी पंक्ति में किसी दूसरे व्यक्ति का होगा।`
      : `${match.person} ਦਾ ਸਥਾਨ ਆਪਣੇ ਆਪ ਤੋਂ ${relation} ਨਹੀਂ ਹੋ ਸਕਦਾ; ਪੁੱਛਿਆ ਗਿਆ ਸਥਾਨ ਉਸੇ ਕਤਾਰ ਵਿੱਚ ਕਿਸੇ ਹੋਰ ਵਿਅਕਤੀ ਦਾ ਹੋਵੇਗਾ।`;
  }
  return locale === "hi-IN"
    ? `${match.person} का स्थान स्वयं के तिरछे सामने नहीं हो सकता; तिरछा स्थान दूसरी पंक्ति में पास वाले स्थान पर होता है।`
    : `${match.person} ਦਾ ਸਥਾਨ ਆਪਣੇ ਹੀ ਤਿਰਛੇ ਸਾਹਮਣੇ ਨਹੀਂ ਹੋ ਸਕਦਾ; ਤਿਰਛਾ ਸਥਾਨ ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਨਾਲ ਵਾਲੇ ਸਥਾਨ ਤੇ ਹੁੰਦਾ ਹੈ।`;
}

function bridgeRationale(text: string): string {
  const match = cp006CorrectedRationaleMatch(text);
  return match ? `${match.person} is in the wrong position for the diagonal relation.` : text;
}

function bridgeCaselet(caselet: Sea002Cp006Caselet): Sea002Cp006Caselet {
  const children = caselet.children.map((child) => ({
    ...child,
    options: child.options.map((option) => ({ ...option, explanation: bridgeRationale(option.explanation) })) as Sea002Cp006ChildQuestion["options"],
  })) as unknown as Sea002Cp006Caselet["children"];
  return { ...caselet, children };
}

export function localizeCp006CorrectedReviewCaselet(
  caselet: Sea002Cp006Caselet,
  locale: Sea002Cp006TranslatedLocale,
): Sea002Cp006LocalizedReviewCaselet {
  const base = localizeCp006ReviewCaselet(bridgeCaselet(caselet), locale);
  const children = base.children.map((child, childIndex) => {
    const canonicalChild = caselet.children[childIndex]!;
    const options = child.options.map((option, optionIndex) => {
      const corrected = localizeCp006CorrectedRationale(canonicalChild.options[optionIndex]!.explanation, locale);
      return corrected ? Object.freeze({ ...option, explanation: corrected }) : option;
    }) as unknown as Sea002Cp006LocalizedReviewCaselet["children"][number]["options"];
    return Object.freeze({ ...child, options });
  }) as unknown as Sea002Cp006LocalizedReviewCaselet["children"];

  const canonicalContentFingerprint = canonicalDigest({
    setupText: caselet.setupText,
    clueTexts: caselet.clueTexts,
    sharedExplanation: caselet.sharedExplanation,
    diagramText: caselet.diagramText,
    children: caselet.children,
  });
  const presentationFingerprint = canonicalDigest({
    locale,
    setupText: base.setupText,
    clueTexts: base.clueTexts,
    sharedExplanation: base.sharedExplanation,
    teachingSkeleton: base.teachingSkeleton,
    diagramText: base.diagramText,
    children,
  });

  return Object.freeze({ ...base, canonicalContentFingerprint, children, presentationFingerprint });
}
