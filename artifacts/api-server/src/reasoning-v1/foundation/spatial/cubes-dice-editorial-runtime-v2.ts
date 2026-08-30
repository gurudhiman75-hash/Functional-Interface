import {
  generateCubesDiceCandidateQuestionV1,
  type CubesDiceCandidateQuestionV1,
  type CubesDiceTaskKindV1,
} from "./cubes-dice-production-generator-v1";

export interface CubesDiceEditorialExplanationV2 {
  whatIsGiven: string;
  howToReason: string;
  conclusion: string;
}

export type CubesDiceEditorialQuestionV2 = Readonly<
  Omit<CubesDiceCandidateQuestionV1, "version" | "stem"> & {
    version: "CND-001-EDITORIAL-QUESTION-V2";
    stem: string;
    stemVariantId: string;
    explanation: Readonly<CubesDiceEditorialExplanationV2>;
  }
>;

export const CND_001_EDITORIAL_RUNTIME_AUTHORITY_V2 = Object.freeze({
  authorityId: "CND-001-EDITORIAL-RUNTIME-V2" as const,
  chapterCode: "CND-001" as const,
  stemVariantPolicy: "MULTIPLE_EXAM_NATURAL_STEMS_PER_TASK" as const,
  explanationPolicy: "QUESTION_SPECIFIC_GIVEN_REASONING_CONCLUSION" as const,
  preservesSolverAnswer: true,
  preservesStimulusSvg: true,
  permanentQlAllocationAuthorized: false,
  automaticStudentPublication: false,
});

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function chooseVariant<T>(seed: string, values: readonly T[]): Readonly<{ value: T; index: number }> {
  const index = hash32(seed) % values.length;
  return { value: values[index]!, index };
}

function targetFromStem(stem: string): string {
  const match = stem.match(/opposite to ([A-Z0-9]+)\?$/i);
  if (!match) throw new Error(`CND editorial runtime could not resolve target from stem: ${stem}`);
  return match[1]!;
}

function paintedFaceCountFromStem(stem: string): number {
  const match = stem.match(/exactly (\d+) painted face/i);
  if (!match) throw new Error(`CND editorial runtime could not resolve painted-face count from stem: ${stem}`);
  return Number(match[1]);
}

function paintedCategory(faceCount: number): string {
  if (faceCount === 3) return "corner cubes";
  if (faceCount === 2) return "edge cubes other than the corners";
  if (faceCount === 1) return "cubes lying inside a face, away from its edges";
  return "completely internal cubes";
}

function paintedShortcut(n: number, faceCount: number): string {
  if (faceCount === 3) return "8 corner cubes";
  if (faceCount === 2) return `12 × (${n} − 2) = ${12 * (n - 2)}`;
  if (faceCount === 1) return `6 × (${n} − 2)² = ${6 * (n - 2) ** 2}`;
  return `(${n} − 2)³ = ${(n - 2) ** 3}`;
}

