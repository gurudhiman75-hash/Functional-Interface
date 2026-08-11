import { deterministicIndex } from "./foundation/prng";
import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001FourTierExplanation } from "./cp001-editorial-v2";

interface StoryContext {
  actor: string;
  instrument: string;
  institution: string;
}

const STORY_CONTEXTS: readonly StoryContext[] = [
  { actor: "Meera", instrument: "fixed deposit", institution: "a cooperative bank" },
  { actor: "Harpreet", instrument: "term deposit", institution: "a post office" },
  { actor: "Simran", instrument: "savings certificate", institution: "a savings cooperative" },
  { actor: "Ravi", instrument: "business investment", institution: "a local finance office" },
] as const;

const ALREADY_CONTEXTUAL = /\b(?:Meera|Harpreet|Aman|Gurleen|Ravi|Simran|Navdeep|Kiran|fixed deposit|term deposit|savings certificate|business advance|business investment|crop loan|education loan|equipment loan|post office|bank|credit society|finance office|savings cooperative|local lender)\b/iu;
const GENERIC_TEXTBOOK_OPENING = /^(?:A sum\b|A principal\b|An investment\b|At .+? an investment\b|Under simple interest, a sum\b|The amounts of one sum\b)/u;
const MATH_SEGMENT = /(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/gu;

function storyLead(context: StoryContext): string {
  return `${context.actor}'s ${context.instrument} with ${context.institution}`;
}

export function humaniseIntCp001Stem(
  qlId: IntCp001FinalQlId,
  seed: string,
  stem: string,
): string {
  if (ALREADY_CONTEXTUAL.test(stem)) return stem;

  const context = STORY_CONTEXTS[
    deterministicIndex(`${qlId}:${seed}:editorial-story-v3`, STORY_CONTEXTS.length)
  ]!;
  const lead = storyLead(context);
  let result = stem;

  result = result.replace(
    /^At (.+?) simple interest per annum, an investment amounts to (.+?) after (.+?)\. What principal was invested\?$/u,
    `${lead} amounts to $2 after $3 at $1 simple interest per annum. What was the original principal?`,
  );
  result = result.replace(/^A sum is invested at /u, `${context.actor} places a ${context.instrument} with ${context.institution} at `);
  result = result.replace(/^A sum grows to /u, `${lead} grows to `);
  result = result.replace(/^A sum earns /u, `${lead} earns `);
  result = result.replace(/^A sum produces /u, `${lead} produces `);
  result = result.replace(/^A sum amounts to /u, `${lead} amounts to `);
  result = result.replace(/^A sum remains at /u, `${lead} remains at `);
  result = result.replace(/^A principal of /u, `${context.actor}'s ${context.instrument} of `);
  result = result.replace(/^Under simple interest, a sum /u, `Under simple interest, ${lead} `);
  result = result.replace(/^The amounts of one sum /u, `The amounts of ${lead} `);
  result = result.replace(/^Under simple interest, the amounts /u, `Under simple interest, the amounts of ${lead} `);
  result = result.replace(/^The interest earned is /u, `${lead} earns simple interest equal to `);
  result = result.replace(/^In (.+?), the simple interest is /u, `For ${lead}, the simple interest after $1 is `);
  result = result.replace(/^At (.+?) simple interest per annum, a sum becomes /u, `At $1 simple interest per annum, ${lead} becomes `);

  return result;
}

function mapOutsideMath(text: string, transform: (segment: string) => string): string {
  return text
    .split(MATH_SEGMENT)
    .map((segment) => segment.startsWith("$") ? segment : transform(segment))
    .join("");
}

function latexNumber(raw: string): string {
  const mixed = raw.match(/^(-?\d+)\s+(\d+)\/(\d+)$/u);
  if (mixed) return `${mixed[1]}\\frac{${mixed[2]}}{${mixed[3]}}`;
  const fraction = raw.match(/^(-?\d+)\/(\d+)$/u);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  return raw;
}

function latexDuration(raw: string): string {
  const match = raw.trim().match(/^(-?\d+(?:\s+\d+\/\d+|\/\d+)?)\s+(years?|months?|days?)$/u);
  if (!match) return raw.trim();
  return `${latexNumber(match[1]!)}\\text{ ${match[2]}}`;
}

export function normaliseIntCp001InlineMathText(text: string): string {
  let result = text.replaceAll("₁", "_1").replaceAll("₂", "_2");

  result = mapOutsideMath(result, (segment) => segment
    .replace(
      /Earlier time t_1 = ([^,.]+?(?:years?|months?|days?)) and annual decimal rate r = (-?\d+(?:\s+\d+\/\d+|\/\d+)?)/gu,
      (_match, duration: string, rate: string) => `Earlier time $t_1 = ${latexDuration(duration)}$ and annual decimal rate $r = ${latexNumber(rate)}$`,
    )
    .replace(
      /Time T = ([^,.]+?(?:years?|months?|days?))(?=\.)/gu,
      (_match, duration: string) => `Time $T = ${latexDuration(duration)}$`,
    )
    .replace(
      /Solving the exact linear equation gives t_2 = ([^,.]+?(?:years?|months?|days?))(?=\.)/gu,
      (_match, duration: string) => `Solving the exact linear equation gives $t_2 = ${latexDuration(duration)}$`,
    )
    .replace(
      /Set \(1 \+ rt_2\)\/\(1 \+ rt_1\) = (-?\d+\/\d+)/gu,
      (_match, ratio: string) => `Set $\\frac{1 + rt_2}{1 + rt_1} = ${latexNumber(ratio)}$`,
    )
    .replace(
      /Thus 1 \+ rt_2 = \((-?\d+\/\d+)\)\(1 \+ rt_1\)/gu,
      (_match, ratio: string) => `Thus $1 + rt_2 = ${latexNumber(ratio)}(1 + rt_1)$`,
    )
    .replace(
      /\br = (-?\d+(?:\s+\d+\/\d+|\/\d+)?)/gu,
      (_match, rate: string) => `$r = ${latexNumber(rate)}$`,
    ));

  result = mapOutsideMath(result, (segment) => segment
    .replace(/A_1\s*\/\s*\(1\s*\+\s*rT_1\)/gu, "$\\frac{A_1}{1+rT_1}$")
    .replace(/I\s*\/\s*\(PT\)/gu, "$\\frac{I}{PT}$")
    .replace(/A\s*\/\s*P/gu, "$\\frac{A}{P}$")
    .replace(/I\s*\/\s*P/gu, "$\\frac{I}{P}$")
    .replace(/RT\s*\/\s*100/gu, "$\\frac{RT}{100}$")
    .replace(/\(1\s*\+\s*rT_2\)/gu, "$(1+rT_2)$")
    .replace(/\brt_([12])\b/gu, (_match, index: string) => `$rt_${index}$`)
    .replace(/\bkt_([12])\b/gu, (_match, index: string) => `$kt_${index}$`));

  result = mapOutsideMath(result, (segment) => segment.replace(
    /(?<![\d\\])(-?\d+)\s+(\d+)\/(\d+)(?![\d}])/gu,
    (_match, whole: string, numerator: string, denominator: string) => `$${whole}\\frac{${numerator}}{${denominator}}$`,
  ));
  result = mapOutsideMath(result, (segment) => segment.replace(
    /(?<![\d\\{])(-?\d+)\/(\d+)(?![\d}])/gu,
    (_match, numerator: string, denominator: string) => `$\\frac{${numerator}}{${denominator}}$`,
  ));
  result = mapOutsideMath(result, (segment) => segment.replace(
    /\b([AITt])_([12])\b/gu,
    (_match, variable: string, index: string) => `$${variable}_${index}$`,
  ));

  return result;
}

