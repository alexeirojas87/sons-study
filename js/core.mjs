import { profiles, units } from './content.mjs';

export const STORAGE_KEY = 'sons-study-progress-v1';
export const VERSION = 1;
const ids = new Set(profiles.map(p => p.id));
const questions = Object.fromEntries(Object.entries(units).flatMap(([unit, data]) => [...data.practice, data.challenge].map(q => [q.id, { unit, ...q }])));

export function emptyState() {
  return { version: VERSION, learners: Object.fromEntries(profiles.map(p => [p.id, { answers: {}, reflections: {}, extensions: {} }])) };
}
export function score(questionId, choiceIndex) {
  const q = questions[questionId];
  if (!q || !Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex >= q.choices.length) throw new Error('Invalid answer');
  return choiceIndex === q.answer;
}
export function validateState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== VERSION || !value.learners || typeof value.learners !== 'object' || Array.isArray(value.learners)) throw new Error('Invalid backup version or structure');
  if (Object.keys(value.learners).sort().join() !== [...ids].sort().join()) throw new Error('Invalid learner set');
  for (const p of profiles) {
    const learner = value.learners[p.id];
    if (!learner || typeof learner !== 'object' || Array.isArray(learner) || !learner.answers || typeof learner.answers !== 'object' || Array.isArray(learner.answers) || !learner.reflections || typeof learner.reflections !== 'object' || Array.isArray(learner.reflections)) throw new Error('Invalid learner data');
    for (const [id, a] of Object.entries(learner.answers)) {
      if (!Object.hasOwn(questions, id) || !p.subjects.includes(questions[id].unit) || !a || typeof a !== 'object' || Array.isArray(a) || !Number.isInteger(a.attempts) || a.attempts < 1 || a.attempts > 10000 || typeof a.correct !== 'boolean' || typeof a.firstTry !== 'boolean' || typeof a.hintUsed !== 'boolean' || !Array.isArray(a.tried) || a.tried.some(x => !Number.isInteger(x) || x < 0 || x >= questions[id].choices.length) || a.tried.length !== a.attempts || a.tried.slice(0, -1).some(x => x === questions[id].answer) || a.correct !== (a.tried.at(-1) === questions[id].answer) || a.firstTry !== (a.correct && a.attempts === 1 && !a.hintUsed)) throw new Error('Invalid answer record');
    }
    if (learner.extensions !== undefined) {
      if (!learner.extensions || typeof learner.extensions !== 'object' || Array.isArray(learner.extensions)) throw new Error('Invalid extension data');
      for (const [unit, text] of Object.entries(learner.extensions)) if (!p.subjects.includes(unit) || typeof text !== 'string' || text.length > 3000 || text !== text.trim()) throw new Error('Invalid extension');
    }
    for (const [unit, text] of Object.entries(learner.reflections)) if (!p.subjects.includes(unit) || typeof text !== 'string' || text.length > 3000 || text !== text.trim()) throw new Error('Invalid reflection');
  }
  return structuredClone(value);
}
export function answer(state, learnerId, questionId, choiceIndex, hintUsed = false) {
  const next = validateState(state);
  const q = questions[questionId];
  const profile = profiles.find(p => p.id === learnerId);
  if (!profile || !q || !profile.subjects.includes(q.unit)) throw new Error('Question does not belong to learner');
  const correct = score(questionId, choiceIndex);
  const old = next.learners[learnerId].answers[questionId];
  if (old?.correct) return next;
  const tried = [...(old?.tried ?? []), choiceIndex];
  next.learners[learnerId].answers[questionId] = {
    attempts: tried.length, tried, correct,
    firstTry: correct && tried.length === 1 && !hintUsed,
    hintUsed: Boolean(hintUsed || old?.hintUsed)
  };
  return next;
}
export function reflect(state, learnerId, unitId, text) {
  const next = validateState(state);
  const p = profiles.find(x => x.id === learnerId);
  if (!p?.subjects.includes(unitId) || typeof text !== 'string' || text.length > 3000) throw new Error('Invalid reflection');
  next.learners[learnerId].reflections[unitId] = text.trim();
  return next;
}
export function extend(state, learnerId, unitId, text) {
  const next = validateState(state);
  const p = profiles.find(x => x.id === learnerId);
  if (!p?.subjects.includes(unitId) || typeof text !== 'string' || text.length > 3000) throw new Error('Invalid extension');
  next.learners[learnerId].extensions ??= {};
  next.learners[learnerId].extensions[unitId] = text.trim();
  return next;
}
export function resetLearner(state, learnerId, confirmed) {
  if (!confirmed) throw new Error('Confirmation required');
  const next = validateState(state);
  if (!ids.has(learnerId)) throw new Error('Invalid learner');
  next.learners[learnerId] = { answers: {}, reflections: {}, extensions: {} };
  return next;
}
export function stats(state, learnerId) {
  const s = validateState(state).learners[learnerId];
  if (!s) throw new Error('Invalid learner');
  const answers = Object.values(s.answers);
  const attempted = answers.length;
  const correct = answers.filter(a => a.correct).length;
  const firstTry = answers.filter(a => a.firstTry).length;
  const improved = answers.filter(a => a.correct && a.attempts > 1).length;
  const reflections = Object.values(s.reflections).filter(x => x.length >= 10).length;
  const xp = correct * 10 + reflections * 5;
  return { attempted, correct, firstTry, improved, reflections, xp, goal: Math.min(correct, 4), goalTotal: 4 };
}
export function unitComplete(state, learnerId, unitId) {
  const s = validateState(state).learners[learnerId];
  const u = units[unitId];
  return [...u.practice, u.challenge].every(q => s.answers[q.id]?.correct) && (s.reflections[unitId]?.length ?? 0) >= 10;
}
export function load(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return { state: raw ? validateState(JSON.parse(raw)) : emptyState(), error: null };
  } catch { return { state: emptyState(), error: 'No se pudo leer el progreso guardado. Puedes importar una copia de seguridad.' }; }
}
export function save(storage, state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(validateState(state)));
}
export function importBackup(raw) { return validateState(JSON.parse(raw)); }
export function exportBackup(state) { return JSON.stringify(validateState(state), null, 2); }
export function questionById(id) { return questions[id]; }
