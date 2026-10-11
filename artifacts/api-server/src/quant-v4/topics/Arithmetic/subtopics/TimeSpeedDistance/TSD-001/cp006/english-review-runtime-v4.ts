import { generateCp006EnglishReviewSetV3, type TsdCp006EnglishReviewQuestionV3 } from "./english-review-runtime-v3";

export type TsdCp006EnglishReviewQuestionV4 = Omit<TsdCp006EnglishReviewQuestionV3, "stem" | "options" | "correctIndex" | "answerText" | "explanation" | "presentationVersion" | "lifecycle"> & Readonly<{
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerText: string;
  explanation: Readonly<{ readonly steps: readonly [string, string] }>;
  presentationVersion: "V4_LEARNER_POLISH";
  lifecycle: Readonly<{
    englishReviewStatus: "REVIEW_CANDIDATE_V4";
    englishFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

function grammar(text: string): string {
  return text
    .replace(/\ba 18-minute\b/g, "an 18-minute")
    .replace(/\b1\/2 laps\b/g, "1/2 lap")
    .replace(/\bTwo Joggers\b/g, "Two joggers")
    .replace(/\bA faster Athlete A\b/g, "Athlete A, who is faster,")
    .replace(/\bA faster ([A-Z][A-Za-z ]+ A)\b/g, "$1, who is faster,")
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function visibleObjectFamily(stem: string, family: string): string {
  if (stem.toLowerCase().includes(family.toLowerCase())) return stem;

  let out = stem
    .replace(/^Two participants\b/, `${family} A and ${family} B`)
    .replace(/^Three participants\b/, `${family} A, ${family} B and ${family} C`)
    .replace(/^three participants\b/, `${family} A, ${family} B and ${family} C`)
    .replace(/^Three runners\b/, `${family} A, ${family} B and ${family} C`)
    .replace(/^three runners\b/, `${family} A, ${family} B and ${family} C`)
    .replace(/^Runners A, B and C\b/, `${family} A, ${family} B and ${family} C`)
    .replace(/^A, B and C\b/, `${family} A, ${family} B and ${family} C`);

  if (!out.toLowerCase().includes(family.toLowerCase())) {
    out = out.replace(/\bA and B\b/, `${family} A and ${family} B`);
  }
  if (!out.toLowerCase().includes(family.toLowerCase())) {
    out = `${family} A and ${family} B use the route. ${out}`;
  }

  // Three-runner rows sometimes introduce A/B but leave C generic. Once the family is visible,
  // label the first standalone C as well when a third speed is part of the source state.
  if (/\bC\b/.test(out) && !out.includes(`${family} C`)) {
    out = out.replace(/\bC\b/, `${family} C`);
  }
  return out;
}

function polishExplanation(row: TsdCp006EnglishReviewQuestionV3): readonly [string, string] {
  return row.explanation.steps.map((step) => grammar(step)
    .replace(/must gain that wrap-around arc/g, "must close that clockwise lead")
    .replace(/the wrap-around arc/g, "the clockwise lead")) as unknown as readonly [string, string];
}

export function generateCp006EnglishReviewSetV4(): readonly TsdCp006EnglishReviewQuestionV4[] {
  return Object.freeze(generateCp006EnglishReviewSetV3().map((row) => {
    const answerText = grammar(row.answerText);
    const options = Object.freeze(row.options.map(grammar));
    const correctIndex = options.indexOf(answerText);
    if (correctIndex < 0) throw new Error(`${row.seed}: CP006 V4 answer missing from polished options`);
    if (new Set(options).size !== 4) throw new Error(`${row.seed}: CP006 V4 polishing collapsed option uniqueness`);

    return Object.freeze({
      ...row,
      stem: grammar(visibleObjectFamily(grammar(row.stem), row.objectFamily)),
      options,
      correctIndex,
      answerText,
      explanation: Object.freeze({ steps: Object.freeze(polishExplanation(row)) as readonly [string, string] }),
      presentationVersion: "V4_LEARNER_POLISH" as const,
      lifecycle: Object.freeze({
        englishReviewStatus: "REVIEW_CANDIDATE_V4" as const,
        englishFreezeStatus: "UNFROZEN" as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    });
  }));
}
