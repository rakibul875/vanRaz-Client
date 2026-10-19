"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { title: "Home", href: "/" },
      { title: "Shop", href: "/shop" },
      { title: "Categories", href: "/categories" },
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { title: "My Account", href: "/account" },
      { title: "Shopping Cart", href: "/cart" },
      { title: "Wishlist", href: "/wishlist" },
      { title: "Track Order", href: "/track-order" },
      { title: "FAQ", href: "/faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-purple-950/20 bg-purple-950 text-white relative overflow-hidden">
      {/* Decorative Subtle Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7E22CE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Bio */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-white group inline-block"
            >
              Ven
              <span className="text-[#7E22CE] transition-colors group-hover:text-purple-400">
                Raz
              </span>
            </Link>

            <p className="text-sm leading-6 text-purple-200/70">
              Your trusted destination for quality electronics, smart devices,
              and modern tech accessories.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 text-sm text-purple-200/70 pt-2">
              <div className="flex items-center gap-2.5 transition-colors duration-200 hover:text-white">
                <Mail className="h-4 w-4 text-[#7E22CE]" />
                <span>support@venraz.com</span>
              </div>

              <div className="flex items-center gap-2.5 transition-colors duration-200 hover:text-white">
                <Phone className="h-4 w-4 text-[#7E22CE]" />
                <span>+880 1234-567890</span>
              </div>

              <div className="flex items-center gap-2.5 transition-colors duration-200 hover:text-white">
                <MapPin className="h-4 w-4 text-[#7E22CE]" />
                <span>Rajshahi, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-base font-bold tracking-wide text-white uppercase">
                {section.title}
              </h3>

              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-purple-200/70 transition-all duration-200 hover:text-white hover:translate-x-1"
                    >
                      <span className="relative">
                        {link.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7E22CE] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="text-base font-bold tracking-wide text-white uppercase">
              Newsletter
            </h3>

            <p className="text-sm leading-6 text-purple-200/70">
              Subscribe to get the latest products, offers and exclusive deals.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex pt-1">
              <input
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 rounded-l-xl border border-purple-800/60 bg-purple-900/50 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-purple-400/60 focus:border-[#7E22CE] focus:ring-1 focus:ring-[#7E22CE] transition-all duration-200"
              />

              <button
                type="submit"
                className="group flex items-center justify-center rounded-r-xl bg-[#7E22CE] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-700/20 active:scale-95"
              >
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-purple-900/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <p className="text-sm text-purple-200/60">
            © {new Date().getFullYear()} VenRaz. All rights reserved.
          </p>

          {/* Social Icons with Interactive Hover Animations */}
          <div className="flex items-center gap-3">
            <Link
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900/40 border border-purple-800/40 text-purple-200/80 transition-all duration-300 hover:bg-[#7E22CE] hover:text-white hover:scale-110 hover:-translate-y-1"
            >
              <FaFacebook className="h-4 w-4" />
            </Link>

            <Link
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900/40 border border-purple-800/40 text-purple-200/80 transition-all duration-300 hover:bg-[#7E22CE] hover:text-white hover:scale-110 hover:-translate-y-1"
            >
              <FaInstagram className="h-4 w-4" />
            </Link>

            <Link
              href="#"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900/40 border border-purple-800/40 text-purple-200/80 transition-all duration-300 hover:bg-[#7E22CE] hover:text-white hover:scale-110 hover:-translate-y-1"
            >
              <FaLinkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
