export type PgkMatchingLocaleV1 = "en" | "hi" | "pa";
export type PgkMatchingDifficultyV1 = "Medium" | "Hard";

type Mapping4 = readonly [number, number, number, number];
type LocalizedMatchingContent = Readonly<{
  listI: readonly [string, string, string, string];
  listII: readonly [string, string, string, string];
  explanation: string;
}>;

export type PgkMatchingConceptV1 = Readonly<{
  id: string;
  cpId: string;
  sourceQlIds: readonly string[];
  difficulty: PgkMatchingDifficultyV1;
  correctMapping: Mapping4;
  en: LocalizedMatchingContent;
  hi: LocalizedMatchingContent;
  pa: LocalizedMatchingContent;
}>;

export type PgkMatchingQuestionV1 = Readonly<{
  questionId: string;
  cpId: string;
  sourceQlIds: readonly string[];
  difficulty: PgkMatchingDifficultyV1;
  questionType: "Match the Following";
  locale: PgkMatchingLocaleV1;
  stem: string;
  listI: readonly string[];
  listII: readonly string[];
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  reviewOnly: true;
  runtimeRegistered: false;
}>;

const C = (
  id: string,
  cpId: string,
  sourceQlIds: readonly string[],
  difficulty: PgkMatchingDifficultyV1,
  correctMapping: Mapping4,
  en: LocalizedMatchingContent,
  hi: LocalizedMatchingContent,
  pa: LocalizedMatchingContent,
): PgkMatchingConceptV1 =>
  Object.freeze({ id, cpId, sourceQlIds, difficulty, correctMapping, en, hi, pa });

