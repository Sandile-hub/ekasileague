import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTournaments } from '../context/TournamentContext';
import TournamentCard from '../components/TournamentCard';
import SecureSlotModal from '../components/SecureSlotModal';
import { Trophy, Filter, ChevronDown } from 'lucide-react';

const Tournaments = () => {
  const { tournaments, loading } = useTournaments();
  const [filter, setFilter] = useState('all');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'live') {
      setFilter('live');
    }
  }, [location]);

  const filteredTournaments = tournaments.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return t.status === 'OPEN';
    if (filter === 'live') return t.status === 'LIVE';
    if (filter === 'finished') return t.status === 'FINISHED' || t.status === 'FULL';
    return true;
  });

  const handleSecureSlot = (tournament) => {
    setSelectedTournament(tournament);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    window.location.reload();
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live Now' },
    { value: 'finished', label: 'Finished' },
  ];

  const getFilterLabel = () => {
    const found = filterOptions.find(f => f.value === filter);
    return found ? found.label : 'All';
  };

  if (loading) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold font-display text-xs tracking-widest">LOADING</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 md:w-9 md:h-9 text-gold" />
            All Tournaments
          </h1>
          <p className="text-[#888] text-sm md:text-base mt-1">
            Browse all upcoming and ongoing EA FC tournaments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-sm text-[#888]">
            {filteredTournaments.length} {filteredTournaments.length === 1 ? 'tournament' : 'tournaments'} found
          </p>

          <div className="sm:hidden relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between gap-2 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gold" />
                {getFilterLabel()}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#888] transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            {showFilters && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden z-10">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilter(opt.value); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      filter === opt.value
                        ? 'text-gold bg-[#1a1a1a]'
                        : 'text-[#aaa] hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-[#141414] border border-[#2a2a2a] rounded-xl p-1">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  filter === opt.value
                    ? 'bg-gold text-[#0a0a0a]'
                    : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onSecureSlot={handleSecureSlot}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#141414] border border-[#2a2a2a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-[#444]" />
            </div>
            <h3 className="text-lg font-semibold text-white">No tournaments found</h3>
            <p className="text-[#666] text-sm mt-1">
              {filter === 'all'
                ? 'Check back soon for upcoming events.'
                : `No ${filter} tournaments at the moment.`}
            </p>
          </div>
        )}
      </div>

      {showModal && selectedTournament && (
        <SecureSlotModal
          tournament={selectedTournament}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default Tournaments;