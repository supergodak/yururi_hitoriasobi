-- プロフィールテーブルの更新
alter table if exists public.profiles
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- イベントテーブルの更新
alter table if exists public.events
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- 参加者テーブルの更新
alter table if exists public.participants
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- トリガー関数の作成（存在しない場合のみ）
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 既存のトリガーを削除（エラーを防ぐため）
drop trigger if exists set_updated_at on public.profiles;
drop trigger if exists set_updated_at on public.events;
drop trigger if exists set_updated_at on public.participants;

-- updated_atを自動更新するトリガーの設定
create trigger set_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

create trigger set_updated_at
    before update on public.events
    for each row
    execute function public.handle_updated_at();

create trigger set_updated_at
    before update on public.participants
    for each row
    execute function public.handle_updated_at();

-- インデックスの作成
create index if not exists events_creator_id_idx on public.events(creator_id);
create index if not exists date_options_event_id_idx on public.date_options(event_id);
create index if not exists participants_event_id_idx on public.participants(event_id);
create index if not exists participants_date_option_id_idx on public.participants(date_option_id);
create index if not exists participants_user_id_idx on public.participants(user_id);
create index if not exists participants_email_idx on public.participants(email);