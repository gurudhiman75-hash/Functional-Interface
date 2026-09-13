export type PolCp002Source = {
  sourceId: string;
  sourceType: "official" | "primary" | "reference";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP002_SOURCES_V1: readonly PolCp002Source[] = Object.freeze([
  {
    sourceId: "UK-HANSARD-CABINET-MISSION-1946-05-16",
    sourceType: "primary",
    title: "India: Statement by the Cabinet Mission, 16 May 1946",
    url: "https://hansard.parliament.uk/Lords/1946-05-16/debates/1c3973b1-ab17-44c5-9e82-16322708241a/IndiaStatementByTheCabinetMission",
    notes: "Primary authority for the provincial election method and the Cabinet Mission scheme.",
  },
  {
    sourceId: "COI-CAD-1946-12-09",
    sourceType: "primary",
    title: "Constituent Assembly Debates, 9 December 1946",
    url: "https://www.constitutionofindia.net/debates/09-dec-1946/",
    notes: "Primary debate record for the first sitting and temporary chairmanship.",
  },
  {
    sourceId: "COI-CAD-1946-12-13",
    sourceType: "primary",
    title: "Constituent Assembly Debates, 13 December 1946",
    url: "https://www.constitutionofindia.net/debates/13-dec-1946/",
    notes: "Primary debate record for Jawaharlal Nehru moving the Objectives Resolution.",
  },
  {
    sourceId: "COI-CAD-1947-08-29",
    sourceType: "primary",
    title: "Constituent Assembly Debates, 29 August 1947",
    url: "https://www.constitutionofindia.net/debates/29-aug-1947/",
    notes: "Primary debate record for appointment and initial membership of the Drafting Committee.",
  },
  {
    sourceId: "COI-DRAFT-1948-02-21",
    sourceType: "primary",
    title: "Draft Constitution of India, 21 February 1948",
    url: "https://www.constitutionofindia.net/committee-report/draft-constitution-of-india-1948/",
    notes: "Authority for submission of the Draft Constitution and its 315 Articles / 8 Schedules structure.",
  },
  {
    sourceId: "COI-COMMITTEE-UNION-POWERS",
    sourceType: "primary",
    title: "First Report of the Union Powers Committee",
    url: "https://www.constitutionofindia.net/committee-report/first-report-of-the-union-powers-committee/",
    notes: "Authority for Jawaharlal Nehru chairing the Union Powers Committee.",
  },
  {
    sourceId: "COI-COMMITTEE-UNION-CONSTITUTION",
    sourceType: "primary",
    title: "Report of the Union Constitution Committee",
    url: "https://www.constitutionofindia.net/committee-report/report-of-the-union-constitution-committee/",
    notes: "Authority for Jawaharlal Nehru chairing the Union Constitution Committee.",
  },
  {
    sourceId: "BOMBAY-HC-CAD-READY-RECKONER",
    sourceType: "official",
    title: "Bombay High Court: Constituent Assembly Debates Ready Reckoner",
    url: "https://bombayhighcourt.nic.in/libweb/misc/coi/New-constituent_assembly_debates.html",
    notes: "Official judicial-hosted reference for 11 sessions, 165 sitting days, 114 draft-consideration days, adoption, signing and commencement.",
  },
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department",
    url: "https://www.legislative.gov.in/constitution-of-india/",
    notes: "Official constitutional text for adoption wording and Article 394 commencement.",
  },
  {
    sourceId: "IGNOU-MHI09-BLOCK8",
    sourceType: "reference",
    title: "IGNOU MHI-09 Block 8 — Constitution: Making and Features",
    url: "https://egyankosh.ac.in/bitstream/123456789/44350/1/Block-8.pdf",
    notes: "Standard academic reference for high-level constitutional influences and original 395-Article/8-Schedule structure.",
  },
]);
