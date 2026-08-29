import { STA_V41_CONTEXTS, type StaV41Context } from "./exam-realness-v4-1-contexts.ts";
import { STA_V41_SCENARIOS } from "./exam-realness-v4-1-authorities.ts";
import {
  assertStaV4QuestionIntegrity,
  generateStaV4Question as generateStaV41EditorialQuestion,
  STA_V41_EDITORIAL_SURFACE_AUTHORITY,
  STA_V4_CHECKPOINT_BY_QL,
  STA_V4_DIFFICULTIES,
  STA_V4_LANGUAGES,
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_PROFILE_IDS,
  STA_V4_QL_IDS,
  STA_V4_SEMANTIC_AUTHORITY,
} from "./exam-realness-v4-1-editorial-runtime.ts";
import type {
  GenerateStaV4QuestionInput,
  StaV4Language,
  StaV4Question,
  StaV4QlId,
} from "./exam-realness-v4-1-types.ts";

export {
  assertStaV4QuestionIntegrity,
  STA_V41_EDITORIAL_SURFACE_AUTHORITY,
  STA_V4_CHECKPOINT_BY_QL,
  STA_V4_DIFFICULTIES,
  STA_V4_LANGUAGES,
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_PROFILE_IDS,
  STA_V4_QL_IDS,
  STA_V4_SEMANTIC_AUTHORITY,
};
export type {
  GenerateStaV4QuestionInput,
  StaV4CheckpointId,
  StaV4Difficulty,
  StaV4Language,
  StaV4Locale,
  StaV4ProfileId,
  StaV4QlId,
  StaV4Question,
} from "./exam-realness-v4-1-types.ts";

export const STA_V41_LEARNER_SURFACE_AUTHORITY = "STA-001-V4-1-LEARNER-R4" as const;

function contextForScenario(scenarioId: string): StaV41Context {
  const matches = STA_V41_CONTEXTS.filter((context) => scenarioId.endsWith(`-${context.id}`));
  if (matches.length !== 1) throw new Error(`${scenarioId}: unable to resolve exactly one V4.1 learner context`);
  return matches[0]!;
}

function candidateVariantIndex(question: StaV4Question, candidateId: string, text: string): 0 | 1 {
  const scenario = STA_V41_SCENARIOS.find((entry) => entry.scenarioId === question.scenarioId);
  const authority = scenario?.candidates.find((entry) => entry.candidateId === candidateId);
  if (!authority) throw new Error(`${question.questionId}: missing learner candidate authority ${candidateId}`);
  const index = authority.textVariants.findIndex((entry) => entry.en === text);
  if (index < 0 || index > 1) throw new Error(`${question.questionId}: English learner candidate wording authority drift ${candidateId}`);
  return index as 0 | 1;
}

