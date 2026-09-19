import type { BlrRelationId, DirectRelationClue } from "../../foundation/types";
import type { GenerationRelationId } from "../../foundation/family-analysis";
import type { BlrExactLineageRelationId } from "../lineage-prototype-types";

export type BlrCp001TranslatedLocale = "hi-IN" | "pa-IN";

export const BLR_CP001_LOCALIZATION_VERSION =
  "blr-cp001-hi-pa-localization-v1" as const;
export const BLR_CP001_MULTILINGUAL_RUNTIME_VERSION =
  "blr-cp001-permanent-multilingual-review-v1" as const;

type Pair = readonly [hi: string, pa: string];

const RELATIONS: Readonly<Record<BlrRelationId, Pair>> = {
  FATHER: ["पिता", "ਪਿਤਾ"],
  MOTHER: ["माता", "ਮਾਤਾ"],
  SON: ["पुत्र", "ਪੁੱਤਰ"],
  DAUGHTER: ["पुत्री", "ਧੀ"],
  BROTHER: ["भाई", "ਭਰਾ"],
  SISTER: ["बहन", "ਭੈਣ"],
  HUSBAND: ["पति", "ਪਤੀ"],
  WIFE: ["पत्नी", "ਪਤਨੀ"],
  GRANDFATHER: ["दादा/नाना", "ਦਾਦਾ/ਨਾਨਾ"],
  GRANDMOTHER: ["दादी/नानी", "ਦਾਦੀ/ਨਾਨੀ"],
  GRANDSON: ["पोता/नाती", "ਪੋਤਾ/ਦੋਹਤਾ"],
  GRANDDAUGHTER: ["पोती/नातिन", "ਪੋਤੀ/ਦੋਹਤੀ"],
  GREAT_GRANDFATHER: ["परदादा/परनाना", "ਪਰਦਾਦਾ/ਪਰਨਾਨਾ"],
  GREAT_GRANDMOTHER: ["परदादी/परनानी", "ਪਰਦਾਦੀ/ਪਰਨਾਨੀ"],
  GREAT_GRANDSON: ["परपोता/परनाती", "ਪਰਪੋਤਾ/ਪਰਦੋਹਤਾ"],
  GREAT_GRANDDAUGHTER: ["परपोती/परनातिन", "ਪਰਪੋਤੀ/ਪਰਦੋਹਤੀ"],
  UNCLE: ["चाचा/मामा", "ਚਾਚਾ/ਮਾਮਾ"],
  AUNT: ["बुआ/मौसी", "ਭੂਆ/ਮਾਸੀ"],
  NEPHEW: ["भतीजा/भांजा", "ਭਤੀਜਾ/ਭਾਣਜਾ"],
  NIECE: ["भतीजी/भांजी", "ਭਤੀਜੀ/ਭਾਣਜੀ"],
  COUSIN: ["कज़िन", "ਕਜ਼ਨ"],
  FATHER_IN_LAW: ["ससुर", "ਸਹੁਰਾ"],
  MOTHER_IN_LAW: ["सास", "ਸੱਸ"],
  SON_IN_LAW: ["दामाद", "ਜਵਾਈ"],
  DAUGHTER_IN_LAW: ["बहू", "ਨੂੰਹ"],
  BROTHER_IN_LAW: ["बहनोई/साला", "ਭੈਣੋਈ/ਸਾਲਾ"],
  SISTER_IN_LAW: ["भाभी/साली", "ਭਾਬੀ/ਸਾਲੀ"],
};

const FEMININE_RELATIONS = new Set<BlrRelationId>([
  "MOTHER", "DAUGHTER", "SISTER", "WIFE", "GRANDMOTHER", "GRANDDAUGHTER",
  "GREAT_GRANDMOTHER", "GREAT_GRANDDAUGHTER", "AUNT", "NIECE",
  "MOTHER_IN_LAW", "DAUGHTER_IN_LAW", "SISTER_IN_LAW",
]);

