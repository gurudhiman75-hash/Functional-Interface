import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS } from "./types.ts";

type Question = Readonly<Record<string, any>>;
type ReviewLanguage = "en" | "hi" | "pa";

type ReviewCell = Readonly<{
  label: string;
  profileMode: "core" | "real-paper";
  examProfile?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}>;

const REVIEW_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
const REVIEW_CELLS: readonly ReviewCell[] = Object.freeze([
  { label: "Core / Easy", profileMode: "core", difficulty: "Easy", count: 1 },
  { label: "Core / Medium", profileMode: "core", difficulty: "Medium", count: 1 },
  { label: "Core / Hard", profileMode: "core", difficulty: "Hard", count: 1 },
  { label: "SSC / Easy", profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Easy", count: 1 },
  { label: "SSC / Medium", profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Medium", count: 1 },
  { label: "Banking 2x5 / Medium", profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium", count: 1 },
  { label: "Banking 2x5 / Hard", profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard", count: 1 },
  { label: "Banking 3x5 / Medium", profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Medium", count: 1 },
  { label: "Banking 3x5 / Hard", profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Hard", count: 1 },
  { label: "Banking 4x5 / Hard", profileMode: "real-paper", examProfile: "BANKING_COMBO_4X5", difficulty: "Hard", count: 3 },
]);

function inline(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return JSON.stringify(value);
}

function block(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return JSON.stringify(value, null, 2);
}

function statementKey(question: Question): string {
  return String(question.statement ?? "").trim().replace(/\s+/g, " ");
}

function explanationKey(question: Question): string {
  return String(question.explanation ?? "").trim().replace(/\s+/g, " ");
}

function renderQuestion(question: Question, ordinal: number, label: string): string {
  const args = Array.isArray(question.arguments) ? question.arguments : [];
  const options = Array.isArray(question.options) ? question.options : [];
  const answer = question.answer ?? question.canonicalAnswer ?? options[Number(question.correctIndex)] ?? "";

  return [
    `### ${ordinal}. ${label}`,
    "",
    `- QL: ${inline(question.qlId)}`,
    `- Difficulty: ${inline(question.difficulty)}`,
    `- Profile: ${inline(question.examProfile ?? question.profileMode ?? "CORE")}`,
    `- Template: ${inline(question.templateId ?? "")}`,
    `- Scenario: ${inline(question.scenarioId ?? "")}`,
    `- Question ID: ${inline(question.questionId ?? "")}`,
    "",
    `**Statement:** ${inline(question.statement)}`,
    "",
    "**Arguments:**",
    ...args.map((argument: unknown, index: number) => `${index + 1}. ${inline(argument)}`),
    "",
    "**Options:**",
    ...options.map((option: unknown, index: number) => `${String.fromCharCode(65 + index)}. ${inline(option)}`),
    "",
    `**Correct answer:** ${inline(answer)} (index ${inline(question.correctIndex)})`,
    "",
    "**Explanation:**",
    block(question.explanation),
    "",
    "---",
    "",
  ].join("\n");
}

const reviewItems: Array<Readonly<{ language: ReviewLanguage; qlId: string; cell: ReviewCell; question: Question }>> = [];

for (const language of REVIEW_LANGUAGES) {
  for (const qlId of ARG_QL_IDS) {
    const seenStatements = new Set<string>();
    const seenExplanations = new Set<string>();

    for (let cellIndex = 0; cellIndex < REVIEW_CELLS.length; cellIndex += 1) {
      const cell = REVIEW_CELLS[cellIndex]!;
      let selected: readonly Question[] | undefined;

      for (let sampleAttempt = 0; sampleAttempt < 256; sampleAttempt += 1) {
        const seed = `ARG-CP015-HUMAN-REVIEW:${language}:${qlId}:${cell.examProfile ?? "CORE"}:${cell.difficulty}:${cellIndex}:${sampleAttempt}`;
        const batch = generateArgCp015QuestionStudioBatch({
          profileMode: cell.profileMode,
          examProfile: cell.examProfile,
          qlId,
          language,
          difficulty: cell.difficulty,
          seed,
          count: cell.count,
        });
        const candidates = batch.questions as readonly Question[];
        const statementKeys = candidates.map(statementKey);
        const explanationKeys = candidates.map(explanationKey);
        const uniqueWithinCandidate = new Set(statementKeys).size === candidates.length
          && new Set(explanationKeys).size === candidates.length;
        const newToReviewSet = statementKeys.every((key) => !seenStatements.has(key))
          && explanationKeys.every((key) => !seenExplanations.has(key));
        if (uniqueWithinCandidate && newToReviewSet) {
          selected = candidates;
          break;
        }
      }

      if (!selected) {
        throw new Error(`${language}/${qlId}/${cell.label}: unable to select a statement-and-explanation-unique human-review sample after 256 attempts.`);
      }

      for (const question of selected) {
        seenStatements.add(statementKey(question));
        seenExplanations.add(explanationKey(question));
        reviewItems.push(Object.freeze({ language, qlId, cell, question }));
      }
    }
  }
}

const expectedTotal = REVIEW_LANGUAGES.length * ARG_QL_IDS.length * 12;
if (reviewItems.length !== expectedTotal) {
  throw new Error(`ARG-001 CP015 review export expected ${expectedTotal} questions, got ${reviewItems.length}.`);
}

for (const language of REVIEW_LANGUAGES) {
  for (const qlId of ARG_QL_IDS) {
    const qlItems = reviewItems.filter((entry) => entry.language === language && entry.qlId === qlId);
    assert.equal(qlItems.length, 12, `${language}/${qlId}: human-review corpus must contain exactly 12 questions.`);

    const statements = qlItems.map((entry) => statementKey(entry.question));
    const duplicateStatements = [...new Set(statements.filter((statement, index) => statements.indexOf(statement) !== index))];
    assert.equal(
      new Set(statements).size,
      statements.length,
      `${language}/${qlId}: fresh human-review corpus contains repeated statements:\n${duplicateStatements.join("\n")}`,
    );

    const explanations = qlItems.map((entry) => explanationKey(entry.question));
    const duplicateExplanations = [...new Set(explanations.filter((explanation, index) => explanations.indexOf(explanation) !== index))];
    assert.equal(
      new Set(explanations).size,
      explanations.length,
      `${language}/${qlId}: fresh human-review corpus contains repeated explanations:\n${duplicateExplanations.join("\n\n")}`,
    );
  }
}

for (const { language, cell, question } of reviewItems) {
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  const surface = [String(question.statement ?? ""), ...argumentsList, String(question.explanation ?? "")].join(" ");
  const isCombo = cell.examProfile === "BANKING_COMBO_3X5" || cell.examProfile === "BANKING_COMBO_4X5";

  if (language === "en") {
    assert.doesNotMatch(surface, /\bthe\s+the\b/i, `${question.questionId}: duplicated article regression in CP015 review surface`);
    assert.doesNotMatch(surface, /\b(?:A single|every)\s+(?:a|an)\b/i, `${question.questionId}: stacked complaint article regression in CP015 review surface`);
    assert.doesNotMatch(surface, /\b(?:Receiving|ignoring)\s+(?:impersonation|cheating) complaint\b/i, `${question.questionId}: missing complaint article regression in CP015 explanation`);
    assert.doesNotMatch(surface, /\bClear (?:model answer points|evaluation criteria) helps\b/i, `${question.questionId}: plural agreement regression in CP015 combo argument`);
    assert.doesNotMatch(surface, /\b(?:model answer points|evaluation criteria) is clearly shown\b/i, `${question.questionId}: plural agreement regression in CP015 combo statement`);
    assert.doesNotMatch(surface, /\b(?:evaluation criteria|model answer points) is necessary\b/i, `${question.questionId}: plural agreement regression in CP015 combo explanation`);
    assert.doesNotMatch(surface, /A relevant post-process information/i, `${question.questionId}: ungrammatical post-process explanation regression`);
    assert.doesNotMatch(surface, /ability to achieve ability to/i, `${question.questionId}: duplicated ability phrase leaked into English two-argument review surface`);
    assert.doesNotMatch(surface, /\b(?:modules|tutorials|webinars) leads to better learning\b/i, `${question.questionId}: digital-training subject-verb regression`);
    assert.doesNotMatch(
      surface,
      /Appearance is a trivial consideration here|Popularity or imitation does not establish material value|It gives a direct transparency benefit|It states a plausible security mechanism|The absolute guarantee is unsupported|It gives a practical queue-management benefit|Being modern does not establish fairness or necessity/i,
      `${question.questionId}: generic pre-CP015 explanation boilerplate leaked into fresh English human review corpus`,
    );
    if (isCombo) {
      assert.equal(
        question.comboEditorialAuthority,
        "ARG_CP015_COMBO_EDITORIAL_NATURALIZATION_V1",
        `${question.questionId}: English Banking combo human-review item must use CP015 combo editorial authority`,
      );
    }
  } else if (language === "hi") {
    assert.doesNotMatch(
      surface,
      /अनिवार्य अनिवार्य|लक्षित निस्तारण अवधि दिखाया|(?:स्टॉप अलर्ट|ट्यूटोरियल सत्र) देनी चाहिए|दूसरे कारक की पुष्टि पूरा|आईरिस सत्यापन उपयोग|निजी कारों (?:प्रतिबंधित|सीमित)|सुरक्षा संपर्क बदलना कर|रिकॉर्ड किए वीडियो मॉड्यूल/,
      `${question.questionId}: known Hindi two-argument grammar regression leaked into human review corpus`,
    );
    if (isCombo) {
      assert.equal(
        question.localizedComboEditorialAuthority,
        "ARG_CP015_LOCALIZED_COMBO_EDITORIAL_NATURALIZATION_V1",
        `${question.questionId}: localized Banking combo human-review item must use CP015 localized combo editorial authority`,
      );
      assert.equal(
        question.localizedComboPolishAuthority,
        "ARG_CP015_LOCALIZED_COMBO_SURFACE_POLISH_V1",
        `${question.questionId}: localized Banking combo human-review item must pass through CP015 localized surface polish`,
      );
      assert.equal(
        question.localizedComboResidualPolishAuthority,
        "ARG_CP015_LOCALIZED_COMBO_RESIDUAL_POLISH_V1",
        `${question.questionId}: localized Banking combo human-review item must pass through CP015 residual localized polish`,
      );
      assert.doesNotMatch(
        surface,
        /यह सीधा पारदर्शिता लाभ बताता है।|यहाँ रूप-सज्जा एक तुच्छ विचार है।|लोकप्रियता या नकल वास्तविक महत्व सिद्ध नहीं करती।|यह विश्वसनीय सुरक्षा तंत्र बताता है।|पूर्ण गारंटी का दावा असमर्थित है।|यह व्यावहारिक कतार-प्रबंधन लाभ बताता है।|आधुनिक होना न्यायसंगतता या आवश्यकता सिद्ध नहीं करता।/,
        `${question.questionId}: generic pre-CP015 Hindi combo explanation boilerplate leaked into human review corpus`,
      );
      assert.doesNotMatch(
        surface,
        /शाम के व्यस्त समय के समय|स्कूल छुट्टी के समय के दौरान|भुगतान खाता में|(?:मानक प्रमाणपत्र|नियमित दस्तावेज|पंजीकरण|शुल्क भुगतान) सेवाओं लेने|निगरानी निगरानी|एक खरीदार शिकायत|एक नकल शिकायत|एक कदाचार आरोप|स्पष्ट (?:मॉडल उत्तर बिंदु|मूल्यांकन मानदंड)[^।.!?]*मदद करता है|यदि (?:मॉडल उत्तर बिंदु|मूल्यांकन मानदंड) बदल सकता है|(?:स्थान ट्रैकिंग|लगातार स्क्रीन रिकॉर्डिंग) कौन-सा डेटा एकत्र करता है|(?:स्थान ट्रैकिंग|लगातार स्क्रीन रिकॉर्डिंग) कैसे काम करता है/,
        `${question.questionId}: pre-polish Hindi combo grammar leaked into human review corpus`,
      );
    }
  } else {
    assert.doesNotMatch(
      surface,
      /ਲਾਜ਼ਮੀ ਲਾਜ਼ਮੀ|ਲਕਸ਼ਿਤ ਨਿਪਟਾਰਾ ਮਿਆਦ ਦਿਖਾਇਆ|ਲਾਕ ਲਗਾਉਣਾ ਕਰ|(?:ਟਿਊਟੋਰਿਅਲ|ਸਹਾਇਤਾ) ਸੈਸ਼ਨ ਦੇਣੀਆਂ|ਰਿਮਾਈਂਡਰ ਭੇਜਣੀ|ਲਚਕੀਲਾ ਸ਼ੁਰੂਆਤੀ ਸਮਾਂ ਦੀ|ਮੁੜ-ਪ੍ਰੀਖਿਆ ਕਰਾਉਣਾ ਚਾਹੀਦਾ|ਦੁਰਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਤੋਂ|ਟ੍ਰੈਫਿਕ ਰੋਕਣੀਆਂ/,
      `${question.questionId}: known Punjabi two-argument grammar regression leaked into human review corpus`,
    );
    if (isCombo) {
      assert.equal(
        question.localizedComboEditorialAuthority,
        "ARG_CP015_LOCALIZED_COMBO_EDITORIAL_NATURALIZATION_V1",
        `${question.questionId}: localized Banking combo human-review item must use CP015 localized combo editorial authority`,
      );
      assert.equal(
        question.localizedComboPolishAuthority,
        "ARG_CP015_LOCALIZED_COMBO_SURFACE_POLISH_V1",
        `${question.questionId}: localized Banking combo human-review item must pass through CP015 localized surface polish`,
      );
      assert.equal(
        question.localizedComboResidualPolishAuthority,
        "ARG_CP015_LOCALIZED_COMBO_RESIDUAL_POLISH_V1",
        `${question.questionId}: localized Banking combo human-review item must pass through CP015 residual localized polish`,
      );
      assert.doesNotMatch(
        surface,
        /ਇਹ ਸਿੱਧਾ ਪਾਰਦਰਸ਼ਤਾ ਲਾਭ ਦੱਸਦਾ ਹੈ।|ਇੱਥੇ ਦਿੱਖ ਇੱਕ ਮਾਮੂਲੀ ਵਿਚਾਰ ਹੈ।|ਲੋਕਪ੍ਰਿਯਤਾ ਜਾਂ ਨਕਲ ਅਸਲ ਮਹੱਤਵ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।|ਇਹ ਭਰੋਸੇਯੋਗ ਸੁਰੱਖਿਆ ਤਰੀਕਾ ਦੱਸਦਾ ਹੈ।|ਪੂਰੀ ਗਾਰੰਟੀ ਦਾ ਦਾਅਵਾ ਬਿਨਾਂ ਆਧਾਰ ਹੈ।|ਇਹ ਵਿਆਵਹਾਰਿਕ ਕਤਾਰ-ਪ੍ਰਬੰਧਨ ਲਾਭ ਦੱਸਦਾ ਹੈ।|ਆਧੁਨਿਕ ਹੋਣਾ ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।/,
        `${question.questionId}: generic pre-CP015 Punjabi combo explanation boilerplate leaked into human review corpus`,
      );
      assert.doesNotMatch(
        surface,
        /ਨਿਗਰਾਨੀ ਨਿਗਰਾਨੀ|ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਨਿਗਰਾਨੀ|ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ ਨਿਗਰਾਨੀ|ਇੱਕ ਖਰੀਦਦਾਰ ਸ਼ਿਕਾਇਤ|ਇੱਕ ਨਕਲ ਦੀ ਸ਼ਿਕਾਇਤ|ਇੱਕ ਗਲਤ ਵਿਹਾਰ ਦਾ ਦੋਸ਼|ਸਪੱਸ਼ਟ (?:ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ|ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ)[^।.!?]*ਮਦਦ ਕਰਦਾ ਹੈ|ਜੇ (?:ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ|ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ) ਬਦਲ ਸਕਦਾ ਹੈ|(?:ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ|ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ) ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ|(?:ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ|ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ) ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ/,
        `${question.questionId}: pre-polish Punjabi combo grammar leaked into human review corpus`,
      );
    }
  }
}

const outDir = resolve(process.cwd(), "dist", "arg-001-cp015-human-review");
mkdirSync(outDir, { recursive: true });

const jsonPayload = Object.freeze({
  packageId: "ARG-001",
  checkpointId: "ARG-CP-015",
  purpose: "FRESH_TRILINGUAL_HUMAN_EDITORIAL_REVIEW",
  supportedReviewLanguages: REVIEW_LANGUAGES,
  questionsPerQlPerLanguage: 12,
  totalQuestions: reviewItems.length,
  qlIds: ARG_QL_IDS,
  cells: REVIEW_CELLS,
  items: reviewItems.map(({ language, qlId, cell, question }, index) => ({
    ordinal: index + 1,
    language,
    qlId,
    reviewCell: cell.label,
    question,
  })),
});

writeFileSync(resolve(outDir, "arg-cp015-human-review.json"), `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf8");

const languageTitles: Readonly<Record<ReviewLanguage, string>> = Object.freeze({
  en: "English",
  hi: "Hindi",
  pa: "Punjabi",
});

for (const language of REVIEW_LANGUAGES) {
  const languageItems = reviewItems.filter((entry) => entry.language === language);
  const markdown: string[] = [
    `# ARG-001 CP015 ${languageTitles[language]} Human Review Corpus`,
    "",
    "Purpose: fresh editorial review after the deterministic diversity gate. This file is not a public-release approval.",
    "",
    `Language: ${language}`,
    `Total questions: ${languageItems.length}`,
    "Questions per QL: 12",
    "Coverage per QL: Core Easy/Medium/Hard; SSC Easy/Medium; Banking 2x5 Medium/Hard; Banking 3x5 Medium/Hard; Banking 4x5 Hard x3.",
    "",
  ];

  let ordinal = 0;
  for (const qlId of ARG_QL_IDS) {
    markdown.push(`## ${qlId}`, "");
    for (const item of languageItems.filter((entry) => entry.qlId === qlId)) {
      ordinal += 1;
      markdown.push(renderQuestion(item.question, ordinal, item.cell.label));
    }
  }

  const suffix = language === "en" ? "" : `-${language}`;
  writeFileSync(resolve(outDir, `arg-cp015-human-review${suffix}.md`), `${markdown.join("\n")}\n`, "utf8");
}

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_TRILINGUAL_HUMAN_REVIEW_EXPORT",
  totalQuestions: reviewItems.length,
  questionsPerQlPerLanguage: 12,
  languages: REVIEW_LANGUAGES,
  exactStatementDuplicatesPerLanguageQl: 0,
  exactExplanationDuplicatesPerLanguageQl: 0,
  deterministicDiversityAwareSampling: true,
  comboEditorialRegressionGuards: true,
  localizedComboEditorialRegressionGuards: true,
  localizedComboSurfacePolishRequired: true,
  localizedComboResidualPolishRequired: true,
  explicitTwoArgumentLocalizationRegressionGuards: true,
  outputDirectory: outDir,
}, null, 2));
