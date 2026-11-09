import type { Preview } from "@storybook/react-vite";
import "./storybook.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: {
      // Las violaciones de accesibilidad se muestran como error en el panel.
      test: "error",
    },
    backgrounds: { disable: true },
  },
};

export default preview;
