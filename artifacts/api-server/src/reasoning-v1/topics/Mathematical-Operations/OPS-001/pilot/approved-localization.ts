import type { OpsPilotExplanationStep, OpsPilotOption } from "./representative-pilots";
import type {
  ApprovedOpsQuestion,
  OpsApprovedCandidateId,
} from "./approved-teaching-entry";

export type ApprovedOpsLocale = "hi-IN" | "pa-IN";

export type LocalizedApprovedOpsQuestion = Omit<ApprovedOpsQuestion, "locale" | "stem" | "options" | "explanation"> & {
  locale: ApprovedOpsLocale;
  stem: string;
  options: readonly OpsPilotOption[];
  explanation: {
    ruleStatement: string;
    steps: readonly OpsPilotExplanationStep[];
    conclusion: string;
  };
};

const HI_RULES: Readonly<Record<OpsApprovedCandidateId, string>> = {
  "OPS-CAND-001": "पहले हर छपे हुए चिह्न को उसके दिए गए अर्थ से बदलिए। सभी बदलाव पूरे होने के बाद ही सामान्य क्रिया-क्रम से मान निकालिए।",
  "OPS-CAND-003": "दिए गए चिह्न-अर्थों को समान बाएँ पक्ष पर एक बार लागू करके उसका मान निकालिए और उसी मान वाला समीकरण चुनिए।",
  "OPS-CAND-004": "विशेष चिह्नों को उनकी दी गई गणितीय क्रियाओं से बदलिए, फिर बदले हुए व्यंजक को सामान्य क्रिया-क्रम से हल कीजिए।",
  "OPS-CAND-005": "शब्द-चिह्नों को उनकी बताई गई गणितीय क्रियाओं के रूप में पढ़िए और सभी शब्द बदलने के बाद ही हिसाब कीजिए।",
  "OPS-CAND-007": "विशेष चिह्नों का एक ही अर्थ सभी विकल्पों में लागू कीजिए, बदले हुए बाएँ पक्ष का मान निकालिए और सही समीकरण चुनिए।",
  "OPS-CAND-008": "गणितीय और तुलना वाले दोनों प्रकार के चिह्नों को बदलिए, हर कथन का पूरा हिसाब कीजिए और केवल सही कथन चुनिए।",
  "OPS-CAND-009": "पहले दोनों सांकेतिक गणितीय भागों का मान निकालिए, उनके बीच सही संबंध पहचानिए और फिर उस संबंध वाला सांकेतिक चिह्न चुनिए।",
  "OPS-CAND-010": "रिक्त स्थान पर +, −, × और ÷ को एक-एक करके रखिए और केवल वही क्रिया चुनिए जो समीकरण को सही बनाती है।",
  "OPS-CAND-011": "बाएँ और दाएँ पक्ष का मान अलग-अलग निकालिए, फिर दोनों मानों की तुलना करके सही संबंध-चिह्न चुनिए।",
  "OPS-CAND-012": "विकल्प में दिए दोनों चिह्नों को उसी क्रम में रिक्त स्थानों पर रखिए और सामान्य क्रिया-क्रम से पूरे समीकरण की जाँच कीजिए।",
  "OPS-CAND-013": "विकल्प के चिह्नों को बाएँ से दाएँ उसी क्रम में भरिए, फिर बने हुए समीकरण के दोनों पक्षों की जाँच कीजिए।",
  "OPS-CAND-014": "आपस में बदलने का अर्थ दो-तरफ़ा बदलाव है: पहले चिह्न की हर जगह दूसरे से और दूसरे की हर जगह पहले से बदलिए।",
  "OPS-CAND-015": "दोनों चिह्न-युग्मों के चारों बदलाव एक साथ कीजिए। फिर पहले गुणा और भाग तथा उसके बाद जोड़ और घटाव कीजिए।",
  "OPS-CAND-016": "केवल वास्तविक दो-तरफ़ा बदलाव जाँचिए जिसमें दोनों चिह्न मूल समीकरण में मौजूद हों। बदला समीकरण हल करके अकेला सही युग्म चुनिए।",
  "OPS-CAND-017": "दो अलग चिह्न-युग्मों के चारों बदलाव एक साथ लागू कीजिए और जाँचिए कि बदला हुआ समीकरण सही बनता है।",
  "OPS-CAND-018": "जब बराबर का चिह्न भी बदले, तो सभी चिह्न बदलने के बाद नई बराबरी की जगह पहचानिए और नए दोनों पक्षों का मान निकालिए।",
  "OPS-CAND-019": "दिए गए दोनों गणितीय चिह्नों को हर विकल्प में दो-तरफ़ा बदलिए और केवल उस समीकरण को चुनिए जिसका बदला रूप सही है।",
  "OPS-CAND-020": "पूरी संख्याओं को एक इकाई मानकर आपस में बदलिए; किसी दूसरी संख्या के भीतर के अलग-अलग अंकों को मत बदलिए।",
  "OPS-CAND-021": "बताई गई दोनों पूरी संख्याओं को हर जगह एक-दूसरे से बदलिए और फिर बदले हुए व्यंजक का मान निकालिए।",
  "OPS-CAND-022": "हर विकल्प में बताई गई पूरी संख्याओं को आपस में बदलिए, बदला समीकरण हल कीजिए और अकेला सही विकल्प चुनिए।",
  "OPS-CAND-023": "दोनों अंकों की हर उपस्थिति को पूरे समीकरण में आपस में बदलिए, बहु-अंकीय संख्याएँ फिर से बनाइए और सही युग्म पहचानिए।",
  "OPS-CAND-024": "दोनों अंकों को पूरे व्यंजक में हर जगह आपस में बदलिए, बदली हुई संख्याएँ फिर से बनाइए और मान निकालिए।",
  "OPS-CAND-025": "हर विकल्प की हर संख्या में दोनों अंकों को आपस में बदलिए और केवल उस समीकरण को चुनिए जिसका नया रूप सही है।",
  "OPS-CAND-026": "गणितीय चिह्न-युग्म और पूरी संख्या-युग्म—दोनों बदलाव उसी मूल समीकरण पर एक साथ लागू करना आवश्यक है।",
  "OPS-CAND-027": "उसी मूल समीकरण पर चिह्नों का दो-तरफ़ा बदलाव और अंकों का पूरे प्रश्न में बदलाव कीजिए, सभी संख्याएँ फिर बनाइए और अकेला सही संयुक्त विकल्प चुनिए।",
  "OPS-CAND-028": "दिए गए चिह्न-युग्म और पूरी संख्या-युग्म को उसी मूल व्यंजक में एक साथ बदलिए, फिर सामान्य क्रिया-क्रम से मान निकालिए।",
  "OPS-CAND-029": "हर छपे समीकरण में चिह्न-युग्म और पूरी संख्या-युग्म दोनों बदलिए, बदले बाएँ पक्ष का मान निकालिए और सही दायाँ पक्ष चुनिए।",
  "OPS-CAND-030": "सभी दिए उदाहरणों से M और N का एकमात्र सही अर्थ निकालिए, लक्ष्य में वे अर्थ रखिए और फिर हिसाब कीजिए।",
  "OPS-CAND-032": "दिए उदाहरणों से M और N के अर्थ निकालिए, समान लक्ष्य व्यंजक को बदलिए और उसके मान वाला विकल्प चुनिए।",
  "OPS-CAND-033": "बताई गई चारों क्रियाओं को एक-एक करके जाँचिए और केवल वह क्रिया रखिए जो दिए परिणाम को ठीक-ठीक बनाती है।",
  "OPS-CAND-034": "दोनों तथ्यों से गणितीय और तुलना-चिह्नों के अर्थ निकालिए, फिर उसी एक नियम से चारों विकल्पों की जाँच कीजिए।",
};

