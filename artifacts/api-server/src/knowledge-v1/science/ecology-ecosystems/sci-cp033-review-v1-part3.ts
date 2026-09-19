import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp033ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp033ReviewSpec[] = [
  [
    6,
    "Easy",
    "Members of the same species living in one area form a:",
    "Population",
    [
      "Community",
      "Ecosystem",
      "Biome"
    ],
    "A population consists of individuals of the same species living in a defined area.",
    [
      "POPULATION-DEFINITION"
    ]
  ],
  [
    6,
    "Easy",
    "When two species use the same limited resource, the interaction is called:",
    "Competition",
    [
      "Mutualism",
      "Predation",
      "Decomposition"
    ],
    "Competition occurs when organisms depend on the same limited resource.",
    [
      "COMPETITION-DEFINITION"
    ]
  ],
  [
    6,
    "Medium",
    "In mutualism:",
    "Both interacting species benefit",
    [
      "One benefits and the other is harmed",
      "Neither species is affected",
      "One organism kills and eats the other"
    ],
    "Mutualism is an interaction in which both partners gain a benefit.",
    [
      "MUTUALISM-DEFINITION"
    ]
  ],
  [
    6,
    "Medium",
    "A lion killing and eating a zebra is an example of:",
    "Predation",
    [
      "Mutualism",
      "Commensalism",
      "Competition only"
    ],
    "Predation occurs when one organism captures and consumes another.",
    [
      "PREDATION-DEFINITION"
    ]
  ],
  [
    6,
    "Medium",
    "In commensalism, one species benefits while the other is:",
    "Neither significantly helped nor harmed",
    [
      "Always killed",
      "Always helped equally",
      "Converted into a producer"
    ],
    "Commensalism benefits one partner without a major effect on the other.",
    [
      "COMMENSALISM-DEFINITION"
    ]
  ],
  [
    6,
    "Hard",
    "Two plant species rely on the same scarce soil nutrient. As the nutrient becomes limited, growth of both declines. Which interaction best explains this?",
    "Competition",
    [
      "Mutualism",
      "Predation",
      "Commensalism"
    ],
    "Both species require the same limited resource, so they compete for it.",
    [
      "RESOURCE-COMPETITION"
    ]
  ],
  [
    7,
    "Easy",
    "Water vapour returns to the atmosphere from plant leaves through:",
    "Transpiration",
    [
      "Respiration only",
      "Nitrogen fixation",
      "Decomposition only"
    ],
    "Plants release water vapour from leaves through transpiration.",
    [
      "TRANSPIRATION-WATER-CYCLE"
    ]
  ],
  [
    7,
    "Easy",
    "The conversion of atmospheric water vapour into liquid droplets is called:",
    "Condensation",
    [
      "Evaporation",
      "Transpiration",
      "Infiltration"
    ],
    "Condensation forms liquid water from water vapour, contributing to cloud formation.",
    [
      "CONDENSATION-DEFINITION"
    ]
  ],
  [
    7,
    "Medium",
    "Photosynthesis removes which gas from the atmosphere?",
    "Carbon dioxide",
    [
      "Nitrogen",
      "Oxygen",
      "Argon"
    ],
    "Plants and other photosynthetic organisms take up carbon dioxide to make organic compounds.",
    [
      "PHOTOSYNTHESIS-CO2"
    ]
  ],
  [
    7,
    "Medium",
    "Respiration returns carbon to the atmosphere as:",
    "Carbon dioxide",
    [
      "Nitrogen gas",
      "Ozone",
      "Methane in all organisms"
    ],
    "Cellular respiration releases carbon dioxide from the breakdown of organic molecules.",
    [
      "RESPIRATION-CO2"
    ]
  ],
  [
    7,
    "Medium",
    "Burning fossil fuels affects the carbon cycle by:",
    "Releasing stored carbon dioxide into the atmosphere",
    [
      "Removing all atmospheric carbon",
      "Fixing nitrogen",
      "Stopping respiration"
    ],
    "Combustion transfers carbon stored in fuels into atmospheric carbon dioxide.",
    [
      "FOSSIL-FUEL-CARBON"
    ]
  ],
  [
    7,
    "Hard",
    "A large forest is cleared and burned. Which two changes both raise atmospheric carbon dioxide?",
    "Less photosynthetic uptake and release of carbon during burning",
    [
      "More transpiration and more nitrogen fixation",
      "More photosynthesis and less combustion",
      "Less respiration and more condensation"
    ],
    "Deforestation reduces carbon uptake, while burning releases stored carbon.",
    [
      "DEFORESTATION-CARBON-DOUBLE-EFFECT"
    ]
  ],
  [
    8,
    "Easy",
    "The conversion of atmospheric nitrogen into usable nitrogen compounds is called:",
    "Nitrogen fixation",
    [
      "Nitrification only",
      "Denitrification",
      "Transpiration"
    ],
    "Nitrogen fixation converts nitrogen gas into compounds that can enter biological systems.",
    [
      "NITROGEN-FIXATION-DEFINITION"
    ]
  ],
  [
    8,
    "Easy",
    "Rhizobium is important in the nitrogen cycle because it:",
    "Fixes nitrogen in association with legume roots",
    [
      "Produces oxygen from nitrogen",
      "Converts nitrate directly to sunlight",
      "Stops decomposition"
    ],
    "Rhizobium bacteria in legume root nodules fix atmospheric nitrogen.",
    [
      "RHIZOBIUM-NITROGEN-CYCLE"
    ]
  ],
  [
    8,
    "Medium",
    "Decomposition contributes to the nitrogen cycle by:",
    "Releasing nitrogen compounds from dead organic matter",
    [
      "Removing all nitrogen from soil",
      "Converting oxygen into nitrogen gas",
      "Preventing plant uptake"
    ],
    "Decomposers break organic nitrogen compounds and return usable nitrogen forms to soil.",
    [
      "DECOMPOSITION-NITROGEN"
    ]
  ]
] as const;
