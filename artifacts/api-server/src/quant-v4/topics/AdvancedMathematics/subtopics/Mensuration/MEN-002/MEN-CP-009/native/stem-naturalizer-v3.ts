import type { MenCp009NativeV2Language } from "./editorial-v2";

export function naturalizeMenCp009NativeStemV3(
  value: string,
  language: MenCp009NativeV2Language,
) {
  if (language === "hi") {
    return value
      .replace(/उसका सतह का क्षेत्रफल/g, "उसकी सतह का क्षेत्रफल")
      .replace(/दो गोलों के सतह का क्षेत्रफलों/g, "दो गोलों की सतह के क्षेत्रफलों")
      .replace(/उनके सतह का क्षेत्रफलों/g, "उनकी सतह के क्षेत्रफलों")
      .replace(/सतह का क्षेत्रफलों/g, "सतह के क्षेत्रफलों")
      .replace(/एक गोले और एक अर्धगोले की त्रिज्या समान है।/g, "एक गोले और एक अर्धगोले की त्रिज्या समान है।")
      .replace(/\s+/g, " ")
      .trim();
  }

  return value
    .replace(/ਅਰਧ ਵਿਆਸ/g, "ਅਰਧ-ਵਿਆਸ")
    .replace(/ਸਤਹ ਦਾ ਖੇਤਰਫਲਾਂ/g, "ਸਤਹ ਦੇ ਖੇਤਰਫਲਾਂ")
    .replace(/ਉਨ੍ਹਾਂ ਦੇ ਸਤਹ ਦਾ ਖੇਤਰਫਲਾਂ/g, "ਉਨ੍ਹਾਂ ਦੀ ਸਤਹ ਦੇ ਖੇਤਰਫਲਾਂ")
    .replace(/\s+/g, " ")
    .trim();
}
