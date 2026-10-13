export const personal = {
  name: "Mason Wang",
  subtitle: "First-Year BUCS Student @ UBC",
  headline: "I love vibe coding.",
  intro: "I'm a first-year Business and Computer Science student at UBC who enjoys turning ideas into software, exploring new technologies, and building things just for the fun of it.",
  email: "masonwang322@gmail.com",
  interests: "Away from the screen, I enjoy hiking, working out, kickboxing, cooking, gaming, and time with friends and family.",
  contactHeading: "Let's connect.",
  contactIntroduction: "Always happy to chat about software, interesting ideas, or anything in between.",
  about: [
    "I'm Mason, a first-year Business and Computer Science student at UBC. I've been interested in programming for years, and I enjoy building applications and experimenting with new technology.",
    "I also teach coding at RoboEDU, helping students get started with programming and robotics. I love vibe coding: taking an idea, trying things out, and bringing it to life.",
  ],
};

export type SocialProfile = {
  id: "github" | "linkedin" | "instagram" | "discord" | "email";
  label: string;
  username: string;
  href?: string;
  external: boolean;
};

export const socialProfiles: SocialProfile[] = [
  { id: "github", label: "GitHub", username: "masonwng", href: "https://github.com/masonwng", external: true },
  { id: "linkedin", label: "LinkedIn", username: "Mason Wang", href: "https://www.linkedin.com/in/mason-wang-926026353/", external: true },
  { id: "instagram", label: "Instagram", username: "masonwng", href: "https://www.instagram.com/masonwng/", external: true },
  { id: "discord", label: "Discord", username: "masonwng", external: false },
  { id: "email", label: "Email", username: personal.email, href: `mailto:${personal.email}`, external: false },
];

export type Experience = {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | null;
  startLabel: string;
  endLabel: string;
  description: string[];
};

export const experiences: Experience[] = [
  {
    id: "roboedu",
    organization: "RoboEDU",
    role: "Coding Instructor",
    startDate: "2024-07",
    endDate: null,
    startLabel: "July 2024",
    endLabel: "Present",
    description: [
      "Teach programming and robotics to students aged 5–16, including Java, Python, Unity, EV3, and Scratch.",
      "Previously volunteered for two years before transitioning into a paid instructor role.",
    ],
  },
];

export const leadership: Experience[] = [
  {
    id: "ib-director",
    organization: "Sir Winston Churchill Secondary School",
    role: "IB Director",
    startDate: "2025-02",
    endDate: "2026-06",
    startLabel: "February 2025",
    endLabel: "June 2026",
    description: ["Organized student orientation events, information sessions, and mentorship activities."],
  },
];

export type Award = {
  id: string;
  title: string;
  result?: string;
  date: string;
  dateLabel: string;
};

export const awards: Award[] = [
  { id: "acsl", title: "American Computer Science League", result: "Finalist", date: "2022-11", dateLabel: "November 2022" },
  { id: "strive", title: "Strive Case Competition", result: "Winner", date: "2025-02", dateLabel: "February 2025" },
  { id: "prosper", title: "Prosper Ivey Invitational Case Competition", result: "Third Place", date: "2025-06", dateLabel: "June 2025" },
  { id: "enhance", title: "Enhance Case Competition", result: "Second Place", date: "2026-04", dateLabel: "April 2026" },
  { id: "minienterprize", title: "miniEnterprize Case Competition", result: "miniCase Winner and Third Place", date: "2026-02", dateLabel: "February 2026" },
];

export const education = {
  institution: "University of British Columbia",
  degree: "Bachelor of Commerce",
  major: "Combined Major in Business and Computer Science (BUCS)",
  startDate: "2026-09",
  endDate: null,
  startLabel: "September 2026",
  endLabel: "Present",
};

export type Project = {
  id: string;
  title: string;
  description: string;
  href?: string;
  githubUrl?: string;
};

// Add completed projects here when their details and real links are available.
export const projects: Project[] = [];

export const hobbies = [
  "Hiking",
  "Working out",
  "Kickboxing",
  "Cooking",
  "Gaming",
  "Spending time with friends and family",
];

export type PhotoDetail = { id: string; title: string; alt: string; src?: string };

export const photoDetails: PhotoDetail[] = [
  { id: "sister", title: "Me & my sister", alt: "Mason and his sister together in Chinatown" },
  { id: "friend", title: "Good company", alt: "Mason and his friend taking a playful mirror photo" },
  { id: "cats", title: "The little things", alt: "Mason's two cats resting together in the sunlight" },
  { id: "graduation", title: "A new chapter", alt: "Mason wearing his graduation gown and holding flowers" },
  { id: "hiking", title: "Out there", alt: "A moment from one of Mason's hikes" },
];

// The download link only appears if this PDF is actually present in public/.
export const resumePath = "/resume.pdf";
