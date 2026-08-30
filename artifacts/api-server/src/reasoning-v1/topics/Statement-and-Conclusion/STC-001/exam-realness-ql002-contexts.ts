import type { LocalizedText, StcScenarioAuthority } from "./types.ts";
import { and, atom, not, or } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });

type ConjunctionRow = {
  id: string; aId: string; bId: string; extraId: string;
  statement: LocalizedText; a: LocalizedText; b: LocalizedText; notA: LocalizedText; extra: LocalizedText;
};
type DisjunctionRow = {
  id: string; aId: string; bId: string;
  statement: LocalizedText; paraphrase: LocalizedText; both: LocalizedText; neither: LocalizedText;
};

const conjunctionRows: readonly ConjunctionRow[] = [
  {
    id: "STC-SC-039", aId: "photo_required", bId: "signature_required", extraId: "fee_required",
    statement: t("The application requires a recent photograph and the applicant's signature.", "आवेदन में हाल की फोटो और आवेदक के हस्ताक्षर दोनों आवश्यक हैं।", "ਅਰਜ਼ੀ ਵਿੱਚ ਹਾਲੀਆ ਫੋਟੋ ਅਤੇ ਅਰਜ਼ੀਕਾਰ ਦੇ ਦਸਤਖ਼ਤ ਦੋਵੇਂ ਲਾਜ਼ਮੀ ਹਨ।"),
    a: t("A recent photograph is required with the application.", "आवेदन के साथ हाल की फोटो आवश्यक है।", "ਅਰਜ਼ੀ ਨਾਲ ਹਾਲੀਆ ਫੋਟੋ ਲਾਜ਼ਮੀ ਹੈ।"),
    b: t("The applicant's signature is required with the application.", "आवेदन के साथ आवेदक के हस्ताक्षर आवश्यक हैं।", "ਅਰਜ਼ੀ ਨਾਲ ਅਰਜ਼ੀਕਾਰ ਦੇ ਦਸਤਖ਼ਤ ਲਾਜ਼ਮੀ ਹਨ।"),
    notA: t("A photograph is not required with the application.", "आवेदन के साथ फोटो की आवश्यकता नहीं है।", "ਅਰਜ਼ੀ ਨਾਲ ਫੋਟੋ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"),
    extra: t("An additional application fee is compulsory.", "अतिरिक्त आवेदन शुल्क अनिवार्य है।", "ਵਾਧੂ ਅਰਜ਼ੀ ਫੀਸ ਲਾਜ਼ਮੀ ਹੈ।"),
  },
  {
    id: "STC-SC-040", aId: "admit_checked", bId: "id_checked", extraId: "biometric_checked",
    statement: t("At the entry gate, staff check the admit card and a valid identity document.", "प्रवेश द्वार पर कर्मचारी प्रवेश-पत्र और वैध पहचान दस्तावेज़ दोनों जाँचते हैं।", "ਦਾਖਲਾ ਗੇਟ ਤੇ ਕਰਮਚਾਰੀ ਐਡਮਿਟ ਕਾਰਡ ਅਤੇ ਵੈਧ ਪਛਾਣ ਦਸਤਾਵੇਜ਼ ਦੋਵੇਂ ਜਾਂਚਦੇ ਹਨ।"),
    a: t("The admit card is checked at the entry gate.", "प्रवेश द्वार पर प्रवेश-पत्र की जाँच होती है।", "ਦਾਖਲਾ ਗੇਟ ਤੇ ਐਡਮਿਟ ਕਾਰਡ ਦੀ ਜਾਂਚ ਹੁੰਦੀ ਹੈ।"),
    b: t("A valid identity document is checked at the entry gate.", "प्रवेश द्वार पर वैध पहचान दस्तावेज़ की जाँच होती है।", "ਦਾਖਲਾ ਗੇਟ ਤੇ ਵੈਧ ਪਛਾਣ ਦਸਤਾਵੇਜ਼ ਦੀ ਜਾਂਚ ਹੁੰਦੀ ਹੈ।"),
    notA: t("The admit card is not checked at the entry gate.", "प्रवेश द्वार पर प्रवेश-पत्र की जाँच नहीं होती।", "ਦਾਖਲਾ ਗੇਟ ਤੇ ਐਡਮਿਟ ਕਾਰਡ ਦੀ ਜਾਂਚ ਨਹੀਂ ਹੁੰਦੀ।"),
    extra: t("Biometric verification is compulsory at the entry gate.", "प्रवेश द्वार पर बायोमेट्रिक सत्यापन अनिवार्य है।", "ਦਾਖਲਾ ਗੇਟ ਤੇ ਬਾਇਓਮੈਟ੍ਰਿਕ ਜਾਂਚ ਲਾਜ਼ਮੀ ਹੈ।"),
  },
  {
    id: "STC-SC-041", aId: "training_lecture", bId: "training_practical", extraId: "training_exam",
    statement: t("The safety programme includes a classroom lecture and a practical demonstration.", "सुरक्षा कार्यक्रम में कक्षा व्याख्यान और व्यावहारिक प्रदर्शन दोनों शामिल हैं।", "ਸੁਰੱਖਿਆ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਕਲਾਸ ਲੈਕਚਰ ਅਤੇ ਪ੍ਰੈਕਟੀਕਲ ਡੈਮੋ ਦੋਵੇਂ ਸ਼ਾਮਲ ਹਨ।"),
    a: t("The safety programme includes a classroom lecture.", "सुरक्षा कार्यक्रम में कक्षा व्याख्यान शामिल है।", "ਸੁਰੱਖਿਆ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਕਲਾਸ ਲੈਕਚਰ ਸ਼ਾਮਲ ਹੈ।"),
    b: t("The safety programme includes a practical demonstration.", "सुरक्षा कार्यक्रम में व्यावहारिक प्रदर्शन शामिल है।", "ਸੁਰੱਖਿਆ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਪ੍ਰੈਕਟੀਕਲ ਡੈਮੋ ਸ਼ਾਮਲ ਹੈ।"),
    notA: t("The safety programme has no classroom lecture.", "सुरक्षा कार्यक्रम में कोई कक्षा व्याख्यान नहीं है।", "ਸੁਰੱਖਿਆ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਕੋਈ ਕਲਾਸ ਲੈਕਚਰ ਨਹੀਂ ਹੈ।"),
    extra: t("The safety programme ends with a written examination.", "सुरक्षा कार्यक्रम के अंत में लिखित परीक्षा होती है।", "ਸੁਰੱਖਿਆ ਪ੍ਰੋਗਰਾਮ ਦੇ ਅੰਤ ਵਿੱਚ ਲਿਖਤੀ ਪਰੀਖਿਆ ਹੁੰਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-042", aId: "report_website", bId: "report_board", extraId: "report_newspaper",
    statement: t("The audit report is displayed on the official website and on the office notice board.", "ऑडिट रिपोर्ट आधिकारिक वेबसाइट और कार्यालय सूचना-पट्ट दोनों पर प्रदर्शित है।", "ਆਡਿਟ ਰਿਪੋਰਟ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਅਤੇ ਦਫ਼ਤਰ ਦੇ ਨੋਟਿਸ ਬੋਰਡ ਦੋਵੇਂ ਤੇ ਲਗਾਈ ਗਈ ਹੈ।"),
    a: t("The audit report is displayed on the official website.", "ऑडिट रिपोर्ट आधिकारिक वेबसाइट पर प्रदर्शित है।", "ਆਡਿਟ ਰਿਪੋਰਟ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਤੇ ਲਗਾਈ ਗਈ ਹੈ।"),
    b: t("The audit report is displayed on the office notice board.", "ऑडिट रिपोर्ट कार्यालय सूचना-पट्ट पर प्रदर्शित है।", "ਆਡਿਟ ਰਿਪੋਰਟ ਦਫ਼ਤਰ ਦੇ ਨੋਟਿਸ ਬੋਰਡ ਤੇ ਲਗਾਈ ਗਈ ਹੈ।"),
    notA: t("The audit report is not displayed on the official website.", "ऑडिट रिपोर्ट आधिकारिक वेबसाइट पर प्रदर्शित नहीं है।", "ਆਡਿਟ ਰਿਪੋਰਟ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਤੇ ਨਹੀਂ ਲਗਾਈ ਗਈ।"),
    extra: t("The audit report is published in every newspaper.", "ऑडिट रिपोर्ट हर समाचार पत्र में प्रकाशित है।", "ਆਡਿਟ ਰਿਪੋਰਟ ਹਰ ਅਖ਼ਬਾਰ ਵਿੱਚ ਪ੍ਰਕਾਸ਼ਿਤ ਹੈ।"),
  },
  {
    id: "STC-SC-043", aId: "mobile_required", bId: "email_required", extraId: "landline_required",
    statement: t("The registration form asks for a mobile number and an email address.", "पंजीकरण फॉर्म में मोबाइल नंबर और ईमेल पता दोनों माँगे जाते हैं।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫਾਰਮ ਵਿੱਚ ਮੋਬਾਈਲ ਨੰਬਰ ਅਤੇ ਈਮੇਲ ਪਤਾ ਦੋਵੇਂ ਮੰਗੇ ਜਾਂਦੇ ਹਨ।"),
    a: t("A mobile number is required in the registration form.", "पंजीकरण फॉर्म में मोबाइल नंबर आवश्यक है।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫਾਰਮ ਵਿੱਚ ਮੋਬਾਈਲ ਨੰਬਰ ਲਾਜ਼ਮੀ ਹੈ।"),
    b: t("An email address is required in the registration form.", "पंजीकरण फॉर्म में ईमेल पता आवश्यक है।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫਾਰਮ ਵਿੱਚ ਈਮੇਲ ਪਤਾ ਲਾਜ਼ਮੀ ਹੈ।"),
    notA: t("A mobile number is not required in the registration form.", "पंजीकरण फॉर्म में मोबाइल नंबर की आवश्यकता नहीं है।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫਾਰਮ ਵਿੱਚ ਮੋਬਾਈਲ ਨੰਬਰ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"),
    extra: t("A landline number is compulsory in the registration form.", "पंजीकरण फॉर्म में लैंडलाइन नंबर अनिवार्य है।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫਾਰਮ ਵਿੱਚ ਲੈਂਡਲਾਈਨ ਨੰਬਰ ਲਾਜ਼ਮੀ ਹੈ।"),
  },
  {
    id: "STC-SC-044", aId: "clinic_vaccination", bId: "clinic_counselling", extraId: "clinic_surgery",
    statement: t("The outreach clinic provides vaccination and health counselling.", "आउटरीच क्लिनिक टीकाकरण और स्वास्थ्य परामर्श दोनों प्रदान करता है।", "ਆਉਟਰੀਚ ਕਲੀਨਿਕ ਟੀਕਾਕਰਨ ਅਤੇ ਸਿਹਤ ਸਲਾਹ ਦੋਵੇਂ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।"),
    a: t("Vaccination is provided at the outreach clinic.", "आउटरीच क्लिनिक में टीकाकरण उपलब्ध है।", "ਆਉਟਰੀਚ ਕਲੀਨਿਕ ਵਿੱਚ ਟੀਕਾਕਰਨ ਉਪਲਬਧ ਹੈ।"),
    b: t("Health counselling is provided at the outreach clinic.", "आउटरीच क्लिनिक में स्वास्थ्य परामर्श उपलब्ध है।", "ਆਉਟਰੀਚ ਕਲੀਨਿਕ ਵਿੱਚ ਸਿਹਤ ਸਲਾਹ ਉਪਲਬਧ ਹੈ।"),
    notA: t("Vaccination is not provided at the outreach clinic.", "आउटरीच क्लिनिक में टीकाकरण उपलब्ध नहीं है।", "ਆਉਟਰੀਚ ਕਲੀਨਿਕ ਵਿੱਚ ਟੀਕਾਕਰਨ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।"),
    extra: t("Minor surgery is performed at the outreach clinic.", "आउटरीच क्लिनिक में छोटी सर्जरी की जाती है।", "ਆਉਟਰੀਚ ਕਲੀਨਿਕ ਵਿੱਚ ਛੋਟੀ ਸਰਜਰੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-045", aId: "written_stage", bId: "interview_stage", extraId: "physical_stage",
    statement: t("The selection process has a written test and an interview.", "चयन प्रक्रिया में लिखित परीक्षा और साक्षात्कार दोनों हैं।", "ਚੋਣ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਲਿਖਤੀ ਪਰੀਖਿਆ ਅਤੇ ਇੰਟਰਵਿਊ ਦੋਵੇਂ ਹਨ।"),
    a: t("A written test is part of the selection process.", "लिखित परीक्षा चयन प्रक्रिया का भाग है।", "ਲਿਖਤੀ ਪਰੀਖਿਆ ਚੋਣ ਪ੍ਰਕਿਰਿਆ ਦਾ ਹਿੱਸਾ ਹੈ।"),
    b: t("An interview is part of the selection process.", "साक्षात्कार चयन प्रक्रिया का भाग है।", "ਇੰਟਰਵਿਊ ਚੋਣ ਪ੍ਰਕਿਰਿਆ ਦਾ ਹਿੱਸਾ ਹੈ।"),
    notA: t("There is no written test in the selection process.", "चयन प्रक्रिया में लिखित परीक्षा नहीं है।", "ਚੋਣ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਲਿਖਤੀ ਪਰੀਖਿਆ ਨਹੀਂ ਹੈ।"),
    extra: t("A physical efficiency test is compulsory for every post.", "हर पद के लिए शारीरिक दक्षता परीक्षा अनिवार्य है।", "ਹਰ ਅਸਾਮੀ ਲਈ ਸਰੀਰਕ ਦੱਖਲਤਾ ਟੈਸਟ ਲਾਜ਼ਮੀ ਹੈ।"),
  },
  {
    id: "STC-SC-046", aId: "borrowing_access", bId: "reading_room_access", extraId: "home_delivery",
    statement: t("Standard membership allows book borrowing and use of the reading room.", "सामान्य सदस्यता से पुस्तक उधार लेने और वाचनालय उपयोग करने की सुविधा मिलती है।", "ਆਮ ਮੈਂਬਰਸ਼ਿਪ ਨਾਲ ਕਿਤਾਬਾਂ ਉਧਾਰ ਲੈਣ ਅਤੇ ਰੀਡਿੰਗ ਰੂਮ ਵਰਤਣ ਦੀ ਸਹੂਲਤ ਮਿਲਦੀ ਹੈ।"),
    a: t("Standard members can borrow books.", "सामान्य सदस्य पुस्तकें उधार ले सकते हैं।", "ਆਮ ਮੈਂਬਰ ਕਿਤਾਬਾਂ ਉਧਾਰ ਲੈ ਸਕਦੇ ਹਨ।"),
    b: t("Standard members can use the reading room.", "सामान्य सदस्य वाचनालय का उपयोग कर सकते हैं।", "ਆਮ ਮੈਂਬਰ ਰੀਡਿੰਗ ਰੂਮ ਵਰਤ ਸਕਦੇ ਹਨ।"),
    notA: t("Standard members cannot borrow books.", "सामान्य सदस्य पुस्तकें उधार नहीं ले सकते।", "ਆਮ ਮੈਂਬਰ ਕਿਤਾਬਾਂ ਉਧਾਰ ਨਹੀਂ ਲੈ ਸਕਦੇ।"),
    extra: t("Standard membership includes home delivery of books.", "सामान्य सदस्यता में पुस्तकों की होम डिलीवरी शामिल है।", "ਆਮ ਮੈਂਬਰਸ਼ਿਪ ਵਿੱਚ ਕਿਤਾਬਾਂ ਦੀ ਘਰ ਡਿਲਿਵਰੀ ਸ਼ਾਮਲ ਹੈ।"),
  },
] as const;

const disjunctionRows: readonly DisjunctionRow[] = [
  {
    id: "STC-SC-047", aId: "support_phone", bId: "support_email",
    statement: t("A support request is answered by phone or by email.", "सहायता अनुरोध का उत्तर फोन या ईमेल से दिया जाता है।", "ਸਹਾਇਤਾ ਬੇਨਤੀ ਦਾ ਜਵਾਬ ਫ਼ੋਨ ਜਾਂ ਈਮੇਲ ਰਾਹੀਂ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।"),
    paraphrase: t("At least one of the two channels—phone or email—is used to answer a support request.", "सहायता अनुरोध का उत्तर देने के लिए फोन या ईमेल में से कम-से-कम एक माध्यम उपयोग होता है।", "ਸਹਾਇਤਾ ਬੇਨਤੀ ਦਾ ਜਵਾਬ ਦੇਣ ਲਈ ਫ਼ੋਨ ਜਾਂ ਈਮੇਲ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮਾਧਿਅਮ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"),
    both: t("Every support request is necessarily answered by both phone and email.", "हर सहायता अनुरोध का उत्तर अनिवार्य रूप से फोन और ईमेल दोनों से दिया जाता है।", "ਹਰ ਸਹਾਇਤਾ ਬੇਨਤੀ ਦਾ ਜਵਾਬ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਫ਼ੋਨ ਅਤੇ ਈਮੇਲ ਦੋਵੇਂ ਰਾਹੀਂ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।"),
    neither: t("Support requests are answered by neither phone nor email.", "सहायता अनुरोध का उत्तर न फोन से दिया जाता है और न ईमेल से।", "ਸਹਾਇਤਾ ਬੇਨਤੀ ਦਾ ਜਵਾਬ ਨਾ ਫ਼ੋਨ ਰਾਹੀਂ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਨਾ ਈਮੇਲ ਰਾਹੀਂ।"),
  },
  {
    id: "STC-SC-048", aId: "payment_upi", bId: "payment_card",
    statement: t("The online fee can be paid by UPI or by debit card.", "ऑनलाइन शुल्क का भुगतान UPI या डेबिट कार्ड से किया जा सकता है।", "ਆਨਲਾਈਨ ਫੀਸ ਦਾ ਭੁਗਤਾਨ UPI ਜਾਂ ਡੈਬਿਟ ਕਾਰਡ ਰਾਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"),
    paraphrase: t("At least one permitted payment method is UPI or debit card.", "अनुमत भुगतान तरीकों में UPI या डेबिट कार्ड में से कम-से-कम एक विकल्प उपलब्ध है।", "ਮਨਜ਼ੂਰ ਭੁਗਤਾਨ ਤਰੀਕਿਆਂ ਵਿੱਚ UPI ਜਾਂ ਡੈਬਿਟ ਕਾਰਡ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਿਕਲਪ ਉਪਲਬਧ ਹੈ।"),
    both: t("A payer must use both UPI and debit card for the same fee.", "एक ही शुल्क के लिए UPI और डेबिट कार्ड दोनों का उपयोग करना अनिवार्य है।", "ਇੱਕੋ ਫੀਸ ਲਈ UPI ਅਤੇ ਡੈਬਿਟ ਕਾਰਡ ਦੋਵੇਂ ਵਰਤਣੇ ਲਾਜ਼ਮੀ ਹਨ।"),
    neither: t("Neither UPI nor debit card can be used for the online fee.", "ऑनलाइन शुल्क के लिए न UPI और न डेबिट कार्ड का उपयोग किया जा सकता है।", "ਆਨਲਾਈਨ ਫੀਸ ਲਈ ਨਾ UPI ਅਤੇ ਨਾ ਡੈਬਿਟ ਕਾਰਡ ਵਰਤੇ ਜਾ ਸਕਦੇ ਹਨ।"),
  },
  {
    id: "STC-SC-049", aId: "certificate_office", bId: "certificate_courier",
    statement: t("The certificate can be collected from the office or delivered by courier.", "प्रमाणपत्र कार्यालय से लिया जा सकता है या कूरियर से मंगाया जा सकता है।", "ਸਰਟੀਫਿਕੇਟ ਦਫ਼ਤਰ ਤੋਂ ਲਿਆ ਜਾ ਸਕਦਾ ਹੈ ਜਾਂ ਕੂਰੀਅਰ ਰਾਹੀਂ ਮੰਗਵਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।"),
    paraphrase: t("At least one available certificate-delivery mode is office collection or courier.", "प्रमाणपत्र पाने के उपलब्ध तरीकों में कार्यालय से लेना या कूरियर में से कम-से-कम एक विकल्प है।", "ਸਰਟੀਫਿਕੇਟ ਲੈਣ ਦੇ ਉਪਲਬਧ ਤਰੀਕਿਆਂ ਵਿੱਚ ਦਫ਼ਤਰ ਤੋਂ ਲੈਣਾ ਜਾਂ ਕੂਰੀਅਰ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਿਕਲਪ ਹੈ।"),
    both: t("Every certificate must be collected from the office and also sent by courier.", "हर प्रमाणपत्र कार्यालय से लेना और कूरियर से भी मंगाना अनिवार्य है।", "ਹਰ ਸਰਟੀਫਿਕੇਟ ਦਫ਼ਤਰ ਤੋਂ ਲੈਣਾ ਅਤੇ ਕੂਰੀਅਰ ਰਾਹੀਂ ਵੀ ਮੰਗਵਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।"),
    neither: t("The certificate can neither be collected from the office nor delivered by courier.", "प्रमाणपत्र न कार्यालय से लिया जा सकता है और न कूरियर से मंगाया जा सकता है।", "ਸਰਟੀਫਿਕੇਟ ਨਾ ਦਫ਼ਤਰ ਤੋਂ ਲਿਆ ਜਾ ਸਕਦਾ ਹੈ ਅਤੇ ਨਾ ਕੂਰੀਅਰ ਰਾਹੀਂ ਮੰਗਵਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।"),
  },
  {
    id: "STC-SC-050", aId: "notice_sms", bId: "notice_email",
    statement: t("The update is sent to candidates by SMS or email.", "अपडेट उम्मीदवारों को SMS या ईमेल से भेजा जाता है।", "ਅਪਡੇਟ ਉਮੀਦਵਾਰਾਂ ਨੂੰ SMS ਜਾਂ ਈਮੇਲ ਰਾਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ।"),
    paraphrase: t("Candidates receive the update through at least one of the stated channels: SMS or email.", "उम्मीदवारों को अपडेट SMS या ईमेल में से कम-से-कम एक माध्यम से मिलता है।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਅਪਡੇਟ SMS ਜਾਂ ਈਮੇਲ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮਾਧਿਅਮ ਰਾਹੀਂ ਮਿਲਦਾ ਹੈ।"),
    both: t("Every candidate necessarily receives the update through both SMS and email.", "हर उम्मीदवार को अपडेट अनिवार्य रूप से SMS और ईमेल दोनों से मिलता है।", "ਹਰ ਉਮੀਦਵਾਰ ਨੂੰ ਅਪਡੇਟ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ SMS ਅਤੇ ਈਮੇਲ ਦੋਵੇਂ ਰਾਹੀਂ ਮਿਲਦਾ ਹੈ।"),
    neither: t("Candidates receive the update through neither SMS nor email.", "उम्मीदवारों को अपडेट न SMS से मिलता है और न ईमेल से।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਅਪਡੇਟ ਨਾ SMS ਰਾਹੀਂ ਮਿਲਦਾ ਹੈ ਅਤੇ ਨਾ ਈਮੇਲ ਰਾਹੀਂ।"),
  },
  {
    id: "STC-SC-051", aId: "register_online", bId: "register_kiosk",
    statement: t("Registration can be completed online or at the service kiosk.", "पंजीकरण ऑनलाइन या सेवा कियोस्क पर पूरा किया जा सकता है।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਆਨਲਾਈਨ ਜਾਂ ਸੇਵਾ ਕਿਓਸਕ ਤੇ ਪੂਰੀ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।"),
    paraphrase: t("At least one available registration mode is online registration or the service kiosk.", "उपलब्ध पंजीकरण तरीकों में ऑनलाइन या सेवा कियोस्क में से कम-से-कम एक विकल्प है।", "ਉਪਲਬਧ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਤਰੀਕਿਆਂ ਵਿੱਚ ਆਨਲਾਈਨ ਜਾਂ ਸੇਵਾ ਕਿਓਸਕ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਿਕਲਪ ਹੈ।"),
    both: t("A person must complete registration both online and at the service kiosk.", "व्यक्ति को पंजीकरण ऑनलाइन और सेवा कियोस्क दोनों पर पूरा करना अनिवार्य है।", "ਵਿਅਕਤੀ ਨੂੰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਆਨਲਾਈਨ ਅਤੇ ਸੇਵਾ ਕਿਓਸਕ ਦੋਵੇਂ ਥਾਵਾਂ ਤੇ ਪੂਰੀ ਕਰਨੀ ਲਾਜ਼ਮੀ ਹੈ।"),
    neither: t("Registration can be completed neither online nor at the service kiosk.", "पंजीकरण न ऑनलाइन और न सेवा कियोस्क पर पूरा किया जा सकता है।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨਾ ਆਨਲਾਈਨ ਅਤੇ ਨਾ ਸੇਵਾ ਕਿਓਸਕ ਤੇ ਪੂਰੀ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-052", aId: "meeting_hall_a", bId: "meeting_hall_b",
    statement: t("The orientation meeting will be held in Hall A or Hall B.", "ओरिएंटेशन बैठक हॉल A या हॉल B में होगी।", "ਓਰੀਐਂਟੇਸ਼ਨ ਮੀਟਿੰਗ ਹਾਲ A ਜਾਂ ਹਾਲ B ਵਿੱਚ ਹੋਵੇਗੀ।"),
    paraphrase: t("The orientation meeting will use at least one of the stated halls, A or B.", "ओरिएंटेशन बैठक के लिए हॉल A या B में से कम-से-कम एक हॉल उपयोग होगा।", "ਓਰੀਐਂਟੇਸ਼ਨ ਮੀਟਿੰਗ ਲਈ ਹਾਲ A ਜਾਂ B ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਹਾਲ ਵਰਤਿਆ ਜਾਵੇਗਾ।"),
    both: t("The orientation meeting must be held in both Hall A and Hall B.", "ओरिएंटेशन बैठक हॉल A और हॉल B दोनों में होना अनिवार्य है।", "ਓਰੀਐਂਟੇਸ਼ਨ ਮੀਟਿੰਗ ਹਾਲ A ਅਤੇ ਹਾਲ B ਦੋਵੇਂ ਵਿੱਚ ਹੋਣੀ ਲਾਜ਼ਮੀ ਹੈ।"),
    neither: t("The orientation meeting will be held in neither Hall A nor Hall B.", "ओरिएंटेशन बैठक न हॉल A में होगी और न हॉल B में।", "ਓਰੀਐਂਟੇਸ਼ਨ ਮੀਟਿੰਗ ਨਾ ਹਾਲ A ਵਿੱਚ ਹੋਵੇਗੀ ਅਤੇ ਨਾ ਹਾਲ B ਵਿੱਚ।"),
  },
] as const;

function conjunction(row: ConjunctionRow): StcScenarioAuthority {
  return {
    id: row.id,
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: row.statement,
    premises: [and(atom(row.aId), atom(row.bId))],
    candidates: [
      { id: "C1", expression: atom(row.aId), text: row.a },
      { id: "C2", expression: atom(row.bId), text: row.b },
      { id: "C3", expression: not(atom(row.aId)), text: row.notA, defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom(row.extraId), text: row.extra, defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  };
}

function disjunction(row: DisjunctionRow): StcScenarioAuthority {
  const premise = or(atom(row.aId), atom(row.bId));
  return {
    id: row.id,
    qlId: "STC-QL-002",
    difficulty: "HARD",
    statement: row.statement,
    premises: [premise],
    candidates: [
      { id: "C1", expression: premise, text: row.statement },
      { id: "C2", expression: premise, text: row.paraphrase },
      { id: "C3", expression: and(atom(row.aId), atom(row.bId)), text: row.both, defectIfNotEntailed: "OVERCLAIM" },
      { id: "C4", expression: not(premise), text: row.neither, defectIfNotEntailed: "POLARITY_FLIP" },
    ],
  };
}

export const STC_QL002_EXAM_REALNESS_CONTEXTS: readonly StcScenarioAuthority[] = [
  ...conjunctionRows.map(conjunction),
  ...disjunctionRows.map(disjunction),
];
