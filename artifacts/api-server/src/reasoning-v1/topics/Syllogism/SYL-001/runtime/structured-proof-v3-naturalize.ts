import { createHash } from "node:crypto";
import type {
  CanonicalConclusion,
  InternalConclusionClass,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylOption, SylTaskKind } from "./types";
import type { SylStructuredProofV3 } from "./structured-proof-v3-types";

interface ConclusionContext {
  conclusion: CanonicalConclusion;
  classification: InternalConclusionClass;
  verdictImpactPremiseIds: readonly string[];
  modelImpactPremiseIds: readonly string[];
}

interface NaturalizeInput {
  locale: SylLocale;
  taskKind: SylTaskKind;
  displayedPremises: readonly SurfacePremise[];
  statements: readonly string[];
  options: readonly GeneratedSylOption[];
  correctIndex: number;
  conclusions: readonly ConclusionContext[];
  termLabels: Readonly<Record<TermId, string>>;
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function cleanSentence(value: string): string {
  return value.trim().replace(/[.!?]+$/u, "");
}

function key(conclusion: CanonicalConclusion): string {
  return `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`;
}

function label(term: TermId, input: NaturalizeInput): string {
  return input.termLabels[term] ?? term;
}

function profileForOption(option: GeneratedSylOption, input: NaturalizeInput): ConclusionContext | null {
  return input.conclusions.find((entry) => key(entry.conclusion) === option.semanticValue) ?? null;
}

function premiseNumbers(ids: readonly string[], input: NaturalizeInput): readonly number[] {
  return [...new Set(ids
    .map((id) => input.displayedPremises.findIndex((premise) => premise.premiseId === id))
    .filter((index) => index >= 0)
    .map((index) => index + 1))];
}

function premiseRef(ids: readonly string[], input: NaturalizeInput): string {
  const numbers = premiseNumbers(ids, input);
  if (input.locale === "hi-IN") return numbers.length === 1 ? `कथन ${numbers[0]}` : `कथन ${numbers.join(" और ")}`;
  if (input.locale === "pa-IN") return numbers.length === 1 ? `ਕਥਨ ${numbers[0]}` : `ਕਥਨ ${numbers.join(" ਅਤੇ ")}`;
  return numbers.length === 1 ? `Statement ${numbers[0]}` : `Statements ${numbers.join(" and ")}`;
}

function meaningForPremiseId(id: string, proof: SylStructuredProofV3): string {
  return proof.statementMeanings.find((entry) => entry.premiseId === id)?.meaning ?? "";
}

function decisiveMeaning(ids: readonly string[], proof: SylStructuredProofV3): readonly string[] {
  return ids.map((id) => meaningForPremiseId(id, proof)).filter(Boolean);
}

function relationNeed(conclusion: CanonicalConclusion, input: NaturalizeInput): string {
  const subject = label(conclusion.subject, input);
  const predicate = label(conclusion.predicate, input);
  if (input.locale === "hi-IN") {
    if (conclusion.form === "ALL") return `हर ${subject} को ${predicate} के अंदर होना होगा`;
    if (conclusion.form === "NO") return `${subject} और ${predicate} को पूरी तरह अलग होना होगा`;
    if (conclusion.form === "SOME") return `${subject} और ${predicate} का कम-से-कम एक साझा सदस्य चाहिए`;
    return `कम-से-कम एक ${subject} को ${predicate} से बाहर होना होगा`;
  }
  if (input.locale === "pa-IN") {
    if (conclusion.form === "ALL") return `ਹਰ ${subject} ਨੂੰ ${predicate} ਦੇ ਅੰਦਰ ਹੋਣਾ ਪਵੇਗਾ`;
    if (conclusion.form === "NO") return `${subject} ਅਤੇ ${predicate} ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਹੋਣਾ ਪਵੇਗਾ`;
    if (conclusion.form === "SOME") return `${subject} ਅਤੇ ${predicate} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਾਂਝਾ ਮੈਂਬਰ ਚਾਹੀਦਾ ਹੈ`;
    return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject} ਨੂੰ ${predicate} ਤੋਂ ਬਾਹਰ ਹੋਣਾ ਪਵੇਗਾ`;
  }
  if (conclusion.form === "ALL") return `every ${subject} must be inside ${predicate}`;
  if (conclusion.form === "NO") return `${subject} and ${predicate} must have no common member`;
  if (conclusion.form === "SOME") return `${subject} and ${predicate} must have at least one common member`;
  return `at least one ${subject} must stay outside ${predicate}`;
}

function exactConclusion(conclusion: CanonicalConclusion, input: NaturalizeInput): string {
  const subject = label(conclusion.subject, input);
  const predicate = label(conclusion.predicate, input);
  if (input.locale === "hi-IN") {
    if (conclusion.form === "ALL") return `सभी ${subject}, ${predicate} हैं`;
    if (conclusion.form === "NO") return `कोई ${subject}, ${predicate} नहीं है`;
    if (conclusion.form === "SOME") return `कुछ ${subject}, ${predicate} हैं`;
    return `कुछ ${subject}, ${predicate} नहीं हैं`;
  }
  if (input.locale === "pa-IN") {
    if (conclusion.form === "ALL") return `ਸਾਰੇ ${subject}, ${predicate} ਹਨ`;
    if (conclusion.form === "NO") return `ਕੋਈ ${subject}, ${predicate} ਨਹੀਂ ਹੈ`;
    if (conclusion.form === "SOME") return `ਕੁਝ ${subject}, ${predicate} ਹਨ`;
    return `ਕੁਝ ${subject}, ${predicate} ਨਹੀਂ ਹਨ`;
  }
  if (conclusion.form === "ALL") return `all ${subject} are ${predicate}`;
  if (conclusion.form === "NO") return `no ${subject} is ${predicate}`;
  if (conclusion.form === "SOME") return `some ${subject} are ${predicate}`;
  return `some ${subject} are not ${predicate}`;
}

function samePair(left: CanonicalConclusion, right: CanonicalConclusion): boolean {
  return left.subject === right.subject && left.predicate === right.predicate;
}

function directBlocker(
  profile: ConclusionContext,
  input: NaturalizeInput,
): { premise: SurfacePremise; number: number } | null {
  const index = input.displayedPremises.findIndex((premise) => {
    if (premise.form === "NO" && profile.conclusion.form === "SOME") {
      return new Set([premise.subject, premise.predicate]).has(profile.conclusion.subject)
        && new Set([premise.subject, premise.predicate]).has(profile.conclusion.predicate);
    }
    if (["ALL", "ARE_ONLY"].includes(premise.form) && profile.conclusion.form === "SOME_NOT") {
      return premise.subject === profile.conclusion.subject && premise.predicate === profile.conclusion.predicate;
    }
    if (["SOME", "A_FEW"].includes(premise.form) && profile.conclusion.form === "NO") {
      return new Set([premise.subject, premise.predicate]).has(profile.conclusion.subject)
        && new Set([premise.subject, premise.predicate]).has(profile.conclusion.predicate);
    }
    return false;
  });
  return index >= 0 ? { premise: input.displayedPremises[index], number: index + 1 } : null;
}

function entailedCounterpart(profile: ConclusionContext, input: NaturalizeInput): ConclusionContext | null {
  return input.conclusions.find((entry) => {
    if (entry.classification !== "ENTAILED") return false;
    if (profile.conclusion.form === "ALL" && entry.conclusion.form === "SOME_NOT") return samePair(profile.conclusion, entry.conclusion);
    if (profile.conclusion.form === "NO" && entry.conclusion.form === "SOME") return samePair(profile.conclusion, entry.conclusion);
    if (profile.conclusion.form === "SOME" && entry.conclusion.form === "NO") return samePair(profile.conclusion, entry.conclusion);
    if (profile.conclusion.form === "SOME_NOT" && entry.conclusion.form === "ALL") return samePair(profile.conclusion, entry.conclusion);
    return false;
  }) ?? null;
}

function impossibleReason(
  profile: ConclusionContext,
  ids: readonly string[],
  input: NaturalizeInput,
  proof: SylStructuredProofV3,
): string {
  const blocker = directBlocker(profile, input);
  if (blocker) {
    const statement = cleanSentence(input.statements[blocker.number - 1]);
    if (input.locale === "hi-IN") return `कथन ${blocker.number} कहता है: “${statement}।” इस विकल्प के लिए ${relationNeed(profile.conclusion, input)}। दोनों बातें साथ सत्य नहीं हो सकतीं।`;
    if (input.locale === "pa-IN") return `ਕਥਨ ${blocker.number} ਕਹਿੰਦਾ ਹੈ: “${statement}।” ਇਸ ਵਿਕਲਪ ਲਈ ${relationNeed(profile.conclusion, input)}। ਦੋਵੇਂ ਗੱਲਾਂ ਇਕੱਠੇ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦੀਆਂ।`;
    return `Statement ${blocker.number} says, “${statement}.” This option needs ${relationNeed(profile.conclusion, input)}. Both cannot be true together.`;
  }
  const counterpart = entailedCounterpart(profile, input);
  if (counterpart) {
    const ref = premiseRef(counterpart.verdictImpactPremiseIds, input);
    const forced = exactConclusion(counterpart.conclusion, input);
    if (input.locale === "hi-IN") return `${ref} से ${forced} निश्चित होता है। यह विकल्प उसके विपरीत संबंध की माँग करता है, इसलिए यह असंभव है।`;
    if (input.locale === "pa-IN") return `${ref} ਤੋਂ ${forced} ਨਿਸ਼ਚਿਤ ਹੁੰਦਾ ਹੈ। ਇਹ ਵਿਕਲਪ ਉਸ ਦੇ ਉਲਟ ਸੰਬੰਧ ਦੀ ਮੰਗ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਸੰਭਵ ਹੈ।`;
    return `${ref} force that ${forced}. This option requires the opposite relation, so it is impossible.`;
  }
  const meanings = decisiveMeaning(ids, proof).map(cleanSentence);
  if (input.locale === "hi-IN") return `${meanings.join(" ")} इसलिए ${relationNeed(profile.conclusion, input)} संभव नहीं है।`;
  if (input.locale === "pa-IN") return `${meanings.join(" ")} ਇਸ ਲਈ ${relationNeed(profile.conclusion, input)} ਸੰਭਵ ਨਹੀਂ ਹੈ।`;
  return `${meanings.join(" ")} Therefore, ${relationNeed(profile.conclusion, input)} is impossible.`;
}

function undeterminedReason(profile: ConclusionContext, input: NaturalizeInput): string {
  const subject = label(profile.conclusion.subject, input);
  const predicate = label(profile.conclusion.predicate, input);
  if (input.locale === "hi-IN") {
    if (profile.conclusion.form === "ALL") return `कथन सभी ${subject} को ${predicate} के अंदर नहीं रखते। सभी अंदर हो सकते हैं, लेकिन कोई दूसरा ${subject} बाहर भी रह सकता है। इसलिए यह केवल संभावना है।`;
    if (profile.conclusion.form === "NO") return `कथन ${subject} और ${predicate} के संबंध को तय नहीं करते। वे अलग भी रह सकते हैं और साझा सदस्य भी रख सकते हैं। इसलिए यह निश्चित नहीं है।`;
    if (profile.conclusion.form === "SOME") return `कथन ${subject}–${predicate} का साझा सदस्य अनिवार्य नहीं करते। एक सही व्यवस्था में साझा सदस्य हो सकता है और दूसरी में नहीं।`;
    return `कथन किसी ${subject} को ${predicate} से बाहर रखना अनिवार्य नहीं करते। एक सही व्यवस्था में सभी अंदर हो सकते हैं और दूसरी में कोई बाहर रह सकता है।`;
  }
  if (input.locale === "pa-IN") {
    if (profile.conclusion.form === "ALL") return `ਕਥਨ ਸਾਰੇ ${subject} ਨੂੰ ${predicate} ਦੇ ਅੰਦਰ ਨਹੀਂ ਰੱਖਦੇ। ਸਾਰੇ ਅੰਦਰ ਹੋ ਸਕਦੇ ਹਨ, ਪਰ ਕੋਈ ਹੋਰ ${subject} ਬਾਹਰ ਵੀ ਰਹਿ ਸਕਦਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਸਿਰਫ਼ ਸੰਭਾਵਨਾ ਹੈ।`;
    if (profile.conclusion.form === "NO") return `ਕਥਨ ${subject} ਅਤੇ ${predicate} ਦਾ ਸੰਬੰਧ ਤੈਅ ਨਹੀਂ ਕਰਦੇ। ਉਹ ਵੱਖ ਵੀ ਰਹਿ ਸਕਦੇ ਹਨ ਅਤੇ ਸਾਂਝਾ ਮੈਂਬਰ ਵੀ ਰੱਖ ਸਕਦੇ ਹਨ। ਇਸ ਲਈ ਇਹ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ।`;
    if (profile.conclusion.form === "SOME") return `ਕਥਨ ${subject}–${predicate} ਦਾ ਸਾਂਝਾ ਮੈਂਬਰ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ। ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਾਂਝਾ ਮੈਂਬਰ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਨਹੀਂ।`;
    return `ਕਥਨ ਕਿਸੇ ${subject} ਨੂੰ ${predicate} ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ। ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਾਰੇ ਅੰਦਰ ਹੋ ਸਕਦੇ ਹਨ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਕੋਈ ਬਾਹਰ ਰਹਿ ਸਕਦਾ ਹੈ।`;
  }
  if (profile.conclusion.form === "ALL") return `The statements do not place every ${subject} inside ${predicate}. All may be inside, but another ${subject} may stay outside. So this is possible, not definite.`;
  if (profile.conclusion.form === "NO") return `The statements do not fix the relation between ${subject} and ${predicate}. They may stay separate or share a member. So this is not definite.`;
  if (profile.conclusion.form === "SOME") return `The statements do not force a common ${subject}–${predicate} member. One valid arrangement has one, while another has none.`;
  return `The statements do not force a ${subject} outside ${predicate}. One valid arrangement puts every ${subject} inside, while another leaves one outside.`;
}

function entailedReason(
  profile: ConclusionContext,
  ids: readonly string[],
  input: NaturalizeInput,
  proof: SylStructuredProofV3,
  isCorrect: boolean,
): string {
  if (!isCorrect) {
    if (input.locale === "hi-IN") return `यह निष्कर्ष कथनों से सत्य निकलता है, लेकिन प्रश्न किसी दूसरी प्रकार की प्रतिक्रिया माँगता है। इसलिए यह इस प्रश्न का सही विकल्प नहीं है।`;
    if (input.locale === "pa-IN") return `ਇਹ ਨਤੀਜਾ ਕਥਨਾਂ ਤੋਂ ਸਹੀ ਨਿਕਲਦਾ ਹੈ, ਪਰ ਸਵਾਲ ਕਿਸੇ ਹੋਰ ਕਿਸਮ ਦਾ ਜਵਾਬ ਮੰਗਦਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਇਸ ਸਵਾਲ ਦਾ ਸਹੀ ਵਿਕਲਪ ਨਹੀਂ ਹੈ।`;
    return `This conclusion is true from the statements, but the question asks for a different response type. Therefore it is not the keyed option.`;
  }
  const meanings = decisiveMeaning(ids, proof).map(cleanSentence);
  const conclusion = exactConclusion(profile.conclusion, input);
  if (input.locale === "hi-IN") return `${meanings.join(" ")} इन्हें जोड़ने पर ${conclusion} हर सही व्यवस्था में सत्य रहता है।`;
  if (input.locale === "pa-IN") return `${meanings.join(" ")} ਇਨ੍ਹਾਂ ਨੂੰ ਜੋੜਨ ਨਾਲ ${conclusion} ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਰਹਿੰਦਾ ਹੈ।`;
  return `${meanings.join(" ")} Together, these facts make it necessary that ${conclusion}.`;
}

function directOptionReason(
  option: GeneratedSylOption,
  profile: ConclusionContext,
  input: NaturalizeInput,
  proof: SylStructuredProofV3,
): string {
  const ids = profile.classification === "UNDETERMINED"
    ? profile.modelImpactPremiseIds
    : profile.verdictImpactPremiseIds;
  const effectiveIds = ids.length ? ids : proof.combinedReasoning.decisivePremiseIds;
  if (profile.classification === "ENTAILED") return entailedReason(profile, effectiveIds, input, proof, option.isCorrect);
  if (profile.classification === "CONTRADICTED") return impossibleReason(profile, effectiveIds, input, proof);
  if (option.isCorrect && input.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION") {
    if (input.locale === "hi-IN") return `नीचे दिया प्रतिउदाहरण सभी कथनों को सही रखता है, लेकिन इस विकल्प को गलत बनाता है। एक ऐसा उदाहरण ही सिद्ध करता है कि निष्कर्ष आवश्यक नहीं है।`;
    if (input.locale === "pa-IN") return `ਹੇਠਾਂ ਦਿੱਤਾ ਵਿਰੋਧੀ ਮਾਡਲ ਸਾਰੇ ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਰੱਖਦਾ ਹੈ, ਪਰ ਇਸ ਵਿਕਲਪ ਨੂੰ ਗਲਤ ਬਣਾਉਂਦਾ ਹੈ। ਇੱਕ ਅਜਿਹਾ ਉਦਾਹਰਨ ਹੀ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ ਨਤੀਜਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।`;
    return `The countermodel below satisfies every statement but makes this option false. One such example is enough to show that the conclusion is not necessary.`;
  }
  if (option.isCorrect && input.taskKind === "SELECT_GENUINE_POSSIBILITY") {
    if (input.locale === "hi-IN") return `नीचे दिया पूरा मॉडल सभी कथनों को सही रखता है और इस विकल्प को सत्य बनाता है। इसलिए यह वास्तविक संभावना है।`;
    if (input.locale === "pa-IN") return `ਹੇਠਾਂ ਦਿੱਤਾ ਪੂਰਾ ਮਾਡਲ ਸਾਰੇ ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਰੱਖਦਾ ਹੈ ਅਤੇ ਇਸ ਵਿਕਲਪ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਅਸਲ ਸੰਭਾਵਨਾ ਹੈ।`;
    return `The complete model below satisfies every statement and makes this option true. Therefore it is a genuine possibility.`;
  }
  return undeterminedReason(profile, input);
}

function conclusionResults(input: NaturalizeInput): string {
  return input.conclusions.map((entry, index) => {
    const roman = ["I", "II", "III"][index] ?? String(index + 1);
    const status = entry.classification === "ENTAILED"
      ? input.locale === "hi-IN" ? "निश्चित" : input.locale === "pa-IN" ? "ਨਿਸ਼ਚਿਤ" : "follows"
      : entry.classification === "CONTRADICTED"
        ? input.locale === "hi-IN" ? "असंभव" : input.locale === "pa-IN" ? "ਅਸੰਭਵ" : "impossible"
        : input.locale === "hi-IN" ? "निश्चित नहीं" : input.locale === "pa-IN" ? "ਨਿਸ਼ਚਿਤ ਨਹੀਂ" : "does not definitely follow";
    return `${roman}: ${status}`;
  }).join("; ");
}

function combinationOptionReason(option: GeneratedSylOption, input: NaturalizeInput): string {
  const results = conclusionResults(input);
  if (input.locale === "hi-IN") return option.isCorrect
    ? `${results}। यह विकल्प इन परिणामों का सही संयोजन है।`
    : `${results}। यह विकल्प कम-से-कम एक निष्कर्ष का गलत परिणाम बताता है।`;
  if (input.locale === "pa-IN") return option.isCorrect
    ? `${results}। ਇਹ ਵਿਕਲਪ ਇਨ੍ਹਾਂ ਫੈਸਲਿਆਂ ਦਾ ਸਹੀ ਜੋੜ ਹੈ।`
    : `${results}। ਇਹ ਵਿਕਲਪ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਨਤੀਜੇ ਦਾ ਗਲਤ ਫੈਸਲਾ ਦਿੰਦਾ ਹੈ।`;
  return option.isCorrect
    ? `${results}. This option is the exact combination of those results.`
    : `${results}. This option gives the wrong result for at least one conclusion.`;
}

function modalOptionReason(option: GeneratedSylOption, input: NaturalizeInput): string {
  const actual = input.conclusions[0]?.classification;
  const actualLabel = actual === "ENTAILED"
    ? input.locale === "hi-IN" ? "निश्चित रूप से सत्य" : input.locale === "pa-IN" ? "ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ" : "definitely true"
    : actual === "CONTRADICTED"
      ? input.locale === "hi-IN" ? "असंभव" : input.locale === "pa-IN" ? "ਅਸੰਭਵ" : "impossible"
      : input.locale === "hi-IN" ? "संभव, पर निश्चित नहीं" : input.locale === "pa-IN" ? "ਸੰਭਵ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ" : "possible, but not definite";
  if (input.locale === "hi-IN") return option.isCorrect
    ? `निष्कर्ष की वास्तविक श्रेणी “${actualLabel}” है। इसलिए यह विकल्प सही है।`
    : `निष्कर्ष की वास्तविक श्रेणी “${actualLabel}” है। यह विकल्प उस श्रेणी से मेल नहीं खाता।`;
  if (input.locale === "pa-IN") return option.isCorrect
    ? `ਨਤੀਜੇ ਦੀ ਅਸਲ ਸ਼੍ਰੇਣੀ “${actualLabel}” ਹੈ। ਇਸ ਲਈ ਇਹ ਵਿਕਲਪ ਸਹੀ ਹੈ।`
    : `ਨਤੀਜੇ ਦੀ ਅਸਲ ਸ਼੍ਰੇਣੀ “${actualLabel}” ਹੈ। ਇਹ ਵਿਕਲਪ ਉਸ ਸ਼੍ਰੇਣੀ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ।`;
  return option.isCorrect
    ? `The conclusion is ${actualLabel}. Therefore this is the correct modal label.`
    : `The conclusion is ${actualLabel}. This option gives a different modal label.`;
}

function correctProofText(input: NaturalizeInput, proof: SylStructuredProofV3): string {
  const option = input.options[input.correctIndex];
  const profile = profileForOption(option, input);
  if (!profile) return combinationOptionReason(option, input);
  const ids = profile.classification === "UNDETERMINED" ? profile.modelImpactPremiseIds : profile.verdictImpactPremiseIds;
  const effectiveIds = ids.length ? ids : proof.combinedReasoning.decisivePremiseIds;
  if (input.taskKind.includes("MODAL")) return modalOptionReason(option, input);
  if (profile.classification === "ENTAILED") return entailedReason(profile, effectiveIds, input, proof, true);
  if (profile.classification === "CONTRADICTED") return impossibleReason(profile, effectiveIds, input, proof);
  return directOptionReason(option, profile, input, proof);
}

function uniqueSvgIds(svg: string, suffix: string): string {
  const arrow = `arrow-${suffix}`;
  const arrowBack = `arrow-back-${suffix}`;
  return svg
    .replace('id="arrow"', `id="${arrow}"`)
    .replace('id="arrow-back"', `id="${arrowBack}"`)
    .replaceAll('url(#arrow)', `url(#${arrow})`)
    .replaceAll('url(#arrow-back)', `url(#${arrowBack})`);
}

export function naturalizeStructuredProofV3(
  proof: SylStructuredProofV3,
  input: NaturalizeInput,
): SylStructuredProofV3 {
  const analyses = proof.visibleOptionAnalysis.map((analysis, index) => {
    const option = input.options[index];
    const profile = profileForOption(option, input);
    const studentReason = input.taskKind.includes("MODAL")
      ? modalOptionReason(option, input)
      : profile
        ? directOptionReason(option, profile, input, proof)
        : combinationOptionReason(option, input);
    return { ...analysis, studentReason };
  });
  const correctProfile = profileForOption(input.options[input.correctIndex], input) ?? input.conclusions[0] ?? null;
  const decisiveIds = correctProfile
    ? (correctProfile.classification === "UNDETERMINED" ? correctProfile.modelImpactPremiseIds : correctProfile.verdictImpactPremiseIds)
    : proof.combinedReasoning.decisivePremiseIds;
  const effectiveIds = decisiveIds.length ? decisiveIds : proof.combinedReasoning.decisivePremiseIds;
  const meanings = decisiveMeaning(effectiveIds, proof).map(cleanSentence);
  const finalText = input.locale === "hi-IN"
    ? `इन संबंधों को जोड़ने पर सही विकल्प है: ${cleanSentence(input.options[input.correctIndex].text)}।`
    : input.locale === "pa-IN"
      ? `ਇਨ੍ਹਾਂ ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜਨ ਨਾਲ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${cleanSentence(input.options[input.correctIndex].text)}।`
      : `Combining these relations gives the correct option: ${cleanSentence(input.options[input.correctIndex].text)}.`;
  const reasoningSteps = proof.combinedReasoning.reasoningSteps.map((step, index, all) =>
    index === all.length - 1 ? { ...step, text: finalText } : step);
  const summary = `${meanings.join(" ")} ${finalText}`.trim();
  const studentProof = correctProofText(input, proof);
  const svgSuffix = proof.diagramSpec.titleId.replace(/^syl-diagram-title-/u, "");
  const integratedDiagramSvg = uniqueSvgIds(proof.integratedDiagramSvg, svgSuffix);

  const contentHash = hash({
    identity: proof.identity,
    analyses,
    summary,
    reasoningSteps,
    studentProof,
    integratedDiagramSvg,
  });
  const reviewVersionId = `syl-review-${contentHash.slice(0, 20)}`;
  const validationEvidence = proof.validationEvidence.map((entry) => ({
    ...entry,
    contentHash,
  }));

  return {
    ...proof,
    identity: {
      ...proof.identity,
      reviewVersionId,
    },
    combinedReasoning: {
      ...proof.combinedReasoning,
      decisivePremiseIds: effectiveIds,
      reasoningSteps,
      summary,
    },
    visibleOptionAnalysis: analyses,
    correctOptionProof: {
      ...proof.correctOptionProof,
      premiseIdsUsed: effectiveIds,
      reasoningSteps: reasoningSteps.map((step) => step.text),
      studentProof,
    },
    integratedDiagramSvg,
    validationEvidence,
    humanReview: {
      ...proof.humanReview,
      contentVersion: reviewVersionId,
    },
  };
}
