//import { PROJ1TITLE, PROJ1KEYWORDS, PROJ1YEAR, PROJ1DESCRIPTION } from '../projects/constants.js';

//const module = await import('../projects/constants.js');

// Constants for use in the project subfolder.

const PROJ0TITLE = "IEEE SoutheastCon 2011 Hardware Competition";
const PROJ0KEYWORDS = ["Robotics", "C", "Arduino", "Electrical Engineering", "Emergency Response"];
const PROJ0YEAR = 2011;
const PROJ0DESCRIPTION = "Design and implementation of an autonomous emergency response robot for IEEE SoutheastCon Hardware Competition as part of the Christian Brothers University team. This robot traveled between four rooms in a pre-defined course layout. The robot had to avoid obstacles, find a hazard (represented by an electromagnetic field), find up to three victims (represented by PVC pipe cutouts) per room, and report the location and status of each victim.  Presented at MAESC 2011.";

const PROJ1TITLE = "Visualization of Hurricane Data";
const PROJ1KEYWORDS = ["Web Design", "Data Analysis", "Javascript", "D3.js", "SVG", "Visualization", "Parallel Coordinates", "Weather Data", "Multivariate Data"];
const PROJ1YEAR = 2012;
const PROJ1DESCRIPTION = "This project uses parallel coordinates to graph yearly hurricane data.  It contains interactive features including selectable ranges, re-orderable rows, low-opacity lines, and multivariate functionality. Based on a data set created by Dr. William Gray.";

const PROJ2TITLE = "A Tool for Rapid Visual Interrogation & Triage of Alerts";
const PROJ2KEYWORDS = ["Network Security", "Data Analysis", "Cybersecurity", "Visualization", "Javascript", "Jquery", "D3.js", "PHP", "Web Design", "SQL"];
const PROJ2YEAR = 2012;
const PROJ2DESCRIPTION = "My team designed a visualization for Snort network intrusion alerts, based on an original system created by Peter Curtis. This approach was designed in order to mitigate the difficulty of parsing and understanding these alerts; they are difficult to tease information from and typically appear in large numbers. In our visualization, alerts are presented graphically, with each alert consisting of a slider showing its relative age, two colored squares showing the trustworthiness of the IP address, and the plain text of the alert. This is all compressed into a thin display, allowing a large number of alerts to be displayed per page.";

const PROJ3TITLE = "Airship Web Game";
const PROJ3KEYWORDS = ["Web Design", "Game Design", "Javascript", "Canvas"];
const PROJ3YEAR = 2013;
const PROJ3DESCRIPTION = "Design and implementation of a web game (Gyrocopter Cage Match) that is based on surviving as long as possible. In it, players pilot a simple 2-D airship and dodge projectiles while also avoiding the spikes at the edges of the map. This game showcases some simple animations, the ability to change the texture of the airship by clicking on it, a pause and options menu, and a high score system.";

const PROJ4TITLE = "Radial Data Visualization";
const PROJ4KEYWORDS = ["Web Design", "Data Analysis", "Visualization", "Javascript", "D3", "SVG"];
const PROJ4YEAR = 2013;
const PROJ4DESCRIPTION = "Design and implementation of a website that supports a novel graph type: the radial line graph. This graph was intended to better illustrate periodic data than the standard line graph. In implementation it was found that it was difficult to observe small changes in a radial view and further difficult to observe changes with a large number of partitions.";

const PROJ5TITLE = "Multivariate Hydrological Data Visualization";
const PROJ5KEYWORDS = ["Web Design", "Data Analysis", "Visualization", "Multivariate Data"];
const PROJ5YEAR = 2013;
const PROJ5DESCRIPTION = "Design and creation of a website that displays certain hydrological data from the Mobile Bay area: flow, salinity, temperature, position, and timestep. In this visualization, data points are located where they occur geographically. From each data point an arrow is displayed that points in the direction of the flow, with the length of the arrow representing the flow magnitude. Color is used to represent either salinity or temperature, based on a display toggle.";

const PROJ6TITLE = "Plagiarism Detection Visualization";
const PROJ6KEYWORDS = ["Web Design", "Data Analysis", "Visualization"];
const PROJ6YEAR = 2014;
const PROJ6DESCRIPTION = "My team created a website that would compare two input text files and determine any potential plagiarized phrases between them. Based on this analysis, both files are displayed side-by-side in a scrollable view with the potentially plagiarized phrases highlighted in both documents.";

const projects = [
  {
    id: "project6",
    title: PROJ6TITLE,
    description: PROJ6DESCRIPTION,
    keywords: PROJ6KEYWORDS,
    year: PROJ6YEAR,
    link: "projects/plagiarismDetection" 
  },
  {
    id: "project5",
    title: PROJ5TITLE,
    description: PROJ5DESCRIPTION,
    keywords: PROJ5KEYWORDS,
    year: PROJ5YEAR,
    link: "projects/project5" 
  },
  {
    id: "project4",
    title: PROJ4TITLE,
    description: PROJ4DESCRIPTION,
    keywords: PROJ4KEYWORDS,
    year: PROJ4YEAR,
    link: "projects/radialDataVisualization" 
  },
  {
    id: "project3",
    title: PROJ3TITLE,
    description: PROJ3DESCRIPTION,
    keywords: PROJ3KEYWORDS,
    year: PROJ3YEAR,
    link: "projects/gyrocopterCageMatch" 
  },
  {
    id: "project2",
    title: PROJ2TITLE,
    description: PROJ2DESCRIPTION,
    keywords: PROJ2KEYWORDS,
    year: PROJ2YEAR,
    link: "projects/aToolForRapidVisualInterrogation" 
  },
  {
    id: "project1",
    title: PROJ1TITLE,
    description: PROJ1DESCRIPTION,
    keywords: PROJ1KEYWORDS,
    year: PROJ1YEAR,
    link: "projects/visualizationOfHurricaneData/index"
  },
  {
    id: "project0",
    title: PROJ0TITLE,
    description: PROJ0DESCRIPTION,
    keywords: PROJ0KEYWORDS,
    year: PROJ0YEAR,
    link: "projects/ieeesoutheastcon2011"
  }
];
