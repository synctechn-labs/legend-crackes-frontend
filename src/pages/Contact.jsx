import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Bulk / Wholesale Order Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      addToast({
        title: 'Incomplete Details',
        message: 'Please fill in your name, contact phone, and message.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast({
        title: 'Message Sent to Sivakasi Desk!',
        message: 'Our wholesale dispatch manager will reach out via WhatsApp/Phone within 2 hours.',
        type: 'success',
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Bulk / Wholesale Order Inquiry',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Sivakasi Factory Support Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
          Get in Touch With Our Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have queries regarding custom gift boxes, bulk apartment society bookings, or order dispatch status? We are always here to assist.
        </p>
      </div>

      {/* Grid: Contact Info Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Contact Cards */}
        <div className="lg:col-span-5 space-y-5">
          {/* WhatsApp Direct Hero Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-black">Instant WhatsApp Assistance</h3>
              <p className="text-xs text-emerald-100 mt-1">
                Chat directly with our factory dispatch supervisor for quick order inquiries and custom rate lists.
              </p>
            </div>
            <a
              href="https://wa.me/917010849600?text=Hi%20Sivakasi%20Sparkles,%20I%20have%20an%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Open WhatsApp Chat (+91 70108 49600)</span>
            </a>
          </div>

          {/* Contact Details List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h4 className="font-heading font-black text-slate-900 text-base">Direct Channels</h4>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Phone Support</span>
                  <a href="tel:+919840123456" className="text-slate-600 hover:text-red-600 block mt-0.5">
                    +91 98401 23456 / +91 94431 88990
                  </a>
                  <span className="text-[11px] text-slate-400">Lines open 8:00 AM - 10:00 PM (Mon-Sun)</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Email Inquiries</span>
                  <a href="mailto:orders@sivakasisparkles.com" className="text-slate-600 hover:text-red-600 block mt-0.5">
                    orders@sivakasisparkles.com
                  </a>
                  <a href="mailto:support@sivakasisparkles.com" className="text-slate-600 hover:text-red-600 block">
                    support@sivakasisparkles.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Factory & Warehouse Depot</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    Sivakasi Sparkles Fireworks Complex, 42/B, Sattur Main Road, Industrial Estate, Sivakasi, Tamil Nadu - 626123, India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form & Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-xl">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill in the form below and our customer team will respond promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit phone number"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. yourname@domain.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  >
                    <option value="Bulk / Wholesale Order Inquiry">Bulk / Wholesale Order Inquiry</option>
                    <option value="Track Existing Order">Track Existing Order</option>
                    <option value="Corporate / Apartment Society Gifting">Corporate / Apartment Society Gifting</option>
                    <option value="Green Crackers Certification Inquiry">Green Crackers Certification Inquiry</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the crackers or requirements you are looking for..."
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Interactive Sivakasi Map Visual Placeholder */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <h4 className="font-heading font-bold text-slate-900 text-sm">
                  Sivakasi Manufacturing Hub Location
                </h4>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Direct Dispatch Warehouse
              </span>
            </div>

            {/* Stylized Map View */}
            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 relative overflow-hidden flex items-center justify-center text-center p-4">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-800 text-xs">Sivakasi Sparkles Complex</h5>
                <p className="text-[11px] text-slate-500">Sattur Road, Sivakasi (Virudhunagar Dist, TN - 626123)</p>
                <a
                  href="https://maps.google.com/?q=Sivakasi+Fireworks+Industrial+Estate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] font-bold text-red-600 hover:underline mt-1"
                >
                  View in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
