export interface CP009SynonymAuthority {
  readonly id:string;
  readonly headword:string;
  readonly synonyms:readonly [string,string,string];
  readonly outsiders:readonly [string,string,string,string];
  readonly explanationPa:string;
  readonly sourceStatus:"REVIEW_PENDING";
}
export interface CP009AntonymAuthority {
  readonly id:string;
  readonly word:string;
  readonly antonym:string;
  readonly sourceConfusables:readonly [string,string,string];
  readonly explanationPa:string;
  readonly sourceStatus:"REVIEW_PENDING";
}
export interface CP009ContextAuthority {
  readonly id:string;
  readonly termA:string;
  readonly termB:string;
  readonly sentence:string;
  readonly correctTerm:string;
  readonly distractors:readonly [string,string,string];
  readonly explanationPa:string;
  readonly sourceStatus:"REVIEW_PENDING";
}

export const CP009_SYNONYM_AUTHORITIES:readonly CP009SynonymAuthority[]=[
{id:"SYN-A01",headword:"ਉੱਤਮ",synonyms:["ਸ਼੍ਰੇਸ਼ਠ","ਵਧੀਆ","ਚੰਗਾ"],outsiders:["ਸਧਾਰਨ","ਆਮ","ਕਮਜ਼ੋਰ","ਮੱਧਮ"],explanationPa:"‘ਉੱਤਮ’ ਲਈ ‘ਸ਼੍ਰੇਸ਼ਠ’, ‘ਵਧੀਆ’ ਅਤੇ ‘ਚੰਗਾ’ ਸਮਾਨ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A02",headword:"ਆਜ਼ਾਦੀ",synonyms:["ਸੁਤੰਤਰਤਾ","ਖ਼ੁਦਮੁਖ਼ਤਿਆਰੀ","ਮੁਕਤੀ"],outsiders:["ਸੁਰੱਖਿਆ","ਅਧਿਕਾਰ","ਨਿਆਂ","ਸਮਾਨਤਾ"],explanationPa:"‘ਆਜ਼ਾਦੀ’ ਦਾ ਭਾਵ ਸੁਤੰਤਰ ਹੋਣ ਨਾਲ ਹੈ; ‘ਸੁਤੰਤਰਤਾ’ ਇਸ ਦਾ ਸਿੱਧਾ ਸਮਾਨਾਰਥਕ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A03",headword:"ਬਹਾਦਰ",synonyms:["ਸੂਰਬੀਰ","ਦਲੇਰ","ਨਿਡਰ"],outsiders:["ਤਾਕਤਵਰ","ਚੁਸਤ","ਸਿਆਣਾ","ਧੀਰਜਵਾਨ"],explanationPa:"‘ਬਹਾਦਰ’, ‘ਸੂਰਬੀਰ’, ‘ਦਲੇਰ’ ਅਤੇ ‘ਨਿਡਰ’ ਹਿੰਮਤ ਵਾਲੇ ਵਿਅਕਤੀ ਲਈ ਵਰਤੇ ਜਾਂਦੇ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A04",headword:"ਹੰਕਾਰ",synonyms:["ਘਮੰਡ","ਗ਼ਰੂਰ","ਆਕੜ"],outsiders:["ਮਾਣ","ਆਤਮਵਿਸ਼ਵਾਸ","ਹੌਸਲਾ","ਜੋਸ਼"],explanationPa:"‘ਹੰਕਾਰ’ ਲਈ ‘ਘਮੰਡ’, ‘ਗ਼ਰੂਰ’ ਅਤੇ ‘ਆਕੜ’ ਨੇੜਲੇ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A05",headword:"ਅਮੀਰ",synonyms:["ਦੌਲਤਮੰਦ","ਧਨਾਢ","ਮਾਲਦਾਰ"],outsiders:["ਵਪਾਰੀ","ਮਾਲਕ","ਉਦਯੋਗਪਤੀ","ਨੌਕਰ"],explanationPa:"‘ਅਮੀਰ’ ਧਨ ਵਾਲੇ ਵਿਅਕਤੀ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ; ‘ਦੌਲਤਮੰਦ’, ‘ਧਨਾਢ’ ਅਤੇ ‘ਮਾਲਦਾਰ’ ਇਸ ਦੇ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A06",headword:"ਦੋਸਤ",synonyms:["ਮਿੱਤਰ","ਬੇਲੀ","ਯਾਰ"],outsiders:["ਪੜੋਸੀ","ਜਾਣੂ","ਸਹਿਕਰਮੀ","ਰਿਸ਼ਤੇਦਾਰ"],explanationPa:"‘ਦੋਸਤ’ ਲਈ ‘ਮਿੱਤਰ’, ‘ਬੇਲੀ’ ਅਤੇ ‘ਯਾਰ’ ਸਮਾਨ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A07",headword:"ਕਿਰਪਾ",synonyms:["ਮਿਹਰ","ਦਇਆ","ਰਹਿਮਤ"],outsiders:["ਮਦਦ","ਇਨਾਮ","ਆਸ਼ੀਰਵਾਦ","ਸਹਾਇਤਾ"],explanationPa:"‘ਕਿਰਪਾ’ ਦਾ ਭਾਵ ਮਿਹਰ ਜਾਂ ਦਇਆ ਕਰਨ ਨਾਲ ਹੈ; ‘ਮਿਹਰ’ ਅਤੇ ‘ਰਹਿਮਤ’ ਵੀ ਇਸੇ ਅਰਥ-ਖੇਤਰ ਦੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A08",headword:"ਚਾਨਣ",synonyms:["ਰੌਸ਼ਨੀ","ਪ੍ਰਕਾਸ਼","ਉਜਾਲਾ"],outsiders:["ਧੁੱਪ","ਚਮਕ","ਛਾਂ","ਰੰਗ"],explanationPa:"‘ਚਾਨਣ’ ਲਈ ‘ਰੌਸ਼ਨੀ’, ‘ਪ੍ਰਕਾਸ਼’ ਅਤੇ ‘ਉਜਾਲਾ’ ਸਮਾਨ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A09",headword:"ਜੰਗ",synonyms:["ਯੁੱਧ","ਲੜਾਈ","ਸੰਗਰਾਮ"],outsiders:["ਫੌਜ","ਹਮਲਾ","ਰੱਖਿਆ","ਸੰਧੀ"],explanationPa:"‘ਜੰਗ’ ਦਾ ਅਰਥ ਯੁੱਧ ਜਾਂ ਲੜਾਈ ਹੈ; ‘ਸੰਗਰਾਮ’ ਵੀ ਇਸੇ ਅਰਥ ਵਿੱਚ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A10",headword:"ਪਾਣੀ",synonyms:["ਜਲ","ਨੀਰ","ਆਬ"],outsiders:["ਮੀਂਹ","ਨਦੀ","ਸਮੁੰਦਰ","ਤਰਲ"],explanationPa:"‘ਪਾਣੀ’ ਲਈ ‘ਜਲ’, ‘ਨੀਰ’ ਅਤੇ ‘ਆਬ’ ਪ੍ਰਚਲਿਤ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A11",headword:"ਅਸਮਾਨ",synonyms:["ਅਕਾਸ਼","ਗਗਨ","ਅੰਬਰ"],outsiders:["ਬੱਦਲ","ਹਵਾ","ਖਿਤਿਜ","ਤਾਰਾ"],explanationPa:"‘ਅਸਮਾਨ’ ਲਈ ‘ਅਕਾਸ਼’, ‘ਗਗਨ’ ਅਤੇ ‘ਅੰਬਰ’ ਸਮਾਨ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A12",headword:"ਉੱਦਮ",synonyms:["ਉਪਰਾਲਾ","ਯਤਨ","ਕੋਸ਼ਿਸ਼"],outsiders:["ਕੰਮ","ਯੋਜਨਾ","ਹੁਨਰ","ਹੌਸਲਾ"],explanationPa:"‘ਉੱਦਮ’ ਦਾ ਭਾਵ ਕਿਸੇ ਕੰਮ ਲਈ ਯਤਨ ਜਾਂ ਉਪਰਾਲਾ ਕਰਨ ਨਾਲ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A13",headword:"ਕ੍ਰੋਧ",synonyms:["ਗੁੱਸਾ","ਰੋਹ","ਤੈਸ਼"],outsiders:["ਚਿੰਤਾ","ਡਰ","ਦੁੱਖ","ਹੈਰਾਨੀ"],explanationPa:"‘ਕ੍ਰੋਧ’ ਲਈ ‘ਗੁੱਸਾ’, ‘ਰੋਹ’ ਅਤੇ ‘ਤੈਸ਼’ ਸਮਾਨ ਜਾਂ ਬਹੁਤ ਨੇੜਲੇ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A14",headword:"ਜੰਗਲ",synonyms:["ਬਨ","ਕਾਨਨ","ਅਰੰਨ"],outsiders:["ਬਾਗ਼","ਖੇਤ","ਬਸਤੀ","ਪਹਾੜ"],explanationPa:"‘ਜੰਗਲ’ ਲਈ ‘ਬਨ’, ‘ਕਾਨਨ’ ਅਤੇ ‘ਅਰੰਨ’ ਸਾਹਿਤਕ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A15",headword:"ਨਦੀ",synonyms:["ਦਰਿਆ","ਸਰਿਤਾ","ਤਰੰਗਿਣੀ"],outsiders:["ਝੀਲ","ਨਹਿਰ","ਸਮੁੰਦਰ","ਖੂਹ"],explanationPa:"‘ਨਦੀ’ ਲਈ ‘ਦਰਿਆ’ ਅਤੇ ‘ਸਰਿਤਾ’ ਪ੍ਰਚਲਿਤ ਸਮਾਨਾਰਥਕ ਹਨ; ‘ਤਰੰਗਿਣੀ’ ਸਾਹਿਤਕ ਰੂਪ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A16",headword:"ਪੰਛੀ",synonyms:["ਪਰਿੰਦਾ","ਪੰਖੇਰੂ","ਖ਼ਗ"],outsiders:["ਜਾਨਵਰ","ਕੀੜਾ","ਮੱਛੀ","ਚੌਪਾਇਆ"],explanationPa:"‘ਪੰਛੀ’ ਲਈ ‘ਪਰਿੰਦਾ’, ‘ਪੰਖੇਰੂ’ ਅਤੇ ‘ਖ਼ਗ’ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A17",headword:"ਫੁੱਲ",synonyms:["ਪੁਸ਼ਪ","ਸੁਮਨ","ਕੁਸੁਮ"],outsiders:["ਕਲੀ","ਪੱਤਾ","ਫਲ","ਬੀਜ"],explanationPa:"‘ਫੁੱਲ’ ਲਈ ‘ਪੁਸ਼ਪ’, ‘ਸੁਮਨ’ ਅਤੇ ‘ਕੁਸੁਮ’ ਸਾਹਿਤਕ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A18",headword:"ਰਾਤ",synonyms:["ਰੈਣ","ਨਿਸਾ","ਸ਼ਬ"],outsiders:["ਸ਼ਾਮ","ਸਵੇਰ","ਦੁਪਹਿਰ","ਦਿਨ"],explanationPa:"‘ਰਾਤ’ ਲਈ ‘ਰੈਣ’, ‘ਨਿਸਾ’ ਅਤੇ ‘ਸ਼ਬ’ ਸਮਾਨ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A19",headword:"ਚੰਦਰਮਾ",synonyms:["ਚੰਨ","ਸ਼ਸ਼ੀ","ਮਹਿਤਾਬ"],outsiders:["ਤਾਰਾ","ਸੂਰਜ","ਗ੍ਰਹਿ","ਬੱਦਲ"],explanationPa:"‘ਚੰਦਰਮਾ’ ਲਈ ‘ਚੰਨ’, ‘ਸ਼ਸ਼ੀ’ ਅਤੇ ‘ਮਹਿਤਾਬ’ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A20",headword:"ਖ਼ੁਸ਼ੀ",synonyms:["ਪ੍ਰਸੰਨਤਾ","ਅਨੰਦ","ਹੁਲਾਸ"],outsiders:["ਮੁਸਕਾਨ","ਹਾਸਾ","ਉਤਸ਼ਾਹ","ਸੰਤੋਖ"],explanationPa:"‘ਖ਼ੁਸ਼ੀ’ ਲਈ ‘ਪ੍ਰਸੰਨਤਾ’, ‘ਅਨੰਦ’ ਅਤੇ ‘ਹੁਲਾਸ’ ਸਮਾਨ ਜਾਂ ਨੇੜਲੇ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A21",headword:"ਅਕਲ",synonyms:["ਬੁੱਧੀ","ਸਮਝ","ਮੱਤ"],outsiders:["ਗਿਆਨ","ਅਨੁਭਵ","ਸਿੱਖਿਆ","ਹੁਨਰ"],explanationPa:"‘ਅਕਲ’ ਲਈ ‘ਬੁੱਧੀ’, ‘ਸਮਝ’ ਅਤੇ ‘ਮੱਤ’ ਸਮਾਨ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A22",headword:"ਗਿਆਨ",synonyms:["ਵਿੱਦਿਆ","ਬੋਧ","ਇਲਮ"],outsiders:["ਜਾਣਕਾਰੀ","ਅਨੁਭਵ","ਖ਼ਬਰ","ਹੁਨਰ"],explanationPa:"‘ਗਿਆਨ’ ਲਈ ‘ਵਿੱਦਿਆ’, ‘ਬੋਧ’ ਅਤੇ ‘ਇਲਮ’ ਇਸ ਅਰਥ-ਖੇਤਰ ਦੇ ਪ੍ਰਮੁੱਖ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A23",headword:"ਸੰਸਾਰ",synonyms:["ਜਗਤ","ਦੁਨੀਆ","ਜਹਾਨ"],outsiders:["ਸਮਾਜ","ਦੇਸ਼","ਬ੍ਰਹਿਮੰਡ","ਇਲਾਕਾ"],explanationPa:"‘ਸੰਸਾਰ’ ਲਈ ‘ਜਗਤ’, ‘ਦੁਨੀਆ’ ਅਤੇ ‘ਜਹਾਨ’ ਸਮਾਨ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
{id:"SYN-A24",headword:"ਅੱਖ",synonyms:["ਨੇਤਰ","ਨੈਣ","ਲੋਚਨ"],outsiders:["ਚਿਹਰਾ","ਮੱਥਾ","ਨਜ਼ਰ","ਪੁਤਲੀ"],explanationPa:"‘ਅੱਖ’ ਲਈ ‘ਨੇਤਰ’, ‘ਨੈਣ’ ਅਤੇ ‘ਲੋਚਨ’ ਪ੍ਰਚਲਿਤ ਜਾਂ ਸਾਹਿਤਕ ਸਮਾਨਾਰਥਕ ਹਨ।",sourceStatus:"REVIEW_PENDING"},
] as const;

export const CP009_ANTONYM_AUTHORITIES:readonly CP009AntonymAuthority[]=[
{id:"ANT-A01",word:"ਸੱਚ",antonym:"ਝੂਠ",sourceConfusables:["ਸਤ","ਹਕੀਕਤ","ਯਥਾਰਥ"],explanationPa:"‘ਸੱਚ’ ਦਾ ਉਲਟ ਅਰਥ ‘ਝੂਠ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A02",word:"ਆਦਰ",antonym:"ਨਿਰਾਦਰ",sourceConfusables:["ਸਤਿਕਾਰ","ਮਾਣ","ਇੱਜ਼ਤ"],explanationPa:"‘ਆਦਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਿਰਾਦਰ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A03",word:"ਅਸਲੀ",antonym:"ਨਕਲੀ",sourceConfusables:["ਖਰਾ","ਵਾਸਤਵਿਕ","ਸੱਚਾ"],explanationPa:"‘ਅਸਲੀ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਕਲੀ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A04",word:"ਜਿੱਤ",antonym:"ਹਾਰ",sourceConfusables:["ਵਿਜੈ","ਫ਼ਤਹਿ","ਕਾਮਯਾਬੀ"],explanationPa:"‘ਜਿੱਤ’ ਦਾ ਉਲਟ ਨਤੀਜਾ ‘ਹਾਰ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A05",word:"ਆਰੰਭ",antonym:"ਅੰਤ",sourceConfusables:["ਸ਼ੁਰੂਆਤ","ਆਗਾਜ਼","ਪ੍ਰਾਰੰਭ"],explanationPa:"‘ਆਰੰਭ’ ਕਿਸੇ ਕੰਮ ਦੀ ਸ਼ੁਰੂਆਤ ਹੈ, ਜਦਕਿ ‘ਅੰਤ’ ਉਸ ਦੀ ਸਮਾਪਤੀ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A06",word:"ਔਖਾ",antonym:"ਸੌਖਾ",sourceConfusables:["ਮੁਸ਼ਕਲ","ਕਠਿਨ","ਦੁਸ਼ਵਾਰ"],explanationPa:"‘ਔਖਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸੌਖਾ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A07",word:"ਖਰਾ",antonym:"ਖੋਟਾ",sourceConfusables:["ਅਸਲੀ","ਸ਼ੁੱਧ","ਸੱਚਾ"],explanationPa:"‘ਖਰਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਖੋਟਾ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A08",word:"ਗੁਣ",antonym:"ਔਗੁਣ",sourceConfusables:["ਖੂਬੀ","ਵਿਸ਼ੇਸ਼ਤਾ","ਚੰਗਿਆਈ"],explanationPa:"‘ਗੁਣ’ ਦੇ ਉਲਟ ਮੰਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਨੂੰ ‘ਔਗੁਣ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A09",word:"ਜੀਵਨ",antonym:"ਮੌਤ",sourceConfusables:["ਜ਼ਿੰਦਗੀ","ਜੀਵਨਕਾਲ","ਉਮਰ"],explanationPa:"‘ਜੀਵਨ’ ਦਾ ਉਲਟ ਅਰਥ ‘ਮੌਤ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A10",word:"ਡਰਪੋਕ",antonym:"ਨਿਡਰ",sourceConfusables:["ਕਾਇਰ","ਬੁਜ਼ਦਿਲ","ਕਮਦਿਲ"],explanationPa:"‘ਡਰਪੋਕ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਿਡਰ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A11",word:"ਪਿਆਰ",antonym:"ਨਫ਼ਰਤ",sourceConfusables:["ਪ੍ਰੇਮ","ਮੁਹੱਬਤ","ਸਨੇਹ"],explanationPa:"‘ਪਿਆਰ’ ਦਾ ਵਿਰੋਧੀ ਭਾਵ ‘ਨਫ਼ਰਤ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A12",word:"ਮਿੱਠਾ",antonym:"ਕੌੜਾ",sourceConfusables:["ਮਧੁਰ","ਰਸਦਾਰ","ਸੁਆਦਲਾ"],explanationPa:"ਸੁਆਦ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ‘ਮਿੱਠਾ’ ਦਾ ਵਿਰੋਧੀ ‘ਕੌੜਾ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A13",word:"ਸਿਆਣਾ",antonym:"ਮੂਰਖ",sourceConfusables:["ਬੁੱਧੀਮਾਨ","ਸਮਝਦਾਰ","ਅਕਲਮੰਦ"],explanationPa:"‘ਸਿਆਣਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਮੂਰਖ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A14",word:"ਵਫ਼ਾਦਾਰ",antonym:"ਗ਼ੱਦਾਰ",sourceConfusables:["ਨਿਸ਼ਠਾਵਾਨ","ਭਰੋਸੇਯੋਗ","ਸੱਚਾ"],explanationPa:"‘ਵਫ਼ਾਦਾਰ’ ਦੇ ਉਲਟ ਵਿਸ਼ਵਾਸ ਤੋੜਨ ਵਾਲੇ ਲਈ ‘ਗ਼ੱਦਾਰ’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A15",word:"ਜੰਗ",antonym:"ਅਮਨ",sourceConfusables:["ਯੁੱਧ","ਲੜਾਈ","ਸੰਗਰਾਮ"],explanationPa:"‘ਜੰਗ’ ਦਾ ਵਿਰੋਧੀ ਭਾਵ ‘ਅਮਨ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A16",word:"ਹਨੇਰਾ",antonym:"ਚਾਨਣ",sourceConfusables:["ਅੰਧਕਾਰ","ਤਿਮਰ","ਕਾਲਖ"],explanationPa:"‘ਹਨੇਰਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਚਾਨਣ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A17",word:"ਅਨੁਕੂਲ",antonym:"ਪ੍ਰਤੀਕੂਲ",sourceConfusables:["ਮੌਜ਼ੂਂ","ਪੱਖੀ","ਸੁਹਾਵਣਾ"],explanationPa:"‘ਅਨੁਕੂਲ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪ੍ਰਤੀਕੂਲ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A18",word:"ਉੱਦਮੀ",antonym:"ਆਲਸੀ",sourceConfusables:["ਮਿਹਨਤੀ","ਕਰਮਠ","ਉਪਰਾਲੂ"],explanationPa:"‘ਉੱਦਮੀ’ ਦੇ ਉਲਟ ਕੰਮ ਤੋਂ ਜੀ ਚੁਰਾਉਣ ਵਾਲੇ ਲਈ ‘ਆਲਸੀ’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A19",word:"ਸਜੀਵ",antonym:"ਨਿਰਜੀਵ",sourceConfusables:["ਜੀਵੰਤ","ਜਿੰਦ","ਚੇਤਨ"],explanationPa:"‘ਸਜੀਵ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਿਰਜੀਵ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A20",word:"ਹਾਨੀ",antonym:"ਲਾਭ",sourceConfusables:["ਨੁਕਸਾਨ","ਘਾਟਾ","ਨੁਕਸ"],explanationPa:"‘ਹਾਨੀ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਲਾਭ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A21",word:"ਕੱਚਾ",antonym:"ਪੱਕਾ",sourceConfusables:["ਅਪੱਕਾ","ਅਧਪੱਕਾ","ਅਣਪੱਕਾ"],explanationPa:"‘ਕੱਚਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪੱਕਾ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A22",word:"ਗੁਪਤ",antonym:"ਪ੍ਰਗਟ",sourceConfusables:["ਲੁਕਵਾਂ","ਗੋਪਨ","ਖ਼ੁਫ਼ੀਆ"],explanationPa:"‘ਗੁਪਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪ੍ਰਗਟ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A23",word:"ਨਰਮ",antonym:"ਸਖ਼ਤ",sourceConfusables:["ਕੋਮਲ","ਮੁਲਾਇਮ","ਨਾਜ਼ੁਕ"],explanationPa:"‘ਨਰਮ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸਖ਼ਤ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A24",word:"ਨਵੀਨ",antonym:"ਪੁਰਾਤਨ",sourceConfusables:["ਨਵਾਂ","ਆਧੁਨਿਕ","ਨਵਤਮ"],explanationPa:"‘ਨਵੀਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪੁਰਾਤਨ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A25",word:"ਨਿਆਂ",antonym:"ਅਨਿਆਂ",sourceConfusables:["ਇਨਸਾਫ਼","ਨਿਰਪੱਖਤਾ","ਨਿਆਂਪੂਰਨਤਾ"],explanationPa:"‘ਨਿਆਂ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਨਿਆਂ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A26",word:"ਪ੍ਰਸੰਨ",antonym:"ਉਦਾਸ",sourceConfusables:["ਖ਼ੁਸ਼","ਆਨੰਦਿਤ","ਪ੍ਰਫੁੱਲਤ"],explanationPa:"‘ਪ੍ਰਸੰਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਉਦਾਸ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A27",word:"ਭਾਰੀ",antonym:"ਹੌਲਾ",sourceConfusables:["ਵਜ਼ਨੀ","ਬੋਝਲ","ਭਾਰਾ"],explanationPa:"ਭਾਰ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ‘ਭਾਰੀ’ ਦਾ ਵਿਰੋਧੀ ‘ਹੌਲਾ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A28",word:"ਯੋਗ",antonym:"ਅਯੋਗ",sourceConfusables:["ਕਾਬਲ","ਸਮਰੱਥ","ਲਾਇਕ"],explanationPa:"‘ਯੋਗ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਯੋਗ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A29",word:"ਸਥਿਰ",antonym:"ਅਸਥਿਰ",sourceConfusables:["ਅਡੋਲ","ਕਾਇਮ","ਟਿਕਾਊ"],explanationPa:"‘ਸਥਿਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਸਥਿਰ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A30",word:"ਖ਼ਰੀਦਣਾ",antonym:"ਵੇਚਣਾ",sourceConfusables:["ਲੈਣਾ","ਮੋਲ ਲੈਣਾ","ਖ਼ਰੀਦ ਕਰਨਾ"],explanationPa:"ਲੈਣ-ਦੇਣ ਵਿੱਚ ‘ਖ਼ਰੀਦਣਾ’ ਦਾ ਵਿਰੋਧੀ ਕੰਮ ‘ਵੇਚਣਾ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A31",word:"ਮਹਿੰਗਾ",antonym:"ਸਸਤਾ",sourceConfusables:["ਦਾਮੀ","ਕੀਮਤੀ","ਉੱਚੀ ਕੀਮਤ ਵਾਲਾ"],explanationPa:"ਕੀਮਤ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ‘ਮਹਿੰਗਾ’ ਦਾ ਵਿਰੋਧੀ ‘ਸਸਤਾ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"ANT-A32",word:"ਬਿਮਾਰ",antonym:"ਤੰਦਰੁਸਤ",sourceConfusables:["ਰੋਗੀ","ਮਰੀਜ਼","ਅਸਵਸਥ"],explanationPa:"‘ਬਿਮਾਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਤੰਦਰੁਸਤ’ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
] as const;

export const CP009_CONTEXT_AUTHORITIES:readonly CP009ContextAuthority[]=[
{id:"CTX-A01",termA:"ਭਾਸ਼ਾ",termB:"ਬੋਲੀ",sentence:"ਸਕੂਲ ਦੀ ਪਾਠ-ਪੁਸਤਕ ਵਿੱਚ ਮਿਆਰੀ ਪੰਜਾਬੀ ____ ਵਰਤੀ ਗਈ ਹੈ।",correctTerm:"ਭਾਸ਼ਾ",distractors:["ਬੋਲੀ","ਲਹਿਜਾ","ਮੁਹਾਵਰਾ"],explanationPa:"ਪਾਠ-ਪੁਸਤਕ ਅਤੇ ਮਿਆਰੀ ਲਿਖਤ ਲਈ ‘ਭਾਸ਼ਾ’ ਢੁਕਵਾਂ ਸ਼ਬਦ ਹੈ; ‘ਬੋਲੀ’ ਆਮ ਤੌਰ ਤੇ ਸਥਾਨਕ ਬੋਲਚਾਲ ਦੇ ਰੂਪ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"CTX-A02",termA:"ਖੋਜ",termB:"ਭਾਲ",sentence:"ਵਿਗਿਆਨੀਆਂ ਨੇ ਨਵੀਂ ਦਵਾਈ ਬਾਰੇ ਲੰਬੀ ____ ਕੀਤੀ।",correctTerm:"ਖੋਜ",distractors:["ਭਾਲ","ਉਡੀਕ","ਤਲਾਸ਼"],explanationPa:"ਵਿਗਿਆਨਕ ਅਧਿਐਨ ਲਈ ‘ਖੋਜ’ ਢੁਕਵਾਂ ਹੈ; ਕਿਸੇ ਗੁੰਮ ਚੀਜ਼ ਨੂੰ ਲੱਭਣ ਲਈ ‘ਭਾਲ’ ਜਾਂ ‘ਤਲਾਸ਼’ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"CTX-A03",termA:"ਪਵਿੱਤਰ",termB:"ਸਾਫ਼",sentence:"ਧਾਰਮਿਕ ਰੀਤ ਅਨੁਸਾਰ ਇਸ ਥਾਂ ਨੂੰ ____ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",correctTerm:"ਪਵਿੱਤਰ",distractors:["ਸਾਫ਼","ਚਮਕਦਾਰ","ਸੁਥਰਾ"],explanationPa:"ਧਾਰਮਿਕ ਜਾਂ ਆਤਮਿਕ ਸ਼ੁੱਧਤਾ ਲਈ ‘ਪਵਿੱਤਰ’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ; ‘ਸਾਫ਼’ ਭੌਤਿਕ ਸਫ਼ਾਈ ਦੱਸਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"CTX-A04",termA:"ਸੁਤੰਤਰਤਾ",termB:"ਮੁਕਤੀ",sentence:"1947 ਵਿੱਚ ਭਾਰਤ ਨੇ ਬਰਤਾਨਵੀ ਰਾਜ ਤੋਂ ਰਾਜਸੀ ____ ਪ੍ਰਾਪਤ ਕੀਤੀ।",correctTerm:"ਸੁਤੰਤਰਤਾ",distractors:["ਮੁਕਤੀ","ਛੁਟਕਾਰਾ","ਰਾਹਤ"],explanationPa:"ਦੇਸ਼ ਦੀ ਰਾਜਸੀ ਆਜ਼ਾਦੀ ਲਈ ‘ਸੁਤੰਤਰਤਾ’ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਸ਼ਬਦ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"CTX-A05",termA:"ਆਸ",termB:"ਲੋਚਾ",sentence:"ਕਿਸਾਨ ਨੂੰ ____ ਸੀ ਕਿ ਮੀਂਹ ਸਮੇਂ ਸਿਰ ਪਵੇਗਾ।",correctTerm:"ਆਸ",distractors:["ਲੋਚਾ","ਤਾਂਘ","ਲਾਲਸਾ"],explanationPa:"ਭਵਿੱਖ ਵਿੱਚ ਚੰਗਾ ਨਤੀਜਾ ਹੋਣ ਦੀ ਉਮੀਦ ਲਈ ‘ਆਸ’ ਵਰਤੀ ਜਾਂਦੀ ਹੈ; ‘ਲੋਚਾ’ ਤੀਬਰ ਇੱਛਾ ਜਾਂ ਤਾਂਘ ਦੱਸਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"CTX-A06",termA:"ਸਾਥੀ",termB:"ਮਿੱਤਰ",sentence:"ਸਫ਼ਰ ਦੌਰਾਨ ਨਾਲ ਯਾਤਰਾ ਕਰਨ ਵਾਲਾ ਵਿਅਕਤੀ ਉਸਦਾ ____ ਸੀ।",correctTerm:"ਸਾਥੀ",distractors:["ਮਿੱਤਰ","ਪੜੋਸੀ","ਰਿਸ਼ਤੇਦਾਰ"],explanationPa:"ਸਫ਼ਰ ਜਾਂ ਕੰਮ ਵਿੱਚ ਨਾਲ ਹੋਣ ਵਾਲੇ ਲਈ ‘ਸਾਥੀ’ ਢੁਕਵਾਂ ਹੈ; ‘ਮਿੱਤਰ’ ਦੋਸਤੀ ਦਾ ਰਿਸ਼ਤਾ ਦੱਸਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"CTX-A07",termA:"ਗਿਆਨ",termB:"ਜਾਣਕਾਰੀ",sentence:"ਉਸ ਨੂੰ ਪੰਜਾਬੀ ਵਿਆਕਰਨ ਦਾ ਡੂੰਘਾ ____ ਹੈ।",correctTerm:"ਗਿਆਨ",distractors:["ਜਾਣਕਾਰੀ","ਖ਼ਬਰ","ਵੇਰਵਾ"],explanationPa:"ਕਿਸੇ ਵਿਸ਼ੇ ਦੀ ਡੂੰਘੀ ਸਮਝ ਲਈ ‘ਗਿਆਨ’ ਢੁਕਵਾਂ ਹੈ; ‘ਜਾਣਕਾਰੀ’ ਖ਼ਾਸ ਤੱਥਾਂ ਜਾਂ ਵੇਰਵਿਆਂ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
{id:"CTX-A08",termA:"ਧਨ",termB:"ਰੁਪਈਆ",sentence:"ਉਸ ਨੇ ਆਪਣਾ ਸਾਰਾ ____ ਲੋਕ-ਭਲਾਈ ਲਈ ਦਾਨ ਕਰ ਦਿੱਤਾ।",correctTerm:"ਧਨ",distractors:["ਰੁਪਈਆ","ਸਿੱਕਾ","ਨੋਟ"],explanationPa:"ਸਮੁੱਚੀ ਦੌਲਤ ਜਾਂ ਸੰਪਤੀ ਲਈ ‘ਧਨ’ ਢੁਕਵਾਂ ਹੈ; ‘ਰੁਪਈਆ’ ਮੁਦਰਾ ਦੀ ਇਕਾਈ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
] as const;
