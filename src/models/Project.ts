import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  images: string[];
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'other';
  status: 'planning' | 'development' | 'completed' | 'maintenance';
  featured: boolean;
  userId: mongoose.Types.ObjectId;
  likes: number;
  views: number;
  tags: string[];
  startDate: Date;
  endDate?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  longDescription: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  technologies: [{
    type: String,
    trim: true,
    required: true
  }],
  githubUrl: {
    type: String,
    trim: true
  },
  liveUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'api', 'other'],
    required: true,
    default: 'web'
  },
  status: {
    type: String,
    enum: ['planning', 'development', 'completed', 'maintenance'],
    required: true,
    default: 'planning'
  },
  featured: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'projects'
});

// Indexes for better performance
ProjectSchema.index({ userId: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ featured: -1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ likes: -1 });
ProjectSchema.index({ views: -1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);