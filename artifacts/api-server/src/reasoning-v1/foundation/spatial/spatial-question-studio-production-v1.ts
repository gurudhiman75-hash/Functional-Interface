import {
  generateSpatialStudioQuestionV1,
  type SpatialPermanentQlIdV1,
} from "./spatial-question-studio-runtime-v1";
import {
  localizeSpatialStudioQuestionV1,
  type SpatialLocalizedStudioQuestionV1,
  type SpatialQuestionStudioLanguageV1,
} from "./spatial-question-studio-localization-v1";
import {
  generateSpatialFgcStudioQuestionV1,
  isSpatialFgcQuestionStudioQlIdV1,
  type SpatialFgcStudioQuestionV1,
} from "./spatial-question-studio-fgc-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  spatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioChapterCodeV1,
  type SpatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioPermanentQlIdV1,
} from "./spatial-question-studio-integration-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATIONS_V2 } from "./spatial-permanent-ql-allocation-v2";

export type SpatialProductionSourceQuestionV1 =
  | SpatialLocalizedStudioQuestionV1
  | SpatialFgcStudioQuestionV1;

type ProductionLifecycleV1 = {
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

type PromoteToProduction<T> = T extends { lifecycle: unknown }
  ? Omit<T, "lifecycle"> & { lifecycle: ProductionLifecycleV1 }
  : never;

export type SpatialProductionStudioQuestionV1 = PromoteToProduction<SpatialProductionSourceQuestionV1>;

export interface SpatialProductionStudioBatchRequestV1 {
  seed: string;
  count?: number;
  qlId?: SpatialQuestionStudioPermanentQlIdV1;
  chapterCode?: SpatialQuestionStudioChapterCodeV1;
  difficulty?: SpatialQuestionStudioDifficultyV1;
  language?: SpatialQuestionStudioLanguageV1;
}

// P0 localization remediation is retained byte-for-byte at the adapter boundary.
// FGC learner text bypasses these maps because its EN/HI/PA wording is independently frozen.
const HINDI_MODE_DETAIL: Record<string, string> = {
  GENERAL_COMPOSITION: "हर छोटे हिस्से को दर्पण या जल-रेखा के हिसाब से सही जगह पर रखें",
  LATIN_GLYPH_STRING: "हर अक्षर का रूप और पूरे समूह का क्रम सही तरह उलटें",
  WESTERN_ARABIC_DIGIT_STRING: "हर अंक का रूप और पूरे समूह का क्रम सही तरह उलटें",
  ANALOG_CLOCK_GEOMETRY: "घड़ी की दोनों सुइयों को दर्पण में बाएँ-दाएँ सही जगह पर रखें",
  "FAN-GAP-01": "बाहरी और अंदर वाले हिस्से में हुए बदलाव अलग-अलग पहचानकर C पर करें",
  "FAN-GAP-02": "हिस्से जिस क्रम से जगह बदल रहे हैं, उसी क्रम की अगली जगह रखें",
  "FAN-GAP-03": "जिस हिस्से का आकार बढ़ा या घटा है, C में भी उतना ही बदलें",
  "FAN-GAP-04": "जो हिस्सा अंदर से बाहर, बाहर से अंदर, बड़ा या छोटा हुआ है, C में भी वही बदलाव करें",
  "FAN-GAP-05": "दिशा, भराव और गिनती में हुए सभी बदलाव एक साथ C पर करें",
  ADD_SEGMENT: "पहली जोड़ी की तरह एक रेखा या हिस्सा जोड़ें और बाकी आकृति वैसी ही रखें",
  REMOVE_SEGMENT: "पहली जोड़ी की तरह एक रेखा या हिस्सा हटाएँ और बाकी आकृति वैसी ही रखें",
  SUBSTITUTE_INNER_NEXT: "अंदर वाली आकृति को उसी क्रम में अगली आकृति से बदलें",
  TOGGLE_INNER_SHADING: "अंदर वाले हिस्से को भरे से खाली या खाली से भरा करें",
  "FCL-GAP-01": "देखें कौन-सा विकल्प बाकी तीन की तरह घुमाने या उलटने से नहीं बनता",
  "FCL-GAP-02": "हर विकल्प में चीजें गिनें और वह विकल्प खोजें जिसकी गिनती का नियम अलग है",
  "FCL-GAP-03": "अंदर और बाहर की आकृतियों का प्रकार और आकार मिलाकर देखें",
  "FCL-GAP-04": "हिस्सों की जगह और दिशा की तुलना करें और अलग विकल्प पहचानें",
  "FCL-GAP-05": "भरे या छायांकित हिस्से की जगह और मात्रा की तुलना करें",
  "FCL-GAP-06": "हर विकल्प के दो हिस्सों में दर्पण, जल या घुमाव का संबंध देखें",
  VERTICAL_SYMMETRY: "देखें कौन-सी आकृतियाँ बीच की खड़ी रेखा के दोनों ओर बराबर दिखती हैं",
  HORIZONTAL_SYMMETRY: "देखें कौन-सी आकृतियाँ बीच की आड़ी रेखा के ऊपर-नीचे बराबर दिखती हैं",
  HALF_TURN_SYMMETRY: "देखें 180° घुमाने पर कौन-सी आकृतियाँ वैसी ही दिखती हैं",
  QUARTER_TURN_SYMMETRY: "देखें 90° घुमाने पर कौन-सी आकृतियाँ वैसी ही दिखती हैं",
  CLOSED_VS_OPEN: "देखें आकृति बंद है या कहीं से खुली है",
  POLYGON_VS_CURVED: "देखें आकृति सीधी रेखाओं से बनी है या उसमें वक्र रेखा है",
  EVEN_SIDED_POLYGON: "हर आकृति की भुजाएँ गिनें और अलग गिनती वाला विकल्प खोजें",
  HAS_BRANCH_JUNCTION: "देखें रेखाएँ कहाँ एक जगह से कई दिशाओं में निकलती हैं",
  HAS_TRUE_CROSSING: "देखें रेखाएँ केवल मिलती हैं या सच में एक-दूसरे को काटती हैं",
  TWO_FREE_TERMINALS: "हर आकृति में खुले सिरों की संख्या गिनें",
  PARTITIONED_FIGURE: "आकृति के अंदर बने हिस्सों और उनकी जगह की तुलना करें",
  "FSR-GAP-01": "हर चित्र में हो रहे उलटाव को अगले चित्र में भी जारी रखें",
  "FSR-GAP-02": "अलग हिस्सों के घुमाव को अलग-अलग देखकर अगला चित्र बनाएं",
  "FSR-GAP-03": "चलते हिस्से की अगली जगह उसी क्रम से चुनें",
  "FSR-GAP-04": "हर चित्र में जितने हिस्से जुड़ या हट रहे हैं, वही गिनती आगे बढ़ाएँ",
  "FSR-GAP-05": "भरे और खाली हिस्सों का बदलता क्रम आगे बढ़ाएँ",
  "FSR-GAP-06": "चिन्ह या आकृति जिस क्रम से बदल रही है, उसी क्रम का अगला रूप चुनें",
  "FSR-GAP-07": "हिस्सों की जगह बदलने का क्रम आगे बढ़ाएँ",
  "FSR-GAP-08": "दो बदलाव बारी-बारी से हो रहे हैं; अगली बारी वाला बदलाव करें",
  ROTATE_90_CW_MOVE_MARKER_CCW: "मुख्य आकृति को 90° घुमाएँ और चिन्ह को उसकी तय अगली जगह पर ले जाएँ",
  ROTATE_90_CCW_MOVE_DOTS_CW: "मुख्य आकृति को 90° दूसरी दिशा में घुमाएँ और बिंदुओं को उनकी अगली जगह पर ले जाएँ",
};

const PUNJABI_MODE_DETAIL: Record<string, string> = {
  GENERAL_COMPOSITION: "ਹਰ ਛੋਟੇ ਹਿੱਸੇ ਨੂੰ ਦਰਪਣ ਜਾਂ ਜਲ-ਰੇਖਾ ਦੇ ਹਿਸਾਬ ਨਾਲ ਸਹੀ ਥਾਂ ਰੱਖੋ",
  LATIN_GLYPH_STRING: "ਹਰ ਅੱਖਰ ਦਾ ਰੂਪ ਅਤੇ ਪੂਰੇ ਸਮੂਹ ਦਾ ਕ੍ਰਮ ਸਹੀ ਤਰ੍ਹਾਂ ਉਲਟੋ",
  WESTERN_ARABIC_DIGIT_STRING: "ਹਰ ਅੰਕ ਦਾ ਰੂਪ ਅਤੇ ਪੂਰੇ ਸਮੂਹ ਦਾ ਕ੍ਰਮ ਸਹੀ ਤਰ੍ਹਾਂ ਉਲਟੋ",
  ANALOG_CLOCK_GEOMETRY: "ਘੜੀ ਦੀਆਂ ਦੋਵੇਂ ਸੂਈਆਂ ਨੂੰ ਦਰਪਣ ਵਿੱਚ ਖੱਬੇ-ਸੱਜੇ ਸਹੀ ਥਾਂ ਰੱਖੋ",
  "FAN-GAP-01": "ਬਾਹਰਲੇ ਅਤੇ ਅੰਦਰਲੇ ਹਿੱਸੇ ਵਿੱਚ ਹੋਏ ਬਦਲਾਅ ਵੱਖ-ਵੱਖ ਪਛਾਣ ਕੇ C ’ਤੇ ਕਰੋ",
  "FAN-GAP-02": "ਹਿੱਸੇ ਜਿਸ ਕ੍ਰਮ ਨਾਲ ਥਾਂ ਬਦਲ ਰਹੇ ਹਨ, ਉਸੇ ਕ੍ਰਮ ਦੀ ਅਗਲੀ ਥਾਂ ਰੱਖੋ",
  "FAN-GAP-03": "ਜਿਸ ਹਿੱਸੇ ਦਾ ਆਕਾਰ ਵਧਿਆ ਜਾਂ ਘਟਿਆ ਹੈ, C ਵਿੱਚ ਵੀ ਉਤਨਾ ਹੀ ਬਦਲੋ",
  "FAN-GAP-04": "ਜੋ ਹਿੱਸਾ ਅੰਦਰੋਂ ਬਾਹਰ ਜਾਂ ਬਾਹਰੋਂ ਅੰਦਰ ਗਿਆ ਹੈ, C ਵਿੱਚ ਵੀ ਉਹੀ ਕਰੋ",
  "FAN-GAP-05": "ਦਿਸ਼ਾ, ਭਰਾਵ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਹੋਏ ਸਾਰੇ ਬਦਲਾਅ ਇਕੱਠੇ C ’ਤੇ ਕਰੋ",
  ADD_SEGMENT: "ਪਹਿਲੀ ਜੋੜੀ ਵਾਂਗ ਇੱਕ ਰੇਖਾ ਜਾਂ ਹਿੱਸਾ ਜੋੜੋ ਅਤੇ ਬਾਕੀ ਆਕ੍ਰਿਤੀ ਉਹੀ ਰੱਖੋ",
  REMOVE_SEGMENT: "ਪਹਿਲੀ ਜੋੜੀ ਵਾਂਗ ਇੱਕ ਰੇਖਾ ਜਾਂ ਹਿੱਸਾ ਹਟਾਓ ਅਤੇ ਬਾਕੀ ਆਕ੍ਰਿਤੀ ਉਹੀ ਰੱਖੋ",
  SUBSTITUTE_INNER_NEXT: "ਅੰਦਰਲੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਗਲੀ ਆਕ੍ਰਿਤੀ ਨਾਲ ਬਦਲੋ",
  TOGGLE_INNER_SHADING: "ਅੰਦਰਲੇ ਹਿੱਸੇ ਨੂੰ ਭਰੇ ਤੋਂ ਖਾਲੀ ਜਾਂ ਖਾਲੀ ਤੋਂ ਭਰਿਆ ਕਰੋ",
  "FCL-GAP-01": "ਵੇਖੋ ਕਿਹੜਾ ਵਿਕਲਪ ਬਾਕੀ ਤਿੰਨਾਂ ਵਾਂਗ ਘੁਮਾਉਣ ਜਾਂ ਉਲਟਣ ਨਾਲ ਨਹੀਂ ਬਣਦਾ",
  "FCL-GAP-02": "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਚੀਜ਼ਾਂ ਗਿਣੋ ਅਤੇ ਵੱਖ ਗਿਣਤੀ-ਨਿਯਮ ਵਾਲਾ ਵਿਕਲਪ ਲੱਭੋ",
  "FCL-GAP-03": "ਅੰਦਰਲੀ ਅਤੇ ਬਾਹਰਲੀ ਆਕ੍ਰਿਤੀ ਦੀ ਕਿਸਮ ਅਤੇ ਆਕਾਰ ਇਕੱਠੇ ਵੇਖੋ",
  "FCL-GAP-04": "ਹਿੱਸਿਆਂ ਦੀ ਥਾਂ ਅਤੇ ਦਿਸ਼ਾ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਵੱਖ ਵਿਕਲਪ ਪਛਾਣੋ",
  "FCL-GAP-05": "ਭਰੇ ਜਾਂ ਛਾਇਆ ਵਾਲੇ ਹਿੱਸੇ ਦੀ ਥਾਂ ਅਤੇ ਮਾਤਰਾ ਦੀ ਤੁਲਨਾ ਕਰੋ",
  "FCL-GAP-06": "ਹਰ ਵਿਕਲਪ ਦੇ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਦਰਪਣ, ਜਲ ਜਾਂ ਘੁੰਮਾਅ ਦਾ ਸੰਬੰਧ ਵੇਖੋ",
  VERTICAL_SYMMETRY: "ਵੇਖੋ ਕਿਹੜੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਵਿਚਕਾਰਲੀ ਖੜ੍ਹੀ ਰੇਖਾ ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਇੱਕੋ ਜਿਹੀਆਂ ਦਿਖਦੀਆਂ ਹਨ",
  HORIZONTAL_SYMMETRY: "ਵੇਖੋ ਕਿਹੜੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਵਿਚਕਾਰਲੀ ਆੜੀ ਰੇਖਾ ਦੇ ਉੱਪਰ-ਹੇਠਾਂ ਇੱਕੋ ਜਿਹੀਆਂ ਦਿਖਦੀਆਂ ਹਨ",
  HALF_TURN_SYMMETRY: "ਵੇਖੋ 180° ਘੁਮਾਉਣ ’ਤੇ ਕਿਹੜੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਉਹੀ ਦਿਖਦੀਆਂ ਹਨ",
  QUARTER_TURN_SYMMETRY: "ਵੇਖੋ 90° ਘੁਮਾਉਣ ’ਤੇ ਕਿਹੜੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਉਹੀ ਦਿਖਦੀਆਂ ਹਨ",
  CLOSED_VS_OPEN: "ਵੇਖੋ ਆਕ੍ਰਿਤੀ ਬੰਦ ਹੈ ਜਾਂ ਕਿਸੇ ਥਾਂ ਤੋਂ ਖੁੱਲ੍ਹੀ ਹੈ",
  POLYGON_VS_CURVED: "ਵੇਖੋ ਆਕ੍ਰਿਤੀ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਨਾਲ ਬਣੀ ਹੈ ਜਾਂ ਉਸ ਵਿੱਚ ਵਕਰ ਰੇਖਾ ਹੈ",
  EVEN_SIDED_POLYGON: "ਹਰ ਆਕ੍ਰਿਤੀ ਦੀਆਂ ਭੁਜਾਵਾਂ ਗਿਣੋ ਅਤੇ ਵੱਖ ਗਿਣਤੀ ਵਾਲਾ ਵਿਕਲਪ ਲੱਭੋ",
  HAS_BRANCH_JUNCTION: "ਵੇਖੋ ਰੇਖਾਵਾਂ ਕਿੱਥੇ ਇੱਕ ਥਾਂ ਤੋਂ ਕਈ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਨਿਕਲਦੀਆਂ ਹਨ",
  HAS_TRUE_CROSSING: "ਵੇਖੋ ਰੇਖਾਵਾਂ ਸਿਰਫ਼ ਮਿਲਦੀਆਂ ਹਨ ਜਾਂ ਸੱਚਮੁੱਚ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਕੱਟਦੀਆਂ ਹਨ",
  TWO_FREE_TERMINALS: "ਹਰ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਖੁੱਲ੍ਹੇ ਸਿਰਿਆਂ ਦੀ ਗਿਣਤੀ ਕਰੋ",
  PARTITIONED_FIGURE: "ਆਕ੍ਰਿਤੀ ਦੇ ਅੰਦਰ ਬਣੇ ਹਿੱਸਿਆਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਥਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ",
  "FSR-GAP-01": "ਹਰ ਚਿੱਤਰ ਵਿੱਚ ਹੋ ਰਹੇ ਉਲਟਾਅ ਨੂੰ ਅਗਲੇ ਚਿੱਤਰ ਵਿੱਚ ਵੀ ਜਾਰੀ ਰੱਖੋ",
  "FSR-GAP-02": "ਵੱਖ ਹਿੱਸਿਆਂ ਦੇ ਘੁੰਮਾਅ ਨੂੰ ਵੱਖ-ਵੱਖ ਵੇਖ ਕੇ ਅਗਲਾ ਚਿੱਤਰ ਬਣਾਓ",
  "FSR-GAP-03": "ਚੱਲਦੇ ਹਿੱਸੇ ਦੀ ਅਗਲੀ ਥਾਂ ਉਸੇ ਕ੍ਰਮ ਨਾਲ ਚੁਣੋ",
  "FSR-GAP-04": "ਹਰ ਚਿੱਤਰ ਵਿੱਚ ਜਿੰਨੇ ਹਿੱਸੇ ਜੁੜ ਜਾਂ ਹਟ ਰਹੇ ਹਨ, ਉਹੀ ਗਿਣਤੀ ਅੱਗੇ ਵਧਾਓ",
  "FSR-GAP-05": "ਭਰੇ ਅਤੇ ਖਾਲੀ ਹਿੱਸਿਆਂ ਦਾ ਬਦਲਦਾ ਕ੍ਰਮ ਅੱਗੇ ਵਧਾਓ",
  "FSR-GAP-06": "ਚਿੰਨ੍ਹ ਜਾਂ ਆਕ੍ਰਿਤੀ ਜਿਸ ਕ੍ਰਮ ਨਾਲ ਬਦਲ ਰਹੀ ਹੈ, ਉਸੇ ਕ੍ਰਮ ਦਾ ਅਗਲਾ ਰੂਪ ਚੁਣੋ",
  "FSR-GAP-07": "ਹਿੱਸਿਆਂ ਦੀ ਥਾਂ ਬਦਲਣ ਦਾ ਕ੍ਰਮ ਅੱਗੇ ਵਧਾਓ",
  "FSR-GAP-08": "ਦੋ ਬਦਲਾਅ ਵਾਰੀ-ਵਾਰੀ ਹੋ ਰਹੇ ਹਨ; ਅਗਲੀ ਵਾਰੀ ਵਾਲਾ ਬਦਲਾਅ ਕਰੋ",
  ROTATE_90_CW_MOVE_MARKER_CCW: "ਮੁੱਖ ਆਕ੍ਰਿਤੀ ਨੂੰ 90° ਘੁਮਾਓ ਅਤੇ ਚਿੰਨ੍ਹ ਨੂੰ ਉਸਦੀ ਅਗਲੀ ਤੈਅ ਥਾਂ ’ਤੇ ਲਿਜਾਓ",
  ROTATE_90_CCW_MOVE_DOTS_CW: "ਮੁੱਖ ਆਕ੍ਰਿਤੀ ਨੂੰ 90° ਦੂਜੀ ਦਿਸ਼ਾ ਵਿੱਚ ਘੁਮਾਓ ਅਤੇ ਬਿੰਦੂਆਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਅਗਲੀ ਥਾਂ ’ਤੇ ਲਿਜਾਓ",
};

function modeSpecificApplication(question: SpatialProductionSourceQuestionV1): string | null {
  if (question.language === "en" || question.chapterCode === "FGC-001") return null;
  const answer = question.answer;
  const rotation = question.mode.match(/^WHOLE_FIGURE_ROTATION_(-?\d+)$/);
  if (rotation) {
    const angle = Math.abs(Number(rotation[1]));
    return question.language === "hi"
      ? `पहली जोड़ी में पूरी आकृति ${angle}° जितनी जिस दिशा में घुमी है, C को भी उतना ही घुमाएँ। सही विकल्प ${answer} है।`
      : `ਪਹਿਲੀ ਜੋੜੀ ਵਿੱਚ ਪੂਰੀ ਆਕ੍ਰਿਤੀ ${angle}° ਜਿੰਨੀ ਜਿਸ ਦਿਸ਼ਾ ਵਿੱਚ ਘੁੰਮੀ ਹੈ, C ਨੂੰ ਵੀ ਉਤਨਾ ਹੀ ਘੁਮਾਓ। ਸਹੀ ਵਿਕਲਪ ${answer} ਹੈ.`;
  }
  const detail = question.language === "hi"
    ? HINDI_MODE_DETAIL[question.mode]
    : PUNJABI_MODE_DETAIL[question.mode];
  if (!detail) return null;
  if (question.chapterCode === "FCL-001") {
    return question.language === "hi"
      ? `${detail}। विकल्प ${answer} बाकी तीन से अलग है।`
      : `${detail}. ਵਿਕਲਪ ${answer} ਬਾਕੀ ਤਿੰਨਾਂ ਤੋਂ ਵੱਖ ਹੈ.`;
  }
  return question.language === "hi"
    ? `${detail}। सही विकल्प ${answer} है।`
    : `${detail}. ਸਹੀ ਵਿਕਲਪ ${answer} ਹੈ.`;
}

function localizedClassificationCheck(question: SpatialProductionSourceQuestionV1): string | null {
  if (question.language === "en" || question.chapterCode !== "FCL-001") return null;
  return question.language === "hi"
    ? `विकल्प ${question.answer} बाकी तीन के नियम से अलग है। इसलिए वही उत्तर है।`
    : `ਵਿਕਲਪ ${question.answer} ਬਾਕੀ ਤਿੰਨਾਂ ਦੇ ਨਿਯਮ ਤੋਂ ਵੱਖ ਹੈ। ਇਸ ਲਈ ਉਹੀ ਉੱਤਰ ਹੈ.`;
}

function normalizeLocalizedProductionText<T extends SpatialProductionSourceQuestionV1>(question: T): T {
  if (question.language === "en" || question.chapterCode === "FGC-001") return question;
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
  } as T;
}

