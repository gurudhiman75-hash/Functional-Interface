import assert from "node:assert/strict";

import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";

type Question = Readonly<Record<string, any>>;

const ROMAN = ["I", "II", "III", "IV"] as const;
const cells = [
  { profileMode: "core" as const, difficulty: "Easy" as const },
  { profileMode: "core" as const, difficulty: "Medium" as const },
  { profileMode: "core" as const, difficulty: "Hard" as const },
  { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Easy" as const },
  { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard" as const },
] as const;

function reasons(question: Question): readonly string[] {
  const explanation = String(question.explanation ?? "");
  const args = Array.isArray(question.arguments) ? question.arguments : [];
  const labels = args.map((_: unknown, index: number) => `तर्क ${ROMAN[index]} `);
  return labels.map((label: string, index: number) => {
    const start = explanation.indexOf(label);
    assert.ok(start >= 0, `${question.questionId}: missing ${label}`);
    const colon = explanation.indexOf(": ", start);
    assert.ok(colon >= 0, `${question.questionId}: missing reason delimiter`);
    const next = labels[index + 1];
    const end = next ? explanation.indexOf(next, colon + 2) : explanation.length;
    return explanation.slice(colon + 2, end < 0 ? explanation.length : end).trim();
  });
}

let surfacesChecked = 0;
let rolloutReasonsChecked = 0;
let timeSlotReasonsChecked = 0;

for (const cell of cells) {
  for (let seedIndex = 0; seedIndex < 180; seedIndex += 1) {
    const batch = generateArgCp015QuestionStudioBatch({
      profileMode: cell.profileMode,
      examProfile: "examProfile" in cell ? cell.examProfile : undefined,
      qlId: "ARG-QL-003",
      language: "hi",
      difficulty: cell.difficulty,
      seed: `ARG-CP015-HI-NATURALNESS:${cell.profileMode}:${"examProfile" in cell ? cell.examProfile : "CORE"}:${cell.difficulty}:${seedIndex}`,
      count: 1,
    });
    const question = batch.questions[0] as Question;
    const args = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
    const rs = reasons(question);
    const fullSurface = [String(question.statement ?? ""), ...args, String(question.explanation ?? "")].join(" ");
    surfacesChecked += 1;

    assert.doesNotMatch(fullSurface, /अलग किया गया गीले और सूखे कचरे फिर मिल सकता है/, `${question.questionId}: Hindi waste-agreement defect leaked`);
    assert.doesNotMatch(fullSurface, /पूरी तरह डिजिटल परीक्षा केंद्र पर चला जाना चाहिए/, `${question.questionId}: Hindi digital-exam rollout construction remained machine-like`);
    assert.doesNotMatch(fullSurface, /(?:स्थिर कनेक्टिविटी|अभ्यर्थी सहायता और बैकअप व्यवस्था|सुरक्षित डिवाइस और केंद्र) चाहे जो हो/, `${question.questionId}: Hindi concessive rollout construction remained machine-like`);
    assert.doesNotMatch(fullSurface, /अधिकांश जगह दो सप्ताह में सीधे उपलब्ध/, `${question.questionId}: Hindi rollout availability construction remained machine-like`);
    assert.doesNotMatch(fullSurface, /का अधिकांश भाग जमीन से दोबारा बनाना पड़ेगा/, `${question.questionId}: Hindi rebuild phrasing remained machine-like`);
    assert.doesNotMatch(fullSurface, /बैकअप संभाल के बिना अपवाद के अधिकांश प्रकार संभाल सकता है/, `${question.questionId}: Hindi AI-support phrasing remained machine-like`);

    for (let index = 0; index < args.length; index += 1) {
      const argument = args[index]!;
      const reason = rs[index]!;
      if (/निर्णय घोषित.*कनेक्टिविटी.*उपलब्ध/.test(argument)) {
        rolloutReasonsChecked += 1;
        assert.match(reason, /(?:कनेक्टिविटी|नेटवर्क)/, `${question.questionId}: connectivity rollout reason is not tied to connectivity`);
      }
      if (/निर्णय घोषित.*सुरक्षित डिवाइस और केंद्र.*उपलब्ध/.test(argument)) {
        rolloutReasonsChecked += 1;
        assert.match(reason, /(?:डिवाइस|केंद्र|क्षमता|संसाधन)/, `${question.questionId}: device/centre rollout reason is not tied to resource capacity`);
      }
      if (/निर्णय घोषित.*अभ्यर्थी सहायता और बैकअप व्यवस्था.*उपलब्ध/.test(argument)) {
        rolloutReasonsChecked += 1;
        assert.match(reason, /(?:अभ्यर्थी सहायता|बैकअप|स्टाफिंग|संचालन)/, `${question.questionId}: support/back-up rollout reason is not tied to support capacity`);
      }
      if (/समय-स्लॉट.*(?:स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|सफलतापूर्वक देना स्थायी)/.test(argument)) {
        timeSlotReasonsChecked += 1;
        assert.match(reason, /(?:समय-स्लॉट|स्थायी रूप से)/, `${question.questionId}: permanent time-slot overclaim got an unrelated reason`);
        assert.doesNotMatch(reason, /बड़े कार्यान्वयन अवरोध/, `${question.questionId}: permanent time-slot overclaim fell into generic obstacle explanation`);
      }
    }
  }
}

assert.ok(surfacesChecked > 0, "Hindi naturalness proof did not exercise QL003 surfaces");
assert.ok(rolloutReasonsChecked > 0, "Hindi naturalness proof did not exercise digital-rollout reasons");
assert.ok(timeSlotReasonsChecked > 0, "Hindi naturalness proof did not exercise time-slot permanence reasons");

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_HINDI_NATURALNESS",
  surfacesChecked,
  rolloutReasonsChecked,
  timeSlotReasonsChecked,
}, null, 2));
