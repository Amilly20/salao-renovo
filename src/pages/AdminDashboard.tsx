import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBag,
  Users,
  LogOut,
  TrendingUp,
  DollarSign,
  CreditCard,
  Scissors,
  Plus,
  Image as ImageIcon,
  Trash2,
  Store,
  Settings
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estado para a galeria de fotos
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  
  // Estado para os Serviços e Produtos
  const [services, setServices] = useState<any[]>([]);
  const [isEditingService, setIsEditingService] = useState(false);
  const [editingSvcId, setEditingSvcId] = useState<string | null>(null);
  const [svcName, setSvcName] = useState("");
  const [svcPrice, setSvcPrice] = useState("");
  const [svcDuration, setSvcDuration] = useState("");
  const [svcImage, setSvcImage] = useState("");

  // Estado para a Vitrine de Produtos
  const [vitrine, setVitrine] = useState<any[]>([]);
  const [isEditingVitrine, setIsEditingVitrine] = useState(false);
  const [editingVitrineId, setEditingVitrineId] = useState<string | null>(null);
  const [vitrineName, setVitrineName] = useState("");
  const [vitrineBrand, setVitrineBrand] = useState("");
  const [vitrinePrice, setVitrinePrice] = useState("");
  const [vitrineImage, setVitrineImage] = useState("");
  const [vitrineStock, setVitrineStock] = useState("");
  const [vitrineDesc, setVitrineDesc] = useState("");

  // Estado para os Agendamentos
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [apptClientName, setApptClientName] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptService, setApptService] = useState("");

  // Estado para Clientes
  const [clients, setClients] = useState<any[]>([]);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientDebt, setNewClientDebt] = useState("");
  const [newClientServices, setNewClientServices] = useState("");

  // Estado para o Histórico de Trabalhos
  const [history, setHistory] = useState<any[]>([]);
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [newHistoryClient, setNewHistoryClient] = useState("");
  const [newHistoryService, setNewHistoryService] = useState("");
  const [newHistoryDate, setNewHistoryDate] = useState("");
  const [newHistoryValue, setNewHistoryValue] = useState("");

  // Estado para Configurações (Horários)
  const [businessHours, setBusinessHours] = useState<any[]>([]);

  useEffect(() => {
    const refs = [
      { path: 'salao/gallery', setter: setGalleryPhotos },
      { path: 'salao/services', setter: setServices },
      { path: 'salao/appointments', setter: setAppointments },
      { path: 'salao/clients', setter: setClients },
      { path: 'salao/history', setter: setHistory },
      { path: 'salao/vitrine', setter: setVitrine },
      { path: 'salao/hours', setter: setBusinessHours },
    ];

    const unsubscribes = refs.map(({ path, setter }) => {
      return onValue(ref(db, path), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Array.isArray(data) ? data : Object.values(data);
          setter(dataArray.filter(Boolean));
        } else {
          setter([]);
        }
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updated = [...galleryPhotos, base64String];
      
      try {
        setGalleryPhotos(updated);
        set(ref(db, 'salao/gallery'), updated);
        toast({ title: "Foto adicionada", description: "A foto já está aparecendo no site!" });
      } catch (err) {
        toast({ title: "Erro de armazenamento", description: "A imagem é muito pesada ou o espaço do navegador acabou.", variant: "destructive" });
      }
    };
    reader.readAsDataURL(file); // Converte a imagem para ser salva direto no navegador
  };

  // Handlers para Produtos/Serviços
  const handleSvcImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSvcImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startAddingService = () => {
    setEditingSvcId(null);
    setSvcName(""); setSvcPrice(""); setSvcDuration(""); setSvcImage("");
    setIsEditingService(true);
  };

  const startEditingService = (svc: any) => {
    setEditingSvcId(svc.id);
    setSvcName(svc.name); setSvcPrice(svc.price); setSvcDuration(svc.duration || ""); setSvcImage(svc.image || "");
    setIsEditingService(true);
  };

  const saveService = () => {
    if (!svcName || !svcPrice) return toast({ title: "Preencha o nome e o preço!", variant: "destructive" });
    
    let updated;
    if (editingSvcId) {
      updated = services.map(s => s.id === editingSvcId ? { ...s, name: svcName, price: svcPrice, duration: svcDuration, image: svcImage } : s);
    } else {
      updated = [...services, { id: Date.now().toString(), name: svcName, price: svcPrice, duration: svcDuration, image: svcImage }];
    }
    
    setServices(updated);
    set(ref(db, 'salao/services'), updated);
    setIsEditingService(false);
    toast({ title: "Serviço salvo com sucesso!" });
  };

  const deleteService = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço? Ele não aparecerá mais para as clientes.")) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      set(ref(db, 'salao/services'), updated);
      toast({ title: "Removido com sucesso!" });
    }
  };

  // Handlers para Vitrine
  const handleVitrineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setVitrineImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startAddingVitrine = () => {
    setEditingVitrineId(null);
    setVitrineName(""); setVitrineBrand(""); setVitrinePrice(""); setVitrineImage(""); setVitrineStock(""); setVitrineDesc("");
    setIsEditingVitrine(true);
  };

  const startEditingVitrine = (prod: any) => {
    setEditingVitrineId(prod.id);
    setVitrineName(prod.name); setVitrineBrand(prod.brand || ""); setVitrinePrice(prod.price); setVitrineImage(prod.image || ""); setVitrineStock(prod.stock || ""); setVitrineDesc(prod.description || "");
    setIsEditingVitrine(true);
  };

  const saveVitrine = () => {
    if (!vitrineName || !vitrinePrice) return toast({ title: "Preencha o nome e o preço!", variant: "destructive" });
    let updated;
    if (editingVitrineId) {
      updated = vitrine.map(p => p.id === editingVitrineId ? { ...p, name: vitrineName, brand: vitrineBrand, price: vitrinePrice, image: vitrineImage, stock: vitrineStock, description: vitrineDesc } : p);
    } else {
      updated = [...vitrine, { id: Date.now().toString(), name: vitrineName, brand: vitrineBrand, price: vitrinePrice, image: vitrineImage, stock: vitrineStock, description: vitrineDesc }];
    }
    setVitrine(updated);
    set(ref(db, 'salao/vitrine'), updated);
    setIsEditingVitrine(false);
    toast({ title: "Produto salvo na Vitrine!" });
  };

  const deleteVitrine = (id: string) => {
    if (window.confirm("Excluir este produto da Vitrine?")) {
      const updated = vitrine.filter(p => p.id !== id);
      setVitrine(updated);
      set(ref(db, 'salao/vitrine'), updated);
      toast({ title: "Produto removido!" });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = galleryPhotos.filter((_, i) => i !== index);
    setGalleryPhotos(updated);
    set(ref(db, 'salao/gallery'), updated);
    toast({ title: "Foto removida" });
  };

  // Handlers para Agendamentos
  const handleSaveAppointment = () => {
    if (!apptClientName || !apptDate || !apptTime || !apptService) {
      return toast({ title: "Atenção", description: "Preencha todos os campos do agendamento!", variant: "destructive" });
    }
    
    const newAppt = {
      id: Date.now().toString(),
      clientName: apptClientName,
      date: apptDate,
      time: apptTime,
      service: apptService,
    };
    
    const updated = [...appointments, newAppt];
    setAppointments(updated);
    set(ref(db, 'salao/appointments'), updated);
    
    setIsAddingAppointment(false);
    setApptClientName(""); setApptDate(""); setApptTime(""); setApptService("");
    toast({ title: "Agendamento marcado com sucesso!" });
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm("Deseja cancelar e apagar este agendamento?")) {
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      set(ref(db, 'salao/appointments'), updated);
      toast({ title: "Agendamento cancelado!" });
    }
  };

  // Handlers para Clientes e Histórico
  const handleAddClient = () => {
    if (!newClientName) return toast({ title: "Atenção", description: "O nome é obrigatório!", variant: "destructive" });
    const updated = [...clients, {
      id: Date.now().toString(),
      name: newClientName,
      phone: newClientPhone,
      debt: newClientDebt || "0,00",
      services: newClientServices ? newClientServices.split(',').map(s => s.trim()) : []
    }];
    setClients(updated);
    set(ref(db, 'salao/clients'), updated);
    setIsAddingClient(false);
    setNewClientName(""); setNewClientPhone(""); setNewClientDebt(""); setNewClientServices("");
    toast({ title: "Cliente adicionado!" });
  };

  const handleAddHistory = () => {
    if (!newHistoryClient || !newHistoryService || !newHistoryDate || !newHistoryValue) {
      return toast({ title: "Atenção", description: "Preencha todos os campos do histórico!", variant: "destructive" });
    }
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const [year, month, day] = newHistoryDate.split('-');
    const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
    const formattedDate = `${day}/${month}/${year}`;
    
    const newItem = { id: Date.now().toString(), client: newHistoryClient, service: newHistoryService, date: formattedDate, value: newHistoryValue };
    let updated = [...history];
    const monthIndex = updated.findIndex(h => h.month === monthLabel);
    
    if (monthIndex >= 0) updated[monthIndex].items.unshift(newItem);
    else updated.unshift({ month: monthLabel, items: [newItem] });
    
    setHistory(updated);
    set(ref(db, 'salao/history'), updated);
    setIsAddingHistory(false);
    setNewHistoryClient(""); setNewHistoryService(""); setNewHistoryDate(""); setNewHistoryValue("");
    toast({ title: "Trabalho salvo no histórico!" });
  };

  const handleMarkAsPaid = (id: string) => {
    const updated = clients.map(c => c.id === id ? { ...c, debt: "0,00" } : c);
    setClients(updated);
    set(ref(db, 'salao/clients'), updated);
    toast({ title: "Dívida quitada", description: "O cliente não deve mais nada!" });
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
      set(ref(db, 'salao/clients'), updated);
      toast({ title: "Cliente removido!" });
    }
  };

  const handleDeleteHistory = (monthIndex: number, itemId: string) => {
    if (window.confirm("Apagar este registro do histórico?")) {
      const updated = [...history];
      updated[monthIndex].items = updated[monthIndex].items.filter((i: any) => i.id !== itemId);
      if (updated[monthIndex].items.length === 0) updated.splice(monthIndex, 1);
      setHistory(updated);
      set(ref(db, 'salao/history'), updated);
      toast({ title: "Registro apagado!" });
    }
  };

  const handleLogout = () => {
    toast({ title: "Sessão encerrada", description: "Você saiu do painel administrativo." });
    navigate("/auth");
  };

  // Cálculos Automáticos do Resumo
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const now = new Date();
  const currentMonthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  
  const currentMonthData = history.find(h => h.month === currentMonthLabel);
  const currentRevenue = currentMonthData?.items.reduce((acc: number, item: any) => {
    const val = parseFloat(item.value.replace(/\./g, '').replace(',', '.'));
    return acc + (isNaN(val) ? 0 : val);
  }, 0) || 0;

  const totalDebt = clients.reduce((acc: number, client: any) => {
    const val = parseFloat(client.debt.replace(/\./g, '').replace(',', '.'));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const debtorsCount = clients.filter(c => {
    const val = parseFloat(c.debt.replace(/\./g, '').replace(',', '.'));
    return !isNaN(val) && val > 0;
  }).length;

  const todayStr = now.toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr).length;
  const recentActivity = history.flatMap(h => h.items).slice(0, 5);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Barra de Navegação Superior */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-xl font-bold text-primary">Painel da Chefe</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 w-full lg:w-[950px] h-auto p-1 bg-background border shadow-sm">
            <TabsTrigger value="visao-geral" className="py-2.5 flex gap-2"><TrendingUp className="w-4 h-4 hidden sm:block"/> Resumo</TabsTrigger>
            <TabsTrigger value="agendamentos" className="py-2.5 flex gap-2"><CalendarDays className="w-4 h-4 hidden sm:block"/> Agendamentos</TabsTrigger>
            <TabsTrigger value="produtos" className="py-2.5 flex gap-2"><ShoppingBag className="w-4 h-4 hidden sm:block"/> Serviços</TabsTrigger>
            <TabsTrigger value="vitrine" className="py-2.5 flex gap-2"><Store className="w-4 h-4 hidden sm:block"/> Vitrine</TabsTrigger>
            <TabsTrigger value="clientes" className="py-2.5 flex gap-2"><Users className="w-4 h-4 hidden sm:block"/> Clientes</TabsTrigger>
            <TabsTrigger value="galeria" className="py-2.5 flex gap-2"><ImageIcon className="w-4 h-4 hidden sm:block"/> Galeria</TabsTrigger>
            <TabsTrigger value="config" className="py-2.5 flex gap-2"><Settings className="w-4 h-4 hidden sm:block"/> Ajustes</TabsTrigger>
          </TabsList>

          {/* ABA: VISÃO GERAL */}
          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento ({monthNames[now.getMonth()]})</CardTitle>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{currentRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-emerald-500 font-medium mt-1">Atualizado automaticamente</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Agendamentos Pendentes</CardTitle>
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{appointments.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">{todayAppointments} agendamento(s) para hoje</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">A Receber (Fiado/Devedores)</CardTitle>
                  <CreditCard className="w-4 h-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totalDebt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">De {debtorsCount} cliente(s)</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Últimas Movimentações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? recentActivity.map((act: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{act.client} <span className="text-muted-foreground font-normal text-sm">- {act.service}</span></p>
                        <p className="text-sm text-muted-foreground">{act.date}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">+ R$ {act.value}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">Nenhuma movimentação recente registrada no histórico.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: AGENDAMENTOS */}
          <TabsContent value="agendamentos" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Agendamentos</CardTitle>
                  <CardDescription>Visualize quem marcou pelo site ou adicione manualmente.</CardDescription>
                </div>
                {!isAddingAppointment && (
                  <Button size="sm" onClick={() => setIsAddingAppointment(true)}><Plus className="w-4 h-4 mr-1"/> Novo Agendamento</Button>
                )}
              </CardHeader>
              <CardContent>
                {isAddingAppointment ? (
                  <div className="bg-muted/50 p-4 rounded-lg border space-y-4 mb-6">
                    <h4 className="font-bold text-primary">Novo Agendamento Manual</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>Nome da Cliente</Label><Input value={apptClientName} onChange={e => setApptClientName(e.target.value)} placeholder="Ex: Maria Silva" /></div>
                      <div className="space-y-1"><Label>Data</Label><Input type="date" value={apptDate} onChange={e => setApptDate(e.target.value)} /></div>
                      <div className="space-y-1"><Label>Horário</Label><Input type="time" value={apptTime} onChange={e => setApptTime(e.target.value)} /></div>
                      <div className="space-y-1">
                        <Label>Serviço</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={apptService} onChange={e => setApptService(e.target.value)}>
                          <option value="">Selecione um serviço</option>
                          {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-border/50">
                      <Button variant="outline" onClick={() => setIsAddingAppointment(false)}>Cancelar</Button>
                      <Button onClick={handleSaveAppointment}>Salvar Agendamento</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.length > 0 ? appointments.map(appt => (
                      <div key={appt.id} className="flex items-center justify-between bg-background border p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          {appt.clientPhoto && (
                            <img src={appt.clientPhoto} alt="Referência" className="w-12 h-12 rounded-md object-cover border shrink-0" />
                          )}
                          <div>
                            <p className="font-bold text-foreground">{appt.clientName} <span className="text-muted-foreground font-normal text-sm hidden sm:inline-block">- {appt.service}</span></p>
                            <p className="text-sm text-primary font-medium">{appt.date.split('-').reverse().join('/')} às {appt.time} <span className="text-muted-foreground font-normal sm:hidden">- {appt.service}</span></p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDeleteAppointment(appt.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">Nenhum agendamento marcado ainda.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: PRODUTOS E PREÇOS */}
          <TabsContent value="produtos" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Editar Serviços e Preços</CardTitle>
                  <CardDescription>Cadastre cortes, tratamentos ou produtos que você vende no salão.</CardDescription>
                </div>
                {!isEditingService && (
                  <Button size="sm" onClick={startAddingService}><Plus className="w-4 h-4 mr-1"/> Adicionar Serviço</Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* FORMULÁRIO DE ADICIONAR / EDITAR */}
                {isEditingService && (
                  <div className="bg-muted/50 p-4 rounded-lg border space-y-4 mb-6">
                    <h4 className="font-bold text-primary">{editingSvcId ? 'Editar Serviço' : 'Novo Serviço'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>Nome do Serviço/Produto</Label><Input value={svcName} onChange={(e) => setSvcName(e.target.value)} placeholder="Ex: Coloração ou Shampoo" /></div>
                      <div className="space-y-1"><Label>Preço (R$)</Label><Input value={svcPrice} onChange={(e) => setSvcPrice(e.target.value)} placeholder="Ex: 150,00" /></div>
                      <div className="space-y-1"><Label>Duração (opcional)</Label><Input value={svcDuration} onChange={(e) => setSvcDuration(e.target.value)} placeholder="Ex: 120 min" /></div>
                      <div className="space-y-1">
                        <Label>Foto (opcional)</Label>
                        <Label htmlFor="svc-image-upload" className="cursor-pointer bg-background border border-input hover:bg-muted px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors h-10">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          {svcImage ? "Trocar Foto" : "Escolher do Celular"}
                        </Label>
                        <input id="svc-image-upload" type="file" accept="image/*" className="hidden" onChange={handleSvcImageUpload} />
                      </div>
                    </div>
                    {svcImage && (
                      <div className="mt-2 relative w-24 h-24 rounded-md overflow-hidden border">
                        <img src={svcImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-border/50">
                      <Button variant="outline" onClick={() => setIsEditingService(false)}>Cancelar</Button>
                      <Button onClick={saveService}>Salvar Alterações</Button>
                    </div>
                  </div>
                )}

                {/* LISTA DOS SERVIÇOS CADASTRADOS */}
                {!isEditingService && (
                  <div className="space-y-3">
                    {services.map(svc => (
                      <div key={svc.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-background border p-4 rounded-lg gap-4">
                        <div className="flex gap-4 items-center">
                          {svc.image ? (
                            <img src={svc.image} alt={svc.name} className="w-12 h-12 rounded-md object-cover border" />
                          ) : (
                            <div className="bg-primary/10 p-3 rounded-full shrink-0"><Scissors className="w-5 h-5 text-primary" /></div>
                          )}
                          <div>
                            <p className="font-bold text-foreground">{svc.name}</p>
                            {svc.duration && <p className="text-sm text-muted-foreground">Duração: {svc.duration}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg whitespace-nowrap">R$ {svc.price}</span>
                          <Button variant="outline" size="sm" onClick={() => startEditingService(svc)}>Editar</Button>
                          <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => deleteService(svc.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {services.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum serviço cadastrado ainda.</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: VITRINE DE PRODUTOS */}
          <TabsContent value="vitrine" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sua Vitrine de Produtos</CardTitle>
                  <CardDescription>Cadastre Natura, Boticário, Tupperware ou produtos capilares.</CardDescription>
                </div>
                {!isEditingVitrine && (
                  <Button size="sm" onClick={startAddingVitrine}><Plus className="w-4 h-4 mr-1"/> Adicionar Produto</Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingVitrine && (
                  <div className="bg-muted/50 p-4 rounded-lg border space-y-4 mb-6">
                    <h4 className="font-bold text-primary">{editingVitrineId ? 'Editar Produto' : 'Novo Produto'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>Nome do Produto</Label><Input value={vitrineName} onChange={(e) => setVitrineName(e.target.value)} placeholder="Ex: Perfume Lily ou Garrafa 500ml" /></div>
                      <div className="space-y-1"><Label>Marca (Opcional)</Label><Input value={vitrineBrand} onChange={(e) => setVitrineBrand(e.target.value)} placeholder="Ex: O Boticário, Tupperware, Natura" /></div>
                      <div className="space-y-1"><Label>Preço (R$)</Label><Input value={vitrinePrice} onChange={(e) => setVitrinePrice(e.target.value)} placeholder="Ex: 89,90" /></div>
                      <div className="space-y-1"><Label>Quantidade em Estoque</Label><Input type="number" value={vitrineStock} onChange={(e) => setVitrineStock(e.target.value)} placeholder="Ex: 5" /></div>
                      <div className="space-y-1"><Label>Descrição (Opcional)</Label><Input value={vitrineDesc} onChange={(e) => setVitrineDesc(e.target.value)} placeholder="Detalhes do produto..." /></div>
                      <div className="space-y-1">
                        <Label>Foto do Produto</Label>
                        <Label htmlFor="vitrine-image-upload" className="cursor-pointer bg-background border border-input hover:bg-muted px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors h-10">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          {vitrineImage ? "Trocar Foto" : "Tirar Foto / Galeria"}
                        </Label>
                        <input id="vitrine-image-upload" type="file" accept="image/*" className="hidden" onChange={handleVitrineImageUpload} />
                      </div>
                    </div>
                    {vitrineImage && (
                      <div className="mt-2 relative w-24 h-24 rounded-md overflow-hidden border bg-white">
                        <img src={vitrineImage} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-border/50">
                      <Button variant="outline" onClick={() => setIsEditingVitrine(false)}>Cancelar</Button>
                      <Button onClick={saveVitrine}>Salvar Produto</Button>
                    </div>
                  </div>
                )}
                {!isEditingVitrine && (
                  <div className="space-y-3">
                    {vitrine.map(prod => (
                      <div key={prod.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-background border p-4 rounded-lg gap-4">
                        <div className="flex gap-4 items-center">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-md object-contain border bg-white" />
                          ) : (
                            <div className="bg-primary/10 p-3 rounded-full shrink-0"><Store className="w-5 h-5 text-primary" /></div>
                          )}
                          <div>
                            <p className="font-bold text-foreground">{prod.name}</p>
                            <p className="text-sm text-muted-foreground flex gap-2">
                              {prod.brand && <span>Marca: {prod.brand}</span>}
                              {prod.stock && <span className="font-medium text-primary">| Estoque: {prod.stock} un.</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg whitespace-nowrap text-emerald-600">R$ {prod.price}</span>
                          <Button variant="outline" size="sm" onClick={() => startEditingVitrine(prod)}>Editar</Button>
                          <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => deleteVitrine(prod.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {vitrine.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum produto cadastrado na vitrine ainda.</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: CLIENTES E DEVEDORES */}
          <TabsContent value="clientes" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle>Controle de Clientes e Fiados</CardTitle>
                  <CardDescription>Saiba quem são seus melhores clientes e quem esqueceu de pagar.</CardDescription>
                </div>
                {!isAddingClient && <Button size="sm" onClick={() => setIsAddingClient(true)}><Plus className="w-4 h-4 mr-1" /> Novo Cliente</Button>}
              </CardHeader>
              <CardContent>
                {isAddingClient && (
                  <div className="bg-muted/50 p-4 rounded-lg border space-y-4 mb-6">
                    <h4 className="font-bold text-primary">Adicionar Cliente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>Nome</Label><Input value={newClientName} onChange={e => setNewClientName(e.target.value)} placeholder="Ex: Ana Silva" /></div>
                      <div className="space-y-1"><Label>Telefone</Label><Input value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} placeholder="Ex: (11) 99999-9999" /></div>
                      <div className="space-y-1"><Label>Serviços Recorrentes</Label><Input value={newClientServices} onChange={e => setNewClientServices(e.target.value)} placeholder="Ex: Corte, Coloração" /></div>
                      <div className="space-y-1"><Label>Está devendo? (R$)</Label><Input value={newClientDebt} onChange={e => setNewClientDebt(e.target.value)} placeholder="Ex: 50,00 (Deixe em branco se não dever)" /></div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-border/50">
                      <Button variant="outline" onClick={() => setIsAddingClient(false)}>Cancelar</Button>
                      <Button onClick={handleAddClient}>Salvar Cliente</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {clients.map(client => (
                    <div key={client.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-bold">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.phone}</p>
                        <p className="text-xs text-primary mt-1">Serviços feitos: {client.services.join(", ")}</p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          {client.debt !== "0,00" ? (
                            <>
                              <p className="font-bold text-destructive">Deve: R$ {client.debt}</p>
                              <Button variant="link" size="sm" className="h-auto p-0 text-blue-500" onClick={() => handleMarkAsPaid(client.id)}>Marcar como Pago</Button>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-muted-foreground">Tudo certo</p>
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Cliente Ouro</span>
                            </>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {clients.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum cliente cadastrado.</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle>Histórico de Trabalhos</CardTitle>
                  <CardDescription>Seus serviços prestados salvos e divididos por mês.</CardDescription>
                </div>
                {!isAddingHistory && <Button size="sm" onClick={() => setIsAddingHistory(true)}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>}
              </CardHeader>
              <CardContent>
                {isAddingHistory && (
                  <div className="bg-muted/50 p-4 rounded-lg border space-y-4 mb-6">
                    <h4 className="font-bold text-primary">Registrar Serviço Concluído</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>Nome da Cliente</Label><Input value={newHistoryClient} onChange={e => setNewHistoryClient(e.target.value)} placeholder="Ex: Juliana" /></div>
                      <div className="space-y-1"><Label>Data</Label><Input type="date" value={newHistoryDate} onChange={e => setNewHistoryDate(e.target.value)} /></div>
                      <div className="space-y-1"><Label>Serviço Realizado</Label><Input value={newHistoryService} onChange={e => setNewHistoryService(e.target.value)} placeholder="Ex: Luzes e Corte" /></div>
                      <div className="space-y-1"><Label>Valor Cobrado (R$)</Label><Input value={newHistoryValue} onChange={e => setNewHistoryValue(e.target.value)} placeholder="Ex: 250,00" /></div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-border/50">
                      <Button variant="outline" onClick={() => setIsAddingHistory(false)}>Cancelar</Button>
                      <Button onClick={handleAddHistory}>Salvar Histórico</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  {history.map((monthGroup, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="font-bold border-b pb-1 text-primary uppercase text-sm tracking-wider">{monthGroup.month}</h4>
                      {monthGroup.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{item.client} <span className="text-muted-foreground font-normal text-sm">- {item.service}</span></p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-emerald-600">+ R$ {item.value}</span>
                            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDeleteHistory(idx, item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {history.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum histórico encontrado.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: GALERIA */}
          <TabsContent value="galeria" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fotos dos Trabalhos (Carrossel)</CardTitle>
                <CardDescription>Adicione ou remova as fotos que aparecem na seção "Nossos Trabalhos" do site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 items-start">
                  <Label htmlFor="picture-upload" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-md flex items-center gap-2 font-medium transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    Escolher do Celular / Computador
                  </Label>
                  <input
                    id="picture-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {galleryPhotos.map((foto, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border bg-muted/30">
                      <img src={foto} alt={`Galeria ${index}`} className="w-full h-32 object-cover" />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {galleryPhotos.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                      Nenhuma foto na galeria. Adicione a primeira!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: AJUSTES / HORÁRIOS */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Salão</CardTitle>
                <CardDescription>Altere os horários de funcionamento que aparecem no rodapé do site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessHours.map((bh, idx) => (
                  <div key={bh.id} className="flex gap-4 items-start bg-muted/30 p-3 rounded-lg border">
                    <div className="flex-1 space-y-1">
                      <Label>Dias da Semana</Label>
                      <Input value={bh.day} onChange={e => {
                        const newBh = [...businessHours];
                        newBh[idx].day = e.target.value;
                        setBusinessHours(newBh);
                      }} placeholder="Ex: Ter — Sex" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label>Horário</Label>
                      <Input value={bh.time} onChange={e => {
                        const newBh = [...businessHours];
                        newBh[idx].time = e.target.value;
                        setBusinessHours(newBh);
                      }} placeholder="Ex: 09h — 20h" />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive mt-6 shrink-0" onClick={() => {
                      setBusinessHours(businessHours.filter((_, i) => i !== idx));
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-4 pt-2 border-t border-border/50 justify-end">
                  <Button variant="outline" onClick={() => setBusinessHours([...businessHours, { id: Date.now().toString(), day: "", time: "" }])}>+ Linha de Horário</Button>
                  <Button onClick={() => {
                    set(ref(db, 'salao/hours'), businessHours);
                    toast({ title: "Horários atualizados no site!" });
                  }}>Salvar Horários</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;