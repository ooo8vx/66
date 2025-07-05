const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface IProject {
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
  users?: {
    username: string;
    avatar_url?: string;
  };
}

export class ProjectService {
  static async createProject(projectData: Partial<IProject>): Promise<IProject> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return await response.json();
  }

  static async getProjectsByUserId(userId: string, isPublic: boolean = true): Promise<IProject[]> {
    const params = new URLSearchParams({
      userId,
      ...(isPublic && { isPublic: 'true' }),
    });

    const response = await fetch(`${SUPABASE_URL}/functions/v1/projects?${params}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return await response.json();
  }

  static async getFeaturedProjects(limit: number = 6): Promise<IProject[]> {
    const params = new URLSearchParams({
      featured: 'true',
      limit: limit.toString(),
    });

    const response = await fetch(`${SUPABASE_URL}/functions/v1/projects?${params}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured projects');
    }

    return await response.json();
  }
}