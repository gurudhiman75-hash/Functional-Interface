export const PGK_001_CP016_SOURCE_IDS = {
  namFirstSikhWar: "NAM-FIRST-SIKH-WAR",
  namAliwal: "NAM-BATTLE-ALIWAL",
  namSecondSikhWar: "NAM-SECOND-SIKH-WAR",
  namGujrat: "NAM-BATTLE-GUJERAT",
  igncaFirstWarGazetteer: "IGNCA-PUNJAB-GAZETTEER-FIRST-SIKH-WAR",
  igncaTreatyBhairowal: "IGNCA-TREATY-BHAIROWAL-1846",
  igncaTreatyAmritsar: "IGNCA-TREATY-AMRITSAR-1846",
  igncaTreatyLahore: "IGNCA-TREATY-LAHORE-1846",
} as const;


export const PGK_001_CP016_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar]: {
    authority: "National Army Museum, London", title: "First Sikh War", url: "https://www.nam.ac.uk/explore/first-sikh-war", classification: "STRONG_INSTITUTIONAL_SECONDARY",
  },
  [PGK_001_CP016_SOURCE_IDS.namAliwal]: {
    authority: "National Army Museum, London", title: "Battle of Aliwal", url: "https://www.nam.ac.uk/explore/battle-aliwal", classification: "STRONG_INSTITUTIONAL_SECONDARY",
  },
  [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar]: {
    authority: "National Army Museum, London", title: "Second Sikh War", url: "https://www.nam.ac.uk/explore/second-sikh-war", classification: "STRONG_INSTITUTIONAL_SECONDARY",
  },
  [PGK_001_CP016_SOURCE_IDS.namGujrat]: {
    authority: "National Army Museum, London", title: "Battle of Gujerat, 21 February 1849", url: "https://collection.nam.ac.uk/detail.php?acc=1971-02-33-181-1", classification: "PRIMARY_MUSEUM_COLLECTION",
  },
  [PGK_001_CP016_SOURCE_IDS.igncaFirstWarGazetteer]: {
    authority: "Indira Gandhi National Centre for the Arts — ASI digital archive", title: "Punjab Gazetteer — First Anglo-Sikh War archival material", url: "https://ignca.gov.in/Asi_data/3224.pdf", classification: "PRIMARY_ARCHIVAL_COPY",
  },
  [PGK_001_CP016_SOURCE_IDS.igncaTreatyBhairowal]: {
    authority: "Indira Gandhi National Centre for the Arts — ASI digital archive", title: "Punjab Gazetteer — Treaty of Bhairowal context", url: "https://ignca.gov.in/Asi_data/30636.pdf", classification: "PRIMARY_ARCHIVAL_COPY",
  },
  [PGK_001_CP016_SOURCE_IDS.igncaTreatyAmritsar]: {
    authority: "Indira Gandhi National Centre for the Arts — ASI digital archive", title: "Treaty of Amritsar, 16 March 1846 — archival reference", url: "https://ignca.gov.in/Asi_data/63964.pdf", classification: "PRIMARY_ARCHIVAL_COPY",
  },
  [PGK_001_CP016_SOURCE_IDS.igncaTreatyLahore]: {
    authority: "National Army Museum / IGNCA archival material", title: "Treaty of Lahore, 1846", url: "https://www.nam.ac.uk/explore/first-sikh-war", supportingUrls: Object.freeze(["https://ignca.gov.in/Asi_data/63964.pdf"]), classification: "STRONG_INSTITUTIONAL_SECONDARY",
  },
} as const);

