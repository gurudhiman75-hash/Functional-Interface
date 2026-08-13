import type { TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { TmwCp010Parameters, TmwCp010Solution } from "./cp010-types";
import type { TmwLocalizedLanguage } from "./localization-types";

type Language = "en" | TmwLocalizedLanguage;
type Triplet = readonly [string, string, string];

interface Cp010Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: string;
  parameters?: TmwCp010Parameters;
  solution?: TmwCp010Solution;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, value: Triplet): string {
  return language === "hi" ? value[1] : language === "pa" ? value[2] : value[0];
}
function stop(language: Language): string { return language === "en" ? "." : "।"; }
function math(value: string): string { return `\\(${value}\\)`; }

function pipeName(label: string, kind: string, language: Language): string {
  const letter = label.match(/([A-Z])$/)?.[1] ?? "";
  if (kind === "INLET") return t(language, [`inlet ${letter}`, `भरने वाली पाइप ${letter}`, `ਭਰਨ ਵਾਲੀ ਪਾਈਪ ${letter}`]);
  if (kind === "OUTLET") return t(language, [`outlet ${letter}`, `निकासी पाइप ${letter}`, `ਨਿਕਾਸੀ ਪਾਈਪ ${letter}`]);
  return t(language, [`leak ${letter}`, `रिसाव ${letter}`, `ਰਿਸਾਅ ${letter}`]);
}

function terminalInterval(question: Cp010Question, language: Language): string {
  const index = question.solution?.terminalSegmentIndex;
  const segment = index === undefined ? undefined : question.parameters?.cycle?.[index];
  if (segment?.pipes?.length === 1) {
    const pipe = segment.pipes[0];
    const name = pipeName(pipe.label, pipe.kind, language);
    return t(language, [
      `${name}'s active interval`,
      `${name} के सक्रिय अंतराल`,
      `${name} ਦੇ ਸਰਗਰਮ ਅੰਤਰਾਲ`,
    ]);
  }
  return t(language, ["the terminal active interval", "अंतिम सक्रिय अंतराल", "ਅੰਤਿਮ ਸਰਗਰਮ ਅੰਤਰਾਲ"]);
}

function polishCombinedRateAndLevel(step: string, language: Language): string {
  const unitPattern = language === "en" ? "tank/hour" : language === "hi" ? "टंकी/घंटा" : "ਟੈਂਕੀ/ਘੰਟਾ";
  const match = step.match(new RegExp(`^\\\\\\((r_\\d+=.+?),\\\\quad \\\\Delta L=(.+?)\\\\\\) ${unitPattern}[।.]?$`, "u"));
  if (!match) return step;
  const rate = match[1];
  const level = match[2];
  const rateLead = t(language, ["Net rate in this stage", "इस चरण की शुद्ध दर", "ਇਸ ਪੜਾਅ ਦੀ ਸ਼ੁੱਧ ਦਰ"]);
  const levelLead = t(language, ["level change used next", "आगे उपयोग होने वाला स्तर परिवर्तन", "ਅੱਗੇ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਪੱਧਰ ਬਦਲਾਅ"]);
  return `${rateLead}: ${math(rate)} ${unitPattern}; ${levelLead}: ${math(`\\Delta L=${level}`)}${stop(language)}`;
}

function polishCycleTerminal(question: Cp010Question, learner: TmwLearnerExplanationV2, language: Language): TmwLearnerExplanationV2 {
  const mode = question.solveMode ?? "";
  if (!["findCompletionWithAlternatingPipes", "findCompletionWithPeriodicSchedule", "findCompletionFromArbitraryCyclePhase", "findTerminalActiveSegment", "findBoundaryEventTimeUnderSchedule"].includes(mode)) return learner;
  const interval = terminalInterval(question, language);
  const solution = [...learner.solution];
  const answerText = question.solution?.answerText ?? "";

  if (mode === "findTerminalActiveSegment") {
    solution[solution.length - 1] = t(language, [
      `Testing the next cycle in order shows that the boundary is first reached in ${interval}.`,
      `अगले चक्र को क्रम से जाँचने पर सीमा पहली बार ${interval} में मिलती है।`,
      `ਅਗਲੇ ਚੱਕਰ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਜਾਂਚਣ ਤੇ ਹੱਦ ਪਹਿਲੀ ਵਾਰ ${interval} ਵਿੱਚ ਮਿਲਦੀ ਹੈ।`,
    ]);
    return {
      ...learner,
      solution,
      answer: t(language, [
        `Therefore, the tank first becomes full in ${interval}.`,
        `अतः टंकी ${interval} में पहली बार पूरी भरती है।`,
        `ਇਸ ਲਈ ਟੈਂਕੀ ${interval} ਵਿੱਚ ਪਹਿਲੀ ਵਾਰ ਪੂਰੀ ਭਰਦੀ ਹੈ।`,
      ]),
    };
  }

  solution[solution.length - 1] = t(language, [
    `The boundary is reached in ${interval}; total time = ${answerText}.`,
    `सीमा ${interval} में मिलती है; कुल समय = ${answerText}।`,
    `ਹੱਦ ${interval} ਵਿੱਚ ਮਿਲਦੀ ਹੈ; ਕੁੱਲ ਸਮਾਂ = ${answerText}।`,
  ]);
  return { ...learner, solution };
}

export function polishTmwCp010EditorialReview(question: Cp010Question, language: Language): Cp010Question {
  const cp = question.canonicalProblemId ?? question.cpId ?? "";
  if (cp !== "TMW-CP-010" || !question.learnerExplanation) return question;

  let learner: TmwLearnerExplanationV2 = {
    ...question.learnerExplanation,
    solution: question.learnerExplanation.solution.map((step) => polishCombinedRateAndLevel(step, language)),
  };
  learner = polishCycleTerminal(question, learner, language);

  const presentation = [learner.method, ...learner.solution, learner.answer].join(" ");
  const polishErrors: string[] = [];
  if (language !== "en" && /Pump-on|Pump-off|Drainage|Drain interval|Inlet [A-Z]|Outlet [A-Z]/i.test(presentation)) {
    polishErrors.push("English cycle-segment label remains in localized learner explanation");
  }
  if (/\)\s+(?:tank\/hour|टंकी\/घंटा|ਟੈਂਕੀ\/ਘੰਟਾ)[।.]?$/mu.test(presentation) && /r_\d+=.+\\quad \\Delta L=/u.test(presentation)) {
    polishErrors.push("Rate unit still applies ambiguously to a combined rate-and-level expression");
  }
  if (/टंकी .* का अंतराल में|ਟੈਂਕੀ .* ਦਾ ਅੰਤਰਾਲ ਵਿੱਚ/u.test(presentation)) {
    polishErrors.push("Terminal-segment postposition grammar remains");
  }

  const inherited = question.validation?.errors ?? [];
  const errors = [
    ...inherited.filter((error) => !error.startsWith("CP010 final polish:")),
    ...polishErrors.map((error) => `CP010 final polish: ${error}`),
  ];
  return {
    ...question,
    learnerExplanation: learner,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
