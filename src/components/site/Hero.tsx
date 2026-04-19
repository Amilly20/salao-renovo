import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const slides = [
  // 📸 A sua foto foi colocada aqui como a primeira imagem do site!
  { src: "/fotos/Captura de tela 2026-04-17 151631.png", alt: "Interior luxuoso do Salão Renovo", position: "object-[center_40%]" },
  { src: "/fotos/Captura de tela 2026-04-17 151546.png", alt: "Segunda foto do salão", position: "object-[center_20%]" }, // 👈 Ajuste da segunda foto
  { src: "/fotos/Captura de tela 2026-04-17 151502.png", alt: "Terceira foto do salão", position: "object-[center_40%]" },
];

export const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Carousel layers */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity duration-[1800ms] ease-out"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            <img
              src={s.src}
              alt={s.alt}
              width={1920}
              height={1080}
              className={`h-full w-full object-cover ${s.position}`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-start justify-center px-6 pt-24">
        <div className="max-w-2xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Estética Premium
            </span>
          </div>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-gold animate-shimmer bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Salão Renovo
            </span>
          </h1>

          <div className="divider-gold my-7 max-w-xs" />

          <p className="font-display text-xl italic text-foreground/90 sm:text-2xl md:text-3xl">
            Renovando sua beleza
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Cabelo, depilação e cuidados sob medida em um ambiente sofisticado.
            Agende online e desfrute de uma experiência única.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="luxe" size="xl">
              <a href="/agendamento">Agendar Horário</a>
            </Button>
            <Button asChild variant="outlineGold" size="xl">
              <a href="#servicos">Ver Serviços</a>
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                active === i ? "w-12 bg-primary" : "w-6 bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
