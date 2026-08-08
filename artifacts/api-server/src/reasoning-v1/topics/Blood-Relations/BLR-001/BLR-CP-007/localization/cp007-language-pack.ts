import type {
  BlrCp006CodeDefinition,
  BlrCp006CodedStatement,
  BlrCp006Relation,
} from "../../BLR-CP-006/cp006-model";

export const BLR_CP007_LOCALIZATION_VERSION =
  "blr-cp007-hi-pa-localization-v1" as const;
export const BLR_CP007_MULTILINGUAL_RUNTIME_VERSION =
  "blr-cp007-coded-construction-multilingual-v1" as const;

export type BlrCp007TranslatedLocale = "hi-IN" | "pa-IN";

type LocalizedText = Readonly<Record<BlrCp007TranslatedLocale, string>>;

const RELATION_LABELS: Readonly<Record<BlrCp006Relation, LocalizedText>> = {
  FATHER: { "hi-IN": "पिता", "pa-IN": "ਪਿਤਾ" },
  MOTHER: { "hi-IN": "माता", "pa-IN": "ਮਾਤਾ" },
  SON: { "hi-IN": "पुत्र", "pa-IN": "ਪੁੱਤਰ" },
  DAUGHTER: { "hi-IN": "पुत्री", "pa-IN": "ਧੀ" },
  BROTHER: { "hi-IN": "भाई", "pa-IN": "ਭਰਾ" },
  SISTER: { "hi-IN": "बहन", "pa-IN": "ਭੈਣ" },
  HUSBAND: { "hi-IN": "पति", "pa-IN": "ਪਤੀ" },
  WIFE: { "hi-IN": "पत्नी", "pa-IN": "ਪਤਨੀ" },
  PARENT: { "hi-IN": "माता या पिता", "pa-IN": "ਮਾਤਾ ਜਾਂ ਪਿਤਾ" },
  CHILD: { "hi-IN": "संतान", "pa-IN": "ਸੰਤਾਨ" },
  SIBLING: { "hi-IN": "भाई या बहन", "pa-IN": "ਭਰਾ ਜਾਂ ਭੈਣ" },
  SPOUSE: { "hi-IN": "पति या पत्नी", "pa-IN": "ਪਤੀ ਜਾਂ ਪਤਨੀ" },
  GRANDFATHER: { "hi-IN": "दादा या नाना", "pa-IN": "ਦਾਦਾ ਜਾਂ ਨਾਨਾ" },
  GRANDMOTHER: { "hi-IN": "दादी या नानी", "pa-IN": "ਦਾਦੀ ਜਾਂ ਨਾਨੀ" },
  GRANDPARENT: {
    "hi-IN": "दादा-दादी या नाना-नानी",
    "pa-IN": "ਦਾਦਾ-ਦਾਦੀ ਜਾਂ ਨਾਨਾ-ਨਾਨੀ",
  },
  GRANDSON: { "hi-IN": "पोता या नाती", "pa-IN": "ਪੋਤਾ ਜਾਂ ਦੋਹਤਾ" },
  GRANDDAUGHTER: { "hi-IN": "पोती या नातिन", "pa-IN": "ਪੋਤੀ ਜਾਂ ਦੋਹਤੀ" },
  GRANDCHILD: {
    "hi-IN": "पोता/पोती या नाती/नातिन",
    "pa-IN": "ਪੋਤਾ/ਪੋਤੀ ਜਾਂ ਦੋਹਤਾ/ਦੋਹਤੀ",
  },
  UNCLE: { "hi-IN": "चाचा या मामा", "pa-IN": "ਚਾਚਾ ਜਾਂ ਮਾਮਾ" },
  AUNT: { "hi-IN": "बुआ या मौसी", "pa-IN": "ਭੂਆ ਜਾਂ ਮਾਸੀ" },
  UNCLE_OR_AUNT: {
    "hi-IN": "चाचा/मामा या बुआ/मौसी",
    "pa-IN": "ਚਾਚਾ/ਮਾਮਾ ਜਾਂ ਭੂਆ/ਮਾਸੀ",
  },
  NEPHEW: { "hi-IN": "भतीजा या भांजा", "pa-IN": "ਭਤੀਜਾ ਜਾਂ ਭਾਣਜਾ" },
  NIECE: { "hi-IN": "भतीजी या भांजी", "pa-IN": "ਭਤੀਜੀ ਜਾਂ ਭਾਣਜੀ" },
  NEPHEW_OR_NIECE: {
    "hi-IN": "भतीजा/भांजा या भतीजी/भांजी",
    "pa-IN": "ਭਤੀਜਾ/ਭਾਣਜਾ ਜਾਂ ਭਤੀਜੀ/ਭਾਣਜੀ",
  },
  COUSIN: {
    "hi-IN": "चचेरा/ममेरा/फुफेरा/मौसेरा भाई या बहन",
    "pa-IN": "ਚਚੇਰਾ/ਮਮੇਰਾ/ਫੁਫੇਰਾ/ਮਾਸੇਰਾ ਭਰਾ ਜਾਂ ਭੈਣ",
  },
  FATHER_IN_LAW: { "hi-IN": "ससुर", "pa-IN": "ਸਹੁਰਾ" },
  MOTHER_IN_LAW: { "hi-IN": "सास", "pa-IN": "ਸੱਸ" },
  PARENT_IN_LAW: { "hi-IN": "सास या ससुर", "pa-IN": "ਸੱਸ ਜਾਂ ਸਹੁਰਾ" },
  SON_IN_LAW: { "hi-IN": "दामाद", "pa-IN": "ਜਵਾਈ" },
  DAUGHTER_IN_LAW: { "hi-IN": "बहू", "pa-IN": "ਨੂੰਹ" },
  CHILD_IN_LAW: { "hi-IN": "दामाद या बहू", "pa-IN": "ਜਵਾਈ ਜਾਂ ਨੂੰਹ" },
  BROTHER_IN_LAW: {
    "hi-IN": "साला/बहनोई/देवर/जेठ",
    "pa-IN": "ਸਾਲਾ/ਜੀਜਾ/ਦਿਉਰ/ਜੇਠ",
  },
  SISTER_IN_LAW: {
    "hi-IN": "साली/ननद/भाभी/जेठानी/देवरानी",
    "pa-IN": "ਸਾਲੀ/ਨਣਦ/ਭਰਜਾਈ/ਜੇਠਾਣੀ/ਦਿਉਰਾਣੀ",
  },
  SIBLING_IN_LAW: {
    "hi-IN": "विवाह-संबंधी भाई या बहन",
    "pa-IN": "ਵਿਆਹ ਰਾਹੀਂ ਭਰਾ ਜਾਂ ਭੈਣ",
  },
};

