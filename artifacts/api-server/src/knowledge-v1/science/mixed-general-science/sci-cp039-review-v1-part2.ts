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
    "A changing magnetic field can induce an electromotive force in a conductor. This principle, demonstrated by Faraday, is used in generators and transformers. Generators use this effect in reverse to convert mechanical motion into electricity.",
    [
      "MIX-INDUCTION"
    ]
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
    "A neutron is electrically neutral, while a proton has positive charge and an electron has negative charge. Neutrons are located in atomic nuclei. The balance between protons and electrons determines the atom's net charge.",
    [
      "MIX-NEUTRON"
    ]
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
    "Earthing gives fault current a safer path than through a person. The resulting current can also help a fuse or circuit breaker disconnect the supply quickly. Protective devices work best when earthing provides a safe fault-current path.",
    [
      "MIX-EARTHING"
    ]
  ],
  [
    4,
    "Easy",
    "What is the smallest particle of an element that still retains that element's chemical identity?",
    "atom",
    [
      "molecule of any compound",
      "cell",
      "ion only"
    ],
    "An atom is the basic chemical unit of an element. Atoms can combine to form molecules and compounds while still determining the identity of the element. Atoms combine in different arrangements to produce molecules and compounds.",
    [
      "MIX-ATOM"
    ]
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
    "In a combination reaction, reactants join to form a single product. Such reactions are common in basic chemistry and may release or absorb energy. A single product is the identifying feature of a simple combination reaction.",
    [
      "MIX-COMBINATION-REACTION"
    ]
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
    "Atomic number equals the number of protons in the nucleus. Changing the proton number changes the identity of the element itself. That proton count remains fixed even when the atom gains or loses electrons.",
    [
      "MIX-ATOMIC-NUMBER"
    ]
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
    "Rusting changes iron into new chemical compounds containing iron and oxygen. Because new substances form and the change is not easily reversed, it is chemical. Ordinary physical changes do not create a new chemical substance in this way.",
    [
      "MIX-RUST-CHEMICAL"
    ]
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
    "Isotopes belong to the same element because their proton number is the same. Different neutron numbers give them different mass numbers. This is why isotopes have similar chemistry but different masses.",
    [
      "MIX-ISOTOPES"
    ]
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
    "Losing electrons leaves more protons than electrons, producing a positive ion. Losing two electrons gives a net charge of plus two. Positive ions are also called cations and form when electrons are lost.",
    [
      "MIX-ION-LOSS-ELECTRONS"
    ]
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
    "On the usual pH scale, values below 7 are acidic and values above 7 are basic. A value near 7 is neutral under ordinary conditions. The pH scale gives a quick numerical way to compare acidity and basicity.",
    [
      "MIX-PH-ACID"
    ]
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
    "Galvanization coats iron or steel with zinc. The zinc layer protects the underlying iron from air and moisture and can also provide sacrificial protection. Zinc can protect iron even if the coating is scratched in a small area.",
    [
      "MIX-GALVANIZATION"
    ]
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
    "Soap reacts with calcium and magnesium ions to form insoluble scum. Synthetic detergents are less affected, so more of the cleaning agent remains available. This difference is why detergents are preferred in many hard-water regions.",
    [
      "MIX-DETERGENT-HARD-WATER"
    ]
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
    "Carbon can form four covalent bonds and bond with other carbon atoms. This catenation and tetravalency allow chains, rings and many different structures. These bonding abilities explain the enormous variety of organic compounds.",
    [
      "MIX-CARBON-CATENATION"
    ]
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
    "Acids react with carbonates to form a salt, water and carbon dioxide. The gas can often be recognized by effervescence and limewater testing. Carbon dioxide from this reaction can turn limewater milky.",
    [
      "MIX-ACID-CARBONATE"
    ]
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
    "Very reactive metals such as sodium react quickly with water and even moist air. Storing them under oil prevents contact with moisture and oxygen. Oil acts as a barrier that keeps water and air away from the metal.",
    [
      "MIX-REACTIVE-METAL-OIL"
    ]
  ]
] as const;
