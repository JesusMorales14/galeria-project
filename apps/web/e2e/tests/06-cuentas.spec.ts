import { expect, test, type Page } from "@playwright/test";
import { expectAccessible } from "../support/axe";

const uniqueEmail = () =>
  `persona-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;

async function signUp(page: Page, email: string) {
  await page.goto("/registro");
  await page.getByLabel("Nombre").fill("Ada");
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill("una frase larga y segura");
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page).toHaveURL(/\/cuenta$/);
}

test.describe("Cuentas", () => {
  test("una página protegida manda a entrar y, tras entrar, vuelve a ella", async ({ page }) => {
    await page.goto("/cuenta");
    await expect(page).toHaveURL(/\/entrar\?next=%2Fcuenta$/);
    await expectAccessible(page);

    await page.getByRole("button", { name: "Entrar con la cuenta de demostración" }).click();

    await expect(page).toHaveURL(/\/cuenta$/);
    await expect(page.getByRole("heading", { level: 2, name: "Visitante" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Tu cuenta: Visitante/ })).toBeVisible();
    await expectAccessible(page);
  });

  test("los tokens viajan en cookies HttpOnly, invisibles para el JavaScript de la página", async ({
    page,
    context,
  }) => {
    await signUp(page, uniqueEmail());

    const cookies = await context.cookies();
    const session = cookies.filter((cookie) => cookie.name.startsWith("galeria_"));
    expect(session.map((cookie) => cookie.name).sort()).toEqual([
      "galeria_acceso",
      "galeria_refresco",
    ]);
    expect(session.every((cookie) => cookie.httpOnly && cookie.sameSite === "Lax")).toBe(true);
    expect(await page.evaluate(() => document.cookie)).not.toContain("galeria_");
  });

  test("si el token de acceso caduca, la sesión se renueva sola con el de refresco", async ({
    page,
    context,
  }) => {
    await signUp(page, uniqueEmail());
    const before = (await context.cookies()).find((c) => c.name === "galeria_refresco")?.value;

    // Simula la caducidad: el navegador ya no envía el token de acceso.
    await context.clearCookies({ name: "galeria_acceso" });
    await page.goto("/cuenta");

    await expect(page).toHaveURL(/\/cuenta$/);
    await expect(page.getByRole("heading", { level: 2, name: "Ada" })).toBeVisible();
    const after = (await context.cookies()).find((c) => c.name === "galeria_refresco")?.value;
    expect(after).toBeTruthy();
    expect(after).not.toBe(before); // rotación: un token de refresco nuevo en cada uso
  });

  test("errores claros: correo repetido y credenciales que no coinciden", async ({ page }) => {
    const email = uniqueEmail();
    await signUp(page, email);
    await page.getByRole("button", { name: "Cerrar sesión", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/registro");
    await page.getByLabel("Nombre").fill("Otra");
    await page.getByLabel("Correo").fill(email);
    await page.getByLabel("Contraseña").fill("otra frase larga");
    await page.getByRole("button", { name: "Crear cuenta" }).click();
    await expect(
      page.getByText("Ya hay una cuenta con este correo.", { exact: false }),
    ).toBeVisible();
    await expect(page.getByLabel("Correo")).toBeFocused();

    await page.goto("/entrar");
    await page.getByLabel("Correo").fill(email);
    await page.getByLabel("Contraseña").fill("no es esta");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    // Next.js tiene su propio role="alert" para anunciar rutas: se filtra por el texto.
    await expect(page.getByRole("alert").filter({ hasText: "no coinciden" })).toBeVisible();
  });

  test("cerrar sesión borra las cookies y la cuenta vuelve a estar protegida", async ({
    page,
    context,
  }) => {
    await signUp(page, uniqueEmail());
    await page.getByRole("button", { name: "Cerrar sesión", exact: true }).click();

    await expect(page).toHaveURL(/\/$/);
    const names = (await context.cookies()).map((cookie) => cookie.name);
    expect(names).not.toContain("galeria_refresco");
    await page.goto("/cuenta");
    await expect(page).toHaveURL(/\/entrar/);
  });
});

test.describe("Cuentas sin JavaScript", () => {
  // Con movimiento reducido la entrada aparece ya colocada: Playwright sin JavaScript no
  // puede esperar a que termine una animación antes de pulsar.
  test.use({ javaScriptEnabled: false, reducedMotion: "reduce" });

  test("el formulario de acceso funciona sin JavaScript", async ({ page }) => {
    await page.goto("/entrar?next=/colecciones");
    await page.getByLabel("Correo").fill("demo@galeria.dev");
    await page.getByLabel("Contraseña").fill("sala-iluminada-2026");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page).toHaveURL(/\/colecciones$/);
  });
});
