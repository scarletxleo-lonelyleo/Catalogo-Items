CATÁLOGO DE IDs — VERSIÓN ONLINE (GitHub Pages + Supabase)

Esta versión guarda los IDs e imágenes online para que se vean desde PC y celular.

1) Crea un proyecto en https://supabase.com/
2) Decide qué correo será el administrador.
3) Abre schema.sql y reemplaza TODAS las apariciones de admin@ejemplo.com por tu correo exacto.
4) En Supabase > SQL Editor > New query, pega el schema.sql ya editado y pulsa Run.
5) En Supabase > Storage crea un bucket llamado EXACTAMENTE catalog-images y márcalo como PUBLIC.
6) En Supabase > Authentication > Users crea el usuario administrador con ese correo y una contraseña fuerte. Desactiva el registro público si está habilitado.
7) En Project Settings / API Keys copia Project URL y la publishable key (o anon public key).
8) Abre config.js y reemplaza PEGA_AQUI_TU_PROJECT_URL y PEGA_AQUI_TU_PUBLISHABLE_O_ANON_KEY por esos valores.
9) Sube index.html, style.css, script.js y config.js a la raíz de tu repositorio GitHub, sobrescribiendo los archivos anteriores. Espera a que Pages vuelva a publicar.
10) Abre tu sitio, pulsa Administrar e inicia sesión. Selecciona imagen, escribe ID y pulsa Publicar elemento.
11) Abre el sitio desde tu celular para comprobar que los elementos se ven.

SEGURIDAD:
- Nunca pongas la service_role key en config.js.
- La publishable/anon key está hecha para el frontend; la protección real la aplican las políticas RLS de schema.sql.
- No compartas la contraseña del administrador.

TUS 4 ELEMENTOS ANTIGUOS:
No se transfieren automáticamente porque estaban guardados en el navegador de tu PC. Conserva las imágenes/IDs y vuelve a publicarlos desde el nuevo panel. Si aún aparecen en la versión anterior de tu PC, déjala abierta mientras los copias.
