import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface User {
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables with better error handling
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing required environment variables',
          details: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured'
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const method = req.method;

    if (method === 'GET' && pathParts[3]) {
      // GET /users/:discordId
      const discordId = pathParts[3];
      
      const { data: user, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('discord_id', discordId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Database error on GET:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return new Response(JSON.stringify(user), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST') {
      // POST /users - Create or update user
      const userData: User = await req.json();
      
      if (!userData.discord_id || !userData.username) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields: discord_id and username are required' 
          }), 
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('discord_id', userData.discord_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Database error on fetch:', fetchError);
        throw new Error(`Database query failed: ${fetchError.message}`);
      }

      let result;
      if (existingUser) {
        // Update existing user
        const { data, error } = await supabaseClient
          .from('users')
          .update({
            username: userData.username,
            discriminator: userData.discriminator,
            avatar_url: userData.avatar_url,
            email: userData.email,
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('discord_id', userData.discord_id)
          .select()
          .single();

        if (error) {
          console.error('Database error on update:', error);
          throw new Error(`Failed to update user: ${error.message}`);
        }
        result = data;
      } else {
        // Create new user
        const { data, error } = await supabaseClient
          .from('users')
          .insert({
            discord_id: userData.discord_id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar_url: userData.avatar_url,
            email: userData.email,
            bio: userData.bio || `أنا LORD — مطور مغربي عمري 18 سنة أعيش في إيطاليا، أبني تجارب رقمية بدقة وعمق وهدف. لا أكتب الكود فقط — أصمم الحضور. كل مشروع أبنيه مؤسس على رؤية، مدفوع بهوس هادئ بالتفاصيل والحركة والإحساس. عملي ليس ضوضاء أو بريق — إنه وضوح وتدفق وسيطرة. أستلهم من منطق الكود، وأناقة التصميم البسيط، والوزن الخفي لقصص الأنمي — لا أهدف للإعجاب، أهدف لترك أثر. أثر حاد. أثر حقيقي. التكنولوجيا سلاحي. الويب ساحة معركتي.`,
            skills: userData.skills || ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
            social_links: userData.social_links || {
              github: 'https://github.com/lordx679',
              discord: '#',
              instagram: '#'
            },
            is_active: true,
          })
          .select()
          .single();

        if (error) {
          console.error('Database error on insert:', error);
          throw new Error(`Failed to create user: ${error.message}`);
        }
        result = data;
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'PUT' && pathParts[3]) {
      // PUT /users/:discordId - Update user profile
      const discordId = pathParts[3];
      const updateData = await req.json();

      const { data, error } = await supabaseClient
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('discord_id', discordId)
        .select()
        .single();

      if (error) {
        console.error('Database error on profile update:', error);
        throw new Error(`Failed to update user profile: ${error.message}`);
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});