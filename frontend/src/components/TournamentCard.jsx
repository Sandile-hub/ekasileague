import React from "react";
import { Calendar, Clock, MapPin, Coins, Trophy, Users } from "lucide-react";

const TournamentCard = ({ tournament, onSecureSlot }) => {
  const {
    id,
    name,
    date,
    time,
    location,
    entry_fee,
    prize_pool,
    status,
    total_slots,
    slots_taken,
  } = tournament;

  const slotsLeft = total_slots - slots_taken;
  const percentFilled = Math.min((slots_taken / total_slots) * 100, 100);

  const statusMap = {
    OPEN: { label: "OPEN", className: "status-open" },
    FULL: { label: "FULL", className: "status-full" },
    LIVE: { label: "LIVE NOW", className: "status-live" },
    FINISHED: { label: "FINISHED", className: "status-finished" },
  };

  const statusInfo = statusMap[status] || statusMap.OPEN;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="card-dark p-5 sm:p-6 hover:translate-y-[-4px] transition-all duration-300 glow-gold-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base sm:text-lg font-bold text-white leading-tight flex-1">
          {name}
        </h3>
        <span
          className={`status-badge ${statusInfo.className} whitespace-nowrap text-[10px] sm:text-xs`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-[#aaa] mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-gold" />
          <span className="text-white font-semibold">R{entry_fee}</span>
          <span className="text-[#666]">entry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-gold" />
          <span className="text-white font-semibold">R{prize_pool}</span>
          <span className="text-[#666]">prize</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-[#888] mb-1.5">
          <span className="font-medium">
            {slotsLeft} / {total_slots} slots left
          </span>
          <span>{Math.round(percentFilled)}% filled</span>
        </div>
        <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full gold-gradient rounded-full transition-all duration-500"
            style={{ width: `${percentFilled}%` }}
          ></div>
        </div>
      </div>

      {status === "OPEN" && (
        <button
          onClick={() => onSecureSlot(tournament)}
          className="w-full btn-gold py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          Secure My Slot
        </button>
      )}
      {status === "LIVE" && (
        <button
          disabled
          className="w-full bg-[#1a1a1a] text-gold border border-gold/30 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-70"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
          </span>
          LIVE NOW
        </button>
      )}
      {(status === "FULL" || status === "FINISHED") && (
        <button
          disabled
          className="w-full bg-[#1a1a1a] text-[#666] py-2.5 rounded-xl text-sm font-bold cursor-not-allowed"
        >
          {status === "FULL" ? "FULLY BOOKED" : "FINISHED"}
        </button>
      )}
    </div>
  );
};

export default TournamentCard;
