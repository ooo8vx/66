import { useState, useEffect } from 'react';
import { UserService } from '../services/userService';
import { ProjectService } from '../services/projectService';
import { ContactService } from '../services/contactService';
import { IUser } from '../models/User';
import { IProject } from '../models/Project';
import { IContact } from '../models/Contact';

export const useUser = (discordId: string) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await UserService.getUserByDiscordId(discordId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    if (discordId) {
      fetchUser();
    }
  }, [discordId]);

  return { user, loading, error, refetch: () => fetchUser() };
};

export const useProjects = (userId?: string, featured: boolean = false) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let projectData: IProject[];
        
        if (featured) {
          projectData = await ProjectService.getFeaturedProjects();
        } else if (userId) {
          projectData = await ProjectService.getProjectsByUserId(userId);
        } else {
          projectData = [];
        }
        
        setProjects(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId, featured]);

  return { projects, loading, error };
};

export const useContacts = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const contactData = await ContactService.getAllContacts();
      setContacts(contactData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const createContact = async (contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      const newContact = await ContactService.createContact(contactData);
      setContacts(prev => [newContact, ...prev]);
      return newContact;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create contact');
    }
  };

  return { contacts, loading, error, createContact, refetch: fetchContacts };
};