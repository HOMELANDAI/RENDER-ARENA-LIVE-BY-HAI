export type StreamMode = 'streamlabs_to_twitch' | 'streamlabs_to_restream' | 'direct_youtube' | 'maestro_premium' | 'test_recording';

export type StreamDestination = {
  destination_key: string;
  destination_name: string;
  route_purpose: string;
  connection_method: string;
  platform_id: string;
  platform_name: string;
  requires_manual_key: boolean;
};

const functionUrl = process.env.NEXT_PUBLIC_STREAM_CONTROL_FUNCTION;

export async function getStreamingDestinations(accessToken: string): Promise<StreamDestination[]> {
  if (!functionUrl) throw new Error('NEXT_PUBLIC_STREAM_CONTROL_FUNCTION is not configured.');
  const res = await fetch(functionUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Unable to load streaming destinations.');
  return json.destinations ?? [];
}

export async function createRenderArenaStreamSession(accessToken: string, payload: {
  title: string;
  stream_mode?: StreamMode;
  figma_route?: string;
  primary_destination_key?: string;
}) {
  if (!functionUrl) throw new Error('NEXT_PUBLIC_STREAM_CONTROL_FUNCTION is not configured.');
  const res = await fetch(functionUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create_session', ...payload }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Unable to create stream session.');
  return json.session;
}

export async function setRenderArenaStreamStatus(accessToken: string, session_id: string, status: 'scheduled' | 'live' | 'ended' | 'cancelled') {
  if (!functionUrl) throw new Error('NEXT_PUBLIC_STREAM_CONTROL_FUNCTION is not configured.');
  const res = await fetch(functionUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'set_status', session_id, status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Unable to update stream status.');
  return json.session;
}
