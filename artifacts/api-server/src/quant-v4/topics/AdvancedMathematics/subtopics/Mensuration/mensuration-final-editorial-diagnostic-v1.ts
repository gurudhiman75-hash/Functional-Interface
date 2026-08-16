import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationStudioQuestionV2,
} from "./mensuration-question-studio-selection-v2";

const embeddedCapitalizedPrompt: Array<Record<string, string>> = [];
const cp010Bands = new Set<string>();

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const question = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `mensuration-final-editorial:${pattern.patternId}:${index}`,
      examProfile: "SSC_CORE",
    });
    if (/[,;]\s+(Find|Determine|Calculate)\b/.test(question.stem)) {
      embeddedCapitalizedPrompt.push({ cpId: question.cpId, patternId: question.patternId, stem: question.stem });
    }
    if (question.cpId === "MEN-CP-010") cp010Bands.add(question.difficultyBand);
  }
}

if (embeddedCapitalizedPrompt.length) {
  throw new Error(`Final Mensuration stems retain ${embeddedCapitalizedPrompt.length} embedded capitalized commands: ${JSON.stringify(embeddedCapitalizedPrompt.slice(0, 8))}`);
}
if (!["Easy", "Medium", "Hard"].every((band) => cp010Bands.has(band))) {
  throw new Error(`CP010 must expose Easy/Medium/Hard product bands; saw ${JSON.stringify([...cp010Bands].sort())}`);
}

console.log(JSON.stringify({
  embeddedCapitalizedPromptCount: embeddedCapitalizedPrompt.length,
  cp010DifficultyBands: [...cp010Bands].sort(),
}, null, 2));
