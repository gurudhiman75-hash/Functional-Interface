import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp029ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp029ReviewSpec[] = [
  [
    6,
    "Easy",
    "Skin protects the body from infection by acting as a:",
    "Physical barrier",
    [
      "Hormone",
      "Antibody",
      "Vaccine"
    ],
    "Intact skin forms a physical barrier that prevents many pathogens from entering body tissues. Skin works best as a barrier while it remains intact and unbroken.",
    [
      "SKIN-BARRIER"
    ]
  ],
  [
    6,
    "Easy",
    "Mucus in the respiratory tract helps defence by:",
    "Trapping microbes and particles",
    [
      "Producing red blood cells",
      "Digesting proteins",
      "Storing oxygen"
    ],
    "Mucus can trap inhaled particles and microorganisms before they reach deeper tissues. Cilia can then help move trapped material out of the respiratory passages.",
    [
      "MUCUS-BARRIER"
    ]
  ],
  [
    6,
    "Medium",
    "Hydrochloric acid in the stomach contributes to innate defence because it:",
    "Kills many swallowed microbes",
    [
      "Produces antibodies",
      "Vaccinates the body",
      "Carries oxygen"
    ],
    "The acidic environment of the stomach destroys many microorganisms entering with food. The low pH damages or kills many swallowed organisms before they can reach the intestine.",
    [
      "STOMACH-ACID-DEFENCE"
    ]
  ],
  [
    6,
    "Medium",
    "Which cells can engulf and destroy invading microbes as part of innate immunity?",
    "Phagocytes",
    [
      "Red blood cells",
      "Platelets only",
      "Bone cells"
    ],
    "Phagocytes surround and digest foreign particles and microbes. These cells include neutrophils and macrophages that ingest microbes into internal compartments for destruction.",
    [
      "PHAGOCYTES"
    ]
  ],
  [
    6,
    "Medium",
    "Why is inflammation considered part of innate defence?",
    "It rapidly brings defensive cells and molecules to damaged or infected tissue",
    [
      "It creates permanent antibodies only",
      "It changes genes in pathogens",
      "It always prevents fever"
    ],
    "Inflammation is a rapid, non-specific response that helps contain damage and recruit immune defences. Redness, heat and swelling reflect increased blood flow and immune activity at the affected site.",
    [
      "INFLAMMATION-INNATE"
    ]
  ],
  [
    6,
    "Hard",
    "A pathogen crosses damaged skin before antibodies have been produced. Which defence is likely to respond first?",
    "Innate immune mechanisms such as phagocytes and inflammation",
    [
      "Long-term immune memory only",
      "Vaccination after infection only",
      "Red blood cell clotting alone"
    ],
    "Innate defences act rapidly and do not require prior exposure to the specific pathogen. Specific antibody responses take longer to develop, so rapid innate defences provide early protection.",
    [
      "INNATE-FIRST-RESPONSE"
    ]
  ],
  [
    7,
    "Easy",
    "Proteins produced by the immune system that bind specific antigens are called:",
    "Antibodies",
    [
      "Hormones",
      "Enzymes only",
      "Vitamins"
    ],
    "Antibodies are immune proteins that bind specifically to particular antigens. Each antibody has binding sites shaped to recognize particular molecular features of its antigen.",
    [
      "ANTIBODY-DEFINITION"
    ]
  ],
  [
    7,
    "Easy",
    "A foreign molecule that can trigger a specific immune response is called an:",
    "Antigen",
    [
      "Antibody",
      "Vitamin",
      "Platelet"
    ],
    "Antigens are recognized as foreign by the immune system and can stimulate specific immune responses. Antigens can be parts of pathogens, toxins or other foreign material recognized by immune cells.",
    [
      "ANTIGEN-DEFINITION"
    ]
  ],
  [
    7,
    "Medium",
    "Why is the second response to the same pathogen often faster than the first?",
    "Memory cells formed after the first exposure respond rapidly",
    [
      "Red blood cells remember the pathogen",
      "The skin becomes permanently thicker",
      "The pathogen loses all antigens"
    ],
    "Memory lymphocytes remain after the first exposure and generate a quicker, stronger response on re-exposure. This faster secondary response is the biological basis of durable protection after many infections and vaccines.",
    [
      "IMMUNE-MEMORY"
    ]
  ],
  [
    7,
    "Medium",
    "Acquired immunity is described as specific because:",
    "It recognizes particular antigens",
    [
      "It acts identically against every substance",
      "It depends only on skin",
      "It never involves lymphocytes"
    ],
    "Adaptive immune responses are directed toward specific antigens on pathogens or other foreign material. The same specificity means immunity to one pathogen does not automatically protect against an unrelated one.",
    [
      "ACQUIRED-SPECIFIC"
    ]
  ],
  [
    7,
    "Medium",
    "Which type of immunity develops after a person recovers from many infectious diseases?",
    "Naturally acquired active immunity",
    [
      "Artificial passive immunity",
      "Innate immunity only",
      "Genetic immunity only"
    ],
    "Infection can stimulate the person's own immune system to make antibodies and memory cells. Because the person's own lymphocytes respond, protection may persist through long-lived memory cells.",
    [
      "NATURAL-ACTIVE-IMMUNITY"
    ]
  ],
  [
    7,
    "Hard",
    "A person receives ready-made antibodies after exposure to a toxin. Why is this protection usually temporary?",
    "The body receives antibodies but forms little or no immune memory from them",
    [
      "Antibodies cannot bind antigens",
      "Passive immunity always changes genes",
      "Ready-made antibodies remain for life"
    ],
    "Passive immunity provides immediate antibodies, but they decline with time and usually do not create lasting memory. Ready-made antibodies act quickly but are gradually broken down and are not replaced by memory-driven production.",
    [
      "PASSIVE-IMMUNITY-TEMPORARY"
    ]
  ],
  [
    8,
    "Easy",
    "Vaccination works by preparing the:",
    "Immune system",
    [
      "Digestive system only",
      "Skeletal system",
      "Urinary bladder"
    ],
    "Vaccines expose the immune system to safe antigenic material so it can build protection. The goal is to create protection before exposure to the dangerous form of the pathogen.",
    [
      "VACCINATION-IMMUNE-SYSTEM"
    ]
  ],
  [
    8,
    "Easy",
    "A vaccine usually contains antigenic material that is:",
    "Safe enough to stimulate immunity without causing the full disease",
    [
      "Always a high dose of active toxin",
      "A vitamin supplement only",
      "A red blood cell preparation"
    ],
    "Vaccines are designed to stimulate protective immunity without producing the full disease in healthy recipients. Antigens may be delivered as weakened organisms, inactivated material or selected pathogen components.",
    [
      "VACCINE-ANTIGEN"
    ]
  ],
  [
    8,
    "Medium",
    "What is the key long-term benefit of vaccination?",
    "Formation of immune memory",
    [
      "Permanent increase in body temperature",
      "Replacement of white blood cells",
      "Elimination of all microbes from the environment"
    ],
    "Vaccination promotes memory cells that can respond rapidly during later exposure. Memory allows rapid antibody production and cellular responses when the real pathogen is encountered later.",
    [
      "VACCINE-MEMORY"
    ]
  ]
] as const;
