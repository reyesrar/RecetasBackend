import { Response } from 'express';
import Group from '../models/Group';
import Recipe from '../models/Recipe';
import { AuthRequest } from '../middleware/auth';

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.userId;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Name is required',
      });
      return;
    }

    const group = await Group.create({
      userId,
      name: name.trim(),
      description: description?.trim() || '',
    });

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: group,
    });
  } catch (error: any) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating group',
    });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const groups = await Group.find({ userId }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error: any) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching groups',
    });
  }
};

export const getGroupById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id);

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error: any) {
    console.error('Get group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group',
    });
  }
};

export const updateGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user?.userId;

    const group = await Group.findById(id);

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
      return;
    }

    if (group.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this group',
      });
      return;
    }

    const updated = await Group.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Group updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating group',
    });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const group = await Group.findById(id);

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
      return;
    }

    if (group.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this group',
      });
      return;
    }

    // Find all recipes in this group by this user
    const recipesToDelete = await Recipe.find({
      _id: { $in: await Recipe.find({ groups: id, userId }).select('_id') },
      userId,
      groups: { $size: 1, $in: [id] },
    });

    // Delete only user's recipes that belong ONLY to this group
    await Recipe.deleteMany({
      _id: { $in: recipesToDelete.map((r) => r._id) },
      userId,
    });

    // Remove group from all other recipes
    await Recipe.updateMany({ groups: id }, { $pull: { groups: id } });

    // Delete the group
    await Group.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting group',
    });
  }
};