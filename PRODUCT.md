# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Principal: reclutadores y equipos técnicos que revisan el portfolio de Jesús.** Llegan desde un enlace del portfolio o del CV, con poco tiempo, y evalúan dos cosas a la vez: si el producto se siente profesional al usarlo y si el código y las decisiones demuestran criterio de ingeniería frontend.

**Secundario: cualquier persona curiosa por el arte**, que usa Galería para explorar la colección del Art Institute of Chicago.

## Product Purpose

Explorar la colección pública del Art Institute of Chicago con tres tareas de igual peso:

1. **Descubrir** obras sin saber qué buscar (portada y obras destacadas).
2. **Buscar** una obra concreta con texto, filtros y orden.
3. **Guardar** obras en colecciones propias y compartirlas por enlace, sin cuentas ni backend.

Éxito: un reclutador abre el sitio, encuentra y amplía una obra y guarda una colección en menos de dos minutos, sin errores ni pantallas en blanco; y al abrir el repositorio entiende por qué cada decisión técnica se tomó así.

## Positioning

Es un caso de estudio de ingeniería frontend con forma de producto real: cada decisión (renderizado híbrido, contratos de datos validados, accesibilidad del visor, colecciones sin backend) está medida, probada y documentada en ADRs.

## Operating Context

- Se evalúa en escritorio (revisión del portfolio) y en móvil (enlace abierto desde LinkedIn o correo).
- El reclutador técnico abrirá también el repositorio: README, ADRs, tests y CI son parte del producto.
- Datos de la API pública del Art Institute of Chicago (sin clave, 60 peticiones por minuto por IP).

## Capabilities and Constraints

- Sin backend propio: solo Route Handlers de Next.js desplegados en Vercel.
- Solo obras de dominio público (`is_public_domain=true`) para poder mostrar sus imágenes sin riesgo de licencia.
- Imágenes servidas por IIIF desde el museo; la base se lee de `config.iiif_url`.
- La paginación de la búsqueda no puede superar los 10.000 resultados (límite de la API).
- Interfaz en español.

## Brand Commitments

- Nombre: **Galería**.
- Tono: **museo**. Sobrio, respetuoso con la obra, sin adornos que compitan con ella. La interfaz se retira y la obra manda.
- **Anti-referencias (inferido, pendiente de confirmar por Jesús):** no debe parecer una plantilla genérica de SaaS (gradientes, tarjetas con sombra por todas partes, iconos decorativos), ni una tienda online de láminas, ni un banco de imágenes.

## Evidence on Hand

- Datos e imágenes reales de la API del museo.
- No hay testimonios, métricas de uso ni clientes: no se deben inventar.
- Las métricas de rendimiento solo se publican cuando se han medido (Fase 6).

## Product Principles

1. **La obra primero.** Cada pantalla deja más espacio a la imagen que a la interfaz.
2. **Nunca una pantalla en blanco.** Toda vista tiene estado de carga, vacío y error.
3. **Accesible de verdad.** Todo se usa con teclado y lector de pantalla, incluido el visor de zoom.
4. **El enlace es el estado.** Búsquedas y colecciones se comparten con la URL.
5. **Cada decisión se puede defender.** Medida, probada y documentada.

## Accessibility & Inclusion

Objetivo WCAG 2.2 AA. Respeto de `prefers-reduced-motion` y `prefers-color-scheme`. Pruebas automáticas con axe en cada página.
