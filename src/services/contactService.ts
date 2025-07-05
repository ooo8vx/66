const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface IContact {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  updated_at?: string;
}

export class ContactService {
  static async createContact(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<IContact> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        ip_address: contactData.ipAddress,
        user_agent: contactData.userAgent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create contact');
    }

    return await response.json();
  }

  static async getAllContacts(): Promise<IContact[]> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/contacts`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }

    return await response.json();
  }
}