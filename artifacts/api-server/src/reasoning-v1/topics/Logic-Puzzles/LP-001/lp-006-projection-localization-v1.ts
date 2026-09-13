import { LP_001_008_LOCALIZED_GENERATORS_V4 } from "./lp-001-008-localization-v4.ts";
import type { Lp001008LocalizedCaselet, Lp001008LocalizedLanguage } from "./lp-001-008-localization-v1.ts";
import {
  generateLp006ProjectionBatchV2,
  type Lp006ProjectionCaselet,
} from "./lp-006-projection-extension-v2.ts";
import type { Lp006ProjectionChild } from "./lp-006-projection-extension-v1.ts";
import { LP_006_PROJECTION_ENGLISH_FREEZE_V1 } from "./lp-006-projection-permanent-freeze-v1.ts";

export type Lp006ProjectionLocalizedLanguage = Lp001008LocalizedLanguage;

export type Lp006ProjectionLocalizedChild = Omit<Lp006ProjectionChild, "stem" | "options" | "answer" | "explanation"> & {
  language: Lp006ProjectionLocalizedLanguage;
  stem: string;
  options: string[];
  answer: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp006ProjectionLocalizedCaselet = {
  packageId: "LP-006";
  checkpointId: "LP-CP-006-PROJECTION";
  language: Lp006ProjectionLocalizedLanguage;
  caseletId: string;
  scenarioProfileId: string;
  difficultyBand: Lp006ProjectionCaselet["difficultyBand"];
  scenario: string;
  learnerFacingClues: readonly string[];
  projectionChildren: readonly Lp006ProjectionLocalizedChild[];
  englishProjectionCaselet: Lp006ProjectionCaselet;
  localizedBaseCaselet: Lp001008LocalizedCaselet;
};

export const LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1 = Object.freeze({
  authorityId: "LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1" as const,
  sourceEnglishAuthorityId: LP_006_PROJECTION_ENGLISH_FREEZE_V1.authorityId,
  baseLocalizationAuthorityId: "LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4" as const,
  packageId: "LP-006" as const,
  checkpointId: "LP-CP-006-PROJECTION" as const,
  permanentQlIds: ["LP-QL-045", "LP-QL-046"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  locales: ["hi-IN", "pa-IN"] as const,
  localizationMethod: "SEMANTIC_REBUILD_FROM_FROZEN_PROJECTION_AND_LOCALIZED_BASE_TABLE" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V1" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

type ProjectionDimension = "PERSON" | "DAY" | "SUBJECT" | "CITY";

type ValueMap = Map<string, string>;

function tableRows(lines: readonly string[]): string[][] {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const table = lines[index]!.split("\n").filter((line) => line.trim().startsWith("|"));
    if (table.length < 3) continue;
    return table.slice(2).map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
  }
  throw new Error("LP-006 localization could not locate final solution table.");
}

function buildValueMap(english: Lp006ProjectionCaselet, localized: Lp001008LocalizedCaselet): ValueMap {
  const englishRows = tableRows(english.children[0]!.explanation.lines);
  const localizedRows = tableRows(localized.children[0]!.explanation.lines);
  if (englishRows.length !== localizedRows.length) throw new Error(`${english.caseletId}: English/localized final-table row mismatch.`);
  const map = new Map<string, string>();
  for (let row = 0; row < englishRows.length; row += 1) {
    const source = englishRows[row]!;
    const target = localizedRows[row]!;
    if (source.length !== target.length) throw new Error(`${english.caseletId}: English/localized final-table column mismatch.`);
    source.forEach((value, column) => {
      if (value && target[column]) map.set(value, target[column]!);
    });
  }
  return map;
}

function translated(map: ValueMap, value: string): string {
  return map.get(value) ?? value;
}

function nativeProjectionStem(
  language: Lp006ProjectionLocalizedLanguage,
  source: ProjectionDimension,
  target: ProjectionDimension,
  sourceValue: string,
): string {
  if (language === "hi") {
    if (source === "SUBJECT" && target === "CITY") return `${sourceValue} अध्ययन क्षेत्र वाले व्यक्ति का शहर कौन-सा है?`;
    if (source === "SUBJECT" && target === "PERSON") return `${sourceValue} अध्ययन क्षेत्र किस व्यक्ति को मिला है?`;
    if (source === "SUBJECT" && target === "DAY") return `${sourceValue} अध्ययन क्षेत्र वाले व्यक्ति का दिन कौन-सा है?`;
    if (source === "CITY" && target === "SUBJECT") return `${sourceValue} शहर वाले व्यक्ति का अध्ययन क्षेत्र कौन-सा है?`;
    if (source === "CITY" && target === "PERSON") return `${sourceValue} शहर किस व्यक्ति से जुड़ा है?`;
    if (source === "CITY" && target === "DAY") return `${sourceValue} शहर वाले व्यक्ति का दिन कौन-सा है?`;
    if (source === "DAY" && target === "SUBJECT") return `${sourceValue} दिन वाले व्यक्ति का अध्ययन क्षेत्र कौन-सा है?`;
    if (source === "DAY" && target === "PERSON") return `${sourceValue} दिन किस व्यक्ति को मिला है?`;
    return `${sourceValue} दिन वाले व्यक्ति का शहर कौन-सा है?`;
  }
  if (source === "SUBJECT" && target === "CITY") return `${sourceValue} ਅਧਿਐਨ ਖੇਤਰ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਸ਼ਹਿਰ ਕਿਹੜਾ ਹੈ?`;
  if (source === "SUBJECT" && target === "PERSON") return `${sourceValue} ਅਧਿਐਨ ਖੇਤਰ ਕਿਸ ਵਿਅਕਤੀ ਨੂੰ ਮਿਲਿਆ ਹੈ?`;
  if (source === "SUBJECT" && target === "DAY") return `${sourceValue} ਅਧਿਐਨ ਖੇਤਰ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਦਿਨ ਕਿਹੜਾ ਹੈ?`;
  if (source === "CITY" && target === "SUBJECT") return `${sourceValue} ਸ਼ਹਿਰ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਅਧਿਐਨ ਖੇਤਰ ਕਿਹੜਾ ਹੈ?`;
  if (source === "CITY" && target === "PERSON") return `${sourceValue} ਸ਼ਹਿਰ ਕਿਸ ਵਿਅਕਤੀ ਨਾਲ ਜੁੜਿਆ ਹੈ?`;
  if (source === "CITY" && target === "DAY") return `${sourceValue} ਸ਼ਹਿਰ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਦਿਨ ਕਿਹੜਾ ਹੈ?`;
  if (source === "DAY" && target === "SUBJECT") return `${sourceValue} ਦਿਨ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਅਧਿਐਨ ਖੇਤਰ ਕਿਹੜਾ ਹੈ?`;
  if (source === "DAY" && target === "PERSON") return `${sourceValue} ਦਿਨ ਕਿਸ ਵਿਅਕਤੀ ਨੂੰ ਮਿਲਿਆ ਹੈ?`;
  return `${sourceValue} ਦਿਨ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਸ਼ਹਿਰ ਕਿਹੜਾ ਹੈ?`;
}

function statementFromEnglish(language: Lp006ProjectionLocalizedLanguage, option: string, map: ValueMap): string {
  let match = option.match(/^(.+) is scheduled on (.+)\.$/u);
  if (match) {
    const first = translated(map, match[1]!);
    const day = translated(map, match[2]!);
    if (option.startsWith("The person scheduled in ")) {
      const cityMatch = option.match(/^The person scheduled in (.+) is scheduled on (.+)\.$/u)!;
      const city = translated(map, cityMatch[1]!);
      const cityDay = translated(map, cityMatch[2]!);
      return language === "hi" ? `${city} शहर वाले व्यक्ति का दिन ${cityDay} है।` : `${city} ਸ਼ਹਿਰ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਦਿਨ ${cityDay} ਹੈ।`;
    }
    if (option.startsWith("The person assigned to ")) {
      const subjectMatch = option.match(/^The person assigned to (.+) is scheduled on (.+)\.$/u)!;
      const subject = translated(map, subjectMatch[1]!);
      const subjectDay = translated(map, subjectMatch[2]!);
      return language === "hi" ? `${subject} अध्ययन क्षेत्र वाले व्यक्ति का दिन ${subjectDay} है।` : `${subject} ਅਧਿਐਨ ਖੇਤਰ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਦਿਨ ${subjectDay} ਹੈ।`;
    }
    return language === "hi" ? `${first} का दिन ${day} है।` : `${first} ਦਾ ਦਿਨ ${day} ਹੈ।`;
  }

  match = option.match(/^(.+) is assigned to (.+)\.$/u);
  if (match) {
    const person = translated(map, match[1]!);
    const subject = translated(map, match[2]!);
    return language === "hi" ? `${person} का अध्ययन क्षेत्र ${subject} है।` : `${person} ਦਾ ਅਧਿਐਨ ਖੇਤਰ ${subject} ਹੈ।`;
  }

  match = option.match(/^(.+) is scheduled in (.+)\.$/u);
  if (match) {
    const person = translated(map, match[1]!);
    const city = translated(map, match[2]!);
    return language === "hi" ? `${person} का शहर ${city} है।` : `${person} ਦਾ ਸ਼ਹਿਰ ${city} ਹੈ।`;
  }

  match = option.match(/^The person assigned to (.+) is scheduled in (.+)\.$/u);
  if (match) {
    const subject = translated(map, match[1]!);
    const city = translated(map, match[2]!);
    return language === "hi" ? `${subject} अध्ययन क्षेत्र वाला व्यक्ति ${city} शहर से जुड़ा है।` : `${subject} ਅਧਿਐਨ ਖੇਤਰ ਵਾਲਾ ਵਿਅਕਤੀ ${city} ਸ਼ਹਿਰ ਨਾਲ ਜੁੜਿਆ ਹੈ।`;
  }

  throw new Error(`Unsupported LP-006 projection statement surface: ${option}`);
}

function localizedBaseEvidence(language: Lp006ProjectionLocalizedLanguage, base: Lp001008LocalizedCaselet): string[] {
  const lines = [...base.children[0]!.explanation.lines];
  return lines.length > 1 ? lines.slice(0, -1) : lines;
}

function localizeProjectionChild(
  language: Lp006ProjectionLocalizedLanguage,
  caselet: Lp006ProjectionCaselet,
  base: Lp001008LocalizedCaselet,
  child: Lp006ProjectionChild,
  map: ValueMap,
): Lp006ProjectionLocalizedChild {
  if (child.qlId === "LP-QL-045") {
    if (!("sourceDimension" in child.proof)) throw new Error(`${child.questionId}: missing projection proof.`);
    const sourceValue = translated(map, child.proof.sourceValue);
    const targetValue = translated(map, child.proof.targetValue);
    const options = child.options.map((option) => translated(map, option));
    const answer = options[child.correctIndex]!;
    const question = nativeProjectionStem(language, child.proof.sourceDimension, child.proof.targetDimension, sourceValue);
    const decision = language === "hi"
      ? `पूरी तालिका में **${sourceValue}** और **${targetValue}** एक ही पंक्ति में हैं। इसलिए सही उत्तर **${targetValue}** है।`
      : `ਪੂਰੀ ਸਾਰਣੀ ਵਿੱਚ **${sourceValue}** ਅਤੇ **${targetValue}** ਇੱਕੋ ਕਤਾਰ ਵਿੱਚ ਹਨ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ **${targetValue}** ਹੈ।`;
    return {
      ...child,
      language,
      stem: `${base.scenario}\n\n${language === "hi" ? "शर्तें" : "ਸ਼ਰਤਾਂ"}:\n${base.learnerFacingClues.map((clue) => `- ${clue}`).join("\n")}\n\n${question}`,
      options,
      answer,
      explanation: {
        summary: language === "hi" ? `${sourceValue} वाली पंक्ति पढ़ें।` : `${sourceValue} ਵਾਲੀ ਕਤਾਰ ਪੜ੍ਹੋ।`,
        lines: [...localizedBaseEvidence(language, base), decision],
      },
    };
  }

  if (!("polarity" in child.proof)) throw new Error(`${child.questionId}: missing statement proof.`);
  const options = child.options.map((option) => statementFromEnglish(language, option, map));
  const answer = options[child.correctIndex]!;
  const stem = language === "hi"
    ? (child.proof.polarity === "CORRECT" ? "निम्नलिखित में से कौन-सा कथन सही है?" : "निम्नलिखित में से कौन-सा कथन सही नहीं है?")
    : (child.proof.polarity === "CORRECT" ? "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਨਹੀਂ ਹੈ?");
  const decision = language === "hi"
    ? `पूरी तालिका के अनुसार अपेक्षित कथन **${answer}** है।`
    : `ਪੂਰੀ ਸਾਰਣੀ ਅਨੁਸਾਰ ਲੋੜੀਂਦਾ ਕਥਨ **${answer}** ਹੈ।`;
  return {
    ...child,
    language,
    stem: `${base.scenario}\n\n${language === "hi" ? "शर्तें" : "ਸ਼ਰਤਾਂ"}:\n${base.learnerFacingClues.map((clue) => `- ${clue}`).join("\n")}\n\n${stem}`,
    options,
    answer,
    explanation: {
      summary: language === "hi" ? "पूरी तालिका देखकर अपेक्षित कथन चुनें।" : "ਪੂਰੀ ਸਾਰਣੀ ਦੇਖ ਕੇ ਲੋੜੀਂਦਾ ਕਥਨ ਚੁਣੋ।",
      lines: [...localizedBaseEvidence(language, base), decision],
    },
  };
}

export function generateLp006ProjectionLocalizedBatchV1(
  language: Lp006ProjectionLocalizedLanguage,
  seed = "lp-006-projection-localization-v1",
  count = 8,
): Lp006ProjectionLocalizedCaselet[] {
  const english = generateLp006ProjectionBatchV2(seed, count);
  const localizedBase = LP_001_008_LOCALIZED_GENERATORS_V4["LP-006"]!(language, seed, count);
  if (english.length !== localizedBase.length) throw new Error("LP-006 projection localization base batch length mismatch.");

  return english.map((caselet, index) => {
    const base = localizedBase[index]!;
    if (base.caseletId !== caselet.caseletId) throw new Error(`${caselet.caseletId}: localized base caselet ID mismatch.`);
    const map = buildValueMap(caselet, base);
    return {
      packageId: "LP-006",
      checkpointId: "LP-CP-006-PROJECTION",
      language,
      caseletId: caselet.caseletId,
      scenarioProfileId: caselet.scenarioProfileId,
      difficultyBand: caselet.difficultyBand,
      scenario: base.scenario,
      learnerFacingClues: base.learnerFacingClues,
      projectionChildren: caselet.projectionChildren.map((child) => localizeProjectionChild(language, caselet, base, child, map)),
      englishProjectionCaselet: caselet,
      localizedBaseCaselet: base,
    };
  });
}
