import {
  type BlrCp006DirectRelation,
  type BlrCp006Option,
  type BlrCp006Relation,
  type GeneratedBlrCp006Question,
} from "../cp006-model";
import { generateBlrCp006FrozenBank } from "../cp006-runtime";
import {
  BLR_CP006_LOCALIZATION_VERSION,
  BLR_CP006_MULTILINGUAL_RUNTIME_VERSION,
  localeText,
  localizedCoreConcept,
  localizedDirectRelationSentence,
  localizedGenderLabel,
  localizedRelationLabel,
  localizedShortcut,
  type BlrCp006TranslatedLocale,
} from "./cp006-language-pack";

export const BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE =
  "BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE" as const;
export const BLR_CP006_HUMAN_REVIEW_BLOCKER = "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

type Locale = BlrCp006TranslatedLocale;

export type GeneratedBlrCp006LocalizedQuestion = Omit<
  GeneratedBlrCp006Question,
  "locale" | "itemId" | "sharedPrompt" | "stem" | "options" | "answer" | "decodedStatements" | "explanation" | "metadata"
> & {
  locale: Locale;
  canonicalLocale: "en-IN";
  canonicalItemId: string;
  itemId: string;
  questionLanguageId: string;
  sharedPrompt: string;
  stem: string;
  options: readonly BlrCp006Option[];
  answer: string;
  decodedStatements: readonly string[];
  explanation: GeneratedBlrCp006Question["explanation"];
  metadata: GeneratedBlrCp006Question["metadata"] & {
    localizationRuntimeVersion: typeof BLR_CP006_MULTILINGUAL_RUNTIME_VERSION;
    localizationVersion: typeof BLR_CP006_LOCALIZATION_VERSION;
    localizationAuthority: typeof BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
    localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    canonicalItemId: string;
    canonicalSemanticFingerprint: string;
    semanticParity: "EXECUTABLE_PROVED";
    learnerTextLocalized: true;
    humanLanguageReviewRequired: true;
    activeEditorialBlockers: readonly [typeof BLR_CP006_HUMAN_REVIEW_BLOCKER];
    productDeliveryUnlocked: false;
    productionStagingApproved: false;
  };
};

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D";
}

function relationFromSemanticKey(key: string): BlrCp006Relation {
  return key.slice("REL:".length) as BlrCp006Relation;
}

function pairText(text: string, locale: Locale): string {
  const parts = text.split(" and ");
  if (parts.length !== 2) throw new Error(`CP-006 localization: unsupported pair text ${text}.`);
  return localeText(locale, `${parts[0]} और ${parts[1]}`, `${parts[0]} ਅਤੇ ${parts[1]}`);
}

function localizedOptionText(option: BlrCp006Option, locale: Locale): string {
  if (option.semanticKey.startsWith("REL:")) {
    return localizedRelationLabel(relationFromSemanticKey(option.semanticKey), locale);
  }
  if (option.semanticKey.startsWith("PERSON:")) return option.text;
  if (option.semanticKey.startsWith("GENDER:")) {
    return localizedGenderLabel(option.semanticKey.slice("GENDER:".length), locale);
  }
  if (option.semanticKey.startsWith("PAIR:")) return pairText(option.text, locale);
  throw new Error(`CP-006 localization: unsupported option semantic key ${option.semanticKey}.`);
}

function directRelationForToken(
  record: GeneratedBlrCp006Question,
  token: string,
): BlrCp006DirectRelation {
  const relationId = record.codeKey.find((entry) => entry.token === token)?.relationId;
  if (!relationId) throw new Error(`${record.itemId}: token ${token} is absent from the code key.`);
  return relationId;
}

