import type { SylLocale } from "../foundation/types";
import type {
  SylLearnerExplanationModeV4,
  SylLearnerOptionVerdictV4,
} from "./learner-v4-types";

export interface SylLearnerCopyV4 {
  correctAnswer: string;
  why: string;
  diagram: string;
  otherOptions: string;
  examShortcut: string;
  administratorProof: string;
  existenceNote: string;
  option: string;
  conclusion: string;
  follows: string;
  doesNotFollow: string;
  therefore: string;
  directChainBridge: string;
  witnessSameMember: (inside: string, outside: string | null) => string;
  directContradiction: string;
  possibleNotDefinite: string;
  counterexample: string;
  possibilityModel: string;
  dualTrue: string;
  dualFalse: string;
  eitherOr: readonly string[];
  modelTrue: string;
  modelFalse: string;
  oneValidArrangement: string;
  forbidden: string;
  captionContainment: (inner: string, outer: string) => string;
  captionSeparation: (left: string, right: string) => string;
  captionOverlap: (left: string, right: string) => string;
  captionSomeNot: (subject: string, predicate: string) => string;
  captionOnlyFew: (subject: string, predicate: string) => string;
  captionChain: (inner: string, middle: string, outer: string) => string;
  captionWitnessTransfer: (inside: string, shared: string, outside: string) => string;
  captionImpossible: (left: string, right: string) => string;
  captionCounterexample: string;
  captionPossibility: string;
  captionDual: string;
  captionEitherOr: string;
  verdicts: Readonly<Record<SylLearnerOptionVerdictV4, string>>;
  modeLabels: Readonly<Record<SylLearnerExplanationModeV4, string>>;
}

