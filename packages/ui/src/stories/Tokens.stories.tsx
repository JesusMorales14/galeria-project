import type { Meta, StoryObj } from "@storybook/react-vite";

const colors = ["wall", "surface", "ink", "ink-muted", "line", "accent", "placeholder", "danger"];

function Tokens() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-title">Color</h2>
        <ul className="grid grid-cols-4 gap-4">
          {colors.map((name) => (
            <li key={name} className="flex flex-col gap-2">
              <div className="h-16 border border-line" style={{ background: `var(--${name})` }} />
              <code className="text-label text-ink-muted">--{name}</code>
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-title">Tipografía</h2>
        <p className="font-display text-display">Galería</p>
        <p className="font-display text-title italic">A Sunday on La Grande Jatte</p>
        <p className="max-w-prose">
          Texto de lectura en Instrument Sans. Las cartelas usan el tamaño label y el color
          atenuado.
        </p>
        <p className="text-label text-ink-muted tabular-nums">
          Georges Seurat · 1884–86 · 207,5 × 308,1 cm
        </p>
      </section>
    </div>
  );
}

const meta = { title: "Fundamentos/Tokens", component: Tokens } satisfies Meta<typeof Tokens>;
export default meta;
export const Todos: StoryObj<typeof meta> = {};
