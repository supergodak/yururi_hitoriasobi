-- 既存のポリシーを削除
drop policy if exists "プロフィールは本人のみが編集可能" on public.profiles;
drop policy if exists "プロフィールは誰でも閲覧可能" on public.profiles;
drop policy if exists "イベントは作成者のみが編集可能" on public.events;
drop policy if exists "イベントは誰でも閲覧可能" on public.events;
drop policy if exists "候補日時はイベント作成者のみが編集可能" on public.date_options;
drop policy if exists "候補日時は誰でも閲覧可能" on public.date_options;
drop policy if exists "参加者情報は本人または主催者のみが編集可能" on public.participants;
drop policy if exists "参加者情報は誰でも閲覧可能" on public.participants;

-- 新しいポリシーの作成
create policy "プロフィールは本人のみが編集可能"
    on public.profiles for all
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "プロフィールは誰でも閲覧可能"
    on public.profiles for select
    to authenticated
    using (true);

create policy "イベントは作成者のみが編集可能"
    on public.events for all
    using (auth.uid() = creator_id)
    with check (auth.uid() = creator_id);

create policy "イベントは誰でも閲覧可能"
    on public.events for select
    using (true);

create policy "候補日時はイベント作成者のみが編集可能"
    on public.date_options for all
    using (
        exists (
            select 1 from public.events
            where events.id = date_options.event_id
            and events.creator_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.events
            where events.id = date_options.event_id
            and events.creator_id = auth.uid()
        )
    );

create policy "候補日時は誰でも閲覧可能"
    on public.date_options for select
    using (true);

create policy "参加者情報は本人または主催者のみが編集可能"
    on public.participants for all
    using (
        auth.uid() in (
            select creator_id from public.events where id = event_id
        ) or
        (user_id = auth.uid()) or
        (user_id is null and auth.email() = email)
    )
    with check (
        auth.uid() in (
            select creator_id from public.events where id = event_id
        ) or
        (user_id = auth.uid()) or
        (user_id is null and auth.email() = email)
    );

create policy "参加者情報は誰でも閲覧可能"
    on public.participants for select
    using (true);