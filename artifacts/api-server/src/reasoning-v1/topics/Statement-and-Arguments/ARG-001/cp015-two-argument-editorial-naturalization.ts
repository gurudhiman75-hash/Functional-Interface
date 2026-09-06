import { createHash } from "node:crypto";

export const ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY = "ARG_CP015_TWO_ARGUMENT_EDITORIAL_NATURALIZATION_V1" as const;

type Question = Readonly<Record<string, any>>;
type Strength = "STRONG" | "WEAK";

type EditorialPatch = Readonly<{
  arguments?: readonly string[];
  reasons: readonly [string, string];
}>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function displayedStrengths(question: Question): readonly [Strength, Strength] | undefined {
  const strengths = Array.isArray(question.argumentStrengths) ? question.argumentStrengths : [];
  if (strengths.length !== 2) return undefined;
  const first = text(strengths[0]).toUpperCase();
  const second = text(strengths[1]).toUpperCase();
  if ((first !== "STRONG" && first !== "WEAK") || (second !== "STRONG" && second !== "WEAK")) return undefined;
  return [first as Strength, second as Strength] as const;
}

function explanationFromDisplayedOrder(
  strengths: readonly [Strength, Strength],
  reasons: readonly [string, string],
): string {
  return reasons
    .map((reason, index) => `Argument ${index === 0 ? "I" : "II"} is ${strengths[index]!.toLowerCase()}: ${reason}`)
    .join(" ");
}

function helplinePatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const match = statement.match(/^Should (.+) include (.+) for (.+) about (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3] || !match[4]) return undefined;
  const document = match[1];
  const contact = match[2];
  const purpose = match[3];
  const issue = match[4];
  const args = Object.freeze([
    `No. ${contact} should be left off ${document} simply because ${document} are not meant to carry that contact detail.`,
    `Yes. Once ${contact} is printed on ${document}, all ${issue} raised during ${purpose} will be resolved immediately.`,
  ]);
  return Object.freeze({
    arguments: args,
    reasons: [
      `It gives no practical drawback of printing ${contact}; it merely restates that ${document} are not meant to contain it.`,
      `${contact} can make ${purpose} easier, but a contact route cannot guarantee immediate resolution of all ${issue}.`,
    ] as const,
  });
}

function partialInterventionPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const match = statement.match(/^Should (.+) be required to provide (.+)\?$/i);
  if (!match?.[1] || !match[2] || args.length !== 2) return undefined;
  const place = match[1];
  const intervention = match[2];
  const reasons = args.map((argument) => {
    const condition = text(argument).match(/supported by (.+)\.$/i)?.[1];
    const outcome = text(argument).match(/can improve (.+?) when/i)?.[1];
    if (/alone will solve/i.test(argument)) {
      return `It turns ${intervention} at ${place} into a claim that one limited measure can solve the entire city-wide waste problem, far beyond what the proposal can establish.`;
    }
    return `It links ${intervention} at ${place} to the specific benefit of improving ${outcome ?? "waste separation"}${condition ? ` and expressly recognises the supporting role of ${condition}` : ""}.`;
  }) as [string, string];
  return Object.freeze({ reasons });
}

function securityFrictionPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const transfer = statement.match(/freeze for (.+?) through/i)?.[1];
  const incident = statement.match(/when they notice (.+)\?$/i)?.[1];
  if (!transfer || !incident || args.length !== 2) return undefined;
  const reasons = args.map((argument) => /mistake|block urgent/i.test(argument)
    ? `An emergency freeze can accidentally block legitimate ${transfer}, so recovery and confirmation controls are a material design safeguard.`
    : `After ${incident}, the freeze can limit further unauthorised ${transfer} while the customer seeks help, which is a direct fraud-control benefit.`) as [string, string];
  return Object.freeze({ reasons });
}

function digitalSuperiorityPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const match = statement.match(/^Should every (.+) replace all (.+) with (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3] || args.length !== 2) return undefined;
  const programme = match[1];
  const current = match[2];
  const replacement = match[3];
  const reasons = args.map((argument) => /certainly lose all ability|total failure/i.test(argument)
    ? `It assumes that replacing ${current} with ${replacement} in every ${programme} will certainly destroy the relevant learning outcome, but gives no mechanism or evidence for that universal result.`
    : `A digital format does not by itself prove that ${replacement} leads to better learning than ${current}.`) as [string, string];
  return Object.freeze({ reasons });
}

function targetedSupportPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const support = statement.match(/^Should schools provide (.+?) for (.+)\?$/i);
  if (!support?.[1] || !support[2] || args.length !== 2) return undefined;
  const intervention = support[1];
  const group = support[2];
  const reasons = args.map((argument) => /permanently dependent/i.test(argument)
    ? `It predicts that all ${group} receiving ${intervention} will become permanently dependent on extra help, an absolute outcome for which no basis is given.`
    : `The proposal targets ${group} with additional practice while leaving the ordinary class pace unchanged, so it is a proportionate response to an identified learning need.`) as [string, string];
  return Object.freeze({ reasons });
}

function mobilityPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const match = statement.match(/^Should (.+) provide (.+) for (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3] || args.length !== 2) return undefined;
  const institution = match[1];
  const accommodation = match[2];
  const group = match[3];
  const reasons = args.map((argument) => /simply trying to avoid/i.test(argument)
    ? `It dismisses the mobility burden as mere queue avoidance instead of addressing the documented access difficulty faced by ${group}.`
    : `The proposed ${accommodation} at ${institution} directly addresses a service-access burden that falls disproportionately on ${group}, tying the accommodation to a material need.`) as [string, string];
  return Object.freeze({ reasons });
}

function interimSafeguardPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const match = statement.match(/^Should (.+) immediately permanently (.+) after (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3] || args.length !== 2) return undefined;
  const actor = match[1];
  const action = match[2];
  const trigger = match[3];
  const reasons = args.map((argument) => /guilt is certain/i.test(argument)
    ? `It treats ${trigger} as if it were already proof of guilt and ignores proportionate intermediate safeguards.`
    : `Temporary protective action plus fact-checking lets ${actor} manage risk without irreversibly deciding to ${action} before ${trigger} is verified.`) as [string, string];
  return Object.freeze({ reasons });
}

function proportionalResponsePatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  const match = statement.match(/^Should (.+) automatically (.+) whenever (?:it|they) receive(?:s)? (?:a|an) (.+?) about (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3] || !match[4] || args.length !== 2) return undefined;
  const actor = match[1];
  const complaint = match[3];
  const context = match[4];
  const normalizedArguments = args.map((argument) => text(argument)
    .replace(/\bA single (?:a|an) /g, "A single ")
    .replace(/\bevery (?:a|an) /g, "every ")) as [string, string];
  const reasons = normalizedArguments.map((argument) => /proves that every candidate and centre/i.test(argument)
    ? `Receiving ${complaint} about ${context} does not establish that every candidate or centre was affected; evidence and scope still need verification before the proposed automatic action.`
    : `The choice is not limited to ignoring ${complaint} or abandoning ${context}; ${actor} can verify the evidence and use a proportionate remedy.`) as [string, string];
  return Object.freeze({ arguments: Object.freeze(normalizedArguments), reasons });
}

function patchFor(question: Question): EditorialPatch | undefined {
  switch (text(question.archetype)) {
    case "HELPLINE_RESTATEMENT_OVERCLAIM": return helplinePatch(question);
    case "PARTIAL_INTERVENTION_OVERCLAIM": return partialInterventionPatch(question);
    case "SECURITY_VS_SERVICE_FRICTION": return securityFrictionPatch(question);
    case "DIGITAL_SUPERIORITY_ASSERTION": return digitalSuperiorityPatch(question);
    case "TARGETED_REMEDIAL_SUPPORT": return targetedSupportPatch(question);
    case "MOBILITY_ACCOMMODATION": return mobilityPatch(question);
    case "INTERIM_SAFEGUARD_DUE_PROCESS": return interimSafeguardPatch(question);
    case "PROPORTIONAL_RESPONSE_FALSE_DILEMMA": return proportionalResponsePatch(question);
    default: return undefined;
  }
}

export function naturalizeArgCp015TwoArgumentEditorial(question: Question): Question {
  if (question.locale !== "en-IN" && question.language !== "en") return question;
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (argumentsList.length !== 2) return question;
  const strengths = displayedStrengths(question);
  if (!strengths) return question;
  const patch = patchFor(question);
  if (!patch) return question;

  const nextArguments = Object.freeze([...(patch.arguments ?? argumentsList)]);
  const explanation = explanationFromDisplayedOrder(strengths, patch.reasons);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY,
    question.qlId,
    question.templateId,
    question.statement,
    nextArguments,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");
  const stem = `Statement: ${text(question.statement)}\nArguments:\nI. ${nextArguments[0]}\nII. ${nextArguments[1]}`;

  return Object.freeze({
    ...question,
    arguments: nextArguments,
    explanation,
    stem,
    text: stem,
    sourceExplanation: question.explanation,
    twoArgumentEditorialAuthority: ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY,
    twoArgumentEditorialArchetype: question.archetype,
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:EDITORIAL`,
    diversitySourceMode: "CP014_APPROVED_SEMANTICS_WITH_CP015_QUESTION_SPECIFIC_EDITORIAL_SURFACE" as const,
  });
}
