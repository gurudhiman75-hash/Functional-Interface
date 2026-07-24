import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

function value(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") return String(rendered);
  const raw = pkg.parameters.values[key];
  if (typeof raw === "number" || typeof raw === "string") return String(raw);
  if (raw && typeof raw === "object" && "numerator" in raw && "denominator" in raw) {
    const numerator = Number(raw.numerator);
    const denominator = Number(raw.denominator);
    if (denominator === 1) return String(numerator);
    const decimal = numerator / denominator;
    return Number.isInteger(decimal * 10) ? decimal.toFixed(1) : `${numerator}/${denominator}`;
  }
  return "";
}

function money(raw: string) {
  return raw.startsWith("₹") ? raw : `₹${raw}`;
}

function cp001Stem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  let stem = pkg.stem;
  if (language === "hi") {
    stem = stem
      .replace(
        /कुल ([\d,.]+) इकाइयाँ बनीं और प्रतिदिन औसत ([\d,.]+) इकाइयाँ बनीं। कार्य-दिवसों की संख्या ज्ञात कीजिए।/,
        "एक उत्पादन इकाई ने कुल $1 वस्तुएँ बनाईं। प्रतिदिन औसतन $2 वस्तुएँ बनीं। कार्य-दिवसों की संख्या ज्ञात कीजिए।",
      )
      .replace(
        /₹([\d,.]+) के लेन-देन का औसत मूल्य ₹([\d,.]+) है। लेन-देन की संख्या ज्ञात कीजिए।/,
        "लेन-देन की कुल राशि ₹$1 है और प्रति लेन-देन औसत राशि ₹$2 है। लेन-देन की संख्या ज्ञात कीजिए।",
      )
      .replace(
        /एक प्रणाली ने कुल ₹([\d,.]+) के लेन-देन संसाधित किए, जिनका औसत ₹([\d,.]+) है। लेन-देन की संख्या ज्ञात कीजिए।/,
        "किसी प्रणाली में लेन-देन की कुल राशि ₹$1 है और प्रति लेन-देन औसत ₹$2 है। लेन-देन की संख्या ज्ञात कीजिए।",
      );
  } else {
    stem = stem
      .replace(
        /ਕੁੱਲ ([\d,.]+) ਇਕਾਈਆਂ ਬਣੀਆਂ ਅਤੇ ਪ੍ਰਤੀ ਦਿਨ ਔਸਤ ([\d,.]+) ਇਕਾਈਆਂ ਬਣੀਆਂ। ਕੰਮ ਦੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।/,
        "ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ ਨੇ ਕੁੱਲ $1 ਵਸਤਾਂ ਬਣਾਈਆਂ। ਹਰ ਦਿਨ ਔਸਤਨ $2 ਵਸਤਾਂ ਬਣੀਆਂ। ਕੰਮ ਦੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
      )
      .replace(
        /₹([\d,.]+) ਦੇ ਲੈਣ-ਦੇਣ ਦਾ ਔਸਤ ਮੁੱਲ ₹([\d,.]+) ਹੈ। ਲੈਣ-ਦੇਣ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।/,
        "ਲੈਣ-ਦੇਣ ਦੀ ਕੁੱਲ ਰਕਮ ₹$1 ਹੈ ਅਤੇ ਪ੍ਰਤੀ ਲੈਣ-ਦੇਣ ਔਸਤ ਰਕਮ ₹$2 ਹੈ। ਲੈਣ-ਦੇਣ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
      )
      .replace(
        /ਇੱਕ ਪ੍ਰਣਾਲੀ ਨੇ ਕੁੱਲ ₹([\d,.]+) ਦੇ ਲੈਣ-ਦੇਣ ਸੰਭਾਲੇ, ਜਿਨ੍ਹਾਂ ਦਾ ਔਸਤ ₹([\d,.]+) ਹੈ। ਲੈਣ-ਦੇਣ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।/,
        "ਕਿਸੇ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਲੈਣ-ਦੇਣ ਦੀ ਕੁੱਲ ਰਕਮ ₹$1 ਹੈ ਅਤੇ ਪ੍ਰਤੀ ਲੈਣ-ਦੇਣ ਔਸਤ ₹$2 ਹੈ। ਲੈਣ-ਦੇਣ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
      );
  }
  return stem;
}

