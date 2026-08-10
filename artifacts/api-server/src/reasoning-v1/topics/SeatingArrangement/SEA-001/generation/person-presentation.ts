import { selectSea001Names } from "./name-pool.ts";

export function sea001PersonIds(count: number): string[] {
  if (!Number.isInteger(count) || count < 1) throw new Error(`Invalid SEA-001 person count: ${count}`);
  return Array.from({ length: count }, (_, index) => `P${index + 1}`);
}

export function sea001DisplayNameMap(
  seed: string,
  personIds: readonly string[],
  context: string,
): Readonly<Record<string, string>> {
  const names = selectSea001Names(seed, personIds.length, context);
  return Object.fromEntries(personIds.map((personId, index) => [personId, names[index] as string]));
}

export function sea001DisplayName(
  personId: string,
  displayNames: Readonly<Record<string, string>>,
): string {
  return displayNames[personId] ?? personId;
}

export function presentSea001Text(
  text: string,
  displayNames: Readonly<Record<string, string>>,
): string {
  let output = text;
  const ids = Object.keys(displayNames).sort((left, right) => right.length - left.length);
  for (const personId of ids) {
    const escaped = personId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(`\\b${escaped}\\b`, "g"), displayNames[personId] as string);
  }
  return output;
}

export function presentSea001Children<T extends {
  readonly text: string;
  readonly explanation: string;
  readonly options: readonly {
    readonly display: string;
    readonly explanation: string;
  }[];
}>(
  children: readonly T[],
  displayNames: Readonly<Record<string, string>>,
): T[] {
  return children.map((child) => ({
    ...child,
    text: presentSea001Text(child.text, displayNames),
    explanation: presentSea001Text(child.explanation, displayNames),
    options: child.options.map((option) => ({
      ...option,
      display: presentSea001Text(option.display, displayNames),
      explanation: presentSea001Text(option.explanation, displayNames),
    })),
  })) as unknown as T[];
}