const PA_RULES: Readonly<Record<OpsApprovedCandidateId, string>> = {
  "OPS-CAND-001": "ਪਹਿਲਾਂ ਹਰ ਛਪੇ ਚਿੰਨ੍ਹ ਨੂੰ ਉਸ ਦੇ ਦਿੱਤੇ ਅਰਥ ਨਾਲ ਬਦਲੋ। ਸਾਰੇ ਬਦਲਾਅ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹੀ ਆਮ ਕਿਰਿਆ-ਕ੍ਰਮ ਨਾਲ ਮੁੱਲ ਕੱਢੋ।",
  "OPS-CAND-003": "ਦਿੱਤੇ ਚਿੰਨ੍ਹ-ਅਰਥਾਂ ਨੂੰ ਸਾਂਝੇ ਖੱਬੇ ਪਾਸੇ ਉੱਤੇ ਇਕ ਵਾਰ ਲਾਗੂ ਕਰਕੇ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਉਸੇ ਮੁੱਲ ਵਾਲਾ ਸਮੀਕਰਨ ਚੁਣੋ।",
  "OPS-CAND-004": "ਖ਼ਾਸ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀਆਂ ਦਿੱਤੀਆਂ ਗਣਿਤੀ ਕਿਰਿਆਵਾਂ ਨਾਲ ਬਦਲੋ, ਫਿਰ ਬਦਲੇ ਹੋਏ ਹਿਸਾਬ ਨੂੰ ਆਮ ਕਿਰਿਆ-ਕ੍ਰਮ ਨਾਲ ਹੱਲ ਕਰੋ।",
  "OPS-CAND-005": "ਸ਼ਬਦੀ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਦੱਸੀ ਗਣਿਤੀ ਕਿਰਿਆ ਵਜੋਂ ਪੜ੍ਹੋ ਅਤੇ ਸਾਰੇ ਸ਼ਬਦ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਹੀ ਹਿਸਾਬ ਕਰੋ।",
  "OPS-CAND-007": "ਖ਼ਾਸ ਚਿੰਨ੍ਹਾਂ ਦਾ ਇੱਕੋ ਅਰਥ ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਲਾਗੂ ਕਰੋ, ਬਦਲੇ ਖੱਬੇ ਪਾਸੇ ਦਾ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।",
  "OPS-CAND-008": "ਗਣਿਤੀ ਅਤੇ ਤੁਲਨਾ ਵਾਲੇ ਦੋਵੇਂ ਕਿਸਮਾਂ ਦੇ ਚਿੰਨ੍ਹ ਬਦਲੋ, ਹਰ ਕਥਨ ਦਾ ਪੂਰਾ ਹਿਸਾਬ ਕਰੋ ਅਤੇ ਕੇਵਲ ਸਹੀ ਕਥਨ ਚੁਣੋ।",
  "OPS-CAND-009": "ਪਹਿਲਾਂ ਦੋਵੇਂ ਸੰਕੇਤੀ ਗਣਿਤੀ ਭਾਗਾਂ ਦੇ ਮੁੱਲ ਕੱਢੋ, ਉਨ੍ਹਾਂ ਵਿਚਲਾ ਸਹੀ ਸੰਬੰਧ ਲੱਭੋ ਅਤੇ ਫਿਰ ਉਸ ਸੰਬੰਧ ਵਾਲਾ ਸੰਕੇਤੀ ਚਿੰਨ੍ਹ ਚੁਣੋ।",
  "OPS-CAND-010": "ਖਾਲੀ ਥਾਂ ਉੱਤੇ +, −, × ਅਤੇ ÷ ਨੂੰ ਇਕ-ਇਕ ਕਰਕੇ ਰੱਖੋ ਅਤੇ ਕੇਵਲ ਉਹ ਕਿਰਿਆ ਚੁਣੋ ਜੋ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦੀ ਹੈ।",
  "OPS-CAND-011": "ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਪਾਸੇ ਦਾ ਮੁੱਲ ਵੱਖ-ਵੱਖ ਕੱਢੋ, ਫਿਰ ਦੋਵੇਂ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਸਹੀ ਸੰਬੰਧ-ਚਿੰਨ੍ਹ ਚੁਣੋ।",
  "OPS-CAND-012": "ਵਿਕਲਪ ਦੇ ਦੋਵੇਂ ਚਿੰਨ੍ਹ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਖਾਲੀ ਥਾਵਾਂ ਉੱਤੇ ਰੱਖੋ ਅਤੇ ਆਮ ਕਿਰਿਆ-ਕ੍ਰਮ ਨਾਲ ਪੂਰਾ ਸਮੀਕਰਨ ਜਾਂਚੋ।",
  "OPS-CAND-013": "ਵਿਕਲਪ ਦੇ ਚਿੰਨ੍ਹ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਭਰੋ, ਫਿਰ ਬਣੇ ਸਮੀਕਰਨ ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਜਾਂਚੋ।",
  "OPS-CAND-014": "ਆਪਸ ਵਿੱਚ ਬਦਲਣ ਦਾ ਅਰਥ ਦੋ-ਤਰਫ਼ਾ ਬਦਲਾਅ ਹੈ: ਪਹਿਲੇ ਚਿੰਨ੍ਹ ਦੀ ਹਰ ਥਾਂ ਦੂਜਾ ਅਤੇ ਦੂਜੇ ਦੀ ਹਰ ਥਾਂ ਪਹਿਲਾ ਚਿੰਨ੍ਹ ਲਗਾਓ।",
  "OPS-CAND-015": "ਦੋਵੇਂ ਚਿੰਨ੍ਹ-ਜੋੜਿਆਂ ਦੇ ਚਾਰੇ ਬਦਲਾਅ ਇਕੱਠੇ ਕਰੋ। ਫਿਰ ਪਹਿਲਾਂ ਗੁਣਾ ਅਤੇ ਭਾਗ, ਉਸ ਤੋਂ ਬਾਅਦ ਜੋੜ ਅਤੇ ਘਟਾਓ ਕਰੋ।",
  "OPS-CAND-016": "ਕੇਵਲ ਅਸਲੀ ਦੋ-ਤਰਫ਼ਾ ਬਦਲਾਅ ਜਾਂਚੋ ਜਿਸ ਵਿੱਚ ਦੋਵੇਂ ਚਿੰਨ੍ਹ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਮੌਜੂਦ ਹੋਣ। ਬਦਲਿਆ ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ ਇਕੋ ਸਹੀ ਜੋੜਾ ਚੁਣੋ।",
  "OPS-CAND-017": "ਦੋ ਵੱਖਰੇ ਚਿੰਨ੍ਹ-ਜੋੜਿਆਂ ਦੇ ਚਾਰੇ ਬਦਲਾਅ ਇਕੱਠੇ ਲਾਗੂ ਕਰੋ ਅਤੇ ਜਾਂਚੋ ਕਿ ਬਦਲਿਆ ਸਮੀਕਰਨ ਸਹੀ ਬਣਦਾ ਹੈ।",
  "OPS-CAND-018": "ਜਦੋਂ ਬਰਾਬਰੀ ਦਾ ਚਿੰਨ੍ਹ ਵੀ ਬਦਲੇ, ਤਾਂ ਸਾਰੇ ਚਿੰਨ੍ਹ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਨਵੀਂ ਬਰਾਬਰੀ ਦੀ ਥਾਂ ਲੱਭੋ ਅਤੇ ਨਵੇਂ ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੇ ਮੁੱਲ ਕੱਢੋ।",
  "OPS-CAND-019": "ਦਿੱਤੇ ਦੋਵੇਂ ਗਣਿਤੀ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਦੋ-ਤਰਫ਼ਾ ਬਦਲੋ ਅਤੇ ਕੇਵਲ ਉਹ ਸਮੀਕਰਨ ਚੁਣੋ ਜਿਸ ਦਾ ਬਦਲਿਆ ਰੂਪ ਸਹੀ ਹੈ।",
  "OPS-CAND-020": "ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਇਕਾਈ ਵਜੋਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ; ਕਿਸੇ ਹੋਰ ਸੰਖਿਆ ਦੇ ਅੰਦਰਲੇ ਵੱਖਰੇ ਅੰਕ ਨਾ ਬਦਲੋ।",
  "OPS-CAND-021": "ਦੱਸੀਆਂ ਦੋਵੇਂ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਹਰ ਥਾਂ ਇਕ-ਦੂਜੇ ਨਾਲ ਬਦਲੋ ਅਤੇ ਫਿਰ ਬਦਲੇ ਹਿਸਾਬ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
  "OPS-CAND-022": "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਦੱਸੀਆਂ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ, ਬਦਲਿਆ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ ਅਤੇ ਇਕੋ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
  "OPS-CAND-023": "ਦੋਵੇਂ ਅੰਕਾਂ ਦੀ ਹਰ ਮੌਜੂਦਗੀ ਨੂੰ ਪੂਰੇ ਸਮੀਕਰਨ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲੋ, ਬਹੁ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਮੁੜ ਬਣਾਓ ਅਤੇ ਸਹੀ ਜੋੜਾ ਲੱਭੋ।",
  "OPS-CAND-024": "ਦੋਵੇਂ ਅੰਕਾਂ ਨੂੰ ਪੂਰੇ ਹਿਸਾਬ ਵਿੱਚ ਹਰ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ, ਬਦਲੀਆਂ ਸੰਖਿਆਵਾਂ ਮੁੜ ਬਣਾਓ ਅਤੇ ਮੁੱਲ ਕੱਢੋ।",
  "OPS-CAND-025": "ਹਰ ਵਿਕਲਪ ਦੀ ਹਰ ਸੰਖਿਆ ਵਿੱਚ ਦੋਵੇਂ ਅੰਕ ਆਪਸ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਕੇਵਲ ਉਹ ਸਮੀਕਰਨ ਚੁਣੋ ਜਿਸ ਦਾ ਨਵਾਂ ਰੂਪ ਸਹੀ ਹੈ।",
  "OPS-CAND-026": "ਗਣਿਤੀ ਚਿੰਨ੍ਹ-ਜੋੜਾ ਅਤੇ ਪੂਰੀ ਸੰਖਿਆ-ਜੋੜਾ—ਦੋਵੇਂ ਬਦਲਾਅ ਉਸੇ ਮੂਲ ਸਮੀਕਰਨ ਉੱਤੇ ਇਕੱਠੇ ਲਾਗੂ ਕਰਨੇ ਲਾਜ਼ਮੀ ਹਨ।",
  "OPS-CAND-027": "ਉਸੇ ਮੂਲ ਸਮੀਕਰਨ ਉੱਤੇ ਚਿੰਨ੍ਹਾਂ ਦਾ ਦੋ-ਤਰਫ਼ਾ ਬਦਲਾਅ ਅਤੇ ਅੰਕਾਂ ਦਾ ਪੂਰੇ ਸਵਾਲ ਵਿੱਚ ਬਦਲਾਅ ਕਰੋ, ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਮੁੜ ਬਣਾਓ ਅਤੇ ਇਕੋ ਸਹੀ ਸਾਂਝਾ ਵਿਕਲਪ ਚੁਣੋ।",
  "OPS-CAND-028": "ਦਿੱਤੇ ਚਿੰਨ੍ਹ-ਜੋੜੇ ਅਤੇ ਪੂਰੀ ਸੰਖਿਆ-ਜੋੜੇ ਨੂੰ ਉਸੇ ਮੂਲ ਹਿਸਾਬ ਵਿੱਚ ਇਕੱਠੇ ਬਦਲੋ, ਫਿਰ ਆਮ ਕਿਰਿਆ-ਕ੍ਰਮ ਨਾਲ ਮੁੱਲ ਕੱਢੋ।",
  "OPS-CAND-029": "ਹਰ ਛਪੇ ਸਮੀਕਰਨ ਵਿੱਚ ਚਿੰਨ੍ਹ-ਜੋੜਾ ਅਤੇ ਪੂਰੀ ਸੰਖਿਆ-ਜੋੜਾ ਦੋਵੇਂ ਬਦਲੋ, ਬਦਲੇ ਖੱਬੇ ਪਾਸੇ ਦਾ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਸਹੀ ਸੱਜਾ ਪਾਸਾ ਚੁਣੋ।",
  "OPS-CAND-030": "ਸਾਰੇ ਦਿੱਤੇ ਉਦਾਹਰਣਾਂ ਤੋਂ M ਅਤੇ N ਦਾ ਇਕੋ ਸਹੀ ਅਰਥ ਲੱਭੋ, ਲਕਸ਼ ਵਿੱਚ ਉਹ ਅਰਥ ਰੱਖੋ ਅਤੇ ਫਿਰ ਹਿਸਾਬ ਕਰੋ।",
  "OPS-CAND-032": "ਦਿੱਤੇ ਉਦਾਹਰਣਾਂ ਤੋਂ M ਅਤੇ N ਦੇ ਅਰਥ ਲੱਭੋ, ਸਾਂਝੇ ਲਕਸ਼ ਹਿਸਾਬ ਨੂੰ ਬਦਲੋ ਅਤੇ ਉਸ ਦੇ ਮੁੱਲ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।",
  "OPS-CAND-033": "ਦੱਸੀਆਂ ਚਾਰਾਂ ਕਿਰਿਆਵਾਂ ਨੂੰ ਇਕ-ਇਕ ਕਰਕੇ ਜਾਂਚੋ ਅਤੇ ਕੇਵਲ ਉਹ ਕਿਰਿਆ ਰੱਖੋ ਜੋ ਦਿੱਤਾ ਨਤੀਜਾ ਬਿਲਕੁਲ ਬਣਾਉਂਦੀ ਹੈ।",
  "OPS-CAND-034": "ਦੋਵੇਂ ਤੱਥਾਂ ਤੋਂ ਗਣਿਤੀ ਅਤੇ ਤੁਲਨਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਅਰਥ ਲੱਭੋ, ਫਿਰ ਉਸੇ ਇੱਕ ਨਿਯਮ ਨਾਲ ਚਾਰੇ ਵਿਕਲਪ ਜਾਂਚੋ।",
};

