import { createHash } from "node:crypto";

export const ARG_CP015_LOCALIZED_TWO_ARGUMENT_POLISH_AUTHORITY = "ARG_CP015_LOCALIZED_TWO_ARGUMENT_SURFACE_POLISH_V3" as const;

type Question = Readonly<Record<string, any>>;

function polishHindi(value: string): string {
  return value
    .replaceAll("देर से पहुँचने वाले आवेदकों हमेशा", "देर से पहुँचने वाले आवेदक हमेशा")
    .replaceAll("हर प्रकार का अनजाने उल्लंघनों समाप्त होने की गारंटी", "हर प्रकार के अनजाने उल्लंघन समाप्त हो जाएँ, इसकी गारंटी")
    .replaceAll("डाक पता में", "डाक पते में")
    .replaceAll("लक्षित निस्तारण अवधि दिखाया जाना चाहिए", "लक्षित निस्तारण अवधि दिखाई जानी चाहिए")
    .replaceAll("लक्षित निस्तारण अवधि दिखाया जाए", "लक्षित निस्तारण अवधि दिखाई जाए")
    .replaceAll("बोले गए स्टॉप अलर्ट देनी चाहिए", "बोले गए स्टॉप अलर्ट देने चाहिए")
    .replace(/बोले गए स्टॉप अलर्ट([^।.!?]*?)मदद कर सकती है/g, "बोले गए स्टॉप अलर्ट$1मदद कर सकते हैं")
    .replaceAll("दूसरे कारक की पुष्टि पूरा करना चाहिए", "दूसरे कारक की पुष्टि पूरी करनी चाहिए")
    .replaceAll("दूसरे कारक की पुष्टि यह रोक सकता है", "दूसरे कारक की पुष्टि यह रोक सकती है")
    .replaceAll("इन-ऐप स्वीकृति पूरा", "इन-ऐप स्वीकृति पूरी")
    .replaceAll("सुरक्षा संपर्क बदलना कर सके", "सुरक्षा संपर्क बदल सके")
    .replaceAll("सुरक्षा संपर्क बदलना के लिए", "सुरक्षा संपर्क बदलने के लिए")
    .replaceAll("अनिवार्य अनिवार्य", "अनिवार्य")
    .replaceAll("जानकारी के आधार पर खरीद निर्णय लेना कर सकते हैं", "जानकारी के आधार पर खरीद निर्णय ले सकते हैं")
    .replaceAll("रिकॉर्ड किए वीडियो मॉड्यूल", "रिकॉर्ड किए गए वीडियो मॉड्यूल")
    .replaceAll("सभी इंटरैक्टिव कक्षा सत्र की जगह रिकॉर्ड किए गए वीडियो मॉड्यूल कर देना चाहिए", "सभी इंटरैक्टिव कक्षा सत्रों को रिकॉर्ड किए गए वीडियो मॉड्यूल से बदल देना चाहिए")
    .replaceAll("सभी इंटरैक्टिव कक्षा सत्रों की जगह स्वचालित ट्यूटोरियल कर देना चाहिए", "सभी इंटरैक्टिव कक्षा सत्रों को स्वचालित ट्यूटोरियल से बदल देना चाहिए")
    .replaceAll("इंटरैक्टिव कक्षा सत्र की जगह", "इंटरैक्टिव कक्षा सत्रों की जगह")
    .replaceAll("आईरिस सत्यापन उपयोग करना चाहिए", "आईरिस सत्यापन का उपयोग करना चाहिए")
    .replaceAll("डिवाइस विफलता वास्तविक अभ्यर्थियों को देर करा सकता है", "डिवाइस विफलता वास्तविक अभ्यर्थियों को देर करा सकती है")
    .replaceAll("लक्षित ट्यूटोरियल सत्र देनी चाहिए", "लक्षित ट्यूटोरियल सत्र देने चाहिए")
    .replace(/लक्षित ट्यूटोरियल सत्र([^।.!?]*?)दे सकती हैं/g, "लक्षित ट्यूटोरियल सत्र$1दे सकते हैं")
    .replaceAll("क्या परीक्षा प्राधिकरण को प्रवेश-परीक्षा अभ्यर्थियों को उनके अपने व्यक्तिगत अंक चयन सूची के बाद देने चाहिए?", "क्या परीक्षा प्राधिकरण को चयन सूची जारी होने के बाद प्रवेश-परीक्षा अभ्यर्थियों को उनके व्यक्तिगत अंक उपलब्ध कराने चाहिए?")
    .replaceAll("प्रवेश-परीक्षा अभ्यर्थियों जो व्यक्तिगत अंक चयन सूची के बाद मांगते हैं", "जो प्रवेश-परीक्षा अभ्यर्थी चयन सूची जारी होने के बाद अपने व्यक्तिगत अंक मांगते हैं")
    .replaceAll("प्रवेश-परीक्षा अभ्यर्थियों को उनके अपने व्यक्तिगत अंक चयन सूची के बाद देने से", "चयन सूची जारी होने के बाद प्रवेश-परीक्षा अभ्यर्थियों को उनके व्यक्तिगत अंक देने से")
    .replaceAll("व्यस्त बाजार गलियारा पर", "व्यस्त बाजार गलियारे पर")
    .replaceAll("स्कूल छुट्टी समय", "स्कूल छुट्टी के समय")
    .replaceAll("भारी माल वाहनों प्रतिबंधित", "भारी माल वाहनों को प्रतिबंधित")
    .replaceAll("निजी कारों प्रतिबंधित", "निजी कारों को प्रतिबंधित")
    .replaceAll("निजी कारों सीमित", "निजी कारों को सीमित")
    .replaceAll("निजी कारों को प्रतिबंधित करनी चाहिए", "निजी कारों को प्रतिबंधित करना चाहिए");
}

