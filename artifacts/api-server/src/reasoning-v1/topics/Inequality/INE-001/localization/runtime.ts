import { ineLanguagePack } from "./language-pack";
import { ineContentClass, ineOptionStandard } from "./scope";
import type {
  IneEnglishReviewRow,
  IneTranslatedLocale,
  LocalizedIneQuestion,
} from "./types";

const RELATION_WORDS = [
  "neither greater than nor equal to",
  "neither less than nor equal to",
  "neither less than nor greater than",
  "greater than or equal to",
  "less than or equal to",
  "not greater than",
  "not less than",
  "greater than",
  "less than",
  "equal to",
] as const;

const RELATION_PATTERN = RELATION_WORDS.join("|");

const STEMS: Record<string, readonly [string, string]> = {
  DETERMINE_DIRECT_RELATION: [
    "कथनों के आधार पर कौन-सा सबसे मजबूत संबंध निश्चित है?",
    "ਕਥਨਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਕਿਹੜਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸੰਬੰਧ ਯਕੀਨੀ ਹੈ?",
  ],
  DETERMINE_TRANSITIVE_RELATION: [
    "पूरी श्रृंखला को जोड़ने पर कौन-सा सबसे मजबूत संबंध निश्चित है?",
    "ਪੂਰੀ ਲੜੀ ਨੂੰ ਜੋੜਨ 'ਤੇ ਕਿਹੜਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸੰਬੰਧ ਯਕੀਨੀ ਹੈ?",
  ],
  DETERMINE_STRONGEST_DEFINITE_RELATION: [
    "कथनों से मिलने वाला सबसे मजबूत निश्चित संबंध कौन-सा है?",
    "ਕਥਨਾਂ ਤੋਂ ਮਿਲਣ ਵਾਲਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?",
  ],
  DETERMINE_RELATION_THROUGH_EQUALITY: [
    "बराबरी वाले संबंध को जोड़कर कौन-सा संबंध निश्चित होता है?",
    "ਬਰਾਬਰੀ ਵਾਲਾ ਸੰਬੰਧ ਜੋੜ ਕੇ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਹੁੰਦਾ ਹੈ?",
  ],
  DETERMINE_RELATION_OR_INDETERMINATE: [
    "कथनों से कौन-सा संबंध निश्चित होता है? यदि निश्चित न हो, तो वही विकल्प चुनें।",
    "ਕਥਨਾਂ ਤੋਂ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਹੁੰਦਾ ਹੈ? ਜੇ ਯਕੀਨੀ ਨਾ ਹੋਵੇ, ਤਾਂ ਉਹੀ ਚੋਣ ਕਰੋ।",
  ],
  EVALUATE_SINGLE_CONCLUSION: [
    "केवल दिए गए कथनों के आधार पर निष्कर्ष का सही मूल्यांकन क्या है?",
    "ਕੇਵਲ ਦਿੱਤੇ ਕਥਨਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਨਤੀਜੇ ਦਾ ਸਹੀ ਮੁਲਾਂਕਣ ਕੀ ਹੈ?",
  ],
  SELECT_VALID_CONCLUSION: [
    "दिए गए कथनों से कौन-सा निष्कर्ष निश्चित रूप से निकलता है?",
    "ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਨਿਕਲਦਾ ਹੈ?",
  ],
  SELECT_INVALID_CONCLUSION: [
    "दिए गए कथनों से कौन-सा निष्कर्ष नहीं निकलता?",
    "ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ?",
  ],
  DETERMINE_LONG_CHAIN_RELATION: [
    "पूरी श्रृंखला से कौन-सा संबंध निश्चित रूप से स्थापित होता है?",
    "ਪੂਰੀ ਲੜੀ ਤੋਂ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਥਾਪਿਤ ਹੁੰਦਾ ਹੈ?",
  ],
  DETERMINE_MULTI_ROUTE_RELATION: [
    "सभी उपलब्ध रास्तों को देखकर कौन-सा संबंध निश्चित होता है?",
    "ਸਾਰੇ ਉਪਲਬਧ ਰਸਤੇ ਵੇਖ ਕੇ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਹੁੰਦਾ ਹੈ?",
  ],
  APPLY_ALTERNATE_PATH_STRICTNESS: [
    "वैकल्पिक रास्तों सहित कौन-सा सबसे मजबूत संबंध निश्चित है?",
    "ਵਿਕਲਪਕ ਰਸਤਿਆਂ ਸਮੇਤ ਕਿਹੜਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸੰਬੰਧ ਯਕੀਨੀ ਹੈ?",
  ],
  DETERMINE_BRANCHED_GRAPH_RELATION: [
    "शाखाओं में दिए कथनों से कौन-सा संबंध निश्चित होता है?",
    "ਵੱਖ-ਵੱਖ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਹੁੰਦਾ ਹੈ?",
  ],
  FILTER_IRRELEVANT_STATEMENTS: [
    "असंबंधित कथनों को छोड़कर कौन-सा संबंध निश्चित होता है?",
    "ਗੈਰ-ਸੰਬੰਧਿਤ ਕਥਨ ਛੱਡ ਕੇ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਹੁੰਦਾ ਹੈ?",
  ],
  IDENTIFY_PAIR_WITH_DEFINITE_RELATION: [
    "किस जोड़ी का संबंध कथनों से पूरी तरह निर्धारित होता है?",
    "ਕਿਹੜੀ ਜੋੜੀ ਦਾ ਸੰਬੰਧ ਕਥਨਾਂ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ?",
  ],
  IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION: [
    "किस जोड़ी का संबंध कथनों से निर्धारित नहीं किया जा सकता?",
    "ਕਿਹੜੀ ਜੋੜੀ ਦਾ ਸੰਬੰਧ ਕਥਨਾਂ ਤੋਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ?",
  ],
  DETERMINE_DISCONNECTED_PAIR_RELATION: [
    "कथनों से कौन-सा संबंध निश्चित रूप से स्थापित होता है?",
    "ਕਥਨਾਂ ਤੋਂ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਥਾਪਿਤ ਹੁੰਦਾ ਹੈ?",
  ],
  PROPAGATE_EQUALITY_ACROSS_BRANCHES: [
    "बराबरी को सभी संबंधित कथनों में लागू करने पर कौन-सा संबंध निश्चित होता है?",
    "ਬਰਾਬਰੀ ਨੂੰ ਸਾਰੇ ਸੰਬੰਧਿਤ ਕਥਨਾਂ ਵਿੱਚ ਲਾਗੂ ਕਰਨ 'ਤੇ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਹੁੰਦਾ ਹੈ?",
  ],
  CLASSIFY_SINGLE_CONCLUSION_TRUTH: [
    "केवल दिए गए कथनों के आधार पर निष्कर्ष को कैसे वर्गीकृत करेंगे?",
    "ਕੇਵਲ ਦਿੱਤੇ ਕਥਨਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਨਤੀਜੇ ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕਰੋਗੇ?",
  ],
  IDENTIFY_DEFINITELY_TRUE_CONCLUSION: [
    "कौन-सा निष्कर्ष निश्चित रूप से सत्य है?",
    "ਕਿਹੜਾ ਨਤੀਜਾ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ?",
  ],
  IDENTIFY_POSSIBLY_TRUE_CONCLUSION: [
    "कौन-सा निष्कर्ष संभव है, लेकिन निश्चित रूप से सत्य नहीं है?",
    "ਕਿਹੜਾ ਨਤੀਜਾ ਸੰਭਵ ਹੈ, ਪਰ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਹੀ ਨਹੀਂ ਹੈ?",
  ],
  IDENTIFY_IMPOSSIBLE_CONCLUSION: [
    "कौन-सा निष्कर्ष असंभव है?",
    "ਕਿਹੜਾ ਨਤੀਜਾ ਅਸੰਭਵ ਹੈ?",
  ],
  IDENTIFY_ALL_POSSIBLE_RELATIONS: [
    "कौन-सा विकल्प सभी संभव संबंधों को सही रूप में दिखाता है?",
    "ਕਿਹੜੀ ਚੋਣ ਸਾਰੇ ਸੰਭਵ ਸੰਬੰਧ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਦਿਖਾਉਂਦੀ ਹੈ?",
  ],
  EVALUATE_INCLUSIVE_CONCLUSION_TRUTH: [
    "केवल दिए गए कथनों के आधार पर निष्कर्ष को कैसे वर्गीकृत करेंगे?",
    "ਕੇਵਲ ਦਿੱਤੇ ਕਥਨਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਨਤੀਜੇ ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕਰੋਗੇ?",
  ],
  EVALUATE_TWO_CONCLUSIONS: [
    "दिए गए कथनों से कौन-सा निष्कर्ष या कौन-से निष्कर्ष निश्चित रूप से निकलते हैं?",
    "ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਜਾਂ ਕਿਹੜੇ ਨਤੀਜੇ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਨਿਕਲਦੇ ਹਨ?",
  ],
  CLASSIFY_COMPLEMENTARY_PAIR: [
    "निष्कर्ष I और II की जोड़ी का सही मूल्यांकन क्या है?",
    "ਨਤੀਜੇ I ਅਤੇ II ਦੀ ਜੋੜੀ ਦਾ ਸਹੀ ਮੁਲਾਂਕਣ ਕੀ ਹੈ?",
  ],
  IDENTIFY_COMPLEMENTARY_PAIR: [
    "किस विकल्प में सही या-तो वाली निष्कर्ष-जोड़ी है?",
    "ਕਿਹੜੀ ਚੋਣ ਵਿੱਚ ਸਹੀ ਜਾਂ-ਤਾਂ ਵਾਲੀ ਨਤੀਜਾ-ਜੋੜੀ ਹੈ?",
  ],
  RESOLVE_EITHER_OR_CONCLUSIONS: [
    "कथनों को सत्य मानते हुए कौन-सा निष्कर्ष या निष्कर्षों का समूह निकलता है?",
    "ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਮੰਨਦੇ ਹੋਏ ਕਿਹੜਾ ਨਤੀਜਾ ਜਾਂ ਨਤੀਜਿਆਂ ਦਾ ਸਮੂਹ ਨਿਕਲਦਾ ਹੈ?",
  ],
  RESOLVE_DEFINITE_PLUS_EITHER_OR: [
    "कथनों को सत्य मानते हुए कौन-सा निष्कर्ष या निष्कर्षों का समूह निकलता है?",
    "ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਮੰਨਦੇ ਹੋਏ ਕਿਹੜਾ ਨਤੀਜਾ ਜਾਂ ਨਤੀਜਿਆਂ ਦਾ ਸਮੂਹ ਨਿਕਲਦਾ ਹੈ?",
  ],
  INTERPRET_LINGUISTIC_RELATION: [
    "कथन का ठीक वही अर्थ किस सांकेतिक संबंध में है?",
    "ਕਥਨ ਦਾ ਬਿਲਕੁਲ ਉਹੀ ਅਰਥ ਕਿਹੜੇ ਸੰਕੇਤਕ ਸੰਬੰਧ ਵਿੱਚ ਹੈ?",
  ],
  SOLVE_LINGUISTIC_CHAIN: [
    "शब्दों में दिए कथनों को जोड़कर सबसे मजबूत निश्चित संबंध कौन-सा है?",
    "ਸ਼ਬਦਾਂ ਵਿੱਚ ਦਿੱਤੇ ਕਥਨ ਜੋੜ ਕੇ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?",
  ],
  SOLVE_MIXED_LINGUISTIC_SYMBOLIC_CHAIN: [
    "शब्दों और चिह्नों में दिए कथनों को जोड़कर सबसे मजबूत निश्चित संबंध कौन-सा है?",
    "ਸ਼ਬਦਾਂ ਅਤੇ ਚਿੰਨ੍ਹਾਂ ਵਿੱਚ ਦਿੱਤੇ ਕਥਨ ਜੋੜ ਕੇ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?",
  ],
  EVALUATE_CONTEXTUAL_LINGUISTIC_CONCLUSIONS: [
    "कथनों को सत्य मानते हुए कौन-सा निष्कर्ष या कौन-से निष्कर्ष निश्चित रूप से निकलते हैं?",
    "ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਮੰਨਦੇ ਹੋਏ ਕਿਹੜਾ ਨਤੀਜਾ ਜਾਂ ਕਿਹੜੇ ਨਤੀਜੇ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਨਿਕਲਦੇ ਹਨ?",
  ],
  SOLVE_FIXED_MAP_CODED_CHAIN: [
    "कोड खोलने के बाद सबसे मजबूत निश्चित संबंध कौन-सा है?",
    "ਕੋਡ ਖੋਲ੍ਹਣ ਤੋਂ ਬਾਅਦ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?",
  ],
  EVALUATE_FIXED_MAP_CODED_CONCLUSIONS: [
    "दी गई कोड कुंजी के अनुसार कौन-सा निष्कर्ष या कौन-से निष्कर्ष निश्चित रूप से निकलते हैं?",
    "ਦਿੱਤੀ ਕੋਡ ਕੁੰਜੀ ਅਨੁਸਾਰ ਕਿਹੜਾ ਨਤੀਜਾ ਜਾਂ ਕਿਹੜੇ ਨਤੀਜੇ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਨਿਕਲਦੇ ਹਨ?",
  ],
  DECODE_FIXED_MAP_RELATION: [
    "दी गई कोड कुंजी के अनुसार कोडित कथन का ठीक वही सामान्य संबंध कौन-सा है?",
    "ਦਿੱਤੀ ਕੋਡ ਕੁੰਜੀ ਅਨੁਸਾਰ ਕੋਡਿਤ ਕਥਨ ਦਾ ਬਿਲਕੁਲ ਉਹੀ ਆਮ ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?",
  ],
  ENCODE_FIXED_MAP_RELATION: [
    "दी गई कोड कुंजी के अनुसार सामान्य संबंध को कौन-सा विकल्प सही ढंग से कोड करता है?",
    "ਦਿੱਤੀ ਕੋਡ ਕੁੰਜੀ ਅਨੁਸਾਰ ਆਮ ਸੰਬੰਧ ਨੂੰ ਕਿਹੜੀ ਚੋਣ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਕੋਡ ਕਰਦੀ ਹੈ?",
  ],
  COMPLETE_MISSING_CODED_OPERATOR: [
    "खाली स्थान में कौन-सा कोड-चिह्न रखने पर आवश्यक सबसे मजबूत संबंध बनेगा?",
    "ਖਾਲੀ ਥਾਂ ਵਿੱਚ ਕਿਹੜਾ ਕੋਡ-ਚਿੰਨ੍ਹ ਰੱਖਣ ਨਾਲ ਲੋੜੀਂਦਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸੰਬੰਧ ਬਣੇਗਾ?",
  ],
  SELECT_CODED_EXPRESSION_FOR_RELATION: [
    "कौन-सा कोडित व्यंजक आवश्यक सबसे मजबूत संबंध स्थापित करता है?",
    "ਕਿਹੜਾ ਕੋਡਿਤ ਪ੍ਰਗਟਾਵਾ ਲੋੜੀਂਦਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸੰਬੰਧ ਸਥਾਪਿਤ ਕਰਦਾ ਹੈ?",
  ],
  RECOVER_MISSING_MAP_ENTRY: [
    "परीक्षण के परिणामों से लुप्त कोड-चिह्न का अर्थ निर्धारित करें।",
    "ਪਰਖ ਦੇ ਨਤੀਜਿਆਂ ਤੋਂ ਗੁੰਮ ਕੋਡ-ਚਿੰਨ੍ਹ ਦਾ ਅਰਥ ਨਿਰਧਾਰਤ ਕਰੋ।",
  ],
  IDENTIFY_ONLY_CONSISTENT_CODE_MAP: [
    "कौन-सा पूरा कोड-मानचित्र सभी परीक्षण परिणामों से मेल खाता है?",
    "ਕਿਹੜਾ ਪੂਰਾ ਕੋਡ-ਨਕਸ਼ਾ ਸਾਰੇ ਪਰਖ ਨਤੀਜਿਆਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ?",
  ],
  RECONSTRUCT_MISSING_RELATION: [
    "खाली स्थान में कौन-सा संबंध रखने पर दिया गया सबसे मजबूत अंतिम संबंध बनेगा?",
    "ਖਾਲੀ ਥਾਂ ਵਿੱਚ ਕਿਹੜਾ ਸੰਬੰਧ ਰੱਖਣ ਨਾਲ ਦਿੱਤਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਅੰਤਲਾ ਸੰਬੰਧ ਬਣੇਗਾ?",
  ],
  SELECT_POSSIBLE_NOT_DEFINITE_CONCLUSION: [
    "कौन-सा निष्कर्ष संभव है, लेकिन निश्चित रूप से सत्य नहीं है?",
    "ਕਿਹੜਾ ਨਤੀਜਾ ਸੰਭਵ ਹੈ, ਪਰ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਹੀ ਨਹੀਂ ਹੈ?",
  ],
  SELECT_SET_ESTABLISHING_RELATION: [
    "कौन-सा कथन-समूह आवश्यक सबसे मजबूत अंतिम संबंध स्थापित करता है?",
    "ਕਿਹੜਾ ਕਥਨ-ਸਮੂਹ ਲੋੜੀਂਦਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਅੰਤਲਾ ਸੰਬੰਧ ਸਥਾਪਿਤ ਕਰਦਾ ਹੈ?",
  ],
  IDENTIFY_CONTRADICTORY_ADDITION: [
    "दिए गए कथनों से विरोध पैदा किए बिना कौन-सा कथन जोड़ा नहीं जा सकता?",
    "ਦਿੱਤੇ ਕਥਨਾਂ ਨਾਲ ਵਿਰੋਧ ਪੈਦਾ ਕੀਤੇ ਬਿਨਾਂ ਕਿਹੜਾ ਕਥਨ ਜੋੜਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ?",
  ],
};

