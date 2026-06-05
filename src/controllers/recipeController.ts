import { Response } from 'express';
import Recipe, { IRecipe } from '../models/Recipe';
import { AuthRequest } from '../middleware/auth';

export const createRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, ingredients, steps, servings, cookingTime, difficulty } = req.body;
    const userId = req.user?.userId;

    if (!title || !ingredients || !steps) {
      res.status(400).json({
        success: false,
        message: 'Title, ingredients, and steps are required',
      });
      return;
    }

    const recipe = await Recipe.create({
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      ingredients,
      steps,
      servings: servings || 1,
      cookingTime: cookingTime || 0,
      difficulty: difficulty || 'easy',
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe,
    });
  } catch (error: any) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating recipe',
    });
  }
};

export const getMyRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const recipes = await Recipe.find({ userId }).sort({ title: 1 }).populate('groups');

    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error: any) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
    });
  }
};

export const getAllRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipes = await Recipe.find().sort({ title: 1 }).populate('userId', 'name').populate('groups');

    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error: any) {
    console.error('Get all recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
    });
  }
};

export const getRecipeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id).populate('userId', 'name').populate('groups');

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error: any) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe',
    });
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, steps, servings, cookingTime, difficulty } = req.body;
    const userId = req.user?.userId;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
      return;
    }

    if (recipe.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe',
      });
      return;
    }

    const updated = await Recipe.findByIdAndUpdate(
      id,
      {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(ingredients && { ingredients }),
        ...(steps && { steps }),
        ...(servings && { servings }),
        ...(cookingTime !== undefined && { cookingTime }),
        ...(difficulty && { difficulty }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating recipe',
    });
  }
};

export const deleteRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
      return;
    }

    if (recipe.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe',
      });
      return;
    }

    await Recipe.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe',
    });
  }
};