const GENERATIONS: Readonly<Record<GenerationRelationId, Pair>> = {
  SAME_GENERATION: ["उसी पीढ़ी में", "ਉਸੇ ਪੀੜ੍ਹੀ ਵਿੱਚ"],
  ONE_GENERATION_ABOVE: ["एक पीढ़ी ऊपर", "ਇੱਕ ਪੀੜ੍ਹੀ ਉੱਪਰ"],
  TWO_GENERATIONS_ABOVE: ["दो पीढ़ियाँ ऊपर", "ਦੋ ਪੀੜ੍ਹੀਆਂ ਉੱਪਰ"],
  ONE_GENERATION_BELOW: ["एक पीढ़ी नीचे", "ਇੱਕ ਪੀੜ੍ਹੀ ਹੇਠਾਂ"],
  TWO_GENERATIONS_BELOW: ["दो पीढ़ियाँ नीचे", "ਦੋ ਪੀੜ੍ਹੀਆਂ ਹੇਠਾਂ"],
};

const EXACT_LINEAGE: Readonly<Record<BlrExactLineageRelationId, Pair>> = {
  PATERNAL_GRANDFATHER: ["दादा", "ਦਾਦਾ"],
  PATERNAL_GRANDMOTHER: ["दादी", "ਦਾਦੀ"],
  MATERNAL_GRANDFATHER: ["नाना", "ਨਾਨਾ"],
  MATERNAL_GRANDMOTHER: ["नानी", "ਨਾਨੀ"],
  PATERNAL_UNCLE: ["चाचा/ताऊ", "ਚਾਚਾ/ਤਾਇਆ"],
  PATERNAL_AUNT: ["बुआ", "ਭੂਆ"],
  MATERNAL_UNCLE: ["मामा", "ਮਾਮਾ"],
  MATERNAL_AUNT: ["मौसी", "ਮਾਸੀ"],
};

export function localeText(
  locale: BlrCp001TranslatedLocale,
  hi: string,
  pa: string,
): string {
  return locale === "hi-IN" ? hi : pa;
}

export function cp001RelationLabel(
  relationId: BlrRelationId,
  locale: BlrCp001TranslatedLocale,
): string {
  const pair = RELATIONS[relationId];
  return locale === "hi-IN" ? pair[0] : pair[1];
}

function possessive(
  relationId: BlrRelationId,
  locale: BlrCp001TranslatedLocale,
): string {
  const feminine = FEMININE_RELATIONS.has(relationId);
  return locale === "hi-IN"
    ? feminine ? "की" : "का"
    : feminine ? "ਦੀ" : "ਦਾ";
}

export function cp001RelationStatement(
  subject: string,
  relationId: BlrRelationId,
  reference: string,
  locale: BlrCp001TranslatedLocale,
): string {
  const relation = cp001RelationLabel(relationId, locale);
  return locale === "hi-IN"
    ? `${subject}, ${reference} ${possessive(relationId, locale)} ${relation} है।`
    : `${subject}, ${reference} ${possessive(relationId, locale)} ${relation} ਹੈ।`;
}

export function cp001ClueText(
  clue: DirectRelationClue,
  names: Readonly<Record<string, string>>,
  locale: BlrCp001TranslatedLocale,
): string {
  return cp001RelationStatement(
    names[clue.subjectId] ?? clue.subjectId,
    clue.relationId,
    names[clue.referenceId] ?? clue.referenceId,
    locale,
  );
}

export function cp001GenerationLabel(
  relationId: GenerationRelationId,
  locale: BlrCp001TranslatedLocale,
): string {
  const pair = GENERATIONS[relationId];
  return locale === "hi-IN" ? pair[0] : pair[1];
}

export function cp001ExactLineageLabel(
  relationId: BlrExactLineageRelationId,
  locale: BlrCp001TranslatedLocale,
): string {
  const pair = EXACT_LINEAGE[relationId];
  return locale === "hi-IN" ? pair[0] : pair[1];
}

export function cp001RelationQuestion(
  subject: string,
  reference: string,
  locale: BlrCp001TranslatedLocale,
): string {
  return localeText(
    locale,
    `${subject} का ${reference} से क्या संबंध है?`,
    `${subject} ਦਾ ${reference} ਨਾਲ ਕੀ ਰਿਸ਼ਤਾ ਹੈ?`,
  );
}

export function cp001IdentifyPersonQuestion(
  reference: string,
  relationId: BlrRelationId,
  locale: BlrCp001TranslatedLocale,
): string {
  const relation = cp001RelationLabel(relationId, locale);
  return localeText(
    locale,
    `${reference} ${possessive(relationId, locale)} ${relation} कौन है?`,
    `${reference} ${possessive(relationId, locale)} ${relation} ਕੌਣ ਹੈ?`,
  );
}
