// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  QuestionExplanationDisclosure,
  parseQuestionExplanation,
} from './QuestionExplanationDisclosure';

const structuredPayload = {
  answer: 'Harleen',
  explanation: {
    stepByStepSolution: ['Legacy object line that should not replace the learner surface.'],
  },
  visibleExplanation: {
    mode: 'CHAIN_BUILD',
    lines: [
      'Harleen > Gurpreet > Riya',
      'Harleen is first, so Harleen ranks highest.',
    ],
    answer: 'Harleen',
    optionAnalysis: [
      'Option B: Gurpreet is second, not first.',
      'Option C: Aman is last, not first.',
    ],
    optionAnalysisDisplay: 'NATIVE_COLLAPSED',
  },
  reviewMetadata: {
    learnerRendererContract: {
      disclosureComponent: 'NATIVE_COLLAPSED',
      defaultOpen: false,
      learnerLabel: 'Why are the other options wrong?',
      accessibilityLabel: 'Show why the other options are wrong',
      rawHtmlAllowed: false,
      adminClueNotesVisibleToLearner: false,
      requiredWidthTargets: [360, 390, 430],
    },
  },
};

describe('QuestionExplanationDisclosure', () => {
  it('prefers the learner-visible structured explanation and starts collapsed', () => {
    render(<QuestionExplanationDisclosure payload={structuredPayload} />);

    expect(screen.getByText('Harleen > Gurpreet > Riya')).toBeVisible();
    expect(screen.getByText('Answer: Harleen')).toBeVisible();
    expect(screen.queryByText(/Legacy object line/)).not.toBeInTheDocument();
    expect(screen.queryByText('Option B: Gurpreet is second, not first.')).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: 'Show why the other options are wrong' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('opens with keyboard interaction and exposes a labelled region', async () => {
    const user = userEvent.setup();
    render(<QuestionExplanationDisclosure payload={structuredPayload} />);

    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Show why the other options are wrong' });
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Why are the other options wrong?' })).toBeVisible();
    expect(screen.getByText('Option B: Gurpreet is second, not first.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Hide why the other options are wrong' })).toBeVisible();
  });

  it('renders supplied markup as text and never inserts raw HTML', () => {
    const { container } = render(
      <QuestionExplanationDisclosure
        payload={{
          visibleExplanation: {
            lines: ['<img src=x onerror=alert(1)>'],
            optionAnalysis: ['<script>alert(1)</script>'],
          },
        }}
      />,
    );

    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeVisible();
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
  });

  it('falls back to legacy plain-text explanations', () => {
    render(
      <QuestionExplanationDisclosure
        payload={{ explanation: 'First line.\nSecond line.' }}
      />,
    );

    expect(screen.getByText('First line.')).toBeVisible();
    expect(screen.getByText('Second line.')).toBeVisible();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('retains the required mobile-width contract', () => {
    const { container } = render(<QuestionExplanationDisclosure payload={structuredPayload} />);
    const root = container.querySelector('[data-required-width-targets]');

    expect(root).toHaveAttribute('data-required-width-targets', '360,390,430');
    expect(root).toHaveClass('min-w-0', 'max-w-full');
  });
});

describe('parseQuestionExplanation', () => {
  it('uses object-step fallback when no learner surface exists', () => {
    const parsed = parseQuestionExplanation({
      explanation: {
        stepByStepSolution: ['Build the order.', 'Read the requested position.'],
      },
      answer: 'Aman',
    });

    expect(parsed.source).toBe('LEGACY_OBJECT');
    expect(parsed.lines).toEqual(['Build the order.', 'Read the requested position.']);
    expect(parsed.answer).toBe('Aman');
  });
});
