import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | RestoRefine Creators",
  description: "RestoRefine Studios: Creator Network Terms and Conditions",
};

const sections: { title: string; paragraphs: string[] }[] = [
  {
    title: "1. Who we are",
    paragraphs: [
      'RestoRefine Studios is a trading name of RestoRefine Ltd, a company registered in Scotland with its registered office at 24 Fairley Street, Glasgow, G51 2SN. These Terms and Conditions ("Terms") govern your registration with and participation in the RestoRefine Studios creator network ("the Network"). By submitting an application to join the Network you confirm that you have read, understood and agreed to these Terms in full. If you do not agree you must not submit an application.',
      'All references to "RestoRefine Studios", "we", "us" and "our" throughout these Terms refer to RestoRefine Ltd.',
    ],
  },
  {
    title: "2. Eligibility",
    paragraphs: [
      "To apply to join the Network you must be at least 18 years of age at the time of application and have the legal right to work and enter into commercial agreements in the United Kingdom. By applying you confirm both of these things are true.",
      "RestoRefine Ltd reserves the right to request proof of age or identity at any time. Any Creator found to have misrepresented their eligibility will be removed from the Network immediately and without compensation.",
    ],
  },
  {
    title: "3. No guarantee of work, income or opportunity",
    paragraphs: [
      "Joining the Network does not constitute an offer of employment, a contract for services or any guarantee of income or opportunity. RestoRefine Studios makes no representation that any Creator will receive opportunities, paid or otherwise, at any time or with any frequency.",
      "The availability of opportunities depends entirely on Client briefs, campaign requirements and budget, none of which are within RestoRefine Studios' control. Opportunities through the Network vary widely in nature and value. They may include but are not limited to local food or product tastings, gifted collaborations, paid social media content, event appearances, brand ambassadorships, day rate presenting work and exclusive long-term presenter or spokesperson agreements.",
      "Compensation structures may include hourly rates, flat fees, day rates, retainer arrangements, commission, gifted products or a combination of these. RestoRefine Studios does not set or guarantee rates and makes no representation as to the financial value of any opportunity presented.",
      "Any paid or commercial arrangement will be subject to a separate written agreement between the Creator and RestoRefine Ltd or the relevant Client at the time the opportunity is offered and accepted. Nothing in these Terms constitutes a binding offer of paid work.",
    ],
  },
  {
    title: "4. Application and profile accuracy",
    paragraphs: [
      "By submitting an application you warrant that all information provided is accurate, complete and not misleading at the time of submission. This includes but is not limited to your identity, location, follower counts, audience demographics, engagement rates, previous brand relationships and any content examples provided.",
      "Any deliberate misrepresentation, inflation of statistics or provision of false information will result in immediate and permanent removal from the Network. RestoRefine Studios reserves the right to verify any information provided through third party tools, platform data or direct request at any time. Creators are responsible for keeping their profile information up to date and must notify RestoRefine Studios of any material changes promptly.",
    ],
  },
  {
    title: "5. Data collection, storage and use",
    paragraphs: [
      "RestoRefine Studios collects personal and professional information from Creators for the following purposes. To evaluate applications and maintain the Network. To match Creator profiles against Client briefs and requirements. To present Creator profiles including photographs and audience data to vetted Clients when a potential opportunity arises. To communicate with Creators regarding opportunities, updates to these Terms or changes to the Network. To operate, improve and develop the RestoRefine Studios platform and services.",
      "All personal data is processed in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. RestoRefine Ltd acts as the data controller. Your data will not be sold to any third party under any circumstances. It may be shared with Clients solely for the purpose of evaluating your suitability for a specific opportunity.",
      "You have the right at any time to request access to the personal data we hold about you, to request correction of inaccurate data, to request deletion of your data, to withdraw your consent for processing and to lodge a complaint with the Information Commissioner's Office. All requests should be directed to talent@restorefine.com and will be actioned within 30 days.",
      "By submitting an application you give explicit and informed consent to the collection, storage, processing and sharing of your personal data as described in this clause.",
    ],
  },
  {
    title: "6. Photographs and use of likeness",
    paragraphs: [
      "By uploading photographs as part of your application you confirm that you are the individual depicted in each image and that you own or hold all necessary rights to those images. You grant RestoRefine Ltd a non-exclusive, royalty-free licence to store, reproduce and share your submitted photographs with Clients for the sole purpose of profile presentation and opportunity matching.",
      "RestoRefine Studios will not use your photographs, name, likeness or any other identifying information in any public-facing marketing, advertising or promotional material without your separate explicit written consent. This licence may be revoked at any time by requesting removal from the Network, subject to the data retention provisions in clause 5.",
    ],
  },
  {
    title: "7. Opportunity process and Creator obligations",
    paragraphs: [
      "When RestoRefine Studios identifies a potential opportunity suitable for a Creator, we will contact that Creator with the relevant details. Creators are under no obligation to accept any opportunity presented to them.",
      "Once a Creator has accepted an opportunity and a separate agreement has been entered into, the Creator is expected to fulfil the agreed deliverables to the standard and timeline specified. Failure to fulfil agreed deliverables without reasonable notice or legitimate reason may result in removal from the Network, recovery of any fees paid in advance and a claim for losses suffered by RestoRefine Ltd or the relevant Client.",
      "Creators must comply with all applicable advertising regulations including the ASA and CAP Code requirements for declaring paid partnerships and sponsored content. Failure to disclose a commercial relationship where required by law is the sole responsibility of the Creator. RestoRefine Studios accepts no liability for a Creator's failure to meet their disclosure obligations.",
    ],
  },
  {
    title: "8. Independent contractor status",
    paragraphs: [
      "Nothing in these Terms, or in any subsequent agreement for a specific opportunity, shall be construed as creating an employment relationship, a worker relationship, a partnership, a joint venture or an agency arrangement between RestoRefine Ltd and any Creator. Creators participating in paid opportunities operate entirely as independent contractors.",
      "Creators are solely responsible for their own tax affairs including income tax and National Insurance contributions, their registration with HMRC where required, compliance with IR35 or off-payroll working rules where applicable and any VAT obligations arising from their activities. RestoRefine Ltd accepts no liability for any Creator's failure to meet their tax obligations.",
    ],
  },
  {
    title: "9. Intellectual property",
    paragraphs: [
      "All content created by a Creator in connection with a specific opportunity will be subject to the intellectual property terms set out in the relevant opportunity agreement. Unless otherwise agreed in writing, Creators retain ownership of their pre-existing content and intellectual property. Nothing in these Terms transfers ownership of any Creator's content, brand, name or likeness to RestoRefine Ltd.",
      "RestoRefine Ltd retains all intellectual property rights in the Network, the platform, the RestoRefine and RestoRefine Studios names and brands and any materials it produces. Creators may not use the RestoRefine or RestoRefine Studios name, logo or branding without express written permission.",
    ],
  },
  {
    title: "10. Conduct, standards and removal",
    paragraphs: [
      "Creators within the Network are expected to maintain a professional standard of conduct in all dealings with RestoRefine Studios, its staff and its Clients. RestoRefine Studios reserves the right to remove any Creator from the Network at any time, with immediate effect and without liability, in any of the following circumstances.",
      "Where the Creator's public conduct, published content, stated views or professional associations are deemed by RestoRefine Studios, in its sole and reasonable discretion, to be inconsistent with the values or reputational interests of RestoRefine Ltd or any of its Clients. Where the Creator has provided false or misleading information at any point. Where the Creator has behaved in a manner that is abusive, discriminatory, threatening or otherwise inappropriate toward RestoRefine Studios staff, Clients or other Creators. Where the Creator has breached any obligation under these Terms or under any separate opportunity agreement. Where the Creator has brought RestoRefine Studios or RestoRefine Ltd into disrepute.",
      "Removal from the Network does not entitle the Creator to any compensation, notice payment or explanation beyond what is required by law.",
    ],
  },
  {
    title: "11. Confidentiality",
    paragraphs: [
      "Creators may from time to time receive information about Clients, campaigns, briefs or commercial arrangements that is confidential in nature. Creators agree not to disclose any such information to any third party without the prior written consent of RestoRefine Studios. This obligation survives removal or withdrawal from the Network indefinitely.",
    ],
  },
  {
    title: "12. Future platform and network development",
    paragraphs: [
      "RestoRefine Studios may in the future develop and operate a digital platform or application through which Creators can view, receive and accept opportunities directly. Profile data submitted through the current application form may be migrated to such a platform. Creators will be given reasonable notice of any such migration and will be provided with updated terms of service prior to the platform launch. Continued use of any such platform following notification will constitute acceptance of the relevant updated terms.",
      "RestoRefine Studios reserves the right to change the structure, operation and terms of the Network at any time, including the method by which opportunities are distributed, the criteria for inclusion, the fee or commission structure and the categories of opportunity available. Material changes will be communicated to registered Creators by email with reasonable notice.",
    ],
  },
  {
    title: "13. Fees and commission",
    paragraphs: [
      "RestoRefine Studios may charge a fee or commission on opportunities facilitated through the Network. Where applicable, any such fee or commission will be disclosed clearly in the specific opportunity agreement before a Creator accepts the engagement. RestoRefine Studios reserves the right to introduce, amend or remove a fee structure at any time, with reasonable notice given to registered Creators.",
    ],
  },
  {
    title: "14. Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, RestoRefine Ltd shall not be liable for any loss of earnings, loss of anticipated income, loss of opportunity, damage to reputation or any indirect, consequential or special loss arising from your participation in, removal from or inability to access the Network.",
      "RestoRefine Studios does not warrant that the Network will be uninterrupted, error-free or continuously available. The total aggregate liability of RestoRefine Ltd to any Creator in connection with these Terms shall not exceed one hundred pounds (£100) in any twelve month period.",
      "Nothing in these Terms excludes liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation or any other liability that cannot be excluded or limited under Scottish or UK law.",
    ],
  },
  {
    title: "15. Indemnity",
    paragraphs: [
      "You agree to indemnify and hold harmless RestoRefine Ltd, its directors, employees and agents from and against any claims, losses, damages, costs or expenses including reasonable legal fees arising from your breach of these Terms, any misrepresentation made by you, your failure to comply with applicable advertising or tax regulations or any act or omission in connection with an opportunity you have accepted.",
    ],
  },
  {
    title: "16. Governing law and jurisdiction",
    paragraphs: [
      "These Terms are governed by and construed in accordance with the law of Scotland. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the Scottish courts.",
    ],
  },
  {
    title: "17. Entire agreement",
    paragraphs: [
      "These Terms constitute the entire agreement between RestoRefine Ltd and the Creator with respect to participation in the Network and supersede all prior discussions, representations or agreements. No variation of these Terms shall be effective unless made in writing by RestoRefine Studios.",
    ],
  },
  {
    title: "18. Updates to these Terms",
    paragraphs: [
      "RestoRefine Studios reserves the right to update or amend these Terms at any time. Registered Creators will be notified of any material changes by email to the address provided at registration. Continued participation in the Network following notification of changes will constitute acceptance of the revised Terms. If you do not accept the revised Terms you must notify us and we will remove your profile from the Network.",
    ],
  },
  {
    title: "19. Contact",
    paragraphs: [
      "For any questions about these Terms, to exercise your data rights or to request removal from the Network, please contact us at talent@restorefine.com or in writing to RestoRefine Ltd, 24 Fairley Street, Glasgow, G51 2SN.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-brand"
        >
          ← Back to home
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          RestoRefine Studios: Creator Network Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              <div className="mt-2 space-y-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
