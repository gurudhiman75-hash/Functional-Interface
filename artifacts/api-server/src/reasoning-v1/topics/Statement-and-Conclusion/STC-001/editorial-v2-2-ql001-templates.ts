import { tri } from "./editorial-v2-2-saturation-helpers.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

const T = tri;

export const STC_V22_QL001_TEMPLATES: readonly StcV22Template[] = [
  {
    id: "STC-V22-QL001-T01", qlId: "STC-QL-001", surfaceArchetype: "ONE_LINE_FACT", difficulty: "EASY", answerClass: "ONLY_I",
    dimensions: [
      [
        T("the railway enquiry counter at City Station", "सिटी स्टेशन का रेलवे पूछताछ काउंटर", "ਸਿਟੀ ਸਟੇਸ਼ਨ ਦਾ ਰੇਲਵੇ ਪੁੱਛਗਿੱਛ ਕਾਊਂਟਰ"),
        T("the public help desk at the district hospital", "जिला अस्पताल का सार्वजनिक सहायता डेस्क", "ਜ਼ਿਲ੍ਹਾ ਹਸਪਤਾਲ ਦਾ ਜਨਤਕ ਸਹਾਇਤਾ ਡੈਸਕ"),
        T("the issue counter at the central library", "केंद्रीय पुस्तकालय का निर्गमन काउंटर", "ਕੇਂਦਰੀ ਲਾਇਬ੍ਰੇਰੀ ਦਾ ਜਾਰੀ ਕਰਨ ਵਾਲਾ ਕਾਊਂਟਰ"),
        T("the visitor-information desk at the municipal office", "नगरपालिका कार्यालय का आगंतुक सूचना डेस्क", "ਨਗਰ ਨਿਗਮ ਦਫ਼ਤਰ ਦਾ ਆਗੰਤੁਕ ਜਾਣਕਾਰੀ ਡੈਸਕ"),
      ],
      [T("6 p.m.", "शाम 6 बजे", "ਸ਼ਾਮ 6 ਵਜੇ"), T("7 p.m.", "शाम 7 बजे", "ਸ਼ਾਮ 7 ਵਜੇ"), T("8 p.m.", "रात 8 बजे", "ਰਾਤ 8 ਵਜੇ"), T("9 p.m.", "रात 9 बजे", "ਰਾਤ 9 ਵਜੇ")],
      [T("on every working day", "हर कार्यदिवस", "ਹਰ ਕੰਮਕਾਜੀ ਦਿਨ"), T("from Monday to Saturday", "सोमवार से शनिवार", "ਸੋਮਵਾਰ ਤੋਂ ਸ਼ਨੀਵਾਰ"), T("under the current service schedule", "वर्तमान सेवा समय-सारणी के अनुसार", "ਮੌਜੂਦਾ ਸੇਵਾ ਸਮਾਂ-ਸਾਰਣੀ ਅਨੁਸਾਰ"), T("during the notified service period", "अधिसूचित सेवा अवधि के दौरान", "ਸੂਚਿਤ ਸੇਵਾ ਅਵਧੀ ਦੌਰਾਨ")],
      [T("for walk-in enquiries", "प्रत्यक्ष पूछताछ के लिए", "ਸਿੱਧੀ ਪੁੱਛਗਿੱਛ ਲਈ"), T("for routine public service", "सामान्य सार्वजनिक सेवा के लिए", "ਰੁਟੀਨ ਜਨਤਕ ਸੇਵਾ ਲਈ"), T("for counter-based assistance", "काउंटर आधारित सहायता के लिए", "ਕਾਊਂਟਰ-ਅਧਾਰਿਤ ਸਹਾਇਤਾ ਲਈ"), T("for same-day service", "उसी दिन की सेवा के लिए", "ਉਸੇ ਦਿਨ ਦੀ ਸੇਵਾ ਲਈ")],
    ],
    statement: T("{a} closes at {b} {c} {d}.", "{a} {c} {d} {b} बंद हो जाता है।", "{a} {c} {d} {b} ਬੰਦ ਹੋ ਜਾਂਦਾ ਹੈ।"),
    conclusions: [
      T("A person reaching {a} after {b} cannot use that desk or counter {d} under the stated timing.", "{b} के बाद {a} पर पहुँचने वाला व्यक्ति बताए गए समय के अनुसार {d} उस डेस्क या काउंटर का उपयोग नहीं कर सकता।", "{b} ਤੋਂ ਬਾਅਦ {a} ਉੱਤੇ ਪਹੁੰਚਣ ਵਾਲਾ ਵਿਅਕਤੀ ਦੱਸੇ ਸਮੇਂ ਅਨੁਸਾਰ {d} ਉਸ ਡੈਸਕ ਜਾਂ ਕਾਊਂਟਰ ਦੀ ਵਰਤੋਂ ਨਹੀਂ ਕਰ ਸਕਦਾ।"),
      T("The entire building in which {a} is located closes at {b}.", "जिस पूरी इमारत में {a} स्थित है, वह {b} बंद हो जाती है।", "ਜਿਸ ਪੂਰੀ ਇਮਾਰਤ ਵਿੱਚ {a} ਸਥਿਤ ਹੈ, ਉਹ {b} ਬੰਦ ਹੋ ਜਾਂਦੀ ਹੈ।"),
    ],
    explanation: [
      T("The stated closing time applies directly to {a}.", "बताया गया बंद होने का समय सीधे {a} पर लागू होता है।", "ਦੱਸਿਆ ਬੰਦ ਹੋਣ ਦਾ ਸਮਾਂ ਸਿੱਧੇ {a} ਉੱਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।"),
      T("The statement gives no closing time for the whole building.", "कथन पूरी इमारत के बंद होने का समय नहीं बताता।", "ਕਥਨ ਪੂਰੀ ਇਮਾਰਤ ਦੇ ਬੰਦ ਹੋਣ ਦਾ ਸਮਾਂ ਨਹੀਂ ਦੱਸਦਾ।"),
    ],
  },
  {
    id: "STC-V22-QL001-T02", qlId: "STC-QL-001", surfaceArchetype: "PUBLIC_NOTICE", difficulty: "EASY", answerClass: "ONLY_II",
    dimensions: [
      [T("the city museum", "नगर संग्रहालय", "ਸ਼ਹਿਰੀ ਅਜਾਇਬਘਰ"), T("the district science centre", "जिला विज्ञान केंद्र", "ਜ਼ਿਲ੍ਹਾ ਵਿਗਿਆਨ ਕੇਂਦਰ"), T("the public art gallery", "सार्वजनिक कला दीर्घा", "ਜਨਤਕ ਕਲਾ ਗੈਲਰੀ"), T("the heritage interpretation centre", "विरासत व्याख्या केंद्र", "ਵਿਰਾਸਤ ਵਿਆਖਿਆ ਕੇਂਦਰ")],
      [T("Monday", "सोमवार", "ਸੋਮਵਾਰ"), T("Tuesday", "मंगलवार", "ਮੰਗਲਵਾਰ"), T("Thursday", "गुरुवार", "ਵੀਰਵਾਰ"), T("Saturday", "शनिवार", "ਸ਼ਨੀਵਾਰ")],
      [T("online ticket booking", "ऑनलाइन टिकट बुकिंग", "ਆਨਲਾਈਨ ਟਿਕਟ ਬੁਕਿੰਗ"), T("online visit-slot booking", "ऑनलाइन भ्रमण-स्लॉट बुकिंग", "ਆਨਲਾਈਨ ਦੌਰਾ-ਸਲਾਟ ਬੁਕਿੰਗ"), T("the online reservation portal", "ऑनलाइन आरक्षण पोर्टल", "ਆਨਲਾਈਨ ਰਿਜ਼ਰਵੇਸ਼ਨ ਪੋਰਟਲ"), T("advance online booking", "अग्रिम ऑनलाइन बुकिंग", "ਅਗਾਊਂ ਆਨਲਾਈਨ ਬੁਕਿੰਗ")],
      [T("scheduled maintenance", "निर्धारित रखरखाव", "ਨਿਰਧਾਰਤ ਰਖ-ਰਖਾਵ"), T("a safety inspection", "सुरक्षा निरीक्षण", "ਸੁਰੱਖਿਆ ਜਾਂਚ"), T("electrical repair work", "विद्युत मरम्मत कार्य", "ਬਿਜਲੀ ਮੁਰੰਮਤ ਕੰਮ"), T("an internal stock check", "आंतरिक सामग्री जाँच", "ਅੰਦਰੂਨੀ ਸਮੱਗਰੀ ਜਾਂਚ")],
    ],
    statement: T("Notice: {a} will remain closed to visitors on {b} because of {d}. {c} will remain available.", "सूचना: {d} के कारण {a} {b} आगंतुकों के लिए बंद रहेगा। {c} उपलब्ध रहेगी।", "ਸੂਚਨਾ: {d} ਕਰਕੇ {a} {b} ਆਗੰਤੁਕਾਂ ਲਈ ਬੰਦ ਰਹੇਗਾ। {c} ਉਪਲਬਧ ਰਹੇਗੀ।"),
    conclusions: [
      T("{c} will also be unavailable on {b}.", "{c} भी {b} उपलब्ध नहीं रहेगी।", "{c} ਵੀ {b} ਉਪਲਬਧ ਨਹੀਂ ਰਹੇਗੀ।"),
      T("Visitors cannot enter {a} on {b} under the notice.", "सूचना के अनुसार आगंतुक {b} {a} में प्रवेश नहीं कर सकते।", "ਸੂਚਨਾ ਅਨੁਸਾਰ ਆਗੰਤੁਕ {b} {a} ਵਿੱਚ ਦਾਖ਼ਲ ਨਹੀਂ ਹੋ ਸਕਦੇ।"),
    ],
    explanation: [T("The notice expressly keeps {c} available.", "सूचना स्पष्ट रूप से {c} को उपलब्ध रखती है।", "ਸੂਚਨਾ ਸਪਸ਼ਟ ਤੌਰ ਤੇ {c} ਨੂੰ ਉਪਲਬਧ ਰੱਖਦੀ ਹੈ।"), T("{a} is expressly closed to visitors on {b}.", "{a} को {b} आगंतुकों के लिए स्पष्ट रूप से बंद बताया गया है।", "{a} ਨੂੰ {b} ਆਗੰਤੁਕਾਂ ਲਈ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਬੰਦ ਦੱਸਿਆ ਗਿਆ ਹੈ।")],
  },
  {
    id: "STC-V22-QL001-T03", qlId: "STC-QL-001", surfaceArchetype: "EVERYDAY_OBSERVATION", difficulty: "MEDIUM", answerClass: "BOTH",
    dimensions: [
      [T("the college canteen", "कॉलेज कैंटीन", "ਕਾਲਜ ਕੈਂਟੀਨ"), T("the hostel mess", "छात्रावास मेस", "ਹੋਸਟਲ ਮੈਸ"), T("the office cafeteria", "कार्यालय कैफेटेरिया", "ਦਫ਼ਤਰ ਕੈਫੇਟੇਰੀਆ"), T("the training-centre dining hall", "प्रशिक्षण केंद्र भोजनालय", "ਟ੍ਰੇਨਿੰਗ ਕੇਂਦਰ ਭੋਜਨ ਹਾਲ")],
      [T("serving breakfast", "नाश्ता परोसना", "ਨਾਸ਼ਤਾ ਪਰੋਸਣਾ"), T("the morning tea service", "सुबह की चाय सेवा", "ਸਵੇਰ ਦੀ ਚਾਹ ਸੇਵਾ"), T("the early snack service", "सुबह की हल्की जलपान सेवा", "ਸਵੇਰ ਦੀ ਹਲਕੀ ਨਾਸ਼ਤਾ ਸੇਵਾ"), T("the pre-class meal service", "कक्षा-पूर्व भोजन सेवा", "ਕਲਾਸ ਤੋਂ ਪਹਿਲਾਂ ਭੋਜਨ ਸੇਵਾ")],
      [T("this month", "इस महीने", "ਇਸ ਮਹੀਨੇ"), T("this week", "इस सप्ताह", "ਇਸ ਹਫ਼ਤੇ"), T("during the current term", "वर्तमान सत्र के दौरान", "ਮੌਜੂਦਾ ਟਰਮ ਦੌਰਾਨ"), T("for the present schedule", "वर्तमान समय-सारणी में", "ਮੌਜੂਦਾ ਸਮਾਂ-ਸਾਰਣੀ ਵਿੱਚ")],
      [T("lunch service", "दोपहर का भोजन", "ਦੁਪਹਿਰ ਦਾ ਭੋਜਨ"), T("the evening meal", "शाम का भोजन", "ਸ਼ਾਮ ਦਾ ਭੋਜਨ"), T("afternoon refreshments", "दोपहर बाद का जलपान", "ਦੁਪਹਿਰ ਬਾਅਦ ਦੀ ਰਿਫ਼ਰੈਸ਼ਮੈਂਟ"), T("the regular midday service", "नियमित मध्याह्न सेवा", "ਨਿਯਮਤ ਦੁਪਹਿਰ ਦੀ ਸੇਵਾ")],
    ],
    statement: T("{a} stopped {b} {c}, but {d} continues as before.", "{a} ने {c} {b} बंद कर दिया है, लेकिन {d} पहले की तरह जारी है।", "{a} ਨੇ {c} {b} ਬੰਦ ਕਰ ਦਿੱਤਾ ਹੈ, ਪਰ {d} ਪਹਿਲਾਂ ਵਾਂਗ ਜਾਰੀ ਹੈ।"),
    conclusions: [T("{a} is no longer providing {b} {c}.", "{a} अब {c} {b} प्रदान नहीं कर रहा है।", "{a} ਹੁਣ {c} {b} ਪ੍ਰਦਾਨ ਨਹੀਂ ਕਰ ਰਿਹਾ।"), T("{d} is continuing {c}.", "{d} {c} जारी है।", "{d} {c} ਜਾਰੀ ਹੈ।")],
    explanation: [T("The statement explicitly says {b} stopped.", "कथन स्पष्ट रूप से कहता है कि {b} बंद कर दिया गया।", "ਕਥਨ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਕਹਿੰਦਾ ਹੈ ਕਿ {b} ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।"), T("The statement expressly says {d} continues.", "कथन स्पष्ट रूप से कहता है कि {d} जारी है।", "ਕਥਨ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਕਹਿੰਦਾ ਹੈ ਕਿ {d} ਜਾਰੀ ਹੈ।")],
  },
  {
    id: "STC-V22-QL001-T04", qlId: "STC-QL-001", surfaceArchetype: "SURVEY_REPORT", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      [T("adult respondents", "वयस्क उत्तरदाताओं", "ਵਯਸਕ ਉੱਤਰਦਾਤਿਆਂ"), T("urban respondents", "शहरी उत्तरदाताओं", "ਸ਼ਹਿਰੀ ਉੱਤਰਦਾਤਿਆਂ"), T("surveyed account holders", "सर्वेक्षित खाताधारकों", "ਸਰਵੇ ਕੀਤੇ ਖਾਤਾਧਾਰਕਾਂ"), T("registered users surveyed", "सर्वेक्षित पंजीकृत उपयोगकर्ताओं", "ਸਰਵੇ ਕੀਤੇ ਰਜਿਸਟਰਡ ਉਪਭੋਗਤਿਆਂ")],
      [T("400", "400", "400"), T("500", "500", "500"), T("600", "600", "600"), T("800", "800", "800")],
      [T("58%", "58%", "58%"), T("62%", "62%", "62%"), T("68%", "68%", "68%"), T("74%", "74%", "74%")],
      [T("use mobile banking at least once a week", "सप्ताह में कम से कम एक बार मोबाइल बैंकिंग का उपयोग करते हैं", "ਹਫ਼ਤੇ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਾਰ ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਵਰਤਦੇ ਹਨ"), T("make a digital payment at least once a week", "सप्ताह में कम से कम एक बार डिजिटल भुगतान करते हैं", "ਹਫ਼ਤੇ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਾਰ ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਕਰਦੇ ਹਨ"), T("use public transport at least once a week", "सप्ताह में कम से कम एक बार सार्वजनिक परिवहन का उपयोग करते हैं", "ਹਫ਼ਤੇ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਾਰ ਜਨਤਕ ਆਵਾਜਾਈ ਵਰਤਦੇ ਹਨ"), T("access an e-service at least once a week", "सप्ताह में कम से कम एक बार ई-सेवा का उपयोग करते हैं", "ਹਫ਼ਤੇ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਾਰ ਈ-ਸੇਵਾ ਵਰਤਦੇ ਹਨ")],
    ],
    statement: T("A survey of {b} {a} found that {c} {d}.", "{b} {a} के सर्वे में पाया गया कि {c} {d}।", "{b} {a} ਦੇ ਸਰਵੇ ਵਿੱਚ ਪਾਇਆ ਗਿਆ ਕਿ {c} {d}।"),
    conclusions: [T("Every one of the {b} {a} does this every day.", "सभी {b} {a} ऐसा हर दिन करते हैं।", "ਸਾਰੇ {b} {a} ਇਹ ਹਰ ਰੋਜ਼ ਕਰਦੇ ਹਨ।"), T("Less than half of the {b} {a} {d}.", "{b} {a} में आधे से कम {d}।", "{b} {a} ਵਿੱਚ ਅੱਧੇ ਤੋਂ ਘੱਟ {d}।")],
    explanation: [T("A figure of {c} does not mean every respondent does it daily.", "{c} का आँकड़ा यह नहीं बताता कि हर उत्तरदाता ऐसा प्रतिदिन करता है।", "{c} ਦਾ ਅੰਕੜਾ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਹਰ ਉੱਤਰਦਾਤਾ ਇਹ ਹਰ ਰੋਜ਼ ਕਰਦਾ ਹੈ।"), T("{c} is more than half, not less than half.", "{c} आधे से अधिक है, आधे से कम नहीं।", "{c} ਅੱਧੇ ਤੋਂ ਵੱਧ ਹੈ, ਅੱਧੇ ਤੋਂ ਘੱਟ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL001-T05", qlId: "STC-QL-001", surfaceArchetype: "QUOTED_CLAIM", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("The principal", "प्रधानाचार्य", "ਪ੍ਰਿੰਸੀਪਲ"), T("The programme coordinator", "कार्यक्रम समन्वयक", "ਪ੍ਰੋਗਰਾਮ ਕੋਆਰਡੀਨੇਟਰ"), T("The district officer", "जिला अधिकारी", "ਜ਼ਿਲ੍ਹਾ ਅਧਿਕਾਰੀ"), T("The event secretary", "कार्यक्रम सचिव", "ਪ੍ਰੋਗਰਾਮ ਸਕੱਤਰ")],
      [T("the annual function", "वार्षिक समारोह", "ਸਾਲਾਨਾ ਸਮਾਰੋਹ"), T("the award ceremony", "पुरस्कार समारोह", "ਇਨਾਮ ਸਮਾਰੋਹ"), T("the orientation programme", "परिचय कार्यक्रम", "ਓਰੀਐਂਟੇਸ਼ਨ ਪ੍ਰੋਗਰਾਮ"), T("the public workshop", "सार्वजनिक कार्यशाला", "ਜਨਤਕ ਵਰਕਸ਼ਾਪ")],
      [T("the main auditorium", "मुख्य सभागार", "ਮੁੱਖ ਆਡੀਟੋਰੀਅਮ"), T("the conference hall", "सम्मेलन कक्ष", "ਕਾਨਫ਼ਰੰਸ ਹਾਲ"), T("the community hall", "सामुदायिक भवन", "ਕਮਿਊਨਿਟੀ ਹਾਲ"), T("the training auditorium", "प्रशिक्षण सभागार", "ਟ੍ਰੇਨਿੰਗ ਆਡੀਟੋਰੀਅਮ")],
      [T("the date has not yet been finalised", "तारीख अभी अंतिम नहीं हुई है", "ਤਾਰੀਖ ਹਾਲੇ ਅੰਤਿਮ ਨਹੀਂ ਹੋਈ"), T("the final date will be announced later", "अंतिम तारीख बाद में घोषित की जाएगी", "ਅੰਤਿਮ ਤਾਰੀਖ ਬਾਅਦ ਵਿੱਚ ਘੋਸ਼ਿਤ ਕੀਤੀ ਜਾਵੇਗੀ"), T("the date is still under consideration", "तारीख अभी विचाराधीन है", "ਤਾਰੀਖ ਹਾਲੇ ਵਿਚਾਰ ਅਧੀਨ ਹੈ"), T("the date still requires final approval", "तारीख को अभी अंतिम स्वीकृति चाहिए", "ਤਾਰੀਖ ਨੂੰ ਹਾਲੇ ਅੰਤਿਮ ਮਨਜ਼ੂਰੀ ਚਾਹੀਦੀ ਹੈ")],
    ],
    statement: T("{a} said, “{b} will be held in {c}; {d}.”", "{a} ने कहा, “{b} {c} में होगा; {d}।”", "{a} ਨੇ ਕਿਹਾ, “{b} {c} ਵਿੱਚ ਹੋਵੇਗਾ; {d}।”"),
    conclusions: [T("The venue for {b} has been decided.", "{b} का स्थान तय हो चुका है।", "{b} ਦਾ ਸਥਾਨ ਤੈਅ ਹੋ ਚੁੱਕਾ ਹੈ।"), T("{b} has been cancelled.", "{b} रद्द कर दिया गया है।", "{b} ਰੱਦ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।")],
    explanation: [T("{a} identifies {c} as the venue.", "{a} ने {c} को स्थान बताया है।", "{a} ਨੇ {c} ਨੂੰ ਸਥਾਨ ਦੱਸਿਆ ਹੈ।"), T("No cancellation of {b} is stated.", "{b} के रद्द होने की कोई बात नहीं कही गई।", "{b} ਦੇ ਰੱਦ ਹੋਣ ਦੀ ਕੋਈ ਗੱਲ ਨਹੀਂ ਕਹੀ ਗਈ।")],
  },
  {
    id: "STC-V22-QL001-T06", qlId: "STC-QL-001", surfaceArchetype: "RULE_ELIGIBILITY", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      [T("Entry to the archive room requires a staff identity card.", "अभिलेख कक्ष में प्रवेश के लिए स्टाफ पहचान पत्र आवश्यक है।", "ਅਭਿਲੇਖ ਕਮਰੇ ਵਿੱਚ ਦਾਖ਼ਲੇ ਲਈ ਸਟਾਫ਼ ਪਛਾਣ ਪੱਤਰ ਲਾਜ਼ਮੀ ਹੈ।"), T("Entry to the secure records room requires an authorised access card.", "सुरक्षित अभिलेख कक्ष में प्रवेश के लिए अधिकृत प्रवेश कार्ड आवश्यक है।", "ਸੁਰੱਖਿਅਤ ਰਿਕਾਰਡ ਕਮਰੇ ਵਿੱਚ ਦਾਖ਼ਲੇ ਲਈ ਅਧਿਕ੍ਰਿਤ ਐਕਸੈਸ ਕਾਰਡ ਲਾਜ਼ਮੀ ਹੈ।"), T("Entry to the examination store requires an official entry pass.", "परीक्षा भंडार कक्ष में प्रवेश के लिए आधिकारिक प्रवेश पास आवश्यक है।", "ਪਰੀਖਿਆ ਸਟੋਰ ਵਿੱਚ ਦਾਖ਼ਲੇ ਲਈ ਅਧਿਕਾਰਕ ਐਂਟਰੀ ਪਾਸ ਲਾਜ਼ਮੀ ਹੈ।"), T("Entry to the restricted laboratory requires a valid access badge.", "प्रतिबंधित प्रयोगशाला में प्रवेश के लिए वैध प्रवेश बैज आवश्यक है।", "ਪਾਬੰਦੀਸ਼ੁਦਾ ਲੈਬ ਵਿੱਚ ਦਾਖ਼ਲੇ ਲਈ ਵੈਧ ਐਕਸੈਸ ਬੈਜ ਲਾਜ਼ਮੀ ਹੈ।")],
      [T("Neeraj", "नीरज", "ਨੀਰਜ"), T("Meera", "मीरा", "ਮੀਰਾ"), T("Karan", "करण", "ਕਰਨ"), T("Simran", "सिमरन", "ਸਿਮਰਨ")],
      [T("the district office", "जिला कार्यालय", "ਜ਼ਿਲ੍ਹਾ ਦਫ਼ਤਰ"), T("the university", "विश्वविद्यालय", "ਯੂਨੀਵਰਸਿਟੀ"), T("the examination board", "परीक्षा बोर्ड", "ਪਰੀਖਿਆ ਬੋਰਡ"), T("the research centre", "अनुसंधान केंद्र", "ਖੋਜ ਕੇਂਦਰ")],
      [T("during the morning shift", "सुबह की पाली में", "ਸਵੇਰ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ"), T("during the afternoon shift", "दोपहर की पाली में", "ਦੁਪਹਿਰ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ"), T("on Tuesday", "मंगलवार को", "ਮੰਗਲਵਾਰ ਨੂੰ"), T("during an official visit", "आधिकारिक दौरे के दौरान", "ਅਧਿਕਾਰਕ ਦੌਰੇ ਦੌਰਾਨ")],
    ],
    statement: T("{a} {b} entered that restricted area at {c} {d} in accordance with the rule.", "{a} {b} ने {c} में उस प्रतिबंधित क्षेत्र में {d} नियम के अनुसार प्रवेश किया।", "{a} {b} ਨੇ {c} ਵਿੱਚ ਉਸ ਪਾਬੰਦੀਸ਼ੁਦਾ ਖੇਤਰ ਵਿੱਚ {d} ਨਿਯਮ ਅਨੁਸਾਰ ਦਾਖ਼ਲਾ ਕੀਤਾ।"),
    conclusions: [T("{b} is necessarily a permanent employee of {c}.", "{b} अनिवार्य रूप से {c} का स्थायी कर्मचारी है।", "{b} ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ {c} ਦਾ ਪੱਕਾ ਕਰਮਚਾਰੀ ਹੈ।"), T("{b} had the access document required by the stated rule.", "{b} के पास नियम द्वारा आवश्यक प्रवेश दस्तावेज था।", "{b} ਕੋਲ ਨਿਯਮ ਅਨੁਸਾਰ ਲੋੜੀਂਦਾ ਦਾਖ਼ਲਾ ਦਸਤਾਵੇਜ਼ ਸੀ।")],
    explanation: [T("Permanent employment is not stated as a condition.", "स्थायी नौकरी को शर्त नहीं बताया गया है।", "ਪੱਕੀ ਨੌਕਰੀ ਨੂੰ ਸ਼ਰਤ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"), T("Compliant entry under the rule requires the specified access document.", "नियम के अनुसार प्रवेश के लिए निर्दिष्ट प्रवेश दस्तावेज आवश्यक है।", "ਨਿਯਮ ਅਨੁਸਾਰ ਦਾਖ਼ਲੇ ਲਈ ਨਿਰਧਾਰਤ ਐਕਸੈਸ ਦਸਤਾਵੇਜ਼ ਲਾਜ਼ਮੀ ਹੈ।")],
  },
  {
    id: "STC-V22-QL001-T07", qlId: "STC-QL-001", surfaceArchetype: "NUMERIC_SNAPSHOT", difficulty: "EASY", answerClass: "BOTH",
    dimensions: [
      [T("the training programme", "प्रशिक्षण कार्यक्रम", "ਟ੍ਰੇਨਿੰਗ ਪ੍ਰੋਗਰਾਮ"), T("the certificate course", "प्रमाणपत्र पाठ्यक्रम", "ਸਰਟੀਫਿਕੇਟ ਕੋਰਸ"), T("the residential workshop", "आवासीय कार्यशाला", "ਰਿਹਾਇਸ਼ੀ ਵਰਕਸ਼ਾਪ"), T("the skill-development batch", "कौशल-विकास बैच", "ਹੁਨਰ-ਵਿਕਾਸ ਬੈਚ")],
      [T("60", "60", "60"), T("80", "80", "80"), T("100", "100", "100"), T("120", "120", "120")],
      [T("12", "12", "12"), T("16", "16", "16"), T("20", "20", "20"), T("24", "24", "24")],
      [T("departmental candidates", "विभागीय अभ्यर्थियों", "ਵਿਭਾਗੀ ਉਮੀਦਵਾਰਾਂ"), T("in-service employees", "सेवारत कर्मचारियों", "ਸੇਵਾਰਤ ਕਰਮਚਾਰੀਆਂ"), T("sponsored trainees", "प्रायोजित प्रशिक्षुओं", "ਸਪਾਂਸਰ ਕੀਤੇ ਟ੍ਰੇਨੀਜ਼"), T("internal applicants", "आंतरिक आवेदकों", "ਅੰਦਰੂਨੀ ਅਰਜ਼ੀਕਾਰਾਂ")],
    ],
    statement: T("{a} has {b} seats, of which {c} are reserved for {d}.", "{a} में {b} सीटें हैं, जिनमें से {c} {d} के लिए आरक्षित हैं।", "{a} ਵਿੱਚ {b} ਸੀਟਾਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ {c} {d} ਲਈ ਰਾਖਵੀਆਂ ਹਨ।"),
    conclusions: [T("More than half of the seats in {a} are outside the reservation for {d}.", "{a} की आधे से अधिक सीटें {d} के आरक्षण से बाहर हैं।", "{a} ਦੀਆਂ ਅੱਧ ਤੋਂ ਵੱਧ ਸੀਟਾਂ {d} ਦੇ ਰਾਖਵੇਂ ਹਿੱਸੇ ਤੋਂ ਬਾਹਰ ਹਨ।"), T("Fewer than half of the seats in {a} are reserved for {d}.", "{a} की आधे से कम सीटें {d} के लिए आरक्षित हैं।", "{a} ਦੀਆਂ ਅੱਧ ਤੋਂ ਘੱਟ ਸੀਟਾਂ {d} ਲਈ ਰਾਖਵੀਆਂ ਹਨ।")],
    explanation: [T("Even the largest listed reservation, {c}, is below half of every listed total {b}; therefore more than half remain outside it.", "दिया गया आरक्षण {c}, कुल {b} के आधे से कम है; इसलिए आधे से अधिक सीटें उसके बाहर हैं।", "ਦਿੱਤਾ ਰਾਖਵਾਂ ਅੰਕ {c}, ਕੁੱਲ {b} ਦੇ ਅੱਧ ਤੋਂ ਘੱਟ ਹੈ; ਇਸ ਲਈ ਅੱਧ ਤੋਂ ਵੱਧ ਸੀਟਾਂ ਇਸ ਤੋਂ ਬਾਹਰ ਹਨ।"), T("{c} is less than half of {b} in every permitted combination.", "हर अनुमत संयोजन में {c}, {b} के आधे से कम है।", "ਹਰ ਮਨਜ਼ੂਰ ਜੋੜ ਵਿੱਚ {c}, {b} ਦੇ ਅੱਧ ਤੋਂ ਘੱਟ ਹੈ।")],
  },
  {
    id: "STC-V22-QL001-T08", qlId: "STC-QL-001", surfaceArchetype: "CONTRAST_CONCESSION", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      [T("the district branch", "जिला शाखा", "ਜ਼ਿਲ੍ਹਾ ਸ਼ਾਖਾ"), T("the main city branch", "मुख्य नगर शाखा", "ਮੁੱਖ ਸ਼ਹਿਰੀ ਸ਼ਾਖਾ"), T("the administrative office", "प्रशासनिक कार्यालय", "ਪ੍ਰਸ਼ਾਸਕੀ ਦਫ਼ਤਰ"), T("the service centre", "सेवा केंद्र", "ਸੇਵਾ ਕੇਂਦਰ")],
      [T("the cash counter", "नकद काउंटर", "ਨਕਦ ਕਾਊਂਟਰ"), T("the customer-help desk", "ग्राहक सहायता डेस्क", "ਗਾਹਕ ਸਹਾਇਤਾ ਡੈਸਕ"), T("the deposit desk", "जमा डेस्क", "ਜਮ੍ਹਾ ਡੈਸਕ"), T("the document counter", "दस्तावेज काउंटर", "ਦਸਤਾਵੇਜ਼ ਕਾਊਂਟਰ")],
      [T("the locker section", "लॉकर अनुभाग", "ਲਾਕਰ ਸੈਕਸ਼ਨ"), T("the records room", "अभिलेख कक्ष", "ਰਿਕਾਰਡ ਕਮਰਾ"), T("the loan desk", "ऋण डेस्क", "ਕਰਜ਼ਾ ਡੈਸਕ"), T("the manager's office", "प्रबंधक कक्ष", "ਮੈਨੇਜਰ ਦਾ ਦਫ਼ਤਰ")],
      [T("after the recent rearrangement", "हाल की पुनर्व्यवस्था के बाद", "ਹਾਲੀਆ ਪੁਨਰ-ਵਿਉਂਤ ਤੋਂ ਬਾਅਦ"), T("under the revised floor plan", "संशोधित मंजिल योजना के अनुसार", "ਸੋਧੇ ਫਲੋਰ ਪਲਾਨ ਅਨੁਸਾਰ"), T("from this week", "इस सप्ताह से", "ਇਸ ਹਫ਼ਤੇ ਤੋਂ"), T("under the new service layout", "नई सेवा व्यवस्था के अनुसार", "ਨਵੀਂ ਸੇਵਾ ਵਿਉਂਤ ਅਨੁਸਾਰ")],
    ],
    statement: T("At {a}, {b} has shifted to the ground floor {d}, while {c} continues to operate on the first floor.", "{a} में {b} {d} भूतल पर स्थानांतरित हो गया है, जबकि {c} पहली मंजिल पर ही काम कर रहा है।", "{a} ਵਿੱਚ {b} {d} ਭੂਤਲ ਉੱਤੇ ਤਬਦੀਲ ਹੋ ਗਿਆ ਹੈ, ਜਦਕਿ {c} ਪਹਿਲੀ ਮੰਜ਼ਿਲ ਉੱਤੇ ਹੀ ਚੱਲ ਰਿਹਾ ਹੈ।"),
    conclusions: [T("All services at {a} have shifted to the ground floor.", "{a} की सभी सेवाएँ भूतल पर स्थानांतरित हो गई हैं।", "{a} ਦੀਆਂ ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ ਭੂਤਲ ਉੱਤੇ ਤਬਦੀਲ ਹੋ ਗਈਆਂ ਹਨ।"), T("{b} and {c} now operate on the same floor.", "{b} और {c} अब एक ही मंजिल पर काम करते हैं।", "{b} ਅਤੇ {c} ਹੁਣ ਇੱਕੋ ਮੰਜ਼ਿਲ ਉੱਤੇ ਚੱਲਦੇ ਹਨ।")],
    explanation: [T("{c} remains on the first floor, so not all services shifted.", "{c} पहली मंजिल पर है, इसलिए सभी सेवाएँ स्थानांतरित नहीं हुईं।", "{c} ਪਹਿਲੀ ਮੰਜ਼ਿਲ ਉੱਤੇ ਹੈ, ਇਸ ਲਈ ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ ਤਬਦੀਲ ਨਹੀਂ ਹੋਈਆਂ।"), T("{b} is on the ground floor while {c} is on the first floor.", "{b} भूतल पर है, जबकि {c} पहली मंजिल पर है।", "{b} ਭੂਤਲ ਉੱਤੇ ਹੈ, ਜਦਕਿ {c} ਪਹਿਲੀ ਮੰਜ਼ਿਲ ਉੱਤੇ ਹੈ।")],
  },
] as const;
