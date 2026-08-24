import { STA_V41_CONTEXTS, lt, type StaV41Context } from "./exam-realness-v4-1-contexts.ts";
import type {
  StaV4CandidateAuthority,
  StaV4LocalizedText,
  StaV4QlId,
  StaV4ScenarioAuthority,
} from "./exam-realness-v4-1-types.ts";

export const STA_V4_QL_IDS = Object.freeze([
  "STA-QL-001",
  "STA-QL-002",
  "STA-QL-003",
  "STA-QL-004",
  "STA-QL-005",
  "STA-QL-006",
] as const satisfies readonly StaV4QlId[]);

export const STA_V4_SEMANTIC_AUTHORITY = Object.freeze({
  "STA-QL-001": "prerequisite / availability / capability / feasibility dependency",
  "STA-QL-002": "recommendation / policy / decision with relevant need plus efficacy",
  "STA-QL-003": "institutional notice / rule with audience relevance plus response capability",
  "STA-QL-004": "claim / prediction with a hidden causal or efficacy bridge",
  "STA-QL-005": "persuasive advertisement / appeal with audience-value and response dependency",
  "STA-QL-006": "comparison / measurement / evidence-generalisation with validity dependency",
} satisfies Readonly<Record<StaV4QlId, string>>);

export const STA_V4_CHECKPOINT_BY_QL = Object.freeze({
  "STA-QL-001": "STA-CP-001",
  "STA-QL-002": "STA-CP-001",
  "STA-QL-003": "STA-CP-002",
  "STA-QL-004": "STA-CP-002",
  "STA-QL-005": "STA-CP-003",
  "STA-QL-006": "STA-CP-004",
} as const);

type Lang = "en" | "hi" | "pa";

const pick = (value: StaV4LocalizedText, language: Lang): string => value[language];
const tx = (en: string, hi: string, pa: string): StaV4LocalizedText => lt(en, hi, pa);

function candidate(
  scenarioId: string,
  index: number,
  classification: "IMPLICIT" | "NOT_IMPLICIT",
  misconception: string,
  a: StaV4LocalizedText,
  b: StaV4LocalizedText,
  rationale: StaV4LocalizedText,
): StaV4CandidateAuthority {
  return Object.freeze({
    candidateId: `${scenarioId}-C${index}`,
    textVariants: Object.freeze([a, b]) as readonly [StaV4LocalizedText, StaV4LocalizedText],
    classification,
    misconception,
    rationale,
  });
}

function sourceAuthorityId(qlId: StaV4QlId, context: StaV41Context): string {
  if (qlId === "STA-QL-005") {
    if (context.sourceProfile === "SSC") return "STA-EXT-SRC-001";
    if (context.sourceProfile === "BANKING") return "STA-EXT-SRC-002";
    if (context.sourceProfile === "PUNJAB_STATE") return "STA-EXT-SRC-009";
    return "STA-EXT-SRC-010";
  }
  if (qlId === "STA-QL-006") {
    if (context.sourceProfile === "SSC") return "STA-EXT-SRC-006";
    if (context.sourceProfile === "BANKING") return "STA-EXT-SRC-007";
    if (context.sourceProfile === "PUNJAB_STATE") return "STA-EXT-SRC-009";
    return "STA-EXT-SRC-010";
  }
  return `STA-V41-CORE-${context.sourceProfile}`;
}