const ENTITY_NAMES: Record<IneTranslatedLocale, Readonly<Record<string, string>>> = {
  "hi-IN": {
    Aman: "अमन",
    Bina: "बीना",
    Charan: "चरण",
    Diya: "दीया",
    Farah: "फ़राह",
    Gagan: "गगन",
  },
  "pa-IN": {
    Aman: "ਅਮਨ",
    Bina: "ਬੀਨਾ",
    Charan: "ਚਰਨ",
    Diya: "ਦੀਆ",
    Farah: "ਫ਼ਰਾਹ",
    Gagan: "ਗਗਨ",
  },
};

function localizeEntityNames(text: string, locale: IneTranslatedLocale): string {
  let localized = text
    .replace(/\bProduct ([A-Z])\b/g, locale === "hi-IN" ? "उत्पाद $1" : "ਉਤਪਾਦ $1")
    .replace(/\bPlant ([A-Z])\b/g, locale === "hi-IN" ? "संयंत्र $1" : "ਇਕਾਈ $1");
  for (const [english, translated] of Object.entries(ENTITY_NAMES[locale])) {
    localized = localized.replace(new RegExp(`\\b${english}\\b`, "g"), translated);
  }
  return localized;
}

function relationClause(left: string, relation: string, right: string, locale: IneTranslatedLocale): string {
  if (locale === "hi-IN") {
    const forms: Record<string, string> = {
      "greater than": `${left}, ${right} से बड़ा है।`,
      "less than": `${left}, ${right} से छोटा है।`,
      "equal to": `${left}, ${right} के बराबर है।`,
      "not greater than": `${left}, ${right} से बड़ा नहीं है।`,
      "not less than": `${left}, ${right} से छोटा नहीं है।`,
      "greater than or equal to": `${left}, ${right} से बड़ा या बराबर है।`,
      "less than or equal to": `${left}, ${right} से छोटा या बराबर है।`,
      "neither less than nor greater than": `${left}, ${right} से न छोटा है और न बड़ा।`,
      "neither less than nor equal to": `${left}, ${right} से न छोटा है और न बराबर।`,
      "neither greater than nor equal to": `${left}, ${right} से न बड़ा है और न बराबर।`,
    };
    return forms[relation] ?? `${left} ${relation} ${right}`;
  }
  const forms: Record<string, string> = {
    "greater than": `${left}, ${right} ਤੋਂ ਵੱਡਾ ਹੈ।`,
    "less than": `${left}, ${right} ਤੋਂ ਛੋਟਾ ਹੈ।`,
    "equal to": `${left}, ${right} ਦੇ ਬਰਾਬਰ ਹੈ।`,
    "not greater than": `${left}, ${right} ਤੋਂ ਵੱਡਾ ਨਹੀਂ ਹੈ।`,
    "not less than": `${left}, ${right} ਤੋਂ ਛੋਟਾ ਨਹੀਂ ਹੈ।`,
    "greater than or equal to": `${left}, ${right} ਤੋਂ ਵੱਡਾ ਜਾਂ ਬਰਾਬਰ ਹੈ।`,
    "less than or equal to": `${left}, ${right} ਤੋਂ ਛੋਟਾ ਜਾਂ ਬਰਾਬਰ ਹੈ।`,
    "neither less than nor greater than": `${left}, ${right} ਤੋਂ ਨਾ ਛੋਟਾ ਹੈ ਅਤੇ ਨਾ ਵੱਡਾ।`,
    "neither less than nor equal to": `${left}, ${right} ਤੋਂ ਨਾ ਛੋਟਾ ਹੈ ਅਤੇ ਨਾ ਬਰਾਬਰ।`,
    "neither greater than nor equal to": `${left}, ${right} ਤੋਂ ਨਾ ਵੱਡਾ ਹੈ ਅਤੇ ਨਾ ਬਰਾਬਰ।`,
  };
  return forms[relation] ?? `${left} ${relation} ${right}`;
}