function productionQuestion<T extends SpatialProductionSourceQuestionV1>(
  question: T,
): PromoteToProduction<T> {
  const normalizedQuestion = normalizeLocalizedProductionText(question);
  const { lifecycle: _sourceLifecycle, ...content } = normalizedQuestion;
  return {
    ...content,
    lifecycle: {
      questionStudioDiscoverable: true,
      registrationStatus: "REGISTERED",
      persistenceAllowed: true,
      questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true,
      publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.manualApprovalRequired,
      automaticStudentPublication: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.automaticStudentPublication,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
    },
  } as PromoteToProduction<T>;
}

function sourceQuestion(input: {
  qlId: SpatialQuestionStudioPermanentQlIdV1;
  seed: string;
  language: SpatialQuestionStudioLanguageV1;
}): SpatialProductionSourceQuestionV1 {
  if (isSpatialFgcQuestionStudioQlIdV1(input.qlId)) {
    return generateSpatialFgcStudioQuestionV1(input);
  }
  const source = generateSpatialStudioQuestionV1({
    qlId: input.qlId as SpatialPermanentQlIdV1,
    seed: input.seed,
  });
  return localizeSpatialStudioQuestionV1(source, input.language);
}

export function generateSpatialProductionStudioQuestionV1(input: {
  qlId: SpatialQuestionStudioPermanentQlIdV1;
  seed: string;
  language?: SpatialQuestionStudioLanguageV1;
}): SpatialProductionStudioQuestionV1 {
  return productionQuestion(sourceQuestion({
    qlId: input.qlId,
    seed: input.seed,
    language: input.language ?? "en",
  }));
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleAllocations(request: SpatialProductionStudioBatchRequestV1) {
  let allocations = [...SPATIAL_PERMANENT_QL_ALLOCATIONS_V2];
  if (request.qlId) {
    allocations = allocations.filter((entry) => entry.permanentQlId === request.qlId);
  }
  if (request.chapterCode) {
    allocations = allocations.filter((entry) => entry.chapterCode === request.chapterCode);
  }
  if (request.difficulty) {
    allocations = allocations.filter(
      (entry) => spatialQuestionStudioDifficultyV1(entry.baseDifficulty) === request.difficulty,
    );
  }
  if (!allocations.length) throw new Error("No permanent Spatial QLs match the requested filters.");
  return allocations;
}

export function generateSpatialProductionStudioBatchV1(
  request: SpatialProductionStudioBatchRequestV1,
) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("Spatial Question Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const language = request.language ?? "en";
  const allocations = eligibleAllocations(request)
    .map((entry) => ({ entry, score: hash32(`${seed}:${entry.permanentQlId}:order`) }))
    .sort((left, right) => left.score - right.score || left.entry.permanentQlId.localeCompare(right.entry.permanentQlId))
    .map(({ entry }) => entry);
  const questions: SpatialProductionStudioQuestionV1[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    const allocation = allocations[index % allocations.length]!;
    let accepted: SpatialProductionStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generateSpatialProductionStudioQuestionV1({
        qlId: allocation.permanentQlId,
        seed: `${seed}:${index}:R${retry}`,
        language,
      });
      if (seen.has(question.contentFingerprint)) continue;
      seen.add(question.contentFingerprint);
      accepted = question;
    }
    if (!accepted) {
      throw new Error(`${allocation.permanentQlId}: unable to produce a unique batch item at index ${index}.`);
    }
    questions.push(accepted);
  }

  return {
    generationContext: {
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.generationDomain,
      seed,
      count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      localizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.localizationAuthority,
      fgcLocalizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.fgcLocalizationAuthority,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true as const,
      publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
    questions,
  } as const;
}
