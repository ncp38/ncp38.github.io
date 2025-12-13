const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

const toggleProjects = document.getElementById("toggleProjects");
const togglePublications = document.getElementById("togglePublications");

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

function getAllTags() {
  const tags = new Set();
  projects.forEach(p => p.keywords.forEach(k => tags.add(k)));
  publications.forEach(p => p.keywords.forEach(k => tags.add(k)));
  return Array.from(tags).sort();
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
  tagContainer.innerHTML = "";
  getAllTags().forEach(tag => {
    const chip = document.createElement("span");
    chip.className = "tag";
    chip.textContent = tag;

    chip.onclick = () => {
      chip.classList.toggle("active");

      if (activeTags.has(tag)) {
        activeTags.delete(tag);
      } else {
        activeTags.add(tag);
      }
      render();
    }; 
	
	function toggle() {
	  chip.classList.toggle("active");

	  chip.setAttribute(
		"aria-pressed",
		chip.classList.contains("active")
	  );

	  if (activeTags.has(tag)) {
		activeTags.delete(tag);
	  } else {
		activeTags.add(tag);
	  }
	  updateURL();
	  render();
	}
	
	chip.tabIndex = 0;
	chip.setAttribute("role", "button");
	const isActive = activeTags.has(tag);
	chip.classList.toggle("active", isActive);
	chip.setAttribute("aria-pressed", isActive); 

	//if (index === 0) currentTagIndex = 0;

	chip.onclick = toggle;
	chip.onkeydown = (e) => {
	  if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		toggle();
	  }
	};

    tagContainer.appendChild(chip);
  });
}

function createCard(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();
  const card = wrapper.firstChild;

  card.classList.add("enter");
  requestAnimationFrame(() => {
    card.classList.remove("enter");
  });

  return card;
}

function matchesFilters(item) {
  const query = searchBox.value.toLowerCase();

  const matchesText =
    item.title.toLowerCase().includes(query) ||
    item.keywords.some(k => k.includes(query));

  const matchesTags =
    activeTags.size === 0 ||
    item.keywords.some(k => activeTags.has(k));

  return matchesText && matchesTags;
}

function render() {
  const oldCards = Array.from(results.children);

  // Animate out existing cards
  oldCards.forEach(card => card.classList.add("exit"));

  setTimeout(() => {
    results.innerHTML = "";

	  if (toggleProjects.checked) {
	  projects.filter(matchesFilters).forEach(p => {
		const currentFilters = encodeURIComponent(window.location.search || "");
		const card = createCard(`
		  <div class="card">
			<h3><a href="${p.link}?ref=${currentFilters}">${p.title}</a></h3>
			<p>${p.description}</p>
			<div class="chip-row">
			  ${p.keywords.map(k => `<span class="tag small">${k}</span>`).join("")}
			</div>
		  </div>
		`);
		results.appendChild(card);
	  });
	  }

    if (togglePublications.checked) {
      publications.filter(matchesFilters).forEach(p => {
        const card = createCard(`
          <div class="card" tabindex="0">
            <h3><a href="${p.link}?ref=${currentFilters}">${p.title}</a>${p.title}</h3>
            <p>${p.authors}</p>
            <p><em>${p.venue}</em>, ${p.year}</p>
            <div class="chip-row">
              ${p.keywords.map(k => `<span class="tag small">${k}</span>`).join("")}
            </div>
          </div>
        `);
        results.appendChild(card);
      });
    }

  }, 180); // matches CSS transition duration
}

tagContainer.addEventListener("keydown", (e) => {
  const tags = Array.from(tagContainer.querySelectorAll(".tag"));
  const currentIndex = tags.indexOf(document.activeElement);

  if (currentIndex === -1) return;

  let nextIndex = currentIndex;

  if (e.key === "ArrowRight") nextIndex++;
  if (e.key === "ArrowLeft") nextIndex--;
  if (e.key === "ArrowDown") nextIndex += 4; // grid-friendly
  if (e.key === "ArrowUp") nextIndex -= 4;

  if (tags[nextIndex]) {
    tags[nextIndex].focus();
    e.preventDefault();
  }
});


document.addEventListener("keydown", (e) => {
  // Esc clears filters
  if (e.key === "Escape") {
    searchBox.value = "";
    activeTags.clear();
	toggleProjects.checked = true;
	togglePublications.checked = true;

	history.replaceState(null, "", window.location.pathname);

	renderTags();
	render();
  }

  // "/" focuses search (like GitHub)
  if (e.key === "/" && document.activeElement !== searchBox) {
    e.preventDefault();
    searchBox.focus();
  }
});




searchBox.addEventListener("input", () => {
  updateURL();
  render();
});

toggleProjects.addEventListener("change", () => {
  updateURL();
  render();
});

togglePublications.addEventListener("change", () => {
  updateURL();
  render();
});

window.addEventListener("popstate", () => {
  applyURLState();
  renderTags();
  render();
});

applyURLState();
renderTags();
render();
