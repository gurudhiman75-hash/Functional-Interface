import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp020ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_4: readonly SciCp020ReviewSpec[] = [
  [
    9,
    "Easy",
    "Which part of a flower produces pollen grains?",
    "Anther",
    [
      "Stigma",
      "Ovary",
      "Sepal"
    ],
    "The anther is the pollen-producing part of the stamen, the male reproductive organ of a flower.",
    [
      "FLOWER-ANTHER-POLLEN"
    ]
  ],
  [
    9,
    "Medium",
    "Pollination is the transfer of pollen grains from:",
    "Anther to stigma",
    [
      "Stigma to ovary",
      "Ovule to anther",
      "Ovary to sepal"
    ],
    "Pollination occurs when pollen is transferred from an anther to a stigma of the same flower or another flower of the same species.",
    [
      "POLLINATION-DEFINITION"
    ]
  ],
  [
    9,
    "Medium",
    "After fertilization in a flowering plant, the ovule usually develops into the:",
    "Seed",
    [
      "Fruit wall",
      "Stigma",
      "Anther"
    ],
    "Following fertilization, the ovule develops into a seed containing the embryo. The ovary usually develops into the fruit.",
    [
      "OVULE-SEED"
    ]
  ],
  [
    9,
    "Medium",
    "After fertilization, the ovary of a flower usually develops into the:",
    "Fruit",
    [
      "Seed coat only",
      "Pollen grain",
      "Root"
    ],
    "The ovary enlarges and develops into the fruit, while the ovules inside it generally become seeds.",
    [
      "OVARY-FRUIT"
    ]
  ],
  [
    9,
    "Hard",
    "A pollen grain lands on a compatible stigma. Which sequence most directly leads to fertilization?",
    "Pollen tube grows toward the ovule and carries male gametes",
    [
      "The stigma changes directly into a seed",
      "The anther grows into the ovary",
      "The sepal produces the embryo"
    ],
    "After compatible pollen lands on the stigma, it germinates and forms a pollen tube. The tube grows toward an ovule and delivers male gametes for fertilization.",
    [
      "POLLEN-TUBE-FERTILIZATION"
    ]
  ],
  [
    9,
    "Hard",
    "If all anthers are removed from an unopened bisexual flower before pollen is released, which process in that flower is directly prevented?",
    "Self-pollination from its own anthers",
    [
      "Development of sepals",
      "Water transport through xylem",
      "Opening of stomata"
    ],
    "Removing the anthers before they release pollen prevents that flower from supplying its own pollen. It may still receive pollen from another flower, but self-pollination from its own anthers is prevented.",
    [
      "EMASCULATION-SELF-POLLINATION"
    ]
  ],
  [
    10,
    "Easy",
    "The 'eyes' of a potato can give rise to new plants because they are:",
    "Buds on a modified stem",
    [
      "Root hairs",
      "Seeds embedded in the tuber",
      "Stomata"
    ],
    "Each potato eye is a bud on the stem tuber. Under suitable conditions it can grow into a new shoot, allowing vegetative propagation.",
    [
      "VEGETATIVE-POTATO-EYES"
    ]
  ],
  [
    10,
    "Medium",
    "Bryophyllum can reproduce vegetatively through buds present on its:",
    "Leaf margins",
    [
      "Root cap",
      "Anthers",
      "Seed coat"
    ],
    "Bryophyllum forms adventitious buds along the margins of its leaves. These buds can develop into small plantlets and produce new plants.",
    [
      "VEGETATIVE-BRYOPHYLLUM"
    ]
  ],
  [
    10,
    "Medium",
    "Which set of conditions is generally necessary for seed germination?",
    "Water, oxygen and suitable temperature",
    [
      "Light, carbon dioxide and dry soil only",
      "High salt concentration, oxygen and darkness",
      "Chlorophyll, pollen and low temperature"
    ],
    "Most seeds need water to activate metabolism, oxygen for respiration and a suitable temperature for enzyme activity. Light is not universally required for germination.",
    [
      "GERMINATION-CONDITIONS"
    ]
  ],
  [
    10,
    "Medium",
    "During the early stages of germination, the embryo mainly uses food stored in the:",
    "Seed",
    [
      "Stigma",
      "Root hairs of the parent plant",
      "Xylem of a mature stem"
    ],
    "Before the young seedling can photosynthesize sufficiently, it depends on stored reserves in the seed, often in cotyledons or endosperm.",
    [
      "GERMINATION-STORED-FOOD"
    ]
  ],
  [
    10,
    "Hard",
    "A farmer wants to multiply a plant while preserving the exact desirable characters of the parent. Which method is most suitable?",
    "Vegetative propagation",
    [
      "Cross-pollination between unrelated plants",
      "Sexual reproduction through seeds only",
      "Random seed collection from many varieties"
    ],
    "Vegetative propagation produces new plants from parts of a parent and generally preserves the parent's genetic combination. It is therefore useful for maintaining desirable traits.",
    [
      "VEGETATIVE-CLONAL"
    ]
  ],
  [
    10,
    "Hard",
    "A germinating seed is kept in moist soil but the soil is tightly waterlogged and contains very little air. Germination may fail mainly because the seed lacks enough:",
    "Oxygen for respiration",
    [
      "Carbon dioxide for photosynthesis",
      "Chlorophyll for water absorption",
      "Pollen for root growth"
    ],
    "A germinating seed requires respiration to release energy for growth. Severe waterlogging fills soil air spaces and can limit the oxygen available to the embryo.",
    [
      "GERMINATION-OXYGEN"
    ]
  ]
] as const;
