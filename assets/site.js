const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

const toggleProjects = document.getElementById("toggleProjects");
const togglePublications = document.getElementById("togglePublications");
const toggleCertifications = document.getElementById("toggleCertifications");

const filterToggle =
  document.getElementById("filterToggle");

const filterPanel =
  document.getElementById("filterPanel");

const filterCount =
  document.getElementById("filterCount");
  
let filtersOpen = false;

const tagContainer = document.getElementById("tagContainer");
let activeTags = new Set();

// Browsers can throw when storage is blocked (e.g. Safari's "Block All
// Cookies"), so every storage access goes through these helpers. "kind" is
// "localStorage" or "sessionStorage"; the lookup happens inside the try block
// because even reading window.localStorage can throw.
function storageGet(kind, key) {
  try {
    return window[kind].getItem(key);
  } catch (e) {
    return null;
  }
}

function storageSet(kind, key, value) {
  try {
    window[kind].setItem(key, value);
  } catch (e) {
    // Storage unavailable; the setting just won't be remembered.
  }
}

function storageRemove(kind, key) {
  try {
    window[kind].removeItem(key);
  } catch (e) {
    // Nothing to clean up if storage is unavailable.
  }
}

// The CSS rule that switches off transitions for "Reduce Motion" cannot stop
// animations started from JavaScript, so those check the setting themselves.
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Smooth scrolling is motion too.
function scrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}

const darkModeToggle = document.getElementById("darkModeToggle");

// Saved choice first, otherwise follow the visitor's system setting.
// (A script in index.html's <head> normally applies this before first paint.)
function getInitialTheme() {
  return storageGet("localStorage", "theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  darkModeToggle.setAttribute("aria-pressed", theme === "dark");
}

// Only an explicit click is saved, so visitors who never touch the toggle
// keep following their system setting.
darkModeToggle.onclick = () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";

  applyTheme(next);
  storageSet("localStorage", "theme", next);
};

applyTheme(
  document.documentElement.getAttribute("data-theme") || getInitialTheme()
);


function getVisibleItems() {
  const items = [];

  if (toggleProjects.checked) {
    items.push(...projects);
  }

  if (togglePublications.checked) {
    items.push(...publications);
  }

  if (toggleCertifications.checked) {
    items.push(...certifications);
  }

  return items;
}


function getAllTags() {
  const tags = new Set();

  getVisibleItems().forEach(item => {
    item.keywords.forEach(k => tags.add(k));
  });

  return Array.from(tags).sort();
}

function createSection(id, title) {
  const section = document.createElement("div");
  section.className = "section";
  section.id = id;

  section.innerHTML = `
    <div class="section-inner">
      <div class="section-header">
        <h2>${title}</h2>
        <div class="divider"></div>
      </div>
      <div class="section-content"></div>
    </div>
  `;

  return section;
}

function ensureSections() {
  let projectsSection =
    document.getElementById("projectsSection");

  let publicationsSection =
    document.getElementById("publicationsSection");

  let certificationsSection =
    document.getElementById("certificationsSection");

  if (!projectsSection) {
    projectsSection = createSection(
      "projectsSection",
      "Projects"
    );

    results.appendChild(projectsSection);
  }

  if (!publicationsSection) {
    publicationsSection = createSection(
      "publicationsSection",
      "Publications"
    );

    results.appendChild(publicationsSection);
  }

  if (!certificationsSection) {
    certificationsSection = createSection(
      "certificationsSection",
      "Certifications"
    );

    results.appendChild(certificationsSection);
  }

  return {
    projectsSection,
    publicationsSection,
    certificationsSection
  };
}

function applyURLState() {
  const params = new URLSearchParams(window.location.search);

  // Search
  if (params.has("search")) {
    searchBox.value = params.get("search");
  }

  // Toggles
  toggleProjects.checked = params.get("projects") !== "0";
  togglePublications.checked = params.get("papers") !== "0";
  toggleCertifications.checked = params.get("certs") !== "0";

  // A certification whose details panel should be open (applied after render).
  certPendingId = params.get("cert");

  // Tags
  if (params.has("tags")) {
    const tagsFromURL = params.get("tags").split(",");
    activeTags = new Set(tagsFromURL);
  }
}


function updateURL() {
  const params = new URLSearchParams();

  if (searchBox.value) {
    params.set("search", searchBox.value);
  }

  if (activeTags.size > 0) {
    params.set("tags", Array.from(activeTags).join(","));
  }

  params.set("projects", toggleProjects.checked ? "1" : "0");
  params.set("papers", togglePublications.checked ? "1" : "0");
  params.set("certs", toggleCertifications.checked ? "1" : "0");

  if (openCertId) {
    params.set("cert", openCertId);
  }

  const newURL = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, "", newURL);
}


