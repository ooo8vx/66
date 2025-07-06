import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

export class Project {
  static getCollection() {
    return getDB().collection('projects');
  }

  static async create(projectData) {
    const project = {
      ...projectData,
      created_at: new Date(),
      updated_at: new Date(),
      views: 0,
      likes: 0,
      is_public: projectData.is_public !== false,
      featured: projectData.featured || false
    };
    
    const result = await this.getCollection().insertOne(project);
    return { ...project, _id: result.insertedId };
  }

  static async findByUserId(userId, isPublic = true) {
    const query = { user_id: userId };
    if (isPublic) {
      query.is_public = true;
    }
    
    return await this.getCollection()
      .find(query)
      .sort({ created_at: -1 })
      .toArray();
  }

  static async findFeatured(limit = 6) {
    return await this.getCollection()
      .find({ featured: true, is_public: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }

  static async findAll(limit = 10) {
    return await this.getCollection()
      .find({ is_public: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }
}