function localizedSharedPrompt(record: GeneratedBlrCp006Question, locale: Locale): string {
  const keyRows = record.codeKey.map((entry) => {
    const meaning = localizedDirectRelationSentence("X", entry.relationId, "Y", locale);
    return localeText(
      locale,
      `• “X ${entry.token} Y” का अर्थ है “${meaning}”`,
      `• “X ${entry.token} Y” ਦਾ ਅਰਥ ਹੈ “${meaning}”`,
    );
  }).join("\n");
  const statements = record.codedStatements
    .map((entry) => `• ${entry.leftId} ${entry.token} ${entry.rightId}`)
    .join("\n");
  return [
    localeText(locale, "दिए गए संबंध-कोड और कूटित कथनों का अध्ययन कीजिए।", "ਦਿੱਤੇ ਗਏ ਸੰਬੰਧ-ਕੋਡ ਅਤੇ ਕੋਡਿਤ ਕਥਨਾਂ ਦਾ ਅਧਿਐਨ ਕਰੋ।"),
    "",
    keyRows,
    "",
    localeText(locale, "कूटित कथन:", "ਕੋਡਿਤ ਕਥਨ:"),
    statements,
    "",
    localeText(
      locale,
      "हर पास-पास की कूटित जोड़ी एक अलग पारिवारिक कथन है। संकेत संबंध-कोड हैं, गणितीय चिह्न नहीं।",
      "ਹਰ ਨਾਲ-ਨਾਲ ਕੋਡਿਤ ਜੋੜੀ ਇੱਕ ਵੱਖਰਾ ਪਰਿਵਾਰਕ ਕਥਨ ਹੈ। ਸੰਕੇਤ ਸੰਬੰਧ-ਕੋਡ ਹਨ, ਗਣਿਤੀ ਚਿੰਨ੍ਹ ਨਹੀਂ।",
    ),
  ].join("\n");
}

function localizedStem(record: GeneratedBlrCp006Question, locale: Locale): string {
  const query = record.query;
  if (query.kind === "RELATION") {
    return localeText(
      locale,
      `${query.subjectId} का ${query.referenceId} से क्या संबंध है?`,
      `${query.subjectId} ਦਾ ${query.referenceId} ਨਾਲ ਕੀ ਸੰਬੰਧ ਹੈ?`,
    );
  }
  if (query.kind === "IDENTIFY_PERSON") {
    const relation = localizedRelationLabel(query.relationId, locale);
    return localeText(
      locale,
      `${query.referenceId} का ${relation} कौन है?`,
      `${query.referenceId} ਦਾ ${relation} ਕੌਣ ਹੈ?`,
    );
  }
  if (query.kind === "GENDER") {
    return localeText(locale, `${query.personId} का लिंग क्या है?`, `${query.personId} ਦਾ ਲਿੰਗ ਕੀ ਹੈ?`);
  }
  const relation = localizedRelationLabel(query.relationId, locale);
  return localeText(
    locale,
    `किस जोड़ी में ${relation} का संबंध है?`,
    `ਕਿਹੜੀ ਜੋੜੀ ਵਿੱਚ ${relation} ਦਾ ਸੰਬੰਧ ਹੈ?`,
  );
}

function localizedDecodedStatements(
  record: GeneratedBlrCp006Question,
  locale: Locale,
): readonly string[] {
  return record.codedStatements.map((coded) => localizedDirectRelationSentence(
    coded.leftId,
    directRelationForToken(record, coded.token),
    coded.rightId,
    locale,
  ));
}

function localizedDecodingAudit(
  record: GeneratedBlrCp006Question,
  decodedStatements: readonly string[],
  locale: Locale,
): readonly string[] {
  return record.codedStatements.map((coded, index) => localeText(
    locale,
    `${coded.leftId} ${coded.token} ${coded.rightId} को खोलने पर: ${decodedStatements[index]}`,
    `${coded.leftId} ${coded.token} ${coded.rightId} ਨੂੰ ਖੋਲ੍ਹਣ ਉੱਤੇ: ${decodedStatements[index]}`,
  ));
}

