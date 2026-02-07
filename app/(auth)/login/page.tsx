"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, AlertCircle, Lock, Mail } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    window.location.href = redirectTo;
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient tracking-tight mb-2">Power And Liberty</h1>
        <p className="text-sm text-text-muted">CRM Liberty</p>
      </div>

      {/* Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 glow-primary">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">Connexion</h2>
          <p className="text-sm text-text-muted mt-1">Connecte-toi pour accéder au dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/20">
              <AlertCircle className="h-4 w-4 text-danger flex-shrink-0" />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                type="email"
                placeholder="toi@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 font-bold text-base mt-2">
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connexion...</>
            ) : (
              <><LogIn className="mr-2 h-5 w-5" /> Se connecter</>
            )}
          </Button>
        </form>

        <p className="text-xs text-text-muted text-center mt-6">
          Pas de compte ? Contacte un administrateur.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
