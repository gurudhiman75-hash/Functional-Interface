import { buildPnc002ProductionTeacherStudentPresentation } from "./student-presentation-teacher-production";
import type {
  PncStudentExplanationSection,
  PncStudentSourcePackage,
} from "./student-presentation";
import {
  formatLocalizedOption,
  localizedSectionHeading,
  localizedUnitLabel,
  parsePositiveInteger,
} from "./localization-glossary";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export interface PncLocalizationFamilyCopy {
  title: string;
  concept: string;
  method: string;
  traps: readonly [string, string, string];
}

export interface PncCheckpointLocalizationConfig {
  canonicalProblemId: string;
  firstQlNumber: number;
  lastQlNumber: number;
  stems: Record<PncStudentLocale, readonly string[]>;
  familyFor: (qlNumber: number) => string;
  familyCopy: Record<string, Record<PncStudentLocale, PncLocalizationFamilyCopy>>;
}

function numericTokens(value: string): string[] {
  return [...value.matchAll(/-?\d+(?:,\d{3})*/g)].map((match) => match[0]!);
}

function mathTokens(value: string): string[] {
  return [
    ...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g),
  ].map((match) => match[0]!);
}

function fillTemplate(
  template: string,
  numbers: readonly string[],
  maths: readonly string[],
  qlId: string,
): string {
  return template.replace(/\{m(\d+)\}|\{(\d+)\}/g, (_match, mathIndex: string | undefined, numberIndex: string | undefined) => {
    const value = mathIndex !== undefined
      ? maths[Number(mathIndex)]
      : numbers[Number(numberIndex)];
    if (value === undefined) throw new Error(`${qlId}: missing localisation token`);
    return value;
  });
}

function getSection(
  sections: readonly PncStudentExplanationSection[],
  kind: PncStudentExplanationSection["kind"],
): PncStudentExplanationSection {
  const section = sections.find((candidate) => candidate.kind === kind);
  if (!section) throw new Error(`PNC English presentation is missing ${kind}`);
  return section;
}

function formulaPhrase(values: readonly string[], locale: PncStudentLocale): string {
  if (!values.length) return "";
  return locale === "hi-IN"
    ? ` यहाँ ${values.join(" तथा ")} प्राप्त होता है।`
    : ` ਇੱਥੇ ${values.join(" ਅਤੇ ")} ਮਿਲਦਾ ਹੈ।`;
}

function optionIndex(line: string, fallback: number): number {
  const match = line.match(/Option\s+([A-D])/i);
  return match ? match[1]!.toUpperCase().charCodeAt(0) - 65 : fallback;
}

function stepLabels(locale: PncStudentLocale): readonly [string, string, string, string] {
  return locale === "hi-IN"
    ? ["शर्त समझें", "गिनती की योजना", "गणना करें", "उत्तर जाँचें"]
    : ["ਸ਼ਰਤ ਸਮਝੋ", "ਗਿਣਤੀ ਦੀ ਯੋਜਨਾ", "ਹਿਸਾਬ ਕਰੋ", "ਉੱਤਰ ਜਾਂਚੋ"];
}

function calculationLine(locale: PncStudentLocale): string {
  return locale === "hi-IN"
    ? "अब आवश्यक संयोजन, क्रमचय, गुणा, जोड़ या घटाव को उसी क्रम में पूरा कीजिए।"
    : "ਹੁਣ ਲੋੜੀਂਦੀ ਚੋਣ, ਕ੍ਰਮ, ਗੁਣਾ, ਜੋੜ ਜਾਂ ਘਟਾਉ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਪੂਰਾ ਕਰੋ।";
}

function checkingLine(locale: PncStudentLocale, answerLabel: string): string {
  return locale === "hi-IN"
    ? `गणना सरल करके विकल्पों से मिलाने पर सही उत्तर ${answerLabel} है।`
    : `ਹਿਸਾਬ ਸੌਖਾ ਕਰਕੇ ਚੋਣਾਂ ਨਾਲ ਮਿਲਾਉਣ ਉੱਤੇ ਸਹੀ ਉੱਤਰ ${answerLabel} ਹੈ।`;
}

