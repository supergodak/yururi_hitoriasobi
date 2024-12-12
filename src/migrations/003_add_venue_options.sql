-- 会場候補テーブルの作成
create table if not exists public.venue_options (
    id uuid default uuid_generate_v4() primary key,
    event_id uuid references public.events(id) on delete cascade not null,
    name text not null,
    url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- インデックスの作成
create index if not exists venue_options_event_id_idx on public.venue_options(event_id);

-- トリガーの設定
create trigger set_updated_at
    before update on public.venue_options
    for each row
    execute function public.handle_updated_at();

-- RLSの設定
alter table public.venue_options enable row level security;

create policy "会場候補はイベント作成者のみが編集可能"
    on public.venue_options for all
    using (
        exists (
            select 1 from public.events
            where events.id = venue_options.event_id
            and events.creator_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.events
            where events.id = venue_options.event_id
            and events.creator_id = auth.uid()
        )
    );

create policy "会場候補は誰でも閲覧可能"
    on public.venue_options for select
    using (true);

-- eventsテーブルから会場関連のカラムを削除
alter table public.events
    drop column if exists venue_name,
    drop column if exists venue_url;