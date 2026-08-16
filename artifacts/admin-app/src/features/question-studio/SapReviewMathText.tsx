import type { HTMLAttributes } from 'react';

const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '-': '⁻', '+': '⁺',
};

function superscript(value: string) {
  return [...value].map((character) => SUPERSCRIPT[character] ?? character).join('');
}

export function formatSapReviewMath(value: string | number | null | undefined) {
  let output = value === null || value === undefined ? '' : String(value);
  output = output
    .replace(/\\\[\s*/g, '')
    .replace(/\s*\\\]/g, '')
    .replace(/\\\(\s*/g, '')
    .replace(/\s*\\\)/g, '')
    .replace(/\$\$/g, '')
    .replace(/\$/g, '');

  for (let pass = 0; pass < 12; pass += 1) {
    const before = output;
    output = output
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
      .replace(/\\sqrt\[(\d+)\]\{([^{}]*)\}/g, (_match, index: string, body: string) => {
        if (index === '3') return `∛(${body})`;
        if (index === '4') return `∜(${body})`;
        return `${index}√(${body})`;
      })
      .replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
      .replace(/\^\{([^{}]*)\}/g, '^$1')
      .replace(/_\{([^{}]*)\}/g, '_$1');
    if (output === before) break;
  }

  output = output
    .replace(/\\times\b/g, '×')
    .replace(/\\cdot\b/g, '·')
    .replace(/\\div\b/g, '÷')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\leq?\b/g, '≤')
    .replace(/\\geq?\b/g, '≥')
    .replace(/\\neq\b/g, '≠')
    .replace(/\\pm\b/g, '±')
    .replace(/\\%/g, '%')
    .replace(/\\left\b|\\right\b/g, '')
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\!/g, '')
    .replace(/\^([+-]?\d+)/g, (_match, exponent: string) => superscript(exponent))
    .replace(/\\([A-Za-z]+)/g, '$1');

  return output.replace(/[ \t]+/g, ' ').trim();
}

export function SapReviewMathText({
  value,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { value: string | number | null | undefined }) {
  return <span className={className} {...props}>{formatSapReviewMath(value)}</span>;
}
