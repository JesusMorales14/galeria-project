/**
 * Imagen de ejemplo para las historias: un bloque de color con la proporción real
 * de la obra. Storybook se revisa sin depender de la red ni de la API del museo.
 */
export function SampleMedia({
  ratio = 4 / 5,
  tone = "#8a7a5c",
  label,
}: {
  ratio?: number;
  tone?: string;
  label: string;
}) {
  return (
    <div role="img" aria-label={label} style={{ aspectRatio: String(ratio), background: tone }} />
  );
}
