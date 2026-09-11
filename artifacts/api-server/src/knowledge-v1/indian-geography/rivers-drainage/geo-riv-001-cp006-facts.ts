import { toGeoRiv001Cp006FactSource } from "./geo-riv-001-cp006-source-authorities";

export type GeoRiv001Cp006Fact = Readonly<{
  factId: string;
  entity: string;
  relation: string;
  value: string;
  system: string;
  difficulty: "Easy" | "Medium" | "Hard";
  source: ReturnType<typeof toGeoRiv001Cp006FactSource>;
}>;

const NARMADA = "CWC-NARMADA-WYB-2020-21";
const NARMADA_WQ = "CWC-NARMADA-WQ-2021";
const TAPI = "CWC-TAPI-WYB-2016-17";
const TAPI_TRIB = "CWC-TAPI-APPRAISAL-2012";
const MAHI = "CWC-MAHI-WYB-2017-18";
const SAB = "CWC-SABARMATI-TRACE-METALS-2018";
const WEST = "CWC-HYDRO-DATA-2021-WEST";

function f(id: string, entity: string, relation: string, value: string, system: string, sourceId: string, locator: string, difficulty: GeoRiv001Cp006Fact["difficulty"] = "Easy"): GeoRiv001Cp006Fact {
  return Object.freeze({ factId: `geo-riv-001-cp006-${id}`, entity, relation, value, system, difficulty, source: toGeoRiv001Cp006FactSource(sourceId, locator) });
}

