# ncp38.github.io

Nate Phillips' research and project portfolio: https://ncp38.github.io

A plain static site (no build step) served by GitHub Pages from the `main` branch. The project, publication and certification lists are filtered and searched in the browser.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page shell |
| `assets/site.js` | Rendering, filter tags, search, theme toggle, certification panels |
| `assets/style.css` | Styles, including light and dark themes |
| `assets/icons/` | Header link icons (LinkedIn, ORCID, Google Scholar) |
| `data/projects.js` | One entry per project |
| `data/publications.js` | One entry per publication |
| `data/certifications.js` | One entry per certification |
| `projects/` | Hosted project pages, plus their source as `.txt` files |
| `certifications/` | One folder per certification, holding its web-sized `flair.webp` |
| `favicons/`, `site.webmanifest` | Tab and home-screen icons |
| `index.txt` | A copy of `index.html` shown by the "Code" link; see below |

## Adding a publication

1. In `data/publications.js`, add the `PUBnTITLE`, `...AUTHORS`, `...VENUE`, `...YEAR`, `...DESCRIPTION`, `...KEYWORDS` and `...LINK` constants, then an entry in the `publications` array.
2. Every project and publication title must be unique.
3. Keywords become filter tags automatically. Search matches titles, keywords, authors and venues, so include the venue's acronym (for example "(ISMAR)") if you want it searchable.

## Adding a project

In `data/projects.js`, add the `PROJnTITLE`, `...AUTHORS`, `...YEAR`, `...DESCRIPTION` and `...KEYWORDS` constants, then an entry in the `projects` array (authors are shown on the card and are searchable). By default its "Code" link is the project's `link` plus `.txt`. A project with its own pages or custom links needs a branch for its title in `createProjectCard()` in `assets/site.js`.

## Adding a certification

1. Make a web-sized flair: about 480px square, saved as `certifications/<short-name>/flair.webp` (a transparent background is fine; the page puts a white disc behind it). Keep the full-size original and any PDF in `Non-uploaded files/`.
2. In `data/certifications.js`, add the `CERTnTITLE`, `...CAPTION`, `...ISSUER`, `...KIND`, `...EARNED`, `...EXPIRES` (or `null`), `...KEYWORDS`, `...DESCRIPTION`, `...FLAIR` and `...LINKS` constants, then an entry in the `certifications` array.
3. Use a public verification page for the link. "Active" or "Expired" is worked out from `EXPIRES`, and an expired flair turns grey automatically.
4. Keywords become filter tags, and search matches titles, issuers and keywords. A panel can be shared as a link, for example `?cert=<id>`.

## Motion

CSS transitions are switched off for visitors who ask for reduced motion, but animations started from JavaScript need their own check. Anything in `assets/site.js` that calls `.animate()` or scrolls smoothly goes through `prefersReducedMotion()` or `scrollBehavior()`.

## index.txt stays in sync automatically

`.github/workflows/sync-index-txt.yml` copies `index.html` to `index.txt` whenever `index.html` changes on `main`, and commits the result. Run `git pull` before your next push so you pick that commit up.

## Previewing locally

```
python -m http.server 8000
```

Then open http://localhost:8000. The `Non-uploaded files/` folder and `assets/original*` files are git-ignored and stay on this computer.
