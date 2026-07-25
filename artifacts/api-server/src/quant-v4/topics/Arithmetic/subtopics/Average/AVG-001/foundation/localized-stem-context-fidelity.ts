import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";
type ContextKind =
  | "integer"
  | "even"
  | "odd"
  | "seat"
  | "house"
  | "score"
  | "target"
  | "price"
  | "output"
  | "merit"
  | "roll"
  | "batch"
  | "reading"
  | "value"
  | "term";

type ContextWords = {
  series: string;
  singular: string;
  countNoun: string;
};

export const AVG_001_LOCALIZED_STEM_CONTEXT_FIDELITY =
  "AVG-001 localized stem context fidelity v1";

function shown(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") return String(rendered);
  const raw = pkg.parameters.values[key];
  if (typeof raw === "string" || typeof raw === "number") return String(raw);
  if (raw && typeof raw === "object" && "numerator" in raw && "denominator" in raw) {
    const numerator = Number(raw.numerator);
    const denominator = Number(raw.denominator);
    if (denominator === 1) return String(numerator);
    const decimal = numerator / denominator;
    return Number.isInteger(decimal * 10) ? decimal.toFixed(1) : `${numerator}/${denominator}`;
  }
  return "";
}

function money(value: string) {
  return value.startsWith("₹") ? value : `₹${value}`;
}

function idNumber(pkg: Avg001QuestionPackage) {
  return Number(pkg.questionLanguageId.slice(-3));
}

function inIds(id: number, ids: readonly number[]) {
  return ids.includes(id);
}

export function avg001Cp002ContextKind(questionLanguageId: string): ContextKind {
  const id = Number(questionLanguageId.slice(-3));
  if (inIds(id, [73, 76, 86, 87, 99, 100, 107, 108])) return "integer";
  if (inIds(id, [88, 101, 111, 113, 116, 121])) return "even";
  if (inIds(id, [89, 102, 112, 114, 117, 120])) return "odd";
  if (inIds(id, [74, 90, 103, 115])) return "seat";
  if (inIds(id, [75, 91, 118])) return "house";
  if (inIds(id, [80, 93, 110, 383, 389])) return "score";
  if (inIds(id, [78, 81, 92, 95, 104, 109])) return "target";
  if (inIds(id, [83, 97, 106])) return "price";
  if (id === 85) return "output";
  if (id === 98) return "merit";
  if (id === 119) return "roll";
  if (id === 122) return "batch";
  if (inIds(id, [384, 390])) return "reading";
  if (inIds(id, [386, 387, 392, 393])) return "value";
  return "term";
}

