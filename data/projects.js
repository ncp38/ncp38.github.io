//import { PROJ1TITLE, PROJ1KEYWORDS, PROJ1YEAR, PROJ1DESCRIPTION } from '../projects/constants.js';

//const module = await import('../projects/constants.js');

// Constants for use in the project subfolder.

const PROJ1TITLE = "Visualization of Hurricane Data";
const PROJ1KEYWORDS = ["Web", "Javascript", "D3.js", "SVG", "Visualization", "Parallel Coordinates", "Weather Data"];
const PROJ1YEAR = 2012;
const PROJ1DESCRIPTION = "This project uses parallel coordinates to graph yearly hurricane data.  It contains interactive features including selectable ranges, re-orderable rows, low-opacity lines, and multivariate functionality. Based on a data set created by Dr. William Gray.";

const PROJ2TITLE = "Working Title 2";
const PROJ2KEYWORDS = ["c#"];
const PROJ2YEAR = 2011;
const PROJ2DESCRIPTION = "Description";

const projects = [
  {
    id: "project2",
    title: PROJ2TITLE,
    description: PROJ2DESCRIPTION,
    keywords: PROJ2KEYWORDS,
    year: PROJ2YEAR,
    link: "projects/project2" 
  },
  {
    id: "project1",
    title: PROJ1TITLE,
    description: PROJ1DESCRIPTION,
    keywords: PROJ1KEYWORDS,
    year: PROJ1YEAR,
    link: "projects/visualizationOfHurricaneData/index"
  }
];
