const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
let core, content;
test.before(async () => { core = await import('../js/core.mjs'); content = await import('../js/content.mjs'); });
test('all six original units have a complete learning path and stable unique questions', () => {
  assert.equal(Object.keys(content.units).length, 6);
  const ids = [];
  for (const unit of Object.values(content.units)) {
    for (const key of ['scenario','why','example','extension','reflection','roadmap']) assert.ok(unit[key].length > 30, key);
    assert.equal(unit.practice.length, 3);
    for (const q of [...unit.practice, unit.challenge]) {
      assert.ok(q.id && q.question && q.hint && q.explain);
      assert.ok(q.answer >= 0 && q.answer < q.choices.length);
      ids.push(q.id);
    }
  }
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(content.profiles.map(p => p.subjects.length), [4,2]);
});
test('scoring and first attempt are honest, retries do not farm points', () => {
  let s = core.emptyState();
  assert.equal(core.score('m6-p1', 1), true);
  assert.equal(core.score('m6-p1', 0), false);
  s = core.answer(s, 'learner-a', 'm6-p1', 0);
  assert.equal(core.stats(s,'learner-a').xp, 0);
  s = core.answer(s, 'learner-a', 'm6-p1', 1);
  assert.deepEqual([core.stats(s,'learner-a').correct,core.stats(s,'learner-a').firstTry,core.stats(s,'learner-a').improved], [1,0,1]);
  s = core.answer(s, 'learner-a', 'm6-p1', 1);
  assert.equal(core.stats(s,'learner-a').xp, 10);
  assert.equal(s.learners['learner-a'].answers['m6-p1'].attempts, 2);
  assert.equal(core.stats(s,'learner-b').xp, 0);
});
test('hint prevents first-try badge, not correctness or points', () => {
  const s = core.answer(core.emptyState(),'learner-a','m6-p2',0,true);
  assert.equal(core.stats(s,'learner-a').firstTry, 0);
  assert.equal(core.stats(s,'learner-a').xp, 10);
});
test('completion needs four correct answers and meaningful reflection', () => {
  let s = core.emptyState();
  for (const q of [...content.units.math3.practice,content.units.math3.challenge]) s = core.answer(s,'learner-b',q.id,q.answer);
  assert.equal(core.unitComplete(s,'learner-b','math3'),false);
  s = core.reflect(s,'learner-b','math3','I used place values.');
  assert.equal(core.unitComplete(s,'learner-b','math3'),true);
  assert.equal(core.stats(s,'learner-b').xp,45);
  s = core.reflect(s,'learner-b','math3','A longer explanation about place values.');
  assert.equal(core.stats(s,'learner-b').xp,45);
});
test('save/reload/export/import roundtrip and corrupt backup rejection', () => {
  const box = new Map();
  const storage = { getItem:k => box.get(k) ?? null, setItem:(k,v) => box.set(k,v) };
  let s = core.answer(core.emptyState(),'learner-b','e3-p1',1);
  core.save(storage,s);
  assert.deepEqual(core.load(storage).state,s);
  assert.deepEqual(core.importBackup(core.exportBackup(s)),s);
  const before = core.exportBackup(s);
  assert.throws(() => core.importBackup('{bad'));
  assert.throws(() => core.importBackup(JSON.stringify({version:1,learners:{}})));
  assert.equal(core.exportBackup(s),before);
  storage.setItem(core.STORAGE_KEY,'{bad');
  assert.ok(core.load(storage).error);
  assert.equal(core.stats(core.load(storage).state,'learner-b').xp,0);
});
test('cross-profile answers rejected and reset requires confirmation', () => {
  const s = core.answer(core.emptyState(),'learner-a','m6-p1',1);
  assert.throws(() => core.answer(s,'learner-b','m6-p2',0));
  assert.throws(() => core.resetLearner(s,'learner-a',false));
  const next = core.resetLearner(s,'learner-a',true);
  assert.equal(core.stats(next,'learner-a').xp,0);
  assert.equal(core.stats(s,'learner-a').xp,10);
});
test('import rejects forged scores and malformed nested data without replacing state', () => {
  const original = core.answer(core.emptyState(), 'learner-a', 'm6-p1', 1);
  const mutate = change => {
    const copy = structuredClone(original);
    change(copy);
    assert.throws(() => core.importBackup(JSON.stringify(copy)));
    assert.equal(core.stats(original, 'learner-a').xp, 10);
  };
  mutate(s => { s.learners['learner-a'].answers['m6-p1'].tried = [0]; });
  mutate(s => { s.learners['learner-a'].answers['m6-p1'].firstTry = false; });
  mutate(s => { s.learners['learner-a'].answers['m6-p1'].tried = [1, 0]; s.learners['learner-a'].answers['m6-p1'].attempts = 2; });
  mutate(s => { s.learners['learner-a'].answers = []; });
  mutate(s => { s.learners['learner-a'].reflections = []; });
  mutate(s => { s.learners['learner-a'].reflections.math6 = '          '; });
  mutate(s => { s.learners['learner-b'].answers['m6-p1'] = original.learners['learner-a'].answers['m6-p1']; });
});
test('storage failures are surfaced and never mistaken for a saved result', () => {
  const unavailable = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
  assert.ok(core.load(unavailable).error);
  assert.throws(() => core.save(unavailable, core.emptyState()), /full/);
});
test('all local routes exist and exam loads the upgraded shared evaluator', () => {
  const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
  for (const route of ['css/style.css','js/app.mjs','activities/matematica-6to.html']) {
    assert.ok(html.includes(route)); assert.ok(fs.existsSync(path.join(root,route)));
  }
  const exam = fs.readFileSync(path.join(root,'activities/matematica-6to.html'));
  assert.match(exam.toString(), /src="..\/js\/contest-exam.mjs"/);
  const examScript = fs.readFileSync(path.join(root,'js/contest-exam.mjs'),'utf8');
  assert.match(examScript, /evaluate\(q.expected/);
  assert.doesNotMatch(examScript, /function normalize/);
  assert.ok(fs.existsSync(path.join(root,'activities/preparacion-concurso.html')));
});

test('advanced responses roundtrip and stay isolated by learner', () => {
  let s = core.extend(core.emptyState(), 'learner-a', 'math6', 'Four equal groups need a divisible total.');
  assert.equal(s.learners['learner-a'].extensions.math6, 'Four equal groups need a divisible total.');
  assert.deepEqual(core.importBackup(core.exportBackup(s)), s);
  assert.deepEqual(s.learners['learner-b'].extensions, {});
  assert.throws(() => core.extend(s, 'learner-b', 'math6', 'Wrong subject'));
  s = core.resetLearner(s, 'learner-a', true);
  assert.deepEqual(s.learners['learner-a'].extensions, {});
});
test('English answer positions vary and learning instructions are Spanish', () => {
  for (const id of ['english3', 'english6']) {
    const u = content.units[id];
    const answers = [...u.practice, u.challenge].map(q => q.answer);
    assert.ok(new Set(answers).size >= 3);
    assert.match(u.why, /sirve|saludo/i);
    assert.match(u.extension, /Escribe|Dibuja/);
    assert.ok(u.extensionCriteria.length > 20);
  }
});
test('subject apartados and existing exam route are present', () => {
  const app = fs.readFileSync(path.join(root, 'js/app.mjs'), 'utf8');
  assert.match(app, /data-section=\"study\"/);
  assert.match(app, /data-section=\"deeper\"/);
  assert.match(app, /href=\"activities\/matematica-6to.html\"/);
  assert.match(app, /extensionDraft/);
});
