import { profiles, units } from './content.mjs';
import { answer, reflect, extend, resetLearner, stats, unitComplete, load, save, importBackup, exportBackup } from './core.mjs';

const main = document.querySelector('#main');
const fileInput = document.querySelector('#import-file');
const storage = (() => {
  try { return localStorage; }
  catch { return { getItem() { throw new Error('Storage unavailable'); }, setItem() { throw new Error('Storage unavailable'); } }; }
})();
let { state, error: loadError } = load(storage);
let current = null;
let subject = null;
let hints = new Set();
let reflectionDraft = null;
let extensionDraft = null;
let section = 'study';
let notice = loadError ?? '';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const profile = () => profiles.find(p => p.id === current);
const banner = () => notice ? `<p role="status" class="notice">${esc(notice)}</p>` : '';
function persist(next) {
  state = next;
  try { save(storage, next); notice = 'Progreso guardado en este dispositivo.'; }
  catch { notice = 'No se pudo guardar en este dispositivo. Exporta una copia antes de cerrar la página.'; }
}
function shell(title, eyebrow, body) {
  main.innerHTML = `${banner()}<div class="page-head"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1></div>${body}`;
  main.focus({ preventScroll: true });
}
function home() {
  current = null; subject = null; reflectionDraft = null; extensionDraft = null;
  const total = profiles.reduce((n,p) => n + stats(state,p.id).goal, 0);
  shell('Dos caminos. Un mismo gusto por descubrir.', 'Elige tu cuaderno', `<p class="intro">Una misión pequeña por materia: primero entender, después probar. Los intentos también cuentan como aprendizaje.</p><section class="card-grid" aria-label="Cuadernos">${profiles.map(p => {
    const s = stats(state,p.id);
    return `<button class="profile-card" data-profile="${p.id}"><span class="profile-mark" aria-hidden="true">${p.name[0]}</span><span class="card-title">${esc(p.name)}</span><span>${esc(p.grade)} · ${p.subjects.length} materias</span><span class="card-meta">${s.goal} de 4 pasos de su meta · ${s.xp} puntos</span><span class="card-link">Abrir cuaderno →</span></button>`;
  }).join('')}</section><section class="shared"><p class="eyebrow">Meta compartida, no competencia</p><h2>${total} de 8 pasos completados</h2><p>Cada uno aporta hasta cuatro respuestas correctas. Son metas iguales, no una comparación de notas entre grados.</p><div class="meter"><span style="width:${total / 8 * 100}%"></span></div></section><p class="subtle">Solo se ve el progreso compartido si usan este mismo navegador y dispositivo. Para moverlo a otro, exporten e importen una copia.</p>`);
}
function learner() {
  const p = profile(), s = stats(state,p.id);
  shell(`El cuaderno de ${p.name}`, p.grade, `<button class="back" data-home>← Todos los cuadernos</button><section class="dashboard"><div><p class="eyebrow">Tu expedición</p><h2>${s.xp} puntos</h2><p>${s.attempted} ejercicios intentados · ${s.correct} correctos · ${s.firstTry} al primer intento</p><p>${s.improved ? `Insignia «Volví a intentar»: ${s.improved} respuesta${s.improved === 1 ? '' : 's'} mejorada${s.improved === 1 ? '' : 's'}.` : 'Tu insignia «Volví a intentar» aparecerá cuando mejores una respuesta.'}</p><p>${s.reflections ? `Insignia «Pensé mi camino»: ${s.reflections} reflexión${s.reflections === 1 ? '' : 'es'} escrita${s.reflections === 1 ? '' : 's'}.` : 'Escribe una reflexión para obtener «Pensé mi camino».'}</p></div><div class="goal"><strong>${s.goal}/4</strong><span>pasos de tu meta personal</span></div></section><h2>Materias</h2><div class="subject-grid">${p.subjects.map(id => {
    const u = units[id], done = unitComplete(state,p.id,id);
    return `<button class="subject-card" data-subject="${id}"><span class="subject-mark">${esc(u.mark)}</span><span class="card-title">${esc(u.title)}</span><span>${esc(u.unit)}</span><span class="card-meta">${done ? 'Misión completada' : 'Misión disponible'}</span><span class="card-link">Estudiar →</span></button>`;
  }).join('')}</div><section class="tools"><h2>Tu progreso</h2><p>Guardado únicamente aquí. Una copia te permite llevarlo a otro dispositivo; importarla reemplaza el progreso actual de ambos cuadernos.</p><div class="actions"><button data-export>Descargar copia</button><button data-import>Importar copia</button><button class="danger" data-reset>Borrar el progreso de ${esc(p.name)}</button></div></section>`);
}
function question(q) {
  const a = state.learners[current].answers[q.id];
  const completed = a?.correct;
  return `<fieldset class="question" data-question="${q.id}" tabindex="-1"><legend>${esc(q.question)}</legend><div class="choices">${q.choices.map((c,i) => `<button type="button" data-choice="${i}" ${completed ? 'disabled' : ''}>${esc(c)}</button>`).join('')}</div><button type="button" class="hint" data-hint="${q.id}">Ver pista</button>${hints.has(q.id) ? `<p class="hint-text">${esc(q.hint)}</p>` : ''}<p class="feedback" role="status">${a ? (completed ? `Correcto. ${esc(q.explain)} ${a.attempts > 1 ? 'Mejoraste con otro intento.' : ''}` : 'Todavía no. Lee la pista y prueba otra opción.') : 'Elige una respuesta. Puedes volver a intentar.'}</p></fieldset>`;
}
function lesson() {
  const p = profile(), u = units[subject];
  const reflection = reflectionDraft ?? state.learners[current].reflections[subject] ?? '';
  const extension = extensionDraft ?? state.learners[current].extensions?.[subject] ?? '';
  const tabs = `<div class="section-tabs" role="group" aria-label="Apartados de la materia"><button type="button" data-section="study" aria-pressed="${section === 'study'}">Estudio</button><button type="button" data-section="deeper" aria-pressed="${section === 'deeper'}">Profundización</button></div>`;
  const study = `<div class="lesson-body" id="study-panel"><section class="lesson-panel"><p class="eyebrow">01 · La situación</p><h2>Una pregunta para empezar</h2><p>${esc(u.scenario)}</p></section><section class="lesson-panel"><p class="eyebrow">02 · Entender</p><h2>Por qué funciona</h2><p>${esc(u.why)}</p><div class="worked"><strong>Ejemplo resuelto</strong><p>${esc(u.example)}</p></div></section><section class="lesson-panel"><p class="eyebrow">03 · Practicar con ayuda</p><h2>Prueba paso a paso</h2>${u.practice.map(question).join('')}</section><section class="lesson-panel"><p class="eyebrow">04 · Hacerlo por tu cuenta</p><h2>Desafío</h2>${question(u.challenge)}</section><section class="lesson-panel"><p class="eyebrow">05 · Mirar tu camino</p><h2>Reflexión</h2><label for="reflection">${esc(u.reflection)}</label><textarea id="reflection" rows="5" maxlength="3000">${esc(reflection)}</textarea><button data-reflect>Guardar reflexión</button><p class="subtle">Guardar reconoce que escribiste una reflexión; no evalúa si tu razonamiento es correcto. Mínimo 10 caracteres para completar la misión.</p><p class="completion">${unitComplete(state,current,subject) ? 'Misión completada: resolviste las cuatro preguntas y escribiste tu reflexión.' : 'Para completar: resuelve las cuatro preguntas y escribe tu reflexión.'}</p></section></div>`;
  const deeper = `<div class="lesson-body" id="deeper-panel"><section class="lesson-panel deeper"><p class="eyebrow">Profundización</p><h2>Ir un poco más allá</h2><p>${esc(u.extension)}</p><label for="extension">Tu explicación o resultado</label><textarea id="extension" rows="6" maxlength="3000">${esc(extension)}</textarea><button data-extend>Guardar respuesta</button><p class="subtle">Esta respuesta queda guardada, pero no recibe nota automática. Puede comentarse con un adulto o compañero.</p>${state.learners[current].extensions?.[subject] ? `<details><summary>Criterios para revisar tu respuesta</summary><p>${esc(u.extensionCriteria)}</p></details>` : '<p class="subtle">Guarda tu respuesta para ver los criterios de revisión.</p>'}</section></div>`;
  shell(u.title, `${p.name} · ${p.grade}`, `<button class="back" data-profile="${p.id}">← Sus materias</button>${tabs}<div class="lesson-layout"><aside class="lesson-side"><span class="subject-mark">${esc(u.mark)}</span><p class="eyebrow">Misión inicial disponible</p><h2>${esc(u.unit)}</h2><p>${esc(u.roadmap)}</p><p class="subtle">El mapa de próximas misiones es una orientación, no contenido terminado.</p>${subject === 'math6' ? '<p><a href="activities/matematica-6to.html">Abrir examen de Matemática de 6.º</a></p>' : ''}</aside>${section === 'study' ? study : deeper}</div>`);
}

