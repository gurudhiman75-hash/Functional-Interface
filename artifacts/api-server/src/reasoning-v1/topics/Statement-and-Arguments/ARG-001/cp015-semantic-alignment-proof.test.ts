import assert from "node:assert/strict";

import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";

type Question = Readonly<Record<string, any>>;
type Language = "hi" | "pa";

const ROMAN = ["I", "II", "III", "IV"] as const;

function strengths(question: Question): readonly string[] {
  return Array.isArray(question.argumentStrengths) ? question.argumentStrengths.map(String) : [];
}

function reasons(question: Question, language: Language): readonly string[] {
  const explanation = String(question.explanation ?? "");
  const args = Array.isArray(question.arguments) ? question.arguments : [];
  const labels = args.map((_: unknown, index: number) => language === "hi" ? `तर्क ${ROMAN[index]} ` : `ਦਲੀਲ ${ROMAN[index]} `);
  return labels.map((label: string, index: number) => {
    const start = explanation.indexOf(label);
    assert.ok(start >= 0, `${question.questionId}: missing ${label} in explanation`);
    const colon = explanation.indexOf(": ", start);
    assert.ok(colon >= 0, `${question.questionId}: missing reason delimiter for ${label}`);
    const next = labels[index + 1];
    const end = next ? explanation.indexOf(next, colon + 2) : explanation.length;
    return explanation.slice(colon + 2, end < 0 ? explanation.length : end).trim();
  });
}

