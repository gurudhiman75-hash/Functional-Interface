import { applyAvg001LocalizedStemFinal } from "./localized-stem-final";
import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

function shown(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") return String(rendered);
  const raw = pkg.parameters.values[key];
  if (typeof raw === "string" || typeof raw === "number") return String(raw);
  if (raw && typeof raw === "object" && "numerator" in raw && "denominator" in raw) {
    const numerator = Number(raw.numerator);
    const denominator = Number(raw.denominator);
    return denominator === 1 ? String(numerator) : String(numerator / denominator);
  }
  return "";
}

function cp001Fix(pkg: Avg001QuestionPackage, language: PilotLanguage, stem: string) {
  if (language === "hi") {
    if (pkg.questionLanguageId === "AVG-QL-374") {
      return stem.replace("20 परीक्षा अंकों", "20 परीक्षाओं के अंकों");
    }
    if (pkg.questionLanguageId === "AVG-QL-375" || pkg.questionLanguageId === "AVG-QL-378") {
      return stem.replace(/प्रेक्षणों/g, "मानों");
    }
    if (pkg.questionLanguageId === "AVG-QL-376") {
      return `10 दर्ज मापों का औसत 40 है। हर माप को 3 से गुणा करके उसमें 3 जोड़ा जाता है। नया औसत ज्ञात कीजिए।`;
    }
  } else {
    if (pkg.questionLanguageId === "AVG-QL-374") {
      return stem.replace("20 ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕਾਂ", "20 ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਅੰਕਾਂ");
    }
    if (pkg.questionLanguageId === "AVG-QL-376") {
      return `10 ਦਰਜ ਮਾਪਾਂ ਦੀ ਔਸਤ 40 ਹੈ। ਹਰ ਮਾਪ ਨੂੰ 3 ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਉਸ ਵਿੱਚ 3 ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    }
  }
  return stem;
}

function cp003SpecificFix(pkg: Avg001QuestionPackage, language: PilotLanguage, stem: string) {
  const qlId = pkg.questionLanguageId;
  const count = shown(pkg, "oldCount");
  const average = shown(pkg, "oldAverage");
  const newAverage = shown(pkg, "newAverage");
  const oldValue = shown(pkg, "oldValue");
  const newValue = shown(pkg, "newValue");

  if (language === "hi") {
    if (qlId === "AVG-QL-152") {
      return `${count} पार्सलों का औसत वजन ${average} किग्रा है। ${oldValue} किग्रा के पार्सल के स्थान पर ${newValue} किग्रा का पार्सल रखा जाता है। नया औसत वजन ज्ञात कीजिए।`;
    }
    if (qlId === "AVG-QL-156") {
      return `${count} दर्ज मापों का औसत ${average} है। ${oldValue} के स्थान पर ${newValue} दर्ज करने पर नया औसत ज्ञात कीजिए।`;
    }
    if (qlId === "AVG-QL-189") {
      return `${count} मशीनों का औसत उत्पादन ${average} इकाइयाँ था। ${oldValue} इकाइयाँ बनाने वाली मशीन को बदलने पर औसत उत्पादन ${newAverage} इकाइयाँ हो गया। नई मशीन का उत्पादन ज्ञात कीजिए।`;
    }
    if (qlId === "AVG-QL-190") {
      return `${count} पार्सलों का औसत वजन ${average} किग्रा था। ${oldValue} किग्रा के पार्सल के स्थान पर नया पार्सल रखने से औसत वजन ${newAverage} किग्रा हो गया। नए पार्सल का वजन ज्ञात कीजिए।`;
    }
    if (qlId === "AVG-QL-191") {
      return `${count} कीमतों का औसत ₹${average} था। एक अज्ञात कीमत के स्थान पर ₹${newValue} रखने से औसत ₹${newAverage} हो गया। पुरानी कीमत ज्ञात कीजिए।`;
    }
    if (qlId === "AVG-QL-195") {
      return `${count} दिनों की औसत बिक्री ₹${average} थी। ₹${oldValue} की बिक्री के स्थान पर नई बिक्री रखने से औसत ₹${newAverage} हो गया। नई बिक्री राशि ज्ञात कीजिए।`;
    }
    if (qlId === "AVG-QL-196") {
      return `${count} दर्ज मापों का औसत ${average} था। एक अज्ञात माप के स्थान पर ${newValue} दर्ज करने से औसत ${newAverage} हो गया। पुराना माप ज्ञात कीजिए।`;
    }
    if (/^AVG-QL-39[4-9]$/.test(qlId)) {
      return stem
        .replace(/जिससे औसत (\d+) अंक बढ़ जाता है/, "जिससे औसत में $1 अंकों की वृद्धि होती है")
        .replace(/जिससे औसत (\d+) रन बढ़ जाता है/, "जिससे औसत में $1 रन की वृद्धि होती है")
        .replace(/जिससे औसत (\d+) इकाइयाँ बढ़ जाता है/, "जिससे औसत उत्पादन में $1 इकाइयों की वृद्धि होती है");
    }
    if (/^AVG-QL-40[0-5]$/.test(qlId)) {
      return stem
        .replace(/जिसके बाद औसत (\d+) इकाइयाँ हो जाता है/, "जिसके बाद औसत उत्पादन $1 इकाइयाँ हो जाता है")
        .replace(/जिसके बाद औसत (\d+) अंक हो जाता है/, "जिसके बाद अंकों का औसत $1 हो जाता है")
        .replace(/जिसके बाद औसत (\d+) रन हो जाता है/, "जिसके बाद रन का औसत $1 हो जाता है");
    }
  } else {
    if (qlId === "AVG-QL-152") {
      return `${count} ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${average} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ${oldValue} ਕਿਲੋਗ੍ਰਾਮ ਦੇ ਪਾਰਸਲ ਦੀ ਥਾਂ ${newValue} ਕਿਲੋਗ੍ਰਾਮ ਦਾ ਪਾਰਸਲ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਨਵਾਂ ਔਸਤ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    }
    if (qlId === "AVG-QL-156") {
      return `${count} ਦਰਜ ਮਾਪਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ${oldValue} ਦੀ ਥਾਂ ${newValue} ਦਰਜ ਕਰਨ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    }
    if (qlId === "AVG-QL-189") {
      return `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${average} ਇਕਾਈਆਂ ਸੀ। ${oldValue} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ ਨੂੰ ਬਦਲਣ ਨਾਲ ਔਸਤ ਉਤਪਾਦਨ ${newAverage} ਇਕਾਈਆਂ ਹੋ ਗਿਆ। ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
    }
    if (qlId === "AVG-QL-190") {
      return `${count} ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${average} ਕਿਲੋਗ੍ਰਾਮ ਸੀ। ${oldValue} ਕਿਲੋਗ੍ਰਾਮ ਦੇ ਪਾਰਸਲ ਦੀ ਥਾਂ ਨਵਾਂ ਪਾਰਸਲ ਰੱਖਣ ਨਾਲ ਔਸਤ ਵਜ਼ਨ ${newAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੋ ਗਿਆ। ਨਵੇਂ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    }
    if (qlId === "AVG-QL-191") {
      return `${count} ਕੀਮਤਾਂ ਦੀ ਔਸਤ ₹${average} ਸੀ। ਇੱਕ ਅਣਜਾਣ ਕੀਮਤ ਦੀ ਥਾਂ ₹${newValue} ਰੱਖਣ ਨਾਲ ਔਸਤ ₹${newAverage} ਹੋ ਗਈ। ਪੁਰਾਣੀ ਕੀਮਤ ਪਤਾ ਕਰੋ।`;
    }
    if (qlId === "AVG-QL-195") {
      return `${count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ ₹${average} ਸੀ। ₹${oldValue} ਦੀ ਵਿਕਰੀ ਦੀ ਥਾਂ ਨਵੀਂ ਵਿਕਰੀ ਰੱਖਣ ਨਾਲ ਔਸਤ ₹${newAverage} ਹੋ ਗਈ। ਨਵੀਂ ਵਿਕਰੀ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    }
    if (qlId === "AVG-QL-196") {
      return `${count} ਦਰਜ ਮਾਪਾਂ ਦੀ ਔਸਤ ${average} ਸੀ। ਇੱਕ ਅਣਜਾਣ ਮਾਪ ਦੀ ਥਾਂ ${newValue} ਦਰਜ ਕਰਨ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਪੁਰਾਣਾ ਮਾਪ ਪਤਾ ਕਰੋ।`;
    }
    if (/^AVG-QL-39[4-9]$/.test(qlId)) {
      return stem
        .replace(/ਜਿਸ ਨਾਲ ਔਸਤ (\d+) ਅੰਕ ਵਧ ਜਾਂਦੀ ਹੈ/, "ਜਿਸ ਨਾਲ ਔਸਤ ਵਿੱਚ $1 ਅੰਕਾਂ ਦਾ ਵਾਧਾ ਹੋ ਜਾਂਦਾ ਹੈ")
        .replace(/ਜਿਸ ਨਾਲ ਔਸਤ (\d+) ਦੌੜਾਂ ਵਧ ਜਾਂਦੀ ਹੈ/, "ਜਿਸ ਨਾਲ ਔਸਤ ਵਿੱਚ $1 ਦੌੜਾਂ ਦਾ ਵਾਧਾ ਹੋ ਜਾਂਦਾ ਹੈ")
        .replace(/ਜਿਸ ਨਾਲ ਔਸਤ (\d+) ਇਕਾਈਆਂ ਵਧ ਜਾਂਦੀ ਹੈ/, "ਜਿਸ ਨਾਲ ਔਸਤ ਉਤਪਾਦਨ ਵਿੱਚ $1 ਇਕਾਈਆਂ ਦਾ ਵਾਧਾ ਹੋ ਜਾਂਦਾ ਹੈ");
    }
    if (/^AVG-QL-40[0-5]$/.test(qlId)) {
      return stem
        .replace(/ਜਿਸ ਤੋਂ ਬਾਅਦ ਔਸਤ (\d+) ਇਕਾਈਆਂ ਹੋ ਜਾਂਦੀ ਹੈ/, "ਜਿਸ ਤੋਂ ਬਾਅਦ ਔਸਤ ਉਤਪਾਦਨ $1 ਇਕਾਈਆਂ ਹੋ ਜਾਂਦਾ ਹੈ")
        .replace(/ਜਿਸ ਤੋਂ ਬਾਅਦ ਔਸਤ (\d+) ਅੰਕ ਹੋ ਜਾਂਦੀ ਹੈ/, "ਜਿਸ ਤੋਂ ਬਾਅਦ ਅੰਕਾਂ ਦੀ ਔਸਤ $1 ਹੋ ਜਾਂਦੀ ਹੈ")
        .replace(/ਜਿਸ ਤੋਂ ਬਾਅਦ ਔਸਤ (\d+) ਦੌੜਾਂ ਹੋ ਜਾਂਦੀ ਹੈ/, "ਜਿਸ ਤੋਂ ਬਾਅਦ ਦੌੜਾਂ ਦੀ ਔਸਤ $1 ਹੋ ਜਾਂਦੀ ਹੈ");
    }
  }
  return stem;
}

export function applyAvg001LocalizedStemCriticalFixes(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  let stem = applyAvg001LocalizedStemFinal(pkg, language).stem;
  if (pkg.canonicalProblemId === "AVG-CP-001") stem = cp001Fix(pkg, language, stem);
  if (pkg.canonicalProblemId === "AVG-CP-003") stem = cp003SpecificFix(pkg, language, stem);
  return stem === pkg.stem ? pkg : { ...pkg, stem };
}
