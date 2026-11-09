# 0007 · Colecciones con IndexedDB y enlaces, sin backend

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

Los usuarios quieren guardar obras en colecciones propias, reordenarlas y compartirlas. El proyecto no tiene backend propio, ni cuentas, ni base de datos.

## Opciones consideradas

1. **localStorage:** simple, pero síncrono (bloquea el hilo principal) y limitado a ~5 MB de texto.
2. **IndexedDB** (con la librería `idb`, ~1 KB): asíncrono, con más capacidad y transacciones.
3. **Backend con cuentas** (por ejemplo Supabase): sincroniza dispositivos, pero añade registro, privacidad y coste que el producto no necesita todavía.

## Decisión

- **IndexedDB** para persistir las colecciones en el navegador.
- **Compartir por URL:** `/coleccion?nombre=…&obras=1,2,3`. Quien abre el enlace ve la colección renderizada en el servidor, sin cuenta. La URL se valida con Zod: un enlace manipulado muestra un mensaje claro, nunca un error.
- **Exportar e importar en JSON** para no depender de un único navegador.

La persistencia queda aislada en capas (`features/collections/lib`):

| Capa                   | Archivo                                            | Sabe de…                                                 |
| ---------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| Dominio (reglas puras) | `collection.ts`                                    | Nombres válidos, no duplicar, mover, límite de 100 obras |
| Repositorio (interfaz) | `repository.ts`                                    | `list`, `get`, `save`, `remove`                          |
| Infraestructura        | `indexedDbRepository.ts`, `createMemoryRepository` | IndexedDB / memoria                                      |
| Casos de uso           | `service.ts`                                       | Crear, renombrar, añadir, reordenar, importar            |
| Adaptador de React     | `store.ts` + `useCollections`                      | `useSyncExternalStore`, sincronización entre pestañas    |

## Consecuencias

- Cambiar a una API con cuentas = una nueva implementación de `CollectionsRepository`. Ni los componentes ni los casos de uso cambian. El mismo conjunto de tests del servicio se ejecuta contra las dos implementaciones actuales.
- Si IndexedDB no está disponible (algunos modos privados), se usa el repositorio en memoria y se avisa al usuario.
- **Limitaciones aceptadas:** las colecciones no se sincronizan entre dispositivos (se mitiga con el enlace y la exportación); el enlace compartido es una copia, no una colección viva; las URL largas limitan a 100 obras por colección.