function statementVariantIndex(question: StaV4Question): 0 | 1 | 2 {
  if (question.qlId === "STA-QL-006") {
    if (question.statement.startsWith("A review of ")) return 0;
    if (question.statement.startsWith("Based on ")) return 1;
    if (question.statement.startsWith("From a review of ")) return 2;
    throw new Error(`${question.questionId}: unable to recover QL-006 English statement variant`);
  }
  const scenario = STA_V41_SCENARIOS.find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing learner scenario authority`);
  const index = scenario.statementVariants.findIndex((entry) => entry.en === question.statement);
  if (index < 0 || index > 2) throw new Error(`${question.questionId}: English learner statement wording authority drift`);
  return index as 0 | 1 | 2;
}

function candidateNumber(candidateId: string): number {
  const value = Number(/-C(\d+)$/u.exec(candidateId)?.[1]);
  if (!Number.isInteger(value) || value < 1 || value > 7) throw new Error(`${candidateId}: invalid learner candidate number`);
  return value;
}

const pick = (variant: 0 | 1, first: string, second: string): string => variant === 0 ? first : second;

export function renderStaV41LearnerEnglishStatement(qlId: StaV4QlId, index: 0 | 1 | 2, c: StaV41Context): string {
  const actor = c.actor.en;
  const task = c.task.en;
  const channel = c.channel.en;
  const issue = c.issue.en;
  const intervention = c.intervention.en;
  const outcome = c.outcome.en;
  const audience = c.audience.en;
  const metric = c.metric.en;

  if (qlId === "STA-QL-001") {
    if (index === 0) return `For ${task}, use ${channel}.`;
    if (index === 1) return `The intended users (${actor}) are directed to complete ${task} through ${channel}.`;
    return `For ${task}, the stated service route is ${channel}.`;
  }
  if (qlId === "STA-QL-002") {
    if (index === 0) return `To address ${issue}, the service should introduce ${intervention}.`;
    if (index === 1) return `The administration recommends ${intervention} as a response to ${issue}.`;
    return `The service proposes ${intervention} to achieve ${outcome}.`;
  }
  if (qlId === "STA-QL-003") {
    if (index === 0) return `Notice: ${audience} should use ${channel} for ${task}.`;
    if (index === 1) return `The service directs ${audience} to use ${channel} for ${task}.`;
    return `An official notice designates ${channel} for ${task}.`;
  }
  if (qlId === "STA-QL-004") {
    if (index === 0) return `The service expects ${outcome} after introducing ${intervention} to address ${issue}.`;
    if (index === 1) return `After adopting ${intervention}, the service expects ${outcome}.`;
    return `The service attributes the expected result—${outcome}—to ${intervention}.`;
  }
  if (qlId === "STA-QL-005") {
    if (index === 0) return `Message to ${audience}: use ${channel} for ${task} to gain ${outcome}.`;
    if (index === 1) return `A promotional appeal presents ${channel} as a way for ${audience} to achieve ${outcome}.`;
    return `The service promotes ${channel} by highlighting ${outcome}.`;
  }
  if (index === 0) return `A review of ${audience} recorded a better result on ${metric} with ${intervention} than with the current arrangement; the service concludes that the intervention is more effective.`;
  if (index === 1) return `Based on ${metric} observed among ${audience}, the administration rates ${intervention} above the existing process.`;
  return `From a review of ${audience}, the service concludes that using ${intervention} produces a stronger result on ${metric}.`;
}

export function renderStaV41LearnerEnglishCandidate(qlId: StaV4QlId, n: number, v: 0 | 1, c: StaV41Context): string {
  const actor = c.actor.en;
  const task = c.task.en;
  const channel = c.channel.en;
  const issue = c.issue.en;
  const intervention = c.intervention.en;
  const outcome = c.outcome.en;
  const audience = c.audience.en;
  const metric = c.metric.en;

  if (qlId === "STA-QL-001") {
    if (n === 1) return pick(v, `It is possible to use ${channel} to complete ${task}.`, `It is possible to complete ${task} through ${channel}.`);
    if (n === 2) return pick(v, `The intended users (${actor}) have practical access to ${channel}.`, `Practical access to ${channel} is available to the intended users (${actor}).`);
    if (n === 3) return pick(v, `Access through ${channel} remains available during the relevant service period.`, `Access to ${channel} is available during the relevant service period.`);
    if (n === 4) return pick(v, `Using ${channel} is more convenient than the previous method.`, `The previous method is less convenient than using ${channel}.`);
    if (n === 5) return pick(v, `Users generally prefer ${channel} for ${task}.`, `Use of ${channel} is popular for ${task}.`);
    if (n === 6) return pick(v, `Weak staff training is the principal cause of ${issue}.`, `Weak staff training contributes substantially to ${issue}.`);
    return pick(v, `The service introduced ${channel} recently.`, `Access through ${channel} was added recently.`);
  }

  if (qlId === "STA-QL-002") {
    if (n === 1) return pick(v, `There is an operational reason to address ${issue}.`, `The service has a meaningful reason to address ${issue}.`);
    if (n === 2) return pick(v, `The service can implement ${intervention} in practice.`, `There is a workable way to implement ${intervention}.`);
    if (n === 3) return pick(v, `There is a credible link between ${intervention} and ${outcome}.`, `Achieving ${outcome} is reasonably connected with implementing ${intervention}.`);
    if (n === 4) return pick(v, `Implementing ${intervention} would cost less than the current process.`, `The current process would cost more than implementing ${intervention}.`);
    if (n === 5) return pick(v, `The operating team already favours ${intervention}.`, `The operating team already shows strong support for ${intervention}.`);
    if (n === 6) return pick(v, `Weak supervision is the principal cause of ${issue}.`, `Weak supervision contributes substantially to ${issue}.`);
    return pick(v, `A neighbouring office uses an intervention similar to ${intervention}.`, `A comparable institution has adopted an intervention similar to ${intervention}.`);
  }

  if (qlId === "STA-QL-003") {
    if (n === 1) return pick(v, `It is possible to submit requests for ${task} through ${channel}.`, `Requests for ${task} are processed through ${channel}.`);
    if (n === 2) return pick(v, `The intended audience (${audience}) has practical access to ${channel}.`, `The intended audience (${audience}) can practically access ${channel}.`);
    if (n === 3) return pick(v, `Using ${channel} serves the administrative purpose of the notice.`, `Using ${channel} is relevant to the purpose of the service direction.`);
    if (n === 4) return pick(v, `Use of ${channel} is more common than direct service.`, `Users prefer ${channel} to visiting the office directly.`);
    if (n === 5) return pick(v, `The notice followed a recent complaint.`, `A complaint prompted the administration to issue the notice.`);
    if (n === 6) return pick(v, `Staff expect unusually high demand in the next period.`, `The service expects unusually high demand in the next period.`);
    return pick(v, `The previous process was poorly designed.`, `The former service route was poorly designed.`);
  }

  if (qlId === "STA-QL-004") {
    if (n === 1) return pick(v, `Using ${intervention} addresses a factor connected with ${issue}.`, `There is a relevant causal pathway from ${intervention} to ${issue}.`);
    if (n === 2) return pick(v, `The expected effect of ${intervention} is relevant to ${outcome}.`, `The mechanism of ${intervention} can plausibly influence ${outcome}.`);
    if (n === 3) return pick(v, `The current situation leaves room for improvement toward ${outcome}.`, `The baseline permits a meaningful change toward ${outcome}.`);
    if (n === 4) return pick(v, `The rate of improvement will be identical at every location.`, `Every location will show the same magnitude of improvement.`);
    if (n === 5) return pick(v, `Staff attitudes are the principal cause of ${issue}.`, `Staff attitudes contribute substantially to ${issue}.`);
    if (n === 6) return pick(v, `Implementing ${intervention} would cost less than the current arrangement.`, `The current arrangement would cost more than implementing ${intervention}.`);
    return pick(v, `The team that designed ${intervention} selected the metric.`, `The metric was selected by the team that designed ${intervention}.`);
  }

  if (qlId === "STA-QL-005") {
    if (n === 1) return pick(v, `The intended audience considers the highlighted benefit—${outcome}—important.`, `The benefit of ${outcome} is relevant to the intended audience (${audience}).`);
    if (n === 2) return pick(v, `The intended audience (${audience}) has a practical way to respond to the message.`, `The action promoted in the message is practically available to the intended audience (${audience}).`);
    if (n === 3) return pick(v, `There is a credible link between using ${channel} and achieving ${outcome}.`, `Using ${channel} is reasonably connected with producing ${outcome}.`);
    if (n === 4) return pick(v, `The intended audience already prefers this service provider.`, `The service provider already enjoys strong preference among the intended audience.`);
    if (n === 5) return pick(v, `Competing services perform worse on the same task.`, `Alternative providers deliver weaker results for ${task}.`);
    if (n === 6) return pick(v, `The advertisement itself proves the quality of the service.`, `Publishing the message establishes the quality claim as a fact.`);
    return pick(v, `The campaign budget is larger than last year's budget.`, `This campaign received a larger budget than the previous campaign.`);
  }

  if (n === 1) return pick(v, `The chosen performance evidence—${metric}—is relevant to the effectiveness being judged.`, `The chosen measure captures a meaningful part of the claimed performance.`);
  if (n === 2) return pick(v, `The compared cases were assessed under sufficiently comparable conditions.`, `The comparison does not rely on materially different testing conditions.`);
  if (n === 3) return pick(v, `The reviewed group (${audience}) provides evidence appropriate to the scope of the claim.`, `The reviewed group is relevant to the population covered by the conclusion.`);
  if (n === 4) return pick(v, `The use of ${intervention} was introduced more recently than the current arrangement.`, `The current arrangement predates the use of ${intervention}.`);
  if (n === 5) return pick(v, `The team favouring ${intervention} selected the metric.`, `Supporters of ${intervention} chose the performance measure.`);
  if (n === 6) return pick(v, `The current arrangement has a weaker public reputation.`, `Users hold a less favourable view of the current arrangement.`);
  return pick(v, `The group using ${intervention} received a larger operating budget.`, `More operating funds were allocated to the group using ${intervention}.`);
}

