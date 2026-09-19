import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp022ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp022ReviewSpec[] = [
  [
    8,
    "Medium",
    "Holding the breath for a long time becomes difficult mainly because:",
    "Carbon dioxide builds up in the blood",
    [
      "All nitrogen leaves the body",
      "The stomach becomes acidic",
      "The kidneys stop filtering"
    ],
    "Rising carbon dioxide strongly stimulates the urge to breathe. Oxygen also falls, but carbon dioxide accumulation is an important immediate signal.",
    [
      "BREATH-HOLD-CO2"
    ]
  ],
  [
    8,
    "Medium",
    "At high altitude, breathing often becomes faster because:",
    "The partial pressure of oxygen is lower",
    [
      "Air contains no nitrogen",
      "Carbon dioxide concentration is extremely high",
      "The lungs become smaller immediately"
    ],
    "At high altitude the atmospheric pressure, and therefore oxygen partial pressure, is lower. Faster breathing helps increase oxygen uptake.",
    [
      "ALTITUDE-LOW-OXYGEN"
    ]
  ],
  [
    8,
    "Hard",
    "A person travels rapidly from sea level to a high mountain. Which immediate response helps compensate for the lower oxygen availability?",
    "Increased breathing rate",
    [
      "Complete closure of the trachea",
      "Reduced ventilation",
      "Stopping red blood cell circulation"
    ],
    "One rapid response to high altitude is increased ventilation, which brings more air into the lungs and helps maintain oxygen uptake.",
    [
      "ALTITUDE-VENTILATION"
    ]
  ],
  [
    9,
    "Easy",
    "Compared with inhaled air, exhaled air contains more:",
    "Carbon dioxide",
    [
      "Oxygen",
      "Nitrogen by a very large amount",
      "Argon only"
    ],
    "Body tissues produce carbon dioxide during respiration, and the lungs remove part of it in exhaled air.",
    [
      "EXHALED-MORE-CO2"
    ]
  ],
  [
    9,
    "Medium",
    "Compared with inhaled air, exhaled air usually contains:",
    "Less oxygen",
    [
      "More oxygen",
      "No nitrogen",
      "No water vapour"
    ],
    "Some inhaled oxygen diffuses into blood, so exhaled air contains less oxygen than inhaled air.",
    [
      "EXHALED-LESS-O2"
    ]
  ],
  [
    9,
    "Medium",
    "Exhaled air is usually more humid than inhaled air because:",
    "It gains water vapour from moist respiratory surfaces",
    [
      "The lungs produce rainwater",
      "Nitrogen turns into water",
      "Haemoglobin releases liquid water into the bronchi"
    ],
    "Air passing over moist respiratory surfaces becomes humidified, so exhaled air generally contains more water vapour.",
    [
      "EXHALED-WATER-VAPOUR"
    ]
  ],
  [
    9,
    "Medium",
    "Why does limewater turn milky when exposed to exhaled air for some time?",
    "Exhaled air contains carbon dioxide",
    [
      "Exhaled air contains large amounts of oxygen",
      "Exhaled air contains bile",
      "Nitrogen reacts directly with limewater"
    ],
    "Carbon dioxide reacts with limewater to form insoluble calcium carbonate, producing a milky appearance.",
    [
      "EXHALED-CO2-LIMEWATER"
    ]
  ],
  [
    9,
    "Hard",
    "Tidal volume refers to the amount of air:",
    "Moved in or out during a normal quiet breath",
    [
      "Left in the lungs after maximum exhalation only",
      "Exhaled after a maximum inhalation only",
      "Stored in the stomach during breathing"
    ],
    "Tidal volume is the volume of air inhaled or exhaled in a normal resting breath.",
    [
      "TIDAL-VOLUME"
    ]
  ],
  [
    9,
    "Hard",
    "During vigorous exercise, both breathing rate and tidal volume usually increase. The main result is:",
    "More air is moved through the lungs each minute",
    [
      "Less oxygen reaches the alveoli",
      "Gas exchange stops temporarily",
      "The trachea becomes sealed"
    ],
    "Faster and deeper breathing increases minute ventilation, delivering more fresh air to the alveoli and removing more carbon dioxide.",
    [
      "EXERCISE-MINUTE-VENTILATION"
    ]
  ],
  [
    10,
    "Easy",
    "Smoking can impair the cleaning of airways by damaging:",
    "Cilia",
    [
      "Villi",
      "Nephrons",
      "Platelets"
    ],
    "Tobacco smoke can damage airway cilia, reducing the removal of mucus, dust and microbes.",
    [
      "SMOKING-CILIA"
    ]
  ],
  [
    10,
    "Medium",
    "Carbon monoxide in cigarette smoke is harmful mainly because it:",
    "Reduces the oxygen-carrying capacity of haemoglobin",
    [
      "Improves oxygen transport",
      "Increases alveolar surface area",
      "Acts as a bronchodilator"
    ],
    "Carbon monoxide binds strongly to haemoglobin and prevents some oxygen from being transported.",
    [
      "SMOKING-CARBON-MONOXIDE"
    ]
  ],
  [
    10,
    "Medium",
    "During an asthma attack, breathing becomes difficult mainly because the:",
    "Airways become narrowed",
    [
      "Alveoli turn into blood vessels",
      "Diaphragm becomes part of the stomach",
      "Lungs stop containing any capillaries"
    ],
    "Asthma involves narrowing and inflammation of airways, which increases resistance to airflow.",
    [
      "ASTHMA-AIRWAY-NARROWING"
    ]
  ],
  [
    10,
    "Medium",
    "A properly fitted mask can reduce inhalation of harmful dust mainly by:",
    "Filtering particles before they enter the respiratory tract",
    [
      "Increasing haemoglobin production instantly",
      "Expanding alveolar surface area",
      "Stopping carbon dioxide formation in cells"
    ],
    "A suitable mask acts as a physical barrier that reduces the number of airborne particles entering the nose and mouth.",
    [
      "MASK-DUST-FILTRATION"
    ]
  ],
  [
    10,
    "Hard",
    "A person has normal haemoglobin but widespread destruction of alveolar walls. Which function is most directly reduced?",
    "Gas exchange between air and blood",
    [
      "Transport of food through the oesophagus",
      "Bile storage",
      "Urine formation"
    ],
    "Normal haemoglobin cannot compensate fully for a severe loss of alveolar surface area. The primary problem is transfer of gases between lungs and blood.",
    [
      "ALVEOLI-VS-HAEMOGLOBIN"
    ]
  ],
  [
    10,
    "Hard",
    "A patient's airways are clear and diaphragm movement is normal, but the alveolar membrane is much thicker than usual. Why may oxygen levels fall?",
    "Diffusion of oxygen into blood becomes slower",
    [
      "Air cannot enter the nose",
      "Red blood cells cannot contain haemoglobin at all",
      "The trachea loses all cartilage instantly"
    ],
    "Ventilation can be normal while gas transfer is poor. A thickened alveolar membrane increases diffusion distance and slows oxygen entry into blood.",
    [
      "RESPIRATORY-MIXED-DIFFUSION"
    ]
  ]
] as const;
