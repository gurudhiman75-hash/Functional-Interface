import type { Avg001QuestionPackage } from "./types";

type LocalizedLanguage = "hi" | "pa";
type ContextKind =
  | "number"
  | "marks"
  | "salary"
  | "output"
  | "weight"
  | "sales"
  | "age"
  | "price"
  | "reading"
  | "runs";
type Role =
  | "number"
  | "test"
  | "student"
  | "employee"
  | "machine"
  | "worker"
  | "parcel"
  | "person"
  | "day"
  | "member"
  | "player"
  | "teacher"
  | "baby"
  | "item"
  | "observation"
  | "innings";

type ContextProfile = {
  kind: ContextKind;
  role: Role;
  oldAverage: string;
  total: string;
  oldTotalLabel: string;
  newTotalLabel: string;
  resultAverage: string;
  added: string;
  removed: string;
  oldEntry: string;
  newEntry: string;
  unitPrefix: string;
  unitSuffix: string;
  surplusLabel: string;
  gapLabel: string;
};

const HI_FRAMES = [
  "अतः {content}", "इसलिए {content}", "इस प्रकार {content}", "फलतः {content}",
  "अतः गणना से {content}", "इसलिए सरल करने पर {content}", "इस प्रकार मान रखने पर {content}",
  "फलतः अंतिम गणना से {content}", "अतः हमें मिलता है कि {content}",
  "इसलिए परिणाम बताता है कि {content}", "इस प्रकार आँकड़े दिखाते हैं कि {content}",
  "फलतः निकाला गया मान पुष्टि करता है कि {content}", "अतः अंतिम चरण से स्पष्ट है कि {content}",
  "इसलिए अंकगणित से सिद्ध होता है कि {content}", "इस प्रकार प्राप्त मान का अर्थ है कि {content}",
  "फलतः दिए आँकड़ों से निष्कर्ष है कि {content}", "अतः सरल परिणाम बताता है कि {content}",
  "इसलिए पूरी गणना दिखाती है कि {content}", "इस प्रकार अंतिम मान पुष्टि करता है कि {content}",
] as const;
const PA_FRAMES = [
  "ਇਸ ਲਈ {content}", "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ {content}", "ਇਸ ਪ੍ਰਕਾਰ {content}", "ਫਲਸਰੂਪ {content}",
  "ਇਸ ਲਈ ਗਣਨਾ ਤੋਂ {content}", "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਸਰਲ ਕਰਨ ਉੱਤੇ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ {content}", "ਫਲਸਰੂਪ ਅੰਤਿਮ ਗਣਨਾ ਤੋਂ {content}",
  "ਇਸ ਲਈ ਸਾਨੂੰ ਮਿਲਦਾ ਹੈ ਕਿ {content}", "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਨਤੀਜਾ ਦੱਸਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਅੰਕੜੇ ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ {content}", "ਫਲਸਰੂਪ ਕੱਢਿਆ ਮੁੱਲ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਲਈ ਅੰਤਿਮ ਕਦਮ ਤੋਂ ਸਪਸ਼ਟ ਹੈ ਕਿ {content}", "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਹਿਸਾਬ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਪ੍ਰਾਪਤ ਮੁੱਲ ਦਾ ਅਰਥ ਹੈ ਕਿ {content}", "ਫਲਸਰੂਪ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ ਨਤੀਜਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਲਈ ਸਰਲ ਨਤੀਜਾ ਦੱਸਦਾ ਹੈ ਕਿ {content}", "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਪੂਰੀ ਗਣਨਾ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਅੰਤਿਮ ਮੁੱਲ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ {content}",
] as const;

