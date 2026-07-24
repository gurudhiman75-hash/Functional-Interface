import {
  AVG_001_CP002_MULTILINGUAL_PILOT,
  getAvg001Cp002LocalizedQlIds,
  runAvg001Cp002LocalizationPilot as runBasePilot,
} from "./cp002-localization-pilot";
import type { Avg001QuestionPackage } from "./types";

export {
  AVG_001_CP002_MULTILINGUAL_PILOT,
  getAvg001Cp002LocalizedQlIds,
};

function middleTermExplanation(pkg: Avg001QuestionPackage, language: "hi" | "pa") {
  const values = pkg.parameters.renderVariables;
  const first = String(values.firstTerm ?? "");
  const last = String(values.lastTerm ?? "");
  const average = String(values.average ?? pkg.answer);

  if (language === "hi") {
    return {
      lines: [
        "विषम संख्या में समान अंतर वाले पदों का मध्य पद औसत के बराबर होता है।",
        `$$मध्य पद = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`,
        `$$मध्य पद = औसत = ${average}$$`,
        `अतः आवश्यक मध्य पद ${pkg.answer} है।`,
      ],
    };
  }

  return {
    lines: [
      "ਵਿਸ਼ਮ ਗਿਣਤੀ ਵਾਲੇ ਬਰਾਬਰ ਅੰਤਰ ਦੇ ਪਦਾਂ ਵਿੱਚ ਮੱਧਲਾ ਪਦ ਔਸਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
      `$$ਮੱਧਲਾ ਪਦ = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`,
      `$$ਮੱਧਲਾ ਪਦ = ਔਸਤ = ${average}$$`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮੱਧਲਾ ਪਦ ${pkg.answer} ਹੈ।`,
    ],
  };
}

export function runAvg001Cp002LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  const base = runBasePilot(input);
  if (base.solveMode !== "findMiddleTermFromAverage") return base;
  return {
    ...base,
    explanation: middleTermExplanation(base, input.language),
  };
}
