import type { PhysicsLocaleV1 } from "./sci-physics-localization-types-v1";

type ExplanationSetV2 = Readonly<Record<PhysicsLocaleV1, string>>;

export const SCI_PHYSICS_EXPLANATION_QUALITY_V2 = {
  "SCI-CP001-EXH-A01": {
    en: "Length is one of the seven SI base quantities, and its SI base unit is the metre (m). Because it is a base quantity, the metre is not defined by combining other SI units.",
    hi: "लंबाई सात SI मूल राशियों में से एक है और इसकी SI मूल इकाई मीटर (m) है। मूल राशि होने के कारण मीटर को अन्य SI इकाइयों के संयोजन से व्यक्त नहीं किया जाता।",
    pa: "ਲੰਬਾਈ ਸੱਤ SI ਮੂਲ ਰਾਸ਼ੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ ਅਤੇ ਇਸ ਦੀ SI ਮੂਲ ਇਕਾਈ ਮੀਟਰ (m) ਹੈ। ਮੂਲ ਰਾਸ਼ੀ ਹੋਣ ਕਰਕੇ ਮੀਟਰ ਨੂੰ ਹੋਰ SI ਇਕਾਈਆਂ ਦੇ ਜੋੜ ਨਾਲ ਪਰਿਭਾਸ਼ਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ।",
  },
  "SCI-CP001-EXH-A02": {
    en: "Electric current is an SI base quantity, and its base unit is the ampere (A). The ampere measures the rate of flow of electric charge through a conductor.",
    hi: "विद्युत धारा एक SI मूल राशि है और इसकी मूल इकाई एम्पियर (A) है। एम्पियर किसी चालक से विद्युत आवेश के प्रवाह की दर को व्यक्त करता है।",
    pa: "ਵਿਦਿਉਤ ਧਾਰਾ ਇੱਕ SI ਮੂਲ ਰਾਸ਼ੀ ਹੈ ਅਤੇ ਇਸ ਦੀ ਮੂਲ ਇਕਾਈ ਐਂਪੀਅਰ (A) ਹੈ। ਐਂਪੀਅਰ ਕਿਸੇ ਚਾਲਕ ਵਿਚੋਂ ਵਿਦਿਉਤ ਆਵੇਸ਼ ਦੇ ਪ੍ਰਵਾਹ ਦੀ ਦਰ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।",
  },
  "SCI-CP001-EXH-A03": {
    en: "The kelvin (K) is the SI base unit of thermodynamic temperature. Degree Celsius is widely used in daily life, but kelvin is the SI base unit used in scientific temperature measurement.",
    hi: "केल्विन (K) ऊष्मागतिक तापमान की SI मूल इकाई है। दैनिक जीवन में डिग्री सेल्सियस का उपयोग सामान्य है, लेकिन वैज्ञानिक मापन में SI मूल इकाई केल्विन ही है।",
    pa: "ਕੇਲਵਿਨ (K) ਊਸ਼ਮਾਗਤਿਕ ਤਾਪਮਾਨ ਦੀ SI ਮੂਲ ਇਕਾਈ ਹੈ। ਰੋਜ਼ਾਨਾ ਜੀਵਨ ਵਿੱਚ ਡਿਗਰੀ ਸੈਲਸੀਅਸ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਪਰ ਵਿਗਿਆਨਕ ਮਾਪ ਲਈ SI ਮੂਲ ਇਕਾਈ ਕੇਲਵਿਨ ਹੈ।",
  },
  "SCI-CP001-EXH-A04": {
    en: "Force is obtained from F = ma, so its SI derived unit is the newton (N). One newton is the force that gives a 1 kg mass an acceleration of 1 m/s², so 1 N = 1 kg·m/s².",
    hi: "बल के लिए F = ma होता है, इसलिए इसकी SI व्युत्पन्न इकाई न्यूटन (N) है। 1 न्यूटन वह बल है जो 1 kg द्रव्यमान को 1 m/s² का त्वरण दे, इसलिए 1 N = 1 kg·m/s²।",
    pa: "ਬਲ ਲਈ F = ma ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੀ SI ਵਿਉਤਪੰਨ ਇਕਾਈ ਨਿਊਟਨ (N) ਹੈ। 1 ਨਿਊਟਨ ਉਹ ਬਲ ਹੈ ਜੋ 1 kg ਪੁੰਜ ਨੂੰ 1 m/s² ਦਾ ਪ੍ਰਵੇਗ ਦੇਵੇ, ਇਸ ਲਈ 1 N = 1 kg·m/s²।",
  },
  "SCI-CP001-EXH-A05": {
    en: "Pressure is force acting per unit area, P = F/A, so its SI unit is the pascal (Pa). Therefore 1 Pa = 1 N/m², meaning one newton of force spread over one square metre.",
    hi: "दाब प्रति इकाई क्षेत्रफल पर लगने वाला बल है, अर्थात P = F/A, इसलिए इसकी SI इकाई पास्कल (Pa) है। अतः 1 Pa = 1 N/m², यानी 1 वर्ग मीटर पर 1 न्यूटन बल।",
    pa: "ਦਬਾਅ ਪ੍ਰਤੀ ਇਕਾਈ ਖੇਤਰਫਲ ਉੱਤੇ ਲੱਗਣ ਵਾਲਾ ਬਲ ਹੈ, ਅਰਥਾਤ P = F/A, ਇਸ ਲਈ ਇਸ ਦੀ SI ਇਕਾਈ ਪਾਸਕਲ (Pa) ਹੈ। ਇਸ ਕਰਕੇ 1 Pa = 1 N/m², ਯਾਨੀ 1 ਵਰਗ ਮੀਟਰ ਉੱਤੇ 1 ਨਿਊਟਨ ਬਲ।",
  },
  "SCI-CP001-EXH-A06": {
    en: "Frequency tells how many complete cycles occur each second, and its SI unit is the hertz (Hz). Thus 1 Hz means one complete cycle per second; 50 Hz means 50 cycles each second.",
    hi: "आवृत्ति बताती है कि एक सेकंड में कितने पूरे चक्र होते हैं और इसकी SI इकाई हर्ट्ज़ (Hz) है। इसलिए 1 Hz का अर्थ 1 चक्र प्रति सेकंड तथा 50 Hz का अर्थ 50 चक्र प्रति सेकंड है।",
    pa: "ਆਵ੍ਰਿਤੀ ਦੱਸਦੀ ਹੈ ਕਿ ਇੱਕ ਸਕਿੰਟ ਵਿੱਚ ਕਿੰਨੇ ਪੂਰੇ ਚੱਕਰ ਹੁੰਦੇ ਹਨ ਅਤੇ ਇਸ ਦੀ SI ਇਕਾਈ ਹਰਟਜ਼ (Hz) ਹੈ। ਇਸ ਲਈ 1 Hz ਦਾ ਅਰਥ 1 ਚੱਕਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਅਤੇ 50 Hz ਦਾ ਅਰਥ 50 ਚੱਕਰ ਪ੍ਰਤੀ ਸਕਿੰਟ ਹੈ।",
  },
  "SCI-CP001-EXH-A07": {
    en: "An ammeter measures electric current in a circuit and is connected in series so the same current passes through it. It is designed with very low resistance so that it changes the circuit current as little as possible.",
    hi: "एमीटर परिपथ में विद्युत धारा मापता है और इसे श्रेणीक्रम में जोड़ा जाता है ताकि वही धारा इसमें से गुजरे। इसका प्रतिरोध बहुत कम रखा जाता है, जिससे परिपथ की धारा पर इसका प्रभाव न्यूनतम रहे।",
    pa: "ਐਮੀਟਰ ਪਰਿਪਥ ਵਿੱਚ ਵਿਦਿਉਤ ਧਾਰਾ ਮਾਪਦਾ ਹੈ ਅਤੇ ਇਸ ਨੂੰ ਲੜੀਵਾਰ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਤਾਂ ਜੋ ਉਹੀ ਧਾਰਾ ਇਸ ਵਿਚੋਂ ਲੰਘੇ। ਇਸ ਦਾ ਰੋਧ ਬਹੁਤ ਘੱਟ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਜੋ ਪਰਿਪਥ ਦੀ ਧਾਰਾ ਉੱਤੇ ਇਸ ਦਾ ਅਸਰ ਘੱਟ ਰਹੇ।",
  },
  "SCI-CP001-EXH-A08": {
    en: "A barometer is used to measure atmospheric pressure. Changes in barometric pressure are useful in weather observations and also reflect changes with altitude.",
    hi: "बैरोमीटर वायुमंडलीय दाब मापने का यंत्र है। वायुदाब में होने वाले परिवर्तन मौसम के अध्ययन में उपयोगी होते हैं और ऊँचाई बदलने पर भी दाब बदलता है।",
    pa: "ਬੈਰੋਮੀਟਰ ਵਾਤਾਵਰਣੀ ਦਬਾਅ ਮਾਪਣ ਵਾਲਾ ਯੰਤਰ ਹੈ। ਹਵਾਈ ਦਬਾਅ ਵਿੱਚ ਤਬਦੀਲੀਆਂ ਮੌਸਮ ਦੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਹਨ ਅਤੇ ਉਚਾਈ ਬਦਲਣ ਨਾਲ ਵੀ ਦਬਾਅ ਬਦਲਦਾ ਹੈ।",
  },
  "SCI-CP001-EXH-A09": {
    en: "A screw gauge has a very small least count, so it can resolve dimensions much smaller than a metre scale can. That makes it suitable for measuring the diameter of a thin wire or the thickness of a thin sheet accurately.",
    hi: "स्क्रू गेज का अल्पतमांक बहुत छोटा होता है, इसलिए यह मीटर स्केल की तुलना में बहुत छोटी लंबाई को अधिक सूक्ष्मता से माप सकता है। इसी कारण पतले तार का व्यास या पतली चादर की मोटाई मापने के लिए इसका उपयोग किया जाता है।",
    pa: "ਸਕ੍ਰੂ ਗੇਜ ਦਾ ਅਲਪਤਮ ਅੰਕ ਬਹੁਤ ਛੋਟਾ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਮੀਟਰ ਸਕੇਲ ਨਾਲੋਂ ਬਹੁਤ ਛੋਟੀ ਲੰਬਾਈ ਨੂੰ ਵੱਧ ਸੁਖਮਤਾ ਨਾਲ ਮਾਪ ਸਕਦਾ ਹੈ। ਇਸੇ ਕਰਕੇ ਪਤਲੇ ਤਾਰ ਦਾ ਵਿਆਸ ਜਾਂ ਪਤਲੀ ਚਾਦਰ ਦੀ ਮੋਟਾਈ ਮਾਪਣ ਲਈ ਇਹ ਉਚਿਤ ਹੈ।",
  },
  "SCI-CP001-EXH-A10": {
    en: "Least count is the smallest change in a quantity that an instrument can read directly. A smaller least count allows finer measurement, although overall accuracy can still be affected by zero error and calibration.",
    hi: "अल्पतमांक वह सबसे छोटा परिवर्तन है जिसे कोई मापक यंत्र सीधे पढ़ सकता है। अल्पतमांक जितना छोटा होगा, मापन उतना सूक्ष्म हो सकता है, हालांकि शून्य त्रुटि और अंशांकन भी यथार्थता को प्रभावित करते हैं।",
    pa: "ਅਲਪਤਮ ਅੰਕ ਉਹ ਸਭ ਤੋਂ ਛੋਟਾ ਬਦਲਾਅ ਹੈ ਜਿਸ ਨੂੰ ਕੋਈ ਮਾਪਣ ਯੰਤਰ ਸਿੱਧਾ ਪੜ੍ਹ ਸਕਦਾ ਹੈ। ਅਲਪਤਮ ਅੰਕ ਜਿੰਨਾ ਛੋਟਾ ਹੋਵੇ, ਮਾਪ ਉਤਨਾ ਸੁਖਮ ਹੋ ਸਕਦਾ ਹੈ, ਹਾਲਾਂਕਿ ਸ਼ੂਨਯ ਗਲਤੀ ਅਤੇ ਕੈਲੀਬ੍ਰੇਸ਼ਨ ਵੀ ਯਥਾਰਥਤਾ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੇ ਹਨ।",
  },
  "SCI-CP001-EXH-A11": {
    en: "Precision means repeated readings are close to one another, whereas accuracy means closeness to the true value. Therefore closely grouped readings that are all away from the true value are precise but not accurate.",
    hi: "परिशुद्धता का अर्थ है कि बार-बार लिए गए माप आपस में बहुत पास हों, जबकि यथार्थता का अर्थ सही मान के पास होना है। इसलिए आपस में पास लेकिन सही मान से दूर माप परिशुद्ध होते हैं, पर यथार्थ नहीं।",
    pa: "ਪਰਿਸ਼ੁੱਧਤਾ ਦਾ ਅਰਥ ਹੈ ਕਿ ਵਾਰ-ਵਾਰ ਲਏ ਮਾਪ ਆਪਸ ਵਿੱਚ ਬਹੁਤ ਨੇੜੇ ਹੋਣ, ਜਦਕਿ ਯਥਾਰਥਤਾ ਦਾ ਅਰਥ ਸਹੀ ਮਾਨ ਦੇ ਨੇੜੇ ਹੋਣਾ ਹੈ। ਇਸ ਲਈ ਆਪਸ ਵਿੱਚ ਨੇੜੇ ਪਰ ਸਹੀ ਮਾਨ ਤੋਂ ਦੂਰ ਮਾਪ ਪਰਿਸ਼ੁੱਧ ਹੁੰਦੇ ਹਨ, ਪਰ ਯਥਾਰਥ ਨਹੀਂ।",
  },
  "SCI-CP001-EXH-A12": {
    en: "A faulty zero setting adds nearly the same bias to repeated measurements, so it produces a systematic error rather than a random one. Such an error can often be corrected by proper zero correction or calibration.",
    hi: "गलत शून्य-सेटिंग बार-बार लिए गए मापों में लगभग एक जैसा झुकाव जोड़ती है, इसलिए यह प्रणालीगत त्रुटि पैदा करती है। उचित शून्य-सुधार या अंशांकन से ऐसी त्रुटि को अक्सर सुधारा जा सकता है।",
    pa: "ਗਲਤ ਸ਼ੂਨਯ-ਸੈਟਿੰਗ ਵਾਰ-ਵਾਰ ਲਏ ਮਾਪਾਂ ਵਿੱਚ ਲਗਭਗ ਇੱਕੋ ਜਿਹਾ ਝੁਕਾਅ ਪੈਦਾ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਪ੍ਰਣਾਲੀਗਤ ਗਲਤੀ ਹੁੰਦੀ ਹੈ। ਢੰਗ ਨਾਲ ਸ਼ੂਨਯ-ਸੁਧਾਰ ਜਾਂ ਕੈਲੀਬ੍ਰੇਸ਼ਨ ਕਰਕੇ ਅਜਿਹੀ ਗਲਤੀ ਨੂੰ ਅਕਸਰ ਠੀਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
  },
  "SCI-CP001-EXH-A13": {
    en: "In 0.00450, the leading zeros only locate the decimal point and are not significant. The digits 4 and 5 and the final zero after the decimal are significant, giving a total of 3 significant figures.",
    hi: "0.00450 में आरंभिक शून्य केवल दशमलव का स्थान बताते हैं, इसलिए वे सार्थक अंक नहीं हैं। 4, 5 और दशमलव के बाद का अंतिम शून्य सार्थक हैं, इसलिए कुल 3 सार्थक अंक हैं।",
    pa: "0.00450 ਵਿੱਚ ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ ਸਿਰਫ਼ ਦਸ਼ਮਲਵ ਦਾ ਸਥਾਨ ਦੱਸਦੇ ਹਨ, ਇਸ ਲਈ ਉਹ ਸਾਰਥਕ ਅੰਕ ਨਹੀਂ ਹਨ। 4, 5 ਅਤੇ ਦਸ਼ਮਲਵ ਤੋਂ ਬਾਅਦ ਵਾਲਾ ਆਖਰੀ ਸਿਫ਼ਰ ਸਾਰਥਕ ਹਨ, ਇਸ ਲਈ ਕੁੱਲ 3 ਸਾਰਥਕ ਅੰਕ ਹਨ।",
  },
  "SCI-CP001-EXH-A14": {
    en: "The SI prefix kilo means 10³, or one thousand times the base unit. For example, 1 kilometre = 10³ metres = 1000 metres.",
    hi: "SI उपसर्ग किलो का अर्थ 10³, अर्थात मूल इकाई का एक हजार गुना है। उदाहरण के लिए 1 किलोमीटर = 10³ मीटर = 1000 मीटर।",
    pa: "SI ਅਗੇਤਰ ਕਿਲੋ ਦਾ ਅਰਥ 10³, ਯਾਨੀ ਮੂਲ ਇਕਾਈ ਦਾ ਇੱਕ ਹਜ਼ਾਰ ਗੁਣਾ ਹੈ। ਉਦਾਹਰਨ ਲਈ 1 ਕਿਲੋਮੀਟਰ = 10³ ਮੀਟਰ = 1000 ਮੀਟਰ।",
  },
  "SCI-CP001-EXH-A15": {
    en: "The SI prefix micro means 10⁻⁶, or one millionth of the base unit. Thus 1 micrometre is 10⁻⁶ metre, a useful scale for very small dimensions.",
    hi: "SI उपसर्ग माइक्रो का अर्थ 10⁻⁶, अर्थात मूल इकाई का दस लाखवाँ भाग है। इसलिए 1 माइक्रोमीटर = 10⁻⁶ मीटर होता है और बहुत छोटी लंबाइयों के लिए उपयोगी है।",
    pa: "SI ਅਗੇਤਰ ਮਾਈਕ੍ਰੋ ਦਾ ਅਰਥ 10⁻⁶, ਯਾਨੀ ਮੂਲ ਇਕਾਈ ਦਾ ਦਸ ਲੱਖਵਾਂ ਹਿੱਸਾ ਹੈ। ਇਸ ਲਈ 1 ਮਾਈਕ੍ਰੋਮੀਟਰ = 10⁻⁶ ਮੀਟਰ ਹੁੰਦਾ ਹੈ ਅਤੇ ਬਹੁਤ ਛੋਟੀਆਂ ਲੰਬਾਈਆਂ ਲਈ ਲਾਭਦਾਇਕ ਹੈ।",
  },
  "SCI-CP001-EXH-A16": {
    en: "To convert km/h to m/s, multiply by 5/18 because 1 km = 1000 m and 1 h = 3600 s. Therefore 72 × 5/18 = 20 m/s.",
    hi: "km/h को m/s में बदलने के लिए 5/18 से गुणा करते हैं, क्योंकि 1 km = 1000 m और 1 h = 3600 s। इसलिए 72 × 5/18 = 20 m/s।",
    pa: "km/h ਨੂੰ m/s ਵਿੱਚ ਬਦਲਣ ਲਈ 5/18 ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ, ਕਿਉਂਕਿ 1 km = 1000 m ਅਤੇ 1 h = 3600 s। ਇਸ ਲਈ 72 × 5/18 = 20 m/s।",
  },
  "SCI-CP001-EXH-A17": {
    en: "Velocity is displacement divided by time, so its dimensions are length divided by time. Hence [v] = [L]/[T] = [L T⁻¹].",
    hi: "वेग विस्थापन को समय से भाग देने पर मिलता है, इसलिए इसके आयाम लंबाई/समय होते हैं। अतः [v] = [L]/[T] = [L T⁻¹]।",
    pa: "ਵੇਗ ਵਿਸਥਾਪਨ ਨੂੰ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇਣ ਨਾਲ ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੇ ਆਯਾਮ ਲੰਬਾਈ/ਸਮਾਂ ਹਨ। ਇਸ ਕਰਕੇ [v] = [L]/[T] = [L T⁻¹]।",
  },
  "SCI-CP001-EXH-A18": {
    en: "From Newton's second law, F = ma. Mass has dimension [M] and acceleration has [L T⁻²], so force has [M L T⁻²].",
    hi: "न्यूटन के द्वितीय नियम से F = ma होता है। द्रव्यमान का आयाम [M] और त्वरण का [L T⁻²] है, इसलिए बल का आयाम [M L T⁻²] होता है।",
    pa: "ਨਿਊਟਨ ਦੇ ਦੂਜੇ ਨਿਯਮ ਤੋਂ F = ma ਹੁੰਦਾ ਹੈ। ਪੁੰਜ ਦਾ ਆਯਾਮ [M] ਅਤੇ ਪ੍ਰਵੇਗ ਦਾ [L T⁻²] ਹੈ, ਇਸ ਲਈ ਬਲ ਦਾ ਆਯਾਮ [M L T⁻²] ਹੁੰਦਾ ਹੈ।",
  },
  "SCI-CP001-EXH-A19": {
    en: "Velocity is a vector because it requires both magnitude and direction for complete description. Speed gives only the magnitude of motion, so it is a scalar quantity.",
    hi: "वेग एक सदिश राशि है क्योंकि इसे पूरी तरह बताने के लिए परिमाण के साथ दिशा भी आवश्यक है। चाल केवल गति का परिमाण बताती है, इसलिए वह अदिश राशि है।",
    pa: "ਵੇਗ ਇੱਕ ਸਦਿਸ਼ ਰਾਸ਼ੀ ਹੈ ਕਿਉਂਕਿ ਇਸ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਦੱਸਣ ਲਈ ਪਰਿਮਾਣ ਦੇ ਨਾਲ ਦਿਸ਼ਾ ਵੀ ਲਾਜ਼ਮੀ ਹੈ। ਚਾਲ ਸਿਰਫ਼ ਗਤੀ ਦਾ ਪਰਿਮਾਣ ਦੱਸਦੀ ਹੈ, ਇਸ ਲਈ ਉਹ ਅਦਿਸ਼ ਰਾਸ਼ੀ ਹੈ।",
  },
  "SCI-CP001-EXH-A20": {
    en: "Work is a scalar quantity even though force and displacement are vectors. It is calculated from their scalar product, W = Fs cosθ, so work has magnitude but no independent direction.",
    hi: "कार्य अदिश राशि है, भले ही बल और विस्थापन सदिश हों। इसे उनके अदिश गुणनफल W = Fs cosθ से निकाला जाता है, इसलिए कार्य का परिमाण होता है लेकिन स्वतंत्र दिशा नहीं।",
    pa: "ਕੰਮ ਅਦਿਸ਼ ਰਾਸ਼ੀ ਹੈ, ਭਾਵੇਂ ਬਲ ਅਤੇ ਵਿਸਥਾਪਨ ਸਦਿਸ਼ ਹੋਣ। ਇਸ ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਅਦਿਸ਼ ਗੁਣਨਫਲ W = Fs cosθ ਨਾਲ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਕੰਮ ਦਾ ਪਰਿਮਾਣ ਹੁੰਦਾ ਹੈ ਪਰ ਵੱਖਰੀ ਦਿਸ਼ਾ ਨਹੀਂ।",
  },
  "SCI-CP001-EXH-A21": {
    en: "Density is mass per unit volume, ρ = m/V. Using SI units kg for mass and m³ for volume gives the SI unit kg/m³.",
    hi: "घनत्व प्रति इकाई आयतन द्रव्यमान है, अर्थात ρ = m/V। द्रव्यमान के लिए kg और आयतन के लिए m³ लेने पर SI इकाई kg/m³ मिलती है।",
    pa: "ਘਣਤਾ ਪ੍ਰਤੀ ਇਕਾਈ ਆਇਤਨ ਪੁੰਜ ਹੈ, ਅਰਥਾਤ ρ = m/V। ਪੁੰਜ ਲਈ kg ਅਤੇ ਆਇਤਨ ਲਈ m³ ਲੈਣ ਨਾਲ SI ਇਕਾਈ kg/m³ ਮਿਲਦੀ ਹੈ।",
  },
  "SCI-CP001-EXH-A22": {
    en: "Relative density is the ratio of the density of a substance to the density of a reference substance. Since both densities have the same unit, the units cancel and relative density has no dimension or unit.",
    hi: "सापेक्ष घनत्व किसी पदार्थ के घनत्व और संदर्भ पदार्थ के घनत्व का अनुपात है। दोनों घनत्वों की इकाई समान होने से इकाइयाँ कट जाती हैं, इसलिए सापेक्ष घनत्व विमाहीन और इकाई-विहीन होता है।",
    pa: "ਸਾਪੇਖ ਘਣਤਾ ਕਿਸੇ ਪਦਾਰਥ ਦੀ ਘਣਤਾ ਅਤੇ ਸੰਦਰਭ ਪਦਾਰਥ ਦੀ ਘਣਤਾ ਦਾ ਅਨੁਪਾਤ ਹੈ। ਦੋਵੇਂ ਘਣਤਾਵਾਂ ਦੀ ਇਕਾਈ ਇੱਕੋ ਹੋਣ ਕਰਕੇ ਇਕਾਈਆਂ ਰੱਦ ਹੋ ਜਾਂਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸਾਪੇਖ ਘਣਤਾ ਬਿਨਾ ਆਯਾਮ ਅਤੇ ਬਿਨਾ ਇਕਾਈ ਦੇ ਹੁੰਦੀ ਹੈ।",
  },
  "SCI-CP001-EXH-A23": {
    en: "Scientific notation writes a number as a × 10ⁿ with 1 ≤ a < 10. Moving the decimal in 0.00032 four places to the right gives 3.2, so the compensating power is 10⁻⁴: 3.2 × 10⁻⁴.",
    hi: "वैज्ञानिक संकेतन में संख्या को a × 10ⁿ के रूप में लिखा जाता है, जहाँ 1 ≤ a < 10 होता है। 0.00032 में दशमलव चार स्थान दाईं ओर ले जाने पर 3.2 मिलता है, इसलिए घात 10⁻⁴ होगी: 3.2 × 10⁻⁴।",
    pa: "ਵਿਗਿਆਨਕ ਸੰਕੇਤਨ ਵਿੱਚ ਸੰਖਿਆ ਨੂੰ a × 10ⁿ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ, ਜਿੱਥੇ 1 ≤ a < 10 ਹੁੰਦਾ ਹੈ। 0.00032 ਵਿੱਚ ਦਸ਼ਮਲਵ ਚਾਰ ਥਾਵਾਂ ਸੱਜੇ ਲਿਜਾਣ ਨਾਲ 3.2 ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਘਾਤ 10⁻⁴ ਹੋਵੇਗੀ: 3.2 × 10⁻⁴।",
  },
  "SCI-CP001-EXH-A24": {
    en: "Vernier calipers have internal jaws specifically designed to measure internal dimensions such as the inside diameter of a tube. Their main scale and vernier scale together give a finer reading than an ordinary ruler.",
    hi: "वर्नियर कैलिपर्स में भीतरी जबड़े होते हैं जो नली जैसे पिंड का आंतरिक व्यास मापने के लिए बनाए जाते हैं। मुख्य स्केल और वर्नियर स्केल मिलकर साधारण पैमाने की तुलना में अधिक सूक्ष्म माप देते हैं।",
    pa: "ਵਰਨੀਅਰ ਕੈਲੀਪਰ ਵਿੱਚ ਅੰਦਰੂਨੀ ਜਬੜੇ ਹੁੰਦੇ ਹਨ ਜੋ ਨਲੀ ਵਰਗੇ ਪਦਾਰਥ ਦਾ ਅੰਦਰਲਾ ਵਿਆਸ ਮਾਪਣ ਲਈ ਬਣੇ ਹੁੰਦੇ ਹਨ। ਮੁੱਖ ਸਕੇਲ ਅਤੇ ਵਰਨੀਅਰ ਸਕੇਲ ਮਿਲ ਕੇ ਸਧਾਰਣ ਪੈਮਾਨੇ ਨਾਲੋਂ ਵੱਧ ਸੁਖਮ ਮਾਪ ਦਿੰਦੇ ਹਨ।",
  },

  "SCI-CP002-EXH-A01": {
    en: "Distance is the total length of the actual path travelled by an object, so it depends on the route taken. It is a scalar quantity and is always at least as large as the magnitude of displacement for the same journey.",
    hi: "दूरी किसी वस्तु द्वारा तय किए गए वास्तविक पथ की कुल लंबाई है, इसलिए यह चुने गए मार्ग पर निर्भर करती है। यह अदिश राशि है और किसी यात्रा में विस्थापन के परिमाण से कम नहीं हो सकती।",
    pa: "ਦੂਰੀ ਕਿਸੇ ਵਸਤੂ ਦੁਆਰਾ ਤੈਅ ਕੀਤੇ ਅਸਲ ਰਸਤੇ ਦੀ ਕੁੱਲ ਲੰਬਾਈ ਹੈ, ਇਸ ਲਈ ਇਹ ਚੁਣੇ ਰਸਤੇ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ। ਇਹ ਅਦਿਸ਼ ਰਾਸ਼ੀ ਹੈ ਅਤੇ ਕਿਸੇ ਯਾਤਰਾ ਵਿੱਚ ਵਿਸਥਾਪਨ ਦੇ ਪਰਿਮਾਣ ਤੋਂ ਘੱਟ ਨਹੀਂ ਹੋ ਸਕਦੀ।",
  },
  "SCI-CP002-EXH-A02": {
    en: "Displacement is the directed change from the initial position to the final position and depends only on those two positions. It can be zero after a round trip even when the distance travelled is not zero.",
    hi: "विस्थापन प्रारंभिक स्थिति से अंतिम स्थिति तक का दिशायुक्त परिवर्तन है और केवल इन दो स्थितियों पर निर्भर करता है। पूरा चक्कर लगाकर प्रारंभिक स्थान पर लौटने पर विस्थापन शून्य हो सकता है, जबकि दूरी शून्य नहीं होती।",
    pa: "ਵਿਸਥਾਪਨ ਸ਼ੁਰੂਆਤੀ ਸਥਿਤੀ ਤੋਂ ਅੰਤਿਮ ਸਥਿਤੀ ਤੱਕ ਦਾ ਦਿਸ਼ਾਵਾਂ ਬਦਲਾਅ ਹੈ ਅਤੇ ਸਿਰਫ਼ ਇਨ੍ਹਾਂ ਦੋ ਸਥਿਤੀਆਂ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ। ਪੂਰਾ ਚੱਕਰ ਲਗਾ ਕੇ ਮੁੜ ਸ਼ੁਰੂਆਤੀ ਥਾਂ ਆਉਣ ਉੱਤੇ ਵਿਸਥਾਪਨ ਸਿਫ਼ਰ ਹੋ ਸਕਦਾ ਹੈ, ਜਦਕਿ ਦੂਰੀ ਸਿਫ਼ਰ ਨਹੀਂ ਹੁੰਦੀ।",
  },
  "SCI-CP002-EXH-A03": {
    en: "Speed is the distance travelled per unit time, speed = distance/time. Because distance has no direction, speed is a scalar quantity and tells only how fast an object moves.",
    hi: "चाल प्रति इकाई समय तय की गई दूरी है, अर्थात चाल = दूरी/समय। दूरी की दिशा नहीं होती, इसलिए चाल अदिश राशि है और केवल यह बताती है कि वस्तु कितनी तेज चल रही है।",
    pa: "ਚਾਲ ਪ੍ਰਤੀ ਇਕਾਈ ਸਮੇਂ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਹੈ, ਅਰਥਾਤ ਚਾਲ = ਦੂਰੀ/ਸਮਾਂ। ਦੂਰੀ ਦੀ ਦਿਸ਼ਾ ਨਹੀਂ ਹੁੰਦੀ, ਇਸ ਲਈ ਚਾਲ ਅਦਿਸ਼ ਰਾਸ਼ੀ ਹੈ ਅਤੇ ਸਿਰਫ਼ ਇਹ ਦੱਸਦੀ ਹੈ ਕਿ ਵਸਤੂ ਕਿੰਨੀ ਤੇਜ਼ ਚੱਲ ਰਹੀ ਹੈ।",
  },
  "SCI-CP002-EXH-A04": {
    en: "Velocity is displacement per unit time, so direction is part of its definition. Two objects can have the same speed but different velocities if they move in different directions.",
    hi: "वेग प्रति इकाई समय विस्थापन है, इसलिए दिशा इसकी परिभाषा का हिस्सा है। दो वस्तुओं की चाल समान हो सकती है, लेकिन दिशाएँ अलग होने पर उनके वेग अलग होंगे।",
    pa: "ਵੇਗ ਪ੍ਰਤੀ ਇਕਾਈ ਸਮੇਂ ਵਿਸਥਾਪਨ ਹੈ, ਇਸ ਲਈ ਦਿਸ਼ਾ ਇਸ ਦੀ ਪਰਿਭਾਸ਼ਾ ਦਾ ਹਿੱਸਾ ਹੈ। ਦੋ ਵਸਤੂਆਂ ਦੀ ਚਾਲ ਇੱਕੋ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਦਿਸ਼ਾਵਾਂ ਵੱਖਰੀਆਂ ਹੋਣ ਉੱਤੇ ਉਨ੍ਹਾਂ ਦੇ ਵੇਗ ਵੱਖਰੇ ਹੋਣਗੇ।",
  },
  "SCI-CP002-EXH-A05": {
    en: "Acceleration is the rate at which velocity changes with time, a = Δv/Δt. Since velocity includes both magnitude and direction, acceleration can occur when speed changes, direction changes, or both change.",
    hi: "त्वरण समय के साथ वेग में परिवर्तन की दर है, अर्थात a = Δv/Δt। वेग में परिमाण और दिशा दोनों शामिल हैं, इसलिए चाल बदलने, दिशा बदलने या दोनों बदलने पर त्वरण हो सकता है।",
    pa: "ਪ੍ਰਵੇਗ ਸਮੇਂ ਨਾਲ ਵੇਗ ਵਿੱਚ ਬਦਲਾਅ ਦੀ ਦਰ ਹੈ, ਅਰਥਾਤ a = Δv/Δt। ਵੇਗ ਵਿੱਚ ਪਰਿਮਾਣ ਅਤੇ ਦਿਸ਼ਾ ਦੋਵੇਂ ਸ਼ਾਮਲ ਹਨ, ਇਸ ਲਈ ਚਾਲ ਬਦਲਣ, ਦਿਸ਼ਾ ਬਦਲਣ ਜਾਂ ਦੋਵੇਂ ਬਦਲਣ ਉੱਤੇ ਪ੍ਰਵੇਗ ਹੋ ਸਕਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A06": {
    en: "The slope of a distance-time graph is Δdistance/Δtime, which is the definition of speed. A steeper slope therefore represents a greater speed, while a horizontal line represents zero speed.",
    hi: "दूरी-समय ग्राफ की ढाल Δदूरी/Δसमय होती है, जो चाल की परिभाषा है। इसलिए अधिक खड़ी ढाल अधिक चाल दिखाती है, जबकि क्षैतिज रेखा शून्य चाल बताती है।",
    pa: "ਦੂਰੀ-ਸਮਾਂ ਗ੍ਰਾਫ ਦੀ ਢਾਲ Δਦੂਰੀ/Δਸਮਾਂ ਹੁੰਦੀ ਹੈ, ਜੋ ਚਾਲ ਦੀ ਪਰਿਭਾਸ਼ਾ ਹੈ। ਇਸ ਲਈ ਵੱਧ ਖੜੀ ਢਾਲ ਵੱਧ ਚਾਲ ਦੱਸਦੀ ਹੈ, ਜਦਕਿ ਸਮਤਲ ਰੇਖਾ ਸਿਫ਼ਰ ਚਾਲ ਦੱਸਦੀ ਹੈ।",
  },
  "SCI-CP002-EXH-A07": {
    en: "The slope of a velocity-time graph is Δvelocity/Δtime, which is acceleration. A positive slope means positive acceleration, while zero slope means constant velocity and zero acceleration.",
    hi: "वेग-समय ग्राफ की ढाल Δवेग/Δसमय होती है, जो त्वरण है। धनात्मक ढाल धनात्मक त्वरण दिखाती है, जबकि शून्य ढाल स्थिर वेग और शून्य त्वरण बताती है।",
    pa: "ਵੇਗ-ਸਮਾਂ ਗ੍ਰਾਫ ਦੀ ਢਾਲ Δਵੇਗ/Δਸਮਾਂ ਹੁੰਦੀ ਹੈ, ਜੋ ਪ੍ਰਵੇਗ ਹੈ। ਧਨਾਤਮਕ ਢਾਲ ਧਨਾਤਮਕ ਪ੍ਰਵੇਗ ਦੱਸਦੀ ਹੈ, ਜਦਕਿ ਸਿਫ਼ਰ ਢਾਲ ਸਥਿਰ ਵੇਗ ਅਤੇ ਸਿਫ਼ਰ ਪ੍ਰਵੇਗ ਦੱਸਦੀ ਹੈ।",
  },
  "SCI-CP002-EXH-A08": {
    en: "The area under a velocity-time graph represents velocity multiplied by time, which gives displacement. Areas below the time axis are negative, so the signed area gives the net displacement.",
    hi: "वेग-समय ग्राफ के नीचे का क्षेत्रफल वेग × समय को दर्शाता है, जिससे विस्थापन मिलता है। समय-अक्ष के नीचे का क्षेत्रफल ऋणात्मक माना जाता है, इसलिए बीजीय क्षेत्रफल शुद्ध विस्थापन देता है।",
    pa: "ਵੇਗ-ਸਮਾਂ ਗ੍ਰਾਫ ਹੇਠਾਂ ਦਾ ਖੇਤਰਫਲ ਵੇਗ × ਸਮਾਂ ਦਰਸਾਉਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਵਿਸਥਾਪਨ ਮਿਲਦਾ ਹੈ। ਸਮਾਂ-ਅੱਖ ਤੋਂ ਹੇਠਾਂ ਵਾਲਾ ਖੇਤਰਫਲ ਰਿਣਾਤਮਕ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਬੀਜਗਣਿਤੀ ਖੇਤਰਫਲ ਸ਼ੁੱਧ ਵਿਸਥਾਪਨ ਦਿੰਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A09": {
    en: "Newton's first law expresses inertia: without a net external force, a body remains at rest or continues moving with uniform velocity in a straight line. Inertia is the tendency of a body to resist a change in its state of motion.",
    hi: "न्यूटन का प्रथम नियम जड़त्व को व्यक्त करता है: शुद्ध बाहरी बल न होने पर वस्तु विराम में रहती है या सरल रेखा में समान वेग से चलती रहती है। जड़त्व वस्तु की अपनी गति-अवस्था में परिवर्तन का विरोध करने की प्रवृत्ति है।",
    pa: "ਨਿਊਟਨ ਦਾ ਪਹਿਲਾ ਨਿਯਮ ਜੜਤਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ: ਸ਼ੁੱਧ ਬਾਹਰੀ ਬਲ ਨਾ ਹੋਣ ਉੱਤੇ ਵਸਤੂ ਵਿਸ਼ਰਾਮ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ ਜਾਂ ਸਿੱਧੀ ਰੇਖਾ ਵਿੱਚ ਸਮਾਨ ਵੇਗ ਨਾਲ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ। ਜੜਤਾ ਵਸਤੂ ਦੀ ਆਪਣੀ ਗਤੀ-ਅਵਸਥਾ ਵਿੱਚ ਬਦਲਾਅ ਦਾ ਵਿਰੋਧ ਕਰਨ ਦੀ ਪ੍ਰਵਿਰਤੀ ਹੈ।",
  },
  "SCI-CP002-EXH-A10": {
    en: "For constant mass, Newton's second law is F = ma, where F is the net external force. Thus acceleration increases with net force and, for the same force, decreases as mass increases.",
    hi: "स्थिर द्रव्यमान के लिए न्यूटन का द्वितीय नियम F = ma है, जहाँ F शुद्ध बाहरी बल है। इसलिए शुद्ध बल बढ़ने पर त्वरण बढ़ता है और समान बल के लिए द्रव्यमान बढ़ने पर त्वरण घटता है।",
    pa: "ਸਥਿਰ ਪੁੰਜ ਲਈ ਨਿਊਟਨ ਦਾ ਦੂਜਾ ਨਿਯਮ F = ma ਹੈ, ਜਿੱਥੇ F ਸ਼ੁੱਧ ਬਾਹਰੀ ਬਲ ਹੈ। ਇਸ ਲਈ ਸ਼ੁੱਧ ਬਲ ਵਧਣ ਨਾਲ ਪ੍ਰਵੇਗ ਵਧਦਾ ਹੈ ਅਤੇ ਇੱਕੋ ਬਲ ਲਈ ਪੁੰਜ ਵਧਣ ਨਾਲ ਪ੍ਰਵੇਗ ਘਟਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A11": {
    en: "Newton's third law states that interacting bodies exert equal-magnitude forces in opposite directions on each other. The two forces act on different bodies, so they do not cancel each other on a single body's free-body diagram.",
    hi: "न्यूटन के तृतीय नियम के अनुसार परस्पर क्रिया करने वाली दो वस्तुएँ एक-दूसरे पर समान परिमाण के विपरीत दिशा वाले बल लगाती हैं। ये दोनों बल अलग-अलग वस्तुओं पर लगते हैं, इसलिए किसी एक वस्तु पर वे आपस में निरस्त नहीं होते।",
    pa: "ਨਿਊਟਨ ਦੇ ਤੀਜੇ ਨਿਯਮ ਅਨੁਸਾਰ ਪਰਸਪਰ ਕਿਰਿਆ ਕਰਨ ਵਾਲੀਆਂ ਦੋ ਵਸਤੂਆਂ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਬਰਾਬਰ ਪਰਿਮਾਣ ਦੇ ਉਲਟੀ ਦਿਸ਼ਾ ਵਾਲੇ ਬਲ ਲਗਾਉਂਦੀਆਂ ਹਨ। ਇਹ ਦੋਵੇਂ ਬਲ ਵੱਖ-ਵੱਖ ਵਸਤੂਆਂ ਉੱਤੇ ਲੱਗਦੇ ਹਨ, ਇਸ ਲਈ ਇੱਕੋ ਵਸਤੂ ਉੱਤੇ ਇਹ ਆਪਸ ਵਿੱਚ ਰੱਦ ਨਹੀਂ ਹੁੰਦੇ।",
  },
  "SCI-CP002-EXH-A12": {
    en: "When a moving bus stops suddenly, the lower part of a passenger's body is slowed by the bus but the upper part tends to keep moving forward. This tendency to continue the existing state of motion is inertia of motion.",
    hi: "चलती बस अचानक रुकती है तो यात्री के शरीर का निचला भाग बस के साथ धीमा हो जाता है, लेकिन ऊपरी भाग आगे चलता रहना चाहता है। गति की वर्तमान अवस्था बनाए रखने की यही प्रवृत्ति गति का जड़त्व कहलाती है।",
    pa: "ਚੱਲਦੀ ਬੱਸ ਅਚਾਨਕ ਰੁਕਦੀ ਹੈ ਤਾਂ ਯਾਤਰੀ ਦੇ ਸਰੀਰ ਦਾ ਹੇਠਲਾ ਹਿੱਸਾ ਬੱਸ ਨਾਲ ਹੌਲਾ ਹੋ ਜਾਂਦਾ ਹੈ, ਪਰ ਉੱਪਰਲਾ ਹਿੱਸਾ ਅੱਗੇ ਚੱਲਦਾ ਰਹਿਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰਦਾ ਹੈ। ਗਤੀ ਦੀ ਮੌਜੂਦਾ ਅਵਸਥਾ ਬਣਾਈ ਰੱਖਣ ਦੀ ਇਹ ਪ੍ਰਵਿਰਤੀ ਗਤੀ ਦੀ ਜੜਤਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A13": {
    en: "Linear momentum is defined as p = mv, the product of mass and velocity. Because velocity is a vector, momentum also has direction, and its SI unit is kg·m/s.",
    hi: "रेखीय संवेग p = mv से परिभाषित होता है, अर्थात द्रव्यमान और वेग का गुणनफल। वेग सदिश है, इसलिए संवेग की भी दिशा होती है और इसकी SI इकाई kg·m/s है।",
    pa: "ਰੇਖੀ ਸੰਵੇਗ p = mv ਨਾਲ ਪਰਿਭਾਸ਼ਿਤ ਹੁੰਦਾ ਹੈ, ਅਰਥਾਤ ਪੁੰਜ ਅਤੇ ਵੇਗ ਦਾ ਗੁਣਨਫਲ। ਵੇਗ ਸਦਿਸ਼ ਹੈ, ਇਸ ਲਈ ਸੰਵੇਗ ਦੀ ਵੀ ਦਿਸ਼ਾ ਹੁੰਦੀ ਹੈ ਅਤੇ ਇਸ ਦੀ SI ਇਕਾਈ kg·m/s ਹੈ।",
  },
  "SCI-CP002-EXH-A14": {
    en: "Impulse equals force multiplied by the time for which it acts, J = FΔt, and it is equal to the change in momentum Δp. The same momentum change can therefore be produced by a smaller force acting for a longer time.",
    hi: "आवेग बल और उसके लगने के समय का गुणनफल है, J = FΔt, और यह संवेग में परिवर्तन Δp के बराबर होता है। इसलिए समान संवेग परिवर्तन को अधिक समय तक लगने वाले छोटे बल से भी प्राप्त किया जा सकता है।",
    pa: "ਆਵੇਗ ਬਲ ਅਤੇ ਉਸ ਦੇ ਲੱਗਣ ਦੇ ਸਮੇਂ ਦਾ ਗੁਣਨਫਲ ਹੈ, J = FΔt, ਅਤੇ ਇਹ ਸੰਵੇਗ ਵਿੱਚ ਬਦਲਾਅ Δp ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ। ਇਸ ਲਈ ਇੱਕੋ ਸੰਵੇਗ ਬਦਲਾਅ ਨੂੰ ਵੱਧ ਸਮੇਂ ਲਈ ਲੱਗਣ ਵਾਲੇ ਛੋਟੇ ਬਲ ਨਾਲ ਵੀ ਪ੍ਰਾਪਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A15": {
    en: "If no net external force acts on a system, its total linear momentum remains constant. The total momentum need not be zero; it only has to keep the same value before and after the interaction.",
    hi: "यदि किसी तंत्र पर शुद्ध बाहरी बल नहीं लगता, तो उसका कुल रेखीय संवेग स्थिर रहता है। कुल संवेग का शून्य होना आवश्यक नहीं है; केवल उसका मान परस्पर क्रिया से पहले और बाद में समान रहना चाहिए।",
    pa: "ਜੇ ਕਿਸੇ ਤੰਤਰ ਉੱਤੇ ਸ਼ੁੱਧ ਬਾਹਰੀ ਬਲ ਨਹੀਂ ਲੱਗਦਾ, ਤਾਂ ਉਸ ਦਾ ਕੁੱਲ ਰੇਖੀ ਸੰਵੇਗ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ। ਕੁੱਲ ਸੰਵੇਗ ਦਾ ਸਿਫ਼ਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਸਿਰਫ਼ ਪਰਸਪਰ ਕਿਰਿਆ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਉਸ ਦਾ ਮਾਨ ਇੱਕੋ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A16": {
    en: "Rolling friction is generally smaller than sliding friction because rolling greatly reduces continuous rubbing and surface interlocking at the contact. This is why wheels and ball bearings are used to reduce resistance to motion.",
    hi: "लुढ़कन घर्षण सामान्यतः सरकन घर्षण से कम होता है क्योंकि लुढ़कने पर सतहों के बीच लगातार रगड़ और फँसाव बहुत घट जाता है। इसी कारण गति का प्रतिरोध कम करने के लिए पहियों और बॉल-बेयरिंग का उपयोग किया जाता है।",
    pa: "ਲੁੜਕਣ ਘਰਸ਼ਣ ਆਮ ਤੌਰ ਉੱਤੇ ਸਰਕਣ ਘਰਸ਼ਣ ਨਾਲੋਂ ਘੱਟ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਲੁੜਕਣ ਨਾਲ ਸਤਹਾਂ ਵਿਚਕਾਰ ਲਗਾਤਾਰ ਰਗੜ ਅਤੇ ਫਸਾਵ ਬਹੁਤ ਘਟ ਜਾਂਦਾ ਹੈ। ਇਸੇ ਕਰਕੇ ਗਤੀ ਦਾ ਵਿਰੋਧ ਘਟਾਉਣ ਲਈ ਪਹੀਏ ਅਤੇ ਬਾਲ-ਬੇਅਰਿੰਗ ਵਰਤੇ ਜਾਂਦੇ ਹਨ।",
  },
  "SCI-CP002-EXH-A17": {
    en: "A lubricant forms a thin film between moving surfaces, reducing direct contact between their microscopic irregularities. This lowers interlocking and adhesion between the surfaces and therefore reduces friction.",
    hi: "स्नेहक चलती सतहों के बीच पतली परत बनाता है, जिससे उनकी सूक्ष्म अनियमितताओं का सीधा संपर्क कम हो जाता है। इससे सतहों का फँसाव और आसंजन घटता है तथा घर्षण कम हो जाता है।",
    pa: "ਚਿਕਨਾਹਟ ਵਾਲਾ ਪਦਾਰਥ ਚੱਲਦੀਆਂ ਸਤਹਾਂ ਵਿਚਕਾਰ ਪਤਲੀ ਪਰਤ ਬਣਾਉਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੁਖਮ ਅਸਮਾਨਤਾਵਾਂ ਦਾ ਸਿੱਧਾ ਸੰਪਰਕ ਘਟ ਜਾਂਦਾ ਹੈ। ਇਸ ਨਾਲ ਸਤਹਾਂ ਦਾ ਫਸਾਵ ਅਤੇ ਚਿਪਕਾਅ ਘਟਦਾ ਹੈ ਅਤੇ ਘਰਸ਼ਣ ਘੱਟ ਹੁੰਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A18": {
    en: "From Fnet = ma, zero net force gives zero acceleration. That does not mean the object must be at rest; it may also continue moving with constant velocity.",
    hi: "Fnet = ma के अनुसार शुद्ध बल शून्य होने पर त्वरण शून्य होता है। इसका अर्थ यह नहीं कि वस्तु अवश्य विराम में होगी; वह स्थिर वेग से चलती भी रह सकती है।",
    pa: "Fnet = ma ਅਨੁਸਾਰ ਸ਼ੁੱਧ ਬਲ ਸਿਫ਼ਰ ਹੋਣ ਉੱਤੇ ਪ੍ਰਵੇਗ ਸਿਫ਼ਰ ਹੁੰਦਾ ਹੈ। ਇਸ ਦਾ ਅਰਥ ਇਹ ਨਹੀਂ ਕਿ ਵਸਤੂ ਲਾਜ਼ਮੀ ਤੌਰ ਉੱਤੇ ਵਿਸ਼ਰਾਮ ਵਿੱਚ ਹੋਵੇਗੀ; ਉਹ ਸਥਿਰ ਵੇਗ ਨਾਲ ਚੱਲਦੀ ਵੀ ਰਹਿ ਸਕਦੀ ਹੈ।",
  },
  "SCI-CP002-EXH-A19": {
    en: "In uniform circular motion, speed can remain constant but the direction of velocity changes continuously. A change in velocity means there is acceleration, directed toward the centre of the circle.",
    hi: "समान वृत्तीय गति में चाल स्थिर रह सकती है, लेकिन वेग की दिशा लगातार बदलती रहती है। वेग में परिवर्तन होने के कारण त्वरण होता है और उसकी दिशा वृत्त के केंद्र की ओर होती है।",
    pa: "ਸਮਾਨ ਵਰਤੁਲ ਗਤੀ ਵਿੱਚ ਚਾਲ ਸਥਿਰ ਰਹਿ ਸਕਦੀ ਹੈ, ਪਰ ਵੇਗ ਦੀ ਦਿਸ਼ਾ ਲਗਾਤਾਰ ਬਦਲਦੀ ਰਹਿੰਦੀ ਹੈ। ਵੇਗ ਵਿੱਚ ਬਦਲਾਅ ਹੋਣ ਕਰਕੇ ਪ੍ਰਵੇਗ ਹੁੰਦਾ ਹੈ ਅਤੇ ਉਸ ਦੀ ਦਿਸ਼ਾ ਵਰਤੁਲ ਦੇ ਕੇਂਦਰ ਵੱਲ ਹੁੰਦੀ ਹੈ।",
  },
  "SCI-CP002-EXH-A20": {
    en: "Centripetal force is the net inward force required for circular motion, so it points toward the centre of the circular path. It provides the inward acceleration that continuously changes the direction of velocity.",
    hi: "अभिकेंद्रीय बल वृत्तीय गति के लिए आवश्यक शुद्ध अंदर की ओर बल है, इसलिए इसकी दिशा वृत्त के केंद्र की ओर होती है। यही बल अंदर की ओर त्वरण देता है और वेग की दिशा को लगातार बदलता है।",
    pa: "ਅਭਿਕੇਂਦਰੀ ਬਲ ਵਰਤੁਲ ਗਤੀ ਲਈ ਲੋੜੀਂਦਾ ਸ਼ੁੱਧ ਅੰਦਰ ਵੱਲ ਬਲ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੀ ਦਿਸ਼ਾ ਵਰਤੁਲ ਦੇ ਕੇਂਦਰ ਵੱਲ ਹੁੰਦੀ ਹੈ। ਇਹੀ ਬਲ ਅੰਦਰ ਵੱਲ ਪ੍ਰਵੇਗ ਦਿੰਦਾ ਹੈ ਅਤੇ ਵੇਗ ਦੀ ਦਿਸ਼ਾ ਨੂੰ ਲਗਾਤਾਰ ਬਦਲਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A21": {
    en: "Before firing, the gun-bullet system can have zero total momentum. When the bullet gains forward momentum, the gun gains equal backward momentum so that total momentum remains conserved; this backward motion is recoil.",
    hi: "गोली चलने से पहले बंदूक-गोली तंत्र का कुल संवेग शून्य हो सकता है। गोली आगे संवेग प्राप्त करती है तो बंदूक बराबर विपरीत संवेग प्राप्त करती है, जिससे कुल संवेग संरक्षित रहता है; यही पीछे की गति प्रतिक्षेप है।",
    pa: "ਗੋਲੀ ਚਲਣ ਤੋਂ ਪਹਿਲਾਂ ਬੰਦੂਕ-ਗੋਲੀ ਤੰਤਰ ਦਾ ਕੁੱਲ ਸੰਵੇਗ ਸਿਫ਼ਰ ਹੋ ਸਕਦਾ ਹੈ। ਗੋਲੀ ਅੱਗੇ ਸੰਵੇਗ ਪ੍ਰਾਪਤ ਕਰਦੀ ਹੈ ਤਾਂ ਬੰਦੂਕ ਬਰਾਬਰ ਉਲਟ ਸੰਵੇਗ ਪ੍ਰਾਪਤ ਕਰਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਕੁੱਲ ਸੰਵੇਗ ਸੰਰੱਖਿਤ ਰਹਿੰਦਾ ਹੈ; ਇਹ ਪਿੱਛੇ ਵਾਲੀ ਗਤੀ ਪ੍ਰਤਿਕਸ਼ੇਪ ਹੈ।",
  },
  "SCI-CP002-EXH-A22": {
    en: "A seat belt increases the time over which a passenger's momentum falls to zero during a stop. Since impulse Δp = FavgΔt, the same momentum change over a longer time produces a smaller average force and reduces injury risk.",
    hi: "सीट बेल्ट रुकते समय यात्री के संवेग को शून्य होने के लिए अधिक समय देती है। क्योंकि आवेग Δp = FavgΔt है, समान संवेग परिवर्तन अधिक समय में होने पर औसत बल कम होता है और चोट का खतरा घटता है।",
    pa: "ਸੀਟ ਬੈਲਟ ਰੁਕਣ ਵੇਲੇ ਯਾਤਰੀ ਦੇ ਸੰਵੇਗ ਨੂੰ ਸਿਫ਼ਰ ਹੋਣ ਲਈ ਵੱਧ ਸਮਾਂ ਦਿੰਦੀ ਹੈ। ਕਿਉਂਕਿ ਆਵੇਗ Δp = FavgΔt ਹੈ, ਇੱਕੋ ਸੰਵੇਗ ਬਦਲਾਅ ਵੱਧ ਸਮੇਂ ਵਿੱਚ ਹੋਣ ਨਾਲ ਔਸਤ ਬਲ ਘਟਦਾ ਹੈ ਅਤੇ ਚੋਟ ਦਾ ਖਤਰਾ ਘਟਦਾ ਹੈ।",
  },
  "SCI-CP002-EXH-A23": {
    en: "At terminal speed, the upward resistive forces such as drag balance the downward weight, so the net force becomes zero. With zero net force the acceleration is zero, and the object then continues falling at constant speed.",
    hi: "सीमांत चाल पर ऊपर की ओर लगने वाला प्रतिरोधी बल नीचे की ओर भार को संतुलित कर देता है, इसलिए शुद्ध बल शून्य हो जाता है। शुद्ध बल शून्य होने पर त्वरण भी शून्य होता है और वस्तु स्थिर चाल से गिरती रहती है।",
    pa: "ਸੀਮਾਂਤ ਚਾਲ ਉੱਤੇ ਉੱਪਰ ਵੱਲ ਲੱਗਣ ਵਾਲਾ ਰੋਧੀ ਬਲ ਹੇਠਾਂ ਵੱਲ ਲੱਗਦੇ ਭਾਰ-ਬਲ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਸ਼ੁੱਧ ਬਲ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ। ਸ਼ੁੱਧ ਬਲ ਸਿਫ਼ਰ ਹੋਣ ਉੱਤੇ ਪ੍ਰਵੇਗ ਵੀ ਸਿਫ਼ਰ ਹੁੰਦਾ ਹੈ ਅਤੇ ਵਸਤੂ ਸਥਿਰ ਚਾਲ ਨਾਲ ਡਿੱਗਦੀ ਰਹਿੰਦੀ ਹੈ।",
  },
  "SCI-CP002-EXH-A24": {
    en: "Use Newton's second law, F = ma. For m = 2 kg and a = 3 m/s², F = 2 × 3 = 6 N, so the net force is 6 newtons.",
    hi: "न्यूटन के द्वितीय नियम F = ma का उपयोग करें। m = 2 kg और a = 3 m/s² रखने पर F = 2 × 3 = 6 N, इसलिए शुद्ध बल 6 न्यूटन है।",
    pa: "ਨਿਊਟਨ ਦੇ ਦੂਜੇ ਨਿਯਮ F = ma ਦੀ ਵਰਤੋਂ ਕਰੋ। m = 2 kg ਅਤੇ a = 3 m/s² ਰੱਖਣ ਉੱਤੇ F = 2 × 3 = 6 N, ਇਸ ਲਈ ਸ਼ੁੱਧ ਬਲ 6 ਨਿਊਟਨ ਹੈ।",
  },
} as const satisfies Readonly<Record<string, ExplanationSetV2>>;

export function getPhysicsExplanationV2(anchorId: string, locale: PhysicsLocaleV1): string {
  const set = SCI_PHYSICS_EXPLANATION_QUALITY_V2[anchorId as keyof typeof SCI_PHYSICS_EXPLANATION_QUALITY_V2];
  if (!set) throw new Error(`Missing Physics explanation-quality V2 entry: ${anchorId}`);
  return set[locale];
}
