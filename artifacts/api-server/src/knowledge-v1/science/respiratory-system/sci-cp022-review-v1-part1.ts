import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp022ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp022ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which organ system is mainly responsible for taking in oxygen and removing carbon dioxide?",
    "Respiratory system",
    [
      "Digestive system",
      "Excretory system",
      "Endocrine system"
    ],
    "The respiratory system brings oxygen into the body and removes carbon dioxide produced during cellular respiration.",
    [
      "RESPIRATORY-SYSTEM-FUNCTION"
    ]
  ],
  [
    1,
    "Easy",
    "Air normally enters the human respiratory tract first through the:",
    "Nose",
    [
      "Lungs",
      "Trachea",
      "Bronchi"
    ],
    "Air usually enters through the nose, where it is filtered, warmed and moistened before passing deeper into the respiratory tract.",
    [
      "RESPIRATORY-AIR-ENTRY"
    ]
  ],
  [
    1,
    "Medium",
    "Which sequence correctly shows the path of inhaled air?",
    "Nose → Pharynx → Larynx → Trachea → Bronchi → Lungs",
    [
      "Nose → Trachea → Pharynx → Larynx → Bronchi → Lungs",
      "Nose → Larynx → Pharynx → Bronchi → Trachea → Lungs",
      "Nose → Bronchi → Trachea → Pharynx → Larynx → Lungs"
    ],
    "Inhaled air passes through the nose, pharynx, larynx and trachea before entering the bronchi and lungs.",
    [
      "RESPIRATORY-AIR-PATH"
    ]
  ],
  [
    1,
    "Medium",
    "Breathing differs from cellular respiration because breathing is:",
    "The physical movement of air into and out of the lungs",
    [
      "The breakdown of glucose inside cells",
      "The production of ATP only in mitochondria",
      "The digestion of carbohydrates in the intestine"
    ],
    "Breathing is ventilation of the lungs. Cellular respiration is the chemical release of energy from food inside cells.",
    [
      "BREATHING-VS-RESPIRATION"
    ]
  ],
  [
    1,
    "Medium",
    "The main purpose of breathing is to:",
    "Bring fresh air to the lungs and remove carbon-dioxide-rich air",
    [
      "Digest proteins",
      "Filter metabolic wastes from blood",
      "Produce digestive enzymes"
    ],
    "Breathing renews air in the lungs so oxygen can enter the blood and carbon dioxide can leave it.",
    [
      "BREATHING-PURPOSE"
    ]
  ],
  [
    1,
    "Hard",
    "If airflow is completely blocked in the trachea, which process is affected first?",
    "Movement of air to and from the lungs",
    [
      "Absorption of glucose from the intestine",
      "Filtration of blood in the kidney",
      "Bile secretion by the liver"
    ],
    "The trachea is the main airway between the larynx and bronchi. Blocking it prevents ventilation of the lungs.",
    [
      "TRACHEA-BLOCKAGE"
    ]
  ],
  [
    2,
    "Easy",
    "Nasal hairs mainly help by:",
    "Filtering larger dust particles from inhaled air",
    [
      "Warming inhaled air",
      "Moistening inhaled air",
      "Producing mucus"
    ],
    "Nasal hairs trap many larger particles before air moves deeper into the respiratory tract.",
    [
      "NOSE-HAIRS-FILTER"
    ]
  ],
  [
    2,
    "Easy",
    "The larynx is commonly known as the:",
    "Voice box",
    [
      "Windpipe",
      "Food pipe",
      "Air sac"
    ],
    "The larynx contains the vocal cords and is therefore commonly called the voice box.",
    [
      "LARYNX-VOICE-BOX"
    ]
  ],
  [
    2,
    "Medium",
    "The epiglottis helps prevent food from entering the:",
    "Trachea",
    [
      "Oesophagus",
      "Stomach",
      "Small intestine"
    ],
    "During swallowing, the epiglottis helps cover the opening of the windpipe so food is directed into the oesophagus.",
    [
      "EPIGLOTTIS-TRACHEA"
    ]
  ],
  [
    2,
    "Medium",
    "C-shaped cartilage rings in the trachea mainly prevent it from:",
    "Collapsing during breathing",
    [
      "Absorbing oxygen",
      "Producing mucus",
      "Dividing into bronchioles"
    ],
    "Cartilage supports the tracheal wall and helps keep the airway open as pressure changes during breathing.",
    [
      "TRACHEA-CARTILAGE"
    ]
  ],
  [
    2,
    "Medium",
    "Mucus and cilia in the respiratory passages work together mainly to:",
    "Trap particles and move them away from the lungs",
    [
      "Carry oxygen in blood",
      "Produce carbon dioxide",
      "Expand the alveoli"
    ],
    "Mucus traps dust and microbes, while cilia move the mucus toward the throat for removal.",
    [
      "RESPIRATORY-MUCUS-CILIA"
    ]
  ],
  [
    2,
    "Hard",
    "Long-term damage to cilia lining the airways would most directly cause:",
    "Reduced clearance of dust and mucus from the respiratory tract",
    [
      "Loss of haemoglobin from red blood cells",
      "Failure of the diaphragm to contract",
      "Complete loss of alveolar surface area"
    ],
    "Cilia normally sweep trapped particles and mucus upward. Damaged cilia reduce this cleaning mechanism.",
    [
      "CILIA-DAMAGE"
    ]
  ],
  [
    3,
    "Easy",
    "The two main organs of the human respiratory system are the:",
    "Lungs",
    [
      "Kidneys",
      "Liver lobes",
      "Salivary glands"
    ],
    "The lungs contain the branching airways and alveoli where gas exchange occurs.",
    [
      "LUNGS-MAIN-ORGANS"
    ]
  ],
  [
    3,
    "Easy",
    "The trachea divides into two main tubes called:",
    "Bronchi",
    [
      "Alveoli",
      "Villi",
      "Nephrons"
    ],
    "The trachea divides into right and left primary bronchi, each entering a lung.",
    [
      "TRACHEA-BRONCHI"
    ]
  ],
  [
    3,
    "Medium",
    "Gas exchange in the lungs occurs mainly in the:",
    "Alveoli",
    [
      "Trachea",
      "Larynx",
      "Nasal cavity"
    ],
    "Alveoli are tiny air sacs surrounded by capillaries. Their thin walls allow rapid exchange of oxygen and carbon dioxide.",
    [
      "ALVEOLI-GAS-EXCHANGE"
    ]
  ]
] as const;
