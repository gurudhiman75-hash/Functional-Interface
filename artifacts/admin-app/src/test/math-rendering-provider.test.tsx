import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { MathRenderingProvider } from '@/components/shared/MathRenderingProvider';

afterEach(() => {
  cleanup();
  document.getElementById('examtree-mathjax-script')?.remove();
  delete window.MathJax;
});

describe('MathRenderingProvider', () => {
  it('creates one pinned MathJax script and preserves delimited review text', () => {
    const { container } = render(
      <MathRenderingProvider>
        <p>{'Selections: \\(\\binom{8}{3}\\)'}</p>
      </MathRenderingProvider>,
    );

    expect(screen.getByText(/Selections:/)).toBeTruthy();
    expect(container.firstElementChild?.classList.contains('math-only')).toBe(true);
    const script = document.getElementById('examtree-mathjax-script') as HTMLScriptElement | null;
    expect(script).toBeTruthy();
    expect(script?.src).toContain('mathjax@3.2.2/es5/tex-chtml.js');
  });

  it('reuses the existing script across multiple provider mounts', () => {
    const first = render(<MathRenderingProvider><span>{'\\(5^4\\)'}</span></MathRenderingProvider>);
    const second = render(<MathRenderingProvider><span>{'\\({}^8P_3\\)'}</span></MathRenderingProvider>);

    expect(document.querySelectorAll('#examtree-mathjax-script')).toHaveLength(1);
    first.unmount();
    second.unmount();
  });
});
