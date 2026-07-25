import { avg001Cp002ContextKind } from "./localized-stem-context-fidelity";
import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

function cp001Grammar(stem: string, id: number, language: PilotLanguage) {
  if (language === "hi") {
    if (id === 34) return stem.replace(/^(\d+) एक विभाग के कर्मचारियों/, "एक विभाग के $1 कर्मचारियों");
    if (id === 45) {
      return stem.replace(
        /एक ऑनलाइन विक्रेता की (\d+) दिनों की ऑर्डरों का कुल मूल्य/,
        "एक ऑनलाइन विक्रेता को $1 दिनों में मिले ऑर्डरों का कुल मूल्य",
      );
    }
    if (id === 49) return stem.replace("वस्तुएँ बनाए", "वस्तुएँ बनाईं");
    if (id === 50) return stem.replace("प्रति विद्यार्थी औसत ", "प्रति विद्यार्थी औसत अंक ");
    return stem;
  }

  if (id === 34) return stem.replace(/^(\d+) ਇੱਕ ਵਿਭਾਗ ਦੇ ਕਰਮਚਾਰੀਆਂ/, "ਇੱਕ ਵਿਭਾਗ ਦੇ $1 ਕਰਮਚਾਰੀਆਂ");
  if (id === 45) {
    return stem.replace(
      /ਇੱਕ ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ ਦੀ (\d+) ਦਿਨਾਂ ਦੀ ਆਰਡਰਾਂ ਦੀ ਕੁੱਲ ਕੀਮਤ/,
      "ਇੱਕ ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ ਨੂੰ $1 ਦਿਨਾਂ ਵਿੱਚ ਮਿਲੇ ਆਰਡਰਾਂ ਦੀ ਕੁੱਲ ਕੀਮਤ",
    );
  }
  if (id === 49) return stem.replace("ਵਸਤਾਂ ਬਣਾਏ", "ਵਸਤਾਂ ਬਣਾਈਆਂ");
  if (id === 50) return stem.replace("ਪ੍ਰਤੀ ਵਿਦਿਆਰਥੀ ਔਸਤ ", "ਪ੍ਰਤੀ ਵਿਦਿਆਰਥੀ ਔਸਤ ਅੰਕ ");
  return stem;
}

function targetGrammar(stem: string, language: PilotLanguage) {
  if (language === "hi") {
    return stem
      .replace(/क्रम का पहला ([₹\d.,]+) इकाइयाँ/, "क्रम का पहला लक्ष्य $1 इकाइयों का")
      .replace(/इनमें पहला ([₹\d.,]+) इकाइयाँ/, "इनमें पहला लक्ष्य $1 इकाइयों का")
      .replace(/पहला ([₹\d.,]+) इकाइयाँ/, "पहला लक्ष्य $1 इकाइयों का")
      .replace(/(?:जबकि |तथा |और )?अंतिम ([₹\d.,]+) इकाइयाँ है/, (match, value) => {
        const lead = match.startsWith("जबकि") ? "जबकि " : match.startsWith("तथा") ? "तथा " : match.startsWith("और") ? "और " : "";
        return `${lead}अंतिम लक्ष्य ${value} इकाइयों का है`;
      });
  }
  return stem
    .replace(/ਕ੍ਰਮ ਦਾ ਪਹਿਲਾ ([₹\d.,]+) ਇਕਾਈਆਂ/, "ਕ੍ਰਮ ਦਾ ਪਹਿਲਾ ਟੀਚਾ $1 ਇਕਾਈਆਂ ਦਾ")
    .replace(/ਇਨ੍ਹਾਂ ਵਿੱਚ ਪਹਿਲਾ ([₹\d.,]+) ਇਕਾਈਆਂ/, "ਇਨ੍ਹਾਂ ਵਿੱਚ ਪਹਿਲਾ ਟੀਚਾ $1 ਇਕਾਈਆਂ ਦਾ")
    .replace(/ਪਹਿਲਾ ([₹\d.,]+) ਇਕਾਈਆਂ/, "ਪਹਿਲਾ ਟੀਚਾ $1 ਇਕਾਈਆਂ ਦਾ")
    .replace(/(?:ਜਦਕਿ |ਅਤੇ )?ਆਖਰੀ ([₹\d.,]+) ਇਕਾਈਆਂ ਹੈ/, (match, value) => {
      const lead = match.startsWith("ਜਦਕਿ") ? "ਜਦਕਿ " : match.startsWith("ਅਤੇ") ? "ਅਤੇ " : "";
      return `${lead}ਆਖਰੀ ਟੀਚਾ ${value} ਇਕਾਈਆਂ ਦਾ ਹੈ`;
    })
    .replace(/ਅੰਤਿਮ ([₹\d.,]+) ਇਕਾਈਆਂ ਹੈ/, "ਅੰਤਿਮ ਟੀਚਾ $1 ਇਕਾਈਆਂ ਦਾ ਹੈ");
}

