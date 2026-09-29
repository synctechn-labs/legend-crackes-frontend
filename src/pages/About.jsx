import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Factory,
  CheckCircle2,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { SAFETY_TIPS } from '../utils/constants';

export const About = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-red-950 via-red-900 to-slate-950 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-800/80 border border-red-500/40 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Over 3 Decades of Fireworks Mastery</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">
            The Classic Legend Heritage
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Crafting the finest festive memories for Indian homes since 2023 with 100% legal CSIR-NEERI green fireworks and direct-from-factory wholesale value.
          </p>
        </div>
      </section>

      {/* Story & Factory Roots */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Direct from the Fireworks Capital
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
              From Sivakasi's Traditional Artisans to Your Family Celebration
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nestled in the sun-drenched industrial heartland of Sivakasi, Tamil Nadu, <strong>Classic Legend Crackers</strong> was founded in 2023   by master pyrotechnicians with a singular passion: creating fireworks that burst with unmatched color vibrancy, crystal-clear acoustic timing, and zero duds.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Today, we have digitized the traditional crackers buying experience. Instead of dealing with seasonal middlemen and inflated retail prices, families across India can purchase directly from our manufacturing warehouses with absolute quality and safety assurance.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100">
                <span className="text-2xl font-black font-heading text-red-600">3+ Years</span>
                <span className="block text-xs font-semibold text-slate-700 mt-0.5">Continuous Manufacturing</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <span className="text-2xl font-black font-heading text-amber-600">1000+</span>
                <span className="block text-xs font-semibold text-slate-700 mt-0.5">Satisfied Families</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                alt="Sivakasi Fireworks Production"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xs font-medium">
                  PESO Licensed Manufacturing Unit, Sivakasi, Tamil Nadu
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Safety Commitments */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Uncompromising Standards
            </span>
            <h2 className="text-3xl font-black font-heading text-slate-900 mt-1">
              Our Safety & Quality Commitment
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Every batch undergoes 3-tier chemical and visual inspections before being cleared for dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">CSIR-NEERI Green Certified</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formulated using barium-free, potassium-chlorate-free compositions that reduce particulate matter (PM2.5) by up to 35% compared to legacy crackers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">PESO Approved Testing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict adherence to Petroleum and Explosives Safety Organisation standards with sound limits well within the 125 dB legal ceiling.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Direct Customer Trust</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Over 1000 satisfied Indian households rely on us annually. Prompt replacement support if any damaged box occurs during transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Anchor */}
      <section id="safety" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Safe Celebration Checklist
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
              Always Burst Responsibly
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Fireworks bring boundless happiness when handled with proper care. Please follow these precautions:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAFETY_TIPS.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-3xl p-10 shadow-xl space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black font-heading">
            Experience Sivakasi Quality This Diwali
          </h3>
          <p className="text-xs sm:text-sm text-red-100 max-w-xl mx-auto">
            Book your crackers directly with factory wholesale pricing and doorstep delivery.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-100 text-red-600 font-bold text-xs rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              <span>Explore 500+ Crackers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
