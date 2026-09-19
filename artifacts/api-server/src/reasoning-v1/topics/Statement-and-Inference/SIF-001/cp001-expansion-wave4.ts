import type { SifContextDomain, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

type L = readonly [string, string, string];
type Row = readonly [id: string, domain: SifContextDomain, label: L, items: L, first: number, second: number];
const t = ([en, hi, pa]: L): SifLocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const guard = { evaluatesSupport: true, assumptionQuestion: false, conclusionQuestion: false, argumentQuestion: false, causeEffectQuestion: false, courseOfActionQuestion: false } as const;
const ordinal = (value: number): string => {
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) return `${value}th`;
  return `${value}${value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th"}`;
};

function make(id: string, domain: SifContextDomain, statement: L, valid: L, invalid: L, explanation: L, distractorType: "UNSUPPORTED_DETAIL" | "CAUSE_ASSUMPTION" | "STRONGER_CLAIM" | "TIME_DISTORTION"): SifScenarioAuthority {
  return { id, cpId: "SIF-CP001", difficulty: "EASY", domain, mechanisms: ["DIRECT_FACT"], statement: t(statement), facts: [{ id: "F1", text: t(statement) }], candidates: [{ id: "I", text: t(valid), follows: true, strength: "CERTAIN", supportFactIds: ["F1"] }, { id: "II", text: t(invalid), follows: false, strength: "POSSIBLE_ONLY", supportFactIds: ["F1"], distractorType }], explanation: t(explanation), identityGuard: guard };
}

const partitionRows: readonly Row[] = [
  ["SIF-CP001-LICENSE-FILES", "PUBLIC_ADMINISTRATION", ["The licensing office", "लाइसेंस कार्यालय", "ਲਾਇਸੈਂਸ ਦਫ਼ਤਰ"], ["files", "फाइलों", "ਫਾਈਲਾਂ"], 160, 28],
  ["SIF-CP001-ACCOUNT-REQUESTS", "BANKING", ["The account-service desk", "खाता सेवा डेस्क", "ਖਾਤਾ ਸੇਵਾ ਡੈਸਕ"], ["requests", "अनुरोधों", "ਬੇਨਤੀਆਂ"], 135, 15],
  ["SIF-CP001-ADMISSION-FORMS", "EDUCATION", ["The admission office", "प्रवेश कार्यालय", "ਦਾਖ਼ਲਾ ਦਫ਼ਤਰ"], ["forms", "फॉर्मों", "ਫਾਰਮਾਂ"], 210, 30],
  ["SIF-CP001-WARRANTY-CASES", "BUSINESS", ["The warranty centre", "वारंटी केंद्र", "ਵਾਰੰਟੀ ਕੇਂਦਰ"], ["cases", "मामलों", "ਮਾਮਲਿਆਂ"], 96, 12],
  ["SIF-CP001-HELPDESK-CASES", "WORKPLACE", ["The internal helpdesk", "आंतरिक सहायता डेस्क", "ਅੰਦਰੂਨੀ ਸਹਾਇਤਾ ਡੈਸਕ"], ["cases", "मामलों", "ਮਾਮਲਿਆਂ"], 75, 9],
  ["SIF-CP001-DELIVERY-REQUESTS", "TRANSPORT", ["The delivery office", "वितरण कार्यालय", "ਡਿਲਿਵਰੀ ਦਫ਼ਤਰ"], ["requests", "अनुरोधों", "ਬੇਨਤੀਆਂ"], 144, 18],
];