// Keeps a tag's look (the "active" class) and what screen readers announce
// (aria-pressed) in sync, so "Perception, toggle button, pressed" is spoken.
function setTagActive(tag, isActive) {
  tag.classList.toggle("active", isActive);
  tag.setAttribute("aria-pressed", String(isActive));
}

function renderTags() {
  const availableTags = new Set(getAllTags());
  let tagsChanged = false;
  
  // Remove active filters that are no longer applicable.
  activeTags.forEach(tagName => {
    if (!availableTags.has(tagName)) {
      activeTags.delete(tagName);
      tagsChanged = true;
    }
  });

  if(tagsChanged)
  {
      updateURL();
  }

  /*
   * FIRST:
   * Record the current position of every existing tag.
   */
  const firstRects = new Map();

  tagContainer.querySelectorAll(".tag").forEach(tag => {
    firstRects.set(
      tag.dataset.tag,
      tag.getBoundingClientRect()
    );
  });

  /*
   * Get existing tags by name.
   */
  const existingTags = new Map(
    Array.from(tagContainer.querySelectorAll(".tag"))
      .map(tag => [tag.dataset.tag, tag])
  );

  /*
   * Remove tags that are no longer applicable.
   *
   * We remove them immediately so the remaining tags can
   * reflow into their final positions.
   */
  existingTags.forEach((tag, tagName) => {
    if (!availableTags.has(tagName)) {
      tag.remove();
    }
  });
  
  updateFilterCount();

  /*
   * Add/reorder tags in their desired order.
   */
  availableTags.forEach(tagName => {
    let tag = existingTags.get(tagName);

    if (!tag) {
      tag = document.createElement("span");

      tag.className = "tag";
      tag.dataset.tag = tagName;
      tag.textContent = tagName;
      tag.tabIndex = 0;
      tag.setAttribute("role", "button");

      tag.addEventListener("click", () => {
        if (activeTags.has(tagName)) {
          activeTags.delete(tagName);
        } else {
          activeTags.add(tagName);
        }

        setTagActive(tag, activeTags.has(tagName));

        updateFilterCount();
        updateURL();

        requestAnimationFrame(() => {
          render();
        });
      });

      tag.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tag.click();
        }
      });

      tagContainer.appendChild(tag);
    }

    setTagActive(tag, activeTags.has(tagName));

    /*
     * Re-appending an existing element moves it into the
     * desired order without recreating it.
     */
    tagContainer.appendChild(tag);
  });

  /*
   * LAST:
   * Animate existing tags from their old positions to their
   * new positions.
   */
  requestAnimationFrame(() => {
    if (prefersReducedMotion()) {
      return;
    }

    tagContainer.querySelectorAll(".tag").forEach(tag => {
      const first = firstRects.get(tag.dataset.tag);

      // Newly-created tags don't have an old position.
      if (!first) {
        return;
      }

      const last = tag.getBoundingClientRect();

      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;

      if (
        Math.abs(deltaX) < 1 &&
        Math.abs(deltaY) < 1
      ) {
        return;
      }

      tag.animate(
        [
          {
            transform:
              `translate(${deltaX}px, ${deltaY}px)`
          },
          {
            transform: "translate(0, 0)"
          }
        ],
        {
          duration: 300,
          easing: "cubic-bezier(.22, 1, .36, 1)"
        }
      );
    });
  });
}

function createCard(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();

  return wrapper.firstElementChild;
}

function scrollToPageTitle() {
  const title = document.getElementById("siteTitle");

  if (!title) {
    return;
  }

  title.scrollIntoView({
    behavior: scrollBehavior(),
    block: "start"
  });

  let lastY = window.scrollY;
  let stableFrames = 0;

  function checkScroll() {
    const currentY = window.scrollY;

    if (Math.abs(currentY - lastY) < 1) {
      stableFrames++;
    } else {
      stableFrames = 0;
    }

    lastY = currentY;

    if (stableFrames >= 4) {
      highlightPageTitle();
      return;
    }

    requestAnimationFrame(checkScroll);
  }

  requestAnimationFrame(checkScroll);
}

function matchesFilters(item) {
  // Trimmed so a trailing space (phone keyboards add one after autocomplete)
  // doesn't stop a name at the end of an author list from matching.
  const query = searchBox.value.trim().toLowerCase();

  // Projects have no venue and certifications have no authors, so those
  // fields may be missing.
  const matchesText =
    item.title.toLowerCase().includes(query) ||
    (item.authors || "").toLowerCase().includes(query) ||
    (item.venue || "").toLowerCase().includes(query) ||
    (item.issuer || "").toLowerCase().includes(query) ||
    item.keywords.some(k => k.toLowerCase().includes(query));

  const matchesTags =
    activeTags.size === 0 ||
    item.keywords.some(k => activeTags.has(k));

  return matchesText && matchesTags;
}

