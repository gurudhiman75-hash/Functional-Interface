import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import {
  createReasoningStep,
  randomInt,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type SimStep = [string, string];

type SimDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number | string>;
  answer: number;
  formula: string;
  steps: SimStep[];
};

function buildSimplificationContext(
  metric = "value",
): QuantScenarioContext {
  return {
    entity: "expression",
    metric,
    context: "simplification",
  };
}

function finalizeSimScenario(
  definition: SimDefinition,
): QuantProceduralScenario {
  return {
    scenarioType: definition.motifId,
    topicCluster: "simplification",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    distractorHints: [
      "arithmeticSlip",
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: definition.steps.map(
      ([type, detail]) =>
        createReasoningStep(type, detail),
    ),
    explanation: [
      ...definition.steps.map(
        ([, detail]) => detail,
      ),
      `Final answer = $${definition.answer}$.`,
    ].join("\n"),
    context: buildSimplificationContext(),
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    structuralSignature: `${definition.motifId}::${definition.branch}::${Object.values(
      definition.values,
    ).join("|")}`,
    validationTokens: undefined,
  };
}

function createSimDefinition(
  motifId: string,
  difficulty: DifficultyLabel,
): SimDefinition {
  switch (motifId) {
    case "sim-vbodmas-basic":
      return {
        motifId,
        branch: "left-to-right-md",
        text: `Simplify $18+6\\times5-24\\div3$.`,
        values: { answer: 40 },
        answer: 40,
        formula: "18+6*5-24/3",
        steps: [
          ["transform", `By VBODMAS, evaluate $6\\times5=30$ and $24\\div3=8$ first.`],
          ["infer", `So $18+30-8=40$.`],
        ],
      };
    case "sim-vbodmas-bracket":
      return {
        motifId,
        branch: "nested-bracket-sign",
        text: `Simplify $72-\\{18-[6-(4-9)]\\}$.`,
        values: { answer: 65 },
        answer: 65,
        formula: "72-(18-(6-(4-9)))",
        steps: [
          ["transform", `First $4-9=-5$, so $6-(4-9)=6-(-5)=11$.`],
          ["transform", `Then $18-11=7$.`],
          ["infer", `Finally $72-7=65$.`],
        ],
      };
    case "sim-vbodmas-of":
    case "sim-percent-of-chain":
      return {
        motifId,
        branch: "of-before-division",
        text: `Simplify $25\\%\\text{ of }400+60\\div5$.`,
        values: { answer: 112 },
        answer: 112,
        formula: "25% of 400 + 60/5",
        steps: [
          ["transform", `$25\\%\\text{ of }400=\\frac{25}{100}\\times400=100$.`],
          ["transform", `$60\\div5=12$.`],
          ["infer", `Required value $=100+12=112$.`],
        ],
      };
    case "sim-vbodmas-vinculum":
      return {
        motifId,
        branch: "vinculum-first",
        text: `Simplify $80-\\overline{12+8\\div4}\\times3$.`,
        values: { answer: 38 },
        answer: 38,
        formula: "80-(12+8/4)*3",
        steps: [
          ["transform", `Inside the vinculum, $12+8\\div4=12+2=14$.`],
          ["infer", `So $80-14\\times3=80-42=38$.`],
        ],
      };
    case "sim-vbodmas-mixed-fraction":
      return {
        motifId,
        branch: "mixed-fraction-product",
        text: `Simplify $2\\frac{1}{2}\\times3\\frac{1}{3}$. If the value is $\\frac{p}{q}$, find $p+q$.`,
        values: { p: 25, q: 3 },
        answer: 28,
        formula: "(5/2)*(10/3)",
        steps: [
          ["transform", `$2\\frac{1}{2}=\\frac{5}{2}$ and $3\\frac{1}{3}=\\frac{10}{3}$.`],
          ["infer", `Product $=\\frac{5}{2}\\times\\frac{10}{3}=\\frac{25}{3}$, so $p+q=28$.`],
        ],
      };
    case "sim-root-square":
      return {
        motifId,
        branch: "perfect-square-root",
        text: `Find $\\sqrt{9801}$.`,
        values: { answer: 99 },
        answer: 99,
        formula: "sqrt(9801)",
        steps: [
          ["classify", `$99^2=(100-1)^2=9801$.`],
          ["infer", `Therefore $\\sqrt{9801}=99$.`],
        ],
      };
    case "sim-root-cube":
      return {
        motifId,
        branch: "perfect-cube-root",
        text: `Find $\\sqrt[3]{175616}$.`,
        values: { answer: 56 },
        answer: 56,
        formula: "cuberoot(175616)",
        steps: [
          ["classify", `$56^3=175616$.`],
          ["infer", `Hence $\\sqrt[3]{175616}=56$.`],
        ],
      };
    case "sim-root-approx":
      return {
        motifId,
        branch: "nearby-square",
        text: `Choose the nearest integer to $\\sqrt{150}$.`,
        values: { answer: 12 },
        answer: 12,
        formula: "sqrt(150)",
        steps: [
          ["compare", `$12^2=144$ and $13^2=169$.`],
          ["infer", `$150$ is closer to $144$, so $\\sqrt{150}$ is nearest to $12$.`],
        ],
      };
    case "sim-root-decimal":
      return {
        motifId,
        branch: "decimal-square-root",
        text: `Find $\\sqrt{0.0009}$.`,
        values: { answer: 0.03 },
        answer: 0.03,
        formula: "sqrt(0.0009)",
        steps: [
          ["transform", `$0.0009=\\frac{9}{10000}$.`],
          ["infer", `$\\sqrt{0.0009}=\\frac{3}{100}=0.03$.`],
        ],
      };
    case "sim-root-surd-add":
      return {
        motifId,
        branch: "like-surd-addition",
        text: `Simplify $\\sqrt{72}+\\sqrt{32}$ as $k\\sqrt{2}$. Find $k$.`,
        values: { answer: 10 },
        answer: 10,
        formula: "sqrt(72)+sqrt(32)",
        steps: [
          ["transform", `$\\sqrt{72}=6\\sqrt{2}$ and $\\sqrt{32}=4\\sqrt{2}$.`],
          ["infer", `Sum $=10\\sqrt{2}$, so $k=10$.`],
        ],
      };
    case "sim-root-rationalize":
    case "sim-alg-surd-conjugate":
      return {
        motifId,
        branch: "conjugate-rationalization",
        text: `Rationalize $\\frac{1}{\\sqrt{5}-2}$. If the value is $\\sqrt5+k$, find $k$.`,
        values: { answer: 2 },
        answer: 2,
        formula: "1/(sqrt(5)-2)",
        steps: [
          ["transform", `Multiply by the conjugate: $\\frac{1}{\\sqrt5-2}\\times\\frac{\\sqrt5+2}{\\sqrt5+2}$.`],
          ["infer", `Denominator $=5-4=1$, so value $=\\sqrt5+2$ and $k=2$.`],
        ],
      };
    case "sim-frac-nested":
      return {
        motifId,
        branch: "continued-fraction-bottom-up",
        text: `Simplify $1+\\cfrac{1}{1+\\cfrac{1}{1+\\cfrac{1}{2}}}$. If the value is $\\frac{p}{q}$, find $p+q$.`,
        values: { p: 8, q: 5 },
        answer: 13,
        formula: "continued fraction",
        steps: [
          ["transform", `Start from the bottom: $1+\\frac12=\\frac32$.`],
          ["transform", `Then $1+\\frac{1}{3/2}=1+\\frac23=\\frac53$.`],
          ["infer", `Finally $1+\\frac{1}{5/3}=1+\\frac35=\\frac85$, so $p+q=13$.`],
        ],
      };
    case "sim-frac-compare":
    case "sim-frac-ascending":
      return {
        motifId,
        branch: "cross-multiply-compare",
        text: `Use $1$ if $\\frac{7}{12}>\\frac{5}{9}$, otherwise use $0$.`,
        values: { answer: 1 },
        answer: 1,
        formula: "7/12 > 5/9",
        steps: [
          ["compare", `Cross-products: $7\\times9=63$ and $5\\times12=60$.`],
          ["infer", `Since $63>60$, $\\frac{7}{12}>\\frac{5}{9}$.`],
        ],
      };
    case "sim-dec-recurring":
      return {
        motifId,
        branch: "pure-recurring",
        text: `Convert $0.\\overline{36}$ into $\\frac{p}{q}$ in lowest terms. Find $p+q$.`,
        values: { p: 4, q: 11 },
        answer: 15,
        formula: "36/99",
        steps: [
          ["transform", `$0.\\overline{36}=\\frac{36}{99}=\\frac{4}{11}$.`],
          ["infer", `So $p+q=4+11=15$.`],
        ],
      };
    case "sim-dec-mixed-recurring":
      return {
        motifId,
        branch: "mixed-recurring",
        text: `Convert $0.12\\overline{3}$ into $\\frac{p}{q}$ in lowest terms. Find $p+q$.`,
        values: { p: 37, q: 300 },
        answer: 337,
        formula: "(123-12)/900",
        steps: [
          ["transform", `$0.12\\overline{3}=\\frac{123-12}{900}=\\frac{111}{900}=\\frac{37}{300}$.`],
          ["infer", `Thus $p+q=37+300=337$.`],
        ],
      };
    case "sim-frac-complex":
      return {
        motifId,
        branch: "complex-fraction-inversion",
        text: `Simplify $\\frac{3}{4}\\div\\frac{9}{16}$. If the value is $\\frac{p}{q}$, find $p+q$.`,
        values: { p: 4, q: 3 },
        answer: 7,
        formula: "(3/4)/(9/16)",
        steps: [
          ["transform", `$\\frac34\\div\\frac9{16}=\\frac34\\times\\frac{16}{9}$.`],
          ["infer", `After cancellation, value $=\\frac43$, so $p+q=7$.`],
        ],
      };
    case "sim-frac-illegal-cancel":
      return {
        motifId,
        branch: "factor-before-cancel",
        text: `Simplify $\\frac{6+12}{6}$ correctly.`,
        values: { answer: 3 },
        answer: 3,
        formula: "(6+12)/6",
        steps: [
          ["filter", `Do not cancel $6$ from only one added term.`],
          ["infer", `$\\frac{6+12}{6}=\\frac{18}{6}=3$.`],
        ],
      };
    case "sim-alg-ident":
      return {
        motifId,
        branch: "difference-of-squares",
        text: `Simplify $998^2-2^2$.`,
        values: { answer: 996000 },
        answer: 996000,
        formula: "a^2-b^2",
        steps: [
          ["transform", `$998^2-2^2=(998-2)(998+2)$.`],
          ["infer", `Value $=996\\times1000=996000$.`],
        ],
      };
    case "sim-alg-cube-id":
      return {
        motifId,
        branch: "cube-identity-cancel",
        text: `Simplify $\\frac{12^3-8^3}{12^2+12\\times8+8^2}$.`,
        values: { answer: 4 },
        answer: 4,
        formula: "(a^3-b^3)/(a^2+ab+b^2)",
        steps: [
          ["transform", `$a^3-b^3=(a-b)(a^2+ab+b^2)$.`],
          ["infer", `The denominator cancels, leaving $12-8=4$.`],
        ],
      };
    case "sim-alg-square-near":
      return {
        motifId,
        branch: "near-square",
        text: `Find $99^2$ using an identity.`,
        values: { answer: 9801 },
        answer: 9801,
        formula: "(100-1)^2",
        steps: [
          ["transform", `$99^2=(100-1)^2=10000-200+1$.`],
          ["infer", `So $99^2=9801$.`],
        ],
      };
    case "sim-alg-product-near":
      return {
        motifId,
        branch: "near-product",
        text: `Find $103\\times97$ using an identity.`,
        values: { answer: 9991 },
        answer: 9991,
        formula: "(100+3)(100-3)",
        steps: [
          ["transform", `$103\\times97=(100+3)(100-3)=100^2-3^2$.`],
          ["infer", `Value $=10000-9=9991$.`],
        ],
      };
    case "sim-alg-ratio-cancel":
      return {
        motifId,
        branch: "common-factor-cancel",
        text: `Simplify $\\frac{36\\times15}{12\\times9}$.`,
        values: { answer: 5 },
        answer: 5,
        formula: "(36*15)/(12*9)",
        steps: [
          ["transform", `Cancel factors: $36\\div12=3$ and $15\\div9=\\frac53$.`],
          ["infer", `Product $=3\\times\\frac53=5$.`],
        ],
      };
    case "sim-index-basic":
      return {
        motifId,
        branch: "same-base-index-law",
        text: `Simplify $2^3\\times2^5\\div2^4$.`,
        values: { answer: 16 },
        answer: 16,
        formula: "2^(3+5-4)",
        steps: [
          ["transform", `$2^3\\times2^5\\div2^4=2^{3+5-4}=2^4$.`],
          ["infer", `$2^4=16$.`],
        ],
      };
    case "sim-index-comparison":
      return {
        motifId,
        branch: "common-base-comparison",
        text: `Use $1$ if $2^{60}>4^{29}$, otherwise use $0$.`,
        values: { answer: 1 },
        answer: 1,
        formula: "2^60 vs (2^2)^29",
        steps: [
          ["transform", `$4^{29}=(2^2)^{29}=2^{58}$.`],
          ["compare", `Since $2^{60}>2^{58}$, the statement is true.`],
        ],
      };
    case "sim-index-zero":
      return {
        motifId,
        branch: "zero-power",
        text: `Find $17^0$.`,
        values: { answer: 1 },
        answer: 1,
        formula: "a^0",
        steps: [
          ["classify", `For any non-zero $a$, $a^0=1$.`],
          ["infer", `Therefore $17^0=1$.`],
        ],
      };
    case "sim-index-negative-base":
      return {
        motifId,
        branch: "negative-base-even-power",
        text: `Find $(-2)^4$.`,
        values: { answer: 16 },
        answer: 16,
        formula: "(-2)^4",
        steps: [
          ["classify", `An even power of a negative base is positive.`],
          ["infer", `$(-2)^4=16$.`],
        ],
      };
    case "sim-index-fractional":
      return {
        motifId,
        branch: "fractional-exponent-root",
        text: `Find $81^{1/2}$.`,
        values: { answer: 9 },
        answer: 9,
        formula: "81^(1/2)",
        steps: [
          ["transform", `$81^{1/2}=\\sqrt{81}$.`],
          ["infer", `So the value is $9$.`],
        ],
      };
    case "sim-index-illegal-merge":
      return {
        motifId,
        branch: "different-base-check",
        text: `Simplify $2^3\\times3^2$.`,
        values: { answer: 72 },
        answer: 72,
        formula: "8*9",
        steps: [
          ["filter", `Bases are different, so exponents cannot be added.`],
          ["infer", `$2^3\\times3^2=8\\times9=72$.`],
        ],
      };
    case "sim-unit-conversion":
      return {
        motifId,
        branch: "common-unit-first",
        text: `Simplify $2\\text{ m}+35\\text{ cm}$ in centimetres.`,
        values: { answer: 235 },
        answer: 235,
        formula: "200+35",
        steps: [
          ["transform", `$2\\text{ m}=200\\text{ cm}$.`],
          ["infer", `Total $=200+35=235\\text{ cm}$.`],
        ],
      };
    case "sim-root-cube-decimal":
      return {
        motifId,
        branch: "decimal-cube-root",
        text: `Find $\\sqrt[3]{0.000216}$.`,
        values: { answer: 0.06 },
        answer: 0.06,
        formula: "cuberoot(0.000216)",
        steps: [
          ["transform", `$0.000216=(0.06)^3$.`],
          ["infer", `Therefore $\\sqrt[3]{0.000216}=0.06$.`],
        ],
      };
    case "sim-dec-fraction-blend":
      return {
        motifId,
        branch: "decimal-fraction-conversion",
        text: `Simplify $0.75+\\frac{1}{8}$. If the result is $\\frac{p}{q}$, find $p+q$.`,
        values: { p: 7, q: 8 },
        answer: 15,
        formula: "3/4+1/8",
        steps: [
          ["transform", `$0.75=\\frac34$.`],
          ["infer", `$\\frac34+\\frac18=\\frac78$, so $p+q=15$.`],
        ],
      };
    case "sim-index-power-tower-small":
      return {
        motifId,
        branch: "power-of-power",
        text: `Simplify $(2^3)^2$.`,
        values: { answer: 64 },
        answer: 64,
        formula: "(2^3)^2",
        steps: [
          ["transform", `$(2^3)^2=2^{3\\times2}=2^6$.`],
          ["infer", `$2^6=64$.`],
        ],
      };
    default: {
      const a =
        difficulty === "Hard"
          ? randomInt(18, 45)
          : randomInt(8, 20);
      return {
        motifId,
        branch: "fallback-vbodmas",
        text: `Simplify $${a}+4\\times6-18\\div3$.`,
        values: { a },
        answer: a + 18,
        formula: "a+4*6-18/3",
        steps: [
          ["transform", `$4\\times6=24$ and $18\\div3=6$.`],
          ["infer", `Value $=${a}+24-6=${a + 18}$.`],
        ],
      };
    }
  }
}

export function createSimplificationScenario(
  _pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const motifId =
    motif?.id?.startsWith("sim-")
      ? motif.id
      : "sim-vbodmas-basic";

  return finalizeSimScenario(
    createSimDefinition(motifId, difficulty),
  );
}
