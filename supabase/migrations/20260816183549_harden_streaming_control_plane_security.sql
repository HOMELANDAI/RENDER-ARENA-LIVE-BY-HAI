-- Hardening migration applied after streaming control-plane creation.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter view public.active_streaming_destinations set (security_invoker = true);