function restoreHighlightedCard() {
  const lastClickedCard =
    storageGet("sessionStorage", "lastClickedCard");

  if (!lastClickedCard) {
    return;
  }

  const card = document.querySelector(
    `[data-id="${lastClickedCard}"]`
  );

  if (!card) {
    return;
  }

  card.classList.add("highlighted");

  card.scrollIntoView({
    behavior: scrollBehavior(),
    block: "center"
  });

  setTimeout(() => {
    card.classList.remove("highlighted");
    storageRemove("sessionStorage", "lastClickedCard");
  }, 1800);
}

function updateFilterCount() {
  const count = activeTags.size;

  if (count === 0) {
    filterCount.textContent = "";
    filterToggle.classList.remove("has-filters");
  } else {
    filterCount.textContent = count;
    filterToggle.classList.add("has-filters");
  }
}

function openFilterPanel() {
  filtersOpen = true;

  filterToggle.setAttribute("aria-expanded", "true");
  filterPanel.classList.add("open");
}

function closeFilterPanel() {
  filtersOpen = false;

  filterToggle.setAttribute("aria-expanded", "false");
  filterPanel.classList.remove("open");
}

function toggleFilterPanel() {
  if (filtersOpen) {
    closeFilterPanel();
  } else {
    openFilterPanel();
  }
}

function highlightPageTitle() {
  const title = document.getElementById("siteTitle");

  if (!title) {
    return;
  }

  title.classList.remove("title-pop");

  // Force the browser to recognize this as a new animation cycle.
  void title.offsetWidth;

  title.classList.add("title-pop");

  setTimeout(() => {
    title.classList.remove("title-pop");
  }, 900);
}

function getVisualRows(tags) {
    const rows = [];

    tags.forEach(tag => {
        const rect = tag.getBoundingClientRect();

        // Find an existing row whose top is approximately the same.
        let row = rows.find(r =>
            Math.abs(r.top - rect.top) < 5
        );

        if (!row) {
            row = {
                top: rect.top,
                tags: []
            };

            rows.push(row);
        }

        row.tags.push({
            element: tag,
            rect
        });
    });

    // Make sure rows are ordered top-to-bottom.
    rows.sort((a, b) => a.top - b.top);

    // And tags within each row are ordered left-to-right.
    rows.forEach(row => {
        row.tags.sort((a, b) =>
            a.rect.left - b.rect.left
        );
    });

    return rows;
}

function animateLayoutChange(container, update) {
  const cards = Array.from(
    container.querySelectorAll(".card")
  );

  const firstPositions = new Map(
    cards.map(card => [
      card,
      card.getBoundingClientRect()
    ])
  );

  update();

  requestAnimationFrame(() => {
    if (prefersReducedMotion()) {
      return;
    }

    cards.forEach(card => {
      if (!card.isConnected) {
        return;
      }

      const first =
        firstPositions.get(card);

      const last =
        card.getBoundingClientRect();

      const deltaY =
        first.top - last.top;

      if (Math.abs(deltaY) < 1) {
        return;
      }

      card.animate(
        [
          {
            transform:
              `translateY(${deltaY}px)`
          },
          {
            transform:
              "translateY(0)"
          }
        ],
        {
          duration: 300,
          easing: "cubic-bezier(.22, 1, .36, 1)"
        }
      );
    });
  });
}

