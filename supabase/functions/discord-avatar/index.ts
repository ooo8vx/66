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

    const botToken = Deno.env.get('DISCORD_BOT_TOKEN');
    
    // Try with bot token first if available
    if (botToken) {
      try {
        const discordResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
          headers: {
            'Authorization': `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (discordResponse.ok) {
          const userData: DiscordUser = await discordResponse.json();
          
          // Generate avatar URL
          const avatarUrl = userData.avatar 
            ? `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=256`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator) % 5}.png`;

          return new Response(
            JSON.stringify({
              avatarUrl,
              username: userData.username,
              discriminator: userData.discriminator,
            }),
            {
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }
      } catch (error) {
        console.warn('Bot token request failed, falling back to public endpoint:', error);
      }
    }

    // Fallback: Generate default avatar without API call
    // Discord's default avatar system uses user ID modulo 5 for default avatars
    const defaultAvatarIndex = parseInt(userId) % 5;
    const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;

    return new Response(
      JSON.stringify({
        avatarUrl: defaultAvatarUrl,
        username: `User ${userId}`,
        discriminator: '0000',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in discord-avatar function:', error);
    
    // Always return JSON, never let HTML error pages through
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch Discord avatar',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});