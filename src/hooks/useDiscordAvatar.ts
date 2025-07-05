import { useState, useEffect } from 'react';

interface DiscordAvatarData {
  avatarUrl: string;
  username: string;
  discriminator: string;
}

export const useDiscordAvatar = (userId: string | null) => {
  const [avatarData, setAvatarData] = useState<DiscordAvatarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setAvatarData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchDiscordAvatar = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching Discord avatar for user:', userId);
        
        // Check if we have Supabase configuration
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        console.log('Supabase URL:', supabaseUrl);
        console.log('Supabase Key exists:', !!supabaseAnonKey);

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
          console.log('Using fallback avatar generation');
          // Fallback to generating default Discord avatar without API call
          const defaultAvatarIndex = parseInt(userId) % 5;
          const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
          
          const fallbackData = {
            avatarUrl: defaultAvatarUrl,
            username: `User`,
            discriminator: '0000',
          };
          
          console.log('Fallback avatar data:', fallbackData);
          setAvatarData(fallbackData);
          setLoading(false);
          return;
        }

        const apiUrl = `${supabaseUrl}/functions/v1/discord-avatar?userId=${encodeURIComponent(userId)}`;
        console.log('API URL:', apiUrl);
        
        const headers = {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        };

        console.log('Making request to Discord avatar function...');
        const response = await fetch(apiUrl, { headers });
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.log('Response is not JSON, using fallback');
          // If not JSON, fall back to default avatar generation
          const defaultAvatarIndex = parseInt(userId) % 5;
          const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
          
          const fallbackData = {
            avatarUrl: defaultAvatarUrl,
            username: `User`,
            discriminator: '0000',
          };
          
          console.log('Non-JSON fallback avatar data:', fallbackData);
          setAvatarData(fallbackData);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          console.log('Response not OK, trying to parse error');
          // If response is not ok but is JSON, try to parse error
          try {
            const errorData = await response.json();
            console.log('Error data:', errorData);
            throw new Error(errorData.error || `HTTP ${response.status}`);
          } catch (parseError) {
            console.log('Error parsing failed, using fallback');
            // If parsing fails, fall back to default avatar
            const defaultAvatarIndex = parseInt(userId) % 5;
            const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
            
            const fallbackData = {
              avatarUrl: defaultAvatarUrl,
              username: `User`,
              discriminator: '0000',
            };
            
            console.log('Parse error fallback avatar data:', fallbackData);
            setAvatarData(fallbackData);
            setLoading(false);
            return;
          }
        }

        const data = await response.json();
        console.log('Successfully fetched avatar data:', data);
        setAvatarData(data);
      } catch (err) {
        console.warn('Discord avatar fetch failed, using fallback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Always provide a fallback avatar instead of showing an error
        const defaultAvatarIndex = parseInt(userId) % 5;
        const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
        
        const fallbackData = {
          avatarUrl: defaultAvatarUrl,
          username: `User`,
          discriminator: '0000',
        };
        
        console.log('Error fallback avatar data:', fallbackData);
        setAvatarData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordAvatar();
  }, [userId]);

  return { avatarData, loading, error };
};