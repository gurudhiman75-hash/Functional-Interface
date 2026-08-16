import {
  generateSpatialStudioBatchV1,
  generateSpatialStudioQuestionV1,
  type SpatialPermanentQlIdV1,
  type SpatialStudioBatchRequestV1,
} from "./spatial-question-studio-runtime-v1";
import {
  localizeSpatialStudioQuestionV1,
  type SpatialLocalizedStudioQuestionV1,
  type SpatialQuestionStudioLanguageV1,
} from "./spatial-question-studio-localization-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "./spatial-question-studio-integration-v1";

export type SpatialProductionStudioQuestionV1 = Omit<
  SpatialLocalizedStudioQuestionV1,
  "lifecycle"
> & {
  lifecycle: {
    questionStudioDiscoverable: true;
    registrationStatus: "REGISTERED";
    persistenceAllowed: true;
    questionBankStatus: "READY_FOR_STORAGE";
    testEligibility: "ELIGIBLE";
    testEligible: true;
    publiclyPublishable: true;
    mockTestEligible: true;
    manualApprovalRequired: true;
    automaticStudentPublication: false;
    releaseAuthority: typeof SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority;
  };
};

export type SpatialProductionStudioBatchRequestV1 = SpatialStudioBatchRequestV1 & {
  language?: SpatialQuestionStudioLanguageV1;
};

