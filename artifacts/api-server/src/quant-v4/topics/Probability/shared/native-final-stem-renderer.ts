import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion } from "./types";
import { renderNativeExamStyleStem } from "./native-exam-style-renderer";

const num = (source: ProbabilityQuestion, key: string, fallback = 0): number => {
  const value = source.parameters[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

function qlNumber(source: ProbabilityQuestion): number {
  const match = source.questionLanguageId.match(/(\d+)$/u);
  return match ? Number(match[1]) : 0;
}

function hindiWomanCount(count: number): string {
  return count === 1 ? "1 महिला" : `${count} महिलाएँ`;
}

function punjabiWomanCount(count: number): string {
  return count === 1 ? "1 ਔਰਤ" : `${count} ਔਰਤਾਂ`;
}

function renderCommitteeCorrection(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  current: string,
): string {
  if (source.canonicalProblemId !== "PRB-CP-008") return current;
  if (!["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(source.solveMode)) return current;

  const men = num(source, "men");
  const women = num(source, "women");
  const size = num(source, "committeeSize");
  const requiredWomen = num(source, "requiredWomen", 1);

  if (source.solveMode === "findReverseCountFromProbability" && !/probability/iu.test(source.stem)) {
    return language === "hi"
      ? `${men} पुरुषों और ${women} महिलाओं में से ${size} सदस्यों की एक समिति बनाई जाती है। ऐसी कितनी समितियाँ बनाई जा सकती हैं जिनमें ठीक ${hindiWomanCount(requiredWomen)} हो?`
      : `${men} ਮਰਦਾਂ ਅਤੇ ${women} ਔਰਤਾਂ ਵਿੱਚੋਂ ${size} ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਅਜਿਹੀਆਂ ਕਿੰਨੀਆਂ ਕਮੇਟੀਆਂ ਬਣਾਈਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਠੀਕ ${punjabiWomanCount(requiredWomen)} ਹੋਵੇ?`;
  }

  if (language === "hi") {
    return current
      .replace(new RegExp(`ठीक ${requiredWomen} महिला होने`, "gu"), `ठीक ${hindiWomanCount(requiredWomen)} होने`)
      .replace(/ठीक (\d+) महिला होने/gu, (_match, count: string) => `ठीक ${hindiWomanCount(Number(count))} होने`);
  }
  return current
    .replace(new RegExp(`ਠੀਕ ${requiredWomen} ਔਰਤ ਹੋਣ`, "gu"), `ਠੀਕ ${punjabiWomanCount(requiredWomen)} ਹੋਣ`)
    .replace(/ਠੀਕ (\d+) ਔਰਤ ਹੋਣ/gu, (_match, count: string) => `ਠੀਕ ${punjabiWomanCount(Number(count))} ਹੋਣ`);
}

function renderFrequencyCorrection(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  current: string,
): string {
  if (source.solveMode !== "findProbabilityFromSimpleFrequencyTable") return current;
  const target = String(source.parameters.target ?? "red").toLowerCase();
  const variant = qlNumber(source) % 4;

  if (language === "hi") {
    const colour: Record<string, string> = { red: "लाल", blue: "नीला", green: "हरा" };
    const item = variant === 0 ? "गेंद" : variant === 1 ? "पेन" : variant === 2 ? "कंचा" : "रंगीन पत्थर";
    const verb = variant === 0 || variant === 3 ? "निकलने" : "चुने जाने";
    return current.replace(/उसके [^.?!]+ होने की प्रायिकता क्या है\?$/u, `${colour[target] ?? target} ${item} ${verb} की प्रायिकता क्या है?`);
  }

  const colour: Record<string, string> = { red: "ਲਾਲ", blue: "ਨੀਲਾ", green: "ਹਰਾ" };
  const item = variant === 0 ? "ਗੇਂਦ" : variant === 1 ? "ਪੈਨ" : variant === 2 ? "ਕੰਚਾ" : "ਰੰਗੀਨ ਪੱਥਰ";
  const verb = variant === 0 || variant === 3 ? "ਨਿਕਲਣ" : "ਚੁਣੇ ਜਾਣ";
  return current.replace(/ਉਸ ਦੇ [^.?!]+ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ\?$/u, `${colour[target] ?? target} ${item} ${verb} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`);
}

function polishHindi(source: ProbabilityQuestion, value: string): string {
  let stem = value;

  stem = stem
    .replace(/उसके इनाम वाला टिकट होने की प्रायिकता क्या है\?/gu, "इनाम वाला टिकट निकलने की प्रायिकता क्या है?")
    .replace(/(\d+) अभ्यर्थी के एक समूह/gu, "$1 अभ्यर्थियों के एक समूह")
    .replace(/(\d+) विद्यार्थी के एक समूह/gu, "$1 विद्यार्थियों के एक समूह")
    .replace(/के ठीक एक शर्त पूरी करने/gu, "के ठीक एक शर्त को पूरा करने")
    .replace(/के कोई भी शर्त पूरी न करने/gu, "के किसी भी शर्त को पूरा न करने")
    .replace(/दोनों शर्तें पूरी करने/gu, "दोनों शर्तों को पूरा करने")
    .replace(/कम-से-कम एक शर्त पूरी करने/gu, "कम-से-कम एक शर्त को पूरा करने")
    .replace(/चुने गए गेंदें में/gu, "चुनी गई गेंदों में")
    .replace(/चुने गए कंचे में/gu, "चुने गए कंचों में")
    .replace(/चुने गए पेन में/gu, "चुने गए पेनों में")
    .replace(/चुने गए रंगीन पत्थर में/gu, "चुने गए रंगीन पत्थरों में")
    .replace(/सभी चुने गए गेंदें/gu, "सभी चुनी गई गेंदें")
    .replace(/सभी चुने गए कंचे/gu, "सभी चुने गए कंचे")
    .replace(/सभी चुने गए पेन/gu, "सभी चुने गए पेन")
    .replace(/सभी चुने गए रंगीन पत्थर/gu, "सभी चुने गए रंगीन पत्थर");

  if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(source.solveMode) && source.canonicalProblemId === "PRB-CP-005") {
    const exact = num(source, "exactRed", 1);
    if (exact > 1) {
      stem = stem
        .replace(`ठीक ${exact} लाल गेंद होने`, `ठीक ${exact} लाल गेंदें होने`)
        .replace(`ठीक ${exact} लाल कंचा होने`, `ठीक ${exact} लाल कंचे होने`)
        .replace(`ठीक ${exact} लाल पेन होने`, `ठीक ${exact} लाल पेन होने`)
        .replace(`ठीक ${exact} लाल रंगीन पत्थर होने`, `ठीक ${exact} लाल रंगीन पत्थर होने`);
    }
  }

  return stem;
}

function polishPunjabi(source: ProbabilityQuestion, value: string): string {
  let stem = value;

  stem = stem
    .replace(/ਉਸ ਦੇ ਇਨਾਮ ਵਾਲਾ ਟਿਕਟ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ\?/gu, "ਇਨਾਮ ਵਾਲਾ ਟਿਕਟ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?")
    .replace(/(\d+) ਉਮੀਦਵਾਰ ਦੇ ਇੱਕ ਸਮੂਹ/gu, "$1 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ")
    .replace(/(\d+) ਵਿਦਿਆਰਥੀ ਦੇ ਇੱਕ ਸਮੂਹ/gu, "$1 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ")
    .replace(/ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ/gu, "ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ")
    .replace(/ਦੇ ਕੋਈ ਵੀ ਸ਼ਰਤ ਪੂਰੀ ਨਾ ਕਰਨ/gu, "ਦੇ ਕਿਸੇ ਵੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਾ ਕਰਨ")
    .replace(/ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਨ/gu, "ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਨੂੰ ਪੂਰਾ ਕਰਨ")
    .replace(/ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ/gu, "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ")
    .replace(/ਚੁਣੇ ਗੇਂਦਾਂ ਵਿੱਚ/gu, "ਚੁਣੀਆਂ ਗੇਂਦਾਂ ਵਿੱਚ")
    .replace(/ਚੁਣੇ ਕੰਚੇ ਵਿੱਚ/gu, "ਚੁਣੇ ਕੰਚਿਆਂ ਵਿੱਚ")
    .replace(/ਚੁਣੇ ਪੈਨ ਵਿੱਚ/gu, "ਚੁਣੇ ਪੈਨਾਂ ਵਿੱਚ")
    .replace(/ਚੁਣੇ ਰੰਗੀਨ ਪੱਥਰ ਵਿੱਚ/gu, "ਚੁਣੇ ਰੰਗੀਨ ਪੱਥਰਾਂ ਵਿੱਚ");

  if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(source.solveMode) && source.canonicalProblemId === "PRB-CP-005") {
    const exact = num(source, "exactRed", 1);
    if (exact > 1) {
      stem = stem
        .replace(`ਠੀਕ ${exact} ਲਾਲ ਗੇਂਦ ਹੋਣ`, `ਠੀਕ ${exact} ਲਾਲ ਗੇਂਦਾਂ ਹੋਣ`)
        .replace(`ਠੀਕ ${exact} ਲਾਲ ਕੰਚਾ ਹੋਣ`, `ਠੀਕ ${exact} ਲਾਲ ਕੰਚੇ ਹੋਣ`)
        .replace(`ਠੀਕ ${exact} ਲਾਲ ਪੈਨ ਹੋਣ`, `ਠੀਕ ${exact} ਲਾਲ ਪੈਨ ਹੋਣ`)
        .replace(`ਠੀਕ ${exact} ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ ਹੋਣ`, `ਠੀਕ ${exact} ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ ਹੋਣ`);
    }
  }

  return stem;
}

export function renderNativeFinalStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  let stem = renderNativeExamStyleStem(source, language);
  stem = renderCommitteeCorrection(source, language, stem);
  stem = renderFrequencyCorrection(source, language, stem);
  stem = language === "hi" ? polishHindi(source, stem) : polishPunjabi(source, stem);
  return stem.replace(/\s+/gu, " ").trim();
}