function outputGrammar(stem: string, language: PilotLanguage) {
  if (language === "hi") {
    return stem
      .replace(/इनमें पहला ([₹\d.,]+) इकाइयाँ/, "पहली अवधि का उत्पादन $1 इकाइयाँ")
      .replace(/क्रम का पहला ([₹\d.,]+) इकाइयाँ/, "पहली अवधि का उत्पादन $1 इकाइयाँ")
      .replace(/पहला ([₹\d.,]+) इकाइयाँ/, "पहली अवधि का उत्पादन $1 इकाइयाँ")
      .replace(/(?:तथा |और |जबकि )?अंतिम ([₹\d.,]+) इकाइयाँ है/, (match, value) => {
        const lead = match.startsWith("तथा") ? "तथा " : match.startsWith("और") ? "और " : match.startsWith("जबकि") ? "जबकि " : "";
        return `${lead}अंतिम अवधि का उत्पादन ${value} इकाइयाँ हैं`;
      });
  }
  return stem
    .replace(/ਇਨ੍ਹਾਂ ਵਿੱਚ ਪਹਿਲਾ ([₹\d.,]+) ਇਕਾਈਆਂ/, "ਪਹਿਲੀ ਮਿਆਦ ਦਾ ਉਤਪਾਦਨ $1 ਇਕਾਈਆਂ")
    .replace(/ਕ੍ਰਮ ਦਾ ਪਹਿਲਾ ([₹\d.,]+) ਇਕਾਈਆਂ/, "ਪਹਿਲੀ ਮਿਆਦ ਦਾ ਉਤਪਾਦਨ $1 ਇਕਾਈਆਂ")
    .replace(/ਪਹਿਲਾ ([₹\d.,]+) ਇਕਾਈਆਂ/, "ਪਹਿਲੀ ਮਿਆਦ ਦਾ ਉਤਪਾਦਨ $1 ਇਕਾਈਆਂ")
    .replace(/(?:ਅਤੇ |ਜਦਕਿ )?ਆਖਰੀ ([₹\d.,]+) ਇਕਾਈਆਂ ਹੈ/, (match, value) => {
      const lead = match.startsWith("ਅਤੇ") ? "ਅਤੇ " : match.startsWith("ਜਦਕਿ") ? "ਜਦਕਿ " : "";
      return `${lead}ਆਖਰੀ ਮਿਆਦ ਦਾ ਉਤਪਾਦਨ ${value} ਇਕਾਈਆਂ ਹਨ`;
    })
    .replace(/ਅੰਤਿਮ ([₹\d.,]+) ਇਕਾਈਆਂ ਹੈ/, "ਅੰਤਿਮ ਮਿਆਦ ਦਾ ਉਤਪਾਦਨ $1 ਇਕਾਈਆਂ ਹਨ");
}

