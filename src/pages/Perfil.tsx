import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { updateProfile, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Lock, Camera, Mail } from "lucide-react";

const Perfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      setDisplayName(user.displayName || user.email?.split('@')[0] || "");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setLoading(true);
        // Salva a foto na conta do Firebase da pessoa
        await updateProfile(user, { photoURL: reader.result as string });
        toast({ title: "Foto atualizada com sucesso!" });
      } catch (error: any) {
        toast({ title: "Erro ao atualizar foto", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateProfile(user, { displayName });
      toast({ title: "Perfil atualizado!" });
    } catch (error: any) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) return toast({ title: "A senha deve ter pelo menos 6 caracteres", variant: "destructive" });
    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      setNewPassword("");
      toast({ title: "Senha alterada com sucesso!" });
    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/requires-recent-login') {
        msg = "Por segurança, você precisa sair e fazer login novamente para conseguir alterar a senha.";
      }
      toast({ title: "Erro ao alterar senha", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user.email) return;
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, user.email);
      toast({ title: "Email enviado!", description: "Verifique sua caixa de entrada para redefinir a senha." });
    } catch (error: any) {
      toast({ title: "Erro ao enviar email", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-24 px-4 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-primary">Minha Conta</h1>
          <p className="text-muted-foreground">Gerencie suas informações e segurança.</p>
        </div>

        <Card className="border-primary/20 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><UserIcon className="w-5 h-5 text-primary" /> Perfil Público</CardTitle>
            <CardDescription>Como você aparece no salão.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative h-24 w-24 rounded-full border-4 border-primary/20 overflow-hidden bg-muted flex items-center justify-center shrink-0">
                {user.photoURL ? <img src={user.photoURL} alt="Perfil" className="h-full w-full object-cover" /> : <UserIcon className="h-10 w-10 text-primary/40" />}
              </div>
              <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                <Label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium transition-colors text-sm">
                  <Camera className="w-4 h-4" /> Mudar Foto
                </Label>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={loading} />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="nome">Nome de Exibição</Label>
              <div className="flex gap-2">
                <Input id="nome" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <Button onClick={handleUpdateProfile} disabled={loading}>Salvar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Lock className="w-5 h-5 text-primary" /> Segurança</CardTitle>
            <CardDescription>Gerencie sua senha de acesso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Email da Conta</Label>
              <Input value={user.email || ""} disabled className="bg-muted opacity-70" />
            </div>
            <div className="border-t border-border/50 pt-6 space-y-4">
              <h4 className="font-medium text-sm text-foreground">Alterar Senha</h4>
              <div className="space-y-3">
                <Label htmlFor="new-pwd">Nova Senha (mínimo 6 caracteres)</Label>
                <div className="flex gap-2">
                  <Input id="new-pwd" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Digite a nova senha" />
                  <Button onClick={handleUpdatePassword} disabled={loading || !newPassword}>Atualizar</Button>
                </div>
              </div>
            </div>
            <div className="border-t border-border/50 pt-6">
              <h4 className="font-medium text-sm text-foreground mb-2">Esqueceu a senha?</h4>
              <p className="text-sm text-muted-foreground mb-4">Enviaremos um link para o seu email para você cadastrar uma nova senha (ideal se você não usa o Google).</p>
              <Button variant="outline" onClick={handleResetPassword} disabled={loading}>
                <Mail className="w-4 h-4 mr-2" /> Enviar Email de Recuperação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Perfil;