function createProjectCard(p) {
  var standardLink = p.link;

  var southeastconLink =
    p.link + '/ieeesoutheastcon2011presentation.pdf';

  var visualInterrogationLink =
    'https://www.projects.daybreakeducation.com/aToolForRapidVisualInterrogation/alerts.php';

  var gyrocopterCageMatchLink =
    p.link + '/finalProject.html';

  var radialLink =
    p.link + '/finalProject.html';

  var multivariateHydrologicalLink =
    p.link + '/multivariateHydrologicalDataVisualization.html';

  var plagiarismLink =
    p.link + '/plagiarismDetection.html';

  var standardCodeLink =
    '<a href="' + p.link + '.txt">Code</a>';

  var southeastconCodeLink =
    '<a href="' + p.link +
    '/ieeesoutheastcon2011report.pdf">Report</a>';

  var visualInterrogationCodeLink =
    'Code: <a href="' + p.link +
    '/alerts.txt">alerts.php</a>&nbsp;' +
    '<a href="' + p.link +
    '/query_alerts.txt">query_alerts.php</a>&nbsp;' +
    '<a href="' + p.link +
    '/alertslist.txt">alertlist.js</a>';

  var gyrocopterCageMatchCodeLink =
    'Code: <a href="' + p.link +
    '/gyrocopterCageMatch.txt">index.html</a>&nbsp;' +
    '<a href="' + p.link +
    '/gyrocopterCageMatch.pdf">Presentation</a>';

  var radialCodeLink =
    'Code: <a href="' + p.link +
    '/radialDataVisualization.txt">index.html</a>&nbsp;' +
    '<a href="' + p.link +
    '/projectPaper.pdf">Paper</a>&nbsp;' +
    '<a href="' + p.link +
    '/projectPresentation.pdf">Presentation</a>';

  var multivariateHydrologicalCodeLink =
    '<a href="' + p.link +
    '/multivariateHydrologicalDataVisualization.txt">Code</a>';

  var plagiarismCodeLink =
    'Code: <a href="' + p.link +
    '/plagiarismDetection.txt">index.html</a>&nbsp;' +
    '<a href="' + p.link +
    '/PlagiarismDetectionProjectReport.pdf">Paper</a>&nbsp;' +
    '<a href="' + p.link +
    '/PlagiarismDetectionVisualization.pdf">Presentation</a>';

  var websiteCodeLink =
    'Code: <a href="/index.txt">index.html</a>&nbsp;' +
    '<a href="/assets/site.js">site.js</a>&nbsp;' +
    '<a href="/assets/style.css">style.css</a>';

  let linkToCodeBlock = standardCodeLink;
  let directLink = standardLink;

  if (p.title === "IEEE SoutheastCon 2011 Hardware Competition") {
    directLink = southeastconLink;
    linkToCodeBlock = southeastconCodeLink;
  }
  else if (
    p.title ===
    "A Tool for Rapid Visual Interrogation & Triage of Alerts"
  ) {
    directLink = visualInterrogationLink;
    linkToCodeBlock = visualInterrogationCodeLink;
  }
  else if (p.title === "Airship Web Game") {
    directLink = gyrocopterCageMatchLink;
    linkToCodeBlock = gyrocopterCageMatchCodeLink;
  }
  else if (p.title === "Radial Data Visualization") {
    directLink = radialLink;
    linkToCodeBlock = radialCodeLink;
  }
  else if (
    p.title ===
    "Multivariate Hydrological Data Visualization"
  ) {
    directLink = multivariateHydrologicalLink;
    linkToCodeBlock = multivariateHydrologicalCodeLink;
  }
  else if (
    p.title ===
    "Plagiarism Detection Visualization"
  ) {
    directLink = plagiarismLink;
    linkToCodeBlock = plagiarismCodeLink;
  }
  else if (
    p.title ===
    "Portfolio Website"
  ) {
    directLink = p.link;
    linkToCodeBlock = websiteCodeLink;
  }

  const linkBlock =
    '<h3><a href="' + directLink + '">' +
    p.title + '&nbsp;(' + p.year + ') </a></h3>';

  const card = createCard(`
    <div class="card" id="asset-project-${p.id}" tabindex="0" role="link">
      ${linkBlock}

      ${p.authors ? `<p>${p.authors}</p>` : ""}

      <div class="card-links">
        ${linkToCodeBlock}
      </div>

      <p>${p.description}</p>

      <div class="chip-row">
        ${p.keywords
          .map(k => `<span class="tag small">${k}</span>`)
          .join("")}
      </div>
    </div>
  `);

if (p.title === "Portfolio Website") {
  const titleLink = card.querySelector("h3 a");

  if (titleLink) {
    titleLink.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToPageTitle();
    });
  }
}

  card.dataset.id = `project-${p.id}`;

  card.addEventListener("click", (e) => {
    if (e.target.tagName !== "A") {
      storageSet(
        "sessionStorage",
        "lastClickedCard",
        `project-${p.id}`
      );

      window.location = directLink;
    }
  });

  card.addEventListener("keydown", (e) => {
    if (e.target === card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      card.click();
    }
  });

  return card;
}

function createPublicationCard(p) {
  const card = createCard(`
    <div
      class="card"
      id="asset-publication-${p.id}"
      tabindex="0"
    >
      <h3>
        <a href="${p.link}">${p.title}</a>
      </h3>

      <p>${p.authors}</p>

      <p>
        <em>${p.venue}</em>, ${p.year}
      </p>

      <p>${p.description}</p>

      <div class="chip-row">
        ${p.keywords
          .map(k => `<span class="tag small">${k}</span>`)
          .join("")}
      </div>
    </div>
  `);

  card.dataset.id = `publication-${p.id}`;
  
  card.addEventListener("click", (e) => {
    if (e.target.tagName !== "A") {
      storageSet(
        "sessionStorage",
        "lastClickedCard",
        `publication-${p.id}`
      );

      window.location = p.link;
    }
  });

  card.addEventListener("keydown", (e) => {
    if (e.target === card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      card.click();
    }
  });

  return card;
}

