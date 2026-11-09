/** Error base: la API respondió con un estado inesperado. */
export class AicApiError extends Error {
  override name = "AicApiError";

  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Se superó el límite de 60 peticiones por minuto. */
export class AicRateLimitError extends AicApiError {
  override name = "AicRateLimitError";

  constructor(readonly retryAfterSeconds: number | null) {
    super("Se superó el límite de peticiones de la API del museo.", 429);
  }
}

/** La respuesta no cumple el contrato esperado (la API cambió o vino incompleta). */
export class AicContractError extends Error {
  override name = "AicContractError";

  constructor(
    message: string,
    readonly issues: unknown,
  ) {
    super(message);
  }
}
