import { applyPolityFinalEditorialStemPass } from "../pol-001-final-editorial-stem-pass-v1";
import { generatePolCp003ReviewBatchV3 } from "../preamble-union-citizenship/pol-cp003-review-generator-v3";
import {
  POL_CP003_CITIZENSHIP_ARTICLES_V1,
  POL_CP003_PREAMBLE_OBJECTIVES_V1,
  POL_CP003_SCENARIO_ROWS_V1,
  POL_CP003_UNION_ARTICLES_V1,
} from "../preamble-union-citizenship/pol-cp003-facts";
import { POL_LOCALIZATION_V1, type PolLocaleV1, type PolLocalizedQuestionV1 } from "./pol-localization-types-v1";
import { applyPolityPunjabiNativePassV1 } from "./pol-punjabi-native-pass-v1";

type NativeLocale = Exclude<PolLocaleV1, "en">;
type Pair = Readonly<{ hi: string; pa: string }>;
const lp = (hi: string, pa: string): Pair => ({ hi, pa });
const native = (p: Pair, locale: NativeLocale) => p[locale];

const ENGLISH = Object.freeze(
  generatePolCp003ReviewBatchV3().map((q) => applyPolityFinalEditorialStemPass(q)),
);

const COMMON: Readonly<Record<string, Pair>> = Object.freeze({
  "None": lp("कोई नहीं", "ਕੋਈ ਨਹੀਂ"),
  "Only one": lp("केवल एक", "ਸਿਰਫ਼ ਇੱਕ"),
  "Only two": lp("केवल दो", "ਸਿਰਫ਼ ਦੋ"),
  "All three": lp("तीनों", "ਤਿੰਨੇ"),
  "Justice": lp("न्याय", "ਨਿਆਂ"),
  "Liberty": lp("स्वतंत्रता", "ਆਜ਼ਾਦੀ"),
  "Equality": lp("समानता", "ਸਮਾਨਤਾ"),
  "Fraternity": lp("बंधुता", "ਭਾਈਚਾਰਾ"),
  "social, economic and political": lp("सामाजिक, आर्थिक और राजनीतिक", "ਸਮਾਜਿਕ, ਆਰਥਿਕ ਅਤੇ ਰਾਜਨੀਤਿਕ"),
  "thought, expression, belief, faith and worship": lp("विचार, अभिव्यक्ति, विश्वास, धर्म और उपासना", "ਵਿਚਾਰ, ਅਭਿਵੈਕਤੀ, ਵਿਸ਼ਵਾਸ, ਧਰਮ ਅਤੇ ਉਪਾਸਨਾ"),
  "status and opportunity": lp("प्रतिष्ठा और अवसर", "ਦਰਜੇ ਅਤੇ ਮੌਕੇ"),
  "the dignity of the individual and the unity and integrity of the Nation": lp("व्यक्ति की गरिमा तथा राष्ट्र की एकता और अखंडता", "ਵਿਅਕਤੀ ਦੀ ਮਰਯਾਦਾ ਅਤੇ ਰਾਸ਼ਟਰ ਦੀ ਏਕਤਾ ਤੇ ਅਖੰਡਤਾ"),
  "Socialist and Secular": lp("समाजवादी और पंथनिरपेक्ष", "ਸਮਾਜਵਾਦੀ ਅਤੇ ਧਰਮਨਿਰਪੇਖ"),
  "Sovereign and Democratic": lp("संपूर्ण प्रभुत्व-संपन्न और लोकतांत्रिक", "ਸੰਪੂਰਨ ਪ੍ਰਭੁਤਵ-ਸੰਪੰਨ ਅਤੇ ਲੋਕਤਾਂਤਰਿਕ"),
  "Democratic and Republic": lp("लोकतांत्रिक और गणराज्य", "ਲੋਕਤਾਂਤਰਿਕ ਅਤੇ ਗਣਰਾਜ"),
  "Sovereign and Republic": lp("संपूर्ण प्रभुत्व-संपन्न और गणराज्य", "ਸੰਪੂਰਨ ਪ੍ਰਭੁਤਵ-ਸੰਪੰਨ ਅਤੇ ਗਣਰਾਜ"),
  "Sovereign Socialist Secular Democratic Republic": lp("संपूर्ण प्रभुत्व-संपन्न समाजवादी पंथनिरपेक्ष लोकतांत्रिक गणराज्य", "ਸੰਪੂਰਨ ਪ੍ਰਭੁਤਵ-ਸੰਪੰਨ ਸਮਾਜਵਾਦੀ ਧਰਮਨਿਰਪੇਖ ਲੋਕਤਾਂਤਰਿਕ ਗਣਰਾਜ"),
  "Sovereign Federal Secular Democratic Republic": lp("संपूर्ण प्रभुत्व-संपन्न संघीय पंथनिरपेक्ष लोकतांत्रिक गणराज्य", "ਸੰਪੂਰਨ ਪ੍ਰਭੁਤਵ-ਸੰਪੰਨ ਸੰਘੀ ਧਰਮਨਿਰਪੇਖ ਲੋਕਤਾਂਤਰਿਕ ਗਣਰਾਜ"),
  "Socialist Secular Parliamentary Federation": lp("समाजवादी पंथनिरपेक्ष संसदीय संघ", "ਸਮਾਜਵਾਦੀ ਧਰਮਨਿਰਪੇਖ ਸੰਸਦੀ ਸੰਘ"),
  "Sovereign Socialist Democratic Federation": lp("संपूर्ण प्रभुत्व-संपन्न समाजवादी लोकतांत्रिक संघ", "ਸੰਪੂਰਨ ਪ੍ਰਭੁਤਵ-ਸੰਪੰਨ ਸਮਾਜਵਾਦੀ ਲੋਕਤਾਂਤਰਿਕ ਸੰਘ"),
  "Democratic": lp("लोकतांत्रिक", "ਲੋਕਤਾਂਤਰਿਕ"),
  "Socialist": lp("समाजवादी", "ਸਮਾਜਵਾਦੀ"),
  "Secular": lp("पंथनिरपेक्ष", "ਧਰਮਨਿਰਪੇਖ"),
  "Integrity": lp("अखंडता", "ਅਖੰਡਤਾ"),
  "Forty-second Amendment": lp("42वाँ संशोधन", "42ਵਾਂ ਸੰਸ਼ੋਧਨ"),
  "Twenty-fourth Amendment": lp("24वाँ संशोधन", "24ਵਾਂ ਸੰਸ਼ੋਧਨ"),
  "Forty-fourth Amendment": lp("44वाँ संशोधन", "44ਵਾਂ ਸੰਸ਼ੋਧਨ"),
  "Fifty-second Amendment": lp("52वाँ संशोधन", "52ਵਾਂ ਸੰਸ਼ੋਧਨ"),
  "It changed ‘unity of the Nation’ to ‘unity and integrity of the Nation’.": lp("इसने ‘राष्ट्र की एकता’ को ‘राष्ट्र की एकता और अखंडता’ में बदला।", "ਇਸ ਨੇ ‘ਰਾਸ਼ਟਰ ਦੀ ਏਕਤਾ’ ਨੂੰ ‘ਰਾਸ਼ਟਰ ਦੀ ਏਕਤਾ ਅਤੇ ਅਖੰਡਤਾ’ ਵਿੱਚ ਬਦਲਿਆ।"),
  "It replaced ‘dignity of the individual’ with ‘dignity of citizens’.": lp("इसने ‘व्यक्ति की गरिमा’ को ‘नागरिकों की गरिमा’ से बदल दिया।", "ਇਸ ਨੇ ‘ਵਿਅਕਤੀ ਦੀ ਮਰਯਾਦਾ’ ਨੂੰ ‘ਨਾਗਰਿਕਾਂ ਦੀ ਮਰਯਾਦਾ’ ਨਾਲ ਬਦਲ ਦਿੱਤਾ।"),
  "It removed the reference to unity of the Nation.": lp("इसने राष्ट्र की एकता का उल्लेख हटा दिया।", "ਇਸ ਨੇ ਰਾਸ਼ਟਰ ਦੀ ਏਕਤਾ ਦਾ ਜ਼ਿਕਰ ਹਟਾ ਦਿੱਤਾ।"),
  "It added the word ‘federal’ before ‘Nation’.": lp("इसने ‘राष्ट्र’ से पहले ‘संघीय’ शब्द जोड़ दिया।", "ਇਸ ਨੇ ‘ਰਾਸ਼ਟਰ’ ਤੋਂ ਪਹਿਲਾਂ ‘ਸੰਘੀ’ ਸ਼ਬਦ ਜੋੜ ਦਿੱਤਾ।"),
  "Socialist, Secular, and integrity": lp("समाजवादी, पंथनिरपेक्ष और अखंडता", "ਸਮਾਜਵਾਦੀ, ਧਰਮਨਿਰਪੇਖ ਅਤੇ ਅਖੰਡਤਾ"),
  "Democratic, Republic, and liberty": lp("लोकतांत्रिक, गणराज्य और स्वतंत्रता", "ਲੋਕਤਾਂਤਰਿਕ, ਗਣਰਾਜ ਅਤੇ ਆਜ਼ਾਦੀ"),
  "Sovereign, Socialist, and equality": lp("संपूर्ण प्रभुत्व-संपन्न, समाजवादी और समानता", "ਸੰਪੂਰਨ ਪ੍ਰਭੁਤਵ-ਸੰਪੰਨ, ਸਮਾਜਵਾਦੀ ਅਤੇ ਸਮਾਨਤਾ"),
  "Republic, integrity, and justice": lp("गणराज्य, अखंडता और न्याय", "ਗਣਰਾਜ, ਅਖੰਡਤਾ ਅਤੇ ਨਿਆਂ"),
  "First Schedule": lp("प्रथम अनुसूची", "ਪਹਿਲੀ ਅਨੁਸੂਚੀ"),
  "Second Schedule": lp("द्वितीय अनुसूची", "ਦੂਜੀ ਅਨੁਸੂਚੀ"),
  "Fourth Schedule": lp("चतुर्थ अनुसूची", "ਚੌਥੀ ਅਨੁਸੂਚੀ"),
  "Seventh Schedule": lp("सातवीं अनुसूची", "ਸੱਤਵੀਂ ਅਨੁਸੂਚੀ"),
  "First and Fourth Schedules": lp("प्रथम और चतुर्थ अनुसूचियाँ", "ਪਹਿਲੀ ਅਤੇ ਚੌਥੀ ਅਨੁਸੂਚੀਆਂ"),
  "Second and Third Schedules": lp("द्वितीय और तृतीय अनुसूचियाँ", "ਦੂਜੀ ਅਤੇ ਤੀਜੀ ਅਨੁਸੂਚੀਆਂ"),
  "Fifth and Sixth Schedules": lp("पाँचवीं और छठी अनुसूचियाँ", "ਪੰਜਵੀਂ ਅਤੇ ਛੇਵੀਂ ਅਨੁਸੂਚੀਆਂ"),
  "Seventh and Eighth Schedules": lp("सातवीं और आठवीं अनुसूचियाँ", "ਸੱਤਵੀਂ ਅਤੇ ਅੱਠਵੀਂ ਅਨੁਸੂਚੀਆਂ"),
  "a Union of States": lp("राज्यों का संघ", "ਰਾਜਾਂ ਦਾ ਸੰਘ"),
  "a Federation of Provinces": lp("प्रांतों का संघ", "ਸੂਬਿਆਂ ਦਾ ਸੰਘ"),
  "a Confederation of States": lp("राज्यों का परिसंघ", "ਰਾਜਾਂ ਦਾ ਪਰਿਸੰਘ"),
  "a Union of Republics": lp("गणराज्यों का संघ", "ਗਣਰਾਜਾਂ ਦਾ ਸੰਘ"),
  "Territories of the States, Union territories in the First Schedule, and territories that may be acquired": lp("राज्यों के क्षेत्र, प्रथम अनुसूची में दिए संघ राज्य क्षेत्र और भारत द्वारा अर्जित किए जा सकने वाले क्षेत्र", "ਰਾਜਾਂ ਦੇ ਖੇਤਰ, ਪਹਿਲੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਿੱਤੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਅਤੇ ਭਾਰਤ ਵੱਲੋਂ ਹਾਸਲ ਕੀਤੇ ਜਾ ਸਕਣ ਵਾਲੇ ਖੇਤਰ"),
  "Only the territories of the States": lp("केवल राज्यों के क्षेत्र", "ਸਿਰਫ਼ ਰਾਜਾਂ ਦੇ ਖੇਤਰ"),
  "Only States and Union territories, never acquired territory": lp("केवल राज्य और संघ राज्य क्षेत्र, अर्जित क्षेत्र नहीं", "ਸਿਰਫ਼ ਰਾਜ ਅਤੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼, ਹਾਸਲ ਕੀਤਾ ਖੇਤਰ ਨਹੀਂ"),
  "States and territories administered by neighbouring countries": lp("पड़ोसी देशों द्वारा प्रशासित राज्य और क्षेत्र", "ਗੁਆਂਢੀ ਦੇਸ਼ਾਂ ਵੱਲੋਂ ਪ੍ਰਸ਼ਾਸਿਤ ਰਾਜ ਅਤੇ ਖੇਤਰ"),
  "India and Bharat are constitutionally used in the expression ‘India, that is Bharat’.": lp("संविधान में ‘इंडिया अर्थात भारत’ अभिव्यक्ति में दोनों नाम प्रयुक्त हैं।", "ਸੰਵਿਧਾਨ ਵਿੱਚ ‘ਇੰਡੀਆ ਅਰਥਾਤ ਭਾਰਤ’ ਅਭਿਵੈਕਤੀ ਵਿੱਚ ਦੋਵੇਂ ਨਾਮ ਵਰਤੇ ਗਏ ਹਨ।"),
  "Only the name Bharat is constitutionally recognised.": lp("संविधान केवल भारत नाम को मान्यता देता है।", "ਸੰਵਿਧਾਨ ਸਿਰਫ਼ ਭਾਰਤ ਨਾਮ ਨੂੰ ਮਾਨਤਾ ਦਿੰਦਾ ਹੈ।"),
  "Only the name India is constitutionally recognised.": lp("संविधान केवल इंडिया नाम को मान्यता देता है।", "ਸੰਵਿਧਾਨ ਸਿਰਫ਼ ਇੰਡੀਆ ਨਾਮ ਨੂੰ ਮਾਨਤਾ ਦਿੰਦਾ ਹੈ।"),
  "The Constitution describes India as a confederation.": lp("संविधान भारत को परिसंघ बताता है।", "ਸੰਵਿਧਾਨ ਭਾਰਤ ਨੂੰ ਪਰਿਸੰਘ ਦੱਸਦਾ ਹੈ।"),
  "The President": lp("राष्ट्रपति", "ਰਾਸ਼ਟਰਪਤੀ"),
  "The Prime Minister": lp("प्रधानमंत्री", "ਪ੍ਰਧਾਨ ਮੰਤਰੀ"),
  "The Speaker of the Lok Sabha": lp("लोकसभा अध्यक्ष", "ਲੋਕ ਸਭਾ ਸਪੀਕਰ"),
  "The Chief Justice of India": lp("भारत के मुख्य न्यायाधीश", "ਭਾਰਤ ਦੇ ਮੁੱਖ ਨਿਆਂਧੀਸ਼"),
  "Refer it to the State Legislature for expressing its views within the specified period": lp("निर्धारित अवधि में विचार व्यक्त करने के लिए उसे राज्य विधानमंडल को भेजना", "ਨਿਰਧਾਰਤ ਮਿਆਦ ਵਿੱਚ ਵਿਚਾਰ ਦੇਣ ਲਈ ਇਸ ਨੂੰ ਰਾਜ ਵਿਧਾਨ ਮੰਡਲ ਕੋਲ ਭੇਜਣਾ"),
  "Obtain the State Legislature's binding consent": lp("राज्य विधानमंडल की बाध्यकारी सहमति लेना", "ਰਾਜ ਵਿਧਾਨ ਮੰਡਲ ਦੀ ਬਾਧਕ ਸਹਿਮਤੀ ਲੈਣਾ"),
  "Refer it to the Supreme Court for approval": lp("अनुमोदन के लिए सर्वोच्च न्यायालय को भेजना", "ਮਨਜ਼ੂਰੀ ਲਈ ਸੁਪਰੀਮ ਕੋਰਟ ਨੂੰ ਭੇਜਣਾ"),
  "Put the proposal to a statewide referendum": lp("प्रस्ताव पर पूरे राज्य में जनमत-संग्रह कराना", "ਪ੍ਰਸਤਾਵ ਉੱਤੇ ਪੂਰੇ ਰਾਜ ਵਿੱਚ ਜਨਮਤ-ਸੰਗ੍ਰਹਿ ਕਰਵਾਉਣਾ"),
  "Alter the name of an existing State": lp("किसी मौजूदा राज्य का नाम बदलना", "ਕਿਸੇ ਮੌਜੂਦਾ ਰਾਜ ਦਾ ਨਾਮ ਬਦਲਣਾ"),
  "Amend the basic structure of the Constitution by ordinary law": lp("साधारण कानून से संविधान की मूल संरचना बदलना", "ਸਧਾਰਣ ਕਾਨੂੰਨ ਨਾਲ ਸੰਵਿਧਾਨ ਦੀ ਮੂਲ ਸੰਰਚਨਾ ਬਦਲਣਾ"),
  "Abolish Parliament itself": lp("संसद को ही समाप्त करना", "ਸੰਸਦ ਨੂੰ ਹੀ ਖਤਮ ਕਰਨਾ"),
  "Change a Fundamental Right without using the amendment process": lp("संशोधन प्रक्रिया के बिना मौलिक अधिकार बदलना", "ਸੰਸ਼ੋਧਨ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਿਨਾਂ ਮੂਲ ਅਧਿਕਾਰ ਬਦਲਣਾ"),
  "expressing its views on the proposal referred by the President": lp("राष्ट्रपति द्वारा भेजे प्रस्ताव पर अपने विचार व्यक्त करना", "ਰਾਸ਼ਟਰਪਤੀ ਵੱਲੋਂ ਭੇਜੇ ਪ੍ਰਸਤਾਵ ਤੇ ਆਪਣੇ ਵਿਚਾਰ ਦੇਣਾ"),
  "giving a constitutionally binding veto": lp("संवैधानिक रूप से बाध्यकारी वीटो देना", "ਸੰਵਿਧਾਨਕ ਤੌਰ ਤੇ ਬਾਧਕ ਵੀਟੋ ਦੇਣਾ"),
  "ratifying the Bill after Parliament passes it": lp("संसद से पारित होने के बाद विधेयक की पुष्टि करना", "ਸੰਸਦ ਤੋਂ ਪਾਸ ਹੋਣ ਮਗਰੋਂ ਬਿੱਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨਾ"),
  "authorising the President to introduce the Bill": lp("राष्ट्रपति को विधेयक पेश करने की अनुमति देना", "ਰਾਸ਼ਟਰਪਤੀ ਨੂੰ ਬਿੱਲ ਪੇਸ਼ ਕਰਨ ਦੀ ਆਗਿਆ ਦੇਣਾ"),
  "not deemed to be a constitutional amendment": lp("संवैधानिक संशोधन नहीं माना जाता", "ਸੰਵਿਧਾਨਕ ਸੰਸ਼ੋਧਨ ਨਹੀਂ ਮੰਨਿਆ ਜਾਂਦਾ"),
  "always treated as a constitutional amendment requiring special majority": lp("हमेशा विशेष बहुमत वाला संवैधानिक संशोधन माना जाता", "ਹਮੇਸ਼ਾਂ ਵਿਸ਼ੇਸ਼ ਬਹੁਮਤ ਵਾਲਾ ਸੰਵਿਧਾਨਕ ਸੰਸ਼ੋਧਨ ਮੰਨਿਆ ਜਾਂਦਾ"),
  "valid only after ratification by half the States": lp("आधे राज्यों की पुष्टि के बाद ही वैध", "ਅੱਧੇ ਰਾਜਾਂ ਦੀ ਪੁਸ਼ਟੀ ਤੋਂ ਬਾਅਦ ਹੀ ਵੈਧ"),
  "treated as an amendment only when a State name is changed": lp("केवल राज्य का नाम बदलने पर संशोधन माना जाता", "ਸਿਰਫ਼ ਰਾਜ ਦਾ ਨਾਮ ਬਦਲਣ ਤੇ ਸੰਸ਼ੋਧਨ ਮੰਨਿਆ ਜਾਂਦਾ"),
  "Article 4 says qualifying laws under Articles 2 and 3 are not deemed constitutional amendments for Article 368 purposes.": lp("अनुच्छेद 4 के अनुसार अनुच्छेद 2 और 3 के अंतर्गत योग्य कानून अनुच्छेद 368 के लिए संवैधानिक संशोधन नहीं माने जाते।", "ਅਨੁਛੇਦ 4 ਅਨੁਸਾਰ ਅਨੁਛੇਦ 2 ਅਤੇ 3 ਹੇਠ ਯੋਗ ਕਾਨੂੰਨ ਅਨੁਛੇਦ 368 ਲਈ ਸੰਵਿਧਾਨਕ ਸੰਸ਼ੋਧਨ ਨਹੀਂ ਮੰਨੇ ਜਾਂਦੇ।"),
  "Article 4 requires every State-reorganisation law to follow Article 368.": lp("अनुच्छेद 4 हर राज्य-पुनर्गठन कानून के लिए अनुच्छेद 368 की प्रक्रिया अनिवार्य करता है।", "ਅਨੁਛੇਦ 4 ਹਰ ਰਾਜ-ਪੁਨਰਗਠਨ ਕਾਨੂੰਨ ਲਈ ਅਨੁਛੇਦ 368 ਦੀ ਪ੍ਰਕਿਰਿਆ ਲਾਜ਼ਮੀ ਕਰਦਾ ਹੈ।"),
  "Article 4 removes Parliament's power to amend the First Schedule.": lp("अनुच्छेद 4 संसद की प्रथम अनुसूची बदलने की शक्ति समाप्त करता है।", "ਅਨੁਛੇਦ 4 ਸੰਸਦ ਦੀ ਪਹਿਲੀ ਅਨੁਸੂਚੀ ਬਦਲਣ ਦੀ ਸ਼ਕਤੀ ਖਤਮ ਕਰਦਾ ਹੈ।"),
  "Article 4 applies only to Fundamental Rights amendments.": lp("अनुच्छेद 4 केवल मौलिक अधिकारों के संशोधनों पर लागू होता है।", "ਅਨੁਛੇਦ 4 ਸਿਰਫ਼ ਮੂਲ ਅਧਿਕਾਰਾਂ ਦੇ ਸੰਸ਼ੋਧਨਾਂ ਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।"),
  "19 July 1948": lp("19 जुलाई 1948", "19 ਜੁਲਾਈ 1948"),
  "1 March 1947": lp("1 मार्च 1947", "1 ਮਾਰਚ 1947"),
  "15 August 1947": lp("15 अगस्त 1947", "15 ਅਗਸਤ 1947"),
  "26 January 1950": lp("26 जनवरी 1950", "26 ਜਨਵਰੀ 1950"),
  "Registration as a citizen": lp("नागरिक के रूप में पंजीकरण", "ਨਾਗਰਿਕ ਵਜੋਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ"),
  "Only residence since migration": lp("केवल प्रवास के बाद से निवास", "ਸਿਰਫ਼ ਪਰਵਾਸ ਤੋਂ ਬਾਅਦ ਤੋਂ ਨਿਵਾਸ"),
  "Approval by a State Legislature": lp("राज्य विधानमंडल की मंजूरी", "ਰਾਜ ਵਿਧਾਨ ਮੰਡਲ ਦੀ ਮਨਜ਼ੂਰੀ"),
  "A permit under Article 7": lp("अनुच्छेद 7 के अंतर्गत परमिट", "ਅਨੁਛੇਦ 7 ਹੇਠ ਪਰਮਿਟ"),
  "At least six months": lp("कम से कम छह महीने", "ਘੱਟੋ-ਘੱਟ ਛੇ ਮਹੀਨੇ"),
  "At least one year": lp("कम से कम एक वर्ष", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਾਲ"),
  "At least five years": lp("कम से कम पाँच वर्ष", "ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ"),
  "At least ten years": lp("कम से कम दस वर्ष", "ਘੱਟੋ-ਘੱਟ ਦਸ ਸਾਲ"),
  "Article 7 deals with certain migrants to Pakistan; Article 8 deals with certain persons of Indian origin living outside India.": lp("अनुच्छेद 7 पाकिस्तान गए कुछ प्रवासियों से संबंधित है; अनुच्छेद 8 भारत से बाहर रहने वाले भारतीय मूल के कुछ व्यक्तियों से संबंधित है।", "ਅਨੁਛੇਦ 7 ਪਾਕਿਸਤਾਨ ਗਏ ਕੁਝ ਪਰਵਾਸੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ; ਅਨੁਛੇਦ 8 ਭਾਰਤ ਤੋਂ ਬਾਹਰ ਰਹਿੰਦੇ ਭਾਰਤੀ ਮੂਲ ਦੇ ਕੁਝ ਵਿਅਕਤੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।"),
  "Article 7 deals with State boundaries; Article 8 gives Parliament citizenship powers.": lp("अनुच्छेद 7 राज्य सीमाओं से संबंधित है; अनुच्छेद 8 संसद को नागरिकता की शक्ति देता है।", "ਅਨੁਛੇਦ 7 ਰਾਜ ਦੀਆਂ ਹੱਦਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ; ਅਨੁਛੇਦ 8 ਸੰਸਦ ਨੂੰ ਨਾਗਰਿਕਤਾ ਦੀ ਸ਼ਕਤੀ ਦਿੰਦਾ ਹੈ।"),
  "Article 7 deals with foreign citizenship; Article 8 deals with continuation of citizenship.": lp("अनुच्छेद 7 विदेशी नागरिकता से संबंधित है; अनुच्छेद 8 नागरिकता जारी रहने से संबंधित है।", "ਅਨੁਛੇਦ 7 ਵਿਦੇਸ਼ੀ ਨਾਗਰਿਕਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ; ਅਨੁਛੇਦ 8 ਨਾਗਰਿਕਤਾ ਜਾਰੀ ਰਹਿਣ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।"),
  "Both Articles deal only with migrants from Pakistan to India.": lp("दोनों अनुच्छेद केवल पाकिस्तान से भारत आए प्रवासियों से संबंधित हैं।", "ਦੋਵੇਂ ਅਨੁਛੇਦ ਸਿਰਫ਼ ਪਾਕਿਸਤਾਨ ਤੋਂ ਭਾਰਤ ਆਏ ਪਰਵਾਸੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।"),
  "Preamble — constitutional ideals; Article 4 — consequences of laws under Articles 2 and 3; Article 11 — Parliament's legislative power over citizenship": lp("प्रस्तावना — संवैधानिक आदर्श; अनुच्छेद 4 — अनुच्छेद 2 और 3 के कानूनों के परिणाम; अनुच्छेद 11 — नागरिकता पर संसद की विधायी शक्ति", "ਪ੍ਰਸਤਾਵਨਾ — ਸੰਵਿਧਾਨਕ ਆਦਰਸ਼; ਅਨੁਛੇਦ 4 — ਅਨੁਛੇਦ 2 ਅਤੇ 3 ਦੇ ਕਾਨੂੰਨਾਂ ਦੇ ਨਤੀਜੇ; ਅਨੁਛੇਦ 11 — ਨਾਗਰਿਕਤਾ ਉੱਤੇ ਸੰਸਦ ਦੀ ਵਿਧਾਨਕ ਸ਼ਕਤੀ"),
  "Preamble — acquisition of citizenship; Article 4 — Fundamental Rights; Article 11 — State boundaries": lp("प्रस्तावना — नागरिकता की प्राप्ति; अनुच्छेद 4 — मौलिक अधिकार; अनुच्छेद 11 — राज्य सीमाएँ", "ਪ੍ਰਸਤਾਵਨਾ — ਨਾਗਰਿਕਤਾ ਦੀ ਪ੍ਰਾਪਤੀ; ਅਨੁਛੇਦ 4 — ਮੂਲ ਅਧਿਕਾਰ; ਅਨੁਛੇਦ 11 — ਰਾਜ ਦੀਆਂ ਹੱਦਾਂ"),
  "Preamble — State reorganisation procedure; Article 4 — citizenship at commencement; Article 11 — constitutional amendment procedure": lp("प्रस्तावना — राज्य पुनर्गठन प्रक्रिया; अनुच्छेद 4 — प्रारंभ के समय नागरिकता; अनुच्छेद 11 — संवैधानिक संशोधन प्रक्रिया", "ਪ੍ਰਸਤਾਵਨਾ — ਰਾਜ ਪੁਨਰਗਠਨ ਪ੍ਰਕਿਰਿਆ; ਅਨੁਛੇਦ 4 — ਸ਼ੁਰੂਆਤ ਸਮੇਂ ਨਾਗਰਿਕਤਾ; ਅਨੁਛੇਦ 11 — ਸੰਵਿਧਾਨਕ ਸੰਸ਼ੋਧਨ ਪ੍ਰਕਿਰਿਆ"),
  "Preamble — parliamentary privileges; Article 4 — emergency powers; Article 11 — judicial review": lp("प्रस्तावना — संसदीय विशेषाधिकार; अनुच्छेद 4 — आपात शक्तियाँ; अनुच्छेद 11 — न्यायिक समीक्षा", "ਪ੍ਰਸਤਾਵਨਾ — ਸੰਸਦੀ ਵਿਸ਼ੇਸ਼ ਅਧਿਕਾਰ; ਅਨੁਛੇਦ 4 — ਐਮਰਜੈਂਸੀ ਸ਼ਕਤੀਆਂ; ਅਨੁਛੇਦ 11 — ਨਿਆਂਇਕ ਸਮੀਖਿਆ"),
});

const UNION_SUBJECTS: Readonly<Record<number, Pair>> = Object.freeze({
  1: lp("संघ का नाम और क्षेत्र", "ਸੰਘ ਦਾ ਨਾਮ ਅਤੇ ਖੇਤਰ"),
  2: lp("नए राज्यों का प्रवेश या स्थापना", "ਨਵੇਂ ਰਾਜਾਂ ਦਾ ਦਾਖਲਾ ਜਾਂ ਸਥਾਪਨਾ"),
  3: lp("नए राज्यों का गठन तथा मौजूदा राज्यों के क्षेत्र, सीमाओं या नाम में परिवर्तन", "ਨਵੇਂ ਰਾਜਾਂ ਦੀ ਰਚਨਾ ਅਤੇ ਮੌਜੂਦਾ ਰਾਜਾਂ ਦੇ ਖੇਤਰ, ਹੱਦਾਂ ਜਾਂ ਨਾਮ ਵਿੱਚ ਬਦਲਾਅ"),
  4: lp("अनुच्छेद 2 और 3 के कानूनों के लिए आनुषंगिक प्रावधान", "ਅਨੁਛੇਦ 2 ਅਤੇ 3 ਦੇ ਕਾਨੂੰਨਾਂ ਲਈ ਅਨੁਸੰਗੀ ਪ੍ਰਬੰਧ"),
});
const CIT_SUBJECTS: Readonly<Record<number, Pair>> = Object.freeze({
  5: lp("संविधान के प्रारंभ के समय नागरिकता", "ਸੰਵਿਧਾਨ ਲਾਗੂ ਹੋਣ ਵੇਲੇ ਨਾਗਰਿਕਤਾ"),
  6: lp("पाकिस्तान से भारत आए कुछ व्यक्तियों की नागरिकता", "ਪਾਕਿਸਤਾਨ ਤੋਂ ਭਾਰਤ ਆਏ ਕੁਝ ਵਿਅਕਤੀਆਂ ਦੀ ਨਾਗਰਿਕਤਾ"),
  7: lp("पाकिस्तान गए कुछ प्रवासियों की नागरिकता", "ਪਾਕਿਸਤਾਨ ਗਏ ਕੁਝ ਪਰਵਾਸੀਆਂ ਦੀ ਨਾਗਰਿਕਤਾ"),
  8: lp("भारत से बाहर रहने वाले भारतीय मूल के कुछ व्यक्तियों की नागरिकता", "ਭਾਰਤ ਤੋਂ ਬਾਹਰ ਰਹਿੰਦੇ ਭਾਰਤੀ ਮੂਲ ਦੇ ਕੁਝ ਵਿਅਕਤੀਆਂ ਦੀ ਨਾਗਰਿਕਤਾ"),
  9: lp("स्वेच्छा से विदेशी नागरिकता लेने का प्रभाव", "ਸਵੈਇੱਛਾ ਨਾਲ ਵਿਦੇਸ਼ੀ ਨਾਗਰਿਕਤਾ ਲੈਣ ਦਾ ਪ੍ਰਭਾਵ"),
  10: lp("नागरिकता के अधिकारों का जारी रहना", "ਨਾਗਰਿਕਤਾ ਦੇ ਅਧਿਕਾਰਾਂ ਦਾ ਜਾਰੀ ਰਹਿਣਾ"),
  11: lp("नागरिकता को कानून द्वारा विनियमित करने की संसद की शक्ति", "ਨਾਗਰਿਕਤਾ ਨੂੰ ਕਾਨੂੰਨ ਰਾਹੀਂ ਨਿਯਮਿਤ ਕਰਨ ਦੀ ਸੰਸਦ ਦੀ ਸ਼ਕਤੀ"),
});
const ARTICLE = (n: number | string, l: NativeLocale) => l === "hi" ? `अनुच्छेद ${n}` : `ਅਨੁਛੇਦ ${n}`;

function subjectArticle(text: string): number | undefined {
  return POL_CP003_UNION_ARTICLES_V1.find((x) => x.subject === text)?.article ??
    POL_CP003_CITIZENSHIP_ARTICLES_V1.find((x) => x.subject === text)?.article;
}
function option(text: string, locale: NativeLocale): string {
  if (COMMON[text]) return native(COMMON[text]!, locale);
  const articleMatch = text.match(/^Article (\d+)$/);
  if (articleMatch) return ARTICLE(articleMatch[1]!, locale);
  const a = subjectArticle(text);
  if (a) return native(a <= 4 ? UNION_SUBJECTS[a]! : CIT_SUBJECTS[a]!, locale);
  if (/^\d+$/.test(text)) return text;
  throw new Error(`Untranslated POL-CP-003 option: ${text}`);
}

const ARTICLE5_STATEMENTS: Readonly<Record<string, Pair>> = Object.freeze({
  "Domicile in India was required.": lp("भारत में अधिवास आवश्यक था।", "ਭਾਰਤ ਵਿੱਚ ਡੋਮਿਸਾਈਲ ਲਾਜ਼ਮੀ ਸੀ।"),
  "Being born in India was one qualifying condition.": lp("भारत में जन्म एक अर्हता-शर्त थी।", "ਭਾਰਤ ਵਿੱਚ ਜਨਮ ਇੱਕ ਯੋਗਤਾ-ਸ਼ਰਤ ਸੀ।"),
  "Having either parent born in India was one qualifying condition.": lp("माता या पिता में से किसी एक का भारत में जन्म होना एक अर्हता-शर्त थी।", "ਮਾਤਾ ਜਾਂ ਪਿਤਾ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਦਾ ਭਾਰਤ ਵਿੱਚ ਜਨਮ ਇੱਕ ਯੋਗਤਾ-ਸ਼ਰਤ ਸੀ।"),
  "Ordinary residence in India for at least five years before commencement was one qualifying condition.": lp("प्रारंभ से पहले कम से कम पाँच वर्ष भारत में सामान्य निवास एक अर्हता-शर्त थी।", "ਲਾਗੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ ਭਾਰਤ ਵਿੱਚ ਆਮ ਨਿਵਾਸ ਇੱਕ ਯੋਗਤਾ-ਸ਼ਰਤ ਸੀ।"),
  "Domicile in India was irrelevant under Article 5.": lp("अनुच्छेद 5 के तहत भारत में अधिवास अप्रासंगिक था।", "ਅਨੁਛੇਦ 5 ਹੇਠ ਭਾਰਤ ਵਿੱਚ ਡੋਮਿਸਾਈਲ ਅਪ੍ਰਸੰਗਿਕ ਸੀ।"),
  "Article 5 required ten years of ordinary residence in every case.": lp("अनुच्छेद 5 में हर मामले में दस वर्ष का सामान्य निवास आवश्यक था।", "ਅਨੁਛੇਦ 5 ਵਿੱਚ ਹਰ ਮਾਮਲੇ ਵਿੱਚ ਦਸ ਸਾਲ ਦਾ ਆਮ ਨਿਵਾਸ ਲਾਜ਼ਮੀ ਸੀ।"),
  "Only birth in India could qualify a person under Article 5.": lp("अनुच्छेद 5 के तहत केवल भारत में जन्म ही अर्हता दे सकता था।", "ਅਨੁਛੇਦ 5 ਹੇਠ ਸਿਰਫ਼ ਭਾਰਤ ਵਿੱਚ ਜਨਮ ਹੀ ਯੋਗਤਾ ਦੇ ਸਕਦਾ ਸੀ।"),
  "Article 5 dealt only with citizenship acquired after 1950.": lp("अनुच्छेद 5 केवल 1950 के बाद प्राप्त नागरिकता से संबंधित था।", "ਅਨੁਛੇਦ 5 ਸਿਰਫ਼ 1950 ਤੋਂ ਬਾਅਦ ਪ੍ਰਾਪਤ ਨਾਗਰਿਕਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਸੀ।"),
});

const SCENARIOS: Readonly<Record<string, Pair>> = Object.freeze({
  "At the start of the Constitution, a person had domicile in India and was born in India.": lp("संविधान के प्रारंभ के समय एक व्यक्ति का भारत में अधिवास था और उसका जन्म भारत में हुआ था।", "ਸੰਵਿਧਾਨ ਲਾਗੂ ਹੋਣ ਵੇਲੇ ਇੱਕ ਵਿਅਕਤੀ ਦਾ ਭਾਰਤ ਵਿੱਚ ਡੋਮਿਸਾਈਲ ਸੀ ਅਤੇ ਉਸਦਾ ਜਨਮ ਭਾਰਤ ਵਿੱਚ ਹੋਇਆ ਸੀ।"),
  "A qualifying migrant came from Pakistan to India on or after 19 July 1948 and applied for registration as a citizen.": lp("एक पात्र प्रवासी 19 जुलाई 1948 को या उसके बाद पाकिस्तान से भारत आया और नागरिक के रूप में पंजीकरण के लिए आवेदन किया।", "ਇੱਕ ਯੋਗ ਪਰਵਾਸੀ 19 ਜੁਲਾਈ 1948 ਨੂੰ ਜਾਂ ਉਸ ਤੋਂ ਬਾਅਦ ਪਾਕਿਸਤਾਨ ਤੋਂ ਭਾਰਤ ਆਇਆ ਅਤੇ ਨਾਗਰਿਕ ਵਜੋਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿੱਤੀ।"),
  "A person migrated from India to Pakistan after 1 March 1947, then returned to India with a permit for resettlement or permanent return.": lp("एक व्यक्ति 1 मार्च 1947 के बाद भारत से पाकिस्तान गया और फिर पुनर्वास या स्थायी वापसी के परमिट के साथ भारत लौटा।", "ਇੱਕ ਵਿਅਕਤੀ 1 ਮਾਰਚ 1947 ਤੋਂ ਬਾਅਦ ਭਾਰਤ ਤੋਂ ਪਾਕਿਸਤਾਨ ਗਿਆ ਅਤੇ ਫਿਰ ਪੁਨਰਵਸਾਹ ਜਾਂ ਸਥਾਈ ਵਾਪਸੀ ਦੇ ਪਰਮਿਟ ਨਾਲ ਭਾਰਤ ਮੁੜ ਆਇਆ।"),
  "A person of Indian origin lived outside India and applied for registration through an Indian diplomatic or consular representative.": lp("भारतीय मूल का एक व्यक्ति भारत से बाहर रहता था और उसने भारतीय राजनयिक या वाणिज्य-दूत प्रतिनिधि के माध्यम से पंजीकरण के लिए आवेदन किया।", "ਭਾਰਤੀ ਮੂਲ ਦਾ ਇੱਕ ਵਿਅਕਤੀ ਭਾਰਤ ਤੋਂ ਬਾਹਰ ਰਹਿੰਦਾ ਸੀ ਅਤੇ ਉਸਨੇ ਭਾਰਤੀ ਰਾਜਨਾਇਕ ਜਾਂ ਕੌਂਸੁਲਰ ਪ੍ਰਤੀਨਿਧੀ ਰਾਹੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿੱਤੀ।"),
});

function statement(text: string, locale: NativeLocale): string {
  if (ARTICLE5_STATEMENTS[text]) return native(ARTICLE5_STATEMENTS[text]!, locale);
  const map: Readonly<Record<string, Pair>> = {
    "The Preamble currently describes India as a Sovereign Socialist Secular Democratic Republic.": lp("प्रस्तावना वर्तमान में भारत को संपूर्ण प्रभुत्व-संपन्न समाजवादी पंथनिरपेक्ष लोकतांत्रिक गणराज्य बताती है।", "ਪ੍ਰਸਤਾਵਨਾ ਇਸ ਵੇਲੇ ਭਾਰਤ ਨੂੰ ਸੰਪੂਰਨ ਪ੍ਰਭੁਤਵ-ਸੰਪੰਨ ਸਮਾਜਵਾਦੀ ਧਰਮਨਿਰਪੇਖ ਲੋਕਤਾਂਤਰਿਕ ਗਣਰਾਜ ਦੱਸਦੀ ਹੈ।"),
    "Article 3 gives an affected State Legislature a binding veto over a State-reorganisation Bill.": lp("अनुच्छेद 3 प्रभावित राज्य विधानमंडल को राज्य-पुनर्गठन विधेयक पर बाध्यकारी वीटो देता है।", "ਅਨੁਛੇਦ 3 ਪ੍ਰਭਾਵਿਤ ਰਾਜ ਵਿਧਾਨ ਮੰਡਲ ਨੂੰ ਰਾਜ-ਪੁਨਰਗਠਨ ਬਿੱਲ ਉੱਤੇ ਬਾਧਕ ਵੀਟੋ ਦਿੰਦਾ ਹੈ।"),
    "Article 11 preserves Parliament's power to legislate on acquisition and termination of citizenship.": lp("अनुच्छेद 11 नागरिकता के अधिग्रहण और समाप्ति पर कानून बनाने की संसद की शक्ति बनाए रखता है।", "ਅਨੁਛੇਦ 11 ਨਾਗਰਿਕਤਾ ਦੀ ਪ੍ਰਾਪਤੀ ਅਤੇ ਸਮਾਪਤੀ ਉੱਤੇ ਕਾਨੂੰਨ ਬਣਾਉਣ ਦੀ ਸੰਸਦ ਦੀ ਸ਼ਕਤੀ ਕਾਇਮ ਰੱਖਦਾ ਹੈ।"),
    "A law covered by Article 4 is not deemed a constitutional amendment for Article 368 purposes.": lp("अनुच्छेद 4 के अंतर्गत आने वाला कानून अनुच्छेद 368 के लिए संवैधानिक संशोधन नहीं माना जाता।", "ਅਨੁਛੇਦ 4 ਹੇਠ ਆਉਂਦਾ ਕਾਨੂੰਨ ਅਨੁਛੇਦ 368 ਲਈ ਸੰਵਿਧਾਨਕ ਸੰਸ਼ੋਧਨ ਨਹੀਂ ਮੰਨਿਆ ਜਾਂਦਾ।"),
    "Article 8 concerns certain persons of Indian origin residing outside India.": lp("अनुच्छेद 8 भारत से बाहर रहने वाले भारतीय मूल के कुछ व्यक्तियों से संबंधित है।", "ਅਨੁਛੇਦ 8 ਭਾਰਤ ਤੋਂ ਬਾਹਰ ਰਹਿੰਦੇ ਭਾਰਤੀ ਮੂਲ ਦੇ ਕੁਝ ਵਿਅਕਤੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।"),
    "The words Socialist and Secular formed part of the original Preamble adopted in 1949.": lp("समाजवादी और पंथनिरपेक्ष शब्द 1949 में अंगीकृत मूल प्रस्तावना का भाग थे।", "ਸਮਾਜਵਾਦੀ ਅਤੇ ਧਰਮਨਿਰਪੇਖ ਸ਼ਬਦ 1949 ਵਿੱਚ ਅੰਗੀਕਾਰ ਕੀਤੀ ਮੂਲ ਪ੍ਰਸਤਾਵਨਾ ਦਾ ਹਿੱਸਾ ਸਨ।"),
  };
  const pair = map[text];
  if (!pair) throw new Error(`Untranslated POL-CP-003 statement: ${text}`);
  return native(pair, locale);
}

function stem(q: (typeof ENGLISH)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  if (ql === 1) {
    const row = POL_CP003_PREAMBLE_OBJECTIVES_V1.find((x) => x.concept === q.canonicalAnswer)!;
    return locale === "hi" ? `प्रस्तावना के शब्द “${option(row.wording, locale)}” किस आदर्श से संबंधित हैं?` : `ਪ੍ਰਸਤਾਵਨਾ ਦੇ ਸ਼ਬਦ “${option(row.wording, locale)}” ਕਿਹੜੇ ਆਦਰਸ਼ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ?`;
  }
  if (ql === 2) {
    const row = POL_CP003_PREAMBLE_OBJECTIVES_V1.find((x) => x.wording === q.canonicalAnswer)!;
    return locale === "hi" ? `प्रस्तावना में ${option(row.concept, locale)} का वर्णन किन शब्दों से किया गया है?` : `ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ${option(row.concept, locale)} ਦਾ ਵਰਣਨ ਕਿਹੜੇ ਸ਼ਬਦਾਂ ਨਾਲ ਕੀਤਾ ਗਿਆ ਹੈ?`;
  }
  if (ql === 3) {
    if (q.canonicalAnswer === "Socialist and Secular") return locale === "hi" ? "1949 में अंगीकृत मूल प्रस्तावना में कौन-से दो शब्द नहीं थे?" : "1949 ਵਿੱਚ ਅੰਗੀਕਾਰ ਕੀਤੀ ਮੂਲ ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ਕਿਹੜੇ ਦੋ ਸ਼ਬਦ ਨਹੀਂ ਸਨ?";
    if (q.canonicalAnswer === "Sovereign Socialist Secular Democratic Republic") return locale === "hi" ? "वर्तमान प्रस्तावना भारत को किस रूप में वर्णित करती है?" : "ਮੌਜੂਦਾ ਪ੍ਰਸਤਾਵਨਾ ਭਾਰਤ ਨੂੰ ਕਿਸ ਰੂਪ ਵਿੱਚ ਦਰਸਾਉਂਦੀ ਹੈ?";
    return locale === "hi" ? "1949 में अंगीकृत मूल प्रस्तावना में कौन-सा शब्द था?" : "1949 ਵਿੱਚ ਅੰਗੀਕਾਰ ਕੀਤੀ ਮੂਲ ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ਕਿਹੜਾ ਸ਼ਬਦ ਸੀ?";
  }
  if (ql === 4) {
    if (q.canonicalAnswer === "Forty-second Amendment") return locale === "hi" ? "प्रस्तावना में ‘समाजवादी’ और ‘पंथनिरपेक्ष’ शब्द किस संशोधन से जोड़े गए?" : "ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ‘ਸਮਾਜਵਾਦੀ’ ਅਤੇ ‘ਧਰਮਨਿਰਪੇਖ’ ਸ਼ਬਦ ਕਿਹੜੇ ਸੰਸ਼ੋਧਨ ਨਾਲ ਜੋੜੇ ਗਏ?";
    if (q.canonicalAnswer.startsWith("It changed")) return locale === "hi" ? "42वें संशोधन ने प्रस्तावना के बंधुता संबंधी भाग में क्या परिवर्तन किया?" : "42ਵੇਂ ਸੰਸ਼ੋਧਨ ਨੇ ਪ੍ਰਸਤਾਵਨਾ ਦੇ ਭਾਈਚਾਰੇ ਨਾਲ ਸੰਬੰਧਿਤ ਹਿੱਸੇ ਵਿੱਚ ਕੀ ਬਦਲਾਅ ਕੀਤਾ?";
    return locale === "hi" ? "इनमें से कौन-सा समूह केवल 42वें संशोधन द्वारा प्रस्तावना में किए गए परिवर्तनों को दिखाता है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਮੂਹ ਸਿਰਫ਼ 42ਵੇਂ ਸੰਸ਼ੋਧਨ ਰਾਹੀਂ ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ਕੀਤੇ ਬਦਲਾਅ ਦਿਖਾਉਂਦਾ ਹੈ?";
  }
  if (ql === 5) {
    const a = subjectArticle(q.canonicalAnswer)!;
    return locale === "hi" ? `संविधान के अनुच्छेद ${a} का मुख्य विषय क्या है?` : `ਸੰਵਿਧਾਨ ਦੇ ਅਨੁਛੇਦ ${a} ਦਾ ਮੁੱਖ ਵਿਸ਼ਾ ਕੀ ਹੈ?`;
  }
  if (ql === 6) {
    const a = Number(q.canonicalAnswer.replace("Article ", ""));
    return locale === "hi" ? `${native(UNION_SUBJECTS[a]!, locale)} किस अनुच्छेद में है?` : `${native(UNION_SUBJECTS[a]!, locale)} ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਹੈ?`;
  }
  if (ql === 7) {
    if (q.canonicalAnswer.startsWith("Territories of")) return locale === "hi" ? "अनुच्छेद 1 के अनुसार भारत के क्षेत्र में क्या शामिल है?" : "ਅਨੁਛੇਦ 1 ਅਨੁਸਾਰ ਭਾਰਤ ਦੇ ਖੇਤਰ ਵਿੱਚ ਕੀ ਸ਼ਾਮਲ ਹੈ?";
    if (q.canonicalAnswer === "a Union of States") return locale === "hi" ? "अनुच्छेद 1 भारत को किस रूप में वर्णित करता है?" : "ਅਨੁਛੇਦ 1 ਭਾਰਤ ਨੂੰ ਕਿਸ ਰੂਪ ਵਿੱਚ ਦਰਸਾਉਂਦਾ ਹੈ?";
    if (q.canonicalAnswer === "First Schedule") return locale === "hi" ? "अनुच्छेद 1 में राज्यों और संघ राज्य क्षेत्रों के संदर्भ में कौन-सी अनुसूची जुड़ी है?" : "ਅਨੁਛੇਦ 1 ਵਿੱਚ ਰਾਜਾਂ ਅਤੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ਾਂ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਜੁੜੀ ਹੈ?";
    return locale === "hi" ? "अनुच्छेद 1 के संबंध में कौन-सा कथन सही है?" : "ਅਨੁਛੇਦ 1 ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";
  }
  if (ql === 8) {
    if (q.canonicalAnswer === "The President") return locale === "hi" ? "अनुच्छेद 3 का विधेयक किसकी सिफारिश पर ही पेश किया जा सकता है?" : "ਅਨੁਛੇਦ 3 ਦਾ ਬਿੱਲ ਕਿਸ ਦੀ ਸਿਫਾਰਸ਼ ਤੇ ਹੀ ਪੇਸ਼ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
    if (q.canonicalAnswer.startsWith("Refer it")) return locale === "hi" ? "अनुच्छेद 3 का विधेयक किसी राज्य को प्रभावित करे तो राष्ट्रपति को पहले क्या करना होता है?" : "ਜੇ ਅਨੁਛੇਦ 3 ਦਾ ਬਿੱਲ ਕਿਸੇ ਰਾਜ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰੇ ਤਾਂ ਰਾਸ਼ਟਰਪਤੀ ਨੂੰ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਹੁੰਦਾ ਹੈ?";
    if (q.canonicalAnswer === "Alter the name of an existing State") return locale === "hi" ? "अनुच्छेद 3 के तहत संसद इनमें से क्या कर सकती है?" : "ਅਨੁਛੇਦ 3 ਹੇਠ ਸੰਸਦ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੀ ਕਰ ਸਕਦੀ ਹੈ?";
    return locale === "hi" ? "अनुच्छेद 3 के तहत प्रभावित राज्य विधानमंडल की भूमिका क्या है?" : "ਅਨੁਛੇਦ 3 ਹੇਠ ਪ੍ਰਭਾਵਿਤ ਰਾਜ ਵਿਧਾਨ ਮੰਡਲ ਦੀ ਭੂਮਿਕਾ ਕੀ ਹੈ?";
  }
  if (ql === 9) {
    if (q.canonicalAnswer === "First and Fourth Schedules") return locale === "hi" ? "अनुच्छेद 4 के तहत अनुच्छेद 2 या 3 का कानून किन अनुसूचियों में आवश्यक बदलाव कर सकता है?" : "ਅਨੁਛੇਦ 4 ਹੇਠ ਅਨੁਛੇਦ 2 ਜਾਂ 3 ਦਾ ਕਾਨੂੰਨ ਕਿਹੜੀਆਂ ਅਨੁਸੂਚੀਆਂ ਵਿੱਚ ਲੋੜੀਂਦੇ ਬਦਲਾਅ ਕਰ ਸਕਦਾ ਹੈ?";
    if (q.canonicalAnswer === "not deemed to be a constitutional amendment") return locale === "hi" ? "अनुच्छेद 4 के तहत अनुच्छेद 2 या 3 का कानून अनुच्छेद 368 के लिए किस रूप में माना जाता है?" : "ਅਨੁਛੇਦ 4 ਹੇਠ ਅਨੁਛੇਦ 2 ਜਾਂ 3 ਦਾ ਕਾਨੂੰਨ ਅਨੁਛੇਦ 368 ਲਈ ਕਿਸ ਰੂਪ ਵਿੱਚ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ?";
    if (q.canonicalAnswer === "Article 4") return locale === "hi" ? "अनुच्छेद 2 और 3 के कानूनों में पूरक और आनुषंगिक प्रावधान की अनुमति कौन-सा अनुच्छेद देता है?" : "ਅਨੁਛੇਦ 2 ਅਤੇ 3 ਦੇ ਕਾਨੂੰਨਾਂ ਵਿੱਚ ਪੂਰਕ ਅਤੇ ਅਨੁਸੰਗੀ ਪ੍ਰਬੰਧ ਦੀ ਆਗਿਆ ਕਿਹੜਾ ਅਨੁਛੇਦ ਦਿੰਦਾ ਹੈ?";
    return locale === "hi" ? "अनुच्छेद 4 के संबंध में कौन-सा कथन सही है?" : "ਅਨੁਛੇਦ 4 ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";
  }
  if (ql === 10) {
    const a = subjectArticle(q.canonicalAnswer)!;
    return locale === "hi" ? `संविधान के अनुच्छेद ${a} में नागरिकता से जुड़ा मुख्य विषय क्या है?` : `ਸੰਵਿਧਾਨ ਦੇ ਅਨੁਛੇਦ ${a} ਵਿੱਚ ਨਾਗਰਿਕਤਾ ਨਾਲ ਜੁੜਿਆ ਮੁੱਖ ਵਿਸ਼ਾ ਕੀ ਹੈ?`;
  }
  if (ql === 11 || ql === 14) {
    const a = Number(q.canonicalAnswer.replace("Article ", ""));
    return locale === "hi" ? `${native(CIT_SUBJECTS[a]!, locale)} किस अनुच्छेद में है?` : `${native(CIT_SUBJECTS[a]!, locale)} ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਹੈ?`;
  }
  if (ql === 12) {
    const lines = q.stem.split("\n").slice(1,4).map((x) => x.replace(/^\d\. /,""));
    return [
      locale === "hi" ? "अनुच्छेद 5 के बारे में निम्न कथनों पर विचार कीजिए:" : "ਅਨੁਛੇਦ 5 ਬਾਰੇ ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
      ...lines.map((x,i)=>`${i+1}. ${statement(x, locale)}`),
      locale === "hi" ? "कितने कथन सही हैं?" : "ਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
    ].join("\n");
  }
  if (ql === 13) {
    const source = POL_CP003_SCENARIO_ROWS_V1.find((x) => `Article ${x.article}` === q.canonicalAnswer && q.stem.includes(x.scenario.split(" ").slice(0,4).join(" "))) ??
      POL_CP003_SCENARIO_ROWS_V1.find((x) => `Article ${x.article}` === q.canonicalAnswer)!;
    return `${native(SCENARIOS[source.scenario]!, locale)}\n${locale === "hi" ? "यह स्थिति मुख्य रूप से किस अनुच्छेद के अंतर्गत आती है?" : "ਇਹ ਸਥਿਤੀ ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ ਆਉਂਦੀ ਹੈ?"}`;
  }
  if (ql === 15) {
    const lines = q.stem.split("\n").slice(1,4).map((x) => x.replace(/^\d\. /,""));
    return [
      locale === "hi" ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
      ...lines.map((x,i)=>`${i+1}. ${statement(x, locale)}`),
      locale === "hi" ? "कितने कथन सही हैं?" : "ਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
    ].join("\n");
  }
  if (ql === 16) return locale === "hi" ? "निम्न में से कौन-सा मिलान प्रस्तावना, अनुच्छेद 4 और अनुच्छेद 11 को सही रूप से अलग करता है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਮਿਲਾਨ ਪ੍ਰਸਤਾਵਨਾ, ਅਨੁਛੇਦ 4 ਅਤੇ ਅਨੁਛੇਦ 11 ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਵੱਖ ਕਰਦਾ ਹੈ?";
  if (ql === 17) {
    if (q.canonicalAnswer === "19 July 1948") return locale === "hi" ? "पाकिस्तान से भारत आए कुछ प्रवासियों के लिए अनुच्छेद 6 में कौन-सी तारीख महत्वपूर्ण है?" : "ਪਾਕਿਸਤਾਨ ਤੋਂ ਭਾਰਤ ਆਏ ਕੁਝ ਪਰਵਾਸੀਆਂ ਲਈ ਅਨੁਛੇਦ 6 ਵਿੱਚ ਕਿਹੜੀ ਤਾਰੀਖ ਮਹੱਤਵਪੂਰਨ ਹੈ?";
    if (q.canonicalAnswer === "Registration as a citizen") return locale === "hi" ? "अनुच्छेद 6 के तहत 19 जुलाई 1948 को या उसके बाद आए कुछ प्रवासियों के लिए क्या आवश्यक था?" : "ਅਨੁਛੇਦ 6 ਹੇਠ 19 ਜੁਲਾਈ 1948 ਨੂੰ ਜਾਂ ਉਸ ਤੋਂ ਬਾਅਦ ਆਏ ਕੁਝ ਪਰਵਾਸੀਆਂ ਲਈ ਕੀ ਲੋੜੀਂਦਾ ਸੀ?";
    return locale === "hi" ? "अनुच्छेद 6 के पंजीकरण मार्ग में आवेदन से ठीक पहले कम से कम कितने समय भारत में रहना आवश्यक था?" : "ਅਨੁਛੇਦ 6 ਦੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਮਾਰਗ ਵਿੱਚ ਅਰਜ਼ੀ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਕਿੰਨਾ ਸਮਾਂ ਭਾਰਤ ਵਿੱਚ ਰਹਿਣਾ ਲਾਜ਼ਮੀ ਸੀ?";
  }
  if (ql === 18) {
    if (q.canonicalAnswer.startsWith("Article 7 deals")) return locale === "hi" ? "अनुच्छेद 7 और 8 के बीच सही अंतर कौन-सा है?" : "ਅਨੁਛੇਦ 7 ਅਤੇ 8 ਵਿਚਲਾ ਸਹੀ ਫਰਕ ਕਿਹੜਾ ਹੈ?";
    if (q.canonicalAnswer === "Article 7") return locale === "hi" ? "भारत से पाकिस्तान गए व्यक्ति के स्थायी वापसी के परमिट वाले अपवाद का प्रावधान किस अनुच्छेद में है?" : "ਭਾਰਤ ਤੋਂ ਪਾਕਿਸਤਾਨ ਗਏ ਵਿਅਕਤੀ ਲਈ ਸਥਾਈ ਵਾਪਸੀ ਦੇ ਪਰਮਿਟ ਵਾਲਾ ਅਪਵਾਦ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਹੈ?";
    return locale === "hi" ? "विदेश में रहने वाले भारतीय मूल के कुछ व्यक्तियों के लिए भारतीय राजनयिक या वाणिज्य-दूत प्रतिनिधि के माध्यम से पंजीकरण किस अनुच्छेद में है?" : "ਵਿਦੇਸ਼ ਵਿੱਚ ਰਹਿੰਦੇ ਭਾਰਤੀ ਮੂਲ ਦੇ ਕੁਝ ਵਿਅਕਤੀਆਂ ਲਈ ਭਾਰਤੀ ਰਾਜਨਾਇਕ ਜਾਂ ਕੌਂਸੁਲਰ ਪ੍ਰਤੀਨਿਧੀ ਰਾਹੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਹੈ?";
  }
  throw new Error(`${q.questionId}: unsupported CP003 QL ${ql}`);
}

function trimAnswerPunctuation(value: string): string {
  return value.replace(/[।.]+$/u, "");
}

function explanation(q: (typeof ENGLISH)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  const ans = trimAnswerPunctuation(option(q.canonicalAnswer, locale));
  if (ql === 1 || ql === 2) {
    const row = ql === 1
      ? POL_CP003_PREAMBLE_OBJECTIVES_V1.find((x) => x.concept === q.canonicalAnswer)!
      : POL_CP003_PREAMBLE_OBJECTIVES_V1.find((x) => x.wording === q.canonicalAnswer)!;
    const concept = option(row.concept, locale);
    const wording = option(row.wording, locale);
    return locale === "hi"
      ? `प्रस्तावना में ${concept} को “${wording}” के शब्दों से व्यक्त किया गया है।`
      : `ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ${concept} ਨੂੰ “${wording}” ਵਾਲੇ ਸ਼ਬਦਾਂ ਨਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।`;
  }
  if (ql === 3) {
    if (q.canonicalAnswer === "Socialist and Secular") {
      return locale === "hi"
        ? "‘समाजवादी’ और ‘पंथनिरपेक्ष’ 1949 की मूल प्रस्तावना में नहीं थे; इन्हें 42वें संशोधन से जोड़ा गया।"
        : "‘ਸਮਾਜਵਾਦੀ’ ਅਤੇ ‘ਧਰਮ ਨਿਰਪੱਖ’ 1949 ਦੀ ਮੂਲ ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ਨਹੀਂ ਸਨ; ਇਹ 42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜੇ ਗਏ।";
    }
    if (q.canonicalAnswer === "Sovereign Socialist Secular Democratic Republic") {
      return locale === "hi"
        ? "वर्तमान प्रस्तावना भारत को संपूर्ण प्रभुत्व-संपन्न समाजवादी पंथनिरपेक्ष लोकतांत्रिक गणराज्य बताती है।"
        : "ਮੌਜੂਦਾ ਪ੍ਰਸਤਾਵਨਾ ਭਾਰਤ ਨੂੰ ਸੰਪੂਰਨ ਪ੍ਰਭੂਸੱਤਾ-ਸੰਪੰਨ ਸਮਾਜਵਾਦੀ ਧਰਮ ਨਿਰਪੱਖ ਲੋਕਤੰਤਰੀ ਗਣਰਾਜ ਦੱਸਦੀ ਹੈ।";
    }
    return locale === "hi"
      ? "‘लोकतांत्रिक’ शब्द 1949 में अंगीकृत मूल प्रस्तावना का हिस्सा था।"
      : "‘ਲੋਕਤੰਤਰੀ’ ਸ਼ਬਦ 1949 ਵਿੱਚ ਅੰਗੀਕਾਰ ਕੀਤੀ ਮੂਲ ਪ੍ਰਸਤਾਵਨਾ ਦਾ ਹਿੱਸਾ ਸੀ।";
  }
  if (ql === 4) {
    return locale === "hi"
      ? "42वें संशोधन अधिनियम, 1976 ने प्रस्तावना में ‘समाजवादी’ और ‘पंथनिरपेक्ष’ जोड़े तथा ‘राष्ट्र की एकता’ को ‘राष्ट्र की एकता और अखंडता’ किया।"
      : "42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ, 1976 ਨਾਲ ‘ਸਮਾਜਵਾਦੀ’ ਅਤੇ ‘ਧਰਮ ਨਿਰਪੱਖ’ ਸ਼ਬਦ ਜੋੜੇ ਗਏ ਅਤੇ ‘ਰਾਸ਼ਟਰ ਦੀ ਏਕਤਾ’ ਨੂੰ ‘ਰਾਸ਼ਟਰ ਦੀ ਏਕਤਾ ਤੇ ਅਖੰਡਤਾ’ ਕੀਤਾ ਗਿਆ।";
  }
  if (ql >= 5 && ql <= 11 || ql === 14) {
    const a = q.canonicalAnswer.startsWith("Article ") ? Number(q.canonicalAnswer.replace("Article ","")) : subjectArticle(q.canonicalAnswer);
    if (a) return locale === "hi" ? `${ARTICLE(a,locale)} का विषय ${native(a <= 4 ? UNION_SUBJECTS[a]! : CIT_SUBJECTS[a]!,locale)} है।` : `${ARTICLE(a,locale)} ਦਾ ਵਿਸ਼ਾ ${native(a <= 4 ? UNION_SUBJECTS[a]! : CIT_SUBJECTS[a]!,locale)} ਹੈ।`;
  }
  if (ql === 12) return locale === "hi" ? "अनुच्छेद 5 में भारत में अधिवास आवश्यक था और इसके साथ जन्म, माता-पिता के जन्म या कम से कम पाँच वर्ष के सामान्य निवास में से कोई एक शर्त पूरी होनी थी।" : "ਅਨੁਛੇਦ 5 ਵਿੱਚ ਭਾਰਤ ਵਿੱਚ ਡੋਮਿਸਾਈਲ ਲਾਜ਼ਮੀ ਸੀ ਅਤੇ ਇਸ ਨਾਲ ਜਨਮ, ਮਾਤਾ-ਪਿਤਾ ਦੇ ਜਨਮ ਜਾਂ ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ ਦੇ ਆਮ ਨਿਵਾਸ ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਹੋਣੀ ਸੀ।";
  if (ql === 13) return locale === "hi" ? `इस स्थिति पर ${ans} लागू होता है।` : `ਇਸ ਸਥਿਤੀ ਤੇ ${ans} ਲਾਗੂ ਹੁੰਦਾ ਹੈ।`;
  if (ql === 15) return locale === "hi" ? "दो कथन सही हैं। प्रस्तावना, राज्य-पुनर्गठन और नागरिकता संबंधी अनुच्छेदों को अलग-अलग पढ़ना चाहिए।" : "ਦੋ ਬਿਆਨ ਸਹੀ ਹਨ। ਪ੍ਰਸਤਾਵਨਾ, ਰਾਜ-ਪੁਨਰਗਠਨ ਅਤੇ ਨਾਗਰਿਕਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਅਨੁਛੇਦਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।";
  if (ql === 16) return locale === "hi" ? `सही मिलान है: ${ans}।` : `ਸਹੀ ਮਿਲਾਨ ਹੈ: ${ans}।`;
  if (ql === 17) return locale === "hi" ? `अनुच्छेद 6 के अनुसार सही उत्तर है: ${ans}।` : `ਅਨੁਛੇਦ 6 ਅਨੁਸਾਰ ਸਹੀ ਉੱਤਰ ਹੈ: ${ans}।`;
  if (ql === 18) return locale === "hi" ? `सही उत्तर है: ${ans}। अनुच्छेद 7 पाकिस्तान गए कुछ प्रवासियों से और अनुच्छेद 8 विदेश में रहने वाले भारतीय मूल के कुछ व्यक्तियों से संबंधित है।` : `ਸਹੀ ਉੱਤਰ ਹੈ: ${ans}। ਅਨੁਛੇਦ 7 ਪਾਕਿਸਤਾਨ ਗਏ ਕੁਝ ਪਰਵਾਸੀਆਂ ਨਾਲ ਅਤੇ ਅਨੁਛੇਦ 8 ਵਿਦੇਸ਼ ਵਿੱਚ ਰਹਿੰਦੇ ਭਾਰਤੀ ਮੂਲ ਦੇ ਕੁਝ ਵਿਅਕਤੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`;
  return locale === "hi" ? `सही उत्तर है: ${ans}।` : `ਸਹੀ ਉੱਤਰ ਹੈ: ${ans}।`;
}

function localize(q: (typeof ENGLISH)[number], locale: PolLocaleV1): PolLocalizedQuestionV1 {
  if (locale === "en") return {
    ...q,
    options: [...q.options],
    locale,
    localizationV1: { version: POL_LOCALIZATION_V1, englishQuestionId:q.questionId, semanticInvariant:true, cpInvariant:true, qlInvariant:true, difficultyInvariant:true, sourceInvariant:true, optionOrderInvariant:true, correctIndexInvariant:true, reviewOnly:true },
  };
  let options = q.options.map((x) => option(x, locale));
  let localizedStem = stem(q, locale);
  let localizedExplanation = explanation(q, locale);
  if (locale === "pa") {
    options = options.map(applyPolityPunjabiNativePassV1);
    localizedStem = applyPolityPunjabiNativePassV1(localizedStem);
    localizedExplanation = applyPolityPunjabiNativePassV1(localizedExplanation);
  }
  return {
    ...q,
    questionId: `${q.questionId}-${locale.toUpperCase()}`,
    stem: localizedStem,
    options,
    canonicalAnswer: options[q.correctIndex]!,
    explanation: localizedExplanation,
    locale,
    localizationV1: { version: POL_LOCALIZATION_V1, englishQuestionId:q.questionId, semanticInvariant:true, cpInvariant:true, qlInvariant:true, difficultyInvariant:true, sourceInvariant:true, optionOrderInvariant:true, correctIndexInvariant:true, reviewOnly:true },
  };
}

export function generatePolCp003LocalizedReviewV1(locale: PolLocaleV1): PolLocalizedQuestionV1[] {
  return ENGLISH.map((q) => localize(q, locale));
}

export const POL_CP003_LOCALIZATION_V1_ENGLISH_COUNT = ENGLISH.length;
