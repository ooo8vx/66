import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  discriminator: string;
  avatarUrl?: string;
  email?: string;
  bio?: string;
  skills: string[];
  socialLinks: {
    github?: string;
    discord?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  projects: mongoose.Types.ObjectId[];
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  discriminator: {
    type: String,
    required: true,
    default: '0000'
  },
  avatarUrl: {
    type: String,
    default: null
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    github: { type: String, default: '' },
    discord: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes for better performance
UserSchema.index({ discordId: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);