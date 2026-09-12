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

assert.ok(hindiQueueSufficiencyChecked > 0, "semantic proof did not exercise any Hindi queue-sufficiency weak argument");
assert.ok(punjabiContactSufficiencyChecked > 0, "semantic proof did not exercise any Punjabi contact-sufficiency weak argument");

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_SEMANTIC_ALIGNMENT",
  hindiQueueSufficiencyChecked,
  punjabiContactSufficiencyChecked,
}, null, 2));
