# Catálogo de IDs

## Qué incluye
- Catálogo público de imágenes + IDs.
- Buscador.
- Filtro por categorías.
- Botón para copiar IDs.
- Panel de administración.
- Agregar, editar y eliminar elementos.
- Diseño responsive para celular y PC.

## Importante
Esta versión usa `localStorage`, por lo que los datos se guardan SOLO en el navegador/dispositivo donde se agregan.

La contraseña del panel está en `script.js`:
    const ADMIN_PASSWORD = "CAMBIA-ESTA-CONTRASENA";

Cambiarla sirve para una demo/local, pero NO es seguridad real si publicas estos archivos:
cualquiera que tenga acceso al JavaScript puede inspeccionarlo.

Para una página pública real donde solamente tú puedas subir contenido:
1. Usa una base de datos/backend (por ejemplo Supabase o Firebase).
2. Guarda las imágenes en Storage.
3. Protege las operaciones de agregar/editar/eliminar con autenticación del servidor.
4. Mantén la página pública de solo lectura.

Si quieres usar imágenes locales en esta versión, primero súbelas a un servicio de almacenamiento
y pega aquí la URL pública de cada imagen.
