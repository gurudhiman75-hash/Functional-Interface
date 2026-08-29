import { STA_V41_CONTEXTS, type StaV41Context } from "./exam-realness-v4-1-contexts.ts";
import { STA_V41_SCENARIOS } from "./exam-realness-v4-1-authorities.ts";
import {
  assertStaV4QuestionIntegrity,
  generateStaV4Question as generateStaV4SemanticQuestion,
  STA_V4_CHECKPOINT_BY_QL,
  STA_V4_DIFFICULTIES,
  STA_V4_LANGUAGES,
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_PROFILE_IDS,
  STA_V4_QL_IDS,
  STA_V4_SEMANTIC_AUTHORITY,
} from "./exam-realness-v4-1-runtime.ts";
import type {
  GenerateStaV4QuestionInput,
  StaV4Language,
  StaV4Question,
  StaV4QlId,
} from "./exam-realness-v4-1-types.ts";

export {
  assertStaV4QuestionIntegrity,
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

export const STA_V41_EDITORIAL_SURFACE_AUTHORITY = "STA-001-V4-1-EDITORIAL-R2" as const;

const quote = (value: string) => `“${value}”`;
const localized = (
  context: StaV41Context,
  key: keyof Pick<StaV41Context, "actor" | "task" | "channel" | "issue" | "intervention" | "outcome" | "audience" | "metric">,
  language: StaV4Language,
) => context[key][language];

function contextForScenario(scenarioId: string): StaV41Context {
  const matches = STA_V41_CONTEXTS.filter((context) => scenarioId.endsWith(`-${context.id}`));
  if (matches.length !== 1) throw new Error(`${scenarioId}: unable to resolve exactly one V4.1 editorial context`);
  return matches[0]!;
}

function statementIndex(question: StaV4Question): 0 | 1 | 2 {
  const scenario = STA_V41_SCENARIOS.find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario authority`);
  const index = scenario.statementVariants.findIndex((entry) => entry[question.language] === question.statement);
  if (index < 0 || index > 2) throw new Error(`${question.questionId}: statement wording authority drift`);
  return index as 0 | 1 | 2;
}

function candidateVariantIndex(question: StaV4Question, candidateId: string, text: string): 0 | 1 {
  const scenario = STA_V41_SCENARIOS.find((entry) => entry.scenarioId === question.scenarioId);
  const authority = scenario?.candidates.find((entry) => entry.candidateId === candidateId);
  if (!authority) throw new Error(`${question.questionId}: missing candidate authority ${candidateId}`);
  const index = authority.textVariants.findIndex((entry) => entry[question.language] === text);
  if (index < 0 || index > 1) throw new Error(`${question.questionId}: candidate wording authority drift ${candidateId}`);
  return index as 0 | 1;
}

export function renderStaV41EditorialStatement(
  qlId: StaV4QlId,
  index: 0 | 1 | 2,
  context: StaV41Context,
  language: StaV4Language,
): string {
  const actor = localized(context, "actor", language);
  const task = localized(context, "task", language);
  const channel = localized(context, "channel", language);
  const issue = localized(context, "issue", language);
  const intervention = localized(context, "intervention", language);
  const outcome = localized(context, "outcome", language);
  const audience = localized(context, "audience", language);
  const metric = localized(context, "metric", language);

  if (language === "en") {
    if (qlId !== "STA-QL-006") {
      const scenario = STA_V41_SCENARIOS.find((entry) => entry.qlId === qlId && entry.scenarioId.endsWith(`-${context.id}`));
      if (!scenario) throw new Error(`${qlId}/${context.id}: missing English editorial authority`);
      return scenario.statementVariants[index].en;
    }
    if (index === 0) return `A review of ${audience} recorded a better result on ${metric} for the intervention ${quote(intervention)} than for the current arrangement; the service concludes that the intervention is more effective.`;
    if (index === 1) return `Based on ${metric} observed among ${audience}, the administration rates the intervention ${quote(intervention)} above the existing process.`;
    return `From a review of ${audience}, the service concludes that using ${quote(intervention)} produces a stronger result on ${metric}.`;
  }

  if (language === "hi") {
    if (qlId === "STA-QL-001") {
      if (index === 0) return `कार्य ${quote(task)} के लिए सेवा माध्यम ${quote(channel)} का उपयोग करें।`;
      if (index === 1) return `लक्षित उपयोगकर्ता ${quote(actor)} को कार्य ${quote(task)} सेवा माध्यम ${quote(channel)} के जरिए पूरा करने का निर्देश है।`;
      return `कार्य ${quote(task)} के लिए निर्धारित सेवा माध्यम ${quote(channel)} है।`;
    }
    if (qlId === "STA-QL-002") {
      if (index === 0) return `समस्या ${quote(issue)} से निपटने के लिए सेवा को हस्तक्षेप ${quote(intervention)} शुरू करना चाहिए।`;
      if (index === 1) return `प्रशासन समस्या ${quote(issue)} के समाधान के रूप में हस्तक्षेप ${quote(intervention)} की सिफारिश करता है।`;
      return `परिणाम ${quote(outcome)} हासिल करने के उद्देश्य से हस्तक्षेप ${quote(intervention)} प्रस्तावित है।`;
    }
    if (qlId === "STA-QL-003") {
      if (index === 0) return `सूचना: लक्षित समूह ${quote(audience)} कार्य ${quote(task)} के लिए माध्यम ${quote(channel)} का उपयोग करे।`;
      if (index === 1) return `सेवा लक्षित समूह ${quote(audience)} को कार्य ${quote(task)} माध्यम ${quote(channel)} के जरिए करने का निर्देश देती है।`;
      return `आधिकारिक सूचना में कार्य ${quote(task)} के लिए माध्यम ${quote(channel)} निर्धारित है।`;
    }
    if (qlId === "STA-QL-004") {
      if (index === 0) return `हस्तक्षेप ${quote(intervention)} शुरू करने से समस्या ${quote(issue)} पर असर पड़ने और परिणाम ${quote(outcome)} मिलने की संभावना बताई गई है।`;
      if (index === 1) return `सेवा हस्तक्षेप ${quote(intervention)} अपनाने के बाद परिणाम ${quote(outcome)} की अपेक्षा करती है।`;
      return `परिणाम ${quote(outcome)} में अनुमानित सुधार को हस्तक्षेप ${quote(intervention)} से जोड़ा गया है।`;
    }
    if (qlId === "STA-QL-005") {
      if (index === 0) return `लक्षित समूह ${quote(audience)} के लिए संदेश: कार्य ${quote(task)} हेतु माध्यम ${quote(channel)} का उपयोग करें और लाभ ${quote(outcome)} प्राप्त करें।`;
      if (index === 1) return `प्रचार संदेश लक्षित समूह ${quote(audience)} के लिए माध्यम ${quote(channel)} को लाभ ${quote(outcome)} पाने का रास्ता बताता है।`;
      return `सेवा लाभ ${quote(outcome)} को प्रमुखता देकर माध्यम ${quote(channel)} का प्रचार करती है।`;
    }
    if (index === 0) return `लक्षित समूह ${quote(audience)} की समीक्षा में हस्तक्षेप ${quote(intervention)} के साथ प्रदर्शन माप ${quote(metric)} का परिणाम मौजूदा व्यवस्था से बेहतर रहा; सेवा हस्तक्षेप को अधिक प्रभावी मानती है।`;
    if (index === 1) return `लक्षित समूह ${quote(audience)} में देखे गए प्रदर्शन माप ${quote(metric)} के आधार पर प्रशासन हस्तक्षेप ${quote(intervention)} को मौजूदा प्रक्रिया से बेहतर मानता है।`;
    return `लक्षित समूह ${quote(audience)} की समीक्षा से सेवा निष्कर्ष निकालती है कि हस्तक्षेप ${quote(intervention)} का उपयोग प्रदर्शन माप ${quote(metric)} पर बेहतर परिणाम देता है।`;
  }

  if (qlId === "STA-QL-001") {
    if (index === 0) return `ਕੰਮ ${quote(task)} ਲਈ ਸੇਵਾ ਮਾਧਿਅਮ ${quote(channel)} ਦੀ ਵਰਤੋਂ ਕਰੋ।`;
    if (index === 1) return `ਲਕਸ਼ਿਤ ਵਰਤੋਂਕਾਰ ${quote(actor)} ਨੂੰ ਕੰਮ ${quote(task)} ਸੇਵਾ ਮਾਧਿਅਮ ${quote(channel)} ਰਾਹੀਂ ਪੂਰਾ ਕਰਨ ਦੀ ਹਦਾਇਤ ਹੈ।`;
    return `ਕੰਮ ${quote(task)} ਲਈ ਨਿਰਧਾਰਤ ਸੇਵਾ ਮਾਧਿਅਮ ${quote(channel)} ਹੈ।`;
  }
  if (qlId === "STA-QL-002") {
    if (index === 0) return `ਸਮੱਸਿਆ ${quote(issue)} ਨਾਲ ਨਿਪਟਣ ਲਈ ਸੇਵਾ ਨੂੰ ਦਖ਼ਲ ${quote(intervention)} ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।`;
    if (index === 1) return `ਪ੍ਰਸ਼ਾਸਨ ਸਮੱਸਿਆ ${quote(issue)} ਦੇ ਹੱਲ ਵਜੋਂ ਦਖ਼ਲ ${quote(intervention)} ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹੈ।`;
    return `ਨਤੀਜਾ ${quote(outcome)} ਹਾਸਲ ਕਰਨ ਦੇ ਉਦੇਸ਼ ਨਾਲ ਦਖ਼ਲ ${quote(intervention)} ਪ੍ਰਸਤਾਵਿਤ ਹੈ।`;
  }
  if (qlId === "STA-QL-003") {
    if (index === 0) return `ਸੂਚਨਾ: ਲਕਸ਼ਿਤ ਸਮੂਹ ${quote(audience)} ਕੰਮ ${quote(task)} ਲਈ ਮਾਧਿਅਮ ${quote(channel)} ਦੀ ਵਰਤੋਂ ਕਰੇ।`;
    if (index === 1) return `ਸੇਵਾ ਲਕਸ਼ਿਤ ਸਮੂਹ ${quote(audience)} ਨੂੰ ਕੰਮ ${quote(task)} ਮਾਧਿਅਮ ${quote(channel)} ਰਾਹੀਂ ਕਰਨ ਦੀ ਹਦਾਇਤ ਦਿੰਦੀ ਹੈ।`;
    return `ਅਧਿਕਾਰਕ ਸੂਚਨਾ ਵਿੱਚ ਕੰਮ ${quote(task)} ਲਈ ਮਾਧਿਅਮ ${quote(channel)} ਨਿਰਧਾਰਤ ਹੈ।`;
  }
  if (qlId === "STA-QL-004") {
    if (index === 0) return `ਦਖ਼ਲ ${quote(intervention)} ਸ਼ੁਰੂ ਕਰਨ ਨਾਲ ਸਮੱਸਿਆ ${quote(issue)} ਉੱਤੇ ਅਸਰ ਪੈਣ ਅਤੇ ਨਤੀਜਾ ${quote(outcome)} ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਦੱਸੀ ਗਈ ਹੈ।`;
    if (index === 1) return `ਸੇਵਾ ਦਖ਼ਲ ${quote(intervention)} ਅਪਣਾਉਣ ਤੋਂ ਬਾਅਦ ਨਤੀਜਾ ${quote(outcome)} ਦੀ ਉਮੀਦ ਕਰਦੀ ਹੈ।`;
    return `ਨਤੀਜਾ ${quote(outcome)} ਵਿੱਚ ਅਨੁਮਾਨਿਤ ਸੁਧਾਰ ਨੂੰ ਦਖ਼ਲ ${quote(intervention)} ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।`;
  }
  if (qlId === "STA-QL-005") {
    if (index === 0) return `ਲਕਸ਼ਿਤ ਸਮੂਹ ${quote(audience)} ਲਈ ਸੁਨੇਹਾ: ਕੰਮ ${quote(task)} ਵਾਸਤੇ ਮਾਧਿਅਮ ${quote(channel)} ਦੀ ਵਰਤੋਂ ਕਰੋ ਅਤੇ ਲਾਭ ${quote(outcome)} ਪ੍ਰਾਪਤ ਕਰੋ।`;
    if (index === 1) return `ਪ੍ਰਚਾਰ ਸੁਨੇਹਾ ਲਕਸ਼ਿਤ ਸਮੂਹ ${quote(audience)} ਲਈ ਮਾਧਿਅਮ ${quote(channel)} ਨੂੰ ਲਾਭ ${quote(outcome)} ਪਾਉਣ ਦਾ ਰਸਤਾ ਦੱਸਦਾ ਹੈ।`;
    return `ਸੇਵਾ ਲਾਭ ${quote(outcome)} ਨੂੰ ਉਭਾਰ ਕੇ ਮਾਧਿਅਮ ${quote(channel)} ਦਾ ਪ੍ਰਚਾਰ ਕਰਦੀ ਹੈ।`;
  }
  if (index === 0) return `ਲਕਸ਼ਿਤ ਸਮੂਹ ${quote(audience)} ਦੀ ਸਮੀਖਿਆ ਵਿੱਚ ਦਖ਼ਲ ${quote(intervention)} ਨਾਲ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ ${quote(metric)} ਦਾ ਨਤੀਜਾ ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਨਾਲੋਂ ਬਿਹਤਰ ਰਿਹਾ; ਸੇਵਾ ਦਖ਼ਲ ਨੂੰ ਵਧੇਰੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਮੰਨਦੀ ਹੈ।`;
  if (index === 1) return `ਲਕਸ਼ਿਤ ਸਮੂਹ ${quote(audience)} ਵਿੱਚ ਦੇਖੇ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ ${quote(metric)} ਦੇ ਆਧਾਰ ਤੇ ਪ੍ਰਸ਼ਾਸਨ ਦਖ਼ਲ ${quote(intervention)} ਨੂੰ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਨਾਲੋਂ ਬਿਹਤਰ ਮੰਨਦਾ ਹੈ।`;
  return `ਲਕਸ਼ਿਤ ਸਮੂਹ ${quote(audience)} ਦੀ ਸਮੀਖਿਆ ਤੋਂ ਸੇਵਾ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਕਿ ਦਖ਼ਲ ${quote(intervention)} ਦੀ ਵਰਤੋਂ ਨਾਲ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ ${quote(metric)} ਉੱਤੇ ਬਿਹਤਰ ਨਤੀਜਾ ਮਿਲਦਾ ਹੈ।`;
}

function hiCandidate(qlId: StaV4QlId, n: number, v: 0 | 1, c: StaV41Context): string {
  const actor=quote(c.actor.hi), task=quote(c.task.hi), channel=quote(c.channel.hi), issue=quote(c.issue.hi), intervention=quote(c.intervention.hi), outcome=quote(c.outcome.hi), audience=quote(c.audience.hi), metric=quote(c.metric.hi);
  const key = `${qlId}:${n}:${v}`;
  const map: Record<string,string> = {
    "STA-QL-001:1:0":`सेवा माध्यम ${channel} कार्य ${task} पूरा करने में सक्षम है।`, "STA-QL-001:1:1":`कार्य ${task} सेवा माध्यम ${channel} के जरिए पूरा किया जा सकता है।`,
    "STA-QL-001:2:0":`लक्षित समूह ${actor} को सेवा माध्यम ${channel} तक व्यावहारिक पहुंच है।`, "STA-QL-001:2:1":`सेवा माध्यम ${channel} लक्षित समूह ${actor} के लिए व्यावहारिक रूप से सुलभ है।`,
    "STA-QL-001:3:0":`संबंधित सेवा अवधि में माध्यम ${channel} उपलब्ध रहता है।`, "STA-QL-001:3:1":`संबंधित सेवा अवधि में माध्यम ${channel} तक पहुंच उपलब्ध है।`,
    "STA-QL-001:4:0":`माध्यम ${channel} पिछली विधि से अधिक सुविधाजनक है।`, "STA-QL-001:4:1":`पिछली विधि माध्यम ${channel} की तुलना में कम सुविधाजनक है।`,
    "STA-QL-001:5:0":`उपयोगकर्ता कार्य ${task} के लिए माध्यम ${channel} को सामान्यतः पसंद करते हैं।`, "STA-QL-001:5:1":`माध्यम ${channel} कार्य ${task} के लिए लोकप्रिय है।`,
    "STA-QL-001:6:0":`समस्या ${issue} का मुख्य कारण कमजोर कर्मचारी प्रशिक्षण है।`, "STA-QL-001:6:1":`कमजोर कर्मचारी प्रशिक्षण समस्या ${issue} का प्रमुख स्रोत है।`,
    "STA-QL-001:7:0":`माध्यम ${channel} हाल ही में शुरू किया गया था।`, "STA-QL-001:7:1":`सेवा ने माध्यम ${channel} हाल ही में जोड़ा है।`,
    "STA-QL-002:1:0":`समस्या ${issue} के लिए परिचालन प्रतिक्रिया उचित है।`, "STA-QL-002:1:1":`सेवा के पास समस्या ${issue} को संबोधित करने का सार्थक कारण है।`,
    "STA-QL-002:2:0":`हस्तक्षेप ${intervention} इस व्यवस्था में व्यावहारिक रूप से लागू किया जा सकता है।`, "STA-QL-002:2:1":`सेवा के पास हस्तक्षेप ${intervention} लागू करने का व्यावहारिक मार्ग है।`,
    "STA-QL-002:3:0":`हस्तक्षेप ${intervention} और परिणाम ${outcome} के बीच विश्वसनीय संबंध है।`, "STA-QL-002:3:1":`परिणाम ${outcome} तक पहुंचने के लिए हस्तक्षेप ${intervention} से उचित संबंध है।`,
    "STA-QL-002:4:0":`हस्तक्षेप ${intervention} की लागत मौजूदा प्रक्रिया से कम है।`, "STA-QL-002:4:1":`मौजूदा प्रक्रिया की लागत हस्तक्षेप ${intervention} से अधिक है।`,
    "STA-QL-002:5:0":`परिचालन दल हस्तक्षेप ${intervention} को पहले से पसंद करता है।`, "STA-QL-002:5:1":`हस्तक्षेप ${intervention} परिचालन दल में लोकप्रिय है।`,
    "STA-QL-002:6:0":`समस्या ${issue} का मुख्य कारण कमजोर निगरानी है।`, "STA-QL-002:6:1":`कमजोर निगरानी समस्या ${issue} का प्रमुख कारण है।`,
    "STA-QL-002:7:0":`पड़ोसी कार्यालय इसी प्रकार का हस्तक्षेप उपयोग करता है।`, "STA-QL-002:7:1":`एक तुलनीय संस्था ने इसी प्रकार का उपाय अपनाया है।`,
    "STA-QL-003:1:0":`माध्यम ${channel} कार्य ${task} से जुड़े अनुरोध स्वीकार करता है।`, "STA-QL-003:1:1":`कार्य ${task} का प्रसंस्करण माध्यम ${channel} के जरिए होता है।`,
    "STA-QL-003:2:0":`लक्षित समूह ${audience} को माध्यम ${channel} तक व्यावहारिक पहुंच है।`, "STA-QL-003:2:1":`माध्यम ${channel} लक्षित समूह ${audience} के लिए व्यावहारिक रूप से सुलभ है।`,
    "STA-QL-003:3:0":`माध्यम ${channel} का उपयोग सूचना के प्रशासनिक उद्देश्य को पूरा करता है।`, "STA-QL-003:3:1":`निर्धारित माध्यम सेवा निर्देश के उद्देश्य से संबंधित है।`,
    "STA-QL-003:4:0":`माध्यम ${channel} प्रत्यक्ष सेवा से अधिक लोकप्रिय है।`, "STA-QL-003:4:1":`उपयोगकर्ता कार्यालय जाने के बजाय माध्यम ${channel} को पसंद करते हैं।`,
    "STA-QL-003:5:0":`सूचना हाल की शिकायत के बाद जारी हुई।`, "STA-QL-003:5:1":`एक शिकायत ने प्रशासन को सूचना जारी करने के लिए प्रेरित किया।`,
    "STA-QL-003:6:0":`कर्मचारियों को अगले महीने बहुत अधिक मांग की आशा है।`, "STA-QL-003:6:1":`सेवा को अगली अवधि में असामान्य रूप से अधिक मांग की आशा है।`,
    "STA-QL-003:7:0":`पिछली प्रक्रिया की रूपरेखा कमजोर थी।`, "STA-QL-003:7:1":`पहले वाले सेवा माध्यम की रूपरेखा कमजोर थी।`,
    "STA-QL-004:1:0":`हस्तक्षेप ${intervention} समस्या ${issue} से जुड़े कारक को संबोधित करता है।`, "STA-QL-004:1:1":`हस्तक्षेप ${intervention} से बताई समस्या तक प्रासंगिक कारण-मार्ग है।`,
    "STA-QL-004:2:0":`हस्तक्षेप ${intervention} का प्रभाव परिणाम ${outcome} से संबंधित है।`, "STA-QL-004:2:1":`परिणाम ${outcome} हस्तक्षेप ${intervention} के तंत्र से प्रभावित हो सकता है।`,
    "STA-QL-004:3:0":`मौजूदा स्थिति में परिणाम ${outcome} की दिशा में सुधार की गुंजाइश है।`, "STA-QL-004:3:1":`आधार स्थिति परिणाम ${outcome} की दिशा में सार्थक बदलाव की गुंजाइश देती है।`,
    "STA-QL-004:4:0":`सुधार की दर सभी स्थानों पर समान रहेगी।`, "STA-QL-004:4:1":`हर स्थान पर सुधार की मात्रा समान होगी।`,
    "STA-QL-004:5:0":`समस्या ${issue} का मुख्य कारण कर्मचारियों का रवैया है।`, "STA-QL-004:5:1":`कर्मचारियों का रवैया समस्या ${issue} का प्रमुख कारण है।`,
    "STA-QL-004:6:0":`हस्तक्षेप ${intervention} की लागत मौजूदा व्यवस्था से कम है।`, "STA-QL-004:6:1":`मौजूदा व्यवस्था की लागत हस्तक्षेप ${intervention} से अधिक है।`,
    "STA-QL-004:7:0":`हस्तक्षेप ${intervention} तैयार करने वाली टीम ने मापदंड चुना।`, "STA-QL-004:7:1":`मापदंड हस्तक्षेप डिजाइन टीम ने चुना था।`,
    "STA-QL-005:1:0":`लाभ ${outcome} लक्षित लोगों के लिए महत्वपूर्ण है।`, "STA-QL-005:1:1":`बताया गया लाभ लक्षित समूह ${audience} के लिए प्रासंगिक है।`,
    "STA-QL-005:2:0":`लक्षित समूह ${audience} के पास संदेश पर प्रतिक्रिया देने का व्यावहारिक मार्ग है।`, "STA-QL-005:2:1":`प्रचार में बताई कार्रवाई लक्षित समूह ${audience} के लिए व्यावहारिक रूप से उपलब्ध है।`,
    "STA-QL-005:3:0":`प्रचारित माध्यम ${channel} और लाभ ${outcome} के बीच विश्वसनीय संबंध है।`, "STA-QL-005:3:1":`प्रचारित माध्यम ${channel} लाभ ${outcome} उत्पन्न करने से संबंधित है।`,
    "STA-QL-005:4:0":`लक्षित लोग पहले से इस सेवा प्रदाता को पसंद करते हैं।`, "STA-QL-005:4:1":`सेवा प्रदाता को पहले से लोगों की मजबूत पसंद प्राप्त है।`,
    "STA-QL-005:5:0":`प्रतिस्पर्धी सेवाएं उसी कार्य में कमजोर प्रदर्शन करती हैं।`, "STA-QL-005:5:1":`वैकल्पिक प्रदाता इस कार्य में कमजोर परिणाम देते हैं।`,
    "STA-QL-005:6:0":`विज्ञापन स्वयं सेवा की गुणवत्ता सिद्ध करता है।`, "STA-QL-005:6:1":`संदेश प्रकाशित होना गुणवत्ता दावे को तथ्य के रूप में सिद्ध करता है।`,
    "STA-QL-005:7:0":`प्रचार बजट पिछले वर्ष के बजट से अधिक है।`, "STA-QL-005:7:1":`इस प्रचार अभियान को पिछले अभियान से बड़ा बजट मिला।`,
    "STA-QL-006:1:0":`प्रदर्शन माप ${metric} आंकी जा रही प्रभावशीलता से संबंधित है।`, "STA-QL-006:1:1":`चुना गया माप दावा किए प्रदर्शन के सार्थक हिस्से को दर्शाता है।`,
    "STA-QL-006:2:0":`तुलना वाले मामलों का आकलन पर्याप्त रूप से तुलनीय परिस्थितियों में हुआ।`, "STA-QL-006:2:1":`तुलना मूल रूप से अलग परीक्षण परिस्थितियों पर आधारित नहीं है।`,
    "STA-QL-006:3:0":`समीक्षित समूह ${audience} दावे के दायरे के लिए उपयुक्त साक्ष्य देता है।`, "STA-QL-006:3:1":`समीक्षित समूह निष्कर्ष में शामिल जनसमूह से संबंधित है।`,
    "STA-QL-006:4:0":`हस्तक्षेप ${intervention} मौजूदा व्यवस्था की तुलना में नया है।`, "STA-QL-006:4:1":`मौजूदा व्यवस्था हस्तक्षेप ${intervention} से पहले शुरू हुई थी।`,
    "STA-QL-006:5:0":`हस्तक्षेप ${intervention} के पक्ष वाली टीम ने मापदंड चुना।`, "STA-QL-006:5:1":`हस्तक्षेप के समर्थकों ने प्रदर्शन माप चुना।`,
    "STA-QL-006:6:0":`मौजूदा व्यवस्था की सार्वजनिक प्रतिष्ठा कमजोर है।`, "STA-QL-006:6:1":`उपयोगकर्ताओं की मौजूदा व्यवस्था के बारे में कम अनुकूल राय है।`,
    "STA-QL-006:7:0":`हस्तक्षेप समूह को बड़ा परिचालन बजट मिला।`, "STA-QL-006:7:1":`हस्तक्षेप समूह को अधिक परिचालन धन दिया गया।`,
  };
  const value=map[key]; if (!value) throw new Error(`${key}: missing Hindi editorial candidate surface`); return value;
}

function paCandidate(qlId: StaV4QlId, n: number, v: 0 | 1, c: StaV41Context): string {
  const actor=quote(c.actor.pa), task=quote(c.task.pa), channel=quote(c.channel.pa), issue=quote(c.issue.pa), intervention=quote(c.intervention.pa), outcome=quote(c.outcome.pa), audience=quote(c.audience.pa), metric=quote(c.metric.pa);
  const key = `${qlId}:${n}:${v}`;
  const map: Record<string,string> = {
    "STA-QL-001:1:0":`ਸੇਵਾ ਮਾਧਿਅਮ ${channel} ਕੰਮ ${task} ਪੂਰਾ ਕਰਨ ਦੇ ਯੋਗ ਹੈ।`, "STA-QL-001:1:1":`ਕੰਮ ${task} ਸੇਵਾ ਮਾਧਿਅਮ ${channel} ਰਾਹੀਂ ਪੂਰਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।`,
    "STA-QL-001:2:0":`ਲਕਸ਼ਿਤ ਸਮੂਹ ${actor} ਨੂੰ ਸੇਵਾ ਮਾਧਿਅਮ ${channel} ਤੱਕ ਵਿਹਾਰਕ ਪਹੁੰਚ ਹੈ।`, "STA-QL-001:2:1":`ਸੇਵਾ ਮਾਧਿਅਮ ${channel} ਲਕਸ਼ਿਤ ਸਮੂਹ ${actor} ਲਈ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਪਹੁੰਚਯੋਗ ਹੈ।`,
    "STA-QL-001:3:0":`ਸੰਬੰਧਿਤ ਸੇਵਾ ਸਮੇਂ ਦੌਰਾਨ ਮਾਧਿਅਮ ${channel} ਉਪਲਬਧ ਰਹਿੰਦਾ ਹੈ।`, "STA-QL-001:3:1":`ਸੰਬੰਧਿਤ ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਮਾਧਿਅਮ ${channel} ਤੱਕ ਪਹੁੰਚ ਉਪਲਬਧ ਹੈ।`,
    "STA-QL-001:4:0":`ਮਾਧਿਅਮ ${channel} ਪਿਛਲੇ ਤਰੀਕੇ ਨਾਲੋਂ ਵਧੇਰੇ ਸੁਵਿਧਾਜਨਕ ਹੈ।`, "STA-QL-001:4:1":`ਪਿਛਲਾ ਤਰੀਕਾ ਮਾਧਿਅਮ ${channel} ਨਾਲੋਂ ਘੱਟ ਸੁਵਿਧਾਜਨਕ ਹੈ।`,
    "STA-QL-001:5:0":`ਵਰਤੋਂਕਾਰ ਕੰਮ ${task} ਲਈ ਮਾਧਿਅਮ ${channel} ਨੂੰ ਆਮ ਤੌਰ ਤੇ ਤਰਜੀਹ ਦਿੰਦੇ ਹਨ।`, "STA-QL-001:5:1":`ਮਾਧਿਅਮ ${channel} ਕੰਮ ${task} ਲਈ ਲੋਕਪ੍ਰਿਯ ਹੈ।`,
    "STA-QL-001:6:0":`ਸਮੱਸਿਆ ${issue} ਦਾ ਮੁੱਖ ਕਾਰਨ ਕਮਜ਼ੋਰ ਸਟਾਫ਼ ਤਰਬੀਅਤ ਹੈ।`, "STA-QL-001:6:1":`ਕਮਜ਼ੋਰ ਸਟਾਫ਼ ਤਰਬੀਅਤ ਸਮੱਸਿਆ ${issue} ਦਾ ਮੁੱਖ ਸਰੋਤ ਹੈ।`,
    "STA-QL-001:7:0":`ਮਾਧਿਅਮ ${channel} ਹਾਲ ਹੀ ਵਿੱਚ ਸ਼ੁਰੂ ਕੀਤਾ ਗਿਆ ਸੀ।`, "STA-QL-001:7:1":`ਸੇਵਾ ਨੇ ਮਾਧਿਅਮ ${channel} ਹਾਲ ਹੀ ਵਿੱਚ ਜੋੜਿਆ ਹੈ।`,
    "STA-QL-002:1:0":`ਸਮੱਸਿਆ ${issue} ਲਈ ਕਾਰਜਕਾਰੀ ਜਵਾਬ ਵਾਜਬ ਹੈ।`, "STA-QL-002:1:1":`ਸੇਵਾ ਕੋਲ ਸਮੱਸਿਆ ${issue} ਨੂੰ ਹੱਲ ਕਰਨ ਦਾ ਵਾਜਬ ਕਾਰਨ ਹੈ।`,
    "STA-QL-002:2:0":`ਦਖ਼ਲ ${intervention} ਇਸ ਪ੍ਰਬੰਧ ਵਿੱਚ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਲਾਗੂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।`, "STA-QL-002:2:1":`ਸੇਵਾ ਕੋਲ ਦਖ਼ਲ ${intervention} ਲਾਗੂ ਕਰਨ ਦਾ ਵਿਹਾਰਕ ਰਸਤਾ ਹੈ।`,
    "STA-QL-002:3:0":`ਦਖ਼ਲ ${intervention} ਅਤੇ ਨਤੀਜਾ ${outcome} ਵਿਚਕਾਰ ਭਰੋਸੇਯੋਗ ਸੰਬੰਧ ਹੈ।`, "STA-QL-002:3:1":`ਨਤੀਜਾ ${outcome} ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਦਖ਼ਲ ${intervention} ਨਾਲ ਵਾਜਬ ਸੰਬੰਧ ਹੈ।`,
    "STA-QL-002:4:0":`ਦਖ਼ਲ ${intervention} ਦੀ ਲਾਗਤ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਨਾਲੋਂ ਘੱਟ ਹੈ।`, "STA-QL-002:4:1":`ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਦੀ ਲਾਗਤ ਦਖ਼ਲ ${intervention} ਨਾਲੋਂ ਵੱਧ ਹੈ।`,
    "STA-QL-002:5:0":`ਕਾਰਜਕਾਰੀ ਟੀਮ ਦਖ਼ਲ ${intervention} ਨੂੰ ਪਹਿਲਾਂ ਤੋਂ ਤਰਜੀਹ ਦਿੰਦੀ ਹੈ।`, "STA-QL-002:5:1":`ਦਖ਼ਲ ${intervention} ਕਾਰਜਕਾਰੀ ਟੀਮ ਵਿੱਚ ਲੋਕਪ੍ਰਿਯ ਹੈ।`,
    "STA-QL-002:6:0":`ਸਮੱਸਿਆ ${issue} ਦਾ ਮੁੱਖ ਕਾਰਨ ਕਮਜ਼ੋਰ ਨਿਗਰਾਨੀ ਹੈ।`, "STA-QL-002:6:1":`ਕਮਜ਼ੋਰ ਨਿਗਰਾਨੀ ਸਮੱਸਿਆ ${issue} ਦਾ ਮੁੱਖ ਕਾਰਨ ਹੈ।`,
    "STA-QL-002:7:0":`ਨੇੜਲਾ ਦਫ਼ਤਰ ਇਸੇ ਕਿਸਮ ਦਾ ਦਖ਼ਲ ਵਰਤਦਾ ਹੈ।`, "STA-QL-002:7:1":`ਇੱਕ ਤੁਲਨਾਤਮਕ ਸੰਸਥਾ ਨੇ ਇਸੇ ਕਿਸਮ ਦਾ ਉਪਾਅ ਅਪਣਾਇਆ ਹੈ।`,
    "STA-QL-003:1:0":`ਮਾਧਿਅਮ ${channel} ਕੰਮ ${task} ਨਾਲ ਜੁੜੀਆਂ ਬੇਨਤੀਆਂ ਸਵੀਕਾਰ ਕਰਦਾ ਹੈ।`, "STA-QL-003:1:1":`ਕੰਮ ${task} ਦੀ ਕਾਰਵਾਈ ਮਾਧਿਅਮ ${channel} ਰਾਹੀਂ ਹੁੰਦੀ ਹੈ।`,
    "STA-QL-003:2:0":`ਲਕਸ਼ਿਤ ਸਮੂਹ ${audience} ਨੂੰ ਮਾਧਿਅਮ ${channel} ਤੱਕ ਵਿਹਾਰਕ ਪਹੁੰਚ ਹੈ।`, "STA-QL-003:2:1":`ਮਾਧਿਅਮ ${channel} ਲਕਸ਼ਿਤ ਸਮੂਹ ${audience} ਲਈ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਪਹੁੰਚਯੋਗ ਹੈ।`,
    "STA-QL-003:3:0":`ਮਾਧਿਅਮ ${channel} ਦੀ ਵਰਤੋਂ ਸੂਚਨਾ ਦੇ ਪ੍ਰਸ਼ਾਸਕੀ ਉਦੇਸ਼ ਨੂੰ ਪੂਰਾ ਕਰਦੀ ਹੈ।`, "STA-QL-003:3:1":`ਨਿਰਧਾਰਤ ਮਾਧਿਅਮ ਸੇਵਾ ਹਦਾਇਤ ਦੇ ਉਦੇਸ਼ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`,
    "STA-QL-003:4:0":`ਮਾਧਿਅਮ ${channel} ਸਿੱਧੀ ਸੇਵਾ ਨਾਲੋਂ ਵਧੇਰੇ ਲੋਕਪ੍ਰਿਯ ਹੈ।`, "STA-QL-003:4:1":`ਵਰਤੋਂਕਾਰ ਦਫ਼ਤਰ ਜਾਣ ਦੀ ਥਾਂ ਮਾਧਿਅਮ ${channel} ਨੂੰ ਤਰਜੀਹ ਦਿੰਦੇ ਹਨ।`,
    "STA-QL-003:5:0":`ਸੂਚਨਾ ਹਾਲ ਦੀ ਸ਼ਿਕਾਇਤ ਤੋਂ ਬਾਅਦ ਜਾਰੀ ਹੋਈ।`, "STA-QL-003:5:1":`ਇੱਕ ਸ਼ਿਕਾਇਤ ਨੇ ਪ੍ਰਸ਼ਾਸਨ ਨੂੰ ਸੂਚਨਾ ਜਾਰੀ ਕਰਨ ਲਈ ਪ੍ਰੇਰਿਆ।`,
    "STA-QL-003:6:0":`ਸਟਾਫ਼ ਨੂੰ ਅਗਲੇ ਮਹੀਨੇ ਬਹੁਤ ਵੱਧ ਮੰਗ ਦੀ ਉਮੀਦ ਹੈ।`, "STA-QL-003:6:1":`ਸੇਵਾ ਨੂੰ ਅਗਲੇ ਸਮੇਂ ਵਿੱਚ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਵੱਧ ਮੰਗ ਦੀ ਉਮੀਦ ਹੈ।`,
    "STA-QL-003:7:0":`ਪਿਛਲੀ ਪ੍ਰਕਿਰਿਆ ਦੀ ਬਣਤਰ ਕਮਜ਼ੋਰ ਸੀ।`, "STA-QL-003:7:1":`ਪਹਿਲੇ ਸੇਵਾ ਮਾਧਿਅਮ ਦੀ ਬਣਤਰ ਕਮਜ਼ੋਰ ਸੀ।`,
    "STA-QL-004:1:0":`ਦਖ਼ਲ ${intervention} ਸਮੱਸਿਆ ${issue} ਨਾਲ ਜੁੜੇ ਕਾਰਕ ਨੂੰ ਹੱਲ ਕਰਦਾ ਹੈ।`, "STA-QL-004:1:1":`ਦਖ਼ਲ ${intervention} ਤੋਂ ਦੱਸੀ ਸਮੱਸਿਆ ਤੱਕ ਸੰਬੰਧਿਤ ਕਾਰਨ-ਰਸਤਾ ਹੈ।`,
    "STA-QL-004:2:0":`ਦਖ਼ਲ ${intervention} ਦਾ ਅਸਰ ਨਤੀਜਾ ${outcome} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`, "STA-QL-004:2:1":`ਨਤੀਜਾ ${outcome} ਦਖ਼ਲ ${intervention} ਦੇ ਤਰੀਕੇ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਹੋ ਸਕਦਾ ਹੈ।`,
    "STA-QL-004:3:0":`ਮੌਜੂਦਾ ਸਥਿਤੀ ਵਿੱਚ ਨਤੀਜਾ ${outcome} ਵੱਲ ਸੁਧਾਰ ਦੀ ਗੁੰਜਾਇਸ਼ ਹੈ।`, "STA-QL-004:3:1":`ਅਧਾਰ ਸਥਿਤੀ ਨਤੀਜਾ ${outcome} ਵੱਲ ਅਰਥਪੂਰਨ ਬਦਲਾਅ ਦੀ ਗੁੰਜਾਇਸ਼ ਦਿੰਦੀ ਹੈ।`,
    "STA-QL-004:4:0":`ਸੁਧਾਰ ਦੀ ਦਰ ਸਾਰੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਇਕੋ ਜਿਹੀ ਰਹੇਗੀ।`, "STA-QL-004:4:1":`ਹਰੇਕ ਥਾਂ ਉੱਤੇ ਸੁਧਾਰ ਦੀ ਮਾਤਰਾ ਇਕੋ ਜਿਹੀ ਹੋਵੇਗੀ।`,
    "STA-QL-004:5:0":`ਸਮੱਸਿਆ ${issue} ਦਾ ਮੁੱਖ ਕਾਰਨ ਸਟਾਫ਼ ਦਾ ਰਵੱਈਆ ਹੈ।`, "STA-QL-004:5:1":`ਸਟਾਫ਼ ਦਾ ਰਵੱਈਆ ਸਮੱਸਿਆ ${issue} ਦਾ ਮੁੱਖ ਕਾਰਨ ਹੈ।`,
    "STA-QL-004:6:0":`ਦਖ਼ਲ ${intervention} ਦੀ ਲਾਗਤ ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਨਾਲੋਂ ਘੱਟ ਹੈ।`, "STA-QL-004:6:1":`ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਦੀ ਲਾਗਤ ਦਖ਼ਲ ${intervention} ਨਾਲੋਂ ਵੱਧ ਹੈ।`,
    "STA-QL-004:7:0":`ਦਖ਼ਲ ${intervention} ਤਿਆਰ ਕਰਨ ਵਾਲੀ ਟੀਮ ਨੇ ਮਾਪਦੰਡ ਚੁਣਿਆ।`, "STA-QL-004:7:1":`ਮਾਪਦੰਡ ਦਖ਼ਲ ਡਿਜ਼ਾਈਨ ਟੀਮ ਨੇ ਚੁਣਿਆ ਸੀ।`,
    "STA-QL-005:1:0":`ਲਾਭ ${outcome} ਲਕਸ਼ਿਤ ਲੋਕਾਂ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ।`, "STA-QL-005:1:1":`ਦੱਸਿਆ ਲਾਭ ਲਕਸ਼ਿਤ ਸਮੂਹ ${audience} ਲਈ ਸੰਬੰਧਿਤ ਹੈ।`,
    "STA-QL-005:2:0":`ਲਕਸ਼ਿਤ ਸਮੂਹ ${audience} ਕੋਲ ਸੁਨੇਹੇ ਉੱਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਦੇਣ ਦਾ ਵਿਹਾਰਕ ਰਸਤਾ ਹੈ।`, "STA-QL-005:2:1":`ਪ੍ਰਚਾਰ ਵਿੱਚ ਦੱਸੀ ਕਾਰਵਾਈ ਲਕਸ਼ਿਤ ਸਮੂਹ ${audience} ਲਈ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਉਪਲਬਧ ਹੈ।`,
    "STA-QL-005:3:0":`ਪ੍ਰਚਾਰਿਤ ਮਾਧਿਅਮ ${channel} ਅਤੇ ਲਾਭ ${outcome} ਵਿਚਕਾਰ ਭਰੋਸੇਯੋਗ ਸੰਬੰਧ ਹੈ।`, "STA-QL-005:3:1":`ਪ੍ਰਚਾਰਿਤ ਮਾਧਿਅਮ ${channel} ਲਾਭ ${outcome} ਪੈਦਾ ਕਰਨ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`,
    "STA-QL-005:4:0":`ਲਕਸ਼ਿਤ ਲੋਕ ਪਹਿਲਾਂ ਹੀ ਇਸ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨੂੰ ਤਰਜੀਹ ਦਿੰਦੇ ਹਨ।`, "STA-QL-005:4:1":`ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨੂੰ ਪਹਿਲਾਂ ਹੀ ਲੋਕਾਂ ਦੀ ਮਜ਼ਬੂਤ ਪਸੰਦ ਪ੍ਰਾਪਤ ਹੈ।`,
    "STA-QL-005:5:0":`ਮੁਕਾਬਲੇ ਦੀਆਂ ਸੇਵਾਵਾਂ ਉਸੇ ਕੰਮ ਵਿੱਚ ਕਮਜ਼ੋਰ ਪ੍ਰਦਰਸ਼ਨ ਕਰਦੀਆਂ ਹਨ।`, "STA-QL-005:5:1":`ਵਿਕਲਪਕ ਪ੍ਰਦਾਤਾ ਇਸ ਕੰਮ ਵਿੱਚ ਕਮਜ਼ੋਰ ਨਤੀਜੇ ਦਿੰਦੇ ਹਨ।`,
    "STA-QL-005:6:0":`ਇਸ਼ਤਿਹਾਰ ਆਪਣੇ ਆਪ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਸਾਬਤ ਕਰਦਾ ਹੈ।`, "STA-QL-005:6:1":`ਸੁਨੇਹਾ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਣਾ ਗੁਣਵੱਤਾ ਦੇ ਦਾਅਵੇ ਨੂੰ ਤੱਥ ਵਜੋਂ ਸਾਬਤ ਕਰਦਾ ਹੈ।`,
    "STA-QL-005:7:0":`ਪ੍ਰਚਾਰ ਬਜਟ ਪਿਛਲੇ ਸਾਲ ਦੇ ਬਜਟ ਨਾਲੋਂ ਵੱਧ ਹੈ।`, "STA-QL-005:7:1":`ਇਸ ਪ੍ਰਚਾਰ ਮੁਹਿੰਮ ਨੂੰ ਪਿਛਲੀ ਮੁਹਿੰਮ ਨਾਲੋਂ ਵੱਡਾ ਬਜਟ ਮਿਲਿਆ।`,
    "STA-QL-006:1:0":`ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ ${metric} ਅੰਕੀ ਜਾ ਰਹੀ ਪ੍ਰਭਾਵਸ਼ੀਲਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`, "STA-QL-006:1:1":`ਚੁਣਿਆ ਮਾਪ ਦਾਅਵੇ ਵਾਲੇ ਪ੍ਰਦਰਸ਼ਨ ਦੇ ਅਰਥਪੂਰਨ ਹਿੱਸੇ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`,
    "STA-QL-006:2:0":`ਤੁਲਨਾ ਵਾਲੇ ਮਾਮਲਿਆਂ ਦਾ ਮੁਲਾਂਕਣ ਕਾਫ਼ੀ ਤੁਲਨਾਤਮਕ ਹਾਲਾਤਾਂ ਵਿੱਚ ਹੋਇਆ।`, "STA-QL-006:2:1":`ਤੁਲਨਾ ਮੁੱਢਲੇ ਤੌਰ ਤੇ ਵੱਖਰੀਆਂ ਜਾਂਚ ਹਾਲਤਾਂ ਉੱਤੇ ਆਧਾਰਿਤ ਨਹੀਂ ਹੈ।`,
    "STA-QL-006:3:0":`ਸਮੀਖਿਆ ਕੀਤਾ ਸਮੂਹ ${audience} ਦਾਅਵੇ ਦੇ ਦਾਇਰੇ ਲਈ ਢੁਕਵਾਂ ਸਬੂਤ ਦਿੰਦਾ ਹੈ।`, "STA-QL-006:3:1":`ਸਮੀਖਿਆ ਕੀਤਾ ਸਮੂਹ ਨਤੀਜੇ ਵਿੱਚ ਸ਼ਾਮਲ ਜਨਸਮੂਹ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`,
    "STA-QL-006:4:0":`ਦਖ਼ਲ ${intervention} ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਦੀ ਤੁਲਨਾ ਵਿੱਚ ਨਵਾਂ ਹੈ।`, "STA-QL-006:4:1":`ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਦਖ਼ਲ ${intervention} ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ।`,
    "STA-QL-006:5:0":`ਦਖ਼ਲ ${intervention} ਦੇ ਹੱਕ ਵਾਲੀ ਟੀਮ ਨੇ ਮਾਪਦੰਡ ਚੁਣਿਆ।`, "STA-QL-006:5:1":`ਦਖ਼ਲ ਦੇ ਸਮਰਥਕਾਂ ਨੇ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ ਚੁਣਿਆ।`,
    "STA-QL-006:6:0":`ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਦੀ ਜਨਤਕ ਸਾਖ ਕਮਜ਼ੋਰ ਹੈ।`, "STA-QL-006:6:1":`ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਬਾਰੇ ਘੱਟ ਅਨੁਕੂਲ ਰਾਏ ਹੈ।`,
    "STA-QL-006:7:0":`ਦਖ਼ਲ ਸਮੂਹ ਨੂੰ ਵੱਡਾ ਕਾਰਜਕਾਰੀ ਬਜਟ ਮਿਲਿਆ।`, "STA-QL-006:7:1":`ਦਖ਼ਲ ਸਮੂਹ ਨੂੰ ਵਧੇਰੇ ਕਾਰਜਕਾਰੀ ਫੰਡ ਦਿੱਤੇ ਗਏ।`,
  };
  const value=map[key]; if (!value) throw new Error(`${key}: missing Punjabi editorial candidate surface`); return value;
}

export function renderStaV41EditorialCandidate(
  qlId: StaV4QlId,
  candidateIndex: number,
  variantIndex: 0 | 1,
  context: StaV41Context,
  language: StaV4Language,
  originalEnglish: string,
): string {
  if (language === "en") return originalEnglish;
  return language === "hi" ? hiCandidate(qlId, candidateIndex, variantIndex, context) : paCandidate(qlId, candidateIndex, variantIndex, context);
}

export function generateStaV4Question(input: GenerateStaV4QuestionInput): StaV4Question {
  const semantic = generateStaV4SemanticQuestion(input);
  const context = contextForScenario(semantic.scenarioId);
  const sIndex = statementIndex(semantic);
  const statement = renderStaV41EditorialStatement(semantic.qlId, sIndex, context, semantic.language);
  const scenario = STA_V41_SCENARIOS.find((entry) => entry.scenarioId === semantic.scenarioId)!;
  const candidates = semantic.candidates.map((candidate) => {
    const authority = scenario.candidates.find((entry) => entry.candidateId === candidate.candidateId)!;
    const variantIndex = candidateVariantIndex(semantic, candidate.candidateId, candidate.text);
    const candidateNumber = Number(/-C(\d+)$/u.exec(candidate.candidateId)?.[1]);
    if (!Number.isInteger(candidateNumber) || candidateNumber < 1 || candidateNumber > 7) throw new Error(`${candidate.candidateId}: invalid candidate number`);
    return Object.freeze({
      ...candidate,
      text: renderStaV41EditorialCandidate(semantic.qlId, candidateNumber, variantIndex, context, semantic.language, authority.textVariants[variantIndex].en),
    });
  });
  const question = Object.freeze({ ...semantic, statement, candidates: Object.freeze(candidates) }) as StaV4Question;
  assertStaV4QuestionIntegrity(question);
  return question;
}