export function avg001LocalizedContextTokens(
  questionLanguageId: string,
  language: PilotLanguage,
): readonly string[] {
  const id = Number(questionLanguageId.slice(-3));
  if (inIds(id, [31])) return language === "hi" ? ["कोचिंग बैच"] : ["ਕੋਚਿੰਗ ਬੈਚ"];
  if (inIds(id, [32])) return language === "hi" ? ["मुद्रण प्रेस"] : ["ਛਪਾਈ ਪ੍ਰੈੱਸ"];
  if (inIds(id, [33, 45])) return language === "hi" ? ["ऑनलाइन"] : ["ਆਨਲਾਈਨ"];
  if (id === 34) return language === "hi" ? ["विभाग"] : ["ਵਿਭਾਗ"];
  if (inIds(id, [35, 59])) return language === "hi" ? ["फेरी"] : ["ਫੈਰੀ"];
  if (inIds(id, [36, 54, 64])) return language === "hi" ? ["परिवार"] : ["ਪਰਿਵਾਰ"];
  if (id === 39) return language === "hi" ? ["कियोस्क"] : ["ਕਿਓਸਕ"];
  if (id === 44) return language === "hi" ? ["असेंबली लाइन"] : ["ਅਸੈਂਬਲੀ ਲਾਈਨ"];
  if (inIds(id, [46, 60])) return language === "hi" ? ["छात्रावास"] : ["ਹੋਸਟਲ"];
  if (inIds(id, [47, 71])) return language === "hi" ? ["साइकिल चालक"] : ["ਸਾਈਕਲ ਸਵਾਰ"];
  if (id === 49) return language === "hi" ? ["उत्पादन इकाई"] : ["ਉਤਪਾਦਨ ਇਕਾਈ"];
  if (id === 53) return language === "hi" ? ["शटल"] : ["ਸ਼ਟਲ"];
  if (id === 65) return language === "hi" ? ["वाहन"] : ["ਵਾਹਨ"];
  if (id < 73 || (id > 122 && id < 382) || id > 393) return [];

  const kind = avg001Cp002ContextKind(questionLanguageId);
  const hi: Record<ContextKind, readonly string[]> = {
    integer: ["पूर्णांक"],
    even: ["सम संख्या"],
    odd: ["विषम संख्या"],
    seat: ["सीट क्रमांक"],
    house: ["मकान क्रमांक"],
    score: ["परीक्षा-अंक"],
    target: ["उत्पादन लक्ष्य"],
    price: ["कीमत"],
    output: ["उत्पादन मान"],
    merit: ["मेरिट अंक"],
    roll: ["अनुक्रमांक"],
    batch: ["बैच-क्रमांक"],
    reading: ["माप"],
    value: ["मान"],
    term: ["पद"],
  };
  const pa: Record<ContextKind, readonly string[]> = {
    integer: ["ਪੂਰਨ ਅੰਕ"],
    even: ["ਸਮ ਸੰਖਿਆ"],
    odd: ["ਵਿਸ਼ਮ ਸੰਖਿਆ"],
    seat: ["ਸੀਟ ਨੰਬਰ"],
    house: ["ਮਕਾਨ ਨੰਬਰ"],
    score: ["ਪ੍ਰੀਖਿਆ ਅੰਕ"],
    target: ["ਉਤਪਾਦਨ ਟੀਚ"],
    price: ["ਕੀਮਤ"],
    output: ["ਉਤਪਾਦਨ ਮੁੱਲ"],
    merit: ["ਮੈਰਿਟ ਅੰਕ"],
    roll: ["ਰੋਲ ਨੰਬਰ"],
    batch: ["ਬੈਚ ਨੰਬਰ"],
    reading: ["ਮਾਪ"],
    value: ["ਮੁੱਲ"],
    term: ["ਪਦ"],
  };
  return (language === "hi" ? hi : pa)[kind];
}

