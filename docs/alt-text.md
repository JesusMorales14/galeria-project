# Estrategia de texto alternativo

Ninguna imagen de obra se queda sin `alt`. La lógica vive en `apps/web/src/shared/artwork/altText.ts` y tiene tests.

1. **Descripción del museo.** Si la API trae `thumbnail.alt_text`, se usa tal cual: la escribe personal del museo y describe lo que se ve.
2. **Composición.** Si no, se compone `"Título, de Artista, Fecha"`, omitiendo lo que falte (`"Untitled"` si solo hay título).
3. **Sin imagen.** Si la obra no tiene imagen, no se pinta un `<img>` vacío: se muestra el texto "El museo no tiene una imagen de esta obra."

**Por qué no un alt vacío (`alt=""`):** las imágenes de las obras son el contenido principal, no decoración. Un alt vacío las haría invisibles para un lector de pantalla.

**Limitación conocida:** el texto compuesto identifica la obra pero no describe lo que se ve. La API solo trae `alt_text` para parte de la colección (ver `TECH_DEBT.md`).
