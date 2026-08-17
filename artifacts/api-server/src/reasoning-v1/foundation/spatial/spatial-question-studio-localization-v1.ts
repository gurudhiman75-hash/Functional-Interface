import type {
  SpatialPermanentQlIdV1,
  SpatialStudioExplanationV1,
  SpatialStudioQuestionV1,
} from "./spatial-question-studio-runtime-v1";

export const SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1 =
  "SPA_001_HI_PA_LOCALIZATION_APPROVED_2026_08_16" as const;

export const SPATIAL_QUESTION_STUDIO_LANGUAGES_V1 = ["en", "hi", "pa"] as const;
export type SpatialQuestionStudioLanguageV1 =
  (typeof SPATIAL_QUESTION_STUDIO_LANGUAGES_V1)[number];

type LocalizedText = Readonly<{ name: string; rule: string }>;
type LocalizedQlText = Readonly<{ hi: LocalizedText; pa: LocalizedText }>;

// Student-facing language intentionally uses common exam-prep wording instead of
// formal linguistic/geometry terminology. Geometry and answer authority remain English-canonical.
const QL_TEXT: Record<SpatialPermanentQlIdV1, LocalizedQlText> = {
  "SPA-QL-001": {
    hi: { name: "दर्पण चित्र – सामान्य आकृति", rule: "दर्पण में बायाँ और दायाँ उलटता है। ऊपर और नीचे की जगह वही रहती है।" },
    pa: { name: "ਦਰਪਣ ਚਿੱਤਰ – ਆਮ ਆਕ੍ਰਿਤੀ", rule: "ਦਰਪਣ ਵਿੱਚ ਖੱਬਾ ਅਤੇ ਸੱਜਾ ਉਲਟਦਾ ਹੈ। ਉੱਪਰ ਅਤੇ ਹੇਠਾਂ ਦੀ ਥਾਂ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।" },
  },
  "SPA-QL-002": {
    hi: { name: "दर्पण चित्र – अक्षर या अंक", rule: "दर्पण में अक्षर/अंक का रूप भी उलटता है और पूरे समूह का बायाँ-दायाँ क्रम भी बदलता है।" },
    pa: { name: "ਦਰਪਣ ਚਿੱਤਰ – ਅੱਖਰ ਜਾਂ ਅੰਕ", rule: "ਦਰਪਣ ਵਿੱਚ ਅੱਖਰ/ਅੰਕ ਦਾ ਰੂਪ ਵੀ ਉਲਟਦਾ ਹੈ ਅਤੇ ਪੂਰੇ ਸਮੂਹ ਦਾ ਖੱਬਾ-ਸੱਜਾ ਕ੍ਰਮ ਵੀ ਬਦਲਦਾ ਹੈ।" },
  },
  "SPA-QL-003": {
    hi: { name: "घड़ी का दर्पण चित्र", rule: "घड़ी को केवल चित्र की तरह देखें। दोनों सुइयों को दर्पण में बाएँ-दाएँ उलटें; उनकी लंबाई नहीं बदलती।" },
    pa: { name: "ਘੜੀ ਦਾ ਦਰਪਣ ਚਿੱਤਰ", rule: "ਘੜੀ ਨੂੰ ਸਿਰਫ਼ ਚਿੱਤਰ ਵਾਂਗ ਵੇਖੋ। ਦੋਵੇਂ ਸੂਈਆਂ ਨੂੰ ਦਰਪਣ ਵਿੱਚ ਖੱਬੇ-ਸੱਜੇ ਉਲਟੋ; ਉਨ੍ਹਾਂ ਦੀ ਲੰਬਾਈ ਨਹੀਂ ਬਦਲਦੀ।" },
  },
  "SPA-QL-004": {
    hi: { name: "जल प्रतिबिंब – सामान्य आकृति", rule: "जल प्रतिबिंब में ऊपर और नीचे उलटता है। बायाँ और दायाँ वही रहता है।" },
    pa: { name: "ਜਲ ਪ੍ਰਤੀਬਿੰਬ – ਆਮ ਆਕ੍ਰਿਤੀ", rule: "ਜਲ ਪ੍ਰਤੀਬਿੰਬ ਵਿੱਚ ਉੱਪਰ ਅਤੇ ਹੇਠਾਂ ਉਲਟਦਾ ਹੈ। ਖੱਬਾ ਅਤੇ ਸੱਜਾ ਉਹੀ ਰਹਿੰਦਾ ਹੈ।" },
  },
  "SPA-QL-005": {
    hi: { name: "जल प्रतिबिंब – अक्षर या अंक", rule: "अक्षर/अंक ऊपर-नीचे उलटते हैं, लेकिन पूरे समूह का बायाँ-दायाँ क्रम नहीं बदलता।" },
    pa: { name: "ਜਲ ਪ੍ਰਤੀਬਿੰਬ – ਅੱਖਰ ਜਾਂ ਅੰਕ", rule: "ਅੱਖਰ/ਅੰਕ ਉੱਪਰ-ਹੇਠਾਂ ਉਲਟਦੇ ਹਨ, ਪਰ ਪੂਰੇ ਸਮੂਹ ਦਾ ਖੱਬਾ-ਸੱਜਾ ਕ੍ਰਮ ਨਹੀਂ ਬਦਲਦਾ।" },
  },
  "SPA-QL-006": {
    hi: { name: "पूरी आकृति में एक जैसा बदलाव", rule: "पहली जोड़ी में पूरी आकृति जितनी और जिस दिशा में घुमी या उलटी है, तीसरी आकृति पर भी वही बदलाव करें।" },
    pa: { name: "ਪੂਰੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਬਦਲਾਅ", rule: "ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਪੂਰੀ ਆਕ੍ਰਿਤੀ ਜਿੰਨੀ ਅਤੇ ਜਿਸ ਦਿਸ਼ਾ ਵਿੱਚ ਘੁੰਮੀ ਜਾਂ ਉਲਟੀ ਹੈ, ਤੀਜੀ ਆਕ੍ਰਿਤੀ ’ਤੇ ਵੀ ਉਹੀ ਬਦਲਾਅ ਕਰੋ।" },
  },
  "SPA-QL-007": {
    hi: { name: "अलग हिस्सों में अलग बदलाव", rule: "आकृति के अलग हिस्सों में जो बदलाव हुआ है, उसे उसी हिस्से पर अलग-अलग लागू करें।" },
    pa: { name: "ਵੱਖ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੱਖ ਬਦਲਾਅ", rule: "ਆਕ੍ਰਿਤੀ ਦੇ ਵੱਖ ਹਿੱਸਿਆਂ ਵਿੱਚ ਜੋ ਬਦਲਾਅ ਹੋਇਆ ਹੈ, ਉਸਨੂੰ ਉਸੇ ਹਿੱਸੇ ’ਤੇ ਵੱਖ-ਵੱਖ ਲਾਗੂ ਕਰੋ।" },
  },
  "SPA-QL-008": {
    hi: { name: "हिस्सों की जगह बदलना", rule: "देखें कि हिस्से किस क्रम से जगह बदल रहे हैं। तीसरी आकृति में उसी क्रम की अगली जगह रखें।" },
    pa: { name: "ਹਿੱਸਿਆਂ ਦੀ ਥਾਂ ਬਦਲਣਾ", rule: "ਵੇਖੋ ਕਿ ਹਿੱਸੇ ਕਿਸ ਕ੍ਰਮ ਨਾਲ ਥਾਂ ਬਦਲ ਰਹੇ ਹਨ। ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਉਸੇ ਕ੍ਰਮ ਦੀ ਅਗਲੀ ਥਾਂ ਰੱਖੋ।" },
  },
  "SPA-QL-009": {
    hi: { name: "गिनती में बदलाव", rule: "पहली जोड़ी में रेखाएँ, बिंदु या आकृतियाँ जितनी बढ़ी या घटी हैं, वही बदलाव तीसरी आकृति में करें।" },
    pa: { name: "ਗਿਣਤੀ ਵਿੱਚ ਬਦਲਾਅ", rule: "ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਰੇਖਾਵਾਂ, ਬਿੰਦੂ ਜਾਂ ਆਕ੍ਰਿਤੀਆਂ ਜਿੰਨੀਆਂ ਵਧੀਆਂ ਜਾਂ ਘਟੀਆਂ ਹਨ, ਉਹੀ ਬਦਲਾਅ ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਕਰੋ।" },
  },
  "SPA-QL-010": {
    hi: { name: "एक चिन्ह की जगह दूसरा", rule: "पहली जोड़ी में जिस आकृति या चिन्ह की जगह दूसरा आया है, तीसरी आकृति में भी वही बदलें।" },
    pa: { name: "ਇੱਕ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਦੂਜਾ", rule: "ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਜਿਸ ਆਕ੍ਰਿਤੀ ਜਾਂ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਦੂਜਾ ਆਇਆ ਹੈ, ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਵੀ ਉਹੀ ਬਦਲੋ।" },
  },
  "SPA-QL-011": {
    hi: { name: "अंदर-बाहर या आकार में बदलाव", rule: "देखें कि हिस्सा अंदर से बाहर, बाहर से अंदर, बड़ा या छोटा हुआ है। तीसरी आकृति में वही बदलाव करें।" },
    pa: { name: "ਅੰਦਰ-ਬਾਹਰ ਜਾਂ ਆਕਾਰ ਵਿੱਚ ਬਦਲਾਅ", rule: "ਵੇਖੋ ਕਿ ਹਿੱਸਾ ਅੰਦਰੋਂ ਬਾਹਰ, ਬਾਹਰੋਂ ਅੰਦਰ, ਵੱਡਾ ਜਾਂ ਛੋਟਾ ਹੋਇਆ ਹੈ। ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਉਹੀ ਬਦਲਾਅ ਕਰੋ।" },
  },
  "SPA-QL-012": {
    hi: { name: "भरा या खाली बदलना", rule: "पहली जोड़ी में जो भाग भरा से खाली या खाली से भरा हुआ है, तीसरी आकृति में भी वही करें।" },
    pa: { name: "ਭਰਿਆ ਜਾਂ ਖਾਲੀ ਬਦਲਣਾ", rule: "ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਜੋ ਹਿੱਸਾ ਭਰਿਆ ਤੋਂ ਖਾਲੀ ਜਾਂ ਖਾਲੀ ਤੋਂ ਭਰਿਆ ਹੋਇਆ ਹੈ, ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਵੀ ਉਹੀ ਕਰੋ।" },
  },
  "SPA-QL-013": {
    hi: { name: "एक से ज्यादा बदलाव", rule: "पहली जोड़ी में दो या अधिक बदलाव साथ हुए हैं। तीसरी आकृति में सभी बदलाव उसी क्रम से करें।" },
    pa: { name: "ਇੱਕ ਤੋਂ ਵੱਧ ਬਦਲਾਅ", rule: "ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਦੋ ਜਾਂ ਵੱਧ ਬਦਲਾਅ ਇਕੱਠੇ ਹੋਏ ਹਨ। ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਸਾਰੇ ਬਦਲਾਅ ਉਸੇ ਕ੍ਰਮ ਨਾਲ ਕਰੋ।" },
  },
  "SPA-QL-014": {
    hi: { name: "घुमाव या प्रतिबिंब में अलग आकृति", rule: "तीन विकल्प एक ही तरह के घुमाव या प्रतिबिंब से जुड़े हैं। जो उस नियम में फिट नहीं होता, वही उत्तर है।" },
    pa: { name: "ਘੁੰਮਾਅ ਜਾਂ ਪ੍ਰਤੀਬਿੰਬ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਤਿੰਨ ਵਿਕਲਪ ਇੱਕੋ ਕਿਸਮ ਦੇ ਘੁੰਮਾਅ ਜਾਂ ਪ੍ਰਤੀਬਿੰਬ ਨਾਲ ਜੁੜੇ ਹਨ। ਜੋ ਉਸ ਨਿਯਮ ਵਿੱਚ ਫਿੱਟ ਨਹੀਂ ਹੁੰਦਾ, ਉਹੀ ਉੱਤਰ ਹੈ।" },
  },
  "SPA-QL-015": {
    hi: { name: "सममिति में अलग आकृति", rule: "देखें किस दिशा में आकृति बराबर दो हिस्सों जैसी दिखती है। तीन में एक जैसा गुण होगा और एक अलग होगा।" },
    pa: { name: "ਸਮਮਿਤੀ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਵੇਖੋ ਕਿਸ ਦਿਸ਼ਾ ਵਿੱਚ ਆਕ੍ਰਿਤੀ ਬਰਾਬਰ ਦੋ ਹਿੱਸਿਆਂ ਵਰਗੀ ਦਿਖਦੀ ਹੈ। ਤਿੰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਗੁਣ ਹੋਵੇਗਾ ਅਤੇ ਇੱਕ ਵੱਖ ਹੋਵੇਗਾ।" },
  },
  "SPA-QL-016": {
    hi: { name: "खुली-बंद या आकार में अलग आकृति", rule: "देखें आकृति खुली है या बंद, सीधी रेखाओं से बनी है या वक्र है। तीन एक जैसे नियम में होंगे।" },
    pa: { name: "ਖੁੱਲ੍ਹੀ-ਬੰਦ ਜਾਂ ਆਕਾਰ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਵੇਖੋ ਆਕ੍ਰਿਤੀ ਖੁੱਲ੍ਹੀ ਹੈ ਜਾਂ ਬੰਦ, ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਨਾਲ ਬਣੀ ਹੈ ਜਾਂ ਵਕਰ ਹੈ। ਤਿੰਨ ਇੱਕੋ ਨਿਯਮ ਵਿੱਚ ਹੋਣਗੇ।" },
  },
  "SPA-QL-017": {
    hi: { name: "गिनती के नियम में अलग आकृति", rule: "हर विकल्प में रेखाएँ, बिंदु या छोटे भाग गिनें। तीन में एक जैसा गिनती का नियम होगा।" },
    pa: { name: "ਗਿਣਤੀ ਦੇ ਨਿਯਮ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਰੇਖਾਵਾਂ, ਬਿੰਦੂ ਜਾਂ ਛੋਟੇ ਹਿੱਸੇ ਗਿਣੋ। ਤਿੰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਗਿਣਤੀ ਦਾ ਨਿਯਮ ਹੋਵੇਗਾ।" },
  },
  "SPA-QL-018": {
    hi: { name: "अंदर-बाहर और आकार में अलग आकृति", rule: "अंदर और बाहर की आकृतियों का प्रकार और उनका आकार देखें। तीन विकल्पों में वही संबंध होगा।" },
    pa: { name: "ਅੰਦਰ-ਬਾਹਰ ਅਤੇ ਆਕਾਰ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਅੰਦਰਲੀ ਅਤੇ ਬਾਹਰਲੀ ਆਕ੍ਰਿਤੀ ਦੀ ਕਿਸਮ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਆਕਾਰ ਵੇਖੋ। ਤਿੰਨ ਵਿਕਲਪਾਂ ਵਿੱਚ ਉਹੀ ਸੰਬੰਧ ਹੋਵੇਗਾ।" },
  },
  "SPA-QL-019": {
    hi: { name: "जगह या दिशा में अलग आकृति", rule: "देखें हिस्से एक-दूसरे के मुकाबले कहाँ हैं और किस दिशा में हैं। तीन विकल्पों में वही संबंध होगा।" },
    pa: { name: "ਥਾਂ ਜਾਂ ਦਿਸ਼ਾ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਵੇਖੋ ਹਿੱਸੇ ਇੱਕ-ਦੂਜੇ ਦੇ ਮੁਕਾਬਲੇ ਕਿੱਥੇ ਹਨ ਅਤੇ ਕਿਸ ਦਿਸ਼ਾ ਵਿੱਚ ਹਨ। ਤਿੰਨ ਵਿਕਲਪਾਂ ਵਿੱਚ ਉਹੀ ਸੰਬੰਧ ਹੋਵੇਗਾ।" },
  },
  "SPA-QL-020": {
    hi: { name: "रेखाओं के जुड़ने में अलग आकृति", rule: "देखें रेखाएँ कहाँ जुड़ती हैं, कहाँ शाखा बनती है और कहाँ एक-दूसरे को काटती हैं। तीन विकल्प एक जैसे होंगे।" },
    pa: { name: "ਰੇਖਾਵਾਂ ਦੇ ਜੁੜਨ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਵੇਖੋ ਰੇਖਾਵਾਂ ਕਿੱਥੇ ਜੁੜਦੀਆਂ ਹਨ, ਕਿੱਥੇ ਸ਼ਾਖਾ ਬਣਦੀ ਹੈ ਅਤੇ ਕਿੱਥੇ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਕੱਟਦੀਆਂ ਹਨ। ਤਿੰਨ ਵਿਕਲਪ ਇੱਕੋ ਜਿਹੇ ਹੋਣਗੇ।" },
  },
  "SPA-QL-021": {
    hi: { name: "भराव या छायांकन में अलग आकृति", rule: "भरे, खाली या छायांकित हिस्सों की जगह और संख्या देखें। तीन विकल्प एक ही पैटर्न मानेंगे।" },
    pa: { name: "ਭਰਾਵ ਜਾਂ ਛਾਇਆ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਭਰੇ, ਖਾਲੀ ਜਾਂ ਛਾਇਆ ਵਾਲੇ ਹਿੱਸਿਆਂ ਦੀ ਥਾਂ ਅਤੇ ਗਿਣਤੀ ਵੇਖੋ। ਤਿੰਨ ਵਿਕਲਪ ਇੱਕੋ ਪੈਟਰਨ ਮੰਨਣਗੇ।" },
  },
  "SPA-QL-022": {
    hi: { name: "दर्पण, जल या घुमाव संबंध में अलग आकृति", rule: "हर विकल्प के अंदर दो हिस्सों का संबंध देखें। तीन में एक जैसा दर्पण, जल-प्रतिबिंब या घुमाव संबंध होगा।" },
    pa: { name: "ਦਰਪਣ, ਜਲ ਜਾਂ ਘੁੰਮਾਅ ਸੰਬੰਧ ਵਿੱਚ ਵੱਖ ਆਕ੍ਰਿਤੀ", rule: "ਹਰ ਵਿਕਲਪ ਦੇ ਅੰਦਰ ਦੋ ਹਿੱਸਿਆਂ ਦਾ ਸੰਬੰਧ ਵੇਖੋ। ਤਿੰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਦਰਪਣ, ਜਲ-ਪ੍ਰਤੀਬਿੰਬ ਜਾਂ ਘੁੰਮਾਅ ਸੰਬੰਧ ਹੋਵੇਗਾ।" },
  },
  "SPA-QL-023": {
    hi: { name: "पूरी आकृति बदलने वाली श्रेणी", rule: "हर चित्र में पूरी आकृति जिस तरह घूम या उलट रही है, उसी बदलाव को अगले चित्र में जारी रखें।" },
    pa: { name: "ਪੂਰੀ ਆਕ੍ਰਿਤੀ ਬਦਲਣ ਵਾਲੀ ਲੜੀ", rule: "ਹਰ ਚਿੱਤਰ ਵਿੱਚ ਪੂਰੀ ਆਕ੍ਰਿਤੀ ਜਿਸ ਤਰ੍ਹਾਂ ਘੁੰਮ ਜਾਂ ਉਲਟ ਰਹੀ ਹੈ, ਉਸੇ ਬਦਲਾਅ ਨੂੰ ਅਗਲੇ ਚਿੱਤਰ ਵਿੱਚ ਜਾਰੀ ਰੱਖੋ।" },
  },
  "SPA-QL-024": {
    hi: { name: "अलग हिस्से बदलने वाली श्रेणी", rule: "आकृति के अलग हिस्से अलग नियम से बदल रहे हैं। हर हिस्से को अलग देखकर अगला चित्र बनाएं।" },
    pa: { name: "ਵੱਖ ਹਿੱਸੇ ਬਦਲਣ ਵਾਲੀ ਲੜੀ", rule: "ਆਕ੍ਰਿਤੀ ਦੇ ਵੱਖ ਹਿੱਸੇ ਵੱਖ ਨਿਯਮ ਨਾਲ ਬਦਲ ਰਹੇ ਹਨ। ਹਰ ਹਿੱਸੇ ਨੂੰ ਵੱਖ ਵੇਖ ਕੇ ਅਗਲਾ ਚਿੱਤਰ ਬਣਾਓ।" },
  },
  "SPA-QL-025": {
    hi: { name: "जगह बदलने वाली श्रेणी", rule: "चिन्ह या हिस्सा जिस क्रम से एक जगह से दूसरी जगह जा रहा है, उसी क्रम की अगली जगह चुनें।" },
    pa: { name: "ਥਾਂ ਬਦਲਣ ਵਾਲੀ ਲੜੀ", rule: "ਚਿੰਨ੍ਹ ਜਾਂ ਹਿੱਸਾ ਜਿਸ ਕ੍ਰਮ ਨਾਲ ਇੱਕ ਥਾਂ ਤੋਂ ਦੂਜੀ ਥਾਂ ਜਾ ਰਿਹਾ ਹੈ, ਉਸੇ ਕ੍ਰਮ ਦੀ ਅਗਲੀ ਥਾਂ ਚੁਣੋ।" },
  },
  "SPA-QL-026": {
    hi: { name: "गिनती बढ़ने या घटने वाली श्रेणी", rule: "हर चित्र में कितने हिस्से जुड़ या हट रहे हैं, यह देखें और वही गिनती आगे बढ़ाएँ।" },
    pa: { name: "ਗਿਣਤੀ ਵਧਣ ਜਾਂ ਘਟਣ ਵਾਲੀ ਲੜੀ", rule: "ਹਰ ਚਿੱਤਰ ਵਿੱਚ ਕਿੰਨੇ ਹਿੱਸੇ ਜੁੜ ਜਾਂ ਹਟ ਰਹੇ ਹਨ, ਇਹ ਵੇਖੋ ਅਤੇ ਉਹੀ ਗਿਣਤੀ ਅੱਗੇ ਵਧਾਓ।" },
  },
  "SPA-QL-027": {
    hi: { name: "भरा-खाली बदलने वाली श्रेणी", rule: "भरे और खाली हिस्से किस क्रम से बदल रहे हैं, वही क्रम अगले चित्र में जारी रखें।" },
    pa: { name: "ਭਰਿਆ-ਖਾਲੀ ਬਦਲਣ ਵਾਲੀ ਲੜੀ", rule: "ਭਰੇ ਅਤੇ ਖਾਲੀ ਹਿੱਸੇ ਕਿਸ ਕ੍ਰਮ ਨਾਲ ਬਦਲ ਰਹੇ ਹਨ, ਉਹੀ ਕ੍ਰਮ ਅਗਲੇ ਚਿੱਤਰ ਵਿੱਚ ਜਾਰੀ ਰੱਖੋ।" },
  },
  "SPA-QL-028": {
    hi: { name: "चिन्ह बदलने वाली श्रेणी", rule: "हर चरण में कौन-सा चिन्ह या आकृति दूसरे से बदल रही है, उसका क्रम पहचानें और अगला चिन्ह चुनें।" },
    pa: { name: "ਚਿੰਨ੍ਹ ਬਦਲਣ ਵਾਲੀ ਲੜੀ", rule: "ਹਰ ਪੜਾਅ ਵਿੱਚ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਜਾਂ ਆਕ੍ਰਿਤੀ ਦੂਜੇ ਨਾਲ ਬਦਲ ਰਹੀ ਹੈ, ਉਸਦਾ ਕ੍ਰਮ ਪਛਾਣੋ ਅਤੇ ਅਗਲਾ ਚਿੰਨ੍ਹ ਚੁਣੋ।" },
  },
  "SPA-QL-029": {
    hi: { name: "दो नियम बारी-बारी वाली श्रेणी", rule: "दो अलग बदलाव बारी-बारी से हो रहे हैं। पहले हर दूसरे चित्र को देखकर दोनों नियम अलग-अलग पहचानें।" },
    pa: { name: "ਦੋ ਨਿਯਮ ਵਾਰੀ-ਵਾਰੀ ਵਾਲੀ ਲੜੀ", rule: "ਦੋ ਵੱਖ ਬਦਲਾਅ ਵਾਰੀ-ਵਾਰੀ ਹੋ ਰਹੇ ਹਨ। ਪਹਿਲਾਂ ਹਰ ਦੂਜੇ ਚਿੱਤਰ ਨੂੰ ਵੇਖ ਕੇ ਦੋਵੇਂ ਨਿਯਮ ਵੱਖ-ਵੱਖ ਪਛਾਣੋ।" },
  },
  "SPA-QL-030": {
    hi: { name: "एक से ज्यादा नियम वाली श्रेणी", rule: "एक ही समय में दिशा, जगह, गिनती या भराव में एक से ज्यादा बदलाव हो सकते हैं। हर बदलाव को अलग देखकर अगला चित्र चुनें।" },
    pa: { name: "ਇੱਕ ਤੋਂ ਵੱਧ ਨਿਯਮਾਂ ਵਾਲੀ ਲੜੀ", rule: "ਇੱਕੋ ਸਮੇਂ ਦਿਸ਼ਾ, ਥਾਂ, ਗਿਣਤੀ ਜਾਂ ਭਰਾਵ ਵਿੱਚ ਇੱਕ ਤੋਂ ਵੱਧ ਬਦਲਾਅ ਹੋ ਸਕਦੇ ਹਨ। ਹਰ ਬਦਲਾਅ ਨੂੰ ਵੱਖ ਵੇਖ ਕੇ ਅਗਲਾ ਚਿੱਤਰ ਚੁਣੋ।" },
  },
};

