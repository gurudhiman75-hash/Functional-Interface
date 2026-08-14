import { ineLanguagePack } from "./language-pack";
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

const CONTEXT_TERMS: Record<IneTranslatedLocale, Record<string, string>> = {
  "hi-IN": {
    marks: "अंक",
    salary: "वेतन",
    height: "लंबाई",
    weight: "वज़न",
    score: "स्कोर",
    price: "कीमत",
    production: "उत्पादन",
  },
  "pa-IN": {
    marks: "ਅੰਕ",
    salary: "ਤਨਖਾਹ",
    height: "ਕੱਦ",
    weight: "ਭਾਰ",
    score: "ਸਕੋਰ",
    price: "ਕੀਮਤ",
    production: "ਉਤਪਾਦਨ",
  },
};

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
  const term = CONTEXT_TERMS[locale][context.toLowerCase()] ?? context;
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
    return `${left} का ${term}, ${right} के ${term} ${relationText[relation] ?? relation} है।`;
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
  return `${left} ਦਾ ${term}, ${right} ਦੇ ${term} ${relationText[relation] ?? relation} ਹੈ।`;
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
  if (generic) return relationClause(generic[1], generic[2].toLowerCase(), generic[3], locale);
  return clean;
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
  return text.replace(/\s+and\s+/gi, joiner).replace(/\s+or\s+/gi, alternative);
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

function translatedStem(row: IneEnglishReviewRow, locale: IneTranslatedLocale): string {
  const stem = STEMS[row.authorityId];
  if (!stem) throw new Error(`INE-001 localization has no stem for authority ${row.authorityId}`);
  const base = stem[locale === "hi-IN" ? 0 : 1];
  const compared = row.stem.match(/for (.+?) compared with (.+?)\?$/i);
  const between = row.stem.match(/between (.+?) and (.+?)(?: is [^?]+)?\?$/i);
  const pair = compared ?? between;
  if (pair) {
    return locale === "hi-IN"
      ? `${base} तुलना ${pair[1]} और ${pair[2]} के बीच करनी है।`
      : `${base} ਤੁਲਨਾ ${pair[1]} ਅਤੇ ${pair[2]} ਵਿਚਕਾਰ ਕਰਨੀ ਹੈ।`;
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
      ? `खाली स्थान में कौन-सा संबंध रखने पर सबसे मजबूत अंतिम संबंध ${requiredEndpoint[1]} बनेगा?`
      : `ਖਾਲੀ ਥਾਂ ਵਿੱਚ ਕਿਹੜਾ ਸੰਬੰਧ ਰੱਖਣ ਨਾਲ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਅੰਤਲਾ ਸੰਬੰਧ ${requiredEndpoint[1]} ਬਣੇਗਾ?`;
  }
  const establishing = row.stem.match(/has (.+?) as its strongest definite endpoint relation\?$/i);
  if (establishing) {
    return locale === "hi-IN"
      ? `कौन-सा कथन-समूह ${establishing[1]} को सबसे मजबूत निश्चित अंतिम संबंध बनाता है?`
      : `ਕਿਹੜਾ ਕਥਨ-ਸਮੂਹ ${establishing[1]} ਨੂੰ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਅੰਤਲਾ ਸੰਬੰਧ ਬਣਾਉਂਦਾ ਹੈ?`;
  }
  return base;
}

function extractSymbolSummary(row: IneEnglishReviewRow): string | undefined {
  const source = row.mockSolution ?? row.mockExplanation ?? row.explanation ?? "";
  const match = source.match(/(?:In symbols|After decoding):\s*([^\n.]+)/i);
  return match?.[1]?.trim();
}

