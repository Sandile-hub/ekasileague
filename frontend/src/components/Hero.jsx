import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Calendar, MapPin, Users, ArrowRight, Zap } from "lucide-react";
import { useTournaments } from "../context/TournamentContext";

const Hero = () => {
  const { tournaments } = useTournaments();

  // Find the next upcoming OPEN tournament (nearest date)
  const now = new Date();
  const upcoming = tournaments
    ?.filter((t) => t.status === "OPEN" || t.status === "LIVE")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // Count live tournaments
  const liveCount = tournaments?.filter((t) => t.status === "LIVE").length || 0;

  // Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center hero-gradient overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/10 rounded-full"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Live badge with counter */}
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
              </span>
              <span className="text-xs font-semibold text-[#aaa] tracking-wider">
                {liveCount > 0
                  ? `${liveCount} LIVE NOW`
                  : "UPCOMING TOURNAMENTS"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              <span className="text-white">PREMIER </span>
              <span className="gold-text">GAMING</span>
              <br />
              <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                KASI LEAGUE
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#aaa] mt-4 max-w-lg font-medium leading-relaxed">
              <span className="text-white font-semibold">
                Compete, connect, and conquer
              </span>{" "}
              in South Africa's premier EA FC gaming tournament circuit – where
              the streets meet the screen.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/tournaments"
                className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Upcoming Tournaments
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tournaments?filter=live"
                className="btn-outline-gold px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
                </span>
                Live Now
                {liveCount > 0 && (
                  <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-bold">
                    {liveCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <Users className="w-4 h-4 text-gold" />
                <span>100+ Players</span>
              </div>
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <Calendar className="w-4 h-4 text-gold" />
                <span>Monthly Events</span>
              </div>
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Across Mzansi</span>
              </div>
            </div>
          </div>

          {/* Right panel – dynamic next event */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 gold-gradient rounded-2xl opacity-10 blur-2xl"></div>
              <div className="relative w-full h-full bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 flex flex-col items-center justify-center glow-gold-sm">
                <div className="w-20 h-20 gold-gradient rounded-2xl flex items-center justify-center mb-6">
                  <span className="font-display font-black text-[#0a0a0a] text-3xl">
                    EL
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[#888] text-sm font-medium uppercase tracking-wider">
                    {upcoming?.status === "LIVE" ? "🔴 LIVE NOW" : "NEXT EVENT"}
                  </p>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {upcoming?.name || "Kasi Champs Cup"}
                  </h3>
                  <p className="text-gold text-sm font-semibold mt-1">
                    {upcoming
                      ? `${formatDate(upcoming.date)} • ${upcoming.time}`
                      : "5 Sept 2026 • 12:00"}
                  </p>
                  {upcoming && (
                    <>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <span className="text-[#888] text-xs">
                          R{upcoming.entry_fee} Entry
                        </span>
                        <span className="w-1 h-1 bg-[#2a2a2a] rounded-full"></span>
                        <span className="text-gold text-xs font-bold">
                          R{upcoming.prize_pool} Prize
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-[#888]"
                            >
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                        </div>
                        <span className="text-[#666] text-xs font-medium">
                          +{upcoming.total_slots - upcoming.slots_taken} slots
                          left
                        </span>
                      </div>
                    </>
                  )}
                  {!upcoming && (
                    <div className="text-[#666] text-xs mt-3">
                      Check back soon for events
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 gold-gradient/10 rounded-full blur-xl"></div>
                <div className="absolute -top-2 -left-2 w-16 h-16 gold-gradient/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
