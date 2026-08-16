'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, User, Mail, Phone, MapPin, MessageSquare, ArrowRight, ArrowLeft, Send } from 'lucide-react';

interface BookingFormProps {
  whatsappNumber?: string;
}

export default function BookingForm({ whatsappNumber = '15552345678' }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Destination Wedding',
    eventDate: '',
    location: '',
    guestCount: '100-250 Guests',
    budgetRange: '$5,000 - $10,000',
    requirements: 'Full Day Coverage + Second Master Shooter',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.phone)) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }
    if (step === 3 && (!formData.eventDate || !formData.location)) {
      setErrorMessage('Please provide your event date and location.');
      return;
    }
    setErrorMessage('');
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setErrorMessage('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit booking inquiry.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppUrl = () => {
    const text = `Hi Lumina Studios!\nMy name is ${formData.name}.\nI am planning a ${formData.eventType} on ${formData.eventDate} in ${formData.location}.\nBudget: ${formData.budgetRange}.\nMessage: ${formData.message}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  if (submitted) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-none p-10 md:p-16 border border-amber-500/40 text-center max-w-2xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-none bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-3xl font-serif text-slate-100 mb-4">Inquiry Received</h3>
        <p className="text-slate-300 font-light leading-relaxed mb-8">
          Thank you, <span className="text-amber-300 font-medium">{formData.name}</span>. Our studio concierge will review your date availability and contact you within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-none bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <span>Fast Track via WhatsApp</span>
          </a>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
            }}
            className="px-6 py-3 rounded-none border border-slate-700 hover:border-slate-500 text-slate-300 text-xs uppercase tracking-widest"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-none p-8 md:p-12 border border-slate-800 shadow-2xl max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-amber-400">
            Step 0{step} of 05
          </span>
          <span className="text-xs font-mono text-slate-400">
            {step === 1 && 'Personal Info'}
            {step === 2 && 'Event Type'}
            {step === 3 && 'Date & Venue'}
            {step === 4 && 'Budget & Scope'}
            {step === 5 && 'Final Message'}
          </span>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-none overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-none bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-slate-100">STEP 01 — Tell us about yourself</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-amber-400/80 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Duchess Elena Vance"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-amber-400/80 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="elena@domain.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-amber-400/80 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-slate-100">STEP 02 — Select Event Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Destination Wedding',
                  'Pre-Wedding & Engagement',
                  'Haute Fashion Campaign',
                  'Fine Art Portraiture',
                  'Luxury Corporate Gala',
                  'Private Event & Birthday',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('eventType', type)}
                    className={`p-5 rounded-none border text-left font-serif transition-all ${
                      formData.eventType === type
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-slate-100">STEP 03 — Date & Venue Location</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Target Event Date *
                </label>
                <div
                  className="relative cursor-pointer"
                  onClick={(e) => {
                    const inputEl = e.currentTarget.querySelector('input');
                    if (inputEl && 'showPicker' in inputEl) {
                      try {
                        inputEl.showPicker();
                      } catch (err) {
                        inputEl.focus();
                      }
                    }
                  }}
                >
                  <Calendar className="w-5 h-5 text-amber-400/80 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                    onClick={(e) => {
                      if ('showPicker' in e.currentTarget) {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {}
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400 cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Location / Venue *
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-amber-400/80 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Positano, Italy or The Plaza, New York"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-slate-100">STEP 04 — Investment Budget & Scale</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-3">
                  Estimated Photography Budget
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['$3,000 - $5,000', '$5,000 - $10,000', '$10,000+ Luxury'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleChange('budgetRange', b)}
                      className={`p-4 rounded-none border text-xs uppercase tracking-wider font-mono text-center transition-all ${
                        formData.budgetRange === b
                          ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-3">
                  Guest Count Estimate
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => handleChange('guestCount', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Intimate (Under 50 Guests)">Intimate (Under 50 Guests)</option>
                  <option value="50 - 150 Guests">50 - 150 Guests</option>
                  <option value="150 - 300 Guests">150 - 300 Guests</option>
                  <option value="300+ Grand Celebration">300+ Grand Celebration</option>
                </select>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif text-slate-100">STEP 05 — Additional Vision & Notes</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Special Requirements or Notes
                </label>
                <div className="relative">
                  <MessageSquare className="w-5 h-5 text-amber-400/80 absolute left-4 top-4" />
                  <textarea
                    rows={4}
                    placeholder="Tell us more about your aesthetic vision, favorite photography styles, or specific family traditions..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-3 rounded-none border border-slate-800 hover:border-slate-600 text-slate-300 text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 rounded-none bg-gradient-to-r from-amber-600 to-amber-400 text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 flex items-center gap-2 shadow-xl shadow-amber-900/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-none bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 flex items-center gap-2 shadow-2xl shadow-amber-900/40"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
