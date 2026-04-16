"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Search, Filter, MapPin, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ListingPage() {
  const { equipment } = useData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Earthmoving", "Lifting", "Concrete", "Materials", "Tools"];

  const filtered = (equipment || []).filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.status === "active";
  });

  return (
    <div className="container mx-auto px-6 max-w-7xl pb-32">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">Industrial <span className="text-primary">Catalog</span></h1>
            <p className="text-secondary">Browse our precision fleet of high-performance machinery.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search by model or spec..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-foreground outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 flex flex-col gap-10">
            <div>
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Filter size={18} className="text-primary" /> Categories
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                      activeCategory === cat 
                        ? "bg-primary text-white cosmic-shadow" 
                        : "bg-surface-container text-secondary hover:bg-surface-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-surface-container-high relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-bold mb-3 text-lg">Need Assistance?</h4>
                <p className="text-secondary text-xs leading-relaxed mb-6">Our equipment architects can help you select the right fleet for your structural needs.</p>
                <Button variant="primary" size="sm" className="w-full">Speak to Expert</Button>
              </div>
              <Activity className="absolute -bottom-10 -right-10 w-32 h-32 text-primary opacity-5 group-hover:scale-110 transition-transform" />
            </div>
          </aside>

          {/* Grid */}
          <main className="lg:col-span-9">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map((item) => (
                  <Card key={item.id} variant="lowest" className="group border border-transparent hover:border-primary/20 hover:cosmic-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 glass px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                          <p className="text-secondary text-sm flex items-center gap-1">
                            <MapPin size={14} /> {item.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-foreground">${item.pricePerDay}</div>
                          <div className="text-[10px] uppercase font-bold text-secondary tracking-widest">Per Day</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {Object.entries(item.specs).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="p-3 bg-surface-low rounded-lg">
                            <div className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-1">{key}</div>
                            <div className="text-sm font-bold">{value}</div>
                          </div>
                        ))}
                      </div>

                      <Link href={`/equipment/${item.id}`} className="block">
                        <Button variant="secondary" className="w-full group/btn">
                          View Full Specs <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-surface-low rounded-[40px] border border-dashed border-surface-container">
                <Search size={48} className="text-secondary/20 mb-6" />
                <h3 className="text-xl font-bold mb-2">No machinery found</h3>
                <p className="text-secondary text-sm">Try adjusting your filters or search terms.</p>
                <Button variant="tertiary" className="mt-6" onClick={() => {setSearchQuery(""); setActiveCategory("All");}}>Reset All Filters</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
