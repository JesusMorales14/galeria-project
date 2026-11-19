// Migra la base de datos de DATABASE_URL. En Railway se ejecuta como «pre-deploy command»:
// si falla, el despliegue se detiene y sigue sirviendo la versión anterior.
import pg from "pg";
import { migrate } from "../db/migrate.mjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL no está definida: no hay base de datos que migrar.");
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();
try {
  await migrate(client, { log: (message) => console.log(message) });
} finally {
  await client.end();
}