export function normaliseIntCp001InlineMath(
  explanation: IntCp001FourTierExplanation,
): IntCp001FourTierExplanation {
  const transform = normaliseIntCp001InlineMathText;
  return {
    ...explanation,
    notice: transform(explanation.notice),
    relation: transform(explanation.relation),
    steps: explanation.steps.map(transform),
    verification: transform(explanation.verification),
    conclusion: transform(explanation.conclusion),
    commonTrap: transform(explanation.commonTrap),
    coreConcept: {
      ...explanation.coreConcept,
      narrative: transform(explanation.coreConcept.narrative),
    },
    stepByStep: {
      ...explanation.stepByStep,
      steps: explanation.stepByStep.steps.map(transform),
      verification: transform(explanation.stepByStep.verification),
      conclusion: transform(explanation.stepByStep.conclusion),
    },
    examShortcut: {
      ...explanation.examShortcut,
      narrative: transform(explanation.examShortcut.narrative),
    },
    trapAnalysis: {
      ...explanation.trapAnalysis,
      items: explanation.trapAnalysis.items.map((item) => ({
        ...item,
        explanation: transform(item.explanation),
      })),
    },
  };
}

function stripMath(text: string): string {
  return text.replace(MATH_SEGMENT, " ");
}

export function containsRawAsciiMath(text: string): boolean {
  const prose = stripMath(text);
  return /\b\d+(?:\s+\d+)?\/\d+\b/u.test(prose)
    || /[₁₂]/u.test(prose)
    || /\b(?:A|I)\s*\/\s*P\b/u.test(prose)
    || /\bRT\s*\/\s*100\b/u.test(prose)
    || /\bI\s*\/\s*\(PT\)/u.test(prose)
    || /\b(?:r|t_[12])\s*=\s*\d/u.test(prose);
}

export function hasGenericTextbookStemOpening(stem: string): boolean {
  return GENERIC_TEXTBOOK_OPENING.test(stem);
}
