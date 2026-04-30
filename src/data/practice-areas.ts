export type PracticeArea = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  body: { heading: string; text: string }[];
  faqs: { q: string; a: string }[];
  /**
   * Cross-links to related pages outside the practice-areas system —
   * e.g. /high-net-worth from family property division. Rendered as a
   * small "Related" section below the body.
   */
  relatedLinks?: { href: string; title: string; blurb: string }[];
  /** Legal-information disclaimer shown at the bottom of the page. */
  disclaimer?: string;
};

const STANDARD_DISCLAIMER =
  "Laws are subject to change. This website's contents are not intended as legal advice and should not be relied upon. You should consult a lawyer before applying any law to any case or factual circumstances.";

export const practiceAreas: PracticeArea[] = [
  {
    slug: "divorce",
    title: "Divorce",
    tagline: "Ending a marriage with clarity and dignity.",
    summary:
      "We handle both contested divorces — where property, support, and parenting are still in dispute — and uncontested (desk order) divorces where the paperwork just needs to be correct the first time.",
    body: [
      {
        heading: "Contested Divorce",
        text: "A divorce may be initiated by filing a Notice of Family Claim with the registry of the Supreme Court of British Columbia. Although getting the divorce itself is usually not contested, the court often waits until the other issues are worked out before a divorce is granted. Other issues may include: a division of family assets, child & spousal support, custody, guardianship and access. In particular, the court must be satisfied that adequate child support provisions are in place before granting a divorce.",
      },
      {
        heading: "Grounds for divorce",
        text: "For a divorce to be granted: (1) there must be a legal marriage; (2) at least one of the parties has resided in BC for the past year (Divorce Act, s. 3); (3) there has been cruelty, or adultery, or you and your spouse have lived separate and apart for one year (which may still be under one roof). In practice, cruelty and adultery are rarely used as a basis for divorce — it will likely take more than a year to prove either. The most common and easiest basis for divorce is to live separate and apart for one year. Finally, the court must be satisfied that reasonable arrangements have been made for the support of any children of the marriage (Divorce Act, s. 11(b)).",
      },
      {
        heading: "Desk Order (Uncontested) Divorce",
        text: "In cases where there are no other issues outstanding, a divorce may be granted without attending court. There is a fair amount of paperwork involved and a divorce lawyer can help you assemble the package correctly. Other issues may include: a division of family assets, child & spousal support, custody, guardianship or access. We can assist you with a standard uncontested divorce — please see the Legal Fees section for prices, and don't hesitate to contact us with any questions.",
      },
    ],
    faqs: [
      {
        q: "How long does a divorce take in British Columbia?",
        a: "An uncontested desk order divorce, with a complete file, typically takes four to six months from filing. A contested divorce can take a year or longer depending on the issues.",
      },
      {
        q: "Do we need to be separated for a year before filing?",
        a: "The most common ground for divorce in Canada is one year of separation. You can file the application earlier, but the divorce order will not be granted until the year has passed.",
      },
    ],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "family-property-division",
    title: "Family Property & Debt Division",
    tagline: "Fair outcomes on the financial side of separation.",
    summary:
      "The Family Law Act governs how property and debt are divided in BC. The rules apply to married spouses and to unmarried spouses who have lived together in a marriage-like relationship for at least two years.",
    body: [
      {
        heading: "Family Law Act",
        text: "The Family Law Act of British Columbia is the provincial legislation that governs the division of property in British Columbia. The property division scheme under the Family Law Act applies to married spouses and unmarried spouses who are cohabiting in a marriage-like relationship for at least two years (sections 3 and 81). Spouses in either of these two categories may apply to court for a division of property. Applications for property relief under the Family Law Act must be made in the Supreme Court of British Columbia, not the Provincial Court.",
      },
      {
        heading: "Family Property",
        text: "Family property is defined in section 84 of the Family Law Act as the real and personal property that one or both spouses own during their relationship and before separation. Examples include the family home, RRSPs, pensions, bank accounts, investments, insurance policies, and shares or interests in a corporation. Generally, each spouse is entitled to one half of family property.",
      },
      {
        heading: "Excluded Property",
        text: "Excluded property is defined in section 85 of the Family Law Act. Examples include property acquired by one spouse before the relationship began, inheritances and gifts to one spouse, insurance proceeds, settlements or awards of damages, and certain trust property. There are exceptions: the increase in value of excluded property during the relationship is divisible, and property acquired after separation can still be considered family property if it was acquired by using family property or its proceeds.",
      },
      {
        heading: "Family Debt",
        text: "As with family property, debts that either or both spouses incurred during the relationship are divided equally between them. After separation, spouses are responsible for their own new debt — but family debt incurred by one spouse after separation is still divided equally if it was incurred to maintain family property. Family debt is dealt with in section 86 of the Family Law Act.",
      },
      {
        heading: "Valuation",
        text: "The valuation of family property and debt is determined either at the date of an agreement dividing them, or at the hearing before the court. Both parties may be subject to fair-market increases or decreases in property values until the agreement is signed or the trial begins. Section 87 of the Family Law Act provides the legal basis for valuation.",
      },
      {
        heading: "Temporary Orders",
        text: "Before a final determination is made on the issues arising from separation, the court — under section 89 of the Family Law Act — can make an order for interim (temporary) distribution of family property to fund the resolution of a dispute, such as legal fees, alternative dispute resolution fees, accountants, or business valuators. Under section 90, the court can grant a spouse exclusive occupancy of the family residence and possession of personal property there. Under section 91, a spouse can apply for an order restraining the other from disposing of any property before a final determination.",
      },
      {
        heading: "Time Limits",
        text: "There are important limitation periods. Married spouses must bring an application for property relief within two years of the date of divorce or a declaration of nullity (s. 198(2)(a)). Unmarried spouses must apply within two years of the date of separation (s. 198(2)(b)). Contact us so we can discuss these timelines and take immediate steps to preserve your property claims.",
      },
    ],
    faqs: [],
    relatedLinks: [
      {
        href: "/high-net-worth",
        title: "High net worth family law",
        blurb:
          "Resulting trusts, discretionary family trust interests, closely-held companies, and tax-aware settlement structuring — for clients whose property division involves more than a house and a pension.",
      },
    ],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "spousal-support",
    title: "Spousal Support",
    tagline: "Practical guidance on one of the hardest financial questions.",
    summary:
      "Spousal support is meant to compensate a former spouse for missed economic opportunities that are a result of the relationship. Entitlement comes first; the Spousal Support Advisory Guidelines then drive amount and duration.",
    body: [
      {
        heading: "Objectives of Spousal Support",
        text: "The objectives of spousal support are set out in section 15.2 of the Divorce Act for married spouses, and section 161 of the Family Law Act for unmarried spouses: (a) to recognize any economic advantages or disadvantages arising from the relationship or its breakdown; (b) to apportion between the spouses any financial consequences of caring for a child, beyond the duty to provide child support; (c) to relieve any economic hardship arising from the breakdown of the relationship; and (d) as far as practicable, to promote the economic self-sufficiency of each spouse within a reasonable period of time.",
      },
      {
        heading: "Calculating Spousal Support",
        text: "The amount and duration of spousal support are set out in section 162 of the Family Law Act and are determined by considering the conditions, means, and needs of each spouse, the length of time the spouses lived together, and the functions performed by each during that time (such as housekeeping or raising children). Child support obligations take priority over spousal support obligations, pursuant to section 15.3 of the Divorce Act and section 173 of the Family Law Act. The calculation often involves the Spousal Support Advisory Guidelines — a complex formula best applied with professional judgment, not just a calculator.",
      },
      {
        heading: "Spousal Support Agreements",
        text: "Spousal support agreements are a factor taken into account by a court pursuant to section 15.2(4)(c) of the Divorce Act and sections 162(c) and 163 of the Family Law Act. Agreements can determine whether spousal support will or will not be paid. Generally, agreements that are signed by both parties, witnessed, and filed in court operate as if they were court orders.",
      },
      {
        heading: "Setting Agreements Aside",
        text: "Spousal support agreements can be changed or set aside in some circumstances. Along with the factors in section 164 of the Family Law Act, these include: failure to disclose, or lying or hiding financial information, that led to the agreement; improper advantage taken of the other's vulnerability, including ignorance, need, or distress; lack of understanding or mental capacity to enter the agreement; threats; or fundamental unfairness. A court may consider the time passed since the agreement, any changes in the spouses' circumstances, the intention to achieve certainty, the degree of reliance on the agreement, and how well the agreement meets the spousal support objectives in section 161.",
      },
    ],
    faqs: [],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "child-support",
    title: "Child Support",
    tagline: "Getting the guidelines right — and the special expenses too.",
    summary:
      "The guiding principle of Canada's child support law is that children should continue to benefit from the financial means of both parents, just as they would if the parents were still together.",
    body: [
      {
        heading: "The Obligation to Pay",
        text: "The obligation to pay child support for married couples comes from section 15.1 of the Divorce Act, and for unmarried parents and guardians from section 147 of the Family Law Act. Once it is determined that there is an obligation to pay child support, the amount payable is determined by section 150 of the Family Law Act with reference to the Federal Child Support Guidelines.",
      },
      {
        heading: "Objectives of the Guidelines",
        text: "The objectives set out in section 1 of the Federal Child Support Guidelines are: (a) to establish a fair standard of support for children that ensures they continue to benefit from the financial means of both spouses after separation; (b) to reduce conflict and tension between spouses by making the calculation of child support orders more objective; (c) to improve the efficiency of the legal process by guiding courts and spouses in setting support levels and encouraging settlement; and (d) to ensure consistent treatment of spouses and children in similar circumstances.",
      },
      {
        heading: "Calculating the Amount",
        text: "Child support payments are made by the parent or guardian (the 'payor') to the parent or guardian who bears the primary responsibility for the child's expenses (the 'recipient'). Step-parents may also have a duty to provide child support if they contributed to the support of the child for at least one year, and an application to the court is made within one year after the step-parent last contributed. The amount payable is determined by the payor's income and the table in the Federal Child Support Guidelines matching income to number of children.",
      },
      {
        heading: "Child Support Agreements",
        text: "Parents may make agreements between each other regarding the amount of child support to be paid, but those agreements have strict requirements and are not easily upheld. Agreements are permitted by section 15.1(5) of the Divorce Act and section 148 of the Family Law Act. The sections require that the agreements are made after separation (or when the parties are about to separate) and that they adequately provide for the child — otherwise a court will set the agreement aside and refer to the Federal Child Support Guidelines.",
      },
      {
        heading: "Child Support Is the Child's Right",
        text: "Child support cannot be bartered away by one or both parents. The court has jurisdiction to determine what is in the child's best interests, and can order child support different from that set out in the parents' agreement where the contractual amount is inadequate. See Hunble v. MacKay, 2012 BCSC 1285 (CanLII) at para. 20.",
      },
    ],
    faqs: [],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "custody-guardianship",
    title: "Custody & Guardianship",
    tagline: "Parental responsibilities and who gets to make which decisions.",
    summary:
      "Under the Family Law Act, the focus is no longer on parental rights but on parental responsibilities — the ways guardians care for a child and the decisions they have to make.",
    body: [
      {
        heading: "Parental Responsibilities",
        text: "The Family Law Act does not use the term custody, nor does it focus on parental rights. Instead, the focus shifts to responsibilities. Section 41 lists the 'Parental Responsibilities' of guardians: making day-to-day decisions and supervising the child; deciding where the child will reside; deciding with whom the child lives and associates; decisions about education and extracurricular activities; decisions about cultural, linguistic, religious and spiritual upbringing, including Aboriginal identity; medical and dental consent (subject to s. 17 of the Infants Act); applying for passports, licences, permits, and benefits; giving, refusing or withdrawing other consents; receiving and responding to notices; requesting records from third parties; starting, defending, or settling proceedings on the child's behalf; and any other responsibilities reasonably necessary to nurture the child's development.",
      },
      {
        heading: "Who May Have Parental Responsibilities",
        text: "Section 40 provides that only guardians may have Parental Responsibilities. They are generally shared by each guardian. Court orders or agreements may divide them up between guardians, or grant sole Parental Responsibilities to one guardian. Section 43 provides that Parental Responsibilities must be exercised in the best interests of the child. If a guardian is temporarily unable to exercise any of the Parental Responsibilities, they may, in writing, authorize another person to exercise them during that time.",
      },
      {
        heading: "Guardianship",
        text: "Section 39 provides that parents who live together with a child are each guardians. A parent who has never resided with his or her child is not the child's guardian unless: (1) the parent was involved in an agreement with those involved in assisted reproduction; (2) there is an agreement with all of the child's guardians that the parent is also a guardian (and, if the child is over 12, with that child's consent); or (3) the parent regularly cares for the child. Step-parents do not become guardians merely by marrying or entering a marriage-like relationship with a guardian, pursuant to section 39(4). For a step-parent to be a guardian, there would have to be an agreement with the other guardians, or the step-parent would have to regularly care for the child.",
      },
      {
        heading: "Applications for Guardianship",
        text: "There is no limit to how many guardians a child may have. Anyone may apply to be a child's guardian under section 51 of the Family Law Act. The applicant must provide the court with an affidavit regarding how the appointment will be in the best interests of the child, made pursuant to Supreme Court Family Rule 15-2.1 or Provincial Court (Family) Rule 18.1. The affidavit requires three attachments: an MCFD child-protection record check; a Protection Order Registry check; and a criminal record check. Strict time frames apply to both the affidavit and the attachments.",
      },
      {
        heading: "Termination of Guardianship",
        text: "Pursuant to section 51(1)(b), a court may terminate a person's guardianship on application. Case law holds that termination can only occur in the most extreme situations. A court may first ask whether, through an allocation of Parental Responsibilities, it continues to be in the best interests of the child that the parent remain a guardian. If it is, guardianship should not be terminated. Once a parent is no longer a guardian, they lose all Parental Responsibilities and are simply an adult who may have contact with the child. See D. v. D., 2013 BCPC 135 at paras. 23–24.",
      },
      {
        heading: "Custody — for Married Spouses",
        text: "For unmarried spouses, custody over children no longer exists under the Family Law Act — it has been replaced with Guardianship and an allocation of Parental Responsibilities. For married spouses, however, 'custody' is still a term used in section 16 of the Divorce Act. Custody describes a legal relationship between a guardian and a child that generally includes care and decision-making over the day-to-day routine of the child. Custody can be sole (held by one spouse) or joint (shared). A custodial spouse usually has a duty to maximize contact between the child and the other spouse. Custody for married spouses is in addition to guardianship, not a replacement for it.",
      },
    ],
    faqs: [],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "parenting-time-access",
    title: "Parenting Time & Access",
    tagline: "The time children spend with the adults in their lives.",
    summary:
      "For unmarried people, the Family Law Act uses 'Parenting Time' for guardians and 'Contact' for non-guardians. For married people, the Divorce Act uses 'Access' to cover all adult time with a child.",
    body: [
      {
        heading: "Parenting Time, Contact, and Access",
        text: "For unmarried people, sections 42 & 59 of the Family Law Act use the terms 'Parenting Time' for guardians and 'Contact' for non-guardians. Parenting Time is the time a child spends with a guardian; during Parenting Time, a guardian may exercise the responsibility of day-to-day decision-making. Contact is the time a child spends with a non-guardian; the non-guardian is not provided with responsibility for day-to-day decision-making. For married people, section 16 of the Divorce Act uses the term 'Access' to encompass all time an adult has with a child.",
      },
      {
        heading: "How Courts Decide",
        text: "To determine how much Parenting Time, Contact, or Access a person has with a child, courts generally begin with the principle of 'maximum contact' — the more time a child has with loved ones, the better. This is a general starting point only. Very young children are not able to split their time between parents and must spend significantly more time with their primary caregiver until about age two. School-aged children usually require continuity in their residence, and may, for example, have visits on alternating weekends with one weeknight per week. Some relationships involve a history of violence or substance abuse, and this can lead to Parenting Time, Contact, or Access being restricted to day times only, public places, supervision by a third-party friend or family member, or even supervision by a professional agency. After about age twelve, as the child gets older, their own views become more important.",
      },
    ],
    faqs: [],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "child-protection-mcfd",
    title: "Child Protection (MCFD)",
    tagline: "Urgent representation when the Ministry is involved.",
    summary:
      "When a social worker with the Ministry of Children and Family Development is investigating you or your family, getting legal advice early — before the next conversation — can change the outcome.",
    body: [
      {
        heading: "Get a Lawyer Before the Next Conversation",
        text: "When a social worker working for the Ministry of Children and Family Development investigates you or your family member, it is critically important that you contact a lawyer as soon as possible.",
      },
      {
        heading: "Broad Powers Under the CFCSA",
        text: "The Child, Family and Community Service Act provides social workers with broad powers, including the power to remove a child from parents without warning and place a child in foster care.",
      },
      {
        heading: "Time Limits Matter",
        text: "The Child, Family and Community Service Act has important time limits in place. Children are returned to parents either by the courts or through collaborative work with the Ministry. It is important for parents to know their rights in order to navigate the court and collaborative processes during this most difficult time.",
      },
    ],
    faqs: [],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "prenups",
    title: "Prenuptial & Cohabitation Agreements",
    tagline: "Clarity now so there's no argument later.",
    summary:
      "A well-drafted prenuptial or cohabitation agreement can set out, in advance, how property and support will be handled if the relationship ends — protecting business interests, inheritances, and pre-relationship assets.",
    body: [
      {
        heading: "When to consider one",
        text: "Prenuptial agreements are signed before marriage; cohabitation agreements are signed between unmarried spouses who live together in a marriage-like relationship. Both are most valuable when one party is bringing significant pre-relationship assets (a home, a business, an inheritance) or where the parties want certainty about whether spousal support will or will not be paid if they separate.",
      },
      {
        heading: "What makes one enforceable",
        text: "Under the Family Law Act, agreements that are signed by both parties, witnessed, and based on full financial disclosure are generally respected by the court. Courts can set agreements aside where there was failure to disclose, improper advantage taken of a vulnerable party, lack of capacity, threats, or fundamental unfairness. Getting independent legal advice for each party before signing is what makes the agreement hold up later.",
      },
    ],
    faqs: [],
    disclaimer: STANDARD_DISCLAIMER,
  },

  {
    slug: "appeals",
    title: "Family Law Appeals",
    tagline: "Appellate work at the Supreme Court and Court of Appeal.",
    summary:
      "Appeals are not a second kick at the can — they're a narrow review for obvious error. They require significant preparation, and there are strict timelines on filing notice.",
    body: [
      {
        heading: "What an Appeal Actually Is",
        text: "In most cases, the judge's decision is the final say on an issue. However, sometimes, in rare instances, the judge errs and gets it wrong. Appeals are a process to ensure the fair and proper administration of justice in our courts. An appeal is not a second kick at the can — that is, an appeal is not a re-trial. When reviewing a case, the appellate judge looks at whether the prior decision-maker made a mistake in understanding the facts of the case, or a mistake when interpreting the law. The mistake must be obvious. Furthermore, that mistake must have had such a significant effect on the outcome of the case that it led to an incorrect or unreasonable decision being made.",
      },
      {
        heading: "Strict Timelines",
        text: "Appeals require a significant amount of preparation and work, and consequently are expensive to pursue. You should always seek a legal opinion prior to commencing an appeal. There are strict timelines on filing notice of appeal. If you have a question regarding an appeal, you should seek legal advice as soon as possible to ensure a deadline is not missed.",
      },
    ],
    faqs: [],
    disclaimer: STANDARD_DISCLAIMER,
  },
];

export function getPracticeAreaBySlug(slug: string): PracticeArea | undefined {
  return practiceAreas.find((p) => p.slug === slug);
}
