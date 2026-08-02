import {
  addRational,
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./rational";
import { getMalCp003DiscoveryRegistryEntry } from "./cp003-discovery-registry";
import { verifyMalCp003Result } from "./cp003-independent-verifier";
import {
  generateMalCp003Parameters,
  malCp003RequestFingerprint,
} from "./cp003-parameter-generator";
import {
  malCp003ResultFingerprint,
  malCp003RetainedFraction,
  solveMalCp003Request,
} from "./cp003-solver";
import type {
  MalCp003ExecutablePrototypeId,
  MalCp003GeneratedPrototype,
  MalCp003SolveRequest,
  MalCp003SolveResult,
  MalCp003StageDiagram,
  MalCp003ThreeComponentState,
} from "./cp003-types";
import type { MalReasoningGraph, Rational } from "./types";

interface Context {
  original: string;
  refill: string;
  container: string;
}

const CONTEXTS: readonly Context[] = [
  { original: "milk", refill: "water", container: "vessel" },
  { original: "fruit juice", refill: "water", container: "tank" },
  { original: "syrup", refill: "water", container: "container" },
  { original: "liquid A", refill: "liquid B", container: "vessel" },
  { original: "concentrated solution", refill: "solvent", container: "tank" },
  { original: "oil", refill: "lighter oil", container: "drum" },
] as const;

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function contextFor(seed: string): Context {
  return CONTEXTS[hash(`${seed}:context`) % CONTEXTS.length]!;
}

function formatQuantity(value: Rational): string {
  return `${formatRational(value)} litres`;
}

function formatState(state: MalCp003ThreeComponentState): string {
  return `${formatRational(state.componentA)} litres : ${formatRational(
    state.componentB,
  )} litres : ${formatRational(state.componentC)} litres`;
}

function inlineMath(value: string): string {
  return `\\(${value}\\)`;
}

function displayMath(value: string): string {
  return `\\[${value}\\]`;
}

function toLatex(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  return `${sign}\\frac{${numerator}}{${value.denominator}}`;
}

function buildGraph(
  givens: readonly string[],
  relation: string,
  steps: readonly string[],
  verification: string,
  conclusion: string,
): MalReasoningGraph {
  const nodes = givens.map((text, index) => ({
    id: `given-${index + 1}`,
    kind: "GIVEN" as const,
    text,
    dependsOn: [] as string[],
  }));
  nodes.push({
    id: "relation",
    kind: "RELATION",
    text: relation,
    dependsOn: givens.map((_value, index) => `given-${index + 1}`),
  });
  steps.forEach((text, index) => {
    nodes.push({
      id: `derivation-${index + 1}`,
      kind: "DERIVATION",
      text,
      dependsOn: [index === 0 ? "relation" : `derivation-${index}`],
    });
  });
  nodes.push({
    id: "verification",
    kind: "VERIFICATION",
    text: verification,
    dependsOn: [steps.length ? `derivation-${steps.length}` : "relation"],
  });
  nodes.push({
    id: "conclusion",
    kind: "CONCLUSION",
    text: conclusion,
    dependsOn: ["verification"],
  });
  return { nodes };
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const result = [...values];
  let state = hash(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function buildOptions(
  answer: string,
  candidates: readonly { text: string; misconceptionId: string }[],
  seed: string,
) {
  const unique = new Map<string, { text: string; misconceptionId: string }>();
  unique.set(answer, { text: answer, misconceptionId: "CORRECT" });
  for (const candidate of candidates) {
    if (candidate.text.trim() && !unique.has(candidate.text)) {
      unique.set(candidate.text, candidate);
    }
  }
  let offset = 1;
  while (unique.size < 4) {
    const text = `${offset + 1} operations`;
    if (!unique.has(text)) {
      unique.set(text, {
        text,
        misconceptionId: "PLAUSIBLE_STAGE_COUNT_ERROR",
      });
    }
    offset += 1;
  }
  const selected = shuffle([...unique.values()].slice(0, 4), seed);
  const correctIndex = selected.findIndex((item) => item.text === answer);
  if (correctIndex < 0) throw new Error("Correct option was lost.");
  return {
    options: selected.map((item) => item.text),
    optionAudit: selected.map((item) => ({
      ...item,
      isCorrect: item.text === answer,
    })),
    correctIndex,
  };
}

function quantityCandidates(
  answerValue: Rational,
  vesselVolume: Rational,
  removedQuantity: Rational | undefined,
) {
  const complement = subtractRational(vesselVolume, answerValue);
  const candidates: { text: string; misconceptionId: string }[] = [
    {
      text: formatQuantity(complement),
      misconceptionId: "COMPLEMENT_REPORTED",
    },
    {
      text: formatQuantity(addRational(answerValue, rational(1))),
      misconceptionId: "ARITHMETIC_SLIP",
    },
  ];
  if (removedQuantity) {
    candidates.push(
      {
        text: formatQuantity(removedQuantity),
        misconceptionId: "REMOVED_QUANTITY_REPORTED",
      },
      {
        text: formatQuantity(addRational(answerValue, removedQuantity)),
        misconceptionId: "ONE_STAGE_ONLY",
      },
    );
  }
  return candidates;
}

function answerAndOptions(
  request: MalCp003SolveRequest,
  result: MalCp003SolveResult,
  seed: string,
) {
  switch (result.kind) {
    case "FINAL_ORIGINAL_QUANTITY": {
      const vesselVolume =
        request.mode === "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES" ||
        request.mode === "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES"
          ? request.vesselVolume
          : result.quantity;
      const removed =
        request.mode === "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES"
          ? request.removedQuantity
          : request.mode === "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES"
            ? request.removedQuantities[0]
            : undefined;
      const answer = formatQuantity(result.quantity);
      return {
        answer,
        ...buildOptions(
          answer,
          quantityCandidates(result.quantity, vesselVolume, removed),
          seed,
        ),
      };
    }
    case "FINAL_ORIGINAL_FRACTION": {
      const answer = formatRational(result.fraction);
      const removedFraction =
        request.mode === "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES"
          ? request.removedFraction
          : rational(1, 4);
      const oneStage = subtractRational(rational(1), removedFraction);
      const candidates = [
        {
          text: formatRational(subtractRational(rational(1), result.fraction)),
          misconceptionId: "REFILL_FRACTION_REPORTED",
        },
        {
          text: formatRational(oneStage),
          misconceptionId: "ONE_STAGE_ONLY",
        },
        {
          text: formatRational(removedFraction),
          misconceptionId: "REMOVED_FRACTION_REPORTED",
        },
        {
          text: formatRational(multiplyRational(removedFraction, removedFraction)),
          misconceptionId: "REMOVAL_FRACTION_EXPONENTIATED",
        },
      ];
      return { answer, ...buildOptions(answer, candidates, seed) };
    }
    case "FINAL_REFILL_QUANTITY": {
      if (request.mode !== "FINAL_REFILL_QUANTITY_EQUAL_STAGES") {
        throw new Error("Unexpected request for refill answer.");
      }
      const answer = formatQuantity(result.quantity);
      return {
        answer,
        ...buildOptions(
          answer,
          quantityCandidates(
            result.quantity,
            request.vesselVolume,
            request.removedQuantity,
          ),
          seed,
        ),
      };
    }
    case "INITIAL_ORIGINAL_QUANTITY": {
      if (request.mode !== "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL") {
        throw new Error("Unexpected request for initial-quantity answer.");
      }
      const answer = formatQuantity(result.quantity);
      return {
        answer,
        ...buildOptions(
          answer,
          quantityCandidates(
            result.quantity,
            request.vesselVolume,
            request.removedQuantity,
          ),
          seed,
        ),
      };
    }
    case "REMOVAL_QUANTITY_PER_STAGE": {
      if (request.mode !== "REMOVAL_QUANTITY_FROM_FINAL") {
        throw new Error("Unexpected request for removal answer.");
      }
      const answer = formatQuantity(result.quantity);
      return {
        answer,
        ...buildOptions(
          answer,
          quantityCandidates(
            result.quantity,
            request.vesselVolume,
            request.finalOriginalQuantity,
          ),
          seed,
        ),
      };
    }
    case "OPERATION_COUNT": {
      const answer = `${result.operations} operations`;
      const candidates = [
        {
          text: `${Math.max(1, result.operations - 1)} operations`,
          misconceptionId: "ONE_STAGE_TOO_FEW",
        },
        {
          text: `${result.operations + 1} operations`,
          misconceptionId: "ONE_STAGE_TOO_MANY",
        },
        {
          text: `${result.operations * 2} operations`,
          misconceptionId: "LINEAR_STAGE_COUNT",
        },
      ];
      return { answer, ...buildOptions(answer, candidates, seed) };
    }
    case "FINAL_THREE_COMPONENT_STATE": {
      if (request.mode !== "FINAL_THREE_COMPONENT_STATE") {
        throw new Error("Unexpected request for three-component answer.");
      }
      const answer = formatState(result.state);
      const firstStageOnly = (() => {
        const stage = request.stages[0]!;
        const retained = malCp003RetainedFraction(
          request.vesselVolume,
          stage.removedQuantity,
        );
        const state = {
          componentA: multiplyRational(
            request.initialState.componentA,
            retained,
          ),
          componentB: multiplyRational(
            request.initialState.componentB,
            retained,
          ),
          componentC: multiplyRational(
            request.initialState.componentC,
            retained,
          ),
        };
        if (stage.refillComponent === "A") {
          state.componentA = addRational(state.componentA, stage.removedQuantity);
        } else if (stage.refillComponent === "B") {
          state.componentB = addRational(state.componentB, stage.removedQuantity);
        } else {
          state.componentC = addRational(state.componentC, stage.removedQuantity);
        }
        return state;
      })();
      const candidates = [
        {
          text: formatState(firstStageOnly),
          misconceptionId: "SECOND_STAGE_IGNORED",
        },
        {
          text: formatState({
            componentA: result.state.componentA,
            componentB: result.state.componentC,
            componentC: result.state.componentB,
          }),
          misconceptionId: "REFILL_COMPONENTS_SWAPPED",
        },
        {
          text: formatState(request.initialState),
          misconceptionId: "INITIAL_STATE_REPORTED",
        },
      ];
      return { answer, ...buildOptions(answer, candidates, seed) };
    }
  }
}

function stageDiagram(
  request: MalCp003SolveRequest,
  result: MalCp003SolveResult,
  context: Context,
): MalCp003StageDiagram {
  let vesselVolume: Rational;
  let initialOriginal: Rational;
  let removedQuantities: readonly Rational[];
  let refillLabels: readonly string[];

  switch (request.mode) {
    case "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES":
      vesselVolume = request.vesselVolume;
      initialOriginal = request.initialOriginalQuantity;
      removedQuantities = Array.from(
        { length: request.operations },
        () => request.removedQuantity,
      );
      refillLabels = removedQuantities.map(() => context.refill);
      break;
    case "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES":
      vesselVolume = rational(1);
      initialOriginal = rational(1);
      removedQuantities = Array.from(
        { length: request.operations },
        () => request.removedFraction,
      );
      refillLabels = removedQuantities.map(() => context.refill);
      break;
    case "FINAL_REFILL_QUANTITY_EQUAL_STAGES":
      vesselVolume = request.vesselVolume;
      initialOriginal = request.vesselVolume;
      removedQuantities = Array.from(
        { length: request.operations },
        () => request.removedQuantity,
      );
      refillLabels = removedQuantities.map(() => context.refill);
      break;
    case "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL":
      if (result.kind !== "INITIAL_ORIGINAL_QUANTITY") {
        throw new Error("Initial result required for stage diagram.");
      }
      vesselVolume = request.vesselVolume;
      initialOriginal = result.quantity;
      removedQuantities = Array.from(
        { length: request.operations },
        () => request.removedQuantity,
      );
      refillLabels = removedQuantities.map(() => context.refill);
      break;
    case "REMOVAL_QUANTITY_FROM_FINAL":
      if (result.kind !== "REMOVAL_QUANTITY_PER_STAGE") {
        throw new Error("Removal result required for stage diagram.");
      }
      vesselVolume = request.vesselVolume;
      initialOriginal = request.initialOriginalQuantity;
      removedQuantities = Array.from(
        { length: request.operations },
        () => result.quantity,
      );
      refillLabels = removedQuantities.map(() => context.refill);
      break;
    case "OPERATION_COUNT_FROM_FINAL":
      if (result.kind !== "OPERATION_COUNT") {
        throw new Error("Operation result required for stage diagram.");
      }
      vesselVolume = request.vesselVolume;
      initialOriginal = request.initialOriginalQuantity;
      removedQuantities = Array.from(
        { length: result.operations },
        () => request.removedQuantity,
      );
      refillLabels = removedQuantities.map(() => context.refill);
      break;
    case "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES":
      vesselVolume = request.vesselVolume;
      initialOriginal = request.initialOriginalQuantity;
      removedQuantities = request.removedQuantities;
      refillLabels = removedQuantities.map(() => context.refill);
      break;
    case "FINAL_THREE_COMPONENT_STATE":
      vesselVolume = request.vesselVolume;
      initialOriginal = request.initialState.componentA;
      removedQuantities = request.stages.map((stage) => stage.removedQuantity);
      refillLabels = request.stages.map((stage) =>
        stage.refillComponent === "B" ? "liquid B" : "liquid C",
      );
      break;
  }

  let current = initialOriginal;
  const stages = removedQuantities.map((removedQuantity, index) => {
    const retainedFraction = malCp003RetainedFraction(
      vesselVolume,
      removedQuantity,
    );
    current = multiplyRational(current, retainedFraction);
    return {
      stage: index + 1,
      removedQuantity: formatRational(removedQuantity),
      retainedFraction: formatRational(retainedFraction),
      refillComponent: refillLabels[index]!,
      originalQuantityAfterStage: formatRational(current),
    };
  });

  return {
    type: "REPLACEMENT_STAGE_STRIP",
    title: "Original component retained after each replacement",
    quantityUnit: "litres",
    stages,
    note:
      "Each removed sample has the vessel's current composition. Refill restores the total volume but does not restore the removed original component.",
  };
}

function author(
  request: MalCp003SolveRequest,
  result: MalCp003SolveResult,
  context: Context,
) {
  let stem: string;
  let coreConcept: string;
  let formula: string;
  let steps: string[];
  let verification: string;
  let conclusion: string;
  let examShortcut: string;
  let commonTrap: string;

  switch (request.mode) {
    case "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES": {
      if (result.kind !== "FINAL_ORIGINAL_QUANTITY") throw new Error("Result mismatch.");
      const oneStage = malCp003RetainedFraction(
        request.vesselVolume,
        request.removedQuantity,
      );
      stem = `A ${context.container} contains ${formatQuantity(
        request.initialOriginalQuantity,
      )} of ${context.original} in a total volume of ${formatQuantity(
        request.vesselVolume,
      )}. Each time, ${formatQuantity(
        request.removedQuantity,
      )} of the well-mixed liquid is removed and replaced with ${
        context.refill
      }. After ${request.operations} such operations, how much of the original ${
        context.original
      } remains?`;
      coreConcept =
        "A homogeneous sample removes the same fraction of every component. Because the vessel is refilled to the same volume, the same retained fraction applies at every stage.";
      formula = displayMath(
        `Q_n=Q_0\\left(1-\\frac{r}{V}\\right)^n`,
      );
      steps = [
        `Step 1: Vessel volume ${inlineMath(`V=${toLatex(request.vesselVolume)}`)} and removal ${inlineMath(`r=${toLatex(request.removedQuantity)}`)}.`,
        `Step 2: Fraction retained after one operation: ${displayMath(`1-\\frac{r}{V}=1-\\frac{${toLatex(request.removedQuantity)}}{${toLatex(request.vesselVolume)}}=${toLatex(oneStage)}`)}`,
        `Step 3: After ${request.operations} operations, the total retained fraction is ${displayMath(`\\left(${toLatex(oneStage)}\\right)^{${request.operations}}=${toLatex(result.retainedFraction)}`)}`,
        `Step 4: Multiply the initial ${context.original} quantity by that fraction: ${displayMath(`${toLatex(request.initialOriginalQuantity)}\\times ${toLatex(result.retainedFraction)}=${toLatex(result.quantity)}\\,\\text{litres}`)}`,
      ];
      verification = `The stage strip independently applies the retained fraction ${formatRational(
        oneStage,
      )} once per operation and reaches ${formatQuantity(result.quantity)}.`;
      conclusion = `${formatQuantity(result.quantity)} of the original ${context.original} remains.`;
      examShortcut = `Retain ${formatRational(oneStage)} each time; therefore multiply the starting amount by ${formatRational(oneStage)} raised to ${request.operations}.`;
      commonTrap =
        "Do not subtract the removed quantity repeatedly from the original component. After the first operation, later samples contain some refill liquid too.";
      break;
    }

    case "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES": {
      if (result.kind !== "FINAL_ORIGINAL_FRACTION") throw new Error("Result mismatch.");
      const oneStage = subtractRational(rational(1), request.removedFraction);
      stem = `In every operation, ${formatRational(
        request.removedFraction,
      )} of a well-mixed vessel is removed and replaced with a liquid containing none of the original component. After ${
        request.operations
      } operations, what fraction of the original component remains?`;
      coreConcept =
        "Only the retained fraction matters when the question asks for a fraction of the original component; the actual vessel size cancels.";
      formula = displayMath(`R_n=(1-f)^n`);
      steps = [
        `Step 1: Removed fraction per operation is ${inlineMath(toLatex(request.removedFraction))}.`,
        `Step 2: Retained fraction per operation is ${displayMath(`1-${toLatex(request.removedFraction)}=${toLatex(oneStage)}`)}`,
        `Step 3: Apply that same factor ${request.operations} times: ${displayMath(`R_n=\\left(${toLatex(oneStage)}\\right)^{${request.operations}}`)}`,
        `Step 4: Simplify to ${displayMath(`R_n=${toLatex(result.fraction)}`)}`,
      ];
      verification = `Multiplying by ${formatRational(oneStage)} stage by stage gives ${formatRational(result.fraction)}.`;
      conclusion = `${formatRational(result.fraction)} of the original component remains.`;
      examShortcut = `Write ${formatRational(oneStage)} to the power ${request.operations}.`;
      commonTrap =
        "Do not use 1 minus the total removed fraction. Each new sample is taken from the changed mixture, so retention is multiplicative.";
      break;
    }

    case "FINAL_REFILL_QUANTITY_EQUAL_STAGES": {
      if (result.kind !== "FINAL_REFILL_QUANTITY") throw new Error("Result mismatch.");
      const oneStage = malCp003RetainedFraction(
        request.vesselVolume,
        request.removedQuantity,
      );
      stem = `A ${context.container} initially contains ${formatQuantity(
        request.vesselVolume,
      )} of ${context.original}. In each operation, ${formatQuantity(
        request.removedQuantity,
      )} is removed from the well-mixed contents and replaced with ${context.refill}. After ${
        request.operations
      } operations, how much ${context.refill} is present?`;
      coreConcept =
        "Find the original component left after all stages. Since the vessel returns to its original volume after every refill, the rest of the final volume is the refill component.";
      formula = `${displayMath(`Q_n=V\\left(1-\\frac{r}{V}\\right)^n`)}\n${displayMath(`\\text{refill quantity}=V-Q_n`)}`;
      steps = [
        `Step 1: Retained fraction per operation is ${displayMath(`1-\\frac{${toLatex(request.removedQuantity)}}{${toLatex(request.vesselVolume)}}=${toLatex(oneStage)}`)}`,
        `Step 2: Original ${context.original} left after ${request.operations} operations is ${displayMath(`${toLatex(request.vesselVolume)}\\left(${toLatex(oneStage)}\\right)^{${request.operations}}=${toLatex(result.originalQuantityRemaining)}\\,\\text{litres}`)}`,
        `Step 3: The final total is still ${formatQuantity(request.vesselVolume)}.`,
        `Step 4: ${context.refill} present = total − original left: ${displayMath(`${toLatex(request.vesselVolume)}-${toLatex(result.originalQuantityRemaining)}=${toLatex(result.quantity)}\\,\\text{litres}`)}`,
      ];
      verification = `Original component ${formatQuantity(
        result.originalQuantityRemaining,
      )} plus refill component ${formatQuantity(result.quantity)} equals the vessel volume.`;
      conclusion = `${formatQuantity(result.quantity)} of ${context.refill} is present.`;
      examShortcut = `Find the original fraction left, then take its complement and multiply by the vessel volume.`;
      commonTrap =
        "Do not multiply the amount refilled per operation by the number of operations. Some refill liquid is removed in later operations.";
      break;
    }

    case "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL": {
      if (result.kind !== "INITIAL_ORIGINAL_QUANTITY") throw new Error("Result mismatch.");
      const oneStage = malCp003RetainedFraction(
        request.vesselVolume,
        request.removedQuantity,
      );
      stem = `A ${context.container} has a fixed volume of ${formatQuantity(
        request.vesselVolume,
      )}. Each time, ${formatQuantity(
        request.removedQuantity,
      )} of the well-mixed liquid is removed and replaced with ${context.refill}. After ${
        request.operations
      } operations, ${formatQuantity(
        request.finalOriginalQuantity,
      )} of the original ${context.original} remains. How much ${context.original} was present initially?`;
      coreConcept =
        "The final amount equals the initial amount multiplied by the total retained fraction. Reverse the relation by dividing by that fraction.";
      formula = displayMath(
        `Q_0=\\frac{Q_n}{\\left(1-\\frac{r}{V}\\right)^n}`,
      );
      steps = [
        `Step 1: Retained fraction per stage is ${displayMath(`1-\\frac{${toLatex(request.removedQuantity)}}{${toLatex(request.vesselVolume)}}=${toLatex(oneStage)}`)}`,
        `Step 2: Total retained fraction is ${displayMath(`\\left(${toLatex(oneStage)}\\right)^{${request.operations}}=${toLatex(result.retainedFraction)}`)}`,
        `Step 3: Write ${displayMath(`${toLatex(request.finalOriginalQuantity)}=Q_0\\times ${toLatex(result.retainedFraction)}`)}`,
        `Step 4: Divide to obtain ${displayMath(`Q_0=\\frac{${toLatex(request.finalOriginalQuantity)}}{${toLatex(result.retainedFraction)}}=${toLatex(result.quantity)}\\,\\text{litres}`)}`,
      ];
      verification = `Starting with ${formatQuantity(result.quantity)} and applying the replacement stages gives ${formatQuantity(request.finalOriginalQuantity)}.`;
      conclusion = `Initially, ${formatQuantity(result.quantity)} of ${context.original} was present.`;
      examShortcut = `Divide the final original amount by ${formatRational(result.retainedFraction)}.`;
      commonTrap =
        "Do not multiply the final amount by the retained fraction; that moves one more step forward instead of reversing the process.";
      break;
    }

    case "REMOVAL_QUANTITY_FROM_FINAL": {
      if (result.kind !== "REMOVAL_QUANTITY_PER_STAGE") throw new Error("Result mismatch.");
      stem = `A ${context.container} of volume ${formatQuantity(
        request.vesselVolume,
      )} initially contains ${formatQuantity(
        request.initialOriginalQuantity,
      )} of ${context.original}. The same quantity is removed from the well-mixed liquid and replaced with ${context.refill} in each of ${
        request.operations
      } operations. If ${formatQuantity(
        request.finalOriginalQuantity,
      )} of the original ${context.original} remains, how much liquid was removed each time?`;
      coreConcept =
        "First find the total retained fraction, then take its exact operation-count root to obtain the one-stage retained fraction.";
      formula = displayMath(
        `r=V\\left[1-\\sqrt[n]{\\frac{Q_n}{Q_0}}\\right]`,
      );
      const totalFraction = divideRational(
        request.finalOriginalQuantity,
        request.initialOriginalQuantity,
      );
      steps = [
        `Step 1: Total retained fraction is ${displayMath(`\\frac{Q_n}{Q_0}=\\frac{${toLatex(request.finalOriginalQuantity)}}{${toLatex(request.initialOriginalQuantity)}}=${toLatex(totalFraction)}`)}`,
        `Step 2: Take the ${request.operations}th root: ${displayMath(`1-\\frac{r}{V}=\\sqrt[${request.operations}]{${toLatex(totalFraction)}}=${toLatex(result.retainedFractionPerStage)}`)}`,
        `Step 3: Removed fraction per stage is ${displayMath(`\\frac{r}{V}=1-${toLatex(result.retainedFractionPerStage)}`)}`,
        `Step 4: Multiply by the vessel volume: ${displayMath(`r=${toLatex(request.vesselVolume)}\\left(1-${toLatex(result.retainedFractionPerStage)}\\right)=${toLatex(result.quantity)}\\,\\text{litres}`)}`,
      ];
      verification = `Removing ${formatQuantity(result.quantity)} at each stage reproduces the stated final original quantity.`;
      conclusion = `${formatQuantity(result.quantity)} was removed in each operation.`;
      examShortcut = `Take the exact ${request.operations}th root of final ÷ initial, subtract from 1, and multiply by the vessel volume.`;
      commonTrap =
        "Do not divide the total loss equally among the operations. The amount of original component removed becomes smaller at later stages.";
      break;
    }

    case "OPERATION_COUNT_FROM_FINAL": {
      if (result.kind !== "OPERATION_COUNT") throw new Error("Result mismatch.");
      const oneStage = malCp003RetainedFraction(
        request.vesselVolume,
        request.removedQuantity,
      );
      const totalFraction = divideRational(
        request.finalOriginalQuantity,
        request.initialOriginalQuantity,
      );
      stem = `A ${context.container} contains ${formatQuantity(
        request.initialOriginalQuantity,
      )} of ${context.original} in a total volume of ${formatQuantity(
        request.vesselVolume,
      )}. In each operation, ${formatQuantity(
        request.removedQuantity,
      )} of the well-mixed liquid is replaced with ${context.refill}. How many operations are needed for the original ${context.original} to become ${formatQuantity(
        request.finalOriginalQuantity,
      )}?`;
      coreConcept =
        "The operation count is the unique integer exponent that changes the one-stage retained fraction into the observed total retained fraction.";
      formula = displayMath(
        `\\frac{Q_n}{Q_0}=\\left(1-\\frac{r}{V}\\right)^n`,
      );
      steps = [
        `Step 1: Retained fraction per operation is ${displayMath(`1-\\frac{${toLatex(request.removedQuantity)}}{${toLatex(request.vesselVolume)}}=${toLatex(oneStage)}`)}`,
        `Step 2: Required total retained fraction is ${displayMath(`\\frac{${toLatex(request.finalOriginalQuantity)}}{${toLatex(request.initialOriginalQuantity)}}=${toLatex(totalFraction)}`)}`,
        `Step 3: Solve the exact integer relation ${displayMath(`\\left(${toLatex(oneStage)}\\right)^n=${toLatex(totalFraction)}`)}`,
        `Step 4: The unique integer exponent is ${inlineMath(`n=${result.operations}`)}.`,
      ];
      verification = `Applying ${formatRational(oneStage)} exactly ${result.operations} times gives the stated final amount.`;
      conclusion = `${result.operations} operations are required.`;
      examShortcut = `List successive powers of ${formatRational(oneStage)} until the target fraction ${formatRational(totalFraction)} appears.`;
      commonTrap =
        "Do not calculate operations from total quantity removed. Every later sample contains less of the original component.";
      break;
    }

    case "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES": {
      if (result.kind !== "FINAL_ORIGINAL_QUANTITY") throw new Error("Result mismatch.");
      stem = `A ${context.container} of volume ${formatQuantity(
        request.vesselVolume,
      )} contains ${formatQuantity(
        request.initialOriginalQuantity,
      )} of ${context.original}. Successive well-mixed samples of ${request.removedQuantities
        .map(formatQuantity)
        .join(", ")} are removed, and the vessel is restored with ${
        context.refill
      } after every removal. How much of the original ${context.original} remains?`;
      coreConcept =
        "When the removed amounts differ, calculate a separate retained fraction for every stage and multiply those factors.";
      formula = displayMath(`Q=Q_0\\prod_i\\left(1-\\frac{r_i}{V}\\right)`);
      let cumulative = rational(1);
      steps = request.removedQuantities.map((removed, index) => {
        const retained = malCp003RetainedFraction(
          request.vesselVolume,
          removed,
        );
        cumulative = multiplyRational(cumulative, retained);
        return `Step ${index + 1}: Stage ${index + 1} retains ${displayMath(`1-\\frac{${toLatex(removed)}}{${toLatex(request.vesselVolume)}}=${toLatex(retained)}`)}; cumulative retained fraction = ${inlineMath(toLatex(cumulative))}.`;
      });
      steps.push(
        `Step ${steps.length + 1}: Multiply by the initial quantity: ${displayMath(`${toLatex(request.initialOriginalQuantity)}\\times ${toLatex(result.retainedFraction)}=${toLatex(result.quantity)}\\,\\text{litres}`)}`,
      );
      verification = `The stage strip applies each different retention factor in the stated order and reaches ${formatQuantity(result.quantity)}.`;
      conclusion = `${formatQuantity(result.quantity)} of the original ${context.original} remains.`;
      examShortcut = `Multiply the stage factors first, then apply the product once to the initial original quantity.`;
      commonTrap =
        "Do not replace the different removals with their average. The required quantity is a product of the actual stage factors.";
      break;
    }

    case "FINAL_THREE_COMPONENT_STATE": {
      if (result.kind !== "FINAL_THREE_COMPONENT_STATE") throw new Error("Result mismatch.");
      const first = request.stages[0]!;
      const second = request.stages[1]!;
      stem = `A vessel initially contains ${formatQuantity(
        request.vesselVolume,
      )} of liquid A. First, ${formatQuantity(
        first.removedQuantity,
      )} of the well-mixed contents is removed and replaced with liquid B. Then ${formatQuantity(
        second.removedQuantity,
      )} of the new well-mixed contents is removed and replaced with liquid C. What are the final quantities of A, B and C, in that order?`;
      coreConcept =
        "Every removal acts on all components currently in the vessel. Track A, B and C separately through each stage, then add the refill to its named component.";
      formula = displayMath(
        `q_{j,\\text{after}}=q_{j,\\text{before}}\\left(1-\\frac{r}{V}\\right)+\\mathbf{1}_{j=\\text{refill}}r`,
      );
      const firstRetention = malCp003RetainedFraction(
        request.vesselVolume,
        first.removedQuantity,
      );
      const afterFirstA = multiplyRational(
        request.initialState.componentA,
        firstRetention,
      );
      const afterFirstB = first.removedQuantity;
      const secondRetention = malCp003RetainedFraction(
        request.vesselVolume,
        second.removedQuantity,
      );
      steps = [
        `Step 1: First-stage retained fraction is ${inlineMath(toLatex(firstRetention))}.`,
        `Step 2: After the first refill, A = ${formatQuantity(afterFirstA)}, B = ${formatQuantity(afterFirstB)}, C = 0 litres.`,
        `Step 3: Second-stage retained fraction is ${inlineMath(toLatex(secondRetention))}. Multiply both A and B by this factor.`,
        `Step 4: Add ${formatQuantity(second.removedQuantity)} of liquid C after the second removal.`,
        `Step 5: Final A:B:C quantities are ${displayMath(`${toLatex(result.state.componentA)}:${toLatex(result.state.componentB)}:${toLatex(result.state.componentC)}\\,\\text{litres}`)}`,
      ];
      verification = `The final quantities sum to ${formatQuantity(request.vesselVolume)}, and each stage uses the vessel's current composition.`;
      conclusion = `The final quantities are ${formatState(result.state)}.`;
      examShortcut =
        "Use a three-column stage ledger. Multiply every existing column by the retained fraction, then place the refill in only its own column.";
      commonTrap =
        "Do not remove the second sample from liquid A alone. By then the vessel contains both A and B, so both are reduced proportionally.";
      break;
    }
  }

  return {
    stem,
    explanation: {
      layoutId: "MAL-CP003-EN-RETENTION-STAGES-DISCOVERY-V1" as const,
      coreConcept,
      formula,
      steps,
      verification,
      conclusion,
      examShortcut,
      commonTrap,
    },
  };
}

export function generateMalCp003DiscoveryPrototype(
  prototypeId: MalCp003ExecutablePrototypeId,
  seed = `mal-cp003:${prototypeId}:default`,
): MalCp003GeneratedPrototype {
  const registry = getMalCp003DiscoveryRegistryEntry(prototypeId);
  if (registry.discoveryStatus !== "EXECUTABLE_DISCOVERY") {
    throw new Error(`${prototypeId} is not executable in the current frontier.`);
  }
  const generated = generateMalCp003Parameters(prototypeId, seed);
  const solution = solveMalCp003Request(generated.request);
  const verification = verifyMalCp003Result(generated.request, solution);
  const context = contextFor(`${prototypeId}:${seed}`);
  const authored = author(generated.request, solution, context);
  const answerPackage = answerAndOptions(
    generated.request,
    solution,
    `${prototypeId}:${seed}:options`,
  );
  const diagram = stageDiagram(generated.request, solution, context);
  const conclusion = authored.explanation.conclusion;
  const reasoningGraph = buildGraph(
    [
      `Prototype ${prototypeId}`,
      `Request ${malCp003RequestFingerprint(generated.request)}`,
    ],
    registry.decisiveInvariant,
    authored.explanation.steps,
    authored.explanation.verification,
    conclusion,
  );
  const errors = [...verification.errors];
  if (!authored.stem.endsWith("?")) errors.push("Stem must end with a question mark.");
  if (/\\b(undefined|null|NaN)\\b/u.test(authored.stem)) {
    errors.push("Stem contains invalid placeholder text.");
  }
  if (authored.explanation.steps.length < 4) {
    errors.push("Explanation has fewer than four worked steps.");
  }
  if (/alligation/iu.test(JSON.stringify(authored.explanation))) {
    errors.push("Repeated replacement explanation unexpectedly uses alligation.");
  }
  if (answerPackage.options.length !== 4) {
    errors.push("Question must contain four options.");
  }
  if (new Set(answerPackage.options).size !== 4) {
    errors.push("Options are not canonically unique.");
  }
  if (answerPackage.options[answerPackage.correctIndex] !== answerPackage.answer) {
    errors.push("Correct option does not match canonical answer.");
  }
  if (!conclusion.includes(answerPackage.answer)) {
    errors.push("Conclusion does not state the canonical answer.");
  }
  if (diagram.stages.length < 2) {
    errors.push("Stage diagram must show at least two replacement stages.");
  }

  return {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-003",
    prototypeId,
    permanentQlId: null,
    questionLanguageId: `${prototypeId}-EN-DISCOVERY`,
    language: "en",
    seed,
    difficulty: registry.baseDifficulty,
    taskDirection: registry.taskDirection,
    answerSemantic: registry.answerSemantic,
    stem: authored.stem,
    request: generated.request,
    solution,
    answer: answerPackage.answer,
    options: answerPackage.options,
    optionAudit: answerPackage.optionAudit,
    correctIndex: answerPackage.correctIndex,
    explanation: authored.explanation,
    reasoningGraph,
    diagram,
    mathematicalFingerprint: [
      prototypeId,
      malCp003RequestFingerprint(generated.request),
      malCp003ResultFingerprint(solution),
    ].join("|"),
    validation: { ok: errors.length === 0, errors },
    maturity: "DISCOVERY_PROTOTYPE",
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  };
}

export function cp003Stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}
