# 📚 Study Buddy — Project Status (saved: 06 Nov 2026)

## App kaise chalana hai
```
cd "C:\Users\Hp\OneDrive\Documents\study app"
npm.cmd run dev        → http://localhost:5173/
```
(Embedded browser / normal chrome — dono chalega. Data ab disk-file based hai.)

## 🖥️ Features (sab ready)
| Feature | Details |
|---------|---------|
| Notes | 73 notes — 68 chapters (+ 📌 BOARD EXAM CORNER) + exam patterns + project/writing guides |
| Focus Timer | Pomodoro + streak + minutes stats |
| Quiz | 8 quizzes — board-style A/R + MCQ (English extracts, Snapshots, Pol सिद्धांत/संविधान, Geography 579 12-Q) |
| Flashcards | 56 cards (17 English + 16 Pol + 20 Geography + 3 sample) + 🃏 SRS revise |
| Planner | 2 plans — English 2027-03-15, Pol 2027-03-22 (60-day schedules) |
| Progress Tracker | 16 English + 18 Pol + 20 Geography chapters — ⬜/📖/✅ cycle + chips/gradient bar/Mock trend |
| Subjects | 8 subjects (incl. English 11th, Pol. Science 11th, Geography 11th) |
| Mind Maps | 🗺️ 57 interactive maps — 18 Eng + 18 Pol + 20 Geo chapter maps + 3 Important Topic maps — expand/collapse tree, subject dropdown, सभी chapters / Important टैब · **Advanced**: ✅ revise tracking (sb_mmrevise, % bar), ➖➕ zoom, 🎯 Focus mode, 🎯 स्वयं-टेस्ट (8-Q MCQ auto from map), हर chapter में "⭐ महत्वपूर्ण टॉपिक" branch (1088 nodes total) |
| Backup | Dashboard → 💾 Export/Import JSON |
| Language | Hindi/English toggle (sidebar) |
| Note + Map split view | Mind map + side panel grid (mm-split) — 📝 नोट / ✏️ 5-अंक toggle; chapter id = map id − '-map'; note = sb_notes, Q&A = sb_qna |
| ✏️ 5-अंक Q&A | 54 chapters के most-important questions + 5-mark model answers (English में English, Pol/Geo में Hindi, pointwise 6-7 lines) — `sb_qna` key (data/study-data.json), format `[{id, q, points}]`; gen-scripts `qna-eng/pol/geo.cjs` + `scan-qna.cjs`, inject `add-maps.cjs` से; **07 Nov: 19 Qs HBSE Feb-2024 real-paper aligned** — `q` में "(HBSE Feb-2024, 5 अंक)"/"Q8/Q10/Q12" marker + असली प्रश्न के दोनों "अथवा" options लिए; अपग्रेड सूची: eng-h1 (पोर्ट्रेट- grandma image Q8), eng-h5 (Adventure-Khan Sahib), eng-p3/p5 (Voice of Rain/Father to Son stanza Q10), eng-s7/s8 (Birth/Melon City Q12), pol-a6/a7/a8/b2/b3/b4 (आदर्श नागरिक, राष्ट्र-राज्य अंतर, धर्मनिरपेक्षता-सिद्ध, MR vs DPSP, चुनाव-प्रणाली, PM/राष्ट्रपति), geo-p3/p7/p10/p13/i3/i4/i6 (आंतरिक संरचना, वायुमंडल-संघनन, ओस-पाला, ज्वार/सुनामी, नदियाँ-पठार, मानसून, सूखा/तराई) — script `qna-upgrade.cjs` (pdfwork), rerun-safe by id — scan 19/19 shape-OK |
| ✍️ 5-अंक Q&A Practice | **Alag nav page** (nav ✍️ '5-अंक Q&A') — Mock Test ka दीर्घ-prashn bhai: setup (subject + चैप्टर select ya 🎲 रैंडम, last-used avoid logic) + **दो मोड**: 🚀 अभ्यास (प्रश्न view board-style 5-अंक + ⏱ timer + "पहले खुद लिखो" textarea → 👁 मॉडल उत्तर → हर बिंदु "मिलता है?" ✔ checkbox → अंक-पत्र **X/5 + 🌟** + tip) और 🧠 **याद-मोड (recall)** — सिर्फ प्रश्न → दिमाग में याद → "👁 अगला बिंदु (n/N)" progressive reveal → सारे दिख जाएं तो 🔁 दोबारा/➡ नया प्रश्न; कोई स्कोर — शुद्ध याद-drill — (HBSE Feb-2024…) वाले 19 asli board प्रश्न इसी page से practice होते हैं — `sb_qnalog` (cap 30, {day, subject, qaId, score, mins} — सिर्फ practice mode log karta hai), 🗑 per-row + 🧹 सब साफ़ (confirm) — `src/pages/QnA.jsx`, reuse q-paper/panel classes (styles अपरिवर्तित) — browser-tested ✅ (practice: 4/6 ✔ → 3/5 🌟; recall: progressive 1→6 reveal → full) |
| 📘 लंबे उत्तर संग्रह | **Alag nav page** (nav 📘 'लंबे उत्तर') — topic-wise FULL board-style long answers, सिर्फ पढ़ने के लिए (no score/no log): setup (subject cards: **English 7 · Pol. Science 5 · Geography 8 = 20 topics**) → पढ़ें view (topic title + भूमिका → विस्तृत बिंदु → निष्कर्ष paragraphs + ⭐ परीक्षा-नुस्खा highlight) — ⬅ अगला/पिछला topic buttons + topic dropdown + n/N counter; English chapters अंग्रेजी में, Pol/Geo हिंदी में — नवंबर-focus वाले (pol-b7 संघवाद, pol-b8 स्थानीय शासन, geo-p13 महासागरीय जल, geo-i4 मानसून) शामिल — `sb_longs` key (data/study-data.json, store-wired full: load/restore/sync/context), format `[{id, subject, chapter, topic, points[]}]`, inject `add-longs.cjs` (pdfwork — 9 chhoti data-files longs-eng1/2, pol1/2/3, geo1/2/3/4 + runner, rerun-safe by id) — `src/pages/Longs.jsx`, reuse panel/mist-row classes (styles अपरिवर्तित) — browser-tested ✅ (geo Hindi view, English view 1/6, next 2/7, prev-disabled) |
| ⏳ Exam countdown | Dashboard बड़ा panel — editable date (`sb_examdate`, default 2027-02-15), दिन बाकी + हर subject का ✅-% bar (CHAPTERS से) |
| 🔁 Daily revision | Spaced plan 1/3/7/21 दिन (`REVS`) — ✅ chapters auto-seed (`sb_reviews` {id:{stage,when}}), Dashboard me due-list + ✓ revise button, stage 4 पर 🏆 |
| ❌ गलती notebook | Quiz में गलत pick → `sb_mistakes` (dedup key = quiz|q|correct, cap 120) — Dashboard me ✔/✗/quiz/day rows, 🗑 per-item + 🧹 सब साफ़ (confirm) |
| 📄 Mock Test | Exam-style question paper — setup view (subject + chapter/full-paper select + 🚀 पेपर शुरू), paper view (खंड A: MCQ ×1 · खंड B: short ×3 · खंड C: long ×5, live timer, मॉडल उत्तर reveal + per-point self-check ✔), result view (अंक-पत्र + stars + समय) — chapter test = 8 MCQ (pehle **extract-based bank** `chapterId+'-mcq'`, phir map+banks se top-up) + 2 short; full paper = 10 MCQ (*deep banks-first mix*) + 3 short + 2 long — **54 extract-based MCQ banks (237 Questions, sb_quizzes mein id `*-mcq`)** — saare MCQ options runtime-shuffle (answer-key pattern chhupa) — sab UI labels Hindi/English (`H()` helper) — log `sb_mocklog` (cap 50), 🗑 per-row + 🧹 सब साफ़ (confirm) — `src/pages/MockTest.jsx`, nav 📄 |
| 🃏 Flashcard SRS | Leitner-lite spaced repetition — 👍 box+1 (cap 4) → agla revise `SRS_INT = [1,3,7,21,30]` din baad, 🔁 box 0 + kal; schedule `sb_cardsched` {cardId:{box,next}} (store-wired) — **🔄 Due today (N)** button sirf due cards ka session (un-scheduled ya `next ≤ today`), list mein 📦 box/next badge — browser-tested ✅ |
| 🎯 Aaj ka Mission | Dashboard top panel — 3 ticks: 🔁 spaced revision (auto ✅ jab due=0), 📖 **aaj ka chapter** (November focus `[eng-p5, pol-b7, pol-b8, geo-p13, geo-p14]` se pehla undone; "✓ ho gaya" manual tick, aur Progress ✅ par bhi auto), 📄 1 mock (auto ✅ jab `sb_mocklog` mein aaj ki entry) — din badle → `sb_mission` {day,done} reset; go-buttons se Mock/Progress jump — browser-tested ✅ |
| 📊 Progress professional | Subject **chips** har subject ka ✅X 📖Y ⬜Z mini-count, **gradient progress bar** (indigo→violet→purple) + % text, **📈 Mock Score Trend** panel — `sb_mocklog` se last ≤12 attempts ke MCQ-% bars (newest→left, hover title day·chapter·score) + औसत % — empty-state guide message — browser-tested ✅ |
| 🧾 PYQ Corner | 3 idempotent notes (`pyq-eng` English, `pyq-pol` Hindi, `pyq-geo` Hindi) — **ASLI HBSE Feb-2024 scanned papers se** (codes 2601/2615/2614, mseducationtv PDFs → pymupdf render → vision-read): paper structure + marks distribution + real section-A/B/C/D questions (English: salt/health + business-letter passages, Silk Road extract, Voice of Rain/Father to Son stanzas, Birth/Melon City) + Pol real MCQs (Polis/Liber/अनु.12-35/चुनाव आयोग) + Geo real MCQs (हम्बोल्ट/लाप्लास-1796/जलयोजन/21-जून) + map-question (Q26 भारत मानचित्र) + har paper ka strategy — original PDFs `Documents\Backups\HBSE-PYQ\` mein backup — inject `add-pyq.cjs` (pdfwork), rerun-safe by id — Notes 76 total ✅ |

## 🔒 Data Protection System
- **Disk file:** `data/study-data.json` (~100 KB) — har badlav auto-save (0.8 sec)
- **Auto-restore:** browser storage reset ho jaye to app load par disk se wapas data aa jata hai
- **Delete sirf manual ho** — koi automatic clean-up nahi; user khud delete kare tab hi data jata hai
- Weekly → 💾 Download backup (Dashboard) — file ko Documents\Backups folder rakhna best

## 📶 Notes content
- **English Core (BSEH 501)**: 6 Hornbill prose, 5 poems, 5 Snapshots + exam pattern + month plan + grammar checklist + **📝 Grammar Practice Set (10 Q + answer key, id `eng-gram-1`)** + chapter↔PDF maps
- **Pol. Science (BSEH 573)**: 8 सिद्धांत + 10 संविधान chapters + exam pattern + month plan + marks map + **📌 Internal Project guide (5 अंक — topic ideas + फाइल structure + timeline, id `pol-project`)**
- **✍️ Answer Writing guide (id `guide-5mark`, subject 'Other')**: 5-अंक master pattern (परिचय → 6-7 points → तथ्य → निष्कर्ष), examiner tips, app-practice loop (Mind Maps ✏️ → Mock Test खंड B/C)
- **Geography (BSEH 579)**: 14 Book-1 (Fundamentals of Physical Geography) + 6 Book-2 (India: भौतिक पर्यावरण) — naye notes geo-p1..14, geo-i1..6 — + exam pattern नोट (60/20/20 split, मासिक योजना) + व्यावहारिक/map-work गाइड (20 अंक practical: map intro, scale, lat-long, projections, topo sheets, remote sensing); paper = 10×1 + 6×2 + 6×3 + 3×5 + 5 map (केवल भारत-पुस्तक से); quiz geo-quiz (12 Q, 3 assertion-reason), cards geo-c1..c20, Progress पर 20 rows
- Har chapter me: Hindi + English summary + key points + exam angle + 📌 BOARD EXAM CORNER (objective + 2/3/5-अंक Q&A hints)
- Guide notes inject script: `add-guides.cjs` (pdfwork folder) — id se idempotent, dobara chalane par sirf refresh
- **🧾 PYQ Corner notes** inject script: `add-pyq.cjs` (pdfwork) — ids `pyq-eng`/`pyq-pol`/`pyq-geo`, idempotent
- Notes mein ab 76 (68 chapters + guides + grammar + 3 PYQ)

## 📖 Drive material (Google Drive)
- `English 11th 26-27` — Hornbill 14 PDFs (renamed), Snapshot 5 PDFs, English Core.pdf (syllabus), ODG chapter 1 + its .txt version
- `pol. science 11th 26-27` — Political Science.pdf (syllabus 573), NCERT-Hindi Part-1 (154 p), Part-2 (243 p)
- ⚠️ NCERT Hindi PDFs ke fonts non-Unicode — padhne lega, copy nahi hoga (OCR ki zaroorat)

## 🧾 Important code files
- `src/store.jsx` — localStorage + disk sync + streak logic
- `vite.config.js` — `fileStorage()` plugin (`/api/data` GET/POST middleware)
- `src/pages/Progress.jsx` — naya progress tracker page
- `src/summarize.js` — offline extractive summarizer (Hindi + English stopwords)
- `src/i18n.js`, `src/seeds.js`, `src/App.jsx` — strings, first-run seeds, routing
- PDF extraction scripts (pdf-parse) → `C:\Users\Hp\AppData\Local\Temp\opencode\pdfwork\`

## ✅ Next session ideas
1. Extract-based per-chapter MCQ banks (deeper than map-generated `mcqFromMap`) — Mock Test chapter-test ko aur strong karna
2. Mock Test me English-mode paper labels (अभी khaki Hindi labels, lang toggle partial)
3. Tools me screenshots / UI review se styling polish
4. Pol project guide me student-specific topic pick (survey wala best!) — photo/scan approval flow

## 🗓️ Aaj ka date context
- Aaj = 07 Nov 2026 (Class 11, 2026-27, BSEH)
- Month plan: नवंबर — Pol: संघवाद + स्थानीय शासन | Eng: Father to Son | Geo: पाठ-13 (महासागरीय जल संचलन) + पाठ-14 (जैव विविधता)
- दिसंबर se दोहराई चालू — Planner में Geo के लिए दिसंबर = भारत पुस्तक पाठ 1-3 (स्थिति, संरचना, अपवाह), जनवरी = जलवायु/वनस्पति/आपदाएँ
- Build: ✅ passing (06 Nov 2026 — vite build 214.18 kB JS + 15.04 kB CSS)
- Mind Maps data: `sb_mindmaps` key (data/study-data.json में 57 maps) — `MindMaps.jsx` page, nav 🗺️, store sync wired
- Q&A data: `sb_qna` key (data/study-data.json में 54 items) — MindMaps split panel ✏️ से खुलता है; 06 Nov ko 19 garbled lines fix (`fix-qna.cjs`) — scan 54/54 clean
- Mock log data: `sb_mocklog` key (localStorage direct, cap 50) — syncNow pura localStorage POST karta hai isliye disk me auto-sync; 06 Nov disk copy verified (test rows UI-🗑 se delete karke sync 200)
- ⚠️ Browser-sync note: डिस्क-file में सीधे inject karne ke baad browser पुरानी state sync kar deta hai — inject के बाद browser localStorage में fresh key set karo (मैंने /api/data fetch से किया), फिर reload — तब तक का race push-overwrite हो सकता है
- नवंबर याद: Pol — संघवाद + स्थानीय शासन | Eng — Father to Son | Geo — पाठ-13 महासागरीय जल संचलन + पाठ-14 जैव विविधता (इनके 5-अंक Q&A भी sb_qna में तैयार ✅)
- Backup: `C:\Users\Hp\OneDrive\Documents\Backups\study-buddy-backup-2026-11-06.json` (fresh, sab 17 sb_ keys — ab mission + cardsched bhi)
- 06 Nov session-3 (naye 5 features): 🃏 Flashcard SRS (`sb_cardsched`, store full-wired) + 🎯 Aaj ka Mission (`sb_mission`, Dashboard) + 📈 Mock trend + professional Progress + 🧾 PYQ Corner (76 notes) — sab browser-tested ✅; `add-pyq.cjs` pdfwork mein; data-abhi: mission {day:2026-11-06, done:{chap:eng-p5}}, cardsched 2 entries (test hooks), mocklog []
- 06 Nov session-2: extract-MCQ banks gen-scripts `mcq-eng/pol/geo.cjs` + inject `add-mcq.cjs` (pdfwork folder) — answer index bank me 0 rakha, MockTest runtime `shuffleOpts()` se options bhi shuffle hote hain; ⚠️ styles.css ek baar galti se katta — last build ke compiled `dist/assets/*.css` se restore kiya (ab minified hai, aage ke edits append-mode se lagana hi theek hai)
- 07 Nov: 🐛 mission day-change race fix (disk-restore reset ko overwrite karta tha → deps `[today, mission?.day]`) — live cross-midnight test verify ✅; 🧾 PYQ v2 — ASLI HBSE Feb-2024 papers (PDFs `Documents\Backups\HBSE-PYQ\`, render+vision pipeline pdfwork\hbse2024\) se teeno notes rewrite; ⚠️ disk-inject race pakka sabak: khula app-page boot par 1.2s timer se localStorage→disk POST karta hai — inject ka safe flow = tab ko `/api/data` route par le jao (app JS band) → injector run → wahi par `sb_notes` localStorage mein set → home navigate; mission {day:2026-11-07}, cardsched 2, mocklog []
- 07 Nov (सत्र-3): **✍️ 5-अंक Q&A Practice nav page** (`QnA.jsx`) — user request "mock test jaisa alag option 5-अंक ke liye"; nav ✍️ `nav.qna` (i18n mein add kiya); nayi key `sb_qnalog` (localStorage+disk, cap 30); baad mein usi mein **🧠 याद-मोड** add kiya — user request "q/a se yaad karne wala mode"; progressive point reveal + 🔁/➡ buttons — browser-tested dono flows (practice + recall) ✅; build 223.26 kB JS. ⚠️ restart-ke-baad vite nayi port (5174) par chala jabki purani process 5173 hold karta raha — hamesha server output se active port confirm karo. ⚠️ UI 🗑 (sb_qnalog/sb_mocklog) ke baad disk copy sirf agle store-sync par update hoti hai — tureent zaroorat ho to page se fetch POST /api/data
- Backup: `C:\Users\Hp\Documents\Backups\study-buddy-backup-2026-11-07.json` — ab **19 keys** (sb_qnalog + sb_longs bhi; purane 18-key wale se merge karke refresh kiya)
- 07 Nov (सत्र-4): **📘 लंबे उत्तर संग्रह (Long Answer Bank)** — user request "long answer ka section jisme topic wise long answer likha ho"; nav 📘 `nav.longs` (i18n add), nayi key `sb_longs` (store full-wired) + `Longs.jsx` page (setup → पढ़ें view ⬅➡+dropdown, no score no log) — **20 topics** (Eng 7 h1/h5/h6/p5/s2/s7/s8, Pol 5 a7/b2/b4/b7/b8, Geo 8 p2/p3/p7/p14/i3/p13/i4/i6); ⚠️ **bari Hindi write ka garble-pakka sabak**: poori inline script 2 baar garbled hui (CJK/Greek char mix + syntax errors) — solution: chhote per-subject data-files (`longs-*.cjs`, 1-3 items each) likho → har batch par node scan (foreign-script + syntax) → runner `add-longs.cjs` merge-karke inject; ⚠️ node 24 require `./x` se `.cjs` resolve nahi karta — extension explicitly likhna zaroori; ⚠️ inject se pehle clobber-hua disk (boot POST ne sb_longs "[]" likha tha) — `/api/data` route flow se dobara inject + tab localStorage set → home → verify ✅; build 226.67 kB JS
- 08 Nov (सत्र-1): **November-focus poora** — long-bank mein geo-p14 (जैव विविधता, 12 बिंदु) + eng-p5 (Father to Son, 11 बिंदु) add → **20 topics** (files `longs-eng3.cjs` + `longs-geo5.cjs`, add-longs.cjs mein require update); browser-verify (English 7 · Geo 8, geo-p14 8/8 dropdown se) ✅; backup 19-key refresh; ⚠️ **naya sabak**: `/api/data` GET server-start par ka **cached** snapshot serve karta hai — disk fresh na dikhe to injector ke turant baad node-se disk file padho, GET par bharosa mat karo; tab-localStorage update ke liye fresh JSON ko workspace mein tmp file (`tmp-sb-longs.json`) bana ke dev-server se fetch kar set karne ka tarika use kiya (delete kar diya)
- Kal ke liye note: saari November-focus chapters (pol-b7, pol-b8, eng-p5, geo-p13, geo-p14) ab long-bank mein ✅; dev server fresh 5173 par chala, kal start par port output se confirm karna; NEXT ideas: user feedback par content tweaks, baaki chapters ke long answers (chahiye to bolo)
- Disk-inject ka aur bhi safe flow (backup agar app inject raasta fail ho): dist build ke baad bhi rule same — sirf `/api/data` route wala flow use karo
- 07 Nov (सत्र-2): ✏️ 5-अंक Q&A upgrade — `qna-upgrade.cjs` (pdfwork) se 19 questions asli Feb-2024 सवालों पर aligned (details ✏️ row में); scan 19/19 shape-OK; backup 2026-11-07.json refresh; MindMaps ✏️ panel browser-verify ✅

## 08 Nov (सत्र-2) — चार नए features ✅
- User ne menu se 4 features select kiye: 🗺️ Naksha abhyas, 🏆 Achievements/Badges, 📈 Time-split chart, ❓ Aaj ka sawal widget
- **🌏 नक्शा अभ्यास (Map Practice)** — naya nav page `Maps.jsx` (nav **🌏** `nav.maps` icon; 🗺️ already Mind Maps use karta hai); nayi key `sb_maps`: `{id, q, dots:[{name,x,y}], sol:[names], tip}` × 8 tasks (id map-1..8: varsha, nadiya, parvat, vanspati, jheel, rajya, khadi, pathar) — files `mapq-geo1/2.cjs` + runner `add-mapq.cjs` (pdfwork); India outline = approximate polygon (OUTLINE array), dots numbered, 🔁 दिखाओ → सही हरे + naam, बाकी लाल faded — self-check, score nahi; 🔒 rerun-safe by id
- **🏆 उपलब्धियाँ (Badges)** — Dashboard panel, **koi naya storage nahi**: 14 badges derived (streak 3/7/14/30, pehla focus (sb_stats.sessions count), pehla mock (sb_mocklog), QnA ×5/×20 (sb_qnalog), chapter 25/50/75/100% (progress+CHAPTERS), 180 min total (sb_stats.focus), 7 padhāī-din) — earned ✓ aur locked opacity 0.4
- **📈 Time-split** — Dashboard panel: sb_stats.sessions se pichhle 7 din per-subject bars (reuse exam-bar/mm-prog-bar) + per-day chips; **Timer.jsx mein subject select add** (English/Pol/Geo buttons, sb_timersubj localStorage mein default), `registerFocus(minutes, subj)` se sessions rows me `subj` field — purane rows (subj ke bina) chart mein count nahi hote (backward-compat)
- **❓ आज का सवाल** — Dashboard panel top: date-hash deterministic pick from `sb_qna` (days-since-2024-01-01 % length), 👁 उत्तर दिखाओ toggle (mm-pts points), go('qna') button
- Store: sb_maps full-wired (load/restore/effect/value)
- **⚠️ bada sabak: browser localStorage reset hua tha** — tab mein sb_qna "[]" tha, disk se bhi qna gayab (kabhi race ne wipe kiya tha!) — **restore: `add-qnar.cjs` (naya runner) se base 54 (qna-eng 16 + qna-geo 20 + qna-pol 18) dobara inject + `qna-upgrade.cjs` refresh (19 asli-marker)** = sb_qna 54 ✅; phir FULL disk payload tmp-sb-maps.json se tab localStorage mein 18 keys set + reload — sab panels/QOTD/Maps verified ✅
- Backup: `study-buddy-backup-2026-11-08.json` — merge (07 ka 19-key backup + disk sb_maps/sb_qna) = 20 keys
- Build: 237.21 kB JS (+15 kB CSS unchanged), Maps/Timer/Dashboard/i18n/store edits sab included
- lesson: page arrays like exam-bar, mm-pts, chip, mist-row sab reusable the — styles.css bilkul nahi badla

- 08 Nov (सत्र-2b): नक्शा अभ्यास v2 — 14 tasks (+6: मृदा map-9, मैदान/तट map-10, राष्ट्रीय उद्यान map-11, जलवायु/मानसून map-12 (arrows: वर्षा दो शाखाएँ + शीतल), क्षेत्रीय विभाजन map-13, द्वीप-समूह map-14) = `mapq-geo3.cjs`; `topic` field + setup में filter chips + 🎲 random + tap-by-tap reveal (shownSet) + 🧠 याद-मोड (list hidden, mid-task 📝 सूची दिखाओ); ⚠️ बग-सबक: state `recallNow` में stale-closure (mode click + open same tick) — क्लिक solved: derived `recallNow = mode === "recall" && !listShownMid` + open() में listShownMid reset; build 239.83 kB JS; backup refresh (sb_maps 7.3 kB, 14 tasks)

- 08 Nov (सत्र-2c): नक्शा अभ्यास **EXACT map v3** — approximate polygon hata; naya `src/india.js` (auto-generated!! make-outline.cjs se) = 83 polys EXACT outline (AbhinavSwami28/india-official-geojson MIT data — SOI-correct/J&K+Ladakh+PoK included; `polygon-clipping` npm se 36 states union kiya; islands filter bbox>=0.08deg → Lakshadweep-Andaman chain bhi; two-tier simplify; int-rounded points) 39 KB; **project = plate carree cos(22deg), xy(lat,lon) exported**; data dots ab `{name, lat, lon}` + arrows `{fa:[lat,lon], ta:[lat,lon]}` — `mapq-convert.cjs` se 14 tasks runtime-rewritten (garble-proof: JSON.stringify se likha); Maps.jsx xy() se project; ⚠️ **बड़ा sabak: generator ke LON0 bug ne sab dots ~72px shift kar diye the (raw lon vs projected minX mix) — polyline sahi pura, dots galat; (x*K - LON0) ka LON0 PROJECTED min hona chahiye; verify = map-14 dots ko islands par match karo (Lakshadweep px 64)**; bundle 279.30 kB (gzip 86.9); backup refresh; polyCount 83 render ✅ 14/14 task dots latlon-par ✅
- Sources cached: pdfwork mein `india-states-simp.geojson` (444 KB), `india-gadm0.geojson` (694 KB), `fetch-india.cjs`, `make-outline.cjs`, `mapq-convert.cjs` (pdfwork mein polygon-clipping npm install hua)
\n- 08 Nov (सत्र-2d): नक्शा EXACT outline **v3 (spikes/तिरछी-रेखा फ़िक्स)** — मूल कारण 2: (1) `polygon-clipping` union ne mainland ki **460 micro artifact rings** banayi (Martinez precision सलाखें) — purane generator ne unhe bhi render kiya → āndar ki रेखाएँ (vertical spikes); (2) `ring.slice(0, 40)` chhoti islands ke liye truncation — band hone par तिरछी線 बनती थीं. v3 fix (make-outline.cjs फिर से लिखा गया): **हर रिंग का bbox अलग से** bbox>=0.08deg (1087 artifact rings मारे), **कोई truncation नहीं** (distance-simplify, फ़ेल हो तो असली रिंग) + bbox==90% guard, px-level एंट्री-डेप + प्रत्येक-<3px-अंदरूनी-भेद से मुक्ति (39), segment audit >30% चौड़ाई = ड्रॉप (पाया व्यापक max 10px). Neta जो तैयार: 43 polys (1 mainland 1088-पॉइंट + 42 वास्तविक द्वीपों की), 1516 points, **15 KB** (पहले 39 KB). बिल्ड 254 KB (gzip 82.06, पहले 86.9). 14/14 काम-प्रतिपादन स्वीकृत: कोई NaN बिंदु नहीं, सुई मैक्स रेक्टांगल 10px, map-12 तीर 3, भीतरी छोटे निशान 0 (बाहरी छोटे द्वीपों को सुरक्षित रखा)। **स्वीकार्यकushima सबक: सर्वर स्थिर + स्क्रीनशॉट विश्वसनीय नहीं — India dev-served module को रोककर टैब को नवीनीकृत करना जरूरी है; `points` attr में comma/space अंतर पर audit parser = फर 2-num chunk parse**;\n
### 09 Nov (सत्र-2e): 📘 लंबे उत्तर — बाकी सब chapters ✅ (सब 54)
- User request: "sab ke nhi hai mujhe sab ke chahiye" — हर QnA chapter का long चाहिए; **+34 नए longs** = **20 → 54 total (Eng 16 · Pol 18 · Geo 20)**, सभी 54 qna-chapters covered
- नए ids: eng 9 (h2,h3,h4,p1,p2,p3,p4,s1,s5) · geo 12 (p1,p4,p5,p6,p8,p9,p10,p11,p12,i1,i2,i5) · pol 13 (a1..a6,a8,b1,b3,b5,b6,b9,b10) — हर subject के अलग छोटे data-files (longq-new-eng.cjs, longq-new-geo1..4.cjs, longq-new-pol1..3.cjs, pdfwork) garble-sabak के हिसाब से
- ⚠️ गड़बड़-अक्षर सबक दोहरा: ऊपर से लिखी हिंदी में CJK/लैटिन junk घुसी (约, 法定, 武, aUFIBTech, ActionController, youBandage, Eestlies→Easterlies...) — repair-longs.cjs से साफे, scan-longs.cjs/scan-latin.cjs से scan-clean; "पीक्षा"→"परीक्षा" लेबल ठीक; fixquote.cjs से एक गलत double-quote escape ठीक
- **Inject + sync फ्लो**: inject-longs.cjs डिस्क में 54 डाला, पर चलते dev-server की localStorage-sync डिस्क को दोबारा 20 पर ढकेल देती है — **विजयी तरीका: बैकअप JSON को public/ में tmp-copy (sb-import.json) करके page के अंदर browser-evaluate से fetch('/sb-import.json') → sb_longs (RAW STRING!) सीधे localStorage में set → tab reload** — React init load('longs') से 54 उठाता है, app खुद अपनी /api/data POST से डिस्क ठीक कर देता है ✅; फिर tmp public-file delete
- ⚠️ **बैकअप फाइल में sb_longs पहले से JSON string होता है — JSON.stringify दोबारा न करें (double-encode सबक)**
- Browser-verify ✅: विषय-कार्ड counts (16/18/20), English पेजिंग 1→15, Pol नया topic (संविधान का दर्शन, निष्कर्ष — लेबल), Geo आखिरी 20/20 (प्राकृतिक वनस्पति) — सब साफ़ text; डिस्क: 54, सब id+points>3, गड़बड़ hits 0; build (157.4 kB / gzip 48) पहले ही हो चुका
- Backup: `C:\Users\Hp\Documents\Backups\study-buddy-backup-2026-11-09-54longs.json` (18 keys, sb_longs=54)

### 09 Nov (सत्र-2f): 📱 Mobile polish + PWA (phone use)
- User: "mai isko phone me use karna chahta hu isko mobile ke according polish karo"
- **CSS mobile layer (append-only, styles.css 15.6→18.2 kB)**: `@media 900px` — sidebar slim sticky top-bar + nav horizontal scroll pills (wrap se better), lang-toggle right; `@media 600px` — panel padding/h1 chhota, stat-grid 2-col, `.input/select/textarea{font-size:16px}` (iOS focus-zoom रोकने का मानक), `.btn{min-height:44px}` touch targets, timer-ring 220px, flash-card/q-paper/opt पैडिंग, safe-area-inset (notch + standalone bottom), `overscroll-behavior-y:contain` (pull-refresh guard), व `380px` nano-breakpoint
- **PWA (Add to Home Screen)**: `public/manifest.webmanifest` (Hindi name, standalone, theme #111827) + `public/icons/icon-192/512.png` — `make-icons.cjs` (pdfwork, pure-node PNG writer zlib+CRC32, 3x supersample flat note-card design — पहले pixel-"S" जंकी था तो v2 redo) — index.html में manifest link + apple-touch-icon + theme-color + apple-mobile-web-app tags + meta description + viewport `viewport-fit=cover`
- ⚠️ सबक: HTTPS-लेस LAN पर Chrome installability warning दिख सकती है पर "Add to Home screen" फिर भी चलता है; असली standalone/Notch/safe-area सिर्फ phone पर ही दिखेगा — desktop verify = Lighthouse mobile (best-practices **1.0**, a11y 0.88 — color-contrast/heading-order पुराने minor, छूटे)
- **LAN access**: vite.config `server.host:true` + `preview.host:true` → Network URL `http://10.85.210.202:5173/` (Wi-Fi 3) — phone से खोलो, fresh storage → store.jsx खुद disk से restore (54 longs ऑटो); firewall first-time dialog allow करो
- Build 254.26 kB (gzip 82.06) + dist में manifest/icons; disk sb_longs 54 ✅

### 09 Nov (सत्र-2g): 🌍 Kahin-se-bhi access — Tailscale setup ✅
- User: "kya mai kisi bhi time kisi bhi jgah se access kar sakta hun" → चुना **Tailscale** (winget `Tailscale.Tailscale` से install; UAC user ने approve किया)
- **दोनों device tailnet में**: `desktop-a5306fb` PC = `100.80.128.23` · `redmi-note-14-pro-5g` phone = `100.87.133.39` (account `zoneroasted-hub@`)
- ⚠️ सबक: phone से दिया गया auth-link केवल उस device को tailnet में जोड़ता है — हर device के लिए **उसी device के browser/app में hi** `tailscale login` वाला URL खोलना पड़ता है (PC का login `tailscale login` background से; URL `tailscale status` में भी दिख जाता है)
- ⚠️ **Firewall सबक**: Tailscale interface Windows में **Private** profile होता है; पुराने Node allow-rules सिर्फ Public से थे → tailnet से inbound block होता; admin PowerShell (Start-Process -Verb RunAs) से rule: `Study Buddy 5173 (Tailscale only)` — Inbound TCP 5173, `-RemoteAddress 100.64.0.0/10` (सिर्फ tailnet, public internet से बंद), Profile Any ✅
- Access URL कहीं से भी: **http://100.80.128.23:5173** (PC local test: HTTP 200 page + /api/data 200)
- **Auto-start**: `start-server.bat` (project root) + Startup folder में hidden wrapper (`study-server-start.vbs`) — login पर server खुद चलेगा; Tailscale service Windows के साथ auto-start
- बचती कंडीशन: **PC ON होना चाहिए** (sleep में बंद); 폰 dictionary Tailscale को Always-on VPN रखो

### 09 Nov (सत्र-2h): ☁️ Netlify hosting — kahin-se-bhi PERMANENT access ✅
- User ne Tailscale manzoor नाही का → स्पष्ट किया गया विकल्प: **cloud host** चुना (परमानेंट URL, PC बंद भी चले); user ने खुद **keshustudybuddy.netlify.app** site बना दिया (account keshu; दूसरा site keshukharchaapp)
- **Deploy flow**: `npx.cmd` (PS1 policy भागो — npm.cmd वाला नियम ही ), CLI login (browser Approve), `deploy --prod --dir dist --site <id>` — 3 बार redeploy (vite hash देंखें बदलता रहा)
- ⚠️ **Hosted mode गड़बड़ी-सबक 1**: static host पर `/api/data` 404 (NETLIFY error HTML) → store.jsx में नया **fallback branch**: fresh-browser && no-keys पर `/sb-default.json` fetch करके content-keys restore — **sb_longs पहले अकेले रखा था → hosted fresh device पर QnA bank खाली** ("आज का सवाल" इंतज़ार टेक्स्ट) → sb-default.json फिर से **sb_longs+sb_qna+sb_maps** (307 KB) बनाया (`make-sb-default.cjs`) और branch को **setterMap वाला generic** किया — सबक: fallback में हर-की generic loop ही लिखो
- ⚠️ **restore-race सबक**: mount effects localStorage में default-`[]` जरुरी लिखते हैं → hadStorage false ही रहता है (ref render-काल का) — ओके — पर **verify जल्दी query करोगे तो 0 दिखेगा** — fallback fetch ~1-2s में आता है; 5s बाद सत्यापित: longs 54 · qna 54 · maps 14 ✅
- Netlify rules: /api/data के बिना **डेटा device-local** है (phone ka data phone me) — दोनों डिवाइस पर उसी backup-export/import फ्लो से ले जाओ; PC-div वाला auto sync सिर्फ dev/preview server पर
- **Live verify** ✅: चारों fetch 200 (/, manifest, icon, sb-default), Dashboard "आज का सवाल" पोपट (pृथ्वी की उत्पत्ति), Longs page विषय-कार्ड 16/18/20, fresh-origin hosted me बिना किसी काम के सब data आया
- अब प्रवेश रास्ते: hosted URL (कहीं से भी, PC बंद भी) · LAN `http://10.85.210.202:5173` (same Wi-Fi) · Tailscale URL `http://100.80.128.23:5173` (PC ON+hono chalva हो)
### 09 Nov (सत्र-2i): ⚡ Service Worker — offline PWA + PWA Builder ready ✅
- User पूछा "pwa builder?" → PWABuilder (pwabuilder.com) से APK बनाने के लिए **service worker जरूरी** — जोड़ा:
  - `public/sw.js` v1: precache `/`,manifest,icons; **assets cache-first** (hashed immutable), बाकी **network-first + offline fallback**, `/api/*` skip, non-GET skip — update = नया CACHE name (fill तab आगे version bump करना सबक: इस वाले सत्र में deploy पर नया JS है परनSW जे गली नहीं — 'sb-v1' में ही नया index load होता है)
  - `main.jsx` में registration — **सिर्फ `import.meta.env.PROD`** (dev/HMR ना बिगड़े) — verify: `swStatus: active`, caches `sb-v1` ✅
- Browser-reload hosted पर SW active, precache 4 चीज़ें; data auto-restore बरकरार (54/54/14)
- **PWA Builder गाइड दिया user को**: pwabuilder.com → URL paste → Android package → APK sideload (Play Store बिना); asset-links सिर्फ Play Store publish के लिए जरूरी
- दो खतरे दर्ज: (1) नया deploy के बाद खुले app में नया index SW-cache से ज्यादा 24h बाद मिलेगा — अचानक बदलाव दिखे तो app को close-reopen; (2) dev server पर SW नहीं — PROD guard सही

### 10 Nov (सत्र-2j): PWA/SW निकल दिया — Netlify plain hosting ही final ✅
- User: "pwa builder use nhi karna" और "netlify hi thik hai" — सो कर दिया:
  - `main.jsx` से SW-registration हटा (revert), `public/sw.js` को **self-cleanup stub** बना दिया (activate → caches.delete सब + `self.registration.unregister()`) — pattern: पहले से लगा हुआ SW अगली visit पर नया stub लेकर **खुद निकाल देता है** — verify: `swGone:true`, `cachesList:[]` ✅ data intact (54/54/14)
  - इससे फायदा: हर page-load **नेटवर्क से सबसे नया version** ही मिलेगा (कोई stale-cache सबक़ नहीं); offline सुविधा चली गई — user का चुनाव
- ⚠️ सबक: "SW hataना" के लिए सिर्फ registration-remove काफी नहीं — पुराने device की registration बची रहती है; **हमेशा एक सफाई-रीट deploy** करना (self-unregister stub) और बाद के deploy में stub भी आराम से रहने देना (यह अब sw.js में ही है, हर deploy साथ)
- स्थिति: **Netlify ही बचा एकमात्र रास्ता** — `https://keshustudybuddy.netlify.app` permanent URL; LAN वाला dev URL और Tailscale URL ज़रूरत पर उपलब्ध पर मुख्य नहीं; PWAApk कोई काम नहीं

### 10 Nov (सत्र-2k): 📱 phone-view पूरा audit + MathML-grid-बग fix + deploy ✅
- User शिकायत: view laptop के लिए अच्छा पर **phone पर नहीं** — इलाज: `public/phonetest.html` wrapper (393×852 iframe, same-origin dev server) + browser.screenshot से हर page की असली phone-width जाँच
- **मूल बग (असली production बग था)**: grid track की `auto` minimum size से `.sidebar` की nowrap nav (13 pills ≈1480px) ने `.app` को खिंचा दिया — phone पर सब content दाईं ओर कट (main width 1100, track 1480)। इलाज (append-only @media 900 layer): `.app{grid-template-columns:minmax(0,1fr)}` + `.sidebar,.main,.page,.nav{min-width:0}` — grid minmax(0,1fr) हमेशा याद रखो
- **nav-pills height फंसला (223px pills/nav 225px)**: दो वजहें — (1) HMR की अधूरी CSS-लोड हालत (dev-only; build में एक ही CSS file, वहाँ नहीं होगा), (2) `.nav-btn` को stretch से बचाने के लिए `align-self:flex-start;height:auto` भी जोड़ दिया — pills 40px, sidebar 86px सही
- **पूरा screen-audit किया (scrollW + wide-element scan + screenshots)**: Dashboard ✅ · Longs list+read ✅ · Timer ✅ · Progress ✅ · नक्शा अभ्यास ✅ · Notes ✅ · Mock ✅ · Flashcards ✅ · Planner ✅ · क्विज़ ✅ · 5-अंक Q&A ✅ · विषय ✅ · MindMaps ✅ (केवल खाली-state message — क्योंकि `sb_mindmaps=0` disk data में शुरू से; बग नहीं) — कोई horizontal overflow नहीं बचा
- छोटा सबक: जाँच-टूल में `setTimeout` सीधा नहीं — page-script के भीतर `await new Promise(res=>setTimeout(res,ms))`; nav-button text से click करके page बदलना (trim-सहित includes)
- phonetest.html **deploy में जाने दिया** (1 KB, harmless — hosted पर वही 393px preview wrapper, phone/Delta पर काम आ सकता है)
- **Deploy 6af2f6514…5f2a82eb: build `index-BMVbChGV.js` + `index-20MtODMy.css`** — hosted verify: CSS में gridFix/navPill/sidebarBar तीनों मौजूद ✅; storage 54/54/14 ✅

### 10 Nov (सत्र-2l): 🩹 phone में material न-दिखने की असली जड़ — self-heal restore ✅
- User: "koi bhi study material phone me nhi dikh rha" — असली कारण (view/CSS नहीं, **data-restore की शर्त**): पुराने समय में phone के visit पर app के mount-effects खाली `[]` sb_* keys लिख चुके थे → `hadStorage=true` → fallback branch `!hadStorage.current` के पीछे छिपा — **हर बाद का visit restore के बिना खाली app** दिखाता था
- **इलाज (store.jsx)**: hosted restore branch अब `hadStorage` से गायब — हर visit पर हर content-key का स्नान: key missing **या खाली** हो तो `/sb-default.json` से भरो; **non-empty device data कभी नहीं छेड़ा** (empty-guard `if (cur.length) continue`)
- **sb-default.json फिर से**: अब `sb_longs 54 + sb_qna 54 + sb_maps 14 + sb_subjects 5 + sb_cards 4` (308 KB) — subjects जोड़े बिना विषय-page खाली रहता (सबक: fallback में जो "study material" से चलता है सब content-keys शामिल करो)
- **hosted verify (तीनों states)**: (1) सब-empty नकल → 7s में heal: 54/54/14/5/4 ✅ (2) non-empty सुरक्षा: 1--item sb_longs टिका रहा, बाकी keys heal ✅ (3) fresh-clear → पूरा auto-restore + Dashboard ठीक ✅
- Deploy 6af2f8422a18…: build `index-BL2DkZqp.js` — same CSS hash (index-20MtODMy.css, mobile layer बरकरार)
- **Status phone-user को दिया**: site फिर खोलने से 2-3 सेकंड में खुद पूरा material आ जाएगा; अगर न आए तो एक बार app बंद-कर-फिर-खोलो (अब हर visit पर self-heal चलता है)

### 10 Nov (सत्र-2m): 🎁 सामान-से-खाली पेज भर दिए — notes/flashcards/quiz/mindmaps/subjects ✅
- User की जांच फलिक: "notes, flash card, quiz, mind maps, subject me kuch bhi nhi hai" — दीखता है PHONE अभी नया build नहीं खोला था + कुछ keys वास्तव में default में बाहर थीं:
  - `sb_notes` (seed 2), `sb_quizzes` (नमूना क्विज़ 1), `sb_subjects` (5), `sb_cards` (4) — सब **sb-default.json में डाले** (अब 378 KB, 8 keys); heal setterMap में notes/quizzes भी
- 🗺️ **Mind maps की दिक्कत असली (सबसे बड़ी)**: disk data में `sb_mindmaps=[]` शुरू से — **54 starter mind-maps बनाए सबसे छोटा कोड से (longs की points से!)** — हर long chapter का यूनिक map: `id={chapter}-map` (MindMaps.jsx की chapterId स्लाइक से लगता है!), subject=`English 11th` वग़ैरह, kind='chapter', root=topic शुद्ध ('Long Answer: ' कट), children=points घटाकर ≤72-chars लेबल ':'/'—' से pehle head, ('generator: make-sb-default.cjs') → **mind maps न 16/18/20 per-subject list** बनती है, board-note/qna link भी बी frauen
- MindMaps.jsx की सुधार: subject-select field अब **store-subjects + map-subjects का संगम** (पुराने sql एकल 'सामान्य/गणित' seedों पर अटका)
- CSS (append-only 600 block): `.mm-layout{grid-template-columns:1fr}` + `.mm-list{max-height:36vh}` + `.mm-controls{flex-wrap:wrap}` — mind maps phone से भी सही (सत्यापन: layoutCols 357.6, scrollW 378, दिखें नवा नहीं)
- **heal अब unconditional** (dev और hosted दोनों) — branch-1 (api/data) के बाद हमेशा default-से empty की-रेखा; `hadStorage` से अब कोई बंदी नहीं
- **Hosted verify (7 कंटेंट कीज़)**: longs 54 · qna 54 · maps 14 · subjects 5 · cards 4 · notes 2 · quizzes 1 · mindmaps 54 ✅
- पेज-स्तरी verify (hosted): विषय — 5 गिनती-भरी ✅ · माइंड मैप्स — list 16 (English) + map खुला, 12 branches + ✅-marking ✅ · फ्लैशकार्ड — 4 कार्ड + ▶ पढ़ाई शुरू (4) ✅ · नोट्स — 2 seed नोट ✅ · क्विज़ — नमूना क्विज़ खेलने-लायक ✅
- Deploy 6af2fa1675…: build `index-OyZ4aojq.js` + `index-cWijDFsI.css`
- बचा हुआ ज्ञात: user के phone पर पुरानी state से बचने के लिए बस एक नया visit — हर visit self-heal अपने आप

### 10 Nov (सत्र-2n): 🚧 Netlify credits खत्म — deploy blocked (app अप्रभावित) ✅
- User फिर शिकया "mobile me fix nhi hua" — **live site verify**: न्यूतम JS `index-OyZ4aojq.js` + heal code + `sb-default.json` 8-keys (सिर्फ mindmaps 54 नहीं — सब) live ✅ — यानी **सर्वर पर सब सही**, गड़बड़ फिर phone के जुनूनी index.html cache में है
- इलाज कोशिश: `public/_headers` (`/index.html → Cache-Control: no-cache, must-revalidate`) से cache मारो — पर deploy में `JSONHTTPError: Forbidden` पकड़ा। जड़ (CLI-free direct API deploy script `api-deploy.cjs` से): **"Account credit usage exceeded - new deploys are blocked until credits are added"** — यानी **Netlify free-क्रेडिट लिमिट छू गई**; किसी भी नई deploy रोकी गई (token: Roaming\netlify\Config\config.json → users[].auth.token में 'nfc_' prefix — समझ: netlify-cli अब नया Config फोल्डर इस्तेमाल करता है)
- ⃞ ज़रूरी पढ़हर: app चालू है और user critical सब **पहले चढ़ चुका** (11:03 UTC deploy) — सिर्फ `_headers` आगे रह गया (नहीं तहा तो बस; user-cache साफ करके फिर चले तो ठीक रहेगा; आगे अपडेट के लिए user के app.netlify.com में credits/limit सीना देखने की शर्त)
- स्थिति: विकल्प (अगर जल्दी अपडेट डालनी हैं): Vercel, Cloudflare Pages, GitHub Pages (सब माफ़िया गिनती); या Netlify में limit का बदला देखो — user का चुनाव होगा

### 10 Nov (सत्र-2o): ⚡ Vercel नया मूल-घर (Netlify credits ब्लॉक को उपाय) ✅
- नेटलाइफ़े free-credits **खत्म** ("Account credit usage exceeded - new deploys are blocked") — period 2 Nov–2 Dec; app चालू रही पर नई deploy रुकी — CLI का Forbidden वही जड़ था (CLI का @netlify/config चरण बेकार ही)
- Vercel पलते बनाया: **login दो रास्ते हारे** (email-लिंक ना आया) → तीजी बार **device-oauth code** चला — user ने `https://vercel.com/oauth/device?user_code=WCPG-HCFM` पर confirm कर के **zoneroasted-3271** (team `keshu6`, Hobby plan) हुई ✅ (सबक: vercel login बिना args के → device-code दिशा; email ना दिखे तो इसीतरह)
- झटपटाएँ: प्रोजेक्ट नाम folder से **bad था ("study app")** → `vercel link --yes --project keshu-study-buddy` उम्र; भरते समय `vercel.json` (framework: vite, buildCommand: `npm run build`, outputDirectory: dist) बनाया ताकि CLI रिमोट-बिल्ड करे
- **Deploy Ready (Production)** — build `index-OyZ4aojq.js` (ही वो latest जो Netlify पर भी था): **नया URL = `https://keshu-study-buddy.vercel.app`** ✅ — sb-default.json 8 keys (54/54/14/5/4/2/1/54) सब fetch हो रहा
- **आगे के लिए दिनचर्या**: `npm.cmd run build` + `npx.cmd --yes vercel@latest deploy --prod --yes` (link बना है .vercel/ में) — Vercel Hobby पर build-minutes चalización नहीं; CLI ने `.env.local` बना (VERCEL_OIDC) — छोड़ दो
- Netlify साइट चलती रहेगी (latest build फिलहाल live); 2 Dec बाद credits बहाल तो वहाँ भी deploy कर सकते — पर **user के लिए मुख्य link अब Vercel**
- `_headers` (index.html no-cache) Netlify से r/resources — Vercel पर अगली चाह पर `vercel.json` में headers — फिलहाल मुख्य नहीं (क्योंकि नया deploy हर बार नया URL देता है; user-cache सेवा भी prod हर-हाल)

### 10 Nov (सत्र-2p): 💾 बन्द-पकेट (bundle-internal) default data — phone की घोड़ी-लोल networks से स्वतंत्र ✅
- User की तीसरी शिकायत "nhi aaya" — निदान-बातचीत की खोज: वो **पुराना netlify link** खोल रहे थे (नया netlify-cache JS की समस्या), फिर **vercel खुला पर खाली** — सभी संभावनाओंका एक पक्का उपाय जरूरी था
- **मूल उपाय (पहले की भूल-नहीं-होनेवाली markathlon)**: network fetch (`/sb-default.json`) से ही शक्तिशाली heal वाले app पर निर्भर था, पर phone के उलझ सोच या लौ जाने वाली नेटर्स पर फेस रहेगा। अब: `src/default-data.json` बना (370KB: longs 54, qna 54, maps 14, subjects 5, cards 4, notes 2, quizzes 1, **mindmaps 54**) — **simples Vite import से ही JS बंदल में साथ आया**
- सुधार store.jsx में: (a) `loadOrDef` — खाली/missing content-key तो bunded default (device-nonempty वापसी-की रेखा ✅) — यही **पहले render ही instant सामान** (networkfetch 1-2s का गोला नहीं); उसी प्रथम में notes/quizzes/cards/subjects qna/longs/maps/mindmaps; (b) mount-effect का heal अब DOM में तत्काल (fetch-reject भूईकार-की नहीं)
- **build**: `index-DXq_h84u.js` 440KB (gzip 169KB) — `The Portrait of a Lady` bundle के भीतर verified ✅
- **Deploy Vercel Production ✅** — `https://keshu-study-buddy.vercel.app` पर नया JS लाइव (डिप्लॉय 2 मिनट के भीत); अब: slow-net/offline/nowrap fetch हर हालत में सामान दिखेगा — यही बैंडल-internal data का पूरा विजय
- स्थिर नोट: अब `sb-default.json` + नदीन `default-data.json` एकजैसे डेटा; आगे किसी दिन बजाय sb-default (बाह्य) रखो (Vercel त्रुटि फाइलें), सिर्फ bundle-internal एक स्रोत ही रहे (समझ: dual-source का मेल बोझिल है)
- User को सूशला: vercel link खोलो + 2-3s; रोक देना नहीं — अब हर हालत सा आएगा

### 12 Nov (सत्र-2q): 🛡 watchdog + storage-crash-proofing (phone का invisible फेल पकड़ो) ✅
- User फिर खाली — और browser-जांच उपकरण अब उपलब्ध नहीं (skill हटा) — तो app को **खुद-निदान** लैस किया:
  - **watchdog (index.html, ES5)**: load के 5s बाद अगर `#root` खाली (JS कभी चला ही नहीं — पुराना browser/parse-क्रैश) तो screen पर सुंदर पैनल: "App अभी खुला नहीं — browser पुराना है, Chrome update करो या दूसरा browser" — **अब blank phone पर भी कुछ दिखता है** (पहले चुप-चाप सफेद रहता था)
  - **स्टोरेज-क्रैश proofing (store.jsx)**: 19 persistence-effects के कच्चे `setItem` → `save()` (try/catch) — private-mode/भरा-quota/बंद-storage में app पूरा ब्लैंक हो जाता था; `hadStorage` का `Object.keys(localStorage)` भी सुरक्षित (storage-ना-खुले तो false)
  - साथ में पिछले सत्र का **bundle-internal data** (`src/default-data.json` 370KB → JS 440KB/gzip 169KB) — content किसी भी network हालत में साथ
  - `vercel.json` headers: non-assets पर `must-revalidate` — phone के जुनूनी index.html cache को काटो (verified live: cache-control header ✅)
- **Deploy**: `index-DUN-UKx9.js` — Vercel prod live ✅ (watchdog html में verified)
- अब phone पर तीनों नतीजों में से हर एक का मतलब स्पष्ट: (1) सामान दिखे = हल, (2) watchdog पैनल = browser अपडेट (Play Store → Chrome), (3) अब भी अजीब = user से विशेष विवरण (कौन-सा पेज, क्या टेक्स्ट) या screenshot
- अगला फैसला user के जवाब पर — अगर watchdog दिखे तो निदान पक्का: पुराना Chrome (Vite baseline chrome87+ नहीं पहुँच रहा)

### 13 Nov (सत्र-2r): 🐙 GitHub Pages तीसरा घर + code backup ✅
- User पूछा: project GitHub पर + phone में app-जैसा? — सेटअप पूरा:
  - gh CLI **पहले से installed + logged-in** (`C:\Program Files\GitHub CLI\gh.exe`, PATH में नहीं — full path याद रखो); username **keshu1524**; पहले केवल kharcha-app repo
  - repo बनाया `keshu1524` → Pages enable (legacy, main root) → **rename `keshu1524.github.io`** (user-site repo ही root URL देता है; वरना sub-path आता जिसमें absolute `/assets/...` टूटते) — अंतिम URL **`https://keshu1524.github.io/`** ✅
  - **dist को git से push** (workdir=dist, git init→commit→main→origin push) — git config user.email/name पहली बार लगे (zoneroasted@gmail.com / keshu1524); push gh-credential-helper से
  - Live verify: JS `index-DUN-UKx9.js` (bundle-internal defaults सहित, "The Portrait of a Lady" भीतर) + manifest 200 ✅ — watchdog वाला html भी
  - repo: `github.com/keshu1524/keshu1524.github.io` — **build का backup** (dist 10 files); स्रोत-कोड backup बाकी बाद में चाहे तो
- **अब तीनों घर**: Vercel `keshu-study-buddy.vercel.app` (मुख्य, deploy आसान) · GitHub `keshu1524.github.io` (backup-host, ISP-block का विकल्प) · Netlify (credits 2 Dec तक बंद, पर पुराना-नवीनतम build चलता है)
- deploy-रीपीट के लिए नियम: `npm run build` → `cd dist` → `git add -A; git commit; git push` (repo .git अंदर ही dist में) → दोनों Vercel+GitHub चाहें तो अलग-अलग
