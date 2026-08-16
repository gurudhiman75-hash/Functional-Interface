import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Pair = readonly [string, string, string];

/**
 * Source-level localization for high-frequency MEN-001 teaching sentences.
 * Mathematical expressions are preserved byte-for-byte; only surrounding
 * learner prose is rewritten before the token fallback runs.
 */
const PAIRS: readonly Pair[] = [
  ["Because the field’s height is measured at right angles to its base, the usual triangle-area formula applies directly.", "क्योंकि क्षेत्र की ऊँचाई उसके आधार पर समकोण बनाती है, इसलिए त्रिभुज के क्षेत्रफल का सामान्य सूत्र सीधे लागू होता है।", "ਕਿਉਂਕਿ ਖੇਤ ਦੀ ਉਚਾਈ ਉਸ ਦੇ ਆਧਾਰ ਨਾਲ ਸਮਕੋਣ ਬਣਾਉਂਦੀ ਹੈ, ਇਸ ਲਈ ਤਿਕੋਣ ਦੇ ਖੇਤਰਫਲ ਦਾ ਆਮ ਫਾਰਮੂਲਾ ਸਿੱਧਾ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।"],
  ["Mark the base and the perpendicular height that belongs to it.", "आधार और उससे संबंधित लंबवत ऊँचाई को पहचानें।", "ਆਧਾਰ ਅਤੇ ਉਸ ਨਾਲ ਸੰਬੰਧਤ ਲੰਬ ਉਚਾਈ ਨੂੰ ਪਛਾਣੋ।"],
  ["The height must meet the base at 90°.", "ऊँचाई आधार पर 90° का कोण बनानी चाहिए।", "ਉਚਾਈ ਆਧਾਰ ਨਾਲ 90° ਦਾ ਕੋਣ ਬਣਾਉਣੀ ਚਾਹੀਦੀ ਹੈ।"],
  ["Put the base and perpendicular height into", "आधार और लंबवत ऊँचाई के मान रखें", "ਆਧਾਰ ਅਤੇ ਲੰਬ ਉਚਾਈ ਦੇ ਮੁੱਲ ਰੱਖੋ"],
  ["Cancel the", "पहले", "ਪਹਿਲਾਂ"],
  ["first when one measurement is even, then multiply.", "को काटें यदि किसी एक माप का मान सम हो, फिर गुणा करें।", "ਨੂੰ ਕੱਟੋ ਜੇ ਕਿਸੇ ਇੱਕ ਮਾਪ ਦਾ ਮੁੱਲ ਜੁੜਾ ਹੋਵੇ, ਫਿਰ ਗੁਣਾ ਕਰੋ।"],
  ["The triangular field covers", "त्रिभुजाकार क्षेत्र का क्षेत्रफल", "ਤਿਕੋਣੇ ਖੇਤ ਦਾ ਖੇਤਰਫਲ"],
  ["Halve an even base or height before multiplying. This removes the 1/2 immediately and keeps the arithmetic small.", "यदि आधार या ऊँचाई में से कोई सम हो, तो गुणा करने से पहले उसे आधा कर दें। इससे 1/2 तुरंत कट जाता है और गणना छोटी रहती है।", "ਜੇ ਆਧਾਰ ਜਾਂ ਉਚਾਈ ਵਿੱਚੋਂ ਕੋਈ ਜੁੜਾ ਹੋਵੇ, ਤਾਂ ਗੁਣਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਉਸ ਨੂੰ ਅੱਧਾ ਕਰ ਦਿਓ। ਇਸ ਨਾਲ 1/2 ਤੁਰੰਤ ਕੱਟ ਜਾਂਦਾ ਹੈ ਅਤੇ ਗਣਨਾ ਛੋਟੀ ਰਹਿੰਦੀ ਹੈ।"],
  ["forgetting the 1/2 in the triangle-area formula and calculating bh instead of 1/2 bh", "त्रिभुज के क्षेत्रफल के सूत्र में 1/2 भूलकर 1/2 bh के बजाय bh निकालना", "ਤਿਕੋਣ ਦੇ ਖੇਤਰਫਲ ਦੇ ਫਾਰਮੂਲੇ ਵਿੱਚ 1/2 ਭੁੱਲ ਕੇ 1/2 bh ਦੀ ਬਜਾਏ bh ਕੱਢਣਾ"],
  ["Write A = 1/2 bh first, or halve an even base or height before multiplying.", "पहले A = 1/2 bh लिखें, या यदि आधार/ऊँचाई में से कोई सम हो तो गुणा करने से पहले उसे आधा कर दें।", "ਪਹਿਲਾਂ A = 1/2 bh ਲਿਖੋ, ਜਾਂ ਜੇ ਆਧਾਰ/ਉਚਾਈ ਵਿੱਚੋਂ ਕੋਈ ਜੁੜਾ ਹੋਵੇ ਤਾਂ ਗੁਣਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਉਸ ਨੂੰ ਅੱਧਾ ਕਰ ਦਿਓ।"],
  ["using the base as both dimensions", "दोनों आयामों के लिए आधार का ही प्रयोग करना", "ਦੋਵੇਂ ਮਾਪਾਂ ਲਈ ਆਧਾਰ ਹੀ ਵਰਤਣਾ"],
  ["using the height as both dimensions", "दोनों आयामों के लिए ऊँचाई का ही प्रयोग करना", "ਦੋਵੇਂ ਮਾਪਾਂ ਲਈ ਉਚਾਈ ਹੀ ਵਰਤਣਾ"],
  ["The wrong measurement or intermediate value has been used.", "गलत माप या मध्यवर्ती मान का प्रयोग किया गया है।", "ਗਲਤ ਮਾਪ ਜਾਂ ਵਿਚਕਾਰਲੇ ਮੁੱਲ ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਗਈ ਹੈ।"],
  ["Use A = 1/2 bh with a base and its perpendicular height.", "A = 1/2 bh में आधार और उससे संबंधित लंबवत ऊँचाई का ही प्रयोग करें।", "A = 1/2 bh ਵਿੱਚ ਆਧਾਰ ਅਤੇ ਉਸ ਨਾਲ ਸੰਬੰਧਤ ਲੰਬ ਉਚਾਈ ਹੀ ਵਰਤੋ।"],
  ["An extra operation has been applied.", "एक अतिरिक्त गणितीय क्रिया लगा दी गई है।", "ਇੱਕ ਵਾਧੂ ਗਣਿਤੀ ਕਿਰਿਆ ਲਗਾ ਦਿੱਤੀ ਗਈ ਹੈ।"],
  ["The calculation has removed or changed a factor incorrectly.", "गणना में किसी गुणक को गलत तरीके से हटाया या बदला गया है।", "ਗਣਨਾ ਵਿੱਚ ਕਿਸੇ ਗੁਣਕ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਹਟਾਇਆ ਜਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ।"],
  ["stopping at the semiperimeter and treating it as an area", "अर्धपरिमाप पर ही रुककर उसे क्षेत्रफल मान लेना", "ਅਰਧ-ਪਰਿਮਾਪ 'ਤੇ ਹੀ ਰੁਕ ਕੇ ਉਸ ਨੂੰ ਖੇਤਰਫਲ ਮੰਨ ਲੈਣਾ"],
  ["squaring the semiperimeter instead of completing Heron's formula", "हीरोन का सूत्र पूरा करने के बजाय अर्धपरिमाप का वर्ग कर देना", "ਹੀਰੋਨ ਦਾ ਫਾਰਮੂਲਾ ਪੂਰਾ ਕਰਨ ਦੀ ਬਜਾਏ ਅਰਧ-ਪਰਿਮਾਪ ਦਾ ਵਰਗ ਕਰ ਦੇਣਾ"],
  ["putting the radius into the formula as though it were the diameter", "सूत्र में त्रिज्या को व्यास मानकर रख देना", "ਫਾਰਮੂਲੇ ਵਿੱਚ ਅਰਧ-ਵਿਆਸ ਨੂੰ ਵਿਆਸ ਮੰਨ ਕੇ ਰੱਖ ਦੇਣਾ"],
  ["putting the diameter into the formula as though it were the radius", "सूत्र में व्यास को त्रिज्या मानकर रख देना", "ਫਾਰਮੂਲੇ ਵਿੱਚ ਵਿਆਸ ਨੂੰ ਅਰਧ-ਵਿਆਸ ਮੰਨ ਕੇ ਰੱਖ ਦੇਣਾ"],
  ["using the area of a full circle when the figure contains only a semicircle, quadrant or sector", "जब आकृति में केवल अर्धवृत्त, चतुर्थांश या सेक्टर हो तब पूरे वृत्त का क्षेत्रफल लगा देना", "ਜਦੋਂ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਸਿਰਫ਼ ਅਰਧ-ਵ੍ਰਿਤ, ਚੌਥਾਈ ਜਾਂ ਸੈਕਟਰ ਹੋਵੇ ਤਾਂ ਪੂਰੇ ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ ਲਗਾ ਦੇਣਾ"],
  ["using the distance around a circle as though it were the area inside it", "वृत्त की परिधि को उसके अंदर का क्षेत्रफल मान लेना", "ਵ੍ਰਿਤ ਦੀ ਪਰਿਧੀ ਨੂੰ ਉਸ ਦੇ ਅੰਦਰਲਾ ਖੇਤਰਫਲ ਮੰਨ ਲੈਣਾ"],
  ["adding the inner area even though a path or border is the outer area minus the inner area", "पथ/किनारी के लिए बाहरी क्षेत्रफल में से भीतरी क्षेत्रफल घटाने के बजाय दोनों को जोड़ देना", "ਰਸਤੇ/ਕਿਨਾਰੀ ਲਈ ਬਾਹਰੀ ਖੇਤਰਫਲ ਵਿਚੋਂ ਅੰਦਰਲਾ ਖੇਤਰਫਲ ਘਟਾਉਣ ਦੀ ਬਜਾਏ ਦੋਵੇਂ ਜੋੜ ਦੇਣਾ"],
  ["using the whole outer area and forgetting to remove the inner region", "पूरा बाहरी क्षेत्रफल लेकर भीतरी भाग घटाना भूल जाना", "ਪੂਰਾ ਬਾਹਰੀ ਖੇਤਰਫਲ ਲੈ ਕੇ ਅੰਦਰਲਾ ਭਾਗ ਘਟਾਉਣਾ ਭੁੱਲ ਜਾਣਾ"],
  ["Area conversion uses 100² = 10,000, not 100.", "क्षेत्रफल की इकाई बदलते समय 100 नहीं, 100² = 10,000 का गुणक लगता है।", "ਖੇਤਰਫਲ ਦੀ ਇਕਾਈ ਬਦਲਦੇ ਸਮੇਂ 100 ਨਹੀਂ, 100² = 10,000 ਦਾ ਗੁਣਕ ਲੱਗਦਾ ਹੈ।"],
  ["Remember d = 2r. Check whether the formula needs r or d before substituting.", "याद रखें d = 2r। मान रखने से पहले जाँचें कि सूत्र में r चाहिए या d।", "ਯਾਦ ਰੱਖੋ d = 2r। ਮੁੱਲ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚੋ ਕਿ ਫਾਰਮੂਲੇ ਵਿੱਚ r ਚਾਹੀਦਾ ਹੈ ਜਾਂ d।"],
  ["Divide the diameter by 2 before using any formula containing r.", "r वाले किसी भी सूत्र का प्रयोग करने से पहले व्यास को 2 से भाग देकर त्रिज्या निकालें।", "r ਵਾਲਾ ਕੋਈ ਵੀ ਫਾਰਮੂਲਾ ਵਰਤਣ ਤੋਂ ਪਹਿਲਾਂ ਵਿਆਸ ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਅਰਧ-ਵਿਆਸ ਕੱਢੋ।"],
  ["Circumference has a linear unit; area must have a square unit. Use πr² for the enclosed region.", "परिधि की इकाई रैखिक होती है, जबकि क्षेत्रफल की इकाई वर्ग होती है। घिरे हुए भाग के लिए πr² का प्रयोग करें।", "ਪਰਿਧੀ ਦੀ ਇਕਾਈ ਰੇਖੀ ਹੁੰਦੀ ਹੈ, ਜਦਕਿ ਖੇਤਰਫਲ ਦੀ ਇਕਾਈ ਵਰਗ ਹੁੰਦੀ ਹੈ। ਘਿਰੇ ਭਾਗ ਲਈ πr² ਵਰਤੋ।"],
  ["A border is the ring between two boundaries, so subtract inner area from outer area.", "किनारी दो सीमाओं के बीच का भाग है, इसलिए बाहरी क्षेत्रफल में से भीतरी क्षेत्रफल घटाएँ।", "ਕਿਨਾਰੀ ਦੋ ਸੀਮਾਵਾਂ ਵਿਚਕਾਰਲਾ ਭਾਗ ਹੈ, ਇਸ ਲਈ ਬਾਹਰੀ ਖੇਤਰਫਲ ਵਿਚੋਂ ਅੰਦਰਲਾ ਖੇਤਰਫਲ ਘਟਾਓ।"],
  ["Remove the inner region: border or path area = outer area − inner area.", "भीतरी भाग हटाएँ: किनारी/पथ का क्षेत्रफल = बाहरी क्षेत्रफल − भीतरी क्षेत्रफल।", "ਅੰਦਰਲਾ ਭਾਗ ਹਟਾਓ: ਕਿਨਾਰੀ/ਰਸਤੇ ਦਾ ਖੇਤਰਫਲ = ਬਾਹਰੀ ਖੇਤਰਫਲ − ਅੰਦਰਲਾ ਖੇਤਰਫਲ।"],
];

function target(pair: Pair, language: MensurationLocalizedLanguage) {
  return language === "hi" ? pair[1] : pair[2];
}

export function prelocalizeMensurationMen001TeachingSourceV1(
  text: string,
  language: MensurationLocalizedLanguage,
) {
  let out = text;
  for (const pair of [...PAIRS].sort((a, b) => b[0].length - a[0].length)) {
    out = out.split(pair[0]).join(target(pair, language));
  }
  return out;
}