function localizedStem(qlId: SpatialPermanentQlIdV1, language: "hi" | "pa"): string {
  const hi = language === "hi";
  if (qlId >= "SPA-QL-001" && qlId <= "SPA-QL-003") {
    return hi ? "दिए गए चित्र का सही दर्पण चित्र चुनिए।" : "ਦਿੱਤੇ ਚਿੱਤਰ ਦਾ ਸਹੀ ਦਰਪਣ ਚਿੱਤਰ ਚੁਣੋ।";
  }
  if (qlId === "SPA-QL-004" || qlId === "SPA-QL-005") {
    return hi ? "दिए गए चित्र का सही जल प्रतिबिंब चुनिए।" : "ਦਿੱਤੇ ਚਿੱਤਰ ਦਾ ਸਹੀ ਜਲ ਪ੍ਰਤੀਬਿੰਬ ਚੁਣੋ।";
  }
  if (qlId >= "SPA-QL-006" && qlId <= "SPA-QL-013") {
    return hi ? "पहली जोड़ी का नियम देखकर दूसरी जोड़ी पूरी करने वाला चित्र चुनिए।" : "ਪਹਿਲੀ ਜੋੜੀ ਦਾ ਨਿਯਮ ਵੇਖ ਕੇ ਦੂਜੀ ਜੋੜੀ ਪੂਰੀ ਕਰਨ ਵਾਲਾ ਚਿੱਤਰ ਚੁਣੋ।";
  }
  if (qlId >= "SPA-QL-014" && qlId <= "SPA-QL-022") {
    return hi ? "चार विकल्पों में जो आकृति बाकी तीन से अलग है, उसे चुनिए।" : "ਚਾਰ ਵਿਕਲਪਾਂ ਵਿੱਚ ਜੋ ਆਕ੍ਰਿਤੀ ਬਾਕੀ ਤਿੰਨਾਂ ਤੋਂ ਵੱਖ ਹੈ, ਉਹ ਚੁਣੋ।";
  }
  return hi ? "चित्रों का क्रम देखकर अगला सही चित्र चुनिए।" : "ਚਿੱਤਰਾਂ ਦਾ ਕ੍ਰਮ ਵੇਖ ਕੇ ਅਗਲਾ ਸਹੀ ਚਿੱਤਰ ਚੁਣੋ।";
}

