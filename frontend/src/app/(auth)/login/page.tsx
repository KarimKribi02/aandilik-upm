"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock,
  ChevronLeft,
  Loader2,
  Clock,
  CheckCircle2,
  Wrench
} from "lucide-react";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const { login } = useData();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        showToast("Ravi de vous revoir sur Aandilik.", "success");
        const token = localStorage.getItem("aandilik_token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = (payload.role || "").toLowerCase();
            if (role.includes('admin')) {
              router.push("/dashboard/admin");
            } else {
              router.push("/dashboard/owner");
            }
          } catch {
            router.push("/dashboard/owner");
          }
        } else {
          router.push("/dashboard/owner");
        }
      } else {
        showToast("Identifiants incorrects.", "error");
        setError("Email ou mot de passe invalide.");
        setLoading(false);
      }
    } catch (err) {
      showToast("Erreur de connexion.", "error");
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* Left Column — Visual / Abstract Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 relative overflow-hidden items-center justify-center p-16">
        
        {/* Subtle grid blueprint mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f7941d]/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Soft floating blur circles */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-[#f7941d]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full flex flex-col justify-between h-full">
          
          {/* Logo Header */}
          <div>
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img 
                src="/aandilik.png" 
                alt="AANDILIK Logo" 
                className="h-11 w-auto object-contain brightness-0 invert" 
              />
            </Link>
          </div>

          {/* Core Content */}
          <div className="my-auto py-12">
            <span className="text-[10px] font-black tracking-widest text-[#f7941d] uppercase bg-[#f7941d]/10 px-3.5 py-1.5 rounded-full inline-block mb-6">
              ACCÈS PARTENAIRE & CLIENT
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
              Gérez vos chantiers et votre flotte en <span className="text-[#f7941d]">temps réel.</span>
            </h2>
            <p className="text-slate-400 text-sm font-semibold leading-relaxed mb-8">
              Accédez à la plateforme de référence au Maroc pour la location d&apos;engins lourds et la gestion logistique de vos opérations.
            </p>

            {/* Micro-badges for trust factor */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-[#f7941d]/10 border border-[#f7941d]/20 flex items-center justify-center text-[#f7941d] shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">100% Paiement Sécurisé</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Transactions sécurisées et garanties bancaires.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-[#f7941d]/10 border border-[#f7941d]/20 flex items-center justify-center text-[#f7941d] shrink-0">
                  <Clock size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Support Chantiers 24h/7j</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Assistance technique et logistique sur tout le Maroc.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-[#f7941d]/10 border border-[#f7941d]/20 flex items-center justify-center text-[#f7941d] shrink-0">
                  <Wrench size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Flotte Certifiée & Inspectée</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Tous les engins sont audités avant chaque livraison.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Metadata */}
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Aandilik Ops Group © 2026 • Portails Sécurisés SSL
            </p>
          </div>

        </div>
      </div>

      {/* Right Column — Authentication Form */}
      <div className="flex-1 flex flex-col justify-between p-8 md:p-16 lg:p-24 bg-white relative min-h-screen">
        
        {/* Top Header - Back to home / Mobile Logo */}
        <div className="flex justify-between items-center w-full max-w-md mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={14} className="text-slate-400" /> Accueil
          </Link>

          <Link href="/" className="lg:hidden block hover:opacity-90 transition-opacity">
            <img 
              src="/aandilik.png" 
              alt="AANDILIK Logo" 
              className="h-7 w-auto object-contain" 
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-12">
          
          {/* Logo above Form (Desktop) */}
          <div className="hidden lg:block mb-10">
            <img 
              src="/aandilik.png" 
              alt="AANDILIK Logo" 
              className="h-9 w-auto object-contain" 
            />
          </div>

          <div className="mb-10 text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bon retour.</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saisissez vos identifiants professionnels pour vous connecter.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-3">
                <CheckCircle2 size={16} className="text-red-500 shrink-0 rotate-180" /> {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adresse E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f7941d] transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.ma"
                  className="w-full h-14 pl-12 pr-5 bg-slate-50/50 border border-slate-200 focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] rounded-xl outline-none transition-all duration-300 focus:scale-[1.01] text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe</label>
                <Link href="#" className="text-[10px] font-black text-[#f7941d] hover:underline uppercase tracking-wider">Mot de passe oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f7941d] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-5 bg-slate-50/50 border border-slate-200 focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] rounded-xl outline-none transition-all duration-300 focus:scale-[1.01] text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="mt-4 h-14 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-950/10 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin text-[#f7941d]" size={18} />
              ) : (
                <>Se connecter <ArrowRight size={16} strokeWidth={2.5} className="text-[#f7941d]" /></>
              )}
            </button>
          </form>

          {/* Sign Up Redirect */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[11px] font-semibold text-slate-400">
              Nouveau partenaire Aandilik ? <br />
              <Link href="/register" className="text-slate-900 font-black hover:text-[#f7941d] transition-colors inline-flex items-center gap-1 mt-2.5 uppercase tracking-wider">
                Créer un compte professionnel <ChevronLeft size={12} className="rotate-180 text-[#f7941d]" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="w-full text-center max-w-md mx-auto">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Aandilik Industrial S.A.R.L. Tous droits réservés.
          </p>
        </div>
      </div>

    </div>
  );
}
