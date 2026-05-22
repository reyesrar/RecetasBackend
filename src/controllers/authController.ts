import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { UserResponse } from '../types';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
      return;
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      res.status(400).json({
        success: false,
        message: nameValidation.message,
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
      return;
    }

    // Check if email already exists (case-insensitive)
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists', // provicional
        field: 'email',
      });
      return;
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    // Prepare response
    const userResponse: UserResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists', // provicional
        field: 'email',
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
      return;
    }

    // Find user with password field (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    // Prepare response
    const userResponse: UserResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};