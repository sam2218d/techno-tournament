import React from 'react';

const Ranking: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Global Ranking</h1>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-surface-dark/40 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <span className={`text-xl font-bold w-8 ${i === 1 ? 'text-accent-yellow' : i === 2 ? 'text-slate-300' : 'text-slate-500'}`}>#{i}</span>
                        <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                        <div className="flex-1">
                            <h3 className="font-bold">Player {i}</h3>
                            <p className="text-slate-400 text-xs">2450 pts</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ranking;
