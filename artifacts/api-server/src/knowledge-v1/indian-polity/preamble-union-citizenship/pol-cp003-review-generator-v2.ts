import { deterministicShuffle } from "../../deterministic";
import type { PolCp003ReviewQuestion } from "./pol-cp003-review-types";
import {
  POL_CP003_ARTICLE6_RULES_V1,
  POL_CP003_CITIZENSHIP_ARTICLES_V1,
} from "./pol-cp003-facts";
import { generatePolCp003ReviewBatchV1 } from "./pol-cp003-review-generator-v1";

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function simplifyBaseQuestion(question: PolCp003ReviewQuestion): PolCp003ReviewQuestion {
  let stem = question.stem
    .replace("Which Preamble objective is expressed through the words", "Which Preamble ideal is linked with")
    .replace("Which wording in the Preamble is attached to", "In the Preamble, which words describe")
    .replace("Which expression correctly states the present constitutional description of India in the Preamble?", "How does the Preamble describe India today?")
    .replace("Which one of the following words formed part of the original Preamble adopted in 1949?", "Which word was in the original Preamble adopted in 1949?")
    .replace("Which constitutional amendment inserted the words", "Which Amendment added the words")
    .replace("What is the principal subject of", "What is the main subject of")
    .replace("Which Article contains the rule on", "Which Article deals with")
    .replace("Under Article 1, which of the following forms part of the territory of India?", "Under Article 1, what is included in the territory of India?")
    .replace("Which Schedule is expressly linked by Article 1 with the States and Union territories?", "Which Schedule lists the States and Union territories referred to in Article 1?")
    .replace("Which statement correctly reflects Article 1 of the Constitution?", "Which statement about Article 1 is correct?")
    .replace("A Bill under Article 3 to alter the boundary of an existing State may be introduced only on whose recommendation?", "Who must recommend an Article 3 Bill before it is introduced?")
    .replace("When a proposal under Article 3 affects a State, what must the President do before Parliament considers the Bill?", "If an Article 3 proposal affects a State, what must the President do?")
    .replace("Under Article 3, the affected State Legislature's role is best described as:", "What is the role of the affected State Legislature under Article 3?")
    .replace("A law made under Articles 2 or 3 may make necessary changes to which Schedules under Article 4?", "Under Article 4, a law made under Articles 2 or 3 may change which Schedules?")
    .replace("For the purposes of Article 368, a law made under Articles 2 or 3 and covered by Article 4 is:", "How does Article 4 treat a law made under Articles 2 or 3?")
    .replace("Which Article allows supplemental, incidental and consequential provisions in laws made under Articles 2 and 3?", "Which Article allows related changes needed for laws made under Articles 2 and 3?")
    .replace("Which statement correctly distinguishes Article 4 from Article 368?", "Which statement about Article 4 is correct?")
    .replace("What is the subject of", "What does")
    .replace(" in Part II of the Constitution?", " deal with?")
    .replace("Which Article most directly governs this situation?", "Which Article applies here?")
    .replace("Which option correctly distinguishes three constitutional ideas in this CP?", "Which set is correctly matched?");

  if (question.qlId === "POL-003-QL-011") {
    const shortStems: Record<string, string> = {
      "Article 5": "Which Article gives the basic citizenship rules at the start of the Constitution?",
      "Article 6": "Which Article deals with certain migrants from Pakistan to India?",
      "Article 7": "Which Article deals with certain people who migrated from India to Pakistan?",
      "Article 8": "Which Article covers certain persons of Indian origin living outside India?",
      "Article 9": "Which Article deals with voluntary acquisition of foreign citizenship?",
      "Article 10": "Which Article deals with continuation of citizenship rights?",
      "Article 11": "Which Article gives Parliament power to make citizenship laws?",
    };
    stem = shortStems[question.canonicalAnswer] ?? stem;
  }

  let explanation = question.explanation
    .replace("the State Legislature expresses its views; its consent is not made a binding condition by the Article", "the State Legislature gives its views, but its consent is not binding")
    .replace("were inserted by the Forty-second Amendment, not by the original Preamble", "were added by the Forty-second Amendment and were not in the original Preamble");

  if (question.qlId === "POL-003-QL-016") {
    explanation = "Preamble: constitutional ideals. Article 4: related changes for laws under Articles 2 and 3. Article 11: Parliament's power to make citizenship laws.";
  }

  return {
    ...question,
    questionId: question.questionId.replace("POL-CP003-V1-", "POL-CP003-V2-"),
    stem,
    explanation,
  };
}

