import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp032ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp032ReviewSpec[] = [
  [
    6,
    "Easy",
    "Seeds of gymnosperms are described as naked because they:",
    "Are not enclosed within a fruit",
    [
      "Have no seed coat",
      "Contain no embryo",
      "Are produced without fertilization"
    ],
    "Gymnosperm seeds are exposed on structures such as cones rather than enclosed inside fruits.",
    [
      "GYMNOSPERM-NAKED-SEEDS"
    ]
  ],
  [
    6,
    "Easy",
    "Which plant group produces flowers and fruits?",
    "Angiosperms",
    [
      "Bryophytes",
      "Pteridophytes",
      "Gymnosperms"
    ],
    "Angiosperms are flowering plants whose seeds develop within fruits.",
    [
      "ANGIOSPERMS-FLOWERS-FRUITS"
    ]
  ],
  [
    6,
    "Medium",
    "Pine is an example of a:",
    "Gymnosperm",
    [
      "Angiosperm",
      "Bryophyte",
      "Pteridophyte"
    ],
    "Pines are cone-bearing gymnosperms with naked seeds.",
    [
      "PINE-GYMNOSPERM"
    ]
  ],
  [
    6,
    "Medium",
    "Mango is classified as an angiosperm because it:",
    "Produces flowers and seeds enclosed in fruit",
    [
      "Reproduces only by spores",
      "Has naked seeds in cones",
      "Lacks vascular tissue"
    ],
    "Mango is a flowering plant, and its seeds are enclosed within a fruit.",
    [
      "MANGO-ANGIOSPERM"
    ]
  ],
  [
    6,
    "Medium",
    "Which feature distinguishes angiosperms from gymnosperms?",
    "Seeds are enclosed within fruits",
    [
      "Presence of vascular tissue",
      "Presence of roots",
      "Presence of chlorophyll"
    ],
    "Both groups are vascular seed plants, but only angiosperms enclose seeds within fruits.",
    [
      "ANGIOSPERM-VS-GYMNOSPERM"
    ]
  ],
  [
    6,
    "Hard",
    "A plant is vascular, produces pollen and seeds, but has no flowers or fruits. It is most likely a:",
    "Gymnosperm",
    [
      "Bryophyte",
      "Pteridophyte",
      "Angiosperm"
    ],
    "A seed plant without flowers or fruits, with exposed seeds, is characteristic of gymnosperms.",
    [
      "IDENTIFY-GYMNOSPERM"
    ]
  ],
  [
    7,
    "Easy",
    "Animals are generally characterized by being:",
    "Multicellular heterotrophs without cell walls",
    [
      "Prokaryotic autotrophs",
      "Unicellular plants",
      "Fungi with chitin walls"
    ],
    "Animal cells lack cell walls and animals obtain food heterotrophically.",
    [
      "ANIMALIA-BASIC-FEATURES"
    ]
  ],
  [
    7,
    "Easy",
    "Which feature is used to classify many animals into major groups?",
    "Body plan and symmetry",
    [
      "Blood group only",
      "Colour alone",
      "Daily food intake only"
    ],
    "Animal classification uses structural features such as symmetry, body organization and presence of specialized tissues.",
    [
      "ANIMAL-CLASSIFICATION-FEATURES"
    ]
  ],
  [
    7,
    "Medium",
    "An animal with radial symmetry has body parts arranged:",
    "Around a central axis",
    [
      "Only on the left side",
      "In identical head and tail halves",
      "Without any pattern"
    ],
    "Radial symmetry means similar body parts are arranged around a central axis.",
    [
      "RADIAL-SYMMETRY"
    ]
  ],
  [
    7,
    "Medium",
    "Bilateral symmetry means the body can be divided into:",
    "Two similar right and left halves by one plane",
    [
      "Many identical sectors around an axis",
      "No comparable halves",
      "Upper and lower halves only in every plane"
    ],
    "Bilaterally symmetrical animals have a single plane that produces comparable right and left halves.",
    [
      "BILATERAL-SYMMETRY"
    ]
  ],
  [
    7,
    "Medium",
    "Which feature is characteristic of most animals?",
    "They obtain organic food from other organisms",
    [
      "They all have chloroplasts",
      "They all have cell walls",
      "They all reproduce by spores"
    ],
    "Animals are heterotrophic and obtain nutrients by consuming or otherwise taking in organic matter.",
    [
      "ANIMAL-HETEROTROPHIC"
    ]
  ],
  [
    7,
    "Hard",
    "An organism is multicellular, motile at some life stage, lacks cell walls and ingests food. It is best placed in:",
    "Animalia",
    [
      "Plantae",
      "Fungi",
      "Monera"
    ],
    "Multicellularity, ingestion of food and absence of cell walls are characteristic of animals.",
    [
      "IDENTIFY-ANIMALIA"
    ]
  ],
  [
    8,
    "Easy",
    "Sponges belong to the phylum:",
    "Porifera",
    [
      "Arthropoda",
      "Mollusca",
      "Annelida"
    ],
    "Porifera includes sponges, which have numerous pores in their bodies.",
    [
      "PORIFERA-SPONGES"
    ]
  ],
  [
    8,
    "Easy",
    "Animals with jointed appendages and an exoskeleton belong to:",
    "Arthropoda",
    [
      "Mollusca",
      "Annelida",
      "Cnidaria"
    ],
    "Arthropods are characterized by jointed limbs and a chitinous exoskeleton.",
    [
      "ARTHROPODA-JOINTED-APPENDAGES"
    ]
  ],
  [
    8,
    "Medium",
    "Earthworm belongs to the phylum:",
    "Annelida",
    [
      "Nematoda",
      "Mollusca",
      "Echinodermata"
    ],
    "Earthworms are segmented worms and belong to Annelida.",
    [
      "EARTHWORM-ANNELIDA"
    ]
  ]
] as const;