function polishHindiLearnerText(text: string): string {
  const rules: readonly [RegExp, string][] = [
    [/^कार्य (“[^”]+”) के लिए निर्धारित सेवा माध्यम (“[^”]+”) है।$/u, "$1 के लिए $2 निर्धारित माध्यम है।"],
    [/^कार्य (“[^”]+”) के लिए सेवा माध्यम (“[^”]+”) का उपयोग करें।$/u, "$1 के लिए $2 का उपयोग करें।"],
    [/^लक्षित उपयोगकर्ता (“[^”]+”) को कार्य (“[^”]+”) सेवा माध्यम (“[^”]+”) के जरिए पूरा करने का निर्देश है।$/u, "$1 को $2 $3 के जरिए पूरा करने का निर्देश है।"],
    [/^सेवा माध्यम (“[^”]+”) कार्य (“[^”]+”) पूरा करने में सक्षम है।$/u, "$1 के जरिए $2 पूरा करना संभव है।"],
    [/^कार्य (“[^”]+”) सेवा माध्यम (“[^”]+”) के जरिए पूरा किया जा सकता है।$/u, "$2 के जरिए $1 पूरा करना संभव है।"],
    [/^हस्तक्षेप (“[^”]+”) इस व्यवस्था में व्यावहारिक रूप से लागू किया जा सकता है।$/u, "$1 को इस व्यवस्था में व्यावहारिक रूप से लागू करना संभव है।"],
    [/^सूचना: लक्षित समूह (“[^”]+”) कार्य (“[^”]+”) के लिए माध्यम (“[^”]+”) का उपयोग करे।$/u, "सूचना: $1 $2 के लिए $3 का उपयोग करें।"],
    [/^सेवा लक्षित समूह (“[^”]+”) को कार्य (“[^”]+”) माध्यम (“[^”]+”) के जरिए करने का निर्देश देती है।$/u, "सेवा $1 को $2 $3 के जरिए करने का निर्देश देती है।"],
    [/^आधिकारिक सूचना में कार्य (“[^”]+”) के लिए माध्यम (“[^”]+”) निर्धारित है।$/u, "आधिकारिक सूचना में $1 के लिए $2 निर्धारित है।"],
    [/^कार्य (“[^”]+”) का प्रसंस्करण माध्यम (“[^”]+”) के जरिए होता है।$/u, "$1 का प्रसंस्करण $2 के जरिए होता है।"],
    [/^लक्षित समूह (“[^”]+”) के लिए संदेश: कार्य (“[^”]+”) हेतु माध्यम (“[^”]+”) का उपयोग करें और लाभ (“[^”]+”) प्राप्त करें।$/u, "$1 के लिए संदेश: $2 के लिए $3 का उपयोग करें और $4 हासिल करें।"],
    [/^प्रचार संदेश लक्षित समूह (“[^”]+”) के लिए माध्यम (“[^”]+”) को लाभ (“[^”]+”) पाने का रास्ता बताता है।$/u, "प्रचार संदेश $1 को $2 के जरिए $3 पाने का रास्ता बताता है।"],
    [/^सेवा लाभ (“[^”]+”) को प्रमुखता देकर माध्यम (“[^”]+”) का प्रचार करती है।$/u, "सेवा $1 को प्रमुखता देकर $2 का प्रचार करती है।"],
    [/^लक्षित समूह (“[^”]+”) में देखे गए प्रदर्शन माप (“[^”]+”) के आधार पर प्रशासन हस्तक्षेप (“[^”]+”) को मौजूदा प्रक्रिया से बेहतर मानता है।$/u, "$1 के बीच दर्ज $2 के आधार पर प्रशासन $3 को मौजूदा प्रक्रिया से बेहतर मानता है।"],
    [/^लक्षित समूह (“[^”]+”) की समीक्षा में हस्तक्षेप (“[^”]+”) के साथ प्रदर्शन माप (“[^”]+”) का परिणाम मौजूदा व्यवस्था से बेहतर रहा; सेवा हस्तक्षेप को अधिक प्रभावी मानती है।$/u, "$1 की समीक्षा में $2 के साथ $3 का परिणाम मौजूदा व्यवस्था से बेहतर रहा; सेवा इस उपाय को अधिक प्रभावी मानती है।"],
    [/^लक्षित समूह (“[^”]+”) की समीक्षा से सेवा निष्कर्ष निकालती है कि हस्तक्षेप (“[^”]+”) का उपयोग प्रदर्शन माप (“[^”]+”) पर बेहतर परिणाम देता है।$/u, "$1 की समीक्षा से सेवा निष्कर्ष निकालती है कि $2 का उपयोग $3 पर बेहतर परिणाम देता है।"],
  ];
  let output = text;
  for (const [pattern, replacement] of rules) output = output.replace(pattern, replacement);
  output = output
    .replace(/लक्षित समूह (?=“)/gu, "")
    .replace(/लक्षित उपयोगकर्ता (?=“)/gu, "")
    .replace(/सेवा माध्यम (?=“)/gu, "माध्यम ")
    .replace(/हस्तक्षेप (?=“)/gu, "")
    .replace(/प्रदर्शन माप (?=“)/gu, "")
    .replace(/समस्या (?=“)/gu, "")
    .replace(/परिणाम (?=“)/gu, "")
    .replace(/लाभ (?=“)/gu, "")
    .replace(/हस्तक्षेप/gu, "उपाय")
    .replace(/लक्षित समूह/gu, "संबंधित लोगों")
    .replace(/सेवा माध्यम/gu, "माध्यम")
    .replace(/प्रदर्शन माप/gu, "मापदंड");
  return output;
}

