import { tri } from "./editorial-v2-2-saturation-helpers.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

const T = tri;

export const STC_V22_QL002_TEMPLATES: readonly StcV22Template[] = [
  {
    id: "STC-V22-QL002-T01", qlId: "STC-QL-002", surfaceArchetype: "SURVEY_REPORT", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("the annual grievance report", "वार्षिक शिकायत रिपोर्ट", "ਸਾਲਾਨਾ ਸ਼ਿਕਾਇਤ ਰਿਪੋਰਟ"), T("the quarterly service report", "त्रैमासिक सेवा रिपोर्ट", "ਤਿਮਾਹੀ ਸੇਵਾ ਰਿਪੋਰਟ"), T("the customer-service review", "ग्राहक सेवा समीक्षा", "ਗਾਹਕ ਸੇਵਾ ਸਮੀਖਿਆ"), T("the district performance report", "जिला प्रदर्शन रिपोर्ट", "ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਦਰਸ਼ਨ ਰਿਪੋਰਟ")],
      [T("8%", "8%", "8%"), T("12%", "12%", "12%"), T("14%", "14%", "14%"), T("18%", "18%", "18%")],
      [T("compared with the previous year", "पिछले वर्ष की तुलना में", "ਪਿਛਲੇ ਸਾਲ ਨਾਲ ਤੁਲਨਾ ਵਿੱਚ"), T("compared with the previous quarter", "पिछली तिमाही की तुलना में", "ਪਿਛਲੀ ਤਿਮਾਹੀ ਨਾਲ ਤੁਲਨਾ ਵਿੱਚ"), T("over the corresponding earlier period", "समान पिछली अवधि की तुलना में", "ਸਮਾਨ ਪਿਛਲੀ ਮਿਆਦ ਨਾਲ ਤੁਲਨਾ ਵਿੱਚ"), T("since the last review", "पिछली समीक्षा के बाद से", "ਪਿਛਲੀ ਸਮੀਖਿਆ ਤੋਂ ਬਾਅਦ")],
      [T("from 2.4 days to 2.9 days", "2.4 दिन से 2.9 दिन", "2.4 ਦਿਨ ਤੋਂ 2.9 ਦਿਨ"), T("from 3.1 days to 3.8 days", "3.1 दिन से 3.8 दिन", "3.1 ਦਿਨ ਤੋਂ 3.8 ਦਿਨ"), T("from 4.0 days to 4.6 days", "4.0 दिन से 4.6 दिन", "4.0 ਦਿਨ ਤੋਂ 4.6 ਦਿਨ"), T("from 5.2 days to 6.0 days", "5.2 दिन से 6.0 दिन", "5.2 ਦਿਨ ਤੋਂ 6.0 ਦਿਨ")],
    ],
    statement: T("{a} shows that the number of complaints received fell by {b} {c}, while the average time taken to resolve a complaint increased {d}.", "{a} बताती है कि प्राप्त शिकायतों की संख्या {c} {b} घटी, जबकि एक शिकायत को हल करने का औसत समय {d} बढ़ गया।", "{a} ਦੱਸਦੀ ਹੈ ਕਿ ਪ੍ਰਾਪਤ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਗਿਣਤੀ {c} {b} ਘਟੀ, ਜਦਕਿ ਇੱਕ ਸ਼ਿਕਾਇਤ ਹੱਲ ਕਰਨ ਦਾ ਔਸਤ ਸਮਾਂ {d} ਵੱਧ ਗਿਆ।"),
    conclusions: [T("Fewer complaints were received {c}.", "{c} कम शिकायतें प्राप्त हुईं।", "{c} ਘੱਟ ਸ਼ਿਕਾਇਤਾਂ ਪ੍ਰਾਪਤ ਹੋਈਆਂ।"), T("Complaints were resolved faster on average in the later period.", "बाद की अवधि में शिकायतें औसतन अधिक तेजी से हल हुईं।", "ਬਾਅਦਲੀ ਮਿਆਦ ਵਿੱਚ ਸ਼ਿਕਾਇਤਾਂ ਔਸਤਨ ਹੋਰ ਤੇਜ਼ੀ ਨਾਲ ਹੱਲ ਹੋਈਆਂ।")],
    explanation: [T("A fall of {b} means fewer complaints were received.", "{b} की गिरावट का अर्थ है कि कम शिकायतें प्राप्त हुईं।", "{b} ਦੀ ਘਟਾਓ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਘੱਟ ਸ਼ਿਕਾਇਤਾਂ ਪ੍ਰਾਪਤ ਹੋਈਆਂ।"), T("Resolution time increased {d}, so faster average resolution does not follow.", "समाधान समय {d} बढ़ा, इसलिए तेज औसत समाधान का निष्कर्ष नहीं निकलता।", "ਹੱਲ ਕਰਨ ਦਾ ਸਮਾਂ {d} ਵਧਿਆ, ਇਸ ਲਈ ਤੇਜ਼ ਔਸਤ ਹੱਲ ਦਾ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ।")],
  },
  {
    id: "STC-V22-QL002-T02", qlId: "STC-QL-002", surfaceArchetype: "EVERYDAY_OBSERVATION", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      [T("Market Road", "मार्केट रोड", "ਮਾਰਕੀਟ ਰੋਡ"), T("Station Road", "स्टेशन रोड", "ਸਟੇਸ਼ਨ ਰੋਡ"), T("the bus-stand complex", "बस-अड्डा परिसर", "ਬੱਸ ਅੱਡਾ ਕੰਪਲੈਕਸ"), T("the civic-centre lane", "नागरिक केंद्र मार्ग", "ਸਿਵਿਕ ਸੈਂਟਰ ਲੇਨ")],
      [T("the faulty streetlights were repaired", "खराब स्ट्रीट लाइटों की मरम्मत की गई", "ਖਰਾਬ ਸਟ੍ਰੀਟ ਲਾਈਟਾਂ ਦੀ ਮੁਰੰਮਤ ਕੀਤੀ ਗਈ"), T("damaged lamps were replaced", "खराब लैंप बदले गए", "ਖਰਾਬ ਲੈਂਪ ਬਦਲੇ ਗਏ"), T("the lighting timers were corrected", "लाइटिंग टाइमर ठीक किए गए", "ਲਾਈਟਿੰਗ ਟਾਈਮਰ ਠੀਕ ਕੀਤੇ ਗਏ"), T("non-working lights were restored", "बंद पड़ी लाइटें चालू की गईं", "ਬੰਦ ਪਈਆਂ ਲਾਈਟਾਂ ਮੁੜ ਚਾਲੂ ਕੀਤੀਆਂ ਗਈਆਂ")],
      [T("complaints about dark spots", "अंधेरे स्थानों की शिकायतें", "ਹਨੇਰੇ ਸਥਾਨਾਂ ਬਾਰੇ ਸ਼ਿਕਾਇਤਾਂ"), T("complaints about poor road lighting", "कम सड़क रोशनी की शिकायतें", "ਘੱਟ ਸੜਕ ਰੌਸ਼ਨੀ ਬਾਰੇ ਸ਼ਿਕਾਇਤਾਂ"), T("complaints about unlit stretches", "बिना रोशनी वाले हिस्सों की शिकायतें", "ਬਿਨਾਂ ਰੌਸ਼ਨੀ ਵਾਲੇ ਹਿੱਸਿਆਂ ਬਾਰੇ ਸ਼ਿਕਾਇਤਾਂ"), T("lighting-related complaints", "रोशनी संबंधी शिकायतें", "ਰੌਸ਼ਨੀ ਨਾਲ ਸੰਬੰਧਿਤ ਸ਼ਿਕਾਇਤਾਂ")],
      [T("theft complaints", "चोरी की शिकायतें", "ਚੋਰੀ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ"), T("parking complaints", "पार्किंग की शिकायतें", "ਪਾਰਕਿੰਗ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ"), T("littering complaints", "कूड़ा फैलाने की शिकायतें", "ਕੂੜਾ ਸੁੱਟਣ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ"), T("traffic-noise complaints", "यातायात शोर की शिकायतें", "ਟ੍ਰੈਫ਼ਿਕ ਸ਼ੋਰ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ")],
    ],
    statement: T("After {b} at {a}, {c} fell sharply, while {d} remained at about the same level.", "{a} पर {b} के बाद {c} तेजी से घटीं, जबकि {d} लगभग उसी स्तर पर रहीं।", "{a} ਉੱਤੇ {b} ਤੋਂ ਬਾਅਦ {c} ਤੇਜ਼ੀ ਨਾਲ ਘਟੀਆਂ, ਜਦਕਿ {d} ਲਗਭਗ ਉਸੇ ਪੱਧਰ ਉੱਤੇ ਰਹੀਆਂ।"),
    conclusions: [T("{d} also declined sharply after the lighting work.", "रोशनी के काम के बाद {d} भी तेजी से घटीं।", "ਰੌਸ਼ਨੀ ਦੇ ਕੰਮ ਤੋਂ ਬਾਅਦ {d} ਵੀ ਤੇਜ਼ੀ ਨਾਲ ਘਟੀਆਂ।"), T("{c} declined after the lighting work at {a}.", "{a} पर रोशनी के काम के बाद {c} घटीं।", "{a} ਉੱਤੇ ਰੌਸ਼ਨੀ ਦੇ ਕੰਮ ਤੋਂ ਬਾਅਦ {c} ਘਟੀਆਂ।")],
    explanation: [T("The statement says {d} stayed at about the same level.", "कथन कहता है कि {d} लगभग उसी स्तर पर रहीं।", "ਕਥਨ ਕਹਿੰਦਾ ਹੈ ਕਿ {d} ਲਗਭਗ ਉਸੇ ਪੱਧਰ ਉੱਤੇ ਰਹੀਆਂ।"), T("The statement directly reports a sharp fall in {c}.", "कथन सीधे {c} में तेज गिरावट बताता है।", "ਕਥਨ ਸਿੱਧੇ {c} ਵਿੱਚ ਤੇਜ਼ ਘਟਾਓ ਦੱਸਦਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL002-T03", qlId: "STC-QL-002", surfaceArchetype: "PUBLIC_NOTICE", difficulty: "EASY", answerClass: "BOTH",
    dimensions: [
      [T("the grievance cell", "शिकायत प्रकोष्ठ", "ਸ਼ਿਕਾਇਤ ਸੈੱਲ"), T("the citizen-service desk", "नागरिक सेवा डेस्क", "ਨਾਗਰਿਕ ਸੇਵਾ ਡੈਸਕ"), T("the scholarship help centre", "छात्रवृत्ति सहायता केंद्र", "ਸਕਾਲਰਸ਼ਿਪ ਸਹਾਇਤਾ ਕੇਂਦਰ"), T("the recruitment assistance unit", "भर्ती सहायता इकाई", "ਭਰਤੀ ਸਹਾਇਤਾ ਯੂਨਿਟ")],
      [T("the online portal", "ऑनलाइन पोर्टल", "ਆਨਲਾਈਨ ਪੋਰਟਲ"), T("the official mobile application", "आधिकारिक मोबाइल ऐप", "ਅਧਿਕਾਰਕ ਮੋਬਾਈਲ ਐਪ"), T("the department website", "विभागीय वेबसाइट", "ਵਿਭਾਗੀ ਵੈੱਬਸਾਈਟ"), T("the e-service window", "ई-सेवा विंडो", "ਈ-ਸੇਵਾ ਵਿੰਡੋ")],
      [T("district facilitation centres", "जिला सुविधा केंद्रों", "ਜ਼ਿਲ੍ਹਾ ਸੁਵਿਧਾ ਕੇਂਦਰਾਂ"), T("designated service counters", "निर्धारित सेवा काउंटरों", "ਨਿਰਧਾਰਤ ਸੇਵਾ ਕਾਊਂਟਰਾਂ"), T("authorised help desks", "अधिकृत सहायता डेस्कों", "ਅਧਿਕ੍ਰਿਤ ਸਹਾਇਤਾ ਡੈਸਕਾਂ"), T("notified collection centres", "अधिसूचित संग्रह केंद्रों", "ਸੂਚਿਤ ਸੰਗ੍ਰਹਿ ਕੇਂਦਰਾਂ")],
      [T("ordinary post", "साधारण डाक", "ਸਧਾਰਨ ਡਾਕ"), T("an unregistered personal email", "अपंजीकृत निजी ईमेल", "ਗੈਰ-ਰਜਿਸਟਰਡ ਨਿੱਜੀ ਈਮੇਲ"), T("a social-media message", "सोशल मीडिया संदेश", "ਸੋਸ਼ਲ ਮੀਡੀਆ ਸੁਨੇਹਾ"), T("an unnotified private courier", "अनधिसूचित निजी कूरियर", "ਗੈਰ-ਸੂਚਿਤ ਨਿੱਜੀ ਕੂਰੀਅਰ")],
    ],
    statement: T("{a} accepts submissions through {b} and at {c}. Submissions sent through {d} are not registered.", "{a} {b} और {c} के माध्यम से आवेदन स्वीकार करता है। {d} से भेजे आवेदन पंजीकृत नहीं होते।", "{a} {b} ਅਤੇ {c} ਰਾਹੀਂ ਜਮ੍ਹਾਂ ਕਰਵਾਈਆਂ ਅਰਜ਼ੀਆਂ ਸਵੀਕਾਰ ਕਰਦਾ ਹੈ। {d} ਰਾਹੀਂ ਭੇਜੀਆਂ ਅਰਜ਼ੀਆਂ ਰਜਿਸਟਰ ਨਹੀਂ ਹੁੰਦੀਆਂ।"),
    conclusions: [T("A person has more than one recognised channel for submitting to {a}.", "{a} में जमा करने के लिए एक व्यक्ति के पास एक से अधिक मान्य माध्यम हैं।", "{a} ਵਿੱਚ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ ਇੱਕ ਵਿਅਕਤੀ ਕੋਲ ਇੱਕ ਤੋਂ ਵੱਧ ਮੰਨਿਆ ਹੋਇਆ ਮਾਧਿਅਮ ਹੈ।"), T("{d} is not a recognised registration channel for {a}.", "{d} {a} के लिए मान्य पंजीकरण माध्यम नहीं है।", "{d} {a} ਲਈ ਮੰਨਿਆ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਮਾਧਿਅਮ ਨਹੀਂ ਹੈ।")],
    explanation: [T("Two accepted channels, {b} and {c}, are expressly named.", "दो स्वीकार्य माध्यम, {b} और {c}, स्पष्ट रूप से बताए गए हैं।", "ਦੋ ਮੰਨੇ ਮਾਧਿਅਮ, {b} ਅਤੇ {c}, ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਦੱਸੇ ਗਏ ਹਨ।"), T("The statement expressly excludes {d} from registration.", "कथन स्पष्ट रूप से {d} को पंजीकरण से बाहर रखता है।", "ਕਥਨ ਸਪਸ਼ਟ ਤੌਰ ਤੇ {d} ਨੂੰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਤੋਂ ਬਾਹਰ ਰੱਖਦਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL002-T04", qlId: "STC-QL-002", surfaceArchetype: "CONTRAST_CONCESSION", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      [T("the new tablet", "नया टैबलेट", "ਨਵਾਂ ਟੈਬਲੇਟ"), T("the new handheld scanner", "नया हैंडहेल्ड स्कैनर", "ਨਵਾਂ ਹੈਂਡਹੈਲਡ ਸਕੈਨਰ"), T("the new field terminal", "नया फील्ड टर्मिनल", "ਨਵਾਂ ਫ਼ੀਲਡ ਟਰਮੀਨਲ"), T("the new portable reader", "नया पोर्टेबल रीडर", "ਨਵਾਂ ਪੋਰਟੇਬਲ ਰੀਡਰ")],
      [T("120 grams lighter", "120 ग्राम हल्का", "120 ਗ੍ਰਾਮ ਹਲਕਾ"), T("150 grams lighter", "150 ग्राम हल्का", "150 ਗ੍ਰਾਮ ਹਲਕਾ"), T("18% lighter", "18% हल्का", "18% ਹਲਕਾ"), T("22% lighter", "22% हल्का", "22% ਹਲਕਾ")],
      [T("one hour fewer", "एक घंटा कम", "ਇੱਕ ਘੰਟਾ ਘੱਟ"), T("90 minutes fewer", "90 मिनट कम", "90 ਮਿੰਟ ਘੱਟ"), T("two hours fewer", "दो घंटे कम", "ਦੋ ਘੰਟੇ ਘੱਟ"), T("about 15% fewer hours", "लगभग 15% कम घंटे", "ਲਗਭਗ 15% ਘੱਟ ਘੰਟੇ")],
      [T("in the latest product comparison", "नवीनतम उत्पाद तुलना में", "ਤਾਜ਼ਾ ਉਤਪਾਦ ਤੁਲਨਾ ਵਿੱਚ"), T("under the revised specification", "संशोधित विनिर्देश के अनुसार", "ਸੋਧੀ ਵਿਸ਼ੇਸ਼ਤਾ ਅਨੁਸਾਰ"), T("in the current model review", "वर्तमान मॉडल समीक्षा में", "ਮੌਜੂਦਾ ਮਾਡਲ ਸਮੀਖਿਆ ਵਿੱਚ"), T("according to the manufacturer data", "निर्माता के आँकड़ों के अनुसार", "ਨਿਰਮਾਤਾ ਦੇ ਅੰਕੜਿਆਂ ਅਨੁਸਾਰ")],
    ],
    statement: T("{d}, {a} is {b} than the previous model, but its battery lasts {c} on a full charge.", "{d}, {a} पिछले मॉडल से {b} है, लेकिन पूरी चार्ज पर इसकी बैटरी {c} चलती है।", "{d}, {a} ਪਿਛਲੇ ਮਾਡਲ ਨਾਲੋਂ {b} ਹੈ, ਪਰ ਪੂਰੀ ਚਾਰਜ ਉੱਤੇ ਇਸ ਦੀ ਬੈਟਰੀ {c} ਚੱਲਦੀ ਹੈ।"),
    conclusions: [T("{a} improved on both weight and battery life.", "{a} ने वजन और बैटरी जीवन दोनों में सुधार किया।", "{a} ਨੇ ਵਜ਼ਨ ਅਤੇ ਬੈਟਰੀ ਲਾਈਫ ਦੋਵਾਂ ਵਿੱਚ ਸੁਧਾਰ ਕੀਤਾ।"), T("{a} has longer battery life than the previous model.", "{a} की बैटरी पिछले मॉडल से अधिक देर चलती है।", "{a} ਦੀ ਬੈਟਰੀ ਪਿਛਲੇ ਮਾਡਲ ਨਾਲੋਂ ਵੱਧ ਚੱਲਦੀ ਹੈ।")],
    explanation: [T("Weight improved, but battery duration became shorter by {c}.", "वजन सुधरा, लेकिन बैटरी अवधि {c} हो गई।", "ਵਜ਼ਨ ਸੁਧਰਿਆ, ਪਰ ਬੈਟਰੀ ਮਿਆਦ {c} ਹੋ ਗਈ।"), T("The statement says the battery lasts {c}, not longer.", "कथन कहता है कि बैटरी {c} चलती है, अधिक नहीं।", "ਕਥਨ ਕਹਿੰਦਾ ਹੈ ਕਿ ਬੈਟਰੀ {c} ਚੱਲਦੀ ਹੈ, ਵੱਧ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL002-T05", qlId: "STC-QL-002", surfaceArchetype: "RULE_ELIGIBILITY", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("a travel reimbursement claim", "यात्रा प्रतिपूर्ति दावा", "ਯਾਤਰਾ ਰੀਇੰਬਰਸਮੈਂਟ ਦਾਅਵਾ"), T("a field-visit reimbursement claim", "मैदानी दौरा प्रतिपूर्ति दावा", "ਫ਼ੀਲਡ ਦੌਰਾ ਰੀਇੰਬਰਸਮੈਂਟ ਦਾਅਵਾ"), T("a training-expense claim", "प्रशिक्षण व्यय दावा", "ਟ੍ਰੇਨਿੰਗ ਖਰਚ ਦਾਅਵਾ"), T("an official-tour claim", "आधिकारिक दौरा दावा", "ਅਧਿਕਾਰਕ ਦੌਰਾ ਦਾਅਵਾ")],
      [T("the original travel ticket", "मूल यात्रा टिकट", "ਅਸਲ ਯਾਤਰਾ ਟਿਕਟ"), T("the journey receipt", "यात्रा रसीद", "ਯਾਤਰਾ ਰਸੀਦ"), T("the boarding document", "यात्रा बोर्डिंग दस्तावेज", "ਬੋਰਡਿੰਗ ਦਸਤਾਵੇਜ਼"), T("the fare receipt", "किराया रसीद", "ਕਿਰਾਇਆ ਰਸੀਦ")],
      [T("the approved tour order", "स्वीकृत दौरा आदेश", "ਮਨਜ਼ੂਰ ਦੌਰਾ ਹੁਕਮ"), T("the sanction letter", "स्वीकृति पत्र", "ਮਨਜ਼ੂਰੀ ਪੱਤਰ"), T("the authorised visit order", "अधिकृत दौरा आदेश", "ਅਧਿਕ੍ਰਿਤ ਦੌਰਾ ਹੁਕਮ"), T("the duty approval", "ड्यूटी स्वीकृति", "ਡਿਊਟੀ ਮਨਜ਼ੂਰੀ")],
      [T("the accounts section", "लेखा अनुभाग", "ਲੇਖਾ ਸੈਕਸ਼ਨ"), T("the finance office", "वित्त कार्यालय", "ਵਿੱਤ ਦਫ਼ਤਰ"), T("the claims unit", "दावा इकाई", "ਦਾਅਵਾ ਯੂਨਿਟ"), T("the reimbursement desk", "प्रतिपूर्ति डेस्क", "ਰੀਇੰਬਰਸਮੈਂਟ ਡੈਸਕ")],
    ],
    statement: T("For {a}, {d} requires both {b} and {c}. A claim missing either document is returned for correction.", "{a} के लिए {d} {b} और {c} दोनों मांगता है। इनमें से कोई भी दस्तावेज न होने पर दावा सुधार के लिए लौटाया जाता है।", "{a} ਲਈ {d} {b} ਅਤੇ {c} ਦੋਵੇਂ ਮੰਗਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਦਸਤਾਵੇਜ਼ ਨਾ ਹੋਵੇ ਤਾਂ ਦਾਅਵਾ ਸੋਧ ਲਈ ਵਾਪਸ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"),
    conclusions: [T("Both {b} and {c} are required for a complete {a}.", "पूर्ण {a} के लिए {b} और {c} दोनों आवश्यक हैं।", "ਪੂਰੇ {a} ਲਈ {b} ਅਤੇ {c} ਦੋਵੇਂ ਲਾਜ਼ਮੀ ਹਨ।"), T("{b} alone is sufficient for {a}.", "केवल {b} {a} के लिए पर्याप्त है।", "ਕੇਵਲ {b} {a} ਲਈ ਕਾਫ਼ੀ ਹੈ।")],
    explanation: [T("The rule expressly requires both listed documents.", "नियम स्पष्ट रूप से दोनों दस्तावेजों की मांग करता है।", "ਨਿਯਮ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਦੋਵੇਂ ਦਸਤਾਵੇਜ਼ ਮੰਗਦਾ ਹੈ।"), T("One document alone does not satisfy a two-document requirement.", "एक दस्तावेज अकेला दो-दस्तावेज आवश्यकता को पूरा नहीं करता।", "ਇੱਕ ਦਸਤਾਵੇਜ਼ ਇਕੱਲਾ ਦੋ-ਦਸਤਾਵੇਜ਼ ਲੋੜ ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ।")],
  },
  {
    id: "STC-V22-QL002-T06", qlId: "STC-QL-002", surfaceArchetype: "QUOTED_CLAIM", difficulty: "HARD", answerClass: "ONLY_II",
    dimensions: [
      [T("the head coach", "मुख्य कोच", "ਮੁੱਖ ਕੋਚ"), T("the assistant coach", "सहायक कोच", "ਸਹਾਇਕ ਕੋਚ"), T("the team manager", "टीम प्रबंधक", "ਟੀਮ ਮੈਨੇਜਰ"), T("the match analyst", "मैच विश्लेषक", "ਮੈਚ ਵਿਸ਼ਲੇਸ਼ਕ")],
      [T("our team", "हमारी टीम", "ਸਾਡੀ ਟੀਮ"), T("the side", "टीम", "ਟੀਮ"), T("the players", "खिलाड़ियों", "ਖਿਡਾਰੀਆਂ"), T("the squad", "दल", "ਸਕੁਆਡ")],
      [T("enough clear chances", "पर्याप्त स्पष्ट मौके", "ਕਾਫ਼ੀ ਸਾਫ਼ ਮੌਕੇ"), T("several good chances", "कई अच्छे मौके", "ਕਈ ਚੰਗੇ ਮੌਕੇ"), T("more than enough openings", "पर्याप्त से अधिक मौके", "ਕਾਫ਼ੀ ਤੋਂ ਵੱਧ ਮੌਕੇ"), T("the chances needed to win", "जीतने लायक मौके", "ਜਿੱਤਣ ਲਈ ਲੋੜੀਂਦੇ ਮੌਕੇ")],
      [T("in the second half", "दूसरे हाफ में", "ਦੂਜੇ ਹਾਫ਼ ਵਿੱਚ"), T("during the match", "मैच के दौरान", "ਮੈਚ ਦੌਰਾਨ"), T("in the final period", "अंतिम चरण में", "ਅੰਤਿਮ ਪੜਾਅ ਵਿੱਚ"), T("throughout the contest", "पूरे मुकाबले में", "ਪੂਰੇ ਮੁਕਾਬਲੇ ਦੌਰਾਨ")],
    ],
    statement: T("{a} said, “{b} created {c} {d}, but failed to convert them.”", "{a} ने कहा, “{b} ने {d} {c} बनाए, लेकिन उन्हें गोल में नहीं बदल सके।”", "{a} ਨੇ ਕਿਹਾ, “{b} ਨੇ {d} {c} ਬਣਾਏ, ਪਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੋਲ ਵਿੱਚ ਨਹੀਂ ਬਦਲ ਸਕੇ।”"),
    conclusions: [T("{b} created no scoring chances {d}.", "{b} ने {d} कोई स्कोरिंग मौका नहीं बनाया।", "{b} ਨੇ {d} ਕੋਈ ਸਕੋਰਿੰਗ ਮੌਕਾ ਨਹੀਂ ਬਣਾਇਆ।"), T("According to {a}, converting chances was a problem for {b}.", "{a} के अनुसार {b} के लिए मौकों को भुनाना समस्या थी।", "{a} ਅਨੁਸਾਰ {b} ਲਈ ਮੌਕਿਆਂ ਨੂੰ ਭੁਨਾਉਣਾ ਸਮੱਸਿਆ ਸੀ।")],
    explanation: [T("{a} expressly says {c} were created.", "{a} स्पष्ट रूप से कहता है कि {c} बने थे।", "{a} ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਕਹਿੰਦਾ ਹੈ ਕਿ {c} ਬਣੇ ਸਨ।"), T("The quotation directly identifies failure to convert the chances.", "उद्धरण सीधे मौकों को भुना न पाने की समस्या बताता है।", "ਉਧਰਣ ਸਿੱਧੇ ਮੌਕਿਆਂ ਨੂੰ ਨਾ ਭੁਨਾਉਣ ਦੀ ਸਮੱਸਿਆ ਦੱਸਦਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL002-T07", qlId: "STC-QL-002", surfaceArchetype: "NUMERIC_SNAPSHOT", difficulty: "MEDIUM", answerClass: "BOTH",
    dimensions: [
      [T("the public help desk", "सार्वजनिक सहायता डेस्क", "ਜਨਤਕ ਸਹਾਇਤਾ ਡੈਸਕ"), T("the customer helpline", "ग्राहक हेल्पलाइन", "ਗਾਹਕ ਹੈਲਪਲਾਈਨ"), T("the admissions desk", "प्रवेश सहायता डेस्क", "ਦਾਖ਼ਲਾ ਸਹਾਇਤਾ ਡੈਸਕ"), T("the citizen call centre", "नागरिक कॉल सेंटर", "ਨਾਗਰਿਕ ਕਾਲ ਸੈਂਟਰ")],
      [T("Monday to Tuesday", "सोमवार से मंगलवार", "ਸੋਮਵਾਰ ਤੋਂ ਮੰਗਲਵਾਰ"), T("Tuesday to Wednesday", "मंगलवार से बुधवार", "ਮੰਗਲਵਾਰ ਤੋਂ ਬੁੱਧਵਾਰ"), T("the first day to the second day", "पहले दिन से दूसरे दिन", "ਪਹਿਲੇ ਦਿਨ ਤੋਂ ਦੂਜੇ ਦਿਨ"), T("the morning shift to the afternoon shift", "सुबह की पाली से दोपहर की पाली", "ਸਵੇਰ ਦੀ ਸ਼ਿਫਟ ਤੋਂ ਦੁਪਹਿਰ ਦੀ ਸ਼ਿਫਟ")],
      [T("from 240 to 300", "240 से 300", "240 ਤੋਂ 300"), T("from 320 to 390", "320 से 390", "320 ਤੋਂ 390"), T("from 450 to 520", "450 से 520", "450 ਤੋਂ 520"), T("from 600 to 710", "600 से 710", "600 ਤੋਂ 710")],
      [T("from 36 to 24", "36 से 24", "36 ਤੋਂ 24"), T("from 42 to 30", "42 से 30", "42 ਤੋਂ 30"), T("from 55 to 41", "55 से 41", "55 ਤੋਂ 41"), T("from 68 to 49", "68 से 49", "68 ਤੋਂ 49")],
    ],
    statement: T("At {a}, total calls rose {c} from {b}, while abandoned calls fell {d}.", "{a} में {b} कुल कॉल {c} बढ़ीं, जबकि छोड़ी गई कॉल {d} घटीं।", "{a} ਵਿੱਚ {b} ਕੁੱਲ ਕਾਲਾਂ {c} ਵਧੀਆਂ, ਜਦਕਿ ਛੱਡੀਆਂ ਕਾਲਾਂ {d} ਘਟੀਆਂ।"),
    conclusions: [T("{a} received more calls in the later period of {b}.", "{a} को {b} की बाद वाली अवधि में अधिक कॉल मिलीं।", "{a} ਨੂੰ {b} ਦੀ ਬਾਅਦਲੀ ਮਿਆਦ ਵਿੱਚ ਵੱਧ ਕਾਲਾਂ ਮਿਲੀਆਂ।"), T("The number of abandoned calls at {a} declined over {b}.", "{a} में {b} छोड़ी गई कॉलों की संख्या घटी।", "{a} ਵਿੱਚ {b} ਛੱਡੀਆਂ ਕਾਲਾਂ ਦੀ ਗਿਣਤੀ ਘਟੀ।")],
    explanation: [T("The call total rises {c}.", "कुल कॉल {c} बढ़ती हैं।", "ਕੁੱਲ ਕਾਲਾਂ {c} ਵਧਦੀਆਂ ਹਨ।"), T("Abandoned calls fall {d}.", "छोड़ी गई कॉल {d} घटती हैं।", "ਛੱਡੀਆਂ ਕਾਲਾਂ {d} ਘਟਦੀਆਂ ਹਨ।")],
  },
  {
    id: "STC-V22-QL002-T08", qlId: "STC-QL-002", surfaceArchetype: "EVENT_SEQUENCE", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      [T("the provisional answer key", "अस्थायी उत्तर कुंजी", "ਅਸਥਾਈ ਉੱਤਰ ਕੁੰਜੀ"), T("the draft merit list", "प्रारूप मेरिट सूची", "ਮਸੌਦਾ ਮੇਰਿਟ ਸੂਚੀ"), T("the provisional seniority list", "अस्थायी वरिष्ठता सूची", "ਅਸਥਾਈ ਸੀਨੀਅਰਟੀ ਸੂਚੀ"), T("the preliminary inspection report", "प्रारंभिक निरीक्षण रिपोर्ट", "ਪ੍ਰਾਰੰਭਿਕ ਜਾਂਚ ਰਿਪੋਰਟ")],
      [T("three days", "तीन दिन", "ਤਿੰਨ ਦਿਨ"), T("four days", "चार दिन", "ਚਾਰ ਦਿਨ"), T("five working days", "पाँच कार्यदिवस", "ਪੰਜ ਕੰਮਕਾਜੀ ਦਿਨ"), T("one week", "एक सप्ताह", "ਇੱਕ ਹਫ਼ਤਾ")],
      [T("the final result", "अंतिम परिणाम", "ਅੰਤਿਮ ਨਤੀਜਾ"), T("the final list", "अंतिम सूची", "ਅੰਤਿਮ ਸੂਚੀ"), T("the confirmed order", "पुष्ट आदेश", "ਪੁਸ਼ਟੀ ਕੀਤਾ ਹੁਕਮ"), T("the final report", "अंतिम रिपोर्ट", "ਅੰਤਿਮ ਰਿਪੋਰਟ")],
      [T("the examination authority", "परीक्षा प्राधिकरण", "ਪਰੀਖਿਆ ਅਥਾਰਟੀ"), T("the selection board", "चयन बोर्ड", "ਚੋਣ ਬੋਰਡ"), T("the department", "विभाग", "ਵਿਭਾਗ"), T("the inspection committee", "निरीक्षण समिति", "ਜਾਂਚ ਕਮੇਟੀ")],
    ],
    statement: T("{d} released {a} first, invited objections for {b}, and prepared {c} only after examining the objections received in time.", "{d} ने पहले {a} जारी की, {b} तक आपत्तियाँ आमंत्रित कीं और समय पर मिली आपत्तियों की जाँच के बाद ही {c} तैयार किया।", "{d} ਨੇ ਪਹਿਲਾਂ {a} ਜਾਰੀ ਕੀਤੀ, {b} ਲਈ ਐਤਰਾਜ਼ ਮੰਗੇ ਅਤੇ ਸਮੇਂ ਸਿਰ ਮਿਲੇ ਐਤਰਾਜ਼ਾਂ ਦੀ ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਹੀ {c} ਤਿਆਰ ਕੀਤਾ।"),
    conclusions: [T("{c} was prepared before {a} was released.", "{c}, {a} जारी होने से पहले तैयार किया गया।", "{c}, {a} ਜਾਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਤਿਆਰ ਕੀਤਾ ਗਿਆ।"), T("Objections were invited only after {c} had been prepared.", "आपत्तियाँ {c} तैयार होने के बाद ही आमंत्रित की गईं।", "ਐਤਰਾਜ਼ {c} ਤਿਆਰ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਮੰਗੇ ਗਏ।")],
    explanation: [T("The sequence expressly places {a} first and {c} later.", "क्रम में {a} पहले और {c} बाद में है।", "ਕ੍ਰਮ ਵਿੱਚ {a} ਪਹਿਲਾਂ ਅਤੇ {c} ਬਾਅਦ ਵਿੱਚ ਹੈ।"), T("The objection period comes before preparation of {c}.", "आपत्ति अवधि {c} की तैयारी से पहले आती है।", "ਐਤਰਾਜ਼ ਮਿਆਦ {c} ਦੀ ਤਿਆਰੀ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦੀ ਹੈ।")],
  },
] as const;
