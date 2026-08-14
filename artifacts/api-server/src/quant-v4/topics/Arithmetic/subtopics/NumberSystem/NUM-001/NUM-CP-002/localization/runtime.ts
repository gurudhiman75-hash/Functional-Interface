import { runNumCp002PermanentPipeline } from "../permanent/runtime";
import type { NumCp002PermanentQlId } from "../permanent/allocation";
import type { NumCp002PermanentQuestion } from "../permanent/runtime";
import type { NumCp002LocalizedQuestion, NumCp002TranslatedLocale } from "./types";

export interface NumCp002LocalizedRuntimeInput {
  readonly questionLanguageId?: NumCp002PermanentQlId;
  readonly seed?: number;
  readonly locale: NumCp002TranslatedLocale;
}

const tx = (locale: NumCp002TranslatedLocale, hi: string, pa: string): string => locale === "hi-IN" ? hi : pa;

const OPTION_TRANSLATIONS: Readonly<Record<NumCp002TranslatedLocale, Readonly<Record<string, string>>>> = {
  "hi-IN": {
    "Cannot be determined": "निर्धारित नहीं किया जा सकता",
    "Terminating": "सांत",
    "Non-terminating recurring": "असांत आवर्ती",
    "Non-terminating non-recurring": "असांत अनावर्ती",
    "I only": "केवल I",
    "II only": "केवल II",
    "I and III only": "केवल I और III",
    "I, II and III": "I, II और III तीनों",
    "Statement I alone is sufficient": "केवल कथन I पर्याप्त है",
    "Statement II alone is sufficient": "केवल कथन II पर्याप्त है",
    "Both statements together are sufficient, but neither alone is sufficient": "दोनों कथन साथ में पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है",
    "Even both statements together are not sufficient": "दोनों कथन साथ में भी पर्याप्त नहीं हैं",
  },
  "pa-IN": {
    "Cannot be determined": "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
    "Terminating": "ਸਮਾਪਤ",
    "Non-terminating recurring": "ਅਸਮਾਪਤ ਆਵਰਤੀ",
    "Non-terminating non-recurring": "ਅਸਮਾਪਤ ਗੈਰ-ਆਵਰਤੀ",
    "I only": "ਕੇਵਲ I",
    "II only": "ਕੇਵਲ II",
    "I and III only": "ਕੇਵਲ I ਅਤੇ III",
    "I, II and III": "I, II ਅਤੇ III ਤਿੰਨੇ",
    "Statement I alone is sufficient": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
    "Statement II alone is sufficient": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
    "Both statements together are sufficient, but neither alone is sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ",
    "Even both statements together are not sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
  },
};