type SequenceContext = {
  subject: string;
  item: string;
  items: string;
};

function cp002Context(pkg: Avg001QuestionPackage, language: PilotLanguage): SequenceContext {
  const domain = pkg.parameters.contextDomain;
  if (language === "hi") {
    if (domain === "Classroom") return { subject: "कुछ परीक्षाओं में प्राप्त अंक", item: "अंक", items: "अंक" };
    if (domain === "Commerce") return { subject: "कुछ वस्तुओं की कीमतें", item: "कीमत", items: "कीमतें" };
    if (domain === "Factory") return { subject: "लगातार दिनों के उत्पादन के आँकड़े", item: "उत्पादन", items: "उत्पादन के आँकड़े" };
    if (domain === "Sports") return { subject: "लगातार मैचों के स्कोर", item: "स्कोर", items: "स्कोर" };
    if (domain === "Travel") return { subject: "लगातार यात्राओं में तय दूरियाँ", item: "दूरी", items: "दूरियाँ" };
    return { subject: "कुछ संख्याएँ", item: "संख्या", items: "संख्याएँ" };
  }
  if (domain === "Classroom") return { subject: "ਕੁਝ ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਅੰਕ", item: "ਅੰਕ", items: "ਅੰਕ" };
  if (domain === "Commerce") return { subject: "ਕੁਝ ਵਸਤੂਆਂ ਦੀਆਂ ਕੀਮਤਾਂ", item: "ਕੀਮਤ", items: "ਕੀਮਤਾਂ" };
  if (domain === "Factory") return { subject: "ਲਗਾਤਾਰ ਦਿਨਾਂ ਦੇ ਉਤਪਾਦਨ ਦੇ ਅੰਕੜੇ", item: "ਉਤਪਾਦਨ", items: "ਉਤਪਾਦਨ ਦੇ ਅੰਕੜੇ" };
  if (domain === "Sports") return { subject: "ਲਗਾਤਾਰ ਮੈਚਾਂ ਦੇ ਸਕੋਰ", item: "ਸਕੋਰ", items: "ਸਕੋਰ" };
  if (domain === "Travel") return { subject: "ਲਗਾਤਾਰ ਯਾਤਰਾਵਾਂ ਵਿੱਚ ਤੈਅ ਦੂਰੀਆਂ", item: "ਦੂਰੀ", items: "ਦੂਰੀਆਂ" };
  return { subject: "ਕੁਝ ਸੰਖਿਆਵਾਂ", item: "ਸੰਖਿਆ", items: "ਸੰਖਿਆਵਾਂ" };
}

function smallest(pkg: Avg001QuestionPackage) {
  const target = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
  return /small|least/i.test(target);
}

