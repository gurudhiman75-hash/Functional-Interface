import type { MenCp009NativeV2Language } from "./editorial-v2";

export function cleanMenCp009NativeTeachingLineV2(
  line: string,
  language: MenCp009NativeV2Language,
) {
  if (language === "hi") {
    return line
      .replace(/^Now substitute the actual values: /, "अब दिए हुए मान सीधे सूत्र में रखें: ")
      .replace(/^Now include the painting rate: /, "अब रंगाई की दर भी शामिल करें: ")
      .replace(/^Now include the polishing rate: /, "अब पॉलिश की दर भी शामिल करें: ")
      .replace(/\bwith\b/g, "के साथ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return line
    .replace(/^Now substitute the actual values: /, "ਹੁਣ ਦਿੱਤੇ ਮੁੱਲ ਸਿੱਧੇ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ: ")
    .replace(/^Now include the painting rate: /, "ਹੁਣ ਰੰਗਾਈ ਦੀ ਦਰ ਵੀ ਸ਼ਾਮਲ ਕਰੋ: ")
    .replace(/^Now include the polishing rate: /, "ਹੁਣ ਪਾਲਿਸ਼ ਦੀ ਦਰ ਵੀ ਸ਼ਾਮਲ ਕਰੋ: ")
    .replace(/\bwith\b/g, "ਦੇ ਨਾਲ")
    .replace(/\s+/g, " ")
    .trim();
}
