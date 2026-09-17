export const ECO_CP022_SOURCES_V1 = [
  {
    id: "UNDP-HUMAN-DEVELOPMENT",
    title: "UNDP Human Development Reports — Human development",
    url: "https://hdr.undp.org/about/human-development",
    authority: "United Nations Development Programme",
    use: "Human development concept, people/capabilities focus, distinction from income alone",
  },
  {
    id: "UNDP-HDI",
    title: "UNDP Human Development Reports — Human Development Index",
    url: "https://hdr.undp.org/data-center/human-development-index",
    authority: "United Nations Development Programme",
    use: "HDI dimensions, indicators and composite-index method",
  },
  {
    id: "UNDP-HDR-1990",
    title: "Human Development Report 1990",
    url: "https://www.undp.org/publications/human-development-report-1990",
    authority: "United Nations Development Programme",
    use: "Origins of human-development approach and first global HDR",
  },
  {
    id: "UNDP-MPI",
    title: "Global Multidimensional Poverty Index FAQs",
    url: "https://hdr.undp.org/mpi-2025-faqs",
    authority: "United Nations Development Programme",
    use: "MPI dimensions, incidence and intensity concepts",
  },
  {
    id: "WB-GINI",
    title: "World Development Indicators — Gini index metadata",
    url: "https://databank.worldbank.org/metadataglossary/world-development-indicators/series/SI.POV.GINI",
    authority: "World Bank",
    use: "Lorenz curve and Gini-index interpretation",
  },
  {
    id: "WB-POVERTY",
    title: "World Bank — Absolute and relative poverty concepts",
    url: "https://datatopics.worldbank.org/world-development-indicators/stories/where-do-the-poor-live.html",
    authority: "World Bank",
    use: "Absolute versus relative poverty distinction",
  },
  {
    id: "WB-GNI-PPP",
    title: "World Development Indicators — GNI per capita, PPP metadata",
    url: "https://databank.worldbank.org/metadataglossary/world-development-indicators/series/NY.GNP.PCAP.PP.KD",
    authority: "World Bank",
    use: "GNI per capita and PPP comparison concept",
  },
] as const;

export const ECO_CP022_SOURCE_IDS_V1 = ECO_CP022_SOURCES_V1.map((source) => source.id);
