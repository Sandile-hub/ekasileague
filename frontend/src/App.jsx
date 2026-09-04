import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import Admin from './pages/Admin';
import Rules from './pages/Rules';   // <-- import new page
import Header from './components/Header';
import Footer from './components/Footer';
import { TournamentProvider } from './context/TournamentContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold font-display text-sm tracking-widest">LOADING</p>
        </div>
      </div>
    );
  }

  return (
    <TournamentProvider>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/rules" element={<Rules />} />   {/* <-- new route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </TournamentProvider>
  );
}

export default App;