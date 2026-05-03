const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

const toggleProjects = document.getElementById("toggleProjects");
const togglePublications = document.getElementById("togglePublications");
const listOfProgrammingLanguages = ["c", "c++", "c#", "java", "python"];

const compoundFilters = [
  {
    id: "languages",
    label: "Programming Languages",
    tags: listOfProgrammingLanguages
  }
];

const compoundContainer =
  document.getElementById("compoundFilters");

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

function closeAllCompoundPanels() {
  document.querySelectorAll(".compound-panel").forEach(panel => {
    panel.hidden = true;
    panel.previousElementSibling
      ?.setAttribute("aria-expanded", "false");
  });
}

function renderCompoundFilters() {
  compoundContainer.innerHTML = "";

  compoundFilters.forEach(filter => {
    const isActive = filter.tags.some(t => activeTags.has(t));

    const wrapper = document.createElement("div");
    wrapper.className = "compound-filter";

    wrapper.innerHTML = `
      <button
        class="compound-btn ${isActive ? "active" : ""}"
        aria-expanded="false"
        aria-haspopup="true"
        aria-label="${filter.label}">
        ${filter.label}
      </button>

      <div class="compound-panel" hidden>
        ${filter.tags.map(tag => `
          <button
            class="compound-option ${activeTags.has(tag) ? "active" : ""}"
            data-tag="${tag}"
            aria-pressed="${activeTags.has(tag)}">
            ${tag.toUpperCase()}
          </button>
        `).join("")}
      </div>
    `;

    compoundContainer.appendChild(wrapper);
  });
}

