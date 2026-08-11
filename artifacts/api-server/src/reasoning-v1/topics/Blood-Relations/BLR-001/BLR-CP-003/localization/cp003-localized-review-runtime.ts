import { stableHash } from "../../foundation/prng";
import type { BlrCp003FinalApprovedRecord } from "../cp003-final-approved-bank";
import {
  localizeBlrCp003Question,
  type GeneratedBlrCp003LocalizedQuestion,
} from "./cp003-localizer";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";
import { localizedBlrCp003SharedPromptCompleteV5 } from "./cp003-passage-grammar-v5";

function canonicalStemWithReferenceFallback(record: BlrCp003FinalApprovedRecord): string {
  const hasNamedPerson = record.proceduralLogic.nodes.some((node) =>
    node.label && record.stem.includes(node.label),
  );
  if (hasNamedPerson) return record.stem;
  const referenceId = record.evidencePaths[0]?.referenceId;
  const reference = referenceId
    ? record.proceduralLogic.nodes.find((node) => node.id === referenceId)?.label
    : undefined;
  return reference ? `${record.stem} ${reference}` : record.stem;
}

export function localizeBlrCp003QuestionComplete(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): GeneratedBlrCp003LocalizedQuestion {
  const safeRecord: BlrCp003FinalApprovedRecord = {
    ...record,
    sharedPrompt: "Study the following information.",
    stem: canonicalStemWithReferenceFallback(record),
  };
  const base = localizeBlrCp003Question(safeRecord, locale);
  const sharedPrompt = localizedBlrCp003SharedPromptCompleteV5(record, locale);
  const localizedSemanticFingerprint = stableHash([
    record.metadata.semanticFingerprint,
    locale,
    sharedPrompt,
    base.stem,
    ...base.options.map((option) => option.text),
    base.editorial.conclusion,
  ]);
  return {
    ...base,
    sharedPrompt,
    metadata: {
      ...base.metadata,
      localizedSemanticFingerprint,
    },
  };
}

export function generateBlrCp003LocalizedReviewBank(
  records: readonly BlrCp003FinalApprovedRecord[],
  locale: BlrCp003TranslatedLocale,
): readonly GeneratedBlrCp003LocalizedQuestion[] {
  return records.map((record) => localizeBlrCp003QuestionComplete(record, locale));
}
