-- 既存のポリシーを削除
drop policy if exists "参加者情報は本人または主催者のみが編集可能" on public.participants;
drop policy if exists "参加者情報は誰でも閲覧可能" on public.participants;

-- 新しいポリシーの作成
create policy "参加者情報の編集権限"
    on public.participants for all
    using (true)
    with check (true);

-- 未認証ユーザーにもアクセスを許可
alter table public.participants enable row level security;
grant all on public.participants to anon;
grant all on public.participants to authenticated;