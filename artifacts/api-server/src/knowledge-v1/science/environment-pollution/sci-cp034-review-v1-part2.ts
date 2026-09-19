import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp034ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp034ReviewSpec[] = [
  [
    3,
    "Medium",
    "Fertilizer runoff can promote algal blooms because it adds:",
    "Nitrates and phosphates",
    [
      "Only oxygen",
      "Sand only",
      "Calcium carbonate only"
    ],
    "Nutrients such as nitrogen and phosphorus can stimulate rapid algal growth.",
    [
      "FERTILIZER-NUTRIENTS-EUTROPHICATION"
    ]
  ],
  [
    3,
    "Medium",
    "Why can a dense algal bloom eventually harm fish?",
    "Decomposition of dead algae can deplete dissolved oxygen",
    [
      "Algae always poison fish directly",
      "Algae remove all water",
      "Algae stop gravity"
    ],
    "When large algal populations die, decomposition can consume oxygen and create low-oxygen conditions.",
    [
      "ALGAL-BLOOM-FISH-OXYGEN"
    ]
  ],
  [
    3,
    "Hard",
    "A lake receives fertilizer runoff, turns green, and later develops fish deaths. Which sequence best explains this?",
    "Nutrient enrichment → algal bloom → decomposition → oxygen depletion",
    [
      "Oxygen increase → algal decline → nutrient loss",
      "Noise pollution → algae → acid rain",
      "Soil erosion → ozone depletion → fish death"
    ],
    "Eutrophication begins with nutrient enrichment and can end in oxygen depletion after decomposition.",
    [
      "EUTROPHICATION-SEQUENCE"
    ]
  ],
  [
    4,
    "Easy",
    "Discarded plastic bags are a form of:",
    "Solid waste",
    [
      "Noise pollution",
      "Thermal energy",
      "Groundwater recharge"
    ],
    "Plastic waste is a common form of persistent solid waste.",
    [
      "PLASTIC-SOLID-WASTE"
    ]
  ],
  [
    4,
    "Easy",
    "Which practice can directly contaminate soil with toxic chemicals?",
    "Excessive pesticide use",
    [
      "Planting trees",
      "Composting kitchen waste",
      "Rainwater harvesting"
    ],
    "Persistent or excessive pesticide residues can accumulate in soil and affect organisms.",
    [
      "PESTICIDE-SOIL-POLLUTION"
    ]
  ],
  [
    4,
    "Medium",
    "Why are many plastics an environmental concern?",
    "They degrade very slowly and can accumulate",
    [
      "They disappear within minutes",
      "They are always edible",
      "They convert directly into oxygen"
    ],
    "Many common plastics persist for long periods and can accumulate in land and water.",
    [
      "PLASTIC-PERSISTENCE"
    ]
  ],
  [
    4,
    "Medium",
    "Open dumping of electronic waste is risky because e-waste may contain:",
    "Toxic metals and chemicals",
    [
      "Only harmless cellulose",
      "Only water",
      "No recoverable materials"
    ],
    "Electronic waste can contain lead, mercury and other hazardous substances.",
    [
      "EWASTE-TOXIC-MATERIALS"
    ]
  ],
  [
    4,
    "Medium",
    "Why is composting suitable for many kitchen and garden wastes?",
    "They are biodegradable organic materials",
    [
      "They are metals",
      "They are radioactive",
      "They cannot be decomposed"
    ],
    "Microorganisms can break down biodegradable organic waste into compost.",
    [
      "COMPOST-BIODEGRADABLE"
    ]
  ],
  [
    4,
    "Hard",
    "A landfill receives mixed food waste, batteries and plastics. Why is source segregation important?",
    "Different waste types need different treatment and hazardous items should be isolated",
    [
      "All wastes are treated identically",
      "Segregation increases contamination",
      "Batteries are ideal compost material"
    ],
    "Segregation allows recycling, composting and safe handling of hazardous waste.",
    [
      "WASTE-SEGREGATION-REASONING"
    ]
  ],
  [
    5,
    "Easy",
    "Unwanted excessive sound is called:",
    "Noise pollution",
    [
      "Air pollution",
      "Eutrophication",
      "Biomagnification"
    ],
    "Noise pollution is harmful or disturbing sound in the environment.",
    [
      "NOISE-POLLUTION-DEFINITION"
    ]
  ],
  [
    5,
    "Easy",
    "The intensity level of sound is commonly expressed in:",
    "Decibels",
    [
      "Metres",
      "Litres",
      "Kelvin"
    ],
    "Sound level is commonly measured on the decibel scale.",
    [
      "DECIBEL"
    ]
  ],
  [
    5,
    "Medium",
    "Long-term exposure to very loud noise can cause:",
    "Hearing damage",
    [
      "Improved night vision",
      "Higher soil fertility",
      "Ozone formation in the stratosphere"
    ],
    "Repeated exposure to intense sound can damage structures involved in hearing.",
    [
      "LOUD-NOISE-HEARING"
    ]
  ],
  [
    5,
    "Medium",
    "Which source commonly contributes to urban noise pollution?",
    "Traffic and horns",
    [
      "Photosynthesis",
      "Groundwater recharge",
      "Seed germination"
    ],
    "Road traffic, horns, machinery and construction are major urban noise sources.",
    [
      "URBAN-NOISE-TRAFFIC"
    ]
  ],
  [
    5,
    "Medium",
    "Why is night-time noise especially disruptive?",
    "It can interfere with sleep and recovery",
    [
      "It increases oxygen in blood",
      "It improves concentration for everyone",
      "It lowers sound intensity automatically"
    ],
    "Noise during normal sleeping hours can disturb sleep and affect health and well-being.",
    [
      "NIGHT-NOISE-SLEEP"
    ]
  ],
  [
    5,
    "Hard",
    "A school near a busy highway installs sound barriers and restricts honking nearby. Which principle is being used?",
    "Reduce noise transmission and control the source",
    [
      "Increase sound reflection into classrooms",
      "Convert noise into air pollution",
      "Raise traffic speed"
    ],
    "Noise control can act at the source and along the pathway between source and receiver.",
    [
      "NOISE-CONTROL-SOURCE-PATH"
    ]
  ]
] as const;
