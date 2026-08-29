# TRG-002 Hindi/Punjabi Grammar Remediation V3.1

Status: **96 / 96 QLs GRAMMAR-REMEDIATED — 2,304-CASE EXACT-HEAD GRAMMAR GATE GREEN — 192-RECORD REVIEW ARTIFACT GREEN — HUMAN LANGUAGE REVIEW PENDING — MULTILINGUAL FREEZE OFF — ACTIVATION OFF**

This pass fixes grammatical agreement and natural exam-language constructions that survived the V2 exam-realness audit. It does not alter historical frozen English mathematics, answers, options, diagrams, or lifecycle locks.

## Key Hindi fixes

- case/gender agreement in height-difference explanations;
- `निकट और दूर दूरी`-style constructions rewritten around the observation points;
- movement wording normalized to `अंतिम दूरी − प्रारंभिक दूरी` when moving away;
- misleading `बड़ी मीनार से दूरी − छोटी मीनार से दूरी` phrasing replaced by `बड़ी दूरी − छोटी दूरी`;
- eye-level, roof-to-roof and two-sight-line explanations rewritten in natural sentences;
- mast/composite-object QL095–096 explanations rewritten without `दो कुल स्तर` / malformed tan wording;
- remaining learner-facing noun alternatives removed.

## Key Punjabi fixes

- flagpole genitive agreement fixed (`ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੀ...`);
- elevation/depression terminology normalized to `ਉਚਾਣ ਕੋਣ` / `ਨਿਵਾਣ ਕੋਣ`;
- `ਪਤਾ ਉਚਾਈ/ਦੂਰੀ` constructions replaced by natural `ਦਿੱਤੀ ਉਚਾਈ/ਦੂਰੀ`;
- movement and same-side distance sentences repaired;
- roof-to-roof and sight-line explanations rewritten naturally;
- `ਖਿਤਿਜੀ ਲੱਗਦੀ ਭੁਜਾ` simplified to `ਖਿਤਿਜੀ ਭੁਜਾ`;
- QL095–096 mast explanations rewritten with correct plural/case agreement.

## Exact-head evidence

- head: `c7acd790b797eb076830b2b7b203051edb04c3eb`
- workflow: `Verify TRG-002 Grammar Remediation V3`
- run: `32136473458` — **SUCCESS**
- historical English 96 freeze protection: PASS
- V2 semantic / realness regression: PASS
- Grammar V3.1: **2,304 PASS** (96 QLs × 12 seeds × 2 locales)
- review records: **192 PASS**
- artifact: `9324180393`
- digest: `sha256:f68ec1179a44c3ac91c75081d7bd9ac2f80c48e626f5f810e6270663f3dc5df0`

The historical frozen English authority remains unchanged. Hindi/Punjabi remain review candidates only. Human language approval, multilingual freeze, Question Studio discovery, Question Bank storage, Test Builder/mock eligibility, public publication, and student/product delivery remain OFF.
