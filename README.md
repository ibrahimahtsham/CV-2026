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

**To print / save PDF:** click the **Print / Save PDF** button — opens a clean, ATS-friendly flat HTML document with no colours, no CSS tricks, standard A4 margins.

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

Copy the entire prompt below and paste it into ChatGPT or Claude. The schemas for all 8 files are already embedded — all you need to add is your own CV text at the bottom.

---

<details>
<summary><strong>Click to expand the AI prompt (copy everything inside)</strong></summary>

```
I need to fill in 8 JSON data files for a role-based CV template. The schemas for
all 8 files are below. Fill each one based on my CV at the bottom of this message.

RULES:
- Keep all JSON keys exactly as shown — do not rename or remove any key
- Use {experience} in introParagraphs wherever you want the auto-calculated
  total years of experience to appear (it renders as e.g. "2+ years")
- periodEnd: null means "Present" — use null for current roles, "YYYY-MM" for ended ones
- roles arrays control which CV view shows that item — use the same role names
  you defined in availableRoles (e.g. "Full-Stack", "IT", "NOC")
- Tag each bullet with every role it is relevant to
- "all" is a special role key meaning "show in every view including master"
- For tags: use the object form {"RoleName": [...], "all": [...]} when tags
  differ by role; use a flat array ["tag1", "tag2"] when one role or all the same
- Set openByDefault: true for your most impressive 1-2 entries only
- url / score / repoUrl can be null if not applicable
- highlights arrays are optional — use them for notable achievements or cert topics
- metaBadges are small highlight chips shown in the header (visa status, availability, etc.)
- periodDisplay is the human-readable date string, e.g. "Jun 2024 – Present"

OUTPUT: return each file as a separate fenced JSON code block labelled with the filename.

=== data/meta.json ===
{
  "name": "",
  "location": "",
  "phone": "",
  "email": "",
  "dob": "",
  "linkedin": "",
  "linkedinDisplay": "",
  "github": "",
  "githubDisplay": "",
  "photo": "images/photo.jpg",
  "qr": "images/qr-code.png",
  "metaBadges": []
}

=== data/roles.json ===
{
  "availableRoles": [],
  "roles": {
    "all": {
      "subtitle": "",
      "introParagraphs": []
    }
  }
}

Note: add one key per role in "roles" matching each entry in availableRoles, e.g.:
  "Full-Stack": { "subtitle": "...", "introParagraphs": ["..."] }

=== data/experience.json ===
[
  {
    "id": "exp-COMPANY-SLUG",
    "title": "",
    "org": "",
    "periodStart": "YYYY-MM",
    "periodEnd": "YYYY-MM",
    "periodDisplay": "",
    "location": "",
    "mode": "",
    "roles": [],
    "openByDefault": false,
    "bullets": [
      { "text": "", "roles": [] }
    ],
    "tags": {
      "RoleName": [],
      "all": []
    }
  }
]

Note: repeat the entry object for each job. periodEnd: null = current job.
mode is typically "Remote", "On-site", or "Hybrid".

=== data/projects.json ===
[
  {
    "id": "proj-SLUG",
    "title": "",
    "type": "",
    "periodStart": "YYYY-MM",
    "periodEnd": "YYYY-MM",
    "periodDisplay": "",
    "roles": [],
    "openByDefault": false,
    "repoUrl": null,
    "repoDisplay": null,
    "bullets": [
      { "text": "", "roles": [] }
    ],
    "tags": {
      "RoleName": [],
      "all": []
    }
  }
]

Note: type is a short label like "Full-Stack Web App", "React Dashboard", "CLI Tool", etc.
repoUrl and repoDisplay are optional — set both to null if private or no repo.

=== data/education.json ===
[
  {
    "id": "edu-SLUG",
    "degree": "",
    "institution": "",
    "period": "",
    "location": "",
    "url": "",
    "urlDisplay": "",
    "highlights": []
  }
]

Note: highlights are optional strings like "GPA: 3.8 / 4.0" or award names.
Repeat the entry object for each qualification, ordered most recent first.

=== data/certifications.json ===
[
  {
    "id": "cert-SLUG",
    "title": "",
    "issuer": "",
    "date": "Mon YYYY",
    "url": null,
    "score": null,
    "roles": [],
    "highlights": []
  }
]

Note: url is the certificate verification link — null if unavailable.
score is a string like "94.66%" or null. highlights are short topic bullet strings.
Repeat for each cert, ordered most recent first.

=== data/skills.json ===
{
  "coreBadges": {
    "all": [],
    "RoleName": []
  },
  "categories": [
    {
      "id": "skill-SLUG",
      "title": "",
      "roles": [],
      "tags": []
    }
  ]
}

Note: coreBadges keys must include "all" plus one key per role. These are the
highlight chips shown at the top of the skills section for each view.
categories.roles controls which views show that skill block — include "all" to
show it in the master view. tags are individual skill pills inside the block.

=== data/languages.json ===
[
  {
    "name": "",
    "level": "",
    "description": ""
  }
]

Note: level is a short string like "Native", "Fluent / Professional",
"Intermediate", "Basic / Conversational". description is one sentence.

=== MY CV ===
[PASTE YOUR CV TEXT HERE — copy-paste from Word, LinkedIn, or PDF]
```

</details>

---

The AI will return each file as a separate code block. Paste the contents into the corresponding file in your `data/` folder.

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

Full field-by-field reference for all 8 data files.

### `data/meta.json`

