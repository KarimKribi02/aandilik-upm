import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function EquipmentCard({ item, isRented }: { item: any; isRented: boolean }) {
  const isAvailable = item?.status === "active" && !isRented;
  
  const rawUrl = item?.image || '';
  const secureImageUrl = rawUrl.startsWith('http://api.aandilik.com')
    ? rawUrl.replace('http://api.aandilik.com', 'https://api.aandilik.com')
    : rawUrl;

  const [imgSrc, setImgSrc] = useState(secureImageUrl || "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=compress&cs=tinysrgb&w=800");

  useEffect(() => {
    setImgSrc(secureImageUrl || "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=compress&cs=tinysrgb&w=800");
  }, [secureImageUrl]);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 transition-all p-3 md:p-0 md:rounded-[20px] md:overflow-hidden md:border-slate-200/50 md:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] md:hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] flex flex-row md:flex-col h-auto md:h-full gap-4 md:gap-0">
      
      {/* Left Section (Image): place transparent machinery image in constrained wrapper */}
      <div className="w-32 h-24 relative flex-shrink-0 md:w-full md:h-auto md:aspect-[4/3] md:flex-shrink overflow-hidden rounded-xl md:rounded-none bg-slate-50 flex items-center justify-center">
        <Link href={`/equipment/${item?.id || ""}`} className="w-full h-full relative block">
          {imgSrc ? (
            <Image 
              src={imgSrc} 
              alt={item?.name || "Equipment"} 
              fill
              className={`object-contain md:object-cover transition-transform duration-700 group-hover:scale-105 ${isRented ? 'grayscale-[0.5] opacity-80' : ''}`}
              onError={() => {
                setImgSrc('/placeholder-machinery.png');
              }}
            />
          ) : null}
        </Link>
        {/* Availability Badge on Desktop */}
        <div className={`hidden md:block absolute bottom-3 left-3 px-3 py-1 rounded-full text-[9px] font-black tracking-wide uppercase shadow-sm ${
          isAvailable ? 'bg-green-950 text-green-400 border border-green-900/50' : 'bg-red-950 text-red-400 border border-red-900/50'
        }`}>
          {isRented ? 'Loué' : isAvailable ? 'Disponible' : 'Sur demande'}
        </div>
      </div>

      {/* Wishlist/heart floating line icon */}
      <button 
        onClick={(e) => {
          e.preventDefault();
        }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 md:bg-white backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm cursor-pointer z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      {/* Right Section (Metadata Stack) */}
      <div className="flex-1 flex flex-col justify-between py-0.5 md:p-5 bg-white">
        <div className="flex flex-col gap-1">
          {/* Equipment Title */}
          <h3 className="text-xs md:text-sm font-black tracking-tight leading-snug text-slate-900 group-hover:text-[#f7941d] transition-colors line-clamp-1 pr-6 md:pr-0">
            {item?.name || "Équipement"}
          </h3>

          {/* Subtitle / Category */}
          <span className="text-[9px] text-gray-400 font-bold block md:hidden">
            {item?.category || "Matériel"}
          </span>

          {/* Availability Soft Badge on Mobile */}
          <div className="flex md:hidden mt-0.5">
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide ${
              isAvailable 
                ? 'bg-green-50 text-green-600 border border-green-100' 
                : 'bg-orange-50 text-[#f7941d] border border-orange-100'
            }`}>
              {isRented ? 'Loué' : isAvailable ? 'Disponible' : 'Sur demande'}
            </span>
          </div>

          {/* Minimalist Gray Micro-chips Parameters */}
          <div className="flex gap-2 mt-1.5 flex-wrap">
            <span className="bg-slate-50 border border-slate-100/70 text-slate-500 text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md flex items-center gap-1">
              <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              {item?.poids_operationnel || 22.5} t
            </span>
            <span className="bg-slate-50 border border-slate-100/70 text-slate-500 text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md flex items-center gap-1">
              <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              2022
            </span>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="flex justify-between items-baseline md:items-end mt-2 md:mt-4 pt-1 md:pt-4 md:border-t md:border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-slate-900 text-sm md:text-2xl font-black">{item?.pricePerDay || 0}</span>
            <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-tight">DH / jour</span>
          </div>
          <Link href={`/equipment/${item?.id || ""}`} className="hidden md:block">
            <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#f7941d] hover:bg-[#f7941d] hover:text-zinc-950 transition-all cursor-pointer active:scale-95">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