function cp002Stem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const context = cp002Context(pkg, language);
  const first = value(pkg, "firstTerm");
  const last = value(pkg, "lastTerm");
  const count = value(pkg, "count");
  const average = value(pkg, "average");
  const difference = value(pkg, "commonDifference");
  const extreme = value(pkg, "extremeValue") || (smallest(pkg) ? first : last);
  const target = language === "hi"
    ? smallest(pkg) ? "सबसे छोटा" : "सबसे बड़ा"
    : smallest(pkg) ? "ਸਭ ਤੋਂ ਛੋਟਾ" : "ਸਭ ਤੋਂ ਵੱਡਾ";
  const variant = Number(pkg.questionLanguageId.slice(-3)) % 3;

  if (language === "hi") {
    switch (pkg.solveMode) {
      case "findAverageOfConsecutiveSet":
      case "findAverageOfOddOrEvenSet":
        return variant === 0
          ? `${context.subject} समान अंतर पर हैं। पहला मान ${first} और अंतिम मान ${last} है। औसत ज्ञात कीजिए।`
          : variant === 1
            ? `${context.subject} ${first} से शुरू होकर ${last} तक समान अंतर से बढ़ते हैं। उनका औसत निकालिए।`
            : `${count} ${context.items} समान अंतर पर हैं; पहला ${first} और अंतिम ${last} है। औसत क्या होगा?`;
      case "findMiddleTermFromAverage":
        return `${context.subject} समान अंतर पर हैं। कुल ${count} मानों का औसत ${average} है। बीच का ${context.item} ज्ञात कीजिए।`;
      case "findExtremeFromAverageAndCount":
        return `${context.subject} समान अंतर पर हैं। कुल ${count} मानों का औसत ${average} है और प्रत्येक अगला मान ${difference} अधिक है। ${target} ${context.item} ज्ञात कीजिए।`;
      case "findTermCountFromAverageAndExtreme":
        return `${context.subject} समान अंतर पर हैं। औसत ${average}, ${target} मान ${extreme} और अंतर ${difference} है। कुल मानों की संख्या ज्ञात कीजिए।`;
      case "findCommonDifferenceFromAverageCountAndExtreme":
        return `${context.subject} समान अंतर पर हैं। कुल ${count} मानों का औसत ${average} है और ${target} मान ${extreme} है। दो क्रमिक मानों का अंतर ज्ञात कीजिए।`;
      default:
        return pkg.stem;
    }
  }

  switch (pkg.solveMode) {
    case "findAverageOfConsecutiveSet":
    case "findAverageOfOddOrEvenSet":
      return variant === 0
        ? `${context.subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਪਹਿਲਾ ਮੁੱਲ ${first} ਅਤੇ ਆਖਰੀ ਮੁੱਲ ${last} ਹੈ। ਔਸਤ ਪਤਾ ਕਰੋ।`
        : variant === 1
          ? `${context.subject} ${first} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ${last} ਤੱਕ ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵਧਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕੱਢੋ।`
          : `${count} ${context.items} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ; ਪਹਿਲਾ ${first} ਅਤੇ ਆਖਰੀ ${last} ਹੈ। ਔਸਤ ਕੀ ਹੋਵੇਗੀ?`;
    case "findMiddleTermFromAverage":
      return `${context.subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਵਿਚਕਾਰਲਾ ${context.item} ਪਤਾ ਕਰੋ।`;
    case "findExtremeFromAverageAndCount":
      return `${context.subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ ਅਤੇ ਹਰ ਅਗਲਾ ਮੁੱਲ ${difference} ਵੱਧ ਹੈ। ${target} ${context.item} ਪਤਾ ਕਰੋ।`;
    case "findTermCountFromAverageAndExtreme":
      return `${context.subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਔਸਤ ${average}, ${target} ਮੁੱਲ ${extreme} ਅਤੇ ਅੰਤਰ ${difference} ਹੈ। ਕੁੱਲ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
    case "findCommonDifferenceFromAverageCountAndExtreme":
      return `${context.subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ ਅਤੇ ${target} ਮੁੱਲ ${extreme} ਹੈ। ਦੋ ਲਗਾਤਾਰ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
    default:
      return pkg.stem;
  }
}

type Cp003Kind = "abstract" | "marks" | "salary" | "sales" | "price" | "output" | "parcel" | "weight";

function cp003Kind(pkg: Avg001QuestionPackage): Cp003Kind {
  const variant = pkg.parameters.scenarioVariant;
  if (/salary|employee/i.test(variant)) return "salary";
  if (/sales|day/i.test(variant)) return "sales";
  if (/price/i.test(variant)) return "price";
  if (/output|machine/i.test(variant)) return "output";
  if (/parcel/i.test(variant)) return "parcel";
  if (/weight|person/i.test(variant)) return "weight";
  if (/score|test|reading/i.test(variant)) return "marks";
  return "abstract";
}

