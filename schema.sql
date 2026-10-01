-- Antes de ejecutar, reemplaza admin@ejemplo.com por tu correo de administrador.
create table if not exists public.catalog_items (
 id text primary key, name text, category text, image_url text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.catalog_items enable row level security;
drop policy if exists "Public can read catalog" on public.catalog_items;
create policy "Public can read catalog" on public.catalog_items for select to anon, authenticated using (true);
drop policy if exists "Admin can insert catalog" on public.catalog_items;
create policy "Admin can insert catalog" on public.catalog_items for insert to authenticated with check ((auth.jwt()->>'email')='admin@ejemplo.com');
drop policy if exists "Admin can update catalog" on public.catalog_items;
create policy "Admin can update catalog" on public.catalog_items for update to authenticated using ((auth.jwt()->>'email')='admin@ejemplo.com') with check ((auth.jwt()->>'email')='admin@ejemplo.com');
drop policy if exists "Admin can delete catalog" on public.catalog_items;
create policy "Admin can delete catalog" on public.catalog_items for delete to authenticated using ((auth.jwt()->>'email')='admin@ejemplo.com');
-- Primero crea en Supabase Storage un bucket PUBLIC llamado catalog-images.
drop policy if exists "Public can view catalog images" on storage.objects;
create policy "Public can view catalog images" on storage.objects for select to anon, authenticated using (bucket_id='catalog-images');
drop policy if exists "Admin can upload catalog images" on storage.objects;
create policy "Admin can upload catalog images" on storage.objects for insert to authenticated with check (bucket_id='catalog-images' and (auth.jwt()->>'email')='admin@ejemplo.com');
drop policy if exists "Admin can update catalog images" on storage.objects;
create policy "Admin can update catalog images" on storage.objects for update to authenticated using (bucket_id='catalog-images' and (auth.jwt()->>'email')='admin@ejemplo.com') with check (bucket_id='catalog-images' and (auth.jwt()->>'email')='admin@ejemplo.com');
drop policy if exists "Admin can delete catalog images" on storage.objects;
create policy "Admin can delete catalog images" on storage.objects for delete to authenticated using (bucket_id='catalog-images' and (auth.jwt()->>'email')='admin@ejemplo.com');
