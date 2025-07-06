import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

export class Contact {
  static getCollection() {
    return getDB().collection('contacts');
  }

  static async create(contactData) {
    const contact = {
      ...contactData,
      status: 'new',
      priority: 'medium',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await this.getCollection().insertOne(contact);
    return { ...contact, _id: result.insertedId };
  }

  static async findAll() {
    return await this.getCollection()
      .find({})
      .sort({ created_at: -1 })
      .toArray();
  }

  static async updateStatus(id, status) {
    return await this.getCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          updated_at: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
  }
}