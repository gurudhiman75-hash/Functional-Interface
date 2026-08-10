import type { TmwLocalizedLanguage } from "./localization-types";

export type TmwR2Language = "en" | TmwLocalizedLanguage;

interface R2Question {
  stem: string;
  solution?: { answerText?: string };
  parameters?: {
    context?: {
      actor?: string;
      peerActor?: string;
    };
  };
  explanation?: {
    conclusion?: string;
  };
}

function answerText(question: R2Question): string {
  return question.solution?.answerText?.trim() || "the stated answer";
}

function replaceConclusion<T extends R2Question>(question: T, conclusion: string): T {
  if (!question.explanation) return question;
  return {
    ...question,
    explanation: {
      ...question.explanation,
      conclusion,
    },
  };
}

function remediateQl016<T extends R2Question>(question: T, language: TmwR2Language): T {
  const answer = answerText(question);
  if (language === "hi") {
    return replaceConclusion(question, `अतः दोनों के पूरे किए गए काम का अंतर ${answer} है।`);
  }
  if (language === "pa") {
    return replaceConclusion(question, `ਇਸ ਲਈ ਦੋਵਾਂ ਵੱਲੋਂ ਕੀਤੇ ਕੰਮ ਦਾ ਅੰਤਰ ${answer} ਹੈ।`);
  }

  const actor = question.parameters?.context?.actor?.trim();
  const peer = question.parameters?.context?.peerActor?.trim();
  return replaceConclusion(
    question,
    actor && peer
      ? `Therefore, ${actor} completes ${answer.replace(/^(\S.*?)(?=\s+(?:files?|units?|items?|applications?|forms?|records?|pages?|pieces?)\b)/i, "$1")} more than ${peer} in the stated time.`
      : `Therefore, the difference in completed work is ${answer}.`,
  );
}

function remediateQl028<T extends R2Question>(question: T, language: TmwR2Language): T {
  let stem = question.stem;
  if (language === "en") {
    stem = stem
      .replace(
        /A continuous rework process reverses part of the completed work\. With both ([^.]+) working while rework continues, the assignment is finished in ([^.]+)\. At the same rate, how long would the rework process take to undo the whole assignment\?/,
        "Some completed work has to be redone continuously. With both $1 working, including this rework, the assignment is completed in $2. If this rework alone continued at the same rate, how long would it take to undo work equal to the whole assignment?",
      );
  } else if (language === "hi") {
    stem = stem
      .replace(/एक सतत पुनःकार्य प्रक्रिया किए गए काम के कुछ भाग को उलटती रहती है।?/g, "किए गए काम का कुछ भाग लगातार दोबारा करना पड़ता है।")
      .replace(/पुनःकार्य प्रक्रिया/g, "दोबारा किए जाने वाले काम की प्रक्रिया");
  } else {
    stem = stem
      .replace(/ਇੱਕ ਲਗਾਤਾਰ ਮੁੜ-ਕੰਮ ਪ੍ਰਕਿਰਿਆ ਕੀਤੇ ਕੰਮ ਦੇ ਕੁਝ ਹਿੱਸੇ ਨੂੰ ਉਲਟਦੀ ਰਹਿੰਦੀ ਹੈ।?/g, "ਕੀਤੇ ਕੰਮ ਦਾ ਕੁਝ ਹਿੱਸਾ ਲਗਾਤਾਰ ਦੁਬਾਰਾ ਕਰਨਾ ਪੈਂਦਾ ਹੈ।")
      .replace(/ਮੁੜ-ਕੰਮ ਪ੍ਰਕਿਰਿਆ/g, "ਦੁਬਾਰਾ ਕੀਤੇ ਜਾਣ ਵਾਲੇ ਕੰਮ ਦੀ ਪ੍ਰਕਿਰਿਆ");
  }
  return { ...question, stem };
}

