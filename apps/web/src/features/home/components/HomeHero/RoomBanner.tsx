import type { CSSProperties } from "react";
import "./sala.css";

type RoomBannerProps = { id: string; text: string };

function Letters({ text }: { text: string }) {
  return [...text].map((letter, index) => (
    <span key={index} className="sala-letra" style={{ "--i": index } as CSSProperties}>
      {letter}
    </span>
  ));
}

/**
 * Rótulo de fachada, como los estandartes del museo. Es el h1 de la portada:
 * el lector de pantalla lee la palabra entera; las letras sueltas son decorado.
 */
export function RoomBanner({ id, text }: RoomBannerProps) {
  return (
    <h1 id={id} className="sala-rotulo">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <Letters text={text} />
      </span>
      <span aria-hidden="true" className="sala-rotulo-luz" data-spot-local="">
        <Letters text={text} />
      </span>
    </h1>
  );
}
