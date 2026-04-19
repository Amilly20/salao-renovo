import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X } from "lucide-react";

export const Showcase = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    // Busca a Vitrine salva pela administradora no Painel
    const saved = localStorage.getItem('@salaorenovo:vitrine');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setProducts(parsed);
      }
    }
  }, []);

  return (
    <section id="vitrine" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      <div className="container relative mx-auto px-6">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
              Vitrine
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Produtos <span className="text-gold">Exclusivos</span>
            </h2>
            <div className="divider-gold mt-6 max-w-[120px]" />
          </div>
          <p className="max-w-md text-muted-foreground">
            Selecionamos as melhores marcas para que você leve a experiência Renovo para casa.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <article key={p.id} className="luxe-card group overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden bg-white border-b border-border/50 flex items-center justify-center p-4">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-contain hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ShoppingBag className="h-12 w-12 text-primary/40" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  {p.brand && <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">{p.brand}</p>}
                  <h3 className="mt-2 font-display text-lg text-foreground">{p.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-display text-xl text-emerald-600 font-bold">{p.price.includes('R$') ? p.price : `R$ ${p.price}`}</span>
                    <Button variant="ghostGold" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}>Ver</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {/* MODAL DO PRODUTO EXPANDIDO */}
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
            onClick={() => setSelectedProduct(null)}
          >
            <div 
              className="relative w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl animate-fade-up border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted text-muted-foreground transition-colors" 
                onClick={() => setSelectedProduct(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex h-64 md:h-full min-h-[250px] items-center justify-center rounded-xl bg-white border border-border/50 overflow-hidden relative">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-contain p-4 hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <ShoppingBag className="h-16 w-16 text-primary/40" />
                  )}
                </div>
                <div className="flex flex-col justify-center py-4">
                  {selectedProduct.brand && <span className="text-xs uppercase tracking-widest text-primary font-semibold">{selectedProduct.brand}</span>}
                  <h3 className="font-display text-3xl text-foreground mt-2">{selectedProduct.name}</h3>
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                    {selectedProduct.description || "Um produto exclusivo cuidadosamente selecionado para você prolongar os cuidados do Salão Renovo na sua casa."}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-display text-3xl text-emerald-600 font-bold">
                      {selectedProduct.price.includes('R$') ? selectedProduct.price : `R$ ${selectedProduct.price}`}
                    </span>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {selectedProduct.stock ? `${selectedProduct.stock} EM ESTOQUE` : "DISPONÍVEL"}
                    </span>
                  </div>
                  <Button 
                    className="mt-8 w-full" 
                    size="lg" 
                    onClick={() => window.open(`https://wa.me/5577991261178?text=Olá! Tenho interesse no produto: ${selectedProduct.name}`, '_blank')}
                  >
                    Comprar pelo WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
