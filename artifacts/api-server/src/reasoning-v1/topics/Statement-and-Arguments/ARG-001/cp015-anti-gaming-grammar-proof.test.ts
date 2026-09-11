import assert from "node:assert/strict";

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

const MALFORMED: Readonly<Record<Language, readonly RegExp[]>> = Object.freeze({
  en: Object.freeze([
    /\bmost\s+(?:ten|genuine|legitimate|employee)\b/i,
    /disappear largely/i,
    /in most [a-z-]+(?: [a-z-]+)* programme\b/i,
    /service needs should rarely affect the timings/i,
    /most [a-z-]+ programme\b/i,
    /\bcan rarely\b/i,
    /\bshould rarely\b/i,
    /\bmust apparently\b/i,
    /\bmost (?:citizen|visitor|part|people else)\b/i,
    /\bin most context\b/i,
    /\bwill readily become available\b/i,
    /\bwill work readily\b/i,
    /\bmost use of\b/i,
    /\bpermanently impractical\b/i,
    /\bwill predictably create permanent gridlock\b/i,
    /\bcan occur mainly when guilt is certain\b/i,
    /should be treated as sufficient to solve the queue problem/i,
    /will largely solve most related difficult/i,
    /\bis generally proof of fraud\b/i,
    /\btrained invigilators is available\b/i,
    /\bdigital examination centres is treated\b/i,
  ]),
  hi: Object.freeze([
    /अधिकांश दस दिन/,
    /अधिकांश [^।,.]+ कार्यक्रम में/,
    /अनजाने उल्लंघनों काफी हद तक समाप्त/,
    /अधिकांश कर्मचारी को/,
    /अवश्य देते हैं/,
    /(?:पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) का वास्तविक बदलावों/,
    /(?:पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) के वैध बदलावों विफल होंगे/,
    /भुगतान खाते के वैध बदलावों विफल होंगे/,
    /भुगतान खाता में/,
    /अक्सर के लिए/,
    /(?:नगरपालिका सेवा केंद्रों|सरकारी अस्पतालों) उपयोग करते समय/,
    /(?:आगंतुकों|नागरिकों) जो/,
    /(?:रिमोट|कॉन्ट्रैक्ट) कर्मचारियों में जो भी/,
    /फील्ड स्टाफ में जो भी/,
    /डेटा संग्रह का उद्देश्य क्या है के बारे में/,
    /का अधिकांश अभ्यर्थी और केंद्र प्रभावित था/,
    /अधिकांश केंद्र का परिणाम/,
    /अधिकांश (?:पेपर लीक का आरोप|नकल की शिकायत) अनदेखी करनी होगी/,
    /एक नकल की शिकायत ही सिद्ध करता है/,
    /गृह-राज्य से बाहर कार्ड लेन-देन की अधिकांश घटना/,
  ]),
  pa: Object.freeze([
    /ਅਕਸਰਂ/,
    /ਸ਼ਾਇਦੀ/,
    /ਜ਼ਿਆਦਾਤਰ ਕਿਸੇ ਦੇ/,
    /ਜ਼ਿਆਦਾਤਰ [^।,.]+ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ/,
    /ਲਾਜ਼ਮੀ ਦਿੰਦੇ ਹਨ/,
    /ਲੋਕਾਂ ਜੋ/,
    /ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ[^।.!?]*ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/,
    /ਨਿਰਧਾਰਤ ਮੁਲਾਕਾਤ ਸਲਾਟ[^।.!?]*ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/,
    /ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ[^।.!?]*ਜੋਖਮ ਨੂੰ ਸੰਬੋਧ ਸਕਦੀ ਹੈ/,
    /ਦੀ ਜ਼ਿਆਦਾਤਰ ਘਟਨਾ ਜਾਂ ਤਾਂ ਧੋਖਾਧੜੀ/,
    /ਜ਼ਿਆਦਾਤਰ ਨਾਗਰਿਕ ਕੋਲ/,
    /(?:ਦਫ਼ਤਰਾਂ|ਹਸਪਤਾਲਾਂ) ਵਰਤਦੇ ਸਮੇਂ/,
    /ਟ੍ਰੇਨੀਜ਼ ਦੀ ਨਾਮ/,
    /ਭੁਗਤਾਨ ਖਾਤਾ (?:ਦੀ|ਨਾਲ)/,
    /ਲੈਣ-ਦੇਣ ਸੀਮਾ ਦਾ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬਦਲਾਅ/,
    /ਭੁਗਤਾਨ ਖਾਤਾ ਬਦਲਣ ਦੀ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬੇਨਤੀ/,
    /ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਯਾਦ ਰੱਖਣ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ/,
    /ਜ਼ਿਆਦਾਤਰ ਕਿਸੇ ਦੀ ਭਵਿੱਖ/,
    /ਕਾਫ਼ੀ ਸਥਿਰ ਕਨੈਕਟਿਵਿਟੀ[^।.!?]*ਉਪਲਬਧ ਹੋ ਜਾਣਗੇ/,
    /ਜ਼ਿਆਦਾਤਰ ਕੇਂਦਰ ਦਾ ਨਤੀਜਾ/,
    /ਸਥਾਈ ਜਾਮ ਸ਼ਾਇਦ ਹੋ ਜਾਵੇਗਾ/,
  ]),
});

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function argumentKey(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
}

