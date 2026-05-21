import type {
  LanguageCode,
  LocalizedRealization,
} from "../contracts/language-contracts";
import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type { RealizationProfile } from "../../editorial/realization-profiles";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";
import type { EditorialIntent } from "../intents/editorial-intents";
import { extractEditorialIntents } from "../intents/intent-extractor";
import { getLanguageRenderer } from "../languages";
import { renderLocalizedStem } from "./stem-renderer";
import { localizeReasoningFragments } from "../../semantic/reasoningLexicon";
import { normalizeTeacherExplanation } from "../../quality/teacher-explanation-normalizer";
import { semanticAnswerText } from "../../editorial/contextual-humanization";
import { renderRelationalPercentageExplanation } from "../../editorial/relation-explanation";

function normalizedRenderedLabel(text: string) {
  return text
    .replace(/[:=]\s*$/u, "")
    .replace(/\s+(?:is|are)$/iu, "")
    .trim()
    .toLowerCase();
}

function suppressRenderedLabelCollisions<T extends { renderedText: string }>(
  lines: readonly T[],
) {
  return lines.filter((line, index) => {
    const previous = lines[index - 1];
    if (!previous) {
      return true;
    }

    if (!previous.renderedText.trim().endsWith(":")) {
      return true;
    }
    if (!line.renderedText.trim().endsWith("=")) {
      return true;
    }

    return (
      normalizedRenderedLabel(previous.renderedText) !==
      normalizedRenderedLabel(line.renderedText)
    );
  });
}

function suppressAdjacentLabelEndings<
  T extends { renderedText: string; kind: EditorialIntent["kind"] },
>(lines: readonly T[]) {
  return lines.filter((line, index) => {
    const next = lines[index + 1];
    if (!next) {
      return true;
    }
    return !(
      line.kind === "label" &&
      line.renderedText.trim().endsWith(":") &&
      next.kind === "ending" &&
      /^[^\d=]+=\s*\S/u.test(next.renderedText.trim())
    );
  });
}

