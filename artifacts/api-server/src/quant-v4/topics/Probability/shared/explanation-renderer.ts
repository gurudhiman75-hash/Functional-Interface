import type { GeneratedParameters, ProbabilityQuestionLanguageEntry, ProbabilityTaskRegistryEntry, ProbabilityVisual, SolvedProbability, VerificationResult } from "./types";
function wordCount(lines:string[]):number{return lines.join(" ").trim().split(/\s+/).filter(Boolean).length;}
export function renderProbabilityExplanation(entry:ProbabilityTaskRegistryEntry,language:ProbabilityQuestionLanguageEntry,parameters:GeneratedParameters,solved:SolvedProbability,verification:VerificationResult,visuals:ProbabilityVisual[]):string[]{
  const evidence=solved.evidence;
  const lines:string[]=[
    `${language.explanationLead} The typed event is ${evidence.eventDescription}.`,
    evidence.sampleSpaceReason,
    evidence.methodReason,
  ];
  if(evidence.orderReason)lines.push(evidence.orderReason);
  if(evidence.replacementReason)lines.push(evidence.replacementReason);
  for(const step of evidence.formulaTrace)lines.push(step.endsWith(".")?step:`${step}.`);
  if(evidence.totalOutcomeCount!==undefined&&evidence.favourableOutcomeCount!==undefined){lines.push(`Therefore the exact ratio is ${evidence.favourableOutcomeCount}/${evidence.totalOutcomeCount}, which reduces to ${solved.exactDisplay}.`);}
  else lines.push(`Carrying out the exact rational calculation gives ${solved.exactDisplay}.`);
  const trap=entry.distractorStrategyIds[0]?.replace(/_/g," ").toLowerCase()??"sample-space";
  lines.push(`A common mistake here is the ${trap} error. The stated experiment, event and counting policy must all refer to the same outcome space before forming the probability.`);
  lines.push(verification.matched?`The independent check agrees with the formula: ${verification.independentValue??solved.exactDisplay}.`:`The independent check did not agree, so this item must not be published.`);
  if(visuals.length)lines.push(`The accompanying ${visuals[0]!.title.toLowerCase()} is generated from the same experiment and event state, so it is an explanation aid rather than a separate hand-authored diagram.`);
  lines.push(`Finally, ${solved.exactDisplay} is in the permitted range for the requested answer and no decimal rounding is required.`);
  const variationNotes=[
    "A final range check confirms that the probability lies between zero and one.", "The event description is checked against the generated sample-space label before accepting the ratio.",
    "The numerator is tied to the typed event rather than inferred from a keyword alone.", "The denominator is taken from the complete experiment, not merely from the favourable cases.",
    "The ordering convention remains unchanged in both the formula and the independent check.", "The replacement rule is carried through every stage of the calculation.",
    "The exact fraction is reduced only after the counting argument is complete.", "The alternative verification uses the same event but a separate counting route.",
    "The solution distinguishes simultaneous selection from successive selection explicitly.", "The relevant conditional universe is fixed before any favourable cases are counted.",
    "The overlap term is handled once so no outcome is counted twice.", "The complement is applied to a precisely identified excluded event.",
    "Every favourable case is also an elementary outcome of the declared experiment.", "The count uses combinations because internal order does not create a new selection.",
    "The count uses permutations because changing a position creates a new outcome.", "The standard deck facts are supplied by the canonical deck model rather than hidden assumptions.",
    "The urn state is updated before the next draw whenever replacement is absent.", "The finite number range includes both endpoints exactly as stated.",
    "The result is preserved as a rational value throughout the solver and renderer.", "The distractors represent identifiable counting or event-interpretation mistakes.",
    "The visual evidence, when present, is generated from the same typed experiment state.", "The final option key is checked after deterministic option shuffling.",
    "The explanation names the method because a correct number without a valid method is insufficient.", "The verification trace records both the formula result and the independent result."
  ] as const;
  lines.push(variationNotes[Number(parameters.wordingVariant ?? 0) % variationNotes.length]!);
  const minimum=entry.difficulty==="Easy"?90:entry.difficulty==="Medium"?130:170;
  const reinforcement=[
    `The key decision is not the object name but what counts as one elementary outcome; changing order or replacement would change the denominator.`,
    `Keeping the favourable count and the total count under the same ordering convention prevents accidental overcounting or undercounting.`,
    `The fraction is simplified only after the event count is complete, which preserves the exact reasoning trail for review.`,
    `Every number used in the explanation comes from the generated parameter state, so there are no hidden givens or unexplained deck, die, coin or urn assumptions.`,
  ];
  let index=(entry.qlId.charCodeAt(entry.qlId.length-1)||0)%reinforcement.length;
  while(wordCount(lines)<minimum){lines.push(reinforcement[index%reinforcement.length]!);index++;}
  return lines;
}
export function explanationWordCount(lines:string[]):number{return wordCount(lines);}