const STEM_RULES: ReadonlyArray<readonly [RegExp, string, string]> = [
  [/^Reduce (.+) to lowest terms\.$/s, "$1 को सरलतम रूप में लिखिए।", "$1 ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।"],
  [/^Express (.+) as a mixed fraction\.$/s, "$1 को मिश्र भिन्न के रूप में लिखिए।", "$1 ਨੂੰ ਮਿਸ਼ਰਤ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।"],
  [/^Convert (.+) to an improper fraction\.$/s, "$1 को अनुचित भिन्न में बदलिए।", "$1 ਨੂੰ ਅਣਉਚਿਤ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ।"],
  [/^Convert (.+) to a fraction in lowest terms\.$/s, "$1 को सरलतम भिन्न में बदलिए।", "$1 ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ।"],
  [/^Express (.+) as an exact decimal\.$/s, "$1 को सटीक दशमलव के रूप में लिखिए।", "$1 ਨੂੰ ਸਹੀ ਦਸ਼ਮਲਵ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।"],
  [/^Which is the exact decimal representation of (.+)\?$/s, "$1 का सटीक दशमलव रूप कौन-सा है?", "$1 ਦਾ ਸਹੀ ਦਸ਼ਮਲਵ ਰੂਪ ਕਿਹੜਾ ਹੈ?"],
  [/^Choose the correct relation between (.+) and (.+)\.$/s, "$1 और $2 के बीच सही संबंध चुनिए।", "$1 ਅਤੇ $2 ਵਿਚਕਾਰ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।"],
  [/^Arrange (.+) in ascending order\.$/s, "$1 को आरोही क्रम में लगाइए।", "$1 ਨੂੰ ਚੜ੍ਹਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।"],
  [/^Arrange (.+) in descending order\.$/s, "$1 को अवरोही क्रम में लगाइए।", "$1 ਨੂੰ ਘਟਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।"],
  [/^Which is the largest of (.+)\?$/s, "$1 में सबसे बड़ा मान कौन-सा है?", "$1 ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ ਕਿਹੜਾ ਹੈ?"],
  [/^Which is the smallest of (.+)\?$/s, "$1 में सबसे छोटा मान कौन-सा है?", "$1 ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਕਿਹੜਾ ਹੈ?"],
  [/^Which of the following lies strictly between (.+) and (.+)\?$/s, "$1 और $2 के बीच सख्ती से कौन-सा मान आता है?", "$1 ਅਤੇ $2 ਦੇ ਵਿਚਕਾਰ ਸਖ਼ਤੀ ਨਾਲ ਕਿਹੜਾ ਮੁੱਲ ਆਉਂਦਾ ਹੈ?"],
  [/^What is the nature of the decimal expansion of (.+)\?$/s, "$1 के दशमलव प्रसार का प्रकार क्या है?", "$1 ਦੇ ਦਸ਼ਮਲਵ ਵਿਸਥਾਰ ਦੀ ਕਿਸਮ ਕੀ ਹੈ?"],
  [/^How many decimal places are required for the exact terminating decimal expansion of (.+)\?$/s, "$1 के सटीक सांत दशमलव के लिए कितने दशमलव स्थान चाहिए?", "$1 ਦੇ ਸਹੀ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਲਈ ਕਿੰਨੇ ਦਸ਼ਮਲਵ ਸਥਾਨ ਚਾਹੀਦੇ ਹਨ?"],
  [/^Find the least non-negative integer (.+) for which (.+) is an integer\.$/s, "वह न्यूनतम गैर-ऋणात्मक पूर्णांक $1 ज्ञात कीजिए जिसके लिए $2 एक पूर्णांक हो।", "ਉਹ ਘੱਟੋ-ਘੱਟ ਗੈਰ-ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ $1 ਲੱਭੋ ਜਿਸ ਲਈ $2 ਪੂਰਨ ਅੰਕ ਹੋਵੇ।"],
  [/^The fraction (.+) has an exact terminating decimal with (.+) decimal places\. Find (.+)\.$/s, "भिन्न $1 का सटीक सांत दशमलव $2 स्थानों वाला है। $3 ज्ञात कीजिए।", "ਭਿੰਨ $1 ਦਾ ਸਹੀ ਸਮਾਪਤ ਦਸ਼ਮਲਵ $2 ਸਥਾਨਾਂ ਵਾਲਾ ਹੈ। $3 ਲੱਭੋ।"],
  [/^What is the least positive integer by which (.+) must be multiplied so that the product has a terminating decimal expansion\?$/s, "$1 को किस न्यूनतम धनात्मक पूर्णांक से गुणा करने पर गुणनफल का दशमलव प्रसार सांत होगा?", "$1 ਨੂੰ ਕਿਹੜੇ ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਗੁਣਨਫਲ ਦਾ ਦਸ਼ਮਲਵ ਵਿਸਥਾਰ ਸਮਾਪਤ ਹੋਵੇਗਾ?"],
  [/^By what least integer greater than (.+) should the denominator of (.+) be divided so that the decimal expansion of the resulting fraction terminates\?$/s, "$2 के हर को $1 से बड़े किस न्यूनतम पूर्णांक से भाग देने पर प्राप्त भिन्न का दशमलव प्रसार सांत होगा?", "$2 ਦੇ ਹਰ ਨੂੰ $1 ਤੋਂ ਵੱਡੇ ਕਿਹੜੇ ਘੱਟੋ-ਘੱਟ ਪੂਰਨ ਅੰਕ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਮਿਲੇ ਭਿੰਨ ਦਾ ਦਸ਼ਮਲਵ ਵਿਸਥਾਰ ਸਮਾਪਤ ਹੋਵੇਗਾ?"],
  [/^For how many integers (.+) with (.+) does (.+) have a terminating decimal expansion after reduction\?$/s, "शर्त $2 के अंतर्गत कितने पूर्णांक $1 के लिए $3 को सरल करने के बाद दशमलव प्रसार सांत होगा?", "ਸ਼ਰਤ $2 ਹੇਠ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ $1 ਲਈ $3 ਨੂੰ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਦਸ਼ਮਲਵ ਵਿਸਥਾਰ ਸਮਾਪਤ ਹੋਵੇਗਾ?"],
  [/^Which option gives the complete set of integers (.+) with (.+) for which (.+) terminates after reduction\?$/s, "शर्त $2 के अंतर्गत उन सभी पूर्णांकों $1 का पूरा समुच्चय कौन-सा है जिनके लिए $3 सरल करने के बाद सांत होता है?", "ਸ਼ਰਤ $2 ਹੇਠ ਉਹਨਾਂ ਸਾਰੇ ਪੂਰਨ ਅੰਕਾਂ $1 ਦਾ ਪੂਰਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ ਜਿਨ੍ਹਾਂ ਲਈ $3 ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਹੁੰਦਾ ਹੈ?"],
  [/^Which numerator (.+) makes (.+) a terminating decimal after reduction\?$/s, "कौन-सा अंश $1 ऐसा है कि $2 सरल करने के बाद सांत दशमलव बने?", "ਕਿਹੜਾ ਅੰਸ਼ $1 ਐਸਾ ਹੈ ਕਿ $2 ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਬਣੇ?"],
  [/^Find the least non-negative integer (.+) for which (.+) has a terminating decimal expansion after reduction\.$/s, "वह न्यूनतम गैर-ऋणात्मक पूर्णांक $1 ज्ञात कीजिए जिसके लिए $2 सरल करने के बाद सांत दशमलव देता है।", "ਉਹ ਘੱਟੋ-ਘੱਟ ਗੈਰ-ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ $1 ਲੱਭੋ ਜਿਸ ਲਈ $2 ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਦਿੰਦਾ ਹੈ।"],
  [/^The exact decimal expansion of (.+) is (.+)\. Find the missing digit\.$/s, "$1 का सटीक दशमलव प्रसार $2 है। लुप्त अंक ज्ञात कीजिए।", "$1 ਦਾ ਸਹੀ ਦਸ਼ਮਲਵ ਵਿਸਥਾਰ $2 ਹੈ। ਗੁੰਮ ਅੰਕ ਲੱਭੋ।"],
  [/^What is the length of the repeating block in the exact decimal expansion of (.+)\?$/s, "$1 के सटीक दशमलव प्रसार में आवर्ती खंड की लंबाई क्या है?", "$1 ਦੇ ਸਹੀ ਦਸ਼ਮਲਵ ਵਿਸਥਾਰ ਵਿੱਚ ਆਵਰਤੀ ਖੰਡ ਦੀ ਲੰਬਾਈ ਕੀ ਹੈ?"],
  [/^If (.+), find the integer (.+)\.$/s, "यदि $1, तो पूर्णांक $2 ज्ञात कीजिए।", "ਜੇ $1, ਤਾਂ ਪੂਰਨ ਅੰਕ $2 ਲੱਭੋ।"],
  [/^If (.+) is exactly equal to (.+), find the positive integer (.+)\.$/s, "यदि $1 ठीक $2 के बराबर है, तो धनात्मक पूर्णांक $3 ज्ञात कीजिए।", "ਜੇ $1 ਬਿਲਕੁਲ $2 ਦੇ ਬਰਾਬਰ ਹੈ, ਤਾਂ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ $3 ਲੱਭੋ।"],
  [/^Which recurring decimal is exactly equal to (.+)\?$/s, "कौन-सा आवर्ती दशमलव ठीक $1 के बराबर है?", "ਕਿਹੜਾ ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਬਿਲਕੁਲ $1 ਦੇ ਬਰਾਬਰ ਹੈ?"],
  [/^Which terminating decimal is exactly equal to (.+)\?$/s, "कौन-सा सांत दशमलव ठीक $1 के बराबर है?", "ਕਿਹੜਾ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਬਿਲਕੁਲ $1 ਦੇ ਬਰਾਬਰ ਹੈ?"],
];

