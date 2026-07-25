export function splitCode(value: string, separator: string): string[] {
  return separator ? value.split(separator) : [...value];
}

export function joinCode(tokens: readonly string[], separator: string): string {
  return tokens.join(separator);
}

export function canonicalCode(value: string, separator: string): string {
  return JSON.stringify(splitCode(value, separator));
}

export function sameCode(left: string, right: string, separator: string): boolean {
  return canonicalCode(left, separator) === canonicalCode(right, separator);
}