function contextualClause(
  left: string,
  context: string,
  relation: string,
  right: string,
  locale: IneTranslatedLocale,
): string {
  const localizedLeft = localizeEntityNames(left, locale);
  const localizedRight = localizeEntityNames(right, locale);
  if (locale === "hi-IN") {
    const relationText: Record<string, string> = {
      "greater than": "से अधिक",
      "less than": "से कम",
      "equal to": "के बराबर",
      "not greater than": "से अधिक नहीं",
      "not less than": "से कम नहीं",
      "neither less than nor greater than": "से न कम और न अधिक",
      "neither less than nor equal to": "से न कम और न बराबर",
      "neither greater than nor equal to": "से न अधिक और न बराबर",
    };
    const forms: Record<string, readonly [string, string]> = {
      marks: [`${localizedLeft} के अंक`, `${localizedRight} के अंकों`],
      salary: [`${localizedLeft} का वेतन`, `${localizedRight} के वेतन`],
      height: [`${localizedLeft} की लंबाई`, `${localizedRight} की लंबाई`],
      weight: [`${localizedLeft} का वज़न`, `${localizedRight} के वज़न`],
      score: [`${localizedLeft} का स्कोर`, `${localizedRight} के स्कोर`],
      price: [`${localizedLeft} की कीमत`, `${localizedRight} की कीमत`],
      production: [`${localizedLeft} का उत्पादन`, `${localizedRight} के उत्पादन`],
    };
    const [subject, comparison] = forms[context.toLowerCase()] ?? [localizedLeft, localizedRight];
    const copula = context.toLowerCase() === "marks" ? "हैं" : "है";
    return `${subject}, ${comparison} ${relationText[relation] ?? relation} ${copula}।`;
  }
  const relationText: Record<string, string> = {
    "greater than": "ਨਾਲੋਂ ਵੱਧ",
    "less than": "ਨਾਲੋਂ ਘੱਟ",
    "equal to": "ਦੇ ਬਰਾਬਰ",
    "not greater than": "ਨਾਲੋਂ ਵੱਧ ਨਹੀਂ",
    "not less than": "ਨਾਲੋਂ ਘੱਟ ਨਹੀਂ",
    "neither less than nor greater than": "ਨਾਲੋਂ ਨਾ ਘੱਟ ਅਤੇ ਨਾ ਵੱਧ",
    "neither less than nor equal to": "ਨਾਲੋਂ ਨਾ ਘੱਟ ਅਤੇ ਨਾ ਬਰਾਬਰ",
    "neither greater than nor equal to": "ਨਾਲੋਂ ਨਾ ਵੱਧ ਅਤੇ ਨਾ ਬਰਾਬਰ",
  };
  const forms: Record<string, readonly [string, string]> = {
    marks: [`${localizedLeft} ਦੇ ਅੰਕ`, `${localizedRight} ਦੇ ਅੰਕਾਂ`],
    salary: [`${localizedLeft} ਦੀ ਤਨਖਾਹ`, `${localizedRight} ਦੀ ਤਨਖਾਹ`],
    height: [`${localizedLeft} ਦਾ ਕੱਦ`, `${localizedRight} ਦੇ ਕੱਦ`],
    weight: [`${localizedLeft} ਦਾ ਭਾਰ`, `${localizedRight} ਦੇ ਭਾਰ`],
    score: [`${localizedLeft} ਦਾ ਸਕੋਰ`, `${localizedRight} ਦੇ ਸਕੋਰ`],
    price: [`${localizedLeft} ਦੀ ਕੀਮਤ`, `${localizedRight} ਦੀ ਕੀਮਤ`],
    production: [`${localizedLeft} ਦਾ ਉਤਪਾਦਨ`, `${localizedRight} ਦੇ ਉਤਪਾਦਨ`],
  };
  const [subject, comparison] = forms[context.toLowerCase()] ?? [localizedLeft, localizedRight];
  const copula = context.toLowerCase() === "marks" ? "ਹਨ" : "ਹੈ";
  return `${subject}, ${comparison} ${relationText[relation] ?? relation} ${copula}।`;
}

