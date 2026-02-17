import React from 'react'; // isDir:0 //
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display pb-24">
      {/* Top Navigation (Glassmorphism) */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">sports_esports</span>
          <span className="font-bold text-xl tracking-tighter">
            NEXUS<span className="text-primary">.GG</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass">
        <div className="flex justify-around items-center px-4 h-16 max-w-lg mx-auto">
          <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/matches" className={`flex flex-col items-center gap-1 ${isActive('/matches') ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive('/matches') ? "'FILL' 1" : "'FILL' 0" }}>trophy</span>
            <span className="text-[10px] font-medium">Matches</span>
          </Link>
          <Link to="/ranking" className={`flex flex-col items-center gap-1 ${isActive('/ranking') ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive('/ranking') ? "'FILL' 1" : "'FILL' 0" }}>leaderboard</span>
            <span className="text-[10px] font-medium">Ranking</span>
          </Link>
          <Link to="/admin" className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive('/admin') ? "'FILL' 1" : "'FILL' 0" }}>account_circle</span>
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        </div>
        {/* iPhone Safe Area Indicator Placeholder */}
        <div className="h-4 w-full flex justify-center pb-2">
          <div className="w-24 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
