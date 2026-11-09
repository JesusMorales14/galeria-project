import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";
import { Select } from "./Select";
import { TextInput } from "./TextInput";

const meta = {
  title: "Componentes/Field",
  component: Field,
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  args: { label: "Buscar", htmlFor: "q", children: null },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Texto: Story = {
  args: {
    hint: "Título, artista o tema",
    children: (
      <TextInput id="q" name="q" placeholder="Monet, retrato, río…" aria-describedby="q-hint" />
    ),
  },
};

export const Selector: Story = {
  args: {
    label: "Tipo de obra",
    htmlFor: "tipo",
    children: (
      <Select id="tipo" name="tipo" defaultValue="">
        <option value="">Todos los tipos</option>
        <option value="Painting">Pintura</option>
        <option value="Print">Grabado</option>
      </Select>
    ),
  },
};
