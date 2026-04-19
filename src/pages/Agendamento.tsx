import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Calendar as CalendarIcon, Clock } from "lucide-react";

// Lista de fallback caso a adm ainda não tenha cadastrado nada
const fallbackServicos = [
  { id: "corte-fem", nome: "Corte Feminino", preco: "R$ 80,00", duracao: "60 min" },
  { id: "coloracao", nome: "Coloração", preco: "R$ 150,00", duracao: "120 min" },
];

// Horários de exemplo
const horariosDisponiveis = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const Agendamento = () => {
  const { user } = useAuth(); // Pega o usuário logado
  const navigate = useNavigate();
  const { toast } = useToast();

  const [servicosDisponiveis, setServicosDisponiveis] = useState<any[]>(fallbackServicos);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Busca os serviços que a adm cadastrou no painel
    const saved = localStorage.getItem('@salaorenovo:services');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setServicosDisponiveis(parsed.map((s: any) => ({
          id: s.id,
          nome: s.name,
          preco: s.price.includes('R$') ? s.price : `R$ ${s.price}`,
          duracao: s.duration,
          image: s.image
        })));
      }
    }
  }, []);

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se não estiver logado, manda para a tela de login
    if (!user) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa fazer login para agendar um horário.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!servicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      toast({
        title: "Faltam informações",
        description: "Por favor, selecione o serviço, a data e o horário desejado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulação de salvamento no banco de dados
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Agendamento Confirmado! 🎉",
        description: `Seu horário foi marcado para ${dataSelecionada.split('-').reverse().join('/')} às ${horarioSelecionado}.`,
      });
      navigate("/"); // Volta para a página inicial após o sucesso
    }, 1500);
  };

  return (
    <main className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-primary">Agende seu Horário</h1>
          <p className="text-muted-foreground">Escolha o serviço e o melhor momento para você ser atendida.</p>
        </div>

        <Card className="border-primary/20 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Scissors className="w-5 h-5 text-primary" />
              1. Escolha o Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicosDisponiveis.map((servico) => (
              <button
                key={servico.id}
                type="button"
                onClick={() => setServicoSelecionado(servico.id)}
                className={`p-4 rounded-xl border-2 text-left flex gap-4 transition-all duration-200 ${
                  servicoSelecionado === servico.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                {servico.image && (
                  <img src={servico.image} alt={servico.nome} className="w-16 h-16 rounded-md object-cover border shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">{servico.nome}</div>
                  <div className="text-sm text-muted-foreground flex flex-col mt-1">
                    <span className="font-medium text-primary">{servico.preco}</span>
                    {servico.duracao && <span>~ {servico.duracao}</span>}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <form onSubmit={handleAgendar} className="space-y-8">
          <Card className="border-primary/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarIcon className="w-5 h-5 text-primary" />
                2. Data e Horário
              </CardTitle>
              <CardDescription>Para quando deseja agendar?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="data">Data Desejada</Label>
                <input
                  type="date"
                  id="data"
                  min={new Date().toISOString().split("T")[0]} // Impede datas passadas
                  className="flex h-10 w-full md:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2"><Clock className="w-4 h-4" /> Horários Disponíveis</Label>
                <div className="flex flex-wrap gap-3">
                  {horariosDisponiveis.map((horario) => (
                    <button key={horario} type="button" onClick={() => setHorarioSelecionado(horario)}
                      className={`px-4 py-2 rounded-lg border font-medium transition-all ${horarioSelecionado === horario ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-foreground"}`}>
                      {horario}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={loading}>
            {loading ? "Confirmando..." : "Confirmar Agendamento"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Agendamento;