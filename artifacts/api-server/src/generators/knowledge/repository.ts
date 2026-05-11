import fs from "node:fs";
import path from "node:path";
import type {
  KnowledgeFact,
  KnowledgeFactType,
  KnowledgeSubject,
} from "./types";

const normalizeFact = (
  fact: KnowledgeFact,
): KnowledgeFact => ({
  ...fact,
  data: {
    ...fact.data,
    entity: {
      en: fact.data.entity.en.normalize("NFC"),
      hi: fact.data.entity.hi.normalize("NFC"),
      pa: fact.data.entity.pa.normalize("NFC"),
    },
    fact: {
      en: fact.data.fact.en.normalize("NFC"),
      hi: fact.data.fact.hi.normalize("NFC"),
      pa: fact.data.fact.pa.normalize("NFC"),
    },
    detail: fact.data.detail
      ? Object.fromEntries(
          Object.entries(fact.data.detail).map(
            ([language, value]) => [
              language,
              value?.normalize("NFC"),
            ],
          ),
        )
      : undefined,
  },
});

export const KNOWLEDGE_FACTS: KnowledgeFact[] = [
  {
    factId: "const_art_014",
    entityId: "article_14",
    subject: "India GK",
    topic: "Polity",
    subtopic: "Fundamental Rights",
    factType: "constitution-article",
    contextGroupId: "fundamental_rights_chain",
    sequenceIndex: 14,
    data: {
      entity: {
        en: "Article 14",
        hi: "अनुच्छेद 14",
        pa: "ਆਰਟੀਕਲ 14",
      },
      fact: {
        en: "Equality before law",
        hi: "कानून के समक्ष समानता",
        pa: "ਕਾਨੂੰਨ ਅੱਗੇ ਸਮਾਨਤਾ",
      },
      detail: {
        en: "Guarantees equality before law and equal protection of laws.",
        hi: "कानून के समक्ष समानता और कानूनों के समान संरक्षण की गारंटी देता है।",
        pa: "ਕਾਨੂੰਨ ਅੱਗੇ ਸਮਾਨਤਾ ਅਤੇ ਕਾਨੂੰਨਾਂ ਦੇ ਸਮਾਨ ਸੁਰੱਖਿਆ ਦੀ ਗਾਰੰਟੀ ਦਿੰਦਾ ਹੈ।",
      },
    },
    difficulty: "easy",
    examTags: ["SSC", "PSSSB"],
    tags: ["Constitution", "Important Articles"],
    relations: [{ type: "related_to", target: "article_15" }],
    distractorPool: ["article_15", "article_17", "article_18"],
    pyqMetadata: { wasAsked: true, occurrences: [{ exam: "SSC CGL", year: 2021 }] },
    verification: { reviewed: true, confidence: 0.95 },
    source: { book: "Lucent GK", chapter: "Fundamental Rights", note: "Syllabus anchor; verify against Constitution text." },
  },
  {
    factId: "const_art_017",
    entityId: "article_17",
    subject: "India GK",
    topic: "Polity",
    subtopic: "Fundamental Rights",
    factType: "constitution-article",
    contextGroupId: "fundamental_rights_chain",
    sequenceIndex: 17,
    data: {
      entity: {
        en: "Article 17",
        hi: "अनुच्छेद 17",
        pa: "ਆਰਟੀਕਲ 17",
      },
      fact: {
        en: "Abolition of Untouchability",
        hi: "अस्पृश्यता का उन्मूलन",
        pa: "ਛੂਤ-ਛਾਤ ਦਾ ਖਾਤਮਾ",
      },
      detail: {
        en: "Abolishes untouchability and forbids its practice in any form.",
        hi: "अस्पृश्यता को समाप्त करता है और उसके किसी भी रूप में पालन को निषिद्ध करता है।",
        pa: "ਛੂਤ-ਛਾਤ ਨੂੰ ਖਤਮ ਕਰਦਾ ਹੈ ਅਤੇ ਇਸ ਦੀ ਕਿਸੇ ਵੀ ਰੂਪ ਵਿੱਚ ਪ੍ਰਥਾ ਨੂੰ ਮਨਾਹੀ ਕਰਦਾ ਹੈ।",
      },
    },
    difficulty: "moderate",
    examTags: ["SSC", "PSSSB"],
    tags: ["Constitution", "Important Articles"],
    relations: [{ type: "related_to", target: "article_14" }],
    distractorPool: ["article_14", "article_15", "article_18"],
    pyqMetadata: {
      wasAsked: true,
      occurrences: [{ exam: "SSC CGL", year: 2022, shift: 1 }],
    },
    verification: { reviewed: true, confidence: 0.94 },
    source: { book: "Lucent GK", page: 142, chapter: "Fundamental Rights" },
  },
  {
    factId: "const_art_356",
    entityId: "article_356",
    subject: "India GK",
    topic: "Polity",
    subtopic: "Emergency Provisions",
    factType: "constitution-article",
    contextGroupId: "emergency_articles",
    sequenceIndex: 356,
    data: {
      entity: {
        en: "Article 356",
        hi: "अनुच्छेद 356",
        pa: "ਆਰਟੀਕਲ 356",
      },
      fact: {
        en: "President's Rule",
        hi: "राष्ट्रपति शासन",
        pa: "ਰਾਸ਼ਟਰਪਤੀ ਰਾਜ",
      },
      detail: {
        en: "Allows Union intervention when constitutional machinery fails in a state.",
        hi: "राज्य में संवैधानिक तंत्र विफल होने पर संघीय हस्तक्षेप की अनुमति देता है।",
        pa: "ਰਾਜ ਵਿੱਚ ਸੰਵਿਧਾਨਕ ਮਸ਼ੀਨਰੀ ਫੇਲ੍ਹ ਹੋਣ ਤੇ ਕੇਂਦਰੀ ਹਸਤਖੇਪ ਦੀ ਆਗਿਆ ਦਿੰਦਾ ਹੈ।",
      },
    },
    difficulty: "moderate",
    examTags: ["SSC", "PSSSB", "Railway"],
    tags: ["Constitution", "Emergency Provisions"],
    distractorPool: ["article_352", "article_360", "article_365"],
    pyqMetadata: { wasAsked: true, occurrences: [{ exam: "SSC CGL", year: 2023 }] },
    verification: { reviewed: true, confidence: 0.96 },
    source: { book: "Lucent GK", chapter: "Emergency Provisions" },
  },
  {
    factId: "hist_battle_plassey",
    entityId: "battle_of_plassey",
    subject: "India GK",
    topic: "History",
    subtopic: "Modern India",
    factType: "historical-event",
    contextGroupId: "british_expansion_battles",
    sequenceIndex: 1757,
    data: {
      entity: {
        en: "Battle of Plassey",
        hi: "प्लासी का युद्ध",
        pa: "ਪਲਾਸੀ ਦੀ ਲੜਾਈ",
      },
      fact: {
        en: "1757",
        hi: "1757",
        pa: "1757",
      },
      detail: {
        en: "Robert Clive defeated Siraj-ud-Daulah.",
        hi: "रॉबर्ट क्लाइव ने सिराजुद्दौला को हराया।",
        pa: "ਰਾਬਰਟ ਕਲਾਈਵ ਨੇ ਸਿਰਾਜੁੱਦੌਲਾ ਨੂੰ ਹਰਾਇਆ।",
      },
    },
    difficulty: "easy",
    examTags: ["SSC", "Railway"],
    tags: ["Modern India", "Battles"],
    distractorPool: ["battle_of_buxar", "battle_of_wandiwash", "battle_of_panipat_3"],
    pyqMetadata: { wasAsked: true, occurrences: [{ exam: "RRB NTPC", year: 2021 }] },
    verification: { reviewed: true, confidence: 0.95 },
    source: { book: "Lucent GK", chapter: "Modern History" },
  },
  {
    factId: "hist_battle_buxar",
    entityId: "battle_of_buxar",
    subject: "India GK",
    topic: "History",
    subtopic: "Modern India",
    factType: "historical-event",
    contextGroupId: "british_expansion_battles",
    sequenceIndex: 1764,
    data: {
      entity: {
        en: "Battle of Buxar",
        hi: "बक्सर का युद्ध",
        pa: "ਬਕਸਰ ਦੀ ਲੜਾਈ",
      },
      fact: {
        en: "1764",
        hi: "1764",
        pa: "1764",
      },
      detail: {
        en: "British forces defeated Mir Qasim, Shuja-ud-Daulah, and Shah Alam II.",
        hi: "ब्रिटिश सेना ने मीर कासिम, शुजाउद्दौला और शाह आलम द्वितीय को हराया।",
        pa: "ਬਰਤਾਨਵੀ ਫੌਜ ਨੇ ਮੀਰ ਕਾਸਿਮ, ਸ਼ੁਜਾਉੱਦੌਲਾ ਅਤੇ ਸ਼ਾਹ ਆਲਮ ਦੂਜੇ ਨੂੰ ਹਰਾਇਆ।",
      },
    },
    difficulty: "moderate",
    examTags: ["SSC", "Railway"],
    tags: ["Modern India", "Battles"],
    distractorPool: ["battle_of_plassey", "battle_of_wandiwash", "battle_of_panipat_3"],
    pyqMetadata: { wasAsked: true, occurrences: [{ exam: "SSC CHSL", year: 2022 }] },
    verification: { reviewed: true, confidence: 0.94 },
    source: { book: "Lucent GK", chapter: "Modern History" },
  },
  {
    factId: "park_kaziranga_state",
    entityId: "kaziranga_national_park",
    subject: "Static GK",
    topic: "Environment",
    subtopic: "National Parks",
    factType: "location-fact",
    contextGroupId: "national_parks_states",
    data: {
      entity: {
        en: "Kaziranga National Park",
        hi: "काजीरंगा राष्ट्रीय उद्यान",
        pa: "ਕਾਜੀਰੰਗਾ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ",
      },
      fact: {
        en: "Assam",
        hi: "असम",
        pa: "ਅਸਾਮ",
      },
      detail: {
        en: "Known for the one-horned rhinoceros.",
        hi: "एक सींग वाले गैंडे के लिए प्रसिद्ध।",
        pa: "ਇੱਕ ਸਿੰਗ ਵਾਲੇ ਗੈਂਡੇ ਲਈ ਪ੍ਰਸਿੱਧ।",
      },
    },
    difficulty: "easy",
    examTags: ["SSC", "PSSSB"],
    tags: ["National Parks", "Environment"],
    distractorPool: ["jim_corbett_national_park", "gir_national_park", "keoladeo_national_park"],
    pyqMetadata: { wasAsked: true, occurrences: [{ exam: "SSC CGL", year: 2020 }] },
    verification: { reviewed: true, confidence: 0.96 },
    source: { book: "Lucent GK", chapter: "National Parks" },
  },
  {
    factId: "park_gir_state",
    entityId: "gir_national_park",
    subject: "Static GK",
    topic: "Environment",
    subtopic: "National Parks",
    factType: "location-fact",
    contextGroupId: "national_parks_states",
    data: {
      entity: {
        en: "Gir National Park",
        hi: "गिर राष्ट्रीय उद्यान",
        pa: "ਗਿਰ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ",
      },
      fact: {
        en: "Gujarat",
        hi: "गुजरात",
        pa: "ਗੁਜਰਾਤ",
      },
      detail: {
        en: "Known for Asiatic lions.",
        hi: "एशियाई सिंहों के लिए प्रसिद्ध।",
        pa: "ਏਸ਼ੀਆਈ ਸ਼ੇਰਾਂ ਲਈ ਪ੍ਰਸਿੱਧ।",
      },
    },
    difficulty: "easy",
    examTags: ["SSC"],
    tags: ["National Parks", "Environment"],
    distractorPool: ["kaziranga_national_park", "jim_corbett_national_park", "keoladeo_national_park"],
    verification: { reviewed: true, confidence: 0.95 },
    source: { book: "Lucent GK", chapter: "National Parks" },
  },
  {
    factId: "punjab_harike_location",
    entityId: "harike_wildlife_sanctuary",
    subject: "Punjab GK",
    topic: "Geography",
    subtopic: "Wetlands and Sanctuaries",
    factType: "location-fact",
    contextGroupId: "punjab_wetlands",
    data: {
      entity: {
        en: "Harike Wildlife Sanctuary",
        hi: "हरीके वन्यजीव अभयारण्य",
        pa: "ਹਰੀਕੇ ਜੰਗਲੀ ਜੀਵ ਅਭਿਆਰਣ",
      },
      fact: {
        en: "Punjab",
        hi: "पंजाब",
        pa: "ਪੰਜਾਬ",
      },
      detail: {
        en: "A wetland near the Beas-Sutlej confluence.",
        hi: "ब्यास-सतलुज संगम के पास स्थित आर्द्रभूमि।",
        pa: "ਬਿਆਸ-ਸਤਲੁਜ ਸੰਗਮ ਦੇ ਨੇੜੇ ਇਕ ਗਿੱਲਾ ਖੇਤਰ।",
      },
    },
    difficulty: "moderate",
    examTags: ["PSSSB", "PPSC"],
    tags: ["Punjab", "Environment", "Wetlands"],
    distractorPool: ["bhakra_nangal_project", "ropar_wetland", "kanjli_wetland"],
    verification: { reviewed: true, confidence: 0.94 },
    source: { book: "Sadda Punjab", chapter: "Punjab Geography" },
  },
  {
    factId: "punjab_bhakra_river",
    entityId: "bhakra_nangal_project",
    subject: "Punjab GK",
    topic: "Geography",
    subtopic: "Rivers and Projects",
    factType: "river-state",
    contextGroupId: "punjab_river_projects",
    data: {
      entity: {
        en: "Bhakra Nangal Project",
        hi: "भाखड़ा नांगल परियोजना",
        pa: "ਭਾਖੜਾ ਨਾਂਗਲ ਪ੍ਰੋਜੈਕਟ",
      },
      fact: {
        en: "Sutlej River",
        hi: "सतलुज नदी",
        pa: "ਸਤਲੁਜ ਦਰਿਆ",
      },
      detail: {
        en: "A major multipurpose hydroelectric and irrigation project.",
        hi: "एक प्रमुख बहुउद्देशीय जलविद्युत और सिंचाई परियोजना।",
        pa: "ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਬਹੁ-ਉਦੇਸ਼ੀ ਜਲ-ਬਿਜਲੀ ਅਤੇ ਸਿੰਚਾਈ ਪ੍ਰੋਜੈਕਟ।",
      },
    },
    difficulty: "moderate",
    examTags: ["PSSSB", "PPSC"],
    tags: ["Punjab", "Power Projects", "Rivers"],
    distractorPool: ["beas_river", "ravi_river", "chenab_river"],
    verification: { reviewed: true, confidence: 0.94 },
    source: { book: "Sadda Punjab", chapter: "Rivers and Projects" },
  },
];

