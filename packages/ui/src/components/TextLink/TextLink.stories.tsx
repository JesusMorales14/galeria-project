import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "./TextLink";

const meta = {
  title: "Componentes/TextLink",
  component: TextLink,
  args: { href: "#", children: "Ver todas las obras de Monet" },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interno: Story = {};
export const Externo: Story = {
  args: { href: "https://www.artic.edu", external: true, children: "Ficha en el Art Institute" },
};
export const EnUnParrafo: Story = {
  render: (args) => (
    <p className="max-w-prose text-ink">
      Datos e imágenes de la colección pública del <TextLink {...args} />, en dominio público.
    </p>
  ),
  args: { href: "https://www.artic.edu", external: true, children: "Art Institute of Chicago" },
};
