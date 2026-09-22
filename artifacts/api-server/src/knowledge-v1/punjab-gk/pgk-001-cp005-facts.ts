export const PGK_001_CP005_SOURCE_IDS = Object.freeze({
  bbmbBhakra: "BBMB-BHAKRA",
  bbmbPong: "BBMB-PONG",
  bbmbProjectsAtGlance: "BBMB-PROJECTS-AT-GLANCE",
  bbmbIndusBasin: "BBMB-INDUS-BASIN",
  bbmbBeasProject: "BBMB-BEAS-PROJECT",
  pspclRanjitSagar: "PSPCL-RANJIT-SAGAR-DAM",
  pspclShahpurkandi: "PSPCL-SHAHPURKANDI-DAM",
  pspclUbdc: "PSPCL-UBDC-HYDEL",
  pudaRopar: "PUDA-ROPAR-MASTER-PLAN",
  pudaAmritsar: "PUDA-AMRITSAR-MASTER-PLAN",
  PunjabHarike: "PUNJAB-WR-HARIKE-HEADWORKS",
} as const);

export const PGK_001_CP005_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP005_SOURCE_IDS.bbmbBhakra]: { authority: "Bhakra Beas Management Board", title: "Bhakra", url: "https://bbmb.gov.in/bhakra.htm" },
  [PGK_001_CP005_SOURCE_IDS.bbmbPong]: { authority: "Bhakra Beas Management Board", title: "Pong", url: "https://bbmb.gov.in/pong.htm" },
  [PGK_001_CP005_SOURCE_IDS.bbmbProjectsAtGlance]: { authority: "Bhakra Beas Management Board", title: "Projects at a Glance", url: "https://bbmb.gov.in/writereaddata/Portal/Images/pdf/BBMB_glance.pdf" },
  [PGK_001_CP005_SOURCE_IDS.bbmbIndusBasin]: { authority: "Bhakra Beas Management Board", title: "Indus Basin", url: "https://bbmb.gov.in/indus-basin.htm" },
  [PGK_001_CP005_SOURCE_IDS.bbmbBeasProject]: { authority: "Bhakra Beas Management Board", title: "Beas Project", url: "https://bbmb.gov.in/beas-project-.htm" },
  [PGK_001_CP005_SOURCE_IDS.pspclRanjitSagar]: { authority: "Punjab State Power Corporation Limited", title: "Ranjit Sagar Dam", url: "https://pspcl.in/Otherlinks/ranjit-sagar-dam.aspx" },
  [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi]: { authority: "Punjab State Power Corporation Limited", title: "Shahpurkandi Dam Project", url: "https://pspcl.in/Otherlinks/shahpurkandi-dam-project.aspx" },
  [PGK_001_CP005_SOURCE_IDS.pspclUbdc]: { authority: "Punjab State Power Corporation Limited", title: "UBDC Hydel Project — detailed project report", url: "https://docs.pspcl.in/docs/cearrtp20250903122952423.pdf", classification: "PRIMARY_UTILITY_PROJECT_DOCUMENT" },
  [PGK_001_CP005_SOURCE_IDS.pudaRopar]: { authority: "Punjab Urban Planning and Development Authority", title: "Rupnagar Master Plan", url: "https://puda.punjab.gov.in/sites/default/files/final_report_16.3.2012_0_0.pdf" },
  [PGK_001_CP005_SOURCE_IDS.pudaAmritsar]: { authority: "Punjab Urban Planning and Development Authority", title: "Amritsar Master Plan", url: "https://puda.punjab.gov.in/sites/default/files/AMT_rpt_2011.pdf" },
  [PGK_001_CP005_SOURCE_IDS.PunjabHarike]: { authority: "Ministry of Environment, Forest and Climate Change / Department of Water Resources Punjab", title: "Harike location and Harike Canal Division records", url: "https://www.moef.gov.in/uploads/2017/06/Harike%20Wildlife%20Sanctuary%2C%20Punjab_0.pdf", supportingUrls: Object.freeze(["https://eproc.punjab.gov.in/nicgep/app?component=view&page=WebTenderStatusLists&service=direct&sp=Sos2g0oEzTOWU0q2JLl8a7g%3D%3D"]), classification: "PRIMARY_GOVERNMENT" },
} as const);

export type Pgk001Cp005DamFact = Readonly<{
  id: string;
  name: string;
  river: "Sutlej" | "Beas" | "Ravi";
  aliases?: readonly string[];
  type?: string;
  reservoir?: string;
  district?: string;
  installedCapacityMw?: number;
  sourceIds: readonly string[];
}>;

