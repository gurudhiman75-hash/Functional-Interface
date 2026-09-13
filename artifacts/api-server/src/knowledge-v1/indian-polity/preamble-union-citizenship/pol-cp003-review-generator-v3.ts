import type { PolCp003ReviewQuestion } from "./pol-cp003-review-types";
import { generatePolCp003ReviewBatchV2 } from "./pol-cp003-review-generator-v2";

function examStyleStem(question: PolCp003ReviewQuestion): string {
  const stem = question.stem;

  if (question.qlId === "POL-003-QL-001") {
    return stem
      .replace("Which Preamble ideal is linked with", "The words")
      .replace(/\?$/, " in the Preamble relate to:");
  }

  if (question.qlId === "POL-003-QL-002") {
    return stem.replace("In the Preamble, which words describe", "Which words in the Preamble describe");
  }

  const exact: Record<string, string> = {
    "How does the Preamble describe India today?": "India is described in the Preamble as:",
    "Which word was in the original Preamble adopted in 1949?": "Which word was part of the original Preamble adopted in 1949?",
    "What is the main subject of Article 1?": "Article 1 deals with:",
    "What is the main subject of Article 2?": "Article 2 deals with:",
    "What is the main subject of Article 3?": "Article 3 deals with:",
    "What is the main subject of Article 4?": "Article 4 deals with:",
    "Under Article 1, what is included in the territory of India?": "Under Article 1, the territory of India includes:",
    "Which statement about Article 1 is correct?": "Which statement regarding Article 1 is correct?",
    "Who must recommend an Article 3 Bill before it is introduced?": "An Article 3 Bill can be introduced only on the recommendation of:",
    "If an Article 3 proposal affects a State, what must the President do?": "If an Article 3 Bill affects a State, the President must first:",
    "What is the role of the affected State Legislature under Article 3?": "Under Article 3, the affected State Legislature:",
    "Under Article 4, a law made under Articles 2 or 3 may change which Schedules?": "A law under Articles 2 or 3 may change which Schedules under Article 4?",
    "How does Article 4 treat a law made under Articles 2 or 3?": "Under Article 4, a law made under Articles 2 or 3 is:",
    "Which Article allows related changes needed for laws made under Articles 2 and 3?": "Related changes required by laws under Articles 2 and 3 are allowed by:",
    "Which statement about Article 4 is correct?": "Which statement regarding Article 4 is correct?",
    "Which Article gives the basic citizenship rules at the start of the Constitution?": "Citizenship at the commencement of the Constitution is mainly covered by:",
    "Which Article deals with certain migrants from Pakistan to India?": "Certain migrants from Pakistan to India are covered by:",
    "Which Article deals with certain people who migrated from India to Pakistan?": "Certain persons who migrated from India to Pakistan are covered by:",
    "Which Article covers certain persons of Indian origin living outside India?": "Certain persons of Indian origin living outside India are covered by:",
    "Which Article deals with voluntary acquisition of foreign citizenship?": "Voluntary acquisition of foreign citizenship is dealt with in:",
    "Which Article deals with continuation of citizenship rights?": "Continuation of citizenship rights is dealt with in:",
    "Which Article gives Parliament power to make citizenship laws?": "Parliament's power to make citizenship laws is given by:",
    "Which date is important in Article 6 for migrants from Pakistan to India?": "Article 6 uses which date to distinguish certain migrants from Pakistan to India?",
    "Under Article 6, what was required for certain migrants who came on or after 19 July 1948?": "Under Article 6, certain migrants arriving on or after 19 July 1948 required:",
    "For the Article 6 registration route, how long did a person have to live in India immediately before applying?": "For registration under Article 6, the minimum residence immediately before applying was:",
    "Which statement correctly distinguishes Articles 7 and 8?": "Which statement correctly distinguishes Article 7 from Article 8?",
    "Which Article uses registration by an Indian diplomatic or consular representative for certain persons of Indian origin living abroad?": "Registration through an Indian diplomatic or consular representative is provided under:",
    "Which set is correctly matched?": "Which of the following is correctly matched?",
  };

  if (exact[stem]) return exact[stem];

  if (stem.startsWith("What does Article ")) {
    return stem.replace(/^What does (Article \d+) deal with\?$/, "$1 deals with:");
  }

  if (stem.endsWith("\nWhich Article applies here?")) {
    return stem.replace("\nWhich Article applies here?", "\nThis case is covered by:");
  }

  if (stem.startsWith("A person moved from India to Pakistan")) {
    return stem.replace("Which Article contains this exception?", "This exception is provided under:");
  }

  return stem;
}

export function generatePolCp003ReviewBatchV3() {
  return generatePolCp003ReviewBatchV2().map((question, index) => ({
    ...question,
    questionId: `POL-CP003-V3-${String(index + 1).padStart(3, "0")}`,
    stem: examStyleStem(question),
  }));
}
