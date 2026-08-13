import type { AuditCaselet, AuditChild, AuditOption } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import {
  localizeSea001ReviewCaselet,
  type Sea001LocalizedReviewCaselet,
} from "./candidate-localizer.ts";

const FINAL_WORDS: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  the: ["", ""],
  a: ["एक", "ਇੱਕ"],
  an: ["एक", "ਇੱਕ"],
  of: ["का", "ਦਾ"],
  to: ["को", "ਨੂੰ"],
  from: ["से", "ਤੋਂ"],
  in: ["में", "ਵਿੱਚ"],
  at: ["पर", "'ਤੇ"],
  by: ["से", "ਨਾਲ"],
  for: ["के लिए", "ਲਈ"],
  with: ["के साथ", "ਦੇ ਨਾਲ"],
  as: ["जैसा", "ਵਾਂਗ"],
  and: ["और", "ਅਤੇ"],
  or: ["या", "ਜਾਂ"],
  but: ["लेकिन", "ਪਰ"],
  if: ["यदि", "ਜੇ"],
  then: ["तब", "ਤਾਂ"],
  than: ["से", "ਤੋਂ"],
  that: ["वह", "ਉਹ"],
  this: ["यह", "ਇਹ"],
  these: ["ये", "ਇਹ"],
  those: ["वे", "ਉਹ"],
  it: ["इसे", "ਇਸਨੂੰ"],
  them: ["उन्हें", "ਉਨ੍ਹਾਂ ਨੂੰ"],
  they: ["वे", "ਉਹ"],
  their: ["उनका", "ਉਨ੍ਹਾਂ ਦਾ"],
  your: ["आपके", "ਤੁਹਾਡੇ"],
  our: ["हमारी", "ਸਾਡੀ"],
  we: ["हम", "ਅਸੀਂ"],
  you: ["आप", "ਤੁਸੀਂ"],
  any: ["कोई", "ਕੋਈ"],
  all: ["सभी", "ਸਭ"],
  every: ["हर", "ਹਰ"],
  everyone: ["सभी", "ਸਭ"],
  some: ["कुछ", "ਕੁਝ"],
  others: ["बाकी", "ਬਾਕੀ"],
  both: ["दोनों", "ਦੋਵੇਂ"],
  each: ["हर", "ਹਰ"],
  only: ["केवल", "ਸਿਰਫ਼"],
  same: ["एक ही", "ਇੱਕੋ"],
  other: ["दूसरा", "ਦੂਜਾ"],
  another: ["दूसरा", "ਦੂਜਾ"],
  different: ["अलग", "ਵੱਖਰਾ"],
  more: ["अधिक", "ਵੱਧ"],
  less: ["कम", "ਘੱਟ"],
  too: ["बहुत", "ਬਹੁਤ"],
  very: ["बिल्कुल", "ਬਿਲਕੁਲ"],
  far: ["दूर", "ਦੂਰ"],
  near: ["पास", "ਨੇੜੇ"],
  nearby: ["पास", "ਨੇੜੇ"],
  before: ["पहले", "ਪਹਿਲਾਂ"],
  after: ["बाद", "ਬਾਅਦ"],
  afterward: ["उसके बाद", "ਉਸ ਤੋਂ ਬਾਅਦ"],
  until: ["जब तक", "ਜਦੋਂ ਤੱਕ"],
  once: ["एक बार", "ਇੱਕ ਵਾਰ"],
  now: ["अब", "ਹੁਣ"],
  here: ["यहाँ", "ਇੱਥੇ"],
  there: ["वहाँ", "ਉੱਥੇ"],
  where: ["जहाँ", "ਜਿੱਥੇ"],
  whether: ["क्या", "ਕੀ"],
  sometimes: ["कभी-कभी", "ਕਈ ਵਾਰ"],
  already: ["पहले से", "ਪਹਿਲਾਂ ਹੀ"],
  yet: ["अभी", "ਹਾਲੇ"],
  soon: ["जल्द", "ਜਲਦੀ"],

  clue: ["संकेत", "ਸੰਕੇਤ"],
  clues: ["संकेत", "ਸੰਕੇਤ"],
  seat: ["सीट", "ਸੀਟ"],
  seats: ["सीटें", "ਸੀਟਾਂ"],
  person: ["व्यक्ति", "ਵਿਅਕਤੀ"],
  persons: ["व्यक्ति", "ਵਿਅਕਤੀ"],
  people: ["लोग", "ਲੋਕ"],
  row: ["पंक्ति", "ਕਤਾਰ"],
  circle: ["गोल व्यवस्था", "ਗੋਲ ਵਿਵਸਥਾ"],
  table: ["मेज", "ਮੇਜ਼"],
  arrangement: ["व्यवस्था", "ਵਿਵਸਥਾ"],
  seating: ["बैठने", "ਬੈਠਣ"],
  relation: ["संबंध", "ਸਬੰਧ"],
  position: ["स्थान", "ਸਥਿਤੀ"],
  side: ["ओर", "ਪਾਸੇ"],
  sides: ["ओर", "ਪਾਸੇ"],
  end: ["छोर", "ਸਿਰਾ"],
  ends: ["छोर", "ਸਿਰੇ"],
  middle: ["बीच", "ਵਿਚਕਾਰ"],
  left: ["बायाँ", "ਖੱਬਾ"],
  right: ["दायाँ", "ਸੱਜਾ"],
  clockwise: ["घड़ी की दिशा में", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ"],
  anticlockwise: ["घड़ी की विपरीत दिशा में", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ"],
  centre: ["केंद्र", "ਕੇਂਦਰ"],
  center: ["केंद्र", "ਕੇਂਦਰ"],
  outward: ["बाहर की ओर", "ਬਾਹਰ ਵੱਲ"],
  north: ["उत्तर", "ਉੱਤਰ"],
  south: ["दक्षिण", "ਦੱਖਣ"],
  opposite: ["सामने", "ਸਾਹਮਣੇ"],
  adjacent: ["पास-पास", "ਨਾਲ-ਨਾਲ"],
  neighbour: ["पड़ोसी", "ਨਾਲ ਬੈਠਾ ਵਿਅਕਤੀ"],
  neighbours: ["पड़ोसी", "ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ"],
  between: ["बीच में", "ਵਿਚਕਾਰ"],
  facing: ["मुख-दिशा", "ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ"],
  faces: ["मुख किए है", "ਮੂੰਹ ਕਰਕੇ ਹੈ"],
  face: ["मुख किए हैं", "ਮੂੰਹ ਕਰਕੇ ਹਨ"],
  immediately: ["ठीक", "ਬਿਲਕੁਲ"],
  immediate: ["ठीक अगला", "ਬਿਲਕੁਲ ਅਗਲਾ"],
  direction: ["दिशा", "ਦਿਸ਼ਾ"],
  directions: ["दिशाएँ", "ਦਿਸ਼ਾਵਾਂ"],
  extreme: ["अंतिम", "ਅੰਤਲਾ"],
  straight: ["सीधी", "ਸਿੱਧੀ"],
  circular: ["गोल", "ਗੋਲ"],
  diagram: ["चित्र", "ਚਿੱਤਰ"],
  drawing: ["चित्र", "ਚਿੱਤਰ"],
  page: ["पृष्ठ", "ਸਫ਼ਾ"],
  arrow: ["तीर", "ਤੀਰ"],
  reference: ["संदर्भ", "ਹਵਾਲਾ"],

  question: ["प्रश्न", "ਸਵਾਲ"],
  questions: ["प्रश्न", "ਸਵਾਲ"],
  answer: ["उत्तर", "ਉੱਤਰ"],
  option: ["विकल्प", "ਵਿਕਲਪ"],
  statement: ["कथन", "ਕਥਨ"],
  statements: ["कथन", "ਕਥਨ"],
  pair: ["जोड़ी", "ਜੋੜਾ"],
  pairs: ["जोड़ियाँ", "ਜੋੜੇ"],
  sequence: ["क्रम", "ਕ੍ਰਮ"],
  order: ["क्रम", "ਕ੍ਰਮ"],
  orders: ["क्रम", "ਕ੍ਰਮ"],
  pattern: ["ढाँचा", "ਢੰਗ"],
  case: ["स्थिति", "ਸਥਿਤੀ"],
  step: ["चरण", "ਕਦਮ"],
  number: ["संख्या", "ਗਿਣਤੀ"],
  count: ["गिनें", "ਗਿਣੋ"],
  counting: ["गिनने पर", "ਗਿਣਣ 'ਤੇ"],
  counted: ["गिना गया", "ਗਿਣਿਆ ਗਿਆ"],
  counts: ["गिनता है", "ਗਿਣਦਾ ਹੈ"],
  correct: ["सही", "ਸਹੀ"],
  wrong: ["गलत", "ਗਲਤ"],
  wrongly: ["गलत तरीके से", "ਗਲਤ ਤਰੀਕੇ ਨਾਲ"],
  true: ["सही", "ਸਹੀ"],
  false: ["गलत", "ਗਲਤ"],
  odd: ["अलग", "ਵੱਖਰਾ"],

  sit: ["बैठें", "ਬੈਠੋ"],
  sits: ["बैठा/बैठी है", "ਬੈਠਾ/ਬੈਠੀ ਹੈ"],
  sitting: ["बैठे", "ਬੈਠੇ"],
  seated: ["बैठे", "ਬੈਠੇ"],
  placed: ["रखा गया", "ਰੱਖਿਆ ਗਿਆ"],
  place: ["स्थान", "ਥਾਂ"],
  places: ["स्थान", "ਥਾਵਾਂ"],
  put: ["रखें", "ਰੱਖੋ"],
  fill: ["भरें", "ਭਰੋ"],
  draw: ["बनाएँ", "ਬਣਾਓ"],
  write: ["लिखें", "ਲਿਖੋ"],
  mark: ["चिन्हित करें", "ਨਿਸ਼ਾਨ ਲਗਾਓ"],
  marking: ["चिन्हित करते हुए", "ਨਿਸ਼ਾਨ ਲਗਾਉਂਦੇ ਹੋਏ"],
  keep: ["रखें", "ਰੱਖੋ"],
  keeps: ["रखता है", "ਰੱਖਦਾ ਹੈ"],
  start: ["शुरू करें", "ਸ਼ੁਰੂ ਕਰੋ"],
  starting: ["शुरू करते हुए", "ਸ਼ੁਰੂ ਕਰਦੇ ਹੋਏ"],
  starts: ["शुरू होता है", "ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ"],
  take: ["लें", "ਲਵੋ"],
  use: ["लगाएँ", "ਲਗਾਓ"],
  uses: ["इस्तेमाल करता है", "ਵਰਤਦਾ ਹੈ"],
  used: ["इस्तेमाल किया", "ਵਰਤਿਆ"],
  using: ["इस्तेमाल करके", "ਵਰਤ ਕੇ"],
  apply: ["लगाएँ", "ਲਗਾਓ"],
  applying: ["लगाते समय", "ਲਗਾਉਂਦੇ ਸਮੇਂ"],
  see: ["देखें", "ਵੇਖੋ"],
  show: ["दिखाएँ", "ਦਿਖਾਓ"],
  shown: ["दिखाया गया", "ਦਿਖਾਇਆ ਗਿਆ"],
  shows: ["दिखाता है", "ਦਿਖਾਉਂਦਾ ਹੈ"],
  look: ["देखें", "ਵੇਖੋ"],
  looking: ["देखते हुए", "ਵੇਖਦੇ ਹੋਏ"],
  read: ["पढ़ें", "ਪੜ੍ਹੋ"],
  reads: ["पढ़ता है", "ਪੜ੍ਹਦਾ ਹੈ"],
  reading: ["पढ़ते समय", "ਪੜ੍ਹਦੇ ਸਮੇਂ"],
  reach: ["पहुँचें", "ਪਹੁੰਚੋ"],
  reaches: ["पहुँचते हैं", "ਪਹੁੰਚਦੇ ਹੋ"],
  moving: ["चलने पर", "ਚੱਲਣ 'ਤੇ"],
  moves: ["चलता है", "ਚਲਦਾ ਹੈ"],
  moved: ["चलाया गया", "ਚਲਾਇਆ ਗਿਆ"],
  stops: ["रुकता है", "ਰੁਕਦਾ ਹੈ"],
  stopping: ["रुकते हुए", "ਰੁਕਦੇ ਹੋਏ"],
  count: ["गिनें", "ਗਿਣੋ"],
  counts: ["गिनता है", "ਗਿਣਦਾ ਹੈ"],
  select: ["चुनें", "ਚੁਣੋ"],
  selects: ["चुनता है", "ਚੁਣਦਾ ਹੈ"],
  selected: ["चुना गया", "ਚੁਣਿਆ ਗਿਆ"],
  chosen: ["चुना गया", "ਚੁਣਿਆ ਗਿਆ"],
  chooses: ["चुनता है", "ਚੁਣਦਾ ਹੈ"],
  decide: ["तय करें", "ਤੈਅ ਕਰੋ"],
  decides: ["तय करता है", "ਤੈਅ ਕਰਦਾ ਹੈ"],
  fit: ["मेल खाता", "ਮਿਲਦਾ"],
  fits: ["मेल खाता है", "ਮਿਲਦਾ ਹੈ"],
  works: ["सही बैठता है", "ਠੀਕ ਬੈਠਦਾ ਹੈ"],
  change: ["बदलें", "ਬਦਲੋ"],
  changes: ["बदलता है", "ਬਦਲਦਾ ਹੈ"],
  changing: ["बदलने पर", "ਬਦਲਣ 'ਤੇ"],
  turning: ["घुमाने पर", "ਘੁਮਾਉਣ 'ਤੇ"],
  rotating: ["घुमाने पर", "ਘੁਮਾਉਣ 'ਤੇ"],
  reverse: ["उलटें", "ਉਲਟੋ"],
  reverses: ["उलट देता है", "ਉਲਟ ਦਿੰਦਾ ਹੈ"],
  follows: ["के बाद आता है", "ਦੇ ਬਾਅਦ ਆਉਂਦਾ ਹੈ"],
  joins: ["जोड़ता है", "ਜੋੜਦਾ ਹੈ"],
  make: ["बनाता", "ਬਣਾਉਂਦਾ"],
  makes: ["बनाता है", "ਬਣਾਉਂਦਾ ਹੈ"],
  making: ["बनाते हुए", "ਬਣਾਉਂਦੇ ਹੋਏ"],
  gives: ["देता है", "ਦਿੰਦਾ ਹੈ"],
  give: ["दें", "ਦਿਓ"],
  tells: ["बताता है", "ਦੱਸਦਾ ਹੈ"],
  know: ["जानें", "ਜਾਣੋ"],
  guess: ["अनुमान लगाएँ", "ਅਨੁਮਾਨ ਲਗਾਓ"],
  leave: ["छोड़ें", "ਛੱਡੋ"],
  leaves: ["छोड़ता है", "ਛੱਡਦਾ ਹੈ"],
  skip: ["छोड़ें", "ਛੱਡੋ"],
  skips: ["छोड़ देता है", "ਛੱਡ ਦਿੰਦਾ ਹੈ"],
  cross: ["काट दें", "ਕੱਟ ਦਿਓ"],
  resolve: ["तय करें", "ਤੈਅ ਕਰੋ"],
  treats: ["मानता है", "ਮੰਨਦਾ ਹੈ"],
  includes: ["शामिल करता है", "ਸ਼ਾਮਲ ਕਰਦਾ ਹੈ"],
  include: ["शामिल करें", "ਸ਼ਾਮਲ ਕਰੋ"],
  misses: ["छोड़ देता है", "ਛੱਡ ਦਿੰਦਾ ਹੈ"],
  occupies: ["पर बैठा है", "'ਤੇ ਬੈਠਾ ਹੈ"],
  occupy: ["पर बैठते हैं", "'ਤੇ ਬੈਠਦੇ ਹਨ"],
  interchanges: ["आपस में बदलता है", "ਆਪਸ ਵਿੱਚ ਬਦਲਦਾ ਹੈ"],
  exchange: ["आपस में बदलें", "ਆਪਸ ਵਿੱਚ ਬਦਲੋ"],

  so: ["इसलिए", "ਇਸ ਲਈ"],
  therefore: ["इसलिए", "ਇਸ ਲਈ"],
  hence: ["इसलिए", "ਇਸ ਲਈ"],
  because: ["क्योंकि", "ਕਿਉਂਕਿ"],
  since: ["क्योंकि", "ਕਿਉਂਕਿ"],
  not: ["नहीं", "ਨਹੀਂ"],
  does: ["करता है", "ਕਰਦਾ ਹੈ"],
  do: ["करें", "ਕਰੋ"],
  can: ["सकता है", "ਸਕਦਾ ਹੈ"],
  cannot: ["नहीं हो सकता", "ਨਹੀਂ ਹੋ ਸਕਦਾ"],
  will: ["होगा", "ਹੋਵੇਗਾ"],
  would: ["होगा", "ਹੋਵੇਗਾ"],
  must: ["जरूर", "ਜ਼ਰੂਰ"],
  may: ["हो सकता है", "ਹੋ ਸਕਦਾ ਹੈ"],
  be: ["हो", "ਹੋ"],
  is: ["है", "ਹੈ"],
  are: ["हैं", "ਹਨ"],
  were: ["थे", "ਸਨ"],
  have: ["हैं", "ਹਨ"],
  matter: ["फर्क पड़ता", "ਫਰਕ ਪੈਂਦਾ"],
  means: ["का अर्थ है", "ਦਾ ਅਰਥ ਹੈ"],
  asked: ["पूछा गया", "ਪੁੱਛਿਆ ਗਿਆ"],
  asks: ["पूछता है", "ਪੁੱਛਦਾ ਹੈ"],
  says: ["कहता है", "ਕਹਿੰਦਾ ਹੈ"],
  listed: ["दिए गए", "ਦਿੱਤੇ ਹੋਏ"],
  necessarily: ["जरूरी रूप से", "ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ"],
  possible: ["संभव", "ਸੰਭਵ"],
  possibilities: ["संभावनाएँ", "ਸੰਭਾਵਨਾਵਾਂ"],
  ways: ["तरीके", "ਤਰੀਕੇ"],
  way: ["तरीका", "ਤਰੀਕਾ"],
  final: ["अंतिम", "ਅੰਤਿਮ"],
  empty: ["खाली", "ਖਾਲੀ"],
  blank: ["खाली", "ਖਾਲੀ"],
  blanks: ["खाली स्थान", "ਖਾਲੀ ਥਾਵਾਂ"],
  rest: ["बाकी", "ਬਾਕੀ"],
  next: ["अगला", "ਅਗਲਾ"],
  last: ["अंतिम", "ਅੰਤਿਮ"],
  first: ["पहला", "ਪਹਿਲਾ"],
  second: ["दूसरा", "ਦੂਜਾ"],
  third: ["तीसरा", "ਤੀਜਾ"],
  fourth: ["चौथा", "ਚੌਥਾ"],
  fifth: ["पाँचवाँ", "ਪੰਜਵਾਂ"],
  sixth: ["छठा", "ਛੇਵਾਂ"],
  seventh: ["सातवाँ", "ਸੱਤਵਾਂ"],
  one: ["1", "1"],
  two: ["2", "2"],
  three: ["3", "3"],
  four: ["4", "4"],
  five: ["5", "5"],
  six: ["6", "6"],
  half: ["आधा", "ਅੱਧਾ"],
  halfway: ["आधे रास्ते", "ਅੱਧੇ ਰਸਤੇ"],
  away: ["दूर", "ਦੂਰ"],
  ahead: ["आगे", "ਅੱਗੇ"],
  apart: ["दूर", "ਦੂਰ"],
  beyond: ["से आगे", "ਤੋਂ ਅੱਗੇ"],
  towards: ["की ओर", "ਵੱਲ"],
  around: ["चारों ओर", "ਆਲੇ-ਦੁਆਲੇ"],
  inside: ["अंदर", "ਅੰਦਰ"],
  outside: ["बाहर", "ਬਾਹਰ"],
  directly: ["सीधे", "ਸਿੱਧੇ"],
  relative: ["सापेक्ष", "ਸਬੰਧਤ"],
  original: ["मूल", "ਮੂਲ"],
  originally: ["पहले", "ਪਹਿਲਾਂ"],
  under: ["इस स्थिति में", "ਇਸ ਸਥਿਤੀ ਵਿੱਚ"],
  during: ["के दौरान", "ਦੌਰਾਨ"],
  convenient: ["सुविधाजनक", "ਸੁਵਿਧਾਜਨਕ"],
  complete: ["पूरी", "ਪੂਰੀ"],
  whole: ["पूरी", "ਪੂਰੀ"],
  new: ["नई", "ਨਵੀਂ"],
  top: ["ऊपर", "ਉੱਪਰ"],
  nearest: ["सबसे पास", "ਸਭ ਤੋਂ ਨੇੜੇ"],
  door: ["दरवाज़ा", "ਦਰਵਾਜ਼ਾ"],
  entrance: ["प्रवेश-द्वार", "ਪ੍ਰਵੇਸ਼-ਦੁਆਰ"],
  stage: ["मंच", "ਮੰਚ"],
  point: ["स्थान", "ਥਾਂ"],
  requested: ["पूछे गए", "ਪੁੱਛੇ ਗਏ"],
  named: ["दिए गए", "ਦਿੱਤੇ ਹੋਏ"],
  intervening: ["बीच के", "ਵਿਚਕਾਰਲੇ"],
  consecutive: ["लगातार", "ਲਗਾਤਾਰ"],
  forbidden: ["मना की गई", "ਮਨਾਹੀ ਵਾਲੀ"],
  solved: ["हल की गई", "ਹੱਲ ਕੀਤੀ"],
  group: ["समूह", "ਸਮੂਹ"],
  following: ["निम्नलिखित", "ਹੇਠਾਂ ਦਿੱਤੇ"],
  whichever: ["जो भी", "ਜੋ ਵੀ"],
  either: ["दोनों में से कोई", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ"],
  well: ["सही तरह", "ਠੀਕ ਤਰ੍ਹਾਂ"],
  really: ["वास्तव में", "ਅਸਲ ਵਿੱਚ"],
  together: ["साथ", "ਇਕੱਠੇ"],
  rather: ["के बजाय", "ਦੀ ਬਜਾਏ"],
  instead: ["इसके बजाय", "ਇਸਦੀ ਬਜਾਏ"],
  about: ["के बारे में", "ਬਾਰੇ"],
  respect: ["सापेक्ष", "ਸਬੰਧ ਵਿੱਚ"],
  apply: ["लगाएँ", "ਲਗਾਓ"],
});

function localeValue(locale: Sea001TranslatedLocale, values: readonly [string, string]): string {
  return locale === "hi-IN" ? values[0] : values[1];
}

function replaceWholeWord(text: string, word: string, replacement: string): string {
  return text.replace(new RegExp(`\\b${word}\\b`, "gi"), replacement);
}

function repairKnownHybrids(text: string, locale: Sea001TranslatedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replaceAll("Tयहाँfore", "इसलिए")
      .replaceAll("tयहाँfore", "इसलिए")
      .replaceAll("poबैठेंion", "स्थान")
      .replaceAll("oppoबैठेंe", "सामने")
      .replaceAll("बैठेंting", "बैठे")
      .replaceAll("स्थानs", "स्थान")
      .replaceAll("तरीकाs", "तरीके")
      .replaceAll("व्यक्तिs", "व्यक्ति")
      .replaceAll("सीटs", "सीटें")
      .replaceAll("दिशाs", "दिशाएँ")
      .replaceAll("पड़ोसीs", "पड़ोसी")
      .replaceAll("गोल व्यवस्थाs", "गोल व्यवस्थाएँ")
      .replaceAll("कथनs", "कथन")
      .replaceAll("anदूसरा", "एक और")
      .replaceAll("'s", " के")
      .replaceAll("’s", " के")
      .replaceAll("n't", " नहीं");
  }
  return text
    .replaceAll("Tਇੱਥੇfore", "ਇਸ ਲਈ")
    .replaceAll("tਇੱਥੇfore", "ਇਸ ਲਈ")
    .replaceAll("poਬੈਠੋion", "ਸਥਿਤੀ")
    .replaceAll("oppoਬੈਠੋe", "ਸਾਹਮਣੇ")
    .replaceAll("ਬੈਠੋting", "ਬੈਠੇ")
    .replaceAll("ਥਾਂs", "ਥਾਵਾਂ")
    .replaceAll("ਤਰੀਕਾs", "ਤਰੀਕੇ")
    .replaceAll("ਵਿਅਕਤੀs", "ਵਿਅਕਤੀ")
    .replaceAll("ਸੀਟs", "ਸੀਟਾਂ")
    .replaceAll("ਦਿਸ਼ਾs", "ਦਿਸ਼ਾਵਾਂ")
    .replaceAll("ਗੁਆਂਢੀs", "ਗੁਆਂਢੀ")
    .replaceAll("ਗੋਲ ਵਿਵਸਥਾs", "ਗੋਲ ਵਿਵਸਥਾਵਾਂ")
    .replaceAll("ਕਥਨs", "ਕਥਨ")
    .replaceAll("anਦੂਜਾ", "ਇੱਕ ਹੋਰ")
    .replaceAll("'s", " ਦੇ")
    .replaceAll("’s", " ਦੇ")
    .replaceAll("n't", " ਨਹੀਂ");
}

