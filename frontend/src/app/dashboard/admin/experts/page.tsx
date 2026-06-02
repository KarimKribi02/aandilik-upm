"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import { Trash2, Plus, Users, Image as ImageIcon, X } from "lucide-react";

export default function AdminExpertsPage() {
  const { experts, addExpert, deleteExpert } = useData();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", image: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.image) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addExpert(form);
      setForm({ name: "", role: "", image: "" });
      setShowForm(false);
    } catch {
      setError("Erreur lors de l'ajout. Vérifiez la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteExpert(id);
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Experts & Équipe</h1>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Gérez les membres de l&apos;équipe affichés sur la page À propos.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 px-5 py-3 rounded-xl text-xs font-black transition-colors flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          Ajouter un expert
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={() => { setShowForm(false); setError(""); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
            <h2 className="text-lg font-black text-gray-900 mb-6">Ajouter un expert</h2>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-2">Nom complet</label>
                <input
                  type="text"
                  placeholder="ex: Youssef El Almani"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 text-sm font-semibold bg-[#f8f9fa] border border-gray-200 rounded-xl outline-none focus:border-[#FFB800] transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-2">Poste / Rôle</label>
                <input
                  type="text"
                  placeholder="ex: Directeur Général"
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full px-4 py-3 text-sm font-semibold bg-[#f8f9fa] border border-gray-200 rounded-xl outline-none focus:border-[#FFB800] transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-2">URL de la photo</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.image}
                  onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                  className="w-full px-4 py-3 text-sm font-semibold bg-[#f8f9fa] border border-gray-200 rounded-xl outline-none focus:border-[#FFB800] transition-colors"
                />
                {form.image && (
                  <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border border-gray-100">
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FFB800] hover:bg-[#f0ad00] disabled:opacity-60 text-gray-900 py-3 rounded-xl text-xs font-black transition-colors mt-2"
              >
                {loading ? "Enregistrement..." : "Ajouter cet expert"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Experts Grid */}
      {experts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#FFF9EA] flex items-center justify-center mb-6">
            <Users size={32} className="text-[#FFB800]" />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-2">Aucun expert enregistré</h3>
          <p className="text-xs font-semibold text-gray-500 max-w-xs">
            Ajoutez votre premier expert via le bouton ci-dessus. Il apparaîtra sur la page &quot;À propos&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experts.map((expert) => (
            <div key={expert.id} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {expert.image ? (
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <ImageIcon size={40} />
                  </div>
                )}
              </div>
              <div className="p-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-gray-900 truncate">{expert.name}</h4>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{expert.role}</span>
                </div>
                <button
                  onClick={() => handleDelete(expert.id)}
                  disabled={deletingId === expert.id}
                  className="shrink-0 w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-60"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
