import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp031ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp031ReviewSpec[] = [
  [
    8,
    "Medium",
    "Which microorganism is traditionally used in alcohol production?",
    "Yeast",
    [
      "Rhizobium",
      "Amoeba",
      "Bacteriophage"
    ],
    "Yeast converts sugars into ethanol and carbon dioxide during fermentation.",
    [
      "YEAST-ALCOHOL"
    ]
  ],
  [
    8,
    "Medium",
    "Microbial enzymes are valuable in industry because enzymes:",
    "Catalyse specific chemical reactions",
    [
      "Are living cells themselves",
      "Always kill bacteria",
      "Replace all nutrients"
    ],
    "Enzymes speed particular biochemical reactions and can be produced in large amounts using microorganisms.",
    [
      "MICROBIAL-ENZYMES"
    ]
  ],
  [
    8,
    "Hard",
    "A factory wants a microorganism to convert sugar into ethanol under low-oxygen conditions. Which organism is the best choice?",
    "Yeast",
    [
      "Rhizobium",
      "Amoeba",
      "Cyanobacterium used for nitrogen fixation"
    ],
    "Yeast carries out alcoholic fermentation and is widely used for ethanol production.",
    [
      "ETHANOL-MICROBE-CHOICE"
    ]
  ],
  [
    9,
    "Easy",
    "Microorganisms that break down dead organic matter are called:",
    "Decomposers",
    [
      "Producers only",
      "Vectors",
      "Hormones"
    ],
    "Decomposer microbes break complex organic remains into simpler substances.",
    [
      "DECOMPOSERS"
    ]
  ],
  [
    9,
    "Medium",
    "Why is decomposition important in ecosystems?",
    "It returns nutrients to the environment",
    [
      "It permanently removes all nutrients",
      "It prevents plant growth",
      "It produces no useful products"
    ],
    "Decomposition releases mineral nutrients from dead material so they can be reused by other organisms.",
    [
      "DECOMPOSITION-NUTRIENT-CYCLE"
    ]
  ],
  [
    9,
    "Medium",
    "Which groups commonly act as decomposers?",
    "Bacteria and fungi",
    [
      "Only viruses",
      "Only mammals",
      "Only flowering plants"
    ],
    "Many bacteria and fungi digest dead organic matter and drive decomposition.",
    [
      "BACTERIA-FUNGI-DECOMPOSERS"
    ]
  ],
  [
    9,
    "Medium",
    "Composting depends heavily on microorganisms because they:",
    "Break down organic waste",
    [
      "Convert all waste into plastic",
      "Stop all chemical reactions",
      "Remove every mineral"
    ],
    "Microbes decompose plant and food wastes, converting them into simpler, humus-like material.",
    [
      "COMPOST-MICROBES"
    ]
  ],
  [
    9,
    "Hard",
    "If decomposer microorganisms disappeared from a forest, what would happen over time?",
    "Dead organic matter would accumulate and nutrient recycling would slow",
    [
      "All plants would immediately gain extra nutrients",
      "Fossil formation would stop every process",
      "Nitrogen fixation would automatically double"
    ],
    "Without decomposers, dead material would build up and nutrients would be returned to soil much more slowly.",
    [
      "NO-DECOMPOSERS-REASONING"
    ]
  ],
  [
    9,
    "Hard",
    "A compost pile remains dry and decomposition nearly stops. Which change would most directly help microbial activity?",
    "Provide suitable moisture",
    [
      "Remove all organic matter",
      "Freeze the pile",
      "Add only sterile plastic"
    ],
    "Decomposer microbes require suitable moisture along with organic material and appropriate temperature.",
    [
      "COMPOST-MOISTURE"
    ]
  ],
  [
    10,
    "Easy",
    "Refrigeration slows food spoilage because low temperature:",
    "Reduces the growth and activity of many microorganisms",
    [
      "Kills every microbe instantly",
      "Creates vitamins",
      "Converts microbes into minerals"
    ],
    "Cold temperatures slow microbial metabolism and reproduction, extending food shelf life.",
    [
      "REFRIGERATION-SLOWS-MICROBES"
    ]
  ],
  [
    10,
    "Medium",
    "Drying preserves food chiefly by:",
    "Reducing the water available for microbial growth",
    [
      "Increasing microbial reproduction",
      "Adding oxygen to every cell",
      "Converting food into antibiotics"
    ],
    "Most spoilage microbes need available water, so drying strongly limits their growth.",
    [
      "DRYING-PRESERVATION"
    ]
  ],
  [
    10,
    "Medium",
    "High concentrations of salt or sugar preserve some foods because they:",
    "Reduce water availability to microorganisms",
    [
      "Provide unlimited water to microbes",
      "Make all microbes photosynthetic",
      "Turn fungi into bacteria"
    ],
    "Salt and sugar draw water and lower water availability, creating conditions that inhibit many microbes.",
    [
      "SALT-SUGAR-PRESERVATION"
    ]
  ],
  [
    10,
    "Medium",
    "Pasteurization of milk is designed to:",
    "Reduce harmful and spoilage microorganisms by controlled heating",
    [
      "Sterilize milk with freezing",
      "Add nitrogen-fixing bacteria",
      "Increase all microbial growth"
    ],
    "Pasteurization uses controlled heat treatment to greatly reduce pathogens and spoilage microbes while limiting changes to the food.",
    [
      "PASTEURIZATION"
    ]
  ],
  [
    10,
    "Hard",
    "Cooked food is left warm and uncovered for many hours. Why does spoilage risk increase?",
    "Warmth, nutrients and exposure provide favourable conditions for microbial growth",
    [
      "Cooking permanently prevents any microbial contamination",
      "Microbes require freezing to reproduce",
      "Warm food contains no water"
    ],
    "After cooking, food can be recontaminated, and warm nutrient-rich conditions can support rapid microbial growth.",
    [
      "FOOD-SPOILAGE-CONDITIONS"
    ]
  ],
  [
    10,
    "Hard",
    "A food is both dried and stored cold. Why can the combination preserve it better than either method alone?",
    "It limits both water availability and microbial metabolic rate",
    [
      "It increases microbial moisture and temperature",
      "It supplies microbes with extra nutrients",
      "It guarantees complete sterilization"
    ],
    "Drying deprives microbes of available water, while refrigeration slows their growth and metabolism.",
    [
      "COMBINED-PRESERVATION"
    ]
  ]
] as const;
