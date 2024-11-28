import { describe, expect, it } from 'vitest';
import { validatePositiveNumber } from '../../src/utils';

describe('validatePositiveNumber', () => {
  it('returns null for positive price', () => {
    expect(validatePositiveNumber(10.99, 'price')).toBeNull();
    expect(validatePositiveNumber('10.99', 'price')).toBeNull();
  });

  it('returns error for non-numeric price', () => {
    const result = validatePositiveNumber('abc', 'price');
    expect(result).not.toBeNull();
    expect(result).toEqual({
      message: "Invalid input: 'price' must be numeric and positive value.",
    });
  });

  it('returns error for negative price', () => {
    const result = validatePositiveNumber(-10.99, 'price');
    expect(result).not.toBeNull();
    expect(result).toEqual({
      message: "Invalid input: 'price' must be numeric and positive value.",
    });
  });

  it('returns null for zero price', () => {
    const result = validatePositiveNumber(0, 'price');
    expect(result).toBeNull();
  });

  it('returns null for positive quantity', () => {
    expect(validatePositiveNumber(10, 'quantity')).toBeNull();
    expect(validatePositiveNumber('10', 'quantity')).toBeNull();
  });

  it('returns error for non-numeric quantity', () => {
    const result = validatePositiveNumber('abc', 'quantity');
    expect(result).not.toBeNull();
    expect(result).toEqual({
      message: "Invalid input: 'quantity' must be numeric and positive value.",
    });
  });

  it('returns error for negative quantity', () => {
    const result = validatePositiveNumber(-10, 'quantity');
    expect(result).not.toBeNull();
    expect(result).toEqual({
      message: "Invalid input: 'quantity' must be numeric and positive value.",
    });
  });

  it('returns error for zero quantity', () => {
    const result = validatePositiveNumber(0, 'quantity');
    expect(result).toBeNull();
  });
});