const RELATION_ROLE_PHRASES: Readonly<Record<BlrCp006Relation, LocalizedText>> = {
  FATHER: { "hi-IN": "का पिता", "pa-IN": "ਦਾ ਪਿਤਾ" },
  MOTHER: { "hi-IN": "की माता", "pa-IN": "ਦੀ ਮਾਤਾ" },
  SON: { "hi-IN": "का पुत्र", "pa-IN": "ਦਾ ਪੁੱਤਰ" },
  DAUGHTER: { "hi-IN": "की पुत्री", "pa-IN": "ਦੀ ਧੀ" },
  BROTHER: { "hi-IN": "का भाई", "pa-IN": "ਦਾ ਭਰਾ" },
  SISTER: { "hi-IN": "की बहन", "pa-IN": "ਦੀ ਭੈਣ" },
  HUSBAND: { "hi-IN": "का पति", "pa-IN": "ਦਾ ਪਤੀ" },
  WIFE: { "hi-IN": "की पत्नी", "pa-IN": "ਦੀ ਪਤਨੀ" },
  PARENT: {
    "hi-IN": "के माता-पिता में से एक",
    "pa-IN": "ਦੇ ਮਾਤਾ-ਪਿਤਾ ਵਿੱਚੋਂ ਇੱਕ",
  },
  CHILD: { "hi-IN": "की संतान", "pa-IN": "ਦੀ ਸੰਤਾਨ" },
  SIBLING: { "hi-IN": "का भाई या बहन", "pa-IN": "ਦਾ ਭਰਾ ਜਾਂ ਭੈਣ" },
  SPOUSE: { "hi-IN": "का पति या पत्नी", "pa-IN": "ਦਾ ਪਤੀ ਜਾਂ ਪਤਨੀ" },
  GRANDFATHER: { "hi-IN": "का दादा या नाना", "pa-IN": "ਦਾ ਦਾਦਾ ਜਾਂ ਨਾਨਾ" },
  GRANDMOTHER: { "hi-IN": "की दादी या नानी", "pa-IN": "ਦੀ ਦਾਦੀ ਜਾਂ ਨਾਨੀ" },
  GRANDPARENT: {
    "hi-IN": "के दादा-दादी या नाना-नानी में से एक",
    "pa-IN": "ਦੇ ਦਾਦਾ-ਦਾਦੀ ਜਾਂ ਨਾਨਾ-ਨਾਨੀ ਵਿੱਚੋਂ ਇੱਕ",
  },
  GRANDSON: { "hi-IN": "का पोता या नाती", "pa-IN": "ਦਾ ਪੋਤਾ ਜਾਂ ਦੋਹਤਾ" },
  GRANDDAUGHTER: { "hi-IN": "की पोती या नातिन", "pa-IN": "ਦੀ ਪੋਤੀ ਜਾਂ ਦੋਹਤੀ" },
  GRANDCHILD: {
    "hi-IN": "का पोता/पोती या नाती/नातिन",
    "pa-IN": "ਦਾ ਪੋਤਾ/ਪੋਤੀ ਜਾਂ ਦੋਹਤਾ/ਦੋਹਤੀ",
  },
  UNCLE: { "hi-IN": "का चाचा या मामा", "pa-IN": "ਦਾ ਚਾਚਾ ਜਾਂ ਮਾਮਾ" },
  AUNT: { "hi-IN": "की बुआ या मौसी", "pa-IN": "ਦੀ ਭੂਆ ਜਾਂ ਮਾਸੀ" },
  UNCLE_OR_AUNT: {
    "hi-IN": "का चाचा/मामा या बुआ/मौसी",
    "pa-IN": "ਦਾ ਚਾਚਾ/ਮਾਮਾ ਜਾਂ ਭੂਆ/ਮਾਸੀ",
  },
  NEPHEW: { "hi-IN": "का भतीजा या भांजा", "pa-IN": "ਦਾ ਭਤੀਜਾ ਜਾਂ ਭਾਣਜਾ" },
  NIECE: { "hi-IN": "की भतीजी या भांजी", "pa-IN": "ਦੀ ਭਤੀਜੀ ਜਾਂ ਭਾਣਜੀ" },
  NEPHEW_OR_NIECE: {
    "hi-IN": "का भतीजा/भांजा या भतीजी/भांजी",
    "pa-IN": "ਦਾ ਭਤੀਜਾ/ਭਾਣਜਾ ਜਾਂ ਭਤੀਜੀ/ਭਾਣਜੀ",
  },
  COUSIN: {
    "hi-IN": "का चचेरा/ममेरा/फुफेरा/मौसेरा भाई या बहन",
    "pa-IN": "ਦਾ ਚਚੇਰਾ/ਮਮੇਰਾ/ਫੁਫੇਰਾ/ਮਾਸੇਰਾ ਭਰਾ ਜਾਂ ਭੈਣ",
  },
  FATHER_IN_LAW: { "hi-IN": "का ससुर", "pa-IN": "ਦਾ ਸਹੁਰਾ" },
  MOTHER_IN_LAW: { "hi-IN": "की सास", "pa-IN": "ਦੀ ਸੱਸ" },
  PARENT_IN_LAW: { "hi-IN": "की सास या ससुर", "pa-IN": "ਦੀ ਸੱਸ ਜਾਂ ਸਹੁਰਾ" },
  SON_IN_LAW: { "hi-IN": "का दामाद", "pa-IN": "ਦਾ ਜਵਾਈ" },
  DAUGHTER_IN_LAW: { "hi-IN": "की बहू", "pa-IN": "ਦੀ ਨੂੰਹ" },
  CHILD_IN_LAW: { "hi-IN": "का दामाद या बहू", "pa-IN": "ਦਾ ਜਵਾਈ ਜਾਂ ਨੂੰਹ" },
  BROTHER_IN_LAW: {
    "hi-IN": "का साला/बहनोई/देवर/जेठ",
    "pa-IN": "ਦਾ ਸਾਲਾ/ਜੀਜਾ/ਦਿਉਰ/ਜੇਠ",
  },
  SISTER_IN_LAW: {
    "hi-IN": "की साली/ननद/भाभी/जेठानी/देवरानी",
    "pa-IN": "ਦੀ ਸਾਲੀ/ਨਣਦ/ਭਰਜਾਈ/ਜੇਠਾਣੀ/ਦਿਉਰਾਣੀ",
  },
  SIBLING_IN_LAW: {
    "hi-IN": "का विवाह-संबंधी भाई या बहन",
    "pa-IN": "ਦਾ ਵਿਆਹ ਰਾਹੀਂ ਭਰਾ ਜਾਂ ਭੈਣ",
  },
};

