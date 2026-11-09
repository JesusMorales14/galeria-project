import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ErrorState } from "./ErrorState";

const meta = {
  title: "Estados/ErrorState",
  component: ErrorState,
  args: {
    title: "No pudimos cargar las obras",
    description: "El museo tardó demasiado en responder. Vuelve a intentarlo en unos segundos.",
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConReintento: Story = { args: { onRetry: fn() } };
export const SinReintento: Story = {};
