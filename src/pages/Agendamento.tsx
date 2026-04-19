import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { ref, onValue, get, set } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Calendar as CalendarIcon, Clock, Image as ImageIcon } from "lucide-react";

// Horários de exemplo
const horariosDisponiveis = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const Agendamento = () => {
  const { user } = useAuth(); // Pega o usuário logado
  const navigate = useNavigate();
  const { toast } = useToast();

  const [servicosDisponiveis, setServicosDisponiveis] = useState<any[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [clienteNome, setClienteNome] = useState(user?.email?.split('@')[0] || "");
  const [clienteWhatsapp, setClienteWhatsapp] = useState("");
  const [clienteFoto, setClienteFoto] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setClienteFoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'salao/services'), (snapshot) => {
      if (snapshot.exists()) {
        const parsed = snapshot.val() || [];
        setServicosDisponiveis(parsed.map((s: any) => ({
          id: s.id,
          nome: s.name,
          preco: s.price.includes('R$') ? s.price : `R$ ${s.price}`,
          duracao: s.duration,
          image: s.image
        })));
      } else setServicosDisponiveis([]);
    });
    return () => unsubscribe();
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

    if (!servicoSelecionado || !dataSelecionada || !horarioSelecionado || !clienteNome || !clienteWhatsapp) {
      toast({
        title: "Faltam informações",
        description: "Por favor, preencha seu nome, WhatsApp, selecione o serviço, a data e o horário.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Pega o nome do serviço para salvar no painel da Adm
    const servicoObj = servicosDisponiveis.find(s => s.id === servicoSelecionado);
    const servicoNome = servicoObj ? servicoObj.nome : "Serviço";

    try {
      // Salvando de verdade para aparecer no Painel da Chefe
      const apptsRef = ref(db, 'salao/appointments');
      const snapshot = await get(apptsRef);
      
      let savedAppts: any[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Garante que seja sempre um array (o Firebase às vezes converte listas em objetos)
        savedAppts = Array.isArray(data) ? data : Object.values(data);
        savedAppts = savedAppts.filter(Boolean);
      }
  
      const newAppt = {
        id: Date.now().toString(),
        clientName: clienteNome,
        date: dataSelecionada,
        time: horarioSelecionado,
        service: servicoNome,
        clientWhatsapp: clienteWhatsapp,
        clientPhoto: clienteFoto
      };
      await set(apptsRef, [...savedAppts, newAppt]);
  
      setLoading(false);
      toast({
        title: "Agendamento Confirmado! 🎉",
        description: `Seu horário foi marcado para ${dataSelecionada.split('-').reverse().join('/')} às ${horarioSelecionado}.`,
      });
      navigate("/"); // Volta para a página inicial após o sucesso
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Erro ao salvar",
        description: "Verifique se as Regras do Firebase estão liberadas!",
        variant: "destructive",
      });
    }
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
            {servicosDisponiveis.length > 0 ? (
              servicosDisponiveis.map((servico) => (
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
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-4">Nenhum serviço disponível no momento.</p>
            )}
          </CardContent>
        </Card>

        <form onSubmit={handleAgendar} className="space-y-8">
          <Card className="border-primary/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarIcon className="w-5 h-5 text-primary" />
              2. Seus Dados, Data e Horário
              </CardTitle>
              <CardDescription>Para quando deseja agendar?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="nome">Seu Nome / Apelido</Label>
              <input
                type="text"
                id="nome"
                placeholder="Como devemos te chamar?"
                className="flex h-10 w-full md:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="whatsapp">WhatsApp para contato</Label>
              <input
                type="tel"
                id="whatsapp"
                placeholder="(00) 90000-0000"
                className="flex h-10 w-full md:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={clienteWhatsapp}
                onChange={(e) => setClienteWhatsapp(e.target.value)}
              />
            </div>

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

            <div className="space-y-3 border-t border-border/50 pt-6">
              <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Foto de Referência (Opcional)</Label>
              <p className="text-sm text-muted-foreground">Viu algum corte ou cor que gostou? Mande a foto para nós!</p>
              <div className="flex items-center gap-4">
                <Label htmlFor="client-photo-upload" className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium transition-colors text-sm">
                  {clienteFoto ? "Trocar Foto" : "Escolher Imagem"}
                </Label>
                <input
                  id="client-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                {clienteFoto && <img src={clienteFoto} alt="Preview" className="w-12 h-12 object-cover rounded-md border" />}
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