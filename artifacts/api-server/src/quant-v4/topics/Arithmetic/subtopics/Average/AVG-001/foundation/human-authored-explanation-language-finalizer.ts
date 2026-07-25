import { avg001Cp002ContextKind } from "./localized-stem-context-fidelity";
import type { Avg001QuestionPackage } from "./types";

type Language = "en" | "hi" | "pa";
type Kind = ReturnType<typeof avg001Cp002ContextKind>;

type ContextForms = {
  average: string;
  middle: string;
  smallest: string;
  largest: string;
  count: string;
};

function forms(kind: Kind, language: Exclude<Language, "en">): ContextForms {
  const hi: Record<Kind, ContextForms> = {
    integer: { average: "पूर्णांकों का औसत", middle: "मध्य पूर्णांक", smallest: "सबसे छोटा पूर्णांक", largest: "सबसे बड़ा पूर्णांक", count: "पूर्णांकों की संख्या" },
    even: { average: "सम संख्याओं का औसत", middle: "मध्य सम संख्या", smallest: "सबसे छोटी सम संख्या", largest: "सबसे बड़ी सम संख्या", count: "सम संख्याओं की संख्या" },
    odd: { average: "विषम संख्याओं का औसत", middle: "मध्य विषम संख्या", smallest: "सबसे छोटी विषम संख्या", largest: "सबसे बड़ी विषम संख्या", count: "विषम संख्याओं की संख्या" },
    seat: { average: "सीट क्रमांकों का औसत", middle: "मध्य सीट क्रमांक", smallest: "सबसे छोटा सीट क्रमांक", largest: "सबसे बड़ा सीट क्रमांक", count: "सीट क्रमांकों की संख्या" },
    house: { average: "मकान क्रमांकों का औसत", middle: "मध्य मकान क्रमांक", smallest: "सबसे छोटा मकान क्रमांक", largest: "सबसे बड़ा मकान क्रमांक", count: "मकान क्रमांकों की संख्या" },
    score: { average: "परीक्षा-अंकों का औसत", middle: "मध्य परीक्षा-अंक", smallest: "सबसे कम परीक्षा-अंक", largest: "सबसे अधिक परीक्षा-अंक", count: "परीक्षा-अंकों की संख्या" },
    target: { average: "उत्पादन लक्ष्यों का औसत", middle: "मध्य उत्पादन लक्ष्य", smallest: "सबसे छोटा उत्पादन लक्ष्य", largest: "सबसे बड़ा उत्पादन लक्ष्य", count: "उत्पादन लक्ष्यों की संख्या" },
    price: { average: "कीमतों का औसत", middle: "बीच की कीमत", smallest: "सबसे कम कीमत", largest: "सबसे अधिक कीमत", count: "कीमतों की संख्या" },
    output: { average: "उत्पादन मानों का औसत", middle: "मध्य उत्पादन मान", smallest: "सबसे छोटा उत्पादन मान", largest: "सबसे बड़ा उत्पादन मान", count: "उत्पादन मानों की संख्या" },
    merit: { average: "मेरिट अंकों का औसत", middle: "मध्य मेरिट अंक", smallest: "सबसे कम मेरिट अंक", largest: "सबसे अधिक मेरिट अंक", count: "मेरिट अंकों की संख्या" },
    roll: { average: "अनुक्रमांकों का औसत", middle: "मध्य अनुक्रमांक", smallest: "सबसे छोटा अनुक्रमांक", largest: "सबसे बड़ा अनुक्रमांक", count: "अनुक्रमांकों की संख्या" },
    batch: { average: "बैच-क्रमांकों का औसत", middle: "मध्य बैच-क्रमांक", smallest: "सबसे छोटा बैच-क्रमांक", largest: "सबसे बड़ा बैच-क्रमांक", count: "बैच-क्रमांकों की संख्या" },
    reading: { average: "मापों का औसत", middle: "मध्य माप", smallest: "सबसे छोटा माप", largest: "सबसे बड़ा माप", count: "मापों की संख्या" },
    value: { average: "मानों का औसत", middle: "मध्य मान", smallest: "सबसे छोटा मान", largest: "सबसे बड़ा मान", count: "मानों की संख्या" },
    term: { average: "पदों का औसत", middle: "मध्य पद", smallest: "सबसे छोटा पद", largest: "सबसे बड़ा पद", count: "पदों की संख्या" },
  };
  const pa: Record<Kind, ContextForms> = {
    integer: { average: "ਪੂਰਨ ਅੰਕਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਪੂਰਨ ਅੰਕ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ", count: "ਪੂਰਨ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ" },
    even: { average: "ਸਮ ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲੀ ਸਮ ਸੰਖਿਆ", smallest: "ਸਭ ਤੋਂ ਛੋਟੀ ਸਮ ਸੰਖਿਆ", largest: "ਸਭ ਤੋਂ ਵੱਡੀ ਸਮ ਸੰਖਿਆ", count: "ਸਮ ਸੰਖਿਆਵਾਂ ਦੀ ਗਿਣਤੀ" },
    odd: { average: "ਵਿਸ਼ਮ ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲੀ ਵਿਸ਼ਮ ਸੰਖਿਆ", smallest: "ਸਭ ਤੋਂ ਛੋਟੀ ਵਿਸ਼ਮ ਸੰਖਿਆ", largest: "ਸਭ ਤੋਂ ਵੱਡੀ ਵਿਸ਼ਮ ਸੰਖਿਆ", count: "ਵਿਸ਼ਮ ਸੰਖਿਆਵਾਂ ਦੀ ਗਿਣਤੀ" },
    seat: { average: "ਸੀਟ ਨੰਬਰਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਸੀਟ ਨੰਬਰ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਸੀਟ ਨੰਬਰ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਸੀਟ ਨੰਬਰ", count: "ਸੀਟ ਨੰਬਰਾਂ ਦੀ ਗਿਣਤੀ" },
    house: { average: "ਮਕਾਨ ਨੰਬਰਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਮਕਾਨ ਨੰਬਰ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਮਕਾਨ ਨੰਬਰ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਮਕਾਨ ਨੰਬਰ", count: "ਮਕਾਨ ਨੰਬਰਾਂ ਦੀ ਗਿਣਤੀ" },
    score: { average: "ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਪ੍ਰੀਖਿਆ ਅੰਕ", smallest: "ਸਭ ਤੋਂ ਘੱਟ ਪ੍ਰੀਖਿਆ ਅੰਕ", largest: "ਸਭ ਤੋਂ ਵੱਧ ਪ੍ਰੀਖਿਆ ਅੰਕ", count: "ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ" },
    target: { average: "ਉਤਪਾਦਨ ਟੀਚਿਆਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਉਤਪਾਦਨ ਟੀਚਾ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਉਤਪਾਦਨ ਟੀਚਾ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਉਤਪਾਦਨ ਟੀਚਾ", count: "ਉਤਪਾਦਨ ਟੀਚਿਆਂ ਦੀ ਗਿਣਤੀ" },
    price: { average: "ਕੀਮਤਾਂ ਦੀ ਔਸਤ", middle: "ਵਿਚਕਾਰਲੀ ਕੀਮਤ", smallest: "ਸਭ ਤੋਂ ਘੱਟ ਕੀਮਤ", largest: "ਸਭ ਤੋਂ ਵੱਧ ਕੀਮਤ", count: "ਕੀਮਤਾਂ ਦੀ ਗਿਣਤੀ" },
    output: { average: "ਉਤਪਾਦਨ ਮੁੱਲਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਉਤਪਾਦਨ ਮੁੱਲ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਉਤਪਾਦਨ ਮੁੱਲ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਉਤਪਾਦਨ ਮੁੱਲ", count: "ਉਤਪਾਦਨ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ" },
    merit: { average: "ਮੈਰਿਟ ਅੰਕਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਮੈਰਿਟ ਅੰਕ", smallest: "ਸਭ ਤੋਂ ਘੱਟ ਮੈਰਿਟ ਅੰਕ", largest: "ਸਭ ਤੋਂ ਵੱਧ ਮੈਰਿਟ ਅੰਕ", count: "ਮੈਰਿਟ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ" },
    roll: { average: "ਰੋਲ ਨੰਬਰਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਰੋਲ ਨੰਬਰ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਰੋਲ ਨੰਬਰ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਰੋਲ ਨੰਬਰ", count: "ਰੋਲ ਨੰਬਰਾਂ ਦੀ ਗਿਣਤੀ" },
    batch: { average: "ਬੈਚ ਨੰਬਰਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਬੈਚ ਨੰਬਰ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਬੈਚ ਨੰਬਰ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਬੈਚ ਨੰਬਰ", count: "ਬੈਚ ਨੰਬਰਾਂ ਦੀ ਗਿਣਤੀ" },
    reading: { average: "ਮਾਪਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਮਾਪ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਮਾਪ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਮਾਪ", count: "ਮਾਪਾਂ ਦੀ ਗਿਣਤੀ" },
    value: { average: "ਮੁੱਲਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਮੁੱਲ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ", count: "ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ" },
    term: { average: "ਪਦਾਂ ਦੀ ਔਸਤ", middle: "ਮੱਧਲਾ ਪਦ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ ਪਦ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ ਪਦ", count: "ਪਦਾਂ ਦੀ ਗਿਣਤੀ" },
  };
  return (language === "hi" ? hi : pa)[kind];
}

