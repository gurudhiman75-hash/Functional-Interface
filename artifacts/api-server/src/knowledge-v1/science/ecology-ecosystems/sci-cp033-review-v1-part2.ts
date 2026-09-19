import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp033ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp033ReviewSpec[] = [
  [
    3,
    "Medium",
    "A rabbit feeding on grass is a:",
    "Primary consumer",
    [
      "Producer",
      "Secondary consumer",
      "Decomposer"
    ],
    "Herbivores that feed directly on producers occupy the primary-consumer level.",
    [
      "RABBIT-PRIMARY-CONSUMER"
    ]
  ],
  [
    3,
    "Medium",
    "Why are decomposers essential to long-term ecosystem function?",
    "They recycle nutrients from dead matter back into the environment",
    [
      "They create sunlight",
      "They stop all predation",
      "They permanently remove minerals"
    ],
    "Decomposition returns nutrients to soil and water so producers can use them again.",
    [
      "DECOMPOSER-NUTRIENT-RECYCLING"
    ]
  ],
  [
    3,
    "Hard",
    "If decomposers disappeared from a forest, which change would be expected over time?",
    "Dead matter would accumulate and nutrient recycling would slow",
    [
      "Producers would receive unlimited nutrients",
      "Food chains would gain extra energy",
      "Soil minerals would increase without limit"
    ],
    "Without decomposition, organic remains would build up and nutrients would be locked in dead material.",
    [
      "NO-DECOMPOSERS-FOREST"
    ]
  ],
  [
    4,
    "Easy",
    "A sequence showing who eats whom in an ecosystem is a:",
    "Food chain",
    [
      "Water cycle",
      "Taxonomic key",
      "Population curve"
    ],
    "A food chain shows a linear feeding relationship through which matter and energy move.",
    [
      "FOOD-CHAIN-DEFINITION"
    ]
  ],
  [
    4,
    "Easy",
    "In the chain grass → grasshopper → frog → snake, the grasshopper is a:",
    "Primary consumer",
    [
      "Producer",
      "Secondary consumer",
      "Decomposer"
    ],
    "The grasshopper eats the producer directly, so it is a primary consumer.",
    [
      "GRASSHOPPER-PRIMARY"
    ]
  ],
  [
    4,
    "Medium",
    "A food web differs from a food chain because it:",
    "Shows interconnected feeding relationships",
    [
      "Contains only one producer",
      "Shows only decomposers",
      "Has no consumers"
    ],
    "Food webs combine many food chains and show multiple feeding links in a community.",
    [
      "FOOD-WEB-DEFINITION"
    ]
  ],
  [
    4,
    "Medium",
    "In the chain grass → deer → tiger, the tiger occupies the:",
    "Third trophic level",
    [
      "First trophic level",
      "Second trophic level",
      "Producer level"
    ],
    "Grass is level one, deer level two and tiger level three.",
    [
      "TIGER-THIRD-TROPHIC"
    ]
  ],
  [
    4,
    "Medium",
    "Why are food webs generally more realistic than single food chains?",
    "Most organisms have more than one food source or predator",
    [
      "Every organism eats only one species",
      "Food webs exclude producers",
      "Food chains contain no energy flow"
    ],
    "Natural communities contain many interconnected feeding relationships rather than one simple chain.",
    [
      "FOOD-WEB-REALISTIC"
    ]
  ],
  [
    4,
    "Hard",
    "If a major herbivore disappears from a simple grass–deer–tiger system, which immediate effect is most likely?",
    "Tigers lose an important food source while grazing pressure on grass falls",
    [
      "Grass disappears because deer are absent",
      "Tiger numbers rise immediately",
      "Decomposers stop functioning"
    ],
    "Removing the herbivore reduces food for predators and reduces consumption of the producer.",
    [
      "REMOVE-HERBIVORE-EFFECT"
    ]
  ],
  [
    5,
    "Easy",
    "Energy enters most ecosystems through:",
    "Sunlight",
    [
      "Soil minerals",
      "Rainwater",
      "Wind alone"
    ],
    "Most ecosystems ultimately depend on solar energy captured by producers.",
    [
      "ECOSYSTEM-ENERGY-SUN"
    ]
  ],
  [
    5,
    "Easy",
    "The amount of usable energy generally:",
    "Decreases at higher trophic levels",
    [
      "Increases at each trophic level",
      "Remains exactly equal at all levels",
      "Is created by consumers"
    ],
    "Much energy is lost as heat and through metabolism at each trophic transfer.",
    [
      "ENERGY-DECREASE-TROPHIC"
    ]
  ],
  [
    5,
    "Medium",
    "The ten percent law states that roughly what fraction of energy is transferred to the next trophic level?",
    "About 10 percent",
    [
      "About 90 percent",
      "About 50 percent",
      "All of it"
    ],
    "Only a small part, often approximated as 10%, becomes biomass available to the next level.",
    [
      "TEN-PERCENT-LAW"
    ]
  ],
  [
    5,
    "Medium",
    "Why are food chains usually short?",
    "Energy available to support organisms becomes much lower at higher trophic levels",
    [
      "Predators cannot eat producers",
      "Producers contain no energy",
      "Decomposers stop energy loss"
    ],
    "Progressive energy loss limits the biomass and number of organisms that can be supported at high trophic levels.",
    [
      "FOOD-CHAIN-LENGTH-ENERGY"
    ]
  ],
  [
    5,
    "Medium",
    "An upright pyramid of energy means that:",
    "Energy is greatest at the producer level and falls upward",
    [
      "Top predators contain the most incoming solar energy",
      "Energy increases with trophic level",
      "All levels receive equal energy"
    ],
    "Energy pyramids are always upright because energy is lost between trophic levels.",
    [
      "ENERGY-PYRAMID-UPRIGHT"
    ]
  ],
  [
    5,
    "Hard",
    "If producers store 10,000 units of energy, about how much might be available to secondary consumers under the 10% approximation?",
    "About 100 units",
    [
      "About 1,000 units",
      "About 10,000 units",
      "About 9,000 units"
    ],
    "Primary consumers may receive about 1,000 units and secondary consumers about 100 units.",
    [
      "TEN-PERCENT-CALCULATION"
    ]
  ]
] as const;
