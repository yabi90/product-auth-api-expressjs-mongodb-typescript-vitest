import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../services/auth";
import { validateEmail, validatePassword } from "../utils/index";

// Extend the Request type to include a user property
interface AuthenticatedRequest extends Request {
  user?: any; // Adjust the type of 'user' to match your decoded token structure
}

/**
 * Middleware to authenticate requests by verifying the JWT token.
 *
 * This middleware checks if a valid JWT token is provided in the `Authorization` header.
 * If the token is valid, the decoded token data is attached to the `req.user` property,
 * and the request proceeds to the next middleware. If the token is missing or invalid,
 * an error response with status 401 (Unauthorized) is sent.
 *
 * @param {AuthenticatedRequest} req - The request object, extended with a `user` property on successful authentication.
 * @param {Response} res - The response object used to send an error message if authentication fails.
 * @param {NextFunction} next - The next middleware function to call if authentication succeeds.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
  if (!token) {
    res.status(401).json({
      message: "Access denied, No token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error(error instanceof Error && error.message); // Log the error for debugging purposes

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired." });
      return;
    }

    res.status(401).json({ message: "Invalid token." });
    return;
  }
};

/**
 * Middleware to authorize requests based on the user's role.
 *
 * This middleware checks if the authenticated user has the required role. It is typically
 * used to restrict access to certain routes depending on the user's role (e.g., admin, user).
 *
 * @param {string} role - The required role that the user must have in order to access the route.
 *
 * @throws {Error} If the user does not have the required role, a 403 Forbidden error is returned.
 */
export const authorize = (role: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userRole = req.user?.role; // Get role from the JWT payload
    if (userRole !== role) {
        res.status(403).json({ message: "Forbidden. You do not have access." });
        return;
    }
    next(); // User has the correct role, proceed to the next middleware
  };
};

/**
 * Middleware to validate the email and password provided in the request body.
 *
 * This middleware checks that the email and password in the request body meet the
 * specified validation criteria. If the email or password is invalid, an error response
 * with status 400 (Bad Request) is sent. If both are valid, the request proceeds to the next middleware.
 *
 * @param {Request} req - The request object, which should contain `email` and `password` in its body.
 * @param {Response} res - The response object used to send validation error messages.
 * @param {NextFunction} next - The next middleware function to call if both email and password are valid.
 */
export const validateEmailPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // Validate email
  const emailError = validateEmail(email);
  if (emailError) {
    res.status(400).json({ message: emailError.message });
    return;
  }

  // Validate password
  const passwordError = validatePassword(password);
  if (passwordError) {
    res.status(400).json({ message: passwordError.message });
    return;
  }

  next(); // Both email and password are valid
};
