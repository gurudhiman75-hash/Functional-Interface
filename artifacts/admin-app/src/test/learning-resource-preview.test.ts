import { describe, expect, it } from 'vitest';

import { parsePreviewLine, safePreviewHttpsUrl } from '@/pages/content/LearningResourceLearnerPreview';

describe('learning resource learner preview', () => {
  it('allows only absolute HTTPS document and markdown links', () => {
    expect(safePreviewHttpsUrl('https://example.com/current-affairs.pdf')).toBe('https://example.com/current-affairs.pdf');
    expect(safePreviewHttpsUrl('http://example.com/file.pdf')).toBeNull();
    expect(safePreviewHttpsUrl('javascript:alert(1)')).toBeNull();
    expect(safePreviewHttpsUrl('//example.com/file.pdf')).toBeNull();
    expect(safePreviewHttpsUrl('/relative/file.pdf')).toBeNull();
  });

  it('parses the bounded markdown subset without executing HTML', () => {
    expect(parsePreviewLine('# Daily current affairs')).toEqual({ kind: 'heading', level: 1, text: 'Daily current affairs' });
    expect(parsePreviewLine('## Economy')).toEqual({ kind: 'heading', level: 2, text: 'Economy' });
    expect(parsePreviewLine('- RBI update')).toEqual({ kind: 'bullet', text: 'RBI update' });
    expect(parsePreviewLine('2. Revise the report')).toEqual({ kind: 'ordered', number: 2, text: 'Revise the report' });
    expect(parsePreviewLine('> Exam note')).toEqual({ kind: 'quote', text: 'Exam note' });
    expect(parsePreviewLine('<script>alert(1)</script>')).toEqual({ kind: 'paragraph', text: '<script>alert(1)</script>' });
  });
});
