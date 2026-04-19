import { useEffect, useState } from "react";
import { Scissors, X } from "lucide-react";

export const Services = () => {
  const [displayServices, setDisplayServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);

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

        {displayServices.length > 0 ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayServices.map((s, i) => (
              <article
                key={s.id || s.title}
                className="luxe-card group p-8 flex flex-col"
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => setSelectedService(s)}
                role="button"
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
        ) : (
          <div className="mt-16 text-center py-12 px-4 border-2 border-dashed rounded-xl border-border/50 bg-background/50 max-w-2xl mx-auto">
            <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground font-medium">Nossa lista de serviços está sendo atualizada!</p>
            <p className="text-sm text-muted-foreground mt-1">Em breve, todos os nossos tratamentos estarão disponíveis aqui.</p>
          </div>
        )}

        {/* MODAL DO SERVIÇO EXPANDIDO */}
        {selectedService && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
            onClick={() => setSelectedService(null)}
          >
            <div 
              className="relative w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl animate-fade-up border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted text-muted-foreground transition-colors" 
                onClick={() => setSelectedService(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-primary/20 bg-muted/30 flex items-center justify-center">
                  {selectedService.image ? (
                    <img src={selectedService.image} alt={selectedService.title} className="h-full w-full object-cover" />
                  ) : (
                    <Scissors className="h-16 w-16 text-primary/40" />
                  )}
                </div>
                <h3 className="font-display text-3xl text-foreground">{selectedService.title}</h3>
                <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-md">{selectedService.desc}</p>
                <div className="mt-6 font-display text-2xl text-emerald-600 font-bold">{selectedService.price}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