function localizedObservation(qlId: SpatialPermanentQlIdV1, language: "hi" | "pa"): string {
  if (language === "hi") {
    if (qlId <= "SPA-QL-005") return "पहले देखें कि कौन-सी दिशा बदलनी है और कौन-सी जगह वैसी ही रहनी है।";
    if (qlId <= "SPA-QL-013") return "पहली जोड़ी में क्या बदला है—दिशा, जगह, गिनती, आकार या भराव—इसे पहचानें।";
    if (qlId <= "SPA-QL-022") return "चारों विकल्पों में एक ही मुख्य गुण देखें। तीन एक जैसे नियम पर होंगे और एक अलग होगा।";
    return "एक चित्र से अगले चित्र तक क्या बदल रहा है, इसे लगातार दो-तीन चरणों में देखें।";
  }
  if (qlId <= "SPA-QL-005") return "ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਕਿਹੜੀ ਦਿਸ਼ਾ ਬਦਲਣੀ ਹੈ ਅਤੇ ਕਿਹੜੀ ਥਾਂ ਉਹੀ ਰਹਿਣੀ ਹੈ।";
  if (qlId <= "SPA-QL-013") return "ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਕੀ ਬਦਲਿਆ ਹੈ—ਦਿਸ਼ਾ, ਥਾਂ, ਗਿਣਤੀ, ਆਕਾਰ ਜਾਂ ਭਰਾਵ—ਇਹ ਪਛਾਣੋ।";
  if (qlId <= "SPA-QL-022") return "ਚਾਰੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਇੱਕੋ ਮੁੱਖ ਗੁਣ ਵੇਖੋ। ਤਿੰਨ ਇੱਕੋ ਨਿਯਮ ’ਤੇ ਹੋਣਗੇ ਅਤੇ ਇੱਕ ਵੱਖ ਹੋਵੇਗਾ।";
  return "ਇੱਕ ਚਿੱਤਰ ਤੋਂ ਅਗਲੇ ਚਿੱਤਰ ਤੱਕ ਕੀ ਬਦਲ ਰਿਹਾ ਹੈ, ਇਹ ਲਗਾਤਾਰ ਦੋ-ਤਿੰਨ ਪੜਾਅ ਵਿੱਚ ਵੇਖੋ।";
}

