import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp034ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp034ReviewSpec[] = [
  [
    1,
    "Easy",
    "The introduction of harmful substances or energy into the environment is called:",
    "Pollution",
    [
      "Succession",
      "Taxonomy",
      "Adaptation"
    ],
    "Pollution occurs when contaminants or harmful forms of energy degrade environmental quality.",
    [
      "POLLUTION-DEFINITION"
    ]
  ],
  [
    1,
    "Easy",
    "A substance that causes pollution is called a:",
    "Pollutant",
    [
      "Producer",
      "Decomposer",
      "Nutrient"
    ],
    "A pollutant is a substance or agent that causes harmful environmental change.",
    [
      "POLLUTANT-DEFINITION"
    ]
  ],
  [
    1,
    "Medium",
    "Which statement best describes environmental pollution?",
    "It can affect air, water, soil and living organisms",
    [
      "It occurs only in cities",
      "It affects only humans",
      "It refers only to visible waste"
    ],
    "Pollution can occur in different environmental media and can harm both ecosystems and human health.",
    [
      "POLLUTION-MULTIPLE-MEDIA"
    ]
  ],
  [
    1,
    "Medium",
    "Which of the following is an example of physical pollution rather than a chemical pollutant?",
    "Excessive noise",
    [
      "Sulfur dioxide",
      "Lead compounds",
      "Pesticide residue"
    ],
    "Noise is a harmful form of energy and is treated as a physical pollutant.",
    [
      "PHYSICAL-POLLUTION-NOISE"
    ]
  ],
  [
    1,
    "Medium",
    "Why can pollution in one part of the environment affect another part?",
    "Air, water, soil and organisms are interconnected",
    [
      "Each environmental component is isolated",
      "Pollutants cannot move",
      "Only plants interact with the environment"
    ],
    "Pollutants can move between air, water, soil and food chains because environmental systems are connected.",
    [
      "POLLUTION-INTERCONNECTED"
    ]
  ],
  [
    1,
    "Hard",
    "A chemical released into a river later appears in fish and then in fish-eating birds. What does this show?",
    "Pollutants can move through ecosystems and food chains",
    [
      "Water pollution cannot affect land animals",
      "Fish remove all pollutants permanently",
      "Birds are abiotic factors"
    ],
    "Persistent pollutants can enter organisms and be transferred through feeding relationships.",
    [
      "POLLUTANT-FOOD-CHAIN-MOVEMENT"
    ]
  ],
  [
    2,
    "Easy",
    "Which gas is a common air pollutant produced by burning sulfur-containing fuels?",
    "Sulfur dioxide",
    [
      "Oxygen",
      "Nitrogen",
      "Helium"
    ],
    "Combustion of sulfur-containing coal and oil can release sulfur dioxide.",
    [
      "SO2-FUEL-BURNING"
    ]
  ],
  [
    2,
    "Easy",
    "Fine solid and liquid particles suspended in air are called:",
    "Particulate matter",
    [
      "Groundwater",
      "Humus",
      "Ozone layer"
    ],
    "Particulate matter includes small airborne particles such as dust, soot and droplets.",
    [
      "PARTICULATE-MATTER"
    ]
  ],
  [
    2,
    "Medium",
    "Carbon monoxide is especially dangerous because it:",
    "Reduces the blood's ability to carry oxygen",
    [
      "Causes plants to photosynthesize faster",
      "Forms bones",
      "Increases haemoglobin function"
    ],
    "Carbon monoxide binds strongly to haemoglobin and reduces oxygen transport.",
    [
      "CO-HAEMOGLOBIN"
    ]
  ],
  [
    2,
    "Medium",
    "Which source commonly increases particulate pollution in cities?",
    "Vehicle exhaust and combustion",
    [
      "Photosynthesis",
      "Rainfall",
      "Nitrogen fixation"
    ],
    "Fuel combustion from vehicles and other sources produces soot and fine particles.",
    [
      "URBAN-PM-COMBUSTION"
    ]
  ],
  [
    2,
    "Medium",
    "Why are very fine particles a health concern?",
    "They can penetrate deep into the respiratory system",
    [
      "They remain only on roads",
      "They always dissolve harmlessly",
      "They increase oxygen transport"
    ],
    "Fine particulate matter can reach deep parts of the lungs and contribute to respiratory and cardiovascular problems.",
    [
      "FINE-PARTICLES-LUNGS"
    ]
  ],
  [
    2,
    "Hard",
    "A city reduces sulfur dioxide emissions but particulate levels remain high because diesel smoke and road dust are unchanged. What does this show?",
    "Different pollutants require different control measures",
    [
      "Removing one pollutant removes all air pollution",
      "Particulates are gases",
      "Road dust is not air pollution"
    ],
    "Air pollution is a mixture; reducing one pollutant does not automatically remove other sources.",
    [
      "MULTI-POLLUTANT-CONTROL"
    ]
  ],
  [
    3,
    "Easy",
    "Discharge of untreated sewage into a river is a major cause of:",
    "Water pollution",
    [
      "Ozone depletion",
      "Noise pollution",
      "Soil formation"
    ],
    "Untreated sewage adds organic matter, pathogens and nutrients to water.",
    [
      "SEWAGE-WATER-POLLUTION"
    ]
  ],
  [
    3,
    "Easy",
    "Excess nutrients causing rapid algal growth in water is called:",
    "Eutrophication",
    [
      "Transpiration",
      "Denitrification",
      "Succession"
    ],
    "Eutrophication occurs when nutrient enrichment stimulates excessive algal and plant growth.",
    [
      "EUTROPHICATION-DEFINITION"
    ]
  ],
  [
    3,
    "Medium",
    "Why can untreated sewage lower dissolved oxygen in a river?",
    "Microorganisms consume oxygen while decomposing organic matter",
    [
      "Sewage produces extra oxygen",
      "Fish stop using oxygen",
      "Water loses all nitrogen"
    ],
    "Decomposition of sewage increases biological oxygen demand and reduces dissolved oxygen.",
    [
      "SEWAGE-OXYGEN-DEMAND"
    ]
  ]
] as const;
