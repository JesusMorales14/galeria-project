# @galeria/config

Configuración compartida del monorepo. Un cambio aquí se aplica a todos los paquetes.

| Export                  | Uso                                                                   |
| ----------------------- | --------------------------------------------------------------------- |
| `tsconfig/base.json`    | Reglas de TypeScript comunes (`strict`, `noUncheckedIndexedAccess`…). |
| `tsconfig/library.json` | Paquetes de librería (`ui`, `api-client`).                            |
| `tsconfig/nextjs.json`  | Apps Next.js.                                                         |
| `eslint/base`           | TypeScript + reglas de arquitectura (tamaño de archivo, complejidad). |
| `eslint/next`           | `base` + Next.js + accesibilidad (`jsx-a11y`) + límites entre capas.  |
| `prettier`              | Formato de código.                                                    |
