import { Router } from 'express';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/account', protect, deleteUserAccount);

export default router;