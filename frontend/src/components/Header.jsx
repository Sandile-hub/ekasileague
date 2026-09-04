import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Trophy, Zap } from "lucide-react";
import { useTournaments } from "../context/TournamentContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { tournaments } = useTournaments();
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    if (tournaments) {
      const live = tournaments.filter((t) => t.status === "LIVE").length;
      setLiveCount(live);
    }
  }, [tournaments]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/tournaments", label: "Tournaments" },
    { path: "/admin", label: "Admin" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 gold-gradient rounded-lg flex items-center justify-center font-display font-black text-[#0a0a0a] text-sm md:text-base">
              EL
            </div>
            <div>
              <span className="font-display font-bold text-base md:text-xl tracking-tight text-white">
                EKASI <span className="gold-text">LEAGUE</span>
              </span>
              <span className="hidden sm:block text-[10px] md:text-xs text-[#888] font-medium tracking-wider -mt-0.5">
                Premier FC Gaming • Kasi Style • Live Tournaments
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Live indicator */}
            {liveCount > 0 && (
              <Link
                to="/tournaments?filter=live"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-bold hover:bg-gold/20 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 fill-gold text-gold" />
                <span>{liveCount} Live Now</span>
              </Link>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-gold bg-[#1a1a1a] border border-[#2a2a2a]"
                    : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 border-t border-[#2a2a2a]" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-[#0a0a0a]">
          {liveCount > 0 && (
            <Link
              to="/tournaments?filter=live"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-bold text-gold bg-gold/10 border border-gold/20 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-gold text-gold" />
              {liveCount} Live Now
            </Link>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive(link.path)
                  ? "text-gold bg-[#1a1a1a] border border-[#2a2a2a]"
                  : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