const HINDI_MODE_DETAIL: Record<string, string> = {
  GENERAL_COMPOSITION: "दिए गए चित्र के हर छोटे घटक की स्थिति और दिशा को उसी प्रतिबिंब नियम से बदलें",
  LATIN_GLYPH_STRING: "अक्षर-समूह में हर अक्षर का रूप और पूरे समूह का आवश्यक क्रम साथ में बदलें",
  WESTERN_ARABIC_DIGIT_STRING: "अंक-समूह में हर अंक का रूप और पूरे समूह का आवश्यक क्रम साथ में बदलें",
  ANALOG_CLOCK_GEOMETRY: "घड़ी की घंटे और मिनट की दोनों सुइयों को केंद्र के आर-पार दर्पण-अक्ष पर अलग-अलग प्रतिबिंबित करें",
  "FAN-GAP-01": "बाहरी और भीतरी घटकों के स्वतंत्र घुमाव/उलटाव को अलग-अलग पहचानकर तीसरी आकृति पर लागू करें",
  "FAN-GAP-02": "घटकों के स्थानों का चक्रीय क्रम पहचानकर उसी क्रम का अगला स्थान तीसरी आकृति में रखें",
  "FAN-GAP-03": "पहली जोड़ी में आकार जितना बढ़ा या घटा है, तीसरी आकृति के संबंधित भाग पर वही आकार-परिवर्तन करें",
  "FAN-GAP-04": "भीतर-बाहर या ऊपरी-निचले स्तर का जो स्थानांतरण पहली जोड़ी में हुआ है, वही तीसरी आकृति में दोहराएँ",
  "FAN-GAP-05": "दिशा, भराव और संख्या जैसे एक से अधिक बदलावों को उसी क्रम में एक साथ लागू करें",
  ADD_SEGMENT: "पहली जोड़ी की तरह आवश्यक रेखाखंड जोड़ें और बाकी संरचना अपरिवर्तित रखें",
  REMOVE_SEGMENT: "पहली जोड़ी की तरह आवश्यक रेखाखंड हटाएँ और बाकी संरचना अपरिवर्तित रखें",
  SUBSTITUTE_INNER_NEXT: "भीतरी आकृति को उसी प्रतिस्थापन क्रम में अगली आकृति से बदलें",
  TOGGLE_INNER_SHADING: "भीतरी भाग की भरी/खाली अवस्था को पहली जोड़ी की तरह उलटें",
  "FCL-GAP-01": "चारों विकल्पों में घुमाव या रूपांतरण-समानता जाँचें और उस विकल्प को अलग करें जो समान रूपांतरण से नहीं बनता",
  "FCL-GAP-02": "हर विकल्प के तत्व गिनकर समान संख्या-संबंध वाले तीन विकल्प पहचानें",
  "FCL-GAP-03": "भीतरी-बाहरी प्रतिरूप और उनके सापेक्ष आकार को साथ में जाँचें",
  "FCL-GAP-04": "घटकों की समान, विपरीत, तिरछी या अंदर/बाहर की सापेक्ष दिशा को तुलना का आधार बनाएँ",
  "FCL-GAP-05": "छायांकित भाग की स्थिति, मात्रा या बारी-बारी के क्रम को चारों विकल्पों में तुलना करें",
  "FCL-GAP-06": "हर विकल्प की उप-आकृतियों के बीच दर्पण, जल-प्रतिबिंब या घुमाव संबंध को जाँचें",
  VERTICAL_SYMMETRY: "हर विकल्प को ऊर्ध्वाधर सममिति-अक्ष पर जाँचें",
  HORIZONTAL_SYMMETRY: "हर विकल्प को क्षैतिज सममिति-अक्ष पर जाँचें",
  HALF_TURN_SYMMETRY: "हर विकल्प को 180° घुमाने पर वही रूप लौटता है या नहीं, यह जाँचें",
  QUARTER_TURN_SYMMETRY: "हर विकल्प को 90° घुमाने पर वही रूप लौटता है या नहीं, यह जाँचें",
  CLOSED_VS_OPEN: "चारों विकल्पों में रेखा बंद आकृति बनाती है या खुली रहती है, यह जाँचें",
  POLYGON_VS_CURVED: "सीधी भुजाओं वाली बहुभुजी आकृतियों और वक्र आकृति के अंतर को जाँचें",
  EVEN_SIDED_POLYGON: "हर बहुभुज की भुजाएँ गिनकर सम भुजा-संख्या वाले तीन विकल्प पहचानें",
  HAS_BRANCH_JUNCTION: "रेखाओं में वास्तविक शाखा-जोड़ कहाँ बनता है, यह चारों विकल्पों में जाँचें",
  HAS_TRUE_CROSSING: "रेखाएँ केवल जुड़ती हैं या सच में एक-दूसरे को काटती हैं, यह चारों विकल्पों में जाँचें",
  TWO_FREE_TERMINALS: "हर आकृति में खुले स्वतंत्र सिरों की संख्या गिनें और दो खुले सिरों वाला साझा गुण पहचानें",
  PARTITIONED_FIGURE: "आकृति के अंदर बने विभाजनों और क्षेत्रों की संरचना की तुलना करें",
  "FSR-GAP-01": "हर फ्रेम में हो रहे प्रतिबिंब या उलटाव को उसी क्रम में अगले फ्रेम तक बढ़ाएँ",
  "FSR-GAP-02": "अलग-अलग घटकों के स्वतंत्र घुमाव को अलग ट्रैक करके अगला संयुक्त रूप बनाएँ",
  "FSR-GAP-03": "चलते घटक के स्थानों का चक्र पहचानकर अगला स्थान उसी चक्र से चुनें",
  "FSR-GAP-04": "तत्वों की नियमित जोड़/हटाव और संख्या-परिवर्तन को अगले फ्रेम तक जारी रखें",
  "FSR-GAP-05": "भरे और खाली भागों की बदलती अवस्था को उसी क्रम में अगले फ्रेम तक बढ़ाएँ",
  "FSR-GAP-06": "जिस तत्व को हर चरण में अगले प्रतीक/आकृति से बदला जा रहा है, उसी प्रतिस्थापन क्रम को जारी रखें",
  "FSR-GAP-07": "घटकों के पुनःक्रम या स्थान-बदलाव का चक्र पहचानकर अगली व्यवस्था बनाएँ",
  "FSR-GAP-08": "बारी-बारी से चल रही दो क्रियाओं को अलग ट्रैक करके अगली सही क्रिया लागू करें",
  ROTATE_90_CW_MOVE_MARKER_CCW: "मुख्य आकृति के 90° घुमाव और चिह्न के विपरीत दिशा वाले स्थान-बदलाव को एक साथ अगले चरण में करें",
  ROTATE_90_CCW_MOVE_DOTS_CW: "मुख्य आकृति के 90° घुमाव और बिंदुओं के विपरीत दिशा वाले स्थान-बदलाव को एक साथ अगले चरण में करें",
};

