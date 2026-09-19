export const PGK_001_CP025_SOURCE_IDS = Object.freeze({
  pibMilkha: "PIB-NEW-INDIA-SAMACHAR-MILKHA-SINGH",
  worldAthleticsMilkha: "WORLD-ATHLETICS-MILKHA-SINGH",
  hockeyIndiaOlympics: "HOCKEY-INDIA-OLYMPIC-HISTORY",
  hockeyIndiaAjitPal: "HOCKEY-INDIA-AJIT-PAL-SINGH",
  cecAjitPal: "CEC-BPED-AJIT-PAL-SINGH",
  worldAthleticsRandhawa: "WORLD-ATHLETICS-GURBACHAN-SINGH-RANDHAWA",
  myasArjuna: "MYAS-ARJUNA-AWARD-ATHLETICS",
  padmaAwards: "MHA-PADMA-AWARDS-2005",
  crpfParamjeet: "CRPF-PARAMJEET-SINGH-PROFILE",
  punjabSports: "GOV-PUNJAB-MAHARAJA-RANJIT-SINGH-AWARD",
} as const);

export const PGK_001_CP025_FACTS = Object.freeze([
  { id: "milkha-flying-sikh", value: "Milkha Singh was an Indian track athlete known as the Flying Sikh.", sourceIds: [PGK_001_CP025_SOURCE_IDS.pibMilkha, PGK_001_CP025_SOURCE_IDS.worldAthleticsMilkha] },
  { id: "milkha-three-olympics", value: "Milkha Singh represented India at the 1956 Melbourne, 1960 Rome and 1964 Tokyo Olympic Games.", sourceIds: [PGK_001_CP025_SOURCE_IDS.pibMilkha, PGK_001_CP025_SOURCE_IDS.worldAthleticsMilkha] },
  { id: "milkha-title-ayub", value: "Pakistan President Ayub Khan bestowed the Flying Sikh title on Milkha Singh after his 1960 Lahore race.", sourceIds: [PGK_001_CP025_SOURCE_IDS.pibMilkha] },
  { id: "milkha-rome-1960", value: "Milkha Singh finished fourth in the 400 metres at the 1960 Rome Olympics.", sourceIds: [PGK_001_CP025_SOURCE_IDS.worldAthleticsMilkha, PGK_001_CP025_SOURCE_IDS.pibMilkha] },

  { id: "balbir-three-golds", value: "Balbir Singh Sr. won Olympic hockey gold as a player in 1948, 1952 and 1956.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaOlympics] },
  { id: "balbir-1956-captain", value: "Balbir Singh Sr. captained India to men's hockey gold at the 1956 Melbourne Olympics.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaOlympics] },
  { id: "balbir-1952-final-five", value: "Balbir Singh Sr. scored five goals in the 1952 Olympic men's hockey final, recorded by Hockey India as the most by an individual in an Olympic men's hockey final.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaOlympics] },

  { id: "ajit-pal-1975", value: "Ajit Pal Singh captained India to the 1975 Men's Hockey World Cup title in Kuala Lumpur.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaAjitPal] },
  { id: "ajit-pal-final-pakistan", value: "India defeated Pakistan in the 1975 Men's Hockey World Cup final.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaAjitPal] },
  { id: "ajit-pal-world-cup-medals", value: "Ajit Pal Singh's three World Cup appearances produced bronze in 1971, silver in 1973 and gold in 1975.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaAjitPal] },
  { id: "ajit-pal-sansarpur", value: "Ajit Pal Singh was born in Sansarpur, Punjab.", sourceIds: [PGK_001_CP025_SOURCE_IDS.cecAjitPal] },

  { id: "pargat-olympic-captain", value: "Pargat Singh captained India at the 1992 and 1996 Olympic Games.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaOlympics] },
  { id: "pargat-mithapur", value: "Pargat Singh was born at Mithapur in Punjab.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaOlympics] },
  { id: "manpreet-tokyo", value: "Manpreet Singh captained India's men's hockey team to bronze at Tokyo 2020.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaOlympics] },
  { id: "manpreet-mithapur", value: "Manpreet Singh was born at Mithapur in Punjab.", sourceIds: [PGK_001_CP025_SOURCE_IDS.hockeyIndiaOlympics] },

  { id: "randhawa-athletics", value: "Gurbachan Singh Randhawa represented India in athletics.", sourceIds: [PGK_001_CP025_SOURCE_IDS.worldAthleticsRandhawa] },
  { id: "randhawa-1962", value: "Gurbachan Singh Randhawa won the decathlon gold medal at the 1962 Asian Games.", sourceIds: [PGK_001_CP025_SOURCE_IDS.worldAthleticsRandhawa] },
  { id: "randhawa-tokyo-1964", value: "Gurbachan Singh Randhawa finished fifth in the 110 metres hurdles at the 1964 Tokyo Olympics.", sourceIds: [PGK_001_CP025_SOURCE_IDS.worldAthleticsRandhawa] },
  { id: "randhawa-arjuna-1961", value: "Gurbachan Singh Randhawa received the Arjuna Award in 1961.", sourceIds: [PGK_001_CP025_SOURCE_IDS.myasArjuna] },
  { id: "randhawa-padma-2005", value: "Gurbachan Singh Randhawa received the Padma Shri in 2005.", sourceIds: [PGK_001_CP025_SOURCE_IDS.padmaAwards] },

  { id: "maharaja-ranjit-award", value: "The Maharaja Ranjit Singh Award is a Punjab Government sports honour.", sourceIds: [PGK_001_CP025_SOURCE_IDS.punjabSports, PGK_001_CP025_SOURCE_IDS.crpfParamjeet] },
  { id: "paramjeet-2006", value: "Athlete Paramjeet Singh received the Maharaja Ranjit Singh Award in 2006.", sourceIds: [PGK_001_CP025_SOURCE_IDS.crpfParamjeet] },
  { id: "paramjeet-athletics", value: "Paramjeet Singh competed in athletics, especially the 400 metres.", sourceIds: [PGK_001_CP025_SOURCE_IDS.crpfParamjeet] },
  { id: "paramjeet-400-record-1998", value: "Paramjeet Singh broke Milkha Singh's long-standing Indian 400 metres record in 1998.", sourceIds: [PGK_001_CP025_SOURCE_IDS.crpfParamjeet, PGK_001_CP025_SOURCE_IDS.worldAthleticsMilkha] },
] as const);
