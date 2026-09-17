export type CP006VerbType = "SAKARMAK" | "AKARMAK";
export type CP006Tense = "VARATMAN" | "BHOOT" | "BHAVIKHAT";

export interface CP006VerbAuthority {
  readonly id: string;
  readonly sentence: string;
  readonly verbPhrase: string;
  readonly mainVerb: string;
  readonly auxiliaryVerb?: string;
  readonly verbType: CP006VerbType;
  readonly tense: CP006Tense;
  readonly directObject?: string;
  readonly sentenceDistractors: readonly [string, string, string];
  readonly objectDistractors?: readonly [string, string, string];
  readonly explanationPa: string;
  readonly sourceStatus: "REVIEW_PENDING";
}

export interface CP006TenseTriplet {
  readonly id: string;
  readonly present: string;
  readonly past: string;
  readonly future: string;
  readonly pastNearMiss: string;
  readonly futureNearMiss: string;
  readonly explanationPa: string;
  readonly sourceStatus: "REVIEW_PENDING";
}

const V = (x: Omit<CP006VerbAuthority, "sourceStatus">): CP006VerbAuthority => ({ ...x, sourceStatus: "REVIEW_PENDING" });
const T = (x: Omit<CP006TenseTriplet, "sourceStatus">): CP006TenseTriplet => ({ ...x, sourceStatus: "REVIEW_PENDING" });