```jsonc
{
  "name": "Your Full Name",
  "location": "City, Country",
  "phone": "(+XX) XX XXX XXXX",
  "email": "you@example.com",
  "dob": "Born DD Mon YYYY",          // shown as a small header detail
  "linkedin": "https://...",           // full URL (used as href)
  "linkedinDisplay": "linkedin.com/…", // short version shown as link text
  "github": "https://...",
  "githubDisplay": "github.com/…",
  "photo": "images/photo.jpg",         // path relative to repo root
  "qr": "images/qr-code.png",          // QR pointing to your GitHub Pages URL
  "metaBadges": ["Visa Status", "Immediate Availability"]  // header chips
}
```

---

### `data/roles.json`

```jsonc
{
  "availableRoles": ["Full-Stack", "IT", "NOC"],   // drives the role nav bar

  "roles": {
    "all": {                              // shown on the master (no ?role=) view
      "subtitle": "Title · Skill · Skill",
      "introParagraphs": [
        "First paragraph. {experience} is replaced with auto-calculated duration.",
        "Second paragraph.",
        "Third paragraph."
      ]
    },
    "Full-Stack": {                       // one key per entry in availableRoles
      "subtitle": "Full-Stack Developer · React · Node.js",
      "introParagraphs": [
        "Paragraph shown only when ?role=Full-Stack."
      ]
    }
    // … repeat for every role in availableRoles
  }
}
```

---

### `data/experience.json`

Array of work experience entries, most recent first.

```jsonc
[
  {
    "id": "exp-company-slug",           // unique string, kebab-case
    "title": "Job Title",
    "org": "Company Name",
    "periodStart": "2024-06",           // YYYY-MM
    "periodEnd": null,                  // null = Present; "YYYY-MM" for ended roles
    "periodDisplay": "Jun 2024 – Present",  // human-readable, shown on the card
    "location": "City, State/Country",
    "mode": "Remote",                   // "Remote" | "On-site" | "Hybrid"
    "roles": ["Full-Stack", "IT"],      // which role views show this entry
    "openByDefault": false,             // true = card expanded on load
    "bullets": [
      {
        "text": "What you did and the impact.",
        "roles": ["Full-Stack"]         // which roles show this bullet
      },
      {
        "text": "Another achievement.",
        "roles": ["Full-Stack", "IT"]   // bullet shown in both views
      }
    ],
    "tags": {
      "Full-Stack": ["React", "Node.js"],   // pills shown under Full-Stack view
      "IT": ["Active Directory", "M365"],   // pills shown under IT view
      "all": ["React", "Node.js", "Active Directory", "M365"]  // master view
    }
    // Shorthand: use a flat array ["tag1", "tag2"] when tags are the
    // same across all roles (common for single-role entries)
  }
]
```

---

### `data/projects.json`

Same shape as `experience.json` entries, with two extra fields:

```jsonc
[
  {
    "id": "proj-slug",
    "title": "Project Name",
    "type": "Full-Stack Web App",       // short category label shown on the card
    "periodStart": "2025-09",
    "periodEnd": "2025-10",
    "periodDisplay": "Sep 2025 – Oct 2025",
    "roles": ["Full-Stack"],
    "openByDefault": false,
    "repoUrl": "https://github.com/you/repo",   // null if private / no repo
    "repoDisplay": "github.com/you/repo",        // null if no repo
    "bullets": [
      { "text": "What the project does.", "roles": ["Full-Stack"] }
    ],
    "tags": ["React", "Vite", "Node.js"]  // flat array fine for single-role projects
  }
]
```

---

### `data/education.json`

Array of qualifications, most recent first.

```jsonc
[
  {
    "id": "edu-university-slug",
    "degree": "BSc Computer Science",
    "institution": "University Name",
    "period": "Sep 2020 – Sep 2024",    // free-form display string
    "location": "City, Country",
    "url": "https://university.edu/",
    "urlDisplay": "university.edu",
    "highlights": [                     // optional — notable grades or awards
      "GPA: 3.8 / 4.0",
      "Best Final Year Project"
    ]
  }
]
```

---

### `data/certifications.json`

Array of certifications, most recent first.

```jsonc
[
  {
    "id": "cert-slug",
    "title": "Full Certificate Name",
    "issuer": "Issuing Organisation",
    "date": "Jan 2026",                 // "Mon YYYY" display string
    "url": "https://verify.example.com/…",  // null if no public verify URL
    "score": "94.66%",                  // null if not applicable
    "roles": ["NOC", "IT"],             // which role views show this cert
    "highlights": [                     // optional — key topics covered
      "Topic or skill area 1",
      "Topic or skill area 2"
    ]
  }
]
```

---

### `data/skills.json`

```jsonc
{
  "coreBadges": {
    // Highlight chips shown at the top of the Skills section per view.
    // Must include "all" plus one key for every role in availableRoles.
    "all":         ["Full-Stack Development", "MSP Operations", "…"],
    "Full-Stack":  ["React & Node.js", "API Development", "…"],
    "IT":          ["Microsoft 365 Admin", "Endpoint Security", "…"]
    // … one key per role
  },
  "categories": [
    {
      "id": "skill-slug",
      "title": "Category Heading",
      "roles": ["Full-Stack", "all"],   // which views show this block
      "tags": ["React", "Node.js", "PostgreSQL"]  // individual skill pills
    }
    // … one object per skill category block
  ]
}
```

---

### `data/languages.json`

```jsonc
[
  {
    "name": "English",
    "level": "Fluent / Professional",   // "Native" | "Fluent / Professional" |
                                        // "Intermediate" | "Basic / Conversational"
    "description": "One sentence about usage context."
  }
]
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