const HI_LABELS: Readonly<Record<string, string>> = {
  "Apply both changes to the original equation": "दोनों बदलाव मूल समीकरण पर लागू करें",
  "Apply both changes to the original expression": "दोनों बदलाव मूल व्यंजक पर लागू करें",
  "Apply the proposed interchange in both directions": "प्रस्तावित बदलाव दोनों दिशाओं में करें",
  "Calculate multiplication/division first": "पहले गुणा और भाग करें",
  "Compare both sides": "दोनों पक्षों की तुलना करें",
  "Compare the target options": "लक्ष्य विकल्पों की तुलना करें",
  "Compare the transformed value with the option right-hand sides": "बदले मान की विकल्पों के दाएँ पक्ष से तुलना करें",
  "Convert back to the coded token": "सांकेतिक चिह्न में वापस बदलें",
  "Determine A and B": "A और B का अर्थ निकालें",
  "Determine C": "C का अर्थ निकालें",
  "Determine the actual relation": "वास्तविक संबंध पहचानें",
  "Establish complete-pool uniqueness": "पूरे संभावित समूह में एकमात्र उत्तर की पुष्टि करें",
  "Establish uniqueness": "एकमात्र सही उत्तर की पुष्टि करें",
  "Find the meaning of M": "M का अर्थ निकालें",
  "Find the meaning of N": "N का अर्थ निकालें",
  "Finish addition/subtraction from left to right": "जोड़ और घटाव बाएँ से दाएँ पूरा करें",
  "Form the completed equation": "पूरा समीकरण बनाएँ",
  "Identify complete tokens": "पूरी संख्या-इकाइयाँ पहचानें",
  "Identify the two complete numbers": "दोनों पूरी संख्याएँ पहचानें",
  "Infer M": "M का अर्थ निकालें",
  "Infer N": "N का अर्थ निकालें",
  "Keep the option order unchanged": "विकल्प का क्रम न बदलें",
  "Read the replacement key": "बदलाव का नियम पढ़ें",
  "Rebuild the complete equation": "पूरा समीकरण फिर बनाएँ",
  "Rebuild the equation": "समीकरण फिर बनाएँ",
  "Rebuild the equation boundary": "बराबरी की नई जगह के साथ समीकरण बनाएँ",
  "Rebuild the expression": "व्यंजक फिर बनाएँ",
  "Rebuild the full equation": "पूरा समीकरण फिर बनाएँ",
  "Rebuild the keyed option": "सही विकल्प का बदला रूप बनाएँ",
  "Record the inferred key": "निकाला गया नियम लिखें",
  "Replace every occurrence": "हर जगह चिह्न बदलें",
  "Select the matching equation": "मिलता हुआ समीकरण चुनें",
  "Select the matching option": "मिलता हुआ विकल्प चुनें",
  "Substitute in the target": "लक्ष्य में अर्थ रखें",
  "Swap both signs everywhere": "दोनों चिह्न हर जगह आपस में बदलें",
  "Swap complete number tokens": "पूरी संख्याएँ आपस में बदलें",
  "Test addition": "जोड़ की जाँच करें",
  "Test division": "भाग की जाँच करें",
  "Test multiplication": "गुणा की जाँच करें",
  "Test subtraction": "घटाव की जाँच करें",
  "Transform the common left-hand side": "समान बायाँ पक्ष बदलें",
  "Transform the equation": "समीकरण बदलें",
  "Transform the expression": "व्यंजक बदलें",
  "Transform the keyed option": "सही विकल्प बदलें",
  "Transform the target expression": "लक्ष्य व्यंजक बदलें",
  "Transform the whole expression": "पूरा व्यंजक बदलें",
  "Write all four replacement directions": "बदलाव की चारों दिशाएँ लिखें",
  "Write both complete-number replacements": "पूरी संख्याओं के दोनों बदलाव लिखें",
  "Write both digit replacements": "अंकों के दोनों बदलाव लिखें",
  "Write both directions of the interchange": "दो-तरफ़ा बदलाव लिखें",
  "Write both global digit replacements": "पूरे प्रश्न में अंकों के दोनों बदलाव लिखें",
  "Write both operator replacements": "चिह्नों के दोनों बदलाव लिखें",
  "Write both replacement directions": "बदलाव की दोनों दिशाएँ लिखें",
  "Write the complete meaning key": "पूरा चिह्न-अर्थ नियम लिखें",
  "Write the complete-number interchange": "पूरी संख्याओं का बदलाव लिखें",
  "Write the operator interchange": "गणितीय चिह्नों का बदलाव लिखें",
};