function priceGrammar(stem: string, language: PilotLanguage) {
  if (language === "hi") {
    return stem
      .replace("मध्य कीमत", "बीच की कीमत")
      .replace("सबसे छोटा कीमत", "सबसे कम कीमत")
      .replace("सबसे बड़ा कीमत", "सबसे अधिक कीमत")
      .replace(/क्रम का पहला (₹[\d.,]+)/, "क्रम की पहली कीमत $1")
      .replace(/इनमें पहला (₹[\d.,]+)/, "इनमें पहली कीमत $1")
      .replace(/पहला (₹[\d.,]+)/, "पहली कीमत $1")
      .replace(/(?:जबकि |तथा |और )?अंतिम (₹[\d.,]+) है/, (match, value) => {
        const lead = match.startsWith("जबकि") ? "जबकि " : match.startsWith("तथा") ? "तथा " : match.startsWith("और") ? "और " : "";
        return `${lead}अंतिम कीमत ${value} है`;
      });
  }
  return stem
    .replace("ਵਿਚਕਾਰਲਾ ਕੀਮਤ", "ਵਿਚਕਾਰਲੀ ਕੀਮਤ")
    .replace("ਸਭ ਤੋਂ ਛੋਟਾ ਕੀਮਤ", "ਸਭ ਤੋਂ ਘੱਟ ਕੀਮਤ")
    .replace("ਸਭ ਤੋਂ ਵੱਡਾ ਕੀਮਤ", "ਸਭ ਤੋਂ ਵੱਧ ਕੀਮਤ")
    .replace(/ਕ੍ਰਮ ਦਾ ਪਹਿਲਾ (₹[\d.,]+)/, "ਕ੍ਰਮ ਦੀ ਪਹਿਲੀ ਕੀਮਤ $1")
    .replace(/ਇਨ੍ਹਾਂ ਵਿੱਚ ਪਹਿਲਾ (₹[\d.,]+)/, "ਇਨ੍ਹਾਂ ਵਿੱਚ ਪਹਿਲੀ ਕੀਮਤ $1")
    .replace(/ਪਹਿਲਾ (₹[\d.,]+)/, "ਪਹਿਲੀ ਕੀਮਤ $1")
    .replace(/(?:ਜਦਕਿ |ਅਤੇ )?ਆਖਰੀ (₹[\d.,]+) ਹੈ/, (match, value) => {
      const lead = match.startsWith("ਜਦਕਿ") ? "ਜਦਕਿ " : match.startsWith("ਅਤੇ") ? "ਅਤੇ " : "";
      return `${lead}ਆਖਰੀ ਕੀਮਤ ${value} ਹੈ`;
    })
    .replace(/ਅੰਤਿਮ (₹[\d.,]+) ਹੈ/, "ਅੰਤਿਮ ਕੀਮਤ $1 ਹੈ");
}

function termCountGrammar(
  stem: string,
  kind: ReturnType<typeof avg001Cp002ContextKind>,
  language: PilotLanguage,
) {
  const hiNoun = kind === "score" ? "परीक्षा-अंक" : kind === "reading" ? "माप" : kind === "value" ? "मान" : "पद";
  const paNoun = kind === "score" ? "ਪ੍ਰੀਖਿਆ ਅੰਕ" : kind === "reading" ? "ਮਾਪ" : kind === "value" ? "ਮੁੱਲ" : "ਪਦ";
  if (language === "hi") {
    return stem
      .replace("ऐसे पदों की कुल संख्या", `ऐसे ${hiNoun} की कुल संख्या`)
      .replace("कुल कितने पद हैं", `कुल कितने ${hiNoun} हैं`);
  }
  return stem
    .replace("ਅਜਿਹੇ ਪਦਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ", `ਅਜਿਹੇ ${paNoun} ਦੀ ਕੁੱਲ ਗਿਣਤੀ`)
    .replace("ਕੁੱਲ ਕਿੰਨੇ ਪਦ ਹਨ", `ਕੁੱਲ ਕਿੰਨੇ ${paNoun} ਹਨ`);
}

function cp002Grammar(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const kind = avg001Cp002ContextKind(pkg.questionLanguageId);
  let stem = pkg.stem;
  if (kind === "price") stem = priceGrammar(stem, language);
  if (kind === "target") stem = targetGrammar(stem, language);
  if (kind === "output") stem = outputGrammar(stem, language);
  if (pkg.solveMode === "findTermCountFromAverageAndExtreme") {
    stem = termCountGrammar(stem, kind, language);
  }
  return stem;
}

export function applyAvg001LocalizedStemGrammarGuard(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  const id = Number(pkg.questionLanguageId.slice(-3));
  const stem = pkg.canonicalProblemId === "AVG-CP-001"
    ? cp001Grammar(pkg.stem, id, language)
    : pkg.canonicalProblemId === "AVG-CP-002"
      ? cp002Grammar(pkg, language)
      : pkg.stem;

  return {
    ...pkg,
    stem,
    traceability: {
      ...pkg.traceability,
      localizedStemGrammarGuard: "AVG-001 localized stem grammar guard v1",
    },
  };
}
