# Incidente 001 · La búsqueda falla porque la API cambió su respuesta

- **Tipo:** simulado (ejercicio de observabilidad)
- **Fecha del ejercicio:** 2026-11-09
- **Severidad:** alta: `/buscar` deja de mostrar resultados.
- **Estado:** resuelto

## Resumen

Simulamos que la API del museo cambia el formato de `/artworks/search`: el bloque `pagination` pasa a llamarse `paging`. La validación con Zod de `@galeria/api-client` detecta el cambio, lanza `AicContractError`, el error llega a Sentry con su contexto y el usuario ve un estado de error recuperable en lugar de una página rota.

## Cómo se provocó

```bash
pnpm --filter @galeria/web build                 # con AIC_API_BASE_URL apuntando a la API simulada
MOCK_AIC_FAULT=contract node apps/web/e2e/mock-aic/server.mjs
AIC_API_BASE_URL=http://localhost:4010/api/v1 pnpm --filter @galeria/web start
# abrir /buscar?q=monet&tipo=Print
```

En una vista previa de Vercel, la alternativa es activar `ENABLE_DEBUG_ROUTES=1` y abrir `/api/debug/error`, que lanza un error controlado.

## Cronología

| Paso                  | Qué se observó                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Detección             | El usuario ve «No pudimos cargar las obras» con el botón **Reintentar** (`app/buscar/error.tsx`). En Sentry entra un evento nuevo de `AicContractError`.                                                           |
| Registro del servidor | `⨯ Error [AicContractError]: Respuesta inesperada de la API en /artworks/search` con `issues: [{ code: 'invalid_type', expected: 'object', path: ['pagination'] }]` y `digest: '55294893'`.                        |
| Contexto en Sentry    | Etiquetas `boundary: buscar` y `digest`; contexto `busqueda` con `{ tipo: "Print", conTexto: true, pagina: 1 }`. El texto buscado («monet») **no** se envía: `scrubEvent` lo sustituye por `[filtrado]` en la URL. |
| Traza                 | El span del `fetch` a `/artworks/search` aparece con su duración y estado 200: la API respondió, el problema era la forma de los datos.                                                                            |
| Causa raíz            | `rawSearchResponseSchema` exige `pagination`; la respuesta trae `paging`. El `path` del issue de Zod apunta exactamente al campo.                                                                                  |

## Causa raíz

Cambio de contrato en un servicio externo. El código no tenía un error lógico: la validación hizo su trabajo y evitó que datos con una forma desconocida llegaran a la interfaz.

## Qué funcionó

- **Contrato con Zod:** el fallo es explícito y localizado (campo `pagination`), no un `undefined` que rompe un componente más adelante.
- **El `digest`** une el registro del servidor con el evento de Sentry sin exponer el error al usuario.
- **Error boundary con reintento:** la página no se queda en blanco.
- **Privacidad:** el contexto dice qué filtros había sin revelar lo que escribió el usuario.

## Acciones

1. **Corrección (si el cambio fuera real):** actualizar `rawSearchResponseSchema` y la normalización para aceptar `paging`, con un test y fixtures capturados con `pnpm --filter @galeria/api-client fixtures:capture`.
2. **Alerta:** regla en Sentry «más de 10 eventos `AicContractError` en 5 minutos» → aviso por correo.
3. **Prevención:** un job programado semanal que ejecute `fixtures:capture` y compare con los fixtures del repositorio (ver `TECH_DEBT.md`).

## Para repetir el ejercicio con tu cuenta de Sentry

1. Crea un proyecto Next.js en Sentry y copia el DSN.
2. En Vercel → Settings → Environment Variables: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` y `SENTRY_AUTH_TOKEN` (este último solo en el entorno de build). En Preview, además, `ENABLE_DEBUG_ROUTES=1`.
3. Despliega una vista previa y abre `/api/debug/error`.
4. En Sentry, abre el evento y comprueba que la traza muestra **la línea exacta del código original**: los source maps se subieron en el build y se borraron de la app publicada.
5. Añade aquí el enlace al evento y una captura.
