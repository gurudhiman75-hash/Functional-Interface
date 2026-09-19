import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp036ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp036ReviewSpec[] = [
  [
    6,
    "Easy",
    "Sound cannot travel through:",
    "Vacuum",
    [
      "Air",
      "Water",
      "Steel"
    ],
    "Sound is a mechanical wave and needs a material medium. Without particles to vibrate and pass the disturbance onward, there is no sound transmission.",
    [
      "SOUND-NO-VACUUM"
    ]
  ],
  [
    6,
    "Easy",
    "The pitch of a sound depends chiefly on its:",
    "Frequency",
    [
      "Amplitude",
      "Speed alone",
      "Loudness"
    ],
    "Higher frequency is perceived as higher pitch. Amplitude affects loudness, while frequency determines whether a note sounds high or low.",
    [
      "PITCH-FREQUENCY"
    ]
  ],
  [
    6,
    "Medium",
    "Why can a person hear an approaching train through a rail before hearing it clearly through air?",
    "Sound travels faster in solids than in air",
    [
      "Rails create sound before the train moves",
      "Air cannot carry sound",
      "Steel lowers sound frequency to zero"
    ],
    "Sound speed is generally greater in solids because their particles transmit vibrations efficiently. The vibration reaches the listener through the rail sooner than through the surrounding air.",
    [
      "SOUND-RAIL-FASTER"
    ]
  ],
  [
    6,
    "Medium",
    "Why are soft materials such as curtains used in auditoriums?",
    "They absorb sound and reduce unwanted reflections",
    [
      "They increase echoes",
      "They amplify every frequency",
      "They make sound travel in vacuum"
    ],
    "Soft porous materials absorb part of the sound energy and reduce reverberation. This reduces repeated sound reflections, so speech and music are heard more clearly.",
    [
      "CURTAINS-SOUND-ABSORPTION"
    ]
  ],
  [
    6,
    "Medium",
    "What causes an echo?",
    "Reflection of sound",
    [
      "Refraction of light",
      "Absorption of sound only",
      "Electrical induction"
    ],
    "An echo is heard when reflected sound reaches the listener after a sufficient delay. If the reflecting surface is far enough away, the reflected sound is heard separately from the original sound.",
    [
      "ECHO-REFLECTION"
    ]
  ],
  [
    6,
    "Hard",
    "An empty hall has strong reverberation, but after adding seats, curtains and acoustic panels the sound becomes clearer. Why?",
    "The added materials absorb sound and reduce repeated reflections",
    [
      "They increase the speed of sound",
      "They stop the source vibrating",
      "They lower the frequency of all sounds"
    ],
    "Absorbing surfaces reduce excessive reflected sound, improving speech clarity. The aim is not to remove all reflection, but to prevent too many delayed reflections from mixing with the original sound.",
    [
      "REVERBERATION-CONTROL"
    ]
  ],
  [
    7,
    "Easy",
    "Boiling drinking water helps make it safer because it:",
    "Kills many disease-causing microorganisms",
    [
      "Removes all dissolved salts",
      "Adds oxygen permanently",
      "Converts water into distilled water"
    ],
    "Boiling destroys many pathogens, though it does not remove dissolved salts. It is useful for killing many bacteria, viruses and other pathogens, but it does not remove chemical impurities such as salts.",
    [
      "BOILING-WATER-DISINFECTION"
    ]
  ],
  [
    7,
    "Easy",
    "A common household method for removing suspended particles from water is:",
    "Filtration",
    [
      "Electroplating",
      "Fermentation",
      "Combustion"
    ],
    "Filtration physically removes many suspended particles from water. Filtration improves clarity, but it may not remove every dissolved substance or microorganism.",
    [
      "WATER-FILTRATION"
    ]
  ],
  [
    7,
    "Medium",
    "Why does chlorination help disinfect drinking water?",
    "Chlorine can kill or inactivate many microorganisms",
    [
      "Chlorine removes all dissolved minerals",
      "It raises water pressure",
      "It converts water into pure oxygen"
    ],
    "Proper chlorination reduces disease-causing microbes in water. A correct chlorine dose can make water microbiologically safer without needing to remove all dissolved substances.",
    [
      "CHLORINATION-DISINFECTION"
    ]
  ],
  [
    7,
    "Medium",
    "Why is handwashing with soap effective in reducing infection spread?",
    "Soap helps remove microbes, oils and dirt from skin",
    [
      "Soap permanently sterilizes skin",
      "Soap increases body temperature",
      "Soap creates antibodies instantly"
    ],
    "Soap loosens oils and contaminants so rubbing and rinsing remove many microbes. The rubbing action and rinsing are important because they physically carry loosened microbes away from the hands.",
    [
      "SOAP-HANDWASHING"
    ]
  ],
  [
    7,
    "Medium",
    "What is the main purpose of sedimentation before filtration in water treatment?",
    "To allow heavier suspended particles to settle",
    [
      "To kill all viruses by gravity",
      "To add dissolved salts",
      "To raise water temperature"
    ],
    "Sedimentation removes larger suspended material before later purification steps. Removing these particles first reduces the load on filters used in the next stage.",
    [
      "SEDIMENTATION-WATER"
    ]
  ],
  [
    7,
    "Hard",
    "A water sample is cloudy and may contain pathogens. Which simple sequence is more effective than either step alone?",
    "Filter to remove suspended matter, then disinfect the water",
    [
      "Add soil, then store it open",
      "Freeze briefly, then add sugar",
      "Only shake the water vigorously"
    ],
    "Filtration reduces suspended material while disinfection targets microorganisms. The two steps solve different problems, so using them together gives safer water than relying on only one.",
    [
      "FILTER-THEN-DISINFECT"
    ]
  ],
  [
    8,
    "Easy",
    "Soap cleans greasy dirt because its molecules have parts that interact with both:",
    "Water and oil",
    [
      "Only water",
      "Only metals",
      "Only acids"
    ],
    "Soap molecules have a water-attracting end and an oil-attracting end, allowing grease to be dispersed in water. The oil-attracting parts surround grease while the water-attracting parts help carry it away during rinsing.",
    [
      "SOAP-AMPHIPHILIC"
    ]
  ],
  [
    8,
    "Easy",
    "Stainless steel is widely used for utensils because it is:",
    "Strong and resistant to corrosion",
    [
      "A poor metal conductor in every case",
      "Completely non-reactive with all substances",
      "Softer than rubber"
    ],
    "Stainless steel combines useful strength with good corrosion resistance. Its chromium-containing surface forms a protective layer that helps resist rusting under normal use.",
    [
      "STAINLESS-STEEL-UTENSILS"
    ]
  ],
  [
    8,
    "Medium",
    "Why does detergent often work better than soap in hard water?",
    "Detergents do not form insoluble scum as readily with calcium and magnesium ions",
    [
      "Detergents contain no molecules",
      "Soap cannot dissolve in any water",
      "Hard water contains no ions"
    ],
    "Soap can form insoluble salts with calcium and magnesium, while synthetic detergents are less affected. That is why detergents can continue producing lather and cleaning effectively where ordinary soap performs poorly.",
    [
      "DETERGENT-HARD-WATER"
    ]
  ]
] as const;