function incompleteFinalLine(line: string | undefined) {
  const trimmed = String(line ?? "").trim();
  return (
    trimmed.length === 0 ||
    /[:=]\s*$/u.test(trimmed) ||
    /(?:[+\-*/xX]|\()\s*$/u.test(trimmed) ||
    !/\d/u.test(trimmed)
  );
}

const ASCII_WORD_RE = /\b[A-Za-z]{2,}\b/u;

const LOCALIZED_FALLBACKS: Record<Exclude<LanguageCode, "en">, Array<[RegExp, string]>> = {
  hi: [
    [/^Change %\s*:?$/u, "परिवर्तन प्रतिशत:"],
    [/^Change %\s*=$/u, "परिवर्तन प्रतिशत ="],
    [/^Profit %\s*:?$/u, "लाभ प्रतिशत:"],
    [/^Profit %\s*=$/u, "लाभ प्रतिशत ="],
    [/^Loss %\s*:?$/u, "हानि प्रतिशत:"],
    [/^Loss %\s*=$/u, "हानि प्रतिशत ="],
    [/^Remaining part\s*:?$/u, "बचा हुआ भाग:"],
    [/^Remaining part\s*=$/u, "बचा हुआ भाग ="],
    [/^Apply the next relation\s*:?$/u, "अगला संबंध लगाएं:"],
    [/^Value after this relation\s*:?$/u, "इस संबंध के बाद मान:"],
    [/^Value after this relation\s*=$/u, "इस संबंध के बाद मान ="],
    [/^After adding the bonus\s*:?$/u, "बोनस जोड़ने के बाद:"],
    [/^Increase percentage\s*:?$/u, "वृद्धि प्रतिशत:"],
    [/^Increase percentage\s*=$/u, "वृद्धि प्रतिशत ="],
    [/^Decrease percentage\s*:?$/u, "कमी प्रतिशत:"],
    [/^Decrease percentage\s*=$/u, "कमी प्रतिशत ="],
    [/^Required marks gap\s*:?$/u, "आवश्यक अंकों का अंतर:"],
    [/^Required marks gap\s*=$/u, "आवश्यक अंकों का अंतर ="],
    [/^Total marks gap\s*:?$/u, "अंकों का कुल अंतर:"],
    [/^Total marks gap\s*=$/u, "अंकों का कुल अंतर ="],
    [/^Percentage gap\s*:?$/u, "प्रतिशत अंतर:"],
    [/^Percentage gap\s*=$/u, "प्रतिशत अंतर ="],
    [/^Required percentage gap\s*:?$/u, "आवश्यक प्रतिशत अंतर:"],
    [/^Required percentage gap\s*=$/u, "आवश्यक प्रतिशत अंतर ="],
    [/^Population added by migration\s*:?$/u, "प्रवास से जोड़ी गई जनसंख्या:"],
    [/^Population added by migration\s*=$/u, "प्रवास से जोड़ी गई जनसंख्या ="],
    [/^Required increase %\s*:?$/u, "आवश्यक वृद्धि प्रतिशत:"],
    [/^Required increase %\s*=$/u, "आवश्यक वृद्धि प्रतिशत ="],
    [/^Registered voters\s*:?$/u, "पंजीकृत मतदाता:"],
    [/^Registered voters\s*=$/u, "पंजीकृत मतदाता ="],
    [/^Water remains unchanged\.$/u, "पानी की मात्रा समान रहेगी।"],
    [/^Water quantity\s*:?$/u, "पानी की मात्रा:"],
    [/^Water quantity\s*=$/u, "पानी की मात्रा ="],
  ],
  pa: [
    [/^Change %\s*:?$/u, "ਬਦਲਾਅ ਪ੍ਰਤੀਸ਼ਤ:"],
    [/^Change %\s*=$/u, "ਬਦਲਾਅ ਪ੍ਰਤੀਸ਼ਤ ="],
    [/^Profit %\s*:?$/u, "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ:"],
    [/^Profit %\s*=$/u, "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ="],
    [/^Loss %\s*:?$/u, "ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ:"],
    [/^Loss %\s*=$/u, "ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ ="],
    [/^Remaining part\s*:?$/u, "ਬਚਿਆ ਹੋਇਆ ਹਿੱਸਾ:"],
    [/^Remaining part\s*=$/u, "ਬਚਿਆ ਹੋਇਆ ਹਿੱਸਾ ="],
    [/^Apply the next relation\s*:?$/u, "ਅਗਲਾ ਸੰਬੰਧ ਲਗਾਓ:"],
    [/^Value after this relation\s*:?$/u, "ਇਸ ਸੰਬੰਧ ਤੋਂ ਬਾਅਦ ਮੁੱਲ:"],
    [/^Value after this relation\s*=$/u, "ਇਸ ਸੰਬੰਧ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ="],
    [/^After adding the bonus\s*:?$/u, "ਬੋਨਸ ਜੋੜਨ ਤੋਂ ਬਾਅਦ:"],
    [/^Increase percentage\s*:?$/u, "ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ:"],
    [/^Increase percentage\s*=$/u, "ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ ="],
    [/^Decrease percentage\s*:?$/u, "ਕਮੀ ਪ੍ਰਤੀਸ਼ਤ:"],
    [/^Decrease percentage\s*=$/u, "ਕਮੀ ਪ੍ਰਤੀਸ਼ਤ ="],
    [/^Required marks gap\s*:?$/u, "ਲੋੜੀਂਦੇ ਅੰਕਾਂ ਦਾ ਅੰਤਰ:"],
    [/^Required marks gap\s*=$/u, "ਲੋੜੀਂਦੇ ਅੰਕਾਂ ਦਾ ਅੰਤਰ ="],
    [/^Total marks gap\s*:?$/u, "ਅੰਕਾਂ ਦਾ ਕੁੱਲ ਅੰਤਰ:"],
    [/^Total marks gap\s*=$/u, "ਅੰਕਾਂ ਦਾ ਕੁੱਲ ਅੰਤਰ ="],
    [/^Percentage gap\s*:?$/u, "ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ:"],
    [/^Percentage gap\s*=$/u, "ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ ="],
    [/^Required percentage gap\s*:?$/u, "ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ:"],
    [/^Required percentage gap\s*=$/u, "ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ ="],
    [/^Population added by migration\s*:?$/u, "ਪਰਵਾਸ ਨਾਲ ਜੋੜੀ ਗਈ ਆਬਾਦੀ:"],
    [/^Population added by migration\s*=$/u, "ਪਰਵਾਸ ਨਾਲ ਜੋੜੀ ਗਈ ਆਬਾਦੀ ="],
    [/^Required increase %\s*:?$/u, "ਲੋੜੀਂਦਾ ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ:"],
    [/^Required increase %\s*=$/u, "ਲੋੜੀਂਦਾ ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ ="],
    [/^Registered voters\s*:?$/u, "ਰਜਿਸਟਰਡ ਵੋਟਰ:"],
    [/^Registered voters\s*=$/u, "ਰਜਿਸਟਰਡ ਵੋਟਰ ="],
    [/^Water remains unchanged\.$/u, "ਪਾਣੀ ਦੀ ਮਾਤਰਾ ਇੱਕੋ ਰਹੇਗੀ।"],
    [/^Water quantity\s*:?$/u, "ਪਾਣੀ ਦੀ ਮਾਤਰਾ:"],
    [/^Water quantity\s*=$/u, "ਪਾਣੀ ਦੀ ਮਾਤਰਾ ="],
  ],
};

function suppressEnglishFallbackLabel(
  text: string,
  language: LanguageCode,
) {
  if (language === "en" || !ASCII_WORD_RE.test(text)) {
    return text;
  }

  let output = text;
  for (const [pattern, replacement] of LOCALIZED_FALLBACKS[language]) {
    output = output.replace(pattern, replacement);
  }
  return output;
}

function valueAfterEquals(text: string) {
  return /=\s*(.+)$/u.exec(text.trim())?.[1]?.trim();
}

function stripRestoreAnswerSuffix(value: string) {
  return value
    .trim()
    .replace(/\s+(?:increase|decrease|वृद्धि|कमी|ਵਾਧਾ|ਕਮੀ)$/iu, "")
    .trim();
}

function localizedFinalAnswerLabel(
  problem: CanonicalPercentageProblem,
  language: LanguageCode,
  englishStem = "",
) {
  const variant = problem.topology?.variant;
  const reverseStem = englishStem.toLowerCase();

  if (language === "hi") {
    if (problem.subtype === "pass_fail") return "अधिकतम अंक";
    if (problem.subtype === "population_growth") return "अंतिम जनसंख्या";
    if (problem.subtype === "mixture_percentage") return "डाला जाने वाला दूध";
    if (problem.subtype === "restore_original") return "आवश्यक वृद्धि";
    if (problem.subtype === "price_consumption") return "खपत में कमी";
    if (problem.subtype === "salary_revision") return "वेतन में बदलाव";
    if (problem.subtype === "profit_loss") {
      return problem.answer < 0 ? "हानि प्रतिशत" : "लाभ प्रतिशत";
    }
    if (problem.subtype === "reverse_percentage") {
      if (/\bmarks?\b|\bscore\b/.test(reverseStem)) return "अधिकतम अंक";
      if (/\bpopulation\b|\bpeople\b/.test(reverseStem)) return "कुल जनसंख्या";
      if (/\bapplicants?\b|\bcandidates?\b/.test(reverseStem)) return "कुल आवेदक";
      if (/\bvoters?\b|\bvotes?\b/.test(reverseStem)) return "कुल मतदाता";
      return "कुल चीनी स्टॉक";
    }
    if (problem.subtype === "election_margin") {
      if (variant === "filtered_valid_vote_margin") {
        return "विजयी उम्मीदवार के वोट";
      }
      if (variant === "turnout_margin") {
        return "पंजीकृत मतदाता";
      }
      return "कुल डाले गए वोट";
    }
    return "अंतिम मान";
  }

  if (language === "pa") {
    if (problem.subtype === "pass_fail") return "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ";
    if (problem.subtype === "population_growth") return "ਅੰਤਿਮ ਆਬਾਦੀ";
    if (problem.subtype === "mixture_percentage") return "ਪਾਇਆ ਜਾਣ ਵਾਲਾ ਦੁੱਧ";
    if (problem.subtype === "restore_original") return "ਲੋੜੀਂਦਾ ਵਾਧਾ";
    if (problem.subtype === "price_consumption") return "ਖਪਤ ਵਿੱਚ ਕਮੀ";
    if (problem.subtype === "salary_revision") return "ਤਨਖਾਹ ਵਿੱਚ ਬਦਲਾਅ";
    if (problem.subtype === "profit_loss") {
      return problem.answer < 0 ? "ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ" : "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ";
    }
    if (problem.subtype === "reverse_percentage") {
      if (/\bmarks?\b|\bscore\b/.test(reverseStem)) return "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ";
      if (/\bpopulation\b|\bpeople\b/.test(reverseStem)) return "ਕੁੱਲ ਆਬਾਦੀ";
      if (/\bapplicants?\b|\bcandidates?\b/.test(reverseStem)) return "ਕੁੱਲ ਅਰਜ਼ੀਦਾਰ";
      if (/\bvoters?\b|\bvotes?\b/.test(reverseStem)) return "ਕੁੱਲ ਵੋਟਰ";
      return "ਕੁੱਲ ਚੀਨੀ ਸਟਾਕ";
    }
    if (problem.subtype === "election_margin") {
      if (variant === "filtered_valid_vote_margin") {
        return "ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਦੇ ਵੋਟ";
      }
      if (variant === "turnout_margin") {
        return "ਰਜਿਸਟਰਡ ਵੋਟਰ";
      }
      return "ਕੁੱਲ ਪਏ ਵੋਟ";
    }
    return "ਅੰਤਿਮ ਮੁੱਲ";
  }

  if (problem.subtype === "pass_fail") return "Maximum marks";
  if (problem.subtype === "population_growth") return "Final population";
  if (problem.subtype === "mixture_percentage") return "Milk to be added";
  if (problem.subtype === "restore_original") return "Required increase";
  if (problem.subtype === "price_consumption") return "Reduction in consumption";
  if (problem.subtype === "salary_revision") return "Salary change";
  if (problem.subtype === "profit_loss") {
    return problem.answer < 0 ? "Loss percentage" : "Profit percentage";
  }
  if (problem.subtype === "reverse_percentage") {
    if (/\bmarks?\b|\bscore\b/.test(reverseStem)) return "Maximum marks";
    if (/\bpopulation\b|\bpeople\b/.test(reverseStem)) return "Total population";
    if (/\bapplicants?\b|\bcandidates?\b/.test(reverseStem)) return "Total applicants";
    if (/\bvoters?\b|\bvotes?\b/.test(reverseStem)) return "Total voters";
    return "Total sugar stock";
  }
  if (problem.subtype === "election_margin") {
    if (variant === "filtered_valid_vote_margin") {
      return "Winning candidate's votes";
    }
    if (variant === "turnout_margin") {
      return "Registered voters";
    }
    return "Total votes polled";
  }
  return "Final value";
}

function cleanFinalValueForProblem(
  problem: CanonicalPercentageProblem,
  value: string,
) {
  if (
    problem.subtype === "restore_original" ||
    problem.subtype === "price_consumption" ||
    problem.subtype === "salary_revision" ||
    problem.subtype === "profit_loss"
  ) {
    return stripRestoreAnswerSuffix(value);
  }
  return value.trim();
}

function localizedProblemSpecificLabel(input: {
  text: string;
  language: LanguageCode;
  problem: CanonicalPercentageProblem;
  englishStem?: string;
  intent: EditorialIntent;
}) {
  if (input.intent.kind !== "label") {
    return input.text;
  }

  const source = input.intent.sourceText.trim();
  const sourceLabel = source.replace(/\s*[:=]\s*$/u, "");
  const suffix = source.endsWith("=") ? " =" : ":";

  if (
    input.problem.subtype === "reverse_percentage" &&
    /^(?:Total quantity(?: is)?|Total sugar stock|Total applicants|Total population|Total voters)$/iu.test(sourceLabel)
  ) {
    return `${localizedFinalAnswerLabel(
      input.problem,
      input.language,
      input.englishStem,
    )}${suffix}`;
  }

  if (/^Total marks gap$/iu.test(sourceLabel)) {
    if (input.language === "hi") return `अंकों का कुल अंतर${suffix}`;
    if (input.language === "pa") return `ਅੰਕਾਂ ਦਾ ਕੁੱਲ ਅੰਤਰ${suffix}`;
    return `Total marks gap${suffix}`;
  }
  if (/^Percentage gap$/iu.test(sourceLabel)) {
    if (input.language === "hi") return `प्रतिशत अंतर${suffix}`;
    if (input.language === "pa") return `ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ${suffix}`;
    return `Percentage gap${suffix}`;
  }
  if (/^Required percentage gap$/iu.test(sourceLabel)) {
    if (input.language === "hi") return `आवश्यक प्रतिशत अंतर${suffix}`;
    if (input.language === "pa") return `ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ${suffix}`;
    return `Required percentage gap${suffix}`;
  }

  if (input.problem.subtype === "population_growth") {
    if (/^Population added by migration$/iu.test(sourceLabel)) {
      if (input.language === "hi") return `प्रवास से जोड़ी गई जनसंख्या${suffix}`;
      if (input.language === "pa") return `ਪਰਵਾਸ ਨਾਲ ਜੋੜੀ ਗਈ ਆਬਾਦੀ${suffix}`;
      return `Population added by migration${suffix}`;
    }
    if (/^Male population$/iu.test(sourceLabel)) {
      if (input.language === "hi") return `पुरुष जनसंख्या${suffix}`;
      if (input.language === "pa") return `ਮਰਦ ਆਬਾਦੀ${suffix}`;
      return `Male population${suffix}`;
    }
    if (/^Female population$/iu.test(sourceLabel)) {
      if (input.language === "hi") return `महिला जनसंख्या${suffix}`;
      if (input.language === "pa") return `ਔਰਤ ਆਬਾਦੀ${suffix}`;
      return `Female population${suffix}`;
    }
    if (/^Male population after growth$/iu.test(sourceLabel)) {
      if (input.language === "hi") return `वृद्धि के बाद पुरुष जनसंख्या${suffix}`;
      if (input.language === "pa") return `ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਮਰਦ ਆਬਾਦੀ${suffix}`;
      return `Male population after growth${suffix}`;
    }
    if (/^Female population after (?:reduction|decrease)$/iu.test(sourceLabel)) {
      if (input.language === "hi") return `कमी के बाद महिला जनसंख्या${suffix}`;
      if (input.language === "pa") return `ਕਮੀ ਤੋਂ ਬਾਅਦ ਔਰਤ ਆਬਾਦੀ${suffix}`;
      return `Female population after reduction${suffix}`;
    }
    if (/^Final population$/iu.test(sourceLabel)) {
      if (input.language === "hi") return `अंतिम जनसंख्या${suffix}`;
      if (input.language === "pa") return `ਅੰਤਿਮ ਆਬਾਦੀ${suffix}`;
      return `Final population${suffix}`;
    }
  }

  if (
    input.problem.subtype === "election_margin" &&
    /^Winner'?s votes(?: are)?$/iu.test(sourceLabel)
  ) {
    if (input.language === "hi") return `विजयी उम्मीदवार के वोट${suffix}`;
    if (input.language === "pa") return `ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਦੇ ਵੋਟ${suffix}`;
    return `Winning candidate's votes${suffix}`;
  }

  if (
    input.problem.subtype === "mixture_percentage" &&
    /^Milk to be added$/iu.test(sourceLabel)
  ) {
    if (input.language === "hi") return `डाला जाने वाला दूध${suffix}`;
    if (input.language === "pa") return `ਪਾਇਆ ਜਾਣ ਵਾਲਾ ਦੁੱਧ${suffix}`;
    return `Milk to be added${suffix}`;
  }
  if (
    input.problem.subtype === "mixture_percentage" &&
    /^Water quantity$/iu.test(sourceLabel)
  ) {
    if (input.language === "hi") return `पानी की मात्रा${suffix}`;
    if (input.language === "pa") return `ਪਾਣੀ ਦੀ ਮਾਤਰਾ${suffix}`;
    return `Water quantity${suffix}`;
  }

  return input.text;
}

function polishProblemSpecificEnding(input: {
  text: string;
  language: LanguageCode;
  problem: CanonicalPercentageProblem;
  englishStem?: string;
  intent: EditorialIntent;
}) {
  if (input.intent.kind !== "ending" || input.intent.params?.prefix === "=") {
    return input.text;
  }

  const value = valueAfterEquals(input.text);
  if (!value) {
    return input.text;
  }

  const cleanValue = cleanFinalValueForProblem(input.problem, value);
  const label = localizedFinalAnswerLabel(
    input.problem,
    input.language,
    input.englishStem,
  );
  return `${label} = ${cleanValue}`;

}

export function renderLocalizedRealization(input: {
  language: LanguageCode;
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
  realizationProfile?: RealizationProfile;
}): LocalizedRealization {
  if (input.problem.subtype === "relational_percentage") {
    const stem = renderLocalizedStem(input);
    const explanation = renderRelationalPercentageExplanation(
      input.problem,
      input.language,
    );
    return {
      language: input.language,
      stem,
      explanation,
      lines: explanation.split("\n").map((line) => ({
        intentKey: "fallback.english",
        sourceText: line,
        renderedText: line,
        kind: "narration",
        fallbackUsed: false,
      })),
      coverage: {
        totalIntentLines: 0,
        localizedIntentLines: 0,
        fallbackCount: 0,
        missingIntents: [],
      },
    };
  }

  const renderer = getLanguageRenderer(input.language);
  const intents = extractEditorialIntents(input.editorial);
  const lines = intents.map((intent) => {
    const renderedText = renderer.renderIntent(intent, {
      problem: input.problem,
      graph: input.graph,
      editorial: input.editorial,
      intent,
    });
    const localizedText = suppressEnglishFallbackLabel(
      normalizeTeacherExplanation(
        localizeReasoningFragments(renderedText, input.language),
        input.language,
      ),
      input.language,
    );
    const labelPolishedText = localizedProblemSpecificLabel({
      text: localizedText,
      language: input.language,
      problem: input.problem,
      englishStem: input.editorial.stem,
      intent,
    });
    const polishedText = polishProblemSpecificEnding({
      text: labelPolishedText,
      language: input.language,
      problem: input.problem,
      englishStem: input.editorial.stem,
      intent,
    });
    return {
      intentKey: intent.key,
      sourceText: intent.sourceText,
      renderedText: polishedText,
      kind: intent.kind,
      fallbackUsed:
        input.language !== "en" &&
        intent.kind !== "blank" &&
        intent.kind !== "equation" &&
        polishedText === intent.fallbackText,
    };
  });
  const displayLines = suppressAdjacentLabelEndings(
    suppressRenderedLabelCollisions(lines),
  );
  let lastNonBlank = [...displayLines]
    .reverse()
    .find((line) => line.renderedText.trim().length > 0);

  if (incompleteFinalLine(lastNonBlank?.renderedText)) {
    while (
      displayLines.length > 0 &&
      incompleteFinalLine(displayLines.at(-1)?.renderedText) &&
      displayLines.at(-1)?.kind !== "equation"
    ) {
      displayLines.pop();
    }
    lastNonBlank = [...displayLines]
      .reverse()
      .find((line) => line.renderedText.trim().length > 0);
    const answer = semanticAnswerText(input.problem);
    const finalIntent: EditorialIntent = {
      key: /%/u.test(answer) ? "ending.required_percentage" : "ending.required_value",
      kind: "ending",
      sourceText: `Required answer = ${answer}`,
      fallbackText: `Required answer = ${answer}`,
      params: {
        value: answer,
      },
    };
    const renderedText = suppressEnglishFallbackLabel(
      normalizeTeacherExplanation(
        localizeReasoningFragments(
          renderer.renderIntent(finalIntent, {
            problem: input.problem,
            graph: input.graph,
            editorial: input.editorial,
            intent: finalIntent,
          }),
          input.language,
        ),
        input.language,
      ),
      input.language,
    );
    const polishedText = polishProblemSpecificEnding({
      text: renderedText,
      language: input.language,
      problem: input.problem,
      englishStem: input.editorial.stem,
      intent: finalIntent,
    });
    displayLines.push({
      intentKey: finalIntent.key,
      sourceText: finalIntent.sourceText,
      renderedText: polishedText,
      kind: finalIntent.kind,
      fallbackUsed: false,
    });
  }
  const missingIntents = [
    ...new Set(
      lines
        .filter((line) => line.fallbackUsed)
        .map((line) => line.intentKey),
    ),
  ];
  const stem = renderLocalizedStem(input);

  const explanation = displayLines.map((line) => line.renderedText).join("\n");

  return {
    language: input.language,
    stem,
    explanation,
    lines: displayLines,
    coverage: {
      totalIntentLines: lines.filter(
        (line) => line.kind !== "blank" && line.kind !== "equation",
      ).length,
      localizedIntentLines: lines.filter(
        (line) =>
          line.kind !== "blank" &&
          line.kind !== "equation" &&
          !line.fallbackUsed,
      ).length,
      fallbackCount: lines.filter((line) => line.fallbackUsed).length,
      missingIntents,
    },
  };
}
