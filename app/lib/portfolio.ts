export const personal = {
  name: "Mason Wang",
  subtitle: "First-Year BUCS Student @ UBC",
  headline: "I love vibe coding.",
  intro: "I like building software, trying out ideas, and seeing where they go.",
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

export type LogoAsset = {
  src: string;
  alt: string;
  approved?: boolean;
};

export type MediaLink = { href: string; label: string };

export type VideoDetail = {
  id: string;
  src: string;
  title: string;
  poster?: string;
  caption?: string;
  externalLink?: MediaLink;
  captionsSrc?: string;
};

export type Experience = {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | null;
  startLabel: string;
  endLabel: string;
  description: string[];
  logo?: LogoAsset;
  badge?: string;
  photos?: PhotoDetail[];
  videos?: VideoDetail[];
  mediaLinks?: MediaLink[];
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
    logo: { src: "/media/logos/Screenshot 2026-10-12 230146.png", alt: "RoboEDU logo", approved: true },
    badge: "Robo",
    // Assign only verified photos or videos to this experience.
    photos: [],
    videos: [],
    description: [
      "Teach programming and robotics to more than 50 students aged 5–16, using Java, Python, Unity, EV3, and Scratch.",
      "Progressed from volunteer to paid instructor, adapting lessons for different abilities and experience levels.",
    ],
  },
];

export const leadership: Experience[] = [
  {
    id: "yac",
    organization: "Young Architects for Change",
    role: "Project Coordinator",
    startDate: "2025-04",
    endDate: null,
    startLabel: "April 2025",
    endLabel: "Present",
    badge: "YAC",
    description: [
      "Helped coordinate Design for Change 2025 at the Museum of Vancouver, alongside mentorship events and architecture workshops.",
      "Supported fundraising through donut sales and created social media posts to promote events and initiatives.",
    ],
  },
  {
    id: "ib-director",
    organization: "Sir Winston Churchill Secondary School",
    role: "IB Director",
    startDate: "2025-02",
    endDate: "2026-06",
    startLabel: "February 2025",
    endLabel: "June 2026",
    logo: { src: "/media/logos/ib logo.webp", alt: "International Baccalaureate programme logo", approved: true },
    badge: "IB",
    photos: [
      {
        id: "ib-event",
        title: "IB Director event",
        src: "/media/events/DF88956D-5B92-4900-B565-BBC727285EB3.jpg",
        alt: "A group in formal clothes with a plaque outside a ballroom during an IB Director event",
      },
      {
        id: "ib-camp",
        title: "IB Director camp",
        src: "/media/events/SQUEAH.PNG",
        alt: "A group gathered outdoors at night during an IB Director camp",
      },
      {
        id: "ib-dinner",
        title: "IB Director dinner",
        src: "/media/events/Copy of XZ1 2025-10-22 18_17_15.JPG",
        alt: "A group seated together at a dinner table during an IB Director dinner",
      },
      {
        id: "ib-gathering",
        title: "IB Director gathering",
        src: "/media/events/B76B4A01-FF4C-4FEB-B6FF-C06943F34C72.jpg",
        alt: "Two friends sharing a restaurant meal during an IB Director gathering",
      },
    ],
    videos: [],
    description: [
      "Helped coordinate a three-day, two-night orientation camp for more than 100 incoming IB students.",
      "Invited professionals including a former BC Hydro CEO, practicing physicians, and Silicon Valley project managers to school events.",
      "Organized information sessions and a student conference.",
    ],
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
  { id: "strive", title: "Strive 2025 Case Competition", result: "1st Place", date: "2025-02", dateLabel: "February 2025" },
  { id: "prosper", title: "Prosper x Ivey Invitational Case Competition", result: "3rd Place", date: "2025-06", dateLabel: "June 2025" },
  { id: "enhance", title: "Enhance Case Competition", result: "2nd Place", date: "2026-04", dateLabel: "April 2026" },
  { id: "minienterprize", title: "miniEnterprize Case Competition", result: "3rd Place", date: "2026-02", dateLabel: "February 2026" },
  { id: "hellohacks", title: "BizTech HelloHacks Hackathon", result: "Audience Choice Award", date: "2026-10", dateLabel: "October 2026" },
];

export const education = {
  institution: "University of British Columbia",
  degree: "Bachelor of Commerce",
  major: "Combined Major in Business and Computer Science (BUCS)",
  startDate: "2026-09",
  endDate: null,
  startLabel: "September 2026",
  endLabel: "Present",
  graduation: "May 2031",
  logo: { src: "/media/logos/ubclogo.png", alt: "University of British Columbia logo", approved: true },
  badge: "UBC",
};

export const skills = {
  Technologies: ["Java", "Python", "VEX IQ", "EV3", "Scratch", "Unity", "Canva", "Excel", "Google Workspace"],
  "Working with people": ["Event Planning & Coordination", "Social Media Marketing", "Fundraising", "Mentorship", "Public Speaking"],
  Languages: ["English — fluent", "Mandarin — fluent"],
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

export type Hobby = {
  id: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  caption?: string;
};

export const hobbies: Hobby[] = [
  {
    id: "hiking",
    title: "Hiking",
    description: "Fresh air, a change of scenery, and time away from the screen.",
    image: { src: "/media/hobbies/hiking.jpg", alt: "A mountain viewpoint above forested slopes beneath a clear blue sky" },
    caption: "A view worth the climb.",
  },
  {
    id: "cooking",
    title: "Cooking",
    description: "Trying things in the kitchen and making something good to eat.",
    image: { src: "/media/hobbies/steak.jpg", alt: "Sliced steak and potatoes on a black plate" },
    caption: "Something from the kitchen.",
  },
  { id: "fitness", title: "Working out", description: "Making time to move and stay active." },
  { id: "kickboxing", title: "Kickboxing", description: "A different kind of challenge outside the terminal." },
  { id: "gaming", title: "Gaming", description: "A good game and a chance to switch gears." },
  { id: "family-friends", title: "Friends and family", description: "Good company and time spent together." },
];

export type PhotoDetail = { id: string; title: string; alt: string; src?: string };

export const photoDetails: PhotoDetail[] = [
  { id: "sister", title: "Me & my sister", alt: "Mason and his sister together in Chinatown" },
  { id: "friend", title: "Good company", alt: "Mason and his friend taking a playful mirror photo", src: "/memories/IMG_5670.jpg" },
  { id: "cats", title: "The little things", alt: "Mason's two cats resting together in the sunlight" },
  { id: "graduation", title: "A new chapter", alt: "Mason wearing his graduation gown and holding flowers" },
  { id: "hiking", title: "Out there", alt: "A moment from one of Mason's hikes" },
];

// The download link only appears if this PDF is actually present in public/.
export const resumePath = "/resume.pdf";
