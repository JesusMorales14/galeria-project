-- Cuentas, sesiones (tokens de refresco) e intentos de acceso. Ver docs/adr/0011.

CREATE TABLE users (
  id            text        PRIMARY KEY,
  name          text        NOT NULL,
  -- El correo llega ya normalizado (minúsculas, sin espacios) desde la validación con Zod.
  email         text        NOT NULL,
  password_hash text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE refresh_tokens (
  token_id   text        PRIMARY KEY,
  family_id  text        NOT NULL,
  user_id    text        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  revoked    boolean     NOT NULL DEFAULT false
);

CREATE INDEX refresh_tokens_family_idx  ON refresh_tokens (family_id);
CREATE INDEX refresh_tokens_user_idx    ON refresh_tokens (user_id);
CREATE INDEX refresh_tokens_expires_idx ON refresh_tokens (expires_at);

CREATE TABLE sign_in_attempts (
  key          text        NOT NULL,
  attempted_at timestamptz NOT NULL
);

CREATE INDEX sign_in_attempts_key_idx  ON sign_in_attempts (key, attempted_at);
CREATE INDEX sign_in_attempts_time_idx ON sign_in_attempts (attempted_at);