const cells = [
  { profileMode: "core" as const, difficulty: "Easy" as const },
  { profileMode: "core" as const, difficulty: "Medium" as const },
  { profileMode: "core" as const, difficulty: "Hard" as const },
  { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard" as const },
] as const;

let hindiQueueSufficiencyChecked = 0;
let punjabiContactSufficiencyChecked = 0;
let punjabiApprovalSurfaceChecked = 0;
let punjabiApprovalAnecdoteChecked = 0;
let englishNewDeviceReviewChecked = 0;

for (const language of ["hi", "pa"] as const) {
  for (const cell of cells) {
    for (let seedIndex = 0; seedIndex < 96; seedIndex += 1) {
      const batch = generateArgCp015QuestionStudioBatch({
        profileMode: cell.profileMode,
        examProfile: "examProfile" in cell ? cell.examProfile : undefined,
        qlId: "ARG-QL-001",
        language,
        difficulty: cell.difficulty,
        seed: `ARG-CP015-SEMANTIC-ALIGNMENT:${language}:${cell.profileMode}:${"examProfile" in cell ? cell.examProfile : "CORE"}:${cell.difficulty}:${seedIndex}`,
        count: 1,
      });
      const question = batch.questions[0] as Question;
      const args = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
      const rs = reasons(question, language);
      const ss = strengths(question);

      for (let index = 0; index < args.length; index += 1) {
        if (ss[index]?.toUpperCase() !== "WEAK") continue;
        const argument = args[index]!;
        const reason = rs[index]!;

        if (language === "hi" && /कतार/.test(argument) && /(?:पर्याप्त|काफ़ी|इसी उपाय)/.test(argument)) {
          hindiQueueSufficiencyChecked += 1;
          assert.doesNotMatch(reason, /कार्यान्वयन अवरोध/, `${question.questionId}: Hindi queue-sufficiency argument routed to unrelated implementation-obstacle reason`);
          assert.doesNotMatch(reason, /(?:शिकायत|फ्लैग).*निर्णायक प्रमाण/, `${question.questionId}: Hindi queue-sufficiency argument routed to unrelated complaint-evidence reason`);
          assert.match(reason, /कतार/, `${question.questionId}: Hindi queue-sufficiency reason must stay tied to the queue claim`);
          assert.match(reason, /(?:मांग|सेवा-क्षमता|अकेले|इसी उपाय)/, `${question.questionId}: Hindi queue-sufficiency reason must explain why one measure is insufficient`);
        }

        if (language === "pa" && /(?:ਮਦਦ ਨੰਬਰ|ਹੈਲਪਲਾਈਨ|ਸੰਪਰਕ ਨੰਬਰ|ਸੰਪਰਕ)/.test(argument) && /(?:ਕਾਫ਼ੀ|ਇਸ ਸੰਪਰਕ|ਇਸੇ ਸੰਪਰਕ)/.test(argument)) {
          punjabiContactSufficiencyChecked += 1;
          assert.doesNotMatch(reason, /(?:ਦੋਸ਼ ਦਾ ਫੈਸਲਾਕੁੰਨ ਸਬੂਤ|ਜਾਂਚ ਦਾ ਆਧਾਰ)/, `${question.questionId}: Punjabi contact-sufficiency argument routed to unrelated guilt-evidence reason`);
          assert.match(reason, /ਸੰਪਰਕ/, `${question.questionId}: Punjabi contact-sufficiency reason must stay tied to the contact claim`);
          assert.match(reason, /(?:ਹਰ ਸੇਵਾ|ਭੁਗਤਾਨ|ਕਾਫ਼ੀ)/, `${question.questionId}: Punjabi contact-sufficiency reason must explain the overclaim`);
        }
      }
    }
  }
}

for (const cell of cells) {
  for (let seedIndex = 0; seedIndex < 160; seedIndex += 1) {
    const batch = generateArgCp015QuestionStudioBatch({
      profileMode: cell.profileMode,
      examProfile: "examProfile" in cell ? cell.examProfile : undefined,
      qlId: "ARG-QL-002",
      language: "pa",
      difficulty: cell.difficulty,
      seed: `ARG-CP015-SEMANTIC-APPROVAL:pa:${cell.profileMode}:${"examProfile" in cell ? cell.examProfile : "CORE"}:${cell.difficulty}:${seedIndex}`,
      count: 1,
    });
    const question = batch.questions[0] as Question;
    const args = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
    const rs = reasons(question, "pa");
    const ss = strengths(question);
    const fullSurface = [String(question.statement ?? ""), ...args, String(question.explanation ?? "")].join(" ");

    if (/ਮਨਜ਼ੂਰੀ/.test(fullSurface)) {
      punjabiApprovalSurfaceChecked += 1;
      assert.doesNotMatch(fullSurface, /ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਪੂਰਾ ਕਰਨਾ/, `${question.questionId}: Punjabi approval has wrong infinitive agreement`);
      assert.doesNotMatch(fullSurface, /ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਇਹ ਰੋਕ ਸਕਦਾ ਹੈ/, `${question.questionId}: Punjabi approval has wrong gender agreement`);
      assert.doesNotMatch(fullSurface, /ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਵਿੱਚ ਫੇਲ ਹੋਇਆ ਸੀ/, `${question.questionId}: Punjabi failed-approval wording remained unnatural`);
    }

    for (let index = 0; index < args.length; index += 1) {
      if (ss[index]?.toUpperCase() !== "WEAK") continue;
      const argument = args[index]!;
      const reason = rs[index]!;
      if (/ਇੱਕ ਵਰਤੋਂਕਾਰ.*ਮਨਜ਼ੂਰੀ.*(?:ਪੂਰੀ ਨਹੀਂ ਕਰ ਸਕਿਆ|ਫੇਲ|ਅਸਫਲ)/.test(argument)) {
        punjabiApprovalAnecdoteChecked += 1;
        assert.doesNotMatch(reason, /ਇਹ ਦਲੀਲ ਮੰਨ ਲੈਂਦੀ ਹੈ ਕਿ/, `${question.questionId}: Punjabi failed-approval anecdote fell through to generic explanation`);
        assert.match(reason, /(?:ਇੱਕ ਘਟਨਾ|ਇੱਕ ਵਰਤੋਂਕਾਰ)/, `${question.questionId}: Punjabi failed-approval reason must identify the single-case weakness`);
        assert.match(reason, /(?:ਜ਼ਿਆਦਾਤਰ|ਵਾਜਬ|ਅਣਭਰੋਸੇਯੋਗ)/, `${question.questionId}: Punjabi failed-approval reason must explain why the anecdote cannot establish general unreliability`);
      }
    }
  }
}

// Reproduce the certified English QL006 SSC/Easy review cell exactly as the
// exporter does. Earlier cells consume unique statement/explanation surfaces,
// so the SSC/Easy item is not guaranteed to be sampleAttempt 0.
{
  const reviewCells = [
    { profileMode: "core" as const, difficulty: "Easy" as const, count: 1 },
    { profileMode: "core" as const, difficulty: "Medium" as const, count: 1 },
    { profileMode: "core" as const, difficulty: "Hard" as const, count: 1 },
    { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Easy" as const, count: 1 },
  ] as const;
  const seenStatements = new Set<string>();
  const seenExplanations = new Set<string>();
  let sscEasyQuestion: Question | undefined;

  for (let cellIndex = 0; cellIndex < reviewCells.length; cellIndex += 1) {
    const cell = reviewCells[cellIndex]!;
    let selected: readonly Question[] | undefined;

    for (let sampleAttempt = 0; sampleAttempt < 256; sampleAttempt += 1) {
      const seed = `ARG-CP015-HUMAN-REVIEW:en:ARG-QL-006:${"examProfile" in cell ? cell.examProfile : "CORE"}:${cell.difficulty}:${cellIndex}:${sampleAttempt}`;
      const batch = generateArgCp015QuestionStudioBatch({
        profileMode: cell.profileMode,
        examProfile: "examProfile" in cell ? cell.examProfile : undefined,
        qlId: "ARG-QL-006",
        language: "en",
        difficulty: cell.difficulty,
        seed,
        count: cell.count,
      });
      const candidates = batch.questions as readonly Question[];
      const statements = candidates.map((question) => String(question.statement ?? "").trim().replace(/\s+/g, " "));
      const explanations = candidates.map((question) => String(question.explanation ?? "").trim().replace(/\s+/g, " "));
      const uniqueWithinCandidate = new Set(statements).size === candidates.length
        && new Set(explanations).size === candidates.length;
      const newToReviewSet = statements.every((key) => !seenStatements.has(key))
        && explanations.every((key) => !seenExplanations.has(key));
      if (uniqueWithinCandidate && newToReviewSet) {
        selected = candidates;
        break;
      }
    }

    assert.ok(selected, `English/ARG-QL-006/review-cell-${cellIndex}: unable to reproduce certified review selection`);
    for (const question of selected!) {
      seenStatements.add(String(question.statement ?? "").trim().replace(/\s+/g, " "));
      seenExplanations.add(String(question.explanation ?? "").trim().replace(/\s+/g, " "));
    }
    if (cellIndex === 3) sscEasyQuestion = selected![0] as Question;
  }

  assert.ok(sscEasyQuestion, "English certified review selection did not produce SSC/Easy QL006 item");
  const question = sscEasyQuestion!;
  const args = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
  const explanation = String(question.explanation ?? "");
  const target = args.find((argument: string) => /payments from a newly added device/i.test(argument) && /most instances/i.test(argument));
  assert.ok(target, `${question.questionId}: English certified SSC/Easy review item no longer exercises newly-added-device fraud overclaim`);
  englishNewDeviceReviewChecked += 1;
  assert.doesNotMatch(target, /\bYes\.\s+most instances\b/, `${question.questionId}: lowercase sentence start leaked after Yes.`);
  assert.match(target, /\bYes\.\s+Most instances\b/, `${question.questionId}: newly-added-device review argument must use normal sentence capitalization`);
  assert.doesNotMatch(explanation, /does not provide enough support for that conclusion/i, `${question.questionId}: newly-added-device fraud overclaim fell through to generic explanation`);
  assert.match(explanation, /newly added device/i, `${question.questionId}: explanation must stay tied to the newly-added-device claim`);
  assert.match(explanation, /(?:genuine|fraudulent|mandatory pre-authorisation)/i, `${question.questionId}: explanation must state why the fraud generalisation is unsupported`);
}

assert.ok(hindiQueueSufficiencyChecked > 0, "semantic proof did not exercise any Hindi queue-sufficiency weak argument");
assert.ok(punjabiContactSufficiencyChecked > 0, "semantic proof did not exercise any Punjabi contact-sufficiency weak argument");
assert.ok(punjabiApprovalSurfaceChecked > 0, "semantic proof did not exercise any Punjabi in-app approval surface");
assert.ok(punjabiApprovalAnecdoteChecked > 0, "semantic proof did not exercise any Punjabi failed-approval anecdote");
assert.equal(englishNewDeviceReviewChecked, 1, "semantic proof must exercise the certified English newly-added-device review item");

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_SEMANTIC_ALIGNMENT",
  hindiQueueSufficiencyChecked,
  punjabiContactSufficiencyChecked,
  punjabiApprovalSurfaceChecked,
  punjabiApprovalAnecdoteChecked,
  englishNewDeviceReviewChecked,
}, null, 2));
