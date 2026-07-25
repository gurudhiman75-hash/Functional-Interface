import { applyAvg001Cp003ExplanationAuthorship } from "./cp003-explanation-authorship";
import type { Avg001QuestionPackage } from "./types";

type Lang = "en" | "hi" | "pa";
type AuthoredExplanation = {
  opening: string;
  method: string;
  conclusion: string;
};

const EN: Record<number, AuthoredExplanation> = {
  156: {
    opening: "Correcting one recorded test score leaves the number of tests unchanged; only the marks total is revised.",
    method: "Rebuild the earlier marks total, remove the incorrect entry, insert the corrected score, and divide by the same test count.",
    conclusion: "Therefore, the corrected average score is {answer}.",
  },
  394: {
    opening: "The new student's marks lie above the old class average, and that surplus produces the stated rise across the enlarged class.",
    method: "Divide the entrant's surplus marks by the rise in average to obtain the new class strength, then exclude the entrant.",
    conclusion: "Thus, the class originally had {answer} students.",
  },
  395: {
    opening: "The incoming player scores above the former team average, so the extra runs account for the increase across the expanded squad.",
    method: "Convert the joining player's run surplus into the enlarged squad size, then subtract the newly added player.",
    conclusion: "Hence, the original team contained {answer} players.",
  },
  396: {
    opening: "The added worker produces more than the earlier per-worker average, and that excess raises the average of the larger workforce.",
    method: "Use output surplus divided by average increase to find the expanded worker count, then remove the newcomer.",
    conclusion: "Therefore, the workforce initially had {answer} workers.",
  },
  397: {
    opening: "The new machine contributes output above the old machine average; that additional production is shared by the enlarged machine set.",
    method: "Translate the new machine's excess output into the post-addition count and then take away its own place.",
    conclusion: "So, there were {answer} machines before the addition.",
  },
  398: {
    opening: "The rise in class average is funded entirely by the admitted student's marks above the previous average.",
    method: "First obtain the class strength after admission from surplus divided by rise; one less gives the earlier strength.",
    conclusion: "Accordingly, the original class strength was {answer}.",
  },
  399: {
    opening: "Every part of the higher team average comes from the joining player's score above the old benchmark.",
    method: "The ratio of the player's excess runs to the average increase gives the new squad; deduct one for the entrant.",
    conclusion: "Therefore, the team originally had {answer} players.",
  },
  400: {
    opening: "The departing student's marks are below the old class average, so removing that deficit lifts the average of those who remain.",
    method: "Divide the student's shortfall by the increase in average to get the remaining class size, then restore the student who left.",
    conclusion: "Thus, the class had {answer} students before the departure.",
  },
  401: {
    opening: "The player who leaves scored below the former team average; taking away that shortfall increases the smaller squad's average.",
    method: "Use run deficit divided by average rise for the remaining squad and then add back the departing player.",
    conclusion: "Hence, the original squad consisted of {answer} players.",
  },
  402: {
    opening: "The leaving worker's output is below the old workforce average, and removing that low contribution raises the remaining average.",
    method: "Find the workforce left behind from output gap divided by average change, then include the worker who departed.",
    conclusion: "Therefore, the workforce originally contained {answer} workers.",
  },
  403: {
    opening: "The removed machine produces less than the previous machine average, so its removal improves the average output of the machines left.",
    method: "Turn the removed machine's output gap into the remaining machine count and then restore that machine.",
    conclusion: "So, the plant originally had {answer} machines.",
  },
  404: {
    opening: "Excluding a below-average student's score eliminates a marks deficit and redistributes it as the stated gain among the remaining students.",
    method: "The deficit-to-rise ratio yields the post-departure class strength; adding the excluded student recovers the original strength.",
    conclusion: "Accordingly, the class originally contained {answer} students.",
  },
  405: {
    opening: "Removing the departing player's below-average performance eliminates a run shortfall from the team total.",
    method: "Divide that shortfall by the increase enjoyed by the remaining squad and then put back the player who left.",
    conclusion: "Therefore, the team started with {answer} players.",
  },
};

