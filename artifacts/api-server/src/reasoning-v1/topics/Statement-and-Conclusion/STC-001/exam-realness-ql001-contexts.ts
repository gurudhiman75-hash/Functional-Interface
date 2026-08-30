import type { LocalizedText, StcScenarioAuthority } from "./types.ts";
import { atom, not } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });

type FactRow = {
  id: string;
  factId: string;
  statement: LocalizedText;
  paraphrase: LocalizedText;
  negative: LocalizedText;
  extraId: string;
  extra: LocalizedText;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
};

const rows: readonly FactRow[] = [
  {
    id: "STC-SC-025", factId: "clinic_tokens_9",
    statement: t("Token distribution at the district clinic starts at 9 a.m.", "जिला क्लिनिक में टोकन वितरण सुबह 9 बजे शुरू होता है।", "ਜ਼ਿਲ੍ਹਾ ਕਲੀਨਿਕ ਵਿੱਚ ਟੋਕਨ ਵੰਡ ਸਵੇਰੇ 9 ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।"),
    paraphrase: t("9 a.m. is the starting time for token distribution at the district clinic.", "जिला क्लिनिक में टोकन वितरण का समय सुबह 9 बजे से शुरू होता है।", "ਜ਼ਿਲ੍ਹਾ ਕਲੀਨਿਕ ਵਿੱਚ ਟੋਕਨ ਵੰਡ ਦਾ ਸ਼ੁਰੂਆਤੀ ਸਮਾਂ ਸਵੇਰੇ 9 ਵਜੇ ਹੈ।"),
    negative: t("Token distribution at the district clinic does not start at 9 a.m.", "जिला क्लिनिक में टोकन वितरण सुबह 9 बजे शुरू नहीं होता।", "ਜ਼ਿਲ੍ਹਾ ਕਲੀਨਿਕ ਵਿੱਚ ਟੋਕਨ ਵੰਡ ਸਵੇਰੇ 9 ਵਜੇ ਸ਼ੁਰੂ ਨਹੀਂ ਹੁੰਦੀ।"),
    extraId: "clinic_free_medicines", extra: t("All medicines at the clinic are free.", "क्लिनिक में सभी दवाइयाँ निःशुल्क हैं।", "ਕਲੀਨਿਕ ਵਿੱਚ ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਮੁਫ਼ਤ ਹਨ।"),
  },
  {
    id: "STC-SC-026", factId: "portal_closes_friday",
    statement: t("The scholarship portal closes on Friday evening.", "छात्रवृत्ति पोर्टल शुक्रवार शाम बंद हो जाता है।", "ਸਕਾਲਰਸ਼ਿਪ ਪੋਰਟਲ ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ ਬੰਦ ਹੋ ਜਾਂਦਾ ਹੈ।"),
    paraphrase: t("Friday evening is the closing time for the scholarship portal.", "छात्रवृत्ति पोर्टल की अंतिम समय-सीमा शुक्रवार शाम है।", "ਸਕਾਲਰਸ਼ਿਪ ਪੋਰਟਲ ਦੀ ਆਖ਼ਰੀ ਸਮਾਂ-ਸੀਮਾ ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ ਹੈ।"),
    negative: t("The scholarship portal remains open after Friday evening.", "छात्रवृत्ति पोर्टल शुक्रवार शाम के बाद भी खुला रहता है।", "ਸਕਾਲਰਸ਼ਿਪ ਪੋਰਟਲ ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ ਤੋਂ ਬਾਅਦ ਵੀ ਖੁੱਲ੍ਹਾ ਰਹਿੰਦਾ ਹੈ।"),
    extraId: "scholarship_amount_fixed", extra: t("Every applicant receives the same scholarship amount.", "हर आवेदक को समान छात्रवृत्ति राशि मिलती है।", "ਹਰ ਅਰਜ਼ੀਕਾਰ ਨੂੰ ਇੱਕੋ ਸਕਾਲਰਸ਼ਿਪ ਰਕਮ ਮਿਲਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-027", factId: "museum_closed_monday",
    statement: t("The district museum remains closed on Mondays.", "जिला संग्रहालय सोमवार को बंद रहता है।", "ਜ਼ਿਲ੍ਹਾ ਅਜਾਇਬਘਰ ਸੋਮਵਾਰ ਨੂੰ ਬੰਦ ਰਹਿੰਦਾ ਹੈ।"),
    paraphrase: t("Visitors cannot enter the district museum on Monday because it is closed.", "सोमवार को जिला संग्रहालय बंद रहता है, इसलिए उस दिन प्रवेश नहीं होता।", "ਸੋਮਵਾਰ ਨੂੰ ਜ਼ਿਲ੍ਹਾ ਅਜਾਇਬਘਰ ਬੰਦ ਰਹਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਉਸ ਦਿਨ ਦਾਖਲਾ ਨਹੀਂ ਹੁੰਦਾ।"),
    negative: t("The district museum is open every Monday.", "जिला संग्रहालय हर सोमवार खुला रहता है।", "ਜ਼ਿਲ੍ਹਾ ਅਜਾਇਬਘਰ ਹਰ ਸੋਮਵਾਰ ਖੁੱਲ੍ਹਾ ਰਹਿੰਦਾ ਹੈ।"),
    extraId: "museum_free_entry", extra: t("Entry to the museum is free on all other days.", "अन्य सभी दिनों में संग्रहालय में प्रवेश निःशुल्क है।", "ਹੋਰ ਸਾਰੇ ਦਿਨਾਂ ਵਿੱਚ ਅਜਾਇਬਘਰ ਦਾ ਦਾਖਲਾ ਮੁਫ਼ਤ ਹੈ।"),
  },
  {
    id: "STC-SC-028", factId: "bus_terminal_b",
    statement: t("The evening shuttle ends its route at Terminal B.", "शाम की शटल सेवा का मार्ग टर्मिनल B पर समाप्त होता है।", "ਸ਼ਾਮ ਦੀ ਸ਼ਟਲ ਸੇਵਾ ਦਾ ਰੂਟ ਟਰਮੀਨਲ B ਤੇ ਖ਼ਤਮ ਹੁੰਦਾ ਹੈ।"),
    paraphrase: t("Terminal B is the final stop of the evening shuttle.", "टर्मिनल B शाम की शटल सेवा का अंतिम स्टॉप है।", "ਟਰਮੀਨਲ B ਸ਼ਾਮ ਦੀ ਸ਼ਟਲ ਸੇਵਾ ਦਾ ਆਖ਼ਰੀ ਸਟਾਪ ਹੈ।"),
    negative: t("The evening shuttle does not finish its route at Terminal B.", "शाम की शटल सेवा टर्मिनल B पर अपना मार्ग समाप्त नहीं करती।", "ਸ਼ਾਮ ਦੀ ਸ਼ਟਲ ਸੇਵਾ ਟਰਮੀਨਲ B ਤੇ ਆਪਣਾ ਰੂਟ ਖ਼ਤਮ ਨਹੀਂ ਕਰਦੀ।"),
    extraId: "shuttle_free", extra: t("Travel on the evening shuttle is free.", "शाम की शटल में यात्रा निःशुल्क है।", "ਸ਼ਾਮ ਦੀ ਸ਼ਟਲ ਵਿੱਚ ਯਾਤਰਾ ਮੁਫ਼ਤ ਹੈ।"),
  },
  {
    id: "STC-SC-029", factId: "registration_fee_500",
    statement: t("The registration fee for the workshop is ₹500.", "कार्यशाला का पंजीकरण शुल्क ₹500 है।", "ਵਰਕਸ਼ਾਪ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫੀਸ ₹500 ਹੈ।"),
    paraphrase: t("A participant has to pay ₹500 as the workshop registration fee.", "कार्यशाला के पंजीकरण के लिए ₹500 शुल्क देना होता है।", "ਵਰਕਸ਼ਾਪ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ ₹500 ਫੀਸ ਦੇਣੀ ਹੁੰਦੀ ਹੈ।"),
    negative: t("The workshop registration fee is not ₹500.", "कार्यशाला का पंजीकरण शुल्क ₹500 नहीं है।", "ਵਰਕਸ਼ਾਪ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫੀਸ ₹500 ਨਹੀਂ ਹੈ।"),
    extraId: "workshop_lunch", extra: t("Lunch is included in the registration fee.", "पंजीकरण शुल्क में दोपहर का भोजन शामिल है।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫੀਸ ਵਿੱਚ ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ ਸ਼ਾਮਲ ਹੈ।"),
  },
  {
    id: "STC-SC-030", factId: "result_official_website",
    statement: t("The recruitment result will be published on the official website.", "भर्ती परिणाम आधिकारिक वेबसाइट पर प्रकाशित किया जाएगा।", "ਭਰਤੀ ਨਤੀਜਾ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕੀਤਾ ਜਾਵੇਗਾ।"),
    paraphrase: t("Candidates can find the recruitment result on the official website once it is published.", "भर्ती परिणाम प्रकाशित होने पर उम्मीदवार उसे आधिकारिक वेबसाइट पर देख सकेंगे।", "ਭਰਤੀ ਨਤੀਜਾ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਣ ਤੇ ਉਮੀਦਵਾਰ ਉਸਨੂੰ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਤੇ ਦੇਖ ਸਕਣਗੇ।"),
    negative: t("The recruitment result will not be published on the official website.", "भर्ती परिणाम आधिकारिक वेबसाइट पर प्रकाशित नहीं किया जाएगा।", "ਭਰਤੀ ਨਤੀਜਾ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾਵੇਗਾ।"),
    extraId: "result_sms", extra: t("Every candidate will also receive the result by SMS.", "हर उम्मीदवार को परिणाम SMS से भी मिलेगा।", "ਹਰ ਉਮੀਦਵਾਰ ਨੂੰ ਨਤੀਜਾ SMS ਰਾਹੀਂ ਵੀ ਮਿਲੇਗਾ।"),
  },
  {
    id: "STC-SC-031", factId: "helpline_10_5",
    statement: t("The admissions helpline operates from 10 a.m. to 5 p.m.", "प्रवेश हेल्पलाइन सुबह 10 बजे से शाम 5 बजे तक चलती है।", "ਦਾਖਲਾ ਹੈਲਪਲਾਈਨ ਸਵੇਰੇ 10 ਵਜੇ ਤੋਂ ਸ਼ਾਮ 5 ਵਜੇ ਤੱਕ ਚੱਲਦੀ ਹੈ।"),
    paraphrase: t("The admissions helpline is available between 10 a.m. and 5 p.m.", "प्रवेश हेल्पलाइन सुबह 10 बजे से शाम 5 बजे के बीच उपलब्ध रहती है।", "ਦਾਖਲਾ ਹੈਲਪਲਾਈਨ ਸਵੇਰੇ 10 ਵਜੇ ਤੋਂ ਸ਼ਾਮ 5 ਵਜੇ ਦੇ ਵਿਚਕਾਰ ਉਪਲਬਧ ਰਹਿੰਦੀ ਹੈ।"),
    negative: t("The admissions helpline is unavailable throughout 10 a.m. to 5 p.m.", "प्रवेश हेल्पलाइन सुबह 10 बजे से शाम 5 बजे तक उपलब्ध नहीं रहती।", "ਦਾਖਲਾ ਹੈਲਪਲਾਈਨ ਸਵੇਰੇ 10 ਵਜੇ ਤੋਂ ਸ਼ਾਮ 5 ਵਜੇ ਤੱਕ ਉਪਲਬਧ ਨਹੀਂ ਰਹਿੰਦੀ।"),
    extraId: "helpline_sunday", extra: t("The helpline is open on every Sunday.", "हेल्पलाइन हर रविवार खुली रहती है।", "ਹੈਲਪਲਾਈਨ ਹਰ ਐਤਵਾਰ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-032", factId: "admit_card_required",
    statement: t("An admit card is required for entry into the examination centre.", "परीक्षा केंद्र में प्रवेश के लिए प्रवेश-पत्र आवश्यक है।", "ਪਰੀਖਿਆ ਕੇਂਦਰ ਵਿੱਚ ਦਾਖਲੇ ਲਈ ਐਡਮਿਟ ਕਾਰਡ ਲਾਜ਼ਮੀ ਹੈ।"),
    paraphrase: t("A candidate must carry an admit card to enter the examination centre.", "परीक्षा केंद्र में प्रवेश करने के लिए उम्मीदवार को प्रवेश-पत्र साथ रखना होगा।", "ਪਰੀਖਿਆ ਕੇਂਦਰ ਵਿੱਚ ਦਾਖਲ ਹੋਣ ਲਈ ਉਮੀਦਵਾਰ ਕੋਲ ਐਡਮਿਟ ਕਾਰਡ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"),
    negative: t("Candidates can enter the examination centre without an admit card.", "उम्मीदवार बिना प्रवेश-पत्र के परीक्षा केंद्र में प्रवेश कर सकते हैं।", "ਉਮੀਦਵਾਰ ਐਡਮਿਟ ਕਾਰਡ ਤੋਂ ਬਿਨਾਂ ਪਰੀਖਿਆ ਕੇਂਦਰ ਵਿੱਚ ਦਾਖਲ ਹੋ ਸਕਦੇ ਹਨ।"),
    extraId: "id_card_optional", extra: t("No identity document is required at the centre.", "केंद्र पर किसी पहचान दस्तावेज़ की आवश्यकता नहीं है।", "ਕੇਂਦਰ ਤੇ ਕਿਸੇ ਪਛਾਣ ਦਸਤਾਵੇਜ਼ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"),
  },
  {
    id: "STC-SC-033", factId: "correction_ends_wednesday",
    statement: t("The online correction window ends on Wednesday.", "ऑनलाइन सुधार विंडो बुधवार को समाप्त होती है।", "ਆਨਲਾਈਨ ਸੋਧ ਵਿੰਡੋ ਬੁੱਧਵਾਰ ਨੂੰ ਖ਼ਤਮ ਹੁੰਦੀ ਹੈ।"),
    paraphrase: t("Wednesday is the last day of the online correction window.", "बुधवार ऑनलाइन सुधार विंडो का अंतिम दिन है।", "ਬੁੱਧਵਾਰ ਆਨਲਾਈਨ ਸੋਧ ਵਿੰਡੋ ਦਾ ਆਖ਼ਰੀ ਦਿਨ ਹੈ।"),
    negative: t("The online correction window continues after Wednesday.", "ऑनलाइन सुधार विंडो बुधवार के बाद भी जारी रहती है।", "ਆਨਲਾਈਨ ਸੋਧ ਵਿੰਡੋ ਬੁੱਧਵਾਰ ਤੋਂ ਬਾਅਦ ਵੀ ਜਾਰੀ ਰਹਿੰਦੀ ਹੈ।"),
    extraId: "correction_free", extra: t("All corrections can be made without any fee.", "सभी सुधार बिना किसी शुल्क के किए जा सकते हैं।", "ਸਾਰੀਆਂ ਸੋਧਾਂ ਬਿਨਾਂ ਕਿਸੇ ਫੀਸ ਦੇ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।"),
  },
  {
    id: "STC-SC-034", factId: "training_attendance_compulsory",
    statement: t("Attendance at the safety training is compulsory for new staff.", "नए कर्मचारियों के लिए सुरक्षा प्रशिक्षण में उपस्थिति अनिवार्य है।", "ਨਵੇਂ ਕਰਮਚਾਰੀਆਂ ਲਈ ਸੁਰੱਖਿਆ ਟ੍ਰੇਨਿੰਗ ਵਿੱਚ ਹਾਜ਼ਰੀ ਲਾਜ਼ਮੀ ਹੈ।"),
    paraphrase: t("New staff must attend the safety training.", "नए कर्मचारियों को सुरक्षा प्रशिक्षण में भाग लेना होगा।", "ਨਵੇਂ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਸੁਰੱਖਿਆ ਟ੍ਰੇਨਿੰਗ ਵਿੱਚ ਹਾਜ਼ਰ ਹੋਣਾ ਪਵੇਗਾ।"),
    negative: t("New staff may skip the safety training without restriction.", "नए कर्मचारी बिना किसी रोक के सुरक्षा प्रशिक्षण छोड़ सकते हैं।", "ਨਵੇਂ ਕਰਮਚਾਰੀ ਬਿਨਾਂ ਕਿਸੇ ਰੋਕ ਦੇ ਸੁਰੱਖਿਆ ਟ੍ਰੇਨਿੰਗ ਛੱਡ ਸਕਦੇ ਹਨ।"),
    extraId: "training_paid", extra: t("New staff receive extra pay for attending the training.", "प्रशिक्षण में भाग लेने पर नए कर्मचारियों को अतिरिक्त वेतन मिलता है।", "ਟ੍ਰੇਨਿੰਗ ਵਿੱਚ ਹਾਜ਼ਰ ਹੋਣ ਤੇ ਨਵੇਂ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਵਾਧੂ ਤਨਖ਼ਾਹ ਮਿਲਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-035", factId: "payment_online_only",
    statement: t("The application fee can be paid online only.", "आवेदन शुल्क का भुगतान केवल ऑनलाइन किया जा सकता है।", "ਅਰਜ਼ੀ ਫੀਸ ਦਾ ਭੁਗਤਾਨ ਕੇਵਲ ਆਨਲਾਈਨ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"),
    paraphrase: t("Offline payment is not an available method for the application fee.", "आवेदन शुल्क के लिए ऑफलाइन भुगतान की सुविधा उपलब्ध नहीं है।", "ਅਰਜ਼ੀ ਫੀਸ ਲਈ ਆਫਲਾਈਨ ਭੁਗਤਾਨ ਦੀ ਸਹੂਲਤ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।"),
    negative: t("The application fee can be paid offline.", "आवेदन शुल्क का भुगतान ऑफलाइन किया जा सकता है।", "ਅਰਜ਼ੀ ਫੀਸ ਦਾ ਭੁਗਤਾਨ ਆਫਲਾਈਨ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"),
    extraId: "payment_refund", extra: t("The application fee is fully refundable.", "आवेदन शुल्क पूरी तरह वापस किया जाता है।", "ਅਰਜ਼ੀ ਫੀਸ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵਾਪਸ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-036", factId: "membership_one_year",
    statement: t("A standard library membership is valid for one year.", "सामान्य पुस्तकालय सदस्यता एक वर्ष के लिए मान्य है।", "ਆਮ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰਸ਼ਿਪ ਇੱਕ ਸਾਲ ਲਈ ਵੈਧ ਹੈ।"),
    paraphrase: t("The validity period of a standard library membership is one year.", "सामान्य पुस्तकालय सदस्यता की वैधता अवधि एक वर्ष है।", "ਆਮ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰਸ਼ਿਪ ਦੀ ਵੈਧਤਾ ਮਿਆਦ ਇੱਕ ਸਾਲ ਹੈ।"),
    negative: t("A standard library membership is not valid for one year.", "सामान्य पुस्तकालय सदस्यता एक वर्ष के लिए मान्य नहीं है।", "ਆਮ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰਸ਼ਿਪ ਇੱਕ ਸਾਲ ਲਈ ਵੈਧ ਨਹੀਂ ਹੈ।"),
    extraId: "membership_transferable", extra: t("Library membership can be transferred to another person.", "पुस्तकालय सदस्यता किसी अन्य व्यक्ति को हस्तांतरित की जा सकती है।", "ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰਸ਼ਿਪ ਕਿਸੇ ਹੋਰ ਵਿਅਕਤੀ ਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।"),
  },
  {
    id: "STC-SC-037", factId: "exam_two_hours",
    statement: t("The written examination lasts for two hours.", "लिखित परीक्षा की अवधि दो घंटे है।", "ਲਿਖਤੀ ਪਰੀਖਿਆ ਦੀ ਮਿਆਦ ਦੋ ਘੰਟੇ ਹੈ।"),
    paraphrase: t("Candidates get two hours to complete the written examination.", "उम्मीदवारों को लिखित परीक्षा पूरी करने के लिए दो घंटे मिलते हैं।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਲਿਖਤੀ ਪਰੀਖਿਆ ਪੂਰੀ ਕਰਨ ਲਈ ਦੋ ਘੰਟੇ ਮਿਲਦੇ ਹਨ।"),
    negative: t("The written examination does not last for two hours.", "लिखित परीक्षा की अवधि दो घंटे नहीं है।", "ਲਿਖਤੀ ਪਰੀਖਿਆ ਦੀ ਮਿਆਦ ਦੋ ਘੰਟੇ ਨਹੀਂ ਹੈ।"),
    extraId: "exam_sections_three", extra: t("The written examination has exactly three sections.", "लिखित परीक्षा में ठीक तीन खंड हैं।", "ਲਿਖਤੀ ਪਰੀਖਿਆ ਵਿੱਚ ਠੀਕ ਤਿੰਨ ਭਾਗ ਹਨ।"),
  },
  {
    id: "STC-SC-038", factId: "desk_first_floor",
    statement: t("The reservation help desk is on the first floor.", "आरक्षण सहायता डेस्क पहली मंजिल पर है।", "ਰਿਜ਼ਰਵੇਸ਼ਨ ਸਹਾਇਤਾ ਡੈਸਕ ਪਹਿਲੀ ਮੰਜ਼ਿਲ ਤੇ ਹੈ।"),
    paraphrase: t("Visitors looking for the reservation help desk should go to the first floor.", "आरक्षण सहायता डेस्क के लिए आगंतुकों को पहली मंजिल पर जाना होगा।", "ਰਿਜ਼ਰਵੇਸ਼ਨ ਸਹਾਇਤਾ ਡੈਸਕ ਲਈ ਆਉਣ ਵਾਲਿਆਂ ਨੂੰ ਪਹਿਲੀ ਮੰਜ਼ਿਲ ਤੇ ਜਾਣਾ ਹੋਵੇਗਾ।"),
    negative: t("The reservation help desk is not on the first floor.", "आरक्षण सहायता डेस्क पहली मंजिल पर नहीं है।", "ਰਿਜ਼ਰਵੇਸ਼ਨ ਸਹਾਇਤਾ ਡੈਸਕ ਪਹਿਲੀ ਮੰਜ਼ਿਲ ਤੇ ਨਹੀਂ ਹੈ।"),
    extraId: "desk_open_24h", extra: t("The reservation help desk is open 24 hours a day.", "आरक्षण सहायता डेस्क 24 घंटे खुला रहता है।", "ਰਿਜ਼ਰਵੇਸ਼ਨ ਸਹਾਇਤਾ ਡੈਸਕ 24 ਘੰਟੇ ਖੁੱਲ੍ਹਾ ਰਹਿੰਦਾ ਹੈ।"),
  },
] as const;

export const STC_QL001_EXAM_REALNESS_CONTEXTS: readonly StcScenarioAuthority[] = rows.map((row) => ({
  id: row.id,
  qlId: "STC-QL-001",
  difficulty: row.difficulty ?? "MEDIUM",
  statement: row.statement,
  premises: [atom(row.factId)],
  candidates: [
    { id: "C1", expression: atom(row.factId), text: row.statement },
    { id: "C2", expression: atom(row.factId), text: row.paraphrase },
    { id: "C3", expression: not(atom(row.factId)), text: row.negative, defectIfNotEntailed: "POLARITY_FLIP" },
    { id: "C4", expression: atom(row.extraId), text: row.extra, defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
  ],
}));
