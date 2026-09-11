export type AnaCp010Locale = "en-IN" | "hi-IN" | "pa-IN";
export type AnaCp010SemanticRelationId =
  | "SEM_INSTITUTION_CONTENT"
  | "SEM_DWELLING"
  | "SEM_ACTIVITY_VENUE"
  | "SEM_PAIRED_OBJECTS"
  | "SEM_CAUSE_EFFECT"
  | "SEM_PROBLEM_REMEDY"
  | "SEM_SPORT_EQUIPMENT"
  | "SEM_DISEASE_ORGAN"
  | "SEM_AUTHOR_WORK";

export interface AnaCp010LocalizedText {
  readonly "en-IN": string;
  readonly "hi-IN": string;
  readonly "pa-IN": string;
}

export interface AnaCp010SemanticFact {
  id: string;
  relationId: AnaCp010SemanticRelationId;
  left: AnaCp010LocalizedText;
  right: AnaCp010LocalizedText;
}

export interface AnaCp010SemanticRelation {
  id: AnaCp010SemanticRelationId;
  label: AnaCp010LocalizedText;
  ruleStatement: AnaCp010LocalizedText;
  facts: readonly AnaCp010SemanticFact[];
}

const t = (en: string, hi: string, pa: string): AnaCp010LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const fact = (
  relationId: AnaCp010SemanticRelationId,
  ordinal: number,
  left: AnaCp010LocalizedText,
  right: AnaCp010LocalizedText,
): AnaCp010SemanticFact => ({ id: `${relationId}-${ordinal}`, relationId, left, right });

