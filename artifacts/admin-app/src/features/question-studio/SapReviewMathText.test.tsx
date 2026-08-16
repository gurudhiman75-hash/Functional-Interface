import { describe, expect, it } from 'vitest';

import { formatSapReviewMath } from './SapReviewMathText';

describe('formatSapReviewMath', () => {
  it('renders square roots and multiplication readably', () => {
    expect(formatSapReviewMath('Evaluate \\( \\sqrt{144} \\times 3 \\).')).toBe('Evaluate √(144) × 3.');
  });

  it('renders fractions and powers readably', () => {
    expect(formatSapReviewMath('\\( \\frac{3}{5} \\times 10^{2} \\)')).toBe('(3)/(5) × 10²');
  });

  it('unwinds nested roots from the inside out', () => {
    expect(formatSapReviewMath('\\( \\sqrt{16 + \\sqrt{81}} \\)')).toBe('√(16 + √(81))');
  });

  it('renders indexed roots and comparison symbols', () => {
    expect(formatSapReviewMath('\\( \\sqrt[3]{125} \\leq 6 \\)')).toBe('∛(125) ≤ 6');
  });
});