const PA_LABELS: Readonly<Record<string, string>> = {
  "Apply both changes to the original equation": "ਦੋਵੇਂ ਬਦਲਾਅ ਮੂਲ ਸਮੀਕਰਨ ਉੱਤੇ ਲਾਗੂ ਕਰੋ",
  "Apply both changes to the original expression": "ਦੋਵੇਂ ਬਦਲਾਅ ਮੂਲ ਹਿਸਾਬ ਉੱਤੇ ਲਾਗੂ ਕਰੋ",
  "Apply the proposed interchange in both directions": "ਦੱਸਿਆ ਬਦਲਾਅ ਦੋਵੇਂ ਪਾਸਿਆਂ ਵੱਲ ਕਰੋ",
  "Calculate multiplication/division first": "ਪਹਿਲਾਂ ਗੁਣਾ ਅਤੇ ਭਾਗ ਕਰੋ",
  "Compare both sides": "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ",
  "Compare the target options": "ਲਕਸ਼ ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ",
  "Compare the transformed value with the option right-hand sides": "ਬਦਲੇ ਮੁੱਲ ਦੀ ਵਿਕਲਪਾਂ ਦੇ ਸੱਜੇ ਪਾਸੇ ਨਾਲ ਤੁਲਨਾ ਕਰੋ",
  "Convert back to the coded token": "ਸੰਕੇਤੀ ਚਿੰਨ੍ਹ ਵਿੱਚ ਵਾਪਸ ਬਦਲੋ",
  "Determine A and B": "A ਅਤੇ B ਦੇ ਅਰਥ ਲੱਭੋ",
  "Determine C": "C ਦਾ ਅਰਥ ਲੱਭੋ",
  "Determine the actual relation": "ਅਸਲ ਸੰਬੰਧ ਲੱਭੋ",
  "Establish complete-pool uniqueness": "ਸਾਰੇ ਸੰਭਵ ਜੋੜਿਆਂ ਵਿੱਚ ਇਕੋ ਉੱਤਰ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
  "Establish uniqueness": "ਇਕੋ ਸਹੀ ਉੱਤਰ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
  "Find the meaning of M": "M ਦਾ ਅਰਥ ਲੱਭੋ",
  "Find the meaning of N": "N ਦਾ ਅਰਥ ਲੱਭੋ",
  "Finish addition/subtraction from left to right": "ਜੋੜ ਅਤੇ ਘਟਾਓ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਪੂਰੇ ਕਰੋ",
  "Form the completed equation": "ਪੂਰਾ ਸਮੀਕਰਨ ਬਣਾਓ",
  "Identify complete tokens": "ਪੂਰੀਆਂ ਸੰਖਿਆ-ਇਕਾਈਆਂ ਪਛਾਣੋ",
  "Identify the two complete numbers": "ਦੋਵੇਂ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਪਛਾਣੋ",
  "Infer M": "M ਦਾ ਅਰਥ ਲੱਭੋ",
  "Infer N": "N ਦਾ ਅਰਥ ਲੱਭੋ",
  "Keep the option order unchanged": "ਵਿਕਲਪ ਦਾ ਕ੍ਰਮ ਨਾ ਬਦਲੋ",
  "Read the replacement key": "ਬਦਲਾਅ ਦਾ ਨਿਯਮ ਪੜ੍ਹੋ",
  "Rebuild the complete equation": "ਪੂਰਾ ਸਮੀਕਰਨ ਮੁੜ ਬਣਾਓ",
  "Rebuild the equation": "ਸਮੀਕਰਨ ਮੁੜ ਬਣਾਓ",
  "Rebuild the equation boundary": "ਬਰਾਬਰੀ ਦੀ ਨਵੀਂ ਥਾਂ ਨਾਲ ਸਮੀਕਰਨ ਬਣਾਓ",
  "Rebuild the expression": "ਹਿਸਾਬ ਮੁੜ ਬਣਾਓ",
  "Rebuild the full equation": "ਪੂਰਾ ਸਮੀਕਰਨ ਮੁੜ ਬਣਾਓ",
  "Rebuild the keyed option": "ਸਹੀ ਵਿਕਲਪ ਦਾ ਬਦਲਿਆ ਰੂਪ ਬਣਾਓ",
  "Record the inferred key": "ਲੱਭਿਆ ਨਿਯਮ ਲਿਖੋ",
  "Replace every occurrence": "ਹਰ ਥਾਂ ਚਿੰਨ੍ਹ ਬਦਲੋ",
  "Select the matching equation": "ਮਿਲਦਾ ਸਮੀਕਰਨ ਚੁਣੋ",
  "Select the matching option": "ਮਿਲਦਾ ਵਿਕਲਪ ਚੁਣੋ",
  "Substitute in the target": "ਲਕਸ਼ ਵਿੱਚ ਅਰਥ ਰੱਖੋ",
  "Swap both signs everywhere": "ਦੋਵੇਂ ਚਿੰਨ੍ਹ ਹਰ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ",
  "Swap complete number tokens": "ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ",
  "Test addition": "ਜੋੜ ਜਾਂਚੋ",
  "Test division": "ਭਾਗ ਜਾਂਚੋ",
  "Test multiplication": "ਗੁਣਾ ਜਾਂਚੋ",
  "Test subtraction": "ਘਟਾਓ ਜਾਂਚੋ",
  "Transform the common left-hand side": "ਸਾਂਝਾ ਖੱਬਾ ਪਾਸਾ ਬਦਲੋ",
  "Transform the equation": "ਸਮੀਕਰਨ ਬਦਲੋ",
  "Transform the expression": "ਹਿਸਾਬ ਬਦਲੋ",
  "Transform the keyed option": "ਸਹੀ ਵਿਕਲਪ ਬਦਲੋ",
  "Transform the target expression": "ਲਕਸ਼ ਹਿਸਾਬ ਬਦਲੋ",
  "Transform the whole expression": "ਪੂਰਾ ਹਿਸਾਬ ਬਦਲੋ",
  "Write all four replacement directions": "ਬਦਲਾਅ ਦੀਆਂ ਚਾਰੇ ਦਿਸ਼ਾਵਾਂ ਲਿਖੋ",
  "Write both complete-number replacements": "ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਦੇ ਦੋਵੇਂ ਬਦਲਾਅ ਲਿਖੋ",
  "Write both digit replacements": "ਅੰਕਾਂ ਦੇ ਦੋਵੇਂ ਬਦਲਾਅ ਲਿਖੋ",
  "Write both directions of the interchange": "ਦੋ-ਤਰਫ਼ਾ ਬਦਲਾਅ ਲਿਖੋ",
  "Write both global digit replacements": "ਪੂਰੇ ਸਵਾਲ ਵਿੱਚ ਅੰਕਾਂ ਦੇ ਦੋਵੇਂ ਬਦਲਾਅ ਲਿਖੋ",
  "Write both operator replacements": "ਚਿੰਨ੍ਹਾਂ ਦੇ ਦੋਵੇਂ ਬਦਲਾਅ ਲਿਖੋ",
  "Write both replacement directions": "ਬਦਲਾਅ ਦੀਆਂ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਲਿਖੋ",
  "Write the complete meaning key": "ਪੂਰਾ ਚਿੰਨ੍ਹ-ਅਰਥ ਨਿਯਮ ਲਿਖੋ",
  "Write the complete-number interchange": "ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਦਾ ਬਦਲਾਅ ਲਿਖੋ",
  "Write the operator interchange": "ਗਣਿਤੀ ਚਿੰਨ੍ਹਾਂ ਦਾ ਬਦਲਾਅ ਲਿਖੋ",
};

function meaningClause(source: string, locale: ApprovedOpsLocale): string {
  const parts = source.split(/,\s*/u);
  return parts.map((part) => {
    const match = part.match(/^(.+?) means (.+)$/u);
    if (!match) throw new Error(`OPS-001 localization could not read meaning clause: ${part}`);
    return locale === "hi-IN"
      ? `${match[1]} का अर्थ ${match[2]} है`
      : `${match[1]} ਦਾ ਅਰਥ ${match[2]} ਹੈ`;
  }).join(locale === "hi-IN" ? ", " : ", ");
}

function requireMatch(source: string, pattern: RegExp, candidateId: string): RegExpMatchArray {
  const match = source.match(pattern);
  if (!match) throw new Error(`OPS-001 localization could not match ${candidateId}: ${source}`);
  return match;
}

function adaptWordTokens(source: string, locale: ApprovedOpsLocale): string {
  const scale = locale === "hi-IN" ? "गुणा" : "ਗੁਣਾ";
  const combine = locale === "hi-IN" ? "जोड़" : "ਜੋੜ";
  return source.replace(/\bscale\b/gu, scale).replace(/\bcombine\b/gu, combine);
}