export const PGK_001_MATCH_FOLLOWING_CONCEPTS_V1: readonly PgkMatchingConceptV1[] = Object.freeze([
  C("PGK-001-MTF-001","PGK-001-CP-004",["PGK-001-QL-021","PGK-001-QL-027"],"Medium",[4,3,1,2],
    {listI:["Sutlej","Beas","Ravi","Chenab"],listII:["Purushni","Askini","Vipasa","Shutudri"],explanation:"Sutlej is linked with Shutudri, Beas with Vipasa, Ravi with Purushni and Chenab with Askini in the ancient-name set used by the frozen Punjab GK corpus."},
    {listI:["सतलुज","ब्यास","रावी","चिनाब"],listII:["पुरुष्णी","अस्किनी","विपाशा","शुतुद्री"],explanation:"सतलुज का प्राचीन नाम शुतुद्री, ब्यास का विपाशा, रावी का पुरुष्णी और चिनाब का अस्किनी दिया जाता है।"},
    {listI:["ਸਤਲੁਜ","ਬਿਆਸ","ਰਾਵੀ","ਚਨਾਬ"],listII:["ਪੁਰੁਸ਼ਣੀ","ਅਸਕਿਨੀ","ਵਿਪਾਸਾ","ਸ਼ੁਤੁਦਰੀ"],explanation:"ਸਤਲੁਜ ਦਾ ਪ੍ਰਾਚੀਨ ਨਾਂ ਸ਼ੁਤੁਦਰੀ, ਬਿਆਸ ਦਾ ਵਿਪਾਸਾ, ਰਾਵੀ ਦਾ ਪੁਰੁਸ਼ਣੀ ਅਤੇ ਚਨਾਬ ਦਾ ਅਸਕਿਨੀ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ."}),
  C("PGK-001-MTF-002","PGK-001-CP-004",["PGK-001-QL-026","PGK-001-QL-027"],"Medium",[3,4,1,2],
    {listI:["Bist Doab","Bari Doab","Rachna Doab","Chaj Doab"],listII:["Ravi–Chenab","Chenab–Jhelum","Sutlej–Beas","Beas–Ravi"],explanation:"Bist lies between Sutlej and Beas, Bari between Beas and Ravi, Rachna between Ravi and Chenab, and Chaj between Chenab and Jhelum."},
    {listI:["बिस्त दोआब","बारी दोआब","रचना दोआब","चाज दोआब"],listII:["रावी–चिनाब","चिनाब–झेलम","सतलुज–ब्यास","ब्यास–रावी"],explanation:"बिस्त दोआब सतलुज–ब्यास, बारी ब्यास–रावी, रचना रावी–चिनाब और चाज चिनाब–झेलम के बीच स्थित है।"},
    {listI:["ਬਿਸਤ ਦੁਆਬ","ਬਾਰੀ ਦੁਆਬ","ਰਚਨਾ ਦੁਆਬ","ਚਾਜ ਦੁਆਬ"],listII:["ਰਾਵੀ–ਚਨਾਬ","ਚਨਾਬ–ਝੇਲਮ","ਸਤਲੁਜ–ਬਿਆਸ","ਬਿਆਸ–ਰਾਵੀ"],explanation:"ਬਿਸਤ ਦੁਆਬ ਸਤਲੁਜ–ਬਿਆਸ, ਬਾਰੀ ਬਿਆਸ–ਰਾਵੀ, ਰਚਨਾ ਰਾਵੀ–ਚਨਾਬ ਅਤੇ ਚਾਜ ਚਨਾਬ–ਝੇਲਮ ਦੇ ਵਿਚਕਾਰ ਹੈ."}),

  C("PGK-001-MTF-003","PGK-001-CP-005",["PGK-001-QL-028","PGK-001-QL-029","PGK-001-QL-030"],"Hard",[3,4,2,1],
    {listI:["Bhakra Dam","Pong Dam","Ranjit Sagar Dam","Nangal structure"],listII:["Mass-concrete barrage on the Sutlej","Ravi project in Pathankot, also called Thein Dam","Concrete gravity dam with Gobind Sagar reservoir","Beas project with Maharana Pratap Sagar reservoir"],explanation:"Bhakra is the concrete gravity dam associated with Gobind Sagar, Pong is on the Beas with Maharana Pratap Sagar, Ranjit Sagar is the Ravi project in Pathankot, and Nangal is the mass-concrete barrage on the Sutlej."},
    {listI:["भाखड़ा बाँध","पोंग बाँध","रणजीत सागर बाँध","नंगल संरचना"],listII:["सतलुज पर मास-कंक्रीट बैराज","पठानकोट में रावी परियोजना, जिसे थीन बाँध भी कहते हैं","गोबिंद सागर जलाशय वाला कंक्रीट ग्रैविटी बाँध","महाराणा प्रताप सागर जलाशय वाली ब्यास परियोजना"],explanation:"भाखड़ा गोबिंद सागर से, पोंग ब्यास और महाराणा प्रताप सागर से, रणजीत सागर रावी व पठानकोट से और नंगल सतलुज पर बैराज से जुड़ा है।"},
    {listI:["ਭਾਖੜਾ ਡੈਮ","ਪੋਂਗ ਡੈਮ","ਰਣਜੀਤ ਸਾਗਰ ਡੈਮ","ਨੰਗਲ ਢਾਂਚਾ"],listII:["ਸਤਲੁਜ ਉੱਤੇ ਮਾਸ-ਕੰਕਰੀਟ ਬੈਰਾਜ","ਪਠਾਨਕੋਟ ਵਿੱਚ ਰਾਵੀ ਪ੍ਰੋਜੈਕਟ, ਜਿਸ ਨੂੰ ਥੀਨ ਡੈਮ ਵੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ","ਗੋਬਿੰਦ ਸਾਗਰ ਜਲਾਸ਼ਯ ਵਾਲਾ ਕੰਕਰੀਟ ਗ੍ਰੈਵਿਟੀ ਡੈਮ","ਮਹਾਰਾਣਾ ਪ੍ਰਤਾਪ ਸਾਗਰ ਜਲਾਸ਼ਯ ਵਾਲਾ ਬਿਆਸ ਪ੍ਰੋਜੈਕਟ"],explanation:"ਭਾਖੜਾ ਗੋਬਿੰਦ ਸਾਗਰ ਨਾਲ, ਪੋਂਗ ਬਿਆਸ ਅਤੇ ਮਹਾਰਾਣਾ ਪ੍ਰਤਾਪ ਸਾਗਰ ਨਾਲ, ਰਣਜੀਤ ਸਾਗਰ ਰਾਵੀ ਤੇ ਪਠਾਨਕੋਟ ਨਾਲ ਅਤੇ ਨੰਗਲ ਸਤਲੁਜ ਦੇ ਬੈਰਾਜ ਨਾਲ ਜੁੜਿਆ ਹੈ."}),
  C("PGK-001-MTF-004","PGK-001-CP-005",["PGK-001-QL-031","PGK-001-QL-032","PGK-001-QL-034"],"Hard",[3,1,2,4],
    {listI:["Sirhind Canal","Upper Bari Doab Canal","Nangal Hydel Channel","Beas–Sutlej Link"],listII:["Madhopur Headworks on the Ravi","Part of the Bhakra–Nangal water-conductor system","Ropar Headworks on the Sutlej","Transfers Beas water toward the Sutlej system"],explanation:"Sirhind Canal is tied to Ropar Headworks, UBDC to Madhopur Headworks, Nangal Hydel Channel to the Bhakra–Nangal system, and the Beas–Sutlej Link transfers Beas water toward the Sutlej system."},
    {listI:["सरहिंद नहर","अपर बारी दोआब नहर","नंगल हाइडल चैनल","ब्यास–सतलुज लिंक"],listII:["रावी पर माधोपुर हेडवर्क्स","भाखड़ा–नंगल जल-वाहक प्रणाली का हिस्सा","सतलुज पर रोपड़ हेडवर्क्स","ब्यास का पानी सतलुज प्रणाली की ओर ले जाता है"],explanation:"सरहिंद नहर रोपड़ हेडवर्क्स, अपर बारी दोआब नहर माधोपुर हेडवर्क्स, नंगल हाइडल चैनल भाखड़ा–नंगल प्रणाली और ब्यास–सतलुज लिंक जल स्थानांतरण से जुड़ा है।"},
    {listI:["ਸਰਹਿੰਦ ਨਹਿਰ","ਅੱਪਰ ਬਾਰੀ ਦੁਆਬ ਨਹਿਰ","ਨੰਗਲ ਹਾਈਡਲ ਚੈਨਲ","ਬਿਆਸ–ਸਤਲੁਜ ਲਿੰਕ"],listII:["ਰਾਵੀ ਉੱਤੇ ਮਾਧੋਪੁਰ ਹੈੱਡਵਰਕਸ","ਭਾਖੜਾ–ਨੰਗਲ ਜਲ-ਵਾਹਕ ਪ੍ਰਣਾਲੀ ਦਾ ਹਿੱਸਾ","ਸਤਲੁਜ ਉੱਤੇ ਰੋਪੜ ਹੈੱਡਵਰਕਸ","ਬਿਆਸ ਦਾ ਪਾਣੀ ਸਤਲੁਜ ਪ੍ਰਣਾਲੀ ਵੱਲ ਲੈ ਜਾਂਦਾ ਹੈ"],explanation:"ਸਰਹਿੰਦ ਨਹਿਰ ਰੋਪੜ ਹੈੱਡਵਰਕਸ, ਅੱਪਰ ਬਾਰੀ ਦੁਆਬ ਨਹਿਰ ਮਾਧੋਪੁਰ ਹੈੱਡਵਰਕਸ, ਨੰਗਲ ਹਾਈਡਲ ਚੈਨਲ ਭਾਖੜਾ–ਨੰਗਲ ਪ੍ਰਣਾਲੀ ਅਤੇ ਬਿਆਸ–ਸਤਲੁਜ ਲਿੰਕ ਜਲ-ਤਬਦੀਲੀ ਨਾਲ ਜੁੜਿਆ ਹੈ."}),

  C("PGK-001-MTF-005","PGK-001-CP-012",["PGK-001-QL-078","PGK-001-QL-079"],"Medium",[2,4,1,3],
    {listI:["Guru Angad Dev","Guru Amar Das","Guru Ram Das","Guru Arjan Dev"],listII:["Ramdaspur, later Amritsar","Promotion and systematisation of Gurmukhi","Compilation of the Adi Granth","Manji system and Goindwal"],explanation:"Guru Angad is associated with the development of Gurmukhi, Guru Amar Das with the Manji system and Goindwal, Guru Ram Das with Ramdaspur, and Guru Arjan with compilation of the Adi Granth."},
    {listI:["गुरु अंगद देव","गुरु अमर दास","गुरु राम दास","गुरु अर्जन देव"],listII:["रामदासपुर, जो आगे अमृतसर बना","गुरमुखी को व्यवस्थित और प्रचलित करना","आदि ग्रंथ का संकलन","मंजी प्रणाली और गोइंदवाल"],explanation:"गुरु अंगद देव गुरमुखी, गुरु अमर दास मंजी प्रणाली व गोइंदवाल, गुरु राम दास रामदासपुर और गुरु अर्जन देव आदि ग्रंथ के संकलन से जुड़े हैं।"},
    {listI:["ਗੁਰੂ ਅੰਗਦ ਦੇਵ","ਗੁਰੂ ਅਮਰ ਦਾਸ","ਗੁਰੂ ਰਾਮ ਦਾਸ","ਗੁਰੂ ਅਰਜਨ ਦੇਵ"],listII:["ਰਾਮਦਾਸਪੁਰ, ਜੋ ਬਾਅਦ ਵਿੱਚ ਅੰਮ੍ਰਿਤਸਰ ਬਣਿਆ","ਗੁਰਮੁਖੀ ਨੂੰ ਵਿਵਸਥਿਤ ਅਤੇ ਪ੍ਰਚਲਿਤ ਕਰਨਾ","ਆਦਿ ਗ੍ਰੰਥ ਦਾ ਸੰਕਲਨ","ਮੰਜੀ ਪ੍ਰਣਾਲੀ ਅਤੇ ਗੋਇੰਦਵਾਲ"],explanation:"ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਗੁਰਮੁਖੀ, ਗੁਰੂ ਅਮਰ ਦਾਸ ਮੰਜੀ ਪ੍ਰਣਾਲੀ ਤੇ ਗੋਇੰਦਵਾਲ, ਗੁਰੂ ਰਾਮ ਦਾਸ ਰਾਮਦਾਸਪੁਰ ਅਤੇ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਆਦਿ ਗ੍ਰੰਥ ਦੇ ਸੰਕਲਨ ਨਾਲ ਜੁੜੇ ਹਨ."}),
  C("PGK-001-MTF-006","PGK-001-CP-012",["PGK-001-QL-077","PGK-001-QL-080","PGK-001-QL-082","PGK-001-QL-083"],"Hard",[4,2,1,3],
    {listI:["Guru Hargobind","Guru Tegh Bahadur","Guru Gobind Singh","Guru Nanak Dev"],listII:["Khalsa founded at Anandpur Sahib in 1699","Martyrdom at Delhi in 1675","Kartarpur as an important centre of his later life","Akal Takht and Miri-Piri"],explanation:"Guru Hargobind is linked with Akal Takht and Miri-Piri; Guru Tegh Bahadur with the 1675 martyrdom; Guru Gobind Singh with the Khalsa in 1699; and Guru Nanak with Kartarpur."},
    {listI:["गुरु हरगोबिंद","गुरु तेग बहादुर","गुरु गोबिंद सिंह","गुरु नानक देव"],listII:["1699 में आनंदपुर साहिब में खालसा की स्थापना","1675 में दिल्ली में शहादत","जीवन के उत्तरकाल का महत्वपूर्ण केंद्र करतारपुर","अकाल तख्त और मीरी-पीरी"],explanation:"गुरु हरगोबिंद अकाल तख्त व मीरी-पीरी, गुरु तेग बहादुर 1675 की शहादत, गुरु गोबिंद सिंह 1699 के खालसा और गुरु नानक देव करतारपुर से जुड़े हैं।"},
    {listI:["ਗੁਰੂ ਹਰਿਗੋਬਿੰਦ","ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ","ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ","ਗੁਰੂ ਨਾਨਕ ਦੇਵ"],listII:["1699 ਵਿੱਚ ਅਨੰਦਪੁਰ ਸਾਹਿਬ ਵਿਖੇ ਖ਼ਾਲਸੇ ਦੀ ਸਾਜਨਾ","1675 ਵਿੱਚ ਦਿੱਲੀ ਵਿੱਚ ਸ਼ਹਾਦਤ","ਜੀਵਨ ਦੇ ਆਖ਼ਰੀ ਦੌਰ ਦਾ ਮਹੱਤਵਪੂਰਨ ਕੇਂਦਰ ਕਰਤਾਰਪੁਰ","ਅਕਾਲ ਤਖ਼ਤ ਅਤੇ ਮੀਰੀ-ਪੀਰੀ"],explanation:"ਗੁਰੂ ਹਰਿਗੋਬਿੰਦ ਅਕਾਲ ਤਖ਼ਤ ਤੇ ਮੀਰੀ-ਪੀਰੀ, ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ 1675 ਦੀ ਸ਼ਹਾਦਤ, ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ 1699 ਦੇ ਖ਼ਾਲਸੇ ਅਤੇ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਕਰਤਾਰਪੁਰ ਨਾਲ ਜੁੜੇ ਹਨ."}),

  C("PGK-001-MTF-007","PGK-001-CP-014",["PGK-001-QL-094","PGK-001-QL-095"],"Medium",[2,4,1,3],
    {listI:["Ahluwalia Misl","Ramgarhia Misl","Sukerchakia Misl","Kanhaiya Misl"],listII:["Charat Singh","Jassa Singh Ahluwalia","Jai Singh Kanhaiya","Jassa Singh Ramgarhia"],explanation:"Ahluwalia is linked with Jassa Singh Ahluwalia, Ramgarhia with Jassa Singh Ramgarhia, Sukerchakia with Charat Singh, and Kanhaiya with Jai Singh Kanhaiya."},
    {listI:["आहलूवालिया मिसल","रामगढ़िया मिसल","शुकरचकिया मिसल","कन्हैया मिसल"],listII:["चढ़त सिंह","जस्सा सिंह आहलूवालिया","जय सिंह कन्हैया","जस्सा सिंह रामगढ़िया"],explanation:"आहलूवालिया मिसल जस्सा सिंह आहलूवालिया, रामगढ़िया जस्सा सिंह रामगढ़िया, शुकरचकिया चढ़त सिंह और कन्हैया मिसल जय सिंह कन्हैया से जुड़ी है।"},
    {listI:["ਆਹਲੂਵਾਲੀਆ ਮਿਸਲ","ਰਾਮਗੜ੍ਹੀਆ ਮਿਸਲ","ਸ਼ੁਕਰਚੱਕੀਆ ਮਿਸਲ","ਕਨ੍ਹੱਈਆ ਮਿਸਲ"],listII:["ਚੜ੍ਹਤ ਸਿੰਘ","ਜੱਸਾ ਸਿੰਘ ਆਹਲੂਵਾਲੀਆ","ਜੈ ਸਿੰਘ ਕਨ੍ਹੱਈਆ","ਜੱਸਾ ਸਿੰਘ ਰਾਮਗੜ੍ਹੀਆ"],explanation:"ਆਹਲੂਵਾਲੀਆ ਮਿਸਲ ਜੱਸਾ ਸਿੰਘ ਆਹਲੂਵਾਲੀਆ, ਰਾਮਗੜ੍ਹੀਆ ਜੱਸਾ ਸਿੰਘ ਰਾਮਗੜ੍ਹੀਆ, ਸ਼ੁਕਰਚੱਕੀਆ ਚੜ੍ਹਤ ਸਿੰਘ ਅਤੇ ਕਨ੍ਹੱਈਆ ਮਿਸਲ ਜੈ ਸਿੰਘ ਕਨ੍ਹੱਈਆ ਨਾਲ ਜੁੜੀ ਹੈ."}),
  C("PGK-001-MTF-008","PGK-001-CP-014",["PGK-001-QL-091","PGK-001-QL-092","PGK-001-QL-093"],"Hard",[3,1,4,2],
    {listI:["Sarbat Khalsa","Gurmata","Rakhi","Dal Khalsa"],listII:["Collective decision of the Sikh assembly","Confederate Sikh force organised at Amritsar in 1748","Collective assembly of the Khalsa","Protection arrangement linked with a share of revenue"],explanation:"Sarbat Khalsa was the collective assembly, Gurmata its collective decision, Rakhi a protection arrangement, and Dal Khalsa the confederate Sikh force organised in 1748."},
    {listI:["सरबत खालसा","गुरमता","राखी","दल खालसा"],listII:["सिख सभा का सामूहिक निर्णय","1748 में अमृतसर में संगठित संघीय सिख बल","खालसा की सामूहिक सभा","राजस्व के हिस्से से जुड़ी सुरक्षा व्यवस्था"],explanation:"सरबत खालसा सामूहिक सभा, गुरमता उसका सामूहिक निर्णय, राखी सुरक्षा व्यवस्था और दल खालसा 1748 में संगठित सिख संघीय बल था।"},
    {listI:["ਸਰਬੱਤ ਖ਼ਾਲਸਾ","ਗੁਰਮਤਾ","ਰਾਖੀ","ਦਲ ਖ਼ਾਲਸਾ"],listII:["ਸਿੱਖ ਸਭਾ ਦਾ ਸਾਂਝਾ ਫ਼ੈਸਲਾ","1748 ਵਿੱਚ ਅੰਮ੍ਰਿਤਸਰ ਵਿਖੇ ਸੰਗਠਿਤ ਸੰਘੀ ਸਿੱਖ ਫ਼ੌਜ","ਖ਼ਾਲਸੇ ਦੀ ਸਾਂਝੀ ਸਭਾ","ਮਾਲੀਏ ਦੇ ਹਿੱਸੇ ਨਾਲ ਜੁੜੀ ਸੁਰੱਖਿਆ ਵਿਵਸਥਾ"],explanation:"ਸਰਬੱਤ ਖ਼ਾਲਸਾ ਸਾਂਝੀ ਸਭਾ, ਗੁਰਮਤਾ ਉਸ ਦਾ ਸਾਂਝਾ ਫ਼ੈਸਲਾ, ਰਾਖੀ ਸੁਰੱਖਿਆ ਵਿਵਸਥਾ ਅਤੇ ਦਲ ਖ਼ਾਲਸਾ 1748 ਵਿੱਚ ਸੰਗਠਿਤ ਸੰਘੀ ਸਿੱਖ ਫ਼ੌਜ ਸੀ."}),

  C("PGK-001-MTF-009","PGK-001-CP-015",["PGK-001-QL-101"],"Medium",[3,1,4,2],
    {listI:["Raja Dhian Singh","Fakir Aziz-ud-Din","Diwan Bhiwani Das","Hari Singh Nalwa"],listII:["Foreign Minister","Military commander","Prime Minister","Finance Minister"],explanation:"Dhian Singh served as Prime Minister, Fakir Aziz-ud-Din handled foreign affairs, Bhiwani Das finance, and Hari Singh Nalwa was a leading military commander."},
    {listI:["राजा ध्यान सिंह","फ़कीर अज़ीजुद्दीन","दीवान भवानी दास","हरि सिंह नलवा"],listII:["विदेश मंत्री","सैन्य कमांडर","प्रधान मंत्री","वित्त मंत्री"],explanation:"ध्यान सिंह प्रधान मंत्री, फ़कीर अज़ीजुद्दीन विदेश मंत्री, दीवान भवानी दास वित्त मंत्री और हरि सिंह नलवा प्रमुख सैन्य कमांडर थे।"},
    {listI:["ਰਾਜਾ ਧਿਆਨ ਸਿੰਘ","ਫ਼ਕੀਰ ਅਜ਼ੀਜ਼ਉੱਦੀਨ","ਦੀਵਾਨ ਭਵਾਨੀ ਦਾਸ","ਹਰੀ ਸਿੰਘ ਨਲਵਾ"],listII:["ਵਿਦੇਸ਼ ਮੰਤਰੀ","ਫੌਜੀ ਕਮਾਂਡਰ","ਪ੍ਰਧਾਨ ਮੰਤਰੀ","ਵਿੱਤ ਮੰਤਰੀ"],explanation:"ਧਿਆਨ ਸਿੰਘ ਪ੍ਰਧਾਨ ਮੰਤਰੀ, ਫ਼ਕੀਰ ਅਜ਼ੀਜ਼ਉੱਦੀਨ ਵਿਦੇਸ਼ ਮੰਤਰੀ, ਦੀਵਾਨ ਭਵਾਨੀ ਦਾਸ ਵਿੱਤ ਮੰਤਰੀ ਅਤੇ ਹਰੀ ਸਿੰਘ ਨਲਵਾ ਪ੍ਰਮੁੱਖ ਫੌਜੀ ਕਮਾਂਡਰ ਸਨ."}),
  C("PGK-001-MTF-010","PGK-001-CP-015",["PGK-001-QL-102","PGK-001-QL-103"],"Hard",[2,4,1,3],
    {listI:["Suba","Mauza","Fauj-i-Khas","Lahore city police"],listII:["General Ventura","Nazim","Kotwal Imam Bakhsh","Muqaddam"],explanation:"A Suba was headed by a Nazim, a Mauza by a Muqaddam, Fauj-i-Khas by General Ventura, and Lahore's city policing was associated with Kotwal Imam Bakhsh."},
    {listI:["सूबा","मौजा","फ़ौज-ए-ख़ास","लाहौर नगर पुलिस"],listII:["जनरल वेंतूरा","नाज़िम","कोतवाल इमाम बख्श","मुकद्दम"],explanation:"सूबा का प्रमुख नाज़िम, मौजा का प्रमुख मुकद्दम था। फ़ौज-ए-ख़ास जनरल वेंतूरा से और लाहौर की नगर पुलिस कोतवाल इमाम बख्श से जुड़ी थी।"},
    {listI:["ਸੂਬਾ","ਮੌਜਾ","ਫ਼ੌਜ-ਏ-ਖ਼ਾਸ","ਲਾਹੌਰ ਸ਼ਹਿਰੀ ਪੁਲਿਸ"],listII:["ਜਨਰਲ ਵੈਂਤੂਰਾ","ਨਾਜ਼ਿਮ","ਕੋਤਵਾਲ ਇਮਾਮ ਬਖ਼ਸ਼","ਮੁਕੱਦਮ"],explanation:"ਸੂਬੇ ਦਾ ਮੁਖੀ ਨਾਜ਼ਿਮ ਅਤੇ ਮੌਜੇ ਦਾ ਮੁਖੀ ਮੁਕੱਦਮ ਸੀ. ਫ਼ੌਜ-ਏ-ਖ਼ਾਸ ਜਨਰਲ ਵੈਂਤੂਰਾ ਅਤੇ ਲਾਹੌਰ ਦੀ ਸ਼ਹਿਰੀ ਪੁਲਿਸ ਕੋਤਵਾਲ ਇਮਾਮ ਬਖ਼ਸ਼ ਨਾਲ ਜੁੜੀ ਸੀ."}),

  C("PGK-001-MTF-011","PGK-001-CP-016",["PGK-001-QL-106"],"Hard",[2,4,1,3],
    {listI:["Mudki","Ferozeshah","Aliwal","Sobraon"],listII:["28 January 1846","18 December 1845","10 February 1846","21–22 December 1845"],explanation:"Mudki was fought on 18 December 1845, Ferozeshah on 21–22 December 1845, Aliwal on 28 January 1846 and Sobraon on 10 February 1846."},
    {listI:["मुदकी","फिरोज़शाह","आलीवाल","सभराओं"],listII:["28 जनवरी 1846","18 दिसंबर 1845","10 फरवरी 1846","21–22 दिसंबर 1845"],explanation:"मुदकी 18 दिसंबर 1845, फिरोज़शाह 21–22 दिसंबर 1845, आलीवाल 28 जनवरी 1846 और सभराओं 10 फरवरी 1846 को लड़ा गया।"},
    {listI:["ਮੁਦਕੀ","ਫਿਰੋਜ਼ਸ਼ਾਹ","ਆਲੀਵਾਲ","ਸਭਰਾਉਂ"],listII:["28 ਜਨਵਰੀ 1846","18 ਦਸੰਬਰ 1845","10 ਫ਼ਰਵਰੀ 1846","21–22 ਦਸੰਬਰ 1845"],explanation:"ਮੁਦਕੀ 18 ਦਸੰਬਰ 1845, ਫਿਰੋਜ਼ਸ਼ਾਹ 21–22 ਦਸੰਬਰ 1845, ਆਲੀਵਾਲ 28 ਜਨਵਰੀ 1846 ਅਤੇ ਸਭਰਾਉਂ 10 ਫ਼ਰਵਰੀ 1846 ਨੂੰ ਲੜਿਆ ਗਿਆ."}),
  C("PGK-001-MTF-012","PGK-001-CP-016",["PGK-001-QL-107","PGK-001-QL-108","PGK-001-QL-110"],"Hard",[3,1,4,2],
    {listI:["Treaty of Lahore","Treaty of Amritsar","Treaty of Bhairowal","Annexation of Punjab"],listII:["16 March 1846","29 March 1849","9 March 1846","December 1846"],explanation:"The Treaty of Lahore was signed on 9 March 1846, Treaty of Amritsar on 16 March 1846, Bhairowal in December 1846, and Punjab was annexed on 29 March 1849."},
    {listI:["लाहौर की संधि","अमृतसर की संधि","भैरोंवाल की संधि","पंजाब का विलय"],listII:["16 मार्च 1846","29 मार्च 1849","9 मार्च 1846","दिसंबर 1846"],explanation:"लाहौर की संधि 9 मार्च 1846, अमृतसर की संधि 16 मार्च 1846, भैरोंवाल की संधि दिसंबर 1846 और पंजाब का विलय 29 मार्च 1849 से जुड़ा है।"},
    {listI:["ਲਾਹੌਰ ਦੀ ਸੰਧੀ","ਅੰਮ੍ਰਿਤਸਰ ਦੀ ਸੰਧੀ","ਭੈਰੋਂਵਾਲ ਦੀ ਸੰਧੀ","ਪੰਜਾਬ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਰਾਜ ਵਿੱਚ ਮਿਲਾਉਣਾ"],listII:["16 ਮਾਰਚ 1846","29 ਮਾਰਚ 1849","9 ਮਾਰਚ 1846","ਦਸੰਬਰ 1846"],explanation:"ਲਾਹੌਰ ਦੀ ਸੰਧੀ 9 ਮਾਰਚ 1846, ਅੰਮ੍ਰਿਤਸਰ ਦੀ ਸੰਧੀ 16 ਮਾਰਚ 1846, ਭੈਰੋਂਵਾਲ ਦੀ ਸੰਧੀ ਦਸੰਬਰ 1846 ਅਤੇ ਪੰਜਾਬ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਰਾਜ ਵਿੱਚ ਮਿਲਾਉਣਾ 29 ਮਾਰਚ 1849 ਨਾਲ ਜੁੜਿਆ ਹੈ."}),

  C("PGK-001-MTF-013","PGK-001-CP-018",["PGK-001-QL-119","PGK-001-QL-121","PGK-001-QL-122","PGK-001-QL-123"],"Medium",[4,2,1,3],
    {listI:["Partition of Punjab","PEPSU inaugurated","PEPSU merged with Punjab","Punjab reorganisation appointed day"],listII:["1 November 1956","15 July 1948","1 November 1966","1947"],explanation:"Punjab was partitioned in 1947; PEPSU was inaugurated on 15 July 1948, merged with Punjab on 1 November 1956, and the 1966 reorganisation took effect on 1 November 1966."},
    {listI:["पंजाब का विभाजन","पेप्सू का उद्घाटन","पेप्सू का पंजाब में विलय","पंजाब पुनर्गठन का नियत दिन"],listII:["1 नवंबर 1956","15 जुलाई 1948","1 नवंबर 1966","1947"],explanation:"पंजाब का विभाजन 1947 में हुआ। पेप्सू का उद्घाटन 15 जुलाई 1948, पंजाब में विलय 1 नवंबर 1956 और 1966 का पुनर्गठन 1 नवंबर 1966 से प्रभावी हुआ।"},
    {listI:["ਪੰਜਾਬ ਦੀ ਵੰਡ","ਪੈਪਸੂ ਦਾ ਉਦਘਾਟਨ","ਪੈਪਸੂ ਦਾ ਪੰਜਾਬ ਵਿੱਚ ਰਲੇਵਾਂ","ਪੰਜਾਬ ਪੁਨਰਗਠਨ ਦਾ ਨਿਯਤ ਦਿਨ"],listII:["1 ਨਵੰਬਰ 1956","15 ਜੁਲਾਈ 1948","1 ਨਵੰਬਰ 1966","1947"],explanation:"ਪੰਜਾਬ ਦੀ ਵੰਡ 1947 ਵਿੱਚ ਹੋਈ. ਪੈਪਸੂ ਦਾ ਉਦਘਾਟਨ 15 ਜੁਲਾਈ 1948, ਪੰਜਾਬ ਵਿੱਚ ਰਲੇਵਾਂ 1 ਨਵੰਬਰ 1956 ਅਤੇ 1966 ਦਾ ਪੁਨਰਗਠਨ 1 ਨਵੰਬਰ 1966 ਤੋਂ ਲਾਗੂ ਹੋਇਆ."}),
  C("PGK-001-MTF-014","PGK-001-CP-018",["PGK-001-QL-123"],"Hard",[2,4,1,3],
    {listI:["Haryana","Chandigarh","Specified hill territories","Punjab Reorganisation Act"],listII:["Transferred to Himachal Pradesh","New state formed from Punjab","Enacted on 18 September 1966","Became a Union Territory and shared capital"],explanation:"Under the 1966 reorganisation Haryana became a new state, Chandigarh a Union Territory and shared capital, specified hill territories went to Himachal Pradesh, and the Act itself was enacted on 18 September 1966."},
    {listI:["हरियाणा","चंडीगढ़","निर्दिष्ट पहाड़ी क्षेत्र","पंजाब पुनर्गठन अधिनियम"],listII:["हिमाचल प्रदेश को स्थानांतरित","पंजाब से बना नया राज्य","18 सितंबर 1966 को अधिनियमित","केंद्र शासित प्रदेश और साझा राजधानी बना"],explanation:"1966 के पुनर्गठन में हरियाणा नया राज्य बना, चंडीगढ़ केंद्र शासित प्रदेश व साझा राजधानी बना, कुछ पहाड़ी क्षेत्र हिमाचल प्रदेश को गए और अधिनियम 18 सितंबर 1966 को पारित हुआ।"},
    {listI:["ਹਰਿਆਣਾ","ਚੰਡੀਗੜ੍ਹ","ਨਿਰਧਾਰਤ ਪਹਾੜੀ ਇਲਾਕੇ","ਪੰਜਾਬ ਪੁਨਰਗਠਨ ਐਕਟ"],listII:["ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼ ਨੂੰ ਤਬਦੀਲ","ਪੰਜਾਬ ਤੋਂ ਬਣਿਆ ਨਵਾਂ ਰਾਜ","18 ਸਤੰਬਰ 1966 ਨੂੰ ਕਾਨੂੰਨ ਬਣਿਆ","ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਅਤੇ ਸਾਂਝੀ ਰਾਜਧਾਨੀ ਬਣਿਆ"],explanation:"1966 ਦੇ ਪੁਨਰਗਠਨ ਵਿੱਚ ਹਰਿਆਣਾ ਨਵਾਂ ਰਾਜ ਬਣਿਆ, ਚੰਡੀਗੜ੍ਹ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਅਤੇ ਸਾਂਝੀ ਰਾਜਧਾਨੀ ਬਣਿਆ, ਕੁਝ ਪਹਾੜੀ ਇਲਾਕੇ ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼ ਨੂੰ ਗਏ ਅਤੇ ਐਕਟ 18 ਸਤੰਬਰ 1966 ਨੂੰ ਕਾਨੂੰਨ ਬਣਿਆ."}),

  C("PGK-001-MTF-015","PGK-001-CP-020",["PGK-001-QL-133","PGK-001-QL-134","PGK-001-QL-135"],"Medium",[3,1,4,2],
    {listI:["Punjab population","Literacy rate","Overall sex ratio","Child sex ratio"],listII:["75.84%","846","About 2.77 crore","895"],explanation:"Census 2011 recorded Punjab's population at about 2.77 crore, literacy at 75.84%, overall sex ratio at 895 and child sex ratio at 846."},
    {listI:["पंजाब की जनसंख्या","साक्षरता दर","कुल लिंगानुपात","बाल लिंगानुपात"],listII:["75.84%","846","लगभग 2.77 करोड़","895"],explanation:"जनगणना 2011 में पंजाब की जनसंख्या लगभग 2.77 करोड़, साक्षरता 75.84%, कुल लिंगानुपात 895 और बाल लिंगानुपात 846 था।"},
    {listI:["ਪੰਜਾਬ ਦੀ ਆਬਾਦੀ","ਸਾਖਰਤਾ ਦਰ","ਕੁੱਲ ਲਿੰਗ ਅਨੁਪਾਤ","ਬਾਲ ਲਿੰਗ ਅਨੁਪਾਤ"],listII:["75.84%","846","ਲਗਭਗ 2.77 ਕਰੋੜ","895"],explanation:"ਜਨਗਣਨਾ 2011 ਵਿੱਚ ਪੰਜਾਬ ਦੀ ਆਬਾਦੀ ਲਗਭਗ 2.77 ਕਰੋੜ, ਸਾਖਰਤਾ 75.84%, ਕੁੱਲ ਲਿੰਗ ਅਨੁਪਾਤ 895 ਅਤੇ ਬਾਲ ਲਿੰਗ ਅਨੁਪਾਤ 846 ਸੀ."}),
  C("PGK-001-MTF-016","PGK-001-CP-020",["PGK-001-QL-139"],"Hard",[4,2,1,3],
    {listI:["Ludhiana","Hoshiarpur","Mansa","Bathinda"],listII:["Lowest district literacy","Highest district literacy","Lowest district sex ratio","Highest district population density"],explanation:"In Census 2011 Punjab, Ludhiana had the highest density, Hoshiarpur the highest literacy, Mansa the lowest literacy and Bathinda the lowest sex ratio."},
    {listI:["लुधियाना","होशियारपुर","मानसा","बठिंडा"],listII:["सबसे कम जिला साक्षरता","सबसे अधिक जिला साक्षरता","सबसे कम जिला लिंगानुपात","सबसे अधिक जिला जनसंख्या घनत्व"],explanation:"जनगणना 2011 में लुधियाना का घनत्व सबसे अधिक, होशियारपुर की साक्षरता सबसे अधिक, मानसा की साक्षरता सबसे कम और बठिंडा का लिंगानुपात सबसे कम था।"},
    {listI:["ਲੁਧਿਆਣਾ","ਹੁਸ਼ਿਆਰਪੁਰ","ਮਾਨਸਾ","ਬਠਿੰਡਾ"],listII:["ਸਭ ਤੋਂ ਘੱਟ ਜ਼ਿਲ੍ਹਾ ਸਾਖਰਤਾ","ਸਭ ਤੋਂ ਵੱਧ ਜ਼ਿਲ੍ਹਾ ਸਾਖਰਤਾ","ਸਭ ਤੋਂ ਘੱਟ ਜ਼ਿਲ੍ਹਾ ਲਿੰਗ ਅਨੁਪਾਤ","ਸਭ ਤੋਂ ਵੱਧ ਜ਼ਿਲ੍ਹਾ ਆਬਾਦੀ ਘਣਤਾ"],explanation:"ਜਨਗਣਨਾ 2011 ਵਿੱਚ ਲੁਧਿਆਣਾ ਦੀ ਘਣਤਾ ਸਭ ਤੋਂ ਵੱਧ, ਹੁਸ਼ਿਆਰਪੁਰ ਦੀ ਸਾਖਰਤਾ ਸਭ ਤੋਂ ਵੱਧ, ਮਾਨਸਾ ਦੀ ਸਾਖਰਤਾ ਸਭ ਤੋਂ ਘੱਟ ਅਤੇ ਬਠਿੰਡਾ ਦਾ ਲਿੰਗ ਅਨੁਪਾਤ ਸਭ ਤੋਂ ਘੱਟ ਸੀ."}),

  C("PGK-001-MTF-017","PGK-001-CP-022",["PGK-001-QL-148","PGK-001-QL-149","PGK-001-QL-150","PGK-001-QL-151"],"Medium",[2,4,1,3],
    {listI:["Waris Shah","Bhai Vir Singh","Amrita Pritam","Shiv Kumar Batalvi"],listII:["Pinjar","Heer","Loona","Sundari"],explanation:"Waris Shah wrote Heer, Bhai Vir Singh wrote Sundari, Amrita Pritam wrote Pinjar and Shiv Kumar Batalvi wrote Loona."},
    {listI:["वारिस शाह","भाई वीर सिंह","अमृता प्रीतम","शिव कुमार बटालवी"],listII:["पिंजर","हीर","लूणा","सुंदरी"],explanation:"वारिस शाह ने हीर, भाई वीर सिंह ने सुंदरी, अमृता प्रीतम ने पिंजर और शिव कुमार बटालवी ने लूणा लिखी।"},
    {listI:["ਵਾਰਿਸ ਸ਼ਾਹ","ਭਾਈ ਵੀਰ ਸਿੰਘ","ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ","ਸ਼ਿਵ ਕੁਮਾਰ ਬਟਾਲਵੀ"],listII:["ਪਿੰਜਰ","ਹੀਰ","ਲੂਣਾ","ਸੁੰਦਰੀ"],explanation:"ਵਾਰਿਸ ਸ਼ਾਹ ਨੇ ਹੀਰ, ਭਾਈ ਵੀਰ ਸਿੰਘ ਨੇ ਸੁੰਦਰੀ, ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ ਨੇ ਪਿੰਜਰ ਅਤੇ ਸ਼ਿਵ ਕੁਮਾਰ ਬਟਾਲਵੀ ਨੇ ਲੂਣਾ ਲਿਖੀ."}),
  C("PGK-001-MTF-018","PGK-001-CP-022",["PGK-001-QL-149","PGK-001-QL-150","PGK-001-QL-151","PGK-001-QL-153"],"Hard",[3,1,4,2],
    {listI:["Mere Sainya Jio","Sunehure","Ik Miyan Do Talwaran","Loona"],listII:["1956","1967","1955","1961"],explanation:"The Sahitya Akademi award years are 1955 for Mere Sainya Jio, 1956 for Sunehure, 1961 for Ik Miyan Do Talwaran and 1967 for Loona."},
    {listI:["मेरे साईं जीओ","सुनेहड़े","इक म्यान दो तलवारां","लूणा"],listII:["1956","1967","1955","1961"],explanation:"साहित्य अकादमी पुरस्कार वर्ष क्रमशः मेरे साईं जीओ—1955, सुनेहड़े—1956, इक म्यान दो तलवारां—1961 और लूणा—1967 हैं।"},
    {listI:["ਮੇਰੇ ਸਾਈਆਂ ਜੀਓ","ਸੁਨੇਹੜੇ","ਇੱਕ ਮਿਆਨ ਦੋ ਤਲਵਾਰਾਂ","ਲੂਣਾ"],listII:["1956","1967","1955","1961"],explanation:"ਸਾਹਿਤ ਅਕਾਦਮੀ ਪੁਰਸਕਾਰ ਸਾਲ ਕ੍ਰਮਵਾਰ ਮੇਰੇ ਸਾਈਆਂ ਜੀਓ—1955, ਸੁਨੇਹੜੇ—1956, ਇੱਕ ਮਿਆਨ ਦੋ ਤਲਵਾਰਾਂ—1961 ਅਤੇ ਲੂਣਾ—1967 ਹਨ."}),

  C("PGK-001-MTF-019","PGK-001-CP-024",["PGK-001-QL-161","PGK-001-QL-162","PGK-001-QL-163","PGK-001-QL-164"],"Medium",[4,2,1,3],
    {listI:["Hola Mohalla","Maghi Mela","Shaheedi Jor Mela","Baba Sodal Mela"],listII:["Fatehgarh Sahib","Sri Muktsar Sahib","Jalandhar","Sri Anandpur Sahib"],explanation:"Hola Mohalla is held at Anandpur Sahib, Maghi at Muktsar, Shaheedi Jor Mela at Fatehgarh Sahib and Baba Sodal Mela at Jalandhar."},
    {listI:["होला मोहल्ला","माघी मेला","शहीदी जोड़ मेला","बाबा सोडल मेला"],listII:["फतेहगढ़ साहिब","श्री मुक्तसर साहिब","जालंधर","श्री आनंदपुर साहिब"],explanation:"होला मोहल्ला आनंदपुर साहिब, माघी मुक्तसर, शहीदी जोड़ मेला फतेहगढ़ साहिब और बाबा सोडल मेला जालंधर में होता है।"},
    {listI:["ਹੋਲਾ ਮਹੱਲਾ","ਮਾਘੀ ਮੇਲਾ","ਸ਼ਹੀਦੀ ਜੋੜ ਮੇਲਾ","ਬਾਬਾ ਸੋਡਲ ਮੇਲਾ"],listII:["ਫਤਿਹਗੜ੍ਹ ਸਾਹਿਬ","ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ","ਜਲੰਧਰ","ਸ੍ਰੀ ਅਨੰਦਪੁਰ ਸਾਹਿਬ"],explanation:"ਹੋਲਾ ਮਹੱਲਾ ਅਨੰਦਪੁਰ ਸਾਹਿਬ, ਮਾਘੀ ਮੁਕਤਸਰ, ਸ਼ਹੀਦੀ ਜੋੜ ਮੇਲਾ ਫਤਿਹਗੜ੍ਹ ਸਾਹਿਬ ਅਤੇ ਬਾਬਾ ਸੋਡਲ ਮੇਲਾ ਜਲੰਧਰ ਵਿੱਚ ਹੁੰਦਾ ਹੈ."}),
  C("PGK-001-MTF-020","PGK-001-CP-024",["PGK-001-QL-161","PGK-001-QL-165","PGK-001-QL-166"],"Hard",[2,4,1,3],
    {listI:["Takht Sri Kesgarh Sahib","Jallianwala Bagh","Qila Mubarak, Patiala","Virasat-e-Khalsa"],listII:["Foundation laid in 1763 by Baba Ala Singh","Khalsa founded in 1699","Opened to the public in 2011","Memorial site of 13 April 1919"],explanation:"Kesgarh Sahib marks the 1699 Khalsa foundation; Jallianwala Bagh memorialises 13 April 1919; Qila Mubarak traces its foundation to Baba Ala Singh in 1763; Virasat-e-Khalsa opened in 2011."},
    {listI:["तख्त श्री केसगढ़ साहिब","जलियांवाला बाग","किला मुबारक, पटियाला","विरासत-ए-खालसा"],listII:["1763 में बाबा आला सिंह ने नींव रखी","1699 में खालसा की स्थापना","2011 में आम जनता के लिए खुला","13 अप्रैल 1919 की स्मृति का स्थल"],explanation:"केसगढ़ साहिब 1699 के खालसा, जलियांवाला बाग 13 अप्रैल 1919, किला मुबारक 1763 में बाबा आला सिंह और विरासत-ए-खालसा 2011 से जुड़ा है।"},
    {listI:["ਤਖ਼ਤ ਸ੍ਰੀ ਕੇਸਗੜ੍ਹ ਸਾਹਿਬ","ਜਲ੍ਹਿਆਂਵਾਲਾ ਬਾਗ","ਕਿਲਾ ਮੁਬਾਰਕ, ਪਟਿਆਲਾ","ਵਿਰਾਸਤ-ਏ-ਖਾਲਸਾ"],listII:["1763 ਵਿੱਚ ਬਾਬਾ ਆਲਾ ਸਿੰਘ ਨੇ ਨੀਂਹ ਰੱਖੀ","1699 ਵਿੱਚ ਖ਼ਾਲਸੇ ਦੀ ਸਾਜਨਾ","2011 ਵਿੱਚ ਆਮ ਲੋਕਾਂ ਲਈ ਖੁੱਲ੍ਹਿਆ","13 ਅਪ੍ਰੈਲ 1919 ਦੀ ਯਾਦ ਦਾ ਸਥਾਨ"],explanation:"ਕੇਸਗੜ੍ਹ ਸਾਹਿਬ 1699 ਦੇ ਖ਼ਾਲਸੇ, ਜਲ੍ਹਿਆਂਵਾਲਾ ਬਾਗ 13 ਅਪ੍ਰੈਲ 1919, ਕਿਲਾ ਮੁਬਾਰਕ 1763 ਵਿੱਚ ਬਾਬਾ ਆਲਾ ਸਿੰਘ ਅਤੇ ਵਿਰਾਸਤ-ਏ-ਖਾਲਸਾ 2011 ਨਾਲ ਜੁੜਿਆ ਹੈ."}),

  C("PGK-001-MTF-021","PGK-001-CP-025",["PGK-001-QL-168","PGK-001-QL-169","PGK-001-QL-170","PGK-001-QL-172"],"Medium",[3,4,1,2],
    {listI:["Milkha Singh","Balbir Singh Sr.","Ajit Pal Singh","Gurbachan Singh Randhawa"],listII:["1975 Hockey World Cup-winning captain","1962 Asian Games decathlon gold","Fourth in 400 m at Rome 1960","Three Olympic hockey gold medals as a player"],explanation:"Milkha Singh was fourth in the 400 m at Rome 1960; Balbir Singh Sr. won three Olympic hockey golds; Ajit Pal Singh captained the 1975 World Cup winners; Randhawa won the 1962 Asian Games decathlon."},
    {listI:["मिल्खा सिंह","बलबीर सिंह सीनियर","अजीत पाल सिंह","गुरबचन सिंह रंधावा"],listII:["1975 हॉकी विश्व कप विजेता कप्तान","1962 एशियाई खेल डेकाथलॉन स्वर्ण","रोम 1960 में 400 मीटर में चौथा स्थान","खिलाड़ी के रूप में तीन ओलंपिक हॉकी स्वर्ण"],explanation:"मिल्खा सिंह रोम 1960 में 400 मीटर में चौथे, बलबीर सिंह सीनियर तीन ओलंपिक स्वर्ण विजेता, अजीत पाल सिंह 1975 विश्व कप कप्तान और रंधावा 1962 एशियाई खेल डेकाथलॉन विजेता थे।"},
    {listI:["ਮਿਲਖਾ ਸਿੰਘ","ਬਲਬੀਰ ਸਿੰਘ ਸੀਨੀਅਰ","ਅਜੀਤ ਪਾਲ ਸਿੰਘ","ਗੁਰਬਚਨ ਸਿੰਘ ਰੰਧਾਵਾ"],listII:["1975 ਹਾਕੀ ਵਿਸ਼ਵ ਕੱਪ ਜੇਤੂ ਕਪਤਾਨ","1962 ਏਸ਼ੀਆਈ ਖੇਡਾਂ ਡਿਕੈਥਲਨ ਸੋਨਾ","ਰੋਮ 1960 ਵਿੱਚ 400 ਮੀਟਰ ਵਿੱਚ ਚੌਥਾ ਸਥਾਨ","ਖਿਡਾਰੀ ਵਜੋਂ ਤਿੰਨ ਓਲੰਪਿਕ ਹਾਕੀ ਸੋਨੇ"],explanation:"ਮਿਲਖਾ ਸਿੰਘ ਰੋਮ 1960 ਵਿੱਚ 400 ਮੀਟਰ ਵਿੱਚ ਚੌਥੇ, ਬਲਬੀਰ ਸਿੰਘ ਸੀਨੀਅਰ ਤਿੰਨ ਓਲੰਪਿਕ ਸੋਨ ਤਮਗਾ ਜੇਤੂ, ਅਜੀਤ ਪਾਲ ਸਿੰਘ 1975 ਵਿਸ਼ਵ ਕੱਪ ਕਪਤਾਨ ਅਤੇ ਰੰਧਾਵਾ 1962 ਏਸ਼ੀਆਈ ਖੇਡਾਂ ਡਿਕੈਥਲਨ ਜੇਤੂ ਸਨ."}),
  C("PGK-001-MTF-022","PGK-001-CP-025",["PGK-001-QL-169","PGK-001-QL-171"],"Hard",[4,2,1,3],
    {listI:["Pargat Singh","Manpreet Singh","Harmanpreet Singh","Balbir Singh Sr."],listII:["Paris 2024 bronze-medal captain","Tokyo 2020 bronze-medal captain","Melbourne 1956 gold-medal captain","India captain at both 1992 and 1996 Olympics"],explanation:"Pargat Singh captained India at the 1992 and 1996 Olympics, Manpreet at Tokyo 2020, Harmanpreet at Paris 2024, and Balbir Singh Sr. at Melbourne 1956."},
    {listI:["परगट सिंह","मनप्रीत सिंह","हरमनप्रीत सिंह","बलबीर सिंह सीनियर"],listII:["पेरिस 2024 कांस्य पदक विजेता कप्तान","टोक्यो 2020 कांस्य पदक विजेता कप्तान","मेलबर्न 1956 स्वर्ण पदक विजेता कप्तान","1992 और 1996 दोनों ओलंपिक में भारत के कप्तान"],explanation:"परगट सिंह 1992 और 1996, मनप्रीत सिंह टोक्यो 2020, हरमनप्रीत सिंह पेरिस 2024 और बलबीर सिंह सीनियर मेलबर्न 1956 में भारतीय हॉकी टीम के कप्तान थे।"},
    {listI:["ਪਰਗਟ ਸਿੰਘ","ਮਨਪ੍ਰੀਤ ਸਿੰਘ","ਹਰਮਨਪ੍ਰੀਤ ਸਿੰਘ","ਬਲਬੀਰ ਸਿੰਘ ਸੀਨੀਅਰ"],listII:["ਪੈਰਿਸ 2024 ਕਾਂਸੀ ਤਮਗਾ ਜੇਤੂ ਕਪਤਾਨ","ਟੋਕਿਓ 2020 ਕਾਂਸੀ ਤਮਗਾ ਜੇਤੂ ਕਪਤਾਨ","ਮੈਲਬਰਨ 1956 ਸੋਨ ਤਮਗਾ ਜੇਤੂ ਕਪਤਾਨ","1992 ਅਤੇ 1996 ਦੋਵੇਂ ਓਲੰਪਿਕ ਵਿੱਚ ਭਾਰਤ ਦੇ ਕਪਤਾਨ"],explanation:"ਪਰਗਟ ਸਿੰਘ 1992 ਅਤੇ 1996, ਮਨਪ੍ਰੀਤ ਸਿੰਘ ਟੋਕਿਓ 2020, ਹਰਮਨਪ੍ਰੀਤ ਸਿੰਘ ਪੈਰਿਸ 2024 ਅਤੇ ਬਲਬੀਰ ਸਿੰਘ ਸੀਨੀਅਰ ਮੈਲਬਰਨ 1956 ਵਿੱਚ ਭਾਰਤੀ ਹਾਕੀ ਟੀਮ ਦੇ ਕਪਤਾਨ ਸਨ."}),

  C("PGK-001-MTF-023","PGK-001-CP-026",["PGK-001-QL-176","PGK-001-QL-179","PGK-001-QL-180"],"Medium",[3,1,4,2],
    {listI:["Jalandhar","Hoshiarpur","Mansa","Fazilka"],listII:["Wood-inlay craft","Abohar Wildlife Sanctuary","Sports-goods industry","Cotton-belt / white-gold region"],explanation:"Jalandhar is associated with sports goods, Hoshiarpur with wood inlay, Mansa with the cotton belt, and Fazilka with Abohar Wildlife Sanctuary."},
    {listI:["जालंधर","होशियारपुर","मानसा","फाजिल्का"],listII:["लकड़ी की जड़ाई","अबोहर वन्यजीव अभयारण्य","खेल-सामान उद्योग","कपास पट्टी / सफेद सोने का क्षेत्र"],explanation:"जालंधर खेल-सामान, होशियारपुर लकड़ी की जड़ाई, मानसा कपास पट्टी और फाजिल्का अबोहर वन्यजीव अभयारण्य से जुड़ा है।"},
    {listI:["ਜਲੰਧਰ","ਹੁਸ਼ਿਆਰਪੁਰ","ਮਾਨਸਾ","ਫ਼ਾਜ਼ਿਲਕਾ"],listII:["ਲੱਕੜ ਦੀ ਜੜਾਈ","ਅਬੋਹਰ ਜੰਗਲੀ ਜੀਵ ਅਭਿਆਰਣ","ਖੇਡ-ਸਾਮਾਨ ਉਦਯੋਗ","ਕਪਾਹ ਪੱਟੀ / ਚਿੱਟੇ ਸੋਨੇ ਦਾ ਖੇਤਰ"],explanation:"ਜਲੰਧਰ ਖੇਡ-ਸਾਮਾਨ, ਹੁਸ਼ਿਆਰਪੁਰ ਲੱਕੜ ਦੀ ਜੜਾਈ, ਮਾਨਸਾ ਕਪਾਹ ਪੱਟੀ ਅਤੇ ਫ਼ਾਜ਼ਿਲਕਾ ਅਬੋਹਰ ਜੰਗਲੀ ਜੀਵ ਅਭਿਆਰਣ ਨਾਲ ਜੁੜਿਆ ਹੈ."}),
  C("PGK-001-MTF-024","PGK-001-CP-026",["PGK-001-QL-176","PGK-001-QL-178","PGK-001-QL-180"],"Hard",[4,2,1,3],
    {listI:["Ludhiana","S.A.S. Nagar","Kapurthala","Patiala"],listII:["Pushpa Gujral Science City","IISER Mohali","Netaji Subhas National Institute of Sports","Punjab Agricultural University"],explanation:"Punjab Agricultural University is in Ludhiana, IISER Mohali in S.A.S. Nagar, Pushpa Gujral Science City in Kapurthala and the National Institute of Sports in Patiala."},
    {listI:["लुधियाना","एस.ए.एस. नगर","कपूरथला","पटियाला"],listII:["पुष्पा गुजराल साइंस सिटी","आईआईएसईआर मोहाली","नेताजी सुभाष राष्ट्रीय खेल संस्थान","पंजाब कृषि विश्वविद्यालय"],explanation:"पंजाब कृषि विश्वविद्यालय लुधियाना, आईआईएसईआर मोहाली एस.ए.एस. नगर, पुष्पा गुजराल साइंस सिटी कपूरथला और राष्ट्रीय खेल संस्थान पटियाला में है।"},
    {listI:["ਲੁਧਿਆਣਾ","ਐੱਸ.ਏ.ਐੱਸ. ਨਗਰ","ਕਪੂਰਥਲਾ","ਪਟਿਆਲਾ"],listII:["ਪੁਸ਼ਪਾ ਗੁਜਰਾਲ ਸਾਇੰਸ ਸਿਟੀ","ਆਈਆਈਐੱਸਈਆਰ ਮੋਹਾਲੀ","ਨੇਤਾਜੀ ਸੁਭਾਸ਼ ਰਾਸ਼ਟਰੀ ਖੇਡ ਸੰਸਥਾਨ","ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ"],explanation:"ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ ਲੁਧਿਆਣਾ, ਆਈਆਈਐੱਸਈਆਰ ਮੋਹਾਲੀ ਐੱਸ.ਏ.ਐੱਸ. ਨਗਰ, ਪੁਸ਼ਪਾ ਗੁਜਰਾਲ ਸਾਇੰਸ ਸਿਟੀ ਕਪੂਰਥਲਾ ਅਤੇ ਰਾਸ਼ਟਰੀ ਖੇਡ ਸੰਸਥਾਨ ਪਟਿਆਲਾ ਵਿੱਚ ਹੈ."})
]);