function localizedGraphAudit(
  record: GeneratedBlrCp006Question,
  answer: string,
  locale: Locale,
): readonly string[] {
  const query = record.query;
  if (query.kind === "RELATION") {
    const path = record.explanation.familyTree.query.pathPersonIds;
    return [
      localeText(locale, `प्रश्न की दिशा में रास्ता देखें: ${path.join(" → ")}।`, `ਪ੍ਰਸ਼ਨ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਰਸਤਾ ਵੇਖੋ: ${path.join(" → ")}।`),
      localeText(locale, `पूरे खुले हुए रास्ते से उत्तर ${answer} मिलता है।`, `ਪੂਰੇ ਖੁੱਲ੍ਹੇ ਹੋਏ ਰਸਤੇ ਤੋਂ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`),
    ];
  }
  if (query.kind === "IDENTIFY_PERSON") {
    const relation = localizedRelationLabel(query.relationId, locale);
    return [
      localeText(locale, `उम्मीदवार ${query.candidateIds.join(", ")} को ${query.referenceId} के ${relation} के रूप में जाँचें।`, `ਉਮੀਦਵਾਰ ${query.candidateIds.join(", ")} ਨੂੰ ${query.referenceId} ਦੇ ${relation} ਵਜੋਂ ਜਾਂਚੋ।`),
      localeText(locale, `केवल ${answer} पूरा खुला हुआ संबंध पूरा करता है।`, `ਕੇਵਲ ${answer} ਪੂਰਾ ਖੁੱਲ੍ਹਾ ਹੋਇਆ ਸੰਬੰਧ ਪੂਰਾ ਕਰਦਾ ਹੈ।`),
    ];
  }
  if (query.kind === "GENDER") {
    return [
      localeText(locale, `${query.personId} से जुड़ा खुला लिंग-सूचक संबंध लिंग तय करता है।`, `${query.personId} ਨਾਲ ਜੁੜਿਆ ਖੁੱਲ੍ਹਾ ਲਿੰਗ-ਸੂਚਕ ਸੰਬੰਧ ਲਿੰਗ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।`),
      localeText(locale, `आवश्यक उत्तर ${answer} है; अक्षर स्वयं लिंग का प्रमाण नहीं है।`, `ਲੋੜੀਂਦਾ ਉੱਤਰ ${answer} ਹੈ; ਅੱਖਰ ਆਪਣੇ ਆਪ ਲਿੰਗ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ।`),
    ];
  }
  return [
    localeText(locale, "कोड खोलने के बाद दी गई जोड़ियों को भाई-बहन, जीवनसाथी, माता-पिता-संतान या असंगत के रूप में पहचानें।", "ਕੋਡ ਖੋਲ੍ਹਣ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀਆਂ ਜੋੜੀਆਂ ਨੂੰ ਭਰਾ-ਭੈਣ, ਜੀਵਨਸਾਥੀ, ਮਾਤਾ-ਪਿਤਾ-ਸੰਤਾਨ ਜਾਂ ਅਸੰਗਤ ਵਜੋਂ ਪਛਾਣੋ।"),
    localeText(locale, `${answer} ही माँगे गए संबंध वाली एकमात्र जोड़ी है।`, `${answer} ਹੀ ਮੰਗੇ ਗਏ ਸੰਬੰਧ ਵਾਲੀ ਇਕੱਲੀ ਜੋੜੀ ਹੈ।`),
  ];
}

