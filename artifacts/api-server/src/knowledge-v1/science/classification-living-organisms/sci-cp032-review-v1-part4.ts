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
    "Snails are molluscs, generally characterized by a soft body and muscular foot. Many molluscs also possess a mantle and, in some groups, a hard shell.",
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
    "Starfish are echinoderms with spiny skin and a water vascular system. Adult echinoderms also show radial organization and are exclusively marine animals.",
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
    "Jointed appendages together with an exoskeleton are defining features of arthropods. Jointed limbs are the strongest clue because they are a defining feature of Arthropoda.",
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
    "Chordates possess a notochord at least during some stage of development. Other chordate features include a dorsal hollow nerve cord and pharyngeal slits at some developmental stage.",
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
    "Birds belong to Aves and feathers are their distinctive external covering. Feathers are unique among living vertebrates and are strongly linked with the bird body plan.",
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
    "Mammals possess hair and females have mammary glands that produce milk. Milk production for young is the defining feature reflected in the name Mammalia.",
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
    "Amphibians typically spend part of their life in water and part on land. The aquatic larval stage and more terrestrial adult stage explain the name amphibian.",
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
    "Feathers and wings are defining bird features, placing the animal in Aves. Feathers provide the clearest classification clue even when other features such as egg laying occur elsewhere too.",
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
    "Moist skin and a life cycle involving aquatic larvae and more terrestrial adults are characteristic of amphibians. This combination of aquatic development and terrestrial adulthood is characteristic of the amphibian life cycle.",
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
    "Pine is a gymnosperm, a seed plant with exposed seeds and no fruits. Pine is correctly placed because gymnosperms are seed plants whose seeds are not enclosed in fruits.",
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
    "This sequence broadly moves from non-vascular plants to vascular spore plants and then seed plants. The sequence also reflects increasing specialization of vascular and reproductive structures.",
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
    "Protista contains many unicellular eukaryotes, while Monera contains prokaryotes. The true nucleus rules out Monera and makes Protista the best first placement for a unicellular eukaryote.",
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
    "Earthworms are segmented worms belonging to Annelida. Segmentation is the key feature linking earthworms with other members of Annelida. This classification is supported by the earthworm's repeated body segmentation.",
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
    "The organism is a plant, and flowers/fruits with enclosed seeds identify it as an angiosperm. Seed enclosure within fruit is the decisive feature that places the plant among angiosperms.",
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
    "Absence of a backbone makes it an invertebrate, while jointed legs and segmentation identify Arthropoda. The jointed appendages identify the arthropod group even before a more specific class is determined.",
    [
      "INTEGRATED-ARTHROPOD"
    ]
  ]
] as const;
