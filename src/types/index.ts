export interface User {
  id: string;
  discord_id: string;
  username: string;
  avatar_url: string;
  custom_link: string;
  tier: 'free' | 'supporter' | 'premium';
  created_at: string;
  description?: string;
  rating_average?: number;
  rating_count?: number;
  theme?: string;
  custom_background_color?: string;
}

export interface Gamepass {
  id: string;
  user_id: string;
  title: string;
  link: string;
  order: number;
  created_at: string;
}

export interface UserRating {
  id: string;
  user_id: string;
  rater_id: string;
  rating: number;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}