function localizedOptionExplanation(
  option: BlrCp006Option,
  index: number,
  answer: string,
  locale: Locale,
): string {
  const label = optionLabel(index);
  if (option.isCorrect) {
    return localeText(
      locale,
      `विकल्प ${label} सही है। पूरा कोड खोलने और परिवार-ग्राफ देखने पर ${answer} मिलता है। [CORRECT_DECODED_GRAPH]`,
      `ਵਿਕਲਪ ${label} ਸਹੀ ਹੈ। ਪੂਰਾ ਕੋਡ ਖੋਲ੍ਹਣ ਅਤੇ ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ ਵੇਖਣ ਉੱਤੇ ${answer} ਮਿਲਦਾ ਹੈ। [CORRECT_DECODED_GRAPH]`,
    );
  }
  const code = option.errorLabel ?? "DECODED_RELATION_MISMATCH";
  const hi: Record<string, string> = {
    QUERY_DIRECTION_REVERSAL: "यह प्रश्न में दी गई दिशा के उलट परिवार-रास्ता पढ़ता है।",
    GENERATION_LEVEL_ERROR: "कोड खोलने के बाद यह व्यक्ति को गलत पीढ़ी में रखता है।",
    BLOOD_AFFINAL_CONFUSION: "यह रक्त-संबंध वाले रास्ते को विवाह से जुड़े रास्ते से मिला देता है।",
    INCOMPLETE_DECODED_PATH: "यह उम्मीदवार खुले हुए रास्ते के केवल एक हिस्से से मेल खाता है, पूरे संबंध से नहीं।",
    IGNORED_EXPLICIT_GENDER_CODE: "खुला हुआ लिंग-सूचक संबंध लक्ष्य का लिंग तय करता है, इसलिए अनिश्चितता संभव नहीं है।",
    FALSE_CONTRADICTION: "दिया गया कोड और कथन एक संगत परिवार-ग्राफ बनाते हैं।",
    CODE_DIRECTION_GENDER_SWAP: "यह खुले हुए संबंध में मौजूद दिशा या लिंग को उलट देता है।",
    PAIR_RELATION_MISMATCH: "इस जोड़ी का खुला हुआ संबंध प्रश्न में माँगे गए संबंध से अलग है।",
    DECODED_RELATION_MISMATCH: "यह पूरे खुले हुए परिवार-ग्राफ से मेल नहीं खाता।",
  };
  const pa: Record<string, string> = {
    QUERY_DIRECTION_REVERSAL: "ਇਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਦਿਸ਼ਾ ਦੇ ਉਲਟ ਪਰਿਵਾਰਕ ਰਸਤਾ ਪੜ੍ਹਦਾ ਹੈ।",
    GENERATION_LEVEL_ERROR: "ਕੋਡ ਖੋਲ੍ਹਣ ਤੋਂ ਬਾਅਦ ਇਹ ਵਿਅਕਤੀ ਨੂੰ ਗਲਤ ਪੀੜ੍ਹੀ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।",
    BLOOD_AFFINAL_CONFUSION: "ਇਹ ਖੂਨ ਦੇ ਸੰਬੰਧ ਵਾਲੇ ਰਸਤੇ ਨੂੰ ਵਿਆਹ ਨਾਲ ਜੁੜੇ ਰਸਤੇ ਨਾਲ ਗੁੰਝਲਾਉਂਦਾ ਹੈ।",
    INCOMPLETE_DECODED_PATH: "ਇਹ ਉਮੀਦਵਾਰ ਖੁੱਲ੍ਹੇ ਰਸਤੇ ਦੇ ਕੇਵਲ ਇੱਕ ਹਿੱਸੇ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ, ਪੂਰੇ ਸੰਬੰਧ ਨਾਲ ਨਹੀਂ।",
    IGNORED_EXPLICIT_GENDER_CODE: "ਖੁੱਲ੍ਹਾ ਲਿੰਗ-ਸੂਚਕ ਸੰਬੰਧ ਲਕਸ਼ ਦਾ ਲਿੰਗ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਅਨਿਸ਼ਚਿਤਤਾ ਸੰਭਵ ਨਹੀਂ।",
    FALSE_CONTRADICTION: "ਦਿੱਤਾ ਕੋਡ ਅਤੇ ਕਥਨ ਇੱਕ ਸੰਗਤ ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ ਬਣਾਉਂਦੇ ਹਨ।",
    CODE_DIRECTION_GENDER_SWAP: "ਇਹ ਖੁੱਲ੍ਹੇ ਸੰਬੰਧ ਵਿੱਚ ਮੌਜੂਦ ਦਿਸ਼ਾ ਜਾਂ ਲਿੰਗ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ।",
    PAIR_RELATION_MISMATCH: "ਇਸ ਜੋੜੀ ਦਾ ਖੁੱਲ੍ਹਾ ਸੰਬੰਧ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੇ ਸੰਬੰਧ ਤੋਂ ਵੱਖਰਾ ਹੈ।",
    DECODED_RELATION_MISMATCH: "ਇਹ ਪੂਰੇ ਖੁੱਲ੍ਹੇ ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।",
  };
  return localeText(
    locale,
    `विकल्प ${label} गलत है। ${hi[code] ?? hi.DECODED_RELATION_MISMATCH} [${code}]`,
    `ਵਿਕਲਪ ${label} ਗਲਤ ਹੈ। ${pa[code] ?? pa.DECODED_RELATION_MISMATCH} [${code}]`,
  );
}

