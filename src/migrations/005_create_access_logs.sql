-- アクセスログテーブルの作成
create table if not exists public.access_logs (
  id uuid default uuid_generate_v4() primary key,
  path text not null,
  ip text,
  user_agent text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- インデックスの作成
create index if not exists access_logs_path_idx on access_logs(path);
create index if not exists access_logs_created_at_idx on access_logs(created_at);
create index if not exists access_logs_user_id_idx on access_logs(user_id);

-- RLSの設定
alter table public.access_logs enable row level security;

-- 誰でも書き込み可能なポリシー
create policy "アクセスログは誰でも書き込み可能"
  on public.access_logs for insert
  to anon, authenticated
  with check (true);

-- 認証済みユーザーのみ閲覧可能なポリシー
create policy "アクセスログは認証済みユーザーのみ閲覧可能"
  on public.access_logs for select
  to authenticated
  using (true);

-- アクセス権限の付与
grant insert on public.access_logs to anon;
grant insert on public.access_logs to authenticated;
grant select on public.access_logs to authenticated;