import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp033ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp033ReviewSpec[] = [
  [
    1,
    "Easy",
    "The study of interactions between organisms and their environment is called:",
    "Ecology",
    [
      "Taxonomy",
      "Anatomy",
      "Genetics"
    ],
    "Ecology studies how organisms interact with one another and with the physical environment.",
    [
      "ECOLOGY-DEFINITION"
    ]
  ],
  [
    1,
    "Easy",
    "The place where an organism normally lives is its:",
    "Habitat",
    [
      "Niche",
      "Community",
      "Trophic level"
    ],
    "A habitat is the physical place or environment in which an organism lives.",
    [
      "HABITAT-DEFINITION"
    ]
  ],
  [
    1,
    "Medium",
    "An ecosystem includes:",
    "Living organisms and the non-living environment interacting together",
    [
      "Only plants in an area",
      "Only animals in an area",
      "Only soil and water"
    ],
    "An ecosystem consists of biotic communities interacting with abiotic factors such as water, soil, light and temperature.",
    [
      "ECOSYSTEM-DEFINITION"
    ]
  ],
  [
    1,
    "Medium",
    "A group of populations of different species living in the same area forms a:",
    "Community",
    [
      "Species",
      "Organism",
      "Habitat"
    ],
    "A community includes all the populations of different species living and interacting in one area.",
    [
      "COMMUNITY-DEFINITION"
    ]
  ],
  [
    1,
    "Medium",
    "Which statement best distinguishes habitat from niche?",
    "Habitat is where an organism lives; niche describes its role and use of resources",
    [
      "Habitat and niche mean exactly the same thing",
      "Niche refers only to climate",
      "Habitat refers only to food"
    ],
    "Habitat describes place, while niche includes the organism's functional role, resource use and interactions.",
    [
      "HABITAT-VS-NICHE"
    ]
  ],
  [
    1,
    "Hard",
    "Two bird species live in the same forest but eat different foods and nest at different heights. Which statement is most accurate?",
    "They share a habitat but occupy different ecological niches",
    [
      "They must belong to different ecosystems",
      "They have identical niches",
      "They cannot interact"
    ],
    "The forest is their shared habitat, while differences in food use and nesting position indicate different niches.",
    [
      "SHARED-HABITAT-DIFFERENT-NICHE"
    ]
  ],
  [
    2,
    "Easy",
    "Which of the following is an abiotic factor?",
    "Temperature",
    [
      "Grass",
      "Rabbit",
      "Bacteria"
    ],
    "Temperature is a non-living physical component of the environment.",
    [
      "ABIOTIC-TEMPERATURE"
    ]
  ],
  [
    2,
    "Easy",
    "Which of the following is a biotic component of an ecosystem?",
    "Fungi",
    [
      "Sunlight",
      "Soil pH",
      "Rainfall"
    ],
    "Fungi are living organisms and therefore part of the biotic component.",
    [
      "BIOTIC-FUNGI"
    ]
  ],
  [
    2,
    "Medium",
    "Which abiotic factor directly provides energy for photosynthesis?",
    "Sunlight",
    [
      "Wind speed only",
      "Soil texture only",
      "Humidity only"
    ],
    "Sunlight supplies the energy captured by photosynthetic organisms.",
    [
      "SUNLIGHT-PHOTOSYNTHESIS"
    ]
  ],
  [
    2,
    "Medium",
    "Soil pH can affect plant growth because it influences:",
    "Availability of mineral nutrients",
    [
      "The number of chromosomes in plants",
      "The speed of light",
      "The species name of the plant"
    ],
    "Soil pH affects the chemical form and availability of many nutrients to plant roots.",
    [
      "SOIL-PH-NUTRIENTS"
    ]
  ],
  [
    2,
    "Medium",
    "A sudden fall in rainfall most directly changes which ecosystem component first?",
    "An abiotic factor",
    [
      "A species name",
      "A taxonomic rank",
      "A chromosome number"
    ],
    "Rainfall is an abiotic factor, and changes in it can later affect living populations.",
    [
      "RAINFALL-ABIOTIC"
    ]
  ],
  [
    2,
    "Hard",
    "A pond becomes warmer and its dissolved oxygen falls, causing fish numbers to decline. Which explanation best describes the sequence?",
    "An abiotic change altered conditions for a biotic population",
    [
      "A taxonomic change caused warming",
      "Fish changed the temperature before oxygen changed",
      "The habitat became a new kingdom"
    ],
    "Temperature and dissolved oxygen are abiotic factors; changes in them can directly affect fish survival.",
    [
      "ABIOTIC-CHANGE-BIOTIC-EFFECT"
    ]
  ],
  [
    3,
    "Easy",
    "Green plants are called producers because they:",
    "Make organic food using light energy",
    [
      "Feed only on animals",
      "Break down dead matter",
      "Obtain energy only from soil"
    ],
    "Producers convert light energy into chemical energy through photosynthesis.",
    [
      "PRODUCER-DEFINITION"
    ]
  ],
  [
    3,
    "Easy",
    "Organisms that obtain energy by eating other organisms are called:",
    "Consumers",
    [
      "Producers",
      "Abiotic factors",
      "Minerals"
    ],
    "Consumers depend directly or indirectly on producers for food energy.",
    [
      "CONSUMER-DEFINITION"
    ]
  ],
  [
    3,
    "Medium",
    "Which organisms are most important in breaking down dead organic matter?",
    "Decomposers",
    [
      "Primary producers only",
      "Top predators only",
      "Herbivores only"
    ],
    "Decomposers such as many bacteria and fungi break dead material into simpler substances.",
    [
      "DECOMPOSERS-ROLE"
    ]
  ]
] as const;
