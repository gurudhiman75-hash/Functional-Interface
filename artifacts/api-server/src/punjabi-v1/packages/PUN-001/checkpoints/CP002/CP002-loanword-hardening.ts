import type { HardenableSpellingAuthority } from "./CP002-distractor-hardening";

/**
 * Plain-letter spellings of Perso-Arabic loanwords are historically/common-use
 * forms in Punjabi sources. Even where the dotted form is preferred by a modern
 * standard, these forms are too contestable to label as generic misspellings.
 */
export const CP002_LOANWORD_VARIANT_QUARANTINE = new Set<string>([
  "ਫਰਕ", "ਫੌਜ", "ਫਾਇਦਾ", "ਫੀਸ", "ਫਿਲਮ", "ਫਸਲ", "ਫਕੀਰ",
  "ਖਤ", "ਖਤਰਾ", "ਖਾਸ", "ਖਿਆਲ", "ਖੁਸ਼", "ਖੁਸ਼ੀ",
  "ਗਲਤ", "ਗੁਲਾਮ", "ਜਮੀਨ", "ਜਿਲ੍ਹਾ", "ਜਮਾਨਾ", "ਜਬਾਨ", "ਜੋਰ",
  "ਜਿੰਦਗੀ", "ਜਖਮ", "ਅਖਬਾਰ", "ਦਫਤਰ", "ਸਫਰ", "ਤਾਰੀਖ", "ਕਾਫੀ",
  "ਹਾਜਰੀ", "ਅਰਜੀ", "ਰਜਾਮੰਦੀ",
]);

const loanwordOverrides: Readonly<Record<string, readonly [string, string, string]>> = {
  "ED-W2-146": ["ਫ਼ਰੱਕ", "ਫ਼ਰਕਿ", "ਫ਼ਰਗ"],
  "ED-W2-147": ["ਫ਼ੌਜ਼", "ਫ਼ੋਜ", "ਫ਼ੌਜਿ"],
  "ED-W2-148": ["ਫ਼ਾਈਦਾ", "ਫ਼ਾਇਧਾ", "ਫ਼ਾਯਦਾ"],
  "ED-W2-149": ["ਫ਼ਿਸ", "ਫ਼ੀਸ਼", "ਫ਼ੀਸਿ"],
  "ED-W2-150": ["ਫ਼ੀਲਮ", "ਫ਼ਿਲੱਮ", "ਫ਼ੀਲੱਮ"],
  "ED-W2-151": ["ਫ਼ਸੱਲ", "ਫ਼ਸਾਲ", "ਫ਼ਸਲਿ"],
  "ED-W2-152": ["ਫ਼ਕਿਰ", "ਫ਼ਕੀੜ", "ਫ਼ਕੀਰਿ"],
  "ED-W2-153": ["ਖ਼ੱਤ", "ਖ਼ਿਤ", "ਖ਼ਤਿ"],
  "ED-W2-154": ["ਖ਼ੱਤਰਾ", "ਖ਼ਤੜਾ", "ਖ਼ਿਤਰਾ"],
  "ED-W2-155": ["ਖ਼ਾਸ਼", "ਖ਼ਾਸਿ", "ਖ਼ਾਸ਼ਿ"],
  "ED-W2-156": ["ਖ਼ਿਯਾਲ", "ਖ਼ਿਆਲ਼", "ਖ਼ਿਆਲਿ"],
  "ED-W2-157": ["ਖ਼ੂਸ਼", "ਖ਼ੁਸ", "ਖ਼ੁਸ਼ਿ"],
  "ED-W2-158": ["ਖ਼ੂਸ਼ੀ", "ਖ਼ੁਸੀ", "ਖ਼ੁਸ਼ਿ"],
  "ED-W2-159": ["ਗ਼ਲੱਤ", "ਗ਼ਲਤਿ", "ਗ਼ਲੱਟ"],
  "ED-W2-160": ["ਗ਼ੂਲਾਮ", "ਗ਼ੁਲਾਂਮ", "ਗ਼ੁਲਾਮਿ"],
  "ED-W2-161": ["ਜ਼ਮਿਨ", "ਜ਼ਮੀਣ", "ਜ਼ਮੀਨਿ"],
  "ED-W2-162": ["ਜ਼ੀਲ੍ਹਾ", "ਜ਼ਿਲ੍ਹਾਂ", "ਜ਼ਿੱਲ੍ਹਾ"],
  "ED-W2-163": ["ਜ਼ਮਾਂਨਾ", "ਜ਼ਾਮਾਨਾ", "ਜ਼ਮਨਾ"],
  "ED-W2-164": ["ਜ਼ਬਾਣ", "ਜ਼ਬਾਂਨ", "ਜ਼ਬਾਨਿ"],
  "ED-W2-165": ["ਜ਼ੌਰ", "ਜ਼ੋੜ", "ਜ਼ੋਰਿ"],
  "ED-W2-166": ["ਜ਼ਿਂਦਗੀ", "ਜ਼ਿੰਦਗਿ", "ਜ਼ੀੰਦਗੀ"],
  "ED-W2-167": ["ਜ਼ਖ਼ੱਮ", "ਜ਼ਖ਼ਮਿ", "ਜ਼ਖ਼ਿਮ"],
  "ED-W2-168": ["ਅਖ਼ਬਾੜ", "ਅਖ਼ਬਾਰਿ", "ਅਖ਼ੱਬਾਰ"],
  "ED-W2-169": ["ਦਫ਼ਤੜ", "ਦਫ਼ੱਤਰ", "ਦਫ਼ਤਰਿ"],
  "ED-W2-170": ["ਸਫ਼ੜ", "ਸਫ਼ੱਰ", "ਸਫ਼ਰਿ"],
  "ED-W2-171": ["ਤਾਰਿਖ਼", "ਤਾਰੀਖ਼਼", "ਤਾਰੀਖ਼ਿ"],
  "ED-W2-172": ["ਕਾਫ਼ਿ", "ਕਾਫ਼ੇ", "ਕਾਫ਼ਈ"],
  "ED-W2-173": ["ਹਾਜ਼ਰਿ", "ਹਾਜਿਰੀ", "ਹਾਜ਼ੀਰੀ"],
  "ED-W2-174": ["ਅਰਜ਼ਿ", "ਅਰਜ਼ਈ", "ਅਰਜ਼ੀਂ"],
  "ED-W2-175": ["ਰਜ਼ਮੰਦੀ", "ਰਜ਼ਾਮਦੀ", "ਰਜ਼ਾਮੰਦਿ"],
};

export function hardenCP002LoanwordAuthority<T extends HardenableSpellingAuthority>(authority: T): T {
  const incorrect = loanwordOverrides[authority.id];
  if (!incorrect) return authority;
  return { ...authority, incorrect } as T;
}
