import { generateCp006EnglishReviewSetV4, type TsdCp006EnglishReviewQuestionV4 } from "./english-review-runtime-v4";

export type TsdCp006EnglishReviewQuestionV5 = Omit<TsdCp006EnglishReviewQuestionV4, "stem" | "options" | "correctIndex" | "answerText" | "presentationVersion" | "lifecycle"> & Readonly<{
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerText: string;
  presentationVersion: "V5_FINAL_EDITORIAL_CANDIDATE";
  lifecycle: Readonly<{
    englishReviewStatus: "REVIEW_CANDIDATE_V5";
    englishFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

const STEM_OVERRIDES = Object.freeze(new Map<string, string>([
  ["cp006-en-v1:TSD-QL-077:2", "On a 300 m closed running track, Athlete B moves at 48 m/min. Athlete A moves in the same direction and overtakes Athlete B 4 times in 50 minutes. Find Athlete A's speed."],
  ["cp006-en-v1:TSD-QL-078:3", "Recruit A, Recruit B and Recruit C start together from P on a 360 m stadium loop at 54 m/min, 36 m/min and 18 m/min. After how many minutes will all three next be at P together?"],
  ["cp006-en-v1:TSD-QL-078:6", "Racer A, Racer B and Racer C start together from the same line on a 600 m athletics loop at 90 m/min, 60 m/min and 30 m/min. When will all three next return to the starting line together?"],
  ["cp006-en-v1:TSD-QL-079:5", "Sports cadet A, Sports cadet B and Sports cadet C start together on a 480 m closed training loop. A and B move clockwise at 75 m/min and 45 m/min, while C moves anticlockwise at 25 m/min. Find their first common meeting time after the start."],
  ["cp006-en-v1:TSD-QL-080:5", "Jogger A, Jogger B and Jogger C start together on a 480 m closed training loop. A and B move clockwise at 75 m/min and 45 m/min, while C moves anticlockwise at 25 m/min. Find the recurring meeting periods for AB, AC and BC, in that order."],
]));

function fixLapGrammar(text: string): string {
  const mixedFractionFixed = text.replace(/\b(\d+) (\d+\/\d+) lap\b/g, "$1 $2 laps");
  return mixedFractionFixed === "1/2 laps" ? "1/2 lap" : mixedFractionFixed;
}

export function generateCp006EnglishReviewSetV5(): readonly TsdCp006EnglishReviewQuestionV5[] {
  return Object.freeze(generateCp006EnglishReviewSetV4().map((row) => {
    const answerText = fixLapGrammar(row.answerText);
    const options = Object.freeze(row.options.map(fixLapGrammar));
    const correctIndex = options.indexOf(answerText);
    if (correctIndex < 0) throw new Error(`${row.seed}: CP006 V5 answer missing from options`);
    if (new Set(options).size !== 4) throw new Error(`${row.seed}: CP006 V5 option uniqueness changed`);
    return Object.freeze({
      ...row,
      stem: STEM_OVERRIDES.get(row.seed) ?? row.stem,
      options,
      correctIndex,
      answerText,
      presentationVersion: "V5_FINAL_EDITORIAL_CANDIDATE" as const,
      lifecycle: Object.freeze({
        englishReviewStatus: "REVIEW_CANDIDATE_V5" as const,
        englishFreezeStatus: "UNFROZEN" as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    });
  }));
}
