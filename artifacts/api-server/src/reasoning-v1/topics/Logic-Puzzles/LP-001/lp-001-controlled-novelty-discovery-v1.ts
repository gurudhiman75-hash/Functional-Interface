import {
  generateLp011Batch,
  solveLp011,
  type Lp011AttributeId,
  type Lp011BoxId,
  type Lp011Position,
  type Lp011State,
} from "./lp-011.ts";
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from "../../../shared/reasoning-novelty-governance-v1";

export const LP_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  "LP_001_CONTROLLED_NOVELTY_DISCOVERY_V1" as const;

const BOXES: readonly Lp011BoxId[] = ["A", "B", "C", "D", "E"];
const ATTRIBUTES: readonly Lp011AttributeId[] = ["U", "V", "W", "X", "Y"];

function stateEquals(left: Lp011State, right: Lp011State): boolean {
  return BOXES.every(
    (box) =>
      left.positionByBox[box] === right.positionByBox[box] &&
      left.attributeByBox[box] === right.attributeByBox[box],
  );
}

function boxAtPosition(state: Lp011State, position: Lp011Position): Lp011BoxId {
  const box = BOXES.find((candidate) => state.positionByBox[candidate] === position);
  if (!box) throw new Error("LP controlled-novel state is missing stack position " + position + ".");
  return box;
}

function boxWithAttribute(state: Lp011State, attribute: Lp011AttributeId): Lp011BoxId {
  const box = BOXES.find((candidate) => state.attributeByBox[candidate] === attribute);
  if (!box) throw new Error("LP controlled-novel state is missing attribute " + attribute + ".");
  return box;
}

function swapBoxPositions(
  state: Lp011State,
  left: Lp011BoxId,
  right: Lp011BoxId,
): Lp011State {
  const positionByBox = { ...state.positionByBox };
  const leftPosition = positionByBox[left];
  positionByBox[left] = positionByBox[right];
  positionByBox[right] = leftPosition;
  return {
    positionByBox,
    attributeByBox: { ...state.attributeByBox },
  };
}

function immediatelyAbove(
  state: Lp011State,
  box: Lp011BoxId,
): Lp011BoxId | null {
  const position = state.positionByBox[box];
  if (position >= 5) return null;
  return boxAtPosition(state, (position + 1) as Lp011Position);
}

function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

type Perturbation = {
  swap: readonly [Lp011BoxId, Lp011BoxId];
  targetAttribute: Lp011AttributeId;
  targetBox: Lp011BoxId;
  baseAnswer: Lp011BoxId | null;
  modifiedAnswer: Lp011BoxId;
  modifiedState: Lp011State;
};

function validPerturbations(state: Lp011State): Perturbation[] {
  const result: Perturbation[] = [];

  for (let leftIndex = 0; leftIndex < BOXES.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < BOXES.length; rightIndex += 1) {
      const left = BOXES[leftIndex]!;
      const right = BOXES[rightIndex]!;
      const modifiedState = swapBoxPositions(state, left, right);

      for (const targetAttribute of ATTRIBUTES) {
        const targetBox = boxWithAttribute(state, targetAttribute);
        const modifiedAnswer = immediatelyAbove(modifiedState, targetBox);
        if (!modifiedAnswer) continue;

        const baseAnswer = immediatelyAbove(state, targetBox);
        if (baseAnswer === modifiedAnswer) continue;

        result.push({
          swap: [left, right],
          targetAttribute,
          targetBox,
          baseAnswer,
          modifiedAnswer,
          modifiedState,
        });
      }
    }
  }

  return result;
}

export interface LpControlledNovelPostSolutionSwapCandidateV1 {
  readonly candidateId: string;
  readonly provenance: "CONTROLLED_NOVEL";
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly parentQlIds: readonly ["LP-QL-042", "LP-QL-043"];
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly semanticFingerprint: string;
  readonly solverAgreement: true;
  readonly permanentQlAllocated: false;
  readonly nextAvailableQl: "LP-QL-048";
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
  readonly structuredState: {
    readonly caseletId: string;
    readonly swap: readonly [Lp011BoxId, Lp011BoxId];
    readonly targetAttribute: Lp011AttributeId;
    readonly targetAttributeLabel: string;
    readonly targetBox: Lp011BoxId;
    readonly baseAnswer: Lp011BoxId | null;
    readonly modifiedAnswer: Lp011BoxId;
    readonly uniqueBaseSolutionCount: 1;
  };
}

