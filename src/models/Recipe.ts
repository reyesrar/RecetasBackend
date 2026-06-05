import mongoose, { Schema } from 'mongoose';

export interface IRecipe extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  servings: number;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  groups: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, 'At least one ingredient is required'],
    },
    steps: {
      type: [String],
      required: [true, 'At least one step is required'],
    },
    servings: {
      type: Number,
      default: 1,
      min: 1,
    },
    cookingTime: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
  },
  { timestamps: true }
);

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);
export default Recipe;