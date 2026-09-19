import type { SifContextDomain, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

type L = readonly [string, string, string];
type Entry = readonly [id: string, domain: SifContextDomain, subject: L, detail: L];
const t = ([en, hi, pa]: L): SifLocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const guard = { evaluatesSupport: true, assumptionQuestion: false, conclusionQuestion: false, argumentQuestion: false, causeEffectQuestion: false, courseOfActionQuestion: false } as const;

function make(id: string, domain: SifContextDomain, statement: L, valid: L, invalid: L, explanation: L, distractorType: "UNSUPPORTED_DETAIL" | "CAUSE_ASSUMPTION" | "STRONGER_CLAIM" | "TIME_DISTORTION"): SifScenarioAuthority {
  return { id, cpId: "SIF-CP001", difficulty: "EASY", domain, mechanisms: ["DIRECT_FACT"], statement: t(statement), facts: [{ id: "F1", text: t(statement) }], candidates: [{ id: "I", text: t(valid), follows: true, strength: "CERTAIN", supportFactIds: ["F1"] }, { id: "II", text: t(invalid), follows: false, strength: "POSSIBLE_ONLY", supportFactIds: ["F1"], distractorType }], explanation: t(explanation), identityGuard: guard };
}

const statusEntries: readonly Entry[] = [
  ["SIF-CP001-CLAIM-ACKNOWLEDGEMENT", "BANKING", ["The insurance claim", "बीमा दावा", "ਬੀਮਾ ਦਾਅਵਾ"], ["the assessment desk", "मूल्यांकन डेस्क", "ਮੁਲਾਂਕਣ ਡੈਸਕ"]],
  ["SIF-CP001-REPAIR-ACKNOWLEDGEMENT", "EVERYDAY", ["The repair request", "मरम्मत अनुरोध", "ਮੁਰੰਮਤ ਬੇਨਤੀ"], ["the technical section", "तकनीकी अनुभाग", "ਤਕਨੀਕੀ ਸ਼ਾਖਾ"]],
  ["SIF-CP001-ADMISSION-ACKNOWLEDGEMENT", "EDUCATION", ["The admission form", "प्रवेश फॉर्म", "ਦਾਖ਼ਲਾ ਫਾਰਮ"], ["the verification committee", "सत्यापन समिति", "ਤਸਦੀਕ ਕਮੇਟੀ"]],
  ["SIF-CP001-VENDOR-ACKNOWLEDGEMENT", "BUSINESS", ["The vendor application", "विक्रेता आवेदन", "ਵਿਕਰੇਤਾ ਅਰਜ਼ੀ"], ["the procurement team", "खरीद दल", "ਖਰੀਦ ਟੀਮ"]],
  ["SIF-CP001-TRANSFER-ACKNOWLEDGEMENT", "WORKPLACE", ["The transfer request", "स्थानांतरण अनुरोध", "ਤਬਾਦਲਾ ਬੇਨਤੀ"], ["the personnel section", "कार्मिक अनुभाग", "ਅਮਲਾ ਸ਼ਾਖਾ"]],
  ["SIF-CP001-PERMIT-ACKNOWLEDGEMENT", "PUBLIC_ADMINISTRATION", ["The permit application", "परमिट आवेदन", "ਪਰਮਿਟ ਅਰਜ਼ੀ"], ["the scrutiny branch", "जांच शाखा", "ਜਾਂਚ ਸ਼ਾਖਾ"]],
];

const statusAuthorities = statusEntries.map(([id, domain, subject, destination]) => make(id, domain,
  [`${subject[0]} was received on Monday, acknowledged the same day, and forwarded to ${destination[0]} on Tuesday.`, `${subject[1]} सोमवार को प्राप्त हुआ, उसी दिन उसकी पावती दी गई और मंगलवार को उसे ${destination[1]} भेजा गया।`, `${subject[2]} ਸੋਮਵਾਰ ਨੂੰ ਮਿਲੀ, ਉਸੇ ਦਿਨ ਉਸ ਦੀ ਰਸੀਦ ਦਿੱਤੀ ਗਈ ਅਤੇ ਮੰਗਲਵਾਰ ਨੂੰ ਉਸ ਨੂੰ ${destination[2]} ਭੇਜਿਆ ਗਿਆ।`],
  [`${subject[0]} reached ${destination[0]} after it was received.`, `${subject[1]} प्राप्त होने के बाद ${destination[1]} पहुंचा।`, `${subject[2]} ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${destination[2]} ਪਹੁੰਚੀ।`],
  [`${subject[0]} was finally approved on Tuesday.`, `${subject[1]} मंगलवार को अंतिम रूप से मंजूर हो गया।`, `${subject[2]} ਮੰਗਲਵਾਰ ਨੂੰ ਅੰਤਿਮ ਤੌਰ ਉੱਤੇ ਮਨਜ਼ੂਰ ਹੋ ਗਈ।`],
  [`The stated sequence confirms receipt followed by forwarding to ${destination[0]}. Forwarding is not final approval. Therefore, only I follows.`, `दिया गया क्रम प्राप्ति के बाद ${destination[1]} भेजे जाने की पुष्टि करता है। भेजना अंतिम मंजूरी नहीं है। इसलिए केवल I सही है।`, `ਦਿੱਤਾ ਕ੍ਰਮ ਪ੍ਰਾਪਤੀ ਤੋਂ ਬਾਅਦ ${destination[2]} ਭੇਜੇ ਜਾਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ। ਭੇਜਣਾ ਅੰਤਿਮ ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।`], "STRONGER_CLAIM"));

const placementEntries: readonly Entry[] = [
  ["SIF-CP001-ARCHIVE-PLACEMENT", "PUBLIC_ADMINISTRATION", ["The original registers", "मूल रजिस्टर", "ਮੂਲ ਰਜਿਸਟਰ"], ["the record room", "अभिलेख कक्ष", "ਰਿਕਾਰਡ ਕਮਰਾ"]],
  ["SIF-CP001-KEY-PLACEMENT", "WORKPLACE", ["The spare keys", "अतिरिक्त चाबियां", "ਵਾਧੂ ਚਾਬੀਆਂ"], ["the security cabinet", "सुरक्षा अलमारी", "ਸੁਰੱਖਿਆ ਅਲਮਾਰੀ"]],
  ["SIF-CP001-BOOK-PLACEMENT", "EDUCATION", ["The reference books", "संदर्भ पुस्तकें", "ਹਵਾਲਾ ਕਿਤਾਬਾਂ"], ["the reading-room shelf", "वाचनालय की शेल्फ", "ਪੜ੍ਹਨ ਕਮਰੇ ਦੀ ਸ਼ੈਲਫ਼"]],
  ["SIF-CP001-CHEQUE-PLACEMENT", "BANKING", ["The verified cheques", "सत्यापित चेक", "ਤਸਦੀਕ ਕੀਤੇ ਚੈੱਕ"], ["the processing tray", "प्रसंस्करण ट्रे", "ਕਾਰਵਾਈ ਟਰੇ"]],
  ["SIF-CP001-PARCEL-PLACEMENT", "TRANSPORT", ["The undelivered parcels", "अवितरित पार्सल", "ਨਾ-ਪਹੁੰਚੇ ਪਾਰਸਲ"], ["the return counter", "वापसी काउंटर", "ਵਾਪਸੀ ਕਾਊਂਟਰ"]],
  ["SIF-CP001-TOOL-PLACEMENT", "BUSINESS", ["The inspection tools", "निरीक्षण उपकरण", "ਜਾਂਚ ਸੰਦ"], ["the equipment cabinet", "उपकरण अलमारी", "ਸਾਜ਼ੋ-ਸਾਮਾਨ ਅਲਮਾਰੀ"]],
];

const placementAuthorities = placementEntries.map(([id, domain, subject, location]) => make(id, domain,
  [`${subject[0]} were labelled and placed in ${location[0]}. A duplicate list was kept at the main desk.`, `${subject[1]} पर लेबल लगाकर उन्हें ${location[1]} में रखा गया। उनकी दूसरी सूची मुख्य डेस्क पर रखी गई।`, `${subject[2]} ਉੱਤੇ ਲੇਬਲ ਲਗਾ ਕੇ ਉਨ੍ਹਾਂ ਨੂੰ ${location[2]} ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ। ਉਨ੍ਹਾਂ ਦੀ ਦੂਜੀ ਸੂਚੀ ਮੁੱਖ ਡੈਸਕ ਉੱਤੇ ਰੱਖੀ ਗਈ।`],
  [`${subject[0]} were stored in ${location[0]}.`, `${subject[1]} ${location[1]} में रखे गए।`, `${subject[2]} ${location[2]} ਵਿੱਚ ਰੱਖੇ ਗਏ।`],
  [`The duplicate list contained the original items.`, `दूसरी सूची में मूल वस्तुएं रखी थीं।`, `ਦੂਜੀ ਸੂਚੀ ਵਿੱਚ ਮੂਲ ਵਸਤੂਆਂ ਰੱਖੀਆਂ ਸਨ।`],
  [`The statement directly places ${subject[0].toLowerCase()} in ${location[0]}. A list is only a record of the items, not the items themselves. Therefore, only I follows.`, `कथन सीधे ${subject[1]} को ${location[1]} में रखे जाने की बात कहता है। सूची केवल रिकॉर्ड है, मूल वस्तुएं नहीं। इसलिए केवल I सही है।`, `ਕਥਨ ਸਿੱਧਾ ${subject[2]} ਨੂੰ ${location[2]} ਵਿੱਚ ਰੱਖੇ ਜਾਣ ਦੀ ਗੱਲ ਕਹਿੰਦਾ ਹੈ। ਸੂਚੀ ਸਿਰਫ਼ ਰਿਕਾਰਡ ਹੈ, ਮੂਲ ਵਸਤੂਆਂ ਨਹੀਂ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।`], "UNSUPPORTED_DETAIL"));

const scheduleEntries: readonly Entry[] = [
  ["SIF-CP001-LIBRARY-SCHEDULE", "EDUCATION", ["The library", "पुस्तकालय", "ਲਾਇਬ੍ਰੇਰੀ"], ["book-return service", "पुस्तक वापसी सेवा", "ਕਿਤਾਬ ਵਾਪਸੀ ਸੇਵਾ"]],
  ["SIF-CP001-BANK-SCHEDULE", "BANKING", ["The branch", "शाखा", "ਸ਼ਾਖਾ"], ["cash service", "नकद सेवा", "ਨਕਦ ਸੇਵਾ"]],
  ["SIF-CP001-CLINIC-SCHEDULE", "EVERYDAY", ["The clinic", "क्लिनिक", "ਕਲੀਨਿਕ"], ["general consultation", "सामान्य परामर्श", "ਆਮ ਸਲਾਹ"]],
  ["SIF-CP001-OFFICE-SCHEDULE", "PUBLIC_ADMINISTRATION", ["The public office", "जन कार्यालय", "ਜਨਤਕ ਦਫ਼ਤਰ"], ["document collection", "दस्तावेज संग्रह", "ਦਸਤਾਵੇਜ਼ ਪ੍ਰਾਪਤੀ"]],
  ["SIF-CP001-SERVICE-SCHEDULE", "BUSINESS", ["The service centre", "सेवा केंद्र", "ਸੇਵਾ ਕੇਂਦਰ"], ["customer support", "ग्राहक सहायता", "ਗਾਹਕ ਸਹਾਇਤਾ"]],
  ["SIF-CP001-DEPOT-SCHEDULE", "TRANSPORT", ["The depot", "डिपो", "ਡਿਪੂ"], ["pass renewal", "पास नवीनीकरण", "ਪਾਸ ਨਵੀਨੀਕਰਨ"]],
];

const scheduleAuthorities = scheduleEntries.map(([id, domain, place, service]) => make(id, domain,
  [`${place[0]} provides ${service[0]} from Monday to Friday. On Saturday, only enquiry service is available.`, `${place[1]} में सोमवार से शुक्रवार तक ${service[1]} उपलब्ध है। शनिवार को केवल पूछताछ सेवा उपलब्ध होती है।`, `${place[2]} ਵਿੱਚ ਸੋਮਵਾਰ ਤੋਂ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ${service[2]} ਉਪਲਬਧ ਹੈ। ਸ਼ਨੀਵਾਰ ਨੂੰ ਸਿਰਫ਼ ਪੁੱਛਗਿੱਛ ਸੇਵਾ ਉਪਲਬਧ ਹੁੰਦੀ ਹੈ।`],
  [`${service[0]} is not available there on Saturday.`, `वहां शनिवार को ${service[1]} उपलब्ध नहीं है।`, `ਉੱਥੇ ਸ਼ਨੀਵਾਰ ਨੂੰ ${service[2]} ਉਪਲਬਧ ਨਹੀਂ ਹੈ।`],
  [`${place[0]} remains completely closed on Saturday.`, `${place[1]} शनिवार को पूरी तरह बंद रहता है।`, `${place[2]} ਸ਼ਨੀਵਾਰ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੰਦ ਰਹਿੰਦਾ ਹੈ।`],
  [`Only enquiry service is available on Saturday, so ${service[0]} is unavailable then. Enquiry service being open means the premises are not necessarily closed. Therefore, only I follows.`, `शनिवार को केवल पूछताछ सेवा उपलब्ध है, इसलिए ${service[1]} उपलब्ध नहीं है। पूछताछ सेवा खुली होने से परिसर को पूरी तरह बंद नहीं माना जा सकता। इसलिए केवल I सही है।`, `ਸ਼ਨੀਵਾਰ ਨੂੰ ਸਿਰਫ਼ ਪੁੱਛਗਿੱਛ ਸੇਵਾ ਉਪਲਬਧ ਹੈ, ਇਸ ਲਈ ${service[2]} ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਪੁੱਛਗਿੱਛ ਸੇਵਾ ਖੁੱਲ੍ਹੀ ਹੋਣ ਕਰਕੇ ਥਾਂ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੰਦ ਨਹੀਂ ਮੰਨਿਆ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।`], "STRONGER_CLAIM"));

const roleEntries: readonly Entry[] = [
  ["SIF-CP001-AUDIT-ROLE", "WORKPLACE", ["The accounts officer", "लेखा अधिकारी", "ਲੇਖਾ ਅਧਿਕਾਰੀ"], ["verify the monthly expense statement", "मासिक व्यय विवरण की जांच करना", "ਮਹੀਨਾਵਾਰ ਖਰਚ ਵੇਰਵੇ ਦੀ ਜਾਂਚ ਕਰਨਾ"]],
  ["SIF-CP001-INVIGILATION-ROLE", "EDUCATION", ["The senior teacher", "वरिष्ठ शिक्षक", "ਸੀਨੀਅਰ ਅਧਿਆਪਕ"], ["supervise the morning examination", "सुबह की परीक्षा की निगरानी करना", "ਸਵੇਰ ਦੀ ਪ੍ਰੀਖਿਆ ਦੀ ਨਿਗਰਾਨੀ ਕਰਨਾ"]],
  ["SIF-CP001-CASH-ROLE", "BANKING", ["The head cashier", "मुख्य कैशियर", "ਮੁੱਖ ਕੈਸ਼ੀਅਰ"], ["verify the closing cash balance", "अंतिम नकद शेष की जांच करना", "ਅੰਤਿਮ ਨਕਦ ਬਕਾਇਆ ਜਾਂਚਣਾ"]],
  ["SIF-CP001-DISPATCH-ROLE", "BUSINESS", ["The dispatch supervisor", "प्रेषण पर्यवेक्षक", "ਭੇਜਣ ਨਿਗਰਾਨ"], ["check the outward-goods register", "बाहरी माल रजिस्टर की जांच करना", "ਬਾਹਰ ਜਾਣ ਵਾਲੇ ਮਾਲ ਦਾ ਰਜਿਸਟਰ ਜਾਂਚਣਾ"]],
  ["SIF-CP001-INSPECTION-ROLE", "PUBLIC_ADMINISTRATION", ["The field officer", "क्षेत्रीय अधिकारी", "ਫੀਲਡ ਅਧਿਕਾਰੀ"], ["inspect the completed repair work", "पूर्ण मरम्मत कार्य का निरीक्षण करना", "ਪੂਰੇ ਹੋਏ ਮੁਰੰਮਤ ਕੰਮ ਦੀ ਜਾਂਚ ਕਰਨਾ"]],
  ["SIF-CP001-DEPOT-ROLE", "TRANSPORT", ["The depot manager", "डिपो प्रबंधक", "ਡਿਪੂ ਪ੍ਰਬੰਧਕ"], ["review the vehicle-maintenance log", "वाहन रखरखाव लॉग की समीक्षा करना", "ਵਾਹਨ ਰੱਖ-ਰਖਾਅ ਲਾਗ ਦੀ ਸਮੀਖਿਆ ਕਰਨਾ"]],
];

const roleAuthorities = roleEntries.map(([id, domain, role, task]) => make(id, domain,
  [`The department assigned ${role[0].toLowerCase()} to ${task[0]} and submit a signed report by Friday.`, `विभाग ने ${role[1]} को ${task[1]} और शुक्रवार तक हस्ताक्षरित रिपोर्ट जमा करने की जिम्मेदारी दी।`, `ਵਿਭਾਗ ਨੇ ${role[2]} ਨੂੰ ${task[2]} ਅਤੇ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਦਸਤਖ਼ਤ ਕੀਤੀ ਰਿਪੋਰਟ ਜਮ੍ਹਾਂ ਕਰਨ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਦਿੱਤੀ।`],
  [`${role[0]} was responsible for the stated task.`, `${role[1]} दिए गए कार्य के लिए जिम्मेदार था।`, `${role[2]} ਦਿੱਤੇ ਕੰਮ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਸੀ।`],
  [`${role[0]} had already completed the task.`, `${role[1]} कार्य पहले ही पूरा कर चुका था।`, `${role[2]} ਕੰਮ ਪਹਿਲਾਂ ਹੀ ਪੂਰਾ ਕਰ ਚੁੱਕਾ ਸੀ।`],
  [`The assignment establishes ${role[0].toLowerCase()}'s responsibility, so I follows. An assignment and deadline do not prove that the task has already been completed. Therefore, II does not follow.`, `कार्य सौंपे जाने से ${role[1]} की जिम्मेदारी सिद्ध होती है, इसलिए I सही है। कार्य और समय-सीमा दिए जाने से उसका पहले ही पूरा होना सिद्ध नहीं होता। इसलिए II सही नहीं है।`, `ਕੰਮ ਸੌਂਪੇ ਜਾਣ ਨਾਲ ${role[2]} ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਸਾਬਤ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਕੰਮ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ ਦਿੱਤੇ ਜਾਣ ਨਾਲ ਉਸ ਦਾ ਪਹਿਲਾਂ ਹੀ ਪੂਰਾ ਹੋਣਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "TIME_DISTORTION"));

const exclusionEntries: readonly Entry[] = [
  ["SIF-CP001-ARCHIVE-EXCLUSION", "PUBLIC_ADMINISTRATION", ["The archive room", "अभिलेख कक्ष", "ਰਿਕਾਰਡ ਕਮਰਾ"], ["current working files", "वर्तमान कार्य फाइलें", "ਮੌਜੂਦਾ ਕੰਮ ਵਾਲੀਆਂ ਫਾਈਲਾਂ"]],
  ["SIF-CP001-REFERENCE-EXCLUSION", "EDUCATION", ["The reference section", "संदर्भ अनुभाग", "ਹਵਾਲਾ ਸ਼ਾਖਾ"], ["books issued for home use", "घर ले जाने के लिए जारी पुस्तकें", "ਘਰ ਲੈ ਜਾਣ ਲਈ ਜਾਰੀ ਕਿਤਾਬਾਂ"]],
  ["SIF-CP001-LOCKER-EXCLUSION", "BANKING", ["The secure cabinet", "सुरक्षित अलमारी", "ਸੁਰੱਖਿਅਤ ਅਲਮਾਰੀ"], ["unverified documents", "असत्यापित दस्तावेज", "ਨਾ-ਤਸਦੀਕ ਦਸਤਾਵੇਜ਼"]],
  ["SIF-CP001-WAREHOUSE-EXCLUSION", "BUSINESS", ["The dispatch zone", "प्रेषण क्षेत्र", "ਭੇਜਣ ਖੇਤਰ"], ["goods awaiting inspection", "निरीक्षण की प्रतीक्षा वाला माल", "ਜਾਂਚ ਦੀ ਉਡੀਕ ਵਾਲਾ ਮਾਲ"]],
  ["SIF-CP001-SERVER-EXCLUSION", "WORKPLACE", ["The production server", "उत्पादन सर्वर", "ਪ੍ਰੋਡਕਸ਼ਨ ਸਰਵਰ"], ["unapproved software", "अस्वीकृत सॉफ्टवेयर", "ਨਾ-ਮਨਜ਼ੂਰ ਸਾਫਟਵੇਅਰ"]],
  ["SIF-CP001-BAY-EXCLUSION", "TRANSPORT", ["The departure bay", "प्रस्थान क्षेत्र", "ਰਵਾਨਗੀ ਖੇਤਰ"], ["vehicles without route clearance", "मार्ग अनुमति रहित वाहन", "ਰੂਟ ਮਨਜ਼ੂਰੀ ਤੋਂ ਬਿਨਾਂ ਵਾਹਨ"]],
];

const exclusionAuthorities = exclusionEntries.map(([id, domain, place, excluded]) => make(id, domain,
  [`The operating rule states that ${excluded[0]} must not be kept in ${place[0]}.`, `कार्य नियम के अनुसार ${excluded[1]} को ${place[1]} में नहीं रखा जाना चाहिए।`, `ਕੰਮ ਦੇ ਨਿਯਮ ਅਨੁਸਾਰ ${excluded[2]} ਨੂੰ ${place[2]} ਵਿੱਚ ਨਹੀਂ ਰੱਖਿਆ ਜਾਣਾ ਚਾਹੀਦਾ।`],
  [`Keeping ${excluded[0]} in ${place[0]} would violate the stated rule.`, `${excluded[1]} को ${place[1]} में रखना दिए गए नियम का उल्लंघन होगा।`, `${excluded[2]} ਨੂੰ ${place[2]} ਵਿੱਚ ਰੱਖਣਾ ਦਿੱਤੇ ਨਿਯਮ ਦੀ ਉਲੰਘਣਾ ਹੋਵੇਗੀ।`],
  [`The rule proves that such a violation has already occurred.`, `नियम से सिद्ध होता है कि ऐसा उल्लंघन पहले ही हो चुका है।`, `ਨਿਯਮ ਤੋਂ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਕਿ ਅਜਿਹੀ ਉਲੰਘਣਾ ਪਹਿਲਾਂ ਹੀ ਹੋ ਚੁੱਕੀ ਹੈ।`],
  [`The rule expressly prohibits that placement, so I follows. A prohibition does not establish that someone has already broken it. Therefore, II does not follow.`, `नियम उस स्थिति को स्पष्ट रूप से रोकता है, इसलिए I सही है। प्रतिबंध से यह सिद्ध नहीं होता कि नियम पहले ही तोड़ा गया है। इसलिए II सही नहीं है।`, `ਨਿਯਮ ਉਸ ਸਥਿਤੀ ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ਉੱਤੇ ਰੋਕਦਾ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਪਾਬੰਦੀ ਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਨਿਯਮ ਪਹਿਲਾਂ ਹੀ ਤੋੜਿਆ ਗਿਆ ਹੈ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "STRONGER_CLAIM"));

const classificationEntries: readonly Entry[] = [
  ["SIF-CP001-PREMIUM-CLASSIFICATION", "BANKING", ["Accounts with the gold label", "गोल्ड लेबल वाले खाते", "ਗੋਲਡ ਲੇਬਲ ਵਾਲੇ ਖਾਤੇ"], ["premium-service accounts", "प्रीमियम सेवा खाते", "ਪ੍ਰੀਮੀਅਮ ਸੇਵਾ ਖਾਤੇ"]],
  ["SIF-CP001-REFERENCE-CLASSIFICATION", "EDUCATION", ["Books marked R", "R चिह्न वाली पुस्तकें", "R ਨਿਸ਼ਾਨ ਵਾਲੀਆਂ ਕਿਤਾਬਾਂ"], ["reference-only books", "केवल संदर्भ पुस्तकें", "ਸਿਰਫ਼ ਹਵਾਲਾ ਕਿਤਾਬਾਂ"]],
  ["SIF-CP001-PRIORITY-CLASSIFICATION", "PUBLIC_ADMINISTRATION", ["Files carrying a red slip", "लाल पर्ची वाली फाइलें", "ਲਾਲ ਪਰਚੀ ਵਾਲੀਆਂ ਫਾਈਲਾਂ"], ["priority files", "प्राथमिकता फाइलें", "ਤਰਜੀਹੀ ਫਾਈਲਾਂ"]],
  ["SIF-CP001-EXPORT-CLASSIFICATION", "BUSINESS", ["Packages bearing the EX mark", "EX चिह्न वाले पैकेज", "EX ਨਿਸ਼ਾਨ ਵਾਲੇ ਪੈਕੇਜ"], ["export packages", "निर्यात पैकेज", "ਨਿਰਯਾਤ ਪੈਕੇਜ"]],
  ["SIF-CP001-RESTRICTED-CLASSIFICATION", "WORKPLACE", ["Folders with a blue band", "नीली पट्टी वाले फोल्डर", "ਨੀਲੀ ਪੱਟੀ ਵਾਲੇ ਫੋਲਡਰ"], ["restricted-access folders", "सीमित पहुंच फोल्डर", "ਸੀਮਤ ਪਹੁੰਚ ਵਾਲੇ ਫੋਲਡਰ"]],
  ["SIF-CP001-EXPRESS-CLASSIFICATION", "TRANSPORT", ["Consignments carrying an E tag", "E टैग वाली खेप", "E ਟੈਗ ਵਾਲੀਆਂ ਖੇਪਾਂ"], ["express consignments", "एक्सप्रेस खेप", "ਐਕਸਪ੍ਰੈਸ ਖੇਪਾਂ"]],
];

const classificationAuthorities = classificationEntries.map(([id, domain, marked, category]) => make(id, domain,
  [`Under the record system, ${marked[0]} are entered as ${category[0]}.`, `रिकॉर्ड प्रणाली में ${marked[1]} को ${category[1]} के रूप में दर्ज किया जाता है।`, `ਰਿਕਾਰਡ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ${marked[2]} ਨੂੰ ${category[2]} ਵਜੋਂ ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`],
  [`An item carrying that mark belongs to the stated category in this system.`, `उस चिह्न वाली वस्तु इस प्रणाली में बताई गई श्रेणी में आती है।`, `ਉਸ ਨਿਸ਼ਾਨ ਵਾਲੀ ਵਸਤੂ ਇਸ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਦੱਸੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦੀ ਹੈ।`],
  ["Every item in the stated category must carry that mark.", "बताई गई श्रेणी की हर वस्तु पर वही चिह्न होना आवश्यक है।", "ਦੱਸੀ ਸ਼੍ਰੇਣੀ ਦੀ ਹਰ ਵਸਤੂ ਉੱਤੇ ਉਹੀ ਨਿਸ਼ਾਨ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"],
  [`The rule places marked items in the stated category, so I follows. It does not say that the mark is compulsory for every item in that category. Therefore, II does not follow.`, `नियम चिह्नित वस्तुओं को बताई गई श्रेणी में रखता है, इसलिए I सही है। यह नहीं कहा गया कि उस श्रेणी की हर वस्तु पर वही चिह्न अनिवार्य है। इसलिए II सही नहीं है।`, `ਨਿਯਮ ਨਿਸ਼ਾਨ ਵਾਲੀਆਂ ਵਸਤੂਆਂ ਨੂੰ ਦੱਸੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਇਹ ਨਹੀਂ ਕਿਹਾ ਗਿਆ ਕਿ ਉਸ ਸ਼੍ਰੇਣੀ ਦੀ ਹਰ ਵਸਤੂ ਉੱਤੇ ਉਹੀ ਨਿਸ਼ਾਨ ਲਾਜ਼ਮੀ ਹੈ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "STRONGER_CLAIM"));

export const SIF_CP001_WAVE5_AUTHORITIES: readonly SifScenarioAuthority[] = [...statusAuthorities, ...placementAuthorities, ...scheduleAuthorities, ...roleAuthorities, ...exclusionAuthorities, ...classificationAuthorities];
