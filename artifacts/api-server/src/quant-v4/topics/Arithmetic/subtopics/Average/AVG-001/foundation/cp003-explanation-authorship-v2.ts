import { applyAvg001Cp003ExplanationAuthorship } from "./cp003-explanation-authorship";
import type { Avg001QuestionPackage } from "./types";

type Lang = "en" | "hi" | "pa";
type AuthoredPair = { opening: string; method: string; conclusion: string };

function isArithmetic(line: string) {
  return /\$\$|\\times|\\div|×|÷|(?:^|\s)(?:Old|New|Current|Required|Remaining|Target|Total|Difference|Value gap|Excess value)\b/i.test(line)
    || /(?:पुराना|नया|वर्तमान|लक्षित|बचा हुआ|कुल परिवर्तन|मान-अंतर|अतिरिक्त मान|प्रारंभिक संख्या)/.test(line)
    || /(?:ਪੁਰਾਣਾ|ਨਵਾਂ|ਮੌਜੂਦਾ|ਲਕਸ਼ਿਤ|ਬਚਿਆ|ਕੁੱਲ ਬਦਲਾਅ|ਮੁੱਲ-ਅੰਤਰ|ਵਾਧੂ ਮੁੱਲ|ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ)/.test(line);
}

const EN: Record<number, AuthoredPair> = {
  156: {
    opening: "Because one recorded test score is corrected, the number of scores stays unchanged.",
    method: "Recover the old marks total, subtract the incorrect score, add the corrected score, and divide by the same number of tests.",
    conclusion: "Therefore, the corrected average score is {answer}.",
  },
  394: {
    opening: "The new student's 48 marks exceed the old class average by 18 marks, and that surplus creates a two-mark rise across the enlarged class.",
    method: "Divide the 18-mark surplus by the two-mark rise to get the new class size, then remove the newly admitted student.",
    conclusion: "Thus, the class originally had {answer} students.",
  },
  395: {
    opening: "The incoming player's 48 runs are 18 above the former team average, so those extra runs account for the rise in every place of the new squad.",
    method: "Use surplus divided by average increase to obtain the enlarged squad, then subtract the joining player.",
    conclusion: "Hence, the original team contained {answer} players.",
  },
  396: {
    opening: "The new worker produces 18 units more than the earlier per-worker average, and this excess raises the average of the expanded workforce by two units.",
    method: "Convert the output excess into the enlarged worker count, then exclude the newly added worker.",
    conclusion: "Therefore, the workforce initially had {answer} workers.",
  },
  397: {
    opening: "The added machine contributes 18 units above the old machine average; that extra output is spread over the enlarged set of machines.",
    method: "Divide the added output above average by the two-unit rise and then remove the new machine's place.",
    conclusion: "So, there were {answer} machines before the addition.",
  },
  398: {
    opening: "A two-mark increase in the class average means the new student's excess marks have been shared equally across all students after admission.",
    method: "First find the post-admission class strength from the student's excess over 30, then deduct one for the entrant.",
    conclusion: "Accordingly, the original class strength was {answer}.",
  },
  399: {
    opening: "The two-run rise is funded entirely by the joining player's score above the old team average.",
    method: "The ratio of the 18-run excess to the two-run rise gives the new squad size; one less gives the old squad.",
    conclusion: "Therefore, the team originally had {answer} players.",
  },
  400: {
    opening: "The departing student's 26 marks are 14 below the old class average, so removing that deficit raises the average of those who remain.",
    method: "Divide the 14-mark deficit by the two-mark rise to obtain the remaining class size, then restore the student who left.",
    conclusion: "Thus, the class had {answer} students before the departure.",
  },
  401: {
    opening: "The player who leaves scored 14 runs below the former team average; taking away that shortfall increases the average of the smaller squad.",
    method: "Use deficit divided by average rise for the remaining squad, then add back the departing player.",
    conclusion: "Hence, the original squad consisted of {answer} players.",
  },
  402: {
    opening: "The leaving worker's output is 14 units below the old workforce average, and removing that low output lifts the average of the remaining workers.",
    method: "Find the remaining worker count from the output gap and then add one for the worker who left.",
    conclusion: "Therefore, the workforce originally contained {answer} workers.",
  },
  403: {
    opening: "The removed machine produces 14 units less than the previous machine average, so its removal raises the average output of the machines left behind.",
    method: "Translate the 14-unit gap and two-unit rise into the remaining machine count, then restore the removed machine.",
    conclusion: "So, the plant originally had {answer} machines.",
  },
  404: {
    opening: "When a below-average score of 26 is removed, the missing 14 marks are redistributed as a two-mark gain among the students who remain.",
    method: "The deficit-to-rise ratio gives the post-departure class strength; adding the excluded student gives the original strength.",
    conclusion: "Accordingly, the class originally contained {answer} students.",
  },
  405: {
    opening: "Removing the 26-run performance eliminates a 14-run shortfall relative to the old team average.",
    method: "Divide that shortfall by the two-run increase for the remaining squad and then put back the player who departed.",
    conclusion: "Therefore, the team started with {answer} players.",
  },
};

