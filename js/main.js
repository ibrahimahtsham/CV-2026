import { el, calcExperience } from './helpers.js';
import { buildHeader, buildIntro, buildExperience, buildProjects,
         buildEducation, buildCertifications, buildSkills, buildLanguages } from './builder.js';

/* ── Theme toggle icons (inline SVG, not emoji) ──────────────────── */
const MOON_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
const SUN_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';

/* ── Role nav ─────────────────────────────────────────────────── */
function buildRoleNav(availableRoles, currentRole) {
  const nav = document.getElementById('role-nav');
  nav.innerHTML = '';
  // Hide nav on shared role links - recipients shouldn't see other roles
  if (currentRole !== 'all') { nav.style.display = 'none'; return; }
  nav.style.display = '';
  nav.appendChild(el('span', { class: 'nav-label' }, 'Role:'));

  function makeBtn(label, roleValue) {
    const url = new URL(window.location.href);
    url.searchParams.set('role', roleValue);
    const btn = el('a', {
      class: 'role-btn' + (currentRole === roleValue ? ' active' : ''),
      href: url.toString()
    }, label);
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.history.pushState({}, '', url.toString());
      init();
    });
    return btn;
  }
  nav.appendChild(makeBtn('All', 'all'));
  availableRoles.forEach(r => nav.appendChild(makeBtn(r, r)));
}

/* ── Landing picker: view format, then role. Full pages, not a modal -
   shown only when the URL has no ?role= at all. Nothing here is saved;
   a direct ?role= link always skips straight to the styled CV. ────── */
function pickerOption(title, tag, desc, plain, onClick) {
  const btn = el('button', { class: 'mode-option' + (plain ? ' mode-option-plain' : ''), type: 'button' });
  const titleRow = el('div', { class: 'mode-option-title' }, title);
  if (tag) titleRow.appendChild(el('span', { class: 'mono-tag' }, tag));
  btn.appendChild(titleRow);
  btn.appendChild(el('div', { class: 'mode-option-desc' }, desc));
  btn.addEventListener('click', onClick);
  return btn;
}

function clearForPicker() {
  document.getElementById('role-nav').style.display = 'none';
  const header = document.getElementById('cv-header');
  header.style.display = 'none';
  header.innerHTML = '';
  document.getElementById('cv-body').innerHTML = '';
}

function showModeScreen(data) {
  clearForPicker();
  const screen = el('div', { class: 'picker-screen' });
  screen.appendChild(el('div', { class: 'picker-eyebrow' }, 'Step 1 of 2'));
  screen.appendChild(el('h1', { class: 'picker-title' }, 'How would you like to view this CV?'));
  const options = el('div', { class: 'picker-options' });
  options.appendChild(pickerOption('ATS-friendly view', 'plain text',
    'Plain single-column formatting that matches what applicant tracking systems see. A separate, unstyled page.',
    true, () => showRoleScreen(data, 'ats')));
  options.appendChild(pickerOption('Styled view', 'default',
    'The full visual design: expandable cards, colour, dark mode. Best for browsing on screen.',
    false, () => showRoleScreen(data, 'styled')));
  screen.appendChild(options);
  document.getElementById('cv-body').appendChild(screen);
  attachInteractivity();
}

function showRoleScreen(data, mode) {
  clearForPicker();
  const screen = el('div', { class: 'picker-screen' });
  screen.appendChild(el('div', { class: 'picker-eyebrow' }, 'Step 2 of 2'));
  screen.appendChild(el('h1', { class: 'picker-title' }, 'Which role should it focus on?'));
  const options = el('div', { class: 'picker-options' });
  const roleOption = (label, roleKey) => {
    const subtitle = (data.roles[roleKey] || {}).subtitle || '';
    const expStr = calcExperience(data.experience, roleKey);
    options.appendChild(pickerOption(label, expStr, subtitle, mode === 'ats', () => chooseRole(data, mode, roleKey)));
  };
  roleOption('All', 'all');
  data.availableRoles.forEach(r => roleOption(r, r));
  screen.appendChild(options);
  document.getElementById('cv-body').appendChild(screen);
  attachInteractivity();
}

function chooseRole(data, mode, role) {
  if (mode === 'ats') {
    const params = new URLSearchParams();
    if (role !== 'all') params.set('role', role);
    window.location.href = 'ats.html' + (params.toString() ? '?' + params.toString() : '');
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.set('role', role);
  window.history.pushState({}, '', url.toString());
  render(data, role);
}

/* ── Interactivity (wired after each render) ──────────────────── */
function attachInteractivity() {
  // Dark mode toggle - class already applied by inline script in index.html
  const toggle = document.getElementById('dark-toggle');
  toggle.innerHTML = document.body.classList.contains('dark-mode') ? SUN_ICON : MOON_ICON;
  toggle.onclick = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggle.innerHTML = isDark ? SUN_ICON : MOON_ICON;
    localStorage.setItem('cv-theme', isDark ? 'dark' : 'light');
  };

  // Expand / collapse all
  const expandBtn = document.getElementById('expand-btn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      const all = [...document.querySelectorAll('details')];
      const allOpen = all.every(d => d.open);
      all.forEach(d => { d.open = !allOpen; });
      expandBtn.textContent = allOpen ? '⊕ Expand all' : '⊖ Collapse all';
    });
  }
}

