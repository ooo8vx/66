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

        // Always provide a fallback first
        const defaultAvatarIndex = parseInt(userId.slice(-1)) % 5;
        const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
        
        const fallbackData = {
          avatarUrl: defaultAvatarUrl,
          username: `LORDX679`,
          discriminator: '0000',
        };

        // If no Supabase config, use fallback immediately
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
          console.log('No Supabase config, using fallback avatar');
          setAvatarData(fallbackData);
          setLoading(false);
          return;
        }

        // Try to fetch from Supabase edge function
        const apiUrl = `${supabaseUrl}/functions/v1/discord-avatar?userId=${encodeURIComponent(userId)}`;
        console.log('Attempting to fetch from:', apiUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json();
              console.log('Successfully fetched avatar data:', data);
              
              // Validate the response data
              if (data && data.avatarUrl) {
                setAvatarData(data);
                setLoading(false);
                return;
              }
            }
          }
          
          console.log('API response not valid, using fallback');
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.log('Fetch failed, using fallback:', fetchError);
        }

        // Always fall back to default avatar
        setAvatarData(fallbackData);
        
      } catch (err) {
        console.warn('Discord avatar fetch failed, using fallback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Always provide a fallback avatar
        const defaultAvatarIndex = parseInt(userId.slice(-1)) % 5;
        const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
        
        const fallbackData = {
          avatarUrl: defaultAvatarUrl,
          username: `LORDX679`,
          discriminator: '0000',
        };
        
        setAvatarData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordAvatar();
  }, [userId]);

  return { avatarData, loading, error };
};