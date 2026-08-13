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
    localeText(
      locale,
      "दिए गए संबंध-कूट और कूटबद्ध कथनों को ध्यान से पढ़िए।",
      "ਦਿੱਤੇ ਗਏ ਸੰਬੰਧ-ਕੋਡ ਅਤੇ ਕੋਡ ਕੀਤੇ ਕਥਨਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।",
    ),
    "",
    keyRows,
    "",
    localeText(locale, "कूटबद्ध कथन:", "ਕੋਡ ਕੀਤੇ ਕਥਨ:"),
    statements,
    "",
    localeText(
      locale,
      "प्रत्येक संकेत का अर्थ केवल दिए गए संबंध-कूट के अनुसार लें। संकेतों को गणितीय चिह्न मानकर प्राथमिकता न लगाएँ।",
      "ਹਰ ਚਿੰਨ੍ਹ ਦਾ ਅਰਥ ਕੇਵਲ ਦਿੱਤੇ ਸੰਬੰਧ-ਕੋਡ ਅਨੁਸਾਰ ਲਓ। ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਗਣਿਤੀ ਨਿਸ਼ਾਨ ਮੰਨ ਕੇ ਤਰਜੀਹ ਨਾ ਲਗਾਓ।",
    ),
  ].join("\n");
}

