import { Request, Response } from 'express';
import User from '../models/User';
import { UserResponse } from '../types';
import { AuthRequest } from '../middleware/auth';
import { validateEmail, validateName, validatePassword } from '../utils/validators';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const userResponse: UserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const userId = req.user?.userId;

    // Validate
    if (name && !validateName(name).valid) {
      res.status(400).json({
        success: false,
        message: validateName(name).message,
      });
      return;
    }

    if (email && !validateEmail(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
      });
      return;
    }

    // Check if email already exists (if changing email)
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email already in use',
          field: 'email',
        });
        return;
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.toLowerCase().trim() }),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const userResponse: UserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
};

export const deleteUserAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { password } = req.body;
    const userId = req.user?.userId;

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password is required to delete account',
      });
      return;
    }

    // Verify password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
      return;
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
    });
  }
};