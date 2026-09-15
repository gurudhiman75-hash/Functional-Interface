export const ECO_CP014_SOURCES_V1 = Object.freeze([
  {
    id: "NCERT-GOVT-BUDGET-TAX",
    authority: "NCERT",
    title: "Introductory Macroeconomics — Government Budget and the Economy",
    url: "https://www.ncert.nic.in/textbook/pdf/leec105.pdf",
    notes: "Official textbook source for direct and indirect tax examples and progressive/proportional taxation concepts. Current or obsolete rate examples are not used.",
  },
  {
    id: "CBIC-GST-ABOUT",
    authority: "Central Board of Indirect Taxes and Customs",
    title: "Know About GST",
    url: "https://cbic-gst.gov.in/about-gst.html",
    notes: "Official GST overview covering destination-based consumption taxation, value addition, final-consumer burden and the broad GST design.",
  },
  {
    id: "CBIC-GST-DESIGN",
    authority: "Central Board of Indirect Taxes and Customs",
    title: "GST Concept and Status — Design of Indian GST",
    url: "https://cbic-gst.gov.in/pdf/01042019_GST-Concept-Status.pdf",
    notes: "Official source for dual GST, CGST/SGST or UTGST on intra-State supplies and IGST on inter-State supplies.",
  },
  {
    id: "CBIC-101-AMENDMENT",
    authority: "Central Board of Indirect Taxes and Customs",
    title: "Constitution (One Hundred and First Amendment) Act, 2016",
    url: "https://cbic-gst.gov.in/hindi/constitution-amendment-act.html",
    notes: "Official text supporting Articles 246A, 269A and 279A introduced for GST architecture.",
  },
  {
    id: "GST-COUNCIL-ARTICLE-279A",
    authority: "Goods and Services Tax Council",
    title: "The GST Council",
    url: "https://www.gstcouncil.gov.in/gst-council-0",
    notes: "Official source for the 101st Constitutional Amendment, GST Council composition and recommendation role under Article 279A.",
  },
  {
    id: "CBIC-CUSTOMS-ACT-S12",
    authority: "Central Board of Indirect Taxes and Customs",
    title: "Customs Act, 1962 — Section 12: Dutiable goods",
    url: "https://taxinformation.cbic.gov.in/content-page/explore-act/1000026/1000002",
    notes: "Official statutory source for customs duties on goods imported into or exported from India.",
  },
] as const);

export const ECO_CP014_SOURCE_IDS_V1 = ECO_CP014_SOURCES_V1.map((source) => source.id);
