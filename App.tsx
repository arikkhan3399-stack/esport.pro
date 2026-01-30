import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { VipSection } from './components/VipSection';
import { AppView, Tournament, User } from './types';
import { Trophy, Crown, LayoutDashboard, UserCircle, LogOut, Crosshair, Radio, Zap, BarChart3, ChevronRight, Hash, Star, Shield, Activity } from 'lucide-react';

// Initial Data Seed
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'CHAMPIONSHIP SERIES 2025',
    teams: [
      {
        id: '1',
        name: 'IMPERIAL ESPORTS',
        leaderName: 'Emperor',
        logo: 'https://picsum.photos/200/200?random=1',
        players: [{ id: 'p1', name: 'Ace' }, { id: 'p2', name: 'King' }],
        stats: { wins: 12, losses: 1, points: 36, position: 1 },
      },
      {
        id: '2',
        name: 'ROYAL GUARD',
        leaderName: 'Knight',
        logo: 'https://picsum.photos/200/200?random=2',
        players: [{ id: 'p3', name: 'Rook' }, { id: 'p4', name: 'Bishop' }, {id: 'p5', name: 'Pawn'}],
        stats: { wins: 9, losses: 4, points: 27, position: 2 },
      },
      {
        id: '3',
        name: 'PHANTOM SYNDICATE',
        leaderName: 'Ghost',
        logo: 'https://picsum.photos/200/200?random=3',
        players: [{ id: 'p6', name: 'Shadow' }, { id: 'p7', name: 'Wraith' }],
        stats: { wins: 6, losses: 7, points: 18, position: 3 },
      },
    ]
  }
];

