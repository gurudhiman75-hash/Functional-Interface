import { required } from "./cp001-helpers";
import type { TmwCp004GeneratedQuestion } from "./cp004-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import {
  cp004Actor,
  cp004Copy,
  cp004Job,
  cp004Time,
} from "./localization-cp004-language";

function inflect(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/\b(\d+) दिन में\b/g, "$1 दिनों में")
      .replace(/\b(\d+) दिन के भीतर\b/g, "$1 दिनों के भीतर")
      .replaceAll("का काम में", "के काम में");
  }
  return value
    .replace(/\b(\d+) ਦਿਨ ਵਿੱਚ\b/g, "$1 ਦਿਨਾਂ ਵਿੱਚ")
    .replace(/\b(\d+) ਦਿਨ ਦੇ ਅੰਦਰ\b/g, "$1 ਦਿਨਾਂ ਦੇ ਅੰਦਰ")
    .replaceAll("ਦਾ ਕੰਮ ਵਿੱਚ", "ਦੇ ਕੰਮ ਵਿੱਚ");
}

export function inflectTmwCp004LocalizedQuestion(
  question: TmwLocalizedQuestion,
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const p = source.parameters;
  const A = cp004Actor(p, language, "actorA");
  const B = cp004Actor(p, language, "actorB");
  const assignment = cp004Job(p, language);
  let stem = inflect(question.stem, language);
  let shortcutSteps = question.explanation.shortcut.steps.map((step) => inflect(step, language));

  if (source.solveMode === "findRemainingWorkAfterInitialPhase") {
    shortcutSteps = [cp004Copy(
      language,
      `पहले चरण का काम दर × समय से निकालकर 1 में से घटाएँ; ${question.solution.answerText} भाग शेष है।`,
      `ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਦਰ × ਸਮੇਂ ਨਾਲ ਕੱਢ ਕੇ 1 ਵਿੱਚੋਂ ਘਟਾਓ; ${question.solution.answerText} ਹਿੱਸਾ ਬਾਕੀ ਹੈ।`,
    )];
  }

  if (source.solveMode === "findJoinTimeFromFinalCompletion") {
    stem = stem.replace(
      cp004Copy(language, `तो ${B} कितने समय बाद जुड़ा?`, `ਤਾਂ ${B} ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਜੁੜਿਆ?`),
      cp004Copy(language, `तो ${B} की भागीदारी कितने समय बाद शुरू हुई?`, `ਤਾਂ ${B} ਦੀ ਭਾਗੀਦਾਰੀ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਈ?`),
    );
  }

  if (source.solveMode === "findLeaveTimeFromFinalCompletion") {
    stem = stem.replace(
      cp004Copy(language, `तो ${A} कितने समय बाद गया?`, `ਤਾਂ ${A} ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਗਿਆ?`),
      cp004Copy(language, `तो ${A} की भागीदारी कितने समय बाद समाप्त हुई?`, `ਤਾਂ ${A} ਦੀ ਭਾਗੀਦਾਰੀ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਖਤਮ ਹੋਈ?`),
    );
  }

  if (source.solveMode === "findRequiredRemainingRateForDeadline") {
    const soloTime = cp004Time(p, required(p.timeA, "timeA"), language);
    const firstDuration = cp004Time(p, required(p.durationA, "durationA"), language);
    const deadline = cp004Time(p, required(p.deadline, "deadline"), language);
    stem = cp004Copy(
      language,
      `${assignment} अकेले पूरा करने में ${A} को ${soloTime} लगते हैं। शुरुआती ${firstDuration} तक उसी दर से काम होता है। पूरा काम शुरू से ${deadline} के भीतर समाप्त होना चाहिए। शुरुआती चरण के बाद आवश्यक औसत दैनिक दर क्या है?`,
      `${assignment} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${A} ਨੂੰ ${soloTime} ਲੱਗਦੇ ਹਨ। ਸ਼ੁਰੂਆਤੀ ${firstDuration} ਤੱਕ ਉਸੇ ਦਰ ਨਾਲ ਕੰਮ ਹੁੰਦਾ ਹੈ। ਸਾਰਾ ਕੰਮ ਸ਼ੁਰੂ ਤੋਂ ${deadline} ਦੇ ਅੰਦਰ ਮੁਕੰਮਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਦਰ ਕੀ ਹੈ?`,
    );
    stem = inflect(stem, language);
  }

  if (source.solveMode === "findEarlyCompletionAfterWorkerJoins") {
    stem = stem.replace(
      cp004Copy(
        language,
        `केवल ${A} के अंत तक अकेले काम करने की तुलना में काम कितने समय पहले पूरा होगा?`,
        `ਸਿਰਫ਼ ${A} ਦੇ ਅੰਤ ਤੱਕ ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਵਾਲੀ ਸਥਿਤੀ ਨਾਲੋਂ ਕੰਮ ਕਿੰਨਾ ਸਮਾਂ ਪਹਿਲਾਂ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      ),
      cp004Copy(
        language,
        `यदि अंत तक काम केवल ${A} से होता, तो उस स्थिति की तुलना में काम कितने समय पहले पूरा होगा?`,
        `ਜੇ ਅੰਤ ਤੱਕ ਕੰਮ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦਾ, ਤਾਂ ਉਸ ਸਥਿਤੀ ਨਾਲੋਂ ਕੰਮ ਕਿੰਨਾ ਸਮਾਂ ਪਹਿਲਾਂ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      ),
    );
  }

  return {
    ...question,
    stem,
    explanation: {
      ...question.explanation,
      shortcut: {
        ...question.explanation.shortcut,
        steps: shortcutSteps,
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: inflect(question.explanation.commonTrap.explanation, language),
      },
      conclusion: inflect(question.explanation.conclusion, language),
    },
  };
}
