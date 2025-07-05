import { connectToDatabase } from '../lib/mongodb';
import User, { IUser } from '../models/User';

export class UserService {
  static async createOrUpdateUser(userData: {
    discordId: string;
    username: string;
    discriminator: string;
    avatarUrl?: string;
    email?: string;
  }): Promise<IUser> {
    await connectToDatabase();

    const existingUser = await User.findOne({ discordId: userData.discordId });

    if (existingUser) {
      // Update existing user
      existingUser.username = userData.username;
      existingUser.discriminator = userData.discriminator;
      existingUser.avatarUrl = userData.avatarUrl || existingUser.avatarUrl;
      existingUser.email = userData.email || existingUser.email;
      existingUser.lastLogin = new Date();
      
      return await existingUser.save();
    } else {
      // Create new user
      const newUser = new User({
        discordId: userData.discordId,
        username: userData.username,
        discriminator: userData.discriminator,
        avatarUrl: userData.avatarUrl,
        email: userData.email,
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        socialLinks: {
          github: 'https://github.com/lordx679',
          discord: '#',
          instagram: '#'
        }
      });

      return await newUser.save();
    }
  }

  static async getUserByDiscordId(discordId: string): Promise<IUser | null> {
    await connectToDatabase();
    return await User.findOne({ discordId }).populate('projects');
  }

  static async updateUserProfile(discordId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    await connectToDatabase();
    return await User.findOneAndUpdate(
      { discordId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  static async getAllUsers(limit: number = 10, skip: number = 0): Promise<IUser[]> {
    await connectToDatabase();
    return await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('projects');
  }

  static async getUserStats(discordId: string) {
    await connectToDatabase();
    const user = await User.findOne({ discordId }).populate('projects');
    
    if (!user) return null;

    return {
      totalProjects: user.projects.length,
      joinDate: user.createdAt,
      lastActive: user.lastLogin,
      skillsCount: user.skills.length
    };
  }
}