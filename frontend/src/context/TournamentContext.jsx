import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const TournamentContext = createContext();

export const useTournaments = () => useContext(TournamentContext);

export const TournamentProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hostWhatsApp, setHostWhatsApp] = useState('0664171598');

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tournaments');
      setTournaments(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tournaments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data && res.data.host_whatsapp) {
        setHostWhatsApp(res.data.host_whatsapp);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const createTournament = async (data) => {
    try {
      const res = await api.post('/tournaments', data);
      setTournaments(prev => [...prev, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to create' };
    }
  };

  const updateTournament = async (id, data) => {
    try {
      const res = await api.put(`/tournaments/${id}`, data);
      setTournaments(prev => prev.map(t => t.id === id ? res.data : t));
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to update' };
    }
  };

  const deleteTournament = async (id) => {
    try {
      await api.delete(`/tournaments/${id}`);
      setTournaments(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete' };
    }
  };

  const registerPlayer = async (tournamentId, data) => {
    try {
      const res = await api.post(`/tournaments/${tournamentId}/register`, data);
      setTournaments(prev =>
        prev.map(t =>
          t.id === tournamentId
            ? { ...t, slots_taken: t.slots_taken + 1, status: t.slots_taken + 1 >= t.total_slots ? 'FULL' : t.status }
            : t
        )
      );
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const getRegistrations = async (tournamentId) => {
    try {
      const res = await api.get(`/tournaments/${tournamentId}/registrations`);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to fetch' };
    }
  };

  const updateSettings = async (data) => {
    try {
      const res = await api.put('/settings', data);
      if (data.host_whatsapp) setHostWhatsApp(data.host_whatsapp);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to update' };
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchSettings();
  }, []);

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        loading,
        error,
        hostWhatsApp,
        fetchTournaments,
        createTournament,
        updateTournament,
        deleteTournament,
        registerPlayer,
        getRegistrations,
        updateSettings,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};