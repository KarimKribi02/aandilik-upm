import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12 text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-primary mb-8">
            <Shield size={24} />
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Mentions Légales</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">1. Éditeur du site</h2>
              <p className="leading-relaxed">
                Le présent site, accessible à l&apos;URL aandilik.com, est édité par : <br />
                <strong>AANDILIK GROUP S.A.R.L</strong> <br />
                Siège social : Quartier Maârif, Casablanca, Maroc <br />
                RC : 123456 | ICE : 009876543210099
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">2. Hébergement</h2>
              <p className="leading-relaxed">
                Le site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #1142 Walnut, CA 91789, USA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">3. Propriété Intellectuelle</h2>
              <p className="leading-relaxed">
                L&apos;ensemble de ce site relève de la législation marocaine et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">4. Contact</h2>
              <p className="leading-relaxed">
                Pour toute question ou demande d&apos;information concernant le site, ou tout signalement de contenu ou d&apos;activités illicites, l&apos;utilisateur peut contacter l&apos;éditeur à l&apos;adresse suivante : <br />
                <strong>support@aandilik.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