export function buildPncCheckpointLocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
  config: PncCheckpointLocalizationConfig,
): PncLocalizedStudentPresentation {
  const qlNumber = Number(source.questionLanguageId.slice(-3));
  if (
    source.canonicalProblemId !== config.canonicalProblemId
    || qlNumber < config.firstQlNumber
    || qlNumber > config.lastQlNumber
  ) {
    throw new Error(`${source.questionLanguageId}: outside ${config.canonicalProblemId} localisation range`);
  }

  const index = qlNumber - config.firstQlNumber;
  const template = config.stems[locale][index];
  if (!template) throw new Error(`${source.questionLanguageId}: missing ${locale} stem`);

  const family = config.familyFor(qlNumber);
  const copy = config.familyCopy[family]?.[locale];
  if (!copy) throw new Error(`${source.questionLanguageId}: missing ${locale} family copy for ${family}`);

  const english = buildPnc002ProductionTeacherStudentPresentation(source);
  const displayOptions = source.options.map((value) => formatLocalizedOption(value, english.optionUnit, locale));
  const answerLabel = displayOptions[source.correctIndex]!;
  const englishSteps = getSection(english.explanationSections, "stepByStep");
  const englishShortcut = getSection(english.explanationSections, "examSpeedShortcut");
  const englishTraps = getSection(english.explanationSections, "commonTrapWarning");
  const labels = stepLabels(locale);
  const localStepText = [
    copy.concept,
    copy.method,
    calculationLine(locale),
    checkingLine(locale, answerLabel),
  ] as const;
  const wrongIndexes = [0, 1, 2, 3].filter((candidate) => candidate !== source.correctIndex);

  return {
    ...english,
    locale,
    sourceLocale: "en-GB",
    stem: fillTemplate(
      template,
      numericTokens(english.stem),
      mathTokens(english.stem),
      source.questionLanguageId,
    ),
    optionUnit: localizedUnitLabel(
      english.optionUnit,
      parsePositiveInteger(source.answer),
      locale,
    ),
    displayOptions,
    answerLabel,
    explanationSections: [
      {
        kind: "coreConcept",
        heading: locale === "hi-IN"
          ? `📌 मूल अवधारणा — ${copy.title}`
          : `📌 ਮੁੱਖ ਵਿਚਾਰ — ${copy.title}`,
        lines: [copy.concept, copy.method],
      },
      {
        kind: "stepByStep",
        heading: localizedSectionHeading("stepByStep", locale),
        lines: englishSteps.lines.map((line, stepIndex) => {
          const localIndex = Math.min(stepIndex, 3);
          return `${stepIndex + 1}. **${labels[localIndex]}:** ${localStepText[localIndex]}${formulaPhrase(mathTokens(line), locale)}`;
        }),
      },
      {
        kind: "examSpeedShortcut",
        heading: localizedSectionHeading("examSpeedShortcut", locale),
        lines: [
          `${copy.method}${formulaPhrase(mathTokens(englishShortcut.lines.join("\n")), locale)}`,
        ],
      },
      {
        kind: "commonTrapWarning",
        heading: localizedSectionHeading("commonTrapWarning", locale),
        lines: englishTraps.lines.map((line, trapIndex) => {
          const selectedIndex = optionIndex(
            line,
            wrongIndexes[trapIndex] ?? wrongIndexes[0] ?? 0,
          );
          const prefix = locale === "hi-IN"
            ? `विकल्प ${String.fromCharCode(65 + selectedIndex)}`
            : `ਚੋਣ ${String.fromCharCode(65 + selectedIndex)}`;
          return `${prefix} (${displayOptions[selectedIndex]}): ${copy.traps[trapIndex % 3]}${formulaPhrase(mathTokens(line), locale)}`;
        }),
      },
    ],
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
