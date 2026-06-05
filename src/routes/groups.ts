import { Router } from 'express';
import {
  createGroup,
  getMyGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, createGroup);
router.get('/', protect, getMyGroups);
router.get('/:id', protect, getGroupById);
router.put('/:id', protect, updateGroup);
router.delete('/:id', protect, deleteGroup);

export default router;