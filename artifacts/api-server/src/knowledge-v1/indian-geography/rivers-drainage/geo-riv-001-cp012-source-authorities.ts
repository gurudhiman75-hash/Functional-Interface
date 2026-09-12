import type { KnowledgeFactSource } from "../../types";

export type GeoRiv001Cp012SourceId =
  | "VARANASI-DISTRICT-GANGA"
  | "PRAYAGRAJ-DISTRICT-GEOGRAPHY"
  | "PATNA-DISTRICT-GANGA"
  | "DELHI-IFC-YAMUNA"
  | "NASHIK-DISTRICT-GEOGRAPHY"
  | "TRICHY-DISTRICT-CAUVERY"
  | "RBI-AHMEDABAD-SABARMATI"
  | "JABALPUR-DISTRICT-NARMADA"
  | "ODISHA-CUTTACK-MAHANADI"
  | "SRINAGAR-DISTRICT-JHELUM"
  | "ASSAM-GUWAHATI-BRAHMAPUTRA"
  | "AP-VIJAYAWADA-KRISHNA"
  | "HARIDWAR-DISTRICT-GANGA"
  | "AGRA-DISTRICT-YAMUNA"
  | "MATHURA-DISTRICT-YAMUNA"
  | "SURAT-DISTRICT-TAPI"
  | "KMC-HOOGHLY-RIVERFRONT";

type Source = Readonly<{ sourceId: GeoRiv001Cp012SourceId; title: string; url: string; sourceType: KnowledgeFactSource["sourceType"] }>;

export const GEO_RIV_001_CP012_SOURCE_AUTHORITIES_V1: readonly Source[] = Object.freeze([
  { sourceId: "VARANASI-DISTRICT-GANGA", title: "District Varanasi — Ganga Ghat", url: "https://varanasi.nic.in/tourist-place/ganga-ghat/", sourceType: "official" },
  { sourceId: "PRAYAGRAJ-DISTRICT-GEOGRAPHY", title: "District Prayagraj — Geography", url: "https://prayagraj.nic.in/geography/", sourceType: "official" },
  { sourceId: "PATNA-DISTRICT-GANGA", title: "District Patna — About District", url: "https://patna.nic.in/", sourceType: "official" },
  { sourceId: "DELHI-IFC-YAMUNA", title: "Delhi Irrigation and Flood Control — River Yamuna", url: "https://ifc.delhi.gov.in/ifc/functions-and-activities", sourceType: "official" },
  { sourceId: "NASHIK-DISTRICT-GEOGRAPHY", title: "District Nashik — About District", url: "https://nashik.gov.in/en/about-district/", sourceType: "official" },
  { sourceId: "TRICHY-DISTRICT-CAUVERY", title: "District Tiruchirappalli — About District", url: "https://tiruchirappalli.nic.in/", sourceType: "official" },
  { sourceId: "RBI-AHMEDABAD-SABARMATI", title: "Reserve Bank of India — Ahmedabad Regional Office Profile", url: "https://m.rbi.org.in/regionalbranch/ahmedabad/Profile.aspx", sourceType: "official" },
  { sourceId: "JABALPUR-DISTRICT-NARMADA", title: "District Jabalpur — Narmada tourist geography", url: "https://jabalpur.nic.in/en/tourist-places/", sourceType: "official" },
  { sourceId: "ODISHA-CUTTACK-MAHANADI", title: "Government of Odisha — Cuttack Mahanadi River Front", url: "https://cm.odisha.gov.in/en/latest-news/honorable-chief-minister-shri-mohan-charan-majhi-has-reviewed-cuttack-river-front", sourceType: "official" },
  { sourceId: "SRINAGAR-DISTRICT-JHELUM", title: "District Srinagar — District Geography", url: "https://srinagar.nic.in/", sourceType: "official" },
  { sourceId: "ASSAM-GUWAHATI-BRAHMAPUTRA", title: "Government of Assam — Guwahati/Brahmaputra geography", url: "https://kamrupmetro.assam.gov.in/", sourceType: "official" },
  { sourceId: "AP-VIJAYAWADA-KRISHNA", title: "Government of Andhra Pradesh — Vijayawada/Krishna geography", url: "https://ntr.ap.gov.in/", sourceType: "official" },
  { sourceId: "HARIDWAR-DISTRICT-GANGA", title: "District Haridwar — History and Ganga", url: "https://haridwar.nic.in/history/", sourceType: "official" },
  { sourceId: "AGRA-DISTRICT-YAMUNA", title: "District Agra — About District", url: "https://agra.nic.in/", sourceType: "official" },
  { sourceId: "MATHURA-DISTRICT-YAMUNA", title: "District Mathura — Administrative Setup", url: "https://mathura.nic.in/administrative-setup/", sourceType: "official" },
  { sourceId: "SURAT-DISTRICT-TAPI", title: "District Surat — District at a Glance", url: "https://surat.nic.in/district-at-a-glance/", sourceType: "official" },
  { sourceId: "KMC-HOOGHLY-RIVERFRONT", title: "Kolkata Municipal Corporation — Hooghly River Front", url: "https://www.kmcgov.in/KMCPortal/outside_jsp/BeautificationHooglyRiverFront.jsp", sourceType: "official" },
]);

export function toGeoRiv001Cp012FactSource(sourceId: GeoRiv001Cp012SourceId, locator: string): KnowledgeFactSource {
  const source = GEO_RIV_001_CP012_SOURCE_AUTHORITIES_V1.find((item) => item.sourceId === sourceId);
  if (!source) throw new Error(`Unknown CP012 source ${sourceId}`);
  return { ...source, locator };
}