function localizedFamilyTree(
  record: GeneratedBlrCp006Question,
  answer: string,
  locale: Locale,
): GeneratedBlrCp006Question["explanation"]["familyTree"] {
  const tree = record.explanation.familyTree;
  const generations = [...new Set(tree.nodes.map((node) => node.generation))].sort((a, b) => b - a);
  const rows = generations.map((generation) => {
    const members = tree.nodes
      .filter((node) => node.generation === generation)
      .map((node) => `[${node.label}] (${node.gender === "male" ? "+" : node.gender === "female" ? "-" : "?"})`)
      .join("   ");
    return localeText(locale, `पीढ़ी ${generation}: ${members}`, `ਪੀੜ੍ਹੀ ${generation}: ${members}`);
  });
  const edges = [
    ...record.graph.parents.map((edge) => localeText(locale, `${edge.parentId} -> संतान -> ${edge.childId}`, `${edge.parentId} -> ਸੰਤਾਨ -> ${edge.childId}`)),
    ...record.graph.spouses.map((edge) => localeText(locale, `${edge.personAId} == जीवनसाथी == ${edge.personBId}`, `${edge.personAId} == ਜੀਵਨਸਾਥੀ == ${edge.personBId}`)),
    ...record.graph.siblings.map((edge) => localeText(locale, `${edge.personAId} -- भाई/बहन -- ${edge.personBId}`, `${edge.personAId} -- ਭਰਾ/ਭੈਣ -- ${edge.personBId}`)),
  ];
  return {
    ...tree,
    title: localeText(locale, "खोला गया परिवार-संबंध मानचित्र", "ਖੋਲ੍ਹਿਆ ਗਿਆ ਪਰਿਵਾਰਕ-ਸੰਬੰਧ ਨਕਸ਼ਾ"),
    query: { ...tree.query, answerLabel: answer },
    accessibleSummary: localeText(
      locale,
      `${tree.nodes.length} व्यक्तियों और ${tree.edges.length} संबंध-किनारों वाला खोला गया परिवार-ग्राफ।`,
      `${tree.nodes.length} ਵਿਅਕਤੀਆਂ ਅਤੇ ${tree.edges.length} ਸੰਬੰਧ-ਕਿਨਾਰਿਆਂ ਵਾਲਾ ਖੋਲ੍ਹਿਆ ਗਿਆ ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ।`,
    ),
    asciiFallback: [
      localeText(locale, "खोला गया परिवार-संबंध मानचित्र", "ਖੋਲ੍ਹਿਆ ਗਿਆ ਪਰਿਵਾਰਕ-ਸੰਬੰਧ ਨਕਸ਼ਾ"),
      ...rows,
      "",
      localeText(locale, "खुले हुए संबंध:", "ਖੁੱਲ੍ਹੇ ਹੋਏ ਸੰਬੰਧ:"),
      ...edges,
      "",
      localeText(locale, "कुंजी: (+) पुरुष | (-) महिला | (?) लिंग स्थापित नहीं", "ਕੁੰਜੀ: (+) ਪੁਰਸ਼ | (-) ਮਹਿਲਾ | (?) ਲਿੰਗ ਸਥਾਪਿਤ ਨਹੀਂ"),
    ].join("\n"),
  };
}

