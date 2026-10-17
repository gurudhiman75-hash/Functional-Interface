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
  soyabean: ["सोयाबीन", "ਸੋਇਆਬੀਨ"],
  reserve: ["रिज़र्व", "ਰਿਜ਼ਰਵ"],
  "special-grade": ["विशेष श्रेणी", "ਵਿਸ਼ੇਸ਼ ਸ਼੍ਰੇਣੀ"],
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
  let text = fragmentUncached(s, language);
  // The threshold family supplies bare TeX equations; delimit them for the UI.
  if (
    /^[A-Za-z_][A-Za-z_0-9]*\s*=/.test(s) &&
    /\\(?:frac|dfrac|left|times)\b/.test(s)
  )
    text = `\\(${text}\\)`;

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
      /\b(?:red|nilgiri|oats|olive|mean|dilution|reserve|special-grade|soyabean)\b/gi,
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
    "विक्रेता $1 लीटर की…10943 tokens truncated…changed\.$/,
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
rules.push([
  /^Equal round-trip shortcut: final (.+?)-to-(.+?) ratio in A = starting quantity in A : quantity transferred = (.+?)\.$/,
  "समान मात्रा भेजने और लौटाने पर A का अंतिम $1 : $2 अनुपात = A की प्रारंभिक मात्रा : हर बार भेजी गई मात्रा = $3।",
  "ਬਰਾਬਰ ਮਾਤਰਾ ਭੇਜਣ ਅਤੇ ਵਾਪਸ ਪਾਉਣ ਉੱਤੇ A ਦਾ ਅੰਤਿਮ $1 : $2 ਅਨੁਪਾਤ = A ਦੀ ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾ : ਹਰ ਵਾਰ ਭੇਜੀ ਮਾਤਰਾ = $3।",
]);
rules.push([
  /^(.+?) remaining in B = (.+?)\.$/,
  "B में बचा $1 = $2।",
  "B ਵਿੱਚ ਬਚਿਆ $1 = $2।",
]);