function localizedPairRelationPhrase(relationId: BlrCp006Relation, locale: Locale): string {
  if (relationId === "SIBLING") {
    return localeText(locale, "भाई-बहन का संबंध", "ਭਰਾ-ਭੈਣ ਦਾ ਸੰਬੰਧ");
  }
  if (relationId === "SPOUSE") {
    return localeText(locale, "जीवनसाथी का संबंध", "ਜੀਵਨਸਾਥੀ ਦਾ ਸੰਬੰਧ");
  }
  if (relationId === "PARENT") {
    return localeText(locale, "माता-पिता और संतान का संबंध", "ਮਾਤਾ-ਪਿਤਾ ਅਤੇ ਸੰਤਾਨ ਦਾ ਸੰਬੰਧ");
  }
  const relation = localizedRelationLabel(relationId, locale);
  return localeText(locale, `${relation} का संबंध`, `${relation} ਦਾ ਸੰਬੰਧ`);
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
  const phrase = localizedPairRelationPhrase(query.relationId, locale);
  return localeText(
    locale,
    `किस जोड़ी के बीच ${phrase} है?`,
    `ਕਿਹੜੀ ਜੋੜੀ ਵਿਚਕਾਰ ${phrase} ਹੈ?`,
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
    `${coded.leftId} ${coded.token} ${coded.rightId} का अर्थ: ${decodedStatements[index]}`,
    `${coded.leftId} ${coded.token} ${coded.rightId} ਦਾ ਅਰਥ: ${decodedStatements[index]}`,
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
      localeText(
        locale,
        `प्रश्न में पूछी गई दिशा की संबंध-श्रृंखला: ${path.join(" → ")}।`,
        `ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੀ ਦਿਸ਼ਾ ਦੀ ਸੰਬੰਧ-ਲੜੀ: ${path.join(" → ")}।`,
      ),
      localeText(
        locale,
        `इस पूरी संबंध-श्रृंखला से उत्तर ${answer} निकलता है।`,
        `ਇਸ ਪੂਰੀ ਸੰਬੰਧ-ਲੜੀ ਤੋਂ ਉੱਤਰ ${answer} ਨਿਕਲਦਾ ਹੈ।`,
      ),
    ];
  }
  if (query.kind === "IDENTIFY_PERSON") {
    const relation = localizedRelationLabel(query.relationId, locale);
    return [
      localeText(
        locale,
        `उम्मीदवार ${query.candidateIds.join(", ")} में जाँचें कि ${query.referenceId} का ${relation} कौन है।`,
        `ਉਮੀਦਵਾਰ ${query.candidateIds.join(", ")} ਵਿੱਚ ਜਾਂਚੋ ਕਿ ${query.referenceId} ਦਾ ${relation} ਕੌਣ ਹੈ।`,
      ),
      localeText(
        locale,
        `केवल ${answer} सभी दिए गए संबंधों से मेल खाता है।`,
        `ਕੇਵਲ ${answer} ਸਾਰੇ ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
      ),
    ];
  }
  if (query.kind === "GENDER") {
    return [
      localeText(
        locale,
        `${query.personId} से जुड़ा स्पष्ट लिंग-सूचक संबंध उसका लिंग निर्धारित करता है।`,
        `${query.personId} ਨਾਲ ਜੁੜਿਆ ਸਪਸ਼ਟ ਲਿੰਗ-ਸੂਚਕ ਸੰਬੰਧ ਉਸਦਾ ਲਿੰਗ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।`,
      ),
      localeText(
        locale,
        `इसलिए उत्तर ${answer} है; केवल अक्षर देखकर लिंग तय नहीं किया गया है।`,
        `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ; ਕੇਵਲ ਅੱਖਰ ਦੇਖ ਕੇ ਲਿੰਗ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।`,
      ),
    ];
  }
  return [
    localeText(
      locale,
      "कूटों का अर्थ निकालने के बाद दी गई जोड़ियों को भाई-बहन, जीवनसाथी, माता-पिता-संतान या असंबंधित जोड़ी के रूप में पहचानें।",
      "ਕੋਡਾਂ ਦਾ ਅਰਥ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀਆਂ ਜੋੜੀਆਂ ਨੂੰ ਭਰਾ-ਭੈਣ, ਜੀਵਨਸਾਥੀ, ਮਾਤਾ-ਪਿਤਾ-ਸੰਤਾਨ ਜਾਂ ਅਸੰਬੰਧਿਤ ਜੋੜੀ ਵਜੋਂ ਪਛਾਣੋ।",
    ),
    localeText(
      locale,
      `${answer} ही माँगे गए संबंध वाली एकमात्र जोड़ी है।`,
      `${answer} ਹੀ ਮੰਗੇ ਗਏ ਸੰਬੰਧ ਵਾਲੀ ਇਕੱਲੀ ਜੋੜੀ ਹੈ।`,
    ),
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
      `विकल्प ${label} सही है। सभी कूटों का अर्थ निकालकर परिवार-संबंध चित्र बनाने पर उत्तर ${answer} मिलता है।`,
      `ਵਿਕਲਪ ${label} ਸਹੀ ਹੈ। ਸਾਰੇ ਕੋਡਾਂ ਦਾ ਅਰਥ ਕੱਢ ਕੇ ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ ਬਣਾਉਣ ਉੱਤੇ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  const code = option.errorLabel ?? "DECODED_RELATION_MISMATCH";
  const hi: Record<string, string> = {
    QUERY_DIRECTION_REVERSAL: "यह संबंध-श्रृंखला को प्रश्न में पूछी गई दिशा के उलट पढ़ता है।",
    GENERATION_LEVEL_ERROR: "कूटों का अर्थ निकालने पर यह व्यक्ति को गलत पीढ़ी में रखता है।",
    BLOOD_AFFINAL_CONFUSION: "यह रक्त-संबंध और विवाह-संबंध वाली श्रृंखला को आपस में मिला देता है।",
    INCOMPLETE_DECODED_PATH: "यह केवल संबंध-श्रृंखला के एक हिस्से से मेल खाता है, पूरे संबंध से नहीं।",
    IGNORED_EXPLICIT_GENDER_CODE: "कूट का अर्थ निकालने पर मिला स्पष्ट लिंग-सूचक संबंध लक्ष्य का लिंग तय करता है, इसलिए उत्तर अनिश्चित नहीं है।",
    FALSE_CONTRADICTION: "दिए गए कूट और कथन एक संगत परिवार-संबंध चित्र बनाते हैं; इनमें विरोधाभास नहीं है।",
    CODE_DIRECTION_GENDER_SWAP: "यह दिए गए संबंध की दिशा या लिंग-सूचक अर्थ को उलट देता है।",
    PAIR_RELATION_MISMATCH: "इस जोड़ी का संबंध प्रश्न में माँगे गए संबंध से अलग है।",
    DECODED_RELATION_MISMATCH: "यह सभी दिए गए संबंधों को एक साथ संतुष्ट नहीं करता।",
  };
  const pa: Record<string, string> = {
    QUERY_DIRECTION_REVERSAL: "ਇਹ ਸੰਬੰਧ-ਲੜੀ ਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੀ ਦਿਸ਼ਾ ਦੇ ਉਲਟ ਪੜ੍ਹਦਾ ਹੈ।",
    GENERATION_LEVEL_ERROR: "ਕੋਡਾਂ ਦਾ ਅਰਥ ਕੱਢਣ ਉੱਤੇ ਇਹ ਵਿਅਕਤੀ ਨੂੰ ਗਲਤ ਪੀੜ੍ਹੀ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।",
    BLOOD_AFFINAL_CONFUSION: "ਇਹ ਖੂਨ ਦੇ ਸੰਬੰਧ ਅਤੇ ਵਿਆਹ ਵਾਲੇ ਸੰਬੰਧ ਦੀ ਲੜੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਗੁੰਝਲਾ ਦਿੰਦਾ ਹੈ।",
    INCOMPLETE_DECODED_PATH: "ਇਹ ਕੇਵਲ ਸੰਬੰਧ-ਲੜੀ ਦੇ ਇੱਕ ਹਿੱਸੇ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ, ਪੂਰੇ ਸੰਬੰਧ ਨਾਲ ਨਹੀਂ।",
    IGNORED_EXPLICIT_GENDER_CODE: "ਕੋਡ ਦਾ ਅਰਥ ਕੱਢਣ ਉੱਤੇ ਮਿਲਿਆ ਸਪਸ਼ਟ ਲਿੰਗ-ਸੂਚਕ ਸੰਬੰਧ ਲਕਸ਼ ਦਾ ਲਿੰਗ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ਅਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ।",
    FALSE_CONTRADICTION: "ਦਿੱਤੇ ਕੋਡ ਅਤੇ ਕਥਨ ਇੱਕ ਸੰਗਤ ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ ਬਣਾਉਂਦੇ ਹਨ; ਇਨ੍ਹਾਂ ਵਿੱਚ ਵਿਰੋਧ ਨਹੀਂ ਹੈ।",
    CODE_DIRECTION_GENDER_SWAP: "ਇਹ ਦਿੱਤੇ ਸੰਬੰਧ ਦੀ ਦਿਸ਼ਾ ਜਾਂ ਲਿੰਗ-ਸੂਚਕ ਅਰਥ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ।",
    PAIR_RELATION_MISMATCH: "ਇਸ ਜੋੜੀ ਦਾ ਸੰਬੰਧ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੇ ਸੰਬੰਧ ਤੋਂ ਵੱਖਰਾ ਹੈ।",
    DECODED_RELATION_MISMATCH: "ਇਹ ਸਾਰੇ ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਨੂੰ ਇਕੱਠੇ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।",
  };
  return localeText(
    locale,
    `विकल्प ${label} गलत है। ${hi[code] ?? hi.DECODED_RELATION_MISMATCH}`,
    `ਵਿਕਲਪ ${label} ਗਲਤ ਹੈ। ${pa[code] ?? pa.DECODED_RELATION_MISMATCH}`,
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
    ...record.graph.parents.map((edge) => localeText(locale, `${edge.parentId} → संतान → ${edge.childId}`, `${edge.parentId} → ਸੰਤਾਨ → ${edge.childId}`)),
    ...record.graph.spouses.map((edge) => localeText(locale, `${edge.personAId} ↔ जीवनसाथी ↔ ${edge.personBId}`, `${edge.personAId} ↔ ਜੀਵਨਸਾਥੀ ↔ ${edge.personBId}`)),
    ...record.graph.siblings.map((edge) => localeText(locale, `${edge.personAId} ↔ भाई/बहन ↔ ${edge.personBId}`, `${edge.personAId} ↔ ਭਰਾ/ਭੈਣ ↔ ${edge.personBId}`)),
  ];
  return {
    ...tree,
    title: localeText(locale, "परिवार-संबंध चित्र", "ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ"),
    query: { ...tree.query, answerLabel: answer },
    accessibleSummary: localeText(
      locale,
      `${tree.nodes.length} व्यक्तियों और ${tree.edges.length} संबंधों वाला परिवार-संबंध चित्र।`,
      `${tree.nodes.length} ਵਿਅਕਤੀਆਂ ਅਤੇ ${tree.edges.length} ਸੰਬੰਧਾਂ ਵਾਲਾ ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ।`,
    ),
    asciiFallback: [
      localeText(locale, "परिवार-संबंध चित्र", "ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ"),
      ...rows,
      "",
      localeText(locale, "स्पष्ट संबंध:", "ਸਪਸ਼ਟ ਸੰਬੰਧ:"),
      ...edges,
      "",
      localeText(locale, "कुंजी: (+) पुरुष | (-) महिला | (?) लिंग ज्ञात नहीं", "ਕੁੰਜੀ: (+) ਪੁਰਸ਼ | (-) ਮਹਿਲਾ | (?) ਲਿੰਗ ਪਤਾ ਨਹੀਂ"),
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
        `${answer} सभी कूटों का अर्थ निकालकर बने परिवार-संबंध चित्र से मिलने वाला एकमात्र सही उत्तर है।`,
        `${answer} ਸਾਰੇ ਕੋਡਾਂ ਦਾ ਅਰਥ ਕੱਢ ਕੇ ਬਣੇ ਪਰਿਵਾਰਕ ਸੰਬੰਧ-ਚਿੱਤਰ ਤੋਂ ਮਿਲਣ ਵਾਲਾ ਇਕੱਲਾ ਸਹੀ ਉੱਤਰ ਹੈ।`,
      ),
      examShortcut: localizedShortcut(record.solveAuthority, locale),
      commonTraps: [
        localeText(locale, "संबंध-संकेतों पर गणितीय प्राथमिकता लागू न करें।", "ਸੰਬੰਧ-ਚਿੰਨ੍ਹਾਂ ਉੱਤੇ ਗਣਿਤੀ ਤਰਜੀਹ ਲਾਗੂ ਨਾ ਕਰੋ।"),
        localeText(locale, "प्रश्न में पूछे गए व्यक्ति और संदर्भ व्यक्ति की दिशा न उलटें।", "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੇ ਵਿਅਕਤੀ ਅਤੇ ਹਵਾਲਾ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਨਾ ਉਲਟੋ।"),
        localeText(locale, "केवल अक्षर या नाम देखकर लिंग न मानें।", "ਕੇਵਲ ਅੱਖਰ ਜਾਂ ਨਾਮ ਦੇਖ ਕੇ ਲਿੰਗ ਨਾ ਮੰਨੋ।"),
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
