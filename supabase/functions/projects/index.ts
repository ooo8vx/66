import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface Project {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  technologies: string[];
  category?: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  featured?: boolean;
  is_public?: boolean;
  views?: number;
  likes?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const method = req.method;

    if (method === 'GET') {
      const userId = searchParams.get('userId');
      const featured = searchParams.get('featured') === 'true';
      const limit = parseInt(searchParams.get('limit') || '10');

      let query = supabaseClient
        .from('projects')
        .select(`
          *,
          users (
            username,
            avatar_url
          )
        `);

      if (featured) {
        query = query.eq('featured', true).eq('is_public', true);
      } else if (userId) {
        query = query.eq('user_id', userId).eq('is_public', true);
      } else {
        query = query.eq('is_public', true);
      }

      const { data: projects, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify(projects || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST') {
      const projectData: Project = await req.json();
      
      const { data, error } = await supabaseClient
        .from('projects')
        .insert({
          user_id: projectData.user_id,
          title: projectData.title,
          description: projectData.description,
          technologies: projectData.technologies,
          category: projectData.category,
          image_url: projectData.image_url,
          github_url: projectData.github_url,
          live_url: projectData.live_url,
          featured: projectData.featured || false,
          is_public: projectData.is_public !== false,
          views: 0,
          likes: 0,
          tags: projectData.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});