/**
 * Validates if a value is a positive number.
 * 
 * @param {string | number} value - The value to validate. Can be a string or a number.
 * @param {string} fieldName - The name of the field being validated, used in the error message.
 * 
 * @returns {null | { message: string }} Returns `null` if valid, or an error message object if invalid.
 *    The error message will indicate that the value must be a numeric and positive value.
 */
export const validatePositiveNumber = (
  value: string | number,
  fieldName: string
): null | { message: string; } => {
  const numValue = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numValue) || numValue < 0) {
    return {
      message: `Invalid input: '${fieldName}' must be numeric and positive value.`,
    };
  }
  return null;
};

/**
 * Validates an email address.
 * 
 * @param {string} email - The email address to validate.
 * 
 * @returns {null | { message: string }} Returns `null` if valid, or an error message object if invalid.
 *    The error message will indicate if the email is required or invalid.
 */
export const validateEmail = (email: string): null | { message: string; } => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { message: "Email is required" };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { message: "Invalid email address" };
  }

  return null;
};

/**
 * Validates a password.
 * 
 * @param {string} password - The password to validate.
 * 
 * @returns {null | { message: string }} Returns `null` if valid, or an error message object if invalid.
 *    The error message will indicate if the password is required or if it is too short.
 */
export const validatePassword = (password: string): null | { message: string; } => {
  const trimmedPassword = password.trim();
  if (!trimmedPassword) {
    return { message: "Password is required" };
  }

  if (trimmedPassword.length < 8) {
    return { message: "Password must be at least 8 characters long" };
  }
  return null;
};

import { Response } from "express";

/**
 * A utility function to handle errors related to database queries.
 * It logs the error to the console and sends a standardized error response
 * to the client with the specified HTTP status code.
 *
 * @param {Error} error - The error object representing the database-related error.
 * @param {Response} res - The Express response object used to send the error response to the client.
 * @param {number} statusCode - The HTTP status code to send in the response (e.g., 500 for internal server error).
 *
 * @returns {void} This function does not return any value. It sends a response directly to the client.
 */
export const handleDatabaseError = (error: Error, res: Response, statusCode: number): void => {
  
  // Log the error message to the console for debugging purposes
  console.error(error);
  
  // Send the specified status code with a generic error message to the client
  res.status(statusCode).json({ message: "An unknown error occurred" });
};
