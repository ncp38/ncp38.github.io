const DISSTITLE = "X-Ray Vision at Action Space Distances: Depth Perception in Context";
const DISSKEYWORDS = ["X-Ray Vision", "Perception", "Augmented Reality", "Statistics"];
const DISSYEAR = 2022;
const DISSAUTHORS = "Nate Phillips";
const DISSVENUE = "Doctoral Dissertation";
const DISSDESCRIPTION = "Accurate and usable x-ray vision has long been a goal in augmented reality (AR) research and development.  <i>X-ray vision</i>, or the ability to comprehend location and object information when such is viewed through an opaque barrier, would be imminently useful across a variety of applications, including industrial, disaster reconnaissance, and tactical applications.  In order for x-ray vision to be a useful tool for many of these applications, it would need to extend operators' perceptual awareness of the task or environment.  The effectiveness with which x-ray vision can do this is of significant research interest and is a determinant of its usefulness in an application context.</p><p>In substance, then, it is crucial to evaluate the effectiveness of x-ray vision&mdash;how does information presented through x-ray vision compare to real-world information?  This approach requires narrowing as x-ray vision suffers from inherent limitations, analogous to viewing an object through a window.  In both cases, information is presented beyond the local context, exists past an apparently solid object, and is limited or bounded by certain conditions.  Further, in both cases, the naturally suggestive use cases occur over <i>action space distances</i>.  These distances range from 1.5 to 30 meters and represent the area in which observers might contemplate immediate <i>visually directed actions</i>.  These actions, simple tasks with a visual antecedent, represent a significant proportion of what accurate x-ray vision could allow; in effect, x-ray vision extends an operators' awareness and ability to visualize actions into this new context.</p><p>Thus, this work seeks to answer the question <b>'Can a real window be replaced with an AR window?'</b>  This evaluation focuses on perceived object location, investigated through a series of experiments using visually directed actions as experimental measures.  This approach leverages established methodology to investigate this topic by experimentally analyzing each of several distinct variables on a continuum between real-world depth perception and fully realized x-ray vision.  It was found that a real window could not be replaced with an AR window without some loss of depth perception acuity and accuracy.  However, no significant difference was found between a target viewed through an opaque wall and a target viewed through a real window.";

const PUB1TITLE = "Visualization of Hurricane Data";
const PUB1KEYWORDS = ["Web Design", "Javascript", "D3.js", "SVG", "Visualization", "Parallel Coordinates", "Weather Data", "Multivariate Data"];
const PUB1YEAR = 2012;
const PUB1DESCRIPTION = "This paper uses parallel coordinates to graph yearly hurricane data.  It contains interactive features including selectable ranges, re-orderable rows, low-opacity lines, and multivariate functionality. Based on a data set created by Dr. William Gray.";

const PUB2TITLE = "A Tool for Rapid Visual Interrogation & Triage of Alerts";
const PUB2KEYWORDS = ["Network Security", "Visualization", "Javascript", "Jquery", "D3.js", "PHP", "Web Design", "SQL"];
const PUB2YEAR = 2012;
const PUB2DESCRIPTION = "My team designed a visualization for Snort network intrusion alerts, based on an original system created by Peter Curtis. This approach was designed in order to mitigate the difficulty of parsing and understanding these alerts; they are difficult to tease information from and typically appear in large numbers. In our visualization, alerts are presented graphically, with each alert consisting of a slider showing its relative age, two colored squares showing the trustworthiness of the IP address, and the plain text of the alert. This is all compressed into a thin display, allowing a large number of alerts to be displayed per page.";

const PUB3TITLE = "Airship Web Game";
const PUB3KEYWORDS = ["Web Design", "Game Design"];
const PUB3YEAR = 2013;
const PUB3DESCRIPTION = "Design and implementation of a web game (Gyrocopter Cage Match) that is based on surviving as long as possible. In it, players pilot a simple 2-D airship and dodge PUBectiles while also avoiding the spikes at the edges of the map. This game showcases some simple animations, the ability to change the texture of the airship by clicking on it, a pause and options menu, and a high score system.";

const PUB4TITLE = "Radial Data Visualization";
const PUB4KEYWORDS = ["Web Design", "Visualization"];
const PUB4YEAR = 2013;
const PUB4DESCRIPTION = "Design and implementation of a website that supports a novel graph type: the radial line graph. This graph was intended to better illustrate periodic data than the standard line graph. In implementation it was found that it was difficult to observe small changes in a radial view and further difficult to observe changes with a large number of partitions.";

const PUB5TITLE = "Multivariate Hydrological Data Visualization";
const PUB5KEYWORDS = ["Web Design", "Visualization", "Multivariate Data"];
const PUB5YEAR = 2013;
const PUB5DESCRIPTION = "Design and creation of a website that displays certain hydrological data from the Mobile Bay area: flow, salinity, temperature, position, and timestep. In this visualization, data points are located where they occur geographically. From each data point an arrow is displayed that points in the direction of the flow, with the length of the arrow representing the flow magnitude. Color is used to represent either salinity or temperature, based on a display toggle.";

const PUB6TITLE = "A Conceptual Replication and Extension of Triangulation by Walking for Measuring Perceived Distance Through a Wall";
const PUB6KEYWORDS = ["Augmented Reality", "Perception", "Triangulation by Walking", "Replication"];
const PUB6YEAR = 2022;
const PUB6AUTHORS = "Nate Phillips, Farzana Alam Khan, Mohammed Safayet Arefin, Cindy L. Bethel, Jeanine Stetanucci, and J. Edward Swan";
const PUB6VENUE = "2022 IEEE International Symposium on Mixed and Augmented Reality Adjunct";
const PUB6DESCRIPTION = "Triangulation by walking is a method that has been used to measure perceived distance, where observers walk a triangular path. This method has been used at action space distances of approximately 1.5 to 30 meters. In this work, a conceptual replication of these triangulation by walking methods are discussed and evaluated for use in measuring the perceived distance of an object seen through a window set into a wall. The motivation for this work is to use triangulation by walking to study how perceived distance operates when augmented reality (AR) is used to visualize objects located behind opaque surfaces, in an AR application termed “x-ray vision.” This paper reports on experiences replicating an implementation of triangulation by walking as reported by Fukusima, Da Silva, and Loomis (1997). Their method was conceptually replicated in both outdoor and indoor settings, and the method was further extended to measure perceived distances of objects seen through a wall. These extensions are discussed in some detail, focusing on the modifications to the triangulation by walking method as well as the ramifications of these changes. Problems arising from using triangular geometry in calculations of perceived target locations are also introduced, and an alternate method is proposed that works to diminish the problematic effects.";

const publications = [
  {
	id: "dissertation",
    title: DISSTITLE,
    authors: DISSAUTHORS,
	description: DISSDESCRIPTION,
    venue: DISSVENUE,
    year: DISSYEAR,
    keywords: DISSKEYWORDS,
    link: "https://scholarsjunction.msstate.edu/td/5612/"
  },
  {
    id: "paper6",
    title: PUB6TITLE,
	authors: PUB6AUTHORS,
    description: PUB6DESCRIPTION,
	venue: PUB6VENUE,
    keywords: PUB6KEYWORDS,
    year: PUB6YEAR,
    link: "https://ieeexplore.ieee.org/iel7/9973799/9974160/09974279.pdf?casa_token=VCKzau_5XZsAAAAA:aMp5198pZPZ8RIPYBqPovvFTINPMJrqXnqHdFGg70U88HQWDn-rXIwYGd8U20_Uwylo0k8C0Lg" 
  }
];