function localizeStem(question: ApprovedOpsQuestion, locale: ApprovedOpsLocale): string {
  const hi = locale === "hi-IN";
  const id = question.candidateId;
  switch (id) {
    case "OPS-CAND-001":
    case "OPS-CAND-004": {
      const m = requireMatch(question.stem, /^If (.+), evaluate (.+)\.$/u, id);
      return hi ? `यदि ${meaningClause(m[1], locale)}, तो ${m[2]} का मान ज्ञात कीजिए।` : `ਜੇ ${meaningClause(m[1], locale)}, ਤਾਂ ${m[2]} ਦਾ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-003": {
      const m = requireMatch(question.stem, /^If (.+), select the equation that is true\.$/u, id);
      return hi ? `यदि ${meaningClause(m[1], locale)}, तो सही समीकरण चुनिए।` : `ਜੇ ${meaningClause(m[1], locale)}, ਤਾਂ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-005": {
      const m = requireMatch(question.stem, /^If the word operator scale means × and combine means \+, evaluate (.+)\.$/u, id);
      const expression = adaptWordTokens(m[1], locale);
      return hi ? `यदि शब्द-चिह्न “गुणा” का अर्थ × और “जोड़” का अर्थ + है, तो ${expression} का मान ज्ञात कीजिए।` : `ਜੇ ਸ਼ਬਦੀ ਚਿੰਨ੍ਹ “ਗੁਣਾ” ਦਾ ਅਰਥ × ਅਤੇ “ਜੋੜ” ਦਾ ਅਰਥ + ਹੈ, ਤਾਂ ${expression} ਦਾ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-007": {
      const m = requireMatch(question.stem, /^If (.+), select the true equation\.$/u, id);
      return hi ? `यदि ${meaningClause(m[1], locale)}, तो सही समीकरण चुनिए।` : `ਜੇ ${meaningClause(m[1], locale)}, ਤਾਂ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-008": {
      const m = requireMatch(question.stem, /^If (.+), select the true statement\.$/u, id);
      return hi ? `यदि ${meaningClause(m[1], locale)}, तो सही कथन चुनिए।` : `ਜੇ ${meaningClause(m[1], locale)}, ਤਾਂ ਸਹੀ ਕਥਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-009": {
      const m = requireMatch(question.stem, /^If (.+), which token replaces the blank in (.+)\?$/u, id);
      return hi ? `यदि ${meaningClause(m[1], locale)}, तो ${m[2]} में रिक्त स्थान पर कौन-सा सांकेतिक चिह्न आएगा?` : `ਜੇ ${meaningClause(m[1], locale)}, ਤਾਂ ${m[2]} ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਸੰਕੇਤੀ ਚਿੰਨ੍ਹ ਆਵੇਗਾ?`;
    }
    case "OPS-CAND-010": {
      const m = requireMatch(question.stem, /^Which operator replaces the blank in (.+)\?$/u, id);
      return hi ? `${m[1]} में रिक्त स्थान पर कौन-सा गणितीय चिह्न आएगा?` : `${m[1]} ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਗਣਿਤੀ ਚਿੰਨ੍ਹ ਆਵੇਗਾ?`;
    }
    case "OPS-CAND-011": {
      const m = requireMatch(question.stem, /^Which relation sign replaces the blank in (.+)\?$/u, id);
      return hi ? `${m[1]} में रिक्त स्थान पर कौन-सा संबंध-चिह्न आएगा?` : `${m[1]} ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਸੰਬੰਧ-ਚਿੰਨ੍ਹ ਆਵੇਗਾ?`;
    }
    case "OPS-CAND-012": {
      const m = requireMatch(question.stem, /^Select the ordered pair of operators that makes (.+) true\.$/u, id);
      return hi ? `${m[1]} को सही बनाने वाला गणितीय चिह्नों का क्रमबद्ध युग्म चुनिए।` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਵਾਲਾ ਗਣਿਤੀ ਚਿੰਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮਵਾਰ ਜੋੜਾ ਚੁਣੋ।`;
    }
    case "OPS-CAND-013": {
      const m = requireMatch(question.stem, /^Select the ordered sequence that makes (.+) a true equation\.$/u, id);
      return hi ? `${m[1]} को सही समीकरण बनाने वाला चिह्नों का क्रम चुनिए।` : `${m[1]} ਨੂੰ ਸਹੀ ਸਮੀਕਰਨ ਬਣਾਉਣ ਵਾਲਾ ਚਿੰਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਚੁਣੋ।`;
    }
    case "OPS-CAND-014": {
      const m = requireMatch(question.stem, /^Interchange (.+) and (.+) throughout (.+), then evaluate it\.$/u, id);
      return hi ? `${m[3]} में ${m[1]} और ${m[2]} को हर जगह आपस में बदलकर मान ज्ञात कीजिए।` : `${m[3]} ਵਿੱਚ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਹਰ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਕੇ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-015": {
      const m = requireMatch(question.stem, /^Interchange (.+) with (.+) and (.+) with (.+) simultaneously in (.+), then evaluate it\.$/u, id);
      return hi ? `${m[5]} में ${m[1]} को ${m[2]} से तथा ${m[3]} को ${m[4]} से एक साथ आपस में बदलकर मान ज्ञात कीजिए।` : `${m[5]} ਵਿੱਚ ${m[1]} ਨੂੰ ${m[2]} ਨਾਲ ਅਤੇ ${m[3]} ਨੂੰ ${m[4]} ਨਾਲ ਇਕੱਠੇ ਆਪਸ ਵਿੱਚ ਬਦਲ ਕੇ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-016": {
      const m = requireMatch(question.stem, /^Which pair of operators must be interchanged throughout (.+) to make it correct\?$/u, id);
      return hi ? `${m[1]} को सही बनाने के लिए किन दो गणितीय चिह्नों को पूरे समीकरण में आपस में बदलना होगा?` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਗਣਿਤੀ ਚਿੰਨ੍ਹ ਪੂਰੇ ਸਮੀਕਰਨ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-017": {
      const m = requireMatch(question.stem, /^Which two disjoint operator pairs must be interchanged simultaneously to make (.+) correct\?$/u, id);
      return hi ? `${m[1]} को सही बनाने के लिए कौन-से दो अलग चिह्न-युग्म एक साथ आपस में बदलने होंगे?` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਵੱਖਰੇ ਚਿੰਨ੍ਹ-ਜੋੜੇ ਇਕੱਠੇ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-018": {
      const m = requireMatch(question.stem, /^Which pair of signs must be interchanged to make (.+) correct\?$/u, id);
      return hi ? `${m[1]} को सही बनाने के लिए किन दो चिह्नों को आपस में बदलना होगा?` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਚਿੰਨ੍ਹ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-019": {
      const m = requireMatch(question.stem, /^After interchanging (.+) and (.+) in every option, select the true equation\.$/u, id);
      return hi ? `हर विकल्प में ${m[1]} और ${m[2]} को आपस में बदलने के बाद सही समीकरण चुनिए।` : `ਹਰ ਵਿਕਲਪ ਵਿੱਚ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-020": {
      const m = requireMatch(question.stem, /^Which two complete numbers must be interchanged to make (.+) correct\?$/u, id);
      return hi ? `${m[1]} को सही बनाने के लिए किन दो पूरी संख्याओं को आपस में बदलना होगा?` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੀਆਂ ਦੋ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲਣੀਆਂ ਹੋਣਗੀਆਂ?`;
    }
    case "OPS-CAND-021": {
      const m = requireMatch(question.stem, /^Interchange the complete numbers (.+) and (.+) in (.+), then evaluate it\.$/u, id);
      return hi ? `${m[3]} में पूरी संख्याओं ${m[1]} और ${m[2]} को आपस में बदलकर मान ज्ञात कीजिए।` : `${m[3]} ਵਿੱਚ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲ ਕੇ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-022": {
      const m = requireMatch(question.stem, /^After interchanging the complete numbers (.+) and (.+) in every option, select the true equation\.$/u, id);
      return hi ? `हर विकल्प में पूरी संख्याओं ${m[1]} और ${m[2]} को आपस में बदलने के बाद सही समीकरण चुनिए।` : `ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-023": {
      const m = requireMatch(question.stem, /^Which two digits must be interchanged globally to make (.+) correct\?$/u, id);
      return hi ? `${m[1]} को सही बनाने के लिए किन दो अंकों को पूरे समीकरण में आपस में बदलना होगा?` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਅੰਕ ਪੂਰੇ ਸਮੀਕਰਨ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-024": {
      const m = requireMatch(question.stem, /^Interchange digits (.+) and (.+) globally in (.+), then evaluate it\.$/u, id);
      return hi ? `${m[3]} में अंक ${m[1]} और ${m[2]} को हर जगह आपस में बदलकर मान ज्ञात कीजिए।` : `${m[3]} ਵਿੱਚ ਅੰਕ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਹਰ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਕੇ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-025": {
      const m = requireMatch(question.stem, /^After interchanging digits (.+) and (.+) globally in every option, select the true equation\.$/u, id);
      return hi ? `हर विकल्प में अंक ${m[1]} और ${m[2]} को हर जगह आपस में बदलने के बाद सही समीकरण चुनिए।` : `ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਅੰਕ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਹਰ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-026": {
      const m = requireMatch(question.stem, /^Which operator pair and whole-number pair must both be interchanged to make (.+) correct\?$/u, id);
      return hi ? `${m[1]} को सही बनाने के लिए कौन-सा गणितीय चिह्न-युग्म और पूरी संख्या-युग्म दोनों आपस में बदलने होंगे?` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜਾ ਗਣਿਤੀ ਚਿੰਨ੍ਹ-ਜੋੜਾ ਅਤੇ ਪੂਰੀ ਸੰਖਿਆ-ਜੋੜਾ ਦੋਵੇਂ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-027": {
      const m = requireMatch(question.stem, /^Which operator pair and digit pair must both be interchanged throughout (.+) to make it correct\?$/u, id);
      return hi ? `${m[1]} को सही बनाने के लिए कौन-सा गणितीय चिह्न-युग्म और अंक-युग्म पूरे समीकरण में आपस में बदलने होंगे?` : `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜਾ ਗਣਿਤੀ ਚਿੰਨ੍ਹ-ਜੋੜਾ ਅਤੇ ਅੰਕ-ਜੋੜਾ ਪੂਰੇ ਸਮੀਕਰਨ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲਣਾ ਹੋਵੇਗਾ?`;
    }
    case "OPS-CAND-028": {
      const m = requireMatch(question.stem, /^Interchange (.+) and (.+), and interchange the complete numbers (.+) and (.+), throughout (.+)\. What is the resulting value\?$/u, id);
      return hi ? `${m[5]} में ${m[1]} और ${m[2]} को तथा पूरी संख्याओं ${m[3]} और ${m[4]} को आपस में बदलने पर प्राप्त मान क्या होगा?` : `${m[5]} ਵਿੱਚ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਅਤੇ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ${m[3]} ਅਤੇ ${m[4]} ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?`;
    }
    case "OPS-CAND-029": {
      const m = requireMatch(question.stem, /^After interchanging (.+) with (.+) and the complete numbers (.+) with (.+) in every option, select the true equation\.$/u, id);
      return hi ? `हर विकल्प में ${m[1]} को ${m[2]} से और पूरी संख्या ${m[3]} को ${m[4]} से आपस में बदलने के बाद सही समीकरण चुनिए।` : `ਹਰ ਵਿਕਲਪ ਵਿੱਚ ${m[1]} ਨੂੰ ${m[2]} ਨਾਲ ਅਤੇ ਪੂਰੀ ਸੰਖਿਆ ${m[3]} ਨੂੰ ${m[4]} ਨਾਲ ਆਪਸ ਵਿੱਚ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-030": {
      const m = requireMatch(question.stem, /^M and N each represent one of \+, −, × and ÷\. Given (.+) and (.+), evaluate (.+)\.$/u, id);
      return hi ? `M और N में से प्रत्येक +, −, × और ÷ में से किसी एक क्रिया को दर्शाता है। ${m[1]} तथा ${m[2]} दिए हैं। ${m[3]} का मान ज्ञात कीजिए।` : `M ਅਤੇ N ਵਿੱਚੋਂ ਹਰ ਇੱਕ +, −, × ਅਤੇ ÷ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਕਿਰਿਆ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ। ${m[1]} ਅਤੇ ${m[2]} ਦਿੱਤੇ ਹਨ। ${m[3]} ਦਾ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-032": {
      const m = requireMatch(question.stem, /^M and N each represent one of \+, −, × and ÷\. Given (.+) and (.+), infer M and N, then select the true target equation\.$/u, id);
      return hi ? `M और N में से प्रत्येक +, −, × और ÷ में से किसी एक क्रिया को दर्शाता है। ${m[1]} तथा ${m[2]} से M और N के अर्थ निकालकर सही लक्ष्य समीकरण चुनिए।` : `M ਅਤੇ N ਵਿੱਚੋਂ ਹਰ ਇੱਕ +, −, × ਅਤੇ ÷ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਕਿਰਿਆ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ। ${m[1]} ਅਤੇ ${m[2]} ਤੋਂ M ਅਤੇ N ਦੇ ਅਰਥ ਲੱਭ ਕੇ ਸਹੀ ਲਕਸ਼ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-033": {
      const m = requireMatch(question.stem, /^N represents one of \+, −, × and ÷\. If (.+), which arithmetic operation does N represent\?$/u, id);
      return hi ? `N, +, −, × और ÷ में से किसी एक क्रिया को दर्शाता है। यदि ${m[1]}, तो N कौन-सी क्रिया दर्शाता है?` : `N, +, −, × ਅਤੇ ÷ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਕਿਰਿਆ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ। ਜੇ ${m[1]}, ਤਾਂ N ਕਿਹੜੀ ਕਿਰਿਆ ਦਰਸਾਉਂਦਾ ਹੈ?`;
    }
    case "OPS-CAND-034":
      return hi
        ? "A, B और C किसी क्रम में +, = और > को दर्शाते हैं। 3 A 2 B 5 तथा 7 C 4 दोनों सही कथन हैं। इनके अर्थ निकालकर सही विकल्प चुनिए।"
        : "A, B ਅਤੇ C ਕਿਸੇ ਕ੍ਰਮ ਵਿੱਚ +, = ਅਤੇ > ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ। 3 A 2 B 5 ਅਤੇ 7 C 4 ਦੋਵੇਂ ਸਹੀ ਕਥਨ ਹਨ। ਇਨ੍ਹਾਂ ਦੇ ਅਰਥ ਲੱਭ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।";
  }
}

function localizeLabel(label: string, locale: ApprovedOpsLocale): string {
  const prefix = label.match(/^(Left side|Right side): (.+)$/u);
  if (prefix) {
    const side = locale === "hi-IN"
      ? prefix[1] === "Left side" ? "बायाँ पक्ष" : "दायाँ पक्ष"
      : prefix[1] === "Left side" ? "ਖੱਬਾ ਪਾਸਾ" : "ਸੱਜਾ ਪਾਸਾ";
    return `${side}: ${localizeLabel(prefix[2], locale)}`;
  }
  const option = label.match(/^Check option ([A-D])$/u);
  if (option) return locale === "hi-IN" ? `विकल्प ${option[1]} जाँचें` : `ਵਿਕਲਪ ${option[1]} ਜਾਂਚੋ`;
  const test = label.match(/^Test (addition|subtraction|multiplication|division) \(([+−×÷])\)$/u);
  if (test) {
    const names = locale === "hi-IN"
      ? { addition: "जोड़", subtraction: "घटाव", multiplication: "गुणा", division: "भाग" }
      : { addition: "ਜੋੜ", subtraction: "ਘਟਾਓ", multiplication: "ਗੁਣਾ", division: "ਭਾਗ" };
    return locale === "hi-IN" ? `${names[test[1] as keyof typeof names]} (${test[2]}) की जाँच करें` : `${names[test[1] as keyof typeof names]} (${test[2]}) ਜਾਂਚੋ`;
  }
  const map = locale === "hi-IN" ? HI_LABELS : PA_LABELS;
  const translated = map[label];
  if (!translated) throw new Error(`OPS-001 localization lacks ${locale} label: ${label}`);
  return translated;
}

const HI_FIXED: Readonly<Record<string, string>> = {
  "Do not calculate the printed expression before replacing the symbols.": "चिह्न बदले बिना छपे हुए व्यंजक का हिसाब न करें।",
  "Use these meanings in every option.": "हर विकल्प में यही अर्थ लागू करें।",
  "Replace arithmetic and relation tokens before judging a statement.": "कथन को सही या गलत मानने से पहले गणितीय और संबंध वाले सभी चिह्न बदलें।",
  "The answer must be a coded token, not the ordinary relation sign.": "उत्तर साधारण संबंध-चिह्न नहीं, उसका सांकेतिक चिह्न होना चाहिए।",
  "Apply both changes to the original expression at the same time.": "दोनों बदलाव मूल व्यंजक पर एक ही समय लागू करें।",
  "Each original operator is changed exactly once.": "मूल व्यंजक का हर गणितीय चिह्न केवल एक बार बदलेगा।",
  "Both operators occur in the original equation, so this is a genuine two-way interchange.": "दोनों चिह्न मूल समीकरण में मौजूद हैं, इसलिए यह वास्तविक दो-तरफ़ा बदलाव है।",
  "Both operators occur in the original expression and are interchanged simultaneously.": "दोनों चिह्न मूल व्यंजक में मौजूद हैं और एक साथ आपस में बदले जाते हैं।",
  "Both operators occur in the original equation and are changed simultaneously.": "दोनों चिह्न मूल समीकरण में मौजूद हैं और एक साथ बदले जाते हैं।",
  "Change every occurrence in the original equation.": "मूल समीकरण में हर उपस्थिति बदलें।",
  "Change every occurrence of both operators.": "दोनों चिह्नों की हर उपस्थिति बदलें।",
  "Exactly one choice makes the equation true.": "केवल एक विकल्प समीकरण को सही बनाता है।",
  "The equation boundary may move.": "बराबरी की जगह बदल सकती है।",
  "Use this same swap in every option.": "हर विकल्प में यही बदलाव करें।",
  "The other right-hand sides do not equal the transformed left side.": "दूसरे दाएँ पक्ष बदले हुए बाएँ पक्ष के बराबर नहीं हैं।",
  "Replace each complete token by the other everywhere in the equation.": "समीकरण में हर पूरी संख्या को दूसरी पूरी संख्या से बदलें।",
  "Only this pair makes the equation true.": "केवल यही युग्म समीकरण को सही बनाता है।",
  "Digits inside other numbers remain unchanged.": "दूसरी संख्याओं के भीतर के अंक नहीं बदलेंगे।",
  "Do not perform a digit-by-digit replacement.": "इसे अंक-दर-अंक बदलाव न समझें।",
  "The alternative right-hand sides do not match the transformed left side.": "दूसरे दाएँ पक्ष बदले हुए बाएँ पक्ष से नहीं मिलते।",
  "Rebuild every affected numeral after the simultaneous swap.": "एक साथ बदलाव के बाद हर प्रभावित संख्या फिर बनाएँ।",
  "Apply the swap inside multi-digit numbers as well.": "बहु-अंकीय संख्याओं के भीतर भी अंकों को बदलें।",
  "The right-hand side must also be rebuilt if it contains either digit.": "यदि दाएँ पक्ष में इनमें से कोई अंक है, तो उसे भी फिर बनाना होगा।",
  "The other rebuilt options are false.": "दूसरे बदले हुए विकल्प गलत हैं।",
  "Change only complete matching number tokens.": "केवल पूरी मिलती हुई संख्याएँ बदलें।",
  "Exactly one complete compound choice makes the equation true.": "केवल एक पूरा संयुक्त विकल्प समीकरण को सही बनाता है।",
  "Rebuild every affected number on both sides of the equation.": "समीकरण के दोनों पक्षों की हर प्रभावित संख्या फिर बनाएँ।",
  "Use this one mapping for every option.": "हर विकल्प में यही एक नियम लागू करें।",
  "The transformed equation is true.": "बदला हुआ समीकरण सही है।",
  "The rebuilt equation is true.": "फिर बनाया गया समीकरण सही है।",
};

const PA_FIXED: Readonly<Record<string, string>> = {
  "Do not calculate the printed expression before replacing the symbols.": "ਚਿੰਨ੍ਹ ਬਦਲੇ ਬਿਨਾਂ ਛਪੇ ਹਿਸਾਬ ਦੀ ਗਿਣਤੀ ਨਾ ਕਰੋ।",
  "Use these meanings in every option.": "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਇਹੀ ਅਰਥ ਲਾਗੂ ਕਰੋ।",
  "Replace arithmetic and relation tokens before judging a statement.": "ਕਥਨ ਨੂੰ ਸਹੀ ਜਾਂ ਗਲਤ ਮੰਨਣ ਤੋਂ ਪਹਿਲਾਂ ਗਣਿਤੀ ਅਤੇ ਸੰਬੰਧ ਵਾਲੇ ਸਾਰੇ ਚਿੰਨ੍ਹ ਬਦਲੋ।",
  "The answer must be a coded token, not the ordinary relation sign.": "ਉੱਤਰ ਆਮ ਸੰਬੰਧ-ਚਿੰਨ੍ਹ ਨਹੀਂ, ਉਸ ਦਾ ਸੰਕੇਤੀ ਚਿੰਨ੍ਹ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
  "Apply both changes to the original expression at the same time.": "ਦੋਵੇਂ ਬਦਲਾਅ ਮੂਲ ਹਿਸਾਬ ਉੱਤੇ ਇਕੋ ਸਮੇਂ ਲਾਗੂ ਕਰੋ।",
  "Each original operator is changed exactly once.": "ਮੂਲ ਹਿਸਾਬ ਦਾ ਹਰ ਗਣਿਤੀ ਚਿੰਨ੍ਹ ਕੇਵਲ ਇਕ ਵਾਰ ਬਦਲੇਗਾ।",
  "Both operators occur in the original equation, so this is a genuine two-way interchange.": "ਦੋਵੇਂ ਚਿੰਨ੍ਹ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਮੌਜੂਦ ਹਨ, ਇਸ ਲਈ ਇਹ ਅਸਲੀ ਦੋ-ਤਰਫ਼ਾ ਬਦਲਾਅ ਹੈ।",
  "Both operators occur in the original expression and are interchanged simultaneously.": "ਦੋਵੇਂ ਚਿੰਨ੍ਹ ਮੂਲ ਹਿਸਾਬ ਵਿੱਚ ਮੌਜੂਦ ਹਨ ਅਤੇ ਇਕੱਠੇ ਆਪਸ ਵਿੱਚ ਬਦਲੇ ਜਾਂਦੇ ਹਨ।",
  "Both operators occur in the original equation and are changed simultaneously.": "ਦੋਵੇਂ ਚਿੰਨ੍ਹ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਮੌਜੂਦ ਹਨ ਅਤੇ ਇਕੱਠੇ ਬਦਲੇ ਜਾਂਦੇ ਹਨ।",
  "Change every occurrence in the original equation.": "ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਹਰ ਮੌਜੂਦਗੀ ਬਦਲੋ।",
  "Change every occurrence of both operators.": "ਦੋਵੇਂ ਚਿੰਨ੍ਹਾਂ ਦੀ ਹਰ ਮੌਜੂਦਗੀ ਬਦਲੋ।",
  "Exactly one choice makes the equation true.": "ਕੇਵਲ ਇਕ ਵਿਕਲਪ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।",
  "The equation boundary may move.": "ਬਰਾਬਰੀ ਦੀ ਥਾਂ ਬਦਲ ਸਕਦੀ ਹੈ।",
  "Use this same swap in every option.": "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਇਹੀ ਬਦਲਾਅ ਕਰੋ।",
  "The other right-hand sides do not equal the transformed left side.": "ਹੋਰ ਸੱਜੇ ਪਾਸੇ ਬਦਲੇ ਖੱਬੇ ਪਾਸੇ ਦੇ ਬਰਾਬਰ ਨਹੀਂ ਹਨ।",
  "Replace each complete token by the other everywhere in the equation.": "ਸਮੀਕਰਨ ਵਿੱਚ ਹਰ ਪੂਰੀ ਸੰਖਿਆ ਨੂੰ ਦੂਜੀ ਪੂਰੀ ਸੰਖਿਆ ਨਾਲ ਬਦਲੋ।",
  "Only this pair makes the equation true.": "ਕੇਵਲ ਇਹੀ ਜੋੜਾ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।",
  "Digits inside other numbers remain unchanged.": "ਹੋਰ ਸੰਖਿਆਵਾਂ ਦੇ ਅੰਦਰਲੇ ਅੰਕ ਨਹੀਂ ਬਦਲਣਗੇ।",
  "Do not perform a digit-by-digit replacement.": "ਇਸ ਨੂੰ ਅੰਕ-ਦਰ-ਅੰਕ ਬਦਲਾਅ ਨਾ ਸਮਝੋ।",
  "The alternative right-hand sides do not match the transformed left side.": "ਹੋਰ ਸੱਜੇ ਪਾਸੇ ਬਦਲੇ ਖੱਬੇ ਪਾਸੇ ਨਾਲ ਨਹੀਂ ਮਿਲਦੇ।",
  "Rebuild every affected numeral after the simultaneous swap.": "ਇਕੱਠੇ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਹਰ ਪ੍ਰਭਾਵਿਤ ਸੰਖਿਆ ਮੁੜ ਬਣਾਓ।",
  "Apply the swap inside multi-digit numbers as well.": "ਬਹੁ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਦੇ ਅੰਦਰ ਵੀ ਅੰਕ ਬਦਲੋ।",
  "The right-hand side must also be rebuilt if it contains either digit.": "ਜੇ ਸੱਜੇ ਪਾਸੇ ਵਿੱਚੋਂ ਕੋਈ ਅੰਕ ਹੋਵੇ, ਤਾਂ ਉਹ ਵੀ ਮੁੜ ਬਣਾਉਣਾ ਪਵੇਗਾ।",
  "The other rebuilt options are false.": "ਹੋਰ ਬਦਲੇ ਹੋਏ ਵਿਕਲਪ ਗਲਤ ਹਨ।",
  "Change only complete matching number tokens.": "ਕੇਵਲ ਪੂਰੀਆਂ ਮਿਲਦੀਆਂ ਸੰਖਿਆਵਾਂ ਬਦਲੋ।",
  "Exactly one complete compound choice makes the equation true.": "ਕੇਵਲ ਇਕ ਪੂਰਾ ਸਾਂਝਾ ਵਿਕਲਪ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।",
  "Rebuild every affected number on both sides of the equation.": "ਸਮੀਕਰਨ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਹਰ ਪ੍ਰਭਾਵਿਤ ਸੰਖਿਆ ਮੁੜ ਬਣਾਓ।",
  "Use this one mapping for every option.": "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਇਹੀ ਇਕ ਨਿਯਮ ਲਾਗੂ ਕਰੋ।",
  "The transformed equation is true.": "ਬਦਲਿਆ ਸਮੀਕਰਨ ਸਹੀ ਹੈ।",
  "The rebuilt equation is true.": "ਮੁੜ ਬਣਾਇਆ ਸਮੀਕਰਨ ਸਹੀ ਹੈ।",
};

function localizeText(source: string, locale: ApprovedOpsLocale): string {
  const adapted = adaptWordTokens(source, locale);
  const fixed = (locale === "hi-IN" ? HI_FIXED : PA_FIXED)[adapted];
  if (fixed) return fixed;
  const hi = locale === "hi-IN";
  let match: RegExpMatchArray | null;
  if ((match = adapted.match(/^Its value is (.+)\.$/u))) return hi ? `इसका मान ${match[1]} है।` : `ਇਸ ਦਾ ਮੁੱਲ ${match[1]} ਹੈ।`;
  if ((match = adapted.match(/^(.+); the expression becomes (.+)$/u))) return hi ? `परिणाम ${match[1]} है; अब व्यंजक ${match[2]} रह जाता है।` : `ਨਤੀਜਾ ${match[1]} ਹੈ; ਹੁਣ ਹਿਸਾਬ ${match[2]} ਰਹਿ ਜਾਂਦਾ ਹੈ।`;
  if ((match = adapted.match(/^The statement is (true|false)\.$/u))) return hi ? `यह कथन ${match[1] === "true" ? "सही" : "गलत"} है।` : `ਇਹ ਕਥਨ ${match[1] === "true" ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ।`;
  if ((match = adapted.match(/^(.+), which is (true|false)\.?$/u))) return hi ? `${match[1]}, जो ${match[2] === "true" ? "सही" : "गलत"} है।` : `${match[1]}, ਜੋ ${match[2] === "true" ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ।`;
  if ((match = adapted.match(/^(.+), not (.+)\.$/u))) return hi ? `${match[1]} मिलता है, ${match[2]} नहीं।` : `${match[1]} ਮਿਲਦਾ ਹੈ, ${match[2]} ਨਹੀਂ।`;
  if ((match = adapted.match(/^(.+), which matches the evidence\.$/u))) return hi ? `${match[1]} मिलता है, जो दिए तथ्य से मेल खाता है।` : `${match[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਦਿੱਤੇ ਤੱਥ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`;
  if ((match = adapted.match(/^(.+), so ([MN]) means ([+−×÷])\.$/u))) return hi ? `${match[1]}, इसलिए ${match[2]} का अर्थ ${match[3]} है।` : `${match[1]}, ਇਸ ਲਈ ${match[2]} ਦਾ ਅਰਥ ${match[3]} ਹੈ।`;
  if ((match = adapted.match(/^Among \+, −, × and ÷, only (addition|subtraction|multiplication|division) works: (.+)\.$/u))) {
    const names = hi
      ? { addition: "जोड़", subtraction: "घटाव", multiplication: "गुणा", division: "भाग" }
      : { addition: "ਜੋੜ", subtraction: "ਘਟਾਓ", multiplication: "ਗੁਣਾ", division: "ਭਾਗ" };
    return hi ? `+, −, × और ÷ में केवल ${names[match[1] as keyof typeof names]} सही है: ${match[2]}।` : `+, −, × ਅਤੇ ÷ ਵਿੱਚ ਕੇਵਲ ${names[match[1] as keyof typeof names]} ਸਹੀ ਹੈ: ${match[2]}।`;
  }
  if ((match = adapted.match(/^Only option ([A-D]) has right-hand side (.+)\.$/u))) return hi ? `केवल विकल्प ${match[1]} का दायाँ पक्ष ${match[2]} है।` : `ਕੇਵਲ ਵਿਕਲਪ ${match[1]} ਦਾ ਸੱਜਾ ਪਾਸਾ ${match[2]} ਹੈ।`;
  if ((match = adapted.match(/^Only the option ending in = (.+) is true\.$/u))) return hi ? `केवल = ${match[1]} पर समाप्त होने वाला विकल्प सही है।` : `ਕੇਵਲ = ${match[1]} ਉੱਤੇ ਖਤਮ ਹੋਣ ਵਾਲਾ ਵਿਕਲਪ ਸਹੀ ਹੈ।`;
  if ((match = adapted.match(/^The transformed equation is true; only the option ending in (.+) matches\.$/u))) return hi ? `बदला समीकरण सही है; केवल ${match[1]} पर समाप्त होने वाला विकल्प मेल खाता है।` : `ਬਦਲਿਆ ਸਮੀਕਰਨ ਸਹੀ ਹੈ; ਕੇਵਲ ${match[1]} ਉੱਤੇ ਖਤਮ ਹੋਣ ਵਾਲਾ ਵਿਕਲਪ ਮੇਲ ਖਾਂਦਾ ਹੈ।`;
  if ((match = adapted.match(/^The transformed left side equals (.+)\.$/u))) return hi ? `बदले हुए बाएँ पक्ष का मान ${match[1]} है।` : `ਬਦਲੇ ਖੱਬੇ ਪਾਸੇ ਦਾ ਮੁੱਲ ${match[1]} ਹੈ।`;
  if ((match = adapted.match(/^The transformed target equals (.+)\.$/u))) return hi ? `बदले हुए लक्ष्य का मान ${match[1]} है।` : `ਬਦਲੇ ਲਕਸ਼ ਦਾ ਮੁੱਲ ${match[1]} ਹੈ।`;
  if ((match = adapted.match(/^Insert the symbols from left to right into (.+)\.$/u))) return hi ? `${match[1]} में चिह्न बाएँ से दाएँ भरें।` : `${match[1]} ਵਿੱਚ ਚਿੰਨ੍ਹ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਭਰੋ।`;
  if ((match = adapted.match(/^(\d+) eligible interchange choices were checked\.$/u))) return hi ? `${match[1]} संभावित बदलाव जाँचे गए।` : `${match[1]} ਸੰਭਵ ਬਦਲਾਅ ਜਾਂਚੇ ਗਏ।`;
  if ((match = adapted.match(/^(\d+) complete-number pairs were checked\.$/u))) return hi ? `${match[1]} पूरी संख्या-युग्म जाँचे गए।` : `${match[1]} ਪੂਰੀ ਸੰਖਿਆ-ਜੋੜੇ ਜਾਂਚੇ ਗਏ।`;
  if ((match = adapted.match(/^(\d+) digit pairs were checked\.$/u))) return hi ? `${match[1]} अंक-युग्म जाँचे गए।` : `${match[1]} ਅੰਕ-ਜੋੜੇ ਜਾਂਚੇ ਗਏ।`;
  if ((match = adapted.match(/^(\d+) compound choices were checked\.$/u))) return hi ? `${match[1]} संयुक्त विकल्प जाँचे गए।` : `${match[1]} ਸਾਂਝੇ ਵਿਕਲਪ ਜਾਂਚੇ ਗਏ।`;
  if ((match = adapted.match(/^(\d+) operator pairs × (\d+) digit pairs were tested\.$/u))) return hi ? `${match[1]} चिह्न-युग्म × ${match[2]} अंक-युग्म जाँचे गए।` : `${match[1]} ਚਿੰਨ੍ਹ-ਜੋੜੇ × ${match[2]} ਅੰਕ-ਜੋੜੇ ਜਾਂਚੇ ਗਏ।`;
  if ((match = adapted.match(/^All six basic operator pairs were tested, and every pair used two operators visible in the original equation\.$/u))) return hi ? "सभी छह मूल चिह्न-युग्म जाँचे गए और हर युग्म के दोनों चिह्न मूल समीकरण में मौजूद थे।" : "ਸਾਰੇ ਛੇ ਮੂਲ ਚਿੰਨ੍ਹ-ਜੋੜੇ ਜਾਂਚੇ ਗਏ ਅਤੇ ਹਰ ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਚਿੰਨ੍ਹ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਮੌਜੂਦ ਸਨ।";
  if ((match = adapted.match(/^([ABC]) must be (.+) because (.+) is true; (.+)$/u))) return hi ? `${match[1]} का अर्थ ${match[2]} होना चाहिए क्योंकि ${match[3]} सही है; ${localizeText(match[4], locale)}` : `${match[1]} ਦਾ ਅਰਥ ${match[2]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿਉਂਕਿ ${match[3]} ਸਹੀ ਹੈ; ${localizeText(match[4], locale)}`;
  if ((match = adapted.match(/^Using A = \+ and B = = gives (.+), which is true; reversing them gives (.+), which is false\.$/u))) return hi ? `A = + और B = = रखने पर ${match[1]} मिलता है, जो सही है; उल्टा रखने पर ${match[2]} मिलता है, जो गलत है।` : `A = + ਅਤੇ B = = ਰੱਖਣ ਉੱਤੇ ${match[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਸਹੀ ਹੈ; ਉਲਟ ਰੱਖਣ ਉੱਤੇ ${match[2]} ਮਿਲਦਾ ਹੈ, ਜੋ ਗਲਤ ਹੈ।`;
  if ((match = adapted.match(/^([ABCD]) is the required display token\.$/u))) return hi ? `${match[1]} आवश्यक सांकेतिक चिह्न है।` : `${match[1]} ਲੋੜੀਂਦਾ ਸੰਕੇਤੀ ਚਿੰਨ੍ਹ ਹੈ।`;
  if ((match = adapted.match(/^(.+) is true$/u))) return hi ? `${match[1]} सही है` : `${match[1]} ਸਹੀ ਹੈ`;
  if (/^[\d\s+−×÷=<>_;,.\/→↔ABCDMN◆●$#गुणाजोड़ਗੁਣਾਜੋੜ-]+$/u.test(adapted)) return adapted;
  throw new Error(`OPS-001 localization lacks ${locale} prose translation: ${source}`);
}

function localizeConclusion(question: ApprovedOpsQuestion, locale: ApprovedOpsLocale): string {
  const hi = locale === "hi-IN";
  const answer = question.answer;
  const id = question.candidateId;
  if (["OPS-CAND-001", "OPS-CAND-004", "OPS-CAND-005", "OPS-CAND-014", "OPS-CAND-015", "OPS-CAND-021", "OPS-CAND-024", "OPS-CAND-028", "OPS-CAND-030"].includes(id)) return hi ? `अतः सही उत्तर ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  if (["OPS-CAND-003", "OPS-CAND-007", "OPS-CAND-019", "OPS-CAND-022", "OPS-CAND-025", "OPS-CAND-029", "OPS-CAND-032"].includes(id)) return hi ? `अतः ${answer} ही सही समीकरण है।` : `ਇਸ ਲਈ ${answer} ਹੀ ਸਹੀ ਸਮੀਕਰਨ ਹੈ।`;
  if (["OPS-CAND-008", "OPS-CAND-034"].includes(id)) return hi ? `अतः ${answer} ही सही कथन है।` : `ਇਸ ਲਈ ${answer} ਹੀ ਸਹੀ ਕਥਨ ਹੈ।`;
  if (id === "OPS-CAND-009") return hi ? `अतः रिक्त स्थान पर ${answer} आएगा।` : `ਇਸ ਲਈ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ${answer} ਆਵੇਗਾ।`;
  if (id === "OPS-CAND-010") return hi ? `अतः लुप्त गणितीय चिह्न ${answer} है।` : `ਇਸ ਲਈ ਗੁੰਮ ਗਣਿਤੀ ਚਿੰਨ੍ਹ ${answer} ਹੈ।`;
  if (id === "OPS-CAND-011") return hi ? `अतः सही संबंध-चिह्न ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਸੰਬੰਧ-ਚਿੰਨ੍ਹ ${answer} ਹੈ।`;
  if (["OPS-CAND-012", "OPS-CAND-013"].includes(id)) return hi ? `अतः सही क्रम ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਕ੍ਰਮ ${answer} ਹੈ।`;
  if (["OPS-CAND-016", "OPS-CAND-017", "OPS-CAND-018"].includes(id)) return hi ? `अतः ${answer} को आपस में बदलना होगा।` : `ਇਸ ਲਈ ${answer} ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣਾ ਹੋਵੇਗਾ।`;
  if (id === "OPS-CAND-020") return hi ? `अतः पूरी संख्याओं का सही युग्म ${answer} है।` : `ਇਸ ਲਈ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਦਾ ਸਹੀ ਜੋੜਾ ${answer} ਹੈ।`;
  if (id === "OPS-CAND-023") return hi ? `अतः अंकों का सही युग्म ${answer} है।` : `ਇਸ ਲਈ ਅੰਕਾਂ ਦਾ ਸਹੀ ਜੋੜਾ ${answer} ਹੈ।`;
  if (["OPS-CAND-026", "OPS-CAND-027"].includes(id)) return hi ? `अतः सही संयुक्त बदलाव ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਸਾਂਝਾ ਬਦਲਾਅ ${answer} ਹੈ।`;
  if (id === "OPS-CAND-033") return hi ? `अतः N का अर्थ ${answer} है।` : `ਇਸ ਲਈ N ਦਾ ਅਰਥ ${answer} ਹੈ।`;
  throw new Error(`OPS-001 localization lacks conclusion for ${id}`);
}

export function localizeApprovedOpsQuestion(
  question: ApprovedOpsQuestion,
  locale: ApprovedOpsLocale,
): LocalizedApprovedOpsQuestion {
  const options = question.options.map((option) => ({ ...option }));
  return {
    ...question,
    locale,
    stem: localizeStem(question, locale),
    options,
    explanation: {
      ruleStatement: (locale === "hi-IN" ? HI_RULES : PA_RULES)[question.candidateId],
      steps: question.explanation.steps.map((step) => ({
        label: localizeLabel(step.label, locale),
        expression: localizeText(step.expression, locale),
        result: localizeText(step.result, locale),
      })),
      conclusion: localizeConclusion(question, locale),
    },
    metadata: {
      ...question.metadata,
      localizationVersion: "OPS_APPROVED_V3_ALL_31",
      localizationSourceLocale: "en-IN",
    },
  };
}