export function learnerCopyV4(locale: SylLocale): SylLearnerCopyV4 {
  if (locale === "hi-IN") return {
    correctAnswer: "सही उत्तर",
    why: "क्यों?",
    diagram: "चित्र",
    otherOptions: "बाकी विकल्प गलत क्यों हैं?",
    examShortcut: "परीक्षा शॉर्टकट",
    administratorProof: "प्रशासक प्रमाण",
    existenceNote: "नोट: यह उत्तर अध्याय के गैर-रिक्त वर्ग नियम का उपयोग करता है।",
    option: "विकल्प",
    conclusion: "निष्कर्ष",
    follows: "निकलता है",
    doesNotFollow: "नहीं निकलता",
    therefore: "इसलिए",
    directChainBridge: "इन संबंधों को जोड़ने पर आवश्यक संबंध सीधे बनता है।",
    witnessSameMember: (inside, outside) =>
      outside
        ? `वही सदस्य ${inside} में है और ${outside} से बाहर है।`
        : `वही सदस्य ${inside} में है।`,
    directContradiction: "कथन और यह निष्कर्ष एक साथ सत्य नहीं हो सकते।",
    possibleNotDefinite: "यह संबंध संभव है, पर कथन इसे अनिवार्य नहीं बनाते।",
    counterexample: "एक ऐसी सही व्यवस्था बनाई जा सकती है जिसमें सभी कथन सत्य हों, पर यह निष्कर्ष असत्य हो।",
    possibilityModel: "एक सही व्यवस्था में सभी कथन और यह निष्कर्ष दोनों सत्य हैं।",
    dualTrue: "एक सही व्यवस्था में निष्कर्ष सत्य है।",
    dualFalse: "दूसरी सही व्यवस्था में निष्कर्ष असत्य है।",
    eitherOr: [
      "दोनों निष्कर्ष एक साथ सत्य नहीं हो सकते।",
      "दोनों एक साथ असत्य भी नहीं हो सकते।",
      "इसलिए ठीक एक निष्कर्ष सत्य होगा।",
    ],
    modelTrue: "सत्य हो सकता है",
    modelFalse: "असत्य हो सकता है",
    oneValidArrangement: "एक सही व्यवस्था",
    forbidden: "यह साझा सदस्य संभव नहीं",
    captionContainment: (inner, outer) => `${inner} का पूरा वृत्त ${outer} के अंदर है।`,
    captionSeparation: (left, right) => `${left} और ${right} के वृत्त अलग हैं।`,
    captionOverlap: (left, right) => `× ${left} और ${right} दोनों में है।`,
    captionSomeNot: (subject, predicate) => `× ${subject} में है, लेकिन ${predicate} में नहीं है।`,
    captionOnlyFew: (subject, predicate) => `एक × दोनों में है और दूसरा × केवल ${subject} में है।`,
    captionChain: (inner, middle, outer) => `${inner}, ${middle} के अंदर है और ${middle}, ${outer} के अंदर है।`,
    captionWitnessTransfer: (inside, shared, outside) => `× ${inside} और ${shared} दोनों में है। ${shared}, ${outside} से अलग है, इसलिए × ${outside} में नहीं है।`,
    captionImpossible: (left, right) => `${left} और ${right} अलग हैं; उनके साझा भाग में × रखना संभव नहीं है।`,
    captionCounterexample: "यह एक सही व्यवस्था है जिसमें निष्कर्ष असत्य रहता है।",
    captionPossibility: "यह एक सही व्यवस्था है जिसमें निष्कर्ष सत्य है।",
    captionDual: "पहली व्यवस्था निष्कर्ष को सत्य और दूसरी असत्य दिखाती है।",
    captionEitherOr: "दोनों वैध स्थितियों में ठीक एक निष्कर्ष सत्य है।",
    verdicts: {
      IMPOSSIBLE: "असंभव",
      POSSIBLE_NOT_DEFINITE: "संभव, पर निश्चित नहीं",
      NOT_PROVED: "सिद्ध नहीं",
      WRONG_DIRECTION: "दिशा उलट दी गई",
      WRONG_MASK: "निष्कर्ष-पैटर्न गलत",
      INVALID_PAIR: "जोड़ी मान्य नहीं",
      NOT_REQUESTED: "प्रश्न के अनुसार नहीं",
      OTHER: "गलत",
    },
    modeLabels: {
      DIRECT_CHAIN: "सीधी कड़ी",
      WITNESS_TRANSFER: "एक ही सदस्य की कड़ी",
      DIRECT_CONTRADICTION: "सीधा विरोध",
      POSSIBLE_NOT_DEFINITE: "संभव, पर निश्चित नहीं",
      COUNTEREXAMPLE: "विपरीत उदाहरण",
      POSSIBILITY_MODEL: "संभावना की व्यवस्था",
      DUAL_MODEL: "दो व्यवस्थाएँ",
      CONCLUSION_MASK: "निष्कर्ष परिणाम",
      EITHER_OR: "या तो–या",
    },
  };

  if (locale === "pa-IN") return {
    correctAnswer: "ਸਹੀ ਜਵਾਬ",
    why: "ਕਿਉਂ?",
    diagram: "ਚਿੱਤਰ",
    otherOptions: "ਬਾਕੀ ਵਿਕਲਪ ਗਲਤ ਕਿਉਂ ਹਨ?",
    examShortcut: "ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ",
    administratorProof: "ਪ੍ਰਬੰਧਕ ਸਬੂਤ",
    existenceNote: "ਨੋਟ: ਇਹ ਜਵਾਬ ਅਧਿਆਇ ਦੇ ਗੈਰ-ਖਾਲੀ ਵਰਗ ਨਿਯਮ ਨੂੰ ਵਰਤਦਾ ਹੈ।",
    option: "ਵਿਕਲਪ",
    conclusion: "ਨਤੀਜਾ",
    follows: "ਨਿਕਲਦਾ ਹੈ",
    doesNotFollow: "ਨਹੀਂ ਨਿਕਲਦਾ",
    therefore: "ਇਸ ਲਈ",
    directChainBridge: "ਇਨ੍ਹਾਂ ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜਣ ਨਾਲ ਲੋੜੀਂਦਾ ਸੰਬੰਧ ਸਿੱਧਾ ਬਣਦਾ ਹੈ।",
    witnessSameMember: (inside, outside) =>
      outside
        ? `ਉਹੀ ਮੈਂਬਰ ${inside} ਵਿੱਚ ਹੈ ਅਤੇ ${outside} ਤੋਂ ਬਾਹਰ ਹੈ।`
        : `ਉਹੀ ਮੈਂਬਰ ${inside} ਵਿੱਚ ਹੈ।`,
    directContradiction: "ਕਥਨ ਅਤੇ ਇਹ ਨਤੀਜਾ ਇਕੱਠੇ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
    possibleNotDefinite: "ਇਹ ਸੰਬੰਧ ਸੰਭਵ ਹੈ, ਪਰ ਕਥਨ ਇਸ ਨੂੰ ਲਾਜ਼ਮੀ ਨਹੀਂ ਬਣਾਉਂਦੇ।",
    counterexample: "ਇੱਕ ਠੀਕ ਬਣਤਰ ਬਣ ਸਕਦੀ ਹੈ ਜਿਸ ਵਿੱਚ ਸਾਰੇ ਕਥਨ ਸਹੀ ਹੋਣ, ਪਰ ਇਹ ਨਤੀਜਾ ਗਲਤ ਹੋਵੇ।",
    possibilityModel: "ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਾਰੇ ਕਥਨ ਅਤੇ ਇਹ ਨਤੀਜਾ ਦੋਵੇਂ ਸਹੀ ਹਨ।",
    dualTrue: "ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਨਤੀਜਾ ਸਹੀ ਹੈ।",
    dualFalse: "ਦੂਜੀ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਨਤੀਜਾ ਗਲਤ ਹੈ।",
    eitherOr: [
      "ਦੋਵੇਂ ਨਤੀਜੇ ਇਕੱਠੇ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
      "ਦੋਵੇਂ ਇਕੱਠੇ ਗਲਤ ਵੀ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
      "ਇਸ ਲਈ ਠੀਕ ਇੱਕ ਨਤੀਜਾ ਸਹੀ ਹੋਵੇਗਾ।",
    ],
    modelTrue: "ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ",
    modelFalse: "ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ",
    oneValidArrangement: "ਇੱਕ ਠੀਕ ਬਣਤਰ",
    forbidden: "ਇਹ ਸਾਂਝਾ ਮੈਂਬਰ ਸੰਭਵ ਨਹੀਂ",
    captionContainment: (inner, outer) => `${inner} ਦਾ ਪੂਰਾ ਘੇਰਾ ${outer} ਦੇ ਅੰਦਰ ਹੈ।`,
    captionSeparation: (left, right) => `${left} ਅਤੇ ${right} ਦੇ ਘੇਰੇ ਵੱਖ ਹਨ।`,
    captionOverlap: (left, right) => `× ${left} ਅਤੇ ${right} ਦੋਵਾਂ ਵਿੱਚ ਹੈ।`,
    captionSomeNot: (subject, predicate) => `× ${subject} ਵਿੱਚ ਹੈ, ਪਰ ${predicate} ਵਿੱਚ ਨਹੀਂ ਹੈ।`,
    captionOnlyFew: (subject, predicate) => `ਇੱਕ × ਦੋਵਾਂ ਵਿੱਚ ਹੈ ਅਤੇ ਦੂਜਾ × ਸਿਰਫ਼ ${subject} ਵਿੱਚ ਹੈ।`,
    captionChain: (inner, middle, outer) => `${inner}, ${middle} ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ ${middle}, ${outer} ਦੇ ਅੰਦਰ ਹੈ।`,
    captionWitnessTransfer: (inside, shared, outside) => `× ${inside} ਅਤੇ ${shared} ਦੋਵਾਂ ਵਿੱਚ ਹੈ। ${shared}, ${outside} ਤੋਂ ਵੱਖ ਹੈ, ਇਸ ਲਈ × ${outside} ਵਿੱਚ ਨਹੀਂ ਹੈ।`,
    captionImpossible: (left, right) => `${left} ਅਤੇ ${right} ਵੱਖ ਹਨ; ਉਨ੍ਹਾਂ ਦੇ ਸਾਂਝੇ ਹਿੱਸੇ ਵਿੱਚ × ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ।`,
    captionCounterexample: "ਇਹ ਇੱਕ ਠੀਕ ਬਣਤਰ ਹੈ ਜਿਸ ਵਿੱਚ ਨਤੀਜਾ ਗਲਤ ਰਹਿੰਦਾ ਹੈ।",
    captionPossibility: "ਇਹ ਇੱਕ ਠੀਕ ਬਣਤਰ ਹੈ ਜਿਸ ਵਿੱਚ ਨਤੀਜਾ ਸਹੀ ਹੈ।",
    captionDual: "ਪਹਿਲੀ ਬਣਤਰ ਨਤੀਜੇ ਨੂੰ ਸਹੀ ਅਤੇ ਦੂਜੀ ਗਲਤ ਦਿਖਾਉਂਦੀ ਹੈ।",
    captionEitherOr: "ਦੋਵਾਂ ਠੀਕ ਸਥਿਤੀਆਂ ਵਿੱਚ ਠੀਕ ਇੱਕ ਨਤੀਜਾ ਸਹੀ ਹੈ।",
    verdicts: {
      IMPOSSIBLE: "ਅਸੰਭਵ",
      POSSIBLE_NOT_DEFINITE: "ਸੰਭਵ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ",
      NOT_PROVED: "ਸਾਬਤ ਨਹੀਂ",
      WRONG_DIRECTION: "ਦਿਸ਼ਾ ਉਲਟੀ",
      WRONG_MASK: "ਨਤੀਜਾ-ਪੈਟਰਨ ਗਲਤ",
      INVALID_PAIR: "ਜੋੜੀ ਠੀਕ ਨਹੀਂ",
      NOT_REQUESTED: "ਸਵਾਲ ਅਨੁਸਾਰ ਨਹੀਂ",
      OTHER: "ਗਲਤ",
    },
    modeLabels: {
      DIRECT_CHAIN: "ਸਿੱਧੀ ਲੜੀ",
      WITNESS_TRANSFER: "ਇੱਕੋ ਮੈਂਬਰ ਦੀ ਲੜੀ",
      DIRECT_CONTRADICTION: "ਸਿੱਧਾ ਵਿਰੋਧ",
      POSSIBLE_NOT_DEFINITE: "ਸੰਭਵ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ",
      COUNTEREXAMPLE: "ਵਿਰੋਧੀ ਉਦਾਹਰਨ",
      POSSIBILITY_MODEL: "ਸੰਭਾਵਨਾ ਬਣਤਰ",
      DUAL_MODEL: "ਦੋ ਬਣਤਰਾਂ",
      CONCLUSION_MASK: "ਨਤੀਜਾ ਫੈਸਲਾ",
      EITHER_OR: "ਜਾਂ ਤਾਂ–ਜਾਂ",
    },
  };

  return {
    correctAnswer: "Correct answer",
    why: "Why?",
    diagram: "Diagram",
    otherOptions: "Why are the other options wrong?",
    examShortcut: "Exam shortcut",
    administratorProof: "Administrator proof",
    existenceNote: "Note: This answer uses the chapter’s non-empty class rule.",
    option: "Option",
    conclusion: "Conclusion",
    follows: "Follows",
    doesNotFollow: "Does not follow",
    therefore: "Therefore",
    directChainBridge: "Combining these relations gives the required relation directly.",
    witnessSameMember: (inside, outside) =>
      outside
        ? `The same member belongs to ${inside} and is outside ${outside}.`
        : `The same member belongs to ${inside}.`,
    directContradiction: "The statement and this conclusion cannot both be true.",
    possibleNotDefinite: "This relation is possible, but the statements do not make it certain.",
    counterexample: "A valid arrangement can satisfy every statement while making this conclusion false.",
    possibilityModel: "One valid arrangement satisfies every statement and also makes this conclusion true.",
    dualTrue: "In one valid arrangement, the conclusion is true.",
    dualFalse: "In another valid arrangement, the conclusion is false.",
    eitherOr: [
      "Both conclusions cannot be true together.",
      "Both conclusions also cannot be false together.",
      "Therefore, exactly one conclusion must be true.",
    ],
    modelTrue: "CAN BE TRUE",
    modelFalse: "CAN BE FALSE",
    oneValidArrangement: "ONE VALID ARRANGEMENT",
    forbidden: "FORBIDDEN OVERLAP",
    captionContainment: (inner, outer) => `The whole ${inner} set lies inside ${outer}.`,
    captionSeparation: (left, right) => `${left} and ${right} are completely separate.`,
    captionOverlap: (left, right) => `The × lies in both ${left} and ${right}.`,
    captionSomeNot: (subject, predicate) => `The × lies in ${subject} but outside ${predicate}.`,
    captionOnlyFew: (subject, predicate) => `One × is in the overlap and another × is only in ${subject}.`,
    captionChain: (inner, middle, outer) => `${inner} lies inside ${middle}, and ${middle} lies inside ${outer}.`,
    captionWitnessTransfer: (inside, shared, outside) => `The × is in both ${inside} and ${shared}. Because ${shared} is separate from ${outside}, the same × is outside ${outside}.`,
    captionImpossible: (left, right) => `${left} and ${right} are separate, so a common × is forbidden.`,
    captionCounterexample: "This valid arrangement keeps every premise true while the conclusion is false.",
    captionPossibility: "This is one valid arrangement in which the conclusion is true.",
    captionDual: "The first arrangement makes the conclusion true; the second makes it false.",
    captionEitherOr: "Across the two valid cases, exactly one conclusion is true.",
    verdicts: {
      IMPOSSIBLE: "Impossible",
      POSSIBLE_NOT_DEFINITE: "Possible, not definite",
      NOT_PROVED: "Not proved",
      WRONG_DIRECTION: "Direction reversed",
      WRONG_MASK: "Wrong conclusion pattern",
      INVALID_PAIR: "Invalid pair",
      NOT_REQUESTED: "Not asked",
      OTHER: "Wrong",
    },
    modeLabels: {
      DIRECT_CHAIN: "Direct chain",
      WITNESS_TRANSFER: "Witness transfer",
      DIRECT_CONTRADICTION: "Direct contradiction",
      POSSIBLE_NOT_DEFINITE: "Possible, not definite",
      COUNTEREXAMPLE: "Counterexample",
      POSSIBILITY_MODEL: "Possibility model",
      DUAL_MODEL: "Dual model",
      CONCLUSION_MASK: "Conclusion result",
      EITHER_OR: "Either-or",
    },
  };
}
