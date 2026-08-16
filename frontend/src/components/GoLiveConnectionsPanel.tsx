"use client";

import { useEffect, useState } from "react";
import { fetchStreamingDestinations, type StreamDestination } from "../lib/renderArenaStreaming";

export function GoLiveConnectionsPanel({ accessToken }: { accessToken: string }) {
  const [destinations, setDestinations] = useState<StreamDestination[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetchStreamingDestinations(accessToken)
      .then((result) => setDestinations(result.destinations ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load stream destinations"));
  }, [accessToken]);

  return (
    <section className="rounded-2xl border border-[#D4AF37]/60 bg-[#071426]/90 p-6 text-[#F3E4C2] shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#8FC7C9]">Supabase Control Plane</p>
          <h2 className="text-2xl font-bold text-[#D4AF37]">Go Live Connections</h2>
        </div>
        <span className="rounded-full border border-[#D4AF37] px-3 py-1 text-xs">Twitch Primary</span>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {destinations.map((destination) => (
          <article key={destination.destination_key} className="rounded-xl border border-[#D4AF37]/30 bg-[#26070B]/70 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8FC7C9]">{destination.route_purpose}</p>
            <h3 className="mt-2 text-lg font-semibold text-[#D4AF37]">{destination.destination_name}</h3>
            <p className="mt-2 text-sm text-[#F3E4C2]/80">{destination.connection_method}</p>
            <p className="mt-2 text-xs text-[#F3E4C2]/60">{destination.requires_manual_key ? "Manual stream key required" : "No stream key required"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