function cp001ContextPolish(
  stem: string,
  questionLanguageId: string,
  language: PilotLanguage,
) {
  const id = Number(questionLanguageId.slice(-3));
  if (language === "hi") {
    switch (id) {
      case 26:
        return stem.replace("एक उत्पादन इकाई", "एक पैकेजिंग इकाई").replaceAll("इकाइयाँ", "डिब्बे");
      case 27:
        return stem.replace("एक विक्रय केंद्र पर", "एक खुदरा काउंटर पर");
      case 30:
        return stem.replace("एक छात्रावास", "एक छात्रावास भोजन पर");
      case 31:
        return stem.replace("एक परीक्षा में", "एक कोचिंग बैच में");
      case 32:
        return stem.replace("एक उत्पादन इकाई", "एक मुद्रण प्रेस");
      case 33:
        return stem
          .replace("एक विक्रय केंद्र पर", "एक ऑनलाइन स्टोर में")
          .replace("की बिक्री होती है", "के ऑर्डर मिलते हैं")
          .replace("कुल बिक्री", "ऑर्डरों का कुल मूल्य");
      case 34:
        return stem.replace(/संविदा कर्मचारियों/, "एक विभाग के कर्मचारियों");
      case 35:
        return stem.replace("एक शटल", "एक फेरी नाव");
      case 36:
        return stem.replace("एक छात्रावास", "एक परिवार");
      case 39:
        return stem.replace("एक विक्रय केंद्र", "एक कियोस्क");
      case 40:
        return stem.replace("एक परिवार ने", "एक परिवार ने यात्रा पर");
      case 44:
        return stem.replace("एक मशीन ने", "एक असेंबली लाइन ने").replace("पुर्जे बनाए", "इकाइयाँ तैयार कीं");
      case 45:
        return stem
          .replace("एक विक्रय केंद्र", "एक ऑनलाइन विक्रेता")
          .replace("कुल बिक्री", "ऑर्डरों का कुल मूल्य")
          .replace("प्रतिदिन का औसत", "औसत दैनिक ऑर्डर-मूल्य");
      case 46:
        return stem.replace("एक परिवार ने", "एक छात्रावास ने सामग्री पर");
      case 47:
        return stem.replace("एक वाहन ने", "एक साइकिल चालक ने");
      case 49:
        return stem.replace("एक कार्यशाला", "एक उत्पादन इकाई").replaceAll("पुर्जे", "वस्तुएँ");
      case 50:
        return stem.replace("एक बैच का कुल स्कोर", "एक कक्षा के कुल अंक").replace("बैच में", "कक्षा में");
      case 53:
        return stem.replace("एक फेरी नाव", "एक शटल");
      case 54:
        return stem.replace("एक छात्रावास के पास", "एक परिवार ने कुल").replace("राशि कितने दिन चलेगी", "यह खर्च कितने दिनों का है");
      case 64:
        return stem.replace("एक छात्रावास", "एक परिवार");
      case 65:
        return stem.replace("एक साइकिल चालक", "एक वाहन");
      default:
        return stem;
    }
  }

  switch (id) {
    case 26:
      return stem.replace("ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ", "ਇੱਕ ਪੈਕੇਜਿੰਗ ਇਕਾਈ").replaceAll("ਇਕਾਈਆਂ", "ਡੱਬੇ");
    case 27:
      return stem.replace("ਇੱਕ ਵਿਕਰੀ ਕੇਂਦਰ ਉੱਤੇ", "ਇੱਕ ਖੁਦਰਾ ਕਾਊਂਟਰ ਉੱਤੇ");
    case 30:
      return stem.replace("ਇੱਕ ਹੋਸਟਲ", "ਇੱਕ ਹੋਸਟਲ ਭੋਜਨ ਉੱਤੇ");
    case 31:
      return stem.replace("ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ", "ਇੱਕ ਕੋਚਿੰਗ ਬੈਚ ਵਿੱਚ");
    case 32:
      return stem.replace("ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ", "ਇੱਕ ਛਪਾਈ ਪ੍ਰੈੱਸ");
    case 33:
      return stem
        .replace("ਇੱਕ ਵਿਕਰੀ ਕੇਂਦਰ ਉੱਤੇ", "ਇੱਕ ਆਨਲਾਈਨ ਸਟੋਰ ਵਿੱਚ")
        .replace("ਦੀ ਵਿਕਰੀ ਹੁੰਦੀ ਹੈ", "ਦੇ ਆਰਡਰ ਮਿਲਦੇ ਹਨ")
        .replace("ਕੁੱਲ ਵਿਕਰੀ", "ਆਰਡਰਾਂ ਦੀ ਕੁੱਲ ਕੀਮਤ");
    case 34:
      return stem.replace(/ਠੇਕੇ ਦੇ ਕਰਮਚਾਰੀਆਂ/, "ਇੱਕ ਵਿਭਾਗ ਦੇ ਕਰਮਚਾਰੀਆਂ");
    case 35:
      return stem.replace("ਇੱਕ ਸ਼ਟਲ", "ਇੱਕ ਫੈਰੀ ਕਿਸ਼ਤੀ");
    case 36:
      return stem.replace("ਇੱਕ ਹੋਸਟਲ", "ਇੱਕ ਪਰਿਵਾਰ");
    case 39:
      return stem.replace("ਇੱਕ ਵਿਕਰੀ ਕੇਂਦਰ", "ਇੱਕ ਕਿਓਸਕ");
    case 40:
      return stem.replace("ਇੱਕ ਪਰਿਵਾਰ ਨੇ", "ਇੱਕ ਪਰਿਵਾਰ ਨੇ ਯਾਤਰਾ ਉੱਤੇ");
    case 44:
      return stem.replace("ਇੱਕ ਮਸ਼ੀਨ ਨੇ", "ਇੱਕ ਅਸੈਂਬਲੀ ਲਾਈਨ ਨੇ").replace("ਪੁਰਜ਼ੇ ਬਣਾਏ", "ਇਕਾਈਆਂ ਤਿਆਰ ਕੀਤੀਆਂ");
    case 45:
      return stem
        .replace("ਇੱਕ ਵਿਕਰੀ ਕੇਂਦਰ", "ਇੱਕ ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ")
        .replace("ਕੁੱਲ ਵਿਕਰੀ", "ਆਰਡਰਾਂ ਦੀ ਕੁੱਲ ਕੀਮਤ")
        .replace("ਪ੍ਰਤੀ ਦਿਨ ਔਸਤ", "ਔਸਤ ਰੋਜ਼ਾਨਾ ਆਰਡਰ-ਮੁੱਲ");
    case 46:
      return stem.replace("ਇੱਕ ਪਰਿਵਾਰ ਨੇ", "ਇੱਕ ਹੋਸਟਲ ਨੇ ਸਮੱਗਰੀ ਉੱਤੇ");
    case 47:
      return stem.replace("ਇੱਕ ਵਾਹਨ ਨੇ", "ਇੱਕ ਸਾਈਕਲ ਸਵਾਰ ਨੇ");
    case 49:
      return stem.replace("ਇੱਕ ਵਰਕਸ਼ਾਪ", "ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ").replaceAll("ਪੁਰਜ਼ੇ", "ਵਸਤਾਂ");
    case 50:
      return stem.replace("ਇੱਕ ਬੈਚ ਦਾ ਕੁੱਲ ਸਕੋਰ", "ਇੱਕ ਜਮਾਤ ਦੇ ਕੁੱਲ ਅੰਕ").replace("ਬੈਚ ਵਿੱਚ", "ਜਮਾਤ ਵਿੱਚ");
    case 53:
      return stem.replace("ਇੱਕ ਫੈਰੀ ਕਿਸ਼ਤੀ", "ਇੱਕ ਸ਼ਟਲ");
    case 54:
      return stem.replace("ਇੱਕ ਹੋਸਟਲ ਕੋਲ", "ਇੱਕ ਪਰਿਵਾਰ ਨੇ ਕੁੱਲ").replace("ਰਕਮ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗੀ", "ਇਹ ਖਰਚ ਕਿੰਨੇ ਦਿਨਾਂ ਦਾ ਹੈ");
    case 64:
      return stem.replace("ਇੱਕ ਹੋਸਟਲ", "ਇੱਕ ਪਰਿਵਾਰ");
    case 65:
      return stem.replace("ਇੱਕ ਸਾਈਕਲ ਸਵਾਰ", "ਇੱਕ ਵਾਹਨ");
    case 66:
    case 72:
      return stem.replaceAll("ਮੁੱਲਾਂ", "ਪ੍ਰੇਖਣਾਂ").replaceAll("ਮੁੱਲ", "ਪ੍ਰੇਖਣ");
    default:
      return stem;
  }
}

