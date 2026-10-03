import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  Send,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { BRAND_LOGO_URL } from '../../utils/constants';

export const Footer = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
        type: 'error',
      });
      return;
    }
    addToast({
      title: 'Subscribed to Diwali Offers!',
      message: 'You will receive our exclusive wholesale price list & coupons.',
      type: 'success',
    });
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-28 lg:pb-8 border-t-4 border-red-600">


      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-red-500/40 bg-white p-1 sm:p-1.5 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <img
                  src={BRAND_LOGO_URL}
                  alt="Classic Legend Crackers Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-heading text-white tracking-tight leading-none">
                  CLASSIC<span className="text-red-500 font-semiblod">LEGEND</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1">
                  Classic Legend Crackers Direct
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's trusted direct-from-factory crackers e-commerce store. Providing premium eco-green sparklers, sky shots, flower pots, and family gift boxes directly to your doorstep since 2023.
            </p>

            {/* WhatsApp Contact CTA */}
            <div className="pt-2">
              <a
                href="https://wa.me/917010849600?text=Hi,%20I%20want%20to%20order%20Diwali%20crackers%20directly%20from%20Classic%20Legend%20Crackers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Factory Desk on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-sm tracking-wider uppercase">
              Explore Catalog
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/shop" className="hover:text-red-400 transition-colors">
                  All 500+ Crackers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sparklers" className="hover:text-red-400 transition-colors">
                  Electric Sparklers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=aerial-shots" className="hover:text-red-400 transition-colors">
                  Aerial & Multi Shots
                </Link>
              </li>
              <li>
                <Link to="/shop?category=flower-pots" className="hover:text-red-400 transition-colors">
                  Colour Flower Pots
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gift-boxes" className="hover:text-red-400 transition-colors">
                  Family VIP Gift Boxes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=garlands" className="hover:text-red-400 transition-colors">
                  1,000 to 10,000 Walas
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Trust & About */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-bold text-sm tracking-wider uppercase">
              Information
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-red-400 transition-colors">
                  About Classic Legend Crackers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-400 transition-colors">
                  Contact & Factory Location
                </Link>
              </li>
              <li>
                <Link to="/about#safety" className="hover:text-red-400 transition-colors">
                  Safety Guidelines & Protocols
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-red-400 transition-colors">
                  View Shopping Bag
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-heading font-bold text-sm tracking-wider uppercase">
              Sivakasi Warehouse
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span> Sivakasi to Vembakottai Main Road, Near Vembakottai Junction, Sivakasi, Virudhunagar District, Tamil Nadu - 626131</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href="tel:+917010849600" className="hover:text-white transition-colors font-semibold text-slate-200">
                  +91 70108 49600
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href="mailto:crackersclassiclegend@gmail.com" className="hover:text-white transition-colors">
                  crackersclassiclegend@gmail.com
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <p className="text-xs font-semibold text-white mb-2">Get Wholesale Rate List:</p>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl px-3 py-2 w-full focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shrink-0 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Statutory Disclaimer, Copyright & Highlighted Developer Credit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p className="text-center md:text-left leading-relaxed">
          © 2026 Classic Legend Crackers Ltd. All Rights Reserved. As per Supreme Court guidelines, we sell only CSIR-NEERI certified green crackers.
        </p>

        {/* Highlighted Developer & Designer Credit Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-800 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-md hover:border-amber-400 transition-all shrink-0">
          <span className="text-slate-300 font-medium">Developed & Designed by</span>
          <a
            href="https://synctechn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4 decoration-amber-500/60 flex items-center gap-1 text-xs"
          >
            <span>synctechn.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};
