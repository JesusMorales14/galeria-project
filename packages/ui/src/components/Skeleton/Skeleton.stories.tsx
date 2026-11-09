import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArtworkCardSkeleton } from "./ArtworkCardSkeleton";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Estados/Skeleton",
  component: Skeleton,
  args: { className: "h-4 w-64" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linea: Story = {};
export const TarjetaDeObra: Story = {
  render: () => (
    <div className="w-72">
      <ArtworkCardSkeleton />
    </div>
  ),
};