function ql001(context: StaV41Context): StaV4ScenarioAuthority {
  const scenarioId = `STA-V41-QL001-${context.id}`;
  const c = context;
  return Object.freeze({
    scenarioId,
    qlId: "STA-QL-001",
    checkpointId: "STA-CP-001",
    sourceProfile: c.sourceProfile,
    difficulty: c.difficulty,
    discourseAct: "INSTRUCTION",
    domain: c.domain,
    statementVariants: Object.freeze([
      tx(`Use ${pick(c.channel, "en")} for ${pick(c.task, "en")}.`, `${pick(c.task, "hi")} के लिए ${pick(c.channel, "hi")} का उपयोग करें।`, `${pick(c.task, "pa")} ਲਈ ${pick(c.channel, "pa")} ਦੀ ਵਰਤੋਂ ਕਰੋ।`),
      tx(`${pick(c.actor, "en")} are instructed to complete ${pick(c.task, "en")} through ${pick(c.channel, "en")}.`, `${pick(c.actor, "hi")} को ${pick(c.task, "hi")} ${pick(c.channel, "hi")} के माध्यम से पूरा करने का निर्देश है।`, `${pick(c.actor, "pa")} ਨੂੰ ${pick(c.task, "pa")} ${pick(c.channel, "pa")} ਰਾਹੀਂ ਪੂਰਾ ਕਰਨ ਦੀ ਹਦਾਇਤ ਹੈ।`),
      tx(`For ${pick(c.task, "en")}, the stated service route is ${pick(c.channel, "en")}.`, `${pick(c.task, "hi")} के लिए निर्धारित सेवा माध्यम ${pick(c.channel, "hi")} है।`, `${pick(c.task, "pa")} ਲਈ ਨਿਰਧਾਰਤ ਸੇਵਾ ਮਾਧਿਅਮ ${pick(c.channel, "pa")} ਹੈ।`),
    ]) as readonly [StaV4LocalizedText, StaV4LocalizedText, StaV4LocalizedText],
    candidates: Object.freeze([
      candidate(scenarioId, 1, "IMPLICIT", "REQUIRED_CAPABILITY",
        tx(`${pick(c.channel, "en")} supports ${pick(c.task, "en")}.`, `${pick(c.channel, "hi")} ${pick(c.task, "hi")} की सुविधा देता है।`, `${pick(c.channel, "pa")} ${pick(c.task, "pa")} ਦੀ ਸਹੂਲਤ ਦਿੰਦਾ ਹੈ।`),
        tx(`${pick(c.task, "en")} is supported through ${pick(c.channel, "en")}.`, `${pick(c.task, "hi")} ${pick(c.channel, "hi")} के जरिए किया जाता है।`, `${pick(c.task, "pa")} ${pick(c.channel, "pa")} ਰਾਹੀਂ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`),
        tx("The named route must perform the task required by the instruction.", "निर्देश में बताए माध्यम को आवश्यक कार्य करना ही होगा।", "ਹਦਾਇਤ ਵਿੱਚ ਦੱਸਿਆ ਮਾਧਿਅਮ ਲੋੜੀਂਦਾ ਕੰਮ ਕਰਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।")),
      candidate(scenarioId, 2, "IMPLICIT", "REQUIRED_ACCESS",
        tx(`${pick(c.actor, "en")} have practical access to ${pick(c.channel, "en")}.`, `${pick(c.actor, "hi")} की ${pick(c.channel, "hi")} तक व्यावहारिक पहुंच है।`, `${pick(c.actor, "pa")} ਦੀ ${pick(c.channel, "pa")} ਤੱਕ ਵਿਹਾਰਕ ਪਹੁੰਚ ਹੈ।`),
        tx(`${pick(c.channel, "en")} is accessible to ${pick(c.actor, "en")}.`, `${pick(c.channel, "hi")} ${pick(c.actor, "hi")} के लिए सुलभ है।`, `${pick(c.channel, "pa")} ${pick(c.actor, "pa")} ਲਈ ਪਹੁੰਚਯੋਗ ਹੈ।`),
        tx("An instruction using a named route depends on the intended users having practical access to it.", "बताए माध्यम के उपयोग का निर्देश तभी सार्थक है जब लक्षित उपयोगकर्ताओं की उस तक व्यावहारिक पहुंच हो।", "ਦੱਸੇ ਮਾਧਿਅਮ ਦੀ ਹਦਾਇਤ ਲਈ ਲਕਸ਼ਿਤ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਉਸ ਤੱਕ ਵਿਹਾਰਕ ਪਹੁੰਚ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 3, "IMPLICIT", "REQUIRED_AVAILABILITY",
        tx(`${pick(c.channel, "en")} remains available during the relevant service period.`, `${pick(c.channel, "hi")} संबंधित सेवा अवधि में उपलब्ध रहता है।`, `${pick(c.channel, "pa")} ਸੰਬੰਧਿਤ ਸੇਵਾ ਸਮੇਂ ਦੌਰਾਨ ਉਪਲਬਧ ਰਹਿੰਦਾ ਹੈ।`),
        tx(`The relevant service period includes access to ${pick(c.channel, "en")}.`, `संबंधित सेवा अवधि में ${pick(c.channel, "hi")} तक पहुंच उपलब्ध है।`, `ਸੰਬੰਧਿਤ ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ${pick(c.channel, "pa")} ਤੱਕ ਪਹੁੰਚ ਉਪਲਬਧ ਹੈ।`),
        tx("The prescribed route must be available when the instruction is meant to operate.", "निर्देश लागू होने के समय निर्धारित माध्यम उपलब्ध होना आवश्यक है।", "ਹਦਾਇਤ ਲਾਗੂ ਹੋਣ ਵੇਲੇ ਨਿਰਧਾਰਤ ਮਾਧਿਅਮ ਉਪਲਬਧ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 4, "NOT_IMPLICIT", "CONVENIENCE_NOT_REQUIRED",
        tx(`${pick(c.channel, "en")} is more convenient than the previous method.`, `${pick(c.channel, "hi")} पिछली विधि से अधिक सुविधाजनक है।`, `${pick(c.channel, "pa")} ਪਿਛਲੇ ਤਰੀਕੇ ਨਾਲੋਂ ਵਧੇਰੇ ਸੁਵਿਧਾਜਨਕ ਹੈ।`),
        tx(`The previous method is less convenient than ${pick(c.channel, "en")}.`, `पिछली विधि ${pick(c.channel, "hi")} से कम सुविधाजनक है।`, `ਪਿਛਲਾ ਤਰੀਕਾ ${pick(c.channel, "pa")} ਨਾਲੋਂ ਘੱਟ ਸੁਵਿਧਾਜਨਕ ਹੈ।`),
        tx("Convenience ranking is not required for the named route to work.", "माध्यम के काम करने के लिए सुविधाजनक होने की तुलना आवश्यक नहीं है।", "ਮਾਧਿਅਮ ਦੇ ਕੰਮ ਕਰਨ ਲਈ ਸੁਵਿਧਾ ਦੀ ਤੁਲਨਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 5, "NOT_IMPLICIT", "PREFERENCE_NOT_REQUIRED",
        tx(`Users generally prefer ${pick(c.channel, "en")} for this task.`, `उपयोगकर्ता सामान्यतः इस कार्य के लिए ${pick(c.channel, "hi")} को पसंद करते हैं।`, `ਵਰਤੋਂਕਾਰ ਆਮ ਤੌਰ ਤੇ ਇਸ ਕੰਮ ਲਈ ${pick(c.channel, "pa")} ਨੂੰ ਤਰਜੀਹ ਦਿੰਦੇ ਹਨ।`),
        tx(`${pick(c.channel, "en")} is a popular route for this task.`, `${pick(c.channel, "hi")} इस कार्य के लिए लोकप्रिय माध्यम है।`, `${pick(c.channel, "pa")} ਇਸ ਕੰਮ ਲਈ ਲੋਕਪ੍ਰਿਯ ਮਾਧਿਅਮ ਹੈ।`),
        tx("User preference is not a prerequisite for following an instruction.", "निर्देश का पालन करने के लिए उपयोगकर्ता की पसंद पूर्वशर्त नहीं है।", "ਹਦਾਇਤ ਮੰਨਣ ਲਈ ਵਰਤੋਂਕਾਰ ਦੀ ਪਸੰਦ ਪੂਰਵ-ਸ਼ਰਤ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 6, "NOT_IMPLICIT", "CAUSE_OVERREACH",
        tx(`${pick(c.issue, "en")} is mainly caused by weak staff training.`, `${pick(c.issue, "hi")} मुख्यतः कमजोर कर्मचारी प्रशिक्षण के कारण है।`, `${pick(c.issue, "pa")} ਮੁੱਖ ਤੌਰ ਤੇ ਕਮਜ਼ੋਰ ਸਟਾਫ਼ ਤਰਬੀਅਤ ਕਾਰਨ ਹੈ।`),
        tx(`Weak staff training is the principal source of ${pick(c.issue, "en")}.`, `कमजोर कर्मचारी प्रशिक्षण ${pick(c.issue, "hi")} का प्रमुख स्रोत है।`, `ਕਮਜ਼ੋਰ ਸਟਾਫ਼ ਤਰਬੀਅਤ ${pick(c.issue, "pa")} ਦਾ ਮੁੱਖ ਸਰੋਤ ਹੈ।`),
        tx("The instruction does not require a diagnosis of the wider service problem.", "निर्देश के लिए व्यापक सेवा समस्या के कारण का निदान आवश्यक नहीं है।", "ਹਦਾਇਤ ਲਈ ਵੱਡੀ ਸੇਵਾ ਸਮੱਸਿਆ ਦੇ ਕਾਰਨ ਦੀ ਪਛਾਣ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 7, "NOT_IMPLICIT", "HISTORY_NOT_REQUIRED",
        tx(`${pick(c.channel, "en")} was introduced recently.`, `${pick(c.channel, "hi")} हाल में शुरू किया गया था।`, `${pick(c.channel, "pa")} ਹਾਲ ਹੀ ਵਿੱਚ ਸ਼ੁਰੂ ਕੀਤਾ ਗਿਆ ਸੀ।`),
        tx(`The service recently added ${pick(c.channel, "en")}.`, `सेवा में हाल में ${pick(c.channel, "hi")} जोड़ा गया।`, `ਸੇਵਾ ਵਿੱਚ ਹਾਲ ਹੀ ਵਿੱਚ ${pick(c.channel, "pa")} ਜੋੜਿਆ ਗਿਆ।`),
        tx("The age of the route has no bearing on whether the instruction depends on it.", "माध्यम कितना पुराना है, इससे निर्देश की निर्भरता तय नहीं होती।", "ਮਾਧਿਅਮ ਕਿੰਨਾ ਪੁਰਾਣਾ ਹੈ, ਇਸ ਨਾਲ ਹਦਾਇਤ ਦੀ ਨਿਰਭਰਤਾ ਤੈਅ ਨਹੀਂ ਹੁੰਦੀ।")),
    ]) as StaV4ScenarioAuthority["candidates"],
    sourceAuthorityId: sourceAuthorityId("STA-QL-001", c),
  });
}

function ql002(context: StaV41Context): StaV4ScenarioAuthority {
  const scenarioId = `STA-V41-QL002-${context.id}`;
  const c = context;
  return Object.freeze({
    scenarioId, qlId: "STA-QL-002", checkpointId: "STA-CP-001", sourceProfile: c.sourceProfile, difficulty: c.difficulty, discourseAct: "RECOMMENDATION", domain: c.domain,
    statementVariants: Object.freeze([
      tx(`To address ${pick(c.issue, "en")}, the service should introduce ${pick(c.intervention, "en")}.`, `${pick(c.issue, "hi")} से निपटने के लिए सेवा को ${pick(c.intervention, "hi")} शुरू करना चाहिए।`, `${pick(c.issue, "pa")} ਨਾਲ ਨਿਪਟਣ ਲਈ ਸੇਵਾ ਨੂੰ ${pick(c.intervention, "pa")} ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।`),
      tx(`The administration recommends ${pick(c.intervention, "en")} as a response to ${pick(c.issue, "en")}.`, `प्रशासन ${pick(c.issue, "hi")} के समाधान के रूप में ${pick(c.intervention, "hi")} की सिफारिश करता है।`, `ਪ੍ਰਸ਼ਾਸਨ ${pick(c.issue, "pa")} ਦੇ ਹੱਲ ਵਜੋਂ ${pick(c.intervention, "pa")} ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹੈ।`),
      tx(`${pick(c.intervention, "en")} is proposed with the aim of achieving ${pick(c.outcome, "en")}.`, `${pick(c.outcome, "hi")} हासिल करने के उद्देश्य से ${pick(c.intervention, "hi")} का प्रस्ताव है।`, `${pick(c.outcome, "pa")} ਹਾਸਲ ਕਰਨ ਦੇ ਉਦੇਸ਼ ਨਾਲ ${pick(c.intervention, "pa")} ਦਾ ਪ੍ਰਸਤਾਵ ਹੈ।`),
    ]) as readonly [StaV4LocalizedText, StaV4LocalizedText, StaV4LocalizedText],
    candidates: Object.freeze([
      candidate(scenarioId, 1, "IMPLICIT", "REQUIRED_NEED",
        tx(`${pick(c.issue, "en")} warrants an operational response.`, `${pick(c.issue, "hi")} के लिए परिचालन प्रतिक्रिया उचित है।`, `${pick(c.issue, "pa")} ਲਈ ਕਾਰਜਕਾਰੀ ਜਵਾਬ ਵਾਜਬ ਹੈ।`),
        tx(`The service has a meaningful reason to address ${pick(c.issue, "en")}.`, `सेवा के पास ${pick(c.issue, "hi")} को संबोधित करने का सार्थक कारण है।`, `ਸੇਵਾ ਕੋਲ ${pick(c.issue, "pa")} ਨੂੰ ਹੱਲ ਕਰਨ ਦਾ ਵਾਜਬ ਕਾਰਨ ਹੈ।`),
        tx("A recommendation presupposes that the targeted problem merits action.", "सिफारिश यह मानती है कि लक्षित समस्या पर कार्रवाई का कारण है।", "ਸਿਫਾਰਸ਼ ਇਹ ਮੰਨਦੀ ਹੈ ਕਿ ਨਿਸ਼ਾਨਾ ਸਮੱਸਿਆ ਉੱਤੇ ਕਾਰਵਾਈ ਦਾ ਕਾਰਨ ਹੈ।")),
      candidate(scenarioId, 2, "IMPLICIT", "REQUIRED_FEASIBILITY",
        tx(`${pick(c.intervention, "en")} is operationally feasible in this setting.`, `${pick(c.intervention, "hi")} इस व्यवस्था में परिचालन रूप से व्यवहार्य है।`, `${pick(c.intervention, "pa")} ਇਸ ਪ੍ਰਬੰਧ ਵਿੱਚ ਕਾਰਜਕਾਰੀ ਤੌਰ ਤੇ ਸੰਭਵ ਹੈ।`),
        tx(`The service has a workable route to implement ${pick(c.intervention, "en")}.`, `सेवा के पास ${pick(c.intervention, "hi")} लागू करने का व्यावहारिक मार्ग है।`, `ਸੇਵਾ ਕੋਲ ${pick(c.intervention, "pa")} ਲਾਗੂ ਕਰਨ ਦਾ ਵਿਹਾਰਕ ਰਸਤਾ ਹੈ।`),
        tx("Recommending an action depends on there being a workable way to carry it out.", "किसी कार्रवाई की सिफारिश उसके व्यावहारिक क्रियान्वयन पर निर्भर करती है।", "ਕਿਸੇ ਕਾਰਵਾਈ ਦੀ ਸਿਫਾਰਸ਼ ਉਸ ਦੇ ਵਿਹਾਰਕ ਲਾਗੂ ਹੋਣ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।")),
      candidate(scenarioId, 3, "IMPLICIT", "REQUIRED_EFFICACY",
        tx(`${pick(c.intervention, "en")} has a credible mechanism linked to ${pick(c.outcome, "en")}.`, `${pick(c.intervention, "hi")} का ${pick(c.outcome, "hi")} से जुड़ा विश्वसनीय तंत्र है।`, `${pick(c.intervention, "pa")} ਦਾ ${pick(c.outcome, "pa")} ਨਾਲ ਜੁੜਿਆ ਭਰੋਸੇਯੋਗ ਤਰੀਕਾ ਹੈ।`),
        tx(`There is a reasonable connection between ${pick(c.intervention, "en")} and ${pick(c.outcome, "en")}.`, `${pick(c.intervention, "hi")} और ${pick(c.outcome, "hi")} के बीच उचित संबंध है।`, `${pick(c.intervention, "pa")} ਅਤੇ ${pick(c.outcome, "pa")} ਵਿਚਕਾਰ ਵਾਜਬ ਸੰਬੰਧ ਹੈ।`),
        tx("The proposal relies on a credible route from the intervention to its intended result.", "प्रस्ताव हस्तक्षेप से इच्छित परिणाम तक विश्वसनीय संबंध पर निर्भर करता है।", "ਪ੍ਰਸਤਾਵ ਦਖ਼ਲ ਤੋਂ ਚਾਹੇ ਨਤੀਜੇ ਤੱਕ ਭਰੋਸੇਯੋਗ ਸੰਬੰਧ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।")),
      candidate(scenarioId, 4, "NOT_IMPLICIT", "COST_RANKING_NOT_REQUIRED",
        tx(`${pick(c.intervention, "en")} costs less than the current process.`, `${pick(c.intervention, "hi")} की लागत मौजूदा प्रक्रिया से कम है।`, `${pick(c.intervention, "pa")} ਦੀ ਲਾਗਤ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਨਾਲੋਂ ਘੱਟ ਹੈ।`),
        tx(`The current process is more expensive than ${pick(c.intervention, "en")}.`, `मौजूदा प्रक्रिया ${pick(c.intervention, "hi")} से अधिक महंगी है।`, `ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ${pick(c.intervention, "pa")} ਨਾਲੋਂ ਵਧੇਰੇ ਮਹਿੰਗੀ ਹੈ।`),
        tx("The recommendation need not rest on a cost ranking unless cost is the stated reason.", "जब लागत कारण के रूप में नहीं दी गई है तब लागत तुलना आवश्यक नहीं है।", "ਜਦੋਂ ਲਾਗਤ ਕਾਰਨ ਵਜੋਂ ਨਹੀਂ ਦਿੱਤੀ ਗਈ ਤਾਂ ਲਾਗਤ ਦੀ ਤੁਲਨਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 5, "NOT_IMPLICIT", "POPULARITY_NOT_REQUIRED",
        tx(`Staff members already favour ${pick(c.intervention, "en")}.`, `कर्मचारी पहले से ${pick(c.intervention, "hi")} के पक्ष में हैं।`, `ਸਟਾਫ਼ ਪਹਿਲਾਂ ਹੀ ${pick(c.intervention, "pa")} ਦੇ ਹੱਕ ਵਿੱਚ ਹੈ।`),
        tx(`${pick(c.intervention, "en")} is popular with the operating team.`, `${pick(c.intervention, "hi")} परिचालन दल में लोकप्रिय है।`, `${pick(c.intervention, "pa")} ਕਾਰਜਕਾਰੀ ਟੀਮ ਵਿੱਚ ਲੋਕਪ੍ਰਿਯ ਹੈ।`),
        tx("Staff popularity is not necessary for the recommendation's logic.", "कर्मचारियों की पसंद सिफारिश के तर्क के लिए आवश्यक नहीं है।", "ਸਟਾਫ਼ ਦੀ ਪਸੰਦ ਸਿਫਾਰਸ਼ ਦੇ ਤਰਕ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 6, "NOT_IMPLICIT", "CAUSE_OVERREACH",
        tx(`${pick(c.issue, "en")} arises mainly from weak supervision.`, `${pick(c.issue, "hi")} मुख्यतः कमजोर निगरानी से उत्पन्न होती है।`, `${pick(c.issue, "pa")} ਮੁੱਖ ਤੌਰ ਤੇ ਕਮਜ਼ੋਰ ਨਿਗਰਾਨੀ ਕਾਰਨ ਪੈਦਾ ਹੁੰਦੀ ਹੈ।`),
        tx(`Weak supervision is the principal driver of ${pick(c.issue, "en")}.`, `कमजोर निगरानी ${pick(c.issue, "hi")} का प्रमुख कारण है।`, `ਕਮਜ਼ੋਰ ਨਿਗਰਾਨੀ ${pick(c.issue, "pa")} ਦਾ ਮੁੱਖ ਕਾਰਨ ਹੈ।`),
        tx("The proposed remedy does not require this particular diagnosis of the problem.", "प्रस्तावित उपाय के लिए समस्या का यही कारण मानना आवश्यक नहीं है।", "ਪ੍ਰਸਤਾਵਿਤ ਹੱਲ ਲਈ ਸਮੱਸਿਆ ਦਾ ਇਹੀ ਕਾਰਨ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 7, "NOT_IMPLICIT", "EXTERNAL_EXAMPLE_NOT_REQUIRED",
        tx(`A neighbouring office uses a similar intervention.`, `पड़ोसी कार्यालय इसी तरह का हस्तक्षेप उपयोग करता है।`, `ਨੇੜਲਾ ਦਫ਼ਤਰ ਇਸੇ ਤਰ੍ਹਾਂ ਦਾ ਦਖ਼ਲ ਵਰਤਦਾ ਹੈ।`),
        tx(`A comparable organisation has adopted a similar measure.`, `एक तुलनीय संस्था ने इसी तरह का उपाय अपनाया है।`, `ਇੱਕ ਤੁਲਨਾਤਮਕ ਸੰਸਥਾ ਨੇ ਇਸੇ ਤਰ੍ਹਾਂ ਦਾ ਉਪਾਅ ਅਪਣਾਇਆ ਹੈ।`),
        tx("External adoption may support a proposal but is not required for its stated rationale.", "दूसरी संस्था का उदाहरण सहायक हो सकता है, पर सिफारिश की आवश्यक पूर्वधारणा नहीं है।", "ਦੂਜੀ ਸੰਸਥਾ ਦਾ ਉਦਾਹਰਨ ਸਹਾਇਕ ਹੋ ਸਕਦਾ ਹੈ ਪਰ ਸਿਫਾਰਸ਼ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ ਹੈ।")),
    ]) as StaV4ScenarioAuthority["candidates"],
    sourceAuthorityId: sourceAuthorityId("STA-QL-002", c),
  });
}

function ql003(context: StaV41Context): StaV4ScenarioAuthority {
  const scenarioId = `STA-V41-QL003-${context.id}`;
  const c = context;
  return Object.freeze({
    scenarioId, qlId: "STA-QL-003", checkpointId: "STA-CP-002", sourceProfile: c.sourceProfile, difficulty: c.difficulty, discourseAct: "NOTICE", domain: c.domain,
    statementVariants: Object.freeze([
      tx(`Notice: ${pick(c.audience, "en")} should use ${pick(c.channel, "en")} for ${pick(c.task, "en")}.`, `सूचना: ${pick(c.audience, "hi")} ${pick(c.task, "hi")} के लिए ${pick(c.channel, "hi")} का उपयोग करें।`, `ਸੂਚਨਾ: ${pick(c.audience, "pa")} ${pick(c.task, "pa")} ਲਈ ${pick(c.channel, "pa")} ਦੀ ਵਰਤੋਂ ਕਰਨ।`),
      tx(`The service directs ${pick(c.audience, "en")} to route ${pick(c.task, "en")} through ${pick(c.channel, "en")}.`, `सेवा ${pick(c.audience, "hi")} को ${pick(c.task, "hi")} ${pick(c.channel, "hi")} के माध्यम से करने का निर्देश देती है।`, `ਸੇਵਾ ${pick(c.audience, "pa")} ਨੂੰ ${pick(c.task, "pa")} ${pick(c.channel, "pa")} ਰਾਹੀਂ ਕਰਨ ਦੀ ਹਦਾਇਤ ਦਿੰਦੀ ਹੈ।`),
      tx(`An official notice designates ${pick(c.channel, "en")} for ${pick(c.task, "en")}.`, `आधिकारिक सूचना में ${pick(c.task, "hi")} के लिए ${pick(c.channel, "hi")} निर्धारित है।`, `ਅਧਿਕਾਰਕ ਸੂਚਨਾ ਵਿੱਚ ${pick(c.task, "pa")} ਲਈ ${pick(c.channel, "pa")} ਨਿਰਧਾਰਤ ਹੈ।`),
    ]) as readonly [StaV4LocalizedText, StaV4LocalizedText, StaV4LocalizedText],
    candidates: Object.freeze([
      candidate(scenarioId, 1, "IMPLICIT", "REQUIRED_CHANNEL_FUNCTION",
        tx(`${pick(c.channel, "en")} accepts requests for ${pick(c.task, "en")}.`, `${pick(c.channel, "hi")} ${pick(c.task, "hi")} से जुड़े अनुरोध स्वीकार करता है।`, `${pick(c.channel, "pa")} ${pick(c.task, "pa")} ਨਾਲ ਜੁੜੀਆਂ ਬੇਨਤੀਆਂ ਸਵੀਕਾਰ ਕਰਦਾ ਹੈ।`),
        tx(`${pick(c.task, "en")} is processed through ${pick(c.channel, "en")}.`, `${pick(c.task, "hi")} ${pick(c.channel, "hi")} के माध्यम से संसाधित होता है।`, `${pick(c.task, "pa")} ${pick(c.channel, "pa")} ਰਾਹੀਂ ਕਾਰਵਾਈ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`),
        tx("The notice depends on the designated channel actually handling the directed task.", "सूचना इस बात पर निर्भर है कि निर्धारित माध्यम निर्देशित कार्य को संभालता हो।", "ਸੂਚਨਾ ਇਸ ਗੱਲ ਉੱਤੇ ਨਿਰਭਰ ਹੈ ਕਿ ਨਿਰਧਾਰਤ ਮਾਧਿਅਮ ਦੱਸਿਆ ਕੰਮ ਸੰਭਾਲਦਾ ਹੋਵੇ।")),
      candidate(scenarioId, 2, "IMPLICIT", "REQUIRED_AUDIENCE_ACCESS",
        tx(`${pick(c.audience, "en")} have practical access to ${pick(c.channel, "en")}.`, `${pick(c.audience, "hi")} की ${pick(c.channel, "hi")} तक व्यावहारिक पहुंच है।`, `${pick(c.audience, "pa")} ਦੀ ${pick(c.channel, "pa")} ਤੱਕ ਵਿਹਾਰਕ ਪਹੁੰਚ ਹੈ।`),
        tx(`${pick(c.channel, "en")} is practically accessible to ${pick(c.audience, "en")}.`, `${pick(c.channel, "hi")} ${pick(c.audience, "hi")} के लिए व्यावहारिक रूप से सुलभ है।`, `${pick(c.channel, "pa")} ${pick(c.audience, "pa")} ਲਈ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਪਹੁੰਚਯੋਗ ਹੈ।`),
        tx("A service direction presupposes practical access for the audience it addresses.", "सेवा निर्देश लक्षित लोगों की व्यावहारिक पहुंच पर निर्भर करता है।", "ਸੇਵਾ ਹਦਾਇਤ ਲਕਸ਼ਿਤ ਲੋਕਾਂ ਦੀ ਵਿਹਾਰਕ ਪਹੁੰਚ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।")),
      candidate(scenarioId, 3, "IMPLICIT", "REQUIRED_ADMIN_PURPOSE",
        tx(`Using ${pick(c.channel, "en")} serves the administrative purpose behind the notice.`, `${pick(c.channel, "hi")} का उपयोग सूचना के प्रशासनिक उद्देश्य को पूरा करता है।`, `${pick(c.channel, "pa")} ਦੀ ਵਰਤੋਂ ਸੂਚਨਾ ਦੇ ਪ੍ਰਸ਼ਾਸਕੀ ਉਦੇਸ਼ ਨੂੰ ਪੂਰਾ ਕਰਦੀ ਹੈ।`),
        tx(`The designated route is relevant to the purpose of the service direction.`, `निर्धारित माध्यम सेवा निर्देश के उद्देश्य से संबंधित है।`, `ਨਿਰਧਾਰਤ ਮਾਧਿਅਮ ਸੇਵਾ ਹਦਾਇਤ ਦੇ ਉਦੇਸ਼ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`),
        tx("The notice must have a relevant administrative reason for directing users to that route.", "सूचना में उस माध्यम की ओर निर्देशित करने का प्रासंगिक प्रशासनिक कारण होना चाहिए।", "ਸੂਚਨਾ ਵਿੱਚ ਉਸ ਮਾਧਿਅਮ ਵੱਲ ਦਿਸ਼ਾ ਦੇਣ ਦਾ ਸੰਬੰਧਿਤ ਪ੍ਰਸ਼ਾਸਕੀ ਕਾਰਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।")),
      candidate(scenarioId, 4, "NOT_IMPLICIT", "POPULARITY_NOT_REQUIRED",
        tx(`${pick(c.channel, "en")} is more popular than in-person service.`, `${pick(c.channel, "hi")} प्रत्यक्ष सेवा से अधिक लोकप्रिय है।`, `${pick(c.channel, "pa")} ਸਿੱਧੀ ਸੇਵਾ ਨਾਲੋਂ ਵਧੇਰੇ ਲੋਕਪ੍ਰਿਯ ਹੈ।`),
        tx(`Users prefer ${pick(c.channel, "en")} to visiting the office.`, `उपयोगकर्ता कार्यालय जाने की बजाय ${pick(c.channel, "hi")} पसंद करते हैं।`, `ਵਰਤੋਂਕਾਰ ਦਫ਼ਤਰ ਜਾਣ ਦੀ ਥਾਂ ${pick(c.channel, "pa")} ਨੂੰ ਤਰਜੀਹ ਦਿੰਦੇ ਹਨ।`),
        tx("Popularity is not necessary for an official service direction.", "आधिकारिक निर्देश के लिए लोकप्रियता आवश्यक नहीं है।", "ਅਧਿਕਾਰਕ ਹਦਾਇਤ ਲਈ ਲੋਕਪ੍ਰਿਯਤਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 5, "NOT_IMPLICIT", "HISTORY_NOT_REQUIRED",
        tx(`The notice followed a recent complaint.`, `सूचना हाल की शिकायत के बाद जारी हुई।`, `ਸੂਚਨਾ ਹਾਲ ਦੀ ਸ਼ਿਕਾਇਤ ਤੋਂ ਬਾਅਦ ਜਾਰੀ ਹੋਈ।`),
        tx(`A complaint prompted the administration to issue the notice.`, `एक शिकायत ने प्रशासन को सूचना जारी करने के लिए प्रेरित किया।`, `ਇੱਕ ਸ਼ਿਕਾਇਤ ਨੇ ਪ੍ਰਸ਼ਾਸਨ ਨੂੰ ਸੂਚਨਾ ਜਾਰੀ ਕਰਨ ਲਈ ਪ੍ਰੇਰਿਆ।`),
        tx("The origin story of the notice is not required by its operational direction.", "सूचना किस घटना के बाद आई, यह उसके निर्देश की आवश्यक पूर्वधारणा नहीं है।", "ਸੂਚਨਾ ਕਿਸ ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਆਈ, ਇਹ ਉਸ ਦੀ ਹਦਾਇਤ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 6, "NOT_IMPLICIT", "DEMAND_FORECAST_NOT_REQUIRED",
        tx(`Staff expect record demand next month.`, `कर्मचारियों को अगले महीने बहुत अधिक मांग की आशा है।`, `ਸਟਾਫ਼ ਨੂੰ ਅਗਲੇ ਮਹੀਨੇ ਬਹੁਤ ਵੱਧ ਮੰਗ ਦੀ ਉਮੀਦ ਹੈ।`),
        tx(`The service expects unusually high demand in the next period.`, `सेवा को अगली अवधि में असामान्य रूप से अधिक मांग की आशा है।`, `ਸੇਵਾ ਨੂੰ ਅਗਲੇ ਸਮੇਂ ਵਿੱਚ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਵੱਧ ਮੰਗ ਦੀ ਉਮੀਦ ਹੈ।`),
        tx("A demand forecast is not necessary unless the notice gives it as the reason.", "जब सूचना में मांग को कारण नहीं बताया गया है तब मांग का अनुमान आवश्यक नहीं है।", "ਜਦੋਂ ਸੂਚਨਾ ਵਿੱਚ ਮੰਗ ਨੂੰ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ ਤਾਂ ਮੰਗ ਦਾ ਅਨੁਮਾਨ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 7, "NOT_IMPLICIT", "VALUE_JUDGEMENT_NOT_REQUIRED",
        tx(`The previous process was poorly designed.`, `पिछली प्रक्रिया का डिज़ाइन कमजोर था।`, `ਪਿਛਲੀ ਪ੍ਰਕਿਰਿਆ ਦੀ ਬਣਤਰ ਕਮਜ਼ੋਰ ਸੀ।`),
        tx(`The earlier service route had a weak design.`, `पहले सेवा माध्यम की रूपरेखा कमजोर थी।`, `ਪਹਿਲੇ ਸੇਵਾ ਮਾਧਿਅਮ ਦੀ ਬਣਤਰ ਕਮਜ਼ੋਰ ਸੀ।`),
        tx("The notice need not condemn the previous process in order to direct a current response.", "वर्तमान निर्देश के लिए पिछली प्रक्रिया को खराब मानना आवश्यक नहीं है।", "ਮੌਜੂਦਾ ਹਦਾਇਤ ਲਈ ਪਿਛਲੀ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮਾੜਾ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
    ]) as StaV4ScenarioAuthority["candidates"],
    sourceAuthorityId: sourceAuthorityId("STA-QL-003", c),
  });
}

function ql004(context: StaV41Context): StaV4ScenarioAuthority {
  const scenarioId = `STA-V41-QL004-${context.id}`;
  const c = context;
  return Object.freeze({
    scenarioId, qlId: "STA-QL-004", checkpointId: "STA-CP-002", sourceProfile: c.sourceProfile, difficulty: c.difficulty, discourseAct: "PREDICTION", domain: c.domain,
    statementVariants: Object.freeze([
      tx(`Introducing ${pick(c.intervention, "en")} is expected to produce ${pick(c.outcome, "en")} by addressing ${pick(c.issue, "en")}.`, `${pick(c.intervention, "hi")} शुरू करने से ${pick(c.issue, "hi")} पर असर पड़कर ${pick(c.outcome, "hi")} होने की संभावना बताई गई है।`, `${pick(c.intervention, "pa")} ਸ਼ੁਰੂ ਕਰਨ ਨਾਲ ${pick(c.issue, "pa")} ਉੱਤੇ ਅਸਰ ਪੈ ਕੇ ${pick(c.outcome, "pa")} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਦੱਸੀ ਗਈ ਹੈ।`),
      tx(`The service predicts ${pick(c.outcome, "en")} after adopting ${pick(c.intervention, "en")}.`, `सेवा ${pick(c.intervention, "hi")} अपनाने के बाद ${pick(c.outcome, "hi")} का अनुमान लगाती है।`, `ਸੇਵਾ ${pick(c.intervention, "pa")} ਅਪਣਾਉਣ ਤੋਂ ਬਾਅਦ ${pick(c.outcome, "pa")} ਦਾ ਅਨੁਮਾਨ ਲਗਾਉਂਦੀ ਹੈ।`),
      tx(`A projected improvement in ${pick(c.outcome, "en")} is linked to ${pick(c.intervention, "en")}.`, `${pick(c.outcome, "hi")} में अनुमानित सुधार को ${pick(c.intervention, "hi")} से जोड़ा गया है।`, `${pick(c.outcome, "pa")} ਵਿੱਚ ਅਨੁਮਾਨਿਤ ਸੁਧਾਰ ਨੂੰ ${pick(c.intervention, "pa")} ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।`),
    ]) as readonly [StaV4LocalizedText, StaV4LocalizedText, StaV4LocalizedText],
    candidates: Object.freeze([
      candidate(scenarioId, 1, "IMPLICIT", "REQUIRED_CAUSAL_RELEVANCE",
        tx(`${pick(c.intervention, "en")} addresses a factor connected with ${pick(c.issue, "en")}.`, `${pick(c.intervention, "hi")} ${pick(c.issue, "hi")} से जुड़े कारक को संबोधित करता है।`, `${pick(c.intervention, "pa")} ${pick(c.issue, "pa")} ਨਾਲ ਜੁੜੇ ਕਾਰਕ ਨੂੰ ਹੱਲ ਕਰਦਾ ਹੈ।`),
        tx(`There is a relevant causal route from ${pick(c.intervention, "en")} to the stated problem.`, `${pick(c.intervention, "hi")} से बताई समस्या तक प्रासंगिक कारण-मार्ग है।`, `${pick(c.intervention, "pa")} ਤੋਂ ਦੱਸੀ ਸਮੱਸਿਆ ਤੱਕ ਸੰਬੰਧਿਤ ਕਾਰਨ-ਰਸਤਾ ਹੈ।`),
        tx("The prediction requires the intervention to affect something relevant to the problem.", "अनुमान के लिए हस्तक्षेप का समस्या से संबंधित कारक पर असर होना आवश्यक है।", "ਅਨੁਮਾਨ ਲਈ ਦਖ਼ਲ ਦਾ ਸਮੱਸਿਆ ਨਾਲ ਸੰਬੰਧਿਤ ਕਾਰਕ ਉੱਤੇ ਅਸਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 2, "IMPLICIT", "REQUIRED_EFFECT_LINK",
        tx(`${pick(c.intervention, "en")}'s effect is relevant to ${pick(c.outcome, "en")}.`, `${pick(c.intervention, "hi")} का प्रभाव ${pick(c.outcome, "hi")} से संबंधित है।`, `${pick(c.intervention, "pa")} ਦਾ ਅਸਰ ${pick(c.outcome, "pa")} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`),
        tx(`${pick(c.outcome, "en")} is responsive to the mechanism used by ${pick(c.intervention, "en")}.`, `${pick(c.outcome, "hi")} ${pick(c.intervention, "hi")} के तंत्र से प्रभावित होता है।`, `${pick(c.outcome, "pa")} ${pick(c.intervention, "pa")} ਦੇ ਤਰੀਕੇ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦਾ ਹੈ।`),
        tx("The claimed result depends on a mechanism connecting the intervention to that result.", "दावा किए परिणाम के लिए हस्तक्षेप और परिणाम के बीच तंत्रगत संबंध आवश्यक है।", "ਦਾਅਵੇ ਵਾਲੇ ਨਤੀਜੇ ਲਈ ਦਖ਼ਲ ਅਤੇ ਨਤੀਜੇ ਵਿਚਕਾਰ ਤਰੀਕਾਗਤ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 3, "IMPLICIT", "REQUIRED_IMPROVEMENT_HEADROOM",
        tx(`The current situation leaves scope for ${pick(c.outcome, "en")}.`, `मौजूदा स्थिति में ${pick(c.outcome, "hi")} की गुंजाइश है।`, `ਮੌਜੂਦਾ ਸਥਿਤੀ ਵਿੱਚ ${pick(c.outcome, "pa")} ਦੀ ਗੁੰਜਾਇਸ਼ ਹੈ।`),
        tx(`The baseline permits a meaningful change toward ${pick(c.outcome, "en")}.`, `आधार स्थिति ${pick(c.outcome, "hi")} की दिशा में सार्थक बदलाव की गुंजाइश देती है।`, `ਅਧਾਰ ਸਥਿਤੀ ${pick(c.outcome, "pa")} ਵੱਲ ਅਰਥਪੂਰਨ ਬਦਲਾਅ ਦੀ ਗੁੰਜਾਇਸ਼ ਦਿੰਦੀ ਹੈ।`),
        tx("A projected improvement presupposes room for that improvement from the baseline.", "अनुमानित सुधार के लिए आधार स्थिति से सुधार की गुंजाइश होना आवश्यक है।", "ਅਨੁਮਾਨਿਤ ਸੁਧਾਰ ਲਈ ਅਧਾਰ ਸਥਿਤੀ ਤੋਂ ਸੁਧਾਰ ਦੀ ਗੁੰਜਾਇਸ਼ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 4, "NOT_IMPLICIT", "UNIFORMITY_OVERREACH",
        tx(`The improvement rate will be identical across locations.`, `सुधार की दर अलग-अलग स्थानों पर समान रहेगी।`, `ਸੁਧਾਰ ਦੀ ਦਰ ਵੱਖ-ਵੱਖ ਥਾਵਾਂ ਉੱਤੇ ਇਕੋ ਜਿਹੀ ਰਹੇਗੀ।`),
        tx(`Each location will show the same magnitude of improvement.`, `प्रत्येक स्थान पर सुधार की मात्रा समान होगी।`, `ਹਰੇਕ ਥਾਂ ਉੱਤੇ ਸੁਧਾਰ ਦੀ ਮਾਤਰਾ ਇਕੋ ਜਿਹੀ ਹੋਵੇਗੀ।`),
        tx("The prediction does not require uniform effect size across locations.", "अनुमान के लिए हर स्थान पर समान प्रभाव आवश्यक नहीं है।", "ਅਨੁਮਾਨ ਲਈ ਹਰੇਕ ਥਾਂ ਉੱਤੇ ਇਕੋ ਜਿਹਾ ਅਸਰ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 5, "NOT_IMPLICIT", "CAUSE_OVERREACH",
        tx(`Staff attitudes are the main cause of ${pick(c.issue, "en")}.`, `कर्मचारियों का रवैया ${pick(c.issue, "hi")} का मुख्य कारण है।`, `ਸਟਾਫ਼ ਦਾ ਰਵੱਈਆ ${pick(c.issue, "pa")} ਦਾ ਮੁੱਖ ਕਾਰਨ ਹੈ।`),
        tx(`${pick(c.issue, "en")} is driven principally by staff attitudes.`, `${pick(c.issue, "hi")} मुख्यतः कर्मचारियों के रवैये से संचालित है।`, `${pick(c.issue, "pa")} ਮੁੱਖ ਤੌਰ ਤੇ ਸਟਾਫ਼ ਦੇ ਰਵੱਈਏ ਨਾਲ ਚਲਦੀ ਹੈ।`),
        tx("The stated intervention-effect bridge does not require this separate causal diagnosis.", "बताए हस्तक्षेप-परिणाम संबंध के लिए यह अलग कारण-निदान आवश्यक नहीं है।", "ਦੱਸੇ ਦਖ਼ਲ-ਨਤੀਜਾ ਸੰਬੰਧ ਲਈ ਇਹ ਵੱਖਰਾ ਕਾਰਨ-ਨਿਦਾਨ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 6, "NOT_IMPLICIT", "COST_NOT_REQUIRED",
        tx(`${pick(c.intervention, "en")} is cheaper than the current arrangement.`, `${pick(c.intervention, "hi")} मौजूदा व्यवस्था से सस्ता है।`, `${pick(c.intervention, "pa")} ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਨਾਲੋਂ ਸਸਤਾ ਹੈ।`),
        tx(`The current arrangement costs more than ${pick(c.intervention, "en")}.`, `मौजूदा व्यवस्था ${pick(c.intervention, "hi")} से अधिक महंगी है।`, `ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ${pick(c.intervention, "pa")} ਨਾਲੋਂ ਵਧੇਰੇ ਮਹਿੰਗਾ ਹੈ।`),
        tx("Cost is not necessary when the prediction concerns operational effect rather than expense.", "जब अनुमान परिचालन प्रभाव का है तब लागत तुलना आवश्यक नहीं है।", "ਜਦੋਂ ਅਨੁਮਾਨ ਕਾਰਜਕਾਰੀ ਅਸਰ ਦਾ ਹੈ ਤਾਂ ਲਾਗਤ ਦੀ ਤੁਲਨਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 7, "NOT_IMPLICIT", "MEASUREMENT_BIAS_NOT_REQUIRED",
        tx(`The team that designed ${pick(c.intervention, "en")} selected the metric.`, `${pick(c.intervention, "hi")} बनाने वाली टीम ने मापदंड चुना।`, `${pick(c.intervention, "pa")} ਬਣਾਉਣ ਵਾਲੀ ਟੀਮ ਨੇ ਮਾਪਦੰਡ ਚੁਣਿਆ।`),
        tx(`The metric was chosen by the intervention design team.`, `मापदंड हस्तक्षेप डिजाइन टीम ने चुना था।`, `ਮਾਪਦੰਡ ਦਖ਼ਲ ਡਿਜ਼ਾਈਨ ਟੀਮ ਨੇ ਚੁਣਿਆ ਸੀ।`),
        tx("Who selected a metric is not part of the causal bridge stated in this prediction.", "मापदंड किसने चुना, यह इस अनुमान के कारण-सम्बंध की आवश्यक पूर्वधारणा नहीं है।", "ਮਾਪਦੰਡ ਕਿਸ ਨੇ ਚੁਣਿਆ, ਇਹ ਇਸ ਅਨੁਮਾਨ ਦੇ ਕਾਰਨ-ਸੰਬੰਧ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ ਹੈ।")),
    ]) as StaV4ScenarioAuthority["candidates"],
    sourceAuthorityId: sourceAuthorityId("STA-QL-004", c),
  });
}

function ql005(context: StaV41Context): StaV4ScenarioAuthority {
  const scenarioId = `STA-V41-QL005-${context.id}`;
  const c = context;
  return Object.freeze({
    scenarioId, qlId: "STA-QL-005", checkpointId: "STA-CP-003", sourceProfile: c.sourceProfile, difficulty: c.difficulty, discourseAct: "ADVERTISEMENT", domain: c.domain,
    statementVariants: Object.freeze([
      tx(`Message to ${pick(c.audience, "en")}: use ${pick(c.channel, "en")} for ${pick(c.task, "en")} and experience ${pick(c.outcome, "en")}.`, `${pick(c.audience, "hi")} के लिए संदेश: ${pick(c.task, "hi")} हेतु ${pick(c.channel, "hi")} का उपयोग करें और ${pick(c.outcome, "hi")} का लाभ लें।`, `${pick(c.audience, "pa")} ਲਈ ਸੁਨੇਹਾ: ${pick(c.task, "pa")} ਵਾਸਤੇ ${pick(c.channel, "pa")} ਦੀ ਵਰਤੋਂ ਕਰੋ ਅਤੇ ${pick(c.outcome, "pa")} ਦਾ ਲਾਭ ਲਵੋ।`),
      tx(`A promotional appeal presents ${pick(c.channel, "en")} as a route to ${pick(c.outcome, "en")} for ${pick(c.audience, "en")}.`, `प्रचार संदेश ${pick(c.audience, "hi")} के लिए ${pick(c.channel, "hi")} को ${pick(c.outcome, "hi")} का माध्यम बताता है।`, `ਪ੍ਰਚਾਰ ਸੁਨੇਹਾ ${pick(c.audience, "pa")} ਲਈ ${pick(c.channel, "pa")} ਨੂੰ ${pick(c.outcome, "pa")} ਦਾ ਮਾਧਿਅਮ ਦੱਸਦਾ ਹੈ।`),
      tx(`The service promotes ${pick(c.channel, "en")} by highlighting ${pick(c.outcome, "en")}.`, `सेवा ${pick(c.outcome, "hi")} को प्रमुख लाभ बताकर ${pick(c.channel, "hi")} का प्रचार करती है।`, `ਸੇਵਾ ${pick(c.outcome, "pa")} ਨੂੰ ਮੁੱਖ ਲਾਭ ਦੱਸ ਕੇ ${pick(c.channel, "pa")} ਦਾ ਪ੍ਰਚਾਰ ਕਰਦੀ ਹੈ।`),
    ]) as readonly [StaV4LocalizedText, StaV4LocalizedText, StaV4LocalizedText],
    candidates: Object.freeze([
      candidate(scenarioId, 1, "IMPLICIT", "REQUIRED_AUDIENCE_VALUE",
        tx(`${pick(c.outcome, "en")} matters to the intended audience.`, `${pick(c.outcome, "hi")} लक्षित लोगों के लिए महत्व रखता है।`, `${pick(c.outcome, "pa")} ਲਕਸ਼ਿਤ ਲੋਕਾਂ ਲਈ ਮਹੱਤਵ ਰੱਖਦਾ ਹੈ।`),
        tx(`The highlighted benefit is relevant to ${pick(c.audience, "en")}.`, `बताया लाभ ${pick(c.audience, "hi")} के लिए प्रासंगिक है।`, `ਦੱਸਿਆ ਲਾਭ ${pick(c.audience, "pa")} ਲਈ ਸੰਬੰਧਿਤ ਹੈ।`),
        tx("A persuasive message relies on the highlighted benefit being relevant to its intended audience.", "प्रचार संदेश बताए लाभ की लक्षित लोगों के लिए प्रासंगिकता पर निर्भर करता है।", "ਪ੍ਰਚਾਰ ਸੁਨੇਹਾ ਦੱਸੇ ਲਾਭ ਦੀ ਲਕਸ਼ਿਤ ਲੋਕਾਂ ਲਈ ਸੰਬੰਧਤਾ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।")),
      candidate(scenarioId, 2, "IMPLICIT", "REQUIRED_RESPONSE_ROUTE",
        tx(`${pick(c.audience, "en")} have a practical route to respond to the message.`, `${pick(c.audience, "hi")} के पास संदेश पर प्रतिक्रिया देने का व्यावहारिक मार्ग है।`, `${pick(c.audience, "pa")} ਕੋਲ ਸੁਨੇਹੇ ਉੱਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਦੇਣ ਦਾ ਵਿਹਾਰਕ ਰਸਤਾ ਹੈ।`),
        tx(`The promoted call to action is practically available to ${pick(c.audience, "en")}.`, `प्रचार में बताई कार्रवाई ${pick(c.audience, "hi")} के लिए व्यावहारिक रूप से उपलब्ध है।`, `ਪ੍ਰਚਾਰ ਵਿੱਚ ਦੱਸੀ ਕਾਰਵਾਈ ${pick(c.audience, "pa")} ਲਈ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਉਪਲਬਧ ਹੈ।`),
        tx("An appeal presupposes a realistic way for its audience to act on it.", "अपील यह मानती है कि लक्षित लोग उस पर व्यावहारिक रूप से प्रतिक्रिया दे सकते हैं।", "ਅਪੀਲ ਇਹ ਮੰਨਦੀ ਹੈ ਕਿ ਲਕਸ਼ਿਤ ਲੋਕ ਉਸ ਉੱਤੇ ਵਿਹਾਰਕ ਤੌਰ ਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਦੇ ਸਕਦੇ ਹਨ।")),
      candidate(scenarioId, 3, "IMPLICIT", "REQUIRED_BENEFIT_EFFICACY",
        tx(`${pick(c.channel, "en")} has a credible link to ${pick(c.outcome, "en")}.`, `${pick(c.channel, "hi")} का ${pick(c.outcome, "hi")} से विश्वसनीय संबंध है।`, `${pick(c.channel, "pa")} ਦਾ ${pick(c.outcome, "pa")} ਨਾਲ ਭਰੋਸੇਯੋਗ ਸੰਬੰਧ ਹੈ।`),
        tx(`The promoted route is relevant to producing ${pick(c.outcome, "en")}.`, `प्रचारित माध्यम ${pick(c.outcome, "hi")} प्राप्त करने से संबंधित है।`, `ਪ੍ਰਚਾਰਿਤ ਮਾਧਿਅਮ ${pick(c.outcome, "pa")} ਹਾਸਲ ਕਰਨ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`),
        tx("Highlighting a benefit depends on a credible connection between the promoted route and that benefit.", "लाभ बताने के लिए प्रचारित माध्यम और लाभ के बीच विश्वसनीय संबंध आवश्यक है।", "ਲਾਭ ਦੱਸਣ ਲਈ ਪ੍ਰਚਾਰਿਤ ਮਾਧਿਅਮ ਅਤੇ ਲਾਭ ਵਿਚਕਾਰ ਭਰੋਸੇਯੋਗ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 4, "NOT_IMPLICIT", "EXISTING_PREFERENCE_NOT_REQUIRED",
        tx(`The audience already prefers this service provider.`, `लक्षित लोग पहले से इस सेवा प्रदाता को पसंद करते हैं।`, `ਲਕਸ਼ਿਤ ਲੋਕ ਪਹਿਲਾਂ ਹੀ ਇਸ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨੂੰ ਤਰਜੀਹ ਦਿੰਦੇ ਹਨ।`),
        tx(`The service provider already enjoys strong audience preference.`, `सेवा प्रदाता को पहले से लोगों की मजबूत पसंद प्राप्त है।`, `ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨੂੰ ਪਹਿਲਾਂ ਹੀ ਲੋਕਾਂ ਦੀ ਮਜ਼ਬੂਤ ਪਸੰਦ ਪ੍ਰਾਪਤ ਹੈ।`),
        tx("An advertisement may seek to create preference; prior preference is not required.", "विज्ञापन पसंद पैदा करने के लिए भी हो सकता है, इसलिए पहले से पसंद होना आवश्यक नहीं है।", "ਇਸ਼ਤਿਹਾਰ ਪਸੰਦ ਪੈਦਾ ਕਰਨ ਲਈ ਵੀ ਹੋ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਤੋਂ ਪਸੰਦ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 5, "NOT_IMPLICIT", "COMPETITOR_JUDGEMENT_NOT_REQUIRED",
        tx(`Competing services perform worse on the same task.`, `प्रतिस्पर्धी सेवाएं उसी कार्य में कमजोर प्रदर्शन करती हैं।`, `ਮੁਕਾਬਲੇ ਦੀਆਂ ਸੇਵਾਵਾਂ ਉਸੇ ਕੰਮ ਵਿੱਚ ਕਮਜ਼ੋਰ ਪ੍ਰਦਰਸ਼ਨ ਕਰਦੀਆਂ ਹਨ।`),
        tx(`Alternative providers deliver weaker results for this task.`, `वैकल्पिक प्रदाता इस कार्य में कमजोर परिणाम देते हैं।`, `ਵਿਕਲਪਕ ਪ੍ਰਦਾਤਾ ਇਸ ਕੰਮ ਵਿੱਚ ਕਮਜ਼ੋਰ ਨਤੀਜੇ ਦਿੰਦੇ ਹਨ।`),
        tx("Promoting one's own benefit does not require an adverse judgement about competitors.", "अपने लाभ का प्रचार करने के लिए प्रतिस्पर्धियों को कमजोर मानना आवश्यक नहीं है।", "ਆਪਣਾ ਲਾਭ ਪ੍ਰਚਾਰਣ ਲਈ ਮੁਕਾਬਲੇ ਵਾਲਿਆਂ ਨੂੰ ਕਮਜ਼ੋਰ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 6, "NOT_IMPLICIT", "MESSAGE_PROVES_QUALITY",
        tx(`The advertisement itself proves the service quality.`, `विज्ञापन स्वयं सेवा की गुणवत्ता सिद्ध करता है।`, `ਇਸ਼ਤਿਹਾਰ ਆਪਣੇ ਆਪ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਸਾਬਤ ਕਰਦਾ ਹੈ।`),
        tx(`Publishing the message establishes the quality claim as a fact.`, `संदेश प्रकाशित होना गुणवत्ता दावे को तथ्य सिद्ध करता है।`, `ਸੁਨੇਹਾ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਣਾ ਗੁਣਵੱਤਾ ਦੇ ਦਾਅਵੇ ਨੂੰ ਤੱਥ ਸਾਬਤ ਕਰਦਾ ਹੈ।`),
        tx("The act of advertising does not itself establish the truth of a quality claim.", "विज्ञापन करना अपने आप गुणवत्ता दावे की सत्यता सिद्ध नहीं करता।", "ਇਸ਼ਤਿਹਾਰ ਕਰਨਾ ਆਪਣੇ ਆਪ ਗੁਣਵੱਤਾ ਦੇ ਦਾਅਵੇ ਦੀ ਸੱਚਾਈ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।")),
      candidate(scenarioId, 7, "NOT_IMPLICIT", "BUDGET_NOT_REQUIRED",
        tx(`The campaign budget exceeds last year's budget.`, `प्रचार बजट पिछले वर्ष के बजट से अधिक है।`, `ਪ੍ਰਚਾਰ ਬਜਟ ਪਿਛਲੇ ਸਾਲ ਦੇ ਬਜਟ ਨਾਲੋਂ ਵੱਧ ਹੈ।`),
        tx(`This campaign received a larger budget than the previous campaign.`, `इस प्रचार अभियान को पिछले अभियान से बड़ा बजट मिला।`, `ਇਸ ਪ੍ਰਚਾਰ ਮੁਹਿੰਮ ਨੂੰ ਪਿਛਲੀ ਮੁਹਿੰਮ ਨਾਲੋਂ ਵੱਡਾ ਬਜਟ ਮਿਲਿਆ।`),
        tx("Campaign spending is not necessary to the persuasive dependency being tested.", "प्रचार खर्च इस प्रश्न में परखी जा रही persuasive निर्भरता की आवश्यक पूर्वधारणा नहीं है।", "ਪ੍ਰਚਾਰ ਖਰਚ ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪਰਖੀ ਜਾ ਰਹੀ ਪ੍ਰੇਰਕ ਨਿਰਭਰਤਾ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ ਹੈ।")),
    ]) as StaV4ScenarioAuthority["candidates"],
    sourceAuthorityId: sourceAuthorityId("STA-QL-005", c),
  });
}

function ql006(context: StaV41Context): StaV4ScenarioAuthority {
  const scenarioId = `STA-V41-QL006-${context.id}`;
  const c = context;
  return Object.freeze({
    scenarioId, qlId: "STA-QL-006", checkpointId: "STA-CP-004", sourceProfile: c.sourceProfile, difficulty: c.difficulty, discourseAct: "ASSERTION", domain: c.domain,
    statementVariants: Object.freeze([
      tx(`A review of ${pick(c.audience, "en")} recorded better ${pick(c.metric, "en")} with ${pick(c.intervention, "en")} than with the current arrangement; the service concludes that the intervention is more effective.`, `${pick(c.audience, "hi")} की समीक्षा में ${pick(c.intervention, "hi")} के साथ ${pick(c.metric, "hi")} मौजूदा व्यवस्था से बेहतर रहा; सेवा इसे अधिक प्रभावी मानती है।`, `${pick(c.audience, "pa")} ਦੀ ਸਮੀਖਿਆ ਵਿੱਚ ${pick(c.intervention, "pa")} ਨਾਲ ${pick(c.metric, "pa")} ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਨਾਲੋਂ ਬਿਹਤਰ ਰਿਹਾ; ਸੇਵਾ ਇਸ ਨੂੰ ਵਧੇਰੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਮੰਨਦੀ ਹੈ।`),
      tx(`On the basis of ${pick(c.metric, "en")} observed among ${pick(c.audience, "en")}, the administration rates ${pick(c.intervention, "en")} above the existing process.`, `${pick(c.audience, "hi")} में देखे गए ${pick(c.metric, "hi")} के आधार पर प्रशासन ${pick(c.intervention, "hi")} को मौजूदा प्रक्रिया से बेहतर मानता है।`, `${pick(c.audience, "pa")} ਵਿੱਚ ਦੇਖੇ ${pick(c.metric, "pa")} ਦੇ ਆਧਾਰ ਤੇ ਪ੍ਰਸ਼ਾਸਨ ${pick(c.intervention, "pa")} ਨੂੰ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਨਾਲੋਂ ਬਿਹਤਰ ਮੰਨਦਾ ਹੈ।`),
      tx(`The service generalises from a review of ${pick(c.audience, "en")} that ${pick(c.intervention, "en")} provides a stronger result on ${pick(c.metric, "en")}.`, `सेवा ${pick(c.audience, "hi")} की समीक्षा से निष्कर्ष निकालती है कि ${pick(c.intervention, "hi")} ${pick(c.metric, "hi")} पर बेहतर परिणाम देता है।`, `ਸੇਵਾ ${pick(c.audience, "pa")} ਦੀ ਸਮੀਖਿਆ ਤੋਂ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਕਿ ${pick(c.intervention, "pa")} ${pick(c.metric, "pa")} ਉੱਤੇ ਬਿਹਤਰ ਨਤੀਜਾ ਦਿੰਦਾ ਹੈ।`),
    ]) as readonly [StaV4LocalizedText, StaV4LocalizedText, StaV4LocalizedText],
    candidates: Object.freeze([
      candidate(scenarioId, 1, "IMPLICIT", "REQUIRED_MEASUREMENT_VALIDITY",
        tx(`${pick(c.metric, "en")} is relevant to the effectiveness being judged.`, `${pick(c.metric, "hi")} आंकी जा रही प्रभावशीलता से संबंधित है।`, `${pick(c.metric, "pa")} ਅੰਕੀ ਜਾ ਰਹੀ ਪ੍ਰਭਾਵਸ਼ੀਲਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`),
        tx(`The chosen measure reflects a meaningful part of the claimed performance.`, `चुना गया माप दावा किए प्रदर्शन के सार्थक हिस्से को दर्शाता है।`, `ਚੁਣਿਆ ਮਾਪ ਦਾਅਵੇ ਵਾਲੇ ਪ੍ਰਦਰਸ਼ਨ ਦੇ ਅਰਥਪੂਰਨ ਹਿੱਸੇ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`),
        tx("A comparative claim based on a metric requires that metric to be relevant to what is being judged.", "माप पर आधारित तुलना के लिए माप का आंकी जा रही बात से प्रासंगिक होना आवश्यक है।", "ਮਾਪ ਉੱਤੇ ਆਧਾਰਿਤ ਤੁਲਨਾ ਲਈ ਮਾਪ ਦਾ ਅੰਕੀ ਜਾ ਰਹੀ ਗੱਲ ਨਾਲ ਸੰਬੰਧਿਤ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 2, "IMPLICIT", "REQUIRED_COMPARABILITY",
        tx(`The compared cases were assessed under sufficiently comparable conditions.`, `तुलना वाले मामलों का आकलन पर्याप्त रूप से तुलनीय परिस्थितियों में हुआ।`, `ਤੁਲਨਾ ਵਾਲੇ ਮਾਮਲਿਆਂ ਦਾ ਮੁਲਾਂਕਣ ਕਾਫ਼ੀ ਤੁਲਨਾਤਮਕ ਹਾਲਾਤਾਂ ਵਿੱਚ ਹੋਇਆ।`),
        tx(`The comparison does not rest on materially different testing conditions.`, `तुलना मूल रूप से अलग परीक्षण परिस्थितियों पर आधारित नहीं है।`, `ਤੁਲਨਾ ਮੁੱਢਲੇ ਤੌਰ ਤੇ ਵੱਖਰੀਆਂ ਜਾਂਚ ਹਾਲਤਾਂ ਉੱਤੇ ਆਧਾਰਿਤ ਨਹੀਂ ਹੈ।`),
        tx("The comparison needs conditions similar enough for the observed difference to bear on the claim.", "तुलना के लिए परिस्थितियां इतनी समान होना आवश्यक हैं कि देखा अंतर दावे के लिए अर्थपूर्ण हो।", "ਤੁਲਨਾ ਲਈ ਹਾਲਾਤ ਇੰਨੇ ਮਿਲਦੇ ਹੋਣ ਲਾਜ਼ਮੀ ਹਨ ਕਿ ਦੇਖਿਆ ਫ਼ਰਕ ਦਾਅਵੇ ਲਈ ਅਰਥਪੂਰਨ ਹੋਵੇ।")),
      candidate(scenarioId, 3, "IMPLICIT", "REQUIRED_REPRESENTATIVENESS",
        tx(`${pick(c.audience, "en")} provide appropriate evidence for the scope of the claim.`, `${pick(c.audience, "hi")} दावे के दायरे के लिए उपयुक्त साक्ष्य देते हैं।`, `${pick(c.audience, "pa")} ਦਾਅਵੇ ਦੇ ਦਾਇਰੇ ਲਈ ਢੁਕਵਾਂ ਸਬੂਤ ਦਿੰਦੇ ਹਨ।`),
        tx(`The reviewed group is relevant to the population covered by the conclusion.`, `समीक्षित समूह निष्कर्ष में शामिल जनसमूह से संबंधित है।`, `ਸਮੀਖਿਆ ਕੀਤਾ ਸਮੂਹ ਨਤੀਜੇ ਵਿੱਚ ਸ਼ਾਮਲ ਜਨਸਮੂਹ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`),
        tx("Generalising from reviewed cases requires the evidence group to match the scope of the conclusion sufficiently well.", "समीक्षित मामलों से सामान्य निष्कर्ष के लिए साक्ष्य समूह का निष्कर्ष के दायरे से पर्याप्त मेल आवश्यक है।", "ਸਮੀਖਿਆ ਕੀਤੇ ਮਾਮਲਿਆਂ ਤੋਂ ਆਮ ਨਤੀਜੇ ਲਈ ਸਬੂਤ ਸਮੂਹ ਦਾ ਨਤੀਜੇ ਦੇ ਦਾਇਰੇ ਨਾਲ ਕਾਫ਼ੀ ਮੇਲ ਲਾਜ਼ਮੀ ਹੈ।")),
      candidate(scenarioId, 4, "NOT_IMPLICIT", "NOVELTY_NOT_REQUIRED",
        tx(`${pick(c.intervention, "en")} is newer than the current arrangement.`, `${pick(c.intervention, "hi")} मौजूदा व्यवस्था से नया है।`, `${pick(c.intervention, "pa")} ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਨਾਲੋਂ ਨਵਾਂ ਹੈ।`),
        tx(`The current arrangement was introduced earlier than ${pick(c.intervention, "en")}.`, `मौजूदा व्यवस्था ${pick(c.intervention, "hi")} से पहले शुरू हुई थी।`, `ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ${pick(c.intervention, "pa")} ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ।`),
        tx("Novelty is unrelated to whether the comparison supports the stated effectiveness claim.", "नयापन यह तय नहीं करता कि तुलना प्रभावशीलता के दावे को समर्थन देती है या नहीं।", "ਨਵਾਂ ਹੋਣਾ ਇਹ ਤੈਅ ਨਹੀਂ ਕਰਦਾ ਕਿ ਤੁਲਨਾ ਪ੍ਰਭਾਵਸ਼ੀਲਤਾ ਦੇ ਦਾਅਵੇ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦੀ ਹੈ ਜਾਂ ਨਹੀਂ।")),
      candidate(scenarioId, 5, "NOT_IMPLICIT", "SELECTOR_BIAS_NOT_REQUIRED",
        tx(`The team favouring ${pick(c.intervention, "en")} selected the metric.`, `${pick(c.intervention, "hi")} के पक्ष वाली टीम ने मापदंड चुना।`, `${pick(c.intervention, "pa")} ਦੇ ਹੱਕ ਵਾਲੀ ਟੀਮ ਨੇ ਮਾਪਦੰਡ ਚੁਣਿਆ।`),
        tx(`Supporters of the intervention chose the performance measure.`, `हस्तक्षेप के समर्थकों ने प्रदर्शन माप चुना।`, `ਦਖ਼ਲ ਦੇ ਸਮਰਥਕਾਂ ਨੇ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ ਚੁਣਿਆ।`),
        tx("This might raise a bias question, but it is not a necessary premise of the comparison as stated.", "यह पक्षपात का प्रश्न उठा सकता है, पर दिए गए तुलना-दावे की आवश्यक पूर्वधारणा नहीं है।", "ਇਹ ਪੱਖਪਾਤ ਦਾ ਸਵਾਲ ਖੜ੍ਹਾ ਕਰ ਸਕਦਾ ਹੈ ਪਰ ਦਿੱਤੇ ਤੁਲਨਾ-ਦਾਅਵੇ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 6, "NOT_IMPLICIT", "REPUTATION_NOT_REQUIRED",
        tx(`The current arrangement has a weaker public reputation.`, `मौजूदा व्यवस्था की सार्वजनिक प्रतिष्ठा कमजोर है।`, `ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਦੀ ਜਨਤਕ ਸਾਖ ਕਮਜ਼ੋਰ ਹੈ।`),
        tx(`Users hold a less favourable view of the current arrangement.`, `उपयोगकर्ताओं की मौजूदा व्यवस्था के बारे में कम अनुकूल राय है।`, `ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਮੌਜੂਦਾ ਪ੍ਰਬੰਧ ਬਾਰੇ ਘੱਟ ਅਨੁਕੂਲ ਰਾਏ ਹੈ।`),
        tx("Reputation is not needed when the conclusion is based on a specified performance measure.", "जब निष्कर्ष निर्दिष्ट प्रदर्शन माप पर आधारित है तब प्रतिष्ठा आवश्यक नहीं है।", "ਜਦੋਂ ਨਤੀਜਾ ਨਿਰਧਾਰਤ ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ ਉੱਤੇ ਆਧਾਰਿਤ ਹੈ ਤਾਂ ਸਾਖ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।")),
      candidate(scenarioId, 7, "NOT_IMPLICIT", "BUDGET_CONFOUND_NOT_REQUIRED",
        tx(`The intervention group received a larger operating budget.`, `हस्तक्षेप समूह को बड़ा परिचालन बजट मिला।`, `ਦਖ਼ਲ ਸਮੂਹ ਨੂੰ ਵੱਡਾ ਕਾਰਜਕਾਰੀ ਬਜਟ ਮਿਲਿਆ।`),
        tx(`More operating funds were assigned to the intervention group.`, `हस्तक्षेप समूह को अधिक परिचालन धन दिया गया।`, `ਦਖ਼ਲ ਸਮੂਹ ਨੂੰ ਵਧੇਰੇ ਕਾਰਜਕਾਰੀ ਫੰਡ ਦਿੱਤੇ ਗਏ।`),
        tx("A budget difference would be a possible confound, but the statement does not require that such a difference existed.", "बजट अंतर संभावित confound हो सकता है, पर कथन यह मानने पर निर्भर नहीं है कि ऐसा अंतर था।", "ਬਜਟ ਦਾ ਫ਼ਰਕ ਸੰਭਾਵੀ confound ਹੋ ਸਕਦਾ ਹੈ ਪਰ ਕਥਨ ਇਹ ਮੰਨਣ ਉੱਤੇ ਨਿਰਭਰ ਨਹੀਂ ਕਿ ਐਸਾ ਫ਼ਰਕ ਸੀ।")),
    ]) as StaV4ScenarioAuthority["candidates"],
    sourceAuthorityId: sourceAuthorityId("STA-QL-006", c),
  });
}

const BUILDERS: Readonly<Record<StaV4QlId, (context: StaV41Context) => StaV4ScenarioAuthority>> = Object.freeze({
  "STA-QL-001": ql001,
  "STA-QL-002": ql002,
  "STA-QL-003": ql003,
  "STA-QL-004": ql004,
  "STA-QL-005": ql005,
  "STA-QL-006": ql006,
});

export const STA_V41_SCENARIOS: readonly StaV4ScenarioAuthority[] = Object.freeze(
  STA_V4_QL_IDS.flatMap((qlId) => STA_V41_CONTEXTS.map((context) => BUILDERS[qlId](context))),
);

export const STA_V41_SCENARIOS_BY_QL: Readonly<Record<StaV4QlId, readonly StaV4ScenarioAuthority[]>> = Object.freeze({
  "STA-QL-001": Object.freeze(STA_V41_SCENARIOS.filter((item) => item.qlId === "STA-QL-001")),
  "STA-QL-002": Object.freeze(STA_V41_SCENARIOS.filter((item) => item.qlId === "STA-QL-002")),
  "STA-QL-003": Object.freeze(STA_V41_SCENARIOS.filter((item) => item.qlId === "STA-QL-003")),
  "STA-QL-004": Object.freeze(STA_V41_SCENARIOS.filter((item) => item.qlId === "STA-QL-004")),
  "STA-QL-005": Object.freeze(STA_V41_SCENARIOS.filter((item) => item.qlId === "STA-QL-005")),
  "STA-QL-006": Object.freeze(STA_V41_SCENARIOS.filter((item) => item.qlId === "STA-QL-006")),
});

if (STA_V41_SCENARIOS.length !== 108 || new Set(STA_V41_SCENARIOS.map((item) => item.scenarioId)).size !== 108) {
  throw new Error("STA V4.1 must expose exactly 108 unique scenario authorities");
}
for (const qlId of STA_V4_QL_IDS) {
  if (STA_V41_SCENARIOS_BY_QL[qlId].length !== 18) throw new Error(`${qlId}: expected 18 V4.1 authorities`);
}