const HI: Record<number, AuthoredExplanation> = {
  156: {
    opening: "एक दर्ज परीक्षा-अंक को सुधारने पर परीक्षाओं की संख्या वही रहती है; केवल कुल अंक बदलते हैं।",
    method: "पुराना कुल अंक निकालें, गलत प्रविष्टि घटाएँ, सही अंक जोड़ें और उसी परीक्षा-संख्या से भाग दें।",
    conclusion: "अतः संशोधित औसत अंक {answer} है।",
  },
  394: {
    opening: "नए विद्यार्थी के अंक पुराने कक्षा-औसत से अधिक हैं और यही अतिरिक्त अंक बढ़ी हुई कक्षा में दी गई औसत-वृद्धि पैदा करते हैं।",
    method: "विद्यार्थी के अतिरिक्त अंकों को औसत-वृद्धि से भाग देकर प्रवेश के बाद की संख्या पाएँ, फिर नए विद्यार्थी को घटाएँ।",
    conclusion: "अतः कक्षा में प्रारंभ में {answer} विद्यार्थी थे।",
  },
  395: {
    opening: "आने वाले खिलाड़ी का स्कोर पुराने टीम-औसत से अधिक है; उसके अतिरिक्त रन बढ़ी हुई टीम का औसत ऊपर ले जाते हैं।",
    method: "खिलाड़ी के अतिरिक्त रनों को औसत-वृद्धि से भाग देकर नई टीम-संख्या निकालें और फिर जुड़े खिलाड़ी को घटाएँ।",
    conclusion: "अतः मूल टीम में {answer} खिलाड़ी थे।",
  },
  396: {
    opening: "नया कर्मी पुराने प्रति-कर्मी औसत से अधिक उत्पादन करता है और उसका अतिरिक्त उत्पादन बड़े कार्य-दल का औसत बढ़ाता है।",
    method: "उत्पादन-अंतर को औसत-वृद्धि से भाग देकर बढ़े हुए कार्य-दल की संख्या पाएँ, फिर नए कर्मी को घटाएँ।",
    conclusion: "इसलिए प्रारंभ में {answer} कर्मी थे।",
  },
  397: {
    opening: "जोड़ी गई मशीन पुराने मशीन-औसत से अधिक उत्पादन करती है; यही अतिरिक्त उत्पादन बढ़ी हुई मशीन-संख्या में बाँटा जाता है।",
    method: "नई मशीन के अतिरिक्त उत्पादन से जोड़ने के बाद की मशीन-संख्या निकालें और फिर उसी मशीन का एक स्थान घटाएँ।",
    conclusion: "अतः जोड़ने से पहले {answer} मशीनें थीं।",
  },
  398: {
    opening: "कक्षा-औसत में पूरी वृद्धि नए विद्यार्थी के पुराने औसत से अधिक अंकों के कारण हुई है।",
    method: "अतिरिक्त अंकों और औसत-वृद्धि से प्रवेश के बाद की कक्षा-संख्या पाएँ; एक घटाने पर मूल संख्या मिलेगी।",
    conclusion: "इस प्रकार कक्षा की मूल संख्या {answer} थी।",
  },
  399: {
    opening: "टीम-औसत की बढ़ोतरी उस नए खिलाड़ी के अतिरिक्त रनों से पूरी होती है जो पुराने औसत से ऊपर स्कोर करता है।",
    method: "अतिरिक्त रनों को औसत-वृद्धि से भाग देकर नई टीम-संख्या पाएँ और नए खिलाड़ी का एक स्थान घटाएँ।",
    conclusion: "अतः टीम में प्रारंभ में {answer} खिलाड़ी थे।",
  },
  400: {
    opening: "जाने वाले विद्यार्थी के अंक पुराने कक्षा-औसत से कम हैं; यह कम स्कोर हटने पर शेष विद्यार्थियों का औसत बढ़ता है।",
    method: "अंकों की कमी को औसत-वृद्धि से भाग देकर शेष विद्यार्थियों की संख्या पाएँ और जाने वाले विद्यार्थी को वापस जोड़ें।",
    conclusion: "अतः विद्यार्थी के जाने से पहले कक्षा में {answer} विद्यार्थी थे।",
  },
  401: {
    opening: "टीम छोड़ने वाले खिलाड़ी का स्कोर पुराने औसत से कम है; उसका कम स्कोर हटने से छोटी टीम का औसत बढ़ता है।",
    method: "रनों की कमी को औसत-वृद्धि से भाग देकर शेष टीम-संख्या निकालें और जाने वाले खिलाड़ी को जोड़ें।",
    conclusion: "अतः मूल टीम में {answer} खिलाड़ी थे।",
  },
  402: {
    opening: "दल छोड़ने वाले कर्मी का उत्पादन पुराने औसत से कम है; उसे हटाने पर शेष कर्मियों का औसत उत्पादन बढ़ता है।",
    method: "उत्पादन की कमी को औसत-वृद्धि से भाग देकर शेष कर्मी पाएँ और जाने वाले कर्मी को वापस जोड़ें।",
    conclusion: "इसलिए कार्य-दल में प्रारंभ में {answer} कर्मी थे।",
  },
  403: {
    opening: "हटाई गई मशीन पुराने औसत से कम उत्पादन करती है; उसके हटने पर बाकी मशीनों का औसत उत्पादन बढ़ जाता है।",
    method: "उत्पादन-अंतर और औसत-वृद्धि से शेष मशीनों की संख्या निकालें, फिर हटाई गई मशीन वापस जोड़ें।",
    conclusion: "अतः संयंत्र में पहले {answer} मशीनें थीं।",
  },
  404: {
    opening: "औसत से कम अंक वाले विद्यार्थी के जाने पर अंकों की कमी हट जाती है और शेष कक्षा के औसत में दी गई वृद्धि आती है।",
    method: "अंकों की कमी और औसत-वृद्धि से जाने के बाद की कक्षा-संख्या पाएँ, फिर उस विद्यार्थी को जोड़ें।",
    conclusion: "इस प्रकार कक्षा की प्रारंभिक संख्या {answer} थी।",
  },
  405: {
    opening: "जाने वाले खिलाड़ी का स्कोर टीम के पुराने औसत से कम है; उसके हटने पर रनों की कमी टीम के कुल से निकल जाती है।",
    method: "रनों की कमी को शेष टीम की औसत-वृद्धि से भाग दें और जाने वाले खिलाड़ी को वापस जोड़ें।",
    conclusion: "अतः टीम की मूल संख्या {answer} थी।",
  },
};