export function localizeBlrCp006Question(
  record: GeneratedBlrCp006Question,
  locale: Locale,
): GeneratedBlrCp006LocalizedQuestion {
  const options = record.options.map((option) => ({ ...option, text: localizedOptionText(option, locale) }));
  const answer = options[record.correctIndex]!.text;
  const decodedStatements = localizedDecodedStatements(record, locale);
  const suffix = locale === "hi-IN" ? "hi" : "pa";
  return {
    ...record,
    locale,
    canonicalLocale: "en-IN",
    canonicalItemId: record.itemId,
    itemId: `${record.itemId}-${suffix}`,
    questionLanguageId: `${record.itemId}:${locale}`,
    sharedPrompt: localizedSharedPrompt(record, locale),
    stem: localizedStem(record, locale),
    options,
    answer,
    decodedStatements,
    explanation: {
      coreConcept: localizedCoreConcept(record.solveAuthority, locale),
      decodingAudit: localizedDecodingAudit(record, decodedStatements, locale),
      graphAudit: localizedGraphAudit(record, answer, locale),
      conclusion: localeText(
        locale,
        `${answer} पूरा कोड खोलने से बने परिवार-ग्राफ द्वारा समर्थित एकमात्र उत्तर है।`,
        `${answer} ਪੂਰਾ ਕੋਡ ਖੋਲ੍ਹਣ ਨਾਲ ਬਣੇ ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ ਦੁਆਰਾ ਸਮਰਥਿਤ ਇਕੱਲਾ ਉੱਤਰ ਹੈ।`,
      ),
      examShortcut: localizedShortcut(record.solveAuthority, locale),
      commonTraps: [
        localeText(locale, "संबंध-संकेतों पर गणितीय प्राथमिकता लागू न करें।", "ਸੰਬੰਧ-ਸੰਕੇਤਾਂ ਉੱਤੇ ਗਣਿਤੀ ਤਰਜੀਹ ਲਾਗੂ ਨਾ ਕਰੋ।"),
        localeText(locale, "प्रश्न में दिए गए व्यक्ति और संदर्भ व्यक्ति की दिशा न उलटें।", "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਵਿਅਕਤੀ ਅਤੇ ਹਵਾਲਾ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਨਾ ਉਲਟੋ।"),
        localeText(locale, "अक्षर या नाम देखकर लिंग न मानें।", "ਅੱਖਰ ਜਾਂ ਨਾਮ ਦੇਖ ਕੇ ਲਿੰਗ ਨਾ ਮੰਨੋ।"),
      ],
      optionAnalysis: options.map((option, index) => ({
        optionLabel: optionLabel(index),
        optionText: option.text,
        isCorrect: option.isCorrect,
        explanation: localizedOptionExplanation(option, index, answer, locale),
      })),
      familyTree: localizedFamilyTree(record, answer, locale),
    },
    metadata: {
      ...record.metadata,
      localizationRuntimeVersion: BLR_CP006_MULTILINGUAL_RUNTIME_VERSION,
      localizationVersion: BLR_CP006_LOCALIZATION_VERSION,
      localizationAuthority: BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      canonicalItemId: record.itemId,
      canonicalSemanticFingerprint: record.metadata.semanticFingerprint,
      semanticParity: "EXECUTABLE_PROVED",
      learnerTextLocalized: true,
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [BLR_CP006_HUMAN_REVIEW_BLOCKER],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
  };
}

const cache = new Map<Locale, readonly GeneratedBlrCp006LocalizedQuestion[]>();

export function generateBlrCp006LocalizedReviewBank(
  locale: Locale,
): readonly GeneratedBlrCp006LocalizedQuestion[] {
  const existing = cache.get(locale);
  if (existing) return existing;
  const bank = generateBlrCp006FrozenBank().map((record) => localizeBlrCp006Question(record, locale));
  cache.set(locale, bank);
  return bank;
}

export function blrCp006CanonicalParityProjection(
  record: GeneratedBlrCp006Question | GeneratedBlrCp006LocalizedQuestion,
) {
  return {
    packageId: record.packageId,
    checkpointId: record.checkpointId,
    qlId: record.qlId,
    permanentQlId: record.permanentQlId,
    solveAuthority: record.solveAuthority,
    sourcePrototypeId: record.sourcePrototypeId,
    seed: record.seed,
    scenarioId: record.scenarioId,
    topologyId: record.topologyId,
    keyStyle: record.keyStyle,
    codeKey: record.codeKey,
    codedStatements: record.codedStatements,
    query: record.query,
    answerType: record.answerType,
    answerSemanticKey: record.options[record.correctIndex]?.semanticKey,
    optionSemantics: record.options.map((option) => ({
      semanticKey: option.semanticKey,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel,
    })),
    correctIndex: record.correctIndex,
    graph: record.graph,
    familyTreeStructure: {
      nodes: record.explanation.familyTree.nodes,
      edges: record.explanation.familyTree.edges,
      query: {
        subjectId: record.explanation.familyTree.query.subjectId,
        referenceId: record.explanation.familyTree.query.referenceId,
        pathPersonIds: record.explanation.familyTree.query.pathPersonIds,
      },
    },
    semanticFingerprint: record.metadata.semanticFingerprint,
  };
}
