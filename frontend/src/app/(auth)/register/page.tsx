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
  User,
  ChevronLeft,
  Loader2,
  Briefcase
} from "lucide-react";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const { register } = useData();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Owner");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(name, email, role, password);
      showToast("Compte créé avec succès.", "success");
      // After registration, DataProvider logs in the user automatically
      const token = localStorage.getItem("aandilik_token");
      if (token) {
        router.push("/dashboard/owner");
      } else {
        router.push("/login");
      }
    } catch (err) {
      showToast("Échec de l'inscription.", "error");
      setError("Une erreur est survenue. Cet email est peut-être déjà utilisé.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Left Column — Visual / Abstract */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFB800] relative overflow-hidden items-center justify-center p-20">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <Link href="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-[#FFB800]">
              <Construction size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              AANDIL<span className="text-gray-900/30">IK</span>
            </span>
          </Link>

          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
            Rejoignez <br />
            la première <br />
            <span className="text-white italic">communauté.</span>
          </h2>
          
          <p className="text-gray-800 font-semibold leading-relaxed mb-12">
            Mettez votre matériel en location ou accédez à un catalogue exclusif de machines. Créez votre profil professionnel en quelques instants.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-gray-900">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Vérification de profil rigoureuse</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-gray-900">
                <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Interface de gestion dédiée</p>
            </div>
          </div>
        </div>

        {/* Floating machine visual hint */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-20">
          <img src="/last.png" alt="Overlay" className="w-full h-full object-contain grayscale" />
        </div>
      </div>

      {/* Right Column — Register Form */}
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

          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Inscription.</h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Créez votre accès professionnel.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[11px] font-bold flex items-center gap-3">
                <ShieldCheck size={16} /> {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom complet</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFB800] transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Yassine Belkhayat"
                  className="w-full h-14 pl-12 pr-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#FFB800]/10 transition-all text-sm font-semibold"
                />
              </div>
            </div>

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
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Type de compte</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#FFB800]/10 transition-all text-sm font-semibold appearance-none cursor-pointer"
              >
                <option value="Owner">Propriétaire / Loueur</option>
                <option value="Renter">Professionnel / Locataire</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mot de passe</label>
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
              className="mt-6 h-14 bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-[#FFB800]/20 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Créer mon compte <ArrowRight size={16} strokeWidth={2.5} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-[11px] font-semibold text-gray-400">
              Vous avez déjà un compte ? <br />
              <Link href="/login" className="text-gray-900 font-black hover:text-[#FFB800] transition-colors inline-flex items-center gap-1 mt-2">
                Connectez-vous ici <ChevronLeft size={14} className="rotate-180" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-10 left-0 right-0 text-center px-8">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            © 2026 Aandilik Industrial • Inscription Sécurisée
          </p>
        </div>
      </div>

    </div>
  );
}