function localizedApplication(
  chapterCode: SpatialStudioQuestionV1["chapterCode"],
  answer: SpatialStudioQuestionV1["answer"],
  language: "hi" | "pa",
): string {
  if (language === "hi") {
    if (chapterCode === "MIR-001") return `चित्र को बाएँ-दाएँ दर्पण की तरह उलटें। पूरा मिलान विकल्प ${answer} में है।`;
    if (chapterCode === "WAT-001") return `चित्र को ऊपर-नीचे उलटें और बायाँ-दायाँ वैसा ही रखें। सही मिलान विकल्प ${answer} में है।`;
    if (chapterCode === "FAN-001") return `A से B में जो बदलाव हुआ है, वही C पर करें। सही परिणाम विकल्प ${answer} है।`;
    if (chapterCode === "FCL-001") return `तीन विकल्प एक ही नियम मानते हैं। विकल्प ${answer} उस नियम से अलग है, इसलिए वही उत्तर है।`;
    return `यही बदलाव अगले चित्र पर भी करें। सही अगला चित्र विकल्प ${answer} है।`;
  }
  if (chapterCode === "MIR-001") return `ਚਿੱਤਰ ਨੂੰ ਖੱਬੇ-ਸੱਜੇ ਦਰਪਣ ਵਾਂਗ ਉਲਟੋ। ਪੂਰਾ ਮਿਲਾਨ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
  if (chapterCode === "WAT-001") return `ਚਿੱਤਰ ਨੂੰ ਉੱਪਰ-ਹੇਠਾਂ ਉਲਟੋ ਅਤੇ ਖੱਬਾ-ਸੱਜਾ ਉਹੀ ਰੱਖੋ। ਸਹੀ ਮਿਲਾਨ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
  if (chapterCode === "FAN-001") return `A ਤੋਂ B ਵਿੱਚ ਜੋ ਬਦਲਾਅ ਹੋਇਆ ਹੈ, ਉਹੀ C ’ਤੇ ਕਰੋ। ਸਹੀ ਨਤੀਜਾ ਵਿਕਲਪ ${answer} ਹੈ।`;
  if (chapterCode === "FCL-001") return `ਤਿੰਨ ਵਿਕਲਪ ਇੱਕੋ ਨਿਯਮ ਮੰਨਦੇ ਹਨ। ਵਿਕਲਪ ${answer} ਉਸ ਨਿਯਮ ਤੋਂ ਵੱਖ ਹੈ, ਇਸ ਲਈ ਉਹੀ ਉੱਤਰ ਹੈ।`;
  return `ਇਹੀ ਬਦਲਾਅ ਅਗਲੇ ਚਿੱਤਰ ’ਤੇ ਵੀ ਕਰੋ। ਸਹੀ ਅਗਲਾ ਚਿੱਤਰ ਵਿਕਲਪ ${answer} ਹੈ।`;
}