function polishPunjabiLearnerText(text: string): string {
  const rules: readonly [RegExp, string][] = [
    [/^ਕੰਮ (“[^”]+”) ਲਈ ਨਿਰਧਾਰਤ ਸੇਵਾ ਮਾਧਿਅਮ (“[^”]+”) ਹੈ।$/u, "$1 ਲਈ $2 ਨਿਰਧਾਰਤ ਮਾਧਿਅਮ ਹੈ।"],
    [/^ਕੰਮ (“[^”]+”) ਲਈ ਸੇਵਾ ਮਾਧਿਅਮ (“[^”]+”) ਦੀ ਵਰਤੋਂ ਕਰੋ।$/u, "$1 ਲਈ $2 ਦੀ ਵਰਤੋਂ ਕਰੋ।"],
    [/^ਲਕਸ਼ਿਤ ਵਰਤੋਂਕਾਰ (“[^”]+”) ਨੂੰ ਕੰਮ (“[^”]+”) ਸੇਵਾ ਮਾਧਿਅਮ (“[^”]+”) ਰਾਹੀਂ ਪੂਰਾ ਕਰਨ ਦੀ ਹਦਾਇਤ ਹੈ।$/u, "$1 ਨੂੰ $2 $3 ਰਾਹੀਂ ਪੂਰਾ ਕਰਨ ਦੀ ਹਦਾਇਤ ਹੈ।"],
    [/^ਸੇਵਾ ਮਾਧਿਅਮ (“[^”]+”) ਕੰਮ (“[^”]+”) ਪੂਰਾ ਕਰਨ ਦੇ ਯੋਗ ਹੈ।$/u, "$1 ਰਾਹੀਂ $2 ਪੂਰਾ ਕਰਨਾ ਸੰਭਵ ਹੈ।"],
    [/^ਕੰਮ (“[^”]+”) ਸੇਵਾ ਮਾਧਿਅਮ (“[^”]+”) ਰਾਹੀਂ ਪੂਰਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।$/u, "$2 ਰਾਹੀਂ $1 ਪੂਰਾ ਕਰਨਾ ਸੰਭਵ ਹੈ।"],
    [/^ਦਖ਼ਲ (“[^”]+”) ਇਸ ਪ੍ਰਬੰਧ ਵਿੱਚ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਲਾਗੂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।$/u, "$1 ਨੂੰ ਇਸ ਪ੍ਰਬੰਧ ਵਿੱਚ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਲਾਗੂ ਕਰਨਾ ਸੰਭਵ ਹੈ।"],
    [/^ਸੂਚਨਾ: ਲਕਸ਼ਿਤ ਸਮੂਹ (“[^”]+”) ਕੰਮ (“[^”]+”) ਲਈ ਮਾਧਿਅਮ (“[^”]+”) ਦੀ ਵਰਤੋਂ ਕਰੇ।$/u, "ਸੂਚਨਾ: $1 $2 ਲਈ $3 ਦੀ ਵਰਤੋਂ ਕਰਨ।"],
    [/^ਸੇਵਾ ਲਕਸ਼ਿਤ ਸਮੂਹ (“[^”]+”) ਨੂੰ ਕੰਮ (“[^”]+”) ਮਾਧਿਅਮ (“[^”]+”) ਰਾਹੀਂ ਕਰਨ ਦੀ ਹਦਾਇਤ ਦਿੰਦੀ ਹੈ।$/u, "ਸੇਵਾ $1 ਨੂੰ $2 $3 ਰਾਹੀਂ ਕਰਨ ਦੀ ਹਦਾਇਤ ਦਿੰਦੀ ਹੈ।"],
    [/^ਅਧਿਕਾਰਕ ਸੂਚਨਾ ਵਿੱਚ ਕੰਮ (“[^”]+”) ਲਈ ਮਾਧਿਅਮ (“[^”]+”) ਨਿਰਧਾਰਤ ਹੈ।$/u, "ਅਧਿਕਾਰਕ ਸੂਚਨਾ ਵਿੱਚ $1 ਲਈ $2 ਨਿਰਧਾਰਤ ਹੈ।"],
    [/^ਕੰਮ (“[^”]+”) ਦੀ ਕਾਰਵਾਈ ਮਾਧਿਅਮ (“[^”]+”) ਰਾਹੀਂ ਹੁੰਦੀ ਹੈ।$/u, "$1 ਦੀ ਕਾਰਵਾਈ $2 ਰਾਹੀਂ ਹੁੰਦੀ ਹੈ।"],
    [/^ਲਕਸ਼ਿਤ ਸਮੂਹ (“[^”]+”) ਲਈ ਸੁਨੇਹਾ: ਕੰਮ (“[^”]+”) ਵਾਸਤੇ ਮਾਧਿਅਮ (“[^”]+”) ਦੀ ਵਰਤੋਂ ਕਰੋ ਅਤੇ ਲਾਭ (“[^”]+”) ਪ੍ਰਾਪਤ ਕਰੋ।$/u, "$1 ਲਈ ਸੁਨੇਹਾ: $2 ਲਈ $3 ਦੀ ਵਰਤੋਂ ਕਰੋ ਅਤੇ $4 ਹਾਸਲ ਕਰੋ।"],
    [/^ਪ੍ਰਚਾਰ ਸੁਨੇਹਾ ਲਕਸ਼ਿਤ ਸਮੂਹ (“[^”]+”) ਲਈ ਮਾਧਿਅਮ (“[^”]+”) ਨੂੰ ਲਾਭ (“[^”]+”) ਪਾਉਣ ਦਾ ਰਸਤਾ ਦੱਸਦਾ ਹੈ।$/u, "ਪ੍ਰਚਾਰ ਸੁਨੇਹਾ $1 ਨੂੰ $2 ਰਾਹੀਂ $3 ਪਾਉਣ ਦਾ ਰਸਤਾ ਦੱਸਦਾ ਹੈ।"],
    [/^ਸੇਵਾ ਲਾਭ (“[^”]+”) ਨੂੰ ਉਭਾਰ ਕੇ ਮਾਧਿਅਮ (“[^”]+”) ਦਾ ਪ੍ਰਚਾਰ ਕਰਦੀ ਹੈ।$/u, "ਸੇਵਾ $1 ਨੂੰ ਉਭਾਰ ਕੇ $2 ਦਾ ਪ੍ਰਚਾਰ ਕਰਦੀ ਹੈ।"],
    [/^ਲਕਸ਼ਿਤ ਸਮੂਹ (“[^”]+”) ਵਿੱਚ ਦੇਖੇ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ (“[^”]+”) ਦੇ ਆਧਾਰ ਤੇ ਪ੍ਰਸ਼ਾਸਨ ਦਖ਼ਲ (“[^”]+”) ਨੂੰ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਨਾਲੋਂ ਬਿਹਤਰ ਮੰਨਦਾ ਹੈ।$/u, "$1 ਵਿੱਚ ਦਰਜ $2 ਦੇ ਆਧਾਰ ਤੇ ਪ੍ਰਸ਼ਾਸਨ $3 ਨੂੰ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਨਾਲੋਂ ਬਿਹਤਰ ਮੰਨਦਾ ਹੈ।"],
    [/^ਲਕਸ਼ਿਤ ਸਮੂਹ (“[^”]+”) ਦੀ ਸਮੀਖਿਆ ਵਿੱਚ ਦਖ਼ਲ (“[^”]+”) ਨਾਲ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ (“[^”]+”) ਦਾ ਨਤੀਜਾ ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਨਾਲੋਂ ਬਿਹਤਰ ਰਿਹਾ; ਸੇਵਾ ਦਖ਼ਲ ਨੂੰ ਵਧੇਰੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਮੰਨਦੀ ਹੈ।$/u, "$1 ਦੀ ਸਮੀਖਿਆ ਵਿੱਚ $2 ਨਾਲ $3 ਦਾ ਨਤੀਜਾ ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਨਾਲੋਂ ਬਿਹਤਰ ਰਿਹਾ; ਸੇਵਾ ਇਸ ਉਪਾਅ ਨੂੰ ਵਧੇਰੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਮੰਨਦੀ ਹੈ।"],
    [/^ਲਕਸ਼ਿਤ ਸਮੂਹ (“[^”]+”) ਦੀ ਸਮੀਖਿਆ ਤੋਂ ਸੇਵਾ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਕਿ ਦਖ਼ਲ (“[^”]+”) ਦੀ ਵਰਤੋਂ ਨਾਲ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ (“[^”]+”) ਉੱਤੇ ਬਿਹਤਰ ਨਤੀਜਾ ਮਿਲਦਾ ਹੈ।$/u, "$1 ਦੀ ਸਮੀਖਿਆ ਤੋਂ ਸੇਵਾ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਕਿ $2 ਦੀ ਵਰਤੋਂ ਨਾਲ $3 ਉੱਤੇ ਬਿਹਤਰ ਨਤੀਜਾ ਮਿਲਦਾ ਹੈ।"],
  ];
  let output = text;
  for (const [pattern, replacement] of rules) output = output.replace(pattern, replacement);
  output = output
    .replace(/ਲਕਸ਼ਿਤ ਸਮੂਹ (?=“)/gu, "")
    .replace(/ਲਕਸ਼ਿਤ ਵਰਤੋਂਕਾਰ (?=“)/gu, "")
    .replace(/ਸੇਵਾ ਮਾਧਿਅਮ (?=“)/gu, "ਮਾਧਿਅਮ ")
    .replace(/ਦਖ਼ਲ (?=“)/gu, "")
    .replace(/ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ (?=“)/gu, "")
    .replace(/ਸਮੱਸਿਆ (?=“)/gu, "")
    .replace(/ਨਤੀਜਾ (?=“)/gu, "")
    .replace(/ਲਾਭ (?=“)/gu, "")
    .replace(/ਦਖ਼ਲ/gu, "ਉਪਾਅ")
    .replace(/ਲਕਸ਼ਿਤ ਸਮੂਹ/gu, "ਸੰਬੰਧਿਤ ਲੋਕਾਂ")
    .replace(/ਸੇਵਾ ਮਾਧਿਅਮ/gu, "ਮਾਧਿਅਮ")
    .replace(/ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ/gu, "ਮਾਪਦੰਡ");
  return output;
}

