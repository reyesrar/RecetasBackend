import { Router } from 'express';
import {
  createRecipe,
  getMyRecipes,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, createRecipe);
router.get('/my-recipes', protect, getMyRecipes);
router.get('/all', protect, getAllRecipes);
router.get('/:id', protect, getRecipeById);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

export default router;