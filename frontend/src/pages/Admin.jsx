import React, { useState, useEffect } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { Shield, Plus, Edit, Trash2, X, Eye, Users, Phone, Calendar, MapPin, Coins, Trophy } from 'lucide-react';

const Admin = () => {
  const { tournaments, createTournament, updateTournament, deleteTournament, getRegistrations, hostWhatsApp, updateSettings } = useTournaments();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(null);
  const [registrationsData, setRegistrationsData] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    entry_fee: '',
    prize_pool: '',
    status: 'OPEN',
    total_slots: '',
  });
  const [settingsForm, setSettingsForm] = useState({
    host_whatsapp: hostWhatsApp || '0664171598',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ekasi123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      location: '',
      entry_fee: '',
      prize_pool: '',
      status: 'OPEN',
      total_slots: '',
    });
    setFormErrors({});
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...formData,
      entry_fee: parseFloat(formData.entry_fee),
      prize_pool: parseFloat(formData.prize_pool),
      total_slots: parseInt(formData.total_slots),
    };

    const result = await createTournament(payload);
    if (result.success) {
      setShowCreateModal(false);
      resetForm();
    } else {
      setFormErrors({ submit: result.error });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...formData,
      entry_fee: parseFloat(formData.entry_fee),
      prize_pool: parseFloat(formData.prize_pool),
      total_slots: parseInt(formData.total_slots),
    };

    const result = await updateTournament(editingTournament.id, payload);
    if (result.success) {
      setShowEditModal(false);
      setEditingTournament(null);
      resetForm();
    } else {
      setFormErrors({ submit: result.error });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament? All registrations will be lost.')) {
      await deleteTournament(id);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.date) errors.date = 'Date is required';
    if (!data.time) errors.time = 'Time is required';
    if (!data.location.trim()) errors.location = 'Location is required';
    if (!data.entry_fee || parseFloat(data.entry_fee) < 0) errors.entry_fee = 'Valid entry fee is required';
    if (!data.prize_pool || parseFloat(data.prize_pool) < 0) errors.prize_pool = 'Valid prize pool is required';
    if (!data.total_slots || parseInt(data.total_slots) < 1) errors.total_slots = 'At least 1 slot is required';
    return errors;
  };

  const openEditModal = (tournament) => {
    setEditingTournament(tournament);
    setFormData({
      name: tournament.name,
      date: tournament.date,
      time: tournament.time,
      location: tournament.location,
      entry_fee: tournament.entry_fee.toString(),
      prize_pool: tournament.prize_pool.toString(),
      status: tournament.status,
      total_slots: tournament.total_slots.toString(),
    });
    setShowEditModal(true);
  };

  const openRegistrations = async (tournamentId) => {
    setShowRegistrations(tournamentId);
    setLoadingRegistrations(true);
    const result = await getRegistrations(tournamentId);
    if (result.success) {
      setRegistrationsData(result.data);
    } else {
      setRegistrationsData([]);
    }
    setLoadingRegistrations(false);
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    const result = await updateSettings({ host_whatsapp: settingsForm.host_whatsapp });
    if (result.success) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="w-full max-w-sm bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 glow-gold-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-7 h-7 text-[#0a0a0a]" />
            </div>
            <h2 className="text-xl font-bold text-white">Admin Access</h2>
            <p className="text-sm text-[#888] mt-0.5">Enter the admin password to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input-dark mb-3"
              autoFocus
            />
            {loginError && (
              <p className="text-red-400 text-sm mb-3">{loginError}</p>
            )}
            <button type="submit" className="w-full btn-gold py-3 rounded-xl text-sm font-bold">
              Unlock Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-gold" />
              Admin Panel
            </h1>
            <p className="text-[#888] text-sm mt-0.5">Manage tournaments, registrations, and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { resetForm(); setShowCreateModal(true); }}
              className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Tournament
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#2a2a2a] px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gold" />
            Host WhatsApp Number
          </h3>
          <form onSubmit={handleSettingsUpdate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={settingsForm.host_whatsapp}
              onChange={(e) => setSettingsForm({ host_whatsapp: e.target.value })}
              placeholder="e.g., 0664171598"
              className="input-dark flex-1"
            />
            <button type="submit" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap">
              Update
            </button>
          </form>
          {settingsSaved && (
            <p className="text-green-400 text-sm mt-2">✓ Settings updated successfully</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            All Tournaments
          </h2>

          {tournaments.length === 0 ? (
            <div className="text-center py-12 bg-[#141414] border border-[#2a2a2a] rounded-2xl">
              <p className="text-[#666] text-sm">No tournaments yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 hover:border-gold/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white truncate">{t.name}</h4>
                      <span className={`status-badge ${t.status === 'OPEN' ? 'status-open' : t.status === 'FULL' ? 'status-full' : t.status === 'LIVE' ? 'status-live' : 'status-finished'} text-[9px]`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#888] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(t.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {t.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {t.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-gold" />
                        R{t.entry_fee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-gold" />
                        R{t.prize_pool}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {t.slots_taken}/{t.total_slots}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => openRegistrations(t.id)}
                      className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#aaa] hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Registrations
                    </button>
                    <button
                      onClick={() => openEditModal(t)}
                      className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#aaa] hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="bg-[#1a1a1a] hover:bg-red-500/20 text-[#888] hover:text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <AdminModal
          title="Create Tournament"
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleCreate}
          onClose={() => { setShowCreateModal(false); resetForm(); }}
          submitLabel="Create"
        />
      )}

      {showEditModal && editingTournament && (
        <AdminModal
          title="Edit Tournament"
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleEdit}
          onClose={() => { setShowEditModal(false); setEditingTournament(null); resetForm(); }}
          submitLabel="Update"
        />
      )}

      {showRegistrations && (
        <RegistrationsModal
          tournamentId={showRegistrations}
          tournament={tournaments.find(t => t.id === showRegistrations)}
          registrations={registrationsData}
          loading={loadingRegistrations}
          onClose={() => { setShowRegistrations(null); setRegistrationsData([]); }}
        />
      )}
    </div>
  );
};

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" />
    <path d="M12 6v6l4 2" stroke="currentColor" />
  </svg>
);

