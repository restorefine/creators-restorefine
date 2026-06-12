import Link from "next/link";
import localFont from "next/font/local";

const holiday = localFont({
  src: "../../public/fonts/Holiday.otf",
  variable: "--font-holiday",
});

const features = [
  {
    title: "Real paid work",
    description: "Hourly rates, flat fees, long-term deals and brand partnerships",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  {
    title: "Brand access",
    description: "From local independents to national enterprise clients",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21"
      />
    ),
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
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Now accepting applications
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            <span className={`${holiday.className} text-brand`}>Get paid</span> to create.
            <br />
            Work with brands you love.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            RestoRefine Studios connects talented creators with leading brands
            — from local food and lifestyle experiences to national presenter
            deals. Whether you have 500 followers or 500,000, we find
            opportunities that fit you.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              Apply to join the network
            </Link>
            <p className="text-xs text-slate-500">Takes around 8 minutes to complete</p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5 text-white"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-12 text-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Who <span className={`${holiday.className} text-brand`}>we</span> are
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              RestoRefine Studios is a trading name of RestoRefine Ltd, a
              Glasgow-based business growth partner. We work with clients
              across a range of services to help them grow, reach new
              audiences and build their brand.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              About the <span className={`${holiday.className} text-brand`}>RestoCreator</span> Network
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              The RestoCreator Network is how we connect brands with creators.
              Our clients need the right people to bring their campaigns to
              life and we built this network to make that happen properly.
              Every creator is reviewed by our team, matched to briefs that
              fit them, and paid fairly for their work. No algorithms, no
              chasing brands yourself. Just real opportunities with brands
              that suit you.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-slate-600">
            Your data is never sold. Shared only with vetted brand clients.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Open to creators across the UK
          </p>
        </div>
      </section>
    </main>
  );
}
