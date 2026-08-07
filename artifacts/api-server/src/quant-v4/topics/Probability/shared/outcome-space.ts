import type { ElementaryOutcome, ProbabilityExperiment } from "./types";

function cartesian<T>(values: readonly T[], length: number): T[][] {
  let rows: T[][] = [[]]; for (let index = 0; index < length; index += 1) rows = rows.flatMap((row) => values.map((value) => [...row, value])); return rows;
}
function combinations<T>(values: readonly T[], count: number, start = 0, prefix: T[] = [], output: T[][] = []): T[][] {
  if (prefix.length === count) { output.push([...prefix]); return output; }
  for (let index = start; index <= values.length - (count - prefix.length); index += 1) { prefix.push(values[index]!); combinations(values, count, index + 1, prefix, output); prefix.pop(); }
  return output;
}
function permutations<T>(values: readonly T[], count: number, prefix: T[] = [], used = new Set<number>(), output: T[][] = []): T[][] {
  if (prefix.length === count) { output.push([...prefix]); return output; }
  for (let index = 0; index < values.length; index += 1) if (!used.has(index)) { used.add(index); prefix.push(values[index]!); permutations(values, count, prefix, used, output); prefix.pop(); used.delete(index); }
  return output;
}
export function canonicalDeck(): Array<{ id: string; rank: string; suit: string; colour: string; face: boolean }> {
  const suits = ["hearts", "diamonds", "clubs", "spades"] as const, ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"] as const;
  return suits.flatMap((suit) => ranks.map((rank) => ({ id: `${rank}-${suit}`, rank, suit, colour: suit === "hearts" || suit === "diamonds" ? "red" : "black", face: rank === "jack" || rank === "queen" || rank === "king" })));
}
export function enumerateOutcomeSpace(experiment: ProbabilityExperiment, ceiling = 50000): ElementaryOutcome[] | undefined {
  const metadata = experiment.metadata;
  if (experiment.kind === "COIN_TOSS") {
    const tosses = Number(metadata.tosses); return cartesian(["H", "T"], tosses).map((sequence) => ({ fields: { ...Object.fromEntries(sequence.map((value, index) => [`toss${index + 1}`, value])), sequence: sequence.join(""), headCount: sequence.filter((value) => value === "H").length } }));
  }
  if (experiment.kind === "DIE_ROLL") {
    const rolls = Number(metadata.rolls), sides = Number(metadata.sides); return cartesian(Array.from({ length: sides }, (_, index) => index + 1), rolls).map((sequence) => ({ fields: { ...Object.fromEntries(sequence.map((value, index) => [`die${index + 1}`, value])), sum: sequence.reduce((sum, value) => sum + value, 0), product: sequence.reduce((product, value) => product * value, 1) } }));
  }
  if (experiment.kind === "SPINNER") {
    const sectors = Number(metadata.sectors); return Array.from({ length: sectors }, (_, index) => ({ fields: { sector: index + 1 } }));
  }
  if (experiment.kind === "NUMBER_SELECTION") {
    const lower = Number(metadata.lower), upper = Number(metadata.upper); return Array.from({ length: upper - lower + 1 }, (_, index) => ({ fields: { number: lower + index } }));
  }
  if (experiment.kind === "CARD_DRAW" && Number(metadata.draws ?? 1) === 1) return canonicalDeck().map((card) => ({ fields: card }));
  if (experiment.kind === "URN_DRAW") {
    const red = Number(metadata.red), blue = Number(metadata.blue), draws = Number(metadata.draws); const objects = [...Array.from({ length: red }, (_, index) => ({ id: `R${index + 1}`, colour: "red" })), ...Array.from({ length: blue }, (_, index) => ({ id: `B${index + 1}`, colour: "blue" }))];
    let selections: typeof objects[];
    if (experiment.orderPolicy === "UNORDERED") selections = combinations(objects, draws);
    else if (experiment.replacementPolicy === "WITH_REPLACEMENT") selections = cartesian(objects, draws);
    else selections = permutations(objects, draws);
    if (selections.length > ceiling) return undefined;
    return selections.map((selection) => ({ fields: { ...Object.fromEntries(selection.map((object, index) => [`ball${index + 1}`, object.colour])), redCount: selection.filter((object) => object.colour === "red").length, blueCount: selection.filter((object) => object.colour === "blue").length, sequence: selection.map((object) => object.colour).join("-") } }));
  }
  if (experiment.kind === "RANDOM_SELECTION") {
    const population = Number(metadata.population), selection = Number(metadata.selection); if (!population || population > 20) return undefined;
    const women = Number(metadata.women ?? 0); const objects = Array.from({ length: population }, (_, index) => ({ id: index + 1, group: index < women ? "woman" : "man" })); const rows = combinations(objects, selection); if (rows.length > ceiling) return undefined;
    return rows.map((row) => ({ fields: { womenCount: row.filter((person) => person.group === "woman").length, menCount: row.filter((person) => person.group === "man").length } }));
  }
  if (experiment.kind === "RANDOM_ARRANGEMENT") {
    const people = Number(metadata.people), solveMode = String(metadata.solveMode ?? ""); if (!people || people > 9) return undefined;
    if (solveMode === "findNumberFormationProbability") {
      const length = Number(metadata.length), maxDigit = Number(metadata.maxDigit); const values = Array.from({ length: maxDigit }, (_, index) => index + 1); const rows = permutations(values, length); if (rows.length > ceiling) return undefined;
      return rows.map((row) => ({ fields: { first: row[0]!, last: row[row.length - 1]!, positions: row.join(",") } }));
    }
    if (solveMode === "findPositionRestrictionProbability") {
      const positions = Number(metadata.positions), women = Number(metadata.women ?? 0); const values = Array.from({ length: people }, (_, index) => index); const rows = permutations(values, positions); if (rows.length > ceiling) return undefined;
      return rows.map((row) => ({ fields: { first: row[0]!, firstGroup: row[0]! < women ? "woman" : "man", positions: row.join(",") } }));
    }
    const values = Array.from({ length: people }, (_, index) => index); const rows = permutations(values, people); if (rows.length > ceiling) return undefined;
    return rows.map((row) => ({ fields: { first: row[0]!, positions: row.join(","), specifiedAdjacent: Math.abs(row.indexOf(0) - row.indexOf(1)) === 1 } }));
  }
  return undefined;
}