function words(kind: ContextKind, language: PilotLanguage): ContextWords {
  const hi: Record<ContextKind, ContextWords> = {
    integer: { series: "क्रमागत पूर्णांक", singular: "पूर्णांक", countNoun: "पूर्णांक" },
    even: { series: "क्रमागत सम संख्याएँ", singular: "सम संख्या", countNoun: "सम संख्याएँ" },
    odd: { series: "क्रमागत विषम संख्याएँ", singular: "विषम संख्या", countNoun: "विषम संख्याएँ" },
    seat: { series: "समान अंतर वाले सीट क्रमांक", singular: "सीट क्रमांक", countNoun: "सीट क्रमांक" },
    house: { series: "समान अंतर वाले मकान क्रमांक", singular: "मकान क्रमांक", countNoun: "मकान क्रमांक" },
    score: { series: "समान अंतर वाले परीक्षा-अंक", singular: "परीक्षा-अंक", countNoun: "परीक्षा-अंक" },
    target: { series: "समान अंतर वाले उत्पादन लक्ष्य", singular: "उत्पादन लक्ष्य", countNoun: "उत्पादन लक्ष्य" },
    price: { series: "समान अंतर वाली कीमतें", singular: "कीमत", countNoun: "कीमतें" },
    output: { series: "समान अंतर वाले उत्पादन मान", singular: "उत्पादन मान", countNoun: "उत्पादन मान" },
    merit: { series: "समान अंतर वाले मेरिट अंक", singular: "मेरिट अंक", countNoun: "मेरिट अंक" },
    roll: { series: "क्रमागत सम अनुक्रमांक", singular: "अनुक्रमांक", countNoun: "अनुक्रमांक" },
    batch: { series: "क्रमागत सम बैच-क्रमांक", singular: "बैच-क्रमांक", countNoun: "बैच-क्रमांक" },
    reading: { series: "समान अंतर वाले माप", singular: "माप", countNoun: "माप" },
    value: { series: "समान अंतर वाले मान", singular: "मान", countNoun: "मान" },
    term: { series: "समान अंतर वाले पद", singular: "पद", countNoun: "पद" },
  };
  const pa: Record<ContextKind, ContextWords> = {
    integer: { series: "ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕ", singular: "ਪੂਰਨ ਅੰਕ", countNoun: "ਪੂਰਨ ਅੰਕ" },
    even: { series: "ਲਗਾਤਾਰ ਸਮ ਸੰਖਿਆਵਾਂ", singular: "ਸਮ ਸੰਖਿਆ", countNoun: "ਸਮ ਸੰਖਿਆਵਾਂ" },
    odd: { series: "ਲਗਾਤਾਰ ਵਿਸ਼ਮ ਸੰਖਿਆਵਾਂ", singular: "ਵਿਸ਼ਮ ਸੰਖਿਆ", countNoun: "ਵਿਸ਼ਮ ਸੰਖਿਆਵਾਂ" },
    seat: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਸੀਟ ਨੰਬਰ", singular: "ਸੀਟ ਨੰਬਰ", countNoun: "ਸੀਟ ਨੰਬਰ" },
    house: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਮਕਾਨ ਨੰਬਰ", singular: "ਮਕਾਨ ਨੰਬਰ", countNoun: "ਮਕਾਨ ਨੰਬਰ" },
    score: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਪ੍ਰੀਖਿਆ ਅੰਕ", singular: "ਪ੍ਰੀਖਿਆ ਅੰਕ", countNoun: "ਪ੍ਰੀਖਿਆ ਅੰਕ" },
    target: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਉਤਪਾਦਨ ਟੀਚੇ", singular: "ਉਤਪਾਦਨ ਟੀਚਾ", countNoun: "ਉਤਪਾਦਨ ਟੀਚੇ" },
    price: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀਆਂ ਕੀਮਤਾਂ", singular: "ਕੀਮਤ", countNoun: "ਕੀਮਤਾਂ" },
    output: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਉਤਪਾਦਨ ਮੁੱਲ", singular: "ਉਤਪਾਦਨ ਮੁੱਲ", countNoun: "ਉਤਪਾਦਨ ਮੁੱਲ" },
    merit: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਮੈਰਿਟ ਅੰਕ", singular: "ਮੈਰਿਟ ਅੰਕ", countNoun: "ਮੈਰਿਟ ਅੰਕ" },
    roll: { series: "ਲਗਾਤਾਰ ਸਮ ਰੋਲ ਨੰਬਰ", singular: "ਰੋਲ ਨੰਬਰ", countNoun: "ਰੋਲ ਨੰਬਰ" },
    batch: { series: "ਲਗਾਤਾਰ ਸਮ ਬੈਚ ਨੰਬਰ", singular: "ਬੈਚ ਨੰਬਰ", countNoun: "ਬੈਚ ਨੰਬਰ" },
    reading: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਮਾਪ", singular: "ਮਾਪ", countNoun: "ਮਾਪ" },
    value: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਮੁੱਲ", singular: "ਮੁੱਲ", countNoun: "ਮੁੱਲ" },
    term: { series: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਪਦ", singular: "ਪਦ", countNoun: "ਪਦ" },
  };
  return (language === "hi" ? hi : pa)[kind];
}

function formatted(kind: ContextKind, value: string, language: PilotLanguage) {
  if (kind === "price") return money(value);
  if (kind === "target" || kind === "output") {
    return language === "hi" ? `${value} इकाइयाँ` : `${value} ਇਕਾਈਆਂ`;
  }
  return value;
}

function cp002ContextStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const kind = avg001Cp002ContextKind(pkg.questionLanguageId);
  const w = words(kind, language);
  const count = shown(pkg, "count");
  const first = formatted(kind, shown(pkg, "firstTerm"), language);
  const last = formatted(kind, shown(pkg, "lastTerm"), language);
  const average = formatted(kind, shown(pkg, "average"), language);
  const difference = formatted(kind, shown(pkg, "commonDifference"), language);
  const targetRaw = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
  const smallest = /small|least|min/i.test(targetRaw);
  const extreme = formatted(kind, shown(pkg, "extremeValue") || (smallest ? shown(pkg, "firstTerm") : shown(pkg, "lastTerm")), language);

  if (language === "hi") {
    if (pkg.solveMode === "findAverageOfConsecutiveSet" || pkg.solveMode === "findAverageOfOddOrEvenSet") {
      return `${count} ${w.series} हैं; पहला ${first} और अंतिम ${last} है। उनका औसत ज्ञात कीजिए।`;
    }
    if (pkg.solveMode === "findMiddleTermFromAverage") {
      return `${count} ${w.series} हैं और इस क्रम का औसत ${average} है। मध्य ${w.singular} ज्ञात कीजिए।`;
    }
    if (pkg.solveMode === "findExtremeFromAverageAndCount") {
      const target = smallest ? `सबसे छोटा ${w.singular}` : `सबसे बड़ा ${w.singular}`;
      return `${count} ${w.series} हैं। उनका औसत ${average} और समान अंतर ${difference} है। ${target} ज्ञात कीजिए।`;
    }
    if (pkg.solveMode === "findTermCountFromAverageAndExtreme") {
      const target = smallest ? `सबसे छोटा ${w.singular}` : `सबसे बड़ा ${w.singular}`;
      return `कुछ ${w.countNoun} समान अंतर पर हैं। उनका औसत ${average}, ${target} ${extreme} और समान अंतर ${difference} है। उनकी कुल संख्या ज्ञात कीजिए।`;
    }
    if (pkg.solveMode === "findCommonDifferenceFromAverageCountAndExtreme") {
      const target = smallest ? `सबसे छोटा ${w.singular}` : `सबसे बड़ा ${w.singular}`;
      return `${count} ${w.countNoun} समान अंतर पर हैं। उनका औसत ${average} और ${target} ${extreme} है। समान अंतर ज्ञात कीजिए।`;
    }
    return pkg.stem;
  }

  if (pkg.solveMode === "findAverageOfConsecutiveSet" || pkg.solveMode === "findAverageOfOddOrEvenSet") {
    return `${count} ${w.series} ਹਨ; ਪਹਿਲਾ ${first} ਅਤੇ ਆਖਰੀ ${last} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findMiddleTermFromAverage") {
    return `${count} ${w.series} ਹਨ ਅਤੇ ਇਸ ਕ੍ਰਮ ਦੀ ਔਸਤ ${average} ਹੈ। ਵਿਚਕਾਰਲਾ ${w.singular} ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findExtremeFromAverageAndCount") {
    const target = smallest ? `ਸਭ ਤੋਂ ਛੋਟਾ ${w.singular}` : `ਸਭ ਤੋਂ ਵੱਡਾ ${w.singular}`;
    return `${count} ${w.series} ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ${average} ਅਤੇ ਬਰਾਬਰ ਅੰਤਰ ${difference} ਹੈ। ${target} ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findTermCountFromAverageAndExtreme") {
    const target = smallest ? `ਸਭ ਤੋਂ ਛੋਟਾ ${w.singular}` : `ਸਭ ਤੋਂ ਵੱਡਾ ${w.singular}`;
    return `ਕੁਝ ${w.countNoun} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ${average}, ${target} ${extreme} ਅਤੇ ਬਰਾਬਰ ਅੰਤਰ ${difference} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findCommonDifferenceFromAverageCountAndExtreme") {
    const target = smallest ? `ਸਭ ਤੋਂ ਛੋਟਾ ${w.singular}` : `ਸਭ ਤੋਂ ਵੱਡਾ ${w.singular}`;
    return `${count} ${w.countNoun} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ${average} ਅਤੇ ${target} ${extreme} ਹੈ। ਬਰਾਬਰ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
  }
  return pkg.stem;
}

export function applyAvg001LocalizedStemContextFidelity(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  let stem = pkg.stem;
  let contextKind = "preserved";
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    stem = cp001ContextPolish(stem, pkg.questionLanguageId, language);
    contextKind = "cp001-scenario";
  } else if (pkg.canonicalProblemId === "AVG-CP-002") {
    stem = cp002ContextStem(pkg, language);
    contextKind = avg001Cp002ContextKind(pkg.questionLanguageId);
  }

  return {
    ...pkg,
    stem,
    traceability: {
      ...pkg.traceability,
      localizedStemContextFidelity: AVG_001_LOCALIZED_STEM_CONTEXT_FIDELITY,
      localizedStemContextKind: contextKind,
    },
  };
}
