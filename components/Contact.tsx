"use client";

import React, { useState } from "react";
import { Send, CheckCircle, Mail, MapPin } from "lucide-react";
import type { Profile } from "@/data/portfolio";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const { email, location, contactDescription } = profile;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    affiliation: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", affiliation: "", message: "" });
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#030303]">
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info column */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
                08 // Connect
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
                Start a Collaboration
              </h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-8">
                {contactDescription}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-900 font-mono text-sm text-zinc-400">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-purple-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl glow-card">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="text-xl font-bold text-white mb-2">Message Sent</h4>
                  <p className="text-zinc-400 text-sm max-w-sm">
                    Thank you. I've received your request and will reply via email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs font-mono text-zinc-400 uppercase">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Newton"
                        className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-900 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs font-mono text-zinc-400 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="newton@mit.edu"
                        className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-900 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Affiliation */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="affiliation" className="text-xs font-mono text-zinc-400 uppercase">
                      Institution / Corporate Affiliation
                    </label>
                    <input
                      type="text"
                      id="affiliation"
                      value={formData.affiliation}
                      onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                      placeholder="e.g. Research Center / Company"
                      className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-900 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-mono text-zinc-400 uppercase">
                      Collaboration Details
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe the research or system requirements..."
                      className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-900 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.1)] group"
                  >
                    Submit Request
                    <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
