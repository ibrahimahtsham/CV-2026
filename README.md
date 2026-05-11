# CV-2026 — Role-Based CV Template

A single-page, static HTML CV that serves **multiple role-specific versions** from one JSON file. No build tools, no server, no npm. Works on GitHub Pages out of the box.

**Live demo:** [ibrahimahtsham.github.io/CV-2026](https://ibrahimahtsham.github.io/CV-2026/)

---

## How it works

All your CV content lives in **`cv-data.json`**. Each experience entry, project, and bullet point is tagged with which roles it's relevant to. The renderer reads the URL (`?role=NOC`, `?role=Full-Stack`, etc.) and shows only the relevant content.

| URL | Shows |
|-----|-------|
| `/CV-2026/` | Full master CV — everything |
| `/CV-2026/?role=Full-Stack` | Full-Stack-focused view |
| `/CV-2026/?role=IT` | IT Support view |
| `/CV-2026/?role=NOC` | NOC/Networking view |

**To add a new role:** edit `cv-data.json` — add the role to `availableRoles`, write its intro, tag entries. Done. No files to create.

**To print:** `Ctrl+P` — produces a clean professional document with all sections expanded, no colours, standard A4 margins.

---

## File structure

```
CV-2026/
├── index.html          ← Shell page (30 lines, never edit this)
├── cv-data.json        ← ALL your content lives here ← EDIT THIS
├── cv-renderer.js      ← The engine (never edit this)
├── cv-styles.css       ← Web + print styles (edit to restyle)
└── images/             ← Your photo, QR code, and icons
```

---

## Using this as your own CV template

### Step 1 — Fork the repository

1. Go to [github.com/ibrahimahtsham/CV-2026](https://github.com/ibrahimahtsham/CV-2026)
2. Click **Fork** (top right)
3. Name it `CV-2026` (or whatever you like)

`[screenshot: Fork button on GitHub]`

### Step 2 — Replace your photo and QR code

1. Drop your photo into the `images/` folder — name it `my face updated.jpg` (or update the `"photo"` field in `cv-data.json`)
2. Generate a QR code pointing to your GitHub Pages URL and save it as `images/qr-code.png`

### Step 3 — Fill in `cv-data.json` using AI

This is the only file you need to edit. The easiest way is to use an AI assistant.

**Copy this prompt into ChatGPT or Claude:**

---

```
I have a CV template that uses a JSON file called cv-data.json to store all my
content. I'll share the JSON structure and my existing CV below. Please rewrite
the cv-data.json for me based on my CV, keeping the exact same JSON structure.

Here is the cv-data.json structure I need you to fill in:

[PASTE THE CONTENTS OF cv-data.json HERE]

Here is my existing CV:

[PASTE YOUR CV TEXT HERE — copy-paste from Word, LinkedIn, or PDF]

Instructions:
- Keep all JSON keys exactly as-is
- Fill in my personal details in the "meta" section
- Write role-specific intro paragraphs in the "roles" section
- Add all my experience with bullet-level role tags
- Tag each bullet with the roles it's relevant to (e.g. ["Full-Stack", "IT"])
- Add all my projects, education, certifications, skills, and languages
- Make "availableRoles" match the types of jobs I'm applying for
```

---

The AI will produce a filled `cv-data.json` you can paste directly into the file.

### Step 4 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)

`[screenshot: Settings → Pages]`

3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**

`[screenshot: Pages source settings]`

6. Wait ~60 seconds, then visit `https://YOUR-USERNAME.github.io/CV-2026/`

`[screenshot: Live site]`

### Step 5 — Share role-specific links

| Job type | Share this link |
|----------|----------------|
| Full-Stack developer | `https://your-username.github.io/CV-2026/?role=Full-Stack` |
| IT Support | `https://your-username.github.io/CV-2026/?role=IT` |
| Any other role | `https://your-username.github.io/CV-2026/?role=YOUR-ROLE` |

---

## Adding a new role

1. Open `cv-data.json`
2. Add the role name to `availableRoles` array
3. Add an entry in `roles` with `subtitle` and `introParagraphs`
4. Go through `experience` and `projects` — add your new role to the `roles` arrays on relevant entries and bullets
5. Add the role to `skills.coreBadges` and relevant `skills.categories[].roles` arrays
6. Save and push — the nav bar updates automatically

---

## JSON structure reference

### `availableRoles`
Array of role names that appear as nav buttons. Order matters — left to right.

### `roles.<ROLE>`
```json
{
  "subtitle": "Your subtitle for this role",
  "introParagraphs": [
    "First paragraph. Use {experience} where you want the auto-calculated duration.",
    "Second paragraph.",
    "Third paragraph."
  ]
}
```

### Experience / Project entry
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
    {
      "text": "What you did.",
      "roles": ["Full-Stack"]
    },
    {
      "text": "Another thing you did.",
      "roles": ["Full-Stack", "IT"]
    }
  ],
  "tags": {
    "Full-Stack": ["React", "Node.js"],
    "IT": ["Linux", "SSH"],
    "all": ["React", "Node.js", "Linux", "SSH"]
  }
}
```

**Bullet roles:** Only bullets tagged with the current role are shown. A NOC recruiter won't see your React bullets. An IT recruiter won't see your CCNA networking bullets.

**`periodEnd: null`** means "present". Used for the experience duration calculation.

---

## Local development

You need a local server because `fetch()` doesn't work on `file://` URLs.

If you have Node.js:
```bash
npx serve . -p 3000
```
Then open `http://localhost:3000`

If you have Python:
```bash
python -m http.server 3000
```

---

## Customising the design

All styles are in `cv-styles.css`. The key CSS variables at the top control colours:

```css
:root {
  --accent: #2563eb;      /* Blue accent — change to your brand colour */
  --bg: #f0f2f5;          /* Page background */
  --paper-bg: #ffffff;    /* CV card background */
}
```

Dark mode colours are in the `body.dark-mode { }` block below.

---

## Credits

Built by [Ibrahim Ahtsham](https://github.com/ibrahimahtsham). Use freely.
