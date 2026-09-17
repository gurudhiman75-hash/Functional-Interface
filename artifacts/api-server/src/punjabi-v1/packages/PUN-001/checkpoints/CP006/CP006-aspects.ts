export type CP006Aspect = "HABITUAL" | "PROGRESSIVE" | "PERFECT";

export interface CP006AspectAuthority {
  readonly id: string;
  readonly sentence: string;
  readonly verbPhrase: string;
  readonly aspect: CP006Aspect;
  readonly aspectPa: string;
  readonly explanationPa: string;
  readonly sourceStatus: "REVIEW_PENDING";
}

const A = (x: Omit<CP006AspectAuthority, "sourceStatus">): CP006AspectAuthority => ({...x, sourceStatus:"REVIEW_PENDING"});

export const CP006_ASPECT_AUTHORITIES: readonly CP006AspectAuthority[] = [
  A({id:"ASP-001",sentence:"ਉਹ ਹਰ ਰੋਜ਼ ਸਵੇਰੇ ਦੌੜਦਾ ਹੈ।",verbPhrase:"ਦੌੜਦਾ ਹੈ",aspect:"HABITUAL",aspectPa:"ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",explanationPa:"‘ਹਰ ਰੋਜ਼’ ਅਤੇ ‘ਦੌੜਦਾ ਹੈ’ ਵਾਰ-ਵਾਰ ਹੋਣ ਵਾਲੀ ਕਿਰਿਆ ਦੱਸਦੇ ਹਨ।"}),
  A({id:"ASP-002",sentence:"ਬੱਚੇ ਰੋਜ਼ ਸ਼ਾਮ ਨੂੰ ਖੇਡਦੇ ਹਨ।",verbPhrase:"ਖੇਡਦੇ ਹਨ",aspect:"HABITUAL",aspectPa:"ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",explanationPa:"ਵਾਕ ਰੋਜ਼ਾਨਾ ਦੁਹਰਾਈ ਜਾਣ ਵਾਲੀ ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ।"}),
  A({id:"ASP-003",sentence:"ਮਾਂ ਹਰ ਸਵੇਰ ਚਾਹ ਬਣਾਉਂਦੀ ਹੈ।",verbPhrase:"ਬਣਾਉਂਦੀ ਹੈ",aspect:"HABITUAL",aspectPa:"ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",explanationPa:"‘ਹਰ ਸਵੇਰ’ ਨਾਲ ਕਿਰਿਆ ਦੀ ਨਿਯਮਿਤ ਦੁਹਰਾਈ ਸਪਸ਼ਟ ਹੁੰਦੀ ਹੈ।"}),
  A({id:"ASP-004",sentence:"ਡਾਕੀਆ ਹਰ ਦਿਨ ਚਿੱਠੀਆਂ ਵੰਡਦਾ ਹੈ।",verbPhrase:"ਵੰਡਦਾ ਹੈ",aspect:"HABITUAL",aspectPa:"ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ",explanationPa:"ਇਹ ਵਾਰ-ਵਾਰ ਹੋਣ ਵਾਲੀ ਆਮ ਕਿਰਿਆ ਹੈ।"}),
  A({id:"ASP-005",sentence:"ਉਹ ਹੁਣ ਕਿਤਾਬ ਪੜ੍ਹ ਰਿਹਾ ਹੈ।",verbPhrase:"ਪੜ੍ਹ ਰਿਹਾ ਹੈ",aspect:"PROGRESSIVE",aspectPa:"ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",explanationPa:"ਕਿਰਿਆ ਇਸ ਵੇਲੇ ਚੱਲ ਰਹੀ ਹੈ ਅਤੇ ਅਜੇ ਪੂਰੀ ਨਹੀਂ ਹੋਈ।"}),
  A({id:"ASP-006",sentence:"ਕੁੜੀ ਇਸ ਸਮੇਂ ਗੀਤ ਗਾ ਰਹੀ ਹੈ।",verbPhrase:"ਗਾ ਰਹੀ ਹੈ",aspect:"PROGRESSIVE",aspectPa:"ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",explanationPa:"‘ਗਾ ਰਹੀ ਹੈ’ ਚੱਲ ਰਹੀ ਕਿਰਿਆ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"}),
  A({id:"ASP-007",sentence:"ਕਿਸਾਨ ਖੇਤ ਵਿੱਚ ਕਣਕ ਬੀਜ ਰਿਹਾ ਹੈ।",verbPhrase:"ਬੀਜ ਰਿਹਾ ਹੈ",aspect:"PROGRESSIVE",aspectPa:"ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",explanationPa:"ਕਿਰਿਆ ਜਾਰੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਚਾਲੂ ਜਾਂ ਅਪੂਰਨ ਪੱਖ ਹੈ।"}),
  A({id:"ASP-008",sentence:"ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।",verbPhrase:"ਖੇਡ ਰਹੇ ਹਨ",aspect:"PROGRESSIVE",aspectPa:"ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)",explanationPa:"‘ਖੇਡ ਰਹੇ ਹਨ’ ਚੱਲ ਰਹੀ ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ।"}),
  A({id:"ASP-009",sentence:"ਉਹ ਆਪਣਾ ਕੰਮ ਕਰ ਚੁੱਕਾ ਹੈ।",verbPhrase:"ਕਰ ਚੁੱਕਾ ਹੈ",aspect:"PERFECT",aspectPa:"ਪੂਰਨ ਪੱਖ",explanationPa:"‘ਕਰ ਚੁੱਕਾ ਹੈ’ ਕਿਰਿਆ ਦੇ ਪੂਰਾ ਹੋ ਜਾਣ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"}),
  A({id:"ASP-010",sentence:"ਕੁੜੀ ਪਾਠ ਯਾਦ ਕਰ ਚੁੱਕੀ ਹੈ।",verbPhrase:"ਯਾਦ ਕਰ ਚੁੱਕੀ ਹੈ",aspect:"PERFECT",aspectPa:"ਪੂਰਨ ਪੱਖ",explanationPa:"ਕਿਰਿਆ ਪੂਰੀ ਹੋ ਚੁੱਕੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਪੂਰਨ ਪੱਖ ਹੈ।"}),
  A({id:"ASP-011",sentence:"ਕਿਸਾਨ ਫਸਲ ਕੱਟ ਚੁੱਕਾ ਹੈ।",verbPhrase:"ਕੱਟ ਚੁੱਕਾ ਹੈ",aspect:"PERFECT",aspectPa:"ਪੂਰਨ ਪੱਖ",explanationPa:"‘ਕੱਟ ਚੁੱਕਾ ਹੈ’ ਪੂਰੀ ਹੋਈ ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ।"}),
  A({id:"ASP-012",sentence:"ਵਿਦਿਆਰਥੀ ਉੱਤਰ ਲਿਖ ਚੁੱਕੇ ਹਨ।",verbPhrase:"ਲਿਖ ਚੁੱਕੇ ਹਨ",aspect:"PERFECT",aspectPa:"ਪੂਰਨ ਪੱਖ",explanationPa:"ਵਾਕ ਵਿੱਚ ਲਿਖਣ ਦੀ ਕਿਰਿਆ ਪੂਰੀ ਹੋ ਚੁੱਕੀ ਹੈ।"}),
];

export const CP006_ASPECT_LABELS = ["ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ","ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)","ਪੂਰਨ ਪੱਖ","ਸਧਾਰਨ ਕਾਲ"] as const;
