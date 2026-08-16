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
  if (!supabaseUrl || !supabaseAnonKey) return json({ error: "Missing Supabase environment configuration." }, 500);

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const sessionId = url.searchParams.get("session_id");

      if (!sessionId) {
        const { data, error } = await supabase.from("active_streaming_destinations").select("*").order("priority", { ascending: true });
        if (error) return json({ error: error.message }, 400);
        return json({ destinations: data, note: "No stream keys are returned by this endpoint." });
      }

      const { data: session, error } = await supabase
        .from("stream_sessions")
        .select("*, stream_session_routes(*, stream_destinations(*, streaming_platforms(*)))")
        .eq("id", sessionId)
        .single();
      if (error) return json({ error: error.message }, 404);
      return json({ session, note: "Routing metadata only; stream keys are never returned." });
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

      const routeKeys = Array.isArray(body.route_destination_keys) ? body.route_destination_keys : ["streamlabs_local_encoder", "twitch_primary_direct"];
      const { data: destinations, error: lookupError } = await supabase.from("stream_destinations").select("id, destination_key, route_purpose").in("destination_key", routeKeys);
      if (lookupError) return json({ error: lookupError.message }, 400);

      const routeRows = (destinations ?? []).map((route, index) => ({
        stream_session_id: session.id,
        destination_id: route.id,
        route_order: index + 1,
        route_role: index === 0 ? "control" : route.route_purpose === "premium" ? "premium_embed" : route.route_purpose,
        route_status: "planned",
        is_required: true,
      }));
      if (routeRows.length) {
        const { error } = await supabase.from("stream_session_routes").insert(routeRows);
        if (error) return json({ error: error.message }, 400);
      }

      await supabase.from("stream_events").insert({ stream_session_id: session.id, event_type: "session_created", event_source: "stream-session-control", payload: { route_destination_keys: routeKeys } });
      return json({ session, route_destination_keys: routeKeys });
    }

    if (body.action === "set_status") {
      if (!body.session_id || !body.status) return json({ error: "session_id and status are required." }, 400);
      const patch: Record<string, unknown> = { status: body.status };
      if (body.status === "live") patch.started_at = new Date().toISOString();
      if (body.status === "ended") patch.ended_at = new Date().toISOString();
      const { data, error } = await supabase.from("stream_sessions").update(patch).eq("id", body.session_id).select("*").single();
      if (error) return json({ error: error.message }, 400);
      await supabase.from("stream_events").insert({ stream_session_id: body.session_id, event_type: `session_${body.status}`, event_source: "stream-session-control", payload: { status: body.status } });
      return json({ session: data });
    }

    if (body.action === "log_event") {
      const { data, error } = await supabase.from("stream_events").insert({ stream_session_id: body.session_id ?? null, event_type: body.event_type ?? "custom_event", event_source: body.event_source ?? "figma_or_frontend_patch", payload: body.payload ?? {} }).select("*").single();
      if (error) return json({ error: error.message }, 400);
      return json({ event: data });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
