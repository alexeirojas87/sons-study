import { charts } from './contest-content.mjs';
export const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function chartHtml(id) {
  const chart = charts[id];
  if (!chart) return '';
  const ticks = Array.from({length:chart.max/chart.step+1},(_,i)=>i*chart.step);
  return `<figure class="visual"><figcaption><strong>${escapeHtml(chart.title)}</strong><p class="small">Unidad: ${escapeHtml(chart.unit)}. Escala: cada intervalo representa ${chart.step}.</p></figcaption><div role="img" aria-label="${escapeHtml(chart.title)}: ${chart.rows.map(([label,value])=>`${escapeHtml(label)} ${value} ${chart.unit}`).join('; ')}"><div class="chart-axis" aria-hidden="true">${ticks.map(t=>`<span>${t}</span>`).join('')}</div>${chart.rows.map(([label,value])=>`<div class="barrow"><span class="who">${escapeHtml(label)}</span><div class="bartrack" style="background-size:${chart.step/chart.max*100}% 100%"><div class="barfill" style="width:${value/chart.max*100}%"></div></div><span class="val">${value}</span></div>`).join('')}</div></figure>`;
}
