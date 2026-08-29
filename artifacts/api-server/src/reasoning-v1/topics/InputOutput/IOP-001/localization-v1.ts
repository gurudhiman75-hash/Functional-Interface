import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import type { IopEnglishProductionCaselet, IopEnglishTrace } from "./english-production-types.ts";
import type { IopPermanentQlId } from "./permanent-authorities.ts";

export type IopLocalizedLocale = "hi-IN" | "pa-IN";

export interface IopLocalizedOption {
  readonly display: string;
  readonly canonicalEnglishDisplay: string;
  readonly semanticFingerprint: string;
  readonly isCorrect: boolean;
  readonly misconception: string;
}

export interface IopLocalizedChildQuestion {
  readonly questionOrder: 1 | 2 | 3 | 4;
  readonly kind: IopEnglishProductionCaselet["children"][number]["kind"];
  readonly evidence: IopEnglishProductionCaselet["children"][number]["evidence"];
  readonly text: string;
  readonly canonicalEnglishText: string;
  readonly options: readonly [IopLocalizedOption, IopLocalizedOption, IopLocalizedOption, IopLocalizedOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answerDisplay: string;
  readonly canonicalEnglishAnswerDisplay: string;
  readonly explanation: string;
  readonly canonicalEnglishExplanation: string;
}

export interface IopLocalizedCaselet {
  readonly caseletId: string;
  readonly packageId: "IOP-001";
  readonly chapterId: "REAS-INP";
  readonly qlId: IopPermanentQlId;
  readonly sourceModeId: string;
  readonly seed: string;
  readonly locale: IopLocalizedLocale;
  readonly examProfile: "BANKING";
  readonly difficulty: IopEnglishProductionCaselet["difficulty"];
  readonly directions: string;
  readonly canonicalEnglishDirections: string;
  readonly demonstration: IopEnglishTrace;
  readonly target: IopEnglishTrace;
  readonly ruleExplanation: string;
  readonly canonicalEnglishRuleExplanation: string;
  readonly sourceEvidenceIds: readonly string[];
  readonly safeguards: IopEnglishProductionCaselet["safeguards"];
  readonly children: readonly [IopLocalizedChildQuestion, IopLocalizedChildQuestion, IopLocalizedChildQuestion, IopLocalizedChildQuestion];
  readonly lifecycle: {
    readonly maturity: "LOCALIZATION_REVIEW_CANDIDATE";
    readonly englishFreeze: true;
    readonly hindiPunjabiStatus: "REVIEW_CANDIDATE_V1";
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

type BilingualText = Readonly<{ hi: string; pa: string }>;

const RULES: Readonly<Record<string, BilingualText>> = Object.freeze({
  QL001_WORD_ALPHA_ASC_LEFT: {
    hi: "हर चरण में बचे हुए शब्दों में वर्णक्रम से सबसे पहले आने वाला शब्द चुनकर बाईं ओर अगली खाली जगह पर रखा जाता है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਬਚੇ ਹੋਏ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਆਉਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣ ਕੇ ਖੱਬੇ ਪਾਸੇ ਅਗਲੀ ਖਾਲੀ ਥਾਂ ਤੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  QL001_WORD_ALPHA_DESC_RIGHT: {
    hi: "हर चरण में बचे हुए शब्दों में वर्णक्रम से सबसे बाद में आने वाला शब्द चुनकर दाईं ओर अगली खाली जगह पर रखा जाता है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਬਚੇ ਹੋਏ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਅਖੀਰ ਆਉਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣ ਕੇ ਸੱਜੇ ਪਾਸੇ ਅਗਲੀ ਖਾਲੀ ਥਾਂ ਤੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  QL001_NUMBER_ASC_LEFT: {
    hi: "हर चरण में सबसे छोटी बची हुई संख्या चुनकर बाईं ओर अगली खाली जगह पर रखी जाती है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਹੋਈ ਸੰਖਿਆ ਚੁਣ ਕੇ ਖੱਬੇ ਪਾਸੇ ਅਗਲੀ ਖਾਲੀ ਥਾਂ ਤੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।",
  },
  QL001_WORD_LENGTH_ASC_LEFT: {
    hi: "हर चरण में सबसे छोटा शब्द चुनकर बाईं ओर अगली खाली जगह पर रखा जाता है। शब्द की लंबाई अक्षरों की संख्या से तय होती है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟਾ ਸ਼ਬਦ ਚੁਣ ਕੇ ਖੱਬੇ ਪਾਸੇ ਅਗਲੀ ਖਾਲੀ ਥਾਂ ਤੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਸ਼ਬਦ ਦੀ ਲੰਬਾਈ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਤੈਅ ਹੁੰਦੀ ਹੈ।",
  },
  QL001_NUMBER_DIGIT_SUM_ASC_LEFT: {
    hi: "हर संख्या के अंकों का योग देखा जाता है। हर चरण में सबसे कम अंक-योग वाली बची हुई संख्या बाईं ओर अगली खाली जगह पर रखी जाती है।",
    pa: "ਹਰ ਸੰਖਿਆ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ਦੇਖਿਆ ਜਾਂਦਾ ਹੈ। ਹਰ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਅੰਕ-ਜੋੜ ਵਾਲੀ ਬਚੀ ਸੰਖਿਆ ਖੱਬੇ ਪਾਸੇ ਅਗਲੀ ਖਾਲੀ ਥਾਂ ਤੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।",
  },
  QL001_WORD_LENGTH_DESC_RIGHT: {
    hi: "हर चरण में सबसे लंबा बचा हुआ शब्द चुनकर दाईं ओर अगली खाली जगह पर रखा जाता है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਲੰਮਾ ਬਚਿਆ ਹੋਇਆ ਸ਼ਬਦ ਚੁਣ ਕੇ ਸੱਜੇ ਪਾਸੇ ਅਗਲੀ ਖਾਲੀ ਥਾਂ ਤੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  QL002_BLOCKED_001: {
    hi: "पहले संख्याएँ छोटी से बड़ी क्रम में एक-एक करके बाईं ओर लगाई जाती हैं। सभी संख्याएँ लगने के बाद शब्द वर्णक्रम में बाईं ओर लगाए जाते हैं।",
    pa: "ਪਹਿਲਾਂ ਸੰਖਿਆਵਾਂ ਛੋਟੀ ਤੋਂ ਵੱਡੀ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਖੱਬੇ ਪਾਸੇ ਲਗਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਸ਼ਬਦ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਖੱਬੇ ਪਾਸੇ ਲਗਾਏ ਜਾਂਦੇ ਹਨ।",
  },
  QL002_BLOCKED_002: {
    hi: "पहले शब्द वर्णक्रम के उल्टे क्रम में एक-एक करके दाईं ओर लगाए जाते हैं। सभी शब्द लगने के बाद संख्याएँ छोटी से बड़ी क्रम में बाईं ओर लगाई जाती हैं।",
    pa: "ਪਹਿਲਾਂ ਸ਼ਬਦ ਵਰਣਮਾਲਾ ਦੇ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਸੱਜੇ ਪਾਸੇ ਲਗਾਏ ਜਾਂਦੇ ਹਨ। ਸਾਰੇ ਸ਼ਬਦ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਸੰਖਿਆਵਾਂ ਛੋਟੀ ਤੋਂ ਵੱਡੀ ਕ੍ਰਮ ਵਿੱਚ ਖੱਬੇ ਪਾਸੇ ਲਗਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
  },
  QL002_BLOCKED_003: {
    hi: "पहले संख्याएँ बड़ी से छोटी क्रम में एक-एक करके दाईं ओर लगाई जाती हैं। सभी संख्याएँ लगने के बाद शब्द वर्णक्रम में बाईं ओर लगाए जाते हैं।",
    pa: "ਪਹਿਲਾਂ ਸੰਖਿਆਵਾਂ ਵੱਡੀ ਤੋਂ ਛੋਟੀ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਸੱਜੇ ਪਾਸੇ ਲਗਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਸ਼ਬਦ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਖੱਬੇ ਪਾਸੇ ਲਗਾਏ ਜਾਂਦੇ ਹਨ।",
  },
  QL003_SIMULTANEOUS_001: {
    hi: "हर चरण में दो काम साथ होते हैं—सबसे छोटी बची संख्या बाईं ओर और सबसे बड़ी बची संख्या दाईं ओर रखी जाती है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਦੋ ਕੰਮ ਇਕੱਠੇ ਹੁੰਦੇ ਹਨ—ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਸੰਖਿਆ ਖੱਬੇ ਪਾਸੇ ਅਤੇ ਸਭ ਤੋਂ ਵੱਡੀ ਬਚੀ ਸੰਖਿਆ ਸੱਜੇ ਪਾਸੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।",
  },
  QL003_SIMULTANEOUS_002: {
    hi: "हर चरण में सबसे छोटी बची संख्या बाईं ओर और वर्णक्रम से सबसे बाद वाला बचा शब्द दाईं ओर रखा जाता है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਸੰਖਿਆ ਖੱਬੇ ਪਾਸੇ ਅਤੇ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਅਖੀਰ ਵਾਲਾ ਬਚਿਆ ਸ਼ਬਦ ਸੱਜੇ ਪਾਸੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  QL003_SIMULTANEOUS_003: {
    hi: "हर चरण में वर्णक्रम से सबसे पहले आने वाला बचा शब्द बाईं ओर और सबसे बड़ी बची संख्या दाईं ओर रखी जाती है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਆਉਣ ਵਾਲਾ ਬਚਿਆ ਸ਼ਬਦ ਖੱਬੇ ਪਾਸੇ ਅਤੇ ਸਭ ਤੋਂ ਵੱਡੀ ਬਚੀ ਸੰਖਿਆ ਸੱਜੇ ਪਾਸੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।",
  },
  QL004_ALTERNATING_001: {
    hi: "पहले चरण में सबसे छोटी बची संख्या बाईं ओर रखी जाती है, अगले चरण में सबसे बड़ी बची संख्या दाईं ओर। यही क्रम बारी-बारी से चलता है।",
    pa: "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਸੰਖਿਆ ਖੱਬੇ ਪਾਸੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ, ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ ਬਚੀ ਸੰਖਿਆ ਸੱਜੇ ਪਾਸੇ। ਇਹ ਕ੍ਰਮ ਵਾਰੀ-ਵਾਰੀ ਚਲਦਾ ਹੈ।",
  },
  QL004_ALTERNATING_002: {
    hi: "एक चरण में सबसे छोटी बची संख्या बाईं ओर रखी जाती है और अगले चरण में वर्णक्रम से सबसे बाद वाला बचा शब्द दाईं ओर। दोनों नियम बारी-बारी से चलते हैं।",
    pa: "ਇੱਕ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਸੰਖਿਆ ਖੱਬੇ ਪਾਸੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਅਖੀਰ ਵਾਲਾ ਬਚਿਆ ਸ਼ਬਦ ਸੱਜੇ ਪਾਸੇ। ਦੋਵੇਂ ਨਿਯਮ ਵਾਰੀ-ਵਾਰੀ ਚਲਦੇ ਹਨ।",
  },
  QL004_ALTERNATING_003: {
    hi: "एक चरण में वर्णक्रम से सबसे पहला बचा शब्द बाईं ओर रखा जाता है और अगले चरण में सबसे बड़ी बची संख्या दाईं ओर। दोनों नियम बारी-बारी से चलते हैं।",
    pa: "ਇੱਕ ਪੜਾਅ ਵਿੱਚ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਪਹਿਲਾ ਬਚਿਆ ਸ਼ਬਦ ਖੱਬੇ ਪਾਸੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ ਬਚੀ ਸੰਖਿਆ ਸੱਜੇ ਪਾਸੇ। ਦੋਵੇਂ ਨਿਯਮ ਵਾਰੀ-ਵਾਰੀ ਚਲਦੇ ਹਨ।",
  },
  QL005_NUM_PARITY_REVERSE_INCREMENT_TWO_ENDED: {
    hi: "हर चरण में सबसे छोटी बची विषम संख्या और सबसे छोटी बची सम संख्या ली जाती है। विषम संख्या के अंक उलटकर बाईं ओर रखे जाते हैं, जबकि सम संख्या में 1 जोड़कर दाईं ओर रखा जाता है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਬੇ-ਜੋੜ ਸੰਖਿਆ ਅਤੇ ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਜੋੜੀ ਸੰਖਿਆ ਲਈ ਜਾਂਦੀ ਹੈ। ਬੇ-ਜੋੜ ਸੰਖਿਆ ਦੇ ਅੰਕ ਉਲਟ ਕੇ ਖੱਬੇ ਪਾਸੇ ਰੱਖੇ ਜਾਂਦੇ ਹਨ, ਜਦਕਿ ਜੋੜੀ ਸੰਖਿਆ ਵਿੱਚ 1 ਜੋੜ ਕੇ ਸੱਜੇ ਪਾਸੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  QL006_TEXT_RBI_LASTLETTER_VOWELCOUNT_REMOVE_SORT_SHIFT: {
    hi: "मशीन पाँच चरणों में काम करती है: पहले शब्द अंतिम अक्षर के अनुसार लगते हैं, फिर स्वर की संख्या के अनुसार; इसके बाद स्वर हटते हैं, बचे अक्षर वर्णक्रम में लगते हैं और अंत में हर अक्षर को वर्णमाला में दो स्थान पीछे किया जाता है।",
    pa: "ਮਸ਼ੀਨ ਪੰਜ ਪੜਾਵਾਂ ਵਿੱਚ ਕੰਮ ਕਰਦੀ ਹੈ: ਪਹਿਲਾਂ ਸ਼ਬਦ ਆਖਰੀ ਅੱਖਰ ਅਨੁਸਾਰ ਲੱਗਦੇ ਹਨ, ਫਿਰ ਸਵਰਾਂ ਦੀ ਗਿਣਤੀ ਅਨੁਸਾਰ; ਇਸ ਤੋਂ ਬਾਅਦ ਸਵਰ ਹਟਾਏ ਜਾਂਦੇ ਹਨ, ਬਚੇ ਅੱਖਰ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਲੱਗਦੇ ਹਨ ਅਤੇ ਅੰਤ ਵਿੱਚ ਹਰ ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਵਿੱਚ ਦੋ ਥਾਂ ਪਿੱਛੇ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
  },
  QL007_RBI2024_TRANSFORMED_PAIR: {
    hi: "हर चरण में वर्णक्रम से सबसे पहला बचा शब्द और सबसे छोटी बची संख्या चुनी जाती है। शब्द के हर स्वर को अगले अक्षर से बदला जाता है और संख्या को उसके अंकों के योग में बदला जाता है। बदली हुई संख्या और शब्द की जोड़ी बाईं ओर रखी जाती है।",
    pa: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਪਹਿਲਾ ਬਚਿਆ ਸ਼ਬਦ ਅਤੇ ਸਭ ਤੋਂ ਛੋਟੀ ਬਚੀ ਸੰਖਿਆ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। ਸ਼ਬਦ ਦੇ ਹਰ ਸਵਰ ਨੂੰ ਅਗਲੇ ਅੱਖਰ ਨਾਲ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਸੰਖਿਆ ਨੂੰ ਉਸਦੇ ਅੰਕਾਂ ਦੇ ਜੋੜ ਵਿੱਚ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ। ਬਦਲੀ ਹੋਈ ਸੰਖਿਆ ਅਤੇ ਸ਼ਬਦ ਦੀ ਜੋੜੀ ਖੱਬੇ ਪਾਸੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।",
  },
  QL008_BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE: {
    hi: "छह बॉक्सों पर हर बार वही चार गणनाएँ होती हैं। पहले सामने वाले बॉक्सों के अंकों से गुणन किया जाता है, फिर तय जोड़-घटाव से अगली पंक्ति बनती है। उसके बाद भाग देकर दो मान मिलते हैं और अंतिम चरण में इन दोनों का धनात्मक अंतर लिया जाता है।",
    pa: "ਛੇ ਬਾਕਸਾਂ ਉੱਤੇ ਹਰ ਵਾਰ ਉਹੀ ਚਾਰ ਗਣਨਾਵਾਂ ਹੁੰਦੀਆਂ ਹਨ। ਪਹਿਲਾਂ ਸਾਹਮਣੇ ਵਾਲੇ ਬਾਕਸਾਂ ਦੇ ਅੰਕਾਂ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਨਿਰਧਾਰਤ ਜੋੜ-ਘਟਾਓ ਨਾਲ ਅਗਲੀ ਕਤਾਰ ਬਣਦੀ ਹੈ। ਉਸ ਤੋਂ ਬਾਅਦ ਭਾਗ ਦੇ ਕੇ ਦੋ ਮੁੱਲ ਮਿਲਦੇ ਹਨ ਅਤੇ ਆਖਰੀ ਪੜਾਅ ਵਿੱਚ ਦੋਹਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲਿਆ ਜਾਂਦਾ ਹੈ।",
  },
});

function pick(locale: IopLocalizedLocale, text: BilingualText): string {
  return locale === "hi-IN" ? text.hi : text.pa;
}

function renderRow(row: readonly string[]): string {
  return row.join("  ");
}

function stepLabel(locale: IopLocalizedLocale, stepNumber: number): string {
  return locale === "hi-IN" ? `चरण ${stepNumber}` : `ਪੜਾਅ ${stepNumber}`;
}

function inputLabel(locale: IopLocalizedLocale): string {
  return locale === "hi-IN" ? "इनपुट" : "ਇਨਪੁੱਟ";
}

function traceLines(trace: IopEnglishTrace, throughStep: number, locale: IopLocalizedLocale): string {
  const end = Math.min(Math.max(throughStep, 0), trace.steps.length);
  const lines = [`${inputLabel(locale)}: ${renderRow(trace.input)}`];
  for (let index = 0; index < end; index += 1) {
    lines.push(`${stepLabel(locale, index + 1)}: ${renderRow(trace.steps[index]!)}`);
  }
  return lines.join("\n");
}

function ordinalPosition(locale: IopLocalizedLocale, position: number): string {
  if (locale === "hi-IN") return `बाएँ से ${position}वाँ`;
  return `ਖੱਬੇ ਪਾਸੋਂ ${position}ਵਾਂ`;
}

function localizeOptionDisplay(
  locale: IopLocalizedLocale,
  child: IopEnglishProductionCaselet["children"][number],
  englishDisplay: string,
  semanticFingerprint: string,
): string {
  if (child.kind === "POSITION_OF_ELEMENT") {
    const position = Number(semanticFingerprint.split(":").at(-1));
    if (Number.isInteger(position) && position > 0) return ordinalPosition(locale, position);
  }
  if (child.kind === "STEP_NUMBER") {
    const match = englishDisplay.match(/\d+/);
    if (match) return stepLabel(locale, Number(match[0]));
  }
  if (child.kind === "REMAINING_STEP_COUNT") {
    const match = englishDisplay.match(/\d+/);
    if (match) return locale === "hi-IN" ? `${match[0]} चरण` : `${match[0]} ਪੜਾਅ`;
  }
  return englishDisplay;
}

function directionsFor(caselet: IopEnglishProductionCaselet, locale: IopLocalizedLocale): string {
  const mode = IOP_ENGLISH_SOURCE_MODES.find((candidate) => candidate.sourceModeId === caselet.sourceModeId);
  if (!mode) throw new Error(`Unknown IOP source mode ${caselet.sourceModeId}`);
  const wordOnly = caselet.sourceModeId.startsWith("QL001_WORD_") || mode.engineKind === "TEXT_RBI_SOURCE";
  const numberOnly = caselet.sourceModeId === "QL001_NUMBER_ASC_LEFT"
    || caselet.sourceModeId === "QL001_NUMBER_DIGIT_SUM_ASC_LEFT"
    || caselet.sourceModeId === "QL003_SIMULTANEOUS_001"
    || caselet.sourceModeId === "QL004_ALTERNATING_001"
    || mode.engineKind === "NUMERIC_PARITY_SOURCE";
  if (mode.engineKind === "BOX_SOURCE") {
    return locale === "hi-IN"
      ? "नीचे दिए गए उदाहरण में एक मशीन छह बॉक्सों पर एक निश्चित क्रम में गणना करती है। उदाहरण को ध्यान से देखें और वही तरीका नए बॉक्सों पर लागू करें।"
      : "ਹੇਠਾਂ ਦਿੱਤੇ ਉਦਾਹਰਨ ਵਿੱਚ ਇੱਕ ਮਸ਼ੀਨ ਛੇ ਬਾਕਸਾਂ ਉੱਤੇ ਇੱਕ ਨਿਰਧਾਰਤ ਕ੍ਰਮ ਵਿੱਚ ਗਣਨਾ ਕਰਦੀ ਹੈ। ਉਦਾਹਰਨ ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਉਹੀ ਤਰੀਕਾ ਨਵੇਂ ਬਾਕਸਾਂ ਉੱਤੇ ਲਗਾਓ।";
  }
  if (wordOnly) {
    return locale === "hi-IN"
      ? "नीचे दिए गए उदाहरण में एक मशीन शब्दों को एक निश्चित नियम से बदलती या व्यवस्थित करती है। उदाहरण को ध्यान से देखें और वही नियम नए इनपुट पर लागू करें।"
      : "ਹੇਠਾਂ ਦਿੱਤੇ ਉਦਾਹਰਨ ਵਿੱਚ ਇੱਕ ਮਸ਼ੀਨ ਸ਼ਬਦਾਂ ਨੂੰ ਇੱਕ ਨਿਯਮ ਅਨੁਸਾਰ ਬਦਲਦੀ ਜਾਂ ਲਗਾਉਂਦੀ ਹੈ। ਉਦਾਹਰਨ ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਉਹੀ ਨਿਯਮ ਨਵੇਂ ਇਨਪੁੱਟ ਉੱਤੇ ਲਗਾਓ।";
  }
  if (numberOnly) {
    return locale === "hi-IN"
      ? "नीचे दिए गए उदाहरण में एक मशीन संख्याओं को एक निश्चित नियम से बदलती या व्यवस्थित करती है। उदाहरण को ध्यान से देखें और वही नियम नए इनपुट पर लागू करें।"
      : "ਹੇਠਾਂ ਦਿੱਤੇ ਉਦਾਹਰਨ ਵਿੱਚ ਇੱਕ ਮਸ਼ੀਨ ਸੰਖਿਆਵਾਂ ਨੂੰ ਇੱਕ ਨਿਯਮ ਅਨੁਸਾਰ ਬਦਲਦੀ ਜਾਂ ਲਗਾਉਂਦੀ ਹੈ। ਉਦਾਹਰਨ ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਉਹੀ ਨਿਯਮ ਨਵੇਂ ਇਨਪੁੱਟ ਉੱਤੇ ਲਗਾਓ।";
  }
  return locale === "hi-IN"
    ? "नीचे दिए गए उदाहरण में एक मशीन शब्दों और संख्याओं को एक निश्चित नियम से बदलती या व्यवस्थित करती है। उदाहरण को ध्यान से देखें और वही नियम नए इनपुट पर लागू करें।"
    : "ਹੇਠਾਂ ਦਿੱਤੇ ਉਦਾਹਰਨ ਵਿੱਚ ਇੱਕ ਮਸ਼ੀਨ ਸ਼ਬਦਾਂ ਅਤੇ ਸੰਖਿਆਵਾਂ ਨੂੰ ਇੱਕ ਨਿਯਮ ਅਨੁਸਾਰ ਬਦਲਦੀ ਜਾਂ ਲਗਾਉਂਦੀ ਹੈ। ਉਦਾਹਰਨ ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਉਹੀ ਨਿਯਮ ਨਵੇਂ ਇਨਪੁੱਟ ਉੱਤੇ ਲਗਾਓ।";
}

function questionText(
  locale: IopLocalizedLocale,
  caselet: IopEnglishProductionCaselet,
  child: IopEnglishProductionCaselet["children"][number],
): string {
  const e = child.evidence;
  if (e.kind === "FINAL_OUTPUT") {
    return locale === "hi-IN" ? "नए इनपुट का अंतिम परिणाम कौन-सा होगा?" : "ਨਵੇਂ ਇਨਪੁੱਟ ਦਾ ਅੰਤਿਮ ਨਤੀਜਾ ਕਿਹੜਾ ਹੋਵੇਗਾ?";
  }
  if (e.kind === "STEP_OUTPUT") {
    return locale === "hi-IN" ? `नए इनपुट के लिए चरण ${e.stepNumber} क्या होगा?` : `ਨਵੇਂ ਇਨਪੁੱਟ ਲਈ ਪੜਾਅ ${e.stepNumber} ਕੀ ਹੋਵੇਗਾ?`;
  }
  if (e.kind === "ELEMENT_AT_POSITION") {
    return locale === "hi-IN"
      ? `चरण ${e.stepNumber} में बाएँ से ${e.position}वें स्थान पर क्या होगा?`
      : `ਪੜਾਅ ${e.stepNumber} ਵਿੱਚ ਖੱਬੇ ਪਾਸੋਂ ${e.position}ਵੇਂ ਸਥਾਨ ਤੇ ਕੀ ਹੋਵੇਗਾ?`;
  }
  if (e.kind === "POSITION_OF_ELEMENT") {
    return locale === "hi-IN"
      ? `चरण ${e.stepNumber} में ${e.element} बाएँ से किस स्थान पर होगा?`
      : `ਪੜਾਅ ${e.stepNumber} ਵਿੱਚ ${e.element} ਖੱਬੇ ਪਾਸੋਂ ਕਿਹੜੇ ਸਥਾਨ ਤੇ ਹੋਵੇਗਾ?`;
  }
  if (e.kind === "STEP_NUMBER") {
    const row = caselet.target.steps.find((candidate) => candidate.join("\u241f") === e.stateFingerprint);
    if (!row) throw new Error("Unable to find localized step-number state");
    return locale === "hi-IN"
      ? `व्यवस्था ${renderRow(row)} किस चरण में प्राप्त होगी?`
      : `ਤਰਤੀਬ ${renderRow(row)} ਕਿਹੜੇ ਪੜਾਅ ਵਿੱਚ ਮਿਲੇਗੀ?`;
  }
  if (e.kind === "PREVIOUS_STEP") {
    const current = caselet.target.steps[e.currentStepNumber - 1]!;
    return locale === "hi-IN"
      ? `चरण ${e.currentStepNumber} में व्यवस्था ${renderRow(current)} है। इससे ठीक पहले कौन-सी व्यवस्था होगी?`
      : `ਪੜਾਅ ${e.currentStepNumber} ਵਿੱਚ ਤਰਤੀਬ ${renderRow(current)} ਹੈ। ਇਸ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਕਿਹੜੀ ਤਰਤੀਬ ਹੋਵੇਗੀ?`;
  }
  if (e.kind === "MISSING_STEP") {
    const before = caselet.target.steps[e.missingStepNumber - 2]!;
    const after = caselet.target.steps[e.missingStepNumber]!;
    return locale === "hi-IN"
      ? `चरण ${e.missingStepNumber - 1} में ${renderRow(before)} और चरण ${e.missingStepNumber + 1} में ${renderRow(after)} है। बीच का चरण ${e.missingStepNumber} क्या होगा?`
      : `ਪੜਾਅ ${e.missingStepNumber - 1} ਵਿੱਚ ${renderRow(before)} ਅਤੇ ਪੜਾਅ ${e.missingStepNumber + 1} ਵਿੱਚ ${renderRow(after)} ਹੈ। ਵਿਚਕਾਰਲਾ ਪੜਾਅ ${e.missingStepNumber} ਕੀ ਹੋਵੇਗਾ?`;
  }
  return locale === "hi-IN"
    ? `चरण ${e.stepNumber} के बाद अंतिम परिणाम तक पहुँचने के लिए कितने चरण और चाहिए?`
    : `ਪੜਾਅ ${e.stepNumber} ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਨਤੀਜੇ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਹੋਰ ਕਿੰਨੇ ਪੜਾਅ ਚਾਹੀਦੇ ਹਨ?`;
}

function explanationText(
  locale: IopLocalizedLocale,
  caselet: IopEnglishProductionCaselet,
  child: IopEnglishProductionCaselet["children"][number],
  localizedAnswer: string,
  localizedRule: string,
): string {
  const e = child.evidence;
  const ruleLine = locale === "hi-IN" ? `उदाहरण से नियम है: ${localizedRule}` : `ਉਦਾਹਰਨ ਤੋਂ ਨਿਯਮ ਹੈ: ${localizedRule}`;
  const answerLine = locale === "hi-IN" ? `इसलिए सही उत्तर ${localizedAnswer} है।` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${localizedAnswer} ਹੈ।`;

  if (e.kind === "STEP_OUTPUT") {
    return locale === "hi-IN"
      ? `हमें नए इनपुट का चरण ${e.stepNumber} निकालना है।\n\n${ruleLine}\n\nनियम को क्रम से लगाने पर:\n${traceLines(caselet.target, e.stepNumber, locale)}\n\n${answerLine}`
      : `ਸਾਨੂੰ ਨਵੇਂ ਇਨਪੁੱਟ ਦਾ ਪੜਾਅ ${e.stepNumber} ਕੱਢਣਾ ਹੈ।\n\n${ruleLine}\n\nਨਿਯਮ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਲਗਾਉਣ ਤੇ:\n${traceLines(caselet.target, e.stepNumber, locale)}\n\n${answerLine}`;
  }
  if (e.kind === "FINAL_OUTPUT") {
    return locale === "hi-IN"
      ? `हमें नए इनपुट का अंतिम परिणाम निकालना है।\n\n${ruleLine}\n\nनियम को पूरा लागू करने पर:\n${traceLines(caselet.target, caselet.target.steps.length, locale)}\n\nअंतिम चरण ही अंतिम परिणाम है। ${answerLine}`
      : `ਸਾਨੂੰ ਨਵੇਂ ਇਨਪੁੱਟ ਦਾ ਅੰਤਿਮ ਨਤੀਜਾ ਕੱਢਣਾ ਹੈ।\n\n${ruleLine}\n\nਨਿਯਮ ਨੂੰ ਪੂਰਾ ਲਗਾਉਣ ਤੇ:\n${traceLines(caselet.target, caselet.target.steps.length, locale)}\n\nਆਖਰੀ ਪੜਾਅ ਹੀ ਅੰਤਿਮ ਨਤੀਜਾ ਹੈ। ${answerLine}`;
  }
  if (e.kind === "ELEMENT_AT_POSITION") {
    const row = caselet.target.steps[e.stepNumber - 1]!;
    return locale === "hi-IN"
      ? `हमें चरण ${e.stepNumber} में बाएँ से ${e.position}वें स्थान का मान चाहिए।\n\n${ruleLine}\n\nपहले चरण ${e.stepNumber} बनाते हैं:\n${traceLines(caselet.target, e.stepNumber, locale)}\n\nचरण ${e.stepNumber} है ${renderRow(row)}। बाएँ से ${e.position}वें स्थान पर ${localizedAnswer} है।\n\n${answerLine}`
      : `ਸਾਨੂੰ ਪੜਾਅ ${e.stepNumber} ਵਿੱਚ ਖੱਬੇ ਪਾਸੋਂ ${e.position}ਵੇਂ ਸਥਾਨ ਦਾ ਮੁੱਲ ਚਾਹੀਦਾ ਹੈ।\n\n${ruleLine}\n\nਪਹਿਲਾਂ ਪੜਾਅ ${e.stepNumber} ਬਣਾਉਂਦੇ ਹਾਂ:\n${traceLines(caselet.target, e.stepNumber, locale)}\n\nਪੜਾਅ ${e.stepNumber} ਹੈ ${renderRow(row)}। ਖੱਬੇ ਪਾਸੋਂ ${e.position}ਵੇਂ ਸਥਾਨ ਤੇ ${localizedAnswer} ਹੈ।\n\n${answerLine}`;
  }
  if (e.kind === "POSITION_OF_ELEMENT") {
    const row = caselet.target.steps[e.stepNumber - 1]!;
    return locale === "hi-IN"
      ? `हमें चरण ${e.stepNumber} में ${e.element} का स्थान देखना है।\n\n${ruleLine}\n\nचरण ${e.stepNumber} बनाने पर:\n${traceLines(caselet.target, e.stepNumber, locale)}\n\nचरण ${e.stepNumber} है ${renderRow(row)}। इसमें ${e.element} ${localizedAnswer} है।\n\n${answerLine}`
      : `ਸਾਨੂੰ ਪੜਾਅ ${e.stepNumber} ਵਿੱਚ ${e.element} ਦਾ ਸਥਾਨ ਵੇਖਣਾ ਹੈ।\n\n${ruleLine}\n\nਪੜਾਅ ${e.stepNumber} ਬਣਾਉਣ ਤੇ:\n${traceLines(caselet.target, e.stepNumber, locale)}\n\nਪੜਾਅ ${e.stepNumber} ਹੈ ${renderRow(row)}। ਇਸ ਵਿੱਚ ${e.element} ${localizedAnswer} ਹੈ।\n\n${answerLine}`;
  }
  if (e.kind === "STEP_NUMBER") {
    const stepIndex = caselet.target.steps.findIndex((row) => row.join("\u241f") === e.stateFingerprint);
    if (stepIndex < 0) throw new Error("Unable to locate localized step-number answer");
    return locale === "hi-IN"
      ? `हमें दी गई व्यवस्था किस चरण में बनती है, यह देखना है।\n\n${ruleLine}\n\nनए इनपुट को क्रम से चलाने पर:\n${traceLines(caselet.target, stepIndex + 1, locale)}\n\nदी गई व्यवस्था पहली बार ${localizedAnswer} में मिलती है।\n\n${answerLine}`
      : `ਸਾਨੂੰ ਵੇਖਣਾ ਹੈ ਕਿ ਦਿੱਤੀ ਤਰਤੀਬ ਕਿਹੜੇ ਪੜਾਅ ਵਿੱਚ ਬਣਦੀ ਹੈ।\n\n${ruleLine}\n\nਨਵੇਂ ਇਨਪੁੱਟ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਚਲਾਉਣ ਤੇ:\n${traceLines(caselet.target, stepIndex + 1, locale)}\n\nਦਿੱਤੀ ਤਰਤੀਬ ਪਹਿਲੀ ਵਾਰ ${localizedAnswer} ਵਿੱਚ ਮਿਲਦੀ ਹੈ।\n\n${answerLine}`;
  }
  if (e.kind === "PREVIOUS_STEP") {
    const previousStep = e.currentStepNumber - 1;
    const previous = previousStep === 0 ? caselet.target.input : caselet.target.steps[previousStep - 1]!;
    const current = caselet.target.steps[e.currentStepNumber - 1]!;
    return locale === "hi-IN"
      ? `हमें चरण ${e.currentStepNumber} से ठीक पहले की व्यवस्था चाहिए।\n\n${ruleLine}\n\nलगातार दो चरण हैं:\n${stepLabel(locale, previousStep)}: ${renderRow(previous)}\n${stepLabel(locale, e.currentStepNumber)}: ${renderRow(current)}\n\nइसलिए चरण ${e.currentStepNumber} से ठीक पहले ${localizedAnswer} था।\n\n${answerLine}`
      : `ਸਾਨੂੰ ਪੜਾਅ ${e.currentStepNumber} ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਵਾਲੀ ਤਰਤੀਬ ਚਾਹੀਦੀ ਹੈ।\n\n${ruleLine}\n\nਲਗਾਤਾਰ ਦੋ ਪੜਾਅ ਹਨ:\n${stepLabel(locale, previousStep)}: ${renderRow(previous)}\n${stepLabel(locale, e.currentStepNumber)}: ${renderRow(current)}\n\nਇਸ ਲਈ ਪੜਾਅ ${e.currentStepNumber} ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ${localizedAnswer} ਸੀ।\n\n${answerLine}`;
  }
  if (e.kind === "MISSING_STEP") {
    const before = e.missingStepNumber === 1 ? caselet.target.input : caselet.target.steps[e.missingStepNumber - 2]!;
    const missing = caselet.target.steps[e.missingStepNumber - 1]!;
    const after = caselet.target.steps[e.missingStepNumber]!;
    return locale === "hi-IN"
      ? `हमें बीच का लुप्त चरण ${e.missingStepNumber} भरना है।\n\n${ruleLine}\n\nसंबंधित तीन अवस्थाएँ हैं:\n${stepLabel(locale, e.missingStepNumber - 1)}: ${renderRow(before)}\n${stepLabel(locale, e.missingStepNumber)}: ${renderRow(missing)}\n${stepLabel(locale, e.missingStepNumber + 1)}: ${renderRow(after)}\n\nपिछले चरण पर नियम एक बार लगाने से ${localizedAnswer} मिलता है और अगली बार वही नियम लगाने पर दिया गया अगला चरण बनता है।\n\n${answerLine}`
      : `ਸਾਨੂੰ ਵਿਚਕਾਰਲਾ ਗੁੰਮ ਪੜਾਅ ${e.missingStepNumber} ਭਰਨਾ ਹੈ।\n\n${ruleLine}\n\nਸਬੰਧਤ ਤਿੰਨ ਹਾਲਤਾਂ ਹਨ:\n${stepLabel(locale, e.missingStepNumber - 1)}: ${renderRow(before)}\n${stepLabel(locale, e.missingStepNumber)}: ${renderRow(missing)}\n${stepLabel(locale, e.missingStepNumber + 1)}: ${renderRow(after)}\n\nਪਿਛਲੇ ਪੜਾਅ ਤੇ ਨਿਯਮ ਇੱਕ ਵਾਰ ਲਗਾਉਣ ਨਾਲ ${localizedAnswer} ਮਿਲਦਾ ਹੈ ਅਤੇ ਇੱਕ ਵਾਰ ਹੋਰ ਲਗਾਉਣ ਨਾਲ ਦਿੱਤਾ ਅਗਲਾ ਪੜਾਅ ਬਣਦਾ ਹੈ।\n\n${answerLine}`;
  }
  const total = caselet.target.steps.length;
  const remaining = total - e.stepNumber;
  return locale === "hi-IN"
    ? `मशीन नए इनपुट पर चरण ${total} में पूरी होती है। हम चरण ${e.stepNumber} पर हैं। इसलिए बाकी चरण = ${total} - ${e.stepNumber} = ${remaining}।\n\n${answerLine}`
    : `ਮਸ਼ੀਨ ਨਵੇਂ ਇਨਪੁੱਟ ਤੇ ਪੜਾਅ ${total} ਵਿੱਚ ਪੂਰੀ ਹੁੰਦੀ ਹੈ। ਅਸੀਂ ਪੜਾਅ ${e.stepNumber} ਤੇ ਹਾਂ। ਇਸ ਲਈ ਬਾਕੀ ਪੜਾਅ = ${total} - ${e.stepNumber} = ${remaining}।\n\n${answerLine}`;
}

export function localizeIopEnglishCaselet(
  english: IopEnglishProductionCaselet,
  locale: IopLocalizedLocale,
): IopLocalizedCaselet {
  const rule = RULES[english.sourceModeId];
  if (!rule) throw new Error(`No human-authored localization rule for ${english.sourceModeId}`);
  const localizedRule = pick(locale, rule);
  const children = english.children.map((child) => {
    const localizedOptions = child.options.map((option) => ({
      display: localizeOptionDisplay(locale, child, option.display, option.semanticFingerprint),
      canonicalEnglishDisplay: option.display,
      semanticFingerprint: option.semanticFingerprint,
      isCorrect: option.isCorrect,
      misconception: option.misconception,
    })) as unknown as IopLocalizedChildQuestion["options"];
    const localizedAnswer = localizedOptions[child.answerIndex]!.display;
    return {
      questionOrder: child.questionOrder,
      kind: child.kind,
      evidence: child.evidence,
      text: questionText(locale, english, child),
      canonicalEnglishText: child.text,
      options: localizedOptions,
      answerIndex: child.answerIndex,
      answerDisplay: localizedAnswer,
      canonicalEnglishAnswerDisplay: child.answerDisplay,
      explanation: explanationText(locale, english, child, localizedAnswer, localizedRule),
      canonicalEnglishExplanation: child.explanation,
    };
  }) as unknown as IopLocalizedCaselet["children"];

  return {
    caseletId: `${english.caseletId}-${locale}`,
    packageId: english.packageId,
    chapterId: english.chapterId,
    qlId: english.qlId,
    sourceModeId: english.sourceModeId,
    seed: english.seed,
    locale,
    examProfile: english.examProfile,
    difficulty: english.difficulty,
    directions: directionsFor(english, locale),
    canonicalEnglishDirections: english.directions,
    demonstration: english.demonstration,
    target: english.target,
    ruleExplanation: localizedRule,
    canonicalEnglishRuleExplanation: english.ruleExplanation,
    sourceEvidenceIds: english.sourceEvidenceIds,
    safeguards: english.safeguards,
    children,
    lifecycle: {
      maturity: "LOCALIZATION_REVIEW_CANDIDATE",
      englishFreeze: true,
      hindiPunjabiStatus: "REVIEW_CANDIDATE_V1",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function generateIopLocalizedReviewCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  sourceModeId: string,
  locale: IopLocalizedLocale,
): IopLocalizedCaselet {
  const english = generateIopEnglishReviewCaselet(seed, qlId, sourceModeId);
  return localizeIopEnglishCaselet(english, locale);
}

export const IOP_LOCALIZATION_RULE_COUNT = Object.keys(RULES).length;
