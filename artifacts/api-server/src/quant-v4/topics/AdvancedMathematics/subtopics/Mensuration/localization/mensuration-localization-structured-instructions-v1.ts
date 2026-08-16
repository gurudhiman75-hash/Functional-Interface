import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type Pair = readonly [string, string];

const HI: readonly Pair[] = [
  ["Multiply the rectangle's length by its breadth.", "आयत की लंबाई को उसकी चौड़ाई से गुणा करें।"],
  ["A semicircle has half the area of a full circle.", "अर्धवृत्त का क्षेत्रफल पूरे वृत्त के क्षेत्रफल का आधा होता है।"],
  ["The two parts do not overlap, so their areas are added.", "दोनों भाग एक-दूसरे पर नहीं चढ़ते, इसलिए उनके क्षेत्रफल जोड़े जाते हैं।"],
  ["Combine the component values using the relation stated in the Key Rule.", "मुख्य नियम में दिए संबंध के अनुसार सभी भागों के मान जोड़ें।"],
  ["Subtract the excluded or inner part from the complete measure.", "पूरे माप में से हटाए गए या भीतरी भाग को घटाएँ।"],
  ["Write all measurements in compatible units before calculating.", "गणना से पहले सभी मापों को संगत इकाइयों में लिखें।"],
  ["Use the diameter-radius relationship before applying the circle formula.", "वृत्त का सूत्र लगाने से पहले व्यास और त्रिज्या का संबंध प्रयोग करें।"],
  ["Use the base and corresponding perpendicular height.", "आधार और उससे संबंधित लंबवत ऊँचाई का प्रयोग करें।"],
  ["Use half of the full-circle area.", "पूरे वृत्त के क्षेत्रफल का आधा लें।"],
  ["Substitute the radius in the circle-area formula.", "वृत्त के क्षेत्रफल के सूत्र में त्रिज्या का मान रखें।"],
  ["Square the side length.", "भुजा की लंबाई का वर्ग करें।"],
  ["Use the regular-hexagon area relation and simplify exactly.", "सम षट्भुज के क्षेत्रफल का संबंध लगाकर ठीक मान निकालें।"],
  ["Use the boundary relation for the required perimeter or circumference.", "माँगे गए परिमाप या परिधि के लिए उपयुक्त सीमा-संबंध का प्रयोग करें।"],
  ["Substitute the corresponding measures in the scale relation.", "माप-गुणक के संबंध में संबंधित मापों के मान रखें।"],
  ["Convert each percentage change into its multiplicative factor.", "हर प्रतिशत परिवर्तन को उसके गुणक में बदलें।"],
  ["Take the positive root because a physical measurement cannot be negative.", "धनात्मक मूल लें, क्योंकि भौतिक माप ऋणात्मक नहीं हो सकता।"],
  ["Combine the measure with the stated cost or rate relation.", "दिए गए लागत या दर के संबंध के साथ माप का प्रयोग करें।"],
  ["Place the given measurements into the selected area formula.", "दिए गए मापों को चुने हुए क्षेत्रफल के सूत्र में रखें।"],
  ["Simplify the numerical expression to obtain the area.", "संख्यात्मक व्यंजक को सरल करके क्षेत्रफल प्राप्त करें।"],
  ["Substitute the supplied measurements into the governing formula.", "दिए गए मापों को लागू सूत्र में रखें।"],
  ["Simplify the expression while preserving the correct unit.", "सही इकाई बनाए रखते हुए व्यंजक को सरल करें।"],
  ["Use the previous result in the next part of the calculation.", "गणना के अगले भाग में पिछले परिणाम का प्रयोग करें।"],
  ["Evaluate the final numerical expression.", "अंतिम संख्यात्मक व्यंजक का मान निकालें।"],
  ["Carry out this part of the calculation exactly.", "गणना के इस भाग को ठीक-ठीक पूरा करें।"],
  ["Substitute the given measurements and simplify exactly.", "दिए गए मापों के मान रखकर ठीक-ठीक सरल करें।"],
  ["Identify the required measurement relation.", "पहले आवश्यक माप-संबंध पहचानें।"],
  ["Unit check: keep both dimensions in one linear unit and report the result in the corresponding square unit.", "इकाई जाँच: दोनों आयाम एक ही रैखिक इकाई में रखें और उत्तर संबंधित वर्ग इकाई में लिखें।"],
  ["Unit check: keep all lengths in one compatible linear unit.", "इकाई जाँच: सभी लंबाइयों को एक ही संगत रैखिक इकाई में रखें।"],
  ["Unit check: matching physical units cancel, so the requested ratio or scale factor is unit-free.", "इकाई जाँच: समान भौतिक इकाइयाँ कट जाती हैं, इसलिए माँगा गया अनुपात या माप-गुणक इकाई-रहित होता है।"],
  ["Unit check: the dimension multipliers are unit-free, and the final relative change is reported as %.", "इकाई जाँच: आयामों के गुणक इकाई-रहित होते हैं और अंतिम सापेक्ष परिवर्तन प्रतिशत में लिखा जाता है।"],
  ["Unit check: the circular fraction is unit-free, and the final angular measure is reported in degrees.", "इकाई जाँच: वृत्त का अंश इकाई-रहित होता है और अंतिम कोणीय माप डिग्री में लिखा जाता है।"],
  ["Use R² − r² = (R − r)(R + r) before multiplying by π; this is faster and reduces arithmetic errors.", "π से गुणा करने से पहले R² − r² = (R − r)(R + r) का प्रयोग करें; इससे गणना तेज होती है और अंकगणितीय त्रुटियाँ कम होती हैं।"],
];

