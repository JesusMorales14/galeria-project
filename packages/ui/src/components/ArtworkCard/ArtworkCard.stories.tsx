import type { Meta, StoryObj } from "@storybook/react-vite";
import { SampleMedia } from "../../stories/sampleMedia";
import { ArtworkCardSkeleton } from "../Skeleton";
import { ArtworkCard } from "./ArtworkCard";

const meta = {
  title: "Componentes/ArtworkCard",
  component: ArtworkCard,
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
  args: {
    href: "#",
    title: "A Sunday on La Grande Jatte — 1884",
    artist: "Georges Seurat",
    date: "1884–86",
    media: <SampleMedia ratio={3000 / 2013} tone="#7d8a6a" label="Imagen de ejemplo" />,
  },
} satisfies Meta<typeof ArtworkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completa: Story = {};
export const SinArtista: Story = { args: { artist: null } };
export const SinFecha: Story = { args: { date: null } };
export const TituloLargo: Story = {
  args: {
    title: "Paris Street; Rainy Day, with a very long subtitle that wraps over several lines",
    media: <SampleMedia ratio={0.8} tone="#5f6670" label="Imagen de ejemplo" />,
  },
};
export const Cargando: Story = { render: () => <ArtworkCardSkeleton aspectRatio={3000 / 2013} /> };

export const EnCuadricula: Story = {
  decorators: [(Story) => <div className="w-[52rem]">{Story()}</div>],
  render: (args) => (
    <ul className="grid grid-cols-3 gap-x-8 gap-y-12">
      {[1.49, 0.8, 1.27, 0.75, 1, 1.33].map((ratio, index) => (
        <li key={ratio}>
          <ArtworkCard
            {...args}
            title={`Obra de ejemplo ${index + 1}`}
            media={
              <SampleMedia
                ratio={ratio}
                tone={index % 2 ? "#6b5b4b" : "#8a7a5c"}
                label="Imagen de ejemplo"
              />
            }
          />
        </li>
      ))}
    </ul>
  ),
};
