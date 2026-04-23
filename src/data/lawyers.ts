export type Lawyer = {
  slug: string;
  name: string;
  honorific?: string;
  title: string;
  shortBio: string;
  bio: string[];
  barAdmissions: string[];
  education?: string[];
  languages?: string[];
  email?: string;
  phoneDisplay?: string;
  photoPrimary?: string;
  photoSecondary?: string;
  consultationRateCad: number;
  consultationMinutes: number;
  displayOrder: number;
  /** Whether this lawyer also acts as a family law mediator. */
  isMediator?: boolean;
  /** Short, plain-language mediator intro for the /mediation landing page. */
  mediationBlurb?: string;
  /** Verbatim mediator credential from the firm's website. */
  mediatorCredential?: string;
  /**
   * Per-lawyer Calendly scheduling URL (e.g. `https://calendly.com/evans-rwelaw/consultation`).
   * When present, the /book flow embeds the lawyer's Calendly widget; when absent,
   * a placeholder card is shown.
   */
  calendlyUrl?: string;
};

export const lawyers: Lawyer[] = [
  {
    slug: "robert-evans",
    name: "Robert W. Evans",
    title: "Partner",
    shortBio:
      "A family lawyer who has appeared at every level of court in British Columbia, committed to fundamental justice and due process.",
    bio: [
      "Robert Evans is a partner with RWE Family Law and a lawyer who has appeared before all levels of court in British Columbia.",
      "Robert practices law because he is committed to the principles of fundamental justice and due process. He crafts solutions to legal problems by listening carefully to his clients, without jumping to conclusions. Focusing on family law, Robert aims to make a positive difference in the community by representing clients from all cultural and economic backgrounds. Robert believes that legal representation means striving to advance your legal position with sound legal advice and with strong advocacy on your behalf.",
      "In the community, from 2020–2021, Robert sat on a BC Law Institute's committee for Modernizing the Child, Family and Community Service Act. Robert also regularly volunteers for a victim services shelter with the Vancouver & Lower Mainland Multicultural Family Support Services Society. In addition to his involvement in the community, Robert is accredited as a family law mediator.",
      "In 2011 Robert was called to the bar in British Columbia. Robert is also called in Texas and New York.",
    ],
    barAdmissions: ["British Columbia (2011)", "Texas", "New York"],
    education: [
      "Juris Doctor — University of Windsor",
      "B.A. Applied Psychology — Kwantlen Polytechnic University",
    ],
    languages: ["English"],
    email: "evans@rwelaw.ca",
    phoneDisplay: "(778) 654-7585",
    photoPrimary: "/lawyers/evans-robert-1.jpg",
    photoSecondary: "/lawyers/evans-robert-2.jpg",
    consultationRateCad: 300,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/evans-rwelaw",
    displayOrder: 1,
    isMediator: true,
    mediatorCredential: "Accredited family law mediator.",
    mediationBlurb:
      "Robert brings decades of courtroom experience to the mediation table — and uses it to help parties see, clearly, what a judge would likely do if they couldn't settle. That clarity is often the unlock for agreement.",
  },
  {
    slug: "kevin-quong",
    name: "Kevin A. Quong",
    title: "Partner",
    shortBio:
      "Practises exclusively in family law and child protection; experienced in high-conflict parenting disputes and complex asset division.",
    bio: [
      "Kevin Quong is a partner with RWE Family Law, practicing exclusively in the areas of family law and child protection. He has extensive experience in cases involving high-conflict parenting disputes, complex family asset division, and issues relating to child and spousal support. Kevin also has significant experience in cases involving the Ministry of Children and Family Development.",
      "Kevin is passionate about obtaining equitable results for his clients in a timely and cost-effective manner. His approach is to resolve his clients' issues through negotiation or mediation whenever possible, or through the court process when necessary. Kevin takes pride in representing clients that find themselves in the most difficult of circumstances. Kevin has appeared before all levels of court in British Columbia.",
      "Kevin was born and raised in British Columbia, and attended the University of British Columbia for both his undergraduate and law degrees, obtaining his Juris Doctor in 2013. Kevin was called to the bar in British Columbia in 2014. In his spare time, Kevin enjoys playing ice hockey, golf, vegetable gardening, and health and fitness.",
    ],
    barAdmissions: ["British Columbia (2014)"],
    education: [
      "Juris Doctor (2013) — University of British Columbia",
      "B.A. Psychology — University of British Columbia",
    ],
    email: "quong@rwelaw.ca",
    phoneDisplay: "(778) 655-1764",
    photoPrimary: "/lawyers/quong-kevin-1.jpg",
    photoSecondary: "/lawyers/quong-kevin-2.jpg",
    consultationRateCad: 275,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/quong-rwelaw",
    displayOrder: 2,
  },
  {
    slug: "sarnj-rai",
    name: "Sarnj Rai",
    title: "Associate",
    shortBio:
      "Calm, methodical family-law practice with trial experience in both Provincial and Supreme Court of British Columbia.",
    bio: [
      "Sarnj Rai is an associate practicing in the areas of family law. Sarnj was called to the BC Bar in 2013.",
      "In addition to earning her Juris Doctor in Law, Sarnj obtained her Bachelor of Arts degree at Simon Fraser University, majoring in Criminology. Prior to attending law school, Sarnj worked for the RCMP both for the Major Crime Section/Homicide Unit and the 2010 Vancouver Olympics Integrated Security Unit.",
      "Sarnj has litigation and trial experience in both Provincial Court of British Columbia and Supreme Court of British Columbia. Sarnj provides a full range of services and specializes in family law. She has a hands-on approach to all of her files. Sarnj ensures that her clients receive the best legal advice for their individual needs and also that their matter is handled in a cost effective and efficient manner.",
      "Outside of work, Sarnj enjoys travelling, running, and spending time with her family & friends.",
    ],
    barAdmissions: ["British Columbia (2013)"],
    education: [
      "Juris Doctor",
      "B.A. Criminology — Simon Fraser University",
    ],
    email: "rai@rwelaw.ca",
    phoneDisplay: "(778) 654-7605",
    photoPrimary: "/lawyers/rai-sarnj-1.jpg",
    photoSecondary: "/lawyers/rai-sarnj-2.jpg",
    consultationRateCad: 250,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/rai-rwelaw",
    displayOrder: 3,
  },
  {
    slug: "desiree-acosta",
    name: "Desiree Acosta",
    title: "Associate",
    shortBio:
      "Over a decade in exclusive family-law practice, including high-conflict custody and complex international asset matters.",
    bio: [
      "Desiree has practiced exclusively in all areas of family law, including child protection, since commencing her articles in 2013. She is an accredited family law mediator with the Law Society of British Columbia. She has represented her clients in both the Provincial Court and Supreme Court of British Columbia. Desiree spent 5 years of her career working for the Provincial Court as duty counsel, alongside her private practice. With over a decade of experience in family law, Desiree has dealt with matters involving high-conflict custody disputes, complex child and spousal support issues, asset division including corporate and international assets, and family violence and protection orders. Desiree's practice also includes drafting cohabitation agreements and separation agreements to reflect the specific needs and goals of her clients.",
      "Desiree understands the difficulties of a separation and prides herself on taking an empathetic approach with her clients. She strives to offer clear, honest and meaningful legal advice while developing a successful legal strategy for her clients. Her goal is to achieve fair results in a timely and cost-efficient manner.",
      "While Desiree attempts to reach out of court settlements for her clients, she understands that litigation is sometimes necessary. Desiree is a skilled and passionate advocate and is always prepared to litigate fiercely, if required.",
      "In her spare time, Desiree enjoys fitness, travelling and spending time with her family.",
    ],
    barAdmissions: ["British Columbia (articled 2013)"],
    education: ["Juris Doctor — University of Ottawa"],
    email: "acosta@rwelaw.ca",
    phoneDisplay: "(778) 655-1791",
    photoPrimary: "/lawyers/acosta-desiree-1.jpg",
    photoSecondary: "/lawyers/acosta-desiree-2.jpg",
    consultationRateCad: 225,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/acosta-rwelaw",
    displayOrder: 4,
    isMediator: true,
    mediatorCredential:
      "Accredited family law mediator with the Law Society of British Columbia.",
    mediationBlurb:
      "Desiree's calm, patient style is built for the most sensitive mediations — especially those involving children. She focuses on what both parents can live with, not on winning the room.",
  },
  {
    slug: "dilveen-grewal",
    name: "Dilveen Grewal",
    title: "Associate",
    shortBio:
      "Associate practising across spousal support, child support, custody, and child protection. Fluent in Punjabi.",
    bio: [
      "Dilveen Grewal is an associate lawyer with RWE Law who practices in all areas of family law including spousal support, child support, custody, and child protection.",
      "Dilveen obtained her law degree at Thompson Rivers University, Faculty of Law. In law school, Dilveen worked as a student clinician at the Thompson Rivers University Community Legal Clinic where she first developed an interest in family law. She was also the treasurer of the Criminal Law Club and worked with the South Asian Legal Clinic through Pro Bono Students. In 2016, Dilveen obtained her Bachelor of Arts from Simon Fraser University where she majored in Criminology.",
      "Prior to attending law school, Dilveen worked as a legal administrative assistant at a boutique law firm. This role helped strengthen her communication skills, organizational skills, and allowed her to understand the workings of different courthouses throughout British Columbia. She has found this experience invaluable as it allowed her to gain an appreciation for the law and strengthened her decision to attend law school.",
      "In her spare time, Dilveen enjoys traveling, staying active, and spending time with family and friends. Dilveen is also fluent in Punjabi.",
    ],
    barAdmissions: ["British Columbia"],
    education: [
      "Juris Doctor — Thompson Rivers University",
      "B.A. Criminology (2016) — Simon Fraser University",
    ],
    languages: ["English", "Punjabi"],
    email: "grewal@rwelaw.ca",
    phoneDisplay: "(778) 897-3341",
    photoPrimary: "/lawyers/grewal-dilveen-1.jpg",
    photoSecondary: "/lawyers/grewal-dilveen-2.jpg",
    consultationRateCad: 150,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/grewal-rwelaw",
    displayOrder: 5,
  },
  {
    slug: "liam-su",
    name: "Liam Su",
    title: "Associate",
    shortBio:
      "Trauma-informed, future-facing family-law practice. Fluent in Mandarin.",
    bio: [
      "Liam Su is a lawyer at RWE Family Law who has always been passionate about helping families navigate the complexities of the legal system in all family law matters including divorce and separation, custody disputes, child and spousal support, adoption, property division, and domestic violence issues.",
      "Liam strives to help his clients obtain expedient and equitable resolutions, with an eye toward mitigating further conflict between the parties wherever possible. If children are involved, he will try to recenter the well-being of children caught in the middle of high-conflict matters. When appropriate, he will seek to resolve his clients' issues amicably through negotiations, though he is not afraid to advocate for his clients in court if necessary. Having an intimate understanding of the challenging dynamics that may arise from family law issues, Liam employs a trauma-informed and future-facing approach in his practice that empowers his clients to make informed decisions with clarity and confidence in what is otherwise a confusing and chaotic period of their lives.",
      "Liam obtained his Juris Doctor from Peter A. Allard School of Law and was called to the BC bar in June, 2024. Liam was committed to advocacy and helping people through extensive involvement in the various clinics and programs provided by Peter A. Allard School of Law, notably the Law Students' Legal Advice Program, where Liam gained court experience within his first year at law school; and Rise Women's Legal Centre, a full-time family law clinic that provided comprehensive hands-on training which shaped Liam's approach to family law matters today.",
      "In his spare time, Liam likes to stay active, watch and participate in theatre, and spend time with his friends and family. Liam is also fluent in Mandarin.",
    ],
    barAdmissions: ["British Columbia (June 2024)"],
    education: [
      "Juris Doctor — Peter A. Allard School of Law, University of British Columbia",
    ],
    languages: ["English", "Mandarin"],
    email: "su@rwelaw.ca",
    phoneDisplay: "(778) 658-0212",
    photoPrimary: "/lawyers/su-liam-1.jpg",
    photoSecondary: "/lawyers/su-liam-2.jpg",
    consultationRateCad: 160,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/rwelaw-su",
    displayOrder: 6,
  },
  {
    slug: "tiffany-valeska",
    name: "Tiffany Valeska",
    title: "Associate",
    shortBio:
      "Family-law practice with a trauma-informed, access-to-justice focus. Recipient of the Nancy Cameron, KC Prize in Family Law (2020). Fluent in Indonesian.",
    bio: [
      "Valeska is a lawyer at RWE Law and has exclusively practiced family law since the commencement of her articles in 2021. She has advocated for clients in both the Provincial and Supreme Courts of BC.",
      "Valeska holds a Juris Doctor from UBC, where she received the Nancy Cameron, KC Prize in Family Law in 2020. She was called to the Bar of British Columbia in 2022. Prior to law school, Valeska obtained her Bachelor of Arts and Bachelor of Science from Dalhousie University, where she majored in Philosophy, Psychology, and Economics.",
      "Having spent the first year and a half of her practice as a sole practitioner primarily supporting low-income clients with a focus on family violence, Valeska values access to justice and a having trauma-informed approach to family law. She continues to volunteer with Rise Women's Legal Centre in training student clinicians and family law advocates, and has been a guest speaker for presentations on family violence for litigants and lawyers.",
      "In her practice, Valeska strives to meet each of her client's unique needs and help them identify their priorities. She is committed to providing approachable, plain-language legal services, and to promote her clients' agency and self-determination as they navigate their family law matters.",
      "Apart from her work, Valeska enjoys training in aerial acrobatics and sharing the company of her cat. Valeska is fluent in Indonesian.",
    ],
    barAdmissions: ["British Columbia (2022)"],
    education: [
      "Juris Doctor — University of British Columbia",
      "B.A. & B.Sc. Philosophy, Psychology, Economics — Dalhousie University",
    ],
    languages: ["English", "Indonesian"],
    email: "valeska@rwelaw.ca",
    phoneDisplay: "(236) 326-4042",
    photoPrimary: "/lawyers/valeska-tiffany-1.jpg",
    photoSecondary: "/lawyers/valeska-tiffany-2.jpg",
    consultationRateCad: 175,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/valeska-rwelaw",
    displayOrder: 7,
  },
  {
    slug: "sahaj-claire",
    name: "Sahaj Claire",
    title: "Associate",
    shortBio:
      "Client-focused family-law practice; prefers negotiated resolutions but prepared for confident in-court advocacy when needed.",
    bio: [
      "Sahaj Claire is a lawyer at RWE Family Law with a passion for family law and a desire to guide clients and their families through difficult and uncertain periods of their lives. He keeps an open mind and carefully listens to what clients have to say to better understand their unique circumstances, challenges, and goals.",
      "Sahaj aims to advocate for clients' interests efficiently and effectively while avoiding creating unnecessary conflict within the family. He prefers to resolve issues outside of court, but is prepared to provide strong, confident, in-court advocacy when necessary.",
      "Sahaj grew up in BC and attended law school at the Peter A. Allard School of Law where he obtained his Juris Doctor in 2024. In law school, Sahaj demonstrated a commitment to helping all members of the community and developed his client-focused approach to legal work while providing pro-bono legal services with the Law Students' Legal Advice Program. Sahaj was called to the bar in BC in 2025.",
      "Outside of work, Sahaj enjoys hiking, exploring new areas of the city, and spending quality time with friends and family.",
    ],
    barAdmissions: ["British Columbia (2025)"],
    education: [
      "Juris Doctor (2024) — Peter A. Allard School of Law, University of British Columbia",
    ],
    email: "claire@rwelaw.ca",
    phoneDisplay: "(778) 654-7940",
    photoPrimary: "/lawyers/claire-sahaj-1.jpg",
    photoSecondary: "/lawyers/claire-sahaj-2.jpg",
    consultationRateCad: 150,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/claire-rwelaw",
    displayOrder: 8,
  },
  {
    slug: "amandeep-cheema",
    name: "Amandeep Cheema",
    title: "Associate",
    shortBio:
      "Litigation experience across Provincial and Supreme Court of BC. Fluent in Punjabi and English.",
    bio: [
      "Amandeep Cheema is an associate lawyer who practices in all areas of family law, including spousal support, child support, parenting arrangements, and child protection. Amandeep was called to the BC Bar in 2025. She has strong litigation experience, having represented clients in both the Provincial and Supreme Courts of British Columbia.",
      "Amandeep obtained her Juris Doctor from Thompson Rivers University in 2024, where she was a Dean's List recipient throughout her studies. During law school, she developed strong advocacy skills through her volunteer work with the Law Students Legal Advice Program and by competing in the Western Canada Family Law Negotiation Moot, where she and her teammate won first place. She also contributed to the law school community as a mentor and served as Co-Chair of External Relations for the TRU Society of Law Students Conference.",
      "Prior to attending law school, Amandeep completed a Bachelor of Arts in Criminology at Simon Fraser University, earning Dean's Honour Roll recognition. Her earlier education and client-focused work experience helped her develop strong communication and problem-solving skills, which inform her hands-on approach to legal practice.",
      "In her spare time, Amandeep enjoys hiking, traveling to new destinations, and spending time with friends and family. She is fluent in Punjabi and English.",
    ],
    barAdmissions: ["British Columbia (2025)"],
    education: [
      "Juris Doctor (2024) — Thompson Rivers University",
      "B.A. Criminology — Simon Fraser University",
    ],
    languages: ["English", "Punjabi"],
    email: "cheema@rwelaw.ca",
    phoneDisplay: "(778) 655-1793",
    photoPrimary: "/lawyers/cheema-amandeep-1.jpg",
    photoSecondary: "/lawyers/cheema-amandeep-2.jpg",
    consultationRateCad: 150,
    consultationMinutes: 30,
    displayOrder: 9,
  },
  {
    slug: "bionca-chu",
    name: "Bionca Chu",
    title: "Associate",
    shortBio:
      "Associate bringing empathy, diligence, and cultural fluency to family-law practice.",
    bio: [
      "Bionca recently received her Juris Doctor from the University of Ottawa, following a Bachelor of Arts in Anthropology with a Minor in Creative Writing from the University of British Columbia. During law school she worked with Rise Women's Legal Centre and Pro Bono Students Canada.",
      "With a leadership and community engagement background, Bionca brings a unique blend of empathy, diligence, and cultural fluency to her work. She is committed to providing clear, client-focused legal support and values fair and practical solutions. Her long-term goal is to build a career in family law that reflects her dedication to empowerment, equity, and care.",
      "Outside of her legal pursuits, Bionca enjoys boxing, spinning, and travelling. In her free time, you can find Bionca exploring new restaurants with her dog, Lilo.",
    ],
    barAdmissions: ["British Columbia"],
    education: [
      "Juris Doctor — University of Ottawa",
      "B.A. Anthropology, Minor in Creative Writing — University of British Columbia",
    ],
    email: "chu@rwelaw.ca",
    phoneDisplay: "(778) 897-1937",
    photoPrimary: "/lawyers/chu-bionca-1.jpg",
    photoSecondary: "/lawyers/chu-bionca-2.jpg",
    consultationRateCad: 150,
    consultationMinutes: 30,
    calendlyUrl: "https://calendly.com/chu-rwelaw",
    displayOrder: 10,
  },
];

export function getLawyerBySlug(slug: string): Lawyer | undefined {
  return lawyers.find((l) => l.slug === slug);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((p) => p.length > 0 && !p.endsWith("."))
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
