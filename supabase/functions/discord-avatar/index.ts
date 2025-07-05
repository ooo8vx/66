const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Discord User ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    console.log('Fetching Discord user data for ID:', userId);

    const botToken = Deno.env.get('DISCORD_BOT_TOKEN');
    
    // Try with bot token first if available
    if (botToken) {
      try {
        console.log('Attempting Discord API call with bot token');
        const discordResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
          headers: {
            'Authorization': `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (discordResponse.ok) {
          const userData: DiscordUser = await discordResponse.json();
          console.log('Discord API response:', userData);
          
          // Generate avatar URL - handle both old and new discriminator systems
          let avatarUrl: string;
          if (userData.avatar) {
            // User has custom avatar
            avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=256`;
          } else {
            // Use default avatar - handle both old (#0000) and new (0) discriminator systems
            if (userData.discriminator === '0') {
              // New username system - use user ID for default avatar
              const defaultIndex = (parseInt(userId) >> 22) % 6; // Use snowflake timestamp for better distribution
              avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
            } else {
              // Old discriminator system
              const defaultIndex = parseInt(userData.discriminator) % 5;
              avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
            }
          }

          const responseData = {
            avatarUrl,
            username: userData.username,
            discriminator: userData.discriminator,
          };

          console.log('Returning avatar data:', responseData);

          return new Response(
            JSON.stringify(responseData),
            {
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        } else {
          console.log('Discord API returned non-OK status:', discordResponse.status);
        }
      } catch (error) {
        console.warn('Bot token request failed:', error);
      }
    } else {
      console.log('No Discord bot token available');
    }

    // Fallback: Generate default avatar without API call
    console.log('Using fallback avatar generation');
    const defaultAvatarIndex = (parseInt(userId) >> 22) % 6; // Better distribution using snowflake
    const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;

    const fallbackData = {
      avatarUrl: defaultAvatarUrl,
      username: `LORDX679`,
      discriminator: '0000',
    };

    console.log('Returning fallback data:', fallbackData);

    return new Response(
      JSON.stringify(fallbackData),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in discord-avatar function:', error);
    
    // Always return JSON with a working fallback
    const userId = new URL(req.url).searchParams.get('userId') || '0';
    const defaultAvatarIndex = parseInt(userId.slice(-1)) % 5;
    const errorFallbackData = {
      avatarUrl: `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`,
      username: `LORDX679`,
      discriminator: '0000',
    };

    return new Response(
      JSON.stringify(errorFallbackData),
      {
        status: 200, // Return 200 so the frontend doesn't treat it as an error
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});