export class GrammarResolver {
  /**
   * Resolves verb based on gender and number for the specified language.
   * Hindi: karta hai (m), karti hai (f)
   * Punjabi: karda hai (m), kardi hai (f)
   */
  public resolveVerb(
    verbBase: { en: string; hi: { m: string; f: string }; pa: { m: string; f: string } },
    gender: 'male' | 'female' | 'neutral',
    language: 'hi' | 'pa'
  ): string {
    const langVerbs = verbBase[language];
    // Default to male if neutral or unspecified
    if (gender === 'female') return langVerbs.f;
    return langVerbs.m;
  }

  /**
   * Resolves noun pluralization logic.
   * Handles "1 woman" vs "2 women" in Hindi/Punjabi to avoid "1 women".
   */
  public resolveNoun(
    count: number,
    singular: { en: string; hi: string; pa: string },
    plural: { en: string; hi: string; pa: string },
    language: 'en' | 'hi' | 'pa'
  ): string {
    if (count === 1) {
      return singular[language];
    }
    return plural[language];
  }

  /**
   * Prevents plural leak for singular counts in complex phrases.
   * Example: "1 महिला" instead of "1 महिलाएँ"
   */
  public formatWithCount(
    count: number,
    entity: { 
      singular: { en: string; hi: string; pa: string }, 
      plural: { en: string; hi: string; pa: string } 
    },
    language: 'en' | 'hi' | 'pa'
  ): string {
    const noun = this.resolveNoun(count, entity.singular, entity.plural, language);
    if (language === 'en') return `${count} ${noun}`;
    return `${count} ${noun}`;
  }

  /**
   * Helper for common competitive exam verbs
   */
  public getCommonVerb(id: 'saves' | 'spends' | 'earns' | 'does' | 'goes' | 'buys' | 'sells'): any {
    const verbs: Record<string, any> = {
      saves: {
        en: 'saves',
        hi: { m: 'बचाता है', f: 'बचाती है' },
        pa: { m: 'ਬਚਾਉਂਦਾ ਹੈ', f: 'ਬਚਾਉਂਦੀ ਹੈ' }
      },
      spends: {
        en: 'spends',
        hi: { m: 'खर्च करता है', f: 'खर्च करती है' },
        pa: { m: 'ਖਰਚ ਕਰਦਾ ਹੈ', f: 'ਖਰਚ ਕਰਦੀ ਹੈ' }
      },
      earns: {
        en: 'earns',
        hi: { m: 'कमाता है', f: 'कमाती है' },
        pa: { m: 'ਕਮਾਉਂਦਾ ਹੈ', f: 'ਕਮਾਉਂਦੀ ਹੈ' }
      },
      does: {
        en: 'does',
        hi: { m: 'करता है', f: 'करती है' },
        pa: { m: 'ਕਰਦਾ ਹੈ', f: 'ਕਰਦੀ ਹੈ' }
      },
      goes: {
        en: 'goes',
        hi: { m: 'गया', f: 'गई' },
        pa: { m: 'ਗਿਆ', f: 'ਗਈ' }
      },
      buys: {
        en: 'buys',
        hi: { m: 'खरीदता है', f: 'खरीदती है' },
        pa: { m: 'ਖਰੀਦਦਾ ਹੈ', f: 'ਖਰੀਦਦੀ ਹੈ' }
      },
      sells: {
        en: 'sells',
        hi: { m: 'बेचता है', f: 'बेचती है' },
        pa: { m: 'ਵੇਚਦਾ ਹੈ', f: 'ਵੇਚਦੀ ਹੈ' }
      }
    };
    return verbs[id];
  }
}