function cp003NonAgeStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const kind = cp003Kind(pkg);
  const count = value(pkg, "oldCount");
  const oldAverage = value(pkg, "oldAverage");
  const newAverage = value(pkg, "newAverage");
  const added = value(pkg, "addedValue");
  const removed = value(pkg, "removedValue");

  if (language === "hi") {
    if (pkg.solveMode === "findNewAverageAfterAddition") {
      if (kind === "marks") return `एक विद्यार्थी के ${count} परीक्षा-अंकों का औसत ${oldAverage} है। अगली परीक्षा में ${added} अंक मिलने पर नया औसत ज्ञात कीजिए।`;
      if (kind === "salary") return `${count} कर्मचारियों का औसत वेतन ${money(oldAverage)} है। ${money(added)} वेतन वाला एक नया कर्मचारी जुड़ता है। नया औसत वेतन ज्ञात कीजिए।`;
      if (kind === "output") return `${count} मशीनों का औसत उत्पादन ${oldAverage} इकाइयाँ है। ${added} इकाइयाँ बनाने वाली एक और मशीन जोड़ दी जाती है। नया औसत उत्पादन ज्ञात कीजिए।`;
      if (kind === "parcel") return `${count} पार्सलों का औसत वजन ${oldAverage} किग्रा है। ${added} किग्रा का एक और पार्सल जोड़ने पर नया औसत वजन ज्ञात कीजिए।`;
      if (kind === "weight") return `${count} व्यक्तियों का औसत वजन ${oldAverage} किग्रा है। ${added} किग्रा वजन वाला एक और व्यक्ति शामिल होता है। नया औसत वजन ज्ञात कीजिए।`;
      if (kind === "sales") return `${count} दिनों की औसत बिक्री ${money(oldAverage)} है। अगले दिन बिक्री ${money(added)} होती है। नया दैनिक औसत ज्ञात कीजिए।`;
      return `${count} मानों का औसत ${oldAverage} है। इसमें ${added} जोड़ने पर नया औसत ज्ञात कीजिए।`;
    }
    if (pkg.solveMode === "findNewAverageAfterRemoval") {
      if (kind === "marks") return `एक विद्यार्थी के ${count} परीक्षा-अंकों का औसत ${oldAverage} है। ${removed} अंक वाली परीक्षा को गणना से निकालने पर नया औसत ज्ञात कीजिए।`;
      if (kind === "salary") return `${count} कर्मचारियों का औसत वेतन ${money(oldAverage)} है। ${money(removed)} वेतन वाला एक कर्मचारी नौकरी छोड़ देता है। नया औसत वेतन ज्ञात कीजिए।`;
      if (kind === "output") return `${count} मशीनों का औसत उत्पादन ${oldAverage} इकाइयाँ है। ${removed} इकाइयाँ बनाने वाली एक मशीन हटा दी जाती है। नया औसत उत्पादन ज्ञात कीजिए।`;
      if (kind === "parcel") return `${count} पार्सलों का औसत वजन ${oldAverage} किग्रा है। ${removed} किग्रा का एक पार्सल हटा दिया जाता है। नया औसत वजन ज्ञात कीजिए।`;
      if (kind === "weight") return `${count} व्यक्तियों का औसत वजन ${oldAverage} किग्रा है। ${removed} किग्रा वजन वाला एक व्यक्ति समूह से चला जाता है। नया औसत वजन ज्ञात कीजिए।`;
      if (kind === "sales") return `${count} दिनों की औसत बिक्री ${money(oldAverage)} है। ${money(removed)} बिक्री वाले दिन को गणना से निकाल दिया जाता है। नया दैनिक औसत ज्ञात कीजिए।`;
      return `${count} मानों का औसत ${oldAverage} है। इनमें से ${removed} हटाने पर नया औसत ज्ञात कीजिए।`;
    }
    if (pkg.solveMode === "findAddedMemberValueFromShift") {
      if (kind === "marks") return `${count} परीक्षाओं के अंकों का औसत ${oldAverage} है। अगली परीक्षा के अंक जोड़ने पर औसत ${newAverage} हो जाता है। अगली परीक्षा के अंक ज्ञात कीजिए।`;
      if (kind === "salary") return `${count} कर्मचारियों का औसत वेतन ${money(oldAverage)} है। एक नया कर्मचारी आने पर औसत वेतन ${money(newAverage)} हो जाता है। नए कर्मचारी का वेतन ज्ञात कीजिए।`;
      if (kind === "output") return `${count} मशीनों का औसत उत्पादन ${oldAverage} इकाइयाँ है। एक नई मशीन जुड़ने पर औसत ${newAverage} इकाइयाँ हो जाता है। नई मशीन का उत्पादन ज्ञात कीजिए।`;
      if (kind === "parcel") return `${count} पार्सलों का औसत वजन ${oldAverage} किग्रा है। एक पार्सल और जोड़ने पर औसत ${newAverage} किग्रा हो जाता है। नए पार्सल का वजन ज्ञात कीजिए।`;
      if (kind === "weight") return `${count} व्यक्तियों का औसत वजन ${oldAverage} किग्रा है। एक और व्यक्ति के शामिल होने पर औसत ${newAverage} किग्रा हो जाता है। उस व्यक्ति का वजन ज्ञात कीजिए।`;
      if (kind === "sales") return `${count} दिनों की औसत बिक्री ${money(oldAverage)} है। अगले दिन की बिक्री जोड़ने पर औसत ${money(newAverage)} हो जाता है। अगले दिन की बिक्री ज्ञात कीजिए।`;
      if (kind === "price") return `${count} कीमतों का औसत ${money(oldAverage)} है। एक और कीमत शामिल करने पर औसत ${money(newAverage)} हो जाता है। जोड़ी गई कीमत ज्ञात कीजिए।`;
      return `${count} मानों का औसत ${oldAverage} है। एक और मान जोड़ने पर औसत ${newAverage} हो जाता है। जोड़ा गया मान ज्ञात कीजिए।`;
    }
    if (pkg.solveMode === "findRemovedMemberValueFromShift") {
      if (kind === "marks") return `${count} परीक्षाओं के अंकों का औसत ${oldAverage} है। एक परीक्षा का परिणाम हटाने पर औसत ${newAverage} हो जाता है। हटाए गए अंक ज्ञात कीजिए।`;
      if (kind === "salary") return `${count} कर्मचारियों का औसत वेतन ${money(oldAverage)} है। एक कर्मचारी के जाने पर औसत वेतन ${money(newAverage)} हो जाता है। जाने वाले कर्मचारी का वेतन ज्ञात कीजिए।`;
      if (kind === "output") return `${count} मशीनों का औसत उत्पादन ${oldAverage} इकाइयाँ है। एक मशीन हटाने पर औसत ${newAverage} इकाइयाँ हो जाता है। हटाई गई मशीन का उत्पादन ज्ञात कीजिए।`;
      if (kind === "parcel") return `${count} पार्सलों का औसत वजन ${oldAverage} किग्रा है। एक पार्सल हटाने पर औसत ${newAverage} किग्रा हो जाता है। हटाए गए पार्सल का वजन ज्ञात कीजिए।`;
      if (kind === "weight") return `${count} व्यक्तियों का औसत वजन ${oldAverage} किग्रा है। एक व्यक्ति के जाने पर औसत ${newAverage} किग्रा हो जाता है। उस व्यक्ति का वजन ज्ञात कीजिए।`;
      if (kind === "sales") return `${count} दिनों की औसत बिक्री ${money(oldAverage)} है। एक दिन की बिक्री निकालने पर औसत ${money(newAverage)} हो जाता है। निकाली गई बिक्री ज्ञात कीजिए।`;
      if (kind === "price") return `${count} कीमतों का औसत ${money(oldAverage)} है। एक कीमत हटाने पर औसत ${money(newAverage)} हो जाता है। हटाई गई कीमत ज्ञात कीजिए।`;
      return `${count} मानों का औसत ${oldAverage} है। एक मान हटाने पर औसत ${newAverage} हो जाता है। हटाया गया मान ज्ञात कीजिए।`;
    }
    return pkg.stem;
  }

  if (pkg.solveMode === "findNewAverageAfterAddition") {
    if (kind === "marks") return `ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੇ ${count} ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ${added} ਅੰਕ ਮਿਲਣ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    if (kind === "salary") return `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ${money(oldAverage)} ਹੈ। ${money(added)} ਤਨਖਾਹ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਕਰਮਚਾਰੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।`;
    if (kind === "output") return `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ। ${added} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਇੱਕ ਹੋਰ ਮਸ਼ੀਨ ਜੋੜੀ ਜਾਂਦੀ ਹੈ। ਨਵਾਂ ਔਸਤ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "parcel") return `${count} ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ${added} ਕਿਲੋਗ੍ਰਾਮ ਦਾ ਇੱਕ ਹੋਰ ਪਾਰਸਲ ਜੋੜਨ ਉੱਤੇ ਨਵਾਂ ਔਸਤ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "weight") return `${count} ਵਿਅਕਤੀਆਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ${added} ਕਿਲੋਗ੍ਰਾਮ ਵਜ਼ਨ ਵਾਲਾ ਇੱਕ ਹੋਰ ਵਿਅਕਤੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ। ਨਵਾਂ ਔਸਤ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "sales") return `${count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ ${money(oldAverage)} ਹੈ। ਅਗਲੇ ਦਿਨ ਵਿਕਰੀ ${money(added)} ਹੁੰਦੀ ਹੈ। ਨਵੀਂ ਰੋਜ਼ਾਨਾ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    return `${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਇਸ ਵਿੱਚ ${added} ਜੋੜਨ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findNewAverageAfterRemoval") {
    if (kind === "marks") return `ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੇ ${count} ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ${removed} ਅੰਕਾਂ ਵਾਲੀ ਪ੍ਰੀਖਿਆ ਨੂੰ ਗਿਣਤੀ ਵਿੱਚੋਂ ਕੱਢਣ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    if (kind === "salary") return `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ${money(oldAverage)} ਹੈ। ${money(removed)} ਤਨਖਾਹ ਵਾਲਾ ਇੱਕ ਕਰਮਚਾਰੀ ਨੌਕਰੀ ਛੱਡ ਦਿੰਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।`;
    if (kind === "output") return `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ। ${removed} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਇੱਕ ਮਸ਼ੀਨ ਹਟਾ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਨਵਾਂ ਔਸਤ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "parcel") return `${count} ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ${removed} ਕਿਲੋਗ੍ਰਾਮ ਦਾ ਇੱਕ ਪਾਰਸਲ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਨਵਾਂ ਔਸਤ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "weight") return `${count} ਵਿਅਕਤੀਆਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ${removed} ਕਿਲੋਗ੍ਰਾਮ ਵਜ਼ਨ ਵਾਲਾ ਇੱਕ ਵਿਅਕਤੀ ਸਮੂਹ ਵਿੱਚੋਂ ਚਲਾ ਜਾਂਦਾ ਹੈ। ਨਵਾਂ ਔਸਤ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "sales") return `${count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ ${money(oldAverage)} ਹੈ। ${money(removed)} ਵਿਕਰੀ ਵਾਲੇ ਦਿਨ ਨੂੰ ਗਿਣਤੀ ਵਿੱਚੋਂ ਕੱਢ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਰੋਜ਼ਾਨਾ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    return `${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ${removed} ਹਟਾਉਣ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findAddedMemberValueFromShift") {
    if (kind === "marks") return `${count} ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ ਜੋੜਨ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਜਾਂਦੀ ਹੈ। ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ ਪਤਾ ਕਰੋ।`;
    if (kind === "salary") return `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ${money(oldAverage)} ਹੈ। ਇੱਕ ਨਵਾਂ ਕਰਮਚਾਰੀ ਆਉਣ ਉੱਤੇ ਔਸਤ ਤਨਖਾਹ ${money(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਨਵੇਂ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।`;
    if (kind === "output") return `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ। ਇੱਕ ਨਵੀਂ ਮਸ਼ੀਨ ਜੁੜਨ ਉੱਤੇ ਔਸਤ ${newAverage} ਇਕਾਈਆਂ ਹੋ ਜਾਂਦੀ ਹੈ। ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "parcel") return `${count} ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਇੱਕ ਹੋਰ ਪਾਰਸਲ ਜੋੜਨ ਉੱਤੇ ਔਸਤ ${newAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੋ ਜਾਂਦੀ ਹੈ। ਨਵੇਂ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "weight") return `${count} ਵਿਅਕਤੀਆਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਇੱਕ ਹੋਰ ਵਿਅਕਤੀ ਦੇ ਸ਼ਾਮਲ ਹੋਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੋ ਜਾਂਦੀ ਹੈ। ਉਸ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "sales") return `${count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ ${money(oldAverage)} ਹੈ। ਅਗਲੇ ਦਿਨ ਦੀ ਵਿਕਰੀ ਜੋੜਨ ਉੱਤੇ ਔਸਤ ${money(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਅਗਲੇ ਦਿਨ ਦੀ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।`;
    if (kind === "price") return `${count} ਕੀਮਤਾਂ ਦੀ ਔਸਤ ${money(oldAverage)} ਹੈ। ਇੱਕ ਹੋਰ ਕੀਮਤ ਸ਼ਾਮਲ ਕਰਨ ਉੱਤੇ ਔਸਤ ${money(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਜੋੜੀ ਗਈ ਕੀਮਤ ਪਤਾ ਕਰੋ।`;
    return `${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਇੱਕ ਹੋਰ ਮੁੱਲ ਜੋੜਨ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਜਾਂਦੀ ਹੈ। ਜੋੜਿਆ ਗਿਆ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findRemovedMemberValueFromShift") {
    if (kind === "marks") return `${count} ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਇੱਕ ਪ੍ਰੀਖਿਆ ਦਾ ਨਤੀਜਾ ਹਟਾਉਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਜਾਂਦੀ ਹੈ। ਹਟਾਏ ਗਏ ਅੰਕ ਪਤਾ ਕਰੋ।`;
    if (kind === "salary") return `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ${money(oldAverage)} ਹੈ। ਇੱਕ ਕਰਮਚਾਰੀ ਦੇ ਜਾਣ ਉੱਤੇ ਔਸਤ ਤਨਖਾਹ ${money(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਜਾਣ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।`;
    if (kind === "output") return `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ। ਇੱਕ ਮਸ਼ੀਨ ਹਟਾਉਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਇਕਾਈਆਂ ਹੋ ਜਾਂਦੀ ਹੈ। ਹਟਾਈ ਗਈ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "parcel") return `${count} ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਇੱਕ ਪਾਰਸਲ ਹਟਾਉਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੋ ਜਾਂਦੀ ਹੈ। ਹਟਾਏ ਗਏ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "weight") return `${count} ਵਿਅਕਤੀਆਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਇੱਕ ਵਿਅਕਤੀ ਦੇ ਜਾਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੋ ਜਾਂਦੀ ਹੈ। ਉਸ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "sales") return `${count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ ${money(oldAverage)} ਹੈ। ਇੱਕ ਦਿਨ ਦੀ ਵਿਕਰੀ ਕੱਢਣ ਉੱਤੇ ਔਸਤ ${money(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਕੱਢੀ ਗਈ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।`;
    if (kind === "price") return `${count} ਕੀਮਤਾਂ ਦੀ ਔਸਤ ${money(oldAverage)} ਹੈ। ਇੱਕ ਕੀਮਤ ਹਟਾਉਣ ਉੱਤੇ ਔਸਤ ${money(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਹਟਾਈ ਗਈ ਕੀਮਤ ਪਤਾ ਕਰੋ।`;
    return `${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਇੱਕ ਮੁੱਲ ਹਟਾਉਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਜਾਂਦੀ ਹੈ। ਹਟਾਇਆ ਗਿਆ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }
  return pkg.stem;
}

export function applyAvg001LocalizedStemQuality(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  let stem = pkg.stem;
  if (pkg.canonicalProblemId === "AVG-CP-001") stem = cp001Stem(pkg, language);
  else if (pkg.canonicalProblemId === "AVG-CP-002") stem = cp002Stem(pkg, language);
  else if (pkg.canonicalProblemId === "AVG-CP-003") stem = cp003NonAgeStem(pkg, language);
  return stem === pkg.stem ? pkg : { ...pkg, stem };
}
