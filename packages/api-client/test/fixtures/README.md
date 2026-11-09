# Fixtures

Respuestas de la API del Art Institute of Chicago usadas por los tests.

Están construidas a mano a partir de la documentación oficial (el entorno donde se escribieron no tenía acceso a la API). Para compararlas con respuestas reales, ejecuta en tu equipo:

```bash
pnpm --filter @galeria/api-client fixtures:capture
```

El script guarda las respuestas reales en `test/fixtures/captured/` (ignorado por git) para que puedas compararlas y actualizar estos archivos si la API cambió.
