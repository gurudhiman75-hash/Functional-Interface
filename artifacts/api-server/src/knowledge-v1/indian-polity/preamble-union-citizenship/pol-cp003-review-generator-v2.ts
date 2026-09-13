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

function article6Question(index: number, globalIndex: number): PolCp003ReviewQuestion {
  const article6 = POL_CP003_CITIZENSHIP_ARTICLES_V1.find((row) => row.article === 6)!;
  const correctTarget = globalIndex % 4;
  const modes = index % 3;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";

  if (modes === 0) {
    stem = "Under Article 6, which date separates the two constitutional routes for certain migrants from Pakistan to India?";
    correct = "19 July 1948";
    options = moveCorrect(["19 July 1948", "1 March 1947", "15 August 1947", "26 January 1950"], correct, correctTarget);
    explanation = "Article 6 distinguishes migration before 19 July 1948 from migration on or after that date.";
  } else if (modes === 1) {
    stem = "For a qualifying migrant from Pakistan who came to India on or after 19 July 1948, Article 6 required:";
    correct = "registration as a citizen under the constitutional procedure";
    options = moveCorrect([
      correct,
      "only continuous residence since the date of migration, with no registration",
      "approval by the affected State Legislature",
      "a permit for resettlement from Pakistan under Article 7",
    ], correct, correctTarget);
    explanation = POL_CP003_ARTICLE6_RULES_V1[1];
  } else {
    stem = "For the Article 6 registration route applicable to certain post-19 July 1948 migrants, what minimum residence immediately before the application was required?";
    correct = "At least six months";
    options = moveCorrect(["At least six months", "At least one year", "At least five years", "At least ten years"], correct, correctTarget);
    explanation = POL_CP003_ARTICLE6_RULES_V1[2];
  }

  return {
    questionId: `POL-CP003-V2-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-003",
    qlId: "POL-003-QL-017",
    qlName: "Distinguish the Article 6 migration and registration routes",
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
    correct = "Article 7 concerns certain migrants to Pakistan; Article 8 concerns certain persons of Indian origin residing outside India.";
    options = moveCorrect(deterministicShuffle([
      correct,
      "Article 7 concerns State boundaries; Article 8 concerns Parliament's citizenship law-making power.",
      "Article 7 concerns foreign citizenship voluntarily acquired; Article 8 concerns continuance of citizenship.",
      "Article 7 and Article 8 both deal only with migrants from Pakistan to India.",
    ], "POL-003-QL-018:0"), correct, correctTarget);
    explanation = `${article7.subject}; ${article8.subject}.`;
  } else if (modes === 1) {
    stem = "A person who had migrated from India to Pakistan after 1 March 1947 later returned to India under a permit for resettlement or permanent return. Which provision contains this exception?";
    correct = "Article 7";
    options = moveCorrect(["Article 7", "Article 6", "Article 8", "Article 9"], correct, correctTarget);
    explanation = article7.rule;
  } else {
    stem = "Registration by an Indian diplomatic or consular representative is central to which commencement-citizenship provision?";
    correct = "Article 8";
    options = moveCorrect(["Article 8", "Article 5", "Article 7", "Article 10"], correct, correctTarget);
    explanation = article8.rule;
  }

  return {
    questionId: `POL-CP003-V2-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-003",
    qlId: "POL-003-QL-018",
    qlName: "Distinguish Articles 7 and 8 through exceptions and overseas registration",
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
    if (question.qlId === "POL-003-QL-012" || question.qlId === "POL-003-QL-013") {
      return { ...question, difficulty: "Medium" as const };
    }
    return question;
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
