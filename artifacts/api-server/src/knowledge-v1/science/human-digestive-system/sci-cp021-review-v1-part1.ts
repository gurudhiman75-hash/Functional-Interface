import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp021ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp021ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which organ is the first part of the human alimentary canal?",
    "Mouth",
    [
      "Stomach",
      "Small intestine",
      "Oesophagus"
    ],
    "Digestion begins in the mouth, where food is ingested, chewed and mixed with saliva before passing into the oesophagus.",
    [
      "DIGESTIVE-MOUTH-FIRST"
    ]
  ],
  [
    1,
    "Easy",
    "The process of taking food into the body through the mouth is called:",
    "Ingestion",
    [
      "Digestion",
      "Absorption",
      "Assimilation"
    ],
    "Ingestion means taking food into the body. Digestion, absorption and assimilation occur after food has been ingested.",
    [
      "DIGESTIVE-INGESTION"
    ]
  ],
  [
    1,
    "Medium",
    "Which sequence correctly shows the passage of food through the alimentary canal?",
    "Mouth → Oesophagus → Stomach → Small intestine → Large intestine",
    [
      "Mouth → Stomach → Oesophagus → Large intestine → Small intestine",
      "Mouth → Small intestine → Stomach → Oesophagus → Large intestine",
      "Mouth → Oesophagus → Large intestine → Stomach → Small intestine"
    ],
    "Food normally passes from the mouth to the oesophagus, then stomach, small intestine and large intestine before egestion.",
    [
      "DIGESTIVE-TRACT-ORDER"
    ]
  ],
  [
    1,
    "Medium",
    "Digestion mainly converts complex food substances into:",
    "Simpler soluble substances that can be absorbed",
    [
      "Insoluble substances that cannot cross the intestine",
      "Only water and mineral salts",
      "Large molecules that remain in the stomach"
    ],
    "Digestive enzymes break complex nutrients into smaller soluble molecules. These can then cross the intestinal wall and enter transport pathways.",
    [
      "DIGESTION-DEFINITION"
    ]
  ],
  [
    1,
    "Medium",
    "Mechanical digestion in the mouth is mainly carried out by:",
    "Chewing by the teeth",
    [
      "Bile secretion",
      "Pancreatic enzymes",
      "Absorption by villi"
    ],
    "Teeth physically break food into smaller pieces. This increases surface area and makes chemical digestion by enzymes more effective.",
    [
      "DIGESTION-MECHANICAL-CHEWING"
    ]
  ],
  [
    1,
    "Hard",
    "Why does breaking food into smaller pieces generally speed up chemical digestion?",
    "It increases the surface area available to enzymes",
    [
      "It changes proteins directly into amino acids",
      "It removes the need for digestive juices",
      "It prevents food from reaching the stomach"
    ],
    "Smaller pieces expose more surface area to digestive enzymes. This allows enzymes to act on food more efficiently.",
    [
      "DIGESTION-SURFACE-AREA"
    ]
  ],
  [
    2,
    "Easy",
    "Which type of teeth is mainly used for cutting and biting food?",
    "Incisors",
    [
      "Canines",
      "Premolars",
      "Molars"
    ],
    "Incisors are the front teeth with sharp edges used mainly for cutting and biting food.",
    [
      "TEETH-INCISORS"
    ]
  ],
  [
    2,
    "Easy",
    "Which teeth are mainly adapted for grinding food?",
    "Molars",
    [
      "Incisors",
      "Canines",
      "Milk incisors only"
    ],
    "Molars have broad surfaces suited for crushing and grinding food during chewing.",
    [
      "TEETH-MOLARS"
    ]
  ],
  [
    2,
    "Medium",
    "Salivary amylase begins the digestion of:",
    "Starch",
    [
      "Proteins",
      "Fats",
      "Vitamins"
    ],
    "Salivary amylase acts on starch in the mouth and begins converting it into simpler sugars.",
    [
      "SALIVA-AMYLASE-STARCH"
    ]
  ],
  [
    2,
    "Medium",
    "One important function of saliva is to:",
    "Moisten food and help in swallowing",
    [
      "Emulsify fats like bile",
      "Digest all proteins completely",
      "Absorb amino acids into blood"
    ],
    "Saliva moistens and lubricates food, helping form a soft bolus that can be swallowed easily.",
    [
      "SALIVA-MOISTEN"
    ]
  ],
  [
    2,
    "Medium",
    "The tongue helps digestion mainly by:",
    "Mixing food with saliva and helping swallowing",
    [
      "Producing bile",
      "Absorbing digested fats",
      "Secreting pancreatic juice"
    ],
    "The tongue moves food during chewing, mixes it with saliva, helps form a bolus and pushes it toward the pharynx for swallowing.",
    [
      "TONGUE-DIGESTION"
    ]
  ],
  [
    2,
    "Hard",
    "If salivary amylase is absent but the rest of the digestive system is normal, digestion of starch will:",
    "Begin later mainly in the small intestine",
    [
      "Stop completely throughout the digestive tract",
      "Be completed only in the stomach",
      "Be replaced by protein digestion"
    ],
    "Salivary amylase normally starts starch digestion in the mouth. Pancreatic amylase can still digest starch later in the small intestine.",
    [
      "SALIVA-AMYLASE-ABSENCE"
    ]
  ],
  [
    3,
    "Easy",
    "Food is pushed through the oesophagus mainly by:",
    "Peristalsis",
    [
      "Diffusion",
      "Filtration",
      "Transpiration"
    ],
    "Peristalsis is the wave-like contraction of muscles in the alimentary canal that moves food forward.",
    [
      "OESOPHAGUS-PERISTALSIS"
    ]
  ],
  [
    3,
    "Easy",
    "Which acid is normally present in gastric juice?",
    "Hydrochloric acid",
    [
      "Sulphuric acid",
      "Nitric acid",
      "Acetic acid"
    ],
    "The stomach secretes hydrochloric acid. It creates an acidic medium and helps activate protein-digesting enzymes.",
    [
      "STOMACH-HCL"
    ]
  ],
  [
    3,
    "Medium",
    "Which enzyme begins the digestion of proteins in the stomach?",
    "Pepsin",
    [
      "Amylase",
      "Lipase",
      "Maltase"
    ],
    "Pepsin is a protein-digesting enzyme that works effectively in the acidic environment of the stomach.",
    [
      "STOMACH-PEPSIN"
    ]
  ]
] as const;
