import {
  TSD_CP011_NATIVE_HINDI_REVIEW as BASE_HINDI,
  TSD_CP011_NATIVE_PUNJABI_REVIEW as BASE_PUNJABI,
  type TsdCp011NativeLanguage,
  type TsdCp011NativeReviewQuestion,
} from "./native-review-final";

function ratioText(question: TsdCp011NativeReviewQuestion) {
  return `${question.solution.answer.numerator}:${question.solution.answer.denominator}`;
}

function polishRatio(question: TsdCp011NativeReviewQuestion, language: TsdCp011NativeLanguage): TsdCp011NativeReviewQuestion {
  if (question.solution.unit !== "RATIO") return question;
  const answer = ratioText(question);
  const steps = question.authorityKey === "dualEscalatorObservationState"
    ? language === "hi"
      ? Object.freeze([
          "समान दूरी के लिए सीढ़ी की दिशा में और विपरीत दिशा में समय, व्यक्ति की चाल में सीढ़ी की चाल जोड़ने और घटाने से बनते हैं।",
          `दोनों समयों के समीकरण हल करने पर व्यक्ति की चाल : सीढ़ी की चाल = ${answer} मिलता है।`,
        ])
      : Object.freeze([
          "ਇੱਕੋ ਦੂਰੀ ਲਈ ਸੀੜ੍ਹੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਤੇ ਉਲਟ ਸਮੇਂ, ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ ਵਿੱਚ ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ ਜੋੜਨ ਅਤੇ ਘਟਾਉਣ ਨਾਲ ਬਣਦੇ ਹਨ।",
          `ਦੋਵਾਂ ਸਮਿਆਂ ਦੇ ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਉੱਤੇ ਵਿਅਕਤੀ ਦੀ ਰਫ਼ਤਾਰ : ਸੀੜ੍ਹੀ ਦੀ ਰਫ਼ਤਾਰ = ${answer} ਮਿਲਦਾ ਹੈ।`,
        ])
    : language === "hi"
      ? Object.freeze([
          "समान दूरी के लिए पहिए के चक्करों की संख्या उसकी परिधि के व्युत्क्रमानुपाती होती है।",
          `इसलिए पहले पहिए के चक्कर : दूसरे पहिए के चक्कर = ${answer}।`,
        ])
      : Object.freeze([
          "ਇੱਕੋ ਦੂਰੀ ਲਈ ਪਹੀਏ ਦੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਉਸ ਦੇ ਘੇਰੇ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦੀ ਹੈ।",
          `ਇਸ ਲਈ ਪਹਿਲੇ ਪਹੀਏ ਦੇ ਚੱਕਰ : ਦੂਜੇ ਪਹੀਏ ਦੇ ਚੱਕਰ = ${answer}।`,
        ]);

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      steps,
      conclusion: language === "hi" ? `उत्तर: ${answer}।` : `ਉੱਤਰ: ${answer}।`,
    }),
  });
}

export const TSD_CP011_RELEASE_HINDI_REVIEW = Object.freeze(BASE_HINDI.map((q) => polishRatio(q, "hi")));
export const TSD_CP011_RELEASE_PUNJABI_REVIEW = Object.freeze(BASE_PUNJABI.map((q) => polishRatio(q, "pa")));
export const TSD_CP011_RELEASE_NATIVE_REVIEW = Object.freeze([
  ...TSD_CP011_RELEASE_HINDI_REVIEW,
  ...TSD_CP011_RELEASE_PUNJABI_REVIEW,
]);