import React from "react";
import { Link } from "react-router-dom"; // <-- import Link
import {
  Heart,
  Trophy,
  Users,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { useTournaments } from "../context/TournamentContext";

const Footer = () => {
  const year = new Date().getFullYear();
  const { hostWhatsApp } = useTournaments();

  const whatsappLink = `https://wa.me/27${hostWhatsApp?.replace(/\D/g, "") || "0664171598"}`;

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center font-display font-black text-[#0a0a0a] text-base">
                EL
              </div>
              <span className="font-display font-bold text-lg text-white">
                EKASI <span className="gold-text">LEAGUE</span>
              </span>
            </div>
            <p className="text-[#888] text-sm leading-relaxed mb-4">
              South Africa's premier EA FC gaming tournament circuit – where
              competition meets culture.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbDdXbm1iUxVMlkBrW3U"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tournaments"
                  className="text-[#888] hover:text-gold transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-[#888] hover:text-gold transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  Admin Panel
                </Link>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888] hover:text-gold transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Host
                </a>
              </li>
              <li>
                <Link
                  to="/rules"
                  className="text-[#888] hover:text-gold transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  Rules & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* League Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              League Info
            </h4>
            <div className="space-y-3 text-sm text-[#888]">
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Monthly Tournaments</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gold flex-shrink-0" />
                <span>100+ Active Players</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Across Mzansi</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>sandiledr100@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter / Call to Action */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Stay Connected
            </h4>
            <p className="text-[#888] text-sm mb-3">
              Get the latest tournament news and slot alerts straight to your
              phone.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  "📱 Subscribe feature coming soon! For now, follow us on social media.",
                );
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="tel"
                placeholder="Your WhatsApp number"
                className="input-dark flex-1 text-sm"
                required
              />
              <button
                type="submit"
                className="btn-gold px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
            <p className="text-[#666] text-xs mt-2">
              We'll only message you about tournaments. No spam.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666]">
          <span>© {year} EKASI LEAGUE. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-gold fill-gold" /> in
            Mzansi
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
