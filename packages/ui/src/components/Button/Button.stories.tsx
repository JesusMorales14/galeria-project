import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Componentes/Button",
  component: Button,
  args: { children: "Guardar en colección" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primario: Story = {};
export const Secundario: Story = { args: { variant: "secondary", children: "Cancelar" } };
export const Fantasma: Story = { args: { variant: "ghost", children: "Restablecer" } };
export const Pequeno: Story = { args: { size: "sm" } };
export const Cargando: Story = { args: { loading: true } };
export const Deshabilitado: Story = { args: { disabled: true } };
