-- 既存のポリシーを削除
drop policy if exists "プロフィールは本人のみが編集可能" on public.profiles;
drop policy if exists "プロフィールは誰でも閲覧可能" on public.profiles;

-- 新しいポリシーの作成
create policy "プロフィールの作成と編集権限"
    on public.profiles for all
    using (true)
    with check (true);

-- 未認証ユーザーにもアクセスを許可
alter table public.profiles enable row level security;
grant all on public.profiles to anon;
grant all on public.profiles to authenticated;