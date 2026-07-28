export function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export function canonicalSetKey(values: readonly string[]): string {
  return uniqueSorted(values).join("\u001f");
}

export function sameSet(left: readonly string[], right: readonly string[]): boolean {
  return canonicalSetKey(left) === canonicalSetKey(right);
}

export function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(`${label} must not contain duplicates`);
  }
}
