import type { StcScenarioAuthority } from "./types.ts";
import type { StcV2SurfaceArchetype } from "./editorial-v2-types.ts";
import { and, atom, not, or } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

type StcV2FiveWayEitherAuthority = StcScenarioAuthority & Readonly<{
  qlId: "STC-QL-002";
  surfaceArchetype: StcV2SurfaceArchetype;
}>;

export const STC_V2_FIVE_WAY_EITHER_AUTHORITIES: readonly StcV2FiveWayEitherAuthority[] = [
  {
    id: "STC-V2-EITHER-001", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "PUBLIC_NOTICE",
    statement: t(
      "Notice: The final venue will be either Hall A or Hall B, but not both. The organising committee has not yet announced which hall will be used.",
      "सूचना: अंतिम स्थान या तो हॉल A होगा या हॉल B, लेकिन दोनों नहीं। आयोजन समिति ने अभी यह घोषित नहीं किया है कि कौन-सा हॉल चुना जाएगा।",
      "ਸੂਚਨਾ: ਅੰਤਿਮ ਸਥਾਨ ਜਾਂ ਤਾਂ ਹਾਲ A ਹੋਵੇਗਾ ਜਾਂ ਹਾਲ B, ਪਰ ਦੋਵੇਂ ਨਹੀਂ। ਆਯੋਜਕ ਕਮੇਟੀ ਨੇ ਹਾਲੇ ਇਹ ਨਹੀਂ ਦੱਸਿਆ ਕਿ ਕਿਹੜਾ ਹਾਲ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    ),
    premises: [or(atom("venue_a"), atom("venue_b")), not(and(atom("venue_a"), atom("venue_b")))],
    candidates: [
      { id: "C1", expression: atom("venue_a"), text: t("The final venue will be Hall A.", "अंतिम स्थान हॉल A होगा।", "ਅੰਤਿਮ ਸਥਾਨ ਹਾਲ A ਹੋਵੇਗਾ।") },
      { id: "C2", expression: atom("venue_b"), text: t("The final venue will be Hall B.", "अंतिम स्थान हॉल B होगा।", "ਅੰਤਿਮ ਸਥਾਨ ਹਾਲ B ਹੋਵੇਗਾ।") },
      { id: "C3", expression: and(atom("venue_a"), atom("venue_b")), text: t("Both halls will be used as the final venue.", "दोनों हॉल अंतिम स्थान के रूप में उपयोग होंगे।", "ਦੋਵੇਂ ਹਾਲ ਅੰਤਿਮ ਸਥਾਨ ਵਜੋਂ ਵਰਤੇ ਜਾਣਗੇ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("event_cancelled"), text: t("The event will be cancelled.", "कार्यक्रम रद्द होगा।", "ਪ੍ਰੋਗਰਾਮ ਰੱਦ ਹੋਵੇਗਾ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-V2-EITHER-002", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "RULE_ELIGIBILITY",
    statement: t(
      "Under the allocation rule, selected trainee P will be assigned to either the Delhi centre or the Jaipur centre, and cannot be assigned to both. P's centre has not yet been published.",
      "आवंटन नियम के अनुसार चयनित प्रशिक्षु P को या तो दिल्ली केंद्र या जयपुर केंद्र दिया जाएगा और दोनों केंद्र नहीं दिए जा सकते। P का केंद्र अभी प्रकाशित नहीं हुआ है।",
      "ਅਲਾਟਮੈਂਟ ਨਿਯਮ ਅਨੁਸਾਰ ਚੁਣੇ ਟ੍ਰੇਨੀ P ਨੂੰ ਜਾਂ ਤਾਂ ਦਿੱਲੀ ਕੇਂਦਰ ਜਾਂ ਜੈਪੁਰ ਕੇਂਦਰ ਦਿੱਤਾ ਜਾਵੇਗਾ ਅਤੇ ਦੋਵੇਂ ਕੇਂਦਰ ਨਹੀਂ ਦਿੱਤੇ ਜਾ ਸਕਦੇ। P ਦਾ ਕੇਂਦਰ ਹਾਲੇ ਜਾਰੀ ਨਹੀਂ ਹੋਇਆ।",
    ),
    premises: [or(atom("p_delhi"), atom("p_jaipur")), not(and(atom("p_delhi"), atom("p_jaipur")))],
    candidates: [
      { id: "C1", expression: atom("p_delhi"), text: t("Trainee P will be assigned to the Delhi centre.", "प्रशिक्षु P को दिल्ली केंद्र दिया जाएगा।", "ਟ੍ਰੇਨੀ P ਨੂੰ ਦਿੱਲੀ ਕੇਂਦਰ ਦਿੱਤਾ ਜਾਵੇਗਾ।") },
      { id: "C2", expression: atom("p_jaipur"), text: t("Trainee P will be assigned to the Jaipur centre.", "प्रशिक्षु P को जयपुर केंद्र दिया जाएगा।", "ਟ੍ਰੇਨੀ P ਨੂੰ ਜੈਪੁਰ ਕੇਂਦਰ ਦਿੱਤਾ ਜਾਵੇਗਾ।") },
      { id: "C3", expression: and(atom("p_delhi"), atom("p_jaipur")), text: t("Trainee P will be assigned to both centres.", "प्रशिक्षु P को दोनों केंद्र दिए जाएंगे।", "ਟ੍ਰੇਨੀ P ਨੂੰ ਦੋਵੇਂ ਕੇਂਦਰ ਦਿੱਤੇ ਜਾਣਗੇ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("p_not_selected"), text: t("Trainee P was not selected.", "प्रशिक्षु P का चयन नहीं हुआ।", "ਟ੍ਰੇਨੀ P ਦੀ ਚੋਣ ਨਹੀਂ ਹੋਈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-V2-EITHER-003", qlId: "STC-QL-002", difficulty: "HARD", surfaceArchetype: "QUOTED_CLAIM",
    statement: t(
      "The release manager said, \"Tonight we will deploy either Version A or Version B, but not both. The final choice will be made after the last test.\"",
      "रिलीज प्रबंधक ने कहा, \"आज रात हम या तो संस्करण A तैनात करेंगे या संस्करण B, लेकिन दोनों नहीं। अंतिम निर्णय आखिरी परीक्षण के बाद होगा।\"",
      "ਰੀਲੀਜ਼ ਮੈਨੇਜਰ ਨੇ ਕਿਹਾ, \"ਅੱਜ ਰਾਤ ਅਸੀਂ ਜਾਂ ਤਾਂ ਵਰਜਨ A ਲਾਗੂ ਕਰਾਂਗੇ ਜਾਂ ਵਰਜਨ B, ਪਰ ਦੋਵੇਂ ਨਹੀਂ। ਅੰਤਿਮ ਚੋਣ ਆਖਰੀ ਟੈਸਟ ਤੋਂ ਬਾਅਦ ਹੋਵੇਗੀ।\"",
    ),
    premises: [or(atom("deploy_a"), atom("deploy_b")), not(and(atom("deploy_a"), atom("deploy_b")))],
    candidates: [
      { id: "C1", expression: atom("deploy_a"), text: t("Version A will be deployed tonight.", "आज रात संस्करण A तैनात किया जाएगा।", "ਅੱਜ ਰਾਤ ਵਰਜਨ A ਲਾਗੂ ਕੀਤਾ ਜਾਵੇਗਾ।") },
      { id: "C2", expression: atom("deploy_b"), text: t("Version B will be deployed tonight.", "आज रात संस्करण B तैनात किया जाएगा।", "ਅੱਜ ਰਾਤ ਵਰਜਨ B ਲਾਗੂ ਕੀਤਾ ਜਾਵੇਗਾ।") },
      { id: "C3", expression: and(atom("deploy_a"), atom("deploy_b")), text: t("Both versions will be deployed tonight.", "आज रात दोनों संस्करण तैनात किए जाएंगे।", "ਅੱਜ ਰਾਤ ਦੋਵੇਂ ਵਰਜਨ ਲਾਗੂ ਕੀਤੇ ਜਾਣਗੇ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("deployment_cancelled"), text: t("Tonight's deployment has been cancelled.", "आज रात की तैनाती रद्द कर दी गई है।", "ਅੱਜ ਰਾਤ ਦੀ ਡਿਪਲੋਇਮੈਂਟ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-V2-EITHER-004", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "EVERYDAY_OBSERVATION",
    statement: t(
      "The tracking record shows that parcel P is currently at either North Hub or South Hub, and it cannot be at both. The latest screen has not yet shown which hub it is at.",
      "ट्रैकिंग रिकॉर्ड के अनुसार पार्सल P इस समय या तो नॉर्थ हब पर है या साउथ हब पर, और दोनों जगह नहीं हो सकता। नवीनतम स्क्रीन पर अभी यह नहीं दिखा है कि वह किस हब पर है।",
      "ਟਰੈਕਿੰਗ ਰਿਕਾਰਡ ਅਨੁਸਾਰ ਪਾਰਸਲ P ਇਸ ਵੇਲੇ ਜਾਂ ਤਾਂ ਨਾਰਥ ਹੱਬ ਤੇ ਹੈ ਜਾਂ ਸਾਊਥ ਹੱਬ ਤੇ, ਅਤੇ ਦੋਵੇਂ ਥਾਵਾਂ ਤੇ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਤਾਜ਼ਾ ਸਕ੍ਰੀਨ ਤੇ ਹਾਲੇ ਇਹ ਨਹੀਂ ਦਿਖਿਆ ਕਿ ਉਹ ਕਿਹੜੇ ਹੱਬ ਤੇ ਹੈ।",
    ),
    premises: [or(atom("parcel_north"), atom("parcel_south")), not(and(atom("parcel_north"), atom("parcel_south")))],
    candidates: [
      { id: "C1", expression: atom("parcel_north"), text: t("Parcel P is at North Hub.", "पार्सल P नॉर्थ हब पर है।", "ਪਾਰਸਲ P ਨਾਰਥ ਹੱਬ ਤੇ ਹੈ।") },
      { id: "C2", expression: atom("parcel_south"), text: t("Parcel P is at South Hub.", "पार्सल P साउथ हब पर है।", "ਪਾਰਸਲ P ਸਾਊਥ ਹੱਬ ਤੇ ਹੈ।") },
      { id: "C3", expression: and(atom("parcel_north"), atom("parcel_south")), text: t("Parcel P is at both hubs at the same time.", "पार्सल P एक ही समय में दोनों हब पर है।", "ਪਾਰਸਲ P ਇੱਕੋ ਸਮੇਂ ਦੋਵੇਂ ਹੱਬਾਂ ਤੇ ਹੈ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("parcel_delivered"), text: t("Parcel P has already been delivered.", "पार्सल P की डिलीवरी हो चुकी है।", "ਪਾਰਸਲ P ਦੀ ਡਿਲਿਵਰੀ ਹੋ ਚੁੱਕੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-V2-EITHER-005", qlId: "STC-QL-002", difficulty: "HARD", surfaceArchetype: "SURVEY_REPORT",
    statement: t(
      "Under the survey coding rule, Response R is recorded in exactly one of two categories: satisfied or dissatisfied. The category assigned to R is not visible in the summary report.",
      "सर्वेक्षण कोडिंग नियम के अनुसार प्रतिक्रिया R को ठीक दो श्रेणियों में से केवल एक में दर्ज किया जाता है: संतुष्ट या असंतुष्ट। सारांश रिपोर्ट में R को दी गई श्रेणी दिखाई नहीं देती।",
      "ਸਰਵੇਖਣ ਕੋਡਿੰਗ ਨਿਯਮ ਅਨੁਸਾਰ ਜਵਾਬ R ਨੂੰ ਦੋ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਵਿੱਚ ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ: ਸੰਤੁਸ਼ਟ ਜਾਂ ਅਸੰਤੁਸ਼ਟ। ਸੰਖੇਪ ਰਿਪੋਰਟ ਵਿੱਚ R ਨੂੰ ਦਿੱਤੀ ਸ਼੍ਰੇਣੀ ਨਹੀਂ ਦਿਖਦੀ।",
    ),
    premises: [or(atom("r_satisfied"), atom("r_dissatisfied")), not(and(atom("r_satisfied"), atom("r_dissatisfied")))],
    candidates: [
      { id: "C1", expression: atom("r_satisfied"), text: t("Response R is recorded as satisfied.", "प्रतिक्रिया R को संतुष्ट के रूप में दर्ज किया गया है।", "ਜਵਾਬ R ਨੂੰ ਸੰਤੁਸ਼ਟ ਵਜੋਂ ਦਰਜ ਕੀਤਾ ਗਿਆ ਹੈ।") },
      { id: "C2", expression: atom("r_dissatisfied"), text: t("Response R is recorded as dissatisfied.", "प्रतिक्रिया R को असंतुष्ट के रूप में दर्ज किया गया है।", "ਜਵਾਬ R ਨੂੰ ਅਸੰਤੁਸ਼ਟ ਵਜੋਂ ਦਰਜ ਕੀਤਾ ਗਿਆ ਹੈ।") },
      { id: "C3", expression: and(atom("r_satisfied"), atom("r_dissatisfied")), text: t("Response R is recorded in both categories.", "प्रतिक्रिया R दोनों श्रेणियों में दर्ज है।", "ਜਵਾਬ R ਦੋਵੇਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਦਰਜ ਹੈ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("r_deleted"), text: t("Response R was deleted from the survey.", "प्रतिक्रिया R को सर्वेक्षण से हटा दिया गया।", "ਜਵਾਬ R ਨੂੰ ਸਰਵੇਖਣ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਗਿਆ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-V2-EITHER-006", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "EVENT_SEQUENCE",
    statement: t(
      "After scrutiny, Application Q will either move to document verification or be returned for correction, and exactly one of these two outcomes will occur. Its post-scrutiny status has not yet been posted.",
      "जांच के बाद आवेदन Q या तो दस्तावेज सत्यापन के लिए आगे जाएगा या सुधार के लिए वापस किया जाएगा, और इन दोनों में से ठीक एक परिणाम होगा। जांच के बाद की स्थिति अभी प्रकाशित नहीं हुई है।",
      "ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਅਰਜ਼ੀ Q ਜਾਂ ਤਾਂ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਵੱਲ ਅੱਗੇ ਜਾਵੇਗੀ ਜਾਂ ਸੋਧ ਲਈ ਵਾਪਸ ਕੀਤੀ ਜਾਵੇਗੀ, ਅਤੇ ਇਨ੍ਹਾਂ ਦੋਵਾਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਨਤੀਜਾ ਹੋਵੇਗਾ। ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਦੀ ਸਥਿਤੀ ਹਾਲੇ ਜਾਰੀ ਨਹੀਂ ਹੋਈ।",
    ),
    premises: [or(atom("q_verification"), atom("q_correction")), not(and(atom("q_verification"), atom("q_correction")))],
    candidates: [
      { id: "C1", expression: atom("q_verification"), text: t("Application Q will move to document verification.", "आवेदन Q दस्तावेज सत्यापन के लिए आगे जाएगा।", "ਅਰਜ਼ੀ Q ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਵੱਲ ਅੱਗੇ ਜਾਵੇਗੀ।") },
      { id: "C2", expression: atom("q_correction"), text: t("Application Q will be returned for correction.", "आवेदन Q सुधार के लिए वापस किया जाएगा।", "ਅਰਜ਼ੀ Q ਸੋਧ ਲਈ ਵਾਪਸ ਕੀਤੀ ਜਾਵੇਗੀ।") },
      { id: "C3", expression: and(atom("q_verification"), atom("q_correction")), text: t("Both outcomes will occur for Application Q.", "आवेदन Q के लिए दोनों परिणाम होंगे।", "ਅਰਜ਼ੀ Q ਲਈ ਦੋਵੇਂ ਨਤੀਜੇ ਹੋਣਗੇ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("q_withdrawn"), text: t("Application Q will be withdrawn.", "आवेदन Q वापस ले लिया जाएगा।", "ਅਰਜ਼ੀ Q ਵਾਪਸ ਲੈ ਲਈ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-V2-EITHER-007", qlId: "STC-QL-002", difficulty: "MEDIUM", surfaceArchetype: "CONTRAST_CONCESSION",
    statement: t(
      "Although both gates were considered, the shuttle will use either East Gate or West Gate for departure, but not both. The final gate has not yet been announced.",
      "हालांकि दोनों गेटों पर विचार किया गया, शटल प्रस्थान के लिए या तो ईस्ट गेट या वेस्ट गेट का उपयोग करेगी, लेकिन दोनों का नहीं। अंतिम गेट अभी घोषित नहीं हुआ है।",
      "ਭਾਵੇਂ ਦੋਵੇਂ ਗੇਟਾਂ ਤੇ ਵਿਚਾਰ ਕੀਤਾ ਗਿਆ, ਸ਼ਟਲ ਰਵਾਨਗੀ ਲਈ ਜਾਂ ਤਾਂ ਈਸਟ ਗੇਟ ਜਾਂ ਵੈਸਟ ਗੇਟ ਵਰਤੇਗੀ, ਪਰ ਦੋਵੇਂ ਨਹੀਂ। ਅੰਤਿਮ ਗੇਟ ਹਾਲੇ ਐਲਾਨਿਆ ਨਹੀਂ ਗਿਆ।",
    ),
    premises: [or(atom("shuttle_east"), atom("shuttle_west")), not(and(atom("shuttle_east"), atom("shuttle_west")))],
    candidates: [
      { id: "C1", expression: atom("shuttle_east"), text: t("The shuttle will depart through East Gate.", "शटल ईस्ट गेट से प्रस्थान करेगी।", "ਸ਼ਟਲ ਈਸਟ ਗੇਟ ਤੋਂ ਰਵਾਨਾ ਹੋਵੇਗੀ।") },
      { id: "C2", expression: atom("shuttle_west"), text: t("The shuttle will depart through West Gate.", "शटल वेस्ट गेट से प्रस्थान करेगी।", "ਸ਼ਟਲ ਵੈਸਟ ਗੇਟ ਤੋਂ ਰਵਾਨਾ ਹੋਵੇਗੀ।") },
      { id: "C3", expression: and(atom("shuttle_east"), atom("shuttle_west")), text: t("The shuttle will depart through both gates.", "शटल दोनों गेटों से प्रस्थान करेगी।", "ਸ਼ਟਲ ਦੋਵੇਂ ਗੇਟਾਂ ਤੋਂ ਰਵਾਨਾ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("shuttle_cancelled"), text: t("The shuttle service will be cancelled.", "शटल सेवा रद्द होगी।", "ਸ਼ਟਲ ਸੇਵਾ ਰੱਦ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-V2-EITHER-008", qlId: "STC-QL-002", difficulty: "HARD", surfaceArchetype: "ONE_LINE_FACT",
    statement: t(
      "The sealed result assigns Prize X to either Neha or Simran, but not to both; the winner's name has not yet been opened.",
      "सीलबंद परिणाम के अनुसार पुरस्कार X या तो नेहा को मिलेगा या सिमरन को, दोनों को नहीं; विजेता का नाम अभी खोला नहीं गया है।",
      "ਸੀਲਬੰਦ ਨਤੀਜੇ ਅਨੁਸਾਰ ਇਨਾਮ X ਜਾਂ ਤਾਂ ਨੇਹਾ ਨੂੰ ਮਿਲੇਗਾ ਜਾਂ ਸਿਮਰਨ ਨੂੰ, ਦੋਵਾਂ ਨੂੰ ਨਹੀਂ; ਜੇਤੂ ਦਾ ਨਾਮ ਹਾਲੇ ਖੋਲ੍ਹਿਆ ਨਹੀਂ ਗਿਆ।",
    ),
    premises: [or(atom("prize_neha"), atom("prize_simran")), not(and(atom("prize_neha"), atom("prize_simran")))],
    candidates: [
      { id: "C1", expression: atom("prize_neha"), text: t("Neha will receive Prize X.", "नेहा को पुरस्कार X मिलेगा।", "ਨੇਹਾ ਨੂੰ ਇਨਾਮ X ਮਿਲੇਗਾ।") },
      { id: "C2", expression: atom("prize_simran"), text: t("Simran will receive Prize X.", "सिमरन को पुरस्कार X मिलेगा।", "ਸਿਮਰਨ ਨੂੰ ਇਨਾਮ X ਮਿਲੇਗਾ।") },
      { id: "C3", expression: and(atom("prize_neha"), atom("prize_simran")), text: t("Neha and Simran will both receive Prize X.", "नेहा और सिमरन दोनों को पुरस्कार X मिलेगा।", "ਨੇਹਾ ਅਤੇ ਸਿਮਰਨ ਦੋਵਾਂ ਨੂੰ ਇਨਾਮ X ਮਿਲੇਗਾ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("prize_cancelled"), text: t("Prize X has been cancelled.", "पुरस्कार X रद्द कर दिया गया है।", "ਇਨਾਮ X ਰੱਦ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
