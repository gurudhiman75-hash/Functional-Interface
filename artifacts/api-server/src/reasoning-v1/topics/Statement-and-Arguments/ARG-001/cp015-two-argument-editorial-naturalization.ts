import { createHash } from "node:crypto";

export const ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY = "ARG_CP015_TWO_ARGUMENT_EDITORIAL_NATURALIZATION_V2" as const;

type Question = Readonly<Record<string, any>>;
type Strength = "STRONG" | "WEAK";

type EditorialPatch = Readonly<{
  statement?: string;
  arguments?: readonly string[];
  reasons: readonly [string, string];
}>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sentenceCase(value: string): string {
  if (!value) return value;
  return `${value[0]!.toUpperCase()}${value.slice(1)}`;
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

function englishSurfaceRepair(value: string): string {
  return value
    .replace(/\bwhere there are ([^.,;?]*crowding[^.,;?]*)/gi, "where $1 is common")
    .replace(/\bevery form of ([A-Za-z-]+(?:\s+[A-Za-z-]+)*) queries\b/gi, "all $1 queries")
    .replace(/\breplace all human help\b/gi, "replace all staff-assisted support");
}

function hindiSurfaceRepair(value: string): string {
  return value
    .replace(/सेवाओं उपयोग करने/g, "सेवाओं का उपयोग करने")
    .replace(/नागरिकों हमेशा/g, "नागरिक हमेशा")
    .replace(/देर से पहुँचने वाले आवेदकों हमेशा/g, "देर से पहुँचने वाले आवेदक हमेशा")
    .replace(/हर प्रकार का अनजाने उल्लंघनों समाप्त होने की गारंटी/g, "हर प्रकार के अनजाने उल्लंघन समाप्त हो जाएँ, इसकी गारंटी")
    .replace(/डाक पता में/g, "डाक पते में")
    .replace(/हर प्रकार का ([^।,.!?]+?) प्रश्नों संभाल/g, "हर प्रकार के $1 प्रश्न संभाल")
    .replace(/चालू करना कर सकें/g, "चालू कर सकें")
    .replace(/चालू करना करने की सुविधा/g, "चालू करने की सुविधा")
    .replace(/लॉक लगाना कर सकें/g, "लॉक लगा सकें")
    .replace(/लॉक लगाना करने की सुविधा/g, "लॉक लगाने की सुविधा")
    .replace(/तैयारी करना कर सके/g, "तैयारी कर सके")
    .replace(/कब्जा करना कर सके/g, "कब्जा कर सके")
    .replace(/कब्जा करना के लिए/g, "कब्जा करने के लिए")
    .replace(/उच्च-मूल्य लाभार्थी बदलने/g, "उच्च-मूल्य लाभार्थी को बदलने")
    .replace(/हाईजैक किया ब्राउज़र सत्र/g, "हाईजैक किया गया ब्राउज़र सत्र")
    .replace(/ग्राहक के सहायता लेने तक/g, "ग्राहक द्वारा सहायता लेने तक")
    .replace(/को स्थायी हटाना करना ही चाहिए/g, "को स्थायी रूप से हटा देना चाहिए")
    .replace(/को स्थायी हटाना के/g, "को स्थायी रूप से हटाने के")
    .replace(/को स्थायी हटाना चाहिए/g, "को स्थायी रूप से हटा देना चाहिए")
    .replace(/को स्थायी प्रतिबंधित करना करना ही चाहिए/g, "को स्थायी रूप से प्रतिबंधित कर देना चाहिए")
    .replace(/को स्थायी प्रतिबंधित करना के/g, "को स्थायी रूप से प्रतिबंधित करने के")
    .replace(/को स्थायी प्रतिबंधित करना चाहिए/g, "को स्थायी रूप से प्रतिबंधित कर देना चाहिए")
    .replace(/(रिपोर्ट|शिकायत) केवल तभी हो सकता है/g, "$1 केवल तभी हो सकती है")
    .replace(/(रिपोर्ट|शिकायत) तभी हो सकता है/g, "$1 तभी हो सकती है")
    .replace(/क्रेडेंशियल समझौता के बाद/g, "क्रेडेंशियल से समझौते के बाद")
    .replace(/क्रेडेंशियल समझौता हुआ है/g, "क्रेडेंशियल से समझौता हो चुका है");
}

function punjabiSurfaceRepair(value: string): string {
  return value
    .replace(/ਤਿਆਰੀ ਕਰਨਾ ਕਰ ਸਕੇ/g, "ਤਿਆਰੀ ਕਰ ਸਕੇ")
    .replace(/ਤਿਆਰੀ ਕਰਨਾ ਲਈ/g, "ਤਿਆਰੀ ਕਰਨ ਲਈ")
    .replace(/ਫੈਸਲਾ ਕਰਨਾ ਕਰ ਸਕਦੇ ਹਨ/g, "ਫੈਸਲਾ ਕਰ ਸਕਦੇ ਹਨ")
    .replace(/ਹਰ ਕਿਸਮ ਦਾ ਖਾਤਾ ਸੇਵਾ ਸਵਾਲਾਂ ਸੰਭਾਲ/g, "ਹਰ ਕਿਸਮ ਦੇ ਖਾਤਾ-ਸੇਵਾ ਸਵਾਲ ਸੰਭਾਲ")
    .replace(/ਮੁਲਾਂਕਣ-ਮਾਰਗਦਰਸ਼ਨ ਨੋਟਸ([^।.!?]*?)ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ/g, "ਮੁਲਾਂਕਣ-ਮਾਰਗਦਰਸ਼ਨ ਨੋਟਸ$1ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ")
    .replace(/ਡਾਕ ਪਤਾ ਵਿੱਚ/g, "ਡਾਕ ਪਤੇ ਵਿੱਚ")
    .replace(/ਲਾਕ ਲਗਾਉਣਾ ਕਰਨ ਦੀ/g, "ਲਾਕ ਲਗਾਉਣ ਦੀ")
    .replace(/ਗਾਹਕ ਦੇ ਮਦਦ ਲੈਣ ਤੱਕ/g, "ਗਾਹਕ ਵੱਲੋਂ ਮਦਦ ਲੈਣ ਤੱਕ")
    .replace(/ਸਮਝੌਤਾ ਹੋਇਆ ਈਮੇਲ ਖਾਤਾ/g, "ਕੰਪ੍ਰੋਮਾਈਜ਼ ਹੋਇਆ ਈਮੇਲ ਖਾਤਾ")
    .replace(/ਅਟੱਲ ਤਰੀਕੇ ਨਾਲ ਸਸਪੈਂਡ/g, "ਪੱਕੇ ਤੌਰ 'ਤੇ ਸਸਪੈਂਡ")
    .replace(/ਇੱਕ ਦੁਰਵਿਹਾਰ ਦੋਸ਼/g, "ਦੁਰਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼")
    .replace(/ਦੁਰਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਸਿਰਫ਼ ਉਸ ਵੇਲੇ ਹੋ ਸਕਦੀ ਹੈ/g, "ਦੁਰਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਸਿਰਫ਼ ਉਸ ਵੇਲੇ ਲੱਗ ਸਕਦਾ ਹੈ")
    .replace(/ਸਸਪੈਂਡ ਕਰਨਾ ਕਰਨਾ ਹੀ ਚਾਹੀਦਾ ਹੈ/g, "ਸਸਪੈਂਡ ਕਰ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਸਸਪੈਂਡ ਕਰਨਾ ਦੇ ਅਟੱਲ ਕਦਮ/g, "ਸਸਪੈਂਡ ਕਰਨ ਦੇ ਅਟੱਲ ਕਦਮ")
    .replace(/ਜਾਣੇ ਹੋਏ ਡਿਲੀਵਰੀ ਫੀਸ/g, "ਜਾਣੀ ਹੋਈ ਡਿਲੀਵਰੀ ਫੀਸ")
    .replace(/ਉਸ ਰਕਮ ਦੇ ਆਧਾਰ ਤੇ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ ਖਰੀਦ ਫੈਸਲਾ/g, "ਉਸ ਰਕਮ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਜਾਣਕਾਰੀ-ਅਧਾਰਿਤ ਖਰੀਦ ਦਾ ਫੈਸਲਾ");
}

function localizedSurfaceRepair(value: string, question: Question): string {
  if (question.locale === "hi-IN" || question.language === "hi") return hindiSurfaceRepair(value);
  if (question.locale === "pa-IN" || question.language === "pa") return punjabiSurfaceRepair(value);
  return englishSurfaceRepair(value);
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
    `No. ${sentenceCase(contact)} should be left off ${document} simply because ${document} are not meant to carry that contact detail.`,
    `Yes. Once ${contact} is printed on ${document}, all ${issue} raised during ${purpose} will be resolved immediately.`,
  ]);
  return Object.freeze({
    arguments: args,
    reasons: [
      `It gives no practical drawback of printing ${contact}; it merely restates that ${document} are not meant to contain it.`,
      `${sentenceCase(contact)} can make ${purpose} easier, but a contact route cannot guarantee immediate resolution of all ${issue}.`,
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

function queueCapacityPatch(question: Question): EditorialPatch | undefined {
  const statement = englishSurfaceRepair(text(question.statement));
  const args = (question.arguments as readonly string[]).map((argument) => englishSurfaceRepair(text(argument))) as [string, string];
  if (args.length !== 2 || !/^Should .+ introduce .+ for .+ where .+\?$/i.test(statement)) return undefined;
  const reasons = args.map((argument) => /desktop computer/i.test(argument)
    ? "It invents a desktop-computer requirement that is not inherent to appointment or queue-booking access, so it does not show that the proposal is unworkable."
    : "It gives a practical mechanism for spreading arrivals and reducing the stated crowding pressure, directly addressing the service bottleneck in the statement.") as [string, string];
  return Object.freeze({ statement, arguments: Object.freeze(args), reasons });
}

function automationReplacementPatch(question: Question): EditorialPatch | undefined {
  const statement = englishSurfaceRepair(text(question.statement));
  const args = question.arguments as readonly string[];
  const match = statement.match(/^Should every (.+) replace all staff-assisted support for (.+) with (.+?) (within one week|without a transition period|with immediate effect|immediately)\?$/i);
  if (!match?.[1] || !match[2] || !match[3] || !match[4] || args.length !== 2) return undefined;
  const unit = match[1];
  const service = match[2];
  const automation = match[3];
  const timing = match[4];
  const fallback = args
    .map((argument) => argument.match(/(?:even when|without) (.+?)(?: is available|, so)/i)?.[1])
    .find(Boolean) ?? "fallback support";
  const nextArguments = args.map((argument) => /never provide any useful service/i.test(argument)
    ? `No. A ${unit} using ${automation} for ${service} can never provide any useful service, even when ${fallback} is available.`
    : `Yes. ${automation} can handle every case involving ${service} without ${fallback}, so replacing all staff-assisted support ${timing} would involve no implementation risk.`) as [string, string];
  const reasons = nextArguments.map((argument) => /never provide any useful service/i.test(argument)
    ? `It makes an unsupported all-or-nothing claim: using ${automation} does not mean a ${unit} can never deliver any useful service in handling ${service}.`
    : `It assumes ${automation} can handle every case without ${fallback} and ignores predictable exceptions, maintenance and support needs during a full replacement ${timing}.`) as [string, string];
  return Object.freeze({ statement, arguments: Object.freeze(nextArguments), reasons });
}

function interimSafeguardPatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = question.arguments as readonly string[];
  const match = statement.match(/^Should (.+) immediately permanently (.+) after (.+)\?$/i);
  if (!match?.[1] || !match[2] || !match[3] || args.length !== 2) return undefined;
  const actor = match[1];
  const action = match[2];
  const trigger = match[3];
  const naturalStatement = `Should ${actor} permanently ${action} immediately after ${trigger}?`;
  const reasons = args.map((argument) => /guilt is certain/i.test(argument)
    ? `It treats ${trigger} as if it were already proof of guilt and ignores proportionate intermediate safeguards.`
    : `Temporary protective action plus fact-checking lets ${actor} manage risk without irreversibly deciding to ${action} before ${trigger} is verified.`) as [string, string];
  return Object.freeze({ statement: naturalStatement, reasons });
}

function proportionalResponsePatch(question: Question): EditorialPatch | undefined {
  const statement = text(question.statement);
  const args = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  const match = statement.match(/^Should (.+) automatically (.+) whenever (?:it|they) receive(?:s)? ((?:a|an) .+?) about (.+)\?$/i);
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
    case "QUEUE_CAPACITY_IMPLEMENTATION": return queueCapacityPatch(question);
    case "AUTOMATION_REPLACEMENT_FEASIBILITY": return automationReplacementPatch(question);
    case "INTERIM_SAFEGUARD_DUE_PROCESS": return interimSafeguardPatch(question);
    case "PROPORTIONAL_RESPONSE_FALSE_DILEMMA": return proportionalResponsePatch(question);
    default: return undefined;
  }
}

function stemFor(question: Question, statement: string, argumentsList: readonly string[]): string {
  if (question.locale === "hi-IN" || question.language === "hi") {
    return `कथन: ${statement}\nतर्क:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
  }
  if (question.locale === "pa-IN" || question.language === "pa") {
    return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
  }
  return `Statement: ${statement}\nArguments:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
}

export function naturalizeArgCp015TwoArgumentEditorial(question: Question): Question {
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (argumentsList.length !== 2) return question;

  const isEnglish = question.locale === "en-IN" || question.language === "en";
  const strengths = displayedStrengths(question);
  const patch = isEnglish && strengths ? patchFor(question) : undefined;
  const sourceStatement = patch?.statement ?? text(question.statement);
  const sourceArguments = Object.freeze([...(patch?.arguments ?? argumentsList)]);
  const sourceExplanation = patch && strengths
    ? explanationFromDisplayedOrder(strengths, patch.reasons)
    : text(question.explanation);

  const statement = localizedSurfaceRepair(sourceStatement, question);
  const nextArguments = Object.freeze(sourceArguments.map((argument) => localizedSurfaceRepair(text(argument), question)));
  const explanation = localizedSurfaceRepair(sourceExplanation, question);
  const changed = Boolean(patch)
    || statement !== text(question.statement)
    || nextArguments.some((argument, index) => argument !== text(argumentsList[index]))
    || explanation !== text(question.explanation);
  if (!changed) return question;

  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY,
    question.qlId,
    question.templateId,
    statement,
    nextArguments,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");
  const stem = stemFor(question, statement, nextArguments);

  return Object.freeze({
    ...question,
    statement,
    arguments: nextArguments,
    explanation,
    stem,
    text: stem,
    sourceExplanation: question.sourceExplanation ?? question.explanation,
    twoArgumentEditorialAuthority: ARG_CP015_TWO_ARGUMENT_EDITORIAL_AUTHORITY,
    twoArgumentEditorialArchetype: question.archetype,
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:EDITORIAL`,
    diversitySourceMode: "CP014_APPROVED_SEMANTICS_WITH_CP015_QUESTION_SPECIFIC_EDITORIAL_SURFACE" as const,
  });
}
