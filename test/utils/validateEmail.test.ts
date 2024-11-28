import { describe, expect, it } from 'vitest';
import { validateEmail } from '../../src/utils';

describe('validateEmail', () => {

  it('should return null for a valid email address', () => {
    const result = validateEmail('test@example.com');
    expect(result).toBeNull();
  });

  it('should return an error message if the email is required (empty string)', () => {
    const result = validateEmail('');
    expect(result).toEqual({ message: 'Email is required' });
  });

  it('should return an error message if the email is required (email with spaces)', () => {
    const result = validateEmail('   ');
    expect(result).toEqual({ message: 'Email is required' });
  });

  it('should return an error message for an invalid email address without "@" symbol', () => {
    const result = validateEmail('invalid-email.com');
    expect(result).toEqual({ message: 'Invalid email address' });
  });

  it('should return an error message for an email without domain', () => {
    const result = validateEmail('test@');
    expect(result).toEqual({ message: 'Invalid email address' });
  });

  it('should return an error message for an email without a valid domain extension', () => {
    const result = validateEmail('test@example');
    expect(result).toEqual({ message: 'Invalid email address' });
  });

  it('should return an error message for an email with multiple "@" symbols', () => {
    const result = validateEmail('test@@example.com');
    expect(result).toEqual({ message: 'Invalid email address' });
  });

  it('should return an error message for an email with invalid characters', () => {
    const result = validateEmail('test@exa!mple.com');
    expect(result).toEqual({ message: 'Invalid email address' });
  });

  it('should return null for an email with valid characters but upper case letters', () => {
    const result = validateEmail('Test@Example.com');
    expect(result).toBeNull();
  });

  it('should handle email addresses with leading/trailing spaces and validate correctly', () => {
    const result = validateEmail('  test@example.com  ');
    expect(result).toBeNull();
  });

  it('should return an error message for an email with too short a domain extension', () => {
    const result = validateEmail('test@example.c');
    expect(result).toEqual({ message: 'Invalid email address' });
  });

  it('should handle email with a valid domain but only one letter for the TLD', () => {
    const result = validateEmail('test@a.com');
    expect(result).toBeNull();
  });

});
