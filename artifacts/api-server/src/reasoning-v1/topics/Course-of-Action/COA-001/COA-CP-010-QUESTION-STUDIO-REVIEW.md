# COA-001 / COA-CP-010 — Question Studio Review

Status: **APPROVED / FROZEN**

## What CP010 changes

CP010 does not create new semantic content. It connects the approved/frozen COA corpus to Question Studio.

Question Studio package:
- `COA-001`
- Reasoning → Course of Action
- English / Hindi / Punjabi
- Easy / Medium / Hard
- review-only
- Question Bank/test/mock/public gates remain closed

Active selectable semantic QLs:
`COA-QL-001`, `002`, `003`, `004`, `005`, `006`, `008`, `009`.

`COA-QL-007` is rejected as a semantic selector.

Approved presentation profiles:
- `TWO_ACTION_FOUR_WAY`
- `TWO_ACTION_FIVE_CODE`
- `THREE_ACTION_COMBINATION`

---

## Sample 1 — English / QL001 / Four-way

**Statement:**  
A school's online fee system has charged a small group of parents twice after a payment-retry process submitted duplicate transactions.

**Course I:**  
The school should identify the duplicate transactions, arrange reversal of the extra charges and reconcile the affected fee records.

**Course II:**  
The school should temporarily disable the faulty retry path until it is corrected so that additional duplicate charges are not created.

**Options**
1. Only Course of Action I follows
2. Only Course of Action II follows
3. Both Courses of Action I and II follow
4. Neither Course of Action I nor II follows

**Answer:** 3 — Both I and II.

**Question Studio state:** review-only / Question Bank locked.

---

## Sample 2 — Hindi / QL003 / Four-way

**कथन:**  
बैंक की धोखाधड़ी प्रणाली ने ग्राहक के खाते से असामान्य रूप से बड़ी राशि भेजने का संकेत दिया है, लेकिन अभी यह स्पष्ट नहीं है कि ग्राहक ने इसे मंजूर किया था या नहीं।

**कार्रवाई I:**  
बैंक को चिन्हित लेन-देन पर अस्थायी रोक लगानी चाहिए और स्वीकृत संपर्क माध्यम से ग्राहक की मंजूरी की पुष्टि करनी चाहिए।

**कार्रवाई II:**  
बैंक को तुरंत ग्राहक का खाता स्थायी रूप से बंद कर देना चाहिए क्योंकि धोखाधड़ी संकेत साबित करता है कि ग्राहक ने खाते का गलत उपयोग किया है।

**उत्तर:** केवल कार्रवाई I सही है।

---

## Sample 3 — Punjabi / QL008 / Four-way

**ਬਿਆਨ:**  
ਸੇਵਾ ਕੇਂਦਰ ਨੂੰ ਸ਼ਿਕਾਇਤਾਂ ਮਿਲੀਆਂ ਹਨ ਕਿ ਇੱਕ ਮਾਡਲ ਦੇ ਕੁਝ ਚਾਰਜਰ ਵੱਧ ਗਰਮ ਹੋ ਸਕਦੇ ਹਨ। ਸ਼ਿਕਾਇਤਾਂ ਗੰਭੀਰ ਹਨ ਅਤੇ ਜਾਂਚ ਦੀ ਲੋੜ ਹੈ, ਪਰ ਹਾਲੇ ਇਹ ਪਤਾ ਨਹੀਂ ਕਿ ਖਰਾਬੀ ਸਾਰੇ ਚਾਰਜਰਾਂ ਵਿੱਚ ਹੈ ਜਾਂ ਸਿਰਫ਼ ਕਿਸੇ ਇੱਕ ਉਤਪਾਦਨ ਬੈਚ ਵਿੱਚ।

**ਕਾਰਵਾਈ I:**  
ਪਹਿਲਾਂ ਸਾਵਧਾਨੀ ਵਜੋਂ ਉਸ ਮਾਡਲ ਦੇ ਸਾਰੇ ਚਾਰਜਰ ਬਦਲਣ ਦੀ ਮੰਗ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ, ਫਿਰ ਵਾਪਸ ਆਏ ਨਮੂਨਿਆਂ ਦੀ ਜਾਂਚ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।

**ਕਾਰਵਾਈ II:**  
ਅਗਲੀ ਨਿਰਧਾਰਤ ਗੁਣਵੱਤਾ ਜਾਂਚ ਤੱਕ ਸ਼ੱਕੀ ਚਾਰਜਰ ਵੱਖ ਕੀਤੇ ਬਿਨਾਂ ਜਾਂ ਅਸਥਾਈ ਚੇਤਾਵਨੀ ਦਿੱਤੇ ਬਿਨਾਂ ਉਡੀਕ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।

**ਉੱਤਰ:** ਨਾ I, ਨਾ II.

