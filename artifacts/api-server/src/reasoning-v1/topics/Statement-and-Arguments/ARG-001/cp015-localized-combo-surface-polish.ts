import { createHash } from "node:crypto";

export const ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY = "ARG_CP015_LOCALIZED_COMBO_SURFACE_POLISH_V1" as const;

type Question = Readonly<Record<string, any>>;

const ROMAN = ["I", "II", "III", "IV"] as const;

function polishHindi(value: string): string {
  return value
    .replaceAll("शाम के व्यस्त समय के समय", "शाम के व्यस्त समय में")
    .replaceAll("स्कूल छुट्टी के समय के दौरान", "स्कूल छुट्टी के दौरान")
    .replaceAll("भुगतान खाता में", "भुगतान खाते में")
    .replaceAll("मानक प्रमाणपत्र सेवाओं लेने", "मानक प्रमाणपत्र सेवाएँ लेने")
    .replaceAll("नियमित दस्तावेज सेवाओं लेने", "नियमित दस्तावेज सेवाएँ लेने")
    .replaceAll("पंजीकरण सेवाओं लेने", "पंजीकरण सेवाएँ लेने")
    .replaceAll("शुल्क भुगतान सेवाओं लेने", "शुल्क भुगतान सेवाएँ लेने")
    .replaceAll("वेबकैम गतिविधि की निगरानी निगरानी", "वेबकैम गतिविधि की निगरानी")
    .replaceAll("एक खरीदार शिकायत", "खरीदार की एक शिकायत")
    .replaceAll("एक नकल शिकायत", "नकल की एक शिकायत")
    .replaceAll("एक कदाचार आरोप", "कदाचार का एक आरोप")
    .replaceAll("स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("यदि मॉडल उत्तर बिंदु बदल सकता है", "यदि मॉडल उत्तर बिंदु बदल सकते हैं")
    .replaceAll("यदि मूल्यांकन मानदंड बदल सकता है", "यदि मूल्यांकन मानदंड बदल सकते हैं")
    .replace(/(यदि (?:मॉडल उत्तर बिंदु|मूल्यांकन मानदंड) बदल सकते हैं, तो [^.]+? को )इसे( अद्यतन रखना होगा)/g, "$1इन्हें$2");
}

function polishPunjabi(value: string): string {
  return value
    .replaceAll("ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਦੀ ਨਿਗਰਾਨੀ ਨਿਗਰਾਨੀ", "ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਦੀ ਨਿਗਰਾਨੀ")
    .replaceAll("ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਨਿਗਰਾਨੀ", "ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ")
    .replaceAll("ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ ਨਿਗਰਾਨੀ", "ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ")
    .replaceAll("ਇੱਕ ਖਰੀਦਦਾਰ ਸ਼ਿਕਾਇਤ", "ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਸ਼ਿਕਾਇਤ")
    .replaceAll("ਇੱਕ ਨਕਲ ਦੀ ਸ਼ਿਕਾਇਤ", "ਨਕਲ ਦੀ ਇੱਕ ਸ਼ਿਕਾਇਤ")
    .replaceAll("ਇੱਕ ਗਲਤ ਵਿਹਾਰ ਦਾ ਦੋਸ਼", "ਗਲਤ ਵਿਹਾਰ ਦੇ ਇੱਕ ਦੋਸ਼")
    .replaceAll("ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਜੇ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਬਦਲ ਸਕਦਾ ਹੈ", "ਜੇ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਬਦਲ ਸਕਦੇ ਹਨ")
    .replaceAll("ਜੇ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਬਦਲ ਸਕਦਾ ਹੈ", "ਜੇ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਬਦਲ ਸਕਦੇ ਹਨ")
    .replace(/(ਜੇ (?:ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ|ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ) ਬਦਲ ਸਕਦੇ ਹਨ, ਤਾਂ [^.]+? ਨੂੰ )ਇਸ ਨੂੰ( ਅੱਪਡੇਟ ਰੱਖਣਾ ਹੋਵੇਗਾ)/g, "$1ਇਨ੍ਹਾਂ ਨੂੰ$2");
}

function rebuildStem(locale: string, statement: string, argumentsList: readonly string[]): string {
  const statementLabel = locale === "hi-IN" ? "कथन" : "ਕਥਨ";
  const argumentsLabel = locale === "hi-IN" ? "तर्क" : "ਦਲੀਲਾਂ";
  return `${statementLabel}: ${statement}\n${argumentsLabel}:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
}

export function polishArgCp015LocalizedComboSurface(question: Question): Question {
  const locale = String(question.locale ?? "");
  if (locale !== "hi-IN" && locale !== "pa-IN") return question;
  if (!question.localizedComboEditorialAuthority) return question;

  const polish = locale === "hi-IN" ? polishHindi : polishPunjabi;
  const sourceStatement = String(question.statement ?? "");
  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  const sourceExplanation = String(question.explanation ?? "");
  let statement = polish(sourceStatement);
  const argumentsList = Object.freeze(sourceArguments.map((argument) => polish(argument)));
  let explanation = polish(sourceExplanation);

  const sourceForPlural = String(question.sourceStatement ?? sourceStatement);
  if (locale === "hi-IN" && /मॉडल उत्तर बिंदु|मूल्यांकन मानदंड/.test(sourceForPlural)) {
    explanation = explanation.replaceAll("द्वारा इसे अद्यतन रखना", "द्वारा इन्हें अद्यतन रखना");
  }
  if (locale === "pa-IN" && /ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ|ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ/.test(sourceForPlural)) {
    explanation = explanation.replaceAll("ਵੱਲੋਂ ਇਸ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖਣਾ", "ਵੱਲੋਂ ਇਨ੍ਹਾਂ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖਣਾ");
  }

  // Avoid awkward noun + postposition forms in QL006 statements by using a
  // clause when a complaint/allegation noun phrase is the trigger.
  if (String(question.qlId) === "ARG-QL-006") {
    if (locale === "hi-IN") {
      statement = statement
        .replace(/^क्या (.+) के बाद (.+) द्वारा तत्काल स्थायी दंड उचित है\?$/, "क्या $1 मिलने के बाद $2 द्वारा तत्काल स्थायी दंड उचित है?")
        .replace(/^क्या (.+) के तुरंत बाद (.+) द्वारा स्थायी दंड लगाना उचित है\?$/, "क्या $1 मिलने के तुरंत बाद $2 द्वारा स्थायी दंड लगाना उचित है?");
    } else {
      statement = statement
        .replace(/^ਕੀ (.+) ਤੋਂ ਬਾਅਦ (.+) ਵੱਲੋਂ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਵਾਜਬ ਹੈ\?$/, "ਕੀ $1 ਮਿਲਣ ਤੋਂ ਬਾਅਦ $2 ਵੱਲੋਂ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਵਾਜਬ ਹੈ?")
        .replace(/^ਕੀ (.+) ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ (.+) ਵੱਲੋਂ ਸਥਾਈ ਸਜ਼ਾ ਲਗਾਉਣਾ ਵਾਜਬ ਹੈ\?$/, "ਕੀ $1 ਮਿਲਣ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ $2 ਵੱਲੋਂ ਸਥਾਈ ਸਜ਼ਾ ਲਗਾਉਣਾ ਵਾਜਬ ਹੈ?");
    }
  }

  if (statement === sourceStatement && explanation === sourceExplanation && argumentsList.every((value, index) => value === sourceArguments[index])) {
    return Object.freeze({
      ...question,
      localizedComboPolishAuthority: ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY,
    });
  }

  const stem = rebuildStem(locale, statement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY,
    question.localizedComboEditorialAuthority,
    question.qlId,
    question.examProfile,
    locale,
    statement,
    argumentsList,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement,
    arguments: argumentsList,
    explanation,
    stem,
    text: stem,
    prePolishStatement: sourceStatement,
    prePolishExplanation: sourceExplanation,
    localizedComboPolishAuthority: ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY,
    questionId: `ARG-001:${question.qlId}:${question.examProfile}:${locale}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
  });
}
