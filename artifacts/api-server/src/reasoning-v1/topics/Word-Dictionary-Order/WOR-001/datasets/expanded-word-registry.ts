import type { WorDifficulty, WorWordFamily, WorWordRecord } from "../foundation/types";

function record(word: string, familiarity: WorWordRecord["familiarity"] = "COMMON"): WorWordRecord {
  const normalized = word.toUpperCase();
  const prefixKeys = Array.from({ length: Math.min(5, normalized.length) }, (_, index) => normalized.slice(0, index + 1));
  return {
    id: `WOR-WORD-${normalized}`,
    word,
    normalized,
    familiarity,
    morphologyTags: normalized.endsWith("TION") ? ["NOUN_SUFFIX"] : normalized.endsWith("IVE") ? ["ADJECTIVE_SUFFIX"] : [],
    prefixKeys,
    containsRepeatedLetters: /([A-Z]).*\1/.test(normalized),
    editorialStatus: "PROVISIONAL_REVIEW",
  };
}

function family(id: string, tier: WorDifficulty, words: readonly string[], familiarity: WorWordRecord["familiarity"] = "COMMON"): WorWordFamily {
  return { id, tier, words: words.map((word) => record(word, familiarity)) };
}

export const WOR_WORD_FAMILY_EXPANSION: readonly WorWordFamily[] = [
  family("EASY-TIES-A", "EASY", ["Badge", "Baker", "Cabin", "Cactus", "Daily", "Dairy", "Fabric", "Fairy", "Giant", "Giraffe", "Habit", "Harbor"]),
  family("EASY-TIES-B", "EASY", ["Basic", "Battle", "Castle", "Casual", "Dealer", "Degree", "Fever", "Fence", "Label", "Labor", "Magic", "Major"]),
  family("EASY-TIES-C", "EASY", ["Bench", "Berry", "Coast", "Color", "Dinner", "Dirty", "Family", "Famous", "Guest", "Guide", "Metal", "Meter"]),
  family("EASY-TIES-D", "EASY", ["Baby", "Balance", "Cable", "Cafe", "Deep", "Deer", "Face", "Fact", "Game", "Garage", "Nail", "Name"]),
  family("EASY-TIES-E", "EASY", ["Bank", "Barrel", "City", "Civil", "Duty", "Dust", "Gift", "Girl", "Hope", "Hollow", "Map", "Marble"]),
  family("EASY-TIES-F", "EASY", ["Base", "Batch", "Cave", "Cedar", "Deal", "Debate", "Fast", "Father", "Gate", "Gather", "Mail", "Main"]),
  family("EASY-TIES-G", "EASY", ["Beauty", "Before", "Camp", "Canal", "Dark", "Date", "Fear", "Feast", "Goal", "Goat", "Key", "Kettle"]),
  family("EASY-TIES-H", "EASY", ["Bicycle", "Bird", "Cake", "Calm", "Data", "Dawn", "Feed", "Female", "Gas", "Gasoline", "Nature", "Navy"]),
  family("EASY-TIES-I", "EASY", ["Bitter", "Black", "Call", "Calmness", "Daring", "Dash", "Feverish", "Final", "Gentle", "Germ", "Medal", "Memory"]),
  family("EASY-TIES-J", "EASY", ["Bamboo", "Banner", "Cereal", "Chalk", "Delta", "Demon", "Fable", "Fancy", "Gentlemen", "Geography", "Motel", "Motor"]),
  family("SPE-FAMILY", "MEDIUM", ["Speak", "Speaker", "Special", "Species", "Specific", "Speech", "Speed", "Spell", "Spend", "Spear", "Spectrum", "Specimen"]),
  family("CHA-FAMILY", "MEDIUM", ["Chain", "Chamber", "Chance", "Change", "Channel", "Chaos", "Chapter", "Character", "Charge", "Charm", "Chart", "Chase"]),
  family("DEC-FAMILY", "MEDIUM", ["Decade", "Decay", "Deceive", "Decent", "Decide", "Decimal", "Decision", "Deck", "Declare", "Decline", "Decorate", "Decrease"]),
  family("PER-FAMILY", "MEDIUM", ["Perfect", "Perform", "Perhaps", "Period", "Permit", "Person", "Personal", "Persuade", "Percent", "Perceive", "Permanent", "Perfume"]),
  family("RES-FAMILY", "MEDIUM", ["Rescue", "Research", "Reserve", "Resident", "Resist", "Resolve", "Respect", "Respond", "Result", "Resume", "Resource", "Resort"]),
  family("CRE-FAMILY", "MEDIUM", ["Create", "Creator", "Creature", "Credit", "Creek", "Cream", "Crease", "Creative", "Creation", "Credential", "Crew", "Crest"]),
  family("FOR-FAMILY", "MEDIUM", ["Force", "Forecast", "Forehead", "Foreign", "Forget", "Forgive", "Fork", "Form", "Formal", "Format", "Former", "Formula"]),
  family("CAN-FAMILY", "MEDIUM", ["Canary", "Cancel", "Cancer", "Candidate", "Candy", "Canvas", "Cannon", "Cannot", "Canoe", "Canteen", "Canopy", "Canister"]),
  family("IMP-FAMILY", "MEDIUM", ["Impact", "Impair", "Impart", "Impatient", "Implement", "Imperial", "Imply", "Import", "Important", "Impose", "Impress", "Improve"]),
  family("SUB-FAMILY", "MEDIUM", ["Subject", "Submit", "Subway", "Suburb", "Subtle", "Subtract", "Submerge", "Subsidy", "Substance", "Substitute", "Subdue", "Subsoil"]),
  family("WORK-FAMILY", "HARD", ["Work", "Worker", "Working", "Workout", "Workplace", "Workshop", "Worksheet", "Workforce", "Workload", "Workman", "Workmanship", "Workroom"], "STANDARD"),
  family("HAND-FAMILY", "HARD", ["Hand", "Handbag", "Handbook", "Handbrake", "Handful", "Handmade", "Handout", "Handset", "Handshake", "Handwriting", "Handy", "Handle"], "STANDARD"),
  family("HOME-FAMILY", "HARD", ["Home", "Homeland", "Homeless", "Homemade", "Homeowner", "Homepage", "Hometown", "Homework", "Homeward", "Homecoming", "Homely", "Homestead"], "STANDARD"),
  family("HEAD-FAMILY", "HARD", ["Head", "Headache", "Headline", "Headlight", "Headmaster", "Headphone", "Headquarters", "Headroom", "Headway", "Headwind", "Headgear", "Heading"], "STANDARD"),
  family("BACK-FAMILY", "HARD", ["Back", "Backbone", "Background", "Backpack", "Backspace", "Backward", "Backwater", "Backyard", "Backfire", "Backlash", "Backlog", "Backroom"], "STANDARD"),
  family("FOOT-FAMILY", "HARD", ["Foot", "Football", "Footwear", "Footpath", "Footprint", "Footstep", "Footnote", "Foothold", "Footwork", "Footbridge", "Footfall", "Footman"], "STANDARD"),
  family("RAIN-FAMILY", "HARD", ["Rain", "Rainbow", "Raincoat", "Rainfall", "Raindrop", "Rainforest", "Rainy", "Rainwater", "Rainstorm", "Raincloud", "Rainmaker", "Rainproof"], "STANDARD"),
  family("SIDE-FAMILY", "HARD", ["Side", "Sidebar", "Sideboard", "Sidecar", "Sideline", "Sideways", "Sidewalk", "Sidetrack", "Sidekick", "Sidewall", "Sideshow", "Sideburn"], "STANDARD"),
  family("LAND-FAMILY", "HARD", ["Land", "Landmark", "Landlord", "Landscape", "Landslide", "Landline", "Landing", "Landfall", "Landmine", "Landmass", "Landowner", "Landlocked"], "STANDARD"),
  family("NEWS-FAMILY", "HARD", ["News", "Newspaper", "Newsletter", "Newsroom", "Newsreader", "Newscast", "Newsagent", "Newsprint", "Newsstand", "Newsworthy", "Newsflash", "Newsreel"], "STANDARD"),
];
