-- ============================================================
-- ระบบนับเงินในวงเล่น — Supabase schema
-- วางทั้งไฟล์นี้ใน Supabase → SQL Editor → Run (ทำครั้งเดียว)
-- ============================================================

-- ตารางเดียว เก็บ event ทั้งหมดของทุกห้อง (event-sourced)
create table if not exists public.pk_events (
  id          bigint generated always as identity primary key,
  room_code   text        not null,
  event       jsonb       not null,
  created_at  timestamptz not null default now()
);

-- ดึง event ของห้องเดียวเรียงตามเวลาให้เร็ว
create index if not exists pk_events_room_idx on public.pk_events (room_code, id);

-- กันส่ง event ซ้ำ (แอปใส่ id มาเองในทุก event)
create unique index if not exists pk_events_evid_idx
  on public.pk_events ((event->>'id'));

-- ============================================================
-- สิทธิ์การเข้าถึง
-- เกมเล่นกับเพื่อน ไม่มีระบบล็อกอิน → เปิดให้ anon key อ่าน/เขียนได้
-- แต่ "ห้ามแก้/ห้ามลบ" เพื่อรักษาหลัก append-only ของ ledger
-- ============================================================
alter table public.pk_events enable row level security;

drop policy if exists "pk read"   on public.pk_events;
drop policy if exists "pk insert" on public.pk_events;

create policy "pk read"   on public.pk_events for select using (true);
create policy "pk insert" on public.pk_events for insert with check (true);
-- ไม่มี policy สำหรับ update/delete = ทำไม่ได้เลย (ตรงกับกฎ append-only)

-- ============================================================
-- เปิด Realtime ให้ตารางนี้ (แอปใช้ subscribe แทนการ poll)
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='pk_events'
  ) then
    alter publication supabase_realtime add table public.pk_events;
  end if;
end $$;

-- ============================================================
-- (ทางเลือก) ลบห้องที่ไม่มีการเคลื่อนไหวเกิน 30 วัน
-- เปิดใช้โดยตั้ง cron ใน Supabase → Database → Cron Jobs
-- ============================================================
-- delete from public.pk_events where created_at < now() - interval '30 days';
