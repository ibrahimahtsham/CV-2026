import { el, isVisible, getTags, sectionHeader, tagRow, injectExperience } from './helpers.js';

/* ── Shared: expandable card (<details>) ──────────────────────── */
function entryCard(entry, visibleBullets, tags, summaryText) {
  const card = el('details', entry.openByDefault ? { open: true } : {});
  card.appendChild(el('summary', {}, summaryText));

  const body = el('div', { class: 'details-body' });
  const inner = el('div', { class: 'details-body-inner' });
  body.appendChild(inner);

  const metaParts = [entry.periodDisplay, entry.location, entry.mode].filter(Boolean);
  const meta = el('div', { class: 'entry-meta' });
  metaParts.forEach((p, i) => {
    meta.appendChild(document.createTextNode(p));
    if (i < metaParts.length - 1) meta.appendChild(el('span', { class: 'dot' }, '\u00b7'));
  });
  inner.appendChild(meta);

  if (visibleBullets.length) {
    const ul = el('ul', {});
    visibleBullets.forEach(b => ul.appendChild(el('li', {}, typeof b === 'string' ? b : b.text)));
    inner.appendChild(ul);
  }

  if (tags && tags.length) {
    inner.appendChild(el('div', { class: 'skills-label' }, 'Stack & Tools'));
    inner.appendChild(tagRow(tags));
  }

  if (entry.repoUrl) {
    const d = el('div', { class: 'repo-link' });
    d.appendChild(el('a', { href: entry.repoUrl, target: '_blank', rel: 'noopener' },
      entry.repoDisplay || entry.repoUrl));
    inner.appendChild(d);
  }

  card.appendChild(body);
  return card;
}

/* ── Header ───────────────────────────────────────────────────── */
export function buildHeader(meta, roleData) {
  const hdr = document.getElementById('cv-header');
  hdr.innerHTML = '';

  const left = el('div', { class: 'header-left' });
  left.appendChild(el('h1', {}, meta.name));
  left.appendChild(el('p', { class: 'subtitle' }, roleData.subtitle));

  function contactRow(icon, alt, text, href) {
    const item = el('div', { class: 'contact-item' });
    item.appendChild(el('img', { src: icon, alt, width: '16', height: '16' }));
    if (href) {
      const a = document.createElement('a');
      a.href = href; a.textContent = text;
      item.appendChild(a);
    } else {
      item.appendChild(document.createTextNode(text));
    }
    return item;
  }

  const grid = el('div', { class: 'contact-grid' });
  grid.appendChild(contactRow('images/globe-icon.svg', '', meta.location));
  grid.appendChild(contactRow('images/phone-icon.svg', '', meta.phone));
  grid.appendChild(contactRow('images/email-icon.svg', '', meta.email, 'mailto:' + meta.email));
  grid.appendChild(contactRow('images/dob-icon.svg', '', meta.dob));
  left.appendChild(grid);

  const badges = el('div', { class: 'meta-badges' });
  meta.metaBadges.forEach(b => badges.appendChild(el('span', { class: 'meta-badge' }, b)));
  left.appendChild(badges);

  const social = el('div', { class: 'social-links' });
  function socialLink(icon, alt, url, display) {
    const a = el('a', { href: url, target: '_blank', rel: 'noopener' });
    a.appendChild(el('img', { src: icon, alt, width: '16', height: '16' }));
    a.appendChild(document.createTextNode(display));
    return a;
  }
  social.appendChild(socialLink('images/linkedin-icon.svg', 'LinkedIn', meta.linkedin, meta.linkedinDisplay));
  social.appendChild(socialLink('images/github-icon.svg', 'GitHub', meta.github, meta.githubDisplay));
  left.appendChild(social);

  const right = el('div', { class: 'header-right' });
  right.appendChild(el('img', { src: meta.photo, alt: 'Profile photo', class: 'profile-photo' }));
  right.appendChild(el('img', { src: meta.qr, alt: 'QR code', class: 'qr-code', title: 'QR code — links to this CV' }));

  hdr.appendChild(left);
  hdr.appendChild(right);
}

/* ── Profile intro ────────────────────────────────────────────── */
export function buildIntro(roleData, expStr) {
  const sec = el('div', { class: 'cv-section' });
  sec.appendChild(sectionHeader('Profile'));
  roleData.introParagraphs.forEach(p =>
    sec.appendChild(el('p', { class: 'intro-text' }, injectExperience(p, expStr))));
  return sec;
}

/* ── Experience ───────────────────────────────────────────────── */
export function buildExperience(entries, role) {
  const filtered = entries.filter(e => isVisible(e, role));
  if (!filtered.length) return null;
  const sec = el('div', { class: 'cv-section' });
  sec.appendChild(sectionHeader('Experience'));
  filtered.forEach(entry => {
    const bullets = entry.bullets.filter(b => isVisible(b, role));
    sec.appendChild(entryCard(entry, bullets, getTags(entry, role),
      `${entry.title}\u00a0\u00b7\u00a0${entry.org}`));
  });
  return sec;
}

