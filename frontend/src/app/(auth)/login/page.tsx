"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Construction, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Left Column — Visual / Abstract */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#151719] relative overflow-hidden items-center justify-center p-20">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FFB800]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <Link href="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center text-gray-900">
              <Construction size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              AANDIL<span className="text-white/30">IK</span>
            </span>
          </Link>

          <h2 className="text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
            Gérez vos <br />
            actifs avec <br />
            <span className="text-[#FFB800]">précision.</span>
          </h2>
          
          <p className="text-gray-400 font-semibold leading-relaxed mb-12">
            La plateforme leader au Maroc pour la gestion et la location de matériel de construction. Connectez-vous pour accéder à votre tableau de bord.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-[#FFB800] font-black text-2xl">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Engins disponibles</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-[#FFB800] font-black text-2xl">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Paiement sécurisé</div>
            </div>
          </div>
        </div>

        {/* Floating machine visual hint */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-10">
          <img src="/last.png" alt="Overlay" className="w-full h-full object-contain grayscale invert" />
        </div>
      </div>

      {/* Right Column — Login Form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white relative">
        <div className="max-w-md w-full mx-auto">
          
          <div className="lg:hidden flex justify-center mb-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center text-gray-900">
                <Construction size={22} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                AANDIL<span className="text-gray-300">IK</span>
              </span>
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3 italic">Bon retour.</h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Entrez vos identifiants pour continuer.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[11px] font-bold flex items-center gap-3">
                <ShieldCheck size={16} /> {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFB800] transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full h-14 pl-12 pr-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#FFB800]/10 transition-all text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mot de passe</label>
                <Link href="#" className="text-[10px] font-bold text-[#FFB800] hover:underline">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFB800] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#FFB800]/10 transition-all text-sm font-semibold"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="mt-4 h-14 bg-gray-900 hover:bg-black text-[#FFB800] rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Se connecter <ArrowRight size={16} strokeWidth={2.5} /></>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-[11px] font-semibold text-gray-400">
              Vous n&apos;avez pas encore de compte ? <br />
              <Link href="/register" className="text-gray-900 font-black hover:text-[#FFB800] transition-colors inline-flex items-center gap-1 mt-2">
                Créer un profil professionnel <ChevronLeft size={14} className="rotate-180" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-10 left-0 right-0 text-center px-8">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            © 2026 Aandilik Industrial • Systèmes Sécurisés
          </p>
        </div>
      </div>

    </div>
  );
}