export function translateIneStatement(text: string, locale: IneTranslatedLocale): string {
  const clean = text.trim();
  if (/^Required (?:strongest|endpoint) relation:/.test(clean)) {
    return translateEvidenceLine(clean, locale);
  }
  const possessive = clean.match(
    new RegExp(`^(.+?)'s (marks|salary|height|weight|score|production) (?:is|are) (${RELATION_PATTERN}) (.+?)'s \\2\\.$`, "i"),
  );
  if (possessive) {
    return contextualClause(possessive[1], possessive[2], possessive[3].toLowerCase(), possessive[4], locale);
  }
  const price = clean.match(new RegExp(`^The price of (.+?) is (${RELATION_PATTERN}) the price of (.+?)\\.$`, "i"));
  if (price) return contextualClause(price[1], "price", price[2].toLowerCase(), price[3], locale);

  const generic = clean.match(new RegExp(`^(.+?) is (${RELATION_PATTERN}) (.+?)\\.$`, "i"));
  if (generic) {
    return relationClause(
      localizeEntityNames(generic[1], locale),
      generic[2].toLowerCase(),
      localizeEntityNames(generic[3], locale),
      locale,
    );
  }
  return localizeEntityNames(clean, locale);
}

export function translateIneOption(text: string, locale: IneTranslatedLocale): string {
  const relationLabels: Record<IneTranslatedLocale, Record<string, string>> = {
    "hi-IN": {
      "less than": "छोटा (<)",
      "greater than": "बड़ा (>)",
      "equal to": "बराबर (=)",
      "less than or equal to": "छोटा या बराबर (≤)",
      "greater than or equal to": "बड़ा या बराबर (≥)",
    },
    "pa-IN": {
      "less than": "ਛੋਟਾ (<)",
      "greater than": "ਵੱਡਾ (>)",
      "equal to": "ਬਰਾਬਰ (=)",
      "less than or equal to": "ਛੋਟਾ ਜਾਂ ਬਰਾਬਰ (≤)",
      "greater than or equal to": "ਵੱਡਾ ਜਾਂ ਬਰਾਬਰ (≥)",
    },
  };
  if (relationLabels[locale][text]) return relationLabels[locale][text];
  const fixed = ineLanguagePack(locale).fixed[text];
  if (fixed) return fixed;
  if (RELATION_WORDS.includes(text as (typeof RELATION_WORDS)[number])) {
    return ineLanguagePack(locale).fixed[text] ?? text;
  }
  const joiner = locale === "hi-IN" ? " और " : " ਅਤੇ ";
  const alternative = locale === "hi-IN" ? " या " : " ਜਾਂ ";
  return localizeEntityNames(
    text.replace(/\s+and\s+/gi, joiner).replace(/\s+or\s+/gi, alternative),
    locale,
  );
}

