import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

type Status = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Withdrawn";

type Application = {
  company: string;
  role: string;
  date: string;
  status: Status;
  url?: string;
  notes?: string;
};

const applications: Application[] = [
  {
    company: "DeepMetis",
    role: "Senior AI Engineer",
    date: "2026-05-17",
    status: "Applied",
    url: "https://join.com/companies/deepmetis/16163667/apply/success?sso=false",
    notes:
      "Question on recent AI paper/architectural shift. Answered with AnchorBase RAG/parsing experience — vision-guided chunking insight, LlamaParse agentic model, chunking quality as first-order retrieval problem. Referenced Tripathi et al. (2025). ETL, Microservices, Python stack.",
  },
];

const STATUS_COLORS: Record<Status, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Interviewing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Offer: "bg-green-500/10 text-green-400 border-green-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  Withdrawn: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function Applied() {
  const counts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16 max-w-3xl mx-auto">
      <div className="mb-12">
        <p className="text-xs text-white/20 uppercase tracking-widest mb-2">Private</p>
        <h1 className="text-2xl font-semibold text-white mb-1">Job Applications</h1>
        <p className="text-white/35 text-sm">{applications.length} application{applications.length !== 1 ? "s" : ""} logged</p>

        <div className="flex flex-wrap gap-3 mt-6">
          {Object.entries(counts).map(([status, count]) => (
            <span
              key={status}
              className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[status as Status]}`}
            >
              {count} {status}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {applications
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((app, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/8 p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{app.company}</p>
                  <p className="text-sm text-white/50">{app.role}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[app.status]}`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-white/25">{app.date}</span>
                </div>
              </div>

              {app.notes && (
                <p className="text-xs text-white/40 leading-relaxed border-t border-white/6 pt-3">
                  {app.notes}
                </p>
              )}

              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/25 hover:text-white/50 transition-colors"
                >
                  {app.url}
                </a>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}