function cp002Conclusion(line: string, pkg: Avg001QuestionPackage, language: Exclude<Language, "en">) {
  const context = forms(avg001Cp002ContextKind(pkg.questionLanguageId), language);
  const target = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
  const smallest = /small|least|min/i.test(target);
  if (language === "hi") {
    return line
      .replace("श्रृंखला का औसत", context.average)
      .replace("आवश्यक मध्य पद", context.middle)
      .replace("मध्य पद", context.middle)
      .replace("सबसे छोटा पद", context.smallest)
      .replace("सबसे बड़ा पद", context.largest)
      .replace("पदों की संख्या", context.count)
      .replace("आवश्यक चरम पद", smallest ? context.smallest : context.largest);
  }
  return line
    .replace("ਲੜੀ ਦੀ ਔਸਤ", context.average)
    .replace("ਲੋੜੀਂਦਾ ਮੱਧਲਾ ਪਦ", context.middle)
    .replace("ਮੱਧਲਾ ਪਦ", context.middle)
    .replace("ਸਭ ਤੋਂ ਛੋਟਾ ਪਦ", context.smallest)
    .replace("ਸਭ ਤੋਂ ਵੱਡਾ ਪਦ", context.largest)
    .replace("ਪਦਾਂ ਦੀ ਗਿਣਤੀ", context.count)
    .replace("ਲੋੜੀਂਦਾ ਅੰਤਲਾ ਪਦ", smallest ? context.smallest : context.largest);
}