function translateCodeKeyLine(text: string, locale: IneTranslatedLocale): string {
  const match = text.match(new RegExp(`^A (.+?) B means A is (${RELATION_PATTERN}) B\\.$`, "i"));
  if (!match) return translateIneOption(text, locale);
  const relation = match[2].toLowerCase();
  const localized = ineLanguagePack(locale).fixed[relation] ?? relation;
  return locale === "hi-IN"
    ? `A ${match[1]} B का अर्थ है: A, B ${localized} है।`
    : `A ${match[1]} B ਦਾ ਅਰਥ ਹੈ: A, B ${localized} ਹੈ।`;
}

function translateEvidenceLine(text: string, locale: IneTranslatedLocale): string {
  const replacements = locale === "hi-IN"
    ? [
        [/^Required strongest relation:/, "आवश्यक सबसे मजबूत संबंध:"],
        [/^Required endpoint relation:/, "आवश्यक अंतिम संबंध:"],
        [/^The five symbols have five different meanings:/, "पाँचों चिह्नों के पाँच अलग अर्थ हैं:"],
        [/^Only two meanings remain for (.+?):/, "$1 के लिए केवल दो अर्थ बचे हैं:"],
        [/ is true$/, " सत्य है"],
        [/ is false$/, " असत्य है"],
      ] as const
    : [
        [/^Required strongest relation:/, "ਲੋੜੀਂਦਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਸੰਬੰਧ:"],
        [/^Required endpoint relation:/, "ਲੋੜੀਂਦਾ ਅੰਤਲਾ ਸੰਬੰਧ:"],
        [/^The five symbols have five different meanings:/, "ਪੰਜੇ ਚਿੰਨ੍ਹਾਂ ਦੇ ਪੰਜ ਵੱਖਰੇ ਅਰਥ ਹਨ:"],
        [/^Only two meanings remain for (.+?):/, "$1 ਲਈ ਕੇਵਲ ਦੋ ਅਰਥ ਬਚੇ ਹਨ:"],
        [/ is true$/, " ਸਹੀ ਹੈ"],
        [/ is false$/, " ਗਲਤ ਹੈ"],
      ] as const;
  const translated = replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);
  return translated
    .replace(/\s+and\s+/gi, locale === "hi-IN" ? " और " : " ਅਤੇ ")
    .replace(/\s+or\s+/gi, locale === "hi-IN" ? " या " : " ਜਾਂ ")
    .replace(/\.$/, "।");
}

