# Cuaderno de exploradores

Open [the published portal](https://alexeirojas87.github.io/sons-study/) in a modern browser. Choose a learner, then a subject. Each subject has one original pilot mission with separate Estudio and Profundización sections: situation, explanation, worked example, guided questions, challenge, deeper task, and reflection.

Progress stays in this browser on this device. There is no account, cloud sync, tracking, or automatic evaluation of written reasoning. Use **Descargar copia** before changing devices or clearing browser data; **Importar copia** replaces both learners' current progress after confirmation. Each learner's reset has its own confirmation. Correct answers earn 10 points once; a written reflection of at least 10 characters earns 5 once. Points are not a measure of academic ability.

The existing sixth-grade mathematics exam is preserved at `activities/matematica-6to.html`. It retains its own original local storage key and is separate from this portal's progress.

The roadmap names planned course themes, not completed lessons or a complete textbook unit. Deeper open answers are saved and review criteria appear after saving; they are not automatically graded. All lesson prose and questions here are original; textbook PDFs are not included. Curriculum orientation was checked against: *Matemática 6.º grado* (natural numbers, fractions and decimals, pp. 1–64); *Matemática 3.º grado* (numbers to 10 000, pp. 1–94); *Ciencias Naturales 6.º grado* (investigation, pp. 1–24); *Geografía de Cuba 6.º grado* (locality and location, pp. 1 and 10 onward); *English 6th grade* (“Hi, friends!”, p. 1); *English 3rd grade* (introduction and greetings, pp. 1 and 11). The page references identify topic orientation, not quotations or reproduced exercises.

## Check

From this folder run `node --test tests/*.test.cjs`, then `node --check js/app.mjs`, `node --check js/core.mjs`, and `node --check js/content.mjs`. No packages are needed. The tests include a SHA-256 fingerprint of the preserved exam; update it only after deliberately changing that exam. Browser visual and interaction QA, especially on a physical iPad, is still recommended. For local preview, serve this folder over HTTP rather than opening `index.html` with `file://`, because browsers can block module imports from local files.
