import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Gallery = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [fotos, setFotos] = useState<string[]>([]);

  useEffect(() => {
    // Busca as fotos que a administradora salvou no painel
    const fotosSalvas = localStorage.getItem('@salaorenovo:gallery');
    if (fotosSalvas) {
      setFotos(JSON.parse(fotosSalvas));
    }
  }, []);

  const rolarParaAnterior = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const rolarParaProximo = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="galeria" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Nossos Trabalhos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Arraste para o lado e confira alguns dos resultados incríveis que entregamos para nossas clientes.
          </p>
        </div>

        <div className="relative">
          {fotos.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                <div className="flex gap-4">
                  {fotos.map((foto, index) => (
                    <div 
                      className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] min-w-0" 
                      key={index}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm border border-border/50">
                        <img
                          src={foto}
                          alt={`Trabalho do salão ${index + 1}`}
                          className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={rolarParaAnterior} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-md p-3 rounded-full text-primary backdrop-blur-sm border border-border/50 transition-all z-10" aria-label="Foto anterior">
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button onClick={rolarParaProximo} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-md p-3 rounded-full text-primary backdrop-blur-sm border border-border/50 transition-all z-10" aria-label="Próxima foto">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          ) : (
            <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl border-border/50 bg-background/50">
              <p className="text-lg text-muted-foreground font-medium">Nenhuma foto adicionada ainda.</p>
              <p className="text-sm text-muted-foreground mt-1">Acesse o Painel da Chefe para adicionar fotos aos seus Trabalhos!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