export const GEO_RIV_001_CP006_FACTS_V1: readonly GeoRiv001Cp006Fact[] = Object.freeze([
  f("narmada-source", "Narmada", "originates_at", "Amarkantak", "Narmada", NARMADA, "Narmada originates from a kund at Amarkantak in the Maikal hills"),
  f("narmada-source-range", "Narmada", "source_region", "Maikal hills", "Narmada", NARMADA, "Amarkantak in the Maikal hill"),
  f("narmada-between-ranges", "Narmada", "flows_between", "Vindhya and Satpura ranges", "Narmada", NARMADA, "flows between Vindhya and Satpura hill ranges", "Medium"),
  f("narmada-outfall", "Narmada", "drains_into", "Gulf of Khambhat", "Narmada", NARMADA_WQ, "drains into the Arabian Sea at the Gulf of Khambat near Bharuch"),
  f("narmada-near-bharuch", "Narmada", "outfall_near", "Bharuch", "Narmada", NARMADA_WQ, "Gulf of Khambat near Bharuch", "Medium"),
  f("narmada-tawa", "Tawa", "tributary_of", "Narmada", "Narmada", NARMADA, "Tawa listed among important Narmada tributaries"),
  f("narmada-tawa-bank", "Tawa", "bank_side", "left-bank", "Narmada", NARMADA, "Tawa listed as a left-bank tributary", "Medium"),
  f("narmada-hiran", "Hiran", "tributary_of", "Narmada", "Narmada", NARMADA, "Hiran listed among important Narmada tributaries"),
  f("narmada-hiran-bank", "Hiran", "bank_side", "right-bank", "Narmada", NARMADA, "Hiran listed as a right-bank tributary", "Medium"),
  f("narmada-burhner-bank", "Burhner", "bank_side", "left-bank", "Narmada", NARMADA, "Burhner listed as left-bank tributary", "Medium"),
  f("narmada-baran-bank", "Barna", "bank_side", "right-bank", "Narmada", NARMADA, "Barna listed as right-bank tributary", "Medium"),

  f("tapi-source", "Tapi", "originates_near", "Multai", "Tapi", TAPI, "Tapi river system geographical setting and source near Multai"),
  f("tapi-source-state", "Tapi", "source_state", "Madhya Pradesh", "Tapi", TAPI, "Tapi source in Betul district, Madhya Pradesh"),
  f("tapi-outfall", "Tapi", "drains_into", "Gulf of Khambhat", "Tapi", TAPI, "lower Tapi reaches sea near Surat in the Gulf of Khambhat"),
  f("tapi-purna", "Purna", "tributary_of", "Tapi", "Tapi", TAPI_TRIB, "Purna is a principal tributary of Tapi"),
  f("tapi-purna-bank", "Purna", "bank_side", "left-bank", "Tapi", TAPI_TRIB, "Purna is a left-bank tributary", "Medium"),
  f("tapi-girna", "Girna", "tributary_of", "Tapi", "Tapi", TAPI_TRIB, "Girna is a major tributary of Tapi"),
  f("tapi-girna-bank", "Girna", "bank_side", "left-bank", "Tapi", TAPI_TRIB, "Girna is a left-bank tributary", "Medium"),
  f("tapi-aner-bank", "Aner", "bank_side", "right-bank", "Tapi", TAPI_TRIB, "Aner joins Tapi from the right bank", "Medium"),
  f("tapi-gomai-bank", "Gomai", "bank_side", "right-bank", "Tapi", TAPI_TRIB, "Gomai joins Tapi from the right bank", "Medium"),

  f("mahi-origin-region", "Mahi", "source_region", "Vindhya Range", "Mahi", MAHI, "Mahi basin source region in the Vindhyas"),
  f("mahi-outfall", "Mahi", "drains_into", "Gulf of Khambhat", "Mahi", MAHI, "Mahi flows through Rajasthan and Gujarat to the Gulf of Khambhat"),
  f("mahi-som", "Som", "tributary_of", "Mahi", "Mahi", MAHI, "Som joins the Mahi"),
  f("mahi-som-bank", "Som", "bank_side", "right-bank", "Mahi", MAHI, "Som joins Mahi on the right bank", "Medium"),
  f("mahi-anas", "Anas", "tributary_of", "Mahi", "Mahi", MAHI, "Anas is a tributary of Mahi"),
  f("mahi-anas-bank", "Anas", "bank_side", "left-bank", "Mahi", MAHI, "Anas joins Mahi on the left bank", "Medium"),
  f("mahi-panam", "Panam", "tributary_of", "Mahi", "Mahi", MAHI, "Panam is a tributary of Mahi"),
  f("mahi-panam-bank", "Panam", "bank_side", "left-bank", "Mahi", MAHI, "Panam joins Mahi on the left bank", "Medium"),

  f("sabarmati-source", "Sabarmati", "originates_in", "Aravalli Hills", "Sabarmati", SAB, "Sabarmati originates in the Aravalli Hills in Rajasthan"),
  f("sabarmati-source-state", "Sabarmati", "source_state", "Rajasthan", "Sabarmati", SAB, "Sabarmati origin in Rajasthan"),
  f("sabarmati-ahmedabad", "Sabarmati", "passes_through", "Ahmedabad", "Sabarmati", SAB, "Sabarmati passes through Ahmedabad"),
  f("sabarmati-outfall", "Sabarmati", "drains_into", "Gulf of Khambhat", "Sabarmati", SAB, "Sabarmati joins the Gulf of Khambhat in the Arabian Sea"),
  f("sabarmati-watrak", "Watrak", "tributary_of", "Sabarmati", "Sabarmati", SAB, "Watrak joins Sabarmati"),
  f("sabarmati-watrak-bank", "Watrak", "bank_side", "left-bank", "Sabarmati", SAB, "Watrak joins from the left bank", "Medium"),
  f("sabarmati-hathmati-bank", "Hathmati", "bank_side", "left-bank", "Sabarmati", SAB, "Hathmati joins from the left bank", "Medium"),
  f("sabarmati-sei-bank", "Sei", "bank_side", "right-bank", "Sabarmati", SAB, "Sei joins from the right bank", "Medium"),

  f("luni-source", "Luni", "originates_near", "Ajmer", "Luni", WEST, "Luni originates on the western slopes of the Aravalli ranges near Ajmer"),
  f("luni-source-range", "Luni", "source_region", "Aravalli Range", "Luni", WEST, "Luni source on western slopes of Aravalli ranges"),
  f("luni-terminal", "Luni", "terminal_drainage", "Rann of Kutch", "Luni", WEST, "Luni finally flows into the Rann of Kutch"),
  f("luni-jojari", "Jojari", "tributary_of", "Luni", "Luni", WEST, "Jojari (Mithri) is a tributary of Luni"),
  f("luni-jojari-bank", "Jojari", "bank_side", "right-bank", "Luni", WEST, "Jojari is the notable right-bank tributary of Luni", "Medium"),
  f("luni-jawai-bank", "Jawai", "bank_side", "left-bank", "Luni", WEST, "Jawai is among the main left-bank tributaries of Luni", "Medium"),
  f("luni-bandi-bank", "Bandi", "bank_side", "left-bank", "Luni", WEST, "Bandi is among the main left-bank tributaries of Luni", "Medium"),

  f("netravati-source", "Netravati", "source_region", "Western Ghats", "Netravati", WEST, "Netravati rises between Kudremukh and Ballalaryan Durga in Karnataka"),
  f("netravati-outfall", "Netravati", "drains_into", "Arabian Sea", "Netravati", WEST, "Netravati outfalls into Arabian Sea near Mangalore"),
  f("netravati-mangalore", "Netravati", "outfall_near", "Mangalore", "Netravati", WEST, "outfall into Arabian Sea near Mangalore", "Medium"),
  f("netravati-kumaradhara", "Kumaradhara", "tributary_of", "Netravati", "Netravati", WEST, "Kumaradhara is a major left-bank tributary of Netravati"),
  f("netravati-kumaradhara-bank", "Kumaradhara", "bank_side", "left-bank", "Netravati", WEST, "Kumaradhara joins Netravati from the left bank", "Medium"),
  f("bharathapuzha-west", "Bharathapuzha", "independent_west_flowing", "Arabian Sea", "Bharathapuzha", WEST, "Bharathapuzha listed among major independent west-flowing rivers", "Medium"),
  f("periyar-west", "Periyar", "independent_west_flowing", "Arabian Sea", "Periyar", WEST, "Periyar listed among major independent west-flowing rivers", "Medium"),
  f("pamba-west", "Pamba", "independent_west_flowing", "Arabian Sea", "Pamba", WEST, "Pamba listed among major independent west-flowing rivers", "Medium"),

  f("rift-narmada", "Narmada", "major_rift_valley_river", "yes", "Narmada", NARMADA, "Narmada follows a narrow elongated east-west trough", "Hard"),
  f("rift-tapi", "Tapi", "major_rift_valley_river", "yes", "Tapi", TAPI, "Tapi follows the major west-flowing structural trough south of Narmada", "Hard")
]);

export const GEO_RIV_001_CP006_FACT_COUNT_V1 = GEO_RIV_001_CP006_FACTS_V1.length;
