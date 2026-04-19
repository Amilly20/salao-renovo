import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const fallbackHours = [
  { id: "1", day: "Ter — Sex", time: "09h — 20h" },
  { id: "2", day: "Sábado", time: "09h — 18h" },
  { id: "3", day: "Dom — Seg", time: "Fechado" }
];

export const Footer = () => {
  const [hours, setHours] = useState<any[]>(fallbackHours);

  useEffect(() => {
    const savedHours = localStorage.getItem('@salaorenovo:hours');
    if (savedHours) {
      setHours(JSON.parse(savedHours));
    }
  }, []);

  return (
    <footer id="contato" className="relative border-t border-border/60 bg-card/40 pt-20">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-primary/60">
                <span className="font-display text-lg text-primary">SR</span>
              </div>
              <span className="font-display text-xl tracking-[0.15em] uppercase">SALÃO RENOVO</span>
            </div>
            <p className="mt-5 max-w-md font-display text-2xl italic text-gold">
              Renovando sua beleza
            </p>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Um espaço dedicado à sua melhor versão. Tradição, técnica e cuidado em cada detalhe.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.25em] text-primary">Contato</h4>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>Avelino José Dias, Nova Brasília, Ribeirão do Largo - BA, 45155-000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>(77) 99126-1178</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@salaorenovo.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.25em] text-primary">Horário</h4>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {hours.map(h => (
                <li key={h.id} className="flex justify-between"><span>{h.day}</span><span>{h.time}</span></li>
              ))}
            </ul>
            <a
              href="https://www.instagram.com/salaorenovoo/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow"
            >
              <Instagram className="h-4 w-4" />
              @salaorenovoo
            </a>
          </div>
        </div>

        <div className="divider-gold my-12" />

        <div className="flex flex-col items-center justify-between gap-4 pb-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Salão Renovo. Todos os direitos reservados.</p>
          <p className="tracking-widest uppercase">Luxury experience</p>
        </div>
      </div>
    </footer>
  );
};
