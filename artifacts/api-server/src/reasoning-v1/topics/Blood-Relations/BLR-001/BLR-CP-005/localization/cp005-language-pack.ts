import type {
  BlrCp005Authority,
  BlrCp005CountSpec,
  BlrCp005LineageSide,
  BlrCp005RelationAnswerId,
  BlrCp005TruthStatus,
  GeneratedBlrCp005Question,
} from "../cp005-model";

export const BLR_CP005_LOCALIZATION_VERSION = "blr-cp005-hi-pa-localization-v1" as const;
export const BLR_CP005_MULTILINGUAL_RUNTIME_VERSION = "blr-cp005-model-space-multilingual-v1" as const;
export type BlrCp005TranslatedLocale = "hi-IN" | "pa-IN";

export function localeText(locale: BlrCp005TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

const RELATION_LABELS: Record<string, readonly [string, string]> = {
  FATHER: ["पिता", "ਪਿਤਾ"], MOTHER: ["माता", "ਮਾਤਾ"], SON: ["पुत्र", "ਪੁੱਤਰ"], DAUGHTER: ["पुत्री", "ਧੀ"],
  BROTHER: ["भाई", "ਭਰਾ"], SISTER: ["बहन", "ਭੈਣ"], HUSBAND: ["पति", "ਪਤੀ"], WIFE: ["पत्नी", "ਪਤਨੀ"],
  PARENT: ["माता-पिता", "ਮਾਤਾ-ਪਿਤਾ"], CHILD: ["संतान", "ਸੰਤਾਨ"], SIBLING: ["भाई या बहन", "ਭਰਾ ਜਾਂ ਭੈਣ"], SPOUSE: ["जीवनसाथी", "ਜੀਵਨਸਾਥੀ"],
  GRANDFATHER: ["दादा/नाना", "ਦਾਦਾ/ਨਾਨਾ"], GRANDMOTHER: ["दादी/नानी", "ਦਾਦੀ/ਨਾਨੀ"], GRANDPARENT: ["दादा-दादी/नाना-नानी", "ਦਾਦਾ-ਦਾਦੀ/ਨਾਨਾ-ਨਾਨੀ"],
  GRANDSON: ["पोता/नाती", "ਪੋਤਾ/ਨਾਤੀ"], GRANDDAUGHTER: ["पोती/नातिन", "ਪੋਤੀ/ਨਾਤਿਨ"], GRANDCHILD: ["पोता-पोती/नाती-नातिन", "ਪੋਤਾ-ਪੋਤੀ/ਨਾਤੀ-ਨਾਤਿਨ"],
  GREAT_GRANDFATHER: ["परदादा/परनाना", "ਪਰਦਾਦਾ/ਪਰਨਾਨਾ"], GREAT_GRANDMOTHER: ["परदादी/परनानी", "ਪਰਦਾਦੀ/ਪਰਨਾਨੀ"], GREAT_GRANDPARENT: ["परदादा-परदादी/परनाना-परनानी", "ਪਰਦਾਦਾ-ਪਰਦਾਦੀ/ਪਰਨਾਨਾ-ਪਰਨਾਨੀ"],
  GREAT_GRANDSON: ["परपोता/परनाती", "ਪਰਪੋਤਾ/ਪਰਨਾਤੀ"], GREAT_GRANDDAUGHTER: ["परपोती/परनातिन", "ਪਰਪੋਤੀ/ਪਰਨਾਤਿਨ"], GREAT_GRANDCHILD: ["परपोता-परपोती/परनाती-परनातिन", "ਪਰਪੋਤਾ-ਪਰਪੋਤੀ/ਪਰਨਾਤੀ-ਪਰਨਾਤਿਨ"],
  UNCLE: ["चाचा/मामा", "ਚਾਚਾ/ਮਾਮਾ"], AUNT: ["बुआ/मौसी", "ਭੂਆ/ਮਾਸੀ"], UNCLE_OR_AUNT: ["चाचा/मामा या बुआ/मौसी", "ਚਾਚਾ/ਮਾਮਾ ਜਾਂ ਭੂਆ/ਮਾਸੀ"],
  NEPHEW: ["भतीजा/भांजा", "ਭਤੀਜਾ/ਭਾਣਜਾ"], NIECE: ["भतीजी/भांजी", "ਭਤੀਜੀ/ਭਾਣਜੀ"], NEPHEW_OR_NIECE: ["भतीजा/भांजा या भतीजी/भांजी", "ਭਤੀਜਾ/ਭਾਣਜਾ ਜਾਂ ਭਤੀਜੀ/ਭਾਣਜੀ"],
  COUSIN: ["कज़िन", "ਕਜ਼ਨ"],
  FATHER_IN_LAW: ["ससुर", "ਸਹੁਰਾ"], MOTHER_IN_LAW: ["सास", "ਸੱਸ"], PARENT_IN_LAW: ["सास या ससुर", "ਸੱਸ ਜਾਂ ਸਹੁਰਾ"],
  SON_IN_LAW: ["दामाद", "ਜਵਾਈ"], DAUGHTER_IN_LAW: ["बहू", "ਨੂੰਹ"], CHILD_IN_LAW: ["दामाद या बहू", "ਜਵਾਈ ਜਾਂ ਨੂੰਹ"],
  BROTHER_IN_LAW: ["बहनोई/साला/देवर/जेठ", "ਜੀਜਾ/ਸਾਲਾ/ਦੇਵਰ/ਜੇਠ"], SISTER_IN_LAW: ["भाभी/साली/ननद", "ਭਾਬੀ/ਸਾਲੀ/ਨਣਦ"], SIBLING_IN_LAW: ["विवाह से भाई या बहन", "ਵਿਆਹ ਰਾਹੀਂ ਭਰਾ ਜਾਂ ਭੈਣ"],
};

export function localizedRelationLabel(
  relationId: BlrCp005RelationAnswerId | string,
  locale: BlrCp005TranslatedLocale,
): string {
  const pair = RELATION_LABELS[relationId];
  if (!pair) throw new Error(`CP-005 localization: unsupported relation ${relationId}.`);
  return locale === "hi-IN" ? pair[0] : pair[1];
}

export function localizedTruthStatus(status: BlrCp005TruthStatus, locale: BlrCp005TranslatedLocale): string {
  if (status === "DEFINITE") return localeText(locale, "निश्चित", "ਨਿਸ਼ਚਿਤ");
  if (status === "POSSIBLE") return localeText(locale, "संभव", "ਸੰਭਵ");
  return localeText(locale, "असंभव", "ਅਸੰਭਵ");
}

export function localizedCannotDetermine(locale: BlrCp005TranslatedLocale): string {
  return localeText(locale, "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ");
}

export function localizedLineageSide(side: BlrCp005LineageSide, locale: BlrCp005TranslatedLocale): string {
  if (side === "PATERNAL") return localeText(locale, "पिता की ओर से", "ਪਿਤਾ ਵਾਲੇ ਪਾਸੇ ਤੋਂ");
  if (side === "MATERNAL") return localeText(locale, "माता की ओर से", "ਮਾਤਾ ਵਾਲੇ ਪਾਸੇ ਤੋਂ");
  return localeText(locale, "पक्ष निर्दिष्ट नहीं", "ਪਾਸਾ ਨਿਰਧਾਰਤ ਨਹੀਂ");
}

export function localizedCountDescription(
  spec: BlrCp005CountSpec,
  locale: BlrCp005TranslatedLocale,
  nameFor: (id: string) => string,
): string {
  if (spec.kind === "TOTAL_MEMBERS") return localeText(locale, "परिवार के कुल सदस्यों की संख्या", "ਪਰਿਵਾਰ ਦੇ ਕੁੱਲ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ");
  if (spec.kind === "GENDER") {
    return spec.gender === "MALE"
      ? localeText(locale, "पुरुष सदस्यों की संख्या", "ਪੁਰਸ਼ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ")
      : localeText(locale, "महिला सदस्यों की संख्या", "ਮਹਿਲਾ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ");
  }
  if (spec.kind === "CHILDREN_OF") {
    return localeText(locale, `${nameFor(spec.parentId)} की संतानों की संख्या`, `${nameFor(spec.parentId)} ਦੀਆਂ ਸੰਤਾਨਾਂ ਦੀ ਗਿਣਤੀ`);
  }
  if (spec.kind === "RELATIVES_OF") {
    const relation = localizedRelationLabel(spec.relationId, locale);
    return localeText(locale, `${nameFor(spec.referenceId)} के ${relation} की संख्या`, `${nameFor(spec.referenceId)} ਦੇ ${relation} ਦੀ ਗਿਣਤੀ`);
  }
  return localeText(locale, "विवाहित जोड़ों की संख्या", "ਵਿਆਹੇ ਜੋੜਿਆਂ ਦੀ ਗਿਣਤੀ");
}

export function localizedCoreConcept(
  authority: BlrCp005Authority,
  locale: BlrCp005TranslatedLocale,
): readonly string[] {
  switch (authority) {
    case "RESOLVE_INVARIANT_RELATION": return [
      localeText(locale, "दिए गए संकेतों से बनने वाले हर वैध परिवार-मॉडल को देखें; नाम देखकर लिंग, पक्ष या रास्ता स्वयं न मानें।", "ਦਿੱਤੇ ਸੰਕੇਤਾਂ ਤੋਂ ਬਣਦੇ ਹਰ ਵੈਧ ਪਰਿਵਾਰਕ ਮਾਡਲ ਨੂੰ ਵੇਖੋ; ਨਾਮ ਦੇ ਆਧਾਰ ’ਤੇ ਲਿੰਗ, ਪਾਸਾ ਜਾਂ ਰਸਤਾ ਆਪਣੇ ਆਪ ਨਾ ਮੰਨੋ।"),
      localeText(locale, "सटीक संबंध तभी निश्चित है जब हर मॉडल में वही संबंध रहे; अलग सटीक संबंधों का एक साझा व्यापक संबंध हो तो वही उत्तर लें।", "ਸਟੀਕ ਰਿਸ਼ਤਾ ਤਦੋਂ ਹੀ ਨਿਸ਼ਚਿਤ ਹੈ ਜਦੋਂ ਹਰ ਮਾਡਲ ਵਿੱਚ ਉਹੀ ਰਿਸ਼ਤਾ ਰਹੇ; ਵੱਖਰੇ ਸਟੀਕ ਰਿਸ਼ਤਿਆਂ ਦਾ ਇੱਕ ਸਾਂਝਾ ਵਿਆਪਕ ਰਿਸ਼ਤਾ ਹੋਵੇ ਤਾਂ ਉਹੀ ਉੱਤਰ ਲਵੋ।"),
    ];
    case "RESOLVE_RELATION_UNCERTAINTY": return [
      localeText(locale, "हर वैध मॉडल में मिलने वाला सटीक संबंध अलग-अलग लिखें।", "ਹਰ ਵੈਧ ਮਾਡਲ ਵਿੱਚ ਮਿਲਦਾ ਸਟੀਕ ਰਿਸ਼ਤਾ ਵੱਖ-ਵੱਖ ਲਿਖੋ।"),
      localeText(locale, "ठीक दो परिणाम बचें तो ‘X या Y’ उत्तर दें; तीन या अधिक अलग परिणाम बचें तो सटीक संबंध निर्धारित नहीं किया जा सकता।", "ਠੀਕ ਦੋ ਨਤੀਜੇ ਬਚਣ ਤਾਂ ‘X ਜਾਂ Y’ ਉੱਤਰ ਦਿਓ; ਤਿੰਨ ਜਾਂ ਵੱਧ ਵੱਖਰੇ ਨਤੀਜੇ ਬਚਣ ਤਾਂ ਸਟੀਕ ਰਿਸ਼ਤਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।"),
    ];
    case "SELECT_CLAIM_BY_MODEL_STATUS": return [
      localeText(locale, "निश्चित = हर वैध मॉडल में सत्य; संभव = कुछ लेकिन सभी मॉडलों में नहीं; असंभव = किसी भी मॉडल में सत्य नहीं।", "ਨਿਸ਼ਚਿਤ = ਹਰ ਵੈਧ ਮਾਡਲ ਵਿੱਚ ਸੱਚ; ਸੰਭਵ = ਕੁਝ ਪਰ ਸਾਰੇ ਮਾਡਲਾਂ ਵਿੱਚ ਨਹੀਂ; ਅਸੰਭਵ = ਕਿਸੇ ਵੀ ਮਾਡਲ ਵਿੱਚ ਸੱਚ ਨਹੀਂ।"),
      localeText(locale, "हर विकल्प को पूरे मॉडल-समूह पर जांचें, केवल पहले सुविधाजनक चित्र पर नहीं।", "ਹਰ ਵਿਕਲਪ ਨੂੰ ਪੂਰੇ ਮਾਡਲ-ਸਮੂਹ ’ਤੇ ਜਾਂਚੋ, ਕੇਵਲ ਪਹਿਲੇ ਸੁਖਾਵੇਂ ਚਿੱਤਰ ’ਤੇ ਨਹੀਂ।"),
    ];
    case "IDENTIFY_PERSON_BY_MODEL_STATUS": return [
      localeText(locale, "हर नामित उम्मीदवार को हर वैध मॉडल में अलग से जांचें।", "ਹਰ ਨਾਮਿਤ ਉਮੀਦਵਾਰ ਨੂੰ ਹਰ ਵੈਧ ਮਾਡਲ ਵਿੱਚ ਵੱਖਰੇ ਤੌਰ ’ਤੇ ਜਾਂਚੋ।"),
      localeText(locale, "हर मॉडल में मेल = निश्चित; कुछ मॉडलों में मेल = संभव; किसी में भी मेल नहीं = असंभव।", "ਹਰ ਮਾਡਲ ਵਿੱਚ ਮੇਲ = ਨਿਸ਼ਚਿਤ; ਕੁਝ ਮਾਡਲਾਂ ਵਿੱਚ ਮੇਲ = ਸੰਭਵ; ਕਿਸੇ ਵਿੱਚ ਵੀ ਮੇਲ ਨਹੀਂ = ਅਸੰਭਵ।"),
    ];
    case "RESOLVE_PERSON_IDENTITY_UNCERTAINTY": return [
      localeText(locale, "मांगी गई भूमिका निभा सकने वाले सभी नामित व्यक्तियों का पूरा समूह बनाएं।", "ਮੰਗੀ ਭੂਮਿਕਾ ਨਿਭਾ ਸਕਣ ਵਾਲੇ ਸਾਰੇ ਨਾਮਿਤ ਵਿਅਕਤੀਆਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਬਣਾਓ।"),
      localeText(locale, "दो पहचान बचें तो सटीक ‘एक या दूसरा’ उत्तर मिलता है; तीन या अधिक बचें तो पहचान निर्धारित नहीं होती।", "ਦੋ ਪਛਾਣਾਂ ਬਚਣ ਤਾਂ ਸਟੀਕ ‘ਇੱਕ ਜਾਂ ਦੂਜਾ’ ਉੱਤਰ ਮਿਲਦਾ ਹੈ; ਤਿੰਨ ਜਾਂ ਵੱਧ ਬਚਣ ਤਾਂ ਪਛਾਣ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦੀ।"),
    ];
    case "DETERMINE_COUNT_BOUND": return [
      localeText(locale, "हर वैध मॉडल में उसी वस्तु/समूह की गणना करें।", "ਹਰ ਵੈਧ ਮਾਡਲ ਵਿੱਚ ਉਸੇ ਇਕਾਈ/ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਕਰੋ।"),
      localeText(locale, "न्यूनतम सबसे छोटी संभव संख्या और अधिकतम सबसे बड़ी संभव संख्या है; एक ही चित्र से अनुमान न लगाएं।", "ਘੱਟੋ-ਘੱਟ ਸਭ ਤੋਂ ਛੋਟੀ ਸੰਭਵ ਗਿਣਤੀ ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਸਭ ਤੋਂ ਵੱਡੀ ਸੰਭਵ ਗਿਣਤੀ ਹੈ; ਇੱਕੋ ਚਿੱਤਰ ਤੋਂ ਅਨੁਮਾਨ ਨਾ ਲਗਾਓ।"),
    ];
    case "SELECT_COUNT_BY_MODEL_STATUS": return [
      localeText(locale, "जो संख्या कम-से-कम एक वैध मॉडल में आती है वह संभव है; जो किसी मॉडल में नहीं आती वह असंभव है।", "ਜੋ ਗਿਣਤੀ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਮਾਡਲ ਵਿੱਚ ਆਉਂਦੀ ਹੈ ਉਹ ਸੰਭਵ ਹੈ; ਜੋ ਕਿਸੇ ਮਾਡਲ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੀ ਉਹ ਅਸੰਭਵ ਹੈ।"),
      localeText(locale, "हर मॉडल में गिनी जाने वाली श्रेणी एक ही रखें।", "ਹਰ ਮਾਡਲ ਵਿੱਚ ਗਿਣੀ ਜਾਣ ਵਾਲੀ ਸ਼੍ਰੇਣੀ ਇੱਕੋ ਰੱਖੋ।"),
    ];
    case "RESOLVE_COUNT_DETERMINACY": return [
      localeText(locale, "हर वैध मॉडल में मांगी गई संख्या स्वतंत्र रूप से निकालें।", "ਹਰ ਵੈਧ ਮਾਡਲ ਵਿੱਚ ਮੰਗੀ ਗਿਣਤੀ ਵੱਖਰੇ ਤੌਰ ’ਤੇ ਕੱਢੋ।"),
      localeText(locale, "सभी मॉडल एक ही संख्या दें तभी सटीक संख्या निश्चित है; अलग संख्याएँ आएँ तो निर्धारित नहीं किया जा सकता।", "ਸਾਰੇ ਮਾਡਲ ਇੱਕੋ ਗਿਣਤੀ ਦੇਣ ਤਾਂ ਹੀ ਸਟੀਕ ਗਿਣਤੀ ਨਿਸ਼ਚਿਤ ਹੈ; ਵੱਖਰੀਆਂ ਗਿਣਤੀਆਂ ਆਉਣ ਤਾਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।"),
    ];
  }
}

export function localizedShortcut(authority: BlrCp005Authority, locale: BlrCp005TranslatedLocale): string {
  if (authority.includes("COUNT")) return localeText(locale, "हर वैध मॉडल की संख्या एक पंक्ति में लिखें; फिर न्यूनतम, अधिकतम, संभवता या समानता सीधे पढ़ें।", "ਹਰ ਵੈਧ ਮਾਡਲ ਦੀ ਗਿਣਤੀ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਲਿਖੋ; ਫਿਰ ਘੱਟੋ-ਘੱਟ, ਵੱਧ ਤੋਂ ਵੱਧ, ਸੰਭਾਵਨਾ ਜਾਂ ਸਮਾਨਤਾ ਸਿੱਧੀ ਪੜ੍ਹੋ।");
  if (authority.includes("PERSON")) return localeText(locale, "हर उम्मीदवार के लिए एक कॉलम बनाएं और जिस मॉडल में वह भूमिका निभाता है वहाँ ✓ लगाएं।", "ਹਰ ਉਮੀਦਵਾਰ ਲਈ ਇੱਕ ਕਾਲਮ ਬਣਾਓ ਅਤੇ ਜਿਸ ਮਾਡਲ ਵਿੱਚ ਉਹ ਭੂਮਿਕਾ ਨਿਭਾਉਂਦਾ ਹੈ ਉੱਥੇ ✓ ਲਗਾਓ।");
  return localeText(locale, "तीन-स्थिति तालिका रखें: सभी मॉडल = निश्चित, कुछ मॉडल = संभव, कोई मॉडल नहीं = असंभव।", "ਤਿੰਨ-ਸਥਿਤੀ ਸਾਰਣੀ ਰੱਖੋ: ਸਾਰੇ ਮਾਡਲ = ਨਿਸ਼ਚਿਤ, ਕੁਝ ਮਾਡਲ = ਸੰਭਵ, ਕੋਈ ਮਾਡਲ ਨਹੀਂ = ਅਸੰਭਵ।");
}

export function localizedStem(
  record: GeneratedBlrCp005Question,
  locale: BlrCp005TranslatedLocale,
  nameFor: (id: string) => string,
): string {
  const query = record.querySpec;
  if (query.kind === "INVARIANT_RELATION" || query.kind === "RELATION_UNCERTAINTY") {
    return localeText(locale, `${nameFor(query.subjectId)} का ${nameFor(query.referenceId)} से क्या संबंध है?`, `${nameFor(query.subjectId)} ਦਾ ${nameFor(query.referenceId)} ਨਾਲ ਕੀ ਰਿਸ਼ਤਾ ਹੈ?`);
  }
  if (query.kind === "CLAIM_STATUS") {
    if (query.requestedStatus === "DEFINITE") return localeText(locale, "निम्नलिखित में से कौन-सा कथन निश्चित रूप से सत्य है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਸੱਚ ਹੈ?");
    if (query.requestedStatus === "POSSIBLE") return localeText(locale, "निम्नलिखित में से कौन-सा कथन संभव है, लेकिन निश्चित नहीं?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ?");
    return localeText(locale, "निम्नलिखित में से कौन-सा कथन असंभव है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਅਸੰਭਵ ਹੈ?");
  }
  if (query.kind === "PERSON_STATUS") {
    const relation = localizedRelationLabel(query.relationId, locale);
    if (query.requestedStatus === "DEFINITE") return localeText(locale, `${nameFor(query.referenceId)} का ${relation} निश्चित रूप से कौन है?`, `${nameFor(query.referenceId)} ਦਾ ${relation} ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਕੌਣ ਹੈ?`);
    if (query.requestedStatus === "POSSIBLE") return localeText(locale, `${nameFor(query.referenceId)} का ${relation} कौन हो सकता है?`, `${nameFor(query.referenceId)} ਦਾ ${relation} ਕੌਣ ਹੋ ਸਕਦਾ ਹੈ?`);
    return localeText(locale, `${nameFor(query.referenceId)} का ${relation} कौन नहीं हो सकता?`, `${nameFor(query.referenceId)} ਦਾ ${relation} ਕੌਣ ਨਹੀਂ ਹੋ ਸਕਦਾ?`);
  }
  if (query.kind === "PERSON_UNCERTAINTY") {
    const relation = localizedRelationLabel(query.relationId, locale);
    return localeText(locale, `${nameFor(query.referenceId)} का ${relation} कौन है?`, `${nameFor(query.referenceId)} ਦਾ ${relation} ਕੌਣ ਹੈ?`);
  }
  const count = localizedCountDescription(query.countSpec, locale, nameFor);
  if (query.kind === "COUNT_BOUND") {
    return query.bound === "MINIMUM"
      ? localeText(locale, `${count} की न्यूनतम संभव मान क्या है?`, `${count} ਦਾ ਘੱਟੋ-ਘੱਟ ਸੰਭਵ ਮੁੱਲ ਕੀ ਹੈ?`)
      : localeText(locale, `${count} की अधिकतम संभव मान क्या है?`, `${count} ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ ਸੰਭਵ ਮੁੱਲ ਕੀ ਹੈ?`);
  }
  if (query.kind === "COUNT_STATUS") {
    return query.requestedStatus === "POSSIBLE"
      ? localeText(locale, `${count} के लिए कौन-सी संख्या संभव हो सकती है?`, `${count} ਲਈ ਕਿਹੜੀ ਗਿਣਤੀ ਸੰਭਵ ਹੋ ਸਕਦੀ ਹੈ?`)
      : localeText(locale, `${count} के लिए कौन-सी संख्या संभव नहीं है?`, `${count} ਲਈ ਕਿਹੜੀ ਗਿਣਤੀ ਸੰਭਵ ਨਹੀਂ ਹੈ?`);
  }
  return localeText(locale, `${count} का सटीक मान क्या है?`, `${count} ਦਾ ਸਟੀਕ ਮੁੱਲ ਕੀ ਹੈ?`);
}
