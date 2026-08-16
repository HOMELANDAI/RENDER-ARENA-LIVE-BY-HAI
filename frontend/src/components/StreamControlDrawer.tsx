'use client';

export function StreamControlDrawer() {
  return (
    <aside className="rounded-2xl border border-[#D4AF37] bg-[#081827] p-5 text-[#F3E4C2]">
      <p className="text-xs uppercase tracking-[0.35em] text-[#8FC7C9]">Backend Settings</p>
      <h2 className="mt-1 text-2xl font-semibold text-[#D4AF37]">Stream Control Drawer</h2>
      <div className="mt-5 space-y-4 text-sm">
        <div>
          <label className="text-[#D4AF37]">Stream Mode</label>
          <select className="mt-1 w-full rounded border border-[#D4AF37]/50 bg-[#26070B] p-2">
            <option>streamlabs_to_twitch</option>
            <option>streamlabs_to_restream</option>
            <option>maestro_premium</option>
            <option>direct_youtube</option>
            <option>test_recording</option>
          </select>
        </div>
        <p className="rounded border border-[#8FC7C9]/40 bg-black/30 p-3 text-[#8FC7C9]">
          Supabase controls stream sessions and route status. Stream keys stay inside platform dashboards or secure Supabase secrets.
        </p>
      </div>
    </aside>
  );
}
