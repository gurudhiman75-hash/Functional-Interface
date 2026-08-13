import type {
  BlrCp006Authority,
  BlrCp006DirectRelation,
  BlrCp006Relation,
} from "../cp006-model";

export const BLR_CP006_LOCALIZATION_VERSION = "blr-cp006-hi-pa-localization-v2" as const;
export const BLR_CP006_MULTILINGUAL_RUNTIME_VERSION = "blr-cp006-coded-decoding-multilingual-v2" as const;
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
  PARENT: ["माता या पिता", "ਮਾਤਾ ਜਾਂ ਪਿਤਾ"],
  CHILD: ["संतान", "ਸੰਤਾਨ"],
  SIBLING: ["भाई या बहन", "ਭਰਾ ਜਾਂ ਭੈਣ"],
  SPOUSE: ["जीवनसाथी", "ਜੀਵਨਸਾਥੀ"],
  GRANDFATHER: ["दादा/नाना", "ਦਾਦਾ/ਨਾਨਾ"],
  GRANDMOTHER: ["दादी/नानी", "ਦਾਦੀ/ਨਾਨੀ"],
  GRANDPARENT: ["दादा/दादी/नाना/नानी", "ਦਾਦਾ/ਦਾਦੀ/ਨਾਨਾ/ਨਾਨੀ"],
  GRANDSON: ["पोता/नाती", "ਪੋਤਾ/ਨਾਤੀ"],
  GRANDDAUGHTER: ["पोती/नातिन", "ਪੋਤੀ/ਨਾਤਿਨ"],
  GRANDCHILD: ["पोता/पोती/नाती/नातिन", "ਪੋਤਾ/ਪੋਤੀ/ਨਾਤੀ/ਨਾਤਿਨ"],
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
      localeText(
        locale,
        "रिश्ते की श्रृंखला निकालने से पहले प्रत्येक कूट-चिह्न का अर्थ दिए गए संबंध के अनुसार लिखें।",
        "ਰਿਸ਼ਤੇ ਦੀ ਲੜੀ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਕੋਡ-ਚਿੰਨ੍ਹ ਦਾ ਅਰਥ ਦਿੱਤੇ ਸੰਬੰਧ ਅਨੁਸਾਰ ਲਿਖੋ।",
      ),
      localeText(
        locale,
        "कूटबद्ध कथन की प्रत्येक क्रमिक जोड़ी को अलग संबंध-कथन मानें; संकेतों पर गणितीय प्राथमिकता लागू न करें।",
        "ਕੋਡ ਕੀਤੇ ਕਥਨ ਦੀ ਹਰ ਲਗਾਤਾਰ ਜੋੜੀ ਨੂੰ ਵੱਖਰਾ ਸੰਬੰਧ-ਕਥਨ ਮੰਨੋ; ਚਿੰਨ੍ਹਾਂ ਉੱਤੇ ਗਣਿਤੀ ਤਰਜੀਹ ਲਾਗੂ ਨਾ ਕਰੋ।",
      ),
    ];
  }
  if (authority === "IDENTIFY_PERSON_FROM_CODED_GRAPH") {
    return [
      localeText(
        locale,
        "पहले सभी कूटों का अर्थ निकालकर परिवार-संबंध चित्र बनाइए, फिर प्रत्येक उम्मीदवार को पूछे गए संबंध से जाँचिए।",
        "ਪਹਿਲਾਂ ਸਾਰੇ ਕੋਡਾਂ ਦਾ ਅਰਥ ਕੱਢ ਕੇ ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ ਬਣਾਓ, ਫਿਰ ਹਰ ਉਮੀਦਵਾਰ ਨੂੰ ਪੁੱਛੇ ਗਏ ਸੰਬੰਧ ਨਾਲ ਜਾਂਚੋ।",
      ),
      localeText(
        locale,
        "सही व्यक्ति वही है जिसकी पूरी संबंध-श्रृंखला और प्रश्न में पूछी गई दिशा दोनों मेल खाती हैं।",
        "ਸਹੀ ਵਿਅਕਤੀ ਉਹੀ ਹੈ ਜਿਸਦੀ ਪੂਰੀ ਸੰਬੰਧ-ਲੜੀ ਅਤੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੀ ਦਿਸ਼ਾ ਦੋਵੇਂ ਮੇਲ ਖਾਂਦੀਆਂ ਹਨ।",
      ),
    ];
  }
  if (authority === "DETERMINE_GENDER_FROM_CODED_GRAPH") {
    return [
      localeText(
        locale,
        "लिंग केवल कूट का अर्थ निकालने पर मिले पिता, माता, भाई, बहन, पति या पत्नी जैसे स्पष्ट संबंधों से तय करें।",
        "ਲਿੰਗ ਕੇਵਲ ਕੋਡ ਦਾ ਅਰਥ ਕੱਢਣ ਉੱਤੇ ਮਿਲੇ ਪਿਤਾ, ਮਾਤਾ, ਭਰਾ, ਭੈਣ, ਪਤੀ ਜਾਂ ਪਤਨੀ ਵਰਗੇ ਸਪਸ਼ਟ ਸੰਬੰਧਾਂ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।",
      ),
      localeText(
        locale,
        "किसी अक्षर या व्यक्ति के नाम को अपने-आप लिंग का प्रमाण न मानें।",
        "ਕਿਸੇ ਅੱਖਰ ਜਾਂ ਵਿਅਕਤੀ ਦੇ ਨਾਮ ਨੂੰ ਆਪਣੇ ਆਪ ਲਿੰਗ ਦਾ ਸਬੂਤ ਨਾ ਮੰਨੋ।",
      ),
    ];
  }
  return [
    localeText(
      locale,
      "सभी कूटबद्ध कथनों का अर्थ निकालकर परिवार-संबंध चित्र पर प्रत्येक दी गई जोड़ी का संबंध पहचानें।",
      "ਸਾਰੇ ਕੋਡ ਕੀਤੇ ਕਥਨਾਂ ਦਾ ਅਰਥ ਕੱਢ ਕੇ ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ ਉੱਤੇ ਹਰ ਦਿੱਤੀ ਜੋੜੀ ਦਾ ਸੰਬੰਧ ਪਛਾਣੋ।",
    ),
    localeText(
      locale,
      "जोड़ी का क्रम तभी अनदेखा करें जब माँगा गया संबंध दोनों दिशाओं में समान हो, जैसे भाई-बहन या जीवनसाथी।",
      "ਜੋੜੀ ਦਾ ਕ੍ਰਮ ਤਦੋਂ ਹੀ ਅਣਡਿੱਠਾ ਕਰੋ ਜਦੋਂ ਮੰਗਿਆ ਸੰਬੰਧ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਹੋਵੇ, ਜਿਵੇਂ ਭਰਾ-ਭੈਣ ਜਾਂ ਜੀਵਨਸਾਥੀ।",
    ),
  ];
}

