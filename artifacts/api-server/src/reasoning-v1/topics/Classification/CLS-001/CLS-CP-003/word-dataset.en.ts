import type {
  ClsCp003JumbleEntry,
  ClsCp003PrototypeDefinition,
  ClsCp003WordEntry,
} from "./types";

const GENERAL_WORDS = [
  "acid", "aged", "area", "army", "away", "baby", "back", "ball", "band", "bank", "base", "bath",
  "bear", "beat", "bell", "belt", "best", "bird", "blue", "boat", "body", "bone", "book", "born",
  "boss", "bowl", "busy", "cake", "calm", "camp", "card", "care", "case", "cash", "cell", "chat",
  "chip", "city", "club", "coal", "coat", "code", "cold", "cook", "cool", "copy", "core", "cost",
  "crew", "crop", "dark", "data", "date", "dawn", "deal", "dear", "deep", "desk", "diet", "disc",
  "door", "down", "draw", "drop", "dust", "duty", "each", "earn", "ease", "east", "easy", "edge",
  "else", "even", "ever", "evil", "exit", "face", "fact", "fail", "fair", "fall", "farm", "fast",
  "fear", "feed", "feel", "file", "fill", "film", "find", "fine", "fire", "firm", "fish", "five",
  "flat", "flow", "food", "foot", "form", "four", "free", "fuel", "full", "fund", "gain", "game",
  "gate", "gear", "gift", "girl", "give", "glad", "goal", "gold", "golf", "good", "grow", "hair",
  "half", "hall", "hand", "hang", "hard", "harm", "hate", "head", "hear", "heat", "help", "hero",
  "high", "hill", "hire", "hold", "hole", "holy", "home", "hope", "host", "hour", "huge", "hunt",
  "idea", "inch", "into", "iron", "item", "join", "jump", "jury", "keen", "keep", "kick", "kind",
  "king", "knee", "know", "lady", "lake", "land", "lane", "last", "late", "lead", "left", "less",
  "life", "lift", "like", "line", "link", "list", "live", "load", "loan", "lock", "long", "look",
  "lose", "loss", "love", "luck", "mail", "main", "make", "male", "many", "mark", "mass", "meal",
  "mean", "meat", "meet", "menu", "mild", "mile", "milk", "mill", "mind", "mine", "mode", "mood",
  "moon", "more", "most", "move", "much", "must", "name", "navy", "near", "neck", "need", "news",
  "next", "nice", "nine", "none", "nose", "note", "once", "only", "open", "oral", "over", "pace",
  "pack", "page", "paid", "pain", "pair", "palm", "park", "part", "pass", "past", "path", "peak",
  "pick", "pink", "pipe", "plan", "play", "plot", "plug", "plus", "poll", "pool", "poor", "port",
  "post", "pull", "pure", "push", "race", "rail", "rain", "rank", "rare", "rate", "read", "real",
  "rear", "rely", "rent", "rest", "rice", "rich", "ride", "ring", "rise", "risk", "road", "rock",
  "role", "roll", "roof", "room", "root", "rose", "rule", "safe", "sale", "salt", "same", "sand",
  "save", "seat", "seed", "seek", "seem", "self", "sell", "send", "ship", "shop", "shot", "show",
  "side", "sign", "site", "size", "skin", "slip", "slow", "snow", "soft", "soil", "sold", "sole",
  "some", "song", "soon", "sort", "soul", "spot", "star", "stay", "step", "stop", "suit", "sure",
  "take", "tale", "talk", "tall", "tank", "tape", "task", "team", "tell", "tend", "term", "test",
  "text", "thin", "time", "tiny", "tone", "tool", "tour", "town", "tree", "trip", "true", "tune",
  "turn", "twin", "type", "unit", "upon", "user", "vary", "vast", "very", "vice", "view", "vote",
  "wage", "wait", "wake", "walk", "wall", "want", "ward", "warm", "wash", "wave", "weak", "wear",
  "week", "well", "west", "wide", "wife", "wild", "will", "wind", "wine", "wing", "wire", "wise",
  "wish", "wood", "word", "work", "yard", "year", "zero",
  "apple", "arise", "alone", "amber", "black", "bland", "bread", "brown", "charm", "clean", "cloud",
  "crisp", "dream", "drift", "eager", "eagle", "flock", "grape", "green", "guava", "horse", "house",
  "ideal", "image", "lemon", "mango", "ocean", "opera", "peach", "quiet", "river", "robin", "smash",
  "smile", "stone", "table", "tiger", "train", "trust", "unite", "value", "white", "zebra",
  "animal", "basket", "bridge", "button", "candle", "castle", "circle", "coffee", "cotton", "dinner",
  "doctor", "dragon", "family", "garden", "hammer", "island", "jungle", "kitten", "letter", "little",
  "market", "monkey", "mother", "orange", "pencil", "people", "planet", "rabbit", "school", "silver",
  "sister", "spring", "street", "summer", "ticket", "travel", "window", "winter", "yellow",
  "airport", "balance", "blanket", "brother", "captain", "chicken", "country", "diamond", "dolphin",
  "evening", "freedom", "kitchen", "machine", "morning", "picture", "rainbow", "teacher", "village",
  "weather", "welcome", "whisper", "ability", "building", "computer", "elephant", "festival", "hospital",
  "mountain", "notebook", "shoulder", "sunlight", "umbrella",
  "banana", "parallel", "possess", "success", "assess", "balloon", "address", "tattoo", "bookkeeper",
] as const;

