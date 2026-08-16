export type StreamMode =
  | "streamlabs_to_twitch"
  | "streamlabs_to_restream"
  | "direct_youtube"
  | "maestro_premium"
  | "test_recording";

export type StreamDestination = {
  destination_key: string;
  destination_name: string;
  platform_id: string;
  platform_name: string;
  route_purpose: string;
  connection_method: string;
  requires_manual_key: boolean;
  public_url?: string | null;
  docs_url?: string | null;
  notes?: string | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vbzkwuvdnnlznvhtqttl.supabase.co";
const STREAM_CONTROL_URL = `${SUPABASE_URL}/functions/v1/stream-session-control`;

export async function fetchStreamingDestinations(accessToken: string) {
  const response = await fetch(STREAM_CONTROL_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch destinations: ${response.status}`);
  return response.json() as Promise<{ destinations: StreamDestination[]; note: string }>;
}

export async function createStreamSession(accessToken: string, payload: {
  title: string;
  stream_mode?: StreamMode;
  route_destination_keys?: string[];
  primary_destination_key?: string;
  figma_route?: string;
  notes?: string;
}) {
  const response = await fetch(STREAM_CONTROL_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create_session", ...payload }),
  });
  if (!response.ok) throw new Error(`Failed to create stream session: ${response.status}`);
  return response.json();
}

export async function setStreamStatus(accessToken: string, session_id: string, status: "draft" | "scheduled" | "live" | "ended" | "cancelled") {
  const response = await fetch(STREAM_CONTROL_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_status", session_id, status }),
  });
  if (!response.ok) throw new Error(`Failed to update stream status: ${response.status}`);
  return response.json();
}
