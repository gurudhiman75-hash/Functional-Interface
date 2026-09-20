import type { SifContextDomain, SifDistractorType, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

type Localized = readonly [en: string, hi: string, pa: string];

const text = ([en, hi, pa]: Localized): SifLocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const guard = { evaluatesSupport: true, assumptionQuestion: false, conclusionQuestion: false, argumentQuestion: false, causeEffectQuestion: false, courseOfActionQuestion: false } as const;

function direct(input: {
  readonly id: string;
  readonly domain: SifContextDomain;
  readonly statement: Localized;
  readonly facts: readonly Localized[];
  readonly valid: Localized;
  readonly invalid: Localized;
  readonly distractorType: SifDistractorType;
  readonly explanation: Localized;
}): SifScenarioAuthority {
  const factIds = input.facts.map((_, index) => `F${index + 1}`);
  return {
    id: input.id,
    cpId: "SIF-CP001",
    difficulty: "EASY",
    domain: input.domain,
    mechanisms: ["DIRECT_FACT"],
    statement: text(input.statement),
    facts: input.facts.map((factText, index) => ({ id: factIds[index], text: text(factText) })),
    candidates: [
      { id: "I", text: text(input.valid), strength: "CERTAIN", follows: true, supportFactIds: factIds },
      { id: "II", text: text(input.invalid), strength: "POSSIBLE_ONLY", follows: false, supportFactIds: factIds, distractorType: input.distractorType },
    ],
    explanation: text(input.explanation),
    identityGuard: guard,
  };
}

export const SIF_CP001_WAVE2_AUTHORITIES: readonly SifScenarioAuthority[] = [
  direct({
    id: "SIF-CP001-PARCEL-DELIVERY", domain: "BUSINESS",
    statement: ["A courier centre sent 48 parcels for delivery. By evening, 46 had been delivered and two had been returned to the centre.", "एक कूरियर केंद्र ने 48 पार्सल वितरण के लिए भेजे। शाम तक 46 पार्सल पहुंचा दिए गए और दो केंद्र पर वापस आ गए।", "ਇੱਕ ਕੂਰੀਅਰ ਕੇਂਦਰ ਨੇ 48 ਪਾਰਸਲ ਡਿਲਿਵਰੀ ਲਈ ਭੇਜੇ। ਸ਼ਾਮ ਤੱਕ 46 ਪਾਰਸਲ ਪਹੁੰਚਾ ਦਿੱਤੇ ਗਏ ਅਤੇ ਦੋ ਕੇਂਦਰ ਵਾਪਸ ਆ ਗਏ।"],
    facts: [["Forty-eight parcels were sent.", "48 पार्सल भेजे गए।", "48 ਪਾਰਸਲ ਭੇਜੇ ਗਏ।"], ["Forty-six were delivered and two returned.", "46 पहुंचाए गए और दो वापस आए।", "46 ਪਹੁੰਚਾਏ ਗਏ ਅਤੇ ਦੋ ਵਾਪਸ ਆਏ।"]],
    valid: ["Every parcel sent out that day was either delivered or returned to the centre.", "उस दिन भेजा गया प्रत्येक पार्सल या तो पहुंचा दिया गया या केंद्र पर वापस आ गया।", "ਉਸ ਦਿਨ ਭੇਜਿਆ ਹਰ ਪਾਰਸਲ ਜਾਂ ਤਾਂ ਪਹੁੰਚਾ ਦਿੱਤਾ ਗਿਆ ਜਾਂ ਕੇਂਦਰ ਵਾਪਸ ਆ ਗਿਆ।"],
    invalid: ["The two parcels were returned because their addresses were incorrect.", "दोनों पार्सल गलत पते के कारण वापस आए।", "ਦੋਵੇਂ ਪਾਰਸਲ ਗਲਤ ਪਤਿਆਂ ਕਾਰਨ ਵਾਪਸ ਆਏ।"], distractorType: "CAUSE_ASSUMPTION",
    explanation: ["The 46 delivered parcels and two returned parcels account for all 48 parcels. The reason for the returns is not given. Therefore, only I follows.", "46 पहुंचाए गए और दो लौटे पार्सल मिलकर सभी 48 पार्सल पूरे करते हैं। वापसी का कारण नहीं बताया गया। इसलिए केवल I सही है।", "46 ਪਹੁੰਚਾਏ ਅਤੇ ਦੋ ਵਾਪਸ ਆਏ ਪਾਰਸਲ ਮਿਲ ਕੇ ਸਾਰੇ 48 ਪਾਰਸਲ ਪੂਰੇ ਕਰਦੇ ਹਨ। ਵਾਪਸੀ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-LIBRARY-ACCOUNT", domain: "EDUCATION",
    statement: ["Sixty books were due at the college library on Friday. Fifty-seven were returned, and the borrowing period for the other three was renewed.", "कॉलेज पुस्तकालय में शुक्रवार को 60 पुस्तकें लौटाई जानी थीं। 57 पुस्तकें लौटा दी गईं और बाकी तीन की उधार अवधि बढ़ा दी गई।", "ਕਾਲਜ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ 60 ਕਿਤਾਬਾਂ ਵਾਪਸ ਹੋਣੀਆਂ ਸਨ। 57 ਕਿਤਾਬਾਂ ਵਾਪਸ ਕਰ ਦਿੱਤੀਆਂ ਗਈਆਂ ਅਤੇ ਬਾਕੀ ਤਿੰਨ ਦੀ ਉਧਾਰ ਮਿਆਦ ਵਧਾ ਦਿੱਤੀ ਗਈ।"],
    facts: [["Sixty books were due.", "60 पुस्तकें देय थीं।", "60 ਕਿਤਾਬਾਂ ਵਾਪਸ ਹੋਣੀਆਂ ਸਨ।"], ["Fifty-seven were returned and three were renewed.", "57 लौटीं और तीन की अवधि बढ़ी।", "57 ਵਾਪਸ ਹੋਈਆਂ ਅਤੇ ਤਿੰਨ ਦੀ ਮਿਆਦ ਵਧੀ।"]],
    valid: ["None of the sixty books remained unaccounted for on Friday.", "शुक्रवार को 60 पुस्तकों में से कोई भी बिना स्थिति दर्ज हुए नहीं रही।", "ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ 60 ਕਿਤਾਬਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਦੀ ਵੀ ਸਥਿਤੀ ਅਣਜਾਣ ਨਹੀਂ ਰਹੀ।"],
    invalid: ["A late fee was charged on the three renewed books.", "अवधि बढ़ाई गई तीन पुस्तकों पर विलंब शुल्क लगाया गया।", "ਮਿਆਦ ਵਧਾਈਆਂ ਤਿੰਨ ਕਿਤਾਬਾਂ ਉੱਤੇ ਦੇਰੀ ਦੀ ਫੀਸ ਲਗਾਈ ਗਈ।"], distractorType: "UNSUPPORTED_DETAIL",
    explanation: ["The 57 returned books and three renewed books account for all 60 books. Nothing is stated about a fee. Therefore, only I follows.", "57 लौटाई गई और तीन नवीनीकृत पुस्तकें मिलकर सभी 60 पुस्तकों का हिसाब देती हैं। शुल्क के बारे में कुछ नहीं कहा गया। इसलिए केवल I सही है।", "57 ਵਾਪਸ ਕੀਤੀਆਂ ਅਤੇ ਤਿੰਨ ਨਵੀਨੀਕਰਿਤ ਕਿਤਾਬਾਂ ਮਿਲ ਕੇ ਸਾਰੀਆਂ 60 ਕਿਤਾਬਾਂ ਦਾ ਹਿਸਾਬ ਦਿੰਦੀਆਂ ਹਨ। ਫੀਸ ਬਾਰੇ ਕੁਝ ਨਹੀਂ ਕਿਹਾ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-EXAM-ATTENDANCE", domain: "EDUCATION",
    statement: ["Three hundred and twenty candidates were registered for an examination. Three hundred candidates appeared for it.", "एक परीक्षा के लिए 320 अभ्यर्थी पंजीकृत थे। उनमें से 300 परीक्षा में उपस्थित हुए।", "ਇੱਕ ਪ੍ਰੀਖਿਆ ਲਈ 320 ਉਮੀਦਵਾਰ ਰਜਿਸਟਰ ਸਨ। ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ 300 ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਹਾਜ਼ਰ ਹੋਏ।"],
    facts: [["Three hundred and twenty candidates were registered.", "320 अभ्यर्थी पंजीकृत थे।", "320 ਉਮੀਦਵਾਰ ਰਜਿਸਟਰ ਸਨ।"], ["Three hundred appeared.", "300 उपस्थित हुए।", "300 ਹਾਜ਼ਰ ਹੋਏ।"]],
    valid: ["Twenty registered candidates did not appear for the examination.", "बीस पंजीकृत अभ्यर्थी परीक्षा में उपस्थित नहीं हुए।", "ਵੀਹ ਰਜਿਸਟਰ ਉਮੀਦਵਾਰ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਹਾਜ਼ਰ ਨਹੀਂ ਹੋਏ।"],
    invalid: ["All twenty absent candidates missed the examination because they were ill.", "सभी बीस अनुपस्थित अभ्यर्थी बीमारी के कारण परीक्षा में नहीं आए।", "ਸਾਰੇ ਵੀਹ ਗੈਰਹਾਜ਼ਰ ਉਮੀਦਵਾਰ ਬਿਮਾਰੀ ਕਾਰਨ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਨਹੀਂ ਆਏ।"], distractorType: "CAUSE_ASSUMPTION",
    explanation: ["The difference between 320 registered and 300 present candidates is 20. The statement gives no reason for their absence. Therefore, only I follows.", "320 पंजीकृत और 300 उपस्थित अभ्यर्थियों का अंतर 20 है। उनकी अनुपस्थिति का कारण नहीं बताया गया। इसलिए केवल I सही है।", "320 ਰਜਿਸਟਰ ਅਤੇ 300 ਹਾਜ਼ਰ ਉਮੀਦਵਾਰਾਂ ਦਾ ਅੰਤਰ 20 ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਗੈਰਹਾਜ਼ਰੀ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-CLINIC-APPOINTMENTS", domain: "EVERYDAY",
    statement: ["A clinic scheduled 35 appointments for Monday. Five were cancelled in advance, and all the remaining patients attended.", "एक क्लिनिक ने सोमवार के लिए 35 अपॉइंटमेंट तय किए। पांच पहले ही रद्द हो गए और बाकी सभी मरीज आए।", "ਇੱਕ ਕਲੀਨਿਕ ਨੇ ਸੋਮਵਾਰ ਲਈ 35 ਮੁਲਾਕਾਤਾਂ ਤੈਅ ਕੀਤੀਆਂ। ਪੰਜ ਪਹਿਲਾਂ ਹੀ ਰੱਦ ਹੋ ਗਈਆਂ ਅਤੇ ਬਾਕੀ ਸਾਰੇ ਮਰੀਜ਼ ਆਏ।"],
    facts: [["Thirty-five appointments were scheduled.", "35 अपॉइंटमेंट तय थे।", "35 ਮੁਲਾਕਾਤਾਂ ਤੈਅ ਸਨ।"], ["Five were cancelled and every other patient attended.", "पांच रद्द हुए और बाकी सभी मरीज आए।", "ਪੰਜ ਰੱਦ ਹੋਏ ਅਤੇ ਬਾਕੀ ਸਾਰੇ ਮਰੀਜ਼ ਆਏ।"]],
    valid: ["Thirty patients attended the clinic on Monday.", "सोमवार को 30 मरीज क्लिनिक आए।", "ਸੋਮਵਾਰ ਨੂੰ 30 ਮਰੀਜ਼ ਕਲੀਨਿਕ ਆਏ।"],
    invalid: ["The five appointments were cancelled because the doctor was unavailable.", "पांच अपॉइंटमेंट डॉक्टर के उपलब्ध न होने के कारण रद्द हुए।", "ਪੰਜ ਮੁਲਾਕਾਤਾਂ ਡਾਕਟਰ ਦੇ ਉਪਲਬਧ ਨਾ ਹੋਣ ਕਾਰਨ ਰੱਦ ਹੋਈਆਂ।"], distractorType: "CAUSE_ASSUMPTION",
    explanation: ["After five of the 35 appointments were cancelled, 30 remained, and all of them attended. The reason for cancellation is not stated. Therefore, only I follows.", "35 में से पांच अपॉइंटमेंट रद्द होने पर 30 बचे और वे सभी आए। रद्द होने का कारण नहीं बताया गया। इसलिए केवल I सही है।", "35 ਵਿੱਚੋਂ ਪੰਜ ਮੁਲਾਕਾਤਾਂ ਰੱਦ ਹੋਣ ਤੋਂ ਬਾਅਦ 30 ਬਚੀਆਂ ਅਤੇ ਉਹ ਸਾਰੇ ਆਏ। ਰੱਦ ਹੋਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-WAREHOUSE-ARRIVALS", domain: "TRANSPORT",
    statement: ["Eleven delivery trucks reached a warehouse on Tuesday. Eight arrived before noon and three arrived after noon.", "मंगलवार को 11 मालवाहक ट्रक एक गोदाम पहुंचे। आठ दोपहर से पहले और तीन दोपहर के बाद पहुंचे।", "ਮੰਗਲਵਾਰ ਨੂੰ 11 ਮਾਲਵਾਹਕ ਟਰੱਕ ਇੱਕ ਗੋਦਾਮ ਪਹੁੰਚੇ। ਅੱਠ ਦੁਪਹਿਰ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਤਿੰਨ ਦੁਪਹਿਰ ਤੋਂ ਬਾਅਦ ਪਹੁੰਚੇ।"],
    facts: [["Eight trucks arrived before noon.", "आठ ट्रक दोपहर से पहले पहुंचे।", "ਅੱਠ ਟਰੱਕ ਦੁਪਹਿਰ ਤੋਂ ਪਹਿਲਾਂ ਪਹੁੰਚੇ।"], ["Three arrived after noon.", "तीन दोपहर के बाद पहुंचे।", "ਤਿੰਨ ਦੁਪਹਿਰ ਤੋਂ ਬਾਅਦ ਪਹੁੰਚੇ।"]],
    valid: ["More trucks arrived before noon than after noon.", "दोपहर से पहले पहुंचने वाले ट्रकों की संख्या बाद में पहुंचने वालों से अधिक थी।", "ਦੁਪਹਿਰ ਤੋਂ ਪਹਿਲਾਂ ਪਹੁੰਚੇ ਟਰੱਕਾਂ ਦੀ ਗਿਣਤੀ ਬਾਅਦ ਵਿੱਚ ਪਹੁੰਚਿਆਂ ਨਾਲੋਂ ਵੱਧ ਸੀ।"],
    invalid: ["The three trucks arrived after noon because of heavy traffic.", "तीन ट्रक भारी यातायात के कारण दोपहर के बाद पहुंचे।", "ਤਿੰਨ ਟਰੱਕ ਭਾਰੀ ਆਵਾਜਾਈ ਕਾਰਨ ਦੁਪਹਿਰ ਤੋਂ ਬਾਅਦ ਪਹੁੰਚੇ।"], distractorType: "CAUSE_ASSUMPTION",
    explanation: ["Eight is greater than three, so more trucks arrived before noon. The statement does not explain the later arrivals. Therefore, only I follows.", "आठ, तीन से अधिक है, इसलिए अधिक ट्रक दोपहर से पहले पहुंचे। बाद में पहुंचने का कारण नहीं बताया गया। इसलिए केवल I सही है।", "ਅੱਠ, ਤਿੰਨ ਨਾਲੋਂ ਵੱਧ ਹੈ, ਇਸ ਲਈ ਵੱਧ ਟਰੱਕ ਦੁਪਹਿਰ ਤੋਂ ਪਹਿਲਾਂ ਪਹੁੰਚੇ। ਬਾਅਦ ਵਿੱਚ ਪਹੁੰਚਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-BILL-PAYMENTS", domain: "BANKING",
    statement: ["A service centre received payment for 240 bills. Of these, 180 were paid online and the rest were paid at the counter.", "एक सेवा केंद्र को 240 बिलों का भुगतान मिला। इनमें से 180 का भुगतान ऑनलाइन और बाकी का काउंटर पर हुआ।", "ਇੱਕ ਸੇਵਾ ਕੇਂਦਰ ਨੂੰ 240 ਬਿੱਲਾਂ ਦਾ ਭੁਗਤਾਨ ਮਿਲਿਆ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ 180 ਦਾ ਭੁਗਤਾਨ ਆਨਲਾਈਨ ਅਤੇ ਬਾਕੀਆਂ ਦਾ ਕਾਊਂਟਰ ਉੱਤੇ ਹੋਇਆ।"],
    facts: [["Payments were received for 240 bills.", "240 बिलों का भुगतान मिला।", "240 ਬਿੱਲਾਂ ਦਾ ਭੁਗਤਾਨ ਮਿਲਿਆ।"], ["One hundred and eighty were paid online.", "180 का ऑनलाइन भुगतान हुआ।", "180 ਦਾ ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਹੋਇਆ।"]],
    valid: ["Sixty bills were paid at the counter.", "साठ बिलों का भुगतान काउंटर पर हुआ।", "ਸੱਠ ਬਿੱਲਾਂ ਦਾ ਭੁਗਤਾਨ ਕਾਊਂਟਰ ਉੱਤੇ ਹੋਇਆ।"],
    invalid: ["Every online payment received a discount.", "हर ऑनलाइन भुगतान पर छूट मिली।", "ਹਰ ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਉੱਤੇ ਛੂਟ ਮਿਲੀ।"], distractorType: "UNSUPPORTED_DETAIL",
    explanation: ["Of the 240 bills, 180 were paid online, leaving 60 paid at the counter. No discount is mentioned. Therefore, only I follows.", "240 में से 180 बिल ऑनलाइन भरे गए, इसलिए 60 काउंटर पर भरे गए। किसी छूट का उल्लेख नहीं है। इसलिए केवल I सही है।", "240 ਵਿੱਚੋਂ 180 ਬਿੱਲ ਆਨਲਾਈਨ ਭਰੇ ਗਏ, ਇਸ ਲਈ 60 ਕਾਊਂਟਰ ਉੱਤੇ ਭਰੇ ਗਏ। ਕਿਸੇ ਛੂਟ ਦਾ ਜ਼ਿਕਰ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-NOTICE-RESPONSE", domain: "PUBLIC_ADMINISTRATION",
    statement: ["The department issued a notice on Monday allowing seven days for a reply. The reply was submitted on Friday of the same week.", "विभाग ने सोमवार को नोटिस जारी कर उत्तर के लिए सात दिन दिए। उत्तर उसी सप्ताह शुक्रवार को जमा कर दिया गया।", "ਵਿਭਾਗ ਨੇ ਸੋਮਵਾਰ ਨੂੰ ਨੋਟਿਸ ਜਾਰੀ ਕਰਕੇ ਜਵਾਬ ਲਈ ਸੱਤ ਦਿਨ ਦਿੱਤੇ। ਜਵਾਬ ਉਸੇ ਹਫ਼ਤੇ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਜਮ੍ਹਾਂ ਕਰ ਦਿੱਤਾ ਗਿਆ।"],
    facts: [["The notice allowed seven days.", "नोटिस में सात दिन दिए गए।", "ਨੋਟਿਸ ਵਿੱਚ ਸੱਤ ਦਿਨ ਦਿੱਤੇ ਗਏ।"], ["The reply was submitted on Friday after a Monday notice.", "सोमवार के नोटिस का उत्तर शुक्रवार को दिया गया।", "ਸੋਮਵਾਰ ਦੇ ਨੋਟਿਸ ਦਾ ਜਵਾਬ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਦਿੱਤਾ ਗਿਆ।"]],
    valid: ["The reply was submitted within the time allowed in the notice.", "उत्तर नोटिस में दी गई समय-सीमा के भीतर जमा हुआ।", "ਜਵਾਬ ਨੋਟਿਸ ਵਿੱਚ ਦਿੱਤੀ ਸਮਾਂ-ਸੀਮਾ ਅੰਦਰ ਜਮ੍ਹਾਂ ਹੋਇਆ।"],
    invalid: ["The department accepted every point made in the reply.", "विभाग ने उत्तर में लिखी हर बात स्वीकार कर ली।", "ਵਿਭਾਗ ਨੇ ਜਵਾਬ ਵਿੱਚ ਲਿਖੀ ਹਰ ਗੱਲ ਮੰਨ ਲਈ।"], distractorType: "UNSUPPORTED_DETAIL",
    explanation: ["Friday falls within seven days of Monday, so the reply was timely. The statement says nothing about whether its contents were accepted. Therefore, only I follows.", "शुक्रवार, सोमवार से सात दिन की सीमा के भीतर आता है, इसलिए उत्तर समय पर था। उत्तर स्वीकार हुआ या नहीं, यह नहीं बताया गया। इसलिए केवल I सही है।", "ਸ਼ੁੱਕਰਵਾਰ, ਸੋਮਵਾਰ ਤੋਂ ਸੱਤ ਦਿਨਾਂ ਦੀ ਹੱਦ ਅੰਦਰ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਜਵਾਬ ਸਮੇਂ ਸਿਰ ਸੀ। ਜਵਾਬ ਮੰਨਿਆ ਗਿਆ ਜਾਂ ਨਹੀਂ, ਇਹ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-WATER-TANKS", domain: "EVERYDAY",
    statement: ["Tank A contained 600 litres of water and Tank B contained 450 litres. No water was transferred between the tanks.", "टंकी A में 600 लीटर और टंकी B में 450 लीटर पानी था। दोनों टंकियों के बीच पानी स्थानांतरित नहीं किया गया।", "ਟੈਂਕੀ A ਵਿੱਚ 600 ਲੀਟਰ ਅਤੇ ਟੈਂਕੀ B ਵਿੱਚ 450 ਲੀਟਰ ਪਾਣੀ ਸੀ। ਦੋਵਾਂ ਟੈਂਕੀਆਂ ਵਿਚਕਾਰ ਪਾਣੀ ਤਬਦੀਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।"],
    facts: [["Tank A had 600 litres.", "टंकी A में 600 लीटर था।", "ਟੈਂਕੀ A ਵਿੱਚ 600 ਲੀਟਰ ਸੀ।"], ["Tank B had 450 litres.", "टंकी B में 450 लीटर था।", "ਟੈਂਕੀ B ਵਿੱਚ 450 ਲੀਟਰ ਸੀ।"]],
    valid: ["Tank A contained 150 litres more water than Tank B.", "टंकी A में टंकी B से 150 लीटर अधिक पानी था।", "ਟੈਂਕੀ A ਵਿੱਚ ਟੈਂਕੀ B ਨਾਲੋਂ 150 ਲੀਟਰ ਵੱਧ ਪਾਣੀ ਸੀ।"],
    invalid: ["Tank B had lost 150 litres because of leakage.", "टंकी B में रिसाव के कारण 150 लीटर पानी कम था।", "ਟੈਂਕੀ B ਵਿੱਚ ਰਿਸਾਅ ਕਾਰਨ 150 ਲੀਟਰ ਪਾਣੀ ਘੱਟ ਸੀ।"], distractorType: "CAUSE_ASSUMPTION",
    explanation: ["The stated quantities differ by 150 litres, so I follows. The statement gives no earlier quantity or evidence of leakage. Therefore, II does not follow.", "दी गई मात्राओं का अंतर 150 लीटर है, इसलिए I सही है। पहले की मात्रा या रिसाव का कोई प्रमाण नहीं दिया गया। इसलिए II सही नहीं है।", "ਦਿੱਤੀਆਂ ਮਾਤਰਾਵਾਂ ਦਾ ਅੰਤਰ 150 ਲੀਟਰ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਪਹਿਲਾਂ ਦੀ ਮਾਤਰਾ ਜਾਂ ਰਿਸਾਅ ਦਾ ਕੋਈ ਸਬੂਤ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-TRAINING-CERTIFICATES", domain: "WORKPLACE",
    statement: ["Fifty employees took the safety assessment. Forty-four passed, and certificates were issued to every employee who passed.", "पचास कर्मचारियों ने सुरक्षा मूल्यांकन दिया। 44 उत्तीर्ण हुए और उत्तीर्ण होने वाले प्रत्येक कर्मचारी को प्रमाणपत्र दिया गया।", "ਪੰਜਾਹ ਕਰਮਚਾਰੀਆਂ ਨੇ ਸੁਰੱਖਿਆ ਮੁਲਾਂਕਣ ਦਿੱਤਾ। 44 ਪਾਸ ਹੋਏ ਅਤੇ ਪਾਸ ਹੋਏ ਹਰ ਕਰਮਚਾਰੀ ਨੂੰ ਸਰਟੀਫਿਕੇਟ ਦਿੱਤਾ ਗਿਆ।"],
    facts: [["Fifty employees took the assessment.", "50 कर्मचारियों ने मूल्यांकन दिया।", "50 ਕਰਮਚਾਰੀਆਂ ਨੇ ਮੁਲਾਂਕਣ ਦਿੱਤਾ।"], ["Forty-four passed and each received a certificate.", "44 उत्तीर्ण हुए और सभी को प्रमाणपत्र मिला।", "44 ਪਾਸ ਹੋਏ ਅਤੇ ਸਭ ਨੂੰ ਸਰਟੀਫਿਕੇਟ ਮਿਲਿਆ।"]],
    valid: ["Forty-four safety certificates were issued to employees who passed.", "उत्तीर्ण कर्मचारियों को 44 सुरक्षा प्रमाणपत्र जारी किए गए।", "ਪਾਸ ਹੋਏ ਕਰਮਚਾਰੀਆਂ ਨੂੰ 44 ਸੁਰੱਖਿਆ ਸਰਟੀਫਿਕੇਟ ਜਾਰੀ ਕੀਤੇ ਗਏ।"],
    invalid: ["The six employees who did not pass had missed the training sessions.", "अनुत्तीर्ण छह कर्मचारी प्रशिक्षण सत्रों में अनुपस्थित रहे थे।", "ਪਾਸ ਨਾ ਹੋਏ ਛੇ ਕਰਮਚਾਰੀ ਸਿਖਲਾਈ ਸੈਸ਼ਨਾਂ ਤੋਂ ਗੈਰਹਾਜ਼ਰ ਰਹੇ ਸਨ।"], distractorType: "CAUSE_ASSUMPTION",
    explanation: ["All 44 employees who passed received certificates, so 44 certificates were issued to them. The reason the other six did not pass is not stated. Therefore, only I follows.", "उत्तीर्ण सभी 44 कर्मचारियों को प्रमाणपत्र मिला, इसलिए उन्हें 44 प्रमाणपत्र दिए गए। बाकी छह के अनुत्तीर्ण होने का कारण नहीं बताया गया। इसलिए केवल I सही है।", "ਪਾਸ ਹੋਏ ਸਾਰੇ 44 ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਸਰਟੀਫਿਕੇਟ ਮਿਲਿਆ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਨੂੰ 44 ਸਰਟੀਫਿਕੇਟ ਦਿੱਤੇ ਗਏ। ਬਾਕੀ ਛੇ ਦੇ ਪਾਸ ਨਾ ਹੋਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-BUS-PASS-APPLICATIONS", domain: "PUBLIC_ADMINISTRATION",
    statement: ["The transport office examined 125 bus-pass applications. It approved 100 applications and kept the remaining 25 pending; none was rejected.", "परिवहन कार्यालय ने 125 बस-पास आवेदनों की जांच की। 100 आवेदन मंजूर हुए और बाकी 25 लंबित रखे गए; कोई आवेदन अस्वीकृत नहीं हुआ।", "ਆਵਾਜਾਈ ਦਫ਼ਤਰ ਨੇ 125 ਬੱਸ-ਪਾਸ ਅਰਜ਼ੀਆਂ ਦੀ ਜਾਂਚ ਕੀਤੀ। 100 ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਹੋਈਆਂ ਅਤੇ ਬਾਕੀ 25 ਲੰਬਿਤ ਰੱਖੀਆਂ ਗਈਆਂ; ਕੋਈ ਅਰਜ਼ੀ ਰੱਦ ਨਹੀਂ ਹੋਈ।"],
    facts: [["One hundred applications were approved.", "100 आवेदन मंजूर हुए।", "100 ਅਰਜ਼ੀਆਂ ਮਨਜ਼ੂਰ ਹੋਈਆਂ।"], ["Twenty-five were pending and none was rejected.", "25 लंबित थे और कोई अस्वीकृत नहीं हुआ।", "25 ਲੰਬਿਤ ਸਨ ਅਤੇ ਕੋਈ ਰੱਦ ਨਹੀਂ ਹੋਈ।"]],
    valid: ["Every examined application was either approved or pending.", "जांचा गया प्रत्येक आवेदन या तो मंजूर था या लंबित।", "ਜਾਂਚੀ ਗਈ ਹਰ ਅਰਜ਼ੀ ਜਾਂ ਤਾਂ ਮਨਜ਼ੂਰ ਸੀ ਜਾਂ ਲੰਬਿਤ।"],
    invalid: ["All pending applications lacked identity documents.", "सभी लंबित आवेदनों में पहचान संबंधी दस्तावेज नहीं थे।", "ਸਾਰੀਆਂ ਲੰਬਿਤ ਅਰਜ਼ੀਆਂ ਵਿੱਚ ਪਛਾਣ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਸਨ।"], distractorType: "UNSUPPORTED_DETAIL",
    explanation: ["The 100 approved and 25 pending applications account for all 125, and none was rejected. The reason for keeping 25 pending is not given. Therefore, only I follows.", "100 मंजूर और 25 लंबित आवेदन मिलकर सभी 125 आवेदन पूरे करते हैं और कोई अस्वीकृत नहीं था। 25 को लंबित रखने का कारण नहीं बताया गया। इसलिए केवल I सही है।", "100 ਮਨਜ਼ੂਰ ਅਤੇ 25 ਲੰਬਿਤ ਅਰਜ਼ੀਆਂ ਮਿਲ ਕੇ ਸਾਰੀਆਂ 125 ਅਰਜ਼ੀਆਂ ਪੂਰੀਆਂ ਕਰਦੀਆਂ ਹਨ ਅਤੇ ਕੋਈ ਰੱਦ ਨਹੀਂ ਸੀ। 25 ਨੂੰ ਲੰਬਿਤ ਰੱਖਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-SHOP-HOURS", domain: "BUSINESS",
    statement: ["A store remains open from 9 a.m. to 6 p.m. on weekdays and from 9 a.m. to 2 p.m. on Saturday. It remains closed on Sunday.", "एक दुकान कार्यदिवसों में सुबह 9 बजे से शाम 6 बजे तक और शनिवार को सुबह 9 बजे से दोपहर 2 बजे तक खुलती है। रविवार को दुकान बंद रहती है।", "ਇੱਕ ਦੁਕਾਨ ਕੰਮਕਾਜ ਵਾਲੇ ਦਿਨਾਂ ਵਿੱਚ ਸਵੇਰੇ 9 ਵਜੇ ਤੋਂ ਸ਼ਾਮ 6 ਵਜੇ ਤੱਕ ਅਤੇ ਸ਼ਨੀਵਾਰ ਨੂੰ ਸਵੇਰੇ 9 ਵਜੇ ਤੋਂ ਦੁਪਹਿਰ 2 ਵਜੇ ਤੱਕ ਖੁੱਲ੍ਹਦੀ ਹੈ। ਐਤਵਾਰ ਨੂੰ ਦੁਕਾਨ ਬੰਦ ਰਹਿੰਦੀ ਹੈ।"],
    facts: [["Weekday closing time is 6 p.m.", "कार्यदिवसों में दुकान शाम 6 बजे बंद होती है।", "ਕੰਮਕਾਜ ਵਾਲੇ ਦਿਨਾਂ ਵਿੱਚ ਦੁਕਾਨ ਸ਼ਾਮ 6 ਵਜੇ ਬੰਦ ਹੁੰਦੀ ਹੈ।"], ["Saturday closing time is 2 p.m.", "शनिवार को दुकान दोपहर 2 बजे बंद होती है।", "ਸ਼ਨੀਵਾਰ ਨੂੰ ਦੁਕਾਨ ਦੁਪਹਿਰ 2 ਵਜੇ ਬੰਦ ਹੁੰਦੀ ਹੈ।"]],
    valid: ["The store closes earlier on Saturday than on a weekday.", "दुकान कार्यदिवस की तुलना में शनिवार को पहले बंद होती है।", "ਦੁਕਾਨ ਕੰਮਕਾਜ ਵਾਲੇ ਦਿਨ ਨਾਲੋਂ ਸ਼ਨੀਵਾਰ ਨੂੰ ਪਹਿਲਾਂ ਬੰਦ ਹੁੰਦੀ ਹੈ।"],
    invalid: ["The store closes early on Saturday because fewer employees work that day.", "शनिवार को कम कर्मचारी काम करने के कारण दुकान जल्दी बंद होती है।", "ਸ਼ਨੀਵਾਰ ਨੂੰ ਘੱਟ ਕਰਮਚਾਰੀ ਕੰਮ ਕਰਨ ਕਾਰਨ ਦੁਕਾਨ ਜਲਦੀ ਬੰਦ ਹੁੰਦੀ ਹੈ।"], distractorType: "CAUSE_ASSUMPTION",
    explanation: ["A 2 p.m. closing time is earlier than 6 p.m., so I follows. Staffing and the reason for the shorter hours are not mentioned. Therefore, only I follows.", "दोपहर 2 बजे का समय शाम 6 बजे से पहले है, इसलिए I सही है। कम समय खुलने का कारण या कर्मचारियों की संख्या नहीं बताई गई। इसलिए केवल I सही है।", "ਦੁਪਹਿਰ 2 ਵਜੇ ਦਾ ਸਮਾਂ ਸ਼ਾਮ 6 ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਘੱਟ ਸਮਾਂ ਖੁੱਲ੍ਹਣ ਦਾ ਕਾਰਨ ਜਾਂ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਦੱਸੀ ਗਈ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।"]
  }),
  direct({
    id: "SIF-CP001-SERVICE-TICKETS", domain: "WORKPLACE",
    statement: ["A support team received 72 service tickets during the week. It resolved 60 tickets, while 12 remained open at the end of Friday.", "एक सहायता दल को सप्ताह में 72 सेवा शिकायतें मिलीं। उसने 60 का समाधान किया और शुक्रवार के अंत में 12 शिकायतें खुली रहीं।", "ਇੱਕ ਸਹਾਇਤਾ ਟੀਮ ਨੂੰ ਹਫ਼ਤੇ ਦੌਰਾਨ 72 ਸੇਵਾ ਸ਼ਿਕਾਇਤਾਂ ਮਿਲੀਆਂ। ਉਸ ਨੇ 60 ਦਾ ਹੱਲ ਕੀਤਾ ਅਤੇ ਸ਼ੁੱਕਰਵਾਰ ਦੇ ਅੰਤ ਵਿੱਚ 12 ਸ਼ਿਕਾਇਤਾਂ ਖੁੱਲ੍ਹੀਆਂ ਰਹੀਆਂ।"],
    facts: [["Seventy-two tickets were received.", "72 शिकायतें मिलीं।", "72 ਸ਼ਿਕਾਇਤਾਂ ਮਿਲੀਆਂ।"], ["Sixty were resolved and 12 remained open.", "60 हल हुईं और 12 खुली रहीं।", "60 ਹੱਲ ਹੋਈਆਂ ਅਤੇ 12 ਖੁੱਲ੍ਹੀਆਂ ਰਹੀਆਂ।"]],
    valid: ["One out of every six tickets received that week remained open on Friday.", "उस सप्ताह मिली हर छह शिकायतों में से एक शुक्रवार को खुली रही।", "ਉਸ ਹਫ਼ਤੇ ਮਿਲੀਆਂ ਹਰ ਛੇ ਸ਼ਿਕਾਇਤਾਂ ਵਿੱਚੋਂ ਇੱਕ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਖੁੱਲ੍ਹੀ ਰਹੀ।"],
    invalid: ["All twelve open tickets involved serious technical faults.", "सभी 12 खुली शिकायतें गंभीर तकनीकी खराबियों से संबंधित थीं।", "ਸਾਰੀਆਂ 12 ਖੁੱਲ੍ਹੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਗੰਭੀਰ ਤਕਨੀਕੀ ਖਰਾਬੀਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਸਨ।"], distractorType: "UNSUPPORTED_DETAIL",
    explanation: ["Twelve of 72 tickets is one-sixth, so I follows. The nature or seriousness of the open tickets is not given. Therefore, II does not follow.", "72 में से 12 शिकायतें एक-छठा भाग हैं, इसलिए I सही है। खुली शिकायतों की प्रकृति या गंभीरता नहीं बताई गई। इसलिए II सही नहीं है।", "72 ਵਿੱਚੋਂ 12 ਸ਼ਿਕਾਇਤਾਂ ਇੱਕ-ਛੇਵਾਂ ਹਿੱਸਾ ਹਨ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ਖੁੱਲ੍ਹੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਕਿਸਮ ਜਾਂ ਗੰਭੀਰਤਾ ਨਹੀਂ ਦੱਸੀ ਗਈ। ਇਸ ਲਈ II ਸਹੀ ਨਹੀਂ ਹੈ।"]
  }),
] as const;
