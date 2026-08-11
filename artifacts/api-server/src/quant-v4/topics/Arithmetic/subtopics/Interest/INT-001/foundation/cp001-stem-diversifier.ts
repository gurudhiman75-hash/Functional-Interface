import { deterministicIndex } from "./prng";
import type { IntCp001PrototypeParameters } from "./types";

export function diversifyIntCp001StemOpening(
  stem: string,
  parameters: IntCp001PrototypeParameters,
): string {
  const { context } = parameters;
  const existingLeads = [
    `${context.actor} uses ${context.instrument} from ${context.institution}`,
    `For ${context.purpose}, ${context.actor} takes ${context.instrument} from ${context.institution}`,
    `${context.institution} records ${context.actor}'s ${context.instrument}`,
    `${context.actor}'s ${context.instrument} with ${context.institution}`,
  ];
  const matchedLead = existingLeads.find((lead) => stem.startsWith(lead));
  if (!matchedLead) return stem;

  const institution = context.scenarioId === "PERSONAL_LENDING"
    ? "a local lender"
    : context.institution;
  const alternatives = [
    `${context.actor}'s ${context.instrument} is administered by ${institution}`,
    `At ${institution}, ${context.actor} has the ${context.instrument}`,
    `${institution} maintains the ${context.instrument} for ${context.actor}`,
    `For ${context.purpose}, ${context.actor} arranged the ${context.instrument} through ${institution}`,
    `The ${context.instrument} held by ${context.actor} is with ${institution}`,
    `${context.actor} obtained the ${context.instrument} through ${institution}`,
    `${context.actor}'s ${context.instrument} appears in records held by ${institution}`,
    `${institution} provided the ${context.instrument} used by ${context.actor} for ${context.purpose}`,
  ];
  const replacement = alternatives[
    deterministicIndex(
      `${parameters.prototypeId}:${parameters.seed}:${parameters.generationFingerprint}:opening`,
      alternatives.length,
    )
  ]!;
  return `${replacement}${stem.slice(matchedLead.length)}`;
}
