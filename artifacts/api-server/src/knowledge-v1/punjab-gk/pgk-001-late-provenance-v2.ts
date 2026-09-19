import { PGK_001_CP018_FACT_IDS } from "./pgk-001-cp018-facts";
import { PGK_001_CP019_FACT_IDS } from "./pgk-001-cp019-facts";
import { PGK_001_CP020_FACT_IDS } from "./pgk-001-cp020-facts";
import { PGK_001_CP021_FACT_IDS } from "./pgk-001-cp021-facts";
import { PGK_001_CP022_FACTS } from "./pgk-001-cp022-facts";
import { PGK_001_CP023_FACTS } from "./pgk-001-cp023-facts";
import { PGK_001_CP024_FACTS } from "./pgk-001-cp024-facts";
import { PGK_001_CP025_FACTS } from "./pgk-001-cp025-facts";
import { PGK_001_CP026_FACTS } from "./pgk-001-cp026-facts";

export type Pgk001LateProvenance = Readonly<{
  factIds: readonly string[];
  sourceIds: readonly string[];
}>;

const A = (...values: string[]) => Object.freeze(values);

export const PGK_001_LATE_SOURCE_REGISTRY_V2 = Object.freeze({
  "GOV-PUNJAB-CULTURE": Object.freeze({
    authority: "Government of Punjab",
    title: "Culture",
    url: "https://punjab.gov.in/culture",
  }),
  "PAU-RURAL-HERITAGE-MUSEUM": Object.freeze({
    authority: "Punjab Agricultural University",
    title: "Museum of Social History and Rural Life of Punjab",
    url: "https://pau.edu/index.php?DO=viewEventDetail&_act=manageEvent&intID=8601",
  }),
  "INCREDIBLE-INDIA-PUNJAB-CULTURE": Object.freeze({
    authority: "Ministry of Tourism, Government of India",
    title: "Punjab cultural and heritage material",
    url: "https://www.incredibleindia.gov.in/en/punjab",
  }),
  "NIC-RUPNAGAR-HERITAGE": Object.freeze({
    authority: "District Rupnagar, Government of Punjab",
    title: "Places of Interest / Virasat-e-Khalsa",
    url: "https://rupnagar.nic.in/tourism/places-of-interest/",
  }),
  "NIC-MUKTSAR-HERITAGE": Object.freeze({
    authority: "District Sri Muktsar Sahib, Government of Punjab",
    title: "District heritage material",
    url: "https://sri-muktsar-sahib.nic.in/",
  }),
  "NIC-FATEHGARH-HERITAGE": Object.freeze({
    authority: "District Fatehgarh Sahib, Government of Punjab",
    title: "Gurudwara Sri Fatehgarh Sahib",
    url: "https://fatehgarhsahib.nic.in/tourist-place/gurudwara-fatehgarh-sahib/",
  }),
  "NIC-JALANDHAR-CULTURE": Object.freeze({
    authority: "District Jalandhar, Government of Punjab",
    title: "Culture & Heritage",
    url: "https://jalandhar.nic.in/culture-heritage/",
  }),
  "NIC-AMRITSAR-HERITAGE": Object.freeze({
    authority: "District Amritsar, Government of Punjab",
    title: "Tourist Places",
    url: "https://amritsar.nic.in/tourist-places/",
  }),
  "NIC-PATIALA-HERITAGE": Object.freeze({
    authority: "District Patiala, Government of Punjab",
    title: "Architecture / Tourist Places",
    url: "https://patiala.nic.in/architecture/",
  }),
  "NIC-LUDHIANA-KILA-RAIPUR": Object.freeze({
    authority: "District Ludhiana, Government of Punjab",
    title: "District culture and tourism material",
    url: "https://ludhiana.nic.in/",
  }),
  "PIB-MILKHA-SINGH": Object.freeze({
    authority: "Press Information Bureau, Government of India",
    title: "Milkha Singh institutional profile",
    url: "https://pib.gov.in/",
  }),
  "WORLD-ATHLETICS-MILKHA": Object.freeze({
    authority: "World Athletics",
    title: "Milkha Singh athlete record",
    url: "https://worldathletics.org/",
  }),
  "HOCKEY-INDIA-BALBIR": Object.freeze({
    authority: "Hockey India",
    title: "Balbir Singh Sr. Olympic profile",
    url: "https://www.hockeyindia.org/",
  }),
  "HOCKEY-INDIA-AJIT-PAL": Object.freeze({
    authority: "Hockey India",
    title: "Ajit Pal Singh / 1975 World Cup record",
    url: "https://www.hockeyindia.org/",
  }),
  "HOCKEY-INDIA-CAPTAINS": Object.freeze({
    authority: "Hockey India",
    title: "India hockey captain and Olympic records",
    url: "https://www.hockeyindia.org/",
  }),
  "WORLD-ATHLETICS-RANDHAWA": Object.freeze({
    authority: "World Athletics",
    title: "Gurbachan Singh Randhawa athlete record",
    url: "https://worldathletics.org/",
  }),
  "CRPF-SPORTS-PERSONALITIES": Object.freeze({
    authority: "Central Reserve Police Force",
    title: "Sports personalities and award records",
    url: "https://crpf.gov.in/",
  }),
  "GOV-PUNJAB-MRS-AWARD": Object.freeze({
    authority: "Government of Punjab",
    title: "Maharaja Ranjit Singh Award / sports policy material",
    url: "https://punjab.gov.in/",
  }),
  "NIC-AMRITSAR-DISTRICT": Object.freeze({ authority: "District Amritsar, Government of Punjab", title: "District portal", url: "https://amritsar.nic.in/" }),
  "NIC-TARN-TARAN-DISTRICT": Object.freeze({ authority: "District Tarn Taran, Government of Punjab", title: "District portal", url: "https://tarntaran.nic.in/" }),
  "NIC-GURDASPUR-DISTRICT": Object.freeze({ authority: "District Gurdaspur, Government of Punjab", title: "District portal", url: "https://gurdaspur.nic.in/" }),
  "NIC-PATHANKOT-DISTRICT": Object.freeze({ authority: "District Pathankot, Government of Punjab", title: "District portal", url: "https://pathankot.nic.in/" }),
  "NIC-JALANDHAR-DISTRICT": Object.freeze({ authority: "District Jalandhar, Government of Punjab", title: "District portal", url: "https://jalandhar.nic.in/" }),
  "NIC-KAPURTHALA-DISTRICT": Object.freeze({ authority: "District Kapurthala, Government of Punjab", title: "District portal", url: "https://kapurthala.gov.in/" }),
  "NIC-HOSHIARPUR-DISTRICT": Object.freeze({ authority: "District Hoshiarpur, Government of Punjab", title: "District portal", url: "https://hoshiarpur.nic.in/" }),
  "NIC-SBS-NAGAR-DISTRICT": Object.freeze({ authority: "District Shaheed Bhagat Singh Nagar, Government of Punjab", title: "District portal", url: "https://nawanshahr.nic.in/" }),
  "NIC-LUDHIANA-DISTRICT": Object.freeze({ authority: "District Ludhiana, Government of Punjab", title: "District portal", url: "https://ludhiana.nic.in/" }),
  "NIC-MOGA-DISTRICT": Object.freeze({ authority: "District Moga, Government of Punjab", title: "District portal", url: "https://moga.nic.in/" }),
  "NIC-BARNALA-DISTRICT": Object.freeze({ authority: "District Barnala, Government of Punjab", title: "District portal", url: "https://barnala.gov.in/" }),
  "NIC-SANGRUR-DISTRICT": Object.freeze({ authority: "District Sangrur, Government of Punjab", title: "District portal", url: "https://sangrur.nic.in/" }),
  "NIC-MALERKOTLA-DISTRICT": Object.freeze({ authority: "District Malerkotla, Government of Punjab", title: "District portal", url: "https://malerkotla.nic.in/" }),
  "NIC-PATIALA-DISTRICT": Object.freeze({ authority: "District Patiala, Government of Punjab", title: "District portal", url: "https://patiala.nic.in/" }),
  "NIC-FATEHGARH-DISTRICT": Object.freeze({ authority: "District Fatehgarh Sahib, Government of Punjab", title: "District portal", url: "https://fatehgarhsahib.nic.in/" }),
  "IISER-MOHALI": Object.freeze({ authority: "IISER Mohali", title: "Institutional portal", url: "https://www.iisermohali.ac.in/" }),
  "NIC-RUPNAGAR-DISTRICT": Object.freeze({ authority: "District Rupnagar, Government of Punjab", title: "District portal", url: "https://rupnagar.nic.in/" }),
  "NIC-BATHINDA-DISTRICT": Object.freeze({ authority: "District Bathinda, Government of Punjab", title: "District portal", url: "https://bathinda.nic.in/" }),
  "NIC-MANSA-DISTRICT": Object.freeze({ authority: "District Mansa, Government of Punjab", title: "District portal", url: "https://mansa.nic.in/" }),
  "NIC-FARIDKOT-DISTRICT": Object.freeze({ authority: "District Faridkot, Government of Punjab", title: "District portal", url: "https://faridkot.nic.in/" }),
  "NIC-FEROZEPUR-DISTRICT": Object.freeze({ authority: "District Ferozepur, Government of Punjab", title: "District portal", url: "https://ferozepur.nic.in/" }),
  "NIC-FAZILKA-DISTRICT": Object.freeze({ authority: "District Fazilka, Government of Punjab", title: "District portal", url: "https://fazilka.nic.in/" }),
  "NIC-MUKTSAR-DISTRICT": Object.freeze({ authority: "District Sri Muktsar Sahib, Government of Punjab", title: "District portal", url: "https://sri-muktsar-sahib.nic.in/" }),
} as const);

