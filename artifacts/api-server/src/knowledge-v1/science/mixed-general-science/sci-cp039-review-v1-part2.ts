import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp039ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp039ReviewSpec[] = [
  [
    3,
    "Medium",
    "Electromagnetic induction is the production of current by:",
    "a changing magnetic field",
    [
      "a constant temperature",
      "sound reflection",
      "chemical neutralization"
    ],
    "A changing magnetic field can induce an electromotive force in a conductor. This principle, demonstrated by Faraday, is used in generators and transformers.",
    "MIX-INDUCTION"
  ],
  [
    3,
    "Medium",
    "Which particle has no electric charge?",
    "neutron",
    [
      "electron",
      "proton",
      "positron"
    ],
    "A neutron is electrically neutral, while a proton has positive charge and an electron has negative charge. Neutrons are located in atomic nuclei.",
    "MIX-NEUTRON"
  ],
  [
    3,
    "Hard",
    "An electrical appliance has a metal body connected to earth. Why is this useful during a fault?",
    "Fault current gets a low-resistance path to ground and can trigger protection",
    [
      "The appliance voltage increases",
      "The metal body becomes an insulator",
      "The current is stored in the earth wire"
    ],
    "Earthing gives fault current a safer path than through a person. The resulting current can also help a fuse or circuit breaker disconnect the supply quickly.",
    "MIX-EARTHING"
  ],
  [
    4,
    "Easy",
    "The smallest unit of an element that retains its chemical identity is an:",
    "atom",
    [
      "molecule of any compound",
      "cell",
      "ion only"
    ],
    "An atom is the basic chemical unit of an element. Atoms can combine to form molecules and compounds while still determining the identity of the element.",
    "MIX-ATOM"
  ],
  [
    4,
    "Easy",
    "A chemical reaction in which two or more substances form one product is a:",
    "combination reaction",
    [
      "decomposition reaction",
      "displacement reaction",
      "neutralization only"
    ],
    "In a combination reaction, reactants join to form a single product. Such reactions are common in basic chemistry and may release or absorb energy.",
    "MIX-COMBINATION-REACTION"
  ],
  [
    4,
    "Medium",
    "Which subatomic particle determines the atomic number of an element?",
    "proton",
    [
      "neutron",
      "electron in every ion",
      "photon"
    ],
    "Atomic number equals the number of protons in the nucleus. Changing the proton number changes the identity of the element itself.",
    "MIX-ATOMIC-NUMBER"
  ],
  [
    4,
    "Medium",
    "Why is rusting considered a chemical change?",
    "Iron forms new substances such as iron oxides",
    [
      "Only the shape changes",
      "No new substance forms",
      "Rusting is just melting"
    ],
    "Rusting changes iron into new chemical compounds containing iron and oxygen. Because new substances form and the change is not easily reversed, it is chemical.",
    "MIX-RUST-CHEMICAL"
  ],
  [
    4,
    "Medium",
    "Which statement about isotopes is correct?",
    "They have the same proton number but different neutron numbers",
    [
      "They have different proton numbers",
      "They are different elements by definition",
      "They always have identical mass numbers"
    ],
    "Isotopes belong to the same element because their proton number is the same. Different neutron numbers give them different mass numbers.",
    "MIX-ISOTOPES"
  ],
  [
    4,
    "Hard",
    "A neutral atom loses two electrons. What is formed?",
    "A positively charged ion with charge +2",
    [
      "A neutral isotope",
      "A negatively charged ion",
      "A neutron"
    ],
    "Losing electrons leaves more protons than electrons, producing a positive ion. Losing two electrons gives a net charge of plus two.",
    "MIX-ION-LOSS-ELECTRONS"
  ],
  [
    5,
    "Easy",
    "A solution with pH below 7 is generally:",
    "acidic",
    [
      "basic",
      "neutral",
      "always salty"
    ],
    "On the usual pH scale, values below 7 are acidic and values above 7 are basic. A value near 7 is neutral under ordinary conditions.",
    "MIX-PH-ACID"
  ],
  [
    5,
    "Easy",
    "Which metal is commonly protected from rusting by galvanization with zinc?",
    "iron",
    [
      "gold",
      "platinum",
      "mercury"
    ],
    "Galvanization coats iron or steel with zinc. The zinc layer protects the underlying iron from air and moisture and can also provide sacrificial protection.",
    "MIX-GALVANIZATION"
  ],
  [
    5,
    "Medium",
    "Why do detergents work better than soap in hard water?",
    "They form less insoluble scum with calcium and magnesium ions",
    [
      "They contain no ions",
      "Hard water has no minerals",
      "Soap becomes acidic"
    ],
    "Soap reacts with calcium and magnesium ions to form insoluble scum. Synthetic detergents are less affected, so more of the cleaning agent remains available.",
    "MIX-DETERGENT-HARD-WATER"
  ],
  [
    5,
    "Medium",
    "Carbon forms a very large number of compounds largely because it is:",
    "tetravalent and can form chains",
    [
      "chemically inert in all cases",
      "a noble gas",
      "always ionic"
    ],
    "Carbon can form four covalent bonds and bond with other carbon atoms. This catenation and tetravalency allow chains, rings and many different structures.",
    "MIX-CARBON-CATENATION"
  ],
  [
    5,
    "Medium",
    "Which gas is produced when a typical acid reacts with a carbonate?",
    "carbon dioxide",
    [
      "oxygen",
      "nitrogen",
      "hydrogen chloride"
    ],
    "Acids react with carbonates to form a salt, water and carbon dioxide. The gas can often be recognized by effervescence and limewater testing.",
    "MIX-ACID-CARBONATE"
  ],
  [
    5,
    "Hard",
    "A metal reacts vigorously with water and is stored under oil. Which type of metal best fits this behavior?",
    "A very reactive metal such as sodium",
    [
      "A noble metal such as gold",
      "Copper only",
      "Silver only"
    ],
    "Very reactive metals such as sodium react quickly with water and even moist air. Storing them under oil prevents contact with moisture and oxygen.",
    "MIX-REACTIVE-METAL-OIL"
  ]
] as const;
