export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  leaderName: string; // Captain/Leader
  logo: string | null; // URL or base64
  players: Player[];
  stats: {
    wins: number;
    losses: number;
    points: number;
    position: number;
  };
}

export interface Tournament {
  id: string;
  name: string;
  teams: Team[];
}

export interface User {
  username: string;
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  VIP = 'VIP',
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isVip: boolean;
}