const cp018All = [...PGK_001_CP018_FACT_IDS];
const cp019All = [...PGK_001_CP019_FACT_IDS];
const cp020All = [...PGK_001_CP020_FACT_IDS];
const cp021All = [...PGK_001_CP021_FACT_IDS];
const cp022All = PGK_001_CP022_FACTS.map((f) => f.id);
const cp023All = PGK_001_CP023_FACTS.map((f) => f.id);
const cp024All = PGK_001_CP024_FACTS.map((f) => f.id);
const cp025All = PGK_001_CP025_FACTS.map((f) => f.id);
const cp026All = PGK_001_CP026_FACTS.map((f) => f.id);

export const PGK_001_LATE_PROVENANCE_V2: Readonly<Record<string, Pgk001LateProvenance>> = Object.freeze({
  "PGK-001-QL-119": { factIds: A("partition-1947","east-punjab-india","west-punjab-pakistan","lahore-pakistan","partition-displacement"), sourceIds: A("punjab-government-history","chandigarh-administration-history") },
  "PGK-001-QL-120": { factIds: A("lahore-pakistan","chandigarh-site-1948","chandigarh-foundation-1952","chandigarh-capital-pre1966"), sourceIds: A("punjab-government-history","chandigarh-administration-history") },
  "PGK-001-QL-121": { factIds: A("pepsu-full-form","pepsu-inaugurated-1948","pepsu-eight-states","pepsu-patiala-member"), sourceIds: A("government-india-white-paper-pepsu","punjab-government-history") },
  "PGK-001-QL-122": { factIds: A("pepsu-merged-1956","pepsu-merger-date","pepsu-high-court-merged"), sourceIds: A("india-code-states-reorganisation-1956","punjab-government-history","punjab-haryana-high-court-history") },
  "PGK-001-QL-123": { factIds: A("punjab-reorganisation-act-1966","appointed-day-1966","haryana-formed-1966","chandigarh-ut-1966","hill-territories-himachal"), sourceIds: A("india-code-punjab-reorganisation-1966","chandigarh-administration-history") },
  "PGK-001-QL-124": { factIds: A("haryana-formed-1966","chandigarh-ut-1966","chandigarh-shared-capital","hill-territories-himachal"), sourceIds: A("india-code-punjab-reorganisation-1966","chandigarh-administration-history") },
  "PGK-001-QL-125": { factIds: A(...cp018All), sourceIds: A("punjab-government-history","chandigarh-administration-history","government-india-white-paper-pepsu","india-code-states-reorganisation-1956","india-code-punjab-reorganisation-1966","punjab-haryana-high-court-history") },

  "PGK-001-QL-126": { factIds: A("assembly-unicameral","council-abolished-1970","assembly-117","assembly-sc-34","legislature-governor-assembly"), sourceIds: A("india-code-constitution-part-vi-ix-ixa","punjab-vidhan-sabha-official","india-code-punjab-legislative-council-abolition-1969","eci-delimitation-punjab-2008-current-framework") },
  "PGK-001-QL-127": { factIds: A("executive-governor","cm-appointed-governor","ministers-on-cm-advice","council-aid-advice","collective-responsibility","advocate-general"), sourceIds: A("india-code-constitution-part-vi-ix-ixa") },
  "PGK-001-QL-128": { factIds: A("assembly-term","speaker-deputy","executive-governor"), sourceIds: A("india-code-constitution-part-vi-ix-ixa","punjab-vidhan-sabha-official") },
  "PGK-001-QL-129": { factIds: A("lok-sabha-13","lok-sabha-sc-4","rajya-sabha-7","eci-assembly-parliament"), sourceIds: A("eci-delimitation-punjab-2008-current-framework","rajya-sabha-seat-allocation") },
  "PGK-001-QL-130": { factIds: A("hc-name","hc-seat","hc-jurisdiction","hc-court-record","hc-judges"), sourceIds: A("punjab-haryana-high-court-official","india-code-constitution-part-vi-ix-ixa") },
  "PGK-001-QL-131": { factIds: A("panchayat-three-tier","panchayat-act-1994","gram-village","samiti-intermediate","zila-district","part-ix"), sourceIds: A("punjab-rural-development-panchayats","india-code-constitution-part-vi-ix-ixa") },
  "PGK-001-QL-132": { factIds: A("urban-types","sec-local","eci-assembly-parliament","part-ixa","gram-village","samiti-intermediate","zila-district"), sourceIds: A("punjab-local-government","punjab-rural-development-panchayats","india-code-constitution-part-vi-ix-ixa","eci-delimitation-punjab-2008-current-framework") },

  "PGK-001-QL-133": { factIds: A("population-total","population-male","population-female","decadal-growth","density"), sourceIds: A("orgi-census-2011-punjab-pca","orgi-census-2011-punjab-dchb") },
  "PGK-001-QL-134": { factIds: A("sex-ratio-total","sex-ratio-rural","sex-ratio-urban","child-sex-ratio-total","child-sex-ratio-rural","child-sex-ratio-urban"), sourceIds: A("orgi-census-2011-punjab-pca","orgi-census-2011-punjab-dchb","orgi-census-2011-child-sex-ratio") },
  "PGK-001-QL-135": { factIds: A("literacy-total","literacy-male","literacy-female","literacy-rural","literacy-urban","literacy-definition"), sourceIds: A("orgi-census-2011-c08-punjab","punjab-economic-survey-census-2011-tables") },
  "PGK-001-QL-136": { factIds: A("rural-population","urban-population","rural-share","urban-share","literacy-rural","literacy-urban","sex-ratio-rural","sex-ratio-urban"), sourceIds: A("orgi-census-2011-punjab-dchb","punjab-economic-survey-census-2011-tables") },
  "PGK-001-QL-137": { factIds: A("sc-population","sc-share","population-total","rural-share","urban-share"), sourceIds: A("orgi-census-2011-sc-punjab","punjab-economic-survey-census-2011-tables","orgi-census-2011-punjab-pca") },
  "PGK-001-QL-138": { factIds: A("district-population-high","district-population-low","district-sex-ratio-high","district-sex-ratio-low","district-literacy-high","district-literacy-low","district-density-high","district-density-low"), sourceIds: A("orgi-census-2011-punjab-dchb","punjab-economic-survey-census-2011-tables") },
  "PGK-001-QL-139": { factIds: A(...cp020All), sourceIds: A("orgi-census-2011-punjab-pca","orgi-census-2011-punjab-dchb","orgi-census-2011-child-sex-ratio","orgi-census-2011-c08-punjab","orgi-census-2011-sc-punjab","punjab-economic-survey-census-2011-tables") },

  "PGK-001-QL-140": { factIds: A("official-language-punjabi","official-language-gurmukhi"), sourceIds: A("india-code-punjab-official-language-act-1967","government-punjab-know-punjab-language") },
  "PGK-001-QL-141": { factIds: A("gurmukhi-guru-angad","gurmukhi-khadur"), sourceIds: A("official-history-guru-angad-gurmukhi") },
  "PGK-001-QL-142": { factIds: A("painti-35","vowel-bearers","additional-consonants","nukta"), sourceIds: A("punjabi-university-language-teaching-material","unicode-gurmukhi-core-spec","unicode-gurmukhi-names-list") },
  "PGK-001-QL-143": { factIds: A("vowel-bearers","matra-kanna","matra-sihari","matra-bihari","matra-aunkar","matra-dulainkar","matra-lavan","matra-dulavan","matra-hora","matra-kanaura"), sourceIds: A("unicode-gurmukhi-names-list","punjabi-university-language-teaching-material") },
  "PGK-001-QL-144": { factIds: A("bindi","tippi","addak","nukta","additional-consonants"), sourceIds: A("unicode-gurmukhi-names-list","punjabi-university-language-teaching-material") },
  "PGK-001-QL-145": { factIds: A("punjabi-tonal","gurmukhi-tone","gurmukhi-direction","gurmukhi-digits"), sourceIds: A("government-punjab-know-punjab-language","unicode-gurmukhi-core-spec","unicode-gurmukhi-names-list") },
  "PGK-001-QL-146": { factIds: A(...cp021All), sourceIds: A("india-code-punjab-official-language-act-1967","government-punjab-know-punjab-language","unicode-gurmukhi-core-spec","unicode-gurmukhi-names-list","official-history-guru-angad-gurmukhi","punjabi-university-language-teaching-material") },

  "PGK-001-QL-147": { factIds: A("baba-farid-early-punjabi-poet","bulleh-shah-kafi","classical-sufi-poets"), sourceIds: A("PUNJABI-LITERATURE-REFERENCE","PUNJAB-AUQAF-BULLEH-SHAH") },
  "PGK-001-QL-148": { factIds: A("waris-shah-heer","heer-qissa"), sourceIds: A("WARIS-SHAH-REFERENCE") },
  "PGK-001-QL-149": { factIds: A("bhai-vir-singh-sundari","bhai-vir-singh-rana-surat-singh","bhai-vir-singh-sahitya-1955"), sourceIds: A("BHAI-VIR-SINGH-REFERENCE","SAHITYA-AKADEMI-PUNJABI-AWARDS") },
  "PGK-001-QL-150": { factIds: A("nanak-singh-novelist","nanak-singh-ik-miyan-do-talwaran","nanak-singh-chitta-lahu"), sourceIds: A("SAHITYA-AKADEMI-NANAK-SINGH","SAHITYA-AKADEMI-PUNJABI-AWARDS") },
  "PGK-001-QL-151": { factIds: A("amrita-pritam-pinjar","amrita-pritam-warish-shah-poem","amrita-pritam-sunehure-1956","amrita-pritam-jnanpith-1981"), sourceIds: A("SAHITYA-AKADEMI-PINJAR","AMRITA-PRITAM-REFERENCE","SAHITYA-AKADEMI-PUNJABI-AWARDS","JNANPITH-LAUREATES") },
  "PGK-001-QL-152": { factIds: A("shiv-kumar-loona","shiv-kumar-sahitya-1967","gurdial-singh-marhi-da-deeva","gurdial-singh-adh-chanani-raat","gurdial-singh-jnanpith-1999"), sourceIds: A("SAHITYA-AKADEMI-LOONA","SAHITYA-AKADEMI-PUNJABI-AWARDS","SAHITYA-AKADEMI-MARHI","JNANPITH-LAUREATES") },
  "PGK-001-QL-153": { factIds: A(...cp022All), sourceIds: A("PUNJABI-LITERATURE-REFERENCE","PUNJAB-AUQAF-BULLEH-SHAH","WARIS-SHAH-REFERENCE","BHAI-VIR-SINGH-REFERENCE","SAHITYA-AKADEMI-PUNJABI-AWARDS","SAHITYA-AKADEMI-NANAK-SINGH","SAHITYA-AKADEMI-PINJAR","AMRITA-PRITAM-REFERENCE","JNANPITH-LAUREATES","SAHITYA-AKADEMI-LOONA","SAHITYA-AKADEMI-MARHI") },

  "PGK-001-QL-154": { factIds: A("bhangra-harvest-dhol","dhol-instrument"), sourceIds: A("GOV-PUNJAB-CULTURE","PAU-RURAL-HERITAGE-MUSEUM") },
  "PGK-001-QL-155": { factIds: A("giddha-women-boliyan","kikli-paired-spin","boliyan-form"), sourceIds: A("GOV-PUNJAB-CULTURE","INCREDIBLE-INDIA-PUNJAB-CULTURE") },
  "PGK-001-QL-156": { factIds: A("jhumar-style","sammi-style","luddi-style"), sourceIds: A("GOV-PUNJAB-CULTURE") },
  "PGK-001-QL-157": { factIds: A("dhol-instrument","dholak-instrument","algoza-instrument","tumbi-instrument","chimta-instrument","sarangi-instrument","ghara-instrument","rural-museum-instruments"), sourceIds: A("PAU-RURAL-HERITAGE-MUSEUM","INCREDIBLE-INDIA-PUNJAB-CULTURE") },
  "PGK-001-QL-158": { factIds: A("boliyan-form","tappa-form","giddha-women-boliyan","bhangra-harvest-dhol"), sourceIds: A("GOV-PUNJAB-CULTURE","INCREDIBLE-INDIA-PUNJAB-CULTURE") },
  "PGK-001-QL-159": { factIds: A("phulkari-craft","punjabi-jutti","men-dress","women-dress"), sourceIds: A("GOV-PUNJAB-CULTURE","PAU-RURAL-HERITAGE-MUSEUM","INCREDIBLE-INDIA-PUNJAB-CULTURE") },
  "PGK-001-QL-160": { factIds: A(...cp023All), sourceIds: A("GOV-PUNJAB-CULTURE","PAU-RURAL-HERITAGE-MUSEUM","INCREDIBLE-INDIA-PUNJAB-CULTURE") },

  "PGK-001-QL-161": { factIds: A("hola-anandpur","keshgarh-khalsa-1699","virasat-anandpur","virasat-open-2011","virasat-architect"), sourceIds: A("NIC-RUPNAGAR-HERITAGE") },
  "PGK-001-QL-162": { factIds: A("maghi-muktsar","forty-mukte","muktsar-name"), sourceIds: A("NIC-MUKTSAR-HERITAGE") },
  "PGK-001-QL-163": { factIds: A("shaheedi-fatehgarh","shaheedi-december","fatehgarh-bhora"), sourceIds: A("NIC-FATEHGARH-HERITAGE") },
  "PGK-001-QL-164": { factIds: A("baisakhi-harvest","baisakhi-khalsa","harballabh-jalandhar","harballabh-1875","baba-sodal-jalandhar","kila-raipur"), sourceIds: A("GOV-PUNJAB-CULTURE","NIC-JALANDHAR-CULTURE","NIC-LUDHIANA-KILA-RAIPUR") },
  "PGK-001-QL-165": { factIds: A("harmandir-amritsar","jallianwala-amritsar","gobindgarh-amritsar","ram-tirath-amritsar"), sourceIds: A("NIC-AMRITSAR-HERITAGE") },
  "PGK-001-QL-166": { factIds: A("keshgarh-khalsa-1699","virasat-anandpur","qila-mubarak-patiala","qila-mubarak-1763","sheesh-mahal-patiala","moti-bagh-patiala"), sourceIds: A("NIC-RUPNAGAR-HERITAGE","NIC-PATIALA-HERITAGE") },
  "PGK-001-QL-167": { factIds: A(...cp024All), sourceIds: A("NIC-RUPNAGAR-HERITAGE","NIC-MUKTSAR-HERITAGE","NIC-FATEHGARH-HERITAGE","NIC-JALANDHAR-CULTURE","NIC-AMRITSAR-HERITAGE","NIC-PATIALA-HERITAGE","GOV-PUNJAB-CULTURE") },

  "PGK-001-QL-168": { factIds: A("milkha-flying-sikh","milkha-rome-1960"), sourceIds: A("PIB-MILKHA-SINGH","WORLD-ATHLETICS-MILKHA") },
  "PGK-001-QL-169": { factIds: A("balbir-three-golds","balbir-1956-captain"), sourceIds: A("HOCKEY-INDIA-BALBIR") },
  "PGK-001-QL-170": { factIds: A("ajit-pal-1975"), sourceIds: A("HOCKEY-INDIA-AJIT-PAL") },
  "PGK-001-QL-171": { factIds: A("pargat-olympic-captain","manpreet-tokyo","harmanpreet-paris"), sourceIds: A("HOCKEY-INDIA-CAPTAINS") },
  "PGK-001-QL-172": { factIds: A("randhawa-1962","randhawa-tokyo-1964"), sourceIds: A("WORLD-ATHLETICS-RANDHAWA","CRPF-SPORTS-PERSONALITIES") },
  "PGK-001-QL-173": { factIds: A("maharaja-ranjit-award","paramjeet-2006"), sourceIds: A("GOV-PUNJAB-MRS-AWARD","CRPF-SPORTS-PERSONALITIES") },
  "PGK-001-QL-174": { factIds: A(...cp025All), sourceIds: A("PIB-MILKHA-SINGH","WORLD-ATHLETICS-MILKHA","HOCKEY-INDIA-BALBIR","HOCKEY-INDIA-AJIT-PAL","HOCKEY-INDIA-CAPTAINS","WORLD-ATHLETICS-RANDHAWA","CRPF-SPORTS-PERSONALITIES","GOV-PUNJAB-MRS-AWARD") },

  "PGK-001-QL-175": { factIds: A("amritsar-harmandir-jallianwala","tarn-taran-goindwal","gurdaspur-kalanaur","pathankot-ranjit-sagar"), sourceIds: A("NIC-AMRITSAR-DISTRICT","NIC-TARN-TARAN-DISTRICT","NIC-GURDASPUR-DISTRICT","NIC-PATHANKOT-DISTRICT") },
  "PGK-001-QL-176": { factIds: A("jalandhar-sports-goods","kapurthala-science-city","hoshiarpur-wood-inlay","sbs-khatkar-kalan"), sourceIds: A("NIC-JALANDHAR-DISTRICT","NIC-KAPURTHALA-DISTRICT","NIC-HOSHIARPUR-DISTRICT","NIC-SBS-NAGAR-DISTRICT") },
  "PGK-001-QL-177": { factIds: A("ludhiana-pau-bicycles","moga-food-processing","barnala-textile-combine","sangrur-sunam","malerkotla-princely"), sourceIds: A("NIC-LUDHIANA-DISTRICT","NIC-MOGA-DISTRICT","NIC-BARNALA-DISTRICT","NIC-SANGRUR-DISTRICT","NIC-MALERKOTLA-DISTRICT") },
  "PGK-001-QL-178": { factIds: A("patiala-nis-qila","fatehgarh-mandi-gobindgarh","sas-iiser","rupnagar-harappan"), sourceIds: A("NIC-PATIALA-DISTRICT","NIC-FATEHGARH-DISTRICT","IISER-MOHALI","NIC-RUPNAGAR-DISTRICT") },
  "PGK-001-QL-179": { factIds: A("bathinda-qila-damdama","mansa-cotton","faridkot-baba-farid","ferozepur-hussainiwala","fazilka-abohar","muktsar-chali-mukte"), sourceIds: A("NIC-BATHINDA-DISTRICT","NIC-MANSA-DISTRICT","NIC-FARIDKOT-DISTRICT","NIC-FEROZEPUR-DISTRICT","NIC-FAZILKA-DISTRICT","NIC-MUKTSAR-DISTRICT") },
  "PGK-001-QL-180": { factIds: A("jalandhar-sports-goods","ludhiana-pau-bicycles","moga-food-processing","barnala-textile-combine","fatehgarh-mandi-gobindgarh","sas-iiser","kapurthala-science-city"), sourceIds: A("NIC-JALANDHAR-DISTRICT","NIC-LUDHIANA-DISTRICT","NIC-MOGA-DISTRICT","NIC-BARNALA-DISTRICT","NIC-FATEHGARH-DISTRICT","IISER-MOHALI","NIC-KAPURTHALA-DISTRICT") },
  "PGK-001-QL-181": { factIds: A("amritsar-harmandir-jallianwala","tarn-taran-goindwal","gurdaspur-kalanaur","kapurthala-science-city","rupnagar-harappan","ferozepur-hussainiwala","fazilka-abohar","muktsar-chali-mukte"), sourceIds: A("NIC-AMRITSAR-DISTRICT","NIC-TARN-TARAN-DISTRICT","NIC-GURDASPUR-DISTRICT","NIC-KAPURTHALA-DISTRICT","NIC-RUPNAGAR-DISTRICT","NIC-FEROZEPUR-DISTRICT","NIC-FAZILKA-DISTRICT","NIC-MUKTSAR-DISTRICT") },
  "PGK-001-QL-182": { factIds: A(...cp026All), sourceIds: A("NIC-AMRITSAR-DISTRICT","NIC-TARN-TARAN-DISTRICT","NIC-GURDASPUR-DISTRICT","NIC-PATHANKOT-DISTRICT","NIC-JALANDHAR-DISTRICT","NIC-KAPURTHALA-DISTRICT","NIC-HOSHIARPUR-DISTRICT","NIC-SBS-NAGAR-DISTRICT","NIC-LUDHIANA-DISTRICT","NIC-MOGA-DISTRICT","NIC-BARNALA-DISTRICT","NIC-SANGRUR-DISTRICT","NIC-MALERKOTLA-DISTRICT","NIC-PATIALA-DISTRICT","NIC-FATEHGARH-DISTRICT","IISER-MOHALI","NIC-RUPNAGAR-DISTRICT","NIC-BATHINDA-DISTRICT","NIC-MANSA-DISTRICT","NIC-FARIDKOT-DISTRICT","NIC-FEROZEPUR-DISTRICT","NIC-FAZILKA-DISTRICT","NIC-MUKTSAR-DISTRICT") },
});