const instructionByLocale: Record<PgkMatchingLocaleV1,string> = {
  en: "Match List I with List II and select the correct code.",
  hi: "सूची-1 को सूची-2 से मिलाइए और सही कूट चुनिए।",
  pa: "ਸੂਚੀ-1 ਨੂੰ ਸੂਚੀ-2 ਨਾਲ ਮਿਲਾਓ ਅਤੇ ਸਹੀ ਕੋਡ ਚੁਣੋ।",
};

function swap(mapping: Mapping4,a:number,b:number): Mapping4 {
  const x=[...mapping] as number[]; [x[a],x[b]]=[x[b]!,x[a]!];
  return [x[0]!,x[1]!,x[2]!,x[3]!] as Mapping4;
}
function rotate(mapping: Mapping4): Mapping4 {
  return [mapping[1],mapping[2],mapping[3],mapping[0]] as Mapping4;
}
function code(mapping: Mapping4) {
  return mapping.map((v,i)=>`${String.fromCharCode(65+i)}-${v}`).join(", ");
}
function optionsFor(id:string,mapping:Mapping4){
  const raw=[mapping,swap(mapping,0,1),swap(mapping,2,3),rotate(mapping)];
  const unique=[...new Map(raw.map(m=>[code(m),m])).values()];
  if(unique.length!==4) throw new Error(`${id}: could not generate four unique answer codes`);
  const n=Number(id.slice(-3));
  const shift=n%4;
  const ordered=[...unique.slice(shift),...unique.slice(0,shift)];
  const correctCode=code(mapping);
  return {options:ordered.map(code),correctIndex:ordered.findIndex(m=>code(m)===correctCode),correctCode};
}
function contentFor(c:PgkMatchingConceptV1,l:PgkMatchingLocaleV1){return c[l];}
function stemFor(c:PgkMatchingConceptV1,l:PgkMatchingLocaleV1){
  const x=contentFor(c,l);
  return [
    instructionByLocale[l],
    "",
    l==="en" ? "List I" : l==="hi" ? "सूची-1" : "ਸੂਚੀ-1",
    ...x.listI.map((v,i)=>`${String.fromCharCode(65+i)}. ${v}`),
    "",
    l==="en" ? "List II" : l==="hi" ? "सूची-2" : "ਸੂਚੀ-2",
    ...x.listII.map((v,i)=>`${i+1}. ${v}`),
  ].join("\n");
}

export function generatePgkMatchFollowingReviewV1(locale: PgkMatchingLocaleV1): readonly PgkMatchingQuestionV1[] {
  return Object.freeze(PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.map((c)=>{
    const x=contentFor(c,locale),o=optionsFor(c.id,c.correctMapping);
    return Object.freeze({
      questionId:`${c.id}-${locale.toUpperCase()}`,
      cpId:c.cpId,
      sourceQlIds:Object.freeze([...c.sourceQlIds]),
      difficulty:c.difficulty,
      questionType:"Match the Following" as const,
      locale,
      stem:stemFor(c,locale),
      listI:Object.freeze([...x.listI]),
      listII:Object.freeze([...x.listII]),
      options:Object.freeze(o.options),
      correctIndex:o.correctIndex,
      canonicalAnswer:o.correctCode,
      explanation:x.explanation,
      reviewOnly:true as const,
      runtimeRegistered:false as const,
    });
  }));
}
