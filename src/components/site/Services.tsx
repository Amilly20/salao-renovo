import { useEffect, useState } from "react";
import { Scissors, Sparkles, Wand2, Flower2 } from "lucide-react";

const fallbackServices = [
  {
    icon: Scissors,
    title: "Corte & Estilo",
    desc: "Cortes femininos e masculinos pensados para realçar seus traços com técnica e elegância.",
    price: "A partir de R$ 80",
  },
  {
    icon: Wand2,
    title: "Coloração Premium",
    desc: "Mechas, balayage, ombré hair e coloração com produtos de alta performance.",
    price: "A partir de R$ 250",
  },
  {
    icon: Sparkles,
    title: "Tratamentos Capilares",
    desc: "Hidratação profunda, botox, progressivas e cronograma capilar personalizado.",
    price: "A partir de R$ 150",
  },
  {
    icon: Flower2,
    title: "Depilação",
    desc: "Cera quente importada e técnicas suaves para uma pele lisa e renovada.",
    price: "A partir de R$ 35",
  },
];

export const Services = () => {
  const [displayServices, setDisplayServices] = useState<any[]>(fallbackServices);

  useEffect(() => {
    // Busca os serviços que a administradora salvou no painel
    const saved = localStorage.getItem('@salaorenovo:services');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setDisplayServices(parsed.map((s: any) => ({
          id: s.id,
          title: s.name,
          desc: s.duration ? `Duração estimada: ${s.duration}` : "Serviço profissional de alta qualidade.",
          price: s.price.includes('R$') ? s.price : `R$ ${s.price}`,
          image: s.image,
          icon: Scissors // Ícone padrão caso não tenha foto
        })));
      }
    }
  }, []);

  return (
    <section id="servicos" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Nossos Serviços
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">
            <span className="text-gold">Excelência</span> em cada detalhe
          </h2>
          <div className="divider-gold mx-auto my-6 max-w-[120px]" />
          <p className="text-muted-foreground">
            Uma curadoria de serviços para cuidar de você dos pés à cabeça.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayServices.map((s, i) => (
            <article
              key={s.id || s.title}
              className="luxe-card group p-8 flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-gradient-gold-soft transition-all group-hover:border-primary group-hover:shadow-gold-soft overflow-hidden shrink-0">
                {s.image ? (
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                ) : (
                  <s.icon className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="font-display text-xl text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-grow">{s.desc}</p>
              <div className="mt-6 border-t border-border/50 pt-4 text-xs uppercase tracking-widest text-primary font-semibold">
                {s.price}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
