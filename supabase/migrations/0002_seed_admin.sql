-- Grant an existing auth user dashboard access.
--
-- 1. In Supabase dashboard: Authentication -> Users -> "Add user"
--    Create the admin with an email + password (this is your dashboard login).
-- 2. Run the statement below, replacing the email, to mark that user as admin.

insert into public.admins (user_id, email)
select id, email from auth.users
where email = 'daryjoe765@gmail.com'   -- <-- change this
on conflict (user_id) do nothing;
