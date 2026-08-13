import type {
  BlrCp006Authority,
  BlrCp006DirectRelation,
  BlrCp006Relation,
} from "../cp006-model";

export const BLR_CP006_LOCALIZATION_VERSION = "blr-cp006-hi-pa-localization-v1" as const;
export const BLR_CP006_MULTILINGUAL_RUNTIME_VERSION = "blr-cp006-coded-decoding-multilingual-v1" as const;
export type BlrCp006TranslatedLocale = "hi-IN" | "pa-IN";

export function localeText(locale: BlrCp006TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

const RELATION_LABELS: Record<BlrCp006Relation, readonly [string, string]> = {
  FATHER: ["पिता", "ਪਿਤਾ"],
  MOTHER: ["माता", "ਮਾਤਾ"],
  SON: ["पुत्र", "ਪੁੱਤਰ"],
  DAUGHTER: ["पुत्री", "ਧੀ"],
  BROTHER: ["भाई", "ਭਰਾ"],
  SISTER: ["बहन", "ਭੈਣ"],
  HUSBAND: ["पति", "ਪਤੀ"],
  WIFE: ["पत्नी", "ਪਤਨੀ"],
  PARENT: ["माता-पिता", "ਮਾਤਾ-ਪਿਤਾ"],
  CHILD: ["संतान", "ਸੰਤਾਨ"],
  SIBLING: ["भाई या बहन", "ਭਰਾ ਜਾਂ ਭੈਣ"],
  SPOUSE: ["जीवनसाथी", "ਜੀਵਨਸਾਥੀ"],
  GRANDFATHER: ["दादा/नाना", "ਦਾਦਾ/ਨਾਨਾ"],
  GRANDMOTHER: ["दादी/नानी", "ਦਾਦੀ/ਨਾਨੀ"],
  GRANDPARENT: ["दादा-दादी/नाना-नानी", "ਦਾਦਾ-ਦਾਦੀ/ਨਾਨਾ-ਨਾਨੀ"],
  GRANDSON: ["पोता/नाती", "ਪੋਤਾ/ਨਾਤੀ"],
  GRANDDAUGHTER: ["पोती/नातिन", "ਪੋਤੀ/ਨਾਤਿਨ"],
  GRANDCHILD: ["पोता-पोती/नाती-नातिन", "ਪੋਤਾ-ਪੋਤੀ/ਨਾਤੀ-ਨਾਤਿਨ"],
  UNCLE: ["चाचा/मामा", "ਚਾਚਾ/ਮਾਮਾ"],
  AUNT: ["बुआ/मौसी", "ਭੂਆ/ਮਾਸੀ"],
  UNCLE_OR_AUNT: ["चाचा/मामा या बुआ/मौसी", "ਚਾਚਾ/ਮਾਮਾ ਜਾਂ ਭੂਆ/ਮਾਸੀ"],
  NEPHEW: ["भतीजा/भांजा", "ਭਤੀਜਾ/ਭਾਣਜਾ"],
  NIECE: ["भतीजी/भांजी", "ਭਤੀਜੀ/ਭਾਣਜੀ"],
  NEPHEW_OR_NIECE: ["भतीजा/भांजा या भतीजी/भांजी", "ਭਤੀਜਾ/ਭਾਣਜਾ ਜਾਂ ਭਤੀਜੀ/ਭਾਣਜੀ"],
  COUSIN: ["कज़िन", "ਕਜ਼ਨ"],
  FATHER_IN_LAW: ["ससुर", "ਸਹੁਰਾ"],
  MOTHER_IN_LAW: ["सास", "ਸੱਸ"],
  PARENT_IN_LAW: ["सास या ससुर", "ਸੱਸ ਜਾਂ ਸਹੁਰਾ"],
  SON_IN_LAW: ["दामाद", "ਜਵਾਈ"],
  DAUGHTER_IN_LAW: ["बहू", "ਨੂੰਹ"],
  CHILD_IN_LAW: ["दामाद या बहू", "ਜਵਾਈ ਜਾਂ ਨੂੰਹ"],
  BROTHER_IN_LAW: ["बहनोई/साला/देवर/जेठ", "ਜੀਜਾ/ਸਾਲਾ/ਦੇਵਰ/ਜੇਠ"],
  SISTER_IN_LAW: ["भाभी/साली/ननद", "ਭਾਬੀ/ਸਾਲੀ/ਨਣਦ"],
  SIBLING_IN_LAW: ["विवाह से भाई या बहन", "ਵਿਆਹ ਰਾਹੀਂ ਭਰਾ ਜਾਂ ਭੈਣ"],
};

export function localizedRelationLabel(
  relationId: BlrCp006Relation,
  locale: BlrCp006TranslatedLocale,
): string {
  const pair = RELATION_LABELS[relationId];
  return locale === "hi-IN" ? pair[0] : pair[1];
}

export function localizedDirectRelationSentence(
  leftId: string,
  relationId: BlrCp006DirectRelation,
  rightId: string,
  locale: BlrCp006TranslatedLocale,
): string {
  const relation = localizedRelationLabel(relationId, locale);
  return localeText(
    locale,
    `${leftId}, ${rightId} का ${relation} है।`,
    `${leftId}, ${rightId} ਦਾ ${relation} ਹੈ।`,
  );
}

export function localizedGenderLabel(value: string, locale: BlrCp006TranslatedLocale): string {
  if (value === "Male") return localeText(locale, "पुरुष", "ਪੁਰਸ਼");
  if (value === "Female") return localeText(locale, "महिला", "ਮਹਿਲਾ");
  if (value === "Cannot be determined") {
    return localeText(locale, "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ");
  }
  if (value === "The statements are contradictory") {
    return localeText(locale, "कथन परस्पर विरोधी हैं", "ਕਥਨ ਆਪਸ ਵਿੱਚ ਵਿਰੋਧੀ ਹਨ");
  }
  throw new Error(`CP-006 localization: unsupported gender option ${value}.`);
}

export function localizedCoreConcept(
  authority: BlrCp006Authority,
  locale: BlrCp006TranslatedLocale,
): readonly string[] {
  if (authority === "RESOLVE_CODED_RELATION" || authority === "RESOLVE_CODED_FAMILY_SET_RELATION") {
    return [
      localeText(locale, "परिवार का रास्ता देखने से पहले हर संकेत को उसके दिए गए दिशात्मक संबंध से बदलें।", "ਪਰਿਵਾਰਕ ਰਸਤਾ ਵੇਖਣ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਸੰਕੇਤ ਨੂੰ ਉਸਦੇ ਦਿੱਤੇ ਦਿਸ਼ਾਤਮਕ ਸੰਬੰਧ ਨਾਲ ਬਦਲੋ।"),
      localeText(locale, "हर पास-पास की कूटित जोड़ी को अलग पारिवारिक कथन मानें; सामान्य गणितीय प्राथमिकता यहाँ लागू नहीं होती।", "ਹਰ ਨਾਲ-ਨਾਲ ਕੋਡਿਤ ਜੋੜੀ ਨੂੰ ਵੱਖਰਾ ਪਰਿਵਾਰਕ ਕਥਨ ਮੰਨੋ; ਆਮ ਗਣਿਤੀ ਤਰਜੀਹ ਇੱਥੇ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦੀ।"),
    ];
  }
  if (authority === "IDENTIFY_PERSON_FROM_CODED_GRAPH") {
    return [
      localeText(locale, "पहले पूरा परिवार-ग्राफ खोलें, फिर हर उम्मीदवार को पूछे गए संबंध से जाँचें।", "ਪਹਿਲਾਂ ਪੂਰਾ ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ ਖੋਲ੍ਹੋ, ਫਿਰ ਹਰ ਉਮੀਦਵਾਰ ਨੂੰ ਪੁੱਛੇ ਗਏ ਸੰਬੰਧ ਨਾਲ ਜਾਂਚੋ।"),
      localeText(locale, "सही व्यक्ति वही है जिसका पूरा रास्ता और प्रश्न की दिशा दोनों मेल खाते हैं।", "ਸਹੀ ਵਿਅਕਤੀ ਉਹੀ ਹੈ ਜਿਸਦਾ ਪੂਰਾ ਰਸਤਾ ਅਤੇ ਪ੍ਰਸ਼ਨ ਦੀ ਦਿਸ਼ਾ ਦੋਵੇਂ ਮੇਲ ਖਾਂਦੇ ਹਨ।"),
    ];
  }
  if (authority === "DETERMINE_GENDER_FROM_CODED_GRAPH") {
    return [
      localeText(locale, "लिंग केवल पिता, माता, भाई, बहन, पति, पत्नी जैसे खुले हुए संबंधों से तय करें।", "ਲਿੰਗ ਕੇਵਲ ਪਿਤਾ, ਮਾਤਾ, ਭਰਾ, ਭੈਣ, ਪਤੀ, ਪਤਨੀ ਵਰਗੇ ਖੁੱਲ੍ਹੇ ਹੋਏ ਸੰਬੰਧਾਂ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।"),
      localeText(locale, "अक्षर या व्यक्ति का नाम अपने-आप लिंग का प्रमाण नहीं है।", "ਅੱਖਰ ਜਾਂ ਵਿਅਕਤੀ ਦਾ ਨਾਮ ਆਪਣੇ ਆਪ ਲਿੰਗ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ।"),
    ];
  }
  return [
    localeText(locale, "सभी कथनों को एक बार खोलें और बने परिवार-ग्राफ पर प्रत्येक दी गई जोड़ी का संबंध पहचानें।", "ਸਾਰੇ ਕਥਨਾਂ ਨੂੰ ਇੱਕ ਵਾਰ ਖੋਲ੍ਹੋ ਅਤੇ ਬਣੇ ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ ਉੱਤੇ ਹਰ ਦਿੱਤੀ ਜੋੜੀ ਦਾ ਸੰਬੰਧ ਪਛਾਣੋ।"),
    localeText(locale, "जोड़ी का क्रम तभी अनदेखा करें जब माँगा गया संबंध स्वयं सममित हो, जैसे भाई-बहन या जीवनसाथी।", "ਜੋੜੀ ਦਾ ਕ੍ਰਮ ਤਦੋਂ ਹੀ ਅਣਡਿੱਠਾ ਕਰੋ ਜਦੋਂ ਮੰਗਿਆ ਸੰਬੰਧ ਆਪ ਸਮਮਿਤ ਹੋਵੇ, ਜਿਵੇਂ ਭਰਾ-ਭੈਣ ਜਾਂ ਜੀਵਨਸਾਥੀ।"),
  ];
}

export function localizedShortcut(
  authority: BlrCp006Authority,
  locale: BlrCp006TranslatedLocale,
): string {
  if (authority === "DETERMINE_GENDER_FROM_CODED_GRAPH") {
    return localeText(locale, "लक्ष्य व्यक्ति को घेरें और केवल उससे जुड़ा खुला लिंग-सूचक संबंध देखें; अक्षर से लिंग न मानें।", "ਲਕਸ਼ ਵਿਅਕਤੀ ਨੂੰ ਘੇਰੋ ਅਤੇ ਕੇਵਲ ਉਸ ਨਾਲ ਜੁੜਿਆ ਖੁੱਲ੍ਹਾ ਲਿੰਗ-ਸੂਚਕ ਸੰਬੰਧ ਵੇਖੋ; ਅੱਖਰ ਤੋਂ ਲਿੰਗ ਨਾ ਮੰਨੋ।");
  }
  if (authority === "SELECT_CODED_RELATION_PAIR") {
    return localeText(locale, "छोटे कथनों को खोलकर माता-पिता-संतान, भाई-बहन और विवाह के संबंध चिन्हित करें, फिर माँगी गई जोड़ी चुनें।", "ਛੋਟੇ ਕਥਨਾਂ ਨੂੰ ਖੋਲ੍ਹ ਕੇ ਮਾਤਾ-ਪਿਤਾ-ਸੰਤਾਨ, ਭਰਾ-ਭੈਣ ਅਤੇ ਵਿਆਹ ਦੇ ਸੰਬੰਧ ਨਿਸ਼ਾਨਿਤ ਕਰੋ, ਫਿਰ ਮੰਗੀ ਜੋੜੀ ਚੁਣੋ।");
  }
  if (authority === "IDENTIFY_PERSON_FROM_CODED_GRAPH") {
    return localeText(locale, "हर उम्मीदवार के पास उसका खुला संबंध लिखें और गलत पीढ़ी, दिशा या लिंग वाले विकल्प हटाएँ।", "ਹਰ ਉਮੀਦਵਾਰ ਕੋਲ ਉਸਦਾ ਖੁੱਲ੍ਹਾ ਸੰਬੰਧ ਲਿਖੋ ਅਤੇ ਗਲਤ ਪੀੜ੍ਹੀ, ਦਿਸ਼ਾ ਜਾਂ ਲਿੰਗ ਵਾਲੇ ਵਿਕਲਪ ਹਟਾਓ।");
  }
  return localeText(locale, "पहले कोड को संबंध-तीरों में बदलें, फिर केवल पूछे गए व्यक्ति से संदर्भ व्यक्ति तक रास्ता देखें।", "ਪਹਿਲਾਂ ਕੋਡ ਨੂੰ ਸੰਬੰਧ-ਤੀਰਾਂ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਕੇਵਲ ਪੁੱਛੇ ਵਿਅਕਤੀ ਤੋਂ ਹਵਾਲਾ ਵਿਅਕਤੀ ਤੱਕ ਰਸਤਾ ਵੇਖੋ।");
}