function localizedExplanation(
  row: IneEnglishReviewRow,
  locale: IneTranslatedLocale,
  correctOption: string,
): string {
  const symbols = extractSymbolSummary(row);
  const coded = row.authorityId.includes("CODE") || row.authorityId.includes("MAP");
  const isConclusion = row.authorityId.includes("CONCLUSION") || row.authorityId.includes("EITHER_OR");
  const isPair = row.authorityId.includes("PAIR");
  const isPossible = row.authorityId.includes("POSSIBLE");
  const isImpossible = row.authorityId.includes("IMPOSSIBLE");
  const isContradiction = row.authorityId === "IDENTIFY_CONTRADICTORY_ADDITION";
  const isMapRecovery = row.authorityId === "RECOVER_MISSING_MAP_ENTRY";
  const isMapSelection = row.authorityId === "IDENTIFY_ONLY_CONSISTENT_CODE_MAP";
  const isMissing = row.authorityId.includes("MISSING") || row.authorityId === "RECONSTRUCT_MISSING_RELATION";

  if (locale === "hi-IN") {
    const prefix = symbols
      ? `कथनों को चिह्नों में लिखने पर ${symbols} मिलता है। `
      : coded
        ? "पहले दिए गए कोड का अर्थ लगाएँ और फिर संबंधों को जोड़ें। "
        : "कथनों को क्रम से जोड़कर केवल वही बात मानें जो हर स्थिति में सही रहती है। ";
    if (row.authorityId === "INTERPRET_LINGUISTIC_RELATION") return `दिए गए वाक्य का सांकेतिक रूप ${correctOption} है। शब्दों और चिह्नों का अर्थ एक ही है, इसलिए यही सही विकल्प है।`;
    if (isMapRecovery) return `परीक्षणों में बराबर मान वाला उदाहरण असत्य है, इसलिए समावेशी संबंध हट जाता है। अतः कोड-चिह्न का अर्थ ${correctOption} है।`;
    if (isMapSelection) return `हर कोड-चिह्न को दिए गए सत्य और असत्य उदाहरणों पर जाँचें। केवल ${correctOption} सभी परिणामों से मेल खाता है।`;
    if (isContradiction) return `${prefix}${correctOption} जोड़ने पर पहले से बने संबंध का उलटा अर्थ निकलता है, इसलिए यही कथन नहीं जोड़ा जा सकता।`;
    if (isMissing) return `${prefix}खाली स्थान पर ${correctOption} रखने से आवश्यक अंतिम संबंध ठीक बनता है; बाकी विकल्प संबंध को बदल देते हैं या कमजोर कर देते हैं।`;
    if (isImpossible) return `${prefix}${correctOption} कथनों के निश्चित संबंध के विपरीत है, इसलिए यह संभव नहीं है।`;
    if (isPossible) return `${prefix}${correctOption} कथनों का विरोध नहीं करता, लेकिन हर स्थिति में निश्चित भी नहीं है। इसलिए यही संभव उत्तर है।`;
    if (isPair) return `${prefix}दोनों हिस्सों को साथ जाँचने पर सही विकल्प है: ${correctOption}। यही सभी संभव स्थितियों को ठीक से दर्शाता है।`;
    if (isConclusion) return `${prefix}हर निष्कर्ष को अलग-अलग जाँचने पर सही विकल्प है: ${correctOption}।`;
    if (coded) return `${prefix}कोड खोलने के बाद सही विकल्प है: ${correctOption}।`;
    return `${prefix}इसलिए सबसे मजबूत निश्चित उत्तर है: ${correctOption}।`;
  }

  const prefix = symbols
    ? `ਕਥਨਾਂ ਨੂੰ ਚਿੰਨ੍ਹਾਂ ਵਿੱਚ ਲਿਖਣ 'ਤੇ ${symbols} ਮਿਲਦਾ ਹੈ। `
    : coded
      ? "ਪਹਿਲਾਂ ਦਿੱਤੇ ਕੋਡ ਦਾ ਅਰਥ ਲਗਾਓ ਅਤੇ ਫਿਰ ਸੰਬੰਧ ਜੋੜੋ। "
      : "ਕਥਨਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਜੋੜ ਕੇ ਕੇਵਲ ਉਹੀ ਗੱਲ ਮੰਨੋ ਜੋ ਹਰ ਹਾਲਤ ਵਿੱਚ ਸਹੀ ਰਹਿੰਦੀ ਹੈ। ";
  if (row.authorityId === "INTERPRET_LINGUISTIC_RELATION") return `ਦਿੱਤੇ ਵਾਕ ਦਾ ਸੰਕੇਤਕ ਰੂਪ ${correctOption} ਹੈ। ਸ਼ਬਦਾਂ ਅਤੇ ਚਿੰਨ੍ਹਾਂ ਦਾ ਅਰਥ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਚੋਣ ਹੈ।`;
  if (isMapRecovery) return `ਪਰਖਾਂ ਵਿੱਚ ਬਰਾਬਰ ਮੁੱਲ ਵਾਲੀ ਉਦਾਹਰਨ ਗਲਤ ਹੈ, ਇਸ ਲਈ ਸਮਾਵੇਸ਼ੀ ਸੰਬੰਧ ਹਟ ਜਾਂਦਾ ਹੈ। ਇਸ ਕਰਕੇ ਕੋਡ-ਚਿੰਨ੍ਹ ਦਾ ਅਰਥ ${correctOption} ਹੈ।`;
  if (isMapSelection) return `ਹਰ ਕੋਡ-ਚਿੰਨ੍ਹ ਨੂੰ ਦਿੱਤੀਆਂ ਸਹੀ ਅਤੇ ਗਲਤ ਉਦਾਹਰਨਾਂ 'ਤੇ ਜਾਂਚੋ। ਕੇਵਲ ${correctOption} ਸਾਰੇ ਨਤੀਜਿਆਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`;
  if (isContradiction) return `${prefix}${correctOption} ਜੋੜਨ ਨਾਲ ਪਹਿਲਾਂ ਬਣੇ ਸੰਬੰਧ ਦਾ ਉਲਟ ਅਰਥ ਨਿਕਲਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਥਨ ਨਹੀਂ ਜੋੜਿਆ ਜਾ ਸਕਦਾ।`;
  if (isMissing) return `${prefix}ਖਾਲੀ ਥਾਂ 'ਤੇ ${correctOption} ਰੱਖਣ ਨਾਲ ਲੋੜੀਂਦਾ ਅੰਤਲਾ ਸੰਬੰਧ ਠੀਕ ਬਣਦਾ ਹੈ; ਬਾਕੀ ਚੋਣਾਂ ਸੰਬੰਧ ਨੂੰ ਬਦਲ ਜਾਂ ਕਮਜ਼ੋਰ ਕਰ ਦਿੰਦੀਆਂ ਹਨ।`;
  if (isImpossible) return `${prefix}${correctOption} ਕਥਨਾਂ ਦੇ ਯਕੀਨੀ ਸੰਬੰਧ ਦੇ ਉਲਟ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਭਵ ਨਹੀਂ ਹੈ।`;
  if (isPossible) return `${prefix}${correctOption} ਕਥਨਾਂ ਦਾ ਵਿਰੋਧ ਨਹੀਂ ਕਰਦਾ, ਪਰ ਹਰ ਹਾਲਤ ਵਿੱਚ ਯਕੀਨੀ ਵੀ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਸੰਭਵ ਉੱਤਰ ਹੈ।`;
  if (isPair) return `${prefix}ਦੋਵੇਂ ਹਿੱਸੇ ਇਕੱਠੇ ਜਾਂਚਣ 'ਤੇ ਸਹੀ ਚੋਣ ਹੈ: ${correctOption}। ਇਹੀ ਸਾਰੀਆਂ ਸੰਭਵ ਹਾਲਤਾਂ ਨੂੰ ਠੀਕ ਤਰੀਕੇ ਨਾਲ ਦਿਖਾਉਂਦੀ ਹੈ।`;
  if (isConclusion) return `${prefix}ਹਰ ਨਤੀਜੇ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚਣ 'ਤੇ ਸਹੀ ਚੋਣ ਹੈ: ${correctOption}।`;
  if (coded) return `${prefix}ਕੋਡ ਖੋਲ੍ਹਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਚੋਣ ਹੈ: ${correctOption}।`;
  return `${prefix}ਇਸ ਲਈ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਯਕੀਨੀ ਉੱਤਰ ਹੈ: ${correctOption}।`;
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
