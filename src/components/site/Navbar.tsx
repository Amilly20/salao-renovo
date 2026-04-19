import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "#home", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#vitrine", label: "Vitrine" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-primary/60 bg-background/40">
            <span className="font-display text-base text-primary">SR</span>
          </div>
          <span className="font-display text-lg tracking-[0.15em] text-foreground uppercase">
            SALÃO RENOVO
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button asChild variant="ghostGold" size="sm">
                <Link to="/agendamento"><User className="h-4 w-4" /> Minha conta</Link>
              </Button>
              <Button variant="outlineGold" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghostGold" size="sm">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild variant="luxe" size="default">
                <Link to="/agendamento">Agendar</Link>
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Menu"
          className="text-primary md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <ul className="container mx-auto flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2 space-y-2">
              {user ? (
                <>
                  <Button asChild variant="ghostGold" className="w-full">
                    <Link to="/agendamento" onClick={() => setOpen(false)}>Minha conta</Link>
                  </Button>
                  <Button variant="outlineGold" className="w-full" onClick={() => { signOut(); setOpen(false); }}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghostGold" className="w-full">
                    <Link to="/auth" onClick={() => setOpen(false)}>Entrar</Link>
                  </Button>
                  <Button asChild variant="luxe" className="w-full">
                    <Link to="/agendamento" onClick={() => setOpen(false)}>Agendar Horário</Link>
                  </Button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
