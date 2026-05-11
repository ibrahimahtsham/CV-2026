import { el, calcExperience } from './helpers.js';
import { buildHeader, buildIntro, buildExperience, buildProjects,
         buildEducation, buildCertifications, buildSkills, buildLanguages } from './builder.js';
import { generatePrintHTML } from './print.js';

/* ── Role nav ─────────────────────────────────────────────────── */
function buildRoleNav(availableRoles, currentRole) {
  const nav = document.getElementById('role-nav');
  nav.innerHTML = '';
  // Hide nav on shared role links — recipients shouldn't see other roles
  if (currentRole !== 'all') { nav.style.display = 'none'; return; }
  nav.style.display = '';
  nav.appendChild(el('span', { class: 'nav-label' }, 'Role:'));

  function makeBtn(label, roleValue) {
    const url = new URL(window.location.href);
    roleValue === 'all' ? url.searchParams.delete('role') : url.searchParams.set('role', roleValue);
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

/* ── Interactivity (wired after each render) ──────────────────── */
function attachInteractivity(data, role) {
  // Dark mode toggle — class already applied by inline script in index.html
  const toggle = document.getElementById('dark-toggle');
  toggle.textContent = document.body.classList.contains('dark-mode') ? '\u2600\ufe0f' : '\ud83c\udf19';
  toggle.onclick = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggle.textContent = isDark ? '\u2600\ufe0f' : '\ud83c\udf19';
    localStorage.setItem('cv-theme', isDark ? 'dark' : 'light');
  };

  // Expand / collapse all
  const expandBtn = document.getElementById('expand-btn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      const all = [...document.querySelectorAll('details')];
      const allOpen = all.every(d => d.open);
      all.forEach(d => { d.open = !allOpen; });
      expandBtn.textContent = allOpen ? '\u2295 Expand all' : '\u2296 Collapse all';
    });
  }

  // Print / Save PDF
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const html = generatePrintHTML(data, role);
      const w = window.open('', '_blank');
      if (!w) { alert('Allow pop-ups to open the print view.'); return; }
      w.document.write(html);
      w.document.close();
    });
  }
}

/* ── Main render ──────────────────────────────────────────────── */
function render(data, role) {
  const isKnownRole = role === 'all' || data.availableRoles.includes(role);
  const activeRole = isKnownRole ? role : 'all';
  const roleData = data.roles[activeRole] || data.roles['all'];

  document.title = activeRole === 'all'
    ? `${data.meta.name} CV`
    : `${data.meta.name} ${activeRole} CV`;

  buildRoleNav(data.availableRoles, activeRole);
  buildHeader(data.meta, roleData);

  const body = document.getElementById('cv-body');
  body.innerHTML = '';

  if (!isKnownRole) {
    body.appendChild(el('p', { class: 'role-unknown-notice' },
      `Unknown role "${role}" — showing full CV.`));
  }

  const controls = el('div', { class: 'top-controls' });
  controls.appendChild(el('button', { id: 'expand-btn' }, '\u2295 Expand all'));
  controls.appendChild(el('button', { id: 'print-btn' }, 'Print / Save PDF'));
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

  attachInteractivity(data, activeRole);
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

function init() {
  const role = new URLSearchParams(window.location.search).get('role') || 'all';
  if (cachedData) { render(cachedData, role); return; }
  loadData()
    .then(data => { cachedData = data; render(data, role); })
    .catch(err => {
      document.getElementById('cv-body').innerHTML =
        `<p style="color:red;padding:20px;">Failed to load CV data: ${err.message}</p>`;
    });
}

window.addEventListener('popstate', init);

// Animated <details> toggle — intercept clicks so close also transitions
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

// Force all <details> open for Ctrl+P — registered once at module level
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
