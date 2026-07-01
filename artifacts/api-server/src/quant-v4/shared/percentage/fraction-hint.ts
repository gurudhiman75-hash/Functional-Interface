import { getFractionEquivalent } from './fraction-equivalent-service';

export function renderFractionHint(percent: string): string | null {
  const fraction = getFractionEquivalent(percent);
  if (!fraction) return null;

  return `\\Rightarrow ${percent} = \\frac{${fraction.split('/')[0]}}{${fraction.split('/')[1]}}`;
}