/* ── Projects ─────────────────────────────────────────────────── */
export function buildProjects(projects, role) {
  const filtered = projects.filter(p => isVisible(p, role));
  if (!filtered.length) return null;
  const sec = el('div', { class: 'cv-section' });
  sec.appendChild(sectionHeader('Projects'));
  filtered.forEach(proj => {
    const bullets = proj.bullets.filter(b => isVisible(b, role));
    sec.appendChild(entryCard(proj, bullets, getTags(proj, role),
      `${proj.title}\u00a0\u00b7\u00a0${proj.type}`));
  });
  return sec;
}

/* ── Education ────────────────────────────────────────────────── */
export function buildEducation(items) {
  const sec = el('div', { class: 'cv-section' });
  sec.appendChild(sectionHeader('Education'));
  items.forEach(item => {
    const card = el('details', {});
    card.appendChild(el('summary', {}, `${item.degree}\u00a0\u00b7\u00a0${item.institution}`));
    const body = el('div', { class: 'details-body' });
    const inner = el('div', { class: 'details-body-inner' });
    const meta = el('div', { class: 'entry-meta' });
    meta.appendChild(document.createTextNode(item.period));
    meta.appendChild(el('span', { class: 'dot' }, '\u00b7'));
    meta.appendChild(document.createTextNode(item.location));
    inner.appendChild(meta);
    if (item.highlights && item.highlights.length) {
      const ul = el('ul', { class: 'highlight-list' });
      item.highlights.forEach(h => ul.appendChild(el('li', {}, h)));
      inner.appendChild(ul);
    }
    if (item.url) {
      const d = el('div', { class: 'edu-link' });
      d.appendChild(el('a', { href: item.url, target: '_blank', rel: 'noopener' }, item.urlDisplay || item.url));
      inner.appendChild(d);
    }
    body.appendChild(inner);
    card.appendChild(body);
    sec.appendChild(card);
  });
  return sec;
}

/* ── Certifications ───────────────────────────────────────────── */
export function buildCertifications(certs) {
  const sec = el('div', { class: 'cv-section' });
  sec.appendChild(sectionHeader('Certifications'));
  certs.forEach(cert => {
    const card = el('details', {});
    card.appendChild(el('summary', {}, `${cert.title}\u00a0\u00b7\u00a0${cert.issuer}`));
    const body = el('div', { class: 'details-body' });
    const inner = el('div', { class: 'details-body-inner' });
    inner.appendChild(el('div', { class: 'entry-meta' }, cert.date));
    if (cert.score) {
      const p = el('p', { class: 'cert-score' }, 'Score: ');
      p.appendChild(el('span', { class: 'score-badge' }, cert.score));
      inner.appendChild(p);
    }
    if (cert.url) {
      const d = el('div', { class: 'cert-link' });
      d.appendChild(el('a', { href: cert.url, target: '_blank', rel: 'noopener' }, 'Verify certificate'));
      inner.appendChild(d);
    }
    body.appendChild(inner);
    card.appendChild(body);
    sec.appendChild(card);
  });
  return sec;
}

/* ── Skills ───────────────────────────────────────────────────── */
export function buildSkills(skills, role) {
  const sec = el('div', { class: 'cv-section' });
  sec.appendChild(sectionHeader('Skills'));
  const badges = skills.coreBadges[role] || skills.coreBadges['all'] || [];
  if (badges.length) {
    const coreDiv = el('div', { class: 'core-competencies' });
    badges.forEach(b => coreDiv.appendChild(el('span', { class: 'core-badge' }, b)));
    sec.appendChild(coreDiv);
  }
  skills.categories.filter(c => isVisible(c, role)).forEach(cat => {
    const card = el('details', {});
    card.appendChild(el('summary', {}, cat.title));
    const body = el('div', { class: 'details-body' });
    const inner = el('div', { class: 'details-body-inner' });
    inner.appendChild(tagRow(cat.tags));
    body.appendChild(inner);
    card.appendChild(body);
    sec.appendChild(card);
  });
  return sec;
}

/* ── Languages ────────────────────────────────────────────────── */
export function buildLanguages(langs) {
  const sec = el('div', { class: 'cv-section' });
  sec.appendChild(sectionHeader('Languages'));
  const container = el('div', { class: 'lang-entries' });
  langs.forEach(lang => {
    const wrapper = el('div', {});
    const row = el('div', { class: 'lang-entry' });
    row.appendChild(el('span', { class: 'lang-name' }, lang.name));
    row.appendChild(el('span', { class: 'lang-level' }, lang.level));
    wrapper.appendChild(row);
    if (lang.description) wrapper.appendChild(el('p', { class: 'lang-desc' }, lang.description));
    container.appendChild(wrapper);
  });
  sec.appendChild(container);
  return sec;
}
