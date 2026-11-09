# 0003 · Validación de contratos con Zod y tipos propios

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

Una API externa puede devolver datos incompletos (obras sin imagen, sin fecha o sin descripción) o cambiar de formato sin aviso.

## Opciones consideradas

1. **Tipos de TypeScript escritos a mano:** no existen en tiempo de ejecución. Si la API cambia, el fallo aparece lejos, como un `undefined` dentro de un componente.
2. **Zod:** un esquema que valida en tiempo de ejecución y del que salen los tipos (`z.infer`).

## Decisión

Zod en `@galeria/api-client`. Solo `id` y `title` son obligatorios. Las listas se validan registro a registro (uno roto se descarta y el resto se muestra). Después, todo se **normaliza** a tipos propios (`Artwork`, `ArtworkSummary`): la interfaz nunca ve `artist_title` ni `image_id`.

También se valida con Zod todo lo que entra desde fuera: la URL de búsqueda, los ids del BFF, los enlaces de colecciones compartidas, los archivos importados y las variables de entorno.

## Consecuencias

- Un cambio en la API produce `AicContractError` con la ruta exacta del campo (ver el incidente 001).
- **Coste:** Zod pesa unos 30 KB comprimidos, así que se mantiene fuera del bundle del navegador (subruta `@galeria/api-client/images`, validación de importación bajo demanda). Lighthouse CI lo vigila.