export function localizedBlrCp007RelationLabel(
  relationId: BlrCp006Relation,
  locale: BlrCp007TranslatedLocale,
): string {
  return RELATION_LABELS[relationId][locale];
}

export function localizedBlrCp007RelationStatement(
  subjectId: string,
  relationId: BlrCp006Relation,
  referenceId: string,
  locale: BlrCp007TranslatedLocale,
): string {
  const role = RELATION_ROLE_PHRASES[relationId][locale];
  return locale === "hi-IN"
    ? `${subjectId}, ${referenceId} ${role} है।`
    : `${subjectId}, ${referenceId} ${role} ਹੈ।`;
}

export function localizedBlrCp007TargetClause(
  subjectId: string,
  relationId: BlrCp006Relation,
  referenceId: string,
  locale: BlrCp007TranslatedLocale,
): string {
  const role = RELATION_ROLE_PHRASES[relationId][locale];
  return locale === "hi-IN"
    ? `${subjectId}, ${referenceId} ${role} है`
    : `${subjectId}, ${referenceId} ${role} ਹੈ`;
}

export function localizedBlrCp007CodeMeaning(
  definition: BlrCp006CodeDefinition,
  locale: BlrCp007TranslatedLocale,
): string {
  const relation = localizedBlrCp007RelationLabel(definition.relationId, locale);
  return locale === "hi-IN"
    ? `${definition.token} का अर्थ है: बाएँ व्यक्ति का दाएँ व्यक्ति से संबंध “${relation}” है`
    : `${definition.token} ਦਾ ਅਰਥ ਹੈ: ਖੱਬੇ ਵਿਅਕਤੀ ਦਾ ਸੱਜੇ ਵਿਅਕਤੀ ਨਾਲ ਸੰਬੰਧ “${relation}” ਹੈ`;
}

