import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameType } from '../types';
import { GAMES_CONFIG, TOURNAMENT_CONFIG } from '../config';
import { registerTeam, uploadScreenshot } from '../services/supabase';
import { generateTeamName } from '../services/geminiService';
import { Button, Input, Select, Card } from '../components/UI';

const Register: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialGameId = queryParams.get('game');

  const [game, setGame] = useState<GameType>(
    initialGameId === 'bgmi' ? GameType.BGMI :
      GameType.FREE_FIRE
  );

  const [teamName, setTeamName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainWhatsapp, setCaptainWhatsapp] = useState('');

  const [players, setPlayers] = useState([
    { name: '', uid: '' },
    { name: '', uid: '' },
    { name: '', uid: '' },
    { name: '', uid: '' },
  ]);
  const [substitute, setSubstitute] = useState<{ name: string; uid: string } | undefined>(undefined);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingName, setGeneratingName] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const currentGameConfig = GAMES_CONFIG[game];

  const handlePlayerChange = (index: number, field: 'name' | 'uid', value: string) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleAiNameGen = async () => {
    setGeneratingName(true);
    const name = await generateTeamName(game);
    setTeamName(name);
    setGeneratingName(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!file) {
      setError('Please upload the payment screenshot.');
      setLoading(false);
      return;
    }

    try {
      // 1. Upload Screenshot
      const screenshotUrl = await uploadScreenshot(file, teamName);

      // 2. Save Team Data
      const teamData = {
        teamName,
        game,
        players,
        substitute: substitute?.name ? substitute : undefined,
        captainPhone,
        captainWhatsapp,
        paymentScreenshotUrl: screenshotUrl,
      };

      await registerTeam(teamData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center py-12 border-neon-green">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-400 mb-8">
            Your team <span className="text-white font-bold">{teamName}</span> has been registered for {game}.
            Wait for admin approval.
          </p>
          <div className="space-y-4">
            <a
              href="https://chat.whatsapp.com/invite/placeholder"
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-[#25D366] text-white font-bold py-3 rounded hover:bg-[#128C7E] transition-colors"
            >
              Join WhatsApp Group
            </a>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-white mb-8 text-center">Team Registration</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Game & Team Info */}
            <Card>
              <h3 className="text-xl font-display font-bold text-neon-blue mb-6 border-b border-white/10 pb-2">Team Details</h3>

              <Select
                label="Select Game"
                value={game}
                onChange={(e) => setGame(e.target.value as GameType)}
              >
                {Object.values(GameType).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Team Name"
                    placeholder="Enter Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="mb-4 h-[50px]"
                  onClick={handleAiNameGen}
                  disabled={generatingName}
                >
                  {generatingName ? '...' : 'AI Gen'}
                </Button>
              </div>
            </Card>

            {/* Players Info */}
            <Card>
              <h3 className="text-xl font-display font-bold text-neon-blue mb-6 border-b border-white/10 pb-2">Squad Roster</h3>
              <div className="space-y-6">
                {players.map((player, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-4">
                    <Input
                      label={`Player ${idx + 1} Name`}
                      placeholder="In-Game Name"
                      value={player.name}
                      onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                      required
                    />
                    <Input
                      label="UID / ID"
                      placeholder="Game ID"
                      value={player.uid}
                      onChange={(e) => handlePlayerChange(idx, 'uid', e.target.value)}
                      required
                    />
                  </div>
                ))}

                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-gray-500 mb-2 uppercase font-bold">Substitute (Optional)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Sub Name"
                      value={substitute?.name || ''}
                      onChange={(e) => setSubstitute(prev => ({ ...prev, name: e.target.value, uid: prev?.uid || '' }))}
                    />
                    <Input
                      placeholder="Sub UID"
                      value={substitute?.uid || ''}
                      onChange={(e) => setSubstitute(prev => ({ ...prev, uid: e.target.value, name: prev?.name || '' }))}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card>
              <h3 className="text-xl font-display font-bold text-neon-blue mb-6 border-b border-white/10 pb-2">Contact Info</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={captainPhone}
                  onChange={(e) => setCaptainPhone(e.target.value)}
                  required
                />
                <Input
                  label="WhatsApp Number"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={captainWhatsapp}
                  onChange={(e) => setCaptainWhatsapp(e.target.value)}
                  required
                />
              </div>
            </Card>

            <Button type="submit" className="w-full text-lg py-4" disabled={loading}>
              {loading ? 'Processing...' : `Submit & Pay ₹${currentGameConfig.fee}`}
            </Button>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded text-center">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Payment Sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 border-neon-purple/50">
            <h3 className="text-xl font-display font-bold text-white mb-4 text-center">Payment Details</h3>

            <div className="bg-white p-4 rounded mb-6 mx-auto w-48 h-48 flex items-center justify-center">
              {TOURNAMENT_CONFIG.payment?.qrCodeImage ? (
                <img
                  src={TOURNAMENT_CONFIG.payment.qrCodeImage}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${TOURNAMENT_CONFIG.payment?.upiId || 'tournament@upi'}&pn=PrayuktiTechfest&am=${currentGameConfig.fee}&cu=INR`}
                  alt="UPI QR Code"
                  className="w-full h-full"
                />
              )}
            </div>

            <div className="text-center mb-6 space-y-2">
              <p className="text-gray-400 text-sm">Scan QR to pay</p>
              <p className="text-3xl font-bold text-white">₹{currentGameConfig.fee}</p>
              <p className="text-xs text-gray-500">UPI ID: {TOURNAMENT_CONFIG.payment?.upiId || 'tournament@upi'}</p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-bold text-gray-300 mb-2">Upload Payment Screenshot</label>
              <div className="relative border-2 border-dashed border-gray-600 rounded bg-dark-900/50 hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-6 text-center">
                  {file ? (
                    <p className="text-neon-blue text-sm truncate">{file.name}</p>
                  ) : (
                    <>
                      <svg className="mx-auto h-8 w-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <span className="text-xs text-gray-500">Click to upload</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
