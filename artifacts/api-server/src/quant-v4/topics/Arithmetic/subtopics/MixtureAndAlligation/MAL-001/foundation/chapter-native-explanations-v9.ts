import { applyMal001NativeQualityV8 } from "./chapter-native-quality-v8";
import type { Mal001LocalizedLanguage as Lang } from "./chapter-multilingual-question-studio-v1";

type Rule = readonly [RegExp, string, string];
const rules: Rule[] = [];
const exact: Record<string, readonly [string, string]> = {};
const markerPattern =
  /\[\[EXAMTREE_(ALLIGATION|RATIO_ADJUSTMENT)_SVG_V1:([^\]]+)\]\]/g;
const displayKeys = new Set([
  "title",
  "label",
  "operation",
  "note",
  "quantity",
  "quantityUnit",
  "value",
  "conservedLabel",
  "accessibleText",
]);
const residuals: Record<string, readonly [string, string]> = {
  red: ["लाल", "ਲਾਲ"],
  nilgiri: ["नीलगिरि", "ਨੀਲਗਿਰੀ"],
  oats: ["जई", "ਜਵੀ"],
  olive: ["जैतून", "ਜੈਤੂਨ"],
  mean: ["औसत", "ਔਸਤ"],
  dilution: ["तनुकरण", "ਪਤਲਾ ਕਰਨਾ"],
};
const fragmentCache = new Map<string, string>();
function fragment(s: string, language: Lang): string {
  const key = language + ":" + s;
  const prior = fragmentCache.get(key);
  if (prior !== undefined) return prior;
  const text = fragmentUncached(s, language);
  if (fragmentCache.size >= 8192) fragmentCache.clear();
  fragmentCache.set(key, text);
  return text;
}
function fragmentUncached(s: string, language: Lang): string {
  return applyMal001NativeQualityV8(
    { stem: s, answer: "", options: [], questionLanguageId: "FRAGMENT" },
    language,
  )
    .stem.replace(
      /\b(?:red|nilgiri|oats|olive|mean|dilution)\b/gi,
      (w) => residuals[w.toLowerCase()]![language === "hi" ? 0 : 1],
    )
    .replace(/1 कਿਰਿਆਵਾਂ/g, "1 ਕਿਰਿਆ")
    .replace(/1 क्रियाओं/g, "1 क्रिया")
    .replace(/ਲੋੜੀਂਦੀ ਅਨੁਪਾਤ/g, "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ")
    .replace(/ਮਾਤਰਾ ਜੋੜਿਆ/g, "ਮਿਲਾਈ ਮਾਤਰਾ");
}
export function localizeMalExplanationSentenceV9(
  source: string,
  language: Lang,
): { text: string; authored: boolean } {
  const original = source.trim();
  const key = original.replace(/[.!]$/, "");
  if (exact[key])
    return { text: exact[key]![language === "hi" ? 0 : 1], authored: true };
  const mathless = original
    .replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, "")
    .replace(/\b(?:litres?|kg|ml)\b/g, "")
    .replace(/[.\s]/g, "");
  if (!mathless) return { text: fragment(original, language), authored: true };
  for (const [pattern, hi, pa] of rules) {
    const match = pattern.exec(original);
    if (!match) continue;
    return {
      text: (language === "hi" ? hi : pa).replace(/\$(\d+)/g, (_, i) =>
        fragment(match[Number(i)]!, language),
      ),
      authored: true,
    };
  }
  // Algebra and named numeric expressions do not need sentence reordering.
  if (
    /^[^.!?]+\s=\s[\s\S]+$/.test(original) &&
    !/\b(?:has|is|contains|therefore|giving|which|Let|so|After|before|then)\b/i.test(
      original,
    )
  )
    return { text: fragment(original, language), authored: true };
  return { text: fragment(original, language), authored: false };
}
const textCache = new Map<string, { text: string; authored: boolean }>();
export function localizeMalExplanationTextV9(
  source: string,
  language: Lang,
): { text: string; authored: boolean } {
  const key = language + ":" + source;
  const prior = textCache.get(key);
  if (prior) return prior;
  const result = localizeTextUncached(source, language);
  if (textCache.size >= 8192) textCache.clear();
  textCache.set(key, result);
  return result;
}
function localizeTextUncached(
  source: string,
  language: Lang,
): { text: string; authored: boolean } {
  const full = exact[source.trim().replace(/[.!]$/, "")];
  if (full) return { text: full[language === "hi" ? 0 : 1], authored: true };
  const markers: string[] = [];
  const protectedText = source.replace(markerPattern, (_m, kind, payload) => {
    const data = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    const walk = (v: any, key = ""): any => {
      if (typeof v === "string") {
        if (!displayKeys.has(key)) return v;
        return localizeMalExplanationTextV9(v, language).text;
      }
      if (Array.isArray(v)) return v.map((x) => walk(x, key));
      if (v && typeof v === "object")
        return Object.fromEntries(
          Object.entries(v).map(([k, x]) => [k, walk(x, k)]),
        );
      return v;
    };
    return `\uE200${markers.push(`[[EXAMTREE_${kind}_SVG_V1:${Buffer.from(JSON.stringify(walk(data)), "utf8").toString("base64url")}]]`) - 1}\uE201`;
  });
  if (/^\uE200\d+\uE201$/.test(protectedText))
    return {
      text: markers[Number(protectedText.slice(1, -1))]!,
      authored: true,
    };
  const parts = protectedText.split(
    /(?<=[.!?])\s+(?=[A-Z])|(?<=\\\]|\\\))\s+(?=[A-Z][a-z])/,
  );
  const localized = parts.map((x) =>
    localizeMalExplanationSentenceV9(x, language),
  );
  return {
    text: localized
      .map((x) => x.text)
      .join(" ")
      .replace(/\uE200(\d+)\uE201/g, (_, i) => markers[Number(i)]!),
    authored: localized.every((x) => x.authored),
  };
}
export function applyMal001NativeExplanationsV9<T extends Record<string, any>>(
  source: T,
  language: Lang,
): T {
  const localized = applyMal001NativeQualityV8(source, language);
  let authored = 0,
    fallback = 0;
  const walk = (v: any): any => {
    if (typeof v === "string") {
      const r = localizeMalExplanationTextV9(v, language);
      if (r.authored) authored++;
      else fallback++;
      return r.text;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object")
      return Object.fromEntries(
        Object.entries(v).map(([k, x]) => [
          k,
          /Id$|^kind$|^type$|^languageLevel$/.test(k) ? x : walk(x),
        ]),
      );
    return v;
  };
  return {
    ...localized,
    explanation: walk(source.explanation),
    reasoningGraph: source.reasoningGraph
      ? {
          ...source.reasoningGraph,
          nodes: source.reasoningGraph.nodes?.map((n: any) => ({
            ...n,
            text:
              typeof n.text === "string"
                ? localizeMalExplanationTextV9(n.text, language).text
                : n.text,
          })),
        }
      : source.reasoningGraph,
    traceability: {
      ...localized.traceability,
      nativeExplanationRevision: "MAL-NATIVE-EXPLANATIONS-V9",
      nativeExplanationAuthoredStrings: authored,
      nativeExplanationFallbackStrings: fallback,
    },
  } as T;
}

Object.assign(exact, {
  "Simple Method": ["सरल विधि", "ਸੌਖਾ ਤਰੀਕਾ"],
  "Method 1 — Simple Method": ["विधि 1 — सरल विधि", "ਤਰੀਕਾ 1 — ਸੌਖਾ ਤਰੀਕਾ"],
  "Method 2 — Alligation Cross": [
    "विधि 2 — मिश्रण का क्रॉस नियम",
    "ਤਰੀਕਾ 2 — ਮਿਸ਼ਰਣ ਦਾ ਕ੍ਰਾਸ ਨਿਯਮ",
  ],
  Solution: ["हल", "ਹੱਲ"],
  Answer: ["उत्तर", "ਉੱਤਰ"],
  "More help": ["अधिक सहायता", "ਹੋਰ ਮਦਦ"],
  "Alligation Cross": ["मिश्रण का क्रॉस नियम", "ਮਿਸ਼ਰਣ ਦਾ ਕ੍ਰਾਸ ਨਿਯਮ"],
  "Alligation Cross — Dilution": [
    "क्रॉस नियम — तनुकरण",
    "ਕ੍ਰਾਸ ਨਿਯਮ — ਘੋਲ ਪਤਲਾ ਕਰਨਾ",
  ],
  "Alligation cross for the required mixture cost": [
    "आवश्यक मिश्रण लागत का क्रॉस नियम",
    "ਲੋੜੀਂਦੀ ਮਿਸ਼ਰਣ ਲਾਗਤ ਦਾ ਕ੍ਰਾਸ ਨਿਯਮ",
  ],
  "Target mean": ["लक्षित औसत", "ਲੋੜੀਂਦੀ ਔਸਤ"],
  "Target concentration": ["लक्षित सांद्रता", "ਲੋੜੀਂਦਾ ਸੰਘਣਾਪਣ"],
  "Original solution": ["मूल घोल", "ਮੂਲ ਘੋਲ"],
  "Original solution part": ["मूल घोल का भाग", "ਮੂਲ ਘੋਲ ਦਾ ਹਿੱਸਾ"],
  "Water part": ["पानी का भाग", "ਪਾਣੀ ਦਾ ਹਿੱਸਾ"],
  "Pure solute part": ["शुद्ध विलेय का भाग", "ਸ਼ੁੱਧ ਘੁਲੇ ਪਦਾਰਥ ਦਾ ਹਿੱਸਾ"],
  "Conserved-part ratio method": [
    "अपरिवर्तित घटक से अनुपात हल करें",
    "ਨਾ ਬਦਲਣ ਵਾਲੇ ਘਟਕ ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ",
  ],
  "Ratio change: before and after": [
    "बदलाव से पहले और बाद का अनुपात",
    "ਤਬਦੀਲੀ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦਾ ਅਨੁਪਾਤ",
  ],
  "Change only the named component; the other item stays fixed": [
    "केवल बताए गए घटक की मात्रा बदलें; दूसरे घटक की मात्रा समान रहती है।",
    "ਸਿਰਫ਼ ਦੱਸੇ ਘਟਕ ਦੀ ਮਾਤਰਾ ਬਦਲੋ; ਦੂਜੇ ਘਟਕ ਦੀ ਮਾਤਰਾ ਬਰਾਬਰ ਰਹਿੰਦੀ ਹੈ।",
  ],
  "Remove the mixed sample proportionally before adding the refill": [
    "दोबारा भरने से पहले दोनों घटकों को मिश्रण के अनुपात में निकालें।",
    "ਮੁੜ ਭਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੋਵੇਂ ਘਟਕ ਮਿਸ਼ਰਣ ਦੇ ਅਨੁਪਾਤ ਅਨੁਸਾਰ ਕੱਢੋ।",
  ],
  "The removed sample has the current mixture composition": [
    "निकाले गए नमूने में घटकों का अनुपात वर्तमान मिश्रण के समान है।",
    "ਕੱਢੇ ਨਮੂਨੇ ਵਿੱਚ ਘਟਕਾਂ ਦਾ ਅਨੁਪਾਤ ਮੌਜੂਦਾ ਮਿਸ਼ਰਣ ਵਰਗਾ ਹੈ।",
  ],
  "Equal fractional reduction preserves the component ratio": [
    "दोनों घटकों में समान अनुपात में कमी होने से उनका अनुपात नहीं बदलता।",
    "ਦੋਵਾਂ ਘਟਕਾਂ ਵਿੱਚ ਇੱਕੋ ਅੰਸ਼ ਦੀ ਕਮੀ ਹੋਣ ਨਾਲ ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ਨਹੀਂ ਬਦਲਦਾ।",
  ],
  "Place the opposite differences under the two prices as shown in the cross": [
    "क्रॉस में दिखाए अनुसार दोनों मूल्यों के नीचे विपरीत अंतर रखें।",
    "ਕ੍ਰਾਸ ਵਿੱਚ ਦਿਖਾਏ ਅਨੁਸਾਰ ਦੋਵੇਂ ਮੁੱਲਾਂ ਹੇਠ ਉਲਟ ਫ਼ਰਕ ਰੱਖੋ।",
  ],
  "Use the quantity ratio with those differences and solve the single unknown price":
    [
      "मात्राओं के अनुपात और इन अंतरों से अज्ञात मूल्य निकालें।",
      "ਮਾਤਰਾਵਾਂ ਦੇ ਅਨੁਪਾਤ ਅਤੇ ਇਨ੍ਹਾਂ ਫ਼ਰਕਾਂ ਨਾਲ ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ।",
    ],
  "This is the cheaper item's part": [
    "यह सस्ती वस्तु का भाग है।",
    "ਇਹ ਸਸਤੀ ਵਸਤੂ ਦਾ ਹਿੱਸਾ ਹੈ।",
  ],
  "This is the dearer item's part": [
    "यह महँगी वस्तु का भाग है।",
    "ਇਹ ਮਹਿੰਗੀ ਵਸਤੂ ਦਾ ਹਿੱਸਾ ਹੈ।",
  ],
  "First identify the required component. If its percentage is given, multiply the total mixture by that percentage; if the other component is given, subtract its percentage from 100% first":
    [
      "पहले पूछे गए घटक का प्रतिशत लें। यदि दूसरे घटक का प्रतिशत दिया है, तो उसे 100% से घटाएँ। आवश्यक मात्रा = कुल मिश्रण × आवश्यक घटक का प्रतिशत ÷ 100।",
      "ਪਹਿਲਾਂ ਪੁੱਛੇ ਘਟਕ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਲਵੋ। ਜੇ ਦੂਜੇ ਘਟਕ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਦਿੱਤਾ ਹੈ, ਤਾਂ ਉਸ ਨੂੰ 100% ਵਿੱਚੋਂ ਘਟਾਓ। ਲੋੜੀਂਦੀ ਮਾਤਰਾ = ਕੁੱਲ ਮਿਸ਼ਰਣ × ਲੋੜੀਂਦੇ ਘਟਕ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ÷ 100।",
    ],
  "Add the component quantities to get the total mixture. Then divide the required component by the total and multiply by 100 to obtain its concentration":
    [
      "दोनों घटकों की मात्राएँ जोड़कर कुल मिश्रण निकालें। आवश्यक घटक की मात्रा को कुल मात्रा से भाग देकर 100 से गुणा करें।",
      "ਦੋਵਾਂ ਘਟਕਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਜੋੜ ਕੇ ਕੁੱਲ ਮਿਸ਼ਰਣ ਕੱਢੋ। ਲੋੜੀਂਦੇ ਘਟਕ ਦੀ ਮਾਤਰਾ ਨੂੰ ਕੁੱਲ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    ],
  "Use the percentage of the component that is actually given. Since component quantity = total mixture × component percentage, divide the known quantity by that percentage to recover the whole mixture":
    [
      "जिस घटक की मात्रा दी है, उसी का प्रतिशत प्रयोग करें। कुल मात्रा = दी गई घटक मात्रा ÷ उसका प्रतिशत-अंश।",
      "ਜਿਸ ਘਟਕ ਦੀ ਮਾਤਰਾ ਦਿੱਤੀ ਹੈ, ਉਸੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਵਰਤੋ। ਕੁੱਲ ਮਾਤਰਾ = ਦਿੱਤੀ ਘਟਕ ਮਾਤਰਾ ÷ ਉਸ ਦਾ ਪ੍ਰਤੀਸ਼ਤ-ਅੰਸ਼।",
    ],
  "Only water evaporates, so the amount of dissolved solute remains unchanged":
    [
      "केवल पानी का वाष्पीकरण होता है; विलेय की मात्रा नहीं बदलती।",
      "ਸਿਰਫ਼ ਪਾਣੀ ਦਾ ਵਾਸ਼ਪੀਕਰਨ ਹੁੰਦਾ ਹੈ; ਘੁਲੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲਦੀ।",
    ],
  "Only water is added, so the amount of solute remains unchanged": [
    "केवल पानी मिलाया जाता है; विलेय की मात्रा नहीं बदलती।",
    "ਸਿਰਫ਼ ਪਾਣੀ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ; ਘੁਲੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲਦੀ।",
  ],
  "Only pure solute is added, so the amount of solvent remains unchanged": [
    "केवल शुद्ध विलेय मिलाया जाता है; विलायक की मात्रा नहीं बदलती।",
    "ਸਿਰਫ਼ ਸ਼ੁੱਧ ਘੁਲਣ ਵਾਲਾ ਪਦਾਰਥ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ; ਘੋਲਕ ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲਦੀ।",
  ],
  "Drying removes only moisture, so the dry-matter quantity remains unchanged. Find the original dry matter, use the final dry-matter percentage to obtain the dried mass, and compare the two masses when moisture loss is asked":
    [
      "सुखाने पर केवल नमी घटती है; सूखे पदार्थ की मात्रा समान रहती है। पहले मूल सूखा पदार्थ निकालें। इसे अंतिम सूखे पदार्थ के प्रतिशत-अंश से भाग देकर अंतिम द्रव्यमान निकालें। नमी में कमी पूछी हो तो दोनों द्रव्यमानों का अंतर लें।",
      "ਸੁਕਾਉਣ ਉੱਤੇ ਸਿਰਫ਼ ਨਮੀ ਘਟਦੀ ਹੈ; ਸੁੱਕੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਬਰਾਬਰ ਰਹਿੰਦੀ ਹੈ। ਪਹਿਲਾਂ ਮੂਲ ਸੁੱਕਾ ਪਦਾਰਥ ਕੱਢੋ। ਇਸ ਨੂੰ ਅੰਤਿਮ ਸੁੱਕੇ ਪਦਾਰਥ ਦੇ ਪ੍ਰਤੀਸ਼ਤ-ਅੰਸ਼ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਅੰਤਿਮ ਪੁੰਜ ਕੱਢੋ। ਨਮੀ ਦੀ ਕਮੀ ਪੁੱਛੀ ਹੋਵੇ ਤਾਂ ਦੋਵਾਂ ਪੁੰਜਾਂ ਦਾ ਫ਼ਰਕ ਲਵੋ।",
    ],
  "Work backward using unchanged dry matter. Find the dry matter in the final batch, treat that as the original dry matter too, and divide by the original dry-matter percentage to recover the initial mass":
    [
      "सूखे पदार्थ की मात्रा नहीं बदलती। अंतिम बैच से सूखे पदार्थ की मात्रा निकालें और उसे मूल सूखे पदार्थ के प्रतिशत-अंश से भाग दें। इससे प्रारंभिक द्रव्यमान मिलेगा।",
      "ਸੁੱਕੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲਦੀ। ਅੰਤਿਮ ਬੈਚ ਵਿੱਚੋਂ ਸੁੱਕੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਕੱਢੋ ਅਤੇ ਇਸ ਨੂੰ ਮੂਲ ਸੁੱਕੇ ਪਦਾਰਥ ਦੇ ਪ੍ਰਤੀਸ਼ਤ-ਅੰਸ਼ ਨਾਲ ਭਾਗ ਦਿਓ। ਇਸ ਨਾਲ ਸ਼ੁਰੂਆਤੀ ਪੁੰਜ ਮਿਲੇਗਾ।",
    ],
  "Because the mixture is sold at the pure ingredient's cost price, the profit comes from the free water added to the mixture":
    [
      "मिश्रण को शुद्ध घटक की प्रति इकाई लागत पर बेचा गया है। निःशुल्क पानी मिलाने से बिक्री मात्रा बढ़ती है और लाभ होता है।",
      "ਮਿਸ਼ਰਣ ਨੂੰ ਸ਼ੁੱਧ ਘਟਕ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ਉੱਤੇ ਵੇਚਿਆ ਗਿਆ ਹੈ। ਮੁਫ਼ਤ ਪਾਣੀ ਮਿਲਾਉਣ ਨਾਲ ਵਿਕਰੀ ਦੀ ਮਾਤਰਾ ਵਧਦੀ ਹੈ ਅਤੇ ਲਾਭ ਹੁੰਦਾ ਹੈ।",
    ],
  "Work with one complete batch: compare its total selling value with its actual ingredient cost":
    [
      "पूरे बैच का कुल विक्रय मूल्य और घटकों की वास्तविक कुल लागत तुलना में लें।",
      "ਪੂਰੇ ਬੈਚ ਦਾ ਕੁੱਲ ਵਿਕਰੀ ਮੁੱਲ ਅਤੇ ਘਟਕਾਂ ਦੀ ਅਸਲ ਕੁੱਲ ਲਾਗਤ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    ],
  "First find the mixture's average cost, then increase that cost by the required profit percentage":
    [
      "पहले मिश्रण की औसत लागत निकालें, फिर उसमें आवश्यक लाभ प्रतिशत जोड़ें।",
      "ਪਹਿਲਾਂ ਮਿਸ਼ਰਣ ਦੀ ਔਸਤ ਲਾਗਤ ਕੱਢੋ, ਫਿਰ ਇਸ ਵਿੱਚ ਲੋੜੀਂਦਾ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਜੋੜੋ।",
    ],
  "The added water increases the quantity sold without increasing the purchase cost, so compare total batch revenue with the original cost":
    [
      "पानी मिलाने से खरीद लागत बढ़े बिना बिक्री मात्रा बढ़ती है। इसलिए पूरे बैच की बिक्री रकम की तुलना मूल लागत से करें।",
      "ਪਾਣੀ ਮਿਲਾਉਣ ਨਾਲ ਖਰੀਦ ਲਾਗਤ ਵਧੇ ਬਿਨਾਂ ਵਿਕਰੀ ਦੀ ਮਾਤਰਾ ਵਧਦੀ ਹੈ। ਇਸ ਲਈ ਪੂਰੇ ਬੈਚ ਦੀ ਵਿਕਰੀ ਰਕਮ ਦੀ ਤੁਲਨਾ ਮੂਲ ਲਾਗਤ ਨਾਲ ਕਰੋ।",
    ],
});

rules.push(
  [
    /^Let x be the quantity of (.+?) and y be the quantity of (.+?)\.$/,
    "$1 की मात्रा x और $2 की मात्रा y मानें।",
    "$1 ਦੀ ਮਾਤਰਾ x ਅਤੇ $2 ਦੀ ਮਾਤਰਾ y ਮੰਨੋ।",
  ],
  [
    /^Let x be the quantity of (.+?)\.$/,
    "$1 की मात्रा x मानें।",
    "$1 ਦੀ ਮਾਤਰਾ x ਮੰਨੋ।",
  ],
  [
    /^Let the required quantity of (.+?) be (.+?)\.$/,
    "$1 की आवश्यक मात्रा $2 मानें।",
    "$1 ਦੀ ਲੋੜੀਂਦੀ ਮਾਤਰਾ $2 ਮੰਨੋ।",
  ],
  [
    /^Then (.+?) quantity = (.+?)\.$/,
    "तब $1 की मात्रा = $2।",
    "ਫਿਰ $1 ਦੀ ਮਾਤਰਾ = $2।",
  ],
  [
    /^Multiply by (.+?): (.+?)\.$/,
    "$1 से गुणा करें: $2।",
    "$1 ਨਾਲ ਗੁਣਾ ਕਰੋ: $2।",
  ],
  [
    /^Solve the equation to get (.+?)\.$/,
    "समीकरण हल करने पर $1 मिलता है।",
    "ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਉੱਤੇ $1 ਮਿਲਦਾ ਹੈ।",
  ],
  [
    /^The question asks for (.+?), so the answer is (.+?)\.$/,
    "प्रश्न में $1 पूछा है, इसलिए उत्तर $2 है।",
    "ਪ੍ਰਸ਼ਨ ਵਿੱਚ $1 ਪੁੱਛਿਆ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ $2 ਹੈ।",
  ],
  [
    /^Therefore, the two quantities are (.+?) and (.+?), in that order\.$/,
    "इसलिए दोनों मात्राएँ इसी क्रम में $1 और $2 हैं।",
    "ਇਸ ਲਈ ਦੋਵੇਂ ਮਾਤਰਾਵਾਂ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ $1 ਅਤੇ $2 ਹਨ।",
  ],
  [
    /^Ratio parts are (.+?) and (.+?)\.$/,
    "अनुपात के भाग $1 और $2 हैं।",
    "ਅਨੁਪਾਤ ਦੇ ਹਿੱਸੇ $1 ਅਤੇ $2 ਹਨ।",
  ],
  [
    /^(.+?) has (.+?) ratio parts\.$/,
    "$1 के लिए अनुपात के $2 भाग हैं।",
    "$1 ਲਈ ਅਨੁਪਾਤ ਦੇ $2 ਹਿੱਸੇ ਹਨ।",
  ],
  [
    /^(.+?) uses (.+?) part, so its quantity is (.+?)\.$/,
    "$1 का $2 भाग है, इसलिए इसकी मात्रा $3 है।",
    "$1 ਦਾ $2 ਹਿੱਸਾ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੀ ਮਾਤਰਾ $3 ਹੈ।",
  ],
  [
    /^(.+?) represents (.+?) parts, so one part = (.+?)\.$/,
    "$1 में $2 भाग हैं, इसलिए एक भाग = $3।",
    "$1 ਵਿੱਚ $2 ਹਿੱਸੇ ਹਨ, ਇਸ ਲਈ ਇੱਕ ਹਿੱਸਾ = $3।",
  ],
  [
    /^The unknown price is (.+?)\.$/,
    "अज्ञात मूल्य $1 है।",
    "ਅਣਜਾਣ ਮੁੱਲ $1 ਹੈ।",
  ],
  [/^Hence, (.+?)\.$/, "अतः $1।", "ਇਸ ਲਈ $1।"],
  [/^Therefore, (.+?)$/, "इसलिए $1", "ਇਸ ਲਈ $1"],
  [
    /^Since (.+?) is not changed, its quantity remains (.+?)\.$/,
    "$1 की मात्रा नहीं बदली है, इसलिए यह $2 ही रहती है।",
    "$1 ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲੀ, ਇਸ ਲਈ ਇਹ $2 ਹੀ ਰਹਿੰਦੀ ਹੈ।",
  ],
  [
    /^In the target ratio (.+?), (.+?) represents (.+?)\.$/,
    "लक्षित अनुपात $1 में $2 के $3 हैं।",
    "ਲੋੜੀਂਦੇ ਅਨੁਪਾਤ $1 ਵਿੱਚ $2 ਦੇ $3 ਹਨ।",
  ],
  [
    /^(.+?) represents (.+?), so its required quantity is (.+)$/,
    "$1 के $2 हैं, इसलिए इसकी आवश्यक मात्रा है: $3",
    "$1 ਦੇ $2 ਹਨ, ਇਸ ਲਈ ਇਸ ਦੀ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਹੈ: $3",
  ],
  [
    /^The (initial|final|starting) quantities are (.+?) and (.+?)\.$/,
    "$1 मात्राएँ क्रमशः $2 और $3 हैं।",
    "$1 ਮਾਤਰਾਵਾਂ ਕ੍ਰਮਵਾਰ $2 ਅਤੇ $3 ਹਨ।",
  ],
  [
    /^Since no (.+?) is added or removed, its quantity remains (.+?)\.$/,
    "$1 न मिलाया गया है और न निकाला गया है। इसलिए इसकी मात्रा $2 ही रहती है।",
    "$1 ਨਾ ਮਿਲਾਇਆ ਗਿਆ ਹੈ ਅਤੇ ਨਾ ਕੱਢਿਆ ਗਿਆ ਹੈ। ਇਸ ਲਈ ਇਸ ਦੀ ਮਾਤਰਾ $2 ਹੀ ਰਹਿੰਦੀ ਹੈ।",
  ],
  [
    /^The original quantity of (.+?) is still (.+?)\.$/,
    "$1 की मूल मात्रा $2 ही है।",
    "$1 ਦੀ ਮੂਲ ਮਾਤਰਾ $2 ਹੀ ਹੈ।",
  ],
  [
    /^If (.+?) (kg|litres) is removed, the amount of (.+?) left is (.+)$/,
    "यदि $1 $2 मिश्रण निकाला जाए, तो बची हुई $3 की मात्रा होगी: $4",
    "ਜੇ $1 $2 ਮਿਸ਼ਰਣ ਕੱਢਿਆ ਜਾਵੇ, ਤਾਂ ਬਾਕੀ $3 ਦੀ ਮਾਤਰਾ ਹੋਵੇਗੀ: $4",
  ],
  [
    /^In the target ratio (.+?), (.+?) must occupy (.+?) of the vessel: (.+)$/,
    "लक्षित अनुपात $1 के अनुसार $2 का हिस्सा पात्र का $3 होना चाहिए: $4",
    "ਲੋੜੀਂਦੇ ਅਨੁਪਾਤ $1 ਅਨੁਸਾਰ $2 ਦਾ ਹਿੱਸਾ ਭਾਂਡੇ ਦਾ $3 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ: $4",
  ],
  [
    /^Since its quantity is still (.+?), (.+)$/,
    "इसकी मात्रा अब भी $1 है, इसलिए $2",
    "ਇਸ ਦੀ ਮਾਤਰਾ ਹੁਣ ਵੀ $1 ਹੈ, ਇਸ ਲਈ $2",
  ],
  [
    /^(.+?) has the same quantity in both states: (.+)$/,
    "दोनों अवस्थाओं में $1 की मात्रा समान है: $2",
    "ਦੋਵਾਂ ਅਵਸਥਾਵਾਂ ਵਿੱਚ $1 ਦੀ ਮਾਤਰਾ ਬਰਾਬਰ ਹੈ: $2",
  ],
  [
    /^Since (.+?) is not adjusted, its final quantity is (.+)$/,
    "$1 की मात्रा नहीं बदली है, इसलिए इसकी अंतिम मात्रा है: $2",
    "$1 ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲੀ, ਇਸ ਲਈ ਇਸ ਦੀ ਅੰਤਿਮ ਮਾਤਰਾ ਹੈ: $2",
  ],
  [
    /^The initial ratio is (.+?)\.$/,
    "प्रारंभिक अनुपात $1 है।",
    "ਸ਼ੁਰੂਆਤੀ ਅਨੁਪਾਤ $1 ਹੈ।",
  ],
  [
    /^The fraction of each item that remains is (.+?)\.$/,
    "प्रत्येक घटक का बचा हुआ अंश $1 है।",
    "ਹਰੇਕ ਘਟਕ ਦਾ ਬਚਿਆ ਅੰਸ਼ $1 ਹੈ।",
  ],
  [
    /^Both quantities are multiplied by this same factor: (.+)$/,
    "दोनों मात्राओं को इसी गुणक से गुणा करें: $1",
    "ਦੋਵਾਂ ਮਾਤਰਾਵਾਂ ਨੂੰ ਇਸੇ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ: $1",
  ],
  [
    /^The common factor cancels, so the ratio remains (.+?)\.$/,
    "समान गुणक कट जाता है, इसलिए अनुपात $1 ही रहता है।",
    "ਸਾਂਝਾ ਗੁਣਕ ਕੱਟਿਆ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਅਨੁਪਾਤ $1 ਹੀ ਰਹਿੰਦਾ ਹੈ।",
  ],
  [
    /^Since (.+?), the required quantity is smaller than the current quantity\.$/,
    "$1 होने से आवश्यक मात्रा वर्तमान मात्रा से कम है।",
    "$1 ਹੋਣ ਕਰਕੇ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਮੌਜੂਦਾ ਮਾਤਰਾ ਤੋਂ ਘੱਟ ਹੈ।",
  ],
  [/^(.+?) must be removed\.$/, "$1 निकालना होगा।", "$1 ਕੱਢਣਾ ਪਵੇਗਾ।"],
  [
    /^Add (.+?) of liquid C after the second removal\.$/,
    "दूसरी बार निकालने के बाद $1 द्रव C मिलाएँ।",
    "ਦੂਜੀ ਵਾਰ ਕੱਢਣ ਤੋਂ ਬਾਅਦ $1 ਤਰਲ C ਮਿਲਾਓ।",
  ],
  [
    /^Vessel volume (.+?) and removal (.+?)\.$/,
    "पात्र का आयतन $1 और हर बार निकाली गई मात्रा $2 है।",
    "ਭਾਂਡੇ ਦਾ ਆਇਤਨ $1 ਅਤੇ ਹਰ ਵਾਰ ਕੱਢੀ ਮਾਤਰਾ $2 ਹੈ।",
  ],
  [
    /^After (.+?) operations?, the total retained fraction is (.+)$/,
    "$1 क्रियाओं के बाद कुल बचा हुआ अंश है: $2",
    "$1 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਬਚਿਆ ਅੰਸ਼ ਹੈ: $2",
  ],
  [
    /^Stage (.+?) retains (.+?); cumulative retained fraction = (.+?)\.$/,
    "चरण $1 में बचा अंश $2 है; अब तक कुल बचा अंश = $3।",
    "ਪੜਾਅ $1 ਵਿੱਚ ਬਚਿਆ ਅੰਸ਼ $2 ਹੈ; ਹੁਣ ਤੱਕ ਕੁੱਲ ਬਚਿਆ ਅੰਸ਼ = $3।",
  ],
  [
    /^Multiply the stage-specific retained fractions\.$/,
    "प्रत्येक चरण के बचे अंशों को आपस में गुणा करें।",
    "ਹਰੇਕ ਪੜਾਅ ਦੇ ਬਚੇ ਅੰਸ਼ਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਗੁਣਾ ਕਰੋ।",
  ],
  [
    /^The cumulative retained fraction is (.+?)\.$/,
    "अब तक कुल बचा हुआ अंश $1 है।",
    "ਹੁਣ ਤੱਕ ਕੁੱਲ ਬਚਿਆ ਅੰਸ਼ $1 ਹੈ।",
  ],
  [
    /^The unique integer exponent is (.+?)\.$/,
    "इससे पूर्णांक घात $1 मिलता है।",
    "ਇਸ ਤੋਂ ਪੂਰਨ ਅੰਕ ਘਾਤ $1 ਮਿਲਦਾ ਹੈ।",
  ],
  [
    /^After (.+?) operations?, the original quantity is about (.+?) litres, so it is below (.+?)\.$/,
    "$1 क्रियाओं के बाद मूल घटक लगभग $2 लीटर बचता है, जो $3 से कम है।",
    "$1 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਘਟਕ ਲਗਭਗ $2 ਲੀਟਰ ਬਚਦਾ ਹੈ, ਜੋ $3 ਤੋਂ ਘੱਟ ਹੈ।",
  ],
  [
    /^After (.+?) operations?, the original quantity is (.+?), which is not below (.+?)\.$/,
    "$1 क्रियाओं के बाद मूल घटक $2 बचता है, जो $3 से कम नहीं है।",
    "$1 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਘਟਕ $2 ਬਚਦਾ ਹੈ, ਜੋ $3 ਤੋਂ ਘੱਟ ਨਹੀਂ ਹੈ।",
  ],
  [
    /^After (.+?) operations?, the original quantity is (.+?), which is below (.+?)\.$/,
    "$1 क्रियाओं के बाद मूल घटक $2 बचता है, जो $3 से कम है।",
    "$1 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਘਟਕ $2 ਬਚਦਾ ਹੈ, ਜੋ $3 ਤੋਂ ਘੱਟ ਹੈ।",
  ],
  [
    /^Therefore the first strict crossing occurs at operation (.+?)\.$/,
    "इसलिए पहली बार सीमा से कम मात्रा क्रिया $1 के बाद मिलती है।",
    "ਇਸ ਲਈ ਪਹਿਲੀ ਵਾਰ ਹੱਦ ਤੋਂ ਘੱਟ ਮਾਤਰਾ ਕਿਰਿਆ $1 ਤੋਂ ਬਾਅਦ ਮਿਲਦੀ ਹੈ।",
  ],
  [
    /^Let the initial volume be (.+?) litres\.$/,
    "प्रारंभिक आयतन $1 लीटर मानें।",
    "ਸ਼ੁਰੂਆਤੀ ਆਇਤਨ $1 ਲੀਟਰ ਮੰਨੋ।",
  ],
  [
    /^(.+?) because the solute amount is unchanged\.$/,
    "विलेय की मात्रा समान रहने से: $1",
    "ਘੁਲੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਬਰਾਬਰ ਰਹਿਣ ਕਰਕੇ: $1",
  ],
  [
    /^The seller pays for (.+?) litres but sells (.+?) litres\.$/,
    "विक्रेता $1 लीटर की लागत देता है, पर $2 लीटर बेचता है।",
    "ਵਿਕਰੇਤਾ $1 ਲੀਟਰ ਦੀ ਲਾਗਤ ਦਿੰਦਾ ਹੈ, ਪਰ $2 ਲੀਟਰ ਵੇਚਦਾ ਹੈ।",
  ],
  [
    /^Take the cost of pure (.+?) as (.+?) units\.$/,
    "शुद्ध $1 की लागत $2 इकाई मानें।",
    "ਸ਼ੁੱਧ $1 ਦੀ ਲਾਗਤ $2 ਇਕਾਈ ਮੰਨੋ।",
  ],
  [
    /^A (.+?) gain requires (.+?) free units of water\.$/,
    "$1 लाभ के लिए $2 इकाई निःशुल्क पानी चाहिए।",
    "$1 ਲਾਭ ਲਈ $2 ਇਕਾਈ ਮੁਫ਼ਤ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
  ],
  [
    /^Take (.+?) paid parts of pure (.+?)\.$/,
    "शुद्ध $2 के $1 लागत वाले भाग लें।",
    "ਸ਼ੁੱਧ $2 ਦੇ $1 ਲਾਗਤ ਵਾਲੇ ਹਿੱਸੇ ਲਵੋ।",
  ],
  [
    /^The free water equals (.+?) parts\.$/,
    "निःशुल्क पानी $1 भाग है।",
    "ਮੁਫ਼ਤ ਪਾਣੀ $1 ਹਿੱਸੇ ਹੈ।",
  ],
  [
    /^In (.+?) parts of mixture, (.+?) parts are free water and (.+?) parts carry cost\.$/,
    "मिश्रण के $1 भाग में $2 भाग निःशुल्क पानी और $3 भाग लागत वाला घटक है।",
    "ਮਿਸ਼ਰਣ ਦੇ $1 ਹਿੱਸਿਆਂ ਵਿੱਚ $2 ਹਿੱਸੇ ਮੁਫ਼ਤ ਪਾਣੀ ਅਤੇ $3 ਹਿੱਸੇ ਲਾਗਤ ਵਾਲਾ ਘਟਕ ਹੈ।",
  ],
  [
    /^Let x and y be the quantities of the two ingredients in the order asked\.$/,
    "पूछे गए क्रम में दोनों घटकों की मात्राएँ x और y मानें।",
    "ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ ਦੋਵਾਂ ਘਟਕਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ x ਅਤੇ y ਮੰਨੋ।",
  ],
  [
    /^Their weighted-average cost must equal (.+?)\.$/,
    "इनकी भारित औसत लागत $1 होनी चाहिए।",
    "ਇਨ੍ਹਾਂ ਦੀ ਭਾਰਿਤ ਔਸਤ ਲਾਗਤ $1 ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
  ],
  [/^So (.+?)\.$/, "इसलिए $1।", "ਇਸ ਲਈ $1।"],
  [
    /^Solving this equation gives (.+?)\.$/,
    "समीकरण हल करने पर $1 मिलता है।",
    "ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਉੱਤੇ $1 ਮਿਲਦਾ ਹੈ।",
  ],
  [
    /^Cross differences give (.+?)\.$/,
    "क्रॉस के अंतरों से $1 मिलता है।",
    "ਕ੍ਰਾਸ ਦੇ ਫ਼ਰਕਾਂ ਤੋਂ $1 ਮਿਲਦਾ ਹੈ।",
  ],
  [/^Answer: (.+)$/, "उत्तर: $1", "ਉੱਤਰ: $1"],
);

// These prefixes introduce the source's unchanged calculation, not free prose.
for (const [en, hi, pa] of [
  [
    "Write the average-value equation",
    "औसत मूल्य का समीकरण बनाएँ",
    "ਔਸਤ ਮੁੱਲ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ",
  ],
  [
    "Form the value equation",
    "कुल मूल्य का समीकरण बनाएँ",
    "ਕੁੱਲ ਮੁੱਲ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ",
  ],
  ["Form the equation", "समीकरण बनाएँ", "ਸਮੀਕਰਨ ਬਣਾਓ"],
  ["Expand", "विस्तार करें", "ਵਿਸਥਾਰ ਕਰੋ"],
  [
    "Bring like terms together",
    "समान पद एक तरफ लें",
    "ਇੱਕੋ ਕਿਸਮ ਦੇ ਪਦ ਇੱਕ ਪਾਸੇ ਲਵੋ",
  ],
  ["Collect q terms", "q वाले पद एक तरफ लें", "q ਵਾਲੇ ਪਦ ਇੱਕ ਪਾਸੇ ਲਵੋ"],
  [
    "After collecting q terms",
    "q वाले पद एक तरफ लेने पर",
    "q ਵਾਲੇ ਪਦ ਇੱਕ ਪਾਸੇ ਲੈਣ ਉੱਤੇ",
  ],
  ["Add the value totals", "कुल मूल्यों को जोड़ें", "ਕੁੱਲ ਮੁੱਲ ਜੋੜੋ"],
  ["Add the quantities", "मात्राएँ जोड़ें", "ਮਾਤਰਾਵਾਂ ਜੋੜੋ"],
  ["Add the ratio parts", "अनुपात के भाग जोड़ें", "ਅਨੁਪਾਤ ਦੇ ਹਿੱਸੇ ਜੋੜੋ"],
  [
    "Calculate the value of one ratio part",
    "अनुपात के एक भाग की मात्रा निकालें",
    "ਅਨੁਪਾਤ ਦੇ ਇੱਕ ਹਿੱਸੇ ਦੀ ਮਾਤਰਾ ਕੱਢੋ",
  ],
  [
    "Find the actual amount added",
    "मिलाई गई वास्तविक मात्रा निकालें",
    "ਮਿਲਾਈ ਗਈ ਅਸਲ ਮਾਤਰਾ ਕੱਢੋ",
  ],
  [
    "Find the actual amount removed",
    "निकाली गई वास्तविक मात्रा निकालें",
    "ਕੱਢੀ ਗਈ ਅਸਲ ਮਾਤਰਾ ਕੱਢੋ",
  ],
  [
    "Form the ratio in the order asked",
    "पूछे गए क्रम में अनुपात बनाएँ",
    "ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਬਣਾਓ",
  ],
  [
    "Form and simplify the original ratio",
    "मूल अनुपात बनाकर सरल करें",
    "ਮੂਲ ਅਨੁਪਾਤ ਬਣਾ ਕੇ ਸਰਲ ਕਰੋ",
  ],
  ["Find one part", "एक भाग की मात्रा निकालें", "ਇੱਕ ਹਿੱਸੇ ਦੀ ਮਾਤਰਾ ਕੱਢੋ"],
  [
    "Find the vessel total",
    "पात्र की कुल मात्रा निकालें",
    "ਭਾਂਡੇ ਦੀ ਕੁੱਲ ਮਾਤਰਾ ਕੱਢੋ",
  ],
  [
    "Set this equal to the target amount and clear the denominator",
    "इसे लक्षित मात्रा के बराबर रखकर हर हटाएँ",
    "ਇਸ ਨੂੰ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਦੇ ਬਰਾਬਰ ਰੱਖ ਕੇ ਹਰ ਹਟਾਓ",
  ],
  ["Solve for the retained volume", "बचा हुआ आयतन निकालें", "ਬਚਿਆ ਆਇਤਨ ਕੱਢੋ"],
  [
    "Add the initial ratio parts",
    "प्रारंभिक अनुपात के भाग जोड़ें",
    "ਸ਼ੁਰੂਆਤੀ ਅਨੁਪਾਤ ਦੇ ਹਿੱਸੇ ਜੋੜੋ",
  ],
  [
    "Find the initial value of one part",
    "शुरू में एक भाग की मात्रा निकालें",
    "ਸ਼ੁਰੂ ਵਿੱਚ ਇੱਕ ਹਿੱਸੇ ਦੀ ਮਾਤਰਾ ਕੱਢੋ",
  ],
  [
    "Calculate the directed change",
    "बताए गए बदलाव की मात्रा निकालें",
    "ਦੱਸੀ ਤਬਦੀਲੀ ਦੀ ਮਾਤਰਾ ਕੱਢੋ",
  ],
  [
    "Write the original quantities using",
    "मूल मात्राएँ इस चर से लिखें",
    "ਮੂਲ ਮਾਤਰਾਵਾਂ ਇਸ ਚਰ ਨਾਲ ਲਿਖੋ",
  ],
  [
    "Rearrange and solve",
    "पद व्यवस्थित करके हल करें",
    "ਪਦ ਤਰਤੀਬ ਵਿੱਚ ਕਰਕੇ ਹੱਲ ਕਰੋ",
  ],
  ["Find the original total", "मूल कुल मात्रा निकालें", "ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ ਕੱਢੋ"],
  ["Find the total quantity", "कुल मात्रा निकालें", "ਕੁੱਲ ਮਾਤਰਾ ਕੱਢੋ"],
  ["Calculate the retained fraction", "बचा हुआ अंश निकालें", "ਬਚਿਆ ਅੰਸ਼ ਕੱਢੋ"],
  [
    "Reduce the final quantities",
    "अंतिम मात्राओं का अनुपात सरल करें",
    "ਅੰਤਿਮ ਮਾਤਰਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ",
  ],
  [
    "Find one target part",
    "लक्षित अनुपात में एक भाग की मात्रा निकालें",
    "ਲੋੜੀਂਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਇੱਕ ਹਿੱਸੇ ਦੀ ਮਾਤਰਾ ਕੱਢੋ",
  ],
  [
    "Compare with the current",
    "वर्तमान मात्रा से तुलना करें",
    "ਮੌਜੂਦਾ ਮਾਤਰਾ ਨਾਲ ਤੁਲਨਾ ਕਰੋ",
  ],
  ["Solve for the scale", "गुणक निकालें", "ਗੁਣਕ ਕੱਢੋ"],
  [
    "Represent the initial quantities as",
    "प्रारंभिक मात्राएँ इस प्रकार लिखें",
    "ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾਵਾਂ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖੋ",
  ],
  [
    "Fraction retained after one operation",
    "एक क्रिया के बाद बचा अंश",
    "ਇੱਕ ਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਅੰਸ਼",
  ],
  [
    "Initial original quantity",
    "मूल घटक की प्रारंभिक मात्रा",
    "ਮੂਲ ਘਟਕ ਦੀ ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾ",
  ],
  [
    "Exact retained fraction in one operation",
    "एक क्रिया में बचा सटीक अंश",
    "ਇੱਕ ਕਿਰਿਆ ਵਿੱਚ ਬਚਿਆ ਸਹੀ ਅੰਸ਼",
  ],
  [
    "Removed fraction in one operation",
    "एक क्रिया में निकाला गया अंश",
    "ਇੱਕ ਕਿਰਿਆ ਵਿੱਚ ਕੱਢਿਆ ਅੰਸ਼",
  ],
  ["Quantity drawn each time", "हर बार निकाली गई मात्रा", "ਹਰ ਵਾਰ ਕੱਢੀ ਮਾਤਰਾ"],
  [
    "One-stage retained fraction",
    "एक चरण में बचा अंश",
    "ਇੱਕ ਪੜਾਅ ਵਿੱਚ ਬਚਿਆ ਅੰਸ਼",
  ],
  [
    "Convert the final ratio to the final original fraction",
    "अंतिम अनुपात से मूल घटक का बचा अंश निकालें",
    "ਅੰਤਿਮ ਅਨੁਪਾਤ ਤੋਂ ਮੂਲ ਘਟਕ ਦਾ ਬਚਿਆ ਅੰਸ਼ ਕੱਢੋ",
  ],
  [
    "Take the square root of the retained fraction",
    "बचे अंश का वर्गमूल लें",
    "ਬਚੇ ਅੰਸ਼ ਦਾ ਵਰਗਮੂਲ ਲਵੋ",
  ],
  [
    "Use removed quantity = vessel capacity × removed fraction",
    "निकाली गई मात्रा = पात्र की क्षमता × निकाला गया अंश प्रयोग करें",
    "ਕੱਢੀ ਮਾਤਰਾ = ਭਾਂਡੇ ਦੀ ਸਮਰੱਥਾ × ਕੱਢਿਆ ਅੰਸ਼ ਵਰਤੋ",
  ],
  ["Solve for the capacity", "पात्र की क्षमता निकालें", "ਭਾਂਡੇ ਦੀ ਸਮਰੱਥਾ ਕੱਢੋ"],
  [
    "Strict threshold for the original component",
    "मूल घटक की सख्त सीमा",
    "ਮੂਲ ਘਟਕ ਦੀ ਸਖ਼ਤ ਹੱਦ",
  ],
] as const) {
  const pattern = new RegExp(
    "^" + en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ": (.+)$",
  );
  rules.push([pattern, hi + ": $1", pa + ": $1"]);
}

rules.push(
  [
    /^(.+?) represents (.+?) parts?, so one part = (.+?)\.$/,
    "$1 में $2 भाग हैं, इसलिए एक भाग = $3।",
    "$1 ਵਿੱਚ $2 ਹਿੱਸੇ ਹਨ, ਇਸ ਲਈ ਇੱਕ ਹਿੱਸਾ = $3।",
  ],
  [
    /^(.+?) uses (.+?) parts, so its quantity is (.+?)\.$/,
    "$1 के $2 भाग हैं, इसलिए इसकी मात्रा $3 है।",
    "$1 ਦੇ $2 ਹਿੱਸੇ ਹਨ, ਇਸ ਲਈ ਇਸ ਦੀ ਮਾਤਰਾ $3 ਹੈ।",
  ],
  [
    /^Since the quantity of (.+?) is unchanged, that quantity remains (.+?)\.$/,
    "$1 की मात्रा नहीं बदली है, इसलिए यह $2 ही रहती है।",
    "$1 ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲੀ, ਇਸ ਲਈ ਇਹ $2 ਹੀ ਰਹਿੰਦੀ ਹੈ।",
  ],
  [
    /^Update (.+?): (.+)$/,
    "$1 की नई मात्रा निकालें: $2",
    "$1 ਦੀ ਨਵੀਂ ਮਾਤਰਾ ਕੱਢੋ: $2",
  ],
  [
    /^Find (?:the retained )?(.+?): (.+)$/,
    "$1 की मात्रा निकालें: $2",
    "$1 ਦੀ ਮਾਤਰਾ ਕੱਢੋ: $2",
  ],
  [
    /^The required (?:quantity|amount) of (.+?) is (.+)$/,
    "$1 की आवश्यक मात्रा है: $2",
    "$1 ਦੀ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਹੈ: $2",
  ],
  [
    /^(.+?) corresponds to (.+?) in the ratio (.+?)\.$/,
    "अनुपात $3 में $1 के $2 हैं।",
    "ਅਨੁਪਾਤ $3 ਵਿੱਚ $1 ਦੇ $2 ਹਨ।",
  ],
  [/^(.+?) corresponds to (.+?)\.$/, "$1 के $2 हैं।", "$1 ਦੇ $2 ਹਨ।"],
  [
    /^After removal, the retained quantities are (.+?) of (.+?) and (.+?) of (.+?)\.$/,
    "निकालने के बाद $2 की मात्रा $1 और $4 की मात्रा $3 बचती है।",
    "ਕੱਢਣ ਤੋਂ ਬਾਅਦ $2 ਦੀ ਮਾਤਰਾ $1 ਅਤੇ $4 ਦੀ ਮਾਤਰਾ $3 ਬਚਦੀ ਹੈ।",
  ],
  [
    /^Adding back (.+?) of (.+?) gives the stated final quantities\.$/,
    "$1 $2 दोबारा मिलाने पर बताई गई अंतिम मात्राएँ मिलती हैं।",
    "$1 $2 ਮੁੜ ਮਿਲਾਉਣ ਉੱਤੇ ਦੱਸੀਆਂ ਅੰਤਿਮ ਮਾਤਰਾਵਾਂ ਮਿਲਦੀਆਂ ਹਨ।",
  ],
  [
    /^Add the refill to (.+?) only\.$/,
    "दोबारा भरते समय केवल $1 मिलाएँ।",
    "ਮੁੜ ਭਰਨ ਵੇਲੇ ਸਿਰਫ਼ $1 ਮਿਲਾਓ।",
  ],
  [
    /^The calculated quantities left in this instance are (.+?) and (.+?), and they reduce to the same ratio\.$/,
    "बची हुई मात्राएँ $1 और $2 हैं। इनका सरल अनुपात भी वही है।",
    "ਬਚੀਆਂ ਮਾਤਰਾਵਾਂ $1 ਅਤੇ $2 ਹਨ। ਇਨ੍ਹਾਂ ਦਾ ਸਰਲ ਅਨੁਪਾਤ ਵੀ ਉਹੀ ਹੈ।",
  ],
  [
    /^Since (.+?), the required quantity is greater than the current quantity\.$/,
    "$1 होने से आवश्यक मात्रा वर्तमान मात्रा से अधिक है।",
    "$1 ਹੋਣ ਕਰਕੇ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਮੌਜੂਦਾ ਮਾਤਰਾ ਤੋਂ ਵੱਧ ਹੈ।",
  ],
  [/^(.+?) must be added\.$/, "$1 मिलाना होगा।", "$1 ਮਿਲਾਉਣਾ ਪਵੇਗਾ।"],
  [
    /^After (.+?) operations?, the original quantity is about (.+?) litres, so it is still above (.+?)\.$/,
    "$1 क्रियाओं के बाद मूल घटक लगभग $2 लीटर बचता है, जो अब भी $3 से अधिक है।",
    "$1 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਘਟਕ ਲਗਭਗ $2 ਲੀਟਰ ਬਚਦਾ ਹੈ, ਜੋ ਹੁਣ ਵੀ $3 ਤੋਂ ਵੱਧ ਹੈ।",
  ],
  [
    /^Removed fraction per operation is (.+?)\.$/,
    "हर क्रिया में निकाला गया अंश $1 है।",
    "ਹਰ ਕਿਰਿਆ ਵਿੱਚ ਕੱਢਿਆ ਅੰਸ਼ $1 ਹੈ।",
  ],
  [
    /^Apply that same factor (.+?) times: (.+)$/,
    "इसी गुणक को $1 बार लगाएँ: $2",
    "ਇਸੇ ਗੁਣਕ ਨੂੰ $1 ਵਾਰ ਲਗਾਓ: $2",
  ],
  [
    /^Original (.+?) left after (.+?) operations is (.+)$/,
    "$2 क्रियाओं के बाद मूल $1 की बची मात्रा है: $3",
    "$2 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ $1 ਦੀ ਬਚੀ ਮਾਤਰਾ ਹੈ: $3",
  ],
  [
    /^The final total is still (.+?)\.$/,
    "अंतिम कुल मात्रा अब भी $1 है।",
    "ਅੰਤਿਮ ਕੁੱਲ ਮਾਤਰਾ ਹੁਣ ਵੀ $1 ਹੈ।",
  ],
  [
    /^First-stage retained fraction is (.+?)\.$/,
    "पहले चरण में बचा हुआ अंश $1 है।",
    "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਬਚਿਆ ਅੰਸ਼ $1 ਹੈ।",
  ],
  [
    /^Second-stage retained fraction is (.+?)\.$/,
    "दूसरे चरण में बचा हुआ अंश $1 है।",
    "ਦੂਜੇ ਪੜਾਅ ਵਿੱਚ ਬਚਿਆ ਅੰਸ਼ $1 ਹੈ।",
  ],
  [
    /^Multiply both A and B by this factor\.$/,
    "A और B दोनों की मात्राओं को इस गुणक से गुणा करें।",
    "A ਅਤੇ B ਦੋਵਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਨੂੰ ਇਸ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
  ],
  [
    /^After the first refill, (.+?)\.$/,
    "पहली बार दोबारा भरने के बाद: $1।",
    "ਪਹਿਲੀ ਵਾਰ ਮੁੜ ਭਰਨ ਤੋਂ ਬਾਅਦ: $1।",
  ],
  [
    /^Take the exact (.+?)th root: (.+)$/,
    "सटीक $1वीं घात का मूल लें: $2",
    "ਸਹੀ $1ਵੇਂ ਘਾਤ ਦਾ ਮੂਲ ਲਵੋ: $2",
  ],
  [
    /^Cost = (.+?) and revenue = (.+?), so total profit = (.+?)\.$/,
    "कुल लागत = $1 और बिक्री रकम = $2, इसलिए कुल लाभ = $3।",
    "ਕੁੱਲ ਲਾਗਤ = $1 ਅਤੇ ਵਿਕਰੀ ਰਕਮ = $2, ਇਸ ਲਈ ਕੁੱਲ ਲਾਭ = $3।",
  ],
  [
    /^Pure solute is added, so the amount of solvent remains unchanged\.$/,
    "शुद्ध विलेय मिलाया जाता है, इसलिए विलायक की मात्रा समान रहती है।",
    "ਸ਼ੁੱਧ ਘੁਲਣ ਵਾਲਾ ਪਦਾਰਥ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਘੋਲਕ ਦੀ ਮਾਤਰਾ ਬਰਾਬਰ ਰਹਿੰਦੀ ਹੈ।",
  ],
);

for (const [en, hi, pa] of [
  [
    "Reverse the addition:",
    "मिलाई गई मात्रा घटाकर मूल मात्रा निकालें:",
    "ਮਿਲਾਈ ਮਾਤਰਾ ਘਟਾ ਕੇ ਮੂਲ ਮਾਤਰਾ ਕੱਢੋ:",
  ],
  [
    "Reverse the removal:",
    "निकाली गई मात्रा जोड़कर मूल मात्रा निकालें:",
    "ਕੱਢੀ ਮਾਤਰਾ ਜੋੜ ਕੇ ਮੂਲ ਮਾਤਰਾ ਕੱਢੋ:",
  ],
  [
    "Represent the initial quantities as",
    "प्रारंभिक मात्राएँ इस प्रकार लिखें:",
    "ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾਵਾਂ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖੋ:",
  ],
  [
    "Retained fraction per stage is",
    "हर चरण में बचा अंश है:",
    "ਹਰ ਪੜਾਅ ਵਿੱਚ ਬਚਿਆ ਅੰਸ਼ ਹੈ:",
  ],
  [
    "Retained fraction per operation is",
    "हर क्रिया में बचा अंश है:",
    "ਹਰ ਕਿਰਿਆ ਵਿੱਚ ਬਚਿਆ ਅੰਸ਼ ਹੈ:",
  ],
  ["Total retained fraction is", "कुल बचा अंश है:", "ਕੁੱਲ ਬਚਿਆ ਅੰਸ਼ ਹੈ:"],
  ["Write", "समीकरण लिखें:", "ਸਮੀਕਰਨ ਲਿਖੋ:"],
  ["Divide to obtain", "भाग देने पर:", "ਭਾਗ ਦੇਣ ਉੱਤੇ:"],
  [
    "Required total retained fraction is",
    "कुल आवश्यक बचा अंश है:",
    "ਕੁੱਲ ਲੋੜੀਂਦਾ ਬਚਿਆ ਅੰਸ਼ ਹੈ:",
  ],
  [
    "Solve the exact integer relation",
    "पूर्णांक संबंध हल करें:",
    "ਪੂਰਨ ਅੰਕ ਸੰਬੰਧ ਹੱਲ ਕਰੋ:",
  ],
  [
    "Multiply by the initial quantity:",
    "प्रारंभिक मात्रा से गुणा करें:",
    "ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾ ਨਾਲ ਗੁਣਾ ਕਰੋ:",
  ],
  ["Simplify to", "सरल करने पर:", "ਸਰਲ ਕਰਨ ਉੱਤੇ:"],
  [
    "The removed fraction per operation is:",
    "हर क्रिया में निकाला गया अंश है:",
    "ਹਰ ਕਿਰਿਆ ਵਿੱਚ ਕੱਢਿਆ ਅੰਸ਼ ਹੈ:",
  ],
  [
    "Final A:B:C quantities are",
    "A:B:C की अंतिम मात्राएँ हैं:",
    "A:B:C ਦੀਆਂ ਅੰਤਿਮ ਮਾਤਰਾਵਾਂ ਹਨ:",
  ],
  [
    "Final original quantity:",
    "मूल घटक की अंतिम मात्रा:",
    "ਮੂਲ ਘਟਕ ਦੀ ਅੰਤਿਮ ਮਾਤਰਾ:",
  ],
  [
    "Final refill quantity:",
    "भरे गए द्रव की अंतिम मात्रा:",
    "ਭਰੇ ਤਰਲ ਦੀ ਅੰਤਿਮ ਮਾਤਰਾ:",
  ],
  [
    "Form the requested ordered ratio and reduce it:",
    "पूछे गए क्रम में अनुपात बनाकर सरल करें:",
    "ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਬਣਾ ਕੇ ਸਰਲ ਕਰੋ:",
  ],
] as const)
  rules.push([new RegExp("^" + en + " (.+)$"), hi + " $1", pa + " $1"]);

rules.push(
  [
    /^Write the original quantities using (.+?): (.+?) Write the final quantities using (.+?): (.+)$/,
    "$1 से मूल मात्राएँ लिखें: $2। $3 से अंतिम मात्राएँ लिखें: $4",
    "$1 ਨਾਲ ਮੂਲ ਮਾਤਰਾਵਾਂ ਲਿਖੋ: $2। $3 ਨਾਲ ਅੰਤਿਮ ਮਾਤਰਾਵਾਂ ਲਿਖੋ: $4",
  ],
  [
    /^Use the (.+?) operation: (.+?) Substitute (.+?): (.+)$/,
    "$1 में हुए बदलाव का समीकरण बनाएँ: $2। $3 रखने पर: $4",
    "$1 ਵਿੱਚ ਹੋਈ ਤਬਦੀਲੀ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ: $2। $3 ਰੱਖਣ ਉੱਤੇ: $4",
  ],
  [
    /^Use the change in (.+?): (.+)$/,
    "$1 में हुए बदलाव से: $2",
    "$1 ਵਿੱਚ ਹੋਈ ਤਬਦੀਲੀ ਤੋਂ: $2",
  ],
  [/^Check with (.+?): (.+)$/, "$1 से जाँच करें: $2", "$1 ਨਾਲ ਜਾਂਚ ਕਰੋ: $2"],
  [
    /^Compare with the current (.+?) quantity: (.+)$/,
    "$1 की वर्तमान मात्रा से तुलना करें: $2",
    "$1 ਦੀ ਮੌਜੂਦਾ ਮਾਤਰਾ ਨਾਲ ਤੁਲਨਾ ਕਰੋ: $2",
  ],
  [
    /^Multiply the initial (.+?) quantity by that fraction: (.+)$/,
    "मूल $1 की प्रारंभिक मात्रा को इस अंश से गुणा करें: $2",
    "ਮੂਲ $1 ਦੀ ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾ ਨੂੰ ਇਸ ਅੰਸ਼ ਨਾਲ ਗੁਣਾ ਕਰੋ: $2",
  ],
  [
    /^Final retained fraction after (.+?) operations: (.+)$/,
    "$1 क्रियाओं के बाद बचा अंतिम अंश: $2",
    "$1 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਅੰਤਿਮ ਅੰਸ਼: $2",
  ],
);

rules.push(
  [
    /^After A (?:sends|transfers) (.+?) litres, B contains (.+?) litres of (.+?) and (.+?) litres of (.+?), total (.+?) litres\.$/,
    "A से $1 लीटर भेजने के बाद B में $2 लीटर $3 और $4 लीटर $5 हैं; कुल $6 लीटर।",
    "A ਤੋਂ $1 ਲੀਟਰ ਭੇਜਣ ਤੋਂ ਬਾਅਦ B ਵਿੱਚ $2 ਲੀਟਰ $3 ਅਤੇ $4 ਲੀਟਰ $5 ਹਨ; ਕੁੱਲ $6 ਲੀਟਰ।",
  ],
  [
    /^From B, the (.+?)-litre return contains (.+?) litres of (.+?) and (.+?) litres of (.+?)\.$/,
    "B से लौटाए गए $1 लीटर मिश्रण में $2 लीटर $3 और $4 लीटर $5 हैं।",
    "B ਤੋਂ ਵਾਪਸ ਪਾਏ $1 ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ $2 ਲੀਟਰ $3 ਅਤੇ $4 ਲੀਟਰ $5 ਹਨ।",
  ],
  [
    /^A therefore has (.+?) litres of (.+?) and (.+?) litres of (.+?)\.$/,
    "इसलिए A में $1 लीटर $2 और $3 लीटर $4 हैं।",
    "ਇਸ ਲਈ A ਵਿੱਚ $1 ਲੀਟਰ $2 ਅਤੇ $3 ਲੀਟਰ $4 ਹਨ।",
  ],
  [
    /^The final (.+?)-litre transfer from this changed A contains (.+?) litres of (.+?) and (.+?) litres of (.+?)\.$/,
    "A के इस नए मिश्रण से अंत में भेजे गए $1 लीटर में $2 लीटर $3 और $4 लीटर $5 हैं।",
    "A ਦੇ ਇਸ ਨਵੇਂ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ਅੰਤ ਵਿੱਚ ਭੇਜੇ $1 ਲੀਟਰ ਵਿੱਚ $2 ਲੀਟਰ $3 ਅਤੇ $4 ਲੀਟਰ $5 ਹਨ।",
  ],
  [
    /^B finally has (.+?) litres of (.+?) and (.+?) litres of (.+?)\.$/,
    "अंत में B में $1 लीटर $2 और $3 लीटर $4 हैं।",
    "ਅੰਤ ਵਿੱਚ B ਵਿੱਚ $1 ਲੀਟਰ $2 ਅਤੇ $3 ਲੀਟਰ $4 ਹਨ।",
  ],
  [
    /^B finally has (.+?) litres (.+?) and (.+?) litres (.+?)\.$/,
    "अंत में B में $1 लीटर $2 और $3 लीटर $4 हैं।",
    "ਅੰਤ ਵਿੱਚ B ਵਿੱਚ $1 ਲੀਟਰ $2 ਅਤੇ $3 ਲੀਟਰ $4 ਹਨ।",
  ],
  [
    /^A now has (.+?) litres (.+?) in (.+?) litres\.$/,
    "अब A के $3 लीटर मिश्रण में $1 लीटर $2 है।",
    "ਹੁਣ A ਦੇ $3 ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 ਲੀਟਰ $2 ਹੈ।",
  ],
  [
    /^Therefore the (.+?) litres returned from A contains (.+?) litres (.+?) and (.+?) litres (.+?)\.$/,
    "इसलिए A से लौटाए गए $1 लीटर मिश्रण में $2 लीटर $3 और $4 लीटर $5 हैं।",
    "ਇਸ ਲਈ A ਤੋਂ ਵਾਪਸ ਪਾਏ $1 ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ $2 ਲੀਟਰ $3 ਅਤੇ $4 ਲੀਟਰ $5 ਹਨ।",
  ],
  [
    /^Let x litres be exchanged\.$/,
    "दोनों पात्रों से x लीटर का आदान-प्रदान मानें।",
    "ਦੋਵਾਂ ਭਾਂਡਿਆਂ ਵਿੱਚੋਂ x ਲੀਟਰ ਦਾ ਅਦਾਨ-ਪ੍ਰਦਾਨ ਮੰਨੋ।",
  ],
  [
    /^In A, final (.+?) = (.+?)\.$/,
    "A में अंत में $1 की मात्रा = $2।",
    "A ਵਿੱਚ ਅੰਤ ਵਿੱਚ $1 ਦੀ ਮਾਤਰਾ = $2।",
  ],
  [/^Solving, (.+?)\.$/, "हल करने पर: $1।", "ਹੱਲ ਕਰਨ ਉੱਤੇ: $1।"],
  [
    /^Equal concentrations give (.+?)\.$/,
    "दोनों सांद्रताएँ बराबर रखने पर: $1।",
    "ਦੋਵੇਂ ਸੰਘਣਾਪਣ ਬਰਾਬਰ ਰੱਖਣ ਉੱਤੇ: $1।",
  ],
  [
    /^A→B: salt moved = (.+?) of (.+?) ml = (.+?) ml\.$/,
    "A→B में भेजा गया नमक = $2 मिलीलीटर का $1 = $3 मिलीलीटर।",
    "A→B ਵਿੱਚ ਭੇਜਿਆ ਨਮਕ = $2 ਮਿਲੀਲੀਟਰ ਦਾ $1 = $3 ਮਿਲੀਲੀਟਰ।",
  ],
  [
    /^B now has (.+?) ml salt in (.+?) ml\.$/,
    "अब B के $2 मिलीलीटर घोल में $1 मिलीलीटर नमक है।",
    "ਹੁਣ B ਦੇ $2 ਮਿਲੀਲੀਟਰ ਘੋਲ ਵਿੱਚ $1 ਮਿਲੀਲੀਟਰ ਨਮਕ ਹੈ।",
  ],
  [
    /^B→C: (.+?) ml of this new B mixture carries (.+?) ml salt\.$/,
    "B के नए घोल में से C में भेजे गए $1 मिलीलीटर में $2 मिलीलीटर नमक है।",
    "B ਦੇ ਨਵੇਂ ਘੋਲ ਵਿੱਚੋਂ C ਵਿੱਚ ਭੇਜੇ $1 ਮਿਲੀਲੀਟਰ ਵਿੱਚ $2 ਮਿਲੀਲੀਟਰ ਨਮਕ ਹੈ।",
  ],
  [
    /^C now has (.+?) ml salt in (.+?) ml\.$/,
    "अब C के $2 मिलीलीटर घोल में $1 मिलीलीटर नमक है।",
    "ਹੁਣ C ਦੇ $2 ਮਿਲੀਲੀਟਰ ਘੋਲ ਵਿੱਚ $1 ਮਿਲੀਲੀਟਰ ਨਮਕ ਹੈ।",
  ],
  [
    /^C→A: the last (.+?) ml carries (.+?) ml salt back to A\.$/,
    "C से A में अंत में भेजे गए $1 मिलीलीटर में $2 मिलीलीटर नमक है।",
    "C ਤੋਂ A ਵਿੱਚ ਅੰਤ ਵਿੱਚ ਭੇਜੇ $1 ਮਿਲੀਲੀਟਰ ਵਿੱਚ $2 ਮਿਲੀਲੀਟਰ ਨਮਕ ਹੈ।",
  ],
  [
    /^A finally has (.+?) ml salt in (.+?) ml; concentration = (.+?)\.$/,
    "अंत में A के $2 मिलीलीटर घोल में $1 मिलीलीटर नमक है; सांद्रता = $3।",
    "ਅੰਤ ਵਿੱਚ A ਦੇ $2 ਮਿਲੀਲੀਟਰ ਘੋਲ ਵਿੱਚ $1 ਮਿਲੀਲੀਟਰ ਨਮਕ ਹੈ; ਸੰਘਣਾਪਣ = $3।",
  ],
  [
    /^After adding (.+?) litres pure water, A has (.+?) litres spirit in (.+?) litres, so A is now (.+?) spirit\.$/,
    "$1 लीटर शुद्ध पानी मिलाने पर A के $3 लीटर मिश्रण में $2 लीटर स्पिरिट है। इसलिए अब स्पिरिट $4 है।",
    "$1 ਲੀਟਰ ਸ਼ੁੱਧ ਪਾਣੀ ਮਿਲਾਉਣ ਉੱਤੇ A ਦੇ $3 ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ $2 ਲੀਟਰ ਸਪਿਰਿਟ ਹੈ। ਇਸ ਲਈ ਹੁਣ ਸਪਿਰਿਟ $4 ਹੈ।",
  ],
  [
    /^After A→B, B has (.+?) litres milk and (.+?) litres water, total (.+?) litres\.$/,
    "A→B स्थानांतरण के बाद B में $1 लीटर दूध और $2 लीटर पानी हैं; कुल $3 लीटर।",
    "A→B ਤਰਲ ਭੇਜਣ ਤੋਂ ਬਾਅਦ B ਵਿੱਚ $1 ਲੀਟਰ ਦੁੱਧ ਅਤੇ $2 ਲੀਟਰ ਪਾਣੀ ਹਨ; ਕੁੱਲ $3 ਲੀਟਰ।",
  ],
  [
    /^Milk in A = (.+?); water left in B = (.+?)\.$/,
    "A में दूध = $1; B में बचा पानी = $2।",
    "A ਵਿੱਚ ਦੁੱਧ = $1; B ਵਿੱਚ ਬਚਿਆ ਪਾਣੀ = $2।",
  ],
  [/^(.+?), so x = (.+?)\.$/, "$1 होने से x = $2।", "$1 ਹੋਣ ਕਰਕੇ x = $2।"],
  [
    /^Check: B then has (.+?) litres of (.+?) \+ (.+?) litres of (.+?) = (.+?) litres\.$/,
    "जाँच: अब B में $1 लीटर $2 + $3 लीटर $4 = $5 लीटर हैं।",
    "ਜਾਂਚ: ਹੁਣ B ਵਿੱਚ $1 ਲੀਟਰ $2 + $3 ਲੀਟਰ $4 = $5 ਲੀਟਰ ਹਨ।",
  ],
  [
    /^In the (.+?) litres returned, (.+?) = (.+?) litres and (.+?) = (.+?) litres\.$/,
    "लौटाए गए $1 लीटर में $2 = $3 लीटर और $4 = $5 लीटर है।",
    "ਵਾਪਸ ਪਾਏ $1 ਲੀਟਰ ਵਿੱਚ $2 = $3 ਲੀਟਰ ਅਤੇ $4 = $5 ਲੀਟਰ ਹੈ।",
  ],
  [
    /^A finally has (.+?) = (.+?) litres and (.+?) = (.+?) litres, giving (.+?)\.$/,
    "अंत में A में $1 = $2 लीटर और $3 = $4 लीटर है। इसलिए अनुपात $5 है।",
    "ਅੰਤ ਵਿੱਚ A ਵਿੱਚ $1 = $2 ਲੀਟਰ ਅਤੇ $3 = $4 ਲੀਟਰ ਹੈ। ਇਸ ਲਈ ਅਨੁਪਾਤ $5 ਹੈ।",
  ],
  [
    /^The mixture transferred to C has the same composition as B\.$/,
    "C में भेजे गए मिश्रण में घटकों का अनुपात B के समान है।",
    "C ਵਿੱਚ ਭੇਜੇ ਮਿਸ਼ਰਣ ਵਿੱਚ ਘਟਕਾਂ ਦਾ ਅਨੁਪਾਤ B ਵਰਗਾ ਹੈ।",
  ],
  [
    /^Hence (.+?) added to B = (.+?)\.$/,
    "अतः B में मिलाया गया $1 = $2।",
    "ਇਸ ਲਈ B ਵਿੱਚ ਮਿਲਾਇਆ $1 = $2।",
  ],
  [
    /^B now has (.+?) litres of (.+?) in (.+?) litres\.$/,
    "अब B के $3 लीटर मिश्रण में $1 लीटर $2 है।",
    "ਹੁਣ B ਦੇ $3 ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 ਲੀਟਰ $2 ਹੈ।",
  ],
  [
    /^Mixture sent to C = (.+?) litres, so (.+?) sent to C = (.+?)\.$/,
    "C में भेजा मिश्रण = $1 लीटर, इसलिए C में भेजा $2 = $3।",
    "C ਵਿੱਚ ਭੇਜਿਆ ਮਿਸ਼ਰਣ = $1 ਲੀਟਰ, ਇਸ ਲਈ C ਵਿੱਚ ਭੇਜਿਆ $2 = $3।",
  ],
);

rules.push(
  [
    /^Retained original fraction after (.+?) operations: (.+)$/,
    "$1 क्रियाओं के बाद मूल घटक का बचा अंश: $2",
    "$1 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਘਟਕ ਦਾ ਬਚਿਆ ਅੰਸ਼: $2",
  ],
  [
    /^B→A: (.+?) moved = (.+?) of (.+?) litres = (.+?) litres; water moved = (.+?) litres\.$/,
    "B→A में भेजा गया $1 = $3 लीटर का $2 = $4 लीटर; भेजा गया पानी = $5 लीटर।",
    "B→A ਵਿੱਚ ਭੇਜਿਆ $1 = $3 ਲੀਟਰ ਦਾ $2 = $4 ਲੀਟਰ; ਭੇਜਿਆ ਪਾਣੀ = $5 ਲੀਟਰ।",
  ],
  [
    /^(First|Second) transfer: spirit = (.+?) of (.+?) litres = (.+?) litres; water = (.+?) litres\.$/,
    "$1 स्थानांतरण में स्पिरिट = $3 लीटर का $2 = $4 लीटर; पानी = $5 लीटर।",
    "$1 ਵਾਰ ਭੇਜੀ ਸਪਿਰਿਟ = $3 ਲੀਟਰ ਦਾ $2 = $4 ਲੀਟਰ; ਪਾਣੀ = $5 ਲੀਟਰ।",
  ],
  [
    /^A's final ratio is (.+?)\.$/,
    "A का अंतिम अनुपात है: $1।",
    "A ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ ਹੈ: $1।",
  ],
  [
    /^Multiplying both parts by (.+?) gives (.+?)\.$/,
    "दोनों भागों को $1 से गुणा करने पर $2 मिलता है।",
    "ਦੋਵੇਂ ਹਿੱਸਿਆਂ ਨੂੰ $1 ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ $2 ਮਿਲਦਾ ਹੈ।",
  ],
  [
    /^(.+?), so (.+?) and (.+?)\.$/,
    "$1 होने से $2 और $3 मिलता है।",
    "$1 ਹੋਣ ਕਰਕੇ $2 ਅਤੇ $3 ਮਿਲਦਾ ਹੈ।",
  ],
  [
    /^Original solution (.+?)\nTarget (.+?)\nWater (.+)$/,
    "मूल घोल $1\nलक्ष्य $2\nपानी $3",
    "ਮੂਲ ਘੋਲ $1\nਟੀਚਾ $2\nਪਾਣੀ $3",
  ],
  [
    /^Pure solute (.+?)\nTarget (.+?)\nOriginal solution (.+)$/,
    "शुद्ध विलेय $1\nलक्ष्य $2\nमूल घोल $3",
    "ਸ਼ੁੱਧ ਘੁਲਣ ਵਾਲਾ ਪਦਾਰਥ $1\nਟੀਚਾ $2\nਮੂਲ ਘੋਲ $3",
  ],
);

rules.push(
  [
    /^Therefore (.+?) : (.+?) in B = (.+?)\.$/,
    "इसलिए B में $1 : $2 = $3।",
    "ਇਸ ਲਈ B ਵਿੱਚ $1 : $2 = $3।",
  ],
  [
    /^(.+?) stays unchanged\.$/,
    "$1 की मात्रा नहीं बदलती।",
    "$1 ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲਦੀ।",
  ],
  [
    /^(.+?) remains fixed\.$/,
    "$1 की मात्रा समान रहती है।",
    "$1 ਦੀ ਮਾਤਰਾ ਬਰਾਬਰ ਰਹਿੰਦੀ ਹੈ।",
  ],
  [
    /^(.+?) is the unchanged linking component\.$/,
    "$1 वह घटक है जिसकी मात्रा दोनों अवस्थाओं में समान है।",
    "$1 ਉਹ ਘਟਕ ਹੈ ਜਿਸ ਦੀ ਮਾਤਰਾ ਦੋਵਾਂ ਅਵਸਥਾਵਾਂ ਵਿੱਚ ਬਰਾਬਰ ਹੈ।",
  ],
  [
    /^Add (.+?) to (.+?) and (.+?) to (.+)$/,
    "$2 में $1 और $4 में $3 मिलाएँ।",
    "$2 ਵਿੱਚ $1 ਅਤੇ $4 ਵਿੱਚ $3 ਮਿਲਾਓ।",
  ],
  [/^Add (.+)$/, "$1 मिलाएँ।", "$1 ਮਿਲਾਓ।"],
  [
    /^Remove (.+?) mixed sample; refill (?:with )?(.+)$/,
    "$1 मिश्रित नमूना निकालकर $2 दोबारा भरें।",
    "$1 ਮਿਲਿਆ ਨਮੂਨਾ ਕੱਢ ਕੇ $2 ਮੁੜ ਭਰੋ।",
  ],
  [
    /^Remove mixed sample; refill with (.+)$/,
    "मिश्रित नमूना निकालकर $1 दोबारा भरें।",
    "ਮਿਲਿਆ ਨਮੂਨਾ ਕੱਢ ਕੇ $1 ਮੁੜ ਭਰੋ।",
  ],
  [/^Remove (.+)$/, "$1 निकालें।", "$1 ਕੱਢੋ।"],
  [
    /^Partition (.+?) by ratio parts$/,
    "$1 को अनुपात के भागों में बाँटें।",
    "$1 ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡੋ।",
  ],
);

rules.push(
  [/^Substitute (.+?): (.+)$/, "$1 रखने पर: $2", "$1 ਰੱਖਣ ਉੱਤੇ: $2"],
  [
    /^Write the (original|final) quantities using (.+?): (.+)$/,
    "$2 से $1 मात्राएँ लिखें: $3",
    "$2 ਨਾਲ $1 ਮਾਤਰਾਵਾਂ ਲਿਖੋ: $3",
  ],
  [
    /^(.+?), so (.+?) and (.+?)$/,
    "$1 होने से $2 और $3 मिलता है।",
    "$1 ਹੋਣ ਕਰਕੇ $2 ਅਤੇ $3 ਮਿਲਦਾ ਹੈ।",
  ],
  [/^Therefore (.+?)\.$/, "इसलिए $1।", "ਇਸ ਲਈ $1।"],
);
rules.push([
  /^Use the (.+?) operation: (.+)$/,
  "$1 के बदलाव का समीकरण बनाएँ: $2",
  "$1 ਦੀ ਤਬਦੀਲੀ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ: $2",
]);
rules.push(
  [
    /^(.+?) has (.+?) ratio part\.$/,
    "$1 का अनुपात में $2 भाग है।",
    "$1 ਦਾ ਅਨੁਪਾਤ ਵਿੱਚ $2 ਹਿੱਸਾ ਹੈ।",
  ],
  [
    /^The quantity of (.+?) is the same in both states: (.+)$/,
    "दोनों अवस्थाओं में $1 की मात्रा समान है: $2",
    "ਦੋਵਾਂ ਅਵਸਥਾਵਾਂ ਵਿੱਚ $1 ਦੀ ਮਾਤਰਾ ਬਰਾਬਰ ਹੈ: $2",
  ],
  [
    /^Known (.+?) fixes one-part value$/,
    "$1 की ज्ञात मात्रा से एक भाग की मात्रा निकालें।",
    "$1 ਦੀ ਪਤਾ ਮਾਤਰਾ ਨਾਲ ਇੱਕ ਹਿੱਸੇ ਦੀ ਮਾਤਰਾ ਕੱਢੋ।",
  ],
);
Object.assign(exact, {
  "The item not adjusted connects the original scale x to the final scale y": [
    "जिस घटक की मात्रा नहीं बदली, उससे मूल गुणक x और अंतिम गुणक y का संबंध निकालें।",
    "ਜਿਸ ਘਟਕ ਦੀ ਮਾਤਰਾ ਨਹੀਂ ਬਦਲੀ, ਉਸ ਨਾਲ ਮੂਲ ਗੁਣਕ x ਅਤੇ ਅੰਤਿਮ ਗੁਣਕ y ਦਾ ਸੰਬੰਧ ਕੱਢੋ।",
  ],
  "Alligation Cross — Pure Solute Addition": [
    "क्रॉस नियम — शुद्ध विलेय मिलाना",
    "ਕ੍ਰਾਸ ਨਿਯਮ — ਸ਼ੁੱਧ ਘੁਲਣ ਵਾਲਾ ਪਦਾਰਥ ਮਿਲਾਉਣਾ",
  ],
});
const specificity = (r: Rule) =>
  r[0].source.length - (r[0].source.match(/\.\+/g)?.length ?? 0) * 15;
rules.sort((a, b) => specificity(b) - specificity(a));