export default function App() {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournamentId, setActiveTournamentId] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      const storageKey = `esports_data_${currentUser.username}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        setTournaments(JSON.parse(savedData));
      } else {
        setTournaments(JSON.parse(JSON.stringify(INITIAL_TOURNAMENTS)));
      }
    } else {
      setTournaments([]);
      setActiveTournamentId('');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && tournaments.length > 0) {
      const storageKey = `esports_data_${currentUser.username}`;
      localStorage.setItem(storageKey, JSON.stringify(tournaments));
    }
  }, [tournaments, currentUser]);

  useEffect(() => {
    if (tournaments.length > 0) {
      const exists = tournaments.find(t => t.id === activeTournamentId);
      if (!exists) setActiveTournamentId(tournaments[0].id);
    } else {
      setActiveTournamentId('');
    }
  }, [tournaments, activeTournamentId]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTournaments([]); 
    setActiveTournamentId('');
    setView(AppView.LOGIN);
  };

  const activeTournament = tournaments.find(t => t.id === activeTournamentId);
  const teams = activeTournament ? activeTournament.teams : [];
  
  // Sort teams for leaderboard display
  const sortedTeams = [...teams].sort((a,b) => a.stats.position - b.stats.position);
  const leader = sortedTeams.length > 0 ? sortedTeams[0] : null;

  if (view === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-pro-main font-sans selection:bg-gold selection:text-black pb-20 relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-pro-card to-transparent pointer-events-none z-0"></div>
      
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-pro-main/90 border-b border-pro-border backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-600 rounded flex items-center justify-center shadow-lg shadow-gold/20">
               <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
               <h1 className="font-display font-bold text-3xl leading-none tracking-tight text-white uppercase">ESPORTS<span className="text-gradient-gold">PRO</span></h1>
               <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                 <p className="text-[10px] font-bold tracking-[0.2em] text-pro-text uppercase">Official Hub</p>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end border-r border-pro-border pr-6">
               <span className="text-[9px] text-pro-text uppercase tracking-widest font-mono">Operator</span>
               <span className="font-display font-bold text-xl text-white uppercase">{currentUser?.username}</span>
            </div>
            
            <button 
              onClick={() => setView(AppView.VIP)}
              className="bg-pro-light border border-pro-border hover:border-gold hover:bg-gold/10 text-white px-5 py-2 rounded transition-all flex items-center gap-2 group"
            >
               <Shield className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
               <span className="font-display font-bold text-lg tracking-wider uppercase">
                 VIP PERSON
               </span>
            </button>

            <button onClick={handleLogout} className="text-pro-text hover:text-white transition-colors" title="Logout">
               <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* Tournament Selector */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full md:w-auto">
              {tournaments.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTournamentId(t.id)}
                  className={`px-6 py-3 rounded-lg font-display font-bold text-xl uppercase tracking-wider transition-all duration-200 border whitespace-nowrap ${
                    activeTournamentId === t.id 
                    ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20' 
                    : 'bg-pro-card border-pro-border text-pro-text hover:border-pro-text hover:text-white'
                  }`}
                >
                  {t.name}
                </button>
              ))}
           </div>
           
           {activeTournament && (
             <div className="flex items-center gap-3 bg-pro-card px-4 py-2 rounded-full border border-pro-border shadow-sm">
               <Activity className="w-4 h-4 text-green-500" />
               <span className="font-mono text-xs uppercase tracking-widest text-white">
                 Live Season <span className="text-pro-text mx-1">|</span> Week 4
               </span>
             </div>
           )}
        </div>

        {activeTournament ? (
          <>
            {/* HERO SECTION - Leader Spotlight */}
            {leader && (
              <div className="mb-12 relative animate-fade-in">
                {/* Gold Glow Behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gold/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="bg-pro-card border border-pro-border rounded-xl p-1 relative overflow-hidden shadow-2xl">
                  {/* Subtle Pattern */}
                  <div className="absolute inset-0 bg-hex-pattern opacity-10"></div>
                  
                  <div className="bg-gradient-to-r from-pro-card via-pro-card/95 to-pro-card/50 p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-12 rounded-lg">
                     
                     {/* Left: Stats */}
                     <div className="flex-1 text-center md:text-left relative z-20">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-600 text-black px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-6 shadow-md">
                          <Crown className="w-3 h-3" /> Current Leader
                        </div>
                        <h2 className="text-6xl md:text-8xl font-display font-bold text-white uppercase leading-none mb-4 tracking-tight drop-shadow-md">
                          {leader.name}
                        </h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 border-t border-white/5 pt-8">
                          <div>
                            <p className="text-gold text-[10px] font-mono uppercase mb-1 font-bold">Total Points</p>
                            <p className="text-4xl font-display font-bold text-white">{leader.stats.points}</p>
                          </div>
                          <div>
                            <p className="text-pro-text text-[10px] font-mono uppercase mb-1 font-bold">Win Rate</p>
                            <p className="text-4xl font-display font-bold text-white">
                              {leader.stats.wins + leader.stats.losses > 0 
                                ? Math.round((leader.stats.wins / (leader.stats.wins + leader.stats.losses)) * 100) 
                                : 0}%
                            </p>
                          </div>
                          <div>
                            <p className="text-pro-text text-[10px] font-mono uppercase mb-1 font-bold">W / L</p>
                            <p className="text-4xl font-display font-bold text-white">{leader.stats.wins}/{leader.stats.losses}</p>
                          </div>
                           <div>
                            <p className="text-pro-text text-[10px] font-mono uppercase mb-1 font-bold">Captain</p>
                            <p className="text-2xl font-display font-bold text-white tracking-wide mt-2 uppercase">{leader.leaderName}</p>
                          </div>
                        </div>
                     </div>
                     
                     {/* Right: Visual */}
                     <div className="relative">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-pro-light shadow-2xl relative overflow-hidden group">
                           {leader.logo ? (
                             <img src={leader.logo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={leader.name} />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-pro-light">
                               <Trophy className="w-24 h-24 text-white/10" />
                             </div>
                           )}
                           
                           {/* Rank Ring */}
                           <div className="absolute inset-0 border-4 border-gold/50 rounded-full animate-pulse"></div>
                           
                           {/* Badge */}
                           <div className="absolute bottom-4 right-10 bg-gold text-black w-14 h-14 flex items-center justify-center rounded-full font-display font-bold text-3xl shadow-lg border-2 border-white">
                             #1
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* LEADERBOARD TABLE - Premium Style */}
            <div className="pb-20">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-display font-bold text-3xl text-white uppercase tracking-tight flex items-center gap-3">
                   <div className="p-2 bg-pro-card border border-pro-border rounded">
                     <LayoutDashboard className="w-5 h-5 text-gold" /> 
                   </div>
                   Current Standings
                 </h3>
                 <span className="text-[10px] font-mono text-pro-text uppercase bg-pro-card border border-pro-border px-3 py-1.5 rounded-full flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div> Live Updates
                 </span>
              </div>

              {teams.length === 0 ? (
                 <div className="bg-pro-card border border-pro-border rounded-xl p-20 text-center flex flex-col items-center shadow-inner">
                    <Radio className="w-16 h-16 text-pro-text mb-6 opacity-30" />
                    <h3 className="font-display font-bold text-3xl text-white mb-2 uppercase">Awaiting Data</h3>
                    <p className="font-mono text-pro-text text-sm">Tournament bracket is currently empty.</p>
                 </div>
              ) : (
                 <div className="overflow-hidden rounded-xl border border-pro-border shadow-2xl bg-pro-card">
                   <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-pro-light border-b border-pro-border text-xs font-mono font-bold text-pro-text uppercase tracking-widest">
                           <th className="p-5 pl-8 w-24">Rank</th>
                           <th className="p-5">Team</th>
                           <th className="p-5">Captain</th>
                           <th className="p-5 text-center">Record</th>
                           <th className="p-5 text-center">Points</th>
                           <th className="p-5 text-right pr-8">Roster</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-pro-border">
                        {sortedTeams.map((team, index) => {
                           const isFirst = index === 0;
                           return (
                             <tr 
                               key={team.id} 
                               className={`group transition-colors duration-200 hover:bg-pro-light/50 ${isFirst ? 'bg-gold/5' : ''}`}
                             >
                                <td className="p-5 pl-8">
                                   <div className={`w-10 h-10 flex items-center justify-center font-display font-bold text-xl rounded-lg border ${
                                     isFirst 
                                     ? 'bg-gold text-black border-gold shadow-md' 
                                     : 'bg-pro-light text-pro-text border-pro-border'
                                   }`}>
                                      {team.stats.position}
                                   </div>
                                </td>
                                <td className="p-5">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-lg overflow-hidden border-2 ${isFirst ? 'border-gold' : 'border-pro-border'} relative group-hover:border-white transition-colors`}>
                                         {team.logo && <img src={team.logo} className="w-full h-full object-cover" alt={team.name} />}
                                      </div>
                                      <div>
                                        <span className={`font-display font-bold text-xl uppercase tracking-wide block ${isFirst ? 'text-gold' : 'text-white'}`}>
                                           {team.name}
                                        </span>
                                        {isFirst && <span className="text-[9px] font-mono uppercase text-gold/70 tracking-wider">League Leader</span>}
                                      </div>
                                   </div>
                                </td>
                                <td className="p-5">
                                   <div className="flex items-center gap-2 text-white font-mono text-sm uppercase">
                                     <UserCircle className="w-4 h-4 text-pro-text" />
                                     {team.leaderName}
                                   </div>
                                </td>
                                <td className="p-5 text-center font-mono text-sm">
                                   <span className="text-white font-bold">{team.stats.wins}W</span>
                                   <span className="text-pro-text mx-2">-</span>
                                   <span className="text-pro-text">{team.stats.losses}L</span>
                                </td>
                                <td className="p-5 text-center">
                                   <span className={`font-display font-bold text-2xl ${isFirst ? 'text-gold' : 'text-white'}`}>{team.stats.points}</span>
                                </td>
                                <td className="p-5 text-right pr-8">
                                   <div className="flex justify-end -space-x-2">
                                      {team.players.map(p => (
                                         <div key={p.id} className="w-9 h-9 rounded-full bg-pro-light border-2 border-pro-card flex items-center justify-center text-[10px] text-white font-bold shadow-sm relative z-0 hover:z-10 hover:scale-110 transition-transform cursor-help" title={p.name}>
                                            {p.name.charAt(0)}
                                         </div>
                                      ))}
                                   </div>
                                </td>
                             </tr>
                           );
                        })}
                     </tbody>
                   </table>
                 </div>
              )}
            </div>
          </>
        ) : (
           <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-pro-border rounded-xl bg-pro-card/50">
              <Crosshair className="w-16 h-16 text-pro-text animate-pulse mb-4 opacity-50" />
              <p className="font-mono text-pro-text text-lg uppercase">System Offline</p>
              <p className="text-xs text-pro-text/50 font-mono mt-2 uppercase tracking-widest">Select a tournament to initialize dashboard</p>
           </div>
        )}

        {view === AppView.VIP && (
          <VipSection 
            tournaments={tournaments} 
            setTournaments={setTournaments}
            onClose={() => setView(AppView.DASHBOARD)} 
          />
        )}
      </main>
    </div>
  );
}