import React, { useState, useRef, useEffect } from 'react';
import { Crown, AlertTriangle, Key, Plus, Trash2, Pencil, RefreshCw, X, Image as ImageIcon, Terminal, UserCircle, Save, FolderOpen, Shield, Code2, Server, Layout, Settings } from 'lucide-react';
import { Team, Tournament } from '../types';

interface VipSectionProps {
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  onClose: () => void;
}

export const VipSection: React.FC<VipSectionProps> = ({ tournaments, setTournaments, onClose }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTournamentId, setActiveTournamentId] = useState<string>(tournaments[0]?.id || '');
  const [newTournamentName, setNewTournamentName] = useState('');
  const [showTournamentInput, setShowTournamentInput] = useState(false);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLeader, setNewTeamLeader] = useState('');
  const [newTeamStats, setNewTeamStats] = useState({ position: 0, points: 0, wins: 0, losses: 0 });
  const [newTeamPlayers, setNewTeamPlayers] = useState<string[]>([]);
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTournament = tournaments.find(t => t.id === activeTournamentId);

  useEffect(() => {
    if (tournaments.length > 0 && !activeTournament) {
      setActiveTournamentId(tournaments[0].id);
    }
  }, [tournaments, activeTournament]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'T91X') {
      setIsUnlocked(true);
    } else {
      setError('Invalid Access Key');
    }
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTournamentName.trim()) return;
    const newTourney: Tournament = {
      id: Date.now().toString(),
      name: newTournamentName.toUpperCase(),
      teams: []
    };
    setTournaments([...tournaments, newTourney]);
    setActiveTournamentId(newTourney.id);
    setNewTournamentName('');
    setShowTournamentInput(false);
  };

  const handleDeleteTournament = (id: string) => {
    if (tournaments.length <= 1) {
      alert("Cannot delete the last tournament.");
      return;
    }
    if (confirm('WARNING: Delete this tournament and all its data?')) {
      const remaining = tournaments.filter(t => t.id !== id);
      setTournaments(remaining);
      if (activeTournamentId === id) setActiveTournamentId(remaining[0].id);
    }
  };

  const updateActiveTournamentTeams = (updatedTeams: Team[]) => {
    setTournaments(tournaments.map(t => 
      t.id === activeTournamentId ? { ...t, teams: updatedTeams } : t
    ));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewTeamLogo(URL.createObjectURL(file));
    }
  };

  const addPlayerToDraft = () => {
    if (currentPlayerName.trim() && newTeamPlayers.length < 4) {
      setNewTeamPlayers([...newTeamPlayers, currentPlayerName]);
      setCurrentPlayerName('');
    }
  };

  const removePlayerFromDraft = (index: number) => {
    setNewTeamPlayers(newTeamPlayers.filter((_, i) => i !== index));
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewTeamName('');
    setNewTeamLeader('');
    setNewTeamStats({ position: 0, points: 0, wins: 0, losses: 0 });
    setNewTeamPlayers([]);
    setNewTeamLogo(null);
    setShowTeamModal(true);
  };

  const openEditModal = (team: Team) => {
    setEditingId(team.id);
    setNewTeamName(team.name);
    setNewTeamLeader(team.leaderName);
    setNewTeamStats({ ...team.stats });
    setNewTeamPlayers(team.players.map(p => p.name));
    setNewTeamLogo(team.logo);
    setShowTeamModal(true);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Delete this team permanently?')) {
      updateActiveTournamentTeams(activeTournament!.teams.filter(t => t.id !== teamId));
    }
  };

  const handleDeleteAllTeams = () => {
    if (confirm('CRITICAL: Delete ALL TEAMS from this tournament?')) {
      updateActiveTournamentTeams([]);
    }
  };

  const handleResetStats = () => {
    if (confirm('Reset all points/wins/losses to 0? Teams will remain.')) {
      updateActiveTournamentTeams(activeTournament!.teams.map(t => ({
        ...t,
        stats: { ...t.stats, wins: 0, losses: 0, points: 0 }
      })));
    }
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;

    let updatedTeams = [...(activeTournament?.teams || [])];

    if (editingId) {
      updatedTeams = updatedTeams.map(t => t.id === editingId ? {
        ...t,
        name: newTeamName,
        leaderName: newTeamLeader || 'Unknown',
        logo: newTeamLogo,
        players: newTeamPlayers.map(name => ({ id: Math.random().toString(), name })),
        stats: newTeamStats,
      } : t);
    } else {
      updatedTeams.push({
        id: Date.now().toString(),
        name: newTeamName,
        leaderName: newTeamLeader || 'Unknown',
        logo: newTeamLogo || `https://picsum.photos/200/200?random=${Date.now()}`,
        players: newTeamPlayers.map(name => ({ id: Math.random().toString(), name })),
        stats: newTeamStats,
      });
    }
    
    updateActiveTournamentTeams(updatedTeams);
    setShowTeamModal(false);
  };

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-pro-main/95 backdrop-blur-md p-4 animate-fade-in">
        <div className="w-full max-w-md bg-pro-card border border-pro-border rounded-xl shadow-2xl">
           <div className="p-8 text-center">
             <div className="mx-auto w-16 h-16 bg-pro-light rounded-full flex items-center justify-center mb-6 shadow-inner">
               <Shield className="w-8 h-8 text-gold" />
             </div>
             <h2 className="text-2xl font-display font-bold text-white mb-1 uppercase tracking-wider">League Operations</h2>
             <p className="text-xs text-pro-text font-mono mb-8 uppercase tracking-widest">Admin Authorization</p>
             
             <form onSubmit={handleUnlock}>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="ENTER ACCESS KEY"
                 className="w-full bg-pro-main border border-pro-border text-white text-center text-xl tracking-[0.5em] py-4 mb-4 focus:border-gold outline-none font-mono transition-colors rounded-lg uppercase"
                 autoFocus
               />
               {error && <p className="text-red-400 text-xs mb-4 font-mono uppercase bg-red-900/10 py-2 border border-red-500/20 rounded">{error}</p>}
               
               <div className="flex gap-3 mt-6">
                  <button type="button" onClick={onClose} className="flex-1 py-3 text-pro-text hover:text-white font-mono text-xs uppercase border border-pro-border hover:border-white/50 rounded transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-gold hover:bg-yellow-500 text-black font-bold font-mono uppercase tracking-wider transition-colors rounded">Verify</button>
               </div>
             </form>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-pro-main text-white font-sans animate-fade-in">
      {/* Header */}
      <div className="h-16 bg-pro-card border-b border-pro-border flex items-center justify-between px-6 z-20 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
             <Settings className="w-5 h-5 text-black" />
           </div>
           <div>
             <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white">League<span className="text-gold">Admin</span></h2>
             <p className="text-[10px] text-pro-text font-mono">Control Panel</p>
           </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-pro-light text-pro-text hover:text-white rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-pro-card border-r border-pro-border flex flex-col">
          <div className="p-4 border-b border-pro-border">
             <button 
                onClick={() => setShowTournamentInput(true)}
                className="w-full py-3 bg-pro-light border border-pro-border text-white text-xs font-mono font-bold uppercase hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2 rounded"
             >
               <Plus className="w-3 h-3" /> New League
             </button>
          </div>
          
          {showTournamentInput && (
            <form onSubmit={handleCreateTournament} className="p-4 bg-pro-main/50 border-b border-pro-border">
               <label className="text-[10px] text-gold uppercase font-mono font-bold block mb-1">League Name</label>
               <input 
                 autoFocus
                 className="w-full bg-pro-main border border-pro-border p-2 text-xs text-white mb-2 font-mono outline-none focus:border-gold rounded"
                 placeholder="NAME..."
                 value={newTournamentName}
                 onChange={e => setNewTournamentName(e.target.value)}
               />
               <div className="flex gap-2">
                 <button type="button" onClick={() => setShowTournamentInput(false)} className="flex-1 bg-pro-light text-[9px] py-1.5 hover:bg-pro-border text-white rounded">CANCEL</button>
                 <button type="submit" className="flex-1 bg-gold text-black text-[9px] py-1.5 font-bold hover:bg-yellow-500 rounded">CREATE</button>
               </div>
            </form>
          )}

          <div className="flex-1 overflow-y-auto py-2">
            <h3 className="px-4 py-2 text-[10px] font-mono text-pro-text uppercase tracking-widest font-bold opacity-70">Tournaments</h3>
            {tournaments.map(t => (
              <div 
                key={t.id} 
                className={`px-4 py-3 cursor-pointer border-l-4 transition-all flex items-center justify-between group ${
                  activeTournamentId === t.id 
                  ? 'bg-pro-light border-gold text-white shadow-inner' 
                  : 'border-transparent text-pro-text hover:bg-pro-light/50 hover:text-white'
                }`}
                onClick={() => setActiveTournamentId(t.id)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                   <FolderOpen className={`w-4 h-4 flex-shrink-0 ${activeTournamentId === t.id ? 'text-gold' : ''}`} />
                   <span className="font-display font-bold uppercase truncate tracking-wide text-sm">{t.name}</span>
                </div>
                {tournaments.length > 1 && (
                   <button onClick={(e) => { e.stopPropagation(); handleDeleteTournament(t.id); }} className="opacity-0 group-hover:opacity-100 text-pro-text hover:text-red-500 transition-opacity">
                     <Trash2 className="w-3 h-3" />
                   </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-pro-main relative">
           
           {activeTournament ? (
             <>
               <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-pro-border bg-pro-card/50">
                  <div>
                    <h1 className="text-3xl font-display font-bold uppercase text-white tracking-wide">
                      {activeTournament.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-mono uppercase rounded border border-green-500/20">Active Database</span>
                      <span className="text-pro-text text-xs">•</span>
                      <span className="text-[10px] text-pro-text font-mono uppercase">{activeTournament.teams.length} Teams Registered</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={handleResetStats} className="px-4 py-2 bg-pro-card border border-pro-border text-[10px] font-mono uppercase hover:bg-pro-light text-white flex items-center gap-2 transition-colors rounded">
                        <RefreshCw className="w-3 h-3" /> Reset Stats
                     </button>
                     <button onClick={handleDeleteAllTeams} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono uppercase hover:bg-red-500/20 flex items-center gap-2 transition-colors rounded">
                        <Trash2 className="w-3 h-3" /> Purge All
                     </button>
                     <button onClick={openAddModal} className="px-5 py-2 bg-white text-black font-bold font-mono text-xs uppercase hover:bg-gold flex items-center gap-2 transition-colors rounded shadow-lg">
                        <Plus className="w-3 h-3" /> Add Team
                     </button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8">
                 {activeTournament.teams.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-pro-text font-mono border-2 border-dashed border-pro-border m-4 rounded-xl">
                       <Layout className="w-16 h-16 mb-4 opacity-20" />
                       <p className="text-sm uppercase tracking-widest font-bold">No Teams in Registry</p>
                       <p className="text-xs opacity-50 mt-2">Use the "Add Team" button to begin</p>
                    </div>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                      {activeTournament.teams.map(team => (
                        <div key={team.id} className="bg-pro-card border border-pro-border p-5 rounded-lg flex gap-5 group hover:border-gold transition-all duration-300 relative shadow-sm hover:shadow-lg">
                           
                           <div className="w-20 h-20 bg-pro-light rounded-lg border border-pro-border flex-shrink-0 overflow-hidden">
                             {team.logo && <img src={team.logo} className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                 <div>
                                   <h3 className="font-display font-bold text-2xl text-white uppercase group-hover:text-gold truncate transition-colors">{team.name}</h3>
                                   <p className="text-[10px] text-pro-text font-mono uppercase font-bold">ID: {team.id.substring(0,8)}</p>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-pro-border font-mono text-xs">
                                 <div className="text-center border-r border-pro-border">
                                    <div className="text-[9px] text-pro-text uppercase font-bold">Rank</div>
                                    <div className="font-bold text-white text-lg">{team.stats.position}</div>
                                 </div>
                                 <div className="text-center border-r border-pro-border">
                                    <div className="text-[9px] text-pro-text uppercase font-bold">Pts</div>
                                    <div className="font-bold text-gold text-lg">{team.stats.points}</div>
                                 </div>
                                 <div className="text-center border-r border-pro-border">
                                    <div className="text-[9px] text-pro-text uppercase font-bold">W</div>
                                    <div className="text-white text-lg">{team.stats.wins}</div>
                                 </div>
                                 <div className="text-center">
                                    <div className="text-[9px] text-pro-text uppercase font-bold">L</div>
                                    <div className="text-white text-lg">{team.stats.losses}</div>
                                 </div>
                              </div>
                           </div>

                           <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEditModal(team)} className="p-2 bg-pro-light hover:bg-white text-white hover:text-black transition-colors rounded"><Pencil className="w-3 h-3" /></button>
                              <button onClick={() => handleDeleteTeam(team.id)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors rounded"><Trash2 className="w-3 h-3" /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
               </div>
             </>
           ) : (
             <div className="flex-1 flex items-center justify-center text-pro-text font-mono uppercase tracking-widest font-bold">
                <p>Select a Tournament to Manage</p>
             </div>
           )}
        </div>
      </div>

      {/* Edit Modal */}
      {showTeamModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-pro-main/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-pro-card w-full max-w-2xl border border-pro-border rounded-xl shadow-2xl overflow-hidden">
              
              <div className="p-6 border-b border-pro-border flex justify-between items-center bg-pro-light">
                <h2 className="font-display font-bold text-2xl uppercase text-white flex items-center gap-3">
                   <UserCircle className="w-6 h-6 text-gold" />
                   {editingId ? 'Edit Registration' : 'New Team Entry'}
                </h2>
                <button onClick={() => setShowTeamModal(false)} className="text-pro-text hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSaveTeam} className="p-8 space-y-8">
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-mono text-pro-text uppercase font-bold mb-2">Team Name</label>
                    <input 
                      type="text" 
                      required
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full bg-pro-main border border-pro-border rounded p-3 text-white font-mono focus:border-gold outline-none transition-colors text-sm uppercase"
                      placeholder="NAME"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-pro-text uppercase font-bold mb-2">Captain Name</label>
                    <input 
                      type="text" 
                      required
                      value={newTeamLeader}
                      onChange={(e) => setNewTeamLeader(e.target.value)}
                      className="w-full bg-pro-main border border-pro-border rounded p-3 text-white font-mono focus:border-gold outline-none transition-colors text-sm uppercase"
                      placeholder="CAPTAIN"
                    />
                  </div>
                </div>

                 <div>
                    <label className="block text-[10px] font-mono text-pro-text uppercase font-bold mb-2">Team Logo</label>
                    <div className="flex items-center gap-4 bg-pro-light/30 p-4 border border-pro-border rounded">
                      <div className="w-16 h-16 bg-pro-card border border-pro-border rounded flex items-center justify-center overflow-hidden">
                        {newTeamLogo ? <img src={newTeamLogo} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-pro-text" />}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="text-[10px] text-pro-text file:mr-4 file:py-2 file:px-4 file:bg-gold file:text-black file:border-0 file:font-mono file:uppercase file:font-bold file:rounded cursor-pointer hover:file:bg-yellow-500 transition-colors w-full"
                        />
                        <p className="text-[9px] text-pro-text mt-2 opacity-50">Recommended: Square format, PNG/JPG</p>
                      </div>
                    </div>
                  </div>

                <div className="grid grid-cols-4 gap-4 bg-pro-light/30 p-4 border border-pro-border rounded">
                  <div>
                     <label className="block text-[9px] font-mono text-pro-text text-center uppercase font-bold mb-2">Rank</label>
                     <input type="number" value={newTeamStats.position} onChange={e => setNewTeamStats({...newTeamStats, position: parseInt(e.target.value)})} className="w-full bg-pro-main border border-pro-border rounded p-2 text-center text-white focus:border-gold outline-none font-bold text-lg" />
                  </div>
                  <div>
                     <label className="block text-[9px] font-mono text-gold text-center uppercase font-bold mb-2">Points</label>
                     <input type="number" value={newTeamStats.points} onChange={e => setNewTeamStats({...newTeamStats, points: parseInt(e.target.value)})} className="w-full bg-pro-main border border-gold rounded p-2 text-center text-gold font-bold focus:border-gold outline-none text-lg" />
                  </div>
                  <div>
                     <label className="block text-[9px] font-mono text-pro-text text-center uppercase font-bold mb-2">Wins</label>
                     <input type="number" value={newTeamStats.wins} onChange={e => setNewTeamStats({...newTeamStats, wins: parseInt(e.target.value)})} className="w-full bg-pro-main border border-pro-border rounded p-2 text-center text-white focus:border-gold outline-none text-lg" />
                  </div>
                  <div>
                     <label className="block text-[9px] font-mono text-pro-text text-center uppercase font-bold mb-2">Losses</label>
                     <input type="number" value={newTeamStats.losses} onChange={e => setNewTeamStats({...newTeamStats, losses: parseInt(e.target.value)})} className="w-full bg-pro-main border border-pro-border rounded p-2 text-center text-white focus:border-gold outline-none text-lg" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-mono text-pro-text uppercase font-bold">Roster ({newTeamPlayers.length}/4)</label>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text"
                      value={currentPlayerName}
                      onChange={(e) => setCurrentPlayerName(e.target.value)}
                      placeholder="PLAYER NAME"
                      disabled={newTeamPlayers.length >= 4}
                      className="flex-1 bg-pro-main border border-pro-border rounded p-3 text-white font-mono focus:border-gold outline-none uppercase text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPlayerToDraft())}
                    />
                    <button type="button" onClick={addPlayerToDraft} disabled={newTeamPlayers.length >= 4 || !currentPlayerName} className="px-6 bg-pro-light border border-pro-border text-white hover:bg-gold hover:text-black hover:border-gold font-bold rounded transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {newTeamPlayers.length === 0 && <span className="text-xs text-pro-text italic font-mono p-2 uppercase opacity-50">No players added</span>}
                    {newTeamPlayers.map((player, idx) => (
                      <div key={idx} className="bg-pro-main border border-pro-border px-3 py-1.5 flex items-center gap-2 group hover:border-gold transition-colors rounded">
                        <span className="text-xs font-mono text-white uppercase font-bold">{player}</span>
                        <button type="button" onClick={() => removePlayerFromDraft(idx)} className="text-pro-text hover:text-red-500"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-pro-border">
                  <button type="submit" className="w-full py-4 bg-gold text-black font-display font-bold text-2xl uppercase hover:bg-yellow-500 transition-colors rounded shadow-lg">
                    Confirm Registration
                  </button>
                </div>

              </form>
            </div>
          </div>
      )}
    </div>
  );
};