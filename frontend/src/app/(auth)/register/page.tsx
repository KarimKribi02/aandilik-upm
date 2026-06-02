"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock,
  User,
  ChevronLeft,
  Loader2,
  Briefcase,
  Clock,
  Wrench,
  CheckCircle2
} from "lucide-react";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";

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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* Left Column — Visual / Abstract Showcase (Vibrant Corporate Gold/Orange Theme) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#f7941d] via-[#f7941d] to-[#e08316] relative overflow-hidden items-center justify-center p-16">
        
        {/* Subtle grid blueprint mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff18_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Soft floating blur circles */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-white/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 rounded-full bg-slate-900/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full flex flex-col justify-between h-full">
          
          {/* Logo Header */}
          <div>
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              {/* Using a pure dark logo on the gold background */}
              <img 
                src="/aandilik.png" 
                alt="AANDILIK Logo" 
                className="h-11 w-auto object-contain brightness-0" 
              />
            </Link>
          </div>

          {/* Core Content */}
          <div className="my-auto py-12">
            <span className="text-[10px] font-black tracking-widest text-slate-900 uppercase bg-white/20 px-3.5 py-1.5 rounded-full inline-block mb-6">
              REJOINDRE LE RÉSEAU
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight mb-6">
              Faites grandir votre activité de location <span className="text-white">d&apos;engins.</span>
            </h2>
            <p className="text-slate-900/80 text-sm font-semibold leading-relaxed mb-8">
              Mettez votre matériel professionnel en location auprès d&apos;entreprises vérifiées ou accédez instantanément à la flotte d&apos;engins de vos chantiers.
            </p>

            {/* Micro-badges for trust factor */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5 bg-slate-950/5 border border-slate-950/10 rounded-2xl p-4 transition-all hover:bg-slate-950/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-slate-950/10 border border-slate-950/20 flex items-center justify-center text-slate-950 shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">100% Paiement Sécurisé</h4>
                  <p className="text-[10px] text-slate-900/60 font-medium">Garantie des loyers et flux financiers sécurisés.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-950/5 border border-slate-950/10 rounded-2xl p-4 transition-all hover:bg-slate-950/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-slate-950/10 border border-slate-950/20 flex items-center justify-center text-slate-950 shrink-0">
                  <Clock size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">Support Chantiers 24h/7j</h4>
                  <p className="text-[10px] text-slate-900/60 font-medium">Assistance technique de terrain partout au Maroc.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-950/5 border border-slate-950/10 rounded-2xl p-4 transition-all hover:bg-slate-950/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-slate-950/10 border border-slate-950/20 flex items-center justify-center text-slate-950 shrink-0">
                  <Wrench size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">Flotte Certifiée & Inspectée</h4>
                  <p className="text-[10px] text-slate-900/60 font-medium">Validation complète de l&apos;état mécanique des machines.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Metadata */}
          <div>
            <p className="text-[10px] font-bold text-slate-900/50 uppercase tracking-widest">
              Aandilik Ops Group © 2026 • Portails Sécurisés SSL
            </p>
          </div>

        </div>
      </div>

      {/* Right Column — Registration Form */}
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
          <div className="hidden lg:block mb-8">
            <img 
              src="/aandilik.png" 
              alt="AANDILIK Logo" 
              className="h-9 w-auto object-contain" 
            />
          </div>

          <div className="mb-8 text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Inscription.</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Créez votre accès professionnel et rejoignez-nous.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-3">
                <CheckCircle2 size={16} className="text-red-500 shrink-0 rotate-180" /> {error}
              </div>
            )}

            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f7941d] transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Yassine Belkhayat"
                  className="w-full h-14 pl-12 pr-5 bg-slate-50/50 border border-slate-200 focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] rounded-xl outline-none transition-all duration-300 focus:scale-[1.01] text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

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

            {/* Role Select Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type de compte professionnel</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f7941d] transition-colors pointer-events-none" size={18} />
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-14 pl-12 pr-10 bg-slate-50/50 border border-slate-200 focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] rounded-xl outline-none transition-all duration-300 focus:scale-[1.01] text-sm font-semibold text-slate-900 appearance-none cursor-pointer"
                >
                  <option value="Owner">Propriétaire / Loueur de flotte</option>
                  <option value="Renter">Professionnel / Locataire d&apos;engins</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#f7941d] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</label>
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
                <>Créer mon compte <ArrowRight size={16} strokeWidth={2.5} className="text-[#f7941d]" /></>
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-[11px] font-semibold text-slate-400">
              Vous possédez déjà un compte professionnel ? <br />
              <Link href="/login" className="text-slate-900 font-black hover:text-[#f7941d] transition-colors inline-flex items-center gap-1 mt-2.5 uppercase tracking-wider">
                Connectez-vous ici <ChevronLeft size={12} className="rotate-180 text-[#f7941d]" />
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
