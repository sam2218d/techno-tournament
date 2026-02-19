
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOURNAMENT_CONFIG, GAMES_CONFIG } from '../config';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { seasonName, isLive, hero, prizePool, countdownTarget } = TOURNAMENT_CONFIG;

  // Countdown Logic
  const calculateTimeLeft = () => {
    const difference = +new Date(countdownTarget) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [prizePoolAmount, setPrizePoolAmount] = useState<string>(`₹${TOURNAMENT_CONFIG.prizePool.baseAmount.toLocaleString()}`);

  useEffect(() => {
    const fetchPrizePool = async () => {
      try {
        const { getActiveTeamCount } = await import('../services/supabase');
        const activeTeams = await getActiveTeamCount();

        // Update prize pool: Increase by 1000 for every 5 teams
        const steps = Math.floor(activeTeams / TOURNAMENT_CONFIG.prizePool.incrementStep);
        const totalAmount = TOURNAMENT_CONFIG.prizePool.baseAmount + (steps * TOURNAMENT_CONFIG.prizePool.incrementAmount);

        setPrizePoolAmount(`₹${totalAmount.toLocaleString()}`);
      } catch (error) {
        console.error("Failed to fetch prize pool", error);
      }
    };

    fetchPrizePool();
    // Refresh every minute to keep it updated with new registrations
    const interval = setInterval(fetchPrizePool, 60000);

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative px-6 pt-4 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-6">
          {/* Creator Credit */}
          <a
            href={TOURNAMENT_CONFIG.creator.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-2 animate-fade-in-up hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden bg-slate-800 group-hover:scale-110 transition-transform">
              <img
                src={TOURNAMENT_CONFIG.creator.avatar}
                alt={TOURNAMENT_CONFIG.creator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(TOURNAMENT_CONFIG.creator.name)}&background=random`;
                }}
              />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">This website is created by</p>
              <p className="text-sm font-bold text-white leading-none group-hover:text-primary transition-colors flex items-center gap-1">
                {TOURNAMENT_CONFIG.creator.name}
                <span className="material-symbols-outlined text-[10px]">open_in_new</span>
              </p>
            </div>
          </a>

          {isLive && (
            <div className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-[0.2em] uppercase">
              {seasonName} is Live
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight hero-glow">
            {hero.titleLine1} <br />
            <span className="text-primary italic">{hero.titleLine2}</span>
          </h1>
          <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
            {hero.description}
          </p>

          {/* Prize Pool Highlight */}
          <div className="py-6 px-8 bg-surface-dark/80 border border-white/5 rounded-2xl inline-block shadow-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-1">Total Prize Pool</p>
            <p className="text-4xl font-bold text-white tracking-tighter">{prizePoolAmount}</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-[#0bda5e]">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold uppercase tracking-wider">{prizePool.status}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center items-center gap-4 py-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-500">Days</span>
            </div>
            <span className="text-xl text-primary font-bold animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-500">Hrs</span>
            </div>
            <span className="text-xl text-primary font-bold animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-500">Min</span>
            </div>
            <span className="text-xl text-primary font-bold animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-500">Sec</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament List */}
      <section className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Tournaments</h2>
          <Link to="/tournaments" className="text-primary text-xs font-bold flex items-center gap-1">
            SEE ALL <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        {Object.values(GAMES_CONFIG).map((game) => (
          <div key={game.id} className={`bg-surface-dark/40 rounded-xl overflow-hidden ${game.neonBorder}`}>
            <div className="h-32 relative">
              <img alt={`${game.name} Tournament Banner`} className="w-full h-full object-cover opacity-60" src={game.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent"></div>
              <div className={`absolute top-4 left-4 ${game.accentColor} ${game.name === 'BGMI' ? 'text-black' : 'text-white'} px-3 py-1 rounded text-[10px] font-black uppercase`}>
                {game.name}
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{game.name === 'Free Fire' ? 'Survival Pro Series' : game.name === 'BGMI' ? 'Battleground Masters' : 'Grand Mythic Open'}</h3>
                  <p className="text-xs text-slate-400">{game.date}, {game.time}</p>
                </div>
                <div className="text-right">
                  <p className={`${game.color} font-bold`}>{game.prize}</p>
                  <p className="text-[10px] text-slate-500">PRIZE POOL</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Entry Fee</p>
                  <p className="font-bold text-sm">{game.fee > 0 ? `₹${game.fee}` : 'Free'}</p>
                </div>

              </div>
              <button
                onClick={() => navigate(`/register?game=${game.id}`)}
                className={`w-full py-3 ${game.accentColor} ${game.name === 'BGMI' ? 'text-black' : 'text-white'} rounded-lg font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all ${game.shadowColor}`}
              >
                <span className="material-symbols-outlined">{game.name === 'Free Fire' ? 'bolt' : game.name === 'BGMI' ? 'swords' : 'magic_button'}</span> Join Tournament
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Stats Grid */}
      <section className="p-6 grid grid-cols-2 gap-4">
        <div className="bg-surface-dark p-4 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-primary mb-2">groups</span>
          <p className="text-2xl font-bold">128K</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Players</p>
        </div>
        <div className="bg-surface-dark p-4 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-primary mb-2">military_tech</span>
          <p className="text-2xl font-bold">1.2M</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Prizes Distributed</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