export function localizedShortcut(
  authority: BlrCp006Authority,
  locale: BlrCp006TranslatedLocale,
): string {
  if (authority === "DETERMINE_GENDER_FROM_CODED_GRAPH") {
    return localeText(
      locale,
      "जिस व्यक्ति का लिंग पूछा है, उसे चिन्हित करें और उससे जुड़ा स्पष्ट लिंग-सूचक संबंध देखें; केवल अक्षर से लिंग न मानें।",
      "ਜਿਸ ਵਿਅਕਤੀ ਦਾ ਲਿੰਗ ਪੁੱਛਿਆ ਹੈ, ਉਸਨੂੰ ਨਿਸ਼ਾਨ ਲਗਾਓ ਅਤੇ ਉਸ ਨਾਲ ਜੁੜਿਆ ਸਪਸ਼ਟ ਲਿੰਗ-ਸੂਚਕ ਸੰਬੰਧ ਵੇਖੋ; ਕੇਵਲ ਅੱਖਰ ਤੋਂ ਲਿੰਗ ਨਾ ਮੰਨੋ।",
    );
  }
  if (authority === "SELECT_CODED_RELATION_PAIR") {
    return localeText(
      locale,
      "छोटे कथनों का अर्थ निकालकर माता-पिता-संतान, भाई-बहन और विवाह के संबंध चिन्हित करें, फिर माँगी गई जोड़ी चुनें।",
      "ਛੋਟੇ ਕਥਨਾਂ ਦਾ ਅਰਥ ਕੱਢ ਕੇ ਮਾਤਾ-ਪਿਤਾ-ਸੰਤਾਨ, ਭਰਾ-ਭੈਣ ਅਤੇ ਵਿਆਹ ਦੇ ਸੰਬੰਧ ਨਿਸ਼ਾਨਿਤ ਕਰੋ, ਫਿਰ ਮੰਗੀ ਜੋੜੀ ਚੁਣੋ।",
    );
  }
  if (authority === "IDENTIFY_PERSON_FROM_CODED_GRAPH") {
    return localeText(
      locale,
      "प्रत्येक उम्मीदवार के लिए संदर्भ व्यक्ति से उसका संबंध लिखें और गलत पीढ़ी, दिशा या लिंग वाले विकल्प हटा दें।",
      "ਹਰ ਉਮੀਦਵਾਰ ਲਈ ਹਵਾਲਾ ਵਿਅਕਤੀ ਨਾਲ ਉਸਦਾ ਸੰਬੰਧ ਲਿਖੋ ਅਤੇ ਗਲਤ ਪੀੜ੍ਹੀ, ਦਿਸ਼ਾ ਜਾਂ ਲਿੰਗ ਵਾਲੇ ਵਿਕਲਪ ਹਟਾ ਦਿਓ।",
    );
  }
  return localeText(
    locale,
    "पहले प्रत्येक कूट-चिह्न का संबंध लिखें; फिर प्रश्न में पूछी गई दिशा में ही संबंध-श्रृंखला पढ़ें।",
    "ਪਹਿਲਾਂ ਹਰ ਕੋਡ-ਚਿੰਨ੍ਹ ਦਾ ਸੰਬੰਧ ਲਿਖੋ; ਫਿਰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੀ ਸੰਬੰਧ-ਲੜੀ ਪੜ੍ਹੋ।",
  );
}