function render() {
  const oldCards = Array.from(results.children);

  
  // Animate out existing cards
  oldCards.forEach(card => card.classList.add("exit"));
  
  //renderCompoundFilters();

  setTimeout(() => {
    results.innerHTML = "";
	results.append('<div class="section"><div class="section-header"><h2>Projects</h2><div class="divider"></div></div>');

	  if (toggleProjects.checked) {
	  projects.filter(matchesFilters).forEach(p => {
		const currentFilters = encodeURIComponent(window.location.search || "");
		
		//var standardLinkBlock = '<h3><a href="' + p.link + '.pdf?ref=' + currentFilters + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		var standardLink = p.link;
		var southeastconLink =  p.link + '/ieeesoutheastcon2011presentation.pdf';
		var visualInterrogationLink = 'https://www.projects.daybreakeducation.com/aToolForRapidVisualInterrogation/alerts.php';
		var gyrocopterCageMatchLink = p.link + '/finalProject.html';
		var radialLink = p.link + '/finalProject.html';
		var multivariateHydrologicalLink = p.link + '/multivariateHydrologicalDataVisualization.html';
		var plagiarismLink = p.link + '/plagiarismDetection.html';
		
		/*var standardLinkBlock = '<h3><a href="' + standardLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		var southeastconLinkBlock = '<h3><a href="' + southeastconLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		var visualInterrogationLinkBlock = '<h3><a href="' + visualInterrogationLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		var gyrocopterCageMatchLinkBlock = '<h3><a href="' + gyrocopterCageMatchLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		var radialLinkBlock = '<h3><a href="' + radialLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		var multivariateHydrologicalLinkBlock = '<h3><a href="' + multivariateHydrologicalLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		var plagiarismLinkBlock = '<h3><a href="' + plagiarismLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';*/

		var standardCodeLink = '<a href="' + p.link + '.txt">Code</a>';
		var southeastconCodeLink = '<a href="' + p.link + '/ieeesoutheastcon2011report.pdf">Report</a>';
		var visualInterrogationCodeLink = 'Code: <a href="' + p.link + '/alerts.txt">alerts.php</a>&nbsp<a href="' + p.link + '/query_alerts.txt">query_alerts.php</a>&nbsp<a href="' + p.link + '/alertlist.txt">alertlist.js</a>';
		var gyrocopterCageMatchCodeLink = 'Code: <a href="' + p.link + '/gyrocopterCageMatch.txt">index.html</a>&nbsp<a href="' + p.link + '/gyrocopterCageMatch.pdf">Presentation</a>';
		var radialCodeLink = 'Code: <a href="' + p.link + '/radialDataVisualization.txt">index.html</a>&nbsp<a href="' + p.link + '/projectPaper.pdf">Paper</a>&nbsp<a href="' + p.link + '/projectPresentation.pdf">Presentation</a>';
		var multivariateHydrologicalCodeLink = '<a href="' + p.link + '/multivariateHydrologicalDataVisualization.txt">Code</a>';
		var plagiarismCodeLink = 'Code: <a href="' + p.link + '/plagiarismDetection.txt">index.html</a>&nbsp<a href="' + p.link + '/PlagiarismDetectionProjectReport.pdf">Paper</a>&nbsp<a href="' + p.link + '/PlagiarismDetectionVisualization.pdf">Presentation</a>';
		
		//Standard Card clickable link and code-specific link
		//let linkBlock = standardLinkBlock;
		let linkToCodeBlock = standardCodeLink;
		let directLink = standardLink;
		
		//Specific modified links for certain projects.
		if(p.title == "IEEE SoutheastCon 2011 Hardware Competition")
		{
			directLink = southeastconLink;
			linkToCodeBlock = southeastconCodeLink;
		}
		else if(p.title == "A Tool for Rapid Visual Interrogation & Triage of Alerts")
		{
			directLink = visualInterrogationLink;
			linkToCodeBlock = visualInterrogationCodeLink;
		}
		else if(p.title == "Airship Web Game")
		{
			directLink = gyrocopterCageMatchLink;
			linkToCodeBlock = gyrocopterCageMatchCodeLink;
		}
		else if(p.title == "Radial Data Visualization")
		{
			directLink = radialLink;
			linkToCodeBlock = radialCodeLink;
		}
		else if(p.title == "Multivariate Hydrological Data Visualization")
		{
			directLink = multivariateHydrologicalLink;
			linkToCodeBlock = multivariateHydrologicalCodeLink;
		}
		else if(p.title == "Plagiarism Detection Visualization")
		{
			directLink = plagiarismLink;
			linkToCodeBlock = plagiarismCodeLink;
		}
		
		let linkBlock = '<h3><a href="' + directLink + '">' + p.title + '&nbsp(' + p.year + ') </a></h3>';
		
		const card = createCard(`
		  <div class="card">
			${linkBlock}
			<div class="card-links">
			  <!--<a href="#">PDF</a>-->
			  ${linkToCodeBlock}
			  <!--<a href="#">Demo</a>-->
			</div>

			
			<p>${p.description}</p>
			<div class="chip-row">
			  ${p.keywords.map(k => `<span class="tag small">${k}</span>`).join("")}
			</div> 
		  </div>
		`);
		
		card.dataset.id = p.title; // or a better unique ID if available
		
		card.addEventListener("click", (e) => {
		  if (e.target.tagName !== "A") {
			sessionStorage.setItem("lastClickedCard", p.title);
			window.location = directLink;
		  }
		});
		results.appendChild(card);
	  });
	  }
	results.append('</div><div class="section"><div class="section-header"><h2>Publications</h2><div class="divider"></div></div>');
    if (togglePublications.checked) {
      publications.filter(matchesFilters).forEach(p => {
		const currentFilters = encodeURIComponent(window.location.search || "");
        const card = createCard(`
          <div class="card" tabindex="0">
            <h3><a href="${p.link}">${p.title}</a></h3>
            <p>${p.authors}</p>
            <p><em>${p.venue}</em>, ${p.year}</p>
			<p>${p.description}</p>
            <div class="chip-row">
              ${p.keywords.map(k => `<span class="tag small">${k}</span>`).join("")}
            </div>
          </div>
        `);
        results.appendChild(card);
      });
    }
	results.append('</div>');
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

/*document.addEventListener("click", (e) => {
  const openPanels = document.querySelectorAll(
    ".compound-panel:not([hidden])"
  );

  openPanels.forEach(panel => {
    const wrapper = panel.closest(".compound-filter");
    if (!wrapper.contains(e.target)) {
      panel.hidden = true;

      const btn = wrapper.querySelector(".compound-btn");
      btn.setAttribute("aria-expanded", "false");
    }
  });
});


compoundContainer.addEventListener("click", (e) => { 
  const btn = e.target.closest(".compound-btn");
  const option = e.target.closest(".compound-option");

  if (btn) {
	const panel = btn.nextElementSibling;
	const expanded = btn.getAttribute("aria-expanded") === "true";
	e.stopPropagation();
	closeAllCompoundPanels();
	panel.hidden = expanded;
	btn.setAttribute("aria-expanded", String(!expanded));
    return;
  }

  if (option) {
	e.stopPropagation();
	closeAllCompoundPanels();
	btn.setAttribute("aria-expanded", String(!expanded));
	
    const tag = option.dataset.tag;
    const active = activeTags.has(tag);

    option.classList.toggle("active", !active);
    option.setAttribute("aria-pressed", String(!active));

    active ? activeTags.delete(tag) : activeTags.add(tag);

    updateURL();
    render();
  }
});

compoundContainer.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document
      .querySelectorAll(".compound-panel:not([hidden])")
      .forEach(panel => panel.hidden = true);
	  panel
          .previousElementSibling
          .setAttribute("aria-expanded", "false");
  }
});*/





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

window.addEventListener("pageshow", () => {
	document.querySelectorAll(".card.highlighted").forEach(el => {
    el.classList.remove("highlighted");
  });
	
	const lastClicked = sessionStorage.getItem("lastClickedCard");

	if (lastClicked) {
	  const cards = document.querySelectorAll(".card");

	  cards.forEach(card => {
		if (card.dataset.id === lastClicked) {
		  card.classList.add("highlighted");

		  // Optional: scroll into view
		  //card.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	  });
	}
	sessionStorage.removeItem("lastClickedCard");
});

applyURLState();
renderTags();
render();
