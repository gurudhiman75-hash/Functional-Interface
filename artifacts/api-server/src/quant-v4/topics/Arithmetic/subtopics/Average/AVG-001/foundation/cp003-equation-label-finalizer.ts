import type { Avg001QuestionPackage } from "./types";

type Lang = "hi" | "pa";
type Kind = "number" | "marks" | "salary" | "output" | "weight" | "sales" | "age" | "price" | "reading" | "runs";
type Form = "added" | "removed" | "old" | "new";

function kindFromStem(stem: string, lang: Lang): Kind {
  if (lang === "hi") {
    if (/वेतन/.test(stem)) return "salary";
    if (/बिक्री/.test(stem)) return "sales";
    if (/वजन|किग्रा|किलोग्राम/.test(stem)) return "weight";
    if (/कीमत/.test(stem)) return "price";
    if (/उत्पादन|मशीन/.test(stem)) return "output";
    if (/पारी|पारियों|बल्लेबाज|बल्लेबाजी|क्रिकेट|रनों|(?:^|[^\u0900-\u097F])रन(?:$|[^\u0900-\u097F])/.test(stem)) return "runs";
    if (/आयु|वर्ष|साल/.test(stem)) return "age";
    if (/अंक|परीक्षा/.test(stem)) return "marks";
    if (/माप|प्रेक्षण/.test(stem)) return "reading";
    return "number";
  }
  if (/ਤਨਖਾਹ/.test(stem)) return "salary";
  if (/ਵਿਕਰੀ/.test(stem)) return "sales";
  if (/ਵਜ਼ਨ|ਕਿਲੋਗ੍ਰਾਮ|ਕਿਗ੍ਰਾ/.test(stem)) return "weight";
  if (/ਕੀਮਤ/.test(stem)) return "price";
  if (/ਉਤਪਾਦਨ|ਮਸ਼ੀਨ/.test(stem)) return "output";
  if (/ਦੌੜ|ਪਾਰੀ|ਬੱਲੇਬਾਜ਼|ਕ੍ਰਿਕਟ/.test(stem)) return "runs";
  if (/ਉਮਰ|ਸਾਲ/.test(stem)) return "age";
  if (/ਅੰਕ|ਪ੍ਰੀਖਿਆ/.test(stem)) return "marks";
  if (/ਮਾਪ|ਪ੍ਰੇਖਣ/.test(stem)) return "reading";
  return "number";
}

function ageRole(stem: string, lang: Lang, form: Form) {
  if (lang === "hi") {
    if (/शिक्षक/.test(stem)) return form === "removed" || form === "old" ? "पुराने शिक्षक की आयु" : "नए शिक्षक की आयु";
    if (/खिलाड़ी/.test(stem)) return form === "removed" || form === "old" ? "पुराने खिलाड़ी की आयु" : "नए खिलाड़ी की आयु";
    if (/कर्मचारी|कर्मी/.test(stem)) return form === "removed" || form === "old" ? "पुराने कर्मी की आयु" : "नए कर्मी की आयु";
    if (/विद्यार्थी|छात्र/.test(stem)) return form === "removed" || form === "old" ? "पुराने विद्यार्थी की आयु" : "नए विद्यार्थी की आयु";
    if (/शिशु|बच्चा|जन्म/.test(stem)) return "नवजात शिशु की आयु";
    return form === "removed" || form === "old" ? "पुराने सदस्य की आयु" : "नए सदस्य की आयु";
  }
  if (/ਅਧਿਆਪਕ/.test(stem)) return form === "removed" || form === "old" ? "ਪੁਰਾਣੇ ਅਧਿਆਪਕ ਦੀ ਉਮਰ" : "ਨਵੇਂ ਅਧਿਆਪਕ ਦੀ ਉਮਰ";
  if (/ਖਿਡਾਰੀ/.test(stem)) return form === "removed" || form === "old" ? "ਪੁਰਾਣੇ ਖਿਡਾਰੀ ਦੀ ਉਮਰ" : "ਨਵੇਂ ਖਿਡਾਰੀ ਦੀ ਉਮਰ";
  if (/ਕਰਮਚਾਰੀ|ਕਾਮਾ/.test(stem)) return form === "removed" || form === "old" ? "ਪੁਰਾਣੇ ਕਾਮੇ ਦੀ ਉਮਰ" : "ਨਵੇਂ ਕਾਮੇ ਦੀ ਉਮਰ";
  if (/ਵਿਦਿਆਰਥੀ/.test(stem)) return form === "removed" || form === "old" ? "ਪੁਰਾਣੇ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ" : "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ";
  if (/ਬੱਚਾ|ਨਵਜਾਤ|ਜਨਮ/.test(stem)) return "ਨਵਜਾਤ ਬੱਚੇ ਦੀ ਉਮਰ";
  return form === "removed" || form === "old" ? "ਪੁਰਾਣੇ ਮੈਂਬਰ ਦੀ ਉਮਰ" : "ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਉਮਰ";
}

