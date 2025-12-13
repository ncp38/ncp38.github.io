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
  darkModeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  darkModeToggle.setAttribute("aria-pressed", theme === "dark");
}
setTheme(savedTheme);

function getAllTags() {
  const tags = new Set();
  projects.forEach(p => p.keywords.forEach(k => tags.add(k)));
  publications.forEach(p => p.keywords.forEach(k => tags.add(k)));
  return Array.from(tags).sort();
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
	  render();
	}
	
	chip.tabIndex = 0;
	chip.setAttribute("role", "button");
	chip.setAttribute("aria-pressed", "false");

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
        const card = createCard(`
          <div class="card" tabindex="0">
            <h3><a href="${p.link}">${p.title}</a></h3>
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
            <h3>${p.title}</h3>
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

    document
      .querySelectorAll(".tag.active")
      .forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-pressed", "false");
      });

    render();
  }

  // "/" focuses search (like GitHub)
  if (e.key === "/" && document.activeElement !== searchBox) {
    e.preventDefault();
    searchBox.focus();
  }
});




searchBox.addEventListener("input", render);
toggleProjects.addEventListener("change", render);
togglePublications.addEventListener("change", render);

renderTags();
render();