const PUNJABI_MODE_DETAIL: Record<string, string> = {
  GENERAL_COMPOSITION: "ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਦੇ ਹਰ ਛੋਟੇ ਘਟਕ ਦੀ ਸਥਿਤੀ ਅਤੇ ਦਿਸ਼ਾ ਨੂੰ ਉਸੇ ਪ੍ਰਤੀਬਿੰਬ ਨਿਯਮ ਨਾਲ ਬਦਲੋ",
  LATIN_GLYPH_STRING: "ਅੱਖਰ-ਸਮੂਹ ਵਿੱਚ ਹਰ ਅੱਖਰ ਦਾ ਰੂਪ ਅਤੇ ਪੂਰੇ ਸਮੂਹ ਦਾ ਲੋੜੀਂਦਾ ਕ੍ਰਮ ਇਕੱਠੇ ਬਦਲੋ",
  WESTERN_ARABIC_DIGIT_STRING: "ਅੰਕ-ਸਮੂਹ ਵਿੱਚ ਹਰ ਅੰਕ ਦਾ ਰੂਪ ਅਤੇ ਪੂਰੇ ਸਮੂਹ ਦਾ ਲੋੜੀਂਦਾ ਕ੍ਰਮ ਇਕੱਠੇ ਬਦਲੋ",
  ANALOG_CLOCK_GEOMETRY: "ਘੜੀ ਦੀ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਦੀਆਂ ਦੋਵੇਂ ਸੂਈਆਂ ਨੂੰ ਕੇਂਦਰ ਦੇ ਆਰ-ਪਾਰ ਦਰਪਣ-ਅੱਖ ’ਤੇ ਵੱਖ-ਵੱਖ ਪ੍ਰਤੀਬਿੰਬਿਤ ਕਰੋ",
  "FAN-GAP-01": "ਬਾਹਰੀ ਅਤੇ ਅੰਦਰੂਨੀ ਘਟਕਾਂ ਦੇ ਸਵਤੰਤਰ ਘੁੰਮਾਅ/ਉਲਟਾਅ ਨੂੰ ਵੱਖ-ਵੱਖ ਪਛਾਣ ਕੇ ਤੀਜੀ ਆਕ੍ਰਿਤੀ ’ਤੇ ਲਾਗੂ ਕਰੋ",
  "FAN-GAP-02": "ਘਟਕਾਂ ਦੇ ਸਥਾਨਾਂ ਦਾ ਚੱਕਰੀ ਕ੍ਰਮ ਪਛਾਣ ਕੇ ਉਸੇ ਕ੍ਰਮ ਦਾ ਅਗਲਾ ਸਥਾਨ ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਰੱਖੋ",
  "FAN-GAP-03": "ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਆਕਾਰ ਜਿੰਨਾ ਵਧਿਆ ਜਾਂ ਘਟਿਆ ਹੈ, ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਦੇ ਸੰਬੰਧਿਤ ਭਾਗ ’ਤੇ ਉਹੀ ਆਕਾਰ-ਬਦਲਾਅ ਕਰੋ",
  "FAN-GAP-04": "ਅੰਦਰ-ਬਾਹਰ ਜਾਂ ਉੱਪਰਲੇ-ਹੇਠਲੇ ਪੱਧਰ ਦਾ ਜੋ ਸਥਾਨਾਂਤਰਨ ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਹੋਇਆ ਹੈ, ਉਹੀ ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਦੁਹਰਾਓ",
  "FAN-GAP-05": "ਦਿਸ਼ਾ, ਭਰਾਵ ਅਤੇ ਗਿਣਤੀ ਵਰਗੇ ਇੱਕ ਤੋਂ ਵੱਧ ਬਦਲਾਅ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਇਕੱਠੇ ਲਾਗੂ ਕਰੋ",
  ADD_SEGMENT: "ਪਹਿਲੀ ਜੋੜੀ ਵਾਂਗ ਲੋੜੀਂਦਾ ਰੇਖਾ-ਭਾਗ ਜੋੜੋ ਅਤੇ ਬਾਕੀ ਬਣਤਰ ਅਣਬਦਲੀ ਰੱਖੋ",
  REMOVE_SEGMENT: "ਪਹਿਲੀ ਜੋੜੀ ਵਾਂਗ ਲੋੜੀਂਦਾ ਰੇਖਾ-ਭਾਗ ਹਟਾਓ ਅਤੇ ਬਾਕੀ ਬਣਤਰ ਅਣਬਦਲੀ ਰੱਖੋ",
  SUBSTITUTE_INNER_NEXT: "ਅੰਦਰਲੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਉਸੇ ਬਦਲੀ ਕ੍ਰਮ ਵਿੱਚ ਅਗਲੀ ਆਕ੍ਰਿਤੀ ਨਾਲ ਬਦਲੋ",
  TOGGLE_INNER_SHADING: "ਅੰਦਰਲੇ ਭਾਗ ਦੀ ਭਰੀ/ਖਾਲੀ ਅਵਸਥਾ ਨੂੰ ਪਹਿਲੀ ਜੋੜੀ ਵਾਂਗ ਉਲਟੋ",
  "FCL-GAP-01": "ਚਾਰੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਘੁੰਮਾਅ ਜਾਂ ਰੂਪਾਂਤਰਨ-ਸਮਾਨਤਾ ਜਾਂਚੋ ਅਤੇ ਉਸ ਵਿਕਲਪ ਨੂੰ ਵੱਖ ਕਰੋ ਜੋ ਇੱਕੋ ਰੂਪਾਂਤਰਨ ਨਾਲ ਨਹੀਂ ਬਣਦਾ",
  "FCL-GAP-02": "ਹਰ ਵਿਕਲਪ ਦੇ ਤੱਤ ਗਿਣ ਕੇ ਇੱਕੋ ਗਿਣਤੀ-ਸੰਬੰਧ ਵਾਲੇ ਤਿੰਨ ਵਿਕਲਪ ਪਛਾਣੋ",
  "FCL-GAP-03": "ਅੰਦਰਲੀ-ਬਾਹਰਲੀ ਪ੍ਰਤੀਰੂਪ ਬਣਤਰ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਸਾਪੇਖ ਆਕਾਰ ਨੂੰ ਇਕੱਠੇ ਜਾਂਚੋ",
  "FCL-GAP-04": "ਘਟਕਾਂ ਦੀ ਇੱਕੋ, ਉਲਟੀ, ਤਿਰਛੀ ਜਾਂ ਅੰਦਰ/ਬਾਹਰ ਸਾਪੇਖ ਦਿਸ਼ਾ ਨੂੰ ਤੁਲਨਾ ਦਾ ਆਧਾਰ ਬਣਾਓ",
  "FCL-GAP-05": "ਛਾਇਆਦਾਰ ਭਾਗ ਦੀ ਸਥਿਤੀ, ਮਾਤਰਾ ਜਾਂ ਵਾਰੀ-ਵਾਰੀ ਕ੍ਰਮ ਨੂੰ ਚਾਰੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਤੁਲਨਾ ਕਰੋ",
  "FCL-GAP-06": "ਹਰ ਵਿਕਲਪ ਦੀਆਂ ਉਪ-ਆਕ੍ਰਿਤੀਆਂ ਵਿਚਕਾਰ ਦਰਪਣ, ਜਲ-ਪ੍ਰਤੀਬਿੰਬ ਜਾਂ ਘੁੰਮਾਅ ਸੰਬੰਧ ਜਾਂਚੋ",
  VERTICAL_SYMMETRY: "ਹਰ ਵਿਕਲਪ ਨੂੰ ਖੜ੍ਹੀ ਸਮਮਿਤੀ-ਅੱਖ ’ਤੇ ਜਾਂਚੋ",
  HORIZONTAL_SYMMETRY: "ਹਰ ਵਿਕਲਪ ਨੂੰ ਸਮਤਲ ਸਮਮਿਤੀ-ਅੱਖ ’ਤੇ ਜਾਂਚੋ",
  HALF_TURN_SYMMETRY: "ਹਰ ਵਿਕਲਪ ਨੂੰ 180° ਘੁਮਾਉਣ ’ਤੇ ਉਹੀ ਰੂਪ ਵਾਪਸ ਆਉਂਦਾ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਹ ਜਾਂਚੋ",
  QUARTER_TURN_SYMMETRY: "ਹਰ ਵਿਕਲਪ ਨੂੰ 90° ਘੁਮਾਉਣ ’ਤੇ ਉਹੀ ਰੂਪ ਵਾਪਸ ਆਉਂਦਾ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਹ ਜਾਂਚੋ",
  CLOSED_VS_OPEN: "ਚਾਰੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਰੇਖਾ ਬੰਦ ਆਕ੍ਰਿਤੀ ਬਣਾਉਂਦੀ ਹੈ ਜਾਂ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ, ਇਹ ਜਾਂਚੋ",
  POLYGON_VS_CURVED: "ਸਿੱਧੀਆਂ ਭੁਜਾਵਾਂ ਵਾਲੀਆਂ ਬਹੁਭੁਜ ਆਕ੍ਰਿਤੀਆਂ ਅਤੇ ਵਕਰ ਆਕ੍ਰਿਤੀ ਦਾ ਅੰਤਰ ਜਾਂਚੋ",
  EVEN_SIDED_POLYGON: "ਹਰ ਬਹੁਭੁਜ ਦੀਆਂ ਭੁਜਾਵਾਂ ਗਿਣ ਕੇ ਸਮ ਭੁਜਾ-ਗਿਣਤੀ ਵਾਲੇ ਤਿੰਨ ਵਿਕਲਪ ਪਛਾਣੋ",
  HAS_BRANCH_JUNCTION: "ਰੇਖਾਵਾਂ ਵਿੱਚ ਅਸਲ ਸ਼ਾਖਾ-ਜੋੜ ਕਿੱਥੇ ਬਣਦਾ ਹੈ, ਇਹ ਚਾਰੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਜਾਂਚੋ",
  HAS_TRUE_CROSSING: "ਰੇਖਾਵਾਂ ਸਿਰਫ਼ ਜੁੜਦੀਆਂ ਹਨ ਜਾਂ ਸੱਚਮੁੱਚ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਕੱਟਦੀਆਂ ਹਨ, ਇਹ ਚਾਰੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਜਾਂਚੋ",
  TWO_FREE_TERMINALS: "ਹਰ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਖੁੱਲ੍ਹੇ ਸੁਤੰਤਰ ਸਿਰਿਆਂ ਦੀ ਗਿਣਤੀ ਕਰੋ ਅਤੇ ਦੋ ਖੁੱਲ੍ਹੇ ਸਿਰਿਆਂ ਵਾਲਾ ਸਾਂਝਾ ਗੁਣ ਪਛਾਣੋ",
  PARTITIONED_FIGURE: "ਆਕ੍ਰਿਤੀ ਦੇ ਅੰਦਰ ਬਣੀਆਂ ਵੰਡਾਂ ਅਤੇ ਖੇਤਰਾਂ ਦੀ ਬਣਤਰ ਦੀ ਤੁਲਨਾ ਕਰੋ",
  "FSR-GAP-01": "ਹਰ ਫਰੇਮ ਵਿੱਚ ਹੋ ਰਹੇ ਪ੍ਰਤੀਬਿੰਬ ਜਾਂ ਉਲਟਾਅ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਗਲੇ ਫਰੇਮ ਤੱਕ ਵਧਾਓ",
  "FSR-GAP-02": "ਵੱਖ-ਵੱਖ ਘਟਕਾਂ ਦੇ ਸਵਤੰਤਰ ਘੁੰਮਾਅ ਨੂੰ ਵੱਖ ਟ੍ਰੈਕ ਕਰਕੇ ਅਗਲਾ ਸੰਯੁਕਤ ਰੂਪ ਬਣਾਓ",
  "FSR-GAP-03": "ਚੱਲਦੇ ਘਟਕ ਦੇ ਸਥਾਨਾਂ ਦਾ ਚੱਕਰ ਪਛਾਣ ਕੇ ਅਗਲਾ ਸਥਾਨ ਉਸੇ ਚੱਕਰ ਤੋਂ ਚੁਣੋ",
  "FSR-GAP-04": "ਤੱਤਾਂ ਦੇ ਨਿਯਮਤ ਜੋੜ/ਹਟਾਉਣ ਅਤੇ ਗਿਣਤੀ-ਬਦਲਾਅ ਨੂੰ ਅਗਲੇ ਫਰੇਮ ਤੱਕ ਜਾਰੀ ਰੱਖੋ",
  "FSR-GAP-05": "ਭਰੇ ਅਤੇ ਖਾਲੀ ਭਾਗਾਂ ਦੀ ਬਦਲਦੀ ਅਵਸਥਾ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਗਲੇ ਫਰੇਮ ਤੱਕ ਵਧਾਓ",
  "FSR-GAP-06": "ਜਿਸ ਤੱਤ ਨੂੰ ਹਰ ਪੜਾਅ ਵਿੱਚ ਅਗਲੇ ਚਿੰਨ੍ਹ/ਆਕ੍ਰਿਤੀ ਨਾਲ ਬਦਲਿਆ ਜਾ ਰਿਹਾ ਹੈ, ਉਸੇ ਬਦਲੀ ਕ੍ਰਮ ਨੂੰ ਜਾਰੀ ਰੱਖੋ",
  "FSR-GAP-07": "ਘਟਕਾਂ ਦੇ ਮੁੜ-ਕ੍ਰਮ ਜਾਂ ਸਥਾਨ-ਬਦਲਾਅ ਦਾ ਚੱਕਰ ਪਛਾਣ ਕੇ ਅਗਲੀ ਵਿਵਸਥਾ ਬਣਾਓ",
  "FSR-GAP-08": "ਵਾਰੀ-ਵਾਰੀ ਚੱਲ ਰਹੀਆਂ ਦੋ ਕ੍ਰਿਆਵਾਂ ਨੂੰ ਵੱਖ ਟ੍ਰੈਕ ਕਰਕੇ ਅਗਲੀ ਸਹੀ ਕ੍ਰਿਆ ਲਾਗੂ ਕਰੋ",
  ROTATE_90_CW_MOVE_MARKER_CCW: "ਮੁੱਖ ਆਕ੍ਰਿਤੀ ਦੇ 90° ਘੁੰਮਾਅ ਅਤੇ ਚਿੰਨ੍ਹ ਦੇ ਉਲਟੀ ਦਿਸ਼ਾ ਵਾਲੇ ਸਥਾਨ-ਬਦਲਾਅ ਨੂੰ ਇਕੱਠੇ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਕਰੋ",
  ROTATE_90_CCW_MOVE_DOTS_CW: "ਮੁੱਖ ਆਕ੍ਰਿਤੀ ਦੇ 90° ਘੁੰਮਾਅ ਅਤੇ ਬਿੰਦੂਆਂ ਦੇ ਉਲਟੀ ਦਿਸ਼ਾ ਵਾਲੇ ਸਥਾਨ-ਬਦਲਾਅ ਨੂੰ ਇਕੱਠੇ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਕਰੋ",
};