function label(kind: Kind, form: Form, lang: Lang, stem: string) {
  if (kind === "age") return ageRole(stem, lang, form);
  if (lang === "hi") {
    const labels: Record<Exclude<Kind, "age">, Record<Form, string>> = {
      number: { added: "जोड़ी गई संख्या", removed: "हटाई गई संख्या", old: "पुरानी संख्या", new: "नई संख्या" },
      marks: {
        added: /अगली परीक्षा/.test(stem) ? "अगली परीक्षा का स्कोर" : "नए विद्यार्थी के अंक",
        removed: /परीक्षा/.test(stem) ? "हटाई गई परीक्षा का स्कोर" : "जाने वाले विद्यार्थी के अंक",
        old: "पुराना अंक",
        new: "नया अंक",
      },
      salary: { added: "नए कर्मचारी का वेतन", removed: "जाने वाले कर्मचारी का वेतन", old: "पुराना वेतन", new: "नया वेतन" },
      output: {
        added: /मशीन/.test(stem) ? "नई मशीन का उत्पादन" : "नए कर्मी का उत्पादन",
        removed: /मशीन/.test(stem) ? "हटाई गई मशीन का उत्पादन" : "जाने वाले कर्मी का उत्पादन",
        old: "पुराना उत्पादन",
        new: "नया उत्पादन",
      },
      weight: { added: "जोड़ा गया वजन", removed: "हटाया गया वजन", old: "पुराना वजन", new: "नया वजन" },
      sales: { added: "अगले दिन की बिक्री", removed: "हटाए गए दिन की बिक्री", old: "पुरानी बिक्री", new: "नई बिक्री" },
      price: { added: "नई वस्तु की कीमत", removed: "हटाई गई वस्तु की कीमत", old: "पुरानी कीमत", new: "नई कीमत" },
      reading: { added: "जोड़ा गया माप", removed: "हटाया गया माप", old: "पुराना माप", new: "नया माप" },
      runs: { added: "अगली पारी का स्कोर", removed: "हटाई गई पारी का स्कोर", old: "पुराना स्कोर", new: "नया स्कोर" },
    };
    return labels[kind][form];
  }
  const labels: Record<Exclude<Kind, "age">, Record<Form, string>> = {
    number: { added: "ਜੋੜੀ ਸੰਖਿਆ", removed: "ਹਟਾਈ ਸੰਖਿਆ", old: "ਪੁਰਾਣੀ ਸੰਖਿਆ", new: "ਨਵੀਂ ਸੰਖਿਆ" },
    marks: {
      added: /ਅਗਲੀ ਪ੍ਰੀਖਿਆ/.test(stem) ? "ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਦਾ ਸਕੋਰ" : "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ",
      removed: /ਪ੍ਰੀਖਿਆ/.test(stem) ? "ਹਟਾਈ ਪ੍ਰੀਖਿਆ ਦਾ ਸਕੋਰ" : "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ",
      old: "ਪੁਰਾਣਾ ਅੰਕ",
      new: "ਨਵਾਂ ਅੰਕ",
    },
    salary: { added: "ਨਵੇਂ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", removed: "ਜਾਣ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", old: "ਪੁਰਾਣੀ ਤਨਖਾਹ", new: "ਨਵੀਂ ਤਨਖਾਹ" },
    output: {
      added: /ਮਸ਼ੀਨ/.test(stem) ? "ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ" : "ਨਵੇਂ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ",
      removed: /ਮਸ਼ੀਨ/.test(stem) ? "ਹਟਾਈ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ" : "ਜਾਣ ਵਾਲੇ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ",
      old: "ਪੁਰਾਣਾ ਉਤਪਾਦਨ",
      new: "ਨਵਾਂ ਉਤਪਾਦਨ",
    },
    weight: { added: "ਜੋੜਿਆ ਵਜ਼ਨ", removed: "ਹਟਾਇਆ ਵਜ਼ਨ", old: "ਪੁਰਾਣਾ ਵਜ਼ਨ", new: "ਨਵਾਂ ਵਜ਼ਨ" },
    sales: { added: "ਅਗਲੇ ਦਿਨ ਦੀ ਵਿਕਰੀ", removed: "ਹਟਾਏ ਦਿਨ ਦੀ ਵਿਕਰੀ", old: "ਪੁਰਾਣੀ ਵਿਕਰੀ", new: "ਨਵੀਂ ਵਿਕਰੀ" },
    price: { added: "ਨਵੀਂ ਵਸਤੂ ਦੀ ਕੀਮਤ", removed: "ਹਟਾਈ ਵਸਤੂ ਦੀ ਕੀਮਤ", old: "ਪੁਰਾਣੀ ਕੀਮਤ", new: "ਨਵੀਂ ਕੀਮਤ" },
    reading: { added: "ਜੋੜਿਆ ਮਾਪ", removed: "ਹਟਾਇਆ ਮਾਪ", old: "ਪੁਰਾਣਾ ਮਾਪ", new: "ਨਵਾਂ ਮਾਪ" },
    runs: { added: "ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ", removed: "ਹਟਾਈ ਪਾਰੀ ਦਾ ਸਕੋਰ", old: "ਪੁਰਾਣਾ ਸਕੋਰ", new: "ਨਵਾਂ ਸਕੋਰ" },
  };
  return labels[kind][form];
}

