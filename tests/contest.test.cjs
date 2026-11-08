const test = require('node:test');
const assert = require('node:assert/strict');
let evaluate;
test.before(async () => { ({ evaluate } = await import('../js/math-evaluator.mjs')); });
const duration = { value: '145', dimension: 'time', unit: 'min' };
test('natural durations and unit aliases are equivalent', () => {
  for (const a of ['2 horas y 25 minutos','2h y 25m','145 minutos','2 h 25 min','8700 segundos','145']) assert.equal(evaluate(duration,a).correct,true,a);
  assert.equal(evaluate({...duration,value:'155'},'2 horas y 35 minutos').correct,true);
});
test('wrong dimensions and garbage never disappear', () => {
  for (const a of ['145 horas','145 metros','145 patatas','145 minutos basura','145 minutos o 144 minutos','','NaN','1/0','145 minutos y','145 minutos 5']) assert.equal(evaluate(duration,a).correct,false,a);
});
test('fractions decimals and percentages compare exact values', () => {
  const expected = {value:'2/5',dimension:'number'};
  for(const a of ['2/5','4/10','0.4','0,4','40%']) assert.equal(evaluate(expected,a).correct,true,a);
  for(const a of ['2/0','0.4001','2/5 litros','0.4xyz']) assert.equal(evaluate(expected,a).correct,false,a);
});
test('units preserve dimensions and scale, including contextual m', () => {
  assert.equal(evaluate({value:'80',dimension:'length',unit:'cm'},'0,8 metros').correct,true);
  assert.equal(evaluate({value:'80',dimension:'length',unit:'cm'},'80 minutos').correct,false);
  assert.equal(evaluate(duration,'145 m').correct,true);
  assert.equal(evaluate({value:'60',dimension:'capacity',unit:'l'},'60000 ml').correct,true);
});

test('compact units, mixed numbers, clocks and parser bounds', () => {
  assert.equal(evaluate(duration,'2h25m').correct,true);
  assert.equal(evaluate({value:'3/2',dimension:'number'},'1 1/2').correct,true);
  assert.equal(evaluate({value:'20:35',dimension:'clock'},'20:35').correct,true);
  for(const input of ['20:75','24:35','20.35']) assert.equal(evaluate({value:'20:35',dimension:'clock'},input).correct,false);
  assert.equal(evaluate(duration,'1'.repeat(170)).status,'format');
  assert.equal(evaluate(duration,'145 minutos y').status,'format');
  assert.equal(evaluate(duration,'144 minutos').status,'value');
});

test('all 36 original questions have independently calculated answer fixtures', async () => {
  const {diagnostic,practice,mock} = await import('../js/contest-content.mjs');
  const answers = [
    // Diagnostic: calculation, graph totals, lengths, movement time, inverse fractions.
    String(180-(48/(6+2)*5+3**2)), String((5*24-18)/6), '44/70', String((16+24+20)/3-10),
    `${360-8*35} cm`, `${60+35+50} min`, `${30/(2/3*3/4)} l`, '12/40',
    // Practice: 4 per topic. Clock duration independently summed as minutes.
    String(96/(4+2)*3-2**3), String((7*18-14)/8), String((11*6-18)/4), String((2*48+36+12)/8*3),
    String(25+20+30), '35/90', String(24*5-90), String(90-30/3-25*2/5),
    `${2400-850} m`, `${Math.floor((18*60+45+110)/60)}:${(18*60+45+110)%60}`, `${2500-6*300} g`, String((3000-8*250)/200),
    `${64*(1-3/8)} km`, '27/45', String(36/3*5), String(12*3/3*4),
    // Mock: use integer decompositions to avoid introducing decimal approximation.
    String(240-(72/(3*(5-2))+4**2*3)), String((9*16-12)*3/4/9), String((68/4-7)*3),
    `${(40+60+30+50)/4*2/3} l`, '30/180', String(50/(2.5*4/5)),
    `${3*1250-2850} m`, `${70+85-20} min`, String((1500+750)*2/3/250),
    String(72/2*5), '90 km', '18/45'
  ];
  const all = [...diagnostic,...practice,...mock];
  assert.equal(all.length,36); assert.equal(answers.length,36);
  all.forEach((q,i)=>assert.equal(evaluate(q.expected,answers[i]).correct,true,`${q.id}: ${answers[i]}`));
  assert.equal(new Set(all.map(q=>q.id)).size,36);
  for(const q of all){ assert.ok(q.steps.length>=2); assert.ok(q.mistake.length>30); assert.ok(q.hint.length>15); }
});