export const CP006_VERB_AUTHORITIES: readonly CP006VerbAuthority[] = [
  V({id:"VERB-001",sentence:"ਛੋਟਾ ਬੱਚਾ ਉੱਚੀ-ਉੱਚੀ ਹੱਸਦਾ ਹੈ।",verbPhrase:"ਹੱਸਦਾ ਹੈ",mainVerb:"ਹੱਸਦਾ",auxiliaryVerb:"ਹੈ",verbType:"AKARMAK",tense:"VARATMAN",sentenceDistractors:["ਛੋਟਾ ਬੱਚਾ","ਉੱਚੀ-ਉੱਚੀ","ਬੱਚਾ"],explanationPa:"‘ਹੱਸਦਾ ਹੈ’ ਕਿਰਿਆ ਨੂੰ ਕਰਮ ਦੀ ਲੋੜ ਨਹੀਂ ਪੈਂਦੀ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-002",sentence:"ਸਵੇਰੇ ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਡਦੇ ਹਨ।",verbPhrase:"ਉੱਡਦੇ ਹਨ",mainVerb:"ਉੱਡਦੇ",auxiliaryVerb:"ਹਨ",verbType:"AKARMAK",tense:"VARATMAN",sentenceDistractors:["ਸਵੇਰੇ","ਪੰਛੀ","ਆਕਾਸ਼ ਵਿੱਚ"],explanationPa:"‘ਉੱਡਦੇ ਹਨ’ ਦਾ ਕੰਮ ਕਰਤਾ ਤੱਕ ਹੀ ਰਹਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-003",sentence:"ਮਰੀਜ਼ ਕਮਰੇ ਵਿੱਚ ਸੌਂ ਰਿਹਾ ਸੀ।",verbPhrase:"ਸੌਂ ਰਿਹਾ ਸੀ",mainVerb:"ਸੌਂ ਰਿਹਾ",auxiliaryVerb:"ਸੀ",verbType:"AKARMAK",tense:"BHOOT",sentenceDistractors:["ਮਰੀਜ਼","ਕਮਰੇ ਵਿੱਚ","ਕਮਰੇ"],explanationPa:"‘ਸੌਂ ਰਿਹਾ ਸੀ’ ਬੀਤੇ ਸਮੇਂ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ; ਇਸ ਦਾ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ।"}),
  V({id:"VERB-004",sentence:"ਸੂਰਜ ਸ਼ਾਮ ਨੂੰ ਪੱਛਮ ਵਿੱਚ ਡੁੱਬੇਗਾ।",verbPhrase:"ਡੁੱਬੇਗਾ",mainVerb:"ਡੁੱਬੇਗਾ",verbType:"AKARMAK",tense:"BHAVIKHAT",sentenceDistractors:["ਸੂਰਜ","ਸ਼ਾਮ ਨੂੰ","ਪੱਛਮ ਵਿੱਚ"],explanationPa:"‘ਡੁੱਬੇਗਾ’ ਭਵਿੱਖ ਵਿੱਚ ਹੋਣ ਵਾਲੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-005",sentence:"ਨਦੀ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਤੇਜ਼ੀ ਨਾਲ ਵਗਦੀ ਹੈ।",verbPhrase:"ਵਗਦੀ ਹੈ",mainVerb:"ਵਗਦੀ",auxiliaryVerb:"ਹੈ",verbType:"AKARMAK",tense:"VARATMAN",sentenceDistractors:["ਨਦੀ","ਪਹਾੜਾਂ ਵਿੱਚੋਂ","ਤੇਜ਼ੀ ਨਾਲ"],explanationPa:"‘ਵਗਦੀ ਹੈ’ ਕਰਮ ਤੋਂ ਬਿਨਾਂ ਪੂਰਾ ਅਰਥ ਦਿੰਦੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-006",sentence:"ਖਿਡਾਰੀ ਮੈਦਾਨ ਵਿੱਚ ਤੇਜ਼ ਦੌੜਿਆ।",verbPhrase:"ਦੌੜਿਆ",mainVerb:"ਦੌੜਿਆ",verbType:"AKARMAK",tense:"BHOOT",sentenceDistractors:["ਖਿਡਾਰੀ","ਮੈਦਾਨ ਵਿੱਚ","ਤੇਜ਼"],explanationPa:"‘ਦੌੜਿਆ’ ਦਾ ਕੰਮ ਕਰਤਾ ਤੱਕ ਸੀਮਤ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-007",sentence:"ਮਹਿਮਾਨ ਕੱਲ੍ਹ ਸਵੇਰੇ ਵਾਪਸ ਮੁੜਨਗੇ।",verbPhrase:"ਮੁੜਨਗੇ",mainVerb:"ਮੁੜਨਗੇ",verbType:"AKARMAK",tense:"BHAVIKHAT",sentenceDistractors:["ਮਹਿਮਾਨ","ਕੱਲ੍ਹ ਸਵੇਰੇ","ਵਾਪਸ"],explanationPa:"‘ਮੁੜਨਗੇ’ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-008",sentence:"ਬਸੰਤ ਵਿੱਚ ਫੁੱਲ ਖਿੜਦੇ ਹਨ।",verbPhrase:"ਖਿੜਦੇ ਹਨ",mainVerb:"ਖਿੜਦੇ",auxiliaryVerb:"ਹਨ",verbType:"AKARMAK",tense:"VARATMAN",sentenceDistractors:["ਬਸੰਤ ਵਿੱਚ","ਫੁੱਲ","ਬਸੰਤ"],explanationPa:"‘ਖਿੜਦੇ ਹਨ’ ਨੂੰ ਕਿਸੇ ਕਰਮ ਦੀ ਲੋੜ ਨਹੀਂ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-009",sentence:"ਦਰਸ਼ਕ ਅਚਾਨਕ ਹੱਸ ਪਏ।",verbPhrase:"ਹੱਸ ਪਏ",mainVerb:"ਹੱਸ ਪਏ",verbType:"AKARMAK",tense:"BHOOT",sentenceDistractors:["ਦਰਸ਼ਕ","ਅਚਾਨਕ","ਦਰਸ਼ਕ ਅਚਾਨਕ"],explanationPa:"‘ਹੱਸ ਪਏ’ ਬੀਤੇ ਸਮੇਂ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-010",sentence:"ਰੇਲਗੱਡੀ ਕੁਝ ਸਮੇਂ ਬਾਅਦ ਆਵੇਗੀ।",verbPhrase:"ਆਵੇਗੀ",mainVerb:"ਆਵੇਗੀ",verbType:"AKARMAK",tense:"BHAVIKHAT",sentenceDistractors:["ਰੇਲਗੱਡੀ","ਕੁਝ ਸਮੇਂ","ਬਾਅਦ"],explanationPa:"‘ਆਵੇਗੀ’ ਭਵਿੱਖ ਵਿੱਚ ਹੋਣ ਵਾਲੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-011",sentence:"ਬੱਚੀ ਹੌਲੀ-ਹੌਲੀ ਤੁਰਦੀ ਹੈ।",verbPhrase:"ਤੁਰਦੀ ਹੈ",mainVerb:"ਤੁਰਦੀ",auxiliaryVerb:"ਹੈ",verbType:"AKARMAK",tense:"VARATMAN",sentenceDistractors:["ਬੱਚੀ","ਹੌਲੀ-ਹੌਲੀ","ਹੌਲੀ"],explanationPa:"‘ਤੁਰਦੀ ਹੈ’ ਦਾ ਕੋਈ ਕਰਮ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-012",sentence:"ਪੱਤੇ ਹਵਾ ਨਾਲ ਡਿੱਗ ਗਏ।",verbPhrase:"ਡਿੱਗ ਗਏ",mainVerb:"ਡਿੱਗ ਗਏ",verbType:"AKARMAK",tense:"BHOOT",sentenceDistractors:["ਪੱਤੇ","ਹਵਾ ਨਾਲ","ਹਵਾ"],explanationPa:"‘ਡਿੱਗ ਗਏ’ ਕਰਮ ਤੋਂ ਬਿਨਾਂ ਪੂਰਾ ਅਰਥ ਦਿੰਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),

  V({id:"VERB-013",sentence:"ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਫੁੱਟਬਾਲ ਖੇਡਦਾ ਹੈ।",verbPhrase:"ਖੇਡਦਾ ਹੈ",mainVerb:"ਖੇਡਦਾ",auxiliaryVerb:"ਹੈ",verbType:"SAKARMAK",tense:"VARATMAN",directObject:"ਫੁੱਟਬਾਲ",sentenceDistractors:["ਮੁੰਡਾ","ਮੈਦਾਨ ਵਿੱਚ","ਫੁੱਟਬਾਲ"],objectDistractors:["ਮੁੰਡਾ","ਮੈਦਾਨ","ਖੇਡਦਾ"],explanationPa:"‘ਖੇਡਦਾ ਹੈ’ ਦਾ ਕਰਮ ‘ਫੁੱਟਬਾਲ’ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-014",sentence:"ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੰਜਾਬੀ ਪੜ੍ਹਾਉਂਦਾ ਸੀ।",verbPhrase:"ਪੜ੍ਹਾਉਂਦਾ ਸੀ",mainVerb:"ਪੜ੍ਹਾਉਂਦਾ",auxiliaryVerb:"ਸੀ",verbType:"SAKARMAK",tense:"BHOOT",directObject:"ਪੰਜਾਬੀ",sentenceDistractors:["ਅਧਿਆਪਕ","ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ","ਪੰਜਾਬੀ"],objectDistractors:["ਅਧਿਆਪਕ","ਵਿਦਿਆਰਥੀਆਂ","ਪੜ੍ਹਾਉਂਦਾ"],explanationPa:"‘ਪੜ੍ਹਾਉਂਦਾ ਸੀ’ ਦਾ ਕਰਮ ‘ਪੰਜਾਬੀ’ ਹੈ ਅਤੇ ਕਿਰਿਆ ਭੂਤਕਾਲ ਵਿੱਚ ਹੈ।"}),
  V({id:"VERB-015",sentence:"ਕਿਸਾਨ ਖੇਤ ਵਿੱਚ ਕਣਕ ਬੀਜੇਗਾ।",verbPhrase:"ਬੀਜੇਗਾ",mainVerb:"ਬੀਜੇਗਾ",verbType:"SAKARMAK",tense:"BHAVIKHAT",directObject:"ਕਣਕ",sentenceDistractors:["ਕਿਸਾਨ","ਖੇਤ ਵਿੱਚ","ਕਣਕ"],objectDistractors:["ਕਿਸਾਨ","ਖੇਤ","ਬੀਜੇਗਾ"],explanationPa:"‘ਬੀਜੇਗਾ’ ਦਾ ਕਰਮ ‘ਕਣਕ’ ਹੈ ਅਤੇ ਇਹ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-016",sentence:"ਕੁੜੀ ਸੁਰੀਲਾ ਗੀਤ ਗਾਉਂਦੀ ਹੈ।",verbPhrase:"ਗਾਉਂਦੀ ਹੈ",mainVerb:"ਗਾਉਂਦੀ",auxiliaryVerb:"ਹੈ",verbType:"SAKARMAK",tense:"VARATMAN",directObject:"ਗੀਤ",sentenceDistractors:["ਕੁੜੀ","ਸੁਰੀਲਾ ਗੀਤ","ਸੁਰੀਲਾ"],objectDistractors:["ਕੁੜੀ","ਸੁਰੀਲਾ","ਗਾਉਂਦੀ"],explanationPa:"‘ਗਾਉਂਦੀ ਹੈ’ ਦਾ ਕਰਮ ‘ਗੀਤ’ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-017",sentence:"ਮਾਂ ਨੇ ਬੱਚੇ ਲਈ ਖਾਣਾ ਬਣਾਇਆ।",verbPhrase:"ਬਣਾਇਆ",mainVerb:"ਬਣਾਇਆ",verbType:"SAKARMAK",tense:"BHOOT",directObject:"ਖਾਣਾ",sentenceDistractors:["ਮਾਂ ਨੇ","ਬੱਚੇ ਲਈ","ਖਾਣਾ"],objectDistractors:["ਮਾਂ","ਬੱਚੇ","ਬਣਾਇਆ"],explanationPa:"‘ਬਣਾਇਆ’ ਦਾ ਕਰਮ ‘ਖਾਣਾ’ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-018",sentence:"ਵਿਦਿਆਰਥੀ ਕੱਲ੍ਹ ਲੇਖ ਲਿਖੇਗਾ।",verbPhrase:"ਲਿਖੇਗਾ",mainVerb:"ਲਿਖੇਗਾ",verbType:"SAKARMAK",tense:"BHAVIKHAT",directObject:"ਲੇਖ",sentenceDistractors:["ਵਿਦਿਆਰਥੀ","ਕੱਲ੍ਹ","ਲੇਖ"],objectDistractors:["ਵਿਦਿਆਰਥੀ","ਕੱਲ੍ਹ","ਲਿਖੇਗਾ"],explanationPa:"‘ਲਿਖੇਗਾ’ ਦਾ ਕਰਮ ‘ਲੇਖ’ ਹੈ ਅਤੇ ਕਿਰਿਆ ਭਵਿੱਖਤ ਕਾਲ ਵਿੱਚ ਹੈ।"}),
  V({id:"VERB-019",sentence:"ਰਸੋਈਆ ਸਬਜ਼ੀ ਕੱਟ ਰਿਹਾ ਹੈ।",verbPhrase:"ਕੱਟ ਰਿਹਾ ਹੈ",mainVerb:"ਕੱਟ ਰਿਹਾ",auxiliaryVerb:"ਹੈ",verbType:"SAKARMAK",tense:"VARATMAN",directObject:"ਸਬਜ਼ੀ",sentenceDistractors:["ਰਸੋਈਆ","ਸਬਜ਼ੀ","ਰਸੋਈਆ ਸਬਜ਼ੀ"],objectDistractors:["ਰਸੋਈਆ","ਕੱਟ","ਰਿਹਾ"],explanationPa:"‘ਕੱਟ ਰਿਹਾ ਹੈ’ ਦਾ ਕਰਮ ‘ਸਬਜ਼ੀ’ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-020",sentence:"ਡਾਕੀਏ ਨੇ ਚਿੱਠੀ ਪਹੁੰਚਾਈ।",verbPhrase:"ਪਹੁੰਚਾਈ",mainVerb:"ਪਹੁੰਚਾਈ",verbType:"SAKARMAK",tense:"BHOOT",directObject:"ਚਿੱਠੀ",sentenceDistractors:["ਡਾਕੀਏ ਨੇ","ਚਿੱਠੀ","ਡਾਕੀਆ"],objectDistractors:["ਡਾਕੀਆ","ਪਹੁੰਚਾਈ","ਨੇ"],explanationPa:"‘ਪਹੁੰਚਾਈ’ ਦਾ ਕਰਮ ‘ਚਿੱਠੀ’ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-021",sentence:"ਮਾਲੀ ਨਵੇਂ ਪੌਦੇ ਲਗਾਏਗਾ।",verbPhrase:"ਲਗਾਏਗਾ",mainVerb:"ਲਗਾਏਗਾ",verbType:"SAKARMAK",tense:"BHAVIKHAT",directObject:"ਪੌਦੇ",sentenceDistractors:["ਮਾਲੀ","ਨਵੇਂ ਪੌਦੇ","ਨਵੇਂ"],objectDistractors:["ਮਾਲੀ","ਨਵੇਂ","ਲਗਾਏਗਾ"],explanationPa:"‘ਲਗਾਏਗਾ’ ਦਾ ਕਰਮ ‘ਪੌਦੇ’ ਹੈ ਅਤੇ ਕਿਰਿਆ ਭਵਿੱਖਤ ਕਾਲ ਵਿੱਚ ਹੈ।"}),
  V({id:"VERB-022",sentence:"ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਹੈ।",verbPhrase:"ਪੀਂਦਾ ਹੈ",mainVerb:"ਪੀਂਦਾ",auxiliaryVerb:"ਹੈ",verbType:"SAKARMAK",tense:"VARATMAN",directObject:"ਦੁੱਧ",sentenceDistractors:["ਬੱਚਾ","ਦੁੱਧ","ਬੱਚਾ ਦੁੱਧ"],objectDistractors:["ਬੱਚਾ","ਪੀਂਦਾ","ਹੈ"],explanationPa:"‘ਪੀਂਦਾ ਹੈ’ ਦਾ ਕਰਮ ‘ਦੁੱਧ’ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-023",sentence:"ਉਸ ਨੇ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਿਆ।",verbPhrase:"ਖੋਲ੍ਹਿਆ",mainVerb:"ਖੋਲ੍ਹਿਆ",verbType:"SAKARMAK",tense:"BHOOT",directObject:"ਦਰਵਾਜ਼ਾ",sentenceDistractors:["ਉਸ ਨੇ","ਦਰਵਾਜ਼ਾ","ਉਸ"],objectDistractors:["ਉਸ","ਖੋਲ੍ਹਿਆ","ਨੇ"],explanationPa:"‘ਖੋਲ੍ਹਿਆ’ ਦਾ ਕਰਮ ‘ਦਰਵਾਜ਼ਾ’ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
  V({id:"VERB-024",sentence:"ਟੀਮ ਅਗਲੇ ਹਫ਼ਤੇ ਮੈਚ ਖੇਡੇਗੀ।",verbPhrase:"ਖੇਡੇਗੀ",mainVerb:"ਖੇਡੇਗੀ",verbType:"SAKARMAK",tense:"BHAVIKHAT",directObject:"ਮੈਚ",sentenceDistractors:["ਟੀਮ","ਅਗਲੇ ਹਫ਼ਤੇ","ਮੈਚ"],objectDistractors:["ਟੀਮ","ਹਫ਼ਤੇ","ਖੇਡੇਗੀ"],explanationPa:"‘ਖੇਡੇਗੀ’ ਦਾ ਕਰਮ ‘ਮੈਚ’ ਹੈ ਅਤੇ ਇਹ ਭਵਿੱਖਤ ਕਾਲ ਦੀ ਸਕਰਮਕ ਕਿਰਿਆ ਹੈ।"}),
];

export const CP006_TENSE_TRIPLETS: readonly CP006TenseTriplet[] = [
  T({id:"TNS-001",present:"ਮੁੰਡਾ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੈ।",past:"ਮੁੰਡਾ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਸੀ।",future:"ਮੁੰਡਾ ਕਿਤਾਬ ਪੜ੍ਹੇਗਾ।",pastNearMiss:"ਮੁੰਡਾ ਕਿਤਾਬ ਪੜ੍ਹ ਰਿਹਾ ਹੈ।",futureNearMiss:"ਮੁੰਡਾ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਸੀ।",explanationPa:"ਇੱਕੋ ਕੰਮ ਨੂੰ ਸਮੇਂ ਅਨੁਸਾਰ ਵਰਤਮਾਨ, ਭੂਤ ਅਤੇ ਭਵਿੱਖਤ ਰੂਪ ਵਿੱਚ ਬਦਲਿਆ ਗਿਆ ਹੈ।"}),
  T({id:"TNS-002",present:"ਕੁੜੀ ਗੀਤ ਗਾਉਂਦੀ ਹੈ।",past:"ਕੁੜੀ ਗੀਤ ਗਾਉਂਦੀ ਸੀ।",future:"ਕੁੜੀ ਗੀਤ ਗਾਏਗੀ।",pastNearMiss:"ਕੁੜੀ ਗੀਤ ਗਾ ਰਹੀ ਹੈ।",futureNearMiss:"ਕੁੜੀ ਗੀਤ ਗਾਉਂਦੀ ਸੀ।",explanationPa:"ਕਿਰਿਆ ਦਾ ਸਮਾਂ ਬਦਲਦਾ ਹੈ, ਪਰ ਕਰਤਾ ਅਤੇ ਕੰਮ ਦਾ ਮੂਲ ਅਰਥ ਉਹੀ ਰਹਿੰਦਾ ਹੈ।"}),
  T({id:"TNS-003",present:"ਕਿਸਾਨ ਖੇਤ ਜੋਤਦਾ ਹੈ।",past:"ਕਿਸਾਨ ਖੇਤ ਜੋਤਦਾ ਸੀ।",future:"ਕਿਸਾਨ ਖੇਤ ਜੋਤੇਗਾ।",pastNearMiss:"ਕਿਸਾਨ ਖੇਤ ਜੋਤ ਰਿਹਾ ਹੈ।",futureNearMiss:"ਕਿਸਾਨ ਖੇਤ ਜੋਤਦਾ ਸੀ।",explanationPa:"‘ਜੋਤਦਾ ਹੈ/ਸੀ/ਜੋਤੇਗਾ’ ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ।"}),
  T({id:"TNS-004",present:"ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਹੈ।",past:"ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਸੀ।",future:"ਬੱਚਾ ਦੁੱਧ ਪੀਏਗਾ।",pastNearMiss:"ਬੱਚਾ ਦੁੱਧ ਪੀ ਰਿਹਾ ਹੈ।",futureNearMiss:"ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਸੀ।",explanationPa:"‘ਪੀਂਦਾ ਹੈ’ ਵਰਤਮਾਨ, ‘ਪੀਂਦਾ ਸੀ’ ਭੂਤ ਅਤੇ ‘ਪੀਏਗਾ’ ਭਵਿੱਖਤ ਸਮਾਂ ਦੱਸਦੇ ਹਨ।"}),
  T({id:"TNS-005",present:"ਮਾਲੀ ਪੌਦੇ ਲਗਾਉਂਦਾ ਹੈ।",past:"ਮਾਲੀ ਪੌਦੇ ਲਗਾਉਂਦਾ ਸੀ।",future:"ਮਾਲੀ ਪੌਦੇ ਲਗਾਏਗਾ।",pastNearMiss:"ਮਾਲੀ ਪੌਦੇ ਲਗਾ ਰਿਹਾ ਹੈ।",futureNearMiss:"ਮਾਲੀ ਪੌਦੇ ਲਗਾਉਂਦਾ ਸੀ।",explanationPa:"ਵਾਕ ਦਾ ਮੂਲ ਕੰਮ ਉਹੀ ਹੈ; ਸਿਰਫ਼ ਕਾਲ ਬਦਲਦਾ ਹੈ।"}),
  T({id:"TNS-006",present:"ਵਿਦਿਆਰਥੀ ਉੱਤਰ ਲਿਖਦਾ ਹੈ।",past:"ਵਿਦਿਆਰਥੀ ਉੱਤਰ ਲਿਖਦਾ ਸੀ।",future:"ਵਿਦਿਆਰਥੀ ਉੱਤਰ ਲਿਖੇਗਾ।",pastNearMiss:"ਵਿਦਿਆਰਥੀ ਉੱਤਰ ਲਿਖ ਰਿਹਾ ਹੈ।",futureNearMiss:"ਵਿਦਿਆਰਥੀ ਉੱਤਰ ਲਿਖਦਾ ਸੀ।",explanationPa:"‘ਲਿਖਦਾ ਹੈ/ਸੀ/ਲਿਖੇਗਾ’ ਤਿੰਨ ਕਾਲਾਂ ਦੇ ਸਾਫ਼ ਰੂਪ ਹਨ।"}),
  T({id:"TNS-007",present:"ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦੇ ਹਨ।",past:"ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦੇ ਸਨ।",future:"ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਣਗੇ।",pastNearMiss:"ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।",futureNearMiss:"ਬੱਚੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦੇ ਸਨ।",explanationPa:"ਬਹੁਵਚਨ ਕਰਤਾ ਨਾਲ ਕਿਰਿਆ ਦਾ ਕਾਲ ਸਮੇਂ ਅਨੁਸਾਰ ਬਦਲਿਆ ਹੈ।"}),
  T({id:"TNS-008",present:"ਰੇਲਗੱਡੀ ਸਮੇਂ ਸਿਰ ਆਉਂਦੀ ਹੈ।",past:"ਰੇਲਗੱਡੀ ਸਮੇਂ ਸਿਰ ਆਉਂਦੀ ਸੀ।",future:"ਰੇਲਗੱਡੀ ਸਮੇਂ ਸਿਰ ਆਵੇਗੀ।",pastNearMiss:"ਰੇਲਗੱਡੀ ਸਮੇਂ ਸਿਰ ਆ ਰਹੀ ਹੈ।",futureNearMiss:"ਰੇਲਗੱਡੀ ਸਮੇਂ ਸਿਰ ਆਉਂਦੀ ਸੀ।",explanationPa:"‘ਆਉਂਦੀ ਹੈ/ਸੀ/ਆਵੇਗੀ’ ਕਾਲ ਦੇ ਅਨੁਸਾਰ ਬਦਲਦੇ ਹਨ।"}),
  T({id:"TNS-009",present:"ਮਾਂ ਖਾਣਾ ਬਣਾਉਂਦੀ ਹੈ।",past:"ਮਾਂ ਖਾਣਾ ਬਣਾਉਂਦੀ ਸੀ।",future:"ਮਾਂ ਖਾਣਾ ਬਣਾਏਗੀ।",pastNearMiss:"ਮਾਂ ਖਾਣਾ ਬਣਾ ਰਹੀ ਹੈ।",futureNearMiss:"ਮਾਂ ਖਾਣਾ ਬਣਾਉਂਦੀ ਸੀ।",explanationPa:"ਕਾਲ ਬਦਲਣ ਨਾਲ ਕਿਰਿਆ-ਰੂਪ ਬਦਲਦਾ ਹੈ, ਪਰ ਵਾਕ ਦਾ ਮੁੱਖ ਅਰਥ ਕਾਇਮ ਰਹਿੰਦਾ ਹੈ।"}),
  T({id:"TNS-010",present:"ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਡਦੇ ਹਨ।",past:"ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਡਦੇ ਸਨ।",future:"ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਡਣਗੇ।",pastNearMiss:"ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਡ ਰਹੇ ਹਨ।",futureNearMiss:"ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਡਦੇ ਸਨ।",explanationPa:"ਇੱਕੋ ਕਿਰਿਆ ਦੇ ਵਰਤਮਾਨ, ਭੂਤ ਅਤੇ ਭਵਿੱਖਤ ਰੂਪ ਦਿੱਤੇ ਗਏ ਹਨ।"}),
  T({id:"TNS-011",present:"ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਂਦਾ ਹੈ।",past:"ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਂਦਾ ਸੀ।",future:"ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਵੇਗਾ।",pastNearMiss:"ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾ ਰਿਹਾ ਹੈ।",futureNearMiss:"ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਂਦਾ ਸੀ।",explanationPa:"‘ਜਾਂਦਾ ਹੈ/ਸੀ/ਜਾਵੇਗਾ’ ਤਿੰਨ ਸਮਿਆਂ ਨੂੰ ਵੱਖ ਕਰਦੇ ਹਨ।"}),
  T({id:"TNS-012",present:"ਡਾਕੀਆ ਚਿੱਠੀ ਪਹੁੰਚਾਉਂਦਾ ਹੈ।",past:"ਡਾਕੀਆ ਚਿੱਠੀ ਪਹੁੰਚਾਉਂਦਾ ਸੀ।",future:"ਡਾਕੀਆ ਚਿੱਠੀ ਪਹੁੰਚਾਏਗਾ।",pastNearMiss:"ਡਾਕੀਆ ਚਿੱਠੀ ਪਹੁੰਚਾ ਰਿਹਾ ਹੈ।",futureNearMiss:"ਡਾਕੀਆ ਚਿੱਠੀ ਪਹੁੰਚਾਉਂਦਾ ਸੀ।",explanationPa:"ਵਰਤਮਾਨ ਤੋਂ ਭੂਤ ਜਾਂ ਭਵਿੱਖਤ ਕਾਲ ਵਿੱਚ ਬਦਲਦੇ ਸਮੇਂ ਕਿਰਿਆ-ਰੂਪ ਬਦਲਦਾ ਹੈ।"}),
];

export const CP006_TENSE_LABELS = {
  VARATMAN: "ਵਰਤਮਾਨ ਕਾਲ",
  BHOOT: "ਭੂਤਕਾਲ",
  BHAVIKHAT: "ਭਵਿੱਖਤ ਕਾਲ",
} as const;

export const CP006_VERB_TYPE_LABELS = {
  SAKARMAK: "ਸਕਰਮਕ ਕਿਰਿਆ",
  AKARMAK: "ਅਕਰਮਕ ਕਿਰਿਆ",
} as const;