function sampleCell(language: Language, qlId: string, cell: Cell, cellIndex: number): readonly Question[] {
  for (let attempt = 0; attempt < 256; attempt += 1) {
    try {
      const batch = generateArgCp015QuestionStudioBatch({
        profileMode: cell.profileMode,
        examProfile: cell.examProfile,
        qlId,
        language,
        difficulty: cell.difficulty,
        seed: `ARG-CP015-GRAMMAR:${language}:${qlId}:${cell.examProfile ?? "CORE"}:${cell.difficulty}:${cellIndex}:${attempt}`,
        count: cell.count,
      });
      if (batch.questions.length === cell.count) return batch.questions as readonly Question[];
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("could not resolve a unique question")) throw error;
    }
  }
  throw new Error(`${language}/${qlId}/${cell.examProfile ?? "CORE"}/${cell.difficulty}: grammar sampler could not resolve a valid deterministic cell.`);
}

let sampledQuestions = 0;
let sampledArguments = 0;
let grammarPolishedQuestions = 0;
let localizedQl006T04Checked = 0;

for (const language of LANGUAGES) {
  for (const qlId of ARG_QL_IDS) {
    for (let cellIndex = 0; cellIndex < CELLS.length; cellIndex += 1) {
      const cell = CELLS[cellIndex]!;
      const questions = sampleCell(language, qlId, cell, cellIndex);
      for (const question of questions) {
        sampledQuestions += 1;
        if (question.antiGamingGrammarPolishAuthority) grammarPolishedQuestions += 1;
        const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
        sampledArguments += argumentsList.length;

        const grammarSurface = [
          String(question.statement ?? ""),
          ...argumentsList,
          String(question.explanation ?? ""),
        ].join(" ");
        for (const pattern of MALFORMED[language]) {
          assert.doesNotMatch(
            grammarSurface,
            pattern,
            `${question.questionId}: malformed grammar leaked into final CP015 question surface`,
          );
        }

        const argumentKeys = argumentsList.map(argumentKey);
        assert.equal(
          new Set(argumentKeys).size,
          argumentKeys.length,
          `${question.questionId}: duplicate argument text inside one CP015 question`,
        );

        for (const [argumentIndex, argument] of argumentsList.entries()) {
          if (question.examProfile === "SSC_RECENT_2X4") {
            assert.ok(words(argument) <= 34, `${question.questionId}/argument-${argumentIndex + 1}: SSC argument exceeds 34 words after grammar polish`);
          }
        }

        if (question.templateId === "ARG-CP003-QL006-T04" && (language === "hi" || language === "pa")) {
          localizedQl006T04Checked += 1;
          const explanation = String(question.explanation ?? "");
          if (language === "hi") {
            assert.doesNotMatch(explanation, /नाम सार्वजनिक/);
            assert.match(explanation, /प्रमाण और प्रभाव-क्षेत्र की जाँच जरूरी है/);
            assert.match(explanation, /प्रमाण की जाँच करके अनुपातिक कार्रवाई कर सकता है/);
          } else {
            assert.doesNotMatch(explanation, /ਨਾਂ ਜਨਤਕ/);
            assert.match(explanation, /ਸਬੂਤ ਅਤੇ ਪ੍ਰਭਾਵ ਦਾ ਦਾਇਰਾ ਜਾਂਚਣਾ ਲਾਜ਼ਮੀ ਹੈ/);
            assert.match(explanation, /ਸਬੂਤ ਜਾਂਚ ਕੇ ਅਨੁਪਾਤਿਕ ਕਾਰਵਾਈ ਕਰ ਸਕਦੀ ਹੈ/);
          }
        }
      }
    }
  }
}

assert.equal(sampledQuestions, 216);
assert.ok(sampledArguments >= 500, `Grammar proof sampled too few arguments: ${sampledArguments}`);
assert.ok(grammarPolishedQuestions >= 10, `Grammar polish activated on too few sampled questions: ${grammarPolishedQuestions}`);
assert.ok(localizedQl006T04Checked >= 2, `Localized QL006 T04 semantic mapping sampled too few times: ${localizedQl006T04Checked}`);

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_ANTI_GAMING_GRAMMAR",
  sampledQuestions,
  sampledArguments,
  grammarPolishedQuestions,
  localizedQl006T04Checked,
  fullQuestionSurfaceChecked: true,
  languages: LANGUAGES,
}, null, 2));
