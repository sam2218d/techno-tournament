import React, { useState, useEffect } from 'react';
import { getTeams, updateTeamStatus, signInWithEmail, signOut, subscribeToAuth, deleteTeam, restoreTeam } from '../services/supabase';
import { TOURNAMENT_CONFIG } from '../config';
import { Team, GameType, PaymentStatus } from '../types';
import { Button, Select, Card, Input } from '../components/UI';

const Admin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [teams, setTeams] = useState<Team[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchTeams = async () => {
        const isSuperAdmin = TOURNAMENT_CONFIG.superAdminEmails?.includes(user.email);
        const gameFilter = filter !== 'ALL' ? (filter as GameType) : undefined;
        const data = await getTeams(gameFilter, isSuperAdmin);
        setTeams(data);
      };
      fetchTeams();
    }
  }, [user, filter, refresh]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleStatusUpdate = async (teamId: string, status: PaymentStatus) => {
    if (!teamId) return;
    try {
      await updateTeamStatus(teamId, status);
      setRefresh(prev => prev + 1);
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (teamId: string, isSuperAdmin: boolean) => {
    if (!confirm(isSuperAdmin ? "Are you sure you want to PERMANENTLY delete this team?" : "Are you sure you want to delete this team?")) return;
    try {
      await deleteTeam(teamId, isSuperAdmin);
      setRefresh(prev => prev + 1);
    } catch (e) {
      alert("Failed to delete team");
    }
  };

  const handleRestore = async (teamId: string) => {
    if (!confirm("Restore this team?")) return;
    try {
      await restoreTeam(teamId);
      setRefresh(prev => prev + 1);
    } catch (e) {
      alert("Failed to restore team");
    }
  };

  const handleExportCSV = () => {
    const headers = ['Team Name', 'Game', 'Captain Phone', 'Status', 'Payment URL'];
    const rows = teams.map(t => [
      t.teamName,
      t.game,
      t.captainPhone,
      t.status,
      t.paymentScreenshotUrl || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tournament_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center text-white pt-20">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full py-8 border-neon-blue">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Card>
      </div>
    );
  }

  // Check if user is authorized admin
  // Based on your previous request, the default email is likely the admin.
  // CRITICAL: Ensure your email is in TOURNAMENT_CONFIG.adminEmails in config.ts
  const isAdmin = TOURNAMENT_CONFIG.adminEmails?.includes(user.email);
  const isSuperAdmin = TOURNAMENT_CONFIG.superAdminEmails?.includes(user.email);

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full py-8 border-red-500 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-red-500">lock</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">Your account ({user.email}) is not authorized to access the admin panel.</p>
          <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-neon-red transition-colors"
            >
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <img
              src={selectedImage}
              alt="Payment Proof"
              className="w-full h-full object-contain rounded-lg border-2 border-neon-blue shadow-[0_0_30px_rgba(0,243,255,0.3)]"
            />
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTeam(null);
          }}
        >
          <Card className="max-w-xl w-full max-h-[90vh] overflow-y-auto relative border-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.3)] bg-dark-900">
            <button
              onClick={() => setSelectedTeam(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-2xl font-bold text-white mb-1">{selectedTeam.teamName}</h3>
            <p className="text-neon-blue mb-6 text-sm">{selectedTeam.game}</p>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-300 border-b border-white/10 pb-2 flex justify-between">
                <span>Main Roster</span>
                <span className="text-xs font-normal text-gray-500">UID</span>
              </h4>
              {selectedTeam.players.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded hover:bg-white/10 transition-colors">
                  <span className="text-white font-medium">{p.name}</span>
                  <span className="text-gray-400 font-mono text-sm bg-black/30 px-2 py-1 rounded">{p.uid}</span>
                </div>
              ))}

              {selectedTeam.substitute && selectedTeam.substitute.name && (
                <>
                  <h4 className="font-bold text-gray-300 border-b border-white/10 pb-2 mt-6 flex justify-between">
                    <span>Substitute</span>
                    <span className="text-xs font-normal text-gray-500">UID</span>
                  </h4>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-yellow-500/30">
                    <span className="text-white font-medium">{selectedTeam.substitute.name}</span>
                    <span className="text-gray-400 font-mono text-sm bg-black/30 px-2 py-1 rounded">{selectedTeam.substitute.uid}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Captain Phone</p>
                <p className="text-white">{selectedTeam.captainPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">WhatsApp</p>
                <p className="text-white">{selectedTeam.captainWhatsapp}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-display font-bold text-white">Tournament Dashboard</h1>
        <div className="flex gap-4 items-center">
          <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
          <div className="w-48">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="mb-0">
              <option value="ALL">All Games</option>
              {Object.values(GameType).map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
          <Button variant="danger" onClick={handleLogout} className="px-3">
            <span className="material-symbols-outlined">logout</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center border-white/10">
          <p className="text-gray-400 text-xs uppercase">Total Teams</p>
          <p className="text-3xl font-bold text-white">{teams.length}</p>
        </Card>
        <Card className="text-center border-yellow-500/50">
          <p className="text-gray-400 text-xs uppercase">Pending</p>
          <p className="text-3xl font-bold text-yellow-500">{teams.filter(t => t.status === PaymentStatus.PENDING).length}</p>
        </Card>
        <Card className="text-center border-green-500/50">
          <p className="text-gray-400 text-xs uppercase">Approved</p>
          <p className="text-3xl font-bold text-green-500">{teams.filter(t => t.status === PaymentStatus.VERIFIED).length}</p>
        </Card>
        <Card className="text-center border-red-500/50">
          <p className="text-gray-400 text-xs uppercase">Rejected</p>
          <p className="text-3xl font-bold text-red-500">{teams.filter(t => t.status === PaymentStatus.REJECTED).length}</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-dark-900 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4 border-b border-white/10">Team</th>
                <th className="p-4 border-b border-white/10">Game</th>
                <th className="p-4 border-b border-white/10">Captain</th>
                <th className="p-4 border-b border-white/10">Proof</th>
                <th className="p-4 border-b border-white/10">Status</th>
                <th className="p-4 border-b border-white/10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No registrations found.</td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{team.teamName}</div>
                      <button
                        onClick={() => setSelectedTeam(team)}
                        className="text-xs text-neon-blue hover:text-white hover:underline flex items-center gap-1 mt-1"
                      >
                        <span className="material-symbols-outlined text-sm">groups</span>
                        {team.players.length} Players
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded border ${team.game === GameType.FREE_FIRE ? 'border-orange-500 text-orange-500' :
                        team.game === GameType.BGMI ? 'border-green-500 text-green-500' :
                          'border-purple-500 text-purple-500'
                        }`}>
                        {team.game}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">
                      <div>{team.captainPhone}</div>
                      <div className="text-xs text-gray-500">WA: {team.captainWhatsapp}</div>
                    </td>
                    <td className="p-4">
                      {team.paymentScreenshotUrl ? (
                        <button
                          onClick={() => setSelectedImage(team.paymentScreenshotUrl!)}
                          className="text-neon-blue text-sm hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          View
                        </button>
                      ) : (
                        <span className="text-gray-600 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold ${team.status === PaymentStatus.VERIFIED ? 'text-green-500' :
                        team.status === PaymentStatus.REJECTED ? 'text-red-500' :
                          'text-yellow-500'
                        }`}>
                        {team.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {team.status === PaymentStatus.PENDING && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(team.id!, PaymentStatus.VERIFIED)}
                              className="bg-green-500/20 text-green-500 p-2 hover:bg-green-500 hover:text-white transition-colors rounded"
                              title="Approve"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(team.id!, PaymentStatus.REJECTED)}
                              className="bg-red-500/20 text-red-500 p-2 hover:bg-red-500 hover:text-white transition-colors rounded"
                              title="Reject"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </>
                        )}
                        {team.status !== PaymentStatus.PENDING && <span className="text-gray-600 text-xs">-</span>}

                        {/* Restore Button (Super Admin Only) */}
                        {isSuperAdmin && team.hiddenFromAdmin && (
                          <button
                            onClick={() => handleRestore(team.id!)}
                            className="bg-blue-500/20 text-blue-500 p-2 hover:bg-blue-500 hover:text-white transition-colors rounded"
                            title="Restore Team"
                          >
                            <span className="material-symbols-outlined text-sm">restore_from_trash</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(team.id!, isSuperAdmin || false)}
                          className="bg-red-500/10 text-red-500 p-2 hover:bg-red-500 hover:text-white transition-colors rounded"
                          title={isSuperAdmin ? "Delete Permanently" : "Delete"}
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Admin;
