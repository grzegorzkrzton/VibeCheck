begin;

alter table public.content_suggestions
  add column if not exists resolved boolean not null default false,
  add column if not exists read_at timestamptz;

alter table public.comments
  add column if not exists parent_suggestion_id uuid,
  add column if not exists read_at timestamptz;

update public.content_suggestions
set
  status = case
    when status = 'approved' then 'applied'
    when status = 'rejected' then 'pending'
    else status
  end,
  resolved = case
    when status in ('approved', 'rejected') then true
    else resolved
  end
where status in ('approved', 'rejected');

alter table public.content_suggestions
  drop constraint if exists content_suggestions_status_check;

alter table public.content_suggestions
  add constraint content_suggestions_status_check
  check (status in ('pending', 'applied'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'comments_parent_suggestion_id_fkey'
      and conrelid = 'public.comments'::regclass
  ) then
    alter table public.comments
      add constraint comments_parent_suggestion_id_fkey
      foreign key (parent_suggestion_id)
      references public.content_suggestions(id)
      on delete cascade;
  end if;
end
$$;

commit;
