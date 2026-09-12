import assert from "node:assert/strict";

import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";

type Question = Readonly<Record<string, any>>;
type ReviewCell = Readonly<{
  profileMode: "core" | "real-paper";
  examProfile?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}>;

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

// Keep this second pass exactly aligned with the human-review exporter so a
// coverage assertion cannot fail merely because an unrelated custom seed sweep
// missed a real family that is present in the certified review corpus.
const reviewCells: readonly ReviewCell[] = Object.freeze([
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

function statementKey(question: Question): string {
  return String(question.statement ?? "").trim().replace(/\s+/g, " ");
}

function explanationKey(question: Question): string {
  return String(question.explanation ?? "").trim().replace(/\s+/g, " ");
}

function assertNaturalSurface(question: Question): void {
  const args = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
  const fullSurface = [String(question.statement ?? ""), ...args, String(question.explanation ?? "")].join(" ");

  assert.doesNotMatch(fullSurface, /अलग किया गया गीले और सूखे कचरे फिर मिल सकता है/, `${question.questionId}: Hindi waste-agreement defect leaked`);
  assert.doesNotMatch(fullSurface, /पूरी तरह डिजिटल परीक्षा केंद्र पर चला जाना चाहिए/, `${question.questionId}: Hindi digital-exam rollout construction remained machine-like`);
  assert.doesNotMatch(fullSurface, /(?:स्थिर कनेक्टिविटी|अभ्यर्थी सहायता और बैकअप व्यवस्था|सुरक्षित डिवाइस और केंद्र) चाहे जो हो/, `${question.questionId}: Hindi concessive rollout construction remained machine-like`);
  assert.doesNotMatch(fullSurface, /अधिकांश जगह दो सप्ताह में सीधे उपलब्ध/, `${question.questionId}: Hindi rollout availability construction remained machine-like`);
  assert.doesNotMatch(fullSurface, /का अधिकांश भाग जमीन से दोबारा बनाना पड़ेगा/, `${question.questionId}: Hindi rebuild phrasing remained machine-like`);
  assert.doesNotMatch(fullSurface, /बैकअप संभाल के बिना अपवाद के अधिकांश प्रकार संभाल सकता है/, `${question.questionId}: Hindi AI-support phrasing remained machine-like`);
}

const permanentSlotOverclaim = /(?:समय-स्लॉट|निर्धारित स्लॉट|स्लॉट व्यवस्था|समय-स्लॉट प्रणाली).*(?:स्थायी रूप से (?:अव्यावहारिक|अनुपलब्ध|असंभव)|सफलतापूर्वक देना स्थायी)/;

let surfacesChecked = 0;
let rolloutReasonsChecked = 0;
let timeSlotReasonsChecked = 0;

// Broad high-volume sweep: grammar/naturalness plus rollout explanation routing.
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
    surfacesChecked += 1;
    assertNaturalSurface(question);

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
    }
  }
}

// Review-aligned sweep: reproduce the same deterministic selection used by the
// persisted human-review corpus and explicitly prove the permanent time-slot
// overclaim family receives a contextual—not generic—explanation.
const seenStatements = new Set<string>();
const seenExplanations = new Set<string>();
for (let cellIndex = 0; cellIndex < reviewCells.length; cellIndex += 1) {
  const cell = reviewCells[cellIndex]!;
  let selected: readonly Question[] | undefined;

  for (let sampleAttempt = 0; sampleAttempt < 256; sampleAttempt += 1) {
    const seed = `ARG-CP015-HUMAN-REVIEW:hi:ARG-QL-003:${cell.examProfile ?? "CORE"}:${cell.difficulty}:${cellIndex}:${sampleAttempt}`;
    const batch = generateArgCp015QuestionStudioBatch({
      profileMode: cell.profileMode,
      examProfile: cell.examProfile,
      qlId: "ARG-QL-003",
      language: "hi",
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

  assert.ok(selected, `Hindi/ARG-QL-003/review-cell-${cellIndex}: unable to reproduce certified review selection`);
  for (const question of selected!) {
    seenStatements.add(statementKey(question));
    seenExplanations.add(explanationKey(question));
    assertNaturalSurface(question);
    const args = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
    const rs = reasons(question);
    for (let index = 0; index < args.length; index += 1) {
      const argument = args[index]!;
      const reason = rs[index]!;
      if (!permanentSlotOverclaim.test(argument)) continue;
      timeSlotReasonsChecked += 1;
      assert.match(reason, /(?:समय-स्लॉट|स्लॉट|स्थायी रूप से|सीमित शेड्यूलिंग)/, `${question.questionId}: permanent time-slot overclaim got an unrelated reason`);
      assert.doesNotMatch(reason, /बड़े कार्यान्वयन अवरोध/, `${question.questionId}: permanent time-slot overclaim fell into generic obstacle explanation`);
    }
  }
}

assert.ok(surfacesChecked > 0, "Hindi naturalness proof did not exercise QL003 surfaces");
assert.ok(rolloutReasonsChecked > 0, "Hindi naturalness proof did not exercise digital-rollout reasons");
assert.ok(timeSlotReasonsChecked > 0, "Hindi naturalness proof did not exercise certified-review time-slot permanence reasons");

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_HINDI_NATURALNESS",
  surfacesChecked,
  rolloutReasonsChecked,
  timeSlotReasonsChecked,
}, null, 2));
