export type CP001WordKind = "LAGA" | "LAGAKHAR" | "DUTT";

export interface CP001WordAuthority {
  id: string;
  word: string;
  kind: CP001WordKind;
  targetNamePa: string;
  targetSymbol: string;
  sourceStatus: "REVIEW_PENDING";
}

function wordRows(
  prefix: string,
  words: readonly string[],
  kind: CP001WordKind,
  targetNamePa: string,
  targetSymbol: string,
): CP001WordAuthority[] {
  return words.map((word, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    word,
    kind,
    targetNamePa,
    targetSymbol,
    sourceStatus: "REVIEW_PENDING" as const,
  }));
}

export const CP001_WORD_AUTHORITIES: readonly CP001WordAuthority[] = [
  ...wordRows("W-MUK", ["ਘਰ", "ਕਲਮ", "ਨਗਰ", "ਵਚਨ", "ਜਗਤ", "ਨਮਕ", "ਸਫਲ", "ਅਮਨ"], "LAGA", "ਮੁਕਤਾ", "∅"),
  ...wordRows("W-KAN", ["ਕਾਰ", "ਨਾਮ", "ਬਾਗ", "ਪਾਣੀ", "ਸਾਥ", "ਰਾਜ", "ਕਾਲ", "ਦਾਲ"], "LAGA", "ਕੰਨਾ", "ਾ"),
  ...wordRows("W-SIH", ["ਸਿਰ", "ਦਿਨ", "ਕਿਤਾਬ", "ਵਿਦਿਆ", "ਚਿੜੀ", "ਮਿਲਣ", "ਕਿਰਨ", "ਲਿਖਤ"], "LAGA", "ਸਿਹਾਰੀ", "ਿ"),
  ...wordRows("W-BIH", ["ਤੀਰ", "ਨਦੀ", "ਕਵੀ", "ਜੀਵਨ", "ਦੀਵਾ", "ਸੀਮਾ", "ਪੀੜ", "ਨੀਤੀ"], "LAGA", "ਬਿਹਾਰੀ", "ੀ"),
  ...wordRows("W-AUN", ["ਗੁਣ", "ਕੁਲ", "ਪੁਲ", "ਸੁਖ", "ਮੁਖ", "ਦੁਖ", "ਕੁਝ", "ਤੁਲਨਾ"], "LAGA", "ਔਂਕੜ", "ੁ"),
  ...wordRows("W-DUL", ["ਸੂਰਜ", "ਦੂਰ", "ਮੂਰਤ", "ਭੂਮੀ", "ਪੂਰਾ", "ਸੂਚਨਾ", "ਧੂੜ", "ਰੂਪ"], "LAGA", "ਦੁਲੈਂਕੜ", "ੂ"),
  ...wordRows("W-LAA", ["ਸੇਬ", "ਮੇਲ", "ਦੇਸ਼", "ਖੇਤ", "ਵੇਰਵਾ", "ਨੇਮ", "ਰੇਲ", "ਤੇਲ"], "LAGA", "ਲਾਂ", "ੇ"),
  ...wordRows("W-DVA", ["ਸੈਰ", "ਪੈਰ", "ਬੈਠਕ", "ਮੈਦਾਨ", "ਮੈਲ", "ਵੈਰ", "ਕੈਦ", "ਗੈਰ"], "LAGA", "ਦੁਲਾਵਾਂ", "ੈ"),
  ...wordRows("W-HOR", ["ਮੋਰ", "ਚੋਰ", "ਕੋਟ", "ਰੋਟੀ", "ਸੋਚ", "ਲੋਕ", "ਗੋਲ", "ਜੋੜ"], "LAGA", "ਹੋੜਾ", "ੋ"),
  ...wordRows("W-KNO", ["ਕੌਲ", "ਕੌਮ", "ਮੌਸਮ", "ਦੌੜ", "ਚੌਲ", "ਨੌਕਰੀ", "ਸੌਦਾ", "ਪੌਦਾ"], "LAGA", "ਕਨੌੜਾ", "ੌ"),

  ...wordRows("W-TIP", ["ਪੰਜਾਬ", "ਸੰਸਾਰ", "ਸੰਵਿਧਾਨ", "ਗੰਭੀਰ", "ਕੰਧ", "ਝੰਡਾ", "ਪੰਛੀ", "ਸੰਪਤੀ", "ਮੰਜਾ", "ਸੰਗਤ"], "LAGAKHAR", "ਟਿੱਪੀ", "ੰ"),
  ...wordRows("W-BIN", ["ਗਾਂ", "ਮਾਂ", "ਹਾਂ", "ਕਾਂ", "ਕਿਤਾਬਾਂ", "ਨਾਵਾਂ", "ਰਾਹਾਂ", "ਛਾਂ", "ਚਾਂਦੀ", "ਤਾਂਬਾ"], "LAGAKHAR", "ਬਿੰਦੀ", "ਂ"),
  ...wordRows("W-ADD", ["ਹੱਥ", "ਸਿੱਖਿਆ", "ਸੱਚ", "ਪੱਥਰ", "ਗੁੱਸਾ", "ਕਿੱਸਾ", "ਹਿੱਸਾ", "ਉੱਤਰ", "ਸੱਦਾ", "ਚਿੱਠੀ"], "LAGAKHAR", "ਅੱਧਕ", "ੱ"),

  ...wordRows("W-HAH", ["ਪੜ੍ਹਾਈ", "ਪੜ੍ਹਨਾ", "ਚੜ੍ਹਨਾ", "ਜੜ੍ਹ", "ਵਰ੍ਹਾ"], "DUTT", "ਪੈਰੀਂ ਹਾਹਾ", "੍ਹ"),
  ...wordRows("W-RAR", ["ਪ੍ਰਸ਼ਨ", "ਪ੍ਰਕਾਸ਼", "ਪ੍ਰੇਮ", "ਕ੍ਰਮ", "ਗ੍ਰੰਥ", "ਦ੍ਰਿਸ਼ਟੀ", "ਤ੍ਰਿਕੋਣ"], "DUTT", "ਪੈਰੀਂ ਰਾਰਾ", "੍ਰ"),
  ...wordRows("W-VAV", ["ਸ੍ਵਰ", "ਸ੍ਵੈ-ਜੀਵਨੀ", "ਸ੍ਵਾਮੀ"], "DUTT", "ਪੈਰੀਂ ਵਾਵਾ", "੍ਵ"),
] as const;

export const CP001_LAGA_WORDS = CP001_WORD_AUTHORITIES.filter((x) => x.kind === "LAGA");
export const CP001_LAGAKHAR_WORDS = CP001_WORD_AUTHORITIES.filter((x) => x.kind === "LAGAKHAR");
export const CP001_DUTT_WORDS = CP001_WORD_AUTHORITIES.filter((x) => x.kind === "DUTT");
