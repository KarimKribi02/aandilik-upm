"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements";
import { Construction, ArrowRight, Github } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-low relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-[480px] z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center text-white mb-6 rotate-3">
            <Construction size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Welcome <span className="text-primary">Back</span></h1>
          <p className="text-secondary text-sm">Access your industrial asset management suite.</p>
        </div>

        <div className="glass p-10 rounded-[40px] border border-white/20 cosmic-shadow bg-white/40">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <Input label="Email Address" type="email" placeholder="name@company.com" required />
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Password</label>
                <Link href="#" className="text-[10px] font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm transition-all placeholder:text-secondary/50"
                required
              />
            </div>

            <Button size="lg" className="w-full font-black mt-2">
              Sign In <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="relative my-4 flex items-center py-2">
              <div className="flex-grow border-t border-surface-container"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-surface-container"></div>
            </div>

            <button className="flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-white border border-surface-container font-bold text-sm hover:bg-surface-low transition-all">
              <Github size={18} /> GitHub Enterprise
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-secondary text-sm">
          New to the platform?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
