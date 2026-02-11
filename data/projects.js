//import { PROJ1TITLE, PROJ1KEYWORDS, PROJ1YEAR, PROJ1DESCRIPTION } from '../projects/constants.js';

//const module = await import('../projects/constants.js');

// Constants for use in the project subfolder.

const PROJ1TITLE = "Visualization of Hurricane Data";
const PROJ1KEYWORDS = ["Web Design", "Javascript", "D3.js", "SVG", "Visualization", "Parallel Coordinates", "Weather Data", "Multivariate Data"];
const PROJ1YEAR = 2012;
const PROJ1DESCRIPTION = "This project uses parallel coordinates to graph yearly hurricane data.  It contains interactive features including selectable ranges, re-orderable rows, low-opacity lines, and multivariate functionality. Based on a data set created by Dr. William Gray.";

const PROJ2TITLE = "A Tool for Rapid Visual Interrogation & Triage of Alerts";
const PROJ2KEYWORDS = ["Network Security", "Visualization", "Javascript", "jquery", "D3.js", "php", "Web Design"];
const PROJ2YEAR = 2012;
const PROJ2DESCRIPTION = "My team designed a visualization for Snort network intrusion alerts, based on an original system created by Peter Curtis. This approach was designed in order to mitigate the difficulty of parsing and understanding these alerts; they are difficult to tease information from and typically appear in large numbers. In our visualization, alerts are presented graphically, with each alert consisting of a slider showing its relative age, two colored squares showing the trustworthiness of the IP address, and the plain text of the alert. This is all compressed into a thin display, allowing a large number of alerts to be displayed per page.";

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