function updateSectionCards(
  container,
  items,
  createCardFunction,
  type
) {
  animateLayoutChange(container, () => {

    const existingCards =
      new Map(
        Array.from(container.querySelectorAll(".card"))
          .map(card => [
            card.dataset.id,
            card
          ])
      );

    const newIDs =
      new Set(
        items.map(item => `${type}-${item.id}`)
      );

    // Remove cards that no longer match.
    existingCards.forEach((card, id) => {
      if (!newIDs.has(id)) {
        removeCard(card);
      }
    });

    // Add/reorder cards.
    items.forEach((item, index) => {
      const id = `${type}-${item.id}`;

      let card = existingCards.get(id);

      if (!card) {
        card = createCardFunction(item);
        card.classList.add("card-enter");

        container.appendChild(card);

        requestAnimationFrame(() => {
          card.classList.remove("card-enter");
        });
      }
      else {
        // The card may still be mid-exit from a previous filter.
        reviveCard(card);
      }

      const currentCard =
        container.children[index];

      if (currentCard !== card) {
        container.insertBefore(
          card,
          currentCard || null
        );
      }
    });
  });
}

// Slightly longer than the 240ms CSS exit transition.
const CARD_EXIT_MS = 260;

function removeCard(card) {
  if (card.exitTimer) {
    return;
  }

  card.classList.add("card-exit");

  // A timer is used instead of "transitionend" because that event
  // never fires when transitions are disabled (e.g. Reduce Motion).
  card.exitTimer = setTimeout(() => {
    card.remove();
  }, CARD_EXIT_MS);
}

function reviveCard(card) {
  if (!card.exitTimer) {
    return;
  }

  clearTimeout(card.exitTimer);
  card.exitTimer = null;
  card.classList.remove("card-exit");
}

// -------------------------------------------------------------------------
// Certifications: a row of flair badges. Clicking one opens its details panel
// directly beneath it ("break-out"): the selected flair moves to the left edge
// of its own row, the panel opens under it, and the rest of the row continues
// after the panel. The page scrolls by the amount the flair was pushed down,
// so the selected flair stays where the eye already is while earlier flairs
// slide up out of the way.
// -------------------------------------------------------------------------
const CERT_EASE = "cubic-bezier(.22, 1, .36, 1)";

let openCertId = null;     // id of the certification whose panel is open
let certPanel = null;      // the open panel element
let certPendingId = null;  // ?cert= from the address, applied after rendering

function getCertGrid() {
  return document.getElementById("certGrid");
}

function getCertFlairs() {
  const grid = getCertGrid();

  return grid ? Array.from(grid.querySelectorAll(".cert-item")) : [];
}

function findCertFlair(id) {
  return getCertFlairs().find(flair => flair.dataset.id === id) || null;
}

function todayISO() {
  const now = new Date();

  return now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0");
}

function formatCertDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// Worked out from the dates, so a lapsed credential never shows as current.
function getCertStatus(cert, today = todayISO()) {
  if (!cert.expires) {
    return { state: "none", text: "No expiry" };
  }

  if (today > cert.expires) {
    return { state: "expired", text: "Expired " + formatCertDate(cert.expires) };
  }

  return { state: "active", text: "Active · expires " + formatCertDate(cert.expires) };
}

function createCertFlair(cert) {
  const status = getCertStatus(cert);
  const expired = status.state === "expired";

  const flair = document.createElement("div");
  flair.className = "cert-item";
  flair.dataset.id = cert.id;

  // The caption is the button's accessible name, so the image is decorative.
  flair.innerHTML = `
    <button class="flair-btn${expired ? " expired" : ""}" type="button" aria-expanded="false">
      <span class="flair-disc">
        <img src="${cert.flair}" alt="" width="480" height="480" loading="lazy" decoding="async">
      </span>
      <span class="flair-cap">${cert.caption}</span>
      <span class="flair-sub">${cert.issuer}${expired ? " &middot; Expired" : ""}</span>
    </button>
  `;

  flair.querySelector(".flair-btn").addEventListener("click", () => {
    toggleCertPanel(cert.id);
  });

  return flair;
}

function createCertPanel(cert) {
  const status = getCertStatus(cert);

  const panel = document.createElement("div");
  panel.className = "cert-panel";
  panel.id = `cert-panel-${cert.id}`;
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-labelledby", `cert-title-${cert.id}`);

  const links = cert.links.map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label} &#8599;</a>`
  ).join("");

  panel.innerHTML = `
    <div class="cert-card">
      <button class="cert-close" type="button" aria-label="Close details">&times;</button>

      <h3 id="cert-title-${cert.id}">${cert.title}</h3>

      <div class="cert-meta">
        <span class="cert-chip">${cert.kind}</span>
        <span class="cert-chip cert-status-${status.state}">${status.text}</span>
      </div>

      <p class="cert-line">${cert.issuer} &middot; Earned ${formatCertDate(cert.earned)}</p>

      <p>${cert.description}</p>

      ${links ? `<div class="cert-links">${links}</div>` : ""}

      <div class="chip-row">
        ${cert.keywords.map(k => `<span class="tag small">${k}</span>`).join("")}
      </div>
    </div>
  `;

  panel.querySelector(".cert-close").addEventListener("click", () => {
    const id = openCertId;

    closeCertPanel();
    focusCertFlair(id);
  });

  return panel;
}