const PALINDROMES = [
  "wow", "mom", "dad", "eye", "pop", "gag", "nun",
  "noon", "deed", "peep", "toot", "sees",
  "level", "radar", "civic", "madam", "refer", "rotor", "kayak", "tenet", "minim", "solos", "stats",
  "redder", "racecar", "reviver", "rotator", "repaper",
] as const;

const AFFIX_GROUPS: Readonly<Record<string, readonly string[]>> = {
  PREFIX_UN: ["unable", "unfair", "unkind", "unsafe", "untidy", "unseen", "unlock", "untold"],
  PREFIX_RE: ["rebuild", "recall", "redo", "refill", "reform", "replay", "return", "rewrite"],
  PREFIX_DIS: ["dislike", "disobey", "distrust", "disable", "discard", "displace", "disprove", "dissent"],
  PREFIX_PRE: ["preheat", "preview", "prepay", "pretest", "prefix", "prepaid", "preplan", "prebook"],
  PREFIX_MIS: ["mislead", "misread", "misplace", "mistake", "misuse", "misprint", "misjudge", "miscount"],
  SUFFIX_FUL: ["careful", "hopeful", "useful", "joyful", "playful", "thankful", "fearful", "helpful"],
  SUFFIX_LESS: ["careless", "hopeless", "useless", "fearless", "endless", "harmless", "restless", "speechless"],
  SUFFIX_NESS: ["kindness", "darkness", "softness", "illness", "weakness", "fairness", "sadness", "fitness"],
  SUFFIX_MENT: ["payment", "movement", "shipment", "treatment", "agreement", "enjoyment", "judgment", "improvement"],
  SUFFIX_TION: ["action", "nation", "station", "motion", "relation", "creation", "solution", "mention"],
  SUFFIX_ABLE: ["readable", "washable", "movable", "lovable", "breakable", "payable", "usable", "notable"],
} as const;

function buildWordDataset(): ClsCp003WordEntry[] {
  const byWord = new Map<string, ClsCp003WordEntry>();
  const add = (word: string, primaryAffix: string) => {
    byWord.set(word, { word, primaryAffix, sourceStatus: "CURATED" });
  };
  for (const word of GENERAL_WORDS) add(word, "NONE");
  for (const word of PALINDROMES) add(word, "NONE");
  for (const [affix, words] of Object.entries(AFFIX_GROUPS)) {
    for (const word of words) add(word, affix);
  }
  return [...byWord.values()].sort((left, right) => left.word.localeCompare(right.word));
}

export const CLS_CP003_WORDS: readonly ClsCp003WordEntry[] = buildWordDataset();

const JUMBLE_CLASSES: Readonly<Record<string, readonly string[]>> = {
  FRUIT: ["apple", "grape", "peach", "guava", "mango"],
  VEGETABLE: ["carrot", "potato", "turnip", "radish", "tomato"],
  ANIMAL: ["tiger", "zebra", "horse", "sheep", "camel"],
  BIRD: ["eagle", "robin", "crane", "heron", "raven"],
  COLOUR: ["green", "black", "white", "brown", "amber"],
  TOOL: ["hammer", "chisel", "wrench", "pliers", "shovel"],
  PROFESSION: ["doctor", "lawyer", "farmer", "barber", "tailor"],
} as const;

export const CLS_CP003_JUMBLE_WORDS: readonly ClsCp003JumbleEntry[] = Object.entries(JUMBLE_CLASSES)
  .flatMap(([semanticClass, words]) => words.map((canonicalWord) => ({
    canonicalWord,
    semanticClass,
    sourceStatus: "CURATED" as const,
  })));

export const CLS_CP003_PROTOTYPES: readonly ClsCp003PrototypeDefinition[] = [
  {
    prototypeId: "CLS-CP003-PROT-001",
    title: "Exact word-length outlier",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    generationProfile: "EXACT_LENGTH_OUTLIER",
    intendedRuleId: "WORD_LENGTH",
  },
  {
    prototypeId: "CLS-CP003-PROT-002",
    title: "Vowel-count outlier",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    generationProfile: "VOWEL_COUNT_OUTLIER",
    intendedRuleId: "VOWEL_COUNT",
  },
  {
    prototypeId: "CLS-CP003-PROT-003",
    title: "Repeated-letter topology outlier",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    generationProfile: "REPEATED_TOPOLOGY_OUTLIER",
    intendedRuleId: "REPEATED_LETTER_TOPOLOGY",
  },
  {
    prototypeId: "CLS-CP003-PROT-004",
    title: "Palindrome-status outlier",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    generationProfile: "PALINDROME_STATUS_OUTLIER",
    intendedRuleId: "PALINDROME_STATUS",
  },
  {
    prototypeId: "CLS-CP003-PROT-005",
    title: "First-and-last letter-class outlier",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    generationProfile: "BOUNDARY_CLASS_OUTLIER",
    intendedRuleId: "BOUNDARY_LETTER_CLASS",
  },
  {
    prototypeId: "CLS-CP003-PROT-006",
    title: "Common prefix or suffix outlier",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    generationProfile: "AFFIX_FAMILY_OUTLIER",
    intendedRuleId: "PRIMARY_AFFIX",
  },
  {
    prototypeId: "CLS-CP003-PROT-007",
    title: "Controlled jumbled-word semantic outlier",
    task: "RESOLVE_JUMBLES_AND_FIND_OUTLIER",
    generationProfile: "JUMBLED_SEMANTIC_OUTLIER",
    intendedRuleId: "RESOLVED_SEMANTIC_CLASS",
  },
];

export const CLS_CP003_PROTOTYPE_BY_ID = new Map(
  CLS_CP003_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);