const PA: Record<number, AuthoredExplanation> = {
  156: {
    opening: "ਇੱਕ ਦਰਜ ਪ੍ਰੀਖਿਆ ਅੰਕ ਠੀਕ ਕਰਨ ਨਾਲ ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ; ਸਿਰਫ਼ ਕੁੱਲ ਅੰਕ ਬਦਲਦੇ ਹਨ।",
    method: "ਪੁਰਾਣੇ ਕੁੱਲ ਅੰਕ ਕੱਢੋ, ਗਲਤ ਦਰਜ ਅੰਕ ਘਟਾਓ, ਸਹੀ ਅੰਕ ਜੋੜੋ ਅਤੇ ਉਸੇ ਪ੍ਰੀਖਿਆ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
    conclusion: "ਇਸ ਲਈ ਸੋਧੀ ਔਸਤ ਅੰਕ {answer} ਹੈ।",
  },
  160: {
    opening: "ਇੱਕ ਦਰਜ ਮੁੱਲ ਦੀ ਬਦਲੀ ਨਾਲ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਬਦਲਦੀ; ਸਿਰਫ਼ ਕੁੱਲ ਵਿੱਚ ਪੁਰਾਣੇ ਅਤੇ ਨਵੇਂ ਮੁੱਲ ਜਿਤਨਾ ਫਰਕ ਪੈਂਦਾ ਹੈ।",
    method: "ਪੁਰਾਣਾ ਕੁੱਲ ਬਣਾਓ, ਪੁਰਾਣਾ ਦਰਜ ਮੁੱਲ ਘਟਾਓ, ਨਵਾਂ ਮੁੱਲ ਜੋੜੋ ਅਤੇ ਉਸੇ ਗਿਣਤੀ ਨਾਲ ਮੁੜ ਔਸਤ ਕੱਢੋ।",
    conclusion: "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਨਵੀਂ ਔਸਤ {answer} ਹੈ।",
  },
  394: {
    opening: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ ਪੁਰਾਣੀ ਜਮਾਤੀ ਔਸਤ ਤੋਂ ਵੱਧ ਹਨ ਅਤੇ ਇਹੀ ਵਾਧੂ ਅੰਕ ਵਧੀ ਜਮਾਤ ਵਿੱਚ ਦਿੱਤਾ ਔਸਤ-ਵਾਧਾ ਪੈਦਾ ਕਰਦੇ ਹਨ।",
    method: "ਵਿਦਿਆਰਥੀ ਦੇ ਵਾਧੂ ਅੰਕਾਂ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਦਾਖਲੇ ਤੋਂ ਬਾਅਦ ਦੀ ਗਿਣਤੀ ਲੱਭੋ, ਫਿਰ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਜਮਾਤ ਵਿੱਚ ਸ਼ੁਰੂ ਤੋਂ {answer} ਵਿਦਿਆਰਥੀ ਸਨ।",
  },
  395: {
    opening: "ਆਉਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ ਪੁਰਾਣੀ ਟੀਮ ਔਸਤ ਤੋਂ ਵੱਧ ਹੈ; ਉਸ ਦੀਆਂ ਵਾਧੂ ਦੌੜਾਂ ਵਧੀ ਟੀਮ ਦੀ ਔਸਤ ਚੁੱਕਦੀਆਂ ਹਨ।",
    method: "ਖਿਡਾਰੀ ਦੀਆਂ ਵਾਧੂ ਦੌੜਾਂ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਨਵੀਂ ਟੀਮ-ਗਿਣਤੀ ਲੱਭੋ ਅਤੇ ਫਿਰ ਸ਼ਾਮਲ ਖਿਡਾਰੀ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਮੂਲ ਟੀਮ ਵਿੱਚ {answer} ਖਿਡਾਰੀ ਸਨ।",
  },
  396: {
    opening: "ਨਵਾਂ ਕਾਮਾ ਪੁਰਾਣੀ ਪ੍ਰਤੀ-ਕਾਮਾ ਔਸਤ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ ਕਰਦਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਵਾਧੂ ਉਤਪਾਦਨ ਵੱਡੇ ਕਾਰਜ-ਦਲ ਦੀ ਔਸਤ ਵਧਾਉਂਦਾ ਹੈ।",
    method: "ਉਤਪਾਦਨ ਦੇ ਫਰਕ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਵਧੇ ਕਾਰਜ-ਦਲ ਦੀ ਗਿਣਤੀ ਲੱਭੋ, ਫਿਰ ਨਵਾਂ ਕਾਮਾ ਘਟਾਓ।",
    conclusion: "ਇਸ ਕਰਕੇ ਸ਼ੁਰੂ ਵਿੱਚ {answer} ਕਾਮੇ ਸਨ।",
  },
  397: {
    opening: "ਜੋੜੀ ਮਸ਼ੀਨ ਪੁਰਾਣੀ ਮਸ਼ੀਨ-ਔਸਤ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ ਕਰਦੀ ਹੈ; ਇਹ ਵਾਧੂ ਉਤਪਾਦਨ ਵਧੀ ਮਸ਼ੀਨ-ਗਿਣਤੀ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।",
    method: "ਨਵੀਂ ਮਸ਼ੀਨ ਦੇ ਵਾਧੂ ਉਤਪਾਦਨ ਤੋਂ ਜੋੜ ਮਗਰੋਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ ਅਤੇ ਫਿਰ ਉਸ ਮਸ਼ੀਨ ਦਾ ਇੱਕ ਸਥਾਨ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਜੋੜ ਤੋਂ ਪਹਿਲਾਂ {answer} ਮਸ਼ੀਨਾਂ ਸਨ।",
  },
  398: {
    opening: "ਜਮਾਤੀ ਔਸਤ ਦਾ ਸਾਰਾ ਵਾਧਾ ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਵੱਧ ਅੰਕਾਂ ਨਾਲ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।",
    method: "ਵਾਧੂ ਅੰਕਾਂ ਅਤੇ ਔਸਤ-ਵਾਧੇ ਤੋਂ ਦਾਖਲੇ ਮਗਰੋਂ ਦੀ ਜਮਾਤੀ ਗਿਣਤੀ ਲੱਭੋ; ਇੱਕ ਘਟਾਉਣ ਨਾਲ ਮੂਲ ਗਿਣਤੀ ਮਿਲੇਗੀ।",
    conclusion: "ਇਸ ਤਰ੍ਹਾਂ ਜਮਾਤ ਦੀ ਮੂਲ ਗਿਣਤੀ {answer} ਸੀ।",
  },
  399: {
    opening: "ਟੀਮ ਔਸਤ ਦੀ ਚੜ੍ਹਤ ਉਸ ਨਵੇਂ ਖਿਡਾਰੀ ਦੀਆਂ ਵਾਧੂ ਦੌੜਾਂ ਨਾਲ ਪੂਰੀ ਹੁੰਦੀ ਹੈ ਜੋ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਉੱਪਰ ਸਕੋਰ ਕਰਦਾ ਹੈ।",
    method: "ਵਾਧੂ ਦੌੜਾਂ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਨਵੀਂ ਟੀਮ-ਗਿਣਤੀ ਲੱਭੋ ਅਤੇ ਨਵੇਂ ਖਿਡਾਰੀ ਦਾ ਇੱਕ ਸਥਾਨ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਟੀਮ ਵਿੱਚ ਸ਼ੁਰੂ ਤੋਂ {answer} ਖਿਡਾਰੀ ਸਨ।",
  },
  400: {
    opening: "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ ਪੁਰਾਣੀ ਜਮਾਤੀ ਔਸਤ ਤੋਂ ਘੱਟ ਹਨ; ਇਹ ਘੱਟ ਸਕੋਰ ਹਟਣ ਨਾਲ ਬਾਕੀ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਔਸਤ ਵਧਦੀ ਹੈ।",
    method: "ਅੰਕਾਂ ਦੀ ਘਾਟ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਵਿਦਿਆਰਥੀ ਲੱਭੋ ਅਤੇ ਜਾਣ ਵਾਲਾ ਵਿਦਿਆਰਥੀ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਵਿਦਿਆਰਥੀ ਦੇ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਮਾਤ ਵਿੱਚ {answer} ਵਿਦਿਆਰਥੀ ਸਨ।",
  },
  401: {
    opening: "ਟੀਮ ਛੱਡਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਘੱਟ ਹੈ; ਉਸ ਦਾ ਘੱਟ ਸਕੋਰ ਹਟਣ ਨਾਲ ਛੋਟੀ ਟੀਮ ਦੀ ਔਸਤ ਵਧਦੀ ਹੈ।",
    method: "ਦੌੜਾਂ ਦੀ ਘਾਟ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਟੀਮ-ਗਿਣਤੀ ਕੱਢੋ ਅਤੇ ਜਾਣ ਵਾਲਾ ਖਿਡਾਰੀ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਮੂਲ ਟੀਮ ਵਿੱਚ {answer} ਖਿਡਾਰੀ ਸਨ।",
  },
  402: {
    opening: "ਦਲ ਛੱਡਣ ਵਾਲੇ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਘੱਟ ਹੈ; ਉਸ ਨੂੰ ਹਟਾਉਣ ਨਾਲ ਬਾਕੀ ਕਾਮਿਆਂ ਦੀ ਔਸਤ ਵਧਦੀ ਹੈ।",
    method: "ਉਤਪਾਦਨ ਦੀ ਘਾਟ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਕਾਮੇ ਲੱਭੋ ਅਤੇ ਜਾਣ ਵਾਲਾ ਕਾਮਾ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਕਰਕੇ ਕਾਰਜ-ਦਲ ਵਿੱਚ ਪਹਿਲਾਂ {answer} ਕਾਮੇ ਸਨ।",
  },
  403: {
    opening: "ਹਟਾਈ ਮਸ਼ੀਨ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਘੱਟ ਉਤਪਾਦਨ ਕਰਦੀ ਹੈ; ਉਸ ਦੇ ਹਟਣ ਨਾਲ ਬਾਕੀ ਮਸ਼ੀਨਾਂ ਦੀ ਔਸਤ ਵਧ ਜਾਂਦੀ ਹੈ।",
    method: "ਉਤਪਾਦਨ-ਫਰਕ ਅਤੇ ਔਸਤ-ਵਾਧੇ ਤੋਂ ਬਾਕੀ ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਹਟਾਈ ਮਸ਼ੀਨ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਪਲਾਂਟ ਵਿੱਚ ਪਹਿਲਾਂ {answer} ਮਸ਼ੀਨਾਂ ਸਨ।",
  },
  404: {
    opening: "ਔਸਤ ਤੋਂ ਘੱਟ ਅੰਕ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ ਜਾਣ ਨਾਲ ਅੰਕਾਂ ਦੀ ਘਾਟ ਹਟਦੀ ਹੈ ਅਤੇ ਬਾਕੀ ਜਮਾਤ ਦੀ ਔਸਤ ਵਿੱਚ ਦਿੱਤਾ ਵਾਧਾ ਆਉਂਦਾ ਹੈ।",
    method: "ਅੰਕਾਂ ਦੀ ਘਾਟ ਅਤੇ ਔਸਤ-ਵਾਧੇ ਤੋਂ ਜਾਣ ਮਗਰੋਂ ਦੀ ਜਮਾਤੀ ਗਿਣਤੀ ਲੱਭੋ, ਫਿਰ ਉਹ ਵਿਦਿਆਰਥੀ ਜੋੜੋ।",
    conclusion: "ਇਸ ਤਰ੍ਹਾਂ ਜਮਾਤ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ {answer} ਸੀ।",
  },
  405: {
    opening: "ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ ਟੀਮ ਦੀ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਘੱਟ ਹੈ; ਉਸ ਦੇ ਹਟਣ ਨਾਲ ਦੌੜਾਂ ਦੀ ਘਾਟ ਟੀਮ ਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਨਿਕਲ ਜਾਂਦੀ ਹੈ।",
    method: "ਦੌੜਾਂ ਦੀ ਘਾਟ ਨੂੰ ਬਾਕੀ ਟੀਮ ਦੇ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਜਾਣ ਵਾਲਾ ਖਿਡਾਰੀ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਟੀਮ ਦੀ ਮੂਲ ਗਿਣਤੀ {answer} ਸੀ।",
  },
};

