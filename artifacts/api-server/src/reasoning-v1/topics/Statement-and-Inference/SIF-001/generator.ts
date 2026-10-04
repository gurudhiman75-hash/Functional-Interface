import { listSifAuthorities } from "./authorities.ts";
import { answerIndexFor, canonicalSifCandidates, solveSifScenario } from "./solver.ts";
import { assertGeneratedSifQuestion, validateSifAuthority } from "./validators.ts";
import type { GeneratedSifQuestion, SifCpId, SifLocale, SifQuestionFormat, SifScenarioAuthority } from "./types.ts";

const TWO_INFERENCE_OPTIONS = {
  "en-IN": ["Only Inference I follows", "Only Inference II follows", "Either Inference I or II follows", "Neither Inference I nor II follows", "Both Inference I and II follow"],
  "hi-IN": ["केवल अनुमान I सही है", "केवल अनुमान II सही है", "या तो अनुमान I या II सही है", "न अनुमान I न अनुमान II सही है", "अनुमान I और II दोनों सही हैं"],
  "pa-IN": ["ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ", "ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ", "ਅਨੁਮਾਨ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸਹੀ ਹੈ", "ਨਾ ਅਨੁਮਾਨ I ਨਾ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ", "ਅਨੁਮਾਨ I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ"],
} as const;

const INSTRUCTIONS = {
  "en-IN": ["Which inference is supported by the information given?", "What can reasonably be inferred from the information given?", "Consider the following inferences and determine which of them follows."],
  "hi-IN": ["दी गई जानकारी से कौन-सा अनुमान समर्थित है?", "दी गई जानकारी से उचित रूप से क्या अनुमान लगाया जा सकता है?", "निम्न अनुमानों पर विचार कीजिए और बताइए कि कौन-सा सही है।"],
  "pa-IN": ["ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਕਿਹੜਾ ਅਨੁਮਾਨ ਸਮਰਥਿਤ ਹੈ?", "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਵਾਜਬ ਤੌਰ 'ਤੇ ਕੀ ਅਨੁਮਾਨ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?", "ਹੇਠਾਂ ਦਿੱਤੇ ਅਨੁਮਾਨਾਂ 'ਤੇ ਵਿਚਾਰ ਕਰੋ ਅਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜਾ ਸਹੀ ਹੈ।"],
} as const;

function stableHash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function selectAuthority(cpId: SifCpId, seed: number): {
  readonly authority: SifScenarioAuthority;
  readonly poolSize: number;
} {
  const pool = listSifAuthorities(cpId);
  if (pool.length === 0) throw new Error(`${cpId}: no scenario authority`);
  return {
    authority: pool[Math.abs(seed) % pool.length]!,
    poolSize: pool.length,
  };
}

function swapLabels(text: string): string {
  return text.replace(/\bI\b/g, "__SIF_I__").replace(/\bII\b/g, "I").replace(/__SIF_I__/g, "II");
}

function shouldSwapCandidates(
  authority: SifScenarioAuthority,
  seed: number,
  poolSize: number,
): boolean {
  // CP002 retains its explicitly approved presentation baseline.
  if (authority.cpId === "SIF-CP002") return false;

  // Authority selection remains seed % poolSize, but presentation order is
  // independently varied by selection cycle. This prevents even-sized pools
  // from permanently tying one authority to one I/II order.
  const cycle = Math.floor(Math.abs(seed) / poolSize);
  return ((stableHash(authority.id) + cycle) & 1) === 1;
}

export function renderSifAuthority(input: {
  readonly authority: SifScenarioAuthority;
  readonly locale: SifLocale;
  readonly seed: number;
  readonly poolSize: number;
  readonly format?: SifQuestionFormat;
}): GeneratedSifQuestion {
  if (input.format !== undefined && input.format !== "TWO_INFERENCES") {
    throw new Error(`${input.authority.cpId}: ${input.format} is not implemented by the current two-inference renderer`);
  }

  const authority = input.authority;
  const [candidateI, candidateII] = canonicalSifCandidates(authority);
  const sourceAnswerClass = solveSifScenario(authority);
  const swapCandidates = shouldSwapCandidates(authority, input.seed, input.poolSize);
  const answerClass = swapCandidates
    ? sourceAnswerClass === "ONLY_I" ? "ONLY_II"
      : sourceAnswerClass === "ONLY_II" ? "ONLY_I"
        : sourceAnswerClass
    : sourceAnswerClass;
  const displayedCandidates = swapCandidates
    ? [candidateII, candidateI] as const
    : [candidateI, candidateII] as const;

  const format: SifQuestionFormat = "TWO_INFERENCES";
  const instruction = INSTRUCTIONS[input.locale][Math.abs(input.seed) % INSTRUCTIONS[input.locale].length];
  const validation = validateSifAuthority(authority);

  const question: GeneratedSifQuestion = {
    chapterId: "SIF-001",
    cpId: authority.cpId,
    scenarioId: authority.id,
    locale: input.locale,
    seed: input.seed,
    difficulty: authority.difficulty,
    format,
    domain: authority.domain,
    instruction,
    statement: authority.statement[input.locale],
    inferences: [
      displayedCandidates[0].text[input.locale],
      displayedCandidates[1].text[input.locale],
    ],
    options: [...TWO_INFERENCE_OPTIONS[input.locale]],
    correctIndex: answerIndexFor(answerClass),
    answerClass,
    explanation: swapCandidates ? swapLabels(authority.explanation[input.locale]) : authority.explanation[input.locale],
    factIds: authority.facts.map((entry) => entry.id),
    candidateStrengths: [displayedCandidates[0].strength, displayedCandidates[1].strength],
    mechanisms: authority.mechanisms,
    distractorTypes: authority.candidates.flatMap((entry) => entry.distractorType ? [entry.distractorType] : []),
    validation,
    metadata: {
      solver: "SIF_STRENGTH_BACKED_SUPPORT_V2",
      generationOrder: "LOGIC_FIRST_LANGUAGE_SECOND",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
    },
  };
  assertGeneratedSifQuestion(question);
  return question;
}

export function generateSifQuestion(input: {
  readonly cpId: SifCpId;
  readonly locale: SifLocale;
  readonly seed: number;
  readonly format?: SifQuestionFormat;
}): GeneratedSifQuestion {
  const selected = selectAuthority(input.cpId, input.seed);
  return renderSifAuthority({
    authority: selected.authority,
    locale: input.locale,
    seed: input.seed,
    poolSize: selected.poolSize,
    format: input.format,
  });
}
