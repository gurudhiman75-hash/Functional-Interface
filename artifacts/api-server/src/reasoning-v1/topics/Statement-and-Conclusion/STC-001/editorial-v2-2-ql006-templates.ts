import { tri } from "./editorial-v2-2-saturation-helpers.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

const T = tri;

export const STC_V22_QL006_TEMPLATES: readonly StcV22Template[] = [
  {
    id: "STC-V22-QL006-T01", qlId: "STC-QL-006", surfaceArchetype: "NUMERIC_SNAPSHOT", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("1,200, 1,360, 1,490 and 1,430", "1,200, 1,360, 1,490 और 1,430", "1,200, 1,360, 1,490 ਅਤੇ 1,430"), T("860, 940, 1,020 and 980", "860, 940, 1,020 और 980", "860, 940, 1,020 ਅਤੇ 980"), T("2,100, 2,260, 2,410 and 2,350", "2,100, 2,260, 2,410 और 2,350", "2,100, 2,260, 2,410 ਅਤੇ 2,350"), T("540, 610, 690 and 650", "540, 610, 690 और 650", "540, 610, 690 ਅਤੇ 650")],
      [T("applications received", "प्राप्त आवेदनों", "ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ"), T("complaints registered", "दर्ज शिकायतों", "ਦਰਜ ਸ਼ਿਕਾਇਤਾਂ"), T("service requests processed", "प्रसंस्कृत सेवा अनुरोधों", "ਪ੍ਰਕਿਰਿਆ ਕੀਤੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ"), T("new accounts opened", "खोले गए नए खातों", "ਖੋਲ੍ਹੇ ਨਵੇਂ ਖਾਤਿਆਂ")],
      [T("four successive quarters", "चार लगातार तिमाहियों", "ਚਾਰ ਲਗਾਤਾਰ ਤਿਮਾਹੀਆਂ"), T("four consecutive months", "चार लगातार महीनों", "ਚਾਰ ਲਗਾਤਾਰ ਮਹੀਨਿਆਂ"), T("four review periods", "चार समीक्षा अवधियों", "ਚਾਰ ਸਮੀਖਿਆ ਅਵਧੀਆਂ"), T("four reporting cycles", "चार रिपोर्टिंग चक्रों", "ਚਾਰ ਰਿਪੋਰਟਿੰਗ ਚੱਕਰਾਂ")],
      [T("the department", "विभाग", "ਵਿਭਾਗ"), T("the branch network", "शाखा नेटवर्क", "ਸ਼ਾਖਾ ਨੈੱਟਵਰਕ"), T("the help desk", "सहायता डेस्क", "ਸਹਾਇਤਾ ਡੈਸਕ"), T("the service portal", "सेवा पोर्टल", "ਸੇਵਾ ਪੋਰਟਲ")],
    ],
    statement: T("For {d}, {b} across {c} were {a} respectively.", "{d} के लिए {c} में {b} क्रमशः {a} थे।", "{d} ਲਈ {c} ਵਿੱਚ {b} ਕ੍ਰਮਵਾਰ {a} ਸਨ।"),
    conclusions: [T("The third period recorded the highest figure among the four.", "तीसरी अवधि में चारों में सबसे अधिक आंकड़ा था।", "ਤੀਜੀ ਅਵਧੀ ਵਿੱਚ ਚਾਰਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਅੰਕੜਾ ਸੀ।"), T("The figure increased in every successive period.", "हर अगली अवधि में आंकड़ा बढ़ा।", "ਹਰ ਅਗਲੀ ਅਵਧੀ ਵਿੱਚ ਅੰਕੜਾ ਵਧਿਆ।")],
    explanation: [T("The third value in {a} is the largest.", "{a} में तीसरा मान सबसे बड़ा है।", "{a} ਵਿੱਚ ਤੀਜਾ ਮੁੱਲ ਸਭ ਤੋਂ ਵੱਡਾ ਹੈ।"), T("The fourth value is lower than the third, so the increase was not continuous.", "चौथा मान तीसरे से कम है, इसलिए वृद्धि लगातार नहीं रही।", "ਚੌਥਾ ਮੁੱਲ ਤੀਜੇ ਨਾਲੋਂ ਘੱਟ ਹੈ, ਇਸ ਲਈ ਵਾਧਾ ਲਗਾਤਾਰ ਨਹੀਂ ਰਿਹਾ।")],
  },
  {
    id: "STC-V22-QL006-T02", qlId: "STC-QL-006", surfaceArchetype: "EVENT_SEQUENCE", difficulty: "EASY", answerClass: "ONLY_II",
    dimensions: [
      [T("shortlisted", "शॉर्टलिस्ट", "ਸ਼ਾਰਟਲਿਸਟ"), T("registered", "पंजीकृत", "ਰਜਿਸਟਰ"), T("screened", "प्रारंभिक जाँच", "ਮੁੱਢਲੀ ਜਾਂਚ"), T("provisionally selected", "अस्थायी रूप से चयनित", "ਅਸਥਾਈ ਤੌਰ ਤੇ ਚੁਣੇ")],
      [T("document verification", "दस्तावेज़ सत्यापन", "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ"), T("identity verification", "पहचान सत्यापन", "ਪਛਾਣ ਜਾਂਚ"), T("certificate scrutiny", "प्रमाणपत्र जाँच", "ਸਰਟੀਫਿਕੇਟ ਜਾਂਚ"), T("eligibility verification", "पात्रता सत्यापन", "ਯੋਗਤਾ ਜਾਂਚ")],
      [T("interview", "साक्षात्कार", "ਇੰਟਰਵਿਊ"), T("final interaction", "अंतिम संवाद", "ਅੰਤਿਮ ਸੰਵਾਦ"), T("medical examination", "चिकित्सा परीक्षण", "ਮੈਡੀਕਲ ਜਾਂਚ"), T("final assessment", "अंतिम आकलन", "ਅੰਤਿਮ ਮੁਲਾਂਕਣ")],
      [T("Riya", "रिया", "ਰਿਆ"), T("Aman", "अमन", "ਅਮਨ"), T("Neha", "नेहा", "ਨੇਹਾ"), T("Karan", "करण", "ਕਰਨ")],
    ],
    statement: T("Candidates were first {a}, then called for {b}, and only after that stage were they called for {c}. {d} has reached the {c} stage.", "उम्मीदवारों को पहले {a} किया गया, फिर {b} के लिए बुलाया गया और उसके बाद ही {c} के लिए बुलाया गया। {d} {c} चरण तक पहुँच चुका/चुकी है।", "ਉਮੀਦਵਾਰ ਪਹਿਲਾਂ {a} ਕੀਤੇ ਗਏ, ਫਿਰ {b} ਲਈ ਬੁਲਾਏ ਗਏ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਹੀ {c} ਲਈ ਬੁਲਾਏ ਗਏ। {d} {c} ਪੜਾਅ ਤੱਕ ਪਹੁੰਚ ਚੁੱਕਾ/ਚੁੱਕੀ ਹੈ।"),
    conclusions: [T("{d}'s {c} stage came before {b}.", "{d} का {c} चरण {b} से पहले आया।", "{d} ਦਾ {c} ਪੜਾਅ {b} ਤੋਂ ਪਹਿਲਾਂ ਆਇਆ।"), T("{d}'s {b} came before the {c} stage.", "{d} का {b}, {c} चरण से पहले हुआ।", "{d} ਦੀ {b}, {c} ਪੜਾਅ ਤੋਂ ਪਹਿਲਾਂ ਹੋਈ।")],
    explanation: [T("The stated sequence places {b} before {c}.", "दिया गया क्रम {b} को {c} से पहले रखता है।", "ਦਿੱਤਾ ਕ੍ਰਮ {b} ਨੂੰ {c} ਤੋਂ ਪਹਿਲਾਂ ਰੱਖਦਾ ਹੈ।"), T("Reaching {c} under the stated sequence means {b} was earlier.", "दिए गए क्रम में {c} तक पहुँचने का अर्थ है कि {b} पहले हो चुका था।", "ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ {c} ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਅਰਥ ਹੈ ਕਿ {b} ਪਹਿਲਾਂ ਹੋ ਚੁੱਕੀ ਸੀ।")],
  },
  {
    id: "STC-V22-QL006-T03", qlId: "STC-QL-006", surfaceArchetype: "SURVEY_REPORT", difficulty: "MEDIUM", answerClass: "BOTH",
    dimensions: [
      [T("44", "44", "44"), T("48", "48", "48"), T("52", "52", "52"), T("56", "56", "56")],
      [T("34", "34", "34"), T("36", "36", "36"), T("38", "38", "38"), T("40", "40", "40")],
      [T("22", "22", "22"), T("25", "25", "25"), T("28", "28", "28"), T("30", "30", "30")],
      [T("customers using paper statements", "कागजी विवरण का उपयोग करने वाले ग्राहकों", "ਕਾਗਜ਼ੀ ਸਟੇਟਮੈਂਟ ਵਰਤਣ ਵਾਲੇ ਗਾਹਕਾਂ"), T("applicants using offline forms", "ऑफलाइन फॉर्म उपयोग करने वाले आवेदकों", "ਆਫ਼ਲਾਈਨ ਫਾਰਮ ਵਰਤਣ ਵਾਲੇ ਅਰਜ਼ੀਕਾਰਾਂ"), T("users choosing cash payment", "नकद भुगतान चुनने वाले उपयोगकर्ताओं", "ਨਕਦ ਭੁਗਤਾਨ ਚੁਣਨ ਵਾਲੇ ਵਰਤੋਂਕਾਰਾਂ"), T("households using physical bills", "भौतिक बिल उपयोग करने वाले परिवारों", "ਕਾਗਜ਼ੀ ਬਿੱਲ ਵਰਤਣ ਵਾਲੇ ਘਰਾਂ")],
    ],
    statement: T("The share of {d} fell from {a}% in the first review point to {b}% in the second and {c}% in the third.", "{d} का हिस्सा पहली समीक्षा में {a}% से दूसरी में {b}% और तीसरी में {c}% रह गया।", "{d} ਦਾ ਹਿੱਸਾ ਪਹਿਲੀ ਸਮੀਖਿਆ ਵਿੱਚ {a}% ਤੋਂ ਦੂਜੀ ਵਿੱਚ {b}% ਅਤੇ ਤੀਜੀ ਵਿੱਚ {c}% ਰਹਿ ਗਿਆ।"),
    conclusions: [T("The share declined over the period described.", "बताई गई अवधि में हिस्सा घटा।", "ਦੱਸੀ ਅਵਧੀ ਦੌਰਾਨ ਹਿੱਸਾ ਘਟਿਆ।"), T("The third-review share was lower than the second-review share.", "तीसरी समीक्षा का हिस्सा दूसरी समीक्षा से कम था।", "ਤੀਜੀ ਸਮੀਖਿਆ ਦਾ ਹਿੱਸਾ ਦੂਜੀ ਸਮੀਖਿਆ ਨਾਲੋਂ ਘੱਟ ਸੀ।")],
    explanation: [T("The sequence {a}%, {b}%, {c}% shows a decline.", "{a}%, {b}%, {c}% का क्रम गिरावट दिखाता है।", "{a}%, {b}%, {c}% ਦਾ ਕ੍ਰਮ ਘਟਾਅ ਦਿਖਾਉਂਦਾ ਹੈ।"), T("{c}% is lower than {b}%.", "{c}% {b}% से कम है।", "{c}% {b}% ਨਾਲੋਂ ਘੱਟ ਹੈ।")],
  },
  {
    id: "STC-V22-QL006-T04", qlId: "STC-QL-006", surfaceArchetype: "PUBLIC_NOTICE", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      [T("the answer key", "उत्तर कुंजी", "ਉੱਤਰ ਕੁੰਜੀ"), T("the provisional list", "अस्थायी सूची", "ਅਸਥਾਈ ਸੂਚੀ"), T("the draft merit list", "प्रारंभिक मेरिट सूची", "ਮਸੌਦਾ ਮੇਰਿਟ ਸੂਚੀ"), T("the preliminary schedule", "प्रारंभिक कार्यक्रम", "ਮੁੱਢਲਾ ਸਮਾਂ-ਸਾਰਣੀ")],
      [T("Monday", "सोमवार", "ਸੋਮਵਾਰ"), T("Tuesday", "मंगलवार", "ਮੰਗਲਵਾਰ"), T("Wednesday", "बुधवार", "ਬੁੱਧਵਾਰ"), T("Thursday", "गुरुवार", "ਵੀਰਵਾਰ")],
      [T("Thursday", "गुरुवार", "ਵੀਰਵਾਰ"), T("Friday", "शुक्रवार", "ਸ਼ੁੱਕਰਵਾਰ"), T("Saturday", "शनिवार", "ਸ਼ਨੀਵਾਰ"), T("Sunday", "रविवार", "ਐਤਵਾਰ")],
      [T("the following week", "अगले सप्ताह", "ਅਗਲੇ ਹਫ਼ਤੇ"), T("after the objection window", "आपत्ति अवधि के बाद", "ਐਤਰਾਜ਼ ਅਵਧੀ ਤੋਂ ਬਾਅਦ"), T("after scrutiny of timely objections", "समय पर मिली आपत्तियों की जाँच के बाद", "ਸਮੇਂ ਤੇ ਮਿਲੇ ਐਤਰਾਜ਼ਾਂ ਦੀ ਜਾਂਚ ਤੋਂ ਬਾਅਦ"), T("once the review process is complete", "समीक्षा प्रक्रिया पूरी होने के बाद", "ਸਮੀਖਿਆ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ")],
    ],
    statement: T("Notice: {a} will be released on {b}; objections will be accepted until {c}; the revised version will be issued {d}.", "सूचना: {a} {b} जारी होगी; आपत्तियाँ {c} तक स्वीकार होंगी; संशोधित रूप {d} जारी होगा।", "ਸੂਚਨਾ: {a} {b} ਜਾਰੀ ਹੋਵੇਗੀ; ਐਤਰਾਜ਼ {c} ਤੱਕ ਲਏ ਜਾਣਗੇ; ਸੋਧਿਆ ਰੂਪ {d} ਜਾਰੀ ਹੋਵੇਗਾ।"),
    conclusions: [T("The revised version is scheduled before objections can be submitted.", "संशोधित रूप आपत्तियाँ जमा होने से पहले निर्धारित है।", "ਸੋਧਿਆ ਰੂਪ ਐਤਰਾਜ਼ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਨਿਰਧਾਰਤ ਹੈ।"), T("{a} is scheduled after the revised version.", "{a} संशोधित रूप के बाद निर्धारित है।", "{a} ਸੋਧੇ ਰੂਪ ਤੋਂ ਬਾਅਦ ਨਿਰਧਾਰਤ ਹੈ।")],
    explanation: [T("The revised version comes after the objection window, not before it.", "संशोधित रूप आपत्ति अवधि के बाद आता है, पहले नहीं।", "ਸੋਧਿਆ ਰੂਪ ਐਤਰਾਜ਼ ਅਵਧੀ ਤੋਂ ਬਾਅਦ ਆਉਂਦਾ ਹੈ, ਪਹਿਲਾਂ ਨਹੀਂ।"), T("{a} is scheduled first in the stated sequence.", "दिए गए क्रम में {a} पहले है।", "ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ {a} ਪਹਿਲਾਂ ਹੈ।")],
  },
  {
    id: "STC-V22-QL006-T05", qlId: "STC-QL-006", surfaceArchetype: "EVERYDAY_OBSERVATION", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("attendance", "उपस्थिति", "ਹਾਜ਼ਰੀ"), T("daily output", "दैनिक उत्पादन", "ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ"), T("customer footfall", "ग्राहक आवागमन", "ਗਾਹਕ ਆਵਾਜਾਈ"), T("help-desk calls", "सहायता-डेस्क कॉल", "ਸਹਾਇਤਾ-ਡੈਸਕ ਕਾਲਾਂ")],
      [T("training session", "प्रशिक्षण सत्र", "ਟ੍ਰੇਨਿੰਗ ਸੈਸ਼ਨ"), T("review day", "समीक्षा दिवस", "ਸਮੀਖਿਆ ਦਿਨ"), T("service shift", "सेवा पाली", "ਸੇਵਾ ਸ਼ਿਫ਼ਟ"), T("reporting period", "रिपोर्टिंग अवधि", "ਰਿਪੋਰਟਿੰਗ ਅਵਧੀ")],
      [T("rose", "बढ़ी", "ਵਧੀ"), T("increased", "ऊपर गई", "ਉੱਪਰ ਗਈ"), T("improved", "सुधरी", "ਸੁਧਰੀ"), T("moved upward", "ऊपर की ओर गई", "ਉੱਪਰ ਵੱਲ ਗਈ")],
      [T("fell", "घटी", "ਘਟੀ"), T("declined", "कम हुई", "ਘੱਟੀ"), T("dropped", "नीचे गई", "ਥੱਲੇ ਗਈ"), T("moved downward", "नीचे की ओर गई", "ਥੱਲੇ ਵੱਲ ਗਈ")],
    ],
    statement: T("{a} {c} from the first {b} to the second, stayed unchanged in the third, and {d} in the fourth.", "{a} पहले {b} से दूसरे में {c}, तीसरे में समान रही और चौथे में {d}।", "{a} ਪਹਿਲੇ {b} ਤੋਂ ਦੂਜੇ ਵਿੱਚ {c}, ਤੀਜੇ ਵਿੱਚ ਇਕੋ ਜਿਹੀ ਰਹੀ ਅਤੇ ਚੌਥੇ ਵਿੱਚ {d}।"),
    conclusions: [T("The third {b} matched the second on {a}.", "तीसरे {b} में {a} दूसरे के समान रही।", "ਤੀਜੇ {b} ਵਿੱਚ {a} ਦੂਜੇ ਦੇ ਬਰਾਬਰ ਰਹੀ।"), T("{a} rose in every {b} compared with the one before it.", "{a} हर {b} में पिछले से बढ़ी।", "{a} ਹਰ {b} ਵਿੱਚ ਪਿਛਲੇ ਨਾਲੋਂ ਵਧੀ।")],
    explanation: [T("The statement explicitly says the third period was unchanged from the second.", "कथन स्पष्ट रूप से कहता है कि तीसरी अवधि दूसरी के समान रही।", "ਕਥਨ ਸਪਸ਼ਟ ਕਹਿੰਦਾ ਹੈ ਕਿ ਤੀਜੀ ਅਵਧੀ ਦੂਜੀ ਦੇ ਬਰਾਬਰ ਰਹੀ।"), T("The fourth period {d}, so the measure did not rise every time.", "चौथी अवधि में {d}, इसलिए हर बार वृद्धि नहीं हुई।", "ਚੌਥੀ ਅਵਧੀ ਵਿੱਚ {d}, ਇਸ ਲਈ ਹਰ ਵਾਰ ਵਾਧਾ ਨਹੀਂ ਹੋਇਆ।")],
  },
  {
    id: "STC-V22-QL006-T06", qlId: "STC-QL-006", surfaceArchetype: "QUOTED_CLAIM", difficulty: "HARD", answerClass: "ONLY_II",
    dimensions: [
      [T("subscriptions", "सदस्यताएँ", "ਸਬਸਕ੍ਰਿਪਸ਼ਨ"), T("registrations", "पंजीकरण", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ"), T("online orders", "ऑनलाइन ऑर्डर", "ਆਨਲਾਈਨ ਆਰਡਰ"), T("service requests", "सेवा अनुरोध", "ਸੇਵਾ ਬੇਨਤੀਆਂ")],
      [T("three months", "तीन महीनों", "ਤਿੰਨ ਮਹੀਨਿਆਂ"), T("four weeks", "चार सप्ताह", "ਚਾਰ ਹਫ਼ਤਿਆਂ"), T("two quarters", "दो तिमाहियों", "ਦੋ ਤਿਮਾਹੀਆਂ"), T("several reporting periods", "कई रिपोर्टिंग अवधियों", "ਕਈ ਰਿਪੋਰਟਿੰਗ ਅਵਧੀਆਂ")],
      [T("July", "जुलाई", "ਜੁਲਾਈ"), T("September", "सितंबर", "ਸਤੰਬਰ"), T("the penultimate period", "अंतिम से पहले की अवधि", "ਅੰਤਿਮ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਅਵਧੀ"), T("the fourth review point", "चौथे समीक्षा बिंदु", "ਚੌਥੇ ਸਮੀਖਿਆ ਬਿੰਦੂ")],
      [T("August", "अगस्त", "ਅਗਸਤ"), T("October", "अक्टूबर", "ਅਕਤੂਬਰ"), T("the final period", "अंतिम अवधि", "ਅੰਤਿਮ ਅਵਧੀ"), T("the fifth review point", "पाँचवें समीक्षा बिंदु", "ਪੰਜਵੇਂ ਸਮੀਖਿਆ ਬਿੰਦੂ")],
    ],
    statement: T("The editor said, \"{a} climbed for {b}, levelled off in {c}, and slipped slightly in {d}.\"", "संपादक ने कहा, \"{a} {b} तक बढ़ी, {c} में स्थिर रही और {d} में थोड़ी घटी।\"", "ਸੰਪਾਦਕ ਨੇ ਕਿਹਾ, \"{a} {b} ਤੱਕ ਵਧੀ, {c} ਵਿੱਚ ਸਥਿਰ ਰਹੀ ਅਤੇ {d} ਵਿੱਚ ਥੋੜ੍ਹੀ ਘਟੀ।\""),
    conclusions: [T("{a} continued rising without interruption through {d}.", "{a} {d} तक बिना रुके बढ़ती रही।", "{a} {d} ਤੱਕ ਬਿਨਾਂ ਰੁਕੇ ਵਧਦੀ ਰਹੀ।"), T("{a} was lower in {d} than in {c}.", "{a} {d} में {c} से कम थी।", "{a} {d} ਵਿੱਚ {c} ਨਾਲੋਂ ਘੱਟ ਸੀ।")],
    explanation: [T("The plateau in {c} and decline in {d} break continuous growth.", "{c} में स्थिरता और {d} में गिरावट लगातार वृद्धि को तोड़ती है।", "{c} ਵਿੱਚ ਸਥਿਰਤਾ ਅਤੇ {d} ਵਿੱਚ ਘਟਾਅ ਲਗਾਤਾਰ ਵਾਧੇ ਨੂੰ ਤੋੜਦੇ ਹਨ।"), T("A slight slip in {d} means a fall from the {c} level.", "{d} में थोड़ी गिरावट का अर्थ {c} के स्तर से कमी है।", "{d} ਵਿੱਚ ਥੋੜ੍ਹਾ ਘਟਣਾ {c} ਦੇ ਪੱਧਰ ਤੋਂ ਹੇਠਾਂ ਆਉਣਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL006-T07", qlId: "STC-QL-006", surfaceArchetype: "CONTRAST_CONCESSION", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      [T("average disposal time", "औसत निपटान समय", "ਔਸਤ ਨਿਪਟਾਰਾ ਸਮਾਂ"), T("average processing time", "औसत प्रसंस्करण समय", "ਔਸਤ ਪ੍ਰਕਿਰਿਆ ਸਮਾਂ"), T("average waiting time", "औसत प्रतीक्षा समय", "ਔਸਤ ਉਡੀਕ ਸਮਾਂ"), T("average turnaround time", "औसत पूर्णता समय", "ਔਸਤ ਟਰਨਅਰਾਊਂਡ ਸਮਾਂ")],
      [T("new cases", "नए मामलों", "ਨਵੇਂ ਮਾਮਲਿਆਂ"), T("new applications", "नए आवेदनों", "ਨਵੀਆਂ ਅਰਜ਼ੀਆਂ"), T("incoming requests", "आने वाले अनुरोधों", "ਆਉਣ ਵਾਲੀਆਂ ਬੇਨਤੀਆਂ"), T("fresh complaints", "नई शिकायतों", "ਨਵੀਆਂ ਸ਼ਿਕਾਇਤਾਂ")],
      [T("the latest quarter", "नवीनतम तिमाही", "ਤਾਜ਼ਾ ਤਿਮਾਹੀ"), T("the latest month", "नवीनतम महीना", "ਤਾਜ਼ਾ ਮਹੀਨਾ"), T("the final review period", "अंतिम समीक्षा अवधि", "ਅੰਤਿਮ ਸਮੀਖਿਆ ਅਵਧੀ"), T("the most recent cycle", "सबसे हाल का चक्र", "ਸਭ ਤੋਂ ਤਾਜ਼ਾ ਚੱਕਰ")],
      [T("fell", "घटा", "ਘਟਿਆ"), T("declined", "कम हुआ", "ਘੱਟਿਆ"), T("improved downward", "नीचे आया", "ਹੇਠਾਂ ਆਇਆ"), T("reduced", "कम हुआ", "ਘਟਿਆ")],
    ],
    statement: T("{a} {d} in {c}, while the number of {b} rose sharply in the same period.", "{c} में {a} {d}, जबकि उसी अवधि में {b} की संख्या तेजी से बढ़ी।", "{c} ਵਿੱਚ {a} {d}, ਜਦਕਿ ਉਸੇ ਅਵਧੀ ਵਿੱਚ {b} ਦੀ ਗਿਣਤੀ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।"),
    conclusions: [T("{c} combined a lower {a} with a higher inflow of {b}.", "{c} में कम {a} के साथ अधिक {b} आए।", "{c} ਵਿੱਚ ਘੱਟ {a} ਦੇ ਨਾਲ ਵੱਧ {b} ਆਏ।"), T("The two stated measures moved in opposite directions in {c}.", "{c} में दोनों बताए गए माप विपरीत दिशाओं में चले।", "{c} ਵਿੱਚ ਦੋਵੇਂ ਦੱਸੇ ਮਾਪ ਉਲਟੀ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਗਏ।")],
    explanation: [T("The statement pairs a fall in {a} with a rise in {b}.", "कथन {a} में कमी को {b} में वृद्धि के साथ रखता है।", "ਕਥਨ {a} ਵਿੱਚ ਘਟਾਅ ਨੂੰ {b} ਵਿੱਚ ਵਾਧੇ ਨਾਲ ਜੋੜਦਾ ਹੈ।"), T("One measure fell while the other rose, so their directions were opposite.", "एक माप घटा और दूसरा बढ़ा, इसलिए दिशाएँ विपरीत थीं।", "ਇੱਕ ਮਾਪ ਘਟਿਆ ਤੇ ਦੂਜਾ ਵਧਿਆ, ਇਸ ਲਈ ਦਿਸ਼ਾਵਾਂ ਉਲਟ ਸਨ।")],
  },
  {
    id: "STC-V22-QL006-T08", qlId: "STC-QL-006", surfaceArchetype: "FORECAST_OUTLOOK", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      [T("pending cases", "लंबित मामलों", "ਲੰਬਿਤ ਮਾਮਲਿਆਂ"), T("unresolved complaints", "अनसुलझी शिकायतों", "ਅਣਸੁਲਝੀਆਂ ਸ਼ਿਕਾਇਤਾਂ"), T("backlogged applications", "लंबित आवेदनों", "ਬੈਕਲੌਗ ਅਰਜ਼ੀਆਂ"), T("open service requests", "खुले सेवा अनुरोधों", "ਖੁੱਲ੍ਹੀਆਂ ਸੇਵਾ ਬੇਨਤੀਆਂ")],
      [T("the present disposal rate", "वर्तमान निपटान दर", "ਮੌਜੂਦਾ ਨਿਪਟਾਰਾ ਦਰ"), T("the current processing pace", "वर्तमान प्रसंस्करण गति", "ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਗਤੀ"), T("the existing clearance rate", "मौजूदा निस्तारण दर", "ਮੌਜੂਦਾ ਨਿਪਟਾਰਾ ਦਰ"), T("the present completion pace", "वर्तमान पूर्णता गति", "ਮੌਜੂਦਾ ਪੂਰਨਤਾ ਗਤੀ")],
      [T("the next quarter", "अगली तिमाही", "ਅਗਲੀ ਤਿਮਾਹੀ"), T("the coming month", "आने वाला महीना", "ਆਉਣ ਵਾਲਾ ਮਹੀਨਾ"), T("the next review cycle", "अगला समीक्षा चक्र", "ਅਗਲਾ ਸਮੀਖਿਆ ਚੱਕਰ"), T("the remaining reporting period", "शेष रिपोर्टिंग अवधि", "ਬਾਕੀ ਰਿਪੋਰਟਿੰਗ ਅਵਧੀ")],
      [T("the latest report", "नवीनतम रिपोर्ट", "ਤਾਜ਼ਾ ਰਿਪੋਰਟ"), T("the management note", "प्रबंधन टिप्पणी", "ਪ੍ਰਬੰਧਕੀ ਨੋਟ"), T("the review summary", "समीक्षा सारांश", "ਸਮੀਖਿਆ ਸੰਖੇਪ"), T("the monitoring update", "निगरानी अपडेट", "ਨਿਗਰਾਨੀ ਅਪਡੇਟ")],
    ],
    statement: T("{d} says {a} are expected to keep falling during {c} if {b} is maintained.", "{d} में कहा गया है कि यदि {b} बनी रहती है, तो {c} में {a} घटते रहने की अपेक्षा है।", "{d} ਕਹਿੰਦੀ ਹੈ ਕਿ ਜੇ {b} ਬਣੀ ਰਹੇ, ਤਾਂ {c} ਵਿੱਚ {a} ਘਟਦੇ ਰਹਿਣ ਦੀ ਉਮੀਦ ਹੈ।"),
    conclusions: [T("{a} are guaranteed to fall even if {b} changes.", "{b} बदलने पर भी {a} का घटना निश्चित है।", "{b} ਬਦਲਣ ਤੇ ਵੀ {a} ਦਾ ਘਟਣਾ ਨਿਸ਼ਚਿਤ ਹੈ।"), T("The statement proves that {a} have already fallen in the current period.", "कथन सिद्ध करता है कि वर्तमान अवधि में {a} पहले ही घट चुके हैं।", "ਕਥਨ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ {a} ਪਹਿਲਾਂ ਹੀ ਘਟ ਚੁੱਕੇ ਹਨ।")],
    explanation: [T("The forecast is conditional on maintaining {b}.", "पूर्वानुमान {b} बनाए रखने की शर्त पर आधारित है।", "ਅਨੁਮਾਨ {b} ਬਣਾਈ ਰੱਖਣ ਦੀ ਸ਼ਰਤ ਤੇ ਆਧਾਰਿਤ ਹੈ।"), T("A forecast for {c} does not establish a completed fall in the current period.", "{c} के लिए पूर्वानुमान वर्तमान अवधि में हो चुकी गिरावट सिद्ध नहीं करता।", "{c} ਲਈ ਅਨੁਮਾਨ ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ਹੋ ਚੁੱਕੇ ਘਟਾਅ ਨੂੰ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।")],
  },
] as const;
