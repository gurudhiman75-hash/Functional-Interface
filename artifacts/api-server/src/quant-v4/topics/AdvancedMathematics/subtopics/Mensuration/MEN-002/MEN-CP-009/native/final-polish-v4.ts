import type { MenCp009NativeV2Language } from "./editorial-v2";

export function polishMenCp009NativeTeachingV4(
  value: string,
  language: MenCp009NativeV2Language,
) {
  if (language === "hi") {
    return value
      .replace(/^a गोला, सतह का क्षेत्रफल = (.+?) और आयतन = (.+)\.$/, "गोले के लिए सतह का क्षेत्रफल = $1 और आयतन = $2।")
      .replace(/^इन क्षेत्रफल और आयतन के सूत्रों को भाग देने पर क्षेत्रफल : आयतन सरल होकर (.+)\.$/, "इन क्षेत्रफल और आयतन के सूत्रों को भाग देने पर क्षेत्रफल : आयतन सरल होकर $1 मिलता है।")
      .replace(/^कुल सतह के क्षेत्रफल को आयतन से भाग देने पर (.+?), बचता है (.+)\.$/, "कुल सतह के क्षेत्रफल को आयतन से भाग देने पर $1 कट जाता है और $2 बचता है।")
      .replace(/^दिए हुए सतह-क्षेत्रफल अनुपात के दोनों पदों का वर्गमूल लें।$/, "दिए हुए सतह-क्षेत्रफल अनुपात के दोनों पदों का वर्गमूल लें।")
      .replace(/^दिए हुए आयतन अनुपात के दोनों पदों का घनमूल लें।$/, "दिए हुए आयतन अनुपात के दोनों पदों का घनमूल लें।")
      .replace(/\s+/g, " ")
      .trim();
  }

  return value
    .replace(/^a ਗੋਲਾ, ਸਤਹ ਦਾ ਖੇਤਰਫਲ = (.+?) ਅਤੇ ਆਇਤਨ = (.+)\.$/, "ਗੋਲੇ ਲਈ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = $1 ਅਤੇ ਆਇਤਨ = $2।")
    .replace(/^ਦਿੱਤਾ ਹੋਇਆ (.+?) ਦੇ ਦੋਵੇਂ ਪਦਾਂ ਦਾ ਵਰਗਮੂਲ ਲਓ।$/, "ਦਿੱਤੇ ਹੋਏ $1 ਦੇ ਦੋਵੇਂ ਪਦਾਂ ਦਾ ਵਰਗਮੂਲ ਲਓ।")
    .replace(/^ਦਿੱਤਾ ਹੋਇਆ (.+?) ਦੇ ਦੋਵੇਂ ਪਦਾਂ ਦਾ ਘਣਮੂਲ ਲਓ।$/, "ਦਿੱਤੇ ਹੋਏ $1 ਦੇ ਦੋਵੇਂ ਪਦਾਂ ਦਾ ਘਣਮੂਲ ਲਓ।")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildMenCp009NativeFinalLineV4(
  familyId: string,
  answer: string,
  language: MenCp009NativeV2Language,
) {
  if (language === "hi") {
    switch (familyId) {
      case "SPHERE_SURFACE_FROM_RADIUS":
      case "SPHERE_SURFACE_FROM_DIAMETER":
        return `इसलिए सतह का क्षेत्रफल ${answer} है।`;
      case "SPHERE_VOLUME_FROM_RADIUS":
      case "SPHERE_VOLUME_FROM_DIAMETER":
      case "HEMISPHERE_VOLUME_FROM_RADIUS":
        return `इसलिए आयतन ${answer} है।`;
      case "SPHERE_RADIUS_FROM_SURFACE":
      case "SPHERE_RADIUS_FROM_VOLUME":
      case "HEMISPHERE_RADIUS_FROM_CSA":
      case "HEMISPHERE_RADIUS_FROM_TSA":
      case "HEMISPHERE_RADIUS_FROM_VOLUME":
      case "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO":
      case "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO":
        return `इसलिए त्रिज्या ${answer} है।`;
      case "SPHERE_DIAMETER_FROM_SURFACE":
      case "SPHERE_DIAMETER_FROM_VOLUME":
        return `इसलिए व्यास ${answer} है।`;
      case "HEMISPHERE_CSA_FROM_RADIUS":
        return `इसलिए वक्र सतह का क्षेत्रफल ${answer} है।`;
      case "HEMISPHERE_TSA_FROM_RADIUS":
        return `इसलिए कुल सतह का क्षेत्रफल ${answer} है।`;
      case "HEMISPHERE_CAPACITY_LITRES":
        return `इसलिए पात्र की क्षमता ${answer} है।`;
      case "SPHERE_PAINTING_COST":
        return `इसलिए रंगाई की कुल लागत ${answer} है।`;
      case "HEMISPHERE_INNER_POLISHING_COST":
        return `इसलिए पॉलिश की कुल लागत ${answer} है।`;
      case "RADIUS_RATIO_FROM_SURFACE_RATIO":
      case "RADIUS_RATIO_FROM_VOLUME_RATIO":
        return `इसलिए त्रिज्याओं का अनुपात ${answer} है।`;
      case "SPHERE_SURFACE_PERCENT_CHANGE":
        return `इसलिए सतह के क्षेत्रफल में ${answer} की वृद्धि होती है।`;
      case "SPHERE_VOLUME_PERCENT_CHANGE":
        return `इसलिए आयतन में ${answer} की वृद्धि होती है।`;
      case "SPHERE_SURFACE_RATIO":
      case "SPHERE_VOLUME_RATIO":
      case "SPHERE_HEMISPHERE_MEASURE_RATIO":
      case "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO":
      case "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO":
        return `इसलिए आवश्यक अनुपात ${answer} है।`;
      default:
        return `इसलिए उत्तर ${answer} है।`;
    }
  }

  switch (familyId) {
    case "SPHERE_SURFACE_FROM_RADIUS":
    case "SPHERE_SURFACE_FROM_DIAMETER":
      return `ਇਸ ਲਈ ਸਤਹ ਦਾ ਖੇਤਰਫਲ ${answer} ਹੈ।`;
    case "SPHERE_VOLUME_FROM_RADIUS":
    case "SPHERE_VOLUME_FROM_DIAMETER":
    case "HEMISPHERE_VOLUME_FROM_RADIUS":
      return `ਇਸ ਲਈ ਆਇਤਨ ${answer} ਹੈ।`;
    case "SPHERE_RADIUS_FROM_SURFACE":
    case "SPHERE_RADIUS_FROM_VOLUME":
    case "HEMISPHERE_RADIUS_FROM_CSA":
    case "HEMISPHERE_RADIUS_FROM_TSA":
    case "HEMISPHERE_RADIUS_FROM_VOLUME":
    case "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO":
    case "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO":
      return `ਇਸ ਲਈ ਅਰਧ-ਵਿਆਸ ${answer} ਹੈ।`;
    case "SPHERE_DIAMETER_FROM_SURFACE":
    case "SPHERE_DIAMETER_FROM_VOLUME":
      return `ਇਸ ਲਈ ਵਿਆਸ ${answer} ਹੈ।`;
    case "HEMISPHERE_CSA_FROM_RADIUS":
      return `ਇਸ ਲਈ ਵਕਰ ਸਤਹ ਦਾ ਖੇਤਰਫਲ ${answer} ਹੈ।`;
    case "HEMISPHERE_TSA_FROM_RADIUS":
      return `ਇਸ ਲਈ ਕੁੱਲ ਸਤਹ ਦਾ ਖੇਤਰਫਲ ${answer} ਹੈ।`;
    case "HEMISPHERE_CAPACITY_LITRES":
      return `ਇਸ ਲਈ ਭਾਂਡੇ ਦੀ ਸਮਰੱਥਾ ${answer} ਹੈ।`;
    case "SPHERE_PAINTING_COST":
      return `ਇਸ ਲਈ ਰੰਗਾਈ ਦੀ ਕੁੱਲ ਲਾਗਤ ${answer} ਹੈ।`;
    case "HEMISPHERE_INNER_POLISHING_COST":
      return `ਇਸ ਲਈ ਪਾਲਿਸ਼ ਦੀ ਕੁੱਲ ਲਾਗਤ ${answer} ਹੈ।`;
    case "RADIUS_RATIO_FROM_SURFACE_RATIO":
    case "RADIUS_RATIO_FROM_VOLUME_RATIO":
      return `ਇਸ ਲਈ ਅਰਧ-ਵਿਆਸਾਂ ਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`;
    case "SPHERE_SURFACE_PERCENT_CHANGE":
      return `ਇਸ ਲਈ ਸਤਹ ਦੇ ਖੇਤਰਫਲ ਵਿੱਚ ${answer} ਵਾਧਾ ਹੁੰਦਾ ਹੈ।`;
    case "SPHERE_VOLUME_PERCENT_CHANGE":
      return `ਇਸ ਲਈ ਆਇਤਨ ਵਿੱਚ ${answer} ਵਾਧਾ ਹੁੰਦਾ ਹੈ।`;
    case "SPHERE_SURFACE_RATIO":
    case "SPHERE_VOLUME_RATIO":
    case "SPHERE_HEMISPHERE_MEASURE_RATIO":
    case "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO":
    case "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO":
      return `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`;
    default:
      return `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`;
  }
}
