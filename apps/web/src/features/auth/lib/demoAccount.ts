/**
 * Cuenta de demostración, sembrada al arrancar el servidor. Permite que quien revisa el
 * proyecto pruebe el acceso sin registrarse. No da acceso a nada sensible: solo existe en
 * la memoria de esta instancia y su contraseña se guarda con hash, como cualquier otra.
 */
export const DEMO_ACCOUNT = {
  id: "cuenta-demo",
  name: "Visitante",
  email: "demo@galeria.dev",
  password: "sala-iluminada-2026",
  createdAt: "2026-11-17T00:00:00.000Z",
} as const;
