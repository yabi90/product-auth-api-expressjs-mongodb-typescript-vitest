import express from 'express';
import { userLogin, userRegister } from '../controllers/authController';
import { validateEmailPassword } from '../middlewares/authMiddleware';

export const authRouter = express.Router();

authRouter.post('/register',validateEmailPassword, userRegister )

authRouter.post('/login',validateEmailPassword, userLogin)