function localizeComparisonTarget(text: string, locale: IneTranslatedLocale): string {
  const possessive = text.match(/^(.+?)'s (marks|salary|height|weight|score|production)$/i);
  const price = text.match(/^the prices? of (.+)$/i);
  const entity = localizeEntityNames(possessive?.[1] ?? price?.[1] ?? text, locale);
  const context = (possessive?.[2] ?? (price ? "price" : undefined))?.toLowerCase();
  if (!context) return entity;

  const forms: Record<IneTranslatedLocale, Record<string, string>> = {
    "hi-IN": {
      marks: `${entity} के अंकों`,
      salary: `${entity} के वेतन`,
      height: `${entity} की लंबाई`,
      weight: `${entity} के वज़न`,
      score: `${entity} के स्कोर`,
      price: `${entity} की कीमत`,
      production: `${entity} के उत्पादन`,
    },
    "pa-IN": {
      marks: `${entity} ਦੇ ਅੰਕਾਂ`,
      salary: `${entity} ਦੀ ਤਨਖਾਹ`,
      height: `${entity} ਦੇ ਕੱਦ`,
      weight: `${entity} ਦੇ ਭਾਰ`,
      score: `${entity} ਦੇ ਸਕੋਰ`,
      price: `${entity} ਦੀ ਕੀਮਤ`,
      production: `${entity} ਦੇ ਉਤਪਾਦਨ`,
    },
  };
  return forms[locale][context] ?? entity;
}

function translatedStem(row: IneEnglishReviewRow, locale: IneTranslatedLocale): string {
  const stem = STEMS[row.authorityId];
  if (!stem) throw new Error(`INE-001 localization has no stem for authority ${row.authorityId}`);
  const base = stem[locale === "hi-IN" ? 0 : 1];
  const compared = row.stem.match(/for (.+?) compared with (.+?)\?$/i);
  const between = row.stem.match(/between (.+?) and (.+?)(?: is [^?]+)?\?$/i);
  const pair = compared ?? between;
  if (pair) {
    const first = localizeComparisonTarget(pair[1], locale);
    const secondSource = /^the prices? of /i.test(pair[1]) && !/^the prices? of /i.test(pair[2])
      ? `the price of ${pair[2]}`
      : pair[2];
    const second = localizeComparisonTarget(secondSource, locale);
    return locale === "hi-IN"
      ? `${base} ${first} की तुलना ${second} से करें।`
      : `${base} ${first} ਦੀ ਤੁਲਨਾ ${second} ਨਾਲ ਕਰੋ।`;
  }
  const missingSymbol = row.stem.match(/coded symbol '(.+?)' means/i);
  if (missingSymbol) {
    return locale === "hi-IN"
      ? `परीक्षण के परिणामों से निर्धारित करें कि कोड-चिह्न '${missingSymbol[1]}' का क्या अर्थ है।`
      : `ਪਰਖ ਦੇ ਨਤੀਜਿਆਂ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਕੋਡ-ਚਿੰਨ੍ਹ '${missingSymbol[1]}' ਦਾ ਕੀ ਅਰਥ ਹੈ।`;
  }
  const requiredEndpoint = row.stem.match(/strongest endpoint relation is (.+?)\?$/i);
  if (requiredEndpoint) {
    return locale === "hi-IN"
      ? `खाली स्थान में कौन-सा संबंध रखने पर सबसे मजबूत अंतिम संबंध ${localizeEntityNames(requiredEndpoint[1], locale)} बनेगा?`
      : `ਖਾਲੀ ਥਾਂ ਵਿੱਚ ਕਿਹੜਾ ਸੰਬੰਧ ਰੱਖਣ ਨਾਲ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਅੰਤਲਾ ਸੰਬੰਧ ${localizeEntityNames(requiredEndpoint[1], locale)} ਬਣੇਗਾ?`;
  }
  const establishing = row.stem.match(/has (.+?) as its strongest definite endpoint relation\?$/i);
  if (establishing) {
    return locale === "hi-IN"
      ? `कौन-सा कथन-समूह ${localizeEntityNames(establishing[1], locale)} को सबसे मजबूत निश्चित अंतिम संबंध बनाता है?`
      : `ਕਿਹੜਾ ਕਥਨ-ਸਮੂਹ ${localizeEntityNames(establishing[1], locale)} ਨੂੰ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਅੰਤਲਾ ਸੰਬੰਧ ਬਣਾਉਂਦਾ ਹੈ?`;
  }
  return base;
}

function extractSymbolSummary(row: IneEnglishReviewRow): string | undefined {
  const source = row.mockSolution ?? row.mockExplanation ?? row.explanation ?? "";
  const match = source.match(/(?:In symbols|After decoding):\s*([^\n.]+)/i);
  return match?.[1]?.trim();
}

function extractReasoningRelations(row: IneEnglishReviewRow): string[] {
  const symbolSummary = extractSymbolSummary(row);
  if (symbolSummary) return [symbolSummary];

  const source = row.mockSolution ?? row.mockExplanation ?? row.explanation ?? "";
  const opening = source.split(/\.\s+/).slice(0, 3).join(". ");
  const entity = "(?:Product [A-Z]|Plant [A-Z]|[A-Z][a-z]+|[A-Z])";
  const chainPattern = new RegExp(`${entity}(?:\\s*[><=≤≥]\\s*${entity})+`, "g");
  const extracted = opening.match(chainPattern) ?? [];
  const unique = [...new Set(extracted.map((entry) => entry.trim()))];
  if (unique.length > 0) return unique.slice(0, 6);

  return (row.statements ?? [])
    .filter((statement) => /[><=≤≥]/.test(statement))
    .slice(0, 4);
}

function reasoningLead(row: IneEnglishReviewRow, locale: IneTranslatedLocale): string {
  const relations = extractReasoningRelations(row).map((entry) => localizeEntityNames(entry, locale));
  if (relations.length === 0) {
    return locale === "hi-IN"
      ? "दी गई जानकारी को एक-एक करके जाँचें।"
      : "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜਾਂਚੋ।";
  }
  const joined = relations.join(locale === "hi-IN" ? "; " : "; ");
  return locale === "hi-IN"
    ? `मुख्य तुलना देखें: ${joined}।`
    : `ਮੁੱਖ ਤੁਲਨਾ ਵੇਖੋ: ${joined}।`;
}

function localizedExplanation(
  row: IneEnglishReviewRow,
  locale: IneTranslatedLocale,
  correctOption: string,
): string {
  const coded = row.authorityId.includes("CODE") || row.authorityId.includes("MAP");
  const isConclusion = row.authorityId.includes("CONCLUSION") || row.authorityId.includes("EITHER_OR");
  const isPair = row.authorityId.includes("PAIR");
  const isPossible = row.authorityId.includes("POSSIBLE");
  const isImpossible = row.authorityId.includes("IMPOSSIBLE");
  const isIndeterminate = /cannot be determined/i.test(row.correctOption);
  const isContradiction = row.authorityId === "IDENTIFY_CONTRADICTORY_ADDITION";
  const isMapRecovery = row.authorityId === "RECOVER_MISSING_MAP_ENTRY";
  const isMapSelection = row.authorityId === "IDENTIFY_ONLY_CONSISTENT_CODE_MAP";
  const isMissing = row.authorityId.includes("MISSING") || row.authorityId === "RECONSTRUCT_MISSING_RELATION";
  const lead = reasoningLead(row, locale);

  if (locale === "hi-IN") {
    if (row.authorityId === "INTERPRET_LINGUISTIC_RELATION") return `दिए गए वाक्य का सांकेतिक रूप ${correctOption} है। दोनों में वही तुलना है, इसलिए यही सही विकल्प है।`;
    if (isMapRecovery) return `परीक्षणों में बराबर मान वाला उदाहरण असत्य है, इसलिए समावेशी संबंध हट जाता है। अतः कोड-चिह्न का अर्थ ${correctOption} है।`;
    if (isMapSelection) return `हर कोड-चिह्न को दिए गए सत्य और असत्य उदाहरणों पर जाँचें। केवल ${correctOption} सभी परिणामों से मेल खाता है।`;
    if (isContradiction) return `${lead} ${correctOption} जोड़ने पर बने हुए संबंध का उलटा परिणाम आता है। इसलिए यही कथन नहीं जोड़ा जा सकता।`;
    if (isMissing) return `${lead} खाली स्थान पर ${correctOption} रखने से आवश्यक अंतिम संबंध ठीक बनता है। बाकी विकल्प परिणाम बदल देते हैं।`;
    if (isIndeterminate) return `${lead} इन तुलनाओं से पूछे गए दोनों पदों का एक निश्चित क्रम नहीं बनता। इसलिए संबंध निर्धारित नहीं किया जा सकता।`;
    if (isImpossible) return `${lead} ${correctOption} बने हुए संबंध के विपरीत है। इसलिए यह निष्कर्ष असंभव है।`;
    if (row.authorityId === "IDENTIFY_ALL_POSSIBLE_RELATIONS") return `${lead} इससे ${correctOption} वाली सभी स्थितियाँ संभव रहती हैं। इसलिए यही पूरा उत्तर है।`;
    if (isPossible) return `${lead} ${correctOption} कथनों का विरोध नहीं करता, पर हर स्थिति में निश्चित भी नहीं है। इसलिए यही संभव उत्तर है।`;
    if (isPair) return `${lead} दोनों हिस्सों को साथ जाँचने पर सही विकल्प ${correctOption} है। यही सभी संभव स्थितियों को ठीक से दर्शाता है।`;
    if (isConclusion) return `${lead} अब प्रत्येक निष्कर्ष को इस तुलना से मिलाएँ। सही उत्तर है: ${correctOption}।`;
    if (coded) return `${lead} कोड खोलकर संबंध जोड़ने पर सही उत्तर ${correctOption} मिलता है।`;
    return `${lead} इन संबंधों को जोड़ने पर सबसे मजबूत निश्चित उत्तर ${correctOption} मिलता है।`;
  }

  if (row.authorityId === "INTERPRET_LINGUISTIC_RELATION") return `ਦਿੱਤੇ ਵਾਕ ਦਾ ਸੰਕੇਤਕ ਰੂਪ ${correctOption} ਹੈ। ਦੋਵਾਂ ਵਿੱਚ ਇੱਕੋ ਤੁਲਨਾ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਚੋਣ ਹੈ।`;
  if (isMapRecovery) return `ਪਰਖਾਂ ਵਿੱਚ ਬਰਾਬਰ ਮੁੱਲ ਵਾਲੀ ਉਦਾਹਰਨ ਗਲਤ ਹੈ, ਇਸ ਲਈ ਸਮਾਵੇਸ਼ੀ ਸੰਬੰਧ ਹਟ ਜਾਂਦਾ ਹੈ। ਇਸ ਕਰਕੇ ਕੋਡ-ਚਿੰਨ੍ਹ ਦਾ ਅਰਥ ${correctOption} ਹੈ।`;
  if (isMapSelection) return `ਹਰ ਕੋਡ-ਚਿੰਨ੍ਹ ਨੂੰ ਦਿੱਤੀਆਂ ਸਹੀ ਅਤੇ ਗਲਤ ਉਦਾਹਰਨਾਂ 'ਤੇ ਜਾਂਚੋ। ਕੇਵਲ ${correctOption} ਸਾਰੇ ਨਤੀਜਿਆਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`;
  if (isContradiction) return `${lead} ${correctOption} ਜੋੜਨ ਨਾਲ ਬਣੇ ਹੋਏ ਸੰਬੰਧ ਦਾ ਉਲਟ ਨਤੀਜਾ ਆਉਂਦਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਕਥਨ ਨਹੀਂ ਜੋੜਿਆ ਜਾ ਸਕਦਾ।`;
  if (isMissing) return `${lead} ਖਾਲੀ ਥਾਂ 'ਤੇ ${correctOption} ਰੱਖਣ ਨਾਲ ਲੋੜੀਂਦਾ ਅੰਤਲਾ ਸੰਬੰਧ ਠੀਕ ਬਣਦਾ ਹੈ। ਬਾਕੀ ਚੋਣਾਂ ਨਤੀਜਾ ਬਦਲ ਦਿੰਦੀਆਂ ਹਨ।`;
  if (isIndeterminate) return `${lead} ਇਨ੍ਹਾਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਪੁੱਛੇ ਗਏ ਦੋਵਾਂ ਪਦਾਂ ਦਾ ਇੱਕ ਯਕੀਨੀ ਕ੍ਰਮ ਨਹੀਂ ਬਣਦਾ। ਇਸ ਲਈ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`;
  if (isImpossible) return `${lead} ${correctOption} ਬਣੇ ਹੋਏ ਸੰਬੰਧ ਦੇ ਉਲਟ ਹੈ। ਇਸ ਲਈ ਇਹ ਨਤੀਜਾ ਅਸੰਭਵ ਹੈ।`;
  if (row.authorityId === "IDENTIFY_ALL_POSSIBLE_RELATIONS") return `${lead} ਇਸ ਤੋਂ ${correctOption} ਵਾਲੀਆਂ ਸਾਰੀਆਂ ਹਾਲਤਾਂ ਸੰਭਵ ਰਹਿੰਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਇਹੀ ਪੂਰਾ ਉੱਤਰ ਹੈ।`;
  if (isPossible) return `${lead} ${correctOption} ਕਥਨਾਂ ਦਾ ਵਿਰੋਧ ਨਹੀਂ ਕਰਦਾ, ਪਰ ਹਰ ਹਾਲਤ ਵਿੱਚ ਯਕੀਨੀ ਵੀ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਸੰਭਵ ਉੱਤਰ ਹੈ।`;
  if (isPair) return `${lead} ਦੋਵੇਂ ਹਿੱਸੇ ਇਕੱਠੇ ਜਾਂਚਣ 'ਤੇ ਸਹੀ ਚੋਣ ${correctOption} ਹੈ। ਇਹੀ ਸਾਰੀਆਂ ਸੰਭਵ ਹਾਲਤਾਂ ਨੂੰ ਠੀਕ ਤਰੀਕੇ ਨਾਲ ਦਿਖਾਉਂਦੀ ਹੈ।`;
  if (isConclusion) return `${lead} ਹੁਣ ਹਰ ਨਤੀਜੇ ਨੂੰ ਇਸ ਤੁਲਨਾ ਨਾਲ ਮਿਲਾਓ। ਸਹੀ ਉੱਤਰ ਹੈ: ${correctOption}।`;
  if (coded) return `${lead} ਕੋਡ ਖੋਲ੍ਹ ਕੇ ਸੰਬੰਧ ਜੋੜਨ 'ਤੇ ਸਹੀ ਉੱਤਰ ${correctOption} ਮਿਲਦਾ ਹੈ।`;
  return `${lead} ਇਨ੍ਹਾਂ ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜਨ 'ਤੇ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਉੱਤਰ ${correctOption} ਮਿਲਦਾ ਹੈ।`;
}

export function localizeIneQuestion(
  row: IneEnglishReviewRow,
  checkpointId: string,
  locale: IneTranslatedLocale,
): LocalizedIneQuestion {
  const correctIndex = row.correctIndex ?? row.options.indexOf(row.correctOption);
  if (correctIndex < 0 || correctIndex >= row.options.length) {
    throw new Error(`Invalid correct option for ${row.recordId ?? `${row.authorityId}-${row.seed}`}`);
  }
  const options = row.options.map((option) => translateIneOption(option, locale));
  const correctOption = options[correctIndex];
  const rawConclusions = row.conclusions ?? (row.conclusion ? [row.conclusion] : []);

  return {
    checkpointId,
    sourceRecordId: row.recordId ?? `${checkpointId}-${row.authorityId}-${row.seed}`,
    authorityId: row.authorityId,
    seed: row.seed,
    locale,
    contentClass: ineContentClass(row.authorityId),
    optionStandard: ineOptionStandard(row.authorityId),
    difficulty: row.difficulty,
    deliveryProfile: row.deliveryProfile ?? "GUIDED_CONCEPT",
    ...(row.examApplicability === undefined ? {} : { examApplicability: row.examApplicability }),
    stem: translatedStem(row, locale),
    statements: (row.statements ?? []).map((statement) => translateIneStatement(statement, locale)),
    conclusions: rawConclusions.map((conclusion) => translateIneStatement(conclusion, locale)),
    codeKey: (row.codeKey ?? []).map((line) => translateCodeKeyLine(line, locale)),
    evidence: (row.evidence ?? []).map((line) => translateEvidenceLine(line, locale)),
    options,
    correctIndex,
    correctOption,
    explanation: localizedExplanation(row, locale, correctOption),
    permanentQlId: null,
    questionStudioVisible: false,
  };
}
