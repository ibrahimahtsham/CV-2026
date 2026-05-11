/* ── DOM helper ───────────────────────────────────────────────── */
export function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'open' && v) e.open = true;
    else e.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (c == null) return;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return e;
}

/* ── Role filtering ───────────────────────────────────────────── */
export function isVisible(entry, role) {
  if (role === 'all') return true;
  return Array.isArray(entry.roles) && entry.roles.includes(role);
}

export function getTags(entry, role) {
  if (!entry.tags) return [];
  if (Array.isArray(entry.tags)) return entry.tags;
  return entry.tags[role] || entry.tags['all'] || [];
}

/* ── Experience duration ──────────────────────────────────────── */
function parseYearMonth(str) {
  if (!str) return null;
  const [y, m] = str.split('-').map(Number);
  return new Date(y, m - 1, 1);
}

export function calcExperience(entries, role) {
  const relevant = entries.filter(e => isVisible(e, role));
  if (!relevant.length) return null;
  const starts = relevant.map(e => parseYearMonth(e.periodStart)).filter(Boolean);
  if (!starts.length) return null;
  const earliest = new Date(Math.min(...starts.map(d => d.getTime())));
  // Use today only if any entry is still ongoing; otherwise use the latest end date
  const hasOngoing = relevant.some(e => e.periodEnd === null || e.periodEnd === undefined);
  let end;
  if (hasOngoing) {
    end = new Date();
  } else {
    const ends = relevant.map(e => parseYearMonth(e.periodEnd)).filter(Boolean);
    end = ends.length ? new Date(Math.max(...ends.map(d => d.getTime()))) : new Date();
  }
  let months = (end.getFullYear() - earliest.getFullYear()) * 12 + (end.getMonth() - earliest.getMonth());
  if (months < 1) months = 1;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  if (yrs === 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (rem === 0) return `${yrs} year${yrs > 1 ? 's' : ''}`;
  return `${yrs} year${yrs > 1 ? 's' : ''} ${rem} month${rem > 1 ? 's' : ''}`;
}

export function entryDuration(entry) {
  const start = parseYearMonth(entry.periodStart);
  if (!start) return null;
  const end = (entry.periodEnd === null || entry.periodEnd === undefined)
    ? new Date()
    : parseYearMonth(entry.periodEnd);
  if (!end) return null;
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 1) return null;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  if (yrs === 0) return `${months} mo`;
  if (rem === 0) return `${yrs} yr`;
  return `${yrs} yr ${rem} mo`;
}

export function injectExperience(text, expStr) {
  return text.replace(/\{experience\}/g, expStr || 'significant experience');
}

/* ── Shared UI fragments ──────────────────────────────────────── */
export function sectionHeader(title) {
  const div = el('div', { class: 'section-header' });
  div.appendChild(el('h2', {}, title));
  div.appendChild(el('div', { class: 'section-line' }));
  return div;
}

export function tagRow(tags) {
  if (!tags || !tags.length) return null;
  const row = el('div', { class: 'tag-row' });
  tags.forEach(t => row.appendChild(el('span', { class: 'tag' }, t)));
  return row;
}