export const PGK_001_CP016_FACTS = [
  { id: "post-1839-instability", fact: "After Ranjit Singh's death in 1839, the Lahore state entered a period of political instability.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "duleep-singh-maharaja-rani-jindan-regent", fact: "The young Duleep Singh was Maharaja and Rani Jindan served as Regent before the First Anglo-Sikh War.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "first-war-1845-46", fact: "The First Anglo-Sikh War was fought in 1845-46.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "khalsa-crossed-sutlej-dec-1845", fact: "The Khalsa army crossed the Sutlej in December 1845, beginning the First Anglo-Sikh War.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar, PGK_001_CP016_SOURCE_IDS.igncaFirstWarGazetteer] },
  { id: "mudki-18-dec-1845", fact: "The Battle of Mudki was fought on 18 December 1845.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "ferozeshah-21-22-dec-1845", fact: "The Battle of Ferozeshah was fought on 21-22 December 1845.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "aliwal-28-jan-1846", fact: "The Battle of Aliwal was fought on 28 January 1846.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namAliwal] },
  { id: "aliwal-commanders", fact: "Sir Harry Smith led the British force at Aliwal; Ranjodh Singh Majithia led the Sikh force.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namAliwal] },
  { id: "sobraon-10-feb-1846", fact: "The Battle of Sobraon was fought on 10 February 1846 and was the final major battle of the First Anglo-Sikh War.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "gough-hardinge-first-war", fact: "Sir Hugh Gough was Commander-in-Chief and Henry Hardinge was Governor-General during the First Anglo-Sikh War.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "treaty-lahore-9-mar-1846", fact: "The Treaty of Lahore was signed on 9 March 1846 and ended the First Anglo-Sikh War.", sourceIds: [PGK_001_CP016_SOURCE_IDS.igncaTreatyLahore, PGK_001_CP016_SOURCE_IDS.namFirstSikhWar] },
  { id: "lahore-treaty-jalandhar-doab", fact: "Under the Treaty of Lahore, the Lahore state ceded the Jalandhar Doab between the Beas and Sutlej to the East India Company.", sourceIds: [PGK_001_CP016_SOURCE_IDS.igncaTreatyLahore] },
  { id: "lahore-treaty-indemnity", fact: "The Treaty of Lahore imposed a war indemnity on the Lahore state.", sourceIds: [PGK_001_CP016_SOURCE_IDS.igncaTreatyLahore] },
  { id: "treaty-amritsar-16-mar-1846", fact: "The Treaty of Amritsar between the East India Company and Gulab Singh was signed on 16 March 1846.", sourceIds: [PGK_001_CP016_SOURCE_IDS.igncaTreatyAmritsar] },
  { id: "gulab-singh-jammu-kashmir", fact: "The Treaty of Amritsar recognised Gulab Singh as Maharaja of Jammu and Kashmir under the 1846 settlement.", sourceIds: [PGK_001_CP016_SOURCE_IDS.igncaTreatyAmritsar] },
  { id: "bhairowal-dec-1846", fact: "The Agreement of Bhairowal was concluded in December 1846 and greatly strengthened British supervision over the Lahore administration during Duleep Singh's minority.", sourceIds: [PGK_001_CP016_SOURCE_IDS.igncaTreatyBhairowal] },
  { id: "second-war-1848-49", fact: "The Second Anglo-Sikh War was fought in 1848-49.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "mulraj-multan-revolt-1848", fact: "The Second Anglo-Sikh War grew from the 1848 revolt at Multan led by Diwan Mulraj.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "sher-singh-attariwala-revolt", fact: "Sher Singh Attariwala later joined the rebellion during the Second Anglo-Sikh War.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "ramnagar-22-nov-1848", fact: "The Battle of Ramnagar was fought on 22 November 1848.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "chillianwala-13-jan-1849", fact: "The Battle of Chillianwala was fought on 13 January 1849.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "multan-surrender-jan-1849", fact: "Multan surrendered in January 1849 after the siege.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "gujrat-21-feb-1849", fact: "The Battle of Gujrat was fought on 21 February 1849 and was the decisive final major battle of the Second Anglo-Sikh War.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namGujrat] },
  { id: "rawalpindi-surrender-mar-1849", fact: "The remaining Sikh forces surrendered at Rawalpindi in March 1849.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namGujrat] },
  { id: "punjab-annexed-29-mar-1849", fact: "Punjab was annexed by the East India Company on 29 March 1849.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "dalhousie-annexation", fact: "Lord Dalhousie was Governor-General when Punjab was annexed in 1849.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
  { id: "duleep-singh-deposed-1849", fact: "Maharaja Duleep Singh was deposed after the annexation of Punjab in 1849.", sourceIds: [PGK_001_CP016_SOURCE_IDS.namSecondSikhWar] },
] as const;