export const ANA_CP010_SEMANTIC_RELATIONS: readonly AnaCp010SemanticRelation[] = [
  {
    id: "SEM_INSTITUTION_CONTENT",
    label: t("place and its usual contents", "स्थान और उसमें मिलने वाली वस्तुएँ", "ਥਾਂ ਅਤੇ ਉੱਥੇ ਮਿਲਣ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ"),
    ruleStatement: t("The second term is what is characteristically found or kept in the first.", "दूसरा शब्द वह चीज़ है जो सामान्यतः पहले स्थान में मिलती या रखी जाती है।", "ਦੂਜਾ ਸ਼ਬਦ ਉਹ ਚੀਜ਼ ਹੈ ਜੋ ਆਮ ਤੌਰ ਤੇ ਪਹਿਲੀ ਥਾਂ ਵਿੱਚ ਮਿਲਦੀ ਜਾਂ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।"),
    facts: [
      fact("SEM_INSTITUTION_CONTENT", 1, t("Library", "पुस्तकालय", "ਲਾਇਬ੍ਰੇਰੀ"), t("Books", "पुस्तकें", "ਕਿਤਾਬਾਂ")),
      fact("SEM_INSTITUTION_CONTENT", 2, t("Museum", "संग्रहालय", "ਅਜਾਇਬ ਘਰ"), t("Artefacts", "पुरावस्तुएँ", "ਪੁਰਾਤਨ ਵਸਤੂਆਂ")),
      fact("SEM_INSTITUTION_CONTENT", 3, t("Gallery", "कला दीर्घा", "ਕਲਾ ਗੈਲਰੀ"), t("Paintings", "चित्र", "ਚਿੱਤਰ")),
      fact("SEM_INSTITUTION_CONTENT", 4, t("Zoo", "चिड़ियाघर", "ਚਿੜੀਆਘਰ"), t("Animals", "जानवर", "ਜਾਨਵਰ")),
      fact("SEM_INSTITUTION_CONTENT", 5, t("Aquarium", "एक्वेरियम", "ਐਕਵੇਰੀਅਮ"), t("Fish", "मछलियाँ", "ਮੱਛੀਆਂ")),
      fact("SEM_INSTITUTION_CONTENT", 6, t("Warehouse", "गोदाम", "ਗੋਦਾਮ"), t("Goods", "सामान", "ਸਾਮਾਨ")),
    ],
  },
  {
    id: "SEM_DWELLING",
    label: t("living being and dwelling", "जीव और उसका रहने का स्थान", "ਜੀਵ ਅਤੇ ਉਸ ਦਾ ਰਹਿਣ ਵਾਲਾ ਥਾਂ"),
    ruleStatement: t("The second term is the usual dwelling of the first.", "दूसरा शब्द पहले जीव का सामान्य रहने का स्थान है।", "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਜੀਵ ਦਾ ਆਮ ਰਹਿਣ ਵਾਲਾ ਥਾਂ ਹੈ।"),
    facts: [
      fact("SEM_DWELLING", 1, t("Lion", "शेर", "ਸ਼ੇਰ"), t("Den", "मांद", "ਮਾਂਦ")),
      fact("SEM_DWELLING", 2, t("Bird", "पक्षी", "ਪੰਛੀ"), t("Nest", "घोंसला", "ਘੋਂਸਲਾ")),
      fact("SEM_DWELLING", 3, t("Horse", "घोड़ा", "ਘੋੜਾ"), t("Stable", "अस्तबल", "ਅਸਤਬਲ")),
      fact("SEM_DWELLING", 4, t("Bee", "मधुमक्खी", "ਮਧੂਮੱਖੀ"), t("Hive", "छत्ता", "ਛੱਤਾ")),
      fact("SEM_DWELLING", 5, t("Rabbit", "खरगोश", "ਖਰਗੋਸ਼"), t("Burrow", "बिल", "ਬਿੱਲ")),
      fact("SEM_DWELLING", 6, t("Dog", "कुत्ता", "ਕੁੱਤਾ"), t("Kennel", "कुत्ताघर", "ਕੁੱਤਾ-ਘਰ")),
    ],
  },
  {
    id: "SEM_ACTIVITY_VENUE",
    label: t("activity and venue", "खेल/गतिविधि और स्थान", "ਖੇਡ/ਗਤੀਵਿਧੀ ਅਤੇ ਥਾਂ"),
    ruleStatement: t("The second term is the usual place where the first activity is performed.", "दूसरा शब्द वह स्थान है जहाँ पहली गतिविधि सामान्यतः की जाती है।", "ਦੂਜਾ ਸ਼ਬਦ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਪਹਿਲੀ ਗਤੀਵਿਧੀ ਆਮ ਤੌਰ ਤੇ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।"),
    facts: [
      fact("SEM_ACTIVITY_VENUE", 1, t("Tennis", "टेनिस", "ਟੈਨਿਸ"), t("Court", "कोर्ट", "ਕੋਰਟ")),
      fact("SEM_ACTIVITY_VENUE", 2, t("Boxing", "मुक्केबाज़ी", "ਮੁੱਕੇਬਾਜ਼ੀ"), t("Ring", "रिंग", "ਰਿੰਗ")),
      fact("SEM_ACTIVITY_VENUE", 3, t("Cricket", "क्रिकेट", "ਕ੍ਰਿਕਟ"), t("Pitch", "पिच", "ਪਿਚ")),
      fact("SEM_ACTIVITY_VENUE", 4, t("Swimming", "तैराकी", "ਤੈਰਾਕੀ"), t("Pool", "पूल", "ਪੂਲ")),
      fact("SEM_ACTIVITY_VENUE", 5, t("Skating", "स्केटिंग", "ਸਕੇਟਿੰਗ"), t("Rink", "रिंक", "ਰਿੰਕ")),
      fact("SEM_ACTIVITY_VENUE", 6, t("Athletics", "एथलेटिक्स", "ਐਥਲੈਟਿਕਸ"), t("Track", "ट्रैक", "ਟਰੈਕ")),
    ],
  },
  {
    id: "SEM_PAIRED_OBJECTS",
    label: t("commonly paired objects", "साथ उपयोग होने वाली वस्तुएँ", "ਇਕੱਠੇ ਵਰਤੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ"),
    ruleStatement: t("The two terms are objects that are characteristically used or found together.", "दोनों शब्द ऐसी वस्तुएँ हैं जो सामान्यतः साथ उपयोग या पाई जाती हैं।", "ਦੋਵੇਂ ਸ਼ਬਦ ਉਹ ਚੀਜ਼ਾਂ ਹਨ ਜੋ ਆਮ ਤੌਰ ਤੇ ਇਕੱਠੇ ਵਰਤੀਆਂ ਜਾਂ ਮਿਲਦੀਆਂ ਹਨ।"),
    facts: [
      fact("SEM_PAIRED_OBJECTS", 1, t("Lock", "ताला", "ਤਾਲਾ"), t("Key", "चाबी", "ਚਾਬੀ")),
      fact("SEM_PAIRED_OBJECTS", 2, t("Cup", "कप", "ਕੱਪ"), t("Saucer", "तश्तरी", "ਤਸ਼ਤਰੀ")),
      fact("SEM_PAIRED_OBJECTS", 3, t("Pencil", "पेंसिल", "ਪੈਂਸਿਲ"), t("Eraser", "रबड़", "ਰਬੜ")),
      fact("SEM_PAIRED_OBJECTS", 4, t("Shoes", "जूते", "ਜੁੱਤੇ"), t("Socks", "मोज़े", "ਜੁਰਾਬਾਂ")),
      fact("SEM_PAIRED_OBJECTS", 5, t("Needle", "सुई", "ਸੂਈ"), t("Thread", "धागा", "ਧਾਗਾ")),
      fact("SEM_PAIRED_OBJECTS", 6, t("Bow", "धनुष", "ਧਨੁਸ਼"), t("Arrow", "तीर", "ਤੀਰ")),
    ],
  },
  {
    id: "SEM_CAUSE_EFFECT",
    label: t("cause and effect", "कारण और परिणाम", "ਕਾਰਨ ਅਤੇ ਨਤੀਜਾ"),
    ruleStatement: t("The first term commonly produces the second as an effect.", "पहला शब्द सामान्यतः दूसरे परिणाम को उत्पन्न करता है।", "ਪਹਿਲਾ ਸ਼ਬਦ ਆਮ ਤੌਰ ਤੇ ਦੂਜੇ ਨਤੀਜੇ ਦਾ ਕਾਰਨ ਬਣਦਾ ਹੈ।"),
    facts: [
      fact("SEM_CAUSE_EFFECT", 1, t("Joke", "मज़ाक", "ਮਜ਼ਾਕ"), t("Laughter", "हँसी", "ਹਾਸਾ")),
      fact("SEM_CAUSE_EFFECT", 2, t("Cut", "कटना", "ਕੱਟ"), t("Bleeding", "खून बहना", "ਖੂਨ ਵਗਣਾ")),
      fact("SEM_CAUSE_EFFECT", 3, t("Fire", "आग", "ਅੱਗ"), t("Burn", "जलना", "ਸੜਨਾ")),
      fact("SEM_CAUSE_EFFECT", 4, t("Wound", "घाव", "ਜ਼ਖ਼ਮ"), t("Pain", "दर्द", "ਦਰਦ")),
      fact("SEM_CAUSE_EFFECT", 5, t("Heavy rain", "तेज़ बारिश", "ਤੇਜ਼ ਮੀਂਹ"), t("Flood", "बाढ़", "ਹੜ੍ਹ")),
      fact("SEM_CAUSE_EFFECT", 6, t("Stress", "तनाव", "ਤਣਾਅ"), t("Anxiety", "चिंता", "ਚਿੰਤਾ")),
    ],
  },
  {
    id: "SEM_PROBLEM_REMEDY",
    label: t("state and remedy", "स्थिति और उपाय", "ਹਾਲਤ ਅਤੇ ਉਪਾਅ"),
    ruleStatement: t("The second term is a usual action or remedy for the first state.", "दूसरा शब्द पहली स्थिति के लिए सामान्य क्रिया या उपाय है।", "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੀ ਹਾਲਤ ਲਈ ਆਮ ਕਿਰਿਆ ਜਾਂ ਉਪਾਅ ਹੈ।"),
    facts: [
      fact("SEM_PROBLEM_REMEDY", 1, t("Thirst", "प्यास", "ਪਿਆਸ"), t("Drink", "पीना", "ਪੀਣਾ")),
      fact("SEM_PROBLEM_REMEDY", 2, t("Hunger", "भूख", "ਭੁੱਖ"), t("Eat", "खाना", "ਖਾਣਾ")),
      fact("SEM_PROBLEM_REMEDY", 3, t("Itch", "खुजली", "ਖੁਜਲੀ"), t("Scratch", "खुजलाना", "ਖੁਜਲਾਉਣਾ")),
      fact("SEM_PROBLEM_REMEDY", 4, t("Fatigue", "थकान", "ਥਕਾਵਟ"), t("Rest", "आराम", "ਆਰਾਮ")),
      fact("SEM_PROBLEM_REMEDY", 5, t("Darkness", "अँधेरा", "ਹਨੇਰਾ"), t("Light", "रोशनी", "ਰੌਸ਼ਨੀ")),
      fact("SEM_PROBLEM_REMEDY", 6, t("Illness", "बीमारी", "ਬਿਮਾਰੀ"), t("Treatment", "इलाज", "ਇਲਾਜ")),
    ],
  },
  {
    id: "SEM_SPORT_EQUIPMENT",
    label: t("sport and equipment", "खेल और उपकरण", "ਖੇਡ ਅਤੇ ਸਾਜ਼ੋ-ਸਾਮਾਨ"),
    ruleStatement: t("The second term is equipment characteristically used in the first sport.", "दूसरा शब्द वह उपकरण है जो पहले खेल में सामान्यतः उपयोग होता है।", "ਦੂਜਾ ਸ਼ਬਦ ਉਹ ਸਾਮਾਨ ਹੈ ਜੋ ਪਹਿਲੀ ਖੇਡ ਵਿੱਚ ਆਮ ਤੌਰ ਤੇ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"),
    facts: [
      fact("SEM_SPORT_EQUIPMENT", 1, t("Cricket", "क्रिकेट", "ਕ੍ਰਿਕਟ"), t("Bat", "बल्ला", "ਬੱਲਾ")),
      fact("SEM_SPORT_EQUIPMENT", 2, t("Hockey", "हॉकी", "ਹਾਕੀ"), t("Stick", "स्टिक", "ਸਟਿਕ")),
      fact("SEM_SPORT_EQUIPMENT", 3, t("Tennis", "टेनिस", "ਟੈਨਿਸ"), t("Racket", "रैकेट", "ਰੈਕੇਟ")),
      fact("SEM_SPORT_EQUIPMENT", 4, t("Golf", "गोल्फ", "ਗੋਲਫ"), t("Club", "क्लब", "ਕਲੱਬ")),
      fact("SEM_SPORT_EQUIPMENT", 5, t("Archery", "तीरंदाज़ी", "ਤੀਰਅੰਦਾਜ਼ੀ"), t("Bow", "धनुष", "ਧਨੁਸ਼")),
      fact("SEM_SPORT_EQUIPMENT", 6, t("Boxing", "मुक्केबाज़ी", "ਮੁੱਕੇਬਾਜ਼ੀ"), t("Gloves", "दस्ताने", "ਦਸਤਾਨੇ")),
    ],
  },
  {
    id: "SEM_DISEASE_ORGAN",
    label: t("condition and affected organ", "रोग और प्रभावित अंग", "ਰੋਗ ਅਤੇ ਪ੍ਰਭਾਵਿਤ ਅੰਗ"),
    ruleStatement: t("The second term is the organ or body part characteristically affected by the first condition.", "दूसरा शब्द वह अंग है जो पहले रोग से सामान्यतः प्रभावित होता है।", "ਦੂਜਾ ਸ਼ਬਦ ਉਹ ਅੰਗ ਹੈ ਜੋ ਪਹਿਲੇ ਰੋਗ ਨਾਲ ਆਮ ਤੌਰ ਤੇ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦਾ ਹੈ।"),
    facts: [
      fact("SEM_DISEASE_ORGAN", 1, t("Hepatitis", "हेपेटाइटिस", "ਹੈਪੇਟਾਈਟਿਸ"), t("Liver", "यकृत", "ਜਿਗਰ")),
      fact("SEM_DISEASE_ORGAN", 2, t("Nephritis", "नेफ्राइटिस", "ਨੇਫਰਾਈਟਿਸ"), t("Kidneys", "गुर्दे", "ਗੁਰਦੇ")),
      fact("SEM_DISEASE_ORGAN", 3, t("Dermatitis", "डर्मेटाइटिस", "ਡਰਮਾਟਾਈਟਿਸ"), t("Skin", "त्वचा", "ਚਮੜੀ")),
      fact("SEM_DISEASE_ORGAN", 4, t("Gastritis", "गैस्ट्राइटिस", "ਗੈਸਟ੍ਰਾਈਟਿਸ"), t("Stomach", "पेट", "ਪੇਟ")),
      fact("SEM_DISEASE_ORGAN", 5, t("Conjunctivitis", "कंजंक्टिवाइटिस", "ਕੰਜੰਕਟਿਵਾਈਟਿਸ"), t("Eyes", "आँखें", "ਅੱਖਾਂ")),
      fact("SEM_DISEASE_ORGAN", 6, t("Pneumonia", "निमोनिया", "ਨਿਮੋਨੀਆ"), t("Lungs", "फेफड़े", "ਫੇਫੜੇ")),
    ],
  },
  {
    id: "SEM_AUTHOR_WORK",
    label: t("author and work", "लेखक और रचना", "ਲੇਖਕ ਅਤੇ ਰਚਨਾ"),
    ruleStatement: t("The second term is a well-known work written by the first author.", "दूसरा शब्द पहले लेखक द्वारा लिखी गई प्रसिद्ध रचना है।", "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਲੇਖਕ ਵੱਲੋਂ ਲਿਖੀ ਮਸ਼ਹੂਰ ਰਚਨਾ ਹੈ।"),
    facts: [
      fact("SEM_AUTHOR_WORK", 1, t("Shakespeare", "Shakespeare", "Shakespeare"), t("Hamlet", "Hamlet", "Hamlet")),
      fact("SEM_AUTHOR_WORK", 2, t("Milton", "Milton", "Milton"), t("Paradise Lost", "Paradise Lost", "Paradise Lost")),
      fact("SEM_AUTHOR_WORK", 3, t("Tagore", "Tagore", "Tagore"), t("Gitanjali", "Gitanjali", "Gitanjali")),
      fact("SEM_AUTHOR_WORK", 4, t("Orwell", "Orwell", "Orwell"), t("1984", "1984", "1984")),
      fact("SEM_AUTHOR_WORK", 5, t("Austen", "Austen", "Austen"), t("Pride and Prejudice", "Pride and Prejudice", "Pride and Prejudice")),
      fact("SEM_AUTHOR_WORK", 6, t("Dickens", "Dickens", "Dickens"), t("Oliver Twist", "Oliver Twist", "Oliver Twist")),
    ],
  },
] as const;

export function anaCp010SemanticRelationById(relationId: AnaCp010SemanticRelationId): AnaCp010SemanticRelation {
  const relation = ANA_CP010_SEMANTIC_RELATIONS.find((entry) => entry.id === relationId);
  if (!relation) throw new Error(`Unknown ANA-CP-010 semantic relation: ${relationId}`);
  return relation;
}

export function anaCp010SemanticFactById(factId: string): AnaCp010SemanticFact {
  for (const relation of ANA_CP010_SEMANTIC_RELATIONS) {
    const match = relation.facts.find((entry) => entry.id === factId);
    if (match) return match;
  }
  throw new Error(`Unknown ANA-CP-010 semantic fact: ${factId}`);
}
