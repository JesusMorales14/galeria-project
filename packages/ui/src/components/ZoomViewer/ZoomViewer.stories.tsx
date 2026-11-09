import type { Meta, StoryObj } from "@storybook/react-vite";
import { ZoomViewer } from "./ZoomViewer";

/** Imagen de ejemplo generada (bandas de color), para revisar el visor sin red. */
const SAMPLE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000"><rect width="1500" height="1000" fill="#8a7a5c"/><rect y="333" width="1500" height="333" fill="#6b5b4b"/><rect y="666" width="1500" height="334" fill="#7d8a6a"/><circle cx="750" cy="500" r="120" fill="#f4f1ea"/></svg>`,
  );

const meta = {
  title: "Componentes/ZoomViewer",
  component: ZoomViewer,
  decorators: [(Story) => <div className="w-[48rem] max-w-full">{Story()}</div>],
  args: {
    src: SAMPLE,
    width: 1500,
    height: 1000,
    alt: "Imagen de ejemplo con bandas de color y un círculo central",
    title: "Obra de ejemplo",
  },
} satisfies Meta<typeof ZoomViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { width: 800, height: 1100 } };
export const SinMedidas: Story = { args: { width: null, height: null } };
