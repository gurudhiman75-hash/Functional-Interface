import { createHash } from "node:crypto";

export const ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY = "ARG_CP015_TWO_ARGUMENT_EDITORIAL_NATURALIZATION_V1" as const;

type Question = Readonly<Record<string, any>>;

type EditorialPatch = Readonly<{
  arguments?: readonly string[];
  explanation: string;
}>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sentence(value: string): string {
  return value.trim().replace(/[.?!]+$/, "");
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
    `No. The ${contact} should be left off ${document} simply because ${document} are not meant to carry that contact detail.`,
    `Yes. Once the ${contact} is printed on ${document}, every ${issue} raised during ${purpose} will be resolved immediately.`,
  ]);
  return Object.freeze({
    arguments: args,
    explanation: `Argument I is weak: It gives no practical drawback of printing the ${contact}; it merely restates that ${document} are not meant to contain it. Argument II is weak: The ${contact} can make ${purpose} easier, but a contact route cannot guarantee immediate resolution of every ${issue}.`,
  });
}

function partialInterventionPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const match = statement.match(/^Should (.+) be required to provide (.+)\?$/i);
  const condition = text(args?.[0]).match(/supported by (.+)\.$/i)?.[1];
  const outcome = text(args?.[0]).match(/can improve (.+?) when/i)?.[1];
  if (!match?.[1] || !match[2]) return undefined;
  const place = match[1];
  const intervention = match[2];
  return Object.freeze({
    explanation: `Argument I is strong: At ${place}, ${intervention} is linked to the specific benefit of improving ${outcome ?? "waste separation"}${condition ? `, and the argument expressly recognises that ${condition} is also needed` : ""}. Argument II is weak: It turns the same limited measure into a claim that ${intervention} alone can solve the entire city-wide waste problem, which is far broader than the stated mechanism supports.`,
  });
}

function securityFrictionPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const transfer = statement.match(/freeze for (.+?) through/i)?.[1];
  const incident = statement.match(/when they notice (.+)\?$/i)?.[1];
  if (!transfer || !incident) return undefined;
  return Object.freeze({
    explanation: `Argument I is strong: An emergency freeze can accidentally block legitimate ${transfer}, so recovery and confirmation controls are a material design safeguard rather than an objection unrelated to the proposal. Argument II is strong: After ${incident}, the same freeze can immediately limit further unauthorised ${transfer} while the customer seeks help. Both arguments therefore address real consequences of the proposed control.`,
  });
}

function digitalSuperiorityPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const match = statement.match(/^Should every (.+) replace all (.+) with (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3]) return undefined;
  const programme = match[1];
  const current = match[2];
  const replacement = match[3];
  return Object.freeze({
    explanation: `Argument I is weak: It assumes that replacing ${current} with ${replacement} in every ${programme} will certainly destroy the relevant learning outcome, but gives no mechanism or evidence for such a universal result. Argument II is weak: The fact that ${replacement} is digital does not by itself prove that it produces better learning than ${current}.`,
  });
}

function targetedSupportPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const support = statement.match(/^Should schools provide (.+?) for (.+)\?$/i);
  if (!support?.[1] || !support[2]) return undefined;
  const intervention = support[1];
  const group = support[2];
  return Object.freeze({
    explanation: `Argument I is weak: It predicts that all ${group} receiving ${intervention} will become permanently dependent on extra help, an absolute outcome for which no basis is given. Argument II is strong: The proposal targets ${group} with additional practice while leaving the ordinary class pace unchanged, so it is a proportionate response to an identified learning need.`,
  });
}

function mobilityPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const match = statement.match(/^Should (.+) provide (.+) for (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3]) return undefined;
  const institution = match[1];
  const accommodation = match[2];
  const group = match[3];
  return Object.freeze({
    explanation: `Argument I is strong: ${accommodation} at ${institution} directly reduces a service-access burden that falls disproportionately on ${group}, so the accommodation is tied to a material need. Argument II is weak: It dismisses that mobility burden as mere queue avoidance instead of addressing the documented access difficulty faced by ${group}.`,
  });
}

function interimSafeguardPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const match = statement.match(/^Should (.+) immediately permanently (.+) after (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3]) return undefined;
  const actor = match[1];
  const action = match[2];
  const trigger = match[3];
  return Object.freeze({
    explanation: `Argument I is strong: Temporary protective action plus fact-checking lets ${actor} manage risk without irreversibly deciding to ${action} before ${trigger} is verified. Argument II is weak: It treats ${trigger} as if it were already proof of guilt and ignores proportionate intermediate safeguards.`,
  });
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
    default: return undefined;
  }
}

export function naturalizeArgCp015TwoArgumentEditorial(question: Question): Question {
  if (question.locale !== "en-IN" && question.language !== "en") return question;
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (argumentsList.length !== 2) return question;
  const patch = patchFor(question);
  if (!patch) return question;

  const nextArguments = Object.freeze([...(patch.arguments ?? argumentsList)]);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY,
    question.qlId,
    question.templateId,
    question.statement,
    nextArguments,
    question.options,
    question.correctIndex,
    patch.explanation,
  ])).digest("hex");
  const stem = `Statement: ${text(question.statement)}\nArguments:\nI. ${nextArguments[0]}\nII. ${nextArguments[1]}`;

  return Object.freeze({
    ...question,
    arguments: nextArguments,
    explanation: patch.explanation,
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