function polishLine(line: string, pkg: Avg001QuestionPackage, language: Language, isLast: boolean) {
  let next = line;
  if (language === "en") {
    next = next
      .replace(/\b(that|gives|obtain|shows|confirms) The\b/g, "$1 the")
      .replace(/^(Therefore|Hence|Thus|So), The\b/, "$1, the");
    if (pkg.questionLanguageId === "AVG-QL-045" && isLast) {
      next = next.replace("average sale per day", "average daily order value");
    }
    return next;
  }

  if (language === "hi") {
    next = next
      .replace("पुराने औसत माप से मापों का कुल में बदलें", "पुराने औसत माप से मापों का कुल निकालें")
      .replace("पुराने औसत अंक से कुल अंक निकालें, जाने वाला परीक्षा-अंक", "पुराने औसत अंकों से कुल अंक निकालें, हटाया गया परीक्षा-अंक")
      .replace("पुराने औसत वजन से", "पुराने औसत वजन से")
      .replace("औसत दैनिक बिक्री", pkg.questionLanguageId === "AVG-QL-045" ? "औसत दैनिक ऑर्डर-मूल्य" : "औसत दैनिक बिक्री");
    if (isLast && pkg.canonicalProblemId === "AVG-CP-002") next = cp002Conclusion(next, pkg, language);
    return next;
  }

  next = next
    .replace("ਪੁਰਾਣੀ ਔਸਤ ਮਾਪ ਤੋਂ ਮਾਪਾਂ ਦਾ ਕੁੱਲ ਵਿੱਚ ਬਦਲੋ", "ਪੁਰਾਣੇ ਔਸਤ ਮਾਪ ਤੋਂ ਮਾਪਾਂ ਦਾ ਕੁੱਲ ਕੱਢੋ")
    .replace("ਪੁਰਾਣੀ ਔਸਤ ਅੰਕ ਤੋਂ ਕੁੱਲ ਅੰਕ ਕੱਢੋ, ਜਾਣ ਵਾਲਾ ਪ੍ਰੀਖਿਆ ਅੰਕ", "ਪੁਰਾਣੇ ਔਸਤ ਅੰਕਾਂ ਤੋਂ ਕੁੱਲ ਅੰਕ ਕੱਢੋ, ਹਟਾਇਆ ਪ੍ਰੀਖਿਆ ਅੰਕ")
    .replace("ਪੁਰਾਣੀ ਔਸਤ ਵਜ਼ਨ ਤੋਂ", "ਪੁਰਾਣੇ ਔਸਤ ਵਜ਼ਨ ਤੋਂ")
    .replace("ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", pkg.questionLanguageId === "AVG-QL-045" ? "ਔਸਤ ਰੋਜ਼ਾਨਾ ਆਰਡਰ-ਮੁੱਲ" : "ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ");
  if (isLast && pkg.canonicalProblemId === "AVG-CP-002") next = cp002Conclusion(next, pkg, language);
  return next;
}

export function finalizeAvg001ExplanationLanguage(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const language: Language = pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
  const lastIndex = pkg.explanation.lines.length - 1;
  const lines = pkg.explanation.lines.map((line, index) =>
    polishLine(line, pkg, language, index === lastIndex),
  );
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationLanguageFinalizer: "AVG-001 final explanation language polish v1",
    },
  };
}
