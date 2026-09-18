export type CP008AffixType="PREFIX"|"SUFFIX";
export type CP008AffixFunction="ABSENCE"|"BAD_QUALITY"|"SUBORDINATE"|"SHARED_EQUAL"|"SELF"|"COOPERATIVE"|"ABSTRACT_STATE"|"CHARACTER_QUALITY"|"POSSESSOR"|"AGENT_PROFESSION"|"ENDOWED"|"DEPRIVED";
export interface CP008AffixAuthority{readonly id:string;readonly affix:string;readonly type:CP008AffixType;readonly function:CP008AffixFunction;readonly functionLabelPa:string;readonly meaningPa:string;}
export interface CP008DerivationAuthority{readonly id:string;readonly affixId:string;readonly type:CP008AffixType;readonly affix:string;readonly root:string;readonly derived:string;readonly explanationPa:string;}

export const CP008_AFFIX_AUTHORITIES:readonly CP008AffixAuthority[]=[
{id:"AFX-001",affix:"ਬੇ",type:"PREFIX",function:"ABSENCE",functionLabelPa:"ਬਿਨਾਂ ਜਾਂ ਰਹਿਤ ਦਾ ਭਾਵ",meaningPa:"ਕਿਸੇ ਗੁਣ ਜਾਂ ਚੀਜ਼ ਦੀ ਘਾਟ ਜਾਂ ਅਣਹੋਂਦ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-002",affix:"ਬਦ",type:"PREFIX",function:"BAD_QUALITY",functionLabelPa:"ਮੰਦੇ ਜਾਂ ਬੁਰੇ ਭਾਵ",meaningPa:"ਮੰਦੇ, ਖ਼ਰਾਬ ਜਾਂ ਅਨੁਚਿਤ ਭਾਵ ਨੂੰ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-003",affix:"ਉਪ",type:"PREFIX",function:"SUBORDINATE",functionLabelPa:"ਗੌਣ ਜਾਂ ਸਹਾਇਕ ਦਰਜਾ",meaningPa:"ਮੁੱਖ ਤੋਂ ਹੇਠਲਾ, ਸਹਾਇਕ ਜਾਂ ਉਪ-ਦਰਜਾ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-004",affix:"ਹਮ",type:"PREFIX",function:"SHARED_EQUAL",functionLabelPa:"ਸਾਂਝ ਜਾਂ ਇੱਕੋ ਪੱਧਰ ਦਾ ਭਾਵ",meaningPa:"ਸਾਂਝ, ਇਕੱਠ ਜਾਂ ਇੱਕੋ ਹਾਲਤ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-005",affix:"ਸਵੈ",type:"PREFIX",function:"SELF",functionLabelPa:"ਆਪ ਜਾਂ ਆਪਣੇ ਆਪ ਦਾ ਭਾਵ",meaningPa:"ਆਪਣੇ ਆਪ ਜਾਂ ਆਪਣੇ ਨਾਲ ਸੰਬੰਧਿਤ ਭਾਵ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-006",affix:"ਸਹਿ",type:"PREFIX",function:"COOPERATIVE",functionLabelPa:"ਨਾਲ ਜਾਂ ਸਾਂਝੇ ਤੌਰ ਤੇ",meaningPa:"ਕਿਸੇ ਹੋਰ ਨਾਲ ਮਿਲ ਕੇ ਜਾਂ ਸਾਂਝੇ ਤੌਰ ਤੇ ਹੋਣ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-007",affix:"ਤਾ",type:"SUFFIX",function:"ABSTRACT_STATE",functionLabelPa:"ਗੁਣ ਜਾਂ ਅਵਸਥਾ ਦਾ ਭਾਵਵਾਚਕ ਨਾਮ",meaningPa:"ਵਿਸ਼ੇਸ਼ਣ ਤੋਂ ਗੁਣ ਜਾਂ ਅਵਸਥਾ ਦਾ ਭਾਵਵਾਚਕ ਨਾਮ ਬਣਾਉਂਦਾ ਹੈ"},
{id:"AFX-008",affix:"ਪਣ",type:"SUFFIX",function:"CHARACTER_QUALITY",functionLabelPa:"ਸੁਭਾਅ ਜਾਂ ਗੁਣ ਦਾ ਭਾਵ",meaningPa:"ਕਿਸੇ ਸੁਭਾਅ, ਗੁਣ ਜਾਂ ਹਾਲਤ ਨੂੰ ਨਾਮ ਦੇ ਰੂਪ ਵਿੱਚ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-009",affix:"ਦਾਰ",type:"SUFFIX",function:"POSSESSOR",functionLabelPa:"ਧਾਰਕ ਜਾਂ ਵਾਲਾ",meaningPa:"ਕਿਸੇ ਚੀਜ਼ ਜਾਂ ਗੁਣ ਨੂੰ ਰੱਖਣ ਵਾਲੇ ਵਿਅਕਤੀ ਜਾਂ ਪੱਖ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-010",affix:"ਕਾਰ",type:"SUFFIX",function:"AGENT_PROFESSION",functionLabelPa:"ਕੰਮ ਜਾਂ ਪੇਸ਼ਾ ਕਰਨ ਵਾਲਾ",meaningPa:"ਕਿਸੇ ਕੰਮ, ਕਲਾ ਜਾਂ ਪੇਸ਼ੇ ਨਾਲ ਜੁੜੇ ਕਰਨ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-011",affix:"ਵਾਨ",type:"SUFFIX",function:"ENDOWED",functionLabelPa:"ਗੁਣ ਜਾਂ ਵਸਤੂ ਨਾਲ ਯੁਕਤ",meaningPa:"ਕਿਸੇ ਗੁਣ ਜਾਂ ਵਸਤੂ ਨਾਲ ਭਰਪੂਰ ਹੋਣ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ"},
{id:"AFX-012",affix:"ਹੀਣ",type:"SUFFIX",function:"DEPRIVED",functionLabelPa:"ਬਿਨਾਂ ਜਾਂ ਵੰਚਿਤ",meaningPa:"ਕਿਸੇ ਗੁਣ ਜਾਂ ਵਸਤੂ ਤੋਂ ਰਹਿਤ ਹੋਣ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ"},
] as const;