export const COMPUTER_FACTS: KnowledgeFact[] = [
  {
    factId: "comp_alu_full_form",
    entityId: "alu",
    subject: "Computer Awareness",
    topic: "Hardware",
    subtopic: "CPU",
    factType: "computer-hardware",
    contextGroupId: "cpu_components",
    data: {
      entity: { en: "ALU", hi: "एएलयू", pa: "ਏਐਲਯੂ" },
      fact: {
        en: "Arithmetic Logic Unit",
        hi: "अरिथमेटिक लॉजिक यूनिट",
        pa: "ਅਰਿਥਮੈਟਿਕ ਲੌਜਿਕ ਯੂਨਿਟ",
      },
      detail: {
        en: "Performs arithmetic and logical operations in the CPU.",
        hi: "CPU में अंकगणितीय और तार्किक क्रियाएँ करता है।",
        pa: "CPU ਵਿੱਚ ਗਣਿਤਕ ਅਤੇ ਤਰਕਸੰਗਤ ਕਾਰਵਾਈਆਂ ਕਰਦਾ ਹੈ।",
      },
    },
    difficulty: "easy",
    examTags: ["PSSSB", "SSC"],
    tags: ["Computer Awareness", "CPU"],
    distractorPool: ["cu", "ram", "rom"],
    verification: { reviewed: true, confidence: 0.97 },
    source: { book: "Arihant Computer Awareness", chapter: "Computer Fundamentals" },
  },
  {
    factId: "comp_ram_type",
    entityId: "ram",
    subject: "Computer Awareness",
    topic: "Hardware",
    subtopic: "Memory",
    factType: "computer-hardware",
    contextGroupId: "memory_types",
    data: {
      entity: { en: "RAM", hi: "रैम", pa: "ਰੈਮ" },
      fact: {
        en: "Volatile memory",
        hi: "अस्थायी/वाष्पशील मेमोरी",
        pa: "ਅਸਥਾਈ ਮੈਮੋਰੀ",
      },
      detail: {
        en: "Data is lost when power is switched off.",
        hi: "बिजली बंद होने पर डेटा मिट जाता है।",
        pa: "ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਤੇ ਡਾਟਾ ਮਿਟ ਜਾਂਦਾ ਹੈ।",
      },
    },
    difficulty: "easy",
    examTags: ["PSSSB", "SSC"],
    tags: ["Computer Awareness", "Memory"],
    distractorPool: ["rom", "cache_memory", "hard_disk"],
    verification: { reviewed: true, confidence: 0.96 },
    source: { book: "Arihant Computer Awareness", chapter: "Memory" },
  },
  {
    factId: "comp_router_function",
    entityId: "router",
    subject: "Computer Awareness",
    topic: "Internet",
    subtopic: "Networking Devices",
    factType: "computer-networking",
    contextGroupId: "networking_devices",
    data: {
      entity: { en: "Router", hi: "राउटर", pa: "ਰਾਊਟਰ" },
      fact: {
        en: "Connects different networks and forwards packets",
        hi: "विभिन्न नेटवर्कों को जोड़ता है और पैकेट अग्रेषित करता है",
        pa: "ਵੱਖ-ਵੱਖ ਨੈੱਟਵਰਕਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ ਅਤੇ ਪੈਕਟ ਅੱਗੇ ਭੇਜਦਾ ਹੈ",
      },
      detail: {
        en: "Commonly associated with the Network layer.",
        hi: "आमतौर पर नेटवर्क लेयर से संबंधित।",
        pa: "ਆਮ ਤੌਰ ਤੇ ਨੈੱਟਵਰਕ ਲੇਅਰ ਨਾਲ ਸੰਬੰਧਿਤ।",
      },
    },
    difficulty: "moderate",
    examTags: ["PSSSB", "SSC"],
    tags: ["Computer Awareness", "Networking"],
    distractorPool: ["switch", "hub", "modem"],
    verification: { reviewed: true, confidence: 0.95 },
    source: { book: "Arihant Computer Awareness", chapter: "Networking" },
  },
  {
    factId: "comp_trojan_definition",
    entityId: "trojan_horse",
    subject: "Computer Awareness",
    topic: "Security",
    subtopic: "Malware",
    factType: "computer-security",
    contextGroupId: "malware_types",
    data: {
      entity: {
        en: "Trojan Horse",
        hi: "ट्रोजन हॉर्स",
        pa: "ਟ੍ਰੋਜਨ ਹਾਰਸ",
      },
      fact: {
        en: "Malware disguised as legitimate software",
        hi: "वैध सॉफ्टवेयर जैसा दिखने वाला मालवेयर",
        pa: "ਵੈਧ ਸਾਫਟਵੇਅਰ ਵਾਂਗ ਦਿਖਣ ਵਾਲਾ ਮਾਲਵੇਅਰ",
      },
      detail: {
        en: "It usually relies on user trust or execution.",
        hi: "यह सामान्यतः उपयोगकर्ता के भरोसे या चलाने पर निर्भर करता है।",
        pa: "ਇਹ ਆਮ ਤੌਰ ਤੇ ਵਰਤੋਂਕਾਰ ਦੇ ਭਰੋਸੇ ਜਾਂ ਚਲਾਉਣ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
      },
    },
    difficulty: "moderate",
    examTags: ["PSSSB", "SSC"],
    tags: ["Computer Awareness", "Security"],
    distractorPool: ["worm", "virus", "firewall"],
    verification: { reviewed: true, confidence: 0.95 },
    source: { book: "Arihant Computer Awareness", chapter: "Cyber Security" },
  },
].map(normalizeFact);