// Where every flair is now (including any animation in flight), after which
// running animations are cancelled so the new layout can be measured cleanly.
function snapshotCertFlairs() {
  const flairs = getCertFlairs();
  const rects = new Map();

  flairs.forEach(flair => rects.set(flair, flair.getBoundingClientRect()));
  flairs.forEach(flair => flair.getAnimations().forEach(a => a.cancel()));

  return rects;
}

// Slide each flair from where it was to where it is now.
function playCertFlip(first, duration) {
  if (prefersReducedMotion()) {
    return;
  }

  getCertFlairs().forEach(flair => {
    const before = first.get(flair);

    // Newly-created flairs have no previous position.
    if (!before) {
      return;
    }

    const after = flair.getBoundingClientRect();
    const deltaX = before.left - after.left;
    const deltaY = before.top - after.top;

    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
      return;
    }

    flair.animate(
      [
        { transform: `translate(${deltaX}px, ${deltaY}px)` },
        { transform: "none" }
      ],
      { duration, easing: CERT_EASE }
    );
  });
}

// A panel that has already left the layout fades out where it was.
function fadeOutCertPanelCopy(panel) {
  if (prefersReducedMotion()) {
    return;
  }

  const grid = getCertGrid();
  const gridRect = grid.getBoundingClientRect();
  const rect = panel.getBoundingClientRect();
  const copy = panel.cloneNode(true);

  copy.removeAttribute("id");
  copy.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
  copy.setAttribute("aria-hidden", "true");
  copy.inert = true;

  Object.assign(copy.style, {
    position: "absolute",
    left: `${rect.left - gridRect.left}px`,
    top: `${rect.top - gridRect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    zIndex: "3",
    pointerEvents: "none"
  });

  grid.appendChild(copy);

  const fade = copy.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    { duration: 260, easing: "ease-out", fill: "forwards" }
  );

  fade.onfinish = () => copy.remove();
}

// The little pointer on the panel's top edge sits under the selected flair.
function setCertCaret() {
  if (!certPanel || !openCertId) {
    return;
  }

  const flair = findCertFlair(openCertId);

  if (!flair) {
    return;
  }

  // offsetLeft/offsetWidth describe where the flair sits in the layout and
  // ignore transforms, so this stays correct even while the flair is still
  // sliding into place (getBoundingClientRect would report its position
  // mid-animation).
  const disc = flair.querySelector(".flair-disc");
  const centre = flair.offsetLeft + disc.offsetLeft + disc.offsetWidth / 2;

  certPanel.style.setProperty("--caret-x", `${centre}px`);
}

function syncCertAria() {
  getCertFlairs().forEach(flair => {
    const button = flair.querySelector(".flair-btn");
    const isOpen = flair.dataset.id === openCertId;

    button.setAttribute("aria-expanded", String(isOpen));

    if (isOpen && certPanel) {
      button.setAttribute("aria-controls", certPanel.id);
    } else {
      button.removeAttribute("aria-controls");
    }
  });
}

function focusCertFlair(id) {
  const flair = findCertFlair(id);

  if (flair) {
    flair.querySelector(".flair-btn").focus();
  }
}

// userInitiated: false is used when the page opens or closes a panel by
// itself (a shared link, a filter hiding it), which skips the motion.
function openCertPanel(id, { userInitiated = true } = {}) {
  const cert = certifications.find(c => c.id === id);
  const flair = findCertFlair(id);

  if (!cert || !flair || openCertId === id) {
    return;
  }

  const first = userInitiated ? snapshotCertFlairs() : null;
  const previousFlair = openCertId ? findCertFlair(openCertId) : null;

  if (certPanel) {
    if (first) {
      fadeOutCertPanelCopy(certPanel);
    }

    certPanel.remove();
  }

  if (previousFlair) {
    previousFlair.classList.remove("breakout");
  }

  flair.classList.add("breakout");

  const panel = createCertPanel(cert);
  flair.after(panel);

  certPanel = panel;
  openCertId = id;

  syncCertAria();
  setCertCaret();

  if (first) {
    // The layout pushed the selected flair down a row; scroll by the same
    // amount so it stays where it was on screen.
    const shift = flair.getBoundingClientRect().top - first.get(flair).top;

    if (Math.abs(shift) > 0.5) {
      window.scrollBy(0, shift);
    }

    setCertCaret();
    playCertFlip(first, 460);

    if (!prefersReducedMotion()) {
      panel.animate(
        [
          { clipPath: "inset(0 0 100% 0)", opacity: 0 },
          { clipPath: "inset(0 0 0 0)", opacity: 1 }
        ],
        { duration: 420, easing: CERT_EASE }
      );
    }
  }

  updateURL();
}

function closeCertPanel({ userInitiated = true } = {}) {
  if (!openCertId || !certPanel) {
    return;
  }

  const flair = findCertFlair(openCertId);
  const first = userInitiated ? snapshotCertFlairs() : null;

  if (first) {
    fadeOutCertPanelCopy(certPanel);
  }

  certPanel.remove();
  certPanel = null;
  openCertId = null;

  if (flair) {
    flair.classList.remove("breakout");
  }

  syncCertAria();

  if (first && flair) {
    const shift = flair.getBoundingClientRect().top - first.get(flair).top;

    if (Math.abs(shift) > 0.5) {
      window.scrollBy(0, shift);
    }

    playCertFlip(first, 420);
  }

  updateURL();
}

function toggleCertPanel(id) {
  if (openCertId === id) {
    closeCertPanel();
  } else {
    openCertPanel(id);
  }
}

// Brings the flair row in line with the current filters.
function updateCertifications(items) {
  const content = document
    .getElementById("certificationsSection")
    .querySelector(".section-content");

  let grid = getCertGrid();

  if (!grid) {
    content.innerHTML =
      '<div class="cert-wrap"><div class="cert-grid" id="certGrid"></div></div>';

    grid = getCertGrid();

    // The flair size (and so the caret position) changes with the width.
    new ResizeObserver(setCertCaret).observe(grid);
  }

  const wanted = new Set(items.map(cert => cert.id));

  // A filter that hides the open certification closes its panel.
  if (openCertId && !wanted.has(openCertId)) {
    closeCertPanel({ userInitiated: false });
  }

  const hadFlairs = getCertFlairs().length > 0;
  const first = hadFlairs ? snapshotCertFlairs() : null;

  const existing = new Map(
    getCertFlairs().map(flair => [flair.dataset.id, flair])
  );

  existing.forEach((flair, id) => {
    if (!wanted.has(id)) {
      flair.remove();
    }
  });

  const added = [];
  const ordered = [];

  items.forEach(cert => {
    let flair = existing.get(cert.id);

    if (!flair) {
      flair = createCertFlair(cert);
      added.push(flair);
    }

    ordered.push(flair);

    // The open panel always stays right after its flair.
    if (certPanel && openCertId === cert.id) {
      ordered.push(certPanel);
    }
  });

  ordered.forEach((node, index) => {
    if (grid.children[index] !== node) {
      grid.insertBefore(node, grid.children[index] || null);
    }
  });

  syncCertAria();
  setCertCaret();

  if (first && !prefersReducedMotion()) {
    playCertFlip(first, 300);

    added.forEach(flair => {
      flair.animate(
        [
          { opacity: 0, transform: "scale(.9)" },
          { opacity: 1, transform: "none" }
        ],
        { duration: 300, easing: CERT_EASE }
      );
    });
  }
}

// Opens (or closes) the panel named by ?cert= in the address.
function applyPendingCert() {
  const id = certPendingId;
  certPendingId = null;

  if (!id) {
    if (openCertId) {
      closeCertPanel({ userInitiated: false });
    }

    return;
  }

  if (id === openCertId || !findCertFlair(id)) {
    return;
  }

  openCertPanel(id, { userInitiated: false });

  findCertFlair(id).scrollIntoView({
    behavior: scrollBehavior(),
    block: "center"
  });
}

function render() {
  const {
    projectsSection,
    publicationsSection,
    certificationsSection
  } = ensureSections();

  const projectsContent =
    projectsSection.querySelector(".section-content");

  const publicationsContent =
    publicationsSection.querySelector(".section-content");


  // -------------------------
  // Projects
  // -------------------------

  if (toggleProjects.checked) {

    const visibleProjects =
      projects.filter(matchesFilters);

    updateSectionCards(
      projectsContent,
      visibleProjects,
      createProjectCard,
      "project"
    );

    if (visibleProjects.length > 0) {
      projectsSection.classList.remove("section-hidden");
    }
    else {
      projectsSection.classList.add("section-hidden");
    }
  }
  else {
    projectsSection.classList.add("section-hidden");
  }


  // -------------------------
  // Publications
  // -------------------------

  if (togglePublications.checked) {

    const visiblePublications =
      publications.filter(matchesFilters);

    updateSectionCards(
      publicationsContent,
      visiblePublications,
      createPublicationCard,
      "publication"
    );

    if (visiblePublications.length > 0) {
      publicationsSection.classList.remove("section-hidden");
    }
    else {
      publicationsSection.classList.add("section-hidden");
    }
  }
  else {
    publicationsSection.classList.add("section-hidden");
  }


  // -------------------------
  // Certifications
  // -------------------------

  if (toggleCertifications.checked) {

    const visibleCertifications =
      certifications.filter(matchesFilters);

    updateCertifications(visibleCertifications);

    if (visibleCertifications.length > 0) {
      certificationsSection.classList.remove("section-hidden");
    }
    else {
      certificationsSection.classList.add("section-hidden");
    }
  }
  else {
    if (openCertId) {
      closeCertPanel({ userInitiated: false });
    }

    certificationsSection.classList.add("section-hidden");
  }
}


tagContainer.addEventListener("keydown", (e) => {
  if (!tagContainer.offsetParent) {
    return;
}
  const currentTag = document.activeElement;
  const tags = Array.from(tagContainer.querySelectorAll(".tag"));
  const currentIndex = tags.indexOf(currentTag);

  if (currentIndex === -1) return;

  // Enter and Space are handled by each tag's own keydown listener; handling
  // them here too clicked the tag twice, which cancelled out.

  // Left / Right navigation.
  if (e.key === "ArrowRight") {
    if (currentIndex < tags.length - 1) {
      e.preventDefault();
      tags[currentIndex + 1].focus();
    }
    return;
  }

  if (e.key === "ArrowLeft") {
    if (currentIndex > 0) {
      e.preventDefault();
      tags[currentIndex - 1].focus();
    }
    return;
  }
  
  if (
        e.key !== "ArrowDown" &&
        e.key !== "ArrowUp"
    ) {
        return;
    }

    e.preventDefault();

    const rows = getVisualRows(tags);

    // Find the row containing the current tag.
    const currentRowIndex = rows.findIndex(row =>
        row.tags.some(item => item.element === currentTag)
    );

    if (currentRowIndex === -1) {
        return;
    }

    const currentRect =
        currentTag.getBoundingClientRect();

    let targetRowIndex;

    if (e.key === "ArrowDown") {
        targetRowIndex = currentRowIndex + 1;
    } else {
        targetRowIndex = currentRowIndex - 1;
    }

    // No row in that direction.
    if (
        targetRowIndex < 0 ||
        targetRowIndex >= rows.length
    ) {
        return;
    }

    const targetRow = rows[targetRowIndex];

    // Find the tag in the target row whose horizontal
    // position is closest to the current tag.
    const target = targetRow.tags.reduce(
        (closest, candidate) => {
            const currentDistance =
                Math.abs(
                    candidate.rect.left -
                    currentRect.left
                );

            const closestDistance =
                Math.abs(
                    closest.rect.left -
                    currentRect.left
                );

            return currentDistance < closestDistance
                ? candidate
                : closest;
        }
    );

    e.preventDefault();
    target.element.focus();
});


document.addEventListener("keydown", (e) => {
  // Esc closes the topmost thing that is open (the filter list, then a
  // certification panel) and clears the filters only when nothing is open.
  if (e.key === "Escape") {
    if(filtersOpen)
    {
        closeFilterPanel();
    }
    else if (openCertId)
    {
        const id = openCertId;

        closeCertPanel();
        focusCertFlair(id);

        return;
    }
    else
    {
        searchBox.value = "";
        activeTags.clear();
        toggleProjects.checked = true;
        togglePublications.checked = true;
        toggleCertifications.checked = true;
        history.replaceState(null, "", window.location.pathname);
    }

    renderTags();
    render();
  }

  // "/" focuses search (like GitHub)
  if (e.key === "/" && document.activeElement !== searchBox) {
    e.preventDefault();
    searchBox.focus();
  }
});

filterToggle.addEventListener(
  "click",
  toggleFilterPanel
);

document.addEventListener("click", e => {
  if (!filtersOpen) {
    return;
  }

  if (
    !filterPanel.contains(e.target) &&
    !filterToggle.contains(e.target)
  ) {
    closeFilterPanel();
  }
});

searchBox.addEventListener("input", () => {
  updateURL();
  render();
});

toggleProjects.addEventListener("change", () => {
  renderTags();
  updateURL();
  render();
});

togglePublications.addEventListener("change", () => {
  renderTags();
  updateURL();
  render();
});

toggleCertifications.addEventListener("change", () => {
  renderTags();
  updateURL();
  render();
});

window.addEventListener("popstate", () => {
  applyURLState();
  renderTags();
  render();
  applyPendingCert();
});

window.addEventListener("pageshow", () => {
    restoreHighlightedCard();
});

applyURLState();
renderTags();
render();
applyPendingCert();
document.documentElement.classList.add("js-ready");