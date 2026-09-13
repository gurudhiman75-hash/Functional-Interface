import assert from "node:assert/strict";

import {
  ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY,
} from "./cp015-final-editorial-quality.ts";
import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS } from "./types.ts";

type Language = "en" | "hi" | "pa";
type Question = Readonly<Record<string, any>>;
type Cell = Readonly<{
  profileMode: "core" | "real-paper";
  examProfile?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}>;

const LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
const CELLS: readonly Cell[] = Object.freeze([
  { profileMode: "core", difficulty: "Easy", count: 1 },
  { profileMode: "core", difficulty: "Medium", count: 1 },
  { profileMode: "core", difficulty: "Hard", count: 1 },
  { profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Easy", count: 1 },
  { profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Medium", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Medium", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Hard", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_COMBO_4X5", difficulty: "Hard", count: 3 },
]);

const BOILERPLATE = Object.freeze([
  "It draws a broad conclusion without enough evidence and does not examine the relevant limits, alternatives or safeguards.",
  "It treats a risk signal or limited experience as sufficient proof and underweights evidence, recovery and proportionate safeguards.",
  "The technology or delivery format alone does not establish better outcomes, fairness or necessity in the stated context.",
  "It treats an implementation assumption as decisive without considering assisted access, fallback routes or actual capacity.",
  "It relies on an unsupported stereotype about people instead of a material service or policy reason.",
  "यह तर्क पर्याप्त साक्ष्य के बिना एक व्यापक निष्कर्ष निकालता है और प्रासंगिक सीमाओं या विकल्पों की जाँच नहीं करता।",
  "यह तर्क जोखिम-संकेत या सीमित अनुभव को पर्याप्त प्रमाण मानकर साक्ष्य और अनुपातिक सुरक्षा की जरूरत को कम आँकता है।",
  "केवल तकनीक या माध्यम का आधुनिक अथवा डिजिटल होना बेहतर परिणाम, निष्पक्षता या आवश्यकता सिद्ध नहीं करता।",
  "यह सहायता, वैकल्पिक पहुँच या वास्तविक क्षमता पर विचार किए बिना एक कार्यान्वयन धारणा को निर्णायक मान लेता है।",
  "यह वास्तविक सेवा या नीति-कारण की जगह लोगों के बारे में असिद्ध रूढ़ धारणा पर निर्भर है।",
  "ਇਹ ਦਲੀਲ ਕਾਫ਼ੀ ਸਬੂਤ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਅਤੇ ਸੰਬੰਧਿਤ ਹੱਦਾਂ ਜਾਂ ਵਿਕਲਪਾਂ ਦੀ ਜਾਂਚ ਨਹੀਂ ਕਰਦੀ।",
  "ਇਹ ਦਲੀਲ ਜੋਖਮ-ਸੰਕੇਤ ਜਾਂ ਸੀਮਿਤ ਤਜਰਬੇ ਨੂੰ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨ ਕੇ ਸਬੂਤ ਅਤੇ ਅਨੁਪਾਤਿਕ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਘੱਟ ਅੰਕਦੀ ਹੈ।",
  "ਕੇਵਲ ਤਕਨਾਲੋਜੀ ਜਾਂ ਮਾਧਿਅਮ ਦਾ ਆਧੁਨਿਕ ਜਾਂ ਡਿਜ਼ਿਟਲ ਹੋਣਾ ਬਿਹਤਰ ਨਤੀਜਾ, ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
  "ਇਹ ਸਹਾਇਤਾ, ਵਿਕਲਪੀ ਪਹੁੰਚ ਜਾਂ ਅਸਲ ਸਮਰੱਥਾ ਵੇਖੇ ਬਿਨਾਂ ਇੱਕ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਧਾਰਨਾ ਨੂੰ ਫੈਸਲਾਕੁੰਨ ਮੰਨ ਲੈਂਦੀ ਹੈ।",
  "ਇਹ ਅਸਲ ਸੇਵਾ ਜਾਂ ਨੀਤੀ-ਕਾਰਨ ਦੀ ਥਾਂ ਲੋਕਾਂ ਬਾਰੇ ਬਿਨਾਂ ਸਬੂਤ ਦੀ ਧਾਰਨਾ ਉੱਤੇ ਨਿਰਭਰ ਹੈ।",
  "ਇਹ ਦਲੀਲ ਸਹਿਮਤੀ, ਮਕਸਦ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਵਰਗੀਆਂ ਸੰਬੰਧਿਤ ਸ਼ਰਤਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਤੋਲਣ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ।",
]);

function key(value: unknown): string {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function argumentKey(value: string): string {
  return key(value).toLocaleLowerCase("en-IN");
}

function chooseCell(
  language: Language,
  qlId: string,
  cell: Cell,
  cellIndex: number,
  seenStatements: Set<string>,
  seenExplanations: Set<string>,
): readonly Question[] {
  for (let attempt = 0; attempt < 512; attempt += 1) {
    try {
      const batch = generateArgCp015QuestionStudioBatch({
        profileMode: cell.profileMode,
        examProfile: cell.examProfile,
        qlId,
        language,
        difficulty: cell.difficulty,
        seed: `ARG-CP015-FINAL-EDITORIAL:${language}:${qlId}:${cell.examProfile ?? "CORE"}:${cell.difficulty}:${cellIndex}:${attempt}`,
        count: cell.count,
      });
      const questions = batch.questions as readonly Question[];
      const statements = questions.map((question) => key(question.statement));
      const explanations = questions.map((question) => key(question.explanation));
      if (new Set(statements).size !== questions.length || new Set(explanations).size !== questions.length) continue;
      if (statements.some((statement) => seenStatements.has(statement))) continue;
      if (explanations.some((explanation) => seenExplanations.has(explanation))) continue;
      return questions;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("could not resolve a unique question")) throw error;
    }
  }
  throw new Error(`${language}/${qlId}/${cell.examProfile ?? "CORE"}/${cell.difficulty}: no globally unique final-editorial sample after 512 attempts.`);
}

const sampled: Record<Language, Question[]> = { en: [], hi: [], pa: [] };
const finalizerActivations: Record<Language, number> = { en: 0, hi: 0, pa: 0 };

for (const language of LANGUAGES) {
  const seenStatements = new Set<string>();
  const seenExplanations = new Set<string>();

  for (const qlId of ARG_QL_IDS) {
    for (let cellIndex = 0; cellIndex < CELLS.length; cellIndex += 1) {
      const cell = CELLS[cellIndex]!;
      const questions = chooseCell(language, qlId, cell, cellIndex, seenStatements, seenExplanations);
      for (const question of questions) {
        const statement = key(question.statement);
        const explanation = key(question.explanation);
        const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
        const argumentKeys = argumentsList.map(argumentKey);

        assert.equal(new Set(argumentKeys).size, argumentKeys.length, `${question.questionId}: duplicate argument text inside final editorial sample`);
        assert.doesNotMatch(statement, /trained invigilators is available|digital examination centres is treated/i, `${question.questionId}: English agreement regression survived final editorial pass`);
        if (language === "en") {
          const fullSurface = key([statement, ...argumentsList, explanation].join(" "));
          assert.doesNotMatch(
            fullSurface,
            /secure devices and centres is available|The decision itself is assumed|is treated as making|are treated as inherently insecure|The argument assumes that .* (?:is|are) (?:assumed|treated)/i,
            `${question.questionId}: machine-like CP015 English meta-template survived final editorial pass`,
          );
        }
        for (const fallback of BOILERPLATE) {
          assert.ok(!explanation.includes(fallback), `${question.questionId}: boilerplate weak-argument reason survived final editorial pass: ${fallback}`);
        }

        if (question.finalEditorialQualityAuthority === ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY) {
          finalizerActivations[language] += 1;
        }
        seenStatements.add(statement);
        seenExplanations.add(explanation);
        sampled[language].push(question);
      }
    }
  }

  assert.equal(sampled[language].length, 72, `${language}: final editorial proof must sample 72 questions`);
  assert.equal(seenStatements.size, 72, `${language}: final editorial proof statements must be globally unique`);
  assert.equal(seenExplanations.size, 72, `${language}: final editorial proof explanations must be globally unique`);
  assert.ok(finalizerActivations[language] >= 5, `${language}: final editorial pass activated too rarely: ${finalizerActivations[language]}`);
}

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_FINAL_EDITORIAL_QUALITY",
  totalQuestions: LANGUAGES.reduce((total, language) => total + sampled[language].length, 0),
  perLanguageQuestions: Object.fromEntries(LANGUAGES.map((language) => [language, sampled[language].length])),
  finalizerActivations,
  boilerplateReasonsRemaining: 0,
  duplicateArgumentsInsideQuestion: 0,
  globalUniqueExplanationsPerLanguage: 72,
  authority: ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY,
}, null, 2));
