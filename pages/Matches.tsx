import React from 'react';

const Matches: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Upcoming Matches</h1>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-surface-dark/40 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Match #{i}</h3>
                            <p className="text-slate-400 text-sm">Today, 20:00</p>
                        </div>
                        <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-bold">Watch</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Matches;
