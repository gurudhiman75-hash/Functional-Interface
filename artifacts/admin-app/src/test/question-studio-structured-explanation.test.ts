import { describe, expect, it } from 'vitest';
import { itemExplanation } from '@/features/question-studio/quality';

describe('Question Studio authored explanation shapes', () => {
  it('preserves strings and ordered trilingual calculation arrays', () => {
    expect(itemExplanation({ explanation: '  Time = 300 ÷ 25 = 12 s.  ' }))
      .toBe('Time = 300 ÷ 25 = 12 s.');
    for (const line of ['Time = 12 s', 'समय = 12 s', 'ਸਮਾਂ = 12 s']) {
      expect(itemExplanation({ explanation: [line, '300 ÷ 25 = 12', '', null, {}] }))
        .toBe(`${line}\n300 ÷ 25 = 12`);
    }
  });

  it('includes method, worked steps and either conclusion shape', () => {
    expect(itemExplanation({ explanation: {
      method: 'Add the opposite-direction speeds.',
      steps: ['48 + 36 = 84 km/h'],
      finalAnswer: '84 km/h',
    } })).toBe('Add the opposite-direction speeds.\n48 + 36 = 84 km/h\n84 km/h');
    expect(itemExplanation({ explanation: {
      steps: ['Distance = 40 × 11/25 = 17 3/5 m'], conclusion: '17 3/5 m',
    } })).toBe('Distance = 40 × 11/25 = 17 3/5 m\n17 3/5 m');
  });

  it('does not expose unsupported objects or metadata as explanation prose', () => {
    for (const explanation of [null, 42, { input: 'private metadata' }, [{ text: 'unknown shape' }]]) {
      expect(itemExplanation({ explanation })).toBe('');
    }
  });
});
