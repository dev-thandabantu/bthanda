const items = [
  {
    title: "AIM Founding to Give 2026 Cohort",
    body: "Selected after multiple rigorous rounds. A program for founders who combine grit, builder instinct, and ambition to create impact.",
    year: "2026",
  },
  {
    title: "Mastercard Foundation Scholars — Alumni Panellist",
    body: "Invited to speak as an alumnus of the Mastercard Foundation Scholars Program at UCT.",
    year: "2025",
  },
  {
    title: "Unity Challenge — 2nd Place",
    body: "Runner-up in the Unity Challenge by AL for Professionals.",
    year: "2025",
  },
  {
    title: "Kutsaga Innovation Challenge — Finalist",
    body: "Finalist with AgriData AI at the Kutsaga (Tobacco Research Board) Innovation Challenge.",
    year: "2025",
  },
  {
    title: "Mastercard FAST Build Recipient",
    body: "Selected for the FAST Build programme for early-stage founders in Africa.",
    year: "2024",
  },
  {
    title: "4th SA-GEO National Symposium — Keynote Speaker",
    body: "Delivered a keynote at the Council for Scientific and Industrial Research (CSIR).",
    year: "2022",
  },
  {
    title: "Mastercard Foundation Scholar",
    body: "Full scholarship to the University of Cape Town (UCT).",
    year: "2017",
  },
  {
    title: "USAP Recipient",
    body: "Recipient of the United States Achievers Program scholarship.",
    year: "2015",
  },
];

export default function Recognition() {
  return (
    <section id="recognition" className="py-20 border-t border-white/8">
      <h2 className="text-xs text-white/30 uppercase tracking-widest mb-10">Recognition</h2>
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.title} className="flex gap-6">
            <span className="text-sm text-white/20 w-10 shrink-0 pt-0.5">{item.year}</span>
            <div>
              <p className="text-sm font-medium text-white/80 mb-0.5">{item.title}</p>
              <p className="text-sm text-white/40">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
