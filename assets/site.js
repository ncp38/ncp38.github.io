const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

const toggleProjects = document.getElementById("toggleProjects");
const togglePublications = document.getElementById("togglePublications");

const filterToggle =
  document.getElementById("filterToggle");

const filterPanel =
  document.getElementById("filterPanel");

const filterCount =
  document.getElementById("filterCount");
  
let filtersOpen = false;

const tagContainer = document.getElementById("tagContainer");
let activeTags = new Set();

const darkModeToggle = document.getElementById("darkModeToggle");
const savedTheme = localStorage.getItem("theme") || "light";
darkModeToggle.setAttribute("aria-pressed", savedTheme === "dark");

darkModeToggle.onclick = () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "light" ? "dark" : "light");
};

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  darkModeToggle.setAttribute("aria-pressed", theme === "dark");
}
setTheme(savedTheme);


function getVisibleItems() {
  const items = [];

  if (toggleProjects.checked) {
    items.push(...projects);
  }

  if (togglePublications.checked) {
    items.push(...publications);
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
    <div class="section-header">
      <h2>${title}</h2>
      <div class="divider"></div>
    </div>
    <div class="section-content"></div>
  `;

  return section;
}

function ensureSections() {
  let projectsSection =
    document.getElementById("projectsSection");

  let publicationsSection =
    document.getElementById("publicationsSection");

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

  return {
    projectsSection,
    publicationsSection
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

  const newURL = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, "", newURL);
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

      tag.className = "tag tag-enter";
      tag.dataset.tag = tagName;
      tag.textContent = tagName;
      tag.tabIndex = 0;
      tag.setAttribute("role", "button");

      tag.addEventListener("click", () => {
        if (activeTags.has(tagName)) {
          activeTags.delete(tagName);
          tag.classList.remove("active");
        } else {
          activeTags.add(tagName);
          tag.classList.add("active");
        }

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

      /*
       * Newly-created tags start small/invisible and then
       * transition into their normal state.
       */
      requestAnimationFrame(() => {
        tag.classList.remove("tag-enter");
      });
    }

    tag.classList.toggle(
      "active",
      activeTags.has(tagName)
    );

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
    behavior: "smooth",
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
  const query = searchBox.value.toLowerCase();

  const matchesText =
    item.title.toLowerCase().includes(query) ||
    item.keywords.some(k => k.toLowerCase().includes(query));

  const matchesTags =
    activeTags.size === 0 ||
    item.keywords.some(k => activeTags.has(k));

  return matchesText && matchesTags;
}

function restoreHighlightedCard() {
  const lastClickedCard =
    sessionStorage.getItem("lastClickedCard");

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
    behavior: "smooth",
    block: "center"
  });

  setTimeout(() => {
    card.classList.remove("highlighted");
    sessionStorage.removeItem("lastClickedCard");
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

function hideSection(section) {
  section.classList.add("section-hidden");
}

function showSection(section) {
  section.classList.remove("section-hidden");
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
    '/alertlist.txt">alertlist.js</a>';

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
    p.title + '&nbsp(' + p.year + ') </a></h3>';

  const card = createCard(`
    <div class="card" id="asset-project-${p.id}" tabindex="0" role="link">
      ${linkBlock}

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
      sessionStorage.setItem(
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
      sessionStorage.setItem(
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

function removeCard(card) {
  card.classList.add("card-exit");

  card.addEventListener(
    "transitionend",
    () => {
      card.remove();
    },
    { once: true }
  );
}

function render() {
  const {
    projectsSection,
    publicationsSection
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
}


tagContainer.addEventListener("keydown", (e) => {
  if (!tagContainer.offsetParent) {
    return;
}
  const currentTag = document.activeElement;
  const tags = Array.from(tagContainer.querySelectorAll(".tag"));
  const currentIndex = tags.indexOf(currentTag);

  if (currentIndex === -1) return;
  
  if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        currentTag.click();
        return;
    }

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
  // Esc clears filters
  if (e.key === "Escape") {
	if(filtersOpen)
	{
		closeFilterPanel();
	}
	else
	{
		searchBox.value = "";
		activeTags.clear();
		toggleProjects.checked = true;
		togglePublications.checked = true;
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

window.addEventListener("popstate", () => {
  applyURLState();
  renderTags();
  render();
});

window.addEventListener("pageshow", () => {
    restoreHighlightedCard();
});

applyURLState();
renderTags();
render();
document.documentElement.classList.add("js-ready");