function normalizeTeacherPhrases(text: string, locale: Sea001TranslatedLocale): string {
  let output = text;
  if (locale === "hi-IN") {
    output = output
      .replace(/Number सीटें से बायाँ को दायाँ\.?/gi, "सीटों को बाएँ से दाएँ क्रमांक दें।")
      .replace(/For every बायाँ\/दायाँ संकेत[^\n.]*/gi, "हर बाएँ/दाएँ वाले संकेत में पहले संदर्भ व्यक्ति की मुख-दिशा देखें")
      .replace(/Apply संकेत में क्रम:?/gi, "संकेतों को क्रम से लगाएँ:")
      .replace(/Apply संकेत 1 से 1:?/gi, "संकेतों को एक-एक करके लगाएँ:")
      .replace(/For चित्र, शुरू करें से/gi, "चित्र बनाने के लिए शुरुआत करें")
      .replace(/Since सभी/gi, "क्योंकि सभी")
      .replace(/Who दूसरा के बाईं ओर ([^?]+)\?/gi, "$1 के बाईं ओर दूसरा व्यक्ति कौन है?")
      .replace(/Who दूसरा के दाईं ओर ([^?]+)\?/gi, "$1 के दाईं ओर दूसरा व्यक्ति कौन है?")
      .replace(/कौन दूसरा के बाईं ओर ([^?]+)\?/g, "$1 के बाईं ओर दूसरा व्यक्ति कौन है?")
      .replace(/कौन दूसरा के दाईं ओर ([^?]+)\?/g, "$1 के दाईं ओर दूसरा व्यक्ति कौन है?")
      .replace(/कितने व्यक्ति बीच में बैठे हैं ([^?]+) और ([^?]+)\?/g, "$1 और $2 के बीच कितने व्यक्ति बैठे हैं?")
      .replace(/कौन-सा का निम्नलिखित कथन है सही\?/g, "निम्नलिखित में से कौन-सा कथन सही है?")
      .replace(/कौन-सा का निम्नलिखित कथन है गलत\?/g, "निम्नलिखित में से कौन-सा कथन गलत है?")
      .replace(/([^\n.]+) पर 1 का अंतिम छोर\./g, "$1 दोनों अंतिम छोरों में से किसी एक पर बैठा/बैठी है।")
      .replace(/count है (\d+)/gi, "गिनती $1 है")
      .replace(/the /gi, "")
      .replace(/For /gi, "")
      .replace(/Who /gi, "कौन ")
      .replace(/Which /gi, "कौन-सा ")
      .replace(/What /gi, "क्या ")
      .replace(/How many /gi, "कितने ");
  } else {
    output = output
      .replace(/Number ਸੀਟਾਂ ਤੋਂ ਖੱਬਾ ਨੂੰ ਸੱਜਾ\.?/gi, "ਸੀਟਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਨੰਬਰ ਦਿਓ।")
      .replace(/For every ਖੱਬਾ\/ਸੱਜਾ ਸੰਕੇਤ[^\n.]*/gi, "ਹਰ ਖੱਬੇ/ਸੱਜੇ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਪਹਿਲਾਂ ਹਵਾਲਾ ਵਿਅਕਤੀ ਦੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵੇਖੋ")
      .replace(/Apply ਸੰਕੇਤ ਵਿੱਚ ਕ੍ਰਮ:?/gi, "ਸੰਕੇਤਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਲਗਾਓ:")
      .replace(/Apply ਸੰਕੇਤ 1 ਤੋਂ 1:?/gi, "ਸੰਕੇਤਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਲਗਾਓ:")
      .replace(/For ਚਿੱਤਰ, ਸ਼ੁਰੂ ਕਰੋ ਤੋਂ/gi, "ਚਿੱਤਰ ਬਣਾਉਣ ਲਈ ਸ਼ੁਰੂ ਕਰੋ")
      .replace(/Since ਸਭ/gi, "ਕਿਉਂਕਿ ਸਭ")
      .replace(/Who ਦੂਜਾ ਦੇ ਖੱਬੇ ਪਾਸੇ ([^?]+)\?/gi, "$1 ਦੇ ਖੱਬੇ ਪਾਸੇ ਦੂਜਾ ਵਿਅਕਤੀ ਕੌਣ ਹੈ?")
      .replace(/Who ਦੂਜਾ ਦੇ ਸੱਜੇ ਪਾਸੇ ([^?]+)\?/gi, "$1 ਦੇ ਸੱਜੇ ਪਾਸੇ ਦੂਜਾ ਵਿਅਕਤੀ ਕੌਣ ਹੈ?")
      .replace(/ਕੌਣ ਦੂਜਾ ਦੇ ਖੱਬੇ ਪਾਸੇ ([^?]+)\?/g, "$1 ਦੇ ਖੱਬੇ ਪਾਸੇ ਦੂਜਾ ਵਿਅਕਤੀ ਕੌਣ ਹੈ?")
      .replace(/ਕੌਣ ਦੂਜਾ ਦੇ ਸੱਜੇ ਪਾਸੇ ([^?]+)\?/g, "$1 ਦੇ ਸੱਜੇ ਪਾਸੇ ਦੂਜਾ ਵਿਅਕਤੀ ਕੌਣ ਹੈ?")
      .replace(/ਕਿੰਨੇ ਵਿਅਕਤੀ ਵਿਚਕਾਰ ਬੈਠੇ ਹਨ ([^?]+) ਅਤੇ ([^?]+)\?/g, "$1 ਅਤੇ $2 ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?")
      .replace(/ਕਿਹੜਾ ਦਾ ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨ ਹੈ ਸਹੀ\?/g, "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?")
      .replace(/ਕਿਹੜਾ ਦਾ ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨ ਹੈ ਗਲਤ\?/g, "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਗਲਤ ਹੈ?")
      .replace(/([^\n.]+) 'ਤੇ 1 ਦਾ ਅੰਤਲੇ ਸਿਰੇ\./g, "$1 ਦੋਵੇਂ ਅੰਤਲੇ ਸਿਰਿਆਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ 'ਤੇ ਬੈਠਾ/ਬੈਠੀ ਹੈ।")
      .replace(/count ਹੈ (\d+)/gi, "ਗਿਣਤੀ $1 ਹੈ")
      .replace(/the /gi, "")
      .replace(/For /gi, "")
      .replace(/Who /gi, "ਕੌਣ ")
      .replace(/Which /gi, "ਕਿਹੜਾ ")
      .replace(/What /gi, "ਕੀ ")
      .replace(/How many /gi, "ਕਿੰਨੇ ");
  }
  return output;
}

export function polishSea001LocalizedReviewText(text: string, locale: Sea001TranslatedLocale): string {
  let output = repairKnownHybrids(text, locale);
  for (const [word, values] of Object.entries(FINAL_WORDS)) {
    output = replaceWholeWord(output, word, localeValue(locale, values));
  }
  output = repairKnownHybrids(output, locale);
  output = normalizeTeacherPhrases(output, locale);
  return output
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/ {2,}/g, " ")
    .replace(/ \./g, ".")
    .replace(/\n {1,}/g, "\n")
    .trim();
}

