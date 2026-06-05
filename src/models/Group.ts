import mongoose, { Schema } from 'mongoose';

export interface IGroup extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model<IGroup>('Group', groupSchema);
export default Group;