const AdminModal = ({ title, formData, setFormData, formErrors, onSubmit, onClose, submitLabel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay">
      <div className="relative w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors text-[#888] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Tournament Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Kasi Champs Cup"
                className={`input-dark ${formErrors.name ? 'border-red-500/50' : ''}`}
              />
              {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`input-dark ${formErrors.date ? 'border-red-500/50' : ''}`}
                />
                {formErrors.date && <p className="text-red-400 text-xs mt-1">{formErrors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`input-dark ${formErrors.time ? 'border-red-500/50' : ''}`}
                />
                {formErrors.time && <p className="text-red-400 text-xs mt-1">{formErrors.time}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Phola, WhiteRiver"
                className={`input-dark ${formErrors.location ? 'border-red-500/50' : ''}`}
              />
              {formErrors.location && <p className="text-red-400 text-xs mt-1">{formErrors.location}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Entry Fee (R) *</label>
                <input
                  type="number"
                  name="entry_fee"
                  value={formData.entry_fee}
                  onChange={handleChange}
                  placeholder="30"
                  className={`input-dark ${formErrors.entry_fee ? 'border-red-500/50' : ''}`}
                  min="0"
                  step="0.01"
                />
                {formErrors.entry_fee && <p className="text-red-400 text-xs mt-1">{formErrors.entry_fee}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Prize Pool (R) *</label>
                <input
                  type="number"
                  name="prize_pool"
                  value={formData.prize_pool}
                  onChange={handleChange}
                  placeholder="500"
                  className={`input-dark ${formErrors.prize_pool ? 'border-red-500/50' : ''}`}
                  min="0"
                  step="0.01"
                />
                {formErrors.prize_pool && <p className="text-red-400 text-xs mt-1">{formErrors.prize_pool}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Total Slots *</label>
              <input
                type="number"
                name="total_slots"
                value={formData.total_slots}
                onChange={handleChange}
                placeholder="32"
                className={`input-dark ${formErrors.total_slots ? 'border-red-500/50' : ''}`}
                min="1"
              />
              {formErrors.total_slots && <p className="text-red-400 text-xs mt-1">{formErrors.total_slots}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#ccc] mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select-dark"
              >
                <option value="OPEN">OPEN</option>
                <option value="FULL">FULL</option>
                <option value="LIVE">LIVE NOW</option>
                <option value="FINISHED">FINISHED</option>
              </select>
            </div>

            {formErrors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {formErrors.submit}
              </div>
            )}

            <button type="submit" className="w-full btn-gold py-3 rounded-xl text-sm font-bold">
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const RegistrationsModal = ({ tournamentId, tournament, registrations, loading, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors text-[#888] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            Registrations
          </h2>
          <p className="text-sm text-[#888] mt-0.5">
            {tournament?.name} — {tournament?.slots_taken}/{tournament?.total_slots} slots filled
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 text-[#666] text-sm">
              No registrations yet for this tournament.
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {registrations.map((reg, idx) => (
                <div key={reg.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {idx + 1}. {reg.player_name}
                      </p>
                      <p className="text-xs text-[#888]">{reg.phone}</p>
                    </div>
                    <div className="text-xs text-right">
                      <span className="text-[#666]">Teams:</span>
                      <div className="text-gold font-medium">
                        {reg.team1}
                        {reg.team2 && `, ${reg.team2}`}
                        {reg.team3 && `, ${reg.team3}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;