import React, { useState, useEffect, useRef } from "react";
import { X, Search, Check } from "lucide-react";
import { useTournaments } from "../context/TournamentContext";

// ---- Full TEAMS list (EA FC 26 4-5 star clubs + 2026 World Cup nations) ----
const TEAMS = [
  // ---- PREMIER LEAGUE ----
  "Manchester City",
  "Arsenal",
  "Liverpool",
  "Chelsea",
  "Tottenham Hotspur",
  "Manchester United",
  "Newcastle United",
  "Aston Villa",
  "West Ham United",
  "Brighton & Hove Albion",
  "Wolverhampton Wanderers",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Brentford",
  "Nottingham Forest",
  "Bournemouth",
  "Sheffield United",
  "Luton Town",
  "Burnley",
  // ---- LA LIGA ----
  "Real Madrid",
  "Barcelona",
  "Atletico Madrid",
  "Sevilla",
  "Real Sociedad",
  "Real Betis",
  "Athletic Club",
  "Valencia",
  "Villarreal",
  "Girona",
  "Osasuna",
  "Rayo Vallecano",
  "Mallorca",
  "Getafe",
  "Celta Vigo",
  "Alaves",
  "Las Palmas",
  "Cadiz",
  "Granada",
  "Almeria",
  // ---- BUNDESLIGA ----
  "Bayern Munich",
  "Borussia Dortmund",
  "RB Leipzig",
  "Bayer Leverkusen",
  "Eintracht Frankfurt",
  "VfL Wolfsburg",
  "Borussia Mönchengladbach",
  "SC Freiburg",
  "TSG Hoffenheim",
  "FC Köln",
  "Mainz 05",
  "Werder Bremen",
  "VfB Stuttgart",
  "Augsburg",
  "Union Berlin",
  "Darmstadt",
  "Heidenheim",
  // ---- SERIE A ----
  "Inter Milan",
  "AC Milan",
  "Juventus",
  "Napoli",
  "Lazio",
  "Roma",
  "Atalanta",
  "Fiorentina",
  "Torino",
  "Bologna",
  "Monza",
  "Genoa",
  "Sassuolo",
  "Udinese",
  "Lecce",
  "Salernitana",
  "Empoli",
  "Frosinone",
  "Cagliari",
  "Hellas Verona",
  // ---- LIGUE 1 ----
  "Paris Saint-Germain",
  "Olympique Marseille",
  "Monaco",
  "Lyon",
  "Lille",
  "Nice",
  "Rennes",
  "Montpellier",
  "Strasbourg",
  "Lens",
  "Nantes",
  "Brest",
  "Toulouse",
  "Clermont Foot",
  "Lorient",
  "Reims",
  "Le Havre",
  "Metz",
  "Angers",
  // ---- EREDIVISIE ----
  "Ajax",
  "PSV Eindhoven",
  "Feyenoord",
  "AZ Alkmaar",
  "FC Twente",
  // ---- PRIMEIRA LIGA ----
  "Benfica",
  "Porto",
  "Sporting CP",
  "Braga",
  "Vitória Guimarães",
  // ---- BELGIAN PRO LEAGUE ----
  "Anderlecht",
  "Club Brugge",
  "Genk",
  "Standard Liège",
  // ---- OTHER EUROPEAN ----
  "Celtic",
  "Rangers",
  "Shakhtar Donetsk",
  "Dynamo Kyiv",
  "Red Bull Salzburg",
  "FC Copenhagen",
  "Galatasaray",
  "Fenerbahçe",
  "Besiktas",
  "Olympiacos",
  "PAOK",
  "Slavia Prague",
  "Sparta Prague",
  "Panathinaikos",
  "AEK Athens",
  "Maccabi Tel Aviv",
  "Dinamo Zagreb",
  "Partizan",
  "Red Star Belgrade",
  "Ferencváros",
  "Slovan Bratislava",
  // ---- MLS ----
  "LAFC",
  "Inter Miami",
  "New York Red Bulls",
  "Atlanta United",
  "Philadelphia Union",
  "Seattle Sounders",
  // ---- SAUDI PRO LEAGUE ----
  "Al-Hilal",
  "Al-Nassr",
  "Al-Ahli",
  "Al-Ittihad",
  // ---- SOUTH AMERICA ----
  "Flamengo",
  "Palmeiras",
  "River Plate",
  "Boca Juniors",
  "Fluminense",
  "São Paulo",
  "Corinthians",
  "Internacional",
  "Racing Club",
  "Independiente",
  "Colo-Colo",
  "Nacional",
  // ---- 2026 FIFA WORLD CUP NATIONS (48 teams) ----
  // Africa (CAF) – 9 slots
  "Bafana Bafana",
  "Nigeria",
  "Senegal",
  "Morocco",
  "Egypt",
  "Ghana",
  "Cameroon",
  "Algeria",
  "Tunisia",
  "Côte d'Ivoire",
  // Asia (AFC) – 8 slots
  "Japan",
  "South Korea",
  "Iran",
  "Saudi Arabia",
  "Australia",
  "Qatar",
  "United Arab Emirates",
  "Iraq",
  "Oman",
  "China PR",
  "Syria",
  "Lebanon",
  "Uzbekistan",
  // Europe (UEFA) – 16 slots
  "France",
  "England",
  "Spain",
  "Germany",
  "Italy",
  "Portugal",
  "Belgium",
  "Netherlands",
  "Croatia",
  "Switzerland",
  "Denmark",
  "Sweden",
  "Norway",
  "Austria",
  "Serbia",
  "Poland",
  "Wales",
  "Ukraine",
  "Turkey",
  "Scotland",
  "Czech Republic",
  "Slovakia",
  "Hungary",
  "Romania",
  "Greece",
  "Slovenia",
  "Iceland",
  // North & Central America (CONCACAF) – 6 slots
  "United States",
  "Mexico",
  "Canada",
  "Costa Rica",
  "Panama",
  "Jamaica",
  "Honduras",
  "El Salvador",
  // South America (CONMEBOL) – 6 slots
  "Brazil",
  "Argentina",
  "Uruguay",
  "Colombia",
  "Ecuador",
  "Peru",
  "Chile",
  "Paraguay",
  "Venezuela",
  "Bolivia",
  // Oceania (OFC) – 1 slot + playoff winners
  "New Zealand",
  "Fiji",
  "Papua New Guinea",
  "Solomon Islands",
  "Congo DR",
  "Mali",
  "Burkina Faso",
  "South Sudan",
];

