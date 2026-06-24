-- Active pg_cron (une seule fois, si pas deja fait)
create extension if not exists pg_cron;

-- Planifie l'email recap tous les soirs a 20h (UTC+1 Maroc = 19h UTC)
select cron.schedule(
  'daily-recap-email',
  '0 19 * * *',
  $$
  select net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/daily-recap',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
