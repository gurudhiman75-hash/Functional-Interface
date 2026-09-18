export type CP010Domain =
  | "CHARACTER"
  | "PLACE"
  | "STATE"
  | "QUALITY"
  | "RELATION"
  | "TIME"
  | "PROFESSION"
  | "CREATOR";

export interface CP010Authority {
  readonly id:string;
  readonly phrasePa:string;
  readonly wordPa:string;
  readonly domain:CP010Domain;
  readonly explanationPa:string;
  readonly sourceStatus:"REVIEW_PENDING";
}

export const CP010_AUTHORITIES:readonly CP010Authority[]=[
  {id:"OW-A001",phrasePa:"ਜੋ ਰੱਬ ਦੀ ਹੋਂਦ ਨੂੰ ਮੰਨਦਾ ਹੋਵੇ",wordPa:"ਆਸਤਿਕ",domain:"CHARACTER",explanationPa:"ਰੱਬ ਦੀ ਹੋਂਦ ਵਿੱਚ ਵਿਸ਼ਵਾਸ ਰੱਖਣ ਵਾਲੇ ਨੂੰ ‘ਆਸਤਿਕ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A002",phrasePa:"ਜੋ ਰੱਬ ਦੀ ਹੋਂਦ ਨੂੰ ਨਾ ਮੰਨਦਾ ਹੋਵੇ",wordPa:"ਨਾਸਤਿਕ",domain:"CHARACTER",explanationPa:"ਰੱਬ ਦੀ ਹੋਂਦ ਨੂੰ ਨਾ ਮੰਨਣ ਵਾਲੇ ਨੂੰ ‘ਨਾਸਤਿਕ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A003",phrasePa:"ਜੋ ਦੂਜਿਆਂ ਦੀ ਭਲਾਈ ਲਈ ਕੰਮ ਕਰੇ",wordPa:"ਪਰਉਪਕਾਰੀ",domain:"CHARACTER",explanationPa:"ਦੂਜਿਆਂ ਦੀ ਨਿਸ਼ਕਾਮ ਭਲਾਈ ਕਰਨ ਵਾਲੇ ਨੂੰ ‘ਪਰਉਪਕਾਰੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A004",phrasePa:"ਜੋ ਕੀਤੇ ਉਪਕਾਰ ਨੂੰ ਨਾ ਮੰਨੇ",wordPa:"ਅਕ੍ਰਿਤਘਣ",domain:"CHARACTER",explanationPa:"ਕੀਤੇ ਉਪਕਾਰ ਨੂੰ ਨਾ ਮੰਨਣ ਵਾਲੇ ਨੂੰ ‘ਅਕ੍ਰਿਤਘਣ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A005",phrasePa:"ਜੋ ਕੀਤੇ ਉਪਕਾਰ ਨੂੰ ਮੰਨੇ",wordPa:"ਕ੍ਰਿਤੱਗ",domain:"CHARACTER",explanationPa:"ਕੀਤੇ ਉਪਕਾਰ ਲਈ ਆਭਾਰੀ ਰਹਿਣ ਵਾਲੇ ਨੂੰ ‘ਕ੍ਰਿਤੱਗ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A006",phrasePa:"ਜੋ ਬਹੁਤ ਘੱਟ ਬੋਲਦਾ ਹੋਵੇ",wordPa:"ਅਲਪਭਾਸ਼ੀ",domain:"CHARACTER",explanationPa:"ਘੱਟ ਬੋਲਣ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ‘ਅਲਪਭਾਸ਼ੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A007",phrasePa:"ਜੋ ਬਹੁਤ ਜ਼ਿਆਦਾ ਬੋਲਦਾ ਹੋਵੇ",wordPa:"ਵਾਚਾਲ",domain:"CHARACTER",explanationPa:"ਬਹੁਤ ਜ਼ਿਆਦਾ ਬੋਲਣ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ‘ਵਾਚਾਲ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A008",phrasePa:"ਜੋ ਕਿਸੇ ਧਿਰ ਦਾ ਪੱਖਪਾਤ ਨਾ ਕਰੇ",wordPa:"ਨਿਰਪੱਖ",domain:"CHARACTER",explanationPa:"ਬਿਨਾਂ ਪੱਖਪਾਤ ਦੇ ਦੋਵੇਂ ਧਿਰਾਂ ਨੂੰ ਇੱਕਸਾਰ ਦੇਖਣ ਵਾਲੇ ਨੂੰ ‘ਨਿਰਪੱਖ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},

  {id:"OW-A009",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਸਿੱਕੇ ਢਾਲੇ ਜਾਂਦੇ ਹਨ",wordPa:"ਟਕਸਾਲ",domain:"PLACE",explanationPa:"ਸਿੱਕੇ ਢਾਲਣ ਵਾਲੀ ਸਰਕਾਰੀ ਥਾਂ ਨੂੰ ‘ਟਕਸਾਲ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A010",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਮੁਸਾਫ਼ਿਰ ਠਹਿਰਦੇ ਹਨ",wordPa:"ਸਰਾਏ",domain:"PLACE",explanationPa:"ਮੁਸਾਫ਼ਿਰਾਂ ਦੇ ਠਹਿਰਨ ਲਈ ਬਣੀ ਥਾਂ ਨੂੰ ‘ਸਰਾਏ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A011",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਪੁਰਾਤਨ ਅਤੇ ਕਲਾਤਮਕ ਵਸਤਾਂ ਸੰਭਾਲੀਆਂ ਜਾਂਦੀਆਂ ਹਨ",wordPa:"ਅਜਾਇਬਘਰ",domain:"PLACE",explanationPa:"ਪੁਰਾਤਨ ਅਤੇ ਕਲਾਤਮਕ ਵਸਤਾਂ ਸੰਭਾਲ ਕੇ ਰੱਖਣ ਵਾਲੀ ਥਾਂ ਨੂੰ ‘ਅਜਾਇਬਘਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A012",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਪਹਿਲਵਾਨ ਕੁਸ਼ਤੀ ਕਰਦੇ ਹਨ",wordPa:"ਅਖਾੜਾ",domain:"PLACE",explanationPa:"ਪਹਿਲਵਾਨਾਂ ਦੇ ਕੁਸ਼ਤੀ ਕਰਨ ਵਾਲੇ ਸਥਾਨ ਨੂੰ ‘ਅਖਾੜਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A013",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਘੋੜੇ ਰੱਖੇ ਜਾਂਦੇ ਹਨ",wordPa:"ਅਸਤਬਲ",domain:"PLACE",explanationPa:"ਘੋੜਿਆਂ ਨੂੰ ਰੱਖਣ ਜਾਂ ਬੰਨ੍ਹਣ ਵਾਲੀ ਥਾਂ ਨੂੰ ‘ਅਸਤਬਲ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A014",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਪੁਸਤਕਾਂ ਪੜ੍ਹਨ ਅਤੇ ਲੈਣ ਲਈ ਰੱਖੀਆਂ ਜਾਂਦੀਆਂ ਹਨ",wordPa:"ਪੁਸਤਕਾਲਾ",domain:"PLACE",explanationPa:"ਪੁਸਤਕਾਂ ਪੜ੍ਹਨ ਅਤੇ ਉਧਾਰ ਲੈਣ ਲਈ ਸੰਭਾਲੀਆਂ ਜਾਣ ਵਾਲੀ ਥਾਂ ਨੂੰ ‘ਪੁਸਤਕਾਲਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A015",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਅਨਾਥ ਬੱਚਿਆਂ ਦੀ ਦੇਖਭਾਲ ਕੀਤੀ ਜਾਂਦੀ ਹੈ",wordPa:"ਯਤੀਮਖਾਨਾ",domain:"PLACE",explanationPa:"ਅਨਾਥ ਬੱਚਿਆਂ ਦੀ ਦੇਖਭਾਲ ਲਈ ਬਣੀ ਸੰਸਥਾ ਨੂੰ ‘ਯਤੀਮਖਾਨਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A016",phrasePa:"ਉਹ ਥਾਂ ਜਿੱਥੇ ਕੈਦੀਆਂ ਨੂੰ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ",wordPa:"ਕਾਰਾਗਾਰ",domain:"PLACE",explanationPa:"ਕੈਦੀਆਂ ਨੂੰ ਰੱਖਣ ਵਾਲੀ ਥਾਂ ਨੂੰ ‘ਕਾਰਾਗਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},

  {id:"OW-A017",phrasePa:"ਜਿਸ ਇਸਤਰੀ ਦਾ ਪਤੀ ਮਰ ਚੁੱਕਾ ਹੋਵੇ",wordPa:"ਵਿਧਵਾ",domain:"STATE",explanationPa:"ਜਿਸ ਇਸਤਰੀ ਦਾ ਪਤੀ ਮਰ ਚੁੱਕਾ ਹੋਵੇ, ਉਸ ਨੂੰ ‘ਵਿਧਵਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A018",phrasePa:"ਜਿਸ ਪੁਰਸ਼ ਦੀ ਪਤਨੀ ਮਰ ਚੁੱਕੀ ਹੋਵੇ",wordPa:"ਵਿਧੁਰ",domain:"STATE",explanationPa:"ਜਿਸ ਪੁਰਸ਼ ਦੀ ਪਤਨੀ ਮਰ ਚੁੱਕੀ ਹੋਵੇ, ਉਸ ਨੂੰ ‘ਵਿਧੁਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A019",phrasePa:"ਜਿਸ ਬੱਚੇ ਦੇ ਮਾਤਾ-ਪਿਤਾ ਨਾ ਹੋਣ",wordPa:"ਅਨਾਥ",domain:"STATE",explanationPa:"ਮਾਤਾ-ਪਿਤਾ ਤੋਂ ਵਾਂਝੇ ਬੱਚੇ ਨੂੰ ‘ਅਨਾਥ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A020",phrasePa:"ਜੋ ਪੜ੍ਹਨਾ ਅਤੇ ਲਿਖਣਾ ਜਾਣਦਾ ਹੋਵੇ",wordPa:"ਸਾਖਰ",domain:"STATE",explanationPa:"ਪੜ੍ਹਨਾ ਅਤੇ ਲਿਖਣਾ ਜਾਣਨ ਵਾਲੇ ਨੂੰ ‘ਸਾਖਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A021",phrasePa:"ਜੋ ਪੜ੍ਹਨਾ ਅਤੇ ਲਿਖਣਾ ਨਾ ਜਾਣਦਾ ਹੋਵੇ",wordPa:"ਅਨਪੜ੍ਹ",domain:"STATE",explanationPa:"ਪੜ੍ਹਨਾ ਅਤੇ ਲਿਖਣਾ ਨਾ ਜਾਣਨ ਵਾਲੇ ਨੂੰ ‘ਅਨਪੜ੍ਹ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A022",phrasePa:"ਜੋ ਕਦੇ ਨਾ ਮਰੇ",wordPa:"ਅਮਰ",domain:"STATE",explanationPa:"ਜਿਸ ਦੀ ਕਦੇ ਮੌਤ ਨਾ ਹੋਵੇ, ਉਸ ਨੂੰ ‘ਅਮਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A023",phrasePa:"ਜਿਸ ਨੂੰ ਜਿੱਤਿਆ ਨਾ ਜਾ ਸਕੇ",wordPa:"ਅਜਿੱਤ",domain:"STATE",explanationPa:"ਜਿਸ ਨੂੰ ਹਰਾਇਆ ਜਾਂ ਜਿੱਤਿਆ ਨਾ ਜਾ ਸਕੇ, ਉਸ ਨੂੰ ‘ਅਜਿੱਤ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A024",phrasePa:"ਜਿਸ ਕੋਲ ਰਹਿਣ ਲਈ ਆਪਣਾ ਘਰ ਨਾ ਹੋਵੇ",wordPa:"ਬੇਘਰ",domain:"STATE",explanationPa:"ਜਿਸ ਕੋਲ ਰਹਿਣ ਲਈ ਆਪਣਾ ਘਰ ਨਾ ਹੋਵੇ, ਉਸ ਨੂੰ ‘ਬੇਘਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},

  {id:"OW-A025",phrasePa:"ਉਹ ਧਰਤੀ ਜਿਸ ਉੱਤੇ ਫ਼ਸਲ ਨਾ ਉੱਗੇ",wordPa:"ਬੰਜਰ",domain:"QUALITY",explanationPa:"ਜਿਸ ਧਰਤੀ ਉੱਤੇ ਫ਼ਸਲ ਨਾ ਉੱਗੇ, ਉਸ ਨੂੰ ‘ਬੰਜਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A026",phrasePa:"ਉਹ ਧਰਤੀ ਜੋ ਬਹੁਤ ਚੰਗੀ ਫ਼ਸਲ ਦੇਵੇ",wordPa:"ਜ਼ਰਖ਼ੇਜ਼",domain:"QUALITY",explanationPa:"ਵੱਧ ਉਪਜ ਦੇਣ ਵਾਲੀ ਧਰਤੀ ਨੂੰ ‘ਜ਼ਰਖ਼ੇਜ਼’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A027",phrasePa:"ਜਿਸ ਵਸਤੂ ਵਿੱਚੋਂ ਆਰ-ਪਾਰ ਵੇਖਿਆ ਜਾ ਸਕੇ",wordPa:"ਪਾਰਦਰਸ਼ੀ",domain:"QUALITY",explanationPa:"ਜਿਸ ਵਸਤੂ ਵਿੱਚੋਂ ਆਰ-ਪਾਰ ਵੇਖਿਆ ਜਾ ਸਕੇ, ਉਸ ਨੂੰ ‘ਪਾਰਦਰਸ਼ੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A028",phrasePa:"ਜਿਸ ਵਸਤੂ ਵਿੱਚੋਂ ਆਰ-ਪਾਰ ਨਾ ਵੇਖਿਆ ਜਾ ਸਕੇ",wordPa:"ਅਪਾਰਦਰਸ਼ੀ",domain:"QUALITY",explanationPa:"ਜਿਸ ਵਸਤੂ ਵਿੱਚੋਂ ਆਰ-ਪਾਰ ਨਾ ਵੇਖਿਆ ਜਾ ਸਕੇ, ਉਸ ਨੂੰ ‘ਅਪਾਰਦਰਸ਼ੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A029",phrasePa:"ਜਿਸ ਦੀ ਕੀਮਤ ਨਾ ਅੰਕੀ ਜਾ ਸਕੇ",wordPa:"ਅਮੁੱਲ",domain:"QUALITY",explanationPa:"ਜਿਸ ਦੀ ਕੀਮਤ ਨਿਰਧਾਰਤ ਕਰਨੀ ਮੁਸ਼ਕਲ ਹੋਵੇ, ਉਸ ਨੂੰ ‘ਅਮੁੱਲ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A030",phrasePa:"ਜਿਸ ਦੀ ਕੋਈ ਬਰਾਬਰ ਦੀ ਮਿਸਾਲ ਨਾ ਹੋਵੇ",wordPa:"ਬੇਮਿਸਾਲ",domain:"QUALITY",explanationPa:"ਜਿਸ ਦੀ ਤੁਲਨਾ ਲਈ ਕੋਈ ਸਮਾਨ ਮਿਸਾਲ ਨਾ ਮਿਲੇ, ਉਸ ਨੂੰ ‘ਬੇਮਿਸਾਲ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A031",phrasePa:"ਜੋ ਬਿਨਾਂ ਥੱਕੇ ਲਗਾਤਾਰ ਕੰਮ ਕਰੇ",wordPa:"ਅਣਥੱਕ",domain:"QUALITY",explanationPa:"ਬਿਨਾਂ ਥੱਕੇ ਲਗਾਤਾਰ ਕੰਮ ਕਰਨ ਵਾਲੇ ਲਈ ‘ਅਣਥੱਕ’ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A032",phrasePa:"ਜਿਸ ਨੂੰ ਅੱਖਾਂ ਨਾਲ ਵੇਖਿਆ ਨਾ ਜਾ ਸਕੇ",wordPa:"ਅਦ੍ਰਿਸ਼",domain:"QUALITY",explanationPa:"ਜਿਸ ਨੂੰ ਅੱਖਾਂ ਨਾਲ ਵੇਖਿਆ ਨਾ ਜਾ ਸਕੇ, ਉਸ ਨੂੰ ‘ਅਦ੍ਰਿਸ਼’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},

  {id:"OW-A033",phrasePa:"ਪਤੀ ਦੀ ਮਾਤਾ",wordPa:"ਸੱਸ",domain:"RELATION",explanationPa:"ਪਤੀ ਦੀ ਮਾਤਾ ਨੂੰ ‘ਸੱਸ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A034",phrasePa:"ਪਤੀ ਦਾ ਪਿਤਾ",wordPa:"ਸਹੁਰਾ",domain:"RELATION",explanationPa:"ਪਤੀ ਦੇ ਪਿਤਾ ਨੂੰ ‘ਸਹੁਰਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A035",phrasePa:"ਪਤੀ ਦਾ ਛੋਟਾ ਭਰਾ",wordPa:"ਦੇਵਰ",domain:"RELATION",explanationPa:"ਪਤੀ ਦੇ ਛੋਟੇ ਭਰਾ ਨੂੰ ‘ਦੇਵਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A036",phrasePa:"ਪਤੀ ਦਾ ਵੱਡਾ ਭਰਾ",wordPa:"ਜੇਠ",domain:"RELATION",explanationPa:"ਪਤੀ ਦੇ ਵੱਡੇ ਭਰਾ ਨੂੰ ‘ਜੇਠ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A037",phrasePa:"ਪਤਨੀ ਦਾ ਭਰਾ",wordPa:"ਸਾਲਾ",domain:"RELATION",explanationPa:"ਪਤਨੀ ਦੇ ਭਰਾ ਨੂੰ ‘ਸਾਲਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A038",phrasePa:"ਪਤਨੀ ਦੀ ਭੈਣ",wordPa:"ਸਾਲੀ",domain:"RELATION",explanationPa:"ਪਤਨੀ ਦੀ ਭੈਣ ਨੂੰ ‘ਸਾਲੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A039",phrasePa:"ਭੈਣ ਦਾ ਪਤੀ",wordPa:"ਜੀਜਾ",domain:"RELATION",explanationPa:"ਭੈਣ ਦੇ ਪਤੀ ਨੂੰ ‘ਜੀਜਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A040",phrasePa:"ਮਾਂ ਦਾ ਭਰਾ",wordPa:"ਮਾਮਾ",domain:"RELATION",explanationPa:"ਮਾਂ ਦੇ ਭਰਾ ਨੂੰ ‘ਮਾਮਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},

  {id:"OW-A041",phrasePa:"ਜੋ ਹਰ ਦਿਨ ਹੁੰਦਾ ਹੋਵੇ",wordPa:"ਰੋਜ਼ਾਨਾ",domain:"TIME",explanationPa:"ਹਰ ਦਿਨ ਹੋਣ ਵਾਲੇ ਕੰਮ ਲਈ ‘ਰੋਜ਼ਾਨਾ’ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A042",phrasePa:"ਜੋ ਹਰ ਹਫ਼ਤੇ ਹੁੰਦਾ ਹੋਵੇ",wordPa:"ਹਫ਼ਤਾਵਾਰ",domain:"TIME",explanationPa:"ਹਰ ਹਫ਼ਤੇ ਹੋਣ ਜਾਂ ਛਪਣ ਵਾਲੇ ਲਈ ‘ਹਫ਼ਤਾਵਾਰ’ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A043",phrasePa:"ਜੋ ਹਰ ਮਹੀਨੇ ਹੁੰਦਾ ਹੋਵੇ",wordPa:"ਮਾਸਿਕ",domain:"TIME",explanationPa:"ਹਰ ਮਹੀਨੇ ਹੋਣ ਜਾਂ ਛਪਣ ਵਾਲੇ ਲਈ ‘ਮਾਸਿਕ’ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A044",phrasePa:"ਜੋ ਹਰ ਸਾਲ ਹੁੰਦਾ ਹੋਵੇ",wordPa:"ਸਾਲਾਨਾ",domain:"TIME",explanationPa:"ਹਰ ਸਾਲ ਹੋਣ ਵਾਲੇ ਕੰਮ ਜਾਂ ਸਮਾਗਮ ਲਈ ‘ਸਾਲਾਨਾ’ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A045",phrasePa:"ਜੋ ਛੇ ਮਹੀਨਿਆਂ ਬਾਅਦ ਹੁੰਦਾ ਹੋਵੇ",wordPa:"ਛਿਮਾਹੀ",domain:"TIME",explanationPa:"ਛੇ ਮਹੀਨਿਆਂ ਦੇ ਅੰਤਰਾਲ ਨਾਲ ਹੋਣ ਵਾਲੇ ਲਈ ‘ਛਿਮਾਹੀ’ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A046",phrasePa:"ਦਸ ਸਾਲਾਂ ਦਾ ਸਮਾਂ",wordPa:"ਦਹਾਕਾ",domain:"TIME",explanationPa:"ਦਸ ਸਾਲਾਂ ਦੇ ਸਮੇਂ ਨੂੰ ‘ਦਹਾਕਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A047",phrasePa:"ਸੌ ਸਾਲਾਂ ਦਾ ਸਮਾਂ",wordPa:"ਸਦੀ",domain:"TIME",explanationPa:"ਸੌ ਸਾਲਾਂ ਦੇ ਸਮੇਂ ਨੂੰ ‘ਸਦੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A048",phrasePa:"ਪੰਦਰਾਂ ਦਿਨਾਂ ਦਾ ਸਮਾਂ",wordPa:"ਪੰਦਰਵਾੜਾ",domain:"TIME",explanationPa:"ਪੰਦਰਾਂ ਦਿਨਾਂ ਦੇ ਸਮੇਂ ਨੂੰ ‘ਪੰਦਰਵਾੜਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},

  {id:"OW-A049",phrasePa:"ਲੱਕੜ ਦਾ ਸਾਮਾਨ ਬਣਾਉਣ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਤਰਖਾਣ",domain:"PROFESSION",explanationPa:"ਲੱਕੜ ਦਾ ਸਾਮਾਨ ਬਣਾਉਣ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਤਰਖਾਣ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A050",phrasePa:"ਲੋਹੇ ਦੇ ਸੰਦ ਬਣਾਉਣ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਲੁਹਾਰ",domain:"PROFESSION",explanationPa:"ਲੋਹੇ ਦੇ ਸੰਦ ਬਣਾਉਣ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਲੁਹਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A051",phrasePa:"ਸੋਨੇ-ਚਾਂਦੀ ਦੇ ਗਹਿਣੇ ਬਣਾਉਣ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਸੁਨਿਆਰ",domain:"PROFESSION",explanationPa:"ਸੋਨੇ-ਚਾਂਦੀ ਦੇ ਗਹਿਣੇ ਬਣਾਉਣ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਸੁਨਿਆਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A052",phrasePa:"ਮਿੱਟੀ ਦੇ ਭਾਂਡੇ ਬਣਾਉਣ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਘੁਮਿਆਰ",domain:"PROFESSION",explanationPa:"ਮਿੱਟੀ ਦੇ ਭਾਂਡੇ ਬਣਾਉਣ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਘੁਮਿਆਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A053",phrasePa:"ਕੱਪੜੇ ਸਿਊਣ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਦਰਜ਼ੀ",domain:"PROFESSION",explanationPa:"ਕੱਪੜੇ ਸਿਊਣ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਦਰਜ਼ੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A054",phrasePa:"ਖੱਡੀ ਉੱਤੇ ਕੱਪੜਾ ਬੁਣਨ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਜੁਲਾਹਾ",domain:"PROFESSION",explanationPa:"ਖੱਡੀ ਉੱਤੇ ਕੱਪੜਾ ਬੁਣਨ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਜੁਲਾਹਾ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A055",phrasePa:"ਜੁੱਤੀਆਂ ਬਣਾਉਣ ਅਤੇ ਗੰਢਣ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਮੋਚੀ",domain:"PROFESSION",explanationPa:"ਜੁੱਤੀਆਂ ਬਣਾਉਣ ਅਤੇ ਗੰਢਣ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਮੋਚੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A056",phrasePa:"ਵਾਲ ਕੱਟਣ ਅਤੇ ਦਾੜ੍ਹੀ ਸੰਵਾਰਨ ਵਾਲਾ ਕਾਰੀਗਰ",wordPa:"ਨਾਈ",domain:"PROFESSION",explanationPa:"ਵਾਲ ਕੱਟਣ ਅਤੇ ਦਾੜ੍ਹੀ ਸੰਵਾਰਨ ਵਾਲੇ ਕਾਰੀਗਰ ਨੂੰ ‘ਨਾਈ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},

  {id:"OW-A057",phrasePa:"ਚਿੱਤਰ ਬਣਾਉਣ ਵਾਲਾ ਕਲਾਕਾਰ",wordPa:"ਚਿੱਤਰਕਾਰ",domain:"CREATOR",explanationPa:"ਚਿੱਤਰ ਬਣਾਉਣ ਵਾਲੇ ਕਲਾਕਾਰ ਨੂੰ ‘ਚਿੱਤਰਕਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A058",phrasePa:"ਮੂਰਤੀਆਂ ਘੜਨ ਵਾਲਾ ਕਲਾਕਾਰ",wordPa:"ਮੂਰਤੀਕਾਰ",domain:"CREATOR",explanationPa:"ਮੂਰਤੀਆਂ ਘੜਨ ਵਾਲੇ ਕਲਾਕਾਰ ਨੂੰ ‘ਮੂਰਤੀਕਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A059",phrasePa:"ਗੀਤ ਲਿਖਣ ਵਾਲਾ ਰਚਨਾਕਾਰ",wordPa:"ਗੀਤਕਾਰ",domain:"CREATOR",explanationPa:"ਗੀਤ ਲਿਖਣ ਵਾਲੇ ਰਚਨਾਕਾਰ ਨੂੰ ‘ਗੀਤਕਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A060",phrasePa:"ਨਾਟਕ ਲਿਖਣ ਵਾਲਾ ਰਚਨਾਕਾਰ",wordPa:"ਨਾਟਕਕਾਰ",domain:"CREATOR",explanationPa:"ਨਾਟਕ ਲਿਖਣ ਵਾਲੇ ਰਚਨਾਕਾਰ ਨੂੰ ‘ਨਾਟਕਕਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A061",phrasePa:"ਨਾਵਲ ਲਿਖਣ ਵਾਲਾ ਰਚਨਾਕਾਰ",wordPa:"ਨਾਵਲਕਾਰ",domain:"CREATOR",explanationPa:"ਨਾਵਲ ਲਿਖਣ ਵਾਲੇ ਰਚਨਾਕਾਰ ਨੂੰ ‘ਨਾਵਲਕਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A062",phrasePa:"ਕਵਿਤਾ ਰਚਣ ਵਾਲਾ ਸਾਹਿਤਕਾਰ",wordPa:"ਕਵੀ",domain:"CREATOR",explanationPa:"ਕਵਿਤਾ ਰਚਣ ਵਾਲੇ ਸਾਹਿਤਕਾਰ ਨੂੰ ‘ਕਵੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A063",phrasePa:"ਖ਼ਬਰਾਂ ਇਕੱਠੀਆਂ ਕਰਕੇ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚਾਉਣ ਵਾਲਾ",wordPa:"ਪੱਤਰਕਾਰ",domain:"CREATOR",explanationPa:"ਖ਼ਬਰਾਂ ਇਕੱਠੀਆਂ ਕਰਕੇ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚਾਉਣ ਵਾਲੇ ਨੂੰ ‘ਪੱਤਰਕਾਰ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
  {id:"OW-A064",phrasePa:"ਅਖ਼ਬਾਰ ਜਾਂ ਰਸਾਲੇ ਦੀ ਸਮੱਗਰੀ ਚੁਣ ਕੇ ਸੰਵਾਰਨ ਵਾਲਾ",wordPa:"ਸੰਪਾਦਕ",domain:"CREATOR",explanationPa:"ਅਖ਼ਬਾਰ ਜਾਂ ਰਸਾਲੇ ਦੀ ਸਮੱਗਰੀ ਚੁਣ ਕੇ ਸੰਵਾਰਨ ਵਾਲੇ ਨੂੰ ‘ਸੰਪਾਦਕ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",sourceStatus:"REVIEW_PENDING"},
] as const;

export const CP010_DOMAINS:readonly CP010Domain[]=["CHARACTER","PLACE","STATE","QUALITY","RELATION","TIME","PROFESSION","CREATOR"] as const;
export function cp010ItemsInDomain(domain:CP010Domain){return CP010_AUTHORITIES.filter(x=>x.domain===domain);}
