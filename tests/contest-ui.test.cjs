const test = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

// A small DOM boundary harness tests real controller code without adding dependencies.
async function mount(session, box = new Map()) {
  const elements = new Map();
  const ctx = new Proxy({}, {get:(target,key)=>target[key]||(()=>{}),set:(target,key,value)=>(target[key]=value,true)});
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, value:'', textContent:'', innerHTML:'', style:{}, hidden:false, listeners:{},
      classList:{toggle(){}}, addEventListener(type, fn){this.listeners[type]=fn},
      setAttribute(){}, getContext:()=>ctx, getBoundingClientRect:()=>({width:900,height:360,left:0,top:0}),
      setPointerCapture(){}, toDataURL:()=> 'data:image/png;base64,AA==',
      click(){ if(this.onclick)this.onclick(); if(this.listeners.click)this.listeners.click({}); }
    });
    return elements.get(id);
  }
  global.document={getElementById:element,createElement:tag=>element(`created-${tag}`)};
  global.window={devicePixelRatio:1,scrollTo(){},addEventListener(){}};
  global.location={search:`?session=${session}`};
  global.ResizeObserver=class{observe(){}};
  global.confirm=()=>true;
  global.localStorage={getItem:k=>box.get(k)||null,setItem:(k,v)=>box.set(k,v)};
  const moduleUrl=pathToFileURL(path.resolve(__dirname,'../js/contest-exam.mjs'));
  await import(`${moduleUrl.href}?test=${Math.random()}`);
  return {element,box};
}

test('real controller grades equivalent answers, saves drawing, restores and isolates sessions',async()=>{
  const {storageKey,diagnostic} = await import('../js/contest-content.mjs');
  const old='examen_matematica_6to_ipad_v2';
  const box=new Map([[old,'old exam untouched']]);
  let {element:e}=await mount('diagnostic',box);
  assert.equal(e('practice-tools').hidden,true);
  assert.match(e('session-title').textContent,/Diagnóstico/);
  const pointer={pointerId:1,button:0,clientX:10,clientY:20,preventDefault(){},type:'pointerdown'};
  e('drawing').listeners.pointerdown(pointer);
  e('drawing').listeners.pointerup({...pointer,type:'pointerup'});
  const answers=['141','17 paquetes','44/70','10 botellas','0,8 metros','2 horas y 25 minutos','60000 ml','0.3'];
  answers.forEach(a=>{e('answer').value=a;e('answer').listeners.input();e('next').click();});
  assert.equal(e('score').textContent,'8 / 8');
  assert.match(e('reviews').innerHTML,/Error frecuente/);
  assert.match(e('reviews').innerHTML,/drawing-review/);
  assert.equal(box.get(old),'old exam untouched');
  const saved=JSON.parse(box.get(storageKey('diagnostic')));
  assert.equal(saved.finished,true); assert.equal(saved.strokes[0].length,1);
  ({element:e}=await mount('diagnostic',box));
  assert.equal(e('score').textContent,'8 / 8');
  ({element:e}=await mount('mock',box));
  assert.equal(e('answer').value,''); assert.equal(e('question').textContent.includes(diagnostic[0].q),false);
  assert.equal(box.get(old),'old exam untouched');
});

test('practice supports hints, immediate feedback, back navigation and restart',async()=>{
  const {element:e,box}=await mount('operations');
  assert.equal(e('practice-tools').hidden,false);
  assert.ok(e('hint-text').textContent.length>15);
  e('answer').value='40';e('check').click();
  assert.match(e('practice-feedback').textContent,/Correcto/);
  e('next').click();e('answer').value='14';e('next').click();e('back').click();
  assert.equal(e('answer').value,'14');
  e('restart').click();assert.equal(e('answer').value,'');
  assert.equal(e('count').textContent,'Pregunta 1 de 4');
  assert.equal(box.size,1);
});

test('invalid input is differentiated from incorrect mathematics in the review',async()=>{
  const {element:e}=await mount('operations');
  for(const answer of ['garbage','99','12','54']){e('answer').value=answer;e('next').click();}
  assert.match(e('reviews').innerHTML,/Revisa cómo está escrita la respuesta/);
  assert.match(e('reviews').innerHTML,/Revisa el cálculo/);
  assert.equal(e('score').textContent,'2 / 4');
});

test('result export includes explanations, graph values and entered answers',async()=>{
  const {element:e}=await mount('graphs');
  for(const answer of ['75 libros','35/90','30','70']){e('answer').value=answer;e('next').click();}
  let exported;
  const create=URL.createObjectURL, revoke=URL.revokeObjectURL, timer=global.setTimeout;
  URL.createObjectURL=blob=>{exported=blob;return 'blob:test'};
  URL.revokeObjectURL=()=>{};
  global.setTimeout=()=>0;
  try {e('export').click();} finally {URL.createObjectURL=create;URL.revokeObjectURL=revoke;global.setTimeout=timer;}
  const html=await exported.text();
  assert.match(html,/75 libros/);assert.match(html,/35\/90/);
  assert.match(html,/Préstamos de la biblioteca/);assert.match(html,/Escala:/);
  assert.match(html,/Error que debes evitar/);
  assert.equal(e('created-a').download,'matematica6_graphs_respuestas.html');
});

test('diagnostic selects at most two weak topics with stable ties and practice links',async()=>{
  const {storageKey}=await import('../js/contest-content.mjs');
  const correct=['141','17','22/35','10','80','145','60','3/10'];
  for(const [wrong,expected] of [
    [[0,2,4,5],['conversions','operations']],
    [[0,2,4,6],['operations','graphs']],
    [[6],['fractions']]
  ]) {
    const responses=correct.map((answer,i)=>wrong.includes(i)?'0':answer);
    const saved={responses,strokes:responses.map(()=>[]),at:7,finished:true};
    const {element:e}=await mount('diagnostic',new Map([[storageKey('diagnostic'),JSON.stringify(saved)]]));
    const html=e('bytopic').innerHTML;
    assert.match(html,/Tu siguiente práctica/);
    assert.deepEqual([...html.matchAll(/href="matematica-6to\.html\?session=([a-z]+)"/g)].map(m=>m[1]),expected);
  }
});

test('diagnostic avoids false weaknesses and other sessions do not get recommendations',async()=>{
  const {storageKey,getSession}=await import('../js/contest-content.mjs');
  for(const session of ['diagnostic','mock','operations']) {
    const responses=session==='diagnostic'?['141','17','22/35','10','80','145','60','3/10']:getSession(session).questions.map(()=> '0');
    const saved={responses,strokes:responses.map(()=>[]),at:0,finished:true};
    const {element:e}=await mount(session,new Map([[storageKey(session),JSON.stringify(saved)]]));
    const html=e('bytopic').innerHTML;
    if(session==='diagnostic') {
      assert.match(html,/No hay temas con errores/);
      assert.doesNotMatch(html,/session=(operations|graphs|conversions|fractions)/);
    } else assert.doesNotMatch(html,/Tu siguiente práctica|No hay temas con errores/);
  }
});
