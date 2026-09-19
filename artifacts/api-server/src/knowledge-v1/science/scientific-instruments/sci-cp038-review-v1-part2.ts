import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp038ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp038ReviewSpec[] = [
  [
    3,
    "Medium",
    "A galvanometer is especially useful for detecting:",
    "Small electric currents",
    [
      "Atmospheric pressure",
      "Humidity",
      "Temperature"
    ],
    "A galvanometer is a sensitive instrument for detecting and measuring small currents. It can also form the basis of ammeters and voltmeters with suitable circuit changes. Its high sensitivity makes it useful where the current is too small for an ordinary ammeter.",
    [
      "GALVANOMETER-SMALL-CURRENT"
    ]
  ],
  [
    3,
    "Medium",
    "Which instrument measures electrical power in a circuit?",
    "Wattmeter",
    [
      "Voltmeter",
      "Ohmmeter",
      "Hydrometer"
    ],
    "A wattmeter measures electrical power. It uses current and voltage information so the power being delivered to a load can be determined. Electrical power tells how quickly electrical energy is being used or transferred.",
    [
      "WATTMETER-POWER"
    ]
  ],
  [
    3,
    "Hard",
    "An electrician wants one handheld device to check voltage, current and resistance. Which instrument is most suitable?",
    "Multimeter",
    [
      "Barometer",
      "Galvanometer alone",
      "Calorimeter"
    ],
    "A multimeter combines several electrical measurement functions in one device. Depending on the model, it can measure voltage, current, resistance and other quantities. This is why it is one of the most common tools for electrical troubleshooting.",
    [
      "MULTIMETER-INTEGRATED"
    ]
  ],
  [
    4,
    "Easy",
    "A microscope is used to observe:",
    "Very small objects",
    [
      "Very distant stars only",
      "Atmospheric pressure",
      "Wind speed"
    ],
    "A microscope makes very small objects appear larger so fine details can be seen. It is widely used in biology, medicine and material examination. Its usefulness depends on magnification together with sufficient resolution.",
    [
      "MICROSCOPE-SMALL-OBJECTS"
    ]
  ],
  [
    4,
    "Easy",
    "A telescope is designed to observe:",
    "Distant objects",
    [
      "Microscopic cells only",
      "Blood pressure",
      "Electrical resistance"
    ],
    "A telescope collects light from distant objects and forms an enlarged view. Astronomical telescopes are used for stars, planets and other celestial objects. Its large light-gathering ability is important for faint astronomical objects.",
    [
      "TELESCOPE-DISTANT"
    ]
  ],
  [
    4,
    "Medium",
    "A simple magnifying glass is essentially a:",
    "Convex lens",
    [
      "Concave mirror only",
      "Concave lens",
      "Plane glass plate"
    ],
    "A magnifying glass uses a convex lens. When the object is placed within the focal length, the lens forms an enlarged virtual image. The object must be placed close enough for the enlarged virtual image to form.",
    [
      "MAGNIFYING-GLASS-CONVEX"
    ]
  ],
  [
    4,
    "Medium",
    "Which instrument is used to split light into its component wavelengths for study?",
    "Spectroscope",
    [
      "Periscope",
      "Microscope",
      "Stethoscope"
    ],
    "A spectroscope separates light into a spectrum. The pattern of wavelengths can provide information about the source or the substances present. Different substances can produce characteristic spectral patterns.",
    [
      "SPECTROSCOPE-LIGHT-SPECTRUM"
    ]
  ],
  [
    4,
    "Medium",
    "A periscope allows a person to see over or around an obstacle by using:",
    "Reflection of light",
    [
      "Electromagnetic induction",
      "Sound resonance",
      "Thermal expansion"
    ],
    "A simple periscope uses mirrors or prisms to change the direction of light by reflection. This allows the observer to see from a position with no direct line of sight. This principle allows viewing from a protected or hidden position.",
    [
      "PERISCOPE-REFLECTION"
    ]
  ],
  [
    4,
    "Hard",
    "A scientist needs to examine bacteria and then analyse the wavelengths of light emitted by a sample. Which pair of instruments is appropriate?",
    "Microscope and spectroscope",
    [
      "Telescope and barometer",
      "Periscope and ammeter",
      "Microscope and rain gauge"
    ],
    "Bacteria require magnification with a microscope, while wavelength analysis requires a spectroscope. The instruments serve different observational tasks. One instrument magnifies structures, while the other analyses light.",
    [
      "MICROSCOPE-SPECTROSCOPE-PAIR"
    ]
  ],
  [
    5,
    "Easy",
    "Earthquake vibrations are recorded by a:",
    "Seismograph",
    [
      "Stethoscope",
      "Audiometer",
      "Manometer"
    ],
    "A seismograph records ground motion produced by earthquakes and other seismic disturbances. The resulting record is called a seismogram. The recorded pattern helps scientists study the strength and arrival of seismic waves.",
    [
      "SEISMOGRAPH-EARTHQUAKE"
    ]
  ],
  [
    5,
    "Easy",
    "A stethoscope helps a doctor listen to:",
    "Internal body sounds",
    [
      "Ultraviolet radiation",
      "Air pressure",
      "Electrical resistance"
    ],
    "A stethoscope carries sounds from the body to the examiner's ears. It is commonly used to listen to heart and lung sounds. It does not create the sounds; it transmits and makes them easier to hear.",
    [
      "STETHOSCOPE-BODY-SOUNDS"
    ]
  ],
  [
    5,
    "Medium",
    "Which instrument is used to test hearing sensitivity at different sound frequencies?",
    "Audiometer",
    [
      "Seismograph",
      "Sphygmomanometer",
      "Colorimeter"
    ],
    "An audiometer produces controlled tones of different frequencies and intensities. A person's responses are used to measure hearing threshold. The result can show which frequencies a person hears poorly.",
    [
      "AUDIOMETER-HEARING"
    ]
  ],
  [
    5,
    "Medium",
    "A sound-level meter is used to measure:",
    "Sound level in decibels",
    [
      "Pitch only in hertz",
      "Blood pressure",
      "Earthquake magnitude directly"
    ],
    "A sound-level meter measures the intensity level of environmental sound and reports it in decibels. It is useful for workplace and noise-pollution assessment. It is commonly used when checking environmental or occupational noise.",
    [
      "SOUND-LEVEL-METER"
    ]
  ],
  [
    5,
    "Medium",
    "Which instrument is used to measure the frequency of periodic vibrations in some laboratory setups?",
    "Frequency meter",
    [
      "Barometer",
      "Hydrometer",
      "Odometer"
    ],
    "A frequency meter measures how often a periodic signal or vibration repeats each second. Frequency is expressed in hertz. A higher frequency means more repeated cycles occur each second.",
    [
      "FREQUENCY-METER"
    ]
  ],
  [
    5,
    "Hard",
    "A factory wants to assess worker exposure to loud machinery and also test whether a worker has hearing loss. Which instruments are needed?",
    "Sound-level meter and audiometer",
    [
      "Seismograph and stethoscope",
      "Audiometer and barometer",
      "Sound-level meter and sphygmomanometer"
    ],
    "The sound-level meter measures workplace noise, while the audiometer tests hearing sensitivity. Using both separates the environmental measurement from the human hearing assessment. One measures the sound source, while the other measures the person's hearing response.",
    [
      "NOISE-HEARING-INSTRUMENTS"
    ]
  ]
] as const;