export const CP008_DERIVATION_AUTHORITIES:readonly CP008DerivationAuthority[]=[
{id:"DRV-001",affixId:"AFX-001",type:"PREFIX",affix:"ਬੇ",root:"ਕਸੂਰ",derived:"ਬੇਕਸੂਰ",explanationPa:"‘ਬੇਕਸੂਰ’ = ‘ਬੇ’ + ‘ਕਸੂਰ’। ‘ਬੇ’ ਮੂਲ ਸ਼ਬਦ ਤੋਂ ਪਹਿਲਾਂ ਲੱਗਿਆ ਅਗੇਤਰ ਹੈ।"},
{id:"DRV-002",affixId:"AFX-001",type:"PREFIX",affix:"ਬੇ",root:"ਈਮਾਨ",derived:"ਬੇਈਮਾਨ",explanationPa:"‘ਬੇਈਮਾਨ’ = ‘ਬੇ’ + ‘ਈਮਾਨ’।"},
{id:"DRV-003",affixId:"AFX-001",type:"PREFIX",affix:"ਬੇ",root:"ਰੁਜ਼ਗਾਰ",derived:"ਬੇਰੁਜ਼ਗਾਰ",explanationPa:"‘ਬੇਰੁਜ਼ਗਾਰ’ = ‘ਬੇ’ + ‘ਰੁਜ਼ਗਾਰ’।"},
{id:"DRV-004",affixId:"AFX-001",type:"PREFIX",affix:"ਬੇ",root:"ਘਰ",derived:"ਬੇਘਰ",explanationPa:"‘ਬੇਘਰ’ = ‘ਬੇ’ + ‘ਘਰ’।"},
{id:"DRV-005",affixId:"AFX-002",type:"PREFIX",affix:"ਬਦ",root:"ਨਾਮ",derived:"ਬਦਨਾਮ",explanationPa:"‘ਬਦਨਾਮ’ = ‘ਬਦ’ + ‘ਨਾਮ’।"},
{id:"DRV-006",affixId:"AFX-002",type:"PREFIX",affix:"ਬਦ",root:"ਬੂ",derived:"ਬਦਬੂ",explanationPa:"‘ਬਦਬੂ’ = ‘ਬਦ’ + ‘ਬੂ’।"},
{id:"DRV-007",affixId:"AFX-002",type:"PREFIX",affix:"ਬਦ",root:"ਕਿਸਮਤ",derived:"ਬਦਕਿਸਮਤ",explanationPa:"‘ਬਦਕਿਸਮਤ’ = ‘ਬਦ’ + ‘ਕਿਸਮਤ’।"},
{id:"DRV-008",affixId:"AFX-002",type:"PREFIX",affix:"ਬਦ",root:"ਚਲਣ",derived:"ਬਦਚਲਣ",explanationPa:"‘ਬਦਚਲਣ’ = ‘ਬਦ’ + ‘ਚਲਣ’।"},
{id:"DRV-009",affixId:"AFX-003",type:"PREFIX",affix:"ਉਪ",root:"ਮੰਤਰੀ",derived:"ਉਪ-ਮੰਤਰੀ",explanationPa:"‘ਉਪ-ਮੰਤਰੀ’ = ‘ਉਪ’ + ‘ਮੰਤਰੀ’।"},
{id:"DRV-010",affixId:"AFX-003",type:"PREFIX",affix:"ਉਪ",root:"ਪ੍ਰਧਾਨ",derived:"ਉਪ-ਪ੍ਰਧਾਨ",explanationPa:"‘ਉਪ-ਪ੍ਰਧਾਨ’ = ‘ਉਪ’ + ‘ਪ੍ਰਧਾਨ’।"},
{id:"DRV-011",affixId:"AFX-003",type:"PREFIX",affix:"ਉਪ",root:"ਕੁਲਪਤੀ",derived:"ਉਪ-ਕੁਲਪਤੀ",explanationPa:"‘ਉਪ-ਕੁਲਪਤੀ’ = ‘ਉਪ’ + ‘ਕੁਲਪਤੀ’।"},
{id:"DRV-012",affixId:"AFX-003",type:"PREFIX",affix:"ਉਪ",root:"ਨਾਮ",derived:"ਉਪਨਾਮ",explanationPa:"‘ਉਪਨਾਮ’ = ‘ਉਪ’ + ‘ਨਾਮ’।"},
{id:"DRV-013",affixId:"AFX-004",type:"PREFIX",affix:"ਹਮ",root:"ਉਮਰ",derived:"ਹਮਉਮਰ",explanationPa:"‘ਹਮਉਮਰ’ = ‘ਹਮ’ + ‘ਉਮਰ’।"},
{id:"DRV-014",affixId:"AFX-004",type:"PREFIX",affix:"ਹਮ",root:"ਸਫ਼ਰ",derived:"ਹਮਸਫ਼ਰ",explanationPa:"‘ਹਮਸਫ਼ਰ’ = ‘ਹਮ’ + ‘ਸਫ਼ਰ’।"},
{id:"DRV-015",affixId:"AFX-004",type:"PREFIX",affix:"ਹਮ",root:"ਖ਼ਿਆਲ",derived:"ਹਮਖ਼ਿਆਲ",explanationPa:"‘ਹਮਖ਼ਿਆਲ’ = ‘ਹਮ’ + ‘ਖ਼ਿਆਲ’।"},
{id:"DRV-016",affixId:"AFX-004",type:"PREFIX",affix:"ਹਮ",root:"ਵਤਨ",derived:"ਹਮਵਤਨ",explanationPa:"‘ਹਮਵਤਨ’ = ‘ਹਮ’ + ‘ਵਤਨ’।"},
{id:"DRV-017",affixId:"AFX-005",type:"PREFIX",affix:"ਸਵੈ",root:"ਸੇਵਕ",derived:"ਸਵੈਸੇਵਕ",explanationPa:"‘ਸਵੈਸੇਵਕ’ = ‘ਸਵੈ’ + ‘ਸੇਵਕ’।"},
{id:"DRV-018",affixId:"AFX-005",type:"PREFIX",affix:"ਸਵੈ",root:"ਜੀਵਨੀ",derived:"ਸਵੈਜੀਵਨੀ",explanationPa:"‘ਸਵੈਜੀਵਨੀ’ = ‘ਸਵੈ’ + ‘ਜੀਵਨੀ’।"},
{id:"DRV-019",affixId:"AFX-005",type:"PREFIX",affix:"ਸਵੈ",root:"ਚਾਲਕ",derived:"ਸਵੈਚਾਲਕ",explanationPa:"‘ਸਵੈਚਾਲਕ’ = ‘ਸਵੈ’ + ‘ਚਾਲਕ’।"},
{id:"DRV-020",affixId:"AFX-005",type:"PREFIX",affix:"ਸਵੈ",root:"ਵਿਸ਼ਵਾਸ",derived:"ਸਵੈਵਿਸ਼ਵਾਸ",explanationPa:"‘ਸਵੈਵਿਸ਼ਵਾਸ’ = ‘ਸਵੈ’ + ‘ਵਿਸ਼ਵਾਸ’।"},
{id:"DRV-021",affixId:"AFX-006",type:"PREFIX",affix:"ਸਹਿ",root:"ਲੇਖਕ",derived:"ਸਹਿ-ਲੇਖਕ",explanationPa:"‘ਸਹਿ-ਲੇਖਕ’ = ‘ਸਹਿ’ + ‘ਲੇਖਕ’।"},
{id:"DRV-022",affixId:"AFX-006",type:"PREFIX",affix:"ਸਹਿ",root:"ਅਧਿਆਪਕ",derived:"ਸਹਿ-ਅਧਿਆਪਕ",explanationPa:"‘ਸਹਿ-ਅਧਿਆਪਕ’ = ‘ਸਹਿ’ + ‘ਅਧਿਆਪਕ’।"},
{id:"DRV-023",affixId:"AFX-006",type:"PREFIX",affix:"ਸਹਿ",root:"ਕਰਮੀ",derived:"ਸਹਿਕਰਮੀ",explanationPa:"‘ਸਹਿਕਰਮੀ’ = ‘ਸਹਿ’ + ‘ਕਰਮੀ’।"},
{id:"DRV-024",affixId:"AFX-006",type:"PREFIX",affix:"ਸਹਿ",root:"ਪਾਠੀ",derived:"ਸਹਿਪਾਠੀ",explanationPa:"‘ਸਹਿਪਾਠੀ’ = ‘ਸਹਿ’ + ‘ਪਾਠੀ’।"},
{id:"DRV-025",affixId:"AFX-007",type:"SUFFIX",affix:"ਤਾ",root:"ਸਫਲ",derived:"ਸਫਲਤਾ",explanationPa:"‘ਸਫਲਤਾ’ = ‘ਸਫਲ’ + ‘ਤਾ’। ‘ਤਾ’ ਮੂਲ ਸ਼ਬਦ ਤੋਂ ਬਾਅਦ ਲੱਗਿਆ ਪਿਛੇਤਰ ਹੈ।"},
{id:"DRV-026",affixId:"AFX-007",type:"SUFFIX",affix:"ਤਾ",root:"ਸੁੰਦਰ",derived:"ਸੁੰਦਰਤਾ",explanationPa:"‘ਸੁੰਦਰਤਾ’ = ‘ਸੁੰਦਰ’ + ‘ਤਾ’।"},
{id:"DRV-027",affixId:"AFX-007",type:"SUFFIX",affix:"ਤਾ",root:"ਸਮਾਨ",derived:"ਸਮਾਨਤਾ",explanationPa:"‘ਸਮਾਨਤਾ’ = ‘ਸਮਾਨ’ + ‘ਤਾ’।"},
{id:"DRV-028",affixId:"AFX-007",type:"SUFFIX",affix:"ਤਾ",root:"ਮਹਾਨ",derived:"ਮਹਾਨਤਾ",explanationPa:"‘ਮਹਾਨਤਾ’ = ‘ਮਹਾਨ’ + ‘ਤਾ’।"},
{id:"DRV-029",affixId:"AFX-008",type:"SUFFIX",affix:"ਪਣ",root:"ਚੰਗਾ",derived:"ਚੰਗਾਪਣ",explanationPa:"‘ਚੰਗਾਪਣ’ = ‘ਚੰਗਾ’ + ‘ਪਣ’।"},
{id:"DRV-030",affixId:"AFX-008",type:"SUFFIX",affix:"ਪਣ",root:"ਭੋਲਾ",derived:"ਭੋਲਾਪਣ",explanationPa:"‘ਭੋਲਾਪਣ’ = ‘ਭੋਲਾ’ + ‘ਪਣ’।"},
{id:"DRV-031",affixId:"AFX-008",type:"SUFFIX",affix:"ਪਣ",root:"ਆਪਣਾ",derived:"ਆਪਣਾਪਣ",explanationPa:"‘ਆਪਣਾਪਣ’ = ‘ਆਪਣਾ’ + ‘ਪਣ’।"},
{id:"DRV-032",affixId:"AFX-008",type:"SUFFIX",affix:"ਪਣ",root:"ਸਾਦਾ",derived:"ਸਾਦਾਪਣ",explanationPa:"‘ਸਾਦਾਪਣ’ = ‘ਸਾਦਾ’ + ‘ਪਣ’।"},
{id:"DRV-033",affixId:"AFX-009",type:"SUFFIX",affix:"ਦਾਰ",root:"ਦੁਕਾਨ",derived:"ਦੁਕਾਨਦਾਰ",explanationPa:"‘ਦੁਕਾਨਦਾਰ’ = ‘ਦੁਕਾਨ’ + ‘ਦਾਰ’।"},
{id:"DRV-034",affixId:"AFX-009",type:"SUFFIX",affix:"ਦਾਰ",root:"ਈਮਾਨ",derived:"ਈਮਾਨਦਾਰ",explanationPa:"‘ਈਮਾਨਦਾਰ’ = ‘ਈਮਾਨ’ + ‘ਦਾਰ’।"},
{id:"DRV-035",affixId:"AFX-009",type:"SUFFIX",affix:"ਦਾਰ",root:"ਮਾਲ",derived:"ਮਾਲਦਾਰ",explanationPa:"‘ਮਾਲਦਾਰ’ = ‘ਮਾਲ’ + ‘ਦਾਰ’।"},
{id:"DRV-036",affixId:"AFX-009",type:"SUFFIX",affix:"ਦਾਰ",root:"ਹੱਕ",derived:"ਹੱਕਦਾਰ",explanationPa:"‘ਹੱਕਦਾਰ’ = ‘ਹੱਕ’ + ‘ਦਾਰ’।"},
{id:"DRV-037",affixId:"AFX-010",type:"SUFFIX",affix:"ਕਾਰ",root:"ਕਲਾ",derived:"ਕਲਾਕਾਰ",explanationPa:"‘ਕਲਾਕਾਰ’ = ‘ਕਲਾ’ + ‘ਕਾਰ’।"},
{id:"DRV-038",affixId:"AFX-010",type:"SUFFIX",affix:"ਕਾਰ",root:"ਪੱਤਰ",derived:"ਪੱਤਰਕਾਰ",explanationPa:"‘ਪੱਤਰਕਾਰ’ = ‘ਪੱਤਰ’ + ‘ਕਾਰ’।"},
{id:"DRV-039",affixId:"AFX-010",type:"SUFFIX",affix:"ਕਾਰ",root:"ਸ਼ਿਲਪ",derived:"ਸ਼ਿਲਪਕਾਰ",explanationPa:"‘ਸ਼ਿਲਪਕਾਰ’ = ‘ਸ਼ਿਲਪ’ + ‘ਕਾਰ’।"},
{id:"DRV-040",affixId:"AFX-010",type:"SUFFIX",affix:"ਕਾਰ",root:"ਸੰਗੀਤ",derived:"ਸੰਗੀਤਕਾਰ",explanationPa:"‘ਸੰਗੀਤਕਾਰ’ = ‘ਸੰਗੀਤ’ + ‘ਕਾਰ’।"},
{id:"DRV-041",affixId:"AFX-011",type:"SUFFIX",affix:"ਵਾਨ",root:"ਧਨ",derived:"ਧਨਵਾਨ",explanationPa:"‘ਧਨਵਾਨ’ = ‘ਧਨ’ + ‘ਵਾਨ’।"},
{id:"DRV-042",affixId:"AFX-011",type:"SUFFIX",affix:"ਵਾਨ",root:"ਬਲ",derived:"ਬਲਵਾਨ",explanationPa:"‘ਬਲਵਾਨ’ = ‘ਬਲ’ + ‘ਵਾਨ’।"},
{id:"DRV-043",affixId:"AFX-011",type:"SUFFIX",affix:"ਵਾਨ",root:"ਗਿਆਨ",derived:"ਗਿਆਨਵਾਨ",explanationPa:"‘ਗਿਆਨਵਾਨ’ = ‘ਗਿਆਨ’ + ‘ਵਾਨ’।"},
{id:"DRV-044",affixId:"AFX-011",type:"SUFFIX",affix:"ਵਾਨ",root:"ਗੁਣ",derived:"ਗੁਣਵਾਨ",explanationPa:"‘ਗੁਣਵਾਨ’ = ‘ਗੁਣ’ + ‘ਵਾਨ’।"},
{id:"DRV-045",affixId:"AFX-012",type:"SUFFIX",affix:"ਹੀਣ",root:"ਧਨ",derived:"ਧਨਹੀਣ",explanationPa:"‘ਧਨਹੀਣ’ = ‘ਧਨ’ + ‘ਹੀਣ’।"},
{id:"DRV-046",affixId:"AFX-012",type:"SUFFIX",affix:"ਹੀਣ",root:"ਗਿਆਨ",derived:"ਗਿਆਨਹੀਣ",explanationPa:"‘ਗਿਆਨਹੀਣ’ = ‘ਗਿਆਨ’ + ‘ਹੀਣ’।"},
{id:"DRV-047",affixId:"AFX-012",type:"SUFFIX",affix:"ਹੀਣ",root:"ਗੁਣ",derived:"ਗੁਣਹੀਣ",explanationPa:"‘ਗੁਣਹੀਣ’ = ‘ਗੁਣ’ + ‘ਹੀਣ’।"},
{id:"DRV-048",affixId:"AFX-012",type:"SUFFIX",affix:"ਹੀਣ",root:"ਘਰ",derived:"ਘਰਹੀਣ",explanationPa:"‘ਘਰਹੀਣ’ = ‘ਘਰ’ + ‘ਹੀਣ’।"},
] as const;

export const CP008_PREFIX_DERIVATIONS=CP008_DERIVATION_AUTHORITIES.filter(x=>x.type==="PREFIX");
export const CP008_SUFFIX_DERIVATIONS=CP008_DERIVATION_AUTHORITIES.filter(x=>x.type==="SUFFIX");
export const CP008_PREFIX_AFFIXES=CP008_AFFIX_AUTHORITIES.filter(x=>x.type==="PREFIX");
export const CP008_SUFFIX_AFFIXES=CP008_AFFIX_AUTHORITIES.filter(x=>x.type==="SUFFIX");
