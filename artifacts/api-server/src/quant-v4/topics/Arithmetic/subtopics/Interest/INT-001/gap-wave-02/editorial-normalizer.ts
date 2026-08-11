function capitaliseInitial(value: string): string {
  if (!value) return value;
  return `${value[0]!.toUpperCase()}${value.slice(1)}`;
}

export function normaliseIntCp001Wave2Stem(stem: string): string {
  let result = stem.trim();
  if (result.endsWith(".")) result = `${result.slice(0, -1)}?`;
  else if (!result.endsWith("?")) result = `${result}?`;

  result = result.replace(/\bDetermine the ([^?]+)\?$/u, "What is the $1?");
  result = result.replace(/\bFind the ([^?]+)\?$/u, "What is the $1?");
  return capitaliseInitial(result);
}