function editorialSurface(base: CubesDiceCandidateQuestionV1): Readonly<{
  stem: string;
  stemVariantId: string;
  explanation: Readonly<CubesDiceEditorialExplanationV2>;
}> {
  if (base.taskKind === "DICE_OPPOSITE_FROM_TWO_VIEWS") {
    const target = targetFromStem(base.stem);
    const variants = [
      `Study the two positions of the same die. Which face lies opposite to ${target}?`,
      `The same die is shown in two different orientations. Identify the face opposite to ${target}.`,
      `From the two views of the die, determine the face opposite to ${target}.`,
      `Two positions of one die are given. What is on the face opposite to ${target}?`,
      `Compare the two shown orientations of the die. Which face is opposite ${target}?`,
      `Using both views of the same die, find the face that is opposite to ${target}.`,
    ] as const;
    const selected = chooseVariant(`${base.seed}:dice-stem`, variants);
    const observations = base.scene.observations as readonly { top: string; front: string; right: string }[];
    return Object.freeze({
      stem: selected.value,
      stemVariantId: `DICE-STEM-${selected.index + 1}`,
      explanation: Object.freeze({
        whatIsGiven: `The same die is shown twice: (${observations[0]!.top}, ${observations[0]!.front}, ${observations[0]!.right}) and (${observations[1]!.top}, ${observations[1]!.front}, ${observations[1]!.right}) are the visible top-front-right faces.`,
        howToReason: `Use the two positions together and keep only face arrangements obtainable by rotating the same cube. This fixes the face paired opposite ${target}; reflected arrangements are not allowed.`,
        conclusion: `The only face that can be opposite to ${target} is ${base.answer}.`,
      }),
    });
  }

  if (base.taskKind === "CUBE_NET_OPPOSITE_FACE") {
    const target = targetFromStem(base.stem);
    const variants = [
      `The net shown is folded into a cube. Which face will be opposite to ${target}?`,
      `After folding the given net to make a cube, identify the face opposite ${target}.`,
      `Which labelled face comes opposite to ${target} when this net is folded into a cube?`,
      `Imagine folding the net along its edges. What will be the face opposite ${target}?`,
      `On forming a cube from the given net, which face lies directly opposite ${target}?`,
      `The figure is an open cube net. Find the label on the face opposite ${target} after folding.`,
    ] as const;
    const selected = chooseVariant(`${base.seed}:net-stem`, variants);
    return Object.freeze({
      stem: selected.value,
      stemVariantId: `NET-STEM-${selected.index + 1}`,
      explanation: Object.freeze({
        whatIsGiven: `The six labelled squares form one valid cube net, and the required face is the one opposite ${target}.`,
        howToReason: `Fold the neighbouring squares through 90° around their shared edges. The square labelled ${base.answer} ends up facing in the direction exactly opposite the square labelled ${target}.`,
        conclusion: `Therefore ${base.answer} is opposite to ${target}.`,
      }),
    });
  }

  if (base.taskKind === "PAINTED_CUBE_EXACT_FACE_COUNT") {
    const n = base.scene.subdivisionsPerEdge as number;
    const faceCount = paintedFaceCountFromStem(base.stem);
    const total = n ** 3;
    const variants = [
      `A cube is painted on all six outer faces and cut into ${total} equal small cubes. How many small cubes have exactly ${faceCount} painted face${faceCount === 1 ? "" : "s"}?`,
      `All faces of a cube are painted before it is divided into ${total} identical cubes. Find the number having exactly ${faceCount} painted face${faceCount === 1 ? "" : "s"}.`,
      `A painted cube is cut equally into ${n} parts along each edge. How many resulting cubes have exactly ${faceCount} painted face${faceCount === 1 ? "" : "s"}?`,
      `Each outer face of a cube is painted. It is then divided into ${n} × ${n} × ${n} equal cubes. How many have exactly ${faceCount} painted face${faceCount === 1 ? "" : "s"}?`,
      `A cube painted on every face is subdivided into ${total} unit-like cubes. Count those with exactly ${faceCount} painted face${faceCount === 1 ? "" : "s"}.`,
      `After painting all six faces, a cube is cut into ${n} equal divisions per edge. How many pieces show paint on exactly ${faceCount} face${faceCount === 1 ? "" : "s"}?`,
    ] as const;
    const selected = chooseVariant(`${base.seed}:paint-stem`, variants);
    return Object.freeze({
      stem: selected.value,
      stemVariantId: `PAINT-STEM-${selected.index + 1}`,
      explanation: Object.freeze({
        whatIsGiven: `There are ${n} divisions along each edge, so the cube contains ${total} small cubes and all six outer faces are painted.`,
        howToReason: `Small cubes with exactly ${faceCount} painted face${faceCount === 1 ? "" : "s"} are the ${paintedCategory(faceCount)}. Their standard position count is ${paintedShortcut(n, faceCount)}.`,
        conclusion: `Hence the required number of small cubes is ${base.answer}.`,
      }),
    });
  }

  const heights = base.scene.heights as readonly (readonly number[])[];
  const view = String(base.scene.view).toLowerCase();
  const variants = [
    `A stack of unit cubes is shown. How many unit squares appear in its ${view} view?`,
    `Look at the cube stack from the ${view}. How many square cells are visible in the orthographic view?`,
    `When the given stack is viewed exactly from the ${view}, how many unit-square positions are occupied?`,
    `Find the number of occupied cells in the ${view} view of the shown unit-cube arrangement.`,
    `The arrangement is made of unit cubes. How many squares will its ${view} projection contain?`,
    `Count the unit-square cells in the exact ${view} view of this cube stack.`,
  ] as const;
  const selected = chooseVariant(`${base.seed}:view-stem`, variants);
  const occupiedColumns = heights.flat().filter((height) => height > 0).length;
  return Object.freeze({
    stem: selected.value,
    stemVariantId: `VIEW-STEM-${selected.index + 1}`,
    explanation: Object.freeze({
      whatIsGiven: `The stack is defined by its column heights, with ${occupiedColumns} non-empty ground positions. The required direction is the ${view} view.`,
      howToReason: `Project every occupied unit cube onto the plane seen from the ${view}. Cubes lying behind one another in the same projected position count as one visible square cell.`,
      conclusion: `There are ${base.answer} distinct occupied cells in the ${view} projection.`,
    }),
  });
}

export function generateCubesDiceEditorialQuestionV2(input: Readonly<{
  seed: string;
  taskKind: CubesDiceTaskKindV1;
}>): CubesDiceEditorialQuestionV2 {
  const base = generateCubesDiceCandidateQuestionV1(input);
  const surface = editorialSurface(base);
  return Object.freeze({
    ...base,
    version: "CND-001-EDITORIAL-QUESTION-V2",
    stem: surface.stem,
    stemVariantId: surface.stemVariantId,
    explanation: surface.explanation,
  });
}
