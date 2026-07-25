import { MathJax } from 'better-react-mathjax';

import { cn } from '@/lib/utils';

interface MathTextProps {
  content: string | number | null | undefined;
  className?: string;
  inline?: boolean;
}

/**
 * Renders mixed prose and TeX using the platform delimiters:
 * - inline: $...$ or \\(...\\)
 * - display: $$...$$ or \\[...\\]
 *
 * Authoring remains plain UTF-8 text. Only delimited mathematical segments are
 * typeset, so English, Hindi and Punjabi prose keep their normal fonts.
 */
export function MathText({ content, className, inline = false }: MathTextProps) {
  const normalized = content === null || content === undefined ? '' : String(content);

  return (
    <MathJax
      inline={inline}
      dynamic
      hideUntilTypeset="first"
      className={cn(
        'math-only whitespace-pre-wrap [&_mjx-container]:max-w-full [&_mjx-container]:overflow-x-auto',
        inline && 'inline',
        className,
      )}
    >
      {normalized}
    </MathJax>
  );
}

export default MathText;
