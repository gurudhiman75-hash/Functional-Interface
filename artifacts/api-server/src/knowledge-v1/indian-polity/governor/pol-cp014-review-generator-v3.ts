import type { PolCp014ReviewQuestion } from "./pol-cp014-review-types";
import { generatePolCp014ReviewBatchV2 } from "./pol-cp014-review-generator-v2";

type Replacement = {
  stem: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceFactId: string;
};

const R: Record<number, Replacement> = {
  32: {
    stem: "Under Article 175, may the Governor address either House or both Houses assembled together?",
    answer: "Yes",
    distractors: ["No", "Only the Legislative Assembly", "Only during a constitutional emergency"],
    explanation: "Article 175 allows the Governor to address either House separately or both Houses assembled together as part of the Governor's legislative communication role.",
    sourceFactId: "pol-cp014-art175",
  },
  33: {
    stem: "A message sent by the Governor under Article 175 may concern:",
    answer: "A pending Bill or another matter",
    distractors: ["Only a Money Bill", "Only a constitutional amendment", "Only the annual budget"],
    explanation: "Article 175 allows gubernatorial messages about a Bill then pending in the Legislature or about another matter requiring legislative consideration.",
    sourceFactId: "pol-cp014-art175",
  },
  34: {
    stem: "After receiving an Article 175 message requiring consideration of a matter, the House should:",
    answer: "Consider it with all convenient dispatch",
    distractors: ["Ignore it until the next annual session", "Refer it automatically to Parliament", "Seek Supreme Court approval first"],
    explanation: "Article 175 requires the receiving House to consider the matter specified in the Governor's message with all convenient dispatch.",
    sourceFactId: "pol-cp014-art175",
  },
  35: {
    stem: "How does Article 175 differ from the special address under Article 176?",
    answer: "Article 175 gives a general address and message power",
    distractors: ["Article 175 applies only after general elections", "Article 175 deals only with Ordinances", "Article 175 fixes the Governor's term"],
    explanation: "Article 175 provides general address and message powers, whereas Article 176 requires a special address at specified opening sessions.",
    sourceFactId: "pol-cp014-art175",
  },
  36: {
    stem: "How may the Governor exercise State executive power under Article 154?",
    answer: "Directly or through subordinate officers in accordance with the Constitution",
    distractors: ["Only personally", "Only through the Chief Minister", "Only through the State Legislature"],
    explanation: "Article 154 vests State executive power in the Governor and permits its exercise directly or through subordinate officers according to the Constitution.",
    sourceFactId: "pol-cp014-art154",
  },
  37: {
    stem: "Does Article 154 by itself transfer to the Governor a function vested by existing law in another authority?",
    answer: "No",
    distractors: ["Yes, automatically", "Only during an Emergency", "Only after a Governor's Ordinance"],
    explanation: "Article 154 does not itself transfer functions that an existing law has already vested in another authority.",
    sourceFactId: "pol-cp014-art154",
  },
  38: {
    stem: "May a competent Legislature confer functions by law on authorities subordinate to the Governor?",
    answer: "Yes",
    distractors: ["No", "Only Parliament may do so", "Only the High Court may do so"],
    explanation: "Article 154 permits a competent Legislature to confer functions by law on authorities subordinate to the Governor.",
    sourceFactId: "pol-cp014-art154",
  },
  39: {
    stem: "Which statement correctly describes Article 154?",
    answer: "It vests State executive power while preserving lawful functions of other authorities",
    distractors: ["It makes every State function personal to the Governor", "It transfers judicial power to the Governor", "It abolishes subordinate executive authorities"],
    explanation: "Article 154 vests executive power in the Governor but does not displace functions that existing law has validly vested in other authorities.",
    sourceFactId: "pol-cp014-art154",
  },
  70: {
    stem: "An existing law assigns a State function to another authority. Does Article 154 alone transfer that function to the Governor?",
    answer: "No",
    distractors: ["Yes, automatically", "Only if the Governor requests it", "Only after the Assembly is dissolved"],
    explanation: "Article 154 does not itself transfer functions that an existing law has vested in another authority; that legal allocation remains effective.",
    sourceFactId: "pol-cp014-art154",
  },
  71: {
    stem: "Despite Article 154 vesting State executive power in the Governor, may a competent Legislature confer functions on subordinate authorities by law?",
    answer: "Yes",
    distractors: ["No", "Only the President may do so", "Only the High Court may do so"],
    explanation: "Article 154 preserves legislative power to confer functions on subordinate authorities where the Legislature is constitutionally competent to legislate.",
    sourceFactId: "pol-cp014-art154",
  },
  74: {
    stem: "Consider the following statements:\n1. The Governor may address either House or both Houses together.\n2. The Governor may send messages about a pending Bill or another matter.\n3. A House may ignore such a message indefinitely.\nWhich statements are correct?",
    answer: "Statements 1 and 2 only",
    distractors: ["Statement 1 only", "Statements 2 and 3 only", "All three statements"],
    explanation: "Article 175 permits gubernatorial addresses and messages, while a House receiving a required matter must consider it with all convenient dispatch.",
    sourceFactId: "pol-cp014-art175",
  },
  75: {
    stem: "Consider the following statements:\n1. Article 154 vests State executive power in the Governor.\n2. Article 160 covers unforeseen contingencies in discharging the Governor's functions.\n3. Article 175 permits gubernatorial messages to the Legislature.\nWhich statements are correct?",
    answer: "All three statements",
    distractors: ["Statement 1 only", "Statements 1 and 2 only", "Statements 2 and 3 only"],
    explanation: "All three mappings are correct: Articles 154, 160 and 175 cover State executive power, unforeseen gubernatorial contingencies and legislative messages respectively.",
    sourceFactId: "pol-cp014-art175",
  },
  78: {
    stem: "An unforeseen contingency arises over discharge of the Governor's functions and this Chapter gives no specific solution. Which Article allows presidential provision?",
    answer: "Article 160",
    distractors: ["Article 154", "Article 175", "Article 213"],
    explanation: "Article 160 authorises the President to make provision for discharging the Governor's functions in a contingency not otherwise provided for in the Chapter.",
    sourceFactId: "pol-cp014-art160",
  },
  79: {
    stem: "The Governor sends a message requiring a legislative House to consider a specified matter. What does Article 175 require from that House?",
    answer: "Consider the matter with all convenient dispatch",
    distractors: ["Wait until the next general election", "Refer it automatically to Parliament", "Seek judicial approval before consideration"],
    explanation: "Article 175 requires the House receiving the Governor's message to consider the specified matter with all convenient dispatch.",
    sourceFactId: "pol-cp014-art175",
  },
};

function place(answer: string, distractors: [string, string, string], correctIndex: 0|1|2|3): [string,string,string,string] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  if (new Set(options).size !== 4) throw new Error("CP014 V3 replacement contains duplicate options");
  return options as [string,string,string,string];
}

export function generatePolCp014ReviewBatchV3(): PolCp014ReviewQuestion[] {
  return generatePolCp014ReviewBatchV2().map((q, index) => {
    const replacement = R[index];
    if (!replacement) return { ...q, questionId: `POL-CP014-V3-${String(index + 1).padStart(3, "0")}` };
    const words = replacement.explanation.trim().split(/\s+/).length;
    if (words < 13 || words > 40) throw new Error(`CP014 V3 explanation length ${words} at ${index + 1}`);
    return {
      ...q,
      questionId: `POL-CP014-V3-${String(index + 1).padStart(3, "0")}`,
      stem: replacement.stem,
      canonicalAnswer: replacement.answer,
      options: place(replacement.answer, replacement.distractors, q.correctIndex),
      explanation: replacement.explanation,
      sourceFactIds: [replacement.sourceFactId],
    };
  });
}