---

## Sample 4 — English / Five-code / Genuine Either

**Statement:**  
An examination venue becomes unavailable on the morning before a scheduled session. A prepared backup venue of sufficient capacity is available, and the examination body also has authority to reschedule the session if the backup cannot be used.

**Course I:**  
The examination body should shift the affected session to the prepared backup venue after notifying candidates and confirming the required arrangements.

**Course II:**  
If the backup venue cannot be activated in time, the examination body should reschedule the affected session and issue a clear revised notice to candidates.

**Options**
1. Only I follows
2. Only II follows
3. Either I or II follows
4. Neither I nor II follows
5. Both I and II follow

**Answer:** 3 — Either I or II.

This item comes from a dedicated mutually-exclusive authority. Ordinary independent-verdict questions cannot produce the Either answer.

---

## Sample 5 — Punjabi / Five-code / Genuine Either

**ਬਿਆਨ:**  
ਨਿਰਧਾਰਤ ਪ੍ਰੀਖਿਆ ਸੈਸ਼ਨ ਤੋਂ ਇੱਕ ਦਿਨ ਪਹਿਲਾਂ ਪ੍ਰੀਖਿਆ ਕੇਂਦਰ ਉਪਲਬਧ ਨਹੀਂ ਰਹਿੰਦਾ। ਕਾਫ਼ੀ ਸਮਰੱਥਾ ਵਾਲਾ ਤਿਆਰ ਬਦਲ ਕੇਂਦਰ ਮੌਜੂਦ ਹੈ ਅਤੇ ਲੋੜ ਪੈਣ ਤੇ ਪ੍ਰੀਖਿਆ ਸੰਸਥਾ ਸੈਸ਼ਨ ਦੀ ਤਾਰੀਖ ਵੀ ਬਦਲ ਸਕਦੀ ਹੈ।

**ਕਾਰਵਾਈ I:**  
ਲੋੜੀਂਦੀ ਵਿਵਸਥਾ ਦੀ ਪੁਸ਼ਟੀ ਕਰਕੇ ਅਤੇ ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਜਾਣਕਾਰੀ ਦੇ ਕੇ ਪ੍ਰਭਾਵਿਤ ਸੈਸ਼ਨ ਤਿਆਰ ਬਦਲ ਕੇਂਦਰ ਵਿੱਚ ਕਰਵਾਇਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।

**ਕਾਰਵਾਈ II:**  
ਜੇ ਬਦਲ ਕੇਂਦਰ ਸਮੇਂ ਤੇ ਚਾਲੂ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਤਾਂ ਪ੍ਰਭਾਵਿਤ ਸੈਸ਼ਨ ਦੀ ਨਵੀਂ ਤਾਰੀਖ ਤੈਅ ਕਰਕੇ ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਸਪਸ਼ਟ ਸੋਧੀ ਹੋਈ ਜਾਣਕਾਰੀ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ।

**ਉੱਤਰ:** ਕਾਰਵਾਈ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸਹੀ ਹੈ।

---

## Sample 6 — Hindi / Three-action combination

**कथन:**  
अभ्यर्थियों की शिकायत है कि परीक्षा के कुछ प्रश्न घोषित पाठ्यक्रम से बाहर हो सकते हैं। प्रश्नपत्र, पाठ्यक्रम और विषय विशेषज्ञ उपलब्ध हैं, लेकिन शिकायत की अभी पुष्टि नहीं हुई है।

**I.** विषय विशेषज्ञों की समिति से विवादित प्रश्नों का घोषित पाठ्यक्रम से मिलान कराकर तय समय में रिपोर्ट लेनी चाहिए।  
**II.** विशेषज्ञ समिति से जाँच कराने से पहले ही परीक्षा तुरंत रद्द कर देनी चाहिए।  
**III.** यदि समिति पुष्टि करे कि गंभीर पाठ्यक्रम गलती से निष्पक्षता प्रभावित हुई है, तो तय सुधार लागू करना चाहिए और जरूरत हो तो दोबारा परीक्षा करानी चाहिए।

**उत्तर:** केवल I और III सही हैं।

---

## Review checklist

Please verify:

- COA appears as **Reasoning → Course of Action**.
- EN/HI/PA wording is the approved frozen wording.
- QL selection never exposes QL007.
- Easy/Medium/Hard filtering feels correct.
- Four-way is the default profile.
- Five-code can generate genuine Either items.
- Three-action questions preserve the intended combination.
- Review run persistence is acceptable.
- Question Bank, tests, mocks and learner release remain visibly locked.

Approved by the product owner on **2026-09-18**. CP010 Question Studio integration is frozen. This approval permits CP011 final editorial/diversity audit and does not authorize internal eligibility or public release.