function localizedCheck(
  chapterCode: SpatialStudioQuestionV1["chapterCode"],
  answer: SpatialStudioQuestionV1["answer"],
  language: "hi" | "pa",
): string {
  if (language === "hi") {
    return chapterCode === "FCL-001"
      ? `अंत में बाकी तीन विकल्पों का साझा नियम दोबारा देखें। केवल विकल्प ${answer} उससे अलग होना चाहिए।`
      : `अंत में दिशा, जगह, गिनती और भराव दोबारा देखें। विकल्प ${answer} में सभी जरूरी बातें सही हैं।`;
  }
  return chapterCode === "FCL-001"
    ? `ਅੰਤ ਵਿੱਚ ਬਾਕੀ ਤਿੰਨ ਵਿਕਲਪਾਂ ਦਾ ਸਾਂਝਾ ਨਿਯਮ ਫਿਰ ਵੇਖੋ। ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਉਸ ਤੋਂ ਵੱਖ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`
    : `ਅੰਤ ਵਿੱਚ ਦਿਸ਼ਾ, ਥਾਂ, ਗਿਣਤੀ ਅਤੇ ਭਰਾਵ ਫਿਰ ਵੇਖੋ। ਵਿਕਲਪ ${answer} ਵਿੱਚ ਸਾਰੀਆਂ ਲੋੜੀਂਦੀਆਂ ਗੱਲਾਂ ਸਹੀ ਹਨ।`;
}

