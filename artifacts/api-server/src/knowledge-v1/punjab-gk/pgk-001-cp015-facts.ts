export const PGK_001_CP015_SOURCE_IDS = Object.freeze({
  psebRanjitLesson: "PSEB-RANJIT-SINGH-PUNJAB",
  psebAdminLesson: "PSEB-RANJIT-SINGH-ADMINISTRATION",
  districtAmritsarHistory: "GOV-PUNJAB-AMRITSAR-HISTORY-RANJIT",
  igncaPunjabHistory: "IGNCA-PUNJAB-RANJIT-SINGH",
  britannicaRanjit: "BRITANNICA-RANJIT-SINGH",
} as const);

export const PGK_001_CP015_FACTS = Object.freeze({
  birth: {
    id: "ranjit-birth-1780-gujranwala",
    year: 1780,
    place: "Gujranwala",
  },
  father: {
    id: "ranjit-father-mahan-singh",
    father: "Mahan Singh",
    misl: "Sukerchakia Misl",
  },
  lahore1799: {
    id: "ranjit-lahore-1799",
    year: 1799,
    place: "Lahore",
    result: "Captured Lahore and made it the capital of his kingdom",
  },
  coronation1801: {
    id: "ranjit-coronation-1801",
    date: "12 April 1801",
    place: "Lahore",
    officiant: "Sahib Singh Bedi",
  },
  sarkarKhalsa: {
    id: "ranjit-sarkar-i-khalsa",
    governmentName: "Sarkar-i-Khalsa",
    coinNames: Object.freeze(["Guru Nanak Dev", "Guru Gobind Singh"]),
  },
  amritsar1802: {
    id: "ranjit-amritsar-1802",
    year: 1802,
    place: "Amritsar",
    note: "Ranjit Singh gained full control of Amritsar by 1802.",
  },
  gobindgarh: {
    id: "ranjit-gobindgarh-fort",
    place: "Amritsar",
    note: "Ranjit Singh strengthened Gobindgarh Fort on modern lines.",
  },
  treaty1809: {
    id: "treaty-amritsar-1809",
    year: 1809,
    treaty: "Treaty of Amritsar",
    britishRepresentative: "Charles Metcalfe",
    effect: "Checked further expansion south of the Sutlej and settled relations with the British East India Company",
  },
  kangra1809: {
    id: "ranjit-kangra-1809",
    place: "Kangra",
    year: 1809,
  },
  attock1813: {
    id: "ranjit-attock-1813",
    place: "Attock",
    year: 1813,
  },
  kohinoor1813: {
    id: "ranjit-kohinoor-1813-shah-shuja",
    year: 1813,
    item: "Koh-i-Noor diamond",
    from: "Shah Shuja",
  },
  multan1818: {
    id: "ranjit-multan-1818",
    place: "Multan",
    year: 1818,
    commander: "Misr Diwan Chand",
  },
  kashmir1819: {
    id: "ranjit-kashmir-1819",
    place: "Kashmir",
    year: 1819,
  },
  peshawar1834: {
    id: "ranjit-peshawar-1834",
    place: "Peshawar",
    year: 1834,
    laterGovernor: "Hari Singh Nalwa",
  },
  capital: {
    id: "sikh-empire-capital-lahore",
    capital: "Lahore",
  },
  provinces: {
    id: "ranjit-four-provinces",
    count: 4,
    names: Object.freeze(["Lahore", "Multan", "Kashmir", "Peshawar"]),
  },
  primeMinister: {
    id: "ranjit-prime-minister-dhian-singh",
    office: "Prime Minister",
    person: "Raja Dhian Singh",
  },
  foreignMinister: {
    id: "ranjit-foreign-minister-azizuddin",
    office: "Foreign Minister",
    person: "Fakir Aziz-ud-Din",
  },
  financeMinister: {
    id: "ranjit-finance-minister-bhiwani-das",
    office: "Finance Minister",
    person: "Diwan Bhiwani Das",
  },
  commanderInChief: {
    id: "ranjit-commander-hari-singh-nalwa",
    office: "Commander-in-Chief",
    person: "Hari Singh Nalwa",
  },
  kotwalLahore: {
    id: "ranjit-kotwal-lahore-imam-baksh",
    office: "Kotwal of Lahore",
    person: "Imam Baksh",
  },
  deorhiwala: {
    id: "ranjit-deorhiwala-khushal-singh",
    office: "Deorhiwala",
    person: "Khushal Singh",
  },
  provincialAdministration: {
    id: "ranjit-admin-suba-nazim",
    unit: "Suba",
    head: "Nazim",
  },
  villageAdministration: {
    id: "ranjit-admin-mauza-muqaddam",
    smallestUnit: "Mauza",
    villageHead: "Muqaddam",
  },
  europeanOfficers: {
    id: "ranjit-european-officers",
    officers: Object.freeze(["Jean-Baptiste Ventura", "Jean-Francois Allard", "Paolo Avitabile"]),
    role: "Helped modernise and train parts of the Sikh army on European lines",
  },
  faujKhas: {
    id: "ranjit-fauj-i-khas-ventura",
    unit: "Fauj-i-Khas",
    commander: "Jean-Baptiste Ventura",
    note: "Model brigade trained on European lines",
  },
  death1839: {
    id: "ranjit-death-1839",
    year: 1839,
  },
} as const);

export const PGK_001_CP015_FACT_IDS = Object.freeze(
  Object.values(PGK_001_CP015_FACTS).map((fact) => fact.id),
);
