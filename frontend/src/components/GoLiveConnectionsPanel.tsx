'use client';

const routes = [
  { title: 'Primary', path: 'Streamlabs -> Twitch', key: 'twitch_primary_direct' },
  { title: 'Multistream', path: 'Streamlabs -> Restream -> Twitch + YouTube', key: 'restream_distribution_hub' },
  { title: 'Premium', path: 'Streamlabs / Encoder -> Maestro', key: 'maestro_premium_live' },
];

export function GoLiveConnectionsPanel() {
  return (
    <section className="rounded-2xl border border-[#D4AF37] bg-[#081827]/80 p-5 text-[#F3E4C2] shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#8FC7C9]">Render Arena Control Plane</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#D4AF37]">Go Live Connections</h2>
        </div>
        <span className="rounded-full border border-[#8FC7C9] px-3 py-1 text-xs text-[#8FC7C9]">Supabase Ready</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {routes.map((route) => (
          <article key={route.key} className="rounded-xl border border-[#D4AF37]/50 bg-[#26070B]/70 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">{route.title}</p>
            <p className="mt-2 text-sm text-[#F3E4C2]">{route.path}</p>
            <p className="mt-3 rounded bg-black/30 px-2 py-1 font-mono text-xs text-[#8FC7C9]">{route.key}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