const HI: Record<number, AuthoredPair> = {
  156: {
    opening: "एक परीक्षा-अंक को सुधारने पर अंकों की संख्या नहीं बदलती; केवल कुल अंक बदलते हैं।",
    method: "पुराना कुल अंक निकालें, गलत अंक घटाएँ, सही अंक जोड़ें और उसी परीक्षा-संख्या से भाग दें।",
    conclusion: "अतः संशोधित औसत अंक {answer} है।",
  },
  394: {
    opening: "नए विद्यार्थी के 48 अंक पुराने कक्षा-औसत से 18 अधिक हैं और यही अतिरिक्त 18 अंक बढ़ी हुई कक्षा में प्रति विद्यार्थी 2 अंक की वृद्धि करते हैं।",
    method: "18 को 2 से भाग देकर प्रवेश के बाद विद्यार्थियों की संख्या पाएँ, फिर नए विद्यार्थी को घटाएँ।",
    conclusion: "अतः कक्षा में प्रारंभ में {answer} विद्यार्थी थे।",
  },
  395: {
    opening: "आने वाले खिलाड़ी के 48 रन पुराने टीम-औसत से 18 अधिक हैं; यही अतिरिक्त रन नई टीम के प्रत्येक स्थान पर 2 रन की वृद्धि पूरी करते हैं।",
    method: "अतिरिक्त 18 रन को औसत-वृद्धि 2 से भाग दें और फिर जुड़े हुए खिलाड़ी को घटाएँ।",
    conclusion: "अतः मूल टीम में {answer} खिलाड़ी थे।",
  },
  396: {
    opening: "नया कर्मी पुराने प्रति-कर्मी औसत से 18 इकाइयाँ अधिक उत्पादन करता है और यह अतिरिक्त उत्पादन बढ़े हुए कार्य-दल का औसत 2 इकाइयाँ बढ़ाता है।",
    method: "उत्पादन-अंतर को औसत-वृद्धि से भाग देकर नई कर्मी-संख्या पाएँ, फिर नए कर्मी को घटाएँ।",
    conclusion: "इसलिए प्रारंभ में {answer} कर्मी थे।",
  },
  397: {
    opening: "जोड़ी गई मशीन पुराने औसत से 18 इकाइयाँ अधिक बनाती है; यह अतिरिक्त उत्पादन सभी मशीनों में बाँटने पर औसत 2 इकाइयाँ बढ़ता है।",
    method: "18 को 2 से भाग देकर जोड़ने के बाद मशीनों की संख्या निकालें और नई मशीन का एक स्थान घटाएँ।",
    conclusion: "अतः जोड़ने से पहले {answer} मशीनें थीं।",
  },
  398: {
    opening: "कक्षा के औसत में 2 अंक की वृद्धि नए विद्यार्थी के पुराने औसत से अधिक अंकों को प्रवेश के बाद पूरी कक्षा में बाँटने से हुई है।",
    method: "पहले 48 और 30 का अंतर लेकर प्रवेश के बाद की कक्षा-संख्या निकालें, फिर एक विद्यार्थी घटाएँ।",
    conclusion: "इस प्रकार कक्षा की मूल संख्या {answer} थी।",
  },
  399: {
    opening: "टीम के औसत में 2 रन की बढ़ोतरी केवल उस खिलाड़ी के अतिरिक्त रनों से हुई है जो पुराने औसत से ऊपर स्कोर करता है।",
    method: "18 रन की बढ़त को 2 रन की औसत-वृद्धि से भाग देने पर नई टीम-संख्या मिलती है; उसमें से एक घटाएँ।",
    conclusion: "अतः टीम में प्रारंभ में {answer} खिलाड़ी थे।",
  },
  400: {
    opening: "जाने वाले विद्यार्थी के 26 अंक पुराने औसत 40 से 14 कम हैं; यह कम स्कोर हटने पर शेष विद्यार्थियों का औसत बढ़ता है।",
    method: "14 को औसत-वृद्धि 2 से भाग देकर शेष विद्यार्थियों की संख्या पाएँ और जाने वाले विद्यार्थी को वापस जोड़ें।",
    conclusion: "अतः विद्यार्थी के जाने से पहले कक्षा में {answer} विद्यार्थी थे।",
  },
  401: {
    opening: "टीम छोड़ने वाले खिलाड़ी के 26 रन पुराने औसत से 14 कम हैं; उसका कम स्कोर हटने से छोटी टीम का औसत 2 रन बढ़ता है।",
    method: "14 रन के अंतर को 2 रन की वृद्धि से भाग दें और फिर जाने वाले खिलाड़ी का एक स्थान जोड़ें।",
    conclusion: "अतः मूल टीम में {answer} खिलाड़ी थे।",
  },
  402: {
    opening: "दल छोड़ने वाले कर्मी का उत्पादन पुराने औसत से 14 इकाइयाँ कम है; उसे हटाने पर शेष कर्मियों का औसत 2 इकाइयाँ बढ़ता है।",
    method: "उत्पादन-अंतर को औसत-वृद्धि से भाग देकर शेष कर्मियों की संख्या पाएँ और एक कर्मी वापस जोड़ें।",
    conclusion: "इसलिए कार्य-दल में प्रारंभ में {answer} कर्मी थे।",
  },
  403: {
    opening: "हटाई गई मशीन पुराने औसत से 14 इकाइयाँ कम उत्पादन करती है; उसके हटने से बाकी मशीनों का औसत 2 इकाइयाँ बढ़ जाता है।",
    method: "14 और 2 के अनुपात से शेष मशीनों की संख्या निकालें और हटाई गई मशीन को वापस जोड़ें।",
    conclusion: "अतः संयंत्र में पहले {answer} मशीनें थीं।",
  },
  404: {
    opening: "26 अंक वाला विद्यार्थी पुराने औसत से 14 अंक नीचे है; उसके जाने पर यह कमी शेष कक्षा में प्रति विद्यार्थी 2 अंक की वृद्धि के रूप में दिखाई देती है।",
    method: "14 को 2 से भाग देकर जाने के बाद की कक्षा-संख्या पाएँ, फिर उस विद्यार्थी को जोड़ें।",
    conclusion: "इस प्रकार कक्षा की प्रारंभिक संख्या {answer} थी।",
  },
  405: {
    opening: "26 रन की पारी पुराने टीम-औसत से 14 रन कम है; खिलाड़ी के जाने पर यह कमी हट जाती है और शेष औसत 2 रन बढ़ता है।",
    method: "14 रन को 2 रन से भाग देकर शेष खिलाड़ी पाएँ और जाने वाले खिलाड़ी को वापस जोड़ें।",
    conclusion: "अतः टीम की मूल संख्या {answer} थी।",
  },
};

