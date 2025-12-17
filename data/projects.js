//import { PROJ1TITLE, PROJ1KEYWORDS, PROJ1YEAR, PROJ1DESCRIPTION } from '../projects/constants.js';

const module = await import('../projects/constants.js');

const projects = [
  {
    id: "project2",
    title: "Project Title One",
    description: "Short description of the project.",
    keywords: ["machine learning", "vision", "python", "C#"],
    year: 2024,
    link: "projects/project2.html" 
  },
  {
    id: "project1",
    title: module.PROJ1TITLE,
    description: module.PROJ1DESCRIPTION,
    keywords: module.PROJ1KEYWORDS,
    year: module.PROJ1YEAR,
    link: "projects/project1.html"
  }
];