function modeSpecificApplication(
  question: SpatialLocalizedStudioQuestionV1,
): string | null {
  if (question.language === "en") return null;
  const answer = question.answer;
  const rotation = question.mode.match(/^WHOLE_FIGURE_ROTATION_(-?\d+)$/);
  if (rotation) {
    const angle = Math.abs(Number(rotation[1]));
    return question.language === "hi"
      ? `पहली जोड़ी में पूरी आकृति को ${angle}° जितना जिस दिशा में घुमाया गया है, तीसरी आकृति को भी उतना ही घुमाएँ। यही पूरा मिलान विकल्प ${answer} में है।`
      : `ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਪੂਰੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ${angle}° ਜਿੰਨਾ ਜਿਸ ਦਿਸ਼ਾ ਵਿੱਚ ਘੁਮਾਇਆ ਗਿਆ ਹੈ, ਤੀਜੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਵੀ ਉਤਨਾ ਹੀ ਘੁਮਾਓ। ਇਹ ਪੂਰਾ ਮਿਲਾਨ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ.`;
  }
  const detail = question.language === "hi"
    ? HINDI_MODE_DETAIL[question.mode]
    : PUNJABI_MODE_DETAIL[question.mode];
  if (!detail) return null;
  if (question.chapterCode === "FCL-001") {
    return question.language === "hi"
      ? `${detail}। इस तुलना में विकल्प ${answer} बाकी तीन से अलग है।`
      : `${detail}. ਇਸ ਤੁਲਨਾ ਵਿੱਚ ਵਿਕਲਪ ${answer} ਬਾਕੀ ਤਿੰਨਾਂ ਤੋਂ ਵੱਖ ਹੈ.`;
  }
  return question.language === "hi"
    ? `${detail}। इस विशेष नियम को पूरा करने वाला विकल्प ${answer} है।`
    : `${detail}. ਇਸ ਖਾਸ ਨਿਯਮ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਵਿਕਲਪ ${answer} ਹੈ.`;
}

