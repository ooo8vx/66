import { useState, useEffect } from 'react';

interface DiscordAvatarData {
  avatarUrl: string;
  username: string;
  discriminator: string;
}

export const useDiscordAvatar = (userId: string | null) => {
  const [avatarData, setAvatarData] = useState<DiscordAvatarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setAvatarData(null);
      setError(null);
      setLoading(false);
      return;
    }

    // إنشاء صورة احتياطية فورية
    const createFallbackAvatar = () => {
      const defaultAvatarIndex = parseInt(userId.slice(-1)) % 6;
      return {
        avatarUrl: `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`,
        username: 'LORDX679',
        discriminator: '0000',
      };
    };

    // تعيين الصورة الاحتياطية فوراً
    const fallbackData = createFallbackAvatar();
    setAvatarData(fallbackData);
    setLoading(false);

    // محاولة تحميل الصورة الحقيقية في الخلفية
    const fetchRealAvatar = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // إذا لم يكن هناك إعداد Supabase، استخدم الاحتياطي
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
          return;
        }

        const apiUrl = `${supabaseUrl}/functions/v1/discord-avatar?userId=${encodeURIComponent(userId)}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

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
            
            if (data && data.avatarUrl && data.avatarUrl !== fallbackData.avatarUrl) {
              // تحديث الصورة فقط إذا كانت مختلفة عن الاحتياطية
              setAvatarData(data);
            }
          }
        }
      } catch (err) {
        // في حالة الخطأ، نبقي على الصورة الاحتياطية
        console.log('Failed to fetch real avatar, keeping fallback');
      }
    };

    // تشغيل التحميل في الخلفية
    fetchRealAvatar();

  }, [userId]);

  return { avatarData, loading, error };
};