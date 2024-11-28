import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {User} from '../models/userModel';

/**
 * Secret key for JSON Web Tokens.
 * @type {string}
 */
export const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Expiration time for JSON Web Tokens.
 * @type {string}
 */
export const JWT_EXPIRATION: string = '1h';

/**
 * Generates a JSON Web Token for the given user ID.
 * @param {string} userId - The ID of the user.
 * @param {string} role - The role of the user (e.g, "user", "admin").
 * @returns {string} The generated JSON Web Token.
 */
export const generateToken = (userId: string, role: string): string => {
    return jwt.sign({userId, role}, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
}

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
export const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
}

/**
 * Compares a password with a hashed password using bcrypt.
 * @param {string} password - The password to compare.
 * @param {string} hashedPassword - The hashed password to compare with.
 * @returns {boolean} True if the password matches the hashed password, false otherwise.
 */
export const comparePassword = (password: string, hashedPassword: string): boolean => {
    return bcrypt.compareSync(password, hashedPassword)
}

/**
 * Logs in a user with the given email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string>} The JSON Web Token for the logged-in user.
 * @throws {Error} If the email or password is invalid.
 */
export const login = async (email:string, password: string): Promise<string>=> {
    const user = await User.findOne({email});
    if(!user || !comparePassword(password, user.password)){
        throw new Error('Invalid credentials');
    }
    return generateToken(user._id.toString(), user.role)
}

/**
 * Registers a new user with the given email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string>} The JSON Web Token for the registered user.
 * @throws {Error} If a user with the given email already exists.
 */
export const register = async (email:string, password: string): Promise<string> => {
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error('User already exists');
    }
    const hashedPassword = hashPassword(password);
    const user = await User.create({email, password: hashedPassword});
    return generateToken(user._id.toString(), user.role);
}