function polishOption(option: AuditOption, locale: Sea001TranslatedLocale): AuditOption {
  return {
    ...option,
    display: polishSea001LocalizedReviewText(option.display, locale),
    explanation: polishSea001LocalizedReviewText(option.explanation, locale),
  };
}

function polishChild(child: AuditChild, locale: Sea001TranslatedLocale): AuditChild {
  return {
    ...child,
    text: polishSea001LocalizedReviewText(child.text, locale),
    explanation: polishSea001LocalizedReviewText(child.explanation, locale),
    options: child.options.map((option) => polishOption(option, locale)),
  };
}

export function buildSea001LocalizedReviewCandidate(
  canonical: AuditCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const firstPass = localizeSea001ReviewCaselet(canonical, locale);
  const diagramText = firstPass.diagramText
    ? polishSea001LocalizedReviewText(firstPass.diagramText, locale)
    : firstPass.diagramText;
  const diagram = firstPass.diagram
    ? {
        ...firstPass.diagram,
        text: firstPass.diagram.text
          ? polishSea001LocalizedReviewText(firstPass.diagram.text, locale)
          : firstPass.diagram.text,
      }
    : firstPass.diagram;

  return {
    ...firstPass,
    setupText: polishSea001LocalizedReviewText(firstPass.setupText, locale),
    clueTexts: firstPass.clueTexts.map((clue) => polishSea001LocalizedReviewText(clue, locale)),
    sharedExplanation: polishSea001LocalizedReviewText(firstPass.sharedExplanation, locale),
    diagramText,
    diagram,
    children: firstPass.children.map((child) => polishChild(child, locale)),
  };
}
