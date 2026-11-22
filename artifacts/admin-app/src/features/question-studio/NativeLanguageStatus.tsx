import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuestionStudioItem } from './api';

export type NativeLanguageState = 'ready' | 'blocked' | 'missing';

/** Per-language state from what generation actually stored for this item. */
export function nativeLanguageStates(
  item: Pick<QuestionStudioItem, 'savedNativeReview'>,
  supportedLanguages: readonly string[],
): Array<{ language: 'hi' | 'pa'; state: NativeLanguageState; reason?: string }> {
  return (['hi', 'pa'] as const)
    .filter((language) => supportedLanguages.includes(language))
    .map((language) => {
      const variant = item.savedNativeReview?.variants.find((entry) => entry.language === language);
      if (!variant) return { language, state: 'missing' as const };
      if (variant.status === 'verified') return { language, state: 'ready' as const };
      return { language, state: 'blocked' as const, reason: variant.reason };
    });
}

const LABEL = { hi: 'HI', pa: 'PA' } as const;
const TEXT: Record<NativeLanguageState, string> = { ready: '✓', blocked: 'blocked', missing: 'not generated' };
const TONE: Record<NativeLanguageState, string> = {
  ready: 'border-success/30 bg-success/10 text-success',
  blocked: 'border-destructive/30 bg-destructive/10 text-destructive',
  missing: 'border-muted-foreground/20 text-muted-foreground',
};

export function NativeLanguageStatus({ item, supportedLanguages }: {
  item: Pick<QuestionStudioItem, 'savedNativeReview'>;
  supportedLanguages: readonly string[];
}) {
  const states = nativeLanguageStates(item, supportedLanguages);
  if (!states.length) return null;
  return (
    <span className="inline-flex items-center gap-1" aria-label="Languages stored at generation">
      <Badge variant="secondary" className="text-[10px]">EN ✓</Badge>
      {states.map(({ language, state, reason }) => (
        <Badge key={language} variant="outline" title={reason ?? (state === 'missing' ? 'Not stored at generation time; built when opened.' : undefined)}
          className={cn('text-[10px]', TONE[state])}>{LABEL[language]} {TEXT[state]}</Badge>
      ))}
    </span>
  );
}
