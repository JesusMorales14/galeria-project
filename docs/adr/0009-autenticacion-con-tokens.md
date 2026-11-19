# 0009 · Autenticación con tokens de acceso y refresco en cookies HttpOnly

- **Estado:** aceptada (persistencia ampliada por el [ADR 0011](0011-persistencia-y-despliegue-en-railway.md))
- **Fecha:** 2026-11-17

## Contexto

Galería necesitaba cuentas: entrar, registrarse, una página protegida y cerrar sesión, también en todos los dispositivos. Restricciones: sin backend propio (solo Route Handlers y Server Actions en Vercel), Cache Components activado (lo que lee la sesión no puede entrar en el HTML estático) y los formularios deben funcionar sin JavaScript, como la búsqueda ([ADR 0008](0008-busqueda-sin-javascript.md)).

## Opciones consideradas

1. **Proveedor gestionado** (Auth.js, Clerk, Supabase): menos código, pero oculta justo lo que este proyecto quiere demostrar y añade dependencias y coste.
2. **Sesión opaca en servidor** (id aleatorio en cookie + tabla de sesiones): revocación inmediata, pero cada navegación consulta el almacén, también en `proxy.ts`.
3. **JWT de acceso corto + token de refresco rotatorio**, ambos en cookies `HttpOnly`.
4. **JWT en `localStorage`** con cabecera `Authorization`: cualquier XSS roba la sesión. Descartada.

## Decisión

Opción 3, implementada a mano con `jose` (firma HS256) y `node:crypto` (scrypt).

| Pieza                  | Dónde                                                 | Qué hace                                                                                                                                   |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Tokens                 | `shared/auth/tokens.ts`                               | Acceso: 15 min, audiencia `galeria:acceso`. Refresco: 7 días, audiencia `galeria:refresco`, con `jti` y familia. Uno no sirve como el otro |
| Cookies                | `shared/auth/cookies.ts`                              | `HttpOnly`, `SameSite=Lax`, `Secure` en producción, `Path=/`                                                                               |
| Filtro previo          | `src/proxy.ts` + `decideAccess`                       | Solo verifica la firma del token de acceso (sin estado). Sin sesión → `/entrar?next=…`; acceso caducado con refresco → `/api/auth/refresh` |
| Rotación               | `app/api/auth/refresh` → `refreshSession`             | Consume el token de refresco (un solo uso) y emite un par nuevo de la misma familia                                                        |
| Capa de acceso a datos | `features/auth/server/session.ts`                     | `getSessionUser` y `requireUser`: cada lectura protegida vuelve a verificar en el servidor                                                 |
| Casos de uso           | `features/auth/lib/authService.ts`                    | Registro, acceso, refresco, cerrar sesión y cerrar todas. Dependencias inyectadas                                                          |
| Persistencia           | `UserRepository`, `RefreshTokenStore`, `AttemptStore` | Interfaces; Postgres en producción y memoria en desarrollo (ADR 0011)                                                                      |
| Formularios            | Server Actions + `useActionState`                     | Validación con Zod, errores por campo, funcionan sin JavaScript                                                                            |

**Seguridad aplicada:**

- **Robo de token de refresco:** cada token se usa una vez. Si reaparece uno ya consumido, se revoca toda la familia (quien lo robó y la víctima pierden la sesión; la víctima vuelve a entrar). Un margen de 10 s evita falsos positivos cuando dos pestañas refrescan a la vez.
- **Fuerza bruta:** 5 intentos por IP y correo cada 15 minutos (ventana deslizante).
- **Enumeración de cuentas:** el mismo mensaje para «no existe» y «contraseña incorrecta», y se verifica un hash señuelo para que el tiempo de respuesta no lo delate.
- **Contraseñas:** scrypt (N=16384, r=8, p=1, sal de 16 bytes), comparación en tiempo constante, longitud máxima de 128 para que scrypt no sea un vector de denegación de servicio.
- **CSRF:** `SameSite=Lax` y la comprobación de `Origin` que Next.js hace en cada Server Action.
- **Redirección abierta:** `?next=` solo acepta rutas internas (`safeRedirectPath`).
- **Secreto:** `AUTH_SECRET` (≥ 32 caracteres) obligatorio en producción; el arranque falla si falta.

## Consecuencias

- `proxy.ts` decide en microsegundos sin tocar ningún almacén; el estado solo se consulta al refrescar (cada 15 min por sesión activa).
- Cerrar sesión borra las cookies y revoca el refresco, pero un token de acceso copiado antes sigue siendo válido hasta 15 minutos. Es el precio de no consultar estado en cada petición.
- Cambiar a Postgres, Redis o un proveedor = nuevas implementaciones de `UserRepository` y `RefreshTokenStore`. El servicio, las Server Actions y la interfaz no cambian.
- **Limitación aceptada (deuda técnica 10):** las implementaciones en memoria no se comparten entre instancias serverless ni sobreviven a un despliegue. Las cuentas creadas son de demostración; existe una cuenta sembrada (`demo@galeria.dev`) para quien revisa el proyecto.
- Las páginas que leen la sesión van detrás de `<Suspense>` (cabecera, `/cuenta`) o con renderizado bloqueante (`/entrar`, `/registro`, para funcionar sin JavaScript): el resto del sitio conserva su HTML estático.
