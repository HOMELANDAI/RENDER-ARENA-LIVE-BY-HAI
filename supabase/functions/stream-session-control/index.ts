import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return json({ error: "Missing Supabase environment configuration." }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });

  if (req.method === "GET") {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      const { data, error } = await supabase.from("active_streaming_destinations").select("*").order("priority", { ascending: true });
      if (error) return json({ error: error.message }, 400);
      return json({ destinations: data, note: "No stream keys are returned by this endpoint." });
    }

    const { data, error } = await supabase
      .from("stream_sessions")
      .select("*, stream_session_routes(*, stream_destinations(*, streaming_platforms(*)))")
      .eq("id", sessionId)
      .single();

    if (error) return json({ error: error.message }, 404);
    return json({ session: data, note: "Routing metadata only; never stream keys." });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await req.json().catch(() => ({}));

  if (body.action === "create_session") {
    const { data: destination, error: destinationError } = await supabase
      .from("stream_destinations")
      .select("id")
      .eq("destination_key", body.primary_destination_key ?? "twitch_primary_direct")
      .single();
    if (destinationError) return json({ error: destinationError.message }, 400);

    const { data: session, error: sessionError } = await supabase
      .from("stream_sessions")
      .insert({
        title: body.title ?? "Render Arena Live Test Stream",
        stream_mode: body.stream_mode ?? "streamlabs_to_twitch",
        figma_route: body.figma_route ?? "/live",
        notes: body.notes ?? null,
        status: body.status ?? "draft",
        primary_destination_id: destination.id,
      })
      .select("*")
      .single();
    if (sessionError) return json({ error: sessionError.message }, 400);

    await supabase.from("stream_events").insert({
      stream_session_id: session.id,
      event_type: "session_created",
      event_source: "stream-session-control",
      payload: { stream_mode: session.stream_mode },
    });

    return json({ session });
  }

  if (body.action === "set_status") {
    const patch: Record<string, unknown> = { status: body.status };
    if (body.status === "live") patch.started_at = new Date().toISOString();
    if (body.status === "ended") patch.ended_at = new Date().toISOString();

    const { data, error } = await supabase.from("stream_sessions").update(patch).eq("id", body.session_id).select("*").single();
    if (error) return json({ error: error.message }, 400);
    return json({ session: data });
  }

  return json({ error: "Unknown action." }, 400);
});
