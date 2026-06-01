"use client";

import { useData } from "@/context/DataProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";

export default function BlogPage() {
  const { articles } = useData();
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) setFilter(cat);
    }
  }, []);

  const filteredArticles = (articles || []).filter(art => 
    filter === "Tous" || art.category === filter
  );

  const categories = ["Tous", ...new Set((articles || []).map(a => a.category))];

  return (
    <main className="min-h-screen bg-slate-50 pt-40 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col gap-12 mb-20">
          <div className="flex flex-col gap-4 max-w-3xl">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Centre d&apos;expertise</span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Guides & Conseils <br /> <span className="text-slate-300">STRATÉGIQUES</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
              Optimisez vos chantiers avec les conseils de nos experts. Découvrez les meilleures pratiques pour la location et l&apos;utilisation de matériel lourd.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === cat 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-200/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={article.image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=compress&cs=tinysrgb&w=800"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-widest shadow-lg">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col gap-4 flex-grow">
                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> 5 min lecture</div>
                      {article.createdAt && (
                        <div className="flex items-center gap-1.5"><BookOpen size={14} className="text-primary" /> {new Date(article.createdAt).toLocaleDateString()}</div>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors duration-300">
                      {article.title}
                    </h2>
                    
                    <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                      {article.content}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50">
                      <button className="flex items-center gap-2 text-slate-900 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                        Consulter le guide <ArrowRight size={14} className="text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-200">
              <Tag size={32} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-black text-slate-900">Aucun guide disponible</h3>
              <p className="text-slate-400 text-sm max-w-xs">Nous préparons actuellement de nouveaux articles pour ce secteur.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
