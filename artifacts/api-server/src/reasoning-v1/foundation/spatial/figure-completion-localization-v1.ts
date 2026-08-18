import {
  generateFigureCompletionPermanentEnglishQuestionV1,
  type FigureCompletionPermanentEnglishQuestionV1,
  type FigureCompletionPermanentQlIdV1,
  type FigureCompletionPermanentPrototypeV1,
} from "./figure-completion-permanent-english-runtime-v1";
import { FGC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./figure-completion-english-freeze-v1";

export const FGC_001_LOCALIZATION_VERSION_V1 = "FGC-001-LOCALIZATION-V1" as const;
export const FGC_001_LOCALIZATION_AUTHORITY_DRAFT_V1 = "FGC_001_HI_PA_LOCALIZATION_REVIEW_V1" as const;

export type FigureCompletionLanguageV1 = "en" | "hi" | "pa";
export type FigureCompletionLocaleV1 = "en-IN" | "hi-IN" | "pa-IN";

export interface FigureCompletionLocalizedTextV1 {
  qlName: string;
  stem: string;
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
}

export type FigureCompletionLocalizedQuestionV1 = Omit<
  FigureCompletionPermanentEnglishQuestionV1,
  "language" | "locale" | "qlName" | "stem" | "explanation" | "lifecycle"
> & {
  language: FigureCompletionLanguageV1;
  locale: FigureCompletionLocaleV1;
  qlName: string;
  stem: string;
  explanation: FigureCompletionLocalizedTextV1["explanation"];
  localization: {
    version: typeof FGC_001_LOCALIZATION_VERSION_V1;
    authority: typeof FGC_001_LOCALIZATION_AUTHORITY_DRAFT_V1;
    englishFreezeAuthorityId: typeof FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
    geometryInvariant: true;
    optionOrderInvariant: true;
    answerInvariant: true;
    idInvariant: true;
    fingerprintInvariant: true;
  };
  lifecycle: FigureCompletionPermanentEnglishQuestionV1["lifecycle"] & {
    localizationReviewOnly: true;
    localizationFrozen: false;
  };
};

const HI_QL_NAMES: Record<FigureCompletionPermanentQlIdV1, string> = {
  "SPA-QL-031": "रेखाओं और जोड़ को पूरा करना",
  "SPA-QL-032": "बिंदु, गिनती और दिशा पूरा करना",
  "SPA-QL-033": "चार हिस्सों की समान बनावट पूरा करना",
  "SPA-QL-034": "आकृति के साथ भरा/खाली नियम पूरा करना",
};

const PA_QL_NAMES: Record<FigureCompletionPermanentQlIdV1, string> = {
  "SPA-QL-031": "ਰੇਖਾਵਾਂ ਅਤੇ ਜੋੜ ਪੂਰੇ ਕਰਨਾ",
  "SPA-QL-032": "ਬਿੰਦੂ, ਗਿਣਤੀ ਅਤੇ ਦਿਸ਼ਾ ਪੂਰੀ ਕਰਨਾ",
  "SPA-QL-033": "ਚਾਰ ਹਿੱਸਿਆਂ ਦੀ ਇੱਕੋ ਬਣਤਰ ਪੂਰੀ ਕਰਨਾ",
  "SPA-QL-034": "ਆਕ੍ਰਿਤੀ ਨਾਲ ਭਰਿਆ/ਖਾਲੀ ਨਿਯਮ ਪੂਰਾ ਕਰਨਾ",
};

const HI_STEM = "दिए गए चित्र के खाली भाग को सही तरह पूरा करने वाला विकल्प चुनिए।";
const PA_STEM = "ਦਿੱਤੇ ਚਿੱਤਰ ਦੇ ਖਾਲੀ ਹਿੱਸੇ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।";

function hiText(prototypeId: FigureCompletionPermanentPrototypeV1, answer: string): FigureCompletionLocalizedTextV1["explanation"] {
  switch (prototypeId) {
    case "FGC-PROT-01-STRAIGHT-CONTINUITY":
      return {
        observation: "दो तिरछी रेखाएँ खाली भाग तक आ रही हैं और दूसरी तरफ फिर दिख रही हैं।",
        rule: "हर रेखा को उसी दिशा में आगे बढ़ना चाहिए; उसका झुकाव नहीं बदलना चाहिए।",
        application: "ऊपर और नीचे वाली रेखा को अलग-अलग उसी झुकाव में जोड़ें।",
        check: `विकल्प ${answer} में दोनों रेखाएँ दिशा बदले बिना सही तरह जुड़ती हैं।`,
      };
    case "FGC-PROT-02-CURVED-PATH-CONTINUITY":
      return {
        observation: "दो मुड़ी हुई रेखाएँ खाली भाग में जाती हैं और दूसरी तरफ निकलती हैं।",
        rule: "हर रेखा को उसके दिख रहे मोड़ और दिशा के अनुसार जोड़ना है।",
        application: "बाएँ से आती हर रेखा को सही मोड़ देकर दाएँ तरफ की उसी रेखा से मिलाएँ।",
        check: `विकल्प ${answer} में दोनों रास्ते सही मोड़ और दिशा के साथ जुड़ते हैं।`,
      };
    case "FGC-PROT-03-JUNCTION-CONTINUITY":
      return {
        observation: "चार रेखाएँ खाली भाग की ओर आ रही हैं।",
        rule: "सभी रेखाएँ अंदर बीच के एक ही बिंदु पर मिलनी चाहिए और उनकी दिशा नहीं बदलनी चाहिए।",
        application: "हर रेखा को आगे बढ़ाकर बीच के एक ही बिंदु पर मिलाएँ।",
        check: `विकल्प ${answer} में चारों रेखाएँ सही दिशा में एक ही बिंदु पर मिलती हैं।`,
      };
    case "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY":
      return {
        observation: "दो समानांतर रेखाएँ खाली भाग तक आ रही हैं और दूसरी तरफ जारी हैं।",
        rule: "दोनों रेखाओं की दिशा और उनके बीच की दूरी समान रहनी चाहिए।",
        application: "दोनों रेखाओं को उसी झुकाव और दूरी के साथ आगे बढ़ाएँ।",
        check: `विकल्प ${answer} में दोनों रेखाएँ सही दिशा और दूरी के साथ जुड़ती हैं।`,
      };
    case "FGC-PROT-05-COMPOUND-CONTOUR-MARKER":
      return {
        observation: "एक सीधी रेखा पर दो बिंदु दिख रहे हैं और बीच का भाग खाली है।",
        rule: "रेखा सीधी रहनी चाहिए और तीनों बिंदु बराबर दूरी पर होने चाहिए।",
        application: "रेखा को सीधा जोड़ें और बीच वाला बिंदु दोनों दिख रहे बिंदुओं से बराबर दूरी पर रखें।",
        check: `विकल्प ${answer} में रेखा सीधी है और तीनों बिंदु बराबर दूरी पर हैं।`,
      };
    case "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY":
      return {
        observation: "तीन हिस्सों में वही कटती रेखाएँ और बिंदु दाएँ-बाएँ और ऊपर-नीचे पलटकर बने हैं।",
        rule: "दायाँ हिस्सा बाएँ हिस्से जैसा उलटा है और नीचे वाला हिस्सा ऊपर वाले जैसा उलटा है।",
        application: "ऊपर-बाएँ की रेखाओं और बिंदु को दाएँ और नीचे दोनों तरफ पलटकर खाली नीचे-दाएँ हिस्सा बनाएँ।",
        check: `विकल्प ${answer} में कटती रेखाएँ और बिंदु दोनों सही जगह पर हैं।`,
      };
    case "FGC-PROT-07-MIRROR-STATE-REVERSAL":
      return {
        observation: "हर पंक्ति में आकृति दाएँ-बाएँ पलटती है; नीचे की पंक्ति में भरा भाग खाली और खाली भाग भरा हो जाता है।",
        rule: "जगह को दाएँ-बाएँ पलटें और भरा/खाली रूप भी बदलें।",
        application: "नीचे-बाएँ आकृति को दाएँ तरफ पलटें और उसका भरा/खाली रूप बदलें।",
        check: `विकल्प ${answer} में जगह भी सही पलटी है और भरा/खाली रूप भी सही है।`,
      };
    case "FGC-PROT-08-ARC-QUADRANT-SYMMETRY":
      return {
        observation: "तीन हिस्सों में दो गोलाई वाली रेखाएँ और एक तिरछी रेखा केंद्र के चारों ओर वही क्रम बनाती हैं।",
        rule: "खाली हिस्से में दोनों गोलाई वाली रेखाएँ उसी दूरी पर जारी हों और तिरछी रेखा केंद्र से बाहर वाले कोने तक जाए।",
        application: "नीचे-दाएँ हिस्से में दोनों गोलाई वाली रेखाएँ और केंद्र से कोने तक तिरछी रेखा रखें।",
        check: `विकल्प ${answer} में दोनों गोलाई वाली रेखाएँ और तिरछी रेखा सही जगह पर हैं।`,
      };
    case "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION":
      return {
        observation: "ऊपर का पूरा उदाहरण दो नियम दिखाता है: एक पंक्ति में तीन गोले हैं और तीरों की जोड़ी उलटी दिशाओं में है।",
        rule: "नीचे भी यही दोनों नियम लगेंगे: तीसरा गोला पूरा करें और नया तीर दिख रहे तीर की उलटी दिशा में रखें।",
        application: "खाली पंक्ति में एक गोला जोड़ें और नीचे वाले तीर की उलटी दिशा वाला तीर चुनें।",
        check: `विकल्प ${answer} ही तीन गोलों की पंक्ति और उलटी दिशा वाले तीरों की जोड़ी दोनों पूरी करता है।`,
      };
    case "FGC-PROT-10-SHAPE-CONTACT-STATE":
      return {
        observation: "पूरा उदाहरण दिखाता है कि भरा गोला भरे गोले को छूता है और खाली गोला खाली गोले को; दो सीधी रेखाएँ भी खाली भाग में आ रही हैं।",
        rule: "छूने वाले गोलों का भरा/खाली रूप मिलाएँ और दोनों रेखाओं को बिना पलटे L जैसे सीधे कोने में जोड़ें।",
        application: "बाएँ तरफ भरा गोला, ऊपर खाली गोला और रेखाओं को जोड़ने वाला सही L-आकार रखें।",
        check: `विकल्प ${answer} में गोलों का भरा/खाली रूप और L जैसा कोना दोनों सही हैं।`,
      };
  }
}

function paText(prototypeId: FigureCompletionPermanentPrototypeV1, answer: string): FigureCompletionLocalizedTextV1["explanation"] {
  switch (prototypeId) {
    case "FGC-PROT-01-STRAIGHT-CONTINUITY":
      return {
        observation: "ਦੋ ਤਿਰਛੀਆਂ ਰੇਖਾਵਾਂ ਖਾਲੀ ਹਿੱਸੇ ਤੱਕ ਆ ਰਹੀਆਂ ਹਨ ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਫਿਰ ਦਿਖਦੀਆਂ ਹਨ।",
        rule: "ਹਰ ਰੇਖਾ ਨੂੰ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਅੱਗੇ ਜਾਣਾ ਹੈ; ਉਸਦਾ ਝੁਕਾਅ ਨਹੀਂ ਬਦਲਣਾ।",
        application: "ਉੱਪਰ ਅਤੇ ਹੇਠਾਂ ਵਾਲੀ ਰੇਖਾ ਨੂੰ ਵੱਖ-ਵੱਖ ਉਸੇ ਝੁਕਾਅ ਨਾਲ ਜੋੜੋ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਦਿਸ਼ਾ ਬਦਲੇ ਬਿਨਾਂ ਠੀਕ ਜੁੜਦੀਆਂ ਹਨ।`,
      };
    case "FGC-PROT-02-CURVED-PATH-CONTINUITY":
      return {
        observation: "ਦੋ ਮੁੜੀਆਂ ਰੇਖਾਵਾਂ ਖਾਲੀ ਹਿੱਸੇ ਵਿੱਚ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਨਿਕਲਦੀਆਂ ਹਨ।",
        rule: "ਹਰ ਰੇਖਾ ਨੂੰ ਉਸਦੇ ਦਿਖਦੇ ਮੋੜ ਅਤੇ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਜੋੜਨਾ ਹੈ।",
        application: "ਖੱਬੇ ਪਾਸੋਂ ਆਉਂਦੀ ਹਰ ਰੇਖਾ ਨੂੰ ਠੀਕ ਮੋੜ ਦੇ ਕੇ ਸੱਜੇ ਪਾਸੇ ਦੀ ਉਸੇ ਰੇਖਾ ਨਾਲ ਮਿਲਾਓ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਦੋਵੇਂ ਰਸਤੇ ਠੀਕ ਮੋੜ ਅਤੇ ਦਿਸ਼ਾ ਨਾਲ ਜੁੜਦੇ ਹਨ।`,
      };
    case "FGC-PROT-03-JUNCTION-CONTINUITY":
      return {
        observation: "ਚਾਰ ਰੇਖਾਵਾਂ ਖਾਲੀ ਹਿੱਸੇ ਵੱਲ ਆ ਰਹੀਆਂ ਹਨ।",
        rule: "ਸਾਰੀਆਂ ਰੇਖਾਵਾਂ ਅੰਦਰ ਇਕੋ ਵਿਚਕਾਰਲੇ ਬਿੰਦੂ 'ਤੇ ਮਿਲਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ ਅਤੇ ਦਿਸ਼ਾ ਨਹੀਂ ਬਦਲਣੀ।",
        application: "ਹਰ ਰੇਖਾ ਨੂੰ ਅੱਗੇ ਵਧਾ ਕੇ ਇਕੋ ਵਿਚਕਾਰਲੇ ਬਿੰਦੂ 'ਤੇ ਮਿਲਾਓ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਚਾਰੋਂ ਰੇਖਾਵਾਂ ਠੀਕ ਦਿਸ਼ਾ ਵਿੱਚ ਇਕੋ ਬਿੰਦੂ 'ਤੇ ਮਿਲਦੀਆਂ ਹਨ।`,
      };
    case "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY":
      return {
        observation: "ਇਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲ ਰਹੀਆਂ ਦੋ ਰੇਖਾਵਾਂ ਖਾਲੀ ਹਿੱਸੇ ਤੱਕ ਆ ਰਹੀਆਂ ਹਨ ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਜਾਰੀ ਹਨ।",
        rule: "ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਉਹਨਾਂ ਵਿਚਲੀ ਦੂਰੀ ਇੱਕੋ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ।",
        application: "ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਨੂੰ ਉਸੇ ਝੁਕਾਅ ਅਤੇ ਦੂਰੀ ਨਾਲ ਅੱਗੇ ਵਧਾਓ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਠੀਕ ਦਿਸ਼ਾ ਅਤੇ ਦੂਰੀ ਨਾਲ ਜੁੜਦੀਆਂ ਹਨ।`,
      };
    case "FGC-PROT-05-COMPOUND-CONTOUR-MARKER":
      return {
        observation: "ਇੱਕ ਸਿੱਧੀ ਰੇਖਾ 'ਤੇ ਦੋ ਬਿੰਦੂ ਦਿਖ ਰਹੇ ਹਨ ਅਤੇ ਵਿਚਕਾਰਲਾ ਹਿੱਸਾ ਖਾਲੀ ਹੈ।",
        rule: "ਰੇਖਾ ਸਿੱਧੀ ਰਹੇ ਅਤੇ ਤਿੰਨੇ ਬਿੰਦੂ ਇੱਕੋ ਜਿਹੀ ਦੂਰੀ 'ਤੇ ਹੋਣ।",
        application: "ਰੇਖਾ ਨੂੰ ਸਿੱਧਾ ਜੋੜੋ ਅਤੇ ਵਿਚਕਾਰਲਾ ਬਿੰਦੂ ਦੋਵੇਂ ਦਿਖਦੇ ਬਿੰਦੂਆਂ ਤੋਂ ਇੱਕੋ ਦੂਰੀ 'ਤੇ ਰੱਖੋ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਰੇਖਾ ਸਿੱਧੀ ਹੈ ਅਤੇ ਤਿੰਨੇ ਬਿੰਦੂ ਇੱਕੋ ਦੂਰੀ 'ਤੇ ਹਨ।`,
      };
    case "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY":
      return {
        observation: "ਤਿੰਨ ਹਿੱਸਿਆਂ ਵਿੱਚ ਉਹੀ ਕੱਟਦੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਬਿੰਦੂ ਸੱਜੇ-ਖੱਬੇ ਅਤੇ ਉੱਪਰ-ਹੇਠਾਂ ਉਲਟ ਕੇ ਬਣੇ ਹਨ।",
        rule: "ਸੱਜਾ ਹਿੱਸਾ ਖੱਬੇ ਹਿੱਸੇ ਵਾਂਗ ਉਲਟ ਹੈ ਅਤੇ ਹੇਠਾਂ ਵਾਲਾ ਹਿੱਸਾ ਉੱਪਰ ਵਾਲੇ ਵਾਂਗ ਉਲਟ ਹੈ।",
        application: "ਉੱਪਰ-ਖੱਬੇ ਦੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਬਿੰਦੂ ਨੂੰ ਸੱਜੇ ਅਤੇ ਹੇਠਾਂ ਦੋਵੇਂ ਪਾਸੇ ਉਲਟ ਕੇ ਖਾਲੀ ਹੇਠਾਂ-ਸੱਜਾ ਹਿੱਸਾ ਬਣਾਓ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਕੱਟਦੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਬਿੰਦੂ ਦੋਵੇਂ ਠੀਕ ਥਾਂ 'ਤੇ ਹਨ।`,
      };
    case "FGC-PROT-07-MIRROR-STATE-REVERSAL":
      return {
        observation: "ਹਰ ਕਤਾਰ ਵਿੱਚ ਆਕ੍ਰਿਤੀ ਸੱਜੇ-ਖੱਬੇ ਉਲਟਦੀ ਹੈ; ਹੇਠਾਂ ਵਾਲੀ ਕਤਾਰ ਵਿੱਚ ਭਰਿਆ ਹਿੱਸਾ ਖਾਲੀ ਅਤੇ ਖਾਲੀ ਹਿੱਸਾ ਭਰਿਆ ਹੋ ਜਾਂਦਾ ਹੈ।",
        rule: "ਥਾਂ ਨੂੰ ਸੱਜੇ-ਖੱਬੇ ਉਲਟੋ ਅਤੇ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਵੀ ਬਦਲੋ।",
        application: "ਹੇਠਾਂ-ਖੱਬੇ ਆਕ੍ਰਿਤੀ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਉਲਟੋ ਅਤੇ ਉਸਦਾ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਬਦਲੋ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਥਾਂ ਵੀ ਠੀਕ ਉਲਟੀ ਹੈ ਅਤੇ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਵੀ ਠੀਕ ਹੈ।`,
      };
    case "FGC-PROT-08-ARC-QUADRANT-SYMMETRY":
      return {
        observation: "ਤਿੰਨ ਹਿੱਸਿਆਂ ਵਿੱਚ ਦੋ ਗੋਲਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਇੱਕ ਤਿਰਛੀ ਰੇਖਾ ਕੇਂਦਰ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਉਹੀ ਕ੍ਰਮ ਬਣਾਉਂਦੀਆਂ ਹਨ।",
        rule: "ਖਾਲੀ ਹਿੱਸੇ ਵਿੱਚ ਦੋਵੇਂ ਗੋਲਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਉਹੀ ਦੂਰੀ ਰੱਖਣ ਅਤੇ ਤਿਰਛੀ ਰੇਖਾ ਕੇਂਦਰ ਤੋਂ ਬਾਹਰਲੇ ਕੋਨੇ ਤੱਕ ਜਾਵੇ।",
        application: "ਹੇਠਾਂ-ਸੱਜੇ ਹਿੱਸੇ ਵਿੱਚ ਦੋਵੇਂ ਗੋਲਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਕੇਂਦਰ ਤੋਂ ਕੋਨੇ ਤੱਕ ਤਿਰਛੀ ਰੇਖਾ ਰੱਖੋ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਦੋਵੇਂ ਗੋਲਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਤਿਰਛੀ ਰੇਖਾ ਠੀਕ ਥਾਂ 'ਤੇ ਹਨ।`,
      };
    case "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION":
      return {
        observation: "ਉੱਪਰਲਾ ਪੂਰਾ ਉਦਾਹਰਨ ਦੋ ਨਿਯਮ ਦਿਖਾਉਂਦਾ ਹੈ: ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਤਿੰਨ ਗੋਲ ਹਨ ਅਤੇ ਤੀਰਾਂ ਦੀ ਜੋੜੀ ਉਲਟ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਹੈ।",
        rule: "ਹੇਠਾਂ ਵੀ ਇਹੀ ਦੋ ਨਿਯਮ ਲਗਣਗੇ: ਤੀਜਾ ਗੋਲ ਪੂਰਾ ਕਰੋ ਅਤੇ ਨਵਾਂ ਤੀਰ ਦਿਖਦੇ ਤੀਰ ਦੀ ਉਲਟ ਦਿਸ਼ਾ ਵਿੱਚ ਰੱਖੋ।",
        application: "ਖਾਲੀ ਕਤਾਰ ਵਿੱਚ ਇੱਕ ਗੋਲ ਜੋੜੋ ਅਤੇ ਹੇਠਾਂ ਵਾਲੇ ਤੀਰ ਦੀ ਉਲਟ ਦਿਸ਼ਾ ਵਾਲਾ ਤੀਰ ਚੁਣੋ।",
        check: `ਵਿਕਲਪ ${answer} ਹੀ ਤਿੰਨ ਗੋਲਾਂ ਦੀ ਕਤਾਰ ਅਤੇ ਉਲਟ ਦਿਸ਼ਾ ਵਾਲੇ ਤੀਰਾਂ ਦੀ ਜੋੜੀ ਦੋਵੇਂ ਪੂਰੀ ਕਰਦਾ ਹੈ।`,
      };
    case "FGC-PROT-10-SHAPE-CONTACT-STATE":
      return {
        observation: "ਪੂਰਾ ਉਦਾਹਰਨ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਭਰਿਆ ਗੋਲ ਭਰੇ ਗੋਲ ਨੂੰ ਛੂਹਦਾ ਹੈ ਅਤੇ ਖਾਲੀ ਗੋਲ ਖਾਲੀ ਗੋਲ ਨੂੰ; ਦੋ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਵੀ ਖਾਲੀ ਹਿੱਸੇ ਵਿੱਚ ਆ ਰਹੀਆਂ ਹਨ।",
        rule: "ਛੂਹਦੇ ਗੋਲਾਂ ਦਾ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਮਿਲਾਓ ਅਤੇ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਨੂੰ ਬਿਨਾਂ ਉਲਟੇ L ਵਰਗੇ ਸਿੱਧੇ ਕੋਨੇ ਵਿੱਚ ਜੋੜੋ।",
        application: "ਖੱਬੇ ਪਾਸੇ ਭਰਿਆ ਗੋਲ, ਉੱਪਰ ਖਾਲੀ ਗੋਲ ਅਤੇ ਰੇਖਾਵਾਂ ਨੂੰ ਜੋੜਦਾ ਠੀਕ L-ਆਕਾਰ ਰੱਖੋ।",
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਗੋਲਾਂ ਦਾ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਅਤੇ L ਵਰਗਾ ਕੋਨਾ ਦੋਵੇਂ ਠੀਕ ਹਨ।`,
      };
  }
}

function localizedText(
  english: FigureCompletionPermanentEnglishQuestionV1,
  language: Exclude<FigureCompletionLanguageV1, "en">,
): FigureCompletionLocalizedTextV1 {
  if (language === "hi") {
    return {
      qlName: HI_QL_NAMES[english.qlId],
      stem: HI_STEM,
      explanation: hiText(english.prototypeId, english.answer),
    };
  }
  return {
    qlName: PA_QL_NAMES[english.qlId],
    stem: PA_STEM,
    explanation: paText(english.prototypeId, english.answer),
  };
}

function localeFor(language: FigureCompletionLanguageV1): FigureCompletionLocaleV1 {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

export function generateFigureCompletionLocalizedQuestionV1(request: {
  qlId: FigureCompletionPermanentQlIdV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
  language: FigureCompletionLanguageV1;
}): FigureCompletionLocalizedQuestionV1 {
  const english = generateFigureCompletionPermanentEnglishQuestionV1({
    qlId: request.qlId,
    seed: request.seed,
    desiredCorrectOptionIndex: request.desiredCorrectOptionIndex,
  });
  const text = request.language === "en"
    ? { qlName: english.qlName, stem: english.stem, explanation: english.explanation }
    : localizedText(english, request.language);

  return {
    ...english,
    language: request.language,
    locale: localeFor(request.language),
    qlName: text.qlName,
    stem: text.stem,
    explanation: text.explanation,
    localization: {
      version: FGC_001_LOCALIZATION_VERSION_V1,
      authority: FGC_001_LOCALIZATION_AUTHORITY_DRAFT_V1,
      englishFreezeAuthorityId: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      geometryInvariant: true,
      optionOrderInvariant: true,
      answerInvariant: true,
      idInvariant: true,
      fingerprintInvariant: true,
    },
    lifecycle: {
      ...english.lifecycle,
      localizationReviewOnly: true,
      localizationFrozen: false,
    },
  };
}
