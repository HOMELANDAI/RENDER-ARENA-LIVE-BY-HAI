-- Performance and RLS cleanup migration for Render Arena streaming control plane.

create index if not exists idx_stream_destinations_platform_id on public.stream_destinations(platform_id);
create index if not exists idx_stream_events_created_by on public.stream_events(created_by);
create index if not exists idx_stream_session_routes_destination_id on public.stream_session_routes(destination_id);
create index if not exists idx_stream_sessions_created_by on public.stream_sessions(created_by);
create index if not exists idx_stream_sessions_primary_destination_id on public.stream_sessions(primary_destination_id);

-- Split broad authenticated ALL policies into action-specific policies.
drop policy if exists "authenticated_manage_stream_sessions" on public.stream_sessions;
drop policy if exists "authenticated_manage_stream_session_routes" on public.stream_session_routes;

drop policy if exists "public_read_non_draft_stream_sessions" on public.stream_sessions;
create policy "public_read_non_draft_stream_sessions" on public.stream_sessions
for select using (status <> 'draft' or (select auth.role()) = 'authenticated');

create policy "authenticated_insert_stream_sessions" on public.stream_sessions for insert to authenticated with check (true);
create policy "authenticated_update_stream_sessions" on public.stream_sessions for update to authenticated using (true) with check (true);
create policy "authenticated_delete_stream_sessions" on public.stream_sessions for delete to authenticated using (true);

create policy "authenticated_insert_stream_session_routes" on public.stream_session_routes for insert to authenticated with check (true);
create policy "authenticated_update_stream_session_routes" on public.stream_session_routes for update to authenticated using (true) with check (true);
create policy "authenticated_delete_stream_session_routes" on public.stream_session_routes for delete to authenticated using (true);