function polishLocalizedLearnerText(text: string, language: StaV4Language): string {
  if (language === "hi") return polishHindiLearnerText(text);
  if (language === "pa") return polishPunjabiLearnerText(text);
  return text;
}

export function generateStaV4Question(input: GenerateStaV4QuestionInput): StaV4Question {
  const editorial = generateStaV41EditorialQuestion(input);

  if (editorial.language !== "en") {
    const candidates = editorial.candidates.map((candidate) => Object.freeze({
      ...candidate,
      text: polishLocalizedLearnerText(candidate.text, editorial.language),
    }));
    const question = Object.freeze({
      ...editorial,
      statement: polishLocalizedLearnerText(editorial.statement, editorial.language),
      candidates: Object.freeze(candidates),
      explanation: polishLocalizedLearnerText(editorial.explanation, editorial.language),
    }) as StaV4Question;
    assertStaV4QuestionIntegrity(question);
    return question;
  }

  const context = contextForScenario(editorial.scenarioId);
  const statementVariant = statementVariantIndex(editorial);

  const candidates = editorial.candidates.map((candidate) => Object.freeze({
    ...candidate,
    text: renderStaV41LearnerEnglishCandidate(
      editorial.qlId,
      candidateNumber(candidate.candidateId),
      candidateVariantIndex(editorial, candidate.candidateId, candidate.text),
      context,
    ),
  }));

  const question = Object.freeze({
    ...editorial,
    statement: renderStaV41LearnerEnglishStatement(editorial.qlId, statementVariant, context),
    candidates: Object.freeze(candidates),
  }) as StaV4Question;
  assertStaV4QuestionIntegrity(question);
  return question;
}
