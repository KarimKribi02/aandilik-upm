"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  Truck,
  Star,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Building2,
  ClipboardList,
  BadgeCheck,
  Banknote,
  Phone,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const renterSteps = [
  {
    number: "01",
    icon: <Search size={28} strokeWidth={1.5} />,
    title: "Recherchez le matériel",
    desc: "Utilisez notre moteur de recherche pour trouver le matériel adapté à votre chantier. Filtrez par catégorie, ville, disponibilité et prix.",
  },
  {
    number: "02",
    icon: <CalendarCheck size={28} strokeWidth={1.5} />,
    title: "Réservez en ligne",
    desc: "Choisissez vos dates de location et réservez en quelques clics. Confirmation instantanée par e-mail dès validation du propriétaire.",
  },
  {
    number: "03",
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Récupérez le matériel",
    desc: "Récupérez le matériel sur place ou optez pour la livraison directe sur votre chantier selon les conditions du propriétaire.",
  },
  {
    number: "04",
    icon: <Star size={28} strokeWidth={1.5} />,
    title: "Notez votre expérience",
    desc: "Après la location, laissez un avis pour aider la communauté et améliorer la confiance sur la plateforme.",
  },
];

const ownerSteps = [
  {
    number: "01",
    icon: <Building2 size={28} strokeWidth={1.5} />,
    title: "Créez votre compte propriétaire",
    desc: "Inscrivez-vous gratuitement en tant que propriétaire. Votre profil sera vérifié par notre équipe pour garantir la sécurité.",
  },
  {
    number: "02",
    icon: <ClipboardList size={28} strokeWidth={1.5} />,
    title: "Publiez votre matériel",
    desc: "Ajoutez vos engins avec photos, description, tarif journalier et disponibilité. Plus votre annonce est complète, plus elle attire de locataires.",
  },
  {
    number: "03",
    icon: <BadgeCheck size={28} strokeWidth={1.5} />,
    title: "Acceptez les demandes",
    desc: "Recevez les demandes de location par notification et acceptez ou refusez facilement depuis votre tableau de bord.",
  },
  {
    number: "04",
    icon: <Banknote size={28} strokeWidth={1.5} />,
    title: "Percevez vos revenus",
    desc: "Après chaque location confirmée, vos revenus sont calculés automatiquement. Retirez vos fonds de façon sécurisée à tout moment.",
  },
];