export const PGK_001_CP005_DAMS: readonly Pgk001Cp005DamFact[] = Object.freeze([
  {
    id: "bhakra-dam",
    name: "Bhakra Dam",
    river: "Sutlej",
    type: "Concrete straight gravity dam",
    reservoir: "Gobind Sagar",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbBhakra, PGK_001_CP005_SOURCE_IDS.bbmbIndusBasin],
  },
  {
    id: "pong-dam",
    name: "Pong Dam",
    river: "Beas",
    aliases: ["Beas Dam"],
    type: "Earth-core gravel-shell dam",
    reservoir: "Maharana Pratap Sagar",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbPong, PGK_001_CP005_SOURCE_IDS.bbmbBeasProject],
  },
  {
    id: "ranjit-sagar-dam",
    name: "Ranjit Sagar Dam",
    river: "Ravi",
    aliases: ["Thein Dam"],
    district: "Pathankot",
    installedCapacityMw: 600,
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pspclRanjitSagar],
  },
  {
    id: "shahpurkandi-dam",
    name: "Shahpurkandi Dam",
    river: "Ravi",
    district: "Pathankot",
    installedCapacityMw: 206,
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi],
  },
]);

export const PGK_001_CP005_HEADWORKS = Object.freeze([
  {
    id: "nangal-barrage",
    name: "Nangal",
    kind: "Mass-concrete barrage",
    river: "Sutlej",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbProjectsAtGlance],
  },
  {
    id: "harike-headworks",
    name: "Harike Headworks",
    kind: "Headworks",
    river: "Beas-Sutlej confluence",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbProjectsAtGlance, PGK_001_CP005_SOURCE_IDS.PunjabHarike],
  },
  {
    id: "madhopur-headworks",
    name: "Madhopur Headworks",
    kind: "Headworks",
    river: "Ravi",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi, PGK_001_CP005_SOURCE_IDS.pspclUbdc],
  },
  {
    id: "ropar-headworks",
    name: "Ropar Headworks",
    kind: "Headworks",
    river: "Sutlej",
    aliases: ["Rupnagar Headworks"],
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pudaRopar],
  },
] as const);

export const PGK_001_CP005_CANAL_RELATIONS = Object.freeze([
  {
    id: "sirhind-canal-ropar",
    canal: "Sirhind Canal",
    headworks: "Ropar Headworks",
    river: "Sutlej",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pudaRopar],
  },
  {
    id: "ubdc-madhopur",
    canal: "Upper Bari Doab Canal",
    aliases: ["UBDC"],
    headworks: "Madhopur Headworks",
    river: "Ravi",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi, PGK_001_CP005_SOURCE_IDS.pudaAmritsar],
  },
  {
    id: "kashmir-canal-madhopur",
    canal: "Kashmir Canal",
    headworks: "Madhopur Headworks",
    river: "Ravi",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi],
  },
  {
    id: "ferozepur-feeder-harike",
    canal: "Ferozepur Feeder",
    headworks: "Harike Headworks",
    river: "Beas-Sutlej confluence",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbProjectsAtGlance, PGK_001_CP005_SOURCE_IDS.PunjabHarike],
  },
  {
    id: "nangal-hydel-channel",
    canal: "Nangal Hydel Channel",
    headworks: "Nangal",
    river: "Sutlej system",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbProjectsAtGlance],
  },
]);

export const PGK_001_CP005_PROJECT_RELATIONS = Object.freeze([
  {
    id: "beas-sutlej-link",
    relation: "Beas-Sutlej Link diverts Beas water toward the Sutlej system",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbIndusBasin, PGK_001_CP005_SOURCE_IDS.bbmbBeasProject],
  },
  {
    id: "shahpurkandi-ravi-sequence",
    relation: "Shahpurkandi lies downstream of Ranjit Sagar Dam and upstream of Madhopur Headworks on the Ravi",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi],
  },
  {
    id: "shahpurkandi-balancing",
    relation: "Shahpurkandi provides balancing regulation for releases from Ranjit Sagar Dam toward downstream canal systems",
    sourceIds: [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi],
  },
] as const);

export const PGK_001_CP005_FACT_IDS = Object.freeze([
  ...PGK_001_CP005_DAMS.map((row) => row.id),
  ...PGK_001_CP005_HEADWORKS.map((row) => row.id),
  ...PGK_001_CP005_CANAL_RELATIONS.map((row) => row.id),
  ...PGK_001_CP005_PROJECT_RELATIONS.map((row) => row.id),
]);