export function generateLpControlledNovelPostSolutionSwapCandidateV1(
  seed: number,
): LpControlledNovelPostSolutionSwapCandidateV1 {
  if (!Number.isSafeInteger(seed)) {
    throw new Error("LP controlled-novel seed must be a safe integer.");
  }

  const caselet = generateLp011Batch(
    `${LP_001_CONTROLLED_NOVELTY_DISCOVERY_V1}:${seed}`,
    1,
  )[0]!;
  const solved = solveLp011(caselet.clues, 2);
  if (solved.length !== 1 || !stateEquals(solved[0]!, caselet.assignment)) {
    throw new Error("LP controlled-novel parent caselet must have exactly one independently solved state.");
  }

  const perturbations = validPerturbations(caselet.assignment);
  if (!perturbations.length) {
    throw new Error("LP controlled-novel parent caselet has no answer-changing box-position swap.");
  }
  const selected = perturbations[Math.abs(seed) % perturbations.length]!;
  const targetAttributeLabel = caselet.attributeLabels[selected.targetAttribute];

  const distractorPriority: Lp011BoxId[] = [
    ...(selected.baseAnswer ? [selected.baseAnswer] : []),
    selected.targetBox,
    selected.swap[0],
    selected.swap[1],
    ...BOXES,
  ];
  const distractors = [...new Set(distractorPriority)]
    .filter((box) => box !== selected.modifiedAnswer)
    .slice(0, 3);
  if (distractors.length !== 3) {
    throw new Error("LP controlled-novel lane could not build three distinct distractors.");
  }

  const rawOptions = [
    `Box ${selected.modifiedAnswer}`,
    ...distractors.map((box) => `Box ${box}`),
  ];
  const options = rotate(rawOptions, Math.abs(seed) % 4);
  const answer = `Box ${selected.modifiedAnswer}`;
  const correctIndex = options.indexOf(answer);
  if (correctIndex < 0 || new Set(options).size !== 4) {
    throw new Error("LP controlled-novel option construction failed.");
  }

  const [leftSwap, rightSwap] = selected.swap;
  const clueText = caselet.clues.map((clue, index) => `${index + 1}. ${clue.text}`).join(" ");
  const stem = [
    caselet.scenario,
    clueText,
    `After the arrangement is completed, Box ${leftSwap} and Box ${rightSwap} interchange their positions, while each box keeps its own ${caselet.attributeNoun}.`,
    `After this interchange, which box is immediately above the box with ${targetAttributeLabel} ${caselet.attributeNoun}?`,
  ].join(" ");

  const noveltyAxes = [
    "MULTI_STAGE_COMPOSITION",
    "QUERY_DIRECTION",
    "CONSTRAINT_INTERACTION",
    "REPRESENTATION_LOGIC",
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: "LP-NOVEL-POST-SOLUTION-SWAP-" + seed,
    chapterId: "LP-001",
    qlId: "LP-QL-042+LP-QL-043",
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: options.length === 4 && new Set(options).size === 4,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  return {
    candidateId: "LP-NOVEL-POST-SOLUTION-SWAP-" + seed,
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    parentQlIds: ["LP-QL-042", "LP-QL-043"],
    seed,
    stem,
    options,
    correctIndex,
    answer,
    semanticFingerprint: [
      LP_001_CONTROLLED_NOVELTY_DISCOVERY_V1,
      caselet.caseletId,
      selected.swap.join("<->"),
      selected.targetAttribute,
      selected.targetBox,
      selected.modifiedAnswer,
      BOXES.map((box) => `${box}:${caselet.assignment.positionByBox[box]}:${caselet.assignment.attributeByBox[box]}`).join("|"),
    ].join("::"),
    solverAgreement: true,
    permanentQlAllocated: false,
    nextAvailableQl: "LP-QL-048",
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
    structuredState: {
      caseletId: caselet.caseletId,
      swap: selected.swap,
      targetAttribute: selected.targetAttribute,
      targetAttributeLabel,
      targetBox: selected.targetBox,
      baseAnswer: selected.baseAnswer,
      modifiedAnswer: selected.modifiedAnswer,
      uniqueBaseSolutionCount: 1,
    },
  };
}