function remediateQl086<T extends R2Question>(question: T, language: TmwR2Language): T {
  let stem = question.stem;
  if (language === "en") {
    stem = stem.replace(
      /After how many complete days and what fraction of the next day is (.+?) completed\? Give the exact elapsed time\./,
      "What is the exact total time required to complete $1?",
    );
  } else if (language === "hi") {
    stem = stem.replace(
      /काम कितने पूरे दिनों और अगली बारी के कितने समय में पूरा होगा\? कुल सही समय बताइए।/,
      "काम पूरा होने में कुल कितना सही समय लगेगा?",
    );
  } else {
    stem = stem.replace(
      /ਕੰਮ ਕਿੰਨੇ ਪੂਰੇ ਦਿਨਾਂ ਅਤੇ ਅਗਲੀ ਵਾਰੀ ਦੇ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ\? ਕੁੱਲ ਸਹੀ ਸਮਾਂ ਦੱਸੋ।/,
      "ਕੰਮ ਪੂਰਾ ਹੋਣ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨਾ ਸਹੀ ਸਮਾਂ ਲੱਗੇਗਾ?",
    );
  }
  return { ...question, stem };
}

function remediateQl108<T extends R2Question>(question: T, language: TmwR2Language): T {
  const answer = answerText(question);
  if (language === "hi") return replaceConclusion(question, `अतः आवश्यक दैनिक कार्य-समय ${answer} है।`);
  if (language === "pa") return replaceConclusion(question, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਰੋਜ਼ਾਨਾ ਕੰਮ-ਸਮਾਂ ${answer} ਹੈ।`);
  return replaceConclusion(question, `Therefore, the required daily working time is ${answer}.`);
}

function remediateQl115<T extends R2Question>(question: T, language: TmwR2Language): T {
  const answer = answerText(question);
  if (language === "hi") return replaceConclusion(question, `अतः उसी वास्तविक गति पर शेष काम पूरा करने में ${answer} और लगेंगे।`);
  if (language === "pa") return replaceConclusion(question, `ਇਸ ਲਈ ਇਸੇ ਅਸਲ ਗਤੀ ਨਾਲ ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ${answer} ਹੋਰ ਲੱਗਣਗੇ।`);
  return replaceConclusion(question, `Therefore, ${answer} more are required to finish the remaining work at the observed pace.`);
}

function remediateQl119<T extends R2Question>(question: T, language: TmwR2Language): T {
  const answer = answerText(question);
  if (language === "hi") return replaceConclusion(question, `अतः प्रत्येक कर्मचारी के लिए आवश्यक ओवरटाइम ${answer} है।`);
  if (language === "pa") return replaceConclusion(question, `ਇਸ ਲਈ ਹਰ ਕਰਮਚਾਰੀ ਲਈ ਲੋੜੀਂਦਾ ਓਵਰਟਾਈਮ ${answer} ਹੈ।`);
  return replaceConclusion(question, `Therefore, the required overtime for each remaining worker is ${answer}.`);
}

function remediateQl121<T extends R2Question>(question: T, language: TmwR2Language): T {
  let stem = question.stem;
  if (language === "en") {
    stem = stem
      .replace(/area or volume/gi, "volume")
      .replace(/area\/volume/gi, "volume");
  } else if (language === "hi") {
    stem = stem
      .replace(/क्षेत्रफल या आयतन/g, "आयतन")
      .replace(/क्षेत्रफल\/आयतन/g, "आयतन");
  } else {
    stem = stem
      .replace(/ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ/g, "ਆਇਤਨ")
      .replace(/ਖੇਤਰਫਲ\/ਆਇਤਨ/g, "ਆਇਤਨ");
  }
  return { ...question, stem };
}

export function applyTmw001EditorialRemediationR2Cp001To006<T extends R2Question>(
  question: T,
  qlId: string,
  language: TmwR2Language,
): T {
  switch (qlId) {
    case "TMW-QL-016": return remediateQl016(question, language);
    case "TMW-QL-028": return remediateQl028(question, language);
    case "TMW-QL-086": return remediateQl086(question, language);
    case "TMW-QL-108": return remediateQl108(question, language);
    case "TMW-QL-115": return remediateQl115(question, language);
    case "TMW-QL-119": return remediateQl119(question, language);
    case "TMW-QL-121": return remediateQl121(question, language);
    default: return question;
  }
}
