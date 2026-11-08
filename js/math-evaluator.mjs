// Exact rational arithmetic: spelling changes must not change mathematical value.
const numberPattern = '[+-]?(?:\\d+\\s+\\d+\\s*\\/\\s*\\d+|\\d+\\s*\\/\\s*\\d+|(?:\\d+(?:[.,]\\d+)?|[.,]\\d+))';
const unitTables = {
  time: { h: 3600, hora: 3600, horas: 3600, hr: 3600, hrs: 3600, m: 60, min: 60, mins: 60, minuto: 60, minutos: 60, s: 1, seg: 1, segundo: 1, segundos: 1 },
  length: { km: 1000000, kilometro: 1000000, kilometros: 1000000, m: 1000, metro: 1000, metros: 1000, dm: 100, decimetro: 100, decimetros: 100, cm: 10, centimetro: 10, centimetros: 10, mm: 1, milimetro: 1, milimetros: 1 },
  mass: { kg: 1000000, kilogramo: 1000000, kilogramos: 1000000, g: 1000, gramo: 1000, gramos: 1000, mg: 1, miligramo: 1, miligramos: 1 },
  capacity: { l: 1000, litro: 1000, litros: 1000, ml: 1, mililitro: 1, mililitros: 1 }
};
const add = (a, b) => [a[0] * b[1] + b[0] * a[1], a[1] * b[1]];
const scale = (a, n) => [a[0] * BigInt(n), a[1]];
function rational(text) {
  const s = text.replace(/,/g, '.').trim();
  const mixed = s.match(/^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const d = BigInt(mixed[3]);
    if (!d) return null;
    const n = BigInt(mixed[1]);
    return [n * d + (mixed[1].startsWith('-') ? -1n : 1n) * BigInt(mixed[2]), d];
  }
  const fraction = s.match(/^([+-]?\d+)\s*\/\s*(\d+)$/);
  if (fraction) return BigInt(fraction[2]) ? [BigInt(fraction[1]), BigInt(fraction[2])] : null;
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(s)) return null;
  const places = s.split('.')[1]?.length || 0;
  return [BigInt(s.replace('.', '')), 10n ** BigInt(places)];
}
function parse(input, expected) {
  if (typeof input !== 'string' || input.length > 160) return null;
  const s = input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!s) return null;
  if (expected.dimension === 'clock') {
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    return m && +m[1] < 24 && +m[2] < 60 ? [BigInt(+m[1] * 60 + +m[2]), 1n] : null;
  }
  const bare = rational(s);
  const table = unitTables[expected.dimension];
  if (bare) return scale(bare, table?.[expected.unit] ?? 1);
  if (expected.dimension === 'number' && s.endsWith('%')) {
    const value = rational(s.slice(0, -1));
    return value ? [value[0], value[1] * 100n] : null;
  }
  const units = table || Object.fromEntries((expected.labels || []).map(x => [x, 1]));
  if (!Object.keys(units).length) return null;
  const token = new RegExp(`(${numberPattern})\\s*([a-z]+)\\.?`, 'y');
  let offset = 0, result = [0n, 1n], count = 0;
  while (offset < s.length) {
    token.lastIndex = offset;
    const match = token.exec(s);
    if (!match || !Object.hasOwn(units, match[2])) return null;
    const value = rational(match[1]);
    if (!value || (count && /^[+-]/.test(match[1]))) return null;
    result = add(result, scale(value, units[match[2]]));
    offset = token.lastIndex;
    count++;
    if (offset === s.length) break;
    // A conjunction or whitespace separates quantities; never ignore trailing text.
    const separator = s.slice(offset).match(/^(?:\s*y\s*|\s+)/);
    if (!separator && !/\d/.test(s[offset])) return null;
    offset += separator?.[0].length || 0;
    if (offset === s.length) return null;
  }
  return result;
}
export function evaluate(expected, input) {
  const actual = parse(input, expected);
  const target = parse(String(expected.value), expected);
  if (!actual || !target) return { correct: false, status: 'format', message: 'No se pudo interpretar la respuesta. Usa cifras, una fracción como 2/5 o una cantidad con sus unidades; no hace falta copiar un formato exacto.' };
  const correct = actual[0] * target[1] === target[0] * actual[1];
  return { correct, status: correct ? 'correct' : 'value', message: correct ? 'Correcto: tu respuesta es matemáticamente equivalente.' : 'El valor no coincide. Revisa el procedimiento y las unidades.' };
}
