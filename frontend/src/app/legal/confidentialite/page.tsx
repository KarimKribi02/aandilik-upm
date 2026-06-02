import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

export default function Confidentialite() {
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
            <Lock size={24} />
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Confidentialité</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">1. Collecte des données</h2>
              <p className="leading-relaxed">
                Nous collectons les informations que vous nous fournissez lors de la création de votre compte, de vos demandes de réservation ou de vos échanges avec notre support. Cela inclut votre nom, email, téléphone et localisation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">2. Utilisation des données</h2>
              <p className="leading-relaxed">
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gérer vos réservations et transactions</li>
                <li>Assurer le suivi logistique de votre matériel</li>
                <li>Améliorer nos services et votre expérience utilisateur</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">3. Protection des données</h2>
              <p className="leading-relaxed">
                AANDILIK met en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">4. Vos droits</h2>
              <p className="leading-relaxed">
                Conformément à la loi 09-08 au Maroc, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;opposition au traitement de vos données personnelles. Vous pouvez exercer ce droit à tout moment par email.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