const PA: Record<number, AuthoredPair> = {
  156: {
    opening: "ਇੱਕ ਪ੍ਰੀਖਿਆ ਅੰਕ ਠੀਕ ਕਰਨ ਨਾਲ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਬਦਲਦੀ; ਸਿਰਫ਼ ਕੁੱਲ ਅੰਕ ਬਦਲਦੇ ਹਨ।",
    method: "ਪੁਰਾਣੇ ਕੁੱਲ ਅੰਕ ਕੱਢੋ, ਗਲਤ ਅੰਕ ਘਟਾਓ, ਸਹੀ ਅੰਕ ਜੋੜੋ ਅਤੇ ਉਸੇ ਪ੍ਰੀਖਿਆ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
    conclusion: "ਇਸ ਲਈ ਸੋਧੀ ਔਸਤ ਅੰਕ {answer} ਹੈ।",
  },
  160: {
    opening: "ਇੱਕ ਦਰਜ ਮੁੱਲ ਦੀ ਬਦਲੀ ਵਿੱਚ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ, ਪਰ ਕੁੱਲ ਵਿੱਚ ਪੁਰਾਣੇ ਅਤੇ ਨਵੇਂ ਮੁੱਲ ਜਿਤਨਾ ਫਰਕ ਆਉਂਦਾ ਹੈ।",
    method: "ਪੁਰਾਣਾ ਕੁੱਲ ਬਣਾਓ, 46 ਘਟਾਓ, 70 ਜੋੜੋ ਅਤੇ ਬਾਰਾਂ ਮੁੱਲਾਂ ਨਾਲ ਮੁੜ ਔਸਤ ਕੱਢੋ।",
    conclusion: "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਨਵੀਂ ਔਸਤ {answer} ਹੈ।",
  },
  394: {
    opening: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ 48 ਅੰਕ ਪੁਰਾਣੀ ਜਮਾਤੀ ਔਸਤ ਤੋਂ 18 ਵੱਧ ਹਨ ਅਤੇ ਇਹੀ ਵਾਧੂ 18 ਅੰਕ ਵਧੀ ਜਮਾਤ ਵਿੱਚ ਹਰ ਵਿਦਿਆਰਥੀ ਦੀ ਔਸਤ 2 ਅੰਕ ਵਧਾਉਂਦੇ ਹਨ।",
    method: "18 ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਦਾਖਲੇ ਤੋਂ ਬਾਅਦ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ, ਫਿਰ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਜਮਾਤ ਵਿੱਚ ਸ਼ੁਰੂ ਤੋਂ {answer} ਵਿਦਿਆਰਥੀ ਸਨ।",
  },
  395: {
    opening: "ਆਉਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦੇ 48 ਦੌੜਾਂ ਪੁਰਾਣੀ ਟੀਮ ਔਸਤ ਤੋਂ 18 ਵੱਧ ਹਨ; ਇਹ ਵਾਧੂ ਦੌੜਾਂ ਨਵੀਂ ਟੀਮ ਦੇ ਹਰ ਸਥਾਨ ਲਈ 2 ਦੌੜਾਂ ਦਾ ਵਾਧਾ ਪੂਰਾ ਕਰਦੀਆਂ ਹਨ।",
    method: "18 ਦੌੜਾਂ ਨੂੰ 2 ਦੌੜਾਂ ਦੀ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਫਿਰ ਸ਼ਾਮਲ ਖਿਡਾਰੀ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਮੂਲ ਟੀਮ ਵਿੱਚ {answer} ਖਿਡਾਰੀ ਸਨ।",
  },
  396: {
    opening: "ਨਵਾਂ ਕਾਮਾ ਪੁਰਾਣੀ ਪ੍ਰਤੀ-ਕਾਮਾ ਔਸਤ ਤੋਂ 18 ਇਕਾਈਆਂ ਵੱਧ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਇਹ ਵਾਧੂ ਉਤਪਾਦਨ ਵਧੇ ਕਾਰਜ-ਦਲ ਦੀ ਔਸਤ 2 ਇਕਾਈਆਂ ਚੁੱਕਦਾ ਹੈ।",
    method: "ਉਤਪਾਦਨ ਦੇ ਫਰਕ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਨਵੀਂ ਕਾਮਾ-ਗਿਣਤੀ ਲੱਭੋ, ਫਿਰ ਨਵਾਂ ਕਾਮਾ ਘਟਾਓ।",
    conclusion: "ਇਸ ਕਰਕੇ ਸ਼ੁਰੂ ਵਿੱਚ {answer} ਕਾਮੇ ਸਨ।",
  },
  397: {
    opening: "ਜੋੜੀ ਮਸ਼ੀਨ ਪੁਰਾਣੀ ਔਸਤ ਨਾਲੋਂ 18 ਇਕਾਈਆਂ ਵੱਧ ਬਣਾਉਂਦੀ ਹੈ; ਇਹ ਵਾਧੂ ਉਤਪਾਦਨ ਸਾਰੀਆਂ ਮਸ਼ੀਨਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਔਸਤ 2 ਇਕਾਈਆਂ ਵਧਾਉਂਦਾ ਹੈ।",
    method: "18 ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਜੋੜ ਤੋਂ ਬਾਅਦ ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ ਅਤੇ ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਇੱਕ ਸਥਾਨ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਜੋੜ ਤੋਂ ਪਹਿਲਾਂ {answer} ਮਸ਼ੀਨਾਂ ਸਨ।",
  },
  398: {
    opening: "ਜਮਾਤੀ ਔਸਤ ਵਿੱਚ 2 ਅੰਕ ਦਾ ਵਾਧਾ ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਵੱਧ ਅੰਕਾਂ ਨੂੰ ਦਾਖਲੇ ਤੋਂ ਬਾਅਦ ਪੂਰੀ ਜਮਾਤ ਵਿੱਚ ਵੰਡਣ ਨਾਲ ਬਣਦਾ ਹੈ।",
    method: "ਪਹਿਲਾਂ 48 ਅਤੇ 30 ਦਾ ਫਰਕ ਲਓ, ਦਾਖਲੇ ਤੋਂ ਬਾਅਦ ਦੀ ਜਮਾਤੀ ਗਿਣਤੀ ਕੱਢੋ ਅਤੇ ਫਿਰ ਇੱਕ ਘਟਾਓ।",
    conclusion: "ਇਸ ਤਰ੍ਹਾਂ ਜਮਾਤ ਦੀ ਮੂਲ ਗਿਣਤੀ {answer} ਸੀ।",
  },
  399: {
    opening: "ਟੀਮ ਔਸਤ ਵਿੱਚ 2 ਦੌੜਾਂ ਦਾ ਵਾਧਾ ਸਿਰਫ਼ ਉਸ ਖਿਡਾਰੀ ਦੀਆਂ ਵਾਧੂ ਦੌੜਾਂ ਨਾਲ ਆਇਆ ਹੈ ਜੋ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਉੱਪਰ ਸਕੋਰ ਕਰਦਾ ਹੈ।",
    method: "18 ਦੌੜਾਂ ਦੀ ਵਧਤ ਨੂੰ 2 ਦੌੜਾਂ ਦੇ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਨਵੀਂ ਟੀਮ-ਗਿਣਤੀ ਲੱਭੋ, ਫਿਰ ਇੱਕ ਘਟਾਓ।",
    conclusion: "ਇਸ ਲਈ ਟੀਮ ਵਿੱਚ ਸ਼ੁਰੂ ਤੋਂ {answer} ਖਿਡਾਰੀ ਸਨ।",
  },
  400: {
    opening: "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ 26 ਅੰਕ ਪੁਰਾਣੀ ਔਸਤ 40 ਤੋਂ 14 ਘੱਟ ਹਨ; ਇਹ ਘੱਟ ਸਕੋਰ ਹਟਣ ਨਾਲ ਬਾਕੀ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਔਸਤ ਵਧਦੀ ਹੈ।",
    method: "14 ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ ਅਤੇ ਜਾਣ ਵਾਲਾ ਵਿਦਿਆਰਥੀ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਵਿਦਿਆਰਥੀ ਦੇ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਮਾਤ ਵਿੱਚ {answer} ਵਿਦਿਆਰਥੀ ਸਨ।",
  },
  401: {
    opening: "ਟੀਮ ਛੱਡਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦੀਆਂ 26 ਦੌੜਾਂ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ 14 ਘੱਟ ਹਨ; ਉਸ ਦਾ ਘੱਟ ਸਕੋਰ ਹਟਣ ਨਾਲ ਛੋਟੀ ਟੀਮ ਦੀ ਔਸਤ 2 ਦੌੜਾਂ ਵਧਦੀ ਹੈ।",
    method: "14 ਦੌੜਾਂ ਦੇ ਫਰਕ ਨੂੰ 2 ਦੌੜਾਂ ਦੇ ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਫਿਰ ਜਾਣ ਵਾਲਾ ਖਿਡਾਰੀ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਮੂਲ ਟੀਮ ਵਿੱਚ {answer} ਖਿਡਾਰੀ ਸਨ।",
  },
  402: {
    opening: "ਦਲ ਛੱਡਣ ਵਾਲੇ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ 14 ਇਕਾਈਆਂ ਘੱਟ ਹੈ; ਉਸ ਨੂੰ ਹਟਾਉਣ ਨਾਲ ਬਾਕੀ ਕਾਮਿਆਂ ਦੀ ਔਸਤ 2 ਇਕਾਈਆਂ ਵਧਦੀ ਹੈ।",
    method: "ਉਤਪਾਦਨ-ਫਰਕ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਕਾਮੇ ਲੱਭੋ ਅਤੇ ਇੱਕ ਕਾਮਾ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਕਰਕੇ ਕਾਰਜ-ਦਲ ਵਿੱਚ ਪਹਿਲਾਂ {answer} ਕਾਮੇ ਸਨ।",
  },
  403: {
    opening: "ਹਟਾਈ ਮਸ਼ੀਨ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ 14 ਇਕਾਈਆਂ ਘੱਟ ਬਣਾਉਂਦੀ ਹੈ; ਉਸ ਦੇ ਹਟਣ ਨਾਲ ਬਾਕੀ ਮਸ਼ੀਨਾਂ ਦੀ ਔਸਤ 2 ਇਕਾਈਆਂ ਵਧ ਜਾਂਦੀ ਹੈ।",
    method: "14 ਅਤੇ 2 ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਬਾਕੀ ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ ਅਤੇ ਹਟਾਈ ਮਸ਼ੀਨ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਪਲਾਂਟ ਵਿੱਚ ਪਹਿਲਾਂ {answer} ਮਸ਼ੀਨਾਂ ਸਨ।",
  },
  404: {
    opening: "26 ਅੰਕ ਵਾਲਾ ਵਿਦਿਆਰਥੀ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ 14 ਅੰਕ ਹੇਠਾਂ ਹੈ; ਉਸ ਦੇ ਜਾਣ ਨਾਲ ਇਹ ਘਾਟ ਬਾਕੀ ਜਮਾਤ ਵਿੱਚ ਹਰ ਵਿਦਿਆਰਥੀ ਲਈ 2 ਅੰਕ ਦੇ ਵਾਧੇ ਵਜੋਂ ਦਿਖਦੀ ਹੈ।",
    method: "14 ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਜਾਣ ਤੋਂ ਬਾਅਦ ਦੀ ਜਮਾਤੀ ਗਿਣਤੀ ਲੱਭੋ, ਫਿਰ ਉਹ ਵਿਦਿਆਰਥੀ ਜੋੜੋ।",
    conclusion: "ਇਸ ਤਰ੍ਹਾਂ ਜਮਾਤ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ {answer} ਸੀ।",
  },
  405: {
    opening: "26 ਦੌੜਾਂ ਦਾ ਸਕੋਰ ਪੁਰਾਣੀ ਟੀਮ ਔਸਤ ਤੋਂ 14 ਦੌੜਾਂ ਘੱਟ ਹੈ; ਖਿਡਾਰੀ ਦੇ ਜਾਣ ਨਾਲ ਇਹ ਘਾਟ ਹਟਦੀ ਹੈ ਅਤੇ ਬਾਕੀ ਔਸਤ 2 ਦੌੜਾਂ ਵਧਦੀ ਹੈ।",
    method: "14 ਦੌੜਾਂ ਨੂੰ 2 ਦੌੜਾਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਖਿਡਾਰੀ ਲੱਭੋ ਅਤੇ ਜਾਣ ਵਾਲਾ ਖਿਡਾਰੀ ਮੁੜ ਜੋੜੋ।",
    conclusion: "ਇਸ ਲਈ ਟੀਮ ਦੀ ਮੂਲ ਗਿਣਤੀ {answer} ਸੀ।",
  },
};

