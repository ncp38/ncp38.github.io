// Important note: Each project, paper and certification title must be unique.

// Constants for the Certifications section.
// Dates are YYYY-MM-DD.  Use null for EXPIRES when a credential does not expire.
// FLAIR is a web-sized image (about 480px square; see README.md).
// LINKS are shown in the details panel, so use a public verification page.

const CERT0TITLE = "Foundation: Introduction to LangChain - Python";
const CERT0CAPTION = "LangChain Foundation (Python)";
const CERT0ISSUER = "LangChain Academy";
const CERT0KIND = "Course certificate";
const CERT0EARNED = "2026-06-21";
const CERT0EXPIRES = null;
const CERT0KEYWORDS = ["LangChain", "Python", "Large Language Models"];//Add agentic programming in the future.
const CERT0DESCRIPTION = "Completed LangChain Academy's introductory course on building applications with LangChain in Python. This is a course completion certificate, not a proctored exam.";
const CERT0FLAIR = "certifications/langchain-foundation-python/flair.webp";
const CERT0LINKS = [
  { label: "Verify certificate", url: "https://academy.langchain.com/student_certificates/7l8srcvun1" }
];

const CERT1TITLE = "Microsoft Certified: SQL AI Developer Associate";
const CERT1CAPTION = "SQL AI Developer Associate";
const CERT1ISSUER = "Microsoft";
const CERT1KIND = "Exam-based certification";
const CERT1EARNED = "2026-09-16";
const CERT1EXPIRES = "2027-09-16";
const CERT1KEYWORDS = ["SQL", "Vector Search", "Artificial Intelligence", "RESTful APIs", "Cybersecurity", "T-SQL"];
const CERT1DESCRIPTION = "Passed Microsoft's DP-800 exam for the SQL AI Developer Associate credential, which focuses on building AI-enabled applications on SQL databases, including vector search and retrieval-augmented generation (RAG).";
const CERT1FLAIR = "certifications/microsoft-sql-ai-developer-associate/flair.webp";
const CERT1LINKS = [
  { label: "Verify credential", url: "https://learn.microsoft.com/api/credentials/share/en-us/NatePhillips-8807/DFD655BA0517F093?sharingId=E54637BCFC2003C5" }
];

// Newest first, like the projects and publications.
const certifications = [
  {
    id: "microsoft-sql-ai-developer-associate",
    category: "certification",
    title: CERT1TITLE,
    caption: CERT1CAPTION,
    issuer: CERT1ISSUER,
    kind: CERT1KIND,
    earned: CERT1EARNED,
    expires: CERT1EXPIRES,
    keywords: CERT1KEYWORDS,
    description: CERT1DESCRIPTION,
    flair: CERT1FLAIR,
    links: CERT1LINKS
  },
  {
    id: "langchain-foundation-python",
    category: "certification",
    title: CERT0TITLE,
    caption: CERT0CAPTION,
    issuer: CERT0ISSUER,
    kind: CERT0KIND,
    earned: CERT0EARNED,
    expires: CERT0EXPIRES,
    keywords: CERT0KEYWORDS,
    description: CERT0DESCRIPTION,
    flair: CERT0FLAIR,
    links: CERT0LINKS
  }
];
