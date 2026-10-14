import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2, Lock, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type RoleState = "checking" | "staff" | "none";

/** Muestra el contenido solo a usuarios con rol admin o asesor (tabla user_roles). */
const StaffGate = ({ children }: { children: (session: Session, signOut: () => void) => ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [role, setRole] = useState<RoleState>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setRole("checking");
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        const ok = !err && (data ?? []).some((r) => r.role === "admin" || r.role === "asesor");
        setRole(ok ? "staff" : "none");
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signOut = () => {
    supabase.auth.signOut();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSubmitting(false);
    if (err) setError("Correo o contraseña incorrectos.");
  };

  if (session === undefined || (session && role === "checking")) {
    return (
      <div className="flex justify-center py-20" role="status" aria-label="Verificando acceso">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle>Acceso del equipo</CardTitle>
          <CardDescription>Inicia sesión con tu cuenta de GB Travel para administrar el catálogo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="staff-email">Correo</Label>
              <Input
                id="staff-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-password">Contraseña</Label>
              <Input
                id="staff-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (role === "none") {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
          <CardTitle>Sin permisos</CardTitle>
          <CardDescription>
            Tu cuenta ({session.user.email}) no tiene rol de admin o asesor. Pide a un administrador que te asigne
            un rol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children(session, signOut)}</>;
};

export default StaffGate;
