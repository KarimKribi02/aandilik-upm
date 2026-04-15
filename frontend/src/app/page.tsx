import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
import { equipmentList } from "@/data/mockData";
import { Search, ArrowRight, Construction, Zap, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const featured = equipmentList.slice(0, 3);

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="container mx-auto px-6 max-w-7xl pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex items-center gap-3 text-primary font-semibold tracking-widest text-xs uppercase">
              <Construction size={16} />
              The Digital Architect
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tighter text-foreground">
              Build with <span className="text-secondary">Precision,</span> <br />
              Rent with <span className="text-primary">Power.</span>
            </h1>
            <p className="text-lg text-secondary max-w-xl leading-relaxed">
              Premium construction equipment rental for the world's master builders. Over 500+ heavy machines ready for your next architectural landmark.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="h-16">
                Explore Catalog <ArrowRight className="ml-2" />
              </Button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  className="w-full h-16 pl-12 pr-6 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary transition-all text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-12 mt-8 py-8 border-t border-surface-container">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-secondary text-xs uppercase tracking-wider">Machines</div>
              </div>
              <div>
                <div className="text-2xl font-bold">12k+</div>
                <div className="text-secondary text-xs uppercase tracking-wider">Deployments</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99%</div>
                <div className="text-secondary text-xs uppercase tracking-wider">Reliability</div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden cosmic-shadow">
              <img
                src="https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=1260"
                alt="Construction Equipment"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <GlassContainer className="absolute -bottom-10 -left-10 p-8 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 primary-gradient rounded-xl flex items-center justify-center text-white">
                  <Trophy size={24} />
                </div>
                <div>
                  <div className="font-bold text-lg">Top Rated Partner</div>
                  <div className="text-secondary text-sm">Industrial Choice 2026</div>
                </div>
              </div>
            </GlassContainer>
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="bg-surface-low py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">Featured <span className="text-primary">Fleet</span></h2>
              <p className="text-secondary">Hand-picked premium machinery for structural excellence.</p>
            </div>
            <Link href="/equipment">
              <Button variant="tertiary">
                View All Catalog <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((item) => (
              <Card key={item.id} variant="lowest" className="group cursor-pointer">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-lg text-xs font-bold text-primary">
                    ${item.pricePerDay}/day
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">{item.category}</div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{item.name}</h3>
                  <div className="flex justify-between items-center pt-6 border-t border-surface-container">
                    <span className="text-secondary text-sm flex items-center gap-1">
                      <MapPin size={14} /> {item.location.split(',')[0]}
                    </span>
                    <Button variant="secondary" size="sm">Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center text-primary">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Rapid Deployment</h3>
            <p className="text-secondary leading-relaxed">Fastest turnaround in the industry. Get your site moving in under 24 hours with local logistics.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center text-primary">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">Certified Safety</h3>
            <p className="text-secondary leading-relaxed">Every machine undergoes a rigorous 150-point inspection by certified engineers before every rental.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center text-primary">
              <Construction size={24} />
            </div>
            <h3 className="text-xl font-bold">Project Support</h3>
            <p className="text-secondary leading-relaxed">Expert operators and on-site maintenance available for complex architectural projects.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const MapPin = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
