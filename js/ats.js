import { isVisible, calcExperience, injectExperience, entryDuration, formatPeriod } from './helpers.js';

/* ── ats.html's own script. Genuinely separate from the styled SPA:
   no shared state, no localStorage, no buttons. Every load re-fetches
   data/*.json and re-derives everything fresh from the URL. ────────── */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* An entry with an empty roles array is archived: kept for the styled
   portfolio view, but left out of every printed CV, including the master. */
function inCv(entry, role) {
  if (role === 'all') return !(Array.isArray(entry.roles) && entry.roles.length === 0);
  return isVisible(entry, role);
}

function buildContentHTML(data, role) {
  const roleData = data.roles[role] || data.roles['all'];
  const meta = data.meta;
  const expStr = calcExperience(data.experience, role);

  const parts = [];
  const line = s => parts.push(s);

  /* ── Header ─────────────────────────────────────────────────── */
  line('<div class="cv-header">');
  line(`<h1>${esc(meta.name)}</h1><p class="subtitle">${esc(roleData.subtitle)}</p>`);
  const contacts = [
    meta.location && esc(meta.location),
    meta.phone && esc(meta.phone),
    meta.email && `<a href="mailto:${esc(meta.email)}">${esc(meta.email)}</a>`,
    meta.dob && esc(meta.dob),
    meta.linkedinDisplay && `<a href="${esc(meta.linkedin)}">${esc(meta.linkedinDisplay)}</a>`,
    meta.githubDisplay && `<a href="${esc(meta.github)}">${esc(meta.githubDisplay)}</a>`,
    meta.metaBadges && meta.metaBadges.length && meta.metaBadges.map(esc).join(' | '),
  ].filter(Boolean);
  line(`<p class="contacts">${contacts.join(' &bull; ')}</p></div>`);

  /* ── Profile ─────────────────────────────────────────────────── */
  line('<h2>Profile</h2><div class="intro">');
  roleData.introParagraphs.forEach(p => line(`<p>${esc(injectExperience(p, expStr))}</p>`));
  line('</div>');

  /* ── Entry helper ────────────────────────────────────────────── */
  function entryHTML(entry, r) {
    const bullets = (entry.bullets || []).filter(b => isVisible(b, r));
    const h = [`<div class="entry"><div class="entry-title">${esc(entry.title)} &middot; ${esc(entry.org || entry.type)}</div>`];
    const duration = entryDuration(entry);
    const periodText = duration ? `${formatPeriod(entry)} · ${duration}` : formatPeriod(entry);
    const metaParts = [periodText, entry.location, entry.mode].filter(Boolean);
    if (metaParts.length) h.push(`<div class="entry-meta">${metaParts.map(esc).join(' &middot; ')}</div>`);
    if (bullets.length) { h.push('<ul>'); bullets.forEach(b => h.push(`<li>${esc(typeof b === 'string' ? b : b.text)}</li>`)); h.push('</ul>'); }
    if (entry.repoUrl) h.push(`<div class="tech"><a href="${esc(entry.repoUrl)}">${esc(entry.repoDisplay || entry.repoUrl)}</a></div>`);
    h.push('</div>');
    return h.join('\n');
  }

  /* ── Experience & Projects ───────────────────────────────────── */
  const expEntries = data.experience.filter(e => inCv(e, role));
  if (expEntries.length) { line('<h2>Experience</h2>'); expEntries.forEach(e => line(entryHTML(e, role))); }

  const projEntries = data.projects.filter(p => inCv(p, role));
  if (projEntries.length) { line('<h2>Projects</h2>'); projEntries.forEach(p => line(entryHTML(p, role))); }

  /* ── Education ───────────────────────────────────────────────── */
  line('<h2>Education</h2>');
  data.education.forEach(item => {
    line(`<div class="entry"><div class="entry-title">${esc(item.degree)} &middot; ${esc(item.institution)}</div>`);
    const eduMeta = [item.period, ...(item.highlights || [])];
    line(`<div class="entry-meta">${eduMeta.map(esc).join(' &middot; ')}</div>`);
    line('</div>');
  });

  /* ── Certifications ──────────────────────────────────────────── */
  const filteredCerts = data.certifications.filter(c => inCv(c, role));
  if (filteredCerts.length) {
    line('<h2>Certifications</h2>');
    filteredCerts.forEach(cert => {
      let s = `<div class="entry"><strong>${esc(cert.title)}</strong>, ${esc(cert.issuer)}, ${esc(cert.date)}`;
      if (cert.score) s += ` &middot; Score: ${esc(cert.score)}`;
      if (cert.url) s += ` (<a href="${esc(cert.url)}">verify</a>)`;
      line(s + '</div>');
    });
  }

  /* ── Skills ──────────────────────────────────────────────────── */
  line('<h2>Skills</h2>');
  data.skills.categories.filter(c => isVisible(c, role)).forEach(cat =>
    line(`<div class="skills-cat"><strong>${esc(cat.title)}:</strong> ${cat.tags.map(esc).join(', ')}</div>`));

  line(`<div class="skills-cat"><strong>Languages:</strong> ${data.languages.map(l => `${esc(l.name)} (${esc(l.level)})`).join(', ')}</div>`);

  return parts.join('\n');
}

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
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role') || 'all';
  const shouldPrint = params.get('print') === '1';
  const root = document.getElementById('ats-root');

  loadData()
    .then(data => {
      const isKnownRole = role === 'all' || data.availableRoles.includes(role);
      const activeRole = isKnownRole ? role : 'all';
      document.title = activeRole === 'all'
        ? `${data.meta.name} CV (ATS-friendly)`
        : `${data.meta.name} ${activeRole} CV (ATS-friendly)`;
      root.innerHTML = buildContentHTML(data, activeRole);
      if (shouldPrint) requestAnimationFrame(() => window.print());
    })
    .catch(err => {
      root.innerHTML = `<p style="color:red;">Failed to load CV data: ${esc(err.message)}</p>`;
    });
}

document.addEventListener('DOMContentLoaded', init);
