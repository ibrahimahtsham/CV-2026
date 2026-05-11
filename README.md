# CV-2026 — Role-Based CV Template

A single-page, static HTML CV that serves **multiple role-specific versions** from one set of JSON files. No build tools, no server, no npm. Works on GitHub Pages out of the box.

**Live demo:** [ibrahimahtsham.github.io/CV-2026](https://ibrahimahtsham.github.io/CV-2026/)

---

## How it works

All your CV content lives in the **`data/`** folder — one JSON file per section. Each experience entry, project, and bullet point is tagged with which roles it's relevant to. The renderer reads the URL (`?role=NOC`, `?role=Full-Stack`, etc.) and shows only the relevant content.

| URL | Shows |
|-----|-------|
| `/CV-2026/` | Full master CV — everything |
| `/CV-2026/?role=Full-Stack` | Full-Stack-focused view |
| `/CV-2026/?role=IT` | IT Support view |
| `/CV-2026/?role=NOC` | NOC/Networking view |
| `/CV-2026/?role=Customer-Support` | Customer Support view |
| `/CV-2026/?role=Business-Dev` | Business Development view |

**To add a new role:** edit `data/roles.json` — add the role to `availableRoles`, write its intro, then tag relevant entries and bullets across the other data files. No new files to create.

**To print / save PDF:** click the **Print / Save PDF** button — opens a clean, ATS-friendly flat HTML document with no colours, no CSS tricks, standard A4 margins. Paste the PDF directly into job applications.

---

## File structure

```
CV-2026/
├── index.html              ← Shell page (never edit this)
├── data/
│   ├── meta.json           ← Your name, contact info, photo, badges
│   ├── roles.json          ← Available roles + per-role subtitles & intros
│   ├── experience.json     ← Work experience entries
│   ├── projects.json       ← Projects
│   ├── education.json      ← Education
│   ├── certifications.json ← Certifications (role-filtered)
│   ├── skills.json         ← Core badges + skill categories
│   └── languages.json      ← Languages
├── js/
│   ├── main.js             ← Routing, render orchestration
│   ├── builder.js          ← DOM section builders
│   ├── helpers.js          ← Shared utilities (el, isVisible, etc.)
│   └── print.js            ← ATS-friendly print HTML generator
├── css/
│   ├── tokens.css          ← CSS variables + dark mode
│   ├── layout.css          ← Page, header, wrapper
│   ├── components.css      ← Cards, tags, nav, badges
│   └── print.css           ← Print media styles
└── images/                 ← Your photo, QR code, icons, favicon
```

---

## Using this as your own CV template

### Step 1 — Fork the repository

1. Go to [github.com/ibrahimahtsham/CV-2026](https://github.com/ibrahimahtsham/CV-2026)
2. Click **Fork** (top right)
3. Name it `CV-2026` (or whatever you like)

### Step 2 — Replace your photo and QR code

1. Drop your photo into `images/` and update the `"photo"` field in `data/meta.json`
2. Generate a QR code pointing to your GitHub Pages URL, save it as `images/qr-code.png`
3. Replace the favicon at `images/favicon.svg` with your own if you want

### Step 3 — Fill in the data files using AI

The easiest way is to use an AI assistant to convert your existing CV into the JSON format.

**Copy this prompt into ChatGPT or Claude:**

---

```
I have a CV template that stores content across multiple JSON files in a data/ folder.
I'll share each file's structure and my existing CV below. Please fill in each file
based on my CV, keeping the exact same JSON structure.

Here are the data file contents I need you to fill in:

[PASTE THE CONTENTS OF data/meta.json]
[PASTE THE CONTENTS OF data/roles.json]
[PASTE THE CONTENTS OF data/experience.json]
[PASTE THE CONTENTS OF data/projects.json]
[PASTE THE CONTENTS OF data/education.json]
[PASTE THE CONTENTS OF data/certifications.json]
[PASTE THE CONTENTS OF data/skills.json]
[PASTE THE CONTENTS OF data/languages.json]

Here is my existing CV:

[PASTE YOUR CV TEXT HERE — copy-paste from Word, LinkedIn, or PDF]

Instructions:
- Keep all JSON keys exactly as-is
- Fill in my personal details in meta.json
- Write role-specific intro paragraphs in roles.json (use {experience} where you want
  the auto-calculated duration to appear)
- Add all my experience to experience.json with bullet-level role tags
- Tag each bullet with the roles it's relevant to (e.g. ["Full-Stack", "IT"])
- Add projects, education, certifications, skills, and languages to their files
- Tag certifications with the roles where they're relevant
- Make availableRoles in roles.json match the types of jobs I'm applying for
```

---

The AI will produce filled JSON files you can paste directly.

### Step 4 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**
6. Wait ~60 seconds, then visit `https://YOUR-USERNAME.github.io/CV-2026/`

### Step 5 — Share role-specific links

| Job type | Share this link |
|----------|----------------|
| Full-Stack developer | `https://your-username.github.io/CV-2026/?role=Full-Stack` |
| IT Support | `https://your-username.github.io/CV-2026/?role=IT` |
| Any other role | `https://your-username.github.io/CV-2026/?role=YOUR-ROLE` |

Recipients only see their role's content — the role nav is hidden when a `?role=` param is present.

---

## Adding a new role

1. Open `data/roles.json` — add the role to `availableRoles` and add its `subtitle` + `introParagraphs`
2. Open `data/experience.json` and `data/projects.json` — add the new role to `roles` arrays on relevant entries and bullets
3. Open `data/skills.json` — add the role to `coreBadges` and relevant `categories[].roles` arrays
4. Open `data/certifications.json` — add the role to any relevant cert's `roles` array
5. Save and push — the nav bar updates automatically

---

## JSON structure reference

### `data/roles.json`
```json
{
  "availableRoles": ["Full-Stack", "IT", "NOC"],
  "roles": {
    "Full-Stack": {
      "subtitle": "Your subtitle for this role",
      "introParagraphs": [
        "First paragraph. Use {experience} where you want the auto-calculated duration.",
        "Second paragraph."
      ]
    }
  }
}
```

### Experience / Project entry (`data/experience.json` or `data/projects.json`)
```json
{
  "id": "unique-id",
  "title": "Job Title",
  "org": "Company Name",
  "periodStart": "2024-06",
  "periodEnd": null,
  "periodDisplay": "Jun 2024 – Present",
  "location": "City, Country",
  "mode": "Remote",
  "roles": ["Full-Stack", "IT"],
  "openByDefault": false,
  "bullets": [
    { "text": "What you did.", "roles": ["Full-Stack"] },
    { "text": "Another thing.", "roles": ["Full-Stack", "IT"] }
  ],
  "tags": {
    "Full-Stack": ["React", "Node.js"],
    "IT": ["Linux", "SSH"],
    "all": ["React", "Node.js", "Linux", "SSH"]
  }
}
```

**`periodEnd: null`** means "present" — used for the auto-calculated experience duration.  
**`periodDisplay`** is just the human-readable date range. Duration (e.g. "6 mo") is calculated automatically from `periodStart`/`periodEnd`.

### Certification entry (`data/certifications.json`)
```json
{
  "id": "cert-ccna",
  "title": "CCNA 200-301",
  "issuer": "Udemy",
  "date": "Jan 2026",
  "url": "https://...",
  "score": null,
  "roles": ["NOC", "IT"]
}
```

---

## Local development

You need a local server because ES6 modules and `fetch()` don't work on `file://` URLs.

The repo includes a simple Node.js server:
```bash
node server.js
```

Or use any other static server:
```bash
npx serve .
# or
python -m http.server 3000
```

Then open `http://localhost:3000`

---

## Customising the design

CSS variables are in `css/tokens.css`:

```css
:root {
  --accent: #2563eb;      /* Blue accent — change to your brand colour */
  --bg: #f0f2f5;          /* Page background */
  --paper-bg: #ffffff;    /* CV card background */
}
```

Dark mode overrides are in the `body.dark-mode { }` block in the same file.

---

## Credits

Built by [Ibrahim Ahtsham](https://github.com/ibrahimahtsham). Use freely.