export type SpatialLocalizedStudioQuestionV1 = Omit<
  SpatialStudioQuestionV1,
  "language" | "locale" | "qlName" | "stem" | "explanation" | "questionId" | "questionLanguageId"
> & {
  language: SpatialQuestionStudioLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  qlName: string;
  stem: string;
  explanation: SpatialStudioExplanationV1;
  questionId: string;
  questionLanguageId: string;
  localization: {
    authority: typeof SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1;
    canonicalLanguage: "en";
    targetLanguage: SpatialQuestionStudioLanguageV1;
    semanticParity: "GEOMETRY_AND_ANSWER_EXACT";
    learnerFieldsLocalized: readonly ["qlName", "stem", "explanation"];
  };
};

export function localizeSpatialStudioQuestionV1(
  question: SpatialStudioQuestionV1,
  language: SpatialQuestionStudioLanguageV1,
): SpatialLocalizedStudioQuestionV1 {
  if (language === "en") {
    return {
      ...question,
      localization: {
        authority: SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
        canonicalLanguage: "en",
        targetLanguage: "en",
        semanticParity: "GEOMETRY_AND_ANSWER_EXACT",
        learnerFieldsLocalized: ["qlName", "stem", "explanation"],
      },
    };
  }

  const pack = QL_TEXT[question.qlId][language];
  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  return {
    ...question,
    language,
    locale,
    qlName: pack.name,
    stem: localizedStem(question.qlId, language),
    explanation: {
      observation: localizedObservation(question.qlId, language),
      rule: pack.rule,
      application: localizedApplication(question.chapterCode, question.answer, language),
      check: localizedCheck(question.chapterCode, question.answer, language),
    },
    questionId: `${question.canonicalItemId}:${language}:question-studio`,
    questionLanguageId: `${question.canonicalItemId}:${language.toUpperCase()}`,
    localization: {
      authority: SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
      canonicalLanguage: "en",
      targetLanguage: language,
      semanticParity: "GEOMETRY_AND_ANSWER_EXACT",
      learnerFieldsLocalized: ["qlName", "stem", "explanation"],
    },
  };
}

export function spatialLocalizationParityProjectionV1(
  question: SpatialStudioQuestionV1 | SpatialLocalizedStudioQuestionV1,
) {
  return {
    packageId: question.packageId,
    qlId: question.qlId,
    proposalId: question.proposalId,
    chapterCode: question.chapterCode,
    difficultyBand: question.difficultyBand,
    seed: question.seed,
    generationSeed: question.generationSeed,
    mode: question.mode,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    optionLabels: question.optionLabels,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalItemId: question.canonicalItemId,
    contentFingerprint: question.contentFingerprint,
    renderer: question.renderer,
    validation: question.validation,
  };
}
