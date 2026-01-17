import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  prompt: string;
  enhancedPrompt?: string;
  analysis?: string;
  htmlCode: string;
  aiModel: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  enhancedPrompt: {
    type: String,
  },
  analysis: {
    type: String,
  },
  htmlCode: {
    type: String,
    required: true,
  },
  aiModel: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.index({ userId: 1, createdAt: -1 });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
