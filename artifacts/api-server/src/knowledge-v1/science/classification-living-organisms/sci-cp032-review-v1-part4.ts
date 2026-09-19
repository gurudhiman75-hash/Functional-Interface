import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp032ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp032ReviewSpec[] = [
  [
    8,
    "Medium",
    "Snail belongs to the phylum:",
    "Mollusca",
    [
      "Arthropoda",
      "Porifera",
      "Cnidaria"
    ],
    "Snails are molluscs, generally characterized by a soft body and muscular foot.",
    [
      "SNAIL-MOLLUSCA"
    ]
  ],
  [
    8,
    "Medium",
    "Starfish belongs to:",
    "Echinodermata",
    [
      "Cnidaria",
      "Platyhelminthes",
      "Nematoda"
    ],
    "Starfish are echinoderms with spiny skin and a water vascular system.",
    [
      "STARFISH-ECHINODERMATA"
    ]
  ],
  [
    8,
    "Hard",
    "An animal has a segmented body, paired jointed legs and a hard external skeleton. Which phylum fits best?",
    "Arthropoda",
    [
      "Annelida",
      "Mollusca",
      "Porifera"
    ],
    "Jointed appendages together with an exoskeleton are defining features of arthropods.",
    [
      "IDENTIFY-ARTHROPOD"
    ]
  ],
  [
    9,
    "Easy",
    "A defining feature of chordates is the presence of a:",
    "Notochord at least at some stage",
    [
      "Chitinous exoskeleton",
      "Water vascular system",
      "Pseudopodia"
    ],
    "Chordates possess a notochord at least during some stage of development.",
    [
      "CHORDATE-NOTOCHORD"
    ]
  ],
  [
    9,
    "Medium",
    "Which vertebrate class is characterized by feathers?",
    "Aves",
    [
      "Mammalia",
      "Reptilia",
      "Amphibia"
    ],
    "Birds belong to Aves and feathers are their distinctive external covering.",
    [
      "AVES-FEATHERS"
    ]
  ],
  [
    9,
    "Medium",
    "Which vertebrate group typically has hair and mammary glands?",
    "Mammalia",
    [
      "Aves",
      "Reptilia",
      "Pisces"
    ],
    "Mammals possess hair and females have mammary glands that produce milk.",
    [
      "MAMMALIA-HAIR-MAMMARY"
    ]
  ],
  [
    9,
    "Medium",
    "Frogs belong to Amphibia because they:",
    "Have life stages associated with both water and land",
    [
      "Have feathers",
      "Have dry scales and never depend on water",
      "Have mammary glands"
    ],
    "Amphibians typically spend part of their life in water and part on land.",
    [
      "FROG-AMPHIBIA"
    ]
  ],
  [
    9,
    "Hard",
    "An animal has feathers, a beak, forelimbs modified as wings and lays hard-shelled eggs. It belongs to:",
    "Aves",
    [
      "Mammalia",
      "Reptilia",
      "Amphibia"
    ],
    "Feathers and wings are defining bird features, placing the animal in Aves.",
    [
      "IDENTIFY-AVES"
    ]
  ],
  [
    9,
    "Hard",
    "A vertebrate has moist skin, an aquatic larval stage and an adult that can live on land. It is best classified as:",
    "Amphibia",
    [
      "Reptilia",
      "Mammalia",
      "Aves"
    ],
    "Moist skin and a life cycle involving aquatic larvae and more terrestrial adults are characteristic of amphibians.",
    [
      "IDENTIFY-AMPHIBIA"
    ]
  ],
  [
    10,
    "Easy",
    "Which plant group–example pair is correctly matched?",
    "Pine — Gymnosperm",
    [
      "Moss — Angiosperm",
      "Fern — Bryophyte",
      "Mango — Pteridophyte"
    ],
    "Pine is a gymnosperm, a seed plant with exposed seeds and no fruits.",
    [
      "MATCH-PINE-GYMNOSPERM"
    ]
  ],
  [
    10,
    "Medium",
    "Which sequence shows increasing complexity among these plant groups?",
    "Bryophytes → Pteridophytes → Gymnosperms → Angiosperms",
    [
      "Angiosperms → Bryophytes → Pteridophytes → Gymnosperms",
      "Pteridophytes → Bryophytes → Angiosperms → Gymnosperms",
      "Gymnosperms → Angiosperms → Bryophytes → Pteridophytes"
    ],
    "This sequence broadly moves from non-vascular plants to vascular spore plants and then seed plants.",
    [
      "PLANT-GROUP-SEQUENCE"
    ]
  ],
  [
    10,
    "Medium",
    "An organism has a true nucleus, is unicellular and is not a bacterium. Which kingdom is the first likely choice in the five-kingdom framework?",
    "Protista",
    [
      "Monera",
      "Plantae",
      "Animalia"
    ],
    "Protista contains many unicellular eukaryotes, while Monera contains prokaryotes.",
    [
      "UNICELLULAR-EUKARYOTE-PROTISTA"
    ]
  ],
  [
    10,
    "Medium",
    "Which combination correctly matches organism and group?",
    "Earthworm — Annelida",
    [
      "Snail — Arthropoda",
      "Starfish — Mollusca",
      "Sponge — Echinodermata"
    ],
    "Earthworms are segmented worms belonging to Annelida.",
    [
      "MATCH-EARTHWORM-ANNELIDA"
    ]
  ],
  [
    10,
    "Hard",
    "An organism is multicellular, photosynthetic, vascular and produces seeds inside fruits. Which classification is best?",
    "Plantae → Angiosperm",
    [
      "Fungi → Gymnosperm",
      "Plantae → Pteridophyte",
      "Protista → Angiosperm"
    ],
    "The organism is a plant, and flowers/fruits with enclosed seeds identify it as an angiosperm.",
    [
      "INTEGRATED-ANGIOSPERM"
    ]
  ],
  [
    10,
    "Hard",
    "An animal lacks a backbone, has jointed legs and a segmented body. Which conclusion is most appropriate?",
    "It is an invertebrate arthropod",
    [
      "It is a vertebrate annelid",
      "It is a mollusc because all invertebrates are molluscs",
      "It must be an amphibian"
    ],
    "Absence of a backbone makes it an invertebrate, while jointed legs and segmentation identify Arthropoda.",
    [
      "INTEGRATED-ARTHROPOD"
    ]
  ]
] as const;
