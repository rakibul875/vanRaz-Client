"use client";

import { FormEvent, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"message" | "callback">("message");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredTime: "morning",
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, type: activeTab }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form.");
      }

      setStatusMessage({
        type: "success",
        text:
          activeTab === "message"
            ? "Thank you! Your message has been sent successfully."
            : "Callback requested! Our team will get in touch shortly.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredTime: "morning",
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white antialiased">
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-indigo-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>We're Here to Help 24/7</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Let&apos;s Build Something <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Great Together
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
              Have questions, feedback, or need enterprise support? Reach out to
              our dedicated client care team and experience seamless resolution.
            </p>

            {/* Quick Stats Banner */}
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl sm:grid-cols-4">
              <div>
                <p className="text-2xl font-bold text-white">&lt; 15 min</p>
                <p className="text-xs text-slate-400 mt-1">Avg Response Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.8%</p>
                <p className="text-xs text-slate-400 mt-1">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24 / 7</p>
                <p className="text-xs text-slate-400 mt-1">Global Coverage</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Dhaka & HQ</p>
                <p className="text-xs text-slate-400 mt-1">
                  Primary Support Hub
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CONTACT SECTION
      ========================== */}
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* =====================
                CONTACT INFO CARDS
            ====================== */}
            <div className="space-y-6 lg:col-span-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Direct Channels
                </span>
                <h2 className="mt-2 text-3xl font-extrabold text-white">
                  Get in Touch Fast
                </h2>
                <p className="mt-3 text-slate-400 leading-relaxed text-sm sm:text-base">
                  Choose your preferred communication line. Our experts are
                  standby to serve your requirements.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email Card */}
                <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Email Us</h3>
                    <p className="mt-0.5 text-sm font-medium text-slate-300">
                      support@venraz.com
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Inquiries answered within 24 hours
                    </p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-violet-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-violet-500/10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Call Support</h3>
                    <p className="mt-0.5 text-sm font-medium text-slate-300">
                      +880 1234-567890
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Mon - Fri from 8am to 6pm GMT
                    </p>
                  </div>
                </div>

                {/* Office Location */}
                <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">HQ Office</h3>
                    <p className="mt-0.5 text-sm font-medium text-slate-300">
                      Dhaka, Bangladesh
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Open for scheduled partner visits
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Operating Hours
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-slate-300">
                      Sat - Thu: 9:00 AM - 6:00 PM
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Automated support active on weekends
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-5">
                <div className="flex items-center gap-3 text-indigo-400">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <p className="text-xs font-semibold text-slate-300">
                    Your personal information is encrypted and confidential.
                  </p>
                </div>
              </div>
            </div>

            {/* =====================
                CONTACT FORM CARD
            ====================== */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-2xl shadow-2xl shadow-indigo-950/40 sm:p-10">
                {/* Form Navigation Tabs */}
                <div className="flex rounded-xl bg-slate-950/80 p-1.5 border border-slate-800/80 mb-8">
                  <button
                    type="button"
                    onClick={() => setActiveTab("message")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                      activeTab === "message"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("callback")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                      activeTab === "callback"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule Callback
                  </button>
                </div>

                {/* Status Alert Banner */}
                {statusMessage && (
                  <div
                    className={`mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm font-medium backdrop-blur-md ${
                      statusMessage.type === "success"
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    {statusMessage.type === "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name + Email */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                      >
                        Work Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {activeTab === "callback" ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+880 1234 567890"
                          required
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="preferredTime"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                        >
                          Preferred Time Frame
                        </label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="morning">
                            Morning (9 AM - 12 PM)
                          </option>
                          <option value="afternoon">
                            Afternoon (12 PM - 3 PM)
                          </option>
                          <option value="evening">Evening (3 PM - 6 PM)</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we assist you today?"
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {activeTab === "message"
                        ? "Your Message"
                        : "Additional Notes"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={
                        activeTab === "message"
                          ? "Please detail your request..."
                          : "Let us know any specific topic you wish to discuss..."
                      }
                      required={activeTab === "message"}
                      className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {activeTab === "message"
                            ? "Send Message"
                            : "Schedule My Call"}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FAQ / CTA FOOTER BANNER
      ========================== */}
      <section className="relative py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-violet-950/80 px-6 py-12 text-center backdrop-blur-xl sm:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
              <Headphones className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              Prefer Direct Phone Support?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Skip the line and get in touch directly with our senior account
              manager team.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:support@venraz.com"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:bg-slate-100 hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                Email Executive Team
              </a>

              <a
                href="tel:+8801234567890"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-slate-500 hover:bg-slate-800"
              >
                <Phone className="h-4 w-4" />
                Call +880 1234-567890
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