// Authored collapsed CP001 concept and verification guidance.
Object.assign(exact, {
  "Use the standard weighted-average equation": [
    "भारित औसत का मानक समीकरण लगाएँ।",
    "ਭਾਰਿਤ ਔਸਤ ਦਾ ਮਿਆਰੀ ਸਮੀਕਰਨ ਵਰਤੋ।"
  ],
  "Let the two required quantities be x and y, form the average-price equation, and simplify x : y": [
    "दोनों आवश्यक मात्राएँ x और y मानें। औसत मूल्य का समीकरण बनाकर x : y सरल करें।",
    "ਦੋਵੇਂ ਲੋੜੀਂਦੀਆਂ ਮਾਤਰਾਵਾਂ x ਅਤੇ y ਮੰਨੋ। ਔਸਤ ਕੀਮਤ ਦਾ ਸਮੀਕਰਨ ਬਣਾ ਕੇ x : y ਨੂੰ ਸਰਲ ਕਰੋ।"
  ],
  "The amount of each item matters": [
    "हर वस्तु की मात्रा को ध्यान में रखना ज़रूरी है।",
    "ਹਰ ਵਸਤੂ ਦੀ ਮਾਤਰਾ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਣਾ ਜ਼ਰੂਰੀ ਹੈ।"
  ],
  "Multiply each price by its quantity, add the value totals, and divide by the total quantity": [
    "हर वस्तु के मूल्य को उसकी मात्रा से गुणा करें। सभी लागतें जोड़कर कुल मात्रा से भाग दें।",
    "ਹਰ ਵਸਤੂ ਦੀ ਕੀਮਤ ਨੂੰ ਉਸ ਦੀ ਮਾਤਰਾ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਸਾਰੀਆਂ ਲਾਗਤਾਂ ਜੋੜ ਕੇ ਕੁੱਲ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦਿਓ।"
  ],
  "First find the value the whole mixture must have": [
    "पहले पूरे मिश्रण की आवश्यक कुल लागत निकालें।",
    "ਪਹਿਲਾਂ ਪੂਰੇ ਮਿਸ਼ਰਣ ਦੀ ਲੋੜੀਂਦੀ ਕੁੱਲ ਲਾਗਤ ਕੱਢੋ।"
  ],
  "Then remove the value already given by the known item": [
    "फिर ज्ञात वस्तु की लागत घटाएँ।",
    "ਫਿਰ ਪਤਾ ਵਸਤੂ ਦੀ ਲਾਗਤ ਘਟਾਓ।"
  ],
  "The value left is for the unknown item": [
    "शेष लागत अज्ञात वस्तु की है।",
    "ਬਾਕੀ ਲਾਗਤ ਅਣਜਾਣ ਵਸਤੂ ਦੀ ਹੈ।"
  ],
  "Use the ratio numbers as small sample quantities": [
    "अनुपात के अंकों को नमूने की मात्राएँ मानें।",
    "ਅਨੁਪਾਤ ਦੇ ਅੰਕਾਂ ਨੂੰ ਨਮੂਨੇ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਮੰਨੋ।"
  ],
  "Find the total value needed for all parts, remove the known part, and divide the value left by the unknown parts": [
    "सभी भागों की आवश्यक कुल लागत निकालें। ज्ञात भाग की लागत घटाकर शेष लागत को अज्ञात भागों की संख्या से भाग दें।",
    "ਸਾਰੇ ਹਿੱਸਿਆਂ ਦੀ ਲੋੜੀਂਦੀ ਕੁੱਲ ਲਾਗਤ ਕੱਢੋ। ਪਤਾ ਹਿੱਸੇ ਦੀ ਲਾਗਤ ਘਟਾ ਕੇ ਬਾਕੀ ਲਾਗਤ ਨੂੰ ਅਣਜਾਣ ਹਿੱਸਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।"
  ],
  "Use total value = average price × total quantity": [
    "कुल लागत = औसत मूल्य × कुल मात्रा का उपयोग करें।",
    "ਕੁੱਲ ਲਾਗਤ = ਔਸਤ ਕੀਮਤ × ਕੁੱਲ ਮਾਤਰਾ ਵਰਤੋ।"
  ],
  "Let the required new quantity be q and solve the resulting linear equation": [
    "मिलाई जाने वाली मात्रा q मानकर प्राप्त रैखिक समीकरण हल करें।",
    "ਮਿਲਾਈ ਜਾਣ ਵਾਲੀ ਮਾਤਰਾ q ਮੰਨ ਕੇ ਬਣਿਆ ਰੇਖੀ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।"
  ],
  "Use one total-value equation for all known items and the unknown quantity": [
    "सभी ज्ञात वस्तुओं और अज्ञात मात्रा के लिए कुल लागत का एक समीकरण बनाएँ।",
    "ਸਾਰੀਆਂ ਪਤਾ ਵਸਤੂਆਂ ਅਤੇ ਅਣਜਾਣ ਮਾਤਰਾ ਲਈ ਕੁੱਲ ਲਾਗਤ ਦਾ ਇੱਕ ਸਮੀਕਰਨ ਬਣਾਓ।"
  ],
  "This keeps the main solution purely formula based": [
    "इससे मुख्य हल सीधे सूत्र के आधार पर मिलता है।",
    "ਇਸ ਨਾਲ ਮੁੱਖ ਹੱਲ ਸਿੱਧਾ ਫਾਰਮੂਲੇ ਦੇ ਆਧਾਰ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।"
  ],
  "Let the lower-priced quantity be x": [
    "कम मूल्य वाली वस्तु की मात्रा x मानें।",
    "ਘੱਟ ਕੀਮਤ ਵਾਲੀ ਵਸਤੂ ਦੀ ਮਾਤਰਾ x ਮੰਨੋ।"
  ],
  "The higher-priced quantity is the given total minus x": [
    "अधिक मूल्य वाली वस्तु की मात्रा = दी गई कुल मात्रा − x।",
    "ਵੱਧ ਕੀਮਤ ਵਾਲੀ ਵਸਤੂ ਦੀ ਮਾਤਰਾ = ਦਿੱਤੀ ਕੁੱਲ ਮਾਤਰਾ − x।"
  ],
  "Use the total-value equation and solve": [
    "कुल लागत का समीकरण बनाकर हल करें।",
    "ਕੁੱਲ ਲਾਗਤ ਦਾ ਸਮੀਕਰਨ ਬਣਾ ਕੇ ਹੱਲ ਕਰੋ।"
  ],
  "Solve the first mixture completely": [
    "पहले मिश्रण का हल पूरा करें।",
    "ਪਹਿਲੇ ਮਿਸ਼ਰਣ ਦਾ ਹੱਲ ਪੂਰਾ ਕਰੋ।"
  ],
  "Then treat the used portion of that mixture as one new item in the second mixing step": [
    "दूसरे चरण में पहले मिश्रण से लिए गए हिस्से को एक वस्तु मानें।",
    "ਦੂਜੇ ਪੜਾਅ ਵਿੱਚ ਪਹਿਲੇ ਮਿਸ਼ਰਣ ਤੋਂ ਲਏ ਹਿੱਸੇ ਨੂੰ ਇੱਕ ਵਸਤੂ ਮੰਨੋ।"
  ],
  "A simple average is correct only when the two quantities are equal": [
    "साधारण औसत तभी सही है जब दोनों मात्राएँ बराबर हों।",
    "ਸਧਾਰਨ ਔਸਤ ਤਾਂ ਹੀ ਸਹੀ ਹੈ ਜਦੋਂ ਦੋਵੇਂ ਮਾਤਰਾਵਾਂ ਬਰਾਬਰ ਹੋਣ।"
  ],
  "A reversed ratio is formed when the two cross differences are written under the wrong items": [
    "दोनों क्रॉस अंतर गलत वस्तुओं के नीचे लिखने से अनुपात उलट जाता है।",
    "ਦੋਵੇਂ ਕ੍ਰਾਸ ਅੰਤਰ ਗਲਤ ਵਸਤੂਆਂ ਹੇਠ ਲਿਖਣ ਨਾਲ ਅਨੁਪਾਤ ਉਲਟ ਜਾਂਦਾ ਹੈ।"
  ],
  "Always answer in the order used in the question": [
    "उत्तर में वस्तुओं का क्रम प्रश्न के अनुसार रखें।",
    "ਉੱਤਰ ਵਿੱਚ ਵਸਤੂਆਂ ਦਾ ਕ੍ਰਮ ਸਵਾਲ ਅਨੁਸਾਰ ਰੱਖੋ।"
  ],
  "Leaving out even one item changes both the total value and the total quantity": [
    "एक भी वस्तु छोड़ने से कुल लागत और कुल मात्रा दोनों बदल जाती हैं।",
    "ਇੱਕ ਵੀ ਵਸਤੂ ਛੱਡਣ ਨਾਲ ਕੁੱਲ ਲਾਗਤ ਅਤੇ ਕੁੱਲ ਮਾਤਰਾ ਦੋਵੇਂ ਬਦਲ ਜਾਂਦੀਆਂ ਹਨ।"
  ],
  "Include every item": [
    "हर वस्तु को शामिल करें।",
    "ਹਰ ਵਸਤੂ ਨੂੰ ਸ਼ਾਮਲ ਕਰੋ।"
  ]
});
rules.push(
  [/^Common trap: do not choose Option ([A-D]) \((.+?)\)\.$/, "सामान्य गलती: विकल्प $1 ($2) न चुनें।", "ਆਮ ਗਲਤੀ: ਵਿਕਲਪ $1 ($2) ਨਾ ਚੁਣੋ।"],
  [/^(.+?) gives an average of (.+?), which is exactly the target price\.$/, "$1 से औसत मूल्य $2 मिलता है, जो दिए गए लक्ष्य के बराबर है।", "$1 ਨਾਲ ਔਸਤ ਕੀਮਤ $2 ਮਿਲਦੀ ਹੈ, ਜੋ ਦਿੱਤੇ ਟੀਚੇ ਦੇ ਬਰਾਬਰ ਹੈ।"],
  [/^The final average price is (.+?)\.$/, "अंतिम औसत मूल्य $1 है।", "ਅੰਤਿਮ ਔਸਤ ਕੀਮਤ $1 ਹੈ।"],
  [/^The final mixture costs (.+?)\.$/, "अंतिम मिश्रण का मूल्य $1 है।", "ਅੰਤਿਮ ਮਿਸ਼ਰਣ ਦੀ ਕੀਮਤ $1 ਹੈ।"],
  [/^putting (.+?) back into the mixture gives the required average of (.+?)\.$/, "$1 को मिश्रण में रखकर जाँचने पर आवश्यक औसत $2 मिलता है।", "$1 ਨੂੰ ਮਿਸ਼ਰਣ ਵਿੱਚ ਰੱਖ ਕੇ ਜਾਂਚਣ ਉੱਤੇ ਲੋੜੀਂਦੀ ਔਸਤ $2 ਮਿਲਦੀ ਹੈ।"],
  [/^the answer (.+?) matches the ratio and total quantity, giving the target price (.+?)\.$/, "उत्तर $1 दिए गए अनुपात और कुल मात्रा के अनुरूप है। इससे लक्षित मूल्य $2 मिलता है।", "ਉੱਤਰ $1 ਦਿੱਤੇ ਅਨੁਪਾਤ ਅਤੇ ਕੁੱਲ ਮਾਤਰਾ ਅਨੁਸਾਰ ਹੈ। ਇਸ ਨਾਲ ਲੋੜੀਂਦੀ ਕੀਮਤ $2 ਮਿਲਦੀ ਹੈ।"],
);
const specificity = (r: Rule) =>
  r[0].source.length - (r[0].source.match(/\.\+/g)?.length ?? 0) * 15;
rules.sort((a, b) => specificity(b) - specificity(a));
