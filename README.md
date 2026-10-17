# ncp38.github.io

Nate Phillips' research and project portfolio: https://ncp38.github.io

A plain static site (no build step) served by GitHub Pages from the `main` branch. The project and publication lists are filtered and searched in the browser.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page shell |
| `assets/site.js` | Rendering, filter tags, search, theme toggle |
| `assets/style.css` | Styles, including light and dark themes |
| `assets/icons/` | Header link icons (LinkedIn, ORCID, Google Scholar) |
| `data/projects.js` | One entry per project |
| `data/publications.js` | One entry per publication |
| `projects/` | Hosted project pages, plus their source as `.txt` files |
| `certifications/` | Certificate PDFs |
| `favicons/`, `site.webmanifest` | Tab and home-screen icons |
| `index.txt` | A copy of `index.html` shown by the "Code" link; see below |

## Adding a publication

1. In `data/publications.js`, add the `PUBnTITLE`, `...AUTHORS`, `...VENUE`, `...YEAR`, `...DESCRIPTION`, `...KEYWORDS` and `...LINK` constants, then an entry in the `publications` array.
2. Every project and publication title must be unique.
3. Keywords become filter tags automatically. Search matches titles, keywords, authors and venues, so include the venue's acronym (for example "(ISMAR)") if you want it searchable.

## Adding a project

In `data/projects.js`, add the `PROJnTITLE`, `...AUTHORS`, `...YEAR`, `...DESCRIPTION` and `...KEYWORDS` constants, then an entry in the `projects` array (authors are shown on the card and are searchable). By default its "Code" link is the project's `link` plus `.txt`. A project with its own pages or custom links needs a branch for its title in `createProjectCard()` in `assets/site.js`.

## index.txt stays in sync automatically

`.github/workflows/sync-index-txt.yml` copies `index.html` to `index.txt` whenever `index.html` changes on `main`, and commits the result. Run `git pull` before your next push so you pick that commit up.

## Previewing locally

```
python -m http.server 8000
```

Then open http://localhost:8000. The `Non-uploaded files/` folder and `assets/original*` files are git-ignored and stay on this computer.
