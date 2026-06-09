-- Supabase SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) <= 10),
  content text not null check (char_length(content) <= 100),
  password_hash text not null,
  created_at timestamptz not null default now(),
  valid boolean not null default true
);

create index if not exists guestbook_created_at_idx
  on guestbook (created_at desc);

create index if not exists guestbook_valid_idx
  on guestbook (valid);

create table if not exists attendance (
  id bigint generated always as identity primary key,
  side text not null check (side in ('groom', 'bride')),
  name text not null check (char_length(name) <= 10),
  meal text not null check (meal in ('yes', 'no')),
  count integer not null check (count >= 0),
  created_at timestamptz not null default now()
);

alter table guestbook enable row level security;
alter table attendance enable row level security;

create policy "guestbook_read_valid"
  on guestbook for select
  using (valid = true);

create policy "attendance_insert_anon"
  on attendance for insert
  with check (true);

create or replace function create_guestbook_post(
  p_name text,
  p_content text,
  p_password text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into guestbook (name, content, password_hash)
  values (p_name, p_content, crypt(p_password, gen_salt('bf', 10)));
end;
$$;

create or replace function delete_guestbook_post(
  post_id bigint,
  password text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  stored_hash text;
begin
  select password_hash into stored_hash
  from guestbook
  where id = post_id and valid = true;

  if stored_hash is null then
    raise exception 'NOT_FOUND';
  end if;

  if stored_hash != crypt(password, stored_hash) then
    raise exception 'INCORRECT_PASSWORD';
  end if;

  update guestbook set valid = false where id = post_id;
end;
$$;

grant execute on function create_guestbook_post(text, text, text) to anon;
grant execute on function delete_guestbook_post(bigint, text) to anon;
