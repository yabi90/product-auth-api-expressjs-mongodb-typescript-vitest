import { describe, it, expect, vi } from 'vitest';
import { handleDatabaseError } from '../../src/utils'; // Adjust the import path
import { Response } from 'express';

describe('handleDatabaseError', () => {

  it('should log the error to the console', () => {
    // Mock the console.error method
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Create a mock error object
    const error = new Error('Database connection failed');
    
    // Call the function with mock error and mock response
    const mockRes = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    handleDatabaseError(error, mockRes, 500);

    // Check if console.error was called with the correct error message
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);

    // Clean up the spy
    consoleErrorSpy.mockRestore();
  });

  it('should send a response with the correct status code and message', () => {
    // Create a mock error object
    const error = new Error('Database connection failed');
    
    // Mock the Response object
    const mockRes = { 
      status: vi.fn().mockReturnThis(), 
      json: vi.fn() 
    } as unknown as Response;

    // Call the function with the mock error and response
    handleDatabaseError(error, mockRes, 500);

    // Check if the status code was set correctly
    expect(mockRes.status).toHaveBeenCalledWith(500);

    // Check if the response body was sent with the correct message
    expect(mockRes.json).toHaveBeenCalledWith({ message: "An unknown error occurred" });
  });

  it('should handle different status codes', () => {
    // Create a mock error object
    const error = new Error('Database query failed');
    
    // Mock the Response object
    const mockRes = { 
      status: vi.fn().mockReturnThis(), 
      json: vi.fn() 
    } as unknown as Response;

    // Test with 400 status code (Bad Request)
    handleDatabaseError(error, mockRes, 400);
    expect(mockRes.status).toHaveBeenCalledWith(400);

    // Test with 404 status code (Not Found)
    handleDatabaseError(error, mockRes, 404);
    expect(mockRes.status).toHaveBeenCalledWith(404);

    // Test with 500 status code (Internal Server Error)
    handleDatabaseError(error, mockRes, 500);
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

});
