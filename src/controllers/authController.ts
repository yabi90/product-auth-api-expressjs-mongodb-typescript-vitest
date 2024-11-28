import { Request, Response } from 'express';
import { register, login } from '../services/auth';

/**
 * Handles user registration.
 * 
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {Error} If registration fails.
 */
export const userRegister = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await register(email, password);
    res.status(201).json({ token });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    console.error(errorMessage);
    res.status(400).json({ message: errorMessage });
  }
};

/**
 * Handles user login.
 * 
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {Error} If login fails.
 */
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    console.error(errorMessage);
    res.status(400).json({ message: errorMessage });
  }
};