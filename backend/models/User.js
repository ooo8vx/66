import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

export class User {
  static getCollection() {
    return getDB().collection('users');
  }

  static async findByDiscordId(discordId) {
    return await this.getCollection().findOne({ discord_id: discordId });
  }

  static async create(userData) {
    const user = {
      ...userData,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true
    };
    
    const result = await this.getCollection().insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async updateByDiscordId(discordId, updateData) {
    const result = await this.getCollection().findOneAndUpdate(
      { discord_id: discordId },
      { 
        $set: { 
          ...updateData, 
          updated_at: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  static async createOrUpdate(userData) {
    const existingUser = await this.findByDiscordId(userData.discord_id);
    
    if (existingUser) {
      return await this.updateByDiscordId(userData.discord_id, {
        username: userData.username,
        discriminator: userData.discriminator,
        avatar_url: userData.avatar_url,
        email: userData.email,
        last_login: new Date()
      });
    } else {
      return await this.create({
        discord_id: userData.discord_id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar_url: userData.avatar_url,
        email: userData.email,
        bio: userData.bio || `I'm LORD — an 18-year-old Moroccan developer living in Italy, building digital experiences with precision, depth, and purpose. I don't just write code — I craft presence. Every project I build is founded on vision, driven by a quiet obsession with detail, movement, and feel. My work isn't noise or flash — it's clarity, flow, and control. I draw inspiration from the logic of code, the elegance of minimal design, and the hidden weight of anime stories — I don't aim to impress, I aim to leave a mark. A sharp mark. A real mark. Technology is my weapon. The web is my battlefield.`,
        skills: userData.skills || ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        social_links: userData.social_links || {
          github: 'https://github.com/lordx679',
          discord: '#',
          instagram: '#'
        }
      });
    }
  }
}