const SecureSlotModal = ({ tournament, onClose, onSuccess }) => {
  const { registerPlayer, hostWhatsApp } = useTournaments();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    playerName: "",
    phone: "",
    team1: "",
    team2: "",
    team3: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTeamField, setSelectedTeamField] = useState(null);

  // Ref for the dropdown menu (used to detect clicks inside)
  const dropdownRef = useRef(null);

  const filteredTeams = TEAMS.filter((team) =>
    team.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTeamSelect = (team) => {
    if (selectedTeamField) {
      setFormData((prev) => ({ ...prev, [selectedTeamField]: team }));
      setShowDropdown(false);
      setSearchTerm("");
      setSelectedTeamField(null);
      if (errors[selectedTeamField]) {
        setErrors((prev) => ({ ...prev, [selectedTeamField]: "" }));
      }
    }
  };

  const openTeamDropdown = (field) => {
    setSelectedTeamField(field);
    setSearchTerm(formData[field] || "");
    setShowDropdown(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.playerName.trim())
      newErrors.playerName = "Player name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.team1.trim())
      newErrors.team1 = "At least one team choice is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      player_name: formData.playerName.trim(),
      phone: formData.phone.trim(),
      team1: formData.team1.trim(),
      team2: formData.team2.trim() || null,
      team3: formData.team3.trim() || null,
    };

    const result = await registerPlayer(tournament.id, payload);

    if (result.success) {
      const teams = [formData.team1.trim()];
      if (formData.team2.trim()) teams.push(formData.team2.trim());
      if (formData.team3.trim()) teams.push(formData.team3.trim());
      const teamList = teams.map((t, i) => `${i + 1}. ${t}`).join(", ");

      const message = `EKASI LEAGUE NEW ENTRY: 
Tournament: ${tournament.name}
Player: ${formData.playerName.trim()}
Phone: ${formData.phone.trim()}
Team Choices: ${teamList}`;

      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/27${hostWhatsApp.replace(/\D/g, "")}?text=${encoded}`;

      window.open(whatsappUrl, "_blank");

      onSuccess();
      setStep(2);
    } else {
      setErrors({
        submit: result.error || "Registration failed. Please try again.",
      });
    }

    setIsSubmitting(false);
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({ playerName: "", phone: "", team1: "", team2: "", team3: "" });
    setErrors({});
    setShowDropdown(false);
    setSelectedTeamField(null);
    onClose();
  };

  // Click-outside handler – uses ref to check if click is inside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown) {
        // If click is outside the dropdown AND outside the input fields that open it
        const isInsideDropdown =
          dropdownRef.current && dropdownRef.current.contains(e.target);
        const isOnInput = e.target.closest(".team-dropdown");
        if (!isInsideDropdown && !isOnInput) {
          setShowDropdown(false);
          setSelectedTeamField(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors text-[#888] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {step === 1 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Secure Your Slot
                </h2>
                <p className="text-sm text-[#888] mt-1">
                  {tournament.name} •{" "}
                  {new Date(tournament.date).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  at {tournament.time}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-[#666]">
                    Entry: R{tournament.entry_fee}
                  </span>
                  <span className="w-1 h-1 bg-[#2a2a2a] rounded-full"></span>
                  <span className="text-xs text-gold font-semibold">
                    Prize: R{tournament.prize_pool}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#ccc] mb-1.5">
                    Player Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="playerName"
                    value={formData.playerName}
                    onChange={handleChange}
                    placeholder="e.g., Thabo Mokoena"
                    className={`input-dark ${errors.playerName ? "border-red-500/50 focus:border-red-500" : ""}`}
                  />
                  {errors.playerName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.playerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#ccc] mb-1.5">
                    WhatsApp Number <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., 0821234567"
                    className={`input-dark ${errors.phone ? "border-red-500/50 focus:border-red-500" : ""}`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                  <p className="text-[#666] text-xs mt-1">
                    Include country code if outside SA
                  </p>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-[#ccc] mb-1.5">
                    Team Choices <span className="text-gold">*</span>
                  </label>
                  <p className="text-xs text-[#666] mb-2">
                    Choose up to 3 teams (club or national)
                  </p>

                  {/* Team 1 */}
                  <div className="team-dropdown relative mb-2">
                    <div
                      onClick={() => openTeamDropdown("team1")}
                      className={`input-dark cursor-pointer flex items-center justify-between ${errors.team1 ? "border-red-500/50" : ""}`}
                    >
                      <span
                        className={
                          formData.team1 ? "text-white" : "text-[#666]"
                        }
                      >
                        {formData.team1 || "Choice 1 — Select team"}
                      </span>
                      <Search className="w-4 h-4 text-[#666]" />
                    </div>
                    {errors.team1 && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.team1}
                      </p>
                    )}
                  </div>

                  {/* Team 2 */}
                  <div className="team-dropdown relative mb-2">
                    <div
                      onClick={() => openTeamDropdown("team2")}
                      className="input-dark cursor-pointer flex items-center justify-between"
                    >
                      <span
                        className={
                          formData.team2 ? "text-white" : "text-[#666]"
                        }
                      >
                        {formData.team2 || "Choice 2 — Optional"}
                      </span>
                      <Search className="w-4 h-4 text-[#666]" />
                    </div>
                  </div>

                  {/* Team 3 */}
                  <div className="team-dropdown relative">
                    <div
                      onClick={() => openTeamDropdown("team3")}
                      className="input-dark cursor-pointer flex items-center justify-between"
                    >
                      <span
                        className={
                          formData.team3 ? "text-white" : "text-[#666]"
                        }
                      >
                        {formData.team3 || "Choice 3 — Optional"}
                      </span>
                      <Search className="w-4 h-4 text-[#666]" />
                    </div>
                  </div>

                  {/* Dropdown menu with ref */}
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-20 left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl max-h-48 overflow-y-auto shadow-xl"
                    >
                      <div className="p-2 sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a]">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search teams..."
                          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#666] focus:outline-none focus:border-gold"
                          autoFocus
                        />
                      </div>
                      <div className="p-1">
                        {filteredTeams.length > 0 ? (
                          filteredTeams.map((team) => (
                            <button
                              key={team}
                              type="button"
                              onClick={() => handleTeamSelect(team)}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#ccc] hover:bg-[#2a2a2a] hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <span>{team}</span>
                              {formData[selectedTeamField] === team && (
                                <Check className="w-4 h-4 text-gold" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="text-center text-[#666] text-sm py-4">
                            No teams found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Secure Slot via WhatsApp
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#0a0a0a]" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-white">Slot Secured! 🎮</h3>
              <p className="text-[#aaa] mt-2 text-sm">
                You're in! Check your WhatsApp for confirmation.
              </p>
              <p className="text-[#666] text-xs mt-1">
                {tournament.name} —{" "}
                {new Date(tournament.date).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <button
                onClick={resetAndClose}
                className="mt-6 btn-gold px-8 py-2.5 rounded-xl text-sm font-bold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecureSlotModal;
