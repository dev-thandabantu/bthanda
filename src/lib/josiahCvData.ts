export const cvHeader = {
  name: "Josiah Sithole",
  title: "Professional Driver & Construction Labourer",
  phone: "[PHONE NUMBER]",
  email: "[EMAIL ADDRESS]",
  linkedin: "",
  linkedinUrl: "",
  website: "",
  websiteUrl: "",
};

export const cvSummary =
  "Hardworking and reliable professional with 10+ years of hands-on experience in heavy vehicle driving and construction. Holds a Code 14 (Heavy Motor Vehicle) driver's licence with a clean record and extensive long-distance and cross-border driving experience. Equally experienced in construction site work — including physical labouring, material handling, and support across building projects. Known for punctuality, physical endurance, and the ability to work effectively under supervision or independently. Seeking opportunities in Europe to apply these skills in transport, logistics, or construction roles.";

export interface CvJob {
  title: string;
  org: string;
  dates: string;
  bullets: string[];
}

export const cvJobs: CvJob[] = [
  {
    title: "Heavy Vehicle Driver (Code 14)",
    org: "[EMPLOYER NAME] · [LOCATION]",
    dates: "[START YEAR] – Present",
    bullets: [
      "Operated heavy motor vehicles (Code 14) over long distances, including cross-border routes.",
      "Responsible for pre-trip vehicle inspections, load securing, and adherence to road traffic regulations.",
      "Maintained accurate trip logs and delivery records.",
      "Consistently met delivery deadlines while prioritising road safety.",
    ],
  },
  {
    title: "Construction Worker",
    org: "[EMPLOYER NAME] · [LOCATION]",
    dates: "[START YEAR] – [END YEAR]",
    bullets: [
      "Performed general labouring duties on residential and commercial construction sites.",
      "Assisted with wall construction, plastering, material mixing, and site preparation.",
      "Operated and maintained basic construction tools and equipment.",
      "Worked as part of a team to meet project timelines under site supervisor direction.",
    ],
  },
];

export interface CvSkill {
  label: string;
  value: string;
}

export const cvSkills: CvSkill[] = [
  { label: "Driver's Licence", value: "Code 14 / Class Heavy Motor Vehicle (Zimbabwe) — held since 2015 (10+ years)" },
  { label: "Vehicles", value: "[TO BE FILLED — e.g. trucks, buses, articulated vehicles, construction machinery]" },
  { label: "Construction", value: "General labouring, bricklaying assistance, plastering, material handling, site preparation" },
  { label: "Languages", value: "Ndebele (native), Shona, English (basic)" },
  { label: "Other", value: "Physical fitness, time management, cross-border travel documentation" },
];

export interface CvEdu {
  degree: string;
  school: string;
  dates: string;
  notes: string[];
}

export const cvEducation: CvEdu[] = [
  {
    degree: "[HIGHEST QUALIFICATION]",
    school: "[SCHOOL NAME] · Chipinge, Zimbabwe",
    dates: "[YEARS]",
    notes: [],
  },
];

export interface CvAward {
  year: string;
  text: string;
}

export const cvAwards: CvAward[] = [];
