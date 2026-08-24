-- profiles.email was never populated on signup.
--
-- handle_new_user() inserted only id/first_name/last_name, so every account
-- created through the signup flow ended up with profiles.email = NULL. All the
-- Resend cron routes read profiles.email and pass it straight to Resend as the
-- `to` address, so those sends were rejected as invalid recipients. Only the
-- one row whose email had been filled in by hand ever received mail.

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email
  );
  return new;
end;
$function$
;

-- Keep profiles.email in sync when a user changes their address in auth, so the
-- same drift cannot reappear later.
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update public.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$function$
;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;

CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (old.email IS DISTINCT FROM new.email)
  EXECUTE FUNCTION public.handle_user_email_update();

-- Backfill the accounts that were created while the column went unwritten.
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE u.id = p.id
  AND p.email IS DISTINCT FROM u.email;