function authoredFor(pkg: Avg001QuestionPackage, lang: Lang) {
  const id = Number(pkg.questionLanguageId.slice(-3));
  return (lang === "en" ? EN : lang === "hi" ? HI : PA)[id];
}

export function applyAvg001Cp003ExplanationAuthorshipV2(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const base = applyAvg001Cp003ExplanationAuthorship(pkg);
  if (base.canonicalProblemId !== "AVG-CP-003") return base;

  const lang: Lang = base.language === "hi" || base.language === "pa" ? base.language : "en";
  const authored = authoredFor(base, lang);
  if (!authored) return base;

  const arithmetic = base.explanation.lines.filter(isArithmetic);
  const working = arithmetic.length ? arithmetic : [base.reasoningEvidence.decisiveCalculation];
  const answer = String(base.answer);
  const lines = [
    authored.opening,
    authored.method,
    ...working.slice(0, 4),
    authored.conclusion.replace("{answer}", answer),
  ].filter(Boolean).slice(0, 8);

  return {
    ...base,
    explanation: { lines },
    traceability: {
      ...base.traceability,
      cp003ExplanationAuthorship: "AVG-CP-003 context-authored explanations v2",
      cp003ExplanationVariant: Number(base.questionLanguageId.slice(-3)),
    },
  };
}