function article6Question(index: number, globalIndex: number): PolCp003ReviewQuestion {
  const article6 = POL_CP003_CITIZENSHIP_ARTICLES_V1.find((row) => row.article === 6)!;
  const correctTarget = globalIndex % 4;
  const modes = index % 3;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";

  if (modes === 0) {
    stem = "Which date is important in Article 6 for migrants from Pakistan to India?";
    correct = "19 July 1948";
    options = moveCorrect(["19 July 1948", "1 March 1947", "15 August 1947", "26 January 1950"], correct, correctTarget);
    explanation = "Article 6 separates certain migrants who came before 19 July 1948 from those who came on or after that date.";
  } else if (modes === 1) {
    stem = "Under Article 6, what was required for certain migrants who came on or after 19 July 1948?";
    correct = "Registration as a citizen";
    options = moveCorrect([
      correct,
      "Only residence since migration",
      "Approval by a State Legislature",
      "A permit under Article 7",
    ], correct, correctTarget);
    explanation = POL_CP003_ARTICLE6_RULES_V1[1];
  } else {
    stem = "For the Article 6 registration route, how long did a person have to live in India immediately before applying?";
    correct = "At least six months";
    options = moveCorrect(["At least six months", "At least one year", "At least five years", "At least ten years"], correct, correctTarget);
    explanation = POL_CP003_ARTICLE6_RULES_V1[2];
  }

  return {
    questionId: `POL-CP003-V2-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-003",
    qlId: "POL-003-QL-017",
    qlName: "Article 6 migration and registration rules",
    difficulty: "Medium",
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    sourceIds: [...article6.sourceIds],
    sourceFactIds: [...article6.sourceFactIds],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function article7And8Question(index: number, globalIndex: number): PolCp003ReviewQuestion {
  const article7 = POL_CP003_CITIZENSHIP_ARTICLES_V1.find((row) => row.article === 7)!;
  const article8 = POL_CP003_CITIZENSHIP_ARTICLES_V1.find((row) => row.article === 8)!;
  const correctTarget = globalIndex % 4;
  const modes = index % 3;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";

  if (modes === 0) {
    stem = "Which statement correctly distinguishes Articles 7 and 8?";
    correct = "Article 7 deals with certain migrants to Pakistan; Article 8 deals with certain persons of Indian origin living outside India.";
    options = moveCorrect(deterministicShuffle([
      correct,
      "Article 7 deals with State boundaries; Article 8 gives Parliament citizenship powers.",
      "Article 7 deals with foreign citizenship; Article 8 deals with continuation of citizenship.",
      "Both Articles deal only with migrants from Pakistan to India.",
    ], "POL-003-QL-018:0"), correct, correctTarget);
    explanation = "Article 7 deals with certain migrants to Pakistan. Article 8 deals with certain persons of Indian origin living outside India.";
  } else if (modes === 1) {
    stem = "A person moved from India to Pakistan after 1 March 1947 and later returned with a permit for permanent return. Which Article contains this exception?";
    correct = "Article 7";
    options = moveCorrect(["Article 7", "Article 6", "Article 8", "Article 9"], correct, correctTarget);
    explanation = article7.rule;
  } else {
    stem = "Which Article uses registration by an Indian diplomatic or consular representative for certain persons of Indian origin living abroad?";
    correct = "Article 8";
    options = moveCorrect(["Article 8", "Article 5", "Article 7", "Article 10"], correct, correctTarget);
    explanation = article8.rule;
  }

  return {
    questionId: `POL-CP003-V2-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-003",
    qlId: "POL-003-QL-018",
    qlName: "Articles 7 and 8 distinction",
    difficulty: "Hard",
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    sourceIds: [...new Set([...article7.sourceIds, ...article8.sourceIds])],
    sourceFactIds: [...new Set([...article7.sourceFactIds, ...article8.sourceFactIds])],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generatePolCp003ReviewBatchV2() {
  const base = generatePolCp003ReviewBatchV1().map((question) => {
    const simplified = simplifyBaseQuestion(question);
    if (question.qlId === "POL-003-QL-012" || question.qlId === "POL-003-QL-013") {
      return { ...simplified, difficulty: "Medium" as const };
    }
    return simplified;
  });

  const output = [...base];
  for (let index = 0; index < 3; index += 1) {
    output.push(article6Question(index, output.length));
  }
  for (let index = 0; index < 3; index += 1) {
    output.push(article7And8Question(index, output.length));
  }
  return output;
}
