import type { Metadata } from "next";
import Link from "next/link";
import { Container, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "High net worth family law",
  description:
    "Family law for clients with corporate, trust, and complex tax exposure — resulting trusts, discretionary trust interests, closely-held companies, and tax-aware settlement structuring.",
};

export default function HighNetWorthPage() {
  return (
    <Container className="py-16 md:py-24">
      <Link
        href="/practice-areas/family-property-division"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)] mb-10"
      >
        <span aria-hidden="true">←</span>
        Back to family property &amp; debt
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6 text-[color:var(--color-gold-600)] text-xs uppercase tracking-[0.18em] font-medium">
          <span className="gold-rule" aria-hidden="true" />
          <span>For clients with complex assets</span>
        </div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-[color:var(--color-forest-900)]">
          High net worth family law.
        </h1>
        <p className="mt-5 text-xl text-[color:var(--color-forest-700)] italic font-display">
          Where the issues aren&rsquo;t just <em>what</em> you own, but how it&rsquo;s held and how it gets divided without a tax bill that swallows the settlement.
        </p>
        <p className="mt-7 text-lg text-[color:var(--color-ink-700)] leading-relaxed">
          Most family-law disputes turn on a house, a couple of pensions, and a
          bit of debt. Some don&rsquo;t. When there are corporate holdings,
          discretionary family trusts, foreign assets, or pre-relationship
          wealth that has grown materially during the marriage, the legal
          questions get more technical and the cost of getting them wrong gets
          higher. This page is for clients who are dealing with that second
          set of facts — and for the accountants and advisors helping them.
        </p>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16">
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
              Resulting trusts and parental contributions
            </h2>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed">
              When parents help with a down payment, pay down a mortgage, or
              transfer a property into a child&rsquo;s name, the question
              years later is whether that money was a gift or held on a
              resulting trust for the parent. The Supreme Court of
              Canada&rsquo;s decision in <em>Pecore v. Pecore</em>, 2007 SCC 17
              sets out the framework: gratuitous transfers between adults are
              presumed to be held on resulting trust unless the evidence shows
              the transferor intended a gift. The presumption of advancement
              between parents and adult children no longer applies in the way
              it once did.
            </p>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed mt-3">
              In a separation, this matters in two directions. If parental
              money helped buy the family home in your name alone, your spouse
              may argue it was a gift to the family. If parental money helped
              buy the home in joint names, your parents may have a resulting
              trust claim that takes their contribution off the family-property
              ledger. Contemporaneous documents — emails, bank records, any
              loan agreement, gift letters provided to the lender — are
              decisive. We work with clients early to gather that evidence
              before the other side&rsquo;s narrative hardens.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
              Discretionary family trusts
            </h2>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed">
              An interest in a discretionary inter-vivos family trust is one
              of the harder questions under section 84 of the <em>Family Law Act</em>.
              The statute defines family property broadly to include &ldquo;the
              spouse&rsquo;s interest in property&rdquo; — but a discretionary
              beneficiary holds only a contingent right to be considered by
              the trustee, not a vested entitlement. Whether and how that
              interest is divisible has been litigated repeatedly. The answer
              turns on the trust&rsquo;s terms, the history of distributions,
              the relationship between the trustee and the spouse-beneficiary,
              and whether the trust is, in substance, a holding vehicle that
              the spouse effectively controls.
            </p>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed mt-3">
              We review the trust deed, the pattern of distributions during
              the relationship, and the structure of any related corporate
              entities before forming a view. If you&rsquo;re a beneficiary,
              the question is how to characterize the interest in a way that
              reflects its actual economic value. If your spouse is a
              beneficiary of family money, the question is what disclosure
              they&rsquo;re obliged to give about a structure they don&rsquo;t
              technically &ldquo;own.&rdquo;
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
              Closely-held corporations and owner-managers
            </h2>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed">
              Where one or both spouses own shares in a private company —
              whether it&rsquo;s an opco, a holdco, or a holdco-opco
              structure — the live questions are valuation, retained
              earnings, and how shares get transferred (or compensated for)
              on settlement. A Chartered Business Valuator is almost always
              necessary; we don&rsquo;t do business valuations in-house, and
              we&rsquo;re skeptical of family-law lawyers who claim to.
            </p>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed mt-3">
              Practical issues that come up regularly: minority-interest
              discounts and whether the spouse&rsquo;s shareholding is in fact
              a minority interest in any meaningful sense; retained earnings
              and whether they should be treated as marital wealth or
              operating reserves; the difference between excluded property
              (shares owned before the relationship) and the increase in
              value of those shares during it, which is divisible under
              s. 84(2)(g); and the section 84.1 trap under the federal{" "}
              <em>Income Tax Act</em>, which can convert what should be a
              capital gain into a deemed dividend on a non-arm&rsquo;s-length
              share transfer. Settlement structures that look clean on the
              family-law side can carry a six-figure tax cost if they&rsquo;re
              papered without a tax accountant in the room.
            </p>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed mt-3">
              Expenses run through a corporation may not be treated as
              income for tax purposes but may still be considered guideline
              income for child or spousal support purposes. The legal test
              looks at whether there was a personal or business benefit of
              the expense, and the onus is on the payor to show that it was
              a legitimate business expense. If business expenses are deemed
              personal, there may be a grossing up of guideline income to
              account for the personal taxes that would otherwise have been
              paid.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
              Tax-aware settlement structuring
            </h2>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed">
              On the federal tax side, the rules are favourable to spouses
              dividing property — but only if the settlement is drafted to
              use them. A few that come up most:
            </p>
            <ul className="mt-4 space-y-3 text-[color:var(--color-ink-700)] leading-relaxed list-disc pl-5">
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Spousal rollover under s. 73(1) of the <em>Income Tax Act</em>
                </span>
                {" "}— transfers of capital property between spouses (or
                former spouses, if made in settlement of rights arising out
                of the relationship) are deemed to occur at cost, deferring
                the gain. The drafting matters: the rollover is the default,
                but it can be elected out of where it makes sense to
                crystallize the gain at separation.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  RRSP rollover under s. 146(16)
                </span>
                {" "}— RRSP balances can be transferred between separating
                spouses on a tax-deferred basis using a CRA Form T2220, but
                only when the transfer is made under a written separation
                agreement or court order. Cash equalization paid out of a
                payor&rsquo;s RRSP without using this provision is fully
                taxable in the payor&rsquo;s hands.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Principal residence designation
                </span>
                {" "}— spouses can only designate one principal residence
                between them while married. After separation, each can
                potentially designate their own going forward. The
                designation strategy on a sale or transfer of either home
                during separation can shift tens of thousands in capital
                gains exposure depending on which years are claimed where.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Periodic vs. lump-sum support
                </span>
                {" "}— periodic spousal support is deductible to the payor
                and taxable to the recipient under ss. 56.1 and 60(b);
                lump-sum spousal support is generally not. The structure
                affects both the after-tax cost and the leverage either
                party has on a deal.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Equalization payments funded with property
                </span>
                {" "}— transferring shares, real estate, or other capital
                property to satisfy an equalization obligation can trigger
                the section 73(1) rollover automatically, or a disposition
                at fair market value. Which one applies depends on how the
                agreement is drafted and when the transfer happens relative
                to the divorce.
              </li>
            </ul>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed mt-4">
              We don&rsquo;t give tax advice. We work with your accountant or
              tax lawyer — or recommend one — to make sure the settlement
              your family-law lawyer drafts doesn&rsquo;t cost you on the tax
              side. The right time to involve them is before the offer goes
              out, not after the deal is signed.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
              Working with your other advisors
            </h2>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed">
              On a complex file we expect to coordinate with several
              professionals: a Chartered Business Valuator on private-company
              shares, a tax accountant or tax lawyer on settlement structure,
              an estate lawyer on the will and any spousal trusts, and
              sometimes a forensic accountant where disclosure is being
              actively obstructed. Our job is to drive the legal strategy
              and make sure each advisor&rsquo;s analysis is reflected in the
              agreement. If you don&rsquo;t already have these professionals
              in place, we have lawyers we&rsquo;ve worked with for years on
              files like yours and can introduce you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
              Disclosure and the harder cases
            </h2>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed">
              Section 5 of the <em>Family Law Act</em> imposes a duty of full
              and complete disclosure on both spouses. In high net worth
              files, the practical disclosure work is harder: corporate
              minute books, holdco financial statements, intercompany loans,
              foreign-held assets, cryptocurrency wallets, art, vehicles,
              collections. Where one spouse controls the books, requests for
              production are routinely incomplete on the first pass. We
              know what to ask for, what an inadequate response looks like,
              and when an application for an order compelling production —
              or, in the right case, an adverse inference at trial — is the
              right next step.
            </p>
            <p className="text-[color:var(--color-ink-700)] leading-relaxed mt-3">
              We also work on the other side of that problem: representing
              the spouse who owns the structure and is being asked to produce
              ten years of corporate records on a fishing expedition. The
              duty to disclose is real, but it isn&rsquo;t unlimited.
            </p>
          </section>

          <section className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-6 md:p-7">
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
              A note on this page
            </div>
            <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
              This page is more general than the work itself. Every structure
              is different, and the tax and trust rules referenced above have
              exceptions and edge cases that only matter once we&rsquo;re
              looking at your specific facts. The page is intended to give
              you a sense of whether we speak your language; it is not legal
              advice and should not be relied upon as such.
            </p>
          </section>
        </div>

        <aside className="md:sticky md:top-28 h-fit rounded-xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-8">
          <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-400)] mb-3">
            Initial conversation
          </div>
          <div className="font-display text-2xl leading-tight">
            Book a private consultation about your matter.
          </div>
          <p className="mt-4 text-sm text-[color:var(--color-cream-100)]/80 leading-relaxed">
            One hour to walk through the structure, identify the live issues,
            and tell you what we think the file looks like before you commit
            to anything.
          </p>
          <ButtonLink href="/book" variant="gold" size="md" className="mt-6 w-full">
            Book now
          </ButtonLink>
          <div className="mt-6 pt-6 border-t border-[color:var(--color-forest-800)] text-xs text-[color:var(--color-cream-100)]/70 leading-relaxed">
            Bringing your accountant or financial advisor to the consult is
            often useful — let us know in advance and we&rsquo;ll plan the
            time accordingly.
          </div>
        </aside>
      </div>
    </Container>
  );
}
