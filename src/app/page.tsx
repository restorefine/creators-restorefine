import localFont from "next/font/local";
import { ApplyChecklistDialog } from "@/components/apply-checklist-dialog";

const holiday = localFont({
  src: "../../public/fonts/Holiday.otf",
  variable: "--font-holiday",
});

const features = [
  {
    title: "Real paid work",
    description: "Hourly rates, flat fees, long-term deals and brand partnerships",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  {
    title: "Brand access",
    description: "From local independents to national enterprise clients",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />,
  },
  {
    title: "Any size welcome",
    description: "Nano, micro, and macro creators all find opportunities here",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    ),
  },
  {
    title: "Your terms",
    description: "You choose which opportunities to accept. No obligations",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
];

const trustItems = [
  {
    text: "Takes around 8 minutes to complete",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
  {
    text: "Your data is never sold. Shared only with vetted brand clients",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />,
  },
  {
    text: "Open to creators across the UK",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </>
    ),
  },
];

const faqs = [
  {
    question: "Will I definitely get paid work through RestoRefine Studios?",
    answer:
      "No and we want to be upfront about that. Joining the Network means your profile is live and visible to brand clients, but opportunities are matched against specific briefs. Some months there may be several that suit you. Other months there may be none. It depends entirely on what clients are looking for at that time. What we can promise is that when something is a genuine fit, we will reach out.",
  },
  {
    question: "What kind of work is on offer?",
    answer:
      "It varies a lot and that is intentional. Some opportunities are local and informal, like a brand wanting people in Glasgow to come in and try a new product or dish. Others are more formal paid content deals or long-term presenter roles with national brands. Pay ranges from an agreed hourly rate for an event through to a full commercial deal for ongoing work. Every opportunity is different and all terms are agreed upfront before you commit to anything.",
  },
  {
    question: "Why do you need so much information on the application?",
    answer:
      "Brand clients are specific. They brief us on the kind of creator they are looking for, including location, content style, audience age and interests, follower size and past brand experience. The more complete your profile is, the better chance we have of matching you to the right brief. Clients want to see your photos, understand your audience and know what you have worked on before. Without that information we simply cannot put you forward.",
  },
  {
    question: "Who sees my profile and photos?",
    answer:
      "Only vetted brand clients who are actively looking for creators. Your profile is not public and is not searchable online. It is shared internally with clients when your profile matches a brief they have sent us. Your photos will never be used in any public marketing or advertising by RestoRefine Studios without your explicit written permission.",
  },
  {
    question: "Do I need a large following to get opportunities?",
    answer:
      "No. Follower count is one factor but it is rarely the deciding one. A lot of the brands we work with are specifically looking for local, authentic voices with engaged audiences rather than large but passive ones. We work with creators at every level. What matters most is who your audience is and whether it matches what a client needs.",
  },
  {
    question: "How does pay work and when do I get paid?",
    answer:
      "Every opportunity has its own payment terms which are agreed and confirmed in writing before you accept anything. Pay could be an hourly rate, a flat fee for a deliverable, a day rate or a longer commercial arrangement. RestoRefine Studios does not hold your money. Payment terms are set between you and the client or through a separate agreement with us depending on the structure of the deal. You will always know what you are getting paid and when before you commit.",
  },
  {
    question: "Can I turn down opportunities?",
    answer: "Yes, always. You are never under any obligation to accept an opportunity we send you. There are no penalties for declining and it will not affect your standing in the Network.",
  },
  {
    question: "Can I update my profile or leave the Network?",
    answer:
      "Yes to both. If your follower counts change, you move to a new city or your availability changes, just email us and we will update your profile. If you want to leave the Network entirely and have your data deleted, contact us at talent@restorefine.com and we will remove everything within 30 days in line with UK GDPR.",
  },
  {
    question: "I have a question that is not covered here.",
    answer: "Get in touch at talent@restorefine.com and we will come back to you. We are a small team and we do actually read and reply to every email.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="px-4 pt-20 pb-8 sm:pt-28 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fonts/restorefine-logoblack.svg" alt="RestoRefine" className="mx-auto h-8 w-auto" />

          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Now accepting applications
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            <span className={`${holiday.className} text-brand`}>Get paid</span> to create.
            <br />
            Work with brands you love.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            RestoRefine Studios is building a creator network that connects talent with restaurants, local businesses and brands. Opportunities range from food experiences and product tastings through to content partnerships and presenter roles. Whatever your size, if you create, there is a place
            for you here.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-brand sm:h-7 sm:w-7">
                  {feature.icon}
                </svg>
                <h3 className="mt-4 text-sm font-semibold text-slate-900 sm:text-base">{feature.title}</h3>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <ApplyChecklistDialog />
            <p className="text-xs text-slate-500">Takes around 8 minutes to complete</p>
          </div>

          <div className="mt-12 space-y-4 border-t border-slate-200 pt-10">
            {trustItems.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 flex-shrink-0 text-slate-400">
                  {item.icon}
                </svg>
                <p className="text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 px-4 pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Who <span className={`${holiday.className} text-brand`}>we</span> are
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              <a href="https://restorefine.co.uk" target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                RestoRefine Studios
              </a>{" "}
              is a trading name of RestoRefine Ltd, a Glasgow-based business growth partner. We work with clients across a range of services to help them grow, reach new audiences and build their brand.
            </p>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              About the <span className={`${holiday.className} text-brand`}>RestoCreator</span> Network
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              The RestoCreator Network is how we connect brands with creators. Our clients need the right people to bring their campaigns to life and we built this network to make that happen properly. Every creator is reviewed by our team, matched to briefs that fit them, and paid fairly for their
              work. No algorithms, no chasing brands yourself. Just real opportunities with brands that suit you.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-10 pb-16 sm:pt-12 sm:pb-20">
        <div className="mx-auto max-w-3xl border-t border-slate-200 pt-10 sm:pt-12">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Frequently <span className={`${holiday.className} text-brand`}>asked</span> questions
          </h2>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-brand/40">
                <input type="checkbox" id={`faq-${index}`} className="peer sr-only" />
                <label htmlFor={`faq-${index}`} className="flex cursor-pointer items-center justify-between gap-4 p-6 text-base font-semibold text-slate-900">
                  {faq.question}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 flex-shrink-0 text-brand transition-transform duration-300 group-hover:rotate-180 group-has-checked:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </label>
                <div className="max-h-0 overflow-hidden px-6 transition-[max-height,padding] duration-300 ease-in-out group-hover:max-h-96 group-hover:pb-6 group-has-checked:max-h-96 group-has-checked:pb-6">
                  <p className="text-sm text-slate-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