/* ── Main render (styled view) ───────────────────────────────────── */
function render(data, role) {
  const isKnownRole = role === 'all' || data.availableRoles.includes(role);
  const activeRole = isKnownRole ? role : 'all';
  const roleData = data.roles[activeRole] || data.roles['all'];

  document.title = activeRole === 'all'
    ? `${data.meta.name} CV`
    : `${data.meta.name} ${activeRole} CV`;

  buildRoleNav(data.availableRoles, activeRole);

  const header = document.getElementById('cv-header');
  header.style.display = '';
  buildHeader(data.meta, roleData);

  const body = document.getElementById('cv-body');
  body.innerHTML = '';

  if (!isKnownRole) {
    body.appendChild(el('p', { class: 'role-unknown-notice' },
      `Unknown role "${role}", showing full CV.`));
  }

  const printParams = new URLSearchParams();
  if (activeRole !== 'all') printParams.set('role', activeRole);
  printParams.set('print', '1');

  const controls = el('div', { class: 'top-controls' });
  controls.appendChild(el('button', { id: 'expand-btn' }, '⊕ Expand all'));
  controls.appendChild(el('a', {
    id: 'print-btn',
    href: `ats.html?${printParams.toString()}`,
    target: '_blank',
    rel: 'noopener',
  }, 'Print / Save PDF'));
  body.appendChild(controls);

  const expStr = calcExperience(data.experience, activeRole);
  [
    buildIntro(roleData, expStr),
    buildExperience(data.experience, activeRole),
    buildProjects(data.projects, activeRole),
    buildEducation(data.education),
    buildCertifications(data.certifications, activeRole),
    buildSkills(data.skills, activeRole),
    buildLanguages(data.languages),
  ].forEach(sec => { if (sec) body.appendChild(sec); });

  attachInteractivity();
}

/* ── Init & routing ───────────────────────────────────────────── */
let cachedData = null;

const DATA_FILES = ['meta', 'roles', 'experience', 'projects', 'education', 'certifications', 'skills', 'languages'];

function loadData() {
  return Promise.all(
    DATA_FILES.map(f =>
      fetch(`data/${f}.json`).then(r => { if (!r.ok) throw new Error(`${f}.json: ${r.status}`); return r.json(); })
    )
  ).then(([meta, { availableRoles, roles }, experience, projects, education, certifications, skills, languages]) =>
    ({ meta, availableRoles, roles, experience, projects, education, certifications, skills, languages })
  );
}

// A direct ?role= link (shared, bookmarked, or set by in-app navigation)
// always renders the styled CV immediately. No param at all means a fresh
// landing - show the view/role picker instead.
function init() {
  const params = new URLSearchParams(window.location.search);
  const hasRole = params.has('role');
  const role = params.get('role') || 'all';

  const proceed = data => {
    if (hasRole) render(data, role);
    else showModeScreen(data);
  };

  if (cachedData) { proceed(cachedData); return; }
  loadData()
    .then(data => { cachedData = data; proceed(data); })
    .catch(err => {
      document.getElementById('cv-body').innerHTML =
        `<p style="color:red;padding:20px;">Failed to load CV data: ${err.message}</p>`;
    });
}

window.addEventListener('popstate', init);

// Animated <details> toggle - intercept clicks so close also transitions
// The CSS grid trick only animates open; without this, close snaps instantly.
document.addEventListener('click', e => {
  const summary = e.target.closest('summary');
  if (!summary) return;
  e.preventDefault();
  const details = summary.closest('details');
  if (!details) return;
  const body = details.querySelector('.details-body');
  if (!body) { details.open = !details.open; return; }

  if (details.open) {
    // Animate to closed: override grid row, wait for transition, then remove open
    body.style.gridTemplateRows = '0fr';
    body.addEventListener('transitionend', () => {
      details.open = false;
      body.style.gridTemplateRows = '';
    }, { once: true });
  } else {
    // CSS handles open animation: set open, selector kicks in, 0fr→1fr transitions
    details.open = true;
  }
});

// Force all <details> open for Ctrl+P - registered once at module level
const _printWasOpen = new WeakMap();
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details').forEach(d => { _printWasOpen.set(d, d.open); d.open = true; });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach(d => {
    if (_printWasOpen.has(d)) { d.open = _printWasOpen.get(d); _printWasOpen.delete(d); }
  });
});

document.addEventListener('DOMContentLoaded', init);