export const STATIC_KNOWLEDGE_REPOSITORY =
  KNOWLEDGE_FACTS.map(normalizeFact);

export const FULL_KNOWLEDGE_REPOSITORY = [
  ...STATIC_KNOWLEDGE_REPOSITORY,
  ...COMPUTER_FACTS,
];

function loadApprovedKnowledgeFacts() {
  const filePath = path.resolve(
    process.cwd(),
    "data",
    "approved-knowledge-facts.json",
  );

  try {
    const raw = fs.readFileSync(
      filePath,
      "utf8",
    );
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? (parsed as KnowledgeFact[]).map(
          normalizeFact,
        )
      : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return [];
    }
    console.warn(
      "[knowledge] failed to load approved runtime facts",
      error,
    );
    return [];
  }
}

export function getRuntimeKnowledgeRepository() {
  const approved =
    loadApprovedKnowledgeFacts();
  const byFactId = new Map(
    FULL_KNOWLEDGE_REPOSITORY.map(
      (fact) => [fact.factId, fact],
    ),
  );

  approved.forEach((fact) => {
    byFactId.set(fact.factId, fact);
  });

  return [...byFactId.values()];
}

export function getFactByEntityId(
  entityId: string,
  facts = getRuntimeKnowledgeRepository(),
) {
  return facts.find(
    (fact) => fact.entityId === entityId,
  );
}

export function filterFacts(
  facts: KnowledgeFact[],
  filters: {
    subject?: KnowledgeSubject;
    topic?: string;
    subtopic?: string;
    factType?: KnowledgeFactType;
    contextGroupId?: string;
    examTag?: string;
    reviewedOnly?: boolean;
  },
) {
  return facts.filter((fact) => {
    if (filters.subject && fact.subject !== filters.subject) return false;
    if (filters.topic && fact.topic !== filters.topic) return false;
    if (filters.subtopic && fact.subtopic !== filters.subtopic) return false;
    if (filters.factType && fact.factType !== filters.factType) return false;
    if (filters.contextGroupId && fact.contextGroupId !== filters.contextGroupId) return false;
    if (filters.examTag && !fact.examTags.includes(filters.examTag)) return false;
    if (filters.reviewedOnly && !fact.verification.reviewed) return false;
    return true;
  });
}
