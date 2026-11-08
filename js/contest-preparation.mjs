import { lessons, sessions, storageKey } from './contest-content.mjs';
import { escapeHtml as esc } from './contest-visuals.mjs';
import { evaluate } from './math-evaluator.mjs';
const link = id => `matematica-6to.html?session=${id}`;
document.querySelector('#lessons').innerHTML = lessons.map(lesson => `
  <article class="lesson" id="${lesson.id}">
    <p class="eyebrow">${esc(lesson.goal)}</p><h3>${esc(lesson.title)}</h3>
    ${lesson.explain.map(p=>`<p>${esc(p)}</p>`).join('')}
    <div class="worked"><h4>Ejemplo resuelto</h4><p>${esc(lesson.example)}</p></div>
    <p class="caution"><strong>Evita este error:</strong> ${esc(lesson.error)}</p>
    <div class="guided"><h4>Comprueba que lo entendiste</h4><p>${esc(lesson.guide)}</p><details><summary>Ver explicación después de intentarlo</summary><p>${esc(lesson.answer)}</p></details></div>
    <p><strong>Cómo comprobar:</strong> ${esc(lesson.check)}</p>
    <p class="level-list">Con ayuda → Por tu cuenta → Reto → Concurso</p>
    <a class="button" href="${link(lesson.id)}">Practicar ${esc(lesson.title.toLowerCase())} · 4 problemas</a>
  </article>`).join('');
let storageError = false;
document.querySelector('#session-progress').innerHTML = Object.entries(sessions).map(([id, session])=>{
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey(id)) || 'null'); }
  catch { storageError = true; }
  const valid = saved && Array.isArray(saved.responses) && saved.responses.length === session.questions.length;
  const answered = valid ? saved.responses.filter(a=>typeof a==='string' && a.trim()).length : 0;
  const score = valid && saved.finished ? session.questions.filter((q,i)=>evaluate(q.expected,saved.responses[i]).correct).length : null;
  const status = score === null ? `${answered} de ${session.questions.length} respuestas guardadas` : `Sesión terminada: ${score} de ${session.questions.length} respuestas correctas`;
  return `<article class="progress-card"><strong>${esc(session.title)}</strong><p>${status}</p><a href="${link(id)}">${answered ? 'Continuar o revisar' : 'Empezar'} →</a></article>`;
}).join('');
if (storageError) document.querySelector('#progress-status').textContent='No se pudo leer algún guardado. Puedes estudiar y practicar, pero comprueba los avisos de guardado y descarga una copia al terminar.';
document.querySelector('#print-plan').addEventListener('click',()=>{
  document.querySelectorAll('details').forEach(d=>d.open=true);
  window.print();
});
