import { useId, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const DEFAULT_WIDTH_TARGETS = [360, 390, 430] as const;

type UnknownRecord = Record<string, unknown>;

export interface ParsedQuestionExplanation {
  readonly lines: readonly string[];
  readonly answer: string | null;
  readonly optionAnalysis: readonly string[];
  readonly learnerLabel: string;
  readonly accessibilityLabel: string;
  readonly defaultOpen: boolean;
  readonly requiredWidthTargets: readonly number[];
  readonly source: 'STRUCTURED' | 'LEGACY_OBJECT' | 'LEGACY_TEXT' | 'EMPTY';
}

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as UnknownRecord
    : null;
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asTextList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => asText(entry))
    .filter(Boolean);
}

function asWidthTargets(value: unknown): number[] {
  if (!Array.isArray(value)) return [...DEFAULT_WIDTH_TARGETS];
  const widths = value
    .map((entry) => Number(entry))
    .filter((entry) => Number.isInteger(entry) && entry >= 320 && entry <= 1024);
  return widths.length > 0 ? [...new Set(widths)] : [...DEFAULT_WIDTH_TARGETS];
}

function legacyTextLines(value: string): string[] {
  return value
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseQuestionExplanation(
  payload: UnknownRecord | null,
): ParsedQuestionExplanation {
  const visible = asRecord(payload?.visibleExplanation);
  const reviewMetadata = asRecord(payload?.reviewMetadata);
  const contract = asRecord(reviewMetadata?.learnerRendererContract);
  const explanationObject = asRecord(payload?.explanation);
  const legacyExplanation = asText(payload?.explanation);

  const structuredLines = asTextList(visible?.lines);
  const objectLines = asTextList(explanationObject?.stepByStepSolution);
  const textLines = legacyTextLines(legacyExplanation);

  const lines = structuredLines.length > 0
    ? structuredLines
    : objectLines.length > 0
      ? objectLines
      : textLines.length > 0
        ? textLines
        : ['No explanation recorded.'];

  const source: ParsedQuestionExplanation['source'] = structuredLines.length > 0
    ? 'STRUCTURED'
    : objectLines.length > 0
      ? 'LEGACY_OBJECT'
      : textLines.length > 0
        ? 'LEGACY_TEXT'
        : 'EMPTY';

  return {
    lines,
    answer: asText(visible?.answer) || asText(payload?.answer) || null,
    optionAnalysis: asTextList(visible?.optionAnalysis),
    learnerLabel: asText(contract?.learnerLabel) || 'Why are the other options wrong?',
    accessibilityLabel: asText(contract?.accessibilityLabel) || 'Show why the other options are wrong',
    defaultOpen: contract?.defaultOpen === true,
    requiredWidthTargets: asWidthTargets(contract?.requiredWidthTargets),
    source,
  };
}

function openAccessibilityLabel(closedLabel: string, learnerLabel: string): string {
  if (/^show\b/i.test(closedLabel)) return closedLabel.replace(/^show\b/i, 'Hide');
  return `Hide ${learnerLabel.toLowerCase()}`;
}

export function QuestionExplanationDisclosure({
  payload,
  className,
}: {
  payload: UnknownRecord | null;
  className?: string;
}) {
  const parsed = parseQuestionExplanation(payload);
  const [open, setOpen] = useState(parsed.defaultOpen);
  const reactId = useId().replace(/:/g, '');
  const regionId = `question-explanation-options-${reactId}`;
  const hasOptionAnalysis = parsed.optionAnalysis.length > 0;

  return (
    <section
      className={cn('min-w-0 max-w-full space-y-3', className)}
      data-explanation-source={parsed.source}
      data-required-width-targets={parsed.requiredWidthTargets.join(',')}
      aria-label="Question explanation"
    >
      <div className="min-w-0 space-y-2 text-xs leading-relaxed text-muted-foreground">
        {parsed.lines.map((line, index) => (
          <p
            key={`${index}-${line}`}
            className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
          >
            {line}
          </p>
        ))}
      </div>

      {parsed.answer && (
        <p className="max-w-full break-words rounded-md border border-success/30 bg-success/5 px-3 py-2 text-xs font-semibold text-success [overflow-wrap:anywhere]">
          Answer: {parsed.answer}
        </p>
      )}

      {hasOptionAnalysis && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto min-h-9 w-full max-w-full justify-between gap-3 whitespace-normal px-3 py-2 text-left text-xs sm:w-auto"
              aria-controls={regionId}
              aria-expanded={open}
              aria-label={open
                ? openAccessibilityLabel(parsed.accessibilityLabel, parsed.learnerLabel)
                : parsed.accessibilityLabel}
            >
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{parsed.learnerLabel}</span>
              {open
                ? <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                : <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent
            id={regionId}
            role="region"
            aria-label={parsed.learnerLabel}
            className="mt-2 min-w-0 max-w-full rounded-md border bg-muted/20 p-3"
          >
            <ul className="min-w-0 space-y-2 text-xs leading-relaxed text-muted-foreground">
              {parsed.optionAnalysis.map((line, index) => (
                <li
                  key={`${index}-${line}`}
                  className="max-w-full break-words [overflow-wrap:anywhere]"
                >
                  {line}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </section>
  );
}