const PA: readonly Pair[] = [
  ["Multiply the rectangle's length by its breadth.", "ਆਇਤ ਦੀ ਲੰਬਾਈ ਨੂੰ ਇਸ ਦੀ ਚੌੜਾਈ ਨਾਲ ਗੁਣਾ ਕਰੋ।"],
  ["A semicircle has half the area of a full circle.", "ਅਰਧ-ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ ਪੂਰੇ ਵ੍ਰਿਤ ਦੇ ਖੇਤਰਫਲ ਦਾ ਅੱਧਾ ਹੁੰਦਾ ਹੈ।"],
  ["The two parts do not overlap, so their areas are added.", "ਦੋਵੇਂ ਭਾਗ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਨਹੀਂ ਚੜ੍ਹਦੇ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਖੇਤਰਫਲ ਜੋੜੇ ਜਾਂਦੇ ਹਨ।"],
  ["Combine the component values using the relation stated in the Key Rule.", "ਮੁੱਖ ਨਿਯਮ ਵਿੱਚ ਦਿੱਤੇ ਸੰਬੰਧ ਅਨੁਸਾਰ ਸਾਰੇ ਭਾਗਾਂ ਦੇ ਮੁੱਲ ਜੋੜੋ।"],
  ["Subtract the excluded or inner part from the complete measure.", "ਪੂਰੇ ਮਾਪ ਵਿਚੋਂ ਹਟਾਇਆ ਜਾਂ ਅੰਦਰਲਾ ਭਾਗ ਘਟਾਓ।"],
  ["Write all measurements in compatible units before calculating.", "ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਸਾਰੇ ਮਾਪਾਂ ਨੂੰ ਇਕਸਾਰ ਇਕਾਈਆਂ ਵਿੱਚ ਲਿਖੋ।"],
  ["Use the diameter-radius relationship before applying the circle formula.", "ਵ੍ਰਿਤ ਦਾ ਫਾਰਮੂਲਾ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਵਿਆਸ ਅਤੇ ਅਰਧ-ਵਿਆਸ ਦਾ ਸੰਬੰਧ ਵਰਤੋ।"],
  ["Use the base and corresponding perpendicular height.", "ਆਧਾਰ ਅਤੇ ਉਸ ਨਾਲ ਸੰਬੰਧਤ ਲੰਬ ਉਚਾਈ ਵਰਤੋ।"],
  ["Use half of the full-circle area.", "ਪੂਰੇ ਵ੍ਰਿਤ ਦੇ ਖੇਤਰਫਲ ਦਾ ਅੱਧਾ ਲਓ।"],
  ["Substitute the radius in the circle-area formula.", "ਵ੍ਰਿਤ ਦੇ ਖੇਤਰਫਲ ਦੇ ਫਾਰਮੂਲੇ ਵਿੱਚ ਅਰਧ-ਵਿਆਸ ਦਾ ਮੁੱਲ ਰੱਖੋ।"],
  ["Square the side length.", "ਭੁਜਾ ਦੀ ਲੰਬਾਈ ਦਾ ਵਰਗ ਕਰੋ।"],
  ["Use the regular-hexagon area relation and simplify exactly.", "ਸਮ ਛੇਭੁਜ ਦੇ ਖੇਤਰਫਲ ਦਾ ਸੰਬੰਧ ਲਗਾ ਕੇ ਸਹੀ ਮੁੱਲ ਕੱਢੋ।"],
  ["Use the boundary relation for the required perimeter or circumference.", "ਮੰਗੇ ਗਏ ਪਰਿਮਾਪ ਜਾਂ ਪਰਿਧੀ ਲਈ ਢੁੱਕਵਾਂ ਸੀਮਾ-ਸੰਬੰਧ ਵਰਤੋ।"],
  ["Substitute the corresponding measures in the scale relation.", "ਮਾਪ-ਗੁਣਕ ਦੇ ਸੰਬੰਧ ਵਿੱਚ ਸੰਬੰਧਤ ਮਾਪਾਂ ਦੇ ਮੁੱਲ ਰੱਖੋ।"],
  ["Convert each percentage change into its multiplicative factor.", "ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਨੂੰ ਉਸ ਦੇ ਗੁਣਕ ਵਿੱਚ ਬਦਲੋ।"],
  ["Take the positive root because a physical measurement cannot be negative.", "ਧਨਾਤਮਕ ਮੂਲ ਲਓ, ਕਿਉਂਕਿ ਭੌਤਿਕ ਮਾਪ ਰਿਣਾਤਮਕ ਨਹੀਂ ਹੋ ਸਕਦਾ।"],
  ["Combine the measure with the stated cost or rate relation.", "ਦਿੱਤੇ ਲਾਗਤ ਜਾਂ ਦਰ ਦੇ ਸੰਬੰਧ ਨਾਲ ਮਾਪ ਦੀ ਵਰਤੋਂ ਕਰੋ।"],
  ["Place the given measurements into the selected area formula.", "ਦਿੱਤੇ ਮਾਪਾਂ ਨੂੰ ਚੁਣੇ ਹੋਏ ਖੇਤਰਫਲ ਦੇ ਫਾਰਮੂਲੇ ਵਿੱਚ ਰੱਖੋ।"],
  ["Simplify the numerical expression to obtain the area.", "ਅੰਕੀ ਵਿਅੰਜਕ ਨੂੰ ਸਰਲ ਕਰਕੇ ਖੇਤਰਫਲ ਪ੍ਰਾਪਤ ਕਰੋ।"],
  ["Substitute the supplied measurements into the governing formula.", "ਦਿੱਤੇ ਮਾਪਾਂ ਨੂੰ ਲਾਗੂ ਫਾਰਮੂਲੇ ਵਿੱਚ ਰੱਖੋ।"],
  ["Simplify the expression while preserving the correct unit.", "ਸਹੀ ਇਕਾਈ ਕਾਇਮ ਰੱਖਦੇ ਹੋਏ ਵਿਅੰਜਕ ਨੂੰ ਸਰਲ ਕਰੋ।"],
  ["Use the previous result in the next part of the calculation.", "ਗਣਨਾ ਦੇ ਅਗਲੇ ਭਾਗ ਵਿੱਚ ਪਿਛਲਾ ਨਤੀਜਾ ਵਰਤੋ।"],
  ["Evaluate the final numerical expression.", "ਅੰਤਿਮ ਅੰਕੀ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ।"],
  ["Carry out this part of the calculation exactly.", "ਗਣਨਾ ਦੇ ਇਸ ਭਾਗ ਨੂੰ ਠੀਕ ਤਰੀਕੇ ਨਾਲ ਪੂਰਾ ਕਰੋ।"],
  ["Substitute the given measurements and simplify exactly.", "ਦਿੱਤੇ ਮਾਪਾਂ ਦੇ ਮੁੱਲ ਰੱਖ ਕੇ ਠੀਕ ਤਰੀਕੇ ਨਾਲ ਸਰਲ ਕਰੋ।"],
  ["Identify the required measurement relation.", "ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਮਾਪ-ਸੰਬੰਧ ਪਛਾਣੋ।"],
  ["Unit check: keep both dimensions in one linear unit and report the result in the corresponding square unit.", "ਇਕਾਈ ਜਾਂਚ: ਦੋਵੇਂ ਮਾਪ ਇੱਕੋ ਰੇਖੀ ਇਕਾਈ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਉੱਤਰ ਸੰਬੰਧਤ ਵਰਗ ਇਕਾਈ ਵਿੱਚ ਲਿਖੋ।"],
  ["Unit check: keep all lengths in one compatible linear unit.", "ਇਕਾਈ ਜਾਂਚ: ਸਾਰੀਆਂ ਲੰਬਾਈਆਂ ਨੂੰ ਇੱਕੋ ਇਕਸਾਰ ਰੇਖੀ ਇਕਾਈ ਵਿੱਚ ਰੱਖੋ।"],
  ["Unit check: matching physical units cancel, so the requested ratio or scale factor is unit-free.", "ਇਕਾਈ ਜਾਂਚ: ਇੱਕੋ ਭੌਤਿਕ ਇਕਾਈਆਂ ਕੱਟ ਜਾਂਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਮੰਗਿਆ ਅਨੁਪਾਤ ਜਾਂ ਮਾਪ-ਗੁਣਕ ਇਕਾਈ-ਰਹਿਤ ਹੁੰਦਾ ਹੈ।"],
  ["Unit check: the dimension multipliers are unit-free, and the final relative change is reported as %.", "ਇਕਾਈ ਜਾਂਚ: ਮਾਪਾਂ ਦੇ ਗੁਣਕ ਇਕਾਈ-ਰਹਿਤ ਹੁੰਦੇ ਹਨ ਅਤੇ ਅੰਤਿਮ ਸਾਪੇਖ ਬਦਲਾਅ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।"],
  ["Unit check: the circular fraction is unit-free, and the final angular measure is reported in degrees.", "ਇਕਾਈ ਜਾਂਚ: ਵ੍ਰਿਤ ਦਾ ਅੰਸ਼ ਇਕਾਈ-ਰਹਿਤ ਹੁੰਦਾ ਹੈ ਅਤੇ ਅੰਤਿਮ ਕੋਣੀ ਮਾਪ ਡਿਗਰੀ ਵਿੱਚ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।"],
  ["Use R² − r² = (R − r)(R + r) before multiplying by π; this is faster and reduces arithmetic errors.", "π ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ R² − r² = (R − r)(R + r) ਵਰਤੋ; ਇਸ ਨਾਲ ਗਣਨਾ ਤੇਜ਼ ਹੁੰਦੀ ਹੈ ਅਤੇ ਅੰਕੀ ਗਲਤੀਆਂ ਘੱਟ ਹੁੰਦੀਆਂ ਹਨ।"],
];

export function prelocalizeMensurationStructuredInstructionSource(text: string, language: MensurationLocalizedLanguage) {
  const pairs = language === "hi" ? HI : PA;
  let out = text;
  for (const [source, target] of pairs) out = out.split(source).join(target);
  return out;
}
