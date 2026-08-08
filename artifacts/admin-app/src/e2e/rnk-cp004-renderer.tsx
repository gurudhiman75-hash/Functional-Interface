import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@/app/theme/ThemeProvider';
import { MathRenderingProvider } from '@/components/shared/MathRenderingProvider';
import { QuestionExplanationDisclosure } from '@/features/question-studio/QuestionExplanationDisclosure';
import '@/index.css';

const payload: Record<string, unknown> = {
  visibleExplanation: {
    lines: [
      'Arrange the five candidates from highest to lowest by combining every comparison before choosing an option.',
      'D is above B, B is above A, A is above C, and C is above E. Therefore the complete order is D > B > A > C > E.',
      'The endpoint check confirms that D is highest and E is lowest, so the chain is internally consistent.',
    ],
    answer: 'D > B > A > C > E',
    optionAnalysis: [
      'Option A is incorrect because it places A above B even though B is explicitly above A.',
      'Option B is incorrect because it places C above A and breaks the comparison A > C.',
      'Option C is incorrect because E cannot be above C when C is explicitly above E.',
      'Option D is correct because it preserves all four comparisons in one complete order.',
    ],
  },
  reviewMetadata: {
    learnerRendererContract: {
      learnerLabel: 'Why are the other options wrong?',
      accessibilityLabel: 'Show why the other options are wrong',
      defaultOpen: false,
      requiredWidthTargets: [360, 390, 430],
    },
  },
};

function RendererEvidencePage() {
  return (
    <main className="min-h-screen bg-background px-3 py-6 text-foreground sm:px-6">
      <article
        data-testid="rnk-cp004-renderer-harness"
        className="mx-auto min-w-0 max-w-3xl space-y-5 overflow-hidden rounded-xl border bg-card p-4 shadow-sm sm:p-6"
      >
        <header className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            RNK-001 · CP-004 browser evidence
          </p>
          <h1 className="break-words text-xl font-semibold [overflow-wrap:anywhere]">
            Multi-entity comparison and explicit order reconstruction
          </h1>
          <p className="break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">
            Which option gives the correct order from highest to lowest?
          </p>
        </header>

        <ol className="min-w-0 space-y-2 text-sm" aria-label="Answer options">
          {[
            'A > B > D > C > E',
            'D > B > C > A > E',
            'D > B > A > E > C',
            'D > B > A > C > E',
          ].map((option, index) => (
            <li
              key={option}
              className="max-w-full break-words rounded-md border px-3 py-2 [overflow-wrap:anywhere]"
            >
              {String.fromCharCode(65 + index)}. {option}
            </li>
          ))}
        </ol>

        <QuestionExplanationDisclosure payload={payload} />
      </article>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MathRenderingProvider>
      <ThemeProvider>
        <RendererEvidencePage />
      </ThemeProvider>
    </MathRenderingProvider>
  </StrictMode>,
);