function polishPunjabi(value: string): string {
  return value
    .replace(/ਮੁਲਾਂਕਣ-ਮਾਰਗਦਰਸ਼ਨ ਨੋਟਸ([^।.!?]*?)ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ/g, "ਮੁਲਾਂਕਣ-ਮਾਰਗਦਰਸ਼ਨ ਨੋਟਸ$1ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ")
    .replaceAll("ਡਾਕ ਪਤਾ ਵਿੱਚ", "ਡਾਕ ਪਤੇ ਵਿੱਚ")
    .replaceAll("ਲਕਸ਼ਿਤ ਨਿਪਟਾਰਾ ਮਿਆਦ ਦਿਖਾਇਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ", "ਲਕਸ਼ਿਤ ਨਿਪਟਾਰਾ ਮਿਆਦ ਦਿਖਾਈ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ")
    .replaceAll("ਲਕਸ਼ਿਤ ਨਿਪਟਾਰਾ ਮਿਆਦ ਦਿਖਾਇਆ ਜਾਵੇ", "ਲਕਸ਼ਿਤ ਨਿਪਟਾਰਾ ਮਿਆਦ ਦਿਖਾਈ ਜਾਵੇ")
    .replaceAll("ਅਸਥਾਈ ਭੁਗਤਾਨ ਲਾਕ ਲਗਾਉਣਾ ਕਰ ਸਕਣ", "ਅਸਥਾਈ ਭੁਗਤਾਨ ਲਾਕ ਲਗਾ ਸਕਣ")
    .replaceAll("ਲੈਣ-ਦੇਣ ਅਸਥਾਈ ਤੌਰ ਤੇ ਬੰਦ ਕਰਨਾ ਕਰ ਸਕਣ", "ਲੈਣ-ਦੇਣ ਅਸਥਾਈ ਤੌਰ ਤੇ ਬੰਦ ਕਰ ਸਕਣ")
    .replaceAll("ਲੈਣ-ਦੇਣ ਅਸਥਾਈ ਤੌਰ ਤੇ ਬੰਦ ਕਰਨਾ ਕਰਨ ਦੀ ਸਹੂਲਤ", "ਲੈਣ-ਦੇਣ ਅਸਥਾਈ ਤੌਰ ਤੇ ਬੰਦ ਕਰਨ ਦੀ ਸਹੂਲਤ")
    .replaceAll("ਬੋਲੇ ਹੋਏ ਸਟਾਪ ਅਲਰਟ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ", "ਬੋਲੇ ਹੋਏ ਸਟਾਪ ਅਲਰਟ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replace(/ਬੋਲੇ ਹੋਏ ਸਟਾਪ ਅਲਰਟ([^।.!?]*?)ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ/g, "ਬੋਲੇ ਹੋਏ ਸਟਾਪ ਅਲਰਟ$1ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ")
    .replaceAll("ਲਾਜ਼ਮੀ ਲਾਜ਼ਮੀ", "ਲਾਜ਼ਮੀ")
    .replaceAll("ਸਾਰੇ ਸਾਮ੍ਹਣੇ-ਸਾਮ੍ਹਣੇ ਸੈਸ਼ਨ ਦੀ ਥਾਂ ਪਹਿਲਾਂ ਰਿਕਾਰਡ ਵੈਬਿਨਾਰ ਕਰ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ", "ਸਾਰੇ ਸਾਮ੍ਹਣੇ-ਸਾਮ੍ਹਣੇ ਸੈਸ਼ਨਾਂ ਨੂੰ ਪਹਿਲਾਂ ਰਿਕਾਰਡ ਕੀਤੇ ਵੈਬਿਨਾਰਾਂ ਨਾਲ ਬਦਲ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replaceAll("ਸਾਰੇ ਇੰਟਰਐਕਟਿਵ ਕਲਾਸ ਸੈਸ਼ਨਾਂ ਦੀ ਥਾਂ ਰਿਕਾਰਡ ਕੀਤੇ ਵੀਡੀਓ ਮੋਡੀਊਲ ਕਰ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ", "ਸਾਰੇ ਇੰਟਰਐਕਟਿਵ ਕਲਾਸ ਸੈਸ਼ਨਾਂ ਨੂੰ ਰਿਕਾਰਡ ਕੀਤੇ ਵੀਡੀਓ ਮੋਡੀਊਲਾਂ ਨਾਲ ਬਦਲ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replaceAll("ਸਾਰੇ ਮਾਰਗਦਰਸ਼ਿਤ ਵਰਕਸ਼ਾਪਾਂ ਦੀ ਥਾਂ ਆਟੋਮੈਟਿਕ ਟਿਊਟੋਰਿਅਲ ਕਰ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ", "ਸਾਰੀਆਂ ਮਾਰਗਦਰਸ਼ਿਤ ਵਰਕਸ਼ਾਪਾਂ ਨੂੰ ਆਟੋਮੈਟਿਕ ਟਿਊਟੋਰਿਅਲਾਂ ਨਾਲ ਬਦਲ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replaceAll("ਸੈਸ਼ਨ ਦੀ ਥਾਂ", "ਸੈਸ਼ਨਾਂ ਦੀ ਥਾਂ")
    .replaceAll("ਲਾਜ਼ਮੀ ਡਿਲੀਵਰੀ ਫੀਸ ਦਿਖਾਉਣੇ ਚਾਹੀਦੇ ਹਨ", "ਲਾਜ਼ਮੀ ਡਿਲੀਵਰੀ ਫੀਸ ਦਿਖਾਉਣੀ ਚਾਹੀਦੀ ਹੈ")
    .replaceAll("ਟਿਊਟੋਰਿਅਲ ਸੈਸ਼ਨ ਦੇਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ", "ਟਿਊਟੋਰਿਅਲ ਸੈਸ਼ਨ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replaceAll("ਸਹਾਇਤਾ ਸੈਸ਼ਨ ਦੇਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ", "ਸਹਾਇਤਾ ਸੈਸ਼ਨ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replaceAll("ਰਿਮਾਈਂਡਰ ਭੇਜਣੀ ਚਾਹੀਦੀ ਹੈ", "ਰਿਮਾਈਂਡਰ ਭੇਜਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replaceAll("ਲਚਕੀਲਾ ਸ਼ੁਰੂਆਤੀ ਸਮਾਂ ਦੀ ਮਨਜ਼ੂਰੀ", "ਲਚਕੀਲੇ ਸ਼ੁਰੂਆਤੀ ਸਮੇਂ ਦੀ ਮਨਜ਼ੂਰੀ")
    .replaceAll("ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ", "ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replaceAll("ਨਾਮ ਅਤੇ ਵਿਭਾਗ ਜਾਰੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ", "ਨਾਮ ਅਤੇ ਵਿਭਾਗ ਜਾਰੀ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ")
    .replaceAll("ਹਰ ਕਿਸੇ ਦੀ ਭਵਿੱਖ ਦਾ ਹਾਜ਼ਰੀ ਵਿਹਾਰ", "ਹਰ ਕਿਸੇ ਦੇ ਭਵਿੱਖਲੇ ਹਾਜ਼ਰੀ ਵਿਹਾਰ")
    .replaceAll("ਕਾਂਟ੍ਰੈਕਟ ਕਰਮਚਾਰੀਆਂ", "ਠੇਕਾ ਕਰਮਚਾਰੀਆਂ")
    .replaceAll("ਕੀਸਟ੍ਰੋਕ ਲਾਗਿੰਗ", "ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ")
    .replaceAll("ਪੂਰੀ ਮੁੜ-ਪ੍ਰੀਖਿਆ ਕਰਾਉਣਾ ਚਾਹੀਦਾ ਹੈ", "ਪੂਰੀ ਮੁੜ-ਪ੍ਰੀਖਿਆ ਕਰਾਉਣੀ ਚਾਹੀਦੀ ਹੈ")
    .replaceAll("ਪੂਰੀ ਪ੍ਰੀਖਿਆ ਰੱਦ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ", "ਪੂਰੀ ਪ੍ਰੀਖਿਆ ਰੱਦ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ")
    .replaceAll("ਦੁਰਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਤੋਂ ਬਾਅਦ", "ਦੁਰਵਿਹਾਰ ਦੇ ਇੱਕ ਦੋਸ਼ ਤੋਂ ਬਾਅਦ")
    .replaceAll("ਆਰ-ਪਾਰ ਜਾਣ ਵਾਲਾ ਟ੍ਰੈਫਿਕ ਰੋਕਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ", "ਆਰ-ਪਾਰ ਜਾਣ ਵਾਲਾ ਟ੍ਰੈਫਿਕ ਰੋਕਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replaceAll("ਇੱਕਲੇ-ਸਵਾਰੀ ਕਾਰਾਂ ਰੋਕਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ", "ਇੱਕਲੇ-ਸਵਾਰੀ ਕਾਰਾਂ ਨੂੰ ਰੋਕਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replaceAll("ਵਾਧੂ ਪਿਕਅੱਪ ਚਾਰਜ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ", "ਵਾਧੂ ਪਿਕਅੱਪ ਚਾਰਜ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ");
}

function rebuildStem(locale: string, statement: string, argumentsList: readonly string[]): string {
  const statementLabel = locale === "hi-IN" ? "कथन" : "ਕਥਨ";
  const argumentsLabel = locale === "hi-IN" ? "तर्क" : "ਦਲੀਲਾਂ";
  return `${statementLabel}: ${statement}\n${argumentsLabel}:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
}

export function polishArgCp015LocalizedTwoArgumentSurface(question: Question): Question {
  const locale = String(question.locale ?? "");
  if (locale !== "hi-IN" && locale !== "pa-IN") return question;
  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (sourceArguments.length !== 2) return question;

  const polish = locale === "hi-IN" ? polishHindi : polishPunjabi;
  const sourceStatement = String(question.statement ?? "");
  const sourceExplanation = String(question.explanation ?? "");
  const statement = polish(sourceStatement);
  const argumentsList = Object.freeze(sourceArguments.map((argument) => polish(String(argument))));
  const explanation = polish(sourceExplanation);

  const changed = statement !== sourceStatement
    || explanation !== sourceExplanation
    || argumentsList.some((argument, index) => argument !== String(sourceArguments[index] ?? ""));
  if (!changed) return question;

  const stem = rebuildStem(locale, statement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_LOCALIZED_TWO_ARGUMENT_POLISH_AUTHORITY,
    question.contentFingerprint,
    question.qlId,
    question.templateId,
    question.examProfile,
    locale,
    statement,
    argumentsList,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement,
    arguments: argumentsList,
    explanation,
    stem,
    text: stem,
    preLocalizedTwoArgumentPolishStatement: sourceStatement,
    preLocalizedTwoArgumentPolishExplanation: sourceExplanation,
    localizedTwoArgumentPolishAuthority: ARG_CP015_LOCALIZED_TWO_ARGUMENT_POLISH_AUTHORITY,
    questionId: `ARG-001:${question.qlId}:${String(question.examProfile ?? "core")}:${locale}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
  });
}
