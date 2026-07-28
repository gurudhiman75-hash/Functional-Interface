import type { Men001Parameters } from "./types";

function humanizeWireStem(stem: string) {
  return stem
    .replace(
      /^A circular wire of radius ([^.]+?) is (?:straightened and )?reshaped into a square\./i,
      "A metallic wire is bent into a circular frame of radius $1. It is then straightened and rebent into a square frame.",
    )
    .replace(
      /^A circular wire of radius ([^.]+?) is reshaped into a rectangle of length ([^.]+?)\./i,
      "A metallic wire is bent into a circular frame of radius $1. It is then straightened and rebent into a rectangular frame of length $2.",
    )
    .replace(
      /^A wire rectangle is ([^.]+?) long and ([^.]+?) broad\. It is reshaped into a square\./i,
      "A metallic wire is bent into a rectangular frame $1 long and $2 broad. The same wire is then straightened and rebent into a square frame.",
    )
    .replace(
      /^A wire rectangle measures ([^.]+?) by ([^.]+?)\. The wire is reshaped into a square\./i,
      "A metallic wire is bent into a rectangular frame measuring $1 by $2. The same wire is then straightened and rebent into a square frame.",
    )
    .replace(
      /^A rectangular wire frame is ([^.]+?) by ([^.]+?)\. It is reshaped into a circle\./i,
      "A metallic wire is bent into a rectangular frame measuring $1 by $2. The same wire is then straightened and rebent into a circular frame.",
    )
    .replace(
      /^A wire forming a square of side ([^.]+?) is reshaped into a rectangle of breadth ([^.]+?)\./i,
      "A metallic wire is bent into a square frame of side $1. The same wire is then straightened and rebent into a rectangular frame of breadth $2.",
    )
    .replace(
      /^A wire forming a square of side ([^.]+?) is bent into a circle\./i,
      "A metallic wire is bent into a square frame of side $1. The same wire is then straightened and rebent into a circular frame.",
    )
    .replace(
      /^A wire square has side ([^.]+?)\. The wire is reshaped into an equilateral triangle\./i,
      "A metallic wire is bent into a square frame of side $1. The same wire is then straightened and rebent into an equilateral triangular frame.",
    )
    .replace(
      /^A wire square of side ([^.]+?) is reshaped into a regular hexagon\./i,
      "A metallic wire is bent into a square frame of side $1. The same wire is then straightened and rebent into a regular hexagonal frame.",
    )
    .replace(
      /^A wire rectangle measures ([^.]+?) by ([^.]+?)\. The wire is reshaped into a square\./i,
      "A metallic wire is bent into a rectangular frame measuring $1 by $2. The same wire is then straightened and rebent into a square frame.",
    )
    .replace(
      /^A wire boundary forms a rectangle of length ([^.]+?) and breadth ([^.]+?)\. The same wire is reshaped into a square\./i,
      "A metallic wire is bent into a rectangular frame of length $1 and breadth $2. The same wire is then straightened and rebent into a square frame.",
    )
    .replace(
      /^An equilateral triangular wire frame has side ([^.]+?)\. It is reshaped into a square\./i,
      "A metallic wire is bent into an equilateral triangular frame of side $1. The same wire is then straightened and rebent into a square frame.",
    )
    .replace(
      /^A square wire frame has side ([^.]+?)\. It is reshaped into a regular hexagon\./i,
      "A metallic wire is bent into a square frame of side $1. The same wire is then straightened and rebent into a regular hexagonal frame.",
    );
}

function humanizeBareShapeStem(stem: string) {
  return stem
    .replace(/^An isosceles triangle has /i, "An isosceles triangular support frame has ")
    .replace(/^The diagonal of a square is /i, "A square glass pane has a diagonal of ")
    .replace(/^A parallelogram has base /i, "A parallelogram-shaped metal plate has base ")
    .replace(/^The area of a parallelogram is /i, "A parallelogram-shaped field has area ")
    .replace(/^A parallelogram has area /i, "A parallelogram-shaped panel has area ")
    .replace(/^The area of a rhombus is /i, "A rhombus-shaped field has area ")
    .replace(/^The area of a trapezium is /i, "A trapezium-shaped plot has area ")
    .replace(/^A trapezium has area /i, "A trapezium-shaped metal plate has area ")
    .replace(/^The area of a kite is /i, "A kite-shaped decorative panel has area ")
    .replace(/^A circle has circumference /i, "A circular metal ring has circumference ")
    .replace(/^A circle of radius ([^.]+?) has a central angle /i, "A circular clock dial of radius $1 has a central angle ")
    .replace(/^A rectangle has area ([^.]+?)\. Its length is increased/i, "A rectangular plot has area $1. During redesign, its length is increased")
    .replace(/^The length of a rectangle is increased/i, "A rectangular display panel is resized: its length is increased");
}

export function humanizeMen001Stem(
  rawStem: string,
  parameters: Men001Parameters,
) {
  const wireAware = /Wire/i.test(parameters.solveMode)
    ? humanizeWireStem(rawStem)
    : rawStem;
  return humanizeBareShapeStem(wireAware)
    .replace(/\s+/g, " ")
    .trim();
}