function authoredFor(pkg: Avg001QuestionPackage, lang: Lang) {
  const id = Number(pkg.questionLanguageId.slice(-3));
  return (lang === "en" ? EN : lang === "hi" ? HI : PA)[id];
}

export function applyAvg001Cp003ExplanationAuthorshipV3(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const base = applyAvg001Cp003ExplanationAuthorship(pkg);
  if (base.canonicalProblemId !== "AVG-CP-003") return base;

  const lang: Lang = base.language === "hi" || base.language === "pa" ? base.language : "en";
  const authored = authoredFor(base, lang);
  if (!authored) return base;

  const arithmetic = base.explanation.lines.filter((line) => line.includes("$$"));
  const working = arithmetic.length ? arithmetic : [base.reasoningEvidence.decisiveCalculation];
  const lines = [
    authored.opening,
    authored.method,
    ...working.slice(0, 4),
    authored.conclusion.replace("{answer}", String(base.answer)),
  ].filter(Boolean).slice(0, 8);

  return {
    ...base,
    explanation: { lines },
    traceability: {
      ...base.traceability,
      cp003ExplanationAuthorship: "AVG-CP-003 context-authored explanations v3",
      cp003ExplanationVariant: Number(base.questionLanguageId.slice(-3)),
    },
  };
}
