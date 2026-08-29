import type { SriDiscoveryQuestion, SriHumanExplanation } from "./discovery-types";
import { generateSriPermanentEnglishQuestionV1 } from "./permanent-runtime-v1";
import type { SriPermanentQlId } from "./permanent-allocation-v1";
import {
  localizeSriLearnerTextV1 as localizeSriLearnerTextBaseV1,
  type SriLocalizedLocaleV1,
  type SriLocalizedLanguageV1,
  type SriLocalizedDiscoveryQuestionV1,
  type SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-base-v1";

export type {
  SriLocalizedLocaleV1,
  SriLocalizedLanguageV1,
  SriLocalizedDiscoveryQuestionV1,
  SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-base-v1";

const LANGUAGE_BY_LOCALE: Record<SriLocalizedLocaleV1, SriLocalizedLanguageV1> = {
  "hi-IN": "Hindi",
  "pa-IN": "Punjabi",
};

const EXACT_OVERRIDES: Record<SriLocalizedLocaleV1, Readonly<Record<string, string>>> = {
  "hi-IN": {
    "Simplify the power expression using the applicable law.": "उपयुक्त घातांक नियम का उपयोग करके व्यंजक को सरल कीजिए।",
    "Combine same-base factors by adding numerator exponents and subtracting the denominator exponent.": "समान आधार वाले गुणनखंडों में अंश के घातांक जोड़कर और हर का घातांक घटाकर सरल कीजिए।",
    "Any non-zero number raised to the power 0 equals 1.": "किसी भी शून्येतर संख्या की शून्य घात 1 होती है।",
    "Match A=m+n and B=mn, then use √(A+2√B)=√m+√n.": "A=m+n और B=mn का मिलान कीजिए, फिर √(A+2√B)=√m+√n का उपयोग कीजिए।",
    "Match A=m+n and B=mn, with m≥n, then use √(A−2√B)=√m−√n.": "A=m+n और B=mn का मिलान कीजिए, जहाँ m≥n, फिर √(A−2√B)=√m−√n का उपयोग कीजिए।",
    "A negative integer exponent means take the reciprocal of the corresponding positive power.": "ऋणात्मक पूर्णांक घातांक का अर्थ है संबंधित धनात्मक घात का व्युत्क्रम लेना।",
    "For the same base, add the signed exponents.": "समान आधार होने पर चिह्न सहित घातांकों को जोड़िए।",
    "Take the exact root indicated by the denominator first, then raise it to the numerator power.": "पहले हर से दर्शाया गया सटीक मूल निकालिए, फिर परिणाम को अंश वाली घात तक उठाइए।",
    "The negative sign takes a reciprocal; the fractional part is evaluated by roots and powers.": "ऋण चिह्न व्युत्क्रम लेने को दर्शाता है; भिन्नात्मक भाग का मान मूल और घात का उपयोग करके निकालिए।",
    "Take the exact root indicated by the denominator from both numerator and denominator of the base, then apply the numerator power.": "पहले आधार के अंश और हर दोनों में हर से दर्शाया गया सटीक मूल निकालिए, फिर अंश वाली घात लगाइए।",
    "First evaluate the corresponding positive fractional power using the exact root, then take its reciprocal because the exponent is negative.": "पहले सटीक मूल से संबंधित धनात्मक भिन्नात्मक घात का मान निकालिए; घातांक ऋणात्मक होने के कारण फिर उसका व्युत्क्रम लीजिए।",
    "An odd root of a negative number is real; take the cube root first and then apply the numerator power.": "ऋणात्मक संख्या का विषम मूल वास्तविक होता है; पहले घनमूल लीजिए और फिर अंश वाली घात लगाइए।",
    "An even-denominator rational exponent requires an even root, which is not real for a negative base.": "सम हर वाला परिमेय घातांक सम मूल मांगता है, जो ऋणात्मक आधार के लिए वास्तविक नहीं होता।",
    "Express each composite base as a power of the common base, then add exponents.": "प्रत्येक मिश्रित आधार को समान आधार की घात के रूप में लिखकर घातांक जोड़िए।",
    "Reverse the reciprocal under the negative exponent, then express everything with the common base.": "ऋणात्मक घातांक के कारण बने व्युत्क्रम को पलटिए, फिर सब कुछ समान आधार में लिखिए।",
    "Convert both bases to the same common base and subtract the denominator exponent contribution.": "दोनों आधारों को एक ही समान आधार में बदलिए और हर वाले घातांक का योगदान घटाइए।",
    "Rewrite each given base as a power of the common base, then compare the exact values.": "प्रत्येक दिए आधार को समान आधार की घात के रूप में लिखकर सटीक मानों की तुलना कीजिए।",
    "Rewrite both visible bases as powers of one common base, then equate exponents.": "दोनों दिखाई दे रहे आधारों को एक समान आधार की घातों में लिखिए, फिर घातांक बराबर कीजिए।",
    "Rewrite the reciprocal base as the original base with a negative exponent, then equate exponents.": "व्युत्क्रम आधार को मूल आधार की ऋणात्मक घात के रूप में लिखिए, फिर घातांक बराबर कीजिए।",
    "Factor the common term a^x before solving for the power.": "घात का मान हल करने से पहले समान पद a^x को गुणनखंड के रूप में बाहर निकालिए।",
    "Rewrite all three bases as powers of one common base and equate each exponent contribution to the supplied common exponent.": "तीनों आधारों को एक समान आधार की घातों में लिखिए और प्रत्येक घातांक-योगदान को दिए समान घातांक के बराबर कीजिए।",
    "First equate exponents to recover x; then substitute x into the requested derived power.": "पहले घातांक बराबर करके x ज्ञात कीजिए; फिर x को पूछी गई व्युत्पन्न घात में रखिए।",
    "With a common negative exponent, reciprocals reverse the base order.": "समान ऋणात्मक घातांक होने पर व्युत्क्रम आधारों के क्रम को उलट देते हैं।",
    "Reduce each expression to a power of the same base and classify the relation.": "प्रत्येक व्यंजक को एक ही आधार की घात में बदलिए और उनके संबंध को वर्गीकृत कीजिए।",
    "Rewrite both quantities to powers of the same base and compare the exact exponents.": "दोनों राशियों को एक ही आधार की घातों में लिखकर सटीक घातांकों की तुलना कीजिए।",
    "Convert each expression to the common base and order the resulting exponents.": "प्रत्येक व्यंजक को समान आधार में बदलिए और प्राप्त घातांकों के अनुसार क्रम लगाइए।",
    "Check the operation involved against the exact index law rather than transferring a rule from multiplication to addition or division.": "जिस संक्रिया का प्रयोग हुआ है उसे सटीक घातांक नियम से जाँचिए; गुणा का नियम जोड़ या भाग पर लागू न कीजिए।",
    "Apply the exact law to each statement separately before combining the two truth values.": "दोनों कथनों पर सटीक नियम अलग-अलग लागू कीजिए, फिर उनके सत्य-मूल्यों को मिलाइए।",
    "An nth root contributes denominator n to the exponent; the power inside the radical supplies the numerator.": "nवें मूल से घातांक का हर n मिलता है; मूल के भीतर की घात अंश देती है।",
    "Simplify the composite radical first; once both terms have the same radicand, combine coefficients.": "पहले मिश्रित मूल को सरल कीजिए; जब दोनों पदों की करणीगत संख्या समान हो जाए, तो केवल गुणांक जोड़-घटाकर मिलाइए।",
    "Multiply numerator and denominator by the same square root; the denominator becomes the radicand.": "अंश और हर दोनों को उसी वर्गमूल से गुणा कीजिए; हर करणीगत संख्या में बदल जाएगा।",
    "Multiply by the conjugate of the binomial denominator; its product with the denominator is a difference of squares.": "द्विपदी हर के संयुग्मी से गुणा कीजिए; हर और उसके संयुग्मी का गुणनफल वर्गों का अंतर होता है।",
    "Rationalise each conjugate denominator, then collect rational and surd parts.": "प्रत्येक संयुग्मी हर का परिमेयकरण कीजिए, फिर परिमेय और करणी वाले भागों को मिलाइए।",
    "Rationalise first, recover A and B exactly, then evaluate the requested coefficient expression.": "पहले परिमेयकरण कीजिए, फिर A और B को सटीक रूप से ज्ञात करके पूछे गए गुणांक व्यंजक का मान निकालिए।",
    "In the denested pair, the two radicands add to A and multiply to B.": "सरल करणी युग्म में दोनों करणीगत संख्याओं का योग A और गुणनफल B होता है।",
    "Treat c√n as √(c²n), then bound that exact square root by consecutive squares.": "c√n को √(c²n) के रूप में लिखिए, फिर इस सटीक वर्गमूल को आस-पास के पूर्ण वर्गों से सीमाबद्ध कीजिए।",
    "Compare n with the surrounding perfect squares; use those exact inequalities to test each statement.": "n की तुलना उसके आस-पास के पूर्ण वर्गों से कीजिए; इन्हीं सटीक असमिकाओं से प्रत्येक कथन जाँचिए।",
    "Square both positive expressions. Their rational parts match, so compare the exact cross-term products.": "दोनों धनात्मक व्यंजकों का वर्ग कीजिए। उनके परिमेय भाग समान हैं, इसलिए सटीक क्रॉस-पद गुणनफलों की तुलना कीजिए।",
    "Write the nth root as exponent 1/n, separate the exponent multiple of n, then return the residual fractional power to radical form.": "nवें मूल को 1/n घात के रूप में लिखिए, n के गुणज वाले घातांक को अलग कीजिए, फिर शेष भिन्नात्मक घात को वापस मूल रूप में लिखिए।",
    "The denominator tells which root to take; the numerator tells which power to apply after taking that root.": "हर बताता है कौन-सा मूल लेना है; अंश बताता है मूल लेने के बाद कौन-सी घात लगानी है।",
    "A qth root is exactly exponent 1/q; the power inside the root supplies numerator p.": "qवें मूल का अर्थ ठीक 1/q घात है; मूल के अंदर की p घात अंश p देती है।",
    "Replace the square root by exponent 1/2, express the integer target as a power of the same base, then equate exponents.": "वर्गमूल को 1/2 घात से बदलिए, पूर्णांक लक्ष्य को उसी आधार की घात में लिखिए, फिर घातांक बराबर कीजिए।",
    "Four index-law statements are given, each with its domain stated where needed.": "घातांक नियमों के चार कथन दिए गए हैं; जहाँ आवश्यक है वहाँ प्रत्येक का परिभाषा-क्षेत्र भी दिया है।",
    "The base is a perfect fourth power, and the exponent 1/4 is already in lowest terms.": "आधार एक पूर्ण चौथी घात है और घातांक 1/4 पहले से लघुतम रूप में है।",
    "negative base has no real even-denominator rational power": "ऋणात्मक आधार की सम हर वाली कोई वास्तविक परिमेय घात नहीं होती",
    "Both expressions have the same exact rational exponent.": "दोनों व्यंजकों का सटीक परिमेय घातांक समान है।",
    "Power-of-power multiplies exponents.": "घात की घात में घातांकों का गुणा होता है।",
    "Use the supplied power relation to recover the requested exact quantity.": "दिए गए घात संबंध का उपयोग करके पूछी गई सटीक राशि ज्ञात कीजिए।",
    "Solve x and evaluate the requested derived power.": "x हल कीजिए और पूछी गई व्युत्पन्न घात का मान निकालिए।",
    "Arrange all three powers in increasing order.": "तीनों घातों को आरोही क्रम में लगाइए।",
    "Simplify and classify the exact result.": "सटीक परिणाम को सरल करके उसका वर्गीकरण कीजिए।",
    "Choose the exact range statement.": "सटीक परास वाला कथन चुनिए।",
    "Evaluate the transformed reciprocal-conjugate target.": "रूपांतरित व्युत्क्रम-संयुग्मी लक्ष्य का मान निकालिए।",
    "Use the reciprocal-conjugate relation to evaluate the target.": "व्युत्क्रम-संयुग्मी संबंध का उपयोग करके लक्ष्य का मान निकालिए।"
  },
  "pa-IN": {
    "Simplify the power expression using the applicable law.": "ਉਚਿਤ ਘਾਤਾਂਕ ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵਿਅੰਜਕ ਨੂੰ ਸਰਲ ਕਰੋ।",
    "Combine same-base factors by adding numerator exponents and subtracting the denominator exponent.": "ਇੱਕੋ ਅਧਾਰ ਵਾਲੇ ਗੁਣਨਖੰਡਾਂ ਵਿੱਚ ਅੰਸ਼ ਦੇ ਘਾਤਾਂਕ ਜੋੜ ਕੇ ਅਤੇ ਹਰ ਦਾ ਘਾਤਾਂਕ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ।",
    "Any non-zero number raised to the power 0 equals 1.": "ਕਿਸੇ ਵੀ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਸੰਖਿਆ ਦੀ ਸਿਫ਼ਰ ਘਾਤ 1 ਹੁੰਦੀ ਹੈ।",
    "Match A=m+n and B=mn, then use √(A+2√B)=√m+√n.": "A=m+n ਅਤੇ B=mn ਦਾ ਮਿਲਾਨ ਕਰੋ, ਫਿਰ √(A+2√B)=√m+√n ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    "Match A=m+n and B=mn, with m≥n, then use √(A−2√B)=√m−√n.": "A=m+n ਅਤੇ B=mn ਦਾ ਮਿਲਾਨ ਕਰੋ, ਜਿੱਥੇ m≥n, ਫਿਰ √(A−2√B)=√m−√n ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    "A negative integer exponent means take the reciprocal of the corresponding positive power.": "ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਘਾਤਾਂਕ ਦਾ ਅਰਥ ਸੰਬੰਧਿਤ ਧਨਾਤਮਕ ਘਾਤ ਦਾ ਵਿਉਤਕ੍ਰਮ ਲੈਣਾ ਹੈ।",
    "For the same base, add the signed exponents.": "ਇੱਕੋ ਅਧਾਰ ਲਈ ਚਿੰਨ੍ਹ ਸਮੇਤ ਘਾਤਾਂਕ ਜੋੜੋ।",
    "Take the exact root indicated by the denominator first, then raise it to the numerator power.": "ਪਹਿਲਾਂ ਹਰ ਦੁਆਰਾ ਦਰਸਾਇਆ ਸਟੀਕ ਮੂਲ ਲਵੋ, ਫਿਰ ਨਤੀਜੇ ਨੂੰ ਅੰਸ਼ ਵਾਲੀ ਘਾਤ ਤੱਕ ਚੁੱਕੋ।",
    "The negative sign takes a reciprocal; the fractional part is evaluated by roots and powers.": "ਰਿਣ ਚਿੰਨ੍ਹ ਵਿਉਤਕ੍ਰਮ ਲੈਣ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ; ਭਿੰਨਾਤਮਕ ਭਾਗ ਦਾ ਮੁੱਲ ਮੂਲ ਅਤੇ ਘਾਤਾਂ ਨਾਲ ਕੱਢੋ।",
    "Take the exact root indicated by the denominator from both numerator and denominator of the base, then apply the numerator power.": "ਪਹਿਲਾਂ ਅਧਾਰ ਦੇ ਅੰਸ਼ ਅਤੇ ਹਰ ਦੋਵਾਂ ਵਿੱਚ ਹਰ ਦੁਆਰਾ ਦਰਸਾਇਆ ਸਟੀਕ ਮੂਲ ਲਵੋ, ਫਿਰ ਅੰਸ਼ ਵਾਲੀ ਘਾਤ ਲਗਾਓ।",
    "First evaluate the corresponding positive fractional power using the exact root, then take its reciprocal because the exponent is negative.": "ਪਹਿਲਾਂ ਸਟੀਕ ਮੂਲ ਨਾਲ ਸੰਬੰਧਿਤ ਧਨਾਤਮਕ ਭਿੰਨਾਤਮਕ ਘਾਤ ਦਾ ਮੁੱਲ ਕੱਢੋ; ਘਾਤਾਂਕ ਰਿਣਾਤਮਕ ਹੋਣ ਕਰਕੇ ਫਿਰ ਇਸ ਦਾ ਵਿਉਤਕ੍ਰਮ ਲਵੋ।",
    "An odd root of a negative number is real; take the cube root first and then apply the numerator power.": "ਰਿਣਾਤਮਕ ਸੰਖਿਆ ਦਾ ਵਿਸਮ ਮੂਲ ਵਾਸਤਵਿਕ ਹੁੰਦਾ ਹੈ; ਪਹਿਲਾਂ ਘਣਮੂਲ ਲਵੋ ਅਤੇ ਫਿਰ ਅੰਸ਼ ਵਾਲੀ ਘਾਤ ਲਗਾਓ।",
    "An even-denominator rational exponent requires an even root, which is not real for a negative base.": "ਸਮ ਹਰ ਵਾਲੇ ਪਰਿਮੇਯ ਘਾਤਾਂਕ ਲਈ ਸਮ ਮੂਲ ਚਾਹੀਦਾ ਹੈ, ਜੋ ਰਿਣਾਤਮਕ ਅਧਾਰ ਲਈ ਵਾਸਤਵਿਕ ਨਹੀਂ ਹੁੰਦਾ।",
    "Express each composite base as a power of the common base, then add exponents.": "ਹਰੇਕ ਸੰਯੁਕਤ ਅਧਾਰ ਨੂੰ ਸਾਂਝੇ ਅਧਾਰ ਦੀ ਘਾਤ ਵਜੋਂ ਲਿਖ ਕੇ ਘਾਤਾਂਕ ਜੋੜੋ।",
    "Reverse the reciprocal under the negative exponent, then express everything with the common base.": "ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਹੇਠ ਬਣੇ ਵਿਉਤਕ੍ਰਮ ਨੂੰ ਉਲਟੋ, ਫਿਰ ਸਭ ਕੁਝ ਸਾਂਝੇ ਅਧਾਰ ਵਿੱਚ ਲਿਖੋ।",
    "Convert both bases to the same common base and subtract the denominator exponent contribution.": "ਦੋਵੇਂ ਅਧਾਰਾਂ ਨੂੰ ਇੱਕੋ ਸਾਂਝੇ ਅਧਾਰ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਹਰ ਵਾਲੇ ਘਾਤਾਂਕ ਦਾ ਯੋਗਦਾਨ ਘਟਾਓ।",
    "Rewrite each given base as a power of the common base, then compare the exact values.": "ਹਰੇਕ ਦਿੱਤੇ ਅਧਾਰ ਨੂੰ ਸਾਂਝੇ ਅਧਾਰ ਦੀ ਘਾਤ ਵਜੋਂ ਲਿਖ ਕੇ ਸਟੀਕ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    "Rewrite both visible bases as powers of one common base, then equate exponents.": "ਦੋਵੇਂ ਦਿਖਾਈ ਦੇ ਰਹੇ ਅਧਾਰਾਂ ਨੂੰ ਇੱਕ ਸਾਂਝੇ ਅਧਾਰ ਦੀਆਂ ਘਾਤਾਂ ਵਜੋਂ ਲਿਖੋ, ਫਿਰ ਘਾਤਾਂਕ ਬਰਾਬਰ ਕਰੋ।",
    "Rewrite the reciprocal base as the original base with a negative exponent, then equate exponents.": "ਵਿਉਤਕ੍ਰਮ ਅਧਾਰ ਨੂੰ ਮੂਲ ਅਧਾਰ ਦੀ ਰਿਣਾਤਮਕ ਘਾਤ ਵਜੋਂ ਲਿਖੋ, ਫਿਰ ਘਾਤਾਂਕ ਬਰਾਬਰ ਕਰੋ।",
    "Factor the common term a^x before solving for the power.": "ਘਾਤ ਦਾ ਮੁੱਲ ਹੱਲ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਂਝੇ ਪਦ a^x ਨੂੰ ਗੁਣਨਖੰਡ ਵਜੋਂ ਬਾਹਰ ਕੱਢੋ।",
    "Rewrite all three bases as powers of one common base and equate each exponent contribution to the supplied common exponent.": "ਤਿੰਨਾਂ ਅਧਾਰਾਂ ਨੂੰ ਇੱਕ ਸਾਂਝੇ ਅਧਾਰ ਦੀਆਂ ਘਾਤਾਂ ਵਜੋਂ ਲਿਖੋ ਅਤੇ ਹਰੇਕ ਘਾਤਾਂਕ-ਯੋਗਦਾਨ ਨੂੰ ਦਿੱਤੇ ਸਾਂਝੇ ਘਾਤਾਂਕ ਦੇ ਬਰਾਬਰ ਕਰੋ।",
    "First equate exponents to recover x; then substitute x into the requested derived power.": "ਪਹਿਲਾਂ ਘਾਤਾਂਕ ਬਰਾਬਰ ਕਰਕੇ x ਪਤਾ ਕਰੋ; ਫਿਰ x ਨੂੰ ਪੁੱਛੀ ਗਈ ਨਿਕਲੀ ਘਾਤ ਵਿੱਚ ਰੱਖੋ।",
    "With a common negative exponent, reciprocals reverse the base order.": "ਸਾਂਝੇ ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਨਾਲ ਵਿਉਤਕ੍ਰਮ ਅਧਾਰਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟ ਦਿੰਦੇ ਹਨ।",
    "Reduce each expression to a power of the same base and classify the relation.": "ਹਰੇਕ ਵਿਅੰਜਕ ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਦੀ ਘਾਤ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਸੰਬੰਧ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।",
    "Rewrite both quantities to powers of the same base and compare the exact exponents.": "ਦੋਵੇਂ ਰਾਸ਼ੀਆਂ ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਦੀਆਂ ਘਾਤਾਂ ਵਿੱਚ ਲਿਖ ਕੇ ਸਟੀਕ ਘਾਤਾਂਕਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    "Convert each expression to the common base and order the resulting exponents.": "ਹਰੇਕ ਵਿਅੰਜਕ ਨੂੰ ਸਾਂਝੇ ਅਧਾਰ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਮਿਲੇ ਘਾਤਾਂਕਾਂ ਅਨੁਸਾਰ ਕ੍ਰਮ ਲਗਾਓ।",
    "Check the operation involved against the exact index law rather than transferring a rule from multiplication to addition or division.": "ਵਰਤੀ ਗਈ ਕ੍ਰਿਆ ਨੂੰ ਸਟੀਕ ਘਾਤਾਂਕ ਨਿਯਮ ਨਾਲ ਜਾਂਚੋ; ਗੁਣਾ ਵਾਲਾ ਨਿਯਮ ਜੋੜ ਜਾਂ ਭਾਗ ਉੱਤੇ ਨਾ ਲਗਾਓ।",
    "Apply the exact law to each statement separately before combining the two truth values.": "ਦੋਵੇਂ ਕਥਨਾਂ ਉੱਤੇ ਸਟੀਕ ਨਿਯਮ ਵੱਖ-ਵੱਖ ਲਗਾਓ, ਫਿਰ ਉਨ੍ਹਾਂ ਦੇ ਸੱਚ-ਮੁੱਲ ਮਿਲਾਓ।",
    "An nth root contributes denominator n to the exponent; the power inside the radical supplies the numerator.": "nਵੇਂ ਮੂਲ ਤੋਂ ਘਾਤਾਂਕ ਦਾ ਹਰ n ਮਿਲਦਾ ਹੈ; ਮੂਲ ਦੇ ਅੰਦਰਲੀ ਘਾਤ ਅੰਸ਼ ਦਿੰਦੀ ਹੈ।",
    "Simplify the composite radical first; once both terms have the same radicand, combine coefficients.": "ਪਹਿਲਾਂ ਸੰਯੁਕਤ ਮੂਲ ਨੂੰ ਸਰਲ ਕਰੋ; ਜਦੋਂ ਦੋਵੇਂ ਪਦਾਂ ਦੀ ਕਰਣੀਗਤ ਸੰਖਿਆ ਇੱਕੋ ਹੋ ਜਾਵੇ, ਤਾਂ ਕੇਵਲ ਗੁਣਾਂਕ ਜੋੜ-ਘਟਾ ਕੇ ਮਿਲਾਓ।",
    "Multiply numerator and denominator by the same square root; the denominator becomes the radicand.": "ਅੰਸ਼ ਅਤੇ ਹਰ ਦੋਵਾਂ ਨੂੰ ਉਸੇ ਵਰਗਮੂਲ ਨਾਲ ਗੁਣਾ ਕਰੋ; ਹਰ ਕਰਣੀਗਤ ਸੰਖਿਆ ਬਣ ਜਾਂਦਾ ਹੈ।",
    "Multiply by the conjugate of the binomial denominator; its product with the denominator is a difference of squares.": "ਦੁਪਦੀ ਹਰ ਦੇ ਸੰਯੁਗਮੀ ਨਾਲ ਗੁਣਾ ਕਰੋ; ਹਰ ਅਤੇ ਉਸ ਦੇ ਸੰਯੁਗਮੀ ਦਾ ਗੁਣਨਫਲ ਵਰਗਾਂ ਦਾ ਅੰਤਰ ਹੁੰਦਾ ਹੈ।",
    "Rationalise each conjugate denominator, then collect rational and surd parts.": "ਹਰੇਕ ਸੰਯੁਗਮੀ ਹਰ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ, ਫਿਰ ਪਰਿਮੇਯ ਅਤੇ ਕਰਣੀ ਵਾਲੇ ਭਾਗ ਮਿਲਾਓ।",
    "Rationalise first, recover A and B exactly, then evaluate the requested coefficient expression.": "ਪਹਿਲਾਂ ਪਰਿਮੇਯਕਰਨ ਕਰੋ, ਫਿਰ A ਅਤੇ B ਸਟੀਕ ਤੌਰ ਤੇ ਪਤਾ ਕਰਕੇ ਪੁੱਛੇ ਗਏ ਗੁਣਾਂਕ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "In the denested pair, the two radicands add to A and multiply to B.": "ਸਰਲ ਕਰਣੀ ਜੋੜੇ ਵਿੱਚ ਦੋਵੇਂ ਕਰਣੀਗਤ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ A ਅਤੇ ਗੁਣਨਫਲ B ਹੁੰਦਾ ਹੈ।",
    "Treat c√n as √(c²n), then bound that exact square root by consecutive squares.": "c√n ਨੂੰ √(c²n) ਵਜੋਂ ਲਿਖੋ, ਫਿਰ ਇਸ ਸਟੀਕ ਵਰਗਮੂਲ ਨੂੰ ਨੇੜਲੇ ਪੂਰਨ ਵਰਗਾਂ ਨਾਲ ਸੀਮਿਤ ਕਰੋ।",
    "Compare n with the surrounding perfect squares; use those exact inequalities to test each statement.": "n ਦੀ ਤੁਲਨਾ ਨੇੜਲੇ ਪੂਰਨ ਵਰਗਾਂ ਨਾਲ ਕਰੋ; ਇਨ੍ਹਾਂ ਸਟੀਕ ਅਸਮਿਕਾਵਾਂ ਨਾਲ ਹਰੇਕ ਕਥਨ ਦੀ ਜਾਂਚ ਕਰੋ।",
    "Square both positive expressions. Their rational parts match, so compare the exact cross-term products.": "ਦੋਵੇਂ ਧਨਾਤਮਕ ਵਿਅੰਜਕਾਂ ਦਾ ਵਰਗ ਕਰੋ। ਉਨ੍ਹਾਂ ਦੇ ਪਰਿਮੇਯ ਭਾਗ ਇੱਕੋ ਹਨ, ਇਸ ਲਈ ਸਟੀਕ ਕ੍ਰਾਸ-ਪਦ ਗੁਣਨਫਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    "Write the nth root as exponent 1/n, separate the exponent multiple of n, then return the residual fractional power to radical form.": "nਵੇਂ ਮੂਲ ਨੂੰ 1/n ਘਾਤ ਵਜੋਂ ਲਿਖੋ, n ਦੇ ਗੁਣਜ ਵਾਲੇ ਘਾਤਾਂਕ ਨੂੰ ਵੱਖ ਕਰੋ, ਫਿਰ ਬਚੀ ਭਿੰਨਾਤਮਕ ਘਾਤ ਨੂੰ ਮੁੜ ਮੂਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
    "The denominator tells which root to take; the numerator tells which power to apply after taking that root.": "ਹਰ ਦੱਸਦਾ ਹੈ ਕਿਹੜਾ ਮੂਲ ਲੈਣਾ ਹੈ; ਅੰਸ਼ ਦੱਸਦਾ ਹੈ ਮੂਲ ਲੈਣ ਤੋਂ ਬਾਅਦ ਕਿਹੜੀ ਘਾਤ ਲਗਾਉਣੀ ਹੈ।",
    "A qth root is exactly exponent 1/q; the power inside the root supplies numerator p.": "qਵੇਂ ਮੂਲ ਦਾ ਅਰਥ ਠੀਕ 1/q ਘਾਤ ਹੈ; ਮੂਲ ਦੇ ਅੰਦਰਲੀ p ਘਾਤ ਅੰਸ਼ p ਦਿੰਦੀ ਹੈ।",
    "Replace the square root by exponent 1/2, express the integer target as a power of the same base, then equate exponents.": "ਵਰਗਮੂਲ ਨੂੰ 1/2 ਘਾਤ ਨਾਲ ਬਦਲੋ, ਪੂਰਨ ਅੰਕ ਲਕਸ਼ ਨੂੰ ਉਸੇ ਅਧਾਰ ਦੀ ਘਾਤ ਵਜੋਂ ਲਿਖੋ, ਫਿਰ ਘਾਤਾਂਕ ਬਰਾਬਰ ਕਰੋ।",
    "Four index-law statements are given, each with its domain stated where needed.": "ਘਾਤਾਂਕ ਨਿਯਮਾਂ ਦੇ ਚਾਰ ਕਥਨ ਦਿੱਤੇ ਹਨ; ਜਿੱਥੇ ਲੋੜ ਹੈ ਉੱਥੇ ਹਰੇਕ ਦਾ ਪਰਿਭਾਸ਼ਾ-ਖੇਤਰ ਵੀ ਦਿੱਤਾ ਹੈ।",
    "The base is a perfect fourth power, and the exponent 1/4 is already in lowest terms.": "ਅਧਾਰ ਇੱਕ ਪੂਰਨ ਚੌਥੀ ਘਾਤ ਹੈ ਅਤੇ ਘਾਤਾਂਕ 1/4 ਪਹਿਲਾਂ ਹੀ ਘੱਟਤਮ ਰੂਪ ਵਿੱਚ ਹੈ।",
    "negative base has no real even-denominator rational power": "ਰਿਣਾਤਮਕ ਅਧਾਰ ਦੀ ਸਮ ਹਰ ਵਾਲੀ ਕੋਈ ਵਾਸਤਵਿਕ ਪਰਿਮੇਯ ਘਾਤ ਨਹੀਂ ਹੁੰਦੀ",
    "Both expressions have the same exact rational exponent.": "ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਦਾ ਸਟੀਕ ਪਰਿਮੇਯ ਘਾਤਾਂਕ ਇੱਕੋ ਹੈ।",
    "Power-of-power multiplies exponents.": "ਘਾਤ ਦੀ ਘਾਤ ਵਿੱਚ ਘਾਤਾਂਕਾਂ ਦਾ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।",
    "Use the supplied power relation to recover the requested exact quantity.": "ਦਿੱਤੇ ਘਾਤ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪੁੱਛੀ ਗਈ ਸਟੀਕ ਰਾਸ਼ੀ ਪਤਾ ਕਰੋ।",
    "Solve x and evaluate the requested derived power.": "x ਹੱਲ ਕਰੋ ਅਤੇ ਪੁੱਛੀ ਗਈ ਨਿਕਲੀ ਘਾਤ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "Arrange all three powers in increasing order.": "ਤਿੰਨਾਂ ਘਾਤਾਂ ਨੂੰ ਵੱਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।",
    "Simplify and classify the exact result.": "ਸਟੀਕ ਨਤੀਜੇ ਨੂੰ ਸਰਲ ਕਰਕੇ ਉਸ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।",
    "Choose the exact range statement.": "ਸਟੀਕ ਪਰਾਸ ਵਾਲਾ ਕਥਨ ਚੁਣੋ।",
    "Evaluate the transformed reciprocal-conjugate target.": "ਬਦਲੇ ਹੋਏ ਵਿਉਤਕ੍ਰਮ-ਸੰਯੁਗਮੀ ਲਕਸ਼ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "Use the reciprocal-conjugate relation to evaluate the target.": "ਵਿਉਤਕ੍ਰਮ-ਸੰਯੁਗਮੀ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਲਕਸ਼ ਦਾ ਮੁੱਲ ਕੱਢੋ।"
  },
};

const PREFIX_OVERRIDES: Record<SriLocalizedLocaleV1, readonly (readonly [string, string])[]> = {
  "hi-IN": [
    ["The given expression is ", "दिया गया व्यंजक है "],
    ["Therefore the expression is ", "अतः व्यंजक है "],
    ["Without decimals, decide the truth of: ", "दशमलव का प्रयोग किए बिना, कथनों की सत्यता निर्धारित कीजिए: "],
    ["Denest ", "नेस्टेड करणी को सरल रूप में लिखिए "],
  ],
  "pa-IN": [
    ["The given expression is ", "ਦਿੱਤਾ ਗਿਆ ਵਿਅੰਜਕ ਹੈ "],
    ["Therefore the expression is ", "ਇਸ ਲਈ ਵਿਅੰਜਕ ਹੈ "],
    ["Without decimals, decide the truth of: ", "ਦਸ਼ਮਲਵ ਵਰਤੇ ਬਿਨਾਂ, ਕਥਨਾਂ ਦੀ ਸੱਚਾਈ ਨਿਰਧਾਰਤ ਕਰੋ: "],
    ["Denest ", "ਨੇਸਟਡ ਕਰਣੀ ਨੂੰ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ "],
  ],
};

interface SriLocalizationTemplateRuleV1 {
  readonly pattern: RegExp;
  readonly render: (match: RegExpMatchArray) => string;
}

const TEMPLATE_OVERRIDES: Record<SriLocalizedLocaleV1, readonly SriLocalizationTemplateRuleV1[]> = {
  "hi-IN": [
    { pattern: /^Write (.+) as one power\.$/u, render: (m) => `${m[1]} को एक ही घात के रूप में लिखिए।` },
    { pattern: /^Using base (.+), order (.+) from least to greatest\.$/u, render: (m) => `आधार ${m[1]} का उपयोग करके ${m[2]} को सबसे छोटे से सबसे बड़े क्रम में लगाइए।` },
    { pattern: /^Write (.+) after extracting the perfect (.+)-power factor\.$/u, render: (m) => `${m[2]} घात का पूर्ण गुणनखंड बाहर निकालकर ${m[1]} को लिखिए।` },
    { pattern: /^After exact simplification, classify (.+)\.$/u, render: (m) => `सटीक रूप से सरल करने के बाद ${m[1]} का वर्गीकरण कीजिए।` },
    { pattern: /^After exact simplification, is (.+) rational or irrational\?$/u, render: (m) => `सटीक रूप से सरल करने के बाद निर्धारित कीजिए कि ${m[1]} परिमेय है या अपरिमेय।` },
    { pattern: /^Write (.+) with a rational denominator\.$/u, render: (m) => `${m[1]} को परिमेय हर वाले रूप में लिखिए।` },
    { pattern: /^Find the exact rationalised form of (.+)\.$/u, render: (m) => `${m[1]} का सटीक परिमेयकृत रूप ज्ञात कीजिए।` },
    { pattern: /^Find the exact denested form of (.+)\.$/u, render: (m) => `${m[1]} का सटीक सरल करणी रूप ज्ञात कीजिए।` },
    { pattern: /^Without decimals, determine the order of (.+)\.$/u, render: (m) => `दशमलव का प्रयोग किए बिना ${m[1]} का क्रम निर्धारित कीजिए।` },
    { pattern: /^Determine the exact order of (.+)\.$/u, render: (m) => `${m[1]} का सटीक क्रम निर्धारित कीजिए।` },
    { pattern: /^Choose the exact consecutive-integer interval containing (.+)\.$/u, render: (m) => `${m[1]} को समाहित करने वाला लगातार पूर्णांकों का सटीक अंतराल चुनिए।` },
    { pattern: /^Compare the positive surd sums (.+) by exact arithmetic\.$/u, render: (m) => `धनात्मक करणी-योग ${m[1]} की सटीक गणना से तुलना कीजिए।` },
    { pattern: /^Convert (.+) to exponent notation, simplify the powers, then return to radical form\.$/u, render: (m) => `${m[1]} को घातांक रूप में बदलिए, घातों को सरल कीजिए, फिर मूल रूप में वापस लिखिए।` },
    { pattern: /^An exact rational base is raised to the reduced fractional index (.+)\.$/u, render: (m) => `एक सटीक परिमेय आधार को लघुतम भिन्नात्मक घातांक ${m[1]} तक उठाया गया है।` },
    { pattern: /^The power to classify is (.+)\.$/u, render: (m) => `वर्गीकृत की जाने वाली घात है ${m[1]}।` },
    { pattern: /^The powers to compare are (.+)\.$/u, render: (m) => `तुलना की जाने वाली घातें हैं ${m[1]}।` },
    { pattern: /^The quantities to order are (.+)\.$/u, render: (m) => `क्रम में लगाने वाली राशियाँ हैं ${m[1]}।` },
    { pattern: /^The powers to order are (.+)\.$/u, render: (m) => `क्रम में लगाने वाली घातें हैं ${m[1]}।` },
    { pattern: /^A positive (.+) root expression is given\.$/u, render: (m) => `एक धनात्मक ${m[1]} मूल व्यंजक दिया गया है।` },
    { pattern: /^The conjugate-denominator sum is (.+)\.$/u, render: (m) => `संयुग्मी हरों वाला योग है ${m[1]}।` },
    { pattern: /^The two exact representations are (.+)\.$/u, render: (m) => `दो सटीक निरूपण हैं ${m[1]}।` },
    { pattern: /^Factor out the largest perfect (.+) power from the radicand\.$/u, render: (m) => `करणीगत संख्या से सबसे बड़ा पूर्ण ${m[1]} घात वाला गुणनखंड बाहर निकालिए।` },
    { pattern: /^Check whether the radicand is a perfect (.+) power\.$/u, render: (m) => `जाँचिए कि करणीगत संख्या पूर्ण ${m[1]} घात है या नहीं।` },
    { pattern: /^Raise both positive radicals to the common power (.+); this preserves their order\.$/u, render: (m) => `दोनों धनात्मक मूलों को समान घात ${m[1]} तक उठाइए; इससे उनका क्रम नहीं बदलता।` },
    { pattern: /^(.+) is not a perfect (.+) power, so the radical remains irrational\.$/u, render: (m) => `${m[1]} पूर्ण ${m[2]} घात नहीं है, इसलिए मूल अपरिमेय ही रहता है।` },
    { pattern: /^Exact simplified result = (.+)$/u, render: (m) => `सटीक सरल परिणाम = ${m[1]}` },
    { pattern: /^Denominator after conjugation = (.+)$/u, render: (m) => `संयुग्मी से गुणा करने के बाद हर = ${m[1]}` },
    { pattern: /^Add (.+): net exponent = (.+)$/u, render: (m) => `${m[1]} जोड़िए: कुल घातांक = ${m[2]}` },
    { pattern: /^Denominator norm = (.+)$/u, render: (m) => `हर का मान = ${m[1]}` },
    { pattern: /^The perfect (.+)-power part contributes (.+) outside the radical\.$/u, render: (m) => `पूर्ण ${m[1]} घात वाला भाग मूल से बाहर ${m[2]} देता है।` },
    { pattern: /^Second cross-term radicand: (.+)$/u, render: (m) => `दूसरे क्रॉस-पद की करणीगत संख्या: ${m[1]}` },
  ],
  "pa-IN": [
    { pattern: /^Write (.+) as one power\.$/u, render: (m) => `${m[1]} ਨੂੰ ਇੱਕੋ ਘਾਤ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।` },
    { pattern: /^Using base (.+), order (.+) from least to greatest\.$/u, render: (m) => `ਅਧਾਰ ${m[1]} ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${m[2]} ਨੂੰ ਸਭ ਤੋਂ ਛੋਟੇ ਤੋਂ ਸਭ ਤੋਂ ਵੱਡੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।` },
    { pattern: /^Write (.+) after extracting the perfect (.+)-power factor\.$/u, render: (m) => `${m[2]} ਘਾਤ ਦਾ ਪੂਰਨ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢ ਕੇ ${m[1]} ਨੂੰ ਲਿਖੋ।` },
    { pattern: /^After exact simplification, classify (.+)\.$/u, render: (m) => `ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ${m[1]} ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।` },
    { pattern: /^After exact simplification, is (.+) rational or irrational\?$/u, render: (m) => `ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ${m[1]} ਪਰਿਮੇਯ ਹੈ ਜਾਂ ਅਪਰਿਮੇਯ।` },
    { pattern: /^Write (.+) with a rational denominator\.$/u, render: (m) => `${m[1]} ਨੂੰ ਪਰਿਮੇਯ ਹਰ ਵਾਲੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।` },
    { pattern: /^Find the exact rationalised form of (.+)\.$/u, render: (m) => `${m[1]} ਦਾ ਸਟੀਕ ਪਰਿਮੇਯਕ੍ਰਿਤ ਰੂਪ ਪਤਾ ਕਰੋ।` },
    { pattern: /^Find the exact denested form of (.+)\.$/u, render: (m) => `${m[1]} ਦਾ ਸਟੀਕ ਸਰਲ ਕਰਣੀ ਰੂਪ ਪਤਾ ਕਰੋ।` },
    { pattern: /^Without decimals, determine the order of (.+)\.$/u, render: (m) => `ਦਸ਼ਮਲਵ ਵਰਤੇ ਬਿਨਾਂ ${m[1]} ਦਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਕਰੋ।` },
    { pattern: /^Determine the exact order of (.+)\.$/u, render: (m) => `${m[1]} ਦਾ ਸਟੀਕ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਕਰੋ।` },
    { pattern: /^Choose the exact consecutive-integer interval containing (.+)\.$/u, render: (m) => `${m[1]} ਨੂੰ ਸਮੇਟਣ ਵਾਲਾ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਸਟੀਕ ਅੰਤਰਾਲ ਚੁਣੋ।` },
    { pattern: /^Compare the positive surd sums (.+) by exact arithmetic\.$/u, render: (m) => `ਧਨਾਤਮਕ ਕਰਣੀ-ਜੋੜ ${m[1]} ਦੀ ਸਟੀਕ ਗਣਨਾ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।` },
    { pattern: /^Convert (.+) to exponent notation, simplify the powers, then return to radical form\.$/u, render: (m) => `${m[1]} ਨੂੰ ਘਾਤਾਂਕ ਰੂਪ ਵਿੱਚ ਬਦਲੋ, ਘਾਤਾਂ ਨੂੰ ਸਰਲ ਕਰੋ, ਫਿਰ ਮੂਲ ਰੂਪ ਵਿੱਚ ਵਾਪਸ ਲਿਖੋ।` },
    { pattern: /^An exact rational base is raised to the reduced fractional index (.+)\.$/u, render: (m) => `ਇੱਕ ਸਟੀਕ ਪਰਿਮੇਯ ਅਧਾਰ ਨੂੰ ਘਟਾਈ ਹੋਈ ਭਿੰਨਾਤਮਕ ਘਾਤ ${m[1]} ਤੱਕ ਚੁੱਕਿਆ ਗਿਆ ਹੈ।` },
    { pattern: /^The power to classify is (.+)\.$/u, render: (m) => `ਵਰਗੀਕਰਨ ਲਈ ਘਾਤ ਹੈ ${m[1]}।` },
    { pattern: /^The powers to compare are (.+)\.$/u, render: (m) => `ਤੁਲਨਾ ਲਈ ਘਾਤਾਂ ਹਨ ${m[1]}।` },
    { pattern: /^The quantities to order are (.+)\.$/u, render: (m) => `ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਵਾਲੀਆਂ ਰਾਸ਼ੀਆਂ ਹਨ ${m[1]}।` },
    { pattern: /^The powers to order are (.+)\.$/u, render: (m) => `ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਵਾਲੀਆਂ ਘਾਤਾਂ ਹਨ ${m[1]}।` },
    { pattern: /^A positive (.+) root expression is given\.$/u, render: (m) => `ਇੱਕ ਧਨਾਤਮਕ ${m[1]} ਮੂਲ ਵਿਅੰਜਕ ਦਿੱਤਾ ਗਿਆ ਹੈ।` },
    { pattern: /^The conjugate-denominator sum is (.+)\.$/u, render: (m) => `ਸੰਯੁਗਮੀ ਹਰਾਂ ਵਾਲਾ ਜੋੜ ਹੈ ${m[1]}।` },
    { pattern: /^The two exact representations are (.+)\.$/u, render: (m) => `ਦੋ ਸਟੀਕ ਨਿਰੂਪਣ ਹਨ ${m[1]}।` },
    { pattern: /^Factor out the largest perfect (.+) power from the radicand\.$/u, render: (m) => `ਕਰਣੀਗਤ ਸੰਖਿਆ ਵਿਚੋਂ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ${m[1]} ਘਾਤ ਵਾਲਾ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢੋ।` },
    { pattern: /^Check whether the radicand is a perfect (.+) power\.$/u, render: (m) => `ਜਾਂਚੋ ਕਿ ਕਰਣੀਗਤ ਸੰਖਿਆ ਪੂਰਨ ${m[1]} ਘਾਤ ਹੈ ਜਾਂ ਨਹੀਂ।` },
    { pattern: /^Raise both positive radicals to the common power (.+); this preserves their order\.$/u, render: (m) => `ਦੋਵੇਂ ਧਨਾਤਮਕ ਮੂਲਾਂ ਨੂੰ ਸਾਂਝੀ ਘਾਤ ${m[1]} ਤੱਕ ਚੁੱਕੋ; ਇਸ ਨਾਲ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਨਹੀਂ ਬਦਲਦਾ।` },
    { pattern: /^(.+) is not a perfect (.+) power, so the radical remains irrational\.$/u, render: (m) => `${m[1]} ਪੂਰਨ ${m[2]} ਘਾਤ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਮੂਲ ਅਪਰਿਮੇਯ ਹੀ ਰਹਿੰਦਾ ਹੈ।` },
    { pattern: /^Exact simplified result = (.+)$/u, render: (m) => `ਸਟੀਕ ਸਰਲ ਨਤੀਜਾ = ${m[1]}` },
    { pattern: /^Denominator after conjugation = (.+)$/u, render: (m) => `ਸੰਯੁਗਮੀ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹਰ = ${m[1]}` },
    { pattern: /^Add (.+): net exponent = (.+)$/u, render: (m) => `${m[1]} ਜੋੜੋ: ਕੁੱਲ ਘਾਤਾਂਕ = ${m[2]}` },
    { pattern: /^Denominator norm = (.+)$/u, render: (m) => `ਹਰ ਦਾ ਮਾਪ = ${m[1]}` },
    { pattern: /^The perfect (.+)-power part contributes (.+) outside the radical\.$/u, render: (m) => `ਪੂਰਨ ${m[1]} ਘਾਤ ਵਾਲਾ ਭਾਗ ਮੂਲ ਤੋਂ ਬਾਹਰ ${m[2]} ਦਿੰਦਾ ਹੈ।` },
    { pattern: /^Second cross-term radicand: (.+)$/u, render: (m) => `ਦੂਜੇ ਕ੍ਰਾਸ-ਪਦ ਦੀ ਕਰਣੀਗਤ ਸੰਖਿਆ: ${m[1]}` },
  ],
};

export function localizeSriLearnerTextV1(text: string, locale: SriLocalizedLocaleV1): string {
  const exact = EXACT_OVERRIDES[locale][text];
  if (exact) return exact;

  for (const rule of TEMPLATE_OVERRIDES[locale]) {
    const match = text.match(rule.pattern);
    if (match) return rule.render(match);
  }

  let prepared = text;
  for (const [source, target] of PREFIX_OVERRIDES[locale]) {
    if (prepared.startsWith(source)) {
      prepared = target + prepared.slice(source.length);
      break;
    }
  }
  return localizeSriLearnerTextBaseV1(prepared, locale);
}

export function localizeSriDiscoveryQuestionV1(
  source: SriDiscoveryQuestion,
  locale: SriLocalizedLocaleV1,
): SriLocalizedDiscoveryQuestionV1 {
  const answer = {
    ...source.answer,
    text: localizeSriLearnerTextV1(source.answer.text, locale),
  };
  const options = source.options.map((option) => ({
    ...option,
    text: localizeSriLearnerTextV1(option.text, locale),
  })) as unknown as SriDiscoveryQuestion["options"];
  const explanation: SriHumanExplanation = {
    given: localizeSriLearnerTextV1(source.explanation.given, locale),
    asked: localizeSriLearnerTextV1(source.explanation.asked, locale),
    method: localizeSriLearnerTextV1(source.explanation.method, locale),
    working: source.explanation.working.map((line) => localizeSriLearnerTextV1(line, locale)),
    answer: localizeSriLearnerTextV1(source.explanation.answer, locale),
  };
  return deepFreeze({
    ...source,
    stem: localizeSriLearnerTextV1(source.stem, locale),
    answer,
    options,
    explanation,
  });
}

export function generateSriPermanentLocalizedQuestionV1(
  qlId: SriPermanentQlId,
  externalSeed: string,
  locale: SriLocalizedLocaleV1,
): SriPermanentLocalizedQuestionV1 {
  const english = generateSriPermanentEnglishQuestionV1(qlId, externalSeed);
  const question = localizeSriDiscoveryQuestionV1(english.question, locale);
  return deepFreeze({
    packageId: english.packageId,
    checkpointId: english.checkpointId,
    permanentQlId: english.permanentQlId,
    permanentSolveModeId: english.permanentSolveModeId,
    retainedGroupId: english.retainedGroupId,
    englishQlTitle: english.qlTitle,
    locale,
    language: LANGUAGE_BY_LOCALE[locale],
    externalSeed,
    sourceCandidateId: english.sourceCandidateId,
    sourceCheckpointId: english.sourceCheckpointId,
    sourceSeed: english.sourceSeed,
    englishFingerprint: english.englishFingerprint,
    question,
    lifecycle: {
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "LOCALIZATION_REVIEW_READY" as const,
      localizationStatus: "REVIEW_READY" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionStudioGenerationEnabled: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}
