import { connectToDatabase } from '../lib/mongodb';
import Contact, { IContact } from '../models/Contact';

export class ContactService {
  static async createContact(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<IContact> {
    await connectToDatabase();
    
    const contact = new Contact({
      ...contactData,
      status: 'new',
      priority: 'medium'
    });

    return await contact.save();
  }

  static async getAllContacts(
    status?: string,
    limit: number = 20,
    skip: number = 0
  ): Promise<IContact[]> {
    await connectToDatabase();
    
    const query = status ? { status } : {};
    
    return await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  static async getContactById(contactId: string): Promise<IContact | null> {
    await connectToDatabase();
    return await Contact.findById(contactId);
  }

  static async updateContactStatus(
    contactId: string,
    status: 'new' | 'read' | 'replied' | 'archived'
  ): Promise<IContact | null> {
    await connectToDatabase();
    return await Contact.findByIdAndUpdate(
      contactId,
      { status, updatedAt: new Date() },
      { new: true }
    );
  }

  static async deleteContact(contactId: string): Promise<boolean> {
    await connectToDatabase();
    const result = await Contact.deleteOne({ _id: contactId });
    return result.deletedCount > 0;
  }

  static async getContactStats() {
    await connectToDatabase();
    
    const [total, newCount, readCount, repliedCount] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'read' }),
      Contact.countDocuments({ status: 'replied' })
    ]);

    return {
      total,
      new: newCount,
      read: readCount,
      replied: repliedCount,
      archived: total - newCount - readCount - repliedCount
    };
  }
}