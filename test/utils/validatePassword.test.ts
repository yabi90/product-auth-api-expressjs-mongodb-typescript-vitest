import { describe, it, expect } from 'vitest';
import { validatePassword } from '../../src/utils';

describe('validatePassword', () => {

  it('should return null for a valid password', () => {
    const result = validatePassword('validPassword123');
    expect(result).toBeNull();
  });

  it('should return an error message if the password is required (empty string)', () => {
    const result = validatePassword('');
    expect(result).toEqual({ message: 'Password is required' });
  });

  it('should return an error message if the password is required (password with spaces)', () => {
    const result = validatePassword('   ');
    expect(result).toEqual({ message: 'Password is required' });
  });

  it('should return an error message for a password that is too short (less than 8 characters)', () => {
    const result = validatePassword('short');
    expect(result).toEqual({ message: 'Password must be at least 8 characters long' });
  });

  it('should return null for a password that is exactly 8 characters long', () => {
    const result = validatePassword('12345678');
    expect(result).toBeNull();
  });

  it('should return null for a password longer than 8 characters', () => {
    const result = validatePassword('longerPassword123');
    expect(result).toBeNull();
  });

  it('should handle a password with leading/trailing spaces and validate correctly', () => {
    const result = validatePassword('   validPassword123   ');
    expect(result).toBeNull();
  });

  it('should return an error message if the password is too short (7 characters)', () => {
    const result = validatePassword('abcdefg');
    expect(result).toEqual({ message: 'Password must be at least 8 characters long' });
  });

  it('should return an error message if the password is only 1 character long', () => {
    const result = validatePassword('a');
    expect(result).toEqual({ message: 'Password must be at least 8 characters long' });
  });

});