const partitions = partitionRows.map(([id, domain, label, items, total, pending]) => make(id, domain,
  [`${label[0]} processed ${total} ${items[0]}. It completed ${total - pending}, while ${pending} remained pending.`, `${label[1]} ने ${total} ${items[1]} पर कार्य किया। ${total - pending} पूरे हुए और ${pending} लंबित रहे।`, `${label[2]} ਨੇ ${total} ${items[2]} ਉੱਤੇ ਕਾਰਵਾਈ ਕੀਤੀ। ${total - pending} ਪੂਰੇ ਹੋਏ ਅਤੇ ${pending} ਲੰਬਿਤ ਰਹੇ।`],
  [`All ${total} items were accounted for as either completed or pending.`, `सभी ${total} मामलों की स्थिति पूरी या लंबित के रूप में दर्ज थी।`, `ਸਾਰੇ ${total} ਮਾਮਲਿਆਂ ਦੀ ਸਥਿਤੀ ਪੂਰੀ ਜਾਂ ਲੰਬਿਤ ਵਜੋਂ ਦਰਜ ਸੀ।`],
  ["Every pending item lacked a required document.", "हर लंबित मामले में आवश्यक दस्तावेज नहीं था।", "ਹਰ ਲੰਬਿਤ ਮਾਮਲੇ ਵਿੱਚ ਲੋੜੀਂਦਾ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਸੀ।"],
  [`The completed and pending figures add to ${total}, so I follows. The reason for the pending status is not stated. Therefore, II does not follow.`, `पूरे और लंबित मामलों की संख्या मिलकर ${total} होती है, इसलिए I सही है। लंबित होने का कारण नहीं बताया गया। इसलिए II सही नहीं है।`, `ਪੂਰੇ ਅਤੇ ਲੰਬਿਤ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ਮਿਲ ਕੇ ${total} ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਲੰਬਿਤ ਹੋਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "UNSUPPORTED_DETAIL"));

const comparisonRows: readonly Row[] = [
  ["SIF-CP001-MORNING-EVENING-VISITORS", "EVERYDAY", ["A public centre", "एक जनसेवा केंद्र", "ਇੱਕ ਜਨਸੇਵਾ ਕੇਂਦਰ"], ["visitors", "आगंतुक", "ਮੁਲਾਕਾਤੀ"], 86, 54],
  ["SIF-CP001-ONLINE-COUNTER-TICKETS", "BANKING", ["A bank branch", "एक बैंक शाखा", "ਇੱਕ ਬੈਂਕ ਸ਼ਾਖਾ"], ["service tokens", "सेवा टोकन", "ਸੇਵਾ ਟੋਕਨ"], 128, 72],
  ["SIF-CP001-PRIMARY-ADVANCED-ENROLMENT", "EDUCATION", ["A training institute", "एक प्रशिक्षण संस्थान", "ਇੱਕ ਸਿਖਲਾਈ ਸੰਸਥਾ"], ["enrolments", "नामांकन", "ਦਾਖ਼ਲੇ"], 94, 61],
  ["SIF-CP001-DOMESTIC-COMMERCIAL-ORDERS", "BUSINESS", ["A supplier", "एक आपूर्तिकर्ता", "ਇੱਕ ਸਪਲਾਇਰ"], ["orders", "ऑर्डर", "ਆਰਡਰ"], 175, 130],
  ["SIF-CP001-DAY-NIGHT-SHIFTS", "WORKPLACE", ["A production unit", "एक उत्पादन इकाई", "ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ"], ["completed jobs", "पूरे कार्य", "ਪੂਰੇ ਕੰਮ"], 112, 89],
  ["SIF-CP001-BUS-RAIL-BOOKINGS", "TRANSPORT", ["A travel desk", "एक यात्रा डेस्क", "ਇੱਕ ਯਾਤਰਾ ਡੈਸਕ"], ["bookings", "बुकिंग", "ਬੁਕਿੰਗਾਂ"], 73, 47],
];

const comparisons = comparisonRows.map(([id, domain, label, items, first, second]) => make(id, domain,
  [`${label[0]} recorded ${first} ${items[0]} in the first category and ${second} in the second category.`, `${label[1]} ने पहली श्रेणी में ${first} ${items[1]} और दूसरी श्रेणी में ${second} दर्ज किए।`, `${label[2]} ਨੇ ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ${first} ${items[2]} ਅਤੇ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ${second} ਦਰਜ ਕੀਤੇ।`],
  ["The first category had a higher count than the second category.", "पहली श्रेणी की संख्या दूसरी श्रेणी से अधिक थी।", "ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਨਾਲੋਂ ਵੱਧ ਸੀ।"],
  ["The first category was more profitable than the second category.", "पहली श्रेणी दूसरी श्रेणी से अधिक लाभदायक थी।", "ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਨਾਲੋਂ ਵੱਧ ਲਾਭਦਾਇਕ ਸੀ।"],
  [`Since ${first} is greater than ${second}, I follows. Counts alone do not provide any information about profit. Therefore, II does not follow.`, `${first}, ${second} से अधिक है, इसलिए I सही है। केवल संख्या से लाभ के बारे में पता नहीं चलता। इसलिए II सही नहीं है।`, `${first}, ${second} ਨਾਲੋਂ ਵੱਧ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਸਿਰਫ਼ ਗਿਣਤੀ ਤੋਂ ਲਾਭ ਬਾਰੇ ਪਤਾ ਨਹੀਂ ਲੱਗਦਾ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "UNSUPPORTED_DETAIL"));

const allocationRows: readonly Row[] = [
  ["SIF-CP001-LIBRARY-CARDS", "EDUCATION", ["A library", "एक पुस्तकालय", "ਇੱਕ ਲਾਇਬ੍ਰੇਰੀ"], ["membership cards", "सदस्यता कार्ड", "ਮੈਂਬਰਸ਼ਿਪ ਕਾਰਡ"], 300, 45],
  ["SIF-CP001-PAYMENT-TERMINALS", "BANKING", ["A bank", "एक बैंक", "ਇੱਕ ਬੈਂਕ"], ["payment terminals", "भुगतान टर्मिनल", "ਭੁਗਤਾਨ ਟਰਮੀਨਲ"], 80, 8],
  ["SIF-CP001-OFFICE-CHAIRS", "WORKPLACE", ["An office", "एक कार्यालय", "ਇੱਕ ਦਫ਼ਤਰ"], ["chairs", "कुर्सियां", "ਕੁਰਸੀਆਂ"], 120, 14],
  ["SIF-CP001-RENTAL-VEHICLES", "TRANSPORT", ["A rental agency", "एक किराया एजेंसी", "ਇੱਕ ਕਿਰਾਇਆ ਏਜੰਸੀ"], ["vehicles", "वाहन", "ਵਾਹਨ"], 65, 11],
  ["SIF-CP001-STORAGE-CRATES", "BUSINESS", ["A warehouse", "एक गोदाम", "ਇੱਕ ਗੋਦਾਮ"], ["storage crates", "भंडारण पेटियां", "ਭੰਡਾਰਨ ਪੇਟੀਆਂ"], 240, 36],
  ["SIF-CP001-COMMUNITY-KITS", "PUBLIC_ADMINISTRATION", ["A community office", "एक सामुदायिक कार्यालय", "ਇੱਕ ਭਾਈਚਾਰਕ ਦਫ਼ਤਰ"], ["service kits", "सेवा किट", "ਸੇਵਾ ਕਿੱਟਾਂ"], 150, 25],
];

const allocations = allocationRows.map(([id, domain, label, items, total, reserve]) => make(id, domain,
  [`${label[0]} had ${total} ${items[0]}. It issued ${total - reserve} and kept ${reserve} in reserve.`, `${label[1]} के पास ${total} ${items[1]} थे। ${total - reserve} जारी किए गए और ${reserve} आरक्षित रखे गए।`, `${label[2]} ਕੋਲ ${total} ${items[2]} ਸਨ। ${total - reserve} ਜਾਰੀ ਕੀਤੇ ਗਏ ਅਤੇ ${reserve} ਰਾਖਵੇਂ ਰੱਖੇ ਗਏ।`],
  [`Exactly ${reserve} items had not been issued.`, `ठीक ${reserve} वस्तुएं जारी नहीं की गई थीं।`, `ਠੀਕ ${reserve} ਵਸਤੂਆਂ ਜਾਰੀ ਨਹੀਂ ਕੀਤੀਆਂ ਗਈਆਂ ਸਨ।`],
  ["All reserve items were defective.", "सभी आरक्षित वस्तुएं खराब थीं।", "ਸਾਰੀਆਂ ਰਾਖਵੀਆਂ ਵਸਤੂਆਂ ਖਰਾਬ ਸਨ।"],
  [`The statement directly identifies ${reserve} items as reserve, so I follows. It does not say that they were defective. Therefore, II does not follow.`, `कथन सीधे ${reserve} वस्तुओं को आरक्षित बताता है, इसलिए I सही है। उन्हें खराब नहीं बताया गया। इसलिए II सही नहीं है।`, `ਕਥਨ ਸਿੱਧਾ ${reserve} ਵਸਤੂਆਂ ਨੂੰ ਰਾਖਵਾਂ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਉਨ੍ਹਾਂ ਨੂੰ ਖਰਾਬ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "UNSUPPORTED_DETAIL"));

const fractionRows: readonly Row[] = [
  ["SIF-CP001-ONLINE-APPLICATIONS", "PUBLIC_ADMINISTRATION", ["An application portal", "एक आवेदन पोर्टल", "ਇੱਕ ਅਰਜ਼ੀ ਪੋਰਟਲ"], ["applications", "आवेदन", "ਅਰਜ਼ੀਆਂ"], 400, 300],
  ["SIF-CP001-DIGITAL-STATEMENTS", "BANKING", ["A bank", "एक बैंक", "ਇੱਕ ਬੈਂਕ"], ["account statements", "खाता विवरण", "ਖਾਤਾ ਵੇਰਵੇ"], 500, 400],
  ["SIF-CP001-COURSE-PASSES", "EDUCATION", ["A college", "एक कॉलेज", "ਇੱਕ ਕਾਲਜ"], ["assessment results", "मूल्यांकन परिणाम", "ਮੁਲਾਂਕਣ ਨਤੀਜੇ"], 200, 150],
  ["SIF-CP001-ELECTRONIC-INVOICES", "BUSINESS", ["A company", "एक कंपनी", "ਇੱਕ ਕੰਪਨੀ"], ["invoices", "चालान", "ਚਲਾਨ"], 320, 240],
  ["SIF-CP001-TRAINING-COMPLETIONS", "WORKPLACE", ["An employer", "एक नियोक्ता", "ਇੱਕ ਨਿਯੋਗਤਾ"], ["training records", "प्रशिक्षण रिकॉर्ड", "ਸਿਖਲਾਈ ਰਿਕਾਰਡ"], 160, 120],
  ["SIF-CP001-MOBILE-BOOKINGS", "TRANSPORT", ["A booking service", "एक बुकिंग सेवा", "ਇੱਕ ਬੁਕਿੰਗ ਸੇਵਾ"], ["tickets", "टिकट", "ਟਿਕਟਾਂ"], 280, 210],
];

const fractions = fractionRows.map(([id, domain, label, items, total, selected]) => make(id, domain,
  [`${label[0]} recorded ${total} ${items[0]}; ${selected} of them were in the specified category.`, `${label[1]} ने ${total} ${items[1]} दर्ज किए; इनमें से ${selected} निर्धारित श्रेणी में थे।`, `${label[2]} ਨੇ ${total} ${items[2]} ਦਰਜ ਕੀਤੇ; ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ${selected} ਨਿਰਧਾਰਤ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਸਨ।`],
  ["Three-fourths of the recorded items were in that category.", "दर्ज वस्तुओं में से तीन-चौथाई उस श्रेणी में थीं।", "ਦਰਜ ਵਸਤੂਆਂ ਵਿੱਚੋਂ ਤਿੰਨ-ਚੌਥਾਈ ਉਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਸਨ।"],
  ["That category was preferred because it was cheaper.", "उस श्रेणी को सस्ता होने के कारण पसंद किया गया।", "ਉਸ ਸ਼੍ਰੇਣੀ ਨੂੰ ਸਸਤਾ ਹੋਣ ਕਾਰਨ ਪਸੰਦ ਕੀਤਾ ਗਿਆ।"],
  [`${selected} is three-fourths of ${total}, so I follows. The statement gives no reason or price information. Therefore, II does not follow.`, `${selected}, ${total} का तीन-चौथाई है, इसलिए I सही है। कारण या मूल्य की जानकारी नहीं दी गई। इसलिए II सही नहीं है।`, `${selected}, ${total} ਦਾ ਤਿੰਨ-ਚੌਥਾਈ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਕਾਰਨ ਜਾਂ ਕੀਮਤ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿੱਤੀ ਗਈ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "CAUSE_ASSUMPTION"));

const sequenceRows: readonly Row[] = [
  ["SIF-CP001-PERMIT-SEQUENCE", "PUBLIC_ADMINISTRATION", ["The permit was checked", "परमिट की जांच", "ਪਰਮਿਟ ਦੀ ਜਾਂਚ"], ["approval", "मंजूरी", "ਮਨਜ਼ੂਰੀ"], 3, 5],
  ["SIF-CP001-LOAN-SEQUENCE", "BANKING", ["The loan file was verified", "ऋण फाइल का सत्यापन", "ਕਰਜ਼ਾ ਫਾਈਲ ਦੀ ਤਸਦੀਕ"], ["sanction", "स्वीकृति", "ਮਨਜ਼ੂਰੀ"], 8, 11],
  ["SIF-CP001-RESULT-SEQUENCE", "EDUCATION", ["The answer sheets were checked", "उत्तर पुस्तिकाओं की जांच", "ਉੱਤਰ ਪੱਤਰੀਆਂ ਦੀ ਜਾਂਚ"], ["result publication", "परिणाम प्रकाशन", "ਨਤੀਜਾ ਜਾਰੀ ਹੋਣਾ"], 14, 18],
  ["SIF-CP001-ORDER-SEQUENCE", "BUSINESS", ["The order was packed", "ऑर्डर की पैकिंग", "ਆਰਡਰ ਦੀ ਪੈਕਿੰਗ"], ["dispatch", "प्रेषण", "ਭੇਜਣਾ"], 20, 21],
  ["SIF-CP001-RECRUITMENT-SEQUENCE", "WORKPLACE", ["The interviews were completed", "साक्षात्कार पूरे हुए", "ਇੰਟਰਵਿਊ ਪੂਰੇ ਹੋਏ"], ["appointment letters", "नियुक्ति पत्र", "ਨਿਯੁਕਤੀ ਪੱਤਰ"], 22, 27],
  ["SIF-CP001-VEHICLE-SEQUENCE", "TRANSPORT", ["The vehicle inspection was completed", "वाहन निरीक्षण पूरा हुआ", "ਵਾਹਨ ਜਾਂਚ ਪੂਰੀ ਹੋਈ"], ["route clearance", "मार्ग अनुमति", "ਰੂਟ ਮਨਜ਼ੂਰੀ"], 6, 9],
];

const sequences = sequenceRows.map(([id, domain, event, result, first, second]) => make(id, domain,
  [`${event[0]} on the ${ordinal(first)}, and ${result[0]} was issued on the ${ordinal(second)} of the same month.`, `${event[1]} महीने की ${first} तारीख को हुई और ${result[1]} उसी महीने की ${second} तारीख को दी गई।`, `${event[2]} ਮਹੀਨੇ ਦੀ ${first} ਤਾਰੀਖ ਨੂੰ ਪੂਰੀ ਹੋਈ ਅਤੇ ${result[2]} ਉਸੇ ਮਹੀਨੇ ਦੀ ${second} ਤਾਰੀਖ ਨੂੰ ਦਿੱਤੀ ਗਈ।`],
  [`The first event occurred before ${result[0]}.`, `पहली घटना ${result[1]} से पहले हुई।`, `ਪਹਿਲੀ ਘਟਨਾ ${result[2]} ਤੋਂ ਪਹਿਲਾਂ ਹੋਈ।`],
  ["The first event alone guaranteed the later outcome.", "पहली घटना ने बाद के परिणाम की गारंटी दी।", "ਪਹਿਲੀ ਘਟਨਾ ਨੇ ਬਾਅਦ ਦੇ ਨਤੀਜੇ ਦੀ ਗਾਰੰਟੀ ਦਿੱਤੀ।"],
  [`The ${ordinal(first)} comes before the ${ordinal(second)}, so I follows. Time order alone does not prove that the first event guaranteed the outcome. Therefore, II does not follow.`, `${first} तारीख ${second} तारीख से पहले आती है, इसलिए I सही है। केवल समय क्रम से परिणाम की गारंटी सिद्ध नहीं होती। इसलिए II सही नहीं है।`, `${first} ਤਾਰੀਖ ${second} ਤਾਰੀਖ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦੀ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਸਿਰਫ਼ ਸਮਾਂ ਕ੍ਰਮ ਨਾਲ ਨਤੀਜੇ ਦੀ ਗਾਰੰਟੀ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦੀ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "STRONGER_CLAIM"));

const attendanceRows: readonly Row[] = [
  ["SIF-CP001-BOARD-MEETING", "BUSINESS", ["board members", "बोर्ड सदस्य", "ਬੋਰਡ ਮੈਂਬਰ"], ["approved leave", "स्वीकृत अवकाश", "ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਛੁੱਟੀ"], 24, 21],
  ["SIF-CP001-STAFF-BRIEFING", "WORKPLACE", ["staff members", "कर्मचारी", "ਕਰਮਚਾਰੀ"], ["field duty", "क्षेत्रीय ड्यूटी", "ਫੀਲਡ ਡਿਊਟੀ"], 36, 32],
  ["SIF-CP001-PARENT-MEETING", "EDUCATION", ["invited parents", "आमंत्रित अभिभावक", "ਸੱਦੇ ਮਾਪੇ"], ["prior commitments", "पूर्व प्रतिबद्धताएं", "ਪਹਿਲਾਂ ਦੀਆਂ ਵਚਨਬੱਧਤਾਵਾਂ"], 50, 44],
  ["SIF-CP001-DRIVER-BRIEFING", "TRANSPORT", ["drivers", "चालक", "ਡਰਾਈਵਰ"], ["scheduled trips", "निर्धारित यात्राएं", "ਤੈਅ ਯਾਤਰਾਵਾਂ"], 28, 25],
  ["SIF-CP001-CUSTOMER-WORKSHOP", "BANKING", ["registered customers", "पंजीकृत ग्राहक", "ਰਜਿਸਟਰ ਗਾਹਕ"], ["approved cancellations", "स्वीकृत रद्दीकरण", "ਮਨਜ਼ੂਰ ਰੱਦਗੀ"], 40, 35],
  ["SIF-CP001-RESIDENT-MEETING", "EVERYDAY", ["registered residents", "पंजीकृत निवासी", "ਰਜਿਸਟਰ ਵਸਨੀਕ"], ["advance notice", "पूर्व सूचना", "ਪਹਿਲਾਂ ਦਿੱਤੀ ਸੂਚਨਾ"], 30, 26],
];

const attendance = attendanceRows.map(([id, domain, people, status, total, present]) => make(id, domain,
  [`There were ${total} ${people[0]}. ${present} attended the meeting, and the remaining ${total - present} were recorded under ${status[0]}.`, `कुल ${total} ${people[1]} थे। ${present} बैठक में आए और बाकी ${total - present} को ${status[1]} के अंतर्गत दर्ज किया गया।`, `ਕੁੱਲ ${total} ${people[2]} ਸਨ। ${present} ਮੀਟਿੰਗ ਵਿੱਚ ਆਏ ਅਤੇ ਬਾਕੀ ${total - present} ਨੂੰ ${status[2]} ਹੇਠ ਦਰਜ ਕੀਤਾ ਗਿਆ।`],
  [`Exactly ${total - present} people did not attend the meeting.`, `ठीक ${total - present} लोग बैठक में उपस्थित नहीं हुए।`, `ਠੀਕ ${total - present} ਲੋਕ ਮੀਟਿੰਗ ਵਿੱਚ ਹਾਜ਼ਰ ਨਹੀਂ ਹੋਏ।`],
  ["Everyone who did not attend was dissatisfied with the meeting.", "बैठक में न आने वाला हर व्यक्ति बैठक से असंतुष्ट था।", "ਮੀਟਿੰਗ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਾ ਹਰ ਵਿਅਕਤੀ ਮੀਟਿੰਗ ਤੋਂ ਅਸੰਤੁਸ਼ਟ ਸੀ।"],
  [`The difference between ${total} and ${present} is ${total - present}, so I follows. The recorded status does not show dissatisfaction. Therefore, II does not follow.`, `${total} और ${present} का अंतर ${total - present} है, इसलिए I सही है। दर्ज स्थिति असंतोष नहीं दिखाती। इसलिए II सही नहीं है।`, `${total} ਅਤੇ ${present} ਦਾ ਅੰਤਰ ${total - present} ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਦਰਜ ਸਥਿਤੀ ਅਸੰਤੁਸ਼ਟੀ ਨਹੀਂ ਦਿਖਾਉਂਦੀ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "UNSUPPORTED_DETAIL"));

const availabilityRows: readonly Row[] = [
  ["SIF-CP001-SERVICE-WINDOWS", "PUBLIC_ADMINISTRATION", ["service windows", "सेवा खिड़कियां", "ਸੇਵਾ ਖਿੜਕੀਆਂ"], ["open", "खुली", "ਖੁੱਲ੍ਹੀਆਂ"], 18, 15],
  ["SIF-CP001-ATMS-IN-SERVICE", "BANKING", ["ATMs", "एटीएम", "ਏਟੀਐਮ"], ["in service", "चालू", "ਚਾਲੂ"], 25, 22],
  ["SIF-CP001-LAB-COMPUTERS", "EDUCATION", ["laboratory computers", "प्रयोगशाला कंप्यूटर", "ਲੈਬ ਕੰਪਿਊਟਰ"], ["available", "उपलब्ध", "ਉਪਲਬਧ"], 48, 42],
  ["SIF-CP001-CHECKOUT-COUNTERS", "BUSINESS", ["checkout counters", "बिलिंग काउंटर", "ਬਿਲਿੰਗ ਕਾਊਂਟਰ"], ["operating", "चालू", "ਚਾਲੂ"], 16, 13],
  ["SIF-CP001-CONFERENCE-ROOMS", "WORKPLACE", ["conference rooms", "सम्मेलन कक्ष", "ਕਾਨਫਰੰਸ ਕਮਰੇ"], ["available", "उपलब्ध", "ਉਪਲਬਧ"], 12, 9],
  ["SIF-CP001-TICKET-MACHINES", "TRANSPORT", ["ticket machines", "टिकट मशीनें", "ਟਿਕਟ ਮਸ਼ੀਨਾਂ"], ["operating", "चालू", "ਚਾਲੂ"], 20, 17],
];

const availability = availabilityRows.map(([id, domain, items, state, total, available]) => make(id, domain,
  [`A facility had ${total} ${items[0]}; ${available} were ${state[0]} and ${total - available} were temporarily unavailable.`, `एक सुविधा में ${total} ${items[1]} थीं; ${available} ${state[1]} थीं और ${total - available} अस्थायी रूप से अनुपलब्ध थीं।`, `ਇੱਕ ਸਹੂਲਤ ਵਿੱਚ ${total} ${items[2]} ਸਨ; ${available} ${state[2]} ਸਨ ਅਤੇ ${total - available} ਅਸਥਾਈ ਤੌਰ ਉੱਤੇ ਉਪਲਬਧ ਨਹੀਂ ਸਨ।`],
  [`Exactly ${total - available} units were temporarily unavailable.`, `ठीक ${total - available} इकाइयां अस्थायी रूप से अनुपलब्ध थीं।`, `ਠੀਕ ${total - available} ਇਕਾਈਆਂ ਅਸਥਾਈ ਤੌਰ ਉੱਤੇ ਉਪਲਬਧ ਨਹੀਂ ਸਨ।`],
  ["Every unavailable unit required permanent replacement.", "हर अनुपलब्ध इकाई को स्थायी रूप से बदलना आवश्यक था।", "ਹਰ ਗੈਰ-ਉਪਲਬਧ ਇਕਾਈ ਨੂੰ ਸਥਾਈ ਤੌਰ ਉੱਤੇ ਬਦਲਣਾ ਲਾਜ਼ਮੀ ਸੀ।"],
  [`The statement gives ${total - available} as temporarily unavailable, so I follows. Temporary unavailability does not imply permanent replacement. Therefore, II does not follow.`, `कथन ${total - available} इकाइयों को अस्थायी रूप से अनुपलब्ध बताता है, इसलिए I सही है। अस्थायी अनुपलब्धता स्थायी बदलाव सिद्ध नहीं करती। इसलिए II सही नहीं है।`, `ਕਥਨ ${total - available} ਇਕਾਈਆਂ ਨੂੰ ਅਸਥਾਈ ਤੌਰ ਉੱਤੇ ਗੈਰ-ਉਪਲਬਧ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਅਸਥਾਈ ਗੈਰ-ਉਪਲਬਧਤਾ ਸਥਾਈ ਬਦਲਾਅ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।`], "STRONGER_CLAIM"));

export const SIF_CP001_WAVE4_AUTHORITIES: readonly SifScenarioAuthority[] = [...partitions, ...comparisons, ...allocations, ...fractions, ...sequences, ...attendance, ...availability];