function localizedClassificationCheck(
  question: SpatialLocalizedStudioQuestionV1,
): string | null {
  if (question.language === "en" || question.chapterCode !== "FCL-001") return null;
  return question.language === "hi"
    ? `विकल्प ${question.answer} समूह के सामान्य नियम को तोड़ता है; बाकी तीन विकल्प निर्णायक गुण या संबंध साझा करते हैं।`
    : `ਵਿਕਲਪ ${question.answer} ਸਮੂਹ ਦੇ ਸਾਂਝੇ ਨਿਯਮ ਨੂੰ ਤੋੜਦਾ ਹੈ; ਬਾਕੀ ਤਿੰਨ ਵਿਕਲਪ ਨਿਰਣਾਇਕ ਗੁਣ ਜਾਂ ਸੰਬੰਧ ਸਾਂਝਾ ਕਰਦੇ ਹਨ.`;
}

function normalizeLocalizedProductionText(
  question: SpatialLocalizedStudioQuestionV1,
): SpatialLocalizedStudioQuestionV1 {
  if (question.language === "en") return question;
  const punctuation = (value: string) => question.language === "pa"
    ? value.replaceAll("।", ".").replaceAll("॥", ".")
    : value;
  const specificApplication = modeSpecificApplication(question);
  const specificCheck = localizedClassificationCheck(question);
  return {
    ...question,
    qlName: punctuation(question.qlName),
    stem: punctuation(question.stem),
    explanation: {
      observation: punctuation(question.explanation.observation),
      rule: punctuation(question.explanation.rule),
      application: punctuation(specificApplication ?? question.explanation.application),
      check: punctuation(specificCheck ?? question.explanation.check),
    },
  };
}

