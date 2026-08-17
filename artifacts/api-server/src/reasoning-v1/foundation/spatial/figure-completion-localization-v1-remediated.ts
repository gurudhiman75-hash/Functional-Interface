import {
  generateFigureCompletionLocalizedQuestionV1 as generateBaseFigureCompletionLocalizedQuestionV1,
  type FigureCompletionLanguageV1,
  type FigureCompletionLocalizedQuestionV1,
} from "./figure-completion-localization-v1";
import type { FigureCompletionPermanentQlIdV1 } from "./figure-completion-permanent-english-runtime-v1";

const HI_QL_NAMES: Record<FigureCompletionPermanentQlIdV1, string> = {
  "SPA-QL-031": "रेखाओं और जोड़ को पूरा करना",
  "SPA-QL-032": "बिंदु, गिनती और दिशा का नियम पूरा करना",
  "SPA-QL-033": "चार हिस्सों की एक जैसी बनावट पूरी करना",
  "SPA-QL-034": "आकृति और भरे/खाली भाग का नियम पूरा करना",
};

const PA_QL_NAMES: Record<FigureCompletionPermanentQlIdV1, string> = {
  "SPA-QL-031": "ਰੇਖਾਵਾਂ ਅਤੇ ਜੋੜ ਪੂਰੇ ਕਰਨਾ",
  "SPA-QL-032": "ਬਿੰਦੂ, ਗਿਣਤੀ ਅਤੇ ਦਿਸ਼ਾ ਦਾ ਨਿਯਮ ਪੂਰਾ ਕਰਨਾ",
  "SPA-QL-033": "ਚਾਰ ਹਿੱਸਿਆਂ ਦੀ ਇੱਕੋ ਬਣਤਰ ਪੂਰੀ ਕਰਨੀ",
  "SPA-QL-034": "ਆਕ੍ਰਿਤੀ ਅਤੇ ਭਰੇ/ਖਾਲੀ ਹਿੱਸੇ ਦਾ ਨਿਯਮ ਪੂਰਾ ਕਰਨਾ",
};

function remediateHindi(question: FigureCompletionLocalizedQuestionV1): FigureCompletionLocalizedQuestionV1 {
  let explanation = question.explanation;
  switch (question.prototypeId) {
    case "FGC-PROT-05-COMPOUND-CONTOUR-MARKER":
      explanation = {
        ...explanation,
        rule: "रेखा सीधी रहनी चाहिए और बीच वाला बिंदु दोनों दिख रहे बिंदुओं से बराबर दूरी पर होना चाहिए।",
        application: "रेखा को सीधा जोड़ें और बीच वाला बिंदु दोनों दिख रहे बिंदुओं से बराबर दूरी पर रखें।",
        check: `विकल्प ${question.answer} में रेखा सीधी है और बीच वाला बिंदु दोनों तरफ बराबर दूरी पर है।`,
      };
      break;
    case "FGC-PROT-07-MIRROR-STATE-REVERSAL":
      explanation = {
        ...explanation,
        rule: "आकृति को दाएँ-बाएँ पलटें और भरा/खाली रूप भी बदलें।",
        application: "नीचे-बाएँ आकृति को दाएँ तरफ पलटें और उसका भरा/खाली रूप बदलें।",
      };
      break;
    case "FGC-PROT-10-SHAPE-CONTACT-STATE":
      explanation = {
        ...explanation,
        rule: "छूने वाले गोलों का भरा/खाली रूप मिलाएँ और दोनों रेखाओं को बिना पलटे L जैसे कोने में जोड़ें।",
        application: "बाएँ तरफ भरा गोला, ऊपर खाली गोला और रेखाओं को जोड़ने वाला सही L-आकार रखें।",
        check: `विकल्प ${question.answer} में गोलों का भरा/खाली रूप और L जैसा कोना दोनों सही हैं।`,
      };
      break;
  }
  return {
    ...question,
    qlName: HI_QL_NAMES[question.qlId],
    explanation,
  };
}

function remediatePunjabi(question: FigureCompletionLocalizedQuestionV1): FigureCompletionLocalizedQuestionV1 {
  let explanation = question.explanation;
  switch (question.prototypeId) {
    case "FGC-PROT-05-COMPOUND-CONTOUR-MARKER":
      explanation = {
        ...explanation,
        rule: "ਰੇਖਾ ਸਿੱਧੀ ਰਹੇ ਅਤੇ ਵਿਚਕਾਰਲਾ ਬਿੰਦੂ ਦੋਵੇਂ ਦਿਖਦੇ ਬਿੰਦੂਆਂ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ 'ਤੇ ਹੋਵੇ।",
        application: "ਰੇਖਾ ਨੂੰ ਸਿੱਧਾ ਜੋੜੋ ਅਤੇ ਵਿਚਕਾਰਲਾ ਬਿੰਦੂ ਦੋਵੇਂ ਦਿਖਦੇ ਬਿੰਦੂਆਂ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ 'ਤੇ ਰੱਖੋ।",
        check: `ਵਿਕਲਪ ${question.answer} ਵਿੱਚ ਰੇਖਾ ਸਿੱਧੀ ਹੈ ਅਤੇ ਵਿਚਕਾਰਲਾ ਬਿੰਦੂ ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ 'ਤੇ ਹੈ।`,
      };
      break;
    case "FGC-PROT-07-MIRROR-STATE-REVERSAL":
      explanation = {
        ...explanation,
        rule: "ਆਕ੍ਰਿਤੀ ਨੂੰ ਸੱਜੇ-ਖੱਬੇ ਉਲਟੋ ਅਤੇ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਵੀ ਬਦਲੋ।",
        application: "ਹੇਠਾਂ-ਖੱਬੇ ਆਕ੍ਰਿਤੀ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਉਲਟੋ ਅਤੇ ਉਸਦਾ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਬਦਲੋ।",
      };
      break;
    case "FGC-PROT-10-SHAPE-CONTACT-STATE":
      explanation = {
        ...explanation,
        rule: "ਛੂਹਦੇ ਗੋਲਾਂ ਦਾ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਮਿਲਾਓ ਅਤੇ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਨੂੰ ਬਿਨਾਂ ਉਲਟੇ L ਵਰਗੇ ਕੋਨੇ ਵਿੱਚ ਜੋੜੋ।",
        application: "ਖੱਬੇ ਪਾਸੇ ਭਰਿਆ ਗੋਲ, ਉੱਪਰ ਖਾਲੀ ਗੋਲ ਅਤੇ ਰੇਖਾਵਾਂ ਨੂੰ ਜੋੜਦਾ ਠੀਕ L-ਆਕਾਰ ਰੱਖੋ।",
        check: `ਵਿਕਲਪ ${question.answer} ਵਿੱਚ ਗੋਲਾਂ ਦਾ ਭਰਿਆ/ਖਾਲੀ ਰੂਪ ਅਤੇ L ਵਰਗਾ ਕੋਨਾ ਦੋਵੇਂ ਠੀਕ ਹਨ।`,
      };
      break;
  }
  return {
    ...question,
    qlName: PA_QL_NAMES[question.qlId],
    explanation,
  };
}

export function generateFigureCompletionLocalizedQuestionV1(request: {
  qlId: FigureCompletionPermanentQlIdV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
  language: FigureCompletionLanguageV1;
}): FigureCompletionLocalizedQuestionV1 {
  const question = generateBaseFigureCompletionLocalizedQuestionV1(request);
  if (request.language === "hi") return remediateHindi(question);
  if (request.language === "pa") return remediatePunjabi(question);
  return question;
}
