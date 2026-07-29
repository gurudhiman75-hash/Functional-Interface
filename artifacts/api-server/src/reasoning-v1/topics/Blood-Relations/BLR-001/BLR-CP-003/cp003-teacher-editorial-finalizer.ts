import { stableHash } from "../foundation/prng";
import {
  generateBlrCp003TeacherReviewRecords,
  type BlrCp003TeacherOptionAnalysis,
  type BlrCp003TeacherReviewRecord,
} from "./cp003-teacher-editorial";

function removeEngineVoice(text: string): string {
  return text
    .replace(/^Trace every member's relation to (.+)\.$/, "Check each family member's relation to $1.")
    .replace(/^Trace /, "Follow the family links for ")
    .replace(/supported family path/gi, "family route shown in the diagram")
    .replace(/shortest supported path/gi, "clearest route in the diagram")
    .replace(/reconstructed family graph/gi, "family tree")
    .replace(/subject-to-reference/gi, "first-name-to-second-name")
    .replace(/modelled parent/gi, "displayed parent")
    .replace(/semantic option/gi, "answer option")
    .replace(/are joined by a spouse clue/gi, "are directly stated to be married")
    .replace(/The relation wording directly fixes/gi, "The words in the passage directly tell us");
}

function evidenceSafeFamilyTree(tree: string): string {
  const hasUnstatedGender = tree.includes("(?)");
  const safeTree = tree.replaceAll(" (?)", "");
  if (!hasUnstatedGender) return safeTree;
  return safeTree.replace(
    "     │ = Parent–child lineage  |  ── = Siblings",
    "     │ = Parent–child lineage  |  ── = Siblings\n     Unmarked name = Gender not stated in the passage",
  );
}

function generationQuestionNames(stem: string): readonly [string, string] | null {
  const match = /^What is (.+)'s generation position relative to (.+)\?$/.exec(stem);
  return match ? [match[1]!, match[2]!] : null;
}

function relationQuestionNames(stem: string): readonly [string, string] | null {
  const match = /^How is (.+) related to (.+)\?$/.exec(stem);
  return match ? [match[1]!, match[2]!] : null;
}

function exactLineageQuestionNames(stem: string): readonly [string, string] | null {
  const match = /^What is the exact relation of (.+) to (.+)\?$/.exec(stem);
  return match ? [match[1]!, match[2]!] : null;
}

function polishedConclusion(record: BlrCp003TeacherReviewRecord): string {
  const generationNames = generationQuestionNames(record.stem);
  if (generationNames) {
    const answer = record.options[record.correctIndex]!.text.toLocaleLowerCase("en-IN");
    if (answer === "same generation") {
      return `${generationNames[0]} is in the same generation as ${generationNames[1]}.`;
    }
    return `${generationNames[0]} is ${answer} ${generationNames[1]}.`;
  }
  return removeEngineVoice(record.editorial.conclusion);
}

function polishedOptionAnalysis(
  record: BlrCp003TeacherReviewRecord,
): readonly BlrCp003TeacherOptionAnalysis[] {
  const relationNames = relationQuestionNames(record.stem);
  const lineageNames = exactLineageQuestionNames(record.stem);
  const generationNames = generationQuestionNames(record.stem);
  const identifyMatch = /^Who is the (.+) of (.+)\?$/.exec(record.stem);
  const correctText = record.options[record.correctIndex]!.text.toLocaleLowerCase("en-IN");

  return record.editorial.optionAnalysis.map((entry) => {
    let explanation = removeEngineVoice(entry.explanation);
    if (relationNames) {
      explanation = entry.isCorrect
        ? `${relationNames[0]} is the ${correctText} of ${relationNames[1]}, exactly as shown in the family tree.`
        : `${relationNames[0]} is the ${correctText} of ${relationNames[1]}, not the ${entry.optionText.toLocaleLowerCase("en-IN")}.`;
    } else if (lineageNames) {
      explanation = entry.isCorrect
        ? `${lineageNames[0]} is the ${correctText} of ${lineageNames[1]}; the family side and gender both match.`
        : `${lineageNames[0]} is the ${correctText} of ${lineageNames[1]}, so ${entry.optionText.toLocaleLowerCase("en-IN")} is not correct.`;
    } else if (generationNames) {
      if (correctText === "same generation") {
        explanation = entry.isCorrect
          ? `${generationNames[0]} and ${generationNames[1]} appear on the same generation row.`
          : `${generationNames[0]} and ${generationNames[1]} are in the same generation, so “${entry.optionText}” is incorrect.`;
      } else {
        explanation = entry.isCorrect
          ? `${generationNames[0]} is ${correctText} ${generationNames[1]}.`
          : `${generationNames[0]} is ${correctText} ${generationNames[1]}, not ${entry.optionText.toLocaleLowerCase("en-IN")}.`;
      }
    } else if (identifyMatch && entry.optionText === identifyMatch[2]) {
      explanation = `${entry.optionText} is the reference person, not the person being identified as the ${identifyMatch[1]}.`;
    }
    return { ...entry, explanation };
  });
}

function polishedSteps(
  record: BlrCp003TeacherReviewRecord,
  conclusion: string,
): readonly string[] {
  const steps = record.editorial.stepByStepSolution
    .map(removeEngineVoice)
    .filter((step) => !step.startsWith("Therefore, "));
  return [...steps, `Therefore, ${conclusion}`];
}

function polishedCommonTraps(
  record: BlrCp003TeacherReviewRecord,
  analyses: readonly BlrCp003TeacherOptionAnalysis[],
): readonly string[] {
  const firstWrong = analyses.find((entry) => !entry.isCorrect)!;
  const retained = record.editorial.commonTraps
    .map(removeEngineVoice)
    .filter((line) => !line.startsWith("Don't fall for Option "));
  return [
    `Don't fall for Option ${firstWrong.optionLabel} (${firstWrong.optionText}). ${firstWrong.explanation}`,
    ...retained,
  ];
}

export function finalizeBlrCp003TeacherRecord(
  record: BlrCp003TeacherReviewRecord,
): BlrCp003TeacherReviewRecord {
  const coreConcept = record.editorial.coreConcept.map(removeEngineVoice);
  const familyTreeGrid = evidenceSafeFamilyTree(record.editorial.familyTreeGrid);
  const conclusion = polishedConclusion(record);
  const stepByStepSolution = polishedSteps(record, conclusion);
  const optionAnalysis = polishedOptionAnalysis(record);
  const examShortcut = removeEngineVoice(record.editorial.examShortcut);
  const commonTraps = polishedCommonTraps(record, optionAnalysis);

  return {
    ...record,
    editorial: {
      ...record.editorial,
      coreConcept,
      familyTreeGrid,
      stepByStepSolution,
      optionAnalysis,
      conclusion,
      examShortcut,
      commonTraps,
    },
    metadata: {
      ...record.metadata,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        familyTreeGrid,
        ...coreConcept,
        ...stepByStepSolution,
        ...optionAnalysis.flatMap((entry) => [entry.optionLabel, entry.optionText, entry.explanation]),
        conclusion,
        examShortcut,
        ...commonTraps,
      ]),
    },
  };
}

export function generateBlrCp003TeacherReviewV3Records(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003TeacherReviewRecord[] {
  return generateBlrCp003TeacherReviewRecords(seeds).map(finalizeBlrCp003TeacherRecord);
}