test('all topics have scaffolded practice and balanced distinct assessments',async()=>{
  const {diagnostic,practice,mock,topics,lessons,sessions,storageKey,getSession} = await import('../js/contest-content.mjs');
  for(const topic of Object.keys(topics)){
    assert.equal(diagnostic.filter(q=>q.topicId===topic).length,2);
    assert.equal(practice.filter(q=>q.topicId===topic).length,4);
    assert.equal(mock.filter(q=>q.topicId===topic).length,3);
    assert.deepEqual(practice.filter(q=>q.topicId===topic).map(q=>q.level),['Con ayuda','Por tu cuenta','Reto','Concurso']);
    assert.ok(lessons.find(l=>l.id===topic).explain.length>=2);
  }
  const keys=Object.keys(sessions).map(storageKey);
  assert.equal(new Set(keys).size,6);
  assert.ok(keys.every(k=>!k.includes('ipad_v2')));
  assert.equal(storageKey('unknown'),storageKey('mock'));
  for(const id of ['unknown','__proto__','constructor']) assert.equal(getSession(id),sessions.mock);
  assert.ok(!mock.some(q=>diagnostic.some(d=>d.q===q.q)));
});

test('charts include scale, accessible values and question-specific datasets',async()=>{
  const {chartHtml} = await import('../js/contest-visuals.mjs');
  const {charts,diagnostic,practice,mock} = await import('../js/contest-content.mjs');
  for(const [id,c] of Object.entries(charts)){
    const html=chartHtml(id);
    assert.match(html,/role="img"/);assert.match(html,/aria-label/);assert.ok(html.includes('Escala:'));
    for(const [label,value] of c.rows){assert.ok(html.includes(label));assert.ok(html.includes(`>${value}</span>`));}
    assert.ok(c.rows.every(([,v])=>v<=c.max));
  }
  assert.equal(new Set([...diagnostic,...practice,...mock].filter(q=>q.chart).map(q=>q.chart)).size,3);
});

test('integration preserves old progress and has neutral preparation entry points',()=>{
  const fs=require('node:fs'), path=require('node:path');
  const root=path.resolve(__dirname,'..');
  const ui=fs.readFileSync(path.join(root,'js/contest-exam.mjs'),'utf8');
  assert.match(ui,/sessionStorageKey\(requestedSession\)/);
  assert.doesNotMatch(ui,/removeItem|\.clear\(/);
  assert.doesNotMatch(ui,/at>=9|i>=9|function normalize/);
  assert.match(ui,/chartHtml\(q.chart\)/);
  for(const file of ['index.html','js/app.mjs']) assert.match(fs.readFileSync(path.join(root,file),'utf8'),/preparacion-concurso.html/);
  const landing=fs.readFileSync(path.join(root,'activities/preparacion-concurso.html'),'utf8');
  assert.match(landing,/martes 10 de noviembre de 2026/);
  for(const day of ['DOMINGO 8','LUNES 9','MARTES 10']) assert.ok(landing.includes(day));
  assert.doesNotMatch(landing,/SÁBADO 7|Si el sábado/);
  assert.match(landing,/120 minutos de trabajo/);
  assert.match(landing,/No es necesario completar los 36 problemas/);
});
