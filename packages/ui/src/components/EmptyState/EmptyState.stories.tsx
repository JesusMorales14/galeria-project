import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "../TextLink";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Estados/EmptyState",
  component: EmptyState,
  args: {
    title: "No encontramos obras con esos filtros",
    description: "Prueba quitando alguno o buscando por otro artista.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConAccion: Story = { args: { action: <TextLink href="#">Limpiar filtros</TextLink> } };
export const SoloTexto: Story = {};
