import type { Avg001QuestionPackage } from "./types";

type Language = "en" | "hi" | "pa";
type ProsePair = Record<Language, readonly [string, string]>;

const SPECIAL_PROSE: Record<string, ProsePair> = {
  "AVG-QL-156": {
    en: [
      "This is a correction to one recorded measurement, not a change in the number of measurements.",
      "Remove the erroneous reading from the old measurement total, insert the corrected reading, and keep the same divisor.",
    ],
    hi: [
      "यह दर्ज किए गए एक माप का सुधार है; मापों की संख्या नहीं बदलती।",
      "पुराने माप-कुल में से गलत प्रविष्टि हटाकर सही माप जोड़ें और उसी संख्या से औसत निकालें।",
    ],
    pa: [
      "ਇਹ ਦਰਜ ਕੀਤੇ ਇੱਕ ਮਾਪ ਦੀ ਸੋਧ ਹੈ; ਮਾਪਾਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਬਦਲਦੀ।",
      "ਪੁਰਾਣੇ ਮਾਪ-ਕੁੱਲ ਵਿੱਚੋਂ ਗਲਤ ਦਰਜ ਮਾਪ ਹਟਾ ਕੇ ਸਹੀ ਮਾਪ ਜੋੜੋ ਅਤੇ ਉਸੇ ਗਿਣਤੀ ਨਾਲ ਔਸਤ ਕੱਢੋ।",
    ],
  },
  "AVG-QL-160": {
    en: [
      "One observation is deliberately exchanged for another, so the data-set size remains fixed.",
      "Adjust the observation total by the replacement difference, then divide by the unchanged count.",
    ],
    hi: [
      "एक प्रेक्षण के स्थान पर दूसरा प्रेक्षण रखा गया है, इसलिए समूह की संख्या स्थिर रहेगी।",
      "दोनों प्रेक्षणों के अंतर से कुल को समायोजित करें और अपरिवर्तित संख्या से भाग दें।",
    ],
    pa: [
      "ਇੱਕ ਦਰਜ ਮੁੱਲ ਦੀ ਥਾਂ ਦੂਜਾ ਮੁੱਲ ਰੱਖਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਸਥਿਰ ਰਹੇਗੀ।",
      "ਦੋਵੇਂ ਮੁੱਲਾਂ ਦੇ ਅੰਤਰ ਨਾਲ ਕੁੱਲ ਨੂੰ ਠੀਕ ਕਰੋ ਅਤੇ ਨਾ ਬਦਲੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
    ],
  },
  "AVG-QL-394": {
    en: [
      "The new student's marks exceed the old class average, and that excess finances the rise across the enlarged class.",
      "Divide the excess marks by the rise per student to get the new class size, then exclude the entrant.",
    ],
    hi: [
      "नए विद्यार्थी के अंक पुराने कक्षा-औसत से अधिक हैं और यही अतिरिक्त अंक बढ़ी हुई कक्षा में औसत-वृद्धि पूरी करते हैं।",
      "अतिरिक्त अंकों को प्रति विद्यार्थी वृद्धि से भाग देने पर नई कक्षा की संख्या मिलती है; उसमें से नए विद्यार्थी को घटाएँ।",
    ],
    pa: [
      "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ ਪੁਰਾਣੀ ਜਮਾਤੀ ਔਸਤ ਤੋਂ ਵੱਧ ਹਨ ਅਤੇ ਇਹੀ ਵਾਧੂ ਅੰਕ ਵਧੀ ਜਮਾਤ ਵਿੱਚ ਔਸਤ-ਵਾਧਾ ਪੂਰਾ ਕਰਦੇ ਹਨ।",
      "ਵਾਧੂ ਅੰਕਾਂ ਨੂੰ ਪ੍ਰਤੀ ਵਿਦਿਆਰਥੀ ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਨਵੀਂ ਜਮਾਤ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਨੂੰ ਘਟਾਓ।",
    ],
  },
  "AVG-QL-395": {
    en: [
      "The incoming player's score is above the former team average; its surplus is shared as the stated increase.",
      "Use surplus score divided by average gain to recover the enlarged squad, then remove the incoming player.",
    ],
    hi: [
      "आने वाले खिलाड़ी का स्कोर पुराने टीम-औसत से अधिक है; उसकी बढ़त ही बताई गई औसत-वृद्धि के रूप में बँटती है।",
      "स्कोर की बढ़त को औसत-वृद्धि से भाग देकर बढ़ी हुई टीम की संख्या निकालें, फिर नए खिलाड़ी को घटाएँ।",
    ],
    pa: [
      "ਆਉਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ ਪੁਰਾਣੀ ਟੀਮ ਔਸਤ ਤੋਂ ਵੱਧ ਹੈ; ਉਸ ਦੀ ਵਧਤ ਹੀ ਦਿੱਤੇ ਔਸਤ-ਵਾਧੇ ਵਜੋਂ ਵੰਡੀ ਜਾਂਦੀ ਹੈ।",
      "ਸਕੋਰ ਦੀ ਵਧਤ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਵਧੀ ਟੀਮ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਨਵੇਂ ਖਿਡਾਰੀ ਨੂੰ ਘਟਾਓ।",
    ],
  },
  "AVG-QL-398": {
    en: [
      "Let the original class contain n students; after admission, the count is n + 1.",
      "Balance the totals with n × old average + entrant's marks = (n + 1) × new average, then solve for n.",
    ],
    hi: [
      "मूल कक्षा में विद्यार्थियों की संख्या n मानें; प्रवेश के बाद संख्या n + 1 होगी।",
      "n × पुराना औसत + नए विद्यार्थी के अंक = (n + 1) × नया औसत लिखकर n ज्ञात करें।",
    ],
    pa: [
      "ਮੂਲ ਜਮਾਤ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ n ਮੰਨੋ; ਦਾਖਲੇ ਤੋਂ ਬਾਅਦ ਗਿਣਤੀ n + 1 ਹੋਵੇਗੀ।",
      "n × ਪੁਰਾਣੀ ਔਸਤ + ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ = (n + 1) × ਨਵੀਂ ਔਸਤ ਲਿਖ ਕੇ n ਕੱਢੋ।",
    ],
  },
  "AVG-QL-399": {
    en: [
      "Represent the original team size by n, so the joined team has n + 1 players.",
      "Equate the old score total plus the new player's score to the revised team total and isolate n.",
    ],
    hi: [
      "टीम में खिलाड़ियों की मूल संख्या n मानें, इसलिए खिलाड़ी जुड़ने के बाद संख्या n + 1 होगी।",
      "पुराने कुल स्कोर में नए खिलाड़ी का स्कोर जोड़कर उसे संशोधित टीम-कुल के बराबर रखें और n निकालें।",
    ],
    pa: [
      "ਟੀਮ ਵਿੱਚ ਖਿਡਾਰੀਆਂ ਦੀ ਮੂਲ ਗਿਣਤੀ n ਮੰਨੋ, ਇਸ ਲਈ ਖਿਡਾਰੀ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਗਿਣਤੀ n + 1 ਹੋਵੇਗੀ।",
      "ਪੁਰਾਣੇ ਕੁੱਲ ਸਕੋਰ ਵਿੱਚ ਨਵੇਂ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ ਜੋੜ ਕੇ ਉਸ ਨੂੰ ਸੋਧੇ ਟੀਮ-ਕੁੱਲ ਦੇ ਬਰਾਬਰ ਰੱਖੋ ਅਤੇ n ਕੱਢੋ।",
    ],
  },
  "AVG-QL-400": {
    en: [
      "The departing student's marks differ from the old class average, and that gap causes the change among those left.",
      "Divide the marks gap by the average change to obtain the remaining class size, then restore the departing student.",
    ],
    hi: [
      "जाने वाले विद्यार्थी के अंक पुराने कक्षा-औसत से जितने अलग हैं, वही अंतर शेष विद्यार्थियों के औसत में परिवर्तन लाता है।",
      "अंकों के अंतर को औसत-परिवर्तन से भाग देकर शेष कक्षा की संख्या निकालें, फिर जाने वाले विद्यार्थी को वापस जोड़ें।",
    ],
    pa: [
      "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ ਪੁਰਾਣੀ ਜਮਾਤੀ ਔਸਤ ਤੋਂ ਜਿੰਨੇ ਵੱਖ ਹਨ, ਉਹੀ ਅੰਤਰ ਬਾਕੀ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਔਸਤ ਬਦਲਦਾ ਹੈ।",
      "ਅੰਕਾਂ ਦੇ ਅੰਤਰ ਨੂੰ ਔਸਤ-ਬਦਲਾਅ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਜਮਾਤ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਨੂੰ ਵਾਪਸ ਜੋੜੋ।",
    ],
  },
  "AVG-QL-401": {
    en: [
      "The leaving player's score is displaced from the former team average; that displacement is redistributed over the smaller team.",
      "Use score gap divided by average movement to find the remaining players, then add the departing player back.",
    ],
    hi: [
      "जाने वाले खिलाड़ी का स्कोर पुराने टीम-औसत से अलग है और यही अंतर छोटी टीम में पुनः वितरित होता है।",
      "स्कोर-अंतर को औसत-परिवर्तन से भाग देकर शेष खिलाड़ियों की संख्या निकालें, फिर जाने वाले खिलाड़ी को जोड़ें।",
    ],
    pa: [
      "ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ ਪੁਰਾਣੀ ਟੀਮ ਔਸਤ ਤੋਂ ਵੱਖ ਹੈ ਅਤੇ ਇਹੀ ਅੰਤਰ ਛੋਟੀ ਟੀਮ ਵਿੱਚ ਮੁੜ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।",
      "ਸਕੋਰ-ਅੰਤਰ ਨੂੰ ਔਸਤ-ਬਦਲਾਅ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਖਿਡਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ ਨੂੰ ਜੋੜੋ।",
    ],
  },
  "AVG-QL-404": {
    en: [
      "Let the class originally contain n students; after one leaves, n - 1 students remain.",
      "Set n × old average - departing marks equal to (n - 1) × new average and solve the resulting equation.",
    ],
    hi: [
      "कक्षा में विद्यार्थियों की मूल संख्या n मानें; एक विद्यार्थी के जाने पर n - 1 विद्यार्थी बचेंगे।",
      "n × पुराना औसत - जाने वाले विद्यार्थी के अंक = (n - 1) × नया औसत लिखकर समीकरण हल करें।",
    ],
    pa: [
      "ਜਮਾਤ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਮੂਲ ਗਿਣਤੀ n ਮੰਨੋ; ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੇ ਜਾਣ ਉੱਤੇ n - 1 ਵਿਦਿਆਰਥੀ ਬਚਣਗੇ।",
      "n × ਪੁਰਾਣੀ ਔਸਤ - ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ = (n - 1) × ਨਵੀਂ ਔਸਤ ਲਿਖ ਕੇ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।",
    ],
  },
  "AVG-QL-405": {
    en: [
      "Take n as the original number of players, leaving n - 1 in the team after departure.",
      "Balance original team total minus the outgoing score with the new total of the reduced team, then determine n.",
    ],
    hi: [
      "खिलाड़ियों की मूल संख्या n मानें; एक खिलाड़ी के जाने के बाद टीम में n - 1 खिलाड़ी रहेंगे।",
      "मूल टीम-कुल में से जाने वाला स्कोर घटाकर उसे छोटी टीम के नए कुल के बराबर रखें और n ज्ञात करें।",
    ],
    pa: [
      "ਖਿਡਾਰੀਆਂ ਦੀ ਮੂਲ ਗਿਣਤੀ n ਮੰਨੋ; ਇੱਕ ਖਿਡਾਰੀ ਦੇ ਜਾਣ ਤੋਂ ਬਾਅਦ ਟੀਮ ਵਿੱਚ n - 1 ਖਿਡਾਰੀ ਰਹਿਣਗੇ।",
      "ਮੂਲ ਟੀਮ-ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣ ਵਾਲਾ ਸਕੋਰ ਘਟਾ ਕੇ ਉਸ ਨੂੰ ਛੋਟੀ ਟੀਮ ਦੇ ਨਵੇਂ ਕੁੱਲ ਦੇ ਬਰਾਬਰ ਰੱਖੋ ਅਤੇ n ਕੱਢੋ।",
    ],
  },
};

export function applyAvg001Cp003ExplanationFinalPolish(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003") return pkg;
  const prose = SPECIAL_PROSE[pkg.questionLanguageId];
  if (!prose) return pkg;

  const language: Language = pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
  const lines = [...pkg.explanation.lines];
  lines[0] = prose[language][0];
  lines[1] = prose[language][1];
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      cp003ExplanationFinalPolish: "AVG-CP-003 manually differentiated prose v1",
    },
  };
}
