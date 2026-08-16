"use client";

import { useState } from "react";
import { createStreamSession, setStreamStatus, type StreamMode } from "../lib/renderArenaStreaming";

const ROUTES: Record<StreamMode, string[]> = {
  streamlabs_to_twitch: ["streamlabs_local_encoder", "twitch_primary_direct"],
  streamlabs_to_restream: ["streamlabs_local_encoder", "restream_distribution_hub", "twitch_primary_direct", "youtube_secondary_live"],
  direct_youtube: ["streamlabs_local_encoder", "youtube_secondary_live"],
  maestro_premium: ["streamlabs_local_encoder", "maestro_premium_live", "maestro_embed_page"],
  test_recording: ["streamlabs_local_encoder"],
};

export function StreamControlDrawer({ accessToken }: { accessToken: string }) {
  const [title, setTitle] = useState("Render Arena Live Test Stream");
  const [mode, setMode] = useState<StreamMode>("streamlabs_to_twitch");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  async function createSession() {
    const result = await createStreamSession(accessToken, {
      title,
      stream_mode: mode,
      route_destination_keys: ROUTES[mode],
      figma_route: "/live",
    });
    setSessionId(result.session.id);
    setMessage("Stream session created in Supabase.");
  }

  async function updateStatus(status: "scheduled" | "live" | "ended") {
    if (!sessionId) return setMessage("Create a stream session first.");
    await setStreamStatus(accessToken, sessionId, status);
    setMessage(`Session marked ${status}.`);
  }

  return (
    <aside className="rounded-2xl border border-[#D4AF37]/60 bg-[#071426] p-6 text-[#F3E4C2]">
      <p className="text-xs uppercase tracking-[0.35em] text-[#8FC7C9]">Render Arena Backend</p>
      <h2 className="mt-2 text-2xl font-bold text-[#D4AF37]">Stream Control Drawer</h2>
      <label className="mt-6 block text-sm">Stream title</label>
      <input className="mt-2 w-full rounded bg-[#26070B] p-3 text-[#F3E4C2]" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="mt-4 block text-sm">Stream mode</label>
      <select className="mt-2 w-full rounded bg-[#26070B] p-3 text-[#F3E4C2]" value={mode} onChange={(e) => setMode(e.target.value as StreamMode)}>
        <option value="streamlabs_to_twitch">Streamlabs to Twitch</option>
        <option value="streamlabs_to_restream">Streamlabs to Restream to Twitch + YouTube</option>
        <option value="direct_youtube">Direct YouTube test</option>
        <option value="maestro_premium">Maestro premium</option>
        <option value="test_recording">Test recording</option>
      </select>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={createSession} className="rounded bg-[#D4AF37] px-4 py-2 text-[#071426]">Create Session</button>
        <button onClick={() => updateStatus("scheduled")} className="rounded border border-[#D4AF37] px-4 py-2">Scheduled</button>
        <button onClick={() => updateStatus("live")} className="rounded border border-[#D4AF37] px-4 py-2">Live</button>
        <button onClick={() => updateStatus("ended")} className="rounded border border-[#D4AF37] px-4 py-2">Ended</button>
      </div>
      {message && <p className="mt-4 text-sm text-[#8FC7C9]">{message}</p>}
    </aside>
  );
}