const PHRASES: ReadonlyArray<readonly [string, string, string]> = [
  ["Consider the following statements:", "निम्नलिखित कथनों पर विचार कीजिए:", "ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:"],
  ["Which statement(s) is/are correct?", "कौन-सा/से कथन सही है/हैं?", "ਕਿਹੜਾ/ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?"],
  ["For a positive integer", "एक धनात्मक पूर्णांक", "ਇੱਕ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ"],
  ["is terminating after reduction?", "क्या सरल करने के बाद सांत है?", "ਕੀ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਹੈ?"],
  ["Statement I:", "कथन I:", "ਕਥਨ I:"],
  ["Statement II:", "कथन II:", "ਕਥਨ II:"],
  ["Which option correctly describes the sufficiency of the statements?", "कौन-सा विकल्प कथनों की पर्याप्तता को सही बताता है?", "ਕਿਹੜਾ ਵਿਕਲਪ ਕਥਨਾਂ ਦੀ ਕਾਫ਼ੀ ਹੋਣ ਦੀ ਸਥਿਤੀ ਨੂੰ ਸਹੀ ਦੱਸਦਾ ਹੈ?"],
  ["is divisible by", "से विभाज्य है", "ਨਾਲ ਭਾਗਯੋਗ ਹੈ"],
  ["A rational number in lowest terms with denominator", "सरलतम रूप में हर", "ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਹਰ"],
  ["has a terminating decimal.", "वाला परिमेय संख्या सांत दशमलव देती है।", "ਵਾਲੀ ਪਰਿਮੇਯ ਸੰਖਿਆ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਦਿੰਦੀ ਹੈ।"],
  ["A reduced denominator containing only powers of", "सरल किए हुए हर में केवल", "ਸਰਲ ਕੀਤੇ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["and", "और", "ਅਤੇ"],
  ["gives a terminating decimal.", "की घातें हों तो दशमलव सांत होता है।", "ਦੀਆਂ ਘਾਤਾਂ ਹੋਣ ਤਾਂ ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੁੰਦਾ ਹੈ।"],
  ["Every non-terminating decimal is irrational.", "हर असांत दशमलव अपरिमेय होता है।", "ਹਰ ਅਸਮਾਪਤ ਦਸ਼ਮਲਵ ਅਪਰਿਮੇਯ ਹੁੰਦਾ ਹੈ।"],
  ["Every recurring decimal is irrational.", "हर आवर्ती दशमलव अपरिमेय होता है।", "ਹਰ ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਅਪਰਿਮੇਯ ਹੁੰਦਾ ਹੈ।"],
  ["Every recurring decimal represents a rational number.", "हर आवर्ती दशमलव एक परिमेय संख्या दर्शाता है।", "ਹਰ ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਇੱਕ ਪਰਿਮੇਯ ਸੰਖਿਆ ਦਰਸਾਉਂਦਾ ਹੈ।"],
  ["A rational number may have a terminating decimal after common factors are cancelled.", "साझे गुणनखंड काटने के बाद परिमेय संख्या का दशमलव सांत हो सकता है।", "ਸਾਂਝੇ ਗੁਣਨਖੰਡ ਕੱਟਣ ਤੋਂ ਬਾਅਦ ਪਰਿਮੇਯ ਸੰਖਿਆ ਦਾ ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੋ ਸਕਦਾ ਹੈ।"],
  ["is exactly", "ठीक", "ਬਿਲਕੁਲ"],
  ["A fraction is in lowest terms when numerator and denominator have no common factor greater than 1.", "भिन्न सरलतम रूप में तब होता है जब अंश और हर का 1 से बड़ा कोई साझा गुणनखंड न हो।", "ਭਿੰਨ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਤਦ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਅੰਸ਼ ਅਤੇ ਹਰ ਦਾ 1 ਤੋਂ ਵੱਡਾ ਕੋਈ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਨਾ ਹੋਵੇ।"],
  ["Write the decimal over the matching power of 10, then reduce.", "दशमलव को उपयुक्त 10 की घात के हर पर लिखकर भिन्न सरल कीजिए।", "ਦਸ਼ਮਲਵ ਨੂੰ ਢੁੱਕਵੀਂ 10 ਦੀ ਘਾਤ ਵਾਲੇ ਹਰ ਉੱਤੇ ਲਿਖ ਕੇ ਭਿੰਨ ਸਰਲ ਕਰੋ।"],
  ["Reducing gives", "सरल करने पर मिलता है", "ਸਰਲ ਕਰਨ ਤੇ ਮਿਲਦਾ ਹੈ"],
  ["Since the reduced denominator has only factors", "क्योंकि सरल किए हर में केवल गुणनखंड", "ਕਿਉਂਕਿ ਸਰਲ ਕੀਤੇ ਹਰ ਵਿੱਚ ਕੇਵਲ ਗੁਣਨਖੰਡ"],
  ["the decimal terminates.", "हैं, इसलिए दशमलव सांत है।", "ਹਨ, ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੈ।"],
  ["A recurring decimal is determined by the repeating remainder cycle in exact long division.", "आवर्ती दशमलव सटीक दीर्घ भाग में दोहरने वाले शेष-चक्र से तय होता है।", "ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਸਹੀ ਲੰਬੇ ਭਾਗ ਵਿੱਚ ਦੁਹਰਾਉਂਦੇ ਬਾਕੀ-ਚੱਕਰ ਨਾਲ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ।"],
  ["Exact long division of", "का सटीक दीर्घ भाग", "ਦਾ ਸਹੀ ਲੰਬਾ ਭਾਗ"],
  ["repeats a remainder.", "में शेष दोहरता है।", "ਵਿੱਚ ਬਾਕੀ ਦੁਹਰਾਉਂਦਾ ਹੈ।"],
  ["The repeating decimal is", "आवर्ती दशमलव है", "ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਹੈ"],
  ["Compare fractions by exact cross-products; no decimal rounding is needed.", "भिन्नों की तुलना सटीक क्रॉस-गुणन से कीजिए; दशमलव को राउंड करने की जरूरत नहीं है।", "ਭਿੰਨਾਂ ਦੀ ਤੁਲਨਾ ਸਹੀ ਕ੍ਰਾਸ-ਗੁਣਾ ਨਾਲ ਕਰੋ; ਦਸ਼ਮਲਵ ਨੂੰ ਰਾਊਂਡ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"],
  ["Compare all values exactly as rational numbers before ordering them.", "क्रम लगाने से पहले सभी मानों की परिमेय संख्याओं के रूप में सटीक तुलना कीजिए।", "ਕ੍ਰਮ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸਾਰੇ ਮੁੱਲਾਂ ਦੀ ਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ ਵਜੋਂ ਸਹੀ ਤੁਲਨਾ ਕਰੋ।"],
  ["Convert or compare the three values exactly; do not round a recurring decimal.", "तीनों मानों को सटीक रूप में बदलकर या तुलना करके क्रम लगाइए; आवर्ती दशमलव को राउंड न करें।", "ਤਿੰਨਾਂ ਮੁੱਲਾਂ ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਬਦਲ ਕੇ ਜਾਂ ਤੁਲਨਾ ਕਰਕੇ ਕ੍ਰਮ ਲਗਾਓ; ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਨੂੰ ਰਾਊਂਡ ਨਾ ਕਰੋ।"],
  ["The required order is", "आवश्यक क्रम है", "ਲੋੜੀਂਦਾ ਕ੍ਰਮ ਹੈ"],
  ["Largest/smallest selection is an ordering task on exact rational values.", "सबसे बड़ा/छोटा मान चुनने के लिए सटीक परिमेय मानों की तुलना करनी होती है।", "ਸਭ ਤੋਂ ਵੱਡਾ/ਛੋਟਾ ਮੁੱਲ ਚੁਣਨ ਲਈ ਸਹੀ ਪਰਿਮੇਯ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨੀ ਹੁੰਦੀ ਹੈ।"],
  ["Compare the four values without rounding the recurring decimal.", "चारों मानों की तुलना आवर्ती दशमलव को राउंड किए बिना कीजिए।", "ਚਾਰਾਂ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਨੂੰ ਰਾਊਂਡ ਕੀਤੇ ਬਿਨਾਂ ਕਰੋ।"],
  ["The smallest value is", "सबसे छोटा मान है", "ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਹੈ"],
  ["The largest value is", "सबसे बड़ा मान है", "ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ ਹੈ"],
  ["A valid choice must be greater than the lower bound and smaller than the upper bound.", "सही विकल्प निचली सीमा से बड़ा और ऊपरी सीमा से छोटा होना चाहिए।", "ਸਹੀ ਵਿਕਲਪ ਹੇਠਲੀ ਹੱਦ ਤੋਂ ਵੱਡਾ ਅਤੇ ਉੱਪਰੀ ਹੱਦ ਤੋਂ ਛੋਟਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"],
  ["Reduce first. A rational number terminates exactly when the reduced denominator has no prime factors other than 2 and 5.", "पहले भिन्न सरल कीजिए। दशमलव तभी सांत होता है जब सरल हर में 2 और 5 के अलावा कोई अभाज्य गुणनखंड न हो।", "ਪਹਿਲਾਂ ਭਿੰਨ ਸਰਲ ਕਰੋ। ਦਸ਼ਮਲਵ ਤਦ ਹੀ ਸਮਾਪਤ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਸਰਲ ਹਰ ਵਿੱਚ 2 ਅਤੇ 5 ਤੋਂ ਇਲਾਵਾ ਕੋਈ ਅਭਾਜ ਗੁਣਨਖੰਡ ਨਾ ਹੋਵੇ।"],
  ["Its reduced denominator contains only", "इसके सरल हर में केवल", "ਇਸ ਦੇ ਸਰਲ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["Its reduced denominator still contains the factor", "इसके सरल हर में अभी भी गुणनखंड", "ਇਸ ਦੇ ਸਰਲ ਹਰ ਵਿੱਚ ਅਜੇ ਵੀ ਗੁਣਨਖੰਡ"],
  ["other than", "के अलावा है", "ਤੋਂ ਇਲਾਵਾ ਹੈ"],
  ["For a reduced denominator", "सरल हर", "ਸਰਲ ਹਰ"],
  ["the exact terminating decimal needs", "के सटीक सांत दशमलव के लिए", "ਦੇ ਸਹੀ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਲਈ"],
  ["places.", "स्थान चाहिए।", "ਸਥਾਨ ਚਾਹੀਦੇ ਹਨ।"],
  ["So the required number of places is", "अतः आवश्यक दशमलव स्थानों की संख्या है", "ਇਸ ਲਈ ਲੋੜੀਂਦੇ ਦਸ਼ਮਲਵ ਸਥਾਨਾਂ ਦੀ ਗਿਣਤੀ ਹੈ"],
  ["The least such power equals the number of places in the exact terminating decimal.", "ऐसी न्यूनतम घात सटीक सांत दशमलव के स्थानों की संख्या के बराबर होती है।", "ਐਸੀ ਘੱਟੋ-ਘੱਟ ਘਾਤ ਸਹੀ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਦੇ ਸਥਾਨਾਂ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ।"],
  ["needs", "को", "ਨੂੰ"],
  ["decimal places.", "दशमलव स्थान चाहिए।", "ਦਸ਼ਮਲਵ ਸਥਾਨ ਚਾਹੀਦੇ ਹਨ।"],
  ["Hence", "अतः", "ਇਸ ਲਈ"],
  ["is the least power of", "की न्यूनतम घात है", "ਦੀ ਘੱਟੋ-ਘੱਟ ਘਾਤ ਹੈ"],
  ["that clears its denominator.", "जो हर को पूर्णतः काट देती है।", "ਜੋ ਹਰ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟ ਦਿੰਦੀ ਹੈ।"],
  ["For denominator", "हर", "ਹਰ"],
  ["the decimal-place count is", "के लिए दशमलव स्थानों की संख्या", "ਲਈ ਦਸ਼ਮਲਵ ਸਥਾਨਾਂ ਦੀ ਗਿਣਤੀ"],
  ["The fixed exponent", "दी गई घात", "ਦਿੱਤੀ ਘਾਤ"],
  ["is smaller than", "से छोटी है।", "ਤੋਂ ਛੋਟੀ ਹੈ।"],
  ["Therefore the unknown exponent itself must be", "इसलिए अज्ञात घात होगी", "ਇਸ ਲਈ ਅਣਜਾਣ ਘਾਤ ਹੋਵੇਗੀ"],
  ["After reduction, a terminating decimal can have only", "सरल करने के बाद सांत दशमलव के हर में केवल", "ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਦੇ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["as denominator prime factors.", "अभाज्य गुणनखंड हो सकते हैं।", "ਅਭਾਜ ਗੁਣਨਖੰਡ ਹੋ ਸਕਦੇ ਹਨ।"],
  ["the factor that must disappear is", "है; जिस गुणनखंड को हटना है वह", "ਹੈ; ਜਿਸ ਗੁਣਨਖੰਡ ਨੂੰ ਹਟਣਾ ਹੈ ਉਹ"],
  ["Multiplying the fraction by", "भिन्न को", "ਭਿੰਨ ਨੂੰ"],
  ["removes that factor, so the least required integer is", "से गुणा करने पर वह गुणनखंड कटता है; अतः न्यूनतम पूर्णांक", "ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਉਹ ਗੁਣਨਖੰਡ ਕੱਟਦਾ ਹੈ; ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਪੂਰਨ ਅੰਕ"],
  ["Dividing the denominator by", "हर को", "ਹਰ ਨੂੰ"],
  ["removes that factor, so the least required integer is", "से भाग देने पर वह गुणनखंड हटता है; अतः न्यूनतम पूर्णांक", "ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਉਹ ਗੁਣਨਖੰਡ ਹਟਦਾ ਹੈ; ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਪੂਰਨ ਅੰਕ"],
  ["Any part of", "का वह भाग", "ਦਾ ਉਹ ਹਿੱਸਾ"],
  ["built from other primes must divide", "जो अन्य अभाज्यों से बना है, उसे", "ਜੋ ਹੋਰ ਅਭਾਜਾਂ ਤੋਂ ਬਣਿਆ ਹੈ, ਉਸ ਨੂੰ"],
  ["the corresponding cancellable part of the numerator.", "अंश के संबंधित काटे जा सकने वाले भाग को विभाजित करना चाहिए।", "ਅੰਸ਼ ਦੇ ਸੰਬੰਧਿਤ ਕੱਟੇ ਜਾ ਸਕਣ ਵਾਲੇ ਹਿੱਸੇ ਨੂੰ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।"],
  ["For", "के लिए", "ਲਈ"],
  ["the valid denominators are", "मान्य हर हैं", "ਮਾਨਯ ਹਰ ਹਨ"],
  ["giving", "अर्थात", "ਅਰਥਾਤ"],
  ["values.", "मान।", "ਮੁੱਲ।"],
  ["the complete set is", "पूरा समुच्चय है", "ਪੂਰਾ ਸਮੂਹ ਹੈ"],
  ["The numerator must cancel every denominator prime factor other than", "अंश को हर के उन सभी अभाज्य गुणनखंडों को काटना होगा जो", "ਅੰਸ਼ ਨੂੰ ਹਰ ਦੇ ਉਹਨਾਂ ਸਾਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡਾਂ ਨੂੰ ਕੱਟਣਾ ਹੋਵੇਗਾ ਜੋ"],
  ["Among the options,", "विकल्पों में", "ਵਿਕਲਪਾਂ ਵਿੱਚ"],
  ["supplies that complete cancellation.", "पूरा आवश्यक कटाव करता है।", "ਪੂਰੀ ਲੋੜੀਂਦੀ ਕਟੌਤੀ ਕਰਦਾ ਹੈ।"],
  ["Every denominator prime other than", "हर का प्रत्येक अभाज्य गुणनखंड जो", "ਹਰ ਦਾ ਹਰ ਅਭਾਜ ਗੁਣਨਖੰਡ ਜੋ"],
  ["must be cancelled completely.", "से अलग है, पूरी तरह कटना चाहिए।", "ਤੋਂ ਵੱਖਰਾ ਹੈ, ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਚਾਹੀਦਾ ਹੈ।"],
  ["The only unwanted denominator factor is", "हर का एकमात्र अनचाहा गुणनखंड है", "ਹਰ ਦਾ ਇਕੱਲਾ ਗੈਰ-ਲੋੜੀਂਦਾ ਗੁਣਨਖੰਡ ਹੈ"],
  ["Therefore", "इसलिए", "ਇਸ ਲਈ"],
  ["is the least valid exponent.", "न्यूनतम मान्य घात है।", "ਘੱਟੋ-ਘੱਟ ਮਾਨਯ ਘਾਤ ਹੈ।"],
  ["The marked block is fixed by the exact remainder cycle in long division.", "दिए गए आवर्ती खंड को सटीक दीर्घ भाग के शेष-चक्र से निर्धारित किया जाता है।", "ਦਿੱਤੇ ਆਵਰਤੀ ਖੰਡ ਨੂੰ ਸਹੀ ਲੰਬੇ ਭਾਗ ਦੇ ਬਾਕੀ-ਚੱਕਰ ਨਾਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["Long division gives the repeating block", "दीर्घ भाग से आवर्ती खंड मिलता है", "ਲੰਬੇ ਭਾਗ ਨਾਲ ਆਵਰਤੀ ਖੰਡ ਮਿਲਦਾ ਹੈ"],
  ["The missing digit is", "लुप्त अंक है", "ਗੁੰਮ ਅੰਕ ਹੈ"],
  ["A repeating block ends when long division returns to a remainder already seen.", "आवर्ती खंड तब पूरा होता है जब दीर्घ भाग किसी पहले आए शेष पर लौटता है।", "ਆਵਰਤੀ ਖੰਡ ਤਦ ਪੂਰਾ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਲੰਬਾ ਭਾਗ ਪਹਿਲਾਂ ਆਏ ਬਾਕੀ ਤੇ ਵਾਪਸ ਆ ਜਾਂਦਾ ਹੈ।"],
  ["The exact remainder cycle gives", "सटीक शेष-चक्र देता है", "ਸਹੀ ਬਾਕੀ-ਚੱਕਰ ਦਿੰਦਾ ਹੈ"],
  ["The repeating block has", "आवर्ती खंड में", "ਆਵਰਤੀ ਖੰਡ ਵਿੱਚ"],
  ["digits.", "अंक हैं।", "ਅੰਕ ਹਨ।"],
  ["Convert the decimal to an exact fraction and use equivalent fractions.", "दशमलव को सटीक भिन्न में बदलकर समतुल्य भिन्नों का प्रयोग कीजिए।", "ਦਸ਼ਮਲਵ ਨੂੰ ਸਹੀ ਭਿੰਨ ਵਿੱਚ ਬਦਲ ਕੇ ਸਮਤੁਲ ਭਿੰਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।"],
  ["Convert the recurring decimal to its exact reduced fraction, then use equivalent fractions.", "आवर्ती दशमलव को उसके सटीक सरल भिन्न में बदलकर समतुल्य भिन्नों का प्रयोग कीजिए।", "ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਨੂੰ ਉਸ ਦੇ ਸਹੀ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਬਦਲ ਕੇ ਸਮਤੁਲ ਭਿੰਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।"],
  ["Repeating the same minimal recurring block again does not change the represented rational number.", "उसी न्यूनतम आवर्ती खंड को फिर दोहराने से परिमेय मान नहीं बदलता।", "ਉਸੇ ਘੱਟੋ-ਘੱਟ ਆਵਰਤੀ ਖੰਡ ਨੂੰ ਫਿਰ ਦੁਹਰਾਉਣ ਨਾਲ ਪਰਿਮੇਯ ਮੁੱਲ ਨਹੀਂ ਬਦਲਦਾ।"],
  ["Both", "दोनों", "ਦੋਵੇਂ"],
  ["reduce to", "सरल होकर बनते हैं", "ਸਰਲ ਹੋ ਕੇ ਬਣਦੇ ਹਨ"],
  ["Check each statement separately using exact fraction and decimal rules.", "हर कथन को सटीक भिन्न और दशमलव नियमों से अलग-अलग जाँचिए।", "ਹਰ ਕਥਨ ਨੂੰ ਸਹੀ ਭਿੰਨ ਅਤੇ ਦਸ਼ਮਲਵ ਨਿਯਮਾਂ ਨਾਲ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ।"],
  ["The statement is true.", "कथन सत्य है।", "ਕਥਨ ਸਹੀ ਹੈ।"],
  ["The statement is false.", "कथन असत्य है।", "ਕਥਨ ਗਲਤ ਹੈ।"],
  ["Recurring non-terminating decimals are rational, so the statement is false.", "आवर्ती असांत दशमलव परिमेय होते हैं, इसलिए कथन असत्य है।", "ਆਵਰਤੀ ਅਸਮਾਪਤ ਦਸ਼ਮਲਵ ਪਰਿਮੇਯ ਹੁੰਦੇ ਹਨ, ਇਸ ਲਈ ਕਥਨ ਗਲਤ ਹੈ।"],
  ["A recurring decimal can be converted exactly to a fraction.", "आवर्ती दशमलव को सटीक रूप से भिन्न में बदला जा सकता है।", "ਆਵਰਤੀ ਦਸ਼ਮਲਵ ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਭਿੰਨ ਵਿੱਚ ਬਦਲਿਆ ਜਾ ਸਕਦਾ ਹੈ।"],
  ["Decimal nature is decided after reducing the fraction, so the statement is true.", "दशमलव का प्रकार भिन्न को सरल करने के बाद तय होता है, इसलिए कथन सत्य है।", "ਦਸ਼ਮਲਵ ਦੀ ਕਿਸਮ ਭਿੰਨ ਨੂੰ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਨਿਰਧਾਰਤ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਕਥਨ ਸਹੀ ਹੈ।"],
  ["For", "के लिए", "ਲਈ"],
  ["to terminate,", "के सांत होने के लिए", "ਦੇ ਸਮਾਪਤ ਹੋਣ ਲਈ"],
  ["must cancel the denominator factor", "को हर के गुणनखंड", "ਨੂੰ ਹਰ ਦੇ ਗੁਣਨਖੰਡ"],
  ["made from primes other than", "को काटना होगा, जो इनसे अलग अभाज्यों से बना है:", "ਨੂੰ ਕੱਟਣਾ ਹੋਵੇਗਾ, ਜੋ ਇਨ੍ਹਾਂ ਤੋਂ ਵੱਖਰੇ ਅਭਾਜਾਂ ਤੋਂ ਬਣਿਆ ਹੈ:"],
  ["Together the statements force divisibility only by", "दोनों कथन मिलकर केवल", "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕੇਵਲ"],
  ["which does not force cancellation of", "से विभाज्यता देते हैं, जो", "ਨਾਲ ਭਾਗਯੋਗਤਾ ਦਿੰਦੇ ਹਨ, ਜੋ"],
  ["therefore even together they are insufficient.", "को काटना सुनिश्चित नहीं करता; इसलिए दोनों साथ में भी अपर्याप्त हैं।", "ਨੂੰ ਕੱਟਣਾ ਯਕੀਨੀ ਨਹੀਂ ਕਰਦਾ; ਇਸ ਲਈ ਦੋਵੇਂ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।"],
  ["Neither statement alone forces cancellation of", "कोई भी कथन अकेले", "ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ"],
  ["but together they make", "को काटना सुनिश्चित नहीं करता, लेकिन दोनों मिलकर", "ਨੂੰ ਕੱਟਣਾ ਯਕੀਨੀ ਨਹੀਂ ਕਰਦਾ, ਪਰ ਦੋਵੇਂ ਮਿਲ ਕੇ"],
  ["which does.", "बना देते हैं, जिससे आवश्यक कटाव हो जाता है।", "ਬਣਾ ਦਿੰਦੇ ਹਨ, ਜਿਸ ਨਾਲ ਲੋੜੀਂਦੀ ਕਟੌਤੀ ਹੋ ਜਾਂਦੀ ਹੈ।"],
  ["Statement II forces", "कथन II", "ਕਥਨ II"],
  ["so Statement II alone is sufficient.", "सुनिश्चित करता है, इसलिए केवल कथन II पर्याप्त है।", "ਯਕੀਨੀ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।"],
  ["Statement I forces", "कथन I", "ਕਥਨ I"],
  ["so Statement I alone is sufficient.", "सुनिश्चित करता है, इसलिए केवल कथन I पर्याप्त है।", "ਯਕੀਨੀ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ।"],
  ["So", "अतः", "ਇਸ ਲਈ"],
  ["Thus", "अतः", "ਇਸ ਲਈ"],
];

function applyStemRules(stem: string, locale: NumCp002TranslatedLocale): string {
  for (const [pattern, hi, pa] of STEM_RULES) {
    if (pattern.test(stem)) return stem.replace(pattern, tx(locale, hi, pa));
  }
  return translatePhrases(stem, locale);
}

function translatePhrases(input: string, locale: NumCp002TranslatedLocale): string {
  let output = input;
  const rules = [...PHRASES].sort((a, b) => b[0].length - a[0].length);
  for (const [en, hi, pa] of rules) output = output.split(en).join(tx(locale, hi, pa));
  return output;
}

function translateOption(value: string, locale: NumCp002TranslatedLocale): string {
  return OPTION_TRANSLATIONS[locale][value] ?? value;
}

export function runNumCp002LocalizedPipeline(input: NumCp002LocalizedRuntimeInput): NumCp002LocalizedQuestion {
  const canonical = runNumCp002PermanentPipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: "en",
  });
  const language = input.locale === "hi-IN" ? "hi" : "pa";
  const options = canonical.options.map((option) => Object.freeze({ ...option, value: translateOption(option.value, input.locale) }));
  const canonicalAnswer = options[canonical.correctIndex]!.value;
  const localized: NumCp002LocalizedQuestion = {
    ...canonical,
    locale: input.locale,
    language,
    stem: applyStemRules(canonical.stem, input.locale),
    options: Object.freeze(options),
    canonicalAnswer,
    verifierAnswer: canonicalAnswer,
    explanation: Object.freeze({
      ...(canonical.explanation.concept ? { concept: translatePhrases(canonical.explanation.concept, input.locale) } : {}),
      solution: Object.freeze(canonical.explanation.solution.map((line) => translatePhrases(line, input.locale))),
      finalAnswer: canonicalAnswer,
    }),
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION",
    reviewStatus: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
    lifecycle: Object.freeze({
      permanentQlId: canonical.permanentQlId,
      maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
      reviewStatus: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
    traceability: Object.freeze({ ...canonical.traceability, language }),
    localization: Object.freeze({
      localizationVersion: "num-cp002-hi-pa-v1",
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalQuestionId: canonical.questionId,
      canonicalAnswer: canonical.canonicalAnswer,
      canonicalVerifierAnswer: canonical.verifierAnswer,
      locale: input.locale,
      language,
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionMappingPreserved: true,
      lifecycleLocked: true,
    }),
  };
  return Object.freeze(localized);
}