export function finalizeAvg001Cp003EquationLabels(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003" || (pkg.language !== "hi" && pkg.language !== "pa")) return pkg;
  const lang = pkg.language as Lang;
  const kind = kindFromStem(pkg.stem, lang);
  const lines = pkg.explanation.lines.map((line) => {
    if (!line.includes("$$")) return line;
    if (lang === "hi") {
      return line
        .replaceAll("जोड़ा गया मान", label(kind, "added", lang, pkg.stem))
        .replaceAll("हटाया गया मान", label(kind, "removed", lang, pkg.stem))
        .replaceAll("नया मान", label(kind, "new", lang, pkg.stem))
        .replaceAll("पुराना मान", label(kind, "old", lang, pkg.stem));
    }
    return line
      .replaceAll("ਜੋੜਿਆ ਮੁੱਲ", label(kind, "added", lang, pkg.stem))
      .replaceAll("ਹਟਾਇਆ ਮੁੱਲ", label(kind, "removed", lang, pkg.stem))
      .replaceAll("ਨਵਾਂ ਮੁੱਲ", label(kind, "new", lang, pkg.stem))
      .replaceAll("ਪੁਰਾਣਾ ਮੁੱਲ", label(kind, "old", lang, pkg.stem));
  });
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      cp003EquationLabelFinalizer: "AVG-CP-003 localized equation labels v1",
    },
  };
}