function hasHindiWord(stem: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^\\u0900-\\u097F])${escaped}(?:$|[^\\u0900-\\u097F])`).test(stem);
}

function kindFromStem(stem: string, language: LocalizedLanguage): ContextKind {
  if (language === "hi") {
    if (/वेतन/.test(stem)) return "salary";
    if (/बिक्री/.test(stem)) return "sales";
    if (/वजन|किग्रा|किलोग्राम/.test(stem)) return "weight";
    if (/कीमत/.test(stem)) return "price";
    if (/उत्पादन|मशीन/.test(stem)) return "output";
    if (/पारी|पारियों|बल्लेबाज|बल्लेबाजी|क्रिकेट|रनों/.test(stem) || hasHindiWord(stem, "रन")) return "runs";
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

function roleFromStem(pkg: Avg001QuestionPackage, kind: ContextKind, language: LocalizedLanguage): Role {
  const stem = pkg.stem;
  if (kind === "number") return "number";
  if (kind === "salary") return "employee";
  if (kind === "sales") return "day";
  if (kind === "price") return "item";
  if (kind === "reading") return "observation";
  if (kind === "weight") return language === "hi" ? (/पार्सल/.test(stem) ? "parcel" : "person") : (/ਪਾਰਸਲ/.test(stem) ? "parcel" : "person");
  if (kind === "output") return language === "hi" ? (/मशीन/.test(stem) ? "machine" : "worker") : (/ਮਸ਼ੀਨ/.test(stem) ? "machine" : "worker");
  if (kind === "runs") return pkg.solveMode === "findInningsValueOrNewCricketAverage" ? "innings" : "player";
  if (kind === "marks") {
    const studentShift = language === "hi"
      ? /नया विद्यार्थी|विद्यार्थी कक्षा छोड़/.test(stem)
      : /ਨਵਾਂ ਵਿਦਿਆਰਥੀ|ਵਿਦਿਆਰਥੀ ਜਮਾਤ ਛੱਡ/.test(stem);
    if (studentShift) return "student";
    const testContext = language === "hi"
      ? /अगली परीक्षा|परीक्षा-परिणाम|एक परीक्षा के अंक|परीक्षा के अंक गणना से/.test(stem)
      : /ਅਗਲੀ ਪ੍ਰੀਖਿਆ|ਪ੍ਰੀਖਿਆ ਨਤੀਜ|ਇੱਕ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ|ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ ਗਣਨਾ/.test(stem);
    return testContext ? "test" : "student";
  }
  if (language === "hi") {
    if (/शिक्षक/.test(stem)) return "teacher";
    if (/खिलाड़ी/.test(stem)) return "player";
    if (/कर्मचारी|कर्मी|कार्य-दल/.test(stem)) return "worker";
    if (/विद्यार्थी|छात्र/.test(stem)) return "student";
    if (/शिशु|बच्चा|जन्म/.test(stem)) return "baby";
    if (/व्यक्ति/.test(stem)) return "person";
    return "member";
  }
  if (/ਅਧਿਆਪਕ/.test(stem)) return "teacher";
  if (/ਖਿਡਾਰੀ/.test(stem)) return "player";
  if (/ਕਰਮਚਾਰੀ|ਕਾਮਾ|ਕਾਰਜ-ਦਲ/.test(stem)) return "worker";
  if (/ਵਿਦਿਆਰਥੀ/.test(stem)) return "student";
  if (/ਬੱਚਾ|ਨਵਜਾਤ|ਜਨਮ/.test(stem)) return "baby";
  if (/ਵਿਅਕਤੀ/.test(stem)) return "person";
  return "member";
}

function hiRolePhrase(role: Role, form: "added" | "removed" | "old" | "new") {
  const phrases: Record<Role, Record<typeof form, string>> = {
    number: { added: "नई संख्या", removed: "हटाई गई संख्या", old: "पुरानी संख्या", new: "नई संख्या" },
    test: { added: "अगली परीक्षा के अंक", removed: "हटाई गई परीक्षा के अंक", old: "पुराना अंक", new: "नया अंक" },
    student: { added: "नए विद्यार्थी के अंक", removed: "जाने वाले विद्यार्थी के अंक", old: "पुराना अंक", new: "नया अंक" },
    employee: { added: "नए कर्मचारी का वेतन", removed: "जाने वाले कर्मचारी का वेतन", old: "पुराना वेतन", new: "नया वेतन" },
    machine: { added: "नई मशीन का उत्पादन", removed: "हटाई गई मशीन का उत्पादन", old: "पुरानी मशीन का उत्पादन", new: "नई मशीन का उत्पादन" },
    worker: { added: "नए कर्मी का उत्पादन", removed: "जाने वाले कर्मी का उत्पादन", old: "पुराने कर्मी का उत्पादन", new: "नए कर्मी का उत्पादन" },
    parcel: { added: "नए पार्सल का वजन", removed: "हटाए गए पार्सल का वजन", old: "पुराने पार्सल का वजन", new: "नए पार्सल का वजन" },
    person: { added: "नए व्यक्ति का वजन", removed: "जाने वाले व्यक्ति का वजन", old: "पुराने व्यक्ति का वजन", new: "नए व्यक्ति का वजन" },
    day: { added: "अगले दिन की बिक्री", removed: "हटाए गए दिन की बिक्री", old: "पुरानी बिक्री", new: "नई बिक्री" },
    member: { added: "नए सदस्य की आयु", removed: "जाने वाले सदस्य की आयु", old: "पुराने सदस्य की आयु", new: "नए सदस्य की आयु" },
    player: { added: "नए खिलाड़ी के रन", removed: "जाने वाले खिलाड़ी के रन", old: "पुराने खिलाड़ी के रन", new: "नए खिलाड़ी के रन" },
    teacher: { added: "नए शिक्षक की आयु", removed: "जाने वाले शिक्षक की आयु", old: "पुराने शिक्षक की आयु", new: "नए शिक्षक की आयु" },
    baby: { added: "नवजात शिशु की आयु", removed: "शिशु की आयु", old: "पुरानी आयु", new: "नई आयु" },
    item: { added: "नई वस्तु की कीमत", removed: "हटाई गई वस्तु की कीमत", old: "पुरानी कीमत", new: "नई कीमत" },
    observation: { added: "नए प्रेक्षण का माप", removed: "हटाए गए प्रेक्षण का माप", old: "पुराना माप", new: "नया माप" },
    innings: { added: "अगली पारी का स्कोर", removed: "हटाई गई पारी का स्कोर", old: "पुराना स्कोर", new: "नया स्कोर" },
  };
  return phrases[role][form];
}

function paRolePhrase(role: Role, form: "added" | "removed" | "old" | "new") {
  const phrases: Record<Role, Record<typeof form, string>> = {
    number: { added: "ਨਵੀਂ ਸੰਖਿਆ", removed: "ਹਟਾਈ ਸੰਖਿਆ", old: "ਪੁਰਾਣੀ ਸੰਖਿਆ", new: "ਨਵੀਂ ਸੰਖਿਆ" },
    test: { added: "ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ", removed: "ਹਟਾਈ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ", old: "ਪੁਰਾਣਾ ਅੰਕ", new: "ਨਵਾਂ ਅੰਕ" },
    student: { added: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ", removed: "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ", old: "ਪੁਰਾਣਾ ਅੰਕ", new: "ਨਵਾਂ ਅੰਕ" },
    employee: { added: "ਨਵੇਂ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", removed: "ਜਾਣ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", old: "ਪੁਰਾਣੀ ਤਨਖਾਹ", new: "ਨਵੀਂ ਤਨਖਾਹ" },
    machine: { added: "ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", removed: "ਹਟਾਈ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", old: "ਪੁਰਾਣੀ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", new: "ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ" },
    worker: { added: "ਨਵੇਂ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ", removed: "ਜਾਣ ਵਾਲੇ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ", old: "ਪੁਰਾਣੇ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ", new: "ਨਵੇਂ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ" },
    parcel: { added: "ਨਵੇਂ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", removed: "ਹਟਾਏ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", old: "ਪੁਰਾਣੇ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", new: "ਨਵੇਂ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ" },
    person: { added: "ਨਵੇਂ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ", removed: "ਜਾਣ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ", old: "ਪੁਰਾਣੇ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ", new: "ਨਵੇਂ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ" },
    day: { added: "ਅਗਲੇ ਦਿਨ ਦੀ ਵਿਕਰੀ", removed: "ਹਟਾਏ ਦਿਨ ਦੀ ਵਿਕਰੀ", old: "ਪੁਰਾਣੀ ਵਿਕਰੀ", new: "ਨਵੀਂ ਵਿਕਰੀ" },
    member: { added: "ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਮੈਂਬਰ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੇ ਮੈਂਬਰ ਦੀ ਉਮਰ", new: "ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਉਮਰ" },
    player: { added: "ਨਵੇਂ ਖਿਡਾਰੀ ਦੀਆਂ ਦੌੜਾਂ", removed: "ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦੀਆਂ ਦੌੜਾਂ", old: "ਪੁਰਾਣੇ ਖਿਡਾਰੀ ਦੀਆਂ ਦੌੜਾਂ", new: "ਨਵੇਂ ਖਿਡਾਰੀ ਦੀਆਂ ਦੌੜਾਂ" },
    teacher: { added: "ਨਵੇਂ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੇ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", new: "ਨਵੇਂ ਅਧਿਆਪਕ ਦੀ ਉਮਰ" },
    baby: { added: "ਨਵਜਾਤ ਬੱਚੇ ਦੀ ਉਮਰ", removed: "ਬੱਚੇ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੀ ਉਮਰ", new: "ਨਵੀਂ ਉਮਰ" },
    item: { added: "ਨਵੀਂ ਵਸਤੂ ਦੀ ਕੀਮਤ", removed: "ਹਟਾਈ ਵਸਤੂ ਦੀ ਕੀਮਤ", old: "ਪੁਰਾਣੀ ਕੀਮਤ", new: "ਨਵੀਂ ਕੀਮਤ" },
    observation: { added: "ਨਵੇਂ ਪ੍ਰੇਖਣ ਦਾ ਮਾਪ", removed: "ਹਟਾਏ ਪ੍ਰੇਖਣ ਦਾ ਮਾਪ", old: "ਪੁਰਾਣਾ ਮਾਪ", new: "ਨਵਾਂ ਮਾਪ" },
    innings: { added: "ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ", removed: "ਹਟਾਈ ਪਾਰੀ ਦਾ ਸਕੋਰ", old: "ਪੁਰਾਣਾ ਸਕੋਰ", new: "ਨਵਾਂ ਸਕੋਰ" },
  };
  return phrases[role][form];
}

function profile(pkg: Avg001QuestionPackage, language: LocalizedLanguage): ContextProfile {
  const kind = kindFromStem(pkg.stem, language);
  const role = roleFromStem(pkg, kind, language);
  const added = language === "hi" ? hiRolePhrase(role, "added") : paRolePhrase(role, "added");
  const removed = language === "hi" ? hiRolePhrase(role, "removed") : paRolePhrase(role, "removed");
  const oldEntry = language === "hi" ? hiRolePhrase(role, "old") : paRolePhrase(role, "old");
  const newEntry = language === "hi" ? hiRolePhrase(role, "new") : paRolePhrase(role, "new");
  if (language === "hi") {
    const labels: Record<ContextKind, Omit<ContextProfile, "kind" | "role" | "added" | "removed" | "oldEntry" | "newEntry">> = {
      number: { oldAverage: "पुराने औसत", total: "कुल योग", oldTotalLabel: "पुराना कुल", newTotalLabel: "नया कुल", resultAverage: "नया औसत", unitPrefix: "", unitSuffix: "", surplusLabel: "अतिरिक्त मान", gapLabel: "मान-अंतर" },
      marks: { oldAverage: "पुराने औसत", total: "कुल अंक", oldTotalLabel: "पुराने कुल अंक", newTotalLabel: "नए कुल अंक", resultAverage: "नया औसत", unitPrefix: "", unitSuffix: " अंक", surplusLabel: "अतिरिक्त अंक", gapLabel: "अंक-अंतर" },
      salary: { oldAverage: "पुराने औसत वेतन", total: "कुल वेतन", oldTotalLabel: "पुराना कुल वेतन", newTotalLabel: "नया कुल वेतन", resultAverage: "नया औसत वेतन", unitPrefix: "₹", unitSuffix: "", surplusLabel: "अतिरिक्त वेतन", gapLabel: "वेतन-अंतर" },
      output: { oldAverage: "पुराने औसत उत्पादन", total: "कुल उत्पादन", oldTotalLabel: "पुराना कुल उत्पादन", newTotalLabel: "नया कुल उत्पादन", resultAverage: "नया औसत उत्पादन", unitPrefix: "", unitSuffix: " इकाइयाँ", surplusLabel: "अतिरिक्त उत्पादन", gapLabel: "उत्पादन-अंतर" },
      weight: { oldAverage: "पुराने औसत वजन", total: "कुल वजन", oldTotalLabel: "पुराना कुल वजन", newTotalLabel: "नया कुल वजन", resultAverage: "नया औसत वजन", unitPrefix: "", unitSuffix: " किग्रा", surplusLabel: "अतिरिक्त वजन", gapLabel: "वजन-अंतर" },
      sales: { oldAverage: "पुरानी औसत दैनिक बिक्री", total: "कुल बिक्री", oldTotalLabel: "पुरानी कुल बिक्री", newTotalLabel: "नई कुल बिक्री", resultAverage: "नई औसत दैनिक बिक्री", unitPrefix: "₹", unitSuffix: "", surplusLabel: "अतिरिक्त बिक्री", gapLabel: "बिक्री-अंतर" },
      age: { oldAverage: "पुरानी औसत आयु", total: "कुल आयु", oldTotalLabel: "पुरानी कुल आयु", newTotalLabel: "नई कुल आयु", resultAverage: "नई औसत आयु", unitPrefix: "", unitSuffix: " वर्ष", surplusLabel: "अतिरिक्त आयु", gapLabel: "आयु-अंतर" },
      price: { oldAverage: "पुरानी औसत कीमत", total: "कुल कीमत", oldTotalLabel: "पुरानी कुल कीमत", newTotalLabel: "नई कुल कीमत", resultAverage: "नई औसत कीमत", unitPrefix: "₹", unitSuffix: "", surplusLabel: "अतिरिक्त कीमत", gapLabel: "कीमत-अंतर" },
      reading: { oldAverage: "पुराने औसत माप", total: "मापों का कुल", oldTotalLabel: "मापों का पुराना कुल", newTotalLabel: "मापों का नया कुल", resultAverage: "नया औसत माप", unitPrefix: "", unitSuffix: "", surplusLabel: "अतिरिक्त माप", gapLabel: "माप-अंतर" },
      runs: { oldAverage: role === "innings" ? "पुराने बल्लेबाजी औसत" : "पुराने औसत स्कोर", total: "कुल रन", oldTotalLabel: "पुराने कुल रन", newTotalLabel: "नए कुल रन", resultAverage: role === "innings" ? "नया बल्लेबाजी औसत" : "नया औसत स्कोर", unitPrefix: "", unitSuffix: " रन", surplusLabel: "अतिरिक्त रन", gapLabel: "रन-अंतर" },
    };
    return { kind, role, added, removed, oldEntry, newEntry, ...labels[kind] };
  }
  const labels: Record<ContextKind, Omit<ContextProfile, "kind" | "role" | "added" | "removed" | "oldEntry" | "newEntry">> = {
    number: { oldAverage: "ਪੁਰਾਣੀ ਔਸਤ", total: "ਕੁੱਲ ਜੋੜ", oldTotalLabel: "ਪੁਰਾਣਾ ਕੁੱਲ", newTotalLabel: "ਨਵਾਂ ਕੁੱਲ", resultAverage: "ਨਵੀਂ ਔਸਤ", unitPrefix: "", unitSuffix: "", surplusLabel: "ਵਾਧੂ ਮੁੱਲ", gapLabel: "ਮੁੱਲ-ਫਰਕ" },
    marks: { oldAverage: "ਪੁਰਾਣੀ ਔਸਤ", total: "ਕੁੱਲ ਅੰਕ", oldTotalLabel: "ਪੁਰਾਣੇ ਕੁੱਲ ਅੰਕ", newTotalLabel: "ਨਵੇਂ ਕੁੱਲ ਅੰਕ", resultAverage: "ਨਵੀਂ ਔਸਤ", unitPrefix: "", unitSuffix: " ਅੰਕ", surplusLabel: "ਵਾਧੂ ਅੰਕ", gapLabel: "ਅੰਕ-ਫਰਕ" },
    salary: { oldAverage: "ਪੁਰਾਣੀ ਔਸਤ ਤਨਖਾਹ", total: "ਕੁੱਲ ਤਨਖਾਹ", oldTotalLabel: "ਪੁਰਾਣੀ ਕੁੱਲ ਤਨਖਾਹ", newTotalLabel: "ਨਵੀਂ ਕੁੱਲ ਤਨਖਾਹ", resultAverage: "ਨਵੀਂ ਔਸਤ ਤਨਖਾਹ", unitPrefix: "₹", unitSuffix: "", surplusLabel: "ਵਾਧੂ ਤਨਖਾਹ", gapLabel: "ਤਨਖਾਹ-ਫਰਕ" },
    output: { oldAverage: "ਪੁਰਾਣੇ ਔਸਤ ਉਤਪਾਦਨ", total: "ਕੁੱਲ ਉਤਪਾਦਨ", oldTotalLabel: "ਪੁਰਾਣਾ ਕੁੱਲ ਉਤਪਾਦਨ", newTotalLabel: "ਨਵਾਂ ਕੁੱਲ ਉਤਪਾਦਨ", resultAverage: "ਨਵਾਂ ਔਸਤ ਉਤਪਾਦਨ", unitPrefix: "", unitSuffix: " ਇਕਾਈਆਂ", surplusLabel: "ਵਾਧੂ ਉਤਪਾਦਨ", gapLabel: "ਉਤਪਾਦਨ-ਫਰਕ" },
    weight: { oldAverage: "ਪੁਰਾਣੇ ਔਸਤ ਵਜ਼ਨ", total: "ਕੁੱਲ ਵਜ਼ਨ", oldTotalLabel: "ਪੁਰਾਣਾ ਕੁੱਲ ਵਜ਼ਨ", newTotalLabel: "ਨਵਾਂ ਕੁੱਲ ਵਜ਼ਨ", resultAverage: "ਨਵਾਂ ਔਸਤ ਵਜ਼ਨ", unitPrefix: "", unitSuffix: " ਕਿਲੋਗ੍ਰਾਮ", surplusLabel: "ਵਾਧੂ ਵਜ਼ਨ", gapLabel: "ਵਜ਼ਨ-ਫਰਕ" },
    sales: { oldAverage: "ਪੁਰਾਣੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", total: "ਕੁੱਲ ਵਿਕਰੀ", oldTotalLabel: "ਪੁਰਾਣੀ ਕੁੱਲ ਵਿਕਰੀ", newTotalLabel: "ਨਵੀਂ ਕੁੱਲ ਵਿਕਰੀ", resultAverage: "ਨਵੀਂ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", unitPrefix: "₹", unitSuffix: "", surplusLabel: "ਵਾਧੂ ਵਿਕਰੀ", gapLabel: "ਵਿਕਰੀ-ਫਰਕ" },
    age: { oldAverage: "ਪੁਰਾਣੀ ਔਸਤ ਉਮਰ", total: "ਕੁੱਲ ਉਮਰ", oldTotalLabel: "ਪੁਰਾਣੀ ਕੁੱਲ ਉਮਰ", newTotalLabel: "ਨਵੀਂ ਕੁੱਲ ਉਮਰ", resultAverage: "ਨਵੀਂ ਔਸਤ ਉਮਰ", unitPrefix: "", unitSuffix: " ਸਾਲ", surplusLabel: "ਵਾਧੂ ਉਮਰ", gapLabel: "ਉਮਰ-ਫਰਕ" },
    price: { oldAverage: "ਪੁਰਾਣੀ ਔਸਤ ਕੀਮਤ", total: "ਕੁੱਲ ਕੀਮਤ", oldTotalLabel: "ਪੁਰਾਣੀ ਕੁੱਲ ਕੀਮਤ", newTotalLabel: "ਨਵੀਂ ਕੁੱਲ ਕੀਮਤ", resultAverage: "ਨਵੀਂ ਔਸਤ ਕੀਮਤ", unitPrefix: "₹", unitSuffix: "", surplusLabel: "ਵਾਧੂ ਕੀਮਤ", gapLabel: "ਕੀਮਤ-ਫਰਕ" },
    reading: { oldAverage: "ਪੁਰਾਣੇ ਔਸਤ ਮਾਪ", total: "ਮਾਪਾਂ ਦਾ ਕੁੱਲ", oldTotalLabel: "ਮਾਪਾਂ ਦਾ ਪੁਰਾਣਾ ਕੁੱਲ", newTotalLabel: "ਮਾਪਾਂ ਦਾ ਨਵਾਂ ਕੁੱਲ", resultAverage: "ਨਵਾਂ ਔਸਤ ਮਾਪ", unitPrefix: "", unitSuffix: "", surplusLabel: "ਵਾਧੂ ਮਾਪ", gapLabel: "ਮਾਪ-ਫਰਕ" },
    runs: { oldAverage: role === "innings" ? "ਪੁਰਾਣੀ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ" : "ਪੁਰਾਣੇ ਔਸਤ ਸਕੋਰ", total: "ਕੁੱਲ ਦੌੜਾਂ", oldTotalLabel: "ਪੁਰਾਣੀਆਂ ਕੁੱਲ ਦੌੜਾਂ", newTotalLabel: "ਨਵੀਆਂ ਕੁੱਲ ਦੌੜਾਂ", resultAverage: role === "innings" ? "ਨਵੀਂ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ" : "ਨਵਾਂ ਔਸਤ ਸਕੋਰ", unitPrefix: "", unitSuffix: " ਦੌੜਾਂ", surplusLabel: "ਵਾਧੂ ਦੌੜਾਂ", gapLabel: "ਦੌੜਾਂ ਦਾ ਫਰਕ" },
  };
  return { kind, role, added, removed, oldEntry, newEntry, ...labels[kind] };
}

function rendered(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key] ?? pkg.parameters.values[key];
  return value === undefined || value === null ? "" : String(value);
}

function elapsedYears(pkg: Avg001QuestionPackage) {
  return rendered(pkg, "yearsElapsed") || rendered(pkg, "elapsedYears");
}

function asksForOldEntry(pkg: Avg001QuestionPackage, language: LocalizedLanguage) {
  return language === "hi"
    ? /पुराना|पुरानी|पुराने|अज्ञात .+ के स्थान पर/.test(pkg.stem)
    : /ਪੁਰਾਣਾ|ਪੁਰਾਣੀ|ਪੁਰਾਣੇ|ਅਣਜਾਣ .+ ਦੀ ਥਾਂ/.test(pkg.stem);
}

function concept(pkg: Avg001QuestionPackage, language: LocalizedLanguage, p: ContextProfile) {
  const mode = pkg.solveMode;
  const years = elapsedYears(pkg);
  if (language === "hi") {
    if (years && p.kind === "age") return `${years} वर्ष बीतने पर पहले प्रत्येक मूल आयु को उतना ही बढ़ाना आवश्यक है।`;
    if (mode === "findNewAverageAfterAddition") return `${p.added} जोड़ने से पहले ${p.oldAverage} से ${p.total} निकालना आवश्यक है।`;
    if (mode === "findNewAverageAfterRemoval") return `${p.removed} हटाने से पहले ${p.oldAverage} से ${p.total} निकालना आवश्यक है।`;
    if (mode === "findNewAverageAfterReplacement") return "प्रतिस्थापन में संख्या नहीं बदलती; केवल कुल में पुरानी और नई प्रविष्टि का अंतर आता है।";
    if (mode === "findAddedMemberValueFromShift") return `पुराने और नए औसत से बने कुलों का अंतर ${p.added} देता है।`;
    if (mode === "findRemovedMemberValueFromShift") return `पुराने और शेष समूह के कुलों का अंतर ${p.removed} देता है।`;
    if (mode === "findReplacementValueFromShift") return "औसत में परिवर्तन को कुल में बदलकर बदली गई प्रविष्टि निकाली जाती है।";
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "नई बल्लेबाजी औसत के लिए रन-योग और पारी-संख्या दोनों को अपडेट करना पड़ता है।"
      : "अगली पारी के आवश्यक रन लक्षित कुल रन और वर्तमान कुल रन के अंतर के बराबर हैं।";
    if (mode === "findOriginalCountFromJoiningMemberShift") return `${p.added} और पुराने औसत का अंतर बढ़े हुए समूह में औसत-वृद्धि पैदा करता है।`;
    return `${p.removed} और पुराने औसत का अंतर हटने के बाद शेष समूह का औसत बढ़ाता है।`;
  }
  if (years && p.kind === "age") return `${years} ਸਾਲ ਬੀਤਣ ਉੱਤੇ ਪਹਿਲਾਂ ਹਰ ਮੂਲ ਉਮਰ ਨੂੰ ਉਤਨਾ ਹੀ ਵਧਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।`;
  if (mode === "findNewAverageAfterAddition") return `${p.added} ਜੋੜਨ ਤੋਂ ਪਹਿਲਾਂ ${p.oldAverage} ਤੋਂ ${p.total} ਕੱਢਣਾ ਲਾਜ਼ਮੀ ਹੈ।`;
  if (mode === "findNewAverageAfterRemoval") return `${p.removed} ਹਟਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ${p.oldAverage} ਤੋਂ ${p.total} ਕੱਢਣਾ ਲਾਜ਼ਮੀ ਹੈ।`;
  if (mode === "findNewAverageAfterReplacement") return "ਬਦਲੀ ਵਿੱਚ ਗਿਣਤੀ ਨਹੀਂ ਬਦਲਦੀ; ਸਿਰਫ਼ ਕੁੱਲ ਵਿੱਚ ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਦਰਜ ਰਕਮ ਦਾ ਫਰਕ ਆਉਂਦਾ ਹੈ।";
  if (mode === "findAddedMemberValueFromShift") return `ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਔਸਤ ਤੋਂ ਬਣੇ ਕੁੱਲਾਂ ਦਾ ਫਰਕ ${p.added} ਦਿੰਦਾ ਹੈ।`;
  if (mode === "findRemovedMemberValueFromShift") return `ਪੁਰਾਣੇ ਅਤੇ ਬਾਕੀ ਸਮੂਹ ਦੇ ਕੁੱਲਾਂ ਦਾ ਫਰਕ ${p.removed} ਦਿੰਦਾ ਹੈ।`;
  if (mode === "findReplacementValueFromShift") return "ਔਸਤ ਦੇ ਬਦਲਾਅ ਨੂੰ ਕੁੱਲ ਵਿੱਚ ਬਦਲ ਕੇ ਬਦਲੀ ਹੋਈ ਦਰਜ ਰਕਮ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।";
  if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
    ? "ਨਵੀਂ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ਲਈ ਦੌੜਾਂ ਦਾ ਜੋੜ ਅਤੇ ਪਾਰੀ-ਗਿਣਤੀ ਦੋਵੇਂ ਅਪਡੇਟ ਕਰਨੇ ਪੈਂਦੇ ਹਨ।"
    : "ਅਗਲੀ ਪਾਰੀ ਦੀਆਂ ਲੋੜੀਂਦੀਆਂ ਦੌੜਾਂ ਟੀਚੇ ਦੇ ਕੁੱਲ ਅਤੇ ਮੌਜੂਦਾ ਕੁੱਲ ਦੇ ਫਰਕ ਦੇ ਬਰਾਬਰ ਹਨ।";
  if (mode === "findOriginalCountFromJoiningMemberShift") return `${p.added} ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਫਰਕ ਵਧੇ ਸਮੂਹ ਵਿੱਚ ਔਸਤ-ਵਾਧਾ ਪੈਦਾ ਕਰਦਾ ਹੈ।`;
  return `${p.removed} ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਫਰਕ ਹਟਣ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਸਮੂਹ ਦੀ ਔਸਤ ਵਧਾਉਂਦਾ ਹੈ।`;
}

function method(pkg: Avg001QuestionPackage, language: LocalizedLanguage, p: ContextProfile) {
  const mode = pkg.solveMode;
  const years = elapsedYears(pkg);
  if (language === "hi") {
    const ageLead = years && p.kind === "age" ? `पहले ${years} वर्ष बाद की ${p.total} निकालें। ` : "";
    if (mode === "findNewAverageAfterAddition") return `${ageLead}${p.oldAverage} से ${p.total} निकालें; ${p.added} जोड़कर बढ़ी हुई संख्या से भाग दें।`;
    if (mode === "findNewAverageAfterRemoval") return `${ageLead}${p.oldAverage} से ${p.total} निकालें; ${p.removed} घटाकर शेष संख्या से भाग दें।`;
    if (mode === "findNewAverageAfterReplacement") return `${ageLead}${p.total} में ${p.oldEntry} घटाकर ${p.newEntry} जोड़ें; संख्या वही रहती है।`;
    if (mode === "findAddedMemberValueFromShift") return `${p.oldAverage} और नए औसत से दोनों कुल निकालें; उनका अंतर ${p.added} देता है।`;
    if (mode === "findRemovedMemberValueFromShift") return `${p.oldAverage} और शेष औसत से दोनों कुल निकालें; उनका अंतर ${p.removed} देता है।`;
    if (mode === "findReplacementValueFromShift") return asksForOldEntry(pkg, language)
      ? `${ageLead}कुल में हुए परिवर्तन को ज्ञात ${p.newEntry} के साथ समायोजित करके ${p.oldEntry} निकालें।`
      : `${ageLead}कुल में हुए परिवर्तन को ${p.oldEntry} के साथ समायोजित करके ${p.newEntry} निकालें।`;
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "पुराने कुल रन में अगली पारी का स्कोर जोड़ें और नई पारी-संख्या से भाग दें।"
      : "लक्षित कुल रन में से वर्तमान कुल रन घटाकर अगली पारी के आवश्यक रन निकालें।";
    if (mode === "findOriginalCountFromJoiningMemberShift") return `${p.added} और पुराने औसत का अंतर औसत-वृद्धि से भाग दें; बढ़े हुए समूह की संख्या में से एक घटाएँ।`;
    return `${p.removed} और पुराने औसत का अंतर औसत-वृद्धि से भाग दें; शेष समूह की संख्या में एक जोड़ें।`;
  }
  const ageLead = years && p.kind === "age" ? `ਪਹਿਲਾਂ ${years} ਸਾਲ ਬਾਅਦ ਦੀ ${p.total} ਕੱਢੋ। ` : "";
  if (mode === "findNewAverageAfterAddition") return `${ageLead}${p.oldAverage} ਤੋਂ ${p.total} ਕੱਢੋ; ${p.added} ਜੋੜ ਕੇ ਵਧੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (mode === "findNewAverageAfterRemoval") return `${ageLead}${p.oldAverage} ਤੋਂ ${p.total} ਕੱਢੋ; ${p.removed} ਘਟਾ ਕੇ ਬਾਕੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (mode === "findNewAverageAfterReplacement") return `${ageLead}${p.total} ਵਿੱਚ ${p.oldEntry} ਘਟਾ ਕੇ ${p.newEntry} ਜੋੜੋ; ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।`;
  if (mode === "findAddedMemberValueFromShift") return `${p.oldAverage} ਅਤੇ ਨਵੀਂ ਔਸਤ ਤੋਂ ਦੋਵੇਂ ਕੁੱਲ ਕੱਢੋ; ਉਨ੍ਹਾਂ ਦਾ ਫਰਕ ${p.added} ਦਿੰਦਾ ਹੈ।`;
  if (mode === "findRemovedMemberValueFromShift") return `${p.oldAverage} ਅਤੇ ਬਾਕੀ ਔਸਤ ਤੋਂ ਦੋਵੇਂ ਕੁੱਲ ਕੱਢੋ; ਉਨ੍ਹਾਂ ਦਾ ਫਰਕ ${p.removed} ਦਿੰਦਾ ਹੈ।`;
  if (mode === "findReplacementValueFromShift") return asksForOldEntry(pkg, language)
    ? `${ageLead}ਕੁੱਲ ਵਿੱਚ ਆਏ ਬਦਲਾਅ ਨੂੰ ਜਾਣੀ ${p.newEntry} ਨਾਲ ਮਿਲਾ ਕੇ ${p.oldEntry} ਕੱਢੋ।`
    : `${ageLead}ਕੁੱਲ ਵਿੱਚ ਆਏ ਬਦਲਾਅ ਨੂੰ ${p.oldEntry} ਨਾਲ ਮਿਲਾ ਕੇ ${p.newEntry} ਕੱਢੋ।`;
  if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
    ? "ਪੁਰਾਣੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚ ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ ਜੋੜੋ ਅਤੇ ਨਵੀਂ ਪਾਰੀ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।"
    : "ਟੀਚੇ ਦੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚੋਂ ਮੌਜੂਦਾ ਕੁੱਲ ਦੌੜਾਂ ਘਟਾ ਕੇ ਅਗਲੀ ਪਾਰੀ ਲਈ ਲੋੜੀਂਦੀਆਂ ਦੌੜਾਂ ਕੱਢੋ।";
  if (mode === "findOriginalCountFromJoiningMemberShift") return `${p.added} ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਫਰਕ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ; ਵਧੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਵਿੱਚੋਂ ਇੱਕ ਘਟਾਓ।`;
  return `${p.removed} ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਫਰਕ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ; ਬਾਕੀ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜੋ।`;
}

function displayAnswer(pkg: Avg001QuestionPackage, p: ContextProfile) {
  const answer = String(pkg.answer);
  const prefix = p.unitPrefix && !answer.startsWith(p.unitPrefix) ? p.unitPrefix : "";
  const suffix = p.unitSuffix && !answer.includes(p.unitSuffix.trim()) ? p.unitSuffix : "";
  return `${prefix}${answer}${suffix}`;
}

function countConclusion(pkg: Avg001QuestionPackage, language: LocalizedLanguage, role: Role) {
  const answer = String(pkg.answer);
  if (language === "hi") {
    if (role === "student") return `कक्षा में प्रारंभ में ${answer} विद्यार्थी थे`;
    if (role === "player") return `टीम में प्रारंभ में ${answer} खिलाड़ी थे`;
    if (role === "worker") return `कार्य-दल में प्रारंभ में ${answer} कर्मी थे`;
    if (role === "machine") return `प्रारंभ में ${answer} मशीनें थीं`;
    return `प्रारंभिक संख्या ${answer} थी`;
  }
  if (role === "student") return `ਜਮਾਤ ਵਿੱਚ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਵਿਦਿਆਰਥੀ ਸਨ`;
  if (role === "player") return `ਟੀਮ ਵਿੱਚ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਖਿਡਾਰੀ ਸਨ`;
  if (role === "worker") return `ਕਾਰਜ-ਦਲ ਵਿੱਚ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਕਾਮੇ ਸਨ`;
  if (role === "machine") return `ਸ਼ੁਰੂ ਵਿੱਚ ${answer} ਮਸ਼ੀਨਾਂ ਸਨ`;
  return `ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ${answer} ਸੀ`;
}

function conclusionContent(pkg: Avg001QuestionPackage, language: LocalizedLanguage, p: ContextProfile) {
  const answer = displayAnswer(pkg, p);
  const mode = pkg.solveMode;
  if (mode === "findNewAverageAfterAddition" || mode === "findNewAverageAfterRemoval" || mode === "findNewAverageAfterReplacement") return `${p.resultAverage} ${answer} ${language === "hi" ? "है" : "ਹੈ"}`;
  if (mode === "findAddedMemberValueFromShift") return `${p.added} ${answer} ${language === "hi" ? "है" : "ਹੈ"}`;
  if (mode === "findRemovedMemberValueFromShift") return `${p.removed} ${answer} ${language === "hi" ? "है" : "ਹੈ"}`;
  if (mode === "findReplacementValueFromShift") {
    const target = asksForOldEntry(pkg, language) ? p.oldEntry : p.newEntry;
    return `${target} ${answer} ${language === "hi" ? "है" : "ਹੈ"}`;
  }
  if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
    ? `${p.resultAverage} ${answer} ${language === "hi" ? "है" : "ਹੈ"}`
    : `${language === "hi" ? "अगली पारी में आवश्यक स्कोर" : "ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ਲੋੜੀਂਦਾ ਸਕੋਰ"} ${answer} ${language === "hi" ? "है" : "ਹੈ"}`;
  return countConclusion(pkg, language, p.role);
}

function replaceOpening(line: string, value: string) {
  const index = line.indexOf(":");
  return index >= 0 ? `${line.slice(0, index + 1)} ${value}` : value;
}

function contextualizeEquations(lines: string[], p: ContextProfile, language: LocalizedLanguage) {
  return lines.map((line) => {
    if (!line.includes("$$")) return line;
    if (language === "hi") {
      return line
        .replaceAll("पुराना कुल", p.oldTotalLabel)
        .replaceAll("नया कुल", p.newTotalLabel)
        .replaceAll("नया औसत", p.resultAverage)
        .replaceAll("अतिरिक्त मान", p.surplusLabel)
        .replaceAll("मान-अंतर", p.gapLabel);
    }
    return line
      .replaceAll("ਪੁਰਾਣਾ ਕੁੱਲ", p.oldTotalLabel)
      .replaceAll("ਨਵਾਂ ਕੁੱਲ", p.newTotalLabel)
      .replaceAll("ਨਵੀਂ ਔਸਤ", p.resultAverage)
      .replaceAll("ਵਾਧੂ ਮੁੱਲ", p.surplusLabel)
      .replaceAll("ਮੁੱਲ-ਅੰਤਰ", p.gapLabel);
  });
}

export function finalizeAvg001Cp003ExplanationContext(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003" || (pkg.language !== "hi" && pkg.language !== "pa")) return pkg;
  const language = pkg.language as LocalizedLanguage;
  const p = profile(pkg, language);
  const id = Math.max(0, Number(pkg.questionLanguageId.slice(-3)) - 1);
  const frames = language === "hi" ? HI_FRAMES : PA_FRAMES;
  const lines = contextualizeEquations([...pkg.explanation.lines], p, language);
  if (lines.length) lines[0] = replaceOpening(lines[0]!, concept(pkg, language, p));
  if (lines.length > 1) lines[1] = method(pkg, language, p);
  lines[lines.length - 1] = `${frames[Math.floor(id / 23) % frames.length]!.replace("{content}", conclusionContent(pkg, language, p))}।`;
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      cp003ExplanationContextFinalizer: "AVG-CP-003 localized context finalizer v2",
    },
  };
}
