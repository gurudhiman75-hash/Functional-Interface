import { generateCp009IntegratedQuestion } from "./cp009-integrated.ts";
import type { CaeLocale, GeneratedCaeQuestion } from "./types.ts";

const RELATION_EVIDENCE: Readonly<Record<CaeLocale, string>> = {
  "en-IN": "The causal information establishes the chain P → Q → R → S.",
  "hi-IN": "कारणात्मक जानकारी P → Q → R → S की श्रृंखला स्थापित करती है।",
  "pa-IN": "ਕਾਰਨਾਤਮਕ ਜਾਣਕਾਰੀ P → Q → R → S ਦੀ ਲੜੀ ਸਥਾਪਤ ਕਰਦੀ ਹੈ।",
};

/**
 * Editorial polish for reviewed CP009 relation-type items.
 * The semantic graph and answer remain unchanged; only the answer-leading
 * sentence that explicitly spells out P → Q → R → S is removed. Learners
 * must infer the causal path from the four event statements themselves.
 */
export function generateReviewedCp009Question(
  input: Readonly<{ locale: CaeLocale; seed: number }>,
): GeneratedCaeQuestion {
  const base = generateCp009IntegratedQuestion(input);
  const mode = base.causalStructure.split(":")[1];
  if (mode !== "RELATION_TYPE") return base;

  const cue = RELATION_EVIDENCE[input.locale];
  const stem = base.stem
    .split("\n")
    .filter((line) => line.trim() !== cue)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const causalStateId = `${base.causalStateId}|surface:no-explicit-chain-cue`;
  const itemVariantId = `${causalStateId}|presentation:${base.optionMetadata.map((option) => option.id).join(">")}`;

  return Object.freeze({
    ...base,
    causalStateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    stem,
  });
}
