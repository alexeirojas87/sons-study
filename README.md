# Cuaderno de exploradores

Open [the published portal](https://alexeirojas87.github.io/sons-study/) in a modern browser. Choose a learner, then a subject. Each subject has one original pilot mission with separate Estudio and Profundización sections: situation, explanation, worked example, guided questions, challenge, deeper task, and reflection.

Progress stays in this browser on this device. There is no account, cloud sync, tracking, or automatic evaluation of written reasoning. Use **Descargar copia** before changing devices or clearing browser data; **Importar copia** replaces both learners' current progress after confirmation. Each learner's reset has its own confirmation. Correct answers earn 10 points once; a written reflection of at least 10 characters earns 5 once. Points are not a measure of academic ability.

## Sixth-grade contest preparation

Open `activities/preparacion-concurso.html` (also linked prominently from the portal). It contains a November 8–10 preparation schedule (120 active minutes on Sunday, 100 on Monday, and 10–15 minutes on Tuesday; breaks are additional), four explanatory lessons with worked examples, 8 diagnostic questions, 16 progressively harder practice questions, and a distinct 12-question contest mock. All educational copy uses neutral Spanish. The contest date is November 10, 2026; suggested timings are not official contest rules. The diagnostic selects two priority topics; the remaining practice is optional rather than a requirement to finish all 36 questions before the contest.

`activities/matematica-6to.html` now opens the new mock; `?session=diagnostic` or a topic ID selects other sessions. Practice offers hints and immediate checks; diagnostic and mock reveal corrections only on completion. Drawing, navigation, result export, and printing remain available.

`js/math-evaluator.mjs` compares exact rational quantities with dimension-aware units. Equivalent fractions/decimals and natural Spanish unit expressions are accepted; unknown text and wrong units are not stripped. Bare numbers use the unit requested by the question. Clock answers explicitly request 24-hour HH:MM. Unsupported syntax is identified separately from a wrong numerical value. No arbitrary expressions or code are executed.

Each session uses a `matematica6_contest-2026-11-v1_*` storage key, separate from portal progress. The old `examen_matematica_6to_ipad_v2` key is left untouched and is not reused with different questions. Export each new session from its results page; exported HTML contains answers, diagrams, and drawings. No cloud synchronization is implied.

Content is original, oriented by the supplied Cuban sixth-grade mathematics textbook (2025), printed pages 9–13, 32–34 and 149–152. This is focused contest preparation, not the complete sixth/third-grade curriculum or an official contest paper.

The roadmap names planned course themes, not completed lessons or a complete textbook unit. Deeper open answers are saved and review criteria appear after saving; they are not automatically graded. All lesson prose and questions here are original; textbook PDFs are not included. Curriculum orientation was checked against: *Matemática 6.º grado* (natural numbers, fractions and decimals, pp. 1–64); *Matemática 3.º grado* (numbers to 10 000, pp. 1–94); *Ciencias Naturales 6.º grado* (investigation, pp. 1–24); *Geografía de Cuba 6.º grado* (locality and location, pp. 1 and 10 onward); *English 6th grade* (“Hi, friends!”, p. 1); *English 3rd grade* (introduction and greetings, pp. 1 and 11). The page references identify topic orientation, not quotations or reproduced exercises.

## Check

From this folder run `node --test tests/*.test.cjs`, then `node --check js/app.mjs`, `node --check js/core.mjs`, and `node --check js/content.mjs`. No packages are needed. The tests cover exact answer equivalence, invalid input, bank answers and coverage, isolated storage keys, and the deliberately upgraded exam integration. Browser visual and interaction QA, especially on a physical iPad, is still recommended. For local preview, serve this folder over HTTP rather than opening `index.html` with `file://`, because browsers can block module imports from local files.