function productionQuestion(
  question: SpatialLocalizedStudioQuestionV1,
): SpatialProductionStudioQuestionV1 {
  const normalizedQuestion = normalizeLocalizedProductionText(question);
  const { lifecycle: _sourceLifecycle, ...content } = normalizedQuestion;
  return {
    ...content,
    lifecycle: {
      questionStudioDiscoverable: true,
      registrationStatus: "REGISTERED",
      persistenceAllowed: true,
      questionBankStatus:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true,
      publiclyPublishable:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.manualApprovalRequired,
      automaticStudentPublication:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.automaticStudentPublication,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
    },
  };
}

export function generateSpatialProductionStudioQuestionV1(input: {
  qlId: SpatialPermanentQlIdV1;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}): SpatialProductionStudioQuestionV1 {
  const source = generateSpatialStudioQuestionV1({ qlId: input.qlId, seed: input.seed });
  return productionQuestion(
    localizeSpatialStudioQuestionV1(source, input.language ?? "en"),
  );
}

export function generateSpatialProductionStudioBatchV1(
  request: SpatialProductionStudioBatchRequestV1,
) {
  const { language = "en", ...sourceRequest } = request;
  const generated = generateSpatialStudioBatchV1(sourceRequest);
  return {
    generationContext: {
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.generationDomain,
      seed: generated.generationContext.seed,
      count: generated.generationContext.count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      localizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.localizationAuthority,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true as const,
      publiclyPublishable:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
    questions: generated.questions.map((question) =>
      productionQuestion(localizeSpatialStudioQuestionV1(question, language))),
  } as const;
}
