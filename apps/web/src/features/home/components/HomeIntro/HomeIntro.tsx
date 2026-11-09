type HomeIntroProps = {
  title: string;
  description: string;
};

/** Presentación de la portada. Recibe sus textos por props: no sabe de dónde vienen. */
export function HomeIntro({ title, description }: HomeIntroProps) {
  return (
    <section aria-labelledby="home-intro-title" className="flex flex-col gap-4">
      <h1 id="home-intro-title" className="font-display text-display text-ink">
        {title}
      </h1>
      <p className="max-w-prose text-lg leading-8 text-ink-muted">{description}</p>
    </section>
  );
}