const faqs = [
  {
    q: "Est-ce que l'inscription est gratuite ?",
    a: "Oui, l'inscription est entièrement gratuite pour les locataires et les propriétaires. Des frais de service s'appliquent uniquement lors d'une transaction réussie.",
  },
  {
    q: "Comment sont vérifiés les propriétaires ?",
    a: "Chaque propriétaire est vérifié manuellement par notre équipe : identité, documents du matériel et assurance. Cela garantit la fiabilité de toutes les annonces.",
  },
  {
    q: "Que se passe-t-il en cas de problème avec le matériel ?",
    a: "Notre service client est disponible 24h/24. En cas de litige, notre équipe de médiation intervient rapidement pour trouver une solution équitable.",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "Les paiements sont sécurisés et traités en ligne. Les fonds sont conservés jusqu'à confirmation de la prise en charge du matériel, puis libérés au propriétaire.",
  },
  {
    q: "Puis-je annuler une réservation ?",
    a: "Oui, les annulations sont possibles selon les conditions définies par le propriétaire. Les politiques d'annulation sont affichées clairement sur chaque annonce.",
  },
  {
    q: "Qui est responsable des dommages ?",
    a: "Le locataire est responsable du bon usage du matériel. Un état des lieux est recommandé à la remise et au retour. Une assurance complémentaire peut être souscrite.",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl transition-colors cursor-pointer ${open ? "border-[#FFB800]/40 bg-[#FFFCF0]" : "border-gray-100 bg-white"}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4 p-6">
        <span className="text-sm font-black text-gray-900">{q}</span>
        <div className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${open ? "border-[#FFB800] bg-[#FFB800] text-white" : "border-gray-200 text-gray-400"}`}>
          <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      {open && (
        <div className="px-6 pb-6 -mt-2">
          <p className="text-xs font-semibold text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function StepCard({ step, idx }: { step: typeof renterSteps[0]; idx: number }) {
  return (
    <div className="relative flex flex-col gap-6 bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
      {/* Connector line — only between cards */}
      {idx < 3 && (
        <div className="hidden lg:block absolute top-12 -right-6 w-12 h-[2px] bg-gradient-to-r from-gray-200 to-transparent z-10" />
      )}
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF9EA] text-[#FFB800] flex items-center justify-center">
          {step.icon}
        </div>
        <span className="text-4xl font-black text-gray-100 leading-none select-none">{step.number}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-black text-gray-900 leading-snug">{step.title}</h3>
        <p className="text-[11px] font-semibold text-gray-500 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"renter" | "owner">("renter");

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-white overflow-hidden pt-24 pb-24 min-h-[600px] flex items-center">
        {/* Background image — right side, fades left */}
        <div className="absolute inset-0 w-full h-full lg:w-[70%] ml-auto z-0">
          <img
            src="/last.png"
            alt="Construction equipment"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
        </div>
        {/* Extra soft warm tint on left */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#FFF9EA_0%,_transparent_40%)] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-10 text-gray-400">
            <Link href="/" className="hover:text-[#FFB800] transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">Comment ça marche</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB800] mb-5 block">LA PLATEFORME</span>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.0] tracking-tight mb-8">
              Simple,<br />
              rapide &<br />
              <span className="text-[#FFB800]">sécurisé.</span>
            </h1>
            <p className="text-sm lg:text-base font-semibold text-gray-500 leading-relaxed max-w-xl">
              Aandilik connecte les propriétaires de matériel de construction avec les professionnels qui en ont besoin. En quelques étapes simples, louez ou mettez en location vos engins.
            </p>
          </div>

          {/* Floating stat pills */}
          <div className="flex flex-wrap gap-4 mt-14">
            {[
              { label: "500+ matériels disponibles", color: "bg-[#FFF9EA] text-[#FFB800]" },
              { label: "Confirmation en < 2h", color: "bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-100" },
              { label: "Support 24/7", color: "bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-100" },
              { label: "Paiement sécurisé", color: "bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-100" },
            ].map((s) => (
              <div key={s.label} className={`${s.color} px-5 py-2.5 rounded-full text-[11px] font-black shadow-sm`}>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS SECTION ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Tab Toggle */}
          <div className="flex flex-col items-center mb-16 gap-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB800] mb-3 block text-center">COMMENT ÇA MARCHE</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 text-center tracking-tight">
                Choisissez votre profil
              </h2>
            </div>
            <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
              <button
                onClick={() => setActiveTab("renter")}
                className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === "renter" ? "bg-[#FFB800] text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                Je loue du matériel
              </button>
              <button
                onClick={() => setActiveTab("owner")}
                className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === "owner" ? "bg-[#FFB800] text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                Je mets en location
              </button>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {(activeTab === "renter" ? renterSteps : ownerSteps).map((step, idx) => (
              <StepCard key={step.number} step={step} idx={idx} />
            ))}
          </div>

          {/* CTA below steps */}
          <div className="flex justify-center mt-14">
            <Link
              href={activeTab === "renter" ? "/equipment" : "/register"}
              className="bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 px-10 py-4 rounded-xl text-xs font-black transition-colors flex items-center gap-3 group"
            >
              {activeTab === "renter" ? "Trouver du matériel maintenant" : "Créer mon compte propriétaire"}
              <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GUARANTEES RIBBON ──────────────────────────────────────────────── */}
      <section className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto my-8">
        <div className="bg-[#151719] rounded-[24px] lg:rounded-[32px] p-10 lg:p-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Matériel certifié",
                desc: "Chaque engin est inspecté avant d'être listé. Photos, fiches techniques et historique d'entretien vérifiés.",
                icon: <BadgeCheck size={24} strokeWidth={1.5} />,
              },
              {
                title: "Paiement 100% sécurisé",
                desc: "Les transactions sont chiffrées. Les fonds sont libérés uniquement après confirmation de la prise en charge.",
                icon: <Banknote size={24} strokeWidth={1.5} />,
              },
              {
                title: "Assistance dédiée",
                desc: "Une équipe disponible 24h/24 et 7j/7 pour répondre à vos questions et résoudre tout problème rapidement.",
                icon: <Phone size={24} strokeWidth={1.5} />,
              },
            ].map((g) => (
              <div key={g.title} className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl text-[#FFB800] flex items-center justify-center">
                  {g.icon}
                </div>
                <h3 className="text-sm font-black text-white">{g.title}</h3>
                <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB800] mb-4 block">QUESTIONS FRÉQUENTES</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Vous avez des questions ?
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────────────── */}
      <section className="py-12 bg-[#f8f9fa]">
        <div className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mb-12">
          <div className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden bg-[#111315] flex flex-col justify-center min-h-[280px]">
            <div className="absolute inset-0 w-full h-full">
              <img
                src="/last.png"
                alt="Construction site background"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#151719] via-[#151719]/90 to-[#151719]/40" />
            </div>
            <div className="relative z-10 p-10 lg:p-14 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-black text-white leading-[1.1] mb-4 tracking-tight">
                  Prêt à démarrer ?
                </h2>
                <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                  Rejoignez les centaines de professionnels qui font confiance à Aandilik pour leurs chantiers.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link href="/equipment" className="bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 px-8 py-4 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-3 group">
                  Louer du matériel
                  <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/register" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-3">
                  Déposer une annonce
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
