import library from './fraction-equivalents.library.json';

export function getFractionEquivalent(percent: string): string | null {
  const match = (library as any).equivalents.find((e: any) => e.percent === percent);
  return match ? match.fraction : null;
}
