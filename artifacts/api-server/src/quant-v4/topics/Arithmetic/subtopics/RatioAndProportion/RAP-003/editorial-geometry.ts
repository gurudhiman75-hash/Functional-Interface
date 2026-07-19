import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function n(parameters: Rap003Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap003Parameters, key: string, fallback: string) {
  return String(parameters.variables[key] ?? fallback);
}

function answer(solver: Rap003SolverResult) {
  return String(solver.answer).replaceAll("$$", "").trim();
}

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function result(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function areaFromLinear(parameters: Rap003Parameters, solver: Rap003SolverResult, firstKey: string, secondKey: string, label: string) {
  const first = n(parameters, firstKey);
  const second = n(parameters, secondKey);
  const final = answer(solver);
  return result(parameters, [
    `${label} is a linear measure, while area varies as the square of a linear measure.`,
    line("Write the linear ratio.", `${first}:${second}`),
    line("Square both ratio terms.", `${first}^2:${second}^2`),
    line("Evaluate the squares.", `${first * first}:${second * second}`),
    line("Reduce if necessary.", `${first * first}:${second * second}=${final}`),
    "Both figures are similar, so the same scale factor applies in every direction.",
    `So, the area ratio is ${final}.`,
  ]);
}

function volumeFromLinear(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const first = n(parameters, "sideRatioA");
  const second = n(parameters, "sideRatioB");
  const solid = s(parameters, "solidName", s(parameters, "shapeName", "similar solids"));
  const final = answer(solver);
  return result(parameters, [
    `The ${solid} are similar, so volume varies as the cube of a corresponding side.`,
    line("Write the side-length ratio.", `${first}:${second}`),
    line("Cube both ratio terms.", `${first}^3:${second}^3`),
    line("Evaluate the cubes.", `${first ** 3}:${second ** 3}`),
    line("Reduce if necessary.", `${first ** 3}:${second ** 3}=${final}`),
    "A linear scale factor is applied in three dimensions for volume.",
    `So, the volume ratio is ${final}.`,
  ]);
}

function linearFromArea(parameters: Rap003Parameters, solver: Rap003SolverResult, firstKey: string, secondKey: string, conclusion: string) {
  const first = n(parameters, firstKey);
  const second = n(parameters, secondKey);
  const rootA = Math.sqrt(first);
  const rootB = Math.sqrt(second);
  const final = answer(solver);
  return result(parameters, [
    "Area ratio is the square of the corresponding linear ratio.",
    line("Write the given area ratio.", `${first}:${second}`),
    line("Take the positive square root of each term.", `\\sqrt{${first}}:\\sqrt{${second}}`),
    line("Evaluate the roots.", `${rootA}:${rootB}`),
    line("Reduce if necessary.", `${rootA}:${rootB}=${final}`),
    "Lengths are positive, so the positive square roots are used.",
    `So, the ${conclusion} is ${final}.`,
  ]);
}

function surfaceFromVolume(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const volumeA = n(parameters, "volumeRatioA");
  const volumeB = n(parameters, "volumeRatioB");
  const sideA = Math.cbrt(volumeA);
  const sideB = Math.cbrt(volumeB);
  const areaA = sideA ** 2;
  const areaB = sideB ** 2;
  const final = answer(solver);
  return result(parameters, [
    "Volume ratio is the cube of the linear ratio, while surface area ratio is its square.",
    line("Take cube roots of the volume-ratio terms.", `\\sqrt[3]{${volumeA}}:\\sqrt[3]{${volumeB}}=${sideA}:${sideB}`),
    line("This is the corresponding side ratio.", `${sideA}:${sideB}`),
    line("Square the side-ratio terms for surface area.", `${sideA}^2:${sideB}^2`),
    line("Evaluate and reduce.", `${areaA}:${areaB}=${final}`),
    "The same similarity scale factor controls both dimensions.",
    `So, the surface-area ratio is ${final}.`,
  ]);
}

function volumeFromSurface(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const areaA = n(parameters, "surfaceAreaRatioA");
  const areaB = n(parameters, "surfaceAreaRatioB");
  const sideA = Math.sqrt(areaA);
  const sideB = Math.sqrt(areaB);
  const volumeA = sideA ** 3;
  const volumeB = sideB ** 3;
  const final = answer(solver);
  return result(parameters, [
    "Surface area ratio is the square of the linear ratio, while volume ratio is its cube.",
    line("Take square roots of the surface-area terms.", `\\sqrt{${areaA}}:\\sqrt{${areaB}}=${sideA}:${sideB}`),
    line("This gives the corresponding side ratio.", `${sideA}:${sideB}`),
    line("Cube the side-ratio terms for volume.", `${sideA}^3:${sideB}^3`),
    line("Evaluate and reduce.", `${volumeA}:${volumeB}=${final}`),
    "The solids are similar, so one common linear scale factor applies.",
    `So, the volume ratio is ${final}.`,
  ]);
}

export function renderRap003GeometryExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "geometricAreaRatioFromSide": return areaFromLinear(parameters, solver, "sideRatioA", "sideRatioB", "Side length");
    case "geometricVolumeRatioFromSide":
    case "geometricPowerMixedStatement": return volumeFromLinear(parameters, solver);
    case "geometricSideRatioFromArea": return linearFromArea(parameters, solver, "areaRatioA", "areaRatioB", "corresponding-side ratio");
    case "geometricSurfaceAreaRatioFromVolume": return surfaceFromVolume(parameters, solver);
    case "geometricAreaRatioFromRadius": return areaFromLinear(parameters, solver, "radiusRatioA", "radiusRatioB", "Radius");
    case "mapScaleAreaRatio": return areaFromLinear(parameters, solver, "scaleRatioA", "scaleRatioB", "Map length scale");
    case "mapScaleLengthFromArea": return linearFromArea(parameters, solver, "areaRatioA", "areaRatioB", "map length-scale ratio");
    case "similarSolidSurfaceToVolume": return volumeFromSurface(parameters, solver);
    default: return explanation;
  }
}
