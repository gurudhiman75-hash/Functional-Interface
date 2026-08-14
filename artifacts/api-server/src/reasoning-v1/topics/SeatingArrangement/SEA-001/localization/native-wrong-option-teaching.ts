import type { AuditCaselet, AuditChild } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { localizedSea001Name, SEA001_REVIEW_CANONICAL_NAMES } from "./name-pack.ts";
import { nativeOrdinal } from "./native-sentence-kit.ts";

const NAME_SET = new Set<string>(SEA001_REVIEW_CANONICAL_NAMES);
const WORD_ORDINALS: Readonly<Record<string, string>> = Object.freeze({
  first: "1st",
  second: "2nd",
  third: "3rd",
  fourth: "4th",
  fifth: "5th",
  sixth: "6th",
  seventh: "7th",
  eighth: "8th",
  ninth: "9th",
  tenth: "10th",
});

function tr(locale: Sea001TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function nativePeopleIn(text: string, locale: Sea001TranslatedLocale): readonly string[] {
  const names = [...text.matchAll(/[A-Z][a-z]+/g)]
    .map((match) => match[0]!)
    .filter((value) => NAME_SET.has(value));
  return names.map((value) => localizedSea001Name(value, locale));
}

function qOrdinal(question: string): string | undefined {
  const match = question.match(/\b(\d+(?:st|nd|rd|th)|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\b/i)?.[1];
  if (!match) return undefined;
  if (/^\d/.test(match)) return match;
  return WORD_ORDINALS[match.toLowerCase()];
}

function countElimination(
  optionDisplay: string,
  correctDisplay: string,
  locale: Sea001TranslatedLocale,
  contextHi: string,
  contextPa: string,
): string {
  const option = Number(optionDisplay);
  const correct = Number(correctDisplay);
  if (Number.isFinite(option) && Number.isFinite(correct) && option !== correct) {
    const difference = Math.abs(option - correct);
    if (option < correct) {
      return tr(
        locale,
        `${contextHi} ${optionDisplay} लेने पर ${difference} व्यक्ति कम गिने जाते हैं। सही गिनती ${correctDisplay} है।`,
        `${contextPa} ${optionDisplay} ਲੈਣ 'ਤੇ ${difference} ਵਿਅਕਤੀ ਘੱਟ ਗਿਣੇ ਜਾਂਦੇ ਹਨ। ਸਹੀ ਗਿਣਤੀ ${correctDisplay} ਹੈ।`,
      );
    }
    return tr(
      locale,
      `${contextHi} ${optionDisplay} लेने पर ${difference} व्यक्ति अधिक गिने जाते हैं। सही गिनती ${correctDisplay} है।`,
      `${contextPa} ${optionDisplay} ਲੈਣ 'ਤੇ ${difference} ਵਿਅਕਤੀ ਵੱਧ ਗਿਣੇ ਜਾਂਦੇ ਹਨ। ਸਹੀ ਗਿਣਤੀ ${correctDisplay} ਹੈ।`,
    );
  }
  return tr(
    locale,
    `${contextHi} सही गिनती ${correctDisplay} है; ${optionDisplay} उस गिनती से मेल नहीं खाता।`,
    `${contextPa} ਸਹੀ ਗਿਣਤੀ ${correctDisplay} ਹੈ; ${optionDisplay} ਉਸ ਗਿਣਤੀ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।`,
  );
}

function sequenceElimination(optionDisplay: string, correctDisplay: string, locale: Sea001TranslatedLocale): string {
  const option = optionDisplay.split(" → ");
  const correct = correctDisplay.split(" → ");
  const mismatch = correct.findIndex((value, index) => value !== option[index]);
  if (mismatch >= 0 && option[mismatch] && correct[mismatch]) {
    return tr(
      locale,
      `पूछी गई दिशा में क्रम के स्थान ${mismatch + 1} पर ${correct[mismatch]} होना चाहिए, ${option[mismatch]} नहीं। इसलिए सही क्रम ${correctDisplay} है।`,
      `ਪੁੱਛੀ ਗਈ ਦਿਸ਼ਾ ਵਿੱਚ ਕ੍ਰਮ ਦੇ ਸਥਾਨ ${mismatch + 1} 'ਤੇ ${correct[mismatch]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ${option[mismatch]} ਨਹੀਂ। ਇਸ ਲਈ ਸਹੀ ਕ੍ਰਮ ${correctDisplay} ਹੈ।`,
    );
  }
  return tr(
    locale,
    `पूछी गई दिशा में सीट-दर-सीट पढ़ने पर क्रम ${correctDisplay} बनता है; ${optionDisplay} उस क्रम को नहीं रखता।`,
    `ਪੁੱਛੀ ਗਈ ਦਿਸ਼ਾ ਵਿੱਚ ਸੀਟ-ਦਰ-ਸੀਟ ਪੜ੍ਹਣ 'ਤੇ ਕ੍ਰਮ ${correctDisplay} ਬਣਦਾ ਹੈ; ${optionDisplay} ਉਸ ਕ੍ਰਮ ਨੂੰ ਨਹੀਂ ਰੱਖਦਾ।`,
  );
}

function nativeWrongOptionExplanation(
  canonical: AuditCaselet,
  child: AuditChild,
  optionDisplay: string,
  correctDisplay: string,
  locale: Sea001TranslatedLocale,
): string {
  const people = nativePeopleIn(child.text, locale);
  switch (child.queryContractId) {
    case "SEA-QC-001":
      return tr(
        locale,
        `${optionDisplay} बाएँ छोर पर नहीं है। अंतिम पंक्ति की सबसे बाईं सीट पर ${correctDisplay} है।`,
        `${optionDisplay} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਨਹੀਂ ਹੈ। ਅੰਤਿਮ ਕਤਾਰ ਦੀ ਸਭ ਤੋਂ ਖੱਬੀ ਸੀਟ 'ਤੇ ${correctDisplay} ਹੈ।`,
      );
    case "SEA-QC-002":
      return tr(
        locale,
        `${people[0]} को बाएँ छोर से सीट-दर-सीट गिनें। सही स्थान ${correctDisplay} है; ${optionDisplay} लेने पर दूसरी सीट चुनी जाती है।`,
        `${people[0]} ਨੂੰ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਸੀਟ-ਦਰ-ਸੀਟ ਗਿਣੋ। ਸਹੀ ਸਥਾਨ ${correctDisplay} ਹੈ; ${optionDisplay} ਲੈਣ 'ਤੇ ਹੋਰ ਸੀਟ ਚੁਣੀ ਜਾਂਦੀ ਹੈ।`,
      );
    case "SEA-QC-003": {
      const ordinal = qOrdinal(child.text);
      const step = ordinal ? nativeOrdinal(ordinal, locale) : tr(locale, "पूछे गए", "ਪੁੱਛੇ ਗਏ");
      const side = / to the left of /i.test(child.text)
        ? tr(locale, "बाईं ओर", "ਖੱਬੇ ਪਾਸੇ")
        : tr(locale, "दाईं ओर", "ਸੱਜੇ ਪਾਸੇ");
      const facing = canonical.checkpointId === "SEA-CP-002"
        ? tr(locale, "पहले संदर्भ व्यक्ति की मुख-दिशा तय करें। ", "ਪਹਿਲਾਂ ਹਵਾਲਾ ਦਿੱਤੇ ਵਿਅਕਤੀ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ। ")
        : "";
      return tr(
        locale,
        `${facing}${people[0]} के ${side} ${step} स्थान तक गिनने पर ${correctDisplay} आता है। ${optionDisplay} उस पूछी गई सीट पर नहीं है।`,
        `${facing}${people[0]} ਦੇ ${side} ${step} ਸਥਾਨ ਤੱਕ ਗਿਣਣ 'ਤੇ ${correctDisplay} ਆਉਂਦਾ ਹੈ। ${optionDisplay} ਉਸ ਪੁੱਛੀ ਗਈ ਸੀਟ 'ਤੇ ਨਹੀਂ ਹੈ।`,
      );
    }
    case "SEA-QC-004": {
      const ordinal = qOrdinal(child.text);
      const step = ordinal ? nativeOrdinal(ordinal, locale) : tr(locale, "पूछे गए", "ਪੁੱਛੇ ਗਏ");
      return tr(
        locale,
        `${people[0]} से घड़ी की दिशा में ${step} स्थान तक गिनें। वहाँ ${correctDisplay} आता है; ${optionDisplay} उस स्थान पर नहीं है।`,
        `${people[0]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ${step} ਸਥਾਨ ਤੱਕ ਗਿਣੋ। ਉੱਥੇ ${correctDisplay} ਆਉਂਦਾ ਹੈ; ${optionDisplay} ਉਸ ਸਥਾਨ 'ਤੇ ਨਹੀਂ ਹੈ।`,
      );
    }
    case "SEA-QC-005":
      return tr(
        locale,
        `पहले ${people[0]} की मुख-दिशा तय करें। ठीक दाईं ओर वाली सीट ${correctDisplay} की है; ${optionDisplay} उस ठीक-दाईं सीट पर नहीं है।`,
        `ਪਹਿਲਾਂ ${people[0]} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ। ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ ਵਾਲੀ ਸੀਟ ${correctDisplay} ਦੀ ਹੈ; ${optionDisplay} ਉਸ ਬਿਲਕੁਲ-ਸੱਜੀ ਸੀਟ 'ਤੇ ਨਹੀਂ ਹੈ।`,
      );
    case "SEA-QC-006":
      return tr(
        locale,
        `${people[0]} के दोनों ठीक पड़ोसी ${correctDisplay} हैं। ${optionDisplay} में कम-से-कम एक व्यक्ति ${people[0]} की साथ वाली सीट पर नहीं है।`,
        `${people[0]} ਦੇ ਦੋਵੇਂ ਬਿਲਕੁਲ ਨੇੜਲੇ ਵਿਅਕਤੀ ${correctDisplay} ਹਨ। ${optionDisplay} ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਿਅਕਤੀ ${people[0]} ਦੀ ਨਾਲ ਵਾਲੀ ਸੀਟ 'ਤੇ ਨਹੀਂ ਹੈ।`,
      );
    case "SEA-QC-008":
      return countElimination(
        optionDisplay,
        correctDisplay,
        locale,
        `${people[0]} और ${people[1]} को गिनती में शामिल किए बिना केवल बीच की सीटें गिनें।`,
        `${people[0]} ਅਤੇ ${people[1]} ਨੂੰ ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤੇ ਬਿਨਾਂ ਸਿਰਫ਼ ਵਿਚਕਾਰ ਵਾਲੀਆਂ ਸੀਟਾਂ ਗਿਣੋ।`,
      );
    case "SEA-QC-009":
      return countElimination(
        optionDisplay,
        correctDisplay,
        locale,
        `${people[2]} से घड़ी की दिशा में चलें और दोनों छोर के व्यक्तियों को न गिनें।`,
        `${people[2]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲੋ ਅਤੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਵਾਲੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਨਾ ਗਿਣੋ।`,
      );
    case "SEA-QC-010": {
      const seatCount = canonical.topologySnapshot?.seatCount;
      const half = seatCount ? seatCount / 2 : undefined;
      return half
        ? tr(
            locale,
            `${people[0]} से ${half} सीट आगे जाने पर ठीक सामने ${correctDisplay} आता है। ${optionDisplay} आधे गोल वाली सीट पर नहीं है।`,
            `${people[0]} ਤੋਂ ${half} ਸੀਟਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ${correctDisplay} ਆਉਂਦਾ ਹੈ। ${optionDisplay} ਅੱਧੇ ਗੋਲ ਵਾਲੀ ਸੀਟ 'ਤੇ ਨਹੀਂ ਹੈ।`,
          )
        : tr(
            locale,
            `${people[0]} के ठीक सामने ${correctDisplay} है; ${optionDisplay} सामने वाली सीट पर नहीं है।`,
            `${people[0]} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ${correctDisplay} ਹੈ; ${optionDisplay} ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਨਹੀਂ ਹੈ।`,
          );
    }
    case "SEA-QC-015":
      return tr(
        locale,
        `${people[1]} की मुख-दिशा से ${people[0]} को देखें। सही संबंध ${correctDisplay} है; ${optionDisplay} लेने पर दिशा या दूरी बदल जाती है।`,
        `${people[1]} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੋਂ ${people[0]} ਨੂੰ ਵੇਖੋ। ਸਹੀ ਸਬੰਧ ${correctDisplay} ਹੈ; ${optionDisplay} ਲੈਣ 'ਤੇ ਦਿਸ਼ਾ ਜਾਂ ਦੂਰੀ ਬਦਲ ਜਾਂਦੀ ਹੈ।`,
      );
    case "SEA-QC-016":
      return tr(
        locale,
        `अंतिम क्रम और दिशाओं से मिलान करने पर “${optionDisplay}” सही नहीं बैठता। सही कथन “${correctDisplay}” है।`,
        `ਅੰਤਿਮ ਕ੍ਰਮ ਅਤੇ ਦਿਸ਼ਾਵਾਂ ਨਾਲ ਮਿਲਾਉਣ 'ਤੇ “${optionDisplay}” ਸਹੀ ਨਹੀਂ ਬਣਦਾ। ਸਹੀ ਕਥਨ “${correctDisplay}” ਹੈ।`,
      );
    case "SEA-QC-017":
      return tr(
        locale,
        `“${optionDisplay}” अंतिम व्यवस्था में सही है, इसलिए इसे गलत कथन नहीं चुन सकते। गलत कथन “${correctDisplay}” है।`,
        `“${optionDisplay}” ਅੰਤਿਮ ਵਿਵਸਥਾ ਵਿੱਚ ਸਹੀ ਹੈ, ਇਸ ਲਈ ਇਸਨੂੰ ਗਲਤ ਕਥਨ ਨਹੀਂ ਚੁਣ ਸਕਦੇ। ਗਲਤ ਕਥਨ “${correctDisplay}” ਹੈ।`,
      );
    case "SEA-QC-019":
      return tr(
        locale,
        `${optionDisplay} का बैठने का संबंध बाकी सामान्य जोड़ियों जैसा है। अलग संबंध वाली जोड़ी ${correctDisplay} है।`,
        `${optionDisplay} ਦਾ ਬੈਠਣ ਵਾਲਾ ਸਬੰਧ ਬਾਕੀ ਆਮ ਜੋੜਿਆਂ ਵਰਗਾ ਹੈ। ਵੱਖਰੇ ਸਬੰਧ ਵਾਲਾ ਜੋੜਾ ${correctDisplay} ਹੈ।`,
      );
    case "SEA-QC-020":
      return sequenceElimination(optionDisplay, correctDisplay, locale);
    case "SEA-QC-021":
      return tr(
        locale,
        `${people[0]} और ${people[1]} की सीटें बदलने के बाद बाएँ छोर पर ${correctDisplay} आता है। ${optionDisplay} उस बदली हुई बाएँ-छोर सीट पर नहीं आता।`,
        `${people[0]} ਅਤੇ ${people[1]} ਦੀਆਂ ਸੀਟਾਂ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ${correctDisplay} ਆਉਂਦਾ ਹੈ। ${optionDisplay} ਉਸ ਬਦਲੀ ਹੋਈ ਖੱਬੇ-ਸਿਰੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਨਹੀਂ ਆਉਂਦਾ।`,
      );
    case "SEA-QC-022": {
      const ordinal = qOrdinal(child.text);
      const step = ordinal ? nativeOrdinal(ordinal, locale) : tr(locale, "पूछे गए", "ਪੁੱਛੇ ਗਏ");
      return tr(
        locale,
        `सबकी मुख-दिशा उलटने के बाद ${people[0]} का बायाँ/दायाँ भी उलट जाता है। नई दिशा में बाईं ओर ${step} स्थान तक गिनने पर ${correctDisplay} आता है; ${optionDisplay} नहीं।`,
        `ਸਭ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਉਲਟਣ ਤੋਂ ਬਾਅਦ ${people[0]} ਦਾ ਖੱਬਾ/ਸੱਜਾ ਵੀ ਉਲਟ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਦਿਸ਼ਾ ਵਿੱਚ ਖੱਬੇ ਪਾਸੇ ${step} ਸਥਾਨ ਤੱਕ ਗਿਣਣ 'ਤੇ ${correctDisplay} ਆਉਂਦਾ ਹੈ; ${optionDisplay} ਨਹੀਂ।`,
      );
    }
    default:
      throw new Error(`${canonical.caseletId}: native wrong-option teaching unsupported query ${child.queryContractId}`);
  }
}

export function applySea001NativeWrongOptionTeaching(
  source: AuditCaselet,
  candidate: Sea001LocalizedReviewCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  return {
    ...candidate,
    children: candidate.children.map((child, childIndex) => {
      const sourceChild = source.children[childIndex];
      if (!sourceChild) throw new Error(`${source.caseletId}: missing source child ${childIndex}`);
      const correctDisplay = child.options[child.answerIndex]?.display;
      if (!correctDisplay) throw new Error(`${source.caseletId}: missing localized correct option for child ${childIndex}`);
      return {
        ...child,
        options: child.options.map((option) => option.isCorrect
          ? option
          : {
              ...option,
              explanation: nativeWrongOptionExplanation(source, sourceChild, option.display, correctDisplay, locale),
            }),
      };
    }),
  };
}
