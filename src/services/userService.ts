const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface IUser {
  id?: string;
  discord_id: string;
  username: string;
  discriminator: string;
  avatar_url?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  social_links?: {
    github?: string;
    discord?: string;
    instagram?: string;
  };
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export class UserService {
  static async createOrUpdateUser(userData: {
    discordId: string;
    username: string;
    discriminator: string;
    avatarUrl?: string;
    email?: string;
  }): Promise<IUser> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        discord_id: userData.discordId,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar_url: userData.avatarUrl,
        email: userData.email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create or update user');
    }

    return await response.json();
  }

  static async getUserByDiscordId(discordId: string): Promise<IUser | null> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/users/${discordId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  }

  static async updateUserProfile(discordId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/users/${discordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    return await response.json();
  }
}