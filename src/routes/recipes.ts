import { Router } from 'express';
import {
  createRecipe,
  getMyRecipes,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addRecipeToGroup,
  removeRecipeFromGroup,
  getRecipesByGroup,
} from '../controllers/recipeController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, createRecipe);
router.get('/my-recipes', protect, getMyRecipes);
router.get('/all', protect, getAllRecipes);
router.get('/:id', protect, getRecipeById);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/group/add', protect, addRecipeToGroup);
router.post('/group/remove', protect, removeRecipeFromGroup);
router.get('/group/:groupId', protect, getRecipesByGroup);

export default router;