export function localizedBlrCp007SharedPrompt(
  codeKey: readonly BlrCp006CodeDefinition[],
  locale: BlrCp007TranslatedLocale,
): string {
  const meanings = codeKey.map((definition) => localizedBlrCp007CodeMeaning(definition, locale));
  return locale === "hi-IN"
    ? `इन संकेतों के अर्थ हैं: ${meanings.join("; ")}। हर कूटित जोड़ी को बाएँ से दाएँ पढ़ें।`
    : `ਦਿੱਤੇ ਗਏ ਸੰਕੇਤਾਂ ਦੇ ਅਰਥ ਇਹ ਹਨ: ${meanings.join("; ")}। ਹਰ ਕੋਡਿਤ ਜੋੜੀ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਪੜ੍ਹੋ।`;
}

export function localizedBlrCp007DirectStatement(
  statement: BlrCp006CodedStatement,
  codeKey: readonly BlrCp006CodeDefinition[],
  locale: BlrCp007TranslatedLocale,
): string {
  const definition = codeKey.find((entry) => entry.token === statement.token);
  if (!definition) {
    throw new Error(`Unknown BLR-CP-007 token during localisation: ${statement.token}`);
  }
  return localizedBlrCp007RelationStatement(
    statement.leftId,
    definition.relationId,
    statement.rightId,
    locale,
  );
}

export function localizedBlrCp007Join(
  values: readonly string[],
  locale: BlrCp007TranslatedLocale,
): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  const conjunction = locale === "hi-IN" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values.at(-1)}`;
}

export function localizedBlrCp007OptionLabel(index: number): "A" | "B" | "C" | "D" {
  return ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D";
}

export function localizedBlrCp007DiagramEdgeLabel(
  edgeType: "marriage" | "parent-child" | "sibling",
  locale: BlrCp007TranslatedLocale,
): string {
  const labels = {
    marriage: { "hi-IN": "विवाह संबंध", "pa-IN": "ਵਿਆਹ ਸੰਬੰਧ" },
    "parent-child": { "hi-IN": "माता/पिता–संतान", "pa-IN": "ਮਾਤਾ/ਪਿਤਾ–ਸੰਤਾਨ" },
    sibling: { "hi-IN": "भाई-बहन संबंध", "pa-IN": "ਭੈਣ-ਭਰਾ ਸੰਬੰਧ" },
  } as const;
  return labels[edgeType][locale];
}