function render() { if (!current) home(); else if (!subject) learner(); else lesson(); }
document.querySelector('#home').addEventListener('click', home);
main.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.matches('[data-home]')) { home(); return; }
  if (button.dataset.profile) { reflectionDraft = null; extensionDraft = null; current = button.dataset.profile; subject = null; render(); return; }
  if (button.dataset.subject) { reflectionDraft = null; extensionDraft = null; section = 'study'; subject = button.dataset.subject; hints = new Set(); render(); return; }
  if (button.dataset.section) { reflectionDraft = document.querySelector('#reflection')?.value ?? reflectionDraft; extensionDraft = document.querySelector('#extension')?.value ?? extensionDraft; section = button.dataset.section; render(); main.querySelector(`[data-section="${section}"]`)?.focus(); return; }
  if (button.dataset.hint) { reflectionDraft = document.querySelector('#reflection')?.value ?? null; hints.add(button.dataset.hint); render(); main.querySelector(`[data-question="${button.dataset.hint}"]`)?.focus({ preventScroll: true }); return; }
  if (button.dataset.choice !== undefined) {
    const id = button.closest('[data-question]').dataset.question;
    reflectionDraft = document.querySelector('#reflection')?.value ?? null;
    persist(answer(state, current, id, Number(button.dataset.choice), hints.has(id)));
    render(); main.querySelector(`[data-question="${id}"]`)?.focus({ preventScroll: true }); return;
  }
  if (button.matches('[data-extend]')) {
    persist(extend(state, current, subject, document.querySelector('#extension').value)); extensionDraft = null; render(); return;
  }
  if (button.matches('[data-reflect]')) {
    persist(reflect(state, current, subject, document.querySelector('#reflection').value)); reflectionDraft = null; render(); return;
  }
  if (button.matches('[data-export]')) {
    const blob = new Blob([exportBackup(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'cuaderno-progreso.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); return;
  }
  if (button.matches('[data-import]')) { fileInput.click(); return; }
  if (button.matches('[data-reset]')) {
    if (confirm(`¿Borrar el progreso de ${profile().name} en este dispositivo? Esta acción no se puede deshacer sin una copia.`)) { persist(resetLearner(state, current, true)); render(); } return;
  }
});
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0]; if (!file) return;
  try {
    if (file.size > 1_000_000) throw new Error('Archivo demasiado grande');
    const next = importBackup(await file.text());
    if (confirm('¿Reemplazar el progreso actual de ambos cuadernos con esta copia?')) { reflectionDraft = null; extensionDraft = null; persist(next); render(); }
  } catch { notice = 'La copia no es válida. El progreso actual no cambió.'; render(); }
  fileInput.value = '';
});
render();
