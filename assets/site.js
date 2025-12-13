const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

const toggleProjects = document.getElementById("toggleProjects");
const togglePublications = document.getElementById("togglePublications");

const tagContainer = document.getElementById("tagContainer");
let activeTags = new Set();

const darkModeToggle = document.getElementById("darkModeToggle");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  darkModeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

darkModeToggle.onclick = () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "light" ? "dark" : "light");
};

const savedTheme = localStorage.getItem("theme") || "light";
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

    tagContainer.appendChild(chip);
  });
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
  results.innerHTML = "";

  if (toggleProjects.checked) {
    projects.filter(matchesFilters).forEach(p => {
      results.innerHTML += `
        <div class="card">
          <h3><a href="${p.link}">${p.title}</a></h3>
          <p>${p.description}</p>
          <div class="chip-row">
            ${p.keywords.map(k => `<span class="tag small">${k}</span>`).join("")}
          </div>
        </div>
      `;
    });
  }

  if (togglePublications.checked) {
    publications.filter(matchesFilters).forEach(p => {
      results.innerHTML += `
        <div class="card">
          <h3>${p.title}</h3>
          <p>${p.authors}</p>
          <p><em>${p.venue}</em>, ${p.year}</p>
          <div class="chip-row">
            ${p.keywords.map(k => `<span class="tag small">${k}</span>`).join("")}
          </div>
        </div>
      `;
    });
  }
}


searchBox.addEventListener("input", render);
toggleProjects.addEventListener("change", render);
togglePublications.addEventListener("change", render);

renderTags();
render();
