import { runNumCp002LocalizedPipeline, type NumCp002LocalizedRuntimeInput } from "./runtime";
import type { NumCp002LocalizedQuestion, NumCp002TranslatedLocale } from "./types";

const tx = (locale: NumCp002TranslatedLocale, hi: string, pa: string): string => locale === "hi-IN" ? hi : pa;

const HARDENING_RULES: ReadonlyArray<readonly [string, string, string]> = [
  ["After reduction, the denominator may contain only", "सरल करने के बाद हर में केवल", "ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["For a pure recurring block of length", "पूर्ण आवर्ती खंड की लंबाई", "ਪੂਰੇ ਆਵਰਤੀ ਖੰਡ ਦੀ ਲੰਬਾਈ"],
  ["subtraction produces a denominator of k nines.", "हो तो घटाने पर हर में उतने ही 9 आते हैं।", "ਹੋਵੇ ਤਾਂ ਘਟਾਉਣ ਤੇ ਹਰ ਵਿੱਚ ਉਤਨੇ ਹੀ 9 ਆਉਂਦੇ ਹਨ।"],
  ["Shift past the recurring block and subtract a shift that ends just before it.", "आवर्ती खंड के बाद तक दशमलव खिसकाइए और उससे आवर्ती खंड से ठीक पहले तक खिसकाया गया मान घटाइए।", "ਆਵਰਤੀ ਖੰਡ ਤੋਂ ਅੱਗੇ ਤੱਕ ਦਸ਼ਮਲਵ ਖਿਸਕਾਓ ਅਤੇ ਉਸ ਵਿਚੋਂ ਆਵਰਤੀ ਖੰਡ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਤੱਕ ਖਿਸਕਾਇਆ ਮੁੱਲ ਘਟਾਓ।"],
  ["The subtraction gives", "घटाने पर मिलता है", "ਘਟਾਉਣ ਤੇ ਮਿਲਦਾ ਹੈ"],
  ["Let", "मान लीजिए", "ਮੰਨ ਲਵੋ"],
  [", so", ", अतः", ", ਇਸ ਲਈ"],
  ["so", "अतः", "ਇਸ ਲਈ"],
  ["Therefore the fraction is", "इसलिए भिन्न है", "ਇਸ ਲਈ ਭਿੰਨ ਹੈ"],
  ["the fraction is", "भिन्न है", "ਭਿੰਨ ਹੈ"],
  ["has denominator", "का हर है", "ਦਾ ਹਰ ਹੈ"],
  ["therefore the factor", "इसलिए गुणनखंड", "ਇਸ ਲਈ ਗੁਣਨਖੰਡ"],
  ["must be cancelled by the numerator.", "को अंश द्वारा पूरी तरह काटना होगा।", "ਨੂੰ ਅੰਸ਼ ਦੁਆਰਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਹੋਵੇਗਾ।"],
  ["a tail of recurring 9s reaches the next terminating decimal exactly.", "आवर्ती 9 की पूँछ ठीक अगले सांत दशमलव तक पहुँचती है।", "ਆਵਰਤੀ 9 ਦੀ ਲੜੀ ਬਿਲਕੁਲ ਅਗਲੇ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ।"],
  ["The recurring", "आवर्ती", "ਆਵਰਤੀ"],
  ["tail fills the remaining gap to the next terminating value.", "की पूँछ अगले सांत मान तक बचा अंतर पूरा कर देती है।", "ਦੀ ਲੜੀ ਅਗਲੇ ਸਮਾਪਤ ਮੁੱਲ ਤੱਕ ਬਚਿਆ ਅੰਤਰ ਪੂਰਾ ਕਰ ਦਿੰਦੀ ਹੈ।"],
  ["reduced denominator containing only", "सरल हर में केवल", "ਸਰਲ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["the reduced denominator contains primes other than", "सरल हर में इनके अलावा अभाज्य गुणनखंड हैं:", "ਸਰਲ ਹਰ ਵਿੱਚ ਇਨ੍ਹਾਂ ਤੋਂ ਇਲਾਵਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ:"],
  ["the factor", "गुणनखंड", "ਗੁਣਨਖੰਡ"],
  ["makes the decimal recurring.", "दशमलव को आवर्ती बनाता है।", "ਦਸ਼ਮਲਵ ਨੂੰ ਆਵਰਤੀ ਬਣਾਉਂਦਾ ਹੈ।"],
  ["is terminating after reduction?", "क्या सरल करने के बाद सांत है?", "ਕੀ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਹੈ?"],
  ["is divisible by", "से विभाज्य है", "ਨਾਲ ਭਾਗਯੋਗ ਹੈ"],
  ["to be divisible by", "का इससे विभाज्य होना", "ਦਾ ਇਸ ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ"],
  ["divisible by", "से विभाज्य", "ਨਾਲ ਭਾਗਯੋਗ"],
  ["The statement is true.", "कथन सत्य है।", "ਕਥਨ ਸਹੀ ਹੈ।"],
  ["The statement is false.", "कथन असत्य है।", "ਕਥਨ ਗਲਤ ਹੈ।"],
  ["not", "न कि", "ਨਾ ਕਿ"],
  ["or", "या", "ਜਾਂ"],
];

function hardenText(input: string, locale: NumCp002TranslatedLocale): string {
  let output = input;
  for (const [en, hi, pa] of HARDENING_RULES) output = output.split(en).join(tx(locale, hi, pa));
  return output;
}

export function runNumCp002LocalizedFinalPipeline(input: NumCp002LocalizedRuntimeInput): NumCp002LocalizedQuestion {
  const q = runNumCp002LocalizedPipeline(input);
  const hardened: NumCp002LocalizedQuestion = {
    ...q,
    stem: hardenText(q.stem, input.locale),
    explanation: Object.freeze({
      ...(q.explanation.concept ? { concept: hardenText(q.explanation.concept, input.locale) } : {}),
      solution: Object.freeze(q.explanation.solution.map((line) => hardenText(line, input.locale))),
      finalAnswer: q.explanation.finalAnswer,
    }),
  };
  return Object.freeze(hardened);
}
