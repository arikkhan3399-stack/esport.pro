import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, AlertTriangle, Trophy } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate system verification
    setTimeout(() => {
        if (password === 'TTXYZ') {
            // Defaulting to a single admin user since username input is removed
            onLogin({ username: 'ADMIN' });
        } else {
            setError('ACCESS DENIED: INVALID KEY');
            setLoading(false);
            setPassword('');
        }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pro-main relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pro-blue/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md p-6">
        
        {/* Main Card */}
        <div className="bg-pro-card border border-pro-border rounded-lg shadow-2xl overflow-hidden relative group">
          {/* Top Gold Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-gold/50 via-gold to-gold/50"></div>
          
          <div className="p-10 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-10">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-b from-pro-light to-pro-main border border-gold/30 mb-4 shadow-lg shadow-gold/10">
                  <Trophy className="w-8 h-8 text-gold" />
               </div>
               <h1 className="font-display font-bold text-5xl text-white uppercase tracking-tight">
                 ESPORTS<span className="text-gradient-gold">PRO</span>
               </h1>
               <p className="text-pro-text text-xs font-mono uppercase tracking-[0.3em] mt-2">
                 Restricted Access Terminal
               </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
               
               {error && (
                 <div className="bg-red-500/10 border border-red-500/30 p-3 rounded text-red-400 text-xs font-mono flex gap-2 items-center justify-center animate-pulse">
                   <AlertTriangle className="w-4 h-4" /> {error}
                 </div>
               )}

               <div className="space-y-4">
                 <div className="group">
                   <label className="block text-[10px] uppercase font-bold text-pro-text mb-1 ml-1 group-focus-within:text-gold transition-colors">Security Clearance Key</label>
                   <div className="relative">
                     <div className="absolute left-3 top-3 text-pro-text group-focus-within:text-white transition-colors">
                       <Lock className="w-5 h-5" />
                     </div>
                     <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-pro-light/50 border border-pro-border rounded p-3 pl-10 text-white font-mono placeholder:text-pro-text/30 focus:border-gold focus:bg-pro-light focus:ring-1 focus:ring-gold/50 outline-none transition-all tracking-widest text-center text-lg"
                       placeholder="•••••"
                       autoFocus
                     />
                   </div>
                 </div>
               </div>

               <button 
                 type="submit"
                 disabled={loading}
                 className={`w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-display font-bold text-xl uppercase tracking-widest py-3 rounded shadow-lg shadow-gold/20 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
               >
                 {loading ? (
                    'Verifying...'
                 ) : (
                    <>Initialize System <ArrowRight className="w-5 h-5" /></>
                 )}
               </button>
            </form>

          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
           <p className="text-[10px] text-pro-text uppercase tracking-widest opacity-50">
             &copy; 2025 Esports Pro League. Authorized Personnel Only.
           </p>
        </div>

      </div>
    </div>
  );
};