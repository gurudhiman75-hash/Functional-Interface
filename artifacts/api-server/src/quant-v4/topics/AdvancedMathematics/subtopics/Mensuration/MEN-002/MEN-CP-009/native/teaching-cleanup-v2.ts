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
      .replace(/^For a sphere, surface area = /, "गोले के लिए सतह का क्षेत्रफल = ")
      .replace(/^For a hemisphere, curved surface area = /, "अर्धगोले के लिए वक्र सतह का क्षेत्रफल = ")
      .replace(/^For a solid hemisphere, TSA : volume simplifies to /, "ठोस अर्धगोले के लिए कुल सतह का क्षेत्रफल : आयतन सरल होकर ")
      .replace(/, curved area = /g, ", वक्र सतह का क्षेत्रफल = ")
      .replace(/, area = /g, ", क्षेत्रफल = ")
      .replace(/\band\b/g, "और")
      .replace(/\bwith\b/g, "के साथ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return line
    .replace(/^Now substitute the actual values: /, "ਹੁਣ ਦਿੱਤੇ ਮੁੱਲ ਸਿੱਧੇ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ: ")
    .replace(/^Now include the painting rate: /, "ਹੁਣ ਰੰਗਾਈ ਦੀ ਦਰ ਵੀ ਸ਼ਾਮਲ ਕਰੋ: ")
    .replace(/^Now include the polishing rate: /, "ਹੁਣ ਪਾਲਿਸ਼ ਦੀ ਦਰ ਵੀ ਸ਼ਾਮਲ ਕਰੋ: ")
    .replace(/^For a sphere, surface area = /, "ਗੋਲੇ ਲਈ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = ")
    .replace(/^For a hemisphere, curved surface area = /, "ਅਰਧ-ਗੋਲੇ ਲਈ ਵਕਰ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = ")
    .replace(/^For a solid hemisphere, TSA : volume simplifies to /, "ਠੋਸ ਅਰਧ-ਗੋਲੇ ਲਈ ਕੁੱਲ ਸਤਹ ਦਾ ਖੇਤਰਫਲ : ਆਇਤਨ ਸਧਾਰਨ ਹੋ ਕੇ ")
    .replace(/, curved area = /g, ", ਵਕਰ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = ")
    .replace(/, area = /g, ", ਖੇਤਰਫਲ = ")
    .replace(/\band\b/g, "ਅਤੇ")
    .replace(/\bwith\b/g, "ਦੇ ਨਾਲ")
    .replace(/\s+/g, " ")
    .trim();
}
