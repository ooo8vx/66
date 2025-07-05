import { connectToDatabase } from '../lib/mongodb';
import Project, { IProject } from '../models/Project';
import mongoose from 'mongoose';

export class ProjectService {
  static async createProject(projectData: Partial<IProject>): Promise<IProject> {
    await connectToDatabase();
    const project = new Project(projectData);
    return await project.save();
  }

  static async getProjectsByUserId(userId: string, isPublic: boolean = true): Promise<IProject[]> {
    await connectToDatabase();
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    
    if (isPublic) {
      query.isPublic = true;
    }

    return await Project.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .populate('userId', 'username avatarUrl');
  }

  static async getFeaturedProjects(limit: number = 6): Promise<IProject[]> {
    await connectToDatabase();
    return await Project.find({ featured: true, isPublic: true })
      .sort({ likes: -1, views: -1 })
      .limit(limit)
      .populate('userId', 'username avatarUrl');
  }

  static async getProjectById(projectId: string): Promise<IProject | null> {
    await connectToDatabase();
    return await Project.findById(projectId)
      .populate('userId', 'username avatarUrl discordId');
  }

  static async updateProject(projectId: string, updateData: Partial<IProject>): Promise<IProject | null> {
    await connectToDatabase();
    return await Project.findByIdAndUpdate(
      projectId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  static async deleteProject(projectId: string, userId: string): Promise<boolean> {
    await connectToDatabase();
    const result = await Project.deleteOne({ 
      _id: projectId, 
      userId: new mongoose.Types.ObjectId(userId) 
    });
    return result.deletedCount > 0;
  }

  static async incrementViews(projectId: string): Promise<void> {
    await connectToDatabase();
    await Project.findByIdAndUpdate(projectId, { $inc: { views: 1 } });
  }

  static async toggleLike(projectId: string): Promise<number> {
    await connectToDatabase();
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    return project?.likes || 0;
  }

  static async getProjectsByCategory(category: string, limit: number = 10): Promise<IProject[]> {
    await connectToDatabase();
    return await Project.find({ category, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'username avatarUrl');
  }

  static async searchProjects(query: string, limit: number = 10): Promise<IProject[]> {
    await connectToDatabase();
    return await Project.find({
      isPublic: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { technologies: { $in: [new RegExp(query, 'i')] } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .sort({ likes: -1, views: -1 })
    .limit(limit)
    .populate('userId', 'username avatarUrl');
  }
}