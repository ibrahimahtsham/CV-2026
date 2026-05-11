import { isVisible, getTags, calcExperience, injectExperience, entryDuration } from './helpers.js';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function generatePrintHTML(data, role) {
  const roleData = data.roles[role] || data.roles['all'];
  const meta = data.meta;
  const expStr = calcExperience(data.experience, role);

  // Resolve relative image paths to absolute so they load in the blank window
  const base = new URL('./', window.location.href).href;
  const photoUrl = meta.photo ? new URL(meta.photo, base).href : null;
  const qrUrl = meta.qr ? new URL(meta.qr, base).href : null;

  const parts = [];
  const line = s => parts.push(s);

  /* ── Head ──────────────────────────────────────────────────── */
  line(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>${esc(meta.name)} ${role === 'all' ? 'CV' : esc(role) + ' CV'}</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #000; }
@page { size: A4 portrait; margin: 16mm 15mm; }
h1 { font-size: 17pt; font-weight: bold; margin-bottom: 2pt; }
.subtitle { font-size: 10pt; color: #333; margin-bottom: 4pt; }
.contacts { font-size: 9pt; color: #444; margin-bottom: 8pt; }
.cv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1.5pt solid #000; padding-bottom: 8pt; }
.cv-header-right { display: flex; flex-direction: column; align-items: center; gap: 6pt; margin-left: 16pt; flex-shrink: 0; }
.cv-header-right img { border: 0.5pt solid #ccc; }
h2 { font-size: 8.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8pt; border-bottom: 0.75pt solid #000; padding-bottom: 2pt; margin: 12pt 0 5pt; }
.intro p { font-size: 9.5pt; line-height: 1.5; margin-bottom: 5pt; color: #222; }
.entry { margin-bottom: 7pt; }
.entry-title { font-weight: bold; font-size: 10pt; }
.entry-meta { font-size: 8.5pt; color: #555; margin: 1.5pt 0; }
ul { margin: 3pt 0 2pt 16pt; }
li { font-size: 9.5pt; line-height: 1.4; margin-bottom: 2pt; }
.tech { font-size: 8.5pt; color: #555; margin-top: 2pt; }
.skills-cat { font-size: 9.5pt; margin-bottom: 4pt; }
.lang-row { font-size: 9.5pt; margin-bottom: 3pt; }
.lang-desc { font-size: 8.5pt; color: #555; margin-bottom: 2pt; }
a { color: #000; }
</style></head><body>`);

  /* ── Header ─────────────────────────────────────────────────── */
  line('<div class="cv-header"><div class="cv-header-left">');
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
  line('<div class="cv-header-right">');
  if (photoUrl) line(`<img src="${esc(photoUrl)}" alt="Profile photo" style="width:75pt;height:100pt;object-fit:cover;border-radius:4pt;">`);
  if (qrUrl) line(`<img src="${esc(qrUrl)}" alt="QR code" style="width:50pt;height:50pt;border-radius:2pt;">`);
  line('</div></div>');

  /* ── Profile ─────────────────────────────────────────────────── */
  line('<h2>Profile</h2><div class="intro">');
  roleData.introParagraphs.forEach(p => line(`<p>${esc(injectExperience(p, expStr))}</p>`));
  line('</div>');

  /* ── Entry helper ────────────────────────────────────────────── */
  function entryHTML(entry, r) {
    const bullets = (entry.bullets || []).filter(b => isVisible(b, r));
    const tags = getTags(entry, r);
    const h = [`<div class="entry"><div class="entry-title">${esc(entry.title)} &middot; ${esc(entry.org || entry.type)}</div>`];
    const duration = entryDuration(entry);
    const periodText = duration ? `${entry.periodDisplay} · ${duration}` : entry.periodDisplay;
    const metaParts = [periodText, entry.location, entry.mode].filter(Boolean);
    if (metaParts.length) h.push(`<div class="entry-meta">${metaParts.map(esc).join(' &middot; ')}</div>`);
    if (bullets.length) { h.push('<ul>'); bullets.forEach(b => h.push(`<li>${esc(typeof b === 'string' ? b : b.text)}</li>`)); h.push('</ul>'); }
    if (tags.length) h.push(`<div class="tech">Technologies: ${tags.map(esc).join(', ')}</div>`);
    if (entry.repoUrl) h.push(`<div class="tech"><a href="${esc(entry.repoUrl)}">${esc(entry.repoDisplay || entry.repoUrl)}</a></div>`);
    h.push('</div>');
    return h.join('\n');
  }

  /* ── Experience & Projects ───────────────────────────────────── */
  const expEntries = data.experience.filter(e => isVisible(e, role));
  if (expEntries.length) { line('<h2>Experience</h2>'); expEntries.forEach(e => line(entryHTML(e, role))); }

  const projEntries = data.projects.filter(p => isVisible(p, role));
  if (projEntries.length) { line('<h2>Projects</h2>'); projEntries.forEach(p => line(entryHTML(p, role))); }

  /* ── Education ───────────────────────────────────────────────── */
  line('<h2>Education</h2>');
  data.education.forEach(item => {
    line(`<div class="entry"><div class="entry-title">${esc(item.degree)} &middot; ${esc(item.institution)}</div>`);
    line(`<div class="entry-meta">${esc(item.period)} &middot; ${esc(item.location)}</div>`);
    if (item.highlights && item.highlights.length) {
      line('<ul>'); item.highlights.forEach(h => line(`<li>${esc(h)}</li>`)); line('</ul>');
    }
    if (item.url) line(`<div class="entry-meta"><a href="${esc(item.url)}">${esc(item.urlDisplay || item.url)}</a></div>`);
    line('</div>');
  });

  /* ── Certifications ──────────────────────────────────────────── */
  line('<h2>Certifications</h2>');
  data.certifications.forEach(cert => {
    let s = `<div class="entry"><strong>${esc(cert.title)}</strong>, ${esc(cert.issuer)}, ${esc(cert.date)}`;
    if (cert.score) s += ` &middot; Score: ${esc(cert.score)}`;
    if (cert.url) s += ` (<a href="${esc(cert.url)}">verify</a>)`;
    line(s + '</div>');
  });

  /* ── Skills ──────────────────────────────────────────────────── */
  line('<h2>Skills</h2>');
  const badges = data.skills.coreBadges[role] || data.skills.coreBadges['all'] || [];
  if (badges.length) line(`<p style="font-weight:bold;font-size:9.5pt;margin-bottom:6pt">${badges.map(esc).join(', ')}</p>`);
  data.skills.categories.filter(c => isVisible(c, role)).forEach(cat =>
    line(`<div class="skills-cat"><strong>${esc(cat.title)}:</strong> ${cat.tags.map(esc).join(', ')}</div>`));

  /* ── Languages ───────────────────────────────────────────────── */
  line('<h2>Languages</h2>');
  data.languages.forEach(lang => {
    line(`<div class="lang-row"><strong>${esc(lang.name)}</strong>: ${esc(lang.level)}</div>`);
    if (lang.description) line(`<div class="lang-desc">${esc(lang.description)}</div>`);
  });

  line(`<script>window.onload = function() { window.print(); };<\/script></body></html>`);
  return parts.join('\n');
}