const validByCp = Object.freeze({
  "PGK-001-CP-018": new Set(cp018All),
  "PGK-001-CP-019": new Set(cp019All),
  "PGK-001-CP-020": new Set(cp020All),
  "PGK-001-CP-021": new Set(cp021All),
  "PGK-001-CP-022": new Set(cp022All),
  "PGK-001-CP-023": new Set(cp023All),
  "PGK-001-CP-024": new Set(cp024All),
  "PGK-001-CP-025": new Set(cp025All),
  "PGK-001-CP-026": new Set(cp026All),
});

for (const [qlId, provenance] of Object.entries(PGK_001_LATE_PROVENANCE_V2)) {
  const ql = Number(qlId.slice(-3));
  const cpNum =
    ql <= 125 ? 18 :
    ql <= 132 ? 19 :
    ql <= 139 ? 20 :
    ql <= 146 ? 21 :
    ql <= 153 ? 22 :
    ql <= 160 ? 23 :
    ql <= 167 ? 24 :
    ql <= 174 ? 25 : 26;
  const cpId = `PGK-001-CP-${String(cpNum).padStart(3, "0")}` as keyof typeof validByCp;
  const valid = validByCp[cpId];
  if (!provenance.factIds.length || !provenance.sourceIds.length) {
    throw new Error(`${qlId}: late provenance must include fact and source authorities`);
  }
  for (const factId of provenance.factIds) {
    if (!valid.has(factId)) throw new Error(`${qlId}: unknown ${cpId} fact id ${factId}`);
  }
}
