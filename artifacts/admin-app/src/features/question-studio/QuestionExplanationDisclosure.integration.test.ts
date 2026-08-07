import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const livePagePath = fileURLToPath(
  new URL('../../pages/content/QuestionStudioLivePage.tsx', import.meta.url),
);
const livePageSource = readFileSync(livePagePath, 'utf8');

describe('Question Studio explanation renderer integration', () => {
  it('uses the native structured explanation renderer', () => {
    expect(livePageSource).toContain("import { QuestionExplanationDisclosure }");
    expect(livePageSource).toContain('<QuestionExplanationDisclosure payload={item.payload} />');
    expect(livePageSource).not.toContain("firstText(item.payload, ['explanation']");
  });

  it('links run and item disclosure controls to their regions', () => {
    expect(livePageSource).toContain('aria-controls={`question-studio-run-${run.id}`}');
    expect(livePageSource).toContain('aria-expanded={expanded}');
    expect(livePageSource).toContain('aria-controls={detailsId}');
    expect(livePageSource).toContain('id={detailsId}');
  });

  it('keeps item details mobile-safe at the required widths', () => {
    expect(livePageSource).toContain('min-w-0 max-w-full');
    expect(livePageSource).toContain('sm:ml-16');
    expect(livePageSource).toContain('[overflow-wrap:anywhere]');
    expect(livePageSource).toContain('grid-cols-1');
  });

  it('reads structured option labels instead of object stringification', () => {
    expect(livePageSource).toContain("const label = (option as Record<string, unknown>).label");
    expect(livePageSource).not.toContain("options.map((option) => String(option ?? ''))");
  });
});
